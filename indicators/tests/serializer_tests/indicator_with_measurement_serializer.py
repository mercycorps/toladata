# -*- coding: utf-8 -*-
"""Tests for the IndicatorWithMeasurement serializer - corresponds to js/models/indicator/withMeasurement"""

from factories.indicators_models import RFIndicatorFactory
from factories.workflow_models import RFProgramFactory
from indicators.models import Indicator
from indicators.serializers_new import IndicatorWithMeasurementSerializer
from django import test


class TestIndicatorWithMeasurementSerializer(test.TestCase):
    def get_indicator_data(self, **kwargs):
        return IndicatorWithMeasurementSerializer(
            Indicator.rf_aware_objects.filter(pk=RFIndicatorFactory(**kwargs).pk), many=True
        ).data[0]

    def test_unit_of_measure(self):
        for uom in ["Test uom", None, "Long "*26, u"Spécîal Chars"]:
            data = self.get_indicator_data(program=RFProgramFactory(), unit_of_measure=uom)
            self.assertEqual(data['unit_of_measure'], uom)

    def test_is_percent(self):
        data = self.get_indicator_data(program=RFProgramFactory(), unit_of_measure_type=Indicator.NUMBER)
        self.assertEqual(data['is_percent'], False)
        data2 = self.get_indicator_data(program=RFProgramFactory(), unit_of_measure_type=Indicator.PERCENTAGE)
        self.assertEqual(data2['is_percent'], True)

    def test_is_cumulative(self):
        data = self.get_indicator_data(program=RFProgramFactory(), is_cumulative=False)
        self.assertEqual(data['is_cumulative'], False)
        data2 = self.get_indicator_data(program=RFProgramFactory(), is_cumulative=True)
        self.assertEqual(data2['is_cumulative'], True)
        data3 = self.get_indicator_data(program=RFProgramFactory(), is_cumulative=None)
        self.assertEqual(data3['is_cumulative'], None)

    def test_direction_of_change(self):
        data = self.get_indicator_data(
            program=RFProgramFactory(),
            direction_of_change=Indicator.DIRECTION_OF_CHANGE_NONE
        )
        self.assertEqual(data['direction_of_change'], None)
        data2 = self.get_indicator_data(
            program=RFProgramFactory(),
            direction_of_change=None
        )
        self.assertEqual(data2['direction_of_change'], None)
        data3 = self.get_indicator_data(
            program=RFProgramFactory(),
            direction_of_change=Indicator.DIRECTION_OF_CHANGE_POSITIVE
        )
        self.assertEqual(data3['direction_of_change'], "+")
        data4 = self.get_indicator_data(
            program=RFProgramFactory(),
            direction_of_change=Indicator.DIRECTION_OF_CHANGE_NEGATIVE
        )
        self.assertEqual(data4['direction_of_change'], "-")

    def test_baseline(self):
        for baseline, na, result in [
                (None, True, None), ("100", True, None), ("500", False, "500"), ("50%", False, "50%")
            ]:
            data = self.get_indicator_data(baseline=baseline, baseline_na=na)
            self.assertEqual(data['baseline'], result)