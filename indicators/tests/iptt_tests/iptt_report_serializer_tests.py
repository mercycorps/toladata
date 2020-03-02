""" Tests for the IPTTReportSerializer class (used by Excel endpoint renderer)

"""

import locale
import datetime
from django import test
from django.utils import translation
from indicators.serializers_new import (
    IPTTTPReportSerializer,
    IPTTTVAReportSerializer,
    IPTTFullReportSerializer
)


class TestReportSerializers(test.TestCase):
    def test_report_filename(self):
        # English:
        today = datetime.date.today()
        date_string = f"{today.strftime('%b')} {today.day}, {today.year}"
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
        default_locale = locale.getlocale()
        # French
        locale.setlocale(locale.LC_ALL, 'fr_FR')
        fr_date_string = f"{today.day} {today.strftime('%b')}. {today.year}"
        translation.activate('fr')
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
        locale.setlocale(locale.LC_ALL, 'es_ES')
        es_date_string = f"{today.day} {today.strftime('%b')}. {today.year}"
        translation.activate('es')
        es_actuals_report = IPTTTPReportSerializer()
        es_tva_report = IPTTTVAReportSerializer()
        es_full_report = IPTTFullReportSerializer()
        self.assertEqual(
            es_actuals_report.filename,
            f"Informe completo del programa del IPTT TvA {es_date_string}.xlsx"
        )
        self.assertEqual(
            es_tva_report.filename,
            f"Informe del IPTT TvA {es_date_string}.xlsx"
        )
        self.assertEqual(
            es_full_report.filename,
            f"Informe completo del programa del IPTT TvA {es_date_string}.xlsx"
        )
        locale.setlocale(locale.LC_ALL, default_locale)
        translation.activate('en')