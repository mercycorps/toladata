import QSRootStore from '../models/ipttQSRootStore';
import { BLANK_OPTION } from '@root/constants';

const jsContext = {
    iptt_url: "/test_iptt_url/",
    initial_selected_program_id: null,
    programs: [
        {
            "pk": 11,
            "name": "Program name",
            "has_started": true,
            "frequencies": [1, 2, 3],
            "period_date_ranges": {
                "3": [{
                        "past": true
                    }, {
                        "past": true
                    }, {
                        "past": true
                    }, {
                        "past": false
                    }, {
                        "past": false
                    }
                ]
            }
        }, {
            "pk": 12,
            "name": "No frequencies program",
            "has_started": true,
            "frequencies": [],
            "period_date_ranges": {}
        }, {
            "pk": 15,
            "name": "Past program name",
            "has_started": true,
            "frequencies": [1, 5],
            "period_date_ranges": {
                "5": [{
                        "past": true
                    }, {
                        "past": true
                    }, {
                        "past": true
                    }, {
                        "past": true
                    }
                ]
            }
        }
    ]
};

describe('IPTT QS Root Store', () => {
    it('initializes without errors', () => {
        let store = new QSRootStore(jsContext);
        expect(store).not.toBeUndefined();
    });
    describe('IPTT QS Root Store TVA side', () => {
        let store;
        beforeEach(() => {
            store = new QSRootStore(jsContext);
        });
        it('shows no program selected', () => {
            expect(store.selectedTVAProgram).toMatchObject(BLANK_OPTION);
            expect(store.selectedTimeperiodsProgram).toMatchObject(BLANK_OPTION);
            expect(store.selectedFrequency).toMatchObject(BLANK_OPTION);
            expect(store.periodCountDisabled).toBeTruthy();
            expect(store.mostRecentCountDisplay).toBeFalsy();
            expect(store.mostRecent).toBeFalsy();
            expect(store.tvaURL).toBeFalsy();
            expect(store.timeperiodsURL).toBeFalsy();
        });
        it('does not show frequency-less programs', () => {
            let tvaPks = store.tvaProgramOptions.map(option => option.value);
            expect(tvaPks).toContain(11);
            expect(tvaPks).not.toContain(12);
        });
        describe("with in progress program selected", () => {
            beforeEach(() => {
                store.setTVAProgram(11);
            });
            it('reports correct selection', () => {
                expect(store.selectedTVAProgram.value).toBe(11);
                expect(store.selectedTVAProgram.label).toBe("Program name");
            });
            it("reports no frequency selected", () => {
                expect(store.selectedFrequency).toMatchObject(BLANK_OPTION);
                expect(store.periodCountDisabled).toBeTruthy();
                expect(store.mostRecentCountDisplay).toBeFalsy();
                expect(store.mostRecent).toBeFalsy();
                expect(store.tvaURL).toBeFalsy();
            });
            it("reports frequency options", () => {
                let frequencyOptions = store.frequencyOptions;
                expect(frequencyOptions).toHaveLength(3);
                expect(frequencyOptions.map(option => option.value)).toEqual([1, 2, 3]);
            });
            describe("with irregular frequency selected", () => {
                let irregularFrequencies = [
                    {frequency: 1, label: "Life of Program (LoP) only"},
                    {frequency: 2, label: "Midline and endline"}
                ];
                irregularFrequencies.forEach(testCase => {
                    it(`shows correct selected frequency for ${testCase.label}`, () => {
                        store.setFrequency(testCase.frequency);
                        expect(store.selectedFrequency.value).toBe(testCase.frequency);
                        expect(store.selectedFrequency.label).toBe(testCase.label);
                        expect(store.periodCountDisabled).toBeTruthy();
                        expect(store.mostRecentCountDisplay).toBeFalsy();
                        expect(store.mostRecent).toBeFalsy();
                        expect(store.tvaURL).toBe(`/test_iptt_url/11/targetperiods/?frequency=${testCase.frequency}`);
                    });
                });
            });
            describe("with regular frequency selected", () => {
                beforeEach(() => {
                    store.setFrequency(3);
                });
                it("shows correct selected frequency for annual", () => {
                    expect(store.selectedFrequency.value).toBe(3);
                    expect(store.selectedFrequency.label).toBe("Annual");
                    expect(store.periodCountDisabled).toBeFalsy();
                    expect(store.mostRecentCountDisplay).toBeFalsy();
                    expect(store.mostRecent).toBeFalsy();
                    expect(store.showAll).toBeTruthy();
                    expect(store.tvaURL).toBe("/test_iptt_url/11/targetperiods/?frequency=3&start=0&end=4");
                });
                it("accepts a most recent radio setting", () => {
                    expect(store.showAll).toBeTruthy();
                    expect(store.tvaURL).toBe("/test_iptt_url/11/targetperiods/?frequency=3&start=0&end=4");
                    expect(store.mostRecent).toBeFalsy();
                    expect(store.mostRecentCountDisplay).toBeFalsy();
                    store.setMostRecent();
                    expect(store.mostRecent).toBeTruthy();
                    expect(store.mostRecentCountDisplay).toBeFalsy();
                    expect(store.showAll).toBeFalsy();
                    expect(store.tvaURL).toBeFalsy();
                });
                const validMostRecents = [
                    {mostRecent: 1, start: 2},
                    {mostRecent: 2, start: 1},
                    {mostRecent: 3, start: 0}
                ];
                validMostRecents.forEach(validEntry => {
                    it(`accepts a most recent number setting of ${validEntry.mostRecent}`, () => {
                        expect(store.showAll).toBeTruthy();
                        expect(store.mostRecent).toBeFalsy();
                        expect(store.mostRecentCountDisplay).toBeFalsy();
                        store.setMostRecentCount(validEntry.mostRecent);
                        expect(store.mostRecentCountDisplay).toBe(validEntry.mostRecent);
                        expect(store.mostRecent).toBeTruthy();
                        expect(store.tvaURL).toBe(`/test_iptt_url/11/targetperiods/?frequency=3&start=${validEntry.start}&end=2`);
                    });
                });
                it("accepts an invalid most recent setting (too big)", () => {
                    expect(store.showAll).toBeTruthy();
                        expect(store.mostRecent).toBeFalsy();
                        expect(store.mostRecentCountDisplay).toBeFalsy();
                        store.setMostRecentCount(200);
                        expect(store.mostRecentCountDisplay).toBe(200);
                        expect(store.mostRecent).toBeTruthy();
                        expect(store.tvaURL).toBe("/test_iptt_url/11/targetperiods/?frequency=3&start=0&end=2");
                });
            });
        });
        describe("with completed program selected", () => {
            beforeEach(() => {
                store.setTVAProgram(15);
            });
            it('reports correct selection', () => {
                expect(store.selectedTVAProgram.value).toBe(15);
                expect(store.selectedTVAProgram.label).toBe("Past program name");
            });
            it("reports no frequency selected", () => {
                expect(store.selectedFrequency).toMatchObject(BLANK_OPTION);
                expect(store.periodCountDisabled).toBeTruthy();
                expect(store.mostRecentCountDisplay).toBeFalsy();
                expect(store.mostRecent).toBeFalsy();
                expect(store.tvaURL).toBeFalsy();
            });
            it("reports frequency options", () => {
                let frequencyOptions = store.frequencyOptions;
                expect(frequencyOptions).toHaveLength(2);
                expect(frequencyOptions.map(option => option.value)).toEqual([1, 5]);
            });
            describe("with regular frequency selected", () => {
                beforeEach(() => {
                    store.setFrequency(5);
                });
                it("shows correct selected frequency for ", () => {
                    expect(store.selectedFrequency.value).toBe(5);
                    expect(store.selectedFrequency.label).toBe("Tri-annual");
                    expect(store.periodCountDisabled).toBeFalsy();
                    expect(store.mostRecentCountDisplay).toBeFalsy();
                    expect(store.mostRecent).toBeFalsy();
                    expect(store.showAll).toBeTruthy();
                    expect(store.tvaURL).toBe("/test_iptt_url/15/targetperiods/?frequency=5&start=0&end=3");
                });
                it("accepts a most recent radio setting", () => {
                    expect(store.showAll).toBeTruthy();
                    expect(store.tvaURL).toBe("/test_iptt_url/15/targetperiods/?frequency=5&start=0&end=3");
                    expect(store.mostRecent).toBeFalsy();
                    expect(store.mostRecentCountDisplay).toBeFalsy();
                    store.setMostRecent();
                    expect(store.mostRecent).toBeTruthy();
                    expect(store.mostRecentCountDisplay).toBeFalsy();
                    expect(store.showAll).toBeFalsy();
                    expect(store.tvaURL).toBeFalsy();
                });
                const validMostRecents = [
                    {mostRecent: 1, start: 3},
                    {mostRecent: 2, start: 2},
                    {mostRecent: 3, start: 1}
                ];
                validMostRecents.forEach(validEntry => {
                    it(`accepts a most recent number setting of ${validEntry.mostRecent}`, () => {
                        expect(store.showAll).toBeTruthy();
                        expect(store.mostRecent).toBeFalsy();
                        expect(store.mostRecentCountDisplay).toBeFalsy();
                        store.setMostRecentCount(validEntry.mostRecent);
                        expect(store.mostRecentCountDisplay).toBe(validEntry.mostRecent);
                        expect(store.mostRecent).toBeTruthy();
                        expect(store.tvaURL).toBe(`/test_iptt_url/15/targetperiods/?frequency=5&start=${validEntry.start}&end=3`);
                    });
                });
                it("accepts a most recent settiung equivalent to show all", () => {
                    store.setMostRecentCount(4);
                    expect(store.mostRecentCountDisplay).toBe(4);
                    expect(store.mostRecent).toBeTruthy();
                    expect(store.showAll).toBeFalsy();
                    expect(store.tvaURL).toBe(`/test_iptt_url/15/targetperiods/?frequency=5&start=0&end=3&mr=1`);
                })
            });
        });
    })
});