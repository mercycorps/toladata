from datetime import date, datetime
from django.core.mail import send_mail
from django.core.management.base import BaseCommand
from django.conf import settings
from workflow.program import ProgramUpload
from workflow.discrepancy_report import GenerateDiscrepancyReport
from workflow.utils import AccessMSR


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

        idaa_programs = AccessMSR().program_project_list()
        msr_country_codes_list = AccessMSR().countrycode_list()
        msr_gaitid_list = AccessMSR().gaitid_list()

        counts = {
            'created': 0,
            'invalid': 0,
            'updated': 0,
            'total': len(idaa_programs)
        }

        for program in idaa_programs:
            upload_program = ProgramUpload(
                program['fields'], msr_country_codes_list=msr_country_codes_list, msr_gaitid_list=msr_gaitid_list
            )
            if upload_program.is_valid():
                if options['upload']:
                    upload_program.upload()
                if upload_program.new_upload:
                    counts['created'] += 1
                elif upload_program.program_updated:
                    counts['updated'] += 1
            else:
                counts['invalid'] += 1
            if self.report_date() or options['create_discrepancies']:
                upload_program.create_discrepancies()

        if self.report_date() or options['create_report']:
            report = GenerateDiscrepancyReport()
            report.generate()
            end_time = datetime.now().strftime("%m/%d/%Y, %H:%M:%S")
            self.email_notifications(today, start_time, end_time, counts)

        if not options['supress_output']:
            print(f"Total IDAA Programs: {counts['total']}")
            print(f"Created Programs: {counts['created']}")
            print(f"Updated Programs: {counts['updated']}")
            print(f"Invalid Programs: {counts['invalid']}")

    @staticmethod
    def report_date():
        today = date.today()
        report_day = False
        if today.day == (1 or 15):
            report_day = True
        return report_day

    @staticmethod
    def email_notifications(today, start_time, end_time, counts):
        message = (f"Start time: {start_time}\n"
                   f"End time: {end_time}\n"
                   f"Total IDAA programs: {counts['total']}\n"
                   f"Programs created: {counts['created']}\n"
                   f"Programs updated: {counts['updated']}\n"
                   f"Invalid programs: {counts['invalid']}\n"
                   )
        send_mail(
            f'IDAA program upload report {today}',
            message,
            settings.DEFAULT_FROM_EMAIL,
            ['k8n9e4p6d5n5u1b6@mercycorps.slack.com'],
            fail_silently=False,
        )

