# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import json
import itertools
from django.core.serializers.json import DjangoJSONEncoder
from django.db import models
from django.utils.translation import ugettext as _

from workflow.models import (
    TolaUser,
    Organization,
    Program,
)

from indicators.models import (
    Indicator,
    Level
)

def diff(previous, new, mapping):
    diff_list = []
    p = previous
    n = new
    for (p_field, n_field) in itertools.zip_longest(p.keys(), n.keys()):
        if p_field and p_field not in n:
            diff_list.append({
                "name": p_field,
                "pretty_name": mapping.get(p_field, p_field),
                "prev": p[p_field],
                "new": ''
            })

        if n_field and n_field not in p:
            diff_list.append({
                "name": n_field,
                "pretty_name": mapping.get(n_field, n_field),
                "prev": '',
                "new": n[n_field]
            })

        if n_field in p and p_field in n and n[p_field] != p[n_field]:
            diff_list.append({
                "name": n_field,
                "pretty_name": mapping.get(n_field, n_field),
                "prev": p[p_field],
                "new": n[n_field]
            })
    return diff_list


class DiffableLog:
    @property
    def diff_list(self):
        p = {}
        if self.previous_entry:
            p = json.loads(self.previous_entry)

        n = {}
        if self.new_entry:
            n = json.loads(self.new_entry)

        diff_list = diff(p, n, self.field_map)

        return diff_list


class UserManagementAuditLog(models.Model, DiffableLog):
    date = models.DateTimeField(_('Modification Date'), auto_now_add=True)
    admin_user = models.ForeignKey(TolaUser, null=True, on_delete=models.SET_NULL, related_name="+")
    modified_user = models.ForeignKey(TolaUser, null=True, on_delete=models.SET_NULL, related_name="+")
    change_type = models.CharField(_('Modification Type'), max_length=255)
    previous_entry = models.TextField()
    new_entry = models.TextField()

    @property
    def field_map(self):
        return {
            "title": _("Title"),
            "name": _("Name"),
            "first_name": _("First Name"),
            "last_name": _("Last Name"),
            "user": _("Username"),
            "mode_of_address": _("Mode of Address"),
            "mode_of_contact": _("Mode of Contact"),
            "phone_number": _("Phone Number"),
            "email": _("Email"),
            "organization": _("Organization"),
            "active": _("Is Active")
        }

    @property
    def change_type_map(self):
        return {
            "user_created": _("User Created"),
            "user_programs_updated": _("User Programs Updated"),
            "user_profile_updated": _("User Profile Updated")
        }

    @property
    def pretty_change_type(self):
        return self.change_type_map.get(self.change_type, self.change_type)

    @property
    def diff_list(self):

        if self.change_type == 'user_programs_updated':

            p = {}
            if self.previous_entry:
                p = json.loads(self.previous_entry)

            n = {}
            if self.new_entry:
                n = json.loads(self.new_entry)

            def access_diff(p, n):
                diff_list = []
                for (p_field, n_field) in itertools.zip_longest(p.keys(), n.keys()):
                    if p_field and p_field not in n:
                        diff_list.append({
                            "name": p_field,
                            "prev": p[p_field],
                            "new": {k: 'N/A' for k, _ in p[p_field].items()},
                        })

                    if n_field and n_field not in p:
                        diff_list.append({
                            "name": n_field,
                            "prev": {k: 'N/A' for k, _ in n[n_field].items()},
                            "new": n[n_field]
                        })

                    if n_field in p and p_field in n and n[p_field] != p[n_field]:
                        diff_list.append({
                            "name": n_field,
                            "prev": p[p_field],
                            "new": n[n_field]
                        })

                return diff_list

            countries_diff = access_diff(p["countries"], n["countries"])
            programs_diff = access_diff(p["programs"], n["programs"])

            return {
                "countries": countries_diff,
                "programs": programs_diff
            }
        else:
            return super(UserManagementAuditLog, self).diff_list

    @classmethod
    def created(cls, user, created_by, entry):
        new_entry = json.dumps(entry)
        entry = cls(
            admin_user=created_by,
            modified_user=user,
            change_type="user_created",
            new_entry=new_entry,
        )
        entry.save()

    @classmethod
    def programs_updated(cls, user, changed_by, old, new):
        old = json.dumps(old)
        new = json.dumps(new)
        if old != new:
            entry = cls(
                admin_user=changed_by,
                modified_user=user,
                change_type="user_programs_updated",
                previous_entry=old,
                new_entry=new,
            )
            entry.save()

    @classmethod
    def profile_updated(cls, user, changed_by, old, new):
        old = json.dumps(old)
        new = json.dumps(new)
        if old != new:
            entry = cls(
                admin_user=changed_by,
                modified_user=user,
                change_type="user_profile_updated",
                previous_entry=old,
                new_entry=new,
            )
            entry.save()


class ProgramAuditLog(models.Model, DiffableLog):
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name="audit_logs")
    date = models.DateTimeField(_('Modification Date'), auto_now_add=True)
    user = models.ForeignKey(TolaUser, null=True, on_delete=models.SET_NULL, related_name="+")
    organization = models.ForeignKey(Organization, null=True, on_delete=models.SET_NULL, related_name="+")
    indicator = models.ForeignKey(Indicator, null=True, on_delete=models.SET_NULL, related_name="+")
    level = models.ForeignKey(Level, null=True, on_delete=models.SET_NULL, related_query_name="+")
    change_type = models.CharField(_('Modification Type'), max_length=255)
    previous_entry = models.TextField(null=True, blank=True)
    new_entry = models.TextField(null=True, blank=True)
    rationale = models.TextField(null=True)

    @property
    def field_map(self):
        return {
            "name": _("Name"),
            "unit_of_measure": _("Unit of Measure"),
            "unit_of_measure_type": _("Unit of Measure Type"),
            "is_cumulative": _("Is Cumulative"),
            "lop_target": _("LOP Target"),
            "direction_of_change": _("Direction of Change"),
            "rationale_for_target": _("Rationale for Target"),
            "baseline_value": _("Baseline"),
            "baseline_na": _("Baseline N/A"),
            "evidence_url": _('Evidence Url'),
            "evidence_name": _('Evidence Name'),
            "date": _('Date'),
            "target": _('Target'),
            "value": _('Value'),
            "start_date": _('Start Date'),
            "end_date": _('End Date'),
            "assumptions": _('Assumptions'),
        }

    @property
    def change_type_map(self):
        return {
            "indicator_created": _("Indicator Created"),
            "indicator_changed": _('Indicator Changed'),
            "indicator_deleted": _('Indicator Deleted'),
            "result_changed": _('Result Changed'),
            "result_created": _('Result Created'),
            "result_deleted": _('Result Deleted'),
            "program_dates_changed": _('Program Dates Changed'),
            "level_changed": _('Result Level Changed'),
        }

    @property
    def unit_of_measure_type_map(self):
        return {
            1: _("Number"),
            2: _("Percentage")
        }

    @property
    def direction_of_change_map(self):
        return {
            1: _("N/A"),
            2: _("Increase (+)"),
            3: _("Decrease (-)"),
        }

    @property
    def pretty_change_type(self):
        return self.change_type_map.get(self.change_type, self.change_type)

    @property
    def diff_list(self):
        diff_list = super(ProgramAuditLog, self).diff_list
        null_text = ''
        for diff in diff_list:
            if diff["name"] == 'unit_of_measure_type':
                diff["prev"] = self.unit_of_measure_type_map.get(diff["prev"], diff["prev"])
                diff["new"] = self.unit_of_measure_type_map.get(diff["new"], diff["new"])
            elif diff["name"] == 'direction_of_change':
                diff["prev"] = self.direction_of_change_map.get(diff["prev"], diff["prev"])
                diff["new"] = self.direction_of_change_map.get(diff["new"], diff["new"])
            elif diff["name"] == 'targets' or diff["name"] == 'disaggregation_values':
                if diff["prev"] == null_text:
                    diff["prev"] = {
                        n["id"]: {"name": n.get("name"), "value": null_text, "id": n["id"]} for k, n in diff["new"].items()
                    }
                    continue

                if diff["new"] == null_text:
                    diff["new"] = {
                        p["id"]: {
                            "name": p.get("name"), "value": null_text, "id": p["id"]} for k, p in diff["prev"].items()
                    }
                    continue

                prev = {}
                new = {}
                for (prev_id, new_id) in itertools.zip_longest(diff["prev"].keys(), diff["new"].keys()):
                    if prev_id and prev_id not in diff["new"]:
                        new[prev_id] = {
                            "name": diff["prev"][prev_id].get('name'),
                            "value": null_text,
                            "id": diff["prev"][prev_id].get('id')
                        }

                        prev[prev_id] = {
                            "name": diff["prev"][prev_id].get('name'),
                            "value": diff["prev"][prev_id].get('value'),
                            "id": diff["prev"][prev_id].get('id')
                        }

                    if new_id and new_id not in diff["prev"]:
                        prev[new_id] = {
                            "name": diff["new"][new_id].get('name'),
                            "value": null_text,
                            "id": diff["new"][new_id].get('id')
                        }

                        new[new_id] = {
                            "name": diff["new"][new_id].get('name'),
                            "value": diff["new"][new_id].get('value'),
                            "id": diff["new"][new_id].get('id')
                        }

                    if new_id in diff["prev"] and diff["prev"][new_id]["value"] != diff["new"][new_id]["value"]:
                        new[new_id] = {
                            "name": diff["new"][new_id].get('name'),
                            "value": diff["new"][new_id].get('value'),
                            "id": diff["new"][new_id].get('id')
                        }
                        prev[new_id] = {
                            "name": diff["prev"][new_id].get('name'),
                            "value": diff["prev"][new_id].get('value'),
                            "id": diff["prev"][new_id].get('id')
                        }

                    if prev_id in diff["new"] and diff["prev"][prev_id]["value"] != diff["new"][prev_id]["value"]:
                        new[prev_id] = {
                            "name": diff["new"][prev_id].get('name'),
                            "value": diff["new"][prev_id].get('value'),
                            "id": diff["new"][prev_id].get('id')
                        }
                        prev[prev_id] = {
                            "name": diff["prev"][prev_id].get('name'),
                            "value": diff["prev"][prev_id].get('value'),
                            "id": diff["prev"][prev_id].get('id')
                        }

                diff["prev"] = prev
                diff["new"] = new

        return diff_list

    @staticmethod
    def log_indicator_created(user, created_indicator, rationale):
        new_program_log_entry = ProgramAuditLog(
            program=created_indicator.program,
            user=user.tola_user,
            organization=user.tola_user.organization,
            indicator=created_indicator,
            change_type="indicator_created",
            rationale=rationale,
            previous_entry=None,
            new_entry=json.dumps(created_indicator.logged_fields, cls=DjangoJSONEncoder),
        )
        new_program_log_entry.save()

    @staticmethod
    def log_indicator_deleted(user, deleted_indicator, deleted_indicator_values, rationale):
        new_program_log_entry = ProgramAuditLog(
            program=deleted_indicator.program,
            user=user.tola_user,
            organization=user.tola_user.organization,
            indicator=deleted_indicator,
            change_type="indicator_deleted",
            rationale=rationale,
            previous_entry=json.dumps(deleted_indicator_values, cls=DjangoJSONEncoder),
            new_entry=None
        )
        new_program_log_entry.save()

    @staticmethod
    def log_indicator_updated(user, indicator, old_indicator_values, new_indicator_values, rationale):
        previous_entry_json = json.dumps(old_indicator_values, cls=DjangoJSONEncoder)
        new_entry_json = json.dumps(new_indicator_values, cls=DjangoJSONEncoder)
        if new_entry_json != previous_entry_json:
            # Don't prevent user from saving if the UI is out of sync with the DB,
            # or dummy PT LoP only value != indicator LoP target
            if rationale == '':
                # raise Exception('rationale string missing when saving change to indicator audit log')
                rationale = _('No reason for change required.')

            new_program_log_entry = ProgramAuditLog(
                program=indicator.program,
                user=user.tola_user,
                organization=user.tola_user.organization,
                indicator=indicator,
                change_type="indicator_changed",
                rationale=rationale,
                previous_entry=previous_entry_json,
                new_entry=new_entry_json
            )
            new_program_log_entry.save()

    @staticmethod
    def log_result_created(user, indicator, created_result):
        new_program_log_entry = ProgramAuditLog(
            program=indicator.program,
            user=user.tola_user,
            organization=user.tola_user.organization,
            indicator=indicator,
            change_type="result_created",
            rationale='N/A',
            previous_entry=None,
            new_entry=json.dumps(created_result.logged_fields, cls=DjangoJSONEncoder)
        )
        new_program_log_entry.save()

    @staticmethod
    def log_result_deleted(user, indicator, deleted_result_values, rationale):
        new_program_log_entry = ProgramAuditLog(
            program=indicator.program,
            user=user.tola_user,
            organization=user.tola_user.organization,
            indicator=indicator,
            change_type="result_deleted",
            rationale=rationale,
            previous_entry=json.dumps(deleted_result_values, cls=DjangoJSONEncoder),
            new_entry=None,
        )
        new_program_log_entry.save()

    @staticmethod
    def log_result_updated(user, indicator, old_result_values, new_result_values, rationale):
        previous_entry_json = json.dumps(old_result_values, cls=DjangoJSONEncoder)
        new_entry_json = json.dumps(new_result_values, cls=DjangoJSONEncoder)
        if previous_entry_json != new_entry_json:
            new_program_log_entry = ProgramAuditLog(
                program=indicator.program,
                user=user.tola_user,
                organization=user.tola_user.organization,
                indicator=indicator,
                change_type="result_changed",
                rationale=rationale,
                previous_entry=previous_entry_json,
                new_entry=new_entry_json
            )
            new_program_log_entry.save()

    @staticmethod
    def log_program_dates_updated(user, program, old_dates, new_dates, rationale):
        previous_entry_json = json.dumps(old_dates, cls=DjangoJSONEncoder)
        new_entry_json = json.dumps(new_dates, cls=DjangoJSONEncoder)
        if previous_entry_json != new_entry_json:
            new_program_log_entry = ProgramAuditLog(
                program=program,
                user=user.tola_user,
                organization=user.tola_user.organization,
                indicator=None,
                change_type="program_dates_changed",
                rationale=rationale,
                previous_entry=previous_entry_json,
                new_entry=new_entry_json
            )
            new_program_log_entry.save()

    @staticmethod
    def log_result_level_updated(user, level, old_level_values, new_level_values, rationale):
        previous_entry_json = json.dumps(old_level_values, cls=DjangoJSONEncoder)
        new_entry_json = json.dumps(new_level_values, cls=DjangoJSONEncoder)
        if new_entry_json != previous_entry_json:
            if rationale == '':
                rationale = _('No reason for change required.')

            new_program_log_entry = ProgramAuditLog(
                program=level.program,
                user=user.tola_user,
                organization=user.tola_user.organization,
                level=level,
                change_type="level_changed",
                rationale=rationale,
                previous_entry=previous_entry_json,
                new_entry=new_entry_json
            )
            new_program_log_entry.save()


class ProgramAdminAuditLog(models.Model, DiffableLog):
    date = models.DateTimeField(_('Modification Date'), auto_now_add=True)
    admin_user = models.ForeignKey(TolaUser, null=True, on_delete=models.SET_NULL, related_name="+")
    program = models.ForeignKey(Program, null=True, on_delete=models.SET_NULL, related_name="+")
    change_type = models.CharField(_('Modification Type'), max_length=255)
    previous_entry = models.TextField()
    new_entry = models.TextField()

    @property
    def field_map(self):
        return {
            'gaitid': _("GAIT ID"),
            'name': _("Name"),
            'funding_status': _("Funding Status"),
            'cost_center': _("Cost Center"),
            'description': _("Description"),
            'sectors': _("Sectors"),
            'countries': _("Countries")
        }

    @property
    def change_type_map(self):
        return {
            "program_created": _("Program Created"),
            "program_updated": _("Program Updated"),
        }

    @property
    def pretty_change_type(self):
        return self.change_type_map.get(self.change_type, self.change_type)

    @classmethod
    def created(cls, program, created_by, entry):
        new_entry = json.dumps(entry)
        entry = cls(
            admin_user=created_by,
            program=program,
            change_type="program_created",
            new_entry=new_entry,
        )
        entry.save()

    @classmethod
    def updated(cls, program, changed_by, old, new):
        old = json.dumps(old)
        new = json.dumps(new)
        if old != new:
            entry = cls(
                admin_user=changed_by,
                program=program,
                change_type="program_updated",
                previous_entry=old,
                new_entry=new,
            )
            entry.save()

class OrganizationAdminAuditLog(models.Model, DiffableLog):
    date = models.DateTimeField(_('Modification Date'), auto_now_add=True)
    admin_user = models.ForeignKey(TolaUser, null=True, on_delete=models.SET_NULL, related_name="+")
    organization = models.ForeignKey(Organization, null=True, on_delete=models.SET_NULL, related_name="+")
    change_type = models.CharField(_('Modification Type'), max_length=255)
    previous_entry = models.TextField()
    new_entry = models.TextField()

    @property
    def field_map(self):
        return {
            "name": _("Name"),
            "primary_address": _("Primary Address"),
            "primary_contact_name": _("Primary Contact Name"),
            "primary_contact_email": _("Primary Contact Email"),
            "primary_contact_phone": _("Primary Contact Phone"),
            "mode_of_contact": _("Mode of Contact"),
            "is_active": _("Is Active"),
            "sectors": _("Sectors")
        }

    @property
    def change_type_map(self):
        return {
            "organization_created": _("Organization Created"),
            "organization_updated": _("Organization Updated"),
        }

    @property
    def pretty_change_type(self):
        return self.change_type_map.get(self.change_type, self.change_type)

    @classmethod
    def created(cls, organization, created_by, entry):
        new_entry = json.dumps(entry)
        entry = cls(
            admin_user=created_by,
            organization=organization,
            change_type="organization_created",
            new_entry=new_entry,
        )
        entry.save()

    @classmethod
    def updated(cls, organization, changed_by, old, new):
        old = json.dumps(old)
        new = json.dumps(new)
        if old != new:
            entry = cls(
                admin_user=changed_by,
                organization=organization,
                change_type="organization_updated",
                previous_entry=old,
                new_entry=new,
            )
            entry.save()
