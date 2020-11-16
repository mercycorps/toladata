
from django import test
from rest_framework import serializers
from factories import (
    workflow_models as w_factories,
    indicators_models as i_factories
)

from tola_management.countryadmin import CountryDisaggregationSerializer
from indicators.models import Indicator, DisaggregationType


class TestCountryDisaggregationSerializer(test.TestCase):

    def setUp(self):
        self.country = w_factories.CountryFactory(country="Test Country", code="TC")
        self.tola_user = w_factories.TolaUserFactory(country=self.country)
        w_factories.grant_country_access(self.tola_user, self.country, 'basic_admin')
        self.client.force_login(user=self.tola_user.user)

    def get_base_disagg_data(self):
        return {
            'country': self.country.id,
            'disaggregation_type': 'Gender',
            'has_indicators': True,
            'id': 'new',
            'is_archived': False,
            'labels': [
                {'id': 'new', 'label': "Male", 'customsort': 1, 'createdId': 'new-0'},
                {'id': 'new', 'label': "Female", 'customsort': 2, 'createdId': 'new-1'},
            ],
            'selected_by_default': True,
        }

    def test_no_disaggregations(self):
        response = self.client.get('/api/tola_management/countrydisaggregation/', {'country': self.country.pk})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), [])

    def test_one_disaggregation(self):
        disagg = i_factories.DisaggregationTypeFactory(country=self.country, labels=False)
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
            country=self.country,
            labels=False
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

    def test_retro_disagg_serializer_updates_indicators(self):
        country2 = w_factories.CountryFactory()
        program1 = w_factories.RFProgramFactory(pk=1, country=[self.country])
        program2 = w_factories.RFProgramFactory(pk=2, country=[country2])
        p1_indicators = i_factories.RFIndicatorFactory.create_batch(3, program=program1)
        p2_indicators = i_factories.RFIndicatorFactory.create_batch(4, program=program2)

        # Ensure Serializer raises a permission error if user doesn't have admin rights to the country
        # and that disaggs aren't applied to indicators in this case
        disagg_data = self.get_base_disagg_data()
        context = {'retroPrograms': [2], 'tola_user': self.tola_user}
        serializer = CountryDisaggregationSerializer(data=disagg_data, context=context)
        validated_data = serializer.is_valid()
        self.assertRaises( serializers.ValidationError, serializer.save)
        p2_indicator_disagg_types = [i.disaggregation.count() for i in p2_indicators]
        self.assertEqual(sum(p2_indicator_disagg_types), 0)

        # Ensure Serializer raises a permission error if user doesn't have admin rights to one of the countries
        # and that disaggs aren't applied to indicators in this case
        context['retroPrograms'] = [1, 2]
        serializer = CountryDisaggregationSerializer(data=disagg_data, context=context)
        serializer.is_valid()
        self.assertRaises(serializers.ValidationError, serializer.save)
        p1_indicator_disagg_types = [i.disaggregation.count() for i in p1_indicators]

        self.assertEqual(sum(p1_indicator_disagg_types), 0)
        p2_indicator_disagg_types = [i.disaggregation.count() for i in p2_indicators]
        self.assertEqual(sum(p2_indicator_disagg_types), 0)

        # User has permissions and disaggs should be applied to indicators.
        context['retroPrograms'] = [1]
        serializer = CountryDisaggregationSerializer(data=disagg_data, context=context)
        serializer.is_valid()
        serializer.save()
        p1_indicator_disagg_types = [i.disaggregation.count() for i in p1_indicators]
        self.assertEqual(sum(p1_indicator_disagg_types), len(p1_indicators))
        p2_indicator_disagg_types = [i.disaggregation.count() for i in p2_indicators]
        self.assertEqual(sum(p2_indicator_disagg_types), 0)

    def test_retro_disagg_view_updates_indicators(self):
        program1 = w_factories.RFProgramFactory(pk=111, country=[self.country])
        program2 = w_factories.RFProgramFactory(pk=112, country=[self.country])
        p1_indicators = i_factories.RFIndicatorFactory.create_batch(3, program=program1)
        p2_indicators = i_factories.RFIndicatorFactory.create_batch(4, program=program2)

        data = self.get_base_disagg_data()
        data['disaggregation_type'] = "New Disagg Type"
        response = self.client.post(
            f'/api/tola_management/countrydisaggregation/', data, content_type='application/json')
        self.assertEqual(response.status_code, 201)
        p1_indicator_disagg_types = [i.disaggregation.count() for i in p1_indicators]
        self.assertEqual(sum(p1_indicator_disagg_types), 0)
        p2_indicator_disagg_types = [i.disaggregation.count() for i in p2_indicators]
        self.assertEqual(sum(p2_indicator_disagg_types), 0)
        self.assertEqual(DisaggregationType.objects.filter(disaggregation_type="New Disagg Type").count(), 1)


        data['disaggregation_type'] = "Bad Retro Disagg"
        data['retroPrograms'] = [0]
        response = self.client.post(
            f'/api/tola_management/countrydisaggregation/', data, content_type='application/json')
        self.assertEqual(response.status_code, 400)
        p1_indicator_disagg_types = [i.disaggregation.count() for i in p1_indicators]
        self.assertEqual(sum(p1_indicator_disagg_types), 0)
        p2_indicator_disagg_types = [i.disaggregation.count() for i in p2_indicators]
        self.assertEqual(sum(p2_indicator_disagg_types), 0)
        self.assertEqual(DisaggregationType.objects.filter(disaggregation_type="Bad Retro Disagg").count(), 0)

        data['disaggregation_type'] = "New Disagg Type 2"
        data['retroPrograms'] = []
        response = self.client.post(
            f'/api/tola_management/countrydisaggregation/', data, content_type='application/json')
        self.assertEqual(response.status_code, 201)
        p1_indicator_disagg_types = [i.disaggregation.count() for i in p1_indicators]
        self.assertEqual(sum(p1_indicator_disagg_types), 0)
        p2_indicator_disagg_types = [i.disaggregation.count() for i in p2_indicators]
        self.assertEqual(sum(p2_indicator_disagg_types), 0)
        self.assertEqual(DisaggregationType.objects.filter(disaggregation_type="New Disagg Type 2").count(), 1)

        data['disaggregation_type'] = "New Disagg Type 3"
        data['retroPrograms'] = [111]
        response = self.client.post(
            f'/api/tola_management/countrydisaggregation/', data, content_type='application/json')
        self.assertEqual(response.status_code, 201)
        p1_indicator_disagg_types = [i.disaggregation.count() for i in p1_indicators]
        self.assertEqual(sum(p1_indicator_disagg_types), 3)
        p2_indicator_disagg_types = [i.disaggregation.count() for i in p2_indicators]
        self.assertEqual(sum(p2_indicator_disagg_types), 0)
        self.assertEqual(DisaggregationType.objects.filter(disaggregation_type="New Disagg Type 3").count(), 1)


