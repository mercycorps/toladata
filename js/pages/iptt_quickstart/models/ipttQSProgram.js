import { observable } from 'mobx';

import { getProgram, withReportingPeriod } from '../../../models/program';
import { getPeriodDateRange } from '../../../models/periodDateRange';

/**
 * IPTT Quickstart page specific model constructor
 * JSON params:
 *    frequencies [int]
 *    period_date_ranges (PeriodDateRange)
 * @return {Object}
 */

const QSDateRange = getPeriodDateRange();

export const forIpttQs = (
    programJSON = {}
) => ({
    frequencies: observable(new Set((programJSON.frequencies || [])
                                     .map(frequency => parseInt(frequency))
                                     .filter(frequency => !isNaN(frequency)))),
    periodRanges: observable(new Map(Object.entries(programJSON.period_date_ranges || {})
                                     .map(
        ([frequency, periodsJSON]) => {
            let freq = parseInt(frequency);
            return [freq, QSDateRange({frequency: freq, periods: periodsJSON})];
        }))),
    validFrequency(frequency) {
        return !isNaN(parseInt(frequency)) && this.frequencies.has(parseInt(frequency));
    },
    _getPeriods(frequency) {
        if (!isNaN(parseInt(frequency)) && this.periodRanges.has(parseInt(frequency))) {
            return this.periodRanges.get(parseInt(frequency));
        }
        return false;
    },
    periodCount(frequency) {
        let range = this._getPeriods(frequency);
        if (range) {
            return range.periodCount;
        }
        return false;
    },
    currentPeriod(frequency) {
        let range = this._getPeriods(frequency);
        if (range) {
            return range.currentPeriod;
        }
        return false;
    }
});

export default getProgram(withReportingPeriod, forIpttQs);