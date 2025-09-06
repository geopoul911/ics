# webapp/signals.py
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import Client, Document, Project, ProjectTask, TaskComment
from .notification_utils import (
    send_notifications_for_project,
    send_notifications_for_task,
    send_notifications_for_task_comment,
)

User = get_user_model()

@receiver(post_delete, sender=Client)
def purge_orphan_documents_after_client_delete(sender, instance, **kwargs):
    # Remove docs that now have neither client nor project
    Document.objects.filter(client__isnull=True, project__isnull=True).delete()


# ---------------------- Notifications helpers ----------------------
def _get_supervisors():
    try:
        return list(User.objects.filter(role='S'))
    except Exception:
        return []

def _safe_user(obj):
    if not obj:
        return None
    try:
        # If already a user instance (our custom Consultant), return it
        if isinstance(obj, User):
            return obj
    except Exception:
        pass
    # Common fallbacks when relations point to a wrapper
    return getattr(obj, 'user', None) or getattr(obj, 'consultant', None)

def _notify_many(users, ntype, message, related_project=None, related_task=None):
    uniq = set()
    for u in users:
        if not u or not getattr(u, 'id', None):
            continue
        key = f"{u.id}:{ntype}:{getattr(related_project,'project_id',None)}:{getattr(related_task,'projtask_id',None)}:{message}"
        if key in uniq:
            continue
        uniq.add(key)
        Notification.objects.create(
            user=u,
            type=ntype,
            message=message[:300],
            related_project=related_project,
            related_task=related_task,
        )

def _without_actor(users, actor_user):
    return [u for u in users if u and getattr(u, 'id', None) != getattr(actor_user, 'id', None)]


# ---------------------- Project notifications ----------------------
@receiver(post_save, sender=Project)
def notify_project_changes(sender, instance: Project, created, **kwargs):
    send_notifications_for_project(instance, created=created, actor=None)


# ---------------------- Task notifications ----------------------
@receiver(post_save, sender=ProjectTask)
def notify_task_changes(sender, instance: ProjectTask, created, **kwargs):
    send_notifications_for_task(instance, created=created, actor=None)


# ---------------------- Task comment notifications ----------------------
@receiver(post_save, sender=TaskComment)
def notify_task_comment(sender, instance: TaskComment, created, **kwargs):
    if not created:
        return
    send_notifications_for_task_comment(instance, actor=None)
