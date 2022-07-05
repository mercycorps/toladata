"""Ensure the change of reporting_period_start and reporting_period_end add and removes targets appropriately"""

import datetime
from django import test
from django.shortcuts import reverse
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
        start_year = datetime.date.today().year if datetime.date.today().month < 7 else datetime.date.today().year + 1
        end_year = start_year + 2
        start_date = datetime.date(start_year, 1, 1)
        end_date = datetime.date(end_year, 12, 31)
        period_names = ['FY' + str(start_year), 'FY' + str(start_year + 1), 'FY' + str(end_year), 'FY' + str(end_year + 1)]
        self.client.post(reverse('reportingperiod_update', kwargs={'pk': self.program.pk}),
                         {'reporting_period_start': start_date,
                          'reporting_period_end': end_date,
                          'rationale': 'test'})
        pc_indicator = self.program.indicator_set.filter(admin_type=Indicator.ADMIN_PARTICIPANT_COUNT)
        self.assertEqual(pc_indicator.count(), 1)
        periodictargets = pc_indicator.first().periodictargets.all()
        periods = []
        for pt in periodictargets:
            periods.append(pt.period)
        self.assertEqual(periodictargets.count(), 4)
        self.assertEqual(periods, period_names)

        # Add one fiscal year at the end
        end_date_plus_one = datetime.date(end_year + 1, 12, 31)
        self.client.post(reverse('reportingperiod_update', kwargs={'pk': self.program.pk}),
                         {'reporting_period_start': start_date,
                          'reporting_period_end': end_date_plus_one,
                          'rationale': 'test'})
        periodictargets = pc_indicator.first().periodictargets.all()
        self.assertEqual(periodictargets.count(), 5)

        # Subtract one fiscal year from the end
        self.client.post(reverse('reportingperiod_update', kwargs={'pk': self.program.pk}),
                         {'reporting_period_start': start_date,
                          'reporting_period_end': end_date,
                          'rationale': 'test'})
        periodictargets = pc_indicator.first().periodictargets.all()
        self.assertEqual(periodictargets.count(), 4)

        # Subtract one fiscal from the front
        start_date_plus_one = datetime.date(start_year + 1, 1, 1)
        self.client.post(reverse('reportingperiod_update', kwargs={'pk': self.program.pk}),
                         {'reporting_period_start': start_date_plus_one,
                          'reporting_period_end': end_date,
                          'rationale': 'test'})
        periodictargets = pc_indicator.first().periodictargets.all()
        self.assertEqual(periodictargets.count(), 3)

        # Add one fiscal to the front
        self.client.post(reverse('reportingperiod_update', kwargs={'pk': self.program.pk}),
                         {'reporting_period_start': start_date,
                          'reporting_period_end': end_date,
                          'rationale': 'test'})
        periodictargets = pc_indicator.first().periodictargets.all()
        self.assertEqual(periodictargets.count(), 4)

        # Subtract fiscal year from both ends
        end_date_minus_one = datetime.date(end_year - 1, 12, 31)
        self.client.post(reverse('reportingperiod_update', kwargs={'pk': self.program.pk}),
                         {'reporting_period_start': start_date_plus_one,
                          'reporting_period_end': end_date_minus_one,
                          'rationale': 'test'})
        periodictargets = pc_indicator.first().periodictargets.all()
        self.assertEqual(periodictargets.count(), 2)

        # Add fiscal year to both ends
        self.client.post(reverse('reportingperiod_update', kwargs={'pk': self.program.pk}),
                         {'reporting_period_start': start_date,
                          'reporting_period_end': end_date,
                          'rationale': 'test'})
        periodictargets = pc_indicator.first().periodictargets.all()
        self.assertEqual(periodictargets.count(), 4)

        # Add result to first pt
        self.result = i_factories.ResultFactory(
            indicator=pc_indicator.first(),
            program=self.program,
            periodic_target=pc_indicator.first().periodictargets.first(),
            achieved=100
        )

        # Confirm pt with added result cannot be deleted
        self.client.post(reverse('reportingperiod_update', kwargs={'pk': self.program.pk}),
                         {'reporting_period_start': start_date_plus_one,
                          'reporting_period_end': end_date_minus_one,
                          'rationale': 'test'})
        periodictargets = pc_indicator.first().periodictargets.all()
        periods = []
        for pt in periodictargets:
            periods.append(pt.period)
        self.assertEqual(periodictargets.count(), 3)
        self.assertEqual(periods, period_names[:3])

