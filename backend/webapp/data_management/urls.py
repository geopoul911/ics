from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    # Reference Data Viewsets
    BankViewSet, InsuranceCarrierViewSet,
    
    # Client Viewsets
    ClientViewSet, BankClientAccountViewSet,
    
    # Consultant Viewsets
    ConsultantViewSet,
    
    # Project Viewsets
    ProjectCategoryViewSet, ProjectViewSet, AssociatedClientViewSet,
    
    # Document Viewsets
    DocumentViewSet,
    
    # Professional Viewsets
    ProfessionViewSet, ProfessionalViewSet, ClientContactViewSet,
    
    # Property Viewsets
    PropertyViewSet, BankProjectAccountViewSet,
    
    # Task Viewsets
    TaskCategoryViewSet, ProjectTaskViewSet, TaskCommentViewSet,
    
    # Cash and Taxation Viewsets
    CashViewSet, TaxationProjectViewSet,
    
    # Notification Viewset
    NotificationViewSet,
    
    # Reference Viewsets for dropdowns
    BankReferenceViewSet, ConsultantReferenceViewSet, ProjectCategoryReferenceViewSet,
    TaskCategoryReferenceViewSet, ProfessionReferenceViewSet, ProfessionalReferenceViewSet,
    InsuranceCarrierReferenceViewSet
)

# Create routers for different API sections
router = DefaultRouter()

# Reference Data
router.register(r'banks', BankViewSet)
router.register(r'insurance-carriers', InsuranceCarrierViewSet)

# Client Management
router.register(r'clients', ClientViewSet)
router.register(r'bank-client-accounts', BankClientAccountViewSet)

# Consultant Management
router.register(r'consultants', ConsultantViewSet)

# Project Management
router.register(r'project-categories', ProjectCategoryViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'associated-clients', AssociatedClientViewSet)

# Document Management
router.register(r'documents', DocumentViewSet)

# Professional Management
router.register(r'professions', ProfessionViewSet)
router.register(r'professionals', ProfessionalViewSet)
router.register(r'client-contacts', ClientContactViewSet)

# Property Management
router.register(r'properties', PropertyViewSet)
router.register(r'bank-project-accounts', BankProjectAccountViewSet)

# Task Management
router.register(r'task-categories', TaskCategoryViewSet)
router.register(r'project-tasks', ProjectTaskViewSet)
router.register(r'task-comments', TaskCommentViewSet)

# Cash and Taxation Management
router.register(r'cash', CashViewSet)
router.register(r'taxation-projects', TaxationProjectViewSet)

# Notification Management
router.register(r'notifications', NotificationViewSet)

# Reference Data for dropdowns (read-only) - using different basenames to avoid conflicts
router.register(r'reference/banks', BankReferenceViewSet, basename='reference-banks')
router.register(r'reference/consultants', ConsultantReferenceViewSet, basename='reference-consultants')
router.register(r'reference/project-categories', ProjectCategoryReferenceViewSet, basename='reference-project-categories')
router.register(r'reference/task-categories', TaskCategoryReferenceViewSet, basename='reference-task-categories')
router.register(r'reference/professions', ProfessionReferenceViewSet, basename='reference-professions')
router.register(r'reference/professionals', ProfessionalReferenceViewSet, basename='reference-professionals')
router.register(r'reference/insurance-carriers', InsuranceCarrierReferenceViewSet, basename='reference-insurance-carriers')

# URL patterns
urlpatterns = [
    # Main API endpoints
    path('', include(router.urls)),
    
    # Additional custom endpoints
    path('clients/search/', ClientViewSet.as_view({'get': 'search'}), name='client-search'),
    path('clients/statistics/', ClientViewSet.as_view({'get': 'statistics'}), name='client-statistics'),
    path('projects/search/', ProjectViewSet.as_view({'get': 'search'}), name='project-search'),
    path('projects/statistics/', ProjectViewSet.as_view({'get': 'statistics'}), name='project-statistics'),
    path('documents/expired/', DocumentViewSet.as_view({'get': 'expired'}), name='documents-expired'),
    path('documents/expiring-soon/', DocumentViewSet.as_view({'get': 'expiring_soon'}), name='documents-expiring-soon'),
    path('project-tasks/overdue/', ProjectTaskViewSet.as_view({'get': 'overdue'}), name='tasks-overdue'),
    path('project-tasks/my-tasks/', ProjectTaskViewSet.as_view({'get': 'my_tasks'}), name='my-tasks'),
    path('project-tasks/statistics/', ProjectTaskViewSet.as_view({'get': 'statistics'}), name='task-statistics'),
    path('cash/statistics/', CashViewSet.as_view({'get': 'statistics'}), name='cash-statistics'),
    path('taxation-projects/overdue/', TaxationProjectViewSet.as_view({'get': 'overdue'}), name='taxation-overdue'),
    path('notifications/unread/', NotificationViewSet.as_view({'get': 'unread'}), name='notifications-unread'),
    path('notifications/<int:pk>/mark-as-read/', NotificationViewSet.as_view({'post': 'mark_as_read'}), name='notification-mark-read'),
]

# API documentation and schema (commented out for now)
# from rest_framework.documentation import include_docs_urls
# from rest_framework.schemas import get_schema_view

# urlpatterns += [
#     path('docs/', include_docs_urls(title='Data Management API')),
#     path('schema/', get_schema_view(
#         title='Data Management API',
#         description='API for managing client data, projects, tasks, and related entities',
#         version='1.0.0'
#     ), name='openapi-schema'),
# ]
