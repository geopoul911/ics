from webapp.models import (
    User,
)
from accounts.models import Consultant
from webapp.serializers import (
    ConsultantSerializer,
)

import datetime
from rest_framework.authtoken.models import Token
from rest_framework import generics
from rest_framework.response import Response
from django.db.models import Q, ProtectedError
from django.db import IntegrityError
from rest_framework.views import APIView
from django.http import HttpResponse, FileResponse, JsonResponse
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from django.views import View
from django.conf import settings

# views.py
from rest_framework import generics
from rest_framework.response import Response

import logging

logger = logging.getLogger(__name__)


# Permissions
permissions_full_text = {
    'VIE': 'View',
    'CRE': 'Create',
    'UPD': 'Update',
    'DEL': 'Delete',
}

# Permissions reversed
permissions_full_text_reverse = {
    'View': 'VIE',
    'Create': 'CRE',
    'Update': 'UPD',
    'Delete': 'DEL',
}


# Returns user instance
def get_user(token):
    user = Token.objects.get(key=token).user
    return user


"""
    # Administration

    - AllConsultants
    - ConsultantView
"""


class AllConsultants(generics.ListCreateAPIView):
    """
    URL: all_consultants/
    Descr: Returns array of all consultants and allows creation
    """
    serializer_class = ConsultantSerializer
    queryset = Consultant.objects.all().order_by("orderindex")
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        data = self.get_serializer(queryset, many=True, context={"request": request}).data
        return Response({"all_consultants": data})

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            try:
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except IntegrityError as e:
                error_str = str(e).lower()
                
                # Check if this is a unique constraint violation on orderindex
                if 'orderindex' in error_str and 'unique' in error_str:
                    try:
                        new_orderindex = request.data.get('orderindex')
                        conflicting_consultant = Consultant.objects.get(orderindex=new_orderindex)
                        return Response(
                            {"error": f"Order index {new_orderindex} is already taken by Consultant: {conflicting_consultant.fullname} (ID: {conflicting_consultant.consultant_id})"},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    except Consultant.DoesNotExist:
                        pass
                
                # Check if this is a unique constraint violation on consultant_id
                elif 'consultant_id' in error_str and 'unique' in error_str:
                    try:
                        new_consultant_id = request.data.get('consultant_id')
                        conflicting_consultant = Consultant.objects.get(consultant_id=new_consultant_id)
                        return Response(
                            {"error": f"Consultant ID '{new_consultant_id}' is already taken by Consultant: {conflicting_consultant.fullname}"},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    except Consultant.DoesNotExist:
                        pass
                
                # Check if this is a unique constraint violation on username
                elif 'username' in error_str and 'unique' in error_str:
                    try:
                        new_username = request.data.get('username')
                        conflicting_consultant = Consultant.objects.get(username=new_username)
                        return Response(
                            {"error": f"Username '{new_username}' is already taken by Consultant: {conflicting_consultant.fullname}"},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    except Consultant.DoesNotExist:
                        pass
                
                return Response(
                    {"error": "A consultant with this information already exists."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ConsultantView(generics.RetrieveUpdateDestroyAPIView):
    """
    URL: consultant/<consultant_id>/
    Descr: Returns specific consultant and allows update/delete
    """
    serializer_class = ConsultantSerializer
    queryset = Consultant.objects.all()
    lookup_field = 'consultant_id'
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Prevent primary key updates - consultant_id is immutable
        if 'consultant_id' in request.data and request.data['consultant_id'] != instance.consultant_id:
            return Response(
                {"error": "Consultant ID cannot be modified. It is immutable."}, 
                status=400
            )
        
        # Use the data directly from request for partial updates
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        
        if serializer.is_valid():
            try:
                serializer.save()
                return Response(serializer.data)
            except IntegrityError as e:
                error_str = str(e).lower()
                
                # Check if this is a unique constraint violation on orderindex
                if 'orderindex' in error_str and 'unique' in error_str:
                    try:
                        new_orderindex = request.data.get('orderindex')
                        conflicting_consultant = Consultant.objects.get(orderindex=new_orderindex)
                        if conflicting_consultant.consultant_id != instance.consultant_id:
                            return Response(
                                {"error": f"Order index {new_orderindex} is already taken by Consultant: {conflicting_consultant.fullname} (ID: {conflicting_consultant.consultant_id})"},
                                status=status.HTTP_400_BAD_REQUEST
                            )
                    except Consultant.DoesNotExist:
                        pass
                
                # Check if this is a unique constraint violation on username
                elif 'username' in error_str and 'unique' in error_str:
                    try:
                        new_username = request.data.get('username')
                        conflicting_consultant = Consultant.objects.get(username=new_username)
                        if conflicting_consultant.consultant_id != instance.consultant_id:
                            return Response(
                                {"error": f"Username '{new_username}' is already taken by Consultant: {conflicting_consultant.fullname}"},
                                status=status.HTTP_400_BAD_REQUEST
                            )
                    except Consultant.DoesNotExist:
                        pass
                
                return Response(
                    {"error": "A consultant with this information already exists."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        try:
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ProtectedError as e:
            # Get the related objects that are preventing deletion
            related_objects = []
            
            # Check for related projects
            related_projects = instance.project_set.all()
            if related_projects.exists():
                related_objects.append({
                    'model': 'Projects',
                    'count': related_projects.count(),
                    'items': list(related_projects.values_list('title', flat=True)[:5])  # First 5 project titles
                })
            
            # Check for related cash transactions
            related_cash = instance.cash_set.all()
            if related_cash.exists():
                related_objects.append({
                    'model': 'Cash Transactions',
                    'count': related_cash.count(),
                    'items': list(related_cash.values_list('description', flat=True)[:5])  # First 5 descriptions
                })
            
            # Check for related properties
            related_properties = instance.property_set.all()
            if related_properties.exists():
                related_objects.append({
                    'model': 'Properties',
                    'count': related_properties.count(),
                    'items': list(related_properties.values_list('title', flat=True)[:5])  # First 5 property titles
                })
            
            # Check for related clients
            related_clients = instance.client_set.all()
            if related_clients.exists():
                related_objects.append({
                    'model': 'Clients',
                    'count': related_clients.count(),
                    'items': list(related_clients.values_list('fullname', flat=True)[:5])  # First 5 client names
                })
            
            # Check for related banks
            related_banks = instance.bank_set.all()
            if related_banks.exists():
                related_objects.append({
                    'model': 'Banks',
                    'count': related_banks.count(),
                    'items': list(related_banks.values_list('title', flat=True)[:5])  # First 5 bank names
                })
            
            error_message = f"Cannot delete Consultant '{instance.fullname}' because it is referenced by:"
            for obj in related_objects:
                error_message += f"\n- {obj['count']} {obj['model']}"
                if obj['items']:
                    error_message += f" (including: {', '.join(obj['items'])})"
            
            return Response(
                {
                    "error": error_message,
                    "related_objects": related_objects
                },
                status=status.HTTP_400_BAD_REQUEST
            )

