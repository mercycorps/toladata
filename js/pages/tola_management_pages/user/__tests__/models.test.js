import {UserStore, CountryStore} from '../models';
import jsContext from './fixtures/jsContext';

const users = jsContext.users;

describe('UserStore', () => {
    describe("initialized with test data", () => {
        var store;
        beforeEach(() => {
            store = new UserStore(jsContext);
        });
        it("initializes correctly", () => {
            expect(store).not.toBeUndefined();
        });
        it("contains regions information", () => {
            expect(store.regions).not.toBeUndefined();
        });
        it("contains countries information", () => {
            expect(store.countries).not.toBeUndefined();
        })
    });
});

describe('countryStore', () => {
    describe("from an initialized user store", () => {
        var countryStore;
        beforeEach(() => {
            let userStore = new UserStore(jsContext);
            countryStore = new CountryStore(userStore.regions, userStore.countries);
        });
        it("initializes correctly", () => {
            expect(countryStore).not.toBeUndefined();
            expect(countryStore.selectedCountries).toHaveLength(0)
        });
        it("displays a list of regions and countries", () => {
            let options = countryStore.groupedOptions;
            expect(options.length).toBe(3);
            expect(options[0].label).toBe("Regions");
            expect(options[0].value).toBeNull();
            expect(options[0].options.length).toBe(2);
            expect(options[0].options[0].label).toBe("Africa");
            expect(options[0].options[0].value).toBe("r-2");
            expect(options[0].options[1].label).toBe("Americas");
            expect(options[0].options[1].value).toBe("r-1");
            expect(options[1].label).toBe("Africa");
            expect(options[1].value).toBeNull();
            expect(options[1].options.length).toBe(2);
            expect(options[1].options[0].label).toBe("A Test Country 3");
            expect(options[1].options[0].value).toBe(3);
            expect(options[1].options[1].label).toBe("Test Country 2");
            expect(options[1].options[1].value).toBe(2);
            expect(options[2].label).toBe("Americas");
            expect(options[2].value).toBeNull();
            expect(options[2].options.length).toBe(2);
            expect(options[2].options[0].label).toBe("Test Country");
            expect(options[2].options[0].value).toBe(1);
            expect(options[2].options[1].label).toBe("Test Country 4");
            expect(options[2].options[1].value).toBe(4);
        });
        it("handles a selected country", () => {
            expect(countryStore.selectedCountries).toHaveLength(0);
            expect(countryStore.selectedOptions).toHaveLength(0);
            let selected = [countryStore.groupedOptions[1].options[0]];
            countryStore.updateSelected(selected);
            expect(countryStore.selectedCountries).toStrictEqual([3]);
            expect(countryStore.selectedOptions).toHaveLength(1);
            expect(countryStore.selectedOptions[0].label).toBe("A Test Country 3");
            expect(countryStore.selectedOptions[0].value).toBe(3);
        });
        it("handles multiple selected countries", () => {
            expect(countryStore.selectedCountries).toHaveLength(0);
            expect(countryStore.selectedOptions).toHaveLength(0);
            countryStore.updateSelected([countryStore.groupedOptions[1].options[1]]);
            expect(countryStore.selectedCountries).toStrictEqual([2]);
            countryStore.updateSelected([countryStore.groupedOptions[1].options[1],
                                         countryStore.groupedOptions[2].options[0]]);
            expect(countryStore.selectedCountries).toHaveLength(2);
            expect(countryStore.selectedCountries).toContain(2);
            expect(countryStore.selectedCountries).toContain(1);
            expect(countryStore.selectedOptions).toHaveLength(2);
        });
        it("handles manually selecting a region countries", () => {
            expect(countryStore.selectedCountries).toHaveLength(0);
            expect(countryStore.selectedOptions).toHaveLength(0);
            countryStore.updateSelected([countryStore.groupedOptions[1].options[1],
                                         countryStore.groupedOptions[1].options[0]]);
            expect(countryStore.selectedCountries).toHaveLength(2);
            expect(countryStore.selectedCountries).toContain(2);
            expect(countryStore.selectedCountries).toContain(3);
            expect(countryStore.selectedOptions).toHaveLength(3);
            expect(countryStore.selectedOptions[0].label).toBe("Africa");
            expect(countryStore.selectedOptions[0].value).toBe("r-2");
        });
        it("handles selecting a region", () => {
            expect(countryStore.selectedCountries).toHaveLength(0);
            expect(countryStore.selectedOptions).toHaveLength(0);
            countryStore.updateSelected([countryStore.groupedOptions[0].options[1]]);
            expect(countryStore.selectedCountries).toHaveLength(2);
            expect(countryStore.selectedCountries).toContain(1);
            expect(countryStore.selectedCountries).toContain(4);
            expect(countryStore.selectedOptions).toHaveLength(3);
            expect(countryStore.selectedOptions[0].label).toBe("Americas");
            expect(countryStore.selectedOptions[0].value).toBe("r-1");
        })
    })
});
