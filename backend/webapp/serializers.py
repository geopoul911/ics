from .models import (
    Country, City, Province, Bank, Client, BankClientAccount, 
    ProjectCategory, Project, AssociatedClient, Document, Profession, 
    Professional, ClientContact, Property, BankProjectAccount, TaskCategory, 
    ProjectTask, TaskComment, Cash, TaxationProject, Notification, InsuranceCarrier
)
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from accounts.models import Consultant

User = get_user_model()

# Basic serializers for reference data
class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = '__all__'
    
    def validate_orderindex(self, value):
        """
        Custom validation for orderindex to provide better error messages
        """
        # Get the current instance (for updates) or None (for creates)
        instance = getattr(self, 'instance', None)
        
        # Check if this orderindex is already taken by another country
        try:
            existing_country = Country.objects.get(orderindex=value)
            # If this is an update and the existing country is the same as the current instance, it's OK
            if instance and existing_country.country_id == instance.country_id:
                return value
            # Otherwise, it's a conflict
            raise serializers.ValidationError(
                f"Order index {value} is already taken by Country: {existing_country.title} (ID: {existing_country.country_id})"
            )
        except Country.DoesNotExist:
            # No conflict, value is OK
            return value
    

    
    def validate_country_id(self, value):
        """
        Custom validation for country_id to provide better error messages
        """
        # Get the current instance (for updates) or None (for creates)
        instance = getattr(self, 'instance', None)
        
        # Check if this country_id is already taken by another country
        try:
            existing_country = Country.objects.get(country_id=value)
            # If this is an update and the existing country is the same as the current instance, it's OK
            if instance and existing_country.country_id == instance.country_id:
                return value
            # Otherwise, it's a conflict
            raise serializers.ValidationError(
                f"Country ID '{value}' is already taken by Country: {existing_country.title}"
            )
        except Country.DoesNotExist:
            # No conflict, value is OK
            return value

class ProvinceSerializer(serializers.ModelSerializer):
    country = CountrySerializer(read_only=True)
    country_id = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = Province
        fields = '__all__'
    
    def validate_orderindex(self, value):
        """
        Custom validation for orderindex to provide better error messages
        """
        # Get the current instance (for updates) or None (for creates)
        instance = getattr(self, 'instance', None)
        
        # Check if this orderindex is already taken by another province
        try:
            existing_province = Province.objects.get(orderindex=value)
            # If this is an update and the existing province is the same as the current instance, it's OK
            if instance and existing_province.province_id == instance.province_id:
                return value
            # Otherwise, it's a conflict
            raise serializers.ValidationError(
                f"Order index {value} is already taken by Province: {existing_province.title} (ID: {existing_province.province_id})"
            )
        except Province.DoesNotExist:
            # No conflict, value is OK
            return value
    
    def validate_province_id(self, value):
        """
        Custom validation for province_id to provide better error messages
        """
        # Get the current instance (for updates) or None (for creates)
        instance = getattr(self, 'instance', None)
        
        # Check if this province_id is already taken by another province
        try:
            existing_province = Province.objects.get(province_id=value)
            # If this is an update and the existing province is the same as the current instance, it's OK
            if instance and existing_province.province_id == instance.province_id:
                return value
            # Otherwise, it's a conflict
            raise serializers.ValidationError(
                f"Province ID '{value}' is already taken by Province: {existing_province.title}"
            )
        except Province.DoesNotExist:
            # No conflict, value is OK
            return value
    

    
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
    
    def validate_orderindex(self, value):
        """
        Custom validation for orderindex to provide better error messages
        """
        # Get the current instance (for updates) or None (for creates)
        instance = getattr(self, 'instance', None)
        
        # Check if this orderindex is already taken by another city
        try:
            existing_city = City.objects.get(orderindex=value)
            # If this is an update and the existing city is the same as the current instance, it's OK
            if instance and existing_city.city_id == instance.city_id:
                return value
            # Otherwise, it's a conflict
            raise serializers.ValidationError(
                f"Order index {value} is already taken by City: {existing_city.title} (ID: {existing_city.city_id})"
            )
        except City.DoesNotExist:
            # No conflict, value is OK
            return value
    
    def validate_city_id(self, value):
        """
        Custom validation for city_id to provide better error messages
        """
        # Get the current instance (for updates) or None (for creates)
        instance = getattr(self, 'instance', None)
        
        # Check if this city_id is already taken by another city
        try:
            existing_city = City.objects.get(city_id=value)
            # If this is an update and the existing city is the same as the current instance, it's OK
            if instance and existing_city.city_id == instance.city_id:
                return value
            # Otherwise, it's a conflict
            raise serializers.ValidationError(
                f"City ID '{value}' is already taken by City: {existing_city.title}"
            )
        except City.DoesNotExist:
            # No conflict, value is OK
            return value
    

    
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
        
        # Check if country is being changed
        country_changed = False
        if country_id:
            try:
                country = Country.objects.get(country_id=country_id)
                # Check if the country is actually changing
                if instance.country != country:
                    country_changed = True
                validated_data['country'] = country
            except Country.DoesNotExist:
                raise serializers.ValidationError(f"Country with ID '{country_id}' does not exist.")
        
        # If country is being changed, automatically clear the province
        if country_changed:
            validated_data['province'] = None
            # Also clear province_id from the data since we're setting province to None
            province_id = None
        
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
        extra_kwargs = {
            'active': {'required': False}  # Default to True
        }

    def validate_insucarrier_id(self, value):
        """Validate insucarrier_id uniqueness"""
        # Get the current instance (for updates) or None (for creates)
        instance = getattr(self, 'instance', None)
        
        # Check if this insucarrier_id is already taken by another insurance carrier
        try:
            existing_carrier = InsuranceCarrier.objects.get(insucarrier_id=value)
            # If this is an update and the existing carrier is the same as the current instance, it's OK
            if instance and existing_carrier.insucarrier_id == instance.insucarrier_id:
                return value
            # Otherwise, it's a conflict
            raise serializers.ValidationError(
                f"Insurance Carrier ID '{value}' is already taken by Carrier: {existing_carrier.title}"
            )
        except InsuranceCarrier.DoesNotExist:
            # No conflict, value is OK
            return value

    def validate_orderindex(self, value):
        """Validate orderindex uniqueness"""
        # Get the current instance (for updates) or None (for creates)
        instance = getattr(self, 'instance', None)
        
        # Check if this orderindex is already taken by another insurance carrier
        try:
            existing_carrier = InsuranceCarrier.objects.get(orderindex=value)
            # If this is an update and the existing carrier is the same as the current instance, it's OK
            if instance and existing_carrier.insucarrier_id == instance.insucarrier_id:
                return value
            # Otherwise, it's a conflict
            raise serializers.ValidationError(
                f"Order index {value} is already taken by Insurance Carrier: {existing_carrier.title} (ID: {existing_carrier.insucarrier_id})"
            )
        except InsuranceCarrier.DoesNotExist:
            # No conflict, value is OK
            return value

    def validate_title(self, value):
        """Validate title format"""
        if not value or len(value.strip()) < 2 or len(value.strip()) > 40:
            raise serializers.ValidationError(
                "Title must be between 2 and 40 characters"
            )
        return value.strip()

    def create(self, validated_data):
        """Create a new insurance carrier instance"""
        # Set default values
        if 'active' not in validated_data:
            validated_data['active'] = True
        
        return super().create(validated_data)

    def update(self, instance, validated_data):
        """Update an existing insurance carrier instance"""
        # Prevent primary key updates - insucarrier_id is immutable
        if 'insucarrier_id' in validated_data and validated_data['insucarrier_id'] != instance.insucarrier_id:
            raise serializers.ValidationError(
                "Insurance Carrier ID cannot be changed once created"
            )
        
        return super().update(instance, validated_data)

class BankSerializer(serializers.ModelSerializer):
    country = CountrySerializer(read_only=True)
    country_id = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = Bank
        fields = '__all__'
        extra_kwargs = {
            'active': {'required': False}  # Default to True
        }

    def validate_bank_id(self, value):
        """Validate bank_id uniqueness"""
        # Get the current instance (for updates) or None (for creates)
        instance = getattr(self, 'instance', None)
        
        # Check if this bank_id is already taken by another bank
        try:
            existing_bank = Bank.objects.get(bank_id=value)
            # If this is an update and the existing bank is the same as the current instance, it's OK
            if instance and existing_bank.bank_id == instance.bank_id:
                return value
            # Otherwise, it's a conflict
            raise serializers.ValidationError(
                f"Bank ID '{value}' is already taken by Bank: {existing_bank.bankname}"
            )
        except Bank.DoesNotExist:
            # No conflict, value is OK
            return value

    def validate_orderindex(self, value):
        """Validate orderindex uniqueness"""
        # Get the current instance (for updates) or None (for creates)
        instance = getattr(self, 'instance', None)
        
        # Check if this orderindex is already taken by another bank
        try:
            existing_bank = Bank.objects.get(orderindex=value)
            # If this is an update and the existing bank is the same as the current instance, it's OK
            if instance and existing_bank.bank_id == instance.bank_id:
                return value
            # Otherwise, it's a conflict
            raise serializers.ValidationError(
                f"Order index {value} is already taken by Bank: {existing_bank.bankname} (ID: {existing_bank.bank_id})"
            )
        except Bank.DoesNotExist:
            # No conflict, value is OK
            return value

    def validate_institutionnumber(self, value):
        """Validate institution number format"""
        if not value.isdigit() or len(value) != 3:
            raise serializers.ValidationError(
                "Institution number must be exactly 3 digits"
            )
        return value

    def validate_swiftcode(self, value):
        """Validate SWIFT code format"""
        if not value.isalnum() or len(value) < 8 or len(value) > 11:
            raise serializers.ValidationError(
                "SWIFT code must be 8-11 alphanumeric characters"
            )
        return value.upper()

    def create(self, validated_data):
        """Create a new bank instance"""
        # Handle country_id conversion
        country_id = validated_data.pop('country_id', None)
        if country_id:
            try:
                country = Country.objects.get(country_id=country_id)
                validated_data['country'] = country
            except Country.DoesNotExist:
                raise serializers.ValidationError(f"Country with ID '{country_id}' does not exist.")
        
        # Set default values
        if 'active' not in validated_data:
            validated_data['active'] = True
        
        return super().create(validated_data)

    def update(self, instance, validated_data):
        """Update an existing bank instance"""
        # Handle country_id conversion
        country_id = validated_data.pop('country_id', None)
        if country_id:
            try:
                country = Country.objects.get(country_id=country_id)
                validated_data['country'] = country
            except Country.DoesNotExist:
                raise serializers.ValidationError(f"Country with ID '{country_id}' does not exist.")
        
        # Prevent primary key updates - bank_id is immutable
        if 'bank_id' in validated_data and validated_data['bank_id'] != instance.bank_id:
            raise serializers.ValidationError(
                "Bank ID cannot be changed once created"
            )
        
        return super().update(instance, validated_data)

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
    active = serializers.BooleanField(source='is_active', required=False)
    photo_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Consultant
        fields = [
            'consultant_id', 'orderindex', 'fullname', 'email', 'phone', 'mobile', 
            'photo', 'photo_url', 'role', 'username', 'password', 'is_active', 'is_staff', 
            'canassigntask', 'cashpassport', 'active'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'is_active': {'write_only': True}  # Hide is_active from output, use active instead
        }

    def validate_consultant_id(self, value):
        """Validate consultant_id uniqueness"""
        # Get the current instance (for updates) or None (for creates)
        instance = getattr(self, 'instance', None)
        
        # Check if this consultant_id is already taken by another consultant
        try:
            existing_consultant = Consultant.objects.get(consultant_id=value)
            # If this is an update and the existing consultant is the same as the current instance, it's OK
            if instance and existing_consultant.consultant_id == instance.consultant_id:
                return value
            # Otherwise, it's a conflict
            raise serializers.ValidationError(
                f"Consultant ID '{value}' is already taken by Consultant: {existing_consultant.fullname}"
            )
        except Consultant.DoesNotExist:
            # No conflict, value is OK
            return value

    def validate_orderindex(self, value):
        """Validate orderindex uniqueness"""
        # Get the current instance (for updates) or None (for creates)
        instance = getattr(self, 'instance', None)
        
        # Check if this orderindex is already taken by another consultant
        try:
            existing_consultant = Consultant.objects.get(orderindex=value)
            # If this is an update and the existing consultant is the same as the current instance, it's OK
            if instance and existing_consultant.consultant_id == instance.consultant_id:
                return value
            # Otherwise, it's a conflict
            raise serializers.ValidationError(
                f"Order index {value} is already taken by Consultant: {existing_consultant.fullname} (ID: {existing_consultant.consultant_id})"
            )
        except Consultant.DoesNotExist:
            # No conflict, value is OK
            return value

    def validate_username(self, value):
        """Validate username uniqueness"""
        # Get the current instance (for updates) or None (for creates)
        instance = getattr(self, 'instance', None)
        
        # Check if this username is already taken by another consultant
        try:
            existing_consultant = Consultant.objects.get(username=value)
            # If this is an update and the existing consultant is the same as the current instance, it's OK
            if instance and existing_consultant.consultant_id == instance.consultant_id:
                return value
            # Otherwise, it's a conflict
            raise serializers.ValidationError(
                f"Username '{value}' is already taken by Consultant: {existing_consultant.fullname}"
            )
        except Consultant.DoesNotExist:
            # No conflict, value is OK
            return value

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        
        # Handle the active field mapping
        if 'active' in validated_data:
            validated_data['is_active'] = validated_data.pop('active')
        
        # Use the Manager's create_user method
        username = validated_data.pop('username')
        consultant = Consultant.objects.create_user(
            username=username,
            password=password,
            **validated_data
        )
        return consultant

    def update(self, instance, validated_data):
        # Handle password update
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)

        # Handle the active field mapping
        if 'active' in validated_data:
            validated_data['is_active'] = validated_data.pop('active')

        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance

    def get_photo_url(self, obj):
        """
        Absolute URL to the consultant's photo if present.
        Requires MEDIA settings and request in serializer context.
        """
        if not obj.photo:
            return None
        request = self.context.get("request")
        try:
            url = obj.photo.url
        except Exception:
            return None
        return request.build_absolute_uri(url) if request else url

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
    photo_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Consultant
        fields = ['consultant_id', 'fullname', 'email', 'role', 'active', 'photo_url']

    def get_photo_url(self, obj):
        """
        Absolute URL to the consultant's photo if present.
        Requires MEDIA settings and request in serializer context.
        """
        if not obj.photo:
            return None
        request = self.context.get("request")
        try:
            url = obj.photo.url
        except Exception:
            return None
        return request.build_absolute_uri(url) if request else url

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
