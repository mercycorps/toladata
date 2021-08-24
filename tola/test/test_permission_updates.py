from django.contrib.auth.models import User
from django.test import TestCase
from django.core.management import call_command

from workflow.models import Country
from factories.workflow_models import CountryFactory, UserFactory, TolaUserFactory, CountryAccess


class TestUpdateUserPermissions (TestCase):

    def setUp(self):
        CountryFactory.create_batch(5)
        self.tola_user1 = TolaUserFactory()
        self.tola_user2 = TolaUserFactory()
        self.tola_user3 = TolaUserFactory()
        self.country_count = Country.objects.count()

    def test_single_user(self):
        call_command('update_user_permissions', self.tola_user1.user.email)
        self.assertEqual(self.tola_user1.countries.all().count(), self.country_count)
        self.assertEqual(self.tola_user2.countries.all().count(), 0)
        self.assertEqual(self.tola_user3.countries.all().count(), 0)

    def test_multi_user(self):
        call_command('update_user_permissions', self.tola_user1.user.email, self.tola_user2.user.email)
        self.assertEqual(self.tola_user1.countries.all().count(), self.country_count)
        self.assertEqual(self.tola_user2.countries.all().count(), self.country_count)
        self.assertEqual(self.tola_user3.countries.all().count(), 0)

    def test_existing_permission(self):
        primary_country = Country.objects.first()
        CountryAccess.objects.create(tolauser=self.tola_user1, country=primary_country, role='high')
        call_command('update_user_permissions', self.tola_user1.user.email)
        self.assertEqual(self.tola_user1.countries.all().count(), self.country_count)
        self.assertEqual(CountryAccess.objects.filter(tolauser=self.tola_user1, country=primary_country).count(), 1)
        self.assertEqual(CountryAccess.objects.get(tolauser=self.tola_user1, country=primary_country).role, 'high')
        non_primary_country_pks = Country.objects.exclude(pk=primary_country.pk).values_list('pk', flat=True)
        non_primary_country_roles = CountryAccess.objects\
            .filter(country__in=non_primary_country_pks, tolauser=self.tola_user1)\
            .values_list('role', flat=True)
        self.assertTrue(all([True if role == 'user' else False for role in non_primary_country_roles]))
