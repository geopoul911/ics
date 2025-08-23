from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from .models import UserProfile
from webapp.models import (
    Country,
)


class LoginSerializer(serializers.Serializer):
    # Used on login attempts
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        # Authenticate the user
        username = attrs.get('username')
        password = attrs.get('password')
        user = authenticate(
            request=self.context.get('request'),
            username=username,
            password=password
        )
        if not user:
            msg = _('Unable to authenticate with provided credentials')
            raise serializers.ValidationError(msg, code='authorization')
        attrs['user'] = user
        return attrs


class CountrySerializer(serializers.ModelSerializer):

    class Meta:
        many = False
        model = Country
        fields = '__all__'


class ProfileSerializer(serializers.ModelSerializer):
    nationality = CountrySerializer()

    class Meta:
        many = False
        model = UserProfile
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    user_profile = ProfileSerializer(many=True)

    class Meta:
        many = False
        model = get_user_model()

        # We don't include the password here
        fields = [
            'id',
            'first_name',
            'last_name',
            'email',
            'username',
            'date_joined',
            'is_active',
            'is_staff',
            'is_superuser',
            'user_profile'
        ]
