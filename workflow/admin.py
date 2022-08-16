from django.contrib import admin, messages
from django.contrib.auth.models import User

from import_export import resources, fields
from import_export.widgets import ForeignKeyWidget
from import_export.admin import ImportExportModelAdmin, ExportMixin

#from tola.util import getCountry, get_GAIT_data
from tola import util
from .models import (
    Country,
    CountryAccess,
    FundCode,
    GaitID,
    IDAASector,
    Organization,
    ProfileType,
    Program,
    ProgramAccess,
    ProgramDiscrepancy,
    Region,
    Sector,
    SiteProfile,
    TolaUser,
    TolaUserProxy,
)


##########################
# Resources for CSV export
##########################

class CountryResource(resources.ModelResource):
    class Meta:
        model = Country


class SiteProfileResource(resources.ModelResource):
    country = fields.Field(column_name='country', attribute='country', widget=ForeignKeyWidget(Country, 'country'))
    type = fields.Field(column_name='type', attribute='type', widget=ForeignKeyWidget(ProfileType, 'profile'))

    class Meta:
        model = SiteProfile
        skip_unchanged = True
        report_skipped = False
        # import_id_fields = ['id']


################
# Inline editors
################

class CountryAccessInline(admin.TabularInline):
    model = CountryAccess
    ordering = ('country',)


class CountryInLineAdmin(admin.StackedInline):
    model = Country
    fields = ['country']
    readonly_fields = ['country']
    can_delete = False
    extra = 0
    classes = ['hide-inline-header']
    max_num = 0  # eliminates option to add country from the region page

    class Media:
        css = {"all": ("css/admin/inline_forms.css",)}


class ProgramAccessInline(admin.TabularInline):
    model = ProgramAccess

    #the goal here is to limit the valid country choices to those associated with the related program
    def formfield_for_foreignkey(self, db_field, request=None, **kwargs):
        field = super(ProgramAccessInline, self).formfield_for_foreignkey(db_field, request, **kwargs)

        if db_field.name == 'country':
            if request._obj_ is not None:
                field.queryset = field.queryset.filter(id__in = request._obj_.country.all().values('id'))

        return field


#########################
# Customized model admins
#########################

@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ('name', 'create_date', 'edit_date')


@admin.register(Country)
class CountryAdmin(ImportExportModelAdmin):
    resource_class = CountryResource
    list_display = ('country','code','organization','create_date', 'edit_date')
    list_filter = ('country','organization__name')
    search_fields = ('country',)


@admin.register(TolaUser)
class TolaUserAdmin(admin.ModelAdmin):
    list_display = ('name', 'country')
    list_filter = ('country', 'user__is_staff',)
    search_fields = ('name', 'country__country', 'title')
    inlines = (CountryAccessInline, )


@admin.register(SiteProfile)
class SiteProfileAdmin(ImportExportModelAdmin):
    resource_class = SiteProfileResource
    list_display = ('name', 'country')
    list_filter = ('country__country',)
    search_fields = ('country__country',)
    # Following lines copied from .models for historical purposes
    # list_display = ('name', 'code', 'country', 'cluster', 'longitude', 'latitude', 'create_date', 'edit_date')


@admin.register(Program)
class ProgramAdmin(admin.ModelAdmin):
    list_display = ('name', 'countries', 'gaitids', 'budget_check', 'funding_status', 'gaitids')
    search_fields = ('name', 'gaitid__gaitid')
    list_filter = ('funding_status', 'country', 'budget_check', 'funding_status')
    readonly_fields = ('start_date', 'end_date', 'reporting_period_start', 'reporting_period_end', 'gaitids')
    inlines = (ProgramAccessInline,)
    autocomplete_fields = ('sector', 'idaa_sector', 'idaa_outcome_theme', 'country')
    exclude = ('create_date', 'edit_date')

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


@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ['name', 'gait_region_id']
    inlines = [CountryInLineAdmin]


@admin.register(Sector)
class SectorAdmin(admin.ModelAdmin):
    list_display = ('sector', 'create_date', 'edit_date')
    search_fields =('sector',)


@admin.register(ProfileType)
class ProfileTypeAdmin(admin.ModelAdmin):
    list_display = ('profile', 'create_date', 'edit_date')


@admin.register(IDAASector)
class IDAASectorAdmin(admin.ModelAdmin):
    list_display = ('sector', 'create_date', 'edit_date')
    search_fields =('sector',)


@admin.register(ProgramDiscrepancy)
class ProgramDiscrepancyAdmin(admin.ModelAdmin):
    list_display = ('idaa_program_name', 'create_date', 'edit_date')
    autocomplete_fields = ('program',)


@admin.register(GaitID)
class GaitIDAdmin(admin.ModelAdmin):
    list_display = ('gaitid', 'program', 'create_date', 'edit_date')
    search_fields = ('gaitid', 'program',)
    autocomplete_fields = ('program',)


@admin.register(FundCode)
class FundCodeAdmin(admin.ModelAdmin):
    list_display = ('fund_code', 'gaitid', 'create_date', 'edit_date')
    autocomplete_fields = ('gaitid',)


###################
# Apparently unused
###################

class LandTypeAdmin(admin.ModelAdmin):
    list_display = ('classify_land', 'create_date', 'edit_date')

