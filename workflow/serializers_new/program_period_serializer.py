from datetime import date, timedelta
from rest_framework import serializers
from django.utils.translation import ugettext_lazy as _
from workflow.models import Program


class ProgramPeriodSerializerUpdate(serializers.ModelSerializer):
    rationale = serializers.CharField(required=False, allow_blank=True)
    has_indicators = serializers.BooleanField(required=False)

    class Meta:
        model = Program
        fields = [
            'pk',
            'start_date',
            'end_date',
            'reporting_period_start',
            'reporting_period_end',
            'rationale',
            'has_indicators',
            'has_time_aware_targets',
            'last_time_aware_indicator_start_date'
        ]

    def validate(self, data):

        if ('rationale' not in data or not data['rationale']) and self.instance.has_indicators:
            # Translators: Text of an error message that appears when a user hasn't provided a justification for the
            # change they are making to some data
            raise serializers.ValidationError({'rationale': _('Reason for change is required')})

        if 'reporting_period_start' in data:
            if self.instance.start_date:
                earliest_date = self.instance.start_date
                adjusted_start_date = date(earliest_date.year, earliest_date.month, 1)
                if data['reporting_period_start'] < adjusted_start_date:
                    raise serializers.ValidationError(
                        {'reporting_period_start': _('Indicator tracking period cannot be outside of the IDAA program dates.')})
            if data['reporting_period_start'].day != 1:
                raise serializers.ValidationError(
                    {'reporting_period_start': _('Indicator tracking period must start on the first of the month.')})
            elif data['reporting_period_start'] == self.instance.reporting_period_start:
                pass
            elif self.instance.has_time_aware_targets:
                raise serializers.ValidationError(
                    {'reporting_period_start':
                         _('Indicator tracking period start date cannot be changed while time-aware periodic targets are in place.')}
                )

        if 'reporting_period_end' in data:
            if self.instance.end_date:
                latest_date = self.instance.end_date
                # Get last day of the month of end_date
                adjusted_end_date = date(
                    latest_date.year + latest_date.month // 12, latest_date.month % 12 + 1, 1) - timedelta(days=1)
                if data['reporting_period_end'] > adjusted_end_date:
                    raise serializers.ValidationError(
                        {'reporting_period_end': _('Indicator tracking period cannot be outside of the IDAA program dates.')})
            next_day = data['reporting_period_end'] + timedelta(days=1)
            if next_day.day != 1:
                raise serializers.ValidationError(
                    {'reporting_period_end': _('Indicator tracking period must end on the last day of the month.')})
            elif data['reporting_period_end'] == self.instance.reporting_period_end:
                pass
            elif (self.instance.last_time_aware_indicator_start_date and
                  data['reporting_period_end'] < self.instance.last_time_aware_indicator_start_date):
                raise serializers.ValidationError(
                    {'reporting_period_end': _('Indicator tracking period must end after the start of the last target period.')})
            if data['reporting_period_start'] and data['reporting_period_start'] >= data['reporting_period_end']:
                raise serializers.ValidationError(
                    {'reporting_period_end': _('Indicator tracking period start date must be before the indicator tracking period end date.')})

        else:
            raise serializers.ValidationError({'reporting_period_end': _('You must select an indicator tracking period end date.')})

        return data

    def update(self, instance, validated_data):
        instance.reporting_period_start = validated_data.get('reporting_period_start', instance.reporting_period_start)
        instance.reporting_period_end = validated_data.get('reporting_period_end', instance.reporting_period_end)
        instance.save()
        return instance


class ProgramPeriodSerializerRead(serializers.ModelSerializer):
    readonly = serializers.SerializerMethodField()

    class Meta:
        model = Program
        fields = [
            'pk',
            'start_date',
            'end_date',
            'reporting_period_start',
            'reporting_period_end',
            'readonly',
            'has_time_aware_targets',
        ]

    def __init__(self, *args, **kwargs):
        self.readonly = kwargs.pop('read_only')
        super().__init__(*args, **kwargs)

    def get_readonly(self, obj):
        return self.readonly
