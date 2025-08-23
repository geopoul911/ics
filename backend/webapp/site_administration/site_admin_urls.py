# from django.urls import path, re_path
# from webapp.site_administration import site_admin_views as site_admin_views
# from webapp.site_administration import site_admin_xhr as site_admin_xhr

urlpatterns = []

# urlpatterns = [

#     # # # Site Administration

#     # Views
#     path('access_history/', site_admin_views.AccessHistory.as_view()),
#     path('conflicts/', site_admin_views.Conflicts.as_view()),
#     path('incomplete_data/', site_admin_views.IncompleteData.as_view()),
#     path('logs/', site_admin_views.Logs.as_view()),
#     path('all_users/', site_admin_views.AllUsers.as_view()),
#     re_path(r'user/(?P<user_id>.*)$', site_admin_views.UserView.as_view()),
#     path('permissions/', site_admin_views.Permissions.as_view()),
#     path('nas_folders/', site_admin_views.NasFolders.as_view(), name='nas_folders'),
#     path('nas_folders/download/', site_admin_views.NasFoldersDownload.as_view(), name='nas_folders_download'),

#     # XHR

#     # All users
#     re_path(r'add_user', site_admin_xhr.AddUser.as_view()),

#     # NAS Folders
#     path('add_nas_folder/', site_admin_xhr.AddNasFolder.as_view()),
#     path('update_nas_folder/', site_admin_xhr.UpdateNasFolder.as_view()),
#     path('delete_nas_folder/', site_admin_xhr.DeleteNasFolder.as_view()),
#     path('sync_nas_folder/', site_admin_xhr.SyncNasFolder.as_view()),

#     # # Overview
#     re_path(r'change_username', site_admin_xhr.ChangeUsername.as_view()),
#     re_path(r'change_first_name', site_admin_xhr.ChangeFirstName.as_view()),
#     re_path(r'change_last_name', site_admin_xhr.ChangeLastName.as_view()),
#     re_path(r'change_email', site_admin_xhr.ChangeEmail.as_view()),
#     re_path(r'change_is_enabled', site_admin_xhr.ChangeIsEnabled.as_view()),
#     re_path(r'change_is_staff', site_admin_xhr.ChangeIsStaff.as_view()),
#     re_path(r'change_is_spr_usr', site_admin_xhr.ChangeIsSuperuser.as_view()),
#     re_path(r'change_phone_number', site_admin_xhr.ChangePhoneNumber.as_view()),
#     re_path(r'change_user_nationality', site_admin_xhr.ChangeUserNationality.as_view()),
#     re_path(r'change_address', site_admin_xhr.ChangeAddress.as_view()),
#     re_path(r'change_zip_code', site_admin_xhr.ChangeZipCode.as_view()),
#     re_path(r'change_signature', site_admin_xhr.ChangeSignature.as_view()),
#     re_path(r'change_secondary_email', site_admin_xhr.ChangeSecondaryEmail.as_view()),
#     re_path(r'change_secondary_signature', site_admin_xhr.ChangeSecondarySignature.as_view()),
#     re_path(r'change_password', site_admin_xhr.ChangePassword.as_view()),
#     re_path(r'del_usr', site_admin_xhr.DeleteUser.as_view()),


#     # Access History
#     path('remove_lock/', site_admin_xhr.UnlockUser.as_view()),

#     # Conflicts
#     path('validate_conflict/', site_admin_xhr.ValidateConflict.as_view()),

#     # Permissions
#     path('change_permission/', site_admin_xhr.ChangePermission.as_view()),
#     path('handle_all_permissions/', site_admin_xhr.HandleAllPermissions.as_view()),

# ]
