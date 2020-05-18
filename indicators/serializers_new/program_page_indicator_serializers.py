"""Partial seiralizers for Indicator objects for the Program Page (all React Web app output)

    Serializers:
        ProgramPageIndicatorSerializer: serializes indicators for program page web app. Example:
            ProgramPageIndicatorSerializer.load_for_program(program_pk:int)
                returns indicators serialized as a JSON list
        ProgramPageIndicatorOrderingSerializer: serializes just indicator ordering data for program page web app.
                Used when an indicator was moved between levels or deleted.  Example:
            ProgramPageIndicatorOrderingSerializer.load_for_program(program_pk:int)
                returns indicators with just their numbering/ordering information (which changes when an indicator
                    is deleted or moved between levels) for all indicators for a given program.
"""

from rest_framework import serializers
from .indicator_serializers import (
    IndicatorBaseSerializerMixin,
    IndicatorMeasurementMixin,
    IndicatorOrderingMixin,
)
from indicators.models import Indicator
from tola.model_utils import get_serializer


class ProgramPageIndicatorMixin:
    """Indicator serializer component to add all Program Page information to a given indicator set"""
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
        purpose = "ProgramPage"
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

    # class methods to instantiate serializer with minimal queries:

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

    # Helper fields for serializer method fields:
    def get_long_number(self, indicator):
        """overrides parent method to include tier if manually numbering"""
        number = super().get_long_number(indicator)
        if not indicator.manual_number_display or not indicator.level_id:
            return number
        level_set = getattr(indicator.program, 'prefetch_levels', indicator.program.levels.all())
        level = [l for l in level_set if l.pk == indicator.level_id]
        if not level:
            return number
        level_depth, display_ontology = self._get_level_depth_ontology(level[0], level_set)
        leveltier = [t for t in getattr(
            indicator.program, 'prefetch_leveltiers', indicator.program.level_tiers.all()
            ) if t.tier_depth == level_depth]
        if not leveltier:
            if number is None:
                return ''
            return number
        leveltier_name = _(leveltier[0].name)
        if not number:
            return leveltier_name
        return f"{leveltier_name} {number}"

    # Serializer method fields:

    @staticmethod
    def get_has_results(indicator):
        return indicator.results_count > 0

    @staticmethod
    def get_missing_evidence(indicator):
        return indicator.results_count > 0 and indicator.results_with_evidence_count < indicator.results_count


ProgramPageIndicatorSerializer = get_serializer(
    ProgramPageIndicatorMixin,
    IndicatorMeasurementMixin,
    IndicatorOrderingMixin,
    IndicatorBaseSerializerMixin
)

ProgramPageIndicatorOrderingSerializer = get_serializer(
    IndicatorOrderingMixin,
    IndicatorBaseSerializerMixin
)
