from django.urls import path
from . import views

app_name = 'dashboard'

urlpatterns = [
    # Dashboard statistics
    path('stats/', views.dashboard_stats, name='dashboard_stats'),
    
    # Chart data endpoints
    path('revenue-trend/', views.revenue_trend, name='revenue_trend'),
    path('project-status/', views.project_status, name='project_status'),
    path('task-completion/', views.task_completion, name='task_completion'),
    
    # Dashboard components data
    path('recent-activities/', views.recent_activities, name='recent_activities'),
    path('top-clients/', views.top_clients, name='top_clients'),
    path('overdue-items/', views.overdue_items, name='overdue_items'),
]
