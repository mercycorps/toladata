import React from 'react'
import { observer } from 'mobx-react';
import ChangeLog from 'components/changelog'

@observer
export class CountryHistory extends React.Component {
    // TODO: is disaggregation name necessary in the country history serializer?
    render() {
        const {history, store} = this.props;
        const changelog_expanded_rows = store.changelog_expanded_rows;
        const country_name = store.editing_target ? store.countries.filter( c => c.id === store.editing_target)[0].country + ": " : "";
        return <div className="tab-pane--react admin-edit-pane">
            <h2 className="no-bold">{country_name}{gettext("Status and History")}</h2>

            <ChangeLog data={history} expanded_rows={changelog_expanded_rows} toggle_expando_cb={(row_id) => store.toggleChangeLogRowExpando(row_id)} />

        </div>


    }
}

export default CountryHistory;
