# # from django.shortcuts import render
from webapp.models import (
    User,
    Country,
    History,
    Province,
    City,
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


"""
    # All users
    AddUser

    # Overview
    ChangeUsername
    ChangeFirstName
    ChangeLastName
    ChangeEmail
    ChangeIsEnabled
    ChangeIsStaff
    ChangeIsSuperuser
    ChangePhoneNumber
    ChangeUserNationality
    ChangeAddress
    ChangeZipCode
    ChangeSignature
    ChangePassword
"""

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


class UnlockUser(generics.ListAPIView):
    """
    URL: unlock_user/
    Descr: Removes user's block
    *** django does not allow "unblock" on the URL string
    """

    # Cross site request forgery
    @csrf_exempt
    def post(self, request):
        context = {"request": request, "errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        # Permission

        # Get user to unlock
        user_to_unlock = request.data['username']

        # Use raw SQL to remove user from axesattempt table
        from django.db import connection
        cursor = connection.cursor()
        cursor.execute("delete from axes_accessattempt where username = '" + str(user_to_unlock) + "' ")
        cursor.execute("SELECT * FROM axes_accessattempt WHERE failures_since_start > 2")

        locked_entries = []

        for i in cursor.fetchall():
            locked_entries.append({
                'ID': i[0],
                'IP_address': i[2],
                'username': i[3],
                'time_stamp': i[6].strftime('%b. %d, %Y, %H:%M:%S'),
                'action': '',
                'result': '',
                'locked': True,
            })

        connection.close()

        History.objects.create(
            user=user,
            model_name='USR',
            action='UPD',
            description=f"User : {user.username} removed user's {user_to_unlock} block"
        )
        return Response({
            'locked_entries': locked_entries,
        })



class AddUser(generics.UpdateAPIView):
    """
    URL: add_user/
    Descr: Creates new user, user has no permissions, and:
    is_staff, is_active and is_superuser statuses are false.
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request):
        context = {"errormsg": '', 'new_user_id': ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        try:
            username = request.data['username'].strip()
            first_name = request.data['first_name'].strip()
            last_name = request.data['last_name'].strip()
            email = request.data['email'].strip()
            password = request.data['password'].strip()
        except Exception as exc:
            context['errormsg'] = exc
            return HttpResponse(status=400)

        if len(username) < 3:
            context['errormsg'] = 'Invalid name submitted'
            return Response(data=context, status=400)
        if '@' not in email or len(email) < 5:
            context['errormsg'] = 'Invalid email submitted'
            return Response(data=context, status=400)
        try:
            new_user = User.objects.create_user(
                username=username,
                first_name=first_name,
                last_name=last_name,
                email=email,
                password=password,
                is_staff=False,
                is_active=False,
                is_superuser=False,
            )
            new_user.save()

            History.objects.create(
                user=user,
                model_name='USR',
                action='CRE',
                description=f'User : {user.username} created a new user with username: {new_user.username}'
            )
            context['new_user_id'] = new_user.id
            return Response(data=context, status=status.HTTP_200_OK)
        except Exception as exc:
            context['errormsg'] = exc
            return Response(data=context, status=400)


class ChangeUsername(generics.UpdateAPIView):
    """
    URL: change_username
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request):
        context = {"errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        try:
            # Get username
            username = request.data['username'].strip()
            user_to_edit = User.objects.get(id=request.data['user_id'])

            # Get previous username for logging
            prev_username = user_to_edit.username
        except Exception as exc:
            context['errormsg'] = exc
            return HttpResponse(status=400)

        # Validations
        if len(username) < 3:
            context['errormsg'] = 'Invalid username submitted'
            return Response(data=context, status=400)

        try:
            user_to_edit.username = username
            user_to_edit.save()
            History.objects.create(
                user=user,
                model_name='USR',
                action='UPD',
                description=f"User : {user.username} updated user's ({prev_username}) username from \
                    {prev_username} to {username}"
            )
            context['user'] = UserSerializer(user_to_edit).data
            return Response(data=context, status=status.HTTP_200_OK)
        except Exception as exc:
            context['errormsg'] = exc
            return Response(data=context, status=400)


class ChangeFirstName(generics.UpdateAPIView):
    """
    URL: change_first_name
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request):
        context = {"errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        try:
            # Get first name
            first_name = request.data['first_name'].strip()
            user_to_edit = User.objects.get(id=request.data['user_id'])

            # Get previous first name for logging
            prev_first_name = user_to_edit.first_name
        except Exception as exc:
            context['errormsg'] = exc
            return HttpResponse(status=400)

        # Validations
        if len(first_name) < 3:
            context['errormsg'] = 'Invalid first name submitted'
            return Response(data=context, status=400)

        try:
            user_to_edit.first_name = first_name
            user_to_edit.save()
            History.objects.create(
                user=user,
                model_name='USR',
                action='UPD',
                description=f"User : {user.username} updated user's ({user_to_edit}) first name from \
                    {prev_first_name} to {first_name}"
            )
            context['user'] = UserSerializer(user_to_edit).data
            return Response(data=context, status=status.HTTP_200_OK)
        except Exception as exc:
            context['errormsg'] = exc
            return Response(data=context, status=400)


class ChangeLastName(generics.UpdateAPIView):
    """
    URL: change_last_name
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request):
        context = {"errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        try:
            # Get last name
            last_name = request.data['last_name'].strip()
            user_to_edit = User.objects.get(id=request.data['user_id'])

            # Get previous last name for logging
            prev_last_name = user_to_edit.last_name
        except Exception as exc:
            context['errormsg'] = exc
            return HttpResponse(status=400)

        if len(last_name) < 3:
            context['errormsg'] = 'Invalid last name submitted'
            return Response(data=context, status=400)

        try:
            user_to_edit.last_name = last_name
            user_to_edit.save()
            History.objects.create(
                user=user,
                model_name='USR',
                action='UPD',
                description=f"User : {user.username} updated user's ({user_to_edit}) last name from \
                    {prev_last_name} to {last_name}"
            )
            context['user'] = UserSerializer(user_to_edit).data
            return Response(data=context, status=status.HTTP_200_OK)
        except Exception as exc:
            context['errormsg'] = exc
            return Response(data=context, status=400)


class ChangeEmail(generics.UpdateAPIView):
    """
    URL: change_email
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request):
        context = {"errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        try:
            # Get email
            email = request.data['email'].strip()
            user_to_edit = User.objects.get(id=request.data['user_id'])

            # Get previous email for logging
            prev_email = user_to_edit.email
        except Exception as exc:
            context['errormsg'] = exc
            return HttpResponse(status=400)

        # Validations
        if '@' not in email or len(email) < 5:
            context['errormsg'] = 'Invalid email submitted'
            return Response(data=context, status=400)

        try:
            user_to_edit.email = email
            user_to_edit.save()
            History.objects.create(
                user=user,
                model_name='USR',
                action='UPD',
                description=f"User : {user.username} updated user's ({user_to_edit}) email from {prev_email} to {email}"
            )
            context['user'] = UserSerializer(user_to_edit).data
            return Response(data=context, status=status.HTTP_200_OK)
        except Exception as exc:
            context['errormsg'] = exc
            return Response(data=context, status=400)


class ChangeIsEnabled(generics.ListCreateAPIView):
    """
    URL: change_is_enabled
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request):
        context = {"errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)
        user_to_edit = User.objects.get(id=request.data['user_id'])

        # One liner to get value
        value = True if request.data['value'] == 'true' else False

        # Get previous value for logging
        prev_value = user_to_edit.is_active

        try:
            # If it is the same, do nothing
            if user_to_edit.is_active == value:
                context['user'] = UserSerializer(user_to_edit).data
                return Response(data=context, status=status.HTTP_200_OK)
            user_to_edit.is_active = value
            user_to_edit.save()
            History.objects.create(
                user=user,
                model_name='USR',
                action='UPD',
                description=f"User : {user.username} updated user's ({user_to_edit}) enabled status from \
                    {prev_value} to {value}"
            )
            context['user'] = UserSerializer(user_to_edit).data
            return Response(data=context, status=status.HTTP_200_OK)
        except Exception as exc:
            context['errormsg'] = exc
            return Response(data=context, status=400)


class ChangeIsStaff(generics.ListCreateAPIView):
    """
    URL: change_is_staff
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request):
        context = {"errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        user_to_edit = User.objects.get(id=request.data['user_id'])

        # One liner to get value
        value = True if request.data['value'] == 'true' else False

        # Get previous value for logging
        prev_value = user_to_edit.is_staff

        try:
            # If it is the same, do nothing
            if user_to_edit.is_staff == value:
                context['user'] = UserSerializer(user_to_edit).data
                return Response(data=context, status=status.HTTP_200_OK)
            user_to_edit.is_staff = value
            user_to_edit.save()
            History.objects.create(
                user=user,
                model_name='USR',
                action='UPD',
                description=f"User : {user.username} updated user's ({user_to_edit}) staff status from \
                    {prev_value} to {value}"
            )
            context['user'] = UserSerializer(user_to_edit).data
            return Response(data=context, status=status.HTTP_200_OK)
        except Exception as exc:
            context['errormsg'] = exc
            return Response(data=context, status=400)


class ChangeIsSuperuser(generics.ListCreateAPIView):
    """
    URL: change_is_superuser
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request):
        context = {"errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        user_to_edit = User.objects.get(id=request.data['user_id'])

        # One liner to get value
        value = True if request.data['value'] == 'true' else False

        # Get previous value for logging
        prev_value = user_to_edit.is_superuser

        try:
            user_to_edit.is_superuser = value
            user_to_edit.save()
            History.objects.create(
                user=user,
                model_name='USR',
                action='UPD',
                description=f"User : {user.username} updated user's ({user_to_edit}) super user status from \
                    {prev_value} to {value}"
            )
            context['user'] = UserSerializer(user_to_edit).data
            return Response(data=context, status=status.HTTP_200_OK)
        except Exception as exc:
            context['errormsg'] = exc
            return Response(data=context, status=400)


class ChangePassword(generics.ListCreateAPIView):
    """
    URL: change_password
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request):
        context = {"errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        try:
            # Get password
            password = request.data['password']
            user_to_edit = User.objects.get(id=request.data['user_id'])
        except Exception as exc:
            context['errormsg'] = exc
            return HttpResponse(status=400)

        try:
            # Built in
            user_to_edit.set_password(password)
            user_to_edit.save()
            History.objects.create(
                user=user,
                model_name='USR',
                action='UPD',
                description=f"User : {user.username} updated user's ({user_to_edit}) password"
            )
            context['user'] = UserSerializer(user_to_edit).data
            return Response(data=context, status=status.HTTP_200_OK)
        except Exception as exc:
            context['errormsg'] = exc
            return Response(data=context, status=400)


class DeleteUser(generics.UpdateAPIView):
    """
    url : del_usr/
    Descr: Deletes User, If user has related entries it will return a 401 error response
    """

    # Cross-Site Request Forgery
    @csrf_exempt
    def post(self, request):
        context = {"errormsg": ''}
        token_str = request.headers['User-Token']
        user = get_user(token_str)

        try:
            user_to_del = User.objects.get(id=request.data['user_id'])
            History.objects.create(
                user=user,
                model_name='USR',
                action='DEL',
                description=f"User : {user.username} deleted user {user_to_del}"
            )
            user_to_del.delete()
            context['user'] = UserSerializer(user_to_del).data

        except ProtectedError:
            context['errormsg'] = 'This User is protected. Remove User\'s related objects to be able to delete it.'
            return Response(data=context, status=400)

        except Exception as a:
            context['errormsg'] = a
            return Response(data=context, status=400)
        return Response(data=context, status=200)


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
            context['errormsg'] = 'This Country is protected. Remove Country\'s related objects (provinces, cities, clients, banks) to be able to delete it.'
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
            context['errormsg'] = 'This Province is protected. Remove Province\'s related objects (cities, clients) to be able to delete it.'
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
            context['errormsg'] = 'This City is protected. Remove City\'s related objects (clients) to be able to delete it.'
            return Response(data=context, status=400)

        except Exception as e:
            context['errormsg'] = str(e)
            return Response(data=context, status=400)
