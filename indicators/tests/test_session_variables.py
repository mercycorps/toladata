import json
from django import test
from factories.django_models import UserFactory
from factories.workflow_models import TolaUserFactory

ENGLISH = 1
FRENCH = 2
SPANISH = 3

COVID_BANNER_TITLE = {
    ENGLISH: "Remote MERL guidance (PDF)",
    FRENCH: "Remote MERL guidance (PDF)",
    SPANISH: "Remote MERL guidance (PDF)",
}

COVID_BANNER_LINK = {
    ENGLISH: "https://library.mercycorps.org/record/32352/files/COVID19RemoteMERL.pdf",
    FRENCH: "https://library.mercycorps.org/record/32636/files/COVID19RemoteMERLfr.pdf",
    SPANISH: "https://library.mercycorps.org/record/32635/files/COVID19RemoteMERLes.pdf",
}

COVID_WEBINAR_TITLE = {
    ENGLISH: "Recorded webinar",
    FRENCH: "Recorded webinar",
    SPANISH: "Recorded webinar",
}

COVID_WEBINAR_LINK = {
    ENGLISH: "https://drive.google.com/file/d/1x24sddNU1uY851-JW-6f43K4TRS2B96J/view",
    FRENCH: "https://drive.google.com/file/d/1x24sddNU1uY851-JW-6f43K4TRS2B96J/view",
    SPANISH: "https://drive.google.com/file/d/1x24sddNU1uY851-JW-6f43K4TRS2B96J/view"
}

COVID_BANNER_CONTENTS = (COVID_BANNER_TITLE, COVID_BANNER_LINK, COVID_WEBINAR_TITLE, COVID_WEBINAR_LINK)



class TestSessionVariables(test.TestCase):

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        user = UserFactory(username="test_user_session_vars")
        user.set_password("12345")
        user.save()
        cls.tola_user = TolaUserFactory(user=user)

    def test_covid_session_variable_login_logout(self):
        self.client.logout()
        bare_login = self.client.get('/accounts/login/')
        # getting login page should not set session variable:
        self.assertFalse(self.client.session.get('show_covid_banner', False))
        # login should work
        self.assertTrue(self.client.login(username='test_user_session_vars', password='12345'))
        # login should set session variable
        self.assertTrue(self.client.session.get('show_covid_banner', False))
        self.client.logout()
        # logout should remove session variable
        self.assertFalse(self.client.session.get('show_covid_banner', False))

    def test_covid_session_variable_session_var_update(self):
        self.client.login(username='test_user_session_vars', password='12345')
        self.assertTrue(self.client.session.get('show_covid_banner', False))
        # put should succeed to update_user_session
        response = self.client.put(
            '/update_user_session/',
            json.dumps({'show_covid_banner': False}),
            HTTP_X_REQUESTED_WITH='XMLHttpRequest'
        )
        self.assertEqual(response.status_code, 202)
        # after put session var should be false:
        self.assertFalse(self.client.session.get('show_covid_banner', False))
        self.client.logout()
        # successive login should set it to true again:
        self.client.login(username='test_user_session_vars', password='12345')
        self.assertTrue(self.client.session.get('show_covid_banner', False))
        self.client.logout()

    def test_covid_banner_shows_and_disappears(self):
        self.client.logout()
        login_response = self.client.get('/', follow=True)
        for text in COVID_BANNER_CONTENTS:
            self.assertNotContains(login_response, text[ENGLISH], status_code=200)
        self.assertTrue(self.client.login(username='test_user_session_vars', password='12345'))
        response = self.client.get('/')
        for text in COVID_BANNER_CONTENTS:
            self.assertContains(response, text[ENGLISH], count=1, status_code=200)
        self.client.put(
            '/update_user_session/',
            json.dumps({'show_covid_banner': False}),
            HTTP_X_REQUESTED_WITH='XMLHttpRequest'
        )
        after_put_response = self.client.get('/')
        for text in COVID_BANNER_CONTENTS:
            self.assertNotContains(after_put_response, text[ENGLISH], status_code=200)
        self.client.logout()

    def test_covid_banner_links_in_correct_language(self):
        self.client.logout()
        self.tola_user.language = 'fr'
        self.tola_user.save()
        self.client.login(username='test_user_session_vars', password='12345')
        response = self.client.get('/')
        for text in COVID_BANNER_CONTENTS:
            self.assertContains(response, text[FRENCH], count=1, status_code=200)
        self.client.logout()
        self.tola_user.language = 'es'
        self.tola_user.save()
        self.client.login(username='test_user_session_vars', password='12345')
        response = self.client.get('/')
        for text in COVID_BANNER_CONTENTS:
            self.assertContains(response, text[SPANISH], count=1, status_code=200)
        self.client.logout()