from django.core.management.base import BaseCommand
from workflow.models import Country, CountryAccess, TolaUser, Organization


class Command(BaseCommand):
    help = "To be run on Demo server! Give all users in MC org basic_admin role for country Xanadu"

    def handle(self, *args, **options):
        xanadu = Country.objects.filter(country="Xanadu").first()
        tola_users = TolaUser.objects.filter(organization_id=Organization.MERCY_CORPS_ID)
        for tola_user in tola_users:
            ca, created = CountryAccess.objects.get_or_create(
                country=Country.objects.get(country=xanadu),
                tolauser=tola_user
            )
            ca.role = 'basic_admin'
            ca.save()

