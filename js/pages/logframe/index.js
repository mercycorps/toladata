/**
 * Entry point for the logframe webpack bundle
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import FilterStore from './models/filterStore';
import ProgramStore from './models/programStore';
import TitleBar from './components/title';
import LogframeApp from './components/main';

const filterStore = new FilterStore();
const dataStore = new ProgramStore(jsContext);

ReactDOM.render(
    <Provider filterStore={ filterStore }
              dataStore={ dataStore }>
        <TitleBar />
    </Provider>,
    document.querySelector('.region-header'));

ReactDOM.render(
    <Provider filterStore={ filterStore }
              dataStore={ dataStore }>
        <LogframeApp />
    </Provider>,
    document.querySelector('#id_div_content'));