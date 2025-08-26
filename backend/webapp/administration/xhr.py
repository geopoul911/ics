from webapp.models import (
    User,
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
            
            error_message = f"Cannot delete Consultant '{consultant.fullname}' because it is referenced by:"
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
        except Exception as e:
            logger.error(f"Error deleting consultant: {e}")
            return Response(
                {"error": "An error occurred while deleting the consultant."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
