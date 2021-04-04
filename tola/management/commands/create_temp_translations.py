
from os import path
import polib
from django.core.management.base import BaseCommand
from django.conf import settings
from indicators.models import Sector, IndicatorType, ReportingFrequency, DataCollectionFrequency


class Command(BaseCommand):
    help = """
        Add dropdown values to a file so they can be translated
        """

    # def add_arguments(self, parser):
    #     parser.add_argument('-f', '--file', action='store', nargs='?', required=True, dest='filepath')


    def handle(self, *args, **options):

        partial_paths = [
            'fr/LC_MESSAGES/django.po',
            'fr/LC_MESSAGES/djangojs.po',
            'es/LC_MESSAGES/django.po',
            'es/LC_MESSAGES/djangojs.po'
        ]
        for partial_path in partial_paths:
            self.create_translations(partial_path)


    @staticmethod
    def create_translations(partial_path):
        file_root = path.join(settings.DJANGO_ROOT, 'locale')
        po_file_obj = polib.pofile(path.join(file_root, partial_path))
        print('\nProcessing', partial_path)
        untranslated_entries = [entry for entry in po_file_obj.untranslated_entries() if not entry.obsolete]
        if untranslated_entries:
            print(f'Creating {len(untranslated_entries)} temporary strings for untranslated entries')
            for entry in untranslated_entries:
                entry.msgstr = 'Translated ' + entry.msgid
        else:
            print('No untranslated strings found')

        fuzzy_entries = [entry for entry in po_file_obj.fuzzy_entries() if not entry.obsolete]
        if fuzzy_entries:
            print(f'Creating {len(fuzzy_entries)} temporary strings for fuzzy entries')
            for entry in fuzzy_entries:
                entry.msgstr = 'Translated ' + entry.msgid
                entry.flags.remove('fuzzy')
        else:
            print('No fuzzy strings found')

        po_file_obj.save()

