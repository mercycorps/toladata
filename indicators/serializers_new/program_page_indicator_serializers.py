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
from django.db import models
from .indicator_serializers import (
    IndicatorBaseSerializerMixin,
    IndicatorMeasurementMixin,
    IndicatorOrderingMixin,
)
from .program_page_target_result_serializers import ProgramPageTargetSerializer, ProgramPageResultSerializer
from indicators.models import Indicator, Result
from indicators.queries import ResultsTarget
from tola.model_utils import get_serializer
from tola.l10n_utils import l10n_date_medium


class NumberWithTierIndicatorMixin:
    """Indicator serializer component to add the tier name to the number in case of manually numbered programs"""

    # Helper fields for serializer method fields:
    def get_long_number(self, indicator):
        """overrides parent method to include tier if manually numbering"""
        number = super().get_long_number(indicator)
        if not indicator.using_results_framework:
            level_name = self.get_old_level_name(indicator)
            if not level_name:
                return number
            if not number:
                return level_name
            return f"{level_name} {number}"
        if not (indicator.using_results_framework and indicator.manual_number_display) or not indicator.level_id:
            return number
        level = self._get_level(indicator)
        if not level or not level['tier_name']:
            return number
        if not number:
            return level['tier_name']
        return f"{level['tier_name']} {number}"


class ProgramPageIndicatorMixin:
    """Indicator serializer component to add all Program Page information to a given indicator set"""
    was_just_created = serializers.BooleanField(source="just_created")
    is_key_performance_indicator = serializers.BooleanField()
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
    lop_actual = serializers.FloatField()
    lop_met = serializers.FloatField(source='lop_percent_met')
    lop_target_progress = serializers.FloatField()
    lop_actual_progress = serializers.FloatField()
    lop_met_progress = serializers.SerializerMethodField()
    reporting_period = serializers.SerializerMethodField()
    periodic_targets = serializers.SerializerMethodField()
    no_target_results = serializers.SerializerMethodField()

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
            'lop_actual',
            'lop_met',
            'lop_target_progress',
            'lop_actual_progress',
            'lop_met_progress',
            'reporting_period',
            'periodic_targets',
            'no_target_results'
        ]

    # class methods to instantiate serializer with minimal queries:

    @classmethod
    def _get_query_fields(cls):
        return super()._get_query_fields() + [
            'create_date', 'level_order'
        ]

    @classmethod
    def get_queryset(cls, **kwargs):
        filters = kwargs.get('filters', {})
        return Indicator.program_page_objects.select_related('program').prefetch_related(
            models.Prefetch( # prefetch all targets WITH their results for result table data
                'periodictargets',
                queryset=ResultsTarget.objects.select_related(None).prefetch_related(
                    models.Prefetch(
                        'result_set',
                        queryset=Result.objects.select_related(None).prefetch_related(None).order_by('date_collected'),
                        to_attr='prefetch_results'
                    )
                ).order_by('customsort').with_annotations(),
                to_attr='prefetch_targets'
            ),
            models.Prefetch( # prefetch orphan results for result table data
                'result_set',
                queryset=Result.objects.select_related(None).prefetch_related(None).filter(
                    periodic_target__isnull=True
                ).order_by('date_collected'),
                to_attr='prefetch_no_target_results'
            )
        ).only(
            *cls._get_query_fields()
        ).filter(**filters)

    # Serializer method fields:

    @staticmethod
    def get_has_results(indicator):
        return indicator.results_count > 0

    @staticmethod
    def get_missing_evidence(indicator):
        return indicator.results_count > 0 and indicator.results_with_evidence_count < indicator.results_count

    @staticmethod
    def get_lop_met_progress(indicator):
        if indicator.lop_target_progress and indicator.lop_actual_progress:
            return indicator.lop_actual_progress / indicator.lop_target_progress
        return None

    @staticmethod
    def get_reporting_period(indicator):
        start_date = indicator.program.reporting_period_start
        end_date = indicator.most_recent_completed_target_end_date
        if not start_date or not end_date:
            return None
        return '{} – {}'.format(l10n_date_medium(start_date, decode=True), l10n_date_medium(end_date, decode=True))

    @staticmethod
    def get_periodic_targets(indicator):
        targets = indicator.prefetch_targets
        return ProgramPageTargetSerializer(targets, context={'indicator': indicator}, many=True).data

    @staticmethod
    def get_no_target_results(indicator):
        return ProgramPageResultSerializer(indicator.prefetch_no_target_results, many=True).data


ProgramPageIndicatorSerializer = get_serializer(
    ProgramPageIndicatorMixin,
    NumberWithTierIndicatorMixin,
    IndicatorMeasurementMixin,
    IndicatorOrderingMixin,
    IndicatorBaseSerializerMixin
)

ProgramPageIndicatorOrderingSerializer = get_serializer(
    NumberWithTierIndicatorMixin,
    IndicatorOrderingMixin,
    IndicatorBaseSerializerMixin
)
