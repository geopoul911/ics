from accounts.models import (UserPermissions, User)

model_names = [
    "GT",   # GroupTransfer
    "AGN",  # Agent
    "AL",   # Airline
    "AP",   # Airport
    'OFF',  # Offer
    "ATT",  # Attraction
    "CLN",  # Client
    "CO",   # Coach
    "COP",  # Coach Operator
    "CNT",  # Contract
    "CC",   # Cruising Company
    "DRV",  # Driver
    "DMC",  # Destination Management Company
    "GL",   # Group Leader
    "GD",   # Guide
    "HTL",  # Hotel
    "MUS",  # Museum
    "PLC",  # Place
    "PRT",  # Port
    "RS",   # Railway Station
    "RSH",  # Repair Shop
    "RST",  # Restaurant
    "SRV",  # Service
    "FTA",  # Ferry Ticket Agency
    "TC",   # Teleferik Company
    "TH",   # Theater
    "TP",   # Theme Park
    "TTA",  # Train Ticket Agency
    "USR",  # User
    "HSR",  # History
    "TRF",  # Transfers
    "SES",  # Sport Event Supplier
    'AUT',  # Authentication
    'TT',   # TextTemplate
    'PKG',  # Parking Lots
    'NAS',  # NAS Folders
]

ACTION_CHOICES = [
    'VIE',  # View
    'CRE',  # Create
    'UPD',  # Update
    'DEL',  # Delete
]


# View
def can_view(user_id, model):
    return UserPermissions.objects.get(user_id=user_id, model=model, permission_type='VIE').value


# Create
def can_create(user_id, model):
    return UserPermissions.objects.get(user_id=user_id, model=model, permission_type='CRE').value


# Update
def can_update(user_id, model):
    return UserPermissions.objects.get(user_id=user_id, model=model, permission_type='UPD').value


# Delete
def can_delete(user_id, model):
    return UserPermissions.objects.get(user_id=user_id, model=model, permission_type='DEL').value


# Is Active
def is_enabled(user_id):
    return User.objects.get(id=user_id).is_active


# Is Staff
def is_staff(user_id):
    return User.objects.get(id=user_id).is_staff


# Is Admin
def is_superuser(user_id):
    return User.objects.get(id=user_id).is_superuser
