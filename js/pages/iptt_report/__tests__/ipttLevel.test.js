import IPTTLevel, { forIPTT } from '../models/ipttLevel';

describe("bare iptt level", () => {
    const Level = forIPTT;

    it("returns a tier pk", () => {
        let level = Level({tier_pk: 24});
        expect(level.tierPk).toBe(24);
        expect(level.showForTier(24)).toBeTruthy();
        expect(level.showForTier(23)).toBeFalsy();
    });
    it("returns a null tier pk", () => {
        let level = Level();
        expect(level.tierPk).toBeNull();
        expect(level.showForTier(23)).toBeFalsy();
        let level2 = Level({tier_pk: null});
        expect(level2.tierPk).toBeNull();
        expect(level2.showForTier(23)).toBeFalsy();
    });
     it("returns a chain pk", () => {
        let level = Level({chain_pk: 24});
        expect(level.chainPk).toBe(24);
        expect(level.showForChain(24)).toBeTruthy();
        expect(level.showForChain(5)).toBeFalsy();
    });
    it("returns a null tier pk", () => {
        let level = Level();
        expect(level.chainPk).toBeNull();
        expect(level.showForChain(5)).toBeFalsy();
        let level2 = Level({chain_pk: null});
        expect(level2.chainPk).toBeNull();
        expect(level2.showForChain(5)).toBeFalsy();
    });
});

describe("full iptt level", () => {
    const Level = IPTTLevel;

    it("returns a full set of information", () => {
        let level = Level({
            pk: 12,
            name: 'Test level name',
            tier_name: 'Test tier name',
            tier_pk: 115,
            chain_pk: 47,
            ontology: '1.1',
        });
        expect(level.showForChain(47)).toBeTruthy();
        expect(level.showForChain(46)).toBeFalsy();
        expect(level.showForTier(115)).toBeTruthy();
        expect(level.showForTier(114)).toBeFalsy();
        expect(level.tierName).toBe("Test tier name");
    });
    it("handles empty values for manual numbering of levels", () => {
        let level = Level({
            tier_name: null,
            ontology: '1.1',
        });
        expect(level.tierNumber).toBe("1.1");
        level = Level({
            tier_name: 'Test the name',
            ontology: '1.1',
        });
        expect(level.tierNumber).toBe("Test the name 1.1");
        level = Level({
            tier_name: 'Test the name',
            ontology: '',
        });
        expect(level.tierNumber).toBe("Test the name");
    })
})
