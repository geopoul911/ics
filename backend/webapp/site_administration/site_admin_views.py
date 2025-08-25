# # from django.shortcuts import render
# from webapp.models import (
#     User,
#     History,
# )

# import datetime
# from django.views.decorators.csrf import csrf_exempt
# from rest_framework.authtoken.models import Token
# from rest_framework import generics
# from rest_framework.response import Response
# from django.db.models import Q
# from rest_framework.views import APIView
# from accounts.serializers import (UserSerializer,)
# from django.db import connection
# import os
# from django.http import HttpResponse, FileResponse, JsonResponse
# from rest_framework.decorators import api_view
# from rest_framework import status
# from webapp.xhr import get_user
# import logging
# from rest_framework.permissions import IsAuthenticated
# from django.views import View
# from django.conf import settings

# logger = logging.getLogger(__name__)


# # Permissions
# permissions_full_text = {
#     'VIE': 'View',
#     'CRE': 'Create',
#     'UPD': 'Update',
#     'DEL': 'Delete',
# }

# # Permissions reversed
# permissions_full_text_reverse = {
#     'View': 'VIE',
#     'Create': 'CRE',
#     'Update': 'UPD',
#     'Delete': 'DEL',
# }

# # All models
# models_full_text = {
#     'GT': 'GroupTransfer',
# }

# # All models reversed
# models_full_text_reverse = {
#     'GroupTransfer': 'GT',
# }


# # Returns user instance
# def get_user(token):
#     user = Token.objects.get(key=token).user
#     return user


# """
#     # Site Administration

#     - AllUsers
#     - UserView
#     - AccessHistory
#     - Logs
#     - UserPermissions
#     - AllRegions
#     - RegionView
# """


# class AccessHistory(generics.ListAPIView):
#     """
#     URL: site_admin_access_history/
#     Descr: Access history shows locked users/ips and successfull / unsuccessfull login attempts
#     """

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Use raw SQL to get django-axes entries
#         from django.db import connection
#         cursor = connection.cursor()

#         # Get user
#         selected_user = request.GET['selected_user']

#         login_logout_history = []
#         locked_entries = []

#         # If there is no user
#         if selected_user == '':
#             cursor.execute("SELECT * FROM axes_accessattempt WHERE failures_since_start > 2")
#             login_logout_entries = History.objects.filter(model_name='AUT')
#         else:
#             specific_user = User.objects.get(username=selected_user)
#             cursor.execute(
#                 "SELECT * FROM axes_accessattempt WHERE failures_since_start > 2 AND username='" + selected_user + "'"
#             )
#             login_logout_entries = History.objects.filter(model_name='AUT', user_id=specific_user.id)

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

#         for entry in login_logout_entries:
#             login_logout_history.append({
#                 'id': entry.id,
#                 'description': entry.description,
#                 'timestamp': entry.timestamp.strftime('%b. %d, %Y, %H:%M:%S'),
#                 'ip_address': entry.ip_address,
#             })

#         # Sort by id
#         login_logout_history = sorted(login_logout_history, key=lambda d: d['id'], reverse=True)

#         connection.close()
#         return Response({
#             'locked_entries': locked_entries,
#             'login_logout_history': login_logout_history,
#         })


# class Logs(APIView):
#     """
#     URL: site_admin_logs/
#     Descr: Get App's history ( actions )
#     """

#     @csrf_exempt
#     def get(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers.get('User-Token')
#         user = get_user(token_str)

#         # Get date range
#         date_from = request.GET.get('date_from')
#         date_to = request.GET.get('date_to')

#         # Initialize filters
#         filters = []
#         params = []

#         # Filter by actions
#         action_filter = request.GET.get('action_filter')
#         if action_filter != 'None':
#             action_map = {
#                 'View': 'VIE',
#                 'Create': 'CRE',
#                 'Update': 'UPD',
#                 'Delete': 'DEL'
#             }
#             action_value = action_map.get(action_filter)
#             if action_value:
#                 filters.append("action = %s")
#                 params.append(action_value)

#         # Filter by model
#         model_filter = request.GET.get('model_filter')
#         if model_filter != 'None':
#             model_value = models_full_text_reverse.get(model_filter)
#             if model_value:
#                 filters.append("model_name = %s")
#                 params.append(model_value)

#         # Filter by user
#         user_filter = request.GET.get('user_filter')
#         if user_filter != 'None':
#             try:
#                 user_obj = User.objects.get(username=user_filter)
#                 filters.append("user_id = %s")
#                 params.append(user_obj.id)
#             except User.DoesNotExist:
#                 return Response(status=404, data={"errormsg": "User not found."})

#         # Filter by date range
#         if date_from and date_to:
#             filters.append("timestamp::date >= %s AND timestamp::date <= %s")
#             params.append(date_from)
#             params.append(date_to)

#         # Construct the query
#         query = """
#             SELECT h.id, h.model_name, h.action, h.description, h.timestamp, h.user_id, au.username
#             FROM webapp_history h
#             INNER JOIN auth_user au
#             on h.user_id = au.id
#         """
#         if filters:
#             query += " WHERE " + " AND ".join(filters)
#         query += " ORDER BY id DESC"

#         # Execute the query
#         with connection.cursor() as cursor:
#             cursor.execute(query, params)
#             columns = [col[0] for col in cursor.description]
#             logs = [dict(zip(columns, row)) for row in cursor.fetchall()]

#         # Transform data for response
#         for log in logs:
#             log['model_name'] = models_full_text[log['model_name']]
#             log['action'] = permissions_full_text[log['action']]
#             log['timestamp'] = log['timestamp'].strftime('%b. %d, %Y, %H:%M:%S')
#             log['user'] = log['username']

#         return Response({'logs': logs})


# class AllUsers(generics.RetrieveAPIView):
#     """
#     URL: all_users/
#     Descr: Get All users
#     """

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Get all users
#         users = User.objects.all().order_by('-id')
#         users_data = []

#         # Loop over groups to get the front end's table data
#         for user in users:
#             users_data.append({
#                 'id': user.id,
#                 'username': user.username,
#                 'first_name': user.first_name,
#                 'last_name': user.last_name,
#                 'email': user.email,
#                 'is_staff': user.is_staff,
#                 'is_active': user.is_active,
#                 'is_superuser': user.is_superuser,
#                 'last_login': datetime.datetime.strftime(user.last_login, '%d/%m/%Y  %H:%M:%S') if user.last_login is not None else 'N/A',
#                 'date_joined': datetime.datetime.strftime(user.date_joined, '%d/%m/%Y  %H:%M:%S'),
#             })

#         return Response({
#             'all_users': users_data,
#         })


# class UserView(generics.ListAPIView):
#     """
#     URL: user/(?P<user_id>.*)$
#     Descr: Get User's Data
#     """

#     serializer_class = UserSerializer

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request, user_id):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Get user
#         user = User.objects.get(id=user_id)

#         return Response({
#             'user': self.get_serializer(user, context={'request': self.request}).data,
#         })



# class AllRegions(generics.RetrieveAPIView):
#     """
#     URL: all_regions/
#     Descr: Returns array of all regions
#     """

#     @csrf_exempt
#     def get(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers.get('User-Token', None)
#         user = get_user(token_str)

#         regions_list = []
#         return Response({'all_regions': regions_list})


# class RegionView(generics.ListAPIView):

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request, rtype, region_id):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         return Response({
#             'region': '',
#         })

