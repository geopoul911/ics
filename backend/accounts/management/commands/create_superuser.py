from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Create a superuser Consultant with admin privileges'

    def add_arguments(self, parser):
        parser.add_argument(
            '--username',
            type=str,
            default='admin',
            help='Username for the superuser'
        )
        parser.add_argument(
            '--password',
            type=str,
            default='admin123',
            help='Password for the superuser'
        )
        parser.add_argument(
            '--email',
            type=str,
            default='admin@ics.com',
            help='Email for the superuser'
        )

    def handle(self, *args, **options):
        try:
            username = options['username']
            password = options['password']
            email = options['email']

            # Check if superuser already exists
            if User.objects.filter(username=username).exists():
                self.stdout.write(
                    self.style.WARNING(f'Superuser "{username}" already exists')
                )
                return

            # Create superuser
            user = User.objects.create_user(
                consultant_id='ADMIN001',
                username=username,
                password=password,
                fullname='System Administrator',
                email=email,
                orderindex=0,
                role='A',  # Admin role
                is_staff=True,
                is_superuser=True,
                is_active=True,
                active=True,
                canassigntask=True
            )

            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully created superuser:\n'
                    f'Username: {username}\n'
                    f'Password: {password}\n'
                    f'Consultant ID: {user.consultant_id}\n'
                    f'Full Name: {user.fullname}\n'
                    f'Role: Administrator'
                )
            )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating superuser: {e}')
            ) 