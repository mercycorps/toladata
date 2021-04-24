import React from 'react';
import { BootstrapPopoverButton } from './helpPopover';
import api from '../apiv2';

class ImportIndicatorsPopover extends React.Component {
    // These define the different cases/views of the Popover to switch between.
    DOWNLOAD_UPLOAD = 0;
    FEEDBACK = 1;
    CONFIRM = 2;
    SUCCESS = 3;

    constructor(props) {
        super(props);
        this.state = {
            status: this.DOWNLOAD_UPLOAD
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
                        // View for downloading and uploading the template
                        case this.DOWNLOAD_UPLOAD:
                            return (
                                <div className="importIndicators-body">
                                    <div className="import-text">
                                        <ol>
                                            <li>
                                                {
                                                    // # Translators: Instructions for users to download the template, open it in Excel, and then fill in indicators information.
                                                    gettext("Download the template, open it in Excel, and enter indicators.")
                                                }
                                            </li>
                                            <li>
                                                {
                                                    // # Translators: Instruction for users to upload their filled in template and then follow the instructions to complete the import process.
                                                    gettext("Upload the template and follow instructions to complete the process.")
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
                                                // # Translators: Button to download a template
                                                gettext("Download template")
                                            }
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-primary btn-upload"
                                            onClick={() => this.handleUpload()}
                                        >
                                            {
                                                // # Translators: Button to upload a template
                                                gettext("Upload template")
                                            }
                                        </button>
                                    </div>
                                </div> 
                            );
                        // View to provide error feedback on their uploaded template
                        case this.FEEDBACK:
                            return (
                                <div>
                                    Error Feedback
                                </div>
                            )
                        // View to ask users to confirm the upload
                        case this.CONFIRM:
                            return (
                                <div>
                                    Confrim Import
                                </div>
                            )
                        // View for a successful upload (May or may not be needed if using PNotify)
                        case this.SUCCESS:
                            return (
                                <div>
                                    Successful Import
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
    popoverTitle = gettext("Import indicators")    

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
                className="btn btn-sm btn-primary pl-2"
                >
                    <i className="fas fa-download"></i>
                        {
                            //  # Translators: a button to open the import indicators menu
                            gettext('Import indicators')
                        }
                </button>
            </React.Fragment>
        );
    }

}