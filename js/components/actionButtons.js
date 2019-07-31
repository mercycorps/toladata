import React from 'react'
import { observer } from 'mobx-react';
import classNames from 'classnames';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

export class DeleteButton extends React.Component {
    render() {
        const buttonClasses = classNames('deletebtn btn btn-sm text-danger', this.props.buttonClasses);

        return (
            <button
                    type={this.props.type || "button"}
                    onClick={this.props.action}
                    className={buttonClasses}>
                <FontAwesomeIcon icon={'times'} className={this.props.iconClasses || ''} />
            </button>
        )
    }
}
