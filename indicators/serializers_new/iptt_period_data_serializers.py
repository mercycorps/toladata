from rest_framework import serializers
from tola.serializers import make_quantized_decimal, DecimalDisplayField

class TPReportPeriodSerializer(serializers.Serializer):
    actual = DecimalDisplayField()
    count = serializers.IntegerField(allow_null=True, default=None)
    disaggregations = serializers.SerializerMethodField()
    _coerce_to_string=True

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

    def _format_disagg(self, disaggregation):
        actual = disaggregation.pop('actual', None)
        try:
            actual = make_quantized_decimal(actual, coerce_to_string=self._coerce_to_string)
        except TypeError:
            pass
        return {
            'actual': actual
        }

    def get_disaggregations(self, period):
        return {label_pk: self._format_disagg(period.disaggregations[label_pk])
                for label_pk in self.context.get('categories', [])}

class TPExcelReportPeriodSerializer(TPReportPeriodSerializer):
    actual = DecimalDisplayField(localize=False, coerce_to_string=False)
    _coerce_to_string=False


class TVAReportPeriodSerializer(TPReportPeriodSerializer):
    met = DecimalDisplayField(multiplier=100)
    met_excel = DecimalDisplayField(decimal_places=4, source='met')
    target = DecimalDisplayField()

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

class TVAExcelReportPeriodSerializer(TVAReportPeriodSerializer):
    actual = DecimalDisplayField(localize=False, coerce_to_string=False)
    met = DecimalDisplayField(decimal_places=4, localize=False, coerce_to_string=False)
    target = DecimalDisplayField(localize=False, coerce_to_string=False)
    _coerce_to_string=False