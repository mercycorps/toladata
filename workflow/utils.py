import requests
from django.conf import settings
import logging


logger = logging.getLogger(__name__)


class AccessMSR:

    def get_MSR_list(self, list_id):
        tenant_id = settings.MS_TENANT_ID
        client_id = settings.MS_TOLADATA_CLIENT_ID
        client_secret = settings.MS_TOLADATA_CLIENT_SECRET
        login_url = f'https://login.microsoftonline.com/{tenant_id}/oauth2/v2.0/token'
        data = {'grant_type': 'client_credentials', 'scope': 'https://graph.microsoft.com/.default',
                'client_id': client_id, 'client_secret': client_secret}
        access_token = requests.post(login_url, data=data).json()['access_token']
        msrcomms_id = settings.MSRCOMMS_ID
        base_url = f'https://graph.microsoft.com/v1.0/sites/{msrcomms_id}/lists/'
        sharepoint_url = base_url + f'{list_id}/items'
        params = {'expand': 'columns', 'Accept': 'application/json;odata=verbose',
                  'Content_Type': 'application/json;odata=verbose'}
        headers = {'Authorization': 'Bearer {}'.format(access_token)}
        response = requests.get(sharepoint_url, headers=headers, params=params)
        json_data = response.json()['value']
        next_url = response.json()['@odata.nextLink']
        while next_url:
            response = requests.get(next_url, headers=headers, params=params)
            json_data += response.json()['value']
            next_url = response.json()['@odata.nextLink'] if '@odata.nextLink' in response.json() else None
        return json_data

    def gaitid_list(self):
        gaitid_list_id = settings.GAITID_LIST_ID
        values = self.get_MSR_list(gaitid_list_id)
        return values

    def countrycode_list(self):
        cc_list_id = settings.COUNTRYCODES_LIST_ID
        values = self.get_MSR_list(cc_list_id)
        return values

    def program_project_list(self):
        program_project_list_id = settings.PROGRAM_PROJECT_LIST_ID
        values = self.get_MSR_list(program_project_list_id)
        return values


def check_IDAA_duplicates(idaa_programs):
    """
    Loops through all idaa programs.
    Checks if the gaitid for each program is a duplicate.
    There are two type of duplicates that are being checked against. Overall duplicates and duplicates for report.
    The overall duplicates are checking regardless of program status and generates a sharepoint list url that gets added to the logger.
    The duplicates for report are checking only programs with the status of Funded or Concluded

    Returns:
        A set of duplicated gaitids for the report
    """
    base_url = "https://mercycorpsemea.sharepoint.com/sites/MSRCommsSite/Lists/ProgramProjectID/AllItems.aspx?FilterFields1=GaitIDs&FilterTypes1=LookupMulti&FilterValues1="
    checked_gaitids = set()
    duplicated_gaitids = set()
    gaitid_filter_values = set()
    checked_for_report = set()
    duplicates_for_report = set()

    for idaa_program in idaa_programs:
        idaa_fields = idaa_program['fields']
        program_status = idaa_fields.get('ProgramStatus', None)
        gaitids = [gaitid['LookupValue'] for gaitid in idaa_fields['GaitIDs']]

        for gaitid in gaitids:
            if program_status in ['Funded', 'Concluded']:
                if gaitid in checked_for_report:
                    duplicates_for_report.add(gaitid)
                else:
                    checked_for_report.add(gaitid)

            if gaitid in checked_gaitids:
                duplicated_gaitids.add(gaitid)
                gaitid = gaitid.replace('.', '%2E')
                gaitid_filter_values.add(gaitid)
            else:
                checked_gaitids.add(gaitid)

    if len(duplicated_gaitids):
        filter_values = "%3B%23".join(gaitid_filter_values)
        logger.exception(f"Found {len(duplicated_gaitids)} duplicated gaitids\nSharePoint URL for duplicated GaitIDs: {base_url + filter_values}")

    return duplicates_for_report
