import copy
from rest_framework import serializers
from django.db.models import Count, BooleanField, Q
from indicators.models import (
    PeriodicTarget, Result, OutcomeTheme, DisaggregationType, DisaggregationLabel, DisaggregatedValue
)


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
            filters = {
                'category__pk__in': queryset.values_list('pk', flat=True),
                'result__pk': self.context['result_pk']}
            disagg_values_by_label_pk = {dv.category_id: {'value_id': dv.id, 'value': dv.value}
                for dv in DisaggregatedValue.objects.filter(**filters)}
            context = copy.copy(self.context)
            context.update({'disagg_values_by_label_pk': disagg_values_by_label_pk})
            return PCDisaggLabelValueSerializer(queryset, many=True, context=context).data
        else:
            return PCDisaggLabelValueSerializer(queryset, many=True).data


class PCResultSerializerRead(serializers.ModelSerializer):
    """Results serializer for the participant count page"""
    disaggregations = serializers.SerializerMethodField()
    outcome_themes = serializers.SerializerMethodField()
    periodic_target = serializers.SerializerMethodField()
    program_start_date = serializers.DateField(source='indicator.program.reporting_period_start', read_only=True)
    program_end_date = serializers.DateField(source='indicator.program.reporting_period_end', read_only=True)

    class Meta:
        model = Result
        fields = [
            'pk',
            'periodic_target',
            'achieved',
            'date_collected',
            'record_name',
            'evidence_url',
            'program_start_date',
            'program_end_date',
            'outcome_themes',
            'disaggregations'
        ]

    def get_periodic_target(self, obj):
        return PeriodicTarget.objects.values('id', 'period').get(result__id=obj.id)

    def get_outcome_themes(self, obj):
        return list(
            OutcomeTheme.objects
                .filter(is_active=True)
                .annotate(selected=Count(
                    'result',
                    filter=Q(result__pk=obj.pk),
                    output_field=BooleanField())
            )
            .values_list('pk', 'name', 'selected')
            .order_by('name'))

    def get_disaggregations(self, obj):
        queryset = DisaggregationType.objects.filter(global_type=DisaggregationType.DISAG_PARTICIPANT_COUNT)
        return PCDisaggregationSerializer(queryset, many=True, context={'result_pk': obj.pk}).data


class PCResultSerializerWrite(serializers.ModelSerializer):
    """Writable results serializer for the participant count page"""
    disaggregations = serializers.ListField()
    outcome_themes = serializers.ListField()

    class Meta:
        model = Result
        fields = [
            'pk',
            'periodic_target',
            'achieved',
            'date_collected',
            'indicator',
            'program',
            'record_name',
            'evidence_url',
            'outcome_themes',
            'disaggregations'
        ]

    def create(self, validated_data):
        disaggregations = validated_data.pop('disaggregations')
        outcome_themes = validated_data.pop('outcome_themes')
        result = Result.objects.create(**validated_data)
        result.outcome_themes.add(*outcome_themes)
        value_objs = []
        for disagg in disaggregations:
            for label_value in disagg['labels']:
                if label_value['value']:
                    value_objs.append(DisaggregatedValue(
                        category_id=label_value['disaggregationlabel_id'], result=result, value=label_value['value']))
        # There's lots of warnings about batch_create in the Django documentation, e.g. it skips the
        # save method and won't trigger signals, but I don't we need any of those things in this case.
        DisaggregatedValue.objects.bulk_create(value_objs)
        return result

    def update(self, instance, validated_data):
        disaggregations = validated_data.pop('disaggregations')
        outcome_themes = validated_data.pop('outcome_themes')
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        instance.outcome_themes.remove()
        instance.outcome_themes.add(*outcome_themes)

        new_value_objs = []
        old_label_ids = []
        for disagg in disaggregations:
            for label in disagg['labels']:
                old_label_ids.append(label['disaggregationlabel_id'])
                if label['value']:
                    new_value_objs.append(DisaggregatedValue(
                        category_id=label['disaggregationlabel_id'], result=instance, value=label['value']))

        old_disagg_values = DisaggregatedValue.objects.filter(category_id__in=old_label_ids, result=instance)
        old_disagg_values.delete()
        # There's lots of warnings about batch_create in the Django documentation, e.g. it skips the
        # save method and won't trigger signals, but I don't we need any of those things in this case.
        DisaggregatedValue.objects.bulk_create(new_value_objs)
        return instance
