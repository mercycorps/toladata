import itertools
import datetime
from django.template.defaultfilters import slugify
from factory import (
    DjangoModelFactory,
    lazy_attribute,
    LazyAttribute,
    SubFactory,
    PostGeneration,
    post_generation,
    Sequence,
    RelatedFactory,
    Trait
)
from factories.django_models import UserFactory, Site
from workflow.models import (
    Country as CountryM,
    Documentation as DocumentationM,
    Organization as OrganizationM,
    ProfileType as ProfileTypeM,
    ProjectType as ProjectTypeM,
    Sector as SectorM,
    SiteProfile as SiteProfileM,
    Stakeholder as StakeholderM,
    StakeholderType as StakeholderTypeM,
    TolaUser as TolaUserM,
    Program as ProgramM,
    CountryAccess as CountryAccessM,
    ProgramAccess as ProgramAccessM,
    PROGRAM_ROLE_CHOICES,
    COUNTRY_ROLE_CHOICES
)

def generate_mc_levels(obj, create, extracted, **kwargs):
    from factories.indicators_models import LevelTierFactory
    LevelTierFactory.build_mc_template(program=obj)

def custom_level_generator(tier_set):
    def generate_custom_levels(obj, create, extracted, **kwargs):
        from factories.indicators_models import LevelTierFactory
        tiers = LevelTierFactory.build_custom_template(program=obj, tiers=tier_set)
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

        if isinstance(extracted, list):
            # Use the list of provided indicators
            self.indicator_set.add(*extracted)

    @post_generation
    def countries(self, create, extracted, **kwargs):
        if not create:
            # Simple build, do nothing.
            return

        if isinstance(extracted, list):
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
            month = month - (self.months//2)
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
            month = today.month + (self.months - (self.months//2))
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
            LevelTierFactory.build_mc_template(program=self)
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
        def get_children(parents, count):
            return tuple([
                get_children(parent, count) if isinstance(parent, tuple) else tuple([count]*parent)
                for parent in parents
            ])
        def convert_to_data(counts_for_tier, parents=None, count=0):
            this_tier_counts = counts_for_tier.pop(0)
            lower_tier_levels = []
            level_sets = []
            for c, level_count in enumerate(this_tier_counts):
                level_sets.append((
                    [row[c] for row in counts_for_tier],
                    [{
                        'count': count+x,
                        'parent': parents[c]['count'] if parents is not None else None,
                        'depth': parents[c]['depth'] +  1 if parents is not None else 0
                        } for x in range(level_count)]
                ))
                count += level_count
            for lower_tier_counts, level_parents in level_sets:
                if lower_tier_counts:
                    new_lower_tiers, count = convert_to_data(lower_tier_counts, level_parents, count)
                    lower_tier_levels += new_lower_tiers
            return [level_data for data_set in level_sets for level_data in data_set[1]] + lower_tier_levels, count
        if isinstance(extracted, int):
            levels_per_tier = []
            parents = (1,)
            for tier in tiers:
                levels_per_tier.append(parents)
                parents = get_children(parents, extracted)
            levels_data, _ = convert_to_data(levels_per_tier)
        elif isinstance(extracted, list):
            levels_data, _ = convert_to_data(extracted)
        else:
            return
        levels = []
        universal_level_data = kwargs.get('all', {})
        universal_level_data.update({'program': self})
        level_pks = kwargs.get('pks', [])
        tier = None
        for count, level_data in enumerate(levels_data):
            new_tier = tiers[level_data['depth']]
            if new_tier != tier:
                depth_count = 1
                tier = new_tier
            this_level_data = {
                'name': u"Tier: {} Order: {}".format(tier.name, depth_count),
                'customsort': depth_count,
                'parent': levels[level_data['parent']] if level_data['parent'] is not None else None
            }
            depth_count += 1
            if level_pks and len(level_pks) > count:
                this_level_data.update({'pk': level_pks[count]})
            this_level_data.update(universal_level_data)
            this_level_data.update(kwargs.get(str(level_data['count']), {}))
            levels.append(LevelFactory(**this_level_data))

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
                    levels = itertools.cycle([('level', level) for level in self.levels.all().order_by('pk')])
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

        if isinstance(extracted, list):
            # A list of program were passed in, use them
            for program in extracted:
                self.program.add(program)


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


def grant_program_access(tolauser, program, country, role=PROGRAM_ROLE_CHOICES[0][0]):
    access_object, _ = ProgramAccessM.objects.get_or_create(
        program=program,
        tolauser=tolauser,
        country=country
    )
    access_object.role = role
    access_object.save()

def grant_country_access(tolauser, country, role=COUNTRY_ROLE_CHOICES[0][0]):
    access_object, _ = CountryAccessM.objects.get_or_create(
        country=country,
        tolauser=tolauser
    )
    access_object.role = role
    access_object.save()
    