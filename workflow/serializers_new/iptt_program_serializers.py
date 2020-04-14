import operator
from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext as _
from rest_framework import serializers
from workflow.models import (
    Program,
    SiteProfile,
)
from indicators.models import (
    Indicator,
    PeriodicTarget,
    IndicatorType,
    Sector,
    DisaggregationType,
    DisaggregationLabel,
)
from indicators.serializers_new import (
    IPTTLevelSerializer,
    IPTTExcelLevelSerializer,
    IPTTTierSerializer,
    IPTTIndicatorSerializer,
)
from .base_program_serializers import (
    ProgramBase,
    ProgramReportingPeriodMixin,
    RFLevelOrderingMixin,
    ProgramPeriodsMixin,
)
from tola.model_utils import get_serializer
from .period_serializers import QSPeriodDateRangeSerializer



class IPTTQSMixin:
    """Serializer for a program to populate the IPTT Quickstart selection screen"""

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
        return cls.load_for_pks(user.tola_user.available_programs.annotate(
            targets_exist=models.Exists(
                PeriodicTarget.objects.filter(
                    indicator__program=models.OuterRef('pk')
                )
            )
        ).filter(
            funding_status="Funded",
            targets_exist=True,
            reporting_period_start__isnull=False, reporting_period_end__isnull=False
        ).values_list('id', flat=True))

    @classmethod
    def load_for_pks(cls, pks):
        now = timezone.now().date()
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
        return cls(programs, many=True, context={'now': now})

    def get_period_date_ranges(self, program):
        return {
            frequency: QSPeriodDateRangeSerializer(
                list(program.get_short_form_periods_for_frequency(frequency)), many=True,
                context={'frequency': frequency, 'now': self.context.get('now', timezone.now().date())}).data
            for frequency, _ in Indicator.TARGET_FREQUENCIES if frequency not in [
                Indicator.EVENT, Indicator.LOP, Indicator.MID_END
            ]
        }


IPTTQSProgramSerializer = get_serializer(
    IPTTQSMixin,
    ProgramPeriodsMixin,
    ProgramReportingPeriodMixin,
    ProgramBase
)


class IPTTProgramLevelsMixin:
    """Serializer to populate levels for IPTT display (web/excel)"""
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


class IPTTProgramFilterItemsMixin:
    """Serializer to populate the filter panel for an IPTT program on initial load (not report data)"""
    result_chain_label = serializers.SerializerMethodField()
    tiers = serializers.SerializerMethodField()
    sectors = serializers.SerializerMethodField()
    indicator_types = serializers.SerializerMethodField()
    sites = serializers.SerializerMethodField()
    disaggregations = serializers.SerializerMethodField()
    old_levels = serializers.SerializerMethodField()

    class Meta:
        fields = [
            'result_chain_label',
            'tiers',
            'sectors',
            'indicator_types',
            'sites',
            'disaggregations',
            'old_levels',
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

    def _get_program_disaggregations(self, program):
        if hasattr(self, 'context') and 'disaggregations' in self.context:
            return self.context['disaggregations']
        return DisaggregationType.objects.filter(indicator__program=program).values(
            'pk', 'disaggregation_type', 'standard', 'country__country'
        )

    def _get_program_disaggregation_labels(self, program):
        if hasattr(self, 'context') and 'disaggregation_labels' in self.context:
            return self.context['disaggregation_labels']
        return DisaggregationLabel.objects.filter(
            disaggregation_type__indicator__program=program
        ).values('pk', 'disaggregation_type_id', 'label', 'customsort')

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

    def get_disaggregations(self, program):
        labels = [{'pk': l['pk'], 'name': l['label'],
                   'customsort': l['customsort'], 'disaggregation': l['disaggregation_type_id']}
                  for l in self._get_program_disaggregation_labels(program)]
        return sorted({
            v['pk']: v for v in [
                {'pk': disaggregation['pk'], 'name': disaggregation['disaggregation_type'],
                 'country': None if disaggregation['standard'] else disaggregation['country__country'],
                 'labels': [label for label in labels if label['disaggregation'] == disaggregation['pk']]}
                for disaggregation in self._get_program_disaggregations(program)
            ]
        }.values(), key=operator.itemgetter('name'))

    def get_old_levels(self, program):
        if program.results_framework:
            return []
        old_level_pks = {name: pk for (pk, name) in Indicator.OLD_LEVELS}
        return sorted([{'pk': old_level_pks[name], 'name': _(name)} for name in set(
            i.old_level for i in self._get_program_indicators(program) if i.old_level)], key=operator.itemgetter('pk'))


class IPTTIndicatorsMixin:
    """Serializer to populate Indicator items for a program (not report data, all other indicator data)"""
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
            cls._get_leveltiers_prefetch(),
            cls._get_levels_prefetch(),
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
            ).order_by('sector').values('pk', 'sector', 'indicator__pk'),
            'disaggregations': DisaggregationType.objects.select_related(None).prefetch_related(None).filter(
                indicator__program_id=program_pk
            ).order_by('disaggregation_type').values(
                'pk', 'disaggregation_type', 'indicator__pk', 'standard', 'country__country'
            ),
            'disaggregation_labels': DisaggregationLabel.objects.select_related(None).prefetch_related(None).filter(
                disaggregation_type__indicator__program_id=program_pk
            ).order_by('customsort').values('pk', 'disaggregation_type_id', 'label', 'customsort').distinct(),
            'now': timezone.now().date()
        }
        return cls(program, context=context)

    def get_indicators(self, program):
        indicators = self._get_program_indicators(program)
        return IPTTIndicatorSerializer(indicators, context=self.context, many=True).data


# Web view only currently:
IPTTProgramSerializer = get_serializer(
    IPTTIndicatorsMixin,
    IPTTProgramFilterItemsMixin,
    IPTTProgramLevelsMixin,
    ProgramPeriodsMixin,
    RFLevelOrderingMixin,
    ProgramReportingPeriodMixin,
    ProgramBase
)


class IPTTExcelMixin:
    levels = serializers.SerializerMethodField()
    
    class Meta:
        fields = [
            'levels',
        ]

    @classmethod
    def get_for_pk(cls, program_pk, context={}):
        program = Program.rf_aware_objects.select_related(None).prefetch_related(None).only(
            *cls._get_query_fields()
        ).get(pk=program_pk)
        return cls(program, context=context)

    def _get_program_levels(self, program):
        return self.context.get('levels', [])

    def _get_program_tiers(self, program):
        return self.context.get('tiers', [])
   
    def get_levels(self, program):
        level_context = {
            'levels': self._get_program_levels(program),
            'tiers': self._get_program_tiers(program)
        }
        if self.context.get('level_order', False):
            return [IPTTExcelLevelSerializer(level, context=level_context) for level in self._get_levels_level_order(program)]
        else:
            return [IPTTExcelLevelSerializer(level, context=level_context) for level in self._get_levels_chain_order(program)]

IPTTExcelProgramSerializer = get_serializer(
    IPTTExcelMixin,
    ProgramReportingPeriodMixin,
    ProgramBase
)