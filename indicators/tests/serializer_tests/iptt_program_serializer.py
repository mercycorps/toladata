# -*- coding: utf-8 -*-
"""Tests for the Program Serializer providing Level-based ordering by level and chain

    corresponding to js/models/program/RFLevelOrdering"""

import datetime
from workflow.serializers_new import (
    IPTTProgramLevelSerializer,
    IPTTProgramSerializer
)
from workflow.models import Program
from indicators.models import Indicator
from factories.workflow_models import (
    RFProgramFactory,
    SectorFactory,
    SiteProfileFactory,
    CountryFactory,
)
from factories.indicators_models import (
    RFIndicatorFactory,
    LevelFactory,
    IndicatorTypeFactory,
    DisaggregationTypeFactory,
)
from django import test
from django.utils import translation


def get_serialized_data(program_pk, levels=False):
    if levels:
        return IPTTProgramLevelSerializer(
            Program.rf_aware_objects.filter(pk=program_pk), many=True
        ).data[0]
    return IPTTProgramSerializer(
        Program.rf_aware_objects.filter(pk=program_pk), many=True
    ).data[0]

def get_program_data(**kwargs):
    return get_serialized_data(RFProgramFactory(**kwargs).pk)

SPECIAL_CHARS = u'Spéçîål Chars'
LONG_NAME = 'Long '*26
MC_TIER_NAMES = ['Goal', 'Outcome', 'Output', 'Activity']


class TestIPTTProgramSerializerLevels(test.TestCase):

    def test_program_no_levels(self):
        program = RFProgramFactory()
        data = get_serialized_data(program.pk, levels=True)
        self.assertEqual(data['levels'], [])

    def test_program_one_level(self):
        program = RFProgramFactory(tiers=['Tier1'])
        tier = program.level_tiers.first()
        level = LevelFactory(program=program, parent=None, name="Test name")
        data = get_serialized_data(program.pk, levels=True)
        for key, value in {
                'pk': level.pk,
                'name': "Test name",
                'ontology': '',
                'tier_name': 'Tier1',
                'tier_pk': tier.pk,
                'chain_pk': 'all'
            }.items():
            self.assertEqual(data['levels'][0][key], value)

    def test_program_multiple_levels(self):
        program = RFProgramFactory(tiers=['Tier1', SPECIAL_CHARS, LONG_NAME])
        levels = {}
        tiers = sorted(program.level_tiers.all(), key=lambda tier: tier.tier_depth)
        goal = LevelFactory(program=program, parent=None, name=SPECIAL_CHARS, customsort=1)
        levels[goal.pk] = {
            'name': SPECIAL_CHARS,
            'tier_pk': tiers[0].pk,
            'tier_name': 'Tier1',
            'chain_pk': 'all',
            'ontology': ''
        }
        impact1 = LevelFactory(program=program, parent=goal, name=LONG_NAME, customsort=1)
        levels[impact1.pk] = {
            'name': LONG_NAME,
            'tier_pk': tiers[1].pk,
            'tier_name': SPECIAL_CHARS,
            'chain_pk': impact1.pk,
            'ontology': '1'
        }
        output1 = LevelFactory(program=program, parent=impact1, name=SPECIAL_CHARS, customsort=1)
        levels[output1.pk] = {
            'name': SPECIAL_CHARS,
            'tier_pk': tiers[2].pk,
            'tier_name': LONG_NAME,
            'chain_pk': impact1.pk,
            'ontology': '1.1'
        }
        output2 = LevelFactory(program=program, parent=impact1, customsort=2)
        levels[output2.pk] = {
            'ontology': '1.2'
        }
        impact2 = LevelFactory(program=program, parent=goal, customsort=2)
        levels[impact2.pk] = {
            'tier_pk': tiers[1].pk,
            'chain_pk': impact2.pk,
            'ontology': '2'
        }
        levels[LevelFactory(program=program, parent=goal, customsort=3).pk] = {
            'ontology': '3'
        }
        levels[LevelFactory(program=program, parent=impact2, customsort=1).pk] = {
            'tier_pk': tiers[2].pk,
            'chain_pk': impact2.pk,
            'ontology': '2.1'
        }
        data = get_serialized_data(program.pk, levels=True)
        counted = []
        for level_data in data['levels']:
            self.assertIn(level_data['pk'], levels)
            for key, value in levels[level_data['pk']].items():
                self.assertEqual(level_data[key], value)
            counted.append(level_data['pk'])
        self.assertEqual(set(counted), set(levels.keys()))


class TestIPTTProgramSerializerTiers(test.TestCase):

    def test_no_tiers(self):
        data = get_program_data()
        self.assertEqual(data['tiers'], [])

    def test_one_tier(self):
        data = get_program_data(tiers=['Tier1'])
        self.assertEqual(len(data['tiers']), 1)
        self.assertEqual(data['tiers'][0]['name'], 'Tier1')
        self.assertEqual(data['tiers'][0]['tier_depth'], 1)

    def test_multiple_tiers(self):
        data = get_program_data(tiers=True)
        self.assertEqual(len(data['tiers']), 4)
        self.assertEqual(set(td['name'] for td in data['tiers']),
                         set(MC_TIER_NAMES))

    def test_translated_tiers(self):
        program = RFProgramFactory(tiers=True)
        translation.activate('fr')
        data = get_serialized_data(program.pk)
        names = set(td['name'] for td in data['tiers'])
        self.assertIn(u'Résultat', names)
        translation.activate('en')


class TestIPTTProgramSerializerFilterData(test.TestCase):

    def test_no_filter_data(self):
        data = get_program_data()
        self.assertEqual(data['sectors'], [])
        self.assertEqual(data['indicator_types'], [])
        self.assertEqual(data['sites'], [])
        self.assertEqual(data['disaggregations'], [])

    def test_one_sector(self):
        program = RFProgramFactory()
        sector = SectorFactory(program=program)
        RFIndicatorFactory(program=program, sector=sector)
        data = get_serialized_data(program.pk)
        self.assertEqual(len(data['sectors']), 1)
        self.assertEqual(data['sectors'][0]['pk'], sector.pk)
        self.assertEqual(data['sectors'][0]['name'], sector.sector)

    def test_one_duplicated_sector(self):
        program = RFProgramFactory()
        sector = SectorFactory(program=program)
        RFIndicatorFactory(program=program, sector=sector)
        RFIndicatorFactory(program=program, sector=sector)
        data = get_serialized_data(program.pk)
        self.assertEqual(len(data['sectors']), 1)

    def test_multiple_sectors(self):
        program = RFProgramFactory()
        sector = SectorFactory(program=program)
        sector2 = SectorFactory(program=program)
        RFIndicatorFactory(program=program, sector=sector)
        RFIndicatorFactory(program=program, sector=sector2)
        data = get_serialized_data(program.pk)
        self.assertEqual(len(data['sectors']), 2)
        self.assertEqual(set(sd['pk'] for sd in data['sectors']), set([sector.pk, sector2.pk]))

    def test_one_indicator_type(self):
        program = RFProgramFactory()
        i_type = IndicatorTypeFactory()
        indicator = RFIndicatorFactory(program=program)
        indicator.indicator_type.add(i_type)
        data = get_serialized_data(program.pk)
        self.assertEqual(len(data['indicator_types']), 1)
        self.assertEqual(data['indicator_types'][0]['pk'], i_type.pk)
        self.assertEqual(data['indicator_types'][0]['name'], i_type.indicator_type)

    def test_one_duplicated_indicator_type(self):
        program = RFProgramFactory()
        i_type = IndicatorTypeFactory()
        indicator = RFIndicatorFactory(program=program)
        indicator.indicator_type.add(i_type)
        indicator2 = RFIndicatorFactory(program=program)
        indicator2.indicator_type.add(i_type)
        data = get_serialized_data(program.pk)
        self.assertEqual(len(data['indicator_types']), 1)

    def test_multiple_indicator_types(self):
        program = RFProgramFactory()
        i_type = IndicatorTypeFactory()
        i_type1 = IndicatorTypeFactory()
        i_type2 = IndicatorTypeFactory()
        i_1 = RFIndicatorFactory(program=program)
        i_1.indicator_type.add(i_type)
        i_1.indicator_type.add(i_type1)
        i_2 = RFIndicatorFactory(program=program)
        i_2.indicator_type.add(i_type2)
        data = get_serialized_data(program.pk)
        self.assertEqual(len(data['indicator_types']), 3)
        self.assertEqual(
            set(itd['pk'] for itd in data['indicator_types']),
            set([i_type.pk, i_type1.pk, i_type2.pk])
        )

    def test_one_site(self):
        program = RFProgramFactory()
        site = SiteProfileFactory()
        indicator = RFIndicatorFactory(
            program=program, target_frequency=Indicator.LOP, targets=500, results=100, results__count=1
        )
        indicator.result_set.first().site.add(site)
        data = get_serialized_data(program.pk)
        self.assertEqual(len(data['sites']), 1)
        self.assertEqual(data['sites'][0]['pk'], site.pk)
        self.assertEqual(data['sites'][0]['name'], site.name)

    def test_one_site_duplicated(self):
        program = RFProgramFactory()
        site = SiteProfileFactory()
        indicator = RFIndicatorFactory(
            program=program, target_frequency=Indicator.LOP, targets=500, results=200, results__count=2
        )
        for result in indicator.result_set.all():
            result.site.add(site)
        indicator = RFIndicatorFactory(
            program=program, target_frequency=Indicator.LOP, targets=500, results=200, results__count=2
        )
        for result in indicator.result_set.all():
            result.site.add(site)
        data = get_serialized_data(program.pk)
        self.assertEqual(len(data['sites']), 1)

    def test_multiple_sites(self):
        program = RFProgramFactory()
        site = SiteProfileFactory(name='One')
        site1 = SiteProfileFactory(name='Two')
        site2 = SiteProfileFactory(name='Three')
        indicator = RFIndicatorFactory(
            program=program, target_frequency=Indicator.LOP, targets=500, results=400, results__count=2
        )
        for result, this_site in zip(indicator.result_set.all(), [site, site1]):
            result.site.add(this_site)
        indicator = RFIndicatorFactory(
            program=program, target_frequency=Indicator.LOP, targets=500, results=400, results__count=2
        )
        for result in indicator.result_set.all():
            result.site.add(site2)
        data = get_serialized_data(program.pk)
        self.assertEqual(len(data['sites']), 3)
        self.assertEqual(
            set(std['pk'] for std in data['sites']),
            set([site.pk, site1.pk, site2.pk])
        )

    def test_one_country_disaggregation_type(self):
        country = CountryFactory(country="TestTown", code="TT")
        program = RFProgramFactory()
        program.country.add(country)
        country_dt = DisaggregationTypeFactory(
            disaggregation_type="Test Disaggregation", country=country, standard=False,
            labels=["Test Label 1", "Test Label 2", "Test Label 3"]
        )
        indicator = RFIndicatorFactory(program=program)
        indicator.disaggregation.set([country_dt])
        data = get_serialized_data(program.pk)
        self.assertEqual(len(data['disaggregations']), 1)
        disagg_data = data['disaggregations'][0]
        self.assertEqual(disagg_data['pk'], country_dt.pk)
        self.assertEqual(disagg_data['name'], "Test Disaggregation")

    def test_one_standard_disaggregation_type(self):
        standard_dt = DisaggregationTypeFactory(
            disaggregation_type="Test Standard Disagg", country=None, standard=True,
            labels=["Test Standard One Label"]
        )
        indicator = RFIndicatorFactory(program=RFProgramFactory())
        indicator.disaggregation.set([standard_dt])
        data = get_serialized_data(indicator.program.pk)
        self.assertEqual(data['disaggregations'][0]['pk'], standard_dt.pk)
        self.assertEqual(data['disaggregations'][0]['name'], 'Test Standard Disagg')

    def test_special_characters_disaggregation_type(self):
        special_chars = "Spéçîål Charäcterß"
        special_chars_dt = DisaggregationTypeFactory(
            disaggregation_type=special_chars, country=None, standard=True,
            labels=["{} 1".format(special_chars), "{} 2".format(special_chars)]
        )
        indicator = RFIndicatorFactory(program=RFProgramFactory())
        indicator.disaggregation.set([special_chars_dt])
        data = get_serialized_data(indicator.program.pk)
        self.assertEqual(data['disaggregations'][0]['name'], special_chars)

    def test_one_disaggregation_type_duplicated(self):
        standard_dt = DisaggregationTypeFactory(
            disaggregation_type="Test Standard Disagg", country=None, standard=True,
            labels=["Test Standard One Label"]
        )
        indicator1 = RFIndicatorFactory(program=RFProgramFactory())
        indicator1.disaggregation.set([standard_dt])
        indicator2 = RFIndicatorFactory(program=RFProgramFactory())
        indicator2.disaggregation.set([standard_dt])
        data = get_serialized_data(indicator1.program.pk)
        self.assertEqual(len(data['disaggregations']), 1)
        self.assertEqual(data['disaggregations'][0]['pk'], standard_dt.pk)

    def test_multiple_disaggregation_types(self):
        country = CountryFactory(country="TestTown", code="TT")
        program = RFProgramFactory()
        program.country.add(country)
        country_dt1 = DisaggregationTypeFactory(
            disaggregation_type="Test Disaggregation", country=country, standard=False,
            labels=["Test Label 1", "Test Label 2", "Test Label 3"]
        )
        country_dt2 = DisaggregationTypeFactory(
            disaggregation_type="Test Disaggregation 2", country=country, standard=False,
            selected_by_default=True,
            labels=["Test Really really really really really really really really long Label 1", "Test Label 2"]
        )
        standard_dt1 = DisaggregationTypeFactory(
            disaggregation_type="Test Standard Disagg", country=None, standard=True,
            labels=["Test Standard One Label"]
        )
        standard_dt2 = DisaggregationTypeFactory(
            disaggregation_type="Test Standard Disagg 2", country=None, standard=True,
            labels=["Test Standard Four Label 1", "Test Standard Four Label 2",
                    "Test Standard Four Label 3", "Test Standard Four Label 4", ]
        )
        indicator = RFIndicatorFactory(program=program)
        indicator.disaggregation.set([country_dt1, country_dt2])
        indicator2 = RFIndicatorFactory(program=program)
        indicator2.disaggregation.set([country_dt1, standard_dt1])
        indicator3 = RFIndicatorFactory(program=program)
        indicator3.disaggregation.set([standard_dt2])
        data = get_serialized_data(program.pk)
        self.assertEqual(len(data['disaggregations']), 4, data['disaggregations'])

    def test_country_disaggregation_unassigned_to_program_does_not_show_up(self):
        country = CountryFactory(country="TestTown", code="TT")
        program = RFProgramFactory()
        program.country.add(country)
        country_dt = DisaggregationTypeFactory(
            disaggregation_type="Test Disaggregation", country=country, standard=False,
            labels=["Test Label 1", "Test Label 2", "Test Label 3"]
        )
        indicator = RFIndicatorFactory(program=program)
        indicator.disaggregation.set([])
        data = get_serialized_data(program.pk)
        self.assertEqual(len(data['disaggregations']), 0)

    def test_standard_disaggregation_unassigned_to_program_does_not_show_up(self):
        standard_dt = DisaggregationTypeFactory(
            disaggregation_type="Test Standard Disagg", country=None, standard=True,
            labels=["Test Standard One Label"]
        )
        indicator = RFIndicatorFactory(program=RFProgramFactory())
        indicator.disaggregation.set([])
        data = get_serialized_data(indicator.program.pk)
        self.assertEqual(len(data['disaggregations']), 0)


class TestIPTTProgramSerializerPeriodData(test.TestCase):

    def test_frequencies_none(self):
        data = get_program_data()
        self.assertEqual(data['frequencies'], [])

    def test_frequencies_lop(self):
        program = RFProgramFactory()
        RFIndicatorFactory(
            program=program, target_frequency=Indicator.LOP
        )
        data = get_serialized_data(program.pk)
        self.assertEqual(data['frequencies'], [Indicator.LOP])

    def test_frequencies_annual(self):
        program = RFProgramFactory()
        RFIndicatorFactory(
            program=program, target_frequency=Indicator.ANNUAL
        )
        data = get_serialized_data(program.pk)
        self.assertEqual(data['frequencies'], [Indicator.ANNUAL])

    def test_frequencies_many(self):
        program = RFProgramFactory()
        frequencies = [Indicator.ANNUAL, Indicator.SEMI_ANNUAL, Indicator.TRI_ANNUAL, Indicator.MONTHLY]
        for frequency in frequencies:
            RFIndicatorFactory(program=program, target_frequency=frequency)
        data = get_serialized_data(program.pk)
        self.assertEqual(data['frequencies'], frequencies)

    def test_period_date_ranges_one_year(self):
        rep_start = datetime.date(2016, 1, 1)
        rep_end = datetime.date(2016, 12, 31)
        data = get_program_data(reporting_period_start=rep_start, reporting_period_end=rep_end)
        for frequency, count in [(1, 1), (2, 2), (3, 1), (4, 2), (5, 3), (6, 4), (7, 12)]:
            self.assertEqual(len(data['period_date_ranges'][frequency]), count)
        lop_period = data['period_date_ranges'][Indicator.LOP][0]
        self.assertEqual(lop_period['start'], data['reporting_period_start_iso'])
        self.assertEqual(lop_period['start'], '2016-01-01')
        self.assertEqual(lop_period['end'], data['reporting_period_end_iso'])
        self.assertEqual(lop_period['end'], '2016-12-31')
        self.assertEqual(lop_period['name'], 'Life of Program')
        self.assertEqual(lop_period['label'], None)
        for name, period in zip(['Midline', 'Endline'], data['period_date_ranges'][Indicator.MID_END]):
            self.assertEqual(period['start'], '2016-01-01')
            self.assertEqual(period['end'], '2016-12-31')
            self.assertEqual(period['name'], name)
            self.assertEqual(period['label'], None)
        annual_period = data['period_date_ranges'][Indicator.ANNUAL][0]
        self.assertEqual(annual_period['start'], '2016-01-01')
        self.assertEqual(annual_period['end'], '2016-12-31')
        self.assertEqual(annual_period['name'], 'Year 1')
        self.assertEqual(annual_period['label'], 'Jan 1, 2016 - Dec 31, 2016')
        monthly_period = data['period_date_ranges'][Indicator.MONTHLY][4]
        self.assertEqual(monthly_period['start'], '2016-05-01')
        self.assertEqual(monthly_period['end'], '2016-05-31')
        self.assertEqual(monthly_period['name'], 'May')
        self.assertEqual(monthly_period['label'], None)

    def test_period_date_ranges_french(self):
        rep_start = datetime.date(2016, 1, 1)
        rep_end = datetime.date(2016, 12, 31)
        translation.activate('fr')
        data = get_program_data(reporting_period_start=rep_start, reporting_period_end=rep_end)
        translation.activate('en')
        lop_period = data['period_date_ranges'][Indicator.LOP][0]
        self.assertEqual(lop_period['start'], '2016-01-01')
        self.assertEqual(lop_period['end'], '2016-12-31')
        self.assertEqual(lop_period['name'], 'Vie du programme')
        self.assertEqual(lop_period['label'], None)
        for name, period in zip(['Milieu de ligne', 'Fin de ligne'], data['period_date_ranges'][Indicator.MID_END]):
            self.assertEqual(period['name'], name)
            self.assertEqual(period['label'], None)
        annual_period = data['period_date_ranges'][Indicator.ANNUAL][0]
        self.assertEqual(annual_period['name'], u'Année 1')
        self.assertEqual(annual_period['label'], u'1 jan. 2016 - 31 déc. 2016')
        monthly_period = data['period_date_ranges'][Indicator.MONTHLY][7]
        self.assertEqual(monthly_period['name'], u'août')
        self.assertEqual(monthly_period['label'], None)