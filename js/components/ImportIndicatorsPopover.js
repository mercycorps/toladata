import React from 'react'

export default class ImportIndicatorsPopover extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        $(function(){
            // Enabling Popover - JS (hidden content and title capturing)
            $("#importIndicatorsButton").popover({
                html: true, 
                placement: "bottom",
                content: function() {
                    return $('.importIndicators-body').html();
                },
                title: function() {
                    return $('.importIndicators-title').html();
                }
            });
        });   
    }


    render() {

        return (
            <div>
    
                <button
                id="importIndicatorsButton"
                href="#"
                className="btn btn-sm btn-primary mx-2 pl-2"
                >
                    <i className="fas fa-download"></i>
                        {
                            //  # Translators: a button to download a spreadsheet
                            gettext('Import Indicators')
                        }
                </button>
    
    
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
    
                    <div className="importIndicators-title">
                        {
                            // # Translators: TODO
                            gettext("Import Indicators")
                        }
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
                        >
                            {
                                // # Translators: TODO
                                gettext("Upload template")
                            }
                        </button>
                    </div>
                </div> 
    
            </div>
        )
    }
}