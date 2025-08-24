# from webapp.models import (
#     Agent,
#     Client,
#     Contact,
#     Country,
#     Coach,
#     CoachOperator,
#     DMC,
#     Hotel,
#     Airport,
#     User,
#     Document,
#     Airline,
#     FerryTicketAgency,
#     CruisingCompany,
#     Guide,
#     Restaurant,
#     SportEventSupplier,
#     TeleferikCompany,
#     Theater,
#     TrainTicketAgency,
#     GroupTransfer,
#     TravelDay,
#     RepairType,
#     Terminal,
#     NotificationCounter,
#     RestaurantType,
#     RepairShop,
#     Attraction,
#     Port,
#     Contract,
#     RailwayStation,
#     ParkingLot,
#     HotelCategory,
#     CoachOperatorCategory,
#     Continent,
#     State,
#     City,
#     Area,
#     EntertainmentSupplier,
#     CharterBroker,
# )

# from django.core.cache import cache
# from django.db.models import Q
# import datetime
# from django.views.decorators.csrf import csrf_exempt
from rest_framework.authtoken.models import Token
# from rest_framework import generics
# from rest_framework.response import Response
# from .serializers import (
#     CountrySerializer,
#     AirportSerializer,
#     AgentSerializer,
#     UnnestedAgentSerializer,
#     ClientSerializer,
#     ReportsCoachOperatorSerializer,
#     ReportsHotelSerializer,
#     AirlineSerializer,
#     FerryTicketAgencySerializer,
#     CruisingCompanySerializer,
#     GuideSerializer,
#     RestaurantSerializer,
#     SportEventSupplierSerializer,
#     TeleferikCompanySerializer,
#     TheaterSerializer,
#     TrainTicketAgencySerializer,
#     DMCSerializer,
#     TravelDaySerializer,
#     RepairTypeSerializer,
#     LeaderSerializer,
#     RestaurantTypeSerializer,
#     AttractionSerializer,
#     PortSerializer,
#     RailwayStationSerializer,
#     HotelSerializer,
#     ContractSerializer,
#     TerminalSerializer,
#     ParkingLotSerializer,
#     HotelCategorySerializer,
#     ContinentSerializer,
#     StateSerializer,
#     CitySerializer,
#     AreaSerializer,
#     CoachOperatorCategorySerializer,
#     EntertainmentSupplierSerializer,
#     CharterBrokerSerializer,
# )

# from accounts.permissions import (
#     can_view,
# )

# from accounts.serializers import (
#     UserSerializer
# )

# import time
# from functools import wraps

# def measure_performance(func):
#     @wraps(func)
#     def wrapper(*args, **kwargs):
#         start_time = time.perf_counter()
#         result = func(*args, **kwargs)
#         end_time = time.perf_counter()
#         duration = (end_time - start_time) * 1000  # milliseconds
#         print(f"[PERF] {func.__name__} executed in {duration:.2f} ms")
#         return result
#     return wrapper

# def get_dates_in_range(date_range_str):
#     # Split the input string into start and end date parts
#     start_date_str, end_date_str = date_range_str.split(" - ")

#     # Convert the date strings to datetime objects
#     start_date = datetime.datetime.strptime(start_date_str, "%d-%m-%Y")
#     end_date = datetime.datetime.strptime(end_date_str, "%d-%m-%Y")

#     # Initialize an empty list to store the dates
#     date_list = []

#     # Generate dates and add them to the list
#     current_date = start_date
#     while current_date <= end_date:
#         date_list.append(current_date.strftime("%Y-%m-%d"))
#         current_date += datetime.timedelta(days=1)

#     return date_list


def get_user(token):
    user = Token.objects.get(key=token).user
    return user


# def get_incomplete_agents_num():
#     """
#     Agents that don't have one of the following :
#         1) abbreviation
#         2) nationality
#         3) number of people
#         4) address
#         5) tel
#         6) email
#     Are considered incomplete.
#     """
#     from django.db import connection
#     cursor = connection.cursor()

#     query = """
#         SELECT COUNT(*) FROM webapp_agent
#         INNER JOIN webapp_contact
#         ON webapp_agent.contact_id = webapp_contact.id
#         WHERE abbreviation IS NULL
#         OR abbreviation = ''
#         OR nationality_id IS NULL
#         OR webapp_agent.name IS NULL
#         OR address IS NULL
#         OR address = ''
#         OR tel IS NULL
#         OR email IS NULL
#     """

#     cursor.execute(query)
#     incomplete_agents = 0

#     for row in cursor.fetchall():
#         incomplete_agents = row[0]

#     connection.close()
#     return incomplete_agents


# def get_incomplete_airlines_num():
#     """
#     Airlines that don't have one of the following :
#         1) name
#         2) abbreviation
#     Are considered incomplete.
#     """
#     from django.db import connection
#     cursor = connection.cursor()

#     query = """
#         SELECT COUNT(*) FROM webapp_airline
#         WHERE name IS NULL
#         OR abbreviation IS NULL
#         OR abbreviation = ''
#     """

#     cursor.execute(query)
#     incomplete_airlines = 0

#     for row in cursor.fetchall():
#         incomplete_airlines = row[0]

#     connection.close()
#     return incomplete_airlines


# def get_incomplete_airports_num():
#     """
#     Airports that don't have one of the following :
#         1) location
#         2) lat
#         3) lng
#     Are considered incomplete.
#     """
#     from django.db import connection
#     cursor = connection.cursor()

#     query = "SELECT COUNT(*) FROM webapp_airport WHERE location IS NULL OR LAT IS NULL OR LNG IS NULL"

#     cursor.execute(query)
#     incomplete_airports = 0

#     for row in cursor.fetchall():
#         incomplete_airports = row[0]

#     connection.close()

#     return incomplete_airports


# def get_incomplete_attractions_num():
#     """
#     Attractions that don't have one of the following :
#         1) name
#         2) lat
#         3) lng
#     Are considered incomplete.
#     """
#     from django.db import connection
#     cursor = connection.cursor()

#     query = """
#         SELECT COUNT(*) FROM webapp_attraction
#         WHERE LAT IS NULL
#         OR LNG IS NULL
#         OR name IS NULL
#     """

#     cursor.execute(query)

#     incomplete_attractions = 0

#     for row in cursor.fetchall():
#         incomplete_attractions = row[0]

#     connection.close()
#     return incomplete_attractions


# def get_incomplete_clients_num():
#     """
#     Clients that don't have one of the following :
#         1) abbreviation
#         2) nationality
#         3) address
#         4) tel
#     Are considered incomplete.
#     """
#     from django.db import connection
#     cursor = connection.cursor()

#     query = """
#         SELECT COUNT(*) FROM webapp_client
#         INNER JOIN webapp_contact
#         ON webapp_client.contact_id = webapp_contact.id
#         WHERE abbreviation IS NULL
#         OR abbreviation = ''
#         OR nationality_id IS NULL
#         OR address IS NULL
#         OR address = ''
#         OR tel IS NULL
#     """

#     cursor.execute(query)

#     incomplete_clients = 0

#     for row in cursor.fetchall():
#         incomplete_clients = row[0]

#     connection.close()
#     return incomplete_clients


# def get_incomplete_operators_num():
#     """
#     Coach Operators that don't have one of the following :
#         1) Lat
#         2) Lng
#         3) Address
#         4) Tel
#         5) Email
#     Are considered incomplete.
#     """
#     from django.db import connection
#     cursor = connection.cursor()

#     query = """
#         SELECT COUNT(*) FROM webapp_coachoperator
#         INNER JOIN webapp_contact
#         ON webapp_coachoperator.contact_id = webapp_contact.id
#         WHERE LAT IS NULL
#         OR LNG IS NULL
#         OR ADDRESS IS NULL
#         OR ADDRESS = ''
#         OR TEL IS NULL
#         OR email IS NULL
#         OR email = ''
#     """

#     cursor.execute(query)

#     incomplete_operators = 0

#     for row in cursor.fetchall():
#         incomplete_operators = row[0]
#     connection.close()
#     return incomplete_operators


# def get_incomplete_coaches_num():
#     """
#         Coaches that don't have one of the following :
#         1) Plate number
#         2) Body number
#         Are considered incomplete.
#     """
#     from django.db import connection
#     cursor = connection.cursor()

#     query = """
#         SELECT COUNT(*) FROM webapp_coach
#         WHERE make IS NULL
#         OR plate_number IS NULL
#         OR plate_number = ''
#         OR body_number IS NULL
#         OR body_number = ''
#     """

#     cursor.execute(query)

#     incomplete_coaches = 0

#     for row in cursor.fetchall():
#         incomplete_coaches = row[0]
#     connection.close()
#     return incomplete_coaches


# def get_incomplete_cruising_companies_num():
#     """
#     Cruising Companies that don't have one of the following :
#         1) Lat
#         2) Lng
#         3) Address
#         4) Tel
#     Are considered incomplete.
#     """
#     from django.db import connection
#     cursor = connection.cursor()

#     query = """
#         SELECT COUNT(*) FROM webapp_cruisingcompany
#         INNER JOIN webapp_contact
#         ON webapp_cruisingcompany.contact_id = webapp_contact.id
#         WHERE LAT IS NULL
#         OR LNG IS NULL
#         OR ADDRESS IS NULL
#         OR ADDRESS = ''
#         OR TEL IS NULL
#     """

#     cursor.execute(query)

#     incomplete_cruising_companies = 0

#     for row in cursor.fetchall():
#         incomplete_cruising_companies = row[0]
#     connection.close()
#     return incomplete_cruising_companies


# def get_incomplete_ftas_num():
#     """
#     Ferry Ticket Agencies that don't have one of the following :
#         1) Lat
#         2) Lng
#         3) Address
#         4) Tel
#         Are considered incomplete.
#     """
#     from django.db import connection
#     cursor = connection.cursor()

#     query = """
#         SELECT COUNT(*) FROM webapp_ferryticketagency
#         INNER JOIN webapp_contact
#         ON webapp_ferryticketagency.contact_id = webapp_contact.id
#         WHERE LAT IS NULL
#         OR LNG IS NULL
#         OR ADDRESS IS NULL
#         OR ADDRESS = ''
#         OR TEL IS NULL
#     """

#     cursor.execute(query)

#     incomplete_ftas = 0

#     for row in cursor.fetchall():
#         incomplete_ftas = row[0]
#     connection.close()
#     return incomplete_ftas


# def get_incomplete_tas_num():
#     """
#     Teleferik Companies that don't have one of the following :
#         1) Lat
#         2) Lng
#         3) Address
#         4) Tel
#     Are considered incomplete.
#     """
#     from django.db import connection
#     cursor = connection.cursor()

#     query = """
#         SELECT COUNT(*) FROM webapp_teleferikcompany
#         INNER JOIN webapp_contact
#         ON webapp_teleferikcompany.contact_id = webapp_contact.id
#         WHERE LAT IS NULL
#         OR LNG IS NULL
#         OR ADDRESS IS NULL
#         OR ADDRESS = ''
#         OR TEL IS NULL
#     """

#     cursor.execute(query)

#     incomplete_tas = 0

#     for row in cursor.fetchall():
#         incomplete_tas = row[0]
#     connection.close()
#     return incomplete_tas


# def get_incomplete_groups_num():
#     """
#     Groups that don't have one of the following :
#         1) arrival flight
#         2) departure flight
#         3) number of people
#         4) nationality
#     Are considered incomplete.
#     """
#     from django.db import connection
#     cursor = connection.cursor()

#     query = """
#     SELECT COUNT(*) FROM webapp_grouptransfer
#     WHERE arrival IS NULL
#     OR arrival = 'N/A'
#     OR departure IS NULL
#     OR departure = 'N/A'
#     OR number_of_people IS NULL
#     OR nationality_id IS NULL
#     """

#     cursor.execute(query)

#     incomplete_groups = 0

#     for row in cursor.fetchall():
#         incomplete_groups = row[0]
#     connection.close()
#     return incomplete_groups


# def get_incomplete_drivers_num():
#     """
#     Drivers that don't have one of the following :
#         1) Address
#         2) Tel
#         3) Email
#     Are considered incomplete.
#     """
#     from django.db import connection
#     cursor = connection.cursor()

#     query = """
#         SELECT COUNT(*) FROM webapp_contact
#         WHERE type = 'D'
#         AND (address IS NULL OR tel IS NULL OR email IS NULL)
#     """

#     cursor.execute(query)

#     incomplete_groups = 0

#     for row in cursor.fetchall():
#         incomplete_groups = row[0]
#     connection.close()
#     return incomplete_groups


# def get_incomplete_dmcs_num():
#     """
#     DMC that don't have one of the following :
#         1) Lat
#         2) Lng
#         3) Address
#         4) Tel
#     Are considered incomplete.
#     """
#     from django.db import connection
#     cursor = connection.cursor()

#     query = """
#         SELECT COUNT(*) FROM webapp_dmc
#         INNER JOIN webapp_contact
#         ON webapp_dmc.contact_id = webapp_contact.id
#         WHERE LAT IS NULL
#         OR LNG IS NULL
#         OR ADDRESS IS NULL
#         OR ADDRESS = ''
#         OR TEL IS NULL
#     """

#     cursor.execute(query)

#     incomplete_dmcs = 0

#     for row in cursor.fetchall():
#         incomplete_dmcs = row[0]
#     connection.close()
#     return incomplete_dmcs


# def get_incomplete_hotels_num():
#     """
#     Hotels that don't have one of the following :
#         1) Lat
#         2) Lng
#         3) Address
#         4) Tel
#         5) Email
#     Are considered incomplete.
#     """
#     from django.db import connection
#     cursor = connection.cursor()

#     query = """
#         SELECT COUNT(*) FROM webapp_hotel
#         INNER JOIN webapp_contact
#         ON webapp_hotel.contact_id = webapp_contact.id
#         where lat IS NULL
#         OR lng IS NULL
#         OR address IS NULL
#         OR ADDRESS = ''
#         OR tel IS NULL
#         OR email IS NULL
#         OR email = ''
#     """

#     cursor.execute(query)

#     incomplete_hotels = 0

#     for row in cursor.fetchall():
#         incomplete_hotels = row[0]
#     connection.close()

#     return incomplete_hotels


# def get_incomplete_restaurants_num():
#     """
#     Restaurants that don't have one of the following :
#         1) Lat
#         2) Lng
#         3) Address
#         4) Tel
#         5) Email
#     Are considered incomplete.
#     """
#     from django.db import connection
#     cursor = connection.cursor()

#     query = """
#         SELECT COUNT(*) FROM webapp_restaurant
#         INNER JOIN webapp_contact
#         ON webapp_restaurant.contact_id = webapp_contact.id
#         where lat IS NULL
#         OR lng IS NULL
#         OR address IS NULL
#         OR ADDRESS = ''
#         OR tel IS NULL
#         OR email IS NULL
#         OR email = ''
#     """

#     cursor.execute(query)

#     incomplete_restaurants = 0

#     for row in cursor.fetchall():
#         incomplete_restaurants = row[0]
#     connection.close()

#     return incomplete_restaurants


# def get_incomplete_guides_num():
#     """
#     Restaurants that don't have one of the following :
#         1) Address
#         2) Tel
#         3) Email
#     Are considered incomplete.
#     """
#     from django.db import connection
#     cursor = connection.cursor()

#     query = """
#         SELECT COUNT(*) FROM webapp_guide
#         INNER JOIN webapp_contact
#         ON webapp_guide.contact_id = webapp_contact.id
#         where email is null
#         OR email = ''
#         OR address IS NULL
#         OR address = ''
#         OR tel IS NULL
#     """

#     cursor.execute(query)

#     incomplete_guides = 0

#     for row in cursor.fetchall():
#         incomplete_guides = row[0]
#     connection.close()
#     return incomplete_guides


# def get_incomplete_leaders_num():
#     """
#     Leaders that don't have one of the following :
#         1) Address
#         2) Tel
#         3) Email
#     Are considered incomplete.
#     """
#     from django.db import connection
#     cursor = connection.cursor()

#     query = """
#         SELECT COUNT(*) FROM webapp_contact
#         WHERE type = 'L'
#         AND (address IS NULL OR tel IS NULL OR email IS NULL)
#     """

#     cursor.execute(query)

#     incomplete_leaders = 0

#     for row in cursor.fetchall():
#         incomplete_leaders = row[0]
#     connection.close()
#     return incomplete_leaders


# def get_incomplete_theaters_num():
#     """
#     Theaters that don't have one of the following :
#         1) Address
#         2) Tel
#         3) Lat
#         4) Lng
#     Are considered incomplete.
#     """
#     from django.db import connection
#     cursor = connection.cursor()

#     query = """
#         SELECT COUNT(*) FROM webapp_theater
#         INNER JOIN webapp_contact
#         ON webapp_theater.contact_id = webapp_contact.id
#         WHERE LAT IS NULL
#         OR LNG IS NULL
#         OR ADDRESS IS NULL
#         OR ADDRESS = ''
#         OR TEL IS NULL
#     """

#     cursor.execute(query)

#     incomplete_theaters = 0

#     for row in cursor.fetchall():
#         incomplete_theaters = row[0]
#     connection.close()
#     return incomplete_theaters


# def get_incomplete_rshops_num():
#     """
#     Repair Shops that don't have one of the following :
#         1) Lat
#         2) Lng
#         3) Address
#         4) Tel
#         5) Email
#     Are considered incomplete.
#     """
#     from django.db import connection
#     cursor = connection.cursor()

#     query = """
#         SELECT COUNT(*) FROM webapp_repairshop
#         INNER JOIN webapp_contact
#         ON webapp_repairshop.contact_id = webapp_contact.id
#         WHERE lat IS NULL
#         OR lng IS NULL
#         OR address IS NULL
#         OR ADDRESS = ''
#         OR tel IS NULL
#         OR email IS NULL
#         OR email = ''
#     """

#     cursor.execute(query)

#     incomplete_rshops = 0

#     for row in cursor.fetchall():
#         incomplete_rshops = row[0]
#     connection.close()
#     return incomplete_rshops


# def get_incomplete_ttas_num():
#     """
#     Train Ticket Agencies that don't have one of the following :
#         1) Lat
#         2) Lng
#         3) Address
#         4) Tel
#     Are considered incomplete.
#     """
#     from django.db import connection
#     cursor = connection.cursor()

#     query = """
#         SELECT COUNT(*) FROM webapp_trainticketagency
#         INNER JOIN webapp_contact
#         ON webapp_trainticketagency.contact_id = webapp_contact.id
#         WHERE LAT IS NULL
#         OR LNG IS NULL
#         OR ADDRESS IS NULL
#         OR ADDRESS = ''
#         OR TEL IS NULL
#     """

#     cursor.execute(query)

#     incomplete_ttas = 0

#     for row in cursor.fetchall():
#         incomplete_ttas = row[0]
#     connection.close()
#     return incomplete_ttas


# def get_incomplete_sses_num():
#     """
#     Sport Event Suppliers that don't have one of the following :
#         1) Lat
#         2) Lng
#         3) Address
#         4) Tel
#     Are considered incomplete.
#     """
#     from django.db import connection
#     cursor = connection.cursor()

#     query = """
#         SELECT COUNT(*) FROM webapp_sporteventsupplier
#         INNER JOIN webapp_contact
#         ON webapp_sporteventsupplier.contact_id = webapp_contact.id
#         WHERE LAT IS NULL
#         OR LNG IS NULL
#         OR ADDRESS IS NULL
#         OR ADDRESS = ''
#         OR TEL IS NULL
#     """

#     cursor.execute(query)

#     incomplete_sses = 0

#     for row in cursor.fetchall():
#         incomplete_sses = row[0]
#     connection.close()
#     return incomplete_sses


# def update_notifications():
#     today = datetime.date.today()

#     # Get expired documents number
#     expired_documents = Document.objects.filter(expiry_date__lte=today).count()
#     conflicts = []
#     from django.db import connection
#     cursor = connection.cursor()

#     # Get total conflicts
#     cursor.execute("""
#     SELECT SUM(count) from (SELECT count(Day_Counter) from (
#     SELECT webapp_travelday.id as travel_day_id,
#     webapp_grouptransfer.status as Status,
#     webapp_travelday.date as _Day,
#     count(2)over(partition by webapp_travelday.date) as Day_Counter
#     FROM webapp_travelday
#     INNER JOIN webapp_grouptransfer
#     ON webapp_travelday.group_transfer_id = webapp_grouptransfer.id
#     INNER JOIN webapp_contact
#     ON webapp_travelday.driver_id = webapp_contact.id
#     INNER JOIN (SELECT date, webapp_contact.name, count(*) AS qty
#     FROM webapp_travelday
#     INNER JOIN webapp_contact
#     ON webapp_travelday.driver_id = webapp_contact.id
#     GROUP BY date, name
#     HAVING count(*) > 1)
#     AS t ON webapp_travelday.date = t.date and webapp_contact.name = t.name
#     where status = '5'
#     AND webapp_travelday.is_valid = False
#     order by _day DESC) main_t
#     where day_counter > 1
#     union
#     select count(Day_Counter) from (
#     SELECT webapp_travelday.id as travel_day_id,
#     webapp_travelday.date as _Day,
#     webapp_travelday.is_valid,
#     count(1)over(partition by webapp_travelday.date) as Day_Counter
#     FROM webapp_travelday
#     INNER JOIN webapp_grouptransfer
#     ON webapp_travelday.group_transfer_id = webapp_grouptransfer.id
#     INNER JOIN webapp_coach
#     ON webapp_coach.id = webapp_travelday.coach_id
#     INNER JOIN (
#     SELECT date, webapp_coach.plate_number, count(*) AS qty
#     FROM webapp_travelday
#     INNER JOIN webapp_coach
#     ON webapp_travelday.coach_id = webapp_coach.id
#     GROUP BY date, Plate_Number
#     HAVING count(*) > 1
#     ) AS t ON webapp_travelday.date = t.date and webapp_coach.plate_number = t.plate_number
#     where status = '5'
#     AND webapp_travelday.is_valid = False
#     order by _day) main_t
#     where day_counter > 1) td
#     """)
#     for row in cursor.fetchall():
#         conflicts = row[0]

#     groups_data = []
#     # If travelday has null hotel or driver or coach
#     tds = TravelDay.objects.filter(date__gte=datetime.datetime.today()).filter(
#             Q(hotel__isnull=True) | Q(driver__isnull=True) | Q(coach__isnull=True)
#         )
#     group_ids = [td.group_transfer_id for td in tds]

#     # If group has null arrival or departure or number_of_people or leader
#     groups = GroupTransfer.objects.filter(
#         Q(arrival='N/A') | Q(departure='N/A') | Q(number_of_people=0)
#     )
#     groups = groups.filter(group_travelday__date__gte=datetime.datetime.today())
#     group_ids += [group.id for group in groups]

#     # Get pending groups
#     for group in set(group_ids):
#         group = GroupTransfer.objects.get(id=group)
#         last_groups_td = group.group_travelday.all().order_by("-date")[0]
#         all_hotels = False if group.group_travelday.exclude(
#             id=last_groups_td.id
#         ).filter(hotel__isnull=True).count() > 0 else True
#         all_drivers = False if group.group_travelday.filter(driver__isnull=True).count() > 0 else True
#         all_coaches = False if group.group_travelday.filter(coach__isnull=True).count() > 0 else True
#         arrival = False if group.arrival == 'N/A' else True
#         departure = False if group.departure == 'N/A' else True
#         pax = False if group.number_of_people == 0 else True

#         if all_hotels and all_drivers and all_coaches and arrival and departure and pax:
#             continue

#         groups_data.append({
#             'id': group.id,
#             'refcode': group.refcode,
#             'arrival': arrival,
#             'departure': departure,
#             'pax': pax,
#             'all_hotels': all_hotels,
#             'all_drivers': all_drivers,
#             'all_coaches': all_coaches,
#         })

#     incomplete_data = int(get_incomplete_agents_num()) + \
#         int(get_incomplete_airlines_num()) + \
#         int(get_incomplete_airports_num()) + \
#         int(get_incomplete_attractions_num()) + \
#         int(get_incomplete_clients_num()) + \
#         int(get_incomplete_operators_num()) + \
#         int(get_incomplete_coaches_num()) + \
#         int(get_incomplete_cruising_companies_num()) + \
#         int(get_incomplete_ftas_num()) + \
#         int(get_incomplete_tas_num()) + \
#         int(get_incomplete_groups_num()) + \
#         int(get_incomplete_drivers_num()) + \
#         int(get_incomplete_dmcs_num()) + \
#         int(get_incomplete_hotels_num()) + \
#         int(get_incomplete_restaurants_num()) + \
#         int(get_incomplete_guides_num()) + \
#         int(get_incomplete_leaders_num()) + \
#         int(get_incomplete_theaters_num()) + \
#         int(get_incomplete_rshops_num()) + \
#         int(get_incomplete_ttas_num()) + \
#         int(get_incomplete_sses_num())

#     connection.close()

#     NotificationCounter.objects.create(
#         expired_documents=expired_documents,
#         conflicts=conflicts,
#         groups_data=len(groups_data),
#         incomplete_data=incomplete_data,
#     )

#     return


# class GetAllGroups(generics.ListAPIView):
#     """
#     URL: get_all_groups/
#     Descr: Returns a list of all group refcodes.
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def get(self, request):
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'GT'):
#             context = {"errormsg": "Insufficient permissions. Access denied."}
#             return Response(status=401, data=context)

#         # Get all groups
#         all_groups = GroupTransfer.objects.values_list('refcode', flat=True)

#         return Response({'all_groups': all_groups})


# class GetGroupDays(generics.ListAPIView):
#     """
#     URL: get_group_days/
#     Descr: Returns a list of group's traveldays.
#     """

#     # Disable Cross-Site Request Forgery protection for this view
#     @csrf_exempt
#     def get(self, request):
#         # Extract User-Token from request headers
#         token_str = request.headers['User-Token']

#         # Get user information based on the token
#         user = get_user(token_str)

#         # Check if the user has permission to view group traveldays (Permission check)
#         if not can_view(user.id, 'GT'):
#             context = {"errormsg": "Insufficient permissions. Access denied."}
#             return Response(status=401, data=context)

#         # Get Refcode from request parameters
#         refcode = request.GET.get('refcode')

#         # Get Group instance based on the provided refcode
#         try:
#             group = GroupTransfer.objects.get(refcode=refcode)
#         except GroupTransfer.DoesNotExist:
#             context = {"errormsg": f"Group with refcode {refcode} not found."}
#             return Response(status=404, data=context)

#         # Get Group's traveldays
#         all_traveldays = TravelDay.objects.filter(group_transfer_id=group.id)

#         # Serialize traveldays data
#         travelday_serializer = TravelDaySerializer(all_traveldays, many=True)

#         # Return the list of group traveldays in the response
#         return Response({
#             'all_group_days': travelday_serializer.data,
#         })


# class GetAllAgents(generics.ListAPIView):
#     """
#     URL: get_all_agents/
#     Descr: Gets all agents
#     """

#     serializer_class = UnnestedAgentSerializer

#     # Disable Cross-Site Request Forgery protection for this view
#     @csrf_exempt
#     def get(self, request):
#         # Extract User-Token from request headers
#         token_str = request.headers['User-Token']

#         # Get user information based on the token
#         user = get_user(token_str)

#         # Check if the user has permission to view agents (Permission check)
#         if not can_view(user.id, 'AGN'):
#             return Response(status=401, data={"errormsg": "Insufficient permissions. Access denied."})

#         # Get all agents that are enabled, ordered by name
#         all_agents = (
#             Agent.objects
#             .filter(enabled=True)
#             .order_by('name')
#             .select_related('contact', 'nationality', 'payment_details')
#             .prefetch_related('notes', 'photos', 'contact_persons', 'documents')
#         )

#         # Serialize data using the specified serializer class
#         agent_serializer = self.get_serializer(all_agents, many=True)

#         # Return the list of all agents in the response
#         return Response({'all_agents': agent_serializer.data})


# class GetAllClients(generics.ListAPIView):
#     """
#     URL: get_all_clients/
#     Descr: Gets all clients
#     """
#     serializer_class = ClientSerializer

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def get(self, request):
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)
#         context = {"errormsg": ''}

#         # Permission
#         if not can_view(user.id, 'CLN'):
#             context = {"errormsg": "Insufficient permissions. Access denied."}
#             return Response(status=401, data=context)

#         # Get all Clients
#         all_clients = Client.objects.filter(enabled=True).order_by('name')

#         # Serialize data
#         client_serializer = ClientSerializer(all_clients, many=True)
#         return Response({
#             'all_clients': client_serializer.data,
#         })


# class GetAllAirports(generics.ListAPIView):
#     """
#     URL: get_group_airports/
#     Descr: Gets all airports
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def get(self, request):
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)
#         context = {"errormsg": ''}

#         # Permission
#         if not can_view(user.id, 'AP'):
#             context = {"errormsg": "Insufficient permissions. Access denied."}
#             return Response(status=401, data=context)

#         # Get all Airports
#         all_airports = Airport.objects.filter(enabled=True)

#         # Serialize data
#         airport_serializer = AirportSerializer(all_airports, many=True)

#         return Response({
#             'all_airports': airport_serializer.data,
#         })


# class GetAllAirlines(generics.ListAPIView):
#     """
#     URL: get_group_airlines/
#     Descr: Gets all airlines
#     """

#     serializer_class = AirlineSerializer

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def get(self, request):
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)
#         context = {"errormsg": ''}

#         # Permission
#         if not can_view(user.id, 'AL'):
#             context = {"errormsg": "Insufficient permissions. Access denied."}
#             return Response(status=401, data=context)

#         # Get all Airlines
#         all_airlines = Airline.objects.filter(enabled=True).select_related('payment_details').order_by('name')

#         # Serialize data
#         airline_serializer = AirlineSerializer(all_airlines, many=True)
#         return Response({
#             'all_airlines': airline_serializer.data,
#         })


# class GetGroupLeaders(generics.ListAPIView):
#     """
#     URL: get_group_leaders/
#     Descr: Gets all group leaders
#     """

#     serializer_class = LeaderSerializer

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def get(self, request):
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)
#         context = {"errormsg": ''}

#         # Permission
#         if not can_view(user.id, 'GL'):
#             context = {"errormsg": "Insufficient permissions. Access denied."}
#             return Response(status=401, data=context)

#         # Get all leaders
#         all_leaders = Contact.objects.filter(type='L', enabled=True).prefetch_related('flags').order_by('name')

#         # Serialize data
#         leader_serializer = LeaderSerializer(all_leaders, many=True)

#         return Response({
#             'all_leaders': leader_serializer.data,
#         })


# class GetAllHotels(generics.ListAPIView):
#     """
#     URL: get_all_hotels/
#     Descr: Gets all hotels
#     """

#     serializer_class = ReportsHotelSerializer

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def get(self, request):
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)
#         context = {"errormsg": ''}

#         # Permission
#         if not can_view(user.id, 'HTL'):
#             context = {"errormsg": "Insufficient permissions. Access denied."}
#             return Response(status=401, data=context)

#         # Get all hotels
#         all_hotels = Hotel.objects.filter(enabled=True).order_by('name')

#         # Serialize data
#         hotel_serializer = ReportsHotelSerializer(all_hotels, many=True)
#         return Response({
#             'all_hotels': hotel_serializer.data,
#         })


# class GetAllDrivers(generics.ListAPIView):
#     """
#     URL: get_all_drivers/
#     Descr: Gets all drivers
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def get(self, request):
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)
#         context = {"errormsg": ''}

#         # Permission
#         if not can_view(user.id, 'DRV'):
#             context = {"errormsg": "Insufficient permissions. Access denied."}
#             return Response(status=401, data=context)

#         # Get all drivers
#         all_drivers = Contact.objects.filter(type='D', enabled=True).order_by('-id').prefetch_related(
#             'notes'
#         ).prefetch_related('coach_operator_drivers').all()

#         driver_options = []
#         for driver in all_drivers:
#             driver_options.append({
#                 'id': str(driver.id),
#                 'name': driver.name,
#                 'coach_operator': driver.coach_operator_drivers.all()[0].name if driver.coach_operator_drivers.count() > 0
#                 else 'N/A',
#             })
#         return Response({
#             'all_drivers': driver_options,
#         })


# class GetAllCoaches(generics.ListAPIView):
#     """
#     URL: get_all_coaches/
#     Descr: Gets all coaches
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def get(self, request):
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)
#         context = {"errormsg": ''}

#         # Permission
#         if not can_view(user.id, 'CO'):
#             context = {"errormsg": "Insufficient permissions. Access denied."}
#             return Response(status=401, data=context)

#         # Get all coaches
#         all_coaches = [i for i in Coach.objects.filter(enabled=True).order_by('-id')]
#         coach_options = []
#         for coach in all_coaches:
#             coach_operator = CoachOperator.objects.get(id=coach.coach_operator_id).name
#             coach_options.append({
#                 'id': str(coach.id),
#                 'name': coach.make,
#                 'plate_number': coach.plate_number,
#                 'coach_operator': coach_operator,
#             })
#         return Response({
#             'all_coaches': coach_options,
#         })


# class GetAllCoachOperators(generics.ListAPIView):
#     """
#     URL: get_all_coach_operators/
#     Descr: Gets all clients
#     """
#     serializer_class = ReportsCoachOperatorSerializer

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def get(self, request):
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)
#         context = {"errormsg": ''}

#         # Permission
#         if not can_view(user.id, 'COP'):
#             context = {"errormsg": "Insufficient permissions. Access denied."}
#             return Response(status=401, data=context)

#         # Get all coach operators
#         all_coach_operators = CoachOperator.objects.filter(enabled=True).order_by('-id')

#         # Serialize data
#         coach_operator_serializer = ReportsCoachOperatorSerializer(all_coach_operators, many=True)
#         return Response({
#             'all_coach_operators': coach_operator_serializer.data,
#         })


# class GetAllRepairTypes(generics.ListAPIView):
#     """
#     URL: get_all_repair_shop_types/
#     Descr: Returns array of all repair types
#     """

#     serializer_class = RepairTypeSerializer

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'RTP'):
#             context = {"errormsg": "You do not have permission to view a Repair Type."}
#             return Response(status=401, data=context)

#         # Get All repair types
#         all_repair_types = RepairType.objects.all().order_by('description')
#         repair_type_serializer = RepairTypeSerializer(all_repair_types, many=True)
#         return Response({
#             'all_repair_shop_types': repair_type_serializer.data,
#         })


# class GetAllRestaurantTypes(generics.ListAPIView):
#     """
#     URL: get_all_restaurant_types/
#     Descr: Returns array of all restaurant types
#     """

#     serializer_class = RestaurantTypeSerializer

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'RST'):
#             context = {"errormsg": "You do not have permission to view a Restaurant."}
#             return Response(status=401, data=context)

#         # Get All restaurant types
#         all_restaurant_types = RestaurantType.objects.all().order_by('description')
#         restaurant_serializer = RestaurantTypeSerializer(all_restaurant_types, many=True)
#         return Response({
#             'all_restaurant_types': restaurant_serializer.data,
#         })


# class GetAllFerryTicketAgencies(generics.ListAPIView):
#     """
#     URL: get_all_ferry_ticket_agencies/
#     Descr: Gets All Ferry Ticket Agencies
#     """

#     serializer_class = FerryTicketAgencySerializer

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def get(self, request):
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)
#         context = {"errormsg": ''}

#         # Permission
#         if not can_view(user.id, 'FTA'):
#             context = {"errormsg": "Insufficient permissions. Access denied."}
#             return Response(status=401, data=context)

#         # Get all ferry ticket agencies
#         all_ferry_ticket_agencies = FerryTicketAgency.objects.filter(enabled=True).order_by('name')

#         # Serialize data
#         ferry_ticket_agency_serializer = FerryTicketAgencySerializer(all_ferry_ticket_agencies, many=True)
#         return Response({
#             'all_ferry_ticket_agencies': ferry_ticket_agency_serializer.data,
#         })


# class GetAllCruisingCompanies(generics.ListAPIView):
#     """
#     URL: get_all_cruising_companies/
#     Descr: Gets All Cruising Companies
#     """
#     serializer_class = CruisingCompanySerializer

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def get(self, request):
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)
#         context = {"errormsg": ''}

#         # Permission
#         if not can_view(user.id, 'CC'):
#             context = {"errormsg": "Insufficient permissions. Access denied."}
#             return Response(status=401, data=context)

#         # Get all cruising companies
#         all_cruising_companies = CruisingCompany.objects.filter(enabled=True).order_by('name')

#         # Serialize data
#         cruising_company_serializer = CruisingCompanySerializer(all_cruising_companies, many=True)
#         return Response({
#             'all_cruising_companies': cruising_company_serializer.data,
#         })


# class GetAllGuides(generics.ListAPIView):
#     """
#     URL: get_all_guides/
#     Descr: Gets All Guides
#     """

#     serializer_class = GuideSerializer

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def get(self, request):
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)
#         context = {"errormsg": ''}

#         # Permission
#         if not can_view(user.id, 'GD'):
#             context = {"errormsg": "Insufficient permissions. Access denied."}
#             return Response(status=401, data=context)

#         # Get all guides
#         all_guides = Guide.objects.filter(enabled=True).order_by('name')

#         # Serialize data
#         guide_serializer = GuideSerializer(all_guides, many=True)
#         return Response({
#             'all_guides': guide_serializer.data,
#         })


# class GetAllRestaurants(generics.ListAPIView):
#     """
#     URL: get_all_restaurants/
#     Descr: Gets All Restaurants
#     """
#     serializer_class = RestaurantSerializer

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def get(self, request):
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)
#         context = {"errormsg": ''}

#         # Permission
#         if not can_view(user.id, 'RST'):
#             context = {"errormsg": "Insufficient permissions. Access denied."}
#             return Response(status=401, data=context)

#         # Get all restaurants
#         all_restaurants = Restaurant.objects.filter(enabled=True).order_by('name')

#         # Serialize data
#         restaurant_serializer = RestaurantSerializer(all_restaurants, many=True)
#         return Response({
#             'all_restaurants': restaurant_serializer.data,
#         })


# class GetAllSportEventSuppliers(generics.ListAPIView):
#     """
#     URL: get_all_sport_event_suppliers/
#     Descr: Gets All Sport Event Suppliers
#     """

#     serializer_class = SportEventSupplierSerializer

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def get(self, request):
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)
#         context = {"errormsg": ''}

#         # Permission
#         if not can_view(user.id, 'SES'):
#             context = {"errormsg": "Insufficient permissions. Access denied."}
#             return Response(status=401, data=context)

#         # Get all sport event suppliers
#         all_sport_event_suppliers = SportEventSupplier.objects.filter(enabled=True).order_by('name')

#         # Serialize data
#         sport_event_supplier_serializer = SportEventSupplierSerializer(all_sport_event_suppliers, many=True)
#         return Response({
#             'all_sport_event_suppliers': sport_event_supplier_serializer.data,
#         })


# class GetAllEntertainmentSuppliers(generics.ListAPIView):
#     """
#     URL: get_all_entertainment_suppliers/
#     Descr: Gets All Entertainment Suppliers
#     """

#     serializer_class = EntertainmentSupplierSerializer

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def get(self, request):
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)
#         context = {"errormsg": ''}

#         # Permission
#         if not can_view(user.id, 'ES'):
#             context = {"errormsg": "Insufficient permissions. Access denied."}
#             return Response(status=401, data=context)

#         # Get all sport event suppliers
#         all_entertainment_suppliers = EntertainmentSupplier.objects.filter(enabled=True).order_by('name')

#         # Serialize data
#         entertainment_supplier_serializer = EntertainmentSupplierSerializer(all_entertainment_suppliers, many=True)
#         return Response({
#             'all_entertainment_suppliers': entertainment_supplier_serializer.data,
#         })


# class GetAllTeleferikCompanies(generics.ListAPIView):
#     """
#     URL: get_all_teleferik_companies/
#     Descr: Gets All Teleferik Companies
#     """

#     serializer_class = TeleferikCompanySerializer

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def get(self, request):
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)
#         context = {"errormsg": ''}

#         # Permission
#         if not can_view(user.id, 'TC'):
#             context = {"errormsg": "Insufficient permissions. Access denied."}
#             return Response(status=401, data=context)

#         # Get all teleferik companies
#         all_teleferik_companies = TeleferikCompany.objects.filter(enabled=True).order_by('name')

#         # Serialize data
#         teleferik_company_serializer = TeleferikCompanySerializer(all_teleferik_companies, many=True)
#         return Response({
#             'all_teleferik_companies': teleferik_company_serializer.data,
#         })


# class GetAllTheaters(generics.ListAPIView):
#     """
#     URL: get_all_theaters/
#     Descr: Gets All Teleferik Companies
#     """

#     serializer_class = TheaterSerializer

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def get(self, request):
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)
#         context = {"errormsg": ''}

#         # Permission
#         if not can_view(user.id, 'TH'):
#             context = {"errormsg": "Insufficient permissions. Access denied."}
#             return Response(status=401, data=context)

#         # Get all Theaters
#         all_theaters = Theater.objects.filter(enabled=True).order_by('name')

#         # Serialize data
#         theater_serializer = TheaterSerializer(all_theaters, many=True)
#         return Response({
#             'all_theaters': theater_serializer.data,
#         })


# class GetAllTrainTicketAgencies(generics.ListAPIView):
#     """
#     URL: get_all_train_ticket_agencies/
#     Descr: Gets All Train Ticket Agencies
#     """

#     serializer_class = TrainTicketAgencySerializer

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def get(self, request):
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)
#         context = {"errormsg": ''}

#         # Permission
#         if not can_view(user.id, 'TTA'):
#             context = {"errormsg": "Insufficient permissions. Access denied."}
#             return Response(status=401, data=context)

#         # Get All train ticket agencies
#         all_train_ticket_agencies = TrainTicketAgency.objects.filter(enabled=True).order_by('name')

#         # Serialize data
#         train_ticket_agency_serializer = TrainTicketAgencySerializer(all_train_ticket_agencies, many=True)
#         return Response({
#             'all_train_ticket_agencies': train_ticket_agency_serializer.data,
#         })


# class GetAllDestinationManagementCompanies(generics.ListAPIView):
#     """
#     URL: get_all_dmcs/
#     Descr: Gets All Destination Management Companies
#     """

#     serializer_class = DMCSerializer

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def get(self, request):
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)
#         context = {"errormsg": ''}

#         # Permission
#         if not can_view(user.id, 'DMC'):
#             context = {"errormsg": "Insufficient permissions. Access denied."}
#             return Response(status=401, data=context)

#         # Get all ground handling companies
#         all_dmcs = DMC.objects.filter(enabled=True).order_by('name')

#         # Serialize data
#         dmc_serializer = DMCSerializer(all_dmcs, many=True)
#         return Response({
#             'all_dmcs': dmc_serializer.data,
#         })


# class GetAllUsers(generics.ListAPIView):
#     """
#     URL: get_all_users/
#     Descr: Gets all Users
#     """

#     serializer_class = UserSerializer

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def get(self, request):
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)
#         context = {"errormsg": ''}

#         # Permission
#         if not can_view(user.id, 'USR'):
#             context = {"errormsg": "Insufficient permissions. Access denied."}
#             return Response(status=401, data=context)

#         # Get all users
#         all_users = User.objects.all().order_by('username')

#         # Serialize data
#         all_users_serializer = UserSerializer(all_users, many=True)
#         return Response({
#             'all_users': all_users_serializer.data,
#         })


# class GetNavNotifications(generics.ListAPIView):
#     """
#     URL: get_nav_notifications/
#     Descr: Gets notifications displayed at the navigation bar.
#     1) Pending groups
#     2) Expiring Documents
#     3) Conflicts
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def get(self, request):

#         notification_counter = NotificationCounter.objects.latest('id')

#         return Response({
#             'expired_documents': notification_counter.expired_documents,
#             'conflicts': notification_counter.conflicts,
#             'groups_data': notification_counter.groups_data,
#             'incomplete_data': notification_counter.incomplete_data,
#         })


# class GetAllAirportsRaw(generics.ListAPIView):
#     """
#     URL: get_all_airports_raw/
#     Descr: Gets all airports with raw SQL
#     """

#     serializer_class = AirportSerializer

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def get(self, request):
#         token_str = request.headers.get('User-Token')
#         user = get_user(token_str)
#         context = {"errormsg": ''}

#         # Permission
#         if not can_view(user.id, 'AP'):
#             context = {"errormsg": "Insufficient permissions. Access denied."}
#             return Response(status=401, data=context)

#         from django.db import connection
#         cursor = connection.cursor()

#         query = """
#             select * from webapp_airport where enabled = True;
#         """

#         cursor.execute(query)

#         all_airports = []

#         for row in cursor.fetchall():
#             all_airports.append({
#                 'name': row[0],
#                 'location': row[1],
#             })

#         connection.close()

#         return Response({
#             'all_airports': all_airports,
#         })


# class GetAirportTerminals(generics.ListAPIView):
#     """
#     URL: get_airport_terminals/
#     Descr: Get Airport Terminals
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def get(self, request):

#         # Get all repair shops
#         try:
#             airport_name = request.GET.get('airport').split(' - ')[0]
#             terminals = Terminal.objects.filter(airport_id=airport_name)

#         except Exception:
#             terminals = []

#         # Serialize data
#         terminal_serializer = TerminalSerializer(terminals, many=True)
#         return Response({
#             'all_terminals': terminal_serializer.data,
#         })


# class GetAllRepairShops(generics.ListAPIView):
#     """
#     URL: get_all_repair_shops/
#     Descr: Gets all repair shops
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def get(self, request):
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)
#         context = {"errormsg": ''}

#         # Permission
#         if not can_view(user.id, 'RSH'):
#             context = {"errormsg": "Insufficient permissions. Access denied."}
#             return Response(status=401, data=context)

#         # Get all repair shops
#         all_repair_shops = RepairShop.objects.filter(enabled=True).order_by('name')

#         # Serialize data
#         repair_shop_serializer = ReportsHotelSerializer(all_repair_shops, many=True)
#         return Response({
#             'all_repair_shops': repair_shop_serializer.data,
#         })


# class GetAllAttractions(generics.ListAPIView):
#     """
#     URL: get_all_attractions/
#     Descr: Gets all attractions
#     """

#     serializer_class = AttractionSerializer

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def get(self, request):
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)
#         context = {"errormsg": ''}

#         # Permission
#         if not can_view(user.id, 'ATT'):
#             context = {"errormsg": "Insufficient permissions. Access denied."}
#             return Response(status=401, data=context)

#         # Get All Agents
#         all_attractions = Attraction.objects.all()

#         # Serialize data
#         attraction_serializer = AttractionSerializer(all_attractions, many=True)
#         return Response({
#             'all_attractions': attraction_serializer.data,
#         })


# class GetAllPorts(generics.ListAPIView):
#     """
#     URL: get_all_ports/
#     Descr: Gets all ports
#     """

#     serializer_class = PortSerializer

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def get(self, request):
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)
#         context = {"errormsg": ''}

#         # Permission
#         if not can_view(user.id, 'PRT'):
#             context = {"errormsg": "Insufficient permissions. Access denied."}
#             return Response(status=401, data=context)

#         # Get All Agents
#         all_ports = Port.objects.filter(enabled=True)

#         # Serialize data
#         port_serializer = PortSerializer(all_ports, many=True)
#         return Response({
#             'all_ports': port_serializer.data,
#         })


# class GetAllRailwayStations(generics.ListAPIView):
#     """
#     URL: get_all_railway_stations/
#     Descr: Gets all railway_stations
#     """

#     serializer_class = RailwayStationSerializer

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def get(self, request):
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)
#         context = {"errormsg": ''}

#         # Permission
#         if not can_view(user.id, 'RS'):
#             context = {"errormsg": "Insufficient permissions. Access denied."}
#             return Response(status=401, data=context)

#         # Get All Agents
#         all_railway_stations = RailwayStation.objects.filter(enabled=True)

#         # Serialize data
#         railway_station_serializer = RailwayStationSerializer(all_railway_stations, many=True)
#         return Response({
#             'all_railway_stations': railway_station_serializer.data,
#         })


# class GetHotel(generics.ListAPIView):
#     """
#     URL: get_hotel/
#     Descr: Get's Hotel information based on name
#     """

#     serializer_class = HotelSerializer

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def get(self, request, hotel_name):

#         # Get Hotel
#         hotel = Hotel.objects.get(name=request.GET.get('hotel_name'))
#         contracts = Contract.objects.filter(hotel_id=hotel.id).select_related('document')
#         date = request.GET.get('date')
#         related_contract = None

#         # Given input string
#         for contract in contracts:

#             # Get the list of dates in the range
#             dates_list = get_dates_in_range(contract.period)

#             # Check if "2023-07-05" is in the list
#             if date in dates_list and contract.status:
#                 related_contract = contract

#         return Response({
#             'hotel': self.get_serializer(hotel, context={'request': self.request}).data,
#             'contract': ContractSerializer(related_contract, many=False).data if related_contract is not None else False
#         })


# class GetEntertainmentSupplier(generics.ListAPIView):
#     """
#     URL: get_entertainment_supplier/
#     Descr: Gets Entertainment Supplier based on name
#     """

#     serializer_class = EntertainmentSupplierSerializer

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def get(self, request, entertainment_supplier_name):

#         print(entertainment_supplier_name)

#         # Get EntertainmentSupplier
#         entertainment_supplier = EntertainmentSupplier.objects.get(name=entertainment_supplier_name)

#         return Response({
#             'entertainment_supplier': self.get_serializer(entertainment_supplier, context={'request': self.request}).data,
#         })


# class GetAgent(generics.ListAPIView):
#     """
#     URL: get_agent/
#     Descr: Get Agent based on name
#     """

#     serializer_class = AgentSerializer

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def get(self, request, agent_name):

#         agent = Agent.objects.get(name=request.GET.get('agent_name'))

#         return Response({
#             'agent': self.get_serializer(agent, context={'request': self.request}).data,
#         })


# class GetAllParkingLots(generics.ListAPIView):
#     """
#     URL: get_all_parking_lots/
#     Descr: Gets All Parking Lots
#     """

#     serializer_class = ParkingLotSerializer

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def get(self, request):
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)
#         context = {"errormsg": ''}

#         # Permission
#         if not can_view(user.id, 'TTA'):
#             context = {"errormsg": "Insufficient permissions. Access denied."}
#             return Response(status=401, data=context)

#         # Get All train ticket agencies
#         all_parking_lots = ParkingLot.objects.filter(enabled=True).order_by('name')

#         # Serialize data
#         parking_lot_serializer = ParkingLotSerializer(all_parking_lots, many=True)
#         return Response({
#             'all_parking_lots': parking_lot_serializer.data,
#         })


# class GetPaymentDetails(generics.ListAPIView):

#     serializer_class = HotelSerializer

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def get(self, request):
#         obj_type = request.GET.get('obj_type')
#         obj_name = request.GET.get('obj_name')

#         if obj_type == 'AG':
#             obj = Agent.objects.get(name=obj_name)
#         elif obj_type == 'AL':
#             obj = Airline.objects.get(name=obj_name)
#         elif obj_type == 'CO':
#             obj = CoachOperator.objects.get(name=obj_name)
#         elif obj_type == 'CCO':
#             obj = CruisingCompany.objects.get(name=obj_name)
#         elif obj_type == 'DMC':
#             obj = DMC.objects.get(name=obj_name)
#         elif obj_type == 'FTA':
#             obj = FerryTicketAgency.objects.get(name=obj_name)
#         elif obj_type == 'GD':
#             obj = Guide.objects.get(name=obj_name)
#         elif obj_type == 'HTL':
#             obj = Hotel.objects.get(name=obj_name)
#         elif obj_type == 'RS':
#             obj = RepairShop.objects.get(name=obj_name)
#         elif obj_type == 'RST':
#             obj = Restaurant.objects.get(name=obj_name)
#         elif obj_type == 'SES':
#             obj = SportEventSupplier.objects.get(name=obj_name)
#         elif obj_type == 'TC':
#             obj = TeleferikCompany.objects.get(name=obj_name)
#         elif obj_type == 'TH':
#             obj = Theater.objects.get(name=obj_name)
#         elif obj_type == 'TTA':
#             obj = TrainTicketAgency.objects.get(name=obj_name)

#         payment_details = {
#             'company': obj.name,
#             'currency': obj.payment_details.currency,
#             'iban': obj.payment_details.iban,
#             'swift': obj.payment_details.swift,
#         }

#         # Serialize data
#         return Response({
#             'payment_details': payment_details
#         })


# class GetAllHotelCategories(generics.ListAPIView):
#     """
#     URL: get_all_hotel_categories/
#     Descr: Gets all Hotel Categories
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def get(self, request):
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)
#         context = {"errormsg": ''}

#         # Permission
#         if not can_view(user.id, 'HTL'):
#             context = {"errormsg": "Insufficient permissions. Access denied."}
#             return Response(status=401, data=context)

#         # Get all credit_cards
#         all_hotel_categories = HotelCategory.objects.all()

#         # Serialize data
#         hotel_category_serializer = HotelCategorySerializer(all_hotel_categories, many=True)
#         return Response({
#             'all_hotel_categories': hotel_category_serializer.data,
#         })


# class GetAllCoachOperatorCategories(generics.ListAPIView):
#     """
#     URL: get_all_coach_operator_categories/
#     Descr: Gets all Hotel Categories
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def get(self, request):
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)
#         context = {"errormsg": ''}

#         # Permission
#         if not can_view(user.id, 'COP'):
#             context = {"errormsg": "Insufficient permissions. Access denied."}
#             return Response(status=401, data=context)

#         # Get all credit_cards
#         all_coach_operator_categories = CoachOperatorCategory.objects.all()

#         # Serialize data
#         coach_operator_category_serializer = CoachOperatorCategorySerializer(all_coach_operator_categories, many=True)
#         return Response({
#             'all_coach_operator_categories': coach_operator_category_serializer.data,
#         })


# class GetTraveldaysByDaterange(generics.ListAPIView):
#     """
#     URL: get_traveldays_by_daterange/
#     Descr: Gets Traveldays for payment order by a start and an end date
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def get(self, request):
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)
#         context = {"errormsg": ''}

#         # Permission
#         if not can_view(user.id, 'GT'):
#             context = {"errormsg": "Insufficient permissions. Access denied."}
#             return Response(status=401, data=context)

#         start_date = request.GET.get('start_date')
#         end_date = request.GET.get('end_date')

#         # Get group's traveldays
#         all_traveldays = TravelDay.objects.filter(
#             hotel__isnull=False,
#             date__range=[start_date, end_date],
#         )

#         # Serialize data
#         travelday_serializer = TravelDaySerializer(all_traveldays, many=True)

#         return Response({
#             'all_traveldays': travelday_serializer.data,
#         })


# class GetAllContinents(generics.ListAPIView):
#     """
#     URL: get_all_continents/
#     Descr: Gets all continents
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def get(self, request):
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)
#         context = {"errormsg": ''}

#         # Try to fetch from cache first
#         cached_continents = cache.get('all_continents')
#         if cached_continents:
#             return Response({'all_continents': cached_continents})

#         # Permission
#         if not can_view(user.id, 'PLC'):
#             context = {"errormsg": "Insufficient permissions. Access denied."}
#             return Response(status=401, data=context)

#         # Get all Countries
#         all_continents = Continent.objects.all()

#         # Serialize data
#         continent_serializer = ContinentSerializer(all_continents, many=True)

#         cache.set('all_continents', continent_serializer.data)

#         return Response({
#             'all_continents': continent_serializer.data,
#         })


# class GetAllCountries(generics.ListAPIView):
#     """
#     URL: get_all_countries/
#     Descr: Gets all countries
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def get(self, request):
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)
#         context = {"errormsg": ''}

#         # Try to fetch from cache first
#         cached_countries = cache.get('all_countries')
#         if cached_countries:
#             return Response({'all_countries': cached_countries})

#         # Permission
#         if not can_view(user.id, 'PLC'):
#             context = {"errormsg": "Insufficient permissions. Access denied."}
#             return Response(status=401, data=context)

#         # Get all Countries
#         all_countries = Country.objects.order_by('name')

#         # Serialize data
#         country_serializer = CountrySerializer(all_countries, many=True)

#         cache.set('all_countries', country_serializer.data)

#         return Response({
#             'all_countries': country_serializer.data,
#         })


# class GetAllStates(generics.ListAPIView):
#     """
#     URL: get_all_states/
#     Descr: Gets all states
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def get(self, request):
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)
#         context = {"errormsg": ''}

#         # Try to fetch from cache first
#         cached_states = cache.get('all_states')
#         if cached_states:
#             return Response({'all_states': cached_states})

#         # Permission
#         if not can_view(user.id, 'PLC'):
#             context = {"errormsg": "Insufficient permissions. Access denied."}
#             return Response(status=401, data=context)

#         # Get all Countries
#         all_states = State.objects.all()

#         # Serialize data
#         state_serializer = StateSerializer(all_states, many=True)

#         cache.set('all_states', state_serializer.data)

#         return Response({
#             'all_states': state_serializer.data,
#         })


# class GetAllCities(generics.ListAPIView):
#     """
#     URL: get_all_cities/
#     Descr: Gets all cities
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def get(self, request):
#         token_str = request.headers.get('User-Token')
#         if not token_str:
#             return Response(status=400, data={"errormsg": "User-Token header is missing."})

#         # Try to fetch from cache first
#         cached_cities = cache.get('all_cities')
#         if cached_cities:
#             return Response({'all_cities': cached_cities})

#         user = get_user(token_str)
#         context = {"errormsg": ''}

#         # Permission
#         if not can_view(user.id, 'PLC'):
#             context = {"errormsg": "Insufficient permissions. Access denied."}
#             return Response(status=401, data=context)

#         # Get all Cities
#         all_cities = City.objects.prefetch_related('country')

#         # Serialize data
#         city_serializer = CitySerializer(all_cities, many=True)

#         # Cache the result
#         cache.set('all_cities', city_serializer.data)

#         return Response({'all_cities': city_serializer.data})


# class GetAllAreas(generics.ListAPIView):
#     """
#     URL: get_all_areas/
#     Descr: Gets all areas
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def get(self, request):
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)
#         context = {"errormsg": ''}

#         cached_areas = cache.get('all_areas')
#         if cached_areas:
#             return Response({'all_areas': cached_areas})

#         # Permission
#         if not can_view(user.id, 'PLC'):
#             context = {"errormsg": "Insufficient permissions. Access denied."}
#             return Response(status=401, data=context)

#         # Get all Countries
#         all_areas = Area.objects.all()

#         # Serialize data
#         area_serializer = AreaSerializer(all_areas, many=True)

#         # Cache the result
#         cache.set('all_areas', area_serializer.data)

#         return Response({
#             'all_areas': area_serializer.data,
#         })


# class GetAllCharterBrokers(generics.ListAPIView):
#     """
#     URL: get_all_charter_brokers/
#     Descr: Gets all clients
#     """
#     serializer_class = CharterBrokerSerializer

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def get(self, request):
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)
#         context = {"errormsg": ''}

#         # Permission
#         if not can_view(user.id, 'CB'):
#             context = {"errormsg": "Insufficient permissions. Access denied."}
#             return Response(status=401, data=context)

#         # Get all Charter Brokers
#         all_charter_brokers = CharterBroker.objects.filter(enabled=True).order_by('-id')

#         # Serialize data
#         charter_broker_serializer = CharterBrokerSerializer(all_charter_brokers, many=True)
#         return Response({
#             'all_charter_brokers': charter_broker_serializer.data,
#         })
