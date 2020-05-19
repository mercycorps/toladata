import React from 'react'
import { observer } from 'mobx-react';
import classNames from 'classnames';
import { library } from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { faPlusSquare, faMinusSquare } from '@fortawesome/free-solid-svg-icons'

library.add(faPlusSquare, faMinusSquare)


library.add(faPlusSquare, faMinusSquare);

export class DeleteButton extends React.Component {
    render() {
        const buttonClasses = classNames('btn-delete btn btn-sm text-danger', this.props.buttonClasses);
        const iconClasses = classNames('fa fa-times', this.props.iconClasses);
        return (
            <button
                    type={this.props.type || "button"}
                    onClick={this.props.action}
                    onKeyUp={this.props.action}
                    className={buttonClasses}>
                <i className={iconClasses}/>
            </button>
        )
    }
}


export class ExpandAllButton extends React.Component {
    render() {
        return <button className="btn btn-medium text-action btn-sm"
                       onClick={this.props.expandFunc}
                       disabled={this.props.isDisabled}>
            <FontAwesomeIcon icon="plus-square" />
            {
                /* # Translators: button label to show the details of all items in a list */}
            {gettext('Expand all')}
        </button>
    }
}


export class CollapseAllButton extends React.Component {
    render() {
        return <button className="btn btn-medium text-action btn-sm"
                       onClick={this.props.collapseFunc}
                       disabled={this.props.isDisabled}>
            <FontAwesomeIcon icon="minus-square" />
            {
                /* # Translators: button label to hide the details of all items in a list */}
            {gettext('Collapse all')}
        </button>
    }
}
