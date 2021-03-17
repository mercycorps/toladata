"""Ensure reporting_period_start and reporting_period_end can only be set with first and last of the month dates
respectively"""

import datetime
import json
from django import test
from django.shortcuts import reverse
from django.db.models import Max
from factories import (
    workflow_models as w_factories,
    indicators_models as i_factories
)
from safedelete.models import SOFT_DELETE
from indicators.models import Indicator
from workflow.views import dated_target_info
from workflow.models import Program
from tola import util

class TestReportingPeriodDatesValidate(test.TestCase):

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.program = w_factories.ProgramFactory(
            reporting_period_start=datetime.date(2015, 1, 1),
            reporting_period_end=datetime.date(2017, 12, 31))

    def setUp(self):
        self.user = w_factories.UserFactory(first_name="FN", last_name="LN", username="iptt_tester", is_superuser=True)
        self.user.set_password('password')
        self.user.save()

        self.tola_user = w_factories.TolaUserFactory(user=self.user)
        self.tola_user.save()

        self.client = test.Client(enforce_csrf_checks=False)
        self.client.login(username='iptt_tester', password='password')

    def test_reporting_period_updates_with_good_start_data(self):
        response = self.client.post(reverse('reportingperiod_update', kwargs={'pk': self.program.pk}),
                                    {'reporting_period_start': '2016-01-01',
                                     'reporting_period_end': '2017-12-31'})
        self.assertEqual(json.loads(response.content)['msg'], 'success')
        self.assertEqual(response.status_code, 200)
        refreshed = Program.objects.get(pk=self.program.pk)
        self.assertEqual(refreshed.reporting_period_start, datetime.date(2016, 1, 1))
        self.assertEqual(refreshed.reporting_period_end, datetime.date(2017, 12, 31))

    def test_reporting_period_updates_with_good_end_data(self):
        response = self.client.post(reverse('reportingperiod_update', kwargs={'pk': self.program.pk}),
                                    {'reporting_period_start': '2015-01-01',
                                     'reporting_period_end': '2016-12-31'})
        self.assertEqual(json.loads(response.content)['msg'], 'success')
        self.assertEqual(response.status_code, 200)
        refreshed = Program.objects.get(pk=self.program.pk)
        self.assertEqual(refreshed.reporting_period_start, datetime.date(2015, 1, 1))
        self.assertEqual(refreshed.reporting_period_end, datetime.date(2016, 12, 31))

    def test_reporting_period_updates_with_good_both_data(self):
        response = self.client.post(reverse('reportingperiod_update', kwargs={'pk': self.program.pk}),
                                    {'reporting_period_start': '2014-02-01',
                                     'reporting_period_end': '2018-10-31'})
        self.assertEqual(json.loads(response.content)['msg'], 'success')
        self.assertEqual(response.status_code, 200)
        refreshed = Program.objects.get(pk=self.program.pk)
        self.assertEqual(refreshed.reporting_period_start, datetime.date(2014, 2, 1))
        self.assertEqual(refreshed.reporting_period_end, datetime.date(2018, 10, 31))

    def test_reporting_period_does_not_update_with_bad_start_data(self):
        response = self.client.post(reverse('reportingperiod_update', kwargs={'pk': self.program.pk}),
                                    {'reporting_period_start': '2015-02-15',
                                     'reporting_period_end': '2017-12-31'})
        self.assertEqual(json.loads(response.content)['msg'], 'fail')
        self.assertEqual(len(json.loads(response.content)['failmsg']), 1)
        self.assertEqual(response.status_code, 422)
        refreshed = Program.objects.get(pk=self.program.pk)
        self.assertEqual(refreshed.reporting_period_start, datetime.date(2015, 1, 1))
        self.assertEqual(refreshed.reporting_period_end, datetime.date(2017, 12, 31))

    def test_reporting_period_does_not_update_with_bad_end_data(self):
        response = self.client.post(reverse('reportingperiod_update', kwargs={'pk': self.program.pk}),
                                    {'reporting_period_start': '2015-01-01',
                                     'reporting_period_end': '2017-10-15'})
        self.assertEqual(json.loads(response.content)['msg'], 'fail')
        self.assertEqual(len(json.loads(response.content)['failmsg']), 1)
        self.assertEqual(response.status_code, 422)
        refreshed = Program.objects.get(pk=self.program.pk)
        self.assertEqual(refreshed.reporting_period_start, datetime.date(2015, 1, 1))
        self.assertEqual(refreshed.reporting_period_end, datetime.date(2017, 12, 31))

    def test_reporting_period_does_not_update_with_bad_both_data(self):
        response = self.client.post(reverse('reportingperiod_update', kwargs={'pk': self.program.pk}),
                                    {'reporting_period_start': '2015-02-15',
                                     'reporting_period_end': '2017-10-15'})
        self.assertEqual(json.loads(response.content)['msg'], 'fail')
        self.assertEqual(len(json.loads(response.content)['failmsg']), 2)
        self.assertEqual(response.status_code, 422)
        refreshed = Program.objects.get(pk=self.program.pk)
        self.assertEqual(refreshed.reporting_period_start, datetime.date(2015, 1, 1))
        self.assertEqual(refreshed.reporting_period_end, datetime.date(2017, 12, 31))

    def test_reporting_period_does_not_update_with_inverse_dates(self):
        response = self.client.post(reverse('reportingperiod_update', kwargs={'pk': self.program.pk}),
                                    {'reporting_period_start': '2016-01-01',
                                     'reporting_period_end': '2015-10-31'})
        self.assertEqual(json.loads(response.content)['msg'], 'fail')
        self.assertEqual(len(json.loads(response.content)['failmsg']), 1)
        self.assertEqual(response.status_code, 422)
        refreshed = Program.objects.get(pk=self.program.pk)
        self.assertEqual(refreshed.reporting_period_start, datetime.date(2015, 1, 1))
        self.assertEqual(refreshed.reporting_period_end, datetime.date(2017, 12, 31))

    def test_start_date_may_not_change_if_time_aware_target_set(self):
        indicator = i_factories.IndicatorFactory(
            target_frequency=Indicator.ANNUAL,
            program=self.program
        )
        for start, end in [(datetime.date(2015, 1, 1), datetime.date(2015, 12, 31)),
                           (datetime.date(2016, 1, 1), datetime.date(2016, 12, 31)),
                           (datetime.date(2017, 1, 1), datetime.date(2017, 12, 31))]:
            i_factories.PeriodicTargetFactory(
                start_date=start,
                end_date=end,
                indicator=indicator
            )
        response = self.client.post(reverse('reportingperiod_update', kwargs={'pk': self.program.pk}),
                                    {'reporting_period_start': '2016-01-01',
                                     'reporting_period_end': '2017-12-31',
                                     'rationale': 'test'})
        self.assertEqual(json.loads(response.content)['msg'], 'fail')
        self.assertEqual(len(json.loads(response.content)['failmsg']), 1)
        self.assertEqual(response.status_code, 422)
        refreshed = Program.objects.get(pk=self.program.pk)
        self.assertEqual(refreshed.reporting_period_start, datetime.date(2015, 1, 1))
        self.assertEqual(refreshed.reporting_period_end, datetime.date(2017, 12, 31))

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
        response = self.client.post(reverse('reportingperiod_update', kwargs={'pk': self.program.pk}),
                                    {'reporting_period_start': '2016-01-01',
                                     'reporting_period_end': '2017-12-31',
                                     'rationale': 'test'})
        self.assertEqual(json.loads(response.content)['msg'], 'success')
        self.assertEqual(len(json.loads(response.content)['failmsg']), 0)
        self.assertEqual(response.status_code, 200)
        refreshed = Program.objects.get(pk=self.program.pk)
        self.assertEqual(refreshed.reporting_period_start, datetime.date(2016, 1, 1))
        self.assertEqual(refreshed.reporting_period_end, datetime.date(2017, 12, 31))

    def test_end_date_will_not_change_to_before_last_time_aware_target_set(self):
        indicator = i_factories.IndicatorFactory(
            target_frequency=Indicator.ANNUAL,
            program=self.program
        )
        for start, end in [(datetime.date(2015, 1, 1), datetime.date(2015, 12, 31)),
                           (datetime.date(2016, 1, 1), datetime.date(2016, 12, 31)),
                           (datetime.date(2017, 1, 1), datetime.date(2017, 12, 31))]:
            i_factories.PeriodicTargetFactory(
                start_date=start,
                end_date=end,
                indicator=indicator
            )
        response = self.client.post(reverse('reportingperiod_update', kwargs={'pk': self.program.pk}),
                                    {'reporting_period_start': '2015-01-01',
                                     'reporting_period_end': '2016-10-31',
                                     'rationale': 'test'})
        self.assertEqual(json.loads(response.content)['msg'], 'fail')
        self.assertEqual(len(json.loads(response.content)['failmsg']), 1)
        self.assertEqual(response.status_code, 422)
        refreshed = Program.objects.get(pk=self.program.pk)
        self.assertEqual(refreshed.reporting_period_start, datetime.date(2015, 1, 1))
        self.assertEqual(refreshed.reporting_period_end, datetime.date(2017, 12, 31))

    def test_end_date_will_change_to_after_last_time_aware_target_set(self):
        indicator = i_factories.IndicatorFactory(
            target_frequency=Indicator.ANNUAL,
            program=self.program
        )
        for start, end in [(datetime.date(2015, 1, 1), datetime.date(2015, 12, 31)),
                           (datetime.date(2016, 1, 1), datetime.date(2016, 12, 31)),
                           (datetime.date(2017, 1, 1), datetime.date(2017, 12, 31))]:
            i_factories.PeriodicTargetFactory(
                start_date=start,
                end_date=end,
                indicator=indicator
            )
        response = self.client.post(reverse('reportingperiod_update', kwargs={'pk': self.program.pk}),
                                    {'reporting_period_start': '2015-01-01',
                                     'reporting_period_end': '2017-10-31',
                                     'rationale': 'test'})
        self.assertEqual(json.loads(response.content)['msg'], 'success')
        self.assertEqual(len(json.loads(response.content)['failmsg']), 0)
        self.assertEqual(response.status_code, 200)
        refreshed = Program.objects.get(pk=self.program.pk)
        self.assertEqual(refreshed.reporting_period_start, datetime.date(2015, 1, 1))
        self.assertEqual(refreshed.reporting_period_end, datetime.date(2017, 10, 31))

    def test_dated_target_info_returns_correct_date(self):
        i_factories.RFIndicatorFactory(
            program=self.program, target_frequency=Indicator.EVENT, targets=True)
        i_factories.RFIndicatorFactory(
            program=self.program, target_frequency=Indicator.LOP, targets=True)
        response = self.client.get(reverse('datedtargetinfo', kwargs={'pk': self.program.pk}))
        self.assertEqual(json.loads(response.content)['max_start_date'], None)
        indicator_annual = i_factories.RFIndicatorFactory(
            program=self.program, target_frequency=Indicator.ANNUAL, targets=True)
        response = self.client.get(reverse('datedtargetinfo', kwargs={'pk': self.program.pk}))
        self.assertEqual(json.loads(response.content)['max_start_date'], '2017-01-01')
        indicator_annual.delete(force_policy=SOFT_DELETE)
        response = self.client.get(reverse('datedtargetinfo', kwargs={'pk': self.program.pk}))
        self.assertEqual(json.loads(response.content)['max_start_date'], None)

sample_response = {
    u'end_date': u'2019-12-14',
    u'countries': u'Afghanistan',
    u'hq_admin': u'Portland',
    u'granttitle': u'Humanitarian Assistance for Protracted IDPs and Returnees in Western Afghanistan',
    u'creation_date': u'2017-08-21',
    u'start_date': u'2018-06-15',
    u'cost_center': u'33224',
    u'donor': u'United States Agency for International Development (USAID)',
    u'gaitid': u'8018',
    u'amount_usd': u'2000000.00',
    u'funding_status': u'Funded'
}

class TestGaitDateToReportingDates(test.TestCase):
    def test_gait_date_to_start_and_end_dates(self):
        dates = util.get_dates_from_gait_response(sample_response)
        self.assertEqual(dates['start_date'], datetime.date(2018, 6, 15))
        self.assertEqual(dates['end_date'], datetime.date(2019, 12, 14))

    def test_start_date_to_reporting_date(self):
        program = w_factories.ProgramFactory(
            start_date=datetime.date(2018, 6, 15),
            end_date=datetime.date(2019, 12, 14)
        )
        reporting_dates = util.get_reporting_dates(program)
        self.assertEqual(reporting_dates['reporting_period_start'], datetime.date(2018, 6, 1))
        self.assertEqual(reporting_dates['reporting_period_end'], datetime.date(2019, 12, 31))

    def test_various_start_date_conversions(self):
        for start, reporting in [
            (datetime.date(2014, 1, 1), datetime.date(2014, 1, 1)),
            (datetime.date(2015, 10, 13), datetime.date(2015, 10, 1)),
            (datetime.date(2016, 10, 30), datetime.date(2016, 10, 1)),
            (datetime.date(2017, 12, 31), datetime.date(2017, 12, 1))
        ]:
            program = w_factories.ProgramFactory(
                start_date=start,
                end_date=datetime.date(2019, 12, 31)
            )
            reporting_dates = util.get_reporting_dates(program)
            self.assertEqual(reporting_dates['reporting_period_start'], reporting)

    def test_various_end_date_conversions(self):
        for end, reporting in [
            (datetime.date(2014, 1, 1), datetime.date(2014, 1, 31)),
            (datetime.date(2015, 10, 13), datetime.date(2015, 10, 31)),
            (datetime.date(2016, 10, 30), datetime.date(2016, 10, 31)),
            (datetime.date(2017, 12, 31), datetime.date(2017, 12, 31))
        ]:
            program = w_factories.ProgramFactory(
                start_date=datetime.date(2013, 1, 1),
                end_date=end
            )
            reporting_dates = util.get_reporting_dates(program)
            self.assertEqual(reporting_dates['reporting_period_end'], reporting)
