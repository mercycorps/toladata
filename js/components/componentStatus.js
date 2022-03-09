import React from 'react'

const DataLoading = () => {
    return (
        <div className="data-loading__container">
            <img src='/static/img/ajax-loader.gif' />&nbsp;
        </div>
    )
}

const ServerError = (status) => {
    return (
        <div className="server-error__container">
            <React.Fragment>
                {/* // If statement needed to unmount the icon */}
                {status === status ? <div><i className="fas fa-exclamation-triangle server-error__icon"/></div> : null}
            </React.Fragment>
            <p className="text-secondary px-1 my-auto">
                {
                    // # Translators: Notification for a error that happend on the web server.
                    gettext('There was a server-related problem.')
                }
            </p>
        </div>
    )
}

export { DataLoading, ServerError };
