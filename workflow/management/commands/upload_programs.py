import csv
import sys
from itertools import chain
from collections import namedtuple, defaultdict
from django.core.management.base import BaseCommand, CommandError
from django.db import connection
from workflow.models import *
from django.utils import timezone


TolaProgramRef = namedtuple(
    'ProgramRef', ['tola_program_id', 'tola_country_name_list', 'tola_program_obj'])
ImportProgramRef = namedtuple(
    'ImportFileProgramRef', [
        'import_program_id', 'import_program_name', 'import_gait_id_list', 'import_country_name_list'])

# Define disposition types.  Using named tuples to make downstream usage more clear
SUCCESS_SIMPLE = 'success_simple'
ERROR_NO_MATCHING_GAIT = 'error_no_matching_gait'
ERROR_SIMPLE_MISMATCHED_COUNTRY = 'error_simple_mismatched_counntry'
ERROR_ONE_IMPORT_MANY_TOLA_PROGRAMS = 'error_one_import_many_tola_programs'
ERROR_MANY_IMPORT_ONE_TOLA_PROGRAM = 'error_many_import_one_tola_programs'
ERROR_MANY_IMPORT_MANY_TOLA_PROGRAMS = 'error_many_import_many_tola_programs'

disposition_fields = [
    'disposition_type', 'import_program_ids', 'tola_program_ids']
Disposition = namedtuple('Disposition', disposition_fields)

HEADERS = {'Unique ID': 0, 'GAIT IDs': 7, 'Fund Code(s)': 8, 'Program Name': 16, 'Funded': 17, 'Country Names': 20}


class BadHeader(Exception):
    pass


class BadProgrammer(Exception):
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
        parser.add_argument(
            '--verbose', action='store_true', help='Print detail about some of the errors.')


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
        import_gait_to_program_map, import_external_id_map, tola_gait_to_program_map, \
        tola_external_id_to_program_map, tola_internal_id_map = get_program_maps(file)

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
        dispositions_by_type = defaultdict(list)
        for disposition in dispositions:
            dispositions_by_type[disposition.disposition_type].append(disposition)
            try:
                internal_programs_touched |= set(disposition.tola_program_ids)
            except (AttributeError, TypeError):
                pass

        internal_funded_program_ids = list(
            Program.objects
            .filter(funding_status='Funded')
            .exclude(country__country__in=['Tolaland', 'Mapping Our Reach'])
            .values_list('pk', flat=True))
        internal_programs_untouched_ids = set(internal_funded_program_ids) - set(internal_programs_touched)
        internal_funded_untouched = Program.objects \
            .filter(pk__in=internal_programs_untouched_ids) \
            .exclude(country__country__in=['Tolaland', 'Mapping Our Reach']) \
            .prefetch_related('country')

        if options['verbose']:
            # Wrtie the Tola funded countries not found in external source
            csv_writer = csv.writer(sys.stdout)
            csv_writer.writerow(('tola_pk', 'tola_gait', 'program_name', 'program_countries', 'reporting_period_end'))
            for program in internal_funded_untouched:
                csv_writer.writerow((
                    program.pk, program.gaitid, program.name, program.countries, program.reporting_period_end))
            print('')

            # Write the simple country mismatches to STDOUT
            csv_writer.writerow((
                'import_program_id', 'import_program_name', 'import_gaits', 'import_countries', 'tola_program_id', 'tola_program_name',
                'tola_countries', 'tola_active_status'))
            for disposition in dispositions_by_type[ERROR_SIMPLE_MISMATCHED_COUNTRY]:
                tola_program_obj = tola_internal_id_map[disposition.tola_program_ids[0]]
                import_program_obj = import_external_id_map[disposition.import_program_ids[0]]
                status = 'Active' if tola_program_obj.funding_status == 'Funded' else 'Inactive'
                csv_writer.writerow((
                    disposition.import_program_ids[0],
                    import_program_obj.import_program_name,
                    ', '.join(import_program_obj.import_gait_id_list),
                    ', '.join(import_program_obj.import_country_name_list),
                    disposition.tola_program_ids[0],
                    tola_program_obj.name,
                    tola_program_obj.countries,
                    status
                ))
            print('')

            # Write many/one import to many/one Tola program relationships
            csv_writer.writerow((
                'import_program_id', 'import_program_name', 'import_gaits', 'import_countries', 'tola_program_id', 'tola_program_name',
                'tola_countries', 'tola_active_status'))
            print('')
            print("One import file program to many TolaData programs")
            for disposition in dispositions_by_type[ERROR_ONE_IMPORT_MANY_TOLA_PROGRAMS]:
                import_program_obj = import_external_id_map[disposition.import_program_ids[0]]
                for tola_program_id in disposition.tola_program_ids:
                    tola_program_obj = tola_internal_id_map[tola_program_id]
                    status = 'Active' if tola_program_obj.funding_status == 'Funded' else 'Inactive'
                    csv_writer.writerow((
                        import_program_obj.import_program_id,
                        import_program_obj.import_program_name,
                        ', '.join(import_program_obj.import_gait_id_list),
                        ', '.join(import_program_obj.import_country_name_list),
                        tola_program_id,
                        tola_program_obj.name,
                        tola_program_obj.countries,
                        status
                    ))

            print('')
            print("Many import file programs to one TolaData programs")
            for disposition in dispositions_by_type[ERROR_MANY_IMPORT_ONE_TOLA_PROGRAM]:
                tola_program_obj = tola_internal_id_map[disposition.tola_program_ids[0]]
                status = 'Active' if tola_program_obj.funding_status == 'Funded' else 'Inactive'
                for import_program_id in disposition.import_program_ids:
                    import_program_obj = import_external_id_map[import_program_id]
                    csv_writer.writerow((
                        import_program_id,
                        import_program_obj.import_program_name,
                        ', '.join(import_program_obj.import_gait_id_list),
                        ', '.join(import_program_obj.import_country_name_list),
                        disposition.tola_program_ids[0],
                        tola_program_obj.name,
                        tola_program_obj.countries,
                        status
                    ))

            print('')
            print("Many import file programs to many TolaData programs")
            for disposition in dispositions_by_type[ERROR_MANY_IMPORT_MANY_TOLA_PROGRAMS]:
                for ipid in disposition.import_program_ids:
                    import_program_obj = import_external_id_map[ipid]
                    for tola_program_id in disposition.tola_program_ids:
                        tola_program_obj = tola_internal_id_map[tola_program_id]
                        status = 'Active' if tola_program_obj.funding_status == 'Funded' else 'Inactive'
                        csv_writer.writerow((
                            ipid,
                            import_program_obj.import_program_name,
                            ', '.join(import_program_obj.import_gait_id_list),
                            ', '.join(import_program_obj.import_country_name_list),
                            tola_program_id,
                            tola_program_obj.name,
                            tola_program_obj.countries,
                            status
                        ))

        print('dispositions', '\n'.join([f'{k}: {len(v)}' for k, v in dispositions_by_type.items()]))

        print('total rows processed: ', total_rows_processed)


def process_file(file, initial, tola_gait_to_program_map, tola_external_id_to_program_map, import_gait_to_program_map):

    dispositions = []

    with CSVReaderHeaderChecker(file) as csv_reader:

        for line in csv_reader:
            import_external_id, import_gait_id_string, import_fund_code_string, import_external_name, import_funded, \
            import_country_name_string = [
                line[HEADERS['Unique ID']], line[HEADERS['GAIT IDs']], line[HEADERS['Fund Code(s)']],
                line[HEADERS['Program Name']], line[HEADERS['Funded']], line[HEADERS['Country Names']]
            ]
            import_country_name_list = [c.strip() for c in import_country_name_string.split()]

            if initial:
                if import_gait_id_string:
                    import_gait_id_list = [gid.strip() for gid in import_gait_id_string.split(',')]
                    import_programs_all_gaits = [
                        program
                        for gid in import_gait_id_list
                        for program in import_gait_to_program_map[gid]
                    ]
                    import_program_id_set = set(p.import_program_id for p in import_programs_all_gaits)

                    tola_programs_all_gaits = []
                    for gait_id in import_gait_id_list:
                        try:
                            tola_programs_all_gaits.extend(tola_gait_to_program_map[gait_id])
                        except KeyError:
                            pass
                    tola_program_id_set = set(p.tola_program_id for p in tola_programs_all_gaits)

                    # Handle external program with no match in Tola
                    if len(tola_programs_all_gaits) == 0:
                        dispositions.append(Disposition(
                            ERROR_NO_MATCHING_GAIT, [import_external_id], None))
                        continue

                    # Handle matching of a single program in Tola
                    elif len(tola_program_id_set) == 1 and len(import_program_id_set) == 1:
                        tola_program = tola_programs_all_gaits[0]
                        import_program = import_programs_all_gaits[0]
                        if set(tola_program.tola_country_name_list) == \
                                set(import_program.import_country_name_list):
                            dispositions.append(Disposition(
                                SUCCESS_SIMPLE, [import_external_id], [tola_program.tola_program_id]))
                        else:
                            dispositions.append(Disposition(
                                ERROR_SIMPLE_MISMATCHED_COUNTRY, [import_external_id], [tola_program.tola_program_id]))
                    elif len(tola_program_id_set) > 1 and len(import_program_id_set) == 1:
                        dispositions.append(Disposition(
                            ERROR_ONE_IMPORT_MANY_TOLA_PROGRAMS,
                            list(import_program_id_set),
                            list(tola_program_id_set)))

                    elif len(tola_program_id_set) == 1 and len(import_program_id_set) > 1:
                        dispositions.append(Disposition(
                            ERROR_MANY_IMPORT_ONE_TOLA_PROGRAM,
                            list(import_program_id_set),
                            list(tola_program_id_set)))
                    elif len(tola_program_id_set) > 1 and len(import_program_id_set) > 1:
                        dispositions.append(Disposition(
                            ERROR_MANY_IMPORT_MANY_TOLA_PROGRAMS,
                            list(import_program_id_set),
                            list(tola_program_id_set)))
                    else:
                        raise BadProgrammer('You messed something up')

            else:
                print('update')

    return dispositions


def get_program_maps(filepath):
    import_gait_to_program_map = {}
    import_external_id_map = {}
    with CSVReaderHeaderChecker(filepath) as csv_reader:
        for line in csv_reader:
            import_program_id, import_program_name, import_gait_id_string, import_country_name_string = [
                line[HEADERS['Unique ID']], line[HEADERS['Program Name']], line[HEADERS['GAIT IDs']],
                line[HEADERS['Country Names']]
            ]
            program_ref = ImportProgramRef(
                import_program_id,
                import_program_name,
                tuple([n.strip() for n in import_gait_id_string.split(',')]),
                tuple([n.strip() for n in import_country_name_string.split(',')])
            )
            for gid in [g.strip() for g in import_gait_id_string.split(',')]:
                try:
                    import_gait_to_program_map[gid].append(program_ref)
                except KeyError:
                    import_gait_to_program_map[gid] = [program_ref]

            import_external_id_map[import_program_id] = program_ref

    tola_gait_to_program_map = {}
    tola_external_id_to_program_map = {}
    tola_internal_id_to_program_map = {}
    programs = Program.objects.all().prefetch_related('country')
    for program in programs:
        if program.gaitid:
            for g in program.gaitid.split(','):
                try:
                    tola_gait_to_program_map[g].append(
                        TolaProgramRef(
                            program.id, [c.strip() for c in program.countries.split(',')], program))
                except KeyError:
                    tola_gait_to_program_map[g] = [
                        TolaProgramRef(program.id, [c.strip() for c in program.countries.split(',')], program)]
        if program.external_program_id:
            tola_external_id_to_program_map[program.external_program_id] = program
        tola_internal_id_to_program_map[program.pk] = program

    return import_gait_to_program_map, import_external_id_map, tola_gait_to_program_map, \
           tola_external_id_to_program_map, tola_internal_id_to_program_map
