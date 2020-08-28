import ResultsTable from '../../components/resultsTable';
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, mount } from 'enzyme';
import indicatorResultData from './fixtures/resultsTableIndicators.json';

describe("Results table component", () => {
    describe("with an indicator with no targets and no frequency", () => {
        describe("with editing privileges", () => {
            var testProps = [
                [{editable: true, indicator: indicatorResultData.noTargets1}],
                [{editable: true, indicator: indicatorResultData.noTargets2}]
            ]
            test.each(testProps)("contains wrapper", (props) => {
                expect(shallow(<ResultsTable {...props} />).find('.results-table__wrapper').length).toBe(1);
            });
            test.each(testProps)("contains a div with warning information", (props) => {
                let wrapper = shallow(<ResultsTable {...props} />).find('.results-table__wrapper');
                expect(wrapper.children().length).toBe(1);
                // contains a text-danger div with warning error and target icon:
                let innerWrapper = wrapper.children().first().dive();
                expect(innerWrapper.hasClass('text-danger')).toBeTruthy();
                expect(innerWrapper.text()).toContain("This indicator has no targets.");
                let bullseyeIcon = innerWrapper.childAt(0).dive().find('svg');
                expect(bullseyeIcon.length).toBe(1);
                expect(bullseyeIcon.first().hasClass('fa-bullseye')).toBeTruthy();
                // editable so should contain "add targets link":
                let addTargetLink = innerWrapper.find('a');
                expect(addTargetLink.length).toBe(1);
                expect(addTargetLink.text()).toContain('Add targets');
                let plusIcon = addTargetLink.childAt(0).dive().find('svg');
                expect(plusIcon.length).toBe(1);
                expect(plusIcon.first().hasClass('fa-plus-circle')).toBeTruthy();
            })
        });
        describe("without editing privileges", () => {
            var testProps = [
                [{editable: false, indicator: indicatorResultData.noTargets1}],
                [{editable: false, indicator: indicatorResultData.noTargets2}]
            ]
            test.each(testProps)("contains wrapper", (props) => {
                expect(shallow(<ResultsTable {...props} />).find('.results-table__wrapper').length).toBe(1);
            });
            test.each(testProps)("contains a div with warning information", (props) => {
                let wrapper = shallow(<ResultsTable {...props} />).find('.results-table__wrapper');
                expect(wrapper.children().length).toBe(1);
                let innerWrapper = wrapper.children().first().dive();
                expect(innerWrapper.text()).toContain("This indicator has no targets.");
                let bullseyeIcon = innerWrapper.childAt(0).dive().find('svg');
                expect(bullseyeIcon.length).toBe(1);
                expect(bullseyeIcon.first().hasClass('fa-bullseye')).toBeTruthy();
                // should not contain an add targets link (not editable)
                expect(innerWrapper.find('a').length).toBe(0);
            })
        });
    });
    describe("with a valid indicator and editing privileges", () => {
        var testProps = [
            [{editable: true, indicator: indicatorResultData.lop}],
            [{editable: true, indicator: indicatorResultData.annual}],
            [{editable: true, indicator: indicatorResultData.midEnd}],
            [{editable: true, indicator: indicatorResultData.semiAnnual}],
        ]
        test.each(testProps)("contains wrapper", (props) => {
            expect(shallow(<ResultsTable {...props} />).find('.results-table__wrapper').length).toBe(1);
        });
        test.each(testProps)("contains a results table with appropriate headers", (props) => {
            let wrapper = shallow(<ResultsTable {...props} />).find('.results-table__wrapper');
            expect(wrapper.children().length).toBe(2);
            let table = wrapper.childAt(0).dive();
            expect(table.is('table.results-table')).toBeTruthy();
            expect(table.find('thead').length).toBe(1);
            let headerRow = table.find('thead').first().find('tr').first();
            expect(headerRow.children().length).toBe(6);
            expect(headerRow.childAt(0).text()).toBe("Target period");
            expect(headerRow.childAt(1).text()).toBe("Target");
            expect(headerRow.childAt(2).text()).toBe("Actual");
            expect(headerRow.childAt(3).text()).toBe("% Met");
            expect(headerRow.childAt(4).text()).toBe("Results");
            expect(headerRow.childAt(5).text()).toBe("Evidence");
        });
        test.each(testProps)("contains a LoP row at the bottom of the table", (props) => {
            let wrapper = shallow(<ResultsTable {...props} />).find('.results-table__wrapper');
            let table = wrapper.childAt(0).dive();
            expect(table.find('tbody').length).toBe(1);
            let lopRow = table.find('tbody').first().children().last().dive();
            expect(lopRow.children().length).toBe(5);
            expect(lopRow.childAt(0).find('strong').length).toBe(1);
            expect(lopRow.childAt(0).find('strong').first().text()).toBe("Life of Program");
        })
        test.each(testProps)("contains a results action section with appropriate buttons", (props) => {
            let wrapper = shallow(<ResultsTable {...props} />).find('.results-table__wrapper');
            expect(wrapper.children().length).toBe(2);
            let actions = wrapper.childAt(1).dive();
            expect(actions.is('div.results-table__actions')).toBeTruthy();
            expect(actions.find('.cd-actions__message').length).toBe(1);
            expect(actions.find('.cd-actions__button').length).toBe(1);
            let actionsButton = actions.find('.cd-actions__button').first().find('a').first();
            expect(actionsButton.text()).toContain("Add result");
            expect(actionsButton.childAt(0).dive().find('svg').length).toBe(1);
            expect(actionsButton.childAt(0).dive().find('svg').length).toBe(1);
            expect(actionsButton.childAt(0).dive().find('svg').hasClass('fa-plus-circle')).toBeTruthy();
        });
            test.each(testProps)("matches snapshot", (props) => {
            const tree = renderer.create(<ResultsTable {...props} />).toJSON();
            expect(tree).toMatchSnapshot()
        });
    });
    describe("with a valid indicator and no editing privileges", () => {
        var testProps = [
            [{editable: false, indicator: indicatorResultData.lop}],
            [{editable: false, indicator: indicatorResultData.annual}],
            [{editable: false, indicator: indicatorResultData.midEnd}],
            [{editable: false, indicator: indicatorResultData.semiAnnual}],
        ]
        test.each(testProps)("contains wrapper", (props) => {
            expect(shallow(<ResultsTable {...props} />).find('.results-table__wrapper').length).toBe(1);
        });
        test.each(testProps)("contains a results table with appropriate headers", (props) => {
            let wrapper = shallow(<ResultsTable {...props} />).find('.results-table__wrapper');
            expect(wrapper.children().length).toBe(2);
            let table = wrapper.childAt(0).dive();
            expect(table.is('table.results-table')).toBeTruthy();
            expect(table.find('thead').length).toBe(1);
            let headerRow = table.find('thead').first().find('tr').first();
            expect(headerRow.children().length).toBe(6);
            expect(headerRow.childAt(0).text()).toBe("Target period");
            expect(headerRow.childAt(1).text()).toBe("Target");
            expect(headerRow.childAt(2).text()).toBe("Actual");
            expect(headerRow.childAt(3).text()).toBe("% Met");
            expect(headerRow.childAt(4).text()).toBe("Results");
            expect(headerRow.childAt(5).text()).toBe("Evidence");
        });
        test.each(testProps)("contains a LoP row at the bottom of the table", (props) => {
            let wrapper = shallow(<ResultsTable {...props} />).find('.results-table__wrapper');
            let table = wrapper.childAt(0).dive();
            expect(table.find('tbody').length).toBe(1);
            let lopRow = table.find('tbody').first().children().last().dive();
            expect(lopRow.children().length).toBe(5);
            expect(lopRow.childAt(0).find('strong').length).toBe(1);
            expect(lopRow.childAt(0).find('strong').first().text()).toBe("Life of Program");
        })
        test.each(testProps)("contains a results action section with no buttons", (props) => {
            let wrapper = shallow(<ResultsTable {...props} />).find('.results-table__wrapper');
            expect(wrapper.children().length).toBe(2);
            let actions = wrapper.childAt(1).dive();
            expect(actions.is('div.results-table__actions')).toBeTruthy();
            expect(actions.find('.cd-actions__message').length).toBe(1);
            expect(actions.find('.cd-actions__button').length).toBe(0);
        });
        test.each(testProps)("matches snapshot", (props) => {
            const tree = renderer.create(<ResultsTable {...props} />).toJSON();
            expect(tree).toMatchSnapshot()
        });
    });
    describe("result rows", () => {
        describe("for a lop indicator with no results", () => {
            var props = {editable: true, indicator: indicatorResultData.lop};
            var tableBody;
            beforeEach(() => {
                let wrapper = shallow(<ResultsTable {...props} />).find('.results-table__wrapper');
                tableBody = wrapper.childAt(0).dive().find('tbody').first();
            });
            it("contains a result row", () => {
                let resultRow = tableBody.childAt(0).dive().find('tr').first();
                expect(resultRow.is('tr.results__row--main')).toBeTruthy();
                expect(resultRow.childAt(0).is('td.results__row__target-period')).toBeTruthy();
                expect(resultRow.childAt(0).childAt(0).childAt(0).is('strong.text-uppercase')).toBeTruthy();
                expect(resultRow.childAt(0).childAt(0).childAt(0).text()).toBe("Life of program (LoP) only")
                expect(resultRow.childAt(0).children().length).toBe(1);
            });
        });
        describe("for an annual indicator with results", () => {
            var props = {editable: true, indicator: indicatorResultData.annual};
            var tableBody;
            beforeEach(() => {
                let wrapper = shallow(<ResultsTable {...props} />).find('.results-table__wrapper');
                tableBody = wrapper.childAt(0).dive().find('tbody').first();
            });
            it("contains result rows", () => {
                let firstYearRow = tableBody.childAt(0).dive().find('tr').first();
                expect(firstYearRow.is('tr.results__row--main')).toBeTruthy();
                expect(firstYearRow.childAt(0).text()).toContain("Year 1");
                expect(firstYearRow.childAt(0).text()).toContain("Jan 1, 2018 – Dec 31, 2018");
                expect(firstYearRow.childAt(1).is('td.text-right')).toBeTruthy();
                expect(firstYearRow.childAt(1).text()).toBe("100");
                expect(firstYearRow.childAt(2).is('td.text-right')).toBeTruthy();
                expect(firstYearRow.childAt(2).text()).toBe("—");
                expect(firstYearRow.childAt(3).is('td.text-right.td--pad')).toBeTruthy();
                expect(firstYearRow.childAt(3).text()).toBe("N/A");
                expect(firstYearRow.childAt(4).is('td.results__result--nodata')).toBeTruthy();
                expect(firstYearRow.childAt(4).props().colSpan).toBe("2");
                expect(firstYearRow.childAt(4).text()).toBe("No results reported");
                expect(firstYearRow.childAt(5).html()).toBe("<td></td>");
                let secondYearRow = tableBody.childAt(1).dive().find('tr').first();
                expect(secondYearRow.is('tr.results__row--main')).toBeTruthy();
                expect(secondYearRow.childAt(0).text()).toContain("Year 2");
                expect(secondYearRow.childAt(0).text()).toContain("Jan 1, 2019 – Dec 31, 2019");
                expect(secondYearRow.childAt(1).text()).toBe("200");
                expect(secondYearRow.childAt(2).text()).toBe("185");
                expect(secondYearRow.childAt(3).childAt(0).dive().text()).toContain('92.5%');
                let progressRow = tableBody.childAt(1).dive().find('tr').at(1);
                expect(progressRow.is('tr.results__row--subtotal')).toBeTruthy();
                expect(progressRow.childAt(0).text()).toContain("Program to date");
                expect(progressRow.childAt(0).text()).toContain("Jan 1, 2018 – Dec 31, 2019");
                expect(progressRow.childAt(1).childAt(0).html()).toBe("<strong>300</strong>");
                expect(progressRow.childAt(2).text()).toContain("185");
                let progressMetCell = progressRow.childAt(3).childAt(0).dive();
                expect(progressMetCell.text()).toContain("61.67%");
                expect(progressMetCell.html()).toContain("Not on track");
                let thirdYearRow = tableBody.childAt(2).dive().find('tr').first();
                expect(thirdYearRow.is('tr.results__row--main')).toBeTruthy();
                let thirdYearRow2 = tableBody.childAt(2).dive().find('tr').at(1);
                expect(thirdYearRow2.is('tr.results__row--supplemental')).toBeTruthy();
            });
            it("matches snapshot", () => {
                const tree = renderer.create(<ResultsTable {...props} />).toJSON();
                expect(tree).toMatchSnapshot()
            });
        });
    });
});