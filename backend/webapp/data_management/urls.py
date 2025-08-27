from django.urls import path
from webapp.data_management import views as views

urlpatterns = [
    # Documents
    path('all_documents/', views.AllDocuments.as_view()),
    path("document/<str:document_id>/", views.DocumentView.as_view(), name="document-detail"),
    
    # Reference data for documents
    path('all_projects/', views.AllProjects.as_view()),
    path('all_clients/', views.AllClientsReference.as_view()),
    
    # Clients
    path('clients/', views.AllClients.as_view()),
    path("client/<str:client_id>/", views.ClientView.as_view(), name="client-detail"),
]
