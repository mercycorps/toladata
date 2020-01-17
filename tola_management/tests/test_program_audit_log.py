
from datetime import date
import json
from unittest import skip

from django import test
from factories import (
    workflow_models as w_factories,
    indicators_models as i_factories
)
from tola_management.models import ProgramAuditLog
from indicators.models import Indicator, Result, DisaggregatedValue


class TestResultAuditLog(test.TestCase):

    def setUp(self):
        self.country = w_factories.CountryFactory(country="Test Country", code="TC")
        self.program = w_factories.RFProgramFactory(name="Test Program")
        self.program.country.add(self.country)
        self.disagg_type = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Test Disagg Type",
            labels=[f"DisaggLabel{i}" for i in range(5)],
            country=self.country
        )
        self.disagg_labels = self.disagg_type.disaggregationlabel_set.all()

        self.tola_user = w_factories.TolaUserFactory(country=self.country)
        w_factories.grant_country_access(self.tola_user, self.country, 'basic_admin')
        w_factories.grant_program_access(self.tola_user, self.program, self.country, role='high')
        self.client.force_login(user=self.tola_user.user)

    def test_audit_save(self):
        indicator = i_factories.RFIndicatorFactory(targets=20, program=self.program)
        target = indicator.periodictargets.first()
        result_data = {
            'achieved': 5,
            'target': target.id,
            'date_collected': self.program.reporting_period_start,
            'indicator': indicator.id
        }

        # Audit log entry should be triggered by result creation
        response_create = self.client.post(
            f'/indicators/result_add/{indicator.id}/', result_data, **{'HTTP_X_REQUESTED_WITH': 'XMLHttpRequest'})
        result = indicator.result_set.first()
        audits = ProgramAuditLog.objects.all()
        self.assertEqual(response_create.status_code, 200)
        self.assertEqual(result.achieved, 5)
        self.assertEqual(audits.count(), 1)

        # Audit log entry should be triggered by result update
        result_data.update({'result': result.id, 'achieved': 6})
        response_update = self.client.post(
            f'/indicators/result_update/{result.id}/', result_data, **{'HTTP_X_REQUESTED_WITH': 'XMLHttpRequest'})

        result = indicator.result_set.first()
        audits = ProgramAuditLog.objects.all()
        self.assertEqual(response_update.status_code, 200)
        self.assertEqual(result.achieved, 6)
        self.assertEqual(audits.count(), 2)

    def test_disaggregation_display_data(self):
        indicator = i_factories.RFIndicatorFactory(
            targets=20, program=self.program, target_frequency=Indicator.ANNUAL)
        indicator.disaggregation.add(self.disagg_type)
        target = indicator.periodictargets.first()
        result_data = {
            'achieved': 18,
            'periodic_target': target,
            'date_collected': target.start_date,
            'indicator': indicator
        }
        result = Result.objects.create(**result_data)
        ProgramAuditLog.log_result_created(self.tola_user.user, indicator, result)
        creation_log = ProgramAuditLog.objects.all().order_by('-pk')[0]
        diff_list = creation_log.diff_list
        diff_keys = set([diff['name'] for diff in diff_list])
        self.assertSetEqual(
            diff_keys, set(result.logged_fields.keys()),
            "Result creation should log all tracked fields, whether a value has been entered for the field or not"
        )

        result_create_data = result.logged_fields
        indexes = [0, 2, 4]
        for label in [list(self.disagg_labels)[i] for i in indexes]:
            DisaggregatedValue.objects.create(
                category=label,
                value=(result.achieved/len(indexes)),
                result=result
            )
        ProgramAuditLog.log_result_updated(
            self.tola_user.user, indicator, result_create_data, result.logged_fields, 'abcdefg'
        )
        update_log = ProgramAuditLog.objects.all().order_by('-pk')[0]
        diff_list = update_log.diff_list
        diff_keys = [diff["name"] for diff in diff_list]
        self.assertSetEqual(
            set(diff_keys), {'disaggregation_values', 'value'},
            "Result value and disaggregation values should both be present when only disaggregation values have changed"
        )
        disagg_values = ""
        for diff in diff_list:
            if diff['name'] == "disaggregation_values":
                disagg_values = diff
                break

        self.assertEqual(
            len(disagg_values['prev']), len(indexes),
            "Only the disaggregation values that have changed should appear in the diff list"
        )

    @skip
    def test_result_log_sorting(self):
        pass

    def test_logged_field_order_counts(self):
        # The fields being tracked in the audit log (which is determined by a property of the model) should always
        # be present in the logged field order list (which is also a property of the model). The logged field
        # order list may contain more fields than are currently tracked because the models may change over time.
        models_to_test = [
            i_factories.IndicatorFactory(),
            i_factories.ResultFactory(),
            i_factories.LevelFactory(),
        ]

        for model in models_to_test:
            logged_field_set = set(model.logged_fields.keys())
            logged_fields_order_set = set(model.logged_field_order())
            self.assertEqual(len(logged_field_set - logged_fields_order_set), 0)
