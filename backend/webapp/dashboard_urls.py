from django.urls import path
from . import dashboard_views

app_name = 'dashboard'

urlpatterns = [
    # Dashboard statistics
    path('api/dashboard/stats/', dashboard_views.dashboard_stats, name='dashboard_stats'),
    
    # Chart data endpoints
    path('api/dashboard/revenue-trend/', dashboard_views.revenue_trend, name='revenue_trend'),
    path('api/dashboard/project-status/', dashboard_views.project_status, name='project_status'),
    path('api/dashboard/task-completion/', dashboard_views.task_completion, name='task_completion'),
    
    # Dashboard components data
    path('api/dashboard/recent-activities/', dashboard_views.recent_activities, name='recent_activities'),
    path('api/dashboard/top-clients/', dashboard_views.top_clients, name='top_clients'),
    path('api/dashboard/overdue-items/', dashboard_views.overdue_items, name='overdue_items'),
]
