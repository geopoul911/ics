# from django.shortcuts import render
from webapp.models import (
    User,
    Country,
    City,
    Province,
)
from webapp.serializers import (
    CountrySerializer,
    CitySerializer,
    ProvinceSerializer
)

import datetime
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authtoken.models import Token
from rest_framework import generics
from rest_framework.response import Response
from django.db.models import Q
from rest_framework.views import APIView
from webapp.serializers import (CountrySerializer, CitySerializer, ProvinceSerializer)
from django.db import connection
import os
from django.http import HttpResponse, FileResponse, JsonResponse
from rest_framework.decorators import api_view
from rest_framework import status
from webapp.xhr import get_user
import logging
from rest_framework.permissions import IsAuthenticated
from django.views import View
from django.conf import settings

# views.py
from rest_framework import generics
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt


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
    # Site Administration

    - AllCountries
    - CountryView
    - AllCities
    - CityView
    - AllProvinces
    - ProvinceView
"""


class AllCountries(generics.ListAPIView):
    """
    URL: all_countries/
    Descr: Returns array of all countries
    """
    serializer_class = CountrySerializer

    @csrf_exempt
    def get(self, request, *args, **kwargs):
        # If you really need the custom token:
        # token_str = request.headers.get('User-Token')
        # user = get_user(token_str)

        queryset = Country.objects.all().order_by("orderindex")
        data = self.get_serializer(queryset, many=True, context={"request": request}).data
        return Response({"all_countries": data})


class CountryView(generics.RetrieveUpdateAPIView):  # GET + PATCH/PUT
    queryset = Country.objects.all()
    serializer_class = CountrySerializer
    lookup_field = "country_id"

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        
        # Check if we're trying to update the primary key (country_id)
        if 'country_id' in request.data and request.data['country_id'] != instance.country_id:
            new_country_id = request.data['country_id']
            
            # Check if the new ID already exists
            if Country.objects.filter(country_id=new_country_id).exists():
                return Response(
                    {"error": f"Country with ID '{new_country_id}' already exists."}, 
                    status=400
                )
            
            # Create new country with new ID
            new_country_data = {
                'country_id': new_country_id,
                'title': request.data.get('title', instance.title),
                'currency': request.data.get('currency', instance.currency),
                'orderindex': request.data.get('orderindex', instance.orderindex)
            }
            
            try:
                # Create new country
                new_country = Country.objects.create(**new_country_data)
                
                # Update all related objects to point to the new country
                # This is a simplified version - you might need to handle more relationships
                from webapp.models import Province, City, Client, Bank
                
                # Update provinces
                Province.objects.filter(country=instance).update(country=new_country)
                
                # Update cities (cities reference both country and province, so this might need more care)
                # City.objects.filter(country=instance).update(country=new_country)
                
                # Update clients
                Client.objects.filter(country=instance).update(country=new_country)
                Client.objects.filter(passportcountry=instance).update(passportcountry=new_country)
                Client.objects.filter(pensioncountry1=instance).update(pensioncountry1=new_country)
                Client.objects.filter(pensioncountry2=instance).update(pensioncountry2=new_country)
                
                # Update banks
                Bank.objects.filter(country=instance).update(country=new_country)
                
                # Delete the old country
                instance.delete()
                
                # Return the new country data
                new_serializer = self.get_serializer(new_country)
                return Response(new_serializer.data)
                
            except Exception as e:
                return Response(
                    {"error": f"Failed to update country ID: {str(e)}"}, 
                    status=400
                )
        
        # Normal update for non-primary key fields
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


class AllCities(generics.ListAPIView):
    """
    URL: all_cities/
    Descr: Returns array of all cities
    """
    serializer_class = CitySerializer

    @csrf_exempt
    def get(self, request, *args, **kwargs):
        # If you really need the custom token:
        # token_str = request.headers.get('User-Token')
        # user = get_user(token_str)

        queryset = City.objects.all().order_by("orderindex")
        data = self.get_serializer(queryset, many=True, context={"request": request}).data
        return Response({"all_cities": data})


class CityView(generics.RetrieveUpdateAPIView):
    """
    URL: cities/<city_id>/
    """
    serializer_class = CitySerializer
    lookup_field = "city_id"
    queryset = City.objects.all()

    @csrf_exempt
    def get(self, request, *args, **kwargs):
        # token_str = request.headers.get('User-Token')
        # user = get_user(token_str)
        return super().get(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        
        # Check if we're trying to update the primary key (city_id)
        if 'city_id' in request.data and request.data['city_id'] != instance.city_id:
            new_city_id = request.data['city_id']
            
            # Check if the new ID already exists
            if City.objects.filter(city_id=new_city_id).exists():
                return Response(
                    {"error": f"City with ID '{new_city_id}' already exists."}, 
                    status=400
                )
            
            # Create new city with new ID
            new_city_data = {
                'city_id': new_city_id,
                'title': request.data.get('title', instance.title),
                'country': request.data.get('country', instance.country),
                'province': request.data.get('province', instance.province),
                'orderindex': request.data.get('orderindex', instance.orderindex)
            }
            
            try:
                # Create new city
                new_city = City.objects.create(**new_city_data)
                
                # Note: Cities don't typically have direct foreign key relationships that need updating
                # But if they do in the future, add them here
                
                # Delete the old city
                instance.delete()
                
                # Return the new city data
                new_serializer = self.get_serializer(new_city)
                return Response(new_serializer.data)
                
            except Exception as e:
                return Response(
                    {"error": f"Failed to update city ID: {str(e)}"}, 
                    status=400
                )
        
        # Normal update for non-primary key fields
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

class AllProvinces(generics.ListAPIView):
    """
    URL: all_provinces/
    Descr: Returns array of all provinces
    """
    serializer_class = ProvinceSerializer

    @csrf_exempt
    def get(self, request, *args, **kwargs):
        # If you really need the custom token:
        # token_str = request.headers.get('User-Token')
        # user = get_user(token_str)

        queryset = Province.objects.all().order_by("orderindex")
        data = self.get_serializer(queryset, many=True, context={"request": request}).data
        return Response({"all_provinces": data})


class ProvinceView(generics.RetrieveUpdateAPIView):
    """
    URL: provinces/<province_id>/
    """
    serializer_class = ProvinceSerializer
    lookup_field = "province_id"
    queryset = Province.objects.all()

    @csrf_exempt
    def get(self, request, *args, **kwargs):
        # token_str = request.headers.get('User-Token')
        # user = get_user(token_str)
        return super().get(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        
        # Check if we're trying to update the primary key (province_id)
        if 'province_id' in request.data and request.data['province_id'] != instance.province_id:
            new_province_id = request.data['province_id']
            
            # Check if the new ID already exists
            if Province.objects.filter(province_id=new_province_id).exists():
                return Response(
                    {"error": f"Province with ID '{new_province_id}' already exists."}, 
                    status=400
                )
            
            # Create new province with new ID
            new_province_data = {
                'province_id': new_province_id,
                'title': request.data.get('title', instance.title),
                'country': request.data.get('country', instance.country),
                'orderindex': request.data.get('orderindex', instance.orderindex)
            }
            
            try:
                # Create new province
                new_province = Province.objects.create(**new_province_data)
                
                # Update all related objects to point to the new province
                from webapp.models import City
                
                # Update cities
                City.objects.filter(province=instance).update(province=new_province)
                
                # Delete the old province
                instance.delete()
                
                # Return the new province data
                new_serializer = self.get_serializer(new_province)
                return Response(new_serializer.data)
                
            except Exception as e:
                return Response(
                    {"error": f"Failed to update province ID: {str(e)}"}, 
                    status=400
                )
        
        # Normal update for non-primary key fields
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

