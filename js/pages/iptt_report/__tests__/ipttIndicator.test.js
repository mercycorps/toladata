import IPTTIndicator, { forIPTT } from '../models/ipttIndicator';

describe("bare iptt indicator", () => {
    const Indicator = forIPTT;
    it("returns a sector pk", () => {
        let indicator = Indicator({sector_pk: 14});
        expect(indicator.sectorPk).toBe(14);
    });
    it("returns a null sector pk", () => {
        let indicator = Indicator();
        expect(indicator.sectorPk).toBeNull();
        let indicator2 = Indicator({sector_pk: null});
        expect(indicator2.sectorPk).toBeNull();
    });
    it("returns a single type pk", () => {
        let indicator = Indicator({indicator_type_pks: [3]});
        expect(indicator.hasIndicatorType(3)).toBeTruthy();
        expect(indicator.hasIndicatorType(4)).toBeFalsy();
    });
    it("returns multiple type pks", () => {
        let indicator = Indicator({indicator_type_pks: [3, 27]});
        expect(indicator.hasIndicatorType(3)).toBeTruthy();
        expect(indicator.hasIndicatorType(27)).toBeTruthy();
        expect(indicator.hasIndicatorType(4)).toBeFalsy();
    });
    it("returns no type pks", () => {
        let indicator = Indicator({indicator_type_pks: []});
        expect(indicator.hasIndicatorType(3)).toBeFalsy();
        let indicator2 = Indicator();
        expect(indicator2.hasIndicatorType(3)).toBeFalsy();
    });
    it("returns a single site pk", () => {
        let indicator = Indicator({site_pks: [3]});
        expect(indicator.hasSite(3)).toBeTruthy();
        expect(indicator.hasSite(4)).toBeFalsy();
    });
    it("returns multiple site pks", () => {
        let indicator = Indicator({site_pks: [3, 27]});
        expect(indicator.hasSite(3)).toBeTruthy();
        expect(indicator.hasSite(27)).toBeTruthy();
        expect(indicator.hasSite(4)).toBeFalsy();
    });
    it("returns no site pks", () => {
        let indicator = Indicator({site_pks: []});
        expect(indicator.hasSite(3)).toBeFalsy();
        let indicator2 = Indicator();
        expect(indicator2.hasSite(3)).toBeFalsy();
    });
})