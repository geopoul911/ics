from rest_framework.permissions import BasePermission, SAFE_METHODS
from rest_framework.exceptions import PermissionDenied


class RoleBasedPermission(BasePermission):
    """
    Global role-based permission policy for the whole API.

    Roles:
      - 'A' (Admin) and 'S' (Supervisor): full access (CRUD)
      - 'U' (Superuser): full access except Consultant create and modifying other consultants
      - 'C' (User): read and create only (no update/delete)

    Views can optionally define:
      - restrict_post_roles = ['A', 'S']  # to limit POST to specific roles
    """

    def has_permission(self, request, view):
        user = getattr(request, 'user', None)
        role = getattr(user, 'role', None)

        # Unauthenticated users: no access (expect views already require auth)
        if not user or not user.is_authenticated:
            return False

        method = request.method

        # Always allow safe reads
        if method in SAFE_METHODS:
            return True

        # POST (create)
        if method == 'POST':
            # Allow view-level override
            restrict = getattr(view, 'restrict_post_roles', None)
            if restrict is not None:
                return role in restrict
            # By default everyone can create
            return role in ['A', 'S', 'U', 'C']

        # PUT/PATCH/DELETE (modify)
        if method in ['PUT', 'PATCH', 'DELETE']:
            # Basic rule: Users cannot modify
            if role == 'C':
                return False
            # Admin/Supervisor/Superuser allowed at this level; object-level checks may tighten
            return role in ['A', 'S', 'U']

        # Fallback deny with clear message
        raise PermissionDenied(detail="You do not have permission to perform this action.")

    def has_object_permission(self, request, view, obj):
        user = getattr(request, 'user', None)
        role = getattr(user, 'role', None)
        method = request.method

        # Safe methods handled in has_permission
        if method in SAFE_METHODS:
            return True

        # Users cannot modify at all
        if role == 'C' and method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            if method == 'POST':
                return True
            raise PermissionDenied(detail="You do not have permission to modify or delete.")

        # Superuser limits for Consultant objects
        try:
            from accounts.models import Consultant
        except Exception:
            Consultant = None

        if Consultant is not None and isinstance(obj, Consultant):
            if method in ['PUT', 'PATCH', 'DELETE']:
                # Only Admin/Supervisor can modify other consultants
                if role in ['A', 'S']:
                    return True
                # Superuser can only modify his own record
                if role == 'U':
                    allowed = getattr(user, 'pk', None) == getattr(obj, 'pk', None)
                    if not allowed:
                        raise PermissionDenied(detail="You can only modify your own consultant profile.")
                    return True
                raise PermissionDenied(detail="You do not have permission to modify this consultant.")

        # Default allow based on method-level rules
        return True


