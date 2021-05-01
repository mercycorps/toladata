from datetime import date

from django.core.management.base import BaseCommand

from indicators.models import Indicator, Level, LevelTier, IndicatorType, PeriodicTarget
from workflow.models import Country, Program, Organization


class Command(BaseCommand):
    help = """
        Setup targets for indicators by reading a CSV file
        """

    def handle(self, *args, **options):
        option1_country_names = ['Lebanon', 'Palestine (West Bank / Gaza)', 'Indonesia']
        option3_country_names = ['Liberia', 'Mali']
        country_programs = {}
        pc_country_name = 'Mapping Our Reach'
        program_start_date = date(2020, 7, 1)
        program_end_date = date(2022, 6, 30)
        mc_org = Organization.objects.get(name="Mercy Corps")

        for country_name in option1_country_names + option3_country_names:
            country_programs[country_name] = Program.objects.filter(country__country=country_name, funding_status='Funded')

        pc_country, created = Country.objects.get_or_create(country=pc_country_name, defaults={
            'organization': mc_org,
            'code': "ZZ"
        })
        if created:
            print("Dummy Mapping Our Reach country created")
        else:
            print("Dummy Mapping Our Reach country already existed")

        metrics = {
            'indicator_created': {}, 'indicator_existed': {}, 'program_existed': 0, 'program_created': 0,
            'dates_created': 0, 'rf_created': 0
        }

        # First do option1 - an indicator in each real program in each real country in the option 1 list.
        for country_name in option1_country_names:
            for program in country_programs[country_name]:
                try:
                    top_level = Level.objects.get(parent=None, program=program)
                except Level.DoesNotExist:
                    print(f"Could not add indicator to {country_name}: {program.name} because RF doesn't exist.")
                    continue
                indicator_name = 'Number of people reached in fiscal year'
                i_created = self.create_indicator(indicator_name, program, top_level, 1)
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

        # The do option2 - a dummy country with one dummy program per participating country and an
        # indicator for each program in that country.
        for country_name in option3_country_names:
            dummy_program, created = Program.objects.get_or_create(name=f'Participant Count {country_name}', defaults={
                'funding_status': 'Funded',
                'reporting_period_start': program_start_date,
                'reporting_period_end': program_end_date,
            })
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

            for real_program in country_programs[country_name]:
                indicator_name = f'Number of people reached in fiscal year in {real_program.name}'
                i_created = self.create_indicator(indicator_name, dummy_program, top_level, 3)
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


        print(f"{metrics['program_created']} programs were created in the dummy country, {metrics['program_existed']} already existed.")
        print(f"{metrics['dates_created']} reporting period dates were created.")
        print(f"{metrics['rf_created']} programs needed a result framework level added.")
        for country_name in metrics['indicator_created']:
            print(f"{metrics['indicator_created'][country_name]} indicators were created in {country_name}.")
        for country_name in metrics['indicator_existed']:
            print(f"{metrics['indicator_existed'][country_name]} indicators already existed in {country_name}.")

    @staticmethod
    def create_indicator(name, program, top_level, option_number):
        definition_text = (
            "Participants are defined as “all people who have received tangible benefit – directly "
            "or indirectly from the project.” We distinguish between direct and indirect:\n\n"
            "Direct participants – are those who have received a tangible benefit from the program, "
            "either as the actual program participants or the intended recipients of the program benefits. "
            "This means individuals or communities.\n\n"
            "Indirect participants – are those who received a tangible benefit through their proximity to "
            "or contact with program participants or activities.")
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

        indicator, created = Indicator.objects.get_or_create(
            name=name,
            program=program,
            defaults={
                'program': program,
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
        )

        indicator.indicator_type.add(IndicatorType.objects.get(indicator_type="Custom"))
        if option_number == 1 and created:
            indicator.target_frequency = 8
            indicator.lop_target = 2
            indicator.save()
            PeriodicTarget.objects.get_or_create(
                period='FY2021', target=1, customsort=0, indicator=indicator)
            PeriodicTarget.objects.get_or_create(
                period='FY2022', target=1, customsort=1, indicator=indicator)

        if option_number == 3 and created:
            indicator.target_frequency = 3
            indicator.lop_target = 2
            indicator.save()
            PeriodicTarget.objects.get_or_create(
                period='Year 1', target=1, customsort=0, indicator=indicator, start_date=date(2020, 7, 1),
                end_date=date(2021, 6, 30))
            PeriodicTarget.objects.get_or_create(
                period='Year 2', target=1, customsort=1, indicator=indicator, start_date=date(2021, 7, 1),
                end_date=date(2022, 6, 30))

        return created
