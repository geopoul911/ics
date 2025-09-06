from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from webapp.permissions import RoleBasedPermission
from rest_framework.response import Response
from django.db.models import Count, Sum, Q
from django.utils import timezone
from datetime import datetime, timedelta, date
from webapp.models import Client, Project, Document, ProjectTask, Cash, TaxationProject, AssociatedClient

@api_view(['GET'])
@permission_classes([IsAuthenticated, RoleBasedPermission])
def dashboard_stats(request):
    """Get dashboard statistics"""
    try:
        # Get current date and calculate date ranges
        now = timezone.now()
        today = now.date()
        last_month = today - timedelta(days=30)
        
        # Basic counts
        total_clients = Client.objects.count()
        total_projects = Project.objects.count()
        total_documents = Document.objects.count()
        
        # Active projects (status = 'active' or 'in_progress')
        active_projects = Project.objects.filter(
            status__in=['Created', 'Assigned', 'Inprogress']
        ).count()
        
        # Overdue tasks
        overdue_tasks = ProjectTask.objects.filter(
            deadline__lt=today
        ).exclude(status='Completed').count()
        
        # Calculate total revenue from Cash model
        total_revenue = Cash.objects.aggregate(total=Sum('amountpay'))['total'] or 0
        
        # Calculate revenue for last month
        last_month_revenue = Cash.objects.filter(
            trandate__gte=last_month
        ).aggregate(total=Sum('amountpay'))['total'] or 0
        
        # Calculate percentage change
        if total_revenue > 0 and last_month_revenue > 0:
            revenue_change = ((total_revenue - last_month_revenue) / last_month_revenue) * 100
        else:
            revenue_change = 0
        
        stats = {
            'totalClients': total_clients,
            'totalProjects': total_projects,
            'totalDocuments': total_documents,
            'totalRevenue': float(total_revenue),
            'activeProjects': active_projects,
            'overdueTasks': overdue_tasks,
            'revenueChange': round(revenue_change, 1)
        }
        
        return Response({
            'success': True,
            'data': stats
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated, RoleBasedPermission])
def revenue_trend(request):
    """Get revenue trend data for the last 6 months"""
    try:
        now = timezone.now()
        today = now.date()
        months = []
        revenue_data = []
        projected_data = []

        # Build last 6 month windows
        current_month_start = today.replace(day=1)
        for i in range(5, -1, -1):
            # Approximate month by subtracting i months using 30-day steps
            month_start = current_month_start - timedelta(days=30 * i)
            # Next month start approximation
            next_month_start = month_start + timedelta(days=32)
            next_month_start = next_month_start.replace(day=1)
            month_end = next_month_start - timedelta(days=1)

            month_revenue = Cash.objects.filter(
                trandate__gte=month_start,
                trandate__lte=month_end
            ).aggregate(total=Sum('amountpay'))['total'] or 0

            months.append(month_start.strftime('%b'))
            revenue_data.append(float(month_revenue))

            projected = month_revenue * 1.1 if month_revenue and month_revenue > 0 else 10000
            projected_data.append(float(projected))
        
        return Response({
            'success': True,
            'data': {
                'labels': months,
                'revenue': revenue_data,
                'projected': projected_data
            }
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated, RoleBasedPermission])
def project_status(request):
    """Get project status distribution"""
    try:
        # Get project status counts
        status_counts = Project.objects.values('status').annotate(
            count=Count('id')
        ).order_by('status')
        
        labels = []
        values = []
        
        # Map status code to display label
        status_map = dict(Project.STATUS_CHOICES)
        for item in status_counts:
            code = item['status']
            status_name = status_map.get(code, code)
            labels.append(status_name)
            values.append(item['count'])
        
        return Response({
            'success': True,
            'data': {
                'labels': labels,
                'values': values
            }
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated, RoleBasedPermission])
def task_completion(request):
    """Get task completion data for the last 4 weeks"""
    try:
        now = timezone.now()
        labels = []
        completed_data = []
        in_progress_data = []
        overdue_data = []
        
        for i in range(4, 0, -1):
            week_end = now.date() - timedelta(weeks=4 - i)
            week_start = week_end - timedelta(days=7)

            completed = ProjectTask.objects.filter(
                status='Completed',
                completiondate__gte=week_start,
                completiondate__lt=week_end
            ).count()

            in_progress = ProjectTask.objects.filter(
                status='Inprogress',
                assigndate__gte=week_start,
                assigndate__lt=week_end
            ).count()

            overdue = ProjectTask.objects.filter(
                deadline__lt=now.date()
            ).exclude(status='Completed').filter(
                deadline__gte=week_start,
                deadline__lt=week_end
            ).count()

            labels.append(f'Week {i}')
            completed_data.append(completed)
            in_progress_data.append(in_progress)
            overdue_data.append(overdue)
        
        # Reverse to show oldest to newest
        labels.reverse()
        completed_data.reverse()
        in_progress_data.reverse()
        overdue_data.reverse()
        
        return Response({
            'success': True,
            'data': {
                'labels': labels,
                'completed': completed_data,
                'inProgress': in_progress_data,
                'overdue': overdue_data
            }
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated, RoleBasedPermission])
def recent_activities(request):
    """Get recent activities"""
    try:
        # Get recent projects
        recent_projects = Project.objects.order_by('-registrationdate')[:3]
        activities = []
        
        for project in recent_projects:
            activities.append({
                'id': f'project_{project.project_id}',
                'type': 'project',
                'action': 'Project created',
                'description': f'New project "{project.title}" was created',
                'user': project.registrationuser or 'System',
                'timestamp': project.registrationdate.isoformat(),
                'priority': 'normal'
            })
        
        # Get recent documents
        recent_documents = Document.objects.order_by('-created')[:2]
        for doc in recent_documents:
            activities.append({
                'id': f'doc_{doc.document_id}',
                'type': 'document',
                'action': 'Document uploaded',
                'description': f'New document "{doc.title}" was uploaded',
                'user': 'System',
                'timestamp': doc.created.isoformat(),
                'priority': 'normal'
            })
        
        # Get overdue tasks as alerts
        overdue_tasks = ProjectTask.objects.filter(
            deadline__lt=timezone.now().date()
        ).exclude(status='Completed')[:2]
        
        for task in overdue_tasks:
            days_overdue = (timezone.now().date() - task.deadline).days
            activities.append({
                'id': f'task_{task.projtask_id}',
                'type': 'alert',
                'action': 'Overdue task',
                'description': f'Task "{task.title}" is overdue by {days_overdue} days',
                'user': 'System',
                'timestamp': task.deadline.isoformat(),
                'priority': 'high'
            })
        
        # Sort by timestamp (newest first)
        activities.sort(key=lambda x: x['timestamp'], reverse=True)
        
        return Response({
            'success': True,
            'data': activities[:10]  # Return top 10 activities
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated, RoleBasedPermission])
def top_clients(request):
    """Get top clients by revenue"""
    try:
        # Compute per-client revenue from Cash for projects associated with the client
        results = []
        for client in Client.objects.all():
            # Collect distinct project ids associated with this client
            project_ids = list(
                AssociatedClient.objects.filter(client=client)
                .values_list('project__project_id', flat=True)
                .distinct()
            )

            if not project_ids:
                continue

            # Sum payments for those projects
            total_revenue = Cash.objects.filter(project__project_id__in=project_ids).aggregate(
                total=Sum('amountpay')
            )['total'] or 0

            project_count = len(project_ids)

            results.append({
                'id': client.client_id,
                'name': f"{client.surname} {client.name}",
                'revenue': float(total_revenue),
                'projects': project_count,
                'status': 'active' if client.active else 'inactive',
                'rank': 0
            })

        results.sort(key=lambda x: x['revenue'], reverse=True)
        for i, item in enumerate(results[:5]):
            item['rank'] = i + 1

        return Response({
            'success': True,
            'data': results[:5]
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated, RoleBasedPermission])
def overdue_items(request):
    """Get overdue tasks and projects"""
    try:
        now = timezone.now()
        overdue_items = []
        
        # Get overdue tasks
        overdue_tasks = ProjectTask.objects.filter(
            deadline__lt=now.date()
        ).exclude(status='Completed').select_related('project', 'assignee')
        
        for task in overdue_tasks:
            days_overdue = (now.date() - task.deadline).days
            overdue_items.append({
                'id': f'task_{task.projtask_id}',
                'type': 'task',
                'title': task.title,
                'project': task.project.title if task.project else 'No Project',
                'dueDate': task.deadline.isoformat(),
                'daysOverdue': days_overdue,
                'priority': task.get_priority_display() if hasattr(task, 'get_priority_display') else task.priority,
                'assignee': str(task.assignee) if task.assignee else 'Unassigned'
            })
        
        # Get overdue projects
        overdue_projects = Project.objects.filter(
            deadline__lt=now.date(),
            status__in=['Created', 'Assigned', 'Inprogress']
        )
        
        for project in overdue_projects:
            days_overdue = (now.date() - project.deadline).days
            overdue_items.append({
                'id': f'project_{project.project_id}',
                'type': 'project',
                'title': project.title,
                'project': project.title,
                'dueDate': project.deadline.isoformat(),
                'daysOverdue': days_overdue,
                'priority': 'medium',
                'assignee': str(project.consultant) if project.consultant else 'Unassigned'
            })
        
        # Sort by days overdue (most overdue first)
        overdue_items.sort(key=lambda x: x['daysOverdue'], reverse=True)
        
        return Response({
            'success': True,
            'data': overdue_items[:10]  # Return top 10 overdue items
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=500)
