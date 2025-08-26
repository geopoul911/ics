# # from django.shortcuts import render
from webapp.models import (
    User,
    Country,
    Province,
    City,
    Bank,
    Client,
    Property,
    Cash,
)
from django.db.models import ProtectedError
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics
from rest_framework.response import Response
from accounts.serializers import (UserSerializer,)
from django.http import HttpResponse
from rest_framework import status
from rest_framework.views import APIView
import datetime
from rest_framework.authtoken.models import Token

# Permissions reversed
permissions_full_text_reverse = {
    'View': 'VIE',
    'Create': 'CRE',
    'Update': 'UPD',
    'Delete': 'DEL',
}


# Permissions
permissions_full_text = {
    'VIE': 'View',
    'CRE': 'Create',
    'UPD': 'Update',
    'DEL': 'Delete',
}

ACTION_NAMES = {
    'VIE': 'View',
    'CRE': 'Create',
    'UPD': 'Update',
    'DEL': 'Delete',
}

MODEL_CHOICES = {
    'USR': 'User',
    'HSR': 'History',
}


# All models
models_full_text = {
    'GT': 'GroupTransfer',
}

# All models reversed
models_full_text_reverse = {
    'GroupTransfer': 'GT',
}


# Returns user instance
def get_user(token):
    user = Token.objects.get(key=token).user
    return user


class DeleteCountry(APIView):
    """
    URL: delete_country/
    Descr: Deletes Country, If country has related entries it will return a 400 error response
    """

    @csrf_exempt
    def post(self, request):
        context = {"errormsg": '', "success": False}
        token_str = request.headers.get('User-Token')
        # user = get_user(token_str)

        try:
            country_id = request.data.get('country_id')
            if not country_id:
                context['errormsg'] = 'Country ID is required'
                return Response(data=context, status=400)

            country_to_delete = Country.objects.get(country_id=country_id)
            
            # # Log the deletion attempt
            # History.objects.create(
            #     user=user,
            #     model_name='CNT',
            #     action='DEL',
            #     description=f"User: {user.username} deleted Country {country_to_delete.country_id} - {country_to_delete.title}"
            # )
            
            # Delete the country
            country_to_delete.delete()
            
            context['success'] = True
            context['message'] = f"Country {country_to_delete.country_id} - {country_to_delete.title} deleted successfully"
            return Response(data=context, status=200)

        except Country.DoesNotExist:
            context['errormsg'] = f'Country with ID "{country_id}" does not exist'
            return Response(data=context, status=400)
            
        except ProtectedError:
            # Get detailed information about related objects
            related_objects = []
            
            # Check provinces
            provinces = Province.objects.filter(country=country_to_delete)
            if provinces.exists():
                related_objects.append(f"{provinces.count()} province(s): {', '.join([p.title for p in provinces[:5]])}{'...' if provinces.count() > 5 else ''}")
            
            # Check cities
            cities = City.objects.filter(country=country_to_delete)
            if cities.exists():
                related_objects.append(f"{cities.count()} city(ies): {', '.join([c.title for c in cities[:5]])}{'...' if cities.count() > 5 else ''}")
            
            # Check banks
            banks = Bank.objects.filter(country=country_to_delete)
            if banks.exists():
                related_objects.append(f"{banks.count()} bank(s): {', '.join([b.bankname for b in banks[:5]])}{'...' if banks.count() > 5 else ''}")
            
            # Check clients (main country reference)
            clients = Client.objects.filter(country=country_to_delete)
            if clients.exists():
                related_objects.append(f"{clients.count()} client(s): {', '.join([f'{c.surname} {c.name}' for c in clients[:5]])}{'...' if clients.count() > 5 else ''}")
            
            # Check properties
            properties = Property.objects.filter(country=country_to_delete)
            if properties.exists():
                related_objects.append(f"{properties.count()} propert(ies): {', '.join([p.description for p in properties[:5]])}{'...' if properties.count() > 5 else ''}")
            
            # Check cash transactions
            cash_transactions = Cash.objects.filter(country=country_to_delete)
            if cash_transactions.exists():
                related_objects.append(f"{cash_transactions.count()} cash transaction(s)")
            
            error_message = f"Cannot delete country '{country_to_delete.title}' because it is referenced by:\n\n"
            error_message += "\n".join([f"• {obj}" for obj in related_objects])
            error_message += "\n\nPlease remove or reassign these related objects before deleting the country."
            
            context['errormsg'] = error_message
            context['related_objects'] = related_objects
            return Response(data=context, status=400)

        except Exception as e:
            context['errormsg'] = str(e)
            return Response(data=context, status=400)


class DeleteProvince(APIView):
    """
    URL: delete_province/
    Descr: Deletes Province, If province has related entries it will return a 400 error response
    """

    @csrf_exempt
    def post(self, request):
        context = {"errormsg": '', "success": False}
        token_str = request.headers.get('User-Token')
        # user = get_user(token_str)

        try:
            province_id = request.data.get('province_id')
            if not province_id:
                context['errormsg'] = 'Province ID is required'
                return Response(data=context, status=400)

            province_to_delete = Province.objects.get(province_id=province_id)
            
            # Log the deletion attempt
            # History.objects.create(
            #     user=user,
            #     model_name='PRV',
            #     action='DEL',
            #     description=f"User: {user.username} deleted Province {province_to_delete.province_id} - {province_to_delete.title}"
            # )
            
            # Delete the province
            province_to_delete.delete()
            
            context['success'] = True
            context['message'] = f"Province {province_to_delete.province_id} - {province_to_delete.title} deleted successfully"
            return Response(data=context, status=200)

        except Province.DoesNotExist:
            context['errormsg'] = f'Province with ID "{province_id}" does not exist'
            return Response(data=context, status=400)
            
        except ProtectedError:
            # Get detailed information about related objects
            related_objects = []
            
            # Check cities
            cities = City.objects.filter(province=province_to_delete)
            if cities.exists():
                related_objects.append(f"{cities.count()} city(ies): {', '.join([c.title for c in cities[:5]])}{'...' if cities.count() > 5 else ''}")
            
            # Check clients
            clients = Client.objects.filter(province=province_to_delete)
            if clients.exists():
                related_objects.append(f"{clients.count()} client(s): {', '.join([f'{c.surname} {c.name}' for c in clients[:5]])}{'...' if clients.count() > 5 else ''}")
            
            # Check properties
            properties = Property.objects.filter(province=province_to_delete)
            if properties.exists():
                related_objects.append(f"{properties.count()} propert(ies): {', '.join([p.description for p in properties[:5]])}{'...' if properties.count() > 5 else ''}")
            
            error_message = f"Cannot delete province '{province_to_delete.title}' because it is referenced by:\n\n"
            error_message += "\n".join([f"• {obj}" for obj in related_objects])
            error_message += "\n\nPlease remove or reassign these related objects before deleting the province."
            
            context['errormsg'] = error_message
            context['related_objects'] = related_objects
            return Response(data=context, status=400)

        except Exception as e:
            context['errormsg'] = str(e)
            return Response(data=context, status=400)


class DeleteCity(APIView):
    """
    URL: delete_city/
    Descr: Deletes City, If city has related entries it will return a 400 error response
    """

    @csrf_exempt
    def post(self, request):
        context = {"errormsg": '', "success": False}
        token_str = request.headers.get('User-Token')
        # user = get_user(token_str)

        try:
            city_id = request.data.get('city_id')
            if not city_id:
                context['errormsg'] = 'City ID is required'
                return Response(data=context, status=400)

            city_to_delete = City.objects.get(city_id=city_id)
            
            # Log the deletion attempt
            # History.objects.create(
            #     user=user,
            #     model_name='CIT',
            #     action='DEL',
            #     description=f"User: {user.username} deleted City {city_to_delete.city_id} - {city_to_delete.title}"
            # )
            
            # Delete the city
            city_to_delete.delete()
            
            context['success'] = True
            context['message'] = f"City {city_to_delete.city_id} - {city_to_delete.title} deleted successfully"
            return Response(data=context, status=200)

        except City.DoesNotExist:
            context['errormsg'] = f'City with ID "{city_id}" does not exist'
            return Response(data=context, status=400)
            
        except ProtectedError:
            # Get detailed information about related objects
            related_objects = []
            
            # Check clients
            clients = Client.objects.filter(city=city_to_delete)
            if clients.exists():
                related_objects.append(f"{clients.count()} client(s): {', '.join([f'{c.surname} {c.name}' for c in clients[:5]])}{'...' if clients.count() > 5 else ''}")
            
            # Check properties
            properties = Property.objects.filter(city=city_to_delete)
            if properties.exists():
                related_objects.append(f"{properties.count()} propert(ies): {', '.join([p.description for p in properties[:5]])}{'...' if properties.count() > 5 else ''}")
            
            error_message = f"Cannot delete city '{city_to_delete.title}' because it is referenced by:\n\n"
            error_message += "\n".join([f"• {obj}" for obj in related_objects])
            error_message += "\n\nPlease remove or reassign these related objects before deleting the city."
            
            context['errormsg'] = error_message
            context['related_objects'] = related_objects
            return Response(data=context, status=400)

        except Exception as e:
            context['errormsg'] = str(e)
            return Response(data=context, status=400)
