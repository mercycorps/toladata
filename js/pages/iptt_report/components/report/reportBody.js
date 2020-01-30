import React from 'react';
import IPTTHeader from './header';
import ReportTableHeader from './tableHeader';
import ReportTableBody from './tableBody';


export default () => {
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
