from datetime import date
import requests
from django.core.management.base import BaseCommand
from django.conf import settings
from workflow.program import ProgramUpload
from workflow.discrepancy_report import GenerateDiscrepancyReport


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

    def handle(self, *args, **options):
        """
        API call to log into Microsoft account, generate access token.
        API call to MS Graph to access data stored in ProgramProjectID Sharepoint list
        """
        tenant_id = settings.MS_TENANT_ID
        client_id = settings.MS_TOLADATA_CLIENT_ID
        client_secret = settings.MS_TOLADATA_CLIENT_SECRET
        login_url = f'https://login.microsoftonline.com/{tenant_id}/oauth2/v2.0/token'
        data = {'grant_type': 'client_credentials', 'scope': 'https://graph.microsoft.com/.default',
                'client_id': client_id, 'client_secret': client_secret}
        access_token = requests.post(login_url, data=data).json()['access_token']
        msrcomms_id = settings.MSRCOMMS_ID
        program_project_list_id = settings.PROGRAM_PROJECT_LIST_ID
        sharepoint_url = f'https://graph.microsoft.com/v1.0/sites/{msrcomms_id}/lists/{program_project_list_id}/items'
        params = {'expand': 'columns', 'Accept': 'application/json;odata=verbose',
                  'Content_Type': 'application/json;odata=verbose'}
        headers = {'Authorization': 'Bearer {}'.format(access_token)}
        response = requests.get(sharepoint_url, headers=headers, params=params)
        json_response = response.json()

        # Sending program data stored in the  'value' field from JSON response to workflow/program.py
        # to be validated and updated or created if valid and execute flag is set.
        idaa_programs = json_response['value']
        for program in idaa_programs:
            upload_program = ProgramUpload(program['fields'])
            if upload_program.is_valid():
                if options['upload']:
                    upload_program.upload()
            if self.report_date() or options['create_discrepancies']:
                upload_program.create_discrepancies()

        if self.report_date() or options['create_report']:
            report = GenerateDiscrepancyReport()
            report.generate()
            # TODO trigger email?


    @staticmethod
    def report_date():
        today = date.today()
        report_day = False
        if today.day == (1 or 15):
            report_day = True
        return report_day
