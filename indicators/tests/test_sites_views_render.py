"""Tests that list and add sites views render correctly (200, has content)"""

from django import test
from django.urls import reverse
from factories import (
    workflow_models as w_factories,
    indicators_models as i_factories
)

class TestSitesPagesRender(test.TestCase):
    def setUp(self):
        country = w_factories.CountryFactory()
        self.program_empty = w_factories.RFProgramFactory()
        self.program_empty.country.add(country)
        self.program_full = w_factories.RFProgramFactory(tiers=True, levels=1)
        self.program_full.country.add(country)
        for level in self.program_full.levels.all():
            indicator = i_factories.RFIndicatorFactory(program=self.program_full, level=level, targets=True)
            site = w_factories.SiteProfileFactory(country=country)
            result = i_factories.ResultFactory(indicator=indicator, achieved=100)
            result.site.set([site])
        self.site = site
        tola_user = w_factories.TolaUserFactory(country=country)
        w_factories.grant_program_access(tola_user, self.program_empty, country, 'high')
        self.client.force_login(tola_user.user)

    def test_site_list_renders_empty(self):
        response = self.client.get(
            reverse('siteprofile_list', kwargs={'program_id': self.program_empty.pk, 'activity_id': 0})
        )
        self.assertEqual(response.status_code, 200)

    def test_site_list_renders_full(self):
        response = self.client.get(
            reverse('siteprofile_list', kwargs={'program_id': self.program_full.pk, 'activity_id': 0})
        )
        self.assertEqual(response.status_code, 200)

    def test_site_add_renders(self):
        response = self.client.get(
            reverse('siteprofile_add')
        )
        self.assertEqual(response.status_code, 200)

    def test_site_update_renders(self):
        response = self.client.get(
            reverse('siteprofile_update', kwargs={'pk': self.site.pk})
        )
        self.assertEqual(response.status_code, 200)

    def test_site_delete_renders(self):
        response = self.client.get(
            reverse('siteprofile_delete', kwargs={'pk': self.site.pk})
        )
        self.assertEqual(response.status_code, 200)