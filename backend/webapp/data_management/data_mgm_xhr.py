# # from django.shortcuts import render
# from webapp.models import (
#     Contact,
#     Country,
#     Coach,
#     Hotel,
#     Airport,
#     Document,
#     Guide,
#     History,
#     Note,
#     Photo,
#     Terminal,
#     AirportDistances,
#     Amenity,
#     Port,
#     RepairShop,
#     Agent,
#     TextTemplate,
#     Restaurant,
#     DMC,
#     RailwayStation,
#     Attraction,
#     RestaurantMenu,
#     Contract,
#     TextTemplateCountry,
#     Room,
#     HotelCategory,
#     Continent,
#     State,
#     CoachOperatorCategory,
#     City,
#     CoachOperator,
#     FerryTicketAgency,
#     FerryRoute,
#     Area,
#     EntertainmentProduct,
#     EntertainmentSupplier,
#     Aircraft,
# )
# from django.apps import apps
# import os
# from pathlib import Path
# import json
# from django.db.models import ProtectedError
# from django.http import HttpResponse
# import datetime
# from django.utils.encoding import escape_uri_path
# from django.views.decorators.csrf import csrf_exempt
# from rest_framework.authtoken.models import Token
# from rest_framework import generics, status
# from urllib.parse import quote as urlquote, unquote as urlunquote
# from rest_framework.response import Response
# from webapp.serializers import (
#     ContactSerializer,
#     NoteSerializer,
#     AirportSerializer,
#     AgentSerializer,
#     CoachSerializer,
#     ClientSerializer,
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
#     RepairShopSerializer,
#     PortSerializer,
#     HotelSerializer,
#     CoachOperatorSerializer,
#     TerminalSerializer,
#     AttractionSerializer,
#     TextTemplateSerializer,
#     RailwayStationSerializer,
#     ContractSerializer,
#     ParkingLotSerializer,
#     ContinentSerializer,
#     CountrySerializer,
#     StateSerializer,
#     CitySerializer,
#     ProformaSerializer,
#     AreaSerializer,
#     EntertainmentSupplierSerializer,
#     CarHireCompanySerializer,
#     AdvertisementCompanySerializer,
#     CharterBrokerSerializer,
#     AircraftSerializer,
# )

# from webapp.xhr import update_notifications

# from webapp.validators import (
#     validate_name,
#     validate_address,
#     validate_lat,
#     validate_lng,
#     validate_airport_location,
#     validate_terminal,
#     validate_coach_make,
#     validate_coach_body_number,
#     validate_port_code,
# )

# from accounts.permissions import (
#     can_update,
#     can_create,
#     can_delete,
#     can_view,
# )

# BASE_DIR = Path(__file__).resolve().parent.parent.parent

# allowed_extensions = [
#     'pdf', 'xlsx', 'xlsm', 'xls', 'docx', 'doc', 'tif', 'wav',
#     'tiff', 'bmp', 'jpg', 'jpeg', 'png', 'csv', 'dot', 'flv',
#     'dotx', 'mp3', 'mp4', 'pptx', 'zip', 'rar', 'txt',
# ]

# # change_tel_details

# country_codes = [
#     '93', '355', '213', '376', '244', '1268', '54', '374', '297', '61', '43', '994', '1242',
#     '973', '880', '1246', '375', '32', '501', '229', '975', '591', '387', '267', '55', '246',
#     '673', '359', '226', '257', '855', '237', '1', '238', '599', '236', '235', '56', '86', '57',
#     '269', '243', '242', '506', '225', '385', '53', '599', '357', '420', '45', '253', '1767',
#     '1', '593', '20', '503', '240', '291', '372', '251', '679', '358', '33', '594', '689',
#     '241', '220', '995', '49', '233', '30', '1473', '590', '1671', '502', '224', '245', '592',
#     '509', '504', '852', '36', '354', '62', '98', '964', '353', '972', '39', '1876', '81', '962',
#     '7', '254', '686', '383', '965', '996', '856', '371', '961', '266', '231', '218', '423',
#     '370', '352', '853', '389', '261', '265', '60', '960', '223', '356', '692', '596', '222',
#     '230', '52', '691', '373', '377', '976', '382', '212', '258', '95', '264', '674', '977', '31',
#     '687', '64', '505', '227', '234', '850', '47', '968', '92', '680', '970', '507', '675', '595',
#     '51', '63', '48', '351', '1', '974', '262', '40', '7', '250', '1869', '1758', '1784', '685',
#     '378', '239', '966', '221', '381', '248', '232', '65', '421', '386', '677', '252', '27',
#     '82', '211', '34', '94', '249', '597', '268', '46', '41', '963', '886', '992', '255', '66',
#     '670', '228', '676', '1868', '216', '90', '993', '688', '256', '380', '971', '44', '1',
#     '598', '998', '678', '39', '58', '84', '967', '260', '263'
# ]


# # We restrict file extensions that can be uploaded to group plan for security reasons
# allowed_extensions_images = [
#     'jpeg', 'jpg', 'png', 'tiff', 'tif',
#     'JPEG', 'JPG', 'PNG', 'TIFF', 'TIF',
# ]


# allowed_extension_documents = [
#     'pdf', 'docx', 'doc', 'tif', 'tiff', 'bmp', 'jpg', 'jpeg', 'png', 'zip', 'rar',
#     'PDF', 'DOCX', 'DOC', 'TIF', 'TIFF', 'BMP', 'JPG', 'JPEG', 'PNG', 'ZIP', 'RAR',
# ]

# allowed_extensions_repair_types = ['png', 'PNG']


# # All model names and acronyms
# model_names = {
#     "GroupTransfer": "GT",
#     "Agent": "AGN",
#     "Airline": "AL",
#     "Airport": "AP",
#     "Offer": 'OFF',
#     "Attraction": "ATT",
#     "Client": "CLN",
#     "Coach": "CO",
#     "CoachOperator": "COP",
#     "Contract": 'CNT',
#     "CruisingCompany": "CC",
#     "Driver": "DRV",
#     "DMC": "DMC",
#     "Contact": 'CNT',
#     "GroupLeader": "GL",
#     "Guide": "GD",
#     "Hotel": "HTL",
#     "Place": "PLC",
#     "Port": "PRT",
#     "RailwayStation": "RS",
#     "RepairShop": "RSH",
#     "RepairType": "RTP",
#     "Restaurant": "RST",
#     "Service": "SRV",
#     "FerryTicketAgency": "FTA",
#     "TeleferikCompany": "TC",
#     "Theater": "TH",
#     "TrainTicketAgency": "TTA",
#     "User": "USR",
#     "History": "HSR",
#     "SportEventSupplier": "SES",
#     "Authentication": 'AUT',
#     "ParkingLot": 'PKG',
#     "TextTemplate": 'TT',
#     "continent": 'PLC',
#     "country": 'PLC',
#     "city": 'PLC',
#     "state": 'PLC',
#     "area": 'PLC',
#     "Proforma": 'GT',
#     "EntertainmentSupplier": "ES",
#     "EntertainmentProduct": "ES",
#     "CarHireCompany": "CH",
#     "AdvertisementCompany": "AD",
#     "CharterBroker": "CB",
#     "Aircraft": "AC",
# }


# # Get serializer. Used for object oriented programming best practices
# def get_serializer(obj_type, obj):
#     if obj_type == 'Agent':
#         return AgentSerializer(obj).data
#     elif obj_type == 'Client':
#         return ClientSerializer(obj).data
#     elif obj_type == 'TrainTicketAgency':
#         return TrainTicketAgencySerializer(obj).data
#     elif obj_type == 'Theater':
#         return TheaterSerializer(obj).data
#     elif obj_type == 'TeleferikCompany':
#         return TeleferikCompanySerializer(obj).data
#     elif obj_type == 'SportEventSupplier':
#         return SportEventSupplierSerializer(obj).data
#     elif obj_type == 'Restaurant':
#         return RestaurantSerializer(obj).data
#     elif obj_type == 'RepairShop':
#         return RepairShopSerializer(obj).data
#     elif obj_type == 'Port':
#         return PortSerializer(obj).data
#     elif obj_type == 'RailwayStation':
#         return RailwayStationSerializer(obj).data
#     elif obj_type == 'Hotel':
#         return HotelSerializer(obj).data
#     elif obj_type == 'Guide':
#         return GuideSerializer(obj).data
#     elif obj_type == 'Contact':
#         return ContactSerializer(obj).data
#     elif obj_type == 'DMC':
#         return DMCSerializer(obj).data
#     elif obj_type == 'FerryTicketAgency':
#         return FerryTicketAgencySerializer(obj).data
#     elif obj_type == 'CruisingCompany':
#         return CruisingCompanySerializer(obj).data
#     elif obj_type == 'CoachOperator':
#         return CoachOperatorSerializer(obj).data
#     elif obj_type == 'Contract':
#         return ContractSerializer(obj).data
#     elif obj_type == 'Coach':
#         return CoachSerializer(obj).data
#     elif obj_type == 'Airport':
#         return AirportSerializer(obj).data
#     elif obj_type == 'Terminal':
#         return TerminalSerializer(obj).data
#     elif obj_type == 'Attraction':
#         return AttractionSerializer(obj).data
#     elif obj_type == 'Airline':
#         return AirlineSerializer(obj).data
#     elif obj_type == 'TextTemplate':
#         return TextTemplateSerializer(obj).data
#     elif obj_type == 'ParkingLot':
#         return ParkingLotSerializer(obj).data
#     elif obj_type == 'continent':
#         return ContinentSerializer(obj).data
#     elif obj_type == 'country':
#         return CountrySerializer(obj).data
#     elif obj_type == 'state':
#         return StateSerializer(obj).data
#     elif obj_type == 'city':
#         return CitySerializer(obj).data
#     elif obj_type == 'area':
#         return AreaSerializer(obj).data
#     elif obj_type == 'Proforma':
#         return ProformaSerializer(obj).data
#     elif obj_type == 'EntertainmentSupplier':
#         return EntertainmentSupplierSerializer(obj).data
#     elif obj_type == 'EntertainmentProduct':
#         return EntertainmentSupplierSerializer(obj).data
#     elif obj_type == 'CarHireCompany':
#         return CarHireCompanySerializer(obj).data
#     elif obj_type == 'AdvertisementCompany':
#         return AdvertisementCompanySerializer(obj).data
#     elif obj_type == 'CharterBroker':
#         return CharterBrokerSerializer(obj).data
#     elif obj_type == 'Aircraft':
#         return AircraftSerializer(obj).data


# permissions_full_text = {
#     'VIE': 'View',
#     'CRE': 'Create',
#     'UPD': 'Update',
#     'DEL': 'Delete',
# }

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

# ATTRACTION_TYPES = {
#     "HS": "Historical Sites",
#     "MS": "Museums",
#     "TP": "Theme Parks",
#     "NP": "Natural Parks",
#     "ZA": "Zoos And Aquariums",
#     "BG": "Botanical Gardens",
#     "LM": "Landmarks",
#     "AM": "Architectural Marvels",
#     "AG": "Art Galleries",
#     "CF": "Cultural Festivals",
#     "SA": "Sport Arenas",
#     "BC": "Beaches and Coastal Areas",
#     "SD": "Shopping Districts",
#     "AD": "Adventure Parks",
#     "SC": "Science Centers",
#     "OS": "Observatory",
#     "CP": "Castles and Palaces",
#     "WV": "Wineries and Vineyards",
#     "CT": "Culinary Tours",
#     "CD": "Cathedrals And Churches",
#     "N/A": "N/A",
# }


# def get_unique_dates(date_range_str):
#     # Split the string using the delimiter "-"
#     start_date_str, end_date_str = date_range_str.split(" - ")

#     # Convert start and end date strings into datetime objects
#     start_date = datetime.datetime.strptime(start_date_str, "%d-%m-%Y")
#     end_date = datetime.datetime.strptime(end_date_str, "%d-%m-%Y")

#     # Generate a list of dates between the start and end dates
#     dates_list = [start_date + datetime.timedelta(days=x) for x in range((end_date - start_date).days + 1)]

#     # Convert the list of dates to "YYYY-MM-DD" format
#     formatted_dates = [date.strftime("%Y-%m-%d") for date in dates_list]

#     # Use a set to get unique dates and then convert it back to a list
#     unique_dates = list(set(formatted_dates))

#     return unique_dates


# def get_user(token):
#     user = Token.objects.get(key=token).user
#     return user


# class ChangeName(generics.UpdateAPIView):
#     """
#     URL: change_name/
#     Descr: Changes object's name
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):

#         # Used to store any error messages.
#         context = {"errormsg": ''}

#         # Users token, used to get the user instance.
#         token_str = request.headers['User-Token']

#         # Get user
#         user = get_user(token_str)

#         # Model type
#         object_type = request.data['object_type'].replace(" ", "")

#         # Get Model class instance
#         if object_type == 'GroupLeader' or object_type == 'Driver':
#             object_type = 'Contact'

#         model = apps.get_model(app_label='webapp', model_name=object_type)

#         # Query to target specific Instance using id.
#         target_obj = model.objects.get(id=request.data['object_id'])

#         # Get Models 3 char code, used for permissions/logging.
#         # Example: Agent's 3 code is "AGN".Values are stored in model_names variable
#         if request.data['object_type'] == 'Driver':
#             obj_three_code = 'DRV'
#         elif request.data['object_type'] == 'Group Leader':
#             obj_three_code = 'GL'
#         else:
#             obj_three_code = model_names[object_type]

#         # Permission
#         # Function takes 2 parameters. User id and Object's code.
#         # Returns true if user has permission to update the object.
#         if not can_update(user.id, obj_three_code):
#             context = {"errormsg": f"You do not have permission to update {object_type}'s name."}
#             return Response(status=401, data=context)

#         # Get new name from front end.
#         name = request.data['object_name'].strip()

#         # Validations
#         if not validate_name(name):
#             context['errormsg'] = 'Invalid name submitted'
#             return Response(data=context, status=400)

#         # Get previous name for history
#         previous_name = target_obj.name

#         # Update Object
#         try:
#             target_obj.name = name
#             target_obj.save()

#             # Write event to database
#             History.objects.create(
#                 user=user,
#                 model_name=obj_three_code,
#                 action='UPD',
#                 description=f"User : {user.username} updated {object_type}'s name from {previous_name} to {name}"
#             )

#             # Return Object's data to update front end's state.
#             if object_type == 'EntertainmentProduct':
#                 context['object'] = get_serializer(object_type, EntertainmentSupplier.objects.get(id=target_obj.entertainment_supplier_id))
#             else:
#                 context['object'] = get_serializer(object_type, target_obj)
#             # If everything went smooth, return 200 status
#             return Response(data=context, status=status.HTTP_200_OK)

#         # If anything went wrong, return 400
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeAddress2(generics.UpdateAPIView):
#     """
#     URL: change_address2/
#     Descr: Changes object's address2
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):

#         # Used to store any error messages.
#         context = {"errormsg": ''}

#         # Users token, used to get the user instance.
#         token_str = request.headers['User-Token']

#         # Get user
#         user = get_user(token_str)

#         # Model type
#         object_type = request.data['object_type'].replace(" ", "")

#         # Get Model class instance
#         if object_type == 'GroupLeader' or object_type == 'Driver':
#             object_type = 'Contact'

#         model = apps.get_model(app_label='webapp', model_name=object_type)

#         # Query to target specific Instance using id.
#         target_obj = model.objects.get(id=request.data['object_id'])

#         # Get Models 3 char code, used for permissions/logging.
#         # Example: Agent's 3 code is "AGN".Values are stored in model_names variable
#         # Get previous address for history
#         # If object is a group leader or driver, they don't have a related contact. They ARE the contact.
#         if request.data['object_type'] == 'Driver':
#             obj_three_code = 'DRV'
#             prev_address2 = target_obj.address2
#         elif request.data['object_type'] == 'Group Leader':
#             obj_three_code = 'GL'
#             prev_address2 = target_obj.address2
#         else:
#             obj_three_code = model_names[object_type]
#             prev_address2 = target_obj.contact.address2

#         # Permission
#         # Function takes 2 parameters. User id and Object's code.
#         # Returns true if user has permission to update the object.
#         if not can_update(user.id, obj_three_code):
#             context = {"errormsg": f"You do not have permission to update {object_type}'s address."}
#             return Response(status=401, data=context)

#         # Get new address from front end.
#         address2 = request.data['object_address'].strip()

#         # Validations
#         if not validate_address(address2):
#             context['errormsg'] = 'Invalid Address submitted'
#             return Response(data=context, status=400)

#         # Update Object
#         try:
#             if obj_three_code == 'GL' or obj_three_code == 'DRV':
#                 target_obj.address2 = address2
#                 target_obj.save()
#             else:
#                 target_obj.contact.address2 = address2
#                 target_obj.contact.save()

#             # Write event to database
#             History.objects.create(
#                 user=user,
#                 model_name=obj_three_code,
#                 action='UPD',
#                 description=f"User : {user.username} updated {object_type}'s address2 from {prev_address2} to {address2}"
#             )

#             # Return Object's data to update front end's state.
#             context['object'] = get_serializer(object_type, target_obj)
#             # If everything went smooth, return 200 status
#             return Response(data=context, status=status.HTTP_200_OK)

#         # If anything went wrong, return 400
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeAddress(generics.UpdateAPIView):
#     """
#     URL: change_address/
#     Descr: Changes object's address
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):

#         # Used to store any error messages.
#         context = {"errormsg": ''}

#         # Users token, used to get the user instance.
#         token_str = request.headers['User-Token']

#         # Get user
#         user = get_user(token_str)

#         # Model type
#         object_type = request.data['object_type'].replace(" ", "")

#         # Get Model class instance
#         if object_type == 'GroupLeader' or object_type == 'Driver':
#             object_type = 'Contact'

#         model = apps.get_model(app_label='webapp', model_name=object_type)

#         # Query to target specific Instance using id.
#         target_obj = model.objects.get(id=request.data['object_id'])

#         # Get Models 3 char code, used for permissions/logging.
#         # Example: Agent's 3 code is "AGN".Values are stored in model_names variable
#         # Get previous address for history
#         # If object is a group leader or driver, they don't have a related contact. They ARE the contact.
#         if request.data['object_type'] == 'Driver':
#             obj_three_code = 'DRV'
#             prev_address = target_obj.address
#         elif request.data['object_type'] == 'Group Leader':
#             obj_three_code = 'GL'
#             prev_address = target_obj.address
#         elif request.data['object_type'] == 'Proforma':
#             obj_three_code = 'GT'
#             prev_address = target_obj.address
#         else:
#             obj_three_code = model_names[object_type]
#             prev_address = target_obj.contact.address

#         # Permission
#         # Function takes 2 parameters. User id and Object's code.
#         # Returns true if user has permission to update the object.
#         if not can_update(user.id, obj_three_code):
#             context = {"errormsg": f"You do not have permission to update {object_type}'s address."}
#             return Response(status=401, data=context)

#         # Get new address from front end.
#         address = request.data['object_address'].strip()

#         # Validations
#         if not validate_address(address):
#             context['errormsg'] = 'Invalid Address submitted'
#             return Response(data=context, status=400)

#         # Update Object
#         try:
#             if obj_three_code == 'GL' or obj_three_code == 'DRV' or obj_three_code == 'GT':
#                 target_obj.address = address
#                 target_obj.save()
#             else:
#                 target_obj.contact.address = address
#                 target_obj.contact.save()

#             # Write event to database
#             History.objects.create(
#                 user=user,
#                 model_name=obj_three_code,
#                 action='UPD',
#                 description=f"User : {user.username} updated {object_type}'s address from {prev_address} to {address}"
#             )

#             # Return Object's data to update front end's state.
#             context['object'] = get_serializer(object_type, target_obj)
#             # If everything went smooth, return 200 status
#             return Response(data=context, status=status.HTTP_200_OK)

#         # If anything went wrong, return 400
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeEmail(generics.UpdateAPIView):
#     """
#     URL: change_email/
#     Descr: Changes object's email
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         # Used to store any error messages.
#         context = {"errormsg": ''}

#         # Users token, used to get the user instance.
#         token_str = request.headers['User-Token']

#         # Get user
#         user = get_user(token_str)

#         # Model type
#         object_type = request.data['object_type'].replace(" ", "")

#         # Get Model class instance
#         if object_type == 'GroupLeader' or object_type == 'Driver':
#             object_type = 'Contact'

#         model = apps.get_model(app_label='webapp', model_name=object_type)

#         # Query to target specific Instance using id.
#         target_obj = model.objects.get(id=request.data['object_id'])

#         # Get Models 3 char code, used for permissions/logging.
#         # Example: Agent's 3 code is "AGN".Values are stored in model_names variable
#         # Get previous email for history
#         # If object is a group leader or driver, they don't have a related contact. They ARE the contact.
#         if request.data['object_type'] == 'Driver':
#             obj_three_code = 'DRV'
#             previous_email = target_obj.email
#         elif request.data['object_type'] == 'Group Leader':
#             obj_three_code = 'GL'
#             previous_email = target_obj.email
#         elif request.data['object_type'] == 'Proforma':
#             obj_three_code = 'GT'
#             previous_email = target_obj.email
#         else:
#             obj_three_code = model_names[object_type]
#             previous_email = target_obj.contact.email

#         # Permission
#         # Function takes 2 parameters. User id and Object's code.
#         # Returns true if user has permission to update the object.
#         if not can_update(user.id, obj_three_code):
#             context = {"errormsg": f"You do not have permission to update {object_type}'s email."}
#             return Response(status=401, data=context)

#         # Get new address from front end.
#         email = request.data['object_email'].strip()

#         # Update Object
#         try:
#             if obj_three_code == 'GL' or obj_three_code == 'DRV' or obj_three_code == 'GT':
#                 target_obj.email = email
#                 target_obj.save()
#             else:
#                 target_obj.contact.email = email
#                 target_obj.contact.save()

#             # Write event to database
#             History.objects.create(
#                 user=user,
#                 model_name=obj_three_code,
#                 action='UPD',
#                 description=f"User : {user.username} updated {object_type}'s email from {previous_email} to {email}"
#             )

#             # Return Object's data to update front end's state.
#             context['object'] = get_serializer(object_type, target_obj)
#             # If everything went smooth, return 200 status
#             return Response(data=context, status=status.HTTP_200_OK)

#         # If anything went wrong, return 400
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangePostal(generics.UpdateAPIView):
#     """
#     URL: change_postal_code/
#     Descr: Changes object's postal code
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         # Used to store any error messages.
#         context = {"errormsg": ''}

#         # Users token, used to get the user instance.
#         token_str = request.headers['User-Token']

#         # Get user
#         user = get_user(token_str)

#         # Model type
#         object_type = request.data['object_type'].replace(" ", "")

#         # Get Model class instance
#         if object_type == 'GroupLeader' or object_type == 'Driver':
#             object_type = 'Contact'

#         model = apps.get_model(app_label='webapp', model_name=object_type)

#         # Query to target specific Instance using id.
#         target_obj = model.objects.get(id=request.data['object_id'])

#         # Get Models 3 char code, used for permissions/logging.
#         # Example: Agent's 3 code is "AGN".Values are stored in model_names variable
#         # Get previous email for history
#         # If object is a group leader or driver, they don't have a related contact. They ARE the contact.
#         if request.data['object_type'] == 'Driver':
#             obj_three_code = 'DRV'
#             previous_postal = target_obj.postal
#         elif request.data['object_type'] == 'Group Leader':
#             obj_three_code = 'GL'
#             previous_postal = target_obj.postal
#         else:
#             obj_three_code = model_names[object_type]
#             previous_postal = target_obj.contact.postal

#         # Permission
#         # Function takes 2 parameters. User id and Object's code.
#         # Returns true if user has permission to update the object.
#         if not can_update(user.id, obj_three_code):
#             context = {"errormsg": f"You do not have permission to update {object_type}'s postal."}
#             return Response(status=401, data=context)

#         # Get new address from front end.
#         postal = request.data['object_postal'].strip()

#         # Update Object
#         try:
#             if obj_three_code == 'GL' or obj_three_code == 'DRV':
#                 target_obj.postal = postal
#                 target_obj.save()
#             else:
#                 target_obj.contact.postal = postal
#                 target_obj.contact.save()

#             # Write event to database
#             History.objects.create(
#                 user=user,
#                 model_name=obj_three_code,
#                 action='UPD',
#                 description=f"User : {user.username} updated {object_type}'s postal from {previous_postal} to {postal}"
#             )

#             # Return Object's data to update front end's state.
#             context['object'] = get_serializer(object_type, target_obj)
#             # If everything went smooth, return 200 status
#             return Response(data=context, status=status.HTTP_200_OK)

#         # If anything went wrong, return 400
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeDateOfBirth(generics.UpdateAPIView):
#     """
#     URL: change_date_of_birth/
#     Descr: Changes object's date_of_birth
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         # Used to store any error messages.
#         context = {"errormsg": ''}

#         # Users token, used to get the user instance.
#         token_str = request.headers['User-Token']

#         # Get user
#         user = get_user(token_str)

#         # Model type
#         object_type = request.data['object_type'].replace(" ", "")

#         # Get Model class instance
#         if object_type == 'GroupLeader' or object_type == 'Driver':
#             object_type = 'Contact'

#         model = apps.get_model(app_label='webapp', model_name=object_type)

#         # Query to target specific Instance using id.
#         target_obj = model.objects.get(id=request.data['object_id'])

#         # Get Models 3 char code, used for permissions/logging.
#         # Example: Agent's 3 code is "AGN".Values are stored in model_names variable
#         # Get previous date_of_birth for history
#         # If object is a group leader or driver, they don't have a related contact. They ARE the contact.
#         if request.data['object_type'] == 'Driver':
#             obj_three_code = 'DRV'
#             previous_date_of_birth = target_obj.date_of_birth
#         elif request.data['object_type'] == 'Group Leader':
#             obj_three_code = 'GL'
#             previous_date_of_birth = target_obj.date_of_birth
#         else:
#             obj_three_code = model_names[object_type]
#             previous_date_of_birth = target_obj.contact.date_of_birth

#         # Permission
#         # Function takes 2 parameters. User id and Object's code.
#         # Returns true if user has permission to update the object.
#         if not can_update(user.id, obj_three_code):
#             context = {"errormsg": f"You do not have permission to update {object_type}'s date_of_birth."}
#             return Response(status=401, data=context)

#         # Get new address from front end.
#         date_of_birth = request.data['object_date_of_birth'].strip()

#         # Update Object
#         try:
#             if obj_three_code == 'GL' or obj_three_code == 'DRV':
#                 target_obj.date_of_birth = date_of_birth
#                 target_obj.save()
#             else:
#                 target_obj.contact.date_of_birth = date_of_birth
#                 target_obj.contact.save()

#             # Write event to database
#             History.objects.create(
#                 user=user,
#                 model_name=obj_three_code,
#                 action='UPD',
#                 description=f"User : {user.username} updated {object_type}'s Date Of Birth from {previous_date_of_birth} to {date_of_birth}"
#             )

#             # Return Object's data to update front end's state.
#             context['object'] = get_serializer(object_type, target_obj)
#             # If everything went smooth, return 200 status
#             return Response(data=context, status=status.HTTP_200_OK)

#         # If anything went wrong, return 400
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeTelDetails(generics.UpdateAPIView):
#     """
#     URL: change_tel_details/
#     Descr: Updates contact's tel, tel2, tel3 fields
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         # Used to store any error messages.
#         context = {"errormsg": ''}

#         # Users token, used to get the user instance.
#         token_str = request.headers['User-Token']

#         # Get user
#         user = get_user(token_str)

#         # Model type
#         object_type = request.data['object_type'].replace(" ", "")

#         # Get Model class instance
#         if object_type == 'GroupLeader' or object_type == 'Driver':
#             object_type = 'Contact'

#         model = apps.get_model(app_label='webapp', model_name=object_type)

#         # Query to target specific Instance using id.
#         target_obj = model.objects.get(id=request.data['object_id'])

#         tel_num = request.data['tel_num']

#         # Get Models 3 char code, used for permissions/logging.
#         # Example: Agent's 3 code is "AGN".Values are stored in model_names variable
#         # Get previous email for history
#         # If object is a group leader or driver, they don't have a related contact. They ARE the contact.

#         if request.data['object_type'] == 'Driver':
#             obj_three_code = 'DRV'
#             if tel_num == 'tel':
#                 previous_tel = target_obj.tel
#             elif tel_num == 'tel2':
#                 previous_tel = target_obj.tel2
#             elif tel_num == 'tel3':
#                 previous_tel = target_obj.tel3

#         elif request.data['object_type'] == 'Group Leader':
#             obj_three_code = 'GL'
#             if tel_num == 'tel':
#                 previous_tel = target_obj.tel
#             elif tel_num == 'tel2':
#                 previous_tel = target_obj.tel2
#             elif tel_num == 'tel3':
#                 previous_tel = target_obj.tel3
#         elif request.data['object_type'] == 'Proforma':
#             obj_three_code = 'GT'
#             if tel_num == 'tel':
#                 previous_tel = target_obj.tel
#             elif tel_num == 'tel2':
#                 previous_tel = target_obj.tel2
#             elif tel_num == 'tel3':
#                 previous_tel = target_obj.tel3
#         else:
#             obj_three_code = model_names[object_type]
#             if tel_num == 'tel':
#                 previous_tel = target_obj.contact.tel
#             elif tel_num == 'tel2':
#                 previous_tel = target_obj.contact.tel2
#             elif tel_num == 'tel3':
#                 previous_tel = target_obj.contact.tel3

#         # Permission
#         # Function takes 2 parameters. User id and Object's code.
#         # Returns true if user has permission to update the object.
#         if not can_update(user.id, obj_three_code):
#             context = {"errormsg": f"You do not have permission to update {object_type}'s tel."}
#             return Response(status=401, data=context)

#         # Get new address from front end.
#         tel = request.data['tel'].strip()
#         for code in country_codes:
#             if tel.startswith(code):
#                 tel = "+" + tel[:len(code)] + ' ' + tel[len(code):]

#         # Update Object
#         try:
#             if obj_three_code == 'GL' or obj_three_code == 'DRV' or obj_three_code == 'GT':
#                 if tel_num == 'tel':
#                     target_obj.tel = tel
#                 elif tel_num == 'tel2':
#                     target_obj.tel2 = tel
#                 elif tel_num == 'tel3':
#                     target_obj.tel3 = tel
#                 target_obj.save()
#             else:
#                 if tel_num == 'tel':
#                     target_obj.contact.tel = tel
#                 elif tel_num == 'tel2':
#                     target_obj.contact.tel2 = tel
#                 elif tel_num == 'tel3':
#                     target_obj.contact.tel3 = tel
#                 target_obj.contact.save()

#             # Write event to database
#             History.objects.create(
#                 user=user,
#                 model_name=obj_three_code,
#                 action='UPD',
#                 description=f"User : {user.username} updated {object_type}'s {tel_num} from {previous_tel} to {tel}"
#             )

#             # Return Object's data to update front end's state.
#             context['object'] = get_serializer(object_type, target_obj)
#             # If everything went smooth, return 200 status
#             return Response(data=context, status=status.HTTP_200_OK)

#         # If anything went wrong, return 400
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeWebsite(generics.UpdateAPIView):
#     """
#     URL: change_website/
#     Descr: Changes object's website
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         # Used to store any error messages.
#         context = {"errormsg": ''}

#         # Users token, used to get the user instance.
#         token_str = request.headers['User-Token']

#         # Get user
#         user = get_user(token_str)

#         # Model type
#         object_type = request.data['object_type'].replace(" ", "")

#         # Get Model class instance
#         if object_type == 'GroupLeader' or object_type == 'Driver':
#             object_type = 'Contact'

#         model = apps.get_model(app_label='webapp', model_name=object_type)

#         # Query to target specific Instance using id.
#         target_obj = model.objects.get(id=request.data['object_id'])

#         # Get Models 3 char code, used for permissions/logging.
#         # Example: Agent's 3 code is "AGN".Values are stored in model_names variable
#         # Get previous website for history
#         # If object is a group leader or driver, they don't have a related contact. They ARE the contact.
#         if request.data['object_type'] == 'Driver':
#             obj_three_code = 'DRV'
#             previous_website = target_obj.website
#         elif request.data['object_type'] == 'GroupLeader':
#             obj_three_code = 'GL'
#             previous_website = target_obj.website
#         else:
#             obj_three_code = model_names[object_type]
#             previous_website = target_obj.contact.website

#         # Permission
#         # Function takes 2 parameters. User id and Object's code.
#         # Returns true if user has permission to update the object.
#         if not can_update(user.id, obj_three_code):
#             context = {"errormsg": f"You do not have permission to update {object_type}'s website."}
#             return Response(status=401, data=context)

#         # Get new address from front end.
#         website = request.data['object_website'].strip()

#         # Update Object
#         try:
#             if obj_three_code == 'GL' or obj_three_code == 'DRV':
#                 target_obj.website = website
#                 target_obj.save()
#             else:
#                 target_obj.contact.website = website
#                 target_obj.contact.save()

#             # Write event to database
#             History.objects.create(
#                 user=user,
#                 model_name=obj_three_code,
#                 action='UPD',
#                 description=f"User : {user.username} updated {object_type}'s website from \
#                     {previous_website} to {website}"
#             )

#             # Return Object's data to update front end's state.
#             context['object'] = get_serializer(object_type, target_obj)
#             # If everything went smooth, return 200 status
#             return Response(data=context, status=status.HTTP_200_OK)

#         # If anything went wrong, return 400
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeEnabled(generics.ListCreateAPIView):
#     """
#     URL: change_enabled/
#     Descr: Enables/Disables object, Toggle function.
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):

#         # Used to store any error messages.
#         context = {"errormsg": ''}

#         # Users token, used to get the user instance.
#         token_str = request.headers['User-Token']

#         # Get user
#         user = get_user(token_str)

#         # Model type
#         object_type = request.data['object_type'].replace(" ", "")

#         # Get Model class instance
#         if object_type == 'GroupLeader' or object_type == 'Driver':
#             object_type = 'Contact'

#         model = apps.get_model(app_label='webapp', model_name=object_type)

#         # Query to target specific Instance using id.
#         if object_type == 'Airport':
#             target_obj = model.objects.get(name=request.data['object_name'])
#         else:
#             target_obj = model.objects.get(id=request.data['object_id'])

#         # Get Models 3 char code, used for permissions/logging.
#         # Example: Agent's 3 code is "AGN".Values are stored in model_names variable
#         if request.data['object_type'] == 'Driver':
#             obj_three_code = 'DRV'
#         elif request.data['object_type'] == 'Group Leader':
#             obj_three_code = 'GL'
#         else:
#             obj_three_code = model_names[object_type]

#         # Permission
#         # Function takes 2 parameters. User id and Object's code.
#         # Returns true if user has permission to update the object.
#         if not can_update(user.id, obj_three_code):
#             context = {"errormsg": f"You do not have permission to update {object_type}'s Status."}
#             return Response(status=401, data=context)

#         enabled = request.data['enabled']
#         if enabled == target_obj.enabled:
#             return Response(data=context, status=200)

#         descr_prev_enabled = enabled
#         descr_enabled = target_obj.enabled

#         # Update Object
#         try:
#             target_obj.enabled = enabled
#             target_obj.save()

#             # Write event to database
#             History.objects.create(
#                 user=user,
#                 model_name=obj_three_code,
#                 action='UPD',
#                 description=f"User : {user.username} updated {object_type}'s: {target_obj} enabled status from \
#                     {descr_prev_enabled} to {descr_enabled}"
#             )

#             # Return Object's data to update front end's state.
#             context['object'] = get_serializer(object_type, target_obj)
#             # If everything went smooth, return 200 status
#             return Response(data=context, status=status.HTTP_200_OK)

#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeAbbreviation(generics.UpdateAPIView):
#     """
#     URL: change_abbreviation/
#     Descr: Changes object's abbreviation
#     """

#     # Cross site request forgery
#     @csrf_exempt
#     def post(self, request):
#         # Used to store any error messages.
#         context = {"errormsg": ''}

#         # Users token, used to get the user instance.
#         token_str = request.headers['User-Token']

#         # Get user
#         user = get_user(token_str)

#         # Model type
#         object_type = request.data['object_type'].replace(" ", "")

#         # Get Model class instance
#         model = apps.get_model(app_label='webapp', model_name=object_type)

#         # Get Models 3 char code, used for permissions/logging.
#         obj_three_code = model_names[object_type]

#         # Permission
#         # Function takes 2 parameters. User id and Object's code.
#         # Returns true if user has permission to update the object.
#         if not can_update(user.id, obj_three_code):
#             context = {"errormsg": f"You do not have permission to update {object_type}'s abbreviation."}
#             return Response(status=401, data=context)

#         # Get Abbreviation
#         abbr = request.data['abbreviation'].strip()

#         # Get previous abbreviation for logging
#         target_obj = model.objects.get(name=request.data['object_name'])

#         # all_abbreviations = [i.abbreviation for i in model.objects.all()]

#         # if abbr in all_abbreviations:
#         #     context['errormsg'] = 'Abbreviation code already exists. The abbreviation code needs to be unique'
#         #     return Response(data=context, status=400)

#         # Update Object
#         try:
#             target_obj.abbreviation = abbr
#             target_obj.save()

#             # Write event to database
#             History.objects.create(
#                 user=user,
#                 model_name=obj_three_code,
#                 action='UPD',
#                 description=f"User : {user.username} updated {object_type}'s: {target_obj.id} abbreviation to {abbr}"
#             )

#             # Return Object's data to update front end's state.
#             context['object'] = get_serializer(object_type, target_obj)
#             # If everything went smooth, return 200 status
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeCountry(generics.UpdateAPIView):
#     """
#     URL: change_country/
#     Descr: Changes object's country
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         # Used to store any error messages.
#         context = {"errormsg": ''}

#         # Users token, used to get the user instance.

#         token_str = request.headers['User-Token']

#         # Get user
#         user = get_user(token_str)

#         # Model type
#         object_type = request.data['object_type'].replace(" ", "")

#         # Get Model class instance
#         model = apps.get_model(app_label='webapp', model_name=object_type)

#         # Get Models 3 char code, used for permissions/logging.
#         obj_three_code = model_names[object_type]

#         # Permission
#         # Function takes 2 parameters. User id and Object's code.
#         # Returns true if user has permission to update the object.
#         if not can_update(user.id, obj_three_code):
#             context = {"errormsg": f"You do not have permission to update {object_type}'s country."}
#             return Response(status=401, data=context)

#         # Data from front end form
#         country = request.data['country'].strip()
#         target_obj = model.objects.get(id=request.data['object_id'])

#         if request.data['object_type'] == 'Place':
#             previous_country = target_obj.country
#         else:
#             try:
#                 previous_country = Country.objects.get(id=target_obj.nationality_id).name
#             except Country.DoesNotExist:
#                 previous_country = 'N/A'

#         # Update
#         try:
#             if request.data['object_type'] == 'Place':
#                 target_obj.country = country
#             else:
#                 if country == '':
#                     target_obj.nationality_id = None
#                 else:
#                     target_obj.nationality_id = Country.objects.get(name=country).id

#             target_obj.save()

#             # For history
#             History.objects.create(
#                 user=user,
#                 model_name=obj_three_code,
#                 action='UPD',
#                 description=f"User : {user.username} updated {object_type}'s: {target_obj.id} nationality from \
#                     {previous_country} to {country}"
#             )

#             # Return Object's data to update front end's state.
#             context['object'] = get_serializer(object_type, target_obj)
#             # If everything went smooth, return 200 status
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeLatLng(generics.UpdateAPIView):
#     """
#     URL: change_latlng/
#     Descr: Updates object's lat/lng
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         # Used to store any error messages.
#         context = {"errormsg": ''}

#         # Users token, used to get the user instance.
#         token_str = request.headers['User-Token']

#         # Get user
#         user = get_user(token_str)

#         # Model type
#         object_type = request.data['object_type'].replace(" ", "")
#         obj_three_code = model_names[object_type]

#         if object_type == 'GroupLeader' or object_type == 'Driver':
#             object_type = 'Contact'

#         # Get Model class instance
#         model = apps.get_model(app_label='webapp', model_name=object_type)
#         object_id = request.data['object_id']

#         # Permission
#         # Function takes 2 parameters. User id and Object's code.
#         # Returns true if user has permission to update the object.
#         if not can_update(user.id, obj_three_code):
#             context = {"errormsg": f"You do not have permission to update an {object_type}"}
#             return Response(status=401, data=context)

#         # Get lat/lng
#         lat_lng = request.data['lat_lng']
#         lat = lat_lng.split(", ")[0]
#         lng = lat_lng.split(", ")[1]

#         # Validate lat
#         if not validate_lat(lat):
#             context = {"errormsg": "Invalid Lat submitted"}
#             return Response(status=400, data=context)

#         if not validate_lng(lng):
#             context = {"errormsg": "Invalid Lng submitted"}
#             return Response(status=400, data=context)

#         try:
#             # Airport's primary key is name , not id
#             if object_type == 'Airport':
#                 target_obj = model.objects.get(name=object_id)
#             else:
#                 target_obj = model.objects.get(id=object_id)

#             # Get previous value for logigng
#             previous_value = f'Lat: {target_obj.lat} / Lng: {target_obj.lng}'
#             new_value = f'Lat: {lat} / Lng: {lng}'
#             target_obj.lat = lat
#             target_obj.lng = lng
#             target_obj.save()

#             History.objects.create(
#                 user=user,
#                 model_name=obj_three_code,
#                 action='UPD',
#                 description=f"User : {user.username} updated {object_type}'s ({target_obj}) lat/lng from \
#                     {previous_value} to {new_value}"
#             )
#             # Return Object's data to update front end's state.
#             if object_type == 'EntertainmentProduct':
#                 context['object'] = get_serializer(object_type, EntertainmentSupplier.objects.get(id=target_obj.entertainment_supplier_id))
#             else:
#                 context['object'] = get_serializer(object_type, target_obj)

#             # If everything went smooth, return 200 status
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeRating(generics.UpdateAPIView):
#     """
#     URL: change_rating/
#     Descr: Changes object's rating
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Get Model type
#         object_type = request.data['object_type'].replace(" ", "")
#         obj_three_code = model_names[object_type]

#         # Group leaders and drivers are not solid models
#         if object_type == 'GroupLeader' or object_type == 'Driver':
#             object_type = 'Contact'

#         # Get Model class instance
#         model = apps.get_model(app_label='webapp', model_name=object_type)

#         # Permission
#         if not can_update(user.id, obj_three_code):
#             context = {"errormsg": f"You do not have permission to update {object_type}'s abbreviation."}
#             return Response(status=401, data=context)

#         # Get rating
#         rating = request.data['rating']

#         # Get model
#         target_obj = model.objects.get(id=request.data['object_id'])

#         try:
#             target_obj.rating = rating
#             target_obj.save()
#             History.objects.create(
#                 user=user,
#                 model_name=obj_three_code,
#                 action='UPD',
#                 description=f"User : {user.username} updated {object_type}'s {target_obj} rating to {rating}"
#             )
#             # Return Object's data to update front end's state.
#             context['object'] = get_serializer(object_type, target_obj)
#             # If everything went smooth, return 200 status
#             return Response(data=context, status=status.HTTP_200_OK)

#         # If anything went wrong, return 400
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class DeleteObject(generics.UpdateAPIView):
#     """
#     URL: delete_object/(?P<object_id>.*)$
#     Descr: Deletes selected Object based on object_id passed from front end
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request, object_id):
#         # Users token, used to get the user instance.
#         token_str = request.headers['User-Token']

#         # Get user
#         user = get_user(token_str)

#         # Model type
#         object_type = request.data['object_type'].replace(" ", "")
#         obj_three_code = model_names[object_type]

#         # Group leader and drivers are not solid models
#         if object_type == 'GroupLeader' or object_type == 'Driver':
#             object_type = 'Contact'

#         # Used to store any error messages.
#         context = {"errormsg": '', "object_type": object_type}

#         # Get Model class instance
#         model = apps.get_model(app_label='webapp', model_name=object_type)

#         # Permission
#         # Function takes 2 parameters. User id and Object's code.
#         # Returns true if user has permission to update the object.
#         if not can_delete(user.id, obj_three_code):
#             context = {"errormsg": f"You do not have permission to delete an {object_type}"}
#             return Response(status=401, data=context)

#         try:
#             if object_type == 'Airport':
#                 target_obj = model.objects.get(name=object_id)
#             else:
#                 target_obj = model.objects.get(id=object_id)
#             History.objects.create(
#                 user=user,
#                 model_name=obj_three_code,
#                 action='DEL',
#                 description=f"User : {user.username} deleted {object_type} with name : {target_obj}"
#             )
#             target_obj.delete()
#         except ProtectedError:
#             context['errormsg'] = f'This {object_type} is protected. Remove {object_type}\'s \
#                 related objects to be able to delete it.'
#             return Response(data=context, status=400)
#         return Response(data=context, status=200)


# class AddNote(generics.UpdateAPIView):
#     """
#     URL: add_note/(?P<object_id>.*)$
#     Descr: Creates a note
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request, object_id):

#         # Used to store any error messages.
#         context = {"errormsg": ''}

#         # Users token, used to get the user instance.
#         token_str = request.headers['User-Token']

#         # Get user
#         user = get_user(token_str)

#         # Model type
#         object_type = request.data['object_type'].replace(" ", "")

#         # Get Model class instance
#         if object_type == 'GroupLeader' or object_type == 'Driver':
#             object_type = 'Contact'

#         model = apps.get_model(app_label='webapp', model_name=object_type)

#         # Query to target specific Instance using id.
#         target_obj = model.objects.get(id=object_id)

#         # Get Models 3 char code, used for permissions/logging.
#         # Example: Agent's 3 code is "AGN".Values are stored in model_names variable
#         # Get previous address for history
#         # If object is a group leader or driver, they don't have a related contact. They ARE the contact.

#         if request.data['object_type'] == 'Driver':
#             obj_three_code = 'DRV'
#         elif request.data['object_type'] == 'GroupLeader':
#             obj_three_code = 'GL'
#         else:
#             obj_three_code = model_names[object_type]

#         # Permission
#         # Function takes 2 parameters. User id and Object's code.
#         # Returns true if user has permission to update the object.
#         if not can_create(user.id, obj_three_code):
#             context = {"errormsg": f"You do not have permission to create a note for {object_type}."}
#             return Response(status=401, data=context)

#         # Get note text from front end.
#         note_text = request.data['note_text'].strip()

#         model = apps.get_model(app_label='webapp', model_name=object_type)

#         # Query to target specific Instance using id.
#         target_obj = model.objects.get(id=object_id)

#         # Update Object
#         date = datetime.datetime.today().date()
#         try:
#             newNote = Note.objects.create(date=date, text=note_text, user_id=user.id)

#             # Write event to database
#             History.objects.create(
#                 user=user,
#                 model_name=obj_three_code,
#                 action='CRE',
#                 description=f"User added note to {object_type}: {target_obj.id} with text : {note_text}"
#             )
#             newNote.save()
#         except Exception as a:
#             context['errormsg'] = a
#             return Response(data=context, status=400)

#         target_obj.notes.add(newNote)

#         # Serialize data
#         context['notes'] = NoteSerializer(target_obj.notes, many=True).data
#         return Response(data=context, status=200)


# class ChangeNoteText(generics.UpdateAPIView):
#     """
#     URL: change_note_text/(?P<object_id>.*)$
#     Descr: Updates a note's text
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request, object_id):
#         # Used to store any error messages.
#         context = {"errormsg": ''}

#         # Users token, used to get the user instance.
#         token_str = request.headers['User-Token']

#         # Get user
#         user = get_user(token_str)

#         # Model type
#         object_type = request.data['object_type'].replace(" ", "")

#         # Get Model class instance
#         if object_type == 'GroupLeader' or object_type == 'Driver':
#             object_type = 'Contact'

#         model = apps.get_model(app_label='webapp', model_name=object_type)

#         # Query to target specific Instance using id.
#         target_obj = model.objects.get(id=object_id)

#         if request.data['object_type'] == 'Driver':
#             obj_three_code = 'DRV'
#         elif request.data['object_type'] == 'GroupLeader':
#             obj_three_code = 'GL'
#         else:
#             obj_three_code = model_names[object_type]

#         # Validations
#         # None for now.

#         new_note_text = request.data['note_text'].strip()
#         note_to_edit = Note.objects.get(id=request.data['note_id'])
#         prev_note_text = note_to_edit.text

#         if not can_update(user.id, obj_three_code):
#             context = {"errormsg": f"You do not have permission to update a note text for {object_type}."}
#             return Response(status=401, data=context)

#         try:
#             note_to_edit.text = new_note_text
#             note_to_edit.user_id = user.id
#             note_to_edit.save()

#             History.objects.create(
#                 user=user,
#                 model_name=obj_three_code,
#                 action='UPD',
#                 description=f"User changed note's text of object: {object_type}, id: {target_obj.id} from {prev_note_text} \
#                     to {new_note_text}"
#             )
#         except Exception as a:
#             context['errormsg'] = a
#             return Response(data=context, status=400)

#         # Serialize data
#         context['notes'] = NoteSerializer(target_obj.notes, many=True).data
#         return Response(data=context, status=200)


# class DeleteNote(generics.UpdateAPIView):
#     """
#     URL: delete_note/(?P<object_id>.*)$
#     Descr: Updates a note's text
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request, object_id):
#         # Used to store any error messages.
#         context = {"errormsg": ''}

#         # Users token, used to get the user instance.
#         token_str = request.headers['User-Token']

#         # Get user
#         user = get_user(token_str)

#         # Model type
#         object_type = request.data['object_type'].replace(" ", "")

#         # Get Model class instance
#         if object_type == 'GroupLeader' or object_type == 'Driver':
#             object_type = 'Contact'

#         model = apps.get_model(app_label='webapp', model_name=object_type)

#         # Query to target specific Instance using id.
#         target_obj = model.objects.get(id=object_id)

#         if request.data['object_type'] == 'Driver':
#             obj_three_code = 'DRV'
#         elif request.data['object_type'] == 'GroupLeader':
#             obj_three_code = 'GL'
#         else:
#             obj_three_code = model_names[object_type]

#         if not can_delete(user.id, obj_three_code):
#             context = {"errormsg": f"You do not have permission to delete a note for {object_type}."}
#             return Response(status=401, data=context)

#         try:
#             note_to_del = Note.objects.get(id=request.data['note_id'])
#             History.objects.create(
#                 user=user,
#                 model_name=obj_three_code,
#                 action='DEL',
#                 description=f'User deleted note of {target_obj}: {target_obj.id} ( text was : {note_to_del.text} )'
#             )
#             note_to_del.delete()
#         except Exception as a:
#             context['errormsg'] = a
#             return Response(data=context, status=400)

#         # Serialize data
#         context['notes'] = NoteSerializer(target_obj.notes, many=True).data
#         return Response(data=context, status=200)


# class UploadGalleryImage(generics.UpdateAPIView):
#     """
#     URL: upload_gallery_image/(?P<object_id>.*)$
#     Descr: Uploads image to gallery's object
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request,  object_id):
#         # Used to store any error messages.
#         context = {"errormsg": ''}

#         # Users token, used to get the user instance.
#         token_str = request.headers['User-Token']

#         # Get user
#         user = get_user(token_str)

#         # Model type
#         object_type = request.data['object_type'].replace(" ", "")

#         # Get Model class instance
#         if object_type == 'GroupLeader' or object_type == 'Driver':
#             object_type = 'Contact'

#         model = apps.get_model(app_label='webapp', model_name=object_type)

#         # Query to target specific Instance using id.
#         target_obj = model.objects.get(id=object_id)

#         # Get Models 3 char code, used for permissions/logging.
#         # Example: Agent's 3 code is "AGN".Values are stored in model_names variable
#         # Get previous address for history
#         # If object is a group leader or driver, they don't have a related contact. They ARE the contact.

#         if request.data['object_type'] == 'Driver':
#             obj_three_code = 'DRV'
#         elif request.data['object_type'] == 'Group Leader':
#             obj_three_code = 'GL'
#         else:
#             obj_three_code = model_names[object_type]

#         # Permission
#         # Function takes 2 parameters. User id and Object's code.
#         # Returns true if user has permission to update the object.
#         if not can_create(user.id, obj_three_code):
#             context = {"errormsg": f"You do not have permission to upload an image for {object_type}."}
#             return Response(status=401, data=context)

#         backend_path = '/home/cosmoplan/Group_Plan/backend/static/'
#         # Create folder named with refcode to store the uploaded docs
#         # If it already exists, do nothing
#         object_id = request.data['object_id']
#         Path(backend_path + f"images/data_management/{object_type}/{object_id}/").mkdir(
#             parents=True, exist_ok=True
#         )

#         # Get user
#         file = request.FILES['file']

#         # Get comment
#         description = request.data['description'].strip()
#         extension = file.name.split('.')[-1]

#         # Validate size
#         max_size = 20971520  # 20 megabytes
#         if file.size > max_size:
#             context['errormsg'] = 'File should not exceed 20 megabytes of data'
#             return Response(data=context, status=400)
#         # If file already exists, add a counter or smth

#         # Validate extension
#         if extension not in allowed_extensions_images:
#             context['errormsg'] = f'Cannot upload .{extension} file.'
#             return Response(data=context, status=400)
#         file_name = file.name
#         counter = 1
#         full_path = backend_path + f'images/data_management/{object_type}/{object_id}/{file_name}'
#         while os.path.isfile(full_path):
#             file_name = file.name.split('.')[0] + '_' + str(counter) + '.' + file.name.split('.')[1]
#             counter += 1
#         target_obj = model.objects.get(id=object_id)

#         if request.data['object_type'] == 'Driver':
#             obj_three_code = 'DRV'
#         elif request.data['object_type'] == 'Group Leader':
#             obj_three_code = 'GL'
#         else:
#             obj_three_code = model_names[object_type]

#         # Create Image
#         try:
#             newPhoto = Photo.objects.create(
#                 photo=f'images/data_management/{object_type}/{object_id}/{file_name}',
#                 title=f'images/data_management/{object_type}/{object_id}/{file_name}',
#                 photo_comment=description,
#             )
#             newPhoto.save()

#             # Write event to database
#             History.objects.create(
#                 user=user,
#                 model_name=obj_three_code,
#                 action='CRE',
#                 description=f"User : {user.username} uploaded {object_type}'s ({target_obj}) image ({newPhoto.photo})"
#             )
#         except Exception as a:
#             context['errormsg'] = a
#             return Response(data=context, status=400)

#         target_obj.photos.add(newPhoto)
#         dest = open(full_path, 'wb+')

#         if file.multiple_chunks:
#             for c in file.chunks():
#                 dest.write(c)
#         else:
#             dest.write(file.read())
#         dest.close()
#         return Response(file_name, status.HTTP_201_CREATED)


# class ChangeGalleryImageCaption(generics.UpdateAPIView):
#     """
#     URL: change_gallery_image_caption/(?P<object_id>.*)$
#     Descr: Updates image's Caption
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request, object_id):
#         # Used to store any error messages.
#         context = {"errormsg": ''}

#         # Users token, used to get the user instance.
#         token_str = request.headers['User-Token']

#         # Get user
#         user = get_user(token_str)

#         # Model type
#         object_type = request.data['object_type'].replace(" ", "")

#         # Get Model class instance
#         if object_type == 'GroupLeader' or object_type == 'Driver':
#             object_type = 'Contact'

#         model = apps.get_model(app_label='webapp', model_name=object_type)

#         # Query to target specific Instance using id.
#         target_obj = model.objects.get(id=request.data['object_id'])

#         # Get Models 3 char code, used for permissions/logging.
#         # Example: Agent's 3 code is "AGN".Values are stored in model_names variable
#         # Get previous address for history
#         # If object is a group leader or driver, they don't have a related contact. They ARE the contact.

#         if request.data['object_type'] == 'Driver':
#             obj_three_code = 'DRV'
#         elif request.data['object_type'] == 'Group Leader':
#             obj_three_code = 'GL'
#         else:
#             obj_three_code = model_names[object_type]

#         # Permission
#         # Function takes 2 parameters. User id and Object's code.
#         # Returns true if user has permission to update the object.
#         if not can_update(user.id, obj_three_code):
#             context = {"errormsg": f"You do not have permission to edit an {object_type}'s image description."}
#             return Response(status=401, data=context)

#         caption = request.data['caption'].strip()

#         image_to_edit = Photo.objects.get(id=request.data['image_id'])
#         previous_value = image_to_edit.photo_comment
#         try:
#             image_to_edit.photo_comment = caption
#             image_to_edit.user_id = user.id
#             image_to_edit.save()
#             History.objects.create(
#                 user=user,
#                 model_name=obj_three_code,
#                 action='UPD',
#                 description=f"User : {user.username} updated {object_type}'S image ({image_to_edit.photo}) \
#                     caption from {previous_value} to {caption}"
#             )
#             # Return Object's data to update front end's state.
#             context['object'] = get_serializer(object_type, target_obj)

#             # If everything went smooth, return 200 status
#             return Response(data=context, status=status.HTTP_200_OK)

#         # If anything went wrong, return 400
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class DeleteGalleryImage(generics.UpdateAPIView):
#     """
#     URL: delete_gallery_image/(?P<object_id>.*)$
#     Descr: Deletes image from both database and file system
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request, object_id):
#         # Used to store any error messages.
#         context = {"errormsg": ''}

#         # Users token, used to get the user instance.
#         token_str = request.headers['User-Token']

#         # Get user
#         user = get_user(token_str)

#         # Model type
#         object_type = request.data['object_type'].replace(" ", "")

#         # Get Model class instance
#         if object_type == 'GroupLeader' or object_type == 'Driver':
#             object_type = 'Contact'

#         model = apps.get_model(app_label='webapp', model_name=object_type)

#         # Query to target specific Instance using id.
#         target_obj = model.objects.get(id=request.data['object_id'])

#         # Get Models 3 char code, used for permissions/logging.
#         # Example: Agent's 3 code is "AGN".Values are stored in model_names variable
#         # Get previous address for history
#         # If object is a group leader or driver, they don't have a related contact. They ARE the contact.

#         if request.data['object_type'] == 'Driver':
#             obj_three_code = 'DRV'
#         elif request.data['object_type'] == 'Group Leader':
#             obj_three_code = 'GL'
#         else:
#             obj_three_code = model_names[object_type]

#         # Permission
#         # Function takes 2 parameters. User id and Object's code.
#         # Returns true if user has permission to update the object.
#         if not can_delete(user.id, obj_three_code):
#             context = {"errormsg": f"You do not have permission to delete a {object_type}'s image."}
#             return Response(status=401, data=context)

#         try:
#             image_to_del = Photo.objects.get(id=request.data['image_id'])
#             History.objects.create(
#                 user=user,
#                 model_name=obj_three_code,
#                 action='DEL',
#                 description=f"User : {user.username} deleted {object_type}'s image ({image_to_del.photo})"
#             )
#             image_to_del.delete()
#             full_path = '/home/cosmoplan/Group_Plan/backend/static/' + str(image_to_del.photo)

#             # Without try/except  server gives 500
#             # With try/except it works as expected
#             try:
#                 os.remove(full_path)
#             except Exception:
#                 pass
#             context['object'] = get_serializer(object_type, target_obj)

#             # If everything went smooth, return 200 status
#             return Response(data=context, status=status.HTTP_200_OK)

#         # If anything went wrong, return 400
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeMake(generics.UpdateAPIView):
#     """
#     URL: change_make/
#     Descr: Updates coache's make
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'CO'):
#             context = {"errormsg": "You do not have permission to update Coach's make."}
#             return Response(status=401, data=context)

#         try:
#             make = request.data['make'].strip()
#             coach = Coach.objects.get(id=request.data['coach_id'])
#         except Exception as exc:
#             context['errormsg'] = exc
#             return HttpResponse(status=400)

#         # Validate make
#         if not validate_coach_make(make):
#             context['errormsg'] = 'Invalid make submitted'
#             return Response(data=context, status=400)

#         # Get previous make for logging
#         previous_make = coach.make
#         try:
#             coach.make = make
#             coach.save()
#             History.objects.create(
#                 user=user,
#                 model_name='CO',
#                 action='UPD',
#                 description=f"User : {user.username} updated coach's make from {previous_make} to {make}"
#             )

#             # Serialize data
#             context['coach'] = CoachSerializer(coach).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeBodyNumber(generics.UpdateAPIView):
#     """
#     URL: change_body_number/
#     Descr: Updates coach's body number
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'CO'):
#             context = {"errormsg": "You do not have permission to update Coach's body number."}
#             return Response(status=401, data=context)

#         try:
#             body_number = request.data['body_number'].strip()
#             coach = Coach.objects.get(id=request.data['coach_id'])
#         except Exception as exc:
#             context['errormsg'] = exc
#             return HttpResponse(status=400)

#         # Validate body number
#         if not validate_coach_body_number(body_number):
#             context['errormsg'] = 'Invalid body number submitted'
#             return Response(data=context, status=400)

#         # Get previous body number for logging
#         previous_body_number = coach.body_number
#         try:
#             coach.body_number = body_number
#             coach.save()
#             History.objects.create(
#                 user=user,
#                 model_name='CO',
#                 action='UPD',
#                 description=f"User : {user.username} updated coach's (id: {coach.id}) body number from \
#                     {previous_body_number} to {body_number}"
#             )

#             # Serialize data
#             context['coach'] = CoachSerializer(coach).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangePlateNumber(generics.UpdateAPIView):
#     """
#     URL: change_plate_number/
#     Descr: Updates coach's plate number
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'CO'):
#             context = {"errormsg": "You do not have permission to update Coach's plate number."}
#             return Response(status=401, data=context)

#         try:
#             # Get body number
#             plate_number = request.data['plate_number'].strip()

#             # Get coach
#             coach = Coach.objects.get(id=request.data['coach_id'])
#         except Exception as exc:
#             context['errormsg'] = exc
#             return HttpResponse(status=400)

#         # Get previous plate number for logging
#         previous_plate_number = coach.plate_number

#         try:
#             coach.plate_number = plate_number
#             coach.save()
#             History.objects.create(
#                 user=user,
#                 model_name='CO',
#                 action='UPD',
#                 description=f"User : {user.username} updated coach's (id: {coach.id}) plate number from \
#                     {previous_plate_number} to {plate_number}"
#             )

#             # Serialize data
#             context['coach'] = CoachSerializer(coach).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeNumberOfSeats(generics.UpdateAPIView):
#     """
#     URL: change_number_of_seats/
#     Descr: Updates coach's number of seats
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'CO'):
#             context = {"errormsg": "You do not have permission to update Coach's number of seats."}
#             return Response(status=401, data=context)

#         try:
#             number_of_seats = request.data['number_of_seats']
#             coach = Coach.objects.get(id=request.data['coach_id'])
#         except Exception as exc:
#             context['errormsg'] = exc
#             return HttpResponse(status=400)

#         # Get previous number of seats for logging
#         previous_number_of_seats = coach.number_of_seats

#         try:
#             coach.number_of_seats = number_of_seats
#             coach.save()
#             History.objects.create(
#                 user=user,
#                 model_name='CO',
#                 action='UPD',
#                 description=f"User : {user.username} updated coach's (id: {coach.id}) number of seats from \
#                     {previous_number_of_seats} to {number_of_seats}"
#             )

#             # Serialize data
#             context['coach'] = CoachSerializer(coach).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeEmission(generics.UpdateAPIView):
#     """
#     URL: change_emission/
#     Descr: Updates coach's emission
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'CO'):
#             context = {"errormsg": "You do not have permission to update Coach's emission."}
#             return Response(status=401, data=context)

#         try:
#             emission = request.data['emission']
#             coach = Coach.objects.get(id=request.data['coach_id'])
#         except Exception as exc:
#             context['errormsg'] = exc
#             return HttpResponse(status=400)

#         # Get previous emission for logging
#         previous_emission = coach.emission

#         try:
#             coach.emission = emission
#             coach.save()
#             History.objects.create(
#                 user=user,
#                 model_name='CO',
#                 action='UPD',
#                 description=f"User : {user.username} updated coach's (id: {coach.id}) emission from \
#                     {previous_emission} to {emission}"
#             )

#             # Serialize data
#             context['coach'] = CoachSerializer(coach).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeYear(generics.UpdateAPIView):
#     """
#     URL: change_year/
#     Descr: Updates coach's year
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'CO'):
#             context = {"errormsg": "You do not have permission to update Coach's year."}
#             return Response(status=401, data=context)

#         try:
#             year = request.data['year']
#             coach = Coach.objects.get(id=request.data['coach_id'])
#         except Exception as exc:
#             context['errormsg'] = exc
#             return HttpResponse(status=400)

#         # Get previous year for logging
#         previous_year = coach.year
#         try:
#             coach.year = year
#             coach.save()
#             History.objects.create(
#                 user=user,
#                 model_name='CO',
#                 action='UPD',
#                 description=f"User : {user.username} updated coach's (id: {coach.id}) year from \
#                     {previous_year} to {year}"
#             )

#             # Serialize data
#             context['coach'] = CoachSerializer(coach).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class UploadCoachDocument(generics.ListCreateAPIView):
#     """
#     URL: upload_coach_document/
#     Descr: Uploads document for coach
#     types:
#     1) Vehicle technical control (KTEO)
#     2) Vehicle insurance
#     3) Lease contract
#     4) Vehicle registration
#     5) Tachograph documents
#     6) EU community passenger transport license
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)
#         context = {"errormsg": ''}

#         # Permission
#         if not can_create(user.id, 'CO'):
#             context = {"errormsg": "You do not have permission to create a Coach's document."}
#             return Response(status=401, data=context)

#         # Get current working directory
#         backend_path = '/home/cosmoplan/Group_Plan/backend/static/'

#         # Get coach
#         coach_id = request.data['coach_id']
#         coach = Coach.objects.get(id=coach_id)

#         # Get doc type
#         type = request.data['type']
#         type_for_log = request.data['type']

#         # Get doc type full name
#         if type == 'vehicle technical control':
#             type = 'KTEO'
#         elif type == 'vehicle insurance':
#             type = 'VI'
#         elif type == 'lease contract':
#             type = 'LC'
#         elif type == 'vehicle registration':
#             type = 'VR'
#         elif type == 'tachograph document':
#             type = 'TCD'
#         elif type == 'eu community passenger transport license':
#             type = 'CPTL'

#         # Get expiration date
#         expiration_date = request.data['expiration_date']

#         # Create folder named with coach_id to store the uploaded docs
#         # If it already exists, do nothing
#         Path(backend_path + 'files/data_management/coaches/' + coach_id + '/').mkdir(
#             parents=True,
#             exist_ok=True
#         )

#         # Get user
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)
#         file = request.FILES['file']

#         # Get description
#         extension = file.name.split('.')[-1]

#         # Validate size
#         max_size = 20971520  # 20 megabytes
#         if file.size > max_size:
#             context['errormsg'] = 'File should not exceed 20 megabytes of data'
#             return Response(data=context, status=400)

#         # Validate extension
#         if extension not in allowed_extension_documents:
#             context['errormsg'] = f'Cannot upload .{extension} file.'
#             return Response(data=context, status=400)

#         file_name = file.name
#         full_path = 'files/data_management/coaches/' + coach_id + '/' + str(file_name)
#         try:
#             newDocument = Document.objects.create(
#                 name=file_name,
#                 type=type,
#                 uploader_id=user.id,
#                 expiry_date=expiration_date,
#                 file=full_path,
#                 size=file.size,
#             )
#             History.objects.create(
#                 user=user,
#                 model_name='CO',
#                 action='CRE',
#                 description=f"User : {user.username} uploaded coach's ({coach.id}) {type_for_log}.\
#                     filename: ({newDocument.name})"
#             )

#             newDocument.save()
#         except Exception as a:
#             context['errormsg'] = a
#             return Response(data=context, status=400)
#         coach.documents.add(newDocument)

#         dest = open(backend_path + full_path, 'wb+')
#         # Write it to \files\group_documents\<group_refcode>\<file_name>
#         if file.multiple_chunks:
#             for c in file.chunks():
#                 dest.write(c)
#         else:
#             dest.write(file.read())
#         dest.close()
#         update_notifications()
#         return Response(file_name, status.HTTP_201_CREATED)


# class DeleteCoachDocument(generics.UpdateAPIView):
#     """
#     URL: delete_coach_document/
#     Descr: Deletes coach's document
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)
#         context = {"errormsg": ''}

#         # Permission
#         if not can_delete(user.id, 'CO'):
#             context = {"errormsg": "You do not have permission to delete a Coach's document."}
#             return Response(status=401, data=context)

#         # Get coach
#         coach_id = request.data['coach_id']
#         coach = Coach.objects.get(id=coach_id)

#         # Get coach type for logging
#         type_for_log = request.data['type']

#         # Get document
#         document_id = request.data['document_id']
#         document_name = request.data['document_name']

#         # Get current working directory
#         backend_path = '/home/cosmoplan/Group_Plan/backend/static/'
#         full_path = backend_path + 'files/data_management/coaches/' + str(coach_id) + '/'

#         # Remove file from system
#         os.remove(full_path + document_name)
#         try:
#             document_to_delete = Document.objects.get(id=document_id)
#             History.objects.create(
#                 user=user,
#                 model_name='CO',
#                 action='DEL',
#                 description=f"User : {user.username} deleted driver's ({coach.id}) {type_for_log}.\
#                     filename: ({document_name})"
#             )
#             document_to_delete.delete()
#         except Exception as a:
#             context['errormsg'] = a
#             return Response(data=context, status=400)

#         # Serialize data
#         context['coach'] = CoachSerializer(coach).data
#         update_notifications()
#         return Response(data=context, status=200)


# class DownloadCoachDocument(generics.ListAPIView):
#     """
#     URL: download_coach_document/
#     Descr: Downloads coach's document
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def get(self, request, coach_id):
#         # Get current working directory
#         backend_path = '/home/cosmoplan/Group_Plan/backend/static/'

#         # Get file
#         file = request.GET.get('file')

#         # Get full path
#         full_path = backend_path + 'files/data_management/coaches/' + coach_id + '/' + str(file)

#         # Open file
#         f = open(full_path, 'rb')

#         # Read it
#         file_contents = f.read()
#         f.close()

#         # Serve it to front
#         temp = HttpResponse(file_contents, content_type='multipart/form-data')
#         temp['Content-Disposition'] = 'attachment; filename=' + str(file)
#         return temp


# class UpdateAmenities(generics.ListCreateAPIView):
#     """
#     URL: change_amenities/
#     Descr: Updates Hotel's Amenities
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'HTL'):
#             context = {"errormsg": "You do not have permission to update a hotel's amenities."}
#             return Response(status=401, data=context)

#         # Get hotel
#         hotel_id = request.data['hotel_id']
#         hotel = Hotel.objects.get(id=hotel_id)

#         # Get hotel's amenities
#         amenity = Amenity.objects.get(id=hotel.amenity_id)
#         amenities = request.data['amenities']
#         try:
#             amenity.has_free_internet = amenities['has_free_internet']
#             amenity.has_parking = amenities['has_parking']
#             amenity.allows_pets = amenities['allows_pets']
#             amenity.has_swimming_pool = amenities['has_swimming_pool']
#             amenity.has_airport_shuttle = amenities['has_airport_shuttle']
#             amenity.has_smoking_free_facilities = amenities['has_smoking_free_facilities']
#             amenity.has_fitness_center = amenities['has_fitness_center']

#             amenity.has_restaurant = amenities['has_restaurant']
#             amenity.room_service = amenities['room_service']
#             amenity.has_spa = amenities['has_spa']
#             amenity.has_sauna = amenities['has_sauna']
#             amenity.has_24hour_reception = amenities['has_24hour_reception']
#             amenity.has_bar = amenities['has_bar']
#             amenity.has_elevator = amenities['has_elevator']

#             amenity.has_mini_bar = amenities['has_mini_bar']
#             amenity.has_24hour_room_service = amenities['has_24hour_room_service']
#             amenity.has_climate_control = amenities['has_climate_control']
#             amenity.has_coffee_maker = amenities['has_coffee_maker']
#             amenity.has_safe_deposit_box = amenities['has_safe_deposit_box']

#             amenity.save()

#             History.objects.create(
#                 user=user,
#                 model_name='HTL',
#                 action='UPD',
#                 description=f"User : {user.username} updated hotel's ({hotel.name}) amenities"
#             )
#             # Serialize data
#             context['hotel'] = HotelSerializer(hotel).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangePrice(generics.ListCreateAPIView):
#     """
#     URL: change_price/
#     Descr: Updates Hotel's Price
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'HTL'):
#             context = {"errormsg": "You do not have permission to update a hotel's amenities."}
#             return Response(status=401, data=context)

#         # Get hotel
#         hotel_id = request.data['hotel_id']
#         hotel = Hotel.objects.get(id=hotel_id)
#         price = request.data['price']

#         # Get hotel's amenities
#         try:
#             hotel.price = price
#             hotel.save()

#             History.objects.create(
#                 user=user,
#                 model_name='HTL',
#                 action='UPD',
#                 description=f"User : {user.username} updated hotel's ({hotel.name}) price"
#             )
#             # Serialize data
#             context['object'] = HotelSerializer(hotel).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeGuideLanguages(generics.UpdateAPIView):
#     """
#     URL: change_guide_languages/
#     Descr: Updates Guide's languages
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'GD'):
#             context = {"errormsg": "You do not have permission to update a Guide's languages"}
#             return Response(status=401, data=context)

#         try:
#             # Get guide
#             guide_id = request.data['guide_id']

#             # Get guide's languages
#             countries = request.data['countries']
#         except Exception as exc:
#             context['errormsg'] = exc
#             return HttpResponse(status=400)
#         country_ids = (i['id'] for i in countries)

#         try:
#             guide = Guide.objects.get(id=guide_id)

#             # Remove guide's languages
#             guide.flags.clear()

#             # Add new set
#             for id in country_ids:
#                 guide.flags.add(id)
#             guide.save()
#             History.objects.create(
#                 user=user,
#                 model_name='GD',
#                 action='UPD',
#                 description=f"User : {user.username} updated guide's ({guide.name}) languages"
#             )

#             # Serialize data
#             context['guide'] = GuideSerializer(guide).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as a:
#             context['errormsg'] = a
#             return Response(data=context, status=400)


# class ChangeGroupLeaderLanguages(generics.UpdateAPIView):
#     """
#     URL: change_group_leader_languages/
#     Descr: Updates Guide's languages
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         # if not can_update(user.id, 'GD'):
#         #     context = {"errormsg": "You do not have permission to update a Guide's languages"}
#         #     return Response(status=401, data=context)

#         try:
#             # Get leader
#             group_leader_id = request.data['group_leader_id']

#             # Get group_leader's languages
#             countries = request.data['countries']
#         except Exception as exc:
#             context['errormsg'] = exc
#             return HttpResponse(status=400)
#         country_ids = (i['id'] for i in countries)

#         try:
#             group_leader = Contact.objects.get(id=group_leader_id)

#             # Remove group_leader's languages
#             group_leader.flags.clear()

#             # Add new set
#             for id in country_ids:
#                 group_leader.flags.add(id)
#                 group_leader.save()
#             History.objects.create(
#                 user=user,
#                 model_name='GD',
#                 action='UPD',
#                 description=f"User : {user.username} updated group_leader's ({group_leader.name}) languages"
#             )

#             # Serialize data
#             context['group_leader'] = ContactSerializer(group_leader).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as a:
#             context['errormsg'] = a
#             return Response(data=context, status=400)


# class ChangeDmcLanguages(generics.UpdateAPIView):
#     """
#     URL: change_dmc_languages/
#     Descr: Updates Dmc's languages
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'DMC'):
#             context = {"errormsg": "You do not have permission to update a DMC's languages"}
#             return Response(status=401, data=context)

#         try:
#             # Get dmc
#             dmc_id = request.data['dmc_id']

#             # Get dmc's languages
#             countries = request.data['countries']
#         except Exception as exc:
#             context['errormsg'] = exc
#             return HttpResponse(status=400)
#         country_ids = (i['id'] for i in countries)

#         try:
#             dmc = DMC.objects.get(id=dmc_id)

#             # Remove guide's languages
#             dmc.countries_operating.clear()

#             # Add new set
#             for id in country_ids:
#                 dmc.countries_operating.add(id)
#             dmc.save()
#             History.objects.create(
#                 user=user,
#                 model_name='DMC',
#                 action='UPD',
#                 description=f"User : {user.username} updated dmc's ({dmc.name}) countries operating"
#             )

#             # Serialize data
#             context['dmc'] = DMCSerializer(dmc).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as a:
#             context['errormsg'] = a
#             return Response(data=context, status=400)


# class UploadDriverDocument(generics.ListCreateAPIView):
#     """
#     URL: upload_driver_document/
#     Descr: Uploads document for driver
#     types:
#     1) Driver's License
#     2) Tachograph Card
#     3) Passport
#     4) Identification Card
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)
#         context = {"errormsg": ''}

#         # Permission
#         if not can_create(user.id, 'DRV'):
#             context = {"errormsg": "You do not have permission to create a Driver's document."}
#             return Response(status=401, data=context)

#         # Get current working directory
#         backend_path = '/home/cosmoplan/Group_Plan/backend/static/'

#         # Get driver
#         driver_id = request.data['driver_id']
#         driver = Contact.objects.get(id=driver_id)

#         # Get document type
#         type = request.data['type']
#         type_for_log = request.data['type']

#         # Get document type full name
#         if type == 'driver license':
#             type = 'DL'
#         elif type == 'tachograph card':
#             type = 'TC'
#         elif type == 'passport':
#             type = 'PST'
#         elif type == 'identification card':
#             type = 'ID'

#         # Get expiration date
#         expiration_date = request.data['expiration_date']

#         # Create folder named with driver_id to store the uploaded docs
#         # If it already exists, do nothing
#         Path(backend_path + '/' + 'files/data_management/drivers/' + driver_id + '/').mkdir(
#             parents=True,
#             exist_ok=True
#         )

#         # Get file
#         file = request.FILES['file']

#         # Get extension
#         extension = file.name.split('.')[-1]

#         # Validate size
#         max_size = 20971520  # 20 megabytes
#         if file.size > max_size:
#             context['errormsg'] = 'File should not exceed 20 megabytes of data'
#             return Response(data=context, status=400)

#         # Validate extension
#         if extension not in allowed_extension_documents:
#             context['errormsg'] = f'Cannot upload .{extension} file.'
#             return Response(data=context, status=400)
#         file_name = file.name
#         full_path = 'files/data_management/drivers/' + driver_id + '/' + str(file_name)
#         try:
#             newDocument = Document.objects.create(
#                 name=file_name,
#                 type=type,
#                 uploader_id=user.id,
#                 expiry_date=expiration_date,
#                 file=full_path,
#                 size=file.size,
#             )
#             History.objects.create(
#                 user=user,
#                 model_name='DRV',
#                 action='CRE',
#                 description=f"User : {user.username} uploaded driver's ({driver.name}) {type_for_log}. \
#                     filename: ({newDocument.name})"
#             )
#             newDocument.save()
#         except Exception as a:
#             context['errormsg'] = a
#             return Response(data=context, status=400)
#         driver.documents.add(newDocument)

#         dest = open(backend_path + full_path, 'wb+')
#         # Write it to \files\group_documents\<group_refcode>\<file_name>
#         if file.multiple_chunks:
#             for c in file.chunks():
#                 dest.write(c)
#         else:
#             dest.write(file.read())
#         dest.close()
#         update_notifications()
#         return Response(file_name, status.HTTP_201_CREATED)


# class DeleteDriverDocument(generics.UpdateAPIView):
#     """
#     URL: delete_driver_document/
#     Descr: Deletes driver's document
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)
#         context = {"errormsg": ''}

#         # Permission
#         if not can_delete(user.id, 'DRV'):
#             context = {"errormsg": "You do not have permission to delete a Driver's document."}
#             return Response(status=401, data=context)

#         # Get driver
#         driver_id = request.data['driver_id']
#         driver = Contact.objects.get(id=driver_id)

#         # Get document
#         document_id = request.data['document_id']
#         document_name = request.data['document_name']

#         # Get document type
#         type_for_log = request.data['type']

#         # Get current working directory
#         backend_path = '/home/cosmoplan/Group_Plan/backend/static/'
#         full_path = backend_path + 'files/data_management/drivers/' + str(driver_id) + '/'

#         # Remove the file from system
#         os.remove(full_path + document_name)
#         try:
#             document_to_delete = Document.objects.get(id=document_id)
#             History.objects.create(
#                 user=user,
#                 model_name='DRV',
#                 action='DEL',
#                 description=f"User : {user.username} deleted driver's ({driver.name}) {type_for_log}.\
#                     filename: ({document_name})"
#             )
#             document_to_delete.delete()
#         except Exception as a:
#             context['errormsg'] = a
#             return Response(data=context, status=400)

#         # Serialize data
#         context['driver'] = ContactSerializer(driver).data
#         update_notifications()
#         return Response(data=context, status=200)


# class DownloadDriverDocument(generics.ListAPIView):
#     """
#     URL: download_driver_document/
#     Descr: Downloads driver's document
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def get(self, request, driver_id):
#         # Get current working directory
#         backend_path = '/home/cosmoplan/Group_Plan/backend/static/'

#         # Get file
#         file = request.GET.get('file')
#         full_path = backend_path + 'files/data_management/drivers/' + driver_id + '/' + str(file)

#         # Open file
#         f = open(full_path, 'rb')

#         # Read it
#         file_contents = f.read()
#         f.close()

#         # Serve it to front
#         temp = HttpResponse(file_contents, content_type='multipart/form-data')
#         temp['Content-Disposition'] = 'attachment; filename=' + str(file)
#         return temp


# class ChangeRepairShopType(generics.UpdateAPIView):
#     """
#     URL: change_repair_shop_type/
#     Descr: Updates repair shop's type
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": '', 'new_repair_shop_id': ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'RSH'):
#             context = {"errormsg": "You do not have permission to update a Repair Shop's type."}
#             return Response(status=401, data=context)

#         try:
#             # Get repair shop
#             repair_shop_id = request.data['repair_shop_id']

#             # Get repair types
#             types = request.data['types']
#         except Exception as exc:
#             context['errormsg'] = exc
#             return HttpResponse(status=400)

#         # Get type ids
#         type_ids = (i['id'] for i in types)
#         try:
#             repair_shop = RepairShop.objects.get(id=repair_shop_id)
#             repair_shop.type.clear()
#             for id in type_ids:
#                 repair_shop.type.add(id)
#             repair_shop.save()
#             History.objects.create(
#                 user=user,
#                 model_name='RSH',
#                 action='UPD',
#                 description=f"User : {user.username} updated repair shop's ({repair_shop.name}) types"
#             )

#             # Serialize data
#             context['repair_shop'] = RepairShopSerializer(repair_shop).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeRestaurantType(generics.UpdateAPIView):
#     """
#     URL: change_restaurant_type/
#     Descr: Updates restaurant's type
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": '', 'new_restaurant_id': ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'RSH'):
#             context = {"errormsg": "You do not have permission to update a Repair Shop's type."}
#             return Response(status=401, data=context)

#         try:
#             # Get repair shop
#             restaurant_id = request.data['restaurant_id']

#             # Get repair types
#             types = request.data['types']
#         except Exception as exc:
#             context['errormsg'] = exc
#             return HttpResponse(status=400)

#         # Get type ids
#         type_ids = (i['id'] for i in types)
#         try:
#             restaurant = Restaurant.objects.get(id=restaurant_id)
#             restaurant.type.clear()
#             for id in type_ids:
#                 restaurant.type.add(id)
#             restaurant.save()
#             History.objects.create(
#                 user=user,
#                 model_name='RSH',
#                 action='UPD',
#                 description=f"User : {user.username} updated repair shop's ({restaurant.name}) types"
#             )

#             # Serialize data
#             context['restaurant'] = RestaurantSerializer(restaurant).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeCode(generics.UpdateAPIView):
#     """
#     URL: change_code/
#     Descr: Updates port's code
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'PRT'):
#             context = {"errormsg": "You do not have permission to update Port's code."}
#             return Response(status=401, data=context)

#         # Get code
#         code = request.data['code']

#         # Get port
#         port = Port.objects.get(id=request.data['port_id'])

#         # Validations
#         if not validate_port_code(code):
#             context['errormsg'] = 'Invalid port code submitted'
#             return Response(data=context, status=400)

#         # For history
#         previous_code = port.codethree

#         # Update Port
#         try:
#             port.codethree = code
#             port.save()

#             # Write event to database
#             History.objects.create(
#                 user=user,
#                 model_name='PRT',
#                 action='UPD',
#                 description=f"User : {user.username} updated port's code from {previous_code} to {code}"
#             )
#             # Serialize data
#             context['port'] = PortSerializer(port).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeRailwayStationCode(generics.UpdateAPIView):
#     """
#     URL: change_railway_station_code/
#     Descr: Updates railwaystation's code
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'RS'):
#             context = {"errormsg": "You do not have permission to update Railway Station's code."}
#             return Response(status=401, data=context)

#         # Get code
#         code = request.data['code']

#         # Get railway_station
#         railway_station = RailwayStation.objects.get(id=request.data['railway_station_id'])

#         # Validations
#         if not validate_port_code(code):
#             context['errormsg'] = 'Invalid railway_station code submitted'
#             return Response(data=context, status=400)

#         # For history
#         previous_code = railway_station.codethree

#         # Update RailwayStation
#         try:
#             railway_station.codethree = code
#             railway_station.save()

#             # Write event to database
#             History.objects.create(
#                 user=user,
#                 model_name='PRT',
#                 action='UPD',
#                 description=f"User : {user.username} updated railway_station's code from {previous_code} to {code}"
#             )
#             # Serialize data
#             context['railway_station'] = RailwayStationSerializer(railway_station).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeLocation(generics.UpdateAPIView):
#     """
#     URL: change_location/
#     Descr: Updates airport's location
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'AP'):
#             context = {"errormsg": "You do not have permission to update an Airport's location."}
#             return Response(status=401, data=context)

#         # Get location / airport
#         try:
#             location = request.data['location'].strip()
#             airport = Airport.objects.get(name=request.data['airport_name'])
#         except Exception as exc:
#             context['errormsg'] = exc
#             return HttpResponse(status=400)

#         if not validate_airport_location(location):
#             context['errormsg'] = 'Invalid Location submitted'
#             return Response(data=context, status=400)

#         # Get previous location for logging
#         previous_location = airport.location
#         try:
#             airport.location = location
#             airport.save()
#             History.objects.create(
#                 user=user,
#                 model_name='AP',
#                 action='UPD',
#                 description=f"User : {user.username} updated airport ({airport}) location from \
#                     {previous_location} to {location}"
#             )
#             # Serialize data
#             context['airport'] = AirportSerializer(airport).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class AddTerminal(generics.UpdateAPIView):
#     """
#     URL: add_terminal/
#     Descr: Creates a terminal for an airport
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": '', 'new_airport_name': ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_create(user.id, 'AP'):
#             context = {"errormsg": "You do not have permission to create an Airport's terminal."}
#             return Response(status=401, data=context)

#         # Get terminal name and airport
#         try:
#             terminal_name = request.data['name'].strip()
#             airport_name = request.data['airport_name'].upper().strip()
#             airport = Airport.objects.get(name=airport_name)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)

#         # Validate terminal name
#         if not validate_terminal(terminal_name):
#             context['errormsg'] = 'Invalid name submitted'
#             return Response(data=context, status=400)

#         try:
#             terminal = Terminal.objects.create(name=terminal_name, airport_id=airport_name)
#             History.objects.create(
#                 user=user,
#                 model_name='AP',
#                 action='CRE',
#                 description=f"User : {user.username} created a terminal for airport: \
#                     {airport} with name: {terminal.name}"
#             )
#             # Serialize data
#             context['airport'] = AirportSerializer(airport).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class DeleteTerminal(generics.UpdateAPIView):
#     """
#     URL: delete_terminal/
#     Descr: Deletes a terminal
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": '', 'new_airport_name': ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_delete(user.id, 'AP'):
#             context = {"errormsg": "You do not have permission to delete a terminal."}
#             return Response(status=401, data=context)

#         # Get terminal id
#         try:
#             terminal_id = request.data['terminal_id']
#             terminal = Terminal.objects.get(id=terminal_id)
#             airport = Airport.objects.get(name=terminal.airport_id)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)

#         try:
#             terminal.delete()
#             History.objects.create(
#                 user=user,
#                 model_name='AP',
#                 action='DEL',
#                 description=f"User : {user.username} deleted airport's ({airport.name}) \
#                     terminal with name {terminal.name}"
#             )
#             # Serialize data
#             context['airport'] = AirportSerializer(airport).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class UpdateAirportDistance(generics.UpdateAPIView):
#     """
#     URL: update_airport_distance/
#     Descr: Updates distance between two airports.
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'AP'):
#             context = {"errormsg": "You do not have permission to update an airport distance."}
#             return Response(status=401, data=context)

#         try:
#             # Get source
#             src_id = request.data['src_id'].strip()

#             # Get destination
#             dst_id = request.data['dst_id'].strip()

#             # Get distance
#             distance = request.data['distance'].strip()

#             # Get airport distance entry
#             airport_distance = AirportDistances.objects.get(src_id=src_id, dst_id=dst_id)

#             # Get previous distance for logging
#             previous_distance = airport_distance.distance
#         except Exception as exc:
#             context['errormsg'] = exc
#             return HttpResponse(status=400)
#         try:
#             airport_distance.distance = distance
#             airport_distance.save()
#             History.objects.create(
#                 user=user,
#                 model_name='AP',
#                 action='UPD',
#                 description=f'User : {user.username} updated airport distance, \
#                     from {src_id} to {dst_id} from {previous_distance} km to {distance}  km'
#             )
#             context['refresh'] = 'refresh'
#             return Response(data=context, status=status.HTTP_200_OK)

#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeTemplateText(generics.UpdateAPIView):
#     """
#     URL: change_template_text/
#     Descr: Updates Template's text
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'TT'):
#             context = {"errormsg": "You do not have permission to update a Text Template's Text."}
#             return Response(status=401, data=context)

#         # Get depth
#         text = request.data['text']

#         # Get port
#         text_template = TextTemplate.objects.get(id=request.data['text_template_id'])

#         # Get previous depth for logging
#         previous_text = text_template.text

#         try:
#             text_template.text = text
#             text_template.save()

#             # Write event to database
#             History.objects.create(
#                 user=user,
#                 model_name='TT',
#                 action='UPD',
#                 description=f"User : {user.username} updated Template's text from {previous_text} to {text}"
#             )

#             # Serialize data
#             context['text_template'] = TextTemplateSerializer(text_template).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeTemplateType(generics.UpdateAPIView):
#     """
#     URL: change_template_type/
#     Descr: Updates Template's type
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'TT'):
#             context = {"errormsg": "You do not have permission to update a Text Template's Type."}
#             return Response(status=401, data=context)

#         template_type = request.data['type']
#         text_template = TextTemplate.objects.get(id=request.data['text_template_id'])

#         previous_type = text_template.type

#         try:
#             text_template.type = template_type
#             text_template.save()

#             # Write event to database
#             History.objects.create(
#                 user=user,
#                 model_name='TT',
#                 action='UPD',
#                 description=f"User : {user.username} updated Template's type from \
#                     {TEXT_TEMPLATE_TYPES[previous_type]} to {TEXT_TEMPLATE_TYPES[template_type]}"
#             )

#             # Serialize data
#             context['text_template'] = TextTemplateSerializer(text_template).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeTemplateCountries(generics.UpdateAPIView):
#     """
#     URL: change_template_countries/
#     Descr: Updates Template's Countries
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'TT'):
#             context = {"errormsg": "You do not have permission to update a Text Template's Countries."}
#             return Response(status=401, data=context)

#         countries = request.data['countries']
#         text_template = TextTemplate.objects.get(id=request.data['text_template_id'])

#         try:
#             for country in text_template.countries.all():
#                 text_template.countries.remove(country)
#             text_template.save()

#             for country in countries:
#                 newTTCountry = TextTemplateCountry.objects.create(name=country)
#                 text_template.countries.add(newTTCountry)
#             text_template.save()

#             # Write event to database
#             History.objects.create(
#                 user=user,
#                 model_name='TT',
#                 action='UPD',
#                 description=f"User : {user.username} updated Template's countries"
#             )

#             # Serialize data
#             context['text_template'] = TextTemplateSerializer(text_template).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeBusIcon(generics.UpdateAPIView):
#     """
#     URL: change_bus_icon/
#     Descr: Updates Agent's bus icon
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'AGN'):
#             context = {"errormsg": "You do not have permission to update an Agent's icon."}
#             return Response(status=401, data=context)

#         # get agent id

#         agent = Agent.objects.get(id=request.data['agent_id'])
#         filename = request.data['filename']

#         # Create Image
#         try:
#             agent.icon = f'/dj_static/images/agent_icons/{filename}'
#             agent.save()

#             # Write event to database
#             History.objects.create(
#                 user=user,
#                 model_name='AGN',
#                 action='CRE',
#                 description=f"User : {user.username} uploaded Agent's ({agent.name}) icon"
#             )
#             # Serialize data
#             context['agent'] = AgentSerializer(agent).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class AddContactPerson(generics.UpdateAPIView):
#     """
#     URL: add_contact_person/(?P<object_id>.*)$
#     Descr: Creates a contact person
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):

#         # Used to store any error messages.
#         context = {"errormsg": ''}

#         # Users token, used to get the user instance.
#         token_str = request.headers['User-Token']

#         # Get user
#         user = get_user(token_str)

#         # Model type
#         object_type = request.data['object_type'].replace(" ", "")

#         model = apps.get_model(app_label='webapp', model_name=object_type)

#         object_id = request.data['object_id']
#         # Query to target specific Instance using id.

#         target_obj = model.objects.get(id=object_id)

#         # Get Models 3 char code, used for permissions/logging.
#         # Example: Agent's 3 code is "AGN".Values are stored in model_names variable
#         # Get previous address for history
#         # If object is a group leader or driver, they don't have a related contact. They ARE the contact.

#         obj_three_code = model_names[object_type]

#         # Permission
#         # Function takes 2 parameters. User id and Object's code.
#         # Returns true if user has permission to update the object.
#         if not can_create(user.id, obj_three_code):
#             context = {"errormsg": f"You do not have permission to create a contact person for {object_type}."}
#             return Response(status=401, data=context)

#         # Get note text from front end.
#         # All Requests here
#         name = request.data['name'].strip()
#         email = request.data['email'].strip()
#         position = request.data['position'].strip()

#         tel = request.data['tel'].strip()

#         for code in country_codes:
#             if tel.startswith(code):
#                 tel = "+" + tel[:len(code)] + ' ' + tel[len(code):]

#         model = apps.get_model(app_label='webapp', model_name=object_type)

#         # Query to target specific Instance using id.
#         target_obj = model.objects.get(id=object_id)

#         # Update Object
#         try:
#             new_contact_person = Contact.objects.create(name=name, email=email, position=position, tel=tel)

#             # Write event to database
#             History.objects.create(
#                 user=user,
#                 model_name=obj_three_code,
#                 action='CRE',
#                 description=f"User added contact person to {object_type}: {target_obj.id} with name : {name}"
#             )
#             new_contact_person.save()
#         except Exception as a:
#             context['errormsg'] = a
#             return Response(data=context, status=400)
#         target_obj.contact_persons.add(new_contact_person)

#         # Serialize data
#         context['contact_persons'] = ContactSerializer(target_obj.contact_persons, many=True).data
#         return Response(data=context, status=200)


# class DeleteContactPerson(generics.UpdateAPIView):
#     """
#     URL: delete_contact_person/(?P<object_id>.*)$
#     Descr: Deletes a contact person
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request, object_id):
#         # Used to store any error messages.
#         context = {"errormsg": ''}

#         # Users token, used to get the user instance.
#         token_str = request.headers['User-Token']

#         # Get user
#         user = get_user(token_str)

#         # Model type
#         object_type = request.data['object_type'].replace(" ", "")

#         model = apps.get_model(app_label='webapp', model_name=object_type)

#         # Query to target specific Instance using id.
#         target_obj = model.objects.get(id=object_id)

#         obj_three_code = model_names[object_type]

#         if not can_delete(user.id, obj_three_code):
#             context = {"errormsg": f"You do not have permission to delete a Contact Person for {object_type}."}
#             return Response(status=401, data=context)

#         try:
#             contact_person_to_del = Contact.objects.get(id=request.data['contact_person_id'])
#             History.objects.create(
#                 user=user,
#                 model_name=obj_three_code,
#                 action='DEL',
#                 description=f'User deleted contact person of {target_obj}: \
#                     {target_obj.id} ( name was : {contact_person_to_del.name} )'
#             )
#             contact_person_to_del.delete()
#         except Exception as a:
#             context['errormsg'] = a
#             return Response(data=context, status=400)

#         # Serialize data
#         context['contact_persons'] = ContactSerializer(target_obj.contact_persons, many=True).data
#         return Response(data=context, status=200)


# class GetUsedIcons(generics.UpdateAPIView):
#     """
#     URL: get_used_icons/
#     Descr: Returns used agent icons
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def get(self, request):
#         # Used to store any error messages.
#         context = {"errormsg": ''}

#         used_icons = set([a.icon.replace("/dj_static/images/agent_icons/", '') for a in Agent.objects.all()])

#         context['used_icons'] = used_icons
#         return Response(data=context, status=200)


# class ChangeAttType(generics.UpdateAPIView):
#     """
#     URL: change_att_type/
#     Descr: Updates Attraction's type
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Get depth
#         att_type = request.data['type']

#         # Get Attraction
#         attraction = Attraction.objects.get(id=request.data['attraction_id'])

#         # Get previous depth for logging
#         previous_type = attraction.type

#         if previous_type is None:
#             previous_type = "N/A"

#         if not can_update(user.id, 'ATT'):
#             context = {"errormsg": "You do not have permission to update an attraction's type."}
#             return Response(status=401, data=context)

#         try:
#             attraction.type = att_type
#             attraction.save()

#             # Write event to database
#             History.objects.create(
#                 user=user,
#                 model_name='OFF',
#                 action='UPD',
#                 description=f"User : {user.username} updated Attraction's type from \
#                     {ATTRACTION_TYPES[previous_type]} to {ATTRACTION_TYPES[att_type]}"
#             )

#             # Serialize data
#             context['attraction'] = AttractionSerializer(attraction).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class UploadRestaurantMenu(generics.UpdateAPIView):
#     """
#     URL: upload_restaurant_menu/
#     Descr: Create Restaurant's Menu
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_create(user.id, 'RST'):
#             context = {"errormsg": "You do not have permission to create a Restaurant's Menu."}
#             return Response(status=401, data=context)

#         backend_path = '/home/cosmoplan/Group_Plan/backend/static/'

#         restaurant_id = request.data['restaurant_id']

#         # Create folder named with refcode to store the uploaded docs
#         # If it already exists, do nothing
#         Path(backend_path + 'files/restaurant_menus/' + restaurant_id + '/').mkdir(parents=True, exist_ok=True)
#         restaurant = Restaurant.objects.get(id=restaurant_id)

#         description = request.data['description'].strip()
#         price_per_person = request.data['price_per_person']
#         currency = request.data['currency']

#         if request.data['is_text'] == 'true':
#             try:
#                 new_rest_menu = RestaurantMenu.objects.create(
#                     price_per_person=price_per_person,
#                     description=description,
#                     restaurant_id=restaurant_id,
#                     currency=currency,
#                 )
#                 History.objects.create(
#                     user=user,
#                     model_name='GT',
#                     action='CRE',
#                     description=f'User : {user.username} Created a restaurant menu for restaraunt : {restaurant.name}, with description : {description}'
#                 )
#                 new_rest_menu.save()
#                 context['model'] = RestaurantSerializer(restaurant).data
#                 return Response(data=context, status=200)
#             except Exception as a:
#                 context['errormsg'] = a
#                 return Response(data=context, status=400)
#         else:
#             file = request.FILES['file']
#             extension = file.name.split('.')[-1]

#             # Validate size
#             max_size = 20971520  # 20 megabytes
#             if file.size > max_size:
#                 context['errormsg'] = 'File should not exceed 20 megabytes of data'
#                 return Response(data=context, status=400)

#             # Validate extension
#             if extension.lower() not in allowed_extensions:
#                 context['errormsg'] = f'Cannot upload .{extension} file.'
#                 return Response(data=context, status=400)

#             # If file name already exists in the system, add an underscore and counter number
#             file_name = file.name
#             counter = 1
#             while os.path.isfile('files/restaurant_menus/' + restaurant_id + '/' + str(file_name)):
#                 file_name = file.name.split('.')[0] + '_' + str(counter) + '.' + file.name.split('.')[1]
#                 counter += 1

#             # Get full path
#             full_path = backend_path + 'files/restaurant_menus/' + restaurant_id + '/' + str(file_name)

#             try:
#                 newDocument = Document.objects.create(
#                     name=file_name,
#                     type='RM',
#                     description=description,
#                     uploader_id=user.id,
#                     file=full_path,
#                     size=file.size
#                 )
#                 History.objects.create(
#                     user=user,
#                     model_name='GT',
#                     action='CRE',
#                     description=f'User : {user.username} Create a restaurant menu for restaraunt : {restaurant.name}, named : {file_name}'
#                 )
#                 newDocument.save()
#                 new_rest_menu = RestaurantMenu.objects.create(
#                     price_per_person=price_per_person,
#                     description=description,
#                     restaurant_id=restaurant_id,
#                     file_id=newDocument.id,
#                 )
#                 new_rest_menu.save()
#             except Exception as a:
#                 context['errormsg'] = a
#                 return Response(data=context, status=400)

#             path = backend_path + 'files/restaurant_menus/' + restaurant_id + '/' + file_name
#             dest = open(path, 'wb+')

#             # Write it to \files\group_documents\<group_refcode>\<file_name>
#             if file.multiple_chunks:
#                 for c in file.chunks():
#                     dest.write(c)
#             else:
#                 dest.write(file.read())
#             dest.close()
#             context['model'] = RestaurantSerializer(restaurant).data
#             return Response(data=context, status=200)


# class DeleteRestaurantMenu(generics.UpdateAPIView):
#     """
#     URL: delete_restaurant_menu/(?P<refcode>.*)$
#     Descr: deletes a restaurant's menu, if file exists, it removes it from file system
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)
#         context = {"errormsg": ''}

#         # Permission
#         if not can_delete(user.id, 'RST'):
#             context = {"errormsg": "You do not have permission to delete a Restaurant's Menu"}
#             return Response(status=401, data=context)

#         # Get Group
#         restaurant_menu = RestaurantMenu.objects.get(id=request.data['menu_id'])
#         restaurant = Restaurant.objects.get(id=request.data['restaurant_id'])

#         if restaurant_menu.file_id is not None:
#             # Get document
#             document_id = request.data['document_id']
#             document_name = request.data['document_name']
#             backend_path = '/home/cosmoplan/Group_Plan/backend/static/'

#             # Get full path to be able to remove it
#             full_path = backend_path + 'files/restaurant_menus/' + str(restaurant.id) + '/'
#             os.remove(full_path + document_name)
#             try:
#                 document_to_delete = Document.objects.get(id=document_id)
#                 History.objects.create(
#                     user=user,
#                     model_name='RST',
#                     action='DEL',
#                     description=f'User : {user.username} deleted restaurant menu with description: {restaurant_menu.description} of restaurant: {restaurant.name}'
#                 )
#                 document_to_delete.delete()
#                 restaurant_menu.delete()
#             except Exception as a:
#                 context['errormsg'] = a
#                 return Response(data=context, status=400)
#             context['model'] = RestaurantSerializer(restaurant).data
#             return Response(data=context, status=200)
#         else:
#             try:
#                 History.objects.create(
#                     user=user,
#                     model_name='RST',
#                     action='DEL',
#                     description=f'User : {user.username} deleted restaurant menu with description: {restaurant_menu.description} of restaurant: {restaurant.name}'
#                 )
#                 restaurant_menu.delete()
#             except Exception as a:
#                 context['errormsg'] = a
#                 return Response(data=context, status=400)
#             context['model'] = RestaurantSerializer(restaurant).data
#             return Response(data=context, status=200)


# class DownloadRestaurantMenu(generics.ListAPIView):
#     """
#     URL: /download_restaurant_menu/
#     Downloads group document
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def get(self, request, restaurant_id):
#         backend_path = '/home/cosmoplan/Group_Plan/backend/static/'
#         file = request.GET.get('file')
#         full_path = backend_path + 'files/restaurant_menus/' + str(restaurant_id) + '/' + str(file)
#         f = open(full_path, 'rb')
#         file_contents = f.read()
#         f.close()
#         temp = HttpResponse(file_contents, content_type='multipart/form-data')
#         temp['Content-Disposition'] = "attachment; filename*=utf-8''{}".format(escape_uri_path(file))
#         return temp


# class ChangeCapacity(generics.ListAPIView):
#     """
#     URL: /change_capacity/
#     Updates Restaurant's Capacity
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):

#         # Used to store any error messages.
#         context = {"errormsg": ''}

#         # Users token, used to get the user instance.
#         token_str = request.headers['User-Token']

#         # Get user
#         user = get_user(token_str)

#         if not can_update(user.id, 'RST'):
#             context = {
#                 "errormsg": "You do not have permission to update restaurant's capacity."
#             }
#             return Response(status=401, data=context)

#         # Get new address from front end.
#         capacity = request.data['capacity'].strip()

#         # Update Object
#         restaurant = Restaurant.objects.get(id=request.data['object_id'])
#         try:
#             restaurant.capacity = capacity
#             restaurant.save()

#             # Write event to database
#             History.objects.create(
#                 user=user,
#                 model_name='RST',
#                 action='UPD',
#                 description=f"User : {user.username} updated restaurant's {restaurant.name} capacity"
#             )

#             # Return Object's data to update front end's state.
#             context['object'] = RestaurantSerializer(restaurant).data
#             # If everything went smooth, return 200 status
#             return Response(data=context, status=status.HTTP_200_OK)

#         # If anything went wrong, return 400
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeGPSDataSimCard(generics.UpdateAPIView):
#     """
#     URL: change_gps_data_sim_card/
#     Descr: Updates coach's GPS Data Sim Card
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'CO'):
#             context = {"errormsg": "You do not have permission to update Coach's Data Sim Card."}
#             return Response(status=401, data=context)

#         try:
#             # Get body number
#             gps_data_sim_card = request.data['gps_data_sim_card'].strip()

#             # Get coach
#             coach = Coach.objects.get(id=request.data['coach_id'])
#         except Exception as exc:
#             context['errormsg'] = exc
#             return HttpResponse(status=400)

#         # Get previous plate number for logging
#         previous_gps_data_sim_card = coach.gps_data_sim_card

#         try:
#             coach.gps_data_sim_card = gps_data_sim_card
#             coach.save()
#             History.objects.create(
#                 user=user,
#                 model_name='CO',
#                 action='UPD',
#                 description=f"User : {user.username} updated coach's (id: {coach.id}) GPS Data Sim Card from \
#                     {previous_gps_data_sim_card} to {gps_data_sim_card}"
#             )

#             # Serialize data
#             context['coach'] = CoachSerializer(coach).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeIMEI(generics.UpdateAPIView):
#     """
#     URL: change_imei/
#     Descr: Updates coach's IMEI
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'CO'):
#             context = {"errormsg": "You do not have permission to update IMEI."}
#             return Response(status=401, data=context)

#         try:
#             # Get body number
#             imei = request.data['imei']

#             # Get coach
#             coach = Coach.objects.get(id=request.data['coach_id'])
#         except Exception as exc:
#             context['errormsg'] = exc
#             return HttpResponse(status=400)

#         # Get previous plate number for logging
#         previous_imei = coach.imei

#         try:
#             coach.imei = imei
#             coach.save()
#             History.objects.create(
#                 user=user,
#                 model_name='CO',
#                 action='UPD',
#                 description=f"User : {user.username} updated coach's (id: {coach.id}) IMEI from \
#                     {previous_imei} to {imei}"
#             )

#             # Serialize data
#             context['coach'] = CoachSerializer(coach).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeCurrency(generics.UpdateAPIView):
#     """
#     URL: change_currency/
#     Descr: Updates Contract's Currency
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'CNT'):
#             context = {"errormsg": "You do not have permission to update a Contract's Currency."}
#             return Response(status=401, data=context)

#         try:
#             # Get currency
#             currency = request.data['currency'].strip()
#             # Get Contract
#             contract = Contract.objects.get(id=request.data['contract_id'])
#         except Exception as exc:
#             context['errormsg'] = exc
#             return HttpResponse(status=400)

#         # Get previous currency for logging
#         previous_currency = contract.currency
#         try:
#             contract.currency = currency
#             contract.save()
#             History.objects.create(
#                 user=user,
#                 model_name='CNT',
#                 action='UPD',
#                 description=f"User : {user.username} updated contract's currency from {previous_currency} to {currency}"
#             )

#             # Serialize data
#             context['contract'] = ContractSerializer(contract).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangePeriod(generics.UpdateAPIView):
#     """
#     URL: change_period/
#     Descr: Updates Contract's Period
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'CNT'):
#             context = {"errormsg": "You do not have permission to update a Contract's Period."}
#             return Response(status=401, data=context)

#         contract = Contract.objects.get(id=request.data['contract_id'])
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

#         # Get previous period for logging
#         previous_period = contract.period
#         try:
#             contract.period = periods_str

#             all_rooms = Room.objects.filter(contract_id=contract.id)

#             # For now our only validation is if the contract has any used room, return 400
#             for room in all_rooms:
#                 if not room.available:
#                     context['errormsg'] = "This contract contains rooms which cannot be deleted. Therefore You cannot change the Contract's Period."
#                     return Response(data=context, status=400)

#             # Delete all previous rooms related to contract.
#             # Add the new ones.
#             # what if rooms are reserved? we shouldn't delete them in that case
#             for room in Room.objects.filter(contract_id=contract.id):
#                 room.delete()

#             # Print the list of unique dates
#             # if the period is like this : 1) 20/07/2023 - 28/07/2023 / 2) 03/08/2023 - 25/08/2023
#             # This function does not include 28/07 and 25/08

#             for day_data in unique_dates_and_rooms:
#                 rstatus = contract.status
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
#                 model_name='CNT',
#                 action='UPD',
#                 description=f"User : {user.username} updated contract's period from {previous_period} to {periods_str}"
#             )

#             # Serialize data
#             context['contract'] = ContractSerializer(contract).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeStatus(generics.UpdateAPIView):
#     """
#     URL: change_status/
#     Descr: Updates Contract's Status
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'CNT'):
#             context = {"errormsg": "You do not have permission to update a Contract's Status."}
#             return Response(status=401, data=context)

#         try:
#             # Get status
#             cstatus = request.data['status']
#             # Get Contract
#             contract = Contract.objects.get(id=request.data['contract_id'])
#         except Exception as exc:
#             context['errormsg'] = exc
#             return HttpResponse(status=400)

#         # Get previous status for logging
#         previous_status = contract.status
#         try:
#             contract.status = cstatus
#             contract.save()

#             if cstatus:
#                 # enable all rooms
#                 for room in Room.objects.filter(contract_id=contract.id):
#                     room.enabled = True
#                     room.save()
#             else:
#                 for room in Room.objects.filter(contract_id=contract.id):
#                     room.enabled = False
#                     room.save()

#             History.objects.create(
#                 user=user,
#                 model_name='CNT',
#                 action='UPD',
#                 description=f"User : {user.username} updated contract's status from {previous_status} to {cstatus}"
#             )

#             # Serialize data
#             context['contract'] = ContractSerializer(contract).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class DownloadContractDocument(generics.ListAPIView):
#     """
#     URL: download_contract_document/
#     Descr: Downloads contract's document
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def get(self, request, contract_id):
#         # Get current working directory
#         backend_path = '/home/cosmoplan/Group_Plan/backend/static/'

#         # Get file
#         file = request.GET.get('file')
#         full_path = backend_path + 'files/data_management/contracts/' + contract_id + '/' + str(file)

#         # Open file
#         f = open(full_path, 'rb')

#         # Read it
#         file_contents = f.read()
#         f.close()

#         # Serve it to front
#         temp = HttpResponse(file_contents, content_type='multipart/form-data')
#         temp['Content-Disposition'] = 'attachment; filename=' + str(file)
#         return temp


# class UploadContractDocument(generics.ListCreateAPIView):
#     """
#     URL: upload_contract_document/
#     Descr: Uploads document for contract
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)
#         context = {"errormsg": ''}

#         # Permission
#         if not can_create(user.id, 'CNT'):
#             context = {"errormsg": "You do not have permission to create a Contract document."}
#             return Response(status=401, data=context)

#         # Get current working directory
#         backend_path = '/home/cosmoplan/Group_Plan/backend/static/'

#         # Get contract
#         contract_id = request.data['contract_id']
#         contract = Contract.objects.get(id=contract_id)

#         # Create folder named with contract_id to store the uploaded docs
#         # If it already exists, do nothing
#         Path(backend_path + 'files/data_management/contracts/' + contract_id + '/').mkdir(
#             parents=True,
#             exist_ok=True
#         )

#         # Get file
#         file = request.FILES['file']

#         # Get extension
#         extension = file.name.split('.')[-1]

#         # Validate size
#         max_size = 20971520  # 20 megabytes
#         if file.size > max_size:
#             context['errormsg'] = 'File should not exceed 20 megabytes of data'
#             return Response(data=context, status=400)

#         # Validate extension
#         if extension not in allowed_extension_documents:
#             context['errormsg'] = f'Cannot upload .{extension} file.'
#             return Response(data=context, status=400)
#         file_name = file.name
#         full_path = 'files/data_management/contracts/' + contract_id + '/' + str(file_name)
#         try:
#             newDocument = Document.objects.create(
#                 name=file_name,
#                 uploader_id=user.id,
#                 file=full_path,
#                 size=file.size,
#             )
#             History.objects.create(
#                 user=user,
#                 model_name='CNT',
#                 action='CRE',
#                 description=f"User : {user.username} uploaded contract's ({contract.name}) file with name: ({newDocument.name})"
#             )
#             newDocument.save()
#         except Exception as a:
#             context['errormsg'] = a
#             return Response(data=context, status=400)
#         contract.document_id = newDocument.id
#         contract.save()

#         dest = open(backend_path + full_path, 'wb+')
#         # Write it to \files\group_documents\<group_refcode>\<file_name>
#         if file.multiple_chunks:
#             for c in file.chunks():
#                 dest.write(c)
#         else:
#             dest.write(file.read())
#         dest.close()
#         return Response(file_name, status.HTTP_201_CREATED)


# class DeleteContractDocument(generics.UpdateAPIView):
#     """
#     URL: delete_contract_document/
#     Descr: Deletes contract's document
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)
#         context = {"errormsg": ''}

#         # Permission
#         if not can_delete(user.id, 'CNT'):
#             context = {"errormsg": "You do not have permission to delete a Contract's document."}
#             return Response(status=401, data=context)

#         # Get contract
#         contract_id = request.data['contract_id']
#         contract = Contract.objects.get(id=contract_id)

#         # Get document
#         document_id = request.data['document_id']
#         document_name = request.data['document_name']

#         # Get current working directory
#         backend_path = '/home/cosmoplan/Group_Plan/backend/static/'
#         full_path = backend_path + 'files/data_management/contracts/' + str(contract_id) + '/'

#         try:
#             os.remove(full_path + document_name)
#         except Exception as a:
#             print(a)

#         try:
#             History.objects.create(
#                 user=user,
#                 model_name='CNT',
#                 action='DEL',
#                 description=f"User : {user.username} deleted contract's ({contract.name}) filename: ({document_name})"
#             )

#             contract.document_id = None
#             contract.save()

#             from django.db import connection
#             cursor = connection.cursor()
#             cursor.execute("delete from webapp_document where id = " + str(document_id))

#         except Exception as a:
#             context['errormsg'] = a
#             return Response(data=context, status=400)

#         # Serialize data
#         context['contract'] = ContractSerializer(contract).data
#         return Response(data=context, status=200)


# class ChangeReleasePeriod(generics.UpdateAPIView):
#     """
#     URL: change_release_period/
#     Descr: Updates Contract's Release Period
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'CNT'):
#             context = {"errormsg": "You do not have permission to update a Contract's Release Period."}
#             return Response(status=401, data=context)

#         try:
#             # Get release_period
#             release_period = request.data['release_period']
#             # Get Contract
#             contract = Contract.objects.get(id=request.data['contract_id'])
#         except Exception as exc:
#             context['errormsg'] = exc
#             return HttpResponse(status=400)

#         # Get previous release_period for logging
#         previous_release_period = contract.release_period
#         try:
#             contract.release_period = release_period
#             contract.save()
#             History.objects.create(
#                 user=user,
#                 model_name='CNT',
#                 action='UPD',
#                 description=f"User : {user.username} updated contract's release_period from {previous_release_period} to {release_period}"
#             )

#             # Serialize data
#             context['contract'] = ContractSerializer(contract).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeCancellationLimit(generics.UpdateAPIView):
#     """
#     URL: change_cancellation_limit/
#     Descr: Updates Contract's Cancellation Limit
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'CNT'):
#             context = {"errormsg": "You do not have permission to update a Contract's Cancellation Limit."}
#             return Response(status=401, data=context)

#         try:
#             # Get cancellation_limit
#             cancellation_limit = request.data['cancellation_limit']
#             # Get Contract
#             contract = Contract.objects.get(id=request.data['contract_id'])
#         except Exception as exc:
#             context['errormsg'] = exc
#             return HttpResponse(status=400)

#         # Get previous cancellation_limit for logging
#         previous_cancellation_limit = contract.cancellation_limit
#         try:
#             contract.cancellation_limit = cancellation_limit
#             contract.save()
#             History.objects.create(
#                 user=user,
#                 model_name='CNT',
#                 action='UPD',
#                 description=f"User : {user.username} updated contract's cancellation limit from {previous_cancellation_limit} to {cancellation_limit}"
#             )

#             # Serialize data
#             context['contract'] = ContractSerializer(contract).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeCancellationCharge(generics.UpdateAPIView):
#     """
#     URL: change_cancellation_charge/
#     Descr: Updates Contract's Cancellation Charge
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'CNT'):
#             context = {"errormsg": "You do not have permission to update a Contract's Cancellation Charge."}
#             return Response(status=401, data=context)

#         try:
#             # Get cancellation_charge
#             cancellation_charge = request.data['cancellation_charge']
#             # Get Contract
#             contract = Contract.objects.get(id=request.data['contract_id'])
#         except Exception as exc:
#             context['errormsg'] = exc
#             return HttpResponse(status=400)

#         # Get previous cancellation_charge for logging
#         previous_cancellation_charge = contract.cancellation_charge
#         try:
#             contract.cancellation_charge = cancellation_charge
#             contract.save()
#             History.objects.create(
#                 user=user,
#                 model_name='CNT',
#                 action='UPD',
#                 description=f"User : {user.username} updated contract's cancellation charge from {previous_cancellation_charge} to {cancellation_charge}"
#             )

#             # Serialize data
#             context['contract'] = ContractSerializer(contract).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeInfantAge(generics.UpdateAPIView):
#     """
#     URL: change_infant_age/
#     Descr: Updates Contract's Infant Age
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'CNT'):
#             context = {"errormsg": "You do not have permission to update a Contract's Infant Age."}
#             return Response(status=401, data=context)

#         try:
#             # Get infant_age
#             infant_age = request.data['infant_age'].strip()
#             # Get Contract
#             contract = Contract.objects.get(id=request.data['contract_id'])
#         except Exception as exc:
#             context['errormsg'] = exc
#             return HttpResponse(status=400)

#         # Get previous infant_age for logging
#         previous_infant_age = contract.infant_age
#         try:
#             contract.infant_age = infant_age
#             contract.save()
#             History.objects.create(
#                 user=user,
#                 model_name='CNT',
#                 action='UPD',
#                 description=f"User : {user.username} updated contract's cancellation charge from {previous_infant_age} to {infant_age}"
#             )

#             # Serialize data
#             context['contract'] = ContractSerializer(contract).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeChildAge(generics.UpdateAPIView):
#     """
#     URL: change_child_age/
#     Descr: Updates Contract's Child Age
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'CNT'):
#             context = {"errormsg": "You do not have permission to update a Contract's Child Age."}
#             return Response(status=401, data=context)

#         try:
#             # Get child_age
#             child_age = request.data['child_age'].strip()
#             # Get Contract
#             contract = Contract.objects.get(id=request.data['contract_id'])
#         except Exception as exc:
#             context['errormsg'] = exc
#             return HttpResponse(status=400)

#         # Get previous child_age for logging
#         previous_child_age = contract.child_age
#         try:
#             contract.child_age = child_age
#             contract.save()
#             History.objects.create(
#                 user=user,
#                 model_name='CNT',
#                 action='UPD',
#                 description=f"User : {user.username} updated contract's cancellation charge from {previous_child_age} to {child_age}"
#             )

#             # Serialize data
#             context['contract'] = ContractSerializer(contract).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangePricing(generics.UpdateAPIView):
#     """
#     URL: change_pricing/
#     Descr: Updates Contract's Pricing
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'CNT'):
#             context = {"errormsg": "You do not have permission to update a Contract's Pricing."}
#             return Response(status=401, data=context)

#         try:
#             # Get pricing
#             pricing = request.data['pricing'].strip()
#             # Get Contract
#             contract = Contract.objects.get(id=request.data['contract_id'])
#         except Exception as exc:
#             context['errormsg'] = exc
#             return HttpResponse(status=400)

#         # Get previous pricing for logging
#         previous_pricing = contract.pricing
#         try:
#             contract.pricing = pricing
#             contract.save()
#             History.objects.create(
#                 user=user,
#                 model_name='CNT',
#                 action='UPD',
#                 description=f"User : {user.username} updated contract's cancellation charge from {previous_pricing} to {pricing}"
#             )

#             # Serialize data
#             context['contract'] = ContractSerializer(contract).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeInclusiveBoard(generics.UpdateAPIView):
#     """
#     URL: change_inclusive_board/
#     Descr: Updates Contract's Inclusive Board
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'CNT'):
#             context = {"errormsg": "You do not have permission to update a Contract's Inclusive Board."}
#             return Response(status=401, data=context)

#         try:
#             # Get inclusive_board
#             inclusive_board = request.data['inclusive_board'].strip()
#             # Get Contract
#             contract = Contract.objects.get(id=request.data['contract_id'])
#         except Exception as exc:
#             context['errormsg'] = exc
#             return HttpResponse(status=400)

#         # Get previous inclusive_board for logging
#         previous_inclusive_board = contract.inclusive_board
#         try:
#             contract.inclusive_board = inclusive_board
#             contract.save()
#             History.objects.create(
#                 user=user,
#                 model_name='CNT',
#                 action='UPD',
#                 description=f"User : {user.username} updated contract's cancellation charge from {previous_inclusive_board} to {inclusive_board}"
#             )

#             # Serialize data
#             context['contract'] = ContractSerializer(contract).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeCityTaxes(generics.UpdateAPIView):
#     """
#     URL: change_city_taxes/
#     Descr: Updates Contract's City Taxes
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'CNT'):
#             context = {"errormsg": "You do not have permission to update a Contract's City Taxes."}
#             return Response(status=401, data=context)

#         try:
#             # Get city_taxes
#             city_taxes_included = request.data['city_taxes_included']
#             # Get Contract
#             contract = Contract.objects.get(id=request.data['contract_id'])
#         except Exception as exc:
#             context['errormsg'] = exc
#             return HttpResponse(status=400)

#         # Get previous city_taxes for logging
#         previous_city_taxes = contract.city_taxes_included
#         try:
#             contract.city_taxes_included = city_taxes_included
#             contract.save()
#             History.objects.create(
#                 user=user,
#                 model_name='CNT',
#                 action='UPD',
#                 description=f"User : {user.username} updated contract's City Taxes Included field from {previous_city_taxes} to {city_taxes_included}"
#             )

#             # Serialize data
#             context['contract'] = ContractSerializer(contract).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeNumberOfRooms(generics.UpdateAPIView):
#     """
#     URL: change_number_of_rooms/
#     Descr: Updates Contract's Room Entries
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'CNT'):
#             context = {"errormsg": "You do not have permission to update a Contract's Rooms."}
#             return Response(status=401, data=context)

#         try:
#             # Get Contract
#             contract = Contract.objects.get(id=request.data['contract_id'])

#             # Get Period
#             period = request.data['period']

#             # Get Room Type
#             room_type = request.data['room_type']

#             # Get Number Of Rooms
#             number_of_rooms = request.data['number_of_rooms']

#             all_rooms = Room.objects.filter(contract_id=contract.id, date__in=get_unique_dates(period), enabled=True, room_type=room_type)

#             # 1st validation, if any room is not available, return 400
#             for room in all_rooms:
#                 if not room.available:
#                     context['errormsg'] = f'You cannot change the number of {room_type} rooms of this contract because there are {room_type} rooms used in this period.'
#                     return Response(data=context, status=400)

#             # if validations are ok, delete previous rooms.
#             for room in all_rooms:
#                 room.delete()

#             for date in get_unique_dates(period):
#                 for i in range(int(number_of_rooms)):
#                     Room.objects.create(room_type=room_type, date=date, contract=contract, enabled=True)

#         except Exception as exc:
#             context['errormsg'] = exc
#             return HttpResponse(status=400)

#         try:
#             History.objects.create(
#                 user=user,
#                 model_name='CNT',
#                 action='UPD',
#                 description=f"User : {user.username} updated contract's ({contract.id}) {room_type} rooms to : {number_of_rooms}"
#             )
#             contract.save()

#             # Serialize data
#             context['contract'] = ContractSerializer(contract).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class StopSales(generics.UpdateAPIView):
#     """
#     URL: stop_sales/
#     Descr: Updates Contract's Room status
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'CNT'):
#             context = {"errormsg": "You do not have permission to update a Contract's Room Status."}
#             return Response(status=401, data=context)

#         contract = Contract.objects.get(id=request.data['contract_id'])
#         stop_all_rooms = request.data['stop_all_rooms']

#         all_rooms = Room.objects.filter(contract_id=contract.id, available=True, )

#         if stop_all_rooms:
#             for room in all_rooms:
#                 room.enabled = False
#                 room.save()

#             History.objects.create(
#                 user=user,
#                 model_name='CNT',
#                 action='UPD',
#                 description=f"User : {user.username} Stopped sales for all rooms of contract {contract.name}"
#             )
#             # Serialize data
#             context['contract'] = ContractSerializer(contract).data
#             return Response(data=context, status=status.HTTP_200_OK)

#         try:
#             # Serialize data
#             context['contract'] = ContractSerializer(contract).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class EditPaymentDetails(generics.UpdateAPIView):
#     """
#     URL: change_payment_details/
#     Descr: Changes object's payment Details
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):

#         # Used to store any error messages.
#         context = {"errormsg": ''}

#         # Users token, used to get the user instance.
#         token_str = request.headers['User-Token']

#         # Get user
#         user = get_user(token_str)

#         # Model type
#         object_type = request.data['object_type'].replace(" ", "")

#         # Get Model class instance
#         if object_type == 'GroupLeader' or object_type == 'Driver':
#             object_type = 'Contact'

#         model = apps.get_model(app_label='webapp', model_name=object_type)

#         # Query to target specific Instance using id.
#         target_obj = model.objects.get(id=request.data['object_id'])

#         # Get Models 3 char code, used for permissions/logging.
#         # Example: Agent's 3 code is "AGN".Values are stored in model_names variable
#         if request.data['object_type'] == 'Driver':
#             obj_three_code = 'DRV'
#         elif request.data['object_type'] == 'Group Leader':
#             obj_three_code = 'GL'
#         else:
#             obj_three_code = model_names[object_type]

#         # Permission
#         # Function takes 2 parameters. User id and Object's code.
#         # Returns true if user has permission to update the object.
#         if not can_update(user.id, obj_three_code):
#             context = {"errormsg": f"You do not have permission to update {object_type}'s name."}
#             return Response(status=401, data=context)

#         # Get new name from front end.
#         company = request.data['company'].strip()
#         currency = request.data['currency'].strip()
#         iban = request.data['iban'].strip()
#         swift = request.data['swift'].strip()

#         # Update Object
#         try:
#             target_obj.payment_details.company = company
#             target_obj.payment_details.currency = currency
#             target_obj.payment_details.iban = iban
#             target_obj.payment_details.swift = swift
#             target_obj.payment_details.save()

#             # Write event to database
#             History.objects.create(
#                 user=user,
#                 model_name=obj_three_code,
#                 action='UPD',
#                 description=f"User : {user.username} updated {object_type}'s payment details."
#             )

#             # Return Object's data to update front end's state.
#             context['model'] = get_serializer(object_type, target_obj)
#             # If everything went smooth, return 200 status
#             return Response(data=context, status=status.HTTP_200_OK)

#         # If anything went wrong, return 400
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class DeleteHotelCategory(generics.UpdateAPIView):
#     """
#     URL: delete_hotel_category/
#     Descr: Deletes a Hotel Category
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission user id 88 = boss
#         if not can_delete(user.id, 'HTL') or user.id != 88:
#             context = {"errormsg": "You do not have permission to delete a Hotel Category."}
#             return Response(status=401, data=context)

#         try:
#             hc_id = request.data['hc_id']
#             hotel_category = HotelCategory.objects.get(id=hc_id)
#             hotel = Hotel.objects.get(id=request.data['object_id'])
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)

#         try:
#             History.objects.create(
#                 user=user,
#                 model_name='AP',
#                 action='DEL',
#                 description=f"User : {user.username} deleted Hotel Category with name {hotel_category.name}"
#             )

#             hotel_category.delete()
#             # Serialize data
#             context['object'] = HotelSerializer(hotel).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class UpdateHotelCategories(generics.ListCreateAPIView):
#     """
#     URL: change_hotel_categories/
#     Descr: Updates Hotel's Categories
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'HTL'):
#             context = {"errormsg": "You do not have permission to update a Hotel's Categories."}
#             return Response(status=401, data=context)

#         # Get hotel
#         hotel_id = request.data['object_id']
#         hotel = Hotel.objects.get(id=hotel_id)
#         hotel_categories = request.data['hotel_categories']

#         # Get hotel's Categories
#         try:
#             for hc in hotel.categories.all():
#                 hotel.categories.remove(hc)

#             for hc in hotel_categories:
#                 hotel.categories.add(HotelCategory.objects.get(id=hc['id']))

#             hotel.save()

#             History.objects.create(
#                 user=user,
#                 model_name='HTL',
#                 action='UPD',
#                 description=f"User : {user.username} updated hotel's ({hotel.name}) Categories"
#             )
#             # Serialize data
#             context['object'] = HotelSerializer(hotel).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangePriority(generics.UpdateAPIView):
#     """
#     URL: change_priority/
#     Descr: Changes object's priority
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         # Used to store any error messages.
#         context = {"errormsg": ''}

#         # Users token, used to get the user instance.
#         token_str = request.headers['User-Token']

#         # Get user
#         user = get_user(token_str)

#         # Model type
#         object_type = request.data['object_type'].replace(" ", "")

#         # Get Model class instance
#         if object_type == 'GroupLeader' or object_type == 'Driver':
#             object_type = 'Contact'

#         model = apps.get_model(app_label='webapp', model_name=object_type)

#         # Query to target specific Instance using id.
#         target_obj = model.objects.get(id=request.data['object_id'])

#         # Get Models 3 char code, used for permissions/logging.
#         # Example: Agent's 3 code is "AGN".Values are stored in model_names variable
#         # Get previous priority for history
#         # If object is a group leader or driver, they don't have a related contact. They ARE the contact.
#         obj_three_code = model_names[object_type]
#         previous_priority = target_obj.priority

#         # Permission
#         # Function takes 2 parameters. User id and Object's code.
#         # Returns true if user has permission to update the object.
#         if not can_update(user.id, obj_three_code):
#             context = {"errormsg": f"You do not have permission to update {object_type}'s priority."}
#             return Response(status=401, data=context)

#         # Get new address from front end.
#         priority = request.data['object_priority']

#         if priority == '':
#             priority = None
#         # Update Object
#         try:
#             target_obj.priority = priority
#             target_obj.save()

#             # Write event to database
#             History.objects.create(
#                 user=user,
#                 model_name=obj_three_code,
#                 action='UPD',
#                 description=f"User : {user.username} updated {object_type}'s priority from {previous_priority} to {priority}"
#             )

#             # Return Object's data to update front end's state.
#             context['object'] = get_serializer(object_type, target_obj)
#             # If everything went smooth, return 200 status
#             return Response(data=context, status=status.HTTP_200_OK)

#         # If anything went wrong, return 400
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeHotelNumberOfRooms(generics.UpdateAPIView):
#     """
#     URL: change_hotel_number_of_rooms/
#     Descr: Changes object's number of rooms
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         # Used to store any error messages.
#         context = {"errormsg": ''}

#         # Users token, used to get the user instance.
#         token_str = request.headers['User-Token']

#         # Get user
#         user = get_user(token_str)

#         # Model type
#         object_type = request.data['object_type'].replace(" ", "")

#         # Get Model class instance
#         if object_type == 'GroupLeader' or object_type == 'Driver':
#             object_type = 'Contact'

#         model = apps.get_model(app_label='webapp', model_name=object_type)

#         # Query to target specific Instance using id.
#         target_obj = model.objects.get(id=request.data['object_id'])

#         # Get Models 3 char code, used for permissions/logging.
#         # Example: Agent's 3 code is "AGN".Values are stored in model_names variable
#         # Get previous number_of_rooms for history
#         # If object is a group leader or driver, they don't have a related contact. They ARE the contact.
#         obj_three_code = model_names[object_type]
#         previous_number_of_rooms = target_obj.number_of_rooms

#         # Permission
#         # Function takes 2 parameters. User id and Object's code.
#         # Returns true if user has permission to update the object.
#         if not can_update(user.id, obj_three_code):
#             context = {"errormsg": f"You do not have permission to update {object_type}'s number_of_rooms."}
#             return Response(status=401, data=context)

#         # Get new address from front end.
#         number_of_rooms = request.data['object_number_of_rooms']

#         if number_of_rooms == '':
#             number_of_rooms = None
#         # Update Object
#         try:
#             target_obj.number_of_rooms = number_of_rooms
#             target_obj.save()

#             # Write event to database
#             History.objects.create(
#                 user=user,
#                 model_name=obj_three_code,
#                 action='UPD',
#                 description=f"User : {user.username} updated {object_type}'s number_of_rooms from {previous_number_of_rooms} to {number_of_rooms}"
#             )

#             # Return Object's data to update front end's state.
#             context['object'] = get_serializer(object_type, target_obj)
#             # If everything went smooth, return 200 status
#             return Response(data=context, status=status.HTTP_200_OK)

#         # If anything went wrong, return 400
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeMarkup(generics.ListAPIView):
#     """
#     URL: change_parent_markup/(?P<rtype>continent|country|state|city|area)/(?P<region_id>.+)$
#     Descr: Change Region's Markup
#     """

#     # Cross site request forgery
#     @csrf_exempt
#     def post(self, request, rtype, region_id):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'PLC'):
#             context = {"errormsg": "You do not have permission to view a Region."}
#             return Response(status=401, data=context)

#         if rtype == 'continent':
#             region = Continent.objects.get(id=region_id)
#             region.markup = request.data['markup']
#             region.save()
#             context['object'] = ContinentSerializer(region).data

#         elif rtype == 'country':
#             region = Country.objects.get(id=region_id)
#             region.markup = request.data['markup']
#             region.save()
#             context['object'] = CountrySerializer(region).data

#         elif rtype == 'state':
#             region = State.objects.get(id=region_id)
#             region.markup = request.data['markup']
#             region.save()
#             context['object'] = StateSerializer(region).data

#         elif rtype == 'city':
#             region = City.objects.get(id=region_id)
#             region.markup = request.data['markup']
#             region.save()
#             context['object'] = CitySerializer(region).data

#         elif rtype == 'area':
#             region = Area.objects.get(id=region_id)
#             region.markup = request.data['markup']
#             region.save()
#             context['object'] = AreaSerializer(region).data

#         return Response(data=context, status=200)


# class ChangeParentRegion(generics.ListAPIView):
#     """
#     URL: change_parent_region/(?P<rtype>continent|country|state|city|area)/(?P<region_id>.+)$
#     Descr: Change Region's Parent
#     """

#     # Cross site request forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_view(user.id, 'PLC'):
#             context = {"errormsg": "You do not have permission to view a Region."}
#             return Response(status=401, data=context)

#         rtype = request.data['object_type']
#         region_id = request.data['region_id']

#         if rtype == 'continent':
#             region = Continent.objects.get(id=region_id)
#             context['object'] = ContinentSerializer(region).data
#             return Response(data=context, status=200)

#         elif rtype == 'country':
#             region = Country.objects.get(id=region_id)
#             region.continent = Continent.objects.get(name=request.data['continent'])
#             region.save()
#             context['object'] = CountrySerializer(region).data

#         elif rtype == 'state':
#             region = State.objects.get(id=region_id)
#             region.country = Country.objects.get(name=request.data['country'])
#             region.save()
#             context['object'] = StateSerializer(region).data

#         elif rtype == 'city':
#             country_or_state = request.data['country_or_state']
#             region = City.objects.get(id=region_id)

#             if country_or_state == 'country':
#                 region.country = Country.objects.get(name=request.data['country'])
#                 region.state = None
#             else:
#                 region.state = State.objects.get(name=request.data['state'])
#                 region.country = None

#             region.save()
#             context['object'] = CitySerializer(region).data

#         elif rtype == 'area':
#             region = Area.objects.get(id=region_id)
#             region.city = City.objects.get(name=request.data['city'])
#             region.save()
#             context['object'] = AreaSerializer(region).data

#         return Response(data=context, status=200)


# class ChangeRegion(generics.UpdateAPIView):
#     """
#     URL: change_region/
#     Descr: Changes object's region
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):

#         # Used to store any error messages.
#         context = {"errormsg": ''}

#         # Users token, used to get the user instance.
#         token_str = request.headers['User-Token']

#         # Get user
#         user = get_user(token_str)

#         # Model type
#         object_type = request.data['object_type'].replace(" ", "")

#         # Get Model class instance
#         if object_type == 'GroupLeader' or object_type == 'Driver':
#             object_type = 'Contact'

#         model = apps.get_model(app_label='webapp', model_name=object_type)

#         # Query to target specific Instance using id.
#         if object_type == 'Airport':
#             target_obj = model.objects.get(name=request.data['object_id'])
#         else:
#             target_obj = model.objects.get(id=request.data['object_id'])

#         # Get Models 3 char code, used for permissions/logging.
#         # Example: Agent's 3 code is "AGN".Values are stored in model_names variable
#         # Get previous address for history
#         # If object is a group leader or driver, they don't have a related contact. They ARE the contact.
#         if request.data['object_type'] == 'Driver':
#             obj_three_code = 'DRV'
#         elif request.data['object_type'] == 'Group Leader':
#             obj_three_code = 'GL'
#         else:
#             obj_three_code = model_names[object_type]

#         # Permission
#         # Function takes 2 parameters. User id and Object's code.
#         # Returns true if user has permission to update the object.
#         if not can_update(user.id, obj_three_code):
#             context = {"errormsg": f"You do not have permission to update {object_type}'s address."}
#             return Response(status=401, data=context)

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

#         # Update Object
#         try:
#             target_obj.region = region_str
#             if obj_three_code == 'AGN':
#                 try:
#                     target_obj.nationality_id = Country.objects.get(name=country).id
#                 except Exception:
#                     pass
#             target_obj.save()

#             # Write event to database
#             History.objects.create(
#                 user=user,
#                 model_name=obj_three_code,
#                 action='UPD',
#                 description=f"User : {user.username} updated {object_type}'s region to {region_str}"
#             )

#             # Return Object's data to update front end's state.
#             if object_type == 'EntertainmentProduct':
#                 context['object'] = get_serializer(object_type, EntertainmentSupplier.objects.get(id=target_obj.entertainment_supplier_id))
#             else:
#                 context['object'] = get_serializer(object_type, target_obj)
#             # If everything went smooth, return 200 status
#             return Response(data=context, status=status.HTTP_200_OK)

#         # If anything went wrong, return 400
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class UpdateCoachOperatorCategories(generics.ListCreateAPIView):
#     """
#     URL: change_coach_operator_categories/
#     Descr: Updates Coach Operator's Categories
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'COP'):
#             context = {"errormsg": "You do not have permission to update a Coach Operator's Categories."}
#             return Response(status=401, data=context)

#         # Get coach_operator
#         coach_operator_id = request.data['object_id']
#         coach_operator = CoachOperator.objects.get(id=coach_operator_id)
#         coach_operator_categories = request.data['coach_operator_categories']

#         # Get coach_operator's Categories
#         try:
#             for hc in coach_operator.categories.all():
#                 coach_operator.categories.remove(hc)

#             for hc in coach_operator_categories:
#                 coach_operator.categories.add(CoachOperatorCategory.objects.get(id=hc['id']))

#             coach_operator.save()

#             History.objects.create(
#                 user=user,
#                 model_name='COP',
#                 action='UPD',
#                 description=f"User : {user.username} updated Coach Operator's ({coach_operator.name}) Categories"
#             )
#             # Serialize data
#             context['object'] = CoachOperatorSerializer(coach_operator).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class AddRoute(generics.UpdateAPIView):
#     """
#     URL: add_route/
#     Descr: Creates a route for a ferry ticket agency
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_create(user.id, 'FTA'):
#             context = {"errormsg": "You do not have permission to create a Ferry Ticket Agency's Route."}
#             return Response(status=401, data=context)

#         try:
#             src = request.data['src']
#             dst = request.data['dst']
#             ferry_ticket_agency = FerryTicketAgency.objects.get(id=request.data['fta_id'])
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)

#         try:
#             FerryRoute.objects.create(source=src, destination=dst, ferry_ticket_agency_id=ferry_ticket_agency.id)
#             History.objects.create(
#                 user=user,
#                 model_name='FTA',
#                 action='CRE',
#                 description=f"User : {user.username} created a route for ferry ticket agency: \
#                     {ferry_ticket_agency.name}"
#             )
#             # Serialize data
#             context['ferry_ticket_agency'] = FerryTicketAgencySerializer(ferry_ticket_agency).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class DeleteRoute(generics.UpdateAPIView):
#     """
#     URL: delete_route/
#     Descr: Deletes a route
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_delete(user.id, 'FTA'):
#             context = {"errormsg": "You do not have permission to delete a route."}
#             return Response(status=401, data=context)

#         # Get route id
#         try:
#             route_id = request.data['route_id']
#             route = FerryRoute.objects.get(id=route_id)
#             ferry_ticket_agency = FerryTicketAgency.objects.get(id=route.ferry_ticket_agency_id)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)

#         try:
#             route.delete()
#             History.objects.create(
#                 user=user,
#                 model_name='FTA',
#                 action='DEL',
#                 description=f"User : {user.username} deleted Ferry Ticket Agency's ({ferry_ticket_agency.name}) route"
#             )
#             # Serialize data
#             context['ferry_ticket_agency'] = FerryTicketAgencySerializer(ferry_ticket_agency).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class DeleteProduct(generics.UpdateAPIView):
#     """
#     URL: delete_product/
#     Descr: Deletes a product
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": '', 'new_entertainment_supplier_name': ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_delete(user.id, 'ES'):
#             context = {"errormsg": "You do not have permission to delete an entertainment product."}
#             return Response(status=401, data=context)

#         try:
#             entertainment_product_id = request.data['entertainment_product_id']
#             entertainment_product = EntertainmentProduct.objects.get(id=entertainment_product_id)
#             entertainment_supplier = EntertainmentSupplier.objects.get(id=entertainment_product.entertainment_supplier_id)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)

#         try:
#             entertainment_product.delete()
#             History.objects.create(
#                 user=user,
#                 model_name='ES',
#                 action='DEL',
#                 description=f"User : {user.username} deleted entertainment_product with name {entertainment_product.name}"
#             )
#             # Serialize data
#             context['entertainment_supplier'] = EntertainmentSupplierSerializer(entertainment_supplier).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeProductDescription(generics.UpdateAPIView):
#     """
#     URL: change_product_description/
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):

#         # Used to store any error messages.
#         context = {"errormsg": ''}

#         # Users token, used to get the user instance.
#         token_str = request.headers['User-Token']

#         # Get user
#         user = get_user(token_str)

#         # Returns true if user has permission to update the object.
#         if not can_update(user.id, 'ES'):
#             context = {"errormsg": "You do not have permission to update an entertainment product's description."}
#             return Response(status=401, data=context)

#         entertainment_product = EntertainmentProduct.objects.get(id=request.data['entertainment_product_id'])
#         # Get new name from front end.
#         description = request.data['description'].strip()

#         # Update Object
#         try:
#             entertainment_product.description = description
#             entertainment_product.save()

#             # Write event to database
#             History.objects.create(
#                 user=user,
#                 model_name='ES',
#                 action='UPD',
#                 description=f"User : {user.username} updated entertainment_product's ({entertainment_product.name})  description from to {description}"
#             )

#             # Return Object's data to update front end's state.
#             context['object'] = get_serializer('EntertainmentProduct', EntertainmentSupplier.objects.get(id=entertainment_product.entertainment_supplier_id))
#             # If everything went smooth, return 200 status
#             return Response(data=context, status=status.HTTP_200_OK)

#         # If anything went wrong, return 400
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class ChangeHotelPrice(generics.ListCreateAPIView):

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'HTL'):
#             context = {"errormsg": "You do not have permission to update a hotel's price."}
#             return Response(status=401, data=context)

#         # Get travelday
#         hotel_id = request.data['hotel_id']
#         hotel = Hotel.objects.get(id=hotel_id)

#         price = request.data['price']
#         hotel.price = price

#         hotel.save()
#         History.objects.create(
#             user=user,
#             model_name='HTL',
#             action='UPD',
#             description=f"User : {user.username} updated hotel's ({hotel.name}) {price}"
#         )
#         context['model'] = HotelSerializer(hotel).data
#         return Response(data=context, status=200)


# class ChangeMenuDescription(generics.ListCreateAPIView):

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'RST'):
#             context = {"errormsg": "You do not have permission to update a restaurant's menu description."}
#             return Response(status=401, data=context)

#         menu_id = request.data['menu_id']
#         menu = RestaurantMenu.objects.get(id=menu_id)

#         restaurant = Restaurant.objects.get(id=menu.restaurant_id)

#         description = request.data['description']
#         menu.description = description

#         menu.save()
#         History.objects.create(
#             user=user,
#             model_name='RST',
#             action='UPD',
#             description=f"User : {user.username} updated restaurant menu's ( id : {menu_id}) description"
#         )
#         context['object'] = RestaurantSerializer(restaurant).data
#         return Response(data=context, status=200)


# class ChangeMenuPrice(generics.ListCreateAPIView):

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'RST'):
#             context = {"errormsg": "You do not have permission to update a restaurant's menu description."}
#             return Response(status=401, data=context)

#         menu_id = request.data['menu_id']
#         menu = RestaurantMenu.objects.get(id=menu_id)

#         restaurant = Restaurant.objects.get(id=menu.restaurant_id)

#         price = request.data['price']
#         currency = request.data['currency']

#         menu.currency = currency
#         menu.price_per_person = price
#         menu.save()

#         History.objects.create(
#             user=user,
#             model_name='RST',
#             action='UPD',
#             description=f"User : {user.username} updated restaurant menu's ( id : {menu_id}) price"
#         )
#         context['object'] = RestaurantSerializer(restaurant).data
#         return Response(data=context, status=200)


# class ChangeAircraftYear(generics.UpdateAPIView):
#     """
#     URL: change_year/
#     Descr: Updates aircraft's year
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'AC'):
#             context = {"errormsg": "You do not have permission to update an Aircraft's year."}
#             return Response(status=401, data=context)

#         try:
#             year = request.data['year']
#             aircraft = Aircraft.objects.get(id=request.data['aircraft_id'])
#         except Exception as exc:
#             context['errormsg'] = exc
#             return HttpResponse(status=400)

#         # Get previous year for logging
#         previous_year = aircraft.year
#         try:
#             aircraft.year = year
#             aircraft.save()
#             History.objects.create(
#                 user=user,
#                 model_name='AC',
#                 action='UPD',
#                 description=f"User : {user.username} updated aircraft's (id: {aircraft.id}) year from \
#                     {previous_year} to {year}"
#             )

#             # Serialize data
#             context['aircraft'] = AircraftSerializer(aircraft).data
#             return Response(data=context, status=status.HTTP_200_OK)
#         except Exception as exc:
#             context['errormsg'] = exc
#             return Response(data=context, status=400)


# class UploadDocument(generics.UpdateAPIView):
#     """
#     URL: upload_document/
#     Descr: uploads a document
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request, object_id):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Model type
#         object_type = request.data['object_type'].replace(" ", "")

#         # Get Model class instance
#         if object_type == 'GroupLeader' or object_type == 'Driver':
#             object_type = 'Contact'

#         model = apps.get_model(app_label='webapp', model_name=object_type)

#         # Query to target specific Instance using id.
#         target_obj = model.objects.get(id=object_id)

#         # Get Models 3 char code, used for permissions/logging.
#         # Example: Agent's 3 code is "AGN".Values are stored in model_names variable
#         if request.data['object_type'] == 'Driver':
#             obj_three_code = 'DRV'
#         elif request.data['object_type'] == 'Group Leader':
#             obj_three_code = 'GL'
#         else:
#             obj_three_code = model_names[object_type]

#         # Permission
#         if not can_update(user.id, obj_three_code):
#             context = {"errormsg": f"You do not have permission to upload {object_type}'s document."}
#             return Response(status=401, data=context)

#         backend_path = os.path.join(BASE_DIR, 'static')

#         # Get user
#         file = request.FILES['file']

#         # Get description
#         description = request.data['description'].strip()
#         extension = file.name.split('.')[-1]

#         # Validate size
#         max_size = 20971520  # 20 megabytes
#         if file.size > max_size:
#             context['errormsg'] = 'File should not exceed 20 megabytes of data'
#             return Response(data=context, status=400)

#         # Validate extension
#         if extension not in allowed_extensions:
#             context['errormsg'] = f'Cannot upload .{extension} file.'
#             return Response(data=context, status=400)

#         # If file name already exists in the system, add an underscore and counter number
#         file_name = file.name
#         counter = 1

#         while os.path.isfile(os.path.join(backend_path, 'files', 'data_management', object_type, str(target_obj.id), str(file_name))):
#             file_name = file.name.split('.')[0] + '_' + str(counter) + '.' + file.name.split('.')[1]
#             counter += 1

#         # Get full path
#         full_path = os.path.join(backend_path, 'files', 'data_management', object_type, str(target_obj.id), str(file_name))
#         try:
#             newDocument = Document.objects.create(
#                 name=file_name,
#                 type=obj_three_code,
#                 description=description,
#                 uploader_id=user.id,
#                 file=full_path,
#                 size=file.size
#             )
#             History.objects.create(
#                 user=user,
#                 model_name=obj_three_code,
#                 action='CRE',
#                 description=f'User : {user.username} uploaded document to {object_type}: {target_obj.id} named : {file_name}'
#             )
#             newDocument.save()
#         except Exception as a:
#             context['errormsg'] = a
#             return Response(data=context, status=400)
#         target_obj.documents.add(newDocument)

#         file_directory = os.path.join(backend_path, 'files', 'data_management', object_type, str(target_obj.id))

#         # Create the directory if it doesn't exist
#         os.makedirs(file_directory, exist_ok=True)

#         # Open the file in the correct path
#         dest = open(os.path.join(file_directory, str(file_name)), 'wb+')

#         # Write it to \files\group_documents\<group_refcode>\<file_name>
#         if file.multiple_chunks:
#             for c in file.chunks():
#                 dest.write(c)
#         else:
#             dest.write(file.read())
#         dest.close()

#         # Return Object's data to update front end's state.
#         context['object'] = get_serializer(object_type, target_obj)

#         # If everything went smooth, return 200 status
#         return Response(data=context, status=status.HTTP_200_OK)


# class DeleteDocument(generics.UpdateAPIView):
#     """
#     URL: delete_document/(?P<object_id>.*)$
#     Descr: deletes a document, also removes it from file system
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request, object_id):
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)
#         context = {"errormsg": ''}

#         # Model type
#         object_type = request.data['object_type'].replace(" ", "")

#         # Get Model class instance
#         if object_type == 'GroupLeader' or object_type == 'Driver':
#             object_type = 'Contact'

#         model = apps.get_model(app_label='webapp', model_name=object_type)

#         # Query to target specific Instance using id.
#         target_obj = model.objects.get(id=object_id)

#         # Get Models 3 char code, used for permissions/logging.
#         # Example: Agent's 3 code is "AGN".Values are stored in model_names variable
#         if request.data['object_type'] == 'Driver':
#             obj_three_code = 'DRV'
#         elif request.data['object_type'] == 'Group Leader':
#             obj_three_code = 'GL'
#         else:
#             obj_three_code = model_names[object_type]

#         # Permission
#         if not can_update(user.id, obj_three_code):
#             context = {"errormsg": f"You do not have permission to upload {object_type}'s document."}
#             return Response(status=401, data=context)

#         # Get document
#         document_id = request.data['document_id']
#         document_name = request.data['document_name']
#         backend_path = os.path.join(BASE_DIR, 'static')

#         # Get full path to be able to remove it
#         full_path = os.path.join(backend_path, 'files', 'data_management', object_type, str(target_obj.id), str(document_name))
#         os.remove(full_path)
#         try:
#             document_to_delete = Document.objects.get(id=document_id)
#             History.objects.create(
#                 user=user,
#                 model_name=obj_three_code,
#                 action='DEL',
#                 description=f'User : {user.username} deleted document named: {document_name}'
#             )
#             document_to_delete.delete()
#         except Exception as a:
#             context['errormsg'] = a
#             return Response(data=context, status=400)

#         # Return Object's data to update front end's state.
#         context['object'] = get_serializer(object_type, target_obj)

#         # If everything went smooth, return 200 status
#         return Response(data=context, status=status.HTTP_200_OK)


# class DownloadDocument(generics.ListAPIView):
#     def get(self, request, object_id):
#         backend_path = os.path.join(BASE_DIR, 'static')
#         file = request.GET.get('file')

#         object_type = request.GET.get('object_type')

#         # Get Model class instance
#         if object_type == 'GroupLeader' or object_type == 'Driver':
#             object_type = 'Contact'

#         model = apps.get_model(app_label='webapp', model_name=object_type)

#         # Query to target specific Instance using id.
#         target_obj = model.objects.get(id=object_id)

#         # URL-decode the filename in case it was URL-encoded when passed
#         decoded_file = urlunquote(file)
#         safe_file_path = os.path.basename(decoded_file)

#         full_path = os.path.join(backend_path, 'files', 'data_management', object_type, str(target_obj.id), safe_file_path)

#         response = HttpResponse(open(full_path, 'rb'), content_type='application/octet-stream')

#         # Properly encode the filename for the Content-Disposition header
#         encoded_filename = urlquote(decoded_file)
#         response['Content-Disposition'] = "attachment; filename*=utf-8''{}".format(encoded_filename)
#         return response


# class DragDropDocument(generics.ListCreateAPIView):
#     """
#     url : drag_drop_document/(?P<refcode>.*)$
#     Descr: Uploads document(s)
#     """

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request, object_id):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         backend_path = os.path.join(BASE_DIR, 'static')

#         # Model type
#         object_type = request.data['object_type'].replace(" ", "")

#         # Get Model class instance
#         if object_type == 'GroupLeader' or object_type == 'Driver':
#             object_type = 'Contact'

#         model = apps.get_model(app_label='webapp', model_name=object_type)

#         # Query to target specific Instance using id.
#         target_obj = model.objects.get(id=object_id)

#         # Get Models 3 char code, used for permissions/logging.
#         # Example: Agent's 3 code is "AGN".Values are stored in model_names variable
#         if request.data['object_type'] == 'Driver':
#             obj_three_code = 'DRV'
#         elif request.data['object_type'] == 'Group Leader':
#             obj_three_code = 'GL'
#         else:
#             obj_three_code = model_names[object_type]

#         # Permission
#         if not can_update(user.id, obj_three_code):
#             context = {"errormsg": f"You do not have permission to upload {object_type}'s document."}
#             return Response(status=401, data=context)

#         for file in request.FILES.getlist('files_array'):
#             extension = file.name.split('.')[-1]

#             # Validate size
#             max_size = 20971520  # 20 megabytes
#             if file.size > max_size:
#                 context['errormsg'] = 'File should not exceed 20 megabytes of data'
#                 return Response(data=context, status=400)

#             # Validate extension
#             if extension not in allowed_extensions:
#                 context['errormsg'] = f'Cannot upload .{extension} file.'
#                 return Response(data=context, status=400)

#             # If file name already exists in the system, add an underscore and counter number
#             file_name = file.name
#             counter = 1

#             while os.path.isfile(os.path.join(backend_path, 'files', 'data_management', object_type, str(target_obj.id), str(file_name))):
#                 file_name = file.name.split('.')[0] + '_' + str(counter) + '.' + file.name.split('.')[1]
#                 counter += 1

#             # Get full path
#             full_path = os.path.join(backend_path, 'files', 'data_management', object_type, str(target_obj.id), str(file_name))

#             try:
#                 newDocument = Document.objects.create(
#                     name=file_name,
#                     type=obj_three_code,
#                     uploader_id=user.id,
#                     file=full_path,
#                     size=file.size
#                 )
#                 History.objects.create(
#                     user=user,
#                     model_name=obj_three_code,
#                     action='CRE',
#                     description=f'User: {user.username} uploaded document to {object_type} named : {file_name}'
#                 )
#                 newDocument.save()
#             except Exception as a:
#                 context['errormsg'] = a
#                 return Response(data=context, status=400)
#             target_obj.documents.add(newDocument)

#             file_directory = os.path.join(backend_path, 'files', 'data_management', object_type, str(target_obj.id))

#             # Create the directory if it doesn't exist
#             os.makedirs(file_directory, exist_ok=True)

#             # Open the file in the correct path
#             dest = open(os.path.join(file_directory, str(file_name)), 'wb+')

#             if file.multiple_chunks:
#                 for c in file.chunks():
#                     dest.write(c)
#             else:
#                 dest.write(file.read())
#             dest.close()

#         # Return Object's data to update front end's state.
#         context['object'] = get_serializer(object_type, target_obj)

#         # If everything went smooth, return 200 status
#         return Response(data=context, status=status.HTTP_200_OK)



# class ReorderPhotos(generics.UpdateAPIView):

#     # Cross-Site Request Forgery
#     @csrf_exempt
#     def post(self, request):
#         context = {"errormsg": ''}
#         token_str = request.headers['User-Token']
#         user = get_user(token_str)

#         # Permission
#         if not can_update(user.id, 'AC'):
#             context = {"errormsg": "You do not have permission to update an Aircraft's year."}
#             return Response(status=401, data=context)
        
#         try:
#             object_type = request.data.get('object_type')
#             object_id = request.data.get('object_id')
#             photo_orders = request.data.get('photo_orders', [])

#         # Get Model class instance
#             if object_type == 'GroupLeader' or object_type == 'Driver':
#                 object_type = 'Contact'

#             model = apps.get_model(app_label='webapp', model_name=object_type)

#             # Query to target specific Instance using id.
#             target_obj = model.objects.get(id=object_id)

#             # Get Models 3 char code, used for permissions/logging.
#             # Example: Agent's 3 code is "AGN".Values are stored in model_names variable
#             if request.data['object_type'] == 'Driver':
#                 obj_three_code = 'DRV'
#             elif request.data['object_type'] == 'Group Leader':
#                 obj_three_code = 'GL'
#             else:
#                 obj_three_code = model_names[object_type]

#             # Update photo orders
#             for order_data in photo_orders:
#                 photo = Photo.objects.get(id=order_data['photo_id'])
#                 photo.order = order_data['new_order']
#                 photo.save()

#             # Write event to database
#             History.objects.create(
#                 user=user,
#                 model_name=obj_three_code,
#                 action='UPD',
#                 description=f"User {user.username} reordered photos for {object_type} ({target_obj})"
#             )

#             return Response({"message": "Photos reordered successfully"}, status=status.HTTP_200_OK)

#         except Exception as e:
#             print(e)
#             return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

