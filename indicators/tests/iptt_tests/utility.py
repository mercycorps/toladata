import json
import datetime

from factories import workflow_models as w_factories
from factories import indicators_models as i_factories
from indicators.models import Indicator

from django import test
from django.urls import reverse

class IPTTTVADataResponseBase(test.TestCase):
    indicator_frequency = Indicator.LOP
    indicator_kwargs = {'is_cumulative': False}

    def setUp(self):
        self.user = w_factories.TolaUserFactory()
        self.client = test.Client()
        self.client.force_login(self.user.user)
        self.response = None
        self.program = w_factories.ProgramFactory(
            reporting_period_start=datetime.date(2017, 2, 1),
            reporting_period_end=datetime.date(2019, 10, 31)
        )

    def tearDown(self):
        self.response = None

    def get_indicator_for_program(self, **kwargs):
        kwargs['program'] = self.program
        return i_factories.IndicatorFactory(**kwargs)

    def get_indicator_by_frequency(self, frequency, **kwargs):
        kwargs['target_frequency'] = frequency
        return self.get_indicator_for_program(**kwargs)

    def get_response(self, frequency=None):
        data = {
            'programId': self.program.id,
            'frequency': frequency if frequency is not None else self.indicator_frequency,
            'reportType': 'tva'
        }
        response = self.client.get(reverse('iptt_ajax'), data, follow=True)
        self.assertEqual(response.status_code, 200, "expected 200 code, got {0}".format(response.status_code))
        self.assertEqual(len(response.redirect_chain), 0,
                         "no redirects expected, got redirect chain: {0}".format(response.redirect_chain))
        try:
            content = json.loads(response.content)
        except ValueError as e:
            self.fail("response was not json, content {0} with exception {1}".format(response.content, e.strerror))
        return content

    def format_assert_message(self, message):
        return "{0}: \n{1}".format(self.response, message)

class LOPIndicator:
    data = {}

    def add_result(self, value, indicator=None):
        indicator = self.indicator if indicator is None else indicator
        date_collected = self.program.reporting_period_start + datetime.timedelta(days=len(self.data[indicator.pk]))
        data = i_factories.ResultFactory(indicator=indicator, achieved=value,
                                         date_collected=date_collected)
        self.data[indicator.pk].append(data)
        return data

    def get_targets(self, indicator):
        self.data[indicator.pk] = []

class MidendIndicator:
    targets = {}
    result_target = {}
    data = {}

    def get_targets(self, indicator):
        self.targets[indicator.pk] = [
            i_factories.PeriodicTargetFactory(target=50, customsort=0, indicator=indicator,
                                              start_date=self.program.reporting_period_start,
                                              end_date=self.program.reporting_period_end),
            i_factories.PeriodicTargetFactory(target=49, customsort=1, indicator=indicator,
                                              start_date=self.program.reporting_period_start,
                                              end_date=self.program.reporting_period_end)
            ]
        self.result_target[indicator.pk] = 0

    def add_result(self, value, target=None, indicator=None):
        indicator = self.indicator if indicator is None else indicator
        if target is None:
            target = self.targets[indicator.pk][self.result_target[indicator.pk]]
            self.result_target[indicator.pk] = (self.result_target[indicator.pk] + 1) % 2
        date_collected = target.start_date + datetime.timedelta(days=len(self.data))
        data = i_factories.ResultFactory(indicator=indicator, achieved=value,
                                         periodic_target=target,
                                         date_collected=date_collected)
        if indicator.pk not in self.data:
            self.data[indicator.pk] = []
        self.data[indicator.pk].append(data)
        return data

class TimeawareIndicator:
    targets = {}
    result_target = {}
    data = {}

    def get_targets(self, indicator):
        self.targets[indicator.pk] = []
        self.data[indicator.pk] = {}
        for period in self.program.get_periods_for_frequency(self.indicator_frequency):
            self.targets[indicator.pk].append(
                i_factories.PeriodicTargetFactory(
                    target=(period['customsort'] * 10), customsort=period['customsort'],
                    indicator=indicator, start_date=period['start'], end_date=period['end']
                )
            )
            self.data[indicator.pk][period['customsort']] = []
        self.result_target[indicator.pk] = 0

    def add_result(self, value, target=None, indicator=None):
        indicator = self.indicator if indicator is None else indicator
        if target is None:
            target = self.targets[indicator.pk][self.result_target[indicator.pk]]
            self.result_target[indicator.pk] = (self.result_target[indicator.pk] + 1) % len(self.targets[indicator.pk])
        date_collected = target.start_date + datetime.timedelta(days=len(self.data[indicator.pk][target.customsort]))
        data = i_factories.ResultFactory(indicator=indicator, achieved=value,
                                         periodic_target=target, date_collected=date_collected)
        self.data[indicator.pk][target.customsort].append(data)
        return data


class Numeric:
    def get_indicator(self, **kwargs):
        these_kwargs = self.indicator_kwargs.copy()
        these_kwargs['unit_of_measure_type'] = Indicator.NUMBER
        these_kwargs.update(kwargs)
        indicator = self.get_indicator_by_frequency(self.indicator_frequency,
                                                    **these_kwargs)
        self.get_targets(indicator)
        return indicator

    def add_multiple_results(self):
        expected_sum = 0
        for point in [14, 200, 29.3, 58, 43]:
            expected_sum += point
            self.add_result(point)
        return expected_sum

    def add_hundred_percent_results(self):
        for point in [80, 10, 4, 3, 1, 1]:
            self.add_result(point)

class Percent:
    def get_indicator(self, **kwargs):
        these_kwargs = self.indicator_kwargs.copy()
        these_kwargs['unit_of_measure_type'] = Indicator.PERCENTAGE
        these_kwargs.update(kwargs)
        indicator = self.get_indicator_by_frequency(self.indicator_frequency,
                                                    **these_kwargs)
        self.get_targets(indicator)
        return indicator

    def add_multiple_results(self):
        for point in [14, 200, 29.3, 58, 43]:
            self.add_result(point)
        return 43

    def add_hundred_percent_results(self):
        for point in [80, 14, 32, 55, 91, 99]:
            self.add_result(point)
