import React, { useEffect } from 'react';
import IPTTHeader from './header';
import ReportTableHeader from './tableHeader';
import ReportTableBody from './tableBody';


export default ({ setBottomScrolling, setExtend, setTableHeight }) => {

    useEffect(() => {
        /* Adding a function to track the position on page scrolling. Scrollable is the visible area a user can scroll the page calculated by the total height of page minus height of the visible window minus height of the footer. */
        const scrollEventHandler = () => {
            let footer = document.querySelector("#footer").offsetHeight;
            let scrollable = document.documentElement.scrollHeight - window.innerHeight - footer;
            
            // Setting the total height of the table. Set time out needed to render the sidebar in correct order when changing programs, otherwise the sidebar's scroll Top will be off.
            setTimeout(() => {
                setTableHeight(scrollable);
            }, 1)

            // Setting how much space left a user can scroll to reach the bottom.
            setBottomScrolling(parseInt(scrollable - window.scrollY));

            // Setting the offset height of the footer to extend the sidebar content.
            setExtend(parseInt(footer - (document.documentElement.scrollHeight - window.innerHeight - window.scrollY)));
        }

        // Event listeners for page scrolling and resizing
        window.onresize = scrollEventHandler;
        window.onscroll = scrollEventHandler;
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
