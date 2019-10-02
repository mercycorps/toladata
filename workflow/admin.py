from django.contrib import admin, messages
from django.contrib.auth.models import User

from import_export import resources, fields
from import_export.widgets import ForeignKeyWidget
from import_export.admin import ImportExportModelAdmin, ExportMixin

#from tola.util import getCountry, get_GAIT_data
from tola import util
from .models import (
    Documentation, ProjectAgreement, ProjectComplete, Country, SiteProfile,
    Program, TolaUser, ProfileType, TolaUserProxy,
    Organization, Sector, Benchmarks, Budget, Monitor,
    Checklist, ChecklistItem,
    OrganizationAdmin,
    ProgramAccess,
    ChecklistAdmin,
    ChecklistItemAdmin, TolaUserAdmin
)


# Resource for CSV export
class DocumentationResource(resources.ModelResource):
    country = fields.Field(column_name='country', attribute='country', widget=ForeignKeyWidget(Country, 'country'))
    program = fields.Field(column_name='program', attribute='program', widget=ForeignKeyWidget(Program, 'name'))
    project = fields.Field(column_name='project', attribute='project', widget=ForeignKeyWidget(ProjectAgreement, 'project_name'))

    class Meta:
        model = Documentation
        widgets = {
                'create_date': {'format': '%d/%m/%Y'},
                'edit_date': {'format': '%d/%m/%Y'},
                'expected_start_date': {'format': '%d/%m/%Y'},
                }


class DocumentationAdmin(ImportExportModelAdmin):
    resource_class = DocumentationResource
    list_display = ('program', 'project')
    list_filter = ('program__country',)


# Resource for CSV export
class ProjectAgreementResource(resources.ModelResource):

    class Meta:
        model = ProjectAgreement
        widgets = {
                'create_date': {'format': '%d/%m/%Y'},
                'edit_date': {'format': '%d/%m/%Y'},
                'expected_start_date': {'format': '%d/%m/%Y'},
                'expected_end_date': {'format': '%d/%m/%Y'},
                }


class ProjectAgreementAdmin(ImportExportModelAdmin):
    resource_class = ProjectAgreementResource
    list_display = ('program', 'project_name', 'short', 'create_date')
    list_filter = ('program__country', 'short')
    filter_horizontal = ('site')

    def queryset(self, request, queryset):
        """
        Returns the filtered queryset based on the value
        provided in the query string and retrievable via
        `self.value()`.
        """
        # Filter by logged in users allowable countries
        user_countries = util.getCountry(request.user)
        # if not request.user.user.is_superuser:
        return queryset.filter(country__in=user_countries)

    pass


# Resource for CSV export
class ProjectCompleteResource(resources.ModelResource):

    class Meta:
        model = ProjectComplete
        widgets = {
                'create_date': {'format': '%d/%m/%Y'},
                'edit_date': {'format': '%d/%m/%Y'},
                'expected_start_date': {'format': '%d/%m/%Y'},
                'expected_end_date': {'format': '%d/%m/%Y'},
                'actual_start_date': {'format': '%d/%m/%Y'},
                'actual_end_date': {'format': '%d/%m/%Y'},
                }


class ProjectCompleteAdmin(ImportExportModelAdmin):
    resource_class = ProjectCompleteResource
    list_display = ('program', 'project_name', 'activity_code','short','create_date')
    list_filter = ('program__country', 'short')
    display = 'project_name'

    def queryset(self, request, queryset):
        """
        Returns the filtered queryset based on the value
        provided in the query string and retrievable via
        `self.value()`.
        """
        # Filter by logged in users allowable countries
        user_countries = util.getCountry(request.user)
        # if not request.user.user.is_superuser:
        return queryset.filter(country__in=user_countries)


# Resource for CSV export
class CountryResource(resources.ModelResource):

    class Meta:
        model = Country


class CountryAdmin(ImportExportModelAdmin):
    resource_class = CountryResource
    list_display = ('country','code','organization','create_date', 'edit_date')
    list_filter = ('country','organization__name')


# Resource for CSV export
class SiteProfileResource(resources.ModelResource):
    country = fields.Field(column_name='country', attribute='country', widget=ForeignKeyWidget(Country, 'country'))
    type = fields.Field(column_name='type', attribute='type', widget=ForeignKeyWidget(ProfileType, 'profile'))

    class Meta:
        model = SiteProfile
        skip_unchanged = True
        report_skipped = False
        # import_id_fields = ['id']


class SiteProfileAdmin(ImportExportModelAdmin):
    resource_class = SiteProfileResource
    list_display = ('name', 'country')
    list_filter = ('country__country',)
    search_fields = ('country__country')

class ProgramAccessInline(admin.TabularInline):
    model = ProgramAccess

    #the goal here is to limit the valid country choices to those associated with the related program
    def formfield_for_foreignkey(self, db_field, request=None, **kwargs):
        field = super(ProgramAccessInline, self).formfield_for_foreignkey(db_field, request, **kwargs)

        if db_field.name == 'country':
            if request._obj_ is not None:
                field.queryset = field.queryset.filter(id__in = request._obj_.country.all().values('id'))

        return field

class ProgramAdmin(admin.ModelAdmin):
    list_display = ('countries', 'name', 'gaitid', 'description', 'budget_check', 'funding_status')
    search_fields = ('name', 'gaitid')
    list_filter = ('funding_status', 'country', 'budget_check', 'funding_status')
    display = 'Program'
    readonly_fields = ('start_date', 'end_date', 'reporting_period_start', 'reporting_period_end', )
    inlines = (ProgramAccessInline,)

    #we need a reference for the inline to limit country choices properly
    def get_form(self, request, obj=None, **kwargs):
        # just save obj reference for future processing in Inline
        request._obj_ = obj
        return super(ProgramAdmin, self).get_form(request, obj, **kwargs)

    # Non-destructively save the GAIT start and end dates based on the value entered in the ID field.
    # Non-destructively populate the reporting start and end dates based on the GAIT dates.
    def save_model(self, request, obj, form, change):
        message = util.append_GAIT_dates(obj)
        if message:
            messages.add_message(request, messages.ERROR, message)

        super(ProgramAdmin, self).save_model(request, obj, form, change)


admin.site.register(Organization, OrganizationAdmin)
admin.site.register(Country, CountryAdmin)
admin.site.register(Program, ProgramAdmin)
admin.site.register(Sector)
admin.site.register(ProjectAgreement, ProjectAgreementAdmin)
admin.site.register(ProjectComplete, ProjectCompleteAdmin)
admin.site.register(Documentation,DocumentationAdmin)
admin.site.register(SiteProfile, SiteProfileAdmin)
admin.site.register(Monitor)
admin.site.register(Benchmarks)
admin.site.register(Budget)
admin.site.register(ProfileType)
admin.site.register(ChecklistItem, ChecklistItemAdmin)
admin.site.register(Checklist, ChecklistAdmin)
admin.site.register(TolaUser,TolaUserAdmin)