import requests
from django.conf import settings


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
