from rest_framework import serializers
from tola.serializers import make_quantized_decimal, DecimalDisplayField

class TPReportPeriodSerializer(serializers.Serializer):
    actual_json = DecimalDisplayField(localize=False, coerce_to_string=True, source='actual')
    actual_excel = DecimalDisplayField(localize=False, coerce_to_string=False, source='actual')
    count = serializers.IntegerField(allow_null=True, default=None)
    disaggregations = serializers.SerializerMethodField()

    class PeriodObject:
        def __init__(self, period_dict):
            period_dict['count'] = period_dict.get('count', None)
            self.__dict__ = period_dict

    @classmethod
    def from_dict(cls, period_dict, context=None):
        if context is None:
            context = {}
        period_obj = cls.PeriodObject(period_dict)
        return cls(period_obj, context=context)

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        actual_json = rep.pop('actual_json', None)
        actual_excel = rep.pop('actual_excel', None)
        if self.context.get('coerce_to_string', False):
            rep['actual'] = actual_json
        else:
            rep['actual'] = actual_excel
        return rep

    def _format_disagg(self, disaggregation):
        actual = disaggregation.pop('actual', None)
        try:
            actual = make_quantized_decimal(actual, coerce_to_string=self.context.get('coerce_to_string', False))
        except TypeError:
            pass
        return {
            'actual': actual
        }

    def get_disaggregations(self, period):
        return {label_pk: self._format_disagg(period.disaggregations[label_pk])
                for label_pk in self.context.get('categories', [])}


class TVAReportPeriodSerializer(TPReportPeriodSerializer):
    met_json = DecimalDisplayField(localize=False, multiplier=100, coerce_to_string=True, source='met')
    met_excel = DecimalDisplayField(localize=False, decimal_places=4, source='met', coerce_to_string=False)
    target_json = DecimalDisplayField(localize=False, coerce_to_string=True, source='target')
    target_excel = DecimalDisplayField(localize=False, coerce_to_string=False, source='target')

    class PeriodObject:
        def __init__(self, period_dict):
            period_dict['count'] = period_dict.get('count', None)
            target = period_dict.get('target', None)
            actual = period_dict.get('actual', None)
            period_dict['met'] = None
            if target is not None and actual is not None and target != 0:
                try:
                    period_dict['met'] = make_quantized_decimal(
                        make_quantized_decimal(actual) / make_quantized_decimal(target), places=4
                    )
                except TypeError:
                    pass
            self.__dict__ = period_dict

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        target_json = rep.pop('target_json', None)
        target_excel = rep.pop('target_excel', None)
        met_json = rep.pop('met_json', None)
        met_excel = rep.pop('met_excel', None)
        if self.context.get('coerce_to_string', False):
            rep['target'] = target_json
            rep['met'] = met_json
        else:
            rep['target'] = target_excel
            rep['met'] = met_excel
        return rep
