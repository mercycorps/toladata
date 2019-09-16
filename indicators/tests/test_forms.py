import unittest
from factories import (
    IndicatorTypeFactory,
    IndicatorFactory,
    LevelFactory,
    SiteProfileFactory,
    SectorFactory,
    ProgramFactory,
    ResultFactory,
    UserFactory
)
from indicators.forms import IPTTReportFilterForm
from django.test import TestCase, RequestFactory

@unittest.skip('TODO: rewrite this test to match current filter form')
class TestFilterForm(TestCase):

    def test_form_populates(self):
        """The form should populate several fields from the db"""
        request = RequestFactory().get('/')
        request.user = UserFactory()
        SectorFactory.create_batch(3)
        LevelFactory.create_batch(3)
        IndicatorTypeFactory.create_batch(3)
        program = ProgramFactory()
        indicator = IndicatorFactory(program=program)
        IndicatorFactory.create_batch(3)
        result = ResultFactory(indicator=indicator)
        ResultFactory.create_batch(3)
        expected = SiteProfileFactory()
        expected2 = SiteProfileFactory()
        result.site.add(expected2)
        result.site.add(expected)
        SiteProfileFactory.create_batch(3)
        period_choices_start = ((2018, (('2018-02-01', 'Quarter 4 (Feb 01, 2018 - Apr 30, 2018)'),
                                        ('2018-05-01', 'Quarter 5 (May 01, 2018 - Jul 31, 2018)'))),)
        period_choices_end = ((2018, (('2018-04-30', 'Quarter 4 (Feb 01, 2018 - Apr 30, 2018)'),
                                      ('2018-07-31', 'Quarter 5 (May 01, 2018 - Jul 31, 2018)'))),)

        kwargs = {
            'program': program,
            'request': request,
            'initial': {'period_choices_start': period_choices_start, 'period_choices_end': period_choices_end}}
        form = IPTTReportFilterForm(**kwargs)

        stuff = str(form)
        self.assertIn(expected.name, stuff)
        self.assertIn(expected2.name, stuff)
        self.assertIn(indicator.name, stuff)

from indicators.tests.form_tests.result_form_unittests import (
    TestResultCreateUpdate404,
    TestUpdateFormInitialValues,
    TestCreateValidation
)