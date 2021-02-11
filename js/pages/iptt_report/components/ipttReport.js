import React, { useState } from 'react';
import IPTTSidebar from './sidebar/sidebar';
import IPTTReportBody from './report/reportBody';

export default () => {

    const [bottomScrolling, setBottomScrolling] = useState("");
    const [extend, setExtend] = useState("");

    return (
        <React.Fragment>
            <IPTTSidebar bottomScrolling={bottomScrolling} extend={extend}/>
            <IPTTReportBody setBottomScrolling={setBottomScrolling} setExtend={setExtend}/>
        </React.Fragment>
    );
}