import React, { useState } from 'react'
import ReactDOM from 'react-dom';


const ImportIndicatorsPopover = (props) => {

    let content = 
        `
            <div>
                <h4>Import Indicator</h4>
                <ol class="import-text">
                    <li>
                        ${
                            // # Translators: TODO
                            gettext("Download the template, open it in Excel, and enter indicators.")
                        }
                    </li>
                    <li>
                        ${
                            // # Translators: TODO
                            gettext("Upload the template and follow instructions to complete the proocess.")
                        }
                    </li>
                </ol>
                <div class="import-buttons">
                    <button
                        type="button"
                        class="btn btn-sm btn-primary btn-download"
                    >
                        ${
                            // # Translators: TODO
                            gettext("Download template")
                        }
                    </button>
                    <button
                        type="button"
                        class="btn btn-sm btn-primary btn-upload"
                    >
                        ${
                            // # Translators: TODO
                            gettext("Upload template")
                        }
                    </button>
                </div>
            </div>
        `;
    
    return (
            <button
            type="button"
            className="btn btn-sm btn-primary mx-2 pl-2"
            data-toggle="popover" 
            data-placement="bottom"
            data-content={content}
            html="true"
            >
                <i className="fas fa-download"></i>
                    {
                        //  # Translators: a button to download a spreadsheet
                        gettext('Import Indicators')
                    }
            </button>
    )
}


export default ImportIndicatorsPopover;