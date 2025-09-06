# app: auditlog/signals.py
from django.contrib.auth import get_user_model
from django.contrib.auth.signals import user_logged_in, user_logged_out, user_login_failed
from django.db.models.signals import post_save, pre_delete, pre_save
from django.dispatch import receiver
from django.contrib.contenttypes.models import ContentType
from accounts.middleware import get_current_user

from .models import AuditEvent

User = get_user_model()

def _request_meta(request):
    if not request:
        return {}
    return {
        "ip_address": request.META.get("REMOTE_ADDR") or request.META.get("HTTP_X_FORWARDED_FOR"),
        "user_agent": request.META.get("HTTP_USER_AGENT"),
    }

# --- Auth events ---

@receiver(user_logged_in)
def _on_login(sender, request, user, **kwargs):
    meta = _request_meta(request)
    AuditEvent.objects.create(
        actor=user,
        action=AuditEvent.Action.LOGIN,
        ip_address=meta.get("ip_address"),
        user_agent=meta.get("user_agent"),
        success=True,
        message="User logged in",
    )

@receiver(user_logged_out)
def _on_logout(sender, request, user, **kwargs):
    meta = _request_meta(request)
    AuditEvent.objects.create(
        actor=user,
        action=AuditEvent.Action.LOGOUT,
        ip_address=meta.get("ip_address"),
        user_agent=meta.get("user_agent"),
        success=True,
        message="User logged out",
    )

@receiver(user_login_failed)
def _on_login_failed(sender, credentials, request, **kwargs):
    meta = _request_meta(request)
    AuditEvent.objects.create(
        actor=None,  # unknown user at this point
        action=AuditEvent.Action.LOGIN_FAILED,
        ip_address=meta.get("ip_address"),
        user_agent=meta.get("user_agent"),
        success=False,
        message=f"Failed login for username/email: {credentials.get('username')}",
        metadata={"credentials": {"username": credentials.get("username")}},
    )

# --- CRUD on arbitrary models ---

def _is_excluded(sender):
    try:
        app_label = getattr(getattr(sender, '_meta', None), 'app_label', None)
        name = getattr(sender, '__name__', None)
        if app_label == 'axes' or name == 'AccessAttempt':
            return True
    except Exception:
        pass
    return False


def _audit_create_or_update(instance, created, using, update_fields=None, **kwargs):
    # skip auditing AuditEvent itself to avoid recursion
    from .models import AuditEvent as _AE
    if isinstance(instance, _AE):
        return

    # Skip excluded apps/models (e.g., axes.AccessAttempt)
    if _is_excluded(instance.__class__):
        return

    ct = ContentType.objects.get_for_model(instance.__class__)
    action = AuditEvent.Action.CREATE if created else AuditEvent.Action.UPDATE

    # capture field-level changes (old/new)
    changes = {}
    try:
        prev = getattr(instance, "_audit_prev", None)
        if not created and prev is not None:
            for field in instance._meta.concrete_fields:
                fname = getattr(field, 'attname', field.name)
                try:
                    old_val = getattr(prev, fname)
                    new_val = getattr(instance, fname)
                except Exception:
                    continue
                if old_val != new_val:
                    # stringify to ensure JSON serializable
                    try:
                        o = old_val.isoformat() if hasattr(old_val, 'isoformat') else old_val
                        n = new_val.isoformat() if hasattr(new_val, 'isoformat') else new_val
                    except Exception:
                        o, n = str(old_val), str(new_val)
                    changes[fname] = {"old": o, "new": n}
        elif created:
            # on create, log initial values as new
            for field in instance._meta.concrete_fields:
                fname = getattr(field, 'attname', field.name)
                try:
                    val = getattr(instance, fname)
                except Exception:
                    continue
                if val not in (None, ""):
                    v = val.isoformat() if hasattr(val, 'isoformat') else val
                    changes[fname] = {"old": None, "new": v}
    except Exception:
        changes = changes or {}

    AuditEvent.objects.using(using).create(
        actor=get_current_user(),
        action=action,
        target_content_type=ct,
        target_object_id=str(instance.pk),
        success=True,
        message=f"{instance.__class__.__name__} {action}",
        metadata={
            "update_fields": list(update_fields) if update_fields else None,
            "changes": changes or None
        },
    )

@receiver(post_save)
def _on_post_save(sender, instance, created, using, update_fields, **kwargs):
    # Skip excluded apps like django-axes
    if _is_excluded(sender):
        return
    _audit_create_or_update(instance, created, using, update_fields=update_fields)


@receiver(pre_save)
def _on_pre_save(sender, instance, using, **kwargs):
    """Capture previous state for diff logging before save."""
    if _is_excluded(sender):
        return
    try:
        if getattr(instance, 'pk', None):
            prev = sender.objects.using(using).get(pk=instance.pk)
            setattr(instance, '_audit_prev', prev)
    except Exception:
        pass

@receiver(pre_delete)
def _on_pre_delete(sender, instance, using, **kwargs):
    from .models import AuditEvent as _AE
    if isinstance(instance, _AE):
        return

    ct = ContentType.objects.get_for_model(instance.__class__)
    AuditEvent.objects.using(using).create(
        actor=get_current_user(),
        action=AuditEvent.Action.DELETE,
        target_content_type=ct,
        target_object_id=str(instance.pk),
        success=True,
        message=f"{instance.__class__.__name__} deleted",
    )
