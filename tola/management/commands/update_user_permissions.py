
from django.core.management.commands import makemessages
from django.contrib.auth.models import User
from workflow.models import Country, CountryAccess


class Command(makemessages.Command):
    """
    A command to provide users with read-only permissions across all countries
    """
    def add_arguments(self, parser):
        parser.add_argument('emails', nargs='+', help='Enter a list of emails separated by spaces.')
        super(Command, self).add_arguments(parser)

    def handle(self, *args, **options):
        countries = Country.objects.all()
        for email in options['emails']:
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                print(f"Couldn't find {email} in the database.")
                continue

            for country in countries:
                ca = CountryAccess.objects.get_or_create(
                    tolauser=user.tola_user, country=country, defaults={'role': 'user'})
            print(f'{email} was updated')

