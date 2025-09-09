# from django.shortcuts import render
from webapp.models import (
    Country,
    City,
    Province,
)
from webapp.serializers import (
    CountrySerializer,
    CitySerializer,
    ProvinceSerializer,
)
from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response


class AddCountry(generics.UpdateAPIView):
    """
    URL: add_country/
    Body (JSON): {
      "country_id": "GR",
      "orderindex": 1,
      "currency": "EUR",
      "title": "Greece"
    }
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    @csrf_exempt
    def post(self, request):
        context = {"errormsg": "", "model": None}

        try:
            country = Country.objects.create(
                country_id=request.data["country_id"],
                orderindex=request.data["orderindex"],
                currency=request.data.get("currency"),
                title=request.data["title"],
            )

            context["model"] = CountrySerializer(country, context={"request": request}).data
            return Response(data=context, status=status.HTTP_200_OK)
        except Exception as exc:
            context["errormsg"] = str(exc)
            return Response(data=context, status=400)


class AddProvince(generics.UpdateAPIView):
    """
    URL: add_province/
    Body (JSON): {
      "province_id": "ATT",
      "orderindex": 1,
      "country_id": "GR",
      "title": "Attica"
    }
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    @csrf_exempt
    def post(self, request):
        context = {"errormsg": "", "model": None}

        try:
            country = Country.objects.get(country_id=request.data["country_id"])

            province = Province.objects.create(
                province_id=request.data["province_id"],
                orderindex=request.data.get("orderindex", 0),
                country=country,
                title=request.data["title"],
            )

            context["model"] = ProvinceSerializer(province, context={"request": request}).data
            return Response(data=context, status=status.HTTP_200_OK)
        except Exception as exc:
            context["errormsg"] = str(exc)
            return Response(data=context, status=400)


class AddCity(generics.UpdateAPIView):
    """
    URL: add_city/
    Body (JSON): {
      "city_id": "ATH",
      "orderindex": 1,
      "country_id": "GR",
      "province_id": "ATT",
      "title": "Athens"
    }
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    @csrf_exempt
    def post(self, request):
        context = {"errormsg": "", "model": None}

        try:
            country = Country.objects.get(country_id=request.data["country_id"])
            province = Province.objects.get(province_id=request.data["province_id"])

            city = City.objects.create(
                city_id=request.data["city_id"],
                orderindex=request.data.get("orderindex", 0),
                country=country,
                province=province,
                title=request.data["title"],
            )

            context["model"] = CitySerializer(city, context={"request": request}).data
            return Response(data=context, status=status.HTTP_200_OK)
        except Exception as exc:
            context["errormsg"] = str(exc)
            return Response(data=context, status=400)
