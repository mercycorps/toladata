# -*- coding: utf-8 -*-
"""Tests for the Program Page Indicator Serializer

    corresponding to js/pages/program_page/models/ProgramPageIndicator
"""

from factories.workflow_models import RFProgramFactory, SectorFactory, SiteProfileFactory, CountryFactory
from factories.indicators_models import RFIndicatorFactory, IndicatorTypeFactory, DisaggregationTypeFactory
from indicators.serializers_new import (
    TierBaseSerializer,
    LevelBaseSerializer,
    IPTTIndicatorSerializer,
)
from indicators.models import Indicator

from django import test

QUERY_COUNT = 1

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
        cls.empty_program = RFProgramFactory()
        cls.empty_program_context = {'program_pk': cls.empty_program.pk, 'tiers': [], 'levels': []}
        cls.rf_program = RFProgramFactory(tiers=['Tier 1', 'Tier 2'], levels=2)
        cls.rf_program_context = get_program_context(cls.rf_program)

    def get_serialized_data(self, context):
        program_pk = context['program_pk']
        with self.assertNumQueries(QUERY_COUNT):
            return IPTTIndicatorSerializer.load_for_program(program_pk, context=context).data[0]

    def get_indicator_data(self, **kwargs):
        rf = kwargs.pop('rf', False)
        if rf:
            program = self.rf_program
            context = self.rf_program_context
        else:
            program = self.empty_program
            context = self.empty_program_context
        indicator = RFIndicatorFactory(program=program, **kwargs)
        return self.get_serialized_data(context)

    def test_has_no_sector_pk(self):
        data = self.get_indicator_data()
        self.assertEqual(data['sector_pk'], None)

    def test_has_a_sector_pk(self):
        sector = SectorFactory()
        data = self.get_indicator_data(sector=sector)
        self.assertEqual(data['sector_pk'], sector.pk)
    
    # def test_has_no_type_pks(self):
    #     data = get_indicator_data(program=RFProgramFactory())
    #     self.assertEqual(data['indicator_type_pks'], [])
    # 
    # def test_has_one_type_pk(self):
    #     it = IndicatorTypeFactory()
    #     i = RFIndicatorFactory(program=RFProgramFactory())
    #     i.indicator_type.add(it)
    #     data = get_serialized_data(i.pk)
    #     self.assertEqual(data['indicator_type_pks'], [it.pk])
    # 
    # def test_has_two_type_pks(self):
    #     it1 = IndicatorTypeFactory()
    #     it2 = IndicatorTypeFactory()
    #     i = RFIndicatorFactory(program=RFProgramFactory())
    #     i.indicator_type.add(it1)
    #     i.indicator_type.add(it2)
    #     data = get_serialized_data(i.pk)
    #     self.assertEqual(data['indicator_type_pks'], sorted([it1.pk, it2.pk]))
    # 
    # def test_has_no_site_pks(self):
    #     data = get_indicator_data(program=RFProgramFactory())
    #     self.assertEqual(data['site_pks'], [])
    # 
    # def test_has_one_site_pk(self):
    #     i = RFIndicatorFactory(
    #         program=RFProgramFactory(), target_frequency=Indicator.LOP,
    #         targets=1000, results=True)
    #     site = SiteProfileFactory()
    #     i.result_set.first().site.add(site)
    #     data = get_serialized_data(i.pk)
    #     self.assertEqual(data['site_pks'], [site.pk])
    # 
    # def test_has_two_site_pks_one_result(self):
    #     i = RFIndicatorFactory(
    #         program=RFProgramFactory(), target_frequency=Indicator.LOP,
    #         targets=1000, results=True)
    #     site1 = SiteProfileFactory()
    #     site2 = SiteProfileFactory()
    #     i.result_set.first().site.add(site1)
    #     i.result_set.first().site.add(site2)
    #     data = get_serialized_data(i.pk)
    #     self.assertEqual(data['site_pks'], sorted([site1.pk, site2.pk]))
    # 
    # def test_has_two_site_pks_two_results(self):
    #     i = RFIndicatorFactory(
    #         program=RFProgramFactory(), target_frequency=Indicator.LOP,
    #         targets=1000, results=True, results__count=2)
    #     site1 = SiteProfileFactory()
    #     site2 = SiteProfileFactory()
    #     i.result_set.all()[0].site.add(site1)
    #     i.result_set.all()[1].site.add(site2)
    #     data = get_serialized_data(i.pk)
    #     self.assertEqual(data['site_pks'], sorted([site1.pk, site2.pk]))
    # 
    # def get_disaggregations(self):
    #     standard_dt = DisaggregationTypeFactory(
    #         disaggregation_type="Test Standard Disagg", standard=True,
    #         labels=["Standard Label 1", "Standard Label 2"])
    #     country = CountryFactory(country="TestLand", code="TL")
    #     program = RFProgramFactory()
    #     program.country.add(country)
    #     country_dt = DisaggregationTypeFactory(
    #         disaggregation_type="Test Disagg", country=country, standard=False,
    #         labels=["Country Label 1", "Cøüntry Label 2", "Country Låbél 3"])
    #     return program, standard_dt, country_dt
    # 
    # def test_has_no_disaggregations_assigned(self):
    #     program, *_ = self.get_disaggregations()
    #     i = RFIndicatorFactory(program=program)
    #     data = get_serialized_data(i.pk)
    #     self.assertEqual(data['disaggregation_pks'], [])
    # 
    # def test_has_one_disaggregations_assigned(self):
    #     program, standard_dt, country_dt = self.get_disaggregations()
    #     i = RFIndicatorFactory(program=program)
    #     i.disaggregation.set([standard_dt])
    #     data = get_serialized_data(i.pk)
    #     self.assertEqual(data['disaggregation_pks'], [standard_dt.pk])
    #     i.disaggregation.set([country_dt])
    #     data = get_serialized_data(i.pk)
    #     self.assertEqual(data['disaggregation_pks'], [country_dt.pk])
    # 
    # def test_has_multiple_disaggregations_assigned(self):
    #     program, standard_dt, country_dt = self.get_disaggregations()
    #     i = RFIndicatorFactory(program=program)
    #     i.disaggregation.set([country_dt, standard_dt])
    #     data = get_serialized_data(i.pk)
    #     self.assertEqual(data['disaggregation_pks'], sorted([standard_dt.pk, country_dt.pk]))