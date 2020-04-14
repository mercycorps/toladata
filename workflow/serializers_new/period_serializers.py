"""Serializes period data for IPTT web/excel exports"""

from rest_framework import serializers
from indicators.models import Indicator
from tola.l10n_utils import l10n_date_medium, l10n_monthname
from django.utils import timezone
from django.utils.translation import ugettext as _


class BasePeriod:
    non_standard_naming_frequencies = [Indicator.LOP, Indicator.MID_END, Indicator.MONTHLY]

    @classmethod
    def lop_period(cls):
        return cls(Indicator.LOP, {
            'name': _('Life of Program')
        }, True)

    def __init__(self, frequency, period, tva=False):
        self.frequency = int(frequency)
        self.period = period
        self.tva = tva

    @property
    def is_lop(self):
        return self.frequency == Indicator.LOP

    @property
    def period_count(self):
        return self.period['customsort']

    @property
    def columns(self):
        if self.tva:
            return [self.target_column, self.actual_column, self.met_column]
        return [self.actual_column]

    @property
    def target_column(self):
        return {
            'header': _('Target')
        }

    @property
    def actual_column(self):
        return {
            'header': _('Actual')
        }

    @property
    def met_column(self):
        return {
            'header': _('% Met')
        }

    @property
    def start_display(self):
        return l10n_date_medium(self.period['start'], decode=True)

    @property
    def end_display(self):
        return l10n_date_medium(self.period['end'], decode=True)

    @property
    def header(self):
        """LOP/MidEnd/Monthly have no header, just the label, time-aware has the period name"""
        if self.frequency in self.non_standard_naming_frequencies:
            return None
        return self.period['name']

    @property
    def subheader(self):
        """ Name for Lop/MidEnd/monthly is the subheader on the excel report, label for other time-aware"""
        if self.frequency in self.non_standard_naming_frequencies:
            return self.period['name']
        return self.period['label']


class WebIPTTPeriod(BasePeriod):
    @property
    def target_column(self):
        return {**super().target_column, **{
            'attribute': (
                'lop_target_real' if self.is_lop
                    else f"frequency_{self.ferquency}_period_{self.period_count}_target"
                ),
            'disaggregation_attribute': None
        }}

    @property
    def actual_column(self):
        return {**super().actual_column, **{
            'attribute': (
                'lop_actual' if self.is_lop
                    else f"frequency_{self.ferquency}_period_{self.period_count}"
                ),
            'disaggregation_attribute': (
                'disaggregation_{}_lop_actual' if self.is_lop
                    else "disaggregation_{}_" + f"frequency_{self.frequency}_period_{self.period_count}"
                ),
        }}

    @property
    def met_column(self):
        return {**super().met_column, **{
            'attribute': (
                'lop_met_target_decimal' if self.is_lop else None
                ),
            'disaggregation_attribute': None
        }}

class IPTTExcelPeriod(BasePeriod):
    @property
    def count(self):
        return None if self.is_lop else self.period_count


class QSPeriodDateRangeSerializer(serializers.Serializer):
    past = serializers.SerializerMethodField()

    def get_past(self, period):
        return period['start'] < self.context.get('now', timezone.now().date())


class PeriodDateRangeSerializer(serializers.Serializer):
    start = serializers.DateField()
    end = serializers.DateField()
    name = serializers.SerializerMethodField()
    label = serializers.CharField()
    start_label = serializers.SerializerMethodField()
    end_label = serializers.SerializerMethodField()
    past = serializers.SerializerMethodField()
    year = serializers.SerializerMethodField()

    def get_start_label(self, period):
        return l10n_date_medium(period['start'], decode=True)

    def get_end_label(self, period):
        return l10n_date_medium(period['end'], decode=True)

    def get_past(self, period):
        return period['start'] < timezone.now().date()

    def get_name(self, period):
        if self.context.get('frequency') == 7:
            return l10n_monthname(period['start'], decode=True)
        return _(period['name'])

    def get_year(self, period):
        return period['start'].year

