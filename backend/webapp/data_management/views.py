from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count, Sum
from django.utils import timezone
from datetime import datetime, timedelta
from django.db.models.deletion import ProtectedError

from webapp.models import (
    Bank, Client, BankClientAccount, Consultant,
    ProjectCategory, Project, AssociatedClient, Document, Profession,
    Professional, ClientContact, Property, BankProjectAccount, TaskCategory,
    ProjectTask, TaskComment, Cash, TaxationProject, Notification, InsuranceCarrier
)

from webapp.serializers import (
    # Basic serializers
    BankSerializer, InsuranceCarrierSerializer,
    
    # Client serializers
    ClientSerializer, BankClientAccountSerializer, ClientDetailSerializer,
    ClientListSerializer,
    
    # Consultant serializers
    ConsultantSerializer,
    
    # Project serializers
    ProjectCategorySerializer, ProjectSerializer, ProjectDetailSerializer,
    ProjectListSerializer, AssociatedClientSerializer,
    
    # Document serializers
    DocumentSerializer, DocumentListSerializer,
    
    # Professional serializers
    ProfessionSerializer, ProfessionalSerializer, ClientContactSerializer,
    
    # Property serializers
    PropertySerializer, BankProjectAccountSerializer,
    
    # Task serializers
    TaskCategorySerializer, ProjectTaskSerializer, ProjectTaskDetailSerializer,
    ProjectTaskListSerializer, TaskCommentSerializer,
    
    # Cash and taxation serializers
    CashSerializer, TaxationProjectSerializer, CashListSerializer,
    
    # Notification serializer
    NotificationSerializer,
    
    # Reference serializers
    BankReferenceSerializer, ConsultantReferenceSerializer, ProjectCategoryReferenceSerializer,
    TaskCategoryReferenceSerializer, ProfessionReferenceSerializer, ProfessionalReferenceSerializer,
    InsuranceCarrierReferenceSerializer
)

# Reference Data Viewsets

class BankViewSet(viewsets.ModelViewSet):
    queryset = Bank.objects.filter(active=True).order_by('orderindex', 'bankname')
    serializer_class = BankSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['bankname', 'institutionnumber', 'swiftcode']
    ordering_fields = ['bankname', 'orderindex']
    filterset_fields = ['country', 'active']

class InsuranceCarrierViewSet(viewsets.ModelViewSet):
    queryset = InsuranceCarrier.objects.filter(active=True).order_by('orderindex', 'title')
    serializer_class = InsuranceCarrierSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title']
    ordering_fields = ['title', 'orderindex']
    filterset_fields = ['active']

# Client Viewsets
class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all().order_by('surname', 'name')
    serializer_class = ClientSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'surname', 'email', 'phone1', 'mobile1', 'afm', 'sin']
    ordering_fields = ['surname', 'name', 'registrationdate']
    filterset_fields = ['country', 'province', 'city', 'active', 'deceased', 'taxmanagement']

    def get_serializer_class(self):
        if self.action == 'list':
            return ClientListSerializer
        elif self.action == 'retrieve':
            return ClientDetailSerializer
        return ClientSerializer

    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '')
        if query:
            clients = self.queryset.filter(
                Q(name__icontains=query) | 
                Q(surname__icontains=query) | 
                Q(email__icontains=query) |
                Q(phone1__icontains=query) |
                Q(mobile1__icontains=query)
            )
            serializer = ClientListSerializer(clients, many=True)
            return Response(serializer.data)
        return Response([])

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        total_clients = self.queryset.count()
        active_clients = self.queryset.filter(active=True).count()
        deceased_clients = self.queryset.filter(deceased=True).count()
        tax_management_clients = self.queryset.filter(taxmanagement=True).count()
        
        # Clients by country
        clients_by_country = self.queryset.values('country__title').annotate(
            count=Count('client_id')
        ).order_by('-count')[:10]
        
        return Response({
            'total_clients': total_clients,
            'active_clients': active_clients,
            'deceased_clients': deceased_clients,
            'tax_management_clients': tax_management_clients,
            'clients_by_country': clients_by_country
        })

class BankClientAccountViewSet(viewsets.ModelViewSet):
    queryset = BankClientAccount.objects.filter(active=True).order_by('client__surname', 'client__name')
    serializer_class = BankClientAccountSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['accountnumber', 'iban', 'client__name', 'client__surname']
    ordering_fields = ['client__surname', 'client__name']
    filterset_fields = ['client', 'bank', 'active']

# Consultant Viewsets
class ConsultantViewSet(viewsets.ModelViewSet):
    queryset = Consultant.objects.filter(active=True).order_by('orderindex', 'fullname')
    serializer_class = ConsultantSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['fullname', 'email', 'username']
    ordering_fields = ['fullname', 'orderindex']
    filterset_fields = ['role', 'active', 'canassigntask']

    def get_serializer_class(self):
        if self.action == 'list':
            return ConsultantReferenceSerializer
        return ConsultantSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

# Project Viewsets
class ProjectCategoryViewSet(viewsets.ModelViewSet):
    queryset = ProjectCategory.objects.filter(active=True).order_by('orderindex', 'title')
    serializer_class = ProjectCategorySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title']
    ordering_fields = ['title', 'orderindex']
    filterset_fields = ['active']

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all().order_by('-registrationdate')
    serializer_class = ProjectSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'filecode']
    ordering_fields = ['title', 'registrationdate', 'deadline', 'status']
    filterset_fields = ['status', 'consultant', 'taxation', 'categories']

    def get_serializer_class(self):
        if self.action == 'list':
            return ProjectListSerializer
        elif self.action == 'retrieve':
            return ProjectDetailSerializer
        return ProjectSerializer

    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '')
        if query:
            projects = self.queryset.filter(
                Q(title__icontains=query) | 
                Q(filecode__icontains=query)
            )
            serializer = ProjectListSerializer(projects, many=True)
            return Response(serializer.data)
        return Response([])

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        total_projects = self.queryset.count()
        projects_by_status = self.queryset.values('status').annotate(
            count=Count('project_id')
        )
        
        # Overdue projects
        overdue_projects = self.queryset.filter(
            deadline__lt=timezone.now().date(),
            status__in=['Created', 'Assigned', 'Inprogress']
        ).count()
        
        # Projects by consultant
        projects_by_consultant = self.queryset.values('consultant__fullname').annotate(
            count=Count('project_id')
        ).order_by('-count')[:10]
        
        return Response({
            'total_projects': total_projects,
            'projects_by_status': projects_by_status,
            'overdue_projects': overdue_projects,
            'projects_by_consultant': projects_by_consultant
        })

class AssociatedClientViewSet(viewsets.ModelViewSet):
    queryset = AssociatedClient.objects.all().order_by('orderindex', 'client__surname')
    serializer_class = AssociatedClientSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = ['orderindex', 'client__surname']
    filterset_fields = ['project', 'client']

# Document Viewsets
class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all().order_by('-created')
    serializer_class = DocumentSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title']
    ordering_fields = ['title', 'created', 'validuntil']
    filterset_fields = ['project', 'client', 'status', 'original', 'trafficable']

    def get_serializer_class(self):
        if self.action == 'list':
            return DocumentListSerializer
        return DocumentSerializer

    @action(detail=False, methods=['get'])
    def expired(self, request):
        expired_docs = self.queryset.filter(validuntil__lt=timezone.now().date())
        serializer = DocumentListSerializer(expired_docs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def expiring_soon(self, request):
        # Documents expiring in the next 30 days
        thirty_days_from_now = timezone.now().date() + timedelta(days=30)
        expiring_soon = self.queryset.filter(
            validuntil__gte=timezone.now().date(),
            validuntil__lte=thirty_days_from_now
        )
        serializer = DocumentListSerializer(expiring_soon, many=True)
        return Response(serializer.data)

# Professional Viewsets
class ProfessionViewSet(viewsets.ModelViewSet):
    queryset = Profession.objects.all().order_by('title')
    serializer_class = ProfessionSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title']
    ordering_fields = ['title']

class ProfessionalViewSet(viewsets.ModelViewSet):
    queryset = Professional.objects.filter(active=True).order_by('fullname')
    serializer_class = ProfessionalSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['fullname', 'email', 'phone', 'mobile']
    ordering_fields = ['fullname']
    filterset_fields = ['profession', 'city', 'reliability', 'active']

    def get_serializer_class(self):
        if self.action == 'list':
            return ProfessionalReferenceSerializer
        return ProfessionalSerializer

class ClientContactViewSet(viewsets.ModelViewSet):
    queryset = ClientContact.objects.filter(active=True).order_by('fullname')
    serializer_class = ClientContactSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['fullname', 'email', 'phone', 'mobile']
    ordering_fields = ['fullname']
    filterset_fields = ['project', 'professional', 'reliability', 'active']

# Property Viewsets
class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.filter(active=True).order_by('description')
    serializer_class = PropertySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['description', 'location']
    ordering_fields = ['description', 'location']
    filterset_fields = ['project', 'country', 'province', 'city', 'type', 'status', 'market', 'active']

class BankProjectAccountViewSet(viewsets.ModelViewSet):
    queryset = BankProjectAccount.objects.all()
    serializer_class = BankProjectAccountSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = ['project__title']
    filterset_fields = ['project', 'client', 'bankclientacco']

# Task Viewsets
class TaskCategoryViewSet(viewsets.ModelViewSet):
    queryset = TaskCategory.objects.filter(active=True).order_by('orderindex', 'title')
    serializer_class = TaskCategorySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title']
    ordering_fields = ['title', 'orderindex']
    filterset_fields = ['active']

class ProjectTaskViewSet(viewsets.ModelViewSet):
    queryset = ProjectTask.objects.filter(active=True).order_by('-assigndate', 'priority', 'deadline')
    serializer_class = ProjectTaskSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'details']
    ordering_fields = ['title', 'assigndate', 'deadline', 'priority', 'status']
    filterset_fields = ['project', 'taskcate', 'assigner', 'assignee', 'priority', 'status', 'active']

    def get_serializer_class(self):
        if self.action == 'list':
            return ProjectTaskListSerializer
        elif self.action == 'retrieve':
            return ProjectTaskDetailSerializer
        return ProjectTaskSerializer

    @action(detail=False, methods=['get'])
    def overdue(self, request):
        overdue_tasks = self.queryset.filter(
            deadline__lt=timezone.now().date(),
            status__in=['Created', 'Assigned', 'Inprogress']
        )
        serializer = ProjectTaskListSerializer(overdue_tasks, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def my_tasks(self, request):
        consultant_id = request.query_params.get('consultant_id')
        if consultant_id:
            my_tasks = self.queryset.filter(assignee_id=consultant_id)
            serializer = ProjectTaskListSerializer(my_tasks, many=True)
            return Response(serializer.data)
        return Response({'error': 'consultant_id parameter required'}, status=400)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        total_tasks = self.queryset.count()
        tasks_by_status = self.queryset.values('status').annotate(
            count=Count('projtask_id')
        )
        
        overdue_tasks = self.queryset.filter(
            deadline__lt=timezone.now().date(),
            status__in=['Created', 'Assigned', 'Inprogress']
        ).count()
        
        tasks_by_priority = self.queryset.values('priority').annotate(
            count=Count('projtask_id')
        )
        
        return Response({
            'total_tasks': total_tasks,
            'tasks_by_status': tasks_by_status,
            'overdue_tasks': overdue_tasks,
            'tasks_by_priority': tasks_by_priority
        })

class TaskCommentViewSet(viewsets.ModelViewSet):
    queryset = TaskComment.objects.all().order_by('-commentregistration')
    serializer_class = TaskCommentSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = ['commentregistration']
    filterset_fields = ['projtask', 'consultant']

# Cash and Taxation Viewsets
class CashViewSet(viewsets.ModelViewSet):
    queryset = Cash.objects.all().order_by('-trandate')
    serializer_class = CashSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['reason']
    ordering_fields = ['trandate', 'amountexp', 'amountpay']
    filterset_fields = ['project', 'country', 'consultant', 'kind']

    def get_serializer_class(self):
        if self.action == 'list':
            return CashListSerializer
        return CashSerializer

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        total_expenses = self.queryset.filter(kind='E').aggregate(
            total=Sum('amountexp')
        )['total'] or 0
        
        total_payments = self.queryset.filter(kind='P').aggregate(
            total=Sum('amountpay')
        )['total'] or 0
        
        transactions_by_country = self.queryset.values('country__title').annotate(
            expense_total=Sum('amountexp'),
            payment_total=Sum('amountpay')
        )
        
        return Response({
            'total_expenses': total_expenses,
            'total_payments': total_payments,
            'net_amount': total_payments - total_expenses,
            'transactions_by_country': transactions_by_country
        })

class TaxationProjectViewSet(viewsets.ModelViewSet):
    queryset = TaxationProject.objects.all().order_by('-deadline')
    serializer_class = TaxationProjectSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['client__name', 'client__surname']
    ordering_fields = ['deadline', 'taxuse']
    filterset_fields = ['client', 'consultant', 'declaredone']

    @action(detail=False, methods=['get'])
    def overdue(self, request):
        overdue_tax_projects = self.queryset.filter(
            deadline__lt=timezone.now().date(),
            declaredone=False
        )
        serializer = self.get_serializer(overdue_tax_projects, many=True)
        return Response(serializer.data)

# Notification Viewset
class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all().order_by('-created_at')
    serializer_class = NotificationSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = ['created_at', 'read']
    filterset_fields = ['user', 'type', 'read']

    @action(detail=False, methods=['get'])
    def unread(self, request):
        user_id = request.query_params.get('user_id')
        if user_id:
            unread_notifications = self.queryset.filter(user_id=user_id, read=False)
            serializer = self.get_serializer(unread_notifications, many=True)
            return Response(serializer.data)
        return Response({'error': 'user_id parameter required'}, status=400)

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        notification = self.get_object()
        notification.read = True
        notification.save()
        return Response({'status': 'marked as read'})

# Reference Data Viewsets for dropdowns
class BankReferenceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Bank.objects.filter(active=True).order_by('orderindex', 'bankname')
    serializer_class = BankReferenceSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['bankname']
    filterset_fields = ['country']

class ConsultantReferenceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Consultant.objects.filter(active=True).order_by('orderindex', 'fullname')
    serializer_class = ConsultantReferenceSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['fullname']
    filterset_fields = ['role']

class ProjectCategoryReferenceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProjectCategory.objects.filter(active=True).order_by('orderindex', 'title')
    serializer_class = ProjectCategoryReferenceSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['title']

class TaskCategoryReferenceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TaskCategory.objects.filter(active=True).order_by('orderindex', 'title')
    serializer_class = TaskCategoryReferenceSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['title']

class ProfessionReferenceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Profession.objects.all().order_by('title')
    serializer_class = ProfessionReferenceSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['title']

class ProfessionalReferenceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Professional.objects.filter(active=True).order_by('fullname')
    serializer_class = ProfessionalReferenceSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['fullname']
    filterset_fields = ['profession', 'city', 'reliability']

class InsuranceCarrierReferenceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = InsuranceCarrier.objects.filter(active=True).order_by('orderindex', 'title')
    serializer_class = InsuranceCarrierReferenceSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['title']
