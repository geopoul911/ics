from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from .models import Notification

User = get_user_model()


def _get_supervisors():
    try:
        return list(User.objects.filter(role='S'))
    except Exception:
        return []


def _safe_user(obj):
    if not obj:
        return None
    try:
        if isinstance(obj, User):
            return obj
    except Exception:
        pass
    return getattr(obj, 'user', None) or getattr(obj, 'consultant', None)


def _get_pk(user_obj):
    if not user_obj:
        return None
    for attr in ('pk', 'id', 'consultant_id'):
        try:
            val = getattr(user_obj, attr)
            if val is not None:
                return val
        except Exception:
            continue
    return None


def _without_actor(users, actor_user):
    actor_pk = _get_pk(actor_user)
    filtered = []
    for u in users:
        upk = _get_pk(u)
        if upk is None:
            continue
        if actor_pk is not None and upk == actor_pk:
            continue
        filtered.append(u)
    return filtered


def _notify_many(users, ntype, message, related_project=None, related_task=None):
    window_start = timezone.now() - timedelta(seconds=30)
    for u in users:
        if not u or _get_pk(u) is None:
            continue
        # de-dup: skip if an identical notification very recently exists
        exists = Notification.objects.filter(
            user=u,
            type=ntype,
            message=message[:300],
            related_project=related_project,
            related_task=related_task,
            created_at__gte=window_start,
        ).exists()
        if exists:
            continue
        Notification.objects.create(
            user=u,
            type=ntype,
            message=message[:300],
            related_project=related_project,
            related_task=related_task,
        )


def send_notifications_for_project(project, created=False, actor=None):
    consultant_user = _safe_user(getattr(project, 'consultant', None))
    supervisors = _get_supervisors()
    recipients = _without_actor([consultant_user] + supervisors, actor)
    if created:
        _notify_many(recipients, 'task_updated', f"Project {project.project_id} created", related_project=project)
    else:
        _notify_many(recipients, 'task_updated', f"Project {project.project_id} updated: status={project.status}", related_project=project)


def send_notifications_for_task(task, created=False, actor=None):
    project = getattr(task, 'project', None)
    consultant_user = _safe_user(getattr(project, 'consultant', None))
    assigner_user = _safe_user(getattr(task, 'assigner', None))
    assignee_user = _safe_user(getattr(task, 'assignee', None))
    supervisors = _get_supervisors()
    # unique recipients by pk
    unique = []
    seen = set()
    for u in [assigner_user, assignee_user, consultant_user] + supervisors:
        pk = _get_pk(u)
        if pk and pk not in seen:
            seen.add(pk)
            unique.append(u)
    recipients = _without_actor(unique, actor)
    if created:
        _notify_many(recipients, 'task_assigned', f"Task {task.projtask_id} created", related_project=project, related_task=task)
    else:
        ntype = 'task_updated'
        if getattr(task, 'status', None) == 'Completed':
            ntype = 'task_completed'
        _notify_many(recipients, ntype, f"Task {task.projtask_id} updated: status={task.status}", related_project=project, related_task=task)


def send_notifications_for_task_comment(comment, actor=None):
    task = getattr(comment, 'projtask', None)
    project = getattr(task, 'project', None)
    consultant_user = _safe_user(getattr(project, 'consultant', None))
    assigner_user = _safe_user(getattr(task, 'assigner', None))
    assignee_user = _safe_user(getattr(task, 'assignee', None))
    recipients = _without_actor([assigner_user, assignee_user, consultant_user], actor or _safe_user(getattr(comment, 'consultant', None)))
    _notify_many(recipients, 'task_updated', f"New comment on task {getattr(task,'projtask_id','')}", related_project=project, related_task=task)


