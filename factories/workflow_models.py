import itertools
import datetime
from django.template.defaultfilters import slugify
from factory import (
    DjangoModelFactory,
    lazy_attribute,
    SelfAttribute,
    LazyAttribute,
    lazy_attribute,
    SubFactory,
    PostGeneration,
    post_generation,
    Sequence,
    RelatedFactory,
    Trait
)
from .django_models import UserFactory, Site
from workflow.models import (
    Contact as ContactM,
    Country as CountryM,
    Documentation as DocumentationM,
    FundCode as FundCodeM,
    Organization as OrganizationM,
    ProfileType as ProfileTypeM,
    ProjectType as ProjectTypeM,
    Sector as SectorM,
    SiteProfile as SiteProfileM,
    Stakeholder as StakeholderM,
    StakeholderType as StakeholderTypeM,
    TolaSites as TolaSitesM,
    TolaUser as TolaUserM,
    Program as ProgramM,
    CountryAccess as CountryAccessM,
    ProgramAccess as ProgramAccessM,
    PROGRAM_ROLE_CHOICES,
    COUNTRY_ROLE_CHOICES
)

def generate_mc_levels(obj, create, extracted, **kwargs):
    from factories.indicators_models import LevelTierFactory
    tiers = LevelTierFactory.build_mc_template(program=obj)

def custom_level_generator(tier_set):
    def generate_custom_levels(obj, create, extracted, **kwargs):
        from factories.indicators_models import LevelTierFactory
        tiers = LevelTierFactory.build_custom_template(program=obj,tiers=tier_set)
    return generate_custom_levels

class CountryFactory(DjangoModelFactory):
    class Meta:
        model = CountryM
        django_get_or_create = ('code',)

    country = 'Afghanistan'
    code = 'AF'

class CountryAccessFactory(DjangoModelFactory):
    class Meta:
        model = CountryAccessM


class Contact(DjangoModelFactory):
    class Meta:
        model = ContactM

    name = 'Aryana Sayeed'
    city = 'Kabul'
    email = lazy_attribute(lambda o: slugify(o.name) + "@external-contact.com")
    phone = '+93 555444333'
    country = SubFactory(CountryFactory)


class OrganizationFactory(DjangoModelFactory):
    class Meta:
        model = OrganizationM

    name = 'MC Org'


class SiteProfileFactory(DjangoModelFactory):
    class Meta:
        model = SiteProfileM

    name = Sequence(lambda n: 'Site Profile {0}'.format(n))
    country = SubFactory(CountryFactory, country='United States', code='US')


class TolaUserFactory(DjangoModelFactory):
    class Meta:
        model = TolaUserM
        django_get_or_create = ('user',)

    user = SubFactory(UserFactory)
    name = LazyAttribute(lambda o: o.user.first_name + " " + o.user.last_name)
    organization = SubFactory(OrganizationFactory, id=1)
    country = SubFactory(CountryFactory, country='United States', code='US')

class ProgramFactory(DjangoModelFactory):
    class Meta:
        model = ProgramM
        django_get_or_create = ('gaitid',)

    class Params:
        active = True
        old_levels = Trait(
            _using_results_framework=ProgramM.NOT_MIGRATED
        )
        has_rf = Trait(
            generate_levels=PostGeneration(generate_mc_levels)
        )

    name = 'Health and Survival for Syrians in Affected Regions'
    gaitid = Sequence(lambda n: "%0030d" % n)
    country = RelatedFactory(CountryFactory, country='United States', code='US')
    funding_status = LazyAttribute(lambda o: "funded" if o.active else "Inactive")
    _using_results_framework = ProgramM.RF_ALWAYS
    auto_number_indicators = True
    generate_levels = None

    @post_generation
    def indicators(self, create, extracted, **kwargs):
        if not create:
            # Simple build, do nothing.
            return

        if type(extracted) is list:
            # Use the list of provided indicators
            self.indicator_set.add(*extracted)

    @post_generation
    def countries(self, create, extracted, **kwargs):
        if not create:
            # Simple build, do nothing.
            return

        if type(extracted) is list:
            # Use the list of provided countries
            self.country.add(*extracted)

class RFProgramFactory(DjangoModelFactory):
    class Meta:
        model = ProgramM

    class Params:
        active = True
        migrated = None
        months = 12
        closed = True
        age = False

    funding_status = LazyAttribute(lambda o: "Funded" if o.active else "Inactive")
    _using_results_framework = LazyAttribute(
        lambda o: ProgramM.RF_ALWAYS if o.migrated is None else ProgramM.MIGRATED if o.migrated else ProgramM.NOT_MIGRATED
    )

    @lazy_attribute
    def reporting_period_start(self):
        year = datetime.date.today().year
        month = datetime.date.today().month
        if self.closed:
            month = month - self.months
        elif self.age:
            month = month - self.age
        else:
            month = month - (self.months/2)
        while month <= 0:
            month = month + 12
            year = year - 1
        return datetime.date(year, month, 1)

    @lazy_attribute
    def reporting_period_end(self):
        today = datetime.date.today()
        if self.closed:
            return datetime.date(today.year, today.month, 1) - datetime.timedelta(days=1)
        elif self.age:
            month = today.month + (self.months - self.age)
        else:
            month = today.month + (self.months - (self.months/2))
        year = today.year
        while month > 12:
            month = month - 12
            year = year + 1
        return datetime.date(year, month, 1) - datetime.timedelta(days=1)


    @post_generation
    def tiers(self, create, extracted, **kwargs):
        """generate tiers - can take True to generate MC tiers, or a list of tier names"""
        from factories.indicators_models import LevelTierFactory
        if extracted is True:
            tiers = LevelTierFactory.build_mc_template(program=self)
        elif isinstance(extracted, list):
            tiers = [
                LevelTierFactory(name=name, tier_depth=depth+1, program=self)
                for depth, name in enumerate(extracted)
                ]

    @post_generation
    def levels(self, create, extracted, **kwargs):
        """post-gen hooks are called in declaration order, so this can depend upon tiers method"""
        tiers = self.level_tiers.all()
        from factories.indicators_models import LevelFactory
        if isinstance(extracted, int):
            parents = [None,]
            newparents = []
            for tier in tiers:
                for parent in parents:
                    for count in range(extracted if parent is not None else 1):
                        newparents.append(
                            LevelFactory(
                                program=self,
                                name=u"Tier: {} parent {}: {}".format(tier.name, parent.pk if parent else u"-", count+1),
                                customsort=count+1,
                                parent=parent
                                )
                            )
                parents = newparents
                newparents = []

    @post_generation
    def indicators(self, create, extracted, **kwargs):
        if extracted:
            from factories.indicators_models import RFIndicatorFactory
            if kwargs and kwargs.get('levels'):
                if not self.results_framework:
                    levels = itertools.cycle([
                        ('old_level', level_name) for (pk, level_name) in RFIndicatorFactory._meta.model.OLD_LEVELS]
                        )
                else:
                    levels = itertools.cycle([('level', level) for level in self.levels.all()])
            else:
                levels = False
            indicator_data = kwargs.get('all', {})
            indicator_data.update({
                'program': self
            })
            for count in range(extracted):
                this_indicator_data = {}
                this_indicator_data.update(indicator_data)
                this_indicator_data.update(kwargs.get(str(count), {}))
                if levels:
                    (level_field, level_value) = next(levels)
                    this_indicator_data.update({level_field: level_value})
                RFIndicatorFactory(**this_indicator_data)


class DocumentationFactory(DjangoModelFactory):
    class Meta:
        model = DocumentationM

    name = Sequence(lambda n: 'Document {0}'.format(n))
    program = SubFactory(ProgramFactory)


class SectorFactory(DjangoModelFactory):
    class Meta:
        model = SectorM

    sector = Sequence(lambda n: 'Sector {0}'.format(n))


class Stakeholder(DjangoModelFactory):
    class Meta:
        model = StakeholderM

    name = 'Stakeholder A'
    organization = SubFactory(OrganizationFactory)

    @post_generation
    def program(self, create, extracted, **kwargs):
        if not create:
            # Simple build, do nothing.
            return

        if type(extracted) is list:
            # A list of program were passed in, use them
            for program in extracted:
                self.program.add(program)


class FundCode(DjangoModelFactory):
    class Meta:
        model = FundCodeM

    name = 'Fund Code A'
    organization = SubFactory(OrganizationFactory)


class ProjectType(DjangoModelFactory):
    class Meta:
        model = ProjectTypeM

    name = 'Adaptive Management'
    description = 'Adaptive Management'


class StakeholderType(DjangoModelFactory):
    class Meta:
        model = StakeholderTypeM

    name = 'Association'


class ProfileType(DjangoModelFactory):
    class Meta:
        model = ProfileTypeM

    profile = 'Distribution Center'


class TolaSites(DjangoModelFactory):
    class Meta:
        model = TolaSitesM
        django_get_or_create = ('name',)

    name = 'MercyCorps'
    site = SubFactory(Site)

def grant_program_access(tolauser, program, country, role=PROGRAM_ROLE_CHOICES[0][0]):
    access_object, _ = ProgramAccessM.objects.get_or_create(
        program=program,
        tolauser=tolauser,
        country=country
    )
    access_object.role=role
    access_object.save()

def grant_country_access(tolauser, country, role=COUNTRY_ROLE_CHOICES[0][0]):
    access_object, _ = CountryAccessM.objects.get_or_create(
        country=country,
        tolauser=tolauser
    )
    access_object.role = role
    access_object.save()
    