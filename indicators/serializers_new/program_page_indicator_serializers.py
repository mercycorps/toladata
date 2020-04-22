import string
from rest_framework import serializers
from django.utils.translation import ugettext as _
from .indicator_serializers import (
    IndicatorBaseSerializerMixin,
    IndicatorMeasurementMixin,
    IndicatorOrderingMixin,
)
from indicators.models import Indicator
from tola.model_utils import get_serializer


class ProgramPageIndicatorMixin:
    was_just_created = serializers.BooleanField(source="just_created")
    is_key_performance_indicator = serializers.BooleanField(source="key_performance_indicator")
    is_reporting = serializers.BooleanField(source="reporting")
    over_under = serializers.IntegerField()
    has_all_targets_defined = serializers.BooleanField()
    results_count = serializers.IntegerField()
    has_results = serializers.SerializerMethodField()
    results_with_evidence_count = serializers.IntegerField()
    missing_evidence = serializers.SerializerMethodField()
    most_recent_completed_target_end_date = serializers.DateField()
    target_period_last_end_date = serializers.DateField()
    lop_target = serializers.FloatField(source='lop_target_calculated')

    class Meta:
        fields = [
            'was_just_created',
            'is_key_performance_indicator',
            'is_reporting',
            'over_under',
            'has_all_targets_defined',
            'results_count',
            'has_results',
            'results_with_evidence_count',
            'missing_evidence',
            'most_recent_completed_target_end_date',
            'target_period_last_end_date',
            'lop_target',
        ]

    @classmethod
    def _get_query_fields(cls):
        return super()._get_query_fields() + [
            'key_performance_indicator', 'create_date', 'level_order'
        ]

    @classmethod
    def get_queryset(cls, **kwargs):
        filters = kwargs.get('filters', {})
        return Indicator.program_page_objects.select_related(None).prefetch_related(None).only(
            *cls._get_query_fields()
        ).filter(**filters)

    def get_has_results(self, indicator):
        return indicator.results_count > 0

    def get_missing_evidence(self, indicator):
        return indicator.results_count > 0 and indicator.results_with_evidence_count < indicator.results_count


ProgramPageIndicatorSerializer = get_serializer(
    ProgramPageIndicatorMixin,
    IndicatorMeasurementMixin,
    IndicatorOrderingMixin,
    IndicatorBaseSerializerMixin
)