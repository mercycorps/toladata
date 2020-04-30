import operator
from collections import defaultdict
from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext as _
from rest_framework import serializers
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
    IPTTJSONIndicatorLabelsSerializer,
)
from workflow.models import (
    Program,
    SiteProfile,
)
from workflow.serializers_new.base_program_serializers import (
    ProgramBaseSerializerMixin,
    ProgramReportingPeriodMixin,
    ProgramRFOrderingMixin,
    ProgramPeriodsForFrequencyMixin,
)
from workflow.serializers_new.period_serializers import QSPeriodDateRangeSerializer
from tola.model_utils import get_serializer


class IPTTQSMixin:
    """Serializer for a program to populate the IPTT Quickstart selection screen"""
    frequencies = serializers.SerializerMethodField()
    period_date_ranges = serializers.SerializerMethodField()

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
    def _get_context(cls, *args, **kwargs):
        context = super()._get_context(*args, **kwargs)
        context['now'] = timezone.now().date()
        return context

    @classmethod
    def load_for_user(cls, user):
        return cls.load_for_pks(user.tola_user.available_programs.annotate(
            targets_exist=models.Exists(PeriodicTarget.objects.filter(indicator__program=models.OuterRef('pk')))
        ).filter(
            funding_status="Funded",
            targets_exist=True,
            reporting_period_start__isnull=False, reporting_period_end__isnull=False
        ).values_list('id', flat=True))

    @classmethod
    def load_for_pks(cls, pks):
        queryset = cls.get_queryset(filters={'pk__in': pks})
        annotations = {
            f'frequency_{frequency}_indicators_exist': models.Exists(
                Indicator.objects.select_related(None).prefetch_related(None).filter(
                    deleted__isnull=True, program=models.OuterRef('pk'), target_frequency=frequency,
                ).only('pk', 'program_id', 'target_frequency')) for frequency, x in Indicator.TARGET_FREQUENCIES
        }
        queryset = queryset.annotate(**annotations)
        return cls(queryset, context=cls._get_context(), many=True)

    def get_frequencies(self, program):
        return [frequency for frequency, x in Indicator.TARGET_FREQUENCIES
                if getattr(program, f'frequency_{frequency}_indicators_exist', False)]

    def get_period_date_ranges(self, program):
        now = self.context.get('now', timezone.now().date())
        return {
            frequency: QSPeriodDateRangeSerializer(
                list(program.get_short_form_periods_for_frequency(frequency)),
                many=True, context={'frequency': frequency, 'now': now}
            ).data for frequency in Indicator.REGULAR_TARGET_FREQUENCIES
        }


IPTTQSProgramSerializer = get_serializer(
    IPTTQSMixin,
    ProgramReportingPeriodMixin,
    ProgramBaseSerializerMixin
)


class IPTTProgramFilterItemsMixin:
    """Serializer to populate the filter panel for an IPTT program on initial load (not report data)"""
    result_chain_label = serializers.SerializerMethodField()
    levels = serializers.SerializerMethodField()
    tiers = serializers.SerializerMethodField()
    sectors = serializers.SerializerMethodField()
    indicator_types = serializers.SerializerMethodField()
    sites = serializers.SerializerMethodField()
    disaggregations = serializers.SerializerMethodField()
    old_levels = serializers.SerializerMethodField()
    _level_serializer = IPTTLevelSerializer

    class Meta:
        fields = [
            'result_chain_label',
            'levels',
            'tiers',
            'sectors',
            'indicator_types',
            'sites',
            'disaggregations',
            'old_levels',
        ]

    @classmethod
    def _get_context(cls, *args, **kwargs):
        context = super()._get_context(*args, **kwargs)
        program_pk = context['program_pk']
        context['indicator_types'] = IndicatorType.objects.select_related(None).prefetch_related(None).filter(
                indicator__program_id=program_pk
        ).order_by('indicator_type').distinct().values_list('pk', 'indicator_type')
        context['sites'] = SiteProfile.objects.select_related(None).prefetch_related(None).filter(
            result__indicator__program_id=program_pk
        ).order_by('name').distinct().values_list('pk', 'name')
        context['sectors'] = Sector.objects.select_related(None).prefetch_related(None).filter(
            indicator__program_id=program_pk
        ).order_by('sector').distinct().values_list('pk', 'sector')
        context['disaggregations'] = DisaggregationType.objects.select_related('country').filter(
            indicator__program_id=program_pk, is_archived=False,
        ).order_by('standard', 'disaggregation_type').distinct().prefetch_related(
            models.Prefetch('disaggregationlabel_set',
                            queryset=DisaggregationLabel.objects.select_related(None).order_by('customsort').only(
                                'pk', 'label', 'customsort', 'disaggregation_type_id'),
                            to_attr='prefetch_categories')
        ).only('pk', 'disaggregation_type', 'country__country', 'standard')
        context['now'] = timezone.now().date()
        return context

    def get_result_chain_label(self, program):
        """returns "Outcome Chain" or "Chaîne Résultat" for labeling the ordering filter"""
        result_tier = [tier for tier in self._get_program_tiers(program) if tier['tier_depth'] == 2]
        if result_tier and len(result_tier) == 1:
            return _('%(tier)s Chain') % {'tier': _(result_tier[0]['name'])}
        return None

    def get_levels(self, program):
        return self.context.get('levels', [])

    def get_tiers(self, program):
        return self.context.get('tiers', [])

    def get_sectors(self, program):
        return list(map(lambda sect: {'pk': sect[0], 'name': sect[1]}, self.context['sectors']))

    def get_indicator_types(self, program):
        return list(map(lambda i_t: {'pk': i_t[0], 'name': i_t[1]}, self.context['indicator_types']))

    def get_sites(self, program):
        return list(map(lambda site: {'pk': site[0], 'name': site[1]}, self.context['sites']))

    def get_disaggregations(self, program):
        return list(map(
            lambda dt: {'pk': dt.pk, 'name': dt.disaggregation_type, 'country': dt.country.country if dt.country else None,
                        'labels': [{'pk': label.pk, 'name': label.label} for label in dt.prefetch_categories]},
            self.context['disaggregations']))

    def get_old_levels(self, program):
        if program.results_framework:
            return []
        return sorted(
            [{'pk': x[0], 'name': x[1]} for x in set([(i['level_pk'], i['old_level_name'])
                for i in self._get_program_indicators(program) if i['old_level_name']])],
            key=operator.itemgetter('pk'))


class IPTTIndicatorsMixin:
    """Serializer to populate Indicator items for a program (not report data, all other indicator data)"""
    indicators = serializers.SerializerMethodField()
    _indicator_serializer = IPTTJSONIndicatorLabelsSerializer

    class Meta:
        fields = [
            'indicators'
        ]

    def get_indicators(self, program):
        indicators = self._get_program_indicators(program)
        return indicators


# Main serializer for labels, filters, and program data for the IPTT (Web/JSON):
IPTTProgramSerializer = get_serializer(
    IPTTIndicatorsMixin,
    IPTTProgramFilterItemsMixin,
    ProgramPeriodsForFrequencyMixin,
    ProgramRFOrderingMixin,
    ProgramReportingPeriodMixin,
    ProgramBaseSerializerMixin
)


class IPTTExcelMixin:
    levels = serializers.SerializerMethodField()
    _level_serializer = IPTTLevelSerializer

    class Meta:
        fields = [
            'levels',
        ]

    @classmethod
    def get_for_pk(cls, program_pk, **kwargs):
        context = kwargs.get('context', {})
        tiers = context.pop('tiers', [])
        levels = context.pop('levels', [])
        if tiers:
            context['tiers'] = cls._tier_serializer(tiers, context=context, many=True).data
        if levels:
            context['levels'] = cls._level_serializer(levels, context=context, many=True).data
        program = Program.rf_aware_objects.select_related(None).prefetch_related(None).only(
            *cls._get_query_fields()
        ).get(pk=program_pk)
        return cls(program, context=context)

    def _get_program_levels(self, program):
        return self.context.get('levels', [])

    def _get_program_tiers(self, program):
        return self.context.get('tiers', [])

    def get_levels(self, program):
        if self.context.get('level_order', False):
            return self._get_levels_level_order(program)
        else:
            return self._get_levels_chain_order(program)


IPTTExcelProgramSerializer = get_serializer(
    IPTTExcelMixin,
    ProgramRFOrderingMixin,
    ProgramReportingPeriodMixin,
    ProgramBaseSerializerMixin
)
