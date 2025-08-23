# from django.shortcuts import render
from webapp.models import (
    Hotel,
    CoachOperator,
    Restaurant,
    RepairShop,
    History,
    SentEmails,
    CruisingCompany,
    FerryTicketAgency,
    DMC,
    SportEventSupplier,
    TeleferikCompany,
    Theater,
    TrainTicketAgency,
    ParkingLot,
)
from django.core.mail import EmailMultiAlternatives
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics
from rest_framework.response import Response
from accounts.views import get_user
from accounts.models import UserProfile


class GetSurroundingPOIS(generics.ListAPIView):
    """
    URL: get_surrounding_pois/
    Descr: Use raw SQL to get nearby points of interest in a specific Lat/lng
    """

    # Cross site request forgery
    @csrf_exempt
    def get(self, request):

        model_name_to_db_tables = {
            'Coach Operators': 'webapp_coachoperator',
            'Cruising Companies': 'webapp_cruisingcompany',
            'Ferry Ticket Agencies': 'webapp_ferryticketagency',
            'DMCs': 'webapp_dmc',
            'Hotels': 'webapp_hotel',
            'Repair Shops': 'webapp_repairshop',
            'Restaurants': 'webapp_restaurant',
            'Sport Event Suppliers': 'webapp_sporteventsupplier',
            'Teleferik Companies': 'webapp_teleferikcompany',
            'Theaters': 'webapp_theater',
            'Train Ticket Agencies': 'webapp_trainticketagency',
            'Parking Lots': 'webapp_parkinglot',
        }
        pois = []
        object_type = request.GET['object_type']
        lat = request.GET['lat']
        lng = request.GET['lng']
        radius = request.GET['radius']
        restaurant_types = request.GET.getlist('restaurant_types[]')
        repair_shop_types = request.GET.getlist('repair_shop_types[]')
        hotel_rating = ''

        # Use raw SQL to get nearby points of interest
        from django.db import connection
        cursor = connection.cursor()
        cursor.execute("""
            SELECT A.ID, A.name, A.lat, A.lng,
            acos(sin(radians(%s))*sin(radians(lat))
             + cos(radians(%s))*cos(radians(lat))*
             cos(radians(lng-(%s)))) * 6371 AS D
            FROM """ + str(model_name_to_db_tables[object_type]) + """ A
            WHERE acos(sin(radians(%s))*sin(radians(lat)) +
            cos(radians(%s))*cos(radians(lat))*cos(radians(lng-(%s)))) *
            6371 < %s
            """, [lat, lat, lng, lat, lat, lng, str(radius)]
        )

        for row in cursor.fetchall():
            types = []
            language_info = []
            email = ''
            address = ''
            tel = ''

            if object_type == 'Coach Operators':
                coach_op = CoachOperator.objects.get(id=row[0])
                email = coach_op.contact.email

            elif object_type == 'Cruising Companies':
                cruising_company = CruisingCompany.objects.get(id=row[0])
                email = cruising_company.contact.email
                address = cruising_company.contact.address
                tel = cruising_company.contact.tel

            elif object_type == 'Ferry Ticket Agencies':
                ferry_ticket_agency = FerryTicketAgency.objects.get(id=row[0])
                email = ferry_ticket_agency.contact.email
                address = ferry_ticket_agency.contact.address
                tel = ferry_ticket_agency.contact.tel

            elif object_type == 'DMCs':
                dmc = DMC.objects.get(id=row[0])
                email = dmc.contact.email
                address = dmc.contact.address
                tel = dmc.contact.tel

            elif object_type == 'Sport Event Suppliers':
                sport_event_supplier = SportEventSupplier.objects.get(id=row[0])
                email = sport_event_supplier.contact.email
                address = sport_event_supplier.contact.address
                tel = sport_event_supplier.contact.tel

            elif object_type == 'Teleferik Companies':
                teleferik_company = TeleferikCompany.objects.get(id=row[0])
                email = teleferik_company.contact.email
                address = teleferik_company.contact.address
                tel = teleferik_company.contact.tel

            elif object_type == 'Theaters':
                theater = Theater.objects.get(id=row[0])
                email = theater.contact.email
                address = theater.contact.address
                tel = theater.contact.tel

            elif object_type == 'Train Ticket Agencies':
                train_ticket_agency = TrainTicketAgency.objects.get(id=row[0])
                email = train_ticket_agency.contact.email
                address = train_ticket_agency.contact.address
                tel = train_ticket_agency.contact.tel

            elif object_type == 'Parking Lots':
                parking_lot = ParkingLot.objects.get(id=row[0])
                email = parking_lot.contact.email
                address = parking_lot.contact.address
                tel = parking_lot.contact.tel

            elif object_type == 'Restaurants':
                restaurant = Restaurant.objects.get(id=row[0])
                email = restaurant.contact.email
                if len(restaurant_types) > 0:
                    include_the_restaurant = False
                    for rType in restaurant.type.all():
                        if rType.id in [int(i) for i in restaurant_types]:
                            include_the_restaurant = True
                            continue
                    if not include_the_restaurant:
                        continue

                types = [i.icon for i in Restaurant.objects.get(id=row[0]).type.all()]

            elif object_type == 'Repair Shops':
                repair_shop = RepairShop.objects.get(id=row[0])
                email = repair_shop.contact.email
                if len(repair_shop_types) > 0:
                    include_the_repair_shop = False
                    for rType in repair_shop.type.all():
                        if rType.id in [int(i) for i in repair_shop_types]:
                            include_the_repair_shop = True
                            continue
                    if not include_the_repair_shop:
                        continue

                types = [i.icon for i in RepairShop.objects.get(id=row[0]).type.all()]

            elif object_type == 'Hotels':
                hotel = Hotel.objects.get(id=row[0])
                email = hotel.contact.email

            pois.append({
                'id': row[0],
                'name': row[1],
                'type': object_type,
                'lat': row[2],
                'lng': row[3],
                'types': types,
                'language_info': language_info,
                'rating': hotel_rating,
                'email': email,
                'address': address,
                'tel': tel,
            })

        return Response({
            'pois': pois,
        })


class SendMassiveEmail(generics.ListAPIView):
    """
    URL: send_massive_email/
    Descr: Used on reports/maps to send multiple emails to nearby points of interest.
    options : hotels, coach operators, repair shops, restaurants.
    """

    # Cross site request forgery
    @csrf_exempt
    def post(self, request):
        context = {"request": request, "errormsg": '', 'recipients': []}
        token_str = request.headers['User-Token']
        user = get_user(token_str)
        user_profile = UserProfile.objects.get(user_id=user.id)

        # Get message's body
        message = request.data['body']
        selected_pois = request.data['pois']
        recipients = selected_pois.split(",")
        extra_recipients = request.data['recipients']
        context = {"recipients": recipients}

        for extra_recipient in extra_recipients.split(";"):
            if extra_recipient != ' ' and extra_recipient != '':
                recipients.append(extra_recipient.strip())

        recipients.append(user.email)

        for recipient in recipients:
            if recipient == 'N/A' or recipient == '' or recipient == ' ' or recipient is None:
                continue
            send_to = recipient.strip()
            send_from = user.email
            subject = request.data['subject']
            message = request.data['body']

            user_profile = UserProfile.objects.get(user_id=user.id)

            try:
                message += user_profile.signature
            except TypeError:
                pass

            msg = EmailMultiAlternatives(subject, message, send_from, [send_to])
            msg.attach_alternative(message, "text/html")

            try:
                uploaded_file = request.FILES['file'] if request.FILES['file'] else None
                msg.attach(uploaded_file.name, uploaded_file.read(), uploaded_file.content_type)
                attached = True
            except Exception:
                attached = False

            History.objects.create(
                user=user,
                action='UPD',
                model_name='USR',
                description=f'User : {user.username} sent email to : {send_to} with subject: {subject}'
            )

            try:
                msg.send()
            except Exception:
                pass

            SentEmails.objects.create(
                type='M',
                sender=user,
                recipients=str([send_to]),
                subject=subject,
                attached=attached,
            )

        return Response(status=200, data=context)
