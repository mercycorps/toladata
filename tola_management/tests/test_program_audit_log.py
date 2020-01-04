# -*- coding: utf-8 -*-

from django import test
from factories import (
    workflow_models as w_factories,
    indicators_models as i_factories
)
from tola_management.models import ProgramAuditLog
from indicators.models import Indicator, Result

# Create your tests here.


class TestResultAuditLog(test.TestCase):

    def setUp(self):
        self.country = w_factories.CountryFactory(country="Test Country", code="TC")
        self.program = w_factories.RFProgramFactory(name="Test Program")
        self.program.country.add(self.country)
        self.tola_user = w_factories.TolaUserFactory(country=self.country)
        w_factories.grant_country_access(self.tola_user, self.country, 'basic_admin')
        w_factories.grant_program_access(self.tola_user, self.program, self.country, role='high')
        self.client.force_login(user=self.tola_user.user)

    def test_audit_save(self):
        indicator = i_factories.RFIndicatorFactory(targets=20, program=self.program)
        target = indicator.periodictargets.first()
        achieved_value = 5
        result_data = {
            'achieved': achieved_value,
            'target': target.id,
            'date_collected': self.program.reporting_period_start,
            'indicator': indicator.id
        }

        response = self.client.post(
            f'/indicators/result_add/{indicator.id}/', result_data, **{'HTTP_X_REQUESTED_WITH': 'XMLHttpRequest'})
        result = indicator.result_set.first()
        audits = ProgramAuditLog.objects.all()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(result.achieved, achieved_value)
        self.assertEqual(audits.count(), 1)

        # result_data.update({'result': result.id})
        response2 = self.client.post(
            f'/indicators/result_update/{result.id}/', result_data, **{'HTTP_X_REQUESTED_WITH': 'XMLHttpRequest'})
        print('dirres2', dir(response2))
        print('res2', response2.content)
        result2 = indicator.result_set.first()
        audits2 = ProgramAuditLog.objects.all()
        print('response', response2._headers)
#        self.assertEqual(response.status_code, 200)
        self.assertEqual(result2.achieved, achieved_value)
        #self.assertEqual(audits.count(), 2)
