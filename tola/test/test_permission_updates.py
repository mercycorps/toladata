import os
import sys

from django.test import TestCase
from django.core.management import call_command

import workflow.models
from workflow.models import Country, Region
from factories.workflow_models import CountryFactory, TolaUserFactory, CountryAccess


class TestUpdatePermissionsFromCommandLine (TestCase):
    def setUp(self):
        CountryFactory.create_batch(5)
        self.tola_user1 = TolaUserFactory()
        self.tola_user2 = TolaUserFactory()
        self.tola_user3 = TolaUserFactory()
        self.country_count = 8

    def test_single_user(self):
        stdout_backup, sys.stdout = sys.stdout, open(os.devnull, 'a')
        call_command('update_user_permissions', f'--email_list={self.tola_user1.user.email}', '--write')
        sys.stdout = stdout_backup
        self.assertEqual(self.tola_user1.countries.all().count(), self.country_count)
        self.assertEqual(self.tola_user2.countries.all().count(), 0)
        self.assertEqual(self.tola_user3.countries.all().count(), 0)

    def test_multi_user(self):
        stdout_backup, sys.stdout = sys.stdout, open(os.devnull, 'a')
        call_command(
            'update_user_permissions',
            f'--email_list={self.tola_user1.user.email}, {self.tola_user2.user.email}',
            '--write'
        )
        sys.stdout = stdout_backup
        self.assertEqual(self.tola_user1.countries.all().count(), self.country_count)
        self.assertEqual(self.tola_user2.countries.all().count(), self.country_count)
        self.assertEqual(self.tola_user3.countries.all().count(), 0)

    def test_existing_permission(self):
        primary_country = Country.objects.first()
        CountryAccess.objects.create(tolauser=self.tola_user1, country=primary_country, role='high')
        stdout_backup, sys.stdout = sys.stdout, open(os.devnull, 'a')
        call_command('update_user_permissions', f'--email_list={self.tola_user1.user.email}', '--write')
        sys.stdout = stdout_backup
        self.assertEqual(self.tola_user1.countries.all().count(), self.country_count)
        self.assertEqual(CountryAccess.objects.filter(tolauser=self.tola_user1, country=primary_country).count(), 1)
        self.assertEqual(CountryAccess.objects.get(tolauser=self.tola_user1, country=primary_country).role, 'high')
        non_primary_country_pks = Country.objects.exclude(pk=primary_country.pk).values_list('pk', flat=True)
        non_primary_country_roles = CountryAccess.objects\
            .filter(country__in=non_primary_country_pks, tolauser=self.tola_user1)\
            .values_list('role', flat=True)
        self.assertTrue(all([True if role == 'user' else False for role in non_primary_country_roles]))


class TestUpdatePermissionsFromFile (TestCase):

    def setUp(self):
        self.africa_region = Region.objects.create(name='Africa')
        self.americas_region = Region.objects.create(name='Americas')
        self.nigeria = CountryFactory.create(country='Nigeria', region=self.africa_region)
        self.sudan = CountryFactory.create(country='Sudan', region=self.africa_region)
        self.ethiopia = CountryFactory.create(country='Ethiopia', region=self.africa_region)
        self.colombia = CountryFactory.create(country='Colombia', region=self.americas_region)
        self.user_nocountry = TolaUserFactory(
            user__first_name='No', user__last_name='Countré', user__email='nocountre@mercycorps.org', country=None)
        self.user_onecountry = TolaUserFactory(
            user__first_name='First', user__last_name='Country', user__email='firstcountry@mercycorps.org',
            country=self.sudan)
        CountryAccess.objects.create(
            tolauser=self.user_onecountry,
            country=self.sudan,
            role=workflow.models.COUNTRY_ROLE_CHOICES[0][0])
        self.user_admincountry = TolaUserFactory(
            user__first_name='Admin', user__last_name='Country', user__email='admincountry@mercycorps.org',
            country=self.ethiopia)
        CountryAccess.objects.create(
            tolauser=self.user_admincountry,
            country=self.ethiopia,
            role=workflow.models.COUNTRY_ROLE_CHOICES[1][0])
        self.user_americascountry = TolaUserFactory(
            user__first_name='Americas', user__last_name='Country', user__email='americascountry@mercycorps.org',
            country=self.colombia)
        self.user_allcountry = TolaUserFactory(
            user__first_name='All', user__last_name='Country', user__email='allcountry@mercycorps.org',
            country=self.colombia)
        self.user_alladmincountry = TolaUserFactory(
            user__first_name='AllAdminn', user__last_name='Country', user__email='alladmincountry@mercycorps.org',
            country=self.colombia)
        self.africa_ids = {self.nigeria.id, self.ethiopia.id, self.sudan.id}

    def test_perms_from_file(self):
        self.assertEqual(CountryAccess.objects.count(), 2)
        file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'user_perm_update.csv')
        stdout_backup, sys.stdout = sys.stdout, open(os.devnull, 'a')
        call_command('update_user_permissions', f'--filepath={file_path}', '--write')
        sys.stdout = stdout_backup
        self.assertIsNone(self.user_nocountry.country)
        self.assertEqual(self.africa_ids, {c.id for c in self.user_nocountry.available_countries})
        self.assertEqual(self.africa_ids, {c.id for c in self.user_onecountry.available_countries})
        self.assertEqual(self.africa_ids, {c.id for c in self.user_admincountry.available_countries})
        self.assertEqual(self.ethiopia, self.user_admincountry.managed_countries[0])
        self.assertEqual(
            {self.colombia.id, self.nigeria.id},
            {c.id for c in self.user_americascountry.available_countries})
        self.assertEqual(
            {c.id for c in Country.objects.filter(region__in=(self.africa_region, self.americas_region))},
            {c.id for c in self.user_allcountry.available_countries})
        self.assertEqual(
            {c.id for c in Country.objects.filter(region__in=(self.africa_region, self.americas_region))},
            {c.id for c in self.user_alladmincountry.managed_countries})
        self.assertEqual(CountryAccess.objects.count(), 18)



