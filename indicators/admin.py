from adminsortable2.admin import SortableInlineAdminMixin
from django.contrib import admin
from django.db import models
from django.utils.encoding import force_text
from django.utils.translation import gettext_lazy as _
from django.utils.html import format_html
from indicators.models import (
    BulkIndicatorImportFile,
    DataCollectionFrequency,
    DisaggregationLabel, 
    DisaggregationType, 
    ExternalService, 
    ExternalServiceRecord, 
    IDAAOutcomeTheme,
    Indicator, 
    IndicatorType, 
    Level,
    LevelTier,
    LevelTierTemplate,
    Objective, 
    OutcomeTheme,
    PeriodicTarget, 
    PinnedReport,
    ReportingFrequency,
    Result, 
    StrategicObjective, 
)
from workflow.models import Sector, Program, Country
from import_export import resources, fields
from import_export.widgets import ForeignKeyWidget, ManyToManyWidget
from import_export.admin import ImportExportModelAdmin
from simple_history.admin import SimpleHistoryAdmin

DISAG_COUNTRY_ONLY = DisaggregationType.DISAG_COUNTRY_ONLY
DISAG_GLOBAL = DisaggregationType.DISAG_GLOBAL
DISAG_PARTICIPANT_COUNT = DisaggregationType.DISAG_PARTICIPANT_COUNT


#########
# Filters
#########

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



###########
# Resources
###########

# TODO: is this obsolete?
class IndicatorResource(resources.ModelResource):

    indicator_type = ManyToManyWidget(IndicatorType, separator=" | ", field="indicator_type")
    objective = ManyToManyWidget(Objective, separator=" | ", field="objective")
    strategic_objective = ManyToManyWidget(StrategicObjective, separator=" | ", field="strategic_objective")
    level = ManyToManyWidget(Level, separator=" | ", field="level")
    reporting_frequencies = ManyToManyWidget(ReportingFrequency, separator=" | ", field="frequency")
    data_collection_frequencies = ManyToManyWidget(DataCollectionFrequency, separator=" | ", field="frequency")
    sector = fields.Field(column_name='sector', attribute='sector', widget=ForeignKeyWidget(Sector, 'sector'))
    program = ManyToManyWidget(Program, separator=" | ", field="name")

    class Meta:
        model = Indicator
        fields = ('id', 'indicator_type', 'level', 'objective', 'strategic_objective', 'name', 'number',
                  'source', 'definition', 'justification', 'unit_of_measure', 'baseline', 'lop_target',
                  'rationale_for_target', 'means_of_verification', 'data_collection_method',
                  'data_collection_frequencies', 'data_points', 'responsible_person',
                  'method_of_analysis', 'information_use', 'reporting_frequencies', 'quality_assurance',
                  'data_issues', 'comments', 'disaggregation', 'sector',
                  'program')


class ResultResource(resources.ModelResource):
    class Meta:
        model = Result
        # import_id_fields = ['id']


#########################
# Customized model admins
#########################

@admin.register(Indicator)
class IndicatorAdmin(ImportExportModelAdmin, SimpleHistoryAdmin):
    resource_class = IndicatorResource
    list_display = ('indicator_types', 'name', 'sector')
    search_fields = ('name', 'number', 'program__name')
    list_filter = (IndicatorListFilter, 'sector')
    filter_horizontal = ('objectives', 'strategic_objectives', 'disaggregation')

    def get_queryset(self, request):
        queryset = super(IndicatorAdmin, self).get_queryset(request)
        if request.user.is_superuser is False:
            user_country = request.user.tola_user.country
            programs = Program.objects.filter(country__in=[user_country])
            queryset = queryset.filter(program__in=programs)
        return queryset


@admin.register(ExternalService)
class ExternalServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'url', 'feed_url', 'create_date', 'edit_date')


@admin.register(ExternalServiceRecord)
class ExternalServiceRecordAdmin(admin.ModelAdmin):
    list_display = ('external_service', 'full_url', 'record_id', 'create_date',
                    'edit_date')


@admin.register(PeriodicTarget)
class PeriodicTargetAdmin(admin.ModelAdmin):
    list_display = ('period', 'target', 'customsort',)
    list_filter = ('period',)
    search_fields = ('indicator',)


@admin.register(Objective)
class ObjectiveAdmin(admin.ModelAdmin):
    list_display = ('program', 'name')
    search_fields = ('name', 'program__name')
    list_filter = (CountryFilter,)   # ('program__country__country',)

    def get_queryset(self, request):
        queryset = super(ObjectiveAdmin, self).get_queryset(request)
        if request.user.is_superuser is False:
            user_country = request.user.tola_user.country
            programs = Program.objects.filter(country__in=[user_country]).values('id')
            program_ids = [p['id'] for p in programs]
            queryset = queryset.filter(program__in=program_ids)
        return queryset


@admin.register(StrategicObjective)
class StrategicObjectiveAdmin(admin.ModelAdmin):
    list_display = ('country', 'name')
    search_fields = ('country__country', 'name')
    list_filter = (CountryFilter,)  # ('country__country',)

    def get_queryset(self, request):
        queryset = super(StrategicObjectiveAdmin, self).get_queryset(request)
        if request.user.is_superuser is False:
            user_country = request.user.tola_user.country
            queryset = queryset.filter(country=user_country)
        return queryset


@admin.register(Result)
class ResultAdmin(ImportExportModelAdmin, SimpleHistoryAdmin):
    resource_class = ResultResource
    list_display = (
        'indicator',
        'date_collected',
        'program', 
        'achieved', 
        'create_date', 
        'edit_date'
    )
    search_fields = (
        'indicator__name', 
        'program__name',
        'periodic_target__period',
    )
    list_filter = ('indicator__program__country__country',)
    readonly_fields = ('create_date', 'edit_date')
    autocomplete_fields = (
        'periodic_target', 
        'approved_by',
        'indicator', 
        'program', 
        'outcome_themes',
        'site',
    )
    date_hierarchy = 'date_collected'
    


@admin.register(OutcomeTheme)
class OutcomeThemeAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active', 'create_date')
    readonly_fields = ('create_date',)
    search_fields = ('name',)


#################
# Disaggregations
#################

# Includes proxy admin models and inline admin models

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
        return super().get_queryset(request).filter(global_type__in=self.GLOBAL_TYPES).annotate(
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


@admin.register(DisaggregationType)
class DisaggregationTypeAdmin(admin.ModelAdmin):
    readonly_fields = ('create_date', 'edit_date')
    list_display = ('disaggregation_type', 'country', 'create_date', 'edit_date')
    list_filter = ('global_type', 'is_archived', 'country')
    search_fields = ('disaggregation_type', 'country__country')



@admin.register(GlobalDisaggregation)
class GlobalDisaggregationAdmin(DisaggregationAdmin):
    list_display = ('disaggregation_type', 'global_type', 'pretty_archived', 'program_count', 'categories')
    list_filter = (ArchivedFilter,)
    sortable_by = ('disaggregation_type', 'program_count')
    exclude = ('create_date', 'edit_date', 'country')
    GLOBAL_TYPES = [DISAG_GLOBAL, DISAG_PARTICIPANT_COUNT]
    COLUMN_WIDTH = 70 # width of the "categories list" column before truncation

    def save_model(self, request, obj, form, change):
        """ensure on save that country is blank - this is the global admin"""
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
    exclude = ('create_date', 'edit_date', 'global_type',)
    GLOBAL_TYPES = [DISAG_COUNTRY_ONLY]
    COLUMN_WIDTH = 50

    def save_model(self, request, obj, form, change):
        obj.global_type = DISAG_COUNTRY_ONLY
        super().save_model(request, obj, form, change)


@admin.register(IDAAOutcomeTheme)
class IDAAOutcomeThemeAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active', 'create_date')
    list_filter = ('is_active',)
    search_fields = ('name',)


@admin.register(IndicatorType)
class IndicatorTypeAdmin(admin.ModelAdmin):
    exclude = ('create_date', 'edit_date')
    list_display = ('indicator_type', 'create_date', 'edit_date')


@admin.register(Level)
class LevelAdmin(admin.ModelAdmin):
    exclude = ('create_date', 'edit_date')
    list_display = ('name', 'parent', 'program', 'customsort', 'create_date', 'edit_date')
    autocomplete_fields = ('parent', 'program')
    search_fields = ('name', 'parent__name', 'program__name')


@admin.register(DataCollectionFrequency)
class DataCollectionFrequencyAdmin(admin.ModelAdmin):
    exclude = ('create_date', 'edit_date')
    list_display = ('frequency', 'description', 'sort_order', 'create_date', 'edit_date')


@admin.register(ReportingFrequency)
class ReportingFrequencyAdmin(admin.ModelAdmin):
    exclude = ('create_date', 'edit_date')
    list_display = ('frequency', 'description', 'sort_order', 'create_date', 'edit_date')


@admin.register(PinnedReport)
class PinnedReportAdmin(admin.ModelAdmin):
    list_display = ('name', 'tola_user', 'program', 'creation_date')
    autocomplete_fields = ('tola_user', 'program')


@admin.register(LevelTier)
class LevelTierAdmin(admin.ModelAdmin):
    exclude = ('create_date', 'edit_date')
    autocomplete_fields = ('program',)
    list_display = ('name', 'program', 'tier_depth', 'create_date', 'edit_date')
    search_fields = ('name', 'program__name',)


@admin.register(LevelTierTemplate)
class LevelTierTemplateAdmin(admin.ModelAdmin):
    exclude = ('create_date', 'edit_date')
    autocomplete_fields = ('program',)
    list_display = ('names', 'program', 'create_date', 'edit_date')
    search_fields = ('names', 'program__name',)


@admin.register(BulkIndicatorImportFile)
class BulkIndicatorImportFileAdmin(admin.ModelAdmin):
    autocomplete_fields = ('program', 'user')
    exclude = ('create_date',)
    list_display = ('file_name', 'file_type', 'program', 'create_date')
    search_fields = ('file_name', 'program__name',)
    list_filter = ('file_type',)

