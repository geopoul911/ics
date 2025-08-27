from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

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

    # Administration
    path('api/administration/', include('webapp.administration.urls')),


    # Regions
    path('api/regions/', include('webapp.regions.urls')),

    # Data Management
    path('api/data_management/', include('webapp.data_management.urls')),

    # Dashboard
    path('api/dashboard/', include('webapp.dashboard.urls')),

]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
