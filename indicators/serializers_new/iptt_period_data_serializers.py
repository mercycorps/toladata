"""Serializers for Period Report Data - actual/target/met data for a given target period and indicator

    Each contains both json and excel formatting until to_representation, which chooses correct version
"""

from rest_framework import serializers
from tola.serializers import make_quantized_decimal, DecimalDisplayField

class TPReportPeriodSerializer(serializers.Serializer):
    actual_json = DecimalDisplayField(localize=False, coerce_to_string=True, source='actual')
    actual_excel = DecimalDisplayField(localize=False, coerce_to_string=False, source='actual')
    count = serializers.IntegerField(allow_null=True, default=None)
    disaggregations = serializers.SerializerMethodField()

    class PeriodObject:
        """Dummy object for serializing period data that is otherwise kept in dict form

            DRF does not serialize dicts well.  This dummy object matches our period_data dict
            (see models.PeriodicTarget) and is serializable
        """
        def __init__(self, period_dict):
            period_dict['count'] = period_dict.get('count', None)
            self.__dict__ = period_dict

    @classmethod
    def from_dict(cls, period_dict, context=None):
        """instances a serializable object from the provided dict, and serializes it

            period data is usually provided in dict form, which is unserializable, this helper method both converts
            it to a serializable object (ensuring it has a 'count' entry even if not provided) and serializes it
        """
        if context is None:
            context = {}
        # serializer won't accept a raw dict, so the dict is being wrapped in a class
        period_obj = cls.PeriodObject(period_dict)
        return cls(period_obj, context=context)

    def to_representation(self, instance):
        """The excel and JSON formats for numeric report values vary.

            This prevents needing separate serializers for each.  The differences are in the field signature above
        """
        rep = super().to_representation(instance)
        # pop values not needed when serialized
        actual_json = rep.pop('actual_json', None)
        actual_excel = rep.pop('actual_excel', None)
        # context['coerce_to_string'] is the key that this is JSON (string) output (Decimal output for excel)
        if self.context.get('coerce_to_string', False):
            rep['actual'] = actual_json
        else:
            rep['actual'] = actual_excel
        return rep

    def _format_disagg(self, disaggregation):
        """method to override in future if disaggregated target data is added"""
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
        """Dummy object for serializing period data that is otherwise kept in dict form

            DRF does not serialize dicts well.  This dummy object matches our period_data dict
            (see models.PeriodicTarget) and is serializable
        """

        def __init__(self, period_dict):
            """instances a serializable object from the provided dict, and serializes it

            period data is usually provided in dict form, which is unserializable, this helper method both converts
            it to a serializable object (ensuring it has a 'count' entry), finds 'met' if possible, and serializes it
        """
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
        """The excel and JSON formats for numeric report values vary.

            This prevents needing separate serializers for each.  The differences are in the field signature above
        """
        rep = super().to_representation(instance)
        # pop values that are not needed when serialization is complete:
        target_json = rep.pop('target_json', None)
        target_excel = rep.pop('target_excel', None)
        met_json = rep.pop('met_json', None)
        met_excel = rep.pop('met_excel', None)
        # context['coerce_to_string'] is the key that this is JSON (string) output (Decimal output for excel)
        if self.context.get('coerce_to_string', False):
            rep['target'] = target_json
            rep['met'] = met_json
        else:
            rep['target'] = target_excel
            rep['met'] = met_excel
        return rep
