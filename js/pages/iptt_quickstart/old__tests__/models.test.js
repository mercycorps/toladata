/**
 * Tests for the iptt_quickstart/models module
 * @see module:iptt_quickstart/models
 */
import React from 'react';
import programsJSON from './fixtures/programsJSON';
import QSProgramStore, { QSProgram } from '../models/program_models';
import QSRootStore, { BLANK_LABEL, TVA, TIMEPERIODS } from '../models/root_store';

describe('QSProgram', () => {
   test('instances without crashing', () => {
        let instance = new QSProgram({}, programsJSON[0]);
        expect(instance).not.toBeUndefined();
   });
   describe('QSProgram instance', () => {
        var instance;
        beforeAll(() => {
            instance = new QSProgram({}, programsJSON[0]);
        });
        test('id renders correctly', () => {
            expect(instance.id).toEqual(1);
        });
        test('periods for frequencies match', () => {
            let startDate = "Jan 1, 2018";
            expect(instance.periods(1)[0][0]).toEqual(startDate);
            expect(instance.periods(2)[0][0]).toEqual(startDate);
            expect(instance.periods(3)[0][0]).toEqual(startDate);
            expect(instance.periods(4)[0][0]).toEqual(startDate);
            expect(instance.periods(5)).toBeFalsy();
            expect(instance.periods(6)).toBeFalsy();
            expect(instance.periods(7)).toBeFalsy();
        });
        test('period counts for frequencies match', () => {
            expect(instance.periodCount(1)).toEqual(1);
            expect(instance.periodCount(2)).toEqual(2);
            expect(instance.periodCount(3)).toEqual(2);
            expect(instance.periodCount(4)).toEqual(4);
            expect(instance.periodCount(5)).toBeFalsy();
            expect(instance.periodCount(6)).toBeFalsy();
            expect(instance.periodCount(7)).toBeFalsy();
        });
   });
});

describe('QSProgramStore', () => {
    test('instances without crashing', () => {
        let instance = new QSProgramStore({}, programsJSON);
        expect(instance).not.toBeUndefined();
    });
    describe('QSProgramStore instance', () => {
        var instance;
        beforeAll(() => {
            instance = new QSProgramStore({}, programsJSON);
        });
        test('returns program for id', () => {
            expect(instance.getProgram(1).id).toEqual(1);
        });
        test('returns false for bad id', () => {
            expect(instance.getProgram(4)).toBeFalsy();
        });
        test('returns all programs in name order', () => {
            expect(instance.programList[0].id).toEqual(2);
            expect(instance.programList[1].id).toEqual(1);
            expect(instance.programList.length).toEqual(2);
        });
    });
});


describe('QSRootStore', () => {
    let jsContext = {
        programs: programsJSON,
        iptt_url: '/indicators/iptt_report/'
    };
    let blankOption = {
        value: null,
        label: BLANK_LABEL
    };
    it('instances without crashing', () => {
        let instance = new QSRootStore(jsContext);
        expect(instance).not.toBeUndefined();
    });
    describe('QSRootStore instance', () => {
        var instance;
        beforeEach(() => {
            instance = new QSRootStore(jsContext);
        });
        it('initializes correct values', () => {
            expect(instance.reportType).toBeNull();
            expect(instance.selectedTVAProgram).toEqual(blankOption);
            expect(instance.selectedTimeperiodsProgram).toEqual(blankOption);
            expect(instance.selectedFrequency).toEqual(blankOption);
            expect(instance.showAll).toEqual(true);
            expect(instance.mostRecent).toEqual(false);
            expect(instance.mostRecentCount).toEqual(2);
        });
        it('sets TVA program', () => {
            instance.setTVAProgram(1);
            expect(instance.reportType).toEqual(TVA);
            expect(instance.selectedTVAProgram.value).toEqual(1);
            expect(instance.selectedTVAProgram.label).toEqual('Test program');
            expect(instance.selectedTimeperiodsProgram).toEqual(blankOption);
        });
        it('sets Timeperiods program', () => {
            instance.setTimeperiodsProgram(1);
            expect(instance.reportType).toEqual(TIMEPERIODS);
            expect(instance.selectedTimeperiodsProgram.value).toEqual(1);
            expect(instance.selectedTimeperiodsProgram.label).toEqual('Test program');
            expect(instance.selectedTVAProgram).toEqual(blankOption);
        });
        it('switches between TVA and timeperiods', () => {
            instance.setTVAProgram(1);
            expect(instance.reportType).toEqual(TVA);
            instance.setTimeperiodsProgram(1);
            expect(instance.reportType).toEqual(TIMEPERIODS);
            expect(instance.selectedTVAProgram).toEqual(blankOption);
            instance.setTVAProgram(1);
            expect(instance.reportType).toEqual(TVA);
            expect(instance.selectedTimeperiodsProgram).toEqual(blankOption);
        });
        it('initializes correct program options', () => {
            expect(instance.tvaProgramOptions.length).toEqual(2);
            expect(instance.timeperiodsProgramOptions.length).toEqual(2);
            expect(instance.tvaProgramOptions.map(opt => opt.value)).toEqual([2, 1]);
            expect(instance.timeperiodsProgramOptions.map(opt => opt.value)).toEqual([2, 1]);
        });
        it('initializes correct frequency options', () => {
            instance.setTVAProgram(1);
            expect(instance.frequencyOptions.length).toEqual(2);
            expect(instance.frequencyOptions.map(opt => opt.value)).toEqual([1, 3]);
            expect(instance.frequencyOptions[0].label).toEqual('Life of Program (LoP) only');
            instance.setTVAProgram(2); 
            expect(instance.frequencyOptions.length).toEqual(2);
            expect(instance.frequencyOptions.map(opt => opt.value)).toEqual([1, 4]);
            expect(instance.frequencyOptions[1].label).toEqual('Semi-annual');
        });
        it('allows frequency to be set', () => {
            instance.setTVAProgram(1);
            instance.setFrequency(3);
            expect(instance.selectedFrequency.value).toEqual(3);
            expect(instance.selectedFrequency.label).toEqual('Annual');
        });
        it('keeps or resets frequency based on availability', () => {
            instance.setTVAProgram(1);
            instance.setFrequency(1);
            expect(instance.selectedFrequency.value).toEqual(1);
            instance.setTVAProgram(2);
            expect(instance.selectedFrequency.value).toEqual(1);
            instance.setFrequency(4);
            expect(instance.selectedFrequency.value).toEqual(4);
            instance.setTVAProgram(1);
            expect(instance.selectedFrequency).toEqual(blankOption);
        });
        it('only displays tva programs with frequency options', () => {
            let extendedProgramsJSON = programsJSON.concat(
            [{
                id: 3,
                name: "No freqs program",
                frequencies: [],
                periodDateRanges: {
                    1: [[
                        'Jan 1, 2017',
                        'Dec 31, 2017'
                    ]]
                }
            }]);
            let thisInstance = new QSRootStore(
                {
                    programs: extendedProgramsJSON,
                    labels: {
                    targetperiods: {}
                    }
                }
            );
            expect(thisInstance.tvaProgramOptions.length).toEqual(2);
            expect(thisInstance.timeperiodsProgramOptions.length).toEqual(3);
        });
        it('disables tva period buttons unless time-based frequency is picked', () => {
            expect(instance.periodCountDisabled).toBeTruthy();
            instance.setTimeperiodsProgram(2);
            expect(instance.periodCountDisabled).toBeTruthy();
            instance.setTVAProgram(2);
            expect(instance.periodCountDisabled).toBeTruthy();
            instance.setFrequency(1);
            expect(instance.periodCountDisabled).toBeTruthy();
            instance.setFrequency(4);
            expect(instance.periodCountDisabled).toBeFalsy();
        });
        it('sets show all and most recent appropriately', () => {
            instance.setTVAProgram(2);
            instance.setFrequency(4);
            instance.setMostRecent();
            expect(instance.showAll).toBeFalsy();
            expect(instance.mostRecent).toBeTruthy();
            expect(instance.mostRecentCountDisplay).toEqual(2);
            instance.setShowAll();
            expect(instance.showAll).toBeTruthy();
            expect(instance.mostRecent).toBeFalsy();
            expect(instance.mostRecentCountDisplay).toEqual('');
            instance.setMostRecentCount(3);
            expect(instance.showAll).toBeFalsy();
            expect(instance.mostRecent).toBeTruthy();
            expect(instance.mostRecentCountDisplay).toEqual(3);
            instance.setShowAll();
            expect(instance.mostRecentCountDisplay).toEqual('');
            instance.setMostRecent();
            expect(instance.mostRecentCountDisplay).toEqual(3);
            instance.setMostRecentCount(8);
            expect(instance.mostRecentCountDisplay).toEqual(6);
        });
        it('returns false for URL until info is provided', () => {
            expect(instance.tvaURL).toBeFalsy();
            expect(instance.timeperiodsURL).toBeFalsy();
            instance.setTimeperiodsProgram(1);
            expect(instance.timeperiodsURL).not.toBeFalsy();
            instance.setTVAProgram(1);
            expect(instance.timeperiodsURL).toBeFalsy();
            expect(instance.tvaURL).toBeFalsy();
            instance.setFrequency(1);
            expect(instance.tvaURL).not.toBeFalsy();
            instance.setFrequency(null);
            expect(instance.tvaURL).toBeFalsy();
        });
        it('returns the correct URL', () => {
            instance.setTimeperiodsProgram(1);
            expect(instance.timeperiodsURL).toEqual(
                '/indicators/iptt_report/1/timeperiods/?frequency=7&timeframe=2&numrecentcount=2'
            );
            instance.setTVAProgram(1);
            instance.setFrequency(1);
            expect(instance.tvaURL).toEqual(
                '/indicators/iptt_report/1/targetperiods/?frequency=1'
            );
            instance.setFrequency(3);
            expect(instance.tvaURL).toEqual(
                '/indicators/iptt_report/1/targetperiods/?frequency=3&timeframe=1'
            );
            instance.setMostRecentCount(3);
            expect(instance.tvaURL).toEqual(
                '/indicators/iptt_report/1/targetperiods/?frequency=3&timeframe=2&numrecentcount=2'
            );
        });
    });
});