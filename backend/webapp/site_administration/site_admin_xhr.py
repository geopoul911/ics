# # from django.shortcuts import render
# from webapp.models import (
#     GroupTransfer,
#     TravelDay,
#     User,
#     Country,
#     History,
#     NasFolder,
# )
# from django.db.models import ProtectedError
# from django.views.decorators.csrf import csrf_exempt
# from rest_framework import generics
# from rest_framework.response import Response
# from accounts.serializers import (UserSerializer,)
# from accounts.permissions import (
#     can_update,
#     can_delete,
#     is_staff,
#     can_create,
#     is_superuser,
#     can_view,
# )
# from django.http import HttpResponse
# from rest_framework import status
# from accounts.views import get_user
# from accounts.models import UserProfile, UserPermissions
# from rest_framework.views import APIView
# import datetime

# from webapp.xhr import update_notifications

# # Permissions reversed
# permissions_full_text_reverse = {
#     'View': 'VIE',
#     'Create': 'CRE',
#     'Update': 'UPD',
#     'Delete': 'DEL',
# }


# """
#     # All users
#     AddUser

#     # Overview
#     ChangeUsername
#     ChangeFirstName
#     ChangeLastName
#     ChangeEmail
#     ChangeIsEnabled
#     ChangeIsStaff
#     ChangeIsSuperuser
#     ChangePhoneNumber
#     ChangeUserNationality
#     ChangeAddress
#     ChangeZipCode
#     ChangeSignature
#     ChangePassword
# """

# # Permissions
# permissions_full_text = {
#     'VIE': 'View',
#     'CRE': 'Create',
#     'UPD': 'Update',
#     'DEL': 'Delete',
# }

# ACTION_NAMES = {
#     'VIE': 'View',
#     'CRE': 'Create',
#     'UPD': 'Update',
#     'DEL': 'Delete',
# }

# MODEL_CHOICES = {
#     'AC': 'Aircrafts',
#     'GT': 'GroupTransfer',
#     'CH': 'Car Hire Company',
#     'AD': 'Advertisement Company',
#     'CB': 'Charter Brokers',
#     'AGN': 'Agent',
#     'AL': 'Airline',
#     'OFF': 'Offer',
#     'AP': 'Airport',
#     'ATT': 'Attraction',
#     'CLN': 'Client',
#     'CNT': 'Contract',
#     'COP': 'Coach Operator',
#     'CO': 'Coach',
#     'CC': 'Cruising Company',
#     'DRV': 'Driver',
#     'DMC': 'DMC',
#     'GL': 'Group Leader',
#     'GD': 'Guide',
#     'HTL': 'Hotel',
#     'PLC': 'Place',
#     'PRT': 'Port',
#     'RS': 'Railway Station',
#     'RSH': 'Repair Shop',
#     'RTP': 'Repair Type',
#     'RST': 'Restaurant',
#     'SRV': 'Service',
#     'FTA': 'Ferry Ticket Agency',
#     'TC': 'Teleferik Company',
#     'TH': 'Theater',
#     'TTA': 'Train Ticket Agency',
#     'TT': 'Text Template',
#     'SES': 'Sport Event Supplier',
#     'AUT': 'Authentication',
#     'USR': 'User',
#     'HSR': 'History',
#     'PKG': 'Parking Lot',
#     "COA": "COA",
#     "COL": "COL",
#     'PRO': "Proforma",
#     "ES": "Entertainment Supplier",
#     "NAS": "NAS Folders",
# }


# # All models
# models_full_text = {
#     'GT': 'GroupTransfer',
#     'AGN': 'Agent',
#     'AL': 'Airline',
#     'OFF': 'Offer',
#     'AP': 'Airport',
#     'ATT': 'Attraction',
#     'CLN': 'Client',
#     'CNT': 'Contract',
#     'COP': 'Coach Operator',
#     'CO': 'Coach',
#     'CC': 'Cruising Company',
#     'DRV': 'Driver',
#     'DMC': 'DMC',
#     'GL': 'Group Leader',
#     'GD': 'Guide',
#     'HTL': 'Hotel',
#     'PLC': 'Place',
#     'PRT': 'Port',
#     'RS': 'Railway Station',
#     'RSH': 'Repair Shop',
#     'RTP': 'Repair Type',
#     'RST': 'Restaurant',
#     'SRV': 'Service',
#     'FTA': 'Ferry Ticket Agency',
#     'TC': 'Teleferik Company',
#     'TH': 'Theater',
#     'TTA': 'Train Ticket Agency',
#     'TT': 'Text Template',
#     'SES': 'Sport Event Supplier',
#     'AUT': 'Authentication',
#     'USR': 'User',
#     'HSR': 'History',
#     'PKG': 'Parking Lot',
#     'COA': 'COA',
#     'COL': 'COL',
#     'PRO': "Proforma Invoice",
#     "ES": "Entertainment Supplier",
#     'CH': 'Car Hire Company',
#     'AD': 'Advertisement Company',
#     'CB': 'Charter Brokers',
#     'AC': 'Aircrafts',
#     'NAS': 'NAS Folders',
# }

# # All models reversed
# models_full_text_reverse = {
#     'GroupTransfer': 'GT',
#     'Agent': 'AGN',
#     'Airline': 'AL',
#     'Offer': 'OFF',
#     'Airport': 'AP',
#     'Attraction': 'ATT',
#     'Client': 'CLN',
#     'Contract': 'CNT',
#     'Coach Operator': 'COP',
#     'Coach': 'CO',
#     'Cruising Company': 'CC',
#     'Driver': 'DRV',
#     'DMC': 'DMC',
#     'Group Leader': 'GL',
#     'Guide': 'GD',
#     'Hotel': 'HTL',
#     'Place': 'PLC',
#     'Port': 'PRT',
#     'Railway Station': 'RS',
#     'Repair Shop': 'RSH',
#     'Repair Type': 'RTP',
#     'Restaurant': 'RST',
#     'Service': 'SRV',
#     'Ferry Ticket Agency': 'FTA',
#     'Teleferik Company': 'TC',
#     'Text Template': 'TT',
#     'Theater': 'TH',
#     'Train Ticket Agency': 'TTA',
#     'Sport Event Supplier': 'SES',
#     'Authentication': 'AUT',
#     'User': 'USR',
#     'History': 'HSR',
#     'Parking Lot': 'PKG',
#     'COA': 'COA',
#     'COL': 'COL',
#     "Proforma Invoice": 'PRO',
#     "Entertainment Supplier": "ES",
#     'Car Hire Company': 'CH',
#     'Advertisement Company': 'AD',
#     'Charter Brokers': 'CB',
#     'Aircrafts': 'AC',
#     'NAS Folders': 'NAS',

# }


# class ChangePermission(generics.ListAPIView):
#     """
#     URL: change_permission/
#     Descr: toggles permission for selected user and object
#     """

#     # Cross site request forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'USR') or not is_superuser(user.id):
#             context = {"errormsg": "You do not have permission to update user's permission"}
#             return Response(status=401, data=context)

#         # Get model
#         object = request.data['object']

#         # Get user
#         user_to_edit = request.data['user']

#         # Get permission type
#         permission_type = permissions_full_text_reverse[request.data['permission_type']]

#         # Get user to edit
#         user_id = User.objects.get(username=user_to_edit).id
#         model = models_full_text_reverse[object]

#         # Get permission
#         permission = UserPermissions.objects.get(user_id=user_id, permission_type=permission_type, model=model)

#         # Get previous value for logging
#         prev_perm = permission.value

#         # Toggle it
#         if permission.value is True:
#             permission.value = False
#         else:
#             permission.value = True
#         permission.save()

#         # Add event to history
#         History.objects.create(
#             user=user,
#             model_name='USR',
#             action='UPD',
#             description=f"User : {user.username} updated user's ({user_to_edit}) permission to \
#                 {permissions_full_text[permission_type]} {object} from {prev_perm} to {permission.value}"
#         )

#         return Response(status=200)


# class HandleAllPermissions(generics.ListAPIView):
#     """
#     URL: handle_all_permissions/
#     Descr: toggles permissions of a type for selected user
#     """

#     # Cross site request forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'USR') or not is_superuser(user.id):
#             context = {"errormsg": "You do not have permission to update user's permission"}
#             return Response(status=401, data=context)

#         # Get user
#         user_to_edit = request.data['user']

#         # Get permission type
#         permission_type = permissions_full_text_reverse[request.data['permission_type']]
#         perm_value = request.data['perm_value']
#         # Get user to edit
#         user_id = User.objects.get(username=user_to_edit).id

#         # Get permission
#         permissions = UserPermissions.objects.filter(user_id=user_id, permission_type=permission_type)

#         for perm in permissions:
#             perm.value = perm_value
#             perm.save()

#         # Add event to history
#         History.objects.create(
#             user=user,
#             model_name='USR',
#             action='UPD',
#             description=f"User : {user.username} updated user's ({user_to_edit}) all {permission_type} permissions to {perm_value}"
#         )

#         return Response(status=200)


# class UnlockUser(generics.ListAPIView):
#     """
#     URL: unlock_user/
#     Descr: Removes user's block
#     *** django does not allow "unblock" on the URL string
#     """

#     # Cross site request forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'USR') or not is_superuser(user.id):
#             context = {"errormsg": "You do not have permission to unlock a user."}
#             return Response(status=401, data=context)

#         # Get user to unlock
#         user_to_unlock = request.data['username']

#         # Use raw SQL to remove user from axesattempt table
#         from django.db import connection
#         cursor = connection.cursor()
#         cursor.execute("delete from axes_accessattempt where username = '" + str(user_to_unlock) + "' ")
#         cursor.execute("SELECT * FROM axes_accessattempt WHERE failures_since_start > 2")

#         locked_entries = []

#         for i in cursor.fetchall():
#             locked_entries.append({
#                 'ID': i[0],
#                 'IP_address': i[2],
#                 'username': i[3],
#                 'time_stamp': i[6].strftime('%b. %d, %Y, %H:%M:%S'),
#                 'action': '',
#                 'result': '',
#                 'locked': True,
#             })

#         connection.close()

#         History.objects.create(
#             user=user,
#             model_name='USR',
#             action='UPD',
#             description=f"User : {user.username} removed user's {user_to_unlock} block"
#         )
#         return Response({
#             'locked_entries': locked_entries,
#         })


# class ValidateConflict(generics.ListAPIView):
#     """
#     URL: validate_conflict/
#     Descr: turns travelday's is_valid flag to true, so it is not considered to have a conflict anymore
#     """

#     serializer_class = UserSerializer

#     # Cross site request forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not is_staff(user.id):
#             context = {"errormsg": "You do not have permission to validate the conflict."}
#             return Response(status=401, data=context)

#         # Get travelday
#         td_to_validate = TravelDay.objects.get(id=request.data['td_id'])

#         # Get group
#         refcode = GroupTransfer.objects.get(id=td_to_validate.group_transfer_id).refcode

#         # use raw sql to update is_valid
#         from django.db import connection
#         cursor = connection.cursor()
#         cursor.execute("update webapp_travelday set is_valid = True where id = '" + str(td_to_validate.id) + "' ")
#         connection.close()

#         # Add event to history
#         History.objects.create(
#             user=user,
#             model_name='TD',
#             action='UPD',
#             description=f'User : {user.username} validated conflict of group : {refcode} date: {td_to_validate.date}'
#         )

#         update_notifications()
#         return Response(status=200)


# def set_false_permissions(user_id):
#     """ Used upon user creation, also create permissions for user, which are all set to false """
#     perm_types = ['DEL', 'UPD', 'CRE', 'VIE']
#     models = [
#         "AC", "AD", "AGN", "AL", "AP", "ATT", "AUT", "CB", "CC", "CH", "CLN",
#         "CNT", "CO", "COA", "COL", "COP", "DMC", "DRV", "ES", "FTA", "GD", "GL",
#         "GT", "HSR", "HTL", "OFF", "PKG", "PLC", "PRO", "PRT", "RS", "RSH",
#         "RST", "RTP", "SES", "SRV", "TC", "TH", "TT", "TTA", "USR", "NAS",
#     ]

#     for type in perm_types:
#         for model in models:
#             UserPermissions.objects.create(
#                 model=model,
#                 permission_type=type,
#                 value=False,
#                 description=f"can_{ACTION_NAMES[type].lower()}_{MODEL_CHOICES[model].lower()}",
#                 user_id=user_id
#             )


# def set_read_only_permissions(user_id):
#     perms = UserPermissions.objects.filter(user=user_id)

#     user_to_edit = User.objects.get(id=user_id)
#     user_to_edit.is_active = True
#     user_to_edit.save()

#     for perm in perms:
#         if perm.permission_type == 'VIE':
#             perm.value = True
#             perm.save()


# def set_basic_permissions(user_id):
#     extra_perms_list = ['ATT', 'CC', 'DMC', 'GD', 'PRT', 'RSH', 'RST', 'RS', 'FTA', 'TC', 'TH', 'TTA', 'TT', 'SES', 'HSR', 'PKG', 'ES', 'CH', 'AD', 'CB', 'AC']

#     user_to_edit = User.objects.get(id=user_id)
#     user_to_edit.is_active = True
#     user_to_edit.is_staff = True
#     user_to_edit.save()

#     perms = UserPermissions.objects.filter(user=user_id)
#     for perm in perms:
#         if perm.permission_type == 'VIE':
#             perm.value = True
#             perm.save()
#         if perm.model in extra_perms_list and perm.permission_type != 'DEL':
#             perm.value = True
#             perm.save()


# def set_backoffice_permissions(user_id):
#     extra_perms_list = ['USR', 'AUT']

#     user_to_edit = User.objects.get(id=user_id)
#     user_to_edit.is_active = True
#     user_to_edit.is_staff = True
#     user_to_edit.save()

#     perms = UserPermissions.objects.filter(user=user_id)
#     for perm in perms:
#         if perm.model not in extra_perms_list and perm.permission_type != 'DEL':
#             perm.value = True
#             perm.save()


# def set_administrator_permissions(user_id):
#     perms = UserPermissions.objects.filter(user=user_id)

#     user_to_edit = User.objects.get(id=user_id)
#     user_to_edit.is_active = True
#     user_to_edit.is_staff = True
#     user_to_edit.is_superuser = True
#     user_to_edit.save()

#     for perm in perms:
#         perm.value = True
#         perm.save()


# class AddUser(generics.UpdateAPIView):
#     """
#     URL: add_user/
#     Descr: Creates new user, user has no permissions, and:
#     is_staff, is_active and is_superuser statuses are false.
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": '', 'new_user_id': ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_create(user.id, 'USR'):
#             context = {"errormsg": "You do not have permission to create a User."}
#             return Response(status=401, data=context)

#         try:
#             username = request.data['username'].strip()
#             first_name = request.data['first_name'].strip()
#             last_name = request.data['last_name'].strip()
#             email = request.data['email'].strip()
#             password = request.data['password'].strip()
#         except Exception as exc:
#             context['errormsg'] = exc
#             return HttpResponse(status=400)

#         if len(username) < 3:
#             context['errormsg'] = 'Invalid name submitted'
#             return Response(data=context, status=400)
#         if '@' not in email or len(email) < 5:
#             context['errormsg'] = 'Invalid email submitted'
#             return Response(data=context, status=400)
#         try:
#             new_user = User.objects.create_user(
#                 username=username,
#                 first_name=first_name,
#                 last_name=last_name,
#                 email=email,
#                 password=password,
#                 is_staff=False,
#                 is_active=False,
#                 is_superuser=False,
#             )
#             new_user.save()

#             # User gets 0 permissions upon creation
#             set_false_permissions(new_user.id)
#             role = request.data['role']

#             if role == 'No Permissions':
#                 pass
#             elif role == 'Read Only':
#                 set_read_only_permissions(new_user.id)
#             elif role == 'Basic':
#                 set_basic_permissions(new_user.id)
#             elif role == 'Back Office':
#                 set_backoffice_permissions(new_user.id)
#             elif role == 'Administrator':
#                 set_administrator_permissions(new_user.id)

#             History.objects.create(
#                 user=user,
#                 model_name='USR',
#                 action='CRE',
#                 description=f'User : {user.username} created a new user with username: {new_user.username}'
#             )
#             context['new_user_id'] = new_user.id
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeUsername(generics.UpdateAPIView):
#     """
#     URL: change_username
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'USR'):
#             context = {"errormsg": "You do not have permission to update a User's username."}
#             return Response(status=401, data=context)

#         try:
#             # Get username
#             username = request.data['username'].strip()
#             user_to_edit = User.objects.get(id=request.data['user_id'])

#             # Get previous username for logging
#             prev_username = user_to_edit.username
#         except Exception as exc:
#             context['errormsg'] = exc
#             return HttpResponse(status=400)

#         # Validations
#         if len(username) < 3:
#             context['errormsg'] = 'Invalid username submitted'
#             return Response(data=context, status=400)

#         try:
#             user_to_edit.username = username
#             user_to_edit.save()
#             History.objects.create(
#                 user=user,
#                 model_name='USR',
#                 action='UPD',
#                 description=f"User : {user.username} updated user's ({prev_username}) username from \
#                     {prev_username} to {username}"
#             )
#             context['user'] = UserSerializer(user_to_edit).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeFirstName(generics.UpdateAPIView):
#     """
#     URL: change_first_name
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'USR'):
#             context = {"errormsg": "You do not have permission to update a User's first name."}
#             return Response(status=401, data=context)

#         try:
#             # Get first name
#             first_name = request.data['first_name'].strip()
#             user_to_edit = User.objects.get(id=request.data['user_id'])

#             # Get previous first name for logging
#             prev_first_name = user_to_edit.first_name
#         except Exception as exc:
#             context['errormsg'] = exc
#             return HttpResponse(status=400)

#         # Validations
#         if len(first_name) < 3:
#             context['errormsg'] = 'Invalid first name submitted'
#             return Response(data=context, status=400)

#         try:
#             user_to_edit.first_name = first_name
#             user_to_edit.save()
#             History.objects.create(
#                 user=user,
#                 model_name='USR',
#                 action='UPD',
#                 description=f"User : {user.username} updated user's ({user_to_edit}) first name from \
#                     {prev_first_name} to {first_name}"
#             )
#             context['user'] = UserSerializer(user_to_edit).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeLastName(generics.UpdateAPIView):
#     """
#     URL: change_last_name
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'USR'):
#             context = {"errormsg": "You do not have permission to update a User's last name."}
#             return Response(status=401, data=context)

#         try:
#             # Get last name
#             last_name = request.data['last_name'].strip()
#             user_to_edit = User.objects.get(id=request.data['user_id'])

#             # Get previous last name for logging
#             prev_last_name = user_to_edit.last_name
#         except Exception as exc:
#             context['errormsg'] = exc
#             return HttpResponse(status=400)

#         if len(last_name) < 3:
#             context['errormsg'] = 'Invalid last name submitted'
#             return Response(data=context, status=400)

#         try:
#             user_to_edit.last_name = last_name
#             user_to_edit.save()
#             History.objects.create(
#                 user=user,
#                 model_name='USR',
#                 action='UPD',
#                 description=f"User : {user.username} updated user's ({user_to_edit}) last name from \
#                     {prev_last_name} to {last_name}"
#             )
#             context['user'] = UserSerializer(user_to_edit).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeEmail(generics.UpdateAPIView):
#     """
#     URL: change_email
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'USR'):
#             context = {"errormsg": "You do not have permission to update a User's email."}
#             return Response(status=401, data=context)

#         try:
#             # Get email
#             email = request.data['email'].strip()
#             user_to_edit = User.objects.get(id=request.data['user_id'])

#             # Get previous email for logging
#             prev_email = user_to_edit.email
#         except Exception as exc:
#             context['errormsg'] = exc
#             return HttpResponse(status=400)

#         # Validations
#         if '@' not in email or len(email) < 5:
#             context['errormsg'] = 'Invalid email submitted'
#             return Response(data=context, status=400)

#         try:
#             user_to_edit.email = email
#             user_to_edit.save()
#             History.objects.create(
#                 user=user,
#                 model_name='USR',
#                 action='UPD',
#                 description=f"User : {user.username} updated user's ({user_to_edit}) email from {prev_email} to {email}"
#             )
#             context['user'] = UserSerializer(user_to_edit).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeIsEnabled(generics.ListCreateAPIView):
#     """
#     URL: change_is_enabled
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)
#         user_to_edit = User.objects.get(id=request.data['user_id'])

#         # Permission
#         if not can_update(user.id, 'USR') or not is_superuser(user.id):
#             context = {"errormsg": "You do not have permission to update a User's enabled status."}
#             return Response(status=401, data=context)

#         # One liner to get value
#         value = True if request.data['value'] == 'true' else False

#         # Get previous value for logging
#         prev_value = user_to_edit.is_active

#         try:
#             # If it is the same, do nothing
#             if user_to_edit.is_active == value:
#                 context['user'] = UserSerializer(user_to_edit).data
#                 return Response(data=context, status=status.HTTP_200_OK)
#             user_to_edit.is_active = value
#             user_to_edit.save()
#             History.objects.create(
#                 user=user,
#                 model_name='USR',
#                 action='UPD',
#                 description=f"User : {user.username} updated user's ({user_to_edit}) enabled status from \
#                     {prev_value} to {value}"
#             )
#             context['user'] = UserSerializer(user_to_edit).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeIsStaff(generics.ListCreateAPIView):
#     """
#     URL: change_is_staff
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'USR') or not is_superuser(user.id):
#             context = {"errormsg": "You do not have permission to update a User's staff status."}
#             return Response(status=401, data=context)

#         user_to_edit = User.objects.get(id=request.data['user_id'])

#         # One liner to get value
#         value = True if request.data['value'] == 'true' else False

#         # Get previous value for logging
#         prev_value = user_to_edit.is_staff

#         try:
#             # If it is the same, do nothing
#             if user_to_edit.is_staff == value:
#                 context['user'] = UserSerializer(user_to_edit).data
#                 return Response(data=context, status=status.HTTP_200_OK)
#             user_to_edit.is_staff = value
#             user_to_edit.save()
#             History.objects.create(
#                 user=user,
#                 model_name='USR',
#                 action='UPD',
#                 description=f"User : {user.username} updated user's ({user_to_edit}) staff status from \
#                     {prev_value} to {value}"
#             )
#             context['user'] = UserSerializer(user_to_edit).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeIsSuperuser(generics.ListCreateAPIView):
#     """
#     URL: change_is_superuser
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'USR') or not is_superuser(user.id):
#             context = {"errormsg": "You do not have permission to update a User's super user status."}
#             return Response(status=401, data=context)

#         user_to_edit = User.objects.get(id=request.data['user_id'])

#         # One liner to get value
#         value = True if request.data['value'] == 'true' else False

#         # Get previous value for logging
#         prev_value = user_to_edit.is_superuser

#         try:
#             user_to_edit.is_superuser = value
#             user_to_edit.save()
#             History.objects.create(
#                 user=user,
#                 model_name='USR',
#                 action='UPD',
#                 description=f"User : {user.username} updated user's ({user_to_edit}) super user status from \
#                     {prev_value} to {value}"
#             )
#             context['user'] = UserSerializer(user_to_edit).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangePhoneNumber(generics.ListCreateAPIView):
#     """
#     URL: change_phone_number
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'USR'):
#             context = {"errormsg": "You do not have permission to update a User's phone number."}
#             return Response(status=401, data=context)

#         user_to_edit = User.objects.get(id=request.data['user_id'])
#         profile = UserProfile.objects.get(user_id=user_to_edit.id)

#         # One liner to get value
#         phone_number = request.data['phone_number'].strip()

#         # Get previous phone number for logging
#         prev_phone_number = profile.phone_number

#         try:
#             profile.phone_number = phone_number
#             profile.save()
#             History.objects.create(
#                 user=user,
#                 model_name='USR',
#                 action='UPD',
#                 description=f"User : {user.username} updated user's ({user_to_edit}) phone number from \
#                     {prev_phone_number} to {phone_number}"
#             )
#             context['user'] = UserSerializer(user_to_edit).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeUserNationality(generics.ListCreateAPIView):
#     """
#     URL: change_user_nationality
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'USR'):
#             context = {"errormsg": "You do not have permission to update a User's nationality."}
#             return Response(status=401, data=context)

#         # Get nationality
#         nationality = request.data['nationality']
#         nation = Country.objects.get(name=nationality)
#         user_to_edit = User.objects.get(id=request.data['user_id'])
#         profile = UserProfile.objects.get(user_id=user_to_edit.id)

#         # Get previous nationality for logging
#         prev_nationality = profile.nationality_id
#         prev_nation = Country.objects.get(id=prev_nationality).name if prev_nationality is not None else 'N/A'

#         try:
#             profile.nationality_id = nation.id
#             profile.save()
#             History.objects.create(
#                 user=user,
#                 model_name='USR',
#                 action='UPD',
#                 description=f"User : {user.username} updated user's ({user_to_edit}) nationality from \
#                     {prev_nation} to {nationality}"
#             )
#             context['user'] = UserSerializer(user_to_edit).data
#         except Exception as a:
#             context['errormsg'] = a
#             return Response(data=context, status=400)
#         return Response(data=context, status=200)


# class ChangeAddress(generics.ListCreateAPIView):
#     """
#     URL: change_address
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'USR'):
#             context = {"errormsg": "You do not have permission to update a User's address."}
#             return Response(status=401, data=context)

#         try:
#             # Get address
#             address = request.data['address'].strip()
#             user_to_edit = User.objects.get(id=request.data['user_id'])
#             profile = UserProfile.objects.get(user_id=user_to_edit.id)
#             prev_address = profile.address
#         except Exception as exc:
#             context['errormsg'] = exc
#             return HttpResponse(status=400)

#         # Validations
#         if len(address) < 4 or len(address) > 100:
#             context['errormsg'] = 'Invalid address submitted'
#             return Response(data=context, status=400)

#         try:
#             profile.address = address
#             profile.save()
#             History.objects.create(
#                 user=user,
#                 model_name='USR',
#                 action='UPD',
#                 description=f"User : {user.username} updated user's ({user_to_edit}) address from \
#                     {prev_address} to {address}"
#             )
#             context['user'] = UserSerializer(user_to_edit).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeZipCode(generics.ListCreateAPIView):
#     """
#     URL: change_zip_code
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'USR'):
#             context = {"errormsg": "You do not have permission to update a User's zip code."}
#             return Response(status=401, data=context)

#         try:
#             # Get zip code
#             zip_code = request.data['zip_code'].strip()
#             user_to_edit = User.objects.get(id=request.data['user_id'])
#             profile = UserProfile.objects.get(user_id=user_to_edit.id)

#             # Get previous zip code for logging
#             prev_zip_code = profile.zip_code
#         except Exception as exc:
#             context['errormsg'] = exc
#             return HttpResponse(status=400)

#         try:
#             profile.zip_code = zip_code
#             profile.save()
#             History.objects.create(
#                 user=user,
#                 model_name='USR',
#                 action='UPD',
#                 description=f"User : {user.username} updated user's ({user_to_edit}) zip code from \
#                     {prev_zip_code} to {zip_code}"
#             )
#             context['user'] = UserSerializer(user_to_edit).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeSignature(generics.ListCreateAPIView):
#     """
#     URL: change_signature
#     Signature is an HTML field, users can paste data directly from outlook into this
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'USR'):
#             context = {"errormsg": "You do not have permission to update a User's signature."}
#             return Response(status=401, data=context)

#         try:
#             # Get signature
#             signature = request.data['signature']
#             user_to_edit = User.objects.get(id=request.data['user_id'])
#             profile = UserProfile.objects.get(user_id=user_to_edit.id)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return HttpResponse(status=400)

#         try:
#             profile.signature = signature
#             profile.save()
#             History.objects.create(
#                 user=user,
#                 model_name='USR',
#                 action='UPD',
#                 description=f"User : {user.username} updated user's ({user_to_edit}) signature"
#             )
#             context['user'] = UserSerializer(user_to_edit).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangePassword(generics.ListCreateAPIView):
#     """
#     URL: change_password
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'USR'):
#             context = {"errormsg": "You do not have permission to update a User's password."}
#             return Response(status=401, data=context)

#         try:
#             # Get password
#             password = request.data['password']
#             user_to_edit = User.objects.get(id=request.data['user_id'])
#         except Exception as exc:
#             context['errormsg'] = exc
#             return HttpResponse(status=400)

#         try:
#             # Built in
#             user_to_edit.set_password(password)
#             user_to_edit.save()
#             History.objects.create(
#                 user=user,
#                 model_name='USR',
#                 action='UPD',
#                 description=f"User : {user.username} updated user's ({user_to_edit}) password"
#             )
#             context['user'] = UserSerializer(user_to_edit).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class DeleteUser(generics.UpdateAPIView):
#     """
#     url : del_usr/
#     Descr: Deletes User, If user has related entries it will return a 401 error response
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_delete(user.id, 'USR'):
#             context = {"errormsg": "You do not have permission to delete a User"}
#             return Response(status=401, data=context)

#         try:
#             user_to_del = User.objects.get(id=request.data['user_id'])
#             History.objects.create(
#                 user=user,
#                 model_name='USR',
#                 action='DEL',
#                 description=f"User : {user.username} deleted user {user_to_del}"
#             )
#             user_to_del.delete()
#             context['user'] = UserSerializer(user_to_del).data

#         except ProtectedError:
#             context['errormsg'] = 'This User is protected. Remove User\'s related objects to be able to delete it.'
#             return Response(data=context, status=400)

#         except Exception as a:
#             context['errormsg'] = a
#             return Response(data=context, status=400)
#         return Response(data=context, status=200)


# class ChangeSecondaryEmail(generics.ListCreateAPIView):
#     """
#     URL: change_secondary_email
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'USR'):
#             context = {"errormsg": "You do not have permission to update a User's secondary email."}
#             return Response(status=401, data=context)

#         try:
#             # Get signature
#             secondary_email = request.data['secondary_email']
#             user_to_edit = User.objects.get(id=request.data['user_id'])
#             profile = UserProfile.objects.get(user_id=user_to_edit.id)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return HttpResponse(status=400)

#         try:
#             profile.secondary_email = secondary_email
#             profile.save()
#             History.objects.create(
#                 user=user,
#                 model_name='USR',
#                 action='UPD',
#                 description=f"User : {user.username} updated user's ({user_to_edit}) secondary_email"
#             )
#             context['user'] = UserSerializer(user_to_edit).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeSecondarySignature(generics.ListCreateAPIView):

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'USR'):
#             context = {"errormsg": "You do not have permission to update a User's secondary signature."}
#             return Response(status=401, data=context)

#         try:
#             # Get signature
#             signature = request.data['signature']
#             user_to_edit = User.objects.get(id=request.data['user_id'])
#             profile = UserProfile.objects.get(user_id=user_to_edit.id)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return HttpResponse(status=400)

#         try:
#             profile.secondary_signature = signature
#             profile.save()
#             History.objects.create(
#                 user=user,
#                 model_name='USR',
#                 action='UPD',
#                 description=f"User : {user.username} updated user's ({user_to_edit}) secondary signature"
#             )
#             context['user'] = UserSerializer(user_to_edit).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class AddNasFolder(APIView):
#     """
#     URL: add_nas_folder
#     Descr: Add a new NAS folder configuration
#     """

#     @csrf_exempt
#     def post(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers.get('User-Token', None)
        
#         if not token_str:
#             context = {"errormsg": "User-Token header not provided."}
#             return Response(status=400, data=context)

#         user = get_user(token_str)

#         # Permission check
#         if not can_create(user.id, 'NAS'):
#             context = {"errormsg": "You do not have permission to Create a NAS Folder."}
#             return Response(status=401, data=context)

#         try:
#             folder = NasFolder.objects.create(
#                 name=request.data.get('name'),
#                 mount_path=request.data.get('mount_path'),
#                 nas_path=request.data.get('nas_path'),
#                 username=request.data.get('username'),
#                 password=request.data.get('password'),
#                 sync_interval=int(request.data.get('sync_interval', 300)),
#                 is_active=request.data.get('is_active', True)
#             )
            
#             return Response({
#                 'success': True,
#                 'folder_id': folder.id
#             })
#         except Exception as e:
#             return Response({
#                 'success': False,
#                 'error': str(e)
#             }, status=400)


# class UpdateNasFolder(APIView):
#     """
#     URL: update_nas_folder
#     Descr: Update an existing NAS folder configuration
#     """

#     @csrf_exempt
#     def post(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers.get('User-Token', None)
        
#         if not token_str:
#             context = {"errormsg": "User-Token header not provided."}
#             return Response(status=400, data=context)

#         user = get_user(token_str)

#         # Permission check
#         if not can_update(user.id, 'NAS'):
#             context = {"errormsg": "You do not have permission to Edit the NAS Folders."}
#             return Response(status=401, data=context)

#         try:
#             folder = NasFolder.objects.get(id=request.data.get('id'))
            
#             folder.name = request.data.get('name', folder.name)
#             folder.mount_path = request.data.get('mount_path', folder.mount_path)
#             folder.nas_path = request.data.get('nas_path', folder.nas_path)
#             folder.username = request.data.get('username', folder.username)
#             folder.password = request.data.get('password', folder.password)
#             folder.sync_interval = int(request.data.get('sync_interval', folder.sync_interval))
#             folder.is_active = request.data.get('is_active', folder.is_active)
            
#             folder.save()
            
#             return Response({
#                 'success': True
#             })
#         except NasFolder.DoesNotExist:
#             return Response({
#                 'success': False,
#                 'error': 'Folder not found'
#             }, status=404)
#         except Exception as e:
#             return Response({
#                 'success': False,
#                 'error': str(e)
#             }, status=400)


# class DeleteNasFolder(APIView):
#     """
#     URL: delete_nas_folder
#     Descr: Delete a NAS folder configuration
#     """

#     @csrf_exempt
#     def post(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers.get('User-Token', None)
        
#         if not token_str:
#             context = {"errormsg": "User-Token header not provided."}
#             return Response(status=400, data=context)

#         user = get_user(token_str)

#         # Permission check
#         if not can_delete(user.id, 'NAS'):
#             context = {"errormsg": "You do not have permission to Delete the NAS Folders."}
#             return Response(status=401, data=context)

#         try:
#             folder = NasFolder.objects.get(id=request.data.get('id'))
#             folder.delete()
            
#             return Response({
#                 'success': True
#             })
#         except NasFolder.DoesNotExist:
#             return Response({
#                 'success': False,
#                 'error': 'Folder not found'
#             }, status=404)
#         except Exception as e:
#             return Response({
#                 'success': False,
#                 'error': str(e)
#             }, status=400)


# class SyncNasFolder(APIView):
#     """
#     URL: sync_nas_folder
#     Descr: Manually trigger synchronization of a NAS folder
#     """

#     @csrf_exempt
#     def post(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers.get('User-Token', None)
        
#         if not token_str:
#             context = {"errormsg": "User-Token header not provided."}
#             return Response(status=400, data=context)

#         user = get_user(token_str)

#         # Permission check
#         if not can_view(user.id, 'NAS'):
#             context = {"errormsg": "You do not have permission to Sync the NAS Folders."}
#             return Response(status=401, data=context)

#         try:
#             folder = NasFolder.objects.get(id=request.data.get('id'))
            
#             # Here you would implement the actual sync logic
#             # For now, we'll just update the last_sync timestamp
#             folder.last_sync = datetime.datetime.now()
#             folder.save()
            
#             return Response({
#                 'success': True,
#                 'last_sync': folder.last_sync.strftime('%Y-%m-%d %H:%M:%S')
#             })
#         except NasFolder.DoesNotExist:
#             return Response({
#                 'success': False,
#                 'error': 'Folder not found'
#             }, status=404)
#         except Exception as e:
#             return Response({
#                 'success': False,
#                 'error': str(e)
#             }, status=400)
