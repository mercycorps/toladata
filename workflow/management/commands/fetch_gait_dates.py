import requests
import json
import dateutil
import datetime
from django.conf import settings
from django.core.management.base import BaseCommand
from django.db.models import Q, Min, Max

from workflow.models import Program
from indicators.models import Indicator


class Command(BaseCommand):
    help = """
        Gets the GAIT program start and end dates from mcapi.
        """

    def handle(self, *args, **options):
        # for program in Program.objects.all():
        #     program.start_date = None
        #     program.end_date = None
        #     program.save()

        # Get a list of GAIT ids to submit to the API
        programs = Program.objects.filter(
            Q(gaitid__isnull=False), Q(start_date__isnull=True) | Q(end_date__isnull=True)).order_by('id')
        program_gait_ids = []
        for program in programs:
            try:
                program_gait_ids.append(str(int(program.gaitid)))
            except ValueError:
                pass
        base_url = settings['PROGRAM_API_BASE_URL']
        params = {'id': ','.join(program_gait_ids)}
        headers = {'Authorization': 'Token {}'.format(settings.PROGRAM_API_TOKEN)}
        response = requests.get(base_url, params=params, headers=headers)
        responseObj = json.loads(response.content)['results']

        # Create a map from the retrieved data, making sure to flag any duplicate GAIT ids
        gaitid_map = dict()
        duplicate_ids = []
        for gaitobj in responseObj:
            gaitid = int(gaitobj['gaitid'])
            # Need to handle duplicate gaitids
            if gaitid in gaitid_map:
                del (gaitid_map[gaitid])
                duplicate_ids.append(gaitid)
            elif gaitid not in duplicate_ids:
                gaitid_map[gaitid] = gaitobj

        # Initiate all the tracking variables
        warnings = []
        errors = []
        single_date_programs = []
        multi_date_programs = []
        final_values = []
        programs_updated = 0
        not_int = 0
        gait_empty = 0

        for program in programs:
            if program.gaitid and (not program.start_date or not program.end_date):

                # Skip programs that have bad GAIT ids
                try:
                    p_gaitid = int(program.gaitid)
                except ValueError:
                    not_int += 1
                    continue

                if p_gaitid in duplicate_ids:
                    errors.append('ERROR: Multiple programs for program id %s, gaitid %s.' % (program.id, p_gaitid))
                    continue
                elif p_gaitid not in gaitid_map:
                    warnings.append('Warning: Program %s %s (GAIT id %s) not found in GAIT API.' % (
                        program.id, program.name, p_gaitid))
                    continue

                # Get the unique start and end dates across all indicators in a program
                programs_updated += 1
                unique_start_dates = set(Indicator.objects.filter(program=program).annotate(
                    pstart=Min('periodictargets__start_date')).values_list('pstart', flat=True))
                unique_start_dates = [date for date in unique_start_dates if date is not None]
                unique_end_dates = set(Indicator.objects.filter(program=program).annotate(
                    pend=Max('periodictargets__end_date')).values_list('pend', flat=True))
                unique_end_dates = [date for date in unique_end_dates if date is not None]

                # Set the program start dates.  Catch the exception where retrieved values are None.
                try:
                    program.start_date = dateutil.parser.parse(gaitid_map[p_gaitid]['start_date']).date()
                except TypeError:
                    program.start_date = None

                try:
                    program.end_date = dateutil.parser.parse(gaitid_map[p_gaitid]['end_date']).date()
                except TypeError:
                    program.end_date = None

                # If there are no periodic targets set for any indicator, or if all indicators are not period-linked,
                # set reporting dates to first/last day of the start/end month.
                if len(unique_start_dates) == 0:
                    if program.start_date is not None:
                        program.reporting_period_start = program.start_date.replace(day=1)
                    if program.end_date is not None:
                        next_month = program.end_date.replace(day=28) + datetime.timedelta(days=4)
                        program.reporting_period_end = next_month - datetime.timedelta(days=next_month.day)

                # If there are existing periodic targets set for any indicator, use the earliest date as the start
                # month.  Use the latest periodic target ending month or the GAIT date, whichever is later, as the
                # reporting end month.
                else:
                    name_max_len = 40
                    prog_string = "%s - [pk=%s] (gaitid=%s) %s - unique starts:%s - unique ends:%s" % (
                        ", ".join(list(program.country.values_list('country', flat=True))),
                        program.pk,
                        program.gaitid,
                        program.name[:name_max_len],
                        [str(d) for d in unique_start_dates],
                        [str(d) for d in unique_end_dates])
                    if len(unique_start_dates) == 1:
                        single_date_programs.append(prog_string)
                    else:
                        multi_date_programs.append(prog_string)

                    program.reporting_period_start = sorted(unique_start_dates)[0]

                    if program.end_date is not None:
                        next_month = program.end_date.replace(day=28) + datetime.timedelta(days=4)
                        end_date = next_month - datetime.timedelta(days=next_month.day)
                        unique_end_dates.append(end_date)
                    program.reporting_period_end = sorted(unique_end_dates)[-1]

                program.save()
                if len(unique_start_dates) > 0:
                    final_values.append('[%s]%s - pstart=%s, pend=%s, rstart=%s, rend=%s' % (
                        program.pk, program.name[:name_max_len], program.start_date, program.end_date,
                        program.reporting_period_start, program.reporting_period_end))
            else:
                gait_empty += 1

        print('Programs with numeric GAIT ids but with no data in GAIT (%s)' % len(warnings))
        print("\n".join(warnings))
        print('\nSingle date value programs (%s):' % len(single_date_programs))
        print('\n'.join(single_date_programs))
        print('\nMulti date value programs (%s):' % len(multi_date_programs))
        print('\n'.join(multi_date_programs))
        print('\nFinal Values in database for programs with date-linked indicators:')
        print('\n'.join(final_values))
        print('\nThere were %s duplicate gaitids' % len(duplicate_ids))
        print('\nTotal program count:', len(programs))
        print('GAIT ids in Tola that are not integers:', not_int)
        print('Programs with no GAIT info:', len(warnings))
        print('Programs with no value in the gaitid field:', gait_empty)
        print('Programs updated:', programs_updated)
