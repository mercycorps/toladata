from rest_framework import serializers
from indicators.models import Indicator, Level, LevelTier, DisaggregationLabel, DisaggregationType
from indicators.queries import IPTTIndicator
from workflow.models import Program
from tola.model_utils import get_serializer
from django.utils.translation import ugettext as _
from .indicator_serializers import (
    IndicatorOrderingMixin,
    IndicatorMeasurementMixin,
    IndicatorBaseSerializerMixin
)

class IPTTIndicatorMixin:
    sector_pk = serializers.IntegerField(source='sector_id')
    indicator_type_pks = serializers.SerializerMethodField()
    site_pks = serializers.SerializerMethodField()
    disaggregation_pks = serializers.SerializerMethodField()

    class Meta:
        fields = [
            'sector_pk',
            #'indicator_type_pks',
            #'site_pks',
            #'disaggregation_pks',
        ]

    @classmethod
    def _get_query_fields(cls):
        return super()._get_query_fields() + [
            'sector_id'
        ]

    def get_indicator_type_pks(self, indicator):
        if hasattr(self, 'context') and 'indicator_types' in self.context:
            return sorted(
                set(it['pk'] for it in self.context['indicator_types'] if it['indicator__pk'] == indicator.pk)
                )
        return sorted(set(it.pk for it in indicator.indicator_type.all()))

    def get_site_pks(self, indicator):
        if hasattr(self, 'context') and 'sites' in self.context:
            return sorted(
                set(site['pk'] for site in self.context['sites'] if site['result__indicator__pk'] == indicator.pk)
            )
        return sorted(set(site.pk for result in indicator.result_set.all() for site in result.site.all()))

    def get_disaggregation_pks(self, indicator):
        if hasattr(self, 'context') and 'disaggregations' in self.context:
            return sorted(
                set(disaggregation['pk'] for disaggregation in self.context['disaggregations']
                    if disaggregation['indicator__pk'] == indicator.pk)
            )
        return sorted(set(disaggregation.pk for disaggregation in indicator.disaggregation.all()))


IPTTIndicatorSerializer = get_serializer(
    IPTTIndicatorMixin,
    IndicatorOrderingMixin,
    IndicatorMeasurementMixin,
    IndicatorBaseSerializerMixin
)