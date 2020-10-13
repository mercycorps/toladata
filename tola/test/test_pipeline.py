from unittest import mock
from django.test import TestCase

from factories.workflow_models import CountryFactory, OrganizationFactory, NewTolaUserFactory
from tola_management.models import UserManagementAuditLog as UM
from workflow.models import TolaUser

from tola.pipeline import create_user_okta


SPECIAL_CHARS = "ßpécîäl_chars"

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

    def test_updates_audit_log_appropriately(self):
        banana_country = CountryFactory(country="BananaTown", code="BT")
        cat_country = CountryFactory(country="CatLand", code="XT")
        tola_user = NewTolaUserFactory(country=self.country)
        count = UM.objects.count()
        # doesn't update audit log with no changes:
        with mock.patch('tola.pipeline.logger') as log_mock:
            okta_response = {
                'attributes': {
                    'email': [tola_user.user.email, 0],
                    'firstName': [tola_user.user.first_name, 0],
                    'lastName': [tola_user.user.last_name, 0],
                    'mcCountryCode': [self.country.code, 0],
                },
                'idp_name': 'okta',
            }
            user = None
            okta_result = create_user_okta(self.backend, self.details, user, okta_response)
            self.assertIsNone(okta_result)
            tu_reload = TolaUser.objects.get(pk=tola_user.pk)
            self.assertEqual(tu_reload.country, self.country)
            self.assertEqual(count, UM.objects.count(), "No audit log required")
        del tu_reload
        count = UM.objects.count()
        # does update audit log with country change:
        with mock.patch('tola.pipeline.logger') as log_mock:
            okta_response = {
                'attributes': {
                    'email': [tola_user.user.email, 0],
                    'firstName': [tola_user.user.first_name, 0],
                    'lastName': [tola_user.user.last_name, 0],
                    'mcCountryCode': ["BT", 0],
                },
                'idp_name': 'okta',
            }
            user = None
            okta_result = create_user_okta(self.backend, self.details, user, okta_response)
            self.assertIsNone(okta_result)
            tu_reload = TolaUser.objects.get(pk=tola_user.pk)
            self.assertEqual(tu_reload.country, banana_country)
            self.assertEqual(UM.objects.count(), count + 1, "Permissions audit log required")
            um = UM.objects.order_by('-pk').first()
            self.assertEqual(um.change_type, "user_programs_updated")
            self.assertTrue(um.system_generated_update)
            self.assertEqual(len(um.diff_list['programs']), 0)
            self.assertEqual(len(um.diff_list['countries']), 2)
            new_country = [x for x in um.diff_list['countries'] if x['name'] == str(banana_country.pk)][0]
            old_country = [x for x in um.diff_list['countries'] if x['name'] == str(self.country.pk)][0]
            self.assertEqual(new_country['prev']['country'], None)
            self.assertEqual(old_country['new']['country'], None)
            self.assertEqual(um.diff_list['base_country']['new'], "BananaTown")
            self.assertEqual(um.diff_list['base_country']['prev'], self.country.country)
        del tu_reload
        count = UM.objects.count()
        # does update audit log with name change:
        with mock.patch('tola.pipeline.logger') as log_mock:
            okta_response = {
                'attributes': {
                    'email': [tola_user.user.email, 0],
                    'firstName': ["NewFirstName", 0],
                    'lastName': [tola_user.user.last_name, 0],
                    'mcCountryCode': ["BT", 0],
                },
                'idp_name': 'okta',
            }
            user = None
            okta_result = create_user_okta(self.backend, self.details, user, okta_response)
            self.assertIsNone(okta_result)
            tu_reload = TolaUser.objects.get(pk=tola_user.pk)
            self.assertEqual(tu_reload.country, banana_country)
            self.assertEqual(tu_reload.user.first_name, "NewFirstName")
            self.assertEqual(tu_reload.user.last_name, tola_user.user.last_name)
            self.assertEqual(tu_reload.name, f"NewFirstName {tola_user.user.last_name}")
            self.assertEqual(UM.objects.count(), count + 1, "Profile audit log required")
            um = UM.objects.order_by('-pk').first()
            self.assertEqual(um.change_type, "user_profile_updated")
            self.assertTrue(um.system_generated_update)
            self.assertEqual(len(um.diff_list), 1)
            self.assertEqual(um.diff_list[0]['name'], 'first_name')
            self.assertEqual(um.diff_list[0]['new'], 'NewFirstName')
        del tu_reload
        count = UM.objects.count()
        with mock.patch('tola.pipeline.logger') as log_mock:
            okta_response = {
                'attributes': {
                    'email': [tola_user.user.email, 0],
                    'firstName': ["NewFirstName", 0],
                    'lastName': ["NewLastName", 0],
                    'mcCountryCode': ["XT", 0],
                },
                'idp_name': 'okta',
            }
            user = None
            okta_result = create_user_okta(self.backend, self.details, user, okta_response)
            self.assertIsNone(okta_result)
            tu_reload = TolaUser.objects.get(pk=tola_user.pk)
            self.assertEqual(tu_reload.country, cat_country)
            self.assertEqual(tu_reload.user.first_name, "NewFirstName")
            self.assertEqual(tu_reload.user.last_name, "NewLastName")
            self.assertEqual(tu_reload.name, f"NewFirstName NewLastName")
            self.assertEqual(UM.objects.count(), count + 2, "Profile and Permissions audit log required")
            um = UM.objects.order_by('-pk')[0]
            um2 = UM.objects.order_by('-pk')[1]
            self.assertEqual(um.change_type, "user_programs_updated")
            self.assertTrue(um.system_generated_update)
            self.assertEqual(um2.change_type, "user_profile_updated")
            self.assertTrue(um2.system_generated_update)
        del tu_reload
        count = UM.objects.count()
        with mock.patch('tola.pipeline.logger') as log_mock:
            okta_response = {
                'attributes': {
                    'email': ["newemail@example.com", 0],
                    'firstName': [SPECIAL_CHARS, 0],
                    'lastName': ["LastName", 0],
                    'mcCountryCode': ["BT", 0],
                },
                'idp_name': 'okta',
            }
            user = None
            okta_result = create_user_okta(self.backend, self.details, user, okta_response)
            self.assertIsNone(okta_result)
            tu_reload = TolaUser.objects.get(user__email="newemail@example.com")
            self.assertEqual(tu_reload.country, banana_country)
            self.assertEqual(tu_reload.user.first_name, SPECIAL_CHARS)
            self.assertEqual(tu_reload.user.last_name, "LastName")
            self.assertEqual(tu_reload.name, f"{SPECIAL_CHARS} LastName")
            self.assertEqual(UM.objects.count(), count + 2, "Profile and Permissions audit log required")
            um = UM.objects.order_by('-pk')[0]
            um2 = UM.objects.order_by('-pk')[1]
            self.assertEqual(um.change_type, "user_programs_updated")
            self.assertTrue(um.system_generated_update)
            self.assertEqual(um2.change_type, "user_created")
            self.assertTrue(um2.system_generated_update)
        del tu_reload
        count = UM.objects.count()
            
