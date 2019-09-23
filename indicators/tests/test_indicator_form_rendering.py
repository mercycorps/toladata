# -*- coding: utf-8 -*-
"""Tests for Indicator CREATE/UPDATE form GET request html

    - non-RF program
    - RF program with standard tiers
    - RF program with non-standard tiers
"""

from django import test
from django.urls import reverse
from factories import (
    workflow_models as w_factories,
    indicators_models as i_factories
)
from indicators.models import Indicator

class TestNonRFProgramIndicatorFormRendering(test.TestCase):
    """a program exists that is not migrated to RF"""

    def setUp(self):
        country = w_factories.CountryFactory()
        self.program = w_factories.RFProgramFactory(migrated=False)
        self.program.country.add(country)
        self.indicator = i_factories.RFIndicatorFactory(
            program=self.program, target_frequency=Indicator.ANNUAL, targets=500, results=True
        )
        tola_user = w_factories.TolaUserFactory(country=country)
        w_factories.grant_program_access(tola_user, self.program, country, 'high')
        self.client.force_login(tola_user.user)

    def test_indicator_create_form_renders(self):
        response = self.client.get(reverse('indicator_create', kwargs={'program': self.program.pk}))
        self.assertEqual(response.status_code, 200)

    def test_indicator_update_form_renders(self):
        response = self.client.get(reverse('indicator_update', kwargs={'pk': self.indicator.pk}))
        self.assertEqual(response.status_code, 200)


class TestRFStandardProgramIndicatorFormRendering(test.TestCase):
    """a program exists that is migrated to RF with MC Tiers"""

    def setUp(self):
        country = w_factories.CountryFactory()
        self.program = w_factories.RFProgramFactory(migrated=True, tiers=True, levels=2)
        self.program.country.add(country)
        self.indicator = i_factories.RFIndicatorFactory(
            program=self.program, target_frequency=Indicator.ANNUAL, targets=500, results=True,
            level=self.program.levels.all()[3]
        )
        tola_user = w_factories.TolaUserFactory(country=country)
        w_factories.grant_program_access(tola_user, self.program, country, 'high')
        self.client.force_login(tola_user.user)

    def test_indicator_create_form_renders(self):
        response = self.client.get(reverse('indicator_create', kwargs={'program': self.program.pk}))
        self.assertEqual(response.status_code, 200)

    def test_indicator_update_form_renders(self):
        response = self.client.get(reverse('indicator_update', kwargs={'pk': self.indicator.pk}))
        self.assertEqual(response.status_code, 200)


class TestRFNonStandardProgramIndicatorFormRendering(test.TestCase):
    """a program exists that is migrated to RF with wacky, wacky tiers"""

    def setUp(self):
        country = w_factories.CountryFactory()
        self.program = w_factories.RFProgramFactory(
            migrated=True, tiers=[u'Spécîal Chåracters1', u'###!@#$', 'asdf'], levels=2
        )
        self.program.country.add(country)
        self.indicator = i_factories.RFIndicatorFactory(
            program=self.program, target_frequency=Indicator.ANNUAL, targets=500, results=True,
            level=self.program.levels.all()[3]
        )
        tola_user = w_factories.TolaUserFactory(country=country)
        w_factories.grant_program_access(tola_user, self.program, country, 'high')
        self.client.force_login(tola_user.user)

    def test_indicator_create_form_renders(self):
        response = self.client.get(reverse('indicator_create', kwargs={'program': self.program.pk}))
        self.assertEqual(response.status_code, 200)

    def test_indicator_update_form_renders(self):
        response = self.client.get(reverse('indicator_update', kwargs={'pk': self.indicator.pk}))
        self.assertEqual(response.status_code, 200)