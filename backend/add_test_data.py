#!/usr/bin/env python
import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from webapp.models import Country, Province, City

def add_test_data():
    print("=== Adding Test Data ===")
    
    # Add countries
    countries_data = [
        {'country_id': 'CA', 'title': 'CANADA', 'currency': 'CAD', 'orderindex': 10},
        {'country_id': 'US', 'title': 'UNITED STATES', 'currency': 'USD', 'orderindex': 20},
        {'country_id': 'UK', 'title': 'UNITED KINGDOM', 'currency': 'GBP', 'orderindex': 30},
    ]
    
    for country_data in countries_data:
        country, created = Country.objects.get_or_create(
            country_id=country_data['country_id'],
            defaults=country_data
        )
        if created:
            print(f"Created country: {country.title}")
        else:
            print(f"Country already exists: {country.title}")
    
    # Add provinces for Canada
    canada = Country.objects.get(country_id='CA')
    provinces_data = [
        {'province_id': 'ON', 'title': 'ONTARIO', 'country': canada, 'orderindex': 10},
        {'province_id': 'BC', 'title': 'BRITISH COLUMBIA', 'country': canada, 'orderindex': 20},
        {'province_id': 'AB', 'title': 'ALBERTA', 'country': canada, 'orderindex': 30},
    ]
    
    for province_data in provinces_data:
        province, created = Province.objects.get_or_create(
            province_id=province_data['province_id'],
            defaults=province_data
        )
        if created:
            print(f"Created province: {province.title} in {province.country.title}")
        else:
            print(f"Province already exists: {province.title}")
    
    # Add cities
    ontario = Province.objects.get(province_id='ON')
    cities_data = [
        {'city_id': 'TOR', 'title': 'TORONTO', 'country': canada, 'province': ontario, 'orderindex': 10},
        {'city_id': 'OTT', 'title': 'OTTAWA', 'country': canada, 'province': ontario, 'orderindex': 20},
    ]
    
    for city_data in cities_data:
        city, created = City.objects.get_or_create(
            city_id=city_data['city_id'],
            defaults=city_data
        )
        if created:
            print(f"Created city: {city.title} in {city.province.title}, {city.country.title}")
        else:
            print(f"City already exists: {city.title}")

if __name__ == "__main__":
    add_test_data()
