import datetime
import json
from django import test
from django.shortcuts import reverse
from factories import (
    workflow_models as w_factories,
    indicators_models as i_factories
)
from rest_framework.test import APIClient
from indicators.models import Indicator
from workflow.models import Program
from workflow.serializers_new import program_period_serializer


class TestPCResultSerializerWriteValidation(test.TestCase):
    serializer = program_period_serializer.ProgramPeriodSerializerUpdate
    error_messages = {
        'rationale': 'Reason for change is required',
        'wrong_start_day': 'Indicator tracking period must start on the first of the month',
        'time_aware_targets': 'Indicator tracking period start date cannot be changed while time-aware periodic targets are in place',
        'no_end_date': 'You must select a Indicator tracking period end date',
        'time_aware_indicator': 'Indicator tracking period must end after the start of the last target period',
        'wrong_end_day': 'Indicator tracking period must end on the last day of the month',
        'end_greater': 'Indicator tracking period must start before tracking period end',
        'outside_IDAA_dates': 'Indicator tracking period cannot be outside of IDAA dates'
    }

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.country = w_factories.CountryFactory()
        cls.program = w_factories.ProgramFactory(
            country=[cls.country],
            start_date=datetime.date(2021, 1, 10),
            end_date=datetime.date(2026, 12, 10),
            reporting_period_start=datetime.date(2022, 1, 1),
            reporting_period_end=datetime.date(2023, 12, 31))

    def setUp(self):
        # Set is_superuser to False in order to test functionality for lower permissions levels.
        self.user = w_factories.UserFactory(first_name="FN", last_name="LN", username="pp_update_tester", is_superuser=True)
        self.user.set_password('password')
        self.user.save()

        self.tola_user = w_factories.TolaUserFactory(user=self.user, country=self.country)
        w_factories.grant_program_access(self.tola_user, self.program, self.country, 'low')
        self.tola_user.save()

        self.client = APIClient()
        self.client.login(username='pp_update_tester', password='password')

    def test_reporting_period_updates_get(self):
        response = self.client.get(reverse('program_period_update', kwargs={'pk': self.program.pk}))
        self.assertEqual(response.status_code, 200)
        program = Program.objects.get(pk=self.program.pk)
        self.assertEqual(program.start_date, datetime.date(2021, 1, 10))
        self.assertEqual(program.end_date, datetime.date(2026, 12, 10))
        self.assertEqual(program.reporting_period_start, datetime.date(2022, 1, 1))
        self.assertEqual(program.reporting_period_end, datetime.date(2023, 12, 31))

    def test_reporting_period_updates_put_with_good_start_data(self):
        response = self.client.put(reverse('program_period_update', kwargs={'pk': self.program.pk}),
                                    {'reporting_period_start': '2023-01-01',
                                     'reporting_period_end': '2023-12-31',
                                     'rationale': 'test'}, format='json')
        self.assertEqual(json.loads(response.content)['message'], 'success')
        self.assertEqual(response.status_code, 200)
        refreshed = Program.objects.get(pk=self.program.pk)
        self.assertEqual(refreshed.reporting_period_start, datetime.date(2023, 1, 1))
        self.assertEqual(refreshed.reporting_period_end, datetime.date(2023, 12, 31))

    def test_reporting_period_updates_put_with_good_end_data(self):
        response = self.client.put(reverse('program_period_update', kwargs={'pk': self.program.pk}),
                                   {'reporting_period_start': '2023-01-01',
                                    'reporting_period_end': '2024-12-31',
                                    'rationale': 'test'}, format='json')
        self.assertEqual(json.loads(response.content)['message'], 'success')
        self.assertEqual(response.status_code, 200)
        refreshed = Program.objects.get(pk=self.program.pk)
        self.assertEqual(refreshed.reporting_period_start, datetime.date(2023, 1, 1))
        self.assertEqual(refreshed.reporting_period_end, datetime.date(2024, 12, 31))

    def test_reporting_period_updates_put_with_good_start_end_data(self):
        response = self.client.put(reverse('program_period_update', kwargs={'pk': self.program.pk}),
                                   {'reporting_period_start': '2021-01-01',
                                    'reporting_period_end': '2025-12-31',
                                    'rationale': 'test'}, format='json')
        self.assertEqual(json.loads(response.content)['message'], 'success')
        self.assertEqual(response.status_code, 200)
        refreshed = Program.objects.get(pk=self.program.pk)
        self.assertEqual(refreshed.reporting_period_start, datetime.date(2021, 1, 1))
        self.assertEqual(refreshed.reporting_period_end, datetime.date(2025, 12, 31))

    def test_reporting_period_does_not_update_with_bad_start_data(self):
        response = self.client.put(reverse('program_period_update', kwargs={'pk': self.program.pk}),
                                   {'reporting_period_start': '2021-01-15',
                                    'reporting_period_end': '2025-12-31',
                                    'rationale': 'test'}, format='json')
        self.assertEqual(response.status_code, 422)
        self.assertEqual(json.loads(response.content)['reporting_period_start'], [self.error_messages['wrong_start_day']])
        refreshed = Program.objects.get(pk=self.program.pk)
        self.assertEqual(refreshed.reporting_period_start, datetime.date(2022, 1, 1))
        self.assertEqual(refreshed.reporting_period_end, datetime.date(2023, 12, 31))

    def test_reporting_period_does_not_update_with_bad_end_data(self):
        response = self.client.put(reverse('program_period_update', kwargs={'pk': self.program.pk}),
                                   {'reporting_period_start': '2021-01-01',
                                    'reporting_period_end': '2025-12-15',
                                    'rationale': 'test'}, format='json')
        self.assertEqual(response.status_code, 422)
        self.assertEqual(json.loads(response.content)['reporting_period_end'], [self.error_messages['wrong_end_day']])
        refreshed = Program.objects.get(pk=self.program.pk)
        self.assertEqual(refreshed.reporting_period_start, datetime.date(2022, 1, 1))
        self.assertEqual(refreshed.reporting_period_end, datetime.date(2023, 12, 31))

    def test_reporting_period_does_not_update_earlier_than_IDAA_start(self):
        response = self.client.put(reverse('program_period_update', kwargs={'pk': self.program.pk}),
                                   {'reporting_period_start': '2020-01-01',
                                    'reporting_period_end': '2023-12-31',
                                    'rationale': 'test'}, format='json')
        self.assertEqual(response.status_code, 422)
        self.assertEqual(json.loads(response.content)['reporting_period_start'], [self.error_messages['outside_IDAA_dates']])
        refreshed = Program.objects.get(pk=self.program.pk)
        self.assertEqual(refreshed.reporting_period_start, datetime.date(2022, 1, 1))
        self.assertEqual(refreshed.reporting_period_end, datetime.date(2023, 12, 31))

    def test_reporting_period_does_not_update_later_than_IDAA_end(self):
        response = self.client.put(reverse('program_period_update', kwargs={'pk': self.program.pk}),
                                   {'reporting_period_start': '2022-01-01',
                                    'reporting_period_end': '2027-12-31',
                                    'rationale': 'test'}, format='json')
        self.assertEqual(response.status_code, 422)
        self.assertEqual(json.loads(response.content)['reporting_period_end'], [self.error_messages['outside_IDAA_dates']])
        refreshed = Program.objects.get(pk=self.program.pk)
        self.assertEqual(refreshed.reporting_period_start, datetime.date(2022, 1, 1))
        self.assertEqual(refreshed.reporting_period_end, datetime.date(2023, 12, 31))

    def test_reporting_period_does_not_update_with_inverse_dates(self):
        response = self.client.put(reverse('program_period_update', kwargs={'pk': self.program.pk}),
                                   {'reporting_period_start': '2023-01-01',
                                    'reporting_period_end': '2022-12-31',
                                    'rationale': 'test'}, format='json')
        self.assertEqual(response.status_code, 422)
        self.assertEqual(json.loads(response.content)['reporting_period_end'], [self.error_messages['end_greater']])
        refreshed = Program.objects.get(pk=self.program.pk)
        self.assertEqual(refreshed.reporting_period_start, datetime.date(2022, 1, 1))
        self.assertEqual(refreshed.reporting_period_end, datetime.date(2023, 12, 31))

    def test_reporting_period_does_not_update_with_no_dates(self):
        response = self.client.put(reverse('program_period_update', kwargs={'pk': self.program.pk}),
                                   {'rationale': 'test'}, format='json')
        self.assertEqual(response.status_code, 422)
        self.assertEqual(json.loads(response.content)['reporting_period_end'], [self.error_messages['no_end_date']])
        refreshed = Program.objects.get(pk=self.program.pk)
        self.assertEqual(refreshed.reporting_period_start, datetime.date(2022, 1, 1))
        self.assertEqual(refreshed.reporting_period_end, datetime.date(2023, 12, 31))

    def test_start_date_may_not_change_if_time_aware_target_set(self):
        indicator = i_factories.IndicatorFactory(
            target_frequency=Indicator.ANNUAL,
            program=self.program
        )
        for start, end in [(datetime.date(2022, 1, 1), datetime.date(2023, 12, 31)),
                           (datetime.date(2023, 1, 1), datetime.date(2023, 12, 31))]:
            i_factories.PeriodicTargetFactory(
                start_date=start,
                end_date=end,
                indicator=indicator
            )
        response = self.client.put(reverse('program_period_update', kwargs={'pk': self.program.pk}),
                                    {'reporting_period_start': '2023-01-01',
                                     'reporting_period_end': '2023-12-31',
                                     'rationale': 'test'}, format='json')
        self.assertEqual(response.status_code, 422)
        self.assertEqual(json.loads(response.content)['reporting_period_start'],
                         [self.error_messages['time_aware_targets']])
        refreshed = Program.objects.get(pk=self.program.pk)
        self.assertEqual(refreshed.reporting_period_start, datetime.date(2022, 1, 1))
        self.assertEqual(refreshed.reporting_period_end, datetime.date(2023, 12, 31))

    def test_start_date_does_change_if_no_time_aware_target_set(self):
        indicator = i_factories.IndicatorFactory(
            target_frequency=Indicator.MID_END,
            program=self.program
        )
        i_factories.PeriodicTargetFactory(
            start_date=None,
            end_date=None,
            customsort=0,
            indicator=indicator
        )
        response = self.client.put(reverse('program_period_update', kwargs={'pk': self.program.pk}),
                                    {'reporting_period_start': '2023-01-01',
                                     'reporting_period_end': '2024-12-31',
                                     'rationale': 'test'}, format='json')
        self.assertEqual(response.status_code, 200)
        refreshed = Program.objects.get(pk=self.program.pk)
        self.assertEqual(refreshed.reporting_period_start, datetime.date(2023, 1, 1))
        self.assertEqual(refreshed.reporting_period_end, datetime.date(2024, 12, 31))

    def test_end_date_will_not_change_to_before_last_time_aware_target_set(self):
        indicator = i_factories.IndicatorFactory(
            target_frequency=Indicator.ANNUAL,
            program=self.program
        )
        for start, end in [(datetime.date(2022, 1, 1), datetime.date(2023, 12, 31)),
                           (datetime.date(2023, 1, 1), datetime.date(2023, 12, 31))]:
            i_factories.PeriodicTargetFactory(
                start_date=start,
                end_date=end,
                indicator=indicator
            )
        response = self.client.put(reverse('program_period_update', kwargs={'pk': self.program.pk}),
                                   {'reporting_period_start': '2022-01-01',
                                    'reporting_period_end': '2022-12-31',
                                    'rationale': 'test'}, format='json')
        self.assertEqual(response.status_code, 422)
        self.assertEqual(json.loads(response.content)['reporting_period_end'],
                         [self.error_messages['time_aware_indicator']])
        refreshed = Program.objects.get(pk=self.program.pk)
        self.assertEqual(refreshed.reporting_period_start, datetime.date(2022, 1, 1))
        self.assertEqual(refreshed.reporting_period_end, datetime.date(2023, 12, 31))

    def test_end_date_will_change_to_after_last_time_aware_target_set(self):
        indicator = i_factories.IndicatorFactory(
            target_frequency=Indicator.ANNUAL,
            program=self.program
        )
        for start, end in [(datetime.date(2022, 1, 1), datetime.date(2023, 12, 31)),
                           (datetime.date(2023, 1, 1), datetime.date(2023, 12, 31))]:
            i_factories.PeriodicTargetFactory(
                start_date=start,
                end_date=end,
                indicator=indicator
            )
        response = self.client.put(reverse('program_period_update', kwargs={'pk': self.program.pk}),
                                   {'reporting_period_start': '2022-01-01',
                                    'reporting_period_end': '2024-12-31',
                                    'rationale': 'test'}, format='json')
        self.assertEqual(response.status_code, 200)
        refreshed = Program.objects.get(pk=self.program.pk)
        self.assertEqual(refreshed.reporting_period_start, datetime.date(2022, 1, 1))
        self.assertEqual(refreshed.reporting_period_end, datetime.date(2024, 12, 31))

    def test_end_date_will_not_change_without_rationale(self):
        indicator = i_factories.IndicatorFactory(
            target_frequency=Indicator.ANNUAL,
            program=self.program
        )
        for start, end in [(datetime.date(2022, 1, 1), datetime.date(2023, 12, 31)),
                           (datetime.date(2023, 1, 1), datetime.date(2023, 12, 31))]:
            i_factories.PeriodicTargetFactory(
                start_date=start,
                end_date=end,
                indicator=indicator
            )
        response = self.client.put(reverse('program_period_update', kwargs={'pk': self.program.pk}),
                                   {'reporting_period_start': '2022-01-01',
                                    'reporting_period_end': '2024-12-31',
                                    }, format='json')
        self.assertEqual(response.status_code, 422)
        self.assertEqual(json.loads(response.content)['rationale'],
                         [self.error_messages['rationale']])
        refreshed = Program.objects.get(pk=self.program.pk)
        self.assertEqual(refreshed.reporting_period_start, datetime.date(2022, 1, 1))
        self.assertEqual(refreshed.reporting_period_end, datetime.date(2023, 12, 31))

    def test_end_date_will_not_change_with_empty_rationale(self):
        indicator = i_factories.IndicatorFactory(
            target_frequency=Indicator.ANNUAL,
            program=self.program
        )
        for start, end in [(datetime.date(2022, 1, 1), datetime.date(2023, 12, 31)),
                           (datetime.date(2023, 1, 1), datetime.date(2023, 12, 31))]:
            i_factories.PeriodicTargetFactory(
                start_date=start,
                end_date=end,
                indicator=indicator
            )
        response = self.client.put(reverse('program_period_update', kwargs={'pk': self.program.pk}),
                                   {'reporting_period_start': '2022-01-01',
                                    'reporting_period_end': '2024-12-31',
                                    'rationale': ''}, format='json')
        self.assertEqual(response.status_code, 422)
        self.assertEqual(json.loads(response.content)['rationale'],
                         [self.error_messages['rationale']])
        refreshed = Program.objects.get(pk=self.program.pk)
        self.assertEqual(refreshed.reporting_period_start, datetime.date(2022, 1, 1))
        self.assertEqual(refreshed.reporting_period_end, datetime.date(2023, 12, 31))






