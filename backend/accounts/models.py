# Import necessary modules and classes from Django
from django.db.models.base import Model
from django.db.models import PROTECT, CASCADE
from django.db.models.fields.related import ForeignKey
from django.contrib.auth.models import User
import django.db.models as models
from django.contrib import admin
from django.db.models.fields import (CharField, BooleanField)
from django.dispatch import receiver
from django.db.models.signals import post_save
from webapp.models import Country


# Constants for user permissions
ACTION_CHOICES = (
    ('VIE', 'View'),
    ('CRE', 'Create'),
    ('UPD', 'Update'),
    ('DEL', 'Delete'),
)

# Constants for model choices
MODEL_CHOICES = (
    ('GT', 'GroupTransfer'),
    ('AGN', 'Agent'),
    ('AL', 'Airline'),
    ('OFF', 'Offer'),
    ('AP', 'Airport'),
    ('ATT', 'Attraction'),
    ('CLN', 'Client'),
    ('COP', 'Coach Operator'),
    ('CO', 'Coach'),
    ('CC', 'Cruising Company'),
    ('DRV', 'Driver'),
    ('DMC', 'DMC'),
    ('GL', 'Group Leader'),
    ('GD', 'Guide'),
    ('HTL', 'Hotel'),
    ('MUS', 'Museum'),
    ('PLC', 'Place'),
    ('PRT', 'Port'),
    ('RS', 'Railway Station'),
    ('RSH', 'Repair Shop'),
    ('RTP', 'Repair Type'),
    ('RST', 'Restaurant'),
    ('SRV', 'Service'),
    ('FTA', 'Ferry Ticket Agency'),
    ('TC', 'Teleferik Company'),
    ('TH', 'Theater'),
    ('TP', 'Theme Park'),
    ('TTA', 'Train Ticket Agency'),
    ('SES', 'Sport Even Supplier'),
    ('AUT', 'Authentication'),
    ('USR', 'User'),
    ('HSR', 'History'),
    ('TT', 'TextTemplate'),
    ('PKG', 'Parking Lot'),
    ('NAS', 'Nas Folders'),
)


# Model representing user profiles with additional information
class UserProfile(Model):
    """
    One on One Relationship with User Model
    Stores phone number, nationality, address, zip code, signature
    Signature is used on mail sending.
    None of these fields is required
    Once a User is created, a profile is also created for him with null values
    """
    user = ForeignKey(User, CASCADE, related_name='user_profile', blank=False, null=False,)
    phone_number = CharField(max_length=100, blank=True, null=True)
    nationality = ForeignKey(Country, PROTECT, blank=True, null=True)
    address = CharField(max_length=500, blank=True, null=True)
    zip_code = CharField(max_length=10, blank=True, null=True)
    secondary_email = models.EmailField(blank=True, null=True)
    signature = CharField(max_length=4000000, blank=True, null=True)
    secondary_signature = CharField(max_length=4000000, blank=True, null=True)

    # On User creation, create user's profile
    @receiver(post_save, sender=User)
    def create_user_profile(sender, instance, created, **kwargs):
        if created:
            UserProfile.objects.create(user=instance)

    class Meta:
        ordering = ['-user__date_joined']
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'

    def __str__(self):
        return 'User profile for %s' % self.user.username


# Custom object based user permissions for each model
class UserPermissions(Model):
    """
    Permissions for taking actions on Group Plan are custom
    """

    id = models.AutoField(primary_key=True)
    user = ForeignKey(User, CASCADE)
    model = CharField(max_length=4, choices=MODEL_CHOICES, null=False, blank=False)
    permission_type = CharField(max_length=3, choices=ACTION_CHOICES, null=False, blank=False)
    value = BooleanField(default=False, null=False, blank=False)
    description = CharField(max_length=255, null=False, blank=False)

    class Meta:
        verbose_name = 'User Permission'
        verbose_name_plural = 'User Permissions'

    def __str__(self):
        return f'{self.description} permission for {self.user.username}'


# These decorators allow models to be viewed in django's admin page
@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    pass


@admin.register(UserPermissions)
class UserPermissionsAdmin(admin.ModelAdmin):
    pass
