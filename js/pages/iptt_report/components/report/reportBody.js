import React, { useEffect } from 'react';
import IPTTHeader from './header';
import ReportTableHeader from './tableHeader';
import ReportTableBody from './tableBody';


export default ({ setBottomScrolling }) => {

    useEffect(() => {
        /* Adding a listener to track the position on page scrolling. Scrollable is the visible area a user can scroll the page calculated by the total height of page minus height of the visible window minus height of the footer. */
        window.addEventListener('scroll', () => {
            let footer = document.querySelector("#footer").offsetHeight;
            let scrollable = document.documentElement.scrollHeight - window.innerHeight - footer;
            setBottomScrolling(scrollable - window.scrollY) // Setting how much space left a user can scroll to reach the bottom.
        })
    }, []);

    return <main className="iptt_table_wrapper">
                <div id="id_div_top_iptt_report">
                    <IPTTHeader />
                    <table className="table table-sm table-hover table__iptt" id="iptt_table">
                        <ReportTableHeader />
                        <ReportTableBody />
                    </table>
                </div>
            </main>;

}
