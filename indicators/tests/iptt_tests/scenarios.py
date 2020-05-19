""" Scenario generation (version 4?) for IPTT unit/integration tests

    - Results
        - has no results
        - has one result in one period
        - has multiple results in one period
        - has one result each in multiple periods
        - has multiple results in multiple periods
    - Disaggregated Values
        - result is disaggregated
        - result is not disaggregated
    - Summation type
        - Numeric Cumulative
        - Numeric Non-Cumulative
        - Percent
"""

import datetime
from django import test
from django.urls import reverse
from factories import (
    workflow_models as w_factories,
    indicators_models as i_factories,
    django_models as d_factories
)
from indicators.models import Indicator

class IPTTReportProgram(object):
    start_date = datetime.date(2016, 1, 1)
    end_date = datetime.date(2017, 12, 31)
    
    def __init__(self):
        self.setup_program()
        self.setup_disaggregations()
        self.setup_client()

    def setup_program(self):
        self.user = d_factories.UserFactory()
        self.country = w_factories.CountryFactory(country="TestLand", code="TL")
        w_factories.grant_country_access(self.user.tola_user, self.country, role='user')
        self.program = w_factories.RFProgramFactory(
            reporting_period_start=self.start_date,
            reporting_period_end=self.end_date
        )
        self.program.country.set([self.country])

    def setup_disaggregations(self):
        self.standard_disaggregation = i_factories.DisaggregationTypeFactory(
            standard=True,
            country=None,
            labels=["Test Labél 1", "Test Label 2", "Test Label 3"]
        )
        self.country_disaggregation = i_factories.DisaggregationTypeFactory(
            standard=False,
            country=self.country,
            labels=["Test Label 1", "Test Labél 2"]
        )

    def setup_client(self):
        self.client = test.Client()
        self.client.force_login(user=self.user)

    @property
    def program_pk(self):
        return self.program.pk

    @property
    def disaggregations(self):
        return [self.standard_disaggregation, self.country_disaggregation]

    def get_indicators_for_frequencies(self, kwargs={}):
        for frequency in [f for f, _ in Indicator.TARGET_FREQUENCIES if f != Indicator.EVENT]:
            these_kwargs = {
                **{
                    'program': self.program,
                    'target_frequency': frequency,
                    'targets': 1000
                },
                **kwargs
            }
            indicator = i_factories.RFIndicatorFactory(**these_kwargs)
            indicator.disaggregation.set([self.standard_disaggregation, self.country_disaggregation])
            yield indicator

    def add_indicators_with_no_results(self):
        self.indicators = list(self.get_indicators_for_frequencies())

    def get_tp_report(self, frequency=Indicator.MONTHLY):
        params = {'report_type': 2, 'frequency': frequency}
        url = reverse('api_iptt_report_data', kwargs={'program': self.program.pk})
        response = self.client.get(url, params)
        assert response.status_code == 200, "IPTT Reponse got {}".format(response.status_code)
        assert response.json()['program_pk'] == self.program.pk, "Program pk received {}".format(response.json()['program_pk'])
        assert response.json()['report_frequency'] == frequency, "Frequency received {}".format(response.json()['report_frequency'])
        return response.json()['report_data']
            
        