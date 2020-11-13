import React from 'react';
import { toJS } from 'mobx'
import { shallow, mount } from "enzyme";
import { CountryStore } from '../models'
import EditDisaggregations, {
    CheckBoxList,
    DisaggregationType,
    RetroProgramCheckBoxWrapper
} from '../components/edit_disaggregations'
import { countryDisaggregationData } from '../__fixtures__/countryAdminFixtures'
import api from '../api'
jest.mock('../api');
import {create_unified_changeset_notice} from '../../../../components/changesetNotice';
jest.mock('../../../../components/changesetNotice')

api.fetchCountries.mockResolvedValue([
        {id: 100, country: "First Country"},
        {id: 101, country: "Second Country"},
    ]);
api.updateDisaggregation.mockResolvedValue(() => ({data: []}));

describe("Country admin update/create methods ", () => {
    let store = new CountryStore(api, {});
    store.editing_disaggregations_data = countryDisaggregationData;

    it("find dupe indexes correctly", () => {
        let testList = ["same", "same", "diff"];
        expect(store.findDuplicateLabelIndexes(testList)).toEqual([0,1]);
        testList = ["same", "diff", "diff2", "same"];
        expect(store.findDuplicateLabelIndexes(testList)).toEqual([0,3]);
        testList = ["diff", "same", "diff2", "same"];
        expect(store.findDuplicateLabelIndexes(testList)).toEqual([1,3]);
        testList = ["diff", "same", "same", "same"];
        expect(store.findDuplicateLabelIndexes(testList)).toEqual([1,2,3]);
        testList = ["same", "same", "same", "same"];
        expect(store.findDuplicateLabelIndexes(testList)).toEqual([0,1,2,3]);
    });

    it("prevent duplicate labels in the same disagg type from being saved", () => {
        store.updateDisaggregation(
            100,
            {
                disaggregation_type: "C1 First Disaggregation",
                labels: [{label: "First"}, {label: "First"}]
            }

        );
        expect(api.updateDisaggregation).not.toHaveBeenCalled();

        store.updateDisaggregation(
            100,
            {
                disaggregation_type: "C1 First Disaggregation",
                labels: [{label: "First"}, {label: "Second"}]
            }
        );
        expect(api.updateDisaggregation).toHaveBeenCalled();
    });
    it("allow labels with same name to be saved in different disagg types", () => {
        store.updateDisaggregation(
            100,
            {
                disaggregation_type: "C1 First Disaggregation",
                labels: [{label: "First"}, {label: "Second"}]
            }

        );
        store.updateDisaggregation(
            101,
            {
                disaggregation_type: "C1 Second Disaggregation",
                labels: [{label: "First"}, {label: "Second"}]
            }
        );
        expect(api.updateDisaggregation).toHaveBeenCalled();
    });
    it("prevent creation of disagg types of same name in same country", () => {
        store.createDisaggregation(
            {
                disaggregation_type: "C1 Second Disaggregation",
                labels: [{label: "First"}, {label: "Second"}],
                country: 100
            }
        );
        expect(api.createDisaggregation).not.toHaveBeenCalled();
    });


});

describe("Country admin retroactive disagg features in store", () => {
    let store = new CountryStore(api, {});
    store.editing_disaggregations_data = countryDisaggregationData;

    it("trigger the correct notification when changed", () => {
        let wrapper = shallow(<EditDisaggregations disaggregations={store.editing_disaggregations_data}/>)

        wrapper.instance().state.origSelectedByDefault = true;
        let data = {selected_by_default: false};
        wrapper.instance().onSaveChangesPress(data);
        expect(create_unified_changeset_notice).toHaveBeenCalled();
        let preamble = create_unified_changeset_notice.mock.calls[0][0].preamble;
        expect(preamble.includes('will no longer be automatically') && preamble.includes('will be unaffected')).toBeTruthy();

        wrapper.instance().state.origSelectedByDefault = false;
        data = {selected_by_default: true};
        wrapper.instance().onSaveChangesPress(data);
        expect(create_unified_changeset_notice).toHaveBeenCalled();
        preamble = create_unified_changeset_notice.mock.calls[1][0].preamble;
        expect(preamble.includes('will be automatically') && preamble.includes('will be unaffected')).toBeTruthy();

        wrapper.instance().state.origSelectedByDefault = false;
        data = {selected_by_default: true, retroPrograms: [3]};
        wrapper.instance().onSaveChangesPress(data);
        expect(create_unified_changeset_notice).toHaveBeenCalled();
        preamble = create_unified_changeset_notice.mock.calls[2][0].preamble;
        expect(preamble.includes('will be automatically') && preamble.includes('and for existing')).toBeTruthy();

    });

    it("don't trigger notifications when not changed", () => {
        create_unified_changeset_notice.mockClear()
        let wrapper = shallow(<EditDisaggregations disaggregations={store.editing_disaggregations_data}/>);
        wrapper.instance().saveDisaggregation = jest.fn()
        wrapper.instance().state.origSelectedByDefault = false;
        let data = {selected_by_default: false};
        wrapper.instance().onSaveChangesPress(data);
        expect(create_unified_changeset_notice).not.toHaveBeenCalled();
        expect(wrapper.instance().saveDisaggregation).toHaveBeenCalled();
    });

    it("provide country-specific programs", () => {
        store.allPrograms = [
            {id: 1, name: "Program 1", country: [1]},
            {id: 2, name: "Program 2", country: [2]},
            {id: 3, name: "Program 3", country: [1]},
        ];
        let filteredPrograms = store.getCountryPrograms(1)
        expect(filteredPrograms.length).toEqual(2)
        filteredPrograms = store.getCountryPrograms(2)
        expect(filteredPrograms).toEqual([{id: 2, name: "Program 2", country: [2]}])
        filteredPrograms = store.getCountryPrograms(3)
        expect(filteredPrograms).toEqual([])
    });
});

describe("Country admin disagg presentation components", () => {
    let store = new CountryStore(api, {});
    store.editing_disaggregations_data = countryDisaggregationData;
    let saveDisaggregation = jest.fn()

    it("displays retro programs only on create and when selected by default is checked", () => {

        const disaggregation = store.editing_disaggregations_data[0]
        const programsForRetro = [
            {id: 200, name: "Program 1", checked: false},
            {id: 201, name: "Program 2", checked: false}
        ]
        disaggregation.id = "new"
        disaggregation.disaggregation_type = "New Disagg"
        let wrapper = shallow(<DisaggregationType
            programs={programsForRetro}
            disaggregation={disaggregation}
            expanded={true}
            errors={{}}
        />);
        expect(wrapper.containsMatchingElement(<RetroProgramCheckBoxWrapper />)).toEqual(false);
        wrapper.setState({selected_by_default: true})
        expect(wrapper.containsMatchingElement(<RetroProgramCheckBoxWrapper />)).toEqual(true);

        disaggregation.id = "new"
        wrapper = shallow(<DisaggregationType
            programs={programsForRetro}
            disaggregation={disaggregation}
            expanded={true}
            errors={{}}
        />);
        expect(wrapper.containsMatchingElement(<RetroProgramCheckBoxWrapper />)).toEqual(false);
    });

    it("displays programs in alpha order", () => {
        const programsForRetro = [
            {id: 201, name: "Program 2", checked: false},
            {id: 200, name: "Program 1", checked: false}

        ]
        let wrapper = mount(<RetroProgramCheckBoxWrapper programs={programsForRetro}/>);
        let checkBoxList = wrapper.find(CheckBoxList)
        expect(checkBoxList.props().checkBoxOptions).toEqual(programsForRetro.reverse())
    });

    // See note on next test about why this one is skipped.  Because that test isn't working right, this one
    // probably isn't working right either, even though it's passing.
    it.skip("doesn't include programs in saved data when none are checked", () => {
        const programsForRetro = [
            {id: 200, name: "Program 1", checked: false},
            {id: 201, name: "Program 2", checked: false}
        ]
        const disaggregation = store.editing_disaggregations_data[0]
        disaggregation.id = "new"
        let wrapper = shallow(<DisaggregationType
            programs={programsForRetro}
            disaggregation={disaggregation}
            saveDisaggregation={(data) => saveDisaggregation(data)}
        />)
        wrapper.instance().save()
        expect(saveDisaggregation.mock.calls[0][0]).toEqual(disaggregation)


    });
    // Skipping because the value of the "checked" property of Program 2 in programsForRetro isn't being
    // picked up when the save method is called.  An object with getter/setter values gets sent to the
    // saveDisaggregation mock, instead of a plain object.  Could this be because it's a MobX observable?
    it.skip("includes programs in saved data when one or more are checked", () => {
        const programsForRetro = [
            {id: 200, name: "Program 1", checked: false},
            {id: 201, name: "Program 2", checked: true}
        ]
        let disaggregation = {...store.editing_disaggregations_data[0]}
        disaggregation.selected_by_default = true;
        disaggregation.id = "new"
        disaggregation.disaggregation_type = "New Disagg"
        let wrapper = mount(<DisaggregationType
            programs={programsForRetro}
            disaggregation={disaggregation}
            saveDisaggregation={(data) => saveDisaggregation(data)}
        />)
        wrapper.instance().save()
        let expectedValue = {...disaggregation}
        expectedValue.retroPrograms = [201]
        expect(saveDisaggregation.mock.calls[0][0]).toEqual(expectedValue)
    });
});
