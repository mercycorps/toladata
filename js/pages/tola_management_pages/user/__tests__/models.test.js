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
                    countryIds.forEach(id => {expect(countryStore.isExpanded(id)).toBeTruthy();});
                });
                describe("when a user toggles a country collapsed", () => {
                    beforeEach(() => {
                        countryStore.toggleExpanded(2);
                    });
                    it("returns that country collapsed", () => {
                        expect(countryStore.isExpanded(2)).toBeFalsy();
                    });
                    it("shows all other countries expanded", () => {
                        [1, 3, 4].forEach(id => {expect(countryStore.isExpanded(id)).toBeTruthy();});
                    });
                    describe("when a user toggles a second country collapsed", () => {
                        beforeEach(() => {
                            countryStore.toggleExpanded(4);
                        });
                        it("returns only those two countries collapsed", () => {
                            [2, 4].forEach(id => {expect(countryStore.isExpanded(id)).toBeFalsy();});
                            [1, 3].forEach(id => {expect(countryStore.isExpanded(id)).toBeTruthy();});
                        });
                    });
                });
                describe("when a single country is added to the filter", () => {
                    beforeEach(() => {
                        countryStore.updateSelected([{value: 3}]);
                    });
                    it("shows only that country expanded", () => {
                        expect(countryStore.isExpanded(3)).toBeTruthy();
                        [1, 2, 4].forEach(id => {expect(countryStore.isExpanded(id)).toBeFalsy();});
                    });
                    describe("when that country is toggled collapsed", () => {
                        beforeEach(() => {
                            countryStore.toggleExpanded(3);
                        });
                        it("shows that country collapsed", () => {
                            countryIds.forEach(id => {expect(countryStore.isExpanded(id)).toBeFalsy();});
                        });
                    });
                    describe("when another country is added to the filter", () =>{
                        beforeEach(() => {
                            countryStore.updateSelected([{value: 3}, {value: 2}]);
                        });
                        it("shows only those two countries expanded", () => {
                           [2, 3].forEach(id => {expect(countryStore.isExpanded(id)).toBeTruthy();});
                           [1, 4].forEach(id => {expect(countryStore.isExpanded(id)).toBeFalsy();});
                        });
                    })
                });
                describe("when a single region is added to the filter", () => {
                    beforeEach(() => {
                        countryStore.updateSelected([{value: 'r-2'}]);
                        
                    });
                    it("shows all countries in that region collapsed", () => {
                        countryIds.forEach(id => {expect(countryStore.isExpanded(id)).toBeFalsy();})
                    });
                    describe("when a country in that region is toggled expanded", () => {
                        beforeEach(() => {
                            countryStore.toggleExpanded(3);
                        })
                        it("shows that country expanded", () => {
                            expect(countryStore.isExpanded(3)).toBeTruthy();
                        });
                        it("shows all other countries collapsed", () =>{
                            [1, 2, 4].forEach(id => {expect(countryStore.isExpanded(id)).toBeFalsy();});
                        });
                        describe("when another region is added to the filter", () => {
                            beforeEach(() => {
                                countryStore.updateSelected([...countryStore.selectedOptions, {value: 'r-1'}]);
                            })
                            it("shows all countries collapsed except previously toggled country", () => {
                                [1, 2, 4].forEach(id => {expect(countryStore.isExpanded(id)).toBeFalsy();});
                                expect(countryStore.isExpanded(3)).toBeTruthy();
                            });
                        });
                    });
                    describe("when another region is added to the filter", () =>{
                        beforeEach(() => {
                            countryStore.updateSelected([...countryStore.selectedOptions, {value: 'r-1'}]);
                        })
                        it("shows countries in both regions collapsed", () => {
                            countryIds.forEach(id => {expect(countryStore.isExpanded(id)).toBeFalsy();})
                        });
                    });
                    describe("when the region is removed", () => {
                        beforeEach(() => {
                            countryStore.updateSelected([...countryStore.selectedOptions.filter(option => option.value != 'r-2')]);
                        });
                        it("shows all countries expanded", () => {
                            countryIds.forEach(id => {expect(countryStore.isExpanded(id)).toBeTruthy();});
                        });
                    });
                    describe("when everything is removed (filter cleared)", () => {
                        beforeEach(() => {
                            countryStore.updateSelected([]);
                        });
                        it("shows all countries expanded", () => {
                            countryIds.forEach(id => {expect(countryStore.isExpanded(id)).toBeTruthy();});
                        })
                    })
                });
                describe("when a country is set to expanded (filter by program)", () => {
                    beforeEach(() => {
                        countryStore.toggleExpanded(2);
                        countryStore.setExpanded(3);
                        countryStore.setExpanded(2);
                    });
                    it("shows that country expanded", () => {
                        expect(countryStore.isExpanded(3)).toBeTruthy();
                        expect(countryStore.isExpanded(2)).toBeTruthy();
                    });
                });
            });
        });
    })
});
