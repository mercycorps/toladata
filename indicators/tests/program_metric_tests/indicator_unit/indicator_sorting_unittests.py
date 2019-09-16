"""Test that indicators from any source have a sort order that takes log frame into account

    this is per GH ticket #826, but is almost certainly temporary (log frame support will root this process
    in data structures, as opposed to string formatting in the indicator number field)
    Current (temporary) business logic:
        - if all indicator number fields are strictly numeric: sort numerically
        - if all indicator number fields are strictly numbers separated by '.': sort as an outline
            (1, 1.1, 1.2, 1.2.1.1, etc.)
        - else sort alphabetically"""

from factories import (
    indicators_models as factory,
    workflow_models as w_factory
)
from indicators.models import Indicator
from indicators.queries import (
    MetricsIndicator,
    IPTTIndicator,
    ProgramWithMetrics
)
from django import test

def get_indicator(number, program):
    return factory.IndicatorFactory(
        number=number,
        program=program
    )

class SortingTestsMixin(object):

    def test_metrics_indicator_manager(self):
        metricsindicators = list(MetricsIndicator.objects.with_logframe_sorting())
        for c, pk in enumerate(self.expected):
            self.assertEqual(
                metricsindicators[c].pk, pk,
                "number {0} logframe type {1} logsort_a {2} logsort_b {3} sorted numbers {4}".format(
                    metricsindicators[c].number,
                    metricsindicators[c].logsort_type,
                    metricsindicators[c].logsort_a,
                    metricsindicators[c].logsort_b,
                    [i.number for i in metricsindicators]
                ))

    def test_metrics_indicator_queryset(self):
        metricsindicators = list(MetricsIndicator.objects.all().with_logframe_sorting())
        for c, pk in enumerate(self.expected):
            self.assertEqual(metricsindicators[c].pk, pk,
                "number {0} logframe type {1} logsort_a {2} logsort_b {3}".format(
                    metricsindicators[c].number,
                    metricsindicators[c].logsort_type,
                    metricsindicators[c].logsort_a,
                    metricsindicators[c].logsort_b,
                ))

    def test_regular_indicator_manager(self):
        metricsindicators = list(Indicator.objects.with_logframe_sorting())
        for c, pk in enumerate(self.expected):
            self.assertEqual(metricsindicators[c].pk, pk,
                "number {0} logframe type {1} logsort_a {2} logsort_b {3}".format(
                    metricsindicators[c].number,
                    metricsindicators[c].logsort_type,
                    metricsindicators[c].logsort_a,
                    metricsindicators[c].logsort_b,
                ))

    def test_regular_indicator_queryset(self):
        metricsindicators = list(Indicator.objects.all().with_logframe_sorting())
        for c, pk in enumerate(self.expected):
            self.assertEqual(metricsindicators[c].pk, pk,
                "number {0} logframe type {1} logsort_a {2} logsort_b {3}".format(
                    metricsindicators[c].number,
                    metricsindicators[c].logsort_type,
                    metricsindicators[c].logsort_a,
                    metricsindicators[c].logsort_b,
                ))

    def test_program_page_sorted(self):
        metricsindicators = list(ProgramWithMetrics.program_page.get(pk=self.program_id).annotated_indicators)
        for c, pk in enumerate(self.expected):
            self.assertEqual(metricsindicators[c].pk, pk,
                "number {0} logframe type {1} logsort_a {2} logsort_b {3}".format(
                    metricsindicators[c].number,
                    metricsindicators[c].logsort_type,
                    metricsindicators[c].logsort_a,
                    metricsindicators[c].logsort_b,
                ))

class TestNumericSorting(test.TestCase, SortingTestsMixin):
    def setUp(self):
        program = w_factory.ProgramFactory()
        self.expected = []
        for x in reversed(range(10)):
            self.expected.append(get_indicator(x+1, program).id)
        self.expected = reversed(self.expected)
        self.program_id = program.id

class TestAlphabeticalSorting(test.TestCase, SortingTestsMixin):
    def setUp(self):
        program = w_factory.ProgramFactory()
        self.expected = []
        for x in reversed(['aasdf', 'basdf', 'casdf', 'daasdf', 'e3214', 'f5235']):
            self.expected.append(get_indicator(x, program).id)
        self.expected = reversed(self.expected)
        self.program_id = program.id

class TestLogframeSorting(test.TestCase, SortingTestsMixin):
    def setUp(self):
        program = w_factory.ProgramFactory()
        self.expected = []
        for x in reversed(['1', '1.1', '1.1.1', '1.2', '1.2.a', '1.2.b.', '1.4', '2.1.2', '3', '3.2.1.1', '10.1']):
            self.expected.append(get_indicator(x, program).id)
        self.expected = reversed(self.expected)
        self.program_id = program.id

class TestMixedSorting(test.TestCase, SortingTestsMixin):
    def setUp(self):
        program = w_factory.ProgramFactory()
        self.expected = []
        for x in reversed(['1', '1.1.1', '2.1.2', '3', '3.2.1.1', '10.1', '1.1a', '1.1b', '1.2a']):
            self.expected.append(get_indicator(x, program).id)
        self.expected = reversed(self.expected)
        self.program_id = program.id

class TestQueryCounts(test.TestCase):
    def setUp(self):
        program = w_factory.ProgramFactory()
        self.expected = []
        for x in range(10):
            self.expected.append(get_indicator(x+1, program).id)
        self.program_id = program.id

    def test_query_counts(self):
        with self.assertNumQueries(1):
            metricsindicators = list(Indicator.objects.with_logframe_sorting())
        with self.assertNumQueries(1):
            metricsindicators = list(MetricsIndicator.objects.with_logframe_sorting())

    def test_query_counts_from_program(self):
        program = ProgramWithMetrics.program_page.get(pk=self.program_id)
        with self.assertNumQueries(1):
            metricsindicators = list(program.annotated_indicators)
