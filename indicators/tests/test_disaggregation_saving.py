
"""Tests that duplicate disaggregation types and labels can't be created"""
from django import test
from django.core.exceptions import ValidationError

from factories import (
    indicators_models as i_factories,
    workflow_models as w_factories
)
from indicators.models import DisaggregationLabel, DisaggregationType
from workflow.models import Country
from tola_management.countryadmin import CountryDisaggregationSerializer

class TestDuplicateDisagg(test.TestCase):
    fixtures = ["duplicated_disaggregations"]

    def setUp(self):
        self.disagg_name = "Disaggregation Type 1"
        self.country1 = w_factories.CountryFactory(country="country1", code="C1")
        self.disagg1 = i_factories.DisaggregationTypeFactory(
            disaggregation_type=self.disagg_name, country=self.country1)
        self.user = w_factories.UserFactory()

    def test_prevent_type_duplication(self):

        # catch the validation error that results when an attempt is made to create a dupe
        with self.assertRaises(ValidationError) as error_manager:
            i_factories.DisaggregationTypeFactory(
                disaggregation_type=self.disagg_name, country=self.country1)
        self.assertEqual(
            error_manager.exception.messages[0],
            f"There is already a disaggregation type with the name \"{self.disagg1.disaggregation_type}\" in {self.country1.country}",
            "The error message for duplicated disaggregation types should be correct"
        )

        disagg2 = i_factories.DisaggregationTypeFactory(country=self.country1)
        self.assertEqual(
            2, self.country1.disaggregationtype_set.count(),
            "Should be able to save a new disaggregation type in same country as another type."
        )

        # Shouldn't be able to change the name to one that already exists in the same country
        with self.assertRaises(ValidationError) as error_manager:
            disagg2.disaggregation_type = self.disagg1.disaggregation_type
            disagg2.save()
        self.assertEqual(
            error_manager.exception.messages[0],
            f"There is already a disaggregation type with the name \"{self.disagg1.disaggregation_type}\" in {self.country1.country}",
            "The error message for duplicated disaggregation types should be correct"
        )

        country2 = w_factories.CountryFactory(country="country2", code="C2")
        i_factories.DisaggregationTypeFactory(disaggregation_type=self.disagg_name, country=country2)
        self.assertEqual(
            1, country2.disaggregationtype_set.count(),
            "Should be able to save a disagg type of the same name in a different country."
        )

    def test_prevent_label_duplication(self):
        label_name = "label1"
        i_factories.DisaggregationLabelFactory(disaggregation_type=self.disagg1, label=label_name)

        with self.assertRaises(ValidationError) as error_manager:
            i_factories.DisaggregationLabelFactory(
                disaggregation_type=self.disagg1, label=label_name)
        self.assertEqual(
            error_manager.exception.messages[0],
            f"There is already a disaggregation label with the name \"{label_name}\" in {self.disagg1.disaggregation_type}"
        )

        label2 = i_factories.DisaggregationLabelFactory(disaggregation_type=self.disagg1)
        self.assertEqual(
            2, self.disagg1.disaggregationlabel_set.count(),
            "Should be able to save a different disaggregation label in same disagg type."
        )

        # Shouldn't be able to change the label name to one that already exists in the same type
        with self.assertRaises(ValidationError) as error_manager:
            label2.label = label_name
            label2.save()
        self.assertEqual(
            error_manager.exception.messages[0],
            f"There is already a disaggregation label with the name \"{label_name}\" in {self.disagg1.disaggregation_type}",
            "The error message for duplicated disaggregation labels should be correct"
        )

        disagg2 = i_factories.DisaggregationTypeFactory()
        i_factories.DisaggregationLabelFactory(label=label_name, disaggregation_type=disagg2)
        self.assertEqual(
            1, disagg2.disaggregationlabel_set.count(),
            "Should be able to save a disagg label with the same name in a different disagg type."
        )

    def test_user_can_dedupe_label(self):
        # This test uses the fixtures, which are needed to create duplicate records in the database

        # First test with non-duplicated types
        f_disagg_type = DisaggregationType.objects.get(pk=100)
        f_label1 = DisaggregationLabel.objects.get(pk=100)
        f_label2 = DisaggregationLabel.objects.get(pk=101)
        f_label2.label = "Fixture label 2"

        put_data = {
            "country": f_disagg_type.country,
            "disaggregation_type": f_disagg_type.disaggregation_type,
            "disaggregationlabel_set": [
                f_label1,
                f_label2,
            ]
        }

        disagg_serializer = CountryDisaggregationSerializer(
            instance=f_disagg_type, context={"tola_user": self.user.tola_user})
        disagg_serializer.update(f_disagg_type, put_data)
        label_names = DisaggregationLabel.objects.filter(disaggregation_type=f_disagg_type).values_list('label', flat=True)
        self.assertSetEqual({"Fixture label", "Fixture label 2"}, set(label_names))

        # Now test with duplicated labels and types (very edgy)
        f_disagg_type = DisaggregationType.objects.get(pk=200)
        f_label1 = DisaggregationLabel.objects.get(pk=200)
        f_label2 = DisaggregationLabel.objects.get(pk=201)

        # Need to rename both type and label
        f_disagg_type.disaggregation_type = "Fixture disagg type updated"
        f_label2.label = "Fixture label 2"

        put_data = {
            "country": f_disagg_type.country,
            "disaggregation_type": f_disagg_type.disaggregation_type,
            "disaggregationlabel_set": [
                f_label1,
                f_label2,
            ]
        }

        disagg_serializer = CountryDisaggregationSerializer(
            instance=f_disagg_type, context={"tola_user": self.user.tola_user})
        disagg_serializer.update(f_disagg_type, put_data)
        label_names = DisaggregationLabel.objects.filter(disaggregation_type=f_disagg_type).values_list('label',flat=True)
        self.assertSetEqual({"Fixture label", "Fixture label 2"}, set(label_names))
        self.assertEqual("Fixture disagg type updated", DisaggregationType.objects.get(pk=200).disaggregation_type)
