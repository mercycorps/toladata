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
        describe("selected country list", () => {
            it("initializes correctly", () => {
                expect(countryStore).not.toBeUndefined();
                expect(countryStore.selectedCountries).toHaveLength(0);
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
                countryStore.updateSelected([countryStore.groupedOptions[1].options[1]]);
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
            });
        });
        describe("expanded country list", () => {
            var countryIds = [1, 2, 3, 4, "1", "2", "3", "4"];
            describe("when initialized", () => {
                it("shows all countries expanded", () => {
                    expect(true).toBeFalsy();
                });
                describe("when a user toggles a country collapsed", () => {
                    it("returns that country collapsed", () => {
                        expect(true).toBeFalsy();
                    });
                    it("shows all other countries expanded", () => {
                        expect(true).toBeFalsy();
                    });
                });
                describe("when a single country is added to the filter", () => {
                    it("shows that country expanded", () => {
                        expect(true).toBeFalsy();
                    });
                    describe("when that country is toggled collapsed", () => {
                        it("shows that country collapsed", () => {
                            expect(true).toBeFalsy();
                        });
                    });
                    describe("when another country is added to the filter", () =>{
                        it("shows both countries expanded", () => {
                            expect(true).toBeFalsy();
                        });
                    })
                });
                describe("when a single region is added to the filter", () => {
                    it("shows all countries in that region collapsed", () => {
                        expect(true).toBeFalsy();
                    });
                    describe("when a country in that region is toggled expanded", () => {
                        it("shows that country expanded", () => {
                            expect(true).toBeFalsy();
                        });
                        it("shows all other countries collapsed", () =>{
                            expect(true).toBeFalsy();
                        });
                        describe("when another region is added to the filter", () => {
                            it("shows the new region countries collapsed", () => {
                                expect(true).toBeFalsy();
                            });
                            it("shows the first region countries (except toggled country) collapsed", () => {
                                expect(true).toBeFalsy();
                            });
                            it("shows the toggled country expanded", () => {
                                expect(true).toBeFalsy();
                            });
                        });
                    });
                    describe("when another region is added to the filter", () =>{
                        it("shows countries in both regions collapsed", () => {
                            expect(true).toBeFalsy();
                        });
                    })
                });
                
                describe("when a country is set to expanded (filter by program)" () => {
                    it("shows that country expanded", () => {
                        expect(true).toBeFalsy();
                    });
                });
            });
            //it("initialized correctly", () => {
            //    expect(countryStore.isExpanded).not.toBeUndefined();
            //    expect(countryStore.selectedCountries).toHaveLength(0);
            //    countryIds.forEach(id => {expect(countryStore.isExpanded(id)).toBeTruthy();});
            //});
            //it("filter by single country", () => {
            //    countryStore.updateSelected([countryStore.groupedOptions[1].options[0]]);
            //    countryIds.forEach(id => {expect(countryStore.isExpanded(id)).toBeFalsy();});
            //});
            //it("collapses all when filter by region", () => {
            //    countryStore.updateSelected([countryStore.groupedOptions[0].options[1]]);
            //    countryIds.forEach(id => {expect(countryStore.isExpanded(id)).toBeFalsy();});
            //});
            //it("collapses a country", () => {
            //    countryStore.toggleExpanded(2);
            //    [1, 3, 4].forEach(id => {expect(countryStore.isExpanded(id)).toBeTruthy();});
            //    expect(countryStore.isExpanded(2)).toBeFalsy();
            //});
            //it("expands a single country", () => {
            //    countryStore.updateSelected()
            //    // when a single program is filtered to, this will set that program's country is expanded:
            //    countryStore.setExpanded(4);
            //    [1, 2, 3].forEach(id => {expect(countryStore.isExpanded(id)).toBeFalsy();});
            //    expect(countryStore.isExpanded(4)).toBeTruthy();
            //});
        });
    })
});
