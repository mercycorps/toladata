import React from 'react';
import { toJS } from 'mobx'
import { CountryStore, findDuplicateLabelIndexes } from '../models'
import { countryDisaggregationData } from '../__fixtures__/countryAdminFixtures'
import api from '../api'
jest.mock('../api');
api.fetchCountries.mockResolvedValue([
        {id: 100, country: "First Country"},
        {id: 101, country: "Second Country"},
    ]);
api.updateDisaggregation.mockResolvedValue(() => ({data: []}));


describe("Country admin page", () => {
    let store = new CountryStore(api, {});
    store.editing_disaggregations_data = countryDisaggregationData;

    it("finds dupe indexes correctly", () => {
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

    it("prevents duplicate labels in the same disagg type from being saved", () => {
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
    it("allows labels with same name to be saved in different disagg types", () => {
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
    it("prevents creation of disagg types of same name in same country", () => {
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

