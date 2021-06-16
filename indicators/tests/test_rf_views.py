

from django import test
from django.urls import reverse
from django.test import client
from indicators.models import LevelTierTemplate
from factories.workflow_models import (
    RFProgramFactory,
    TolaUserFactory,
    grant_program_access,
)

class TestSaveCustomTemplateView(test.TestCase):
    @classmethod
    def setUpClass(cls):
        super(TestSaveCustomTemplateView, cls).setUpClass()
        cls.program = RFProgramFactory()
        cls.tola_user = TolaUserFactory()
        grant_program_access(cls.tola_user, cls.program, cls.tola_user.country, 'high')
        cls.client = client.Client()


    def test_view_respects_permissions(self):
        no_permission_user = TolaUserFactory()
        no_permission_client = client.Client()
        no_permission_client.force_login(no_permission_user)
        response = no_permission_client.post(
            reverse('save_custom_template'), {'program_id': self.program.id, 'tiers': ['this', 'that']})
        self.assertEqual(response.status_code, 403)

    def test_template_saved(self):
        self.client.force_login(self.tola_user.user)
        self.client.post(
            reverse('save_custom_template'),
            {'program_id': self.program.id, 'tiers': ['this ', ' tha t ']},
            content_type="application/json")

        # Note that the extra white space on either side of the tier should be trimmed before saving.
        self.assertEqual(LevelTierTemplate.objects.get(program=self.program).names, ['this', 'tha t'])

    def test_illegal_chars(self):
        self.client.force_login(self.tola_user.user)
        response = self.client.post(
            reverse('save_custom_template'),
            {'program_id': self.program.id, 'tiers': ['this, ', ' that']},
            content_type="application/json")

        # Note that the extra white space on either side of the tier should be trimmed before saving.
        self.assertEqual(response.status_code, 400)



