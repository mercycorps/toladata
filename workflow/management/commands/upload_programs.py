import csv
import sys
from itertools import chain
from collections import namedtuple
from django.core.management.base import BaseCommand, CommandError
from django.db import connection
from workflow.models import *
from django.utils import timezone


TolaProgramRef = namedtuple(
    'ProgramRef', ['tola_program_id', 'tola_country_name_list', 'tola_program_obj'])
ImportProgramRef = namedtuple(
    'ImportFileProgramRef', ['import_program_id', 'import_gait_id_list', 'import_country_name_list'])

# Define success/fail types.  Using named tuples to make downstream usage more clear

SUCCESS_SIMPLE = 'success_simple'
ERROR_NO_MATCHING_GAIT = 'error_no_matching_gait'
ERROR_SIMPLE_MISMATCHED_COUNTRY = 'error_simple_mismatched_counntry'

disposition_fields = [
    'disposition_type', 'import_program_id', 'import_gait_string', 'tola_program_ids', 'tola_countries']
Disposition = namedtuple('Disposition', disposition_fields)

# external_pg_fields = ['external_program_id', 'external_gait_id']
# WarnNoGAIT = namedtuple('WarnNoGAIT', external_pg_fields)  # Use if external gait id is not found in Tola
# SuccessCreatedProgram = namedtuple('SuccessCreatedProgram', external_pg_fields)
# SkippedNotFunded = namedtuple('SkippedNotFunded', external_pg_fields)
#
# int_ext_fields = ['external_id', 'external_gait_string', 'internal_program_ids']
# SuccessUpdatedProgram = namedtuple('SuccessUpdatedProgram', int_ext_fields)
# SuccessAddedProgramID = namedtuple('SuccessAddedProgramID', int_ext_fields)
# SuccessNoChange = namedtuple('SuccessNoChange', int_ext_fields)
# WarnExcessGAIT = namedtuple('WarnExcessGAIT', int_ext_fields)  # Many programs for one GAIT id
# WarnGAITProgramMismatch = namedtuple('WarnGAITProgramMismatch', int_ext_fields)


# WarnCountryMismatch = namedtuple('WarnCountryMismatch', int_ext_fields_with_country)

HEADERS = {'Unique ID': 0, 'GAIT IDs': 7, 'Fund Code(s)': 8, 'Program Name': 16, 'Funded': 17, 'Country Names': 20}


class BadHeader(Exception):
    pass


class CSVReaderHeaderChecker(object):
    def __init__(self, file_path):
        self.file_path = file_path

    def __enter__(self):
        file_handle = open(self.file_path, 'r', encoding='utf-8-sig')
        self.file_handle = file_handle
        reader = csv.reader(file_handle)
        header_row = reader.__next__()
        file_headers = ','.join([header_row[i].strip() for i in HEADERS.values()])
        if file_headers != ','.join(HEADERS):
            raise BadHeader(file_headers)
        return reader

    def __exit__(self, *errors):
        self.file_handle.close()


class Command(BaseCommand):

    help = """
        Uploads programs from an Excel file
        """

    def add_arguments(self, parser):
        """
        Help on arguments: https://docs.python.org/3/library/argparse.html#argparse.ArgumentParser.add_argument
        """
        parser.add_argument('filepath', help='Absolute or relative path to CSV file to upload')
        parser.add_argument(
            'initial',
            choices=['initial', 'update'],
            help='Use "initial" for the initial load or update for subsequent loads')
        parser.add_argument(
            '--execute', action='store_true', help='Actually save the data.  Default is to do a dry run.')


        """
        - If program id exists, update program id, gait ids, and fund codes
        - If program id doesn't but gait does exist, add program id, update gait ids and fund codes
            - check that programs with more than 1 gait id don't have that gait id tagged to another program
        - If no gait id found, create program with associated fund codes and gait ids
        - If

        Output:
        - Funded programs in Tola with no GAIT id or external_id

        """


        """
        Questions:
        - Should everything that with United States in the Country column get mapped to an "HQ Managed" country (like Marie's diagram)

        """


    def handle(self, *args, **options):
        file = options['filepath']
        import_gait_to_program_map, tola_gait_to_program_map, tola_external_id_to_program_map = get_program_maps(file)

        try:
            dispositions = process_file(
                file, options['initial'], tola_gait_to_program_map, tola_external_id_to_program_map,
                import_gait_to_program_map)
        except BadHeader as e:
            print('Unexpected header values')
            print('Expected ', ','.join(HEADERS.keys()))
            print('Found ', e)

        total_rows_processed = 0
        internal_programs_touched = set()
        for event_type, event_values in dispositions.items():
            print(f'{event_type}: {len(event_values)}')
            total_rows_processed += len(event_values)
            for event in event_values:
                try:
                    internal_programs_touched |= set(event.internal_program_ids)
                except AttributeError:
                    pass
                # print('tiint rpogrm', internal_programs_touched)
        # for no_gait_obj in dispositions['warn_no_gait']:
        #     print(f'Could not find a gait id in TolaData. External program id: {no_gait_obj.external_id}, gait string: {no_gait_obj.gait_id}')
        print('programs touched', len(internal_programs_touched))
        internal_funded_program_ids = list(Program.objects \
                                           .filter(funding_status='Funded') \
                                           .exclude(country__country__in=['Tolaland', 'Mapping Our Reach']) \
                                           .values_list('pk', flat=True))
        print('programs funded', len(internal_funded_program_ids))
        internal_programs_untouched_ids = set(internal_funded_program_ids) - set(internal_programs_touched)
        print('untouched programs', len(internal_programs_untouched_ids), internal_programs_untouched_ids)
        internal_funded_untouched = Program.objects \
            .filter(pk__in=internal_programs_untouched_ids) \
            .exclude(country__country__in=['Tolaland', 'Mapping Our Reach']) \
            .prefetch_related('country')
        print('len internal funded untouched', len(internal_funded_untouched))
        csv_writer = csv.writer(sys.stdout)
        csv_writer.writerow(('tola_pk', 'tola_gait', 'program_name', 'program_countries', 'reporting_period_end'))
        for program in internal_funded_untouched:
            csv_writer.writerow((
                program.pk, program.gaitid, program.name, program.countries, program.reporting_period_end))
            # print(f'pk={program.pk}, gait={program.gaitid}, {program.name}, {program.countries}, {program.reporting_period_end}')

        # print('dispositions', '\n'.join([f'{k}: {v}' for k, v in dispositions.items()]))

        print('total rows processed: ', total_rows_processed)


def process_file(file, initial, tola_gait_to_program_map, tola_external_id_to_program_map, import_gait_to_program_map):

    dispositions = []

    with CSVReaderHeaderChecker(file) as csv_reader:

        for line in csv_reader:
            import_external_id, import_gait_id_string, import_fund_code_string, import_external_name, import_funded, \
            import_country_name_sring = [
                line[HEADERS['Unique ID']], line[HEADERS['GAIT IDs']], line[HEADERS['Fund Code(s)']],
                line[HEADERS['Program Name']], line[HEADERS['Funded']], line[HEADERS['Country Names']]
            ]

            if initial:
                if import_gait_id_string:
                    import_gait_id_list = [gid.strip() for gid in import_gait_id_string.split(',')]
                    import_programs_all_gaits = [
                        program
                        for gid in import_gait_id_list
                        for program in import_gait_to_program_map[gid]
                    ]

                    tola_programs_all_gaits = []
                    for gait_id in import_gait_id_list:
                        try:
                            tola_programs_all_gaits.extend(tola_gait_to_program_map[gait_id])
                        except KeyError:
                            pass
                    # print('multiple progrs', internal_programs)
                    if len(tola_programs_all_gaits) == 0:
                        dispositions.append(Disposition(
                            ERROR_NO_MATCHING_GAIT, import_external_id, import_gait_id_string, None, None))
                        continue
                    elif len(set(p.tola_program_id for p in tola_programs_all_gaits) )== 1 and \
                             len(set(p.import_program_id for p in import_programs_all_gaits)) == 1:
                        tola_program = tola_programs_all_gaits[0]
                        import_program = import_programs_all_gaits[0]
                        if set(tola_program.tola_country_name_list) == \
                                set(import_program.import_country_name_list):
                            dispositions.append(Disposition(
                                SUCCESS_SIMPLE, import_external_name, import_gait_id_string,
                                tola_program.tola_program_id, ','.join(tola_program.tola_country_name_list)))
                        else:
                            dispositions.append(Disposition(
                                ERROR_SIMPLE_MISMATCHED_COUNTRY, import_external_name, import_gait_id_string,
                                tola_program.tola_program_id, ','.join(tola_program.tola_country_name_list)))
                    else:
                        print('Unimplemented')

                #     elif len(set([p.internal_program_id for p in internal_programs])) != 1:
                #         dispositions['warn_excess_gait'].append(WarnExcessGAIT(
                #             import_external_id, import_gait_id_string, tuple(set(p.internal_program_id for p in internal_programs))))
                #         continue
                #
                #     if set(import_country_name_sring.split(',')) != set(internal_programs[0].internal_country_names):
                #         dispositions['country_mismatch'].append(WarnCountryMismatch(
                #             import_external_id,
                #             import_gait_id_string,
                #             tuple(set(p.internal_program_id for p in internal_programs)),
                #             tuple(set(internal_countries))))
                #         continue
                #
                #
                # else:
                #     dispositions['warn_no_gait'].append(WarnNoGAIT(import_external_id, import_gait_id_string))


            else:
                print('update')
                # if not import_funded or import_funded != 'Funded':
                #     dispositions['skipped_not_funded'].append(SkippedNotFunded(import_external_id, import_gait_id_string))
                #     continue

                # if import_external_id in tola_external_id_to_program_map.keys():
                    # dispositions['updated_program'].append(
                    #     SuccessUpdatedProgram(
                    #         import_external_id,
                    #         import_external_name,
                    #         [internal_programs[0].internal_program_id]))

                # if import_gait_id_string:
                #     gait_ids = [gid.strip() for gid in import_gait_id_string.split(',')]
                #     internal_programs = []
                #     internal_countries = []
                #     for gait_id in gait_ids:
                #         if gait_id in tola_gait_to_program_map:
                #             if len(tola_gait_to_program_map[gait_id]) > 1:
                #                 internal_programs.extend(tola_gait_to_program_map[gait_id])
                #                 # internal_programs.extend(
                #                 #     chain.from_iterable([p.internal_program_id for p in tola_gait_to_program_map[gait_id]]))
                #                 internal_countries.extend(
                #                     chain.from_iterable([p.internal_country_names for p in tola_gait_to_program_map[gait_id]]))
                #                 break
                #             else:
                #                 internal_programs.extend(tola_gait_to_program_map[gait_id])
                #     # print('multiple progrs', internal_programs)
                #     if len(internal_programs) == 0:
                #         dispositions['warn_no_gait'].append(WarnNoGAIT(import_external_id, import_gait_id_string))
                #         continue
                #     if len(set([p.internal_program_id for p in internal_programs])) != 1:
                #         dispositions['warn_excess_gait'].append(WarnExcessGAIT(
                #             external_id, gait_id_string, tuple(set(p.internal_program_id for p in internal_programs))))
                #         continue
                #
                #     if set(external_country_names.split(',')) != set(internal_programs[0].internal_country_names):
                #         dispositions['country_mismatch'].append(WarnCountryMismatch(
                #             external_id,
                #             gait_id_string,
                #             tuple(set(p.internal_program_id for p in internal_programs)),
                #             tuple(set(internal_countries))))
                #         continue
                #
                #     dispositions['added_external_id'].append(SuccessAddedProgramID(
                #         external_id, external_name, tuple(set(p.internal_program_id for p in internal_programs))))
                # else:
                #     if initial == 'initial':
                #         dispositions['warn_no_gait'].append(WarnNoGAIT(external_id, gait_id_string))
                #     else:
                #         dispositions['created_program'].append(SuccessCreatedProgram(external_id, gait_id_string))

        # print('rows in file: ', line_count)

    return dispositions


def get_program_maps(filepath):
    import_gait_to_program_map = {}
    with CSVReaderHeaderChecker(filepath) as csv_reader:
        for line in csv_reader:
            import_program_id, import_gait_id_string, import_country_name_string = [
                line[HEADERS['Unique ID']], line[HEADERS['GAIT IDs']], line[HEADERS['Country Names']]
            ]
            for gid in [g.strip() for g in import_gait_id_string.split(',')]:
                program_ref = ImportProgramRef(
                    import_program_id,
                    tuple([n.strip() for n in import_gait_id_string.split(',')]),
                    tuple([n.strip() for n in import_country_name_string.split(',')])
                )
                try:
                    import_gait_to_program_map[gid].append(program_ref)
                except KeyError:
                    import_gait_to_program_map[gid] = [program_ref]

    tola_gait_to_program_map = {}
    tola_external_id_to_program_map = {}
    programs = Program.objects.all().prefetch_related('country')
    for program in programs:
        if program.gaitid:
            for g in program.gaitid.split(','):
                try:
                    tola_gait_to_program_map[g].append(
                        TolaProgramRef(program.id, program.countries.split(','), program))
                except KeyError:
                    tola_gait_to_program_map[g] = [
                        TolaProgramRef(program.id, program.countries.split(','), program)]
        if program.external_program_id:
            tola_external_id_to_program_map[program.external_program_id] = program

    return import_gait_to_program_map, tola_gait_to_program_map, tola_external_id_to_program_map
