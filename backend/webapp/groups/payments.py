from webapp.models import (
    GroupTransfer,
    Document,
    History,
    Payment,
    Deposit,
)
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authtoken.models import Token
from core.settings import BASE_DIR
from rest_framework import generics
from django.http import HttpResponse
from rest_framework.response import Response
from django.utils.http import urlquote, urlunquote
from webapp.serializers import (
    GroupSerializer,
    DepositSerializer,
)
from django.db.models import ProtectedError
import os
import datetime
import json
from accounts.permissions import (
    can_create,
    can_delete,
    can_view,
)

SUPPLIER_TYPES_REV = {
    'Agent': 'AG',
    'Airline': 'AL',
    'Coach Operator': 'CO',
    'Cruising Company': 'CC',
    'DMC': 'DMC',
    'Ferry Ticket Agency': 'FTA',
    'Guide': 'GD',
    'Hotel': 'HTL',
    'Repair Shop': 'RS',
    'Restaurant': 'RST',
    'Sport Event Supplier': 'SES',
    'Teleferik Company': 'TC',
    'Theater': 'TH',
    'Train Ticket Agency': 'TTA',
    'Tour Leader': 'TL',
}


# Get user from token
def get_user(token):
    return Token.objects.get(key=token).user


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
    'rar',
]


class AddPendingPayment(generics.ListCreateAPIView):

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request):
        context = {"errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_create(user.id, 'GT'):
            context = {"errormsg": "You do not have permission to create a Group's document."}
            return Response(status=401, data=context)

        refcode = request.data['refcode']
        supplier_type = request.data['supplier_type']
        supplier = request.data['supplier']
        date_of_service = request.data['date_of_service']
        currency = request.data['currency']
        payments = json.loads(request.data.get('payments', ''))
        doc_type = request.data['doc_type']

        try:
            file = request.FILES['file']
        except (KeyError, ValueError):
            file = None

        group = GroupTransfer.objects.get(refcode=refcode)
        backend_path = os.path.join(BASE_DIR, 'static')

        # validate the file if it exists
        if file:
            extension = file.name.split('.')[-1]
            max_size = 20971520  # 20 megabytes

            # Validate Size
            if file.size > max_size:
                context['errormsg'] = 'File should not exceed 20 megabytes of data'
                return Response(data=context, status=400)

            # Validate extension
            if extension not in allowed_extensions:
                context['errormsg'] = f'Cannot upload .{extension} file.'
                return Response(data=context, status=400)

            file_name = file.name
            counter = 1

            if not os.path.exists(os.path.join(backend_path, 'files', doc_type, group.refcode)):
                os.makedirs(os.path.join(backend_path, 'files', doc_type, group.refcode))

            while os.path.isfile(os.path.join(backend_path, 'files', doc_type, group.refcode, str(file_name))):
                file_name = file.name.split('.')[0] + '_' + str(counter) + '.' + file.name.split('.')[1]
                counter += 1

            # Get full path
            full_path = os.path.join(backend_path, 'files', doc_type, group.refcode, str(file_name))
            newDocument = Document.objects.create(
                name=file_name,
                type='GT',
                uploader_id=user.id,
                file=full_path,
                size=file.size
            )
            newDocument.save()

            dest = open(os.path.join(backend_path, 'files', doc_type, group.refcode, file_name), 'wb+')

            # Write it to \files\group_documents\<group_refcode>\<file_name>
            if file.multiple_chunks:
                for c in file.chunks():
                    dest.write(c)
            else:
                dest.write(file.read())
            dest.close()

        try:
            for payment in payments:
                newPayment = Payment.objects.create(
                    group_transfer=group,
                    supplier_type=supplier_type,
                    supplier=supplier,
                    date_of_service=date_of_service,
                    currency=currency,
                    pay_until=datetime.datetime.strptime(payment['payUntil'], '%Y-%m-%dT%H:%M:%S.%fZ').date(),
                    amount=payment['amount'],
                )
                if file:
                    if doc_type == 'proforma':
                        newPayment.proforma_id = newDocument.id
                    elif doc_type == 'invoice':
                        newPayment.invoice_id = newDocument.id

                History.objects.create(
                    user=user,
                    model_name='GT',
                    action='CRE',
                    description=f'User : {user.username} created a new payment for supplier: {supplier} , group: {group.refcode} and amount: {payment["amount"]}'
                )

                newPayment.save()

        except Exception as a:
            context['errormsg'] = a
            return Response(data=context, status=400)

        context['model'] = GroupSerializer(group).data
        return Response(data=context, status=200)


class DownloadFinancialDocument(generics.ListAPIView):
    def get(self, request):
        backend_path = os.path.join(BASE_DIR, 'static')
        file = request.GET.get('file')
        refcode = request.GET.get('refcode')

        # URL-decode the filename in case it was URL-encoded when passed
        decoded_file = urlunquote(file)
        safe_file_path = os.path.basename(decoded_file)
        full_path = os.path.join(backend_path, 'files', request.GET.get('doc_type'), refcode, safe_file_path)

        response = HttpResponse(open(full_path, 'rb'), content_type='application/octet-stream')

        # Properly encode the filename for the Content-Disposition header
        encoded_filename = urlquote(decoded_file)
        response['Content-Disposition'] = "attachment; filename*=utf-8''{}".format(encoded_filename)
        return response


class DeletePayment(generics.ListCreateAPIView):

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request):
        context = {"errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_delete(user.id, 'GT'):
            context = {"errormsg": "You do not have permission to delete a Group's Payment."}
            return Response(status=401, data=context)

        payment_id = request.data['payment_id']
        refcode = request.data['refcode']

        try:
            payment = Payment.objects.get(id=payment_id)
            History.objects.create(
                user=user,
                model_name='GT',
                action='DEL',
                description=f'User : {user.username} deleted payment from  group : {refcode} with amount {payment.amount} and supplier: {payment.supplier}'
            )
            payment.delete()
        except ProtectedError:
            context['errormsg'] = "This Pending Payment is protected."
            return Response(data=context, status=400)
        except Exception as a:
            context['errormsg'] = a
            return Response(data=context, status=400)

        context['model'] = GroupSerializer(GroupTransfer.objects.get(refcode=refcode)).data
        return Response(data=context, status=200)


class GetGroupDeposits(generics.ListCreateAPIView):
    """
    get_group_deposits
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def get(self, request, refcode):
        context = {"errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_view(user.id, 'GT'):
            context = {"errormsg": "You do not have permission to delete a Group's Payment."}
            return Response(status=401, data=context)

        group = GroupTransfer.objects.get(refcode=refcode)

        deposits = DepositSerializer(Deposit.objects.filter(payment__group_transfer_id=group.id).order_by('payment__pay_until'), many=True).data

        return Response({
            'deposits': deposits,
        })


class uploadPaymentDocument(generics.ListCreateAPIView):
    """
    get_group_deposits
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request):
        context = {"errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_create(user.id, 'GT'):
            context = {"errormsg": "You do not have permission to add a Payment's document."}
            return Response(status=401, data=context)

        print("!")

        refcode = request.data['refcode']
        doc_type = request.data['doc_type']

        print(refcode)

        try:
            file = request.FILES['file']
        except (KeyError, ValueError):
            file = None

        group = GroupTransfer.objects.get(refcode=refcode)
        backend_path = os.path.join(BASE_DIR, 'static')

        # validate the file if it exists
        if file:
            extension = file.name.split('.')[-1]
            max_size = 20971520  # 20 megabytes

            # Validate Size
            if file.size > max_size:
                context['errormsg'] = 'File should not exceed 20 megabytes of data'
                return Response(data=context, status=400)

            # Validate extension
            if extension not in allowed_extensions:
                context['errormsg'] = f'Cannot upload .{extension} file.'
                return Response(data=context, status=400)

            file_name = file.name
            counter = 1

            if not os.path.exists(os.path.join(backend_path, 'files', doc_type, group.refcode)):
                os.makedirs(os.path.join(backend_path, 'files', doc_type, group.refcode))

            while os.path.isfile(os.path.join(backend_path, 'files', doc_type, group.refcode, str(file_name))):
                file_name = file.name.split('.')[0] + '_' + str(counter) + '.' + file.name.split('.')[1]
                counter += 1

            # Get full path
            full_path = os.path.join(backend_path, 'files', doc_type, group.refcode, str(file_name))
            newDocument = Document.objects.create(
                name=file_name,
                type='GT',
                uploader_id=user.id,
                file=full_path,
                size=file.size
            )
            newDocument.save()

            dest = open(os.path.join(backend_path, 'files', doc_type, group.refcode, file_name), 'wb+')

            # Write it to \files\group_documents\<group_refcode>\<file_name>
            if file.multiple_chunks:
                for c in file.chunks():
                    dest.write(c)
            else:
                dest.write(file.read())
            dest.close()

        try:
            payment = Payment.objects.get(id=request.data['payment_id'])
            if file:
                if doc_type == 'proforma':
                    payment.proforma_id = newDocument.id
                elif doc_type == 'invoice':
                    payment.invoice_id = newDocument.id

            History.objects.create(
                user=user,
                model_name='GT',
                action='CRE',
                description=f"User : {user.username} updated payment's {payment.id} document"
            )

            payment.save()

        except Exception as a:
            context['errormsg'] = a
            return Response(data=context, status=400)

        context['model'] = GroupSerializer(group).data
        return Response(data=context, status=200)
