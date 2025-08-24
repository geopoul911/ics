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
    path('api/site_admin/', include('webapp.site_administration.site_admin_urls')),
]
