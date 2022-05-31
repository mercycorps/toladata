from django.core.management.base import BaseCommand
from django.db.utils import IntegrityError
from indicators.models import LevelTier


class Command(BaseCommand):
    """
    Command to resolve errors related to a RF program missing level tiers
    """
    help = "Creates level tiers for Nawiri"

    def add_arguments(self, parser):
        parser.add_argument('--execute', action='store_true', help='Without this flag, the command will only be a dry run')

    def handle(self, *args, **options):
        program_id = 819
        level_tiers = [
            {'name': 'Goal', 'tier_depth': 1, 'program_id': program_id},
            {'name': 'Outcome', 'tier_depth': 2, 'program_id': program_id},
            {'name': 'Output', 'tier_depth': 3, 'program_id': program_id},
            {'name': 'Activity', 'tier_depth': 4, 'program_id': program_id},
        ]

        for level_tier in level_tiers:
            if options['execute']:
                try:
                    new_level_tier = LevelTier(**level_tier)
                    new_level_tier.save()
                    print(f'Created level {level_tier["name"]}')
                except IntegrityError:
                    # IntegrityError is raised if the unique constraint fails
                    continue
