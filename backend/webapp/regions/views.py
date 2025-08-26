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
from rest_framework.authentication import TokenAuthentication
from django.views import View
from django.conf import settings

# views.py
from rest_framework import generics
from rest_framework.response import Response

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


class AllCountries(generics.ListCreateAPIView):
    """
    URL: all_countries/
    Descr: Returns array of all countries and allows creation
    """
    serializer_class = CountrySerializer
    queryset = Country.objects.all().order_by("orderindex")
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        data = self.get_serializer(queryset, many=True, context={"request": request}).data
        return Response({"all_countries": data})

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CountryView(generics.RetrieveUpdateDestroyAPIView):  # GET + PATCH/PUT + DELETE
    queryset = Country.objects.all()
    serializer_class = CountrySerializer
    lookup_field = "country_id"
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        
        # Prevent primary key updates - country_id is immutable
        if 'country_id' in request.data and request.data['country_id'] != instance.country_id:
            return Response(
                {"error": "Country ID cannot be modified. It is immutable."}, 
                status=400
            )
        
        # Normal update for non-primary key fields
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        try:
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response(
                {"error": f"Cannot delete country: {str(e)}"}, 
                status=status.HTTP_400_BAD_REQUEST
            )


class AllCities(generics.ListCreateAPIView):
    """
    URL: all_cities/
    Descr: Returns array of all cities and allows creation
    """
    serializer_class = CitySerializer
    queryset = City.objects.all().order_by("orderindex")
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        data = self.get_serializer(queryset, many=True, context={"request": request}).data
        return Response({"all_cities": data})

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CityView(generics.RetrieveUpdateDestroyAPIView):
    """
    URL: city/<city_id>/
    """
    serializer_class = CitySerializer
    lookup_field = "city_id"
    queryset = City.objects.all()
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        
        # Prevent primary key updates - city_id is immutable
        if 'city_id' in request.data and request.data['city_id'] != instance.city_id:
            return Response(
                {"error": "City ID cannot be modified. It is immutable."}, 
                status=400
            )
        
        # Normal update for non-primary key fields
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        try:
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response(
                {"error": f"Cannot delete city: {str(e)}"}, 
                status=status.HTTP_400_BAD_REQUEST
            )


class AllProvinces(generics.ListCreateAPIView):
    """
    URL: all_provinces/
    Descr: Returns array of all provinces and allows creation
    """
    serializer_class = ProvinceSerializer
    queryset = Province.objects.all().order_by("orderindex")
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        data = self.get_serializer(queryset, many=True, context={"request": request}).data
        return Response({"all_provinces": data})

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProvinceView(generics.RetrieveUpdateDestroyAPIView):
    """
    URL: province/<province_id>/
    """
    serializer_class = ProvinceSerializer
    lookup_field = "province_id"
    queryset = Province.objects.all()
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        
        # Prevent primary key updates - province_id is immutable
        if 'province_id' in request.data and request.data['province_id'] != instance.province_id:
            return Response(
                {"error": "Province ID cannot be modified. It is immutable."}, 
                status=400
            )
        
        # Normal update for non-primary key fields
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        try:
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response(
                {"error": f"Cannot delete province: {str(e)}"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

