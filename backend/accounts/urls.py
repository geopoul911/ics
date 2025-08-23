from django.urls import path
from accounts import views

urlpatterns = [

    # Login URL
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),

    # Check access status is used in combination with django-axes
    path('check_access_status/', views.CheckAccessStatus.as_view(), name='check_access_status'),
]
