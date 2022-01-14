"""Integrative tests for the home page (URL '/')"""

import datetime
from rest_framework.test import APIClient
from factories import (
    indicators_models as i_factories,
    workflow_models as w_factories
)
from django.shortcuts import render, reverse
from django import test

from indicators.models import Indicator

start_date = datetime.date(2015, 1, 1)
end_date = datetime.date(2016, 12, 31)


def get_generic_level_post_data(program_pk, **kwargs):
    generic_data = {
        'assumptions': "",
        'customsort': 1,
        'level_depth': 1,
        'name': "test level save",
        'parent': "root",
        'program': program_pk
    }
    for key, value in kwargs.items():
        if key in generic_data:
            generic_data[key] = value
    return generic_data


class TestRFViews(test.TestCase):
    def setUp(cls):
        cls.tola_user = w_factories.TolaUserFactory()
        cls.country = w_factories.CountryFactory()

    def test_participant_count_indicator_added(self):
        client = APIClient()
        client.force_login(self.tola_user.user)
        i_factories.IndicatorTypeFactory(indicator_type='Custom')
        i_factories.ReportingFrequencyFactory(frequency='Annual')
        program = w_factories.RFProgramFactory(tiers=True, country=[self.country])
        w_factories.grant_program_access(self.tola_user, program, self.country, 'high')
        self.assertEqual(Indicator.objects.count(), 0)
        client.post(reverse('insert_new_level'), data=get_generic_level_post_data(program.pk), format='json')
        indicators = Indicator.objects.all()
        self.assertEqual(indicators.count(), 1)
        self.assertEqual(indicators[0].name, Indicator.PARTICIPANT_COUNT_INDICATOR_NAME)


