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


# These decorators allow models to be viewed in django's admin page
@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    pass
