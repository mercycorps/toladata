from unittest import mock
from django.test import TestCase

from factories.workflow_models import CountryFactory, OrganizationFactory

from tola.pipeline import create_user_okta

class MockBackend(object):
    def __init__(self, backend_name):
        self.name = backend_name


class ImportIndicatorTests(TestCase):

    def setUp(self):
        self.country = CountryFactory()
        self.backend = MockBackend('saml')
        self.details = None
        self.organization = OrganizationFactory(id=1)

    def test_good_login(self):
        with mock.patch('tola.pipeline.logger') as log_mock:
            okta_response = {
                'attributes': {
                    'email': ['test@example.com', 0], 'firstName': ['Pat', 0], 'lastName': ['Smith', 0],
                    'mcCountryCode': ['AF', 0],
                },
                'idp_name': 'okta',
            }
            user = None

            okta_result = create_user_okta(self.backend, self.details, user, okta_response)
            self.assertEqual(okta_result, None)

            okta_response = {
                'attributes': {
                    'email': ['test@example.com', 0], 'firstName': [None, 0], 'lastName': [None, 0],
                    'mcCountryCode': ['AF', 0],
                },
                'idp_name': 'okta',
            }
            okta_result = create_user_okta(self.backend, self.details, user, okta_response)
            self.assertEqual(okta_result, None)

    def test_bad_country(self):
        # Test a country that doesn't exist - UPDATE: does not redirect because bad countries are ok
        with mock.patch('tola.pipeline.logger') as log_mock:
            okta_response = {
                'attributes': {
                    'email': ['test@example.com', 0], 'firstName': ['Pat', 0], 'lastName': ['Smith', 0],
                    'mcCountryCode': ['ZZ', 0],
                },
                'idp_name': 'okta',
            }
            user = None
            okta_result = create_user_okta(self.backend, self.details, user, okta_response)
            # self.assertEqual(okta_result.status_code, 302)
            self.assertIsNone(okta_result)

            # Test no country for old men
            okta_response = {
                'attributes': {
                    'email': ['test@example.com', 0], 'firstName': ['Pat', 0], 'lastName': ['Smith', 0],
                    'mcCountryCode': [None, 0],
                },
                'idp_name': 'okta',
            }
            user = None
            okta_result = create_user_okta(self.backend, self.details, user, okta_response)
            # UPDATE: does not redirect because no countries are ok
            # self.assertEqual(okta_result.status_code, 302)
            self.assertIsNone(okta_result)

    def test_bad_names(self):
        # First test a new user but with no names comeing from Okta
        with mock.patch('tola.pipeline.logger') as log_mock:
            okta_response = {
                'attributes': {
                    'email': ['test@example.com', 0], 'firstName': [None, 0], 'lastName': [None, 0],
                    'mcCountryCode': ['AF', 0],
                },
                'idp_name': 'okta',
            }
            user = None
            okta_result = create_user_okta(self.backend, self.details, user, okta_response)
            self.assertEqual(okta_result.status_code, 302, msg="Failed to error on blank name")

            # First create user and tola_user
            okta_response = {
                'attributes': {
                    'email': ['test@example.com', 0], 'firstName': ['Pat', 0], 'lastName': ['Smith', 0],
                    'mcCountryCode': ['AF', 0],
                },
                'idp_name': 'okta',
            }
            user = None
            okta_result = create_user_okta(self.backend, self.details, user, okta_response)
            self.assertEqual(okta_result, None, msg="Failed to pass on normal name")

            # Now simulate lack of names
            okta_response = {
                'attributes': {
                    'email': ['test@example.com', 0], 'firstName': [None, 0], 'lastName': [None, 0],
                    'mcCountryCode': ['AF', 0],
                },
                'idp_name': 'okta',
            }
            okta_result = create_user_okta(self.backend, self.details, user, okta_response)
            self.assertEqual(okta_result, None, msg="Failed to pass on blank name with good name in DB")

            # It should work even when the names are very long.
            okta_response = {
                'attributes': {
                    'email': ['test@example.com', 0], 'firstName': ['abcdefabcdefabcdefabcdefabcdefabcdefabcdefab', 0],
                    'lastName': ['abcdefabcdefabcdefabcdefabcdefabcdefabcdefab', 0],
                    'mcCountryCode': ['AF', 0],
                },
                'idp_name': 'okta',
            }
            okta_result = create_user_okta(self.backend, self.details, user, okta_response)
            self.assertEqual(okta_result, None, msg="Failed to pass on long name")
