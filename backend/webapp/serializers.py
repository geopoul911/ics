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
# Custom field that allows clearing a FileField by sending empty string/null
class ClearableFileField(serializers.FileField):
    def to_internal_value(self, data):
        if data in ("", None):
            return None
        return super().to_internal_value(data)


# Reference data serializers for dropdowns (must be defined first)
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

class ProjectReferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['project_id', 'title', 'status']

class ClientReferenceSerializer(serializers.ModelSerializer):
    fullname = serializers.SerializerMethodField()
    
    class Meta:
        model = Client
        fields = ['client_id', 'fullname', 'active']
    
    def get_fullname(self, obj):
        return f"{obj.surname} {obj.name}"

# Basic serializers for reference data
class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = '__all__'
        extra_kwargs = {
            'orderindex': {'required': True, 'allow_null': False}
        }
    
    def validate_orderindex(self, value):
        """
        Custom validation for orderindex to provide better error messages
        """
        # Require a value, but do NOT enforce uniqueness
        if value in (None, ""):
            raise serializers.ValidationError("Order index is required.")
        return value

    def validate_title(self, value):
        """Provide clearer error when title uniqueness is violated."""
        value = (value or '').strip()
        if not value or len(value) < 2 or len(value) > 40:
            raise serializers.ValidationError("Title must be between 2 and 40 characters")
        # Uniqueness check with case-insensitive match
        instance = getattr(self, 'instance', None)
        qs = Country.objects.filter(title__iexact=value)
        if instance:
            qs = qs.exclude(country_id=instance.country_id)
        if qs.exists():
            raise serializers.ValidationError(f"Country with title '{value}' already exists")
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
        extra_kwargs = {
            'orderindex': {'required': False, 'allow_null': True}
        }
    
    def validate_orderindex(self, value):
        """
        Order index: required but not unique for Province
        """
        if value in (None, ""):
            raise serializers.ValidationError("Order index is required.")
        return value
    
    def validate_title(self, value):
        value = (value or '').strip()
        if not value or len(value) < 2 or len(value) > 40:
            raise serializers.ValidationError("Title must be between 2 and 40 characters")
        instance = getattr(self, 'instance', None)
        qs = Province.objects.filter(title__iexact=value)
        if instance:
            qs = qs.exclude(province_id=instance.province_id)
        if qs.exists():
            raise serializers.ValidationError(f"Province with title '{value}' already exists")
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
        extra_kwargs = {
            'orderindex': {'required': False, 'allow_null': True}
        }
    
    def validate_orderindex(self, value):
        """
        Order index: required but not unique for City
        """
        if value in (None, ""):
            raise serializers.ValidationError("Order index is required.")
        return value
    
    def validate_title(self, value):
        value = (value or '').strip()
        if not value or len(value) < 2 or len(value) > 40:
            raise serializers.ValidationError("Title must be between 2 and 40 characters")
        instance = getattr(self, 'instance', None)
        qs = City.objects.filter(title__iexact=value)
        if instance:
            qs = qs.exclude(city_id=instance.city_id)
        if qs.exists():
            raise serializers.ValidationError(f"City with title '{value}' already exists")
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
        
        # Province is required for City
        if not province_id:
            raise serializers.ValidationError({"province_id": "Province is required."})
        try:
            province = Province.objects.get(province_id=province_id)
        except Province.DoesNotExist:
            raise serializers.ValidationError(f"Province with ID '{province_id}' does not exist.")
        # If both provided, ensure province belongs to selected country (when country provided)
        if country_id and province.country.country_id != country_id:
            raise serializers.ValidationError({"province_id": "Selected province does not belong to selected country."})
        validated_data['province'] = province
        
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
        
        # Province handling
        if country_changed and not province_id:
            # Cannot change country without supplying a valid province simultaneously
            raise serializers.ValidationError({"province_id": "Province is required when changing country."})

        if province_id is not None:
            if province_id == "":
                # Province cannot be cleared (non-nullable FK)
                raise serializers.ValidationError({"province_id": "Province is required."})
            try:
                province = Province.objects.get(province_id=province_id)
            except Province.DoesNotExist:
                raise serializers.ValidationError(f"Province with ID '{province_id}' does not exist.")
            # If country also changing/provided, validate province-country consistency
            target_country_id = country_id or getattr(validated_data.get('country', instance.country), 'country_id', instance.country.country_id)
            if province.country.country_id != target_country_id:
                raise serializers.ValidationError({"province_id": "Selected province does not belong to selected country."})
            validated_data['province'] = province
        
        return super().update(instance, validated_data)

class InsuranceCarrierSerializer(serializers.ModelSerializer):
    class Meta:
        model = InsuranceCarrier
        fields = '__all__'
        extra_kwargs = {
            'active': {'required': False},  # Default to True
            'orderindex': {'required': True, 'allow_null': False}
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
        """Order index is required but not unique for InsuranceCarrier."""
        if value in (None, ""):
            raise serializers.ValidationError("Order index is required.")
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
            'active': {'required': False},  # Default to True
            'orderindex': {'required': True, 'allow_null': False}
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

    def validate_bankname(self, value):
        """Validate bankname case-insensitive uniqueness and return clear message"""
        instance = getattr(self, 'instance', None)
        queryset = Bank.objects.filter(bankname__iexact=value)
        if instance:
            queryset = queryset.exclude(pk=instance.pk)
        if queryset.exists():
            raise serializers.ValidationError(f"Bank name '{value}' already exists.")
        return value

    def validate_orderindex(self, value):
        """Order index is required but not unique for Bank."""
        if value in (None, ""):
            raise serializers.ValidationError("Order index is required.")
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
    
    # Write-only fields for foreign keys
    country_id = serializers.CharField(write_only=True, required=False)
    province_id = serializers.CharField(write_only=True, required=False)
    city_id = serializers.CharField(write_only=True, required=False)
    passportcountry_id = serializers.CharField(write_only=True, required=False, allow_null=True, allow_blank=True)
    pensioncountry1_id = serializers.CharField(write_only=True, required=False, allow_null=True, allow_blank=True)
    pensioncountry2_id = serializers.CharField(write_only=True, required=False, allow_null=True, allow_blank=True)
    insucarrier1_id = serializers.CharField(write_only=True, required=False, allow_null=True, allow_blank=True)
    insucarrier2_id = serializers.CharField(write_only=True, required=False, allow_null=True, allow_blank=True)
    
    class Meta:
        model = Client
        fields = '__all__'
        extra_kwargs = {
            'active': {'required': False},  # Default to True
        }

    def validate_client_id(self, value):
        """Validate client_id uniqueness"""
        instance = getattr(self, 'instance', None)
        try:
            existing_client = Client.objects.get(client_id=value)
            if instance and existing_client.client_id == instance.client_id:
                return value
            raise serializers.ValidationError(
                f"Client ID '{value}' is already taken by Client: {existing_client.surname} {existing_client.name}"
            )
        except Client.DoesNotExist:
            return value

    def validate_email(self, value):
        """Validate email format and uniqueness"""
        if value:
            # Check email format
            import re
            email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
            if not re.match(email_pattern, value):
                raise serializers.ValidationError("Invalid email format.")
            
            # Check uniqueness
            instance = getattr(self, 'instance', None)
            try:
                existing_client = Client.objects.get(email=value)
                if instance and existing_client.client_id == instance.client_id:
                    return value
                raise serializers.ValidationError(
                    f"Email '{value}' is already taken by Client: {existing_client.surname} {existing_client.name}"
                )
            except Client.DoesNotExist:
                return value
        return value

    def validate_afm(self, value):
        """Validate AFM format"""
        if value:
            if not value.isdigit() or len(value) != 9:
                raise serializers.ValidationError("AFM must be exactly 9 digits.")
        return value

    def validate_sin(self, value):
        """Validate SIN format"""
        if value:
            if not value.isdigit() or len(value) != 9:
                raise serializers.ValidationError("SIN must be exactly 9 digits.")
        return value

    def validate_amka(self, value):
        """Validate AMKA format"""
        if value:
            if not value.isdigit() or len(value) != 11:
                raise serializers.ValidationError("AMKA must be exactly 11 digits.")
        return value

    def create(self, validated_data):
        """Create a new client instance"""
        # Handle foreign key conversions
        self._handle_foreign_keys(validated_data)
        
        # Set default values
        if 'active' not in validated_data:
            validated_data['active'] = True
        
        return super().create(validated_data)

    def update(self, instance, validated_data):
        """Update an existing client instance"""
        # Handle foreign key conversions
        self._handle_foreign_keys(validated_data)
        
        # Prevent primary key updates - client_id is immutable
        if 'client_id' in validated_data and validated_data['client_id'] != instance.client_id:
            raise serializers.ValidationError(
                "Client ID cannot be changed once created"
            )
        
        return super().update(instance, validated_data)

    def _handle_foreign_keys(self, validated_data):
        """Handle foreign key field conversions"""
        from webapp.models import Country, Province, City, InsuranceCarrier
        
        # Handle required foreign keys
        country_id = validated_data.pop('country_id', None)
        if country_id:
            try:
                country = Country.objects.get(country_id=country_id)
                validated_data['country'] = country
            except Country.DoesNotExist:
                raise serializers.ValidationError(f"Country with ID '{country_id}' does not exist.")
        
        province_id = validated_data.pop('province_id', None)
        if province_id:
            try:
                province = Province.objects.get(province_id=province_id)
                validated_data['province'] = province
            except Province.DoesNotExist:
                raise serializers.ValidationError(f"Province with ID '{province_id}' does not exist.")
        
        city_id = validated_data.pop('city_id', None)
        if city_id:
            try:
                city = City.objects.get(city_id=city_id)
                validated_data['city'] = city
            except City.DoesNotExist:
                raise serializers.ValidationError(f"City with ID '{city_id}' does not exist.")
        
        # Handle optional foreign keys
        passportcountry_id = validated_data.pop('passportcountry_id', None)
        if passportcountry_id:
            try:
                passportcountry = Country.objects.get(country_id=passportcountry_id)
                validated_data['passportcountry'] = passportcountry
            except Country.DoesNotExist:
                raise serializers.ValidationError(f"Passport Country with ID '{passportcountry_id}' does not exist.")
        
        _missing = object()
        pensioncountry1_id = validated_data.pop('pensioncountry1_id', _missing)
        if pensioncountry1_id is not _missing:
            if pensioncountry1_id:
                try:
                    pensioncountry1 = Country.objects.get(country_id=pensioncountry1_id)
                    validated_data['pensioncountry1'] = pensioncountry1
                except Country.DoesNotExist:
                    raise serializers.ValidationError(f"Pension Country 1 with ID '{pensioncountry1_id}' does not exist.")
            else:
                # Explicitly clear when empty string or null provided
                validated_data['pensioncountry1'] = None
        
        pensioncountry2_id = validated_data.pop('pensioncountry2_id', _missing)
        if pensioncountry2_id is not _missing:
            if pensioncountry2_id:
                try:
                    pensioncountry2 = Country.objects.get(country_id=pensioncountry2_id)
                    validated_data['pensioncountry2'] = pensioncountry2
                except Country.DoesNotExist:
                    raise serializers.ValidationError(f"Pension Country 2 with ID '{pensioncountry2_id}' does not exist.")
            else:
                # Explicitly clear when empty string or null provided
                validated_data['pensioncountry2'] = None
        
        insucarrier1_id = validated_data.pop('insucarrier1_id', _missing)
        if insucarrier1_id is not _missing:
            if insucarrier1_id:
                try:
                    insucarrier1 = InsuranceCarrier.objects.get(insucarrier_id=insucarrier1_id)
                    validated_data['insucarrier1'] = insucarrier1
                except InsuranceCarrier.DoesNotExist:
                    raise serializers.ValidationError(f"Insurance Carrier 1 with ID '{insucarrier1_id}' does not exist.")
            else:
                validated_data['insucarrier1'] = None
        
        insucarrier2_id = validated_data.pop('insucarrier2_id', _missing)
        if insucarrier2_id is not _missing:
            if insucarrier2_id:
                try:
                    insucarrier2 = InsuranceCarrier.objects.get(insucarrier_id=insucarrier2_id)
                    validated_data['insucarrier2'] = insucarrier2
                except InsuranceCarrier.DoesNotExist:
                    raise serializers.ValidationError(f"Insurance Carrier 2 with ID '{insucarrier2_id}' does not exist.")
            else:
                validated_data['insucarrier2'] = None

class BankClientAccountSerializer(serializers.ModelSerializer):
    client = ClientReferenceSerializer(read_only=True)
    bank = BankReferenceSerializer(read_only=True)
    
    # Write-only fields for foreign keys
    client_id = serializers.CharField(write_only=True, required=False)
    bank_id = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = BankClientAccount
        fields = '__all__'
        extra_kwargs = {
            'active': {'required': False},  # Default to True
        }

    def validate_bankclientacco_id(self, value):
        """Validate bankclientacco_id uniqueness"""
        instance = getattr(self, 'instance', None)
        try:
            existing_account = BankClientAccount.objects.get(bankclientacco_id=value)
            if instance and existing_account.bankclientacco_id == instance.bankclientacco_id:
                return value
            raise serializers.ValidationError(
                f"Bank Client Account ID '{value}' is already taken by Account: {existing_account.accountnumber}"
            )
        except BankClientAccount.DoesNotExist:
            return value

    def validate_iban(self, value):
        """Validate IBAN format"""
        if value:
            import re
            # Basic IBAN validation - should be alphanumeric and 15-34 characters
            iban_pattern = r'^[A-Z0-9]{15,34}$'
            if not re.match(iban_pattern, value.upper()):
                raise serializers.ValidationError("Invalid IBAN format.")
        return value

    def validate_accountnumber(self, value):
        """Validate account number format"""
        if not value or len(value.strip()) < 1:
            raise serializers.ValidationError("Account number is required.")
        if len(value.strip()) > 20:
            raise serializers.ValidationError("Account number must be at most 20 characters.")
        return value.strip()

    def create(self, validated_data):
        """Create a new bank client account instance"""
        # Handle foreign key conversions
        self._handle_foreign_keys(validated_data)
        
        # Set default values
        if 'active' not in validated_data:
            validated_data['active'] = True
        
        return super().create(validated_data)

    def update(self, instance, validated_data):
        """Update an existing bank client account instance"""
        # Handle foreign key conversions
        self._handle_foreign_keys(validated_data)
        
        return super().update(instance, validated_data)

    def _handle_foreign_keys(self, validated_data):
        """Handle foreign key field conversions"""
        # Handle client_id
        if 'client_id' in validated_data:
            try:
                client = Client.objects.get(client_id=validated_data['client_id'])
                validated_data['client'] = client
                del validated_data['client_id']
            except Client.DoesNotExist:
                raise serializers.ValidationError(f"Client with ID '{validated_data['client_id']}' does not exist.")

        # Handle bank_id
        if 'bank_id' in validated_data:
            try:
                bank = Bank.objects.get(bank_id=validated_data['bank_id'])
                validated_data['bank'] = bank
                del validated_data['bank_id']
            except Bank.DoesNotExist:
                raise serializers.ValidationError(f"Bank with ID '{validated_data['bank_id']}' does not exist.")


class BankClientAccountListSerializer(serializers.ModelSerializer):
    client = ClientReferenceSerializer(read_only=True)
    bank = BankReferenceSerializer(read_only=True)
    
    class Meta:
        model = BankClientAccount
        fields = [
            'bankclientacco_id', 'client', 'bank', 'transitnumber', 
            'accountnumber', 'iban', 'active'
        ]

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
        """Order index is required but not unique for Consultant."""
        if value in (None, ""):
            raise serializers.ValidationError("Order index is required.")
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
        extra_kwargs = {
            'active': {'required': False},  # Default to True
            'orderindex': {'required': True, 'allow_null': False}
        }

    def validate_projcate_id(self, value):
        """Validate projcate_id uniqueness"""
        # Get the current instance (for updates) or None (for creates)
        instance = getattr(self, 'instance', None)
        
        # Check if this projcate_id is already taken by another project category
        try:
            existing_category = ProjectCategory.objects.get(projcate_id=value)
            # If this is an update and the existing category is the same as the current instance, it's OK
            if instance and existing_category.projcate_id == instance.projcate_id:
                return value
            raise serializers.ValidationError("This project category ID is already in use.")
        except ProjectCategory.DoesNotExist:
            return value

    def validate_orderindex(self, value):
        """Order index: required but not unique for ProjectCategory."""
        if value in (None, ""):
            raise serializers.ValidationError("Order index is required.")
        return value

    def validate_title(self, value):
        """Validate title format"""
        if not value or len(value.strip()) < 2:
            raise serializers.ValidationError("Title must be at least 2 characters long.")
        if len(value.strip()) > 40:
            raise serializers.ValidationError("Title must be at most 40 characters long.")
        return value.strip()

    def create(self, validated_data):
        """Create a new project category with validation"""
        # Set default values
        if 'active' not in validated_data:
            validated_data['active'] = True
        return super().create(validated_data)

    def update(self, instance, validated_data):
        """Update project category with validation"""
        # Prevent primary key updates - projcate_id is immutable
        if 'projcate_id' in validated_data and validated_data['projcate_id'] != instance.projcate_id:
            raise serializers.ValidationError(
                "Project Category ID cannot be changed once created"
            )
        return super().update(instance, validated_data)



class ProjectSerializer(serializers.ModelSerializer):
    consultant = ConsultantSerializer(read_only=True)
    categories = ProjectCategorySerializer(many=True, read_only=True)
    # Write-only field for foreign key
    consultant_id = serializers.CharField(write_only=True, required=False, allow_null=True, allow_blank=True)
    # Write-only list for many-to-many categories
    category_ids = serializers.ListField(child=serializers.CharField(), write_only=True, required=False, allow_empty=True)
    
    class Meta:
        model = Project
        fields = '__all__'

    def _assign_fk(self, validated_data, key, model, field_name):
        obj_id = validated_data.pop(key, None)
        if obj_id is None:
            return
        if obj_id == "":
            validated_data[field_name] = None
            return
        try:
            obj = model.objects.get(**{model._meta.pk.name: obj_id})
            validated_data[field_name] = obj
        except model.DoesNotExist:
            raise serializers.ValidationError(f"{model.__name__} with ID '{obj_id}' does not exist.")

    def create(self, validated_data):
        from accounts.models import Consultant
        from webapp.models import ProjectCategory
        # Handle consultant
        self._assign_fk(validated_data, 'consultant_id', Consultant, 'consultant')
        # Handle categories
        category_ids = validated_data.pop('category_ids', None)
        if not category_ids:
            raw = None
            if hasattr(self, 'initial_data'):
                raw = self.initial_data.get('category_ids') or \
                      self.initial_data.get('category_ids[]') or \
                      self.initial_data.get('categoryIds') or \
                      self.initial_data.get('selectedCategories') or \
                      self.initial_data.get('categories') or \
                      self.initial_data.get('categories[]')
            if isinstance(raw, str):
                raw_str = raw.strip()
                # Try JSON decode first
                try:
                    import json
                    decoded = json.loads(raw_str)
                    if isinstance(decoded, list):
                        raw = decoded
                    else:
                        # Fallback to comma-separated parsing
                        category_ids = [x.strip() for x in raw_str.split(',') if x.strip()]
                except Exception:
                    category_ids = [x.strip() for x in raw_str.split(',') if x.strip()]
            if isinstance(raw, list):
                # Could be list of ids or list of objects
                if raw and isinstance(raw[0], dict):
                    category_ids = [x.get('projcate_id') for x in raw if x.get('projcate_id')]
                else:
                    category_ids = raw
            if category_ids is None:
                category_ids = []
        taxation = validated_data.get('taxation', False)
        if taxation and category_ids:
            raise serializers.ValidationError({'categories': 'Taxation projects cannot have categories.'})
        project = super().create(validated_data)
        if category_ids:
            categories = list(ProjectCategory.objects.filter(projcate_id__in=category_ids))

            print(len(categories))
            print(len(set(category_ids)))
            if len(categories) != len(set(category_ids)):
                raise serializers.ValidationError({'categories': 'One or more category IDs are invalid.'})
            project.categories.set(categories)
        return project

    def update(self, instance, validated_data):
        from accounts.models import Consultant
        from webapp.models import ProjectCategory
        self._assign_fk(validated_data, 'consultant_id', Consultant, 'consultant')
        category_ids = validated_data.pop('category_ids', None)
        if category_ids is None and hasattr(self, 'initial_data'):
            raw = self.initial_data.get('category_ids') or \
                  self.initial_data.get('category_ids[]') or \
                  self.initial_data.get('categoryIds') or \
                  self.initial_data.get('selectedCategories') or \
                  self.initial_data.get('categories') or \
                  self.initial_data.get('categories[]')
            if isinstance(raw, str):
                raw_str = raw.strip()
                try:
                    import json
                    decoded = json.loads(raw_str)
                    if isinstance(decoded, list):
                        raw = decoded
                    else:
                        category_ids = [x.strip() for x in raw_str.split(',') if x.strip()]
                except Exception:
                    category_ids = [x.strip() for x in raw_str.split(',') if x.strip()]
            if isinstance(raw, list):
                if raw and isinstance(raw[0], dict):
                    category_ids = [x.get('projcate_id') for x in raw if x.get('projcate_id')]
                else:
                    category_ids = raw
        taxation = validated_data.get('taxation', instance.taxation)

        # Pre-resolve categories if provided
        categories = None
        if category_ids is not None:
            categories = list(ProjectCategory.objects.filter(projcate_id__in=category_ids)) if category_ids else []
            if category_ids and len(categories) != len(set(category_ids)):
                raise serializers.ValidationError({'categories': 'One or more category IDs are invalid.'})

        # If turning taxation on, ensure categories are cleared BEFORE saving to satisfy model clean()
        if taxation:
            instance.categories.set([])
        # If taxation is false and categories were provided, set them BEFORE save so clean() sees them
        elif categories is not None:
            instance.categories.set(categories)

        project = super().update(instance, validated_data)

        # If caller explicitly provided categories (including empty), ensure final assignment matches request
        if categories is not None:
            project.categories.set(categories)
        return project

class ProjectCategoryDetailSerializer(ProjectCategorySerializer):
    # Use reverse relation name from Project.categories (related_name='projects')
    projects = ProjectSerializer(many=True, read_only=True)

    class Meta(ProjectCategorySerializer.Meta):
        # Explicitly include computed field 'projects'
        fields = ['projcate_id', 'title', 'orderindex', 'active', 'projects']
        
class AssociatedClientSerializer(serializers.ModelSerializer):
    project = ProjectSerializer(read_only=True)
    client = ClientSerializer(read_only=True)
    # Write-only fields for foreign keys
    project_id = serializers.CharField(write_only=True, required=False)
    client_id = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = AssociatedClient
        fields = '__all__'

    def create(self, validated_data):
        """Create a new associated client instance with FK mapping"""
        project_id = validated_data.pop('project_id', None)
        client_id = validated_data.pop('client_id', None)
        if project_id:
            try:
                project = Project.objects.get(project_id=project_id)
                validated_data['project'] = project
            except Project.DoesNotExist:
                raise serializers.ValidationError(f"Project with ID '{project_id}' does not exist.")
        if client_id:
            try:
                client = Client.objects.get(client_id=client_id)
                validated_data['client'] = client
            except Client.DoesNotExist:
                raise serializers.ValidationError(f"Client with ID '{client_id}' does not exist.")
        return super().create(validated_data)

    def update(self, instance, validated_data):
        """Update an existing associated client instance with FK mapping"""
        project_id = validated_data.pop('project_id', None)
        client_id = validated_data.pop('client_id', None)
        if project_id is not None:
            if project_id == "":
                validated_data['project'] = None
            else:
                try:
                    project = Project.objects.get(project_id=project_id)
                    validated_data['project'] = project
                except Project.DoesNotExist:
                    raise serializers.ValidationError(f"Project with ID '{project_id}' does not exist.")
        if client_id is not None:
            if client_id == "":
                validated_data['client'] = None
            else:
                try:
                    client = Client.objects.get(client_id=client_id)
                    validated_data['client'] = client
                except Client.DoesNotExist:
                    raise serializers.ValidationError(f"Client with ID '{client_id}' does not exist.")
        return super().update(instance, validated_data)

# Document serializers
class DocumentSerializer(serializers.ModelSerializer):
    project = ProjectSerializer(read_only=True)
    client = ClientSerializer(read_only=True)
    project_id = serializers.CharField(write_only=True, required=False)
    client_id = serializers.CharField(write_only=True, required=False)
    remove_filepath = serializers.BooleanField(write_only=True, required=False, default=False)
    filepath = ClearableFileField(required=False, allow_null=True)
    
    class Meta:
        model = Document
        fields = '__all__'
        extra_kwargs = {
            'original': {'required': False},  # Default to False
            'trafficable': {'required': False},  # Default to False
            'filepath': {'required': False, 'allow_null': True},
        }

    def validate_document_id(self, value):
        """Validate document_id uniqueness"""
        # Get the current instance (for updates) or None (for creates)
        instance = getattr(self, 'instance', None)
        
        # Check if this document_id is already taken by another document
        try:
            existing_document = Document.objects.get(document_id=value)
            # If this is an update and the existing document is the same as the current instance, it's OK
            if instance and existing_document.document_id == instance.document_id:
                return value
            # Otherwise, it's a conflict
            raise serializers.ValidationError(
                f"Document ID '{value}' is already taken by Document: {existing_document.title}"
            )
        except Document.DoesNotExist:
            # No conflict, value is OK
            return value

    def validate_title(self, value):
        """Validate title format"""
        if not value or len(value.strip()) < 2:
            raise serializers.ValidationError("Title must be at least 2 characters long.")
        if len(value.strip()) > 40:
            raise serializers.ValidationError("Title must be at most 40 characters long.")
        return value.strip()

    def validate_filepath(self, value):
        """Validate uploaded file for FileField; allow clearing by empty string/null."""
        # Allow clearing the file by sending empty string or null
        if value in (None, ""):
            return None

        # When uploading, DRF provides an UploadedFile instance
        try:
            from django.core.files.uploadedfile import UploadedFile
        except Exception:
            UploadedFile = None  # Fallback, should not happen

        if UploadedFile is not None and isinstance(value, UploadedFile):
            # Optionally, we could enforce name length to align with max_length
            if hasattr(value, 'name') and len(value.name) > 255:
                raise serializers.ValidationError("Filename must be at most 255 characters long.")
            return value

        # If a string is provided during updates, treat empty as clear and non-empty as keep-as-is
        if isinstance(value, str):
            if value == "":
                return None
            if len(value) > 255:
                raise serializers.ValidationError("File path must be at most 255 characters long.")
            return value

        # Accept any other file-like object as-is
        return value

    def validate(self, data):
        """Validate that at least one of project or client is set"""
        project_id = data.get('project_id')
        client_id = data.get('client_id')
        
        # For updates, check existing relationships if not provided
        if not project_id and not client_id:
            if hasattr(self, 'instance') and self.instance:
                # This is an update, check existing relationships
                if not self.instance.project and not self.instance.client:
                    raise serializers.ValidationError(
                        "Document must be associated with either a project or a client"
                    )
            else:
                # This is a create, both are required to be provided
                raise serializers.ValidationError(
                    "Document must be associated with either a project or a client"
                )
        
        return data

    def create(self, validated_data):
        """Create a new document instance"""
        # Remove write-only flags that are not model fields
        _ = validated_data.pop('remove_filepath', False)

        # Handle project_id conversion
        project_id = validated_data.pop('project_id', None)
        if project_id:
            try:
                project = Project.objects.get(project_id=project_id)
                validated_data['project'] = project
            except Project.DoesNotExist:
                raise serializers.ValidationError(f"Project with ID '{project_id}' does not exist.")
        
        # Handle client_id conversion
        client_id = validated_data.pop('client_id', None)
        if client_id:
            try:
                client = Client.objects.get(client_id=client_id)
                validated_data['client'] = client
            except Client.DoesNotExist:
                raise serializers.ValidationError(f"Client with ID '{client_id}' does not exist.")
        
        # Set default values
        if 'original' not in validated_data:
            validated_data['original'] = False
        if 'trafficable' not in validated_data:
            validated_data['trafficable'] = False
        
        return super().create(validated_data)

    def update(self, instance, validated_data):
        """Update an existing document instance"""
        # Handle explicit file removal flag, bypassing FileField parsing
        remove_fp = False
        try:
            remove_fp = bool(self.initial_data.get('remove_filepath'))
        except Exception:
            remove_fp = validated_data.pop('remove_filepath', False) or False

        if remove_fp:
            try:
                current_file = getattr(instance, 'filepath', None)
                if current_file:
                    storage = current_file.storage
                    name = current_file.name
                    if storage and name and storage.exists(name):
                        storage.delete(name)
                instance.filepath = None
            except Exception:
                pass

        # Handle project_id conversion
        project_id = validated_data.pop('project_id', None)
        if project_id:
            try:
                project = Project.objects.get(project_id=project_id)
                validated_data['project'] = project
            except Project.DoesNotExist:
                raise serializers.ValidationError(f"Project with ID '{project_id}' does not exist.")
        
        # Handle client_id conversion
        _missing = object()
        client_id = validated_data.pop('client_id', _missing)
        if client_id is not _missing:
            if client_id in (None, ""):
                # Explicitly clear the client when null/empty is provided
                validated_data['client'] = None
            else:
                try:
                    client = Client.objects.get(client_id=client_id)
                    validated_data['client'] = client
                except Client.DoesNotExist:
                    raise serializers.ValidationError(f"Client with ID '{client_id}' does not exist.")

        # Handle filepath removal via payload (legacy path)
        if 'filepath' in validated_data:
            fp_val = validated_data.get('filepath')
            if fp_val in (None, ""):
                try:
                    current_file = getattr(instance, 'filepath', None)
                    if current_file:
                        storage = current_file.storage
                        name = current_file.name
                        if storage and name and storage.exists(name):
                            storage.delete(name)
                except Exception:
                    pass
                validated_data['filepath'] = None
        
        # Prevent primary key updates - document_id is immutable
        if 'document_id' in validated_data and validated_data['document_id'] != instance.document_id:
            raise serializers.ValidationError(
                "Document ID cannot be changed once created"
            )
        
        # Persist other updates
        instance = super().update(instance, validated_data)
        
        # Ensure file removal persists when using remove_filepath flag
        if remove_fp and getattr(instance, 'filepath', None):
            instance.filepath = None
            instance.save(update_fields=['filepath'])
        return instance

# Professional serializers
class ProfessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profession
        fields = '__all__'

    def validate_profession_id(self, value):
        """Validate profession_id uniqueness"""
        # Get the current instance (for updates) or None (for creates)
        instance = getattr(self, 'instance', None)
        
        # Check if this profession_id is already taken by another profession
        try:
            existing_profession = Profession.objects.get(profession_id=value)
            # If this is an update and the existing profession is the same as the current instance, it's OK
            if instance and existing_profession.profession_id == instance.profession_id:
                return value
            raise serializers.ValidationError("This profession ID is already in use.")
        except Profession.DoesNotExist:
            return value

    def validate_title(self, value):
        """Validate title format and uniqueness (case-insensitive)."""
        if not value or len(value.strip()) < 2:
            raise serializers.ValidationError("Title must be at least 2 characters long.")
        if len(value.strip()) > 40:
            raise serializers.ValidationError("Title must be at most 40 characters long.")
        value = value.strip()
        instance = getattr(self, 'instance', None)
        qs = Profession.objects.filter(title__iexact=value)
        if instance:
            qs = qs.exclude(profession_id=instance.profession_id)
        if qs.exists():
            raise serializers.ValidationError(f"Profession with title '{value}' already exists")
        return value

    def create(self, validated_data):
        """Create a new profession with validation"""
        return super().create(validated_data)

    def update(self, instance, validated_data):
        """Update profession with validation"""
        # Prevent primary key updates - profession_id is immutable
        if 'profession_id' in validated_data and validated_data['profession_id'] != instance.profession_id:
            raise serializers.ValidationError(
                "Profession ID cannot be changed once created"
            )
        return super().update(instance, validated_data)

class ProfessionalSerializer(serializers.ModelSerializer):
    profession = ProfessionSerializer(read_only=True)
    city = CitySerializer(read_only=True)
    # Write-only fields for foreign keys
    profession_id = serializers.CharField(write_only=True, required=False)
    city_id = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = Professional
        fields = '__all__'

    def create(self, validated_data):
        from webapp.models import Profession, City
        profession_id = validated_data.pop('profession_id', None)
        city_id = validated_data.pop('city_id', None)
        if profession_id:
            try:
                validated_data['profession'] = Profession.objects.get(profession_id=profession_id)
            except Profession.DoesNotExist:
                raise serializers.ValidationError(f"Profession with ID '{profession_id}' does not exist.")
        if city_id:
            try:
                validated_data['city'] = City.objects.get(city_id=city_id)
            except City.DoesNotExist:
                raise serializers.ValidationError(f"City with ID '{city_id}' does not exist.")
        return super().create(validated_data)

    def update(self, instance, validated_data):
        from webapp.models import Profession, City
        profession_id = validated_data.pop('profession_id', None)
        city_id = validated_data.pop('city_id', None)
        if profession_id:
            try:
                validated_data['profession'] = Profession.objects.get(profession_id=profession_id)
            except Profession.DoesNotExist:
                raise serializers.ValidationError(f"Profession with ID '{profession_id}' does not exist.")
        if city_id:
            try:
                validated_data['city'] = City.objects.get(city_id=city_id)
            except City.DoesNotExist:
                raise serializers.ValidationError(f"City with ID '{city_id}' does not exist.")
        return super().update(instance, validated_data)


# Property serializers
class PropertyListSerializer(serializers.ModelSerializer):
    project = ProjectReferenceSerializer(read_only=True)
    country = CountrySerializer(read_only=True)
    province = ProvinceSerializer(read_only=True)
    city = CitySerializer(read_only=True)
    
    class Meta:
        model = Property
        fields = ['property_id', 'project', 'country', 'province', 'city', 'description', 'location', 'type', 'constructyear', 'status', 'market', 'broker', 'active']

class PropertySerializer(serializers.ModelSerializer):
    project = ProjectSerializer(read_only=True)
    country = CountrySerializer(read_only=True)
    province = ProvinceSerializer(read_only=True)
    city = CitySerializer(read_only=True)
    # Write-only fields for foreign keys
    project_id = serializers.CharField(write_only=True, required=False)
    country_id = serializers.CharField(write_only=True, required=False)
    province_id = serializers.CharField(write_only=True, required=False)
    city_id = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = Property
        fields = '__all__'

    def _assign_fk(self, validated_data, key, model, field_name):
        obj_id = validated_data.pop(key, None)
        if obj_id is None:
            return
        if obj_id == "":
            validated_data[field_name] = None
            return
        try:
            obj = model.objects.get(**{model._meta.pk.name: obj_id})
            validated_data[field_name] = obj
        except model.DoesNotExist:
            raise serializers.ValidationError(f"{model.__name__} with ID '{obj_id}' does not exist.")

    def create(self, validated_data):
        from webapp.models import Project, Country, Province, City
        self._assign_fk(validated_data, 'project_id', Project, 'project')
        self._assign_fk(validated_data, 'country_id', Country, 'country')
        self._assign_fk(validated_data, 'province_id', Province, 'province')
        self._assign_fk(validated_data, 'city_id', City, 'city')
        return super().create(validated_data)

    def update(self, instance, validated_data):
        from webapp.models import Project, Country, Province, City
        self._assign_fk(validated_data, 'project_id', Project, 'project')
        self._assign_fk(validated_data, 'country_id', Country, 'country')
        self._assign_fk(validated_data, 'province_id', Province, 'province')
        self._assign_fk(validated_data, 'city_id', City, 'city')
        return super().update(instance, validated_data)

class BankProjectAccountSerializer(serializers.ModelSerializer):
    project = ProjectSerializer(read_only=True)
    client = ClientSerializer(read_only=True)
    bankclientacco = BankClientAccountSerializer(read_only=True)
    # Write-only fields for foreign keys
    project_id = serializers.CharField(write_only=True, required=False)
    client_id = serializers.CharField(write_only=True, required=False)
    bankclientacco_id = serializers.CharField(write_only=True, required=False, allow_null=True, allow_blank=True)
    
    class Meta:
        model = BankProjectAccount
        fields = '__all__'

    def _assign_fk(self, validated_data, key, model, field_name):
        obj_id = validated_data.pop(key, None)
        if obj_id is None:
            return
        if obj_id == "":
            validated_data[field_name] = None
            return
        try:
            obj = model.objects.get(**{model._meta.pk.name: obj_id})
            validated_data[field_name] = obj
        except model.DoesNotExist:
            raise serializers.ValidationError(f"{model.__name__} with ID '{obj_id}' does not exist.")

    def create(self, validated_data):
        from webapp.models import Project, Client, BankClientAccount
        self._assign_fk(validated_data, 'project_id', Project, 'project')
        self._assign_fk(validated_data, 'client_id', Client, 'client')
        self._assign_fk(validated_data, 'bankclientacco_id', BankClientAccount, 'bankclientacco')
        return super().create(validated_data)

    def update(self, instance, validated_data):
        from webapp.models import Project, Client, BankClientAccount
        self._assign_fk(validated_data, 'project_id', Project, 'project')
        self._assign_fk(validated_data, 'client_id', Client, 'client')
        self._assign_fk(validated_data, 'bankclientacco_id', BankClientAccount, 'bankclientacco')
        return super().update(instance, validated_data)

# Detail serializer for BankClientAccount including related BankProjectAccounts
class BankClientAccountDetailSerializer(BankClientAccountSerializer):
    bank_project_accounts = BankProjectAccountSerializer(source='bankprojectaccount_set', many=True, read_only=True)

    class Meta(BankClientAccountSerializer.Meta):
        fields = '__all__'

# Task related serializers
class TaskCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskCategory
        fields = '__all__'
        extra_kwargs = {
            'active': {'required': False},  # Default to True
            'orderindex': {'required': True, 'allow_null': False}
        }

    def validate_taskcate_id(self, value):
        """Validate taskcate_id uniqueness"""
        # Get the current instance (for updates) or None (for creates)
        instance = getattr(self, 'instance', None)
        
        # Check if this taskcate_id is already taken by another task category
        try:
            existing_category = TaskCategory.objects.get(taskcate_id=value)
            # If this is an update and the existing category is the same as the current instance, it's OK
            if instance and existing_category.taskcate_id == instance.taskcate_id:
                return value
            raise serializers.ValidationError("This task category ID is already in use.")
        except TaskCategory.DoesNotExist:
            return value

    def validate_orderindex(self, value):
        """Order index: required but not unique for TaskCategory."""
        if value in (None, ""):
            raise serializers.ValidationError("Order index is required.")
        return value

    def validate_title(self, value):
        """Validate title format and case-insensitive uniqueness"""
        if not value or len(value.strip()) < 2:
            raise serializers.ValidationError("Title must be at least 2 characters long.")
        if len(value.strip()) > 40:
            raise serializers.ValidationError("Title must be at most 40 characters long.")
        cleaned = value.strip()
        instance = getattr(self, 'instance', None)
        queryset = TaskCategory.objects.filter(title__iexact=cleaned)
        if instance:
            queryset = queryset.exclude(pk=instance.pk)
        if queryset.exists():
            raise serializers.ValidationError(f"Title '{cleaned}' already exists.")
        return cleaned

    def create(self, validated_data):
        """Create a new task category with validation"""
        # Set default values
        if 'active' not in validated_data:
            validated_data['active'] = True
        return super().create(validated_data)

    def update(self, instance, validated_data):
        """Update task category with validation"""
        # Prevent primary key updates - taskcate_id is immutable
        if 'taskcate_id' in validated_data and validated_data['taskcate_id'] != instance.taskcate_id:
            raise serializers.ValidationError(
                "Task Category ID cannot be changed once created"
            )
        return super().update(instance, validated_data)

class ProjectTaskSerializer(serializers.ModelSerializer):
    project = ProjectSerializer(read_only=True)
    taskcate = TaskCategorySerializer(read_only=True)
    assigner = ConsultantSerializer(read_only=True)
    assignee = ConsultantSerializer(read_only=True)
    # Write-only ID fields for creation/update
    project_id = serializers.CharField(write_only=True, required=False)
    taskcate_id = serializers.CharField(write_only=True, required=False, allow_null=True, allow_blank=True)
    assigner_id = serializers.CharField(write_only=True, required=False, allow_null=True, allow_blank=True)
    assignee_id = serializers.CharField(write_only=True, required=False, allow_null=True, allow_blank=True)
    
    class Meta:
        model = ProjectTask
        fields = '__all__'

    def _assign_fk(self, validated_data, key, model, field_name):
        obj_id = validated_data.pop(key, None)
        if obj_id is None:
            return
        if obj_id == "":
            validated_data[field_name] = None
            return
        try:
            obj = model.objects.get(**{model._meta.pk.name: obj_id})
            validated_data[field_name] = obj
        except model.DoesNotExist:
            raise serializers.ValidationError(f"{model.__name__} with ID '{obj_id}' does not exist.")

    def create(self, validated_data):
        from webapp.models import Project, TaskCategory
        from accounts.models import Consultant
        self._assign_fk(validated_data, 'project_id', Project, 'project')
        self._assign_fk(validated_data, 'taskcate_id', TaskCategory, 'taskcate')
        self._assign_fk(validated_data, 'assigner_id', Consultant, 'assigner')
        self._assign_fk(validated_data, 'assignee_id', Consultant, 'assignee')
        return super().create(validated_data)

    def update(self, instance, validated_data):
        from webapp.models import Project, TaskCategory
        from accounts.models import Consultant
        self._assign_fk(validated_data, 'project_id', Project, 'project')
        self._assign_fk(validated_data, 'taskcate_id', TaskCategory, 'taskcate')
        self._assign_fk(validated_data, 'assigner_id', Consultant, 'assigner')
        self._assign_fk(validated_data, 'assignee_id', Consultant, 'assignee')
        return super().update(instance, validated_data)

class TaskCommentSerializer(serializers.ModelSerializer):
    projtask = ProjectTaskSerializer(read_only=True)
    consultant = ConsultantSerializer(read_only=True)
    # Write-only ID fields for creation/update
    projtask_id = serializers.CharField(write_only=True, required=False)
    consultant_id = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = TaskComment
        fields = '__all__'

    def _assign_fk(self, validated_data, key, model, field_name):
        obj_id = validated_data.pop(key, None)
        if obj_id is None:
            return
        if obj_id == "":
            validated_data[field_name] = None
            return
        try:
            obj = model.objects.get(**{model._meta.pk.name: obj_id})
            validated_data[field_name] = obj
        except model.DoesNotExist:
            raise serializers.ValidationError(f"{model.__name__} with ID '{obj_id}' does not exist.")

    def create(self, validated_data):
        from webapp.models import ProjectTask
        from accounts.models import Consultant
        self._assign_fk(validated_data, 'projtask_id', ProjectTask, 'projtask')
        self._assign_fk(validated_data, 'consultant_id', Consultant, 'consultant')
        return super().create(validated_data)

    def update(self, instance, validated_data):
        from webapp.models import ProjectTask
        from accounts.models import Consultant
        self._assign_fk(validated_data, 'projtask_id', ProjectTask, 'projtask')
        self._assign_fk(validated_data, 'consultant_id', Consultant, 'consultant')
        return super().update(instance, validated_data)


# Cash and taxation serializers
class CashSerializer(serializers.ModelSerializer):
    project = ProjectSerializer(read_only=True)
    country = CountrySerializer(read_only=True)
    consultant = ConsultantSerializer(read_only=True)
    # Write-only fields for foreign keys
    project_id = serializers.CharField(write_only=True, required=False)
    country_id = serializers.CharField(write_only=True, required=False)
    consultant_id = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = Cash
        fields = '__all__'

    def _assign_fk(self, validated_data, key, model, field_name):
        obj_id = validated_data.pop(key, None)
        if obj_id is None:
            return
        if obj_id == "":
            validated_data[field_name] = None
            return
        try:
            obj = model.objects.get(**{model._meta.pk.name: obj_id})
            validated_data[field_name] = obj
        except model.DoesNotExist:
            raise serializers.ValidationError(f"{model.__name__} with ID '{obj_id}' does not exist.")

    def create(self, validated_data):
        from webapp.models import Project, Country
        from accounts.models import Consultant
        self._assign_fk(validated_data, 'project_id', Project, 'project')
        self._assign_fk(validated_data, 'country_id', Country, 'country')
        self._assign_fk(validated_data, 'consultant_id', Consultant, 'consultant')
        return super().create(validated_data)

    def update(self, instance, validated_data):
        from webapp.models import Project, Country
        from accounts.models import Consultant
        self._assign_fk(validated_data, 'project_id', Project, 'project')
        self._assign_fk(validated_data, 'country_id', Country, 'country')
        self._assign_fk(validated_data, 'consultant_id', Consultant, 'consultant')
        return super().update(instance, validated_data)

class TaxationProjectSerializer(serializers.ModelSerializer):
    client = ClientSerializer(read_only=True)
    consultant = ConsultantSerializer(read_only=True)
    # Write-only fields for foreign keys
    client_id = serializers.CharField(write_only=True, required=False)
    consultant_id = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = TaxationProject
        fields = '__all__'

    def create(self, validated_data):
        client_id = validated_data.pop('client_id', None)
        consultant_id = validated_data.pop('consultant_id', None)
        if client_id:
            try:
                client = Client.objects.get(client_id=client_id)
                validated_data['client'] = client
            except Client.DoesNotExist:
                raise serializers.ValidationError(f"Client with ID '{client_id}' does not exist.")
        if consultant_id:
            try:
                consultant = Consultant.objects.get(consultant_id=consultant_id)
                validated_data['consultant'] = consultant
            except Consultant.DoesNotExist:
                raise serializers.ValidationError(f"Consultant with ID '{consultant_id}' does not exist.")
        return super().create(validated_data)

    def update(self, instance, validated_data):
        client_id = validated_data.pop('client_id', None)
        consultant_id = validated_data.pop('consultant_id', None)
        if client_id:
            try:
                client = Client.objects.get(client_id=client_id)
                validated_data['client'] = client
            except Client.DoesNotExist:
                raise serializers.ValidationError(f"Client with ID '{client_id}' does not exist.")
        if consultant_id:
            try:
                consultant = Consultant.objects.get(consultant_id=consultant_id)
                validated_data['consultant'] = consultant
            except Consultant.DoesNotExist:
                raise serializers.ValidationError(f"Consultant with ID '{consultant_id}' does not exist.")
        return super().update(instance, validated_data)

class TaxationProjectListSerializer(serializers.ModelSerializer):
    client = ClientSerializer(read_only=True)
    consultant = ConsultantSerializer(read_only=True)

    class Meta:
        model = TaxationProject
        fields = [
            'taxproj_id', 'client', 'consultant', 'taxuse', 'deadline',
            'declaredone', 'declarationdate', 'comment'
        ]

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
    # Reverse relations without explicit related_name need explicit sources
    properties = PropertySerializer(source='property_set', many=True, read_only=True)
    bank_accounts = BankProjectAccountSerializer(source='bankprojectaccount_set', many=True, read_only=True)
    cash_transactions = serializers.SerializerMethodField()
    task_comments = serializers.SerializerMethodField()
    contacts = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = '__all__'
    
    def get_contacts(self, obj):
        from .models import ClientContact
        contacts = ClientContact.objects.filter(project=obj)
        return ClientContactListSerializer(contacts, many=True, context=self.context).data

    def get_cash_transactions(self, obj):
        from .models import Cash
        qs = Cash.objects.filter(project=obj).order_by('-trandate')
        return CashSerializer(qs, many=True, context=self.context).data

    def get_task_comments(self, obj):
        from .models import TaskComment
        qs = TaskComment.objects.filter(projtask__project=obj).order_by('-commentregistration')
        return TaskCommentSerializer(qs, many=True, context=self.context).data

class ClientDetailSerializer(serializers.ModelSerializer):
    country = CountrySerializer(read_only=True)
    province = ProvinceSerializer(read_only=True)
    city = CitySerializer(read_only=True)
    passportcountry = CountrySerializer(read_only=True)
    pensioncountry1 = CountrySerializer(read_only=True)
    pensioncountry2 = CountrySerializer(read_only=True)
    insucarrier1 = InsuranceCarrierSerializer(read_only=True)
    insucarrier2 = InsuranceCarrierSerializer(read_only=True)
    bank_accounts = BankClientAccountSerializer(source='bankclientaccount_set', many=True, read_only=True)
    associated_projects = AssociatedClientSerializer(many=True, read_only=True)
    documents = DocumentSerializer(many=True, read_only=True)
    taxation_projects = TaxationProjectSerializer(many=True, read_only=True)
    bank_project_accounts = BankProjectAccountSerializer(source='bankprojectaccount_set', many=True, read_only=True)
    
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

class TaskCategoryDetailSerializer(serializers.ModelSerializer):
    # Include related tasks using reverse relation from ProjectTask.taskcate (related_name='tasks')
    tasks = ProjectTaskListSerializer(many=True, read_only=True)

    class Meta:
        model = TaskCategory
        fields = ['taskcate_id', 'title', 'orderindex', 'active', 'tasks']

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

    def get_contacts(self, obj):
        from .models import ClientContact
        contacts = ClientContact.objects.filter(project=obj)
        return ClientContactListSerializer(contacts, many=True, context=self.context).data      

# ClientContact related serializers
class ClientContactSerializer(serializers.ModelSerializer):
    project = ProjectReferenceSerializer(read_only=True)
    professional = ProfessionalReferenceSerializer(read_only=True)
    
    # Write-only fields for foreign keys
    project_id = serializers.CharField(write_only=True, required=False)
    professional_id = serializers.CharField(write_only=True, required=False, allow_null=True, allow_blank=True)
    
    class Meta:
        model = ClientContact
        fields = '__all__'
        extra_kwargs = {
            'active': {'required': False},  # Default to True
        }

    def validate_clientcont_id(self, value):
        """Validate clientcont_id uniqueness"""
        instance = getattr(self, 'instance', None)
        try:
            existing_contact = ClientContact.objects.get(clientcont_id=value)
            if instance and existing_contact.clientcont_id == instance.clientcont_id:
                return value
            raise serializers.ValidationError(
                f"Client Contact ID '{value}' is already taken by Contact: {existing_contact.fullname}"
            )
        except ClientContact.DoesNotExist:
            return value

    def validate_email(self, value):
        """Validate email format"""
        if value:
            import re
            email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
            if not re.match(email_pattern, value):
                raise serializers.ValidationError("Invalid email format.")
        return value

    def validate_phone(self, value):
        """Validate phone format"""
        if value:
            import re
            phone_pattern = r'^[\+]?[1-9][\d]{0,15}$'
            if not re.match(phone_pattern, value):
                raise serializers.ValidationError("Invalid phone number format.")
        return value

    def validate_mobile(self, value):
        """Validate mobile format"""
        if value:
            import re
            mobile_pattern = r'^[\+]?[1-9][\d]{0,15}$'
            if not re.match(mobile_pattern, value):
                raise serializers.ValidationError("Invalid mobile number format.")
        return value

    def create(self, validated_data):
        """Create a new client contact instance"""
        # Handle foreign key conversions
        self._handle_foreign_keys(validated_data)
        
        # Set default values
        if 'active' not in validated_data:
            validated_data['active'] = True
        
        return super().create(validated_data)

    def update(self, instance, validated_data):
        """Update an existing client contact instance"""
        # Handle foreign key conversions
        self._handle_foreign_keys(validated_data)
        
        return super().update(instance, validated_data)

    def _handle_foreign_keys(self, validated_data):
        """Handle foreign key field conversions"""
        # Handle project_id
        if 'project_id' in validated_data:
            try:
                project = Project.objects.get(project_id=validated_data['project_id'])
                validated_data['project'] = project
                del validated_data['project_id']
            except Project.DoesNotExist:
                raise serializers.ValidationError(f"Project with ID '{validated_data['project_id']}' does not exist.")

        # Handle professional_id (optional)
        if 'professional_id' in validated_data:
            professional_id = validated_data['professional_id']
            if professional_id:
                try:
                    professional = Professional.objects.get(professional_id=professional_id)
                    validated_data['professional'] = professional
                except Professional.DoesNotExist:
                    raise serializers.ValidationError(f"Professional with ID '{professional_id}' does not exist.")
            else:
                validated_data['professional'] = None
            del validated_data['professional_id']


class ClientContactListSerializer(serializers.ModelSerializer):
    project = ProjectReferenceSerializer(read_only=True)
    professional = ProfessionalReferenceSerializer(read_only=True)
    
    class Meta:
        model = ClientContact
        fields = [
            'clientcont_id', 'project', 'professional', 'fullname', 
            'connection', 'email', 'phone', 'mobile', 'profession', 
            'reliability', 'city', 'active'
        ]

# Detail serializer for Professional including related client contacts
class ProfessionalDetailSerializer(ProfessionalSerializer):
    project_contacts = ClientContactListSerializer(many=True, read_only=True)

    class Meta(ProfessionalSerializer.Meta):
        fields = '__all__'