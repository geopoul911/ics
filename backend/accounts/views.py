from django.contrib.auth import authenticate, get_user_model
# ----- Helpers -----
from accounts.serializers import (
    LoginSerializer,
    UserSerializer,
)
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from axes.models import AccessAttempt
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from accounts.models import AuditEvent

from ipware.ip import get_client_ip
User = get_user_model()

# get user object from token
def get_user(token):
    user = Token.objects.get(key=token).user
    return user


# Get Client's IP from request.
def get_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = get_client_ip(request)[0]
    return ip


#  Whitelisted IPs will be the Cosmoplan's IPs on Athens and London offices
whitelisted_ips = []


# On successful login attempt, token is returned to user
class LoginView(ObtainAuthToken):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request):
        serializer = self.serializer_class(data=request.data, context={'request': request})

        # If validation fails, raise error and write attempt to database.
        if not serializer.is_valid():
            from django.db import connection

            client_ip = get_ip(request)
            cursor = connection.cursor()

            if client_ip in whitelisted_ips:
                # reset failures for whitelisted IPs
                cursor.execute(
                    """
                    UPDATE axes_accessattempt
                    SET failures_since_start = 0
                    WHERE ip_address = %s
                    """,
                    [client_ip],
                )
            else:
                # Explicit audit for failed login
                try:
                    AuditEvent.objects.create(
                        actor=None,
                        action=AuditEvent.Action.LOGIN_FAILED,
                        ip_address=get_ip(request),
                        user_agent=request.META.get('HTTP_USER_AGENT'),
                        success=False,
                        message=f"Failed login for username/email: {request.data.get('username', '')}",
                        metadata={"credentials": {"username": request.data.get('username', '')}},
                    )
                except Exception:
                    pass
                return Response(status=400, data={'failed_wl': True})

        # Get user
        try:
            user = serializer.validated_data['user']
            # If user does not have a token, create one.
            token, created = Token.objects.get_or_create(user=user)
        except KeyError:
            return Response(status=400)

        # Audit successful login (token-based)
        try:
            AuditEvent.objects.create(
                actor=user,
                action=AuditEvent.Action.LOGIN,
                ip_address=get_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT'),
                success=True,
                message="User logged in",
            )
        except Exception:
            pass

        return Response({
            'user': UserSerializer(user).data,
            'consultant_id': user.consultant_id,
            'token': token.key,
            'logged_in': True
        })
        # Note: return above; audit after preparing payload



# This class is only used to store the time of logout on db
class LogoutView(generics.ListAPIView):

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request):
        try:
            user = request.user if getattr(request, 'user', None) and request.user.is_authenticated else None
            AuditEvent.objects.create(
                actor=user,
                action=AuditEvent.Action.LOGOUT,
                ip_address=get_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT'),
                success=True,
                message="User logged out",
            )
        except Exception as e:
            pass
        return Response(status=200)


class CheckAccessStatus(generics.ListAPIView):
    """
    Loads when login component is mounted.
    This class lets front end know if the IP is allowed to make login attempts
    And how many attempts this IP is allowed to make.
    """
    permission_classes = [AllowAny]
    authentication_classes = []
    # Cross-Site Request Forgery
    @csrf_exempt
    def get(self, request):
        is_blocked = False

        # Get the ip
        if 'HTTP_X_FORWARDED_FOR' in request.META:
            x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = get_client_ip(request)[0]

        # Get all attempts
        all_access_attempts = AccessAttempt.objects.all()

        # Get blocked ips
        blocked_ips = [i.ip_address for i in set(all_access_attempts.filter(failures_since_start__gt=2))]

        # Validation
        # if IP is in blacklist and also not in whitelist, we block it.
        if ip in blocked_ips and ip not in whitelisted_ips:
            is_blocked = True

        # We need this error handling in case IP does not exist in DB
        try:
            if ip not in whitelisted_ips:
                attempts_remaining = 5 - AccessAttempt.objects.filter(
                    ip_address=ip
                ).latest('failures_since_start').failures_since_start
            else:
                attempts_remaining = 5
        except AccessAttempt.DoesNotExist:
            attempts_remaining = 5

        return Response({
            'isBlocked': is_blocked,
            'attempts_remaining': attempts_remaining,
        })
