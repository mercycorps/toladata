from import_export import resources
from workflow.models import Program


class ProgramResource(resources.ModelResource):

    class Meta:
        model = Program

