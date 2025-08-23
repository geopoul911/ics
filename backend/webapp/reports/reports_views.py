# from django.shortcuts import render
from webapp.models import (
    GroupTransfer,
    Country,
    Agent,
    Client,
    TravelDay,
    Note,
    Offer,
    Hotel,
    Contact,
    Coach,
    CoachOperator,
    RepairShop,
    RepairType,
    Airline,
    Airport,
    AirportDistances,
    User,
    History,
    Attraction,
    Guide,
    Port,
    FerryTicketAgency,
    Restaurant,
    Theater,
    SportEventSupplier,
    CruisingCompany,
    TeleferikCompany,
    DMC,
    Service,
    TrainTicketAgency,
    Terminal,
    Photo,
    Document,
    SentEmails,
)
from uptime import uptime

# import ctypes
import re
from django.utils import timezone
import datetime
from django.db.models import Sum, Count, Min, Avg
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authtoken.models import Token
from collections import Counter
from rest_framework import generics
from rest_framework.response import Response


from webapp.serializers import (
    AirportSerializer,
    ClientSerializer,
    GroupStatsSerializer,
)


from accounts.models import (UserPermissions)
from accounts.permissions import (
    can_view,
    is_superuser,
    is_staff,
)

"""
    # Views
    - ReportsAgent
    - ReportsAirport
    - ReportsCity
    - ReportsClient
    - ReportsCoachOperator
    - ReportsDriver
    - ReportsExpiringDocuments
    - ReportsGroupLeader
    - ReportsHotel
    - ReportsCityMap
    - ReportsRepairShopMap
    - ReportsCoachOperatorMap
    - ReportsUser
    - ReportsSentEmails
    - ReportsServices
    - ReportsSiteStatistics
"""


# 20 colors used for pie charts reporting
twenty_column_colors = [
    "rgb(26, 26, 255)",
    "rgb(255, 51, 0)",
    "rgb(26, 255, 26)",
    "rgb(255, 218, 128)",
    "rgb(113, 205, 205)",
    "rgb(170, 128, 252)",
    "rgb(255, 177, 101)",
    "rgb(26, 255, 255)",
    "rgb(255, 102, 0)",
    "rgb(179, 0, 179)",
    "rgb(77, 77, 0)",
    "rgb(0, 153, 153)",
    "rgb(115, 230, 0)",
    "rgb(115, 115, 115)",
    "rgb(255, 255, 0)",
    "rgb(0, 51, 0)",
    "rgb(153, 51, 51)",
    "rgb(102, 51, 0)",
    "rgb(255, 134, 159)",
    "rgb(98,  182, 239)",
]

# Permissions
permissions_full_text = {
    'VIE': 'View',
    'CRE': 'Create',
    'UPD': 'Update',
    'DEL': 'Delete',
}

# Mail types
mail_types_full_text = {
    'M': 'Map',
    'R': 'Rooming List',
    'I': 'Itinerary',
    'O': 'Offer',
}

# Driver's documents
driver_docs = {
    'DL': 'Driver License',
    'TC': 'Tachograph Card',
    'PST': 'Passport',
    'ID': 'Identification Card',
}

# Coach's documents
coach_docs = {
    'KTEO': 'Vehicle Technical Control',
    'VI': 'Vehicle Insurance',
    'LC': 'Lease Contract',
    'VR': 'Vehicle Registration',
    'TCD': 'Tachograph Document',
    'CPTL': 'EU Community Passenger Transport License',
}

# All models
models_full_text = {
    'GT': 'GroupTransfer',
    'COL': 'GroupTransfer',
    'COA': 'GroupTransfer',
    'AGN': 'Agent',
    'AL': 'Airline',
    'OFF': 'Offer',
    'AP': 'Airport',
    'ATT': 'Attraction',
    'CLN': 'Client',
    'CNT': 'Contact',
    'COP': 'Coach Operator',
    'CO': 'Coach',
    'CC': 'Cruising Company',
    'DRV': 'Driver',
    'DMC': 'Destination Management Company',
    'GL': 'Group Leader',
    'GD': 'Guide',
    'HTL': 'Hotel',
    'PLC': 'Place',
    'PRT': 'Port',
    'RSH': 'Repair Shop',
    'RTP': 'Repair Type',
    'RST': 'Restaurant',
    'RS': 'Railway Station',
    'SRV': 'Service',
    'FTA': 'Ferry Ticket Agency',
    'TC': 'Teleferik Company',
    'TH': 'Theater',
    'TTA': 'Train Ticket Agency',
    'SES': 'Sport Even Supplier',
    'AUT': 'Authentication',
    'USR': 'User',
    'HSR': 'History',
    'PKG': 'Parking Lot',
    'TT': 'Text template',
    'PRO': 'Proforma Invoice',
    'ES': 'Entertainment Supplier',
    'AD': 'Advertisement Company',
    'CB': 'Charter Brokers',
    'AC': 'Aircrafts',
    "NAS": 'NAS Folders',
    'CH': 'Car Hire Company',
}

SERVICE_TYPES = {
    "AC": 'Accomodation',
    "AT": 'Air Ticket',
    "AP": 'Airport Porterage',
    "CFT": "Coach's Ferry Ticket",
    "CR": 'Cruise',
    "DA": 'Driver Accomodation',
    "FT": 'Ferry Ticket',
    "HP": 'Hotel Porterage',
    "LG": 'Local Guide',
    "RST": 'Restaurant',
    "SE": 'Sport Event',
    "TE": 'Teleferik',
    "TH": 'Theater',
    "TO": 'Toll',
    "TL": 'Tour Leader',
    "TLA": "Tour Leader's Accomodation",
    "TLAT": "Tour Leader's Air Ticket",
    "TT": 'Train Ticket',
    "TR": 'Transfer',
    "OTH": 'Other',
    "PRM": 'Permit',
}


# Returns user instance
def get_user(token):
    user = Token.objects.get(key=token).user
    return user


def extract_date(date_str):
    return datetime.datetime.strptime(date_str.split(' - ')[0], '%Y-%m-%d')


def generate_dates(start_date_str, end_date_str, date_format="%Y-%m-%d"):
    """
    Generate a list of dates between start_date_str and end_date_str.

    Parameters:
        start_date_str (str): Start date as a string in the format specified by date_format.
        end_date_str (str): End date as a string in the format specified by date_format.
        date_format (str): The format for parsing dates. Default is "%Y-%m-%d".

    Returns:
        list: A list of datetime.date objects between the start and end dates.
    """
    start_date = datetime.datetime.strptime(start_date_str, date_format).date()
    end_date = datetime.datetime.strptime(end_date_str, date_format).date()

    delta = end_date - start_date

    if delta.days < 0:
        return "The end date should be greater than or equal to the start date."

    date_list = []

    for i in range(delta.days + 1):
        current_date = start_date + datetime.timedelta(days=i)
        date_list.append(current_date)

    return date_list


def break_down_date_range(start_date, end_date):
    # Convert input strings to datetime objects
    start_date = datetime.datetime.strptime(start_date, '%Y-%m-%d')
    end_date = datetime.datetime.strptime(end_date, '%Y-%m-%d')

    # Calculate the total number of days in the date range
    total_days = (end_date - start_date).days

    # Check if the total number of days is less than 10
    if total_days < 10:
        # Break down the date range into daily intervals
        equal_dates = [start_date + datetime.timedelta(days=i) for i in range(total_days + 1)]
    else:
        # Calculate the interval between each date
        interval = total_days // 9

        # Generate 10 equal dates within the range
        equal_dates = [start_date + datetime.timedelta(days=i * interval) for i in range(10)]

    # Format the dates as strings
    formatted_dates = [date.strftime('%Y-%m-%d') for date in equal_dates]

    return formatted_dates


def get_top_hotels_by_group_count(start_date, end_date):
    # Convert input date strings to datetime objects
    start_date = datetime.datetime.strptime(start_date, '%Y-%m-%d')
    end_date = datetime.datetime.strptime(end_date, '%Y-%m-%d')

    # Query to get the count of groups for each hotel within the date range
    hotel_group_counts = (
        Hotel.objects
        .filter(hotel_travelday__date__range=(start_date, end_date))
        .annotate(group_count=Count('hotel_travelday__group_transfer', distinct=True))
        .order_by('-group_count')[:10]
    )

    # Create a dictionary with hotel names and their corresponding group counts
    top_hotels = {hotel.name: hotel.group_count for hotel in hotel_group_counts}

    return top_hotels


def get_top_agents_by_group_count(start_date, end_date):
    # Convert input strings to datetime objects
    start_date = datetime.datetime.strptime(start_date, "%Y-%m-%d")
    end_date = datetime.datetime.strptime(end_date, "%Y-%m-%d")

    all_agents = Agent.objects.all()
    top_agents = {}

    for agent in all_agents:
        top_agents[agent.name] = GroupTransfer.objects.filter(group_travelday__date__range=(start_date, end_date), agent_id=agent.id).distinct().count()

    # Sort the dictionary based on the values in descending order
    sorted_agents = dict(sorted(top_agents.items(), key=lambda item: item[1], reverse=True))

    # Include only the top 10 values
    top_10_agents = dict(list(sorted_agents.items())[:10])

    return top_10_agents


class ReportsAgent(generics.ListAPIView):
    """
    URL: reports_agent/
    Descr: User selects a daterange and an agent, and this functions returns stats.
    """

    @csrf_exempt
    def get(self, request):
        context = {"request": request, "errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_view(user.id, 'AGN'):
            context = {"errormsg": "Insufficient Permissions. Access denied."}
            return Response(status=401, data=context)

        # # # REQUEST'S PARAMETERS # # #
        agent = Agent.objects.get(name=request.GET['agent_name'].strip())
        date_from = request.GET['date_from']
        date_to = request.GET['date_to']

        # Get Traveldays
        tds = TravelDay.objects.filter(date__range=[date_from, date_to])
        # Get Groups
        group_ids = tds.values_list('group_transfer_id', flat=True)
        groups = GroupTransfer.objects.filter(id__in=group_ids, agent_id=agent.id)

        # # # 1) HOTEL'S STATISTICS # # #
        total_groups = groups.count()
        total_number_of_people = groups.aggregate(total_people=Sum('number_of_people'))['total_people']

        try:
            people_per_group = round(total_number_of_people / total_groups, 2)
        except TypeError:
            people_per_group = 0

        # Create a dictionary with hotel statistics
        agent_statistics_card = {
            'total_groups': total_groups,
            'total_number_of_people': total_number_of_people,
            'people_per_group': people_per_group,
        }

        # # # 2) AGENT'S INFORMATION
        try:
            hsr = History.objects.filter(
                Q(description__contains=agent.name) & Q(description__contains='name'),
                model_name='AGN',
                action='CRE',
            )[0]
        except IndexError:
            hsr = None

        if hsr:
            created_by = User.objects.get(id=hsr.user_id).username
            created_at = hsr.timestamp.strftime("%B %d, %Y %I:%M:%S %p")
        else:
            created_by = 'N/A'
            created_at = 'N/A'

        agent_information_card = {
            'abbreviation': agent.abbreviation,
            'email': agent.contact.email,
            'address': agent.contact.address,
            'created_by': created_by,
            'created_at': created_at,
        }

        # # # 3) OTHER AGENTS AT PERIOD
        other_agents_at_period = get_top_agents_by_group_count(date_from, date_to)

        # # # 4) AGENT's GROUPS PER NATIONALITY
        # Convert the queryset result to a dictionary
        groups_by_nationality = {}

        nationalities = [Country.objects.get(id=group.nationality_id) for group in groups.exclude(nationality__isnull=True)]
        groups_by_nationality = Counter(nationality.name for nationality in nationalities)
        groups_by_nationality["N/A"] = groups.filter(nationality_id__isnull=True).count()

        # # # # 5) Confirmed / Cancelled Groups
        confirmed_cancelled = {
            'cancelled': groups.exclude(status='5').count(),
            'confirmed': groups.exclude(status='4').count(),
        }

        # # # 6) Groups Per Year Line Chart
        current_year = datetime.date.today().year
        start_year = 2005
        end_year = current_year
        years_array = list(range(start_year, end_year + 1))

        # Initialize a dictionary to store counts for each year
        group_transfer_counts_by_year = {}

        # Count unique GroupTransfer instances for each year
        for year in years_array:
            count_for_year = GroupTransfer.objects.filter(
                group_travelday__date__year=year,
                agent__name=agent.name
            ).distinct().count()

            group_transfer_counts_by_year[str(year)] = count_for_year

        # # # 7) Table Data
        """ Period	Reference Booked Dates Booked Days PAX Overnights """
        table_data = []
        for group in groups:
            table_data.append({
                'period': f"{group.group_travelday.all().order_by('date').first()} - {group.group_travelday.all().order_by('date').last()}",
                'reference': group.refcode,
                'PAX': group.number_of_people,
                'status': group.status,
                'arrival': group.arrival,
                'departure': group.departure,
            })

        return Response({
            'agent_statistics_card': agent_statistics_card,
            'agent_information_card': agent_information_card,
            'other_agents_at_period': other_agents_at_period,
            'groups_by_nationality': groups_by_nationality,
            'confirmed_cancelled': confirmed_cancelled,
            'groups_per_year': group_transfer_counts_by_year,
            'table_data': table_data,
        })


class ReportsAirport(generics.ListAPIView):
    """
    URL: reports_airport/
    Descr: User selects a daterange and an airport, and this functions returns stats.
    """

    serializer_class = AirportSerializer

    # Cross site request forgery
    @csrf_exempt
    def get(self, request):
        context = {"request": request, "errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_view(user.id, 'AP'):
            context = {"errormsg": "Insufficient Permissions. Access denied."}
            return Response(status=401, data=context)

        # Get date range
        date_from = request.GET['date_from']
        date_to = request.GET['date_to']

        # All Airports
        all_airports = Airport.objects.all()

        # All Airport Names
        all_airport_names = [airport.name for airport in all_airports]

        # Airports not having a value from the below:
        # Name, Location, Lat, Lng, Place
        incomplete_airports = all_airports.filter(
            Q(name__isnull=True) |
            Q(location__isnull=True) |
            Q(lat__isnull=True) |
            Q(lng__isnull=True)
        )

        # Latest Airport Created
        last_added_airport = Airport.objects.latest('date_created').name

        # Group Traveldays from the selected period.
        tds = TravelDay.objects.filter(date__gte=date_from, date__lte=date_to)

        # Groups From selected period.
        groups = GroupTransfer.objects.filter(id__in=[td.group_transfer_id for td in tds])

        # This pattern is used in the below Regexp, to find Airports from arrival/departure flights.
        # What it does is , return 3 consecutive capital letters.
        pattern = r'[A-Z]{3}'

        # Airports used in the period.
        airports_used = []

        # List of objects with the final data.
        airport_stats = []

        # All Arrivals of selected date.
        arrivals = [group.arrival for group in groups]

        # All Departures of selected date.
        departures = [group.departure for group in groups]

        # Look through arrivals, and get a list of the used airports
        for arrival in arrivals:
            matches = re.findall(pattern, arrival)
            airports_used.extend(matches)

        # Look through departures, and get a list of the used airports
        for departure in departures:
            matches = re.findall(pattern, departure)
            airports_used.extend(matches)

        # Loop through used airports
        for airp in airports_used:

            # This if statement is used to avoid duplicates.
            if airp not in all_airport_names:
                continue

            # Get Airport by name
            airport = Airport.objects.get(name=airp)

            # this list is also used to avoid duplicates
            registered_airports = [airport['airport_name'] for airport in airport_stats]

            # If the airport is in registered airports, go on
            if airport.name in registered_airports:
                continue

            # Add object to list.
            airport_stats.append({
                'airport_name': airport.name,
                'location': airport.location,
                'number_of_groups': 0,
                'arrival_flights': 0,
                'departure_flights': 0,
            })

        # Used to Count Arrival flights
        for arrival_string in arrivals:
            matches = re.findall(pattern, arrival_string)
            for airport_row in airport_stats:
                for match in matches:
                    if airport_row['airport_name'] == match:
                        airport_row['arrival_flights'] += 1

        # Used to Count Departure flights
        for departure_string in departures:
            matches = re.findall(pattern, departure_string)
            for airport_row in airport_stats:
                for match in matches:
                    if airport_row['airport_name'] == match:
                        airport_row['departure_flights'] += 1

        return Response({
            'all_airports': self.get_serializer(all_airports, many=True, context={'request': self.request}).data,
            'incomplete_airports': incomplete_airports.count(),
            'last_added_airport': last_added_airport,
            'airport_stats': airport_stats,
        })


class ReportsClient(generics.ListAPIView):
    """
    URL: reports_client/
    Descr: User selects a daterange and an client, and this functions returns stats.
    """

    serializer_class = ClientSerializer

    # Cross site request forgery
    @csrf_exempt
    def get(self, request):
        context = {"request": request, "errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_view(user.id, 'CLN'):
            context = {"errormsg": "Insufficient Permissions. Access denied."}
            return Response(status=401, data=context)

        # Get date range
        date_from = request.GET['date_from']
        date_to = request.GET['date_to']

        # All Clients
        all_clients = Client.objects.all()

        # Clients not having a value from the below:
        # Name, Location, Lat, Lng, Place
        incomplete_clients = all_clients.filter(
            Q(name__isnull=True) |
            Q(abbreviation__isnull=True) |
            Q(nationality__isnull=True) |
            Q(contact__address__isnull=True) |
            Q(contact__tel__isnull=True) |
            Q(contact__email__isnull=True)
        )

        # Latest Client Created
        last_added_client = Client.objects.latest('date_created').name

        # Group Traveldays from the selected period.
        tds = TravelDay.objects.filter(date__gte=date_from, date__lte=date_to)

        # Groups From selected period.
        groups = GroupTransfer.objects.filter(id__in=[td.group_transfer_id for td in tds])

        # Clients used in the period.
        clients_used = Client.objects.filter(id__in=[group.client_id for group in groups])

        # List of objects with the final data.
        client_stats = []

        for client in clients_used:
            # Add object to list.
            clients_groups = groups.filter(client_id=client.id)
            group_details = []
            for group in clients_groups:
                period = f"{TravelDay.objects.filter(group_transfer_id=group.id).earliest('date')} - {TravelDay.objects.filter(group_transfer_id=group.id).latest('date')}"
                group_details.append({
                    'period': period,
                    'reference': group.refcode,
                    'arrival': group.arrival,
                    'departure': group.departure,
                    'group_days': TravelDay.objects.filter(group_transfer_id=group.id).count(),
                    'pax': group.number_of_people,
                })
            client_stats.append({
                'client_name': client.name,
                'number_of_groups': clients_groups.count(),
                'group_details': group_details,
            })

        return Response({
            'all_clients': self.get_serializer(all_clients, many=True, context={'request': self.request}).data,
            'incomplete_clients': incomplete_clients.count(),
            'last_added_client': last_added_client,
            'client_stats': client_stats,
        })


class ReportsCoachOperator(generics.ListAPIView):
    """
    URL: reports_coach_operator/
    Descr: User selects a daterange and a coach operator, and this functions returns stats.
    """

    # Cross site request forgery
    @csrf_exempt
    def get(self, request):
        context = {"request": request, "errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_view(user.id, 'COP'):
            context = {"errormsg": "Insufficient Permissions. Access denied."}
            return Response(status=401, data=context)

        # Get date range
        date_from = request.GET['date_from']
        date_to = request.GET['date_to']

        # Get coach operator
        selected_coach_operator = request.GET['selected_coach_operator']
        coach_operator = CoachOperator.objects.get(id=selected_coach_operator.split(') ')[0])

        # 1st pie chart
        pie_chart_data = {
            'athens_based_groups': 0,
            'beijing_based_groups': 0,
            'london_based_groups': 0,
            'coa_based_groups': 0,
            'col_based_groups': 0,
        }

        # 2nd pie chart
        confirmed_cancelled_chart_data = {
            'confirmed': 0,
            'cancelled': 0,
        }

        # INFORMATION
        selected_period_groups = []
        empty_km_table_data = []
        total_groups = 0
        total_number_of_people = 0
        total_work_days = 0
        coaches = Coach.objects.filter(coach_operator_id=coach_operator.id)
        coach_counter = 0

        # Regex for 3 consequent capital characters
        p = re.compile(r'(?<![A-Z])[A-Z]{3}(?![A-Z])')

        # Calculate empty KM
        previous_departure_airport = None
        previous_end_date = None
        total_empty_km = 0

        # Loop over coaches
        for coach in coaches:

            # Get coach's traveldays
            all_traveldays_of_selected_coach = TravelDay.objects.filter(coach_id=coach.id)
            group_ids = list(set([i.group_transfer_id for i in all_traveldays_of_selected_coach]))

            # Get groups
            groups = [GroupTransfer.objects.get(id=group) for group in group_ids]
            selected_period_groups.append([coach.make + ' - ' + coach.plate_number, []])

            # Loop over groups
            for group in groups:
                groups_arrival = group.group_travelday.all()[0].date \
                    if group.group_travelday.all().count() > 0 else ''
                if str(groups_arrival) > date_from and \
                    str(groups_arrival) < date_to and \
                        group.arrival != 'N/A' and \
                        group.departure != 'N/A':

                    # Get group's periods
                    period_1 = TravelDay.objects.filter(group_transfer_id=group.id, coach_id=coach.id)[0]
                    period_2 = TravelDay.objects.filter(group_transfer_id=group.id, coach_id=coach.id).latest('date')
                    selected_period_groups[coach_counter][1].append({
                        'coach': coach.make + ' - ' + coach.plate_number,
                        'period': f"{period_1} - {period_2}",
                        'reference': group.refcode,
                        'arrival': group.arrival,
                        'departure': group.departure,
                        'group_days': group.group_travelday.all().count(),
                        'working_days': TravelDay.objects.filter(group_transfer_id=group.id, coach_id=coach.id).count(),
                        'PAX': group.number_of_people,
                    })

                    # Add to total groups
                    total_groups += 1

                    # Add to total_number_of_people
                    total_number_of_people += group.number_of_people

                    # Determine group's office
                    if group.refcode.startswith('TRA'):
                        pie_chart_data['athens_based_groups'] += 1
                    elif group.refcode.startswith('TRB'):
                        pie_chart_data['beijing_based_groups'] += 1
                    elif group.refcode.startswith('TRL'):
                        pie_chart_data['london_based_groups'] += 1
                    elif group.refcode.startswith('COA'):
                        pie_chart_data['coa_based_groups'] += 1
                    elif group.refcode.startswith('COL'):
                        pie_chart_data['col_based_groups'] += 1

                    # Determine group's status
                    if group.status == '5':
                        confirmed_cancelled_chart_data['confirmed'] += 1
                        total_work_days += TravelDay.objects.filter(
                            group_transfer_id=group.id,
                            coach_id=coach.id
                        ).count()
                    else:
                        confirmed_cancelled_chart_data['cancelled'] += 1

            # Sort by period
            selected_period_groups[coach_counter][1].sort(
                key=lambda x: datetime.datetime.strptime(x['period'].split(' - ')[0], ('%d/%m/%Y'))
            )

            for row in selected_period_groups[coach_counter][1]:
                if p.search(row['arrival'].split(' -- ')[-1]) is None or \
                        p.search(row['departure'].split(' -- ')[-1]) is None:
                    continue

                # Use regex to get arrival's airport
                arrival_airport = p.search(row['arrival'].split(' -- ')[-1]).group()

                start_date = row['period'].split(' - ')[0]

                # Get Empty KM distance if it exists
                if arrival_airport != previous_departure_airport and previous_departure_airport is not None:
                    dst = AirportDistances.objects.get(src_id=previous_departure_airport, dst_id=arrival_airport)
                else:
                    dst = None

                if previous_end_date is not None:
                    # Format dates
                    formatted_date1 = datetime.datetime.strptime(previous_end_date, "%d/%m/%Y")
                    formatted_date2 = datetime.datetime.strptime(start_date, "%d/%m/%Y")

                    # If period between days is longer than 90 days and destination is not null
                    # It is based on Airport Distances model
                    if formatted_date1 + datetime.timedelta(days=90) > formatted_date2 and dst is not None:
                        empty_km_table_data.append([
                            [previous_end_date + ' - ' + str(start_date).replace('00:00:00', '')],
                            [coach.make + ' - ' + coach.plate_number],
                            [dst.src_id],
                            [dst.dst_id],
                            [dst.distance],
                        ])
                        if dst.distance is not None:
                            total_empty_km += int(dst.distance)
                    else:
                        continue
                previous_end_date = row['period'].split(' - ')[-1]
                previous_departure_airport = p.search(row['departure'].split(' -- ')[-1]).group()

            coach_counter += 1

        top_100_coach_operators = []

        # Use raw SQL to get top 100 coach operators by groups
        from django.db import connection
        cursor = connection.cursor()
        cursor.execute("""
            SELECT name, id, count(refcode), sum(number_of_people), sum(dayspergroup)::int
            FROM (SELECT name, id, refcode, number_of_people, sum(days)::int as dayspergroup
                FROM (
                    SELECT CO.name, CO.id, C.plate_number,
                    G.refcode, G.number_of_people,
                    count(DISTINCT T.date)::int AS days
                    FROM webapp_coachoperator CO
                    JOIN webapp_coach C
                    ON C.coach_operator_id = CO.id
                    JOIN webapp_travelday T
                    ON C.id = T.coach_id
                    JOIN webapp_grouptransfer G
                    ON G.id = T.group_transfer_id
                    WHERE G.status <> '4'
                    AND T.date >= '2000-01-01'
                    AND T.date <= '2030-01-01'
                    GROUP BY CO.name, CO.id, C.plate_number, G.refcode, G.number_of_people
                    UNION
                    SELECT CO2.name, CO2.id, NULL, NULL, 0, 0
                    FROM webapp_coachoperator CO2
                    WHERE CO2.id = 2) A
                    GROUP BY name, id, refcode, number_of_people) B
                GROUP BY name, id
                ORDER BY count desc
        """, [date_from, date_to])

        # Get total groups / total number of people
        total_groups_all = 0
        total_number_of_people_all = 0
        for row in cursor.fetchall():
            if len(top_100_coach_operators) < 100:
                top_100_coach_operators.append([
                    row[0],  # name
                    row[2],  # total_groups
                ])
            total_groups_all += int(row[2])
            total_number_of_people_all += int(row[3])

        connection.close()

        if total_number_of_people_all is not None:
            people_per_group_all = total_number_of_people_all // total_groups_all
        else:
            people_per_group_all = 0

        return Response({
            'total_groups': total_groups,
            'total_number_of_people': total_number_of_people,
            'people_per_group': total_number_of_people // total_groups if total_number_of_people != 0 else 0,
            'days_of_work': total_work_days,
            'selected_period_groups': selected_period_groups,
            'pie_chart_data': pie_chart_data,
            'confirmed_cancelled_chart_data': confirmed_cancelled_chart_data,
            'empty_km_table_data': empty_km_table_data,
            'total_empty_km': total_empty_km,
            'total_groups_all': total_groups_all,
            'total_people_all': total_number_of_people_all,
            'people_per_group_all': people_per_group_all,
            'top_100_coach_operators': top_100_coach_operators,
        })


class ReportsDriver(generics.ListAPIView):
    """
    URL: reports_driver/
    Descr: User selects a daterange and a driver, and this functions returns stats.
    """

    # Cross site request forgery
    @csrf_exempt
    def get(self, request):
        context = {"request": request, "errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_view(user.id, 'DRV'):
            context = {"errormsg": "Insufficient Permissions. Access denied."}
            return Response(status=401, data=context)

        driver = Contact.objects.get(id=request.GET['driver_id'])

        tds = TravelDay.objects.filter(driver_id=driver.id)
        group_ids = [td.group_transfer_id for td in tds]

        driver_stats = []

        groups = GroupTransfer.objects.filter(id__in=group_ids)

        for group in groups:
            driver_stats.append({
                'reference': group.refcode,
                'number_of_days': TravelDay.objects.filter(group_transfer_id=group.id).count(),
                'agent': str(group.agent),
            })

        return Response({
            'driver_stats': driver_stats,
        })


class ReportsExpiringDocuments(generics.ListAPIView):
    """
    URL: reports_expiring_documents/
    Descr: Table showing documents and their expiring dates
    """

    # Cross site request forgery
    @csrf_exempt
    def get(self, request):
        context = {"request": request, "errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_view(user.id, 'DRV'):
            context = {"errormsg": "Insufficient Permissions. Access denied."}
            return Response(status=401, data=context)

        documents = []

        filter_by_object = request.GET.get('filter_by_object')
        filter_by_exp_date = request.GET.get('filter_by_exp_date')
        selected_object = request.GET.get('selected_object')

        # Get today's date
        today = datetime.date.today()
        doc_color = ''

        # For driver in all drivers

        drivers = Contact.objects.filter(type='D').prefetch_related('documents').annotate(
            ndocuments=Count('documents')
        ).filter(ndocuments__gt=0)

        coaches = Coach.objects.all().prefetch_related('documents').annotate(
            ndocuments=Count('documents')
        ).filter(ndocuments__gt=0)

        if selected_object != '':
            if filter_by_object == 'Driver':
                drivers = Contact.objects.filter(id=selected_object.split(")")[0])
            if filter_by_object == 'Coach':
                coaches = Coach.objects.filter(id=selected_object.split(")")[0])

        if filter_by_object == 'Show All' or filter_by_object == 'Driver':
            for driver in drivers:
                if driver.documents.count() == 0:
                    continue

                # for driver's document
                for document in driver.documents.all():
                    # Get next 30 days
                    next_30_days = [datetime.date.today() + datetime.timedelta(days=x) for x in range(31)]
                    next_30_days_human_format = [datetime.date.strftime(i, '%d-%m-%Y') for i in next_30_days]

                    # Add appropriate color based on expiring date
                    # red = expired
                    # orange = expiring soon
                    # green = ok

                    if datetime.date.strftime(document.expiry_date, '%d-%m-%Y') in next_30_days_human_format:
                        doc_color = 'orange'
                        if filter_by_exp_date == 'Expired Documents':
                            continue

                    elif document.expiry_date > today:
                        doc_color = 'green'
                        if filter_by_exp_date != 'Show All':
                            continue

                    else:
                        doc_color = 'red'
                        if filter_by_exp_date == 'Expiring Soon':
                            continue

                    documents.append({
                        'id': document.id,
                        'file_name': document.name,
                        'type': driver_docs[document.type],
                        'time_stamp': datetime.datetime.strftime(document.updated_at, '%d/%m/%Y  %H:%M:%S'),
                        'size': document.size,
                        'expiry_date': datetime.date.strftime(document.expiry_date, '%d/%m/%Y'),
                        'driver_coach': 'Driver',
                        'driver': driver.name,
                        'driver_id': driver.id,
                        'color': doc_color,
                    })

        if filter_by_object == 'Show All' or filter_by_object == 'Coach':
            for coach in coaches:
                if coach.documents.count() == 0:
                    continue
                # for coach's document
                for document in coach.documents.all():
                    # Get next 30 days
                    next_30_days = [datetime.date.today() + datetime.timedelta(days=x) for x in range(30)]
                    next_30_days_human_format = [datetime.date.strftime(i, '%d-%m-%Y') for i in next_30_days]

                    # Add appropriate color based on expiring date
                    # red = expired
                    # orange = expiring soon
                    # green = ok
                    if datetime.date.strftime(document.expiry_date, '%d-%m-%Y') in next_30_days_human_format:
                        doc_color = 'orange'
                        if filter_by_exp_date == 'Expired Documents':
                            continue

                    elif document.expiry_date > today:
                        doc_color = 'green'
                        if filter_by_exp_date != 'Show All':
                            continue

                    else:
                        doc_color = 'red'
                        if filter_by_exp_date == 'Expiring Soon':
                            continue

                    documents.append({
                        'id': document.id,
                        'file_name': document.name,
                        'type': coach_docs[document.type],
                        'time_stamp': datetime.datetime.strftime(document.updated_at, '%d/%m/%Y  %H:%M:%S'),
                        'size': document.size,
                        'expiry_date': datetime.date.strftime(document.expiry_date, '%d/%m/%Y'),
                        'driver_coach': 'Coach',
                        'coach': str(' / '.join([str(coach.coach_operator), coach.make, coach.plate_number])),
                        'coach_id': coach.id,
                        'color': doc_color,
                    })

        documents.sort(key=lambda x: datetime.datetime.strptime(x['expiry_date'].split(' - ')[0], ('%d/%m/%Y')))

        return Response({
            'documents': documents,
        })


class ReportsGroupLeader(generics.ListAPIView):
    """
    URL: reports_group_leader/
    Descr: User selects a daterange and a group leader, and this functions returns stats.
    """

    # Cross site request forgery
    @csrf_exempt
    def get(self, request):

        context = {"request": request, "errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_view(user.id, 'GL'):
            context = {"errormsg": "Insufficient Permissions. Access denied."}
            return Response(status=401, data=context)

        leader = Contact.objects.get(id=request.GET['leader_id'])

        tds = TravelDay.objects.filter(leader_id=leader.id)
        group_ids = [td.group_transfer_id for td in tds]

        leader_stats = []

        groups = GroupTransfer.objects.filter(id__in=group_ids)

        for group in groups:
            leader_stats.append({
                'reference': group.refcode,
                'number_of_days': TravelDay.objects.filter(group_transfer_id=group.id).count(),
                'agent': str(group.agent),
            })

        return Response({
            'leader_stats': leader_stats,
        })


class ReportsHotel(generics.ListAPIView):
    """
    URL: reports_hotel/
    Descr: User selects a daterange and a hotel, and this functions returns stats.
    """

    @csrf_exempt
    def get(self, request):

        context = {"request": request, "errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_view(user.id, 'HTL'):
            context = {"errormsg": "Insufficient Permissions. Access denied."}
            return Response(status=401, data=context)

        # # # REQUEST'S PARAMETERS # # #

        hotel = Hotel.objects.get(name=request.GET['hotel_name'])

        date_from = request.GET['date_from']
        date_to = request.GET['date_to']

        # Get Traveldays
        tds = TravelDay.objects.filter(date__range=[date_from, date_to], hotel_id=hotel.id)
        # Get Groups
        group_ids = tds.values_list('group_transfer_id', flat=True)
        groups = GroupTransfer.objects.filter(id__in=group_ids)

        # # # 1) HOTEL'S STATISTICS # # #
        total_groups = groups.count()
        total_number_of_people = groups.aggregate(total_people=Sum('number_of_people'))['total_people']

        try:
            people_per_group = round(total_number_of_people / total_groups, 2)
        except TypeError:
            people_per_group = 0

        total_overnights = tds.aggregate(total_overnights=Sum('group_transfer__number_of_people'))['total_overnights'] or 0

        # Create a dictionary with hotel statistics
        hotel_statistics_card = {
            'total_groups': total_groups,
            'total_number_of_people': total_number_of_people,
            'people_per_group': people_per_group,
            'total_overnights': total_overnights,
        }

        # # # 2) HOTEL'S INFORMATION
        try:
            hsr = History.objects.filter(
                Q(description__contains=hotel.name) & Q(description__contains='name'),
                model_name='HTL',
                action='CRE',
            )[0]
        except IndexError:
            hsr = None

        if hsr:
            created_by = User.objects.get(id=hsr.user_id).username
            created_at = hsr.timestamp.strftime("%B %d, %Y %I:%M:%S %p")
        else:
            created_by = 'N/A'
            created_at = 'N/A'

        hotel_information_card = {
            'rating': hotel.rating,
            'email': hotel.contact.email,
            'address': hotel.contact.address,
            'created_by': created_by,
            'created_at': created_at,
        }

        # # # 3) OTHER HOTELS AT PERIOD
        other_hotels_at_period = get_top_hotels_by_group_count(date_from, date_to)

        # # # 4) HOTEL's GROUPS PER NATIONALITY
        # Convert the queryset result to a dictionary
        groups_by_nationality = {}

        nationalities = [Country.objects.get(id=group.nationality_id) for group in groups.exclude(nationality__isnull=True)]

        groups_by_nationality = Counter(nationality.name for nationality in nationalities)
        groups_by_nationality["N/A"] = groups.filter(nationality_id__isnull=True).count()

        # # # # 5) Confirmed / Cancelled Groups
        confirmed_cancelled = {
            'cancelled': groups.exclude(status='5').count(),
            'confirmed': groups.exclude(status='4').count(),
        }

        # # # 6) Groups Per Year Line Chart
        current_year = datetime.date.today().year
        start_year = 2005
        end_year = current_year
        years_array = list(range(start_year, end_year + 1))

        # Initialize a dictionary to store counts for each year
        group_transfer_counts_by_year = {}

        # Count unique GroupTransfer instances for each year
        for year in years_array:
            count_for_year = GroupTransfer.objects.filter(
                group_travelday__date__year=year,
                group_travelday__hotel__name=hotel.name
            ).distinct().count()

            group_transfer_counts_by_year[str(year)] = count_for_year

        # # # 7) Table Data

        """ Period	Reference	Booked Dates	Booked Days	PAX	Overnights """
        table_data = []
        for group in groups:
            group_tds = group.group_travelday.filter(hotel_id=hotel.id)
            table_data.append({
                'period': f"{group.group_travelday.all().order_by('date').first()} - {group.group_travelday.all().order_by('date').last()}",
                'reference': group.refcode,
                'booked_dates': [td.date for td in group_tds],
                'booked_dates_count': group_tds.count(),
                'PAX': group.number_of_people,
                'overnights': group.number_of_people * group_tds.count(),
                'status': group.status,
            })

        return Response({
            'hotel_statistics_card': hotel_statistics_card,
            'hotel_information_card': hotel_information_card,
            'other_hotels_at_period': other_hotels_at_period,
            'groups_by_nationality': groups_by_nationality,
            'confirmed_cancelled': confirmed_cancelled,
            'groups_per_year': group_transfer_counts_by_year,
            'table_data': table_data,
        })


class ReportsUser(generics.ListAPIView):
    """
    URL: reports_user/
    Descr: User selects a date range and a user, and this function returns stats
    """

    # Cross site request forgery
    @csrf_exempt
    def get(self, request):
        context = {"request": request, "errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_view(user.id, 'USR'):
            context = {"errormsg": "Insufficient Permissions. Access denied."}
            return Response(status=401, data=context)

        # Get date range
        date_from = request.GET['date_from']
        date_to = request.GET['date_to']

        # Get user
        selected_user = request.GET['selected_user']
        selected_user = User.objects.get(username=selected_user)

        # Get active users
        enabled_users = User.objects.filter(is_active=True)
        disabled_users = User.objects.filter(is_active=False)

        # Format date range
        current_tz = timezone.get_current_timezone()
        date_from_d = datetime.datetime.strptime(date_from, '%Y-%m-%d')
        date_from_d = current_tz.localize(date_from_d)
        date_to_d = datetime.datetime.strptime(date_to, '%Y-%m-%d')
        date_to_d = current_tz.localize(date_to_d)

        # Get user's permissions
        permissions = UserPermissions.objects.filter(user_id=selected_user.id)

        selected_user_permissions = []

        for permission_entry in permissions:
            selected_user_permissions.append({
                'permission_type': permissions_full_text[permission_entry.permission_type],
                'value': permission_entry.value,
                'description': permission_entry.description,
                'model': models_full_text[permission_entry.model],
            })

        user_data = {
            'id':           selected_user.id,
            'first_name':   selected_user.first_name,
            'last_name':    selected_user.last_name,
            'email':        selected_user.email,
            'username':     selected_user.username,
            'is_active':    selected_user.is_active,
            'is_staff':     selected_user.is_staff,
            'is_superuser': selected_user.is_superuser,
            'date_joined':  selected_user.date_joined,
            'permissions':  selected_user_permissions,
        }

        # Get user's logs
        logs = []
        selected_user_logs = History.objects.filter(user_id=selected_user.id, timestamp__range=[date_from_d, date_to_d])

        for log in selected_user_logs:
            logs.append({
                'id': log.id,
                'model_name': log.model_name,
                'action': log.action,
                'description': log.description,
                'timestamp': log.timestamp,
            })

        return Response({
            'user_data': user_data,
            'enabled_users': enabled_users.count(),
            'disabled_users': disabled_users.count(),
            'logs': logs,
        })


class ReportsSentEmails(generics.ListAPIView):
    """
    URL: reports_sent_emails/
    Descr: Get sent emails
    """

    # Cross site request forgery
    @csrf_exempt
    def get(self, request):
        context = {"request": request, "errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_view(user.id, 'HSR') or not is_superuser(user.id):
            context = {"errormsg": "Insufficient Permissions. Access denied."}
            return Response(status=401, data=context)

        # Get date range
        date_from = request.GET['date_from']
        date_to = request.GET['date_to']

        # Filter by type
        type_filter = request.GET['type_filter']
        if type_filter == 'None':
            all_emails_sent = SentEmails.objects.all().order_by('-id')
        elif type_filter == 'Map':
            all_emails_sent = SentEmails.objects.filter(type='M')
        elif type_filter == 'Rooming List':
            all_emails_sent = SentEmails.objects.filter(type='R')
        elif type_filter == 'Itinerary':
            all_emails_sent = SentEmails.objects.filter(type='I')
        elif type_filter == 'Offer':
            all_emails_sent = SentEmails.objects.filter(type='O')

        # Filter by user
        user_filter = request.GET['user_filter']
        if user_filter == 'None':
            pass
        else:
            all_emails_sent = all_emails_sent.filter(sender=User.objects.get(username=user_filter))

        data = []
        for email in all_emails_sent:
            if email.date_created.strftime('%Y-%m-%d') >= date_from and \
                    email.date_created.strftime('%Y-%m-%d') <= date_to:
                # Show 80 chars max
                if email.body is not None:
                    if len(email.body) > 80:
                        body = email.body[:80] + ' ... '
                    else:
                        body = email.body
                else:
                    body = "N/A"
                data.append({
                    'id': email.id,
                    'type': mail_types_full_text[email.type],
                    'date_sent': email.date_created.strftime('%d/%m/%Y %H:%m:%S %z'),
                    'sender': email.sender.email,
                    'recipients': email.recipients,
                    'subject': email.subject,
                    'body': body,
                    'attached': email.attached,
                })

        return Response({
            'sent_emails': data,
        })


class ReportsServices(generics.ListAPIView):
    """
    URL: reports_services/
    Descr: 4 carded component showing general stats about services
    """

    # Cross site request forgery
    @csrf_exempt
    def get(self, request):
        context = {"request": request, "errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not is_staff(user.id) or not can_view(user.id, 'SRV'):
            context = {"errormsg": "Insufficient Permissions. Access denied."}
            return Response(status=401, data=context)

        if Service.objects.all().count() > 0:
            # First card contains a count of each type
            first_card = {
                'all services': Service.objects.all().count(),
                'accomodation': Service.objects.filter(service_type='AC').count(),
                'air tickets': Service.objects.filter(service_type='AT').count(),
                'airport porterage': Service.objects.filter(service_type='AP').count(),
                "coach's ferry tickets": Service.objects.filter(service_type='CFT').count(),
                'cruises': Service.objects.filter(service_type='CR').count(),
                "driver's accomodation": Service.objects.filter(service_type='DA').count(),
                'ferry tickets': Service.objects.filter(service_type='FT').count(),
                'hotel porterage': Service.objects.filter(service_type='HP').count(),
                'local guides': Service.objects.filter(service_type='LG').count(),
                'restaurants': Service.objects.filter(service_type='RST').count(),
                'sport events': Service.objects.filter(service_type='SE').count(),
                'teleferiks': Service.objects.filter(service_type='TE').count(),
                'theaters': Service.objects.filter(service_type='TH').count(),
                'tolls': Service.objects.filter(service_type='TO').count(),
                'tour leaders': Service.objects.filter(service_type='TL').count(),
                "tour leader's accomodation": Service.objects.filter(service_type='TLA').count(),
                "tour leader's air tickets": Service.objects.filter(service_type='TLAT').count(),
                'train tickets': Service.objects.filter(service_type='TT').count(),
                'transfers': Service.objects.filter(service_type='TR').count(),
                'permits': Service.objects.filter(service_type='PRM').count(),
                'other services': Service.objects.filter(service_type='OTH').count(),
            }
        else:
            first_card = {}

        # Returns latest service added
        def get_latest_service(service_id):
            service = Service.objects.get(id=service_id)
            td = TravelDay.objects.get(id=service.travelday_id)
            group = GroupTransfer.objects.get(id=td.group_transfer_id)
            return f"{SERVICE_TYPES[Service.objects.latest('id').service_type]} - {td.date} - {group.refcode}"

        # Other stats
        if Service.objects.all().count() > 0:
            second_card = {
                'lowest priced service': Service.objects.all().order_by('price')[0].price,
                'highest priced service': Service.objects.all().order_by('-price')[0].price,
                'average price per service': round(Service.objects.aggregate(Sum('price'))['price__sum'] / Service.objects.values('price').count(), 2),
                'total amount of services': Service.objects.all().count(),
                'last service added': str(Service.objects.latest('id').description),
                'total cost of all services': Service.objects.aggregate(Sum('price'))['price__sum'],
                'most used service type': SERVICE_TYPES[Service.objects.values("service_type").annotate(count=Count('service_type')).order_by("-count")[0]['service_type']],
                'total amount of single rooms': Service.objects.aggregate(Sum('sgl'))['sgl__sum'],
                'total amount of double rooms': Service.objects.aggregate(Sum('dbl'))['dbl__sum'],
                'total amount of twin rooms': Service.objects.aggregate(Sum('twin'))['twin__sum'],
                'total amount of triple rooms': Service.objects.aggregate(Sum('trpl'))['trpl__sum'],
                'total amount of quadrable rooms': Service.objects.aggregate(Sum('quad'))['quad__sum'],
            }
        else:
            second_card = {}

        return Response({
            'first_card': first_card,
            'second_card': second_card,
        })


class ReportsSiteStatistics(generics.ListAPIView):
    """
    URL: reports_site_statistics/
    Descr: 4 carded component showing general stats
    """

    # Cross site request forgery
    @csrf_exempt
    def get(self, request):
        context = {"request": request, "errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not is_superuser(user.id):
            context = {"errormsg": 'Insufficient Permissions. Access denied'}
            return Response(status=401, data=context)

        # First card contains a count of each model
        first_card = {
            'groups': GroupTransfer.objects.all().count(),
            'offers': Offer.objects.all().count(),
            'agents': Agent.objects.all().count(),
            'airlines': Airline.objects.all().count(),
            'clients': Client.objects.all().count(),
            'coaches': Coach.objects.all().count(),
            'coach operators': CoachOperator.objects.all().count(),
            'cruising companies': CruisingCompany.objects.all().count(),
            'drivers': Contact.objects.filter(type='D').count(),
            'ferry ticket agencies': FerryTicketAgency.objects.all().count(),
            'dmcs': DMC.objects.all().count(),
            'group leaders': Contact.objects.filter(type='L').count(),
            'guides': Guide.objects.all().count(),
            'hotels': Hotel.objects.all().count(),
            'repair shops': RepairShop.objects.all().count(),
            'restaurants': Restaurant.objects.all().count(),
            'sport event suppliers': SportEventSupplier.objects.all().count(),
            'teleferik companies': TeleferikCompany.objects.all().count(),
            'theaters': Theater.objects.all().count(),
            'train ticket agencies': TrainTicketAgency.objects.all().count(),
        }

        # Second card contains a count of related models
        second_card = {
            'terminals': Terminal.objects.all().count(),
            'notes': Note.objects.all().count(),
            'photos': Photo.objects.all().count(),
            'documents': Document.objects.all().count(),
            'countries': Country.objects.all().count(),
            'repair types': RepairType.objects.all().count(),
            'attractions': Attraction.objects.all().count(),
            'airports': Airport.objects.all().count(),
            'ports': Port.objects.all().count(),
            'services': Service.objects.all().count(),
        }

        # General stats
        third_card = {
            'users': User.objects.all().count(),
            'active users': User.objects.filter(is_active=True).count(),
            'staff': User.objects.filter(is_staff=True).count(),
            'super users': User.objects.filter(is_superuser=True).count(),
            'uptime': uptime(),
            'last database backup': datetime.date.today() - datetime.timedelta((datetime.date.today().weekday() + 1) % 7),
            'locked users': 0,
            'total actions taken': History.objects.all().count(),
        }

        return Response({
            'first_card': first_card,
            'second_card': second_card,
            'third_card': third_card,
        })


class GroupStats(generics.ListAPIView):
    serializer_class = GroupStatsSerializer

    @csrf_exempt
    def get(self, request):
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission check
        if not can_view(user.id, 'GT'):
            return Response(status=401, data={"errormsg": "You do not have permission to view Group stats."})

        can_view_COA = can_view(user.id, 'COA')
        can_view_COL = can_view(user.id, 'COL')

        # Get Date range
        date_from = request.GET['date_from']
        date_to = request.GET['date_to']
        showing = request.GET['showing']
        status_filter = request.GET.get('status_filter', 'All')  # Get status filter parameter

        # Optimize Traveldays query
        traveldays = TravelDay.objects.filter(date__range=[date_from, date_to])
        earliest_traveldays = traveldays.values('group_transfer').annotate(earliest_date=Min('date'))
        group_transfer_ids = [item['group_transfer'] for item in earliest_traveldays]

        groups = GroupTransfer.objects.filter(id__in=group_transfer_ids)
        if not can_view_COA:
            groups = groups.exclude(refcode__startswith='COA')
        if not can_view_COL:
            groups = groups.exclude(refcode__startswith='COL')

        if showing != 'All':
            prefix = 'COA' if showing == 'COA' else 'COL'
            groups = groups.filter(refcode__startswith=prefix)

        # Apply status filter
        if status_filter != 'All':
            status_value = '5' if status_filter == 'Confirmed' else '4'
            groups = groups.filter(status=status_value)

        number_of_days = (datetime.datetime.strptime(date_to, '%Y-%m-%d').date() - datetime.datetime.strptime(date_from, '%Y-%m-%d').date()).days + 1

        # Get bar graph dates efficiently
        step = max(number_of_days // 10, 1)
        bar_graph_dates = []
        current_date = datetime.datetime.strptime(date_from, '%Y-%m-%d').date()

        while current_date <= datetime.datetime.strptime(date_to, '%Y-%m-%d').date():
            filtered_groups = GroupTransfer.objects.filter(
                id__in=traveldays.filter(date=current_date).values_list('group_transfer', flat=True)
            )
            if status_filter != 'All':
                status_value = '5' if status_filter == 'Confirmed' else '4'
                filtered_groups = filtered_groups.filter(status=status_value)
            bar_graph_dates.append({
                str(current_date): filtered_groups.count()
            })
            current_date += datetime.timedelta(days=step)

        # Groups tab data
        last_group_created = groups.order_by('-id').values_list('refcode', flat=True).first() or 'N/A'
        groups_data = {
            'total_amount_of_groups': groups.count(),
            'total_confirmed_groups': groups.filter(status='5').count(),
            'total_cancelled_groups': groups.filter(status='4').count(),
            'last_group_created': last_group_created,
        }

        # Days tab data
        group_ids = list(groups.values_list('id', flat=True))
        total_amount_of_days = traveldays.filter(group_transfer_id__in=group_ids).count()
        if total_amount_of_days > 0:
            avg_traveldays_per_group = f'{total_amount_of_days / groups.count():.2f}'
            last_travelday = traveldays.filter(group_transfer_id__in=group_ids).order_by('-id').first()
            last_travelday_added = f'{last_travelday.date} ({last_travelday.group_transfer.refcode})'
        else:
            avg_traveldays_per_group = '0.00'
            last_travelday_added = 'N/A'

        days_data = {
            'total_amount_of_days': total_amount_of_days,
            'avg_traveldays_per_group': avg_traveldays_per_group,
            'last_travelday_added': last_travelday_added,
        }

        # Other stats tab data
        other_stats_data = {
            'total_hotels_used': Hotel.objects.annotate(num_traveldays=Count('hotel_travelday')).filter(num_traveldays__gt=0).count(),
            'total_group_notes': Note.objects.count(),
            'total_group_offers': Offer.objects.count(),
        }

        # Services tab data
        service_traveldays = traveldays.filter(group_transfer_id__in=group_ids)
        total_amount_of_services = Service.objects.filter(travelday_id__in=service_traveldays.values_list('id', flat=True)).count()
        average_services_per_group = f'{(total_amount_of_services / groups.count()):.2f}' if groups.count() else '0.00'
        average_service_price = Service.objects.filter(travelday_id__in=service_traveldays.values_list('id', flat=True)).aggregate(Avg('price'))['price__avg'] or 0

        services_data = {
            'total_amount_of_services': total_amount_of_services,
            'average_services_per_group': average_services_per_group,
            'average_service_price': round(average_service_price, 2),
        }

        # 1st pie chart
        pie_chart_data = {
            'tra': groups.filter(refcode__startswith='TRA').count(),
            'trb': groups.filter(refcode__startswith='TRB').count(),
            'trl': groups.filter(refcode__startswith='TRL').count(),
            'coa': groups.filter(refcode__startswith='COA').count(),
            'col': groups.filter(refcode__startswith='COL').count(),
        }

        # 2nd pie chart
        confirmed_cancelled_chart_data = {
            'confirmed': groups.filter(status='5').count(),
            'cancelled': groups.filter(status='4').count(),
        }

        # 3rd pie chart
        country_counter = {country.name: groups.filter(Q(agent__nationality=country) | Q(client__nationality=country)).count() for country in Country.objects.all()}
        five_most_used_countries = dict(sorted(country_counter.items(), key=lambda item: item[1], reverse=True)[:5])

        # All groups data
        all_groups = [{
            'id': group.id,
            'refcode': group.refcode,
            'agent_or_client': 'Agent' if group.agent_id else 'Client',
            'agent_id': group.agent_id if group.agent_id else 'N/A',
            'agent_name': str(group.agent.name) if group.agent_id else 'N/A',
            'agents_refcode': group.agents_refcode if group.agents_refcode else 'N/A',
            'client_id': group.client_id if group.client_id else 'N/A',
            'client_name': str(group.client.name) if group.client_id else 'N/A',
            'clients_refcode': group.clients_refcode if group.clients_refcode else 'N/A',
            'status': 'Confirmed' if group.status == '5' else 'Cancelled',
            'nationality': group.agent.nationality.name if group.agent_id else (group.client.nationality.name if group.client_id else 'N/A'),
            'nationality_code': group.agent.nationality.code if group.agent_id else (group.client.nationality.code if group.client_id else 'N/A'),
            'number_of_people': group.number_of_people,
        } for group in groups]

        return Response({
            'groups_data': groups_data,
            'bar_graph_dates': bar_graph_dates,
            'all_groups': all_groups,
            'days_data': days_data,
            'other_stats_data': other_stats_data,
            'services_data': services_data,
            'pie_chart_data': pie_chart_data,
            'confirmed_cancelled_chart_data': confirmed_cancelled_chart_data,
            'most_used_countries_data': five_most_used_countries,
        })


class ReportsOptionDates(generics.ListAPIView):
    """
    URL: reports_option_dates/
    Descr: Table showing Option Dates of traveldays
    """

    # Cross site request forgery
    @csrf_exempt
    def get(self, request):
        context = {"request": request, "errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_view(user.id, 'GT'):
            context = {"errormsg": "Insufficient Permissions. Access denied."}
            return Response(status=401, data=context)

        option_dates = []

        # Get today's date
        today = datetime.date.today()
        opt_color = ''

        # For driver in all drivers

        tds_with_opt_date = TravelDay.objects.filter(option_date__isnull=False)

        filter_by_option_date = request.GET.get('filter_by_option_date')

        # Get next 30 days
        next_30_days = [datetime.date.today() + datetime.timedelta(days=x) for x in range(31)]
        next_30_days_human_format = [datetime.date.strftime(i, '%d-%m-%Y') for i in next_30_days]

        if filter_by_option_date == 'Show All':
            pass
        elif filter_by_option_date == 'Dates Passed':
            tds_with_opt_date = tds_with_opt_date.filter(option_date__lt=timezone.now().date())
        else:
            tds_with_opt_date = tds_with_opt_date.filter(option_date__range=[today, next_30_days[-1]])

        for td in tds_with_opt_date:

            if datetime.date.strftime(td.option_date, '%d-%m-%Y') in next_30_days_human_format:
                opt_color = 'orange'

            elif td.option_date > today:
                opt_color = 'green'

            else:
                opt_color = 'red'

            option_dates.append({
                'id': td.id,
                'refcode': GroupTransfer.objects.get(id=td.group_transfer.id).refcode,
                'hotel': Hotel.objects.get(id=td.hotel_id).name,
                'date': td.date,
                'option_date': td.option_date,
                'color': opt_color,
            })

        # Sort the option_dates list based on the 'option_date' field
        option_dates.sort(key=lambda x: extract_date(str(x['option_date'])))

        return Response({
            'all_option_dates': option_dates,
        })
