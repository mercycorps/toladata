from django.contrib import admin
from .models import (
    Indicator, IndicatorType, Result, StrategicObjective, Objective, Level,
    ExternalService, ExternalServiceRecord, DataCollectionFrequency,
    DisaggregationType, PeriodicTarget, DisaggregationLabel, ReportingFrequency,
    ExternalServiceAdmin,
    ExternalServiceRecordAdmin,
    PeriodicTargetAdmin,
)
from workflow.models import Sector, Program, Country
from import_export import resources, fields
from import_export.widgets import ForeignKeyWidget, ManyToManyWidget
from import_export.admin import ImportExportModelAdmin
from simple_history.admin import SimpleHistoryAdmin


class IndicatorResource(resources.ModelResource):

    indicator_type = ManyToManyWidget(IndicatorType, separator=" | ", field="indicator_type")
    objective = ManyToManyWidget(Objective, separator=" | ", field="objective"),
    strategic_objective = ManyToManyWidget(StrategicObjective, separator=" | ", field="strategic_objective")
    level = ManyToManyWidget(Level, separator=" | ", field="level")
    reporting_frequency = fields.Field(column_name='reporting_frequency', attribute='reporting_frequency',
                                       widget=ForeignKeyWidget(ReportingFrequency, 'frequency'))
    sector = fields.Field(column_name='sector', attribute='sector', widget=ForeignKeyWidget(Sector, 'sector'))
    program = ManyToManyWidget(Program, separator=" | ", field="name")

    class Meta:
        model = Indicator
        fields = ('id', 'indicator_type', 'level', 'objective', 'strategic_objective', 'name', 'number',
                  'source', 'definition', 'justification', 'unit_of_measure', 'baseline', 'lop_target',
                  'rationale_for_target', 'means_of_verification', 'data_collection_method',
                  'data_collection_frequency', 'data_points', 'responsible_person',
                  'method_of_analysis', 'information_use', 'reporting_frequency', 'quality_assurance',
                  'data_issues', 'indicator_changes', 'comments', 'disaggregation', 'sector',
                  'program', 'key_performance_indicator')


class IndicatorListFilter(admin.SimpleListFilter):
    title = "Program"
    parameter_name = 'program'

    def lookups(self, request, model_admin):
        user_country = request.user.tola_user.country
        programs = Program.objects.filter(country__in=[user_country]).values('id', 'name')
        programs_tuple = ()
        for p in programs:
            programs_tuple = [(p['id'], p['name']) for p in programs]
        return programs_tuple

    def queryset(self, request, queryset):
        if self.value():
            queryset = queryset.filter(program__in=[self.value()])
        return queryset


class IndicatorAdmin(ImportExportModelAdmin, SimpleHistoryAdmin):
    resource_class = IndicatorResource
    list_display = ('indicator_types', 'name', 'sector', 'key_performance_indicator')
    search_fields = ('name', 'number', 'program__name')
    # ('program', 'key_performance_indicator', 'sector')
    list_filter = (IndicatorListFilter, 'key_performance_indicator', 'sector')
    display = 'Indicators'
    filter_horizontal = ('objectives', 'strategic_objectives', 'disaggregation')

    def get_queryset(self, request):
        queryset = super(IndicatorAdmin, self).get_queryset(request)
        if request.user.is_superuser is False:
            user_country = request.user.tola_user.country
            programs = Program.objects.filter(country__in=[user_country])
            queryset = queryset.filter(program__in=programs)
        return queryset


class CountryFilter(admin.SimpleListFilter):
    title = 'country'
    parameter_name = 'country'

    def lookups(self, request, model_admin):
        countries = Country.objects.all().values('id', 'country')
        if request.user.is_superuser is False:
            user_country = request.user.tola_user.country
            countries = countries.filter(pk=user_country.pk)
        countries_tuple = [(c['id'], c['country']) for c in countries]
        return countries_tuple

    def queryset(self, request, queryset):
        if self.value():
            if queryset.model == Objective:
                queryset = queryset.filter(program__country=self.value())
            else:
                queryset = queryset.filter(country=self.value())
        return queryset


class DisaggregationTypeFilter(admin.SimpleListFilter):
    title = "disaggregation type"
    parameter_name = 'disaggregationtype'

    def lookups(self, request, model_admin):
        user_country = request.user.tola_user.country
        disagg_types = DisaggregationType.objects.filter(country=user_country).values('id', 'disaggregation_type')
        disagg_types_tuple = ()
        for p in disagg_types:
            disagg_types_tuple = [(p['id'], p['disaggregation_type']) for p in disagg_types]
        return disagg_types_tuple

    def queryset(self, request, queryset):
        if self.value():
            if queryset.model == DisaggregationLabel:
                queryset = queryset.filter(disaggregation_type=self.value())
            elif queryset.model == DisaggregationType:
                queryset = queryset.filter(country=self.value())
        return queryset


class DisaggregationTypeAdmin(admin.ModelAdmin):
    list_display = ('disaggregation_type', 'country', 'standard', 'description')
    list_filter = (DisaggregationTypeFilter, CountryFilter, 'standard')
    display = 'Disaggregation Type'

    def get_queryset(self, request):
        queryset = super(DisaggregationTypeAdmin, self).get_queryset(request)
        if request.user.is_superuser is False:
            user_country = request.user.tola_user.country
            queryset = DisaggregationType.objects.filter(country=user_country)
        return queryset


class DisaggregationLabelAdmin(admin.ModelAdmin):
    list_display = ('disaggregation_type', 'customsort', 'label',)
    display = 'Disaggregation Label'
    list_filter = (DisaggregationTypeFilter, )  # ('disaggregation_type__disaggregation_type',)

    def get_queryset(self, request):
        queryset = super(DisaggregationLabelAdmin, self).get_queryset(request)
        if request.user.is_superuser is False:
            user_country = request.user.tola_user.country
            disagg_types = DisaggregationType.objects.filter(country=user_country).values('id')
            disagg_types_ids = [dt['id'] for dt in disagg_types]
            queryset = queryset.filter(disaggregation_type__in=disagg_types_ids)
        return queryset


class ObjectiveAdmin(admin.ModelAdmin):
    list_display = ('program', 'name')
    search_fields = ('name', 'program__name')
    list_filter = (CountryFilter,)   # ('program__country__country',)
    display = 'Program Objectives'

    def get_queryset(self, request):
        queryset = super(ObjectiveAdmin, self).get_queryset(request)
        if request.user.is_superuser is False:
            user_country = request.user.tola_user.country
            programs = Program.objects.filter(country__in=[user_country]).values('id')
            program_ids = [p['id'] for p in programs]
            queryset = queryset.filter(program__in=program_ids)
        return queryset


class StrategicObjectiveAdmin(admin.ModelAdmin):
    list_display = ('country', 'name')
    search_fields = ('country__country', 'name')
    list_filter = (CountryFilter,)  # ('country__country',)
    display = 'Country Strategic Objectives'

    def get_queryset(self, request):
        queryset = super(StrategicObjectiveAdmin, self).get_queryset(request)
        if request.user.is_superuser is False:
            user_country = request.user.tola_user.country
            queryset = queryset.filter(country=user_country)
        return queryset


class ResultResource(resources.ModelResource):
    class Meta:
        model = Result
        # import_id_fields = ['id']


class ResultAdmin(ImportExportModelAdmin, SimpleHistoryAdmin):
    resource_class = ResultResource
    list_display = ('indicator', 'program')
    search_fields = ('indicator', 'program', 'owner__username')
    list_filter = ('indicator__program__country__country', 'program', 'approved_by')
    display = 'Indicators Results'


class ReportingFrequencyAdmin(admin.ModelAdmin):
    list_display = ('frequency', 'description', 'create_date', 'edit_date')
    display = 'Reporting Frequency'


admin.site.register(IndicatorType)
admin.site.register(Indicator, IndicatorAdmin)
admin.site.register(ReportingFrequency)
admin.site.register(DisaggregationType, DisaggregationTypeAdmin)
admin.site.register(DisaggregationLabel, DisaggregationLabelAdmin)
admin.site.register(Result, ResultAdmin)
admin.site.register(Objective, ObjectiveAdmin)
admin.site.register(StrategicObjective, StrategicObjectiveAdmin)
admin.site.register(Level)
admin.site.register(ExternalService, ExternalServiceAdmin)
admin.site.register(ExternalServiceRecord, ExternalServiceRecordAdmin)
admin.site.register(DataCollectionFrequency)
admin.site.register(PeriodicTarget, PeriodicTargetAdmin)
