from django.contrib import admin
from django.urls import path, include

"""
*** First Level URLS ***
This file includes all of the project's urls
"""

urlpatterns = [

    # Accounts
    path('admin/', admin.site.urls),
    path('api/user/', include('accounts.urls')),

    # Core
    path('api/view/', include('webapp.urls')),

    # Site Administration
    path('api/site_admin/', include('webapp.administration.urls')),


    # Regions
    path('api/regions/', include('webapp.regions.urls')),

    # Data Management
    path('api/data_management/', include('webapp.data_management.urls')),

    # Dashboard
    path('api/dashboard/', include('webapp.dashboard.urls')),

]
