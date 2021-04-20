import React from 'react'
import ReactDOM from 'react-dom';

export default class HelpPopover extends React.Component {
    constructor(props) {
        super(props)
        this.placement = props.placement || null;
        this.popoverRef = props.innerRef || React.createRef();
        this.iconClass = props.iconClass || "far fa-question-circle";
        this.iconStyle = props.iconStyle || {};
        this.linkStyle = {};
        if (props.linkHeight) {
            this.linkStyle.height = props.linkHeight;
        }
    }

    render() {
        return (
            <a
                tabIndex="0"
                style={ this.linkStyle }
                data-toggle="popover"
                data-trigger="focus"
                data-html="true"
                data-placement={this.placement}
                data-content={this.props.content}
                className={this.props.className}
                ref={this.popoverRef}
                >
            <i aria-label={ this.props.ariaText } style={ this.iconStyle } className={ this.iconClass }></i></a>
        )
    }
}

export class BootstrapPopoverButton extends React.Component {
    popoverName = 'base';
    popoverTitle = ''; // By default, an empty string to produce no title for popovers. Can be overwrittien in extensions of this class.

    componentDidMount = () => {
        // make a cancelable (class method) function so clicking out of the popover will close it:
        this.bodyClickHandler = (ev) => {
            if ($(`#${this.popoverName}_popover_content`).parent().find($(ev.target)).length == 0) {
                $(this.refs.target).popover('hide');
            }
        }
        const popoverOpenHandler = () => {
            // first make it so any click outside of the popover will hide it:
            $('body').on('click', this.bodyClickHandler);
            // update position (it's had content loaded):
            $(this.refs.target).popover('update')
                //when it hides destroy the body clickhandler:
                .on('hide.bs.popover', () => {$('body').off('click', this.bodyClickHandler);});
        };
        const shownFn = (ev) => {
            ReactDOM.render(
                this.getPopoverContent(),
                document.querySelector(`#${this.popoverName}_popover_content`),
                popoverOpenHandler
            );
        };
        $(this.refs.target).popover({
            content: `<div id="${this.popoverName}_popover_content"></div>`,
            title: this.popoverTitle ? `<div>${this.popoverTitle}</div>` : "",
            html: true,
            placement: 'bottom'
        }).on('shown.bs.popover', shownFn);
    }

    getPopoverContent = () => {
        throw new Error('not implemented');
    }
}
