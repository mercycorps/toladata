"""Serializers for converting Disaggregations to output for JSON (web) or Excel (download) output"""

from django.db import models
from rest_framework import serializers
from indicators.models import DisaggregationType, DisaggregationLabel
from tola.model_utils import get_serializer


class IPTTDisaggregationBase:
    """Base serializer component for disaggregation type objects"""
    name = serializers.CharField(source='disaggregation_type')

    class Meta:
        model = DisaggregationType
        purpose = 'IPTT'
        fields = [
            'pk',
            'name',
        ]


class IPTTDisaggregationExcelMixin:
    """Serializer component for outputting disaggregations in a format consumed by excel renderer"""
    labels = serializers.SerializerMethodField()
    has_results = serializers.SerializerMethodField()

    class Meta:
        fields = [
            'labels',
            'has_results',
        ]

    def get_labels(self, disagg):
        return [{'pk': label.pk, 'name': label.label} for label in self.context['labels_map'][disagg.pk]]

    def get_has_results(self, disagg):
        return disagg.pk in self.context.get('with_results', [])


IPTTExcelDisaggregationSerializer = get_serializer(
    IPTTDisaggregationExcelMixin,
    IPTTDisaggregationBase,
)


class IPTTDisaggregationJSONMixin:
    """Serializer component for outputting disaggregations in a JSON format used by React App"""
    labels = serializers.SerializerMethodField()
    country = serializers.SerializerMethodField()

    class Meta:
        fields = [
            'labels',
            'country',
        ]

    @classmethod
    def load_for_program(cls, program_pk):
        """Loads all disaggregations for a program

            used to inject disaggregation types into context for all the child serializers of a given program
            to minimize repeat queries (pulling disaggregation type objects for each indicator assigned them)
        """
        queryset = DisaggregationType.objects.select_related('country').filter(
            indicator__program_id=program_pk, is_archived=False
        ).order_by('global_type', 'disaggregation_type').distinct().prefetch_related(models.Prefetch(
            'disaggregationlabel_set',
            queryset=DisaggregationLabel.objects.select_related(None).order_by('customsort').only(
                'pk', 'label', 'customsort', 'disaggregation_type_id'),
            to_attr='prefetch_categories')).only('pk', 'disaggregation_type', 'country__country', 'global_type')
        return cls(queryset, many=True)

    @staticmethod
    def get_labels(disagg):
        return [{'pk': label.pk, 'name': label.label} for label in disagg.prefetch_categories]

    @staticmethod
    def get_country(disagg):
        return disagg.country.country if disagg.country else None


IPTTJSONDisaggregationSerializer = get_serializer(
    IPTTDisaggregationJSONMixin,
    IPTTDisaggregationBase
)
