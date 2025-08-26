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

def test_database():
    print("=== Testing Database ===")
    
    # Check countries
    countries = Country.objects.all()
    print(f"Number of countries in database: {countries.count()}")
    for country in countries:
        print(f"  - {country.country_id}: {country.title}")
    
    # Check provinces
    provinces = Province.objects.all()
    print(f"Number of provinces in database: {provinces.count()}")
    for province in provinces:
        print(f"  - {province.province_id}: {province.title} (Country: {province.country.title})")
    
    # Check cities
    cities = City.objects.all()
    print(f"Number of cities in database: {cities.count()}")
    for city in cities:
        print(f"  - {city.city_id}: {city.title} (Country: {city.country.title}, Province: {city.province.title if city.province else 'None'})")

if __name__ == "__main__":
    test_database()
