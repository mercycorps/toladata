# -*- coding: utf-8 -*-
from rest_framework import serializers
from django.utils import timezone, formats
from django.utils.translation import ugettext, ugettext_lazy
from operator import attrgetter
from tola.l10n_utils import l10n_date_medium

from workflow.models import Program
from indicators.models import Indicator, Level, LevelTier, LevelTierTemplate, PeriodicTarget, Objective
from indicators.queries import IPTTIndicator
from indicators.export_renderers import (
    FullReportExcelRenderer,
    OneSheetExcelRenderer,
    EM_DASH,
)



#######################
#      PROGRAM PAGE   #
#######################


class LevelSerializer(serializers.ModelSerializer):
    """
    Level serializer for Program Page
    """
    level_depth = serializers.IntegerField(source='get_level_depth', read_only=True)

    class Meta:
        model = Level
        fields = [
            'id',
            'parent',
            'name',
            'assumptions',
            'program',
            'customsort',
            'ontology',
            'level_depth'
        ]
        read_only_fields = ['level_depth', 'ontology']


class LevelTierSerializer(serializers.ModelSerializer):
    """
    LevelTier serializer for Program Page
    """
    class Meta:
        model = LevelTier
        fields = [
            'id',
            'name',
            'tier_depth'
        ]


class LevelTierTemplateSerializer(serializers.ModelSerializer):
    """
    LevelTierTemplate serializer for RF builder
    """
    names = serializers.SerializerMethodField()
    class Meta:
        model = LevelTierTemplate
        fields = [
            'id',
            'names',
        ]

    def get_names(self, obj):
        return list(obj.names)


class IndicatorSerializerMinimal(serializers.ModelSerializer):

    class Meta:
        model = Indicator
        fields = [
            'id',
            'name',
            'level',
            'level_order',
            'number',
        ]


class IndicatorSerializer(serializers.ModelSerializer):
    """
    Serializer specific to the Program Page
    """
    number_if_numbering = serializers.SerializerMethodField()
    reporting = serializers.BooleanField()
    all_targets_defined = serializers.IntegerField()
    results_count = serializers.IntegerField()
    results_with_evidence_count = serializers.IntegerField()
    over_under = serializers.IntegerField()
    target_period_last_end_date = serializers.DateField()
    level = LevelSerializer(read_only=True)
    lop_target_active = serializers.FloatField()
    old_level = serializers.SerializerMethodField()
    old_level_pk = serializers.IntegerField(read_only=True)

    class Meta:
        model = Indicator
        fields = [
            'id',
            'name',
            'number_display',
            'number',
            'level',
            'old_level',
            'old_level_pk',
            'level_order',
            'unit_of_measure',
            'unit_of_measure_type',
            'baseline',
            'baseline_na',
            'lop_target_active',
            'key_performance_indicator',
            'just_created',

            # DB annotations
            #  whether indicator progress towards targets is reported
            #  (min. one target period complete, one result reported):
            'reporting',
            'all_targets_defined',  # whether all targets are defined for this indicator
            'results_count',
            'results_with_evidence_count',
            'target_period_last_end_date', # last end date of last target period, for time-aware indicators
            'over_under',  # indicator progress towards targets (1: over, 0: within 15% of target, -1: under, "None": non reporting
            'number_if_numbering', # only a number if the program is on manual numbers
        ]

    def get_number_if_numbering(self, obj):
        if obj.results_framework and obj.program.auto_number_indicators:
            return None
        return obj.number

    def get_old_level(self, obj):
        return ugettext(obj.old_level) if obj.old_level else None



class ProgramSerializer(serializers.ModelSerializer):
    """
    Serializer specific to the Program Page
    """
    class Meta:
        model = Program
        fields = [
            'id',
            'pk',
            'name',
            'does_it_need_additional_target_periods',
            'reporting_period_start',
            'reporting_period_end',
            'results_framework',
            'auto_number_indicators'
        ]


##################################
#    Results Framework Builder   #
##################################


class ProgramObjectiveSerializer(serializers.ModelSerializer):

    class Meta:
        model = Objective
        fields = [
            'id',
            'name',
            'description',
        ]


#######################
#    INDICATOR PLAN   #
#######################


class IndicatorPlanIndicatorSerializerBase(serializers.ModelSerializer):
    """
    Serializer for the indicator plan page and excel export
    """
    tier_name_only = serializers.SerializerMethodField()
    disaggregation = serializers.StringRelatedField(many=True)
    is_cumulative = serializers.SerializerMethodField()
    baseline = serializers.SerializerMethodField()
    lop_target = serializers.SerializerMethodField()
    data_collection_frequency = serializers.StringRelatedField()
    reporting_frequency = serializers.StringRelatedField()

    class Meta:
        model = Indicator
        fields = [
            'id',
            'tier_name_only',
            'results_aware_number',
            'level_order',
            'name',
            'source',
            'definition',
            'disaggregation',
            'unit_of_measure',
            'get_direction_of_change_display',
            'get_unit_of_measure_type_display',
            'is_cumulative',
            'baseline',
            'lop_target',
            'rationale_for_target',
            'get_target_frequency_display',
            'means_of_verification',
            'data_collection_method',
            'data_collection_frequency',
            'data_points',
            'responsible_person',
            'method_of_analysis',
            'information_use',
            'reporting_frequency',
            'quality_assurance',
            'data_issues',
            'comments',
        ]

    def get_lop_target(self, obj):
        return obj.calculated_lop_target

    def get_tier_name_only(self, obj):
        if obj.results_framework and obj.level and obj.level.leveltier:
            return obj.level.leveltier.name
        elif not obj.results_framework and obj.old_level:
            return obj.old_level
        return None

    def get_is_cumulative(self, obj):
        if obj.target_frequency == Indicator.LOP:
            return None
        return obj.is_cumulative

    def get_baseline(self, obj):
        if obj.baseline_na:
            return None
        return obj.baseline

    def to_representation(self, instance):
        data = super(IndicatorPlanIndicatorSerializerBase, self).to_representation(instance)
        for field in data:
            data[field] = self.render_value(field, instance, data)
        return data


class IndicatorFormatsMixin(object):
    translateable_fields = (
        'tier_name_only',
        'get_direction_of_change_display',
        'get_unit_of_measure_type_display',
    )
    method_fields = (
        'is_cumulative',
        'disaggregation',
    )
    bullet_list_fields = (
        'disaggregation',
    )
    numeric_fields = (
        'baseline',
        'lop_target',
    )
    em_dash_fields = (
        'results_aware_number',
    )
    not_applicable_fields = (
        'baseline',
        'is_cumulative',
    )

    def format_is_cumulative(self, value, **kwargs):
        if value is True:
            # Translators: C stands for Cumulative (targets are summative)
            return self.get_translated('C')
        elif value is False:
            # Translators: NC stands for Not Cumulative (targets do not sum over time)
            return self.get_translated('NC')
        return value

    def format_disaggregation(self, value, **kwargs):
        return [self.get_translated(v) for v in value] if value else None

    def format_list(self, value):
        return value if value is None else "\n".join(u'-{}'.format(item) for item in value)

    def render_value(self, field, instance, data):
        value = data.get(field, None)
        if value == '' or value is False or value == []:
            value = None
        if field in self.translateable_fields:
            value = self.get_translated(value)
        if field in self.method_fields:
            if hasattr(self, 'format_{}'.format(field)):
                value = getattr(self, 'format_{}'.format(field))(
                    value, instance=instance, data=data
                    )
        if field in self.numeric_fields:
            value = self.format_numeric(value, instance)
        if field in self.bullet_list_fields:
            value = self.format_list(value)
        if value is None:
            if field in self.em_dash_fields:
                value = EM_DASH
            elif field in self.not_applicable_fields:
                value = self.get_translated('N/A')
            else:
                value = u''
        return value


class IndicatorWebMixin(IndicatorFormatsMixin):
    def get_translated(self, value):
        return value if value is None else ugettext_lazy(value)

    def format_numeric(self, value, indicator, decimal_places=2):
        if value is None:
            return value
        try:
            f_value = round(float(value), decimal_places)
            f_value = int(value) if f_value.is_integer() else f_value
        except ValueError:
            return value
        else:
            value = formats.number_format(f_value, use_l10n=True)
            if indicator.unit_of_measure_type == indicator.PERCENTAGE:
                value = u'{}%'.format(value)
            return value


class IndicatorExcelMixin(IndicatorFormatsMixin):
    def get_translated(self, value):
        return value if value is None else ugettext(value)

    def format_numeric(self, value, indicator, decimal_places=2):
        if value is None:
            return value
        if indicator.unit_of_measure_type == indicator.PERCENTAGE:
            return self.format_percentage(float(value)/100, indicator, decimal_places)
        try:
            f_value = round(float(value), decimal_places)
            if f_value.is_integer():
                return {
                    'value': int(value),
                    'number_format': '0'
                    }
            elif round(float(value), 1) == f_value:
                return {
                    'value': round(float(value), 1),
                    'number_format': '0.0'
                }
            return {
                'value': f_value,
                'number_format': '0.00'
            }
        except ValueError:
            return value

    def format_percentage(self, value, indicator, decimal_places=2):
        if value is None:
            return value
        try:
            f_value = round(float(value), decimal_places+2)
            if f_value == round(float(value), decimal_places):
                return {
                    'value': round(float(value), decimal_places),
                    'number_format': '0%'
                    }
            elif round(float(value), decimal_places+1) == f_value:
                return {
                    'value': round(float(value), decimal_places+1),
                    'number_format': '0.0%'
                }
            return {
                'value': f_value,
                'number_format': '0.00%'
            }
        except ValueError:
            return value

    def render_value(self, field, instance, data):
        value = super(IndicatorExcelMixin, self).render_value(field, instance, data)
        if type(value) == dict and 'value' in value:
            pass
        elif value is None:
            value = {
                'value': u'',
                'number_format': 'General'
            }
        else:
            value = {
                'value': unicode(value),
                'number_format': 'General'
            }
        value.update({
            'field': field
        })
        return value


class IndicatorPlanIndicatorWebSerializer(IndicatorWebMixin, IndicatorPlanIndicatorSerializerBase):
    pass


class IndicatorPlanIndicatorExcelSerializer(IndicatorExcelMixin, IndicatorPlanIndicatorSerializerBase):
    pass


class IndicatorPlanLevelSerializerBase(serializers.ModelSerializer):
    """
    Level serializer for the indicator plan page and excel export
    """
    display_name = serializers.SerializerMethodField()

    class Meta:
        model = Level
        fields = [
            'id',
            'display_name',
            'indicator_set'
        ]


    def get_display_name(self, obj):
        tier = ugettext(obj.leveltier.name) if obj.leveltier else u''
        ontology = obj.display_ontology if obj.display_ontology else u''
        name = unicode(obj.name)
        #return u' '.join([w for w in [tier, ontology, name] if w is not None])
        return u'{tier}{tier_space}{ontology}{colon}{name}'.format(
            tier=tier,
            tier_space=u' ' if tier and ontology else u'',
            ontology=ontology,
            colon=u': ' if (tier or ontology) else u'',
            name=name
        )


class IndicatorPlanLevelWebSerializer(IndicatorPlanLevelSerializerBase):
    indicator_set = IndicatorPlanIndicatorWebSerializer(many=True, read_only=True)


class IndicatorPlanLevelExcelSerializer(IndicatorPlanLevelSerializerBase):
    indicator_set = IndicatorPlanIndicatorExcelSerializer(many=True, read_only=True)



#######################
#      IPTT           #
#######################



class IPTTProgramSerializer(ProgramSerializer):
    reporting_period_start = serializers.DateField(format=None)
    reporting_period_end = serializers.DateField(format=None)



class Period:

    @classmethod
    def lop_period(cls):
        return cls(1, {
            'name': ugettext('Life of Program')
        }, True)

    def __init__(self, frequency, period, tva=False):
        self.period = period
        self.frequency = int(frequency)
        self.tva = tva

    @property
    def period_count(self):
        return self.period['customsort']

    @property
    def target_attribute(self):
        if self.frequency == 1:
            return 'lop_target_real'
        else:
            return 'frequency_{f}_period_{p}_target'.format(f=self.frequency, p=self.period_count)

    @property
    def actual_attribute(self):
        if self.frequency == 1:
            return 'lop_actual'
        else:
            return 'frequency_{f}_period_{p}'.format(f=self.frequency, p=self.period_count)

    @property
    def start_display(self):
        return l10n_date_medium(self.period['start'])

    @property
    def end_display(self):
        return l10n_date_medium(self.period['end'])

    @property
    def header(self):
        """LOP/MidEnd/Monthly have no header, just the label, time-aware has the period name"""
        if self.frequency in [1, 2, 7]:
            return None
        return self.period['name']

    @property
    def subheader(self):
        """ Name for Lop/MidEnd/monthly is the subheader on the excel report, label for other time-aware"""
        if self.frequency in [1, 2, 7]:
            return self.period['name']
        return self.period['label']


class IPTTFullReportSerializerMixin:
    indicator_qs = IPTTIndicator.tva
    period_column_count = 3
    frequencies = [1, 2, 3, 4, 5, 6, 7]

    @property
    def report_name(self):
        return ugettext('IPTT TvA full program report')

    def annotate_indicators(self, indicators):
        self._all_indicators = indicators
        indicators = indicators.with_frequency_annotations(
            'all',
            self.program_data['reporting_period_start'],
            self.program_data['reporting_period_end']
        )
        indicators_by_frequency = {
            frequency: [
                indicator for indicator in indicators if indicator.target_frequency == frequency
                ] for frequency in self.frequencies}
        return indicators_by_frequency


    @property
    def indicators(self):
        if not self.program_data['results_framework']:
            old_level_pk = {level: pk for (pk, level) in Indicator.OLD_LEVELS}
            return sorted(self._indicators.get(self.frequency, []), key=lambda i: old_level_pk.get(i.old_level, 100))
        return self._indicators.get(self.frequency, [])

    @property
    def blank_level_row(self):
        return [
            indicator for indicator in self.indicators if indicator.level_id is None
            ]

    @property
    def level_rows(self):
        if not self.program_data['results_framework']:
            return False
        return self._level_rows.get(self.frequency, [])


    def get_period(self, frequency, period_dict):
        return Period(frequency, period_dict, tva=True)

    def get_rf_levels(self):
        if self.request.get('groupby') == '2':
            sorted_levels = sorted(
                sorted(Level.objects.filter(program_id=self.program_data['pk']),
                       key=lambda level: level.ontology),
                key=lambda level: level.get_level_depth())
        else:
            sorted_levels = []
            levels = Level.objects.filter(
                program_id=self.program_data['pk'],
                parent_id__isnull=True
            )
            for level in levels:
                sorted_levels.append(level)
                sorted_levels += level.get_children()
        level_rows = {}
        for frequency in self.frequencies:
            level_rows[frequency] = []
            for level in sorted_levels:
                indicators = [indicator for indicator in self._indicators.get(frequency) if indicator.level_id == level.pk]
                if indicators or level.parent is None:
                    level_rows[frequency].append({
                        'level': level,
                        'indicators': indicators
                    })
        return level_rows


class IPTTTVASerializerMixin:
    indicator_qs = IPTTIndicator.tva
    period_column_count = 3

    @property
    def report_name(self):
        return ugettext('IPTT TvA report')

    def annotate_indicators(self, indicators):
        frequency = int(self.request.get('frequency'))
        indicators = indicators.filter(target_frequency=frequency)
        return indicators.with_frequency_annotations(
            frequency,
            self.program_data['reporting_period_start'],
            self.program_data['reporting_period_end']
        )

    def get_period(self, frequency, period_dict):
        return Period(frequency, period_dict, tva=True)

    def get_rf_levels(self):
        if self.request.get('groupby') == '2':
            sorted_levels = sorted(
                sorted(Level.objects.filter(program_id=self.program_data['pk']),
                       key=lambda level: level.ontology),
                key=lambda level: level.get_level_depth())
        else:
            sorted_levels = []
            levels = Level.objects.filter(
                program_id=self.program_data['pk'],
                parent_id__isnull=True
            )
            for level in levels:
                sorted_levels.append(level)
                sorted_levels += level.get_children()
        for level in sorted_levels:
            level_row = {
                'level': level,
                'indicators': [indicator for indicator in self.indicators.filter(level=level)]
            }
            if level_row['indicators'] or level.parent is None:
                yield level_row


class IPTTTimeperiodsSerializerMixin:
    indicator_qs = IPTTIndicator.timeperiods
    period_column_count = 1

    @property
    def report_name(self):
        return ugettext('IPTT Actuals only report')

    def annotate_indicators(self, indicators):
        frequency = int(self.request.get('frequency'))
        return indicators.with_frequency_annotations(
            frequency,
            self.program_data['reporting_period_start'],
            self.program_data['reporting_period_end']
            )

    def get_period(self, frequency, period_dict):
        return Period(frequency, period_dict, tva=False)

    def get_rf_levels(self):
        if self.request.get('groupby') == '2':
            sorted_levels = sorted(
                sorted(Level.objects.filter(program_id=self.program_data['pk']),
                       key=lambda level: level.ontology),
                key=lambda level: level.get_level_depth())
        else:
            sorted_levels = []
            levels = Level.objects.filter(
                program_id=self.program_data['pk'],
                parent_id__isnull=True
            )
            for level in levels:
                sorted_levels.append(level)
                sorted_levels += level.get_children()
        for level in sorted_levels:
            level_row = {
                'level': level,
                'indicators': [indicator for indicator in self.indicators.filter(level=level)]
            }
            if level_row['indicators'] or level.parent is None:
                yield level_row

class IPTTJSONRendererMixin:
    full_report = False
    filters = False # JSON never filters - all data sent to client and filtered in React

    def get_periods(self):
        frequency = int(self.request.get('frequency'))
        return [
            self.get_period(frequency, period_dict)
            for period_dict in PeriodicTarget.generate_for_frequency(
                int(self.request.get('frequency')))(
                    self.program_data['reporting_period_start'],
                    self.program_data['reporting_period_end']
                )
            ]

    def load_indicators(self):
        return self.indicator_qs.filter(program_id=self.program_data['pk'])


class IPTTExcelRendererBase(object):

    @property
    def filename(self):
        report_date = l10n_date_medium(timezone.now().date())
        return u'{name} {report_date}.xlsx'.format(name=self.report_name, report_date=report_date)

    @property
    def report_date_range(self):
        if self.frequency == 1:
            return u'{} – {}'.format(self.program_data['reporting_period_start'],
                                     self.program_data['reporting_period_end'])
        periods = self.get_periods(self.frequency)
        return u'{} – {}'.format(periods[0].start_display.decode('utf-8'), periods[-1].end_display.decode('utf-8'))

    @property
    def all_periods_for_frequency(self):
        yield Period.lop_period()
        for period in self.get_periods(self.frequency):
            yield period

    @property
    def column_count(self):
        return 12 + (self.level_column and 1) + (
            len(self.get_periods(self.frequency)) * self.period_column_count
            )

    def get_periods(self, frequency):
        if frequency == 1:
            return []
        periods = [
            self.get_period(frequency, period_dict)
            for period_dict in PeriodicTarget.generate_for_frequency(frequency)(
                self.program_data['reporting_period_start'],
                self.program_data['reporting_period_end']
            )
        ]
        start = int(self.request.get('start', 0))
        end = self.request.get('end', None)
        if end is not None:
            end = int(end) + 1
        return periods[start:end]

    def old_level_sort_indicators(self, indicators):
        old_level_pk = {level: pk for (pk, level) in Indicator.OLD_LEVELS}
        return sorted(indicators, key=attrgetter('old_level_pk'))

    @property
    def indicators(self):
        indicators = self._indicators
        if not self.program_data['results_framework']:
            indicators = self.old_level_sort_indicators(indicators)
        return indicators

    def render(self, request):
        return self.renderer_class(self).render()


class IPTTFullReportExcelRendererMixin(IPTTExcelRendererBase):
    full_report = True
    renderer_class = FullReportExcelRenderer

    def load_indicators(self):
        return self.indicator_qs.filter(program_id=self.program_data['pk'])



class IPTTSingleExcelRendererMixin(IPTTExcelRendererBase):
    full_report = False
    renderer_class = OneSheetExcelRenderer

    def load_indicators(self):
        indicators = self.indicator_qs.filter(program_id=self.program_data['pk'])
        if not self.program_data['results_framework'] or not self.program_data['auto_number_indicators']:
            indicators = indicators.with_logframe_sorting()
        filter_params = ['sites', 'types', 'sectors', 'indicators']
        filters = {param: self.request.getlist(param) for param in self.request.viewkeys() & filter_params}
        if self.request.getlist('levels'):
            if self.program_data['results_framework']:
                filters['levels'] = [level.pk for levels in [
                    [level] + level.get_children()
                    for level in Level.objects.filter(pk__in=self.request.getlist('levels'))
                    ] for level in levels]
            else:
                filters['levels'] = self.request.getlist('levels')
        if self.request.getlist('tiers'):
            tier_depths = [tier.tier_depth for tier in LevelTier.objects.filter(pk__in=self.request.getlist('tiers'))]
            filters['levels'] = [
                level.pk for level in Level.objects.filter(program_id=self.program_data['pk'])
                if level.get_level_depth() in tier_depths
            ]
        if not filters:
            self.filters = False
        else:
            self.filters = filters
            filters['old_levels'] = not self.program_data['results_framework']
            indicators = indicators.apply_filters(**filters)
        return indicators

    @property
    def blank_level_row(self):
        return [indicator for indicator in self.indicators.filter(level__isnull=True).with_logframe_sorting()]

    @property
    def level_rows(self):
        if not self.program_data['results_framework'] or len(self.blank_level_row) == len(self.indicators):
            return False
        return self._level_rows


class IPTTSerializer(object):
    TIMEPERIODS_JSON = 1
    TVA_JSON = 2
    TIMEPERIODS_EXCEL = 3
    TVA_EXCEL = 4
    TVA_FULL_EXCEL = 5
    REPORT_TYPES = {
        TIMEPERIODS_JSON: None,
        TVA_JSON: [IPTTJSONRendererMixin,],
        TIMEPERIODS_EXCEL: [IPTTTimeperiodsSerializerMixin, IPTTSingleExcelRendererMixin],
        TVA_EXCEL: [IPTTTVASerializerMixin, IPTTSingleExcelRendererMixin],
        TVA_FULL_EXCEL: [IPTTFullReportSerializerMixin, IPTTFullReportExcelRendererMixin]
    }

    def __new__(cls, report_type, request, **kwargs):
        if report_type not in cls.REPORT_TYPES or cls.REPORT_TYPES[report_type] is None:
            raise NotImplementedError("report type not supported")
        else:
            kwargs.update({'request': request})
            kwargs.update({'report_title': ugettext('Indicator Performance Tracking Report')})
            return object.__new__(type(
                'IPTTReportSerializer', tuple(cls.REPORT_TYPES[report_type] + [IPTTSerializer]), kwargs
                ))

    def __init__(self, *args, **kwargs):
        self.program_data = IPTTProgramSerializer(
            Program.objects.get(pk=self.request.get('programId'))
            ).data
        self._indicators = self.annotate_indicators(self.load_indicators())
        if self.program_data['results_framework']:
            self._level_rows = self.get_rf_levels()
        if not self.full_report:
            self.frequency = int(self.request.get('frequency'))
            self.periods = self.get_periods(self.frequency)

    @property
    def program_name(self):
        return self.program_data['name']

    @property
    def level_column(self):
        return not self.program_data['results_framework']

    @property
    def indicators(self):
        return self._indicators
