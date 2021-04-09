import React from 'react';
import { shallow } from 'enzyme';
import jsContext from './fixtures/jsContext.json';
import { LevelListPanel } from '../components/level_list';
import { RootStore } from '../models';
import {IndicatorStore} from '../models';
import api from '../../../apiv2';

jest.mock('../../../apiv2');

describe ('Test for when there is no RF level saved', () => {

    const {program, levels, indicators, levelTiers, tierTemplates, englishTemplates, customTemplates, programObjectives, accessLevel, usingResultsFramework, maxTiers} = jsContext.rootStore[0];

    let rootStore;
    beforeEach(() => {
        rootStore = new RootStore(program, levels, indicators, levelTiers, JSON.stringify(tierTemplates), JSON.stringify(englishTemplates), customTemplates, programObjectives, accessLevel, usingResultsFramework, maxTiers);
    })


    it('Users should see Choose RF Template Carefully warning', async () => {
        api.checkSessions.mockResolvedValue({data: true})
        let wrapper = await shallow(<LevelListPanel.wrappedComponent rootStore={rootStore}/>);
        expect(wrapper.state('show_import_banner')).toBe(true)
        expect(wrapper.exists('.level-list-panel')).toBe(true);
        expect(wrapper.exists('.level-list-panel__dingbat')).toBe(true);
        expect(wrapper.exists('.level-list-panel__text')).toBe(true);
    })
    it('Users should not see the level list component', async () => {
        api.checkSessions.mockResolvedValue({data: true})
        let wrapper = await shallow(<LevelListPanel.wrappedComponent rootStore={rootStore}/>);
        expect(wrapper.state('show_import_banner')).toBe(true)
        expect(wrapper.exists('#level-list')).toBe(false);
    })

    it('Users with Low Access should not see Bulk Import Banner', async () => {
        rootStore.levelStore.accessLevel = "low"
        api.checkSessions.mockResolvedValue({data: true})
        let wrapper = await shallow(<LevelListPanel.wrappedComponent rootStore={rootStore}/>);
        expect(wrapper.state('show_import_banner')).toBe(true)
        expect(wrapper.exists('#bulk-import-banner-alert')).toBe(false);
    })
    it('Users with Medium Access should not see Bulk Import Banner', async () => {
        rootStore.levelStore.accessLevel = "medium"
        api.checkSessions.mockResolvedValue({data: true})
        let wrapper = await shallow(<LevelListPanel.wrappedComponent rootStore={rootStore}/>);
        expect(wrapper.state('show_import_banner')).toBe(true)
        expect(wrapper.exists('#bulk-import-banner-alert')).toBe(false);
    })
    it('Users with High Access should not see Bulk Import Banner', async () => {
        rootStore.levelStore.accessLevel = "high"
        api.checkSessions.mockResolvedValue({data: true})
        let wrapper = await shallow(<LevelListPanel.wrappedComponent rootStore={rootStore}/>);
        expect(wrapper.state('show_import_banner')).toBe(true)
        expect(wrapper.exists('#bulk-import-banner-alert')).toBe(false);
    })
});

describe ('Test for when there is at least one RF level saved', () => {

    const {program, levels, indicators, levelTiers, tierTemplates, englishTemplates, customTemplates, programObjectives, accessLevel, usingResultsFramework, maxTiers} = jsContext.rootStore[1];

    let rootStore;
    beforeEach(() => {
        rootStore = new RootStore(program, levels, indicators, levelTiers, JSON.stringify(tierTemplates), JSON.stringify(englishTemplates), customTemplates, programObjectives, accessLevel, usingResultsFramework, maxTiers);
    })

    it('Users should not see Choose RF Template Carefully warning', async () => {
        api.checkSessions.mockResolvedValue({data: true})
        let wrapper = await shallow(<LevelListPanel.wrappedComponent rootStore={rootStore}/>);
        expect(wrapper.state('show_import_banner')).toBe(true)
        expect(wrapper.exists('.level-list-panel')).toBe(false);
        expect(wrapper.exists('.level-list-panel__dingbat')).toBe(false);
        expect(wrapper.exists('.level-list-panel__text')).toBe(false);
    })
    it('Users should see the level list component', async () => {
        api.checkSessions.mockResolvedValue({data: true})
        let wrapper = await shallow(<LevelListPanel.wrappedComponent rootStore={rootStore}/>);
        expect(wrapper.state('show_import_banner')).toBe(true)
        expect(wrapper.exists('#level-list')).toBe(true);
    })

    it('Users with Low Access should not see Bulk Import Banner', async () => {
        rootStore.levelStore.accessLevel = "low"
        api.checkSessions.mockResolvedValue({data: true})
        let wrapper = await shallow(<LevelListPanel.wrappedComponent rootStore={rootStore}/>);
        expect(wrapper.state('show_import_banner')).toBe(true)     
        expect(wrapper.exists('#bulk-import-banner-alert')).toBe(false);
    })
    it('Users with Medium Access should not see Bulk Import Banner', async () => {
        rootStore.levelStore.accessLevel = "medium"
        api.checkSessions.mockResolvedValue({data: true})
        let wrapper = await shallow(<LevelListPanel.wrappedComponent rootStore={rootStore}/>);
        expect(wrapper.state('show_import_banner')).toBe(true)
        expect(wrapper.exists('#bulk-import-banner-alert')).toBe(false);
    })
    it('Users with High Access should see Bulk Import Banner', async () => {
        rootStore.levelStore.accessLevel = "high"
        api.checkSessions.mockResolvedValue({data: true})
        let wrapper = await shallow(<LevelListPanel.wrappedComponent rootStore={rootStore}/>);
        expect(wrapper.state('show_import_banner')).toBe(true)
        expect(wrapper.exists('#bulk-import-banner-alert')).toBe(true);
    })
    it('Users with High Access should not see Bulk Import Banner if previously closed', async () => {
        rootStore.levelStore.accessLevel = "high"
        api.checkSessions.mockResolvedValue({data: false})
        let wrapper = await shallow(<LevelListPanel.wrappedComponent rootStore={rootStore}/>);
        expect(wrapper.state('show_import_banner')).toBe(false)
        expect(wrapper.exists('#bulk-import-banner-alert')).toBe(false);
    })
    it('User should see the banner, click close, and then does not see the banner', async () => {
        rootStore.levelStore.accessLevel = "high"
        api.checkSessions.mockResolvedValueOnce({data: true}).mockResolvedValueOnce({data: false})
        api.updateSessions.mockResolvedValueOnce({statusText: "Accepted"})
        let wrapper = await shallow(<LevelListPanel.wrappedComponent rootStore={rootStore}/>);
        expect(wrapper.state('show_import_banner')).toBe(true)
        expect(wrapper.exists('#bulk-import-banner-alert')).toBe(true);
        let closeButton = wrapper.find('#bulk-import-banner-alert').find('button');
        closeButton.simulate('click');
        wrapper = await shallow(<LevelListPanel.wrappedComponent rootStore={rootStore}/>);
        expect(wrapper.state('show_import_banner')).toBe(false)
        expect(wrapper.exists('#bulk-import-banner-alert')).toBe(false);
    })
});

// (these tests are a template) 
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