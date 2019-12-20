# -*- coding: utf-8 -*-
"""Tests that disaggregations report the number of indicators assigned to them and can be archived"""

from factories import (
    indicators_models as i_factories,
    workflow_models as w_factories
)
from indicators.models import DisaggregationType, DisaggregationLabel, DisaggregatedValue
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
        _, disaggs = DisaggregationType.program_disaggregations(self.program.pk)
        self.assertEqual(len(disaggs), 1)
        self.assertEqual(disaggs[0][0], "TolaLand IN")
        self.assertEqual(sorted([d.pk for d in created_disaggs]), sorted([d.pk for d in disaggs[0][1]]))

    def test_out_of_country_disaggregations_not_in_program(self):
        created_disagg = i_factories.DisaggregationTypeFactory(country=self.country)
        i_factories.DisaggregationTypeFactory(country=self.country_b)
        _, disaggs = DisaggregationType.program_disaggregations(self.program.pk)
        self.assertEqual(len(disaggs[0][1]), 1)
        self.assertEqual(disaggs[0][1][0].pk, created_disagg.pk)

    def test_standard_disaggregations_in_program(self):
        standard_disagg = i_factories.DisaggregationTypeFactory(country=None, standard=True)
        created_disagg = i_factories.DisaggregationTypeFactory(country=self.country)
        global_disaggs, country_disaggs = DisaggregationType.program_disaggregations(self.program.pk)
        self.assertEqual(len(global_disaggs), 1)
        self.assertEqual(global_disaggs[0].pk, standard_disagg.pk)
        self.assertEqual(len(country_disaggs), 1)
        self.assertEqual(country_disaggs[0][0], "TolaLand IN")
        self.assertEqual(country_disaggs[0][1][0].pk, created_disagg.pk)

    def test_archived_in_country_disaggregations_not_in_program(self):
        not_archived = i_factories.DisaggregationTypeFactory(country=self.country)
        i_factories.DisaggregationTypeFactory(country=self.country, is_archived=True)
        _, disaggs = DisaggregationType.program_disaggregations(self.program.pk)
        self.assertEqual([d.pk for d in disaggs[0][1]], [not_archived.pk])

    def test_archived_standard_disaggregations_not_in_program(self):
        not_archived = i_factories.DisaggregationTypeFactory(country=None, standard=True)
        i_factories.DisaggregationTypeFactory(country=None, standard=True, is_archived=True)
        disaggs, _ = DisaggregationType.program_disaggregations(self.program.pk)
        self.assertEqual([d.pk for d in disaggs], [not_archived.pk])

    def test_archived_disagg_in_use_in_program(self):
        archived_in_use = i_factories.DisaggregationTypeFactory(country=self.country, is_archived=True)
        indicator = i_factories.RFIndicatorFactory(program=self.program)
        indicator.disaggregation.add(archived_in_use)
        indicator.save()
        _, disaggs = DisaggregationType.program_disaggregations(self.program.pk)
        self.assertEqual([d.pk for d in disaggs[0][1]], [archived_in_use.pk])

    def test_archived_standard_disagg_in_use_in_program(self):
        archived_in_use = i_factories.DisaggregationTypeFactory(country=None, standard=True, is_archived=True)
        indicator = i_factories.RFIndicatorFactory(program=self.program)
        indicator.disaggregation.add(archived_in_use)
        indicator.save()
        disaggs, _ = DisaggregationType.program_disaggregations(self.program.pk)
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
        global_disaggs, country_disaggs = DisaggregationType.program_disaggregations(self.program.pk)
        self.assertEqual(
            sorted([d.pk for d in global_disaggs]),
            sorted([
                standard.pk,
                standard_archived_in_use_a.pk
                ])
        )
        self.assertEqual(len(country_disaggs), 1)
        self.assertEqual(
            sorted([d.pk for d in country_disaggs[0][1]]),
            sorted([
                in_country.pk,
                in_country_archived_in_use.pk
            ])
        )

class TestDisaggregationLabelCounts(test.TestCase):
    def setUp(self):
        self.country = w_factories.CountryFactory(country="Testland", code="TL")
        self.program = w_factories.RFProgramFactory()
        self.program.country.set([self.country])
        self.standard_disagg = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Standard 1",
            standard=True,
            country=None,
        )
        self.standard_disagg_archived = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Standard 2",
            standard=True,
            country=None,
            is_archived=True
        )
        self.country_disagg = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Country 1",
            standard=False,
            country=self.country
        )
        self.country_disagg_archived = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Country 2",
            standard=False,
            country=self.country
        )

    def get_labels(self, disagg, count=2):
        def make_label(disagg, c):
            label = DisaggregationLabel(
                disaggregation_type=disagg,
                label="label {} for disagg {}".format(count+1, disagg.disaggregation_type),
                customsort=c+1
            )
            label.save()
            return label
        labels = [make_label(disagg, x) for x in range(count)]
        return disagg, labels

    def test_two_labels_none_in_use(self):
        disagg, labels = self.get_labels(self.standard_disagg)
        annotated_disagg = DisaggregationType.form_objects.get(pk=disagg.pk)
        self.assertEqual(
            [l.pk for l in annotated_disagg.categories],
            [labels[0].pk, labels[1].pk]
            )
        self.assertFalse(annotated_disagg.in_use)
        self.assertTrue(all(not l.in_use for l in annotated_disagg.categories))

    def test_two_labels_one_in_use(self):
        disagg, labels = self.get_labels(self.standard_disagg)
        indicator = i_factories.RFIndicatorFactory(program=self.program)
        indicator.disaggregation.add(disagg)
        result = i_factories.ResultFactory(
            indicator=indicator,
            periodic_target=indicator.periodictargets.first(),
            achieved=100
        )
        d_value = DisaggregatedValue(
            category=labels[1],
            value=100,
            result=result
        )
        d_value.save()
        annotated_disagg = DisaggregationType.form_objects.get(pk=disagg.pk)
        self.assertTrue(annotated_disagg.in_use)
        self.assertFalse(
            annotated_disagg.categories[0].in_use
        )
        self.assertTrue(
            annotated_disagg.categories[1].in_use
        )

    def test_labels_in_use_for_indicator(self):
        disagg, labels = self.get_labels(self.standard_disagg)
        indicator_a = i_factories.RFIndicatorFactory(program=self.program)
        indicator_a.disaggregation.add(disagg)
        indicator_b = i_factories.RFIndicatorFactory(program=self.program)
        indicator_b.disaggregation.add(disagg)
        result = i_factories.ResultFactory(
            indicator=indicator_a,
            periodic_target=indicator_a.periodictargets.first(),
            achieved=100
        )
        d_value = DisaggregatedValue(
            category=labels[1],
            value=100,
            result=result
        )
        d_value.save()
        annotated_disagg_a = DisaggregationType.form_objects.for_indicator(indicator_a.pk).get(pk=disagg.pk)
        self.assertTrue(annotated_disagg_a.in_use)
        self.assertFalse(
            annotated_disagg_a.categories[0].in_use,
        )
        self.assertTrue(
            annotated_disagg_a.categories[1].in_use
        )
        self.assertTrue(annotated_disagg_a.has_results)
        annotated_disagg_b = DisaggregationType.form_objects.for_indicator(indicator_b.pk).get(pk=disagg.pk)
        self.assertTrue(annotated_disagg_b.in_use)
        self.assertFalse(
            annotated_disagg_b.categories[0].in_use,
        )
        self.assertTrue(
            annotated_disagg_b.categories[1].in_use
        )
        self.assertFalse(annotated_disagg_b.has_results)
