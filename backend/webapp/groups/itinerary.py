import os
from webapp.models import (
    GroupTransfer,
    History,
    Contact,
    TravelDay,
    Hotel,
    Service,
    Airline,
    DMC,
    FerryTicketAgency,
    CruisingCompany,
    Guide,
    Restaurant,
    SportEventSupplier,
    TeleferikCompany,
    Theater,
    TrainTicketAgency,
    Attraction,
    AttractionEntries,
)
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authtoken.models import Token
from rest_framework import generics

from textwrap import wrap
from rest_framework.response import Response
import datetime
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate,
    Spacer,
    Table,
)
from reportlab.lib.styles import (
    getSampleStyleSheet,
    ParagraphStyle
)
from reportlab.platypus import (
    Image,
    Paragraph,
    PageBreak,
)
from reportlab.lib.enums import (
    TA_CENTER,
    TA_LEFT,
    TA_RIGHT
)
from core.settings import BASE_DIR
from webapp.serializers import (
    GroupSerializer,
)
from accounts.permissions import (
    can_update,
    can_delete,
)

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
    'Museum': 'MU',
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
    "SHT": 'Sightseeing',
    "MU": 'Museum',
    "TE": 'Teleferik',
    "TH": 'Theater',
    "TO": 'Toll',
    "TL": 'Tour Leader',
    "TLA": "Tour Leader's Accommodation",
    "TLAT": "Tour Leader's Air Ticket",
    "TT": 'Train Ticket',
    "TP": "Theme Park",
    "TR": 'Transfer',
    "OTH": 'Other',
    "PRM": 'Permit',
}


# Get user from token
def get_user(token):
    return Token.objects.get(key=token).user


# Used to make service type shorter, in order to fit PDFs
def sort_service_type(service_type):
    if service_type == 'TLA':
        return 'TL Accommodation'
    elif service_type == 'TLAT':
        return 'TL Air Ticket'
    elif service_type == 'DA':
        return 'Driver Accomod.'
    elif service_type == 'CFT':
        return "Coach F. Ticket"
    else:
        return SERVICE_TYPES_REV[service_type]


# This function gets the service type, and returns the related object's name
# It also sorts the name, up to 30 characters
def get_service_object_name(service_type, service_id):
    service = Service.objects.get(id=service_id)

    try:
        if service_type == 'AC' or service_type == 'DA' or service_type == 'HP' or service_type == 'TLA':
            return Hotel.objects.get(id=service.hotel_id).name[:30]
        elif service_type == 'AT' or service_type == 'TLAT':
            return Airline.objects.get(id=service.airline_id).name[:30]

        elif service_type == 'AP':
            return DMC.objects.get(id=service.dmc_id).name[:30]

        elif service_type == 'CFT' or service_type == 'FT':
            return FerryTicketAgency.objects.get(id=service.ferry_ticket_agency_id).name[:30]

        elif service_type == 'CR':
            return CruisingCompany.objects.get(id=service.cruising_company_id).name[:30]

        elif service_type == 'LG':
            return Guide.objects.get(id=service.guide_id).name[:30]

        elif service_type == 'RST':
            return Restaurant.objects.get(id=service.restaurant_id).name[:30]

        elif service_type == 'SE':
            return SportEventSupplier.objects.get(id=service.sport_event_supplier_id).name[:30]

        elif service_type == 'TE':
            return TeleferikCompany.objects.get(id=service.teleferik_company_id).name[:30]

        elif service_type == 'TH':
            return Theater.objects.get(id=service.theater_id).name[:30]

        elif service_type == 'TT':
            return TrainTicketAgency.objects.get(id=service.train_ticket_agency_id).name[:30]

        else:
            # If nothing fits, return ' - '
            return ' - '
    # If there is no related object, return "N/A"
    except (
        Hotel.DoesNotExist,
        Airline.DoesNotExist,
        DMC.DoesNotExist,
        FerryTicketAgency.DoesNotExist,
        CruisingCompany.DoesNotExist,
        Guide.DoesNotExist,
        Restaurant.DoesNotExist,
        SportEventSupplier.DoesNotExist,
        TeleferikCompany.DoesNotExist,
        Theater.DoesNotExist,
        TrainTicketAgency.DoesNotExist,
    ):
        return 'N/A'


pdfmetrics.registerFont(TTFont('calibri', os.path.join(BASE_DIR, 'calibri.ttf')))
pdfmetrics.registerFont(TTFont('calibri-bold', os.path.join(BASE_DIR, 'calibri-bold.ttf')))


class DownloadItinerary(generics.ListAPIView):
    """
    URL: download_itinerary/(?P<refcode>.*)$
    """

    @csrf_exempt
    def get(self, request, refcode):

        user = User.objects.get(id=request.GET.get('user_id'))
        # Get Group
        group = GroupTransfer.objects.get(refcode=refcode)

        if not group.itinerary_downloaded:
            group.itinerary_downloaded = True
            group.save()

        group.itinerary_downloaded = True
        group.save()

        # File is also stored in file system on the same path
        pdftitle = os.path.join(BASE_DIR, 'static', 'itineraries' + "/" + refcode + '_itinerary.pdf')
        parts = []

        # Document's styles
        styles = getSampleStyleSheet()
        styles.add(ParagraphStyle(name='Center', alignment=TA_CENTER))
        styles.add(ParagraphStyle(name='Left', alignment=TA_LEFT))
        styles.add(ParagraphStyle(name='Right', alignment=TA_RIGHT))

        logo = os.path.join(BASE_DIR, 'static', 'images', 'logos', 'cosmoplan_logo.jpg')
        im = Image(logo, 3.5 * inch, 1 * inch,  hAlign='LEFT')

        # Get Traveldays
        traveldays = TravelDay.objects.filter(group_transfer_id=group.id)
        drivers = set([Contact.objects.get(id=i.driver_id) for i in traveldays if i.driver_id is not None])

        # # # # # # # # # # # # # #
        # # # # 1) HEADER # # # # #
        # # # # # # # # # # # # # #
        init_table_data = [['', 'Cosmoplan International Travel LTD.', '', '', ''], ]
        init_table_data.append(['', '', '', '', ])
        init_table_data.append(['', 'Athens Office: ', 'London Office: ', '', ])
        init_table_data.append(['', '10 Xenofontos Street,', '105-109 Sumatra Road,', '', im])
        init_table_data.append(['', 'Syntagma, Athens, 10557', 'London, NW6 1PL', ''])
        init_table_data.append(['', 'Tel: +30 210 9219400', 'Tel: +44 2081436880', ''])
        init_table_data.append(['', 'https://cosmoplan.gr', 'https://cosmoplandmc.com', ''])

        table = Table(
            init_table_data,
            rowHeights=14,
            colWidths=[150, 140, 100, 70, 400],
            style=[
                ('FONT', (0, 0), (4, 0), 'calibri-bold', 18),       # Cosmoplan International Travel LTD. ( 1st row )
                ("VALIGN", (4, 3), (4, 3), "MIDDLE"),               # Logo Image
                ('FONT', (0, 2), (4, 2), 'calibri-bold', 14),       # "Athens Office: // London Office: "
                ('FONT', (0, 3), (4, 6), 'calibri', 10),    # Rest Of Table
                ('TEXTCOLOR', (0, 6), (4, 6), colors.blue),         # Links // cosmoplandmc.com // cosmoplan.gr
                ('FONT', (0, 6), (4, 6), 'calibri', 10),     # Links // cosmoplandmc.com // cosmoplan.gr
            ]
        )
        parts.append(table)
        parts.append(Spacer(3, 30))

        # # # # # # # # # # # # # #
        # # # 2) GROUP INFO  / OFFICE CONTACT # # # #
        # # # # # # # # # # # # # #
        init_table_data = [
            ['Group Info', '', 'Office Contact', ''],
            ['Refcode : ', refcode, 'Tel : ', '+30 2109219400'],
            ['PAX : ', group.number_of_people, 'E-mail : ', 'info@cosmoplan.gr'],
            ['Room Description : ', group.room_desc, 'Emergency : ', 'Rui W. : +30 6936585911 / +44 7503080320'],
            ['Incoming Service : ', 'Cosmoplan International Travel.', '', 'Jiamei L. :  +30 6945943332'],
            ['', '', '', 'Stella S. : +30 6948813839'],
        ]

        table = Table(
            init_table_data,
            hAlign='LEFT',
            style=[
                # Generic
                ('TEXTCOLOR', (1, -1), (-1, -1), colors.black),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ('FONT', (0, 0), (-1, -1), 'calibri', 10),
                ('TEXTCOLOR', (0, 0), (4, 0), colors.black),

                # 1st row styling:
                ('FONT', (0, 0), (-1, 0), 'calibri-bold', 14),
                ('SPAN', (0, 0), (1, 0)),  # Merge and center the first two cells
                ('SPAN', (2, 0), (3, 0)),  # Merge and center the next two cells

                # Emergency
                ('FONT', (2, -1), (3, -1),  'calibri', 10),  # Background color for the bottom right cell
                ('TEXTCOLOR', (2, -1), (3, -1), colors.red),
                ('FONT', (2, -2), (3, -2), 'calibri', 10),  # Background color for the cell above the bottom right
                ('TEXTCOLOR', (2, -2), (3, -2), colors.red),
                ('FONT', (2, -3), (3, -3), 'calibri', 10),  # Background color for the cell two rows above the bottom right
                ('TEXTCOLOR', (2, -3), (3, -3), colors.red),

            ]
        )
        parts.append(table)
        parts.append(Spacer(3, 30))

        # # # # # # # # # # # # # # # # # # # #
        # # # # 3) ARRIVAL / DEPARTURE  # # # #
        # # # # # # # # # # # # # # # # # # # #
        init_table_data = [['Arrival Info', '', 'Departure Info', ''], ]
        arrival_date_label = 'Date : '
        arrival_date = group.arrival.split(' - ')[0][4:]
        departure_date_label = 'Date : '
        departure_date = group.departure.split(' - ')[0][4:]

        if group.arrival_type == 'AIR':
            a_first_label = 'Airport : '
            a_first_key = group.arrival.split(' - ')[2]
            a_second_label = 'Flight : '
            a_second_key = group.arrival.split(' - ')[1]
            a_third_label = 'Terminal : '
            a_third_key = group.arrival.split(' - ')[-1]
        elif group.arrival_type == 'SEA':
            a_first_label = 'Port : '
            a_first_key = group.arrival.split(' - ')[1] + ' - ' + group.arrival.split(' - ')[2].split(",")[0]
            a_second_label = 'Agency : '
            a_second_key = group.arrival.split(',')[1]
            a_third_label = 'Ship Name : '
            a_split = group.arrival.split(',')
            a_third_key = a_split[2] if len(a_split) > 2 else 'N/A'
        elif group.arrival_type == 'TRN':
            a_first_label = 'Railway Station : '
            a_first_key = group.arrival.split(' - ')[1] + ' - ' + group.arrival.split(' - ')[2].split(",")[0]
            a_second_label = 'Agency : '
            a_second_key = group.arrival.split(',')[1]
            a_third_label = 'Route : '
            a_split = group.arrival.split(',')
            a_third_key = a_split[2] if len(a_split) > 2 else 'N/A'
        else:
            a_first_label = ''
            a_first_key = ''
            a_second_label = ''
            a_second_key = ''
            a_third_label = ''
            a_third_key = ''

        if group.departure_type == 'AIR':
            d_first_label = 'Airport : '
            d_first_key = group.departure.split(' - ')[2]
            d_second_label = 'Flight : '
            d_second_key = group.departure.split(' - ')[1]
            d_third_label = 'Terminal : '
            d_third_key = group.departure.split(' - ')[-1]
        elif group.departure_type == 'SEA':
            d_first_label = 'Port : '
            d_first_key = group.departure.split(' - ')[1] + ' - ' + group.departure.split(' - ')[2].split(",")[0]
            d_second_label = 'Agency : '
            d_second_key = group.departure.split(',')[1]
            d_third_label = 'Ship Name : '
            departure_split = group.departure.split(',')
            d_third_key = departure_split[2] if len(departure_split) > 2 else 'N/A'
        elif group.departure_type == 'TRN':
            d_first_label = 'Railway Station : '
            d_first_key = group.departure.split(' - ')[1] + ' - ' + group.departure.split(' - ')[2].split(",")[0]
            d_second_label = 'Agency : '
            d_second_key = group.departure.split(',')[1]
            d_third_label = 'Route : '
            departure_split = group.departure.split(',')
            d_third_key = departure_split[2] if len(departure_split) > 2 else 'N/A'
        else:
            d_first_label = ''
            d_first_key = ''
            d_second_label = ''
            d_second_key = ''
            d_third_label = ''
            d_third_key = ''

        try:
            init_table_data.append([arrival_date_label, arrival_date, departure_date_label, departure_date])
            init_table_data.append([a_first_label, a_first_key, d_first_label, d_first_key,])
            init_table_data.append([a_second_label, a_second_key, d_second_label, d_second_key,])
            init_table_data.append([a_third_label, a_third_key, d_third_label, d_third_key,])
            table = Table(
                init_table_data,
                rowHeights=14,
                colWidths=[80, 200, 80, 200],
                hAlign='LEFT',
                style=[
                    ('TEXTCOLOR', (1, -1), (-1, -1), colors.black),
                    ('FONT', (0, 0), (-1, -1), 'calibri', 10),
                    ('TEXTCOLOR', (0, 0), (4, 0), colors.black),
                    ('FONT', (0, 0), (4, 0), 'calibri-bold', 14),
                ]
            )
            parts.append(table)
            parts.append(Spacer(3, 30))
        except IndexError:
            pass

        init_table_data = []

        # # # # # # # # # # # # # # # # # # #
        # # # 4) COACH AND DRIVER INFO  # # #
        # # # # # # # # # # # # # # # # # # #
        traveldays = TravelDay.objects.filter(group_transfer_id=group.id)
        coach_info_data = []
        period_dict = []

        # Add periods for each driver
        if traveldays.count() > 0:
            prev_driver = traveldays[0].driver
            prev_coach = traveldays[0].coach
            period_dict.append({
                'driver': prev_driver,
                'coach': prev_coach,
                'starting_period': traveldays[0].date,
                'ending_period': traveldays[0].date
            })

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

            for period in period_dict:
                period_start = datetime.datetime.strftime(period['starting_period'], '%d/%m/%Y')
                period_end = datetime.datetime.strftime(period['ending_period'], '%d/%m/%Y')
                period_str = f"{period_start} - {period_end}"
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

                coach_info_data.append({
                    'period': period_str,
                    'driver': driver.name if driver else 'N/A',
                    'driver_id': driver.id if driver else 'N/A',
                    'coach_operator': coach_operator,
                    'coach_operator_id': coach_operator_id,
                    'coach_make': coach_make,
                    'coach_plate_num': coach_plate_num,
                    'coach_seats': coach_seats,
                })

        init_table_data = [
            ['Coach Info',],
            ['Number Plate', 'Make', 'Seats', 'Period'],
        ]

        for row in coach_info_data:
            init_table_data.append([
                row['coach_plate_num'],
                row['coach_make'],
                row['coach_seats'],
                row['period'],
            ])

        table = Table(
            init_table_data,
            hAlign='LEFT',
            style=[
                ('TEXTCOLOR', (1, -1), (-1, -1), colors.black),
                ('FONT', (0, 0), (-1, -1), 'calibri', 10),
                ('TEXTCOLOR', (0, 0), (4, 0), colors.black),
                ('FONT', (0, 0), (4, 0), 'calibri-bold', 12),
            ]
        )
        parts.append(table)
        parts.append(Spacer(3, 30))

        # # # # # # # # # # # # # # # # # # #
        # # # 5) DRIVER CONTACT INFO  # # # #
        # # # # # # # # # # # # # # # # # # #
        init_table_data = [
            ['Driver Info',],
            ['Driver name', 'Tel', 'Tel 2', 'Tel 3'],
        ]

        for driver in drivers:
            if driver != 'N/A':
                init_table_data.append([
                    driver.name if driver.name else 'N/A',
                    driver.tel if driver.tel else 'N/A',
                    driver.tel2 if driver.tel2 else 'N/A',
                    driver.tel3 if driver.tel3 else 'N/A',
                ])

        if len(init_table_data) > 1:
            # Second Table
            table = Table(
                init_table_data,
                hAlign='LEFT',
                style=[
                    ('TEXTCOLOR', (1, -1), (-1, -1), colors.black),
                    ('FONT', (0, 0), (-1, -1), 'calibri', 10),
                    ('TEXTCOLOR', (0, 0), (4, 0), colors.black),
                    ('FONT', (0, 0), (4, 0), 'calibri-bold', 12),
                ]
            )
            parts.append(table)
            parts.append(Spacer(3, 30))

        # # # # # # # # # # # # # # # # # # #
        # # # 6) LEADER CONTACT INFO  # # # #
        # # # # # # # # # # # # # # # # # # #
        leader_info_data = []
        period_dict = []

        all_leaders = list(filter(lambda x: x is not None, [i.leader for i in traveldays if i is not None]))

        if len(all_leaders) > 0:
            # Add periods for each driver
            if traveldays.count() > 0:
                prev_leader = traveldays[0].leader
                prev_coach = traveldays[0].coach
                period_dict.append({
                    'leader': prev_leader,
                    'starting_period': traveldays[0].date,
                    'ending_period': traveldays[0].date
                })

                for travelday in traveldays[1:]:
                    leader = travelday.leader
                    if leader != prev_leader:
                        period_dict.append({
                            'leader': leader,
                            'starting_period': travelday.date,
                            'ending_period': travelday.date
                        })
                    else:
                        period_dict[-1]['ending_period'] = travelday.date
                    prev_leader = leader

                for period in period_dict:
                    period_start = datetime.datetime.strftime(period['starting_period'], '%d/%m/%Y')
                    period_end = datetime.datetime.strftime(period['ending_period'], '%d/%m/%Y')
                    period_str = f"{period_start} - {period_end}"
                    leader = period['leader'].name if period['leader'] else 'N/A'

                    leader = period['leader'] if period['leader'] else None

                    leader_info_data.append({
                        'period': period_str,
                        'leader': leader.name if leader else 'N/A',
                        'leader_id': leader.id if leader else 'N/A',
                        'Tel': leader.tel if leader else 'N/A',
                        'Tel2': leader.tel2 if leader else 'N/A',
                        'Tel3': leader.tel3 if leader else 'N/A',
                        'email': leader.email if leader else 'N/A',
                    })

            # 1st table
            init_table_data = [
                ['Leader Info',],
                ['Leader name', 'Tel', 'Tel2', 'Tel3', 'E-mail', 'Period'],
            ]

            for row in leader_info_data:
                if row['leader'] != 'N/A':
                    init_table_data.append([
                        row['leader'] if row['leader'] is not None else "N/A",
                        row['Tel'] if row['Tel'] is not None else "N/A",
                        row['Tel2'] if row['Tel2'] is not None else "N/A",
                        row['Tel3'] if row['Tel3'] is not None else "N/A",
                        row['email'] if row['email'] is not None else "N/A",
                        row['period'] if row['period'] is not None else "N/A",
                    ])

            # Fourth table
            table = Table(
                init_table_data,
                hAlign='LEFT',
                style=[
                    ('TEXTCOLOR', (1, -1), (-1, -1), colors.black),
                    ('FONT', (0, 0), (-1, -1), 'calibri', 10),
                    ('TEXTCOLOR', (0, 0), (4, 0), colors.black),
                    ('FONT', (0, 0), (4, 0), 'calibri-bold', 12),
                ]
            )
            parts.append(table)

        # # # # # # # # # # # # # #
        # # # 7) HOTEL LIST # # # #
        # # # # # # # # # # # # # #
        parts.append(PageBreak())
        parts.append(Paragraph('<font size=14><b>Hotel List</b></font>',  styles["Left"]))
        parts.append(Spacer(1, 10))

        # Table headers
        init_table_data = [['Day', 'Date', 'City - Country', 'Hotel'], ]
        row_index = 0

        init_table_style = [
            ('TEXTCOLOR', (1, -1), (-1, -1), colors.black),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ('FONT', (0, 0), (-1, -1), 'calibri', 10),
            ('TEXTCOLOR', (0, 0), (4, 0), colors.black),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.black),
        ]

        # Table's data
        for i, day in enumerate(traveldays):
            region = 'N/A'
            hotel = day.hotel.name if day.hotel else "N/A"
            if hotel != "N/A":
                region = day.hotel.region.split(" >>> ", 1)[-1] if day.hotel.region else 'N/A'
                try:
                    hotel += " " + str(day.hotel.rating // 10) + "*"
                except Exception as a:
                    print(a)
            init_table_data.append([str(i+1), day.date.strftime("%d-%b-%Y"), region, hotel])
            row_index += 1

            if hotel != "N/A":
                init_table_data.append(['', '', '', 'Address : ' + "\n".join(wrap(day.hotel.contact.address, 30))])
                init_table_data.append(['', '', '', f'Tel: {day.hotel.contact.tel}'])
                init_table_style.append(('SPAN', (0, row_index), (0, row_index+2)),)
                init_table_style.append(('SPAN', (1, row_index), (1, row_index+2)),)
                init_table_style.append(('SPAN', (2, row_index), (2, row_index+2)),)
                row_index += 2

        table = Table(
            init_table_data,
            hAlign='LEFT',
            style=init_table_style
        )

        parts.append(table)
        parts.append(Spacer(5, 50))

        # # # # # # # # # # # # # #
        # # # 10) ATTENTION # # # #
        # # # # # # # # # # # # # #
        parts.append(Paragraph('<font size=14 color=red><b>ATTENTION</b></font>',  styles["Center"]))
        parts.append(Spacer(1, 10))

        text = """
        <font size=11 color=red>
            ΠΑΡΑΚΑΛΟΥΝΤΑΙ ΟΙ ΟΔΗΓΟΙ ΝΑ ΕΠΙΒΕΒΑΙΩΝΟΥΝ ΜΕ ΤΟΥΣ ΑΡΧΗΓΟΥΣ ΤΙΣ ΛΙΣΤΕΣ ΜΕ ΤΑ ΞΕΝΟΔΟΧΕΙΑ ΩΣΤΕ ΝΑ ΜΗΝ ΥΠΑΡΧΕΙ ΚΑΜΙΑ ΔΙΑΦΟΡΑ.
            ΣΕ ΠΕΡΙΠΤΩΣΗ ΠΟΥ Η ΛΙΣΤΑ ΜΑΣ ΕΧΕΙ ΔΙΑΦΟΡΑ ΜΕ ΤΗΝ ΛΙΣΤΑ ΤΟΥ ΑΡΧΗΓΟΥ Η ΣΕ ΠΕΡΙΠΤΩΣΗ ΠΟΥ Ο ΑΡΧΗΓΟΣ ΣΑΣ ΛΕΕΙ ΟΤΙ ΥΠΑΡΧΕΙ ΑΛΛΑΓΗ
            ΞΕΝΟΔΟΧΕΙΟΥ ΚΑΙ ΔΕΝ ΕΧΕΤΕ ΑΝΤΙΣΤΟΙΧΗ ΕΝΗΜΕΡΩΣΗ ΑΠΟ ΕΜΑΣ, ΠΑΡΑΚΑΛΕΙΣΤΕ ΝΑ ΕΠΙΚΟΙΝΩΝΕΙΤΕ ΜΕ ΤΟ ΓΡΑΦΕΙO.
        </font>
        """

        parts.append(Paragraph(text, styles["Center"]))
        parts.append(Spacer(2, 20))

        text = """
        <font size=11 color=red>
            DRIVERS WILL HAVE TO CONFIRM THE HOTEL LIST WITH THE GROUP LEADER SO THAT THERE IS NO DISCREPANCY.
            IN CASE OUR HOTEL LIST IS DIFFERENT FROM THE GROUP LEADER'S, OR IN CASE THE GROUP LEADER SAYS THERE IS A CHANGE REGARDING THE HOTELS
            AND YOU HAVE NOT RECEIVED A CORRESPONDING UPDATE FROM US, PLEASE CONTACT OUR OFFICE.
        </font>
        """

        parts.append(Paragraph(text, styles["Center"]))

        # # # # # # # # # # # # # #
        # # # 11) ITINERARY # # # #
        # # # # # # # # # # # # # #
        # parts.append(PageBreak())
        # parts.append(Paragraph('<font size=14><b>Itinerary</b></font>',  styles["Left"]))
        # parts.append(Spacer(1, 10))

        # for i, travelday in enumerate(traveldays):
        #     parts.append(Paragraph(f'<font size=12>{i+1}) {travelday.date}</font>',  styles["Left"]))
        #     parts.append(Spacer(1, 10))
        #     init_table_data = [
        #     ]

        #     attraction_entries = AttractionEntries.objects.filter(travelday_id=travelday.id)
        #     att_span_style = ('TEXTCOLOR', (1, -1), (-1, -1), colors.black)

        #     if attraction_entries.count() > 0:
        #         for attraction in attraction_entries.order_by('start_time'):
        #             time = attraction.start_time if attraction.start_time != "00:00" else ""
        #             init_table_data.append(
        #                 ['Attractions', attraction.attraction.name, time]
        #             )
        #         att_span_style = ('SPAN', (0, 1), (0, attraction_entries.count()))

        #     service_entries = Service.objects.filter(travelday_id=travelday.id)
        #     serv_span_style = ('TEXTCOLOR', (1, -1), (-1, -1), colors.black)

        #     if service_entries.count() > 0:
        #         for service in service_entries.order_by('start_time'):
        #             time = service.start_time if service.start_time != "00:00" else ""
        #             init_table_data.append([
        #                 'Services',
        #                 SERVICE_TYPES_REV[service.service_type],
        #                 time,
        #                 # "\n".join(wrap(service.description, 30))
        #             ])

        #             if service.restaurant_id:
        #                 restaurant = Restaurant.objects.get(id=service.restaurant_id)
        #                 init_table_data.append(['', 'Name: ', "\n".join(wrap(restaurant.name, 30))])
        #                 init_table_data.append(['', 'Address: ', "\n".join(wrap(restaurant.contact.address, 30))])
        #                 init_table_data.append(['', 'Tel: ', restaurant.contact.tel])

        #             elif service.hotel_id:
        #                 hotel = Hotel.objects.get(id=service.hotel_id)
        #                 init_table_data.append(['', 'Name: ', "\n".join(wrap(hotel.name, 30))])
        #                 init_table_data.append(['', 'Address: ', "\n".join(wrap(hotel.contact.address, 30))])
        #                 init_table_data.append(['', 'Tel: ', hotel.contact.tel])

        #             elif service.airline_id:
        #                 airline = Airline.objects.get(id=service.airline_id)
        #                 init_table_data.append(['', 'Name: ', airline.name])
        #                 init_table_data.append(['', 'Abbreviation: ', airline.abbreviation])

        #             elif service.dmc_id:
        #                 dmc = DMC.objects.get(id=service.dmc_id)
        #                 init_table_data.append(['', 'Name: ', "\n".join(wrap(dmc.name, 30))])
        #                 init_table_data.append(['', 'Address: ', "\n".join(wrap(dmc.contact.address, 30))])
        #                 init_table_data.append(['', 'Tel: ', dmc.contact.tel])

        #             elif service.ferry_ticket_agency_id:
        #                 ferry_ticket_agency = FerryTicketAgency.objects.get(id=service.ferry_ticket_agency_id)
        #                 init_table_data.append(['', 'Name: ', "\n".join(wrap(ferry_ticket_agency.name, 30))])
        #                 init_table_data.append(['', 'Address: ', "\n".join(wrap(ferry_ticket_agency.contact.address, 30))])
        #                 init_table_data.append(['', 'Tel: ', ferry_ticket_agency.contact.tel])

        #             elif service.cruising_company_id:
        #                 cruising_company = CruisingCompany.objects.get(id=service.cruising_company_id)
        #                 init_table_data.append(['', 'Name: ', "\n".join(wrap(cruising_company.name, 30))])
        #                 init_table_data.append(['', 'Address: ', "\n".join(wrap(cruising_company.contact.address, 30))])
        #                 init_table_data.append(['', 'Tel: ', cruising_company.contact.tel])

        #             elif service.guide_id:
        #                 guide = Guide.objects.get(id=service.guide_id)
        #                 init_table_data.append(['', 'Name: ', "\n".join(wrap(guide.name, 30))])
        #                 init_table_data.append(['', 'Address: ', "\n".join(wrap(guide.contact.address, 30))])
        #                 init_table_data.append(['', 'Tel: ', guide.contact.tel])

        #             elif service.sport_event_supplier_id:
        #                 sport_event_supplier = SportEventSupplier.objects.get(id=service.sport_event_supplier_id)
        #                 init_table_data.append(['', 'Name: ', "\n".join(wrap(sport_event_supplier.name, 30))])
        #                 init_table_data.append(['', 'Address: ', "\n".join(wrap(sport_event_supplier.contact.address, 30))])
        #                 init_table_data.append(['', 'Tel: ', sport_event_supplier.contact.tel])

        #             elif service.teleferik_company_id:
        #                 teleferik_company = TeleferikCompany.objects.get(id=service.teleferik_company_id)
        #                 init_table_data.append(['', 'Name: ', "\n".join(wrap(teleferik_company.name, 30))])
        #                 init_table_data.append(['', 'Address: ', "\n".join(wrap(teleferik_company.contact.address, 30))])
        #                 init_table_data.append(['', 'Tel: ', teleferik_company.contact.tel])

        #             elif service.theater_id:
        #                 theater = Theater.objects.get(id=service.theater_id)
        #                 init_table_data.append(['', 'Name: ', "\n".join(wrap(theater.name, 30))])
        #                 init_table_data.append(['', 'Address: ', "\n".join(wrap(theater.contact.address, 30))])
        #                 init_table_data.append(['', 'Tel: ', theater.contact.tel])

        #             elif service.train_ticket_agency_id:
        #                 train_ticket_agency = TrainTicketAgency.objects.get(id=service.train_ticket_agency_id)
        #                 init_table_data.append(['', 'Name: ', "\n".join(wrap(train_ticket_agency.name, 30))])
        #                 init_table_data.append(['', 'Address: ', "\n".join(wrap(train_ticket_agency.contact.address, 30))])
        #                 init_table_data.append(['', 'Tel: ', train_ticket_agency.contact.tel])

        #         serv_span_style = ('SPAN', (0, attraction_entries.count() + 1), (0, attraction_entries.count() + service_entries.count()))

        #     table = Table(
        #         init_table_data,
        #         hAlign='LEFT',
        #         style=[
        #             ('TEXTCOLOR', (1, -1), (-1, -1), colors.black),
        #             ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        #             ('FONT', (0, 0), (-1, -1), 'calibri', 10),
        #             ('TEXTCOLOR', (0, 0), (4, 0), colors.black),
        #             att_span_style,
        #             serv_span_style,
        #         ]
        #     )
        #     parts.append(table)
        #     if travelday.comment is not None:
        #         parts.append(Paragraph(f'<font size=10>{travelday.comment}</font>',  styles["Left"]))
        #     parts.append(Spacer(2, 20))

        # # # # # # # # # # # # # #
        # # # 12) REMARKS # # # # #
        # # # # # # # # # # # # # #
        parts.append(PageBreak())
        parts.append(Paragraph('<font size=18><b>Remarks</b></font>',  styles["Left"]))
        parts.append(Spacer(2, 20))

        text = """
            <font size=11>
                1) The coach company in the case of a breakdown is responsible for ensuring the uninterrupted continuation of the tour or arranging for
                a suitable substitute coach within a maximum of 4 hours, regardless of any unforeseen circumstances that may occur during the tour.
            </font>
            <div>
                &nbsp;
            </div>
            <font size=11>
                2) Any optionals are based on the agreements made between the driver, tour leader,
                and coach operator. The company will not intervene in this matter under any circumstances.
            </font>
            <div>
                &nbsp;
            </div>
            <br/>
            <font size=14>
                <b>
                    Attention by Tour Operators, Travel Agents, Unions and Schools
                </b>
            </font>
            <div>
                &nbsp;
            </div>
            <font size=11>
                1) Kindly verify all pickup and drop-off information to ensure its accuracy.
                If there are any discrepancies from our latest information,
                please notify us promptly so that we can make necessary arrangements in a timely manner.
            </font>
            <div>
                &nbsp;
            </div>
            <font size=11>
                2) If we do not receive any alternative documentation from you, we will consider
                the information provided as the final details for this group.
            </font>
            <div>
                &nbsp;
            </div>
            <font size=11>
                3) Should any changes be made to the final itinerary, please inform us immediately.
                While we will make every effort to communicate with the coach company,
                any change fees incurred due to your last-minute itinerary adjustments will be your responsibility.
            </font>
            <div>
                &nbsp;
            </div>
            <font size=11>
                4) If any issues arise with the coach or the driver, it is imperative that the tour leader contacts us immediately,
                regardless of the time or location. This will allow us to investigate the situation promptly and address any problems that may arise.
                We will not entertain any complaints regarding the coach or the driver once the tour has been completed.
            </font>
            <div>
                &nbsp;
            </div>
            <font size=11>
                5) The tour leader is required to cover the following expenses, unless otherwise agreed between Cosmoplan and the Client: &nbsp;
            </font>
            <br/>
            <font size=11>
                &bull; Any parking fees and city permit&nbsp;
            </font>
            <font size=11>
                &bull; Go-Box fee in Austria and Switzerland road tax&nbsp;
            </font>
            <font size=11>
                &bull; Any tunnel fee, mountain pass fee, ferry fee and bridge fee&nbsp;
            </font>
            <font size=11>
                &bull; Please note that all fees are subject to any additional options chosen.&nbsp;
            </font>
            <font size=11>
                &bull; Italian and French tolls.&nbsp;
            </font>
            <font size=11>
                &bull; Germany road tax.&nbsp;
            </font>
            <div>
                <br/><br/><br/><br/><br/>
            </div>
            <font size=18><b>Παρατηρήσεις&nbsp;</b></font>
            <br/>
            <font size=11>
                1) Η εταιρεία λεωφορείων σε περίπτωση βλάβης είναι υπεύθυνη για τη
                διασφάλιση της αδιάκοπης συνέχισης της εκδρομής ή για την κανονισμένη αντικατάσταση του λεωφορείου
                εντός μέγιστου χρονικού διαστήματος 4 ωρών, ανεξάρτητα από τυχόν απρόβλεπτες
                περιστάσεις που μπορεί να προκύψουν κατά τη διάρκεια της εκδρομής.
            </font>
            <div>
                &nbsp;
            </div>
            <font size=11>
                2) Οποιαδήποτε προαιρετικά βασίζονται στις συμφωνίες που έχουν γίνει μεταξύ του οδηγού,
                του υπεύθυνου εκδρομής και του φορέα λεωφορείου.
                Η εταιρεία δεν θα παρέμβει σε αυτό το θέμα υπό οποιεσδήποτε συνθήκες.
            </font>
            <p>
                &nbsp;
            </p>
            <font size=14>
                <b>
                    Προσοχή από τους Φορείς Οργάνωσης Εκδρομών, Ταξιδιωτικά Γραφεία, Σωματεία και Σχολεία
                </b>
            </font>
            <div>
                &nbsp;
            </div>
            <font size=11>
                1) Παρακαλούμε να επαληθεύσετε όλες τις πληροφορίες παραλαβής και αποβίβασης για να εξασφαλίσετε την ακρίβεια τους.
                Εάν υπάρχουν διαφορές από τις τελευταίες μας πληροφορίες, παρακαλούμε ενημερώστε μας
                άμεσα ώστε να μπορέσουμε να κάνουμε τις απαραίτητες ρυθμίσεις εγκαίρως.
            </font>
            <div>
                &nbsp;
            </div>
            <font size=11>
                2) Εάν δεν λάβουμε εναλλακτικά έγγραφα από εσάς,
                θα θεωρήσουμε τις παρεχόμενες πληροφορίες ως τις τελικές λεπτομέρειες για αυτή την ομάδα.
            </font>
            <div>
                &nbsp;
            </div>
            <font size=11>
                3) Σε περίπτωση που γίνουν αλλαγές στο τελικό πρόγραμμα, παρακαλούμε ενημερώστε μας άμεσα.
                Ενώ θα καταβάλουμε κάθε προσπάθεια για να επικοινωνήσουμε με την εταιρεία λεωφορείων,
                τυχόν χρεώσεις αλλαγής που μπορεί να προκύψουν λόγω των τελευταίων αλλαγών στο πρόγραμμα θα είναι υπό την ευθύνη σας.
            </font>
            <div>
                &nbsp;
            </div>
            <font size=11>
                4) Εάν προκύψουν προβλήματα με το λεωφορείο ή τον οδηγό, είναι απαραίτητο να επικοινωνήσει άμεσα ο υπεύθυνος εκδρομής μαζί μας, ανεξαρτήτως ώρας ή τοποθεσίας.
                Αυτό θα μας επιτρέψει να διερευνήσουμε την κατάσταση άμεσα και να αντιμετωπίσουμε τυχόν προβλήματα που μπορεί να προκύψουν.
                Δεν θα εξετάσουμε καταγγελίες σχετικά με το λεωφορείο ή τον οδηγό μετά την ολοκλήρωση της εκδρομής.
            </font>
            <div>
                &nbsp;
            </div>
            <font size=11>
                5) Ο υπεύθυνος εκδρομής είναι υπεύθυνος για την κάλυψη των εξόδων που αναφέρονται παρακάτω, εκτός αν συμφωνηθεί διαφορετικά μεταξύ της Cosmoplan και του Πελάτη: &nbsp;
            </font>
            <br/>
            <br/>
            <font size=11>
                &bull; Τυχόν τέλη στάθμευσης και άδεια πόλης&nbsp;
            </font>
            <font size=11>
                &bull; Τέλη Go-Box στην Αυστρία και Ελβετία (φόρος δρόμου)&nbsp;
            </font>
            <font size=11>
                &bull; Τυχόν τέλη τούνελ, τελών βουνού, τέλη φέρι, τέλη γεφυρών&nbsp;
            </font>
            <font size=11>
                &bull; Παρακαλούμε σημειώστε ότι όλα τα τέλη υπόκεινται σε οποιεσδήποτε επιπλέον επιλογές επιλέξετε.&nbsp;
            </font>
            <font size=11>
                &bull; Ιταλικά και Γαλλικά διόδια.&nbsp;
            </font>
            <font size=11>
                &bull; Γερμανικός φόρος δρόμου.&nbsp;
            </font>
        """

        # text = group.remarks_text

        # Replace HTML tags with line breaks
        text = text.replace("<div>", "\n").replace("</div>", "<br/>")
        text = text.replace("<p>", "\n").replace("</p>", "<br/>")

        # Remove HTML entities
        text = text.replace("&nbsp;", "<br/>")

        # Use the TTF font in your style
        styles_with_ttf = ParagraphStyle(
            'calibri',
            parent=styles["Left"],
            fontName='calibri'
        )

        parts.append(Paragraph(text, styles_with_ttf))

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
        filename = refcode + '_itinerary.pdf'
        temp = HttpResponse(pdf_contents, content_type='application/pdf')
        temp['Content-Disposition'] = 'attachment; filename=' + filename
        return temp


class UpdateGroupRoomtext(generics.ListCreateAPIView):
    """
    URL: update_group_roomtext/(?P<refcode>.*)$
    Descr: Updates rooming list from itinerary tab,
    in order to be sent to leader
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request, refcode):
        token_str = request.headers['User-Token']
        user = get_user(token_str)
        context = {"errormsg": ''}

        # Permission
        if not can_update(user.id, 'GT'):
            context = {"errormsg": "You do not have permission to update a Group's roomtext."}
            return Response(status=401, data=context)

        # Get room text
        roomtext = request.data['content']

        # Get Group
        group = GroupTransfer.objects.get(refcode=refcode)
        previous_roomtext = group.roomtext

        try:
            group.roomtext = roomtext
            group.save()
            History.objects.create(
                user=user,
                model_name='GT',
                action='UPD',
                description=f"User : {user.username} updated group's ({group.refcode}) roomtext from: {previous_roomtext} \
                    to {roomtext}"
            )

        except Exception as a:
            context['errormsg'] = a
            return Response(data=context, status=400)

        context['model'] = GroupSerializer(group).data
        return Response(data=context, status=200)


class UpdateGroupRemarks(generics.ListCreateAPIView):
    """
    URL: update_group_remarks/(?P<refcode>.*)$
    Descr: Updates remarks from itinerary tab,
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request, refcode):
        token_str = request.headers['User-Token']
        user = get_user(token_str)
        context = {"errormsg": ''}

        # Permission
        if not can_update(user.id, 'GT'):
            context = {"errormsg": "You do not have permission to update a Group's remarks."}
            return Response(status=401, data=context)

        # Get room text
        remarks_text = request.data['content']

        # Get Group
        group = GroupTransfer.objects.get(refcode=refcode)
        previous_remarks = group.remarks_text

        try:
            group.remarks_text = remarks_text
            group.save()
            History.objects.create(
                user=user,
                model_name='GT',
                action='UPD',
                description=f"User : {user.username} updated group's ({group.refcode}) remarks from: {previous_remarks} \
                    to {remarks_text}"
            )

        except Exception as a:
            context['errormsg'] = a
            return Response(data=context, status=400)

        context['model'] = GroupSerializer(group).data
        return Response(data=context, status=200)


class ToggleTravelDayAttraction(generics.UpdateAPIView):
    """
    url : toggle_travelday_attraction/$
    Descr: changes boolean value of attractions for Itinerary
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request):
        token_str = request.headers['User-Token']
        user = get_user(token_str)
        context = {"errormsg": ''}

        # Permission
        if not can_delete(user.id, 'GT'):
            context = {"errormsg": "You do not have permission to edit attractions of a travelday."}
            return Response(status=401, data=context)

        # Get travelday
        td_id = request.data['td_id']
        travelday = TravelDay.objects.get(id=td_id)

        # Get attraction
        attraction_id = request.data['attraction_id']
        attraction = Attraction.objects.get(id=attraction_id)

        try:
            ae = AttractionEntries.objects.get(attraction_id=attraction_id, travelday_id=td_id)
            ae.delete()
        except AttractionEntries.DoesNotExist:
            AttractionEntries.objects.create(attraction_id=attraction_id, travelday_id=td_id)

        travelday.save()

        group = GroupTransfer.objects.get(id=travelday.group_transfer_id)
        context['model'] = GroupSerializer(group).data
        History.objects.create(
            user=user,
            model_name='GT',
            action='UPD',
            description=f"User : {user.username} updated Travelday's attraction ({attraction.name}) \
                for group : {group.refcode} and date : {travelday.date}"
        )
        return Response(data=context, status=200)


class ChangeAttractionTime(generics.UpdateAPIView):
    """
    url : change_attraction_attraction/$
    Descr: changes boolean value of attractions for Itinerary
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request):
        token_str = request.headers['User-Token']
        user = get_user(token_str)
        context = {"errormsg": ''}

        # Permission
        if not can_delete(user.id, 'GT'):
            context = {"errormsg": "You do not have permission to edit attractions of a travelday."}
            return Response(status=401, data=context)

        # Get travelday
        td_id = request.data['travelday_id']
        travelday = TravelDay.objects.get(id=td_id)

        # Get attraction
        attraction_entry_id = request.data['attraction_entry_id']
        time = request.data['time']
        attraction_entry = AttractionEntries.objects.get(id=attraction_entry_id)

        # There is an unusual bug
        # Here we add 2 hours from the time picker of the front end.
        datetime_obj = datetime.datetime.fromisoformat(time[:-1])
        updated_datetime_obj = datetime_obj + datetime.timedelta(hours=2)
        attraction_entry.start_time = updated_datetime_obj.strftime("%H:%M")

        attraction_entry.save()
        travelday.save()

        group = GroupTransfer.objects.get(id=travelday.group_transfer_id)
        context['model'] = GroupSerializer(group).data
        History.objects.create(
            user=user,
            model_name='GT',
            action='UPD',
            description=f"User : {user.username} updated Travelday's attraction's time \
                for group : {group.refcode} and date : {travelday.date}"
        )
        return Response(data=context, status=200)


class AddAttractionToTravelday(generics.UpdateAPIView):
    """
    url : add_attraction_to_travelday/$
    Descr: Adds attraction to travelday from front end dropdown
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request):
        token_str = request.headers['User-Token']
        user = get_user(token_str)
        context = {"errormsg": ''}

        # Permission
        if not can_delete(user.id, 'GT'):
            context = {"errormsg": "You do not have permission to add attractions on a travelday."}
            return Response(status=401, data=context)

        # Get travelday
        td_id = request.data['travelday_id']
        travelday = TravelDay.objects.get(id=td_id)

        # Get attraction
        attraction_name = request.data['attraction_name'].split(" ( ")[0]
        attraction_id = Attraction.objects.get(name=attraction_name).id

        # if it already exists, return 400
        try:
            AttractionEntries.objects.get(attraction_id=attraction_id, travelday_id=td_id)
            context = {"errormsg": "This Attraction Already Exists for this Date."}
            return Response(data=context, status=400)

        except AttractionEntries.DoesNotExist:
            AttractionEntries.objects.create(attraction_id=attraction_id, travelday_id=td_id)

        group = GroupTransfer.objects.get(id=travelday.group_transfer_id)
        context['model'] = GroupSerializer(group).data
        History.objects.create(
            user=user,
            model_name='GT',
            action='UPD',
            description=f"User : {user.username} added attraction ( {attraction_name})  to Travelday \
                for group : {group.refcode} and date : {travelday.date}"
        )
        return Response(data=context, status=200)


class ChangeTraveldayComment(generics.UpdateAPIView):
    """
    url : change_travelday_comment/$
    Descr: Updates travelday's comment to be included on itinerary
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request):
        token_str = request.headers['User-Token']
        user = get_user(token_str)
        context = {"errormsg": ''}

        # Permission
        if not can_delete(user.id, 'GT'):
            context = {"errormsg": "You do not have permission to edit a travelday's comment."}
            return Response(status=401, data=context)

        # Get travelday
        td_id = request.data['travelday_id']
        travelday = TravelDay.objects.get(id=td_id)

        # Get comment
        comment = request.data['comment']

        travelday.comment = comment
        travelday.save()

        group = GroupTransfer.objects.get(id=travelday.group_transfer_id)
        context['model'] = GroupSerializer(group).data
        History.objects.create(
            user=user,
            model_name='GT',
            action='UPD',
            description=f"User : {user.username} updated Travelday's comment \
                for group : {group.refcode} and date : {travelday.date}"
        )
        return Response(data=context, status=200)


class DownloadItineraryUK(generics.ListAPIView):
    """
    URL: download_itinerary_uk/(?P<refcode>.*)$
    """

    @csrf_exempt
    def get(self, request, refcode):

        # Get Group
        group = GroupTransfer.objects.get(refcode=refcode)

        # File is also stored in file system on the same path
        pdftitle = os.path.join(BASE_DIR, 'static', 'itineraries' + "/" + refcode + '_itinerary_uk.pdf')

        parts = []

        # Document's styles
        styles = getSampleStyleSheet()
        styles.add(ParagraphStyle(name='Center', alignment=TA_CENTER))
        styles.add(ParagraphStyle(name='Left', alignment=TA_LEFT))
        styles.add(ParagraphStyle(name='Right', alignment=TA_RIGHT))

        logo = os.path.join(BASE_DIR, 'static', 'images', 'logos', 'cosmoplan_logo.jpg')
        im = Image(logo, 3.5 * inch, 1 * inch,  hAlign='LEFT')

        # Get Traveldays
        traveldays = TravelDay.objects.filter(group_transfer_id=group.id)

        drivers = set([Contact.objects.get(id=i.driver_id) for i in traveldays if i.driver_id is not None])

        # # # # # # # # # # # # # #
        # # # # 1) HEADER # # # # #
        # # # # # # # # # # # # # #
        init_table_data = [['', 'Cosmoplan International Travel LTD.', '', '', ''], ]
        init_table_data.append(['', '', '', '', ])
        init_table_data.append(['', 'Athens Office: ', 'London Office: ', '', ])
        init_table_data.append(['', '10 Xenofontos Street,', '105-109 Sumatra Road,', '', im])
        init_table_data.append(['', 'Syntagma, Athens, 10557', 'London, NW6 1PL', ''])
        init_table_data.append(['', 'Tel: +30 210 9219400', 'Tel: +44 2081436880', ''])
        init_table_data.append(['', 'https://cosmoplan.gr', 'https://cosmoplandmc.com', ''])

        table = Table(
            init_table_data,
            rowHeights=14,
            colWidths=[150, 140, 100, 70, 400],
            style=[
                ('FONT', (0, 0), (4, 0), 'calibri-bold', 18),       # Cosmoplan International Travel LTD. ( 1st row )
                ("VALIGN", (4, 3), (4, 3), "MIDDLE"),               # Logo Image
                ('FONT', (0, 2), (4, 2), 'calibri-bold', 14),       # "Athens Office: // London Office: "
                ('FONT', (0, 3), (4, 6), 'calibri', 10),    # Rest Of Table
                ('TEXTCOLOR', (0, 6), (4, 6), colors.blue),         # Links // cosmoplandmc.com // cosmoplan.gr
                ('FONT', (0, 6), (4, 6), 'calibri', 10),     # Links // cosmoplandmc.com // cosmoplan.gr
            ]
        )
        parts.append(table)
        parts.append(Spacer(3, 30))

        # # # # # # # # # # # # # #
        # # # 2) GROUP INFO  / OFFICE CONTACT # # # #
        # # # # # # # # # # # # # #
        init_table_data = [
            ['Group Information', '', 'Office Contact', ''],
            ['Refcode : ', refcode, 'Tel : ', '+44 20 81436880'],
            ['PAX : ', group.number_of_people, 'E-mail : ', 'info@cosmoplandmc.com'],
            ['Room Description : ', group.room_desc, 'Emergency : ', 'Themis P. : +44 7833122005'],
            ['Incoming Service : ', 'Cosmoplan International Travel.', '',],
        ]

        table = Table(
            init_table_data,
            hAlign='LEFT',
            style=[
                # Generic
                ('TEXTCOLOR', (1, -1), (-1, -1), colors.black),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ('FONT', (0, 0), (-1, -1), 'calibri', 10),
                ('TEXTCOLOR', (0, 0), (4, 0), colors.black),

                # 1st row styling:
                ('FONT', (0, 0), (-1, 0), 'calibri-bold', 14),
                ('SPAN', (0, 0), (1, 0)),  # Merge and center the first two cells
                ('SPAN', (2, 0), (3, 0)),  # Merge and center the next two cells

                # Emergency
                ('FONT', (2, -1), (3, -1),  'calibri', 10),  # Background color for the bottom right cell
                ('TEXTCOLOR', (2, -1), (3, -1), colors.red),
                ('FONT', (2, -2), (3, -2), 'calibri', 10),  # Background color for the cell above the bottom right
                ('TEXTCOLOR', (2, -2), (3, -2), colors.red),
                ('FONT', (2, -3), (3, -3), 'calibri', 10),  # Background color for the cell two rows above the bottom right
                ('TEXTCOLOR', (2, -3), (3, -3), colors.red),
            ]
        )
        parts.append(table)
        parts.append(Spacer(3, 30))

        # # # # # # # # # # # # # # # # # # # #
        # # # # 3) ARRIVAL / DEPARTURE  # # # #
        # # # # # # # # # # # # # # # # # # # #
        init_table_data = [['Arrival Info', '', 'Departure Info', ''], ]

        arrival_date_label = 'Date : '
        arrival_date = group.arrival.split(' - ')[0][4:]
        departure_date_label = 'Date : '
        departure_date = group.departure.split(' - ')[0][4:]

        if group.arrival_type == 'AIR':
            a_first_label = 'Airport : '
            a_first_key = group.arrival.split(' - ')[2]
            a_second_label = 'Flight : '
            a_second_key = group.arrival.split(' - ')[1]
            a_third_label = 'Terminal : '
            a_third_key = group.arrival.split(' - ')[-1]
        elif group.arrival_type == 'SEA':
            a_first_label = 'Port : '
            a_first_key = group.arrival.split(' - ')[1] + ' - ' + group.arrival.split(' - ')[2].split(",")[0]
            a_second_label = 'Agency : '
            a_second_key = group.arrival.split(',')[1]
            a_third_label = 'Ship Name : '
            a_third_key = group.arrival.split(',')[2]
        elif group.arrival_type == 'TRN':
            a_first_label = 'Railway Station : '
            a_first_key = group.arrival.split(' - ')[1] + ' - ' + group.arrival.split(' - ')[2].split(",")[0]
            a_second_label = 'Agency : '
            a_second_key = group.arrival.split(',')[1]
            a_third_label = 'Route : '
            a_third_key = group.arrival.split(',')[2]
        else:
            a_first_label = ''
            a_first_key = ''
            a_second_label = ''
            a_second_key = ''
            a_third_label = ''
            a_third_key = ''

        if group.departure_type == 'AIR':
            d_first_label = 'Airport : '
            d_first_key = group.departure.split(' - ')[2]
            d_second_label = 'Flight : '
            d_second_key = group.departure.split(' - ')[1]
            d_third_label = 'Terminal : '
            d_third_key = group.departure.split(' - ')[-1]
        elif group.departure_type == 'SEA':
            d_first_label = 'Port : '
            d_first_key = group.departure.split(' - ')[1] + ' - ' + group.departure.split(' - ')[2].split(",")[0]
            d_second_label = 'Agency : '
            d_second_key = group.departure.split(',')[1]
            d_third_label = 'Ship Name : '
            d_third_key = group.departure.split(',')[2]
        elif group.departure_type == 'TRN':
            d_first_label = 'Railway Station : '
            d_first_key = group.departure.split(' - ')[1] + ' - ' + group.departure.split(' - ')[2].split(",")[0]
            d_second_label = 'Agency : '
            d_second_key = group.departure.split(',')[1]
            d_third_label = 'Route : '
            d_third_key = group.departure.split(',')[2]
        else:
            d_first_label = ''
            d_first_key = ''
            d_second_label = ''
            d_second_key = ''
            d_third_label = ''
            d_third_key = ''

        try:
            init_table_data.append([arrival_date_label, arrival_date, departure_date_label, departure_date])
            init_table_data.append([a_first_label, a_first_key, d_first_label, d_first_key,])
            init_table_data.append([a_second_label, a_second_key, d_second_label, d_second_key,])
            init_table_data.append([a_third_label, a_third_key, d_third_label, d_third_key,])
            table = Table(
                init_table_data,
                rowHeights=14,
                colWidths=[80, 200, 80, 200],
                hAlign='LEFT',
                style=[
                    ('TEXTCOLOR', (1, -1), (-1, -1), colors.black),
                    ('FONT', (0, 0), (-1, -1), 'calibri', 10),
                    ('TEXTCOLOR', (0, 0), (4, 0), colors.black),
                    ('FONT', (0, 0), (4, 0), 'calibri-bold', 14),
                ]
            )
            parts.append(table)
            parts.append(Spacer(3, 30))
        except IndexError:
            pass

        # # # # # # # # # # # # # # # # # # #
        # # # 4) COACH AND DRIVER INFO  # # #
        # # # # # # # # # # # # # # # # # # #
        traveldays = TravelDay.objects.filter(group_transfer_id=group.id)
        coach_info_data = []
        period_dict = []

        # Add periods for each driver
        if traveldays.count() > 0:
            prev_driver = traveldays[0].driver
            prev_coach = traveldays[0].coach
            period_dict.append({
                'driver': prev_driver,
                'coach': prev_coach,
                'starting_period': traveldays[0].date,
                'ending_period': traveldays[0].date
            })

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

            for period in period_dict:
                period_start = datetime.datetime.strftime(period['starting_period'], '%d/%m/%Y')
                period_end = datetime.datetime.strftime(period['ending_period'], '%d/%m/%Y')
                period_str = f"{period_start} - {period_end}"
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

                coach_info_data.append({
                    'period': period_str,
                    'driver': driver.name if driver else 'N/A',
                    'driver_id': driver.id if driver else 'N/A',
                    'coach_operator': coach_operator,
                    'coach_operator_id': coach_operator_id,
                    'coach_make': coach_make,
                    'coach_plate_num': coach_plate_num,
                    'coach_seats': coach_seats,
                })

        init_table_data = [
            ['Coach Info',],
            ['Number Plate', 'Make', 'Seats', 'Period'],
        ]

        for row in coach_info_data:
            init_table_data.append([
                row['coach_plate_num'],
                row['coach_make'],
                row['coach_seats'],
                row['period'],
            ])

        table = Table(
            init_table_data,
            hAlign='LEFT',
            style=[
                ('TEXTCOLOR', (1, -1), (-1, -1), colors.black),
                ('FONT', (0, 0), (-1, -1), 'calibri', 10),
                ('TEXTCOLOR', (0, 0), (4, 0), colors.black),
                ('FONT', (0, 0), (4, 0), 'calibri-bold', 12),
            ]
        )
        parts.append(table)
        parts.append(Spacer(3, 30))

        # # # # # # # # # # # # # # # # # # #
        # # # 5) DRIVER CONTACT INFO  # # # #
        # # # # # # # # # # # # # # # # # # #
        init_table_data = [
            ['Driver Info',],
            ['Driver name', 'Tel', 'Tel 2', 'Tel 3'],
        ]

        for driver in drivers:
            if driver != 'N/A':
                init_table_data.append([
                    driver.name if driver.name else 'N/A',
                    driver.tel if driver.tel else 'N/A',
                    driver.tel2 if driver.tel2 else 'N/A',
                    driver.tel3 if driver.tel3 else 'N/A',
                ])

        if len(init_table_data) > 1:
            # Second Table
            table = Table(
                init_table_data,
                hAlign='LEFT',
                style=[
                    ('TEXTCOLOR', (1, -1), (-1, -1), colors.black),
                    ('FONT', (0, 0), (-1, -1), 'calibri', 10),
                    ('TEXTCOLOR', (0, 0), (4, 0), colors.black),
                    ('FONT', (0, 0), (4, 0), 'calibri-bold', 12),
                ]
            )
            parts.append(table)
            parts.append(Spacer(3, 30))

        # # # # # # # # # # # # # # # # # # #
        # # # 6) LEADER CONTACT INFO  # # # #
        # # # # # # # # # # # # # # # # # # #
        leader_info_data = []
        period_dict = []

        all_leaders = list(filter(lambda x: x is not None, [i.leader for i in traveldays if i is not None]))

        if len(all_leaders) > 0:
            # Add periods for each driver
            if traveldays.count() > 0:
                prev_leader = traveldays[0].leader
                prev_coach = traveldays[0].coach
                period_dict.append({
                    'leader': prev_leader,
                    'starting_period': traveldays[0].date,
                    'ending_period': traveldays[0].date
                })

                for travelday in traveldays[1:]:
                    leader = travelday.leader
                    if leader != prev_leader:
                        period_dict.append({
                            'leader': leader,
                            'starting_period': travelday.date,
                            'ending_period': travelday.date
                        })
                    else:
                        period_dict[-1]['ending_period'] = travelday.date
                    prev_leader = leader

                for period in period_dict:
                    period_start = datetime.datetime.strftime(period['starting_period'], '%d/%m/%Y')
                    period_end = datetime.datetime.strftime(period['ending_period'], '%d/%m/%Y')
                    period_str = f"{period_start} - {period_end}"
                    leader = period['leader'].name if period['leader'] else 'N/A'

                    leader = period['leader'] if period['leader'] else None

                    leader_info_data.append({
                        'period': period_str,
                        'leader': leader.name if leader else 'N/A',
                        'leader_id': leader.id if leader else 'N/A',
                        'Tel': leader.tel if leader else 'N/A',
                        'Tel2': leader.tel2 if leader else 'N/A',
                        'Tel3': leader.tel3 if leader else 'N/A',
                        'email': leader.email if leader else 'N/A',
                    })

            # 1st table
            init_table_data = [
                ['Leader Info',],
                ['Leader name', 'Tel', 'Tel2', 'Tel3', 'E-mail', 'Period'],
            ]

            for row in leader_info_data:
                if row['leader'] != 'N/A':
                    init_table_data.append([
                        row['leader'] if row['leader'] is not None else "N/A",
                        row['Tel'] if row['Tel'] is not None else "N/A",
                        row['Tel2'] if row['Tel2'] is not None else "N/A",
                        row['Tel3'] if row['Tel3'] is not None else "N/A",
                        row['email'] if row['email'] is not None else "N/A",
                        row['period'] if row['period'] is not None else "N/A",
                    ])

            # Fourth table
            table = Table(
                init_table_data,
                hAlign='LEFT',
                style=[
                    ('TEXTCOLOR', (1, -1), (-1, -1), colors.black),
                    ('FONT', (0, 0), (-1, -1), 'calibri', 10),
                    ('TEXTCOLOR', (0, 0), (4, 0), colors.black),
                    ('FONT', (0, 0), (4, 0), 'calibri-bold', 12),
                ]
            )
            parts.append(table)

        # # # # # # # # # # # # # #
        # # # 7) HOTEL LIST # # # #
        # # # # # # # # # # # # # #
        parts.append(PageBreak())
        parts.append(Paragraph('<font size=14><b>Hotel List</b></font>',  styles["Left"]))
        parts.append(Spacer(1, 10))

        # Table headers
        init_table_data = [['Day', 'Date', 'City - Country', 'Hotel'], ]

        row_index = 0

        init_table_style = [
            ('TEXTCOLOR', (1, -1), (-1, -1), colors.black),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ('FONT', (0, 0), (-1, -1), 'calibri', 10),
            ('TEXTCOLOR', (0, 0), (4, 0), colors.black),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.black),
        ]

        # Table's data
        for i, day in enumerate(traveldays):
            hotel = day.hotel.name if day.hotel else "N/A"
            region = 'N/A'
            if hotel != "N/A":
                region = day.hotel.region.split(" >>> ", 1)[-1] if day.hotel.region else 'N/A'
                try:
                    hotel += " " + str(day.hotel.rating // 10) + "*"
                except Exception as a:
                    print(a)
            init_table_data.append([str(i+1), day.date.strftime("%d-%b-%Y"), region, hotel])
            row_index += 1
            if hotel != "N/A":
                init_table_data.append(['', '', '', 'Address : ' + "\n".join(wrap(day.hotel.contact.address, 30))])
                init_table_data.append(['', '', '', f'Tel: {day.hotel.contact.tel}'])
                init_table_style.append(('SPAN', (0, row_index), (0, row_index+2)),)
                init_table_style.append(('SPAN', (1, row_index), (1, row_index+2)),)
                init_table_style.append(('SPAN', (2, row_index), (2, row_index+2)),)
                row_index += 2

        table = Table(
            init_table_data,
            hAlign='LEFT',
            style=init_table_style
        )

        parts.append(table)
        parts.append(Spacer(5, 50))

        # # # # # # # # # # # # # #
        # # # 11) ITINERARY # # # #
        # # # # # # # # # # # # # #
        # parts.append(PageBreak())
        # parts.append(Paragraph('<font size=14><b>Itinerary</b></font>',  styles["Left"]))
        # parts.append(Spacer(1, 10))

        # for i, travelday in enumerate(traveldays):
        #     parts.append(Paragraph(f'<font size=12>{i+1}) {travelday.date}</font>',  styles["Left"]))
        #     parts.append(Spacer(1, 10))
        #     init_table_data = [
        #     ]

        #     attraction_entries = AttractionEntries.objects.filter(travelday_id=travelday.id)
        #     att_span_style = ('TEXTCOLOR', (1, -1), (-1, -1), colors.black)

        #     if attraction_entries.count() > 0:
        #         for attraction in attraction_entries.order_by('start_time'):
        #             time = attraction.start_time if attraction.start_time != "00:00" else ""
        #             init_table_data.append(
        #                 ['Attractions', attraction.attraction.name, time]
        #             )
        #         att_span_style = ('SPAN', (0, 1), (0, attraction_entries.count()))

        #     # service_entries = Service.objects.filter(travelday_id=travelday.id)
        #     serv_span_style = ('TEXTCOLOR', (1, -1), (-1, -1), colors.black)

        #     # if service_entries.count() > 0:
        #     #     for service in service_entries.order_by('start_time'):
        #     #         time = service.start_time if service.start_time != "00:00" else ""
        #     #         init_table_data.append(['Services', SERVICE_TYPES_REV[service.service_type], time, "\n".join(wrap(service.description, 30))])

        #     #         if service.restaurant_id:
        #     #             restaurant = Restaurant.objects.get(id=service.restaurant_id)
        #     #             init_table_data.append(['', 'Name: ', restaurant.name])
        #     #             init_table_data.append(['', 'Address: ', "\n".join(wrap(restaurant.contact.address, 30))])
        #     #             init_table_data.append(['', 'Tel: ', restaurant.contact.tel])

        #     #         elif service.hotel_id:
        #     #             hotel = Hotel.objects.get(id=service.hotel_id)
        #     #             init_table_data.append(['', 'Name: ', hotel.name])
        #     #             init_table_data.append(['', 'Address: ', "\n".join(wrap(hotel.contact.address, 30))])
        #     #             init_table_data.append(['', 'Tel: ', hotel.contact.tel])

        #     #         elif service.airline_id:
        #     #             airline = Airline.objects.get(id=service.airline_id)
        #     #             init_table_data.append(['', 'Name: ', airline.name])
        #     #             init_table_data.append(['', 'Address: ', "\n".join(wrap(airline.contact.address, 30))])
        #     #             init_table_data.append(['', 'Tel: ', airline.contact.tel])

        #     #         elif service.dmc_id:
        #     #             dmc = DMC.objects.get(id=service.dmc_id)
        #     #             init_table_data.append(['', 'Name: ', dmc.name])
        #     #             init_table_data.append(['', 'Address: ', "\n".join(wrap(dmc.contact.address, 30))])
        #     #             init_table_data.append(['', 'Tel: ', dmc.contact.tel])

        #     #         elif service.ferry_ticket_agency_id:
        #     #             ferry_ticket_agency = FerryTicketAgency.objects.get(id=service.ferry_ticket_agency_id)
        #     #             init_table_data.append(['', 'Name: ', ferry_ticket_agency.name])
        #     #             init_table_data.append(['', 'Address: ', "\n".join(wrap(ferry_ticket_agency.contact.address, 30))])
        #     #             init_table_data.append(['', 'Tel: ', ferry_ticket_agency.contact.tel])

        #     #         elif service.cruising_company_id:
        #     #             cruising_company = CruisingCompany.objects.get(id=service.cruising_company_id)
        #     #             init_table_data.append(['', 'Name: ', cruising_company.name])
        #     #             init_table_data.append(['', 'Address: ', "\n".join(wrap(cruising_company.contact.address, 30))])
        #     #             init_table_data.append(['', 'Tel: ', cruising_company.contact.tel])

        #     #         elif service.guide_id:
        #     #             guide = Guide.objects.get(id=service.guide_id)
        #     #             init_table_data.append(['', 'Name: ', guide.name])
        #     #             init_table_data.append(['', 'Address: ', "\n".join(wrap(guide.contact.address, 30))])
        #     #             init_table_data.append(['', 'Tel: ', guide.contact.tel])

        #     #         elif service.sport_event_supplier_id:
        #     #             sport_event_supplier = SportEventSupplier.objects.get(id=service.sport_event_supplier_id)
        #     #             init_table_data.append(['', 'Name: ', sport_event_supplier.name])
        #     #             init_table_data.append(['', 'Address: ', "\n".join(wrap(sport_event_supplier.contact.address, 30))])
        #     #             init_table_data.append(['', 'Tel: ', sport_event_supplier.contact.tel])

        #     #         elif service.teleferik_company_id:
        #     #             teleferik_company = TeleferikCompany.objects.get(id=service.teleferik_company_id)
        #     #             init_table_data.append(['', 'Name: ', teleferik_company.name])
        #     #             init_table_data.append(['', 'Address: ', "\n".join(wrap(teleferik_company.contact.address, 30))])
        #     #             init_table_data.append(['', 'Tel: ', teleferik_company.contact.tel])

        #     #         elif service.theater_id:
        #     #             theater = Theater.objects.get(id=service.restaurant_id)
        #     #             init_table_data.append(['', 'Name: ', theater.name])
        #     #             init_table_data.append(['', 'Address: ', "\n".join(wrap(theater.contact.address, 30))])
        #     #             init_table_data.append(['', 'Tel: ', theater.contact.tel])

        #     #         elif service.train_ticket_agency_id:
        #     #             train_ticket_agency = TrainTicketAgency.objects.get(id=service.train_ticket_agency_id)
        #     #             init_table_data.append(['', 'Name: ', train_ticket_agency.name])
        #     #             init_table_data.append(['', 'Address: ', "\n".join(wrap(train_ticket_agency.contact.address, 30))])
        #     #             init_table_data.append(['', 'Tel: ', train_ticket_agency.contact.tel])

        #     #     serv_span_style = ('SPAN', (0, attraction_entries.count() + 1), (0, attraction_entries.count() + service_entries.count()))

        #     # table = Table(
        #     #     init_table_data,
        #     #     hAlign='LEFT',
        #     #     style=[
        #     #         ('TEXTCOLOR', (1, -1), (-1, -1), colors.black),
        #     #         ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        #     #         ('FONT', (0, 0), (-1, -1), 'calibri', 10),
        #     #         ('TEXTCOLOR', (0, 0), (4, 0), colors.black),
        #     #         att_span_style,
        #     #         serv_span_style,
        #     #     ]
        #     # )
        #     # parts.append(table)
        #     # if travelday.comment is not None:
        #     #     parts.append(Paragraph(f'<font size=10>{travelday.comment}</font>',  styles["Left"]))
        #     # parts.append(Spacer(2, 20))

        parts.append(PageBreak())
        parts.append(Paragraph('<font size=18><b>Remarks</b></font>',  styles["Left"]))
        parts.append(Spacer(2, 20))
        text = """
            <font size=11>
                1) The coach company in the case of a breakdown is responsible for ensuring the uninterrupted continuation of the tour or arranging for
                a suitable substitute coach within a maximum of 4 hours, regardless of any unforeseen circumstances that may occur during the tour.
            </font>
            <div>
                &nbsp;
            </div>
            <font size=11>
                2) Any optionals are based on the agreements made between the driver, tour leader,
                and coach operator. The company will not intervene in this matter under any circumstances.
            </font>
            <div>
                &nbsp;
            </div>
            <br/>
            <font size=14>
                <b>
                    Attention by Tour Operators, Travel Agents, Unions and Schools
                </b>
            </font>
            <div>
                &nbsp;
            </div>
            <font size=11>
                1) Kindly verify all pickup and drop-off information to ensure its accuracy.
                If there are any discrepancies from our latest information,
                please notify us promptly so that we can make necessary arrangements in a timely manner.
            </font>
            <div>
                &nbsp;
            </div>
            <font size=11>
                2) If we do not receive any alternative documentation from you, we will consider
                the information provided as the final details for this group.
            </font>
            <div>
                &nbsp;
            </div>
            <font size=11>
                3) Should any changes be made to the final itinerary, please inform us immediately.
                While we will make every effort to communicate with the coach company,
                any change fees incurred due to your last-minute itinerary adjustments will be your responsibility.
            </font>
            <div>
                &nbsp;
            </div>
            <font size=11>
                4) If any issues arise with the coach or the driver, it is imperative that the tour leader contacts us immediately,
                regardless of the time or location. This will allow us to investigate the situation promptly and address any problems that may arise.
                We will not entertain any complaints regarding the coach or the driver once the tour has been completed.
            </font>
            <div>
                &nbsp;
            </div>
            <font size=11>
                5) The tour leader is required to cover the following expenses, unless otherwise agreed between Cosmoplan and the Client: &nbsp;
            </font>
            <br/>
            <font size=11>
                &bull; Any parking fees and city permit&nbsp;
            </font>
            <font size=11>
                &bull; Go-Box fee in Austria and Switzerland road tax&nbsp;
            </font>
            <font size=11>
                &bull; Any tunnel fee, mountain pass fee, ferry fee and bridge fee&nbsp;
            </font>
            <font size=11>
                &bull; Please note that all fees are subject to any additional options chosen.&nbsp;
            </font>
            <font size=11>
                &bull; Italian and French tolls.&nbsp;
            </font>
            <font size=11>
                &bull; Germany road tax.&nbsp;
            </font>

            <div>
                <br/><br/><br/><br/><br/>
            </div>

            <font size=18><b>Παρατηρήσεις&nbsp;</b></font>
            <br/>

            <font size=11>
                1) Η εταιρεία λεωφορείων σε περίπτωση βλάβης είναι υπεύθυνη για τη διασφάλιση της
                αδιάκοπης συνέχισης της εκδρομής ή για την κανονισμένη αντικατάσταση του λεωφορείου εντός μέγιστου χρονικού διαστήματος 4 ωρών,
                ανεξάρτητα από τυχόν απρόβλεπτες περιστάσεις που μπορεί να προκύψουν κατά τη διάρκεια της εκδρομής.
            </font>
            <div>
                &nbsp;
            </div>
            <font size=11>
                2) Οποιαδήποτε προαιρετικά βασίζονται στις συμφωνίες που έχουν γίνει μεταξύ του οδηγού, του υπεύθυνου εκδρομής και του φορέα λεωφορείου.
                Η εταιρεία δεν θα παρέμβει σε αυτό το θέμα υπό οποιεσδήποτε συνθήκες.
            </font>
            <p>
                &nbsp;
            </p>
            <font size=14>
                <b>
                    Προσοχή από τους Φορείς Οργάνωσης Εκδρομών, Ταξιδιωτικά Γραφεία, Σωματεία και Σχολεία
                </b>
            </font>

            <div>
                &nbsp;
            </div>
            <font size=11>
                1) Παρακαλούμε να επαληθεύσετε όλες τις πληροφορίες παραλαβής και αποβίβασης για να εξασφαλίσετε την ακρίβεια τους.
                Εάν υπάρχουν διαφορές από τις τελευταίες μας πληροφορίες, παρακαλούμε ενημερώστε μας άμεσα ώστε να μπορέσουμε να κάνουμε τις απαραίτητες ρυθμίσεις εγκαίρως.
            </font>
            <div>
                &nbsp;
            </div>
            <font size=11>
                2) Εάν δεν λάβουμε εναλλακτικά έγγραφα από εσάς, θα θεωρήσουμε τις παρεχόμενες πληροφορίες ως τις τελικές λεπτομέρειες για αυτή την ομάδα.
            </font>
            <div>
                &nbsp;
            </div>
            <font size=11>
                3) Σε περίπτωση που γίνουν αλλαγές στο τελικό πρόγραμμα, παρακαλούμε ενημερώστε μας άμεσα. Ενώ θα καταβάλουμε κάθε προσπάθεια για να επικοινωνήσουμε με την εταιρεία λεωφορείων,
                τυχόν χρεώσεις αλλαγής που μπορεί να προκύψουν λόγω των τελευταίων αλλαγών στο πρόγραμμα θα είναι υπό την ευθύνη σας.
            </font>
            <div>
                &nbsp;
            </div>
            <font size=11>
                4) Εάν προκύψουν προβλήματα με το λεωφορείο ή τον οδηγό, είναι απαραίτητο να επικοινωνήσει άμεσα ο υπεύθυνος εκδρομής μαζί μας, ανεξαρτήτως ώρας ή τοποθεσίας.
                Αυτό θα μας επιτρέψει να διερευνήσουμε την κατάσταση άμεσα και να αντιμετωπίσουμε τυχόν προβλήματα που μπορεί να προκύψουν.
                Δεν θα εξετάσουμε καταγγελίες σχετικά με το λεωφορείο ή τον οδηγό μετά την ολοκλήρωση της εκδρομής.
            </font>
            <div>
                &nbsp;
            </div>
            <font size=11>
                5) Ο υπεύθυνος εκδρομής είναι υπεύθυνος για την κάλυψη των εξόδων που αναφέρονται παρακάτω, εκτός αν συμφωνηθεί διαφορετικά μεταξύ της Cosmoplan και του Πελάτη: &nbsp;
            </font>
            <br/>
            <br/>
            <font size=11>
                &bull; Τυχόν τέλη στάθμευσης και άδεια πόλης&nbsp;
            </font>
            <font size=11>
                &bull; Τέλη Go-Box στην Αυστρία και Ελβετία (φόρος δρόμου)&nbsp;
            </font>
            <font size=11>
                &bull; Τυχόν τέλη τούνελ, τελών βουνού, τέλη φέρι, τέλη γεφυρών&nbsp;
            </font>
            <font size=11>
                &bull; Παρακαλούμε σημειώστε ότι όλα τα τέλη υπόκεινται σε οποιεσδήποτε επιπλέον επιλογές επιλέξετε.&nbsp;
            </font>
            <font size=11>
                &bull; Ιταλικά και Γαλλικά διόδια.&nbsp;
            </font>
            <font size=11>
                &bull; Γερμανικός φόρος δρόμου.&nbsp;
            </font>
        """
        # text = group.remarks_text

        # Replace HTML tags with line breaks
        text = text.replace("<div>", "\n").replace("</div>", "<br/>")
        text = text.replace("<p>", "\n").replace("</p>", "<br/>")

        # Remove HTML entities
        text = text.replace("&nbsp;", "<br/>")

        # Use the TTF font in your style
        styles_with_ttf = ParagraphStyle(
            'calibri',
            parent=styles["Left"],
            fontName='calibri'
        )

        parts.append(Paragraph(text, styles_with_ttf))

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
        filename = refcode + '_itinerary_uk.pdf'
        temp = HttpResponse(pdf_contents, content_type='application/pdf')
        temp['Content-Disposition'] = 'attachment; filename=' + filename
        return temp
