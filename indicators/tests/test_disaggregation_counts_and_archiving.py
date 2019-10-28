# -*- coding: utf-8 -*-
"""Tests that disaggregations report the number of indicators assigned to them and can be archived"""

from django import test
from factories import (
    indicators_models as i_factories,
    workflow_models as w_factories
)
from indicators.models import DisaggregationType

class TestDisaggregationIndicatorCounts(test.TestCase):
    def setUp(self):
        self.country = w_factories.CountryFactory()
        self.program = w_factories.RFProgramFactory()
        self.program.country.set([self.country])

    def test_disaggregation_no_indicators(self):
        disagg = i_factories.DisaggregationTypeFactory(country=self.country)
        disagg_from_db = DisaggregationType.objects.get(pk=disagg.pk)
        self.assertFalse(disagg_from_db.has_indicators)

    def test_disaggregation_one_indicator(self):
        disagg = i_factories.DisaggregationTypeFactory(country=self.country)
        indicator = i_factories.RFIndicatorFactory(program=self.program)
        indicator.disaggregation.add(disagg)
        indicator.save()
        disagg_from_db = DisaggregationType.objects.get(pk=disagg.pk)
        self.assertTrue(disagg_from_db.has_indicators)

    def test_disaggregation_five_indicators(self):
        disagg = i_factories.DisaggregationTypeFactory(country=self.country)
        for x in range(5):
            indicator = i_factories.RFIndicatorFactory(program=self.program)
            indicator.disaggregation.add(disagg)
            indicator.save()
        disagg_from_db = DisaggregationType.objects.get(pk=disagg.pk)
        self.assertTrue(disagg_from_db.has_indicators)