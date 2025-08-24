from django.urls import path, re_path
from webapp.regions import region_views as region_views
from webapp.regions import region_xhr as region_xhr


urlpatterns = [

    # Countries
    path('all_countries/', region_views.AllCountries.as_view()),
    path("country/<str:country_id>", region_views.CountryView.as_view(), name="country-detail"),
    path('delete_country/', region_xhr.DeleteCountry.as_view()),

    # Cities
    path('all_cities/', region_views.AllCities.as_view()),
    path('delete_city/', region_xhr.DeleteCity.as_view()),
    re_path(r'city/(?P<city_id>.*)$', region_views.CityView.as_view()),

    # Provinces
    path('all_provinces/', region_views.AllProvinces.as_view()),
    path('delete_province/', region_xhr.DeleteProvince.as_view()),
    re_path(r'province/(?P<province_id>.*)$', region_views.ProvinceView.as_view()),

]
