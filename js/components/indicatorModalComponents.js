import React from 'react';
import { observer } from 'mobx-react';

export const AddIndicatorButton = observer(({ readonly, ...params }) => {
    return (
            <button
                type="button"
                disabled={readonly}
                className="btn btn-link btn-add"
                onClick={e => {openCreateIndicatorFormModal(params)}}>
                <i className="fas fa-plus-circle"/> {gettext("Add indicator")}
            </button>
    );
});


export const UpdateIndicatorButton = observer(({ readonly, label=null, ...params }) => {
    return (
            <button
                type="button"
                disabled={readonly}
                className="btn btn-link"
                onClick={e => {openUpdateIndicatorFormModal(params)}}>
                <i className="fas fa-cog"/>{label}
            </button>
    );
});



export const ExpandAllButton = observer(
    ({clickHandler, disabled}) => {
        return <button className="btn btn-medium text-action btn-sm"
                       onClick={ clickHandler }
                       disabled={ disabled }>
            <i className="fas fa-plus-square"></i>
            {
                /* # Translators: button label to show the details of all rows in a list */}
            {gettext('Expand all')}
        </button>
    }
);

export const CollapseAllButton = observer(
    ({clickHandler, disabled}) => {
        return <button className="btn btn-medium text-action btn-sm"
                       onClick={ clickHandler }
                       disabled={ disabled }>
            <i className="fas fa-minus-square"></i>
            {
                /* # Translators: button label to hide the details of all rows in a list */}
            {gettext('Collapse all')}
        </button>
    }
);
