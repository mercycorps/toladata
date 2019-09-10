/**
 * entry point for the iptt_report webpack bundle
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';

import IPTTReportApp from './components/ipttReport';
import IPTTRootStore from './models/ipttRootStore';


const rootStore = new IPTTRootStore(reactContext);

ReactDOM.render(<Provider rootStore={ rootStore }
                          filterStore={ rootStore.filterStore }
                          reportStore={ rootStore.reportStore }>
                    <IPTTReportApp />
                </Provider>,
                document.querySelector('#id_div_content'));
