import itertools
from factories.workflow_models import (
    RFProgramFactory, SectorFactory, SiteProfileFactory, CountryFactory
)
from factories.indicators_models import (
    RFIndicatorFactory, IndicatorTypeFactory, DisaggregationTypeFactory
)
from indicators.serializers_new import (
    TierBaseSerializer,
    LevelBaseSerializer,
    IPTTJSONIndicatorLabelsSerializer,
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


class TestIPTTIndicatorSerializer(test.TestCase):
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