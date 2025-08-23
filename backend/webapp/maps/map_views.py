# from django.shortcuts import render
from webapp.models import (
    CoachOperator,
    CruisingCompany,
    FerryTicketAgency,
    DMC,
    Hotel,
    RepairShop,
    Restaurant,
    SportEventSupplier,
    TeleferikCompany,
    Theater,
    TrainTicketAgency,
    TravelDay,
    Contact,
    GroupTransfer,
    Coach,
    ParkingLot,
    Continent,
    Country,
    State,
    City,
    Area,
    Airport,
    EntertainmentProduct,
    EntertainmentSupplier,
    AdvertisementCompany,
    CarHireCompany,
    CharterBroker,
)
import re
from django.db.models import Q
from webapp.serializers import (
    TravelDaySerializer,
)

from rest_framework import generics
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime, timedelta
from rest_framework.authtoken.models import Token
from accounts.permissions import (
    can_view,
)


model_mapping = {
    'Advertisement Companies': AdvertisementCompany,
    'Car Hire': CarHireCompany,
    'Charter Airlines & Brokers': CharterBroker,
    'Coach Operators': CoachOperator,
    'Cruising Companies': CruisingCompany,
    'Ferry Ticket Agencies': FerryTicketAgency,
    'DMCs': DMC,
    'Hotels': Hotel,
    'Repair Shops': RepairShop,
    'Restaurants': Restaurant,
    'Sport Event Suppliers': SportEventSupplier,
    'Teleferik Companies': TeleferikCompany,
    'Theaters': Theater,
    'Train Ticket Agencies': TrainTicketAgency,
    'Parking Lots': ParkingLot,
    'Shows & Entertainment': EntertainmentProduct,
}


# Returns user instance
def get_user(token):
    user = Token.objects.get(key=token).user
    return user


class ShowResults(generics.ListAPIView):
    """
    URL: maps/show_results/
    Descr: Shows selected object's results on a map
    """

    @csrf_exempt
    def get(self, request):
        context = {"errormsg": ''}
        showing = request.GET.get('showing')
        pin = {'name': '', 'lat': 0, 'lng': 0}

        # Get the model class based on the showing parameter
        model = model_mapping.get(showing)
        if not model:
            context = {"errormsg": "Invalid 'showing' parameter"}
            return Response(status=400, data=context)

        # Fetching filter parameters
        continent = request.GET.get('continent', '')
        country = request.GET.get('country', '')
        state = request.GET.get('state', '')
        city = request.GET.get('city', '')

        # Utility function for safe fetching of related objects
        def safe_get(model, **kwargs):
            try:
                return model.objects.get(**kwargs)
            except (model.DoesNotExist, AttributeError):
                return None

        # Fetch region details
        continent = safe_get(Continent, name=continent)
        country = safe_get(Country, name=country)
        state = safe_get(State, name=state)
        city = safe_get(City, name=city, country_id=country.id if country else None)
        area = safe_get(Area, name=request.GET.get('area', ''))

        # Build base queryset with select_related for common fields
        queryset = model.objects.select_related('contact').filter(lat__isnull=False, lng__isnull=False)

        # Apply regional filters efficiently with exact word matching
        if area:
            queryset = queryset.filter(
                Q(region__iexact=area.name) |
                Q(region__startswith=f"{area.name} ") |
                Q(region__endswith=f" {area.name}") |
                Q(region__contains=f" {area.name} ")
            )
        elif city:
            queryset = queryset.filter(
                Q(region__iexact=city.name) |
                Q(region__startswith=f"{city.name} ") |
                Q(region__endswith=f" {city.name}") |
                Q(region__contains=f" {city.name} ")
            )
        elif state:
            queryset = queryset.filter(
                Q(region__iexact=state.name) |
                Q(region__startswith=f"{state.name} ") |
                Q(region__endswith=f" {state.name}") |
                Q(region__contains=f" {state.name} ")
            )
        elif country:
            queryset = queryset.filter(
                Q(region__iexact=country.name) |
                Q(region__startswith=f"{country.name} ") |
                Q(region__endswith=f" {country.name}") |
                Q(region__contains=f" {country.name} ")
            )
        elif continent:
            queryset = queryset.filter(
                Q(region__iexact=continent.name) |
                Q(region__startswith=f"{continent.name} ") |
                Q(region__endswith=f" {continent.name}") |
                Q(region__contains=f" {continent.name} ")
            )

        # Handle special cases
        if showing == 'Coach Operators':
            categories = request.GET.getlist('categories[]')
            if categories:
                queryset = queryset.filter(categories__in=categories).distinct()

        elif showing == 'Hotels':
            ratings = request.GET.getlist('rating[]')
            if ratings:
                # Convert ratings to integers and filter for exact matches
                ratings_int = [int(rating) for rating in ratings]
                queryset = queryset.filter(rating__in=ratings_int)
            
            categories = request.GET.getlist('categories[]')
            if categories:
                try:
                    # Create a query that ensures all selected categories are present
                    category_query = Q()
                    for category in categories:
                        # Match exact category with proper word boundaries
                        category_query &= (
                            Q(categories__iexact=category) |
                            Q(categories__regex=rf'^{category},') |
                            Q(categories__regex=rf',{category},') |
                            Q(categories__regex=rf',{category}$')
                        )
                    queryset = queryset.filter(category_query).distinct()
                except Exception as e:
                    print(f"Error filtering categories: {str(e)}")
                    # If there's an error, continue without category filtering
                    pass

        elif showing == 'Repair Shops':
            types = request.GET.getlist('repair_shop_types[]')
            if types:
                types_int = [int(x) for x in types]
                queryset = queryset.filter(type__in=types_int).distinct()

        # Prefetch related data for contact persons
        if showing not in ['Shows & Entertainment', 'Repair Shops']:
            queryset = queryset.prefetch_related('contact_persons')

        # Process results efficiently
        results = []
        for result in queryset:
            if showing not in ['Shows & Entertainment', 'Repair Shops']:
                # Add contact persons
                if hasattr(result, 'contact_persons'):
                    for cp in result.contact_persons.all():
                        results.append({
                            'id': result.id,
                            'name': f"Contact person of {result.name} - {cp.name} ( {cp.position} ) ",
                            'email': cp.email or 'N/A',
                            'address': result.contact.address if result.contact and result.contact.address else 'N/A',
                            'tel': result.contact.tel if result.contact and result.contact.tel else 'N/A',
                            'lat': result.lat,
                            'lng': result.lng,
                            'type': showing,
                        })

                # Add main result
                result_data = {
                    'id': result.id,
                    'name': result.name,
                    'email': getattr(result.contact, 'email', 'N/A') if result.contact else 'N/A',
                    'address': getattr(result.contact, 'address', 'N/A') if result.contact else 'N/A',
                    'tel': getattr(result.contact, 'tel', 'N/A') if result.contact else 'N/A',
                    'lat': result.lat,
                    'lng': result.lng,
                    'type': showing,
                }

                if showing == 'Hotels':
                    result_data['rating'] = result.rating if result.rating else ''

                results.append(result_data)

            elif showing == 'Shows & Entertainment':
                supplier = result.entertainment_supplier
                results.append({
                    'id': result.id,
                    'name': result.name,
                    'lat': result.lat,
                    'lng': result.lng,
                    'description': result.description,
                    'type': showing,
                    'entertainment_supplier_id': result.entertainment_supplier_id,
                    'es_name': supplier.name if supplier else 'Unknown',
                })

            elif showing == 'Repair Shops':
                icon = None
                try:
                    icon = result.type.first().description
                except AttributeError:
                    pass

                results.append({
                    'id': result.id,
                    'name': result.name,
                    'email': getattr(result.contact, 'email', 'N/A') if result.contact else 'N/A',
                    'address': getattr(result.contact, 'address', 'N/A') if result.contact else 'N/A',
                    'tel': getattr(result.contact, 'tel', 'N/A') if result.contact else 'N/A',
                    'lat': result.lat,
                    'lng': result.lng,
                    'type': showing,
                    'icon': icon,
                })

        # Set pin to the first result or default
        try:
            pin = {'name': results[0]['name'], 'lat': results[0]['lat'], 'lng': results[0]['lng']}
        except IndexError:
            pin = {'name': '', 'lat': '', 'lng': ''}

        # Handle empty results
        if not results:
            context = {"errormsg": "No Results Found"}
            return Response(status=400, data=context)

        # Remove duplicates efficiently using a set
        unique_results = {frozenset(result.items()) for result in results}
        results = [dict(result) for result in unique_results]

        return Response({'results': results, 'pin': pin})


class DailyStatus(generics.ListAPIView):
    """
    URL: daily_status/
    Descr: Daily status is a reporting system showing groups on a map for a specific date
    """

    # Cross site request forgery
    @csrf_exempt
    def get(self, request):
        context = {"request": request, "errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_view(user.id, 'GT'):
            context = {"errormsg": "You do not have permission to view Daily Status."}
            return Response(status=401, data=context)

        can_view_COA = can_view(user.id, 'COA')
        can_view_COL = can_view(user.id, 'COL')

        # Get date
        selected_date = request.GET.get('selected_date')

        # Validate date
        if selected_date == 'Invalid date':
            selected_date = datetime.today().date()

        # Get traveldays by date
        traveldays = TravelDay.objects.filter(date=selected_date, group_transfer_id__isnull=False, group_transfer__status='5')

        if not can_view_COA:
            traveldays = traveldays.exclude(group_transfer__refcode__startswith='COA')
        if not can_view_COL:
            traveldays = traveldays.exclude(group_transfer__refcode__startswith='COL')

        # Serialize data
        traveldays_data = []
        for travelday in traveldays:
            is_last_travelday = travelday == TravelDay.objects.filter(group_transfer_id=travelday.group_transfer_id).order_by('date').last()
            travelday_data = TravelDaySerializer(travelday).data
            travelday_data['is_last_travelday'] = is_last_travelday
            travelday_data['airport_lat'] = None
            travelday_data['airport_lng'] = None

            if is_last_travelday:
                group = GroupTransfer.objects.get(id=travelday.group_transfer_id)

                # This regexp searchs for the airport
                # Airport has 3 consecutive capital letters
                p = re.compile(r'(?<![A-Z])[A-Z]{3}(?![A-Z])')
                try:
                    if group.departure_type == 'AIR':
                        if group.departure != 'N/A':
                            departure = p.search(group.departure.split(' -- ')[-1]).group()
                            travelday_data['airport_lat'] = Airport.objects.get(name=departure).lat
                            travelday_data['airport_lng'] = Airport.objects.get(name=departure).lng
                except Exception as a:
                    print(a)

            traveldays_data.append(travelday_data)
        # Count arrival / departures
        arrival_counter = 0
        departure_counter = 0

        # Count group by office
        pie_chart_data = {
            'tra': 0,
            'trb': 0,
            'trl': 0,
            'coa': 0,
            'col': 0,
        }

        table_data = []

        # Loop through traveldays
        for travelday in traveldays:
            group = GroupTransfer.objects.get(id=travelday.group_transfer_id)

            if group.refcode.startswith("COA") and not can_view_COA:
                continue
            if group.refcode.startswith("COL") and not can_view_COL:
                continue
            if group.status == '4':
                continue

            # Find previous date
            prev_day = datetime.strptime(selected_date, '%Y-%m-%d').date() - timedelta(days=1)

            # Create variables checking if date is arrival or departure
            isArrival = False
            isPreviousArrival = False
            isDeparture = False
            isPreviousDeparture = False

            # temporary row to store data,  resets on each travelday
            temp_row = []

            # Get previous date's data
            try:
                previous_travelday = TravelDay.objects.filter(date=prev_day, group_transfer_id=group.id)[0]
            except (TravelDay.DoesNotExist, IndexError):
                previous_travelday = 'N/A'

            # If td is the first one of the group, assign it as arrival
            if travelday == TravelDay.objects.filter(group_transfer_id=group.id).order_by('date')[0]:
                isArrival = True
                arrival_counter += 1

            # If td is the last day of the group, assign it as departure
            elif travelday == TravelDay.objects.filter(group_transfer_id=group.id).order_by('date').reverse()[0]:
                isDeparture = True
                departure_counter += 1

            # If travelday is both arrival and departure date, return 400 error
            if isArrival and isDeparture:
                return Response(status=400)

            # If previous day is the first of the group, assign it as arrival
            if previous_travelday == TravelDay.objects.filter(group_transfer_id=group.id).order_by('date')[0]:
                isPreviousArrival = True

            # If previous day is the last of the group, assign it as departure
            elif previous_travelday == TravelDay.objects.filter(group_transfer_id=group.id).order_by('date').reverse()[0]:
                isPreviousDeparture = True

            # If previous travelday is both arrival and departure date, return 400 error
            if isPreviousArrival and isPreviousDeparture:
                return Response(status=400)

            # Divide groups by office, used for pie chart
            if group.refcode.startswith('TRA'):
                pie_chart_data['tra'] += 1
            elif group.refcode.startswith('TRB'):
                pie_chart_data['trb'] += 1
            elif group.refcode.startswith('TRL'):
                pie_chart_data['trl'] += 1
            elif group.refcode.startswith('COA'):
                pie_chart_data['coa'] += 1
            elif group.refcode.startswith('COL'):
                pie_chart_data['col'] += 1

            # Add group to temporary row
            temp_row.append(group.refcode) if group.refcode else temp_row.append('N/A')

            # If group has nationality, add it too
            if group.agent:
                if group.agent.nationality_id:
                    country = Country.objects.get(id=group.agent.nationality_id)
                    temp_row.append(country.name + '**' + country.code) if group.agent.nationality_id else temp_row.append('N/A')
                else:
                    temp_row.append("N/A")
            elif group.client:
                if group.client.nationality_id:
                    country = Country.objects.get(id=group.client.nationality_id)
                    temp_row.append(country.name + '**' + country.code) if group.client.nationality_id else temp_row.append('N/A')

            # Add travelday's hotel
            temp_row.append(Hotel.objects.get(id=travelday.hotel_id).name) if travelday.hotel_id else temp_row.append('N/A')

            if previous_travelday != 'N/A':
                if previous_travelday.hotel:
                    description_small = str(previous_travelday.hotel.region) if previous_travelday.hotel.region is not None else 'N/A'
                else:
                    description_small = 'N/A'
                if isPreviousArrival:
                    # ***Asterisks are used to split on the front end***
                    temp_row.append('arrival_ ' + group.arrival + '**' + str(description_small))
                elif isPreviousDeparture:
                    # ***Asterisks are used to split on the front end***
                    temp_row.append('departure_ ' + group.departure + '**' + str(description_small))
                else:
                    temp_row.append(description_small)
            else:
                temp_row.append('N/A')

            if travelday.hotel:
                description_small = str(travelday.hotel.region)
            else:
                description_small = 'N/A'

            description_small = str(travelday.hotel.region) if travelday.hotel is not None else 'N/A'

            # Determine if current travelday is either arrival or departure dates
            if isArrival:
                temp_row.append('arrival_ ' + group.arrival + '**' + str(description_small))
            elif isDeparture:
                temp_row.append('departure_ ' + group.departure + '**' + str(description_small))
            else:
                temp_row.append(description_small)

            # Add travelday's leader
            temp_row.append(
                Contact.objects.get(id=travelday.leader_id).name
            ) if travelday.leader_id else temp_row.append('N/A')

            # Add travelday's driver
            temp_row.append(
                Contact.objects.get(id=travelday.driver_id).name
            ) if travelday.driver_id else temp_row.append('N/A')

            # Add travelday's coach / coach operator
            try:
                coach = Coach.objects.get(id=travelday.coach_id)
                coach_operator = CoachOperator.objects.get(
                    id=coach.coach_operator_id
                ).name if coach.coach_operator_id else 'N/A'
                coach_operator_id = CoachOperator.objects.get(
                    id=coach.coach_operator_id
                ).id if coach.coach_operator_id else 'N/A'
                temp_row.append(coach_operator)
            except Coach.DoesNotExist:
                coach = 'N/A'
                temp_row.append('N/A')
                coach_operator_id = 'N/A'

            # Add travelday's Hotel
            temp_row.append(
                Hotel.objects.get(id=travelday.hotel_id).id
            ) if travelday.hotel_id else temp_row.append('N/A')

            # Add travelday's Leader
            temp_row.append(
                Contact.objects.get(id=travelday.leader_id).id
            ) if travelday.leader_id else temp_row.append('N/A')

            # Add travelday's Driver
            temp_row.append(
                Contact.objects.get(id=travelday.driver_id).id
            ) if travelday.driver_id else temp_row.append('N/A')
            temp_row.append(coach_operator_id)

            table_data.append(temp_row)

        table_data = sorted(table_data, key=lambda x: x[4].startswith('departure_'), reverse=True)
        table_data = sorted(table_data, key=lambda x: x[4].startswith('arrival_'), reverse=True)

        # Return table data
        return Response({
            'all_traveldays': traveldays_data,
            'arrivals': arrival_counter,
            'departures': departure_counter,
            'pie_chart_data': pie_chart_data,
            'table_data': table_data,
        })
