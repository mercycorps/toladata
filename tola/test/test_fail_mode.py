from django import test
from django.urls import reverse
from django.conf import settings
from factories.workflow_models import TolaUserFactory, RFProgramFactory
from factories.indicators_models import RFIndicatorFactory

# make allowed hosts a little closer to prod so we can test in different environments
ALLOWED_HOSTS = [
    "localhost",
    "www.mercycorps.org",
    "tola-activity.mercycorps.org",
    "127.0.0.1",
    "tola-activity-qa.mercyrops.org"
]

@test.override_settings(ALLOWED_HOSTS=ALLOWED_HOSTS, DEBUG=True)
class TestFailModeToggle(test.TestCase):
    def test_user_does_not_initially_have_fail_mode_set(self):
        user = TolaUserFactory(mc_staff=True, superadmin=True, password='secret')
        self.client.login(username=user.user.username, password='secret')
        self.assertFalse(self.client.session.get('fail_mode'))
        self.client.logout()

    def test_user_can_set_fail_mode(self):
        user = TolaUserFactory(mc_staff=True, superadmin=True, password='secret')
        self.client.login(username=user.user.username, password='secret')
        response = self.client.get(reverse('fail_mode_toggle'), HTTP_HOST='127.0.0.1:8080')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['success'])
        self.assertTrue(self.client.session['fail_mode'])
        self.client.logout()

    def test_user_can_unset_fail_mode(self):
        user = TolaUserFactory(mc_staff=True, superadmin=True, password='secret')
        self.client.login(username=user.user.username, password='secret')
        response = self.client.get(reverse('fail_mode_toggle'), HTTP_HOST='127.0.0.1:8080')
        self.assertTrue(response.json()['success'])
        self.assertTrue(self.client.session['fail_mode'])
        response = self.client.get(reverse('fail_mode_toggle'), HTTP_HOST='127.0.0.1:8080')
        self.assertTrue(response.json()['success'])
        self.assertFalse(self.client.session.get('fail_mode'))
        self.client.logout()

    def test_fail_mode_resets_on_logout(self):
        user = TolaUserFactory(mc_staff=True, superadmin=True, password='secret')
        self.client.login(username=user.user.username, password='secret')
        response = self.client.get(reverse('fail_mode_toggle'), HTTP_HOST='127.0.0.1:8080')
        self.assertTrue(response.json()['success'])
        self.client.logout()
        self.client.login(username=user.user.username, password='secret')
        self.assertFalse(self.client.session.get('fail_mode'))
        self.client.logout()

    def test_fail_mode_does_not_set_on_production(self):
        user = TolaUserFactory(mc_staff=True, superadmin=True, password='secret')
        self.client.login(username=user.user.username, password='secret')
        response = self.client.get(reverse('fail_mode_toggle'), HTTP_HOST='tola-activity.mercycorps.org')
        self.assertFalse(response.json()['success'])
        self.assertFalse(self.client.session.get('fail_mode'))
        self.client.logout()

    def test_fail_mode_does_not_set_on_non_superadmin_on_production(self):
        user = TolaUserFactory(mc_staff=True, superadmin=False, password='secret')
        self.client.login(username=user.user.username, password='secret')
        response = self.client.get(reverse('fail_mode_toggle'), HTTP_HOST='tola-activity.mercycorps.org')
        self.assertFalse(response.json()['success'])
        self.assertFalse(self.client.session.get('fail_mode'))

    def test_fail_mode_does_not_set_on_non_superadmin_anywhere(self):
        user = TolaUserFactory(mc_staff=True, superadmin=False, password='secret')
        self.client.login(username=user.user.username, password='secret')
        response = self.client.get(reverse('fail_mode_toggle'), HTTP_HOST='127.0.0.1:8080')
        self.assertFalse(response.json()['success'])
        self.assertFalse(self.client.session.get('fail_mode'))

    def test_ajax_views_fail_with_fail_mode_set(self):
        program = RFProgramFactory()
        indicator = RFIndicatorFactory(program=program, targets=True)
        user = TolaUserFactory(mc_staff=True, superadmin=True, password='secret')
        self.client.login(username=user.user.username, password='secret')
        response = self.client.get(reverse('fail_mode_toggle'), HTTP_HOST='127.0.0.1:8080')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['success'])
        self.assertTrue(self.client.session['fail_mode'])
        # user history is a sample API - this is middleware implemented, so it should only verify the request type
        # a request accepting "json" is assumed to be an API call:
        response = self.client.get(f"/api/tola_management/user/{user.pk}/history/",
                                   HTTP_HOST="127.0.0.1:8080", HTTP_ACCEPT="application/json")
        self.assertEqual(response.status_code, 500)
        # a request using ajax headers is assumed to be ajax:
        response = self.client.get(f"/indicators/indicator_update/{indicator.pk}/", HTTP_HOST="127.0.0.1:8080",
                                   HTTP_X_REQUESTED_WITH='XMLHttpRequest')
        self.assertEqual(response.status_code, 500)
        # toggle fail mode back off:
        response = self.client.get(reverse('fail_mode_toggle'), HTTP_HOST='127.0.0.1:8080')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['success'])
        self.assertFalse(self.client.session['fail_mode'])
        response = self.client.get(f"/api/tola_management/user/{user.pk}/history/",
                                   HTTP_HOST="127.0.0.1:8080", HTTP_ACCEPT="application/json")
        self.assertEqual(response.status_code, 200)
        response = self.client.get(f"/indicators/indicator_update/{indicator.pk}/", HTTP_HOST="127.0.0.1:8080",
                                   HTTP_X_REQUESTED_WITH='XMLHttpRequest')
        self.assertEqual(response.status_code, 200)

