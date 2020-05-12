import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';

import QSRootStore from './models/ipttQSRootStore';
import { IPTTQuickstartForm } from './components/main';

const rootStore = new QSRootStore(jsContext);

ReactDOM.render(
    <Provider rootStore={ rootStore }>
        <IPTTQuickstartForm />
    </Provider>,
    document.querySelector('#id_div_top_quickstart_iptt')
);