from webapp.models import (
    GroupTransfer,
    Agent,
    Client,
    History,
)
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authtoken.models import Token
from rest_framework import generics
from rest_framework.response import Response
from django.db.models import ProtectedError
from pathlib import Path
import os

from webapp.serializers import (
    GroupSerializer,
)
from webapp.xhr import update_notifications

from accounts.permissions import (
    can_update,
    can_delete,
)


# Get user from token
def get_user(token):
    return Token.objects.get(key=token).user


BASE_DIR = Path(__file__).resolve().parent.parent.parent


class ChangeRefcode(generics.ListCreateAPIView):
    """
    url : r'change_refcode/(?P<refcode>.*)$'
    Descr: Changes group refcode.
    Office is required
    Agent or Client is required
    Date is required
    Rest of code is optional
    refcode format = Office ( COA ) + Agent/Client abbreviation ( MAS ) + Date + Rest of code
    Deletes previous agent or client based on request, and adds new
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request, refcode):
        context = {"errormsg": '', "new_refcode": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_update(user.id, 'GT'):
            context = {"errormsg": "You do not have permission to update a Group's refcode."}
            return Response(status=401, data=context)

        # Get office
        selected_office = request.data['office']

        # Get agent or client
        agent_or_client = request.data['agent_or_client']
        try:
            if agent_or_client == 'Agent':
                agent_name = request.data['Agent']
                client_name = None
        except KeyError:
            agent_name = None

        try:
            if agent_or_client == 'Client':
                agent_name = None
                client_name = request.data['Client']
        except KeyError:
            client_name = None

        # Get Rest of code
        rest_of_code = request.data['rest_of_code'].strip()

        # Get Date
        date = request.data['date']

        # Validations
        # Office selection has to be in this list
        office_options = ['COL', 'COA']
        if selected_office not in office_options:
            context['errormsg'] = 'Invalid office option'
            return Response(data=context, status=400)

        # Agent or client value has to be in this list
        agent_or_client_options = ['Agent', 'Client']
        if agent_or_client not in agent_or_client_options:
            context['errormsg'] = 'Invalid agent or client option'
            return Response(data=context, status=400)

        # If there both agent or client, return 400
        if agent_name is not None and client_name is not None:
            context['errormsg'] = 'You cannot set both agent and client in a group'
            return Response(data=context, status=400)

        # If there is no agent or client, return 400
        if agent_name is None and client_name is None:
            context['errormsg'] = 'Please select Agent or Client field'
            return Response(data=context, status=400)

        # If agent does not exist
        if agent_name is not None and agent_name not in [_.name for _ in Agent.objects.all()]:
            context['errormsg'] = 'Agent does not exist'
            return Response(data=context, status=400)

        # If client does not exist
        if client_name is not None and client_name not in [_.name for _ in Client.objects.all()]:
            context['errormsg'] = 'Client does not exist'
            return Response(data=context, status=400)

        # Validate date input
        if len(date) == 0 or date is None or date == 'Invalid date':
            context['errormsg'] = 'Invalid date input'
            return Response(data=context, status=400)

        # Get Agent or Client
        agent = Agent.objects.get(name=agent_name) if agent_or_client == 'Agent' else None
        client = Client.objects.get(name=client_name) if agent_or_client == 'Client' else None

        # If Agent exists, get his abbreviation, else get Client's
        abbreviation = agent.abbreviation if agent_or_client == 'Agent' else client.abbreviation
        if str(abbreviation) == 'None':
            abbreviation = ''

        # Refcode final string
        new_refcode = selected_office + '-' + str(abbreviation) + date.replace('-', '') + str(rest_of_code)

        # Validate refcode
        all_refcodes = [i.refcode for i in GroupTransfer.objects.all()]

        if new_refcode in all_refcodes:
            context['errormsg'] = 'This Refcode Already Exists.'
            return Response(data=context, status=400)

        # Get group
        group = GroupTransfer.objects.get(refcode=refcode)
        try:
            if agent_or_client == 'Agent':
                group.agent_id = agent.id
                group.client_id = None
            else:
                group.client_id = client.id
                group.agent_id = None
            group.refcode = new_refcode
            group.save()
            context['new_refcode'] = new_refcode  # Used to redirect the user to group's overview

            # try to rename rooming lists folder with refcode name to new refcode here
            rl_path = str(BASE_DIR) + '/files/rooming_lists/'
            if os.path.exists(rl_path + refcode):
                os.rename(rl_path + refcode, rl_path + new_refcode)
                for root, dirs, files in os.walk(rl_path + new_refcode):
                    for file in files:
                        if refcode in file:
                            new_file_name = file.replace(refcode, new_refcode)
                            os.rename(os.path.join(root, file), os.path.join(root, new_file_name))

            # try to rename group documents folder
            rl_path = os.path.join(BASE_DIR, 'static', 'files', 'group_documents')
            try:
                os.rename(os.path.join(rl_path, refcode), os.path.join(rl_path, new_refcode))
            except Exception as a:
                print(a)

            History.objects.create(
                    user=user,
                    model_name='GT',
                    action='UPD',
                    description=f"User : {user.username} updated group's refcode from {refcode} to {new_refcode}"
                )

        except Exception as a:
            context['errormsg'] = a
            return Response(data=context, status=400)
        return Response(data=context, status=200)


class ChangeStatus(generics.ListCreateAPIView):
    """
    url : r'change_status/(?P<refcode>.*)$'
    Descr: Changes group's status ( Confirmed / Cancelled ).
    Status is required
    Status options are :
    Cancelled = 4
    Confirmed = 5
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request, refcode):
        context = {"errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_update(user.id, 'GT'):
            context = {"errormsg": "You do not have permission to update a Group's status."}
            return Response(status=401, data=context)

        # Get Status
        status = request.data['status']

        # Get Group
        group = GroupTransfer.objects.get(refcode=refcode)

        # Get previous Status
        descr_prev_status = 'Confirmed' if group.status == '5' else 'Cancelled'
        descr_status = 'Confirmed' if status == '5' else 'Cancelled'

        # If Status didnt change. Do nothing and return 200
        if status == group.status:
            context['model'] = GroupSerializer(group).data
            return Response(data=context, status=200)

        try:
            group.status = status
            group.save()
            History.objects.create(
                user=user,
                model_name='GT',
                action='UPD',
                description=f"User : {user.username} updated group's: {group.refcode}'s status from \
                    {descr_prev_status} to {descr_status}"
            )
            context['model'] = GroupSerializer(group).data
        except Exception as a:
            context['errormsg'] = a
            return Response(data=context, status=400)
        return Response(data=context, status=200)


class ChangeArrivalFlight(generics.ListCreateAPIView):
    """
    url : r'change_arrival/(?P<refcode>.*)$
    Fields:
    1) Airport
    2) Airline
    3) Flight number
    4) Datetime
    5) Terminal
    Descr: Group's Arrival flight String
    Structure: datetime + ' - ' + flight + ' - ' + airport + ' - ' + terminal
    Sample: 19 February 2020 - 12:15 A3600 -- LHR London, England, United Kingdom Heathrow --- Terminal 2
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request, refcode):
        context = {"errormsg": '', 'arrival_str': ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_update(user.id, 'GT'):
            context = {"errormsg": "You do not have permission to update a Group's arrival flight."}
            return Response(status=401, data=context)

        # Get Type
        transport_type = request.data['transport_type']

        if transport_type == 'AIR':
            # Get Airport
            airport = request.data['airport'].strip()

            # Get Flight Abbreviation
            flight_abbr = request.data['flightAbbr']

            # Get Flight Number
            flight_digits = request.data['flight']

            # Get Datetime
            arrival_date = request.data['arrival_date'].strip()

            # Get Terminal
            terminal = request.data['terminal'].strip()

            # Flight string
            flight = f"{flight_abbr} {flight_digits}"

            # Datetime object is passed like this from front end :
            # Sat Jun 26 2021 15:00:00 GMT+0300 (Eastern European Summer Time)
            datetime = arrival_date.split('+')[0][:-7]

            arrival_str = datetime + ' - ' + flight + ' - ' + airport + ' - ' + terminal

            # Get Group
            group = GroupTransfer.objects.get(refcode=refcode)

            # Get previous arrival flight string for history
            prev_arrival = group.arrival

            # If it is the same, do nothing
            if arrival_str == prev_arrival:
                return Response(data=context, status=200)

            # Validations
            if flight == '' or flight is None:
                context['errormsg'] = 'Flight cannot be empty'
                return Response(data=context, status=400)

            if flight_abbr == '' or airport == '':
                arrival_str = 'N/A'

            try:
                # arrival flight is a charfield
                group.arrival_type = 'AIR'
                group.arrival = arrival_str
                group.save()
                History.objects.create(
                    user=user,
                    model_name='GT',
                    action='UPD',
                    description=f"User : {user.username} updated group's: {group.refcode} arrival flight \
                        from {prev_arrival} to {arrival_str}"
                )
                context['model'] = GroupSerializer(group).data
            except Exception as a:
                context['errormsg'] = a
                return Response(data=context, status=400)

        elif transport_type == 'NA':

            # Get Datetime
            arrival_date = request.data['arrival_date'].strip()

            # Datetime object is passed like this from front end :
            # Sat Jun 26 2021 15:00:00 GMT+0300 (Eastern European Summer Time)
            datetime = arrival_date.split('+')[0][:-7]

            # Get Group
            group = GroupTransfer.objects.get(refcode=refcode)

            # Get previous arrival flight string for history
            prev_arrival = group.arrival

            arrival_str = datetime

            # If it is the same, do nothing
            if arrival_str == prev_arrival:
                return Response(data=context, status=200)

            try:
                # arrival flight is a charfield
                group.arrival_type = 'NA'
                group.arrival = arrival_str
                group.save()
                History.objects.create(
                    user=user,
                    model_name='GT',
                    action='UPD',
                    description=f"User : {user.username} updated group's: {group.refcode} arrival \
                        from {prev_arrival} to {arrival_str}"
                )
                context['model'] = GroupSerializer(group).data
            except Exception as a:
                context['errormsg'] = a
                return Response(data=context, status=400)


        elif transport_type == 'CCH':

            # Get Datetime
            arrival_date = request.data['arrival_date'].strip()

            # Datetime object is passed like this from front end :
            # Sat Jun 26 2021 15:00:00 GMT+0300 (Eastern European Summer Time)
            datetime = arrival_date.split('+')[0][:-7]

            # Get Group
            group = GroupTransfer.objects.get(refcode=refcode)

            # Get previous arrival flight string for history
            prev_arrival = group.arrival

            arrival_str = datetime

            # If it is the same, do nothing
            if arrival_str == prev_arrival:
                return Response(data=context, status=200)

            try:
                # arrival flight is a charfield
                group.arrival_type = 'CCH'
                group.arrival = arrival_str
                group.save()
                History.objects.create(
                    user=user,
                    model_name='GT',
                    action='UPD',
                    description=f"User : {user.username} updated group's: {group.refcode} arrival \
                        from {prev_arrival} to {arrival_str}"
                )
                context['model'] = GroupSerializer(group).data
            except Exception as a:
                context['errormsg'] = a
                return Response(data=context, status=400)
            

        elif transport_type == 'SEA':
            # Get Airport
            port = request.data['port'].strip()

            # Get Datetime
            arrival_date = request.data['arrival_date'].strip()

            ferry_ticket_agency = request.data['ferry_ticket_agency'].strip()

            # Get Datetime
            ship_name = request.data['ship_name'].strip()

            # Datetime object is passed like this from front end :
            # Sat Jun 26 2021 15:00:00 GMT+0300 (Eastern European Summer Time)
            datetime = arrival_date.split('+')[0][:-7]

            # Arrival is formed by date, time, port, country, ferry ticket agency name, and ship name.

            if ship_name == "":
                arrival_str = datetime + ' - ' + port + ', ' + ferry_ticket_agency
            else:
                arrival_str = datetime + ' - ' + port + ', ' + ferry_ticket_agency + ', ' + ship_name

            # Get Group
            group = GroupTransfer.objects.get(refcode=refcode)

            # Get previous arrival flight string for history
            prev_arrival = group.arrival

            # If it is the same, do nothing
            if arrival_str == prev_arrival:
                return Response(data=context, status=200)

            try:
                # arrival flight is a charfield
                group.arrival_type = 'SEA'
                group.arrival = arrival_str
                group.save()
                History.objects.create(
                    user=user,
                    model_name='GT',
                    action='UPD',
                    description=f"User : {user.username} updated group's: {group.refcode} arrival \
                        from {prev_arrival} to {arrival_str}"
                )
                context['model'] = GroupSerializer(group).data
            except Exception as a:
                context['errormsg'] = a
                return Response(data=context, status=400)

        elif transport_type == 'TRN':
            # Get Airport
            railway_station = request.data['railway_station'].strip()

            # Get Datetime
            arrival_date = request.data['arrival_date'].strip()

            train_ticket_agency = request.data['train_ticket_agency'].strip()

            # Get Datetime
            route = request.data['route'].strip()

            # Datetime object is passed like this from front end :
            # Sat Jun 26 2021 15:00:00 GMT+0300 (Eastern European Summer Time)
            datetime = arrival_date.split('+')[0][:-7]

            if route == "":
                arrival_str = datetime + ' - ' + railway_station + ', ' + train_ticket_agency
            else:
                arrival_str = datetime + ' - ' + railway_station + ', ' + train_ticket_agency + ', ' + route

            # Get Group
            group = GroupTransfer.objects.get(refcode=refcode)

            # Get previous arrival flight string for history
            prev_arrival = group.arrival

            # If it is the same, do nothing
            if arrival_str == prev_arrival:
                return Response(data=context, status=200)

            try:
                # arrival flight is a charfield
                group.arrival_type = 'TRN'
                group.arrival = arrival_str
                group.save()
                History.objects.create(
                    user=user,
                    model_name='GT',
                    action='UPD',
                    description=f"User : {user.username} updated group's: {group.refcode} arrival \
                        from {prev_arrival} to {arrival_str}"
                )
                context['model'] = GroupSerializer(group).data
            except Exception as a:
                context['errormsg'] = a
                return Response(data=context, status=400)

        update_notifications()
        return Response(data=context, status=200)


class ChangeDepartureFlight(generics.ListCreateAPIView):
    """
    url : r'change_departure/(?P<refcode>.*)$
    Fields:
        1) Airport
        2) Airline
        3) Flight number
        4) Datetime
        5) Terminal
    Descr: Group's Departure flight String
    Structure: datetime + ' - ' + flight + ' - ' + airport + ' - ' + terminal
    Sample: 19 February 2020 - 12:15 A3600 -- LHR London, England, United Kingdom Heathrow --- Terminal 2
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request, refcode):
        context = {"errormsg": '', 'departure_str': ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_update(user.id, 'GT'):
            context = {"errormsg": "You do not have permission to update a Group's departure flight."}
            return Response(status=401, data=context)

        # Get Type
        transport_type = request.data['transport_type']

        if transport_type == 'AIR':
            # Get Airport
            airport = request.data['airport'].strip()

            # Get Flight Abbreviation
            flight_abbr = request.data['flightAbbr']

            # Get Flight Number
            flight_digits = request.data['flight']

            # Get Datetime
            departure_date = request.data['departure_date'].strip()

            # Get Terminal
            terminal = request.data['terminal'].strip()

            # Flight string
            flight = f"{flight_abbr} {flight_digits}"

            # Datetime object is passed like this from front end :
            # Sat Jun 26 2021 15:00:00 GMT+0300 (Eastern European Summer Time)
            datetime = departure_date.split('+')[0][:-7]

            departure_str = datetime + ' - ' + flight + ' - ' + airport + ' - ' + terminal

            # Get Group
            group = GroupTransfer.objects.get(refcode=refcode)

            # Get previous departure flight string for history
            prev_departure = group.departure

            # If it is the same, do nothing
            if departure_str == prev_departure:
                return Response(data=context, status=200)

            # Validations
            if flight == '' or flight is None:
                context['errormsg'] = 'Flight cannot be empty'
                return Response(data=context, status=400)

            if flight_abbr == '' or airport == '':
                departure_str = 'N/A'

            try:
                # departure flight is a charfield
                group.departure_type = 'AIR'
                group.departure = departure_str
                group.save()
                History.objects.create(
                    user=user,
                    model_name='GT',
                    action='UPD',
                    description=f"User : {user.username} updated group's: {group.refcode} departure flight \
                        from {prev_departure} to {departure_str}"
                )
                context['model'] = GroupSerializer(group).data
            except Exception as a:
                context['errormsg'] = a
                return Response(data=context, status=400)

        elif transport_type == 'NA':

            # Get Datetime
            departure_date = request.data['departure_date'].strip()

            # Datetime object is passed like this from front end :
            # Sat Jun 26 2021 15:00:00 GMT+0300 (Eastern European Summer Time)
            datetime = departure_date.split('+')[0][:-7]

            # Get Group
            group = GroupTransfer.objects.get(refcode=refcode)

            # Get previous departure flight string for history
            prev_departure = group.departure

            departure_str = datetime

            # If it is the same, do nothing
            if departure_str == prev_departure:
                return Response(data=context, status=200)

            try:
                # departure flight is a charfield
                group.departure_type = 'NA'
                group.departure = departure_str
                group.save()
                History.objects.create(
                    user=user,
                    model_name='GT',
                    action='UPD',
                    description=f"User : {user.username} updated group's: {group.refcode} departure \
                        from {prev_departure} to {departure_str}"
                )
                context['model'] = GroupSerializer(group).data
            except Exception as a:
                context['errormsg'] = a
                return Response(data=context, status=400)



        elif transport_type == 'CCH':

            # Get Datetime
            departure_date = request.data['departure_date'].strip()

            # Datetime object is passed like this from front end :
            # Sat Jun 26 2021 15:00:00 GMT+0300 (Eastern European Summer Time)
            datetime = departure_date.split('+')[0][:-7]

            # Get Group
            group = GroupTransfer.objects.get(refcode=refcode)

            # Get previous departure flight string for history
            prev_departure = group.departure

            departure_str = datetime

            # If it is the same, do nothing
            if departure_str == prev_departure:
                return Response(data=context, status=200)

            try:
                # departure flight is a charfield
                group.departure_type = 'CCH'
                group.departure = departure_str
                group.save()
                History.objects.create(
                    user=user,
                    model_name='GT',
                    action='UPD',
                    description=f"User : {user.username} updated group's: {group.refcode} departure \
                        from {prev_departure} to {departure_str}"
                )
                context['model'] = GroupSerializer(group).data
            except Exception as a:
                context['errormsg'] = a
                return Response(data=context, status=400)
            

        elif transport_type == 'SEA':
            # Get Airport
            port = request.data['port'].strip()

            # Get Datetime
            departure_date = request.data['departure_date'].strip()

            ferry_ticket_agency = request.data['ferry_ticket_agency'].strip()

            # Get Datetime
            ship_name = request.data['ship_name'].strip()

            # Datetime object is passed like this from front end :
            # Sat Jun 26 2021 15:00:00 GMT+0300 (Eastern European Summer Time)
            datetime = departure_date.split('+')[0][:-7]

            # Departure is formed by date, time, port, country, ferry ticket agency name, and ship name.

            if ship_name == "":
                departure_str = datetime + ' - ' + port + ', ' + ferry_ticket_agency
            else:
                departure_str = datetime + ' - ' + port + ', ' + ferry_ticket_agency + ', ' + ship_name

            # Get Group
            group = GroupTransfer.objects.get(refcode=refcode)

            # Get previous departure flight string for history
            prev_departure = group.departure

            # If it is the same, do nothing
            if departure_str == prev_departure:
                return Response(data=context, status=200)

            try:
                # departure flight is a charfield
                group.departure_type = 'SEA'
                group.departure = departure_str
                group.save()
                History.objects.create(
                    user=user,
                    model_name='GT',
                    action='UPD',
                    description=f"User : {user.username} updated group's: {group.refcode} departure \
                        from {prev_departure} to {departure_str}"
                )
                context['model'] = GroupSerializer(group).data
            except Exception as a:
                context['errormsg'] = a
                return Response(data=context, status=400)

        elif transport_type == 'TRN':
            # Get Airport
            railway_station = request.data['railway_station'].strip()

            # Get Datetime
            departure_date = request.data['departure_date'].strip()

            train_ticket_agency = request.data['train_ticket_agency'].strip()

            # Get Datetime
            route = request.data['route'].strip()

            # Datetime object is passed like this from front end :
            # Sat Jun 26 2021 15:00:00 GMT+0300 (Eastern European Summer Time)
            datetime = departure_date.split('+')[0][:-7]

            if route == "":
                departure_str = datetime + ' - ' + railway_station + ', ' + train_ticket_agency
            else:
                departure_str = datetime + ' - ' + railway_station + ', ' + train_ticket_agency + ', ' + route

            # Get Group
            group = GroupTransfer.objects.get(refcode=refcode)

            # Get previous departure flight string for history
            prev_departure = group.departure

            # If it is the same, do nothing
            if departure_str == prev_departure:
                return Response(data=context, status=200)

            try:
                # departure flight is a charfield
                group.departure_type = 'TRN'
                group.departure = departure_str
                group.save()
                History.objects.create(
                    user=user,
                    model_name='GT',
                    action='UPD',
                    description=f"User : {user.username} updated group's: {group.refcode} departure \
                        from {prev_departure} to {departure_str}"
                )
                context['model'] = GroupSerializer(group).data
            except Exception as a:
                context['errormsg'] = a
                return Response(data=context, status=400)

        update_notifications()
        return Response(data=context, status=200)


class ChangeNumberOfPeople(generics.ListCreateAPIView):
    """
    url : change_number_of_people/(?P<refcode>.*)$
    Descr: Changes Group's number of people
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request, refcode):
        context = {"errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_update(user.id, 'GT'):
            context = {"errormsg": "You do not have permission to update Group's number of people."}
            return Response(status=401, data=context)

        # Get number of people integer
        try:
            number_of_people = request.data['number_of_people']
        except KeyError:
            number_of_people = 0

        # Get Group
        group = GroupTransfer.objects.get(refcode=refcode)

        # Get previous number of people integer
        prev_number_or_people_value = group.number_of_people

        # If it is the same, do nothing
        if number_of_people == prev_number_or_people_value:
            context['model'] = GroupSerializer(group).data
            return Response(data=context, status=200)

        try:
            group.number_of_people = number_of_people
            group.save()
            History.objects.create(
                user=user,
                model_name='GT',
                action='UPD',
                description=f"User : {user.username} updated group's: {group.refcode} number of people from \
                    {prev_number_or_people_value} to {number_of_people}"
            )
            context['model'] = GroupSerializer(group).data
        except Exception as a:
            context['errormsg'] = a
            return Response(data=context, status=400)

        update_notifications()
        return Response(data=context, status=200)


class ChangeEmployeeInfo(generics.ListCreateAPIView):
    """
    url : change_employee_info/(?P<refcode>.*)$
    Descr: Changes Group's Employee Information
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request, refcode):
        context = {"errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_update(user.id, 'GT'):
            context = {"errormsg": "You do not have permission to update Group's Employee Info."}
            return Response(status=401, data=context)

        # Get Employee Info Value
        try:
            employee_info = request.data['employee_info']
        except KeyError:
            employee_info = 'N/A'

        # Get Group
        group = GroupTransfer.objects.get(refcode=refcode)

        # Get previous number of people integer
        prev_employee_info_value = group.employee_info

        # If it is the same, do nothing
        if len(employee_info) > 255:
            context = {"errormsg": "Employee's Info Field cannot exceed 255 characters."}
            return Response(data=context, status=400)

        try:
            group.employee_info = employee_info
            group.save()
            History.objects.create(
                user=user,
                model_name='GT',
                action='UPD',
                description=f"User : {user.username} updated group's: {group.refcode} Employee Info from \
                    {prev_employee_info_value} to {employee_info}"
            )
            context['model'] = GroupSerializer(group).data
        except Exception as a:
            context['errormsg'] = a
            return Response(data=context, status=400)

        return Response(data=context, status=200)


class ChangeGroupsAgent(generics.ListCreateAPIView):
    """
    url : change_groups_agent/(?P<refcode>.*)$
    Descr: Changes Group's Agent
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request, refcode):
        context = {"errormsg": '', "new_refcode": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_update(user.id, 'GT'):
            context = {"errormsg": "You do not have permission to update a Group's agent."}
            return Response(status=401, data=context)

        # Get agent
        agent_name = request.data['agent']
        agent = Agent.objects.get(name=agent_name)

        # Get group
        group = GroupTransfer.objects.get(refcode=refcode)

        # Get previous Agent for logging
        prev_agent_id = group.agent_id
        prev_agent = Agent.objects.get(id=prev_agent_id)

        # We need a string, otherwise we will get a TypeError
        if agent.abbreviation is None:
            agent.abbreviation = ''

        # Replace previous abbreviation of refcode
        if prev_agent.abbreviation is None:
            prev_agent.abbreviation = ''
            new_refcode = refcode[0:4] + agent.abbreviation + refcode[4:]
        else:
            new_refcode = refcode.replace(prev_agent.abbreviation, '')
            new_refcode = new_refcode[0:4] + agent.abbreviation + new_refcode[4:]

        # Validate refcode
        all_refcodes = [i.refcode for i in GroupTransfer.objects.all()]

        if new_refcode in all_refcodes:
            context['errormsg'] = 'Refcode Already Exists.'
            return Response(data=context, status=400)

        try:
            group.agent_id = agent.id
            group.save()

            # Group's refcode also needs to change, when Agent is changed
            group.refcode = new_refcode
            group.save()
            context['new_refcode'] = new_refcode
            History.objects.create(
                user=user,
                model_name='GT',
                action='UPD',
                description=f"User : {user.username} updated group's: {group.refcode} agent from \
                    {prev_agent} to {agent}"
            )

            # try to rename group documents folder
            rl_path = os.path.join(BASE_DIR, 'static', 'files', 'group_documents')
            try:
                os.rename(os.path.join(rl_path, refcode), os.path.join(rl_path, new_refcode))
            except Exception as a:
                print(a)

        except Exception as a:
            context['errormsg'] = a
            return Response(data=context, status=400)
        return Response(data=context, status=200)


class ChangeGroupsClient(generics.ListCreateAPIView):
    """
    url : change_groups_client/(?P<refcode>.*)$
    Descr: Changes Group's Client
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request, refcode):
        context = {"errormsg": '', "new_refcode": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_update(user.id, 'GT'):
            context = {"errormsg": "You do not have permission to update a Group's client."}
            return Response(status=401, data=context)

        # Get Client
        client_name = request.data['client']
        client = Client.objects.get(name=client_name)

        # Get Group
        group = GroupTransfer.objects.get(refcode=refcode)

        # Get previous Client for logging
        prev_client_id = group.client_id
        prev_client = Client.objects.get(id=prev_client_id)

        # We need a string, otherwise we will get a TypeError
        if client.abbreviation is None:
            client.abbreviation = ''

        # Replace previous abbreviation of refcode
        if prev_client.abbreviation is None:
            prev_client.abbreviation = ''
            new_refcode = refcode[0:4] + client.abbreviation + refcode[4:]
        else:
            new_refcode = refcode.replace(prev_client.abbreviation, '')
            new_refcode = new_refcode[0:4] + client.abbreviation + new_refcode[4:]

        try:
            group.client_id = client.id
            group.save()

            # Group's refcode also needs to change, when Client is changed
            group.refcode = new_refcode
            group.save()
            context['new_refcode'] = new_refcode
            History.objects.create(
                user=user,
                model_name='GT',
                action='UPD',
                description=f"User : {user.username} updated group's: {group.refcode} client from \
                    {prev_client} to {client}"
            )
        except Exception as a:
            context['errormsg'] = a
            return Response(data=context, status=400)
        return Response(data=context, status=200)


class ChangeAgentsRefcode(generics.ListCreateAPIView):
    """
    url : change_agents_refcode/(?P<refcode>.*)$
    Descr: Changes Group's Agent Refcode, Group's refcode doesn't change
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request, refcode):
        context = {"errormsg": '', 'agents_refcode': ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_update(user.id, 'GT'):
            context = {"errormsg": "You do not have permission to update a Group's agent refcode."}
            return Response(status=401, data=context)

        # Get Agent's Refcode
        try:
            agents_refcode = request.data['agents_refcode'].strip()
        except Exception:
            agents_refcode = ''

        # Get Group
        group = GroupTransfer.objects.get(refcode=refcode)

        # Get previous agent's refcode for logging
        prev_agents_refcode = group.agents_refcode

        if agents_refcode == prev_agents_refcode:
            context['model'] = GroupSerializer(group).data
            return Response(data=context, status=200)

        # If Agent's refcode is the same, do nothing.
        try:
            group.agents_refcode = agents_refcode
            group.save()
            History.objects.create(
                user=user,
                model_name='GT',
                action='UPD',
                description=f"User : {user.username} updated group's: {group.refcode} agent's refcode from \
                    {prev_agents_refcode} to {agents_refcode}"
            )
            context['model'] = GroupSerializer(group).data
        except Exception as a:
            context['errormsg'] = a
            return Response(data=context, status=400)
        return Response(data=context, status=200)


class ChangeClientsRefcode(generics.ListCreateAPIView):
    """
    url : change_clients_refcode/(?P<refcode>.*)$
    Descr: Changes Group's Client Refcode, Group's refcode doesn't change
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request, refcode):
        context = {"errormsg": '', 'clients_refcode': ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_update(user.id, 'GT'):
            context = {"errormsg": "You do not have permission to update a Group's client refcode."}
            return Response(status=401, data=context)

        # Get Client's refcode
        try:
            clients_refcode = request.data['clients_refcode'].strip()
        except Exception:
            clients_refcode = ''

        # Get Group
        group = GroupTransfer.objects.get(refcode=refcode)

        # Get previous Client's refcode for logging
        prev_clients_refcode = group.clients_refcode

        # If Client's refcode is the same, do nothing.
        if clients_refcode == prev_clients_refcode:
            context['model'] = GroupSerializer(group).data
            return Response(data=context, status=200)
        try:
            group.clients_refcode = clients_refcode
            group.save()
            History.objects.create(
                user=user,
                model_name='GT',
                action='UPD',
                description=f"User : {user.username} updated group's: {group.refcode} client's refcode from \
                    {prev_clients_refcode} to {clients_refcode}"
            )
            context['model'] = GroupSerializer(group).data
        except Exception as a:
            context['errormsg'] = a
            return Response(data=context, status=400)
        return Response(data=context, status=200)


class DeleteGroup(generics.UpdateAPIView):
    """
    url : del_grp/(?P<refcode>.*)$
    Descr: Deletes the group if it doesn't have services
    *** Django rest framework throwed 405 error (method not allowed) when function's
        url was "delete_group/(?<refcode>.*)$" for some reason ***
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request, refcode):
        context = {"errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_delete(user.id, 'GT'):
            context = {"errormsg": "You do not have permission to delete a Group"}
            return Response(status=401, data=context)

        # Get Group
        group = GroupTransfer.objects.get(refcode=refcode)

        try:
            group_to_delete = GroupTransfer.objects.get(refcode=refcode)
            History.objects.create(
                user=user,
                model_name='GT',
                action='DEL',
                description=f"User : {user.username} deleted group with refcode : {group.refcode}"
            )
            group_to_delete.delete()
            context['model'] = GroupSerializer(group).data

        except ProtectedError:
            context['errormsg'] = 'This Group is protected. Remove Group\'s related objects to be able to delete it.'
            return Response(data=context, status=400)

        except Exception as a:
            context['errormsg'] = a
            return Response(data=context, status=400)
        return Response(data=context, status=200)


class ChangeRoomDesc(generics.ListCreateAPIView):
    """
    url : change_room_desc/(?P<refcode>.*)$
    Descr: Changes Group's Room Description
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request, refcode):
        context = {"errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_update(user.id, 'GT'):
            context = {"errormsg": "You do not have permission to update Group's Room Description."}
            return Response(status=401, data=context)

        try:
            room_desc = request.data['room_desc']
        except KeyError:
            room_desc = 0

        # Get Group
        group = GroupTransfer.objects.get(refcode=refcode)

        # Get previous number of people integer
        prev_room_desc_value = group.room_desc

        if len(room_desc) > 255:
            context = {"errormsg": "Room Description Field cannot exceed 255 characters."}
            return Response(data=context, status=400)

        rooms_to_pax = {
            'Single': 1,
            'Double for single use': 1,
            'Double': 2,
            'Twin': 2,
            'Triple': 3,
            'Quad': 4,
            'Suite': 0,
            'Five Bed': 5,
            'Six Bed': 6,
            'Seven Bed': 7,
            'Eight Bed': 8,
        }

        if room_desc:
            # Parsing the input string to extract the number of each room type
            room_counts = {}
            for part in room_desc.split(' // '):
                room_type, count = part.split(': ')
                room_counts[room_type] = int(count)

            # Calculating the total number of pax
            total_pax = sum(count * rooms_to_pax[room_type] for room_type, count in room_counts.items())

            total_pax += int(request.data['suite_values'])

            group.number_of_people = total_pax

        try:
            group.room_desc = room_desc
            group.save()
            History.objects.create(
                user=user,
                model_name='GT',
                action='UPD',
                description=f"User : {user.username} updated group's: {group.refcode} Room Desc from \
                    {prev_room_desc_value} to {room_desc}"
            )
            context['model'] = GroupSerializer(group).data
        except Exception as a:
            context['errormsg'] = a
            return Response(data=context, status=400)

        return Response(data=context, status=200)


class ChangeMealDesc(generics.ListCreateAPIView):
    """
    url : change_meal_desc/(?P<refcode>.*)$
    Descr: Changes Group's Meal Description
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request, refcode):
        context = {"errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_update(user.id, 'GT'):
            context = {"errormsg": "You do not have permission to update Group's Meal Description."}
            return Response(status=401, data=context)

        try:
            meal_desc = request.data['meal_desc']
        except KeyError:
            meal_desc = 'N/A'

        # Get Group
        group = GroupTransfer.objects.get(refcode=refcode)

        # Get previous number of people integer
        prev_meal_desc_value = group.meal_desc

        # If it is the same, do nothing
        if len(meal_desc) > 255:
            context = {"errormsg": "Meal Description Field cannot exceed 255 characters."}
            return Response(data=context, status=400)

        try:
            group.meal_desc = meal_desc
            group.save()
            History.objects.create(
                user=user,
                model_name='GT',
                action='UPD',
                description=f"User : {user.username} updated group's: {group.refcode} Meal Desc from \
                    {prev_meal_desc_value} to {meal_desc}"
            )
            context['model'] = GroupSerializer(group).data
        except Exception as a:
            context['errormsg'] = a
            return Response(data=context, status=400)

        return Response(data=context, status=200)


class ResetItineraryDownload(generics.ListCreateAPIView):
    """
    url : reset_itinerary_download/(?P<refcode>.*)$
    Descr: Resets the itinerary download status to allow re-downloading and editing schedule hotels
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request, refcode):
        context = {"errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_update(user.id, 'GT'):
            context = {"errormsg": "You do not have permission to reset itinerary download status."}
            return Response(status=401, data=context)

        try:
            # Get Group
            group = GroupTransfer.objects.get(refcode=refcode)
            
            # Reset the itinerary_downloaded field to False
            group.itinerary_downloaded = False
            group.save()
            
            History.objects.create(
                user=user,
                model_name='GT',
                action='UPD',
                description=f"User : {user.username} reset itinerary download status for group: {group.refcode}"
            )
            
            context['model'] = GroupSerializer(group).data
            return Response(data=context, status=200)
            
        except GroupTransfer.DoesNotExist:
            context['errormsg'] = 'Group not found'
            return Response(data=context, status=404)
        except Exception as a:
            context['errormsg'] = str(a)
            return Response(data=context, status=400)
