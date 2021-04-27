import React, { useState, useContext, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BootstrapPopoverButton } from './helpPopover';
import api from '../apiv2';

export const ImportIndicatorsContext = React.createContext();

export class ImportIndicatorsButton extends BootstrapPopoverButton {
    // Overwritting variables in the BootstrapPopoverButton
    popoverName = "importIndicators";
    popoverTitle = "Import indicators";

    constructor(props) {
        super(props);
    }

    // Overwritting a method in the BootstrapPopoverButton and provides the content for when the Import indicators button is clicked
    getPopoverContent = () => {
        let program_id = this.props.levelStore.program_id; 
        let chosenTier = [...this.props.levelStore.tierTemplates[this.props.levelStore.chosenTierSetKey].tiers];
        return (
                <ImportIndicatorsPopover program_id={ program_id } chosenTier={ chosenTier } />
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
                                //  # Translators: a button to open the import indicators popover
                                gettext('Import indicators')
                            }
                    </button>
                </React.Fragment>
        );
    }
}

export const ImportIndicatorsPopover = ({ program_id, chosenTier }) => {

    // These define the different cases/views of the Popover to switch between.
    let INITIAL = 0;
    let FEEDBACK = 1;
    let CONFIRM = 2;
    let SUCCESS = 3;
    let ERROR = 4;
    const [views, setViews] = useState(INITIAL);

    // State to hold the tier levels name and the desired number of rows for the excel template. Default values of 10 or 20 is set on mount.
    const [tierLevelsRows, setTierLevelsRows] = useState([]); 
    useEffect(() => {
        let row = [];
        chosenTier.map((level, i) => {
            row[i] =  { [level]: i < chosenTier.length - 2 ? 10 : 20 };
        })
        setTierLevelsRows(row);
    }, [])

    // Download template file providing the program ID and number of rows per tier level
    let handleDownload = () => {
        console.log("Download Clicked", program_id);
        let data = {
            program_id: program_id,
            tierLevelsRows: tierLevelsRows,
        }
        api.downloadTemplate(data)
            .then(response => {
                console.log("Reponse:", response, tierLevelsRows);
                alert(`DONWLOAD TEMPLATE, ${JSON.stringify(tierLevelsRows)}`);
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
                                                // # Translators: Instructions for users to upload their filled in template and then follow the instructions to complete the import process.
                                                gettext("Upload the template and follow instructions to complete the process.")
                                            }
                                        </li>
                                    </ol>
                                </div>

                                    <ImportIndicatorsContext.Provider value={ { tierLevelsRows: tierLevelsRows, setTierLevelsRows: setTierLevelsRows }}>
                                        <AdvancedImport />
                                    </ImportIndicatorsContext.Provider>    

                                <div className="import-buttons">
                                    <button
                                        role="button"
                                        type="button"
                                        className="btn btn-sm btn-primary btn-download"
                                        onClick={ () => handleDownload() }
                                        >
                                        {
                                            // # Translators: Button to download a template
                                            gettext("Download template")
                                        }
                                    </button>
                                    <button
                                        role="button"
                                        type="button"
                                        className="btn btn-sm btn-primary btn-upload"
                                        onClick={ () => uploadClick() }
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
                                        onChange={ (e) => handleUpload(e) }
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
                                <button className="btn btn-sm btn-primary" onClick={ () => setViews(CONFIRM) }>Upload</button>
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
                                <button className="btn btn-sm btn-primary" onClick={ () => setViews(SUCCESS) }>Complete Import</button>
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
    const {tierLevelsRows } = useContext(ImportIndicatorsContext);

    const [expanded, setExpanded] = useState(false);

    return (
        <div>
            <div className="advanced-button">
                <FontAwesomeIcon icon={expanded ? 'caret-down' : 'caret-right'} /> &nbsp;
                <a 
                    data-toggle="collapse" 
                    href="#optionsForm" 
                    role="button" 
                    aria-expanded={ expanded } 
                    aria-controls="optionsForm" 
                    onClick={ () => setExpanded(!expanded) }
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
                {tierLevelsRows.map((level, i) => <AdvancedOptions key={i} level={level} i={i} />)}
            </div>
        </div>
    )
}

const AdvancedOptions = ({ level, i }) => {
    const {tierLevelsRows, setTierLevelsRows } = useContext(ImportIndicatorsContext);

    let options = [0, 5, 10, 15, 20, 25];
    let levelName = Object.keys(level)[0];
    const [levelValue, setLevelValue] = useState(Object.values(level)[0]);

    let handleSelect = (event) => {
        setLevelValue(parseInt(event.target.value));
        let updatedTiers = [...tierLevelsRows];
            updatedTiers[i][levelName] = parseInt(event.target.value);
        setTierLevelsRows(updatedTiers);
    }

    return (
        <div key={ i } className="advanced-levels"> 
            <label htmlFor={ levelName }> { levelName } </label>
            <select 
                id={ levelName }
                className="advanced-options"
                value={ levelValue }
                onChange={ (event) => { handleSelect(event) }}
                >
                {options.map((option) => (
                    <option key={ option } value={ option }> { option } </option>
                ))}
            </select>
        </div>
    )
}