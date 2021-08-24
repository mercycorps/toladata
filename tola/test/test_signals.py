
from django import test
from django.core import mail
from factories.workflow_models import SectorFactory
from factories.indicators_models import (
    ReportingFrequencyFactory, DataCollectionFrequencyFactory, IndicatorTypeFactory)


class TestSignals(test.TestCase):

    def test_translated_menu_model_save_triggers_email(self):
        self.assertEqual(len(mail.outbox), 0)
        SectorFactory()
        self.assertEqual(len(mail.outbox), 1)
        DataCollectionFrequencyFactory()
        self.assertEqual(len(mail.outbox), 2)
        ReportingFrequencyFactory()
        self.assertEqual(len(mail.outbox), 3)
        IndicatorTypeFactory()
        self.assertEqual(len(mail.outbox), 4)
