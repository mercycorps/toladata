from django import test
from factories.indicators_models import RFIndicatorFactory
from factories.workflow_models import (
    CountryFactory,
    RFProgramFactory,
    OrganizationFactory,
    TolaUserFactory,
    grant_program_access,
    grant_country_access,
)
from factories.django_models import UserFactory
from indicators.models import Indicator
from workflow.serializers_new import IPTTQSProgramSerializer
from workflow.models import Program, Organization

QUICKSTART_QUERY_COUNTS = 1

class TestIPTTQSProgramSerializer(test.TestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        if Organization.objects.filter(pk=1).count() == 1:
            mc_organization = Organization.objects.get(pk=1)
        else:
            mc_organization = OrganizationFactory(pk=1, name="Mercy Corps")
        cls.in_country = CountryFactory(code="IN", country="In Country")
        cls.in_country2 = CountryFactory(code="IN2", country="In Country 2")
        cls.out_country = CountryFactory(code="OUT", country="Out Country")
        cls.superuser = UserFactory(is_superuser=True, username="Super_User!")
        superuser_tola_user = TolaUserFactory(
            user=cls.superuser, country=cls.in_country, organization=mc_organization
        )
        cls.mc_user_admin = UserFactory(username="mc_user_admin")
        mc_tola_user_admin = TolaUserFactory(
            user=cls.mc_user_admin, country=cls.in_country, organization=mc_organization
        )
        grant_country_access(mc_tola_user_admin, cls.in_country, role='basic_admin')
        grant_country_access(mc_tola_user_admin, cls.in_country2, role='user')
        partner_organization = OrganizationFactory(name="Partner org")
        cls.partner_user = UserFactory(username="partner_user")
        partner_tola_user = TolaUserFactory(
            user=cls.partner_user, country=cls.in_country, organization=partner_organization
        )

    def generate_program_with_indicators(self, **kwargs):
        frequencies = kwargs.pop('frequencies', [Indicator.ANNUAL])
        override_indicator_kwargs = kwargs.pop('indicators', {})
        country = kwargs.pop('country', self.in_country)
        program_kwargs = {
            'funding_status': "Funded",
            **kwargs
        }
        program = RFProgramFactory(**program_kwargs)
        program.country.set([country])
        for frequency in frequencies:
            indicator_kwargs = {
                'program': program, 'target_frequency': frequency, 'targets': 1000, 'results': True,
                **override_indicator_kwargs
            }
            RFIndicatorFactory(**indicator_kwargs)
        return program

    def get_serialized_data(self, pks):
        with self.assertNumQueries(QUICKSTART_QUERY_COUNTS):
            return IPTTQSProgramSerializer.load_for_pks(pks).data

    def get_serialized_data_for_user(self, user):
        with self.assertNumQueries(QUICKSTART_QUERY_COUNTS):
            return IPTTQSProgramSerializer.load_for_user(user).data


    def test_frequencies(self):
        p1 = RFProgramFactory()
        RFIndicatorFactory(program=p1, target_frequency=Indicator.LOP, targets=200)
        p2 = RFProgramFactory()
        RFIndicatorFactory(program=p2, target_frequency=Indicator.ANNUAL, targets=1000)
        data = self.get_serialized_data([p1.pk, p2.pk])
        self.assertEqual(len(data), 2)
        data1 = [d for d in data if d['pk'] == p1.pk][0]
        self.assertEqual(data1['frequencies'], [1])
        data2 = [d for d in data if d['pk'] == p2.pk][0]
        self.assertEqual(data2['frequencies'], [3])

    def test_period_date_ranges(self):
        p = RFProgramFactory(closed=False, months=12, age=4) # 4+months ago
        RFIndicatorFactory(program=p, target_frequency=Indicator.LOP, targets=200)
        data = self.get_serialized_data([p.pk])[0]
        self.assertEqual(data['pk'], p.pk)
        for frequency, count in [(3, 1), (4, 2), (5, 3), (6, 4), (7, 12)]:
            self.assertEqual(len(data['period_date_ranges'][frequency]), count)
        self.assertEqual(len([f for f in data['period_date_ranges'][7] if f['past']]), 5)

    def test_one_program(self):
        p = RFProgramFactory()
        RFIndicatorFactory(program=p, target_frequency=Indicator.LOP, targets=500)
        RFIndicatorFactory(program=p, target_frequency=Indicator.ANNUAL, targets=200)
        data = self.get_serialized_data([p.pk])[0]
        self.assertEqual(data['frequencies'], [1, 3])

    def test_multiple_programs(self):
        p = RFProgramFactory(migrated=False)
        RFIndicatorFactory(program=p, target_frequency=Indicator.LOP, targets=500)
        RFIndicatorFactory(program=p, target_frequency=Indicator.ANNUAL, targets=200)
        p2 = RFProgramFactory(migrated=True, tiers=True, levels=1)
        RFIndicatorFactory(program=p2, target_frequency=Indicator.SEMI_ANNUAL, targets=5000)
        RFIndicatorFactory(program=p2, target_frequency=Indicator.ANNUAL, targets=200)
        p3 = RFProgramFactory(tiers=['Tier1', 'Tier2'], levels=2)
        for level in p3.levels.all():
            RFIndicatorFactory(program=p3, target_frequency=Indicator.MONTHLY, targets=5000, level=level)
        data = {d['pk']: d for d in self.get_serialized_data([p.pk, p2.pk, p3.pk])}
        self.assertEqual(data[p.pk]['frequencies'], [1, 3])
        self.assertEqual(data[p2.pk]['frequencies'], [3, 4])
        self.assertEqual(data[p3.pk]['frequencies'], [7])

    def test_user_programs_correct(self):
        program_in_country = self.generate_program_with_indicators(country=self.in_country)
        program_in_country2 = self.generate_program_with_indicators(country=self.in_country2)
        program_out_country = self.generate_program_with_indicators(country=self.out_country)
        program_no_targets = self.generate_program_with_indicators(indicators={'targets': False})
        program_deleted = self.generate_program_with_indicators(country=self.in_country)
        program_deleted.delete()
        program_completed = self.generate_program_with_indicators(funding_status="Completed", country=self.in_country)
        grant_program_access(
            self.partner_user.tola_user, program_in_country2, self.in_country2
        )
        grant_program_access(
            self.partner_user.tola_user, program_out_country, self.out_country
        )
        data = self.get_serialized_data_for_user(self.superuser)
        self.assertCountEqual(
            [d['pk'] for d in data],
            [program_in_country.pk, program_in_country2.pk, program_out_country.pk]
        )
        del data
        data = self.get_serialized_data_for_user(self.mc_user_admin)
        self.assertCountEqual([d['pk'] for d in data], [program_in_country.pk, program_in_country2.pk])
        del data
        data = self.get_serialized_data_for_user(self.mc_user_admin)
        self.assertCountEqual([d['pk'] for d in data], [program_in_country.pk, program_in_country2.pk])
        del data
        data = self.get_serialized_data_for_user(self.partner_user)
        self.assertCountEqual([d['pk'] for d in data], [program_in_country2.pk, program_out_country.pk])