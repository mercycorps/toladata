from django.core.management.base import BaseCommand
from workflow.models import Country
from .qa_program_widgets.qa_widgets import ProgramFactory

class Command(BaseCommand):

    def handle(self, *args, **options):
        ethio = Country.objects.filter(country="Ethiopia").first()
        program_factory = ProgramFactory(ethio)
        program_factory.create_program("Demo Test3")
