from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from webapp.permissions import RoleBasedPermission
from rest_framework.authentication import TokenAuthentication
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from django.db import transaction
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.db.models.deletion import ProtectedError
from django.http import Http404

from webapp.models import Document, Project, Client, ClientContact, BankClientAccount, AssociatedClient, TaskComment, Property, Cash, Professional, TaxationProject, BankProjectAccount
from webapp.notification_utils import (
    send_notifications_for_project,
    send_notifications_for_task,
    send_notifications_for_task_comment,
)
from webapp.serializers import (
    DocumentSerializer, DocumentListSerializer, 
    ProjectReferenceSerializer, ProjectSerializer, ProjectListSerializer, ProjectDetailSerializer, ClientReferenceSerializer,
    ClientSerializer, ClientDetailSerializer, ClientListSerializer,
    ClientContactSerializer, ClientContactListSerializer, ProfessionalDetailSerializer,
    BankClientAccountSerializer, BankClientAccountListSerializer, BankClientAccountDetailSerializer,
    AssociatedClientSerializer,
    TaskCommentSerializer, PropertySerializer, PropertyListSerializer,
    CashSerializer, CashListSerializer,
    ProfessionalSerializer, ProfessionalReferenceSerializer,
    TaxationProjectSerializer, TaxationProjectListSerializer,
    BankProjectAccountSerializer,
    ProjectTaskSerializer, ProjectTaskListSerializer,
)


class AllDocuments(generics.ListCreateAPIView):
    """
    API endpoint for listing all documents and creating new documents.
    """
    serializer_class = DocumentSerializer
    queryset = Document.objects.all().order_by('-created')
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    
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
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, RoleBasedPermission]

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
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    
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


class AllProjectsCRUD(generics.ListCreateAPIView):
    """
    API endpoint for listing all projects and creating new projects.
    """
    serializer_class = ProjectListSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get_queryset(self):
        return Project.objects.all().order_by('-registrationdate')

    def get(self, request, *args, **kwargs):
        """Get all projects"""
        try:
            queryset = self.get_queryset()
            data = self.get_serializer(queryset, many=True, context={"request": request}).data
            return Response({"all_projects": data})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, *args, **kwargs):
        """Create a new project"""
        serializer = ProjectSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    project = serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
            except ValidationError as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({"error": f"Failed to create project: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProjectView(RetrieveUpdateDestroyAPIView):
    """
    API endpoint for retrieving, updating, and deleting a single project.
    """
    serializer_class = ProjectSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    lookup_field = 'project_id'

    def get_queryset(self):
        return Project.objects.all()

    def get(self, request, *args, **kwargs):
        """Get a single project with full related objects"""
        try:
            instance = self.get_object()
            serializer = ProjectDetailSerializer(instance, context={"request": request})
            return Response(serializer.data)
        except Http404:
            return Response({"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, *args, **kwargs):
        """Update a project"""
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True, context={"request": request})
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    project = serializer.save()
                    return Response(serializer.data)
            except ValidationError as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({"error": f"Failed to update project: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        """Delete a project"""
        instance = self.get_object()
        try:
            with transaction.atomic():
                try:
                    self.perform_destroy(instance)
                    return Response(status=status.HTTP_204_NO_CONTENT)
                except ProtectedError:
                    # Build detailed protected info
                    related_info = []
                    # Associated clients
                    from webapp.models import AssociatedClient, Document, ProjectTask, Cash, BankProjectAccount, Property, ClientContact
                    assocs = AssociatedClient.objects.filter(project=instance)
                    if assocs.exists():
                        names = list(assocs.values_list('client__surname', flat=True)[:5])
                        more = '...' if assocs.count() > 5 else ''
                        related_info.append(f"{assocs.count()} associated client(s): {', '.join(names)}{more}")
                    # Documents
                    docs = Document.objects.filter(project=instance)
                    if docs.exists():
                        titles = list(docs.values_list('title', flat=True)[:5])
                        more = '...' if docs.count() > 5 else ''
                        related_info.append(f"{docs.count()} document(s): {', '.join(titles)}{more}")
                    # Tasks
                    tasks = ProjectTask.objects.filter(project=instance)
                    if tasks.exists():
                        tnames = list(tasks.values_list('title', flat=True)[:5])
                        more = '...' if tasks.count() > 5 else ''
                        related_info.append(f"{tasks.count()} task(s): {', '.join(tnames)}{more}")
                    # Cash
                    cash = Cash.objects.filter(project=instance)
                    if cash.exists():
                        related_info.append(f"{cash.count()} cash record(s)")
                    # Bank project accounts
                    bpas = BankProjectAccount.objects.filter(project=instance)
                    if bpas.exists():
                        related_info.append(f"{bpas.count()} bank project account(s)")
                    # Note: TaxationProject is not linked to Project, so we skip it here
                    # Properties
                    props = Property.objects.filter(project=instance)
                    if props.exists():
                        related_info.append(f"{props.count()} propert(y/ies)")
                    # Client contacts
                    contacts = ClientContact.objects.filter(project=instance)
                    if contacts.exists():
                        related_info.append(f"{contacts.count()} client contact(s)")

                    err_lines = [
                        "Cannot delete this project because it is referenced by the following objects:",
                    ]
                    for s in related_info:
                        err_lines.append(f"• {s}")
                    err_lines.append("Please remove or reassign these related objects first, then try deleting this project again.")

                    return Response(
                        {
                            "error": "Protected Object",
                            "errormsg": "\n".join(err_lines),
                            "related_objects": related_info,
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )
        except Exception as e:
            return Response({"error": f"Failed to delete project: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Associated Client Views
class AllAssociatedClients(generics.ListCreateAPIView):
    """
    API endpoint for listing all associated clients and creating new ones.
    """
    serializer_class = AssociatedClientSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    
    def get_queryset(self):
        return AssociatedClient.objects.all().order_by('orderindex', 'client__surname', 'client__name')
    
    def get(self, request, *args, **kwargs):
        """Get all associated clients"""
        try:
            queryset = self.get_queryset()
            data = self.get_serializer(queryset, many=True, context={"request": request}).data
            
            return Response({"all_associated_clients": data})
        except Exception as e:
            return Response(
                {"error": f"Failed to retrieve associated clients: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def post(self, request, *args, **kwargs):
        """Create a new associated client"""
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {"error": f"Failed to create associated client: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class AssociatedClientView(RetrieveUpdateDestroyAPIView):
    """
    API endpoint for retrieving, updating, and deleting a specific associated client.
    """
    serializer_class = AssociatedClientSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    lookup_field = 'assoclient_id'
    
    def get_queryset(self):
        return AssociatedClient.objects.all()
    
    def get_object(self):
        assoclient_id = self.kwargs.get('assoclient_id')
        try:
            return AssociatedClient.objects.get(assoclient_id=assoclient_id)
        except AssociatedClient.DoesNotExist:
            raise Http404("Associated Client not found")
    
    def put(self, request, *args, **kwargs):
        """Update an associated client"""
        try:
            associated_client = self.get_object()
            serializer = self.get_serializer(associated_client, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {"error": f"Failed to update associated client: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def delete(self, request, *args, **kwargs):
        """Delete an associated client"""
        try:
            associated_client = self.get_object()
            associated_client.delete()
            return Response({"message": "Associated Client deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except ProtectedError:
            return Response(
                {"error": "Cannot delete associated client because it has related records"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
                         return Response(
                 {"error": f"Failed to delete associated client: {str(e)}"},
                 status=status.HTTP_500_INTERNAL_SERVER_ERROR
             )


# Task Comment Views
class AllTaskComments(generics.ListCreateAPIView):
    """
    API endpoint for listing all task comments and creating new ones.
    """
    serializer_class = TaskCommentSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    
    def get_queryset(self):
        return TaskComment.objects.all().order_by('-commentregistration')
    
    def get(self, request, *args, **kwargs):
        """Get all task comments"""
        try:
            queryset = self.get_queryset()
            data = self.get_serializer(queryset, many=True, context={"request": request}).data
            
            return Response({"all_task_comments": data})
        except Exception as e:
            return Response(
                {"error": f"Failed to retrieve task comments: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def post(self, request, *args, **kwargs):
        """Create a new task comment"""
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            obj = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {"error": f"Failed to create task comment: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class TaskCommentView(RetrieveUpdateDestroyAPIView):
    """
    API endpoint for retrieving, updating, and deleting a specific task comment.
    """
    serializer_class = TaskCommentSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    lookup_field = 'taskcomm_id'
    
    def get_queryset(self):
        return TaskComment.objects.all()
    
    def get_object(self):
        taskcomm_id = self.kwargs.get('taskcomm_id')
        try:
            return TaskComment.objects.get(taskcomm_id=taskcomm_id)
        except TaskComment.DoesNotExist:
            raise Http404("Task Comment not found")
    
    def put(self, request, *args, **kwargs):
        """Update a task comment"""
        try:
            task_comment = self.get_object()
            serializer = self.get_serializer(task_comment, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {"error": f"Failed to update task comment: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def delete(self, request, *args, **kwargs):
        """Delete a task comment"""
        try:
            task_comment = self.get_object()
            task_comment.delete()
            return Response({"message": "Task Comment deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except ProtectedError:
            return Response(
                {"error": "Cannot delete task comment because it has related records"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": f"Failed to delete task comment: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# Project Task Views
class AllProjectTasks(generics.ListCreateAPIView):
    """
    API endpoint for listing all project tasks and creating new ones.
    """
    serializer_class = ProjectTaskSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get_queryset(self):
        from webapp.models import ProjectTask
        return ProjectTask.objects.all().order_by('-assigndate')

    def get(self, request, *args, **kwargs):
        """Get all project tasks"""
        try:
            queryset = self.get_queryset()
            data = ProjectTaskListSerializer(queryset, many=True, context={"request": request}).data
            return Response({"all_project_tasks": data})
        except Exception as e:
            return Response(
                {"error": f"Failed to retrieve project tasks: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def post(self, request, *args, **kwargs):
        """Create a new project task"""
        try:
            # Permission: only users who can assign tasks
            user = request.user
            if not getattr(user, 'canassigntask', False):
                return Response({"error": "You are not allowed to assign tasks."}, status=status.HTTP_403_FORBIDDEN)

            # Default assigner to the current user when not provided by client
            payload = request.data.copy()
            if not payload.get('assigner_id'):
                current_id = getattr(user, 'consultant_id', None)
                if current_id:
                    payload['assigner_id'] = current_id

            serializer = self.get_serializer(data=payload, context={"request": request})
            serializer.is_valid(raise_exception=True)
            with transaction.atomic():
                obj = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {"error": f"Failed to create project task: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ProjectTaskView(RetrieveUpdateDestroyAPIView):
    """
    API endpoint for retrieving, updating, and deleting a specific project task.
    """
    serializer_class = ProjectTaskSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    lookup_field = 'projtask_id'

    def get_queryset(self):
        from webapp.models import ProjectTask
        return ProjectTask.objects.all()

    def get(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, context={"request": request})
            return Response(serializer.data)
        except Http404:
            return Response({"error": "Project Task not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True, context={"request": request})
            serializer.is_valid(raise_exception=True)
            with transaction.atomic():
                obj = serializer.save()
            return Response(serializer.data)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": f"Failed to update project task: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            instance.delete()
            return Response({"message": "Project Task deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except ProtectedError:
            return Response(
                {"error": "Cannot delete project task because it has related records"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": f"Failed to delete project task: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class AllClients(generics.ListCreateAPIView):
    """
    API endpoint for listing all clients and creating new clients.
    """
    serializer_class = ClientSerializer
    queryset = Client.objects.all().order_by('-registrationdate')
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    
    def get_queryset(self):
        qs = Client.objects.all()
        try:
            insucarrier = self.request.query_params.get('insucarrier')
            if insucarrier:
                from django.db.models import Q
                qs = qs.filter(
                    Q(insucarrier1__insucarrier_id=insucarrier) |
                    Q(insucarrier2__insucarrier_id=insucarrier)
                )
        except Exception:
            pass
        return qs.order_by('-registrationdate')

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
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = ClientDetailSerializer(instance, context={"request": request})
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
                # Build detailed related info similar to Regions delete responses
                # Associated Projects (via AssociatedClient)
                try:
                    assoc_qs = instance.associated_projects.select_related('project')
                except Exception:
                    assoc_qs = instance.associated_projects.all()
                if assoc_qs.exists():
                    titles = []
                    for ac in assoc_qs[:5]:
                        try:
                            titles.append(getattr(ac.project, 'title', str(ac.project)))
                        except Exception:
                            titles.append(str(ac))
                    more_suffix = '...' if assoc_qs.count() > 5 else ''
                    related_objects.append(f"{assoc_qs.count()} associated project(s): {', '.join(titles)}{more_suffix}")

                # Documents
                docs_qs = instance.documents.all()
                if docs_qs.exists():
                    titles = [d.title for d in docs_qs[:5]]
                    more_suffix = '...' if docs_qs.count() > 5 else ''
                    related_objects.append(f"{docs_qs.count()} document(s): {', '.join(titles)}{more_suffix}")

                # Bank Client Accounts
                bca_qs = instance.bankclientaccount_set.all()
                if bca_qs.exists():
                    accts = [getattr(b, 'accountnumber', str(b)) for b in bca_qs[:5]]
                    more_suffix = '...' if bca_qs.count() > 5 else ''
                    related_objects.append(f"{bca_qs.count()} bank account(s): {', '.join(accts)}{more_suffix}")

                # Taxation Projects
                tax_qs = instance.taxationproject_set.all()
                if tax_qs.exists():
                    ids_list = [getattr(t, 'taxproj_id', str(t)) for t in tax_qs[:5]]
                    more_suffix = '...' if tax_qs.count() > 5 else ''
                    related_objects.append(f"{tax_qs.count()} taxation project(s): {', '.join(ids_list)}{more_suffix}")

                if related_objects:
                    # Compose multiline human-friendly message
                    err_lines = [
                        f"Cannot delete client '{instance.surname} {instance.name}' because it is referenced by:",
                        "",
                    ]
                    for ro in related_objects:
                        err_lines.append(f"• {ro}")
                    err_lines += [
                        "",
                        "Please remove or reassign these related objects before deleting the client.",
                    ]
                    return Response(
                        {"errormsg": "\n".join(err_lines), "related_objects": related_objects},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                instance.delete()
                return Response({"message": "Client deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
                
        except ProtectedError as e:
            return Response(
                {"errormsg": f"Cannot delete client '{instance.surname} {instance.name}' because it is referenced by other objects.",
                 "related_objects": []},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": f"Failed to delete client: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AllClientContacts(generics.ListCreateAPIView):
    """
    API endpoint for listing all client contacts and creating new client contacts.
    """
    serializer_class = ClientContactSerializer
    queryset = ClientContact.objects.all().order_by('fullname')
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    
    def get(self, request, *args, **kwargs):
        """Get all client contacts"""
        try:
            queryset = self.get_queryset()
            data = ClientContactListSerializer(queryset, many=True, context={"request": request}).data
            
            return Response({"all_client_contacts": data})
        except Exception as e:
            return Response(
                {"error": f"Failed to retrieve client contacts: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def post(self, request, *args, **kwargs):
        """Create a new client contact"""
        serializer = self.get_serializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    client_contact = serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
            except ValidationError as e:
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
            except Exception as e:
                return Response(
                    {"error": f"Failed to create client contact: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ClientContactView(RetrieveUpdateDestroyAPIView):
    """
    API endpoint for retrieving, updating, and deleting a specific client contact.
    """
    queryset = ClientContact.objects.all()
    serializer_class = ClientContactSerializer
    lookup_field = 'clientcont_id'
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, context={"request": request})
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        # Prevent primary key updates - clientcont_id is immutable
        if 'clientcont_id' in request.data and request.data['clientcont_id'] != instance.clientcont_id:
            return Response(
                {"error": "Client Contact ID cannot be changed once created"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = self.get_serializer(instance, data=request.data, partial=True, context={"request": request})
        
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    client_contact = serializer.save()
                    return Response(serializer.data)
            except ValidationError as e:
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
            except Exception as e:
                return Response(
                    {"error": f"Failed to update client contact: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        
        try:
            with transaction.atomic():
                instance.delete()
                return Response({"message": "Client contact deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
                
        except ProtectedError as e:
            return Response(
                {"error": f"Cannot delete client contact. It is referenced by other objects."},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": f"Failed to delete client contact: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AllClientContactsReference(generics.ListAPIView):
    """
    API endpoint for listing all client contacts for reference (used in dropdowns).
    """
    serializer_class = ClientContactListSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    
    def get_queryset(self):
        return ClientContact.objects.filter(active=True).order_by('fullname')
    
    def get(self, request, *args, **kwargs):
        """Get all client contacts for reference"""
        try:
            queryset = self.get_queryset()
            data = self.get_serializer(queryset, many=True, context={"request": request}).data
            
            return Response({"all_client_contacts": data})
        except Exception as e:
            return Response(
                {"error": f"Failed to retrieve client contacts: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AllBankClientAccounts(generics.ListCreateAPIView):
    """
    API endpoint for listing all bank client accounts and creating new bank client accounts.
    """
    serializer_class = BankClientAccountSerializer
    queryset = BankClientAccount.objects.all().order_by('accountnumber')
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    
    def get(self, request, *args, **kwargs):
        """Get all bank client accounts"""
        try:
            queryset = self.get_queryset()
            data = BankClientAccountListSerializer(queryset, many=True, context={"request": request}).data
            
            return Response({"all_bank_client_accounts": data})
        except Exception as e:
            return Response(
                {"error": f"Failed to retrieve bank client accounts: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def post(self, request, *args, **kwargs):
        """Create a new bank client account"""
        serializer = self.get_serializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    bank_client_account = serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
            except ValidationError as e:
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
            except Exception as e:
                return Response(
                    {"error": f"Failed to create bank client account: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BankClientAccountView(RetrieveUpdateDestroyAPIView):
    """
    API endpoint for retrieving, updating, and deleting a specific bank client account.
    """
    queryset = BankClientAccount.objects.all()
    serializer_class = BankClientAccountDetailSerializer
    lookup_field = 'bankclientacco_id'
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, context={"request": request})
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        # Prevent primary key updates - bankclientacco_id is immutable
        if 'bankclientacco_id' in request.data and request.data['bankclientacco_id'] != instance.bankclientacco_id:
            return Response(
                {"error": "Bank Client Account ID cannot be changed once created"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = self.get_serializer(instance, data=request.data, partial=True, context={"request": request})
        
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    bank_client_account = serializer.save()
                    return Response(serializer.data)
            except ValidationError as e:
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
            except Exception as e:
                return Response(
                    {"error": f"Failed to update bank client account: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        
        try:
            with transaction.atomic():
                instance.delete()
                return Response({"message": "Bank client account deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
                
        except ProtectedError as e:
            return Response(
                {"error": f"Cannot delete bank client account. It is referenced by other objects."},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": f"Failed to delete bank client account: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AllBankClientAccountsReference(generics.ListAPIView):
    """
    API endpoint for listing all bank client accounts for reference (used in dropdowns).
    """
    serializer_class = BankClientAccountListSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    
    def get_queryset(self):
        return BankClientAccount.objects.filter(active=True).order_by('accountnumber')
    
    def get(self, request, *args, **kwargs):
        """Get all bank client accounts for reference"""
        try:
            queryset = self.get_queryset()
            data = self.get_serializer(queryset, many=True, context={"request": request}).data
            
            return Response({"all_bank_client_accounts": data})
        except Exception as e:
            return Response(
                {"error": f"Failed to retrieve bank client accounts: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AllClientsReference(generics.ListAPIView):
    """
    API endpoint for listing all clients for reference (used in dropdowns).
    """
    serializer_class = ClientReferenceSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    
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


class AllProperties(generics.ListCreateAPIView):
    """
    API endpoint for listing all properties and creating new properties.
    """
    serializer_class = PropertySerializer
    queryset = Property.objects.all().order_by('property_id')
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    
    def get(self, request, *args, **kwargs):
        """Get all properties"""
        try:
            queryset = self.get_queryset()
            data = PropertyListSerializer(queryset, many=True, context={"request": request}).data
            
            return Response({"all_properties": data})
        except Exception as e:
            return Response(
                {"error": f"Failed to retrieve properties: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def post(self, request, *args, **kwargs):
        """Create a new property"""
        serializer = self.get_serializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    property_obj = serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
            except ValidationError as e:
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
            except Exception as e:
                return Response(
                    {"error": f"Failed to create property: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PropertyView(RetrieveUpdateDestroyAPIView):
    """
    API endpoint for retrieving, updating, and deleting a specific property.
    """
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    lookup_field = 'property_id'
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, context={"request": request})
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        # Prevent primary key updates - property_id is immutable
        if 'property_id' in request.data and request.data['property_id'] != instance.property_id:
            return Response(
                {"error": "Property ID cannot be changed once created"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = self.get_serializer(instance, data=request.data, partial=True, context={"request": request})
        
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    property_obj = serializer.save()
                    return Response(serializer.data)
            except ValidationError as e:
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
            except Exception as e:
                return Response(
                    {"error": f"Failed to update property: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        
        try:
            with transaction.atomic():
                instance.delete()
                return Response({"message": "Property deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
                
        except ProtectedError as e:
            return Response(
                {"error": f"Cannot delete property. It is referenced by other objects."},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": f"Failed to delete property: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AllCash(generics.ListCreateAPIView):
    """
    API endpoint for listing all cash entries and creating new cash entries.
    """
    serializer_class = CashSerializer
    queryset = Cash.objects.all().order_by('-trandate')
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    
    def get(self, request, *args, **kwargs):
        """Get all cash entries, filtered by user's cash passport countries if applicable"""
        try:
            queryset = self.get_queryset()

            # Permission filter by cash passport countries
            user = request.user
            try:
                role = getattr(user, 'role', None)
                is_super = bool(getattr(user, 'is_superuser', False)) or role in ['A', 'S']
            except Exception:
                is_super = False

            if not is_super:
                codes = []
                try:
                    raw = getattr(user, 'cashpassport', None)
                    if raw:
                        codes = [c.strip() for c in str(raw).split(',') if c.strip()]
                except Exception:
                    codes = []
                if codes:
                    from django.db.models import Q
                    q = Q()
                    for code in codes:
                        q |= Q(country__country_id=code)
                    queryset = queryset.filter(q)
                else:
                    queryset = queryset.none()

            data = CashListSerializer(queryset, many=True, context={"request": request}).data
            return Response({"all_cash": data})
        except Exception as e:
            return Response(
                {"error": f"Failed to retrieve cash entries: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def post(self, request, *args, **kwargs):
        """Create a new cash entry"""
        serializer = self.get_serializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    cash_entry = serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
            except ValidationError as e:
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
            except Exception as e:
                return Response(
                    {"error": f"Failed to create cash entry: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CashView(RetrieveUpdateDestroyAPIView):
    """
    API endpoint for retrieving, updating, and deleting a specific cash entry.
    """
    queryset = Cash.objects.all()
    serializer_class = CashSerializer
    lookup_field = 'cash_id'
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        # Enforce view permission for specific cash entry based on cash passport countries
        try:
            user = request.user
            role = getattr(user, 'role', None)
            is_super = bool(getattr(user, 'is_superuser', False)) or role in ['A', 'S']
            if not is_super:
                allowed = []
                raw = getattr(user, 'cashpassport', None)
                if raw:
                    allowed = [c.strip() for c in str(raw).split(',') if c.strip()]
                if not allowed or str(instance.country.country_id) not in allowed:
                    return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)
        except Exception:
            return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(instance, context={"request": request})
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        # Prevent primary key updates - cash_id is immutable
        if 'cash_id' in request.data and request.data['cash_id'] != instance.cash_id:
            return Response(
                {"error": "Cash ID cannot be changed once created"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = self.get_serializer(instance, data=request.data, partial=True, context={"request": request})
        
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    cash_entry = serializer.save()
                    return Response(serializer.data)
            except ValidationError as e:
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
            except Exception as e:
                return Response(
                    {"error": f"Failed to update cash entry: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        
        try:
            with transaction.atomic():
                instance.delete()
                return Response({"message": "Cash entry deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
                
        except ProtectedError as e:
            return Response(
                {"error": f"Cannot delete cash entry. It is referenced by other objects."},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": f"Failed to delete cash entry: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AllBankProjectAccounts(generics.ListCreateAPIView):
    """
    API endpoint for listing all bank project accounts and creating new bank project accounts.
    """
    serializer_class = BankProjectAccountSerializer
    queryset = BankProjectAccount.objects.all().order_by('bankprojacco_id')
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    
    def get(self, request, *args, **kwargs):
        """Get all bank project accounts"""
        try:
            queryset = self.get_queryset()
            data = self.get_serializer(queryset, many=True, context={"request": request}).data
            return Response({"all_bank_project_accounts": data})
        except Exception as e:
            return Response(
                {"error": f"Failed to retrieve bank project accounts: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def post(self, request, *args, **kwargs):
        """Create a new bank project account"""
        serializer = self.get_serializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    bank_project_account = serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
            except ValidationError as e:
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
            except Exception as e:
                return Response(
                    {"error": f"Failed to create bank project account: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BankProjectAccountView(RetrieveUpdateDestroyAPIView):
    """
    API endpoint for retrieving, updating, and deleting a specific bank project account.
    """
    queryset = BankProjectAccount.objects.all()
    serializer_class = BankProjectAccountSerializer
    lookup_field = 'bankprojacco_id'
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, context={"request": request})
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        # Prevent primary key updates - bankprojacco_id is immutable
        if 'bankprojacco_id' in request.data and request.data['bankprojacco_id'] != instance.bankprojacco_id:
            return Response(
                {"error": "Bank Project Account ID cannot be changed once created"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(instance, data=request.data, partial=True, context={"request": request})

        if serializer.is_valid():
            try:
                with transaction.atomic():
                    bank_project_account = serializer.save()
                    return Response(serializer.data)
            except ValidationError as e:
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
            except Exception as e:
                return Response(
                    {"error": f"Failed to update bank project account: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()

        try:
            with transaction.atomic():
                instance.delete()
                return Response({"message": "Bank project account deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

        except ProtectedError as e:
            return Response(
                {"error": f"Cannot delete bank project account. It is referenced by other objects."},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": f"Failed to delete bank project account: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AllProfessionalsReference(generics.ListAPIView):
    """
    API endpoint for listing all professionals for reference (dropdowns).
    """
    serializer_class = ProfessionalReferenceSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get_queryset(self):
        return Professional.objects.filter(active=True).order_by('fullname')

    def get(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            data = self.get_serializer(queryset, many=True, context={"request": request}).data
            return Response({"all_professionals": data})
        except Exception as e:
            return Response({"error": f"Failed to retrieve professionals: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AllProfessionals(generics.ListCreateAPIView):
    """
    API endpoint for listing all professionals and creating new ones.
    """
    serializer_class = ProfessionalSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get_queryset(self):
        return Professional.objects.all().order_by('fullname')

    def get(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            data = ProfessionalReferenceSerializer(queryset, many=True, context={"request": request}).data
            return Response({"all_professionals": data})
        except Exception as e:
            return Response({"error": f"Failed to retrieve professionals: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    obj = serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
            except ValidationError as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({"error": f"Failed to create professional: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfessionalView(RetrieveUpdateDestroyAPIView):
    """
    API endpoint for retrieving, updating, and deleting a specific professional.
    """
    queryset = Professional.objects.all()
    serializer_class = ProfessionalSerializer
    lookup_field = 'professional_id'
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = ProfessionalDetailSerializer(instance, context={"request": request})
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True, context={"request": request})
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    obj = serializer.save()
                    return Response(serializer.data)
            except ValidationError as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({"error": f"Failed to update professional: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        try:
            with transaction.atomic():
                instance.delete()
                return Response({"message": "Professional deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except ProtectedError:
            return Response({"error": "Cannot delete professional because it has related records"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": f"Failed to delete professional: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AllTaxationProjects(generics.ListCreateAPIView):
    serializer_class = TaxationProjectSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get_queryset(self):
        return TaxationProject.objects.all().order_by('-deadline')

    def get(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            data = TaxationProjectListSerializer(queryset, many=True, context={"request": request}).data
            return Response({"all_taxation_projects": data})
        except Exception as e:
            return Response({"error": f"Failed to retrieve taxation projects: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    obj = serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
            except ValidationError as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({"error": f"Failed to create taxation project: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TaxationProjectView(RetrieveUpdateDestroyAPIView):
    queryset = TaxationProject.objects.all()
    serializer_class = TaxationProjectSerializer
    lookup_field = 'taxproj_id'
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, context={"request": request})
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True, context={"request": request})
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    obj = serializer.save()
                    return Response(serializer.data)
            except ValidationError as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({"error": f"Failed to update taxation project: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        try:
            with transaction.atomic():
                instance.delete()
                return Response({"message": "Taxation project deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except ProtectedError:
            return Response({"error": "Cannot delete taxation project because it has related records"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": f"Failed to delete taxation project: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
