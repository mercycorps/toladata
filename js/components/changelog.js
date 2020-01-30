import React from 'react'
import { observer } from 'mobx-react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { toJS } from 'mobx';

export const ChangeField = ({name, data}) => {
    if (name==="Disaggregation categories" && typeof data === 'object' && data !== null) {
        const sorted_labels = Object.values(data).sort((a,b) => a.custom_sort - b.custom_sort)
        return <React.Fragment>
            <strong>{name}: </strong>
            <ul className="no-list-style">
                {sorted_labels.map( (entry, index) => {
                    return <li key={index}>{(entry.label !== undefined && entry.label != null) ? entry.label : ""}</li>
                })}
            </ul>
        </React.Fragment>
    }

    else {
        return <div className="change__field">
            <strong>{name}</strong>: {(data != undefined && data != null) ? data.toString() : 'N/A'}
        </div>
    }
}

const ChangeLogEntryHeader = ({data, is_expanded, toggle_expando_cb}) => {
    return <tr className={is_expanded ? 'changelog__entry__header is-expanded' : 'changelog__entry__header'} onClick={() => toggle_expando_cb(data.id)}>{/* TODO: apply is-expanded dynamically */}
        <td className="text-nowrap text-action">
            <FontAwesomeIcon icon={is_expanded ? 'caret-down' : 'caret-right'} />&nbsp;<strong>{data.date}</strong>
        </td>
        <td className="text-nowrap">{data.admin_user}</td>
        <td className="text-nowrap">{data.pretty_change_type}</td>
        <td></td>
        <td></td>
    </tr>
}

const ChangeLogEntryRow = ({data}) => {
    if (data.change_type == 'user_programs_updated') {
        // Create multiple row for program/country changes:
        return <React.Fragment>
            {Object.entries(data.diff_list.countries).length > 0 &&
                Object.entries(data.diff_list.countries).map(([id, country]) =>
                    <tr key={id} className="changelog__entry__row">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                            <div className="changelog__change--prev">
                                <ChangeField name="country" data={country.prev.country} />
                                <ChangeField name="role" data={country.prev.role} />
                            </div>
                        </td>
                        <td>
                            <div className="changelog__change--new">
                                <ChangeField name="country" data={country.new.country} />
                                <ChangeField name="role" data={country.new.role} />
                            </div>
                        </td>
                    </tr>
                )
            }
            {Object.entries(data.diff_list.programs).length > 0 &&
                Object.entries(data.diff_list.programs).map(([id, program]) =>
                    <tr key={id} className="changelog__entry__row">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                            <div className="changelog__change--prev">
                                <ChangeField name="program" data={program.prev.program} />
                                <ChangeField name="country" data={program.prev.country} />
                                <ChangeField name="role" data={program.prev.role} />
                            </div>
                        </td>
                        <td>
                            <div className="changelog__change--new">
                                <ChangeField name="program" data={program.new.program} />
                                <ChangeField name="country" data={program.new.country} />
                                <ChangeField name="role" data={program.new.role} />
                            </div>
                        </td>
                    </tr>
                )
            }
        </React.Fragment>
    } else {
        return <tr className="changelog__entry__row">
            <td className="text-nowrap"></td>
            <td></td>
            <td></td>
            <td>
                <div className="changelog__change--prev">
                    {data.diff_list.map((changeset, id)  =>
                        <ChangeField key={id} name={changeset.pretty_name} data={changeset.prev} />
                    )}
                </div>
            </td>
            <td>
                <div className="changelog__change--new">
                    {data.diff_list.map((changeset, id) =>
                        <ChangeField key={id} name={changeset.pretty_name} data={changeset.new} />
                    )}
                </div>
            </td>
        </tr>
    }
}

const ChangeLogEntry = ({data, is_expanded, toggle_expando_cb}) => {
    return <tbody className="changelog__entry" key={data.id}>
        <ChangeLogEntryHeader data={data} is_expanded={is_expanded} toggle_expando_cb={toggle_expando_cb} />
        {is_expanded &&
        <ChangeLogEntryRow data={data}/>
        }
    </tbody>
}

const ChangeLog = observer(({data, expanded_rows, toggle_expando_cb}) => {
    // If expanded_rows is not null/undefined then use it to control expansion/collapse of entries
    // otherwise, default it to "open"
    return <table className="table table-sm bg-white table-bordered text-small changelog">
        <thead>
            <tr>
                <th className="text-nowrap">{gettext("Date")}</th>
                <th className="text-nowrap">{gettext("Admin")}</th>
                <th className="text-nowrap">{gettext("Change Type")}</th>
                <th className="text-nowrap td--half-stretch">{gettext("Previous Entry")}</th>
                <th className="text-nowrap td--half-stretch">{gettext("New Entry")}</th>
            </tr>
        </thead>
        {data.map((entry) => {
            let is_expanded = true;
            if (expanded_rows) {
                is_expanded = expanded_rows.has(entry.id);
            }
            return <ChangeLogEntry key={entry.id} data={entry} is_expanded={is_expanded} toggle_expando_cb={toggle_expando_cb} />
        })}
    </table>
});

export default ChangeLog
