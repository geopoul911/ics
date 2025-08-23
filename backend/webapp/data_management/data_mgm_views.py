# # from django.shortcuts import render
# from webapp.models import (
#     GroupTransfer,
#     Agent,
#     Client,
#     TravelDay,
#     Hotel,
#     Contact,
#     Coach,
#     CoachOperator,
#     RepairShop,
#     Airline,
#     Airport,
#     Attraction,
#     Guide,
#     Port,
#     FerryTicketAgency,
#     Restaurant,
#     Theater,
#     SportEventSupplier,
#     CruisingCompany,
#     TeleferikCompany,
#     DMC,
#     Service,
#     TrainTicketAgency,
#     TextTemplate,
#     RailwayStation,
#     Contract,
#     ParkingLot,
#     Continent,
#     Country,
#     State,
#     City,
#     Area,
#     EntertainmentSupplier,
#     CarHireCompany,
#     AdvertisementCompany,
#     CharterBroker,
#     Aircraft,
# )
# from django.db import connection
# from django.views.decorators.csrf import csrf_exempt
# import datetime
# from rest_framework.authtoken.models import Token
# from rest_framework import generics
# from rest_framework.response import Response
# from webapp.serializers import (
#     ContactSerializer,
#     AgentSerializer,
#     ClientSerializer,
#     HotelSerializer,
#     CoachOperatorSerializer,
#     CoachSerializer,
#     RepairShopSerializer,
#     AirlineSerializer,
#     AirportSerializer,
#     AttractionSerializer,
#     GuideSerializer,
#     PortSerializer,
#     EntertainmentSupplierSerializer,
#     FerryTicketAgencySerializer,
#     RestaurantSerializer,
#     TheaterSerializer,
#     SportEventSupplierSerializer,
#     CruisingCompanySerializer,
#     TeleferikCompanySerializer,
#     DMCSerializer,
#     TrainTicketAgencySerializer,
#     ServiceSerializer,
#     TextTemplateSerializer,
#     RailwayStationSerializer,
#     ContractSerializer,
#     ParkingLotSerializer,
#     ContinentSerializer,
#     CountrySerializer,
#     StateSerializer,
#     CitySerializer,
#     AreaSerializer,
#     CarHireCompanySerializer,
#     AdvertisementCompanySerializer,
#     CharterBrokerSerializer,
#     AircraftSerializer,
# )

# from accounts.permissions import (
#     can_view,
# )

# # Sort by date in refcode (DDMMYYYY)
# def extract_date(item):
#     import re
#     match = re.search(r'\d{8}', item['refcode'])
#     if match:
#         return datetime.datetime.strptime(match.group(), '%d%m%Y')
#     return datetime.max  # Put invalid ones at the bottom


# TEXT_TEMPLATE_TYPES = {
#     'AI': 'Additional Information',
#     'I': 'Included',
#     'NI': 'Not Included',
#     'N': 'Notes',
#     'EP': 'Entry Price',
#     'PC': 'Payment & Cancellation Policy',
#     'CP': 'Children Policy',
#     'EL': 'Epilogue',
# }

# ctypes_to_str = {
#     'AG': 'Agent',
#     'AL': 'Airline',
#     'CO': 'Coach Operator',
#     'CC': 'Cruising Company',
#     'DM': 'DMC',
#     'FT': 'Ferry Ticket Agency',
#     'HT': 'Hotel',
#     'SE': 'Sport Event Supplier',
#     'TH': 'Theater',
#     'TT': 'Train Ticket Agency',
# }


# # Returns user instance
# def get_user(token):
#     user = Token.objects.get(key=token).user
#     return user


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


# class AllAgents(generics.RetrieveAPIView):
#     """
#     URL: all_agents/
#     Descr: Returns array of all Agents
#     """

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'AGN'):
#             context = {"errormsg": "You do not have permission to view all Agents."}
#             return Response(status=401, data=context)

#         # Get all Agents
#         agents = Agent.objects.select_related('contact').all().select_related(
#             'nationality'
#         ).all().order_by('-id').prefetch_related('notes').all()
#         agents_data = []

#         for agent in agents:
#             notes = True if agent.notes.count() > 0 else False
#             agents_data.append({
#                 'id': agent.id,
#                 'name': agent.name,
#                 'address': agent.contact.address if agent.contact else 'N/A',
#                 'tel': str(agent.contact.tel) + ' - ' + str(agent.contact.tel2) + ' - ' + str(agent.contact.tel3) if agent.contact else 'N/A',
#                 'email': str(agent.contact.email) if agent.contact else 'N/A',
#                 'abbreviation': str(agent.abbreviation) if agent.abbreviation else 'N/A',
#                 'enabled': agent.enabled,
#                 'nationality': agent.nationality.name if agent.nationality else 'N/A',
#                 'country_code': agent.nationality.code if agent.nationality else 'N/A',
#                 'notes': notes,
#                 'region': agent.region,
#                 'icon': agent.icon,
#             })

#         return Response({
#             'all_agents': agents_data,
#         })


# class AgentView(generics.ListAPIView):
#     """
#     URL: agent/(?P<agent_id>.*)$
#     Descr: Get Agent's Data
#     """

#     serializer_class = AgentSerializer

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request, agent_id):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'AGN'):
#             context = {"errormsg": "You do not have permission to view Agent."}
#             return Response(status=401, data=context)

#         agent = Agent.objects.get(id=agent_id)

#         group_data = []

#         groups = GroupTransfer.objects.filter(agent_id=agent.id)

#         can_view_COA = not can_view(user.id, 'COA')
#         can_view_COL = not can_view(user.id, 'COL')

#         for group in groups:
#             if group.refcode.startswith('COA') and can_view_COA:
#                 continue
#             if group.refcode.startswith('COL') and can_view_COL:
#                 continue

#             group_data.append({
#                 'id': group.id,
#                 'refcode': group.refcode,
#                 'status': 'Confirmed' if group.status == '5' else 'Cancelled',
#                 'number_of_people': group.number_of_people,
#             })

#         group_data.sort(key=extract_date, reverse=True)
#         return Response({
#             'agent': self.get_serializer(agent, context={'request': self.request}).data,
#             'groups': group_data,
#         })


# class AllAirlines(generics.RetrieveAPIView):
#     """
#     URL: all_airlines/
#     Descr: Returns array of all Airlines
#     """

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'AL'):
#             context = {"errormsg": "You do not have permission to view All Airlines."}
#             return Response(status=401, data=context)

#         # Get all airlines
#         all_airlines = [i for i in Airline.objects.all().order_by('-id')]
#         airline_options = []

#         for airline in all_airlines:
#             airline_options.append({
#                 'id': airline.id,
#                 'name': airline.name if airline.name else 'N/A',
#                 'abbreviation': airline.abbreviation if airline.abbreviation else 'N/A',
#                 'enabled': airline.enabled,
#             })

#         return Response({
#             'all_airlines': airline_options,
#         })


# class AirlineView(generics.ListAPIView):
#     """
#     URL: airline/(?P<airline_id>.*)$
#     Descr: Get Airline's Data
#     """

#     serializer_class = AirlineSerializer

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request, airline_id):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'AL'):
#             context = {"errormsg": "You do not have permission to view an Airline."}
#             return Response(status=401, data=context)

#         # Get Airline
#         airline = Airline.objects.get(id=airline_id)

#         return Response({
#             'airline': self.get_serializer(airline, context={'request': self.request}).data,
#         })


# class AllAirports(generics.RetrieveAPIView):
#     """
#     URL: all_airports/
#     Descr: Returns array of all Airports
#     """

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'AP'):
#             context = {"errormsg": "You do not have permission to view All Airports."}
#             return Response(status=401, data=context)

#         # Get all Airports
#         all_airports = Airport.objects.all().order_by('name')
#         airport_options = []
#         for airport in all_airports:
#             airport_options.append({
#                 'name': airport.name if airport.name else 'N/A',
#                 'location': airport.location if airport.location else 'N/A',
#                 'lat_lng': str(airport.lat) + ' / ' + str(airport.lng),
#                 'region': airport.region,
#                 'enabled': airport.enabled,
#             })

#         return Response({
#             'all_airports': airport_options,
#         })


# class AirportView(generics.ListAPIView):
#     """
#     URL: airport/(?P<airport_name>.*)$
#     Descr: Get Airport's Data
#     """

#     serializer_class = AirportSerializer

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request, airport_name):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'AP'):
#             context = {"errormsg": "You do not have permission to view an Airport."}
#             return Response(status=401, data=context)

#         # Get Airport
#         airport = Airport.objects.get(name=airport_name)

#         return Response({
#             'airport': self.get_serializer(airport, context={'request': self.request}).data,
#         })


# class AttractionView(generics.ListAPIView):
#     """
#     URL: attraction/(?P<attraction_id>.*)$
#     Descr: Get Attraction's Data
#     """

#     serializer_class = AttractionSerializer

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request, attraction_id):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'ATT'):
#             context = {"errormsg": "You do not have permission to view Attraction."}
#             return Response(status=401, data=context)

#         # Get Attraction
#         attraction = Attraction.objects.get(id=attraction_id)

#         return Response({
#             'attraction': self.get_serializer(attraction, context={'request': self.request}).data,
#         })


# class AllAttractions(generics.RetrieveAPIView):
#     """
#     URL: all_attractionss/
#     Descr: Returns array of all Attractions
#     """

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'ATT'):
#             context = {"errormsg": "You do not have permission to view Attractions."}
#             return Response(status=401, data=context)

#         # Get all Attractions
#         attractions = Attraction.objects.all().select_related('place').all().order_by(
#             '-id'
#         ).prefetch_related('notes').all()
#         attractions_data = []

#         # Loop over groups to get the front end's table data
#         for attraction in attractions:
#             notes = True if attraction.notes.count() > 0 else False
#             attractions_data.append({
#                 'id': attraction.id,
#                 'name': attraction.name,
#                 'region': attraction.region,
#                 'type': str(attraction.type),
#                 'lat_lng': str(attraction.lat) + ' / ' + str(attraction.lng),
#                 'notes': notes,
#             })

#         return Response({
#             'all_attractions': attractions_data,
#         })


# class AllClients(generics.RetrieveAPIView):
#     """
#     URL: all_clients/
#     Descr: Returns array of all Clients
#     """

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'CLN'):
#             context = {"errormsg": "You do not have permission to view all Clients."}
#             return Response(status=401, data=context)

#         # Get all Clients
#         clients = Client.objects.select_related('contact').all().select_related(
#             'nationality'
#         ).all().order_by('-id').prefetch_related('notes').all()
#         clients_data = []

#         # Loop over clients to get the front end's table data
#         for client in clients:
#             notes = True if client.notes.count() > 0 else False
#             clients_data.append({
#                 'id': client.id,
#                 'name': client.name,
#                 'address': client.contact.address if client.contact else 'N/A',
#                 'tel': str(client.contact.tel) + ' - ' + str(client.contact.tel2) + ' - ' + str(client.contact.tel3) if client.contact else 'N/A',
#                 'email': str(client.contact.email) if client.contact else 'N/A',
#                 'abbreviation': str(client.abbreviation) if client.abbreviation else 'N/A',
#                 'nationality': client.nationality.name if client.nationality else 'N/A',
#                 'country_code': client.nationality.code if client.nationality else 'N/A',
#                 'notes': notes,
#                 'enabled': client.enabled,
#             })

#         return Response({
#             'all_clients': clients_data,
#         })


# class ClientView(generics.ListAPIView):
#     """
#     URL: client/(?P<agent_id>.*)$
#     Descr: Get Client's Data
#     """

#     serializer_class = ClientSerializer

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request, client_id):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'CLN'):
#             context = {"errormsg": "You do not have permission to view Client."}
#             return Response(status=401, data=context)

#         client = Client.objects.get(id=client_id)

#         group_data = []

#         groups = GroupTransfer.objects.filter(client_id=client.id)

#         can_view_COA = not can_view(user.id, 'COA')
#         can_view_COL = not can_view(user.id, 'COL')

#         for group in groups:
#             if group.refcode.startswith('COA') and can_view_COA:
#                 continue
#             if group.refcode.startswith('COL') and can_view_COL:
#                 continue

#             group_data.append({
#                 'id': group.id,
#                 'refcode': group.refcode,
#                 'status': 'Confirmed' if group.status == '5' else 'Cancelled',
#                 'number_of_people': group.number_of_people,
#             })

#         group_data.sort(key=extract_date, reverse=True)
#         return Response({
#             'client': self.get_serializer(client, context={'request': self.request}).data,
#             'groups': group_data,
#         })


# class AllCoaches(generics.RetrieveAPIView):
#     """
#     URL: all_coaches/
#     Descr: Returns array of all Coaches
#     """

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'CO'):
#             context = {"errormsg": "You do not have permission to view All Coaches."}
#             return Response(status=401, data=context)

#         # Get All Coaches
#         all_coaches = Coach.objects.all().order_by('-id').prefetch_related('notes').all()
#         coach_options = []

#         for coach in all_coaches:
#             notes = True if coach.notes.count() > 0 else False
#             coach_operator = CoachOperator.objects.get(id=coach.coach_operator_id)
#             coach_options.append({
#                 'id': coach.id,
#                 'make': coach.make if coach.make else 'N/A',
#                 'body_number': coach.body_number if coach.body_number else 'N/A',
#                 'plate_number': coach.plate_number if coach.plate_number else 'N/A',
#                 'passenger_seats': coach.number_of_seats if coach.number_of_seats else 'N/A',
#                 'emission_stds': 'Euro ' + str(coach.emission) if coach.emission else 'N/A',
#                 'year': coach.year if coach.year else 'N/A',
#                 'coach_operator': coach_operator.name,
#                 'notes': notes,
#                 'enabled': coach.enabled,
#             })


#         return Response({
#             'all_coaches': coach_options,

#         })


# class CoachView(generics.ListAPIView):
#     """
#     URL: coach/(?P<coach_id>.*)$
#     Descr: Get Coach's Data
#     """

#     serializer_class = CoachSerializer

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request, coach_id):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'CO'):
#             context = {"errormsg": "You do not have permission to view a Coach."}
#             return Response(status=401, data=context)

#         # Get Coach
#         coach = Coach.objects.get(id=coach_id)

#         group_data = []

#         groups = GroupTransfer.objects.filter(
#             group_travelday__coach=coach
#         ).distinct()

#         can_view_COA = not can_view(user.id, 'COA')
#         can_view_COL = not can_view(user.id, 'COL')

#         for group in groups:
#             if group.refcode.startswith('COA') and can_view_COA:
#                 continue
#             if group.refcode.startswith('COL') and can_view_COL:
#                 continue

#             group_data.append({
#                 'id': group.id,
#                 'refcode': group.refcode,
#                 'status': 'Confirmed' if group.status == '5' else 'Cancelled',
#                 'number_of_people': group.number_of_people,
#             })

#         group_data.sort(key=extract_date, reverse=True)

#         return Response({
#             'coach': self.get_serializer(coach, context={'request': self.request}).data,
#             'groups': group_data,
#         })


# class AllCoachOperators(generics.RetrieveAPIView):
#     """
#     URL: all_coach_operators/
#     Descr: Returns array of all Coach Operators
#     """

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'COP'):
#             context = {"errormsg": "You do not have permission to view all Coach Operators."}
#             return Response(status=401, data=context)

#         coach_operator_data = []
#         from django.db import connection

#         cursor = connection.cursor()
#         query = """
#             SELECT
#                 CO.id,
#                 CO.name,
#                 c.tel,
#                 c.address,
#                 c.email,
#                 c.website,
#                 CO.region,
#                 pl.country,
#                 pl.city,
#                 CO.enabled,
#                 STRING_AGG(cat.name, ', ') AS categories,
#                 CASE
#                     WHEN COUNT(doc.id) > 0 THEN TRUE
#                     ELSE FALSE
#                 END AS has_documents
#             FROM
#                 WEBAPP_COACHOPERATOR CO
#             LEFT JOIN
#                 WEBAPP_CONTACT c ON CO.contact_id = c.id
#             LEFT JOIN
#                 WEBAPP_PLACE pl ON CO.place_id = pl.id
#             LEFT JOIN
#                 webapp_coachoperator_categories coc ON CO.id = coc.coachoperator_id
#             LEFT JOIN
#                 WEBAPP_COACHOPERATORCATEGORY cat ON coc.coachoperatorcategory_id = cat.id
#             LEFT JOIN
#                 webapp_coachoperator_documents cod ON CO.id = cod.coachoperator_id
#             LEFT JOIN
#                 WEBAPP_DOCUMENT doc ON cod.document_id = doc.id
#             GROUP BY
#                 CO.id, CO.name, c.tel, c.address, c.email, c.website, CO.region, pl.country, pl.city, CO.enabled
#             ORDER BY
#                 CO.id DESC;

#         """
#         cursor.execute(query)

#         for row in cursor.fetchall():
#             coach_operator_data.append({
#                 'id': row[0],
#                 'name': row[1],
#                 'tel': row[2],
#                 'address': row[3],
#                 'email': row[4],
#                 'website': row[5],
#                 'region': row[6],
#                 'place': str(row[7]) + ' - ' + str(row[8]),
#                 'enabled': row[9],
#                 'categories': row[10],
#                 'tariff': row[11],
#             })

#         return Response({'all_coach_operators': coach_operator_data})


# class CoachOperatorView(generics.ListAPIView):
#     """
#     URL: coach_operator/(?P<coach_operator_id>.*)$
#     Descr: Get Coach Operator's Data
#     """

#     serializer_class = CoachOperatorSerializer

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request, coach_operator_id):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'COP'):
#             context = {"errormsg": "You do not have permission to view Coach Operator."}
#             return Response(status=401, data=context)

#         coach_operator = CoachOperator.objects.get(id=coach_operator_id)

#         group_data = []

#         groups = GroupTransfer.objects.filter(
#             group_travelday__coach__coach_operator=coach_operator
#         ).distinct()

#         coaches = Coach.objects.filter(coach_operator_id=coach_operator.id)

#         can_view_COA = not can_view(user.id, 'COA')
#         can_view_COL = not can_view(user.id, 'COL')

#         for group in groups:
#             if group.refcode.startswith('COA') and can_view_COA:
#                 continue
#             if group.refcode.startswith('COL') and can_view_COL:
#                 continue

#             group_data.append({
#                 'id': group.id,
#                 'refcode': group.refcode,
#                 'status': 'Confirmed' if group.status == '5' else 'Cancelled',
#                 'number_of_people': group.number_of_people,
#             })

#         group_data.sort(key=extract_date, reverse=True)
#         return Response({
#             'coach_operator': self.get_serializer(coach_operator, context={'request': self.request}).data,
#             'all_coaches': CoachSerializer(coaches, many=True).data,
#             'groups': group_data,
#         })


# class AllCruisingCompanies(generics.RetrieveAPIView):
#     """
#     URL: all_cruising_companies/
#     Descr: Returns array of all Cruising Companies
#     """

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'CC'):
#             context = {"errormsg": "You do not have permission to view all Cruising Companies."}
#             return Response(status=401, data=context)

#         # Get Cruising company
#         all_cruising_companies = CruisingCompany.objects.all().order_by('-id')

#         cruising_company_options = []
#         for cruising_company in all_cruising_companies:
#             cruising_company_options.append({
#                 'id': cruising_company.id,
#                 'name': cruising_company.name,
#                 'address': cruising_company.contact.address if cruising_company.contact else 'N/A',
#                 'tel': str(cruising_company.contact.tel) + ' - ' + str(cruising_company.contact.tel2) + ' - ' + str(cruising_company.contact.tel3),
#                 'email': str(cruising_company.contact.email) if cruising_company.contact.email else 'N/A',
#                 'region': cruising_company.region,
#                 'website': str(cruising_company.contact.website) if cruising_company.contact.website else 'N/A',
#                 'lat_lng': str(cruising_company.lat) + ' / ' + str(cruising_company.lng),
#                 'enabled': cruising_company.enabled,
#             })

#         return Response({
#             'all_cruising_companies': cruising_company_options,
#         })


# class CruisingCompanyView(generics.ListAPIView):
#     """
#     URL: cruising_company/(?P<cruising_company_id>.*)$
#     Descr: Get Cruising Company's Data
#     """
#     serializer_class = CruisingCompanySerializer

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request, cruising_company_id):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'CC'):
#             context = {"errormsg": "You do not have permission to view Cruising Company."}
#             return Response(status=401, data=context)

#         # Get Cruising Company
#         cruising_company = CruisingCompany.objects.get(id=cruising_company_id)

#         group_data = []

#         groups = GroupTransfer.objects.filter(
#             group_travelday__travelday_service__cruising_company=cruising_company
#         ).distinct()

#         can_view_COA = not can_view(user.id, 'COA')
#         can_view_COL = not can_view(user.id, 'COL')

#         for group in groups:
#             if group.refcode.startswith('COA') and can_view_COA:
#                 continue
#             if group.refcode.startswith('COL') and can_view_COL:
#                 continue

#             group_data.append({
#                 'id': group.id,
#                 'refcode': group.refcode,
#                 'status': 'Confirmed' if group.status == '5' else 'Cancelled',
#                 'number_of_people': group.number_of_people,
#             })

#         group_data.sort(key=extract_date, reverse=True)
#         return Response({
#             'cruising_company': self.get_serializer(cruising_company, context={'request': self.request}).data,
#             'groups': group_data,
#         })


# class AllDrivers(generics.RetrieveAPIView):
#     """
#     URL: all_drivers/
#     Descr: Returns array of all Drivers
#     """

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'DRV'):
#             context = {"errormsg": "You do not have permission to view all Drivers."}
#             return Response(status=401, data=context)

#         # Get all Drivers
#         all_drivers = Contact.objects.filter(type='D').order_by('-id').prefetch_related(
#             'notes'
#         ).prefetch_related('coach_operator_drivers').all()
#         driver_options = []
#         for driver in all_drivers:
#             # True if driver has at least one note
#             notes = True if driver.notes.count() > 0 else False

#             driver_options.append({
#                 'id': driver.id,
#                 'name': driver.name,
#                 'address': driver.address if driver.address else 'N/A',
#                 'tel': str(driver.tel) + ' - ' + str(driver.tel2) + ' - ' + str(driver.tel3),
#                 'email': str(driver.email) if driver.email else 'N/A',
#                 'coach_operator': driver.coach_operator_drivers.all()[0].name if driver.coach_operator_drivers.count() > 0 else 'N/A',
#                 'notes': notes,
#                 'region': driver.region,
#                 'enabled': driver.enabled,
#             })
#         return Response({
#             'all_drivers': driver_options,
#         })


# class DriverView(generics.ListAPIView):
#     """
#     URL: driver/(?P<driver_id>.*)$
#     Descr: Get Driver's Data
#     """

#     serializer_class = ContactSerializer

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request, driver_id):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'DRV'):
#             context = {"errormsg": "You do not have permission to view Driver."}
#             return Response(status=401, data=context)

#         group_data = []

#         # Get Driver
#         driver = Contact.objects.get(id=driver_id)

#         try:
#             # Name might return more than one coach operator, so we slice the query
#             coach_operator = CoachOperator.objects.filter(drivers=driver)[0].name
#         except Exception:
#             coach_operator = 'N/A'

#         groups = GroupTransfer.objects.filter(group_travelday__driver_id=driver.id).distinct()

#         can_view_COA = not can_view(user.id, 'COA')
#         can_view_COL = not can_view(user.id, 'COL')

#         for group in groups:
#             if group.refcode.startswith('COA') and can_view_COA:
#                 continue
#             if group.refcode.startswith('COL') and can_view_COL:
#                 continue

#             group_data.append({
#                 'id': group.id,
#                 'refcode': group.refcode,
#                 'status': 'Confirmed' if group.status == '5' else 'Cancelled',
#                 'number_of_people': group.number_of_people,
#             })

#         group_data.sort(key=extract_date, reverse=True)
#         return Response({
#             'driver': self.get_serializer(driver, context={'request': self.request}).data,
#             'coach_operator': coach_operator,
#             'groups': group_data,
#         })


# class AllFerryTicketAgencies(generics.RetrieveAPIView):
#     """
#     URL: all_ferry_ticket_agencies/
#     Descr: Returns array of all Ferry Ticket Agencies
#     """

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'FTA'):
#             context = {"errormsg": "You do not have permission to view all Ferry Ticket Agencies."}
#             return Response(status=401, data=context)

#         # Get all Ferry Ticket Agencies
#         all_ferry_ticket_agencies = FerryTicketAgency.objects.all().order_by('-id')
#         ferry_ticket_agency_options = []

#         for ferry_ticket_agency in all_ferry_ticket_agencies:
#             ferry_ticket_agency_options.append({
#                 'id': ferry_ticket_agency.id,
#                 'name': ferry_ticket_agency.name,
#                 'region': ferry_ticket_agency.region,
#                 'address': ferry_ticket_agency.contact.address if ferry_ticket_agency.contact else 'N/A',
#                 'tel': str(ferry_ticket_agency.contact.tel) + ' - ' + str(ferry_ticket_agency.contact.tel2) + ' - ' + str(ferry_ticket_agency.contact.tel3),
#                 'email': str(ferry_ticket_agency.contact.email) if ferry_ticket_agency.contact.email else 'N/A',
#                 'website': str(ferry_ticket_agency.contact.website) if ferry_ticket_agency.contact.website else 'N/A',
#                 'lat_lng': str(ferry_ticket_agency.lat) + ' / ' + str(ferry_ticket_agency.lng),
#                 'enabled': ferry_ticket_agency.enabled,
#             })

#         return Response({
#             'all_ferry_ticket_agencies': ferry_ticket_agency_options,
#         })


# class FerryTicketAgencyView(generics.ListAPIView):
#     """
#     URL: ferry_ticket_agency/(?P<ferry_ticket_agency_id>.*)$
#     Descr: Get Ferry Ticket Agency's Data
#     """

#     serializer_class = FerryTicketAgencySerializer

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request, ferry_ticket_agency_id):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'FTA'):
#             context = {"errormsg": "You do not have permission to view Ferry Ticket Agency."}
#             return Response(status=401, data=context)

#         # Get Ferry Ticket Agency
#         ferry_ticket_agency = FerryTicketAgency.objects.get(id=ferry_ticket_agency_id)

#         group_data = []

#         groups = GroupTransfer.objects.filter(
#             group_travelday__travelday_service__ferry_ticket_agency=ferry_ticket_agency
#         ).distinct()

#         can_view_COA = not can_view(user.id, 'COA')
#         can_view_COL = not can_view(user.id, 'COL')

#         for group in groups:
#             if group.refcode.startswith('COA') and can_view_COA:
#                 continue
#             if group.refcode.startswith('COL') and can_view_COL:
#                 continue

#             group_data.append({
#                 'id': group.id,
#                 'refcode': group.refcode,
#                 'status': 'Confirmed' if group.status == '5' else 'Cancelled',
#                 'number_of_people': group.number_of_people,
#             })

#         group_data.sort(key=extract_date, reverse=True)


#         return Response({
#             'ferry_ticket_agency': self.get_serializer(ferry_ticket_agency, context={'request': self.request}).data,
#             'groups': group_data,
#         })


# class AllDMCs(generics.RetrieveAPIView):
#     """
#     URL: all_dmcs/
#     Descr: Returns array of all Destination Management Companies
#     """

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'DMC'):
#             context = {"errormsg": "You do not have permission to view all Destination Management Companies."}
#             return Response(status=401, data=context)

#         # Get all Destination Management Companies
#         all_dmcs = DMC.objects.all().order_by('-id')

#         dmc_options = []
#         for dmc in all_dmcs:
#             language_info = []
#             # Get DMC's countries operating
#             for language in dmc.countries_operating.all():
#                 language_info.append({
#                     'id': language.id,
#                     'name': language.name,
#                     'code': language.code,
#                 })

#             dmc_options.append({
#                 'id': dmc.id,
#                 'name': dmc.name,
#                 'region': dmc.region,
#                 'address': dmc.contact.address if dmc.contact else 'N/A',
#                 'tel': str(dmc.contact.tel) + ' - ' + str(dmc.contact.tel2) + ' - ' + str(dmc.contact.tel3),
#                 'email': str(dmc.contact.email) if dmc.contact.email else 'N/A',
#                 'languages': language_info,
#                 'website': str(dmc.contact.website) if dmc.contact.website else 'N/A',
#                 'lat_lng': str(dmc.lat) + ' / ' + str(dmc.lng),
#                 'enabled': dmc.enabled,
#             })

#         return Response({
#             'all_dmcs': dmc_options,
#         })


# class DMCView(generics.ListAPIView):
#     """
#     URL: dmc/(?P<dmc_id>.*)$
#     Descr: Get Destination Management Company's Data
#     """

#     serializer_class = DMCSerializer

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request, dmc_id):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'DMC'):
#             context = {"errormsg": "You do not have permission to view Destination Management Company."}
#             return Response(status=401, data=context)

#         dmc = DMC.objects.get(id=dmc_id)


#         group_data = []
#         groups = GroupTransfer.objects.filter(
#             group_travelday__travelday_service__dmc=dmc
#         ).distinct()

#         can_view_COA = not can_view(user.id, 'COA')
#         can_view_COL = not can_view(user.id, 'COL')

#         for group in groups:
#             if group.refcode.startswith('COA') and can_view_COA:
#                 continue
#             if group.refcode.startswith('COL') and can_view_COL:
#                 continue

#             group_data.append({
#                 'id': group.id,
#                 'refcode': group.refcode,
#                 'status': 'Confirmed' if group.status == '5' else 'Cancelled',
#                 'number_of_people': group.number_of_people,
#             })

#         group_data.sort(key=extract_date, reverse=True)

#         return Response({
#             'dmc': self.get_serializer(
#                 dmc, context={'request': self.request}
#             ).data,
#             'groups': group_data,
#         })


# class AllGroupLeaders(generics.RetrieveAPIView):
#     """
#     URL: all_group_leaders/
#     Descr: Returns array of all Group Leaders
#     """

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'GL'):
#             context = {"errormsg": "You do not have permission to view All Group Leaders."}
#             return Response(status=401, data=context)

#         # Get All Group Leaders
#         all_group_leaders = Contact.objects.filter(type='L').order_by('-id').prefetch_related('notes').all()
#         group_leader_options = []

#         for group_leader in all_group_leaders:

#             language_info = []
#             # Get Guide's languages
#             for language in group_leader.flags.all():
#                 language_info.append({
#                     'id': language.id,
#                     'name': language.name,
#                     'code': language.code,
#                 })

#             notes = True if group_leader.notes.count() > 0 else False
#             group_leader_options.append({
#                 'id': group_leader.id,
#                 'name': group_leader.name,
#                 'address': group_leader.address if group_leader.address else 'N/A',
#                 'tel': str(group_leader.tel) + ' - ' + str(group_leader.tel2) + ' - ' + str(group_leader.tel3),
#                 'email': str(group_leader.email) if group_leader.email else 'N/A',
#                 'rating': group_leader.rating if group_leader.rating else 'N/A',
#                 'notes': notes,
#                 'languages': language_info,
#                 'region': group_leader.region,
#                 'enabled': group_leader.enabled,
#             })

#         return Response({
#             'all_group_leaders': group_leader_options,
#         })


# class GroupLeaderView(generics.ListAPIView):
#     """
#     URL: group_leader/(?P<group_leader_id>.*)$
#     Descr: Get Group Leader's Data
#     """

#     serializer_class = ContactSerializer

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request, group_leader_id):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'GL'):
#             context = {"errormsg": "You do not have permission to view Group Leader."}
#             return Response(status=401, data=context)

#         group_data = []

#         # Get Group Leader
#         group_leader = Contact.objects.get(id=group_leader_id)

#         groups = GroupTransfer.objects.filter(group_travelday__leader_id=group_leader.id).distinct()

#         can_view_COA = not can_view(user.id, 'COA')
#         can_view_COL = not can_view(user.id, 'COL')

#         for group in groups:
#             if group.refcode.startswith('COA') and can_view_COA:
#                 continue
#             if group.refcode.startswith('COL') and can_view_COL:
#                 continue

#             group_data.append({
#                 'id': group.id,
#                 'refcode': group.refcode,
#                 'status': 'Confirmed' if group.status == '5' else 'Cancelled',
#                 'number_of_people': group.number_of_people,
#             })

#         group_data.sort(key=extract_date, reverse=True)
#         return Response({
#             'group_leader': self.get_serializer(group_leader, context={'request': self.request}).data,
#             'groups': group_data,
#         })


# class AllGuides(generics.RetrieveAPIView):
#     """
#     URL: all_guides/
#     Descr: Returns array of all Guides
#     """

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'GD'):
#             context = {"errormsg": "You do not have permission to view all guides."}
#             return Response(status=401, data=context)

#         # Get All Guides
#         all_guides = Guide.objects.all().order_by('-id').prefetch_related('notes').all()
#         guide_options = []

#         for guide in all_guides:
#             # True if guide has at least one note
#             notes = True if guide.notes.count() > 0 else False
#             language_info = []

#             # Get Guide's languages
#             for language in guide.flags.all():
#                 language_info.append({
#                     'id': language.id,
#                     'name': language.name,
#                     'code': language.code,
#                 })

#             guide_options.append({
#                 'id': guide.id,
#                 'name': guide.name,
#                 'address': guide.contact.address if guide.contact else 'N/A',
#                 'tel': str(guide.contact.tel) + ' - ' + str(guide.contact.tel2) + ' - ' + str(guide.contact.tel3),
#                 'email': str(guide.contact.email) if guide.contact.email else 'N/A',
#                 'website': str(guide.contact.website) if guide.contact.website else 'N/A',
#                 'region': guide.region,
#                 'languages': language_info,
#                 'notes': notes,
#                 'enabled': guide.enabled,
#             })

#         return Response({
#             'all_guides': guide_options,
#         })


# class GuideView(generics.ListAPIView):
#     """
#     URL: guide/(?P<guide_id>.*)$
#     Descr: Get Guide's Data
#     """
#     serializer_class = GuideSerializer

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request, guide_id):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'GD'):
#             context = {"errormsg": "You do not have permission to view Guide."}
#             return Response(status=401, data=context)

#         # Get Guide
#         guide = Guide.objects.get(id=guide_id)

#         group_data = []

#         groups = GroupTransfer.objects.filter(
#             group_travelday__travelday_service__guide=guide
#         ).distinct()

#         can_view_COA = not can_view(user.id, 'COA')
#         can_view_COL = not can_view(user.id, 'COL')

#         for group in groups:
#             if group.refcode.startswith('COA') and can_view_COA:
#                 continue
#             if group.refcode.startswith('COL') and can_view_COL:
#                 continue

#             group_data.append({
#                 'id': group.id,
#                 'refcode': group.refcode,
#                 'status': 'Confirmed' if group.status == '5' else 'Cancelled',
#                 'number_of_people': group.number_of_people,
#             })

#         group_data.sort(key=extract_date, reverse=True)

#         return Response({
#             'guide': self.get_serializer(guide, context={'request': self.request}).data,
#             'groups': group_data,
#         })


# class AllHotels(generics.RetrieveAPIView):
#     """
#     URL: all_hotels/
#     Descr: Returns array of all hotels
#     """

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'HTL'):
#             context = {"errormsg": "You do not have permission to view Hotels."}
#             return Response(status=401, data=context)

#         hotels_data = []
#         from django.db import connection

#         cursor = connection.cursor()
#         query = """
#             SELECT h.id, h.name, h.rating, h.region, c.address, c.tel, c.email, c.website, h.enabled
#             FROM WEBAPP_HOTEL h
#                 INNER JOIN WEBAPP_CONTACT c
#                 ON h.contact_id = c.id
#             ORDER BY ID DESC
#         """
#         cursor.execute(query)

#         for row in cursor.fetchall():
#             hotels_data.append({
#                 'id': row[0],
#                 'name': row[1],
#                 'rating': row[2],
#                 'region': row[3],
#                 'address': row[4],
#                 'tel': row[5],
#                 'email': row[6],
#                 'website': row[7],
#                 'enabled': row[8],
#             })

#         return Response({'all_hotels': hotels_data})


# class HotelView(generics.ListAPIView):
#     """
#     URL: hotel/(?P<hotel_id>.*)$
#     Descr: Get Hotel's Data
#     """
#     serializer_class = HotelSerializer

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def get(self, request, hotel_id):

#         # Get Hotel
#         hotel = Hotel.objects.get(id=hotel_id)
#         contracts = Contract.objects.filter(hotel_id=hotel.id)
#         date = request.GET.get('date')
#         related_contract = None

#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         group_data = []

#         # Given input string
#         for contract in contracts:

#             # Get the list of dates in the range
#             dates_list = get_dates_in_range(contract.period)

#             # Check if "2023-07-05" is in the list
#             if date in dates_list and contract.status:
#                 related_contract = contract

#         tds = TravelDay.objects.filter(hotel_id=hotel.id)

#         # Serialize the hotel data
#         hotel_data = self.get_serializer(hotel, context={'request': self.request}).data

#         hotel_data['tds'] = []

#         for td in tds:
#             hotel_data['tds'].append(
#                 {
#                     'id': td.id,
#                     'group': GroupTransfer.objects.get(id=td.group_transfer_id).refcode,
#                     'date': td.date,
#                 }
#             )

#         groups = GroupTransfer.objects.filter(group_travelday__hotel_id=hotel.id).distinct()

#         can_view_COA = not can_view(user.id, 'COA')
#         can_view_COL = not can_view(user.id, 'COL')

#         for group in groups:
#             if group.refcode.startswith('COA') and can_view_COA:
#                 continue
#             if group.refcode.startswith('COL') and can_view_COL:
#                 continue

#             group_data.append({
#                 'id': group.id,
#                 'refcode': group.refcode,
#                 'status': 'Confirmed' if group.status == '5' else 'Cancelled',
#                 'number_of_people': group.number_of_people,
#             })

#         group_data.sort(key=extract_date, reverse=True)

#         return Response({
#             'hotel': hotel_data,
#             'contract': ContractSerializer(related_contract, many=False).data if related_contract is not None else False,
#             'groups': group_data,
#         })


# class AllPorts(generics.RetrieveAPIView):
#     """
#     URL: all_ports/
#     Descr: Returns array of all Ports
#     """

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'PRT'):
#             context = {"errormsg": "You do not have permission to view all Ports."}
#             return Response(status=401, data=context)

#         # Get all Ports
#         all_ports = Port.objects.all().order_by('-id')

#         port_options = []
#         for port in all_ports:
#             port_options.append({
#                 'id': port.id,
#                 'name': port.name,
#                 'code': port.codethree if port.codethree else 'N/A',
#                 'lat_lng': str(port.lat) + ' / ' + str(port.lng),
#                 'enabled': port.enabled,
#                 'nationality': port.nationality.name if port.nationality else 'N/A',
#                 'nationality_code': port.nationality.code if port.nationality else 'N/A',
#             })

#         return Response({
#             'all_ports': port_options,
#         })


# class AllRailwayStations(generics.RetrieveAPIView):
#     """
#     URL: all_railway_stations/
#     Descr: Returns array of all Ports
#     """

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'RS'):
#             context = {"errormsg": "You do not have permission to view all Railway Stations."}
#             return Response(status=401, data=context)

#         # Get all RailwayStations
#         all_railway_stations = RailwayStation.objects.all().select_related('nationality').order_by('-id')

#         railway_station_options = []
#         for railway_station in all_railway_stations:
#             railway_station_options.append({
#                 'id': railway_station.id,
#                 'name': railway_station.name,
#                 'code': railway_station.codethree if railway_station.codethree else 'N/A',
#                 'lat_lng': str(railway_station.lat) + ' / ' + str(railway_station.lng),
#                 'enabled': railway_station.enabled,
#                 'nationality': railway_station.nationality.name if railway_station.nationality else 'N/A',
#                 'nationality_code': railway_station.nationality.code if railway_station.nationality else 'N/A',
#             })

#         return Response({
#             'all_railway_stations': railway_station_options,
#         })


# class RailwayStationView(generics.ListAPIView):
#     """
#     URL: railway_station/(?P<railway_station_id>.*)$
#     Descr: Get Railway Station's Data
#     """

#     serializer_class = RailwayStationSerializer

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request, railway_station_id):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'RS'):
#             context = {"errormsg": "You do not have permission to view Railway Stations."}
#             return Response(status=401, data=context)

#         # Get RailwayStation
#         railway_station = RailwayStation.objects.get(id=railway_station_id)

#         return Response({
#             'railway_station': self.get_serializer(railway_station, context={'request': self.request}).data,
#         })


# class PortView(generics.ListAPIView):
#     """
#     URL: port/(?P<port_id>.*)$
#     Descr: Get Port's Data
#     """

#     serializer_class = PortSerializer

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request, port_id):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'PRT'):
#             context = {"errormsg": "You do not have permission to view Port."}
#             return Response(status=401, data=context)

#         # Get Port
#         port = Port.objects.get(id=port_id)

#         return Response({
#             'port': self.get_serializer(port, context={'request': self.request}).data,
#         })


# class AllRepairShops(generics.RetrieveAPIView):
#     """
#     URL: all_repair_shops/
#     Descr: Returns array of all repair shops
#     """

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'RSH'):
#             context = {"errormsg": "You do not have permission to view All Repair Shops."}
#             return Response(status=401, data=context)

#         # Get All Repair Shops
#         all_repair_shops = RepairShop.objects.select_related(
#             'contact'
#         ).all().order_by('-id').prefetch_related('notes').all()
#         repair_shop_options = []

#         # Get repair shops and types
#         for repair_shop in all_repair_shops:
#             type_info = []
#             notes = True if repair_shop.notes.count() > 0 else False
#             for type in repair_shop.type.all():
#                 type_info.append({
#                     'id': type.id,
#                     'description': type.description,
#                     'icon': type.icon,
#                 })

#             repair_shop_options.append({
#                 'id': repair_shop.id,
#                 'name': repair_shop.name,
#                 'region': repair_shop.region,
#                 'address': repair_shop.contact.address if repair_shop.contact else 'N/A',
#                 'tel': str(repair_shop.contact.tel) + ' - ' + str(repair_shop.contact.tel2) + ' - ' + str(repair_shop.contact.tel3) if repair_shop.contact else 'N/A',
#                 'email': str(repair_shop.contact.email) if repair_shop.contact else 'N/A',
#                 'lat_lng': str(repair_shop.lat) + ' / ' + str(repair_shop.lng),
#                 'type': type_info,
#                 'notes': notes,
#                 'enabled': repair_shop.enabled,
#             })

#         return Response({
#             'all_repair_shops': repair_shop_options,
#         })


# class RepairShopView(generics.ListAPIView):
#     """
#     URL: repair_shop/(?P<repair_shop_id>.*)$
#     Descr: Get Repair Shop's Data
#     """

#     serializer_class = RepairShopSerializer

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request, repair_shop_id):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'RSH'):
#             context = {"errormsg": "You do not have permission to view a Repair Shop."}
#             return Response(status=401, data=context)

#         # Get Repair shop
#         repair_shop = RepairShop.objects.get(id=repair_shop_id)

#         return Response({
#             'repair_shop': self.get_serializer(repair_shop, context={'request': self.request}).data,
#         })


# class AllRestaurants(generics.RetrieveAPIView):
#     """
#     URL: all_restauants/
#     Descr: Returns array of all restauants
#     """

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'RST'):
#             context = {"errormsg": "You do not have permission to view Restaurant."}
#             return Response(status=401, data=context)

#         # Get all Restaurants
#         restaurants = Restaurant.objects.select_related('contact').all().order_by('-id').prefetch_related('notes').all()
#         restaurants_data = []

#         # Loop over restaurants to get the front end's table data
#         for restaurant in restaurants:
#             # True if restaurant has at least 1 note
#             type_info = []
#             notes = True if restaurant.notes.count() > 0 else False
#             for type in restaurant.type.all():
#                 type_info.append({
#                     'id': type.id,
#                     'description': type.description,
#                     'icon': type.icon,
#                 })
#             restaurants_data.append({
#                 'id': restaurant.id,
#                 'name': restaurant.name,
#                 'rating': restaurant.rating,
#                 'region': restaurant.region,
#                 'address': restaurant.contact.address if restaurant.contact else 'N/A',
#                 'tel': str(restaurant.contact.tel) + ' - ' + str(restaurant.contact.tel2) + ' - ' + str(restaurant.contact.tel3) if restaurant.contact else 'N/A',
#                 'email': str(restaurant.contact.email) if restaurant.contact else 'N/A',
#                 'website': str(restaurant.contact.website) if restaurant.contact else 'N/A',
#                 'lat_lng': str(restaurant.lat) + ' / ' + str(restaurant.lng),
#                 'notes': notes,
#                 'capacity': str(restaurant.capacity),
#                 'enabled': restaurant.enabled,
#                 'type': type_info,
#             })

#         return Response({
#             'all_restaurants': restaurants_data,
#         })


# class RestaurantView(generics.ListAPIView):
#     """
#     URL: restaurant/(?P<restaurant_id>.*)$
#     Descr: Get Restaurant's Data
#     """

#     serializer_class = RestaurantSerializer

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request, restaurant_id):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'RST'):
#             context = {"errormsg": "You do not have permission to view Restaurant."}
#             return Response(status=401, data=context)

#         # Get Restaurant
#         restaurant = Restaurant.objects.get(id=restaurant_id)
#         group_data = []

#         groups = GroupTransfer.objects.filter(
#             group_travelday__travelday_service__restaurant=restaurant
#         ).distinct()

#         can_view_COA = not can_view(user.id, 'COA')
#         can_view_COL = not can_view(user.id, 'COL')

#         for group in groups:
#             if group.refcode.startswith('COA') and can_view_COA:
#                 continue
#             if group.refcode.startswith('COL') and can_view_COL:
#                 continue

#             group_data.append({
#                 'id': group.id,
#                 'refcode': group.refcode,
#                 'status': 'Confirmed' if group.status == '5' else 'Cancelled',
#                 'number_of_people': group.number_of_people,
#             })

#         group_data.sort(key=extract_date, reverse=True)

#         return Response({
#             'restaurant': self.get_serializer(restaurant, context={'request': self.request}).data,
#             'groups': group_data,
#         })


# class AllServices(generics.RetrieveAPIView):
#     """
#     URL: get_all_services/
#     Descr: Gets All Services
#     """

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'SRV'):
#             context = {"errormsg": "You do not have permission to view all Services."}
#             return Response(status=401, data=context)

#         # Get all services
#         services = Service.objects.all().order_by('-id')

#         # Filter based on dates
#         all_services = []

#         # Get service's related objects
#         for service in services:
#             hotel = Hotel.objects.get(id=service.hotel_id).name if service.hotel else 'N/A'
#             airline = Airline.objects.get(id=service.airline_id).name if service.airline else 'N/A'
#             dmc = DMC.objects.get(
#                 id=service.dmc_id
#             ).name if service.dmc else 'N/A'
#             ferry_ticket_agency = FerryTicketAgency.objects.get(
#                 id=service.ferry_ticket_agency_id
#             ).name if service.ferry_ticket_agency else 'N/A'
#             cruising_company = CruisingCompany.objects.get(
#                 id=service.cruising_company_id
#             ).name if service.cruising_company else 'N/A'
#             guide = Guide.objects.get(id=service.guide_id).name if service.guide else 'N/A'
#             restaurant = Restaurant.objects.get(id=service.restaurant_id).name if service.restaurant else 'N/A'
#             sport_event_supplier = SportEventSupplier.objects.get(
#                 id=service.sport_event_supplier_id
#             ).name if service.sport_event_supplier else 'N/A'
#             teleferik_company = TeleferikCompany.objects.get(
#                 id=service.teleferik_company_id
#             ).name if service.teleferik_company else 'N/A'
#             theater = Theater.objects.get(id=service.theater_id).name if service.theater else 'N/A'
#             tour_leader = Contact.objects.get(id=service.tour_leader_id).name if service.tour_leader else 'N/A'
#             train_ticket_agency = TrainTicketAgency.objects.get(
#                 id=service.train_ticket_agency_id
#             ).name if service.train_ticket_agency else 'N/A'

#             # Get group and travelday
#             try:
#                 td = TravelDay.objects.get(id=service.travelday_id)
#                 refcode = GroupTransfer.objects.get(id=td.group_transfer_id).refcode
#             except Exception:
#                 td = None
#                 refcode = 'N/A'

#             # If travelday belongs to a group
#             if td:
#                 if td.group_transfer_id:
#                     can_view_COA = can_view(user.id, 'COA')
#                     can_view_COL = can_view(user.id, 'COL')
#                     if refcode.startswith("COA") and not can_view_COA:
#                         continue
#                     if refcode.startswith("COL") and not can_view_COL:
#                         continue

#                     all_services.append({
#                         'id': service.id,
#                         'price': service.price,
#                         'refcode': refcode,
#                         'description': service.description if service.description else 'N/A',
#                         'service_type': service.service_type,
#                         'travelday_id': service.travelday_id,
#                         'start_time': service.start_time,
#                         'date': service.date,
#                         'hotel': hotel,
#                         'sgl': service.sgl if service.sgl else 'N/A',
#                         'dbl': service.dbl if service.dbl else 'N/A',
#                         'twin': service.twin if service.twin else 'N/A',
#                         'trpl': service.trpl if service.trpl else 'N/A',
#                         'quad': service.quad if service.quad else 'N/A',
#                         'meal_desc': service.meal_desc if service.meal_desc else 'N/A',
#                         'airline': airline,
#                         'dmc': dmc,
#                         'ferry_ticket_agency': ferry_ticket_agency,
#                         'cruising_company': cruising_company,
#                         'guide': guide,
#                         'restaurant': restaurant,
#                         'sport_event_supplier': sport_event_supplier,
#                         'teleferik_company': teleferik_company,
#                         'theater': theater,
#                         'tour_leader': tour_leader,
#                         'train_ticket_agency': train_ticket_agency,
#                     })

#         return Response({
#             'all_services': all_services,
#         })


# class ServiceView(generics.ListAPIView):
#     """
#     URL: service/(?P<service_id>.*)$
#     Descr: Get Service's Data
#     """

#     serializer_class = ServiceSerializer

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request, service_id):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'SRV'):
#             context = {"errormsg": "You do not have permission to view Service."}
#             return Response(status=401, data=context)

#         # Get Service
#         service = Service.objects.get(id=service_id)

#         # Get TravelDay
#         td = TravelDay.objects.get(id=service.travelday_id)

#         # Get Group
#         group = GroupTransfer.objects.get(id=td.group_transfer_id)

#         return Response({
#             'service': self.get_serializer(service, context={'request': self.request}).data,
#             'refcode': group.refcode,
#             'status': 200,
#         })


# class AllSportEventSuppliers(generics.RetrieveAPIView):
#     """
#     URL: all_sport_event_suppliers/
#     Descr: Returns array of all Sport Event Suppliers
#     """

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'SES'):
#             context = {"errormsg": "You do not have permission to view Sport Event Supplier."}
#             return Response(status=401, data=context)

#         # Get all Sport Event Suppliers
#         sport_event_suppliers = SportEventSupplier.objects.all().order_by('-id')
#         sport_event_suppliers_data = []

#         # Loop over Sport Event Suppliers to get the front end's table data
#         for ses in sport_event_suppliers:
#             sport_event_suppliers_data.append({
#                 'id': ses.id,
#                 'name': ses.name,
#                 'region': ses.region,
#                 'lat_lng': str(ses.lat) + ' / ' + str(ses.lng),
#                 'address': ses.contact.address if ses.contact else 'N/A',
#                 'tel': str(ses.contact.tel) + ' - ' + str(ses.contact.tel2) + ' - ' + str(ses.contact.tel3) if ses.contact else 'N/A',
#                 'email': str(ses.contact.email) if ses.contact else 'N/A',
#                 'website': str(ses.contact.website) if ses.contact else 'N/A',
#                 'enabled': ses.enabled,
#             })

#         return Response({
#             'all_sport_event_suppliers': sport_event_suppliers_data,
#         })


# class SportEventSupplierView(generics.ListAPIView):
#     """
#     URL: sport_event_supplier/(?P<sport_event_supplier_id>.*)$
#     Descr: Get Sport Event Supplier's Data
#     """

#     serializer_class = SportEventSupplierSerializer

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request, sport_event_supplier_id):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'SES'):
#             context = {"errormsg": "You do not have permission to view Sport Event Supplier."}
#             return Response(status=401, data=context)

#         # Get Sport Event Supplier
#         sport_event_supplier = SportEventSupplier.objects.get(id=sport_event_supplier_id)

#         group_data = []

#         groups = GroupTransfer.objects.filter(
#             group_travelday__travelday_service__sport_event_supplier=sport_event_supplier
#         ).distinct()

#         can_view_COA = not can_view(user.id, 'COA')
#         can_view_COL = not can_view(user.id, 'COL')

#         for group in groups:
#             if group.refcode.startswith('COA') and can_view_COA:
#                 continue
#             if group.refcode.startswith('COL') and can_view_COL:
#                 continue

#             group_data.append({
#                 'id': group.id,
#                 'refcode': group.refcode,
#                 'status': 'Confirmed' if group.status == '5' else 'Cancelled',
#                 'number_of_people': group.number_of_people,
#             })

#         group_data.sort(key=extract_date, reverse=True)
#         return Response({
#             'sport_event_supplier': self.get_serializer(sport_event_supplier, context={'request': self.request}).data,
#             'groups': group_data,
#         })


# class AllTeleferikCompanies(generics.RetrieveAPIView):
#     """
#     URL: all_teleferik_companies/
#     Descr: Returns array of all Teleferik Companies
#     """

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'TC'):
#             context = {"errormsg": "You do not have permission to view all Teleferik Companies."}
#             return Response(status=401, data=context)

#         # Get Teleferik Companies
#         all_teleferik_companies = TeleferikCompany.objects.all().order_by('-id')

#         teleferik_company_options = []
#         for teleferik_company in all_teleferik_companies:
#             teleferik_company_options.append({
#                 'id': teleferik_company.id,
#                 'name': teleferik_company.name,
#                 'region': teleferik_company.region,
#                 'address': teleferik_company.contact.address if teleferik_company.contact else 'N/A',
#                 'tel': str(teleferik_company.contact.tel) + ' - ' + str(teleferik_company.contact.tel2) + ' - ' + str(teleferik_company.contact.tel3),
#                 'email': str(teleferik_company.contact.email) if teleferik_company.contact.email else 'N/A',
#                 'website': str(teleferik_company.contact.website) if teleferik_company.contact.website else 'N/A',
#                 'lat_lng': str(teleferik_company.lat) + ' / ' + str(teleferik_company.lng),
#                 'enabled': teleferik_company.enabled,
#             })

#         return Response({
#             'all_teleferik_companies': teleferik_company_options,
#         })


# class TeleferikCompanyView(generics.ListAPIView):
#     """
#     URL: teleferik_company/(?P<teleferik_company_id>.*)$
#     Descr: Get Teleferik Company's Data
#     """

#     serializer_class = TeleferikCompanySerializer

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request, teleferik_company_id):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'TC'):
#             context = {"errormsg": "You do not have permission to view Teleferik Company."}
#             return Response(status=401, data=context)

#         # Get Teleferik Company
#         teleferik_company = TeleferikCompany.objects.get(id=teleferik_company_id)

#         return Response({
#             'teleferik_company': self.get_serializer(teleferik_company, context={'request': self.request}).data,
#         })


# class AllCarHireCompanies(generics.RetrieveAPIView):
#     """
#     URL: all_car_hire_companies/
#     Descr: Returns array of all Car Hiring Companies
#     """

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # # Permission
#         if not can_view(user.id, 'CH'):
#             context = {"errormsg": "You do not have permission to view all Car Hiring Companies."}
#             return Response(status=401, data=context)

#         # Get Teleferik Companies
#         all_car_hire_companies = CarHireCompany.objects.all().order_by('-id')

#         car_hire_company_options = []
#         for car_hire_company in all_car_hire_companies:
#             car_hire_company_options.append({
#                 'id': car_hire_company.id,
#                 'name': car_hire_company.name,
#                 'region': car_hire_company.region,
#                 'address': car_hire_company.contact.address if car_hire_company.contact else 'N/A',
#                 'tel': str(car_hire_company.contact.tel) + ' - ' + str(car_hire_company.contact.tel2) + ' - ' + str(car_hire_company.contact.tel3),
#                 'email': str(car_hire_company.contact.email) if car_hire_company.contact.email else 'N/A',
#                 'website': str(car_hire_company.contact.website) if car_hire_company.contact.website else 'N/A',
#                 'lat_lng': str(car_hire_company.lat) + ' / ' + str(car_hire_company.lng),
#                 'enabled': car_hire_company.enabled,
#             })

#         return Response({
#             'all_car_hire_companies': car_hire_company_options,
#         })


# class CarHireCompanyView(generics.ListAPIView):
#     """
#     URL: car_hire_company/(?P<car_hire_company_id>.*)$
#     Descr: Get Car Hiring Company's Data
#     """

#     serializer_class = CarHireCompanySerializer

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request, car_hire_company_id):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'CH'):
#             context = {"errormsg": "You do not have permission to view Car Hire Company."}
#             return Response(status=401, data=context)

#         # Get Car Hire Company
#         car_hire_company = CarHireCompany.objects.get(id=car_hire_company_id)

#         return Response({
#             'car_hire_company': self.get_serializer(car_hire_company, context={'request': self.request}).data,
#         })


# class AllAdvertisementCompanies(generics.RetrieveAPIView):
#     """
#     URL: all_advertisement_companies/
#     Descr: Returns array of all Advertisement Companies
#     """

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # # Permission
#         if not can_view(user.id, 'AD'):
#             context = {"errormsg": "You do not have permission to view all Advertisement Companies."}
#             return Response(status=401, data=context)

#         # Get Teleferik Companies
#         all_advertisement_companies = AdvertisementCompany.objects.all().order_by('-id')

#         advertisement_company_options = []
#         for advertisement_company in all_advertisement_companies:
#             advertisement_company_options.append({
#                 'id': advertisement_company.id,
#                 'name': advertisement_company.name,
#                 'region': advertisement_company.region,
#                 'address': advertisement_company.contact.address if advertisement_company.contact else 'N/A',
#                 'tel': str(advertisement_company.contact.tel) + ' - ' + str(advertisement_company.contact.tel2) + ' - ' + str(advertisement_company.contact.tel3),
#                 'email': str(advertisement_company.contact.email) if advertisement_company.contact.email else 'N/A',
#                 'website': str(advertisement_company.contact.website) if advertisement_company.contact.website else 'N/A',
#                 'lat_lng': str(advertisement_company.lat) + ' / ' + str(advertisement_company.lng),
#                 'enabled': advertisement_company.enabled,
#             })

#         return Response({
#             'all_advertisement_companies': advertisement_company_options,
#         })


# class AdvertisementCompanyView(generics.ListAPIView):
#     """
#     URL: advertisement_company/(?P<advertisement_company_id>.*)$
#     Descr: Get Advertisement Company's Data
#     """

#     serializer_class = AdvertisementCompanySerializer

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request, advertisement_company_id):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'AD'):
#             context = {"errormsg": "You do not have permission to view Advertisement Company."}
#             return Response(status=401, data=context)

#         # Get Advertisement Company
#         advertisement_company = AdvertisementCompany.objects.get(id=advertisement_company_id)

#         return Response({
#             'advertisement_company': self.get_serializer(advertisement_company, context={'request': self.request}).data,
#         })


# class AllCharterBrokers(generics.RetrieveAPIView):
#     """
#     URL: all_charter_brokers/
#     Descr: Returns array of all Charter Brokers
#     """

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # # Permission
#         if not can_view(user.id, 'CB'):
#             context = {"errormsg": "You do not have permission to view all Charter Brokers."}
#             return Response(status=401, data=context)

#         # Get Charter Brokers
#         all_charter_brokers = CharterBroker.objects.all().order_by('-id')

#         charter_broker_options = []
#         for charter_broker in all_charter_brokers:
#             charter_broker_options.append({
#                 'id': charter_broker.id,
#                 'name': charter_broker.name,
#                 'region': charter_broker.region,
#                 'address': charter_broker.contact.address if charter_broker.contact else 'N/A',
#                 'tel': str(charter_broker.contact.tel) + ' - ' + str(charter_broker.contact.tel2) + ' - ' + str(charter_broker.contact.tel3),
#                 'email': str(charter_broker.contact.email) if charter_broker.contact.email else 'N/A',
#                 'website': str(charter_broker.contact.website) if charter_broker.contact.website else 'N/A',
#                 'lat_lng': str(charter_broker.lat) + ' / ' + str(charter_broker.lng),
#                 'enabled': charter_broker.enabled,
#             })

#         return Response({
#             'all_charter_brokers': charter_broker_options,
#         })


# class CharterBrokerView(generics.ListAPIView):
#     """
#     URL: charter_broker_company/(?P<charter_broker_id>.*)$
#     Descr: Get Charter Broker's Data
#     """

#     serializer_class = CharterBrokerSerializer

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request, charter_broker_id):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'AD'):
#             context = {"errormsg": "You do not have permission to view a Charter Broker."}
#             return Response(status=401, data=context)

#         # Get Advertisement Company
#         charter_broker = CharterBroker.objects.get(id=charter_broker_id)

#         return Response({
#             'charter_broker': self.get_serializer(charter_broker, context={'request': self.request}).data,
#         })


# class AllAircrafts(generics.RetrieveAPIView):
#     """
#     URL: all_aircrafts/
#     Descr: Returns array of all Aircrafts
#     """

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # # Permission
#         if not can_view(user.id, 'AC'):
#             context = {"errormsg": "You do not have permission to view all Aircrafts."}
#             return Response(status=401, data=context)

#         # Get Charter Brokers
#         all_aircrafts = Aircraft.objects.all().order_by('-id')

#         aircraft_options = []
#         for aircraft in all_aircrafts:
#             charter_broker = CharterBroker.objects.get(id=aircraft.charter_broker_id)
#             aircraft_options.append({
#                 'id': aircraft.id,
#                 'model': aircraft.model,
#                 'year': aircraft.year,
#                 'charter_broker': charter_broker.name,
#             })

#         return Response({
#             'all_aircrafts': aircraft_options,
#         })


# class AircraftView(generics.ListAPIView):
#     """
#     URL: aircraft_company/(?P<aircraft_company_id>.*)$
#     Descr: Get Aircraft's Data
#     """

#     serializer_class = AircraftSerializer

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request, aircraft_id):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'AC'):
#             context = {"errormsg": "You do not have permission to view Aircraft."}
#             return Response(status=401, data=context)

#         # Get Aircraft
#         aircraft = Aircraft.objects.get(id=aircraft_id)

#         return Response({
#             'aircraft': self.get_serializer(aircraft, context={'request': self.request}).data,
#         })


# class AllTheaters(generics.RetrieveAPIView):
#     """
#     URL: all_theaters/
#     Descr: Returns array of all theaters
#     """

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'TH'):
#             context = {"errormsg": "You do not have permission to view Theater."}
#             return Response(status=401, data=context)

#         # Get All Theaters
#         theaters = Theater.objects.order_by('-id').prefetch_related('notes').all()
#         theaters_data = []

#         # Loop over groups to get the front end's table data
#         for theater in theaters:
#             # True if theater has at least one note
#             notes = True if theater.notes.count() > 0 else False
#             theaters_data.append({
#                 'id': theater.id,
#                 'name': theater.name,
#                 'region': theater.region,
#                 'lat_lng': str(theater.lat) + ' / ' + str(theater.lng),
#                 'address': theater.contact.address if theater.contact else 'N/A',
#                 'tel': str(theater.contact.tel) + ' - ' + str(theater.contact.tel2) + ' - ' + str(theater.contact.tel3) if theater.contact else 'N/A',
#                 'email': str(theater.contact.email) if theater.contact else 'N/A',
#                 'website': str(theater.contact.website) if theater.contact else 'N/A',
#                 'notes': notes,
#                 'enabled': theater.enabled,
#             })

#         return Response({
#             'all_theaters': theaters_data,
#         })


# class TheaterView(generics.ListAPIView):
#     """
#     URL: theater/(?P<theater_id>.*)$
#     Descr: Get Theater's Data
#     """

#     serializer_class = TheaterSerializer

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request, theater_id):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'TH'):
#             context = {"errormsg": "You do not have permission to view Theater."}
#             return Response(status=401, data=context)

#         # Get Theater
#         theater = Theater.objects.get(id=theater_id)
#         group_data = []

#         groups = GroupTransfer.objects.filter(
#             group_travelday__travelday_service__theater=theater
#         ).distinct()

#         can_view_COA = not can_view(user.id, 'COA')
#         can_view_COL = not can_view(user.id, 'COL')

#         for group in groups:
#             if group.refcode.startswith('COA') and can_view_COA:
#                 continue
#             if group.refcode.startswith('COL') and can_view_COL:
#                 continue

#             group_data.append({
#                 'id': group.id,
#                 'refcode': group.refcode,
#                 'status': 'Confirmed' if group.status == '5' else 'Cancelled',
#                 'number_of_people': group.number_of_people,
#             })

#         group_data.sort(key=extract_date, reverse=True)

#         return Response({
#             'theater': self.get_serializer(theater, context={'request': self.request}).data,
#             'groups': group_data,
#         })


# class AllTrainTicketAgencies(generics.RetrieveAPIView):
#     """
#     URL: all_train_ticket_agencies/
#     Descr: Returns array of all Train Ticket Agencies
#     """

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'TTA'):
#             context = {"errormsg": "You do not have permission to view all Train Ticket Agencies."}
#             return Response(status=401, data=context)

#         # Get All Train Ticket Agencies
#         all_train_ticket_agencies = TrainTicketAgency.objects.all().order_by('-id')
#         train_ticket_agency_options = []

#         for train_ticket_agency in all_train_ticket_agencies:
#             train_ticket_agency_options.append({
#                 'id': train_ticket_agency.id,
#                 'name': train_ticket_agency.name,
#                 'region': train_ticket_agency.region,
#                 'address': train_ticket_agency.contact.address if train_ticket_agency.contact else 'N/A',
#                 'tel': str(train_ticket_agency.contact.tel) + ' - ' + str(train_ticket_agency.contact.tel2) + ' - ' + str(train_ticket_agency.contact.tel3),
#                 'email': str(train_ticket_agency.contact.email) if train_ticket_agency.contact.email else 'N/A',
#                 'website': str(train_ticket_agency.contact.website) if train_ticket_agency.contact.website else 'N/A',
#                 'lat_lng': str(train_ticket_agency.lat) + ' / ' + str(train_ticket_agency.lng),
#                 'enabled': train_ticket_agency.enabled,
#             })

#         return Response({
#             'all_train_ticket_agencies': train_ticket_agency_options,
#         })


# class TrainTicketAgencyView(generics.ListAPIView):
#     """
#     URL: train_ticket_agency/(?P<train_ticket_agency_id>.*)$
#     Descr: Get Train Ticket Agency's Data
#     """
#     serializer_class = TrainTicketAgencySerializer

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request, train_ticket_agency_id):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'TTA'):
#             context = {"errormsg": "You do not have permission to view Train Ticket Agency."}
#             return Response(status=401, data=context)

#         # Get Train ticket agency
#         train_ticket_agency = TrainTicketAgency.objects.get(id=train_ticket_agency_id)
#         group_data = []

#         groups = GroupTransfer.objects.filter(
#             group_travelday__travelday_service__train_ticket_agency=train_ticket_agency
#         ).distinct()

#         can_view_COA = not can_view(user.id, 'COA')
#         can_view_COL = not can_view(user.id, 'COL')

#         for group in groups:
#             if group.refcode.startswith('COA') and can_view_COA:
#                 continue
#             if group.refcode.startswith('COL') and can_view_COL:
#                 continue

#             group_data.append({
#                 'id': group.id,
#                 'refcode': group.refcode,
#                 'status': 'Confirmed' if group.status == '5' else 'Cancelled',
#                 'number_of_people': group.number_of_people,
#             })

#         group_data.sort(key=extract_date, reverse=True)

#         return Response({
#             'train_ticket_agency': self.get_serializer(train_ticket_agency, context={'request': self.request}).data,
#             'groups': group_data,
#         })


# class AllTextTemplates(generics.RetrieveAPIView):
#     """
#     URL: all_text_templates/
#     Descr: Returns array of all text template
#     """

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'TT'):
#             context = {"errormsg": "You do not have permission to view a Text Template."}
#             return Response(status=401, data=context)

#         # Get All Text Templates
#         text_templates = TextTemplate.objects.all()
#         text_templates_data = []

#         # Loop over groups to get the front end's table data
#         for text_template in text_templates:
#             text_templates_data.append({
#                 'id': text_template.id,
#                 'text': text_template.text,
#                 'type': TEXT_TEMPLATE_TYPES[text_template.type],
#                 'countries': [country.name for country in text_template.countries.all()],
#                 'date_created': text_template.date_created,
#             })

#         return Response({
#             'all_text_templates': text_templates_data,
#         })


# class TextTemplateView(generics.ListAPIView):
#     """
#     URL: text_template/(?P<text_template_id>.*)$
#     Descr: Get Text Template's Data
#     """

#     serializer_class = TextTemplateSerializer

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request, text_template_id):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'TT'):
#             context = {"errormsg": "You do not have permission to view a Text Template."}
#             return Response(status=401, data=context)

#         # Get Text Template
#         text_template = TextTemplate.objects.get(id=text_template_id)

#         return Response({
#             'text_template': self.get_serializer(text_template, context={'request': self.request}).data,
#         })


# class AllContracts(generics.RetrieveAPIView):
#     """
#     URL: all_contracts/
#     Descr: Returns array of all Contracts
#     """

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'CNT'):
#             context = {"errormsg": "You do not have permission to view all Contracts."}
#             return Response(status=401, data=context)

#         # Get all Agents
#         contracts = Contract.objects.all().order_by('-id')
#         contracts_data = []

#         for contract in contracts:
#             contracts_data.append({
#                 'id': contract.id,
#                 'name': contract.name,
#                 'supplier_type': ctypes_to_str[contract.con_type],
#                 'period': contract.period,
#                 'currency': contract.currency,
#                 'status': 'Enabled' if contract.status else 'Disabled',
#                 'document': True if contract.document_id is not None else False,
#                 'date_created': contract.date_created,
#             })

#         return Response({
#             'all_contracts': contracts_data,
#         })


# class ContractView(generics.ListAPIView):
#     """
#     URL: contract/(?P<contract_id>.*)$
#     Descr: Get Contract's Data
#     """

#     serializer_class = ContractSerializer

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request, contract_id):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'CNT'):
#             context = {"errormsg": "You do not have permission to view Contract."}
#             return Response(status=401, data=context)

#         contract = Contract.objects.prefetch_related("room_contract").get(id=contract_id)

#         return Response({
#             'contract': self.get_serializer(contract, context={'request': self.request}).data,
#         })


# class AllParkingLots(generics.RetrieveAPIView):
#     """
#     URL: all_parking_lots/
#     Descr: Returns array of all Parking Lots
#     """

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'PKG'):
#             context = {"errormsg": "You do not have permission to view all Parking Lots."}
#             return Response(status=401, data=context)

#         # Get all Parking Lots
#         parking_lots = ParkingLot.objects.select_related('contact').all().order_by('-id').prefetch_related('notes').all()
#         parking_lots_data = []

#         for parking_lot in parking_lots:
#             notes = True if parking_lot.notes.count() > 0 else False
#             parking_lots_data.append({
#                 'id': parking_lot.id,
#                 'name': parking_lot.name,
#                 'address': parking_lot.contact.address if parking_lot.contact else 'N/A',
#                 'tel': str(parking_lot.contact.tel) + ' - ' + str(parking_lot.contact.tel2) + ' - ' + str(parking_lot.contact.tel3) if parking_lot.contact else 'N/A',
#                 'email': str(parking_lot.contact.email) if parking_lot.contact else 'N/A',
#                 'notes': notes,
#                 'region': parking_lot.region,
#                 'lat_lng': str(parking_lot.lat) + ' / ' + str(parking_lot.lng),
#                 'enabled': parking_lot.enabled,
#             })

#         return Response({
#             'all_parking_lots': parking_lots_data,
#         })


# class ParkingLotView(generics.ListAPIView):
#     """
#     URL: parking_lot/(?P<parking_lot_id>.*)$
#     Descr: Get Parking Lot's Data
#     """

#     serializer_class = ParkingLotSerializer

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request, parking_lot_id):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'PKG'):
#             context = {"errormsg": "You do not have permission to view Parking Lot."}
#             return Response(status=401, data=context)

#         parking_lot = ParkingLot.objects.get(id=parking_lot_id)

#         return Response({
#             'parking_lot': self.get_serializer(parking_lot, context={'request': self.request}).data,
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

#         # Permission
#         if not can_view(user.id, 'PLC'):
#             context = {"errormsg": "You do not have permission to view all Places."}
#             return Response(status=401, data=context)

#         with connection.cursor() as cursor:
#             cursor.execute("""
#                 SELECT
#                     'Continent' AS region_type,
#                     id,
#                     name,
#                     NULL AS parent,
#                     lat,
#                     lng,
#                     markup
#                 FROM
#                     webapp_continent
#                 UNION ALL
#                 SELECT
#                     'Country' AS region_type,
#                     co.id,
#                     co.name,
#                     c.name AS parent,
#                     co.lat,
#                     co.lng,
#                     co.markup
#                 FROM
#                     webapp_country co
#                 JOIN
#                     webapp_continent c ON co.continent_id = c.id
#                 UNION ALL
#                 SELECT
#                     'State' AS region_type,
#                     s.id,
#                     s.name,
#                     co.name AS parent,
#                     s.lat,
#                     s.lng,
#                     s.markup
#                 FROM
#                     webapp_state s
#                 JOIN
#                     webapp_country co ON s.country_id = co.id
#                 UNION ALL
#                 SELECT
#                     'City' AS region_type,
#                     ci.id,
#                     ci.name,
#                     CASE
#                         WHEN co.name IS NOT NULL THEN co.name
#                         ELSE s.name
#                     END AS parent,
#                     ci.lat,
#                     ci.lng,
#                     ci.markup
#                 FROM
#                     webapp_city ci
#                 LEFT JOIN
#                     webapp_country co ON ci.country_id = co.id
#                 LEFT JOIN
#                     webapp_state s ON ci.state_id = s.id
#                 UNION ALL
#                 SELECT
#                     'Area' AS region_type,
#                     a.id,
#                     a.name,
#                     ci.name AS parent,
#                     a.lat,
#                     a.lng,
#                     a.markup
#                 FROM
#                     webapp_area a
#                 JOIN
#                     webapp_city ci ON a.city_id = ci.id
#                 LEFT JOIN
#                     webapp_country co ON ci.country_id = co.id
#                 LEFT JOIN
#                     webapp_state s ON ci.state_id = s.id;
#             """)

#             regions_list = []
#             for row in cursor.fetchall():
#                 regions_list.append({
#                     'id': row[1],
#                     'name': row[2],
#                     'parent': row[3],
#                     'type': row[0],
#                     'lat_lng': f"{row[4]} / {row[5]}",
#                     'markup': row[6],
#                 })

#         return Response({'all_regions': regions_list})


# class RegionView(generics.ListAPIView):

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request, rtype, region_id):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'PLC'):
#             context = {"errormsg": "You do not have permission to view a Place."}
#             return Response(status=401, data=context)

#         if rtype == 'continent':
#             region = Continent.objects.get(id=region_id)
#             serializer = ContinentSerializer(region, context={'request': self.request}).data
#         elif rtype == 'country':
#             region = Country.objects.get(id=region_id)
#             serializer = CountrySerializer(region, context={'request': self.request}).data
#         elif rtype == 'state':
#             region = State.objects.get(id=region_id)
#             serializer = StateSerializer(region, context={'request': self.request}).data
#         elif rtype == 'city':
#             region = City.objects.get(id=region_id)
#             serializer = CitySerializer(region, context={'request': self.request}).data
#         elif rtype == 'area':
#             region = Area.objects.get(id=region_id)
#             serializer = AreaSerializer(region, context={'request': self.request}).data

#         return Response({
#             'region': serializer,
#         })


# class AllEntertainmentSuppliers(generics.RetrieveAPIView):
#     """
#     URL: all_entertainment_suppliers/
#     Descr: Returns array of all Sport Event Suppliers
#     """

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'ES'):
#             context = {"errormsg": "You do not have permission to view Sport Event Supplier."}
#             return Response(status=401, data=context)

#         # Get all Sport Event Suppliers
#         entertainment_suppliers = EntertainmentSupplier.objects.all().order_by('-id')
#         entertainment_suppliers_data = []

#         # Loop over Sport Event Suppliers to get the front end's table data
#         for ses in entertainment_suppliers:
#             entertainment_suppliers_data.append({
#                 'id': ses.id,
#                 'name': ses.name,
#                 'region': ses.region,
#                 'lat_lng': str(ses.lat) + ' / ' + str(ses.lng),
#                 'address': ses.contact.address if ses.contact else 'N/A',
#                 'tel': str(ses.contact.tel) + ' - ' + str(ses.contact.tel2) + ' - ' + str(ses.contact.tel3) if ses.contact else 'N/A',
#                 'email': str(ses.contact.email) if ses.contact else 'N/A',
#                 'website': str(ses.contact.website) if ses.contact else 'N/A',
#                 'enabled': ses.enabled,
#             })

#         return Response({
#             'all_entertainment_suppliers': entertainment_suppliers_data,
#         })


# class EntertainmentSupplierView(generics.ListAPIView):
#     """
#     URL: entertainment_supplier/(?P<entertainment_supplier_id>.*)$
#     Descr: Get Entertainment Supplier's Data
#     """

#     serializer_class = EntertainmentSupplierSerializer

#     # Cross site request forgery
#     @csrf_exempt
#     def get(self, request, entertainment_supplier_id):
#         context = {"request": request, "errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'ES'):
#             context = {"errormsg": "You do not have permission to view Sport Event Supplier."}
#             return Response(status=401, data=context)

#         # Get Sport Event Supplier
#         entertainment_supplier = EntertainmentSupplier.objects.get(id=entertainment_supplier_id)


#         group_data = []

#         groups = GroupTransfer.objects.filter(
#             group_travelday__travelday_service__entertainment_supplier=entertainment_supplier
#         ).distinct()

#         can_view_COA = not can_view(user.id, 'COA')
#         can_view_COL = not can_view(user.id, 'COL')

#         for group in groups:
#             if group.refcode.startswith('COA') and can_view_COA:
#                 continue
#             if group.refcode.startswith('COL') and can_view_COL:
#                 continue

#             group_data.append({
#                 'id': group.id,
#                 'refcode': group.refcode,
#                 'status': 'Confirmed' if group.status == '5' else 'Cancelled',
#                 'number_of_people': group.number_of_people,
#             })

#         group_data.sort(key=extract_date, reverse=True)

#         return Response({
#             'entertainment_supplier': self.get_serializer(entertainment_supplier, context={'request': self.request}).data,
#             'groups': group_data,
#         })
