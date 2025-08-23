# # from django.shortcuts import render
# from webapp.models import (
#     Agent,
#     Attraction,
#     Client,
#     Contact,
#     Country,
#     Coach,
#     CoachOperator,
#     DMC,
#     Hotel,
#     Airport,
#     Airline,
#     FerryTicketAgency,
#     CruisingCompany,
#     GroupTransfer,
#     Guide,
#     Restaurant,
#     SportEventSupplier,
#     TeleferikCompany,
#     Theater,
#     TrainTicketAgency,
#     History,
#     Amenity,
#     Port,
#     RepairShop,
#     Offer,
#     TextTemplate,
#     RailwayStation,
#     Contract,
#     Document,
#     ParkingLot,
#     TextTemplateCountry,
#     Room,
#     Payment,
#     PaymentDetails,
#     HotelCategory,
#     PaymentOrder,
#     Deposit,
#     Continent,
#     State,
#     City,
#     Area,
#     CoachOperatorCategory,
#     EntertainmentProduct,
#     EntertainmentSupplier,
#     CarHireCompany,
#     CharterBroker,
#     AdvertisementCompany,
#     Aircraft,
# )

# from django.core.cache import cache
# from webapp.serializers import (
#     GroupSerializer,
#     HotelCategorySerializer,
#     HotelSerializer,
#     ContinentSerializer,
#     CountrySerializer,
#     StateSerializer,
#     CitySerializer,
#     AreaSerializer,
#     EntertainmentSupplierSerializer,
# )

# from webapp.validators import (
#     validate_tel_details,
# )

# import json
# from functools import reduce
# import operator
# from django.utils.datastructures import MultiValueDictKeyError
# from django.db.models import Q
# import datetime
# from django.views.decorators.csrf import csrf_exempt
# from rest_framework import generics
# from rest_framework.response import Response
# from rest_framework import status
# from django.http import HttpResponse
# from accounts.views import get_user
# import re
# from accounts.permissions import (
#     can_create,
# )

# from webapp.validators import (
#     validate_name
# )

# from pathlib import Path


# # We use this in the react tel input form, to check if tel belongs to a country
# country_codes = [
#     '93', '355', '213', '376', '244', '1268', '54', '374', '297', '61',
#     '43', '994', '1242', '973', '880', '1246', '375', '32', '501', '229',
#     '975', '591', '387', '267', '55', '246', '673', '359', '226', '257',
#     '855', '237', '1', '238', '599', '236', '235', '56', '86', '57', '269',
#     '243', '242', '506', '225', '385', '53', '599', '357', '420', '45', '253',
#     '1767', '1', '593', '20', '503', '240', '291', '372', '251', '679', '358',
#     '33', '594', '689', '241', '220', '995', '49', '233', '30', '1473', '590',
#     '1671', '502', '224', '245', '592', '509', '504', '852', '36', '354', '62',
#     '98', '964', '353', '972', '39', '1876', '81', '962', '7', '254', '686',
#     '383', '965', '996', '856', '371', '961', '266', '231', '218', '423',
#     '370', '352', '853', '389', '261', '265', '60', '960', '223', '356',
#     '692', '596', '222', '230', '52', '691', '373', '377', '976', '382',
#     '212', '258', '95', '264', '674', '977', '31', '687', '64', '505'
#     '227', '234', '850', '47', '968', '92', '680', '970', '507', '675',
#     '595', '51', '63', '48', '351', '1', '974', '262', '40', '7', '250',
#     '1869', '1758', '1784', '685', '378', '239', '966', '221', '381',
#     '248', '232', '65', '421', '386', '677', '252', '27', '82', '211',
#     '34', '94', '249', '597', '268', '46', '41', '963', '886', '992',
#     '255', '66', '670', '228', '676', '1868', '216', '90', '993', '688',
#     '256', '380', '971', '44', '1', '598', '998', '678', '39',
#     '58', '84', '967', '260', '263',
# ]

# allowed_extension_documents = [
#     'pdf', 'docx', 'doc', 'tif', 'tiff', 'bmp', 'jpg', 'jpeg', 'png', 'zip', 'rar',
#     'PDF', 'DOCX', 'DOC', 'TIF', 'TIFF', 'BMP', 'JPG', 'JPEG', 'PNG', 'ZIP', 'RAR',
# ]

# allowed_extensions_repair_types = ['png', 'PNG']


# def get_region_data(data):
#     continent_name = data.get('continent')
#     country_name = data.get('country')
#     state_name = data.get('state')
#     city_name = data.get('city')
#     area_name = data.get('area')

#     if area_name:
#         return 'area', area_name['name']
#     elif city_name:
#         return 'city', city_name['name']
#     elif state_name:
#         return 'state', state_name['name']
#     elif country_name:
#         return 'country', country_name['name']
#     else:
#         return 'continent', continent_name['name']


# region_model_mapping = {
#     'continent': Continent,
#     'country': Country,
#     'state': State,
#     'city': City,
#     'area': Area,
# }


# def extract_domain(link):
#     pattern = re.compile(r'https?://(?:www\.)?([^\/]+)')
#     match = pattern.match(link)

#     if match:
#         return match.group(1)
#     else:
#         return link


# class AddGroup(generics.UpdateAPIView):
#     """
#     url : add_group
#     Descr: Creates new group.
#     Rest of code is optional
#     refcode format = Office ( COA ) + Agent/Client abbreviation ( MAS ) + Date + Rest of code
#     Deletes previous agent or client based on request, and adds new
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         # Context error message will be filled if something goes wrong
#         context = {"errormsg": '', 'new_refcode': ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_create(user.id, 'GT'):
#             context = {"errormsg": "You do not have permission to create a Group."}
#             return Response(status=401, data=context)

#         # Data submitted in post body
#         selected_office = request.data['office']
#         agent_or_client = request.data['agent_or_client']

#         # Groups have either Agent or Client.
#         try:
#             if agent_or_client == 'Agent':
#                 agent_name = request.data['Agent']
#                 client_name = None
#         except KeyError:
#             agent_name = None

#         try:
#             if agent_or_client == 'Client':
#                 agent_name = None
#                 client_name = request.data['Client']
#         except KeyError:
#             client_name = None

#         # Get refcode
#         rest_of_code = request.data['rest_of_code'].strip()

#         # Get date
#         date = request.data['date']

#         # Validations
#         # Office selection has to be in this list
#         can_create_COA = can_create(user.id, 'COA')
#         can_create_COL = can_create(user.id, 'COL')
#         if (selected_office == 'COL' and not can_create_COL) or (selected_office == 'COA' and not can_create_COA):
#             context['errormsg'] = 'Invalid office option'
#             return Response(data=context, status=400)

#         # Agent or client value has to be in this list
#         agent_or_client_options = ['Agent', 'Client']
#         if agent_or_client not in agent_or_client_options:
#             context['errormsg'] = 'Invalid agent or client option'
#             return Response(data=context, status=400)

#         # If there both agent or client, return 400
#         if agent_name is not None and client_name is not None:
#             context['errormsg'] = 'You cannot set both agent and client in a group'
#             return Response(data=context, status=400)

#         # If there is no agent or client, return 400
#         if agent_name is None and client_name is None:
#             context['errormsg'] = 'Please select Agent or Client field'
#             return Response(data=context, status=400)

#         # If agent does not exist
#         if agent_name is not None and agent_name not in [_.name for _ in Agent.objects.all()]:
#             context['errormsg'] = 'Agent does not exist'
#             return Response(data=context, status=400)

#         # If client does not exist
#         if client_name is not None and client_name not in [_.name for _ in Client.objects.all()]:
#             context['errormsg'] = 'Client does not exist'
#             return Response(data=context, status=400)

#         # Validate date input
#         if len(date) == 0 or date is None or date == 'Invalid date':
#             context['errormsg'] = 'Invalid date input'
#             return Response(data=context, status=400)

#         # Get Agent or Client
#         agent = Agent.objects.get(name=agent_name) if agent_or_client == 'Agent' else None
#         client = Client.objects.get(name=client_name) if agent_or_client == 'Client' else None

#         # If Agent exists, get his abbreviation, else get Client's
#         abbreviation = agent.abbreviation if agent_or_client == 'Agent' else client.abbreviation
#         if str(abbreviation) == 'None':
#             abbreviation = ''

#         # Refcode final string
#         refcode = selected_office + '-' + str(abbreviation) + date.replace('-', '') + str(rest_of_code)

#         # Validate refcode
#         all_refcodes = [i.refcode for i in GroupTransfer.objects.all()]

#         if refcode in all_refcodes:
#             context['errormsg'] = 'Refcode Already Exists.'
#             return Response(data=context, status=400)

#         if len(date) == 0 or date is None or date == 'Invalid date':
#             context['errormsg'] = 'Invalid date input'
#             return Response(data=context, status=400)

#         # Create the group
#         # Save action to history
#         try:
#             if agent is not None:
#                 GroupTransfer.objects.create(refcode=refcode, agent_id=agent.id, arrival_type='NA', departure_type='NA')
#             else:
#                 GroupTransfer.objects.create(refcode=refcode, client_id=client.id, arrival_type='NA', departure_type='NA')
#             context['new_refcode'] = refcode  # Used to redirect the user to group's overview

#             History.objects.create(
#                 user=user,
#                 model_name='GT',
#                 action='CRE',
#                 description=f'User : {user.username} created a new group with refcode : {refcode}'
#             )

#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as a:
#             context['errormsg'] = str(a)
#             return Response(data=context, status=400)


# class AddAgent(generics.UpdateAPIView):
#     """
#     URL: add_agent
#     Descr: Creates new Agent. Agent is related to a contact.
#     so this function also creates a contact. Permission is needed to create an Agent,
#     plus, the fields have to be validated.
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": '', 'new_agent_id': ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_create(user.id, 'AGN'):
#             context = {"errormsg": 'You do not have permission to create an Agent.'}
#             return Response(status=401, data=context)

#         # Data from front end form
#         agent_name = request.data['name'].strip()
#         address = request.data['address'].strip()
#         address2 = request.data['address2'].strip()
#         postal = request.data['postal'].strip()
#         tel = request.data['tel'].strip()
#         abbr = request.data['abbreviation']

#         for code in country_codes:
#             if tel.startswith(code):
#                 tel = "+" + tel[:len(code)] + ' ' + tel[len(code):]

#         tel2 = request.data['tel2'].strip()
#         for code in country_codes:
#             if tel2.startswith(code):
#                 tel2 = "+" + tel2[:len(code)] + ' ' + tel2[len(code):]

#         tel3 = request.data['tel3'].strip()
#         for code in country_codes:
#             if tel3.startswith(code):
#                 tel3 = "+" + tel3[:len(code)] + ' ' + tel3[len(code):]

#         email = request.data['email'].strip()

#         # Validations
#         if len(agent_name) < 5:
#             context['errormsg'] = 'Invalid name submitted'
#             return Response(data=context, status=400)
#         if len(address) < 5:
#             context['errormsg'] = 'Invalid address submitted'
#             return Response(data=context, status=400)

#         if not validate_tel_details([tel, tel2, tel3]):
#             context['errormsg'] = 'Invalid tel submitted or tel already exists.'
#             return Response(data=context, status=400)

#         all_names = [i.name for i in Agent.objects.all()]

#         if agent_name in all_names:
#             context['errormsg'] = 'Name Already Exists'
#             return Response(data=context, status=400)

#         continent = request.data['continent']
#         country = request.data['country']
#         state = request.data['state']
#         city = request.data['city']
#         area = request.data['area']
#         region_str = ""

#         if continent != 'N/A':
#             region_str += continent
#         if country != 'N/A':
#             region_str += f" >>> {country}"
#         if state != 'N/A':
#             region_str += f" >>> {state}"
#         if city != 'N/A':
#             region_str += f" >>> {city}"
#         if area != 'N/A':
#             region_str += f" >>> {area}"

#         filename = request.data['filename']

#         # Create Agent
#         try:
#             agent = Agent.objects.create(
#                 name=agent_name.strip(),
#                 nationality_id=Country.objects.get(name=request.data['country']).id,
#                 abbreviation=abbr,
#                 region=region_str,
#                 icon=f'/dj_static/images/agent_icons/{filename}'
#             )
#             contact = Contact.objects.create(
#                 name=agent_name,
#                 address=address,
#                 tel=tel,
#                 tel2=tel2,
#                 tel3=tel3,
#                 email=email,
#                 type='A',
#                 address2=address2,
#                 postal=postal,
#             )
#             agent.contact_id = contact.id

#             new_pd_id = PaymentDetails.objects.all().order_by("-id")[0].id + 1

#             if request.data['company'] == '':
#                 company_name = agent_name
#             else:
#                 company_name = ''

#             payment_details = PaymentDetails.objects.create(
#                 id=new_pd_id,
#                 company=company_name,
#                 currency=request.data['currency'],
#                 iban=request.data['iban'],
#                 swift=request.data['swift'],
#             )
#             agent.payment_details_id = payment_details.id
#             agent.save()

#             # Write event to database
#             History.objects.create(
#                 user=user,
#                 model_name='AGN',
#                 action='CRE',
#                 description=f"User : {user.username} created new Agent with name: {agent.name}"
#             )
#             context['new_agent_id'] = agent.id
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class AddAirline(generics.UpdateAPIView):
#     """
#     URL: add_airline
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": '', 'new_airline_id': ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_create(user.id, 'AL'):
#             context = {"errormsg": "You do not have permission to create an Airline."}
#             return Response(status=401, data=context)

#         # Get airport name
#         airline_name = request.data['name'].strip()

#         # Get abreviation
#         abbreviation = request.data['abbreviation'].upper().strip()

#         # Validators
#         if len(airline_name) < 5:
#             context['errormsg'] = 'Invalid name submitted'
#             return Response(data=context, status=400)

#         try:
#             airline = Airline.objects.create(name=airline_name, abbreviation=abbreviation)
#             new_pd_id = PaymentDetails.objects.all().order_by("-id")[0].id + 1

#             if request.data['company'] == '':
#                 company_name = airline_name
#             else:
#                 company_name = ''

#             payment_details = PaymentDetails.objects.create(
#                 id=new_pd_id,
#                 company=company_name,
#                 currency=request.data['currency'],
#                 iban=request.data['iban'],
#                 swift=request.data['swift'],
#             )
#             airline.payment_details_id = payment_details.id
#             airline.save()

#             History.objects.create(
#                 user=user,
#                 model_name='AL',
#                 action='CRE',
#                 description=f"User : {user.username} created a new Airline with name: {airline_name}"
#             )
#             context['new_airline_id'] = airline.id
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = str(exc)
#             return Response(data=context, status=400)


# class AddAirport(generics.UpdateAPIView):
#     """
#     URL: add_airport
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": '', 'new_airport_name': ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_create(user.id, 'AP'):
#             context = {"errormsg": "You do not have permission to create an Airport."}
#             return Response(status=401, data=context)

#         try:
#             # Get Airport name, lat, lng
#             airport_name = request.data['name'].upper().strip()
#             # Get lat/lng
#             lat_lng = request.data['lat_lng']
#             lat = lat_lng.split(", ")[0]
#             lng = lat_lng.split(", ")[1]
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)

#         # Airport's name has to be 3 character long
#         if len(airport_name) != 3:
#             context['errormsg'] = 'Invalid name submitted'
#             return Response(data=context, status=400)

#         # Latitude range is between -90-90, anything else is invalid
#         if float(lat) > 90 or float(lat) < -90:
#             context = {"errormsg": "Invalid Lat submitted"}
#             return Response(status=400, data=context)

#         # Longitude range is between -90-90, anything else is invalid
#         if float(lng) > 180 or float(lng) < -180:
#             context = {"errormsg": "Invalid Lng submitted"}
#             return Response(status=400, data=context)

#         all_names = [i.name for i in Airport.objects.all()]

#         if airport_name in all_names:
#             context['errormsg'] = 'Airport Name already exists. The Name needs to be unique'
#             return Response(data=context, status=400)

#         continent = request.data['continent']
#         country = request.data['country']
#         state = request.data['state']
#         city = request.data['city']
#         area = request.data['area']
#         region_str = ""

#         if continent != 'N/A':
#             region_str += continent
#         if country != 'N/A':
#             region_str += f" >>> {country}"
#         if state != 'N/A':
#             region_str += f" >>> {state}"
#         if city != 'N/A':
#             region_str += f" >>> {city}"
#         if area != 'N/A':
#             region_str += f" >>> {area}"

#         try:
#             airport = Airport.objects.create(
#                 name=airport_name,
#                 lat=lat, lng=lng,
#                 region=region_str,
#             )
#             History.objects.create(
#                 user=user,
#                 model_name='AP',
#                 action='CRE',
#                 description=f"User : {user.username} created a new Airport with name: {airport_name}"
#             )
#             context['new_airport_name'] = airport.name
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = str(exc)
#             return Response(data=context, status=400)


# class AddAttraction(generics.UpdateAPIView):
#     """
#     URL: add_attraction
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": '', 'new_attraction_id': ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_create(user.id, 'ATT'):
#             context = {"errormsg": "You do not have permission to create an Attraction."}
#             return Response(status=401, data=context)

#         try:
#             # Get Attraction's data
#             name = request.data['name'].strip()
#             att_type = request.data['type'].strip()
#         except Exception as exc:
#             context['errormsg'] = exc

#         # Get lat/lng
#         lat_lng = request.data['lat_lng']
#         lat = lat_lng.split(", ")[0]
#         lng = lat_lng.split(", ")[1]

#         tel = request.data['tel'].strip()
#         for code in country_codes:
#             if tel.startswith(code):
#                 tel = "+" + tel[:len(code)] + ' ' + tel[len(code):]

#         tel2 = request.data['tel2'].strip()
#         for code in country_codes:
#             if tel2.startswith(code):
#                 tel2 = "+" + tel2[:len(code)] + ' ' + tel2[len(code):]

#         tel3 = request.data['tel3'].strip()
#         for code in country_codes:
#             if tel3.startswith(code):
#                 tel3 = "+" + tel3[:len(code)] + ' ' + tel3[len(code):]
#         email = request.data['email'].strip()

#         # Validators
#         if len(name) < 3:
#             context['errormsg'] = 'Invalid name submitted'
#             return Response(data=context, status=400)

#         # Latitude range is between -90-90, anything else is invalid
#         if float(lat) > 90 or float(lat) < -90:
#             context = {"errormsg": "Invalid Lat submitted"}
#             return Response(status=400, data=context)

#         # Longitude range is between -90-90, anything else is invalid
#         if float(lng) > 180 or float(lng) < -180:
#             context = {"errormsg": "Invalid Lng submitted"}
#             return Response(status=400, data=context)

#         continent = request.data['continent']
#         country = request.data['country']
#         state = request.data['state']
#         city = request.data['city']
#         area = request.data['area']
#         region_str = ""

#         if continent != 'N/A':
#             region_str += continent
#         if country != 'N/A':
#             region_str += f" >>> {country}"
#         if state != 'N/A':
#             region_str += f" >>> {state}"
#         if city != 'N/A':
#             region_str += f" >>> {city}"
#         if area != 'N/A':
#             region_str += f" >>> {area}"

#         try:
#             attraction = Attraction.objects.create(
#                 name=name,
#                 lat=lat,
#                 lng=lng,
#                 type=att_type,
#                 region=region_str,
#             )

#             contact = Contact.objects.create(
#                 name=name,
#                 type="H",
#                 tel=tel,
#                 tel2=tel2,
#                 tel3=tel3,
#                 email=email,
#             )
#             attraction.contact_id = contact.id

#             attraction.save()
#             History.objects.create(
#                 user=user,
#                 model_name='ATT',
#                 action='CRE',
#                 description=f'User : {user.username} created a new Attraction with name {attraction.name}'
#             )
#             context['new_attraction_id'] = attraction.id
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class AddClient(generics.UpdateAPIView):
#     """
#     URL: add_client
#     Descr: Creates new Client. Client is related to a contact.
#     so this function also creates a contact. Permission is needed to create an Client,
#     plus, the fields have to be validated.
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": '', 'new_client': ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_create(user.id, 'CLN'):
#             context = {"errormsg": 'You do not have permission to create an Client.'}
#             return Response(status=401, data=context)

#         # Data from front end form
#         client_name = request.data['name'].strip()
#         address = request.data['address'].strip()
#         address2 = request.data['address2'].strip()
#         postal = request.data['postal'].strip()
#         tel = request.data['tel'].strip()
#         abbr = request.data['abbreviation']

#         for code in country_codes:
#             if tel.startswith(code):
#                 tel = "+" + tel[:len(code)] + ' ' + tel[len(code):]

#         tel2 = request.data['tel2'].strip()
#         for code in country_codes:
#             if tel2.startswith(code):
#                 tel2 = "+" + tel2[:len(code)] + ' ' + tel2[len(code):]

#         tel3 = request.data['tel3'].strip()
#         for code in country_codes:
#             if tel3.startswith(code):
#                 tel3 = "+" + tel3[:len(code)] + ' ' + tel3[len(code):]

#         email = request.data['email'].strip()

#         # Validations
#         if len(client_name) < 5:
#             context['errormsg'] = 'Invalid name submitted'
#             return Response(data=context, status=400)
#         if len(address) < 5:
#             context['errormsg'] = 'Invalid address submitted'
#             return Response(data=context, status=400)

#         if not validate_tel_details([tel, tel2, tel3]):
#             context['errormsg'] = 'Invalid tel submitted or tel already exists.'
#             return Response(data=context, status=400)

#         all_names = [i.name for i in Agent.objects.all()]

#         if client_name in all_names:
#             context['errormsg'] = 'Name Already Exists'
#             return Response(data=context, status=400)

#         continent = request.data['continent']
#         country = request.data['country']
#         state = request.data['state']
#         city = request.data['city']
#         area = request.data['area']
#         region_str = ""

#         if continent != 'N/A':
#             region_str += continent
#         if country != 'N/A':
#             region_str += f" >>> {country}"
#         if state != 'N/A':
#             region_str += f" >>> {state}"
#         if city != 'N/A':
#             region_str += f" >>> {city}"
#         if area != 'N/A':
#             region_str += f" >>> {area}"

#         # Create Agent
#         try:
#             client = Client.objects.create(
#                 name=client_name.strip(),
#                 nationality_id=Country.objects.get(name=request.data['country']).id,
#                 abbreviation=abbr,
#                 region=region_str,
#             )
#             contact = Contact.objects.create(
#                 name=client_name,
#                 address=address,
#                 tel=tel,
#                 tel2=tel2,
#                 tel3=tel3,
#                 email=email,
#                 type='A',
#                 address2=address2,
#                 postal=postal,
#             )
#             client.contact_id = contact.id

#             new_pd_id = PaymentDetails.objects.all().order_by("-id")[0].id + 1

#             if request.data['company'] == '':
#                 company_name = client_name
#             else:
#                 company_name = ''

#             payment_details = PaymentDetails.objects.create(
#                 id=new_pd_id,
#                 company=company_name,
#                 currency=request.data['currency'],
#                 iban=request.data['iban'],
#                 swift=request.data['swift'],
#             )
#             client.payment_details_id = payment_details.id
#             client.save()

#             # Write event to database
#             History.objects.create(
#                 user=user,
#                 model_name='CLN',
#                 action='CRE',
#                 description=f"User : {user.username} created new Client with name: {client.name}"
#             )
#             context['new_agent_id'] = client.id
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class AddCoachOperator(generics.UpdateAPIView):
#     """
#     URL: add_coach_operator
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": '', 'new_coach_operator_id': ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_create(user.id, 'COP'):
#             context = {"errormsg": "You do not have permission to create a Coach Operator."}
#             return Response(status=401, data=context)

#         # Get coach operator's data
#         coach_operator_name = request.data['name'].strip()
#         address = request.data['address'].strip()
#         tel = request.data['tel'].strip()
#         for code in country_codes:
#             if tel.startswith(code):
#                 tel = "+" + tel[:len(code)] + ' ' + tel[len(code):]

#         tel2 = request.data['tel2'].strip()
#         for code in country_codes:
#             if tel2.startswith(code):
#                 tel2 = "+" + tel2[:len(code)] + ' ' + tel2[len(code):]

#         tel3 = request.data['tel3'].strip()
#         for code in country_codes:
#             if tel3.startswith(code):
#                 tel3 = "+" + tel3[:len(code)] + ' ' + tel3[len(code):]
#         email = request.data['email'].strip()
#         website = request.data['website'].strip()

#         # Get lat/lng
#         lat_lng = request.data['lat_lng']
#         lat = lat_lng.split(", ")[0]
#         lng = lat_lng.split(", ")[1]

#         # Latitude range is between -90-90, anything else is invalid
#         if float(lat) > 90 or float(lat) < -90:
#             context = {"errormsg": "Invalid Lat submitted"}
#             return Response(status=400, data=context)

#         # Longitude range is between -90-90, anything else is invalid
#         if float(lng) > 180 or float(lng) < -180:
#             context = {"errormsg": "Invalid Lng submitted"}
#             return Response(status=400, data=context)

#         all_names = [i.name for i in CoachOperator.objects.all()]

#         if coach_operator_name in all_names:
#             context['errormsg'] = 'Name already exists.'
#             return Response(data=context, status=400)

#         if not validate_tel_details([tel, tel2, tel3]):
#             context['errormsg'] = 'Invalid tel submitted or tel already exists.'
#             return Response(data=context, status=400)

#         address = request.data['address'].strip()
#         address2 = request.data['address2'].strip()
#         postal = request.data['postal'].strip()

#         continent = request.data['continent']
#         country = request.data['country']
#         state = request.data['state']
#         city = request.data['city']
#         area = request.data['area']
#         region_str = ""

#         if continent != 'N/A':
#             region_str += continent
#         if country != 'N/A':
#             region_str += f" >>> {country}"
#         if state != 'N/A':
#             region_str += f" >>> {state}"
#         if city != 'N/A':
#             region_str += f" >>> {city}"
#         if area != 'N/A':
#             region_str += f" >>> {area}"

#         coach_operator_categories = request.data['coach_operator_categories']

#         try:
#             contact = Contact.objects.create(
#                 name=coach_operator_name,
#                 type='C',
#                 address=address,
#                 tel=tel,
#                 tel2=tel2,
#                 tel3=tel3,
#                 email=email,
#                 website=website,
#                 address2=address2,
#                 postal=postal,
#             )

#             coach_operator = CoachOperator.objects.create(
#                 name=coach_operator_name,
#                 lat=lat,
#                 lng=lng,
#                 contact_id=contact.id,
#                 region=region_str,
#             )

#             # Get hotel's Categories
#             try:
#                 for cc in coach_operator_categories:
#                     coach_operator.categories.add(CoachOperatorCategory.objects.get(id=cc['id']))
#             except Exception as a:
#                 print(a)

#             new_pd_id = PaymentDetails.objects.all().order_by("-id")[0].id + 1

#             if request.data['company'] == '':
#                 company_name = coach_operator_name
#             else:
#                 company_name = ''

#             payment_details = PaymentDetails.objects.create(
#                 id=new_pd_id,
#                 company=company_name,
#                 currency=request.data['currency'],
#                 iban=request.data['iban'],
#                 swift=request.data['swift'],
#             )
#             coach_operator.payment_details_id = payment_details.id
#             coach_operator.save()

#             History.objects.create(
#                 user=user,
#                 model_name='COP',
#                 action='CRE',
#                 description=f"User : {user.username} created a new Coach Operator with name: {coach_operator_name}"
#             )
#             context['new_coach_operator_id'] = coach_operator.id
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class AddCoach(generics.UpdateAPIView):
#     """
#     URL: add_coach
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": '', 'new_coach_id': ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_create(user.id, 'CO'):
#             context = {"errormsg": "You do not have permission to create a Coach."}
#             return Response(status=401, data=context)

#         try:
#             # Get Coach Operator
#             coach_operator_name = request.data['coach_operator'].strip()
#             coach_op_id = CoachOperator.objects.get(name=coach_operator_name).id

#             # Get Coach's Data
#             coach_make = request.data['make'].strip()
#             plate_num = request.data['plate_number'].strip()
#             passenger_seats = request.data['passenger_seats']
#             emission = request.data['emission']
#             year = request.data['year']

#         except Exception as exc:
#             context['errormsg'] = exc
#             return HttpResponse(status=400)

#         # Validator
#         if len(coach_make) < 3:
#             context['errormsg'] = 'Invalid name submitted'
#             return Response(data=context, status=400)

#         try:
#             emission = emission if emission != '' else 0
#             coach = Coach.objects.create(
#                 make=coach_make,
#                 coach_operator_id=coach_op_id,
#                 plate_number=plate_num,
#                 number_of_seats=passenger_seats,
#                 emission=emission,
#                 year=year,
#             )
#             coach.save()

#             History.objects.create(
#                 user=user,
#                 model_name='CO',
#                 action='CRE',
#                 description=f"User : {user.username} created a new Coach ( {coach} )"
#             )
#             context['new_coach_id'] = coach.id
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class AddCruisingCompany(generics.UpdateAPIView):
#     """
#     URL: add_cruising_company
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": '', 'new_cruising_company_id': ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_create(user.id, 'CC'):
#             context = {"errormsg": "You do not have permission to create a Cruising Company."}
#             return Response(status=401, data=context)

#         # Get cruising company data
#         cruising_company_name = request.data['name'].strip()
#         address = request.data['address'].strip()
#         tel = request.data['tel'].strip()
#         for code in country_codes:
#             if tel.startswith(code):
#                 tel = "+" + tel[:len(code)] + ' ' + tel[len(code):]

#         tel2 = request.data['tel2'].strip()
#         for code in country_codes:
#             if tel2.startswith(code):
#                 tel2 = "+" + tel2[:len(code)] + ' ' + tel2[len(code):]

#         tel3 = request.data['tel3'].strip()
#         for code in country_codes:
#             if tel3.startswith(code):
#                 tel3 = "+" + tel3[:len(code)] + ' ' + tel3[len(code):]
#         email = request.data['email'].strip()
#         website = request.data['website'].strip()

#         # Get lat/lng
#         lat_lng = request.data['lat_lng']
#         lat = lat_lng.split(", ")[0]
#         lng = lat_lng.split(", ")[1]

#         # Validators
#         # Latitude range is between -90-90, anything else is invalid
#         if float(lat) > 90 or float(lat) < -90:
#             context = {"errormsg": "Invalid Lat submitted"}
#             return Response(status=400, data=context)

#         # Longitude range is between -90-90, anything else is invalid
#         if float(lng) > 180 or float(lng) < -180:
#             context = {"errormsg": "Invalid Lng submitted"}
#             return Response(status=400, data=context)

#         all_names = [i.name for i in CruisingCompany.objects.all()]

#         if cruising_company_name in all_names:
#             context['errormsg'] = 'Name already exists.'
#             return Response(data=context, status=400)

#         if not validate_tel_details([tel, tel2, tel3]):
#             context['errormsg'] = 'Invalid tel submitted or tel already exists.'
#             return Response(data=context, status=400)

#         address = request.data['address'].strip()
#         address2 = request.data['address2'].strip()
#         postal = request.data['postal'].strip()
#         continent = request.data['continent']
#         country = request.data['country']
#         state = request.data['state']
#         city = request.data['city']
#         area = request.data['area']
#         region_str = ""

#         if continent != 'N/A':
#             region_str += continent
#         if country != 'N/A':
#             region_str += f" >>> {country}"
#         if state != 'N/A':
#             region_str += f" >>> {state}"
#         if city != 'N/A':
#             region_str += f" >>> {city}"
#         if area != 'N/A':
#             region_str += f" >>> {area}"

#         try:
#             contact = Contact.objects.create(
#                 name=cruising_company_name,
#                 address=address,
#                 tel=tel,
#                 tel2=tel2,
#                 tel3=tel3,
#                 email=email,
#                 website=website,
#                 address2=address2,
#                 postal=postal,
#             )

#             cruising_company = CruisingCompany.objects.create(
#                 name=cruising_company_name,
#                 lat=lat,
#                 lng=lng,
#                 contact_id=contact.id,
#                 region=region_str,
#             )

#             new_pd_id = PaymentDetails.objects.all().order_by("-id")[0].id + 1
#             if request.data['company'] == '':
#                 company_name = cruising_company_name
#             else:
#                 company_name = ''

#             payment_details = PaymentDetails.objects.create(
#                 id=new_pd_id,
#                 company=company_name,
#                 currency=request.data['currency'],
#                 iban=request.data['iban'],
#                 swift=request.data['swift'],
#             )
#             cruising_company.payment_details_id = payment_details.id
#             cruising_company.save()

#             History.objects.create(
#                 user=user,
#                 model_name='CC',
#                 action='CRE',
#                 description=f"User : {user.username} created a new Cruising Company with name: {cruising_company_name}"
#             )
#             context['new_cruising_company_id'] = cruising_company.id
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             print(exc)
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class AddDriver(generics.UpdateAPIView):
#     """
#     URL: add_driver
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": '', 'new_driver_id': ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_create(user.id, 'DRV'):
#             context = {"errormsg": "You do not have permission to create a Driver."}
#             return Response(status=401, data=context)

#         # Get coach operator
#         try:
#             coach_operator_name = request.data['coach_operator'].strip()
#             driver_name = request.data['name'].strip()
#         except Exception as exc:
#             context['errormsg'] = exc
#             return HttpResponse(status=400)

#         # Get driver's data
#         address = request.data['address'].strip()
#         address2 = request.data['address2'].strip()
#         postal = request.data['postal'].strip()
#         tel = request.data['tel'].strip()
#         for code in country_codes:
#             if tel.startswith(code):
#                 tel = "+" + tel[:len(code)] + ' ' + tel[len(code):]

#         tel2 = request.data['tel2'].strip()
#         for code in country_codes:
#             if tel2.startswith(code):
#                 tel2 = "+" + tel2[:len(code)] + ' ' + tel2[len(code):]

#         tel3 = request.data['tel3'].strip()
#         for code in country_codes:
#             if tel3.startswith(code):
#                 tel3 = "+" + tel3[:len(code)] + ' ' + tel3[len(code):]

#         email = request.data['email'].strip()
#         date_of_birth = request.data['date_of_birth']

#         # Validators
#         if not validate_name(driver_name):
#             context['errormsg'] = 'Invalid name submitted'
#             return Response(data=context, status=400)

#         if not validate_tel_details([tel, tel2, tel3]):
#             context['errormsg'] = 'Invalid tel submitted or tel already exists.'
#             return Response(data=context, status=400)

#         continent = request.data['continent']
#         country = request.data['country']
#         state = request.data['state']
#         city = request.data['city']
#         area = request.data['area']
#         region_str = ""

#         if continent != 'N/A':
#             region_str += continent
#         if country != 'N/A':
#             region_str += f" >>> {country}"
#         if state != 'N/A':
#             region_str += f" >>> {state}"
#         if city != 'N/A':
#             region_str += f" >>> {city}"
#         if area != 'N/A':
#             region_str += f" >>> {area}"

#         try:
#             driver = Contact.objects.create(
#                 name=driver_name,
#                 address=address,
#                 tel=tel,
#                 tel2=tel2,
#                 tel3=tel3,
#                 email=email,
#                 date_of_birth=date_of_birth,
#                 type='D',
#                 address2=address2,
#                 postal=postal,
#                 region=region_str,
#             )
#             if request.data['self_employed']:
#                 # Get or create the contact
#                 coach_operator_contact, contact_created = Contact.objects.get_or_create(name=driver_name, type="C")

#                 # Get or create the coach operator
#                 coach_operator, operator_created = CoachOperator.objects.get_or_create(
#                     name=driver_name,
#                     contact=coach_operator_contact
#                 )

#                 # If the coach operator was created, add the driver
#                 if operator_created:
#                     coach_operator.drivers.add(driver)

#                 # If the coach operator was created or retrieved
#                 if operator_created or not operator_created:
#                     # Get the latest payment details ID
#                     latest_payment_details_id = PaymentDetails.objects.latest('id').id if PaymentDetails.objects.exists() else 0

#                     # Create payment details
#                     payment_details, payment_details_created = PaymentDetails.objects.get_or_create(
#                         id=latest_payment_details_id + 1,
#                         company=None,
#                         currency=None,
#                         iban=None,
#                         swift=None,
#                     )

#                     # Assign payment details to coach operator if created
#                     if payment_details_created:
#                         coach_operator.payment_details = payment_details
#                         coach_operator.save()
#             else:
#                 coach_operator = CoachOperator.objects.get(name=coach_operator_name)
#                 coach_operator.drivers.add(driver)
#                 coach_operator.save()
#             driver.save()
#             History.objects.create(
#                 user=user,
#                 model_name='DRV',
#                 action='CRE',
#                 description=f"User : {user.username} created a new Driver with name : {driver.name}"
#             )
#             context['new_driver_id'] = driver.id
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             print(exc)
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class AddFerryTicketAgency(generics.UpdateAPIView):
#     """
#     URL: add_ferry_ticket_agency
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": '', 'new_ferry_ticket_agency_id': ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_create(user.id, 'FTA'):
#             context = {"errormsg": "You do not have permission to create a Ferry Ticket Agency."}
#             return Response(status=401, data=context)

#         # Get ferry ticket agency's data
#         ferry_ticket_agency_name = request.data['name'].strip()
#         address = request.data['address'].strip()
#         tel = request.data['tel'].strip()
#         for code in country_codes:
#             if tel.startswith(code):
#                 tel = "+" + tel[:len(code)] + ' ' + tel[len(code):]

#         tel2 = request.data['tel2'].strip()
#         for code in country_codes:
#             if tel2.startswith(code):
#                 tel2 = "+" + tel2[:len(code)] + ' ' + tel2[len(code):]

#         tel3 = request.data['tel3'].strip()
#         for code in country_codes:
#             if tel3.startswith(code):
#                 tel3 = "+" + tel3[:len(code)] + ' ' + tel3[len(code):]
#         email = request.data['email'].strip()
#         website = request.data['website'].strip()
#         # Get lat/lng
#         lat_lng = request.data['lat_lng']
#         lat = lat_lng.split(", ")[0]
#         lng = lat_lng.split(", ")[1]

#         # Latitude range is between -90-90, anything else is invalid
#         if float(lat) > 90 or float(lat) < -90:
#             context = {"errormsg": "Invalid Lat submitted"}
#             return Response(status=400, data=context)

#         # Longitude range is between -90-90, anything else is invalid
#         if float(lng) > 180 or float(lng) < -180:
#             context = {"errormsg": "Invalid Lng submitted"}
#             return Response(status=400, data=context)

#         all_names = [i.name for i in FerryTicketAgency.objects.all()]

#         if ferry_ticket_agency_name in all_names:
#             context['errormsg'] = 'Name already exists.'
#             return Response(data=context, status=400)

#         if not validate_tel_details([tel, tel2, tel3]):
#             context['errormsg'] = 'Invalid tel submitted or tel already exists.'
#             return Response(data=context, status=400)

#         address = request.data['address'].strip()
#         address2 = request.data['address2'].strip()
#         postal = request.data['postal'].strip()

#         continent = request.data['continent']
#         country = request.data['country']
#         state = request.data['state']
#         city = request.data['city']
#         area = request.data['area']
#         region_str = ""

#         if continent != 'N/A':
#             region_str += continent
#         if country != 'N/A':
#             region_str += f" >>> {country}"
#         if state != 'N/A':
#             region_str += f" >>> {state}"
#         if city != 'N/A':
#             region_str += f" >>> {city}"
#         if area != 'N/A':
#             region_str += f" >>> {area}"

#         try:
#             contact = Contact.objects.create(
#                 name=ferry_ticket_agency_name,
#                 address=address,
#                 tel=tel,
#                 tel2=tel2,
#                 tel3=tel3,
#                 email=email,
#                 website=website,
#                 address2=address2,
#                 postal=postal,
#             )

#             ferry_ticket_agency = FerryTicketAgency.objects.create(
#                 name=ferry_ticket_agency_name,
#                 lat=lat,
#                 lng=lng,
#                 contact_id=contact.id,
#                 region=region_str,
#             )

#             new_pd_id = PaymentDetails.objects.all().order_by("-id")[0].id + 1
#             if request.data['company'] == '':
#                 company_name = ferry_ticket_agency_name
#             else:
#                 company_name = ''

#             payment_details = PaymentDetails.objects.create(
#                 id=new_pd_id,
#                 company=company_name,
#                 currency=request.data['currency'],
#                 iban=request.data['iban'],
#                 swift=request.data['swift'],
#             )
#             ferry_ticket_agency.payment_details_id = payment_details.id
#             ferry_ticket_agency.save()

#             History.objects.create(
#                 user=user,
#                 model_name='FTA',
#                 action='CRE',
#                 description=f"User : {user.username} created a Ferry Ticket Agency with name: {ferry_ticket_agency_name}"
#             )
#             context['new_ferry_ticket_agency_id'] = ferry_ticket_agency.id
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class AddDMC(generics.UpdateAPIView):
#     """
#     URL: add_dmc
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": '', 'new_dmc_id': ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_create(user.id, 'DMC'):
#             context = {"errormsg": "You do not have permission to create a Destination Management Company."}
#             return Response(status=401, data=context)

#         # Get destination management company's data
#         dmc_name = request.data['name'].strip()
#         address = request.data['address'].strip()
#         tel = request.data['tel'].strip()
#         for code in country_codes:
#             if tel.startswith(code):
#                 tel = "+" + tel[:len(code)] + ' ' + tel[len(code):]

#         tel2 = request.data['tel2'].strip()
#         for code in country_codes:
#             if tel2.startswith(code):
#                 tel2 = "+" + tel2[:len(code)] + ' ' + tel2[len(code):]

#         tel3 = request.data['tel3'].strip()
#         for code in country_codes:
#             if tel3.startswith(code):
#                 tel3 = "+" + tel3[:len(code)] + ' ' + tel3[len(code):]
#         email = request.data['email'].strip()
#         website = request.data['website'].strip()
#         # Get lat/lng
#         lat_lng = request.data['lat_lng']
#         lat = lat_lng.split(", ")[0]
#         lng = lat_lng.split(", ")[1]

#         # Latitude range is between -90-90, anything else is invalid
#         if float(lat) > 90 or float(lat) < -90:
#             context = {"errormsg": "Invalid Lat submitted"}
#             return Response(status=400, data=context)

#         # Longitude range is between -90-90, anything else is invalid
#         if float(lng) > 180 or float(lng) < -180:
#             context = {"errormsg": "Invalid Lng submitted"}
#             return Response(status=400, data=context)

#         all_names = [i.name for i in DMC.objects.all()]

#         if dmc_name in all_names:
#             context['errormsg'] = 'Name already exists.'
#             return Response(data=context, status=400)

#         if not validate_tel_details([tel, tel2, tel3]):
#             context['errormsg'] = 'Invalid tel submitted or tel already exists.'
#             return Response(data=context, status=400)

#         address = request.data['address'].strip()
#         address2 = request.data['address2'].strip()
#         postal = request.data['postal'].strip()

#         continent = request.data['continent']
#         country = request.data['country']
#         state = request.data['state']
#         city = request.data['city']
#         area = request.data['area']
#         region_str = ""

#         if continent != 'N/A':
#             region_str += continent
#         if country != 'N/A':
#             region_str += f" >>> {country}"
#         if state != 'N/A':
#             region_str += f" >>> {state}"
#         if city != 'N/A':
#             region_str += f" >>> {city}"
#         if area != 'N/A':
#             region_str += f" >>> {area}"

#         try:
#             contact = Contact.objects.create(
#                 name=dmc_name,
#                 address=address,
#                 tel=tel,
#                 tel2=tel2,
#                 tel3=tel3,
#                 email=email,
#                 website=website,
#                 address2=address2,
#                 postal=postal,
#             )

#             dmc = DMC.objects.create(
#                 name=dmc_name,
#                 lat=lat,
#                 lng=lng,
#                 contact_id=contact.id,
#                 region=region_str,
#             )

#             new_pd_id = PaymentDetails.objects.all().order_by("-id")[0].id + 1
#             if request.data['company'] == '':
#                 company_name = dmc_name
#             else:
#                 company_name = ''

#             payment_details = PaymentDetails.objects.create(
#                 id=new_pd_id,
#                 company=company_name,
#                 currency=request.data['currency'],
#                 iban=request.data['iban'],
#                 swift=request.data['swift'],
#             )
#             dmc.payment_details_id = payment_details.id
#             dmc.save()

#             History.objects.create(
#                 user=user,
#                 model_name='DMC',
#                 action='CRE',
#                 description=f"User : {user.username} created a new Destination Management Company \
#                     with name: {dmc_name}"
#             )
#             context['new_dmc_id'] = dmc.id
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class AddGroupLeader(generics.UpdateAPIView):
#     """
#     URL: add_group_leader
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": '', 'new_group_leader_id': ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_create(user.id, 'GL'):
#             context = {"errormsg": "You do not have permission to create a Group Leader."}
#             return Response(status=401, data=context)

#         # Get group leader's data
#         group_leader_name = request.data['name'].strip()
#         address = request.data['address'].strip()
#         address2 = request.data['address2'].strip()
#         postal = request.data['postal'].strip()
#         tel = request.data['tel'].strip()

#         for code in country_codes:
#             if tel.startswith(code):
#                 tel = "+" + tel[:len(code)] + ' ' + tel[len(code):]

#         tel2 = request.data['tel2'].strip()
#         for code in country_codes:
#             if tel2.startswith(code):
#                 tel2 = "+" + tel2[:len(code)] + ' ' + tel2[len(code):]

#         tel3 = request.data['tel3'].strip()
#         for code in country_codes:
#             if tel3.startswith(code):
#                 tel3 = "+" + tel3[:len(code)] + ' ' + tel3[len(code):]
#         email = request.data['email'].strip()
#         rating = request.data['rating'].strip()

#         # Validators
#         if len(group_leader_name) < 5:
#             context['errormsg'] = 'Invalid name submitted'
#             return Response(data=context, status=400)
#         if not validate_tel_details([tel, tel2, tel3]):
#             context['errormsg'] = 'Invalid tel submitted or tel already exists.'
#             return Response(data=context, status=400)

#         all_names = [i.name for i in Contact.objects.filter(type='L')]

#         if group_leader_name in all_names:
#             context['errormsg'] = 'Name already exists.'
#             return Response(data=context, status=400)

#         continent = request.data['continent']
#         country = request.data['country']
#         state = request.data['state']
#         city = request.data['city']
#         area = request.data['area']
#         region_str = ""

#         if continent != 'N/A':
#             region_str += continent
#         if country != 'N/A':
#             region_str += f" >>> {country}"
#         if state != 'N/A':
#             region_str += f" >>> {state}"
#         if city != 'N/A':
#             region_str += f" >>> {city}"
#         if area != 'N/A':
#             region_str += f" >>> {area}"

#         try:
#             group_leader = Contact.objects.create(
#                 name=group_leader_name,
#                 address=address,
#                 tel=tel,
#                 tel2=tel2,
#                 tel3=tel3,
#                 email=email,
#                 type='L',
#                 rating=rating,
#                 address2=address2,
#                 postal=postal,
#                 region=region_str,
#             )
#             new_pd_id = PaymentDetails.objects.all().order_by("-id")[0].id + 1
#             if request.data['company'] == '':
#                 company_name = group_leader_name
#             else:
#                 company_name = ''

#             payment_details = PaymentDetails.objects.create(
#                 id=new_pd_id,
#                 company=company_name,
#                 currency=request.data['currency'],
#                 iban=request.data['iban'],
#                 swift=request.data['swift'],
#             )
#             group_leader.payment_details_id = payment_details.id
#             group_leader.save()

#             group_leader.save()
#             History.objects.create(
#                 user=user,
#                 model_name='GL',
#                 action='CRE',
#                 description=f"User : {user.username} created a new Group Leader with name: {group_leader_name}"
#             )
#             context['new_group_leader_id'] = group_leader.id
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class AddGuide(generics.UpdateAPIView):
#     """
#     URL: add_guide
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": '', 'new_guide_id': ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_create(user.id, 'GD'):
#             context = {"errormsg": "You do not have permission to create a Guide."}
#             return Response(status=401, data=context)

#         # Get guide's data
#         guide_name = request.data['name'].strip()
#         address = request.data['address'].strip()
#         tel = request.data['tel'].strip()
#         for code in country_codes:
#             if tel.startswith(code):
#                 tel = "+" + tel[:len(code)] + ' ' + tel[len(code):]

#         tel2 = request.data['tel2'].strip()
#         for code in country_codes:
#             if tel2.startswith(code):
#                 tel2 = "+" + tel2[:len(code)] + ' ' + tel2[len(code):]

#         tel3 = request.data['tel3'].strip()
#         for code in country_codes:
#             if tel3.startswith(code):
#                 tel3 = "+" + tel3[:len(code)] + ' ' + tel3[len(code):]
#         email = request.data['email'].strip()
#         all_names = [i.name for i in Guide.objects.all()]

#         if guide_name in all_names:
#             context['errormsg'] = 'Name already exists.'
#             return Response(data=context, status=400)

#         if not validate_tel_details([tel, tel2, tel3]):
#             context['errormsg'] = 'Invalid tel submitted or tel already exists.'
#             return Response(data=context, status=400)

#         address = request.data['address'].strip()
#         address2 = request.data['address2'].strip()
#         postal = request.data['postal'].strip()

#         continent = request.data['continent']
#         country = request.data['country']
#         state = request.data['state']
#         city = request.data['city']
#         area = request.data['area']
#         region_str = ""

#         if continent != 'N/A':
#             region_str += continent
#         if country != 'N/A':
#             region_str += f" >>> {country}"
#         if state != 'N/A':
#             region_str += f" >>> {state}"
#         if city != 'N/A':
#             region_str += f" >>> {city}"
#         if area != 'N/A':
#             region_str += f" >>> {area}"

#         try:
#             contact = Contact.objects.create(
#                 name=guide_name,
#                 address=address,
#                 tel=tel,
#                 tel2=tel2,
#                 tel3=tel3,
#                 email=email,
#                 address2=address2,
#                 postal=postal,
#             )

#             guide = Guide.objects.create(
#                 name=guide_name,
#                 contact_id=contact.id,
#                 region=region_str,
#             )

#             new_pd_id = PaymentDetails.objects.all().order_by("-id")[0].id + 1
#             if request.data['company'] == '':
#                 company_name = guide_name
#             else:
#                 company_name = ''

#             payment_details = PaymentDetails.objects.create(
#                 id=new_pd_id,
#                 company=company_name,
#                 currency=request.data['currency'],
#                 iban=request.data['iban'],
#                 swift=request.data['swift'],
#             )
#             guide.payment_details_id = payment_details.id
#             guide.save()

#             History.objects.create(
#                 user=user,
#                 model_name='GD',
#                 action='CRE',
#                 description=f"User : {user.username} created a new Guide with name: {guide_name}"
#             )
#             context['new_guide_id'] = guide.id
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class CheckForHotelDuplicates(generics.UpdateAPIView):
#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         name = request.data['name'].strip()
#         rating = request.data['rating']
#         address = request.data['address'].strip()
#         email = request.data['email'].strip()
#         website = request.data['website'].strip()
#         lat_lng = request.data['lat_lng']
#         lat = lat_lng.split(", ")[0]
#         lng = lat_lng.split(", ")[1]
#         tel = request.data['tel'].strip()

#         for code in country_codes:
#             if tel.startswith(code):
#                 tel = "+" + tel[:len(code)] + ' ' + tel[len(code):]

#         tel2 = request.data['tel2'].strip()
#         for code in country_codes:
#             if tel2.startswith(code):
#                 tel2 = "+" + tel2[:len(code)] + ' ' + tel2[len(code):]

#         tel3 = request.data['tel3'].strip()
#         for code in country_codes:
#             if tel3.startswith(code):
#                 tel3 = "+" + tel3[:len(code)] + ' ' + tel3[len(code):]

#         # 1) Name
#         name_tokens = set(name.lower().split())
#         min_matching_words = 2

#         # Ensure at least min_matching_words words are present in the hotel name
#         if len(name_tokens) >= min_matching_words:
#             existing_hotels_by_name = Hotel.objects.filter(reduce(operator.or_, (Q(name__icontains=token) for token in name_tokens), ))
#         else:
#             existing_hotels_by_name = Hotel.objects.none()

#         # 2) Tel
#         existing_hotels_by_tel = Hotel.objects.filter(contact__tel=tel)

#         # 3) Email
#         existing_hotels_by_email = Hotel.objects.filter(contact__email=email)

#         # 4) Address
#         address_tokens = set(address.lower().split())
#         min_matching_words = 2
#         address_queries = [Q(contact__address__icontains=token) for token in address_tokens]
#         combined_address_query = reduce(operator.and_, address_queries)
#         num_conditions = len(address_queries)
#         if num_conditions < min_matching_words:
#             existing_hotels_by_address = Hotel.objects.none()
#         else:
#             existing_hotels_by_address = Hotel.objects.filter(combined_address_query)

#         # 5) Website
#         current_domain = extract_domain(website)
#         existing_hotels_by_website = Hotel.objects.filter(
#             contact__website__icontains=current_domain
#         )

#         # 7) Rating
#         existing_hotels_by_rating = Hotel.objects.filter(rating=rating)

#         # 8) Lat / Lng
#         # Find hotels 500 meters from lat lng.
#         from django.db import connection
#         cursor = connection.cursor()
#         cursor.execute("""
#             SELECT A.ID, A.name, A.lat, A.lng,
#             acos(sin(radians(%s))*sin(radians(lat))
#              + cos(radians(%s))*cos(radians(lat))*
#              cos(radians(lng-(%s)))) * 6371 AS D
#             FROM webapp_hotel A
#             WHERE acos(sin(radians(%s))*sin(radians(lat)) +
#             cos(radians(%s))*cos(radians(lat))*cos(radians(lng-(%s)))) *
#             6371 < %s
#             """, [lat, lat, lng, lat, lat, lng, str(0.5)]
#         )

#         existing_hotels_by_lat_lng = Hotel.objects.filter(id__in=[row[0] for row in cursor.fetchall()])

#         # Create sets for each array
#         name_set = set(existing_hotels_by_name.values_list('id', flat=True))
#         tel_set = set(existing_hotels_by_tel.values_list('id', flat=True))
#         email_set = set(existing_hotels_by_email.values_list('id', flat=True))
#         address_set = set(existing_hotels_by_address.values_list('id', flat=True))
#         website_set = set(existing_hotels_by_website.values_list('id', flat=True))
#         rating_set = set(existing_hotels_by_rating.values_list('id', flat=True))
#         lat_lng_set = set(existing_hotels_by_lat_lng.values_list('id', flat=True))

#         # Create a dictionary to store the count of arrays for each hotel
#         hotel_arrays_count = {}

#         # Iterate through all hotels and count how many arrays each is present in
#         for hotel_id in set(name_set | tel_set | email_set | address_set | website_set | rating_set | lat_lng_set):
#             count = sum([
#                 hotel_id in name_set,
#                 hotel_id in tel_set,
#                 hotel_id in email_set,
#                 hotel_id in address_set,
#                 hotel_id in website_set,
#                 hotel_id in rating_set,
#                 hotel_id in lat_lng_set,
#             ])
#             hotel_arrays_count[hotel_id] = count

#         # Create a list to store dictionaries for each hotel along with the criteria met
#         possible_duplicate_data = []

#         # Iterate through hotels present in 3 or more arrays
#         for hotel_id, count in hotel_arrays_count.items():
#             if count >= 3:
#                 # Retrieve the hotel object
#                 hotel = Hotel.objects.get(id=hotel_id)

#                 # Create a dictionary for the hotel and the criteria met
#                 hotel_data = {
#                     'hotel': HotelSerializer(hotel).data,
#                     'criteria': []
#                 }

#                 # Check and add criteria for each condition
#                 if hotel_id in name_set:
#                     hotel_data['criteria'].append('name')
#                 if hotel_id in tel_set:
#                     hotel_data['criteria'].append('tel')
#                 if hotel_id in email_set:
#                     hotel_data['criteria'].append('email')
#                 if hotel_id in address_set:
#                     hotel_data['criteria'].append('address')
#                 if hotel_id in website_set:
#                     hotel_data['criteria'].append('website')
#                 if hotel_id in rating_set:
#                     hotel_data['criteria'].append('rating')
#                 if hotel_id in lat_lng_set:
#                     hotel_data['criteria'].append('lat_lng')

#                 # Append the hotel data to the list
#                 possible_duplicate_data.append(hotel_data)

#         # Return the list of hotel data with criteria
#         return Response({"possible_duplicates": possible_duplicate_data}, status=200)


# class AddHotel(generics.UpdateAPIView):
#     """
#     URL: create_hotel
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": '', 'new_hotel_id': ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_create(user.id, 'HTL'):
#             context = {"errormsg": "You do not have permission to create a Hotel."}
#             return Response(status=401, data=context)

#         # Get Hotel's data
#         try:
#             name = request.data['name'].strip()
#             rating = request.data['rating']
#             priority = request.data['priority']
#             number_of_rooms = request.data['number_of_rooms']
#             if priority == '':
#                 priority = None
#         except Exception as exc:
#             context['errormsg'] = exc
#             return HttpResponse(status=400)

#         address = request.data['address'].strip()
#         tel = request.data['tel'].strip()
#         for code in country_codes:
#             if tel.startswith(code):
#                 tel = "+" + tel[:len(code)] + ' ' + tel[len(code):]

#         tel2 = request.data['tel2'].strip()
#         for code in country_codes:
#             if tel2.startswith(code):
#                 tel2 = "+" + tel2[:len(code)] + ' ' + tel2[len(code):]

#         tel3 = request.data['tel3'].strip()
#         for code in country_codes:
#             if tel3.startswith(code):
#                 tel3 = "+" + tel3[:len(code)] + ' ' + tel3[len(code):]
#         email = request.data['email'].strip()
#         website = request.data['website'].strip()
#         # Get lat/lng
#         lat_lng = request.data['lat_lng']
#         lat = lat_lng.split(", ")[0]
#         lng = lat_lng.split(", ")[1]

#         address = request.data['address'].strip()
#         address2 = request.data['address2'].strip()
#         postal = request.data['postal'].strip()

#         # Validators
#         if len(name) < 5:
#             context['errormsg'] = 'Invalid name submitted'
#             return Response(data=context, status=400)
#         if rating not in ['0', '10', '20', '30', '40', '45', '50', '55', 0, 10, 20, 30, 40, 45, 50, 55]:
#             context['errormsg'] = 'Invalid rating submitted'
#             return Response(data=context, status=400)
#         if len(address) < 5:
#             context['errormsg'] = 'Invalid address submitted'
#             return Response(data=context, status=400)

#         if not validate_tel_details([tel, tel2, tel3]):
#             context['errormsg'] = 'Invalid tel submitted or tel already exists.'
#             return Response(data=context, status=400)

#         # Latitude range is between -90-90, anything else is invalid
#         if float(lat) > 90 or float(lat) < -90:
#             context = {"errormsg": "Invalid Lat submitted"}
#             return Response(status=400, data=context)

#         # Longitude range is between -90-90, anything else is invalid
#         if float(lng) > 180 or float(lng) < -180:
#             context = {"errormsg": "Invalid Lng submitted"}
#             return Response(status=400, data=context)

#         all_names = [i.name for i in Hotel.objects.all()]

#         if name in all_names:
#             context['errormsg'] = 'Name already exists.'
#             return Response(data=context, status=400)

#         continent = request.data['continent']
#         country = request.data['country']
#         state = request.data['state']
#         city = request.data['city']
#         area = request.data['area']
#         region_str = ""

#         if continent != 'N/A':
#             region_str += continent
#         if country != 'N/A':
#             region_str += f" >>> {country}"
#         if state != 'N/A':
#             region_str += f" >>> {state}"
#         if city != 'N/A':
#             region_str += f" >>> {city}"
#         if area != 'N/A':
#             region_str += f" >>> {area}"

#         try:
#             # Add amenities after creation
#             new_amenity = Amenity.objects.latest('id').id + 1
#             amenity = Amenity.objects.create(id=new_amenity)
#             hotel = Hotel.objects.create(
#                 name=name,
#                 rating=rating,
#                 lat=lat,
#                 lng=lng,
#                 amenity_id=amenity.id,
#                 number_of_rooms=number_of_rooms,
#                 priority=priority,
#                 region=region_str,
#             )
#             contact = Contact.objects.create(
#                 name=name,
#                 type="H",
#                 address=address,
#                 tel=tel,
#                 tel2=tel2,
#                 tel3=tel3,
#                 email=email,
#                 website=website,
#                 address2=address2,
#                 postal=postal,
#             )
#             hotel.contact_id = contact.id

#             hotel_categories = request.data['checked_categories']

#             for hc in hotel_categories:
#                 hotel.categories.add(HotelCategory.objects.get(id=hc['id']))

#             new_pd_id = PaymentDetails.objects.all().order_by("-id")[0].id + 1
#             if request.data['company'] == '':
#                 company_name = name
#             else:
#                 company_name = ''

#             payment_details = PaymentDetails.objects.create(
#                 id=new_pd_id,
#                 company=company_name,
#                 currency=request.data['currency'],
#                 iban=request.data['iban'],
#                 swift=request.data['swift'],
#             )
#             hotel.payment_details_id = payment_details.id
#             hotel.save()

#             History.objects.create(
#                 user=user,
#                 model_name='HTL',
#                 action='CRE',
#                 description=f'User : {user.username} created a new Hotel with name {hotel.name}'
#             )
#             context['new_hotel_id'] = hotel.id
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             print(exc)
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class AddPort(generics.UpdateAPIView):
#     """
#     URL: add_port
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": '', 'new_port_name': ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_create(user.id, 'PRT'):
#             context = {"errormsg": "You do not have permission to create a Port."}
#             return Response(status=401, data=context)

#         # Get Port's data
#         try:
#             port_name = request.data['name'].strip()
#             code = request.data['code']
#             # Get lat/lng
#             lat_lng = request.data['lat_lng']
#             lat = lat_lng.split(", ")[0]
#             lng = lat_lng.split(", ")[1]
#             country = Country.objects.get(name=request.data['nationality'])

#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)

#         # Validators
#         if len(port_name) < 4:
#             context['errormsg'] = 'Invalid name submitted'
#             return Response(data=context, status=400)

#         if len(code) != 3:
#             context['errormsg'] = 'Invalid code submitted'
#             return Response(data=context, status=400)

#         # Latitude range is between -90-90, anything else is invalid
#         if float(lat) > 90 or float(lat) < -90:
#             context = {"errormsg": "Invalid Lat submitted"}
#             return Response(status=400, data=context)

#         # Longitude range is between -90-90, anything else is invalid
#         if float(lng) > 180 or float(lng) < -180:
#             context = {"errormsg": "Invalid Lng submitted"}
#             return Response(status=400, data=context)

#         all_names = [i.name for i in Port.objects.all()]

#         if port_name in all_names:
#             context['errormsg'] = 'Name already exists.'
#             return Response(data=context, status=400)

#         try:
#             port = Port.objects.create(
#                 name=port_name,
#                 lat=lat,
#                 lng=lng,
#                 codethree=code,
#                 nationality_id=country.id
#             )
#             History.objects.create(
#                 user=user,
#                 model_name='PRT',
#                 action='CRE',
#                 description=f"User : {user.username} created a new Port with name: {port_name}"
#             )
#             context['new_port_id'] = port.id
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class AddRailwayStation(generics.UpdateAPIView):
#     """
#     URL: add_railway_station
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": '', 'new_railway_station_name': ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_create(user.id, 'RS'):
#             context = {"errormsg": "You do not have permission to create a Railway Station."}
#             return Response(status=401, data=context)

#         # Get Port's data
#         try:
#             railway_station_name = request.data['name'].strip()
#             code = request.data['code']
#             # Get lat/lng
#             lat_lng = request.data['lat_lng']
#             lat = lat_lng.split(", ")[0]
#             lng = lat_lng.split(", ")[1]
#             country = Country.objects.get(name=request.data['country'])
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)

#         # Validators
#         if len(railway_station_name) < 4:
#             context['errormsg'] = 'Invalid name submitted'
#             return Response(data=context, status=400)

#         if len(code) != 3:
#             context['errormsg'] = 'Invalid code submitted'
#             return Response(data=context, status=400)

#         # Latitude range is between -90-90, anything else is invalid
#         if float(lat) > 90 or float(lat) < -90:
#             context = {"errormsg": "Invalid Lat submitted"}
#             return Response(status=400, data=context)

#         # Longitude range is between -90-90, anything else is invalid
#         if float(lng) > 180 or float(lng) < -180:
#             context = {"errormsg": "Invalid Lng submitted"}
#             return Response(status=400, data=context)

#         all_names = [i.name for i in RailwayStation.objects.all()]

#         if railway_station_name in all_names:
#             context['errormsg'] = 'Name already exists.'
#             return Response(data=context, status=400)

#         try:
#             railway_station = RailwayStation.objects.create(
#                 name=railway_station_name,
#                 lat=lat,
#                 lng=lng,
#                 codethree=code,
#                 nationality_id=country.id,
#             )
#             History.objects.create(
#                 user=user,
#                 model_name='PRT',
#                 action='CRE',
#                 description=f"User : {user.username} created a new Railway Station with name: {railway_station_name}"
#             )
#             context['new_railway_station_id'] = railway_station.id
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class AddRepairShop(generics.UpdateAPIView):
#     """
#     URL: add_repair_shop
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": '', 'new_repair_shop_id': ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_create(user.id, 'RSH'):
#             context = {"errormsg": "You do not have permission to create a Repair Shop."}
#             return Response(status=401, data=context)

#         # Get repair shop's  data
#         try:
#             repair_shop_name = request.data['name'].strip()
#             address = request.data['address'].strip()
#             tel = request.data['tel'].strip()
#             for code in country_codes:
#                 if tel.startswith(code):
#                     tel = "+" + tel[:len(code)] + ' ' + tel[len(code):]

#             tel2 = request.data['tel2'].strip()
#             for code in country_codes:
#                 if tel2.startswith(code):
#                     tel2 = "+" + tel2[:len(code)] + ' ' + tel2[len(code):]

#             tel3 = request.data['tel3'].strip()
#             for code in country_codes:
#                 if tel3.startswith(code):
#                     tel3 = "+" + tel3[:len(code)] + ' ' + tel3[len(code):]

#             email = request.data['email'].strip()
#             # Get lat/lng
#             lat_lng = request.data['lat_lng']
#             lat = lat_lng.split(", ")[0]
#             lng = lat_lng.split(", ")[1]
#             types = request.data['types']
#         except Exception as exc:
#             context['errormsg'] = exc
#             return HttpResponse(status=400)

#         # Validators
#         if len(repair_shop_name) < 5:
#             context['errormsg'] = 'Invalid name submitted'
#             return Response(data=context, status=400)

#         if len(address) < 5:
#             context['errormsg'] = 'Invalid address submitted'
#             return Response(data=context, status=400)

#         if len(tel) < 5:
#             context['errormsg'] = 'Invalid tel submitted'
#             return Response(data=context, status=400)

#         # Latitude range is between -90-90, anything else is invalid
#         if float(lat) > 90 or float(lat) < -90:
#             context = {"errormsg": "Invalid Lat submitted"}
#             return Response(status=400, data=context)

#         # Longitude range is between -90-90, anything else is invalid
#         if float(lng) > 180 or float(lng) < -180:
#             context = {"errormsg": "Invalid Lng submitted"}
#             return Response(status=400, data=context)

#         type_ids = (i['id'] for i in types)

#         all_names = [i.name for i in RepairShop.objects.all()]

#         if repair_shop_name in all_names:
#             context['errormsg'] = 'Name already exists.'
#             return Response(data=context, status=400)

#         if not validate_tel_details([tel, tel2, tel3]):
#             context['errormsg'] = 'Invalid tel submitted or tel already exists.'
#             return Response(data=context, status=400)

#         address = request.data['address'].strip()
#         address2 = request.data['address2'].strip()
#         postal = request.data['postal'].strip()
#         continent = request.data['continent']
#         country = request.data['country']
#         state = request.data['state']
#         city = request.data['city']
#         area = request.data['area']
#         region_str = ""

#         if continent != 'N/A':
#             region_str += continent
#         if country != 'N/A':
#             region_str += f" >>> {country}"
#         if state != 'N/A':
#             region_str += f" >>> {state}"
#         if city != 'N/A':
#             region_str += f" >>> {city}"
#         if area != 'N/A':
#             region_str += f" >>> {area}"

#         try:
#             repair_shop = RepairShop.objects.create(
#                 name=repair_shop_name,
#                 lat=lat,
#                 lng=lng,
#                 region=region_str,
#             )
#             contact = Contact.objects.create(
#                 name=repair_shop_name,
#                 type="S",
#                 address=address,
#                 tel=tel,
#                 tel2=tel2,
#                 tel3=tel3,
#                 address2=address2,
#                 postal=postal,
#                 email=email,
#             )
#             repair_shop.contact_id = contact.id
#             repair_shop.contact.save()
#             for id in type_ids:
#                 repair_shop.type.add(id)
#             repair_shop.save()

#             new_pd_id = PaymentDetails.objects.all().order_by("-id")[0].id + 1
#             if request.data['company'] == '':
#                 company_name = repair_shop_name
#             else:
#                 company_name = ''

#             payment_details = PaymentDetails.objects.create(
#                 id=new_pd_id,
#                 company=company_name,
#                 currency=request.data['currency'],
#                 iban=request.data['iban'],
#                 swift=request.data['swift'],
#             )
#             repair_shop.payment_details_id = payment_details.id
#             repair_shop.save()

#             History.objects.create(
#                 user=user,
#                 model_name='RSH',
#                 action='CRE',
#                 description=f"User : {user.username} created a new Repair Shop with name : {repair_shop_name}"
#             )
#             context['new_repair_shop_id'] = repair_shop.id
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class AddRestaurant(generics.UpdateAPIView):
#     """
#     URL: add_restaurant
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": '', 'new_restaurant_id': ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_create(user.id, 'RST'):
#             context = {"errormsg": "You do not have permission to create a Restaurant."}
#             return Response(status=401, data=context)

#         # Get restaurant's data
#         try:
#             name = request.data['name'].strip()
#             rating = request.data['rating']
#             capacity = request.data['capacity']
#         except Exception as exc:
#             context['errormsg'] = exc
#             return HttpResponse(status=400)

#         address = request.data['address'].strip()
#         tel = request.data['tel'].strip()
#         for code in country_codes:
#             if tel.startswith(code):
#                 tel = "+" + tel[:len(code)] + ' ' + tel[len(code):]

#         tel2 = request.data['tel2'].strip()
#         for code in country_codes:
#             if tel2.startswith(code):
#                 tel2 = "+" + tel2[:len(code)] + ' ' + tel2[len(code):]

#         tel3 = request.data['tel3'].strip()
#         for code in country_codes:
#             if tel3.startswith(code):
#                 tel3 = "+" + tel3[:len(code)] + ' ' + tel3[len(code):]
#         email = request.data['email'].strip()
#         website = request.data['website'].strip()
#         # Get lat/lng
#         lat_lng = request.data['lat_lng']
#         lat = lat_lng.split(", ")[0]
#         lng = lat_lng.split(", ")[1]
#         types = request.data['types']

#         # Validators
#         if len(name) < 5:
#             context['errormsg'] = 'Invalid name submitted'
#             return Response(data=context, status=400)

#         if rating not in ['0', '10', '20', '30', '40', '45', '50', '55', 0, 10, 20, 30, 40, 45, 50, 55]:
#             context['errormsg'] = 'Invalid rating submitted'
#             return Response(data=context, status=400)

#         if len(address) < 5:
#             context['errormsg'] = 'Invalid address submitted'
#             return Response(data=context, status=400)

#         if not validate_tel_details([tel, tel2, tel3]):
#             context['errormsg'] = 'Invalid tel submitted or tel already exists.'
#             return Response(data=context, status=400)

#         # Latitude range is between -90-90, anything else is invalid
#         if float(lat) > 90 or float(lat) < -90:
#             context = {"errormsg": "Invalid Lat submitted"}
#             return Response(status=400, data=context)

#         # Longitude range is between -90-90, anything else is invalid
#         if float(lng) > 180 or float(lng) < -180:
#             context = {"errormsg": "Invalid Lng submitted"}
#             return Response(status=400, data=context)

#         type_ids = (i['id'] for i in types)

#         all_names = [i.name for i in Restaurant.objects.all()]

#         if name in all_names:
#             context['errormsg'] = 'Name already exists.'
#             return Response(data=context, status=400)

#         address = request.data['address'].strip()
#         address2 = request.data['address2'].strip()
#         postal = request.data['postal'].strip()

#         continent = request.data['continent']
#         country = request.data['country']
#         state = request.data['state']
#         city = request.data['city']
#         area = request.data['area']
#         region_str = ""

#         if continent != 'N/A':
#             region_str += continent
#         if country != 'N/A':
#             region_str += f" >>> {country}"
#         if state != 'N/A':
#             region_str += f" >>> {state}"
#         if city != 'N/A':
#             region_str += f" >>> {city}"
#         if area != 'N/A':
#             region_str += f" >>> {area}"

#         try:
#             restaurant = Restaurant.objects.create(
#                 name=name,
#                 rating=rating,
#                 capacity=capacity,
#                 lat=lat,
#                 lng=lng,
#                 region=region_str,
#             )
#             contact = Contact.objects.create(
#                 name=name,
#                 type="R",
#                 address=address,
#                 tel=tel,
#                 tel2=tel2,
#                 tel3=tel3,
#                 email=email,
#                 website=website,
#                 address2=address2,
#                 postal=postal,
#             )
#             restaurant.contact_id = contact.id
#             for id in type_ids:
#                 restaurant.type.add(id)
#             restaurant.save()

#             new_pd_id = PaymentDetails.objects.all().order_by("-id")[0].id + 1
#             if request.data['company'] == '':
#                 company_name = name
#             else:
#                 company_name = ''

#             payment_details = PaymentDetails.objects.create(
#                 id=new_pd_id,
#                 company=company_name,
#                 currency=request.data['currency'],
#                 iban=request.data['iban'],
#                 swift=request.data['swift'],
#             )
#             restaurant.payment_details_id = payment_details.id
#             restaurant.save()

#             History.objects.create(
#                 user=user,
#                 model_name='RST',
#                 action='CRE',
#                 description=f'User : {user.username} created a new Restaurant with name {restaurant.name}'
#             )
#             context['new_restaurant_id'] = restaurant.id
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class AddSportEventSupplier(generics.UpdateAPIView):

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": '', 'new_sport_event_supplier_id': ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_create(user.id, 'SES'):
#             context = {"errormsg": "You do not have permission to create a Sport Event Supplier."}
#             return Response(status=401, data=context)

#         # Get sport event supplier's data
#         name = request.data['name'].strip()

#         # Get lat/lng
#         lat_lng = request.data['lat_lng']
#         lat = lat_lng.split(", ")[0]
#         lng = lat_lng.split(", ")[1]

#         # Contact data
#         address = request.data['address'].strip()
#         tel = request.data['tel'].strip()
#         for code in country_codes:
#             if tel.startswith(code):
#                 tel = "+" + tel[:len(code)] + ' ' + tel[len(code):]

#         tel2 = request.data['tel2'].strip()
#         for code in country_codes:
#             if tel2.startswith(code):
#                 tel2 = "+" + tel2[:len(code)] + ' ' + tel2[len(code):]

#         tel3 = request.data['tel3'].strip()
#         for code in country_codes:
#             if tel3.startswith(code):
#                 tel3 = "+" + tel3[:len(code)] + ' ' + tel3[len(code):]
#         email = request.data['email'].strip()
#         website = request.data['website'].strip()

#         # Validators
#         if len(name) < 5:
#             context['errormsg'] = 'Invalid name submitted'
#             return Response(data=context, status=400)

#         # Latitude range is between -90-90, anything else is invalid
#         if float(lat) > 90 or float(lat) < -90:
#             context = {"errormsg": "Invalid Lat submitted"}
#             return Response(status=400, data=context)

#         # Longitude range is between -90-90, anything else is invalid
#         if float(lng) > 180 or float(lng) < -180:
#             context = {"errormsg": "Invalid Lng submitted"}
#             return Response(status=400, data=context)

#         all_names = [i.name for i in SportEventSupplier.objects.all()]

#         if not validate_tel_details([tel, tel2, tel3]):
#             context['errormsg'] = 'Invalid tel submitted or tel already exists.'
#             return Response(data=context, status=400)

#         if name in all_names:
#             context['errormsg'] = 'Name already exists.'
#             return Response(data=context, status=400)

#         address = request.data['address'].strip()
#         address2 = request.data['address2'].strip()
#         postal = request.data['postal'].strip()

#         continent = request.data['continent']
#         country = request.data['country']
#         state = request.data['state']
#         city = request.data['city']
#         area = request.data['area']
#         region_str = ""

#         if continent != 'N/A':
#             region_str += continent
#         if country != 'N/A':
#             region_str += f" >>> {country}"
#         if state != 'N/A':
#             region_str += f" >>> {state}"
#         if city != 'N/A':
#             region_str += f" >>> {city}"
#         if area != 'N/A':
#             region_str += f" >>> {area}"

#         try:
#             sport_event_supplier = SportEventSupplier.objects.create(
#                 name=name,
#                 lat=lat,
#                 lng=lng,
#                 region=region_str,
#             )
#             contact = Contact.objects.create(
#                 name=name,
#                 address=address,
#                 tel=tel,
#                 tel2=tel2,
#                 tel3=tel3,
#                 email=email,
#                 website=website,
#                 address2=address2,
#                 postal=postal,
#             )
#             sport_event_supplier.contact_id = contact.id
#             sport_event_supplier.save()

#             new_pd_id = PaymentDetails.objects.all().order_by("-id")[0].id + 1
#             if request.data['company'] == '':
#                 company_name = name
#             else:
#                 company_name = ''

#             payment_details = PaymentDetails.objects.create(
#                 id=new_pd_id,
#                 company=company_name,
#                 currency=request.data['currency'],
#                 iban=request.data['iban'],
#                 swift=request.data['swift'],
#             )
#             sport_event_supplier.payment_details_id = payment_details.id
#             sport_event_supplier.save()

#             History.objects.create(
#                 user=user,
#                 model_name='SES',
#                 action='CRE',
#                 description=f'User : {user.username} created a new Sport Event Supplier with name {sport_event_supplier.name}'
#             )
#             context['new_sport_event_supplier_id'] = sport_event_supplier.id
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class AddTeleferikCompany(generics.UpdateAPIView):
#     """
#     URL: add_teleferik_company
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": '', 'new_teleferik_company_id': ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_create(user.id, 'TC'):
#             context = {"errormsg": "You do not have permission to create a Teleferik Company."}
#             return Response(status=401, data=context)

#         # Get teleferik company's data
#         teleferik_company_name = request.data['name'].strip()
#         address = request.data['address'].strip()
#         tel = request.data['tel'].strip()
#         for code in country_codes:
#             if tel.startswith(code):
#                 tel = "+" + tel[:len(code)] + ' ' + tel[len(code):]

#         tel2 = request.data['tel2'].strip()
#         for code in country_codes:
#             if tel2.startswith(code):
#                 tel2 = "+" + tel2[:len(code)] + ' ' + tel2[len(code):]

#         tel3 = request.data['tel3'].strip()
#         for code in country_codes:
#             if tel3.startswith(code):
#                 tel3 = "+" + tel3[:len(code)] + ' ' + tel3[len(code):]
#         email = request.data['email'].strip()
#         website = request.data['website'].strip()

#         # Get lat/lng
#         lat_lng = request.data['lat_lng']
#         lat = lat_lng.split(", ")[0]
#         lng = lat_lng.split(", ")[1]

#         # Latitude range is between -90-90, anything else is invalid
#         if float(lat) > 90 or float(lat) < -90:
#             context = {"errormsg": "Invalid Lat submitted"}
#             return Response(status=400, data=context)

#         # Longitude range is between -90-90, anything else is invalid
#         if float(lng) > 180 or float(lng) < -180:
#             context = {"errormsg": "Invalid Lng submitted"}
#             return Response(status=400, data=context)

#         all_names = [i.name for i in TeleferikCompany.objects.all()]

#         if teleferik_company_name in all_names:
#             context['errormsg'] = 'Name already exists.'
#             return Response(data=context, status=400)

#         if not validate_tel_details([tel, tel2, tel3]):
#             context['errormsg'] = 'Invalid tel submitted or tel already exists.'
#             return Response(data=context, status=400)

#         address = request.data['address'].strip()
#         address2 = request.data['address2'].strip()
#         postal = request.data['postal'].strip()

#         continent = request.data['continent']
#         country = request.data['country']
#         state = request.data['state']
#         city = request.data['city']
#         area = request.data['area']
#         region_str = ""

#         if continent != 'N/A':
#             region_str += continent
#         if country != 'N/A':
#             region_str += f" >>> {country}"
#         if state != 'N/A':
#             region_str += f" >>> {state}"
#         if city != 'N/A':
#             region_str += f" >>> {city}"
#         if area != 'N/A':
#             region_str += f" >>> {area}"

#         try:
#             contact = Contact.objects.create(
#                 name=teleferik_company_name,
#                 address=address,
#                 tel=tel,
#                 tel2=tel2,
#                 tel3=tel3,
#                 email=email,
#                 website=website,
#                 address2=address2,
#                 postal=postal,
#             )

#             teleferik_company = TeleferikCompany.objects.create(
#                 name=teleferik_company_name,
#                 lat=lat,
#                 lng=lng,
#                 contact_id=contact.id,
#                 region=region_str,
#             )

#             new_pd_id = PaymentDetails.objects.all().order_by("-id")[0].id + 1
#             if request.data['company'] == '':
#                 company_name = teleferik_company_name
#             else:
#                 company_name = ''

#             payment_details = PaymentDetails.objects.create(
#                 id=new_pd_id,
#                 company=company_name,
#                 currency=request.data['currency'],
#                 iban=request.data['iban'],
#                 swift=request.data['swift'],
#             )
#             teleferik_company.payment_details_id = payment_details.id
#             teleferik_company.save()

#             History.objects.create(
#                 user=user,
#                 model_name='TC',
#                 action='CRE',
#                 description=f"User : {user.username} created a new Teleferik Company with name: {teleferik_company_name}"
#             )
#             context['new_teleferik_company_id'] = teleferik_company.id
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class AddCarHireCompany(generics.UpdateAPIView):
#     """
#     URL: add_car_hire_company
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": '', 'new_car_hire_company_id': ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # # Permission
#         if not can_create(user.id, 'CH'):
#             context = {"errormsg": "You do not have permission to create a Teleferik Company."}
#             return Response(status=401, data=context)

#         # Get car hire company's data
#         car_hire_company_name = request.data['name'].strip()
#         address = request.data['address'].strip()
#         tel = request.data['tel'].strip()
#         for code in country_codes:
#             if tel.startswith(code):
#                 tel = "+" + tel[:len(code)] + ' ' + tel[len(code):]

#         tel2 = request.data['tel2'].strip()
#         for code in country_codes:
#             if tel2.startswith(code):
#                 tel2 = "+" + tel2[:len(code)] + ' ' + tel2[len(code):]

#         tel3 = request.data['tel3'].strip()
#         for code in country_codes:
#             if tel3.startswith(code):
#                 tel3 = "+" + tel3[:len(code)] + ' ' + tel3[len(code):]
#         email = request.data['email'].strip()
#         website = request.data['website'].strip()

#         # Get lat/lng
#         lat_lng = request.data['lat_lng']
#         lat = lat_lng.split(", ")[0]
#         lng = lat_lng.split(", ")[1]

#         # Latitude range is between -90-90, anything else is invalid
#         if float(lat) > 90 or float(lat) < -90:
#             context = {"errormsg": "Invalid Lat submitted"}
#             return Response(status=400, data=context)

#         # Longitude range is between -90-90, anything else is invalid
#         if float(lng) > 180 or float(lng) < -180:
#             context = {"errormsg": "Invalid Lng submitted"}
#             return Response(status=400, data=context)

#         all_names = [i.name for i in CarHireCompany.objects.all()]

#         if car_hire_company_name in all_names:
#             context['errormsg'] = 'Name already exists.'
#             return Response(data=context, status=400)

#         if not validate_tel_details([tel, tel2, tel3]):
#             context['errormsg'] = 'Invalid tel submitted or tel already exists.'
#             return Response(data=context, status=400)

#         address = request.data['address'].strip()
#         address2 = request.data['address2'].strip()
#         postal = request.data['postal'].strip()

#         continent = request.data['continent']
#         country = request.data['country']
#         state = request.data['state']
#         city = request.data['city']
#         area = request.data['area']
#         region_str = ""

#         if continent != 'N/A':
#             region_str += continent
#         if country != 'N/A':
#             region_str += f" >>> {country}"
#         if state != 'N/A':
#             region_str += f" >>> {state}"
#         if city != 'N/A':
#             region_str += f" >>> {city}"
#         if area != 'N/A':
#             region_str += f" >>> {area}"

#         try:
#             contact = Contact.objects.create(
#                 name=car_hire_company_name,
#                 address=address,
#                 tel=tel,
#                 tel2=tel2,
#                 tel3=tel3,
#                 email=email,
#                 website=website,
#                 address2=address2,
#                 postal=postal,
#             )

#             car_hire_company = CarHireCompany.objects.create(
#                 name=car_hire_company_name,
#                 lat=lat,
#                 lng=lng,
#                 contact_id=contact.id,
#                 region=region_str,
#             )

#             new_pd_id = PaymentDetails.objects.all().order_by("-id")[0].id + 1
#             if request.data['company'] == '':
#                 company_name = car_hire_company_name
#             else:
#                 company_name = ''

#             payment_details = PaymentDetails.objects.create(
#                 id=new_pd_id,
#                 company=company_name,
#                 currency=request.data['currency'],
#                 iban=request.data['iban'],
#                 swift=request.data['swift'],
#             )
#             car_hire_company.payment_details_id = payment_details.id
#             car_hire_company.save()

#             History.objects.create(
#                 user=user,
#                 model_name='CH',
#                 action='CRE',
#                 description=f"User : {user.username} created a new Car Hiring Company with name: {car_hire_company_name}"
#             )
#             context['new_car_hire_company_id'] = car_hire_company.id
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class AddAdvertisementCompany(generics.UpdateAPIView):
#     """
#     URL: add_advertisement_company
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": '', 'new_advertisement_company_id': ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_create(user.id, 'AD'):
#             context = {"errormsg": "You do not have permission to create an Advertisement Company."}
#             return Response(status=401, data=context)

#         # Get advertisement company's data
#         advertisement_company_name = request.data['name'].strip()
#         address = request.data['address'].strip()
#         tel = request.data['tel'].strip()
#         for code in country_codes:
#             if tel.startswith(code):
#                 tel = "+" + tel[:len(code)] + ' ' + tel[len(code):]

#         tel2 = request.data['tel2'].strip()
#         for code in country_codes:
#             if tel2.startswith(code):
#                 tel2 = "+" + tel2[:len(code)] + ' ' + tel2[len(code):]

#         tel3 = request.data['tel3'].strip()
#         for code in country_codes:
#             if tel3.startswith(code):
#                 tel3 = "+" + tel3[:len(code)] + ' ' + tel3[len(code):]
#         email = request.data['email'].strip()
#         website = request.data['website'].strip()

#         # Get lat/lng
#         lat_lng = request.data['lat_lng']
#         lat = lat_lng.split(", ")[0]
#         lng = lat_lng.split(", ")[1]

#         # Latitude range is between -90-90, anything else is invalid
#         if float(lat) > 90 or float(lat) < -90:
#             context = {"errormsg": "Invalid Lat submitted"}
#             return Response(status=400, data=context)

#         # Longitude range is between -90-90, anything else is invalid
#         if float(lng) > 180 or float(lng) < -180:
#             context = {"errormsg": "Invalid Lng submitted"}
#             return Response(status=400, data=context)

#         all_names = [i.name for i in AdvertisementCompany.objects.all()]

#         if advertisement_company_name in all_names:
#             context['errormsg'] = 'Name already exists.'
#             return Response(data=context, status=400)

#         if not validate_tel_details([tel, tel2, tel3]):
#             context['errormsg'] = 'Invalid tel submitted or tel already exists.'
#             return Response(data=context, status=400)

#         address = request.data['address'].strip()
#         address2 = request.data['address2'].strip()
#         postal = request.data['postal'].strip()

#         continent = request.data['continent']
#         country = request.data['country']
#         state = request.data['state']
#         city = request.data['city']
#         area = request.data['area']
#         region_str = ""

#         if continent != 'N/A':
#             region_str += continent
#         if country != 'N/A':
#             region_str += f" >>> {country}"
#         if state != 'N/A':
#             region_str += f" >>> {state}"
#         if city != 'N/A':
#             region_str += f" >>> {city}"
#         if area != 'N/A':
#             region_str += f" >>> {area}"

#         try:
#             contact = Contact.objects.create(
#                 name=advertisement_company_name,
#                 address=address,
#                 tel=tel,
#                 tel2=tel2,
#                 tel3=tel3,
#                 email=email,
#                 website=website,
#                 address2=address2,
#                 postal=postal,
#             )

#             advertisement_company = AdvertisementCompany.objects.create(
#                 name=advertisement_company_name,
#                 lat=lat,
#                 lng=lng,
#                 contact_id=contact.id,
#                 region=region_str,
#             )

#             new_pd_id = PaymentDetails.objects.all().order_by("-id")[0].id + 1
#             if request.data['company'] == '':
#                 company_name = advertisement_company_name
#             else:
#                 company_name = ''

#             payment_details = PaymentDetails.objects.create(
#                 id=new_pd_id,
#                 company=company_name,
#                 currency=request.data['currency'],
#                 iban=request.data['iban'],
#                 swift=request.data['swift'],
#             )
#             advertisement_company.payment_details_id = payment_details.id
#             advertisement_company.save()

#             History.objects.create(
#                 user=user,
#                 model_name='AD',
#                 action='CRE',
#                 description=f"User : {user.username} created a new Advertisement Company with name: {advertisement_company_name}"
#             )
#             context['new_advertisement_company_id'] = advertisement_company.id
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class AddCharterBroker(generics.UpdateAPIView):
#     """
#     URL: add_charter_broker
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": '', 'new_charter_broker_id': ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_create(user.id, 'CB'):
#             context = {"errormsg": "You do not have permission to create a Charter Broker."}
#             return Response(status=401, data=context)

#         # Get charter broker's data
#         charter_broker_name = request.data['name'].strip()
#         address = request.data['address'].strip()
#         tel = request.data['tel'].strip()
#         for code in country_codes:
#             if tel.startswith(code):
#                 tel = "+" + tel[:len(code)] + ' ' + tel[len(code):]

#         tel2 = request.data['tel2'].strip()
#         for code in country_codes:
#             if tel2.startswith(code):
#                 tel2 = "+" + tel2[:len(code)] + ' ' + tel2[len(code):]

#         tel3 = request.data['tel3'].strip()
#         for code in country_codes:
#             if tel3.startswith(code):
#                 tel3 = "+" + tel3[:len(code)] + ' ' + tel3[len(code):]
#         email = request.data['email'].strip()
#         website = request.data['website'].strip()

#         # Get lat/lng
#         lat_lng = request.data['lat_lng']
#         lat = lat_lng.split(", ")[0]
#         lng = lat_lng.split(", ")[1]

#         # Latitude range is between -90-90, anything else is invalid
#         if float(lat) > 90 or float(lat) < -90:
#             context = {"errormsg": "Invalid Lat submitted"}
#             return Response(status=400, data=context)

#         # Longitude range is between -90-90, anything else is invalid
#         if float(lng) > 180 or float(lng) < -180:
#             context = {"errormsg": "Invalid Lng submitted"}
#             return Response(status=400, data=context)

#         all_names = [i.name for i in CharterBroker.objects.all()]

#         if charter_broker_name in all_names:
#             context['errormsg'] = 'Name already exists.'
#             return Response(data=context, status=400)

#         if not validate_tel_details([tel, tel2, tel3]):
#             context['errormsg'] = 'Invalid tel submitted or tel already exists.'
#             return Response(data=context, status=400)

#         address = request.data['address'].strip()
#         address2 = request.data['address2'].strip()
#         postal = request.data['postal'].strip()

#         continent = request.data['continent']
#         country = request.data['country']
#         state = request.data['state']
#         city = request.data['city']
#         area = request.data['area']
#         region_str = ""

#         if continent != 'N/A':
#             region_str += continent
#         if country != 'N/A':
#             region_str += f" >>> {country}"
#         if state != 'N/A':
#             region_str += f" >>> {state}"
#         if city != 'N/A':
#             region_str += f" >>> {city}"
#         if area != 'N/A':
#             region_str += f" >>> {area}"

#         try:
#             contact = Contact.objects.create(
#                 name=charter_broker_name,
#                 address=address,
#                 tel=tel,
#                 tel2=tel2,
#                 tel3=tel3,
#                 email=email,
#                 website=website,
#                 address2=address2,
#                 postal=postal,
#             )

#             charter_broker = CharterBroker.objects.create(
#                 name=charter_broker_name,
#                 lat=lat,
#                 lng=lng,
#                 contact_id=contact.id,
#                 region=region_str,
#             )

#             new_pd_id = PaymentDetails.objects.all().order_by("-id")[0].id + 1
#             if request.data['company'] == '':
#                 company_name = charter_broker_name
#             else:
#                 company_name = ''

#             payment_details = PaymentDetails.objects.create(
#                 id=new_pd_id,
#                 company=company_name,
#                 currency=request.data['currency'],
#                 iban=request.data['iban'],
#                 swift=request.data['swift'],
#             )
#             charter_broker.payment_details_id = payment_details.id
#             charter_broker.save()

#             History.objects.create(
#                 user=user,
#                 model_name='AD',
#                 action='CRE',
#                 description=f"User : {user.username} created a new Charter Broker with name: {charter_broker_name}"
#             )
#             context['new_charter_broker_id'] = charter_broker.id
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class AddTheater(generics.UpdateAPIView):
#     """
#     URL:  add_theater
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": '', 'new_theater_id': ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_create(user.id, 'TH'):
#             context = {"errormsg": "You do not have permission to create a Theater."}
#             return Response(status=401, data=context)

#         # Get theater's data
#         try:
#             name = request.data['name'].strip()
#         except Exception as exc:
#             context['errormsg'] = exc
#             return HttpResponse(status=400)

#         # Get lat/lng
#         lat_lng = request.data['lat_lng']
#         lat = lat_lng.split(", ")[0]
#         lng = lat_lng.split(", ")[1]

#         # Contact data
#         address = request.data['address'].strip()
#         tel = request.data['tel'].strip()
#         for code in country_codes:
#             if tel.startswith(code):
#                 tel = "+" + tel[:len(code)] + ' ' + tel[len(code):]

#         tel2 = request.data['tel2'].strip()
#         for code in country_codes:
#             if tel2.startswith(code):
#                 tel2 = "+" + tel2[:len(code)] + ' ' + tel2[len(code):]

#         tel3 = request.data['tel3'].strip()
#         for code in country_codes:
#             if tel3.startswith(code):
#                 tel3 = "+" + tel3[:len(code)] + ' ' + tel3[len(code):]
#         email = request.data['email'].strip()
#         website = request.data['website'].strip()

#         # Validators
#         if len(name) < 5:
#             context['errormsg'] = 'Invalid name submitted'
#             return Response(data=context, status=400)

#         # Latitude range is between -90-90, anything else is invalid
#         if float(lat) > 90 or float(lat) < -90:
#             context = {"errormsg": "Invalid Lat submitted"}
#             return Response(status=400, data=context)

#         # Longitude range is between -90-90, anything else is invalid
#         if float(lng) > 180 or float(lng) < -180:
#             context = {"errormsg": "Invalid Lng submitted"}
#             return Response(status=400, data=context)

#         if len(address) < 5:
#             context['errormsg'] = 'Invalid address submitted'
#             return Response(data=context, status=400)

#         if not validate_tel_details([tel, tel2, tel3]):
#             context['errormsg'] = 'Invalid tel submitted or tel already exists.'
#             return Response(data=context, status=400)

#         all_names = [i.name for i in Theater.objects.all()]

#         if name in all_names:
#             context['errormsg'] = 'Name already exists.'
#             return Response(data=context, status=400)

#         address = request.data['address'].strip()
#         address2 = request.data['address2'].strip()
#         postal = request.data['postal'].strip()

#         continent = request.data['continent']
#         country = request.data['country']
#         state = request.data['state']
#         city = request.data['city']
#         area = request.data['area']
#         region_str = ""

#         if continent != 'N/A':
#             region_str += continent
#         if country != 'N/A':
#             region_str += f" >>> {country}"
#         if state != 'N/A':
#             region_str += f" >>> {state}"
#         if city != 'N/A':
#             region_str += f" >>> {city}"
#         if area != 'N/A':
#             region_str += f" >>> {area}"
#         try:
#             theater = Theater.objects.create(
#                 name=name,
#                 lat=lat,
#                 lng=lng,
#                 region=region_str,
#             )
#             contact = Contact.objects.create(
#                 name=name,
#                 address=address,
#                 tel=tel,
#                 tel2=tel2,
#                 tel3=tel3,
#                 email=email,
#                 website=website,
#                 address2=address2,
#                 postal=postal,
#             )
#             theater.contact_id = contact.id
#             theater.save()

#             new_pd_id = PaymentDetails.objects.all().order_by("-id")[0].id + 1
#             if request.data['company'] == '':
#                 company_name = name
#             else:
#                 company_name = ''

#             payment_details = PaymentDetails.objects.create(
#                 id=new_pd_id,
#                 company=company_name,
#                 currency=request.data['currency'],
#                 iban=request.data['iban'],
#                 swift=request.data['swift'],
#             )
#             theater.payment_details_id = payment_details.id
#             theater.save()

#             History.objects.create(
#                 user=user,
#                 model_name='TH',
#                 action='CRE',
#                 description=f'User : {user.username} created a new Theater with name {theater.name}'
#             )
#             context['new_theater_id'] = theater.id
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class AddTrainTicketAgency(generics.UpdateAPIView):
#     """
#     URL: add_train_ticket_agency
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": '', 'new_train_ticket_agency_id': ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_create(user.id, 'TTA'):
#             context = {"errormsg": "You do not have permission to create a Train Ticket Agency."}
#             return Response(status=401, data=context)

#         # Get train ticket agency's data
#         train_ticket_agency_name = request.data['name'].strip()
#         address = request.data['address'].strip()
#         tel = request.data['tel'].strip()
#         for code in country_codes:
#             if tel.startswith(code):
#                 tel = "+" + tel[:len(code)] + ' ' + tel[len(code):]

#         tel2 = request.data['tel2'].strip()
#         for code in country_codes:
#             if tel2.startswith(code):
#                 tel2 = "+" + tel2[:len(code)] + ' ' + tel2[len(code):]

#         tel3 = request.data['tel3'].strip()
#         for code in country_codes:
#             if tel3.startswith(code):
#                 tel3 = "+" + tel3[:len(code)] + ' ' + tel3[len(code):]
#         email = request.data['email'].strip()
#         website = request.data['website'].strip()
#         # Get lat/lng
#         lat_lng = request.data['lat_lng']
#         lat = lat_lng.split(", ")[0]
#         lng = lat_lng.split(", ")[1]

#         # Latitude range is between -90-90, anything else is invalid
#         if float(lat) > 90 or float(lat) < -90:
#             context = {"errormsg": "Invalid Lat submitted"}
#             return Response(status=400, data=context)

#         # Longitude range is between -90-90, anything else is invalid
#         if float(lng) > 180 or float(lng) < -180:
#             context = {"errormsg": "Invalid Lng submitted"}
#             return Response(status=400, data=context)

#         all_names = [i.name for i in TrainTicketAgency.objects.all()]

#         if train_ticket_agency_name in all_names:
#             context['errormsg'] = 'Name already exists.'
#             return Response(data=context, status=400)

#         if not validate_tel_details([tel, tel2, tel3]):
#             context['errormsg'] = 'Invalid tel submitted or tel already exists.'
#             return Response(data=context, status=400)

#         address = request.data['address'].strip()
#         address2 = request.data['address2'].strip()
#         postal = request.data['postal'].strip()

#         continent = request.data['continent']
#         country = request.data['country']
#         state = request.data['state']
#         city = request.data['city']
#         area = request.data['area']
#         region_str = ""

#         if continent != 'N/A':
#             region_str += continent
#         if country != 'N/A':
#             region_str += f" >>> {country}"
#         if state != 'N/A':
#             region_str += f" >>> {state}"
#         if city != 'N/A':
#             region_str += f" >>> {city}"
#         if area != 'N/A':
#             region_str += f" >>> {area}"

#         try:
#             contact = Contact.objects.create(
#                 name=train_ticket_agency_name,
#                 address=address,
#                 tel=tel,
#                 tel2=tel2,
#                 tel3=tel3,
#                 email=email,
#                 website=website,
#                 address2=address2,
#                 postal=postal,
#             )

#             train_ticket_agency = TrainTicketAgency.objects.create(
#                 name=train_ticket_agency_name,
#                 lat=lat,
#                 lng=lng,
#                 contact_id=contact.id,
#                 region=region_str,
#             )

#             new_pd_id = PaymentDetails.objects.all().order_by("-id")[0].id + 1
#             if request.data['company'] == '':
#                 company_name = train_ticket_agency_name
#             else:
#                 company_name = ''

#             payment_details = PaymentDetails.objects.create(
#                 id=new_pd_id,
#                 company=company_name,
#                 currency=request.data['currency'],
#                 iban=request.data['iban'],
#                 swift=request.data['swift'],
#             )
#             train_ticket_agency.payment_details_id = payment_details.id
#             train_ticket_agency.save()

#             History.objects.create(
#                 user=user,
#                 model_name='TTA',
#                 action='CRE',
#                 description=f"User : {user.username} created a new Train Ticket Agency with name: {train_ticket_agency_name}"
#             )

#             context['new_train_ticket_agency_id'] = train_ticket_agency.id
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class AddOffer(generics.UpdateAPIView):
#     """
#     URL: add_offer
#     Descr: Creates an offer, offer has two types:
#     1) Per person
#     2) By scale
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_create(user.id, 'OFF'):
#             context = {"errormsg": "You do not have permission to create an Offer."}
#             return Response(status=401, data=context)

#         name = request.data['name']
#         try:
#             recipient = Agent.objects.get(name=request.data['recipient'])
#         except Agent.DoesNotExist:
#             recipient = None
#         group_ref = request.data['group_ref']
#         date = request.data['date']
#         offer_type = request.data['offer_type']
#         document_type = request.data['document_type']
#         currency = request.data['currency']
#         start_date = request.data['start_date']
#         end_date = request.data['end_date']

#         period = f"{start_date} - {end_date}"
#         if start_date == end_date:
#             period = start_date

#         destination = request.data['destination']
#         number_of_people = request.data['pax']
#         profit = request.data['profit']
#         cancellation_deadline = request.data['cancellation_deadline']

#         try:
#             new_offer = Offer.objects.create(
#                 name=name,
#                 recipient=recipient,
#                 group_reference=group_ref,
#                 date=date,
#                 offer_type=offer_type,
#                 doc_type=document_type,
#                 currency=currency,
#                 period=period,
#                 destination=destination,
#                 number_of_people=number_of_people,
#                 profit=profit,
#                 cancellation_deadline=cancellation_deadline,
#             )
#             new_offer.save()
#             History.objects.create(
#                 user=user,
#                 model_name='OFF',
#                 action='CRE',
#                 description=f'User : {user.username} created new offer with name : {name}'
#             )
#         except Exception:
#             return Response(data=context, status=400)

#         context['offer_id'] = new_offer.id
#         return Response(data=context, status=status.HTTP_200_OK)


# class AddTextTemplate(generics.UpdateAPIView):
#     """
#     URL:  add_text_template
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": '', 'new_text_template_id': ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_create(user.id, 'TT'):
#             context = {"errormsg": "You do not have permission to create a Text Template."}
#             return Response(status=401, data=context)

#         # Get text template's data
#         text = request.data['text'].strip()
#         text_type = request.data['type'].strip()
#         countries = request.data['countries']

#         # Validators
#         if len(text) < 5:
#             context['errormsg'] = 'Invalid text submitted'
#             return Response(data=context, status=400)

#         # Validators
#         if len(text_type) == 0:
#             context['errormsg'] = 'Invalid type submitted'
#             return Response(data=context, status=400)

#         try:
#             text_template = TextTemplate.objects.create(text=text, type=text_type,)
#             text_template.save()
#             History.objects.create(
#                 user=user,
#                 model_name='TT',
#                 action='CRE',
#                 description=f'User : {user.username} created a new Text Template with id: {text_template.id}'
#             )

#             # Loop over countries, create an entry
#             for country in countries:
#                 newTTCountry = TextTemplateCountry.objects.create(name=country)
#                 text_template.countries.add(newTTCountry)
#                 text_template.save()
#             context['new_text_template_id'] = text_template.id
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class AddContract(generics.UpdateAPIView):
#     """
#     URL:  add_text_template
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": '', 'new_text_template_id': ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_create(user.id, 'CNT'):
#             context = {"errormsg": "You do not have permission to create a Contract."}
#             return Response(status=401, data=context)

#         # Get text template's data
#         name = request.data['name'].strip()
#         ctype = request.data['type']
#         status = request.data['status']
#         city_taxes_included = request.data['city_taxes_included']
#         currency = request.data['currency']
#         periods = request.data['period']

#         # Parse the JSON data into a Python list of dictionaries
#         data_list = json.loads(periods)

#         # Function to format date as dd/mm/YYYY
#         def format_date(date_str):
#             date_obj = datetime.datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%S.%fZ")
#             return date_obj.strftime("%d-%m-%Y")

#         # Format the dates and join them with commas
#         periods_str = ", ".join([f"{format_date(data['startDate'])} - {format_date(data['endDate'])}" for data in data_list])

#         # Function to convert date string to Python datetime object
#         def parse_date(date_str):
#             return datetime.datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%S.%fZ").date()

#         # Create a set to store unique dates
#         unique_dates_and_rooms = []

#         # Iterate through the list and add each date to the set
#         for data in data_list:
#             start_date = parse_date(data['startDate'])
#             end_date = parse_date(data['endDate'])
#             current_date = start_date
#             while current_date <= end_date:
#                 unique_dates_and_rooms.append({
#                     'current_date': current_date,
#                     'sgl': data['rooms']['sgl'],
#                     'dbl': data['rooms']['dbl'],
#                     'twin': data['rooms']['twin'],
#                     'trpl': data['rooms']['trpl'],
#                     'quad': data['rooms']['quad'],
#                 })
#                 current_date += datetime.timedelta(days=1)

#         # Convert the set to a sorted list of unique dates
#         # unique_dates_list = sorted(list(unique_dates_and_rooms))
#         release_period = request.data['release_period']
#         cancellation_limit = request.data['cancellation_limit']
#         cancellation_charge = request.data['cancellation_charge']

#         try:
#             file = request.FILES['file']
#         except MultiValueDictKeyError:
#             file = None

#         if ctype == 'HT':
#             hotel = request.data['hotel']
#             infant_age = request.data['infant_age']
#             child_age = request.data['child_age']
#             pricing = request.data['pricing']
#             inclusive_board = request.data['inclusive_board']
#             contract = Contract.objects.create(
#                 name=name,
#                 status=True if status == 'true' else False,
#                 currency=currency,
#                 period=periods_str,
#                 release_period=int(release_period),
#                 cancellation_limit=int(cancellation_limit),
#                 cancellation_charge=int(cancellation_charge),
#                 hotel=Hotel.objects.get(name=hotel),
#                 infant_age=int(infant_age),
#                 child_age=int(child_age),
#                 pricing=pricing,
#                 inclusive_board=inclusive_board,
#                 city_taxes_included=True if city_taxes_included == 'true' else False,
#             )

#             # Print the list of unique dates
#             # if the period is like this : 1) 20/07/2023 - 28/07/2023 / 2) 03/08/2023 - 25/08/2023
#             # This function does not include 28/07 and 25/08
#             for day_data in unique_dates_and_rooms:
#                 rstatus = True if status == 'true' else False
#                 for single in range(day_data['sgl']):
#                     Room.objects.create(room_type="SGL", date=day_data['current_date'], contract=contract, enabled=rstatus)
#                 for double in range(day_data['dbl']):
#                     Room.objects.create(room_type="DBL", date=day_data['current_date'], contract=contract, enabled=rstatus)
#                 for twin in range(day_data['twin']):
#                     Room.objects.create(room_type="TWIN", date=day_data['current_date'], contract=contract, enabled=rstatus)
#                 for triple in range(day_data['trpl']):
#                     Room.objects.create(room_type="TRPL", date=day_data['current_date'], contract=contract, enabled=rstatus)
#                 for quad in range(day_data['quad']):
#                     Room.objects.create(room_type="QUAD", date=day_data['current_date'], contract=contract, enabled=rstatus)
#             contract.save()

#             History.objects.create(
#                 user=user,
#                 model_name='OFF',
#                 action='CRE',
#                 description=f'User : {user.username} created a new Contract with id: {contract.id}'
#             )

#             # Check this if else here.
#             if file is not None:

#                 # Get current working directory
#                 backend_path = '/home/cosmoplan/Group_Plan/backend/static/'

#                 # If it already exists, do nothing
#                 Path(backend_path + 'files/data_management/contracts/' + str(contract.id) + '/').mkdir(parents=True, exist_ok=True)

#                 # Get description
#                 extension = file.name.split('.')[-1]

#                 # Validate size
#                 max_size = 20971520  # 20 megabytes
#                 if file.size > max_size:
#                     context['errormsg'] = 'File should not exceed 20 megabytes of data'
#                     return Response(data=context, status=400)

#                 # Validate extension
#                 if extension not in allowed_extension_documents:
#                     context['errormsg'] = f'Cannot upload .{extension} file.'
#                     return Response(data=context, status=400)

#                 file_name = file.name
#                 full_path = 'files/data_management/contracts/' + str(contract.id) + '/' + str(file_name)
#                 try:
#                     newDocument = Document.objects.create(
#                         name=file_name,
#                         type='CNT',
#                         uploader_id=user.id,
#                         file=full_path,
#                         size=file.size,
#                     )
#                     newDocument.save()
#                 except Exception as a:
#                     context['errormsg'] = a
#                     return Response(data=context, status=400)
#                 contract.document_id = newDocument.id
#                 contract.save()

#                 dest = open(backend_path + full_path, 'wb+')
#                 if file.multiple_chunks:
#                     for c in file.chunks():
#                         dest.write(c)
#                 else:
#                     dest.write(file.read())
#                 dest.close()

#             context['new_contract_id'] = contract.id
#             return Response(data=context, status=200)

#         # Contract type is disabled in the front end until we develop it's functionality.
#         # Until then , if somehow the type is not "HT", return 400
#         else:
#             return Response(data=context, status=400)


# class AddParkingLot(generics.UpdateAPIView):
#     """
#     URL: add_parking_lot
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": '', 'new_parking_lot_id': ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_create(user.id, 'PKG'):
#             context = {"errormsg": "You do not have permission to create a Parking Lot."}
#             return Response(status=401, data=context)

#         # Get parking lot's data
#         parking_lot_name = request.data['name'].strip()
#         address = request.data['address'].strip()
#         address2 = request.data['address2'].strip()

#         tel = request.data['tel'].strip()
#         for code in country_codes:
#             if tel.startswith(code):
#                 tel = "+" + tel[:len(code)] + ' ' + tel[len(code):]

#         tel2 = request.data['tel2'].strip()
#         for code in country_codes:
#             if tel2.startswith(code):
#                 tel2 = "+" + tel2[:len(code)] + ' ' + tel2[len(code):]

#         tel3 = request.data['tel3'].strip()
#         for code in country_codes:
#             if tel3.startswith(code):
#                 tel3 = "+" + tel3[:len(code)] + ' ' + tel3[len(code):]
#         email = request.data['email'].strip()
#         postal = request.data['postal'].strip()

#         # Get lat/lng
#         lat_lng = request.data['lat_lng']
#         lat = lat_lng.split(", ")[0]
#         lng = lat_lng.split(", ")[1]

#         # Latitude range is between -90-90, anything else is invalid
#         if float(lat) > 90 or float(lat) < -90:
#             context = {"errormsg": "Invalid Lat submitted"}
#             return Response(status=400, data=context)

#         # Longitude range is between -90-90, anything else is invalid
#         if float(lng) > 180 or float(lng) < -180:
#             context = {"errormsg": "Invalid Lng submitted"}
#             return Response(status=400, data=context)

#         all_names = [i.name for i in ParkingLot.objects.all()]

#         if parking_lot_name in all_names:
#             context['errormsg'] = 'Name already exists.'
#             return Response(data=context, status=400)

#         if not validate_tel_details([tel, tel2, tel3]):
#             context['errormsg'] = 'Invalid tel submitted or tel already exists.'
#             return Response(data=context, status=400)

#         continent = request.data['continent']
#         country = request.data['country']
#         state = request.data['state']
#         city = request.data['city']
#         area = request.data['area']
#         region_str = ""

#         if continent != 'N/A':
#             region_str += continent
#         if country != 'N/A':
#             region_str += f" >>> {country}"
#         if state != 'N/A':
#             region_str += f" >>> {state}"
#         if city != 'N/A':
#             region_str += f" >>> {city}"
#         if area != 'N/A':
#             region_str += f" >>> {area}"

#         try:
#             contact = Contact.objects.create(
#                 name=parking_lot_name,
#                 address=address,
#                 address2=address2,
#                 tel=tel,
#                 tel2=tel2,
#                 tel3=tel3,
#                 email=email,
#                 postal=postal,
#             )

#             parking_lot = ParkingLot.objects.create(
#                 name=parking_lot_name,
#                 lat=lat,
#                 lng=lng,
#                 contact_id=contact.id,
#                 region=region_str,
#             )

#             History.objects.create(
#                 user=user,
#                 model_name='TTA',
#                 action='CRE',
#                 description=f"User : {user.username} created a new Parking Lot with name: {parking_lot_name}"
#             )

#             context['new_parking_lot_id'] = parking_lot.id
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class AddPayment(generics.UpdateAPIView):
#     """
#     URL: add_payment_order
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": '', 'new_payment_order_id': ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_create(user.id, 'GT'):
#             context = {"errormsg": "You do not have permission to create a Payment Order."}
#             return Response(status=401, data=context)

#         refcode = request.data["refcode"]

#         group = GroupTransfer.objects.get(refcode=refcode)
#         supplier_type = request.data["supplier_type"]
#         company = request.data["company"]
#         currency = request.data["currency"]
#         amount = request.data["amount"]
#         bank = request.data["bank"]
#         payment_type = request.data["payment_type"]
#         iban = request.data["iban"]
#         swift = request.data["swift"]
#         date = request.data['date']

#         try:
#             invoice = request.FILES['invoice']
#         except MultiValueDictKeyError:
#             invoice = None

#         try:
#             payment_order = Payment.objects.create(
#                 group_transfer=GroupTransfer.objects.get(refcode=refcode),
#                 date=date,
#                 supplier_type=supplier_type,
#                 company=company,
#                 currency=currency,
#                 amount=amount,
#                 bank=bank,
#                 payment_type=payment_type,
#                 iban=iban,
#                 swift=swift,
#                 invoice=None,
#             )

#             History.objects.create(
#                 user=user,
#                 model_name='GT',
#                 action='CRE',
#                 description=f"User : {user.username} created a new Payment order for: {group}"
#             )

#             if invoice is not None:
#                 backend_path = '/home/cosmoplan/Group_Plan/backend/static/'
#                 Path(backend_path + 'files/group_documents/' + str(refcode) + '/').mkdir(parents=True, exist_ok=True)
#                 extension = invoice.name.split('.')[-1]
#                 max_size = 20971520  # 20 megabytes
#                 if invoice.size > max_size:
#                     context['errormsg'] = 'File should not exceed 20 megabytes of data'
#                     return Response(data=context, status=400)
#                 if extension not in allowed_extension_documents:
#                     context['errormsg'] = f'Cannot upload .{extension} file.'
#                     return Response(data=context, status=400)
#                 file_name = invoice.name
#                 full_path = 'files/group_documents/' + str(refcode) + '/' + str(file_name)
#                 try:
#                     newInvoice = Document.objects.create(
#                         name=file_name,
#                         type='CNT',
#                         uploader_id=user.id,
#                         file=full_path,
#                         size=invoice.size,
#                     )
#                     newInvoice.save()
#                 except Exception as a:
#                     context['errormsg'] = a
#                     return Response(data=context, status=400)
#                 payment_order.invoice_id = newInvoice.id
#                 payment_order.save()

#                 dest = open(backend_path + full_path, 'wb+')
#                 if invoice.multiple_chunks:
#                     for c in invoice.chunks():
#                         dest.write(c)
#                 else:
#                     dest.write(invoice.read())
#                 dest.close()

#             context['model'] = GroupSerializer(group).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class AddHotelCategory(generics.UpdateAPIView):
#     """
#     URL: add_htl_category
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": '', 'new_hotel_category_id': ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_create(user.id, 'HTL'):
#             context = {"errormsg": "You do not have permission to create a Hotel Category."}
#             return Response(status=401, data=context)

#         hotel_category = request.data['hotel_category']

#         try:
#             hotel_category = HotelCategory.objects.create(name=hotel_category)
#             History.objects.create(
#                 user=user,
#                 model_name='HTL',
#                 action='CRE',
#                 description=f"User : {user.username} created a new Hotel Category with name: {hotel_category}"
#             )
#             context['model'] = HotelCategorySerializer(hotel_category).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class BuildPaymentOrder(generics.UpdateAPIView):
#     """
#     URL: build_payment_order
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": '', }
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_create(user.id, 'GT'):
#             context = {"errormsg": "You do not have permission to create a Payment Order."}
#             return Response(status=401, data=context)

#         date = request.data['date']
#         branch = request.data['branch']
#         payments = request.data.get('payments', [])

#         try:
#             payment_order = PaymentOrder.objects.get(date=date, branch=branch)

#             for payment in payments:
#                 newDeposit = Deposit.objects.create(
#                     payment_id=payment['id'],
#                     amount=payment['deposit_amount'],
#                     bank=payment['bank'],
#                 )
#                 payment_order.deposits.add(newDeposit)

#             payment_order.save()

#             History.objects.create(
#                 user=user,
#                 model_name='AL',
#                 action='CRE',
#                 description=f"User : {user.username} created a new Payment Order with date {date}"
#             )

#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = str(exc)
#             return Response(data=context, status=400)


# class addRegion(generics.UpdateAPIView):
#     """
#     URL: add_region
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": '', 'new_region_id': ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_create(user.id, 'PLC'):
#             context = {"errormsg": "You do not have permission to create a Region."}
#             return Response(status=401, data=context)

#         name = request.data['name']
#         region_type = request.data['region_type']

#         continent = request.data['continent']
#         country = request.data['country']
#         state = request.data['state']
#         city = request.data['city']
#         markup = request.data['markup']

#         # Get lat/lng
#         lat_lng = request.data['lat_lng']
#         lat = lat_lng.split(", ")[0]
#         lng = lat_lng.split(", ")[1]

#         try:
#             if region_type == 'Continent':
#                 region = Continent.objects.create(name=name, lat=lat, lng=lng, markup=markup)
#                 context['model'] = ContinentSerializer(region).data

#             elif region_type == 'Country':
#                 continent = Continent.objects.get(name=continent)
#                 region = Country.objects.create(name=name, lat=lat, lng=lng, continent=continent, markup=markup)
#                 context['model'] = CountrySerializer(region).data

#             elif region_type == 'State':
#                 country = Country.objects.get(name=country)
#                 region = State.objects.create(name=name, country=country, lat=lat, lng=lng, markup=markup)
#                 context['model'] = StateSerializer(region).data

#             elif region_type == 'City':

#                 # City or state.
#                 country_or_state = request.data['country_or_state']

#                 if country_or_state == 'Country':
#                     country = Country.objects.get(name=country)
#                     region = City.objects.create(name=name, country=country, lat=lat, lng=lng, markup=markup)
#                     context['model'] = CitySerializer(region).data
#                 else:
#                     state = State.objects.get(name=state)
#                     region = City.objects.create(name=name, state=state, lat=lat, lng=lng, markup=markup)
#                     context['model'] = CitySerializer(region).data

#             elif region_type == 'Area':
#                 # add state or country on get, because it returns multiple now.
#                 try:
#                     city = City.objects.get(name=city, country=Country.objects.get(name=country).id)
#                 except Country.DoesNotExist:
#                     city = City.objects.get(name=city, state=State.objects.get(name=country).id)
#                 region = Area.objects.create(name=name, city=city, lat=lat, lng=lng, markup=markup)
#                 context['model'] = AreaSerializer(region).data

#             cache.delete('all_continents')
#             cache.delete('all_countries')
#             cache.delete('all_states')
#             cache.delete('all_cities')
#             cache.delete('all_areas')

#             History.objects.create(
#                 user=user,
#                 model_name='PLC',
#                 action='CRE',
#                 description=f"User : {user.username} created a new {region_type} with name: {name}"
#             )

#             context['new_region_id'] = region.id
#             context['new_region_type'] = region_type.lower()
#             return Response(data=context, status=status.HTTP_200_OK)

#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class AddEntertainmentSupplier(generics.UpdateAPIView):

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": '', 'new_entertainment_supplier_id': ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_create(user.id, 'ES'):
#             context = {"errormsg": "You do not have permission to create an Entertainment Supplier."}
#             return Response(status=401, data=context)

#         # Get sport event supplier's data
#         name = request.data['name'].strip()

#         # Get lat/lng
#         lat_lng = request.data['lat_lng']
#         lat = lat_lng.split(", ")[0]
#         lng = lat_lng.split(", ")[1]

#         # Contact data
#         address = request.data['address'].strip()
#         tel = request.data['tel'].strip()
#         for code in country_codes:
#             if tel.startswith(code):
#                 tel = "+" + tel[:len(code)] + ' ' + tel[len(code):]

#         tel2 = request.data['tel2'].strip()
#         for code in country_codes:
#             if tel2.startswith(code):
#                 tel2 = "+" + tel2[:len(code)] + ' ' + tel2[len(code):]

#         tel3 = request.data['tel3'].strip()
#         for code in country_codes:
#             if tel3.startswith(code):
#                 tel3 = "+" + tel3[:len(code)] + ' ' + tel3[len(code):]
#         email = request.data['email'].strip()
#         website = request.data['website'].strip()

#         # Validators
#         if len(name) < 5:
#             context['errormsg'] = 'Invalid name submitted'
#             return Response(data=context, status=400)

#         # Latitude range is between -90-90, anything else is invalid
#         if float(lat) > 90 or float(lat) < -90:
#             context = {"errormsg": "Invalid Lat submitted"}
#             return Response(status=400, data=context)

#         # Longitude range is between -90-90, anything else is invalid
#         if float(lng) > 180 or float(lng) < -180:
#             context = {"errormsg": "Invalid Lng submitted"}
#             return Response(status=400, data=context)

#         all_names = [i.name for i in EntertainmentSupplier.objects.all()]

#         if not validate_tel_details([tel, tel2, tel3]):
#             context['errormsg'] = 'Invalid tel submitted or tel already exists.'
#             return Response(data=context, status=400)

#         if name in all_names:
#             context['errormsg'] = 'Name already exists.'
#             return Response(data=context, status=400)

#         address = request.data['address'].strip()
#         address2 = request.data['address2'].strip()
#         postal = request.data['postal'].strip()

#         continent = request.data['continent']
#         country = request.data['country']
#         state = request.data['state']
#         city = request.data['city']
#         area = request.data['area']
#         region_str = ""

#         if continent != 'N/A':
#             region_str += continent
#         if country != 'N/A':
#             region_str += f" >>> {country}"
#         if state != 'N/A':
#             region_str += f" >>> {state}"
#         if city != 'N/A':
#             region_str += f" >>> {city}"
#         if area != 'N/A':
#             region_str += f" >>> {area}"

#         try:
#             entertainment_supplier = EntertainmentSupplier.objects.create(
#                 name=name,
#                 lat=lat,
#                 lng=lng,
#                 region=region_str,
#             )
#             contact = Contact.objects.create(
#                 name=name,
#                 address=address,
#                 tel=tel,
#                 tel2=tel2,
#                 tel3=tel3,
#                 email=email,
#                 website=website,
#                 address2=address2,
#                 postal=postal,
#             )
#             entertainment_supplier.contact_id = contact.id
#             entertainment_supplier.save()

#             new_pd_id = PaymentDetails.objects.all().order_by("-id")[0].id + 1
#             if request.data['company'] == '':
#                 company_name = name
#             else:
#                 company_name = ''

#             payment_details = PaymentDetails.objects.create(
#                 id=new_pd_id,
#                 company=company_name,
#                 currency=request.data['currency'],
#                 iban=request.data['iban'],
#                 swift=request.data['swift'],
#             )
#             entertainment_supplier.payment_details_id = payment_details.id
#             entertainment_supplier.save()

#             History.objects.create(
#                 user=user,
#                 model_name='ES',
#                 action='CRE',
#                 description=f'User : {user.username} created a new Entertainment Supplier with name {entertainment_supplier.name}'
#             )
#             context['new_entertainment_supplier_id'] = entertainment_supplier.id
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class AddEntertainmentProduct(generics.UpdateAPIView):
#     """
#     URL: add_entertainment_product
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": '', 'new_entertainment_product_id': ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_create(user.id, 'ES'):
#             context = {"errormsg": "You do not have permission to create an Entertainment Product."}
#             return Response(status=401, data=context)

#         name = request.data['name'].strip()
#         description = request.data['description'].strip()

#         # Get lat/lng
#         lat_lng = request.data['lat_lng']
#         lat = lat_lng.split(", ")[0]
#         lng = lat_lng.split(", ")[1]

#         # Latitude range is between -90-90, anything else is invalid
#         if float(lat) > 90 or float(lat) < -90:
#             context = {"errormsg": "Invalid Lat submitted"}
#             return Response(status=400, data=context)

#         # Longitude range is between -90-90, anything else is invalid
#         if float(lng) > 180 or float(lng) < -180:
#             context = {"errormsg": "Invalid Lng submitted"}
#             return Response(status=400, data=context)

#         continent = request.data['continent']
#         country = request.data['country']
#         state = request.data['state']
#         city = request.data['city']
#         area = request.data['area']
#         region_str = ""

#         if continent != 'N/A':
#             region_str += continent
#         if country != 'N/A':
#             region_str += f" >>> {country}"
#         if state != 'N/A':
#             region_str += f" >>> {state}"
#         if city != 'N/A':
#             region_str += f" >>> {city}"
#         if area != 'N/A':
#             region_str += f" >>> {area}"

#         try:
#             entertainment_supplier = EntertainmentSupplier.objects.get(id=request.data['entertainment_supplier_id'])
#             entertainment_product = EntertainmentProduct.objects.create(
#                 name=name,
#                 lat=lat,
#                 lng=lng,
#                 region=region_str,
#                 description=description,
#                 entertainment_supplier_id=entertainment_supplier.id,
#             )

#             entertainment_product.save()

#             History.objects.create(
#                 user=user,
#                 model_name='ES',
#                 action='CRE',
#                 description=f"User : {user.username} created a new Entertainment Product \
#                     with name: {name}"
#             )
#             context['entertainment_supplier'] = EntertainmentSupplierSerializer(entertainment_supplier).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class AddAircraft(generics.UpdateAPIView):
#     """
#     URL: add_aircraft
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": '', 'new_aircraft_id': ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_create(user.id, 'AC'):
#             context = {"errormsg": "You do not have permission to create an Aircraft."}
#             return Response(status=401, data=context)

#         try:
#             # Get Charter Broker
#             charter_broker_name = request.data['charter_broker'].strip()
#             charter_broker_id = CharterBroker.objects.get(name=charter_broker_name).id

#             # Get Coach's Data
#             model = request.data['model'].strip()
#             year = request.data['year']

#         except Exception as exc:
#             context['errormsg'] = exc
#             return HttpResponse(status=400)

#         try:
#             aircraft = Aircraft.objects.create(
#                 model=model,
#                 charter_broker_id=charter_broker_id,
#                 year=year,
#             )
#             aircraft.save()

#             History.objects.create(
#                 user=user,
#                 model_name='AC',
#                 action='CRE',
#                 description=f"User : {user.username} created a new Aircraft ( {aircraft} )"
#             )
#             context['new_aircraft_id'] = aircraft.id
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             print(exc)
#             context['errormsg'] = exc
#             return Response(data=context, status=400)
