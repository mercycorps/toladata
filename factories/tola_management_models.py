
import json
import datetime
from factory.django import DjangoModelFactory
from factory import lazy_attribute, LazyAttribute, SubFactory, Faker, Sequence, Iterator
from factories.workflow_models import TolaUserFactory, CountryFactory, ProgramFactory, OrganizationFactory
from factories.indicators_models import (
    DisaggregationTypeFactory, DisaggregationLabelFactory, RFIndicatorFactory, LevelFactory, LevelTierFactory)
from tola_management.models import (
    CountryAdminAuditLog, ProgramAdminAuditLog, UserManagementAuditLog, OrganizationAdminAuditLog, ProgramAuditLog,
    AuditLogRationaleSelection)


def generate_mc_levels(obj, create, extracted, **kwargs):
    from factories.indicators_models import LevelTierFactory
    LevelTierFactory.build_mc_template(program=obj)


class AuditLogRationaleSelectionFactory(DjangoModelFactory):
    class Meta:
        model = AuditLogRationaleSelection

    # The AuditLogRationalSelection model is a one-to-one with ProgramAuditLog and allows us to tag each log entry
    # with one or more rationale types, with one field per type.  This is meant to cycle through all of the current
    # rationale types as each factory log entry is created.
    other = Iterator([1,0,0,0,0,0,0,0])
    adaptive_management = Iterator([0,1,0,0,0,0,0,0])
    budget_realignment = Iterator([0,0,1,0,0,0,0,0])
    changes_in_context = Iterator([0,0,0,1,0,0,0,0])
    costed_extension = Iterator([0,0,0,0,1,0,0,0])
    covid_19 = Iterator([0,0,0,0,0,1,0,0])
    donor_requirement = Iterator([0,0,0,0,0,0,1,0])
    implementation_delays = Iterator([0,0,0,0,0,0,0,1])


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


class ProgramAdminAuditLogFactory(DjangoModelFactory):
    class Meta:
        model = ProgramAdminAuditLog
        django_get_or_create = ('admin_user', 'program')

    date = Sequence(lambda n: datetime.date.today() + datetime.timedelta(days=n))
    admin_user = SubFactory(TolaUserFactory)
    program = SubFactory(ProgramFactory)
    change_type = 'program_updated'

    @lazy_attribute
    def previous_entry(self):
        return json.dumps(self.program.admin_logged_fields)

    @lazy_attribute
    def new_entry(self):
        prev_entry = self.program.admin_logged_fields
        prev_entry['name'] = 'Different name'
        return json.dumps(prev_entry)


class OrganizationAdminAuditLogFactory(DjangoModelFactory):
    class Meta:
        model = OrganizationAdminAuditLog
        django_get_or_create = ('admin_user', 'organization')

    date = Sequence(lambda n: datetime.date.today() + datetime.timedelta(days=n))
    admin_user = SubFactory(TolaUserFactory)
    organization = SubFactory(OrganizationFactory)
    change_type = 'organization_updated'

    @lazy_attribute
    def previous_entry(self):
        return json.dumps(self.organization.logged_fields)

    @lazy_attribute
    def new_entry(self):
        prev_entry = self.organization.logged_fields
        prev_entry['name'] = 'Different name'
        return json.dumps(prev_entry)


class UserManagementAuditLogFactory(DjangoModelFactory):
    class Meta:
        model = UserManagementAuditLog
        django_get_or_create = ('admin_user', 'modified_user')

    date = Sequence(lambda n: datetime.date.today() + datetime.timedelta(days=n))
    admin_user = SubFactory(TolaUserFactory)
    modified_user = SubFactory(TolaUserFactory)
    change_type = 'user_programs_updated'

    @lazy_attribute
    def previous_entry(self):
        return json.dumps(self.modified_user.logged_fields)

    @lazy_attribute
    def new_entry(self):
        prev_entry = self.modified_user.logged_fields
        return json.dumps(prev_entry)


class ProgramAuditLogFactory(DjangoModelFactory):
    class Meta:
        model = ProgramAuditLog
        django_get_or_create = ('user', 'program', 'organization')

    program = SubFactory(ProgramFactory)
    date = datetime.datetime.now()
    user = SubFactory(TolaUserFactory)
    organization = LazyAttribute(lambda o: o.user.organization)
    indicator = LazyAttribute(lambda o: RFIndicatorFactory(program=o.program))
    # level = LazyAttribute(lambda o: LevelFactory(program=o.program))
    change_type = 'indicator_changed'
    rationale = Faker('text')
    rationale_selections = SubFactory(AuditLogRationaleSelectionFactory)

    @lazy_attribute
    def previous_entry(self):
        return json.dumps(self.indicator.logged_fields)

    @lazy_attribute
    def new_entry(self):
        prev_entry = self.indicator.logged_fields
        return json.dumps(prev_entry)

    @lazy_attribute
    def level(self):
        LevelTierFactory(program=self.program)
        return LevelFactory(program=self.program)

