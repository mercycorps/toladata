from django.core.management.base import BaseCommand
from workflow.models import CountryAccess
import socket


class Command(BaseCommand):
    help = "Command to alias country admin emails with the tola@mercycorps.org email"
    production_host_name = 'neikeata'
    alias_email = 'tola+'
    domain = '@mercycorps.org'

    def add_arguments(self, parser):
        parser.add_argument(
            '--execute', action='store_true', help='Without this flag, the command will only be a dry run'
        )
        parser.add_argument(
            '--supress_output', action='store_true', help='Hide text output'
        )

    def get_country_admins(self):
        return CountryAccess.objects.filter(role='basic_admin').exclude(tolauser__user__is_superuser=True)

    def slugify_non_mc_email(self, email):
        chars = ['@', '.']
        for char in chars:
            email = email.replace(char, '_')
        return email

    def handle_non_mc_email(self, email):
        """
        Slugify non mercycorps emails then add the @mercycorps.org domain
        """
        email = self.slugify_non_mc_email(email)
        email += self.domain
        return email

    def handle(self, *args, **options):
        """
        Loops through all country admins and prefixes each email with tola+
        """
        emails_aliased = 0

        if not options['supress_output'] and not options['execute']:
            print('Missing execute flag. This will be a dry run.')

        # Prevent the script from running on production
        if socket.gethostname() != self.production_host_name:
            country_admins = self.get_country_admins()
            for country_admin in country_admins:
                user = country_admin.tolauser.user
                # Check that the email has not already been aliased
                if user.email[0:len(self.alias_email)] != self.alias_email:
                    if not user.email.endswith(self.domain):
                        email = self.handle_non_mc_email(user.email)
                    else:
                        email = user.email
                    
                    if options['execute']:
                        user.email = self.alias_email + email
                        user.save()
    
                        emails_aliased += 1
        else:
            if not options['supress_output']:
                print('Production environment skipping the command.')

        if not options['supress_output'] and options['execute']:
            print('Emails Aliased: ', emails_aliased)
