from datetime import date, datetime
from django.core.mail import send_mail
from django.core.management.base import BaseCommand
from django.conf import settings
from workflow.program import ProgramUpload
from workflow.discrepancy_report import GenerateDiscrepancyReport
from workflow.utils import AccessMSR, check_IDAA_duplicates
import logging


logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = """
            Call Sharepoint API. Get JSON data from ProgramProjectID list. This should run as a cron job
            every day with --upload flag and twice a month with --create_discrepancies and --create_report
            flags.
            """

    def add_arguments(self, parser):
        parser.add_argument(
            '--upload', action='store_true', help='Without this flag, the command will only be a dry run')
        parser.add_argument(
            '--create_discrepancies', action='store_true', help='Without this flag, the command will only be a dry run')
        parser.add_argument(
            '--create_report', action='store_true',
            help='Without this flag, the command will only be a dry run')
        parser.add_argument('--supress_output', action='store_true', help='Hide text output')

    def handle(self, *args, **options):
        """
        API call to log into Microsoft account, generate access token.
        API call to MS Graph to access data stored in ProgramProjectID Sharepoint list
        """
        start = datetime.now()
        today = start.strftime("%m/%d/%Y")
        start_time = start.strftime("%m/%d/%Y, %H:%M:%S")
        uploaded_programs = {
            'created': [],
            'updated': []
        }
        created_countries = set()

        idaa_programs = AccessMSR().program_project_list()
        msr_country_codes_list = AccessMSR().countrycode_list()
        msr_gaitid_list = AccessMSR().gaitid_list()

        # Logs any duplicated gaitids
        duplicated_gaitids = check_IDAA_duplicates(idaa_programs)

        counts = {
            'created': 0,
            'invalid': 0,
            'updated': 0,
            'total': len(idaa_programs)
        }

        for index, program in enumerate(idaa_programs):
            upload_program = ProgramUpload(
                program['fields'], msr_country_codes_list=msr_country_codes_list, 
                msr_gaitid_list=msr_gaitid_list, duplicated_gaitids=duplicated_gaitids
            )
            action = ''

            if upload_program.is_valid():
                if options['upload']:
                    upload_program.upload()
                if upload_program.new_upload:
                    counts['created'] += 1
                    uploaded_programs['created'].append(upload_program.get_tola_programs())
                    action = 'created'
                elif upload_program.program_updated:
                    if upload_program.multiple_tola_programs:
                        for updated_program in upload_program.tola_program:
                            counts['updated'] += 1
                            uploaded_programs['updated'].append(updated_program)
                    else:
                        counts['updated'] += 1
                        uploaded_programs['updated'].append(upload_program.tola_program)
                    action = 'updated'
            else:
                counts['invalid'] += 1
                action = 'invalid'
            if upload_program.created_countries:
                created_countries.update(upload_program.created_countries)
            if self.report_date() or options['create_discrepancies']:
                upload_program.create_discrepancies()

            # Invalid programs in IDAA might not have a ProgramName - removes line breaks
            program_name = ''.join(program['fields']['ProgramName'].splitlines()) if 'ProgramName' in program['fields'] else 'N/A'

            logger.info(f"({index + 1}/{len(idaa_programs)}) {action} program {program_name}. Program ID: {program['fields']['id']}")

        if self.report_date() or options['create_report']:
            report = GenerateDiscrepancyReport()
            report.generate()
            end_time = datetime.now().strftime("%m/%d/%Y, %H:%M:%S")
            self.email_notifications(today, start_time, end_time, counts, uploaded_programs, created_countries)

        if not options['supress_output']:
            print(f"Total IDAA Programs: {counts['total']}")
            print(f"Created Programs: {counts['created']}")
            print(f"Updated Programs: {counts['updated']}")
            print(f"Invalid Programs: {counts['invalid']}")
            print(f"Created Countries: {len(created_countries)}")

    @staticmethod
    def report_date():
        today = date.today()
        report_day = False
        if today.day == (1 or 15):
            report_day = True
        return report_day

    @staticmethod
    def email_notifications(today, start_time, end_time, counts, uploaded_programs, created_countries):
        created_programs = '\n'.join([created.name for created in uploaded_programs['created']])
        updated_programs = '\n'.join([updated.name for updated in uploaded_programs['updated']])
        created_countries_str = '\n'.join([country.country for country in created_countries])
        message = (f"Start time: {start_time}\n"
                   f"End time: {end_time}\n"
                   f"Total IDAA programs: {counts['total']}\n"
                   f"Programs created: {counts['created']}\n"
                   f"Programs updated: {counts['updated']}\n"
                   f"Invalid programs: {counts['invalid']}\n"
                   f"Created Countries: {len(created_countries)}"
                   )
        if counts['created']:
            message += f"\nPrograms created in TolaData:\n-----\n{created_programs}\n"
        if counts['updated']:
            message += f"\nPrograms updated in TolaData:\n-----\n{updated_programs}\n"
        if created_countries:
            message += f"\nCountries created in TolaData:\n----\n{created_countries_str}\n"
        send_mail(
            f'IDAA program upload report {today}',
            message,
            settings.DEFAULT_FROM_EMAIL,
            [settings.TOLA_DEVS_EMAIL],
            fail_silently=False,
        )

