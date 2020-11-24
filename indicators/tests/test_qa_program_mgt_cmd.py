
import uuid
from django import test
from django.core import management
from django.urls import reverse
from factories.indicators_models import (
    DisaggregationTypeFactory,
    IndicatorTypeFactory
)
from factories.workflow_models import OrganizationFactory, TolaUserFactory, SectorFactory, CountryFactory
from workflow.models import Program, Country, ProgramAccess, TolaUser


@test.tag('slow')
class TestQAScript(test.TestCase):

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        CountryFactory.reset_sequence()
        OrganizationFactory(pk=1, name="Mercy Corps")
        DisaggregationTypeFactory(pk=109, disaggregation_type="Sex and Age Disaggregated Data (SADD)")
        cls.indicator_type = IndicatorTypeFactory()
        SectorFactory.create_batch(size=5)
        management.call_command('create_qa_programs', names='test_program', named_only=True)
        cls.program = Program.objects.filter(name__contains="QA program")[0]
        cls.tolaland = Country.objects.get(country="Tolaland")
        cls.tola_user = TolaUserFactory(country=cls.tolaland)
        cls.tola_user.user.is_superuser = True
        cls.tola_user.user.save()
        cls.required_indicator_keys = [
            'name', 'program_id', 'target_frequency', 'level', 'indicator_type', 'unit_of_measure_type',
            'unit_of_measure', 'lop_target', 'direction_of_change', 'periodic_targets', 'rationale', 'indicator_key']

    def setUp(self):
        self.client.force_login(user=self.tola_user.user)

    def test_null_values(self):
        qa_indicator = self.program.indicator_set.first()
        qa_data = {k: qa_indicator.__dict__[k] for k in qa_indicator.__dict__ if k in self.required_indicator_keys}
        qa_data['indicator_key'] = str(uuid.uuid4())
        qa_data['level'] = qa_indicator.level.id
        qa_data['baseline'] = 0
        qa_data['baseline_na'] = False
        qa_data['is_cumulative'] = False

        url = reverse('indicator_update', args=[qa_indicator.id])
        response = self.client.post(url, qa_data)
        self.assertEqual(
            response.status_code, 200, "should be able to submit the same data on a QA indicator successfully")
        qa_data['responsible_person'] = "I blame you"
        response = self.client.post(url, qa_data)
        self.assertEqual(
            response.status_code, 200, "should be able to submit a non-tracked field on a QA indicator successfully")

    def test_permissions(self):
        CountryFactory(country="United States", code="US")
        # One of the test users has this as their home country
        CountryFactory(country="Ethiopia", code="ET")
        management.call_command('create_qa_programs', names='test_permissions')
        mc_high = TolaUser.objects.get(user__username='mc-high')
        mc_high_access = ProgramAccess.objects.get(
            country=self.tolaland, program=self.program, tolauser=mc_high)
        self.assertEqual(mc_high_access.role, 'high', 'mc-high should have high permission on all Tolaland programs')




