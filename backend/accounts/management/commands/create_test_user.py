from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Create a test Consultant user for authentication testing'

    def handle(self, *args, **options):
        try:
            # Check if test user already exists
            if User.objects.filter(username='testuser').exists():
                self.stdout.write(
                    self.style.WARNING('Test user "testuser" already exists')
                )
                return

            # Create test user
            user = User.objects.create_user(
                consultant_id='TEST001',
                username='testuser',
                password='testpass123',
                fullname='Test User',
                email='test@example.com',
                orderindex=1,
                role='C',  # User role
                is_staff=True,
                is_active=True,
                active=True
            )

            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully created test user:\n'
                    f'Username: testuser\n'
                    f'Password: testpass123\n'
                    f'Consultant ID: {user.consultant_id}\n'
                    f'Full Name: {user.fullname}'
                )
            )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating test user: {e}')
            )
