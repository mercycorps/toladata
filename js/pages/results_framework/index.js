import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "mobx-react"
import eventBus from '../../eventbus';
import createRouter from 'router5';
import browserPlugin from 'router5-plugin-browser';
import {reloadPageIfCached} from '../../general_utilities';
import {LevelListPanel} from './components/level_list';
import {LevelTierPicker} from './components/leveltier_picker';
import {RootStore} from './models';

/*
 * Model/Store setup
 */
const {program, levels, indicators, levelTiers, tierTemplates, englishTemplates, customTemplates, programObjectives, accessLevel, usingResultsFramework, maxTiers} = jsContext;
const rootStore = new RootStore(program, levels, indicators, levelTiers, tierTemplates, englishTemplates, customTemplates, programObjectives, accessLevel, usingResultsFramework, maxTiers);
/*
 * React components on page
 */

ReactDOM.render(
    <Provider rootStore={rootStore}>
        <React.Fragment>
            <LevelTierPicker />
            <LevelListPanel />
        </React.Fragment>
    </Provider>,
    document.querySelector('#level-builder-react-component'));



reloadPageIfCached();
