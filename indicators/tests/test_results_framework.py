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

start_year = datetime.date.today().year if datetime.date.today().month < 7 else datetime.date.today().year + 1
end_year = start_year + 2
start_date = datetime.date(start_year, 1, 1)
end_date = datetime.date(end_year, 12, 31)
period_names = ['FY' + str(start_year), 'FY' + str(start_year + 1), 'FY' + str(end_year), 'FY' + str(end_year + 1)]
customsort_vals = [start_year, start_year + 1, end_year, end_year + 1]


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
        program = w_factories.RFProgramFactory(
            tiers=True, country=[self.country], reporting_period_start=start_date, reporting_period_end=end_date)
        w_factories.grant_program_access(self.tola_user, program, self.country, 'high')
        self.assertEqual(Indicator.objects.count(), 0)
        client.post(reverse('insert_new_level'), data=get_generic_level_post_data(program.pk), format='json')
        indicators = Indicator.objects.all()
        self.assertEqual(indicators.count(), 1)
        self.assertEqual(indicators[0].name, Indicator.PARTICIPANT_COUNT_INDICATOR_NAME)
        periodictargets = indicators.first().periodictargets.all()
        self.assertEqual(periodictargets.count(), 4)
        periods = []
        cs_values = []
        for pt in periodictargets:
            periods.append(pt.period)
            cs_values.append(pt.customsort)
        self.assertEqual(periods, period_names)
        self.assertEqual(cs_values, customsort_vals)



