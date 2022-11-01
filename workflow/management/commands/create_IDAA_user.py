from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from workflow.models import TolaUser


class Command(BaseCommand):
    help = "Command to create a user with the name IDAA"

    def handle(self, *args, **options):
        user = User.objects.create(username='IDAA', first_name='IDAA', last_name='')
        user.save()
        tolauser = TolaUser.objects.create(user=user, organization_id=1)
        tolauser.save()
