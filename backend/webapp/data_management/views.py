from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from django.db import transaction
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.db.models.deletion import ProtectedError

from webapp.models import Document, Project, Client
from webapp.serializers import (
    DocumentSerializer, DocumentListSerializer, 
    ProjectReferenceSerializer, ClientReferenceSerializer,
    ClientSerializer, ClientListSerializer
)


class AllDocuments(generics.ListCreateAPIView):
    """
    API endpoint for listing all documents and creating new documents.
    """
    serializer_class = DocumentSerializer
    queryset = Document.objects.all().order_by('-created')
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        """Get all documents"""
        try:
            queryset = self.get_queryset()
            data = DocumentListSerializer(queryset, many=True, context={"request": request}).data
            
            return Response({"all_documents": data})
        except Exception as e:
            return Response(
                {"error": f"Failed to retrieve documents: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def post(self, request, *args, **kwargs):
        """Create a new document"""
        serializer = self.get_serializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    document = serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
            except ValidationError as e:
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
            except Exception as e:
                return Response(
                    {"error": f"Failed to create document: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DocumentView(RetrieveUpdateDestroyAPIView):
    """
    API endpoint for retrieving, updating, and deleting a specific document.
    """
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    lookup_field = 'document_id'

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, context={"request": request})
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        # Prevent primary key updates - document_id is immutable
        if 'document_id' in request.data and request.data['document_id'] != instance.document_id:
            return Response(
                {"error": "Document ID cannot be changed once created"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Use the data directly from request for partial updates
        serializer = self.get_serializer(instance, data=request.data, partial=True, context={"request": request})
        
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    document = serializer.save()
                    return Response(serializer.data)
            except ValidationError as e:
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
            except Exception as e:
                return Response(
                    {"error": f"Failed to update document: {str(e)}"},
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
                
                # Add any related object checks here if needed
                # For now, documents don't have direct foreign key relationships that would prevent deletion
                
                if related_objects:
                    return Response(
                        {"error": f"Cannot delete document. It is referenced by: {', '.join(related_objects)}"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                instance.delete()
                return Response({"message": "Document deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
                
        except ProtectedError as e:
            return Response(
                {"error": f"Cannot delete document. It is referenced by other objects."},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": f"Failed to delete document: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AllProjects(generics.ListAPIView):
    """
    API endpoint for listing all projects for reference.
    """
    serializer_class = ProjectReferenceSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Project.objects.all().order_by('title')
    
    def get(self, request, *args, **kwargs):
        """Get all projects"""
        try:
            queryset = self.get_queryset()
            data = self.get_serializer(queryset, many=True, context={"request": request}).data
            
            return Response({"all_projects": data})
        except Exception as e:
            return Response(
                {"error": f"Failed to retrieve projects: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AllClients(generics.ListCreateAPIView):
    """
    API endpoint for listing all clients and creating new clients.
    """
    serializer_class = ClientSerializer
    queryset = Client.objects.all().order_by('-registrationdate')
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        """Get all clients"""
        try:
            queryset = self.get_queryset()
            data = ClientListSerializer(queryset, many=True, context={"request": request}).data
            
            return Response({"all_clients": data})
        except Exception as e:
            return Response(
                {"error": f"Failed to retrieve clients: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def post(self, request, *args, **kwargs):
        """Create a new client"""
        serializer = self.get_serializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    client = serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
            except ValidationError as e:
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
            except Exception as e:
                return Response(
                    {"error": f"Failed to create client: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ClientView(RetrieveUpdateDestroyAPIView):
    """
    API endpoint for retrieving, updating, and deleting a specific client.
    """
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    lookup_field = 'client_id'

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, context={"request": request})
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        # Prevent primary key updates - client_id is immutable
        if 'client_id' in request.data and request.data['client_id'] != instance.client_id:
            return Response(
                {"error": "Client ID cannot be changed once created"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = self.get_serializer(instance, data=request.data, partial=True, context={"request": request})
        
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    client = serializer.save()
                    return Response(serializer.data)
            except ValidationError as e:
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
            except Exception as e:
                return Response(
                    {"error": f"Failed to update client: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        
        try:
            with transaction.atomic():
                related_objects = []
                
                # Check for related objects that would prevent deletion
                if instance.associated_projects.exists():
                    related_objects.append("Associated Projects")
                if instance.documents.exists():
                    related_objects.append("Documents")
                if instance.bankclientaccount_set.exists():
                    related_objects.append("Bank Accounts")
                if instance.taxationproject_set.exists():
                    related_objects.append("Taxation Projects")
                
                if related_objects:
                    return Response(
                        {"error": f"Cannot delete client. It is referenced by: {', '.join(related_objects)}"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                instance.delete()
                return Response({"message": "Client deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
                
        except ProtectedError as e:
            return Response(
                {"error": f"Cannot delete client. It is referenced by other objects."},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": f"Failed to delete client: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AllClientsReference(generics.ListAPIView):
    """
    API endpoint for listing all clients for reference (used in dropdowns).
    """
    serializer_class = ClientReferenceSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Client.objects.filter(active=True).order_by('surname', 'name')
    
    def get(self, request, *args, **kwargs):
        """Get all clients for reference"""
        try:
            queryset = self.get_queryset()
            data = self.get_serializer(queryset, many=True, context={"request": request}).data
            
            return Response({"all_clients": data})
        except Exception as e:
            return Response(
                {"error": f"Failed to retrieve clients: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
