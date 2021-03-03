import json
from django.conf import settings
from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.contrib.auth.models import User
from django.db.models.deletion import Collector
from django.db.models import Q, prefetch_related_objects

from workflow.models import TolaUser, Program
from indicators.models import Result, Indicator, LevelTierTemplate, LevelTier
from tola_management.models import (
    CountryAdminAuditLog, OrganizationAdminAuditLog, ProgramAdminAuditLog, UserManagementAuditLog)
from django.db import connection
from django.db.models import F


class Command(BaseCommand):
    help = """
        Gets the GAIT program start and end dates from mcapi.
        """

    def add_arguments(self, parser):
        parser.add_argument(
            '--send_email',
            action='store_true',
            help='Default: False.  Send an email of the report output, assuming the health check fails in some way')

    def handle(self, *args, **options):

        # Get mismatched tiers and custom templates (e.g. LevelTierTemplate.names != list of Program.level_tiers)
        standard_tiers = [
            json.dumps([str(tier) for tier in template['tiers']]) for template in LevelTier.get_templates().values()]
        programs = Program.rf_aware_all_objects\
            .filter(using_results_framework=True)\
            .prefetch_related('level_tier_templates')\
            .annotate(custom_tiers=F('level_tier_templates__names'))

        template_mismatches = []
        for program in programs:
            # custom_template = LevelTierTemplate.objects.filter(program=program)
            if not program.custom_tiers:
                continue

            tiers = list(program.level_tiers.values_list('name', flat=True))
            if json.dumps(tiers) in standard_tiers:
                continue

            if program.custom_tiers != tiers:
                template_mismatches.append((program, tiers))

        # Get missing auth users and tola users
        auth_users_no_tola = User.objects.filter(tola_user__isnull=True).order_by('date_joined')
        auth_users_no_tola_with_deps = get_related_objects(auth_users_no_tola)
        tola_users_no_auth = TolaUser.objects.filter(user__isnull=True)
        tola_users_no_auth_with_deps = get_related_objects(tola_users_no_auth)

        # Get results where the indicator attached directly to the result doesn't match the indicator
        # the periodic target is assigned to
        results_indicator_mismatches = []
        all_results = Result.objects.all().select_related('indicator', 'periodic_target')
        for result in all_results:
            if result.periodic_target and result.indicator_id != result.periodic_target.indicator_id:
                results_indicator_mismatches.append(result)

        # Get audit log entries where foreign key objects have been deleted
        country_logs_with_deleted_fields = CountryAdminAuditLog.objects \
            .filter(Q(admin_user__isnull=True) | Q(country__isnull=True))

        org_logs_with_deleted_fields = OrganizationAdminAuditLog.objects \
            .filter(Q(admin_user__isnull=True) | Q(organization__isnull=True))

        prog_logs_with_deleted_fields = ProgramAdminAuditLog.objects \
            .filter(Q(admin_user__isnull=True) | Q(program__isnull=True))

        # Look for missing fields as long as they're not
        user_logs_with_deleted_fields = UserManagementAuditLog.objects \
            .filter(
                (Q(admin_user__isnull=True) | Q(modified_user__isnull=True))
                & ~Q(change_type='user_created')
                & ~Q(previous_entry='[]')
            )

        # todo: do a weekly and daily
        # todo: counts top, detail at bottom
        # todo: email to slack

        report = ''
        report += f'Count of auth users with missing Tola Users: {len(auth_users_no_tola)}\n'
        if len(auth_users_no_tola_with_deps) > 0:
            report += 'Of these, the following auth users have linked objects:\n'
            report += '\n'.join(auth_users_no_tola_with_deps) + '\n'
        else:
            report += 'None of them had linked objects.\n'

        report += f'\nCount of Tola users with missing auth users: {len(tola_users_no_auth)}\n'
        if len(tola_users_no_auth_with_deps) > 0:
            report += 'Of these, the following tola users had linked objects:\n'
            report += '\n'.join(tola_users_no_auth_with_deps)
        else:
            report += 'None of them had linked objects.\n'

        report += '\nNo problems were found with the user data\n' \
            if sum([len(auth_users_no_tola), len(auth_users_no_tola)]) == 0 else ''

        if len(results_indicator_mismatches) > 0:
            prefetch_related_objects(
                results_indicator_mismatches, 'periodic_target__indicator', 'periodic_target__indicator__program')
            for result in results_indicator_mismatches:
                if result.periodic_target and result.indicator_id != result.periodic_target.indicator_id:
                    direct_indicator = Indicator.objects.get(pk=result.indicator_id)
                    indirect_indicator = Indicator.objects.get(pk=result.periodic_target.indicator_id)
                    report += f'\nResult id {result.id} has mismatched indicators.\n'
                    report += f'It is connected directly to Indicator "{direct_indicator.name[:30]}..." (id={direct_indicator.id})  '
                    report += f'Program: "{str(direct_indicator.program)[:30]}..." (id={direct_indicator.program.pk})\n'
                    report += f'It is connected through the periodic target to Indicator "{indirect_indicator.name[:30]}.."  '
                    report += f'(Program: "{str(indirect_indicator.program)[:30]}..." (id={direct_indicator.program.pk})\n\n'
        else:
            report += '\nNo problems were found with the result data'

        report += "\n"
        if len(country_logs_with_deleted_fields) > 0:
            report += "\nCountryAuditLog ids missing data: "
            report += str([entry.pk for entry in country_logs_with_deleted_fields]) + "\n"
        else:
            report += "\nNo problems were found with the Country Admin Audit Log\n"

        if len(org_logs_with_deleted_fields) > 0:
            report += "\nOrganizationAuditLog ids missing data: "
            report += str([entry.pk for entry in org_logs_with_deleted_fields]) + "\n"
        else:
            report += "\nNo problems were found with the Organization Admin Audit Log\n"

        if len(prog_logs_with_deleted_fields) > 0:
            report += "\nProgramAdminAuditLog ids missing data: "
            report += str([entry.pk for entry in prog_logs_with_deleted_fields]) + "\n"
        else:
            report += "\nNo problems were found with the Program Admin Audit Log\n"

        if len(user_logs_with_deleted_fields) > 0:
            report += "\nUserManagementLog ids missing data: "
            report += str([entry.pk for entry in user_logs_with_deleted_fields]) + "\n"
        else:
            report += "\nNo problems were found with the User Management Audit Log\n"

        if len(template_mismatches) > 0:
            report += "\nMismatched custom templates and LevelTiers: "
            report += '\n'.join(
                [f'{program.name} ({program.id})\ntiers: {tiers}\ncustom template tiers: {program.custom_tiers}'
                 for program, tiers in template_mismatches]) + "\n"
        else:
            report += "\nNo problems with mismatched custom tiers\n"


        if settings.NOTIFICATION_RECIPIENT:
            send_mail(
                subject="DB Health Check", message=report, from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.NOTIFICATION_RECIPIENT], fail_silently=False)

        print(report)


def get_related_objects(model_objects):
    has_related_models = []
    for obj in model_objects:
        collector = Collector(using='default')
        collector.collect([obj])
        if len(collector.dependencies) > 0:
            has_related_models.append(obj)
    return has_related_models
