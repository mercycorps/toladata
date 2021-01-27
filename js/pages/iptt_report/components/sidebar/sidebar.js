import React, { useEffect, useState } from 'react';
import IPTTFilterForm from './filterForm';

export default ({bottom}) => {

    const [starting, setStarting] = useState(null);

    if (starting && bottom && bottom <= starting) {
        let sidebarElement = document.querySelector("#sidebar");
        sidebarElement.scrollTop = starting - bottom;
    }

    useEffect(() => {
        let sidebarElement = document.querySelector("#sidebar");
        let start = sidebarElement.scrollHeight - sidebarElement.clientHeight;
        setStarting(start)
    }, [])
    
    return (
        <div className="sidebar_container">
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
        </div>
    );
}