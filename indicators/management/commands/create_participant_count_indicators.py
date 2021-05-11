from datetime import date

from django.core.management.base import BaseCommand
from django.db import transaction

from indicators.models import Indicator, Level, LevelTier, IndicatorType, PeriodicTarget
from workflow.models import Country, Program, Organization


class Command(BaseCommand):
    help = """
        Create participant count country, programs, and indicators
        """

    def add_arguments(self, parser):
        parser.add_argument('--clean_option1_indicators', action='store_true')
        parser.add_argument('--clean_option3_indicators', action='store_true')

    @transaction.atomic
    def handle(self, *args, **options):
        option1_country_names = ['Lebanon', 'Palestine (West Bank / Gaza)', 'Indonesia']
        option3_countries = {'Liberia': 7, 'Mali': 6}
        option3_program_name_template = 'Participant Count {}'

        pc_country_name = 'Mapping Our Reach'
        program_start_date = date(2020, 7, 1)
        program_end_date = date(2022, 6, 30)
        mc_org = Organization.objects.get(name="Mercy Corps")
        metrics = {
            'indicator_created': {}, 'indicator_existed': {}, 'program_existed': 0, 'program_created': 0,
            'dates_created': 0, 'rf_created': 0
        }

        if options['clean_option1_indicators']:
            self.clean_option1(option1_country_names)
        if options['clean_option3_indicators']:
            self.clean_option3(option3_countries, option3_program_name_template)

        # First do option1 - an indicator in each real program in each real country in the option 1 list.
        for country_name in option1_country_names:
            country = Country.objects.get(country=country_name)
            for program in Program.objects.filter(country=country, funding_status='Funded'):
                try:
                    top_level = Level.objects.get(parent=None, program=program)
                except Level.DoesNotExist:
                    print(f"Could not add indicator to {country_name}: {program.name} because RF doesn't exist.")
                    continue
                indicator_name = 'Number of people reached in fiscal year'
                i_created = self.create_indicator(indicator_name, program, top_level, 1, country)
                if i_created:
                    try:
                        metrics['indicator_created'][country_name] += 1
                    except KeyError:
                        metrics['indicator_created'][country_name] = 1
                else:
                    try:
                        metrics['indicator_existed'][country_name] += 1
                    except KeyError:
                        metrics['indicator_existed'][country_name] = 1

        # Now do option3 - a dummy country with one dummy program per participating country and an
        # indicator for each program in that country.
        pc_country, created = Country.objects.get_or_create(country=pc_country_name, defaults={
            'organization': mc_org,
            'code': "ZZ"
        })
        if created:
            print("Dummy Mapping Our Reach country created")
        else:
            print("Dummy Mapping Our Reach country already existed")

        for country, indicator_count in option3_countries.items():
            country_program_name = option3_program_name_template.format(country)
            dummy_program, created = Program.objects.get_or_create(
                name=country_program_name,
                defaults={
                    'funding_status': 'Funded',
                    'reporting_period_start': program_start_date,
                    'reporting_period_end': program_end_date,
                }
            )
            if created:
                dummy_program.country.add(pc_country)
                metrics['program_created'] += 1
            else:
                metrics['program_existed'] += 1

            if not (dummy_program.reporting_period_start and dummy_program.reporting_period_end):
                dummy_program.reporting_period_start = program_start_date
                dummy_program.reporting_period_end = program_end_date
                metrics['dates_created'] += 1
            try:
                top_level = Level.objects.get(parent=None, program=dummy_program)
            except Level.DoesNotExist:
                top_level = Level.objects.create(name='Goal', customsort=1, program=dummy_program)
                for i, tier_name in enumerate(LevelTier.get_templates()['mc_standard']['tiers']):
                    LevelTier.objects.create(name=tier_name, program=dummy_program, tier_depth=i+1)
                metrics['rf_created'] += 1

            for i in range(indicator_count):
                indicator_name = 'Number of people reached in fiscal year in <<insert program name>>'
                i_created = self.create_indicator(indicator_name, dummy_program, top_level, 3, pc_country)
                if i_created:
                    try:
                        metrics['indicator_created'][country] += 1
                    except KeyError:
                        metrics['indicator_created'][country] = 1
                else:
                    try:
                        metrics['indicator_existed'][country] += 1
                    except KeyError:
                        metrics['indicator_existed'][country] = 1


        print(f"{metrics['program_created']} programs were created in the dummy country, {metrics['program_existed']} already existed.")
        print(f"{metrics['dates_created']} reporting period dates were created.")
        print(f"{metrics['rf_created']} programs needed a result framework level added.")
        for country_name in metrics['indicator_created']:
            print(f"{metrics['indicator_created'][country_name]} indicators were created in {country_name}.")
        for country_name in metrics['indicator_existed']:
            print(f"{metrics['indicator_existed'][country_name]} indicators already existed in {country_name}.")

    @staticmethod
    def create_indicator(name, program, top_level, option_number, country):
        definition_text = (
            "Participants are defined as “all people who have received tangible benefit – directly "
            "or indirectly from the project.” We distinguish between direct and indirect:\n\n"
            "Direct participants – are those who have received a tangible benefit from the program, "
            "either as the actual program participants or the intended recipients of the program benefits. "
            "This means individuals or communities.\n\n"
            "Indirect participants – are those who received a tangible benefit through their proximity to "
            "or contact with program participants or activities.\n\n"
            "** Add Direct Participants definition **\n\n"
            "** Add Indirect Participants definition **"
        )
        indicator_justification = (
            "Participant reach is crucial to take decisions on the program implementation.It provides insights "
            "into the intended and unintended targeted individuals and provides insights into the scale of the "
            "program.\n\n"
            "This aggregate participant number is used all over the agency in our boilerplate, capacity "
            "statements, proposals to institutional donors, and a handful of other reports.")
        information_use = (
            "Program Manager/Director - intended and uninteded reach (targeting), including imbalances across "
            "groups; direct/indirect ratio; consistency between reach and outcome of the program; historical "
            "change.\n\n"
            "Country/Regional Director - meeting strategic objectives.\n\n"
            "HQ - reporting\n\n")

        other_defaults = {
            'level': top_level,
            'source': 'Mercy Corps',
            'definition': definition_text,
            'justification': indicator_justification,
            'unit_of_measure': 'Participant',
            'rationale_for_target': 'The target is based on the intended reach of the program',
            'baseline': 0,
            'direction_of_change': 2,
            'data_points': '# of people reached',
            'information_use': information_use,
            'reporting_frequency_id': 7,
        }


        if option_number == 1:
            indicator, created = Indicator.objects.get_or_create(
                name=name,
                program=program,
                defaults=other_defaults
            )

            indicator.indicator_type.add(IndicatorType.objects.get(indicator_type="Custom"))
            if created:
                indicator.target_frequency = 8
                indicator.lop_target = 2
                indicator.save()
                PeriodicTarget.objects.get_or_create(
                    period='FY2021', target=1, customsort=0, indicator=indicator)
                PeriodicTarget.objects.get_or_create(
                    period='FY2022', target=1, customsort=1, indicator=indicator)
            indicator.disaggregation.add(
                *country.disaggregationtype_set.filter(disaggregation_type__startswith="Participant count"))
            return created

        if option_number == 3:

            indicator = Indicator.objects.create(
                name=name,
                program=program,
                **other_defaults
            )

            indicator.disaggregation.add(*list(country.disaggregationtype_set.all()))

            indicator.indicator_type.add(IndicatorType.objects.get(indicator_type="Custom"))
            indicator.target_frequency = 3
            indicator.lop_target = 2
            indicator.save()
            PeriodicTarget.objects.get_or_create(
                period='Year 1', target=1, customsort=0, indicator=indicator, start_date=date(2020, 7, 1),
                end_date=date(2021, 6, 30))
            PeriodicTarget.objects.get_or_create(
                period='Year 2', target=1, customsort=1, indicator=indicator, start_date=date(2021, 7, 1),
                end_date=date(2022, 6, 30))
            return True

        raise NotImplementedError("Option must be 1 or 3")

    @staticmethod
    def clean_option3(country_names, name_template):
        for program_name in [name_template.format(country_name) for country_name in country_names]:
            try:
                program = Program.objects.get(name=program_name)
            except Program.DoesNotExist:
                continue
            for indicator in program.indicator_set.all():
                indicator.delete()

    @staticmethod
    def clean_option1(country_names):
        for country in Country.objects.filter(country__in=country_names):
            deleted_count = 0
            for program  in Program.objects.filter(country=country):
                try:
                    indicator = Indicator.objects.get(program=program, name="Number of people reached in fiscal year")
                    indicator.delete()
                    deleted_count += 1
                except Indicator.DoesNotExist:
                    pass
            print(f'Option1 indicators deleted for {country.country}: {deleted_count}')

