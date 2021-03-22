from adminsortable2.admin import SortableInlineAdminMixin
from django.contrib import admin
from django.db import models
from django.utils.encoding import force_text
from django.utils.translation import gettext_lazy as _
from django.utils.html import format_html
from indicators.models import (
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


class BooleanListFilterWithDefault(admin.SimpleListFilter):
    all_value = 'all'

    def default_value(self):
        raise NotImplementedError()

    def value(self):
        return force_text(super().value() if super().value() is not None else self.default_value())

    def choices(self, changelist):
        for lookup, title in self.lookup_choices:
            yield {
                'selected': self.value() == force_text(lookup),
                'query_string': changelist.get_query_string({self.parameter_name: lookup}, []),
                'display': title
            }
        yield {
            'selected': self.value() == force_text(self.all_value),
            'query_string': changelist.get_query_string({self.parameter_name: self.all_value}, []),
            'display': _('Show all')
        }

    def queryset(self, request, queryset):
        if self.value() == '0':
            queryset = queryset.filter(is_archived=False)
        elif self.value() == '1':
            queryset = queryset.filter(is_archived=True)
        return queryset


class ArchivedFilter(BooleanListFilterWithDefault):
    title = _('status')
    parameter_name = 'is_archived'

    def lookups(self, request, model_admin):
        return (
            # Translators:  This is a filter option that allows users to limit results based on status of archived or not-archived
            (0, _('Active (not archived)')),
            # Translators:  This is a filter option that allows users to limit results based on status of archived or not-archived
            (1, _('Inactive (archived)'))
        )

    def default_value(self):
        return 0


# TODO: is this obsolete?
class IndicatorResource(resources.ModelResource):

    indicator_type = ManyToManyWidget(IndicatorType, separator=" | ", field="indicator_type")
    objective = ManyToManyWidget(Objective, separator=" | ", field="objective")
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
                  'data_issues', 'comments', 'disaggregation', 'sector',
                  'program')


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
    list_display = ('indicator_types', 'name', 'sector')
    search_fields = ('name', 'number', 'program__name')
    list_filter = (IndicatorListFilter, 'sector')
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


class DisaggregationCategoryAdmin(SortableInlineAdminMixin, admin.StackedInline):
    model = DisaggregationLabel
    min_num = 2
    extra = 0
    # Translators:  This is label text for an individual category in a listing of disaggregation categories
    verbose_name = _('Category')
    # Translators:  This is label text for a listing of disaggregation categories
    verbose_name_plural = _('Categories')
    fieldsets = (
        (None, {'fields': ('customsort', ('label', 'indicator_count')),
                'classes': ('inline-fieldset',)}),
        )
    readonly_fields = ('indicator_count',)

    def indicator_count(self, instance):
        # TODO: make this accurate (easier to do after indicator form / results form in place for testing)
        # return Indicator.rf_aware_objects.filter(result__disaggregation_value__disaggregation_label=instance).count()
        return 4


class DisaggregationAdmin(admin.ModelAdmin):
    """Abstract base class for the two kinds of disaggregation admins (country and global)"""
    display = _('Disaggregation')
    inlines = [
        DisaggregationCategoryAdmin,
    ]

    class Media:
        js = (
            'js/admin/disaggregation_admin.js',
        )
        css = {
            'all': ('css/admin/inline_forms.css',)
        }

    def program_count(self, instance):
        """returns a count of how many programs have indicators to which this disaggregation is assigned"""
        return instance.program_count_annotation
    program_count.admin_order_field = 'program_count_annotation'

    def pretty_archived(self, instance):
        """replaces the boolean check/X display, which seemed inappropriate for archived (red X for active)"""
        return format_html(
            '<span style="color: {};">{}</span>',
            'red' if instance.is_archived else 'green',
            'No' if instance.is_archived else 'Yes'
        )
    pretty_archived.short_description = 'Active'

    def categories(self, instance):
        """returns a truncated, comma-separated list of the categories (labels) for a given disaggregation"""
        labels = ', '.join([category.label for category in instance.disaggregationlabel_set.all()])
        return (labels[:self.COLUMN_WIDTH-3] + '...') if len(labels) > self.COLUMN_WIDTH else labels

    def get_queryset(self, request):
        """annotation (programs using disaggregation) and filter (is or is not global)"""
        return super().get_queryset(request).filter(standard=self.STANDARD).annotate(
            program_count_annotation=models.Subquery(
                Indicator.rf_aware_objects.filter(
                    disaggregation=models.OuterRef('pk')
                ).values('disaggregation').order_by().annotate(
                    program_count=models.Count('program', distinct=True),
                ).values('program_count')[:1],
                output_field=models.IntegerField()
            ))

class GlobalDisaggregation(DisaggregationType):
    """Proxy model to allow for two admins for one model (disaggregation)"""
    class Meta:
        proxy = True


@admin.register(GlobalDisaggregation)
class GlobalDisaggregationAdmin(DisaggregationAdmin):
    list_display = ('disaggregation_type', 'pretty_archived', 'program_count', 'categories')
    list_filter = (ArchivedFilter,)
    sortable_by = ('disaggregation_type', 'program_count')
    exclude = ('create_date', 'edit_date', 'country', 'standard')
    STANDARD = True # shows only standard (global) disaggregations
    COLUMN_WIDTH = 70 # width of the "categories list" column before truncation

    def save_model(self, request, obj, form, change):
        """ensure on save that standard is true and country is blank - this is the global admin"""
        obj.standard = True
        obj.country = None
        super().save_model(request, obj, form, change)


class CountryDisaggregation(DisaggregationType):
    """Proxy model to allow for two admins for one model (disaggregation)"""
    class Meta:
        proxy = True


@admin.register(CountryDisaggregation)
class CountryDisaggregationAdmin(DisaggregationAdmin):
    list_display = ('disaggregation_type', 'country', 'pretty_archived', 'program_count', 'categories')
    list_filter = (ArchivedFilter, 'country')
    sortable_by = ('disaggregation_type', 'program_count', 'country')
    exclude = ('create_date', 'edit_date', 'standard',)
    STANDARD = False
    COLUMN_WIDTH = 50

    def save_model(self, request, obj, form, change):
        obj.standard = False
        super().save_model(request, obj, form, change)


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
admin.site.register(Result, ResultAdmin)
admin.site.register(Objective, ObjectiveAdmin)
admin.site.register(StrategicObjective, StrategicObjectiveAdmin)
admin.site.register(Level)
admin.site.register(ExternalService, ExternalServiceAdmin)
admin.site.register(ExternalServiceRecord, ExternalServiceRecordAdmin)
admin.site.register(DataCollectionFrequency)
admin.site.register(PeriodicTarget, PeriodicTargetAdmin)
