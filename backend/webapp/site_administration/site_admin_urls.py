from django.urls import path, re_path
from webapp.site_administration import site_admin_views as site_admin_views
from webapp.site_administration import site_admin_xhr as site_admin_xhr


urlpatterns = [

    # # # Site Administration

    # Views
    path('access_history/', site_admin_views.AccessHistory.as_view()),
    path('logs/', site_admin_views.Logs.as_view()),
    path('all_users/', site_admin_views.AllUsers.as_view()),
    re_path(r'user/(?P<user_id>.*)$', site_admin_views.UserView.as_view()),

    # XHR

    # All users
    re_path(r'add_user', site_admin_xhr.AddUser.as_view()),

    # # Overview
    re_path(r'change_username', site_admin_xhr.ChangeUsername.as_view()),
    re_path(r'change_first_name', site_admin_xhr.ChangeFirstName.as_view()),
    re_path(r'change_last_name', site_admin_xhr.ChangeLastName.as_view()),
    re_path(r'change_email', site_admin_xhr.ChangeEmail.as_view()),
    re_path(r'change_is_enabled', site_admin_xhr.ChangeIsEnabled.as_view()),
    re_path(r'change_is_staff', site_admin_xhr.ChangeIsStaff.as_view()),
    re_path(r'change_is_spr_usr', site_admin_xhr.ChangeIsSuperuser.as_view()),
    re_path(r'change_password', site_admin_xhr.ChangePassword.as_view()),
    re_path(r'del_usr', site_admin_xhr.DeleteUser.as_view()),

    # Access History
    path('remove_lock/', site_admin_xhr.UnlockUser.as_view()),

    # Regions
    path('all_regions/', site_admin_views.AllRegions.as_view()),
    re_path(r'region/(?P<rtype>continent|country|state|city|area)/(?P<region_id>.+)$', site_admin_views.RegionView.as_view()),

]
