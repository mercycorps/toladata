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


# class PCResultSerializer(serializers.ModelSerializer):
#     """Results serializer for the participant count page"""
#     date_collected = serializers.SerializerMethodField()
#     achieved = serializers.FloatField()
#     outcome_themes = serializers.ChoiceField(choices=OutcomeTheme.objects.values('pk', 'name'))
#
#     class Meta:
#         model = Result
#         fields = [
#             'pk',
#             'achieved',
#             'date_collected',
#             'outcome_themes',
#             'record_name',
#             'evidence_url'
#         ]
#
#     @staticmethod
#     def get_date_collected(result):
#         if not result.date_collected:
#             return None
#         return l10n_date_medium(result.date_collected, decode=True)


class PCDisaggValueSerializer(serializers.ModelSerializer):

    class Meta:
        model = DisaggregatedValue
        fields = ['pk', 'value']


class PCDisaggLabelValueSerializer(serializers.ModelSerializer):
    value = serializers.SerializerMethodField()
    disaggregationlabel_id = serializers.IntegerField(source='pk')

    class Meta:
        model = DisaggregationLabel
        fields = ['disaggregationlabel_id', 'label', 'customsort', 'value']

    def get_value(self, obj):
        if 'disagg_values_by_label_pk' in self.context and obj.pk in self.context['disagg_values_by_label_pk']:
            return self.context['disagg_values_by_label_pk'][obj.pk]
        return {'value_id': None, 'value': None}

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        value_dict = representation.pop('value')
        representation['disaggregatedvalue_id'] = value_dict['value_id'] # if value_dict else None
        representation['value'] = value_dict['value'] # if value_dict else None
        return representation

    def create(self, validated_data):
        print('createdd', validated_data)


class PCDisaggregationSerializer(serializers.ModelSerializer):
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
        if self.context['result_pk']:
            queryset = DisaggregationLabel.objects.filter(disaggregation_type__pk=obj.pk)
            filters = {
                'category__pk__in': queryset.values_list('pk', flat=True),
                'result': f"result__pk={self.context['result_pk']}"}
            disagg_values_by_label_pk = {dv.category_id: {'value_id': dv.id, 'value': dv.value}
                for dv in DisaggregatedValue.objects.filter(**filters)}
            context = copy.copy(self.context)
            context.update({'disagg_values_by_label_pk': disagg_values_by_label_pk})
            return PCDisaggLabelValueSerializer(queryset, many=True, context=context).data
        else:
            return PCDisaggLabelValueSerializer(queryset, many=True).data

