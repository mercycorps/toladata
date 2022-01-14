import React, { useState, useEffect } from 'react';


const HelpText = ({text}) => {
    useEffect(() => {
        $('[data-toggle="popover"]').popover({html: true});
    }, []);
    return (
        <a href="#"
        tabIndex="0"
        data-toggle="popover"
        data-placement="right"
        data-trigger="focus"
        data-content={text}
        className="helptext"
        >
            &nbsp;<i className="far fa-question-circle"></i>
        </a>
    )
}

export { HelpText };