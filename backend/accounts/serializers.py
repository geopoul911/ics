# accounts/serializers.py
from django.contrib.auth import authenticate, get_user_model
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

User = get_user_model()

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=15, trim_whitespace=True)
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        username = (attrs.get("username") or "").strip()
        password = attrs.get("password")

        if not username or not password:
            raise serializers.ValidationError(
                _("Username and password are required."),
                code="authorization",
            )

        user = authenticate(
            request=self.context.get("request"),
            username=username,
            password=password,
        )

        if not user:
            # Keep message generic for security (don’t leak which field failed)
            raise serializers.ValidationError(
                _("Unable to authenticate with provided credentials."),
                code="authorization",
            )

        # Extra safety: ensure user is active in both Django and your model flag (if present)
        if not getattr(user, "is_active", True):
            raise serializers.ValidationError(
                _("This account is inactive."),
                code="authorization",
            )
        if hasattr(user, "active") and not getattr(user, "active"):
            raise serializers.ValidationError(
                _("This account is inactive."),
                code="authorization",
            )

        attrs["user"] = user
        return attrs


class UserSerializer(serializers.ModelSerializer):
    # Alias primary key as `id` for frontend convenience
    id = serializers.CharField(source="consultant_id", read_only=True)

    # Helpful derived fields
    photo_url = serializers.SerializerMethodField()
    cashpassport_countries = serializers.SerializerMethodField()
    role_display = serializers.SerializerMethodField()
    permissions = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            # identifiers
            "id", "consultant_id", "username",

            # profile
            "fullname", "email", "phone", "mobile", "photo", "photo_url",

            # org / access
            "role", "role_display", "canassigntask", "cashpassport",
            "cashpassport_countries", "orderindex",

            # auth flags
            "is_active", "active", "is_staff", "is_superuser",

            # permissions summary (optional but handy)
            "permissions",
        ]
        read_only_fields = fields  # login response only; not used for writes here

    # ----- derived field resolvers -----

    def get_photo_url(self, obj):
        """
        Absolute URL to the user's photo if present.
        Requires MEDIA settings and request in serializer context.
        """
        if not obj.photo:
            return None
        request = self.context.get("request")
        try:
            url = obj.photo.url
        except Exception:
            return None
        return request.build_absolute_uri(url) if request else url

    def get_cashpassport_countries(self, obj):
        """
        Parsed list version of the comma-separated cashpassport field.
        """
        try:
            return obj.get_cashpassport_countries()
        except AttributeError:
            if not obj.cashpassport:
                return []
            return [c.strip() for c in str(obj.cashpassport).split(",") if c.strip()]

    def get_role_display(self, obj):
        """
        Human label for the single-letter role (e.g., 'Admin' for 'A').
        """
        # Uses Django's built-in get_FOO_display() from choices
        try:
            return obj.get_role_display()
        except Exception:
            mapping = {"A": "Admin", "S": "Supervisor", "U": "Superuser", "C": "User"}
            return mapping.get(obj.role, obj.role)

    def get_permissions(self, obj):
        """
        Compact permission summary useful for the frontend.
        """
        # Individual permissions from user and groups
        perms = set(obj.get_user_permissions()) | set(obj.get_group_permissions())
        # Return as a sorted list for stability
        return sorted(perms)
