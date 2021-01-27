import React, { useState } from 'react';
import IPTTSidebar from './sidebar/sidebar';
import IPTTReportBody from './report/reportBody';

export default () => {

    const [bottom, setBottom] = useState("");

    return (
        <React.Fragment>
            <IPTTSidebar bottom={bottom}/>
            <IPTTReportBody setBottom={setBottom}/>
        </React.Fragment>
    );
}