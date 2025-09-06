from webapp.models import (
    User,
    Bank,
    InsuranceCarrier,
    Profession,
    ProjectCategory,
    TaskCategory,
    BankProjectAccount,
)
from accounts.models import Consultant, AuditEvent
from webapp.serializers import (
    ConsultantSerializer,
    BankSerializer,
    InsuranceCarrierSerializer,
    ProfessionSerializer,
    ProjectCategorySerializer,
    ProjectCategoryDetailSerializer,
    TaskCategorySerializer,
    TaskCategoryDetailSerializer,
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
from webapp.permissions import RoleBasedPermission
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
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    # Only Admin and Supervisor can create consultants
    restrict_post_roles = ['A', 'S']

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
    permission_classes = [IsAuthenticated, RoleBasedPermission]

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
            # Build a detailed, user-friendly error message for the frontend modal
            related_strings = []

            # Projects owned by consultant
            related_projects = instance.project_set.all()
            if related_projects.exists():
                titles = list(related_projects.values_list('title', flat=True)[:5])
                more = '...' if related_projects.count() > 5 else ''
                related_strings.append(f"{related_projects.count()} project(s): {', '.join(titles)}{more}")

            # Tasks where consultant is the assigner
            related_assigned_tasks = instance.assigned_tasks.all()
            if related_assigned_tasks.exists():
                task_titles = list(related_assigned_tasks.values_list('title', flat=True)[:5])
                more = '...' if related_assigned_tasks.count() > 5 else ''
                related_strings.append(f"{related_assigned_tasks.count()} task(s) as assigner: {', '.join(task_titles)}{more}")

            # Tasks where consultant is the assignee
            related_assignee_tasks = instance.tasks.all()
            if related_assignee_tasks.exists():
                task_titles = list(related_assignee_tasks.values_list('title', flat=True)[:5])
                more = '...' if related_assignee_tasks.count() > 5 else ''
                related_strings.append(f"{related_assignee_tasks.count()} task(s) as assignee: {', '.join(task_titles)}{more}")

            # Task comments authored by consultant
            related_comments = instance.task_comments.all() if hasattr(instance, 'task_comments') else []
            try:
                if related_comments and related_comments.exists():
                    comment_snippets = [c[:30] + ('...' if len(c) > 30 else '') for c in list(related_comments.values_list('comment', flat=True)[:5])]
                    more = '...' if related_comments.count() > 5 else ''
                    related_strings.append(f"{related_comments.count()} task comment(s): {', '.join(comment_snippets)}{more}")
            except Exception:
                pass

            # Cash transactions by consultant
            related_cash = instance.cash_set.all()
            if related_cash.exists():
                reasons = list(related_cash.values_list('reason', flat=True)[:5])
                more = '...' if related_cash.count() > 5 else ''
                related_strings.append(f"{related_cash.count()} cash transaction(s): {', '.join(reasons)}{more}")

            # Taxation projects handled by consultant
            related_tax = instance.taxationproject_set.all()
            if related_tax.exists():
                ids = list(related_tax.values_list('taxproj_id', flat=True)[:5])
                more = '...' if related_tax.count() > 5 else ''
                related_strings.append(f"{related_tax.count()} taxation project(s): {', '.join(ids)}{more}")

            # Compose multi-line message consumable by DeleteObjectModal
            err_lines = [
                f"Cannot delete this consultant because it is referenced by the following objects:",
            ]
            for s in related_strings:
                err_lines.append(f"• {s}")
            err_lines.append("Please remove or reassign these related objects first, then try deleting this consultant again.")
            errormsg = "\n".join(err_lines)

            return Response(
                {
                    "error": "Protected Object",
                    "errormsg": errormsg,
                    "related_objects": related_strings,
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
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    
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
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, RoleBasedPermission]

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
                
                # Check for related bank project accounts via BankClientAccount → Bank
                related_project_accounts = BankProjectAccount.objects.filter(bankclientacco__bank=instance)
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
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    
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
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, RoleBasedPermission]

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
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    
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
    permission_classes = [IsAuthenticated, RoleBasedPermission]
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
        """Delete a profession with detailed protected info"""
        try:
            instance = self.get_object()
            with transaction.atomic():
                try:
                    instance.delete()
                    return Response(status=status.HTTP_204_NO_CONTENT)
                except ProtectedError:
                    # Build detailed protected objects info
                    related_strings = []

                    # Professionals referencing this profession
                    professionals = instance.professional_set.all()
                    if professionals.exists():
                        names = list(professionals.values_list('fullname', flat=True)[:5])
                        more = '...' if professionals.count() > 5 else ''
                        related_strings.append(f"{professionals.count()} professional(s): {', '.join(names)}{more}")

                    # Client contacts referencing a professional (which references this profession)
                    from webapp.models import ClientContact
                    contacts = ClientContact.objects.filter(professional__profession=instance)
                    if contacts.exists():
                        cnames = list(contacts.values_list('fullname', flat=True)[:5])
                        more = '...' if contacts.count() > 5 else ''
                        related_strings.append(f"{contacts.count()} client contact(s): {', '.join(cnames)}{more}")

                    err_lines = [
                        "Cannot delete this profession because it is referenced by the following objects:",
                    ]
                    for s in related_strings:
                        err_lines.append(f"• {s}")
                    err_lines.append("Please remove or reassign these related objects first, then try deleting this profession again.")

                    return Response(
                        {
                            "error": "Protected Object",
                            "errormsg": "\n".join(err_lines),
                            "related_objects": related_strings,
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )
        except Profession.DoesNotExist:
            return Response(
                {"error": "Profession not found"},
                status=status.HTTP_404_NOT_FOUND
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
    permission_classes = [IsAuthenticated, RoleBasedPermission]

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
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    lookup_field = 'projcate_id'

    def get(self, request, *args, **kwargs):
        """Get a specific project category"""
        try:
            instance = self.get_object()
            serializer = ProjectCategoryDetailSerializer(instance, context={"request": request})
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
    permission_classes = [IsAuthenticated, RoleBasedPermission]

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
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    lookup_field = 'taskcate_id'

    def get(self, request, *args, **kwargs):
        """Get a specific task category"""
        try:
            instance = self.get_object()
            serializer = TaskCategoryDetailSerializer(instance, context={"request": request})
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


class AuditEventList(generics.ListAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, *args, **kwargs):
        try:
            qs = AuditEvent.objects.select_related('actor', 'target_content_type').all()
            action = request.query_params.get('action')
            actor = request.query_params.get('actor')
            success = request.query_params.get('success')
            start = request.query_params.get('start')
            end = request.query_params.get('end')

            if action:
                qs = qs.filter(action=action)
            if actor:
                qs = qs.filter(actor__consultant_id=actor)
            if success is not None:
                s = success.lower()
                if s in ['true', '1', 'yes']:
                    qs = qs.filter(success=True)
                elif s in ['false', '0', 'no']:
                    qs = qs.filter(success=False)
            if start:
                qs = qs.filter(occurred_at__date__gte=start)
            if end:
                qs = qs.filter(occurred_at__date__lte=end)

            qs = qs.order_by('-occurred_at')[:500]

            data = []
            for ev in qs:
                try:
                    item = {
                        'id': ev.id,
                        'occurred_at': getattr(ev.occurred_at, 'isoformat', lambda: str(ev.occurred_at))(),
                        'actor': getattr(ev.actor, 'fullname', None),
                        'actor_id': getattr(ev.actor, 'consultant_id', None),
                        'action': getattr(ev, 'action', None),
                        'target': {
                            'model': getattr(getattr(ev, 'target_content_type', None), 'model', None),
                            'object_id': getattr(ev, 'target_object_id', None),
                        },
                        'ip_address': getattr(ev, 'ip_address', None),
                        'user_agent': getattr(ev, 'user_agent', None),
                        'success': bool(getattr(ev, 'success', False)),
                        'message': str(getattr(ev, 'message', '') or ''),
                        'metadata': getattr(ev, 'metadata', None),
                    }
                    data.append(item)
                except Exception:
                    # Never break the list because of a single bad row
                    try:
                        data.append({'id': ev.id, 'occurred_at': str(ev.occurred_at), 'action': getattr(ev, 'action', None), 'success': bool(getattr(ev, 'success', False))})
                    except Exception:
                        pass

            return Response({'audit_events': data})
        except Exception as e:
            return Response({'error': f'Failed to load audit events: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

