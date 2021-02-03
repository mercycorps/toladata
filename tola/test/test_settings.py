from django import test
from django.core import mail
from factories.workflow_models import TolaUserFactory
from workflow.models import Program


class TestLogging(test.TestCase):
    def test_error_triggers_email(self):
        tola_user = TolaUserFactory(password='password')
        self.client.login(username=tola_user.user.username, password='password')
        self.client.get('/')
        self.assertEqual(len(mail.outbox), 0)
        with self.assertRaises(Program.DoesNotExist):
            self.client.get('/api/indicator_list/88888888888888888/')
        self.assertEqual(len(mail.outbox), 1)

        with self.settings(DEBUG=True):
            with self.assertRaises(Program.DoesNotExist):
                self.client.get('/api/indicator_list/88888888888888888/')
            self.assertEqual(len(mail.outbox), 1)
