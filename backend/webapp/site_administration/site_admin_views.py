# # from django.shortcuts import render
# from webapp.models import (
#     GroupTransfer,
#     Country,
#     Agent,
#     Client,
#     Coach,
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
# from accounts.models import (UserPermissions)
# from django.db import connection
# from accounts.permissions import (
#     can_view,
#     is_superuser,
#     is_staff,
# )
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
#     'AGN': 'Agent',
#     'AL': 'Airline',
#     'OFF': 'Offer',
#     'AP': 'Airport',
#     'TD': 'TravelDay',
#     'ATT': 'Attraction',
#     'CLN': 'Client',
#     "CNT": 'Contract',
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
#     'ES': 'Entertainment Supplier',
#     'PRO': 'Proforma Invoice',
#     'CH': 'Car Hire Company',
#     'AD': 'Advertisement Company',
#     'CB': 'Charter Brokers',
#     'AC': 'Aircrafts',
#     "NAS": "NAS Folders",
# }

# # All models reversed
# models_full_text_reverse = {
#     'GroupTransfer': 'GT',
#     'Agent': 'AGN',
#     'Airline': 'AL',
#     'Offer': 'OFF',
#     'Airport': 'AP',
#     'TravelDay': 'TD',
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
#     'Theater': 'TH',
#     'Train Ticket Agency': 'TTA',
#     'Text Template': 'TT',
#     'Sport Event Supplier': 'SES',
#     'Authentication': 'AUT',
#     'User': 'USR',
#     'History': 'HSR',
#     'Parking Lot': 'PKG',
#     'COA': 'COA',
#     'COL': 'COL',
#     'Entertainment Supplier': 'ES',
#     'Proforma Invoice': 'PRO',
#     'Car Hire Company': 'CH',
#     'Advertisement Company': 'AD',
#     'Charter Brokers': 'CB',
#     'Aircrafts': 'AC',
#     "NAS Folders": "NAS",
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
#     - Conflicts
#     - Logs
#     - UserPermissions
#     - IncompleteData
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

#         # Permission
#         if not can_view(user.id, 'HSR') or not is_superuser(user.id):
#             context = {"errormsg": "You do not have permission to view Access history."}
#             return Response(status=401, data=context)

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


# class Conflicts(generics.ListAPIView):
#     """
#     URL: site_admin_conflicts/
#     Descr: Conflicts are occured when a driver or coach are in 2 different traveldays with the same date
#     """

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not is_staff(user.id):
#             context = {"errormsg": "You do not have permission to view Conflicts."}
#             return Response(status=401, data=context)

#         from django.db import connection
#         cursor = connection.cursor()

#         all_conflicts = []
#         driver_conflicts = []
#         coach_conflicts = []

#         # We use raw sql to improve performance
#         # DRIVER CONFLICTS
#         if request.GET['selected_driver'] != '':
#             driver_id = request.GET['selected_driver'].split(') ')[0]
#             cursor.execute("""
#                 SELECT * from
#                     (SELECT webapp_travelday.id as travel_day_id,
#                         refcode,
#                         webapp_grouptransfer.status as Status,
#                         webapp_travelday.date as _Day,
#                         webapp_contact.name as Driver_name,
#                         count(2)over(partition by webapp_travelday.date) as Day_Counter
#                         FROM webapp_travelday
#                         INNER JOIN webapp_grouptransfer
#                         ON webapp_travelday.group_transfer_id = webapp_grouptransfer.id
#                         INNER JOIN webapp_contact
#                         ON webapp_travelday.driver_id = webapp_contact.id
#                         INNER JOIN (SELECT date, webapp_contact.name, count(*) AS qty
#                         FROM webapp_travelday
#                         INNER JOIN webapp_contact
#                         ON webapp_travelday.driver_id = webapp_contact.id
#                         GROUP BY date, name
#                         HAVING count(*) > 1
#                     )
#                     AS t ON webapp_travelday.date = t.date and webapp_contact.name = t.name
#                     where status = '5'
#                     AND webapp_travelday.is_valid = False
#                     and webapp_travelday.driver_id = %s
#                     order by _day DESC, driver_name) main_t
#                 where day_counter > 1
#             """, [driver_id])
#             for row in cursor.fetchall():
#                 driver_conflicts.append({
#                     'td_id': row[0],
#                     'refcode': row[1],
#                     'date': row[3],
#                     'driver_coach': 'driver',
#                     'driver_coach_name': row[4],
#                 })
#                 all_conflicts.append({
#                     'td_id': row[0],
#                     'refcode': row[1],
#                     'date': row[3],
#                     'driver_coach': 'driver',
#                     'driver_coach_name': row[4],
#                 })
#             return Response({
#                 'all_conflicts': all_conflicts,
#                 'driver_conflicts': driver_conflicts,
#                 'coach_conflicts': [],
#             })

#         # COACH CONFLICTS
#         elif request.GET['selected_coach'] != '':
#             coach_id = Coach.objects.get(id=request.GET['selected_coach'].split(') ')[0]).id
#             cursor.execute("""
#                 select * from (SELECT webapp_travelday.id as travel_day_id,
#                 refcode,
#                 webapp_travelday.date as _Day,
#                 webapp_coach.make as Coach_Brand,
#                 webapp_coach.plate_number as Plate_Number,
#                 webapp_travelday.is_valid,
#                 count(1)over(partition by webapp_travelday.date) as Day_Counter
#                 FROM webapp_travelday
#                 INNER JOIN webapp_grouptransfer
#                 ON webapp_travelday.group_transfer_id = webapp_grouptransfer.id
#                 INNER JOIN webapp_coach
#                 ON webapp_coach.id = webapp_travelday.coach_id
#                 INNER JOIN (
#                 SELECT date, webapp_coach.plate_number, count(*) AS qty
#                 FROM webapp_travelday
#                 INNER JOIN webapp_coach
#                 ON webapp_travelday.coach_id = webapp_coach.id
#                 GROUP BY date, Plate_Number
#                 HAVING count(*) > 1
#                 ) AS t ON webapp_travelday.date = t.date and webapp_coach.plate_number = t.plate_number
#                 where status = '5'
#                 AND webapp_travelday.coach_id = %s
#                 AND webapp_travelday.is_valid = False
#                 order by _day DESC, Plate_Number) main_t
#                 where day_counter > 1
#             """, [coach_id])
#             for row in cursor.fetchall():
#                 coach_conflicts.append({
#                     'td_id': row[0],
#                     'refcode': row[1],
#                     'date': row[2],
#                     'driver_coach_name': row[3] + ' / ' + row[4],
#                 })
#                 all_conflicts.append({
#                     'td_id': row[0],
#                     'refcode': row[1],
#                     'date': row[2],
#                     'driver_coach_name': row[3] + ' / ' + row[4],
#                 })
#             return Response({
#                 'all_conflicts': all_conflicts,
#                 'driver_conflicts': [],
#                 'coach_conflicts': coach_conflicts,
#             })

#         # COACH CONFLICTS
#         cursor.execute("""
#             SELECT * from
#                 (
#                     SELECT webapp_travelday.id as travel_day_id,
#                     refcode,
#                     webapp_grouptransfer.status as Status,
#                     webapp_travelday.date as _Day,
#                     webapp_contact.name as Driver_name,
#                     count(2)over(partition by webapp_travelday.date) as Day_Counter
#                     FROM webapp_travelday
#                     INNER JOIN webapp_grouptransfer
#                     ON webapp_travelday.group_transfer_id = webapp_grouptransfer.id
#                     INNER JOIN webapp_contact
#                     ON webapp_travelday.driver_id = webapp_contact.id
#                     INNER JOIN (SELECT date, webapp_contact.name, count(*) AS qty
#                     FROM webapp_travelday
#                     INNER JOIN webapp_contact
#                     ON webapp_travelday.driver_id = webapp_contact.id
#                     GROUP BY date, name
#                     HAVING count(*) > 1
#                 )
#             AS t ON webapp_travelday.date = t.date and webapp_contact.name = t.name
#             where status = '5'
#             AND webapp_travelday.is_valid = False
#             order by _day DESC, driver_name) main_t
#             where day_counter > 1
#         """)
#         for row in cursor.fetchall():
#             driver_conflicts.append({
#                 'td_id': row[0],
#                 'refcode': row[1],
#                 'date': row[3],
#                 'driver_coach_name': row[4],
#             })
#             all_conflicts.append({
#                 'td_id': row[0],
#                 'refcode': row[1],
#                 'date': row[3],
#                 'driver_coach_name': row[4],
#             })

#         cursor.execute("""
#           SELECT * FROM (
#             SELECT webapp_travelday.id as travel_day_id,
#             refcode,
#             webapp_travelday.date as _Day,
#             webapp_coach.make as Coach_Brand,
#             webapp_coach.plate_number as Plate_Number,
#             webapp_travelday.is_valid,
#             count(1)over(partition by webapp_travelday.date) as Day_Counter
#             FROM webapp_travelday
#             INNER JOIN webapp_grouptransfer
#             ON webapp_travelday.group_transfer_id = webapp_grouptransfer.id
#             INNER JOIN webapp_coach
#             ON webapp_coach.id = webapp_travelday.coach_id
#             INNER JOIN (
#             SELECT date, webapp_coach.plate_number, count(*) AS qty
#             FROM webapp_travelday
#             INNER JOIN webapp_coach
#             ON webapp_travelday.coach_id = webapp_coach.id
#             GROUP BY date, Plate_Number
#             HAVING count(*) > 1
#             ) AS t ON webapp_travelday.date = t.date and webapp_coach.plate_number = t.plate_number
#             where status = '5'
#             AND webapp_travelday.is_valid = False
#             order by _day DESC, Plate_Number) main_t
#             where day_counter > 1
#         """)

#         for row in cursor.fetchall():
#             coach_conflicts.append({
#                 'td_id': row[0],
#                 'refcode': row[1],
#                 'date': row[2],
#                 'driver_coach_name': row[3] + ' / ' + row[4],
#             })
#             all_conflicts.append({
#                 'td_id': row[0],
#                 'refcode': row[1],
#                 'date': row[2],
#                 'driver_coach_name': row[3] + ' / ' + row[4],
#             })

#         connection.close()
#         return Response({
#             'all_conflicts': all_conflicts,
#             'driver_conflicts': driver_conflicts,
#             'coach_conflicts': coach_conflicts,
#         })


# class IncompleteData(generics.ListAPIView):
#     """
#     URL: site_admin_incomplete_data/
#     Descr: Get objects with incomplete data
#     """

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'USR') and is_staff(user.id):
#             context = {"errormsg": "You do not have permission to view Incomplete data."}
#             return Response(status=401, data=context)

#         from django.db import connection
#         cursor = connection.cursor()
#         data_to_front = []

#         # Raw SQL performs better.
#         # Use if else to get selected model.
#         if request.GET.get('selected_model') == 'GroupTransfer':
#             """
#             Groups that don't have one of the following :
#             1) arrival flight
#             2) departure flight
#             3) number of people
#             4) nationality
#             Are considered incomplete.
#             """
#             groups = GroupTransfer.objects.filter(
#                 Q(arrival='N/A') |
#                 Q(departure='N/A') |
#                 Q(number_of_people__isnull=True) |
#                 Q(nationality__isnull=True)
#             )

#             can_view_COA = can_view(user.id, 'COA')
#             can_view_COL = can_view(user.id, 'COL')

#             # Filter Groups based on showing and permissions
#             if not can_view_COA:
#                 groups = groups.exclude(refcode__startswith='COA')
#             if not can_view_COL:
#                 groups = groups.exclude(refcode__startswith='COL')

#             for group in groups:
#                 nationality = Country.objects.get(
#                     id=group.nationality_id
#                 ).name if group.nationality_id is not None else 'N/A'
#                 nationality_code = Country.objects.get(
#                     id=group.nationality_id
#                 ).code if group.nationality_id is not None else ''
#                 has_agent = True if group.agent_id else False
#                 agent_client = Agent.objects.get(id=group.agent_id).name if \
#                     group.agent_id else Client.objects.get(id=group.client_id).name
#                 agent_client_id = Agent.objects.get(id=group.agent_id).id if \
#                     group.agent_id else Client.objects.get(id=group.client_id).id

#                 data_to_front.append({
#                     'id': group.id,
#                     'refcode': group.refcode,
#                     'agent_or_client': 'Agent' if has_agent else 'Client',
#                     'agent_client': agent_client,
#                     'agent_client_id': agent_client_id,
#                     'status': 'Confirmed' if group.status == '5' else 'Cancelled',
#                     'departure_date': group.departure.split('-')[0],
#                     'nationality':  nationality,
#                     'nationality_code': nationality_code,
#                     'number_of_people': group.number_of_people,
#                 })

#         elif request.GET.get('selected_model') == 'Agent':
#             """
#             Agents that don't have one of the following :
#             1) abbreviation
#             2) nationality
#             3) number of people
#             4) address
#             5) tel
#             6) email
#             Are considered incomplete.
#             """
#             cursor.execute("""
#                 SELECT * FROM webapp_agent
#                 INNER JOIN webapp_contact
#                 ON webapp_agent.contact_id = webapp_contact.id
#                 WHERE abbreviation IS NULL
#                 OR abbreviation = ''
#                 OR nationality_id IS NULL
#                 OR webapp_agent.name IS NULL
#                 OR address IS NULL
#                 OR address = ''
#                 OR tel IS NULL
#                 OR email IS NULL
#             """)

#             for agent in cursor.fetchall():
#                 nationality = Country.objects.get(id=agent[5]).name if agent[5] is not None else 'N/A'
#                 nationality_code = Country.objects.get(id=agent[5]).code if agent[5] is not None else ''
#                 data_to_front.append({
#                     'id': agent[0],
#                     'name': agent[1],
#                     'address': 'N/A' if agent[9] is None else agent[9],
#                     'tel': 'N/A' if agent[10] is None else agent[10],
#                     'tel2': 'N/A' if agent[11] is None else agent[11],
#                     'tel3': 'N/A' if agent[12] is None else agent[12],
#                     'email': 'N/A' if agent[13] is None else agent[13],
#                     'enabled': agent[2],
#                     'abbreviation': agent[4],
#                     'nationality':  nationality,
#                     'nationality_code': nationality_code,
#                 })

#         elif request.GET.get('selected_model') == 'Airline':
#             """
#             Airlines that don't have one of the following :
#             1) name
#             2) abbreviation
#             Are considered incomplete.
#             """
#             cursor.execute("""
#                 SELECT * FROM webapp_airline
#                 WHERE name IS NULL
#                 OR abbreviation IS NULL
#                 OR abbreviation = ''
#             """)
#             for airline in cursor.fetchall():
#                 data_to_front.append({
#                     'id': airline[0],
#                     'name': airline[1],
#                     'abbreviation': airline[2],
#                     'enabled': airline[4],
#                 })

#         elif request.GET.get('selected_model') == 'Airport':
#             """
#             Airports that don't have one of the following :
#             1) location
#             2) lat
#             3) lng
#             Are considered incomplete.
#             """
#             cursor.execute(
#                 "SELECT * FROM webapp_airport WHERE location IS NULL OR LAT IS NULL OR LNG IS NULL ORDER BY NAME"
#             )
#             for airport in cursor.fetchall():
#                 data_to_front.append({
#                     'name': airport[0],
#                     'location': airport[1],
#                     'lat_lng': f'{airport[2]} / {airport[3]}',
#                     'enabled': airport[5],
#                 })

#         elif request.GET.get('selected_model') == 'Attraction':
#             """
#             Attractions that don't have one of the following :
#             1) name
#             2) lat
#             3) lng
#             Are considered incomplete.
#             """
#             # If location, lat, or lng is null:
#             cursor.execute("""
#                 SELECT * FROM webapp_attraction
#                 WHERE LAT IS NULL
#                 OR LNG IS NULL
#                 OR name IS NULL
#             """)
#             for attraction in cursor.fetchall():
#                 data_to_front.append({
#                     'id': attraction[0],
#                     'name': attraction[1],
#                     'lat_lng': str(attraction[2]) + ' / ' + str(attraction[3]),
#                 })

#         elif request.GET.get('selected_model') == 'Client':
#             """
#             Clients that don't have one of the following :
#             1) abbreviation
#             2) nationality
#             3) address
#             4) tel
#             Are considered incomplete.
#             """
#             cursor.execute("""
#                 SELECT * FROM webapp_client
#                 INNER JOIN webapp_contact
#                 ON webapp_client.contact_id = webapp_contact.id
#                 WHERE abbreviation IS NULL
#                 OR abbreviation = ''
#                 OR nationality_id IS NULL
#                 OR address IS NULL
#                 OR address = ''
#                 OR tel IS NULL
#             """)
#             for client in cursor.fetchall():
#                 nationality = Country.objects.get(id=client[4]).name if client[4] is not None else 'N/A'
#                 nationality_code = Country.objects.get(id=client[4]).code if client[4] is not None else ''
#                 data_to_front.append({
#                     'id': client[0],
#                     'name': client[1],
#                     'enabled': client[6],
#                     'address': 'N/A' if client[9] is None else client[9],
#                     'tel': 'N/A' if client[10] is None else client[10],
#                     'tel2': 'N/A' if client[11] is None else client[11],
#                     'tel3': 'N/A' if client[12] is None else client[12],
#                     'email': 'N/A' if client[13] is None else client[13],
#                     'abbreviation': client[2],
#                     'nationality':  nationality,
#                     'nationality_code': nationality_code,
#                 })

#         elif request.GET.get('selected_model') == 'Coach Operator':
#             """
#             Coach Operators that don't have one of the following :
#             1) Lat
#             2) Lng
#             3) Address
#             4) Tel
#             5) Email
#             Are considered incomplete.
#             """
#             cursor.execute("""
#                 SELECT * FROM webapp_coachoperator
#                 INNER JOIN webapp_contact
#                 ON webapp_coachoperator.contact_id = webapp_contact.id
#                 WHERE LAT IS NULL
#                 OR LNG IS NULL
#                 OR ADDRESS IS NULL
#                 OR ADDRESS = ''
#                 OR TEL IS NULL
#                 OR email IS NULL
#                 OR email = ''
#             """)

#             for coach_operator in cursor.fetchall():
#                 data_to_front.append({
#                     'id': coach_operator[0],
#                     'name': coach_operator[1],
#                     'is_local': coach_operator[3],
#                     'lat_lng': f'{coach_operator[4]} / {coach_operator[5]}',
#                     'address': coach_operator[11],
#                     'website': coach_operator[19],
#                     'tel': coach_operator[12],
#                     'tel2': 'N/A' if coach_operator[13] is None else coach_operator[13],
#                     'tel3': 'N/A' if coach_operator[14] is None else coach_operator[14],
#                     'email': 'N/A' if coach_operator[15] is None else coach_operator[15],
#                     'enabled': coach_operator[8],
#                 })

#         elif request.GET.get('selected_model') == 'Coach':
#             """
#             Coaches that don't have one of the following :
#             1) Plate number
#             2) Body number
#             Are considered incomplete.
#             """
#             cursor.execute("""
#                 SELECT * FROM webapp_coach
#                 WHERE make IS NULL
#                 OR plate_number IS NULL
#                 OR plate_number = ''
#                 OR body_number IS NULL
#                 OR body_number = ''
#             """)
#             for coach in cursor.fetchall():
#                 data_to_front.append({
#                     'id': coach[0],
#                     'make': coach[1],
#                     'body_number': coach[5],
#                     'plate_number': coach[2],
#                     'number_of_seats': coach[3],
#                     'emission': 'Euro ' + str(coach[6]) if coach[6] else 'N/A',
#                     'year': coach[7],
#                     'enabled': coach[9],
#                 })

#         elif request.GET.get('selected_model') == 'Cruising Company':
#             """
#             Cruising Companies that don't have one of the following :
#             1) Lat
#             2) Lng
#             3) Address
#             4) Tel
#             Are considered incomplete.
#             """
#             cursor.execute("""
#                 SELECT * FROM webapp_cruisingcompany
#                 INNER JOIN webapp_contact
#                 ON webapp_cruisingcompany.contact_id = webapp_contact.id
#                 WHERE LAT IS NULL
#                 OR LNG IS NULL
#                 OR ADDRESS IS NULL
#                 OR ADDRESS = ''
#                 OR TEL IS NULL
#             """)

#             for cruising_company in cursor.fetchall():
#                 data_to_front.append({
#                     'id': cruising_company[0],
#                     'name': cruising_company[1],
#                     'lat_lng': f'{cruising_company[2]} / {cruising_company[3]}',
#                     'address': cruising_company[9],
#                     'website': cruising_company[17],
#                     'tel': cruising_company[10],
#                     'tel2': 'N/A' if cruising_company[11] is None else cruising_company[11],
#                     'tel3': 'N/A' if cruising_company[12] is None else cruising_company[12],
#                     'email': 'N/A' if cruising_company[13] is None else cruising_company[13],
#                     'enabled': cruising_company[6],
#                 })

#         elif request.GET.get('selected_model') == 'Ferry Ticket Agency':
#             """
#             Ferry Ticket Agencies that don't have one of the following :
#             1) Lat
#             2) Lng
#             3) Address
#             4) Tel
#             Are considered incomplete.
#             """
#             cursor.execute("""
#                 SELECT * FROM webapp_ferryticketagency
#                 INNER JOIN webapp_contact
#                 ON webapp_ferryticketagency.contact_id = webapp_contact.id
#                 WHERE LAT IS NULL
#                 OR LNG IS NULL
#                 OR ADDRESS IS NULL
#                 OR ADDRESS = ''
#                 OR TEL IS NULL
#             """)

#             for ferry_ticket_agency in cursor.fetchall():
#                 data_to_front.append({
#                     'id': ferry_ticket_agency[0],
#                     'name': ferry_ticket_agency[1],
#                     'lat_lng': f'{ferry_ticket_agency[2]} / {ferry_ticket_agency[3]}',
#                     'address': ferry_ticket_agency[9],
#                     'website': ferry_ticket_agency[17],
#                     'tel': ferry_ticket_agency[10],
#                     'tel2': 'N/A' if ferry_ticket_agency[11] is None else ferry_ticket_agency[11],
#                     'tel3': 'N/A' if ferry_ticket_agency[12] is None else ferry_ticket_agency[12],
#                     'email': 'N/A' if ferry_ticket_agency[13] is None else ferry_ticket_agency[13],
#                     'enabled': ferry_ticket_agency[6],
#                 })

#         elif request.GET.get('selected_model') == 'Teleferik Company':
#             """
#             Teleferik Companies that don't have one of the following :
#             1) Lat
#             2) Lng
#             3) Address
#             4) Tel
#             Are considered incomplete.
#             """

#             cursor.execute("""
#                 SELECT * FROM webapp_teleferikcompany
#                 INNER JOIN webapp_contact
#                 ON webapp_teleferikcompany.contact_id = webapp_contact.id
#                 WHERE LAT IS NULL
#                 OR LNG IS NULL
#                 OR ADDRESS IS NULL
#                 OR ADDRESS = ''
#                 OR TEL IS NULL
#             """)

#             for teleferik_company in cursor.fetchall():
#                 data_to_front.append({
#                     'id': teleferik_company[0],
#                     'name': teleferik_company[1],
#                     'lat_lng': f'{teleferik_company[2]} / {teleferik_company[3]}',
#                     'address': teleferik_company[9],
#                     'tel': teleferik_company[10],
#                     'tel2': 'N/A' if teleferik_company[11] is None else teleferik_company[11],
#                     'tel3': 'N/A' if teleferik_company[12] is None else teleferik_company[12],
#                     'email': 'N/A' if teleferik_company[13] is None else teleferik_company[13],
#                     'website': teleferik_company[17],
#                     'enabled': teleferik_company[6],
#                 })

#         elif request.GET.get('selected_model') == 'Driver':
#             """
#             Drivers that don't have one of the following :
#             1) Address
#             2) Tel
#             3) Email
#             Are considered incomplete.
#             """
#             cursor.execute("""
#                 SELECT * FROM webapp_contact
#                 WHERE type = 'D'
#                 AND (address IS NULL OR tel IS NULL OR email IS NULL)
#             """)
#             for driver in cursor.fetchall():
#                 data_to_front.append({
#                     'id': driver[0],
#                     'name': driver[1],
#                     'address': driver[2],
#                     'tel': driver[3],
#                     'tel2': 'N/A' if driver[4] is None else driver[4],
#                     'tel3': 'N/A' if driver[5] is None else driver[5],
#                     'email': 'N/A' if driver[6] is None else driver[6],
#                     'enabled': driver[10],
#                 })

#         elif request.GET.get('selected_model') == 'DMC':
#             """
#             DMC that don't have one of the following :
#             1) Lat
#             2) Lng
#             3) Address
#             4) Tel
#             Are considered incomplete.
#             """
#             cursor.execute("""
#                 SELECT * FROM webapp_dmc
#                 INNER JOIN webapp_contact
#                 ON webapp_dmc.contact_id = webapp_contact.id
#                 WHERE LAT IS NULL
#                 OR LNG IS NULL
#                 OR ADDRESS IS NULL
#                 OR ADDRESS = ''
#                 OR TEL IS NULL
#             """)

#             for dmc in cursor.fetchall():
#                 data_to_front.append({
#                     'id': dmc[0],
#                     'name': dmc[1],
#                     'lat_lng': f'{dmc[2]} / {dmc[3]}',
#                     'address': dmc[9],
#                     'website': dmc[17],
#                     'tel': dmc[10],
#                     'tel2': 'N/A' if dmc[11] is None else dmc[11],
#                     'tel3': 'N/A' if dmc[12] is None else dmc[12],
#                     'email': 'N/A' if dmc[13] is None else dmc[13],
#                     'enabled': dmc[6],
#                 })

#         elif request.GET.get('selected_model') == 'Hotel':
#             """
#             Hotels that don't have one of the following :
#             1) Lat
#             2) Lng
#             3) Address
#             4) Tel
#             5) Email
#             Are considered incomplete.
#             """
#             cursor.execute("""
#                 SELECT * FROM webapp_hotel
#                 INNER JOIN webapp_contact
#                 ON webapp_hotel.contact_id = webapp_contact.id
#                 where lat IS NULL
#                 OR lng IS NULL
#                 OR address IS NULL
#                 OR ADDRESS = ''
#                 OR tel IS NULL
#                 OR email IS NULL
#                 OR email = ''
#             """)
#             for hotel in cursor.fetchall():
#                 data_to_front.append({
#                     'id': hotel[0],
#                     'name': hotel[1],
#                     'address': hotel[12],
#                     'tel': hotel[13],
#                     'tel2': 'N/A' if hotel[14] is None else hotel[14],
#                     'tel3': 'N/A' if hotel[15] is None else hotel[15],
#                     'email': 'N/A' if hotel[16] is None else hotel[16],
#                     'lat_lng': f'{hotel[4]} / {hotel[5]}',
#                     'enabled': hotel[9],
#                 })

#         elif request.GET.get('selected_model') == 'Restaurant':
#             """
#             Restaurants that don't have one of the following :
#             1) Lat
#             2) Lng
#             3) Address
#             4) Tel
#             5) Email
#             Are considered incomplete.
#             """
#             cursor.execute("""
#                 SELECT * FROM webapp_restaurant
#                 INNER JOIN webapp_contact
#                 ON webapp_restaurant.contact_id = webapp_contact.id
#                 where lat IS NULL
#                 OR lng IS NULL
#                 OR address IS NULL
#                 OR ADDRESS = ''
#                 OR tel IS NULL
#                 OR email IS NULL
#                 OR email = ''
#             """)
#             for restaurant in cursor.fetchall():
#                 data_to_front.append({
#                     'id': restaurant[0],
#                     'name': restaurant[1],
#                     'address': restaurant[11],
#                     'tel': restaurant[12],
#                     'tel2': 'N/A' if restaurant[13] is None else restaurant[13],
#                     'tel3': 'N/A' if restaurant[14] is None else restaurant[14],
#                     'email': 'N/A' if restaurant[15] is None else restaurant[15],
#                     'lat_lng': f'{restaurant[3]} / {restaurant[4]}',
#                     'enabled': restaurant[8],
#                 })

#         elif request.GET.get('selected_model') == 'Guide':
#             """
#             Restaurants that don't have one of the following :
#             1) Address
#             2) Tel
#             3) Email
#             Are considered incomplete.
#             """
#             cursor.execute("""
#                 SELECT * FROM webapp_guide
#                 INNER JOIN webapp_contact
#                 ON webapp_guide.contact_id = webapp_contact.id
#                 where email is null
#                 OR email = ''
#                 OR address IS NULL
#                 OR address = ''
#                 OR tel IS NULL
#             """)

#             for guide in cursor.fetchall():
#                 data_to_front.append({
#                     'id': guide[0],
#                     'name': guide[1],
#                     'address': guide[9],
#                     'tel': guide[10],
#                     'tel2': 'N/A' if guide[11] is None else guide[11],
#                     'tel3': 'N/A' if guide[12] is None else guide[12],
#                     'email': 'N/A' if guide[13] is None else guide[13],
#                     'enabled': guide[6],
#                 })

#         elif request.GET.get('selected_model') == 'Group Leader':
#             """
#             Group Leaders that don't have one of the following :
#             1) Address
#             2) Tel
#             3) Email
#             Are considered incomplete.
#             """
#             cursor.execute("""
#                 SELECT * FROM webapp_contact
#                 WHERE type = 'L'
#                 AND (address IS NULL OR tel IS NULL OR email IS NULL)
#             """)
#             for leader in cursor.fetchall():
#                 data_to_front.append({
#                     'id': leader[0],
#                     'name': leader[1],
#                     'address': leader[2],
#                     'tel': leader[3],
#                     'tel2': 'N/A' if leader[4] is None else leader[4],
#                     'tel3': 'N/A' if leader[5] is None else leader[5],
#                     'email': 'N/A' if leader[6] is None else leader[6],
#                     'enabled': leader[10],
#                 })

#         elif request.GET.get('selected_model') == 'Theater':
#             """
#             Theaters that don't have one of the following :
#             1) Address
#             2) Tel
#             3) Lat
#             4) Lng
#             Are considered incomplete.
#             """
#             cursor.execute("""
#                 SELECT * FROM webapp_theater
#                 INNER JOIN webapp_contact
#                 ON webapp_theater.contact_id = webapp_contact.id
#                 WHERE LAT IS NULL
#                 OR LNG IS NULL
#                 OR ADDRESS IS NULL
#                 OR ADDRESS = ''
#                 OR TEL IS NULL
#             """)

#             for theater in cursor.fetchall():
#                 data_to_front.append({
#                     'id': theater[0],
#                     'name': theater[1],
#                     'lat_lng': f'{theater[2]} / {theater[3]}',
#                     'address': theater[10],
#                     'website': theater[18],
#                     'tel': theater[11],
#                     'tel2': 'N/A' if theater[12] is None else theater[12],
#                     'tel3': 'N/A' if theater[13] is None else theater[13],
#                     'email': 'N/A' if theater[14] is None else theater[14],
#                     'enabled': theater[7],
#                 })

#         elif request.GET.get('selected_model') == 'Repair Shop':
#             """
#             Repair Shops that don't have one of the following :
#             1) Lat
#             2) Lng
#             3) Address
#             4) Tel
#             5) Email
#             Are considered incomplete.
#             """

#             cursor.execute("""
#                 SELECT * FROM webapp_repairshop
#                 INNER JOIN webapp_contact
#                 ON webapp_repairshop.contact_id = webapp_contact.id
#                 WHERE lat IS NULL
#                 OR lng IS NULL
#                 OR address IS NULL
#                 OR ADDRESS = ''
#                 OR tel IS NULL
#                 OR email IS NULL
#                 OR email = ''
#             """)
#             for repair_shop in cursor.fetchall():
#                 data_to_front.append({
#                     'id': repair_shop[0],
#                     'name': repair_shop[1],
#                     'address': repair_shop[10],
#                     'tel': repair_shop[11],
#                     'tel2': 'N/A' if repair_shop[12] is None else repair_shop[12],
#                     'tel3': 'N/A' if repair_shop[13] is None else repair_shop[13],
#                     'email': 'N/A' if repair_shop[14] is None else repair_shop[14],
#                     'lat_lng': f'{repair_shop[4]} / {repair_shop[5]}',
#                     'enabled': repair_shop[7],
#                 })

#         elif request.GET.get('selected_model') == 'Train Ticket Agency':
#             """
#             Train Ticket Agencies that don't have one of the following :
#             1) Lat
#             2) Lng
#             3) Address
#             4) Tel
#             Are considered incomplete.
#             """
#             cursor.execute("""
#                 SELECT * FROM webapp_trainticketagency
#                 INNER JOIN webapp_contact
#                 ON webapp_trainticketagency.contact_id = webapp_contact.id
#                 WHERE LAT IS NULL
#                 OR LNG IS NULL
#                 OR ADDRESS IS NULL
#                 OR ADDRESS = ''
#                 OR TEL IS NULL
#             """)

#             for train_ticket_agency in cursor.fetchall():
#                 data_to_front.append({
#                     'id': train_ticket_agency[0],
#                     'name': train_ticket_agency[1],
#                     'lat_lng': f'{train_ticket_agency[2]} / {train_ticket_agency[3]}',
#                     'address': train_ticket_agency[9],
#                     'website': train_ticket_agency[17],
#                     'tel': train_ticket_agency[10],
#                     'tel2': 'N/A' if train_ticket_agency[11] is None else train_ticket_agency[11],
#                     'tel3': 'N/A' if train_ticket_agency[12] is None else train_ticket_agency[12],
#                     'email': 'N/A' if train_ticket_agency[13] is None else train_ticket_agency[13],
#                     'enabled': train_ticket_agency[6],
#                 })

#         elif request.GET.get('selected_model') == 'Sport Event Supplier':
#             """
#             Sport Event Suppliers that don't have one of the following :
#             1) Lat
#             2) Lng
#             3) Address
#             4) Tel
#             Are considered incomplete.
#             """
#             cursor.execute("""
#                 SELECT * FROM webapp_sporteventsupplier
#                 INNER JOIN webapp_contact
#                 ON webapp_sporteventsupplier.contact_id = webapp_contact.id
#                 WHERE LAT IS NULL
#                 OR LNG IS NULL
#                 OR ADDRESS IS NULL
#                 OR ADDRESS = ''
#                 OR TEL IS NULL
#             """)

#             for sport_event_supplier in cursor.fetchall():
#                 data_to_front.append({
#                     'id': sport_event_supplier[0],
#                     'name': sport_event_supplier[1],
#                     'lat_lng': f'{sport_event_supplier[2]} / {sport_event_supplier[3]}',
#                     'address': sport_event_supplier[10],
#                     'website': sport_event_supplier[18],
#                     'tel': sport_event_supplier[11],
#                     'tel2': 'N/A' if sport_event_supplier[12] is None else sport_event_supplier[12],
#                     'tel3': 'N/A' if sport_event_supplier[13] is None else sport_event_supplier[13],
#                     'email': 'N/A' if sport_event_supplier[14] is None else sport_event_supplier[14],
#                     'enabled': sport_event_supplier[7],
#                 })

#         elif request.GET.get('selected_model') == 'User':
#             """
#             Users that don't have one of the following :
#             1) first_name
#             2) last_name
#             3) email
#             Are considered incomplete.
#             """
#             cursor.execute("SELECT * FROM auth_user WHERE first_name IS NULL OR last_name IS NULL OR email IS NULL OR EMAIL = ''")
#             for user in cursor.fetchall():
#                 data_to_front.append({
#                     'id': user[0],
#                     'username': user[1],
#                     'first_name': user[2],
#                     'last_name': user[3],
#                     'email': user[4],
#                     'is_staff': user[6],
#                     'is_active': user[7],
#                     'is_superuser': user[8],
#                     'last_login': user[9],
#                     'date_joined': user[10],
#                 })
#         else:
#             connection.close()
#             return Response(status=400)

#         connection.close()
#         return Response({
#             'incomplete_data': data_to_front,
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

#         # Permission check
#         if not can_view(user.id, 'HSR') or not is_superuser(user.id):
#             context = {"errormsg": "You do not have permission to view logs."}
#             return Response(status=401, data=context)

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

#         # Permission
#         if not can_view(user.id, 'USR'):
#             context = {"errormsg": "You do not have permission to view all Users."}
#             return Response(status=401, data=context)

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

#         # Permission
#         if not can_view(user.id, 'USR') or not is_superuser(user.id):
#             if str(user_id) != str(user.id):
#                 context = {"errormsg": "You do not have permission to view User."}
#                 return Response(status=401, data=context)

#         # Get user
#         user = User.objects.get(id=user_id)

#         return Response({
#             'user': self.get_serializer(user, context={'request': self.request}).data,
#         })


# class Permissions(generics.ListAPIView):
#     """
#     URL: site_admin_user_permissions/
#     Descr: Get Permissions per user
#     """

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'USR') or not is_superuser(user.id):
#             context = {"errormsg": "You do not have permission to view permissions."}
#             return Response(status=401, data=context)

#         permissions = []

#         # Get selected user
#         selected_user = request.GET['selected_user']

#         # Filter by user
#         if selected_user == '':
#             all_permissions = UserPermissions.objects.all()
#             user_details_obj = None
#         else:
#             all_permissions = UserPermissions.objects.filter(user_id=User.objects.get(username=request.GET['selected_user']).id)
#             user_details = User.objects.get(username=request.GET['selected_user'])
#             user_details_obj = {
#                 'first_name': user_details.first_name,
#                 'last_name': user_details.last_name,
#                 'username': user_details.username,
#                 'email': user_details.email,
#                 'is_staff': user_details.is_staff,
#                 'is_superuser': user_details.is_superuser,
#             }

#         # Filter by type
#         selected_type = request.GET['selected_type']
#         if selected_type != '':
#             all_permissions = all_permissions.filter(permission_type=permissions_full_text_reverse[selected_type])

#         all_permissions = all_permissions.order_by('id')

#         for permission in all_permissions:
#             permissions.append({
#                 'id': permission.id,
#                 'model': models_full_text[permission.model],
#                 'permission_type': permissions_full_text[permission.permission_type],
#                 'value': permission.value,
#                 'description': permission.description.replace('_', ' ').title(),
#                 'user': User.objects.get(id=permission.user_id).username,
#             })

#         return Response({
#             'permissions': permissions,
#             'user_details': user_details_obj,
#         })


# class NasFolders(View):
#     def get(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'NAS'):
#             context = {"errormsg": "You do not have permission to view NAS Folders."}
#             return Response(status=401, data=context)

#         # Get path from query parameter, default to root
#         path = request.GET.get('path', '').replace('\\', '/')  # Convert any backslashes to forward slashes
#         full_path = os.path.normpath(os.path.join('/mnt/gp', path)).replace('\\', '/')  # Ensure forward slashes

#         # Check if path exists
#         if not os.path.exists(full_path):
#             logger.error(f"Path does not exist: {full_path}")
#             return JsonResponse({'error': 'Path not found'}, status=404)

#         # Check if it's a file
#         if os.path.isfile(full_path):
#             logger.info(f"Path is a file: {full_path}")
#             return JsonResponse({'error': 'Path is a file. Use download endpoint instead.'}, status=400)

#         # List directory contents
#         try:
#             items = []
#             for item in os.listdir(full_path):
#                 item_path = os.path.join(full_path, item)
#                 try:
#                     stats = os.stat(item_path)
#                     items.append({
#                         'name': item,
#                         'is_directory': os.path.isdir(item_path),
#                         'size': stats.st_size if not os.path.isdir(item_path) else 0,
#                         'modified': datetime.datetime.fromtimestamp(stats.st_mtime).isoformat(),
#                         'path': os.path.join(path, item).replace('\\', '/') if path else item
#                     })
#                 except Exception as e:
#                     logger.error(f"Error processing item {item}: {str(e)}")
#                     continue

#             # Sort items: directories first, then files, both alphabetically
#             items.sort(key=lambda x: (not x['is_directory'], x['name'].lower()))
            
#             return JsonResponse({'items': items})
#         except Exception as e:
#             logger.error(f"Error listing directory: {str(e)}")
#             return JsonResponse({'error': str(e)}, status=500)


# class NasFoldersDownload(View):
#     def get(self, request):

#         # Get path from query parameter
#         path = request.GET.get('path', '').replace('\\', '/')  # Convert any backslashes to forward slashes
#         if not path:
#             return JsonResponse({'error': 'Path not provided'}, status=400)

#         full_path = os.path.normpath(os.path.join('/mnt/gp', path)).replace('\\', '/')  # Ensure forward slashes
#         logger.info(f"Download request for path: {full_path}")

#         # Check if path exists and is a file
#         if not os.path.exists(full_path):
#             logger.error(f"Path does not exist: {full_path}")
#             return JsonResponse({'error': 'File not found'}, status=404)

#         if not os.path.isfile(full_path):
#             logger.error(f"Path is not a file: {full_path}")
#             return JsonResponse({'error': 'Path is not a file'}, status=400)

#         try:
#             response = FileResponse(open(full_path, 'rb'))
#             response['Content-Disposition'] = f'attachment; filename="{os.path.basename(full_path)}"'
#             return response
#         except Exception as e:
#             logger.error(f"Error serving file: {str(e)}")
#             return JsonResponse({'error': str(e)}, status=500)
