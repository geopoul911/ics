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
from webapp.models import History

from ipware.ip import get_client_ip


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


whitelisted_ips = ['localhost']

# On successful login attempt, token is returned to user
class LoginView(ObtainAuthToken):
    serializer_class = LoginSerializer

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request):
        serializer = self.serializer_class(data=request.data, context={'request': request})

        # If validation fails, raise error and write attempt to database.
        if not serializer.is_valid():
            History.objects.create(
                user=None,
                model_name='AUT',
                action='VIE',
                description=f'User {serializer.data["username"]} has failed to log in',
                ip_address=str(get_ip(request)),
            )

            # if ip is whitelisted, update axes_access_attempt
            if get_ip(request) in whitelisted_ips:
                from django.db import connection
                cursor = connection.cursor()

                # By setting failures_since_start to 0, We prevent the user to be blocked
                cursor.execute(
                    "update axes_accessattempt set failures_since_start = 0 where ip_address = '" +
                    str(get_ip(request)) + "'"
                )
            else:
                return Response(status=400, data={'failed_wl': True})

        # Get user
        try:
            user = serializer.validated_data['user']
            # If user does not have a token, create one.
            token, created = Token.objects.get_or_create(user=user)
        except KeyError:
            return Response(status=400)

        # Write successful attempt to db
        History.objects.create(
            user=user,
            model_name='AUT',
            action='VIE',
            description=f'User {user.username} has logged in',
            ip_address=str(get_ip(request)),
        )

        return Response({
            'user': UserSerializer(user).data,
            'token': token.key,
            'logged_in': True
        })


# This class is only used to store the time of logout on db
class LogoutView(generics.ListAPIView):

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request):
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        History.objects.create(
            user=user,
            model_name='AUT',
            action='VIE',
            description=f'User {user.username} has logged out'
        )

        return Response(status=200)


class CheckAccessStatus(generics.ListAPIView):
    """
    Loads when login component is mounted.
    This class lets front end know if the IP is allowed to make login attempts
    And how many attempts this IP is allowed to make.
    """
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
            'is_blocked': is_blocked,
            'attempts_remaining': attempts_remaining,
        })
