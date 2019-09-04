import '../../../../test_helpers/django_i18n_stubs';
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import IndicatorList, { StatusHeader, IndicatorFilter, IndicatorListTable } from '../../components/indicator_list';
import { IndicatorFilterType } from '../../../../constants';


import eventBus from '../../../../eventbus';

jest.mock('../../../../eventbus');

describe("Indicator List elements", () => {
    describe("Status Header component", () => {
        let props = {
            indicatorCount: 10,
            programId: 144,
            currentIndicatorFilter: null,
            filterApplied: false,
            readonly: false
        };
        it("renders without crashing", () => {
            const component = renderer.create(
                <StatusHeader {...props} />
            );
            expect(component.toJSON()).toMatchSnapshot();
            const wrapper = shallow(
                <StatusHeader {...props} />
            );
            expect(wrapper.find('div > div').children().length).toBe(1);
            expect(wrapper.find('#show-all-indicators').exists()).toBeFalsy();
        });
        it("renders read only", () => {
            const component = renderer.create(
                <StatusHeader {...props} readonly={true} />
            );
            expect(component.toJSON()).toMatchSnapshot();
            const wrapper = shallow(
                <StatusHeader {...props} readonly={true} />
            );
            expect(wrapper.find('div > div').children().length).toBe(0);
            expect(wrapper.find('#show-all-indicators').exists()).toBeFalsy();
        });
        it("renders filter applied", () => {
            const component = renderer.create(
                <StatusHeader {...props} filterApplied={true} />
            );
            expect(component.toJSON()).toMatchSnapshot();
            const wrapper = shallow(
                <StatusHeader {...props} filterApplied={true} />
            );
            expect(wrapper.find('div > div').children().length).toBe(1);
            expect(wrapper.find('#show-all-indicators').exists()).toBeTruthy();
        });
        it("calls for filter title", () => {
            const component = renderer.create(
                <StatusHeader {...props} filterApplied={true}
                indicatorCount={15}
                currentIndicatorFilter={IndicatorFilterType.aboveTarget} />
            );
            expect(component.toJSON()).toMatchSnapshot();
            const wrapper = shallow(
                <StatusHeader {...props} filterApplied={true}
                indicatorCount={15}
                currentIndicatorFilter={IndicatorFilterType.aboveTarget} />
            );
            expect(wrapper.find('div > div').children().length).toBe(1);
            //correct title text:
            expect(wrapper.find('div > h3 > span').text()).toEqual("%s indicator is >15% above target");
            // show all link is displayed:
            expect(wrapper.find('#show-all-indicators').exists()).toBeTruthy();
            expect(wrapper.find('#show-all-indicators').shallow().find('small').first().text()).toBe("Show all");
            //text was translated:
            expect(window.gettext).toHaveBeenCalledWith('Show all');
        });
    });
    describe("Indicator Filter component", () => {
        var props;
        beforeEach(() => {
            props = {
                rootStore: {
                    allIndicators: []
                },
                uiStore: {
                    resultChainFilterLabel: 'label',
                    selectedGroupByOption: null,
                    selectedIndicatorId: null,
                    groupByOptions: []
                }
            };
        });
        it("renders without crashing", () => {
            const component = renderer.create(
                <IndicatorFilter {...props} />
            );
            expect(component.toJSON()).not.toBeUndefined();
        });
        it("renders indicator options", () => {
            const indicatorOptions = [
                {pk: 1, name: 'one'},
                {pk: 2, name: 'two'}
            ];
            const expectedOptions = [
                {value: 1, label: 'one'},
                {value: 2, label: 'two'}
            ];
            props.rootStore.allIndicators = indicatorOptions;
            props.uiStore.selectedIndicatorId = 1;
            props.uiStore.setSelectedIndicatorId = jest.fn();
            const wrapper = shallow(
                <IndicatorFilter {...props} />
            );
            const indicatorSelectDiv = wrapper.find('.form-group').at(0).shallow();
            expect(indicatorSelectDiv.find('label').first().text()).toEqual("Find an indicator:");
            expect(window.gettext).toHaveBeenCalledWith("Find an indicator:");
            const indicatorSelect =  indicatorSelectDiv.find('div > div').childAt(0).shallow();
            expect(indicatorSelect.props().options).toEqual(expectedOptions);
            expect(indicatorSelect.props().value).toEqual(expectedOptions[0]);
            indicatorSelect.simulate('change', expectedOptions[1]);
            expect(eventBus.emit).toHaveBeenCalledWith('nav-select-indicator-to-filter', 2);
            //expect(props.uiStore.setSelectedIndicatorId).toHaveBeenCalledWith(2);
        });
        
        it("renders group by options", () => {
            const groupByOptions = [
                {value: 1, label: 'chain'},
                {value: 2, label: 'level'}
            ];
            props.uiStore.groupByOptions = groupByOptions;
            props.uiStore.selectedGroupByOption = 1;
            props.uiStore.setGroupBy = jest.fn();
            const wrapper = shallow(
                <IndicatorFilter {...props} />
            );
            expect(wrapper.find('.form-group').length).toBe(2);
            const groupBySelectDiv = wrapper.find('.form-group').at(1).shallow();
            expect(groupBySelectDiv.find('label').first().text()).toEqual("Group indicators:");
            expect(window.gettext).toHaveBeenCalledWith("Group indicators:");
            const groupBySelect =  groupBySelectDiv.find('div > div').childAt(0).shallow();
            expect(groupBySelect.props().options).toEqual(groupByOptions);
            expect(groupBySelect.props().value).toEqual(1);
            groupBySelect.simulate('change', groupByOptions[1]);
            expect(props.uiStore.setGroupBy).toHaveBeenCalledWith(2);
        });
    });
    describe("Indicator List Table component", () => {
        var props;
        beforeEach(() => {
            props = {
                indicators: [],
                program: {
                    resultsMap: new Map()
                }
            };
        });
        it("renders without crashing", () => {
            const component = renderer.create(
                <IndicatorListTable {...props} />
            );
            expect(component.toJSON()).toMatchSnapshot();
        });
    });
});

describe("Indicator List component", () => {
    it.skip("nothing yet", () => {});
});
