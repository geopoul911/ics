from .models import (
    Country, City, Province, Bank, Client, BankClientAccount, Consultant, 
    ProjectCategory, Project, AssociatedClient, Document, Profession, 
    Professional, ClientContact, Property, BankProjectAccount, TaskCategory, 
    ProjectTask, TaskComment, Cash, TaxationProject, Notification, InsuranceCarrier
)
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

# Basic serializers for reference data
class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = '__all__'

class ProvinceSerializer(serializers.ModelSerializer):
    country = CountrySerializer(read_only=True)
    country_id = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = Province
        fields = '__all__'
    
    def create(self, validated_data):
        country_id = validated_data.pop('country_id', None)
        if country_id:
            try:
                country = Country.objects.get(country_id=country_id)
                validated_data['country'] = country
            except Country.DoesNotExist:
                raise serializers.ValidationError(f"Country with ID '{country_id}' does not exist.")
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        country_id = validated_data.pop('country_id', None)
        if country_id:
            try:
                country = Country.objects.get(country_id=country_id)
                validated_data['country'] = country
            except Country.DoesNotExist:
                raise serializers.ValidationError(f"Country with ID '{country_id}' does not exist.")
        return super().update(instance, validated_data)

class CitySerializer(serializers.ModelSerializer):
    country = CountrySerializer(read_only=True)
    province = ProvinceSerializer(read_only=True)

    country_id = serializers.CharField(write_only=True, required=False, allow_null=True, allow_blank=True)
    province_id = serializers.CharField(write_only=True, required=False, allow_null=True, allow_blank=True)
    
    class Meta:
        model = City
        fields = '__all__'
    
    def create(self, validated_data):
        country_id = validated_data.pop('country_id', None)
        province_id = validated_data.pop('province_id', None)
        
        if country_id:
            try:
                country = Country.objects.get(country_id=country_id)
                validated_data['country'] = country
            except Country.DoesNotExist:
                raise serializers.ValidationError(f"Country with ID '{country_id}' does not exist.")
        
        # Handle province_id - can be None to clear the province
        if province_id is not None:  # Explicitly check for None to allow clearing
            if province_id:  # If not empty string
                try:
                    province = Province.objects.get(province_id=province_id)
                    validated_data['province'] = province
                except Province.DoesNotExist:
                    raise serializers.ValidationError(f"Province with ID '{province_id}' does not exist.")
            else:
                # Clear the province
                validated_data['province'] = None
        
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        country_id = validated_data.pop('country_id', None)
        province_id = validated_data.pop('province_id', None)
        
        if country_id:
            try:
                country = Country.objects.get(country_id=country_id)
                validated_data['country'] = country
            except Country.DoesNotExist:
                raise serializers.ValidationError(f"Country with ID '{country_id}' does not exist.")
        
        # Handle province_id - can be None to clear the province
        if province_id is not None:  # Explicitly check for None to allow clearing
            if province_id:  # If not empty string
                try:
                    province = Province.objects.get(province_id=province_id)
                    validated_data['province'] = province
                except Province.DoesNotExist:
                    raise serializers.ValidationError(f"Province with ID '{province_id}' does not exist.")
            else:
                # Clear the province
                validated_data['province'] = None
        
        return super().update(instance, validated_data)

class InsuranceCarrierSerializer(serializers.ModelSerializer):
    class Meta:
        model = InsuranceCarrier
        fields = '__all__'

class BankSerializer(serializers.ModelSerializer):
    country = CountrySerializer(read_only=True)
    
    class Meta:
        model = Bank
        fields = '__all__'

# Client related serializers
class ClientSerializer(serializers.ModelSerializer):
    country = CountrySerializer(read_only=True)
    province = ProvinceSerializer(read_only=True)
    city = CitySerializer(read_only=True)
    passportcountry = CountrySerializer(read_only=True)
    pensioncountry1 = CountrySerializer(read_only=True)
    pensioncountry2 = CountrySerializer(read_only=True)
    insucarrier1 = InsuranceCarrierSerializer(read_only=True)
    insucarrier2 = InsuranceCarrierSerializer(read_only=True)
    
    class Meta:
        model = Client
        fields = '__all__'

class BankClientAccountSerializer(serializers.ModelSerializer):
    client = ClientSerializer(read_only=True)
    bank = BankSerializer(read_only=True)
    
    class Meta:
        model = BankClientAccount
        fields = '__all__'

# Consultant serializers
class ConsultantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consultant
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        consultant = Consultant(**validated_data)
        if password:
            consultant.set_password(password)
        consultant.save()
        return consultant

# Project related serializers
class ProjectCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectCategory
        fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):
    consultant = ConsultantSerializer(read_only=True)
    categories = ProjectCategorySerializer(many=True, read_only=True)
    
    class Meta:
        model = Project
        fields = '__all__'

class AssociatedClientSerializer(serializers.ModelSerializer):
    project = ProjectSerializer(read_only=True)
    client = ClientSerializer(read_only=True)
    
    class Meta:
        model = AssociatedClient
        fields = '__all__'

# Document serializers
class DocumentSerializer(serializers.ModelSerializer):
    project = ProjectSerializer(read_only=True)
    client = ClientSerializer(read_only=True)
    
    class Meta:
        model = Document
        fields = '__all__'

# Professional serializers
class ProfessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profession
        fields = '__all__'

class ProfessionalSerializer(serializers.ModelSerializer):
    profession = ProfessionSerializer(read_only=True)
    city = CitySerializer(read_only=True)
    
    class Meta:
        model = Professional
        fields = '__all__'

class ClientContactSerializer(serializers.ModelSerializer):
    project = ProjectSerializer(read_only=True)
    professional = ProfessionalSerializer(read_only=True)
    
    class Meta:
        model = ClientContact
        fields = '__all__'

# Property serializers
class PropertySerializer(serializers.ModelSerializer):
    project = ProjectSerializer(read_only=True)
    country = CountrySerializer(read_only=True)
    province = ProvinceSerializer(read_only=True)
    city = CitySerializer(read_only=True)
    
    class Meta:
        model = Property
        fields = '__all__'

class BankProjectAccountSerializer(serializers.ModelSerializer):
    project = ProjectSerializer(read_only=True)
    client = ClientSerializer(read_only=True)
    bankclientacco = BankClientAccountSerializer(read_only=True)
    
    class Meta:
        model = BankProjectAccount
        fields = '__all__'

# Task related serializers
class TaskCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskCategory
        fields = '__all__'

class ProjectTaskSerializer(serializers.ModelSerializer):
    project = ProjectSerializer(read_only=True)
    taskcate = TaskCategorySerializer(read_only=True)
    assigner = ConsultantSerializer(read_only=True)
    assignee = ConsultantSerializer(read_only=True)
    
    class Meta:
        model = ProjectTask
        fields = '__all__'

class TaskCommentSerializer(serializers.ModelSerializer):
    projtask = ProjectTaskSerializer(read_only=True)
    consultant = ConsultantSerializer(read_only=True)
    
    class Meta:
        model = TaskComment
        fields = '__all__'

# Cash and taxation serializers
class CashSerializer(serializers.ModelSerializer):
    project = ProjectSerializer(read_only=True)
    country = CountrySerializer(read_only=True)
    consultant = ConsultantSerializer(read_only=True)
    
    class Meta:
        model = Cash
        fields = '__all__'

class TaxationProjectSerializer(serializers.ModelSerializer):
    client = ClientSerializer(read_only=True)
    consultant = ConsultantSerializer(read_only=True)
    
    class Meta:
        model = TaxationProject
        fields = '__all__'

# Notification serializer
class NotificationSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    related_task = ProjectTaskSerializer(read_only=True)
    related_project = ProjectSerializer(read_only=True)
    
    class Meta:
        model = Notification
        fields = '__all__'

# Nested serializers for detail views
class ProjectDetailSerializer(serializers.ModelSerializer):
    consultant = ConsultantSerializer(read_only=True)
    categories = ProjectCategorySerializer(many=True, read_only=True)
    associated_clients = AssociatedClientSerializer(many=True, read_only=True)
    documents = DocumentSerializer(many=True, read_only=True)
    tasks = ProjectTaskSerializer(many=True, read_only=True)
    properties = PropertySerializer(many=True, read_only=True)
    bank_accounts = BankProjectAccountSerializer(many=True, read_only=True)
    cash_transactions = CashSerializer(many=True, read_only=True)
    contacts = ClientContactSerializer(many=True, read_only=True)
    
    class Meta:
        model = Project
        fields = '__all__'

class ClientDetailSerializer(serializers.ModelSerializer):
    country = CountrySerializer(read_only=True)
    province = ProvinceSerializer(read_only=True)
    city = CitySerializer(read_only=True)
    passportcountry = CountrySerializer(read_only=True)
    pensioncountry1 = CountrySerializer(read_only=True)
    pensioncountry2 = CountrySerializer(read_only=True)
    insucarrier1 = InsuranceCarrierSerializer(read_only=True)
    insucarrier2 = InsuranceCarrierSerializer(read_only=True)
    bank_accounts = BankClientAccountSerializer(many=True, read_only=True)
    associated_projects = AssociatedClientSerializer(many=True, read_only=True)
    documents = DocumentSerializer(many=True, read_only=True)
    taxation_projects = TaxationProjectSerializer(many=True, read_only=True)
    
    class Meta:
        model = Client
        fields = '__all__'

class ProjectTaskDetailSerializer(serializers.ModelSerializer):
    project = ProjectSerializer(read_only=True)
    taskcate = TaskCategorySerializer(read_only=True)
    assigner = ConsultantSerializer(read_only=True)
    assignee = ConsultantSerializer(read_only=True)
    comments = TaskCommentSerializer(many=True, read_only=True)
    
    class Meta:
        model = ProjectTask
        fields = '__all__'

# List serializers for search functionality
class ProjectListSerializer(serializers.ModelSerializer):
    consultant = ConsultantSerializer(read_only=True)
    primary_client = serializers.SerializerMethodField()
    completion_percentage = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = ['project_id', 'title', 'filecode', 'status', 'deadline', 
                 'consultant', 'primary_client', 'completion_percentage', 
                 'registrationdate', 'taxation']
    
    def get_primary_client(self, obj):
        primary = obj.associated_clients.filter(orderindex=0).first()
        if primary:
            return f"{primary.client.surname} {primary.client.name}"
        return None
    
    def get_completion_percentage(self, obj):
        return ProjectTask.get_project_completion(obj)

class ClientListSerializer(serializers.ModelSerializer):
    country = CountrySerializer(read_only=True)
    province = ProvinceSerializer(read_only=True)
    city = CitySerializer(read_only=True)
    
    class Meta:
        model = Client
        fields = ['client_id', 'name', 'surname', 'email', 'phone1', 
                 'mobile1', 'country', 'province', 'city', 'active', 
                 'registrationdate']

class ProjectTaskListSerializer(serializers.ModelSerializer):
    project = ProjectSerializer(read_only=True)
    assignee = ConsultantSerializer(read_only=True)
    is_overdue = serializers.SerializerMethodField()
    
    class Meta:
        model = ProjectTask
        fields = ['projtask_id', 'title', 'project', 'status', 'priority', 
                 'deadline', 'assignee', 'is_overdue', 'assigndate']
    
    def get_is_overdue(self, obj):
        return obj.is_overdue

class DocumentListSerializer(serializers.ModelSerializer):
    project = ProjectSerializer(read_only=True)
    client = ClientSerializer(read_only=True)
    is_expired = serializers.SerializerMethodField()
    
    class Meta:
        model = Document
        fields = ['document_id', 'title', 'project', 'client', 'status', 
                 'created', 'validuntil', 'is_expired', 'original']
    
    def get_is_expired(self, obj):
        return obj.is_expired

class CashListSerializer(serializers.ModelSerializer):
    project = ProjectSerializer(read_only=True)
    consultant = ConsultantSerializer(read_only=True)
    
    class Meta:
        model = Cash
        fields = ['cash_id', 'project', 'country', 'trandate', 'consultant', 
                 'kind', 'amountexp', 'amountpay', 'reason']

# Reference data serializers for dropdowns
class CountryReferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ['country_id', 'title', 'currency']

class ProvinceReferenceSerializer(serializers.ModelSerializer):
    country = CountryReferenceSerializer(read_only=True)
    
    class Meta:
        model = Province
        fields = ['province_id', 'title', 'country']

class CityReferenceSerializer(serializers.ModelSerializer):
    country = CountryReferenceSerializer(read_only=True)
    province = ProvinceReferenceSerializer(read_only=True)
    
    class Meta:
        model = City
        fields = ['city_id', 'title', 'country', 'province']

class BankReferenceSerializer(serializers.ModelSerializer):
    country = CountryReferenceSerializer(read_only=True)
    
    class Meta:
        model = Bank
        fields = ['bank_id', 'bankname', 'country', 'institutionnumber', 'swiftcode']

class ConsultantReferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consultant
        fields = ['consultant_id', 'fullname', 'email', 'role', 'active']

class ProjectCategoryReferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectCategory
        fields = ['projcate_id', 'title', 'active']

class TaskCategoryReferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskCategory
        fields = ['taskcate_id', 'title', 'active']

class ProfessionReferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profession
        fields = ['profession_id', 'title']

class ProfessionalReferenceSerializer(serializers.ModelSerializer):
    profession = ProfessionReferenceSerializer(read_only=True)
    city = CityReferenceSerializer(read_only=True)
    
    class Meta:
        model = Professional
        fields = ['professional_id', 'fullname', 'profession', 'city', 'reliability', 'active']

class InsuranceCarrierReferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = InsuranceCarrier
        fields = ['insucarrier_id', 'title', 'active']
