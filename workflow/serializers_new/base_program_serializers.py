import datetime
import operator
from rest_framework import serializers
from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext as _
from indicators.models import (
    Indicator,
    LevelTier,
    Level
)
from indicators.serializers_new import (
    RFLevelOrderingLevelSerializer,
)
from workflow.models import Program
from workflow.serializers_new.period_serializers import PeriodDateRangeSerializer


class ProgramBase:
    """Base class for serialized program data.  Corresponds to js/models/bareProgram"""
    results_framework = serializers.BooleanField(source='using_results_framework')
    by_result_chain = serializers.SerializerMethodField()

    class Meta:
        model = Program
        fields = [
            'pk',
            'name',
            'results_framework',
            'by_result_chain',
        ]

    @classmethod
    def _get_query_fields(cls):
        return ['pk', 'name', '_using_results_framework', 'auto_number_indicators']

    def _get_result_tier(self, program):
        if program.using_results_framework:
            tiers = [tier for tier in self._get_program_tiers(program) if tier.tier_depth == 2]
            return tiers[0].name if tiers else False
        return None

    def get_by_result_chain(self, program):
        """returns "by Outcome chain" or "par chaîne Résultat" for labeling the ordering filter"""
        tier_name = self._get_result_tier(program)
        if tier_name:
            return _('by %(tier)s chain') % {'tier': _(tier_name)}
        return None

    def _get_program_indicators(self, program):
        return getattr(program, 'prefetch_indicators', Indicator.rf_aware_objects.filter(program=program))

    def _get_program_levels(self, program):
        return getattr(program, 'prefetch_levels', program.levels.order_by('customsort'))

    def _get_program_tiers(self, program):
        return getattr(program, 'prefetch_leveltiers', program.level_tiers.order_by('tier_depth'))

    def _get_levels_level_order(self, program):
        """returns levels sorted in level order (first by depth, then by parents' order, then by customsort)"""
        program_levels = self._get_program_levels(program)
        levels = []
        parents = [None]
        child_levels = [l for l in program_levels if l.parent_id is None]
        while child_levels:
            levels += child_levels
            parents = child_levels
            child_levels = [l for parent in parents for l in program_levels if l.parent_id == parent.pk]
        return levels

    def _get_level_children(self, parent, level_set):
        """recursively maps levels children and their children to produce a chain-sorted level list"""
        levels = []
        child_levels = [l for l in level_set if l.parent_id == (parent.pk if parent else None)]
        for child_level in child_levels:
            levels.append(child_level)
            levels += self._get_level_children(child_level, level_set)
        return levels

    def _get_levels_chain_order(self, program):
        """returns levels sorted in chain order (each parent and their children and their children)"""
        program_levels = self._get_program_levels(program)
        levels = self._get_level_children(None, program_levels)
        return levels

    def _get_unassigned_indicators(self, indicator_set):
        return sorted(
            sorted(
                [i for i in indicator_set if i.level_id is None or i.results_framework is False],
                key=lambda i: i.sort_number
                ),
            key=lambda i: (i.old_level_pk is None, i.old_level_pk)
        )


class ProgramReportingPeriodMixin:
    """Extends the base program serializer to include date information, corresponds to js/models/withReportingPeriod"""
    reporting_period_start_iso = serializers.DateField(source='reporting_period_start')
    reporting_period_end_iso = serializers.DateField(source='reporting_period_end')
    percent_complete = serializers.SerializerMethodField()
    has_started = serializers.SerializerMethodField()

    class Meta:
        fields = [
            'start_date',
            'end_date',
            'reporting_period_start_iso',
            'reporting_period_end_iso',
            'percent_complete',
            'has_started'
        ]

    @classmethod
    def _get_query_fields(cls):
        return super()._get_query_fields() + [
            'start_date',
            'end_date',
            'reporting_period_start',
            'reporting_period_end'
        ]

    def get_percent_complete(self, program):
        if program.reporting_period_end is None or program.reporting_period_start is None:
            return -1 # otherwise the UI might show "None% complete"
        if program.reporting_period_start > datetime.datetime.utcnow().date():
            return 0
        total_days = (program.reporting_period_end - program.reporting_period_start).days
        complete = (datetime.datetime.utcnow().date() - program.reporting_period_start).days
        return int(round(float(complete)*100/total_days)) if complete < total_days else 100

    def get_has_started(self, program):
        return program.reporting_period_start and program.reporting_period_start <= datetime.date.today()


class LevelsMixin:
    @classmethod
    def _get_leveltiers_prefetch(cls):
        return models.Prefetch(
            'level_tiers',
            queryset=LevelTier.objects.select_related(None).prefetch_related(None).only(
                'pk', 'name', 'program_id', 'tier_depth',
            ),
            to_attr='prefetch_leveltiers'
        )

    @classmethod
    def _get_levels_prefetch(cls):
        return models.Prefetch(
            'levels',
            queryset=Level.objects.select_related(None).prefetch_related(None).only(
                'pk', 'name', 'parent_id', 'customsort', 'program_id'
            ),
            to_attr='prefetch_levels'
        )

    def _get_indicators_for_ordering(self, program):
        return getattr(program, 'prefetch_indicators',
                       Indicator.rf_aware_objects.filter(program_id=program.pk))


class ProgramLevelOrderingMixin(LevelsMixin):
    """Extends program serializer to include a list of indicator pks in level order and chain order"""
    indicator_pks_level_order = serializers.SerializerMethodField()
    indicator_pks_chain_order = serializers.SerializerMethodField()

    class Meta:
        fields = [
            'indicator_pks_level_order',
            'indicator_pks_chain_order'
        ]


    def get_indicator_pks_level_order(self, program):
        """returns a list of pks, sorted by level in level order then indicator level_order (if RF) otherwise manual"""
        indicator_pks = []
        indicators = self._get_indicators_for_ordering(program)
        levels = self._get_levels_level_order(program) if program.results_framework else []
        for level in levels:
            indicator_pks += [i.pk for i in sorted(
                indicators, key=operator.attrgetter('level_order')
                ) if i.level_id == level.pk]
        indicator_pks += [i.pk for i in self._get_unassigned_indicators(indicators)]
        return indicator_pks

    def get_indicator_pks_chain_order(self, program):
        """returns a list of pks, sorted by level in chain order then indicator level_order (if RF) otherwise manual"""
        indicator_pks = []
        indicators = self._get_indicators_for_ordering(program)
        levels = self._get_levels_chain_order(program) if program.results_framework else []
        for level in levels:
            indicator_pks += [i.pk for i in sorted(
                indicators, key=operator.attrgetter('level_order')
                ) if i.level_id == level.pk]
        indicator_pks += [i.pk for i in self._get_unassigned_indicators(indicators)]
        return indicator_pks


class RFLevelOrderingMixin(LevelsMixin):
    """Extends program serializer to include a list of level pks in level order and chain order

        also adds serialized level data to program for IPTT Report
    """
    level_pks_level_order = serializers.SerializerMethodField()
    level_pks_chain_order = serializers.SerializerMethodField()
    indicator_pks_for_level = serializers.SerializerMethodField()
    unassigned_indicator_pks = serializers.SerializerMethodField()

    class Meta:
        fields = [
            'level_pks_level_order',
            'level_pks_chain_order',
            'indicator_pks_for_level',
            'unassigned_indicator_pks'
        ]

    def get_level_pks_level_order(self, program):
        return [l.pk for l in self._get_levels_level_order(program)]

    def get_level_pks_chain_order(self, program):
        return [l.pk for l in self._get_levels_chain_order(program)]

    def get_indicator_pks_for_level(self, program):
        context = {'indicators': self._get_indicators_for_ordering(program)}
        return RFLevelOrderingLevelSerializer(
            self._get_program_levels(program), context=context, many=True
            ).data

    def get_unassigned_indicator_pks(self, program):
        return [i.pk for i in self._get_unassigned_indicators(self._get_indicators_for_ordering(program))]


class ProgramPeriodsMixin:
    frequencies = serializers.SerializerMethodField()
    period_date_ranges = serializers.SerializerMethodField()

    class Meta:
        fields = [
            'frequencies',
            'period_date_ranges'
        ]

    def get_frequencies(self, program):
        return sorted(
            set(i.target_frequency for i in self._get_program_indicators(program) if i.target_frequency is not None)
        )

    def get_period_date_ranges(self, program):
        return {
            frequency: PeriodDateRangeSerializer(
                list(program.get_periods_for_frequency(frequency)),
                many=True, context={'frequency': frequency, 'now': self.context.get('now', timezone.now().date())}
            ).data
            for frequency, _ in Indicator.TARGET_FREQUENCIES if frequency != Indicator.EVENT
        }
