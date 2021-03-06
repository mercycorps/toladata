"""Serializers which initialize and serialize workflow models into formats needed for the Program Page React App

    Serializers:
        ProgramPageProgramSerializer: Main program page data serializer.  Example:
                ProgramPageProgramSerializer.load_for_pk(program_pk:int)
                    returns serialized data in JSON format including all indicator data
        ProgramPageIndicatorUpdateSerializer: Returns data for one indicator as well as ordering info (used
            after an indicator was updated).  Example:
                ProgramPageIndicatorUpdateSerializer.load_for_indicator_and_program(indicator_pk, program_pk)
                    returns serialized data in JSON format including full data for one indicator, as well as
                        level/ordering info for all other indicators
            also used to give just level data in case of indicator deletion.  Example:
                ProgramPageIndicatorUpdateSerializer.load-for_pk(program_pk:int)
                    returns serialized data on indicator order, level order, and indicator-level mapping
"""


import dateutil.parser
from rest_framework import serializers
from django.db import models
from indicators.models import Indicator
from indicators.serializers_new import (
    ProgramPageIndicatorSerializer,
    ProgramPageIndicatorOrderingSerializer,
)
from tola.model_utils import get_serializer
from tola.l10n_utils import l10n_date_medium
from workflow.models import Program, SiteProfile
from workflow.serializers_new.base_program_serializers import (
    ProgramBaseSerializerMixin,
    ProgramReportingPeriodMixin,
    ProgramRFOrderingMixin,
)

class ProgramPageIndicatorDataMixin:
    """Program serializer component which loads indicator data mapped by pk"""

    indicators = serializers.SerializerMethodField()

    class Meta:
        purpose = "IndicatorData"
        fields = ['indicators']
        _related_serializers = {
            'indicators': ProgramPageIndicatorSerializer
        }

    def get_indicators(self, program):
        """Program Page JSON output requires indicators to be a map by pk"""
        return {
            serialized_indicator['pk']: serialized_indicator
            for serialized_indicator in self._get_program_indicators(program)
        }


class ProgramPageMixin:
    """Program Serializer component to load main program page data for program page React App"""

    needs_additional_target_periods = serializers.BooleanField()
    site_count = serializers.ReadOnlyField(source='num_sites')
    has_levels = serializers.SerializerMethodField()
    gait_url = serializers.CharField()
    target_period_info = serializers.SerializerMethodField()

    class Meta:
        purpose = "ProgramPage"
        fields = [
            'needs_additional_target_periods',
            'site_count',
            'has_levels',
            'gait_url',
            'target_period_info',
        ]

    # Class methods used to instantiate serializer with queryset and context to minimize queries

    @classmethod
    def _get_query_fields(cls):
        """Extends parent's list of DB fields needed for included fields"""
        return super()._get_query_fields() + ['gaitid']

    @classmethod
    def get_queryset(cls, **kwargs):
        """Loads program with annotations specific for program page display (note program_page_objects manager)"""
        queryset = Program.program_page_objects.select_related(None).prefetch_related().only(
            *cls._get_query_fields()
        ).annotate(num_sites=models.Count('indicator__result__site', distinct=True))
        pk = kwargs.get('pk', None)
        if pk is not None:
            return queryset.get(pk=pk)
        filters = kwargs.get('filters', {})
        return queryset.filter(**filters)

    # Serializer Method Fields:

    def get_has_levels(self, program):
        if self._get_program_levels(program):
            return True
        return False

    def get_target_period_info(self, program):
        """Returns a dict mapping irregular frequencies to indicator count and the most recently completed target
        end date in isoformat for regular frequencies

        Used in helptext popups on program page metrics
        """
        indicators = self._get_program_indicators(program)
        irregulars = {
            frequency: len([i['pk'] for i in indicators
                            if i['target_frequency'] == frequency]) > 0
            for frequency in Indicator.IRREGULAR_TARGET_FREQUENCIES
        }
        # note: provide formatted date here in serializer so it can be displayed raw in template
        get_date_string = lambda date_obj: l10n_date_medium(date_obj, decode=True) if date_obj is not None else None
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


# Serializer for Program Page (view only):
ProgramPageProgramSerializer = get_serializer(
    ProgramPageMixin,
    ProgramPageIndicatorDataMixin,
    ProgramRFOrderingMixin,
    ProgramReportingPeriodMixin,
    ProgramBaseSerializerMixin
)



class ProgramPageUpdateMixin:
    """Program Serializer component adding a single indicator's full data to the ordering and base info
    Usage:
        For updating one indicator and program ordering data:
            ProgramPageIndicatorUpdateSerializer.load_for_indicator_and_program(indicator_pk, program_pk)
        For updating only program ordering data (i.e. indicator deleted):
            ProgramPageIndicatorUpdateSerializer.load_for_pk(program_pk)
    """
    indicator = serializers.SerializerMethodField()
    site_count = serializers.SerializerMethodField()

    class Meta:
        purpose = "IndicatorUpdate"
        fields = ['indicator', 'site_count']
        _related_serializers = {
            'indicators': ProgramPageIndicatorOrderingSerializer
        }


    # class methods for instantiation with minimal queries
    @classmethod
    def _get_context(cls, *args, **kwargs):
        """Extends the parent context to include a single indicator's data (the updated indicator)"""
        indicator_pk = kwargs.pop('indicator_pk', None)
        context = super()._get_context(*args, **kwargs)
        if indicator_pk:
            indicator_data = ProgramPageIndicatorSerializer.load_for_filters(
                filters={'pk': indicator_pk}, context=context).data
            context['indicator'] = indicator_data[0] if indicator_data and len(indicator_data) == 1 else None
        return context

    @classmethod
    def load_for_indicator_and_program(cls, indicator_pk, program_pk):
        """Main entry point, returns the serializer instantiated with program data"""
        return cls(cls.get_queryset(pk=program_pk),
                   context=cls._get_context(program_pk=program_pk, indicator_pk=indicator_pk))

    # serializer method fields:
    def get_indicator(self, program):
        return self.context.get('indicator', None)

    @staticmethod
    def get_site_count(program):
        return SiteProfile.objects.filter(result__indicator__program=program).distinct().count()


ProgramPageIndicatorUpdateSerializer = get_serializer(
    ProgramPageUpdateMixin,
    ProgramPageIndicatorDataMixin,
    ProgramRFOrderingMixin,
    ProgramBaseSerializerMixin
)
