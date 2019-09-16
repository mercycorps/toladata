import React from 'react';

export const IPTTButton = ( props ) => {
    return (
        <button type="reset" className={ "btn btn-block btn-reset" + (props.isDisabled ? " disabled" : "")}
             onClick={ props.action }>
                { props.label }
        </button>
    );
}