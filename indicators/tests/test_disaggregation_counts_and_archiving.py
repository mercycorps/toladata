# -*- coding: utf-8 -*-
"""Tests that disaggregations report the number of indicators assigned to them and can be archived"""

from factories import (
    indicators_models as i_factories,
    workflow_models as w_factories
)
from indicators.models import DisaggregationType, DisaggregationLabel
from django import test


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
        for _ in range(5):
            indicator = i_factories.RFIndicatorFactory(program=self.program)
            indicator.disaggregation.add(disagg)
            indicator.save()
        disagg_from_db = DisaggregationType.objects.get(pk=disagg.pk)
        self.assertTrue(disagg_from_db.has_indicators)


class TestArchivedDisaggregationQueryset(test.TestCase):
    def setUp(self):
        self.country = w_factories.CountryFactory(country="TolaLand IN", code="IN")
        self.program = w_factories.RFProgramFactory()
        self.program.country.set([self.country])
        self.country_b = w_factories.CountryFactory(country="Some other country", code="OUT")
        self.program_b = w_factories.RFProgramFactory()
        self.program_b.country.set([self.country_b])

    def test_all_country_disaggregations_in_program(self):
        created_disaggs = [i_factories.DisaggregationTypeFactory(country=self.country) for _ in range(5)]
        disaggs = DisaggregationType.program_disaggregations(self.program.pk)
        self.assertEqual(sorted([d.pk for d in created_disaggs]), sorted([d.pk for d in disaggs]))

    def test_out_of_country_disaggregations_not_in_program(self):
        created_disagg = i_factories.DisaggregationTypeFactory(country=self.country)
        i_factories.DisaggregationTypeFactory(country=self.country_b)
        disaggs = DisaggregationType.program_disaggregations(self.program.pk)
        self.assertEqual(len(disaggs), 1)
        self.assertEqual(disaggs[0].pk, created_disagg.pk)

    def test_standard_disaggregations_in_program(self):
        standard_disagg = i_factories.DisaggregationTypeFactory(country=None, standard=True)
        created_disagg = i_factories.DisaggregationTypeFactory(country=self.country)
        disaggs = DisaggregationType.program_disaggregations(self.program.pk)
        self.assertEqual(len(disaggs), 2)
        self.assertEqual(sorted([d.pk for d in disaggs]), sorted([standard_disagg.pk, created_disagg.pk]))

    def test_archived_in_country_disaggregations_not_in_program(self):
        not_archived = i_factories.DisaggregationTypeFactory(country=self.country)
        i_factories.DisaggregationTypeFactory(country=self.country, is_archived=True)
        disaggs = DisaggregationType.program_disaggregations(self.program.pk)
        self.assertEqual([d.pk for d in disaggs], [not_archived.pk])

    def test_archived_standard_disaggregations_not_in_program(self):
        not_archived = i_factories.DisaggregationTypeFactory(country=None, standard=True)
        i_factories.DisaggregationTypeFactory(country=None, standard=True, is_archived=True)
        disaggs = DisaggregationType.program_disaggregations(self.program.pk)
        self.assertEqual([d.pk for d in disaggs], [not_archived.pk])

    def test_archived_disagg_in_use_in_program(self):
        archived_in_use = i_factories.DisaggregationTypeFactory(country=self.country, is_archived=True)
        indicator = i_factories.RFIndicatorFactory(program=self.program)
        indicator.disaggregation.add(archived_in_use)
        indicator.save()
        disaggs = DisaggregationType.program_disaggregations(self.program.pk)
        self.assertEqual([d.pk for d in disaggs], [archived_in_use.pk])

    def test_archived_standard_disagg_in_use_in_program(self):
        archived_in_use = i_factories.DisaggregationTypeFactory(country=None, standard=True, is_archived=True)
        indicator = i_factories.RFIndicatorFactory(program=self.program)
        indicator.disaggregation.add(archived_in_use)
        indicator.save()
        disaggs = DisaggregationType.program_disaggregations(self.program.pk)
        self.assertEqual([d.pk for d in disaggs], [archived_in_use.pk])

    def test_full_scenario(self):
        standard = i_factories.DisaggregationTypeFactory(country=None, standard=True)
        # standard, archived:
        i_factories.DisaggregationTypeFactory(country=None, standard=True, is_archived=True)
        standard_archived_in_use_a = i_factories.DisaggregationTypeFactory(
            country=None, standard=True, is_archived=True
        )
        indicator_a = i_factories.RFIndicatorFactory(program=self.program)
        indicator_a.disaggregation.add(standard_archived_in_use_a)
        indicator_a.save()
        standard_archived_in_use_b = i_factories.DisaggregationTypeFactory(
            country=None, standard=True, is_archived=True
        )
        indicator_b = i_factories.RFIndicatorFactory(program=self.program_b)
        indicator_b.disaggregation.add(standard_archived_in_use_b)
        indicator_b.save()
        in_country = i_factories.DisaggregationTypeFactory(country=self.country)
        # in-country, archived:
        i_factories.DisaggregationTypeFactory(country=self.country, is_archived=True)
        in_country_archived_in_use = i_factories.DisaggregationTypeFactory(country=self.country, is_archived=True)
        indicator_c = i_factories.RFIndicatorFactory(program=self.program)
        indicator_c.disaggregation.add(in_country_archived_in_use)
        indicator_c.save()
        # out-of-country:
        i_factories.DisaggregationTypeFactory(country=self.country_b)
        # out-of-country, archived:
        i_factories.DisaggregationTypeFactory(country=self.country_b, is_archived=True)
        out_of_country_archived_in_use = i_factories.DisaggregationTypeFactory(
            country=self.country_b, is_archived=True
        )
        indicator_d = i_factories.RFIndicatorFactory(program=self.program_b)
        indicator_d.disaggregation.add(out_of_country_archived_in_use)
        indicator_d.save()
        disaggs = DisaggregationType.program_disaggregations(self.program.pk)
        self.assertEqual(
            sorted([d.pk for d in disaggs]),
            sorted([
                standard.pk,
                standard_archived_in_use_a.pk,
                in_country.pk,
                in_country_archived_in_use.pk
            ])
        )