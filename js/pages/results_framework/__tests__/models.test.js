import React from 'react';
import { shallow } from 'enzyme';
import jsContext from './fixtures/jsContext.json';
import { LevelListPanel } from '../components/level_list';
import { RootStore } from '../models';
import {IndicatorStore} from '../models';

describe ('Test for when there is no RF level saved', function() {

    const {program, levels, indicators, levelTiers, tierTemplates, englishTemplates, customTemplates, programObjectives, accessLevel, usingResultsFramework, maxTiers} = jsContext.rootStore[0];

    let rootStore;
    beforeEach(() => {
        rootStore = new RootStore(program, levels, indicators, levelTiers, JSON.stringify(tierTemplates), JSON.stringify(englishTemplates), customTemplates, programObjectives, accessLevel, usingResultsFramework, maxTiers);
    })

    it('Users with Low Access should not see Bulk Import Banner', function() {
        rootStore.levelStore.accessLevel = "low"
        let wrapper = shallow(<LevelListPanel.wrappedComponent rootStore={rootStore}/>);
        expect(wrapper.exists('#bulk-import-banner-alert')).toBe(false);
    })
    it('Users with Medium Access should not see Bulk Import Banner', function() {
        rootStore.levelStore.accessLevel = "medium"
        let wrapper = shallow(<LevelListPanel.wrappedComponent rootStore={rootStore}/>);
        expect(wrapper.exists('#bulk-import-banner-alert')).toBe(false);
    })
    it('Users with High Access should see Bulk Import Banner', function() {
        rootStore.levelStore.accessLevel = "high"
        let wrapper = shallow(<LevelListPanel.wrappedComponent rootStore={rootStore}/>);
        expect(wrapper.exists('#bulk-import-banner-alert')).toBe(false);
    })
});

describe ('Test for when there is at least one RF level saved', function() {

    const {program, levels, indicators, levelTiers, tierTemplates, englishTemplates, customTemplates, programObjectives, accessLevel, usingResultsFramework, maxTiers} = jsContext.rootStore[1];

    let rootStore;
    beforeEach(() => {
        rootStore = new RootStore(program, levels, indicators, levelTiers, JSON.stringify(tierTemplates), JSON.stringify(englishTemplates), customTemplates, programObjectives, accessLevel, usingResultsFramework, maxTiers);
    })

    it('Users with Low Access should not see Bulk Import Banner', function() {
        rootStore.levelStore.accessLevel = "low"
        let wrapper = shallow(<LevelListPanel.wrappedComponent rootStore={rootStore}/>);
        expect(wrapper.exists('#bulk-import-banner-alert')).toBe(false);
    })
    it('Users with Medium Access should not see Bulk Import Banner', function() {
        rootStore.levelStore.accessLevel = "medium"
        let wrapper = shallow(<LevelListPanel.wrappedComponent rootStore={rootStore}/>);
        expect(wrapper.exists('#bulk-import-banner-alert')).toBe(false);
    })
    it('Users with High Access should see Bulk Import Banner', function() {
        rootStore.levelStore.accessLevel = "high"
        let wrapper = shallow(<LevelListPanel.wrappedComponent rootStore={rootStore}/>);
        expect(wrapper.exists('#bulk-import-banner-alert')).toBe(true);
    })

    it('User see banner, closes banner, and does not see it again during this session', function() {
        let wrapper = shallow(<LevelListPanel.wrappedComponent rootStore={rootStore}/>);
        expect(wrapper.exists('#bulk-import-banner-alert')).toBe(true);
        const closeButton = wrapper.find('#bulk-import-banner-alert').find('button');
        closeButton.simulate('click');
        wrapper = shallow(<LevelListPanel.wrappedComponent rootStore={rootStore}/>);
        expect(wrapper.exists('#bulk-import-banner-alert')).toBe(false);
        wrapper = shallow(<LevelListPanel.wrappedComponent rootStore={rootStore}/>);
        expect(wrapper.exists('#bulk-import-banner-alert')).toBe(false);
    })

});

xdescribe('IndicatorStore', () => {

    const indicators = jsContext.indicators;

    it('filters by indicators needing targets', () => {
        let is = new IndicatorStore(indicators);
        let indicatorsNeedingTargets = is.getIndicatorsNeedingTargets;
        expect(indicatorsNeedingTargets.length).toEqual(1);
    });

    it('find the sum of all results on all indicators in the store', () => {
        let is = new IndicatorStore(indicators);
        expect(is.getTotalResultsCount).toEqual(3);
    });

    it('find the sum of all results with evidence on all indicators in the store', () => {
        let is = new IndicatorStore(indicators);
        expect(is.getTotalResultsWithEvidenceCount).toEqual(2);
    });
});