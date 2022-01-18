import copy
from rest_framework import serializers
from django.utils.translation import ugettext
from indicators.models import (
    Indicator, PeriodicTarget, Result, OutcomeTheme, DisaggregationType, DisaggregationLabel, DisaggregatedValue
)
from tola.l10n_utils import l10n_date_medium


class OutcomeThemeSerializer(serializers.ModelSerializer):

    class Meta:
        model = OutcomeTheme
        fields = ['pk', 'name']


class ParticipantCountResultSerializer(serializers.ModelSerializer):
    """Results serializer for the participant count page"""
    date_collected = serializers.SerializerMethodField()
    achieved = serializers.FloatField()
    outcome_themes = OutcomeThemeSerializer(many=True)

    class Meta:
        model = Result
        fields = [
            'pk',
            'achieved',
            'date_collected',
            'outcome_themes',
            'record_name',
            'evidence_url'
        ]

    @staticmethod
    def get_date_collected(result):
        if not result.date_collected:
            return None
        return l10n_date_medium(result.date_collected, decode=True)


class ParticipantCountDisaggValueSerializer(serializers.ModelSerializer):

    class Meta:
        model = DisaggregatedValue
        fields = ['pk', 'value']


class ParticipantCountDisaggLabelValueSerializer(serializers.ModelSerializer):
    value = serializers.SerializerMethodField()
    label_id = serializers.IntegerField(source='pk')

    class Meta:
        model = DisaggregationLabel
        fields = ['label_id', 'label', 'customsort', 'value']

    def get_value(self, obj):
        if obj.pk in self.context['disagg_values_by_label_pk']:
            return self.context['disagg_values_by_label_pk'][obj.pk]
        return {}

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        value_obj = representation.pop('value')
        representation['value_id'] = value_obj.get('pk', None)
        representation['value'] = value_obj.get('value', None)
        return representation


class ParticipantCountDisaggregationSerializer(serializers.ModelSerializer):
    labels = serializers.SerializerMethodField()

    class Meta:
        model = DisaggregationType
        fields = [
            'pk',
            'disaggregation_type',
            'labels',
        ]

    def get_labels(self, obj):
        queryset = DisaggregationLabel.objects.filter(disaggregation_type__pk=obj.pk)
        filters = {'category__pk__in': queryset.values_list('pk', flat=True)}
        if self.context['result_pk']:
            filters['result'] = f"result__pk={self.context['result_pk']}"
        disagg_values_by_label_pk = {dv.category_id: dv for dv in DisaggregatedValue.objects.filter(**filters)}
        context = copy.copy(self.context)
        context.update({'disagg_values_by_label_pk': disagg_values_by_label_pk})
        return ParticipantCountDisaggLabelValueSerializer(queryset, many=True, context=context).data
