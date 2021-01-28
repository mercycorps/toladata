import React, { useEffect, useState } from 'react';
import IPTTFilterForm from './filterForm';

export default ({bottomScrolling, extend}) => {

    const [startScroll, setStartScroll] = useState(null);
    const [open, setOpen] = useState(true);

    /* At the bottom of the page, if the amount of space left for a user to scroll the IPTT report is less than or equal to the amount of the sidebar that is not visible, the sidebar scroll position will be set to match the scroll position of the page creating a sync scrolling effect. */
    if (startScroll && bottomScrolling && bottomScrolling <= startScroll) {
        let sidebarElement = document.querySelector("#sidebar");
        sidebarElement.scrollTop = startScroll - bottomScrolling;
    }
    // Calculate how much of the sidebar is not visible and can be scrolled.
    useEffect(() => {
        let sidebarElement = document.querySelector("#sidebar");
        let start = sidebarElement.scrollHeight - sidebarElement.clientHeight;
        setStartScroll(start)
        // document.querySelector("a").addEventListener('click', () => {
        //     console.log(!sidebarElement.classList.contains('show'))
        //     setOpen(sidebarElement.classList.contains('show'))
        // })
    }, [])
    
    return (
        <div className="sidebar_container">
            <div className="sidebar_wrapper">
                <div className="collapse width show" id="sidebar">
                <div className="extender-main" style={{height: extend >= 0 ? (extend + 10) + "px" : 0}}></div>
                    <IPTTFilterForm />
                </div>
                <div className="sidebar-toggle">
                    <div className="extender-toggle" style={{height: open && extend >= 0 ? extend + "px" : 0}}></div>

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