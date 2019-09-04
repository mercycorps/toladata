import { getLevel } from '../level';


describe("Base level", () => {
    const Level = getLevel();
    const specialChars = "sπécîal chars";
    
    it("handles int or string pk", () => {
        let level = Level({pk: 4});
        expect(level.pk).toBe(4);
        let level2 = Level({pk: '555'});
        expect(level2.pk).toBe(555);
    });
    it("handles names with special characters", () => {
        let level = Level({name: specialChars});
        expect(level.name).toBe(specialChars);
    });
    it("handles long names", () => {
        let longName = "long name 12345678".repeat(25);
        let level = Level({name: longName});
        expect(level.name).toBe(longName);
    });
    it("handles blank ontology", () => {
        let level = Level({ontology: null});
        expect(level.ontology).toBeNull();
        let level2 = Level({ontology: ''});
        expect(level2.ontology).toBeNull();
    });
    it("handles numeric ontology", () => {
        let level = Level({ontology: '142'});
        expect(level.ontology).toBe('142');
        let level2 = Level({ontology: '0'});
        expect(level2.ontology).toBe('0');
    });
    it("handles logframe ontology", () => {
        let level = Level({ontology: '2.1.4'});
        expect(level.ontology).toBe('2.1.4');
    });
    it("handles tier name", () => {
        let level = Level({tier_name: 'Goal'});
        expect(level.tierName).toBe('Goal');
    });
    it("handles tier name with special chars", () => {
        let level = Level({tier_name: specialChars});
        expect(level.tierName).toBe(specialChars);
    });
    it("handles long tier name", () => {
        let longName = "long name 12345678".repeat(25);
        let level = Level({tier_name: longName});
        expect(level.tierName).toBe(longName);
    })
})