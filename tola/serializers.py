import decimal
from rest_framework import serializers


def _get_normalized_decimal_place_count(value, places=2):
    exponent = value.as_tuple().exponent
    if exponent > 0:
        return 0
    return min(places, abs(exponent))

def make_quantized_decimal(value, places=2, coerce_to_string=False):
    if value is None:
        return value
    try:
        value = decimal.Decimal(value).quantize(decimal.Decimal(f".{'0'*(places-1)}1"))
    except (TypeError, ValueError):
        return None
    if not coerce_to_string:
        return value
    value = value.normalize()
    decimal_places = _get_normalized_decimal_place_count(value, places)
    value = value.quantize(decimal.Decimal('.1') ** decimal_places)
    return '{:f}'.format(value)


class DecimalDisplayField(serializers.DecimalField):
    """
    A decimal field which strips trailing zeros and returns a string
    """
    def __init__(self, *args, **kwargs):
        self.multiplier = decimal.Decimal(kwargs.pop('multiplier', 1))
        self.decimal_places = kwargs.pop('decimal_places', 2)
        localize = kwargs.pop('localize', True)
        kwargs.update({
            'decimal_places': self.decimal_places,
            'max_digits': None,
            'localize': localize
        })
        super(DecimalDisplayField, self).__init__(*args, **kwargs)

    def to_representation(self, value):
        if value is not None and value != '':
            value = make_quantized_decimal((decimal.Decimal(value) * self.multiplier), places=self.decimal_places)
            value = value.normalize()
            self.decimal_places = _get_normalized_decimal_place_count(value, self.decimal_places)
            return super(DecimalDisplayField, self).to_representation(value)
        return None


class ContextField(serializers.ReadOnlyField):
    """Retrieves a value from the parent serializer's context and returns it"""
    def __init__(self, context_key=None, **kwargs):
        self.context_key = context_key
        kwargs['source'] = '*'
        kwargs['read_only'] = True
        super().__init__(**kwargs)

    def bind(self, field_name, parent):
        if self.context_key is None:
            self.context_key = field_name
        super().bind(field_name, parent)

    def to_representation(self, value):
        return self.parent.context.get(self.context_key, None)
