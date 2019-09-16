import { getIndicator } from '../indicator';


describe("Base indicator", () => {
    const Indicator = getIndicator();
    const specialChars = "sπécîal chars";
    
    it("handles int or string pk", () => {
        let indicator = Indicator({pk: 4});
        expect(indicator.pk).toBe(4);
        let indicator2 = Indicator({pk: '555'});
        expect(indicator2.pk).toBe(555);
    });
    it("handles names with special characters", () => {
        let indicator = Indicator({name: specialChars});
        expect(indicator.name).toBe(specialChars);
    });
    it("handles long names", () => {
        let longName = "long name 12345678".repeat(25);
        let indicator = Indicator({name: longName});
        expect(indicator.name).toBe(longName);
    });
    it("handles numeric, string, null level pk values", () => {
        let indicator = Indicator({level_pk: 5});
        expect(indicator.levelPk).toBe(5);
        let indicator2 = Indicator({level_pk: '5912'});
        expect(indicator2.levelPk).toBe(5912);
        let indicator3 = Indicator({level_pk: null});
        expect(indicator3.levelPk).toBeFalsy();
    });
    it("handles old level names including special characters", () => {
        let indicator = Indicator({old_level_name: "Output"});
        expect(indicator.oldLevelDisplay).toBe("Output");
        let indicator2 = Indicator({old_level_name: "Résultat"});
        expect(indicator2.oldLevelDisplay).toBe("Résultat");
        let indicator3 = Indicator({old_level_name: ""});
        expect(indicator3.oldLevelDisplay).toBeFalsy();
        let indicator4 = Indicator({old_level_name: null});
        expect(indicator4.oldLevelDisplay).toBeFalsy();
    });
    it("handles old level names including special characters", () => {
        let indicator = Indicator({means_of_verification: "Some string"});
        expect(indicator.meansOfVerification).toBe("Some string");
        let longName = "long name 12345678".repeat(25);
        let indicator2 = Indicator({means_of_verification: longName});
        expect(indicator2.meansOfVerification).toBe(longName);
        let indicator3 = Indicator({means_of_verification: "Spécîal Chars"});
        expect(indicator3.meansOfVerification).toBe("Spécîal Chars");
        let indicator4 = Indicator({means_of_verification: ""});
        expect(indicator4.meansOfVerification).toBeFalsy();
        let indicator5 = Indicator({means_of_verification: null});
        expect(indicator5.meansOfVerification).toBeFalsy();
    });
    
});