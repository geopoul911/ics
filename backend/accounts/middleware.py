# app: auditlog/middleware.py
import threading
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
_local = threading.local()

def get_current_user():
    return getattr(_local, "user", None)

class AuditUserMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        _local.user = self._resolve_user(request)
        try:
            return self.get_response(request)
        finally:
            _local.user = None

    def _resolve_user(self, request):
        try:
            user = getattr(request, 'user', None)
            if user is not None and getattr(user, 'is_authenticated', False):
                return user
        except Exception:
            pass

        # Fallback: resolve via Token authentication header
        try:
            auth = request.META.get('HTTP_AUTHORIZATION') or request.headers.get('Authorization')
            if not auth:
                return None
            parts = auth.split()
            if len(parts) == 2 and parts[0].lower() == 'token':
                token_key = parts[1]
                token = Token.objects.select_related('user').filter(key=token_key).first()
                return getattr(token, 'user', None)
        except Exception:
            return None
        return None
