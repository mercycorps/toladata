"""Partial serializers for Program objects which can be composited into a serializer for a specific use"""

import operator
from rest_framework import serializers
from django.utils import timezone
from django.utils.translation import ugettext as _
from indicators.models import (Indicator)
from indicators.serializers_new import (
    TierBaseSerializer,
    LevelBaseSerializer,
    IndicatorRFOrderingSerializer,
)
from workflow.models import Program
from workflow.serializers_new.period_serializers import PeriodDateRangeSerializer


class ProgramBaseSerializerMixin:
    """Program Serializer component to load and serialize base program data.

    JSON output corresponds to js/models/bareProgram
    """

    # 'using_results_framework' is an annotation provided by the non-standard Program queryset
    # managers (e.g. rf_aware_objects) defined on the Program model.
    results_framework = serializers.BooleanField(source='using_results_framework')

    class Meta:
        purpose = "Base"
        model = Program
        fields = [
            'pk',
            'name',
            'results_framework',
        ]

    # Class methods used to instantiate serializer with queryset and context to minimize queries

    @classmethod
    def _get_query_fields(cls):
        """Returns list of DB fields needed for included fields"""
        return ['pk', 'name', '_using_results_framework']

    @classmethod
    def get_queryset(cls, **kwargs):
        """Returns the specific queryset used to load this serializer for a specific program or programs

            Args:
                pk: pk in order to load for a specific program
                filters: dict of filters (i.e. {'pk__in': [5, 6, 7]}) to apply to queryset
        """
        queryset = Program.rf_aware_objects.select_related(None).prefetch_related(None).only(*cls._get_query_fields())
        pk = kwargs.get('pk', None)
        if pk is not None:
            return queryset.get(pk=pk)
        filters = kwargs.get('filters', {})
        return queryset.filter(**filters)

    @classmethod
    def _get_context(cls, **kwargs):
        """Returns dict containing extra context needed to serialize specified fields"""
        context = {}
        program_pk = kwargs.get('program_pk', None)
        if program_pk:
            context['program_pk'] = program_pk
        return context

    @classmethod
    def load_for_pk(cls, pk):
        """pk (int): Returns initialized serializer for a specified program pk"""
        return cls(cls.get_queryset(pk=pk), context=cls._get_context(program_pk=pk))


class ProgramReportingPeriodMixin:
    """Program Serializer component which serializes date information.

    JSON output corresponds to js/models/withReportingPeriod
    """

    reporting_period_start_iso = serializers.DateField(source='reporting_period_start')
    reporting_period_end_iso = serializers.DateField(source='reporting_period_end')

    class Meta:
        purpose = "ReportingPeriod"
        fields = [
            'start_date',
            'end_date',
            'reporting_period_start_iso',
            'reporting_period_end_iso',
            'percent_complete',
            'has_started'
        ]

    # Class method used to instantiate queryset with required fields (to minimize queries)
    @classmethod
    def _get_query_fields(cls):
        """Extends parent's list of DB fields needed for included fields"""
        return super()._get_query_fields() + [
            'start_date',
            'end_date',
            'reporting_period_start',
            'reporting_period_end'
        ]


class ProgramRFOrderingMixin:
    """Program Serializer component which serializes level and indicator pks in RF-aware order"""
    level_pks_level_order = serializers.SerializerMethodField()
    level_pks_chain_order = serializers.SerializerMethodField()
    indicator_pks_for_level = serializers.SerializerMethodField()
    unassigned_indicator_pks = serializers.SerializerMethodField()
    indicator_pks_level_order = serializers.SerializerMethodField()
    indicator_pks_chain_order = serializers.SerializerMethodField()
    by_result_chain = serializers.SerializerMethodField()

    class Meta:
        purpose = "RFOrderingAware"
        fields = [
            'level_pks_level_order',
            'level_pks_chain_order',
            'indicator_pks_for_level',
            'unassigned_indicator_pks',
            'indicator_pks_level_order',
            'indicator_pks_chain_order',
            'by_result_chain',
        ]
        _related_serializers = {
            'tiers': TierBaseSerializer,
            'levels': LevelBaseSerializer,
            'indicators': IndicatorRFOrderingSerializer
        }

    # Class method used to instantiate serializer with required context (to minimize queries)
    @classmethod
    def _get_context(cls, **kwargs):
        """extensible method to populate serializer context (and context of nested serializers)

            minimizes db calls as child serializers can fetch in memory objects from context instead of another db call
        """
        context = super()._get_context(**kwargs)
        program_pk = context['program_pk']
        context['tiers'] = cls.related_serializers['tiers'].load_for_program(program_pk, context=context).data
        context['levels'] = cls.related_serializers['levels'].load_for_program(program_pk, context=context).data
        context['indicators'] = cls.related_serializers['indicators'].load_for_program(
            program_pk, context=context).data
        return context

    # Serializer Method Field methods (populate fields for serializer):

    def get_level_pks_level_order(self, program):
        """Levels in level order is for the IPTT which first places levels, then indicators under them"""
        return [l['pk'] for l in self._get_levels_level_order(program)]

    def get_level_pks_chain_order(self, program):
        """Levels in chain order is for the IPTT which first places levels, then indicators under them"""
        return [l['pk'] for l in self._get_levels_chain_order(program)]

    def get_indicator_pks_for_level(self, program):
        """returns a list of levels serialized with only pk and a list of indicator_pks"""
        return [{
            'pk': level['pk'],
            'indicator_pks': [i['pk'] for i in self._sorted_indicators_for_level(program, level)],
            } for level in self._get_program_levels(program)]

    def get_unassigned_indicator_pks(self, program):
        return [i['pk'] for i in self._sorted_indicators_for_level(program, None)]

    def get_indicator_pks_level_order(self, program):
        """returns a list of pks, sorted by level in level order then indicator level_order (if RF) otherwise manual

            For the Program Page, which only sorts indicators, to simplify the JS sorting algorithm
        """
        levels = self._get_levels_level_order(program) if program.results_framework else []
        indicator_pks = [i['pk'] for level in levels
                         for i in self._sorted_indicators_for_level(program, level)]
        indicator_pks += self.get_unassigned_indicator_pks(program)
        return indicator_pks

    def get_indicator_pks_chain_order(self, program):
        """returns a list of pks, sorted by level in chain order then indicator level_order (if RF) otherwise manual

            For the Program Page, which only sorts indicators, to simplify the JS sorting algorithm
        """
        levels = self._get_levels_chain_order(program) if program.results_framework else []
        indicator_pks = [i['pk'] for level in levels
                         for i in self._sorted_indicators_for_level(program, level)]
        indicator_pks += self.get_unassigned_indicator_pks(program)
        return indicator_pks

    def get_by_result_chain(self, program):
        """returns "by Outcome chain" or "par chaîne Résultat" for labeling the ordering filter"""
        result_tier = [tier for tier in self._get_program_tiers(program) if tier['tier_depth'] == 2]
        if result_tier and len(result_tier) == 1:
            # Translators:  This labels how a list of levels is ordered.  Levels are part of a hierarchy and belong to one of ~six tiers.  Grouping by level means that Levels on the same tier but on different branches are gropued together.  Grouping by tier chain means levels are displayed with other levels in their same branch, as part of the natural hierarchy.
            return _('by %(tier)s chain') % {'tier': _(result_tier[0]['name'])}
        return None

    # Helper functions for serializer method fields:

    @property
    def _is_in_list(self):
        """Returns True if this serializer is instanced as part of a ListSerializer (many=True), False otherwise"""
        return hasattr(self, 'parent') and getattr(self.parent, 'many', False) and len(self.parent.instance) > 1

    def _get_program_tiers(self, program):
        """returns list of serialized tiers for a given program"""
        tiers = self.context.get('tiers', [])
        if self._is_in_list:
            return [tier for tier in tiers if tier['program_id'] == program.pk]
        return tiers

    def _get_program_levels(self, program):
        """returns list of serialized levels for a given program"""
        levels = self.context.get('levels', [])
        if self._is_in_list:
            return [level for level in levels if level['program_id'] == program.pk]
        return levels

    def _get_program_indicators(self, program):
        """returns list of serialized indicators for a given program"""
        indicators = self.context.get('indicators', [])
        if self._is_in_list:
            return [indicator for indicator in indicators if indicator['program_id'] == program.pk]
        return indicators

    def _get_levels_level_order(self, program):
        """returns levels sorted in level order (first by depth, then by parents' order, then by customsort)"""
        program_levels = self._get_program_levels(program)
        levels = []
        child_levels = [l for l in program_levels if l['parent_id'] is None]
        while child_levels:
            levels += child_levels
            child_levels = [l for parent in child_levels for l in program_levels if l['parent_id'] == parent['pk']]
        return levels

    def _get_levels_chain_order(self, program):
        """returns levels sorted in chain order (each parent and their children and their children)"""

        def get_level_children(parent, level_set):
            """recursively maps levels children and their children to produce a chain-sorted level list"""
            levels = []
            child_levels = [l for l in level_set if l['parent_id'] == (parent['pk'] if parent else None)]
            for child_level in child_levels:
                levels.append(child_level)
                levels += get_level_children(child_level, level_set)
            return levels

        return get_level_children(None, self._get_program_levels(program))

    def _sorted_indicators_for_level(self, program, level=None):
        """returns indicators for level sorted by their level_order"""
        if level is None:
            filt_func = lambda i: i['has_rf_level'] is False
        else:
            filt_func = lambda i: i['level_pk'] == level['pk']
        return sorted(filter(filt_func, self._get_program_indicators(program)), key=operator.itemgetter('level_order'))


class ProgramPeriodsForFrequencyMixin:
    """Program Serializer component which adds data for populating period-related pages (e.g. IPTT)"""

    frequencies = serializers.SerializerMethodField()
    period_date_ranges = serializers.SerializerMethodField()

    class Meta:
        purpose = "PeriodRanges"
        fields = [
            'frequencies',
            'period_date_ranges'
        ]

    # Serializer Method Field methods (populate fields for serializer):

    def get_frequencies(self, program):
        """Returns a list of frequencies for which the program has at least one indicator"""
        return sorted(set(i['target_frequency'] for i in self._get_program_indicators(program)
                          if i['target_frequency'] is not None))

    def get_period_date_ranges(self, program):
        """Returns a dict mapping all frequencies to serialized data for each period they correspond with"""
        now = self.context.get('now', timezone.now().date())
        return {frequency: PeriodDateRangeSerializer(list(program.get_periods_for_frequency(frequency)),
                                                     many=True, context={'frequency': frequency, 'now': now}).data
                for frequency, _ in Indicator.TARGET_FREQUENCIES if frequency != Indicator.EVENT}
