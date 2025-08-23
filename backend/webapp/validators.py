# # from django.shortcuts import render
# from webapp.models import (
#     Agent,
#     Client,
# )


# def validate_name(name):
#     # # # Name cannot contain less than 4 chars, or more than 50 chars
#     if len(name) < 2 or len(name) > 120:
#         return False
#     return True


# def validate_address(address):
#     # # # Free text that cannot exceed 100 chars
#     if len(address) > 120:
#         return False
#     return True


# def validate_email(email):
#     # # # We need "@" and "." in the email string. Largest email address can be up to 64
#     if '@' not in email or len(email) < 5 or '.' not in email or len(email) > 64:
#         return False
#     return True


# def validate_website(website):
#     # # # We need "." in the email string.
#     if '.' not in website or len(website) < 5 or '.' not in website or len(website) > 128:
#         return False
#     return True


# def validate_tel_details(tel_details):
#     # # # First tel has to be legit.

#     if len(tel_details[0]) < 8 or len(tel_details[0]) > 20:
#         return False

#     # # # Rest can be null, if they are not null, validate them too.
#     for tel in tel_details[1:]:
#         if tel != '':
#             if len(tel) < 8 or len(tel) > 20:
#                 return False
#     return True


# def validate_abbreviation(abbreviation):
#     # # # We need abbreviation to be unique, and be 2 or 3 char long
#     agent_abbreviations = [agent.abbreviation for agent in Agent.objects.all()]
#     client_abbreviations = [client.abbreviation for client in Client.objects.all()]

#     if abbreviation in agent_abbreviations or abbreviation in client_abbreviations:
#         return False
#     elif len(abbreviation) > 3 or len(abbreviation) < 2:
#         return False
#     return True


# def validate_lat(lat):
#     # # # Max latitude is 90 and Min latitude is -90
#     # # # Source : https://docs.mapbox.com/help/glossary/lat-lon/
#     if float(lat) > 90 or float(lat) < -90:
#         return False
#     return True


# def validate_lng(lng):
#     # # # Max latitude is 180 and Min latitude is -180
#     # # # Source : https://docs.mapbox.com/help/glossary/lat-lon/
#     if float(lng) > 180 or float(lng) < -180:
#         return False
#     return True


# def validate_airport_location(location):
#     if len(location) < 7 or len(location) > 100:
#         return False
#     return True


# def validate_terminal(terminal):
#     if len(terminal) < 3 or len(terminal) > 100:
#         return False
#     return True


# def validate_coach_make(make):
#     if len(make) < 3 or len(make) > 64:
#         return False
#     return True


# def validate_coach_body_number(body_number):
#     if len(body_number) < 4 or len(body_number) > 64:
#         return False
#     return True


# def validate_port_code(code):
#     if len(code) != 3:
#         return False
#     return True
