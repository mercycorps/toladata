import React, { useEffect } from 'react';
import IPTTHeader from './header';
import ReportTableHeader from './tableHeader';
import ReportTableBody from './tableBody';


export default ({ setBottom }) => {

    useEffect(() => {
        window.addEventListener('scroll', () => {
            let footer = document.querySelector("#footer").offsetHeight;
            let scrollable = document.documentElement.scrollHeight - window.innerHeight - footer;
            setBottom(scrollable - window.scrollY) // Where the sidebar should match scrolling
        })
    }, []);

    return <main className="iptt_table_wrapper" >
                <div id="id_div_top_iptt_report">
                    <IPTTHeader />
                    <table className="table table-sm table-hover table__iptt" id="iptt_table">
                        <ReportTableHeader />
                        <ReportTableBody />
                    </table>
                </div>
            </main>;

}
