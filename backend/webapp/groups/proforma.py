from webapp.models import (
    GroupTransfer,
    Proforma,
    History,
    Agent,
    Client,
)

from accounts.models import UserProfile
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
import os
from core.settings import BASE_DIR
from webapp.serializers import (
    GroupSerializer,
    ProformaSerializer,
)
from datetime import datetime
from pathlib import Path
from django.core.mail import EmailMultiAlternatives
from accounts.permissions import (
    can_update,
    is_superuser,
    can_delete,
)
from django.http import HttpResponse
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)
from reportlab.lib.styles import (
    getSampleStyleSheet,
    ParagraphStyle
)
from reportlab.platypus import (
    Image,
    Paragraph,
)
from reportlab.lib.enums import (
    TA_CENTER,
    TA_LEFT,
    TA_RIGHT
)
from bs4 import BeautifulSoup


# Function to convert hex color to RGB tuple
def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) / 255.0 for i in (0, 2, 4))


pdfmetrics.registerFont(TTFont('Raleway-Regular', os.path.join(BASE_DIR, 'Raleway-Regular.ttf')))
pdfmetrics.registerFont(TTFont('Raleway-Bold', os.path.join(BASE_DIR, 'Raleway-Bold.ttf')))


"""
    # Proforma

    - CreateProforma
    - ChangeProformaDate
    - ChangeProformaPayableUntil
    - ChangeProformaBanks
    - ChangeTableText
    - DownloadProforma
    - SendProforma
"""


bank_opts = {
  'EUR METROBANK GB':   {
    'Bank Name': 'METRO BANK',
    'Branch': '160-166 KENSINGTON HIGH STREET, LONDON W8 7RG',
    'Account Holder': 'COSMOPLAN INTERNATIONAL TRAVEL LTD',
    'Account Number': '46346750',
    'IBAN': 'GB15 MYMB 2305 8046 3467 50',
    'Sort Code': '23-05-80',
    'SWIFT': 'MYMBGB2L ',
  },

  'GBP METROBANK GB':   {
    'Bank Name': 'METRO BANK',
    'Branch': '160-166 KENSINGTON HIGH STREET, LONDON W8 7RG',
    'Account Holder': 'COSMOPLAN INTERNATIONAL TRAVEL LTD',
    'Account Number': '46346920',
    'IBAN': 'GB81 MYMB 2305 8046 3469 20',
    'Sort Code': '23-05-80',
    'SWIFT': 'MYMBGB2L',
  },

  'EUR METROBANK EB':   {
    'Bank Name': 'METRO BANK',
    'Branch': '160-166 KENSINGTON HIGH STREET, LONDON W8 7RG',
    'Account Holder': 'COSMOPLAN INTERNATIONAL TRAVEL LTD',
    'Account Number': '46034872',
    'IBAN': 'GB54 MYMB 2305 8046 0348 72',
    'Sort Code': '230580',
    'SWIFT': 'MYMBGB2L',
  },

  'GBP METROBANK EB':   {
    'Bank Name': 'METRO BANK',
    'Branch': '160-166 KENSINGTON HIGH STREET, LONDON W8 7RG',
    'Account Holder': 'COSMOPLAN INTERNATIONAL TRAVEL LTD',
    'Account Number': '46034686',
    'IBAN': 'GB32 MYMB 2305 8046 0346 86',
    'Sort Code': '230580',
    'SWIFT': 'MYMBGB2L',
  },

  'EUR HSBC':           {
    'Bank Name': 'HSBC',
    'Branch': '50-52 KILBURN HIGH RD, NORTH MAIDA VALE, LONDON LW6 4HJ',
    'Account Number': '71999239',
    'IBAN': 'GB27 HBUK 4012 7671 9992 39',
    'SWIFT': 'HBUKGB4B',
  },

  'GBP HSBC':           {
    'Bank Name': 'HSBC',
    'Branch': '50-52 KILBURN HIGH RD, NORTH MAIDA VALE, LONDON LW6 4HJ',
    'Account Number': '81703005',
    'IBAN': 'GB45 HBUK 4004 0481 7030 05',
    'SWIFT': 'HBUKGB4141D',
  },

  'EUR ALPHABANK':      {
    'Bank Name': 'ALPHA BANK',
    'Branch': '6 FILELLINON STREET, ATHENS 10557',
    'Account Holder': 'COSMOPLAN INTERNATIONAL TRAVEL LTD GREEK BRANCH',
    'Account Number': '0026.0207.65.02011749481',
    'IBAN': 'GR 50 0140 1200 1200 0200 2033 252',
    'SWIFT': 'CRBAGRAA XXX',
  },

  'EUR EUROBANK':       {
    'Bank Name': 'EUROBANK',
    'Branch': '19 KALLIROIS AVENUE, ATHENS 11743',
    'Account Holder': 'COSMOPLAN INTERNATIONAL TRAVEL LTD GREEK BRANCH',
    'Account Number': '0026.0207.65.02011749481',
    'IBAN': 'GR 44 0260 2070 0006 5020 1749 481 ',
    'SWIFT': 'ERBKGRAA',
  },

  'EUR PIREAUS': {
    'Bank Name': 'PIREAUS BANK',
    'Branch': 'AMERIKIS 4 STREET, ATHENS 10564',
    'Account Number': '5794 1070 28026',
    'IBAN': 'GR 98 0172 7940 0057 9410 7028 026',
    'SWIFT': 'PIRBGRAA',
  },

  'EUR NBG': {
    'Bank Name': 'NBG',
    'Branch': '38 STADIOU STREET, ATHENS 10564',
    'Account Number': '08001416075',
    'IBAN': 'GR 62 0110 0800 0000 0800 1416 075',
    'SWIFT': 'ETHNGRAA',
    },
}

BASE_DIR = Path(__file__).resolve().parent.parent.parent


def reformat_flight_info(flight_info):
    try:
        # Split the input string into its components
        parts = flight_info.split(' - ')
        
        # Check if we have at least 3 parts (date, flight number, departure)
        if len(parts) < 3:
            print(f"Invalid flight info format. Expected at least 3 parts, got {len(parts)}")
            return "N/A"
            
        # Extract date and time
        date_time_str = parts[0]
        
        # Extract flight number
        flight_number = parts[1]
        
        # Extract departure code
        departure_code = parts[2]
        
        # Extract destination and terminal if available
        destination = parts[3] if len(parts) > 3 else ""
        terminal = parts[4] if len(parts) > 4 else ""

        # Parse the date and time
        try:
            date_obj = datetime.strptime(date_time_str, "%a %b %d %Y %H:%M")
            formatted_date = date_obj.strftime("%d %B %Y")
            formatted_time = date_obj.strftime("%I:%M %p").lower()
        except ValueError:
            try:
                date_obj = datetime.strptime(date_time_str, "%a %b %d %Y")
                formatted_date = date_obj.strftime("%d %B %Y")
                formatted_time = ""
            except ValueError as e:
                print(f"Error parsing date: {str(e)}")
                return "N/A"

        # Combine the formatted date, time (if available), and flight details
        if formatted_time:
            formatted_flight_info = f"{formatted_date} - Flight: {flight_number} {formatted_time} - {departure_code}"
        else:
            formatted_flight_info = f"{formatted_date} - Flight: {flight_number} - {departure_code}"

        # Add destination if available
        if destination:
            formatted_flight_info += f" - {destination}"

        # Add terminal information if available
        if terminal:
            formatted_flight_info += f" - {terminal}"

        return formatted_flight_info

    except Exception as e:
        print(f"Error formatting flight info: {str(e)}")
        return "N/A"


# Get user from token
def get_user(token):
    return Token.objects.get(key=token).user


def generate_proforma_pdf(group, refcode):
    pdftitle = os.path.join(BASE_DIR, 'static', 'proformas', f'{refcode}_proforma.pdf')
    parts = []

    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name='Center', alignment=TA_CENTER))
    styles.add(ParagraphStyle(name='Left', alignment=TA_LEFT))
    styles.add(ParagraphStyle(name='Right', alignment=TA_RIGHT))

    logo = os.path.join(BASE_DIR, 'static', 'images', 'logos', 'cosmoplan_logo.jpg')
    UK_stamp = os.path.join(BASE_DIR, 'static', 'images', 'stamps', 'Stamp_UK.png')
    GR_stamp = os.path.join(BASE_DIR, 'static', 'images', 'stamps', 'Stamp_GR.png')

    im = Image(logo, 3.2 * inch, 0.9 * inch, hAlign='LEFT')
    uk_stamp_im = Image(UK_stamp, 2 * inch, 2 * inch, hAlign='LEFT')
    gr_stamp_im = Image(GR_stamp, 2 * inch, 2 * inch, hAlign='LEFT')

    init_table_data = [
        ['', 'Athens Office: ', 'London Office: ', '', ],
        ['', '10 Xenofontos Street,', '105-109 Sumatra Road,', '', ],
        ['', 'Syntagma, Athens, 10557', 'London, NW6 1PL', '', ],
        ['', 'Tel: +30 210 9219400', 'Tel: +44 2081436880', '', ],
        ['', 'https://cosmoplan.gr', 'https://cosmoplan.co.uk', '', im]
    ]

    table = Table(
        init_table_data,
        rowHeights=14,
        colWidths=[150, 140, 100, 70, 400],
        style=[
            ('FONT', (0, 0), (2, 0), 'Raleway-Bold', 9),
            ('FONT', (1, 1), (2, 6), 'Raleway-Regular', 9),
            ("VALIGN", (3, 3), (3, 3), "MIDDLE"),
            ('TEXTCOLOR', (0, 4), (2, 4), colors.blue),
        ]
    )

    parts.append(table)
    parts.append(Spacer(3, 30))
    parts.append(Paragraph('<font size=16><b>PROFORMA INVOICE</b></font>', styles["Center"]))
    parts.append(Spacer(3, 30))

    address = group.proforma.address if group.proforma.address else ''
    tel = group.proforma.tel if group.proforma.address else ''
    email = group.proforma.email if group.proforma.address else ''

    agent_or_client_name = group.agent.name if group.agent else group.client.name
    customers_refcode = group.agents_refcode if group.agent else group.clients_refcode

    init_table_data = [
        [f'Date: {group.proforma.date.strftime("%d %B %Y")}', ''],
        ['', ''],
        ['Customer: ', ''],
        [agent_or_client_name, ''],
    ]
    if address:
        init_table_data.append([address, ''])
    if tel:
        init_table_data.append([tel, ''])
    if email:
        init_table_data.append([email, ''])

    table = Table(
        init_table_data,
        rowHeights=14,
        colWidths=[440, 120],
        style=[
            ('FONT', (0, 0), (-1, -1), 'Helvetica', 10),
            ('FONT', (0, 2), (0, 2), 'Raleway-Bold', 10),
        ]
    )
    parts.append(table)
    parts.append(Spacer(2, 20))

    parts.append(Paragraph('<font size=12><b><u>Description</u></b></font>', styles["Center"]))
    parts.append(Spacer(3, 30))

    init_table_data = [
        ['Our Reference: ', group.refcode, "Customer's Reference: ", customers_refcode or 'N/A'],
    ]

    table = Table(
        init_table_data,
        rowHeights=12,
        colWidths=[80, 140, 120, 230],
        style=[
            ('FONT', (0, 0), (4, 4), 'Raleway-Bold', 10),
        ]
    )

    parts.append(table)
    parts.append(Spacer(2, 20))

    if group.arrival is not None or group.arrival != 'N/A' or group.arrival != '':
        arrival = reformat_flight_info(group.arrival.split(", ")[0])
    else:
        arrival = 'N/A'

    if group.departure is not None or group.departure != 'N/A' or group.departure != '':
        departure = reformat_flight_info(group.departure.split(", ")[0])
    else:
        departure = 'N/A'

    if group.room_desc is not None:
        room_desc = group.room_desc.replace("//", '   ')
    else:
        room_desc = 'N/A'

    init_table_data = [
        ['', ''],
        ['Arrival: ', arrival],
        ['Departure: ', departure],
        ['', ''],
        ['Room Description:  ', room_desc]
    ]
    table = Table(
        init_table_data,
        rowHeights=12,
        colWidths=[90, 460],
    )
    parts.append(table)
    parts.append(Spacer(2, 20))

    soup = BeautifulSoup(group.proforma.table_text, "html.parser")
    table_data = []
    for row in soup.find_all("tr"):
        cols = row.find_all(["td", "th"])
        cols = [ele.text.strip() for ele in cols]
        table_data.append(cols)

    table = Table(
        table_data,
        rowHeights=18,
        colWidths=[50, 240, 60, 110, 80],
    )

    # Calculate the number of rows in the table
    num_rows = len(table_data)

    table.setStyle(TableStyle([

        # Last Line
        ('LINEABOVE', (0, num_rows-1), (-1, num_rows-1), 1, colors.black),
        ('FONTNAME', (0, num_rows-1), (-1, num_rows-1), 'Raleway-Bold'),
        ('FONTSIZE', (0, num_rows-1), (-1, num_rows-1), 11),

        # Headers
        ('FONTNAME', (0, 0), (-1, 0), 'Raleway-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),

        # Rest Of Table
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTSIZE', (0, 0), (-1, 0), 11),

        # Total: cell
        ('ALIGN', (-2, -1), (-2, -1), 'RIGHT'),
    ]))

    parts.append(table)
    parts.append(Spacer(4, 40))

    human_readable_date = datetime.strptime(group.proforma.payable_until.strftime("%Y-%m-%d"), "%Y-%m-%d").strftime("%A %d %B %Y").replace(
        str(int(group.proforma.payable_until.strftime("%d"))),
        str(int(group.proforma.payable_until.strftime("%d"))) + (
            "th" if 11 <= int(group.proforma.payable_until.strftime("%d")) <= 13 else {
                1: "st", 2: "nd", 3: "rd"}.get(int(group.proforma.payable_until.strftime("%d")) % 10, "th")))

    parts.append(Paragraph(f"<font size=11 color='red' ><b><u>Please note that 100% of the total amount is payable before {human_readable_date}</u></b></font>", styles["Left"]))
    parts.append(Spacer(4, 40))

    parts.append(Paragraph('<font size=12><b>BANK DETAILS</b></font>', styles["Left"]))
    parts.append(Spacer(2, 20))

    if group.refcode.startswith('COA'):
        stamp = gr_stamp_im
    else:
        stamp = uk_stamp_im

    for bank in group.proforma.banks.split(", "):

        init_table_data = []
        for obj in bank_opts[bank]:
            init_table_data.append([obj, bank_opts[bank][obj], '', '', ''])
        init_table_data.append(['', '', '', stamp, ''])
        table = Table(
            init_table_data,
            rowHeights=13,
            colWidths=[100, 200, 100, 80, 80],
            style=[
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Raleway-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 9),
            ]
        )
        parts.append(table)

    doc = SimpleDocTemplate(
        pdftitle,
        pagesize=(8.27 * inch, 11.69 * inch),
        rightMargin=20,
        leftMargin=20,
        topMargin=20,
        bottomMargin=20,
    )
    doc.build(parts)

    return pdftitle


class CreateProforma(generics.ListCreateAPIView):
    """
    url : create_proforma/(?P<refcode>.*)$
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request):
        context = {"errormsg": ''}

        # Get description
        date = request.data['date'].strip()
        payable_until = request.data['payable_until'].strip()
        banks = request.data['banks'].strip()
        group = GroupTransfer.objects.get(id=request.data['group'])

        if group.agent:
            try:
                customer = Agent.objects.get(id=group.agent_id)
            except Agent.DoesNotExist:
                context['errormsg'] = 'Agent with the given ID does not exist.'
                return Response(data=context, status=400)
        else:
            try:
                customer = Client.objects.get(id=group.client_id)
            except Client.DoesNotExist:
                context['errormsg'] = 'Client with the given ID does not exist.'
                return Response(data=context, status=400)

        email = customer.contact.email if customer.contact and customer.contact.email else None
        address = customer.contact.address if customer.contact and customer.contact.address else None
        tel = customer.contact.tel if customer.contact and customer.contact.tel else None

        try:
            proforma = Proforma.objects.create(
                date=date,
                payable_until=payable_until,
                banks=banks,
                address=address,
                email=email,
                tel=tel,
                table_text=request.data['table_text'],
            )
            proforma.save()
            group.proforma_id = proforma.id
            group.save()
        except Exception as a:
            context['errormsg'] = a
            return Response(data=context, status=400)
        context['model'] = GroupSerializer(group).data
        return Response(data=context, status=200)


class ChangeProformaDate(generics.ListCreateAPIView):
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
        if not can_update(user.id, 'PRO') or not is_superuser(user.id):
            context = {"errormsg": "You do not have permission to update a proforma's date."}
            return Response(status=401, data=context)

        group = GroupTransfer.objects.get(refcode=refcode)

        proforma = Proforma.objects.get(id=group.proforma_id)
        proforma.date = request.data['date']
        proforma.save()

        History.objects.create(
            user=user,
            model_name='PRO',
            action='UPD',
            description=f"User : {user.username} updated proforma's date of group: \
                {group.refcode} to {request.data['date']}"
        )
        context['model'] = GroupSerializer(group).data
        return Response(data=context, status=200)


class ChangeProformaPayableUntil(generics.ListCreateAPIView):
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
        if not can_update(user.id, 'PRO') or not is_superuser(user.id):
            context = {"errormsg": "You do not have permission to update a proforma's payable until date."}
            return Response(status=401, data=context)

        group = GroupTransfer.objects.get(refcode=refcode)

        proforma = Proforma.objects.get(id=group.proforma_id)
        proforma.payable_until = request.data['payable_until']
        proforma.save()

        History.objects.create(
            user=user,
            model_name='PRO',
            action='UPD',
            description=f"User : {user.username} updated proforma's payable until date of group: \
                {group.refcode} to {request.data['payable_until']}"
        )
        context['model'] = GroupSerializer(group).data
        return Response(data=context, status=200)


class ChangeProformaBanks(generics.ListCreateAPIView):
    """
    URL : change_proforma_banks/(?P<refcode>.*)$
    Descr: Changes proforma's Banks
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request, refcode):
        context = {"errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_update(user.id, 'PRO') or not is_superuser(user.id):
            context = {"errormsg": "You do not have permission to update a proforma's banks."}
            return Response(status=401, data=context)

        group = GroupTransfer.objects.get(refcode=refcode)
        proforma = Proforma.objects.get(id=group.proforma_id)
        banks = [key for key, value in request.data['banks'].items() if value]

        proforma.banks = ', '.join(banks)
        proforma.save()

        History.objects.create(
            user=user,
            model_name='PRO',
            action='UPD',
            description=f"User : {user.username} updated proforma's banks of group: {group.refcode} to {banks}"
        )
        context['model'] = GroupSerializer(group).data
        return Response(data=context, status=200)


class DownloadProforma(generics.ListAPIView):
    """
    URL: download_proforma_pdf/(?P<refcode>.*)$
    """

    @csrf_exempt
    def get(self, request, refcode):
        group = GroupTransfer.objects.get(refcode=refcode)
        pdftitle = generate_proforma_pdf(group, refcode)

        with open(pdftitle, 'rb') as f:
            pdf_contents = f.read()

        filename = refcode + '_proforma.pdf'
        response = HttpResponse(pdf_contents, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename={filename}'
        return response


class SendProforma(generics.ListAPIView):
    """
    URL: send_proforma/
    Descr: Used on Groups/Proforma Invoices to send the proforma to the agent.
    """

    @csrf_exempt
    def post(self, request):
        context = {"request": request, "errormsg": '', 'recipients': []}
        token_str = request.headers['User-Token']
        user = get_user(token_str)
        user_profile = UserProfile.objects.get(user_id=user.id)
        refcode = request.data['refcode']
        message = request.data['body']
        recipients = []
        extra_recipients = request.data['recipients']

        for extra_recipient in extra_recipients.split(";"):
            if extra_recipient.strip():
                recipients.append(extra_recipient.strip())

        context = {"recipients": recipients}

        for recipient in recipients:
            if recipient in ('N/A', '', ' ', None):
                continue

            send_to = recipient.strip()
            send_from = user.email
            subject = request.data['subject']
            message = request.data['body']

            try:
                message += user_profile.signature
            except TypeError:
                pass

            msg = EmailMultiAlternatives(subject, message, send_from, [send_to])
            msg.attach_alternative(message, "text/html")

            # Generate and attach the PDF file
            group = GroupTransfer.objects.get(refcode=refcode)
            pdftitle = generate_proforma_pdf(group, refcode)
            with open(pdftitle, 'rb') as pdf_file:
                msg.attach(f'{refcode}_proforma.pdf', pdf_file.read(), 'application/pdf')

            # Handle other attachments
            try:
                uploaded_file = request.FILES.get('file')
                if uploaded_file:
                    msg.attach(uploaded_file.name, uploaded_file.read(), uploaded_file.content_type)
            except Exception as e:
                print(e)

            History.objects.create(
                user=user,
                action='UPD',
                model_name='USR',
                description=f'User : {user.username} sent proforma to : {send_to} with subject: {subject}'
            )

            try:
                msg.send()
            except Exception:
                pass

        return Response(status=200, data=context)


class IssueProforma(generics.ListCreateAPIView):
    """
    URL : issue_proforma/(?P<refcode>.*)$
    Descr: Issues Proforma
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request, refcode):
        context = {"errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_update(user.id, 'PRO') or not is_superuser(user.id):
            context = {"errormsg": "You do not have permission to issue a proforma."}
            return Response(status=401, data=context)

        group = GroupTransfer.objects.get(refcode=refcode)
        proforma = Proforma.objects.get(id=group.proforma_id)

        proforma.address = request.data['address']
        proforma.tel = request.data['tel']
        proforma.email = request.data['email']
        proforma.date = request.data['date']
        proforma.payable_until = request.data['payable_until']
        proforma.banks = request.data['banks']
        proforma.table_text = request.data['table_text']
        proforma.is_issued = True
        proforma.save()

        History.objects.create(
            user=user,
            model_name='PRO',
            action='UPD',
            description=f"User : {user.username} issued Proforma of group: {group.refcode}"
        )
        context['proforma'] = ProformaSerializer(proforma).data
        return Response(data=context, status=200)


class CancelProforma(generics.ListCreateAPIView):
    """
    URL : issue_proforma/(?P<refcode>.*)$
    Descr: Issues Proforma
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request, refcode):
        context = {"errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_delete(user.id, 'PRO') or not is_superuser(user.id):
            context = {"errormsg": "You do not have permission Cancel a proforma."}
            return Response(status=401, data=context)

        group = GroupTransfer.objects.get(refcode=refcode)
        proforma = Proforma.objects.get(id=group.proforma_id)

        proforma.date = datetime.today().date()
        proforma.payable_until = datetime.today().date()

        if group.refcode.startswith('COA'):
            proforma.banks = 'EUR METROBANK GB'
        else:
            proforma.banks = 'GBP METROBANK EB'

        if group.agent:
            proforma.address = group.agent.contact.address
            proforma.tel = group.agent.contact.tel
            proforma.email = group.agent.contact.email
        else:
            proforma.address = ''
            proforma.tel = ''
            proforma.email = ''

        proforma.table_text = ''
        proforma.is_issued = False
        proforma.save()

        try:
            History.objects.create(
                user=user,
                model_name='PRO',
                action='DEL',
                description=f"User : {user.username} cancelled group's: {group.refcode} proforma"
            )
            context['proforma'] = ProformaSerializer(proforma).data
        except Exception as a:
            context['errormsg'] = a
            return Response(data=context, status=400)

        return Response(data=context, status=200)
