import React, { useContext } from 'react';
import { shallow, mount } from 'enzyme';
import  {ImportIndicatorsButton, ImportIndicatorsPopover} from "../ImportIndicatorsPopover";

describe('Import Indicators test suite', () => {
    let levelStore = {
        program_id: 123,
        tierTemplates: {
            mc_standard: {
                name: "Mercy Corps",
                tiers: ["Goal", "Outcome", "Output", "Activity"],
            }
        },
        chosenTierSetKey: "mc_standard",
    }
    let chosenTiers = ["Goal", "Outcome", "Output", "Activity"];
    let tierLevelsUsed = [
        {name: "Goal", used: true}, 
        {name: "Outcome", used: true}, 
        {name: "Output", used: true}, 
        {name: "Activity", used: false},
    ]

    it('The Import indicators button should contain the right components', () => {
        let wrapper = mount(<ImportIndicatorsPopover program_id={123} tierLevelsUsed={tierLevelsUsed} />)
        expect(wrapper.exists('.importIndicators-body')).toBe(true);
        expect(wrapper.exists('.btn-upload')).toBe(true);
        expect(wrapper.exists('.btn-download')).toBe(true);
        expect(wrapper.exists('.level-count-row')).toBe(true);
        expect(wrapper.exists('.level-count-options')).toBe(true);
    });
})