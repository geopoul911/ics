from webapp.models import (
    GroupTransfer,
    History,
    Contact,
    TravelDay,
    Coach,
    Hotel,
    Agent,
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
    Contract,
    AttractionEntries,
    Room,
    DocRoomingList,
    Payment,
)
import re

from rest_framework import generics
from django.views.decorators.csrf import csrf_exempt
from pathlib import Path
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
import datetime
from django.db.models import ProtectedError
from webapp.serializers import (
    GroupSerializer,
)
from accounts.permissions import (
    can_create,
    can_update,
    can_delete,
)


from webapp.xhr import update_notifications

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

allowed_extensions = [
    'pdf',
    'xlsx',
    'xlsm',
    'xls',
    'docx',
    'doc',
    'tif',
    'tiff',
    'bmp',
    'jpg',
    'jpeg',
    'png',
    'csv',
    'dot',
    'dotx',
    'mp3',
    'mp4',
    'pptx',
    'zip',
    'rar',
    'txt',
    'wav',
    'flv'
]

allowed_extensions_images = [
    'jpeg', 'jpg', 'png', 'tiff', 'tif',
    'JPEG', 'JPG', 'PNG', 'TIFF', 'TIF',
]

allowed_extension_documents = [
    'pdf', 'docx', 'doc', 'tif', 'tiff', 'bmp', 'jpg', 'jpeg', 'png', 'zip', 'rar',
    'PDF', 'DOCX', 'DOC', 'TIF', 'TIFF', 'BMP', 'JPG', 'JPEG', 'PNG', 'ZIP', 'RAR',
]

BASE_DIR = Path(__file__).resolve().parent.parent.parent


def days_are_consecutive(days):
    # Sort the days to ensure they are in chronological order
    sorted_days = sorted(days)

    # Check if each day is exactly one day after the previous day
    for i in range(1, len(sorted_days)):
        if sorted_days[i] - sorted_days[i-1] != datetime.timedelta(days=1):
            return False
    return True


def update_roominglists(group_transfer):

    """Updates the rooming lists.
    Usually called when hotels change.
    """
    # get the unique hotels for this group
    hotels = []
    hotel_nights = []
    transel_agent = Agent.objects.get(name="TRANSEL LTD")
    for h in group_transfer.group_travelday.values('hotel'):
        hotel_id = h['hotel']
        if hotel_id:
            hotel = Hotel.objects.get(id=hotel_id)
            if hotel not in hotels:
                hotels.append(hotel)

    for hotel in hotels:
        hotel_days = [day for day in group_transfer.group_travelday.all() if day.hotel == hotel]
        temp = "%d Night: " % len(hotel_days)
        temp += "%s" % datetime.date.strftime(hotel_days[0].date, '%d %b %Y')

        if len(hotel_days) > 1:
            if days_are_consecutive([td.date for td in hotel_days]):
                temp += " to %s" % datetime.date.strftime(hotel_days[-1].date + datetime.timedelta(days=1), '%d %b %Y')
            else:
                dates = [datetime.date.strftime(day.date, '%d %b %Y') for day in hotel_days]
                temp = "Nights:\n" + "\n".join(f"- {date}" for date in dates)

        hotel_nights.append(temp)

    for i, hotel in enumerate(hotels):
        try:
            rooming_list = DocRoomingList.objects.get(group_transfer=group_transfer, hotel=hotel)
            rooming_list.doc_Date = TravelDay.objects.filter(hotel=hotel, group_transfer=group_transfer).order_by('date')[0].date
            rooming_list.doc_nights = hotel_nights[i]
            rooming_list.save()
        except DocRoomingList.DoesNotExist:
            rooming_list = DocRoomingList()
            rooming_list.group_transfer = group_transfer
            rooming_list.hotel = hotel
            rooming_list.doc_From = transel_agent.contact
            rooming_list.doc_Date = TravelDay.objects.filter(hotel=hotel, group_transfer=group_transfer).order_by('date')[0].date
            rooming_list.doc_Attn = hotel.contact
            rooming_list.doc_Ref = hotel.contact
            rooming_list.doc_To = hotel.contact

            if group_transfer.roomtext:
                rooming_list.roomtext = group_transfer.roomtext
            else:
                rooming_list.roomtext = ''

            rooming_list.doc_nights = hotel_nights[i]
            rooming_list.save()
    for rl in DocRoomingList.objects.filter(group_transfer=group_transfer):
        if rl.hotel not in hotels:
            rl.delete()


def get_dates_in_range(date_range_str):
    # Split the input string into start and end date parts
    start_date_str, end_date_str = date_range_str.split(" - ")

    # Convert the date strings to datetime objects
    start_date = datetime.datetime.strptime(start_date_str, "%d-%m-%Y")
    end_date = datetime.datetime.strptime(end_date_str, "%d-%m-%Y")

    # Initialize an empty list to store the dates
    date_list = []

    # Generate dates and add them to the list
    current_date = start_date
    while current_date <= end_date:
        date_list.append(current_date.strftime("%Y-%m-%d"))
        current_date += datetime.timedelta(days=1)

    return date_list


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


# Get user from token
def get_user(token):
    return Token.objects.get(key=token).user


"""
    # Schedule

    re_path(r'add_new_travelday/(?P<refcode>.*)$', xhr_groups.AddNewTravelday.as_view()),
    re_path(r'delete_travelday/(?P<refcode>.*)$', xhr_groups.DeleteTravelday.as_view()),
    re_path(r'change_group_leader/$', xhr_groups.ChangeGroupLeader.as_view()),
    re_path(r'change_travelday_date/$', xhr_groups.ChangeTraveldayDate.as_view()),
    re_path(r'check_for_date_conflict/(?P<refcode>.*)$', xhr_groups.CheckForDateConflict.as_view()),
    re_path(r'change_hotel/(?P<refcode>.*)$', xhr_groups.ChangeHotel.as_view()),
    re_path(r'change_driver/(?P<refcode>.*)$', xhr_groups.ChangeDriver.as_view()),
    re_path(r'check_for_driver_conflict/(?P<refcode>.*)$', xhr_groups.CheckForDriverConflict.as_view()),
    re_path(r'change_coach/(?P<refcode>.*)$', xhr_groups.ChangeCoach.as_view()),
    re_path(r'check_for_coach_conflict/(?P<refcode>.*)$', xhr_groups.CheckForCoachConflict.as_view()),
    re_path(r'download_hotel_list/$', schedule.DownloadHotelList.as_view()),

"""


class AddNewTravelday(generics.UpdateAPIView):
    """
    URL : add_new_travelday/(?P<refcode>.*)$
    Descr: If group does not contain travelday, takes input from user
    else, it adds a day to the last day of the group
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request, refcode):
        context = {"errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_create(user.id, 'GT'):
            context = {"errormsg": "You do not have permission to create a Group's travel day."}
            return Response(status=401, data=context)

        group = GroupTransfer.objects.get(refcode=refcode)

        # Fetching selected date from front end , if exists
        try:
            start_date = datetime.datetime.strptime(request.data['start_date'], '%d-%m-%Y')
            end_date = datetime.datetime.strptime(request.data['end_date'], '%d-%m-%Y')
        except KeyError:
            start_date, end_date = '', ''

        # If group contains at least one day, selected date is ''
        if start_date == '' or end_date == '':
            # if start/end date is '', add one calendar day to the latest date travelday
            days = TravelDay.objects.filter(group_transfer_id=group.id)
            max_date = days.latest('date').date
            selected_date = max_date + datetime.timedelta(days=1)
            try:
                newDay = TravelDay.objects.create(date=selected_date, group_transfer_id=group.id)
                History.objects.create(
                    user=user,
                    model_name='GT',
                    action='CRE',
                    description=f"User : {user.username} added new travelday to group: \
                        {group.refcode} with date of : {selected_date}"
                )
                newDay.save()
                context['model'] = GroupSerializer(group).data
                return Response(data=context, status=200)
            except Exception as a:
                # In case anything occurs, return 400
                context['errormsg'] = a
                return Response(data=context, status=400)

        delta = datetime.timedelta(days=1)
        while start_date <= end_date:
            # Add the traveldays
            try:
                newDay = TravelDay.objects.create(date=start_date, group_transfer_id=group.id)
                History.objects.create(
                    user=user,
                    model_name='GT',
                    action='CRE',
                    description=f"User : {user.username} added new travelday to group: \
                        {group.refcode} with date of : {start_date}"
                )
            except Exception as a:
                # In case anything occurs, return 400
                context['errormsg'] = a
                return Response(data=context, status=400)
            newDay.save()
            group.group_travelday.add(newDay)
            group.save()
            start_date += delta

        update_notifications()
        context['model'] = GroupSerializer(group).data
        return Response(data=context, status=200)


class DeleteTravelday(generics.UpdateAPIView):
    """
    URL : delete_travelday/(?P<refcode>.*)$
    Descr: Deletes selected travelday based on travelday ID passed from front end
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request, refcode):
        context = {"errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_delete(user.id, 'GT'):
            context = {"errormsg": "You do not have permission to delete a Group's travel day."}
            return Response(status=401, data=context)

        # Get group
        group = GroupTransfer.objects.get(refcode=refcode)

        # Get travelday
        travelday_id = request.data['travelday_id']
        try:
            travelday_to_delete = TravelDay.objects.get(id=travelday_id)
            History.objects.create(
                user=user,
                model_name='GT',
                action='DEL',
                description=f"User : {user.username} deleted travelday of group: \
                    {group.refcode} with date of : {travelday_to_delete.date}"
            )
            travelday_to_delete.delete()
            context['model'] = GroupSerializer(group).data
        except ProtectedError:
            context['errormsg'] = "This Travelday is protected. Remove Travelday's \
                related objects to be able to delete it."
            return Response(data=context, status=400)

        update_notifications()
        return Response(data=context, status=200)


class DeleteSchedule(generics.UpdateAPIView):
    """
    URL : delete_schedule/(?P<refcode>.*)$
    Descr: Deletes selected group's traveldays based on refcode
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request, refcode):
        context = {"errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permissions
        if not can_delete(user.id, 'GT'):
            context = {"errormsg": "You do not have permission to delete a Group's schedule."}
            return Response(status=401, data=context)

        # Get group
        group = GroupTransfer.objects.get(refcode=refcode)
        try:
            # Get traveldays to delete
            traveldays_to_delete = TravelDay.objects.filter(group_transfer_id=group.id)
            td_ids = [td.id for td in traveldays_to_delete]

            # If at least one day has a service, return protected error
            service_count = Service.objects.filter(travelday_id__in=td_ids).count()
            if service_count > 0:
                context['errormsg'] = "One of the Traveldays is protected. Remove Travelday's \
                related objects to be able to delete it."
                return Response(data=context, status=400)

            # Log all deletes
            for td in traveldays_to_delete:
                History.objects.create(
                    user=user,
                    model_name='GT',
                    action='DEL',
                    description=f"User : {user.username} deleted schedule of group: {group.refcode}"
                )
                td.delete()
            context['model'] = GroupSerializer(group).data
        except Exception as a:
            context['errormsg'] = a
            return Response(data=context, status=400)

        update_notifications()
        return Response(data=context, status=200)


class ChangeTraveldayDate(generics.ListCreateAPIView):
    """
    URL : change_travelday_date/(?P<refcode>.*)$
    Descr: Changes the date of the travelday
    Before this function, check for conflicts is called
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request):
        context = {"errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_update(user.id, 'GT'):
            context = {"errormsg": "You do not have permission to update a Group travel day's date."}
            return Response(status=401, data=context)

        # Get travelday
        td_id = request.data['td_id']
        travelday = TravelDay.objects.get(id=td_id)

        # Get group
        group = GroupTransfer.objects.get(id=travelday.group_transfer_id)
        try:
            contracts = Contract.objects.filter(hotel_id=travelday.hotel.id)
        except AttributeError:
            contracts = []

        if len(contracts) > 0:
            rooms = Room.objects.filter(contract_id__in=[contract.id for contract in contracts], date=travelday.date)
            if len(rooms) > 0:
                context['errormsg'] = "This date has Rooms from a contract, therefore it cannot be changed."
                return Response(status=400, data=context)

        # Get previous and new dates
        prev_date = travelday.date
        new_date = request.data['date']

        # Check if payment Exists:
        try:
            payment = Payment.objects.get(
                group_transfer_id=travelday.group_transfer_id,
                supplier_type='HTL',
                date_of_service=prev_date,
                supplier=travelday.hotel,
            )
            payment.date_of_service = new_date

            if payment.is_deposit_equal_to_amount():
                context['errormsg'] = "You cannot change a travelday's date which has a completed payment attached to it."
                return Response(data=context, status=400)

            payment.save()
        except Payment.DoesNotExist:
            pass

        try:
            travelday.date = new_date
            travelday.save()
            History.objects.create(
                user=user,
                model_name='GT',
                action='UPD',
                description=f"User : {user.username} updated day's date of group: {group.refcode} \
                    from : {prev_date} to {new_date}"
            )

            services = travelday.travelday_service.all()
            for service in services:
                service.date = new_date
                service.save()

            context['model'] = GroupSerializer(group).data
        except Exception as a:
            context['errormsg'] = a
            return Response(data=context, status=400)

        update_notifications()
        return Response(data=context, status=200)


class CheckForDateConflict(generics.ListCreateAPIView):
    """
    URL : check_for_date_conflict/(?P<refcode>.*)$
    Descr: Checks if the date exists at the same date in another travelday
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request, refcode):
        context = {
            "errormsg": '',
            "driver_conflict": False,
            "coach_conflict": False,
            'invalid_drivers': [],
            'invalid_coaches': [],
        }

        if request.data['type'] == 'Offer':
            return Response(data=context, status=200)

        # Get group
        group = GroupTransfer.objects.get(refcode=refcode)

        # Get travelday
        td_id = request.data['td_id']
        new_date = request.data['date']
        travelday = TravelDay.objects.get(id=td_id)

        # Check for driver conflict
        context['driver_conflict'] = True if TravelDay.objects.filter(
            date=new_date, driver_id=travelday.driver_id
        ).count() > 0 else False

        # Check for coach conflict
        context['coach_conflict'] = True if TravelDay.objects.filter(
            date=new_date, coach_id=travelday.coach_id
        ).count() > 0 else False

        if context['driver_conflict']:
            for i in TravelDay.objects.filter(date=travelday.date, driver_id=travelday.driver_id).filter(driver_id__isnull=False):
                if i.group_transfer_id != group.id:
                    context['invalid_drivers'].append(
                        GroupTransfer.objects.get(id=i.group_transfer_id).refcode + ' - ' + str(i.date)
                    )

        if context['coach_conflict']:
            for i in TravelDay.objects.filter(date=travelday.date, coach_id=travelday.coach_id).filter(coach_id__isnull=False):
                if i.group_transfer_id != group.id:
                    context['invalid_coaches'].append(
                        GroupTransfer.objects.get(id=i.group_transfer_id).refcode + ' - ' + str(i.date)
                    )
        return Response(data=context, status=200)


class ChangeHotel(generics.ListCreateAPIView):
    """
    URL : change_hotel/(?P<refcode>.*)$
    Descr: Changes the hotel of the travelday
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request, refcode):
        context = {"errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)
        # Permission
        if not can_update(user.id, 'GT'):
            context = {"errormsg": "You do not have permission to update a Group travel day's hotel."}
            return Response(status=401, data=context)
        

        # Get update rest of days checkbox value
        update_rest_of_days = request.data['update_rest_of_days']

        # Get group
        group = GroupTransfer.objects.get(refcode=refcode)

        if group.itinerary_downloaded and not user.is_superuser:
            context = {"errormsg": "You do not have permission to update a Group travel day's hotel because the itinerary has been downloaded."}
            return Response(status=401, data=context)


        # Get travelday
        td_id = request.data['td_id']
        travelday = TravelDay.objects.get(id=td_id)

        # Get hotel
        try:
            hotel = Hotel.objects.get(name=request.data['hotel'])
        except (KeyError, Hotel.DoesNotExist):
            hotel = None

        # Get traveldays to update
        if update_rest_of_days is True:
            tds_to_update = TravelDay.objects.filter(group_transfer_id=group.id).filter(date__gte=travelday.date).order_by("-date")[1:]
        else:
            tds_to_update = [travelday]

        # Get previous hotel for logging
        try:
            prev_hotel = Hotel.objects.get(id=travelday.hotel_id).name
        except Hotel.DoesNotExist:
            prev_hotel = 'N/A'

        # Loop over the days to update.
        for td in tds_to_update:

            # Get previous hotel for logging.
            try:
                prev_hotel = Hotel.objects.get(id=travelday.hotel_id)
            except Hotel.DoesNotExist:
                prev_hotel = None

            # release hotel's rooms on changing?
            if prev_hotel is not None:
                try:
                    prev_contract = Contract.objects.get(hotel_id=prev_hotel.id)
                    prev_rooms = Room.objects.filter(date=td.date, contract_id=prev_contract.id, available=False)
                    for room in prev_rooms:
                        room.available = True
                        room.save()
                except Contract.DoesNotExist:
                    prev_contract = None

            try:
                aes = AttractionEntries.objects.filter(travelday_id=td.id)
                for ae in aes:
                    ae.delete()

                td.hotel = hotel
                td.booker = user
                td.option_date = request.data['option_date']

                td.currency = request.data['currency']
                td.price_per_sgl = request.data['sgl']
                td.price_per_dbl_for_single_use = request.data['double_for_single_use']
                td.price_per_dbl = request.data['dbl']
                td.price_per_twin = request.data['twin']
                td.price_per_triple = request.data['triple']
                td.price_per_quad = request.data['quad']
                td.price_per_five_bed = request.data['five_bed']
                td.price_per_six_bed = request.data['six_bed']
                td.price_per_seven_bed = request.data['seven_bed']
                td.price_per_eight_bed = request.data['eight_bed']
                td.free_singles = request.data['free_singles']
                td.free_half_twins = request.data['free_half_twins']
                td.free_half_doubles = request.data['free_half_doubles']
                td.price_per_suite = request.data['suite']

                td.save()

                try:
                    if hotel is not None:
                        # Create a dictionary to hold room types and their quantities
                        room_quantities = {}

                        # Extract quantities using regex
                        pattern = r'([\w\s]+): (\d+)'
                        for match in re.finditer(pattern, group.room_desc):
                            room_type = match.group(1).strip()  # Capture room type
                            quantity = int(match.group(2).strip())  # Capture quantity
                            room_quantities[room_type] = quantity

                            # Assuming `td` is your model instance with the prices set from the request

                            free_singles = int(request.data.get('free_singles', 0))
                            free_half_twins = int(request.data.get('free_half_twins', 0))
                            free_half_doubles = int(request.data.get('free_half_doubles', 0))

                            total_amount = 0.0  # Initialize as float

                            # Map room types to their corresponding attributes in the model
                            room_price_map = {
                                "Single": td.price_per_sgl,
                                "Double for single use": td.price_per_dbl_for_single_use,
                                "Double": td.price_per_dbl,
                                "Twin": td.price_per_twin,
                                "Triple": td.price_per_triple,
                                "Quad": td.price_per_quad,
                                "Suite": td.price_per_suite,
                                "Five Bed": td.price_per_five_bed,
                                "Six Bed": td.price_per_six_bed,
                                "Seven Bed": td.price_per_seven_bed,
                                "Eight Bed": td.price_per_eight_bed,
                            }

                            # Calculate the total amount
                            for room_type, quantity in room_quantities.items():
                                price = room_price_map.get(room_type, 0)  # Default to 0 if not found

                                # Ensure price is a float for calculation
                                if isinstance(price, str):
                                    price = float(price) if price else 0.0

                                # Calculate the cost for the requested quantity
                                total_cost = price * quantity

                                # Calculate free room deductions
                                if room_type == "Single":
                                    total_cost -= price * free_singles  # Deduct full price for free singles
                                elif room_type == "Twin":
                                    total_cost -= (price / 2) * free_half_twins  # Deduct half price for half twin frees
                                elif room_type == "Double":
                                    total_cost -= (price / 2) * free_half_doubles  # Deduct half price for half double frees

                                total_amount += total_cost

                            # Ensure total amount doesn't go negative
                            total_amount = max(total_amount, 0)

                        try:
                            payment = Payment.objects.get(
                                group_transfer=GroupTransfer.objects.get(id=td.group_transfer_id),
                                date_of_service=td.date,
                                supplier_type='HTL',
                            )
                            if payment.is_deposit_equal_to_amount():
                                context['errormsg'] = 'You cannot change a hotel which has a completed payment attached to it.'
                                return Response(data=context, status=400)

                            payment.amount = total_amount
                            payment.supplier = hotel.name

                        except Payment.DoesNotExist:

                            Payment.objects.create(
                                group_transfer=GroupTransfer.objects.get(id=td.group_transfer_id),
                                supplier=hotel.name,
                                supplier_type='HTL',
                                date_of_service=td.date,
                                currency=td.currency,
                                amount=total_amount,
                                pay_until=request.data['pay_until'],
                            )
                except Exception as a:
                    print(a)

                History.objects.create(
                    user=user,
                    model_name='GT',
                    action='UPD',
                    description=f"User : {user.username} updated travelday's ({td.date}) hotel of group: \
                        {group.refcode} from {prev_hotel} to {hotel}"
                )

                # related_contract = False
                # if hotel is not None:
                #     contracts = Contract.objects.filter(hotel_id=hotel.id)
                #     for contract in contracts:
                #         dates_list = get_dates_in_range(contract.period)
                #         if str(td.date) in dates_list:
                #             related_contract = contract

                #     if related_contract:
                #         for i in range(request.data['sgl']):

                #             rooms = Room.objects.filter(contract_id=contract.id, room_type='SGL', available=True, enabled=True, date=td.date)
                #             if len(rooms) > 0:
                #                 room = rooms[0]
                #                 room.available = False
                #                 room.save()
                #         for i in range(request.data['dbl']):
                #             room = Room.objects.filter(contract_id=contract.id, room_type='DBL', available=True, enabled=True, date=td.date)
                #             if len(rooms) > 0:
                #                 room = rooms[0]
                #                 room.available = False
                #                 room.save()
                #         for i in range(request.data['twin']):
                #             room = Room.objects.filter(contract_id=contract.id, room_type='TWIN', available=True, enabled=True, date=td.date)
                #             if len(rooms) > 0:
                #                 room = rooms[0]
                #                 room.available = False
                #                 room.save()
                #         for i in range(request.data['trpl']):
                #             room = Room.objects.filter(contract_id=contract.id, room_type='TRPL', available=True, enabled=True, date=td.date)
                #             if len(rooms) > 0:
                #                 room = rooms[0]
                #                 room.available = False
                #                 room.save()
                #         for i in range(request.data['quad']):
                #             room = Room.objects.filter(contract_id=contract.id, room_type='QUAD', available=True, enabled=True, date=td.date)
                #             if len(rooms) > 0:
                #                 room = rooms[0]
                #                 room.available = False
                #                 room.save()

                update_roominglists(group)
                context['model'] = GroupSerializer(group).data
            except Exception as a:
                context['errormsg'] = a
                return Response(data=context, status=400)

        update_notifications()
        return Response(data=context, status=200)


class ChangeDriver(generics.ListCreateAPIView):
    """
    URL : change_driver/(?P<refcode>.*)$
    Descr: Changes the driver of the travelday
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request, refcode):
        context = {"errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_update(user.id, 'GT'):
            context = {"errormsg": "You do not have permission to update a Group travel day's driver."}
            return Response(status=401, data=context)

        # Get driver
        try:
            driver_id = Contact.objects.get(id=request.data['driver'].split(')')[0]).id
            driver_name = Contact.objects.get(id=driver_id)
        except KeyError:
            driver_id = None
            driver_name = 'N/A'

        # Get group
        group = GroupTransfer.objects.get(refcode=refcode)
        td_id = request.data['td_id']

        # Get check boxe's value
        update_rest_of_days = request.data['update_rest_of_days']
        travelday = TravelDay.objects.get(id=td_id)
        tds_to_update = []

        # IF this boolean is true, function sets driver upcoming days as well
        if update_rest_of_days is True:
            tds_to_update = TravelDay.objects.filter(group_transfer_id=group.id).filter(date__gte=travelday.date)
        else:
            tds_to_update = [travelday]

        # Update day(s)
        for td in tds_to_update:
            try:
                prev_driver = Contact.objects.get(id=td.driver_id).name
            except Contact.DoesNotExist:
                prev_driver = 'N/A'
            try:
                td.driver_id = driver_id
                td.save()
                History.objects.create(
                    user=user,
                    model_name='GT',
                    action='UPD',
                    description=f"User : {user.username} updated travelday's ({travelday.date}) driver of group: \
                        {group.refcode} from {prev_driver} to {driver_name}"
                )
                context['model'] = GroupSerializer(group).data
            except Exception as a:
                context['errormsg'] = a
                return Response(data=context, status=400)

        update_notifications()
        return Response(data=context, status=200)


class CheckForDriverConflict(generics.ListCreateAPIView):
    """
    URL : check_for_driver_conflict/(?P<refcode>.*)$
    Descr: Checks if the driver exists at the same date in another travelday
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request, refcode):
        context = {"errormsg": '', "has_conflict": False, 'invalid_dates': [], 'conflicted_groups': []}

        # Get driver
        try:
            driver_id = Contact.objects.get(id=request.data['driver'].split(')')[0])
        except (Contact.DoesNotExist, ValueError, KeyError):
            driver_id = None

        # Get group
        group = GroupTransfer.objects.get(refcode=refcode)
        td_id = request.data['td_id']

        # Get all days to be updated for check
        update_rest_of_days = request.data['update_rest_of_days']
        travelday = TravelDay.objects.get(id=td_id)
        tds_to_update = []

        if update_rest_of_days is True:
            tds_to_update = TravelDay.objects.filter(group_transfer_id=group.id).filter(date__gte=travelday.date)
        else:
            tds_to_update = [travelday]

        for td in tds_to_update:
            # exclude this group from the above list
            conflicted_tds = TravelDay.objects.filter(date=td.date, driver_id=driver_id)
            group_ids = [i.group_transfer_id for i in conflicted_tds]
            conflicted_groups_to_report = GroupTransfer.objects.filter(id__in=group_ids)
            if driver_id is not None and conflicted_tds.count() > 0:
                for i in conflicted_groups_to_report:
                    if i.id != group.id:
                        context['has_conflict'] = True
                        context['conflicted_groups'].append(i.refcode + ' - ' + str(td.date) + ' ')

        return Response(data=context, status=200)


class ChangeCoach(generics.ListCreateAPIView):
    """
    URL : change_coach/(?P<refcode>.*)$
    Descr: Changes travelday's coach
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request, refcode):
        context = {"errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_update(user.id, 'GT'):
            context = {"errormsg": "You do not have permission to update a Group travel day's coach."}
            return Response(status=401, data=context)

        try:
            coach = Coach.objects.get(id=request.data['coach'].split(')')[0])
        except (Coach.DoesNotExist, ValueError, KeyError):
            coach = None

        # Get group
        group = GroupTransfer.objects.get(refcode=refcode)

        # Get travelday
        td_id = request.data['td_id']
        update_rest_of_days = request.data['update_rest_of_days']
        travelday = TravelDay.objects.get(id=td_id)
        tds_to_update = []

        # Get all days to be updated for check
        if update_rest_of_days is True:
            tds_to_update = TravelDay.objects.filter(group_transfer_id=group.id).filter(date__gte=travelday.date)
        else:
            tds_to_update = [travelday]

        # loop over traveldays
        for td in tds_to_update:

            try:
                prev_coach = Coach.objects.get(id=td.coach_id)
            except Coach.DoesNotExist:
                prev_coach = 'N/A'
            try:
                td.coach_id = coach
                td.save()
                History.objects.create(
                    user=user,
                    model_name='GT',
                    action='UPD',
                    description=f"User : {user.username} updated travelday's ({travelday.date}) coach of group: \
                        {group.refcode} from {prev_coach} to {coach}"
                )
                context['model'] = GroupSerializer(group).data
            except Exception as a:
                context['errormsg'] = a
                return Response(data=context, status=400)

        update_notifications()
        return Response(data=context, status=200)


class CheckForCoachConflict(generics.ListCreateAPIView):
    """
    URL : check_for_coach_conflict/(?P<refcode>.*)$
    Descr: Checks if the coach exists at the same date in another travelday
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request, refcode):
        context = {"errormsg": '', "has_conflict": False, 'invalid_dates': [], 'conflicted_groups': []}

        # Get coach
        try:
            coach_id = Coach.objects.get(id=request.data['coach'].split(')')[0])
        except (Coach.DoesNotExist, ValueError, KeyError):
            coach_id = None

        # Get group
        group = GroupTransfer.objects.get(refcode=refcode)
        td_id = request.data['td_id']

        # Get all days to be updated for check
        update_rest_of_days = request.data['update_rest_of_days']
        travelday = TravelDay.objects.get(id=td_id)
        tds_to_update = []
        if update_rest_of_days is True:
            tds_to_update = TravelDay.objects.filter(group_transfer_id=group.id).filter(date__gte=travelday.date)
        else:
            tds_to_update = [travelday]
        for td in tds_to_update:
            # exclude this group from the above list
            conflicted_tds = TravelDay.objects.filter(date=td.date, coach_id=coach_id)
            group_ids = [i.group_transfer_id for i in conflicted_tds]
            conflicted_groups_to_report = GroupTransfer.objects.filter(id__in=group_ids)
            if coach_id is not None and conflicted_tds.count() > 0:
                for i in conflicted_groups_to_report:
                    if i.id != group.id:
                        context['has_conflict'] = True
                        context['conflicted_groups'].append(i.refcode + ' - ' + str(td.date) + ' ')
        return Response(data=context, status=200)


class ChangeGroupLeader(generics.ListCreateAPIView):
    """
    URL : change_group_leader/$
    Descr: Changes Group Leader for a travelday or a set of traveldays
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request):
        context = {"errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_update(user.id, 'GT'):
            context = {"errormsg": "You do not have permission to update a Group's leader."}
            return Response(status=401, data=context)

        try:
            leader_name = request.data['group_leader']
            leader = Contact.objects.get(name=leader_name, type='L')
        except KeyError:
            leader = None

        # Get travelday id
        td_id = request.data['td_id']

        travelday = TravelDay.objects.get(id=td_id)

        # Get Group
        group = GroupTransfer.objects.get(id=travelday.group_transfer_id)

        # If this variable is true,
        # Change the leader for the upcoming days of the group too
        update_rest_of_days = request.data['update_rest_of_days']
        travelday = TravelDay.objects.get(id=td_id)
        tds_to_update = []

        if update_rest_of_days is True:
            tds_to_update = TravelDay.objects.filter(group_transfer_id=group.id).filter(date__gte=travelday.date)
        else:
            tds_to_update = [travelday]

        # Loop over the days to update.
        for td in tds_to_update:
            try:
                prev_leader = Contact.objects.get(id=travelday.leader_id)
            except Contact.DoesNotExist:
                prev_leader = None

            try:
                td.leader = leader
                td.save()
                History.objects.create(
                    user=user,
                    model_name='GT',
                    action='UPD',
                    description=f"User : {user.username} updated travelday's ({td.date}) Group Leader Of Group: \
                        {group.refcode} from {prev_leader} to {leader}"
                )
                context['model'] = GroupSerializer(group).data
            except Exception as a:
                context['errormsg'] = a
                return Response(data=context, status=400)

        update_notifications()
        return Response(data=context, status=200)


class ChangeOptionDate(generics.ListCreateAPIView):
    """
    URL : change_option_date/(?P<refcode>.*)$
    Descr: Changes the option date of the travelday
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request, refcode):
        context = {"errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)
        # Permission
        if not can_update(user.id, 'GT'):
            context = {"errormsg": "You do not have permission to update a Group travel day's option date."}
            return Response(status=401, data=context)

        # Get group
        group = GroupTransfer.objects.get(refcode=refcode)

        # Get travelday
        td_id = request.data['td_id']
        travelday = TravelDay.objects.get(id=td_id)
        travelday.option_date = request.data['option_date']
        travelday.save()
        History.objects.create(
            user=user,
            model_name='GT',
            action='UPD',
            description=f"User : {user.username} updated travelday's ({travelday.date}) option_date of group: \
                {group.refcode} to {request.data['option_date']}"
        )
        context['model'] = GroupSerializer(group).data
        return Response(data=context, status=200)


class ChangePricePerPersonTD(generics.ListCreateAPIView):
    """
    URL : change_price_per_person/(?P<refcode>.*)$
    Descr: Changes the price per person of the travelday
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request, refcode):
        context = {"errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)
        # Permission
        if not can_update(user.id, 'GT'):
            context = {"errormsg": "You do not have permission to update a Group travel day's price per person."}
            return Response(status=401, data=context)

        # Get group
        group = GroupTransfer.objects.get(refcode=refcode)

        # Get travelday
        td_id = request.data['td_id']
        travelday = TravelDay.objects.get(id=td_id)

        if 'price_per_person' in request.data:
            price_per_person = request.data['price_per_person']
        else:
            price_per_person = None  # Set to None if key doesn't exist

        travelday.price_per_person = price_per_person

        travelday.save()
        History.objects.create(
            user=user,
            model_name='GT',
            action='UPD',
            description=f"User : {user.username} updated travelday's ({travelday.date}) price per person of group: \
                {group.refcode} to {price_per_person}"
        )
        context['model'] = GroupSerializer(group).data
        return Response(data=context, status=200)
