"""Serializers which initialize and serialize workflow models into formats needed for the IPTT React App/Excel export

    Serializers:
        IPTTQSProgramSerializer: Quickstart serializer, loads programs for populating IPTT Quickstart menus.  Example:
            IPTTQSProgramSerializer.load_for_user(user)
                returns program data for populating IPTT Quickstart menus for all programs a user has access to
        IPTTProgramSerializer: Serializer for IPTT React App, including filter tags and indicator metadata. Example:
            IPTTProgramSerializer.load_for_pk(program_pk)
                returns JSON serialized program data to fill in IPTT Report, filters, indicator rows, level data, etc.
        IPTTExcelProgramSerializer: Serializer for IPTT Excel download, consumed by IPTTExcelRenderer.  Example:
            IPTTExcelProgramSerializer.load_for_pk(program_pk)
                returns python object serialized program data consumed by Excel Renderer
"""

import operator
from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext as _
from rest_framework import serializers
from indicators.models import (
    Indicator,
    PeriodicTarget,
    IndicatorType,
    Sector,
)
from indicators.serializers_new import (
    IPTTLevelSerializer,
    IPTTJSONIndicatorLabelsSerializer,
    IPTTJSONDisaggregationSerializer,
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
from tola.serializers import ContextField


class IPTTQSMixin:
    """Program Serializer component which loads JSON data to populate the IPTT Quickstart selection React App"""
    frequencies = serializers.SerializerMethodField()
    period_date_ranges = serializers.SerializerMethodField()

    class Meta:
        purpose = "IPTTQS"
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

    # class methods used to minimize queries while fetching queryset and initializing data:

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
        """Entry point for class that loads quickstart data for all programs available to a given user"""
        return cls.load_for_pks(user.tola_user.available_active_started_programs.annotate(
            targets_exist=models.Exists(PeriodicTarget.objects.filter(indicator__program=models.OuterRef('pk')))
        ).filter(
            funding_status="Funded",
            targets_exist=True,
            reporting_period_start__isnull=False, reporting_period_end__isnull=False
        ).values_list('id', flat=True))

    @classmethod
    def load_for_pks(cls, pks):
        """Entry point for class that loads quickstart data for a list of pks (ints)"""
        queryset = cls.get_queryset(filters={'pk__in': pks})
        annotations = {
            f'frequency_{frequency}_indicators_exist': models.Exists(
                Indicator.objects.select_related(None).prefetch_related(None).filter(
                    deleted__isnull=True, program=models.OuterRef('pk'), target_frequency=frequency,
                ).only('pk', 'program_id', 'target_frequency')) for frequency, x in Indicator.TARGET_FREQUENCIES
        }
        queryset = queryset.annotate(**annotations)
        return cls(queryset, context=cls._get_context(), many=True)

    # Serializer Method Fields (populate specific fields on serializer):

    @staticmethod
    def get_frequencies(program):
        """which frequencies should the TvA drop down list for this program (has indicators with that frequency)"""
        return [frequency for frequency, x in Indicator.TARGET_FREQUENCIES
                if getattr(program, f'frequency_{frequency}_indicators_exist', False)]

    def get_period_date_ranges(self, program):
        """how many periods total for each frequency, and how many are past (for most recent # periods logic)"""
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
    """Program Serializer component which loads JSON data consumed by filter portion of IPTT React App"""
    result_chain_label = serializers.SerializerMethodField()
    levels = ContextField()
    tiers = ContextField()
    indicators = ContextField()
    sectors = ContextField()
    indicator_types = ContextField()
    sites = ContextField()
    disaggregations = ContextField()
    old_levels = serializers.SerializerMethodField()

    class Meta:
        purpose = "IPTTJSONLabels"
        fields = [
            'result_chain_label',
            'levels',
            'tiers',
            'indicators',
            'sectors',
            'indicator_types',
            'sites',
            'disaggregations',
            'old_levels',
        ]
        _related_serializers = {
            'levels': IPTTLevelSerializer,
            'indicators': IPTTJSONIndicatorLabelsSerializer,
        }

    # class method to instantiate serializer with required context and minimal queries:

    @classmethod
    def _get_context(cls, *args, **kwargs):
        """Extends parent context for initializing data, includes all related objects for populating filter lists"""
        context = super()._get_context(*args, **kwargs)
        program_pk = context['program_pk']
        context['indicator_types'] = list(IndicatorType.objects.select_related(None).prefetch_related(None).filter(
            indicator__program_id=program_pk
        ).order_by('indicator_type').distinct().values('pk', name=models.F('indicator_type')))
        context['sites'] = list(SiteProfile.objects.select_related(None).prefetch_related(None).filter(
            result__indicator__program_id=program_pk
        ).order_by('name').distinct().values('pk', 'name'))
        context['sectors'] = list(Sector.objects.select_related(None).prefetch_related(None).filter(
            indicator__program_id=program_pk
        ).order_by('sector').distinct().values('pk', name=models.F('sector')))
        context['disaggregations'] = IPTTJSONDisaggregationSerializer.load_for_program(program_pk).data
        context['now'] = timezone.now().date()
        return context

    # serializer method fields (populate fields on serializer):

    def get_result_chain_label(self, program):
        """returns "Outcome Chain" or "Chaîne Résultat" for labeling the ordering filter"""
        result_tier = [tier for tier in self._get_program_tiers(program) if tier['tier_depth'] == 2]
        if result_tier and len(result_tier) == 1:
            return _('%(tier)s Chain') % {'tier': _(result_tier[0]['name'])}
        return None

    def get_old_levels(self, program):
        """Returns a map of old levels used by indicators in this program (for sorting and filter menus)"""
        if program.results_framework:
            return []
        return sorted(
            [{'pk': x[0], 'name': x[1]} for x in set(
                (i['level_pk'], i['old_level_name']) for i in self._get_program_indicators(program)
                if i['old_level_name'])
            ], key=operator.itemgetter('pk'))



# Main serializer for labels, filters, and program data for the IPTT (Web/JSON):
IPTTProgramSerializer = get_serializer(
    IPTTProgramFilterItemsMixin,
    ProgramPeriodsForFrequencyMixin,
    ProgramRFOrderingMixin,
    ProgramReportingPeriodMixin,
    ProgramBaseSerializerMixin
)


class IPTTExcelMixin:
    """Program Serializer component to serialize just program data for excel rendered IPTT output"""
    levels = serializers.SerializerMethodField()

    class Meta:
        fields = [
            'levels',
        ]
        _related_serializers = {'levels': IPTTLevelSerializer}

    # Class methods to instantiate serializer with required context (adjusts given context):
    @classmethod
    def load_for_pk(cls, program_pk, **kwargs):
        context = kwargs.get('context', {})
        context['tiers'] = cls.related_serializers['tiers'](
            context.get('tier_objects', []), context=context, many=True
        ).data
        context['levels'] = cls.related_serializers['levels'](
            context.get('level_objects', []), context=context, many=True
        ).data
        program = Program.rf_aware_objects.select_related(None).prefetch_related(None).only(
            *cls._get_query_fields()
        ).get(pk=program_pk)
        return cls(program, context=context)

    # serializer method fields (populates serializer output fields):

    def get_levels(self, program):
        """Returns serialized data _in order_ based on context key"""
        if self.context.get('level_order', False):
            return self._get_levels_level_order(program)
        return self._get_levels_chain_order(program)


IPTTExcelProgramSerializer = get_serializer(
    IPTTExcelMixin,
    ProgramRFOrderingMixin,
    ProgramReportingPeriodMixin,
    ProgramBaseSerializerMixin
)
