#!/usr/bin/env python
import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model

User = get_user_model()

def test_auth():
    print("=== Testing Authentication ===")
    
    # Check if there are any users
    users = User.objects.all()
    print(f"Number of users in database: {users.count()}")
    
    for user in users:
        print(f"  - User: {user.username} (PK: {user.pk})")
        
        # Check if user has a token
        try:
            token = Token.objects.get(user=user)
            print(f"    Token: {token.key}")
        except Token.DoesNotExist:
            print(f"    No token found - creating one...")
            token = Token.objects.create(user=user)
            print(f"    Created token: {token.key}")
    
    # If no users exist, create a test user
    if users.count() == 0:
        print("No users found. Creating a test user...")
        user = User.objects.create_user(
            username='testuser',
            password='testpass123',
            email='test@example.com'
        )
        token = Token.objects.create(user=user)
        print(f"Created user: {user.username}")
        print(f"Created token: {token.key}")

if __name__ == "__main__":
    test_auth()
