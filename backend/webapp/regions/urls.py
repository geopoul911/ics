from django.urls import path, re_path
from webapp.regions import views as views
from webapp.regions import xhr as region_xhr


urlpatterns = [

    # Countries
    path('all_countries/', views.AllCountries.as_view()),
    path("country/<str:country_id>/", views.CountryView.as_view(), name="country-detail"),
    path('delete_country/', region_xhr.DeleteCountry.as_view()),

    # Cities
    path('all_cities/', views.AllCities.as_view()),
    path('delete_city/', region_xhr.DeleteCity.as_view()),
    path('city/<str:city_id>/', views.CityView.as_view()),

    # Provinces
    path('all_provinces/', views.AllProvinces.as_view()),
    path('delete_province/', region_xhr.DeleteProvince.as_view()),
    path('province/<str:province_id>/', views.ProvinceView.as_view()),

]
