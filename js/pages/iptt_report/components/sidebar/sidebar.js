import React from 'react';
import IPTTFilterForm from './filterForm';
import { inject, observer } from 'mobx-react';

// export default () => {
const sidebar = inject('filterStore')(
    observer(({filterStore}) => {
        return (
            <div className="sidebar_wrapper">
                <div 
                    id="sidebar" 
                    className={"collapse width show", filterStore._pulse}
                    >
                    <IPTTFilterForm />
                </div>
                <div className="sidebar-toggle">
                <a href="#" data-target="#sidebar" data-toggle="collapse"
                        title={
                            /* # Translators: A toggle button that hides a sidebar of filter options */
                            gettext('Show/Hide Filters') }>
                    <i className="fa fa-chevron-left"></i>
                </a>
                </div>
            </div>
        );
    })
);
// }

export default sidebar;