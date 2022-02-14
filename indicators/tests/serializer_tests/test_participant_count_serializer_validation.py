"""
Test Cases for the validation on PCResultSerializerWrite
"""
from django import test
from datetime import date
from indicators.serializers_new import participant_count_serializers
from factories.indicators_models import IndicatorFactory
from factories.workflow_models import ProgramFactory


class TestPCResultSerializerWriteValidation(test.TestCase):
    
    serializer = participant_count_serializers.PCResultSerializerWrite
    error_messages = {
        'empty_outcome': 'Please complete this field. You can select more than one outcome theme.',
        'invalid_evidence': 'Please enter a valid evidence link.',
        'empty_record_with_evidence': 'A record name must be included along with the link.',
        'record_with_empty_evidence': 'A link must be included along with the record name.',
        'invalid_date_collected': 'This date should be within the fiscal year of the reporting period.'
    }
    
    def setUp(self):
        self.program = ProgramFactory(reporting_period_start=date(year=2022, month=1, day=1), reporting_period_end=date(year=2022, month=10, day=1))
        self.indicator = IndicatorFactory(program=self.program)

    def example_data(self):
        return {
            "outcome_themes": [2, 3],
            "achieved": 5,
            "indicator": self.indicator.pk,
            "disaggregations": [],
            "evidence_url": "https://docs.google.com/document/d/1YHopunXtY781Z5uI1Xf-iswO8ERtaCaon0N7YPCjeAo/edit?usp=sharing",
            "record_name": "test evidence",
            "date_collected": date(year=2022, month=2, day=10)
        }

    def test_with_correct_data(self):
        result = self.serializer(data=self.example_data(), context={"program": self.program})
        result.is_valid(raise_exception=True)

    def test_with_empty_outcome_themes(self):
        data = self.example_data()
        data['outcome_themes'] = []
        result = self.serializer(data=data, context={"program": self.program})
        result.is_valid()
        self.assertEquals(self.error_messages['empty_outcome'], str(result.errors['outcome_themes'][0]))

    def test_invalid_evidence_url(self):
        data = self.example_data()
        data['evidence_url'] = 'abcd'
        result = self.serializer(data=data, context={"program": self.program})
        result.is_valid()
        self.assertEquals(self.error_messages['invalid_evidence'], str(result.errors['evidence_url'][0]))

    def test_empty_record_with_evidence(self):
        data = self.example_data()
        data['record_name'] = ''
        result = self.serializer(data=data, context={"program": self.program})
        result.is_valid()
        self.assertEquals(self.error_messages['empty_record_with_evidence'], str(result.errors['evidence_url'][0]))

    def test_record_with_empty_evidence(self):
        data = self.example_data()
        data['evidence_url'] = ''
        result = self.serializer(data=data, context={"program": self.program})
        result.is_valid()
        self.assertEquals(self.error_messages['record_with_empty_evidence'], str(result.errors['record_name'][0]))

    def test_invalid_date_collected(self):
        data = self.example_data()
        data['date_collected'] = date(year=2022, month=11, day=1)
        result = self.serializer(data=data, context={"program": self.program})
        result.is_valid()
        self.assertEquals(self.error_messages['invalid_date_collected'], str(result.errors['date_collected'][0]))

    def test_without_evidence(self):
        """
        Evidence is not included in request
        """
        data = self.example_data()
        del data['evidence_url']
        del data['record_name']
        result = self.serializer(data=data, context={'program': self.program})
        result.is_valid(raise_exception=True)

    def test_empty_evidence(self):
        """
        Evidence is empty and included in request
        """
        data = self.example_data()
        data['evidence_url'] = ''
        data['record_name'] = ''
        result = self.serializer(data=data, context={'program': self.program})
        result.is_valid(raise_exception=True)
