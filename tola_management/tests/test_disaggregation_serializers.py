# -*- coding: utf-8 -*-

from django import test
from factories import (
    workflow_models as w_factories,
    indicators_models as i_factories
)

# Create your tests here.


class TestCountryDisaggregationSerializer(test.TestCase):

    def setUp(self):
        self.country = w_factories.CountryFactory(country="Test Country", code="TC")
        self.tola_user = w_factories.TolaUserFactory(country=self.country)
        w_factories.grant_country_access(self.tola_user, self.country, 'basic_admin')
        self.client.force_login(user=self.tola_user.user)

    def test_no_disaggregations(self):
        response = self.client.get('/api/tola_management/countrydisaggregation/', {'country': self.country.pk})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), [])

    def test_one_disaggregation(self):
        disagg = i_factories.DisaggregationTypeFactory(country=self.country)
        response = self.client.get('/api/tola_management/countrydisaggregation/', {'country': self.country.pk})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)
        disagg_json = response.json()[0]
        self.assertEqual(disagg_json['disaggregation_type'], disagg.disaggregation_type)
        self.assertEqual(len(disagg_json['labels']), 0)
        self.assertFalse(disagg_json['is_archived'])
        self.assertFalse(disagg_json['selected_by_default'])

    def test_disaggregation_special_characters(self):
        disagg = i_factories.DisaggregationTypeFactory(
            country=self.country,
            disaggregation_type='Spéçîål Characters'
        )
        response = self.client.get('/api/tola_management/countrydisaggregation/', {'country': self.country.pk})
        self.assertEqual(response.status_code, 200)
        disagg_json = response.json()[0]
        self.assertEqual(disagg_json['disaggregation_type'], disagg.disaggregation_type)

    def test_disaggregation_selected_by_default(self):
        disagg = i_factories.DisaggregationTypeFactory(
            country=self.country,
            selected_by_default=True)
        response = self.client.get('/api/tola_management/countrydisaggregation/', {'country': self.country.pk})
        self.assertEqual(response.status_code, 200)
        disagg_json = response.json()[0]
        self.assertTrue(disagg_json['selected_by_default'])

    def test_out_of_country_disaggregations(self):
        out_country = w_factories.CountryFactory(country="Out Country", code="OC")
        disagg_out = i_factories.DisaggregationTypeFactory(
            country=out_country,
            disaggregation_type="OUT"
        )
        disagg = i_factories.DisaggregationTypeFactory(country=self.country)
        response = self.client.get('/api/tola_management/countrydisaggregation/', {'country': self.country.pk})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)
        disagg_json = response.json()[0]
        self.assertEqual(disagg_json['disaggregation_type'], disagg.disaggregation_type)

    def test_two_disaggregations_with_labels(self):
        disagg_1 = i_factories.DisaggregationTypeFactory(
            country=self.country,
            labels=["Label {}".format(x) for x in range(5)]
        )
        disagg_2 = i_factories.DisaggregationTypeFactory(
            country=self.country,
            labels=["Speçîål Char Label {}".format(x) for x in range(2)]
        )
        response = self.client.get('/api/tola_management/countrydisaggregation/', {'country': self.country.pk})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 2)
        [disagg_json_1, disagg_json_2] = response.json()
        self.assertEqual(disagg_json_1['disaggregation_type'], disagg_1.disaggregation_type)
        self.assertEqual(len(disagg_json_1['labels']), 5)
        self.assertEqual(disagg_json_2['disaggregation_type'], disagg_2.disaggregation_type)
        self.assertEqual(len(disagg_json_2['labels']), 2)

    def test_labels_in_use(self):
        disagg = i_factories.DisaggregationTypeFactory(
            country=self.country
        )
        in_use_1 = i_factories.DisaggregationLabelFactory(
            disaggregation_type=disagg,
            label="In Use 1",
            customsort=1
        )
        not_in_use = i_factories.DisaggregationLabelFactory(
            disaggregation_type=disagg,
            label="Not in Use",
            customsort=2
        )
        in_use_2 = i_factories.DisaggregationLabelFactory(
            disaggregation_type=disagg,
            label="In Use 2",
            customsort=3
        )
        program = w_factories.RFProgramFactory()
        program.country.add(self.country)
        indicator = i_factories.RFIndicatorFactory(program=program)
        result = i_factories.ResultFactory(
            indicator=indicator,
            achieved=100
        )
        dv_1 = i_factories.DisaggregatedValueFactory(
            category=in_use_1,
            result=result,
            value=40
        )
        dv_2 = i_factories.DisaggregatedValueFactory(
            category=in_use_2,
            result=result,
            value=60
        )
        response = self.client.get('/api/tola_management/countrydisaggregation/', {'country': self.country.pk})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)
        disagg_json = response.json()[0]
        self.assertEqual(disagg_json['labels'][0]['in_use'], True)
        self.assertEqual(disagg_json['labels'][1]['in_use'], False)
        self.assertEqual(disagg_json['labels'][2]['in_use'], True)