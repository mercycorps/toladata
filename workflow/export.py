from import_export import resources
from import_export.widgets import ForeignKeyWidget, ManyToManyWidget
from import_export import fields
from .models import Program, SiteProfile, Documentation,\
    Sector, TolaUser, ProjectComplete, Country, TolaUserProxy


class ProjectCompleteResource(resources.ModelResource):
    site = fields.Field(column_name='site', attribute='site', widget=ManyToManyWidget(SiteProfile, 'name'))
    program = fields.Field(column_name='program', attribute='program', widget=ForeignKeyWidget(Program, 'name'))
    sector = fields.Field(column_name='sector', attribute='sector', widget=ForeignKeyWidget(Sector, 'sector'))
    estimated_by = fields.Field(column_name='estimated_by', attribute='estimated_by', widget=ForeignKeyWidget(TolaUser, 'name'))
    approved_by = fields.Field(column_name='approved_by', attribute='approved_by', widget=ForeignKeyWidget(TolaUser, 'name'))

    class Meta:
        model = ProjectComplete


class ProgramResource(resources.ModelResource):

    class Meta:
        model = Program

