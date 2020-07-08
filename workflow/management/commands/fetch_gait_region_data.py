import requests
from django.core.management.base import BaseCommand, CommandError
from django.conf import settings
from workflow.models import Region, Country


class Command(BaseCommand):
    help = """
        Gets all region and country data from GAIT, updates Tola Region and country.region data
        """

    @staticmethod
    def _get_response(url):
        headers = {'Authorization': f'Token {settings.PROGRAM_API_TOKEN}'}
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            raise CommandError(f"Request to GAIT URL {url} failed:\n{response.raw}")
        return response

    @staticmethod
    def _get_and_update_regions_list(regions_json):
        for region in regions_json:
            region_obj, created = Region.objects.get_or_create(
                gait_region_id=region['region_id'],
                defaults={'name': region['region']}
            )
            print(f"{'C' if created else '.'}", end='')

    @staticmethod
    def _get_and_update_countries_list(countries_json):
        countries_by_code = {c['iso2']: c for c in countries_json}
        countries_by_name = {c['country_name']: c for c in countries_json}
        for country in Country.objects.all():
            if country.code in countries_by_code:
                region = Region.objects.get(gait_region_id=countries_by_code[country.code]['region_id'])
            elif country.country in countries_by_name:
                if not country.code and countries_by_name[country.country]['iso2']:
                    country.code = countries_by_name[country.country]['iso2']
                    country.save()
                    print('C', end='')
                region = Region.objects.get(gait_region_id=countries_by_name[country.country]['region_id'])
            else:
                region = None
            if country.region != region:
                country.region = region
                country.save()
                print('U', end='')
            else:
                print('.', end='')

    def handle(self, *args, **options):
        COUNTRY_URL = f"{settings.MCAPI_BASE_URL}gaitcountry/"
        REGION_URL = f"{settings.MCAPI_BASE_URL}gaitregion/"
        print("updating regions list")
        response = self._get_response(REGION_URL)
        self._get_and_update_regions_list(response.json())
        print("\nUpdating countries list")
        response = self._get_response(COUNTRY_URL)
        self._get_and_update_countries_list(response.json())