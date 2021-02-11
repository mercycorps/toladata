import React, { useState } from 'react';
import IPTTSidebar from './sidebar/sidebar';
import IPTTReportBody from './report/reportBody';

export default () => {

    const [bottomScrolling, setBottomScrolling] = useState("");
    const [extend, setExtend] = useState("");
    const [tableHeight, setTableHeight] = useState("");

    return (
        <React.Fragment>
            <IPTTSidebar bottomScrolling={bottomScrolling} extend={extend} tableHeight={tableHeight}/>
            <IPTTReportBody setBottomScrolling={setBottomScrolling} setExtend={setExtend} setTableHeight={setTableHeight}/>
        </React.Fragment>
    );
}