from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count, Sum, Q
from django.utils import timezone
from datetime import datetime, timedelta
from webapp.models import Client, Project, Document, ProjectTask, Cash, TaxationProject
import calendar

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """Get dashboard statistics"""
    try:
        # Get current date and calculate date ranges
        now = timezone.now()
        last_month = now - timedelta(days=30)
        
        # Basic counts
        total_clients = Client.objects.count()
        total_projects = Project.objects.count()
        total_documents = Document.objects.count()
        
        # Active projects (status = 'active' or 'in_progress')
        active_projects = Project.objects.filter(
            status__in=['active', 'in_progress']
        ).count()
        
        # Overdue tasks
        overdue_tasks = ProjectTask.objects.filter(
            due_date__lt=now.date(),
            status__in=['pending', 'in_progress']
        ).count()
        
        # Calculate total revenue from Cash model
        total_revenue = Cash.objects.filter(
            transaction_type='income'
        ).aggregate(
            total=Sum('amount')
        )['total'] or 0
        
        # Calculate revenue for last month
        last_month_revenue = Cash.objects.filter(
            transaction_type='income',
            date__gte=last_month
        ).aggregate(
            total=Sum('amount')
        )['total'] or 0
        
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
@permission_classes([IsAuthenticated])
def revenue_trend(request):
    """Get revenue trend data for the last 6 months"""
    try:
        now = timezone.now()
        months = []
        revenue_data = []
        projected_data = []
        
        for i in range(6):
            # Calculate month start and end
            month_start = now.replace(day=1) - timedelta(days=30*i)
            month_end = (month_start + timedelta(days=32)).replace(day=1) - timedelta(days=1)
            
            # Get revenue for this month
            month_revenue = Cash.objects.filter(
                transaction_type='income',
                date__gte=month_start,
                date__lte=month_end
            ).aggregate(
                total=Sum('amount')
            )['total'] or 0
            
            months.append(month_start.strftime('%b'))
            revenue_data.append(float(month_revenue))
            
            # Simple projection (10% growth)
            projected = month_revenue * 1.1 if month_revenue > 0 else 10000
            projected_data.append(float(projected))
        
        # Reverse to show oldest to newest
        months.reverse()
        revenue_data.reverse()
        projected_data.reverse()
        
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
@permission_classes([IsAuthenticated])
def project_status(request):
    """Get project status distribution"""
    try:
        # Get project status counts
        status_counts = Project.objects.values('status').annotate(
            count=Count('id')
        ).order_by('status')
        
        labels = []
        values = []
        
        for status in status_counts:
            status_name = status['status'].replace('_', ' ').title()
            labels.append(status_name)
            values.append(status['count'])
        
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
@permission_classes([IsAuthenticated])
def task_completion(request):
    """Get task completion data for the last 4 weeks"""
    try:
        now = timezone.now()
        labels = []
        completed_data = []
        in_progress_data = []
        overdue_data = []
        
        for i in range(4):
            # Calculate week start and end
            week_start = now - timedelta(weeks=i+1)
            week_end = week_start + timedelta(days=7)
            
            # Get task counts for this week
            completed = ProjectTask.objects.filter(
                status='completed',
                updated_at__gte=week_start,
                updated_at__lt=week_end
            ).count()
            
            in_progress = ProjectTask.objects.filter(
                status='in_progress',
                updated_at__gte=week_start,
                updated_at__lt=week_end
            ).count()
            
            overdue = ProjectTask.objects.filter(
                due_date__lt=now.date(),
                status__in=['pending', 'in_progress'],
                updated_at__gte=week_start,
                updated_at__lt=week_end
            ).count()
            
            labels.append(f'Week {4-i}')
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
@permission_classes([IsAuthenticated])
def recent_activities(request):
    """Get recent activities"""
    try:
        # Get recent projects
        recent_projects = Project.objects.order_by('-created_at')[:3]
        activities = []
        
        for project in recent_projects:
            activities.append({
                'id': f'project_{project.id}',
                'type': 'project',
                'action': 'Project created',
                'description': f'New project "{project.name}" was created',
                'user': project.created_by.get_full_name() if project.created_by else 'System',
                'timestamp': project.created_at.isoformat(),
                'priority': 'normal'
            })
        
        # Get recent documents
        recent_documents = Document.objects.order_by('-created_at')[:2]
        for doc in recent_documents:
            activities.append({
                'id': f'doc_{doc.id}',
                'type': 'document',
                'action': 'Document uploaded',
                'description': f'New document "{doc.title}" was uploaded',
                'user': doc.uploaded_by.get_full_name() if doc.uploaded_by else 'System',
                'timestamp': doc.created_at.isoformat(),
                'priority': 'normal'
            })
        
        # Get overdue tasks as alerts
        overdue_tasks = ProjectTask.objects.filter(
            due_date__lt=timezone.now().date(),
            status__in=['pending', 'in_progress']
        )[:2]
        
        for task in overdue_tasks:
            days_overdue = (timezone.now().date() - task.due_date).days
            activities.append({
                'id': f'task_{task.id}',
                'type': 'alert',
                'action': 'Overdue task',
                'description': f'Task "{task.title}" is overdue by {days_overdue} days',
                'user': 'System',
                'timestamp': task.due_date.isoformat(),
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
@permission_classes([IsAuthenticated])
def top_clients(request):
    """Get top clients by revenue"""
    try:
        # Get clients with their total revenue
        clients_with_revenue = []
        
        for client in Client.objects.all():
            # Calculate total revenue from projects
            total_revenue = Project.objects.filter(
                client=client
            ).aggregate(
                total=Sum('budget')
            )['total'] or 0
            
            # Count projects
            project_count = Project.objects.filter(client=client).count()
            
            if total_revenue > 0:
                clients_with_revenue.append({
                    'id': client.id,
                    'name': client.name,
                    'revenue': float(total_revenue),
                    'projects': project_count,
                    'status': client.status,
                    'rank': 0  # Will be set below
                })
        
        # Sort by revenue and assign ranks
        clients_with_revenue.sort(key=lambda x: x['revenue'], reverse=True)
        for i, client in enumerate(clients_with_revenue[:5]):  # Top 5
            client['rank'] = i + 1
        
        return Response({
            'success': True,
            'data': clients_with_revenue[:5]
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def overdue_items(request):
    """Get overdue tasks and projects"""
    try:
        now = timezone.now()
        overdue_items = []
        
        # Get overdue tasks
        overdue_tasks = ProjectTask.objects.filter(
            due_date__lt=now.date(),
            status__in=['pending', 'in_progress']
        ).select_related('project', 'assigned_to')
        
        for task in overdue_tasks:
            days_overdue = (now.date() - task.due_date).days
            overdue_items.append({
                'id': f'task_{task.id}',
                'type': 'task',
                'title': task.title,
                'project': task.project.name if task.project else 'No Project',
                'dueDate': task.due_date.isoformat(),
                'daysOverdue': days_overdue,
                'priority': task.priority,
                'assignee': task.assigned_to.get_full_name() if task.assigned_to else 'Unassigned'
            })
        
        # Get overdue projects
        overdue_projects = Project.objects.filter(
            end_date__lt=now.date(),
            status__in=['active', 'in_progress']
        )
        
        for project in overdue_projects:
            days_overdue = (now.date() - project.end_date).days
            overdue_items.append({
                'id': f'project_{project.id}',
                'type': 'project',
                'title': project.name,
                'project': project.name,
                'dueDate': project.end_date.isoformat(),
                'daysOverdue': days_overdue,
                'priority': 'medium',
                'assignee': project.manager.get_full_name() if project.manager else 'Unassigned'
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
