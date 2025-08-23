from django.apps import AppConfig

"""
This file is created to help the user include any application configuration for the app.
Using this, you can configure some of the attributes of the application.

This code defines a AccountsConfig class which inherits from the WebappConfig class provided by Django.

The WebappConfig class is a base class for configuring Django applications.
It provides a variety of hooks for customizing the behavior of an application,
such as specifying a custom app name, defining signals to be sent
when the app is ready or when it is being shut down, and so on.

In this case, the AccountsConfig class sets the name attribute to the string 'accounts'.
This tells Django that this app is named accounts,
and allows Django to reference this app by its name throughout the rest of the codebase.

By convention, this class is defined in a file called apps.py within the app's directory.
This file is automatically loaded by Django when the app is installed,
and the configuration options provided by this class are used to configure the app's behavior.
"""


class WebappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'webapp'
