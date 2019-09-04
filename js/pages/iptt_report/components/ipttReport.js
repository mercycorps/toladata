import React from 'react';
import IPTTSidebar from './sidebar/sidebar';
import IPTTReportBody from './report/reportBody';

export default () => {
    return (
        <React.Fragment>
            <IPTTSidebar />
            <IPTTReportBody />
        </React.Fragment>
    );
}