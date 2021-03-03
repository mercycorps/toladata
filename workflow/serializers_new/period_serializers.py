"""Serializes period data for IPTT web/excel exports"""

from rest_framework import serializers
from indicators.models import Indicator
from tola.l10n_utils import l10n_date_medium, l10n_monthname
from django.utils import timezone
from django.utils.translation import ugettext as _


class IPTTExcelPeriod:
    """Serializable object holding data about a specific period for IPTT Excel export renderer

        contains TvA/actuals-only, header labels, date (subheader) display labels, and count
    """
    non_standard_naming_frequencies = [Indicator.LOP, Indicator.MID_END, Indicator.MONTHLY]

    @classmethod
    def lop_period(cls):
        return cls(Indicator.LOP, {
            'name': _('Life of Program')
        }, True)

    def __init__(self, frequency, period, tva=False):
        self.frequency = int(frequency)
        self.period = period # dict of period-specific data provided by indicators.models.PeriodicTarget
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

    # format here dictated by indicators.export_renderers report-specific renderers:
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

    @property
    def count(self):
        return None if self.is_lop else self.period_count


class QSPeriodDateRangeSerializer(serializers.Serializer):
    """Serializer for JSON output for IPTT Web (React) QuickStart page

        only needed for "number of most recent periods" logic (is this period 'past' or not?)
        Used by IPTTQSProgramSerializer
    """
    past = serializers.SerializerMethodField()

    def get_past(self, period):
        return period['start'] <= self.context.get('now', timezone.now().date())


class PeriodDateRangeSerializer(serializers.Serializer):
    """Serializer for JSON output for IPTT Web (React) Report page

        needed for labeling columns and providing date input to assemble header/subheader displays
        also used for calculating which periods to show using filters
    """
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
        if self.context.get('frequency') == 7: # monthly frequency means columns are named month names
            return l10n_monthname(period['start'], decode=True)
        return _(period['name'])

    def get_year(self, period):
        return period['start'].year
