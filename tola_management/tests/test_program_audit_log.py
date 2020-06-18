import json
from decimal import Decimal
from django import test
from django.urls import reverse
from django.core.exceptions import ValidationError
from factories import (
    workflow_models as w_factories,
    indicators_models as i_factories
)
from tola_management.models import ProgramAuditLog
from indicators.models import Indicator, Result, DisaggregatedValue
from workflow.models import COUNTRY_ROLE_CHOICES


class TestResultAuditLog(test.TestCase):

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.country = w_factories.CountryFactory(country="Test Country", code="TC")
        cls.program = w_factories.RFProgramFactory(name="Test Program")
        cls.program.country.add(cls.country)
        cls.label_count = 5
        cls.disagg_type = i_factories.DisaggregationTypeFactory(
            disaggregation_type="Test Disagg Type",
            labels=[f"DisaggLabel{i}" for i in range(cls.label_count)],
            country=cls.country
        )
        cls.disagg_labels = cls.disagg_type.disaggregationlabel_set.order_by("id")
        cls.tola_user = w_factories.TolaUserFactory(country=cls.country)
        w_factories.grant_country_access(cls.tola_user, cls.country, 'basic_admin')
        w_factories.grant_program_access(cls.tola_user, cls.program, cls.country, role='high')
        cls.indicator = i_factories.RFIndicatorFactory(targets=20, program=cls.program)

    def setUp(self):
        self.client.force_login(user=self.tola_user.user)

    def test_audit_save(self):
        target = self.indicator.periodictargets.first()
        result_data = {
            'achieved': 5,
            'target': target.id,
            'date_collected': self.program.reporting_period_start,
            'indicator': self.indicator.id
        }

        # Audit log entry should be triggered by result creation
        response = self.client.post(
            f'/indicators/result_add/{self.indicator.id}/', result_data, **{'HTTP_X_REQUESTED_WITH': 'XMLHttpRequest'})
        result = self.indicator.result_set.first()
        audits = ProgramAuditLog.objects.all()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(result.achieved, 5)
        self.assertEqual(audits.count(), 1)

        # Audit log entry should be triggered by result update
        result_data.update({'result': result.id, 'achieved': 6})
        response_update = self.client.post(
            f'/indicators/result_update/{result.id}/', result_data, **{'HTTP_X_REQUESTED_WITH': 'XMLHttpRequest'})
        result.refresh_from_db()
        audits = ProgramAuditLog.objects.all()
        self.assertEqual(response_update.status_code, 200)
        self.assertEqual(result.achieved, 6)
        self.assertEqual(audits.count(), 2)

    def test_audit_number_format(self):
        """
        Now test that the audit log values are stored property (i.e. with the right number
        of decimal places, not as exponents, etc...
        """
        target = self.indicator.periodictargets.first()
        result_data = {
            'achieved': 7,
            'target': target.id,
            'date_collected': self.program.reporting_period_start,
            'indicator': self.indicator.id
        }
        response = self.client.post(
            f'/indicators/result_add/{self.indicator.id}/',
            result_data,
            **{'HTTP_X_REQUESTED_WITH': 'XMLHttpRequest'})
        result = self.indicator.result_set.first()
        self.assertEqual(response.status_code, 200)
        result_data.update({'result': result.id, 'achieved': 8.01})
        response = self.client.post(
            f'/indicators/result_update/{result.id}/',
            result_data,
            **{'HTTP_X_REQUESTED_WITH': 'XMLHttpRequest'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(ProgramAuditLog.objects.count(), 2)
        audit = ProgramAuditLog.objects.order_by("id").last()
        previous_entry = json.loads(audit.previous_entry)
        new_entry = json.loads(audit.new_entry)
        self.assertEqual(
            Decimal(previous_entry['value']),
            Decimal("7"),
            "Trailing zeros in prev values should be ignored")
        self.assertEqual(
            Decimal(new_entry['value']),
            Decimal("8.01"),
            "Decimals to two places should be respected in new values")
        self.assertEqual(ProgramAuditLog.objects.count(), 2)

        result_data.update({'result': result.id, 'achieved': 50000.00})
        response = self.client.post(
            f'/indicators/result_update/{result.id}/',
            result_data,
            **{'HTTP_X_REQUESTED_WITH': 'XMLHttpRequest'})
        self.assertEqual(response.status_code, 200)
        audit = ProgramAuditLog.objects.order_by("id").last()
        previous_entry = json.loads(audit.previous_entry)
        new_entry = json.loads(audit.new_entry)
        self.assertEqual(
            Decimal(previous_entry['value']),
            Decimal("8.01"),
            "Decimals to two places should be respected in prev values")
        self.assertEqual(
            Decimal(new_entry['value']),
            Decimal("50000.0"),
            "Values should not be saved as exponents in new values")
        self.assertEqual(ProgramAuditLog.objects.count(), 3)

        result_data.update({'result': result.id, 'achieved': 0.05})
        response = self.client.post(
            f'/indicators/result_update/{result.id}/',
            result_data,
            **{'HTTP_X_REQUESTED_WITH': 'XMLHttpRequest'})
        self.assertEqual(response.status_code, 200)
        audit = ProgramAuditLog.objects.order_by("id").last()
        previous_entry = json.loads(audit.previous_entry)
        new_entry = json.loads(audit.new_entry)
        self.assertEqual(
            Decimal(previous_entry['value']),
            Decimal("50000"),
            "Values should not be saved as exponents in prev values")
        self.assertEqual(
            Decimal(new_entry['value']),
            Decimal(".05"),
            "Values less than one should be saved properly in new values")
        self.assertEqual(ProgramAuditLog.objects.count(), 4)

        result_data.update({'result': result.id, 'achieved': 60000.00})
        response = self.client.post(
            f'/indicators/result_update/{result.id}/',
            result_data,
            **{'HTTP_X_REQUESTED_WITH': 'XMLHttpRequest'})
        self.assertEqual(response.status_code, 200)
        audit = ProgramAuditLog.objects.order_by("id").last()
        previous_entry = json.loads(audit.previous_entry)
        self.assertEqual(
            Decimal(previous_entry['value']),
            Decimal(".05"),
            "Values less than one should be saved properly in prev values")
        self.assertEqual(ProgramAuditLog.objects.count(), 5)

        # Test if disaggregation number formats are correct.
        disagg_values_initial = [50000.00, 9981, 5.55, 14.5, 1.50]
        disagg_values_display = set(Decimal(k) for k in ["50000", "9981", "5.55", "14.5", "1.5"])
        #
        disagg_value_objects = []
        for index, disagg_value in enumerate(disagg_values_initial):
            disagg_value_object = DisaggregatedValue.objects.create(
                result=result,
                category=self.disagg_labels[index],
                value=disagg_value,
            )
            disagg_value_objects.append(disagg_value_object)

        logged_fields = result.logged_fields
        raw_logged_disagg_values = set([disagg['value'] for disagg in logged_fields['disaggregation_values'].values()])
        self.assertSetEqual(disagg_values_display, raw_logged_disagg_values)

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
        ProgramAuditLog.log_result_created(self.tola_user.user, indicator, result, "a rationale")
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


class TestIndicatorAuditLog(test.TestCase):

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.country = w_factories.CountryFactory(country="Test Country", code="TC")
        cls.program = w_factories.RFProgramFactory(name="Test Program")
        cls.program.country.add(cls.country)
        cls.tola_user = w_factories.NewTolaUserFactory(country=cls.country)
        w_factories.grant_country_access(cls.tola_user, cls.country, COUNTRY_ROLE_CHOICES[1][0])

    def test_indicator_create_is_logged(self):
        indicator = i_factories.RFIndicatorFactory(program=self.program)
        ProgramAuditLog.log_indicator_created(
            self.tola_user.user,
            indicator,
            'N/A'
        )
        audits = ProgramAuditLog.objects.all()
        self.assertEqual(audits.count(), 1)
        audit = audits.first()
        self.assertEqual(audit.pretty_change_type, "Indicator created")
        self.assertEqual(audit.rationale_selected_options, [])
        self.assertEqual(audit.rationale, "N/A")

    def test_indicator_update_is_logged_with_just_rationale(self):
        indicator = i_factories.RFIndicatorFactory(
            program=self.program, is_cumulative=True, targets=1000, results=True
        )
        old_indicator_values = indicator.logged_fields
        indicator.is_cumulative = False
        indicator.save()
        ProgramAuditLog.log_indicator_updated(
            self.tola_user.user,
            indicator,
            old_indicator_values,
            indicator.logged_fields,
            "This is a rationale"
        )
        audits = ProgramAuditLog.objects.all()
        self.assertEqual(audits.count(), 1)
        audit = audits.first()
        self.assertEqual(audit.pretty_change_type, "Indicator changed")
        self.assertEqual(audit.rationale_selected_options, [])
        self.assertEqual(audit.rationale, "This is a rationale")

    def test_indicator_update_is_logged_with_rationale_option_other(self):
        indicator = i_factories.RFIndicatorFactory(
            program=self.program, is_cumulative=True, targets=1000, results=True
        )
        old_indicator_values = indicator.logged_fields
        indicator.is_cumulative = False
        indicator.save()
        ProgramAuditLog.log_indicator_updated(
            self.tola_user.user,
            indicator,
            old_indicator_values,
            indicator.logged_fields,
            "This is a rationale",
            rationale_options=[1,]
        )
        audits = ProgramAuditLog.objects.all()
        self.assertEqual(audits.count(), 1)
        audit = audits.first()
        self.assertEqual(audit.pretty_change_type, "Indicator changed")
        self.assertEqual(audit.rationale_selected_options, ["Other",])
        self.assertEqual(audit.rationale, "This is a rationale")

    def test_indicator_update_is_logged_with_non_other_rationale_options(self):
        indicator = i_factories.RFIndicatorFactory(
            program=self.program, is_cumulative=True, targets=1000, results=True
        )
        old_indicator_values = indicator.logged_fields
        indicator.is_cumulative = False
        indicator.save()
        ProgramAuditLog.log_indicator_updated(
            self.tola_user.user,
            indicator,
            old_indicator_values,
            indicator.logged_fields,
            rationale_options=[2,4]
        )
        audits = ProgramAuditLog.objects.all()
        self.assertEqual(audits.count(), 1)
        audit = audits.first()
        self.assertEqual(audit.pretty_change_type, "Indicator changed")
        self.assertEqual(audit.rationale_selected_options, ["Adaptive management", "Changes in context"])
        self.assertIsNone(audit.rationale)

    def test_indicator_update_is_logged_with_rationale_options_and_rationale(self):
        indicator = i_factories.RFIndicatorFactory(
            program=self.program, is_cumulative=True, targets=1000, results=True
        )
        old_indicator_values = indicator.logged_fields
        indicator.is_cumulative = False
        indicator.save()
        ProgramAuditLog.log_indicator_updated(
            self.tola_user.user,
            indicator,
            old_indicator_values,
            indicator.logged_fields,
            rationale="Test rationale",
            rationale_options=[1,3,4]
        )
        audits = ProgramAuditLog.objects.all()
        self.assertEqual(audits.count(), 1)
        audit = audits.first()
        self.assertEqual(audit.pretty_change_type, "Indicator changed")
        self.assertEqual(audit.rationale_selected_options, ["Budget realignment", "Changes in context", "Other"])
        self.assertEqual(audit.rationale, "Test rationale")

    def test_indicator_update_is_logged_with_non_other_rationale_options_and_rationale(self):
        SPECIAL_CHARS = "Test rationale spéçîal chars"
        indicator = i_factories.RFIndicatorFactory(
            program=self.program, is_cumulative=True, targets=1000, results=True
        )
        old_indicator_values = indicator.logged_fields
        indicator.is_cumulative = False
        indicator.save()
        ProgramAuditLog.log_indicator_updated(
            self.tola_user.user,
            indicator,
            old_indicator_values,
            indicator.logged_fields,
            rationale=SPECIAL_CHARS,
            rationale_options=[6,]
        )
        audits = ProgramAuditLog.objects.all()
        self.assertEqual(audits.count(), 1)
        audit = audits.first()
        self.assertEqual(audit.pretty_change_type, "Indicator changed")
        self.assertEqual(audit.rationale_selected_options, ["COVID-19"])
        self.assertEqual(audit.rationale, SPECIAL_CHARS)

    def test_indicator_update_fails_validation(self):
        indicator = i_factories.RFIndicatorFactory(
            program=self.program, is_cumulative=True, targets=1000, results=True
        )
        old_indicator_values = indicator.logged_fields
        indicator.is_cumulative = False
        indicator.save()
        with self.assertRaises(ValidationError) as ve:
            ProgramAuditLog.log_indicator_updated(
                self.tola_user.user,
                indicator,
                old_indicator_values,
                indicator.logged_fields,
                rationale_options=[1]
            )
        self.assertEqual(ve.exception.messages, ["Rationale required when 'Other' selected"])
        with self.assertRaises(ValidationError) as ve2:
            ProgramAuditLog.log_indicator_updated(
                self.tola_user.user,
                indicator,
                old_indicator_values,
                indicator.logged_fields,
            )
        self.assertEqual(ve2.exception.messages, ["Rationale required when no options selected"])

    def test_audit_log_options_display(self):
        options = ProgramAuditLog.reason_for_change_options()
        expected_options = [
            (2, "Adaptive management", False),
            (3, "Budget realignment", False),
            (4, "Changes in context", False),
            (5, "Costed extension", False),
            (6, "COVID-19", False),
            (7, "Donor requirement", False),
            (8, "Implementation delays", False),
            (1, "Other", True)
        ]
        self.assertEqual(options, expected_options)

    def test_audit_log_options_in_view(self):
        indicator = i_factories.RFIndicatorFactory(program=self.program)
        self.client.force_login(user=self.tola_user.user)
        response = self.client.get(reverse('program_page', kwargs={'program': self.program.pk}))
        self.assertIn('js_globals', self.client.session)
        self.assertIn('reason_for_change_options', self.client.session['js_globals'])
        expected_options = json.dumps(
            [{'value': option[0], 'label': option[1], 'rationale_required': option[2]}
             for option in ProgramAuditLog.reason_for_change_options()]
        )
        self.assertJSONEqual(
            self.client.session['js_globals']['reason_for_change_options'],
            expected_options
            )
        self.assertContains(response, 'var reason_for_change_options')


class TestAuditLogRationaleSelectionsDisplay(test.TestCase):

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.country = w_factories.CountryFactory(country="Test Country", code="TC")
        cls.program = w_factories.RFProgramFactory(name="Test Program")
        cls.program.country.add(cls.country)
        cls.tola_user = w_factories.NewTolaUserFactory(country=cls.country)
        w_factories.grant_country_access(cls.tola_user, cls.country, COUNTRY_ROLE_CHOICES[1][0])

    def setUp(self):
        self.indicator = i_factories.RFIndicatorFactory(
            targets=100, program=self.program, results=True, is_cumulative=False
        )
        self.client.force_login(user=self.tola_user.user)

    def get_update_audit_log(self, rationale=None, rationale_options=None):
        old_indicator_values = self.indicator.logged_fields
        self.indicator.is_cumulative = True
        self.indicator.save()
        args = [self.tola_user.user, self.indicator, old_indicator_values, self.indicator.logged_fields]
        kwargs = {}
        if rationale and rationale_options is None:
            args.append(rationale)
        elif rationale:
            kwargs['rationale'] = rationale
        if rationale_options:
            kwargs['rationale_options'] = rationale_options
        ProgramAuditLog.log_indicator_updated(*args, **kwargs)

    def fetch_audit_log_single(self):
        response = self.client.get(reverse('tolamanagementprograms-audit-log', kwargs={'pk': self.program.pk}))
        self.assertIn('results', response.json())
        self.assertEqual(len(response.json()['results']), 1)
        return response.json()['results'][0]

    def test_indicator_create_audit_log(self):
        new_indicator = i_factories.RFIndicatorFactory(program=self.program)
        ProgramAuditLog.log_indicator_created(
            self.tola_user.user,
            new_indicator,
            'N/A'
        )
        result = self.fetch_audit_log_single()
        self.assertEqual(result['pretty_change_type'], 'Indicator created')
        self.assertEqual(result['rationale'], 'N/A')
        self.assertEqual(result['rationale_selected_options'], [])

    def test_indicator_update_audit_log_rationale_string_only(self):
        self.get_update_audit_log("This is a rationale")
        result = self.fetch_audit_log_single()
        self.assertEqual(result['pretty_change_type'], 'Indicator changed')
        self.assertEqual(result['rationale'], 'This is a rationale')
        self.assertEqual(result['rationale_selected_options'], [])

    def test_indicator_update_audit_log_rationale_other_and_string(self):
        self.get_update_audit_log("This is a rationale", [1])
        result = self.fetch_audit_log_single()
        self.assertEqual(result['pretty_change_type'], 'Indicator changed')
        self.assertEqual(result['rationale'], 'This is a rationale')
        self.assertEqual(result['rationale_selected_options'], ['Other'])

    def test_indicator_update_audit_log_rationale_just_option(self):
        self.get_update_audit_log(rationale_options=[3])
        result = self.fetch_audit_log_single()
        self.assertEqual(result['pretty_change_type'], 'Indicator changed')
        self.assertEqual(result['rationale'], None)
        self.assertEqual(result['rationale_selected_options'], ['Budget realignment'])

    def test_indicator_update_audit_log_rationale_multiple_options(self):
        self.get_update_audit_log(rationale_options=[6, 8])
        result = self.fetch_audit_log_single()
        self.assertEqual(result['pretty_change_type'], 'Indicator changed')
        self.assertEqual(result['rationale'], None)
        self.assertEqual(result['rationale_selected_options'], ['COVID-19', 'Implementation delays'])

    def test_indicator_update_audit_log_rationale_multiple_options_and_rationale(self):
        self.get_update_audit_log(rationale="Test rationale", rationale_options=[1, 6])
        result = self.fetch_audit_log_single()
        self.assertEqual(result['pretty_change_type'], 'Indicator changed')
        self.assertEqual(result['rationale'], 'Test rationale')
        self.assertEqual(result['rationale_selected_options'], ['COVID-19', 'Other'])