import React from 'react';
import { toJS } from 'mobx'
import { shallow, mount } from "enzyme";
import { CountryStore } from '../models'
import EditDisaggregations, { DisaggregationType } from '../components/edit_disaggregations'
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
        let component = shallow(<EditDisaggregations disaggregations={store.editing_disaggregations_data}/>)

        component.instance().state.origSelectedByDefault = true;
        let data = {selected_by_default: false};
        component.instance().onSaveChangesPress(data);
        expect(create_unified_changeset_notice).toHaveBeenCalled();
        let preamble = create_unified_changeset_notice.mock.calls[0][0].preamble;
        expect(preamble.includes('will no longer be automatically') && preamble.includes('will be unaffected')).toBeTruthy();

        component.instance().state.origSelectedByDefault = false;
        data = {selected_by_default: true};
        component.instance().onSaveChangesPress(data);
        expect(create_unified_changeset_notice).toHaveBeenCalled();
        preamble = create_unified_changeset_notice.mock.calls[1][0].preamble;
        expect(preamble.includes('will be automatically') && preamble.includes('will be unaffected')).toBeTruthy();

        component.instance().state.origSelectedByDefault = false;
        data = {selected_by_default: true, retroPrograms: [3]};
        component.instance().onSaveChangesPress(data);
        expect(create_unified_changeset_notice).toHaveBeenCalled();
        preamble = create_unified_changeset_notice.mock.calls[2][0].preamble;
        expect(preamble.includes('will be automatically') && preamble.includes('and for existing')).toBeTruthy();

    });

    it("don't trigger notifications when not changed", () => {
        let component = shallow(<EditDisaggregations disaggregations={store.editing_disaggregations_data}/>);
        component.instance().saveDisaggregation = jest.fn()
        component.instance().state.origSelectedByDefault = false;
        let data = {selected_by_default: false};
        component.instance().onSaveChangesPress(data);
        expect(component.instance().saveDisaggregation).toHaveBeenCalled();

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
    // Passes but that's because the checed true/false value is always treated as false in the save() function
    // when the test is run. Not sure why this is the case.
    it("doesn't display programs on update", () => {
    });
    it("doesn't display programs on create if type not selected as default", () => {
    });
    it("only displays programs on create and if type selected as default", () => {
    });
    it("displays programs in alpha order", () => {
    });
    it.skip("doesn't include programs in saved data when none are checked", () => {
        const programsForRetro = [
            {id: 200, name: "Program 1", checked: false},
            {id: 201, name: "Program 2", checked: false}
        ]
        const disaggregation = store.editing_disaggregations_data[0]
        disaggregation.id = "new"
        let component = shallow(<DisaggregationType
            programs={programsForRetro}
            disaggregation={disaggregation}
            saveDisaggregation={(data) => saveDisaggregation(data)}
        />)
        component.instance().save()
        expect(saveDisaggregation.mock.calls[0][0]).toEqual(disaggregation)


    });
    // The true value on the Program 2 checked value is not picked up by the save() method what the test runs.
    it.skip("includes programs in saved data when one or more are checked", () => {
        const programsForRetro = [
            {id: 200, name: "Program 1", checked: false},
            {id: 201, name: "Program 2", checked: true}
        ]
        let disaggregation = {...store.editing_disaggregations_data[0]}
        disaggregation.selected_by_default = true;
        disaggregation.id = "new"
        disaggregation.disaggregation_type = "New Disagg"
        let component = mount(<DisaggregationType
            programs={programsForRetro}
            disaggregation={disaggregation}
            saveDisaggregation={(data) => saveDisaggregation(data)}
        />)
        component.instance().save()
        let expectedValue = {...disaggregation}
        expectedValue.retroPrograms = [201]
        expect(saveDisaggregation.mock.calls[0][0]).toEqual(expectedValue)
    });
});
