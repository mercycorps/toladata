import React from 'react';
import IPTTFilterForm from './filterForm';

export default () => {
    return (
        <div className="sidebar_wrapper">
            <div className="collapse width show" id="sidebar">
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
}
