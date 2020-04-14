"""Serializers (query-optimized) for workflow.Program"""

import datetime
import operator
from rest_framework import serializers
from django.db import models
from django.utils.translation import ugettext as _
from workflow.models import Program
from indicators.models import (
    Indicator,
    LevelTier,
    Level,
)
from indicators.serializers_new import (
    ProgramPageIndicatorSerializer,
    ProgramPageIndicatorUpdateSerializer,
)
from tola.model_utils import get_serializer
from .base_program_serializers import (
    ProgramBase,
    ProgramReportingPeriodMixin,
    ProgramLevelOrderingMixin,
    RFLevelOrderingMixin
)


# Base program serializer for testing:
ProgramBaseSerializer = get_serializer(ProgramBase)

# Reporting period and base info serializer for testing:
ProgramReportingPeriodSerializer = get_serializer(ProgramReportingPeriodMixin, ProgramBase)

# Level ordering and base info serializer for testing:
ProgramLevelOrderingProgramSerializer = get_serializer(ProgramLevelOrderingMixin, ProgramBase)

# RF-specific level ordering and base serializer for testing
RFLevelOrderingProgramSerializer = get_serializer(RFLevelOrderingMixin, ProgramBase)


class ProgramLevelUpdateMixin:
    """Single-purpose serializer for returning new level order for indicators after one was deleted
    
        used by program page to handle reordering of indicators after indicator deletion
    """
    class Meta:
        fields = []

    @classmethod
    def update_ordering(cls, pk):
        program = Program.rf_aware_objects.select_related(None).prefetch_related(None).only(
            *cls._get_query_fields()
        ).prefetch_related(
            models.Prefetch(
                'indicator_set',
                queryset=Indicator.program_page_objects.select_related(None).prefetch_related(None).only(
                    'pk', 'name', 'deleted', 'program_id', 'level_id', 'level_order', 'number', 'old_level'
                ),
                to_attr='prefetch_indicators'
            ),
            cls._get_leveltiers_prefetch(),
            cls._get_levels_prefetch
        ).get(pk=pk)
        return cls(program)


ProgramLevelUpdateSerializer = get_serializer(ProgramLevelUpdateMixin, RFLevelOrderingMixin, ProgramBase)


class ProgramPageMixin:
    """Serializer specific to the Program Page
    
        - produces JSON-serializable object which contains all information needed for Program Page React model
        to populate program page
    """

    needs_additional_target_periods = serializers.BooleanField()
    site_count = serializers.SerializerMethodField()
    has_levels = serializers.SerializerMethodField()
    gait_url = serializers.CharField()
    target_period_info = serializers.SerializerMethodField()
    indicators = serializers.SerializerMethodField()

    class Meta:
        fields = [
            'needs_additional_target_periods',
            'site_count',
            'has_levels',
            'gait_url',
            'target_period_info',
            'indicators'
        ]

    @classmethod
    def _get_query_fields(cls):
        return super(ProgramPageMixin, cls)._get_query_fields() + ['gaitid']

    @classmethod
    def get_for_pk(cls, pk):
        program = Program.program_page_objects.select_related(None).prefetch_related(None).only(
            *cls._get_query_fields()
        ).annotate(
            num_sites=models.Count('indicator__result__site', distinct=True)
        ).prefetch_related(
            models.Prefetch(
                'indicator_set',
                queryset=Indicator.program_page_objects.select_related(None).prefetch_related(None).only(
                    'pk', 'name', 'deleted', 'program_id', 'means_of_verification', 'level_id', 'level_order',
                    'number', 'target_frequency', 'unit_of_measure', 'unit_of_measure_type', 'baseline', 'baseline_na',
                    'direction_of_change', 'is_cumulative', 'key_performance_indicator', 'old_level',
                    'create_date'
                ),
                to_attr='program_page_indicators'
            ),
            cls._get_leveltiers_prefetch(),
            cls._get_levels_prefetch(),
        ).get(pk=pk)
        return cls(program)

    def _get_indicators_for_ordering(self, program):
        return getattr(
            program, 'program_page_indicators',
            super()._get_indicators_for_ordering(program)
            )

    def _get_program_levels(self, program):
        return sorted(
            getattr(
                program, 'prefetch_levels',
                super()._get_program_levels(program)
                ), key=operator.attrgetter('customsort')
            )

    def get_site_count(self, program):
        if hasattr(program, 'num_sites'):
            return program.num_sites
        return len(program.get_sites())

    def get_has_levels(self, program):
        if hasattr(program, 'prefetch_levels'):
            return len(program.prefetch_levels)
        return program.levels.count()

    def get_target_period_info(self, program):
        indicators = self._get_indicators_for_ordering(program)
        irregulars = {
            frequency: len([i.pk for i in indicators
                            if i.target_frequency == frequency]) > 0
            for frequency in Indicator.IRREGULAR_TARGET_FREQUENCIES
        }
        regulars = {
            frequency: [i.most_recent_completed_target_end_date for i in indicators
                        if (i.target_frequency == frequency and
                            i.most_recent_completed_target_end_date is not None)]
            for frequency in Indicator.REGULAR_TARGET_FREQUENCIES
        }
        return {
            'lop': irregulars[Indicator.LOP],
            'midend': irregulars[Indicator.MID_END],
            'event': irregulars[Indicator.EVENT],
            'time_targets': any(regulars.values()),
            'annual': max(regulars[Indicator.ANNUAL]).isoformat() if regulars[Indicator.ANNUAL] else None,
            'semi_annual': max(
                regulars[Indicator.SEMI_ANNUAL]
                ).isoformat() if regulars[Indicator.SEMI_ANNUAL] else None,
            'tri_annual': max(regulars[Indicator.TRI_ANNUAL]).isoformat() if regulars[Indicator.TRI_ANNUAL] else None,
            'quarterly': max(regulars[Indicator.QUARTERLY]).isoformat() if regulars[Indicator.QUARTERLY] else None,
            'monthly': max(regulars[Indicator.MONTHLY]).isoformat() if regulars[Indicator.MONTHLY] else None,
        }

    def get_indicators(self, program):
        return {
            serialized_indicator['pk']: serialized_indicator
            for serialized_indicator in ProgramPageIndicatorSerializer(
                getattr(
                    program, 'program_page_indicators',
                    Indicator.program_page_objects.filter(program_id=program.pk)
                    ),
                many=True).data
            }


# Serializer for Program Page (view only):
ProgramPageProgramSerializer = get_serializer(
    ProgramPageMixin,
    ProgramLevelOrderingMixin,
    ProgramReportingPeriodMixin,
    ProgramBase
)


class ProgramPageUpdateMixin:
    
    indicator = serializers.SerializerMethodField()
    indicators = serializers.SerializerMethodField()

    class Meta:
        override_fields = True
        fields = [
            'pk',
            'indicator_pks_level_order',
            'indicator_pks_chain_order',
            'indicator',
            'indicators'
        ]

    @classmethod
    def _get_query_fields(cls):
        return ['pk', '_using_results_framework', 'auto_number_indicators',
                'reporting_period_start', 'reporting_period_end']

    @classmethod
    def update_indicator_pk(cls, pk, indicator_pk):
        program = Program.program_page_objects.select_related(None).prefetch_related(None).only(
            *cls._get_query_fields()
        ).annotate(
            ordering_only=models.Value(False, output_field=models.BooleanField()),
            indicator_update_id=models.Value(indicator_pk, output_field=models.IntegerField())
        ).prefetch_related(
            models.Prefetch(
                'indicator_set',
                queryset=Indicator.program_page_objects.filter(
                    pk=indicator_pk
                ).select_related(None).prefetch_related(None).only(
                    'pk', 'name', 'deleted', 'program_id', 'means_of_verification', 'level_id', 'level_order',
                    'number', 'target_frequency', 'unit_of_measure', 'unit_of_measure_type', 'baseline', 'baseline_na',
                    'direction_of_change', 'is_cumulative', 'key_performance_indicator', 'old_level',
                    'create_date'
                ),
                to_attr='program_page_indicators'
            ),
            models.Prefetch(
                'indicator_set',
                queryset=Indicator.rf_aware_objects.select_related(None).prefetch_related(None).only(
                    'pk', 'program_id', 'level_id', 'level_order', 'number', 'old_level',
                ),
                to_attr='ordering_indicators'
            ),
            cls._get_leveltiers_prefetch(),
            cls._get_levels_prefetch(),
        ).get(pk=pk)
        return cls(program)

    @classmethod
    def update_ordering(cls, pk):
        program = Program.program_page_objects.select_related(None).prefetch_related(None).only(
            *cls._get_query_fields()
        ).annotate(
            ordering_only=models.Value(True, output_field=models.BooleanField())
        ).prefetch_related(
            models.Prefetch(
                'indicator_set',
                queryset=Indicator.rf_aware_objects.select_related(None).prefetch_related(None).only(
                    'pk', 'program_id', 'level_id', 'level_order', 'number', 'old_level',
                ),
                to_attr='ordering_indicators'
            ),
            cls._get_leveltiers_prefetch(),
            cls._get_levels_prefetch(),
        ).get(pk=pk)
        return cls(program)

    def _get_program_levels(self, program):
        return sorted(
            getattr(
                program, 'prefetch_levels',
                super()._get_program_levels(program)
                ), key=operator.attrgetter('customsort')
            )

    def _get_indicators_for_ordering(self, program):
        return getattr(
            program, 'ordering_indicators',
            super()._get_indicators_for_ordering(program)
            )

    def get_indicator(self, program):
        if getattr(program, 'ordering_only'):
            return []
        return ProgramPageIndicatorSerializer(
            getattr(
                program, 'program_page_indicators',
                Indicator.program_page_objects.filter(pk=program.indicator_update_id)
            )[0]).data

    def get_indicators(self, program):
        return {
            serialized_indicator['pk']: serialized_indicator
            for serialized_indicator in ProgramPageIndicatorUpdateSerializer(
                getattr(
                    program, 'ordering_indicators',
                    Indicator.program_page_objects.filter(program_id=program.pk)
                    ),
                many=True).data
            }

ProgramPageUpdateSerializer = get_serializer(
    ProgramPageUpdateMixin,
    ProgramLevelOrderingMixin,
    ProgramReportingPeriodMixin,
    ProgramBase
)