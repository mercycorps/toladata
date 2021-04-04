import React from 'react';
import { shallow, mount } from 'enzyme';
import jsContext from './fixtures/jsContext.json';
import { LevelListPanel } from '../components/level_list';
import { RootStore } from '../models';
import {IndicatorStore} from '../models';
import axios from 'axios';

jest.mock('axios')

describe ('Test for when there is no RF level saved', function() {

    const {program, levels, indicators, levelTiers, tierTemplates, englishTemplates, customTemplates, programObjectives, accessLevel, usingResultsFramework, maxTiers} = jsContext.rootStore[0];

    let rootStore;
    beforeEach(() => {
        rootStore = new RootStore(program, levels, indicators, levelTiers, JSON.stringify(tierTemplates), JSON.stringify(englishTemplates), customTemplates, programObjectives, accessLevel, usingResultsFramework, maxTiers);
    })

    const runAllPromises = () => new Promise(setImmediate)

    it('Users should see Choose RF Template Carefully warning', async function() {
        await axios.get.mockResolvedValue({
            data: {
                result: true
            }
        })
        let wrapper = await shallow(<LevelListPanel.wrappedComponent rootStore={rootStore}/>);
        await runAllPromises();
        expect(wrapper.exists('.level-list-panel')).toBe(true);
        expect(wrapper.exists('.level-list-panel__dingbat')).toBe(true);
        expect(wrapper.exists('.level-list-panel__text')).toBe(true);
    })
    it('Users should not see the level list component', async function() {
        await axios.get.mockResolvedValue({
            data: {
                result: true
            }
        })
        let wrapper = await shallow(<LevelListPanel.wrappedComponent rootStore={rootStore}/>);
        await runAllPromises();
        expect(wrapper.exists('#level-list')).toBe(false);
    })

    it('Users with Low Access should not see Bulk Import Banner', async function() {
        await axios.get.mockResolvedValue({
            data: {
                result: true
            }
        })
        let wrapper = await shallow(<LevelListPanel.wrappedComponent rootStore={rootStore}/>);
        await runAllPromises();
        rootStore.levelStore.accessLevel = "low"
        expect(wrapper.exists('#bulk-import-banner-alert')).toBe(false);
    })
    it('Users with Medium Access should not see Bulk Import Banner', async function() {
        await axios.get.mockResolvedValue({
            data: {
                result: true
            }
        })
        let wrapper = await shallow(<LevelListPanel.wrappedComponent rootStore={rootStore}/>);
        await runAllPromises();
        rootStore.levelStore.accessLevel = "medium"
        expect(wrapper.exists('#bulk-import-banner-alert')).toBe(false);
    })
    it('Users with High Access should not see Bulk Import Banner', async () => {
        await axios.get.mockResolvedValue({
            data: {
                result: true
            }
        })
        let wrapper = await shallow(<LevelListPanel.wrappedComponent rootStore={rootStore}/>);
        await runAllPromises();
        rootStore.levelStore.accessLevel = "high"
        expect(wrapper.exists('#bulk-import-banner-alert')).toBe(false);
    })
});

describe ('Test for when there is at least one RF level saved', function() {

    const {program, levels, indicators, levelTiers, tierTemplates, englishTemplates, customTemplates, programObjectives, accessLevel, usingResultsFramework, maxTiers} = jsContext.rootStore[1];

    let rootStore;
    beforeEach(() => {
        rootStore = new RootStore(program, levels, indicators, levelTiers, JSON.stringify(tierTemplates), JSON.stringify(englishTemplates), customTemplates, programObjectives, accessLevel, usingResultsFramework, maxTiers);
    })

    const runAllPromises = () => new Promise(setImmediate)
    
    it('Test the api call', async () => {
        await axios.get.mockResolvedValue({
            data: {
                result: true
            }
        })
        let wrapper = await shallow(<LevelListPanel.wrappedComponent rootStore={rootStore}/>);
        await runAllPromises();
        expect(wrapper.exists('#bulk-import-banner-alert')).toBe(true);
        expect(wrapper.state('show_import_banner')).toEqual(true)
    })

    it('Users should not see Choose RF Template Carefully warning', async function() {
        await axios.get.mockResolvedValue({
            data: {
                result: true
            }
        })
        let wrapper = await shallow(<LevelListPanel.wrappedComponent rootStore={rootStore}/>);
        await runAllPromises();
        expect(wrapper.exists('.level-list-panel')).toBe(false);
        expect(wrapper.exists('.level-list-panel__dingbat')).toBe(false);
        expect(wrapper.exists('.level-list-panel__text')).toBe(false);
    })
    it('Users should see the level list component', async function() {
        await axios.get.mockResolvedValue({
            data: {
                result: true
            }
        })
        let wrapper = await shallow(<LevelListPanel.wrappedComponent rootStore={rootStore}/>);
        await runAllPromises();
        expect(wrapper.exists('#level-list')).toBe(true);
    })

    it('Users with Low Access should not see Bulk Import Banner', async function() {
        await axios.get.mockResolvedValue({
            data: {
                result: true
            }
        })
        rootStore.levelStore.accessLevel = "low"
        let wrapper = await shallow(<LevelListPanel.wrappedComponent rootStore={rootStore}/>);
        await runAllPromises();        
        expect(wrapper.exists('#bulk-import-banner-alert')).toBe(false);
    })
    it('Users with Medium Access should not see Bulk Import Banner', async function() {
        await axios.get.mockResolvedValue({
            data: {
                result: true
            }
        })
        rootStore.levelStore.accessLevel = "medium"
        let wrapper = await shallow(<LevelListPanel.wrappedComponent rootStore={rootStore}/>);
        await runAllPromises();
        expect(wrapper.exists('#bulk-import-banner-alert')).toBe(false);
    })
    it('Users with High Access should see Bulk Import Banner', async function() {
        await axios.get.mockResolvedValue({
            data: {
                result: true
            }
        })
        rootStore.levelStore.accessLevel = "high"
        let wrapper = await shallow(<LevelListPanel.wrappedComponent rootStore={rootStore}/>);
        await runAllPromises();
        expect(wrapper.exists('#bulk-import-banner-alert')).toBe(true);
    })
    it('Users with High Access should not see Bulk Import Banner if previously closed', async function() {
        await axios.get.mockResolvedValue({
            data: {
                result: false
            }
        })
        rootStore.levelStore.accessLevel = "high"
        let wrapper = await shallow(<LevelListPanel.wrappedComponent rootStore={rootStore}/>);
        await runAllPromises();
        expect(wrapper.exists('#bulk-import-banner-alert')).toBe(false);
    })
    it('User should see the banner, click close, and then does not see the banner', async function() {
        await axios.get.mockResolvedValue({
            data: {
                result: true
            }
        })
        axios.put.mockResolvedValue({
            status: 200
        })
        let wrapper = await shallow(<LevelListPanel.wrappedComponent rootStore={rootStore}/>);
        await runAllPromises();
        expect(wrapper.exists('#bulk-import-banner-alert')).toBe(true);
        const closeButton = wrapper.find('#bulk-import-banner-alert').find('button');
        closeButton.simulate('click');
        wrapper = shallow(<LevelListPanel.wrappedComponent rootStore={rootStore}/>);
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