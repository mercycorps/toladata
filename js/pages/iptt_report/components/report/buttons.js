import React from 'react';
import ReactDOM from 'react-dom';
import { inject, observer } from 'mobx-react';
import { BootstrapPopoverButton } from '../../../../components/helpPopover';


@observer
class PinPopover extends React.Component {
    NOT_SENT = 0;
    SENDING = 1;
    SENT = 2;
    FAILED = 3;
    constructor(props) {
        super(props);
        this.state = {
            reportName: '',
            status: this.NOT_SENT,
            loading: false,
            error: "",
        };
    }
    handleChange = (e) => {
        this.setState({reportName: e.target.value});
    }
    isDisabled = () => {
        return !this.props.rootStore.pinAPI.pinReady || !this.state.reportName;
    }
    handleClick = () => {
        // If it takes longer that 1.5s to get a response, then show the loading spinner for atleast 0.5s.
        let spinner = setTimeout(() => {
            this.setState({status: this.SENDING});
            this.setState({loading: true})
        }, 1500)
        
        this.props.rootStore.pinAPI.savePin({
            name: this.state.reportName,
            ...this.props.rootStore.pinParams
        }).then( (response) => {
            if (!this.state.loading) {
                clearTimeout(spinner);
            }

            setTimeout(() => {
                this.setState({status: this.SENT, loading: false});
                this.props.updatePosition();
            }, spinner ? 500 : 0);
        }).catch( (err) => {
            if (!this.state.loading) {
                clearTimeout(spinner);
            }
            // TO DO: make this handle case where err=="DUPLICATE" to update box with the red strings from the ticket
            // Note: the code below is the old "assume this failure was unexpected" handler, we should leave it in
            // for cases where err != "DUPLICATE"

            // Delayed response to prevent visible flash of the loading spinner.
            setTimeout(() => {
                this.setState({
                    status: err === "DUPLICATE" ? this.NOT_SENT : this.FAILED, 
                    error: err,
                    loading: false,
                })
            }, spinner ? 500 : 0)

            err !== "DUPLICATE" ? console.log("ajax error:", ev) : null;
        });
    }
    render() {
        return (
            <React.Fragment>
            {(() => {
            switch(this.state.status) {
                case this.SENT:
                    return (
                        <div className="form-group">
                            <p><span>

                                {/* # Translators: The user has successfully "pinned" a report link to a program page for quick access to the report */}
                                {gettext('Success!  This report is now pinned to the program page.')}

                            </span></p>
                            <p><a href={ this.props.rootStore.pinAPI.programPageUrl }>

                                {/* # Translators: This is not really an imperative, it's an option that is available once you have pinned a report to a certain web page */}
                                {gettext('Visit the program page now.')}

                            </a></p>
                        </div>
                    );
                case this.FAILED:
                    return (
                        <div className="form-group">
                                <p><span>

                                    {/* # Translators: Some error occured when trying to pin the report*/}
                                    {gettext('Something went wrong when attempting to pin this report.')}
                                    
                                </span></p>
                        </div>
                    );
                case this.NOT_SENT:
                    return (
                        <React.Fragment>
                            <div className="form-group">
                                <label className="">
                                    {
                                        /* # Translators: a field where users can name their newly created report */
                                        gettext('Report name')
                                    }
                                </label>
                                <input type="text" className="form-control"
                                     value={ this.state.reportName }
                                     maxLength="50"
                                     onChange={ this.handleChange }
                                     disabled={ this.state.sending }/>
                                <div className="has-error">
                                    { this.state.error === "DUPLICATE" ?
                                        <span><small>

                                            {/* # Translators: An error occured because a report has already been pinned with that same name */}
                                            {gettext('A pin with this name already exists.')}

                                        </small></span>
                                        :
                                        null
                                    }
                                </div>
                            </div>
                            <button type="button"
                                        onClick={ this.handleClick }
                                        disabled={ this.isDisabled() }
                                        className="btn btn-primary btn-block">
                                        {
                                            gettext('Pin to program page')
                                        }
                            </button>
                        </React.Fragment>
                    );
                case this.SENDING:
                    return (
                        <div className="btn btn-primary popover-loader" disabled>
                            <img src='/static/img/ajax-loader.gif' />&nbsp;
                        </div>
                    );
                }
            })()}
            </React.Fragment>
        );
    }
}


@inject('rootStore')
@observer
export class PinButton extends BootstrapPopoverButton {
    popoverName = 'pin';

    getPopoverContent = () => {
        return (
            <PinPopover
                rootStore={ this.props.rootStore }
                updatePosition={() => {$(this.refs.target).popover('update');}}
            />
            );
    }

    render() {
        return (
            <React.Fragment>
                <button
                    href="#"
                    className="btn btn-sm btn-secondary"
                    ref="target">
                <i className="fas fa-thumbtack"></i>
                    {
                        /* # Translators: a button that lets a user "pin" (verb) a report to their home page */
                        gettext('Pin')
                    }
                </button>
            </React.Fragment>
        );
    }
}


@observer
class ExcelPopover extends React.Component {
    getCurrent = () => {
        if (this.props.excelUrl) {
            window.sendGoogleAnalyticsEvent({
                category: "IPTT",
                action: "Export",
                label: this.props.excelUrl
            });
            window.open(this.props.excelUrl, '_blank');
        }
    }

    getAll = () => {
        if (this.props.fullExcelUrl) {
            window.sendGoogleAnalyticsEvent({
                category: "IPTT",
                action: "Export",
                label: this.props.fullExcelUrl
            });
            window.open(this.props.fullExcelUrl, '_blank');
        }
    }
    render() {
        return (
            <div>
                <button type="button" className="btn btn-primary btn-block" onClick={ this.getCurrent }>
                    {
                        /* # Translators: a download button for a report containing just the data currently displayed */
                        gettext('Current view')
                    }
                </button>
                <button type="button" className="btn btn-primary btn-block" onClick={ this.getAll }>
                    {
                        /* # Translators: a download button for a report containing all available data */
                        gettext('All program data')
                    }
                </button>
            </div>
        );
    }
}

@observer
export class ExcelPopoverButton extends BootstrapPopoverButton {
    popoverName = 'excel';

    getPopoverContent = () => {
        return (
            <ExcelPopover { ...this.props } />
            );
    }

    render() {
        return (
            <React.Fragment>
                <button type="button"
                    className="btn btn-sm btn-secondary"
                    ref="target">
                    <i className="fas fa-download"></i> Excel
                    </button>
            </React.Fragment>
        );
    }
}


@observer
export class ExcelButton extends React.Component {
    handleClick = () => {
        if (this.props.excelUrl) {
            window.sendGoogleAnalyticsEvent({
                category: "IPTT",
                action: "Export",
                label: this.props.excelUrl
            });
            window.open(this.props.excelUrl, '_blank');
        }
    }

    render() {
        return (
            <React.Fragment>
                <button type="button"
                    className="btn btn-sm btn-secondary"
                    onClick={this.handleClick }>
                    <i className="fas fa-download"></i> Excel
                </button>
            </React.Fragment>
        );
    }
}
