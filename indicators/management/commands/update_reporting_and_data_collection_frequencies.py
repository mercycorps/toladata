"""
Updates data collection and reporting frequency values to match new schema.
"""

import collections

from django.core.management.base import BaseCommand
from django.db import transaction
from django.db.models import Q

from indicators.models import DataCollectionFrequency, ReportingFrequency, Indicator


class Command(BaseCommand):
    help = """
        Fixes target periods that were created with mid-month dates.
        """

    def add_arguments(self, parser):
        parser.add_argument('--execute', action='store_true')

    def handle(self, *args, **options):

        with transaction.atomic():

            data_collection_order = [
                'Baseline', 'Midline', 'Endline', 'Annual', 'Semi-annual', 'Quarterly', 'Monthly', 'Weekly',
                'By batch', 'By distribution', 'By event', 'By training', 'Post shock']

            reporting_frequency_order = [
                'Baseline', 'Midline', 'Endline', 'Annual', 'Semi-annual', 'Quarterly', 'Monthly', 'By batch',
                'By distribution', 'By event', 'Post shock']

            # Get clear the normal sort order range to make way for the new values.  Anything with a sort-order
            # value of greater than 100 will be deleted at the bottom of the script because they aren't used any more.
            for model in [DataCollectionFrequency, ReportingFrequency]:
                for obj in model.objects.all():
                    obj.sort_order = obj.sort_order + 100
                    obj.save()

            # Get the frequency if it exists or create it if it doesn't.  In either case, assign a sort_order value.
            for model, freq_list in [
                (DataCollectionFrequency, data_collection_order),
                (ReportingFrequency, reporting_frequency_order)]:
                for i, freq_name in enumerate(freq_list):
                    obj, created = model.objects.get_or_create(
                        frequency=freq_name, defaults={'sort_order': i})
                    if not created:
                        obj.sort_order = i
                        obj.save()

            data_collection_old_to_new_names = {
                'Annual': ['Annual'],
                'Endline': ['Endline'],
                'Monthly': 	['Monthly'],
                'Quarterly': ['Quarterly'],
                'Semi-annually': ['Semi-annual'],
                'Baseline and Endline': ['Baseline', 'Endline'],
                'Baseline, Midline and Endline': ['Baseline', 'Midline', 'Endline'],
                'After Shock Event': ['Post shock'],
                'Post-shock monitoring': ['Post shock'],
                'Post event': ['By event'],
                'Midline': ['Midline'],
                'Baseline': ['Baseline'],
                'After each visit': ['By event'],
                'Once per Semester/Batch': ['By batch'],
                'Once per 3 Years': ['Annual'],
                'Once in the beginning of Year 1': ['By event'],
                'Once per Semester/Batch 2': ['By batch'],
                'Once in the Beginning of Year 2': ['By event'],
                'By training': ['By training'],
                'By distribution': ['By distribution']
            }
            reporting_frequency_old_to_new_names = {
                'Annually': ['Annual'],
                'Program End': ['Endline'],
                'Monthly': ['Monthly'],
                'Quarterly': ['Quarterly'],
                'Semi Annually': ['Semi-annual'],
                'Baseline, Endline': ['Baseline', 'Endline'],
                'Baseline and Endline': ['Baseline', 'Endline'],
                'Baseline, Midline, Endline': ['Baseline', 'Midline', 'Endline'],
                'Post Disaster': ['Post shock'],
                'When post-shock monitoring indicators are triggered': ['Post shock'],
                'Post Event': ['By event'],
                'Quarterly, Annually': ['Quarterly', 'Annual'],
                'Midline, Endline': ['Midline', 'Endline'],
                'Monthly & Quarterly': ['Monthly', 'Quarterly'],
                'Monthly, Quarterly, Annually': ['Monthly', 'Quarterly', 'Annual'],
                'End of Cycle': ['By event'],
                'Before and After training session': ['By event'],
                'Weekly': ['By event'],
                'Bi-Weekly': ['By event'],
            }

            # Create a map of old value id to a list of new values, using the name maps above
            data_collection_old_to_new_objs = collections.defaultdict(list)
            reporting_frequency_old_to_new_objs = collections.defaultdict(list)
            for model, object_map, name_map in [
                (DataCollectionFrequency, data_collection_old_to_new_objs, data_collection_old_to_new_names),
                (ReportingFrequency, reporting_frequency_old_to_new_objs, reporting_frequency_old_to_new_names)]:
                for old_name, new_names in name_map.items():
                    old_name_id  = model.objects.get(frequency=old_name).id
                    for new_name in new_names:
                        object_map[old_name_id].append(
                            model.objects.get(frequency=new_name))

            # Now reassign the frequency values to the indicators
            for indicator in Indicator.objects.all_with_deleted()\
                    .filter(Q(reporting_frequencies__isnull=False) or Q(data_collection_frequencies__isnull=False))\
                    .prefetch_related('data_collection_frequencies', 'reporting_frequencies'):
                if indicator.reporting_frequencies.exists():
                    old_reporting_freq_id = indicator.reporting_frequencies.first().id
                    indicator.reporting_frequencies.clear()
                    indicator.reporting_frequencies.add(
                        *reporting_frequency_old_to_new_objs[old_reporting_freq_id])
                if indicator.data_collection_frequencies.exists():
                    old_data_collection_freq_id = indicator.data_collection_frequencies.first().id
                    indicator.data_collection_frequencies.clear()
                    indicator.data_collection_frequencies.add(
                        *data_collection_old_to_new_objs[old_data_collection_freq_id])

            DataCollectionFrequency.objects.filter(sort_order__gte=100).delete()
            ReportingFrequency.objects.filter(sort_order__gte=100).delete()
