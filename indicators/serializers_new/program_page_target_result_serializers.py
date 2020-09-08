from rest_framework import serializers
from django.utils.translation import ugettext
from indicators.models import Indicator, PeriodicTarget, Result
from tola.l10n_utils import l10n_date_medium

class ProgramPageResultSerializer(serializers.ModelSerializer):
    """Results serializer for the program page Indicator Data - both for target-assigned and no-target results"""
    date_collected = serializers.SerializerMethodField()
    achieved = serializers.FloatField()

    class Meta:
        purpose = "ProgramPage"
        model = Result
        fields = [
            'pk',
            'achieved',
            'date_collected',
            'record_name',
            'evidence_url'
        ]

    @staticmethod
    def get_date_collected(result):
        if not result.date_collected:
            return None
        return l10n_date_medium(result.date_collected, decode=True)


class ProgramPageTargetSerializer(serializers.ModelSerializer):
    """Periodic Target serializer for the Program Page Indicator data"""
    period_name = serializers.SerializerMethodField()
    date_range = serializers.SerializerMethodField()
    completed = serializers.SerializerMethodField()
    most_recently_completed = serializers.SerializerMethodField()
    target = serializers.FloatField()
    actual = serializers.FloatField()
    percent_met = serializers.FloatField()
    results = serializers.SerializerMethodField()

    class Meta:
        purpose = "ProgramPage"
        model = PeriodicTarget
        fields = [
            'period_name',
            'date_range',
            'completed',
            'most_recently_completed',
            'target',
            'actual',
            'percent_met',
            'results'
        ]

    @staticmethod
    def get_period_name(target):
        return ugettext(target.period_name)

    def get_date_range(self, target):
        """date range for displaying under the period name e.g. Sep 1, 2019 – Dec 31, 2019"""
        if self.context.get('indicator', target.indicator).target_frequency in Indicator.IRREGULAR_TARGET_FREQUENCIES:
            return None
        return '{} – {}'.format(l10n_date_medium(target.start_date, decode=True),
                                l10n_date_medium(target.end_date, decode=True))

    @staticmethod
    def get_completed(target):
        """Used by results table to determine whether to show progress pop-up for this period's % met"""
        return target.is_complete

    def get_most_recently_completed(self, target):
        """Used to determine if the next row in the results table should be the progress row"""
        indicator = self.context.get('indicator', target.indicator)
        if indicator.target_frequency in Indicator.IRREGULAR_TARGET_FREQUENCIES:
            return False
        return indicator.most_recent_completed_target_end_date == target.end_date

    @staticmethod
    def get_results(target):
        return ProgramPageResultSerializer(target.prefetch_results, many=True).data
