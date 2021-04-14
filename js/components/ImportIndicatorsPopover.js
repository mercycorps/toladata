import React from 'react';
import { BootstrapPopoverButton } from './helpPopover';
import api from '../apiv2';

class ImportIndicatorsPopover extends React.Component {
    ONE = 0;
    TWO = 1;
    constructor(props) {
        super(props);
        this.state = {
            status: this.ONE
        }
    }

    handleDownload = () => {
        console.log("Download Clicked");
        api.downloadTemplate()
            .then(response => {
                console.log("Reponse:", response);
                alert("DONWLOAD TEMPLATE")
            })
    }
    handleUpload = () => {
        console.log("Upload Clicked");
        api.uploadTemplate()
        .then(response => {
            console.log("Reponse:", response);
            alert("UPLOAD TEMPLATE")
        })
    }

    render() {
        return (
            <React.Fragment>
                {(() => {
                    switch(this.state.status) {
                        case this.ONE:
                            return (
                                <div className="importIndicators-body">
                                    <div className="import-text">
                                        <ol>
                                            <li>
                                                {
                                                    // # Translators: TODO
                                                    gettext("Download the template, open it in Excel, and enter indicators.")
                                                }
                                            </li>
                                            <li>
                                                {
                                                    // # Translators: TODO
                                                    gettext("Upload the template and follow instructions to complete the proocess.")
                                                }
                                            </li>
                                        </ol>
                                    </div>

                                    <div className="import-buttons">
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-primary btn-download"
                                            onClick={() => this.handleDownload()}
                                            >
                                            {
                                                // # Translators: TODO
                                                gettext("Download template")
                                            }
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-primary btn-upload"
                                            onClick={() => this.handleUpload()}
                                        >
                                            {
                                                // # Translators: TODO
                                                gettext("Upload template")
                                            }
                                        </button>
                                    </div>
                                </div> 
                            );
                        case this.TWO:
                            return (
                                <div>
                                    EMPTY
                                </div>
                            )
                    }
                })()}
            </React.Fragment>
        )
    }
}

export class ImportIndicatorsButton extends BootstrapPopoverButton {
    popoverName = "importIndicators"
    popoverTitle = "Import Indicators"

    getPopoverContent = () => {
        return (
            <ImportIndicatorsPopover />
            );
    }

    render() {
        return (
            <React.Fragment>
                <button
                type="button"
                ref="target"
                className="btn btn-sm btn-primary mx-2 pl-2"
                >
                    <i className="fas fa-download"></i>
                        {
                            //  # Translators: a button to download a spreadsheet
                            gettext('Import Indicators')
                        }
                </button>
            </React.Fragment>
        );
    }

}