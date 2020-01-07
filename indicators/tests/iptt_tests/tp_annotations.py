from django import test

from factories import (
    indicators_models as i_factories,
    workflow_models as w_factories
)

from indicators.queries import IPTTIndicator
from indicators.models import Indicator


class TestLopActuals(test.TestCase):
    def setUp(self):
        country = w_factories.CountryFactory(country="Testland", code="TL")
        self.program = w_factories.RFProgramFactory()
        disaggregation = i_factories.DisaggregationTypeFactory(
            country=country,
            standard=False
        )
        self.categories = [
            i_factories.DisaggregationLabelFactory(
                disaggregation_type=disaggregation,
                label="Test Label {}".format(c),
                customsort=c+1
            ) for c in range(5)
        ]

    def get_tp_indicator(self, indicator, frequency):
        return IPTTIndicator.timeperiods.filter(pk=indicator.pk).with_frequency_annotations(
            frequency, self.program.reporting_period_start, self.program.reporting_period_end
        ).first()

    def test_lop_only_lop_actuals(self):
        indicator = i_factories.RFIndicatorFactory(
            program=self.program,
            target_frequency=Indicator.LOP,
            targets=1000,
            results=1000
            )
        tp_indicator = self.get_tp_indicator(indicator, Indicator.LOP)
        self.assertEqual(tp_indicator.lop_actual, 1000)
        