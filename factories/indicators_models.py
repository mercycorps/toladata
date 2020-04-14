from random import randint
import itertools

import datetime
import faker
from django.utils import timezone
from factory import (
    Faker,
    DjangoModelFactory,
    post_generation,
    SubFactory,
    RelatedFactory,
    SelfAttribute,
    LazyAttribute,
    lazy_attribute,
    Sequence,
    Trait,
)
from factory.fuzzy import FuzzyChoice, FuzzyInteger

from indicators.models import (
    Result as ResultM,
    ExternalService as ExternalServiceM,
    ReportingFrequency as ReportingFrequencyM,
    Indicator as IndicatorM,
    IndicatorType as IndicatorTypeM,
    Level as LevelM,
    LevelTier as LevelTierM,
    Objective as ObjectiveM,
    PeriodicTarget as PeriodicTargetM,
    StrategicObjective as StrategicObjectiveM,
    PinnedReport as PinnedReportM,
    DisaggregationType as DisaggregationTypeM,
    DisaggregationLabel as DisaggregationLabelM,
    DisaggregatedValue as DisaggregatedValueM,
    DataCollectionFrequency as DataCollectionFrequencyM
)
from factories.workflow_models import OrganizationFactory, ProgramFactory, CountryFactory


FAKER = faker.Faker(locale='en_US')


class ReportingFrequency(DjangoModelFactory):
    class Meta:
        model = ReportingFrequencyM

    frequency = 'Bi-weekly'
    description = 'Every two weeks'
    organization = SubFactory(OrganizationFactory)


class RandomIndicatorFactory(DjangoModelFactory):
    class Meta:
        model = IndicatorM

    name = lazy_attribute(lambda n: FAKER.sentence(nb_words=8))
    number = lazy_attribute(
        lambda n: "%s.%s.%s" % (randint(1, 2), randint(1, 4), randint(1, 5)))
    create_date = lazy_attribute(lambda t: timezone.now())


class IndicatorFactory(DjangoModelFactory):
    class Meta:
        model = IndicatorM
        django_get_or_create = ('name',)

    class Params:
        lop_indicator = Trait(
            lop_target=1000,
            target_frequency=IndicatorM.LOP,
            periodic_target=RelatedFactory(
                'factories.indicators_models.PeriodicTargetFactory',
                'indicator',
                target=1000,
                start_date=SelfAttribute('indicator.program.reporting_period_start'),
                end_date=SelfAttribute('indicator.program.reporting_period_end'),
            )
        )

    name = Sequence(lambda n: 'Indicator {0}'.format(n))


class DefinedIndicatorFactory(IndicatorFactory):
    number = Sequence(lambda n: '1.1.{0}'.format(n))
    source = "indicator source"
    definition = "indicator definition"
    justification = "rationale or justification"
    unit_of_measure = "a unit of measure"
    unit_of_measure_type = IndicatorM.NUMBER
    baseline = 100
    lop_target = 1000
    target_frequency = IndicatorM.QUARTERLY
    means_of_verification = "some means of verifying"
    data_collection_method = "some method of collecting data"
    data_collection_frequency = SubFactory('factories.indicators_models.DataCollectionFrequencyFactory')


class RFIndicatorFactory(DjangoModelFactory):
    class Meta:
        model = IndicatorM

    class Params:
        asftargets = False

    name = Faker('company')
    target_frequency = IndicatorM.ANNUAL
    lop_target = 1400
    unit_of_measure = FuzzyChoice(['cats', 'bananas', 'tennis rackets', 'dollars'])

    @post_generation
    def targets(self, create, extracted, **kwargs):
        if extracted and self.target_frequency:
            if self.target_frequency == IndicatorM.EVENT:
                def event_generator(start, end):
                    for c in range(2):
                        yield {
                            'customsort': c,
                            'start': start,
                            'end': end,
                            'name': f"Event {c+1}",
                            'label': f"Event {c+1} label?",
                        }
                period_generator = event_generator
            else:
                period_generator = PeriodicTargetM.generate_for_frequency(self.target_frequency)
            if self.program:
                periods = period_generator(
                    self.program.reporting_period_start, self.program.reporting_period_end
                )
            else:
                periods = period_generator(
                    datetime.date(2016, 1, 1), datetime.date(2018, 12, 31)
                )
            periods = list(periods)
            if extracted == "incomplete":
                if len(periods) > 1:
                    periods = periods[0:-1]
                    target_values = [self.lop_target/len(periods)]*len(periods)
                else:
                    periods = []
                    target_values = [] 
            elif isinstance(extracted, (int, float)):
                target_values = [round(extracted/len(periods), 2)]*len(periods)
                if len(target_values) > 1:
                    target_values[-1] = extracted - sum(target_values[0:-1])
            elif isinstance(extracted, list):
                target_values = extracted
                if len(extracted) < len(periods):
                    extracted += [None] * (len(periods) - len(extracted))
            elif self.lop_target:
                target_values = [round(self.lop_target / len(periods))]*len(periods)
                if len(target_values) > 1:
                    target_values[-1] = self.lop_target - sum(target_values[0:-1])
            else:
                target_values = [None]*len(periods)
            for period, target_value in zip(periods, target_values):
                PeriodicTargetFactory(
                    indicator=self,
                    customsort=period['customsort'],
                    target=target_value,
                    start_date=period['start'],
                    end_date=period['end']
                )

    @post_generation
    def results(self, create, extracted, **kwargs):
        if extracted:
            targets = self.periodictargets.all()
            count = kwargs.get('count', len(targets))
            if kwargs.get('evidence', None) is True:
                evidence = ["http://evidence.url"]*count
            elif isinstance(kwargs.get('evidence', None), int):
                evidence = ["http://evidence.url"]*kwargs.get('evidence') + [None]*(count - kwargs.get('evidence'))
            else:
                evidence = [None]*count
            targets = itertools.islice(itertools.cycle(targets), 0, count)
            if extracted is True:
                achieveds = [10]*count
            elif isinstance(extracted, (int, float)):
                achieveds = [extracted/count]*count
                achieveds[-1] = extracted - sum(achieveds[0:-1])
            elif isinstance(extracted, list):
                achieveds = extracted
                if count > len(extracted):
                    achieveds += [None]*(count - len(extracted))
            for c, (target, achieved, evidence) in enumerate(zip(targets, achieveds, evidence)):
                if not isinstance(achieved, list):
                    achieved = [achieved]
                for j, this_achieved in enumerate(achieved):
                    ResultFactory(
                        periodic_target=target,
                        achieved=this_achieved,
                        indicator=self,
                        program=self.program,
                        evidence_url=evidence,
                        date_collected=target.start_date + datetime.timedelta(days=1+j+c%count)
                    )

class Objective(DjangoModelFactory):
    class Meta:
        model = ObjectiveM

    name = 'Get Tola rocking!'


class LevelFactory(DjangoModelFactory):
    class Meta:
        model = LevelM

    name = Sequence(lambda n: 'Level: {0}'.format(n))


class LevelTierFactory(DjangoModelFactory):
    class Meta:
        model = LevelTierM

    class Params:
        mc_template = Trait(
            name=Sequence(
                lambda n: LevelTierM.get_templates()['mc_standard']['tiers'][n]
            )
        )

    name = Sequence(lambda n: 'LevelTier: {0}'.format(n))
    tier_depth = Sequence(lambda n: n+1)

    @classmethod
    def build_mc_template(cls, program):
        return [
            cls(program=program, name=name, tier_depth=count+1)
            for count, name in enumerate(LevelTierM.get_templates()['mc_standard']['tiers'])
            ]


class ResultFactory(DjangoModelFactory):
    class Meta:
        model = ResultM

    program = SubFactory(ProgramFactory)
    indicator = SubFactory(IndicatorFactory)
    comments = Sequence(lambda n: 'Data description {0}'.format(n))
    achieved = 10

    @post_generation
    def sites(self, create, extracted, **kwargs):
        if not create:
            # Simple build, do nothing.
            return

        if isinstance(extracted, list):
            # A list of program were passed in, use them
            for site in extracted:
                self.site.add(site)


class IndicatorTypeFactory(DjangoModelFactory):
    class Meta:
        model = IndicatorTypeM
        django_get_or_create = ('indicator_type',)

    indicator_type = Sequence(lambda n: 'Indicator Type {0}'.format(n))


class ExternalServiceFactory(DjangoModelFactory):
    class Meta:
        model = ExternalServiceM

    name = Sequence(lambda n: 'External Service {0}'.format(n))


class StrategicObjective(DjangoModelFactory):
    class Meta:
        model = StrategicObjectiveM

    name = Sequence(lambda n: 'Stratigic Objective {0}'.format(n))


class PeriodicTargetFactory(DjangoModelFactory):
    class Meta:
        model = PeriodicTargetM

    target = 0
    period = lazy_attribute(
        lambda pt: 'PeriodicTarget for %s: %s - %s' % (pt.indicator.name, pt.start_date, pt.end_date))
    customsort = Sequence(lambda n: n)


class PinnedReportFactory(DjangoModelFactory):
    class Meta:
        model = PinnedReportM

    name = Sequence(lambda n: 'Test pinned report: {0}'.format(n))
    report_type = FuzzyChoice(['timeperiods', 'targetperiods'])


class DisaggregationTypeFactory(DjangoModelFactory):
    class Meta:
        model = DisaggregationTypeM

    standard = False
    disaggregation_type = Sequence(lambda n: "disagg type {0}".format(n))
    country = LazyAttribute(lambda o: None if o.standard else CountryFactory())

    @post_generation
    def labels(self, create, extracted, **kwargs):
        if extracted is None:
            extracted = ['Label 1', 'Label 2']
        if isinstance(extracted, list):
            labels = [
                DisaggregationLabelFactory(
                    disaggregation_type=self, label=label, customsort=c+1
                    ) for c, label in enumerate(extracted)
                ]


class DisaggregationLabelFactory(DjangoModelFactory):
    class Meta:
        model = DisaggregationLabelM

    disaggregation_type = SubFactory(DisaggregationTypeFactory)
    label = Sequence(lambda n: "disagg label {}".format(n))
    customsort = Sequence(lambda n: n + 1)


class DisaggregatedValueFactory(DjangoModelFactory):
    class Meta:
        model = DisaggregatedValueM

    category = SubFactory(DisaggregationLabelFactory)
    value = FuzzyInteger(10, 100)


class DataCollectionFrequencyFactory(DjangoModelFactory):
    class Meta:
        model = DataCollectionFrequencyM

    frequency = "some reasonable frequency"
    description = "a description of how frequent this is"
    numdays = 10
