import datetime
import os

import reportlab
from accounts.permissions import can_delete, can_update
from core.settings import BASE_DIR
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Sum
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import json
from reportlab.platypus import (
    Image,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    # PageBreak,
    Table,
)
from textwrap import wrap
from urllib.parse import quote_plus  # For URL encoding
from rest_framework import generics
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from webapp.models import (
    Agent,
    Airline,
    CoachOperator,
    Contact,
    CruisingCompany,
    FerryTicketAgency,
    Guide,
    History,
    Hotel,
    Night,
    Offer,
    Restaurant,
    Service,
    SportEventSupplier,
    TeleferikCompany,
    TextTemplate,
    Theater,
    TrainTicketAgency,
)

import requests
from webapp.serializers import OfferSerializer

reportlab.rl_config.warnOnMissingFontGlyphs = 0

pdfmetrics.registerFont(TTFont('Roboto-Regular', os.path.join(BASE_DIR, 'Roboto-Regular.ttf')))
pdfmetrics.registerFont(TTFont('Roboto-Bold', os.path.join(BASE_DIR, 'Roboto-Bold.ttf')))


commonServices = [
    "TR",
    "TO",
    "PM",
    "CFT",
    "DA",
    "LG",
    "TL",
    "TLAT",
    "TLA",
    "FC",
    "RST",
    "OTH",
    "TR",
    "PRM",
]

nonCommonServices = [
    "AT",
    "ML",
    "FT",
    "CR",
    "MU",
    "TH",
    "TP",
    "TT",
    "SE",
    "TE",
    "HP",
    "AP",
]


SERVICE_TYPES = {
    'Accommodation': 'AC',
    'Air Ticket': 'AT',
    'Airport Porterage': 'AP',
    "Coach's Ferry Ticket": "CFT",
    'Cruise': 'CR',
    'Driver Accommodation': 'DA',
    'Ferry Ticket': 'FT',
    'Hotel Porterage': 'HP',
    'Local Guide': 'LG',
    'Restaurant': 'RST',
    'Sport Event': 'SE',
    'Teleferik': 'TE',
    'Theater': 'TH',
    'Tolls': 'TO',
    'Tour Leader': 'TL',
    "Tour Leader's Accommodation": 'TLA',
    "Tour Leader's Air Ticket": 'TLAT',
    'Train Ticket': 'TT',
    'Transfer': 'TR',
    'Other': 'OTH',
    'Permit': "PRM",
}

# Service types reversed
SERVICE_TYPES_REV = {
    "AC": 'Accommodation',
    "AT": 'Air Ticket',
    "AP": 'Airport Porterage',
    "CFT": "Coach's Ferry Ticket",
    "CR": 'Cruise',
    "DA": 'Driver Accommodation',
    "FT": 'Ferry Ticket',
    "HP": 'Hotel Porterage',
    "LG": 'Local Guide',
    "RST": 'Restaurant',
    "SE": 'Sport Event',
    "TE": 'Teleferik',
    "TH": 'Theater',
    "TO": 'Toll',
    "TL": 'Tour Leader',
    "TLA": "Tour Leader's Accommodation",
    "TLAT": "Tour Leader's Air Ticket",
    "TT": 'Train Ticket',
    "TR": 'Transfer',
    "OTH": 'Other',
    "PRM": 'Permit',
}

# Service types reversed in Greek Language
SERVICE_TYPES_REV_GR = {
    "AC": 'Διαμονή',
    "AT": 'Αεροπορικό εισιτήριο',
    "AP": 'Μεταφορά αποσκευών ( Αεροδρόμιο )',
    "CFT": "Ακτοπλοϊκό εισιτήριο οχήματος",
    "CR": 'Κρουαζιέρα',
    "DA": 'Διαμονή οδηγού',
    "FT": 'Ακτοπλοϊκό εισιτήριο',
    "HP": 'Μεταφορά αποσκευών ( Ξενοδοχείο )',
    "LG": 'Ξεναγός',
    "MU": 'Μουσείο',
    "RST": 'Εστιατόριο',
    "SE": 'Αθλητικό γεγονός',
    "TE": 'Τελεφερίκ',
    "TH": 'Θέατρο',
    "TP": 'Θεματικό πάρκο',
    "TO": 'Διόδια',
    "TL": 'Αρχηγός περιοδείας',
    "TLA": "Διαμονή αρχηγού περιοδείας",
    "TLAT": "Αεροπορικό εισιτήριο αρχηγού περιοδείας",
    "TT": 'Εισιτήριο τραίνου',
    "TR": 'Μεταφορά',
    "OTH": 'Άλλο',
    "PRM": 'Άδεια',
}


"""
    # Offer Overview

    - ChangeOfferInfo
    - AddOfferService
    - CreateOfferForStaffPDF
    - ChangeOfferServicePrice
    - CreateGroupByOffer
    - DeleteOfferService
    - UpdateOfferLanguage

"""

months_eng_to_greek = {
    'January': 'Ιανουάριος',
    'February': 'Φεβρουάριος',
    'March': 'Μάρτιος',
    'April': 'Απρίλιος',
    'May': 'Μάιος',
    'June': 'Ιούνιος',
    'July': 'Ιούλιος',
    'August': 'Αύγουστος',
    'September': 'Σεπτέμβριος',
    'October': 'Οκτώβριος',
    'November': 'Νοέμβριος',
    'December': 'Δεκέμβριος',
}


def translate_to_greek(date_str):
    # Splitting the date range string by "-"
    start_month, end_month = date_str.split("-")

    # Getting the month and year separated
    start_month, start_year = start_month.strip().split(" ")
    end_month, end_year = end_month.strip().split(" ")

    # Translating the month using the dictionary
    start_month_greek = months_eng_to_greek[start_month]
    end_month_greek = months_eng_to_greek[end_month]

    # Returning the combined translated string
    return f"{start_month_greek} {start_year} - {end_month_greek} {end_year}"


# Get user from token
def get_user(token):
    return Token.objects.get(key=token).user


class ChangeOfferInfo(generics.ListCreateAPIView):
    """
    URL: update_offer_info/(?P<offer_id>.*)
    Descr: updates offer's info tab fields
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request, offer_id):
        context = {"errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_update(user.id, 'OFF'):
            context = {"errormsg": "You do not have permission to update an Offer."}
            return Response(status=401, data=context)

        offer = Offer.objects.get(id=offer_id)

        try:
            offer.name = request.data['name']
            offer.group_reference = request.data['group_reference']
            offer.date = request.data['date']
            offer.offer_type = request.data['offer_type']
            offer.doc_type = request.data['doc_type']
            offer.currency = request.data['currency']
            offer.destination = request.data['destination']
            offer.number_of_people = request.data['pax']
            offer.profit = request.data['profit']
            offer.cancellation_deadline = request.data['cancellation_deadline']
            History.objects.create(
                user=user,
                model_name='OFF',
                action='UPD',
                description=f"User : {user.username} updated offer's: ({offer.name}) information fields"
            )
            offer.save()
            context['offer'] = OfferSerializer(offer).data
        except Exception as a:
            context['errormsg'] = a
            return Response(data=context, status=400)
        return Response(data=context, status=200)


class AddOfferService(generics.ListCreateAPIView):
    """
    URL: add_off_service/(?P<offer_id>.*)
    Descr: adds service to offer
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request, offer_id):
        context = {"errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_update(user.id, 'OFF'):
            context = {"errormsg": "You do not have permission to update an Offer."}
            return Response(status=401, data=context)

        # Get offer
        offer = Offer.objects.get(id=offer_id)

        # Standard Fields
        service_type = request.data['service_type']
        dates = [datetime.datetime.fromtimestamp(int(ts) / 1000.0) for ts in request.data['dates']]
        price = request.data['price']

        def get_optional_object(model, field_name, request_data):
            try:
                if field_name == 'leader':
                    return Contact.objects.filter(type='L').get(name=request_data.get(field_name)).id
                return model.objects.get(name=request_data.get(field_name)).id
            except ObjectDoesNotExist:
                return None

        # Accommodation
        hotel_id = get_optional_object(Hotel, 'hotel', request.data)
        sgl = request.data['sgl']
        dbl = request.data['dbl']
        twin = request.data['twin']
        trpl = request.data['trpl']
        quad = request.data['quad']
        free_sgl = request.data['free_sgl']
        free_dbl = request.data['free_dbl']
        free_twin = request.data['free_twin']
        free_trpl = request.data['free_trpl']
        free_quad = request.data['free_quad']

        # Optionals
        airline_id = get_optional_object(Airline, 'airline', request.data)
        ferry_ticket_agency_id = get_optional_object(FerryTicketAgency, 'ferry_ticket_agency', request.data)
        cruising_company_id = get_optional_object(CruisingCompany, 'cruising_company', request.data)
        guide_id = get_optional_object(Guide, 'guide', request.data)
        restaurant_id = get_optional_object(Restaurant, 'restaurant', request.data)
        sport_event_supplier_id = get_optional_object(SportEventSupplier, 'sport_event_supplier', request.data)
        teleferik_company_id = get_optional_object(TeleferikCompany, 'teleferik_company', request.data)
        train_ticket_agency_id = get_optional_object(TrainTicketAgency, 'train_ticket_agency', request.data)
        coach_operator_id = get_optional_object(CoachOperator, 'coach_operator', request.data)
        theater_id = get_optional_object(Theater, 'theater', request.data)
        leader_id = get_optional_object(Contact, 'leader', request.data)

        try:
            for date in dates:
                service = Service.objects.create(
                    date=date.strftime('%Y-%m-%d'),
                    service_type=SERVICE_TYPES[service_type],
                    price=price,
                    hotel_id=hotel_id,
                    sgl=sgl,
                    dbl=dbl,
                    twin=twin,
                    trpl=trpl,
                    quad=quad,
                    free_sgl=free_sgl,
                    free_dbl=free_dbl,
                    free_twin=free_twin,
                    free_trpl=free_trpl,
                    free_quad=free_quad,
                    airline_id=airline_id,
                    ferry_ticket_agency_id=ferry_ticket_agency_id,
                    cruising_company_id=cruising_company_id,
                    guide_id=guide_id,
                    restaurant_id=restaurant_id,
                    sport_event_supplier_id=sport_event_supplier_id,
                    teleferik_company_id=teleferik_company_id,
                    tour_leader_id=leader_id,
                    train_ticket_agency_id=train_ticket_agency_id,
                    coach_operator_id=coach_operator_id,
                    theater_id=theater_id,
                )
                offer.services.add(service)
                offer.save()
                History.objects.create(
                    user=user,
                    model_name='OFF',
                    action='UPD',
                    description=f"User : {user.username} added a service \
                        (service_id: {offer.id}) to offer {offer.id}"
                )

            context['offer'] = OfferSerializer(offer).data
        except Exception as a:
            context['errormsg'] = a
            return Response(data=context, status=400)
        return Response(data=context, status=200)


class ChangeOfferServicePrice(generics.ListCreateAPIView):
    """
    URL: change_offer_service_price/$
    Descr: Changes offer's price
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request):
        context = {"errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_update(user.id, 'OFF'):
            context = {"errormsg": "You do not have permission to update an offer's service price."}
            return Response(status=401, data=context)

        # Get service
        service_id = request.data['service_id']
        service = Service.objects.get(id=service_id)

        # Get new price
        price = request.data['price']

        # Get offer type
        type = request.data['type']

        # Get previous price for logging
        previous_price = service.price

        # Get offer
        offer = Offer.objects.get(id=request.data['offer_id'])

        try:
            if type == 'single':
                service.sgl = price
            elif type == 'double':
                service.dbl = price
            elif type == 'twin':
                service.twin = price
            elif type == 'triple':
                service.trpl = price
            elif type == 'quadrable':
                service.quad = price
            elif type == 'price':
                service.price = price
            else:
                service.price = price
            service.save()

            History.objects.create(
                user=user,
                model_name='OFF',
                action='UPD',
                description=f"User : {user.username} updated service's ({service_id}) price from: {int(previous_price)} to: {price}"
            )
            context['offer'] = OfferSerializer(offer).data
            return Response(data=context, status=200)
        except Exception as a:
            # In case anything occurs, return 400
            context['errormsg'] = a
            return Response(data=context, status=400)


class DeleteOfferService(generics.UpdateAPIView):
    """
    URL: delete_offer_service/$
    Descr: Deletes a service
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request):
        token_str = request.headers['User-Token']
        user = get_user(token_str)
        context = {"errormsg": ''}

        # Permission
        if not can_delete(user.id, 'OFF'):
            context = {"errormsg": "You do not have permission to delete a Group's service."}
            return Response(status=401, data=context)

        # Get offer
        offer = Offer.objects.get(id=request.data['offer_id'])
        offer_service_id = request.data['offer_service_id']
        try:
            offer_service_to_delete = Service.objects.get(id=offer_service_id)
            History.objects.create(
                user=user,
                model_name='OFF',
                action='DEL',
                description=f'User : {user.username} deleted service with id: {offer_service_id}'
            )
            offer_service_to_delete.delete()
        except Exception as a:
            context['errormsg'] = a
            return Response(data=context, status=400)
        context['offer'] = OfferSerializer(offer).data
        return Response(data=context, status=200)


class DeleteAllOfferServices(generics.UpdateAPIView):
    """
    URL : delete_all_offer_services/(?P<refcode>.*)$
    Descr: Deletes selected offer's services based on offer id
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request, offer_id):
        context = {"errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permissions
        if not can_delete(user.id, 'OFF'):
            context = {"errormsg": "You do not have permission to delete a Offer's services."}
            return Response(status=401, data=context)

        # Get offer
        offer = Offer.objects.get(id=offer_id)

        try:
            # Get services to delete
            services_to_delete = Service.objects.filter(offer_id=offer_id)

            # Log all deletes
            for service in services_to_delete:
                History.objects.create(
                    user=user,
                    model_name='OFF',
                    action='DEL',
                    description=f"User : {user.username} deleted service with id: {service.id} on date: {service.date} of offer: {offer.name}"
                )
                service.delete()
            context['offer'] = OfferSerializer(offer).data
        except Exception as a:
            context['errormsg'] = a
            return Response(data=context, status=400)
        return Response(data=context, status=200)


class ChangeOfferRecipient(generics.UpdateAPIView):
    """
    URL : change_offer_recipient/(?<offer_id>.*)$
    Descr: Changes Offer's Recipient ( Agent )
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request, offer_id):
        context = {"errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permissions
        if not can_delete(user.id, 'OFF'):
            context = {"errormsg": "You do not have permission to update an offer's Recipient."}
            return Response(status=401, data=context)

        # Get offer
        offer = Offer.objects.get(id=offer_id)

        try:
            # Get services to delete
            recipient = Agent.objects.get(name=request.data['recipient'])
            offer.recipient = recipient
            History.objects.create(
                user=user,
                model_name='OFF',
                action='DEL',
                description=f"User : {user.username} updated Recipient of offer: {offer.name}"
            )
            offer.save()
            context['offer'] = OfferSerializer(offer).data
        except Exception as a:
            context['errormsg'] = a
            return Response(data=context, status=400)
        return Response(data=context, status=200)


class ChangeOfferPeriod(generics.UpdateAPIView):
    """
    URL : change_offer_period/(?<offer_id>.*)$
    Descr: Changes Offer's Period
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request, offer_id):
        context = {"errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permissions
        if not can_delete(user.id, 'OFF'):
            context = {"errormsg": "You do not have permission to update an offer's Period."}
            return Response(status=401, data=context)

        # Get offer
        offer = Offer.objects.get(id=offer_id)

        try:
            # Get services to delete
            start_date = request.data['start_date']
            end_date = request.data['end_date']
            period = f"{start_date} - {end_date}"

            if start_date == end_date:
                period = start_date

            offer.period = period
            History.objects.create(
                user=user,
                model_name='OFF',
                action='DEL',
                description=f"User : {user.username} updated Period of offer: {offer.name}"
            )
            offer.save()
            context['offer'] = OfferSerializer(offer).data
        except Exception as a:
            context['errormsg'] = a
            return Response(data=context, status=400)
        return Response(data=context, status=200)


class EditOfferNights(generics.UpdateAPIView):
    """
    URL : edit_offer_nights/(?<offer_id>.*)$
    Descr: Changes Offer's Nights
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request, offer_id):
        context = {"errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permissions
        if not can_delete(user.id, 'OFF'):
            context = {"errormsg": "You do not have permission to update an offer's nights."}
            return Response(status=401, data=context)

        # Get offer
        offer = Offer.objects.get(id=offer_id)

        try:
            # Get nights to delete.
            nights = offer.nights.all()
            for night in nights:
                night.delete()

            # Get Nights to create.
            forms = request.data['forms']
            for form in forms:
                for i in range(int(form['numberValue'])):
                    newNight = Night.objects.create(location=form['dropdownValue'], index=form['index'])
                    newNight.save()
                    offer.nights.add(newNight)

            History.objects.create(
                user=user,
                model_name='OFF',
                action='DEL',
                description=f"User : {user.username} updated Nights of offer: {offer.name}"
            )
            offer.save()
            context['offer'] = OfferSerializer(offer).data
        except Exception as a:
            context['errormsg'] = a
            return Response(data=context, status=400)
        return Response(data=context, status=200)


class UpdateOfferTemplates(generics.ListCreateAPIView):
    """
    URL: update_offer_templates/(?P<offer_id>.*)
    Descr: updates offer's text templates
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request, offer_id):
        context = {"errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_update(user.id, 'OFF'):
            context = {"errormsg": "You do not have permission to update an Offer."}
            return Response(status=401, data=context)

        offer = Offer.objects.get(id=offer_id)

        text_template_id = request.data['template_id']
        checked = request.data['checked']

        try:
            if checked:
                offer.text_templates.add(TextTemplate.objects.get(id=text_template_id))
            elif not checked:
                offer.text_templates.remove(TextTemplate.objects.get(id=text_template_id))

            History.objects.create(
                user=user,
                model_name='OFF',
                action='UPD',
                description=f"User : {user.username} updated offer's: ({offer.name}) text_templates"
            )
            context['offer'] = OfferSerializer(offer).data
        except Exception as a:
            context['errormsg'] = str(a)
            return Response(data=context, status=400)
        return Response(data=context, status=200)


class UpdateAllOfferTemplates(generics.ListCreateAPIView):
    """
    URL: update_all_offer_templates/(?P<offer_id>.*)
    Descr: updates All offer's text templates
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request, offer_id):
        context = {"errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_update(user.id, 'OFF'):
            context = {"errormsg": "You do not have permission to update an Offer."}
            return Response(status=401, data=context)

        offer = Offer.objects.get(id=offer_id)
        text_template_ids = request.data['template_ids']
        checked = request.data['checked']

        try:
            for text_template_id in text_template_ids:
                if checked:
                    offer.text_templates.add(TextTemplate.objects.get(id=text_template_id))
                elif not checked:
                    offer.text_templates.remove(TextTemplate.objects.get(id=text_template_id))

            History.objects.create(
                user=user,
                model_name='OFF',
                action='UPD',
                description=f"User : {user.username} updated offer's: ({offer.name}) text_templates"
            )
            context['offer'] = OfferSerializer(offer).data
        except Exception as a:
            context['errormsg'] = str(a)
            return Response(data=context, status=400)
        return Response(data=context, status=200)


class ToggleOfferTemplateBySearch(generics.ListCreateAPIView):
    """
    URL: update_offer_templates/(?P<offer_id>.*)
    Descr: updates offer's text templates
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request, offer_id):
        context = {"errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_update(user.id, 'OFF'):
            context = {"errormsg": "You do not have permission to update an Offer."}
            return Response(status=401, data=context)

        offer = Offer.objects.get(id=offer_id)
        text = request.data['text']
        text_template = TextTemplate.objects.get(text=text)

        # Check if it already exists
        offer_text_templates = [i.id for i in offer.text_templates.all()]

        try:
            if text_template.id not in offer_text_templates:
                offer.text_templates.add(TextTemplate.objects.get(id=text_template.id))
            # else:
            #     offer.text_templates.remove(TextTemplate.objects.get(id=text_template.id))
            History.objects.create(
                user=user,
                model_name='OFF',
                action='UPD',
                description=f"User : {user.username} updated offer's: ({offer.name}) text_templates"
            )
            context['offer'] = OfferSerializer(offer).data
        except Exception as a:
            context['errormsg'] = str(a)
            return Response(data=context, status=400)
        return Response(data=context, status=200)


class DownloadOfferPDF(generics.ListAPIView):
    """
    URL: download_offer/(?P<offer_id>.*)$

    One of the hardest functions of the app.
    This function is divided in 8 parts.
    - Per Person | B2B INTERNATIONAL
    - Per Person | B2B GREECE
    - Per Person | B2C INTERNATIONAL
    - Per Person | B2C GREECE
    - By Scale   | B2B INTERNATIONAL
    - By Scale   | B2B GREECE
    - By Scale   | B2C INTERNATIONAL
    - By Scale   | B2C GREECE

    """

    @csrf_exempt
    def get(self, request, offer_id):

        # Get Group
        offer = Offer.objects.get(id=offer_id)
        offer_type = offer.doc_type
        scale_type = request.GET.get('scale_type')
        scale_range = request.GET.get('scale_range')

        context = {"errormsg": ''}

        if scale_range is not None:
            scale_range_dict = json.loads(scale_range)
            scale_range_min = scale_range_dict.get('min')
            scale_range_max = scale_range_dict.get('max')

        # File is also stored in file system on the same path
        pdftitle = os.path.join(BASE_DIR, 'static', 'offers', offer_id + '_' + offer_type + '_' + datetime.datetime.now().strftime("%d-%m-%Y") + '.pdf')
        parts = []

        # Icons
        pricing_icon = os.path.join(BASE_DIR, 'static', 'images', 'icons', 'pricing.png')
        pricing_im = Image(pricing_icon, 0.3 * inch, 0.2 * inch,  hAlign='LEFT')

        itinerary_icon = os.path.join(BASE_DIR, 'static', 'images', 'icons', 'itinerary.png')
        itinerary_im = Image(itinerary_icon, 0.2 * inch, 0.2 * inch,  hAlign='LEFT')

        included_icon = os.path.join(BASE_DIR, 'static', 'images', 'icons', 'included.png')
        included_im = Image(included_icon, 0.2 * inch, 0.2 * inch,  hAlign='LEFT')

        not_included_icon = os.path.join(BASE_DIR, 'static', 'images', 'icons', 'not_included.png')
        not_included_im = Image(not_included_icon, 0.2 * inch, 0.2 * inch,  hAlign='LEFT')

        entry_prices_icon = os.path.join(BASE_DIR, 'static', 'images', 'icons', 'entry_prices.png')
        entry_prices_im = Image(entry_prices_icon, 0.2 * inch, 0.2 * inch,  hAlign='LEFT')

        notes_icon = os.path.join(BASE_DIR, 'static', 'images', 'icons', 'notes.png')
        notes_im = Image(notes_icon, 0.2 * inch, 0.2 * inch,  hAlign='LEFT')

        payment_icon = os.path.join(BASE_DIR, 'static', 'images', 'icons', 'payment.png')
        payment_im = Image(payment_icon, 0.3 * inch, 0.2 * inch,  hAlign='LEFT')

        child_icon = os.path.join(BASE_DIR, 'static', 'images', 'icons', 'child.png')
        child_im = Image(child_icon, 0.2 * inch, 0.3 * inch,  hAlign='LEFT')

        map_icon = os.path.join(BASE_DIR, 'static', 'images', 'icons', 'map.png')
        map_im = Image(map_icon, 0.3 * inch, 0.3 * inch,  hAlign='LEFT')

        currency_dict = {
            'EUR': '€',
            'GBP': '£',
            'CAD': '$',
            'AUD': '$',
            'CHF': '₣',
            'JPY': '¥',
            'NZD': '$',
            'CNY': '¥',
            'SGD': '$',
        }

        the_scale = {
            '10-14 PAX': 10,
            '14-19 PAX': 15,
            '20-24 PAX': 20,
            '25-29 PAX': 25,
            '30-34 PAX': 30,
            '34-39 PAX': 35,
            '40-44 PAX': 40,
            '45 + PAX': 45,
        }

        commonServices = [
            "TR",
            "TO",
            "PM",
            "CFT",
            "DA",
            "LG",
            "TL",
            "TLAT",
            "TLA",
            "FC",
            "RST",
            "OTH",
            "TR",
            "PRM",
        ]

        nonCommonServices = [
            "AT",
            "ML",
            "FT",
            "CR",
            "MU",
            "TH",
            "TP",
            "TT",
            "SE",
            "TE",
            "HP",
            "AP",
        ]

        accomodation_services_cost = offer.services.filter(offer_id=offer.id, service_type='AC').aggregate(
            total_sgl=Sum('sgl'),
            total_dbl=Sum('dbl'),
            total_twin=Sum('twin'),
            total_trpl=Sum('trpl'),
            total_quad=Sum('quad'),
        )

        # Calculate the accomodation grand total
        try:
            if offer.offer_type == 'PP':
                ac_cost_total = sum(accomodation_services_cost.values())
            else:
                ac_cost_total = offer.services.filter(offer_id=offer.id, service_type='AC').aggregate(Sum('price'))['price__sum']
                ac_cost_total += (offer.services.filter(offer_id=offer.id, service_type='AC').aggregate(Sum('price'))['price__sum'] * offer.profit) / 100
        except TypeError:
            ac_cost_total = 0

        common_cost = offer.services.filter(offer_id=offer.id, service_type__in=commonServices).aggregate(Sum('price'))['price__sum']

        try:
            common_cost += (common_cost * offer.profit) / 100
        except TypeError:
            common_cost = 0

        non_common_cost = offer.services.filter(offer_id=offer.id, service_type__in=nonCommonServices).aggregate(Sum('price'))['price__sum']
        try:
            non_common_cost += (non_common_cost * offer.profit) / 100
        except TypeError:
            non_common_cost = 0

        if common_cost is None:
            common_cost = 0
        if non_common_cost is None:
            non_common_cost = 0

        # Document's styles
        styles = getSampleStyleSheet()
        styles.add(ParagraphStyle(name='Center', alignment=TA_CENTER))
        styles.add(ParagraphStyle(name='Left', alignment=TA_LEFT))
        styles.add(ParagraphStyle(name='Right', alignment=TA_RIGHT))

        logo = os.path.join(BASE_DIR, 'static', 'images', 'logos', 'cosmoplan_logo.jpg')
        im = Image(logo, 3.5 * inch, 1 * inch,  hAlign='LEFT')

        # # # # # # # # # # #
        # # # 1) HEADER # # #
        # # # # # # # # # # #
        if "GR" in offer.doc_type:
            init_table_data = [['', 'Cosmoplan International Travel LTD.', '', '', ''], ]
            init_table_data.append(['', '', '', '', ])
            init_table_data.append(['', 'Γραφείο Αθήνας: ', 'Γραφείο Λονδίνου: ', '', ])
            init_table_data.append(['', 'Ξενοφώντος 10,', '105-109 Sumatra Road,', '', im])
            init_table_data.append(['', 'Σύνταγμα, Αθήνα, 10557', 'London, NW6 1PL', ''])
            init_table_data.append(['', 'Tηλ.: +30 210 9219400', 'Tel: +44 20 73134174', ''])
            init_table_data.append(['', 'https://cosmoplan.gr', 'https://cosmoplan.co.uk', ''])

        else:
            init_table_data = [['', 'Cosmoplan International Travel LTD.', '', '', ''], ]
            init_table_data.append(['', '', '', '', ])
            init_table_data.append(['', 'Athens Office: ', 'London Office: ', '', ])
            init_table_data.append(['', '10 Xenofontos Street,', '105-109 Sumatra Road,', '', im])
            init_table_data.append(['', 'Syntagma, Athens, 10557', 'London, NW6 1PL', ''])
            init_table_data.append(['', 'Tel: +30 210 9219400', 'Tel: +44 20 73134174', ''])
            init_table_data.append(['', 'https://cosmoplan.gr', 'https://cosmoplan.co.uk', ''])

        table = Table(
            init_table_data,
            rowHeights=14,
            colWidths=[150, 140, 100, 70, 400],
            style=[
                ('FONT', (0, 0), (-1, -1), 'Roboto-Regular', 10),  # Athens Office: // London Office:
                ('FONT', (0, 0), (4, 0), 'Roboto-Bold', 16),      # Cosmoplan International Travel LTD. ( 1st row )
                ("VALIGN", (4, 3), (4, 3), "MIDDLE"),                # Logo Image
                ('TEXTCOLOR', (0, 6), (4, 6), colors.blue),          # Links // cosmoplan.co.uk // cosmoplan.gr
            ]
        )
        parts.append(table)
        parts.append(Spacer(2, 20))

        # # # # # # # # # # # # # #
        # # # 2) Offer's INFO # # #
        # # # # # # # # # # # # # #
        if "GR" in offer.doc_type:
            if offer.recipient:
                recipient = offer.recipient.name
            else:
                recipient = 'N/A'
            init_table_data = [
                ['Παραλήπτης :', "\n".join(wrap(recipient, 40))],
                ['Ημερομηνία :', offer.date.strftime("%d-%m-%Y")],
                ['Κωδικός Group :', offer.group_reference],
                ['Περίοδος :', translate_to_greek(offer.period)],
                ['Τελευταία ημερομηνία ακύρωσης :', f"{offer.cancellation_deadline} ημέρες"],
            ]
        else:
            if offer.recipient:
                recipient = offer.recipient.name
            else:
                recipient = 'N/A'
            init_table_data = [
                ['TO :', "\n".join(wrap(recipient, 40))],
                ['Date :', offer.date.strftime("%d-%m-%Y")],
                ['Group Reference :', offer.group_reference],
                ['Period :', offer.period],
                ['Last Cancellation Date :', f"{offer.cancellation_deadline} Days"],
            ]

        table = Table(
            init_table_data,
            colWidths=[220, 360],
            style=[
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ('FONT', (0, 0), (-1, -1), 'Roboto-Regular', 14),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ]
        )
        parts.append(table)
        parts.append(Spacer(2, 20))

        # # # # # # # # # # #
        # # # 3) Pricing # # #
        # # # # # # # # # # #

        room_types = {
            'sgl': 'Single',
            'dbl': 'Double',
            'twin': 'Twin',
            'trpl': 'Triple',
            'quad': 'Quadraple',
        }

        room_types_gr = {
            'sgl': 'Μονόκλινο',
            'dbl': 'Δίκλινο ( 1 Διπλό κρεβάτι )',
            'twin': 'Δίκλινο ( 2 μονά κρεβάτια )',
            'trpl': 'Τρίκλινο',
            'quad': 'Τετράκλινο',
        }

        if offer.doc_type == 'B2BINT':
            if offer.offer_type == 'PP':
                init_table_data = [[" "]]
                parts.append(Paragraph("<font size=12 name='Roboto-Regular'><b>We're pleased to share the following offer with you:</b></font>",  styles["Left"]))
                parts.append(Spacer(1, 10))
                init_table_data = [[pricing_im, 'Prices per person: ']]

                for room_type, room_type_full in room_types.items():
                    total_accomodation_cost = 0
                    if room_type == 'sgl':
                        to_add = offer.services.filter(service_type='AC').aggregate(sgl_sum=Sum('sgl'))['sgl_sum']
                        if to_add is not None:
                            total_accomodation_cost += to_add
                    elif room_type == 'dbl':
                        to_add = offer.services.filter(service_type='AC').aggregate(dbl_sum=Sum('dbl'))['dbl_sum']
                        if to_add is not None:
                            total_accomodation_cost += to_add

                    elif room_type == 'twin':
                        to_add = offer.services.filter(service_type='AC').aggregate(twin_sum=Sum('twin'))['twin_sum']
                        if to_add is not None:
                            total_accomodation_cost += to_add

                    elif room_type == 'trpl':
                        to_add = offer.services.filter(service_type='AC').aggregate(trpl_sum=Sum('trpl'))['trpl_sum']
                        if to_add is not None:
                            total_accomodation_cost += to_add

                    elif room_type == 'quad':
                        to_add = offer.services.filter(service_type='AC').aggregate(quad_sum=Sum('quad'))['quad_sum']
                        if to_add is not None:
                            total_accomodation_cost += to_add

                    total_accomodation_cost += (total_accomodation_cost * offer.profit) / 100

                    if offer.number_of_people != 0:
                        total_cost = total_accomodation_cost + (common_cost / offer.number_of_people) + non_common_cost
                    else:
                        context['errormsg'] = "Offer's number of people has to be greater than 0"
                        return Response(data=context, status=400)

                    if total_accomodation_cost > 0:
                        init_table_data.append([room_type_full, f'{currency_dict[offer.currency]} {"{:.2f}".format((round(total_cost)))}'])

            elif offer.offer_type == 'BS':
                init_table_data = [[" "]]
                parts.append(Paragraph("<font size=12 name='Roboto-Regular'><b>We're pleased to share the following offer with you:</b></font>", styles["Left"]))
                parts.append(Spacer(1, 10))
                init_table_data = [[pricing_im, 'Price Scale: ']]

                if scale_type == 'tiered':
                    for key, value in the_scale.items():
                        init_table_data.append(['', '• ' + key, f'{currency_dict[offer.currency]} {"{:.2f}".format((round(ac_cost_total + (common_cost / value) + non_common_cost, 0)))}'])
                else:
                    for i in range(scale_range_min, scale_range_max + 1):
                        init_table_data.append(
                            ['', '• ' + str(i) + " PAX", f'{currency_dict[offer.currency]} {"{:.2f}".format((ac_cost_total + (common_cost / i) + non_common_cost))}']
                        )

        elif offer.doc_type == 'B2CINT':
            pass

        elif offer.doc_type == 'B2BGR':
            if offer.offer_type == 'PP':
                init_table_data = [[" "]]
                parts.append(Paragraph("<font size=12 name='Roboto-Regular'><b>Είμαστε στην ευχάριστη θέση να μοιραστούμε μαζί σας την παρακάτω προσφορά :</b></font>",  styles["Left"]))
                parts.append(Spacer(1, 10))
                init_table_data = [[pricing_im, 'Τιμές ανά άτομο ανά βραδιά: ']]

                init_table_data.append(['Τύπος δωματίου', 'τιμή'])
                for room_type, room_type_full in room_types_gr.items():
                    total_accomodation_cost = 0
                    if room_type == 'sgl':
                        total_accomodation_cost += offer.services.filter(service_type='AC').aggregate(sgl_sum=Sum('sgl'))['sgl_sum']
                    elif room_type == 'dbl':
                        total_accomodation_cost += offer.services.filter(service_type='AC').aggregate(dbl_sum=Sum('dbl'))['dbl_sum']
                    elif room_type == 'twin':
                        total_accomodation_cost += offer.services.filter(service_type='AC').aggregate(twin_sum=Sum('twin'))['twin_sum']
                    elif room_type == 'trpl':
                        total_accomodation_cost += offer.services.filter(service_type='AC').aggregate(trpl_sum=Sum('trpl'))['trpl_sum']
                    elif room_type == 'quad':
                        total_accomodation_cost += offer.services.filter(service_type='AC').aggregate(quad_sum=Sum('quad'))['quad_sum']

                    total_accomodation_cost += (total_accomodation_cost * offer.profit) / 100

                    if offer.number_of_people != 0:
                        total_cost = total_accomodation_cost + (common_cost / offer.number_of_people) + non_common_cost
                    else:
                        context['errormsg'] = "Offer's number of people has to be greater than 0"
                        return Response(data=context, status=400)

                    if total_accomodation_cost > 0:
                        init_table_data.append([room_type_full, f'{currency_dict[offer.currency]} {"{:.2f}".format((round(total_cost)))}'])

            elif offer.offer_type == 'BS':
                init_table_data = [[" "]]
                parts.append(Paragraph("<font size=12 name='Roboto-Regular'><b>Είμαστε στην ευχάριστη θέση να μοιραστούμε μαζί σας την παρακάτω προσφορά :</b></font>",  styles["Left"]))
                parts.append(Spacer(1, 10))
                init_table_data = [[pricing_im, 'Τιμές ανά άτομο: ']]

                if scale_type == 'tiered':
                    for key, value in the_scale.items():
                        init_table_data.append(['', '• ' + key, f'{currency_dict[offer.currency]} {"{:.2f}".format((round(ac_cost_total + (common_cost / value) + non_common_cost, 0)))}'])
                else:
                    for i in range(scale_range_min, scale_range_max + 1):
                        init_table_data.append(
                            ['', '• ' + str(i) + " PAX", f'{currency_dict[offer.currency]} {"{:.2f}".format((round(ac_cost_total + (common_cost / i - 1) + non_common_cost, 0)))}']
                        )

        elif offer.doc_type == 'B2CGR':
            pass

        table = Table(
            init_table_data,
            hAlign='LEFT',
            style=[
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ('FONT', (0, 0), (-1, -1), 'Roboto-Regular', 11),
                ('FONT', (0, 0), (4, 0), 'Roboto-Regular', 14),
                ("LINEBELOW", (0, 0), (-1, 0), 1, colors.black),
            ]
        )
        parts.append(table)
        parts.append(Spacer(1, 10))

        # # # # # # # # # # # #
        # # # 4) Details # # #
        # # # # # # # # # # # #
        init_table_data = []
        templates = offer.text_templates.filter(type='AI')
        if templates.count() > 0:
            for template in templates:
                formatted_template = ''
                for i, letter in enumerate(template.text):
                    if i % 120 == 0:
                        formatted_template += '\n'
                    formatted_template += letter
                init_table_data.append([f'• {template.text}'])

            table = Table(
                init_table_data,
                hAlign='LEFT',
                style=[
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ('FONT', (0, 0), (-1, -1), 'Roboto-Regular', 10),
                ]
            )
            parts.append(table)
            parts.append(Spacer(2, 20))

        # # # # # # # # # # # #
        # # # 5) Itinerary # # #
        # # # # # # # # # # # #
        if "GR" in offer.doc_type:
            init_table_data = [[itinerary_im, 'ΔΡΟΜΟΛΟΓΙΟ', f"({offer.nights.all().count()} Διανυκτερεύσεις)"]]
            location_count = {}
            for night in offer.nights.all():
                key = night.location
                location_count[key] = location_count.get(key, 0) + 1
            for location, count in location_count.items():
                init_table_data.append(['', f"• {count} {'Διανυκτέρευση' if count == 1 else 'Διανυκτερεύσεις'}", f"{location}"])
        else:
            init_table_data = [[itinerary_im, 'ITINERARY', f"({offer.nights.all().count()} Nights)"]]
            location_count = {}
            for night in offer.nights.all():
                key = night.location
                location_count[key] = location_count.get(key, 0) + 1
            for location, count in location_count.items():
                init_table_data.append(['', f"• {count} {'Night' if count == 1 else 'Nights'}", f"{location}"])

        table = Table(
            init_table_data,
            hAlign='LEFT',
            style=[
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ('FONT', (0, 0), (-1, -1), 'Roboto-Regular', 10),
                ('FONT', (0, 0), (4, 0), 'Roboto-Regular', 14),
                ("LINEBELOW", (0, 0), (-1, 0), 1, colors.black),
            ]
        )
        parts.append(table)
        parts.append(Spacer(2, 20))

        # # # # # # # # # # # #
        # # # 6) Included # # #
        # # # # # # # # # # # #
        init_table_data = []
        if "GR" in offer.doc_type:
            init_table_data.append([included_im, 'Περιλαμβάνονται'])
        else:
            init_table_data.append([included_im, 'Included'])

        templates = offer.text_templates.filter(type='I')

        if templates.count() > 0:
            for template in templates:
                formatted_template = ''
                for i, letter in enumerate(template.text):
                    if i % 90 == 0:
                        formatted_template += '\n'
                    formatted_template += letter
                init_table_data.append(['', f'• {template.text}'])

            table = Table(
                init_table_data,
                hAlign='LEFT',
                style=[
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ('FONT', (0, 0), (-1, -1), 'Roboto-Regular', 10),
                    ('FONT', (0, 0), (4, 0), 'Roboto-Regular', 14),
                    ("LINEBELOW", (0, 0), (-1, 0), 1, colors.black),
                    ('TEXTCOLOR', (1, 1), (-1, -1), colors.green),
                ]
            )
            parts.append(table)
            parts.append(Spacer(2, 20))

        # # # # # # # # # # # # # #
        # # # 7) Not Included # # #
        # # # # # # # # # # # # # #
        init_table_data = []
        if "GR" in offer.doc_type:
            init_table_data.append([not_included_im, 'Δεν Περιλαμβάνονται'])
        else:
            init_table_data.append([not_included_im, 'Not Included'])

        templates = offer.text_templates.filter(type='NI')

        if templates.count() > 0:
            for template in templates:
                formatted_template = ''
                for i, letter in enumerate(template.text):
                    if i % 90 == 0:
                        formatted_template += '\n'
                    formatted_template += letter
                init_table_data.append(['', '• ' + str(formatted_template.replace("\n", "", 1))])

            table = Table(
                init_table_data,
                hAlign='LEFT',
                style=[
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ('FONT', (0, 0), (-1, -1), 'Roboto-Regular', 10),
                    ('FONT', (0, 0), (4, 0), 'Roboto-Regular', 14),
                    ("LINEBELOW", (0, 0), (-1, 0), 1, colors.black),
                    ('TEXTCOLOR', (1, 1), (-1, -1), colors.red),
                ]
            )
            parts.append(table)
            parts.append(Spacer(2, 20))

        # # # # # # # # # # #
        # # # 8) Notes  # # #
        # # # # # # # # # # #
        init_table_data = []
        if "GR" in offer.doc_type:
            init_table_data.append([notes_im, 'Σημειώσεις'])
        else:
            init_table_data.append([notes_im, 'Notes'])

        templates = offer.text_templates.filter(type='N')

        if templates.count() > 0:
            for template in templates:
                formatted_template = ''
                for i, letter in enumerate(template.text):
                    if i % 90 == 0:
                        formatted_template += '\n'
                    formatted_template += letter
                init_table_data.append(['', '• ' + str(formatted_template.replace("\n", "", 1))])

            table = Table(
                init_table_data,
                hAlign='LEFT',
                style=[
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ('FONT', (0, 0), (-1, -1), 'Roboto-Regular', 10),
                    ('FONT', (0, 0), (4, 0), 'Roboto-Regular', 14),
                    ("LINEBELOW", (0, 0), (-1, 0), 1, colors.black),
                ]
            )
            parts.append(table)
            parts.append(Spacer(2, 20))

        # # # # # # # # # # # # # #
        # # # 9) Entry Prices # # #
        # # # # # # # # # # # # # #
        init_table_data = []
        if "GR" in offer.doc_type:
            init_table_data.append([entry_prices_im, 'Τιμές Εισόδου'])
        else:
            init_table_data.append([entry_prices_im, 'Entry Prices'])

        templates = offer.text_templates.filter(type='EP')

        if templates.count() > 0:
            for template in templates:
                formatted_template = ''
                for i, letter in enumerate(template.text):
                    if i % 90 == 0:
                        formatted_template += '\n'
                    formatted_template += letter
                init_table_data.append(['', '• ' + str(formatted_template.replace("\n", "", 1))])

            table = Table(
                init_table_data,
                hAlign='LEFT',
                style=[
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ('FONT', (0, 0), (-1, -1), 'Roboto-Regular', 10),
                    ('FONT', (0, 0), (4, 0), 'Roboto-Regular', 14),
                    ("LINEBELOW", (0, 0), (-1, 0), 1, colors.black),
                ]
            )
            parts.append(table)
            parts.append(Spacer(2, 20))

        # # # # # # # # # # # # # # # # # # # # # # # #
        # # # 10) PAYMENT AND CANCELLATION POLICY # # #
        # # # # # # # # # # # # # # # # # # # # # # # #
        init_table_data = []
        if "GR" in offer.doc_type:
            init_table_data.append([payment_im, 'Πολιτική Πληρωμών και Ακυρώσεων'])
        else:
            init_table_data.append([payment_im, 'Payment & Cancellation Policy'])

        templates = offer.text_templates.filter(type='PC')

        if templates.count() > 0:
            for template in templates:
                formatted_template = ''
                for i, letter in enumerate(template.text):
                    if i % 90 == 0:
                        formatted_template += '\n'
                    formatted_template += letter
                init_table_data.append(['', '• ' + str(formatted_template.replace("\n", "", 1))])

            table = Table(
                init_table_data,
                hAlign='LEFT',
                style=[
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ('FONT', (0, 0), (-1, -1), 'Roboto-Regular', 10),
                    ('FONT', (0, 0), (4, 0), 'Roboto-Regular', 14),
                    ("LINEBELOW", (0, 0), (-1, 0), 1, colors.black),
                ]
            )
            parts.append(table)
            parts.append(Spacer(2, 20))

        # # # # # # # # # # # # # # # #
        # # # 11) CHILDREN POLICY # # #
        # # # # # # # # # # # # # # # #
        init_table_data = []
        if "GR" in offer.doc_type:
            init_table_data.append([child_im, 'Πολιτική για παιδιά'])
        else:
            init_table_data.append([child_im, 'Children Policy'])

        templates = offer.text_templates.filter(type='CP')

        if templates.count() > 0:
            for template in templates:
                formatted_template = ''
                for i, letter in enumerate(template.text):
                    if i % 90 == 0:
                        formatted_template += '\n'
                    formatted_template += letter
                init_table_data.append(['', '• ' + str(formatted_template.replace("\n", "", 1))])

            table = Table(
                init_table_data,
                hAlign='LEFT',
                style=[
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ('FONT', (0, 0), (-1, -1), 'Roboto-Regular', 10),
                    ('FONT', (0, 0), (4, 0), 'Roboto-Regular', 14),
                    ("LINEBELOW", (0, 0), (-1, 0), 1, colors.black),
                ]
            )
            parts.append(table)
            parts.append(Spacer(4, 40))

            # Start map on a new page.
            # parts.append(PageBreak())

        # # # # # # # # # # # #
        # # # # 12) MAP # # # #
        # # # # # # # # # # # #
        if request.GET.get('include_map') and offer.nights.count() > 0:
            if "GR" in offer.doc_type:
                init_table_data = [[map_im, 'ΧΑΡΤΗΣ'], ]
            else:
                init_table_data = [[map_im, 'MAP'], ]
            table = Table(
                init_table_data,
                hAlign='LEFT',
                style=[
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ('FONT', (0, 0), (-1, -1), 'Roboto-Regular', 10),
                    ('FONT', (0, 0), (4, 0), 'Roboto-Regular', 14),
                    ("LINEBELOW", (0, 0), (-1, 0), 1, colors.black),
                ]
            )

            start_point = min(offer.nights.all(), key=lambda night: night.index, default=None)
            end_point = max(offer.nights.all(), key=lambda night: night.index, default=None)
            waypoints = [night for night in offer.nights.all() if night != start_point and night != end_point]

            key = 'AIzaSyDZ84j6p11XCwuAfAge8IoOu2a-omdTCbc'

            try:
                if start_point is not None and end_point is not None:
                    directions_url = f'https://maps.googleapis.com/maps/api/directions/json?origin={start_point}&destination={end_point}'
                    if len(waypoints) > 0:
                        directions_url += "&waypoints="
                        for waypoint in waypoints:
                            directions_url += waypoint.location + '|'
                    directions_url += f"&key={key}"
                    response = requests.get(directions_url)

                    data = response.json()
                    polyline = data['routes'][0]['overview_polyline']['points']  # Not needed for static map markers

                # place = Place.objects.get(city=start_point.location.split(' - ')[1], country=start_point.location.split(' - ')[0])
                # center = f'{place.lat}, {place.lng}'
            except Exception as a:
                print(a)

            url = "https://maps.googleapis.com/maps/api/staticmap?"
            url += f"zoom={request.GET.get('zoom')}"
            url += '&size=1000x1000'
            # url += f'&center={center}'
            url += f"&maptype={request.GET.get('map_type')}"

            # Start point labeled as "1"
            encoded_location = quote_plus(start_point.location)
            url += f'&markers=color:red%7Clabel:1%7C{encoded_location}'

            # Waypoints with numbers starting from "2"
            for idx, waypoint in enumerate(waypoints, 2):
                encoded_location = quote_plus(waypoint.location)
                url += f'&markers=color:red%7Clabel:{idx}%7C{encoded_location}'

            # End point labeled with the last number
            last_number = len(waypoints) + 2  # Because start is "1" and waypoints start from "2"
            encoded_location = quote_plus(end_point.location)
            url += f'&markers=color:red%7Clabel:{last_number}%7C{encoded_location}'
            url += f'&path=enc:{polyline}'
            url += f'&key={key}'

            # Now, fetch the static map image and save it as before:
            response = requests.get(url, stream=True)
            response.raise_for_status()

            with open(os.path.join(BASE_DIR, 'static', 'offers', 'maps', f"{offer.id}_map.png"), "wb") as file:
                file.write(response.content)

            map_image = Image(os.path.join(BASE_DIR, 'static', 'offers', 'maps', f"{offer.id}_map.png"), 5.5 * inch, 5.5 * inch,  hAlign='LEFT')

            parts.append(table)
            parts.append(Spacer(4, 40))

            init_table_data = [[map_image], ]

            table = Table(init_table_data,)
            parts.append(table)
            parts.append(Spacer(2, 20))

        # # # # # # # # # # # #
        # # # 13) Epilogue # # #
        # # # # # # # # # # # #
        templates = offer.text_templates.filter(type='EL')
        if templates.count() > 0:
            for template in templates:
                parts.append(Paragraph(f"<font size=12 name='Roboto-Regular'><i>{template}</i></font>", styles["Left"]))
                parts.append(Spacer(2, 20))
        parts.append(Spacer(2, 20))

        if "GR" not in offer.doc_type:
            parts.append(Paragraph("Print Date : " + str(datetime.date.today()), styles["Center"]))
        else:
            parts.append(Paragraph("<font size=12 name='Roboto-Regular'>Ημερομηνία εκτύπωσης</font> : " + str(datetime.date.today()), styles["Center"]))

        doc = SimpleDocTemplate(
            pdftitle,
            pagesize=(8.27 * inch, 11.69 * inch),
            rightMargin=20,
            leftMargin=20,
            topMargin=20,
            bottomMargin=20,
        )

        doc.build(parts)
        pdf_contents = ''
        f = open(pdftitle, 'rb')
        pdf_contents = f.read()
        f.close()
        filename = offer_id + '_' + offer_type + '_' + datetime.datetime.now().strftime("%d-%m-%Y") + '.pdf'
        temp = HttpResponse(pdf_contents, content_type='application/pdf')
        temp['Content-Disposition'] = 'attachment; filename=' + filename
        return temp
