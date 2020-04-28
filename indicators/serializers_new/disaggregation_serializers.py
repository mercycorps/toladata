"""Serializers for converting Disaggregations to output for JSON (web) or Excel (download) output"""

from rest_framework import serializers
from indicators.models import DisaggregationType
from tola.model_utils import get_serializer


class IPTTDisaggregationBase:
    """Serializes disaggregations from context provided by the IPTT Report Serializer to an excel renderer format"""

    name = serializers.CharField(source='disaggregation_type')
    labels = serializers.SerializerMethodField()
    has_results = serializers.SerializerMethodField()

    class Meta:
        model = DisaggregationType
        purpose = 'IPTT'
        fields = [
            'pk',
            'name',
            'labels',
            'has_results',
        ]

    def get_labels(self, disagg):
        return [{'pk': label.pk, 'name': label.label} for label in self.context['labels_map'][disagg.pk]]

    def get_has_results(self, disagg):
        return disagg.pk in self.context.get('with_results', [])
    

IPTTDisaggregationSerializer = get_serializer(
    IPTTDisaggregationBase,
)