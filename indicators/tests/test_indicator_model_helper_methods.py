import datetime

from django.test import TestCase

from factories.indicators_models import (
    IndicatorFactory,
    PeriodicTargetFactory,
    RFIndicatorFactory,
    IndicatorTypeFactory
)

from indicators.models import Indicator
from tola.test.base_classes import TestBase


def _create_3_periodic_targets(indicator):
    PeriodicTargetFactory(
        indicator=indicator,
        target=10,
        start_date=datetime.date(2016, 3, 1),
        end_date=datetime.date(2016, 3, 31),
    )

    PeriodicTargetFactory(
        indicator=indicator,
        target=20,
        start_date=datetime.date(2016, 4, 1),
        end_date=datetime.date(2016, 4, 30),
    )

    PeriodicTargetFactory(
        indicator=indicator,
        target=30,
        start_date=datetime.date(2016, 5, 1),
        end_date=datetime.date(2016, 5, 31),
    )


class TestIndicatorGetCurrentPeriodicTarget(TestBase, TestCase):
    """
    Test getting the current PeriodicTarget of an Indicator based on a contained date
    """

    def setUp(self):
        super(TestIndicatorGetCurrentPeriodicTarget, self).setUp()

        self.indicator = IndicatorFactory(
            program=self.program, unit_of_measure_type=Indicator.NUMBER, is_cumulative=False,
            direction_of_change=Indicator.DIRECTION_OF_CHANGE_NONE, target_frequency=Indicator.MONTHLY)

    def test_current_periodic_target_accessor_monthly(self):
        _create_3_periodic_targets(self.indicator)

        # test in range
        self.assertEquals(self.indicator.current_periodic_target(datetime.date(2016, 4, 15)).target, 20)

        # test out of range
        self.assertIsNone(self.indicator.current_periodic_target(datetime.date(2017, 4, 15)))

        # test no date given
        self.assertIsNone(self.indicator.current_periodic_target())

    def test_current_periodic_target_accessor_none(self):
        self.assertIsNone(self.indicator.current_periodic_target(datetime.date(2016, 4, 15)))


class TestIndicatorKPIHelperMethod(TestCase):
    """
    Test that if an indicator has an indicator type with a specific name, indicator.key_performance_indicator = True
    """

    def test_indicator_without_kpi_returns_false(self):
        # verify kpi is false
        indicator = RFIndicatorFactory()
        self.assertFalse(indicator.key_performance_indicator)
        # even with some unrelated indicator type it should still be falkse:
        it = IndicatorTypeFactory(indicator_type="Test Indicator Type")
        indicator.indicator_type.add(it)
        indicator.save()
        indicator.refresh_from_db()
        self.assertFalse(indicator.key_performance_indicator)

    def test_indicator_with_kpi_returns_true(self):
        # assign the correectly named KPI type and verify kpi is true
        indicator = RFIndicatorFactory()
        kpi_it = IndicatorTypeFactory(indicator_type="Key Performance Indicator (KPI)")
        indicator.indicator_type.add(kpi_it)
        indicator.save()
        indicator.refresh_from_db()
        self.assertTrue(indicator.key_performance_indicator)
        # verify even if there are other indicator types to confuse us
        it = IndicatorTypeFactory(indicator_type="Test Indicator Type")
        indicator.indicator_type.add(it)
        indicator.save()
        indicator.refresh_from_db()
        self.assertTrue(indicator.key_performance_indicator)
