import React, { useState, useContext, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BootstrapPopoverButton } from './helpPopover';
import api from '../apiv2';

export const ImportIndicatorsContext = React.createContext();

export class ImportIndicatorsButton extends BootstrapPopoverButton {
    popoverName = "importIndicators"
    popoverTitle = "Import indicators"

    constructor(props) {
        super(props);
        this.state = {
            levelStore: this.props.levelStore, 
            chosenTier: this.props.levelStore.tierTemplates[this.props.levelStore.chosenTierSetKey].tiers, // State containing a list of tier levels names of the chosen RF framework tier template
            tierLevels: [], // State to hold the tier levels name and the desired number of rows for the excel template
            setTierLevels: this.setTierLevels, // Method used to update the number of row per tier level
        }
    }

    setTierLevels = (i, tier, value) => {
        let update = this.state.tierLevels;
        update[i] = {[tier] : value};
        this.setState({
            tierLevels: update
        });
    }

    getPopoverContent = () => {
        return (
            <ImportIndicatorsContext.Provider value={ this.state }>
                <ImportIndicatorsPopover />
            </ImportIndicatorsContext.Provider>
            );
    }

    render() {
        return (
                <React.Fragment>
                    <button
                    role="button"
                    type="button"
                    ref="target"
                    className="btn btn-sm btn-primary pl-2"
                    >
                        <i className="fas fa-download"></i>
                            {
                                //  # Translators: a button to download a spreadsheet
                                gettext('Import indicators')
                            }
                    </button>
                </React.Fragment>
        );
    }
}

const ImportIndicatorsPopover = (props) => {
    const { levelStore, chosenTier, tierLevels } = useContext(ImportIndicatorsContext);

    // These define the different cases/views of the Popover to switch between.
    let INITIAL = 0;
    let FEEDBACK = 1;
    let CONFIRM = 2;
    let SUCCESS = 3;
    let ERROR = 4;

    const [views, setViews] = useState(INITIAL);

    // Download template file providing the program ID and number of rows per tier level
    let handleDownload = (e) => {
        console.log("Download Clicked");
        let data = {
            program_id: levelStore.program_id,
            tierLevels: tierLevels,
        }
        api.downloadTemplate(data)
            .then(response => {
                console.log("Reponse:", response, tierLevels);
                alert(`DONWLOAD TEMPLATE, ${JSON.stringify(tierLevels)}`);
                // window.open(response); //TODO: Open template file
            })
    }
    // Upload template file and send api request
    let handleUpload = (e) => {
        let files = e.target.files;
        let reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = (e) => {
            api.uploadTemplate(e.target.result)
            .then(response => {
                console.log("Reponse:", response);
                alert("UPLOAD TEMPLATE");
                setViews(FEEDBACK);
            })
        }
    }
    // Triggers the file upload from the Upload button
    let uploadClick = () => {
        console.log("Upload Clicked");
        document.getElementById("fileUpload").click();
    }

    // Creates the default number of rows for the Tier Levels
    chosenTier.map((tier, i) => {
        tierLevels[i] = { [tier]: i < chosenTier.length - 2 ? 10 : 20 };
    });

    return (
        <React.Fragment>
            {(() => {
                switch(views) {
                    // View for downloading and uploading the template
                    case INITIAL:
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

                                <AdvancedImport />

                                <div className="import-buttons">
                                    <button
                                        role="button"
                                        type="button"
                                        className="btn btn-sm btn-primary btn-download"
                                        onClick={(e) => handleDownload(e)}
                                        >
                                        {
                                            // # Translators: Button to download a template
                                            gettext("Download template")
                                        }
                                    </button>
                                    <button
                                        role="button"
                                        type="file"
                                        className="btn btn-sm btn-primary btn-upload"
                                        onClick={() => uploadClick()}
                                    >
                                        {
                                            // # Translators: Button to upload a template
                                            gettext("Upload template")
                                        }
                                    </button>
                                    <input 
                                        id="fileUpload" 
                                        type="file" 
                                        style={{ display: "none" }} 
                                        onChange={(e) => handleUpload(e)}
                                    />
                                </div>                              
                            </div> 
                        );
                    // TODO: View to provide error feedback on their uploaded template
                    case FEEDBACK:
                        return (
                            <div>
                                <div className="temp-view">
                                    Error Feedback View
                                </div>
                                <br/>
                                <a type="submit" value="submit" href="#">Download a copy of your template with errors highlighted</a>
                                <button className="btn btn-sm btn-primary" onClick={() => setViews(CONFIRM)}>Upload</button>
                            </div>
                        )
                    // TODO: View to ask users to confirm the upload
                    case CONFIRM:
                        return (
                            <div>
                                <div className="temp-view">
                                    Confirm Import View
                                </div>
                                <br/>
                                <button className="btn btn-sm btn-primary" onClick={() => setViews(SUCCESS)}>Complete Import</button>
                            </div>
                        )
                    // TODO: View for a successful upload (May or may not be needed if using PNotify)
                    case SUCCESS:
                        return (
                            <div>
                                <div className="temp-view">
                                    Successful Import View
                                </div>
                            </div>
                        )
                    // TODO: View for when an API call fails 
                    case ERROR:
                        return (
                            <div>
                                <div className="temp-view">
                                    Error occured, Try Again.
                                </div>
                            </div>
                        )
                }
            })()}      
        </React.Fragment>
    )
}


const AdvancedImport = () => {
    const { chosenTier, tierLevels, setTierLevels } = useContext(ImportIndicatorsContext);
    let options = [0, 5, 10, 15, 20, 25];
    const [expanded, setExpanded] = useState(false);
    const [update, triggerUpdate] =  useState(false);
    
    useEffect(() => {
        triggerUpdate(false);
    },[update]);

    let advancedOptions = chosenTier.map((levelName, order ) => {
        return (
            <div key={order} className="advanced-levels"> 
                <label htmlFor={levelName} >{levelName}</label>
                <select 
                    id={levelName}
                    className="advanced-options"
                    value={ tierLevels[order][levelName] }
                    onChange={(event) => {setTierLevels(order, levelName, parseInt(event.target.value)), triggerUpdate(true)}}
                    >
                    {options.map((option) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            </div>
        )
    })

    return (
        <div>
            <div className="advanced-button">
                <FontAwesomeIcon icon={expanded ? 'caret-down' : 'caret-right'} /> &nbsp;
                <a 
                    data-toggle="collapse" 
                    href="#optionsForm" 
                    role="button" 
                    aria-expanded={expanded} 
                    aria-controls="optionsForm" 
                    onClick={() => setExpanded(!expanded)}
                    >
                        {
                            // # Translators: Click to view the Advanced Option section
                            gettext('Advanced options')
                        }
                    </a>
            </div>
            <div id="optionsForm" className="collapse">
                <p className="advanced-text">
                    {
                        // # Translators: Details explaining that by default the template will include 10 or 20 rows per result level. You can adjust the number if you need more or less rows.
                        gettext('By default, the template will include 10 or 20 indicator rows per result level. Adjust the numbers if you need more or fewer rows.')
                    }
                </p>
                {advancedOptions}
            </div>
        </div>
    )
}