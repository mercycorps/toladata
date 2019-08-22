import { Period, PeriodRange, Program } from '../models/programStore';
import programJSON from './fixtures/programStore';
import oneProgramJSON from './fixtures/oneProgram';
import oneProgramFilterJSON from './fixtures/oneProgramFilter';
import otherProgramJSON from './fixtures/otherProgram';
import otherProgramFilterJSON from './fixtures/otherProgramFilter';

describe('Period', () => {
    it('initializes without crashing', () => {
        let periodJSON = [
            "Jan 1, 2018",
            "Jun 30, 2018",
            "False"
        ];
        let instance = new Period(periodJSON);
        expect(instance).not.toBeUndefined();
    });
    describe('initialized period range', () => {
        let periodJsonA = [
            "Jan 1, 2018",
            "Jun 30, 2018",
            "False"
        ];
        let periodJsonB = [
            "Jan 1, 2020",
            "Dec 31, 2020",
            "True"
        ];
        let periodJsonC = [
            "Jan 1, 2018",
            "Dec 31, 2020",
            "Midline"
        ];
        let periodJsonD = [
            "Jan 1, 2018",
            "Dec 31, 2020",
        ];
        it('processes json correctly', () => {
            let instanceA = new Period(periodJsonA, 0, 4);
            expect(instanceA.current).toBeFalsy();
            expect(instanceA.name).toEqual('Semi-annual period 1');
            let instanceB = new Period(periodJsonB, 1, 3);
            expect(instanceB.current).toBeTruthy();
            expect(instanceB.name).toEqual('Year 2');
            let instanceC = new Period(periodJsonC, 0, 2);
            expect(instanceC.current).toBeNull();
            expect(instanceC.name).toEqual("Midline");
            let instanceD = new Period(periodJsonD, 0, 1);
            expect(instanceD.current).toBeNull();
        });
    });
});

describe('PeriodRange', () => {
     it('initializes without crashing', () => {
        let instance = new PeriodRange(3, programJSON[0].periodDateRanges[3]);
        expect(instance).not.toBeUndefined();
     });
     describe('initialized period range', () => {
        var instance;
        beforeEach(() => {
            instance = new PeriodRange(4, programJSON[1].periodDateRanges[4]);
        });
        it('returns the current period', () => {
            expect(instance.getPeriod({current: true}).index).toEqual(2);
        });
        it('returns the last period', () => {
            expect(instance.getPeriod({last: true}).index).toEqual(5);
        });
        it('returns periods starting after a date', () => {
            expect(instance.getPeriod({startAfter: new Date('2018-07-01')}).index).toEqual(1);
            expect(instance.getPeriod({startAfter: new Date('2018-09-01')}).index).toEqual(2);
            expect(instance.getPeriod({startAfter: new Date('2018-07-02')}).index).toEqual(2);
            expect(instance.getPeriod({startAfter: new Date('2018-06-30')}).index).toEqual(1);
        });
        it('returns periods ending before a date', () => {
            expect(instance.getPeriod({endBefore: new Date('2020-06-30')}).index).toEqual(4);
            expect(instance.getPeriod({endBefore:new Date('2020-08-30')}).index).toEqual(4);
            expect(instance.getPeriod({endBefore:new Date('2020-06-29')}).index).toEqual(3);
        });
     });
});

describe('Program', () => {
    it('initializes without crashing', () => {
        let program = new Program(oneProgramFilterJSON);
        expect(program).toBeDefined();
    });
    describe('initialized program (old levels)', () => {
        var instance;
        beforeEach(() => {
            instance = new Program(oneProgramFilterJSON);
            instance.loadReportData(oneProgramJSON);
        });
        it('is defined', () => {
            expect(instance).toBeDefined();
        });
        it('has indicators', () => {
            expect(instance.indicators.length).toEqual(11);
        });
        it('has levels', () => {
            expect(instance.levels.length).toEqual(2);
        });
        it('maps levels to indicators', () => {
            let level = instance.levels.filter(level => level.pk == 3)[0];
            expect(level.name).toEqual("Outcome");
            expect(level.indicators.length).toEqual(3);
        });
    });
    describe('initialized program (new levels)', () => {
        var instance;
        beforeEach(() => {
            instance = new Program(otherProgramFilterJSON);
            instance.loadReportData(otherProgramJSON);
        });
        it('is defined', () => {
            expect(instance).toBeDefined();
        });
        it('has indicators', () => {
            expect(instance.indicators.length).toEqual(69);
        });
        it('has levels', () => {
            expect(instance.levels.length).toEqual(10);
        });
        it('maps levels to indicators', () => {
            let level = instance.levels.filter(level => level.pk == 100)[0];
            expect(level.name).toEqual("Goal Name (1.0.0.0)");
            expect(level.indicators.length).toEqual(2);
        });
    });
});