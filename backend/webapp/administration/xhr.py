from webapp.models import (
    User,
    Bank,
    InsuranceCarrier,
    Profession,
    ProjectCategory,
    TaskCategory,
)
from accounts.models import Consultant
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from django.db.models import ProtectedError
import logging

logger = logging.getLogger(__name__)


# Returns user instance
def get_user(token):
    user = Token.objects.get(key=token).user
    return user


class DeleteConsultant(APIView):
    """
    URL: delete_consultant/
    Descr: Delete a consultant
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            consultant_id = request.data.get('consultant_id')
            if not consultant_id:
                return Response(
                    {"error": "Consultant ID is required."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            consultant = Consultant.objects.get(consultant_id=consultant_id)
            consultant.delete()
            
            return Response(
                {"message": f"Consultant '{consultant.fullname}' deleted successfully."},
                status=status.HTTP_200_OK
            )

        except Consultant.DoesNotExist:
            return Response(
                {"error": f"Consultant with ID '{consultant_id}' not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except ProtectedError as e:
            # Get the related objects that are preventing deletion
            related_objects = []
            
            # Check for related projects
            related_projects = consultant.project_set.all()
            if related_projects.exists():
                related_objects.append({
                    'model': 'Projects',
                    'count': related_projects.count(),
                    'items': list(related_projects.values_list('title', flat=True)[:5])  # First 5 project titles
                })
            
            # Check for related cash transactions
            related_cash = consultant.cash_set.all()
            if related_cash.exists():
                related_objects.append({
                    'model': 'Cash Transactions',
                    'count': related_cash.count(),
                    'items': list(related_cash.values_list('description', flat=True)[:5])  # First 5 descriptions
                })
            
            # Check for related properties
            related_properties = consultant.property_set.all()
            if related_properties.exists():
                related_objects.append({
                    'model': 'Properties',
                    'count': related_properties.count(),
                    'items': list(related_properties.values_list('title', flat=True)[:5])  # First 5 property titles
                })
            
            # Check for related clients
            related_clients = consultant.client_set.all()
            if related_clients.exists():
                related_objects.append({
                    'model': 'Clients',
                    'count': related_clients.count(),
                    'items': list(related_clients.values_list('fullname', flat=True)[:5])  # First 5 client names
                })
            
            # Check for related banks
            related_banks = consultant.bank_set.all()
            if related_banks.exists():
                related_objects.append({
                    'model': 'Banks',
                    'count': related_banks.count(),
                    'items': list(related_banks.values_list('title', flat=True)[:5])  # First 5 bank names
                })
            
            return Response(
                {
                    "error": "Cannot delete consultant because it has related objects.",
                    "related_objects": related_objects
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error deleting consultant {consultant_id}: {str(e)}")
            return Response(
                {"error": f"Failed to delete consultant: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class DeleteBank(APIView):
    """
    URL: delete_bank/
    Descr: Delete a bank
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            bank_id = request.data.get('bank_id')
            if not bank_id:
                return Response(
                    {"error": "Bank ID is required."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            bank = Bank.objects.get(bank_id=bank_id)
            bank.delete()
            
            return Response(
                {"message": f"Bank '{bank.bankname}' deleted successfully."},
                status=status.HTTP_200_OK
            )

        except Bank.DoesNotExist:
            return Response(
                {"error": f"Bank with ID '{bank_id}' not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except ProtectedError as e:
            # Get the related objects that are preventing deletion
            related_objects = []
            
            # Check for related bank client accounts
            related_accounts = bank.bankclientaccount_set.all()
            if related_accounts.exists():
                related_objects.append({
                    'model': 'Bank Client Accounts',
                    'count': related_accounts.count(),
                    'items': list(related_accounts.values_list('accountnumber', flat=True)[:5])  # First 5 account numbers
                })
            
            # Check for related bank project accounts
            related_project_accounts = bank.bankprojectaccount_set.all()
            if related_project_accounts.exists():
                related_objects.append({
                    'model': 'Bank Project Accounts',
                    'count': related_project_accounts.count(),
                    'items': list(related_project_accounts.values_list('project__title', flat=True)[:5])  # First 5 project titles
                })
            
            return Response(
                {
                    "error": "Cannot delete bank because it has related objects.",
                    "related_objects": related_objects
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error deleting bank {bank_id}: {str(e)}")
            return Response(
                {"error": f"Failed to delete bank: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class DeleteInsuranceCarrier(APIView):
    """
    URL: delete_insurance_carrier/
    Descr: Delete an insurance carrier
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            insucarrier_id = request.data.get('insucarrier_id')
            if not insucarrier_id:
                return Response(
                    {"error": "Insurance Carrier ID is required."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            insurance_carrier = InsuranceCarrier.objects.get(insucarrier_id=insucarrier_id)
            insurance_carrier.delete()
            
            return Response(
                {"message": f"Insurance Carrier '{insurance_carrier.title}' deleted successfully."},
                status=status.HTTP_200_OK
            )

        except InsuranceCarrier.DoesNotExist:
            return Response(
                {"error": f"Insurance Carrier with ID '{insucarrier_id}' not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except ProtectedError as e:
            # Get the related objects that are preventing deletion
            related_objects = []
            
            # Check for related clients (insucarrier1)
            related_clients1 = insurance_carrier.clients_insucarrier1.all()
            if related_clients1.exists():
                related_objects.append({
                    'model': 'Clients (Primary Insurance)',
                    'count': related_clients1.count(),
                    'items': list(related_clients1.values_list('surname', flat=True)[:5])  # First 5 client surnames
                })
            
            # Check for related clients (insucarrier2)
            related_clients2 = insurance_carrier.clients_insucarrier2.all()
            if related_clients2.exists():
                related_objects.append({
                    'model': 'Clients (Secondary Insurance)',
                    'count': related_clients2.count(),
                    'items': list(related_clients2.values_list('surname', flat=True)[:5])  # First 5 client surnames
                })
            
            return Response(
                {
                    "error": "Cannot delete insurance carrier because it has related objects.",
                    "related_objects": related_objects
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error deleting insurance carrier {insucarrier_id}: {str(e)}")
            return Response(
                {"error": f"Failed to delete insurance carrier: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class DeleteProfession(APIView):
    """
    URL: delete_profession/
    Descr: Delete a profession
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            profession_id = request.data.get('profession_id')
            if not profession_id:
                return Response(
                    {"error": "Profession ID is required."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            profession = Profession.objects.get(profession_id=profession_id)
            profession.delete()
            
            return Response(
                {"message": "Profession deleted successfully"},
                status=status.HTTP_200_OK
            )
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


class DeleteProjectCategory(APIView):
    """
    URL: delete_project_category/
    Descr: Delete a project category
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            projcate_id = request.data.get('projcate_id')
            if not projcate_id:
                return Response(
                    {"error": "Project Category ID is required."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            project_category = ProjectCategory.objects.get(projcate_id=projcate_id)
            project_category.delete()
            
            return Response(
                {"message": "Project Category deleted successfully"},
                status=status.HTTP_200_OK
            )
        except ProjectCategory.DoesNotExist:
            return Response(
                {"error": "Project Category not found"},
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


class DeleteTaskCategory(APIView):
    """
    URL: delete_task_category/
    Descr: Delete a task category
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            taskcate_id = request.data.get('taskcate_id')
            if not taskcate_id:
                return Response(
                    {"error": "Task Category ID is required."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            task_category = TaskCategory.objects.get(taskcate_id=taskcate_id)
            task_category.delete()
            
            return Response(
                {"message": "Task Category deleted successfully"},
                status=status.HTTP_200_OK
            )
        except TaskCategory.DoesNotExist:
            return Response(
                {"error": "Task Category not found"},
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