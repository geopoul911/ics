from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager


from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

class ConsultantManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError("Users must have a username")
        username = username.strip()
        user = self.model(username=username, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", "A")  # or 'U' if you prefer
        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")
        return self.create_user(username, password, **extra_fields)


class Consultant(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ('A', 'Admin'),
        ('S', 'Supervisor'),
        ('U', 'Superuser'),
        ('C', 'User'),
    ]

    consultant_id = models.CharField(max_length=10, primary_key=True)
    orderindex = models.SmallIntegerField(blank=True, null=True)
    fullname = models.CharField(max_length=40)
    email = models.EmailField()
    phone = models.CharField(max_length=15, blank=True, null=True)
    mobile = models.CharField(max_length=15)
    photo = models.ImageField(upload_to='consultant_photos/', blank=True, null=True)
    role = models.CharField(max_length=1, choices=ROLE_CHOICES)

    username = models.CharField(max_length=15, unique=True)

    # Django auth flags
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)  # admin access

    # your extra flags
    canassigntask = models.BooleanField(default=False)
    cashpassport = models.CharField(
        max_length=40, blank=True, null=True,
        help_text="Comma-separated list of country codes (e.g., 'GRE,CAN' or 'GRE,USA,CAN')"
    )
    active = models.BooleanField(default=True)  # optional; redundant with is_active

    objects = ConsultantManager()

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["fullname", "orderindex"]  # add anything you want required on createsuperuser

    def __str__(self):
        return self.fullname

    # helpers you had
    def get_cashpassport_countries(self):
        if not self.cashpassport:
            return []
        return [code.strip() for code in self.cashpassport.split(',')]

    def set_cashpassport_countries(self, country_codes):
        self.cashpassport = ','.join(code.strip() for code in country_codes)

    def has_cashpassport_access(self, country_code):
        if not self.cashpassport:
            return False
        return country_code.strip() in self.get_cashpassport_countries()

    class Meta:
        verbose_name = "Consultant"
        verbose_name_plural = "Consultants"
        ordering = ['orderindex', 'fullname']



class AuditEvent(models.Model):
    class Action(models.TextChoices):
        CREATE = "create", "Create"
        UPDATE = "update", "Update"
        DELETE = "delete", "Delete"
        LOGIN = "login", "Login"
        LOGOUT = "logout", "Logout"
        LOGIN_FAILED = "login_failed", "Login Failed"

    # who did it (nullable for anonymous / failed attempts)
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name="audit_events",
    )

    # what happened
    action = models.CharField(max_length=32, choices=Action.choices)

    # which object was affected (optional for login/logout)
    target_content_type = models.ForeignKey(
        ContentType, null=True, blank=True, on_delete=models.SET_NULL, related_name="+"
    )
    target_object_id = models.CharField(max_length=64, null=True, blank=True)
    target = GenericForeignKey("target_content_type", "target_object_id")

    # request context
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)

    # whether the action succeeded (e.g., failed login)
    success = models.BooleanField(default=True)

    # free-form human message
    message = models.TextField(blank=True, default="")

    # structured details (changed fields, payloads, etc.)
    # Django 3.1+ has models.JSONField; if you're older, use django.contrib.postgres.fields.JSONField
    metadata = models.JSONField(blank=True, default=dict)

    occurred_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["occurred_at"]),
            models.Index(fields=["action"]),
            models.Index(fields=["actor", "occurred_at"]),
            models.Index(fields=["target_content_type", "target_object_id"]),
        ]
        ordering = ["-occurred_at"]

    def __str__(self):
        who = self.actor_id or "anonymous"
        tgt = f"{self.target_content_type}:{self.target_object_id}" if self.target_object_id else "-"
        return f"[{self.occurred_at:%Y-%m-%d %H:%M:%S}] {who} {self.action} {tgt}"
