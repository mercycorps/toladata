from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
import socket


class Command(BaseCommand):
    help = "Command to alias user emails with the tola@mercycorps.org email"
    production_host_name = 'neikeata'
    alias_email = 'tola+'
    domain = '@mercycorps.org'
    # Matches string that start with tola+ and end with @mercycorps.org
    regex = r'^tola\+[a-zA-Z0-9._%+-]+@mercycorps\.org$'

    def add_arguments(self, parser):
        parser.add_argument(
            '--execute', action='store_true', help='Without this flag, the command will only be a dry run'
        )
        parser.add_argument(
            '--supress_output', action='store_true', help='Hide text output'
        )

    def get_users(self):
        """
        Returns Users that have the following conditions:
            Email has not already been aliased (checked from the regex)
            User is not a superuser
            Email is not null
            Email is not blank
        """
        return User.objects.exclude(email__iregex=self.regex).exclude(is_superuser=True).exclude(email__isnull=True).exclude(email__exact='')

    def slugify_non_mc_email(self, email):
        chars = ['@', '.', '+']
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
        Loops through Users and prefixes each email with tola+
        """
        emails_aliased = 0

        if not options['supress_output'] and not options['execute']:
            self.stdout.write('Missing execute flag. This will be a dry run.')

        # Prevent the script from running on production
        if socket.gethostname() == self.production_host_name:
            if not options['supress_output']:
                self.stdout.write('Production environment skipping the command.')
            return

        users = self.get_users()

        if not options['supress_output']:
            self.stdout.write(f'Emails to be aliased: {len(users)}')

        for user in users:
            email = user.email

            if not user.email.endswith(self.domain):
                email = self.handle_non_mc_email(email)
            
            if options['execute']:
                user.email = self.alias_email + email
                user.save()
                emails_aliased += 1

        if not options['supress_output']:
            self.stdout.write(f'Emails Aliased: {emails_aliased}')
