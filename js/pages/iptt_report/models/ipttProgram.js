import { observable } from 'mobx';

import { getProgram, withReportingPeriod, withRFLevelOrdering } from '../../../models/program';

import { getPeriodDateRange } from '../../../models/periodDateRange';
import IPTTIndicator from './ipttIndicator';
import IPTTLevel from './ipttLevel';


const IPTTPeriod = (
    periodJSON = {}
) => ({
    _frequency: parseInt(periodJSON.frequency),
    _name: periodJSON.name,
    label: periodJSON.label,
    start: new Date(periodJSON.start),
    startLabel: periodJSON.start_label,
    end: new Date(periodJSON.end),
    endLabel: periodJSON.end_label,
    past: Boolean(periodJSON.past),
    year: periodJSON.year,
    get range() {
        return [2, 7].includes(this._frequency) ? null : `${this.startLabel} – ${this.endLabel}`;
    },
    get name() {
        return this._frequency == 7 ? `${this._name} ${this.year}` : this._name;
    }
});

const forIPTTDateRange = (
    rangeJSON = {}
) => ({
    periods: rangeJSON.periods.map(periodJSON => IPTTPeriod({...periodJSON, frequency: rangeJSON.frequency})),
    years: [...new Set(rangeJSON.periods.map(periodJSON => periodJSON.year))].sort(),
});

const IPTTPeriodDateRange = getPeriodDateRange(forIPTTDateRange);


/**
 * IPTT Report page specific model constructor
 * JSON params:
 *   frequencies [int]
 *   period_date_ranges (IPTTPeriodDateRange)
 * @return {Object}
 */

export const forIPTT = (
    programJSON = {}
) => ({
    frequencies: observable(new Set((programJSON.frequencies || [])
                                     .map(frequency => parseInt(frequency))
                                     .filter(frequency => !isNaN(frequency)))),
    periodRanges: observable(new Map(Object.entries(programJSON.period_date_ranges || {})
        .map(([frequency, periodsJSON]) => {
            let freq = parseInt(frequency);
            return [freq, IPTTPeriodDateRange({frequency: freq, periods: periodsJSON})];
        }))),
    validFrequency(frequency) {
        return !isNaN(parseInt(frequency)) && this.frequencies.has(parseInt(frequency));
    },
    resultChainLabel: programJSON.result_chain_label,
    indicators: observable(new Map((programJSON.indicators || []).map(
        indicatorJSON => IPTTIndicator(indicatorJSON)).map(
        indicator => [indicator.pk, indicator]
        ))),
    levels: observable(new Map((programJSON.levels || []).map(levelJSON => IPTTLevel(levelJSON)).map(level => [level.pk, level]))),
    tiers: observable(new Map((programJSON.tiers || []).map(
        tierJSON => [parseInt(tierJSON.pk), {pk: parseInt(tierJSON.pk), name: tierJSON.name, depth: tierJSON.tier_depth}]
        ))),
    oldLevels: observable(new Map((programJSON.old_levels || []).map(
        oldLevelJSON => [parseInt(oldLevelJSON.pk), {pk: oldLevelJSON.pk, name: oldLevelJSON.name}]))),
    sectors: observable(new Map((programJSON.sectors || []).map(
        sectorJSON => [parseInt(sectorJSON.pk), {pk: parseInt(sectorJSON.pk), name: sectorJSON.name}]
        ))),
    sites: observable(new Map((programJSON.sites || []).map(
        siteJSON => [parseInt(siteJSON.pk), {pk: parseInt(siteJSON.pk), name: siteJSON.name}]
        ))),
    disaggregations: observable(new Map((programJSON.disaggregations || []).map(
        disaggregationJSON => [parseInt(disaggregationJSON.pk),
                               {pk: parseInt(disaggregationJSON.pk), name: disaggregationJSON.name,
                               country: disaggregationJSON.country,
                               labels: (disaggregationJSON.labels || []).map(
                                    labelJSON => ({pk: parseInt(labelJSON.pk), name: labelJSON.name}))}]
        ))),
    indicatorTypes: observable(new Map((programJSON.indicator_types || []).map(
        indicatorTypeJSON => [parseInt(indicatorTypeJSON.pk), {pk: parseInt(indicatorTypeJSON.pk), name: indicatorTypeJSON.name}]
        ))),
    deleteIndicator(indicatorPk) {
        if (!isNaN(parseInt(indicatorPk))) {
            return this.updateOrder().then(success => {
                this.indicators.delete(parseInt(indicatorPk));
            });
        }
        return this.updateOrder();
    }
});

export default getProgram(withReportingPeriod, withRFLevelOrdering, forIPTT);