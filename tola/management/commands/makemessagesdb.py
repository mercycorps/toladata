
from os import path
from django.core.management.base import BaseCommand
from django.conf import settings
from indicators.models import Sector, IndicatorType, ReportingFrequency, DataCollectionFrequency


class Command(BaseCommand):
    help = """
        Add dropdown values to a file so they can be translated
        """
    js_filename = 'db_translations.js'
    py_filename = 'db_translations.py'

    def handle(self, *args, **options):
        create_translated_db_items(
            self.js_filename, self.py_filename, root_path=settings.DJANGO_ROOT, *args, **options)


def create_translated_db_items(js_filename, py_filename, root_path=settings.DJANGO_ROOT, *args, **options):
    frequency_models = [
        (ReportingFrequency, 'frequency'),
        (DataCollectionFrequency, 'frequency'),
    ]
    frequency_translator_comment = 'One of several options for specifying how often data is collected or reported on over the life of a program'
    other_models = [
        (Sector, 'sector', 'One of several choices for what sector (i.e. development domain) a program is most closely associated with'),
        (IndicatorType, 'indicator_type', 'One of several choices for specifying what type of Indicator is being created.  An Indicator is a performance measure e.g. "We will distrubute 1000 food packs over the next two months"')
    ]

    frequency_strings_to_translate = set()
    for model, field in frequency_models:
        frequency_strings_to_translate |= set(model.objects.values_list(field, flat=True))
    all_strings_to_translate = [(string, frequency_translator_comment) for string in frequency_strings_to_translate]

    for model, field, translator_comment in other_models:
        strings_to_translate = list(model.objects.values_list(field, flat=True))
        all_strings_to_translate += [(string, translator_comment) for string in strings_to_translate]

    string_num = 0
    with open(path.join(root_path, py_filename), 'w') as fh:
        fh.write("from django.utils.translation import ugettext_lazy as _\n\n")
        for string, translator_comment in all_strings_to_translate:
            # print('str', string, 'trans', translator_comment)
            fh.write(f'# Translators: {translator_comment}\n')
            fh.write(f'string{string_num} = _("{string}")\n')
            string_num += 1

    string_num = 0
    with open(path.join(root_path, js_filename), 'w') as fh:
        for string, translator_comment in all_strings_to_translate:
            fh.write(f'// # Translators: {translator_comment}\n')
            fh.write(f'string{string_num} = gettext("{string}")\n')
            string_num += 1

