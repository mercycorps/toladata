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
        fields = ['value']


class ParticipantCountDisaggLabelSerializer(serializers.ModelSerializer):
    disaggregatedvalue_set = ParticipantCountDisaggValueSerializer()

    class Meta:
        model = DisaggregationLabel
        fields = ['label', 'customsort', 'disaggregatedvalue_set']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        value_dict = representation.pop('disaggregatedvalue_set')
        representation['value'] = value_dict['value']
        return representation


class ParticipantCountDisaggregationSerializer(serializers.ModelSerializer):
    labels = ParticipantCountDisaggLabelSerializer(many=True, source='disaggregationlabel_set')

    class Meta:
        model = DisaggregationType
        fields = [
            'pk',
            'disaggregation_type',
            'labels',
        ]


class ParticipantCountIndicatorSerializer(serializers.ModelSerializer):
    """Results serializer for the participant count page"""
    disaggregations = ParticipantCountDisaggregationSerializer(many=True, source='disaggregation')
    program_start_date = serializers.DateField(source='program.reporting_period_start')
    program_end_date = serializers.DateField(source='program.reporting_period_end')

    class Meta:
        model = Indicator
        fields = [
            'disaggregations',
            'program_start_date',
            'program_end_date',
        ]

