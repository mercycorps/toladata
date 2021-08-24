
from os import path
import re
import itertools
import polib
from django.core.management.base import BaseCommand
from django.conf import settings

# Some translation messages begin with whitespace and an html tag.  This regex separates
# the leading whitespace and html tag(s) from the start of the string so the
# "Translated" can be placed right before the string rather than outside of enclosing
# tags.
WHITESPACE_REGEX = re.compile('(^\s*(?:<.+?>)*)?(.+)', re.DOTALL)

class Command(BaseCommand):
    help = """Create temporary translations """

    diacritic_cycle = itertools.cycle(['Á', 'é', '', 'ö', 'Ź'])

    def handle(self, *args, **options):

        partial_paths = [
            'fr/LC_MESSAGES/django.po',
            'fr/LC_MESSAGES/djangojs.po',
            'es/LC_MESSAGES/django.po',
            'es/LC_MESSAGES/djangojs.po'
        ]
        for partial_path in partial_paths:
            self.create_translations(partial_path)

    def create_translations(self, partial_path):
        file_root = path.join(settings.DJANGO_ROOT, 'locale')
        po_file_obj = polib.pofile(path.join(file_root, partial_path))
        print('\nProcessing', partial_path)

        untranslated_entries = [entry for entry in po_file_obj.untranslated_entries() if not entry.obsolete]
        if untranslated_entries:
            print(f'Creating {len(untranslated_entries)} temporary strings for untranslated entries')
            self.update_entries(untranslated_entries, fuzzy=False)
        else:
            print('No untranslated strings found')

        fuzzy_entries = [entry for entry in po_file_obj.fuzzy_entries() if not entry.obsolete]
        if fuzzy_entries:
            print(f'Creating {len(fuzzy_entries)} temporary strings for fuzzy entries')
            self.update_entries(fuzzy_entries, fuzzy=True)
        else:
            print('No fuzzy strings found')
        po_file_obj.save()

    def update_entries(self, entries, fuzzy=False):
        for entry in entries:
            template = '{space_or_tag}{diacritic}Translated {body}'
            if entry.msgid_plural:
                matches_singular = WHITESPACE_REGEX.match(entry.msgid)
                matches_plural = WHITESPACE_REGEX.match(entry.msgid_plural)
                entry.msgstr_plural[0] = template.format(
                    space_or_tag = matches_singular.group(1),
                    diacritic = next(self.diacritic_cycle),
                    body=matches_singular.group(2))
                entry.msgstr_plural[1] = template.format(
                    space_or_tag=matches_plural.group(1),
                    diacritic=next(self.diacritic_cycle),
                    body=matches_plural.group(2))

            else:
                matches = WHITESPACE_REGEX.match(entry.msgid)
                entry.msgstr = template.format(
                    space_or_tag=matches.group(1),
                    diacritic=next(self.diacritic_cycle),
                    body=matches.group(2))

            if fuzzy:
                entry.flags.remove('fuzzy')
