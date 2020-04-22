"""Serializers (query-optimized) for workflow.Program"""

import operator
import dateutil.parser
from rest_framework import serializers
from django.db import models
from indicators.models import Indicator
from indicators.serializers_new import (
    TierBaseSerializer,
    LevelBaseSerializer,
    ProgramPageIndicatorSerializer,
)
from tola.model_utils import get_serializer
from workflow.models import Program
from workflow.serializers_new.base_program_serializers import (
    ProgramBaseSerializerMixin,
    ProgramReportingPeriodMixin,
    ProgramRFOrderingMixin,
)


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
    _tier_serializer = TierBaseSerializer
    _level_serializer = LevelBaseSerializer
    _indicator_serializer = ProgramPageIndicatorSerializer

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
        return super()._get_query_fields() + ['gaitid']

    @classmethod
    def get_queryset(cls, **kwargs):
        queryset = Program.program_page_objects.select_related(None).prefetch_related().only(
            *cls._get_query_fields()
        ).annotate(num_sites=models.Count('indicator__result__site', distinct=True))
        pk = kwargs.get('pk', None)
        if pk is not None:
            return queryset.get(pk=pk)
        filters = kwargs.get('filters', {})
        return queryset.filter(**filters)

    @classmethod
    def get_for_pk(cls, pk):
        return cls.load_for_pk(pk)

    def _get_indicators_for_ordering(self, program):
        return self._get_program_indicators(program)

    def get_site_count(self, program):
        if hasattr(program, 'num_sites'):
            return program.num_sites
        return len(program.get_sites())

    def get_has_levels(self, program):
        if self._get_program_levels(program):
            return True
        return False

    def get_target_period_info(self, program):
        indicators = self._get_program_indicators(program)
        irregulars = {
            frequency: len([i['pk'] for i in indicators
                            if i['target_frequency'] == frequency]) > 0
            for frequency in Indicator.IRREGULAR_TARGET_FREQUENCIES
        }
        get_date_string = lambda date_obj: date_obj.date().isoformat() if date_obj is not None else None
        regulars = {
            frequency: get_date_string(max(
                [dateutil.parser.isoparse(i['most_recent_completed_target_end_date']) for i in indicators if (
                    i['target_frequency'] == frequency and i['most_recent_completed_target_end_date'] is not None)],
                default=None))
            for frequency in Indicator.REGULAR_TARGET_FREQUENCIES
        }
        return {
            'lop': irregulars[Indicator.LOP],
            'midend': irregulars[Indicator.MID_END],
            'event': irregulars[Indicator.EVENT],
            'time_targets': any(regulars.values()),
            'annual': regulars[Indicator.ANNUAL],
            'semi_annual': regulars[Indicator.SEMI_ANNUAL],
            'tri_annual': regulars[Indicator.TRI_ANNUAL],
            'quarterly': regulars[Indicator.QUARTERLY],
            'monthly': regulars[Indicator.MONTHLY],
        }

    def get_indicators(self, program):
        return {
            serialized_indicator['pk']: serialized_indicator
            for serialized_indicator in self._get_program_indicators(program)
        }


# Serializer for Program Page (view only):
ProgramPageProgramSerializer = get_serializer(
    ProgramPageMixin,
    ProgramRFOrderingMixin,
    ProgramReportingPeriodMixin,
    ProgramBaseSerializerMixin
)


class ProgramOrderingUpdateMixin:
    """Single-purpose serializer for returning new level order for indicators after one was deleted

        used by program page to handle reordering of indicators after indicator deletion
    """
    indicators = serializers.SerializerMethodField()

    class Meta:
        fields = [
            'indicators',
        ]

    def get_indicators(self, program):
        return {i['pk']: i for i in self.context['indicators']}


# Serializer for the Program Page updating only level, ordering, and number for indicators (after deleting one)
ProgramRFOrderingUpdateSerializer = get_serializer(
    ProgramOrderingUpdateMixin,
    ProgramRFOrderingMixin,
    ProgramBaseSerializerMixin
)



class ProgramPageUpdateMixin:
    indicator = serializers.SerializerMethodField()

    class Meta:
        fields = ['indicator']

    @classmethod
    def _get_context(cls, *args, **kwargs):
        indicator_pk = kwargs.pop('indicator_pk', None)
        context = super()._get_context(*args, **kwargs)
        if indicator_pk:
            indicator_data = ProgramPageIndicatorSerializer.load_for_filters(
                filters={'pk': indicator_pk}, context=context).data
            context['indicator'] = indicator_data[0] if indicator_data and len(indicator_data) == 1 else None
        return context

    @classmethod
    def update_indicator_pk(cls, indicator_pk, program_pk):
        return cls(cls.get_queryset(pk=program_pk),
                   context=cls._get_context(program_pk=program_pk, indicator_pk=indicator_pk))

    def get_indicator(self, program):
        return self.context.get('indicator', None)

# Serializer for the Program Page updating one indicator's data (after configuring an indicator from the program page)
ProgramPageIndicatorUpdateSerializer = get_serializer(
    ProgramPageUpdateMixin,
    ProgramOrderingUpdateMixin,
    ProgramRFOrderingMixin,
    ProgramReportingPeriodMixin,
    ProgramBaseSerializerMixin
)

