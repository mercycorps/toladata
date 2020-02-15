
"""Tests that duplicate disaggregation types and labels can't be created"""
from django import test
from django.db import IntegrityError, transaction
from unittest import skip

from factories import (
    indicators_models as i_factories,
    workflow_models as w_factories
)

class TestDuplicateDisagg(test.TestCase):

    def setUp(self):
        self.disagg_name = "Disaggregation Type 1"
        self.country1 = w_factories.CountryFactory(country="country1", code="C1")
        self.disagg1 = i_factories.DisaggregationTypeFactory(
            disaggregation_type=self.disagg_name, country=self.country1)
        self.user = w_factories.UserFactory()

    def test_prevent_create_duplicate_type(self):
        # catch the validation error that results when an attempt is made to create a dupe
        with transaction.atomic():
            with self.assertRaises(IntegrityError) as error_manager:
                i_factories.DisaggregationTypeFactory(
                    disaggregation_type=self.disagg_name, country=self.country1)
            self.assertIsNotNone(error_manager.exception)

        country2 = w_factories.CountryFactory(country="country2", code="C2")
        i_factories.DisaggregationTypeFactory(disaggregation_type=self.disagg_name, country=country2)
        self.assertEqual(
            1, country2.disaggregationtype_set.count(),
            "Should be able to save a disagg type of the same name in a different country."
        )

    def test_prevent_update_to_duplicate_type(self):
        disagg2 = i_factories.DisaggregationTypeFactory(country=self.country1)
        self.assertEqual(
            2, self.country1.disaggregationtype_set.count(),
            "Should be able to save a new disaggregation type in same country as another type."
        )

        # Shouldn't be able to change the name to one that already exists in the same country
        with transaction.atomic():
            with self.assertRaises(IntegrityError) as error_manager:
                disagg2.disaggregation_type = self.disagg1.disaggregation_type
                disagg2.save()
            self.assertIsNotNone(error_manager.exception)

    def test_prevent_label_duplication(self):
        label_name = "label1"
        i_factories.DisaggregationLabelFactory(disaggregation_type=self.disagg1, label=label_name)

        with transaction.atomic():
            with self.assertRaises(IntegrityError) as error_manager:
                i_factories.DisaggregationLabelFactory(
                    disaggregation_type=self.disagg1, label=label_name)
            self.assertIsNotNone(error_manager.exception)

        label2 = i_factories.DisaggregationLabelFactory(disaggregation_type=self.disagg1)
        self.assertEqual(
            2, self.disagg1.disaggregationlabel_set.count(),
            "Should be able to save a different disaggregation label in same disagg type."
        )

        # Shouldn't be able to change the label name to one that already exists in the same type
        with transaction.atomic():
            with self.assertRaises(IntegrityError) as error_manager:
                label2.label = label_name
                label2.save()
            self.assertIsNotNone(error_manager.exception)

        disagg2 = i_factories.DisaggregationTypeFactory()
        i_factories.DisaggregationLabelFactory(label=label_name, disaggregation_type=disagg2)
        self.assertEqual(
            1, disagg2.disaggregationlabel_set.count(),
            "Should be able to save a disagg label with the same name in a different disagg type."
        )
