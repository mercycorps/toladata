import React, { useEffect, useState } from 'react';
import IPTTFilterForm from './filterForm';

export default ({bottomScrolling, extend, tableHeight}) => {

    /* 
    When a user scrolls to the bottom of the IPTT, the sidebar and table will sync at some point so that they both reach their end at the same time. 

    - The "bottomScrolling" variable is the amount of space left for the user to scroll before reaching the bottom of the IPTT. 
    - The "startScroll" variable is the height/point in which the sidebar and table should start syncing. When a user scrolls down to this point, the sidebar will begin automatically scrolling along with the table.  
    - The "tableHeight" variable is the height of the table. It is used to see if the tables height is shorter than the sidebar. If so, don't apply the sync scrolling effect.
    - The "extend" variable accounts for the footers height and pushes down the sidebar and toggle to keep them visible and not have the top of them cut off when scrolled to very bottom. Without this, the toggler and top of the sidebar will be pushed above the visible view when the footer is visible.

    EXAMPLE: 
    bottomScrolling = 600 ~ The user has scrolled down the table to the point where there is only 600px remaining until they reach the bottom of the screen.
    startScroll = 500 ~ Once the user reaches a bottomScrolling point of 500, the sidebar will start scrolling at the same rate so that when they reach the bottom of the table, the sidebar also reaches the bottom.
    */

   const [startScroll, setStartScroll] = useState(0);

   // Calculate how much of the sidebar is not visible and remaining to be scrolled. Will recalculate on resizing and loading updates.
   useEffect(() => {
       let sidebarElement = document.querySelector("#sidebar");

       // The "start" variable is equal to the total height of the sidebar minus the height of the visible portion of the sidebar. The sidebar's #filter-extra component has a height of 350px to allow a user to scroll the sidebar down even further manually and more freely. However, we don't want to include this blank space when establishing the point the sync scrolling should start, so we subtract 300px to offset this extra blank space.
       let start = sidebarElement.scrollHeight - sidebarElement.clientHeight - 300;
       setStartScroll(start);
   })


    // When bottomScrolling is less than or equal to the startScroll point, apply the sync effect.
    if (startScroll && bottomScrolling && bottomScrolling <= startScroll) {
       let sidebarElement = document.querySelector("#sidebar");
       
        // The scrollTop attribute sets how much the sidebar has scrolled by setting at what height the top of the sidebar should be at. However, if the table is shorter than the total length of the sidebar. The sidebar will not automatically scrolll but rather stay sticky at the top.
        sidebarElement.scrollTop = tableHeight <= startScroll ? 0 : startScroll - bottomScrolling;
    }


    return (
        <div className="sidebar_container">
            <div className="sidebar_wrapper">
                <div className="collapse width show" id="sidebar">
                <div className="extender-main" style={{height: extend >= 0 ? extend : 0}}></div>
                    <IPTTFilterForm />
                </div>
                <div className="sidebar-toggle">
                    <a href="#" data-target="#sidebar" data-toggle="collapse"
                        title={

                            /* # Translators: A toggle button that hides a sidebar of filter options */
                            gettext('Show/Hide Filters') }>

                            <div className="extender-toggle" style={{height: extend >= 0 ? extend : 0}}></div>
                            <i className="fa fa-chevron-left"></i>
                    </a>
                </div>
            </div>
        </div>
    );
}