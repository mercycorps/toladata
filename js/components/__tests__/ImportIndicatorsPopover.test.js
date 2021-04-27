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
        chosenTierSetKey: "mc_standard"
    }
    let chosenTier = ["Goal", "Outcome", "Output", "Activity"];

    it('The Import indicators button should contain the right components', () => {
        let wrapper = mount(<ImportIndicatorsPopover program_id={123} chosenTier={chosenTier} />)
        expect(wrapper.exists('.importIndicators-body')).toBe(true);
        expect(wrapper.exists('.btn-upload')).toBe(true);
        expect(wrapper.exists('.btn-download')).toBe(true);
        expect(wrapper.exists('.advanced-levels')).toBe(true);
        expect(wrapper.exists('.advanced-options')).toBe(true);
    });
})