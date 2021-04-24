import string
import itertools
import datetime
from factory.django import DjangoModelFactory
from factory import (
    lazy_attribute,
    LazyAttribute,
    SelfAttribute,
    SubFactory,
    Faker,
    Maybe,
    PostGeneration,
    post_generation,
    Sequence,
    RelatedFactory,
    Trait,
    lazy_attribute_sequence,
    fuzzy
)
from factories.django_models import UserFactory, UserOnlyFactory
from workflow.models import (
    Country,
    Organization,
    ProfileType,
    Sector,
    SiteProfile,
    TolaUser,
    Program,
    CountryAccess,
    ProgramAccess,
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
        model = Country
        django_get_or_create = ('code',)

    country = Sequence(lambda n: f'Country {n}')
    description = Faker('paragraph')

    @lazy_attribute_sequence
    def code(self, n):
        """Allows for 676 unique codes from AA to ZZ, call CountryFactory.reset_sequence() if you run out"""
        if n // 26 >= 26:
            raise ValueError('Too many countries to store in ISO code, reached sequence {}'.format(n))
        return '{}{}'.format(string.ascii_uppercase[n//26], string.ascii_uppercase[n % 26])


class CountryAccessFactory(DjangoModelFactory):
    class Meta:
        model = CountryAccess


class OrganizationFactory(DjangoModelFactory):
    class Meta:
        model = Organization

    name = Faker('company')

    @post_generation
    def sectors(self, create, extracted, **kwargs):
        """M2M fails unless this is explicitly called out as a post_generation hook"""
        if not create:
            # simple build, do nothing
            return
        if extracted:
            if isinstance(extracted, Sector):
                extracted = [extracted]
            for sector in extracted:
                self.sectors.add(sector)


class SiteProfileFactory(DjangoModelFactory):
    class Meta:
        model = SiteProfile

    name = Sequence(lambda n: 'Site Profile {0}'.format(n))
    country = SubFactory(CountryFactory, country='United States', code='US')


class TolaUserFactory(DjangoModelFactory):
    class Meta:
        model = TolaUser
        django_get_or_create = ('user',)

    class Params:
        mc_staff = True
        superadmin = False
        active = True

    name = Sequence(lambda n: f"tola_user_{n}")
    user = SubFactory(
        UserOnlyFactory,
        username=SelfAttribute('..name'),
        is_superuser=SelfAttribute('..superadmin'),
        is_active=SelfAttribute('..active')
    )
    organization = Maybe(
        'mc_staff',
        yes_declaration=SubFactory(OrganizationFactory, id=1, name="MC Org"),
        no_declaration=SubFactory(OrganizationFactory, name=Faker('company'))
    )
    country = SubFactory(CountryFactory)

    @post_generation
    def password(obj, create, extracted, **kwargs):
        if extracted:
            obj.user.set_password(extracted)
            obj.user.save()


class ProgramFactory(DjangoModelFactory):
    class Meta:
        model = Program
        django_get_or_create = ('gaitid',)

    class Params:
        active = True
        old_levels = Trait(
            _using_results_framework=Program.NOT_MIGRATED
        )
        has_rf = Trait(
            generate_levels=PostGeneration(generate_mc_levels)
        )

    name = 'Health and Survival for Syrians in Affected Regions'
    gaitid = Sequence(lambda n: "%0030d" % n)
    country = RelatedFactory(CountryFactory, country='United States', code='US')
    funding_status = LazyAttribute(lambda o: "funded" if o.active else "Inactive")
    _using_results_framework = Program.RF_ALWAYS
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
        model = Program

    class Params:
        active = True
        migrated = None
        months = 12
        closed = True
        age = False

    name = Faker('company')
    funding_status = LazyAttribute(lambda o: "Funded" if o.active else "Inactive")
    _using_results_framework = LazyAttribute(
        lambda o: Program.RF_ALWAYS if o.migrated is None else Program.MIGRATED if o.migrated else Program.NOT_MIGRATED
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
        if not extracted:
            return
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
        if not extracted:
            return
        elif isinstance(extracted, (dict, tuple, list)):
            extracted = extracted.copy()
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
        parent_counts = {}
        for count, level_data in enumerate(levels_data):
            new_tier = tiers[level_data['depth']]
            if new_tier != tier:
                depth_count = 1
                tier = new_tier
            parent_id_for_count = 'x' if level_data['parent'] is None else level_data['parent']
            if parent_id_for_count not in parent_counts:
                parent_counts[parent_id_for_count] = 0
            parent_counts[parent_id_for_count] += 1
            this_level_data = {
                'name': "Tier: {} Order: {}".format(tier.name, depth_count),
                'customsort': parent_counts[parent_id_for_count],
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
        """To assign indicators to levels, pass 'indicators__levels=True' to the class when creating the program """
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

    @post_generation
    def country(self, create, extracted, **kwargs):
        if not create:
            return
        if extracted:
            for country in extracted:
                self.country.add(country)


class SectorFactory(DjangoModelFactory):
    class Meta:
        model = Sector

    sector = Sequence(lambda n: 'Sector {0}'.format(n))


class ProfileType(DjangoModelFactory):
    class Meta:
        model = ProfileType

    profile = 'Distribution Center'


def grant_program_access(tolauser, program, country, role=PROGRAM_ROLE_CHOICES[0][0]):
    access_object, _ = ProgramAccess.objects.get_or_create(
        program=program,
        tolauser=tolauser,
        country=country
    )
    access_object.role = role
    access_object.save()

def grant_country_access(tolauser, country, role=COUNTRY_ROLE_CHOICES[0][0]):
    access_object, _ = CountryAccess.objects.get_or_create(
        country=country,
        tolauser=tolauser
    )
    access_object.role = role
    access_object.save()
