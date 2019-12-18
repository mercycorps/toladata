from rest_framework import serializers
from indicators.models import Indicator


class ProgramTargetFrequenciesSerializer(serializers.Serializer):
    frequency_name = serializers.SerializerMethodField()
    target_frequency = serializers.IntegerField()

    def get_frequency_name(self, obj):
        try:
            tfid = int(obj['target_frequency']) - 1
        except TypeError:
            return None
        # print(Indicator.TARGET_FREQUENCIES[obj['target_frequency']])
        return Indicator.TARGET_FREQUENCIES[tfid][1]

    class Meta:
        fields = ('target_frequency', 'frequency_name')
