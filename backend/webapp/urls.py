from django.urls import path
# from webapp import xhr
from webapp import create


urlpatterns = [
    # # # # Create
    path('add_country/', create.AddCountry.as_view()),
    path('add_city/', create.AddCity.as_view()),
    path('add_province/', create.AddProvince.as_view()),

]
