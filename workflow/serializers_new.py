# -*- coding: utf-8 -*-
import datetime
import operator
from rest_framework import serializers
from tola.l10n_utils import l10n_date_medium, l10n_date_long, l10n_monthname
from tola.model_utils import get_serializer
from workflow.models import Program, SiteProfile
from indicators.models import Indicator, LevelTier, Level, Result, IndicatorType, Sector
from indicators.serializers_new import (
    ProgramPageIndicatorSerializer,
    ProgramPageIndicatorUpdateSerializer,
    RFLevelOrderingLevelSerializer,
    IPTTLevelSerializer,
    IPTTTierSerializer,
    IPTTIndicatorSerializer,
)
from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext as _


class ProgramBase(object):
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
            if hasattr(program, 'prefetch_leveltiers'):
                tiers = [tier for tier in program.prefetch_leveltiers if tier.tier_depth == 2]
                return tiers[0].name if tiers else False
            elif hasattr(program, 'prefetch_tiers'):
                tiers = [tier for tier in program.prefetch_tiers if tier.tier_depth == 2]
                return tiers[0].name if tiers else False
            else:
                tier = program.level_tiers.filter(tier_depth=2).first()
                return tier.name if tier else False
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
        return getattr(program, 'prefetch_tiers', program.level_tiers.order_by('tier_depth'))

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
                key=lambda i: (i.sort_number is None, i.sort_number)
                ),
            key=lambda i: (i.old_level_pk is None, i.old_level_pk)
        )

ProgramBaseSerializer = get_serializer(ProgramBase)


class ProgramReportingPeriodMixin(object):
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
        return super(ProgramReportingPeriodMixin, cls)._get_query_fields() + [
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


ProgramReportingPeriodSerializer = get_serializer(ProgramReportingPeriodMixin, ProgramBase)


class ProgramLevelOrderingMixin(object):
    """Extends program serializer to include a list of indicator pks in level order and chain order"""
    indicator_pks_level_order = serializers.SerializerMethodField()
    indicator_pks_chain_order = serializers.SerializerMethodField()

    class Meta:
        fields = [
            'indicator_pks_level_order',
            'indicator_pks_chain_order'
        ]

    def _get_indicators_for_ordering(self, program):
        return Indicator.rf_aware_objects.filter(program_id=program.pk)

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


ProgramLevelOrderingProgramSerializer = get_serializer(
    ProgramLevelOrderingMixin,
    ProgramBase
)


class RFLevelOrderingMixin(object):
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

    def _get_indicators_for_ordering(self, program):
        return getattr(program, 'prefetch_indicators',
                       Indicator.rf_aware_objects.filter(program_id=program.pk))

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


RFLevelOrderingProgramSerializer = get_serializer(
    RFLevelOrderingMixin,
    ProgramBase
)


class ProgramLevelUpdateMixin(object):
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
            models.Prefetch(
                'level_tiers',
                queryset=LevelTier.objects.select_related(None).only(
                    'pk', 'name', 'program_id', 'tier_depth'
                ),
                to_attr='prefetch_leveltiers'
            ),
            models.Prefetch(
                'levels',
                queryset=Level.objects.select_related(None).only(
                    'pk', 'name', 'parent_id', 'customsort', 'program_id'
                ),
                to_attr='prefetch_levels'
            )
        ).get(pk=pk)
        return cls(program)


ProgramLevelUpdateSerializer = get_serializer(
    ProgramLevelUpdateMixin,
    RFLevelOrderingMixin,
    ProgramBase
)


class ProgramPageMixin(object):
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
            models.Prefetch(
                'level_tiers',
                queryset=LevelTier.objects.select_related(None).only(
                    'pk', 'name', 'program_id', 'tier_depth'
                ),
                to_attr='prefetch_leveltiers'
            ),
            models.Prefetch(
                'levels',
                queryset=Level.objects.select_related(None).only(
                    'pk', 'name', 'parent_id', 'customsort', 'program_id'
                ),
                to_attr='prefetch_levels'
            )
        ).get(pk=pk)
        return cls(program)

    def _get_indicators_for_ordering(self, program):
        return getattr(
            program, 'program_page_indicators',
            super(ProgramPageMixin, self)._get_indicators_for_ordering(program)
            )

    def _get_program_levels(self, program):
        return sorted(
            getattr(
                program, 'prefetch_levels',
                super(ProgramPageMixin, self)._get_program_levels(program)
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


ProgramPageProgramSerializer = get_serializer(
    ProgramPageMixin,
    ProgramLevelOrderingMixin,
    ProgramReportingPeriodMixin,
    ProgramBase
)

class ProgramPageUpdateMixin(object):
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
            models.Prefetch(
                'level_tiers',
                queryset=LevelTier.objects.select_related(None).only(
                    'pk', 'name', 'program_id', 'tier_depth'
                ),
                to_attr='prefetch_leveltiers'
            ),
            models.Prefetch(
                'levels',
                queryset=Level.objects.select_related(None).only(
                    'pk', 'name', 'parent_id', 'customsort', 'program_id'
                ),
                to_attr='prefetch_levels'
            )
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
            models.Prefetch(
                'level_tiers',
                queryset=LevelTier.objects.select_related(None).only(
                    'pk', 'name', 'program_id', 'tier_depth'
                ),
                to_attr='prefetch_leveltiers'
            ),
            models.Prefetch(
                'levels',
                queryset=Level.objects.select_related(None).only(
                    'pk', 'name', 'parent_id', 'customsort', 'program_id'
                ),
                to_attr='prefetch_levels'
            )
        ).get(pk=pk)
        return cls(program)

    def _get_program_levels(self, program):
        return sorted(
            getattr(
                program, 'prefetch_levels',
                super(ProgramPageUpdateMixin, self)._get_program_levels(program)
                ), key=operator.attrgetter('customsort')
            )

    def _get_indicators_for_ordering(self, program):
        return getattr(
            program, 'ordering_indicators',
            super(ProgramPageUpdateMixin, self)._get_indicators_for_ordering(program)
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

class PeriodDateRangeSerializer(serializers.Serializer):
    start = serializers.DateField()
    end = serializers.DateField()
    name = serializers.SerializerMethodField()
    label = serializers.CharField()
    start_label = serializers.SerializerMethodField()
    end_label = serializers.SerializerMethodField()
    past = serializers.SerializerMethodField()
    year = serializers.SerializerMethodField()

    def get_start_label(self, period):
        return l10n_date_medium(period['start'])

    def get_end_label(self, period):
        return l10n_date_medium(period['end'])

    def get_past(self, period):
        return period['start'] < timezone.now().date()

    def get_name(self, period):
        if self.context.get('frequency') == 7:
            return l10n_monthname(period['start'], decode=True)
        return _(period['name'])

    def get_year(self, period):
        return period['start'].year

class ProgramPeriodsMixin(object):
    frequencies = serializers.SerializerMethodField()
    period_date_ranges = serializers.SerializerMethodField()

    class Meta:
        fields = [
            'frequencies',
            'period_date_ranges'
        ]

    def get_frequencies(self, program):
        return sorted(set(
            [i.target_frequency for i in self._get_program_indicators(program)
             if i.target_frequency is not None]))


    def get_period_date_ranges(self, program):
        return {
            frequency: PeriodDateRangeSerializer(
                list(program.get_periods_for_frequency(frequency)),
                many=True, context={'frequency': frequency}
            ).data
            for frequency, _ in Indicator.TARGET_FREQUENCIES if frequency != Indicator.EVENT
        }


class IPTTQSMixin(object):

    class Meta:
        override_fields = True
        fields = [
            'pk',
            'name',
            'start_date',
            'end_date',
            'reporting_period_start_iso',
            'reporting_period_end_iso',
            'has_started',
            'frequencies',
            'period_date_ranges'
        ]

    @classmethod
    def _get_query_fields(cls):
        return ['pk', 'name', 'reporting_period_start', 'reporting_period_end', 'start_date', 'end_date']

    @classmethod
    def load_for_user(cls, user):
        return cls.load_for_pks(user.tola_user.available_programs.filter(
            funding_status="Funded",
            reporting_period_start__isnull=False, reporting_period_end__isnull=False
        ).values_list('id', flat=True))

    @classmethod
    def load_for_pks(cls, pks):
        programs = Program.rf_aware_objects.only(
            *cls._get_query_fields()
        ).prefetch_related(
            models.Prefetch(
                'indicator_set',
                queryset=Indicator.objects.order_by().select_related(None).prefetch_related(None).only(
                    'pk', 'program_id', 'target_frequency'
                ).filter(program_id__in=pks),
                to_attr='prefetch_indicators'
            )
        ).filter(pk__in=pks)
        return cls(programs, many=True)

    def get_period_date_ranges(self, program):
        return {
            frequency: PeriodDateRangeSerializer(list(program.get_periods_for_frequency(frequency)), many=True).data
            for frequency, _ in Indicator.TARGET_FREQUENCIES if frequency != Indicator.EVENT
        }


IPTTQSProgramSerializer = get_serializer(
    IPTTQSMixin,
    ProgramPeriodsMixin,
    ProgramReportingPeriodMixin,
    ProgramBase
)

class IPTTProgramLevelsMixin(object):
    levels = serializers.SerializerMethodField()

    class Meta:
        fields = [
            'levels'
        ]

    def get_levels(self, program):
        levels = self._get_program_levels(program)
        return IPTTLevelSerializer(
            levels,
            context={
                'levels': levels,
                'tiers': self._get_program_tiers(program),
                'indicators': self._get_program_indicators(program)
            },
            many=True).data


IPTTProgramLevelSerializer = get_serializer(
    IPTTProgramLevelsMixin,
    ProgramBase
)

class IPTTProgramFilterItemsMixin(object):
    result_chain_label = serializers.SerializerMethodField()
    tiers = serializers.SerializerMethodField()
    sectors = serializers.SerializerMethodField()
    indicator_types = serializers.SerializerMethodField()
    sites = serializers.SerializerMethodField()
    old_levels = serializers.SerializerMethodField()

    class Meta:
        fields = [
            'result_chain_label',
            'tiers',
            'sectors',
            'indicator_types',
            'sites',
            'old_levels'
        ]

    def get_result_chain_label(self, program):
        """returns "Outcome Chain" or "Chaîne Résultat" for labeling the ordering filter"""
        tier_name = self._get_result_tier(program)
        if tier_name:
            return _('%(tier)s Chain') % {'tier': _(tier_name)}
        return None

    def get_tiers(self, program):
        return IPTTTierSerializer(self._get_program_tiers(program), many=True).data

    def _get_program_indicator_types(self, program):
        if hasattr(self, 'context') and 'indicator_types' in self.context:
            return self.context['indicator_types']
        return IndicatorType.objects.filter(indicator__program=program).values('pk', 'indicator_type')

    def _get_program_sectors(self, program):
        if hasattr(self, 'context') and 'sectors' in self.context:
            return self.context['sectors']
        return Sector.objects.filter(indicator__program=program).values('pk', 'sector')

    def _get_program_sites(self, program):
        if hasattr(self, 'context') and 'sites' in self.context:
            return self.context['sites']
        return SiteProfile.objects.filter(result__indicator__program=program).values('pk', 'name')

    def get_sectors(self, program):
        return sorted({
            v['pk']: v for v in [{'pk': sector['pk'], 'name': sector['sector']}
                for sector in self._get_program_sectors(program)]
            }.values(), key=operator.itemgetter('name'))

    def get_indicator_types(self, program):
        return sorted({
            v['pk']: v for v in [{'pk': indicator_type['pk'], 'name': indicator_type['indicator_type']}
                                 for indicator_type in self._get_program_indicator_types(program)]
            }.values(), key=operator.itemgetter('name'))

    def get_sites(self, program):
        return sorted({
            v['pk']: v for v in [{'pk': site['pk'], 'name': site['name']} for site in self._get_program_sites(program)]
        }.values(), key=operator.itemgetter('name'))

    def get_old_levels(self, program):
        if program.results_framework:
            return []
        old_level_pks = {name: pk for (pk, name) in Indicator.OLD_LEVELS}
        return sorted([{'pk': old_level_pks[name], 'name': _(name)} for name in set(
            i.old_level for i in self._get_program_indicators(program) if i.old_level)], key=operator.itemgetter('pk'))


class IPTTMixin(object):
    indicators = serializers.SerializerMethodField()

    class Meta:
        fields = [
            'indicators'
        ]

    @classmethod
    def get_for_pk(cls, program_pk):
        program = Program.rf_aware_objects.select_related(None).prefetch_related(None).only(
            *cls._get_query_fields()
        ).prefetch_related(
            models.Prefetch(
                'indicator_set',
                queryset=Indicator.rf_aware_objects.select_related(None).prefetch_related(None).only(
                    'pk', 'name', 'deleted', 'program_id', 'means_of_verification', 'level_id', 'level_order',
                    'number', 'target_frequency', 'unit_of_measure', 'unit_of_measure_type', 'baseline', 'baseline_na',
                    'direction_of_change', 'is_cumulative', 'key_performance_indicator', 'old_level',
                    'create_date', 'sector_id'
                ),
                to_attr='prefetch_indicators'
            ),
            models.Prefetch(
                'level_tiers',
                queryset=LevelTier.objects.select_related(None).only(
                    'pk', 'name', 'program_id', 'tier_depth'
                ),
                to_attr='prefetch_tiers'
            ),
            models.Prefetch(
                'levels',
                queryset=Level.objects.select_related(None).only(
                    'pk', 'name', 'parent_id', 'customsort', 'program_id'
                ),
                to_attr='prefetch_levels'
            ),
        ).get(pk=program_pk)
        context = {
            'indicator_types': IndicatorType.objects.select_related(None).prefetch_related(None).filter(
                indicator__program_id=program_pk
            ).order_by('indicator_type').values('pk', 'indicator_type', 'indicator__pk'),
            'sites': SiteProfile.objects.select_related(None).prefetch_related(None).filter(
                result__indicator__program_id=program_pk
            ).order_by('name').values('pk', 'name', 'result__indicator__pk'),
            'sectors': Sector.objects.select_related(None).prefetch_related(None).filter(
                indicator__program_id=program_pk
            ).order_by('sector').values('pk', 'sector', 'indicator__pk')
        }
        return cls(program, context=context)

    def get_indicators(self, program):
        indicators = self._get_program_indicators(program)
        return IPTTIndicatorSerializer(indicators, context=self.context, many=True).data


IPTTProgramSerializer = get_serializer(
    IPTTMixin,
    IPTTProgramFilterItemsMixin,
    IPTTProgramLevelsMixin,
    ProgramPeriodsMixin,
    RFLevelOrderingMixin,
    ProgramReportingPeriodMixin,
    ProgramBase
)