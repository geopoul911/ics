from django.conf import settings
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, get_user_model

from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework import generics, status

from axes.models import AccessAttempt
from axes.utils import reset as axes_reset
from axes.decorators import axes_dispatch
from axes.utils import reset as axes_reset

from accounts.serializers import LoginSerializer, UserSerializer
# from webapp.models import History

User = get_user_model()

# ----- Helpers -----

def get_request_ip(request):
    """
    Returns best-guess client IP as a plain string.
    """
    # Check for forwarded IP first
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0].strip()
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip or "unknown"

WHITELISTED_IPS = {"localhost", "127.0.0.1", "::1"}

def get_user_from_token(token_str):
    try:
        return Token.objects.get(key=token_str).user
    except Token.DoesNotExist:
        return None

def _attempts_for_ip(ip: str) -> int:
    """
    Current consecutive failure count for this IP in axes.
    Returns 0 if no record exists.
    """
    try:
        # failures_since_start is cumulative for a given identity tuple; use latest row for this IP
        attempt = AccessAttempt.objects.filter(ip_address=ip).latest("id")
        return attempt.failures_since_start or 0
    except AccessAttempt.DoesNotExist:
        return 0


# ----- Views -----

@method_decorator(csrf_exempt, name="dispatch")
class LoginView(ObtainAuthToken):
    """
    Authenticates via username/password (DRF ObtainAuthToken style) and returns:
      - user (serialized)
      - token
      - logged_in = True

    On failed login:
      - Writes to History
      - If IP is whitelisted, resets Axes counters for that IP (prevents lockout)
      - Otherwise returns 400 with `failed_wl=True`
    """
    serializer_class = LoginSerializer
    # If you're only using token login, you can keep auth/permission classes empty here:
    authentication_classes = []
    permission_classes = []

    def post(self, request, *args, **kwargs):
        ip = get_request_ip(request)
        username = (request.data.get("username") or "").strip() or "(unknown)"

        serializer = self.serializer_class(data=request.data, context={"request": request})
        if not serializer.is_valid():
            # Track failed attempt with Axes - let the middleware handle it
            # The AxesMiddleware will automatically track failed attempts
            
            # History.objects.create(
            #     user=None,
            #     model_name="AUT",
            #     action="VIE",
            #     description=f"User {username} has failed to log in",
            #     ip_address=str(ip),
            # )

            # If IP is whitelisted, clear Axes counters and allow more attempts
            if ip in WHITELISTED_IPS:
                axes_reset(ip=ip)  # official, no raw SQL
                # still return a 400 invalid credentials (frontend can show message & allow retry)
                return Response(
                    {"detail": "Invalid credentials", "failed_wl": False},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            else:
                # tell frontend it's a non-whitelisted failure; they can show the lockout countdown UI
                return Response(
                    {"detail": "Invalid credentials", "failed_wl": True},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        # Valid credentials -> get user and token
        user = serializer.validated_data["user"]
        token, _ = Token.objects.get_or_create(user=user)

        # Reset failed attempts on successful login
        axes_reset(ip=ip)

        # History.objects.create(
        #     user=user,
        #     model_name="AUT",
        #     action="VIE",
        #     description=f"User {user.username} has logged in",
        #     ip_address=str(ip),
        # )

        return Response(
            {
                "user": UserSerializer(user, context={"request": request}).data,
                "token": token.key,
                "logged_in": True,
            },
            status=status.HTTP_200_OK,
        )


@method_decorator(csrf_exempt, name="dispatch")
class LogoutView(generics.GenericAPIView):
    """
    Only logs the logout event. (You could also delete the token here if you like.)
    """

    authentication_classes = []  # if you want to require auth, plug TokenAuthentication here
    permission_classes = []

    def post(self, request, *args, **kwargs):
        # Prefer Authorization: Token <key> if present; fall back to your custom header
        auth_header = request.headers.get("Authorization", "")
        token_str = None
        if auth_header.lower().startswith("token "):
            token_str = auth_header.split(" ", 1)[1].strip()
        if not token_str:
            token_str = request.headers.get("User-Token", "")

        user = get_user_from_token(token_str)
        if not user:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        # History.objects.create(
        #     user=user,
        #     model_name="AUT",
        #     action="VIE",
        #     description=f"User {user.username} has logged out",
        #     ip_address=str(get_request_ip(request)),
        # )

        # Optional: actually invalidate the token
        # Token.objects.filter(key=token_str).delete()

        return Response(status=status.HTTP_200_OK)


@method_decorator(csrf_exempt, name="dispatch")
class CheckAccessStatus(generics.GenericAPIView):
    """
    Called when the login component mounts.
    Reports whether the requesting IP is blocked and the attempts remaining.
    """
    authentication_classes = []
    permission_classes = []

    def get(self, request, *args, **kwargs):
        ip = get_request_ip(request)
        limit = getattr(settings, "AXES_FAILURE_LIMIT", 5)

        # If whitelisted, never blocked and full attempts remaining
        if ip in WHITELISTED_IPS:
            return Response(
                {"isBlocked": False, "attempts_remaining": limit},
                status=status.HTTP_200_OK,
            )

        failures = _attempts_for_ip(ip)
        is_blocked = failures >= limit
        attempts_remaining = max(limit - failures, 0)
        print("!!")

        return Response(
            {"isBlocked": is_blocked, "attempts_remaining": attempts_remaining},
            status=status.HTTP_200_OK,
        )
