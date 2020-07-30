import ResultsTable from '../../components/resultsTable';
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, mount } from 'enzyme';


describe("Results table", () => {
    var resultsTable;
    describe("when initialized with completed indicator and results data", () => {
        let props = {
            indicator: {
                pk: 31,
                frequency: 1
            },
            periodicTargets: [],
            resultsWithoutTargets: [],
            editable: true
        };
        beforeEach(() => {
            resultsTable = shallow(<ResultsTable {...props} />);
        });
        it("initializes without crashing", () => {
            expect(resultsTable).not.toBeUndefined();
        });
        it("contains wrapper and table", () => {
            expect(resultsTable.find('div.results-table__wrapper').exists()).toBeTruthy();
            expect(resultsTable.find('table').exists()).toBeTruthy();
        });
    });
    describe("lop target indicator", () => {
        let props = {
            indicator: {
                pk: 149,
                frequency: 1
            },
            periodicTargets: [],
            resultsWithoutTargets: [],
            editable: true
        };
        describe("with no results", () => {
            beforeEach(() => {
                props.periodicTargets = [
                    {
                        name: "Life of program (LoP) only",
                        target: 100,
                        actual: null,
                        met: null,
                        results: []
                    }
                ];
                resultsTable = mount(<ResultsTable {...props} />);
            });
            it("contains a lop period row", () => {
                let tableBody = resultsTable.find('table > tbody');
                console.log("table body", tableBody.html());
                console.log("table body find", tableBody.find('tr'));
                console.log("table body find", tableBody.find('tr.results__row--main').getElements());
                expect(tableBody.exists()).toBeTruthy();
                expect(tableBody.find('tr.results__row--main')).toHaveLength(1);
                expect(tableBody.find('tr.results__row--supplement').exists()).toBeFalsy();
            });
        })
    });
    describe("when initialized with no frequency and no results indicator", () => {
        let props = {
            indicator: {
                pk: 44,
                frequency: null
            },
            periodicTargets: [],
            resultsWithoutTargets: [],
            editable: true
        };
        beforeEach(() => {
            resultsTable = mount(<ResultsTable {...props} />);
        });
        it("initializes without crashing", () => {
            expect(resultsTable).not.toBeUndefined();
        });
        it("contains wrapper, no table, and warning message", () => {
            expect(resultsTable.find('div.results-table__wrapper').exists()).toBeTruthy();
            expect(resultsTable.find('table').exists()).toBeFalsy();
            expect(resultsTable.find("div.text-danger").exists()).toBeTruthy();
            expect(resultsTable.find("div.text-danger").first().text()).toContain("This indicator has no targets");
            expect(resultsTable.find("div.text-danger").find("a").exists()).toBeTruthy();
            expect(resultsTable.find("div.text-danger").find("a").first().prop("href")).toEqual("/indicators/indicator_update/44/");
            expect(resultsTable.find("div.text-danger").find("a").first().text()).toContain("Add targets");
        })
    })
});