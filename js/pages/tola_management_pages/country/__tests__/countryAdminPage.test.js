import React from 'react';
import { CountryStore } from '../models'
import { countryDisaggregationData, strategicObjectiveData } from '../__fixtures__/countryAdminFixtures';
import api from '../api'
jest.mock('../api');

api.fetchCountries.mockResolvedValue([
        {id: 100, country: "First Country"},
        {id: 101, country: "Second Country"},
    ]);


describe("Country admin new country create ", () => {
    let store = new CountryStore(api, {});
    store.editing_disaggregations_data = countryDisaggregationData;
    store.editing_objectives_data = strategicObjectiveData;

    it("clears stale country values upon country creation", () => {
        store.countries = [...store.allCountries];
        store.editing_errors = {'test1': 'error1'};
        store.editing_disaggregations_errors = {'test2': 'error2'};
        store.editing_target = 100;

        expect(store.editing_objectives_data.length).toBeGreaterThan(0);
        expect(store.editing_disaggregations_data.length).toBeGreaterThan(0);
        expect(Object.keys(store.editing_errors).length).toBeGreaterThan(0);
        expect(Object.keys(store.editing_disaggregations_errors).length).toBeGreaterThan(0);
        store.addCountry();
        expect(store.editing_objectives_data.length).toEqual(0);
        expect(store.editing_disaggregations_data.length).toEqual(0);
        expect(Object.keys(store.editing_errors).length).toEqual(0);
        expect(Object.keys(store.editing_disaggregations_errors).length).toEqual(0);
    });
})
