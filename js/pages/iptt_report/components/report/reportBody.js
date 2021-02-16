import React, { useEffect } from 'react';
import IPTTHeader from './header';
import ReportTableHeader from './tableHeader';
import ReportTableBody from './tableBody';


export default ({ setBottomScrolling, setExtend, setTableHeight }) => {

    useEffect(() => {
        /* A function to track key variables when the IPTT is scrolled. */
        const scrollEventHandler = () => {
            let footer = document.querySelector("#footer").offsetHeight;

            // The "scrollable" variable is the non visible height of the IPTT table (the height remaining to be scrolled). It is calculated by taking the total height of the page and subtracting the height of the visible portion of the browser and height of the footer.
            let scrollable = document.documentElement.scrollHeight - window.innerHeight - footer;
            
            // Setting how much space left a user can scroll before reaching the bottom of the IPTT. 
            setBottomScrolling(parseInt(scrollable - window.scrollY));

            // Setting the total height of the table. SetTimeout needed to render the sidebar in correct order when changing programs, otherwise the sidebar's scroll Top will be off.
            setTimeout(() => {
                setTableHeight(scrollable);
            }, 1)

            // Setting the offset height of the footer to extend the sidebar content. This is the amount/height that the footer is visible.
            setExtend(parseInt(footer - (document.documentElement.scrollHeight - window.innerHeight - window.scrollY)));
        }

        // Event listeners to track page scrolling and resizing, including zooming.
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
