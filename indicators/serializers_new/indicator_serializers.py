"""Partial serializers for Indicator objects which can be composed into a serializer for a specific use case"""

import string
from rest_framework import serializers
from django.db import models
from django.utils.translation import ugettext as _
from indicators.models import Indicator
from tola.model_utils import get_serializer

# Base indicator serializer - returns pk, name, level_pk, means_of_verification (one query)

class IndicatorBaseSerializerMixin:
    """Indicator serializer component for basic indicator data."""

    level_pk = serializers.SerializerMethodField()
    old_level_name = serializers.SerializerMethodField()

    class Meta:
        model = Indicator
        fields = [
            'program_id',
            'pk',
            'name',
            'level_pk',
            'old_level_name',
            'means_of_verification',
        ]

    # class methods to instantiate serializer and minimize queries:

    @classmethod
    def _get_query_fields(cls):
        """fields required for this serializer to return data without querying database again"""
        return ['program_id', 'pk', 'name', 'level_id', 'old_level', 'means_of_verification']

    @classmethod
    def get_queryset(cls, **kwargs):
        """based on required fields and filters kwarg, returns queryset of bare indicator objects in simplest query"""
        filters = kwargs.get('filters', {})
        return Indicator.rf_aware_objects.select_related(None).prefetch_related(None).only(
            *cls._get_query_fields()
        ).filter(**filters)

    @classmethod
    def load_for_filters(cls, **kwargs):
        """loads this serializer as list serializer for all indicators meeting certain filter criteria"""
        filters = kwargs.get('filters', {})
        context = kwargs.get('context', {})
        return cls(cls.get_queryset(filters=filters), context=context, many=True)

    @classmethod
    def load_for_program(cls, program_pk, **kwargs):
        """loads this serializer for all indicators associated with a certain program

            just a helper method for load_for_filters that automates filtering to program id
        """
        filters = kwargs.pop('filters', {})
        kwargs['filters'] = {**filters, 'program_id': program_pk}
        return cls.load_for_filters(**kwargs)

    # serializer method fields (populate fields on serializer):

    @staticmethod
    def get_old_level_name(indicator):
        """for unmigrated programs, returns the old (text string on indicator model) level name"""
        if not indicator.results_framework and indicator.old_level:
            return _(indicator.old_level)
        return None

    @staticmethod
    def get_level_pk(indicator):
        """returns either level pk for migrated-program indicators or dummy old_level_pk for
            unmigrated-program indicators
        """
        if indicator.results_framework:
            return indicator.level_id
        return getattr(indicator, 'old_level_pk', None)


IndicatorBaseSerializer = get_serializer(IndicatorBaseSerializerMixin)


class IndicatorOrderingMixin:
    """Indicator serializer component to add ordering between/within level, and numbering data"""

    number = serializers.SerializerMethodField('get_long_number')
    level_order = serializers.SerializerMethodField()
    has_rf_level = serializers.SerializerMethodField()

    class Meta:
        purpose = "LevelAwareOrdering"
        fields = [
            'number',
            'level_order',
            'results_framework',
            'has_rf_level',
        ]

    # class methods to instantiate serializer with minimum queries:

    @classmethod
    def many_init(cls, instance, *args, **kwargs):
        """Adds sorting data for rf-level-less indicators when instantiated with a whole queryset (many=True)"""
        indicators = list(instance.all()) if isinstance(instance, models.Manager) else list(instance)
        context = kwargs.pop('context', {})
        context['sort_numbers'] = {
            indicator.pk: c for c, indicator in enumerate(sorted(
                [indicator for indicator in indicators
                 if indicator.level_id is None or not indicator.results_framework],
                key=lambda i: (i.old_level_pk is None, i.old_level_pk, i.sort_number)))
        }
        return super().many_init(indicators, *args, context=context, **kwargs)

    @classmethod
    def _get_query_fields(cls):
        """additional fields required for this serializer to return data without querying database again"""
        return super()._get_query_fields() + ['number', 'level_order']

    # serializer method fields (populate fields on serializer):

    def get_level_order(self, indicator):
        """for migrated-program auto-number indicators, returns level order, otherwise sort order

            sort order determined by sort_numbers in IndicatorOrderingMixin.many_init class method
        """
        if indicator.results_framework and indicator.level_id is not None:
            return indicator.level_order
        return self.context.get('sort_numbers', {}).get(indicator.pk, None)

    @staticmethod
    def get_has_rf_level(indicator):
        return indicator.results_framework and indicator.level_id is not None

    def get_long_number(self, indicator):
        """Returns the number for i.e. Program Page, "1.1" (manual) or "Output 1.1a" (auto)"""
        if indicator.manual_number_display:
            return indicator.number if indicator.number else None
        if indicator.level_id:
            return self._get_rf_long_number(indicator)
        return None

    # helper methods used by serializer method fields to access context/related items without querying db:

    def _get_level(self, indicator):
        """return the level object from context (not db) associated with a given indicator"""
        level = [level_data for level_data in self.context.get('levels', [])
                 if level_data['pk'] == indicator.level_id]
        if level and len(level) == 1:
            return level[0]
        return None

    @staticmethod
    def _get_level_order_display(indicator):
        """Returns the letter portion of the indicator number (the 'c' in 'Outcome 1.2c')"""
        if indicator.level_id and indicator.level_order is not None and indicator.level_order < 26:
            return str(string.ascii_lowercase[indicator.level_order])
        if indicator.level_id and indicator.level_order and indicator.level_order >= 26:
            return str(
                string.ascii_lowercase[indicator.level_order // 26 - 1] +
                string.ascii_lowercase[indicator.level_order % 26]
                )
        return None

    def _get_rf_long_number(self, indicator):
        """formats level, tier, and indicator information into e.g. 'Activity 1.2.1c'"""
        level = self._get_level(indicator)
        if not level:
            return None
        tier_name = (level['tier_name'] + ' ') if level['tier_name'] else ''
        return f"{tier_name}{level['ontology']}{self._get_level_order_display(indicator)}"

IndicatorRFOrderingSerializer = get_serializer(IndicatorOrderingMixin, IndicatorBaseSerializerMixin)


class IndicatorMeasurementMixin:
    """Indicator serializer component to add measurement information to serialized output"""
    is_percent = serializers.SerializerMethodField()
    direction_of_change = serializers.CharField(source='get_direction_of_change')
    baseline = serializers.SerializerMethodField()
    unit_of_measure_type = serializers.SerializerMethodField()

    class Meta:
        fields = [
            'target_frequency',
            'unit_of_measure',
            'unit_of_measure_type',
            'is_percent',
            'is_cumulative',
            'direction_of_change',
            'baseline'
        ]

    @classmethod
    def _get_query_fields(cls):
        """additional fields required for this serializer to return data without querying database again"""
        return super()._get_query_fields() + [
            'target_frequency', 'unit_of_measure', 'unit_of_measure_type', 'is_cumulative',
            'direction_of_change', 'baseline', 'baseline_na'
        ]

    # serializer method fields:

    @staticmethod
    def get_is_percent(indicator):
        return indicator.unit_of_measure_type == Indicator.PERCENTAGE

    @staticmethod
    def get_baseline(indicator):
        if indicator.baseline_na or not indicator.baseline:
            return None
        return indicator.baseline

    @staticmethod
    def get_unit_of_measure_type(indicator):
        if indicator.unit_of_measure_type == indicator.NUMBER:
            return '#'
        if indicator.unit_of_measure_type == indicator.PERCENTAGE:
            return '%'
        return None


IndicatorWithMeasurementSerializer = get_serializer(IndicatorMeasurementMixin, IndicatorBaseSerializerMixin)
