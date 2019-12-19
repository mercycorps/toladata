import argparse
import csv
from datetime import date, datetime
import sys
from os import path

from django.core.management.base import BaseCommand, CommandError

from indicators.models import Indicator
from workflow.models import Program


def valid_date(s):
    try:
        return datetime.strptime(s, "%Y-%m-%d").date()
    except ValueError:
        msg = "Not a valid date: '{0}'.".format(s)
        raise argparse.ArgumentTypeError(msg)


class Command(BaseCommand):
    help = """
        Dump program data related to indicator period types
        """

    def add_arguments(self, parser):
        parser.add_argument('--startdate', type=valid_date, default='2018-07-01')

    def handle(self, *args, **options):
        home = path.expanduser("~")

        # First use all programs that have at least one indicator created after the cutoff
        programs_i = Program.objects.filter(
            indicator__create_date__date__gte=options['startdate']).distinct()
        programs_i.prefetch_related('indicator_set')

        print('exporting indicator cutoff data')
        filepath = path.join(home, 'period types - indicator cutoff.csv')
        self.export_program_data(programs_i, filepath)

        print('exporting pivot data')
        filepath = path.join(home, 'period types - pivot data.csv')
        self.export_pivot_data(programs_i, filepath)

        # Second use only programs created after the cutoff
        programs_p = Program.objects.filter(create_date__date__gte=options['startdate'])
        programs_p.prefetch_related('indicator_set')

        print('exporting program cutoff data')
        filepath = path.join(home, 'period types - program cutoff.csv')
        self.export_program_data(programs_p, filepath)

        # programs_i_ids = set(programs_i.values_list('id', flat=True))
        # programs_p_ids = set(programs_p.values_list('id', flat=True))
        # pNoti = programs_p_ids - programs_i_ids
        # iNotp = programs_i_ids - programs_p_ids
        # print 'pnoti', len(pNoti), pNoti
        # print 'inotp', len(iNotp), iNotp

    @staticmethod
    def export_pivot_data(programs, filepath):
        headers = [
            'program_id', 'program_name', 'program_date',
            'indicator_id', 'indicator_type', 'indicator_date',
            'result_count', 'reporting_frequency', 'data_collection_frequency'
        ]
        frequency_labels = dict(Indicator.TARGET_FREQUENCIES)
        with open(filepath, 'w') as fh:
            writer = csv.writer(fh)
            writer.writerow(headers)

            for program in programs:
                program_values = [program.id, program.name, program.create_date]
                for indicator in program.indicator_set.all():
                    if indicator.target_frequency:
                        frequency = frequency_labels[indicator.target_frequency]
                    else:
                        frequency = 'None'
                    indicator_values = [
                        indicator.id, frequency, indicator.create_date, indicator.result_set.count(),
                        indicator.reporting_frequency, indicator.data_collection_frequency
                    ]

                    writer.writerow(program_values + indicator_values)

    @staticmethod
    def export_program_data(programs, filepath):
        frequency_names = [f[1] for f in Indicator.TARGET_FREQUENCIES]
        frequency_names.append('None')
        freq_map = dict(Indicator.TARGET_FREQUENCIES)
        headers = ['program id', 'program name', 'countries'] + frequency_names
        with open(filepath, 'w') as fh:
            writer = csv.writer(fh)
            writer.writerow(headers)
            for program in programs:

                indicators = program.indicator_set.all()
                if indicators.count() == 0:
                    continue

                period_type_counts = {}
                for indicator in indicators:
                    if indicator.target_frequency:
                        try:
                            period_type_counts[freq_map[indicator.target_frequency]] += 1
                        except KeyError:
                            period_type_counts[freq_map[indicator.target_frequency]] = 1
                    else:
                        try:
                            period_type_counts['None'] += 1
                        except KeyError:
                            period_type_counts['None'] = 1

                type_count_list = [
                    str(period_type_counts[i]) if i in period_type_counts else '0' for i in frequency_names]
                countries = ','.join(program.country.values_list('country', flat=True))
                output_list = [str(program.id), program.name, countries] + type_count_list
                writer.writerow(output_list)
