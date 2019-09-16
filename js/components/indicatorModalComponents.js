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
