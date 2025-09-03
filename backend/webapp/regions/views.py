# from django.shortcuts import render
from webapp.models import (
    User,
    Country,
    City,
    Province,
    Bank,
    Client,
    Property,
    Cash,
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
from django.db.models import Q, ProtectedError
from django.db import IntegrityError
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
        # Normalize null/empty orderindex to None
        mutable_data = request.data.copy()
        if 'orderindex' in mutable_data and (mutable_data['orderindex'] == '' or mutable_data['orderindex'] is None):
            mutable_data['orderindex'] = None
        serializer = self.get_serializer(data=mutable_data)
        if serializer.is_valid():
            try:
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except IntegrityError as e:
                print(f"DEBUG: AllCountries post - Caught IntegrityError: {e}")
                print(f"DEBUG: AllCountries post - Error string: {str(e)}")
                print(f"DEBUG: AllCountries post - Request data: {request.data}")
                error_str = str(e).lower()
                
                # Check if this is a unique constraint violation on orderindex
                if 'orderindex' in error_str and 'unique' in error_str:
                    new_orderindex = mutable_data.get('orderindex')
                    if new_orderindex is not None:
                        try:
                            conflicting_country = Country.objects.get(orderindex=new_orderindex)
                            error_message = f"Order index {new_orderindex} is already taken by Country: {conflicting_country.title} (ID: {conflicting_country.country_id})"
                            return Response(
                                {"error": error_message, "field": "orderindex"}, 
                                status=status.HTTP_400_BAD_REQUEST
                            )
                        except Country.DoesNotExist:
                            return Response(
                                {"error": f"Order index {new_orderindex} is already taken by another country"}, 
                                status=status.HTTP_400_BAD_REQUEST
                            )
                
                # Check if this is a unique constraint violation on country_id
                elif 'country_id' in error_str and 'unique' in error_str:
                    new_country_id = request.data.get('country_id')
                    if new_country_id is not None:
                        try:
                            conflicting_country = Country.objects.get(country_id=new_country_id)
                            error_message = f"Country ID '{new_country_id}' is already taken by Country: {conflicting_country.title}"
                            return Response(
                                {"error": error_message, "field": "country_id"}, 
                                status=status.HTTP_400_BAD_REQUEST
                            )
                        except Country.DoesNotExist:
                            return Response(
                                {"error": f"Country ID '{new_country_id}' is already taken by another country"}, 
                                status=status.HTTP_400_BAD_REQUEST
                            )
                
                # Re-raise if it's not a handled unique constraint violation
                raise
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CountryView(generics.RetrieveUpdateDestroyAPIView):  # GET + PATCH/PUT + DELETE
    queryset = Country.objects.all()
    serializer_class = CountrySerializer
    lookup_field = "country_id"
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Prevent primary key updates - country_id is immutable
        if 'country_id' in request.data and request.data['country_id'] != instance.country_id:
            return Response(
                {"error": "Country ID cannot be modified. It is immutable."}, 
                status=400
            )
        
        # Create a complete data dict for validation
        # This ensures all fields are validated, not just the ones being updated
        complete_data = {
            'country_id': instance.country_id,
            'title': instance.title,
            'currency': instance.currency,
            'orderindex': instance.orderindex,
        }
        # Update with the new data
        complete_data.update(request.data)
        
        serializer = self.get_serializer(instance, data=complete_data, partial=False)
        
        # Normal update for non-primary key fields
        if serializer.is_valid():
            try:
                serializer.save()
                return Response(serializer.data)
            except IntegrityError as e:
                error_str = str(e).lower()
                
                # Check if this is a unique constraint violation on orderindex
                if 'orderindex' in error_str and 'unique' in error_str:
                    new_orderindex = request.data.get('orderindex')
                    if new_orderindex is not None:
                        try:
                            conflicting_country = Country.objects.get(orderindex=new_orderindex)
                            error_message = f"Order index {new_orderindex} is already taken by Country: {conflicting_country.title} (ID: {conflicting_country.country_id})"
                            return Response(
                                {"error": error_message, "field": "orderindex"}, 
                                status=400
                            )
                        except Country.DoesNotExist:
                            return Response(
                                {"error": f"Order index {new_orderindex} is already taken by another country"}, 
                                status=400
                            )
                
                # Check if this is a unique constraint violation on country_id
                elif 'country_id' in error_str and 'unique' in error_str:
                    new_country_id = request.data.get('country_id')
                    if new_country_id is not None:
                        try:
                            conflicting_country = Country.objects.get(country_id=new_country_id)
                            error_message = f"Country ID '{new_country_id}' is already taken by Country: {conflicting_country.title}"
                            return Response(
                                {"error": error_message, "field": "country_id"}, 
                                status=400
                            )
                        except Country.DoesNotExist:
                            return Response(
                                {"error": f"Country ID '{new_country_id}' is already taken by another country"}, 
                                status=400
                            )
                
                # Re-raise if it's not a handled unique constraint violation
                raise
        return Response(serializer.errors, status=400)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        try:
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ProtectedError:
            # Get detailed information about related objects
            related_objects = []
            
            # Check provinces
            provinces = Province.objects.filter(country=instance)
            if provinces.exists():
                related_objects.append(f"{provinces.count()} province(s): {', '.join([p.title for p in provinces[:5]])}{'...' if provinces.count() > 5 else ''}")
            
            # Check cities
            cities = City.objects.filter(country=instance)
            if cities.exists():
                related_objects.append(f"{cities.count()} city(ies): {', '.join([c.title for c in cities[:5]])}{'...' if cities.count() > 5 else ''}")
            
            # Check banks
            banks = Bank.objects.filter(country=instance)
            if banks.exists():
                related_objects.append(f"{banks.count()} bank(s): {', '.join([b.bankname for b in banks[:5]])}{'...' if banks.count() > 5 else ''}")
            
            # Check clients (main country reference)
            clients = Client.objects.filter(country=instance)
            if clients.exists():
                related_objects.append(f"{clients.count()} client(s): {', '.join([f'{c.surname} {c.name}' for c in clients[:5]])}{'...' if clients.count() > 5 else ''}")
            
            # Check properties
            properties = Property.objects.filter(country=instance)
            if properties.exists():
                related_objects.append(f"{properties.count()} propert(ies): {', '.join([p.description for p in properties[:5]])}{'...' if properties.count() > 5 else ''}")
            
            # Check cash transactions
            cash_transactions = Cash.objects.filter(country=instance)
            if cash_transactions.exists():
                related_objects.append(f"{cash_transactions.count()} cash transaction(s)")
            
            error_message = f"Cannot delete country '{instance.title}' because it is referenced by:\n\n"
            error_message += "\n".join([f"• {obj}" for obj in related_objects])
            error_message += "\n\nPlease remove or reassign these related objects before deleting the country."
            
            return Response(
                {"error": error_message, "related_objects": related_objects}, 
                status=status.HTTP_400_BAD_REQUEST
            )
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

    def get_queryset(self):
        queryset = City.objects.all().order_by("orderindex")
        province_id = self.request.query_params.get('province', None)
        if province_id:
            queryset = queryset.filter(province__province_id=province_id)
        return queryset

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        data = self.get_serializer(queryset, many=True, context={"request": request}).data
        return Response({"all_cities": data})

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            try:
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except IntegrityError as e:
                error_str = str(e).lower()
                
                # Check if this is a unique constraint violation on orderindex
                if 'orderindex' in error_str and 'unique' in error_str:
                    new_orderindex = request.data.get('orderindex')
                    if new_orderindex is not None:
                        try:
                            conflicting_city = City.objects.get(orderindex=new_orderindex)
                            error_message = f"Order index {new_orderindex} is already taken by City: {conflicting_city.title} (ID: {conflicting_city.city_id})"
                            return Response(
                                {"error": error_message, "field": "orderindex"}, 
                                status=status.HTTP_400_BAD_REQUEST
                            )
                        except City.DoesNotExist:
                            return Response(
                                {"error": f"Order index {new_orderindex} is already taken by another city"}, 
                                status=status.HTTP_400_BAD_REQUEST
                            )
                
                # Check if this is a unique constraint violation on city_id
                elif 'city_id' in error_str and 'unique' in error_str:
                    new_city_id = request.data.get('city_id')
                    if new_city_id is not None:
                        try:
                            conflicting_city = City.objects.get(city_id=new_city_id)
                            error_message = f"City ID '{new_city_id}' is already taken by City: {conflicting_city.title}"
                            return Response(
                                {"error": error_message, "field": "city_id"}, 
                                status=status.HTTP_400_BAD_REQUEST
                            )
                        except City.DoesNotExist:
                            return Response(
                                {"error": f"City ID '{new_city_id}' is already taken by another city"}, 
                                status=status.HTTP_400_BAD_REQUEST
                            )
                
                # Re-raise if it's not a handled unique constraint violation
                raise
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
        
        # Prevent primary key updates - city_id is immutable
        if 'city_id' in request.data and request.data['city_id'] != instance.city_id:
            return Response(
                {"error": "City ID cannot be modified. It is immutable."}, 
                status=400
            )
        
        # Create a complete data dict for validation
        # This ensures all fields are validated, not just the ones being updated
        complete_data = {
            'city_id': instance.city_id,
            'title': instance.title,
            'country_id': instance.country.country_id if instance.country else None,
            'province_id': instance.province.province_id if instance.province else None,
            'orderindex': instance.orderindex,
        }
        # Update with the new data
        complete_data.update(request.data)
        
        serializer = self.get_serializer(instance, data=complete_data, partial=False)
        
        # Normal update for non-primary key fields
        if serializer.is_valid():
            try:
                serializer.save()
                return Response(serializer.data)
            except IntegrityError as e:
                error_str = str(e).lower()
                
                # Check if this is a unique constraint violation on orderindex
                if 'orderindex' in error_str and 'unique' in error_str:
                    new_orderindex = request.data.get('orderindex')
                    if new_orderindex is not None:
                        try:
                            conflicting_city = City.objects.get(orderindex=new_orderindex)
                            error_message = f"Order index {new_orderindex} is already taken by City: {conflicting_city.title} (ID: {conflicting_city.city_id})"
                            return Response(
                                {"error": error_message, "field": "orderindex"}, 
                                status=400
                            )
                        except City.DoesNotExist:
                            return Response(
                                {"error": f"Order index {new_orderindex} is already taken by another city"}, 
                                status=400
                            )
                
                # Check if this is a unique constraint violation on city_id
                elif 'city_id' in error_str and 'unique' in error_str:
                    new_city_id = request.data.get('city_id')
                    if new_city_id is not None:
                        try:
                            conflicting_city = City.objects.get(city_id=new_city_id)
                            error_message = f"City ID '{new_city_id}' is already taken by City: {conflicting_city.title}"
                            return Response(
                                {"error": error_message, "field": "city_id"}, 
                                status=400
                            )
                        except City.DoesNotExist:
                            return Response(
                                {"error": f"City ID '{new_city_id}' is already taken by another city"}, 
                                status=400
                            )
                
                # Re-raise if it's not a handled unique constraint violation
                raise
        return Response(serializer.errors, status=400)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        try:
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ProtectedError:
            # Get detailed information about related objects
            related_objects = []
            
            # Clients
            clients = Client.objects.filter(city=instance)
            if clients.exists():
                related_objects.append(f"{clients.count()} client(s): {', '.join([f'{c.surname} {c.name}' for c in clients[:5]])}{'...' if clients.count() > 5 else ''}")
            
            # Properties
            properties = Property.objects.filter(city=instance)
            if properties.exists():
                related_objects.append(f"{properties.count()} propert(ies): {', '.join([p.description for p in properties[:5]])}{'...' if properties.count() > 5 else ''}")

            # Professionals
            from webapp.models import Professional
            pros = Professional.objects.filter(city=instance)
            if pros.exists():
                related_objects.append(f"{pros.count()} professional(s): {', '.join([pr.fullname for pr in pros[:5]])}{'...' if pros.count() > 5 else ''}")
            
            errormsg = f"Cannot delete city '{instance.title}' because it is referenced by:\n\n"
            if related_objects:
                errormsg += "\n".join([f"• {obj}" for obj in related_objects])
                errormsg += "\n\nPlease remove or reassign these related objects before deleting the city."
            else:
                errormsg += "• Related objects exist. Please remove or reassign them before deleting the city."
            
            return Response(
                {"errormsg": errormsg, "related_objects": related_objects}, 
                status=status.HTTP_400_BAD_REQUEST
            )
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

    def get_queryset(self):
        queryset = Province.objects.all().order_by("orderindex")
        country_id = self.request.query_params.get('country', None)
        if country_id:
            queryset = queryset.filter(country__country_id=country_id)
        return queryset

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        data = self.get_serializer(queryset, many=True, context={"request": request}).data
        return Response({"all_provinces": data})

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            try:
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except IntegrityError as e:
                error_str = str(e).lower()
                
                # Check if this is a unique constraint violation on orderindex
                if 'orderindex' in error_str and 'unique' in error_str:
                    new_orderindex = request.data.get('orderindex')
                    if new_orderindex is not None:
                        try:
                            conflicting_province = Province.objects.get(orderindex=new_orderindex)
                            error_message = f"Order index {new_orderindex} is already taken by Province: {conflicting_province.title} (ID: {conflicting_province.province_id})"
                            return Response(
                                {"error": error_message, "field": "orderindex"}, 
                                status=status.HTTP_400_BAD_REQUEST
                            )
                        except Province.DoesNotExist:
                            return Response(
                                {"error": f"Order index {new_orderindex} is already taken by another province"}, 
                                status=status.HTTP_400_BAD_REQUEST
                            )
                
                # Check if this is a unique constraint violation on province_id
                elif 'province_id' in error_str and 'unique' in error_str:
                    new_province_id = request.data.get('province_id')
                    if new_province_id is not None:
                        try:
                            conflicting_province = Province.objects.get(province_id=new_province_id)
                            error_message = f"Province ID '{new_province_id}' is already taken by Province: {conflicting_province.title}"
                            return Response(
                                {"error": error_message, "field": "province_id"}, 
                                status=status.HTTP_400_BAD_REQUEST
                            )
                        except Province.DoesNotExist:
                            return Response(
                                {"error": f"Province ID '{new_province_id}' is already taken by another province"}, 
                                status=status.HTTP_400_BAD_REQUEST
                            )
                
                # Re-raise if it's not a handled unique constraint violation
                raise
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
        
        # Prevent primary key updates - province_id is immutable
        if 'province_id' in request.data and request.data['province_id'] != instance.province_id:
            return Response(
                {"error": "Province ID cannot be modified. It is immutable."}, 
                status=400
            )
        
        # Create a complete data dict for validation
        # This ensures all fields are validated, not just the ones being updated
        complete_data = {
            'province_id': instance.province_id,
            'title': instance.title,
            'country_id': instance.country.country_id if instance.country else None,
            'orderindex': instance.orderindex,
        }
        # Update with the new data
        complete_data.update(request.data)
        
        serializer = self.get_serializer(instance, data=complete_data, partial=False)
        
        # Normal update for non-primary key fields
        if serializer.is_valid():
            try:
                serializer.save()
                return Response(serializer.data)
            except IntegrityError as e:
                error_str = str(e).lower()
                
                # Check if this is a unique constraint violation on orderindex
                if 'orderindex' in error_str and 'unique' in error_str:
                    new_orderindex = request.data.get('orderindex')
                    if new_orderindex is not None:
                        try:
                            conflicting_province = Province.objects.get(orderindex=new_orderindex)
                            error_message = f"Order index {new_orderindex} is already taken by Province: {conflicting_province.title} (ID: {conflicting_province.province_id})"
                            return Response(
                                {"error": error_message, "field": "orderindex"}, 
                                status=400
                            )
                        except Province.DoesNotExist:
                            return Response(
                                {"error": f"Order index {new_orderindex} is already taken by another province"}, 
                                status=400
                            )
                
                # Check if this is a unique constraint violation on province_id
                elif 'province_id' in error_str and 'unique' in error_str:
                    new_province_id = request.data.get('province_id')
                    if new_province_id is not None:
                        try:
                            conflicting_province = Province.objects.get(province_id=new_province_id)
                            error_message = f"Province ID '{new_province_id}' is already taken by Province: {conflicting_province.title}"
                            return Response(
                                {"error": error_message, "field": "province_id"}, 
                                status=400
                            )
                        except Province.DoesNotExist:
                            return Response(
                                {"error": f"Province ID '{new_province_id}' is already taken by another province"}, 
                                status=400
                            )
                
                # Re-raise if it's not a handled unique constraint violation
                raise
        return Response(serializer.errors, status=400)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        try:
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ProtectedError:
            # Get detailed information about related objects
            related_objects = []
            
            # Check cities
            cities = City.objects.filter(province=instance)
            if cities.exists():
                related_objects.append(f"{cities.count()} city(ies): {', '.join([c.title for c in cities[:5]])}{'...' if cities.count() > 5 else ''}")
            
            # Check clients
            clients = Client.objects.filter(province=instance)
            if clients.exists():
                related_objects.append(f"{clients.count()} client(s): {', '.join([f'{c.surname} {c.name}' for c in clients[:5]])}{'...' if clients.count() > 5 else ''}")
            
            # Check properties
            properties = Property.objects.filter(province=instance)
            if properties.exists():
                related_objects.append(f"{properties.count()} propert(ies): {', '.join([p.description for p in properties[:5]])}{'...' if properties.count() > 5 else ''}")
            
            error_message = f"Cannot delete province '{instance.title}' because it is referenced by:\n\n"
            error_message += "\n".join([f"• {obj}" for obj in related_objects])
            error_message += "\n\nPlease remove or reassign these related objects before deleting the province."
            
            return Response(
                {"error": error_message, "related_objects": related_objects}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": f"Cannot delete province: {str(e)}"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

