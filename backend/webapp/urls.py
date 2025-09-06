from django.urls import path
# from webapp import xhr
from webapp import create
from .views import notifications as notif_views


urlpatterns = [
    # # # # Create
    path('add_country/', create.AddCountry.as_view()),
    path('add_city/', create.AddCity.as_view()),
    path('add_province/', create.AddProvince.as_view()),
    # Notifications API
    path('notifications/', notif_views.list_notifications),
    path('notifications/mark_read/', notif_views.mark_read),
    path('notifications/mark_all_read/', notif_views.mark_all_read),
    path('notifications/unblock_user/', notif_views.unblock_user),
    path('notifications/delete/', notif_views.delete_notification),
]
