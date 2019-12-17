# pylint: disable=W0611
# These are the unit tests for the program metrics used on the home page:
from indicators.tests.program_metric_tests.program_unit.percent_complete_queries_unit_tests import (
    TestProgramPercentComplete
)

from indicators.tests.program_metric_tests.program_unit.program_metrics_queries_unit_tests import (
    TestIndicatorCounts,
    TestLOPTargetsDefined,
    TestMidEndTargetsDefined,
    TestEventTargetsDefined,
    TestAnnualTargetsDefined,
    TestSemiAnnualTargetCounts,
    TestTriAnnualTargetCounts,
    TestQuarterlyTargetCounts,
    TestMonthlyTargetCounts,
    TestProgramReportedResultsQueries,
    TestProgramWithEvidenceQueries,
    TestIndicatorReportingEdgeCases
)

from indicators.tests.program_metric_tests.program_unit.program_reporting_count_unit_tests import (
    TestSingleNonReportingIndicator,
    TestSingleReportingIndicator,
    TestMixedReportingAndNonIndicators,
    TestProgramReportingPeriodCorrect,
    TestProgramHasTimeAwareIndicators,
    TestProgramLastTimeAwareStartDate
)

from indicators.tests.program_metric_tests.program_unit.program_scope_queries_unit_tests import (
    TestProgramReportingingCounts,
    TestTargetsActualsOverUnderCorrect
)

from indicators.tests.program_metric_tests.program_unit.program_qs_metrics_unittests import (
    TestTwoProgramsBothDefined,
    TestTwoProgramsOneDefined,
    TestTwoProgramsFiveIndicatorsThreeReportedResults,
    TestTwoProgramsFiveIndicatorsEightResultsFiveEvidence,
    TestMultipleProgramsStressTestQSCounts
)

from indicators.tests.program_metric_tests.program_unit.last_completed_periods import (
    TestProgramHasLOP,
    TestProgramHasMidEnd,
    TestAnnualLastCompleted
)
