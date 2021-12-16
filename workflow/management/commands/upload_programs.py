import csv
from itertools import chain
from collections import namedtuple
from django.core.management.base import BaseCommand, CommandError
from django.db import connection
from workflow.models import *
from django.utils import timezone


class BadHeader(Exception):
    pass


headers = {'Unique ID': 0, 'GAIT IDs': 7, 'Fund Code(s)': 8, 'Program Name': 16, 'Funded': 17, 'Country Names': 20}


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


        try:
            process_file(file, options['initial'])
        except BadHeader as e:
            print('Unexpected header values')
            print('Expected ', ','.join(headers.keys()))
            print('Found ', e)


def process_file(file, initial):
    print('start query num', len(connection.queries))

    # build reference for existing gait ids and their associated programs
    ProgramRef = namedtuple('ProgramRef', ['internal_program_id', 'internal_country_names', 'program_obj'])
    gait_to_program_map = {}
    external_id_to_program_map = {}
    programs = Program.objects.all().prefetch_related('country')
    for program in programs:
        if program.gaitid:
            for g in program.gaitid.split(','):
                try:
                    gait_to_program_map[g].append(ProgramRef(program.id, program.countries.split(','), program))
                except KeyError:
                    gait_to_program_map[g] = [ProgramRef(program.id, program.countries.split(','), program)]
        if program.external_program_id:
            external_id_to_program_map[program.external_program_id] = program

    # Define success/fail types.  Using named tuples to make downstream usage more clear
    external_pg_fields = ['external_program_id', 'external_gait_id']
    WarnNoGAIT = namedtuple('WarnNoGAIT', external_pg_fields)  # Use if external gait id is not found in Tola
    SuccessCreatedProgram = namedtuple('SuccessCreatedProgram', external_pg_fields)
    SkippedNotFunded = namedtuple('SkippedNotFunded', external_pg_fields)

    int_ext_fields = ['external_id', 'external_gait_string', 'internal_program_ids']
    SuccessUpdatedProgram = namedtuple('SuccessUpdatedProgram', int_ext_fields)
    SuccessAddedProgramID = namedtuple('SuccessAddedProgramID', int_ext_fields)
    SuccessNoChange = namedtuple('SuccessNoChange', int_ext_fields)
    WarnExcessGAIT = namedtuple('WarnExcessGAIT', int_ext_fields)  # Many programs for one GAIT id
    WarnGAITProgramMismatch = namedtuple('WarnGAITProgramMismatch', int_ext_fields)

    int_ext_fields_with_country = ['external_id', 'external_gait_string', 'internal_program_ids', 'internal_countries']
    WarnCountryMismatch = namedtuple('WarnCountryMismatch', int_ext_fields_with_country)


    events = {
        'warn_no_gait': [], 'warn_excess_gait': [], 'funded_not_found': [], 'added_external_id': [],
        'created_program': [], 'updated_program': [], 'gait_program_mismatch': [], 'no_change': [],
        'country_mismatch': [], 'skipped_not_funded': []}
    print('before loop query num', len(connection.queries))
    # headers = {'Unique ID': 0, 'GAIT IDs': 7, 'Fund Code(s)': 8, 'Funded': 17, 'Country Names': 20}
    with open(file, 'r', encoding='utf-8-sig') as fh:

        passed_header = False
        # loops = 0
        line_count = 0
        for line in csv.reader(fh):
            # loops += 1
            # if loops > 100:
            #     break
            if not passed_header:
                file_headers = ','.join([line[i].strip() for i in headers.values()])
                if file_headers != ','.join(headers):
                    raise BadHeader(file_headers)
                passed_header = True
                continue
            line_count += 1
            external_id, gait_id_string, fund_code_string, external_name, funded, external_country_names = [
                line[headers['Unique ID']], line[headers['GAIT IDs']], line[headers['Fund Code(s)']],
                line[headers['Program Name']], line[headers['Funded']], line[headers['Country Names']]
            ]

            if not funded or funded != 'Funded':
                events['skipped_not_funded'].append(SkippedNotFunded(external_id, gait_id_string))
                continue

            if external_id in external_id_to_program_map.keys():
                events['updated_program'].append(
                    SuccessUpdatedProgram(
                        external_id,
                        external_name,
                        [internal_programs[0].internal_program_id]))

            if gait_id_string:
                gait_ids = [gid.strip() for gid in gait_id_string.split(',')]
                internal_programs = []
                internal_countries = []
                for gait_id in gait_ids:
                    if gait_id in gait_to_program_map:
                        if len(gait_to_program_map[gait_id]) > 1:
                            internal_programs.extend(gait_to_program_map[gait_id])
                            # internal_programs.extend(
                            #     chain.from_iterable([p.internal_program_id for p in gait_to_program_map[gait_id]]))
                            internal_countries.extend(
                                chain.from_iterable([p.internal_country_names for p in gait_to_program_map[gait_id]]))
                            break
                        else:
                            internal_programs.extend(gait_to_program_map[gait_id])
                # print('multiple progrs', internal_programs)
                if len(internal_programs) == 0:
                    events['warn_no_gait'].append(WarnNoGAIT(external_id, gait_id_string))
                    continue
                if len(set([p.internal_program_id for p in internal_programs])) != 1:
                    events['warn_excess_gait'].append(WarnExcessGAIT(
                        external_id, gait_id_string, tuple(set(p.internal_program_id for p in internal_programs))))
                    continue

                if set(external_country_names.split(',')) != set(internal_programs[0].internal_country_names):
                    events['country_mismatch'].append(WarnCountryMismatch(
                        external_id,
                        gait_id_string,
                        tuple(set(p.internal_program_id for p in internal_programs)),
                        tuple(set(internal_countries))))
                    continue

                events['added_external_id'].append(SuccessAddedProgramID(
                    external_id, external_name, tuple(set(p.internal_program_id for p in internal_programs))))
            else:
                if initial == 'initial':
                    events['warn_no_gait'].append(WarnNoGAIT(external_id, gait_id_string))
                else:
                    events['created_program'].append(SuccessCreatedProgram(external_id, gait_id_string))

        total_rows_processed = 0
        internal_programs_touched = set()
        for event_type, event_values in events.items():
            print(f'{event_type}: {len(event_values)}')
            total_rows_processed += len(event_values)
            for event in event_values:
                try:
                    internal_programs_touched |= set(event.internal_program_ids)
                except AttributeError:
                    pass
                # print('tiint rpogrm', internal_programs_touched)
        # for no_gait_obj in events['warn_no_gait']:
        #     print(f'Could not find a gait id in TolaData. External program id: {no_gait_obj.external_id}, gait string: {no_gait_obj.gait_id}')
        print('programs touched', len(internal_programs_touched))
        internal_funded_program_ids = list(Program.objects.filter(funding_status='Funded').values_list('pk', flat=True))
        print('programs funded', len(internal_funded_program_ids))
        internal_programs_untouched_ids = set(internal_funded_program_ids) - set(internal_programs_touched)
        print('untouched programs', len(internal_programs_untouched_ids), internal_programs_untouched_ids)
        internal_funded_untouched = Program.objects.filter(pk__in=internal_programs_untouched_ids).prefetch_related('country')
        for program in internal_funded_untouched:
            print(f'pk={program.pk}, gait={program.gaitid}, {program.name, program.countries}, {program.reporting_period_end}')



        # print('events', '\n'.join([f'{k}: {v}' for k, v in events.items()]))

        print('total rows processed: ', total_rows_processed)
        print('rows in file: ', line_count)

        print('after loop query num', len(connection.queries))
    return events
