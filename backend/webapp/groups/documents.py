import os
from webapp.models import (
    GroupTransfer,
    History,
    Document,
    DocRoomingList,
    Hotel,
)
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authtoken.models import Token
from rest_framework import generics
from rest_framework.response import Response
from django.utils.encoding import escape_uri_path
from django.utils.http import urlquote, urlunquote

from .rooming_lists import gen_rooming_list_docx

from webapp.serializers import (
    GroupSerializer,
)
from accounts.permissions import (
    can_create,
    can_delete,
)
from pathlib import Path


"""
    # Documents

    - UploadGroupDocument
    - DownloadGroupDocument
    - DeleteGroupDocument
    - DragDropGroupDocument

"""


# Used to allow specific file uploads
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
    'flv',
]

BASE_DIR = Path(__file__).resolve().parent.parent.parent


# Get user from token
def get_user(token):
    return Token.objects.get(key=token).user


class UploadGroupDocument(generics.ListCreateAPIView):
    """
    url : upload_group_document/(?P<refcode>.*)$
    Descr: Uploads document related to group
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request, refcode):
        context = {"errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission
        if not can_create(user.id, 'GT'):
            context = {"errormsg": "You do not have permission to create a Group's document."}
            return Response(status=401, data=context)

        backend_path = os.path.join(BASE_DIR, 'static')

        # Create folder named with refcode to store the uploaded docs
        # If it already exists, do nothing

        # Get user
        token_str = request.headers['User-Token']
        user = get_user(token_str)
        file = request.FILES['file']

        # Get description
        description = request.data['description'].strip()
        extension = file.name.split('.')[-1]

        # Validate size
        max_size = 20971520  # 20 megabytes
        if file.size > max_size:
            context['errormsg'] = 'File should not exceed 20 megabytes of data'
            return Response(data=context, status=400)

        # Validate extension
        if extension not in allowed_extensions:
            context['errormsg'] = f'Cannot upload .{extension} file.'
            return Response(data=context, status=400)

        # If file name already exists in the system, add an underscore and counter number
        file_name = file.name
        counter = 1
        while os.path.isfile(os.path.join(backend_path, 'files', refcode, str(file_name))):
            file_name = file.name.split('.')[0] + '_' + str(counter) + '.' + file.name.split('.')[1]
            counter += 1

        # Get Group
        group = GroupTransfer.objects.get(refcode=refcode)

        # Get full path
        full_path = os.path.join(backend_path, 'files', 'group_documents', refcode, str(file_name))
        try:
            newDocument = Document.objects.create(
                name=file_name,
                type='GT',
                description=description,
                uploader_id=user.id,
                file=full_path,
                size=file.size
            )
            History.objects.create(
                user=user,
                model_name='GT',
                action='CRE',
                description=f'User : {user.username} uploaded document to group: {group.refcode} named : {file_name}'
            )
            newDocument.save()
        except Exception as a:
            context['errormsg'] = a
            return Response(data=context, status=400)
        group.documents.add(newDocument)

        dest = open(os.path.join(backend_path, 'files', 'group_documents', refcode, file_name), 'wb+')

        # Write it to \files\group_documents\<group_refcode>\<file_name>
        if file.multiple_chunks:
            for c in file.chunks():
                dest.write(c)
        else:
            dest.write(file.read())
        dest.close()
        context['model'] = GroupSerializer(group).data
        return Response(data=context, status=200)


class DownloadGroupDocument(generics.ListAPIView):
    def get(self, request, refcode):
        backend_path = os.path.join(BASE_DIR, 'static')
        file = request.GET.get('file')

        # URL-decode the filename in case it was URL-encoded when passed
        decoded_file = urlunquote(file)
        safe_file_path = os.path.basename(decoded_file)
        full_path = os.path.join(backend_path, 'files', 'group_documents', refcode, safe_file_path)

        response = HttpResponse(open(full_path, 'rb'), content_type='application/octet-stream')

        # Properly encode the filename for the Content-Disposition header
        encoded_filename = urlquote(decoded_file)
        response['Content-Disposition'] = "attachment; filename*=utf-8''{}".format(encoded_filename)
        return response


class DeleteGroupDocument(generics.UpdateAPIView):
    """
    URL: delete_group_document/(?P<refcode>.*)$
    Descr: deletes a group's document, also removes it from file system
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request, refcode):
        token_str = request.headers['User-Token']
        user = get_user(token_str)
        context = {"errormsg": ''}

        # Permission
        if not can_delete(user.id, 'GT'):
            context = {"errormsg": "You do not have permission to delete a Group's document."}
            return Response(status=401, data=context)

        # Get Group
        group = GroupTransfer.objects.get(refcode=refcode)

        # Get document
        document_id = request.data['document_id']
        document_name = request.data['document_name']
        backend_path = os.path.join(BASE_DIR, 'static')

        # Get full path to be able to remove it
        full_path = os.path.join(backend_path, 'files', 'group_documents', refcode, document_name)
        os.remove(full_path)
        try:
            document_to_delete = Document.objects.get(id=document_id)
            History.objects.create(
                user=user,
                model_name='GT',
                action='DEL',
                description=f'User : {user.username} deleted document named: {document_name} of group: {group.refcode}'
            )
            document_to_delete.delete()
        except Exception as a:
            context['errormsg'] = a
            return Response(data=context, status=400)
        context['model'] = GroupSerializer(group).data
        return Response(data=context, status=200)


class DragDropGroupDocument(generics.ListCreateAPIView):
    """
    url : drag_drop_group_document/(?P<refcode>.*)$
    Descr: Uploads document(s) related to group
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request, refcode):
        context = {"errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        backend_path = os.path.join(BASE_DIR, 'static')

        # Permission
        if not can_create(user.id, 'GT'):
            context = {"errormsg": "You do not have permission to create a Group's document."}
            return Response(status=401, data=context)

        if not os.path.exists(os.path.join(backend_path, 'files', 'group_documents', refcode)):
            os.makedirs(os.path.join(backend_path, 'files', 'group_documents', refcode))

        # Get user
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        for file in request.FILES.getlist('files_array'):
            extension = file.name.split('.')[-1]

            # Validate size
            max_size = 20971520  # 20 megabytes
            if file.size > max_size:
                context['errormsg'] = 'File should not exceed 20 megabytes of data'
                return Response(data=context, status=400)

            # Validate extension
            if extension not in allowed_extensions:
                context['errormsg'] = f'Cannot upload .{extension} file.'
                return Response(data=context, status=400)

            # If file name already exists in the system, add an underscore and counter number
            file_name = file.name
            counter = 1

            while os.path.isfile(os.path.join(backend_path, 'files', refcode, str(file_name))):
                file_name = file.name.split('.')[0] + '_' + str(counter) + '.' + file.name.split('.')[1]
                counter += 1

            # Get Group
            group = GroupTransfer.objects.get(refcode=refcode)

            # Get full path
            full_path = os.path.join(backend_path, 'files', 'group_documents', refcode, str(file_name))

            try:
                newDocument = Document.objects.create(
                    name=file_name,
                    type='GT',
                    uploader_id=user.id,
                    file=full_path,
                    size=file.size
                )
                History.objects.create(
                    user=user,
                    model_name='GT',
                    action='CRE',
                    description=f'User: {user.username} uploaded document to group: {group.refcode} named : {file_name}'
                )
                newDocument.save()
            except Exception as a:
                context['errormsg'] = a
                return Response(data=context, status=400)
            group.documents.add(newDocument)

            dest = open(os.path.join(backend_path, 'files', 'group_documents', refcode, file_name), 'wb+')

            # Write it to \files\group_documents\<group_refcode>\<file_name>
            if file.multiple_chunks:
                for c in file.chunks():
                    dest.write(c)
            else:
                dest.write(file.read())
            dest.close()
        context['model'] = GroupSerializer(group).data
        return Response(data=context, status=200)


class DownloadRoomingList(generics.ListAPIView):
    """
    URL: download_rooming_list/(?P<refcode>.*)/$
    Downloads group's rooming list
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def get(self, request, refcode):

        group = GroupTransfer.objects.get(refcode=refcode)
        file = request.GET.get('file')
        hotel_name = file.split("_")[-1].split(".")[0]
        hotel = Hotel.objects.get(id=hotel_name)
        rooming_list = DocRoomingList.objects.get(group_transfer=group, hotel=hotel)
        gen_rooming_list_docx(group, rooming_list, False)
        full_path = str(BASE_DIR) + '/files/rooming_lists/' + refcode + '/' + str(file)
        f = open(full_path, 'rb')
        file_contents = f.read()
        f.close()
        temp = HttpResponse(file_contents, content_type='multipart/form-data')
        temp['Content-Disposition'] = "attachment; filename*=utf-8''{}".format(escape_uri_path(file))
        return temp


class DownloadCabinList(generics.ListAPIView):
    """
    URL: download_cabin_list/(?P<refcode>.*)/$
    Downloads group's cabin list
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def get(self, request, refcode):

        file = request.GET.get('file')

        print(file)
        full_path = str(BASE_DIR) + '\\files\\cabin_lists\\' + refcode + '/' + str(file)
        f = open(full_path, 'rb')

        file_contents = f.read()
        f.close()

        temp = HttpResponse(file_contents, content_type='multipart/form-data')
        temp['Content-Disposition'] = "attachment; filename*=utf-8''{}".format(escape_uri_path(file))
        return temp
