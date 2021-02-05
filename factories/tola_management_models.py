import string
import itertools
import json
import datetime
from factory.django import DjangoModelFactory
from factory import (
    lazy_attribute, LazyAttribute, SelfAttribute, SubFactory, Faker, Maybe, PostGeneration, post_generation,
    Sequence, RelatedFactory, Trait, lazy_attribute_sequence, fuzzy
)
from factories.django_models import UserFactory, UserOnlyFactory
from factories.workflow_models import TolaUserFactory, CountryFactory
from factories.indicators_models import DisaggregationTypeFactory, DisaggregationLabelFactory
from tola_management.models import CountryAdminAuditLog
from workflow.models import (
    Country, Organization, ProfileType, Sector, SiteProfile, TolaUser, Program, CountryAccess, ProgramAccess,
    PROGRAM_ROLE_CHOICES, COUNTRY_ROLE_CHOICES
)

def generate_mc_levels(obj, create, extracted, **kwargs):
    from factories.indicators_models import LevelTierFactory
    LevelTierFactory.build_mc_template(program=obj)


def custom_level_generator(tier_set):
    def generate_custom_levels(obj, create, extracted, **kwargs):
        from factories.indicators_models import LevelTierFactory
        tiers = LevelTierFactory.build_custom_template(program=obj, tiers=tier_set)
    return generate_custom_levels


class CountryAdminAuditLogFactory(DjangoModelFactory):
    class Meta:
        model = CountryAdminAuditLog
        django_get_or_create = ('admin_user', 'country')

    date = Sequence(lambda n: datetime.date.today() + datetime.timedelta(days=n))
    admin_user = SubFactory(TolaUserFactory)
    country = SubFactory(CountryFactory)

    change_type = 'country_disaggregation_updated'

    @lazy_attribute
    def disaggregation_type(self):
        return DisaggregationTypeFactory(country=self.country)

    @lazy_attribute
    def previous_entry(self):
        return json.dumps(self.disaggregation_type.logged_fields)

    @lazy_attribute
    def new_entry(self):
        prev_entry = self.disaggregation_type.logged_fields
        label = DisaggregationLabelFactory(disaggregation_type=self.disaggregation_type)
        prev_entry['labels'][label.id] = {'id': label.id, 'label': label.label, 'custom_sort': len(prev_entry['labels']) + 1}
        return json.dumps(prev_entry)

