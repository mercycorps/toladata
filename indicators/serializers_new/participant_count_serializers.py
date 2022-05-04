import copy
import re
from datetime import datetime
from rest_framework import serializers, exceptions
from django.conf import settings
from django.utils.translation import ugettext_lazy as _
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
    view_only = serializers.SerializerMethodField()
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
            'disaggregations',
            'view_only'
        ]

    def get_periodic_target(self, obj):
        return PeriodicTarget.objects.values('id', 'period').get(result__id=obj.id)

    def get_view_only(self, obj):
        # Add boolean variable to serializer output.
        periodic_target = PeriodicTarget.objects.values('id', 'customsort').get(result__id=obj.id)
        pt_year = periodic_target['customsort']
        view_only = True
        today = datetime.utcnow().date()
        current_year = today.year
        current_month = today.month
        # If periodic target matches current calendar year before reporting period ends, make it editable.
        if pt_year == current_year:
            if current_month < 9:
                view_only = False
        # If periodic target matches next calendar year AND it is past reporting period for prior fiscal year
        # or period target matches next calendar year AND there is no prior periodic target AND current month
        # is after new fiscal year start, make periodic target editable.
        elif pt_year == current_year + 1:
            if (current_month > 8) or ((not PeriodicTarget.filter(customsort=current_year).exists()) and (current_month > 6)):
                view_only = False
        return view_only

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

    def empty_evidence(self):
        """
        Utility method for checking if both evidence fields [evidence_url, record_name] are empty.

        Returns
            True if both fields are empty else False
        """
        return self.initial_data.get('record_name') == '' and self.initial_data.get('evidence_url') == '' \
            or self.initial_data.get('record_name') is None and self.initial_data.get('evidence_url') is None

    def validate_date_collected(self, value):
        """
        Validates that date_collected is in the range of self.context.get('program').start_date and self.context.get('program').end_date

        Params
            value
                - The value of date_collected

        Raises
            ValidationError
                - If validation fails

        Returns
            Value of date_collected
        """
        program = self.context.get('program')

        if program.reporting_period_start <= value <= program.reporting_period_end:
            return value

        # Translators: An error message detailing that the selected date should be within the reporting period for the fiscal year
        raise exceptions.ValidationError(_('This date should be within the fiscal year of the reporting period.'))

    def validate_outcome_themes(self, value):
        """
        Validates that the length of outcome_themes is greater than 0

        Params
            value
                - The value of outcome_themes

        Raises
            ValidationError
                - If validation fails

        Returns
            Value of outcome_themes
        """
        if len(value) > 0:
            return value

        # Translators: An error message detailing that outcome themes are required and that multiple outcome themes can be selected
        raise exceptions.ValidationError(_('Please complete this field. You can select more than one outcome theme.'))

    def validate_evidence_url(self, value):
        """
        Validates that evidence_url matches the regex pattern and that record_name is not None

        Params
            value
                - The value of evidence_url

        Raises
            ValidationError
                - If validation fails

        Returns
            Value of evidence_url
        """
        pattern = r"^(http(s)?|file):\/\/.+"

        # Both evidence fields are empty. Return value instead of raising exception
        if self.empty_evidence():
            return value

        if self.initial_data.get('record_name') is None or len(self.initial_data.get('record_name')) == 0:
            # Translators: An error message detailing that the record name must be included along the a evidence link
            raise exceptions.ValidationError(_('A record name must be included along with the link.'))

        if re.match(pattern, value) is None:
            # Translators: An error message detailing that the evidence link was invalid
            raise exceptions.ValidationError(_('Please enter a valid evidence link.'))

        return value

    def validate_record_name(self, value):
        """
        Validates that record_name is set alongside evidence_url

        Params
            value
                - The value of record_name

        Raises
            ValidationError
                - If validation fails

        Returns
            Value of record_name
        """

        # Both evidence fields are empty. Return value instead of raising exception
        if self.empty_evidence():
            return value

        if self.initial_data.get('evidence_url') is None or len(self.initial_data.get('evidence_url')) == 0:
            # Translators: An error message detailing that an evidence link must be included along with the record name
            raise exceptions.ValidationError(_('A link must be included along with the record name.'))

        return value

    def disaggregations_are_valid(self, used_disaggregations):
        """
        Checks that each disaggregation passes validation

        Params
            used_disaggregations
                - A dict with a total value for each disaggregation type

        Raises
            ValidationError
                - If validation fails

        Returns
            True if validation passes
        """
        sadd_with_direct = used_disaggregations['SADD (including unknown) with double counting']['direct']['value']
        sadd_without_direct = used_disaggregations['SADD (including unknown) without double counting']['direct']['value']
        actual_with_direct = used_disaggregations['Actual with double counting']['direct']['value']
        actual_with_indirect = used_disaggregations['Actual with double counting']['indirect']['value']
        actual_without_direct = used_disaggregations['Actual without double counting']['direct']['value']
        actual_without_indirect = used_disaggregations['Actual without double counting']['indirect']['value']
        sectors_direct = used_disaggregations['Sectors Direct with double counting']['direct']['value']
        sectors_indirect = used_disaggregations['Sectors Indirect with double counting']['indirect']['value']

        if not sadd_with_direct == actual_with_direct:
            # Translators: An error message detailing that the sum of 'SADD with double counting' should be equal to the sum of 'Direct with double counting'
            raise exceptions.ValidationError(_("The sum of 'SADD with double counting' should be equal to the sum of 'Direct with double counting'."))

        if not sadd_without_direct == actual_without_direct:
            # Translators: An error message detailing that the sum of 'SADD without double counting' should be equal to the sum of 'Direct without double counting'
            raise exceptions.ValidationError(_("The sum of 'SADD without double counting' should be equal to the sum of 'Direct without double counting'."))

        if actual_with_direct == 0 or actual_with_indirect == 0:
            # Translators: An error message detailing that the fields Direct and Indirect total participants with double counting is required
            raise exceptions.ValidationError(_("Direct/indirect total participants with double counting is required. Please complete these fields."))

        if (actual_without_direct + actual_without_indirect) > (actual_with_direct + actual_with_indirect):
            # Translators: An error message detailing that the Direct and Indirect without double counting should be equal to or lower than the value of Direct and Indirect with double counting
            raise exceptions.ValidationError(_("Direct/indirect without double counting should be equal to or lower than direct/indirect with double counting."))

        if (sectors_direct + sectors_indirect) > (actual_with_direct + actual_with_indirect):
            # Translators: An error message detailing that the Sector values should be less to or equal to the sum of Direct and Indirect with double counting value
            raise exceptions.ValidationError(_("Sector values should be less than or equal to the 'Direct/Indirect with double counting' value."))

        return True

    def process_disaggregations(self, disaggregations, instance, preserve_old_ids=False):
        """
        Processes disaggregations for creation and also creates the used_disaggregations dict with total values

        Params
            disaggregations
                - The disaggregations object from the request
            instance
                - instance of the Results object
            preserve_old_ids
                - Optional defaults to False
                - Used for updating in order to get the old_label_ids

        Returns
            new_value_objs, old_label_ids if preserve_old_ids is True else new_value_objs
        """
        new_value_objs = list()
        old_label_ids = list()
        # A dict to hold total values for disaggregations
        used_disaggregations = {
            "SADD (including unknown) with double counting": {
                "direct": {
                    "value": 0
                }
            },
            "SADD (including unknown) without double counting": {
                "direct": {
                    "value": 0
                }
            },
            "Sectors Direct with double counting": {
                "direct": {
                    "value": 0
                }
            },
            "Sectors Indirect with double counting": {
                "indirect": {
                    "value": 0
                }
            },
            "Actual without double counting": {
                "direct": {
                    "value": 0
                },
                "indirect": {
                    "value": 0
                }
            },
            "Actual with double counting": {
                "direct": {
                    "value": 0
                },
                "indirect": {
                    "value": 0
                }
            }
        }

        for disagg in disaggregations:
            disagg_type = disagg['disaggregation_type']
            for label_value in disagg['labels']:
                if preserve_old_ids:
                    old_label_ids.append(label_value['disaggregationlabel_id'])
                if label_value['value']:
                    if disagg_type in ['Actual with double counting', 'Actual without double counting']:
                        key = label_value['label'].lower()
                    else:
                        key = disagg['count_type'].lower()

                    try:
                        used_disaggregations[disagg_type][key]['value'] += int(label_value['value'])
                    except ValueError:
                        used_disaggregations[disagg_type][key]['value'] += float(label_value['value'])

                    new_value_objs.append(DisaggregatedValue(
                        category_id=label_value['disaggregationlabel_id'], result=instance, value=label_value['value']))

        if self.disaggregations_are_valid(used_disaggregations):
            if preserve_old_ids:
                return new_value_objs, old_label_ids
            else:
                return new_value_objs

    def create(self, validated_data):
        disaggregations = validated_data.pop('disaggregations')
        outcome_themes = validated_data.pop('outcome_themes')
        result = Result.objects.create(**validated_data)
        result.outcome_themes.add(*outcome_themes)

        value_objs = self.process_disaggregations(disaggregations, result)

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

        new_value_objs, old_label_ids = self.process_disaggregations(disaggregations, instance, preserve_old_ids=True)

        old_disagg_values = DisaggregatedValue.objects.filter(category_id__in=old_label_ids, result=instance)
        old_disagg_values.delete()
        # There's lots of warnings about batch_create in the Django documentation, e.g. it skips the
        # save method and won't trigger signals, but I don't we need any of those things in this case.
        DisaggregatedValue.objects.bulk_create(new_value_objs)
        return instance
