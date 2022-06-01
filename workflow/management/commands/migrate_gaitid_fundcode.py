from django.core.exceptions import ValidationError
from workflow.models import Program, GaitID, FundCode
from django.core.management.base import BaseCommand
from django.db.utils import IntegrityError


class Command(BaseCommand):
    """
    Command for moving saved gaitids under Program to a new GaitID table.
    """
    help = "Moves gaitids saved under Program to their own GaitID table"

    def add_arguments(self, parser):
        parser.add_argument('--execute', action='store_true', help='Without this flag, the command will only be a dry run')
        parser.add_argument('--supress_output', action='store_true', help='Supresses the output so tests don\'t get too messy')
        parser.add_argument('--clean', action='store_true', help='Cleans the database. Deletes GaitIDs and FundCodes created by execute.')

    def valid_int(self, value):
        if value is None:
            return False
        try:
            int(value)
            return True
        except ValueError:
            return False
        

    def handle(self, *args, **options):
        if not options['execute'] and not options['supress_output'] and not options['clean']:
            print('Dry Run')

        if options['clean']:
            print('Cleaning the database')
        
        programs = Program.objects.all()
        counts = {
            'gaitid': {
                'created': 0,
                'skipped': 0,
                'deleted': 0,
                'invalid': 0
            },
            'fund_code': {
                'created': 0,
                'skipped': 0,
                'deleted': 0,
                'invalid': 0
            }
        }

        if options['execute']:
            for program in programs:
                if self.valid_int(program.legacy_gaitid):
                    try:
                        gait_id = GaitID(program=program, gaitid=program.legacy_gaitid)
                        gait_id.save()

                        counts['gaitid']['created'] += 1

                        if self.valid_int(program.cost_center):
                            try:
                                fund_code = FundCode(gaitid=gait_id, fund_code=program.cost_center)
                                fund_code.save()
                                counts['fund_code']['created'] += 1
                            except IntegrityError:
                                counts['fund_code']['skipped'] += 1
                            except ValidationError:
                                counts['fund_code']['invalid'] += 1
                        else:
                            counts['fund_code']['invalid'] +=1

                    # Integrity error is raised when the unique_together constraint placed on program, gaitid fails
                    except IntegrityError:
                        counts['gaitid']['skipped'] += 1
                        continue
                else:
                    counts['gaitid']['invalid'] += 1


        if options['clean']:
            gait_ids = GaitID.objects.all()
            for gait_id in gait_ids:
                gait_id.delete()
                counts['gaitid']['deleted'] += 1
                # FundCodes get deleted if GaitID is deleted
                counts['fund_code']['deleted'] += 1

        if not options['supress_output']:
            print('GAIT ids created: ', counts['gaitid']['created'])
            print('Duplicate GAIT ids skipped: ', counts['gaitid']['skipped'])
            print('GAIT ids deleted: ', counts['gaitid']['deleted'])
            print('Gait ids invalid: ', counts['gaitid']['invalid'])
            print('Fund codes created: ', counts['fund_code']['created'])
            print('Duplicate fund codes skipped: ', counts['fund_code']['skipped'])
            print('Fund codes deleted: ', counts['fund_code']['deleted'])
            print('Fund codes invalid: ', counts['fund_code']['invalid'])
