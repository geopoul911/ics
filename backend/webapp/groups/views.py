from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics
from rest_framework.response import Response
from webapp.serializers import (
    RoomingListSerializer,
    ServiceSerializer,
)
from rest_framework.authtoken.models import Token
from webapp.xhr import update_notifications

# from django.shortcuts import render
from webapp.models import (
    GroupTransfer,
    TravelDay,
    Offer,
    Hotel,
    Contact,
    Coach,
    DocRoomingList,
    Airport,
    RailwayStation,
    Service,
    Port,
)

import re
import datetime
from django.shortcuts import get_object_or_404
from webapp.serializers import (
    GroupSerializer,
    OfferSerializer,
)

from dateutil import relativedelta
from django.db.models import Q

from accounts.permissions import (
    can_view,
    can_delete,
)

BANKS = {
    'AB': 'Alpha bank',
    'EB': 'Eurobank',
    'PIR': 'Piraeus',
    'NBG': 'NBG',
    'HSBC': 'HSBC',
    'MB': 'Metro bank',
}

PAYMENT_TYPES = {
    'CC': 'Credit Card',
    'DC': 'Debit Card',
    'CS': 'Cash',
    'BT': 'Bank Transfer',
}


# Get user from token
def get_user(token):
    return Token.objects.get(key=token).user


# This function updates roominglists, it is called on group view
def update_roominglists(group_transfer):
    """Updates the rooming lists.
    Usually called when hotels change.
    """
    # get the unique hotels for this group
    hotels = []
    hotel_nights = []

    transel_agent = Contact.objects.get(id=604)  # Cosmoplan agent with roominglist@cosmoplan.co.uk as email

    # Loop over traveldays to get their hotels
    for h in group_transfer.group_travelday.values('hotel'):
        hotel_id = h['hotel']
        if hotel_id:
            hotel = Hotel.objects.get(id=hotel_id)
            if hotel not in hotels:
                hotels.append(hotel)
    # Loop Over hotels
    for hotel in hotels:
        hotel_days = [day for day in group_transfer.group_travelday.all() if day.hotel == hotel]
        temp = "%d Nights: " % len(hotel_days)
        temp += "%s" % datetime.date.strftime(hotel_days[0].date, '%d %b %Y')
        if len(hotel_days) > 1:
            temp += " to %s" % datetime.date.strftime(
                hotel_days[-1].date + datetime.timedelta(days=1),
                '%d %b %Y')
        hotel_nights.append(temp)

    # Get each hotel's roominglist
    for i, hotel in enumerate(hotels):
        try:
            rooming_list = DocRoomingList.objects.get(
                group_transfer=group_transfer,
                hotel=hotel
            )
            rooming_list.doc_Date = TravelDay.objects.filter(
                hotel=hotel,
                group_transfer=group_transfer
            ).order_by('date')[0].date
            rooming_list.doc_nights = hotel_nights[i]
            rooming_list.save()

        # If it does not exist, create it
        except DocRoomingList.DoesNotExist:
            rooming_list = DocRoomingList()
            rooming_list.group_transfer = group_transfer
            rooming_list.hotel = hotel
            rooming_list.doc_From = transel_agent
            rooming_list.doc_Date = TravelDay.objects.filter(
                hotel=hotel,
                group_transfer=group_transfer
            ).order_by('date')[0].date
            rooming_list.doc_Attn = hotel.contact
            rooming_list.doc_Ref = hotel.contact
            rooming_list.doc_To = hotel.contact
            rooming_list.text = ''
            rooming_list.doc_nights = hotel_nights[i]
            rooming_list.save()

    # Delete rooming lists that do not match hotel anymore
    for rl in DocRoomingList.objects.filter(group_transfer=group_transfer):
        if rl.hotel not in hotels:
            rl.delete()


class AllGroups(generics.RetrieveAPIView):
    """
    URL: all_groups/
    Descr: Returns array of all groups
    """

    # Cross site request forgery
    @csrf_exempt
    def get(self, request):
        context = {"request": request, "errormsg": ''}
        token_str = request.headers.get('User-Token', None)
        user = get_user(token_str)

        # Permission
        if not can_view(user.id, 'GT'):
            context = {"errormsg": "You do not have permission to view all groups."}
            return Response(status=401, data=context)

        can_view_COA = not can_view(user.id, 'COA')
        can_view_COL = not can_view(user.id, 'COL')

        groups_data = []
        from django.db import connection

        cursor = connection.cursor()
        query = """
            SELECT
                WEBAPP_GROUPTRANSFER.id,
                refcode,
                agent_id,
                client_id,
                webapp_agent.name AS agent_name,
                webapp_client.name AS client_name,
                agents_refcode,
                clients_refcode,
                status,
                departure,
                COALESCE(webapp_agent_nationality.name, webapp_client_nationality.name) AS nationality_name,
                COALESCE(webapp_agent_nationality.code, webapp_client_nationality.code) AS nationality_code,
                number_of_people,
                CASE
                    WHEN WEBAPP_GROUPTRANSFER.agent_id IS NOT NULL THEN webapp_agent.abbreviation
                    WHEN WEBAPP_GROUPTRANSFER.client_id IS NOT NULL THEN webapp_client.abbreviation
                    ELSE ''
                END AS abbreviation,
                CASE
                    WHEN (CASE WHEN WEBAPP_GROUPTRANSFER.agent_id IS NOT NULL THEN webapp_agent.abbreviation ELSE webapp_client.abbreviation END IS NOT NULL AND
                        CASE WHEN WEBAPP_GROUPTRANSFER.agent_id IS NOT NULL THEN webapp_agent.abbreviation ELSE webapp_client.abbreviation END != '') THEN
                        REPLACE(refcode, CASE WHEN WEBAPP_GROUPTRANSFER.agent_id IS NOT NULL THEN webapp_agent.abbreviation ELSE webapp_client.abbreviation END, '')
                    ELSE
                        refcode
                END AS modified_refcode,
                TO_DATE(LEFT(REGEXP_REPLACE(CASE
                    WHEN (CASE WHEN WEBAPP_GROUPTRANSFER.agent_id IS NOT NULL THEN webapp_agent.abbreviation ELSE webapp_client.abbreviation END IS NOT NULL AND
                        CASE WHEN WEBAPP_GROUPTRANSFER.agent_id IS NOT NULL THEN webapp_agent.abbreviation ELSE webapp_client.abbreviation END != '') THEN
                        REPLACE(refcode, CASE WHEN WEBAPP_GROUPTRANSFER.agent_id IS NOT NULL THEN webapp_agent.abbreviation ELSE webapp_client.abbreviation END, '')
                    ELSE
                        refcode
                END, '[^0-9]', '', 'g'), 8), 'DDMMYYYY') AS modified_refcode_date,
                CASE WHEN WEBAPP_PROFORMA.is_issued THEN true ELSE false END AS proforma
            FROM WEBAPP_GROUPTRANSFER
            LEFT JOIN WEBAPP_AGENT ON WEBAPP_GROUPTRANSFER.agent_id = webapp_agent.id
            LEFT JOIN WEBAPP_CLIENT ON WEBAPP_GROUPTRANSFER.client_id = webapp_client.id
            LEFT JOIN WEBAPP_COUNTRY AS webapp_agent_nationality ON webapp_agent_nationality.id = webapp_agent.nationality_id
            LEFT JOIN WEBAPP_COUNTRY AS webapp_client_nationality ON webapp_client_nationality.id = webapp_client.nationality_id
            LEFT JOIN WEBAPP_PROFORMA ON WEBAPP_PROFORMA.id = WEBAPP_GROUPTRANSFER.proforma_id
            WHERE (NOT (LEFT(refcode, 3) = 'COA' AND %s) AND NOT (LEFT(refcode, 3) = 'COL' AND %s))
            ORDER BY modified_refcode_date DESC;
        """
        cursor.execute(query, (can_view_COA, can_view_COL))

        for row in cursor.fetchall():
            agents_refcode = row[6] if row[6] is not None else None
            clients_refcode = row[7] if row[7] is not None else None

            if agents_refcode:
                refcode_combined = agents_refcode
            elif clients_refcode:
                refcode_combined = clients_refcode
            else:
                refcode_combined = 'N/A'

            groups_data.append({
                'id': row[0],
                'refcode': row[1],
                'agent_or_client': 'Agent' if row[2] else 'Client',
                'agent_id': row[2],
                'client_id': row[3],
                'agent_name': row[4],
                'client_name': row[5],
                'agents_refcode': agents_refcode or 'N/A',
                'clients_refcode': clients_refcode or 'N/A',
                'agent_refcode': refcode_combined,
                'status': 'Confirmed' if row[8] == '5' else 'Cancelled',
                'departure_date': row[9].split('-')[0],
                'nationality': row[10],
                'nationality_code': row[11],
                'number_of_people': row[12],
                'abbreviation': row[13],
                'proforma': row[16],
            })
        return Response({'all_groups': groups_data})


class GroupView(generics.ListAPIView):
    """
    URL: group/(?P<refcode>.*)$
    Descr: Get Group's Data
    """

    serializer_class = GroupSerializer

    # Cross site request forgery
    @csrf_exempt
    def get(self, request, refcode):
        context = {"request": request, "errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_view(user.id, 'GT'):
            context = {"errormsg": "You do not have permission to view Group."}
            return Response(status=401, data=context)

        can_view_COA = can_view(user.id, 'COA')
        can_view_COL = can_view(user.id, 'COL')

        # Get group with prefetched related data
        group = get_object_or_404(
            GroupTransfer.objects.prefetch_related(
                'group_travelday',
                'group_travelday__driver',
                'group_travelday__coach',
                'group_travelday__coach__coach_operator',
                'group_travelday__travelday_service'
            ),
            refcode=refcode
        )

        if (group.refcode.startswith('COA') and not can_view_COA) or (group.refcode.startswith('COL') and not can_view_COL):
            context = {"errormsg": "You do not have permission to view Group."}
            return Response(status=401, data=context)

        # Get traveldays from prefetched data
        traveldays = group.group_travelday.all()
        coach_info_data = []
        period_dict = []

        # If group has days
        if traveldays:
            prev_driver = traveldays[0].driver
            prev_coach = traveldays[0].coach
            period_dict.append({
                'driver': prev_driver,
                'coach': prev_coach,
                'starting_period': traveldays[0].date,
                'ending_period': traveldays[0].date
            })

            # This loop uses day's previous driver and coach
            for travelday in traveldays[1:]:
                driver = travelday.driver
                coach = travelday.coach
                if driver != prev_driver or coach != prev_coach:
                    period_dict.append({
                        'driver': driver,
                        'coach': coach,
                        'starting_period': travelday.date,
                        'ending_period': travelday.date
                    })
                else:
                    period_dict[-1]['ending_period'] = travelday.date
                prev_driver = driver
                prev_coach = coach

            # Instead of days, we divide rows in periods for each driver.
            for period in period_dict:
                period_string = f"{datetime.datetime.strftime(period['starting_period'], '%d/%m/%Y')} - \
                    {datetime.datetime.strftime(period['ending_period'], '%d/%m/%Y')}"
                driver = period['driver'].name if period['driver'] else 'N/A'
                coach_operator, coach_make, coach_plate_num, coach_seats = 'N/A', 'N/A', 'N/A', 'N/A'
                coach_operator_id = None
                if period['coach']:
                    coach_operator = period['coach'].coach_operator.name
                    coach_operator_id = period['coach'].coach_operator.id
                    coach_make = period['coach'].make
                    coach_plate_num = period['coach'].plate_number
                    coach_seats = period['coach'].number_of_seats if period['coach'].number_of_seats else 'N/A'

                driver = period['driver'] if period['driver'] else None
                coach = period['coach'] if period['coach'] else None
                if driver is not None:
                    coach_info_data.append({
                        'period': period_string,
                        'driver': driver.name,
                        'driver_id': driver.id,
                        'coach_operator': coach_operator,
                        'coach_operator_id': coach_operator_id,
                        'coach_make': coach_make,
                        'coach_plate_num': coach_plate_num,
                        'coach_seats': coach_seats,
                    })

        # Initialize location variables
        arrival_lat = None
        arrival_lng = None
        departure_lat = None
        departure_lng = None

        # Get all locations in a single query
        locations = {}
        if group.arrival_type == 'AIR' and group.arrival != 'N/A':
            p = re.compile(r'(?<![A-Z])[A-Z]{3}(?![A-Z])')
            arrival = p.search(group.arrival.split(' -- ')[-1]).group()
            locations['arrival'] = arrival
        elif group.arrival_type == 'SEA':
            locations['arrival_port'] = group.arrival.split(" - ")[1]
        elif group.arrival_type == 'TRN':
            locations['arrival_station'] = group.arrival.split(" - ")[1]

        if group.departure_type == 'AIR' and group.departure != 'N/A':
            p = re.compile(r'(?<![A-Z])[A-Z]{3}(?![A-Z])')
            departure = p.search(group.departure.split(' -- ')[-1]).group()
            locations['departure'] = departure
        elif group.departure_type == 'SEA':
            locations['departure_port'] = group.departure.split(" - ")[1]
        elif group.departure_type == 'TRN':
            locations['departure_station'] = group.departure.split(" - ")[1]

        # Fetch all locations in a single query
        if locations:
            if 'arrival' in locations:
                airport = Airport.objects.filter(name=locations['arrival']).values('lat', 'lng').first()
                if airport:
                    arrival_lat = airport['lat']
                    arrival_lng = airport['lng']
            elif 'arrival_port' in locations:
                port = Port.objects.filter(name=locations['arrival_port']).values('lat', 'lng').first()
                if port:
                    arrival_lat = port['lat']
                    arrival_lng = port['lng']
            elif 'arrival_station' in locations:
                station = RailwayStation.objects.filter(name=locations['arrival_station']).values('lat', 'lng').first()
                if station:
                    arrival_lat = station['lat']
                    arrival_lng = station['lng']

            if 'departure' in locations:
                airport = Airport.objects.filter(name=locations['departure']).values('lat', 'lng').first()
                if airport:
                    departure_lat = airport['lat']
                    departure_lng = airport['lng']
            elif 'departure_port' in locations:
                port = Port.objects.filter(name=locations['departure_port']).values('lat', 'lng').first()
                if port:
                    departure_lat = port['lat']
                    departure_lng = port['lng']
            elif 'departure_station' in locations:
                station = RailwayStation.objects.filter(name=locations['departure_station']).values('lat', 'lng').first()
                if station:
                    departure_lat = station['lat']
                    departure_lng = station['lng']

        # Each time this class is called, update the rooming lists
        update_roominglists(group)

        # Get cabin lists from prefetched data
        cabin_lists = [service for travelday in traveldays for service in travelday.travelday_service.all() 
                      if service.booking_ref and service.ferry_ticket_agency and service.ferry_ticket_agency.name == 'STENA LINE']

        return Response({
            'group': self.get_serializer(group, context={'request': self.request}).data,
            'coach_info_data': coach_info_data,
            'departure_lat': departure_lat,
            'departure_lng': departure_lng,
            'arrival_lat': arrival_lat,
            'arrival_lng': arrival_lng,
            'can_del': can_delete(user.id, 'GT'),
            'cabin_lists': ServiceSerializer(cabin_lists, many=True).data,
        })


class RoomingListView(generics.ListAPIView):
    """
    URL: rooming_list_view/(?P<refcode>.*)$
    If rooming list does not exists, we create it.
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def get(self, request, refcode):
        token_str = request.headers['User-Token']
        user = get_user(token_str)
        context = {"errormsg": ''}

        # Permission
        if not can_view(user.id, 'GT'):
            context = {"errormsg": "You do not have permission to view a Group's rooming list."}
            return Response(status=401, data=context)

        # Get Group
        group = GroupTransfer.objects.get(refcode=refcode)

        # Get Hotel
        hotel = Hotel.objects.get(name=request.GET.get('hotel_name'))

        # Get Rooming list
        RoomingList = DocRoomingList.objects.get(hotel_id=hotel.id, group_transfer_id=group.id)
        context['rooming_list'] = RoomingListSerializer(RoomingList).data
        return Response(data=context, status=200)


class AllGroupOffers(generics.RetrieveAPIView):
    """
    URL: all_group_offers/
    Descr: Returns array of all offers
    """

    # Cross site request forgery
    @csrf_exempt
    def get(self, request):
        context = {"request": request, "errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_view(user.id, 'OFF'):
            context = {"errormsg": "You do not have permission to view All Offers."}
            return Response(status=401, data=context)

        # Get all groups
        offers = Offer.objects.all().order_by('-id')
        offers_data = []

        # Add data to list
        for offer in offers:
            offers_data.append({
                'id': offer.id,
                'name': offer.name,
                'offer_type': offer.offer_type,
                'doc_type': offer.doc_type,
                'currency': offer.currency,
                'period': offer.period,
                'destination': offer.destination,
                'number_of_people': offer.number_of_people,
                'profit': offer.profit,
                'cancellation_deadline': offer.cancellation_deadline,
                'date_created': offer.date_created,
            })

        return Response({
            'all_offers': offers_data,
        })


class OfferView(generics.ListAPIView):
    """
    URL: offer/(?P<offer_id>.*)$
    Descr:  Get Offer's Data
    """

    serializer_class = OfferSerializer

    # Cross site request forgery
    @csrf_exempt
    def get(self, request, offer_id):
        context = {"request": request, "errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_view(user.id, 'OFF'):
            context = {"errormsg": "You do not have permission to view an Offer."}
            return Response(status=401, data=context)

        # Get Offer
        offer = get_object_or_404(Offer, id=offer_id)
        return Response({
            'offer': self.get_serializer(offer, context={'request': self.request}).data,
        })


class CoachAvailability(generics.RetrieveAPIView):
    """
    URL: coach_availability/
    Descr: Gets available dates per coach.
    """

    # Cross site request forgery
    @csrf_exempt
    def get(self, request):
        context = {"request": request, "errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_view(user.id, 'CO'):
            context = {"errormsg": "You do not have permission to view Coach Availability."}
            return Response(status=401, data=context)

        # Get coach
        selected_coach = request.GET['selected_coach']

        if selected_coach == 'None':
            coaches = Coach.objects.all().order_by('-id')
        else:
            coaches = [Coach.objects.get(id=request.GET['selected_coach'].split(')')[0])]

        all_coaches_data = []

        for coach in coaches:
            all_coaches_data.append({'id': coach.id, 'name': str(coach), })

        return Response({
            'all_coaches_data': all_coaches_data,
        })


class GetCoachHeatmap(generics.RetrieveAPIView):
    """
    URL: get_coach_heatmap/
    Descr: Gets available dates per coach.
    """

    # Cross site request forgery
    @csrf_exempt
    def get(self, request):
        context = {"request": request, "errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_view(user.id, 'CO'):
            context = {"errormsg": "You do not have permission to view Coach Availability."}
            return Response(status=401, data=context)

        # Get coach
        coach_id = request.GET['coach_id']
        coach_heatmap = []

        first_day = datetime.datetime.now().replace(
            day=1, hour=0, minute=0, second=0, microsecond=0
        ) - datetime.timedelta(days=7)

        # Get month's last day, plus next month's 7 days
        last_day = datetime.datetime.today() + relativedelta.relativedelta(day=31) + datetime.timedelta(days=7)

        delta = datetime.timedelta(days=1)
        while first_day <= last_day:
            if TravelDay.objects.filter(coach_id=coach_id, date=first_day).count() == 0:
                day_value = True
            else:
                day_value = GroupTransfer.objects.get(id=TravelDay.objects.get(coach_id=coach_id, date=first_day).group_transfer_id).refcode

            coach_heatmap.append({
                str(first_day.date()): day_value
            })
            first_day += delta

        return Response({
            'coach_heatmap': coach_heatmap,
        })


class DriverAvailability(generics.RetrieveAPIView):
    """
    URL: driver_availability/
    Descr: Gets available dates per driver.
    """

    # Cross site request forgery
    @csrf_exempt
    def get(self, request):
        context = {"request": request, "errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_view(user.id, 'DRV'):
            context = {"errormsg": "You do not have permission to view Driver Availability."}
            return Response(status=401, data=context)

        # Get driver
        selected_driver = request.GET['selected_driver']

        if selected_driver == 'None':
            drivers = Contact.objects.filter(type='D').order_by('-id')
        else:
            drivers = [Contact.objects.get(id=request.GET['selected_driver'].split(')')[0])]

        all_drivers_data = []

        for driver in drivers:
            all_drivers_data.append({
                'id': driver.id,
                'name': str(driver),
            })

        return Response({
            'all_drivers_data': all_drivers_data,
        })


class GetDriverHeatmap(generics.RetrieveAPIView):
    """
    URL: get_driver_heatmap/
    Descr: Gets available dates per driver.
    """

    # Cross site request forgery
    @csrf_exempt
    def get(self, request):
        context = {"request": request, "errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_view(user.id, 'DRV'):
            context = {"errormsg": "You do not have permission to view Driver Availability."}
            return Response(status=401, data=context)

        # Get driver
        driver_id = request.GET['driver_id']
        driver_heatmap = []

        first_day = datetime.datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0) - datetime.timedelta(days=7)

        # Get month's last day, plus next month's 7 days
        last_day = datetime.datetime.today() + relativedelta.relativedelta(day=31) + datetime.timedelta(days=7)

        delta = datetime.timedelta(days=1)
        while first_day <= last_day:
            TravelDay.objects.filter(driver_id=driver_id, date=first_day)
            if TravelDay.objects.filter(driver_id=driver_id, date=first_day).count() == 0:
                day_value = True
            else:
                day_value = GroupTransfer.objects.get(id=TravelDay.objects.get(driver_id=driver_id, date=first_day).group_transfer_id).refcode

            driver_heatmap.append({str(first_day.date()): day_value})
            first_day += delta

        return Response({
            'driver_heatmap': driver_heatmap,
        })


class PendingGroups(generics.RetrieveAPIView):
    """
    URL: pending_groups/
    Descr: Get future groups having no complete data
    """
    # Cross site request forgery
    @csrf_exempt
    def get(self, request):
        context = {"request": request, "errormsg": ''}
        token_str = request.headers.get('User-Token', None)

        if token_str:
            user = get_user(token_str)

            # Permission
            if not can_view(user.id, 'GT'):
                context = {"errormsg": "You do not have permission to view Pending Groups."}
                return Response(status=401, data=context)

            can_view_COA = can_view(user.id, 'COA')
            can_view_COL = can_view(user.id, 'COL')

            groups_data = []
            try:
                show_upcoming = int(request.GET.get('days_timedelta', 0))
            except ValueError:
                show_upcoming = 0

            # Calculate the date range
            start_date = datetime.datetime.today()
            end_date = start_date + datetime.timedelta(days=show_upcoming)

            # Filter groups based on the date range and permissions
            groups = GroupTransfer.objects.filter(Q(arrival='N/A') | Q(departure='N/A') | Q(number_of_people=0), group_travelday__date__range=(start_date, end_date))

            if not can_view_COA:
                groups = groups.exclude(refcode__startswith='COA')
            if not can_view_COL:
                groups = groups.exclude(refcode__startswith='COL')

            group_ids = [group.id for group in groups]

            update_notifications()

            for group_id in set(group_ids):
                group = GroupTransfer.objects.get(id=group_id)
                last_groups_td = group.group_travelday.all().order_by("-date").first()
                all_hotels = False if last_groups_td and last_groups_td.hotel else True
                all_drivers = False if last_groups_td and last_groups_td.driver else True
                all_coaches = False if last_groups_td and last_groups_td.coach else True
                all_leaders = False if last_groups_td and last_groups_td.leader else True
                arrival = False if group.arrival == 'N/A' else True
                departure = False if group.departure == 'N/A' else True
                pax = False if group.number_of_people == 0 else True

                # If group has hotels, drivers, coaches, arrival and departure date, continue looping.
                if all_hotels and all_drivers and all_coaches and all_leaders and arrival and departure and pax:
                    continue

                if group.status == '5':
                    groups_data.append({
                        'id': group.id,
                        'refcode': group.refcode,
                        'arrival': arrival,
                        'departure': departure,
                        'pax': pax,
                        'all_hotels': all_hotels,
                        'all_drivers': all_drivers,
                        'all_coaches': all_coaches,
                        'all_leaders': all_leaders,
                    })

            return Response({'groups_data': groups_data})
        else:
            context = {"errormsg": "User-Token header not provided."}
            return Response(status=400, data=context)
