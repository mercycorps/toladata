""" Tests for the IPTT Report Data serializer

    - IPTT Indicator serializer provides indicator display/filtering data for a program's IPTT page (all frequencies)
    - IPTT Report Data serializer provides targets/actuals for target periods / time periods for a specific IPTT report
"""

import unittest
import datetime
from django import test

from indicators.serializers_new import (
    IPTTJSONTVAReportIndicatorSerializer,
    IPTTJSONTPReportIndicatorSerializer
)

from indicators.queries import IPTTIndicator
from indicators.models import Indicator

from factories.indicators_models import (
    RFIndicatorFactory,
    ResultFactory,
    DisaggregationTypeFactory,
    DisaggregatedValueFactory
)

from factories.workflow_models import RFProgramFactory, CountryFactory


def get_tp_report_data(indicator, frequency):
    return [report for report in IPTTJSONTPReportIndicatorSerializer.load_report(
        indicator.program.pk, frequency
        ).data if report['pk'] == indicator.pk][0]


def get_tp_annotated_indicator(indicator, frequency):
    disaggregations = [label.pk for disagg in indicator.disaggregation.all() for label in disagg.labels]
    return IPTTIndicator.timeperiods.filter(pk=indicator.pk).with_frequency_annotations(
        frequency, indicator.program.reporting_period_start, indicator.program.reporting_period_end,
    ).with_disaggregation_frequency_annotations(
        frequency, indicator.program.reporting_period_start, indicator.program.reporting_period_end,
        disaggregations=disaggregations
    ).first()


def get_tva_report_data(indicator, frequency):
    return IPTTJSONTVAReportIndicatorSerializer.load_report(
        indicator.program.pk, frequency
        ).data[0]

def get_tva_annotated_indicator(indicator, frequency):
    disaggregations = [label.pk for disagg in indicator.disaggregation.all() for label in disagg.labels]
    return IPTTIndicator.tva.filter(pk=indicator.pk).with_frequency_annotations(
        frequency, indicator.program.reporting_period_start, indicator.program.reporting_period_end,
        disaggregations=disaggregations
    ).first()

def get_annotated_indicator(indicator):
    disaggregations = [label.pk for disagg in indicator.disaggregation.all() for label in disagg.labels]
    return IPTTIndicator.tva.filter(pk=indicator.pk).with_disaggregation_lop_annotations(disaggregations).first()


def get_result(indicator, achieved, target_period=0, days=1, date=None):
    if indicator.target_frequency == Indicator.LOP:
        periodic_target = indicator.periodictargets.first()
        date_collected = indicator.program.reporting_period_start + datetime.timedelta(days=days)
    else:
        periodic_target = indicator.periodictargets.all()[target_period]
        start_date = periodic_target.start_date \
            if periodic_target.start_date else periodic_target.indicator.program.reporting_period_start
        date_collected = start_date + datetime.timedelta(days=days)
    return ResultFactory(
        indicator=indicator,
        periodic_target=periodic_target,
        date_collected=date_collected if date is None else date,
        achieved=achieved
    )

def add_standard_disaggregation(indicator):
    standard_disaggregation = DisaggregationTypeFactory(
        standard=True,
        country=None,
        labels=["Tést Låbel 1", "Tést Låbel 2"]
    )
    indicator.disaggregation.add(standard_disaggregation)
    return standard_disaggregation


def add_country_disaggregation(indicator, country):
    country_disaggregation = DisaggregationTypeFactory(
        standard=False,
        country=country,
        labels=["Tést Låbel 1", "Tést Låbel 2"]
    )
    indicator.disaggregation.add(country_disaggregation)
    return country_disaggregation


def get_disaggregated_value(result, disaggregation, values_list):
    return [DisaggregatedValueFactory(
        result=result,
        category=label,
        value=value
    ) for (label, value) in zip(disaggregation.labels, values_list)]


class TestIPTTReportLOPValues(test.TestCase):
    def setUp(self):
        self.country = CountryFactory(country="TestLand", code="TL")
        self.program = RFProgramFactory()
        self.program.country.add(self.country)

    def test_indicator_with_no_results(self):
        indicator = RFIndicatorFactory(program=self.program)
        annotated = get_annotated_indicator(indicator)
        self.assertEqual(annotated.lop_actual, None)
        report_data = get_tp_report_data(indicator, Indicator.ANNUAL)
        self.assertEqual(report_data['lop_period']['actual'], None)

    def test_indicator_with_targets_and_no_results(self):
        indicator = RFIndicatorFactory(program=self.program, targets=1000)
        annotated = get_annotated_indicator(indicator)
        self.assertEqual(annotated.lop_actual, None)
        self.assertEqual(annotated.lop_target_calculated, 1000)
        self.assertEqual(annotated.lop_percent_met, None)
        report_data = get_tp_report_data(indicator, Indicator.ANNUAL)
        self.assertEqual(report_data['lop_period']['actual'], None)
        self.assertEqual(report_data['lop_period']['target'], '1000')
        self.assertEqual(report_data['lop_period']['met'], None)

    def test_indicator_with_targets_and_one_result(self):
        indicator = RFIndicatorFactory(program=self.program, targets=500.24, target_frequency=Indicator.LOP)
        get_result(indicator, 250.12)
        annotated = get_annotated_indicator(indicator)
        self.assertEqual(float(annotated.lop_actual), 250.12)
        self.assertEqual(annotated.lop_target_calculated, 500.24)
        self.assertEqual(annotated.lop_percent_met, .5)
        report_data = get_tp_report_data(indicator, Indicator.ANNUAL)
        self.assertEqual(report_data['lop_period']['actual'], '250.12')
        self.assertEqual(report_data['lop_period']['target'], '500.24')
        self.assertEqual(report_data['lop_period']['met'], '50')

    def test_indicator_with_one_disaggregation(self):
        indicator = RFIndicatorFactory(program=self.program)
        standard_disaggregation = add_standard_disaggregation(indicator)
        label_pks = [l.pk for l in standard_disaggregation.labels]
        annotated = get_annotated_indicator(indicator)
        self.assertEqual(annotated.disaggregation_category_pks, label_pks)
        for label_pk in label_pks:
            self.assertEqual(
                getattr(annotated, 'disaggregation_{}_lop_actual'.format(label_pk)),
                None
            )
        report_data = get_tp_report_data(indicator, Indicator.ANNUAL)
        self.assertEqual(list(report_data['lop_period']['disaggregations'].keys()), label_pks)
        for label_pk in label_pks:
            self.assertEqual(report_data['lop_period']['disaggregations'][label_pk]['actual'], None)

    def test_indicator_with_one_disaggregation_and_one_value(self):
        indicator = RFIndicatorFactory(program=self.program, targets=500, target_frequency=Indicator.LOP)
        standard_disaggregation = add_standard_disaggregation(indicator)
        label_pks = [l.pk for l in standard_disaggregation.labels]
        result = get_result(indicator, 400)
        get_disaggregated_value(result, standard_disaggregation, [280, 120])
        annotated = get_annotated_indicator(indicator)
        self.assertEqual(
            getattr(annotated, 'disaggregation_{}_lop_actual'.format(label_pks[0])),
            280
        )
        self.assertEqual(
            getattr(annotated, 'disaggregation_{}_lop_actual'.format(label_pks[1])),
            120
        )
        report_data = get_tp_report_data(indicator, Indicator.ANNUAL)
        self.assertEqual(float(report_data['lop_period']['disaggregations'][label_pks[0]]['actual']), 280)
        self.assertEqual(float(report_data['lop_period']['disaggregations'][label_pks[1]]['actual']), 120)

    def test_indicator_with_one_disaggregation_and_multiple_values(self):
        indicator = RFIndicatorFactory(program=self.program, targets=500, target_frequency=Indicator.LOP)
        standard_disaggregation = add_standard_disaggregation(indicator)
        label_pks = [l.pk for l in standard_disaggregation.labels]
        result = get_result(indicator, 200)
        get_disaggregated_value(result, standard_disaggregation, [50, 150])
        result2 = get_result(indicator, 1000, days=4)
        get_disaggregated_value(result2, standard_disaggregation, [400, 600])
        annotated = get_annotated_indicator(indicator)
        self.assertEqual(
            getattr(annotated, 'disaggregation_{}_lop_actual'.format(label_pks[0])),
            450
        )
        self.assertEqual(
            getattr(annotated, 'disaggregation_{}_lop_actual'.format(label_pks[1])),
            750
        )
        report_data = get_tp_report_data(indicator, Indicator.ANNUAL)
        self.assertEqual(float(report_data['lop_period']['disaggregations'][label_pks[0]]['actual']), 450)
        self.assertEqual(float(report_data['lop_period']['disaggregations'][label_pks[1]]['actual']), 750)
        report_data = get_tva_report_data(indicator, Indicator.LOP)
        self.assertEqual(float(report_data['lop_period']['disaggregations'][label_pks[0]]['actual']), 450)
        self.assertEqual(float(report_data['lop_period']['disaggregations'][label_pks[1]]['actual']), 750)

    def test_percentage_indicator(self):
        indicator = RFIndicatorFactory(
            program=self.program, targets=500, target_frequency=Indicator.LOP,
            unit_of_measure_type=Indicator.PERCENTAGE
        )
        standard_disaggregation = add_standard_disaggregation(indicator)
        country_disaggregation = add_country_disaggregation(indicator, self.country)
        s_label_pks = [l.pk for l in standard_disaggregation.labels]
        c_label_pks = [l.pk for l in country_disaggregation.labels]
        result = get_result(indicator, 80)
        get_disaggregated_value(result, standard_disaggregation, [50, 30])
        get_disaggregated_value(result, country_disaggregation, [70, 10])
        result2 = get_result(indicator, 92.5, days=4)
        get_disaggregated_value(result2, standard_disaggregation, [90, 2.5])
        annotated = get_annotated_indicator(indicator)
        self.assertEqual(annotated.lop_actual, 92.5)
        self.assertEqual(
            getattr(annotated, 'disaggregation_{}_lop_actual'.format(s_label_pks[0])),
            90
        )
        self.assertEqual(
            getattr(annotated, 'disaggregation_{}_lop_actual'.format(s_label_pks[1])),
            2.5
        )
        self.assertEqual(
            getattr(annotated, 'disaggregation_{}_lop_actual'.format(c_label_pks[0])),
            None
        )
        self.assertEqual(
            getattr(annotated, 'disaggregation_{}_lop_actual'.format(c_label_pks[1])),
            None
        )
        report_data = get_tp_report_data(indicator, Indicator.ANNUAL)
        self.assertEqual(report_data['lop_period']['actual'], '92.5')
        self.assertEqual(float(report_data['lop_period']['disaggregations'][s_label_pks[0]]['actual']), 90)
        self.assertEqual(float(report_data['lop_period']['disaggregations'][s_label_pks[1]]['actual']), 2.5)
        self.assertEqual(report_data['lop_period']['disaggregations'][c_label_pks[0]]['actual'], None)
        self.assertEqual(report_data['lop_period']['disaggregations'][c_label_pks[1]]['actual'], None)

    def test_cumulative_indicator(self):
        indicator = RFIndicatorFactory(
            program=self.program, targets=500, target_frequency=Indicator.LOP,
            is_cumulative=True
        )
        standard_disaggregation = add_standard_disaggregation(indicator)
        label_pks = [l.pk for l in standard_disaggregation.labels]
        result = get_result(indicator, 80)
        get_disaggregated_value(result, standard_disaggregation, [50, 30])
        result2 = get_result(indicator, 92.5, days=4)
        get_disaggregated_value(result2, standard_disaggregation, [90, 2.5])
        annotated = get_annotated_indicator(indicator)
        self.assertEqual(annotated.lop_actual, 172.5)
        self.assertEqual(
            getattr(annotated, 'disaggregation_{}_lop_actual'.format(label_pks[0])),
            140
        )
        self.assertEqual(
            getattr(annotated, 'disaggregation_{}_lop_actual'.format(label_pks[1])),
            32.5
        )
        report_data = get_tp_report_data(indicator, Indicator.ANNUAL)
        self.assertEqual(report_data['lop_period']['actual'], '172.5')
        self.assertEqual(float(report_data['lop_period']['disaggregations'][label_pks[0]]['actual']), 140)
        self.assertEqual(float(report_data['lop_period']['disaggregations'][label_pks[1]]['actual']), 32.5)

    def test_indicator_with_one_country_disaggregation_and_multiple_values(self):
        indicator = RFIndicatorFactory(program=self.program, targets=500, target_frequency=Indicator.LOP)
        country_disaggregation = add_country_disaggregation(indicator, self.country)
        label_pks = [l.pk for l in country_disaggregation.labels]
        result = get_result(indicator, 200)
        get_disaggregated_value(result, country_disaggregation, [50, 150])
        result2 = get_result(indicator, 1000, days=4)
        get_disaggregated_value(result2, country_disaggregation, [400, 600])
        annotated = get_annotated_indicator(indicator)
        self.assertEqual(
            getattr(annotated, 'disaggregation_{}_lop_actual'.format(label_pks[0])),
            450
        )
        self.assertEqual(
            getattr(annotated, 'disaggregation_{}_lop_actual'.format(label_pks[1])),
            750
        )
        report_data = get_tp_report_data(indicator, Indicator.ANNUAL)
        self.assertEqual(float(report_data['lop_period']['disaggregations'][label_pks[0]]['actual']), 450)
        self.assertEqual(float(report_data['lop_period']['disaggregations'][label_pks[1]]['actual']), 750)

    def test_indicator_with_multiple_disaggregations_and_multiple_values(self):
        indicator = RFIndicatorFactory(program=self.program, targets=500, target_frequency=Indicator.SEMI_ANNUAL)
        country_disaggregation = add_country_disaggregation(indicator, self.country)
        standard_disaggregation = add_standard_disaggregation(indicator)
        result = get_result(indicator, 300, target_period=0)
        get_disaggregated_value(result, standard_disaggregation, [1.5, 298.5])
        get_disaggregated_value(result, country_disaggregation, [75, 225])
        result2 = get_result(indicator, 250, target_period=1)
        get_disaggregated_value(result2, standard_disaggregation, [2.05, 252.95])
        get_disaggregated_value(result2, country_disaggregation, [75, 175])
        annotated = get_annotated_indicator(indicator)
        self.assertEqual(
            float(getattr(annotated, 'disaggregation_{}_lop_actual'.format(standard_disaggregation.labels[0].pk))),
            3.55
        )
        self.assertEqual(
            float(getattr(annotated, 'disaggregation_{}_lop_actual'.format(standard_disaggregation.labels[1].pk))),
            551.45
        )
        self.assertEqual(
            getattr(annotated, 'disaggregation_{}_lop_actual'.format(country_disaggregation.labels[0].pk)),
            150
        )
        self.assertEqual(
            getattr(annotated, 'disaggregation_{}_lop_actual'.format(country_disaggregation.labels[1].pk)),
            400
        )
        report_data = get_tva_report_data(indicator, Indicator.SEMI_ANNUAL)
        self.assertEqual(float(report_data['lop_period']['disaggregations'][standard_disaggregation.labels[1].pk]['actual']),
                         551.45)
        self.assertEqual(float(report_data['lop_period']['disaggregations'][country_disaggregation.labels[1].pk]['actual']),
                         400)


class TestIPTTReportTPPeriodValues(test.TestCase):
    def setUp(self):
        self.country = CountryFactory(country="TestLand", code="TL")
        self.program = RFProgramFactory(months=24)
        self.program.country.add(self.country)

    def test_one_result_in_one_period(self):
        indicator = RFIndicatorFactory(program=self.program, targets=500, target_frequency=Indicator.ANNUAL)
        result = get_result(indicator, 250, target_period=1)
        report_data = get_tp_report_data(indicator, Indicator.ANNUAL)
        self.assertEqual(report_data['periods'][0]['actual'], None)
        self.assertEqual(report_data['periods'][1]['actual'], '250')
        report_data2 = get_tp_report_data(indicator, Indicator.TRI_ANNUAL)
        self.assertEqual(report_data2['periods'][0]['actual'], None)
        self.assertEqual(report_data2['periods'][3]['actual'], '250')

    def test_two_results_in_two_periods(self):
        indicator = RFIndicatorFactory(program=self.program, targets=500, target_frequency=Indicator.ANNUAL)
        result = get_result(indicator, 150, target_period=0)
        result = get_result(indicator, 350, target_period=1)
        report_data = get_tp_report_data(indicator, Indicator.ANNUAL)
        self.assertEqual(report_data['periods'][0]['actual'], '150')
        self.assertEqual(report_data['periods'][1]['actual'], '350')
        report_data2 = get_tp_report_data(indicator, Indicator.QUARTERLY)
        self.assertEqual(report_data2['periods'][0]['actual'], '150')
        self.assertEqual(report_data2['periods'][1]['actual'], None)
        self.assertEqual(report_data2['periods'][2]['actual'], None)
        self.assertEqual(report_data2['periods'][3]['actual'], None)
        self.assertEqual(report_data2['periods'][4]['actual'], '350')

    def test_two_results_in_one_period_numeric(self):
        indicator = RFIndicatorFactory(program=self.program, targets=500, target_frequency=Indicator.ANNUAL)
        result = get_result(indicator, 150, target_period=1)
        result = get_result(indicator, 350, target_period=1, days=4)
        report_data = get_tp_report_data(indicator, Indicator.ANNUAL)
        self.assertEqual(report_data['periods'][0]['actual'], None)
        self.assertEqual(report_data['periods'][1]['actual'], '500')
        report_data2 = get_tp_report_data(indicator, Indicator.SEMI_ANNUAL)
        self.assertEqual(report_data2['periods'][0]['actual'], None)
        self.assertEqual(report_data2['periods'][1]['actual'], None)
        self.assertEqual(report_data2['periods'][2]['actual'], '500')
        self.assertEqual(report_data2['periods'][3]['actual'], None)

    def test_two_results_in_one_period_percent(self):
        indicator = RFIndicatorFactory(program=self.program, targets=500, target_frequency=Indicator.ANNUAL,
                                       unit_of_measure_type=Indicator.PERCENTAGE)
        result = get_result(indicator, 150, target_period=1)
        result = get_result(indicator, 350, target_period=1, days=4)
        report_data = get_tp_report_data(indicator, Indicator.ANNUAL)
        self.assertEqual(report_data['periods'][0]['actual'], None)
        self.assertEqual(report_data['periods'][1]['actual'], '350')
        report_data2 = get_tp_report_data(indicator, Indicator.SEMI_ANNUAL)
        self.assertEqual(report_data2['periods'][0]['actual'], None)
        self.assertEqual(report_data2['periods'][1]['actual'], None)
        self.assertEqual(report_data2['periods'][2]['actual'], '350')
        self.assertEqual(report_data2['periods'][3]['actual'], None)

    def test_one_disaggregated_result_in_one_period(self):
        indicator = RFIndicatorFactory(program=self.program, targets=500, target_frequency=Indicator.ANNUAL)
        standard_disaggregation = add_standard_disaggregation(indicator)
        result = get_result(indicator, 250, target_period=1)
        get_disaggregated_value(result, standard_disaggregation, [100, 150])
        annotated = get_tp_annotated_indicator(indicator, Indicator.ANNUAL)
        self.assertEqual(
            getattr(annotated, 'disaggregation_{}_frequency_{}_period_{}'.format(
                standard_disaggregation.labels[0].pk,
                Indicator.ANNUAL,
                0)),
            None
        )
        self.assertEqual(
            getattr(annotated, 'disaggregation_{}_frequency_{}_period_{}'.format(
                standard_disaggregation.labels[0].pk,
                Indicator.ANNUAL,
                1)),
            100
        )
        self.assertEqual(
            getattr(annotated, 'disaggregation_{}_frequency_{}_period_{}'.format(
                standard_disaggregation.labels[1].pk,
                Indicator.ANNUAL,
                0)),
            None
        )
        self.assertEqual(
            getattr(annotated, 'disaggregation_{}_frequency_{}_period_{}'.format(
                standard_disaggregation.labels[1].pk,
                Indicator.ANNUAL,
                1)),
            150
        )
        report_data = get_tp_report_data(indicator, Indicator.ANNUAL)
        self.assertListEqual(list(report_data['lop_period']['disaggregations'].keys()),
                             [l.pk for l in standard_disaggregation.labels])
        self.assertEqual(report_data['periods'][1]['disaggregations'][standard_disaggregation.labels[0].pk]['actual'], '100')
        self.assertEqual(report_data['periods'][1]['disaggregations'][standard_disaggregation.labels[1].pk]['actual'], '150')
        report_data2 = get_tp_report_data(indicator, Indicator.TRI_ANNUAL)
        self.assertEqual(report_data2['periods'][3]['disaggregations'][standard_disaggregation.labels[0].pk]['actual'], '100')
        self.assertEqual(report_data2['periods'][3]['disaggregations'][standard_disaggregation.labels[1].pk]['actual'], '150')

    def test_two_disaggregated_results_in_two_periods(self):
        indicator = RFIndicatorFactory(program=self.program, targets=500, target_frequency=Indicator.ANNUAL)
        standard_disaggregation = add_standard_disaggregation(indicator)
        result = get_result(indicator, 150, target_period=0)
        get_disaggregated_value(result, standard_disaggregation, [100.1, 49.9])
        result2 = get_result(indicator, 320, target_period=1)
        get_disaggregated_value(result2, standard_disaggregation, [200, 120])
        report_data = get_tp_report_data(indicator, Indicator.ANNUAL)
        self.assertEqual(report_data['periods'][0]['disaggregations'][standard_disaggregation.labels[0].pk]['actual'], '100.1')
        self.assertEqual(report_data['periods'][1]['disaggregations'][standard_disaggregation.labels[0].pk]['actual'], '200')
        self.assertEqual(report_data['periods'][0]['disaggregations'][standard_disaggregation.labels[1].pk]['actual'], '49.9')
        self.assertEqual(report_data['periods'][1]['disaggregations'][standard_disaggregation.labels[1].pk]['actual'], '120')
        report_data2 = get_tp_report_data(indicator, Indicator.TRI_ANNUAL)
        self.assertEqual(report_data2['periods'][0]['disaggregations'][standard_disaggregation.labels[0].pk]['actual'], '100.1')
        self.assertEqual(report_data2['periods'][3]['disaggregations'][standard_disaggregation.labels[0].pk]['actual'], '200')
        self.assertEqual(report_data2['periods'][0]['disaggregations'][standard_disaggregation.labels[1].pk]['actual'], '49.9')
        self.assertEqual(report_data2['periods'][3]['disaggregations'][standard_disaggregation.labels[1].pk]['actual'], '120')

    def test_two_disaggregated_results_in_one_period_numeric(self):
        indicator = RFIndicatorFactory(program=self.program, targets=500, target_frequency=Indicator.ANNUAL)
        standard_disaggregation = add_standard_disaggregation(indicator)
        country_disaggregation = add_country_disaggregation(indicator, self.country)
        result = get_result(indicator, 150, target_period=1)
        get_disaggregated_value(result, standard_disaggregation, [1, 149])
        get_disaggregated_value(result, country_disaggregation, [100, 50])
        result2 = get_result(indicator, 300, target_period=1, days=4)
        get_disaggregated_value(result2, standard_disaggregation, [1, 299])
        report_data = get_tp_report_data(indicator, Indicator.ANNUAL)
        self.assertEqual(report_data['periods'][1]['disaggregations'][standard_disaggregation.labels[0].pk]['actual'], '2')
        self.assertEqual(report_data['periods'][1]['disaggregations'][standard_disaggregation.labels[1].pk]['actual'], '448')
        self.assertEqual(report_data['periods'][1]['disaggregations'][country_disaggregation.labels[0].pk]['actual'], '100')
        self.assertEqual(report_data['periods'][1]['disaggregations'][country_disaggregation.labels[1].pk]['actual'], '50')


    def test_two_disaggregated_results_in_one_period_percent(self):
        indicator = RFIndicatorFactory(program=self.program, targets=500, target_frequency=Indicator.ANNUAL,
                                       unit_of_measure_type=Indicator.PERCENTAGE)
        standard_disaggregation = add_standard_disaggregation(indicator)
        country_disaggregation = add_country_disaggregation(indicator, self.country)
        result = get_result(indicator, 150, target_period=1)
        get_disaggregated_value(result, standard_disaggregation, [1, 149])
        get_disaggregated_value(result, country_disaggregation, [100, 50])
        result2 = get_result(indicator, 300, target_period=1, days=4)
        get_disaggregated_value(result2, standard_disaggregation, [1, 299])
        report_data = get_tp_report_data(indicator, Indicator.ANNUAL)
        self.assertEqual(report_data['periods'][1]['disaggregations'][standard_disaggregation.labels[0].pk]['actual'], '1')
        self.assertEqual(report_data['periods'][1]['disaggregations'][standard_disaggregation.labels[1].pk]['actual'], '299')
        self.assertEqual(report_data['periods'][1]['disaggregations'][country_disaggregation.labels[0].pk]['actual'], None)
        self.assertEqual(report_data['periods'][1]['disaggregations'][country_disaggregation.labels[1].pk]['actual'], None)

    def test_extraneous_disaggregations_excluded(self):
        other_indicator = RFIndicatorFactory(program=self.program, targets=500, target_frequency=Indicator.ANNUAL,
                                       unit_of_measure_type=Indicator.PERCENTAGE)
        standard_disaggregation = add_standard_disaggregation(other_indicator)
        result = get_result(other_indicator, 140, target_period=1)
        get_disaggregated_value(result, standard_disaggregation, [1, 139])
        indicator = RFIndicatorFactory(program=self.program, targets=500, target_frequency=Indicator.ANNUAL,
                                       unit_of_measure_type=Indicator.PERCENTAGE)
        country_disaggregation = add_country_disaggregation(indicator, self.country)
        result2 = get_result(indicator, 100, target_period=1)
        get_disaggregated_value(result2, country_disaggregation, [40, 60])
        report_data = get_tp_report_data(indicator, Indicator.ANNUAL)['lop_period']['disaggregations']
        self.assertIn(country_disaggregation.labels[0].pk, report_data)
        self.assertNotIn(standard_disaggregation.labels[0].pk, report_data)



class TestIPTTReportTVAPeriodValues(test.TestCase):
    def setUp(self):
        self.country = CountryFactory(country="TestLand", code="TL")
        self.program = RFProgramFactory(months=24)
        self.program.country.add(self.country)

    def test_one_result_in_one_period(self):
        indicator = RFIndicatorFactory(program=self.program, targets=500, target_frequency=Indicator.ANNUAL)
        result = get_result(indicator, 250, target_period=1)
        report_data = get_tva_report_data(indicator, Indicator.ANNUAL)
        self.assertEqual(report_data['periods'][0]['actual'], None)
        self.assertEqual(report_data['periods'][1]['count'], 1)
        self.assertEqual(report_data['periods'][1]['actual'], '250')


    def test_two_results_in_two_periods(self):
        indicator = RFIndicatorFactory(program=self.program, targets=500, target_frequency=Indicator.ANNUAL)
        result = get_result(indicator, 150, target_period=0)
        result = get_result(indicator, 350, target_period=1)
        report_data = get_tva_report_data(indicator, Indicator.ANNUAL)
        self.assertEqual(report_data['periods'][0]['actual'], '150')
        self.assertEqual(report_data['periods'][0]['target'], '250')
        self.assertEqual(report_data['periods'][1]['actual'], '350')
        self.assertEqual(report_data['periods'][1]['target'], '250')


    def test_two_results_in_one_period_numeric(self):
        indicator = RFIndicatorFactory(program=self.program, targets=500, target_frequency=Indicator.MONTHLY)
        result = get_result(indicator, 150, target_period=1)
        result = get_result(indicator, 350, target_period=1, days=4)
        report_data = get_tva_report_data(indicator, Indicator.MONTHLY)
        self.assertEqual(report_data['periods'][0]['actual'], None)
        self.assertEqual(report_data['periods'][1]['actual'], '500')

    def test_two_results_in_one_period_percent(self):
        indicator = RFIndicatorFactory(program=self.program, targets=500, target_frequency=Indicator.SEMI_ANNUAL,
                                       unit_of_measure_type=Indicator.PERCENTAGE)
        result = get_result(indicator, 150, target_period=1)
        result = get_result(indicator, 350, target_period=1, days=4)
        report_data = get_tva_report_data(indicator, Indicator.SEMI_ANNUAL)
        self.assertEqual(report_data['periods'][0]['actual'], None)
        self.assertEqual(report_data['periods'][1]['actual'], '350')

    def test_one_disaggregated_result_in_one_period(self):
        indicator = RFIndicatorFactory(program=self.program, targets=500, target_frequency=Indicator.ANNUAL)
        standard_disaggregation = add_standard_disaggregation(indicator)
        result = get_result(indicator, 250, target_period=1)
        get_disaggregated_value(result, standard_disaggregation, [100, 150])
        annotated = get_tp_annotated_indicator(indicator, Indicator.ANNUAL)
        self.assertEqual(
            getattr(annotated, 'disaggregation_{}_frequency_{}_period_{}'.format(
                standard_disaggregation.labels[0].pk,
                Indicator.ANNUAL,
                0)),
            None
        )
        self.assertEqual(
            getattr(annotated, 'disaggregation_{}_frequency_{}_period_{}'.format(
                standard_disaggregation.labels[0].pk,
                Indicator.ANNUAL,
                1)),
            100
        )
        self.assertEqual(
            getattr(annotated, 'disaggregation_{}_frequency_{}_period_{}'.format(
                standard_disaggregation.labels[1].pk,
                Indicator.ANNUAL,
                0)),
            None
        )
        self.assertEqual(
            getattr(annotated, 'disaggregation_{}_frequency_{}_period_{}'.format(
                standard_disaggregation.labels[1].pk,
                Indicator.ANNUAL,
                1)),
            150
        )
        report_data = get_tva_report_data(indicator, Indicator.ANNUAL)
        self.assertListEqual(list(report_data['lop_period']['disaggregations'].keys()),
                             [l.pk for l in standard_disaggregation.labels])
        self.assertEqual(report_data['periods'][1]['disaggregations'][standard_disaggregation.labels[0].pk]['actual'], '100')
        self.assertEqual(report_data['periods'][1]['disaggregations'][standard_disaggregation.labels[1].pk]['actual'], '150')

    def test_two_disaggregated_results_in_two_periods(self):
        indicator = RFIndicatorFactory(program=self.program, targets=500, target_frequency=Indicator.SEMI_ANNUAL)
        standard_disaggregation = add_standard_disaggregation(indicator)
        result = get_result(indicator, 150, target_period=0)
        get_disaggregated_value(result, standard_disaggregation, [100.1, 49.9])
        result2 = get_result(indicator, 320, target_period=1)
        get_disaggregated_value(result2, standard_disaggregation, [200, 120])
        report_data = get_tva_report_data(indicator, Indicator.SEMI_ANNUAL)
        self.assertEqual(report_data['periods'][0]['disaggregations'][standard_disaggregation.labels[0].pk]['actual'], '100.1')
        self.assertEqual(report_data['periods'][1]['disaggregations'][standard_disaggregation.labels[0].pk]['actual'], '200')
        self.assertEqual(report_data['periods'][0]['disaggregations'][standard_disaggregation.labels[1].pk]['actual'], '49.9')
        self.assertEqual(report_data['periods'][1]['disaggregations'][standard_disaggregation.labels[1].pk]['actual'], '120')

    def test_two_disaggregated_results_in_one_period_numeric(self):
        indicator = RFIndicatorFactory(program=self.program, targets=500, target_frequency=Indicator.MONTHLY)
        standard_disaggregation = add_standard_disaggregation(indicator)
        country_disaggregation = add_country_disaggregation(indicator, self.country)
        result = get_result(indicator, 150, target_period=4)
        get_disaggregated_value(result, standard_disaggregation, [1, 149])
        get_disaggregated_value(result, country_disaggregation, [100, 50])
        result2 = get_result(indicator, 300, target_period=4, days=4)
        get_disaggregated_value(result2, standard_disaggregation, [1, 299])
        report_data = get_tva_report_data(indicator, Indicator.MONTHLY)
        self.assertEqual(report_data['periods'][4]['disaggregations'][standard_disaggregation.labels[0].pk]['actual'], '2')
        self.assertEqual(report_data['periods'][4]['disaggregations'][standard_disaggregation.labels[1].pk]['actual'], '448')
        self.assertEqual(report_data['periods'][4]['disaggregations'][country_disaggregation.labels[0].pk]['actual'], '100')
        self.assertEqual(report_data['periods'][4]['disaggregations'][country_disaggregation.labels[1].pk]['actual'], '50')

    def test_two_disaggregated_results_in_one_period_midend(self):
        indicator = RFIndicatorFactory(program=self.program, targets=500, target_frequency=Indicator.MID_END)
        standard_disaggregation = add_standard_disaggregation(indicator)
        country_disaggregation = add_country_disaggregation(indicator, self.country)
        result = get_result(indicator, 150, target_period=1,
                            date=self.program.reporting_period_start + datetime.timedelta(days=4)
                            )
        get_disaggregated_value(result, standard_disaggregation, [1, 149])
        get_disaggregated_value(result, country_disaggregation, [100, 50])
        result2 = get_result(indicator, 300, target_period=1,
                             date=self.program.reporting_period_end - datetime.timedelta(days=2))
        get_disaggregated_value(result2, standard_disaggregation, [1, 299])
        report_data = get_tva_report_data(indicator, Indicator.MID_END)
        self.assertEqual(report_data['periods'][1]['disaggregations'][standard_disaggregation.labels[0].pk]['actual'], '2')
        self.assertEqual(report_data['periods'][1]['disaggregations'][standard_disaggregation.labels[1].pk]['actual'], '448')
        self.assertEqual(report_data['periods'][1]['disaggregations'][country_disaggregation.labels[0].pk]['actual'], '100')
        self.assertEqual(report_data['periods'][1]['disaggregations'][country_disaggregation.labels[1].pk]['actual'], '50')
