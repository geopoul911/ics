from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from ..models import Notification
from axes.models import AccessAttempt


@api_view(["GET"])
@authentication_classes([TokenAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
def list_notifications(request):
    show_all = request.query_params.get('all') == '1'
    qs = Notification.objects.filter(user=request.user)
    if not show_all:
        qs = qs.filter(read=False)
    qs = qs.order_by('-created_at')[:50]
    data = []
    for n in qs:
        data.append({
            'id': n.id,
            'type': n.type,
            'message': n.message,
            'read': n.read,
            'created_at': n.created_at.isoformat(),
            'related_project': getattr(n.related_project, 'project_id', None),
            'related_task': getattr(n.related_task, 'projtask_id', None),
        })
    return Response({'notifications': data})


@api_view(["POST"])
@authentication_classes([TokenAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
def mark_read(request):
    nid = request.data.get('id') or request.query_params.get('id')
    try:
        nid = int(nid)
    except Exception:
        return Response({"detail": "id required"}, status=status.HTTP_400_BAD_REQUEST)
    Notification.objects.filter(id=nid, user=request.user).update(read=True)
    return Response({'ok': True})


@api_view(["POST"])
@authentication_classes([TokenAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
def mark_all_read(request):
    Notification.objects.filter(user=request.user, read=False).update(read=True)
    return Response({'ok': True})


@api_view(["POST"])
@authentication_classes([TokenAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
def unblock_user(request):
    """Administrative endpoint to clear failed attempts for a username.
    Only superusers can use this.
    """
    if not request.user.is_superuser:
        return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)
    username = request.data.get('username') or request.query_params.get('username')
    if not username:
        return Response({"detail": "username required"}, status=status.HTTP_400_BAD_REQUEST)
    try:
        AccessAttempt.objects.filter(username=username).delete()
        return Response({'ok': True})
    except Exception as e:
        return Response({'ok': False, 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@authentication_classes([TokenAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
def delete_notification(request):
    nid = request.data.get('id') or request.query_params.get('id')
    try:
        nid = int(nid)
    except Exception:
        return Response({"detail": "id required"}, status=status.HTTP_400_BAD_REQUEST)
    # Only allow delete by the owner; you can add role checks if needed
    Notification.objects.filter(id=nid, user=request.user).delete()
    return Response({'ok': True})