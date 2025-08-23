# from django.shortcuts import render
from webapp.models import (
    History,
    Payment,
    PaymentOrder,
    Deposit,
    Agent,
    Airline,
    CoachOperator,
    CruisingCompany,
    DMC,
    FerryTicketAgency,
    Guide,
    Hotel,
    RepairShop,
    Restaurant,
    SportEventSupplier,
    TeleferikCompany,
    Contact,
    Theater,
    TrainTicketAgency,
)
from webapp.serializers import (
    PaymentOrderSerializer,
    PaymentSerializer,
    DepositSerializer,
)
from django.db.models import Sum
import os
from core.settings import BASE_DIR
from reportlab.platypus import (
    Image,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
)
from textwrap import wrap
from django.http import HttpResponse
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authtoken.models import Token
from rest_framework import generics
import datetime
from rest_framework.response import Response
from accounts.permissions import (can_view, can_delete)
import qrcode
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

pdfmetrics.registerFont(TTFont('Raleway-Regular', os.path.join(BASE_DIR, 'Raleway-Regular.ttf')))
pdfmetrics.registerFont(TTFont('Raleway-Bold', os.path.join(BASE_DIR, 'Raleway-Bold.ttf')))


def create_qr_code(link, filename):
    # Create the directory if it doesn't exist
    os.makedirs(os.path.dirname(filename), exist_ok=True)

    # Create QR code instance
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )

    # Add data to QR code
    qr.add_data(link)
    qr.make(fit=True)

    # Create an image from the QR code instance
    img = qr.make_image(fill_color="black", back_color="white")

    # Save the image
    img.save(filename)


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

SUPPLIER_TYPES = {
  'SES': 'Sport Event Supplier',
  'TC': 'Teleferik Company',
  'TL': 'Tour Leader',
  'TH': 'Theater',
  'TTA': 'Train Ticket Agency',
}


def get_supplier_by_name_and_type(supplier_name, supplier_type):
    supplier = None
    if supplier_type == 'AG':
        supplier = Agent.objects.get(name=supplier_name)
    elif supplier_type == 'AL':
        supplier = Airline.objects.get(name=supplier_name)
    elif supplier_type == 'CO':
        supplier = CoachOperator.objects.get(name=supplier_name)
    elif supplier_type == 'CC':
        supplier = CruisingCompany.objects.get(name=supplier_name)
    elif supplier_type == 'DMC':
        supplier = DMC.objects.get(name=supplier_name)
    elif supplier_type == 'FTA':
        supplier = FerryTicketAgency.objects.get(name=supplier_name)
    elif supplier_type == 'GD':
        supplier = Guide.objects.get(name=supplier_name)
    elif supplier_type == 'HTL':
        supplier = Hotel.objects.get(name=supplier_name)
    elif supplier_type == 'RS':
        supplier = RepairShop.objects.get(name=supplier_name)
    elif supplier_type == 'RST':
        supplier = Restaurant.objects.get(name=supplier_name)
    elif supplier_type == 'SES':
        supplier = SportEventSupplier.objects.get(name=supplier_name)
    elif supplier_type == 'TC':
        supplier = TeleferikCompany.objects.get(name=supplier_name)
    elif supplier_type == 'TL':
        supplier = Contact.objects.filter(type='L').get(name=supplier_name)
    elif supplier_type == 'TH':
        supplier = Theater.objects.get(name=supplier_name)
    elif supplier_type == 'TTA':
        supplier = TrainTicketAgency.objects.get(name=supplier_name)
    return supplier


# Returns user instance
def get_user(token):
    user = Token.objects.get(key=token).user
    return user


class GetPaymentOrder(generics.ListAPIView):
    """
    URL: get_payment_order/
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

        context = {"request": request, "errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Get date
        selected_date = request.GET.get('selected_date')

        # Validate date
        if selected_date == 'Invalid date':
            selected_date = datetime.date.today()

        payment_order_uk, created = PaymentOrder.objects.get_or_create(date=selected_date, branch='UK')
        payment_order_gr, created = PaymentOrder.objects.get_or_create(date=selected_date, branch='GR')

        serializer_uk = PaymentOrderSerializer(payment_order_uk)
        serializer_gr = PaymentOrderSerializer(payment_order_gr)

        # Return table data
        return Response({
            'payment_order_uk': serializer_uk.data,
            'payment_order_gr': serializer_gr.data,
        })


class DownloadPaymentOrder(generics.ListAPIView):
    """
    URL: download_payment_order/
    """

    @csrf_exempt
    def get(self, request):

        # File is also stored in file system on the same path
        pdftitle = os.path.join(BASE_DIR, 'static', 'payment_orders', 'payment_order_' + datetime.datetime.now().strftime("%d-%m-%Y") + '.pdf')

        parts = []

        # Icons
        europe_icon = os.path.join(BASE_DIR, 'static', 'images', 'flags', 'eu.png')
        europe_im = Image(europe_icon, 0.6 * inch, 0.4 * inch,  hAlign='LEFT')

        gb_icon = os.path.join(BASE_DIR, 'static', 'images', 'flags', 'gb.png')
        gb_im = Image(gb_icon, 0.6 * inch, 0.4 * inch,  hAlign='LEFT')

        sw_icon = os.path.join(BASE_DIR, 'static', 'images', 'flags', 'sw.png')
        sw_im = Image(sw_icon, 0.6 * inch, 0.4 * inch,  hAlign='LEFT')

        gr_icon = os.path.join(BASE_DIR, 'static', 'images', 'flags', 'gr.png')
        gr_im = Image(gr_icon, 0.6 * inch, 0.4 * inch,  hAlign='LEFT')

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
                ('FONT', (0, 0), (-1, -1), 'Raleway-Regular', 10),         # Athens Office: // London Office:
                ('FONT', (0, 0), (4, 0), 'Raleway-Bold', 16),      # Cosmoplan International Travel LTD. ( 1st row )
                ("VALIGN", (4, 3), (4, 3), "MIDDLE"),                # Logo Image
                ('TEXTCOLOR', (0, 6), (4, 6), colors.blue),          # Links // cosmoplan.co.uk // cosmoplan.gr
            ]
        )
        parts.append(table)
        parts.append(Spacer(1, 10))
        date = request.GET['date']
        branch = request.GET['branch']
        payment_order = PaymentOrder.objects.get(date=date, branch=branch)

        if branch == 'UK':
            parts.append(gb_im)
            # parts.append(Spacer(1, 10))
            # parts.append(Paragraph(f'Cosmoplan International Travel LTD Payment Orders for {date}', styles["Left"]))
        else:
            parts.append(gr_im)
            # parts.append(Spacer(1, 10))
            # parts.append(Paragraph(f'Cosmoplan International Travel LTD Greek Branch Payment Orders for {date}', styles["Left"]))

        parts.append(Spacer(1, 10))

        all_deposits = payment_order.deposits.all()

        eu_deposits = all_deposits.filter(payment__currency='EUR').order_by('payment__date_of_service')
        gbp_deposits = all_deposits.filter(payment__currency='GBP').order_by('payment__date_of_service')
        chf_deposits = all_deposits.filter(payment__currency='CHF').order_by('payment__date_of_service')

        if eu_deposits.exists():
            init_table_data = [['Payment Order EUR', europe_im]]
            table = Table(
                init_table_data,
                style=[
                    ('FONT', (0, 0), (0, 0), 'Raleway-Bold', 16),
                    ('VALIGN', (0, 0), (0, 0), 'MIDDLE'),
                ]
            )
            parts.append(table)
            parts.append(Spacer(2, 20))

            init_table_data = [['Company', 'Amount', 'Document', 'Bank', 'Date', 'Group Ref'],]
            # Create a table for EUR
            for deposit in eu_deposits:
                if deposit.payment.proforma:
                    document = 'Proforma: ' + deposit.payment.proforma.name
                elif deposit.payment.invoice:
                    document = 'Invoice: ' + deposit.payment.invoice.name
                else:
                    document = 'N/A'
                init_table_data.append([
                    "\n".join(wrap(deposit.payment.supplier, 36)),
                    f"€ {'{:.2f}'.format(deposit.amount)}",
                    "\n".join(wrap(document, 24)),
                    BANKS[deposit.bank],
                    deposit.payment.date_of_service.strftime("%d-%m-%Y"),
                    deposit.payment.group_transfer.refcode
                ])

            table = Table(
                init_table_data,
                colWidths=[180, 60, 110, 60, 60, 100],
                style=[
                    ('FONT', (0, 0), (-1, -1), 'Raleway-Regular', 8),
                    ('FONT', (0, 0), (-1, 0), 'Raleway-Bold', 10),
                    ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
                    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                    ('GRID', (0, 0), (-1, -1), 1, colors.black),
                ]
            )
            parts.append(table)
            parts.append(Spacer(2, 20))

        if gbp_deposits.exists():
            init_table_data = [['Payment Order GBP', gb_im]]
            table = Table(
                init_table_data,
                style=[
                    ('FONT', (0, 0), (0, 0), 'Raleway-Bold', 16),
                    ('VALIGN', (0, 0), (0, 0), 'MIDDLE'),
                ]
            )
            parts.append(table)
            parts.append(Spacer(1, 10))

            init_table_data = [['Company', 'Amount', 'Document', 'Bank', 'Date', 'Group Ref'],]
            # Create a table for EUR
            for deposit in gbp_deposits:
                if deposit.payment.proforma:
                    document = 'Proforma: ' + deposit.payment.proforma.name
                elif deposit.payment.invoice:
                    document = 'Invoice: ' + deposit.payment.invoice.name
                else:
                    document = 'N/A'
                init_table_data.append([
                    "\n".join(wrap(deposit.payment.supplier, 36)),
                    f"£ {'{:.2f}'.format(deposit.amount)}",
                    "\n".join(wrap(document, 24)),
                    BANKS[deposit.bank],
                    deposit.payment.date_of_service.strftime("%d-%m-%Y"),
                    deposit.payment.group_transfer.refcode
                ])

            table = Table(
                init_table_data,
                colWidths=[180, 60, 110, 60, 60, 100],
                style=[
                    ('FONT', (0, 0), (-1, -1), 'Raleway-Regular', 8),
                    ('FONT', (0, 0), (-1, 0), 'Raleway-Bold', 10),
                    ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
                    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                    ('GRID', (0, 0), (-1, -1), 1, colors.black),
                ]
            )
            parts.append(table)
            parts.append(Spacer(2, 20))

        if chf_deposits.exists():
            init_table_data = [['Payment Order CHF', sw_im]]
            table = Table(
                init_table_data,
                colWidths=[180, 60, 110, 60, 60, 100],
                style=[
                    ('FONT', (0, 0), (0, 0), 'Raleway-Bold', 16),
                    ('VALIGN', (0, 0), (0, 0), 'MIDDLE'),
                ]
            )
            parts.append(table)
            parts.append(Spacer(1, 10))

            init_table_data = [['Company', 'Amount', 'Document', 'Bank', 'Date', 'Group Ref'],]
            # Create a table for EUR
            for deposit in chf_deposits:
                if deposit.payment.proforma:
                    document = 'Proforma: ' + deposit.payment.proforma.name
                elif deposit.payment.invoice:
                    document = 'Invoice: ' + deposit.payment.invoice.name
                else:
                    document = 'N/A'
                init_table_data.append([
                    "\n".join(wrap(deposit.payment.supplier, 36)),
                    f"€ {'{:.2f}'.format(deposit.amount)}",
                    "\n".join(wrap(document, 24)),
                    BANKS[deposit.bank],
                    deposit.payment.date_of_service.strftime("%d-%m-%Y"),
                    deposit.payment.group_transfer.refcode
                ])

            table = Table(
                init_table_data,
                style=[
                    ('FONT', (0, 0), (-1, -1), 'Raleway-Regular', 8),
                    ('FONT', (0, 0), (-1, 0), 'Raleway-Bold', 10),
                    ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
                    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                    ('GRID', (0, 0), (-1, -1), 1, colors.black),
                ]
            )
            parts.append(table)
            parts.append(Spacer(2, 20))

        init_table_data = [['Supplier Payment Details']]
        table = Table(
            init_table_data,
            colWidths=[100, 100, 100, 100],
            style=[
                ('FONT', (0, 0), (0, 0), 'Raleway-Bold', 16),
                ('VALIGN', (0, 0), (0, 0), 'MIDDLE'),
            ]
        )
        parts.append(table)
        parts.append(Spacer(1, 10))

        init_table_data = [['Company', 'Address', 'Iban', 'Swift'],]
        suppliers = []
        for deposit in all_deposits:
            suppliers.append(deposit.payment.supplier)
            supplier = get_supplier_by_name_and_type(deposit.payment.supplier, deposit.payment.supplier_type)

            if supplier is not None:
                name = supplier.name
                address = supplier.contact.address
                iban = supplier.payment_details.iban if supplier.payment_details.iban else 'N/A'
                swift = supplier.payment_details.swift if supplier.payment_details.swift else 'N/A'
            else:
                name = 'N/A'
                address = 'N/A'
                iban = 'N/A'
                swift = 'N/A'

            init_table_data.append(["\n".join(wrap(name, 36)), "\n".join(wrap(address, 36)), "\n".join(wrap(iban, 36)), "\n".join(wrap(swift, 36)),])

        table = Table(
            init_table_data,
            colWidths=[180, 180, 120, 90],
            style=[
                ('FONT', (0, 0), (-1, -1), 'Raleway-Regular', 8),
                ('FONT', (0, 0), (-1, 0), 'Raleway-Bold', 10),
                ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ]
        )
        parts.append(table)
        parts.append(Spacer(2, 20))

        parts.append(Paragraph('This Document has been automatically created by Group Plan®.', styles["Center"]))
        parts.append(Paragraph("Print Date : " + str(datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")), styles["Center"]))

        # date_str = datetime.datetime.now().strftime("%d-%m-%Y")
        # file_path = os.path.join(BASE_DIR, 'static', 'qrcodes', 'payment_orders', date_str, 'payment_order_qrcode.png')
        # create_qr_code('https://groupplan.gr/financial/payment_orders', file_path)

        # qrImg = Image(file_path, 1 * inch, 1 * inch,  hAlign='LEFT')

        # adding QR code
        # parts.append(qrImg)

        doc = SimpleDocTemplate(
            pdftitle,
            pagesize=(8.27 * inch, 11.69 * inch),  # Reversed
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
        filename = 'payment_order_' + datetime.datetime.now().strftime("%d-%m-%Y") + '.pdf'
        temp = HttpResponse(pdf_contents, content_type='application/pdf')
        temp['Content-Disposition'] = 'attachment; filename=' + filename
        return temp


class GetPaymentsByDaterange(generics.ListAPIView):
    """
    URL: get_payments_by_daterange/
    """

    @csrf_exempt
    def get(self, request):
        context = {"request": request, "errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_view(user.id, 'GT'):
            context = {"errormsg": "You do not have permission to view Payments."}
            return Response(status=401, data=context)

        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')

        payments = Payment.objects.filter(date_of_service__range=[start_date, end_date]).order_by('-pay_until')

        # Filter payments where deposit amount is less than payment amount
        filtered_payments = []
        for payment in payments:
            total_deposit_amount = payment.payment_deposit.aggregate(total_amount=Sum('amount'))['total_amount']
            if total_deposit_amount is not None:
                payment.amount -= total_deposit_amount

            if payment.amount >= 0.01:
                filtered_payments.append(payment)

        payment_serializer = PaymentSerializer(filtered_payments, many=True)

        return Response({
            'payments': payment_serializer.data,
        })


class GetPaymentsBySupplier(generics.ListAPIView):
    """
    URL: get_payments_by_supplier/
    """

    @csrf_exempt
    def get(self, request):
        context = {"request": request, "errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_view(user.id, 'GT'):
            context = {"errormsg": "You do not have permission to view Payments."}
            return Response(status=401, data=context)

        supplier_type = request.GET.get('supplier_type')
        supplier_name = request.GET.get('supplier')

        payments = Payment.objects.filter(supplier=supplier_name, supplier_type=supplier_type)

        # Filter payments where deposit amount is less than payment amount
        filtered_payments = []
        for payment in payments:
            total_deposit_amount = payment.payment_deposit.aggregate(total_amount=Sum('amount'))['total_amount']
            if total_deposit_amount is not None:
                payment.amount -= total_deposit_amount

            if payment.amount >= 0.01:
                filtered_payments.append(payment)

        payment_serializer = PaymentSerializer(filtered_payments, many=True)

        return Response({
            'payments': payment_serializer.data,
        })


class GetAllPendingPayments(generics.ListAPIView):
    """
    URL: get_all_pending_payments/
    """

    # Cross site request forgery
    @csrf_exempt
    def get(self, request):
        context = {"request": request, "errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_view(user.id, 'GT'):
            context = {"errormsg": "You do not have permission to view Pending Payments."}
            return Response(status=401, data=context)

        completed_payments = Payment.objects.order_by('-pay_until')

        # Filter payments where deposit amount is less than payment amount
        filtered_payments = []
        for payment in completed_payments:
            total_deposit_amount = payment.payment_deposit.aggregate(total_amount=Sum('amount'))['total_amount']
            if total_deposit_amount is not None:
                payment.amount -= total_deposit_amount

            if payment.amount >= 0.01:
                filtered_payments.append(payment)

        payment_serializer = PaymentSerializer(filtered_payments, many=True)

        return Response({
            'all_payments': payment_serializer.data,
        })


class DeleteDeposit(generics.UpdateAPIView):
    """
    url : delete_deposit/
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request):
        context = {"errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_delete(user.id, 'GT'):
            context = {"errormsg": "You do not have permission to delete a Deposit"}
            return Response(status=401, data=context)

        try:
            deposit_to_del = Deposit.objects.get(id=request.data['deposit_id'])
            History.objects.create(
                user=user,
                model_name='USR',
                action='DEL',
                description=f"User : {user.username} deleted deposit with id: {deposit_to_del.id}"
            )
            deposit_to_del.delete()

        except Exception as a:
            context['errormsg'] = a
            return Response(data=context, status=400)

        # context['user'] = UserSerializer(user_to_del).data
        return Response(data=context, status=200)


class GetAllDeposits(generics.ListAPIView):
    """
    URL: get_all_deposits/
    """

    # Cross site request forgery
    @csrf_exempt
    def get(self, request):
        context = {"request": request, "errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_view(user.id, 'GT'):
            context = {"errormsg": "You do not have permission to view Deposits."}
            return Response(status=401, data=context)

        all_deposits = Deposit.objects.all()
        deposit_serializer = DepositSerializer(all_deposits, many=True)

        return Response({
            'all_deposits': deposit_serializer.data,
        })
