import csv
from collections import defaultdict
from itertools import chain

from django.core.management.commands import makemessages
from django.contrib.auth.models import User

import workflow.models
from workflow.models import Country, CountryAccess, TolaUser


class Command(makemessages.Command):
    """
    A command to provide users with read-only permissions across all countries
    """
    def add_arguments(self, parser):
        parser.add_argument('filepath', help='Enter the path to the file you want to use.')
        parser.add_argument(
            '--execute', action='store_true', help='Create the permissions. Without this flag, it will be a dry run.')
        parser.add_argument('--verbose', action='store_true', help='More verbose output.')
        super(Command, self).add_arguments(parser)

    def handle(self, *args, **options):

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
            import sys

            for line in csv_lines:

                raw_user_name, target_entities, raw_role, level = line
                user_name = raw_user_name.strip()
                if user_name.lower() == 'name':
                    continue

                if options['verbose']:
                    print('Processing', user_name)
                if raw_role.lower() in [crc[0] for crc in workflow.models.COUNTRY_ROLE_CHOICES]:
                    role = raw_role.lower()
                else:
                    errors += f'\nCould not assign {user_name}.  Invalid role: {raw_role}'

                try:
                    tola_user = TolaUser.objects.get(name=user_name.strip())
                    found_users.append(user_name)
                except TolaUser.DoesNotExist:
                    missing_users.append(user_name)
                    continue
                for target_entity in target_entities.split(';'):
                    target_entity = target_entity.strip()
                    print(f'target entity |{target_entity}')
                    if target_entity in regions.keys():
                        region_countries = regions[target_entity]
                        for country in region_countries:
                            if options['execute']:
                                CountryAccess.objects.get_or_create(
                                    tolauser=tola_user, country=country, defaults={'role': role})
                            if options['verbose']:
                                print(f'Updating {country.country} permissions for {tola_user}')
                    elif target_entity in all_countries.keys():
                        if options['execute']:
                            CountryAccess.objects.get_or_create(
                                tolauser=tola_user, country=all_countries[target_entity], defaults={'role': role})
                        if options['verbose']:
                            print(f'Updating {country.country} permissions for {tola_user}')
                    elif target_entity.lower() in alias_all:
                        for country in all_countries.values():
                            if options['execute']:
                                CountryAccess.objects.get_or_create(
                                    tolauser=tola_user, country=all_countries[target_entity], defaults={'role': role})
                        if options['verbose']:
                            print(f'Updating permissions for {tola_user} for all countries')
                    else:
                        errors += f'\nUnrecognized target: |{target_entity}|.'


        if len(errors) > 0:
            print('Errors:', errors)
        print('\nmissing users', missing_users)
        print('\nfound users', found_users)








        # countries = Country.objects.all()
        # for email in options['emails']:
        #     try:
        #         user = User.objects.get(email=email)
        #     except User.DoesNotExist:
        #         print(f"Couldn't find {email} in the database.")
        #         continue
        #
        #     for country in countries:
        #         ca = CountryAccess.objects.get_or_create(
        #             tolauser=user.tola_user, country=country, defaults={'role': 'user'})
        #     print(f'{email} was updated')

