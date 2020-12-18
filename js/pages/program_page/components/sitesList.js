import React from 'react';
import { observer } from "mobx-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'

export default observer(({rootStore, ...props}) => {

    return (
        <React.Fragment>
        <h3>{
            // # Translators: heading for actions related to Sites as in locations connected to results
            gettext('Sites')
        }</h3>
        <ul className="list-unstyled">
        { (rootStore.program.siteCount && rootStore.program.siteCount > 0) ?
            <li><a href={`/workflow/siteprofile_list/${rootStore.program.pk}/0/`}>
                {
                    // # Translators: a link that leads to a list of all sites (locations) associated with a program
                    gettext("View program sites")
                }
            </a></li> :
            <li className="text-muted">
                {
                    // # Translators: indicates that no sites (locations) are associated with a program
                    gettext("There are no program sites.")
                }
            </li>
        }
        <li className="pt-2">
            <a href="/workflow/siteprofile_add/" className="btn-link text-success">
            <FontAwesomeIcon icon={ faPlusCircle } />&nbsp;{
                // # Translators: a link to add a new site (location)
                gettext("Add site")
            }</a></li>
        </ul>
        </React.Fragment>
    );
});
