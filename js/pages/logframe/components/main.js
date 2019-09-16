import React from 'react';
import { inject } from 'mobx-react';
import SubTitleRow from './subtitle';
import LogframeTable from './table';


const LogframeApp = () => {
    return (
        <React.Fragment>
            <SubTitleRow />
            <table className="logframe__table table table-sm table-bordered bg-white text-small">
                <LogframeTable />
            </table>
        </React.Fragment>
    );
}

export default LogframeApp;
