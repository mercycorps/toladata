"""
Fixes target periods that were created with mid-month dates.
"""
import itertools

from django.core.management.base import BaseCommand
from datetime import timedelta, date, timedelta
import calendar

from django.db import transaction

from workflow.models import Program
from indicators.models import PeriodicTarget, Indicator


class Command(BaseCommand):
    help = """
        Fixes target periods that were created with mid-month dates.
        """

    def add_arguments(self, parser):
        parser.add_argument('--execute', action='store_true')

    def make_program_log_obj(self, program, old_start_date, old_end_date, new_start_date, new_end_date):
        """Dict of old/new values of a program being fixed"""
        countries = ','.join(list(program.country.all().values_list('country', flat=True)))
        return {
            'countries': countries,
            'name': program.name.encode('utf-8'),
            'old_start_date': old_start_date,
            'old_end_date': old_end_date,
            'new_start_date': new_start_date,
            'new_end_date': new_end_date,
            'updated_periodic_targets': [],
        }

    def handle(self, *args, **options):
        affected_program_ids = set()
        affected_program_log = {}

        # Start a transaction
        transaction.set_autocommit(False)

        # fix program reporting period dates
        for program in Program.objects.all():
            program_start = program.reporting_period_start
            program_end = program.reporting_period_end
            if program_start and program_start.day != 1:
                affected_program_ids.add(program.id)
                program.reporting_period_start = program_start.replace(day=1)
            if program_end and (program_end + timedelta(days=1)).day != 1:
                affected_program_ids.add(program.id)
                last_day = \
                    calendar.monthrange(program_end.year, program_end.month)[1]
                program.reporting_period_end = program_end.replace(day=last_day)

            if program.id in affected_program_ids:
                affected_program_log[program.id] = (
                    self.make_program_log_obj(program, program_start, program_end, program.reporting_period_start, program.reporting_period_end)
                )

                if options['execute']:
                    program.save()

        periodic_targets = PeriodicTarget.objects \
            .filter(
                indicator__program__id__in=affected_program_ids,
                indicator__target_frequency__in=Indicator.REGULAR_TARGET_FREQUENCIES,
            )\
            .order_by('end_date')

        indicators = Indicator.objects.filter(program_id__in=affected_program_ids)
        indicators.prefetch_related('periodictargets')
        oddball_indicators = set()
        discontinuity_errors = set()
        for indicator in indicators:
            prior_end = None
            for pt in periodic_targets.filter(indicator__id=indicator.id):
                if not pt.start_date or not pt.end_date:
                    oddball_indicators.add(indicator)
                    continue
                changed = False

                indicator = pt.indicator
                pt_start = pt.start_date
                pt_end = pt.end_date

                if pt_start.day != 1:
                    pt.start_date = pt_start.replace(day=1)
                    changed = True

                end_test = pt_end + timedelta(days=1)

                if end_test.day != 1:
                    pt.end_date = pt_end.replace(day=1) - timedelta(days=1)
                    changed = True

                if changed:
                    affected_program_log[indicator.program_id]['updated_periodic_targets'].append({
                        'indicator': indicator,
                        'periodic_name': pt.period_name,
                        'old_start_date': pt_start,
                        'old_end_date': pt_end,
                        'new_start_date': pt.start_date,
                        'new_end_date': pt.end_date,
                    })

                    # Check for periods that aren't perfectly consecutive
                    if prior_end and prior_end + timedelta(days=1) != pt.start_date:
                        discontinuity_errors.add('{} {}'.format(
                            indicator.program.name.encode('utf-8'), indicator.name.encode('utf-8')
                        ))
                    prior_end = pt.end_date

                    if options['execute']:
                        pt.save()

        # Reporting
        for program_log_obj in sorted(affected_program_log.values(), key=lambda x: x['countries']):
            print '{} | {} | ({}, {}) => ({}, {})'.format(program_log_obj['countries'],
                                                          program_log_obj['name'],
                                                          program_log_obj['old_start_date'],
                                                          program_log_obj['old_end_date'],
                                                          program_log_obj['new_start_date'],
                                                          program_log_obj['new_end_date'])

            if program_log_obj['updated_periodic_targets']:
                print '  Periodic Targets Updated:'
                for indicator_id, pt_log_objs in itertools.groupby(program_log_obj['updated_periodic_targets'], lambda x: x['indicator'].id):
                    print '    Indicator id:', indicator_id
                    for pt_log_obj in pt_log_objs:
                        print '      {} | ({}, {}) => ({}, {})'.format(pt_log_obj['periodic_name'],
                                                                       pt_log_obj['old_start_date'],
                                                                       pt_log_obj['old_end_date'],
                                                                       pt_log_obj['new_start_date'],
                                                                       pt_log_obj['new_end_date'])

        print '\nTotal affected programs count:', len(affected_program_ids)

        print '\n\nDiscontinuous periods found:'
        if len(discontinuity_errors) > 0:
            print '\n'.join(discontinuity_errors)
        else:
            print 'None'

        print '\n\noddball indicators\n'

        for indicator in oddball_indicators:
            print '{} ||| {}'.format(indicator.program, indicator.name.encode('utf-8'))
            for pt in periodic_targets.filter(indicator__id=indicator.id):
                print '    ', pt, '| start date:', pt.start_date, '| end date:', pt.end_date

        print ''

        # Manually commit or rollback DB transaction
        if options['execute']:
            print 'Committing changes to DB'
            transaction.commit()
        else:
            print 'Rolling back DB transaction (Use --execute to commit changes to DB)'
            transaction.rollback()
