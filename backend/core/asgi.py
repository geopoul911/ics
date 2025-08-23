import os
from django.core.asgi import get_asgi_application

"""
ASGI (Asynchronous Server Gateway Interface) is a spiritual successor to WSGI,
intended to provide a standard interface between async-capable Python web servers, frameworks, and applications.
"""

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Group_Plan.settings')

application = get_asgi_application()
