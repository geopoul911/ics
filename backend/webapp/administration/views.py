from webapp.models import (
    User,
    Bank,
    InsuranceCarrier,
    Profession,
    ProjectCategory,
    TaskCategory,
)
from accounts.models import Consultant
from webapp.serializers import (
    ConsultantSerializer,
    BankSerializer,
    InsuranceCarrierSerializer,
    ProfessionSerializer,
    ProjectCategorySerializer,
    TaskCategorySerializer,
)

import datetime
from rest_framework.authtoken.models import Token
from rest_framework import generics
from rest_framework.response import Response
from django.db.models import Q, ProtectedError
from django.db import IntegrityError, transaction
from rest_framework.views import APIView
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from django.http import HttpResponse, FileResponse, JsonResponse
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from django.views import View
from django.conf import settings
from django.core.exceptions import ValidationError

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
        serializer = self.get_serializer(data=request.data, context={"request": request})
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
        serializer = self.get_serializer(instance, context={"request": request})
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
        serializer = self.get_serializer(instance, data=request.data, partial=True, context={"request": request})
        
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


class AllBanks(generics.ListCreateAPIView):
    """
    API endpoint for listing all banks and creating new banks.
    """
    serializer_class = BankSerializer
    queryset = Bank.objects.all().order_by('orderindex', 'bankname')
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        """Get all banks"""
        try:
            queryset = self.get_queryset()
            data = self.get_serializer(queryset, many=True, context={"request": request}).data
            
            return Response({"all_banks": data})
        except Exception as e:
            return Response(
                {"error": f"Failed to retrieve banks: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def post(self, request, *args, **kwargs):
        """Create a new bank"""
        serializer = self.get_serializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    bank = serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
            except ValidationError as e:
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
            except Exception as e:
                return Response(
                    {"error": f"Failed to create bank: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BankView(RetrieveUpdateDestroyAPIView):
    """
    API endpoint for retrieving, updating, and deleting a specific bank.
    """
    queryset = Bank.objects.all()
    serializer_class = BankSerializer
    lookup_field = 'bank_id'

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, context={"request": request})
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        # Prevent primary key updates - bank_id is immutable
        if 'bank_id' in request.data and request.data['bank_id'] != instance.bank_id:
            return Response(
                {"error": "Bank ID cannot be changed once created"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Use the data directly from request for partial updates
        serializer = self.get_serializer(instance, data=request.data, partial=True, context={"request": request})
        
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    bank = serializer.save()
                    return Response(serializer.data)
            except ValidationError as e:
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
            except Exception as e:
                return Response(
                    {"error": f"Failed to update bank: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        
        try:
            with transaction.atomic():
                # Check for related objects before deletion
                related_objects = []
                
                # Check for related bank client accounts
                related_accounts = instance.bankclientaccount_set.all()
                if related_accounts.exists():
                    related_objects.append(f"{related_accounts.count()} bank client account(s): {', '.join([f'{acc.client.surname} {acc.client.name} - {acc.accountnumber}' for acc in related_accounts[:5]])}{'...' if related_accounts.count() > 5 else ''}")
                
                # Check for related bank project accounts
                related_project_accounts = instance.bankprojectaccount_set.all()
                if related_project_accounts.exists():
                    related_objects.append(f"{related_project_accounts.count()} bank project account(s): {', '.join([f'{acc.project.title} - {acc.client.surname} {acc.client.name}' for acc in related_project_accounts[:5]])}{'...' if related_project_accounts.count() > 5 else ''}")
                
                if related_objects:
                    return Response(
                        {
                            "error": "Cannot delete bank because it has related objects",
                            "related_objects": related_objects
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                instance.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
                
        except Exception as e:
                            return Response(
                    {"error": f"Failed to delete bank: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )


class AllInsuranceCarriers(generics.ListCreateAPIView):
    """
    API endpoint for listing all insurance carriers and creating new insurance carriers.
    """
    serializer_class = InsuranceCarrierSerializer
    queryset = InsuranceCarrier.objects.all().order_by('orderindex', 'title')
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        """Get all insurance carriers"""
        try:
            queryset = self.get_queryset()
            data = self.get_serializer(queryset, many=True, context={"request": request}).data
            
            return Response({"all_insurance_carriers": data})
        except Exception as e:
            return Response(
                {"error": f"Failed to retrieve insurance carriers: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def post(self, request, *args, **kwargs):
        """Create a new insurance carrier"""
        serializer = self.get_serializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    insurance_carrier = serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
            except ValidationError as e:
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
            except Exception as e:
                return Response(
                    {"error": f"Failed to create insurance carrier: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class InsuranceCarrierView(RetrieveUpdateDestroyAPIView):
    """
    API endpoint for retrieving, updating, and deleting a specific insurance carrier.
    """
    queryset = InsuranceCarrier.objects.all()
    serializer_class = InsuranceCarrierSerializer
    lookup_field = 'insucarrier_id'

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, context={"request": request})
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        # Prevent primary key updates - insucarrier_id is immutable
        if 'insucarrier_id' in request.data and request.data['insucarrier_id'] != instance.insucarrier_id:
            return Response(
                {"error": "Insurance Carrier ID cannot be changed once created"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Use the data directly from request for partial updates
        serializer = self.get_serializer(instance, data=request.data, partial=True, context={"request": request})
        
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    insurance_carrier = serializer.save()
                    return Response(serializer.data)
            except ValidationError as e:
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
            except Exception as e:
                return Response(
                    {"error": f"Failed to update insurance carrier: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        
        try:
            with transaction.atomic():
                # Check for related objects before deletion
                related_objects = []
                
                # Check for related clients (insucarrier1)
                related_clients1 = instance.clients_insucarrier1.all()
                if related_clients1.exists():
                    related_objects.append(f"{related_clients1.count()} client(s) with primary insurance carrier: {', '.join([f'{client.surname} {client.name}' for client in related_clients1[:5]])}{'...' if related_clients1.count() > 5 else ''}")
                
                # Check for related clients (insucarrier2)
                related_clients2 = instance.clients_insucarrier2.all()
                if related_clients2.exists():
                    related_objects.append(f"{related_clients2.count()} client(s) with secondary insurance carrier: {', '.join([f'{client.surname} {client.name}' for client in related_clients2[:5]])}{'...' if related_clients2.count() > 5 else ''}")
                
                if related_objects:
                    return Response(
                        {
                            "error": "Cannot delete insurance carrier because it has related objects",
                            "related_objects": related_objects
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                instance.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
                
        except Exception as e:
                            return Response(
                    {"error": f"Failed to delete insurance carrier: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )


class AllProfessions(generics.ListCreateAPIView):
    """
    API endpoint for listing all professions and creating new professions.
    """
    serializer_class = ProfessionSerializer
    queryset = Profession.objects.all().order_by('title')
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        """Get all professions"""
        try:
            queryset = self.get_queryset()
            data = self.get_serializer(queryset, many=True, context={"request": request}).data
            return Response({"all_professions": data})
        except Exception as e:
            return Response(
                {"error": f"Failed to fetch professions: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def post(self, request, *args, **kwargs):
        """Create a new profession"""
        serializer = self.get_serializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    profession = serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
            except ValidationError as e:
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
            except Exception as e:
                return Response(
                    {"error": f"Failed to create profession: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfessionView(RetrieveUpdateDestroyAPIView):
    """
    API endpoint for retrieving, updating, and deleting a specific profession.
    """
    serializer_class = ProfessionSerializer
    queryset = Profession.objects.all()
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = 'profession_id'

    def get(self, request, *args, **kwargs):
        """Get a specific profession"""
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, context={"request": request})
            return Response(serializer.data)
        except Profession.DoesNotExist:
            return Response(
                {"error": "Profession not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"Failed to fetch profession: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def put(self, request, *args, **kwargs):
        """Update a profession"""
        try:
            instance = self.get_object()
            
            # Prevent profession_id updates - profession_id is immutable
            if 'profession_id' in request.data and request.data['profession_id'] != instance.profession_id:
                return Response(
                    {"error": "Profession ID cannot be changed once created"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            serializer = self.get_serializer(instance, data=request.data, partial=True, context={"request": request})
            if serializer.is_valid():
                with transaction.atomic():
                    profession = serializer.save()
                    return Response(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Profession.DoesNotExist:
            return Response(
                {"error": "Profession not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except ValidationError as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": f"Failed to update profession: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def delete(self, request, *args, **kwargs):
        """Delete a profession"""
        try:
            instance = self.get_object()
            with transaction.atomic():
                instance.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
        except Profession.DoesNotExist:
            return Response(
                {"error": "Profession not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except ProtectedError:
            return Response(
                {"error": "Cannot delete profession as it is referenced by other records"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": f"Failed to delete profession: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


"""
    # Project Categories

    - AllProjectCategories
    - ProjectCategoryView
"""


class AllProjectCategories(generics.ListCreateAPIView):
    """
    URL: all_project_categories/
    Descr: Returns array of all project categories and allows creation
    """
    serializer_class = ProjectCategorySerializer
    queryset = ProjectCategory.objects.all().order_by("orderindex", "title")
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        data = self.get_serializer(queryset, many=True, context={"request": request}).data
        return Response({"all_project_categories": data})

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    project_category = serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
            except IntegrityError as e:
                error_str = str(e).lower()
                
                # Check if this is a unique constraint violation on orderindex
                if 'orderindex' in error_str and 'unique' in error_str:
                    try:
                        new_orderindex = request.data.get('orderindex')
                        conflicting_category = ProjectCategory.objects.get(orderindex=new_orderindex)
                        return Response(
                            {"error": f"Order index {new_orderindex} is already taken by Project Category: {conflicting_category.title} (ID: {conflicting_category.projcate_id})"},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    except ProjectCategory.DoesNotExist:
                        pass
                
                # Check if this is a unique constraint violation on projcate_id
                if 'projcate_id' in error_str and 'unique' in error_str:
                    try:
                        new_projcate_id = request.data.get('projcate_id')
                        conflicting_category = ProjectCategory.objects.get(projcate_id=new_projcate_id)
                        return Response(
                            {"error": f"Project Category ID '{new_projcate_id}' is already taken by Project Category: {conflicting_category.title}"},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    except ProjectCategory.DoesNotExist:
                        pass
                
                return Response(
                    {"error": "A project category with this ID or order index already exists"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            except ValidationError as e:
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
            except Exception as e:
                return Response(
                    {"error": f"Failed to create project category: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProjectCategoryView(RetrieveUpdateDestroyAPIView):
    """
    API endpoint for retrieving, updating, and deleting a specific project category.
    """
    serializer_class = ProjectCategorySerializer
    queryset = ProjectCategory.objects.all()
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = 'projcate_id'

    def get(self, request, *args, **kwargs):
        """Get a specific project category"""
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, context={"request": request})
            return Response(serializer.data)
        except ProjectCategory.DoesNotExist:
            return Response(
                {"error": "Project category not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"Failed to fetch project category: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def put(self, request, *args, **kwargs):
        """Update a project category"""
        try:
            instance = self.get_object()
            
            # Prevent projcate_id updates - projcate_id is immutable
            if 'projcate_id' in request.data and request.data['projcate_id'] != instance.projcate_id:
                return Response(
                    {"error": "Project Category ID cannot be changed once created"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            serializer = self.get_serializer(instance, data=request.data, partial=True, context={"request": request})
            if serializer.is_valid():
                with transaction.atomic():
                    project_category = serializer.save()
                    return Response(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except ProjectCategory.DoesNotExist:
            return Response(
                {"error": "Project category not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except ValidationError as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": f"Failed to update project category: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def delete(self, request, *args, **kwargs):
        """Delete a project category"""
        try:
            instance = self.get_object()
            with transaction.atomic():
                instance.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
        except ProjectCategory.DoesNotExist:
            return Response(
                {"error": "Project category not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except ProtectedError:
            return Response(
                {"error": "Cannot delete project category as it is referenced by other records"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": f"Failed to delete project category: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


"""
    # Task Categories

    - AllTaskCategories
    - TaskCategoryView
"""


class AllTaskCategories(generics.ListCreateAPIView):
    """
    URL: all_task_categories/
    Descr: Returns array of all task categories and allows creation
    """
    serializer_class = TaskCategorySerializer
    queryset = TaskCategory.objects.all().order_by("orderindex", "title")
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        data = self.get_serializer(queryset, many=True, context={"request": request}).data
        return Response({"all_task_categories": data})

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    task_category = serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
            except IntegrityError as e:
                error_str = str(e).lower()
                
                # Check if this is a unique constraint violation on orderindex
                if 'orderindex' in error_str and 'unique' in error_str:
                    try:
                        new_orderindex = request.data.get('orderindex')
                        conflicting_category = TaskCategory.objects.get(orderindex=new_orderindex)
                        return Response(
                            {"error": f"Order index {new_orderindex} is already taken by Task Category: {conflicting_category.title} (ID: {conflicting_category.taskcate_id})"},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    except TaskCategory.DoesNotExist:
                        pass
                
                # Check if this is a unique constraint violation on taskcate_id
                if 'taskcate_id' in error_str and 'unique' in error_str:
                    try:
                        new_taskcate_id = request.data.get('taskcate_id')
                        conflicting_category = TaskCategory.objects.get(taskcate_id=new_taskcate_id)
                        return Response(
                            {"error": f"Task Category ID '{new_taskcate_id}' is already taken by Task Category: {conflicting_category.title}"},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    except TaskCategory.DoesNotExist:
                        pass
                
                return Response(
                    {"error": "A task category with this ID or order index already exists"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            except ValidationError as e:
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
            except Exception as e:
                return Response(
                    {"error": f"Failed to create task category: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TaskCategoryView(RetrieveUpdateDestroyAPIView):
    """
    API endpoint for retrieving, updating, and deleting a specific task category.
    """
    serializer_class = TaskCategorySerializer
    queryset = TaskCategory.objects.all()
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = 'taskcate_id'

    def get(self, request, *args, **kwargs):
        """Get a specific task category"""
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, context={"request": request})
            return Response(serializer.data)
        except TaskCategory.DoesNotExist:
            return Response(
                {"error": "Task category not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"Failed to fetch task category: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def put(self, request, *args, **kwargs):
        """Update a task category"""
        try:
            instance = self.get_object()
            
            # Prevent taskcate_id updates - taskcate_id is immutable
            if 'taskcate_id' in request.data and request.data['taskcate_id'] != instance.taskcate_id:
                return Response(
                    {"error": "Task Category ID cannot be changed once created"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            serializer = self.get_serializer(instance, data=request.data, partial=True, context={"request": request})
            if serializer.is_valid():
                with transaction.atomic():
                    task_category = serializer.save()
                    return Response(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except TaskCategory.DoesNotExist:
            return Response(
                {"error": "Task category not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except ValidationError as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": f"Failed to update task category: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def delete(self, request, *args, **kwargs):
        """Delete a task category"""
        try:
            instance = self.get_object()
            with transaction.atomic():
                instance.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
        except TaskCategory.DoesNotExist:
            return Response(
                {"error": "Task category not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except ProtectedError:
            return Response(
                {"error": "Cannot delete task category as it is referenced by other records"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": f"Failed to delete task category: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

