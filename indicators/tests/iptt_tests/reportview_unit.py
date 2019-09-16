from django import test
from django.urls import reverse_lazy

from factories.indicators_models import IndicatorFactory
from factories.workflow_models import (
    ProgramFactory,
    TolaUserFactory,
    UserFactory
)
from indicators.models import Indicator
from indicators.views import IPTTReport

class TestIPTTReportviewURL(test.TestCase):
    def setUp(self):
        self.user = UserFactory(first_name="PeterPeter", last_name="PumpkinEater", username="PPPE")
        self.user.set_password('orangethumb')
        self.user.save()
        self.tola_user = TolaUserFactory(user=self.user)
        self.country = self.tola_user.country
        self.program = ProgramFactory(
            funding_status='Funded', reporting_period_start='2016-03-01', reporting_period_end='2020-05-01')
        self.program.country.add(self.country)
        self.program.save()
        self.indicator = IndicatorFactory(
            program=self.program, unit_of_measure_type=Indicator.NUMBER, is_cumulative=False,
            direction_of_change=Indicator.DIRECTION_OF_CHANGE_NONE, target_frequency=Indicator.ANNUAL)
        self.request_factory = test.RequestFactory()
        self.client = test.Client()
        self.client.login(username=self.user.username, password='orangethumb')

    def test_get(self):
        """Does get return 200 and the right template?"""

        url_kwargs = {
            'program': self.program.id,
            'reporttype': 'targetperiods',
        }
        filterdata = {'frequency': 3, 'timeframe': 1}
        path = reverse_lazy('iptt_report', kwargs=url_kwargs)

        response = self.client.get(path, data=filterdata, follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, template_name=IPTTReport.template_name)
