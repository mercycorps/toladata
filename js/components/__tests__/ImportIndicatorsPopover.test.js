import React, { useContext } from 'react';
import { shallow, mount } from 'enzyme';
import  {ImportIndicatorsButton, ImportIndicatorsPopover} from "../ImportIndicatorsPopover";

describe('Import Indicators test suite', () => {
    let page = "resultsFramework";
    let program_id = 123;
    let tierLevelsUsed = [
        {name: "Goal", used: true}, 
        {name: "Outcome", used: true}, 
        {name: "Output", used: true}, 
        {name: "Activity", used: false},
    ];
    let storedTierLevelsRows = [];
    let storedView = {view: 0};
    let setStoredTierLevelsRows = () => {};
    let setStoredView = () => {};

    let wrapper;
    beforeEach(() => {
        wrapper = mount(
            <ImportIndicatorsPopover 
                page={ page }
                program_id={ program_id }
                tierLevelsUsed={ tierLevelsUsed }
                storedTierLevelsRows={ storedTierLevelsRows }
                storedView={ storedView }
                setStoredTierLevelsRows={ setStoredTierLevelsRows }
                setStoredView={ setStoredView }
            />)
    })

    it('Should contain the right components in the initial view', () => {
        expect(wrapper.exists('.import-initial')).toBe(true);
        expect(wrapper.exists('.btn-upload')).toBe(true);
        expect(wrapper.exists('.btn-download')).toBe(true);
        expect(wrapper.exists('.level-count-row')).toBe(true);
        expect(wrapper.exists('.level-count-options')).toBe(true);
    });

    it('Should have same number of rows as provided tier levels', () => {
        expect(wrapper.find(".level-count-row").length).toBe(tierLevelsUsed.length);
    })
})