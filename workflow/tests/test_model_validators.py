from factories.workflow_models import ProgramFactory
from django.core.exceptions import ValidationError
from workflow.models import FundCode, GaitID
from django.test import TestCase


class FundCodeValidatorTest(TestCase):

    def setUp(self):
        self.program = ProgramFactory()
        self.gaitid = GaitID.objects.get(program_id=self.program.id)
        return super().setUp()

    def fund_code_len(self):
        return FundCode.objects.filter(gaitid=self.gaitid).count()

    def test_invalid_fund_code(self):
        invalid_fund_codes = [45000, 'abc', 0.245, '12345']

        for invalid_fund_code in invalid_fund_codes:
            fund_code = FundCode(gaitid=self.gaitid, fund_code=invalid_fund_code)

            self.assertRaises(ValidationError, fund_code.full_clean)
            self.assertEqual(self.fund_code_len(), 0)

    def test_valid_fund_code(self):
        valid_fund_code = 35000
        fund_code = FundCode(gaitid=self.gaitid, fund_code=valid_fund_code)

        try:
            fund_code.full_clean()
            fund_code.save()
        except ValidationError:
            self.fail('Received ValidationError on FundCodeValidatorTest.test_valid_fund_code')

        self.assertEqual(self.fund_code_len(), 1)

    def test_multiple_valid_fund_code(self):
        valid_fund_codes = [33000, 34000, 35000, 74000, 92000]

        for valid_fund_code in valid_fund_codes:
            fund_code = FundCode(gaitid=self.gaitid, fund_code=valid_fund_code)
            fund_code.save()

        self.assertEqual(self.fund_code_len(), 5)
