import csv
from collections import defaultdict
from itertools import chain

from django.core.management.commands import makemessages
from django.contrib.auth.models import User
from django.db.transaction import atomic

import workflow.models
from workflow.models import Country, CountryAccess, TolaUser


class Command(makemessages.Command):
    """
    A command to provide users with read-only permissions across all countries
    """
    def add_arguments(self, parser):
        group = parser.add_mutually_exclusive_group(required=True)
        group.add_argument('--filepath', help='Enter the path to the file you want to use.')
        group.add_argument('--email_list', help='A list of emails to update. User role will be given for all countries.')
        parser.add_argument(
            '--write', action='store_true', help='Create the permissions. Without this flag, it will be a dry run.')
        parser.add_argument('--verbose', action='store_true', help='More verbose output.')
        super(Command, self).add_arguments(parser)

    @atomic
    def handle(self, *args, **options):
        if options['email_list']:
            countries = Country.objects.all()
            emails = options['email_list'].split(',')
            for email in emails:
                email = email.strip()
                try:
                    user = User.objects.get(email=email)
                except User.DoesNotExist:
                    self.stdout.write(f"Couldn't find {email} in the database.")
                    continue

                for country in countries:
                    if options['write']:
                        CountryAccess.objects.get_or_create(
                            tolauser=user.tola_user, country=country, defaults={'role': 'user'})
                self.stdout.write(f'{email} was updated')
            if not options['write']:
                self.stdout.write('\n\n*****\n***** THIS WAS A DRY RUN.  USE --write FLAG TO ACTUALLY UPDATE PERMISSIONS *****\n*****\n')
            return

        alias_all = ['all mc countries', 'all']

        regions = defaultdict(list)
        for c in Country.objects.all().select_related('region'):
            if c.region:
                regions[c.region.name].append(c)
            else:
                regions['other'].append(c)
        all_countries = {c.country: c for c in chain.from_iterable(regions.values())}
        missing_users = []
        found_users = []
        errors = ''

        with open(options['filepath'], 'r', encoding='utf-8-sig') as fh:
            csv_lines = csv.reader(fh)
            for line in csv_lines:
                user_name, email, target_entities, raw_role = line[:4]
                email = email.strip()
                if user_name.strip().lower() == 'name' or email == '':
                    continue

                if not options['verbose']:
                    self.stdout.write(f'Processing {user_name}, {email}')
                if raw_role.lower() in [crc[0] for crc in workflow.models.COUNTRY_ROLE_CHOICES]:
                    role = raw_role.lower()
                else:
                    errors += f'\nCould not assign {email}.  Invalid role: {raw_role}'

                try:
                    tola_user = TolaUser.objects.get(user__email=email)
                    found_users.append(email)
                except TolaUser.DoesNotExist:
                    missing_users.append(email)
                    continue
                for target_entity in target_entities.split(';'):
                    target_entity = target_entity.strip()
                    if target_entity in regions.keys():
                        countries = regions[target_entity]
                    elif target_entity.lower() in alias_all:
                        countries = all_countries.values()
                    elif target_entity in all_countries.keys():
                        countries = [all_countries[target_entity]]
                    else:
                        errors += f'\nUnrecognized target: {target_entity}.'
                        continue
                    for country in countries:
                        if options['write']:
                            CountryAccess.objects.get_or_create(
                                tolauser=tola_user, country=country, defaults={'role': role})
                    countries_string = ', '.join([country.country for country in countries])
                    if options['verbose']:
                        if target_entity.lower() in alias_all:
                            self.stdout.write(f'Updating all country permissions for {tola_user}')
                        self.stdout.write(f'Updating {countries_string} permissions for {tola_user}')

        self.stdout.write('\n\n')
        if len(errors) > 0:
            self.stdout.write(f'Errors:\n' + ",".join(errors))
        else:
            self.stdout.write('No errors')
        self.stdout.write('\nMissing users:\n' + ','.join(missing_users))
        self.stdout.write('\nFound users\n' + ','.join(found_users))
        if not options['write']:
            self.stdout.write('\n\n*****\n***** THIS WAS A DRY RUN.  USE --write FLAG TO ACTUALLY UPDATE PERMISSIONS *****\n*****\n')
