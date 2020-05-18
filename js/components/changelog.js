import React from 'react'
import { observer } from 'mobx-react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { toJS } from 'mobx'


export const ChangeField = ({name, data, extraTitleText=null}) => {
    const extraTitle = extraTitleText ? <h4 className="disagg-type__title, text-small" >{extraTitleText}</h4> : null;
    if (name==="Disaggregation categories" && typeof data === 'object' && data !== null) {
        const sorted_labels = Object.values(data).sort((a,b) => a.custom_sort - b.custom_sort);
        return <React.Fragment>
            <strong>{name}: </strong>
            {extraTitle}
            <ul className="no-list-style">
                {sorted_labels.map( (entry, index) => {
                    return <li key={index}>{(entry.label !== undefined && entry.label !== null) ? entry.label : ""}</li>
                })}
            </ul>
        </React.Fragment>
    }

    else {
        let change_value = "N/A";
        if (data !== undefined && data !== null) {
            change_value = ["true", "false"].includes(data.toString())
                ? data.toString().replace("t", "T").replace("f", "F")
                : data.toString();
        }
        return <div className="change__field">
            <strong>{name}</strong>: {change_value}
        </div>
    }
};

const ChangeLogEntryHeader = ({data, is_expanded, toggle_expando_cb}) => {
    // TODO: apply is-expanded dynamically
    return <tr className={is_expanded ? 'changelog__entry__header is-expanded' : 'changelog__entry__header'} onClick={() => toggle_expando_cb(data.id)}>
        <td className="text-nowrap text-action">
            <FontAwesomeIcon icon={is_expanded ? 'caret-down' : 'caret-right'} />&nbsp;<strong>{data.date}</strong>
        </td>
        <td className="text-nowrap">{data.admin_user}</td>
        <td className="text-nowrap">{data.pretty_change_type}</td>
        <td></td>
        <td></td>
    </tr>
};

const ChangeLogEntryRow = (props) => {
    return <tr key={props.id} className="changelog__entry__row">
                <td></td>
                <td></td>
                <td></td>
                <td>
                    <div className="changelog__change--prev">
                        {props.previous}
                    </div>
                </td>
                <td>
                    <div className="changelog__change--new">
                        {props.new}
                    </div>
                </td>
            </tr>

};

const ChangeLogEntryRowBuilder = ({data}) => {

    let allRows = [];

    // We should never need this but just in case someone manages to store a log entry without actual diffs, give them
    // a soft place to land.
    const nullRow = <ChangeLogEntryRow previous={gettext("No differences found")} new={null} id={1} key={1}/>

    // If they manage to store a log without any diffs at all, send them to the soft landing place.
    if ((Array.isArray(data.diff_list) && data.diff_list.length === 0) || (Object.keys(data.diff_list).length === 0)) {
        allRows.push(nullRow);
        return allRows
    }

    if (data.change_type === 'user_programs_updated') {
        // Create multiple row for program/country changes:
        Object.entries(data.diff_list.countries).forEach( ([id, country]) => {
            const key = `${id}_${country}`;
            const previousEntry = <React.Fragment>
                <ChangeField name={gettext("Country")} data={country.prev.country} />
                {/* # Translators:  Role references a user's permission level when accessing data (i.e. User or Admin) */}
                <ChangeField name={gettext("Role")} data={country.prev.role} />
            </React.Fragment>;
            const newEntry = <React.Fragment>
                <ChangeField name={gettext("Country")} data={country.new.country} />
                <ChangeField name={gettext("Role")} data={country.new.role} />
            </React.Fragment>;

            allRows.push(<ChangeLogEntryRow previous={previousEntry} new={newEntry} id={key} key={key} />);
        });
        Object.entries(data.diff_list.programs).forEach(([id, program]) => {
            const key = `${id}_${program}`;
            const previousEntry = <React.Fragment>
                <ChangeField name={gettext("Program")} data={program.prev.program} />
                <ChangeField name={gettext("Country")} data={program.prev.country} />
                <ChangeField name={gettext("Role")} data={program.prev.role} />
            </React.Fragment>;
            const newEntry = <React.Fragment>
                <ChangeField name={gettext("Program")} data={program.new.program} />
                <ChangeField name={gettext("Country")} data={program.new.country} />
                <ChangeField name={gettext("Role")} data={program.new.role} />
            </React.Fragment>;

            allRows.push(<ChangeLogEntryRow previous={previousEntry} new={newEntry} id={key} key={key} />);
        })

    }
    else {
        let extraTitleText = null;
        let skipDisaggType = false;
        if (data.pretty_change_type === "Country disaggregation updated") {
            const diff_list = data.diff_list;
            const disaggType = diff_list.filter((diff) => diff.name === "disaggregation_type");
            if (disaggType[0].prev === disaggType[0].new) {
                extraTitleText = disaggType[0].prev;
                skipDisaggType = true;
            }

        }
        data.diff_list.forEach((changeSet, id) => {
            const key = `${id}_${changeSet.pretty_name}`;
            if (!(changeSet.name === "disaggregation_type" && skipDisaggType)) {
                const previousEntry = <React.Fragment>
                    <ChangeField key={id} name={changeSet.pretty_name} data={changeSet.prev} id={id}
                                 extraTitleText={extraTitleText}/>
                </React.Fragment>;
                const newEntry = <React.Fragment>
                    <ChangeField key={id} name={changeSet.pretty_name} data={changeSet.new} id={id}
                                 extraTitleText={extraTitleText}/>
                </React.Fragment>;

                allRows.push(<ChangeLogEntryRow previous={previousEntry} new={newEntry} id={key} key={key}/>);
            }
        });
    }

    // If they manage to store a log with identical values in diffs, send them to the soft landing place.  Hopefully
    // the system will refuse to log no-difference diffs.
    if (allRows.length === 0){
        allRows.push(nullRow)
    }
    return allRows;

};

const ChangeLogEntry = ({data, is_expanded, toggle_expando_cb}) => {
    return <tbody className="changelog__entry" key={data.id}>
        <ChangeLogEntryHeader data={data} is_expanded={is_expanded} toggle_expando_cb={toggle_expando_cb} />
        {is_expanded &&
        <ChangeLogEntryRowBuilder data={data}/>
        }
    </tbody>
};

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
