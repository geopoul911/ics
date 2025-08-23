import os
from django.core.wsgi import get_wsgi_application

"""
A Web Server Gateway Interface (WSGI) server implements the web server side
of the WSGI interface for running Python web applications.

wsgi.py is a Python file that is used by web servers to interface with Python web applications,
particularly those built using the WSGI (Web Server Gateway Interface) standard.

WSGI is a standard interface between web servers and Python web applications,
allowing web servers to communicate with Python applications in a standardized way.
The wsgi.py file is used to create a WSGI application object,
which is then used by the web server to communicate with the application.

In Django, the wsgi.py file is typically used to create a WSGI application object for the project,
which can then be served by a web server such as Apache or Nginx.
The file includes a WSGIHandler object, which is responsible
for handling incoming requests and sending responses back to the web server.

Overall, the wsgi.py file is an important part of many Python web applications,
as it allows the application to interface with web servers in a standardized way,
enabling it to be served to users over the internet.
"""

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

application = get_wsgi_application()
