#!/usr/bin/env python
"""
Test script to verify the data management API endpoints are working correctly.
Run this script after starting the Django development server.
"""

import requests
import json

# Base URL for the API
BASE_URL = "http://localhost:8000/api/data_management"

def test_endpoint(endpoint, description):
    """Test a specific API endpoint"""
    url = f"{BASE_URL}/{endpoint}/"
    print(f"\nTesting {description}...")
    print(f"URL: {url}")
    
    try:
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if 'results' in data:
                print(f"Count: {data['count']} items")
                if data['results']:
                    print(f"First item: {list(data['results'][0].keys())}")
            else:
                print(f"Response: {len(data)} items")
            return True
        else:
            print(f"Error: {response.text}")
            return False
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to the server. Make sure Django is running on port 8000.")
        return False
    except Exception as e:
        print(f"Error: {str(e)}")
        return False

def main():
    """Test all the main API endpoints"""
    print("=" * 60)
    print("Testing Data Management API Endpoints")
    print("=" * 60)
    
    # Test reference data endpoints
    endpoints = [
        ("countries", "Countries"),
        ("provinces", "Provinces"),
        ("cities", "Cities"),
        ("banks", "Banks"),
        ("insurance-carriers", "Insurance Carriers"),
        
        # Test reference endpoints for dropdowns
        ("reference/countries", "Reference Countries"),
        ("reference/provinces", "Reference Provinces"),
        ("reference/cities", "Reference Cities"),
        ("reference/banks", "Reference Banks"),
        ("reference/consultants", "Reference Consultants"),
        ("reference/project-categories", "Reference Project Categories"),
        ("reference/task-categories", "Reference Task Categories"),
        ("reference/professions", "Reference Professions"),
        ("reference/professionals", "Reference Professionals"),
        ("reference/insurance-carriers", "Reference Insurance Carriers"),
        
        # Test main data endpoints
        ("clients", "Clients"),
        ("bank-client-accounts", "Bank Client Accounts"),
        ("consultants", "Consultants"),
        ("project-categories", "Project Categories"),
        ("projects", "Projects"),
        ("associated-clients", "Associated Clients"),
        ("documents", "Documents"),
        ("professions", "Professions"),
        ("professionals", "Professionals"),
        ("client-contacts", "Client Contacts"),
        ("properties", "Properties"),
        ("bank-project-accounts", "Bank Project Accounts"),
        ("task-categories", "Task Categories"),
        ("project-tasks", "Project Tasks"),
        ("task-comments", "Task Comments"),
        ("cash", "Cash Transactions"),
        ("taxation-projects", "Taxation Projects"),
        ("notifications", "Notifications"),
    ]
    
    successful_tests = 0
    total_tests = len(endpoints)
    
    for endpoint, description in endpoints:
        if test_endpoint(endpoint, description):
            successful_tests += 1
    
    print("\n" + "=" * 60)
    print(f"Test Results: {successful_tests}/{total_tests} endpoints working")
    print("=" * 60)
    
    if successful_tests == total_tests:
        print("✅ All API endpoints are working correctly!")
    else:
        print("❌ Some endpoints failed. Check the errors above.")
    
    print("\nAPI Documentation:")
    print(f"- Main API: {BASE_URL}/")
    print(f"- Browsable API: Visit any endpoint in your browser")
    print(f"- Example: {BASE_URL}/countries/")

if __name__ == "__main__":
    main()
