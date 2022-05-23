"""Ensure reporting_period_start and reporting_period_end can only be set with first and last of the month dates
respectively"""

import datetime
import json
from django import test
from django.shortcuts import reverse
from django.db.models import Max
from django.core import management
from factories import (
    workflow_models as w_factories,
    indicators_models as i_factories
)
from indicators.models import Indicator, IndicatorType, ReportingFrequency


class TestReportingPeriodDatesChange(test.TestCase):

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.program = w_factories.ProgramFactory(
            reporting_period_start=datetime.date(2020, 1, 1),
            reporting_period_end=datetime.date(2020, 12, 31))

    def setUp(self):
        i_factories.IndicatorTypeFactory(indicator_type=IndicatorType.PC_INDICATOR_TYPE)
        i_factories.ReportingFrequencyFactory(frequency=ReportingFrequency.PC_REPORTING_FREQUENCY)
        self.user = w_factories.UserFactory(first_name="FN", last_name="LN", username="iptt_tester", is_superuser=True)
        self.user.set_password('password')
        self.user.save()

        self.tola_user = w_factories.TolaUserFactory(user=self.user)
        self.tola_user.save()

        self.client = test.Client(enforce_csrf_checks=False)
        self.client.login(username='iptt_tester', password='password')

    def create_disaggs(self):
        """
        Runs the management command create_participant_count_indicators as a dry run to create the disaggs
        """
        management.call_command(
            'create_participant_count_indicators', create_disaggs_themes=True, suppress_output=True)


    def test_periodic_target_recalculate_with_reporting_period_change(self):
        self.create_disaggs()
        i_factories.LevelFactory(name="Test", program=self.program)
        pc_indicator = self.program.indicator_set.filter(admin_type=Indicator.ADMIN_PARTICIPANT_COUNT)
        self.assertEqual(pc_indicator.count(), 0)

        # Update reporting period
        self.client.post(reverse('reportingperiod_update', kwargs={'pk': self.program.pk}),
                         {'reporting_period_start': '2023-01-01',
                          'reporting_period_end': '2025-12-31',
                          'rationale': 'test'})
        pc_indicator = self.program.indicator_set.filter(admin_type=Indicator.ADMIN_PARTICIPANT_COUNT)
        self.assertEqual(pc_indicator.count(), 1)
        periodictargets = pc_indicator.first().periodictargets.all()
        periods = []
        for pt in periodictargets:
            periods.append(pt.period)
        self.assertEqual(periodictargets.count(), 4)
        self.assertEqual(periods, ['FY2023', 'FY2024', 'FY2025', 'FY2026'])

        # Add one fiscal year at the end
        self.client.post(reverse('reportingperiod_update', kwargs={'pk': self.program.pk}),
                         {'reporting_period_start': '2023-01-01',
                          'reporting_period_end': '2026-12-31',
                          'rationale': 'test'})
        periodictargets = pc_indicator.first().periodictargets.all()
        self.assertEqual(periodictargets.count(), 5)

        # Subtract one fiscal year from the end
        self.client.post(reverse('reportingperiod_update', kwargs={'pk': self.program.pk}),
                         {'reporting_period_start': '2023-01-01',
                          'reporting_period_end': '2025-12-31',
                          'rationale': 'test'})
        periodictargets = pc_indicator.first().periodictargets.all()
        self.assertEqual(periodictargets.count(), 4)

        # Add one fiscal to the front
        self.client.post(reverse('reportingperiod_update', kwargs={'pk': self.program.pk}),
                         {'reporting_period_start': '2022-01-01',
                          'reporting_period_end': '2025-12-31',
                          'rationale': 'test'})
        periodictargets = pc_indicator.first().periodictargets.all()
        self.assertEqual(periodictargets.count(), 5)

        # Subtract one fiscal from the front
        self.client.post(reverse('reportingperiod_update', kwargs={'pk': self.program.pk}),
                         {'reporting_period_start': '2023-01-01',
                          'reporting_period_end': '2025-12-31',
                          'rationale': 'test'})
        periodictargets = pc_indicator.first().periodictargets.all()
        self.assertEqual(periodictargets.count(), 4)

        # Subtract fiscal year from both ends
        self.client.post(reverse('reportingperiod_update', kwargs={'pk': self.program.pk}),
                         {'reporting_period_start': '2024-01-01',
                          'reporting_period_end': '2024-12-31',
                          'rationale': 'test'})
        periodictargets = pc_indicator.first().periodictargets.all()
        self.assertEqual(periodictargets.count(), 2)

        # Add fiscal year to both ends
        self.client.post(reverse('reportingperiod_update', kwargs={'pk': self.program.pk}),
                         {'reporting_period_start': '2022-01-01',
                          'reporting_period_end': '2025-12-31',
                          'rationale': 'test'})
        periodictargets = pc_indicator.first().periodictargets.all()
        periods = []
        for pt in periodictargets:
            periods.append(pt.period)
        self.assertEqual(periodictargets.count(), 5)
        self.assertEqual(periods, ['FY2022', 'FY2023', 'FY2024', 'FY2025', 'FY2026'])

        # Add result to first pt
        self.result = i_factories.ResultFactory(
            indicator=pc_indicator.first(),
            program=self.program,
            periodic_target=pc_indicator.first().periodictargets.first(),
            achieved=100
        )

        # Confirm pt with added result cannot be deleted
        self.client.post(reverse('reportingperiod_update', kwargs={'pk': self.program.pk}),
                         {'reporting_period_start': '2020-01-01',
                          'reporting_period_end': '2020-12-31',
                          'rationale': 'test'})
        periodictargets = pc_indicator.first().periodictargets.all()
        periods = []
        for pt in periodictargets:
            periods.append(pt.period)
        self.assertEqual(periodictargets.count(), 1)
        self.assertEqual(periods, ['FY2022'])

