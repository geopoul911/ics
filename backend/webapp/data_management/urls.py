from django.urls import path
from webapp.data_management import views as views

urlpatterns = [
    # Documents
    path('all_documents/', views.AllDocuments.as_view()),
    path("document/<str:document_id>/", views.DocumentView.as_view(), name="document-detail"),
    
    # Reference data for documents
    path('all_projects/', views.AllProjects.as_view()),
    path('all_clients/', views.AllClientsReference.as_view()),
    
    # Projects
    path('projects/', views.AllProjectsCRUD.as_view()),
    path("project/<str:project_id>/", views.ProjectView.as_view(), name="project-detail"),
    
    # Associated Clients
    path('associated_clients/', views.AllAssociatedClients.as_view()),
    path("associated_client/<str:assoclient_id>/", views.AssociatedClientView.as_view(), name="associated-client-detail"),
    
    # Task Comments
    path('task_comments/', views.AllTaskComments.as_view()),
    path("task_comment/<str:taskcomm_id>/", views.TaskCommentView.as_view(), name="task-comment-detail"),
    
    # Project Tasks
    path('project_tasks/', views.AllProjectTasks.as_view()),
    path("project_task/<str:projtask_id>/", views.ProjectTaskView.as_view(), name="project-task-detail"),
    
    # Clients
    path('clients/', views.AllClients.as_view()),
    path("client/<str:client_id>/", views.ClientView.as_view(), name="client-detail"),
    
    # Client Contacts
    path('client_contacts/', views.AllClientContacts.as_view()),
    path("client_contact/<str:clientcont_id>/", views.ClientContactView.as_view(), name="client-contact-detail"),

    # Bank Client Accounts
    path('bank_client_accounts/', views.AllBankClientAccounts.as_view()),
    path('all_bank_client_accounts/', views.AllBankClientAccountsReference.as_view()),
    path("bank_client_account/<str:bankclientacco_id>/", views.BankClientAccountView.as_view(), name="bank-client-account-detail"),

    # Bank Project Accounts
    path('bank_project_accounts/', views.AllBankProjectAccounts.as_view()),
    path("bank_project_account/<str:bankprojacco_id>/", views.BankProjectAccountView.as_view(), name="bank-project-account-detail"),

    # Properties
    path('all_properties/', views.AllProperties.as_view()),
    path("property/<str:property_id>/", views.PropertyView.as_view(), name="property-detail"),

    # Cash
    path('cash/', views.AllCash.as_view()),
    path("cash/<str:cash_id>/", views.CashView.as_view(), name="cash-detail"),

    # Professionals
    path('professionals/', views.AllProfessionals.as_view()),
    path("professional/<str:professional_id>/", views.ProfessionalView.as_view(), name="professional-detail"),
    path('all_professionals/', views.AllProfessionalsReference.as_view()),
    
    # Taxation Projects
    path('taxation_projects/', views.AllTaxationProjects.as_view()),
    path("taxation_project/<str:taxproj_id>/", views.TaxationProjectView.as_view(), name="taxation-project-detail"),
    
]
