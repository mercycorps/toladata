import React, { useState } from 'react';
import IPTTSidebar from './sidebar/sidebar';
import IPTTReportBody from './report/reportBody';

export default () => {

    const [bottomScrolling, setBottomScrolling] = useState("");

    return (
        <React.Fragment>
            <IPTTSidebar bottomScrolling={bottomScrolling}/>
            <IPTTReportBody setBottomScrolling={setBottomScrolling}/>
        </React.Fragment>
    );
}