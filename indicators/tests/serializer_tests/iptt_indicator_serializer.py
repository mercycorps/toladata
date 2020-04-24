import itertools
from factories.workflow_models import (
    RFProgramFactory, SectorFactory, SiteProfileFactory, CountryFactory
)
from factories.indicators_models import (
    RFIndicatorFactory, IndicatorTypeFactory, DisaggregationTypeFactory, DisaggregatedValueFactory
)
from indicators.serializers_new import (
    TierBaseSerializer,
    LevelBaseSerializer,
    IPTTJSONIndicatorLabelsSerializer,
    IPTTJSONTPReportIndicatorSerializer,
)
from indicators.models import Indicator

from django import test

QUERY_COUNT = 5

def get_program_context(program):
    pk = program.pk
    context = {'program_pk': pk}
    context['tiers'] = TierBaseSerializer.load_for_program(pk, context=context).data
    context['levels'] = LevelBaseSerializer.load_for_program(pk, context=context).data
    return context


class TestIPTTJSONIndicatorLabelAndFilterDataSerializer(test.TestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        country = CountryFactory(country="TestLand", code="TL")
        cls.empty_program = RFProgramFactory()
        cls.empty_program.country.add(country)
        cls.rf_program = RFProgramFactory(tiers=['Tier 1', 'Tier 2'], levels=2)
        cls.rf_program.country.add(country)
        cls.site1 = SiteProfileFactory()
        cls.site2 = SiteProfileFactory()
        cls.standard_dt = DisaggregationTypeFactory(
            disaggregation_type="Test Standard Disagg", standard=True,
            labels=["Standard Label 1", "Standard Label 2"])
        cls.country_dt = DisaggregationTypeFactory(
            disaggregation_type="Test Disagg", country=country, standard=False,
            labels=["Country Label 1", "Cøüntry Label 2", "Country Låbél 3"])

    def get_serialized_data(self, program):
        context = get_program_context(program)
        program_pk = context['program_pk']
        with self.assertNumQueries(QUERY_COUNT):
            return IPTTJSONIndicatorLabelsSerializer.load_for_program(program_pk, context=context).data[0]

    def get_indicator_data(self, **kwargs):
        rf = kwargs.pop('rf', False)
        if rf:
            program = self.rf_program
        else:
            program = self.empty_program
        indicator_types = kwargs.pop('indicator_type', [])
        sites = kwargs.pop('sites', [])
        disaggregations = kwargs.pop('disaggregation', [])
        indicator_kwargs = {
            'targets': True,
            'results': True,
            **kwargs
        }
        indicator = RFIndicatorFactory(program=program, **indicator_kwargs)
        indicator.indicator_type.set(indicator_types)
        for site, result in zip(sites, itertools.cycle(indicator.result_set.all())):
            result.site.add(site)
        indicator.disaggregation.set(disaggregations)
        return self.get_serialized_data(program)

    def test_has_no_sector_pk(self):
        data = self.get_indicator_data()
        self.assertEqual(data['sector_pk'], None)

    def test_has_a_sector_pk(self):
        sector = SectorFactory()
        data = self.get_indicator_data(sector=sector)
        self.assertEqual(data['sector_pk'], sector.pk)

    def test_has_no_type_pks(self):
        data = self.get_indicator_data()
        self.assertEqual(data['indicator_type_pks'], [])

    def test_has_one_type_pk(self):
        it = IndicatorTypeFactory()
        data = self.get_indicator_data(indicator_type=[it])
        self.assertEqual(data['indicator_type_pks'], [it.pk])

    def test_has_two_type_pks(self):
        it1 = IndicatorTypeFactory()
        it2 = IndicatorTypeFactory()
        data = self.get_indicator_data(indicator_type=[it1, it2])
        self.assertEqual(data['indicator_type_pks'], sorted([it1.pk, it2.pk]))

    def test_has_no_site_pks(self):
        data = self.get_indicator_data()
        self.assertEqual(data['site_pks'], [])

    def test_has_one_site_pk(self):
        data = self.get_indicator_data(sites=[self.site1])
        self.assertEqual(data['site_pks'], [self.site1.pk])

    def test_has_two_site_pks_one_result(self):
        data = self.get_indicator_data(results__count=1, sites=[self.site1, self.site2])
        self.assertEqual(data['site_pks'], sorted([self.site1.pk, self.site2.pk]))

    def test_has_two_site_pks_two_results(self):
        data = self.get_indicator_data(results__count=2, sites=[self.site1, self.site2])
        self.assertEqual(data['site_pks'], sorted([self.site1.pk, self.site2.pk]))

    def test_has_two_site_pks_both_on_two_results(self):
        data = self.get_indicator_data(results__count=2, sites=[self.site1, self.site2, self.site2, self.site1])
        self.assertEqual(data['site_pks'], sorted([self.site1.pk, self.site2.pk]))

    def test_has_no_disaggregations_assigned(self):
        data = self.get_indicator_data()
        self.assertEqual(data['disaggregation_pks'], [])

    def test_has_one_standard_disaggregations_assigned(self):
        data = self.get_indicator_data(disaggregation=[self.standard_dt])
        self.assertEqual(data['disaggregation_pks'], [self.standard_dt.pk])

    def test_has_one_country_disaggregations_assigned(self):
        data = self.get_indicator_data(disaggregation=[self.country_dt])
        self.assertEqual(data['disaggregation_pks'], [self.country_dt.pk])

    def test_has_multiple_disaggregations_assigned(self):
        data = self.get_indicator_data(disaggregation=[self.standard_dt, self.country_dt])
        self.assertEqual(data['disaggregation_pks'], sorted([self.standard_dt.pk, self.country_dt.pk]))


class TestIPTTJSONIndicatorReportDataSerializer(test.TestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.country = CountryFactory(country="TestLand", code="TL")
        cls.program = RFProgramFactory(months=24)
        cls.program.country.add(cls.country)
        cls.standard_disaggregation = DisaggregationTypeFactory(
            standard=True, country=None, labels=['label 1', 'label 2'])
        cls.country_disaggregation = DisaggregationTypeFactory(
            standard=False, country=cls.country, labels=['clabel 1', 'clabel 2'])

    def get_tp_report_data(self, frequency=Indicator.ANNUAL, program=None):
        program = program or self.program
        data = IPTTJSONTPReportIndicatorSerializer.load_report(program.pk, frequency).data
        return data

    def test_indicator_with_no_results(self):
        indicator = RFIndicatorFactory(program=self.program)
        report_data = self.get_tp_report_data()
        self.assertEqual(len(report_data), 1)
        self.assertEqual(report_data[0]['lop_period']['actual'], None)
        self.assertEqual(report_data[0]['lop_period']['target'], None)
        self.assertEqual(report_data[0]['lop_period']['met'], None)
        self.assertEqual(report_data[0]['lop_period']['disaggregations'], {})

    def test_indicator_with_targets_and_no_results(self):
        indicator = RFIndicatorFactory(program=self.program, targets=1000)
        report_data = self.get_tp_report_data()
        self.assertEqual(len(report_data), 1)
        self.assertEqual(report_data[0]['lop_period']['actual'], None)
        self.assertEqual(report_data[0]['lop_period']['target'], '1000')
        self.assertEqual(report_data[0]['lop_period']['met'], None)
        self.assertEqual(report_data[0]['lop_period']['disaggregations'], {})

    def test_indicator_with_targets_and_one_result(self):
        indicator = RFIndicatorFactory(
            program=self.program, target_frequency=Indicator.LOP, targets=500.24,
            results=[250.12], results__count=1
        )
        report_data = self.get_tp_report_data()
        self.assertEqual(len(report_data), 1)
        self.assertEqual(report_data[0]['lop_period']['actual'], '250.12')
        self.assertEqual(report_data[0]['lop_period']['target'], '500.24')
        self.assertEqual(report_data[0]['lop_period']['met'], '50')
        self.assertEqual(report_data[0]['lop_period']['disaggregations'], {})

    def test_indicator_with_one_disaggregation(self):
        indicator = RFIndicatorFactory(program=self.program)
        indicator.disaggregation.set([self.standard_disaggregation])
        report_data = self.get_tp_report_data()
        self.assertEqual(len(report_data), 1)
        for label in self.standard_disaggregation.labels:
            self.assertEqual(report_data[0]['lop_period']['disaggregations'][label.pk]['actual'], None)

    def test_indicator_with_one_disaggregated_value(self):
        indicator = RFIndicatorFactory(
            program=self.program, target_frequency=Indicator.LOP, targets=450, results=500, results__count=1
            )
        indicator.disaggregation.set([self.standard_disaggregation])
        result = indicator.result_set.first()
        DisaggregatedValueFactory(result=result, category=self.standard_disaggregation.labels[1], value=250)
        report_data = self.get_tp_report_data()
        self.assertEqual(len(report_data), 1)
        lop_period_disaggs = report_data[0]['lop_period']['disaggregations']
        label = self.standard_disaggregation.labels[0]
        self.assertEqual(lop_period_disaggs[label.pk]['actual'], None)
        label = self.standard_disaggregation.labels[1]
        self.assertEqual(lop_period_disaggs[label.pk]['actual'], '250')

    def test_indicator_with_one_disaggregation_and_multiple_values(self):
        indicator = RFIndicatorFactory(
            program=self.program,
            targets=500,
            target_frequency=Indicator.LOP,
            results=600, results__count=2)
        indicator.disaggregation.set([self.standard_disaggregation])
        results = list(indicator.result_set.all())
        for label, value in zip(self.standard_disaggregation.labels, [50.25, 100.4]):
            for result in results:
                DisaggregatedValueFactory(result=result, category=label, value=value)
        report_data = self.get_tp_report_data()
        self.assertEqual(len(report_data), 1)
        lop_period_disaggs = report_data[0]['lop_period']['disaggregations']
        label = self.standard_disaggregation.labels[0]
        self.assertEqual(lop_period_disaggs[label.pk]['actual'], '100.5')
        label = self.standard_disaggregation.labels[1]
        self.assertEqual(lop_period_disaggs[label.pk]['actual'], '200.8')

    def test_indicator_with_one_disaggregation_and_multiple_values_cumulative(self):
        indicator = RFIndicatorFactory(
            program=self.program,
            targets=500,
            target_frequency=Indicator.LOP,
            is_cumulative=True,
            results=600, results__count=2)
        indicator.disaggregation.set([self.standard_disaggregation])
        results = list(indicator.result_set.all())
        for label, value in zip(self.standard_disaggregation.labels, [50.25, 100.4]):
            for result in results:
                DisaggregatedValueFactory(result=result, category=label, value=value)
        report_data = self.get_tp_report_data()
        self.assertEqual(len(report_data), 1)
        lop_period_disaggs = report_data[0]['lop_period']['disaggregations']
        label = self.standard_disaggregation.labels[0]
        self.assertEqual(lop_period_disaggs[label.pk]['actual'], '100.5')
        label = self.standard_disaggregation.labels[1]
        self.assertEqual(lop_period_disaggs[label.pk]['actual'], '200.8')

    def test_percentage_indicator(self):
        indicator = RFIndicatorFactory(
            program=self.program, targets=500, target_frequency=Indicator.LOP,
            unit_of_measure_type=Indicator.PERCENTAGE,
            results=400, results__count=2
        )
        indicator.disaggregation.set([self.standard_disaggregation, self.country_disaggregation])
        results = list(indicator.result_set.all())
        for label, value in zip(self.standard_disaggregation.labels, [0.1, 400]):
            DisaggregatedValueFactory(result=results[0], category=label, value=900)
            DisaggregatedValueFactory(result=results[1], category=label, value=value)
        for label, value in zip(self.country_disaggregation.labels, [0, 33]):
            DisaggregatedValueFactory(result=results[0], category=label, value=900)
            DisaggregatedValueFactory(result=results[1], category=label, value=value)
        report_data = self.get_tp_report_data()
        self.assertEqual(len(report_data), 1)
        lop_period_disaggs = report_data[0]['lop_period']['disaggregations']
        label = self.standard_disaggregation.labels[0]
        self.assertEqual(lop_period_disaggs[label.pk]['actual'], '0.1')
        label = self.standard_disaggregation.labels[1]
        self.assertEqual(lop_period_disaggs[label.pk]['actual'], '400')
        label = self.country_disaggregation.labels[0]
        self.assertEqual(lop_period_disaggs[label.pk]['actual'], '0')
        label = self.country_disaggregation.labels[1]
        self.assertEqual(lop_period_disaggs[label.pk]['actual'], '33')

    def test_one_result_in_one_period(self):
        indicator = RFIndicatorFactory(
            program=self.program, targets=500, target_frequency=Indicator.ANNUAL,
            results=[None, 250]
            )
        result = get_result(indicator, 250, target_period=1)
        report_data = self.get_tp_report_data(frequency=Indicator.ANNUAL)
        self.assertEqual(report_data[0]['periods'][0]['actual'], None)
        self.assertEqual(report_data[0]['periods'][1]['index'], 1)
        self.assertEqual(report_data[0]['periods'][1]['actual'], '250')
        # report_data2 = get_tp_report_data(indicator, Indicator.TRI_ANNUAL)['report_data']
        # self.assertEqual(report_data2[0]['actual'], None)
        # self.assertEqual(report_data2[3]['actual'], '250')