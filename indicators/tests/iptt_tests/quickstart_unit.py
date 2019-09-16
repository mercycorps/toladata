"""Unit tests for the IPTT Quickstart page"""
from factories.indicators_models import IndicatorFactory
from factories.workflow_models import (
    ProgramFactory,
    TolaUserFactory,
    UserFactory
)
from indicators.models import Indicator

from django import test
from django.urls import reverse_lazy


class TestIPTTQuickstartJSContext(test.TestCase):
    """Unit tests for IPTT Quickstart View"""

    def setUp(self):
        self.user = UserFactory(first_name="Indicator", last_name="CreateTest", username="IC")
        self.user.set_password('password')
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
        IndicatorFactory(
            program=self.program, target_frequency=Indicator.LOP
        )
        self.request_factory = test.RequestFactory()
        self.client = test.Client()
        self.client.login(username="IC", password='password')

    def test_page_load_returns_200(self):
        """Do we return 200?"""

        response = self.client.get(reverse_lazy('iptt_quickstart'))
        self.assertEqual(response.status_code, 200)

    def test_page_load_does_not_redirect(self):
        """This page should not redirect"""

        response = self.client.get(reverse_lazy('iptt_quickstart'), follow=True)
        self.assertEqual(len(response.redirect_chain), 0)

    def test_page_loads_correct_template(self):
        """Do we load the right template?"""

        response = self.client.get(reverse_lazy('iptt_quickstart'))
        self.assertTemplateUsed(response, 'indicators/iptt_quickstart.html')
        self.assertContains(response, 'Indicator Performance Tracking Table')

    def test_context_data(self):
        response = self.client.get(reverse_lazy('iptt_quickstart'))
        context = response.context
        self.assertIn('js_context', context, 'React Page requires js_context data')
        js_context = response.context['js_context']
        self.assertIn('labels', js_context, 'React page requires labels')
        self.assertEqual(js_context['labels']['programSelect'], 'Program', 'programSelect label is required')
        self.assertIn('programs', js_context, 'Program data required to fill out forms')
        programs = js_context['programs']
        self.assertEqual(len(programs), 1,
                         'One program created means 1 program in js context, got {0}'.format(programs))
        program = programs[0]
        self.assertIn('frequencies', program, 'Frequencies key required to list correct Target Frequencies')
        frequencies = program['frequencies']
        self.assertEqual(len(frequencies), 2,
                         'Two frequency for the two indicators assigned, got {0}'.format(frequencies))
        self.assertIn(Indicator.ANNUAL, frequencies, "Annual indicator means annual frequency")
        self.assertIn(Indicator.LOP, frequencies, "LOP indicator means LOP frequency")
