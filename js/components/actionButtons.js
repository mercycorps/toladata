import React from 'react'
import { observer } from 'mobx-react';
import classNames from 'classnames';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

export class DeleteButton extends React.Component {
    render() {
        const buttonClasses = classNames('deletebtn btn btn-sm text-danger', this.props.buttonClasses);
        const iconClasses = classNames('fa fa-times', this.props.iconClasses);
        // TODO: integrate classes
        return (
            <button
                    type={this.props.type || "button"}
                    onClick={this.props.action}
                    className={buttonClasses}>
                <i className={iconClasses}/>
                {/*<FontAwesomeIcon icon={'times'} className={this.props.iconClasses || ''} />*/}
            </button>
        )
    }
}
