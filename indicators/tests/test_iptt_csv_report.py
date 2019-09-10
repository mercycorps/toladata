""" Functional tests for the CSV generation file for Palantir import

url: /indicators/iptt_csv/<program_id>/<reporttype>
"""

import unittest
from datetime import datetime, timedelta
from io import StringIO
import csv
from factories.workflow_models import ProgramFactory, SectorFactory
from factories.indicators_models import (
    DefinedIndicatorFactory,
    LevelFactory,
    DisaggregationTypeFactory,
    IndicatorTypeFactory,
    ResultFactory
    )
from django import test

class CSVTestBase(test.TestCase):
    reporrtype = 'timeperiods'
    url = '/indicators/iptt_csv/{0}/{1}/'
    fields = ['id', 'number', 'name', 'level_name', 'unit_of_measure', 'unit_of_measure_type',
              'sector', 'disaggregations', 'baseline', 'baseline_na', 'lop_target', 'target_frequency']
    data_fields = ['lop_sum', 'lop_target', 'lop_met']

    def setUp(self):
        self.client = test.Client()
        self.program = ProgramFactory(reporting_period_start=datetime.strptime('2017-01-01', '%Y-%m-%d'),
                                      reporting_period_end=datetime.strptime('2017-12-31', '%Y-%m-%d'))
        self.url = self.url.format(self.program.id, self.reporrtype)

    def tearDown(self):
        self.program.delete()

    def get_field(self, field, row):
        return row[
            {v: c for c, v in enumerate(self.fields)}[field]
        ]

@unittest.skip("Specs changing on CSV file, tests paused")
class TestCSVEndpointGeneratesCSVFile(CSVTestBase):
    header_row = ['Program:', 'program_name']

    def setUp(self):
        super(TestCSVEndpointGeneratesCSVFile, self).setUp()
        self.header_row[1] = self.program.name

    def test_endpoint_exists(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200,
                         "Expected a 200 OK at url {0}, got {1}".format(
                             self.url, response.status_code))

    def test_endpoint_returns_csv(self):
        response = self.client.get(self.url)
        self.assertEqual(response['Content-Type'], "text/csv",
                         "expected a text/csv response,at url {0}, got {1}".format(
                             self.url, response['Content-Type']))
        response_csv = csv.reader(StringIO(response.content))
        header_row = response_csv.next()
        self.assertGreater(len(header_row), 1,
                           "expected more than 1 cell in a csv file, got:\n {0}".format(
                               response.content))
        for c, value in enumerate(self.header_row):
            self.assertEqual(header_row[c], value,
                             "expected header row 1 cell {0} to be {1}, got {2}".format(
                                 c, value, header_row[c]))
        subheader_row = response_csv.next()
        for c, value in enumerate(self.fields):
            value = value[4:] if value[:4] == 'get_' else value
            value = value[:-6] if value[-6:] == '_label' else value
            self.assertEqual(subheader_row[c], value,
                             "expected subhead row 2 cell {0} to be {1}, got {2}".format(
                                 c, value, subheader_row[c]))

class CSVIndicatorTestBase(CSVTestBase):
    def setUp(self):
        super(CSVIndicatorTestBase, self).setUp()
        self.sectors = [SectorFactory(),]
        self.levels = [LevelFactory(),]
        self.disaggregations = [DisaggregationTypeFactory(),]
        self.indicatortypes = [IndicatorTypeFactory(),]
        self.indicators = []
        self.response = None

    def tearDown(self):
        for indicator in self.indicators:
            indicator.delete()
        for sector in self.sectors:
            sector.delete()
        for level in self.levels:
            level.delete()
        for disag in self.disaggregations:
            disag.delete()
        for indicatortype in self.indicatortypes:
            indicatortype.delete()
        super(CSVIndicatorTestBase, self).tearDown()

    def assert_msg(self, msg):
        if self.response:
            return "Unformatted CSV Response:\n{0}:\n{1}".format(self.response, msg)
        return msg

    def get_indicator(self, sector=0, level=0, disaggregation=0,
                      indicatortype=0):
        indicator = DefinedIndicatorFactory(
            sector=self.sectors[sector],
            level=self.levels[level]
        )
        indicator.disaggregation.add(self.disaggregations[disaggregation])
        indicator.indicator_type.add(self.indicatortypes[indicatortype])
        indicator.save()
        return indicator

    def add_indicator(self, *args, **kwargs):
        indicator = self.get_indicator(*args, **kwargs)
        indicator.program = self.program
        indicator.save()
        self.indicators.append(indicator)
        return indicator

    def get_rows(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200,
                         "Expected a 200 OK at url {0}, got {1}".format(
                             self.url, response.status_code))
        self.response = response.content
        reader = csv.reader(StringIO(response.content))
        headers = [reader.next(), reader.next()]
        body = [row for row in reader]
        return headers, body

@unittest.skip("Specs changing on CSV file, tests paused")
class TestCSVEndPointIndicatorsAccurate(CSVIndicatorTestBase):
    # to do: test result points

    def compare_indicator(self, indicator, row):
        for c, field in enumerate(self.fields):
            self.assertGreater(len(row), c,
                               self.assert_msg("row should have at least {0} fields, has {1}".format(
                                   c+1, len(row))))
            if field == 'level_name':
                value = indicator.level.name if indicator.level is not None else "N/A"
            else:
                value = str(getattr(indicator, field, 'N/A'))
            self.assertEqual(value, str(row[c]),
                             self.assert_msg("cell {0} should be {1} field with value {2}, got value {3}".format(
                                 c, field, value, row[c])))
        return True

    def test_row_counts(self):
        self.add_indicator()
        _, indicator_rows = self.get_rows()
        self.assertEqual(len(indicator_rows), 1,
                         self.assert_msg("One indicator added, should have one row returned"))
        self.add_indicator()
        _, indicator_rows = self.get_rows()
        self.assertEqual(len(indicator_rows), 2,
                         self.assert_msg("Two indicators added, should have two rows returned"))
        self.add_indicator()
        _, indicator_rows = self.get_rows()
        self.assertEqual(len(indicator_rows), 3,
                         self.assert_msg("Three indicators added, should have three rows returned"))
        self.indicators.pop(1).delete()
        _, indicator_rows = self.get_rows()
        self.assertEqual(len(indicator_rows), 2,
                         self.assert_msg("Three indicators added, one removed, should have two rows returned"))

    def test_indicator_global_info(self):
        self.add_indicator()
        _, indicator_rows = self.get_rows()
        self.assertTrue(self.compare_indicator(self.indicators[0], indicator_rows[0]))

    def test_indicator_info_with_blanks(self):
        indicator = self.add_indicator()
        indicator.level = None
        indicator.means_of_verification = None
        indicator.save()
        _, indicator_rows = self.get_rows()
        self.assertTrue(self.compare_indicator(self.indicators[0], indicator_rows[0]))
        self.assertEqual(indicator_rows[0][3], "N/A",
                         self.assert_msg("removed all levels, level should show N/A, got {0}".format(
                             indicator_rows[0][3])))
        self.assertEqual(indicator_rows[0][15], "N/A",
                         self.assert_msg("removed means of verification, should show N/A, got {0}".format(
                             indicator_rows[0][15])))

    def test_two_indicators_global_info(self):
        self.add_indicator()
        self.add_indicator()
        _, indicator_rows = self.get_rows()
        self.assertTrue(self.compare_indicator(self.indicators[0], indicator_rows[0]))
        self.assertTrue(self.compare_indicator(self.indicators[1], indicator_rows[1]))

    def test_two_indicators_different_relations(self):
        self.add_indicator()
        self.sectors.append(SectorFactory())
        self.add_indicator(sector=1)
        _, indicator_rows = self.get_rows()
        self.assertNotEqual(self.sectors[0].sector, self.sectors[1].sector,
                            "test invalid if sectors have same name")
        self.assertNotEqual(indicator_rows[0][6], indicator_rows[1][6],
                            self.assert_msg("sectors have different names, cells must be different also"))
        self.assertEqual(indicator_rows[0][6], self.sectors[0].sector,
                         self.assert_msg("different levels should show differently, got {0} instead of {1}".format(
                             indicator_rows[0][6], self.sectors[0].sector)))
        self.assertEqual(indicator_rows[1][6], self.sectors[1].sector,
                         self.assert_msg("different levels should show differently, got {0} instead of {1}".format(
                             indicator_rows[1][6], self.sectors[1].sector)))

    def test_multiple_disaggregation_types(self):
        indicator = self.add_indicator()
        self.disaggregations.append(DisaggregationTypeFactory())
        indicator.disaggregation.add(self.disaggregations[1])
        indicator.save()
        _, indicator_rows = self.get_rows()
        self.assertEqual(
            self.get_field('disaggregations', indicator_rows[0]),
            self.disaggregations[0].disaggregation_type + "/" + self.disaggregations[1].disaggregation_type,
            self.assert_msg("disaggregations should combine with \"/\" joiner, got {0}".format(
                self.get_field('disaggregations', indicator_rows[0]))))

@unittest.skip("Specs changing on CSV file, tests paused")
class TestCSVTotals(CSVIndicatorTestBase):
    def setUp(self):
        super(TestCSVTotals, self).setUp()
        self.datapoints = []

    def tearDown(self):
        super(TestCSVTotals, self).tearDown()
        for datapoint in self.datapoints:
            datapoint.delete()

    def add_data(self, value, months=None, indicator=None):
        if indicator is None:
            indicator = self.add_indicator() if not self.indicators else self.indicators[0]
        if months is None:
            collect_date = (self.program.reporting_period_start + timedelta(days=1))
        else:
            startdate = self.program.reporting_period_start
            year = startdate.year + 1 if startdate.month + months > 12 else startdate.year
            month = startdate.month + months - 12 if startdate.month + months > 12 else startdate.month + months
            collect_date = datetime(year, month, startdate.day+1)
        self.datapoints.append(
            ResultFactory(indicator=indicator, date_collected=collect_date, achieved=value)
        )

    def get_data_rows(self):
        _, indicator_rows = self.get_rows()
        return [row[len(self.fields):] for row in indicator_rows]

    def test_header_fields(self):
        header_rows, _ = self.get_rows()
        for c, value in enumerate(self.data_fields):
            self.assertEqual(header_rows[1][c+len(self.fields)], value,
                             self.assert_msg("subhead row cell {0} should have value {1} got {2}".format(
                                 c+18, value, header_rows[1][c+len(self.fields)])))

    def test_lop_sum_target_met(self):
        indicator = self.add_indicator()
        indicator.lop_target = 100
        indicator.save()
        self.add_data(10)
        data_row = self.get_data_rows()[0]
        self.assertEqual(float(data_row[0]), float(10),
                         self.assert_msg("one data point value 10 should yield a total of 10, got {0}".format(
                             data_row[0])))
        self.assertEqual(float(data_row[1]), float(100),
                         self.assert_msg("indicator lop target should be 100, got {0}".format(
                             data_row[1])))
        self.assertEqual(data_row[2], "10%",
                         self.assert_msg("expected 10% for met (10/100), got {0}".format(
                             data_row[2])))

    def test_num_timeperiods(self):
        self.add_indicator()
        header_rows, _ = self.get_rows()
        timeperiods = [header_rows[0][len(self.fields) + len(self.data_fields):],
                       header_rows[1][len(self.fields) + len(self.data_fields):]]
        self.assertEqual(len(timeperiods[0]), 12,
                         self.assert_msg("expected 12 timeperiods headers, got {0}".format(len(timeperiods[0]))))
        self.assertEqual(timeperiods[0][0], "Jan 2017",
                         self.assert_msg("expected first time period to have date Jan 2017, got {0}".format(
                             timeperiods[0][0])))
        self.assertEqual(timeperiods[0][8], "Sep 2017",
                         self.assert_msg("expected ninth time period to have date Sept 2017, got {0}".format(
                             timeperiods[0][8])))
        self.assertTrue(all(x == "Actual" for x in timeperiods[1]),
                        "Expected all timeperiods to have header 'Actual', instead got {0}".format(
                            timeperiods[1]))

    def test_timeperiods_data_one_indicator(self):
        self.add_indicator()
        self.add_data(10, months=0)
        self.add_data(11, months=1)
        self.add_data(10, months=2)
        self.add_data(2, months=2)
        data_row_timeperiods = self.get_data_rows()[0][3:]
        for c, value in enumerate([10, 11, 12, 13]):
            # almost equal so that floats don't cause failure:
            self.assertAlmostEqual(float(data_row_timeperiods[c]), value,
                             self.assert_msg("expected data value for {0} month to be {1}, got {2}".format(
                                 c, value, data_row_timeperiods[c])))
