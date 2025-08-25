#!/usr/bin/env python
"""
Test script to verify the authentication system with Django Axes
"""
import requests
import json

BASE_URL = "http://localhost:8000/api/user"

def test_check_access_status():
    """Test the access status endpoint"""
    print("Testing access status...")
    try:
        response = requests.get(f"{BASE_URL}/check_access_status/")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {data}")
            return True
        else:
            print(f"Error: {response.text}")
            return False
    except Exception as e:
        print(f"Exception: {e}")
        return False

def test_login_attempt(username, password, expected_failure=True):
    """Test a login attempt"""
    print(f"\nTesting login with username: {username}")
    try:
        response = requests.post(f"{BASE_URL}/login/", json={
            "username": username,
            "password": password
        })
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Success! Token: {data.get('token', 'N/A')[:20]}...")
            return True
        elif response.status_code == 400:
            data = response.json()
            print(f"Login failed: {data.get('detail', 'Unknown error')}")
            print(f"Failed WL: {data.get('failed_wl', False)}")
            return False
        else:
            print(f"Unexpected status: {response.text}")
            return False
    except Exception as e:
        print(f"Exception: {e}")
        return False

def main():
    print("=" * 60)
    print("Testing Authentication System with Django Axes")
    print("=" * 60)
    
    # Test 1: Check access status
    if not test_check_access_status():
        print("❌ Access status check failed")
        return
    
    print("✅ Access status check passed")
    
    # Test 2: Try multiple failed login attempts
    print("\n" + "=" * 60)
    print("Testing failed login attempts (should trigger Axes lockout)")
    print("=" * 60)
    
    for i in range(6):
        print(f"\n--- Attempt {i + 1} ---")
        success = test_login_attempt("invalid_user", "invalid_password")
        if success:
            print("❌ Login succeeded when it should have failed")
            break
    
    # Test 3: Check access status after failed attempts
    print("\n" + "=" * 60)
    print("Checking access status after failed attempts")
    print("=" * 60)
    
    if test_check_access_status():
        print("✅ Access status check after failed attempts")
    
    print("\n" + "=" * 60)
    print("Authentication test completed!")
    print("=" * 60)
    print("\nTo test with a real user:")
    print("1. Create a Consultant user in Django admin")
    print("2. Run: python test_auth.py --real-login")
    print("3. Check the Axes admin interface for lockout records")

if __name__ == "__main__":
    main()
