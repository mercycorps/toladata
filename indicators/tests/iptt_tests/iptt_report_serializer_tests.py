""" Tests for the IPTTReportSerializer class (used by Excel endpoint renderer)

"""

import datetime
from django import test
from django.utils import translation, formats
from indicators.serializers_new import (
    IPTTTPReportSerializer,
    IPTTTVAReportSerializer,
    IPTTFullReportSerializer
)


class TestReportSerializers(test.TestCase):
    def test_report_filename(self):
        # English:
        today = datetime.date.today()
        en_format = 'M j, Y'
        es_format = 'j N Y'
        fr_format = 'j N Y'
        date_string = formats.date_format(today, en_format, use_l10n=True)
        actuals_report = IPTTTPReportSerializer()
        self.assertEqual(
            actuals_report.filename,
            f"IPTT Actuals only report {date_string}.xlsx"
        )
        tva_report = IPTTTVAReportSerializer()
        self.assertEqual(
            tva_report.filename,
            f"IPTT TvA report {date_string}.xlsx"
        )
        full_report = IPTTFullReportSerializer()
        self.assertEqual(
            full_report.filename,
            f"IPTT TvA full program report {date_string}.xlsx"
        )
        # French
        translation.activate('fr')
        fr_date_string = formats.date_format(today, fr_format, use_l10n=True)
        fr_actuals_report = IPTTTPReportSerializer()
        fr_tva_report = IPTTTVAReportSerializer()
        fr_full_report = IPTTFullReportSerializer()
        self.assertEqual(
            fr_actuals_report.filename,
            f"Rapport IPTT relatif aux valeurs réelles {fr_date_string}.xlsx"
        )
        
        self.assertEqual(
            fr_tva_report.filename,
            f"Rapport TVA IPTT {fr_date_string}.xlsx"
        )
        
        self.assertEqual(
            fr_full_report.filename,
            f"Rapport IPTT relatif à la totalité de la TVA du programme {fr_date_string}.xlsx"
        )
        # Spanish
        translation.activate('es')
        es_date_string = formats.date_format(today, es_format, use_l10n=True)
        es_actuals_report = IPTTTPReportSerializer()
        es_tva_report = IPTTTVAReportSerializer()
        es_full_report = IPTTFullReportSerializer()
        self.assertEqual(
            es_actuals_report.filename,
            f"Informes de reales únicamente del IPTT {es_date_string}.xlsx"
        )
        self.assertEqual(
            es_tva_report.filename,
            f"Informe del IPTT TvA {es_date_string}.xlsx"
        )
        self.assertEqual(
            es_full_report.filename,
            f"Informe completo del programa del IPTT TvA {es_date_string}.xlsx"
        )
        translation.activate('en')