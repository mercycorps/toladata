import React, { useState, useContext, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BootstrapPopoverButton } from './helpPopover';
import api from '../apiv2';

export const ImportIndicatorsContext = React.createContext();

export class ImportIndicatorsButton extends BootstrapPopoverButton {
    // Overriding variables in the BootstrapPopoverButton
    popoverName = "importIndicators";
    popoverTitle = "Import indicators";

    constructor(props) {
        super(props);
    }

    // Overriding a method in the BootstrapPopoverButton and provides the content for when the Import indicators button is clicked
    getPopoverContent = () => {
        let program_id = this.props.levelStore.program_id; 
        let chosenTiers = [...this.props.levelStore.tierTemplates[this.props.levelStore.chosenTierSetKey].tiers];
        return (
                <ImportIndicatorsPopover program_id={ program_id } chosenTiers={ chosenTiers } />
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

export const ImportIndicatorsPopover = ({ program_id, chosenTiers }) => {

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
        chosenTiers.map((level, i) => {
            row[i] =  { [level]: i < chosenTiers.length - 2 ? 10 : 20 };
        })
        setTierLevelsRows(row);
    }, [])

    // Download template file providing the program ID and number of rows per tier level
    let handleDownload = () => {
        api.downloadTemplate(program_id, tierLevelsRows)
            .then(response => {
                if (response = Error) {
                    setViews(ERROR);
                } 
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

    const [indicatorCount, setIndicatorCount] = useState(11);

    return (
        <React.Fragment>
            {(() => {
                switch(views) {
                    // View for downloading and uploading the template
                    case INITIAL:
                        return (
                            <div className="import-initial">
                                <div className="import-initial-text">
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

                                <div className="import-initial-buttons">
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
                            <div className="import-confirm">
                                <div className="import-confirm-text">
                                    {/* <i className="fas fa-check-circle"/> */}
                                    <div>
                                        {/* <span>{indicatorCount}</span>&nbsp; */}
                                        {
                                            // # Translators: 
                                            interpolate(ngettext(
                                                "%s indicator is ready to be imported. Are you ready to complete the import process? (This action cannot be undone.)",
                                                "%s indicators are ready to be imported. Are you ready to complete the import process? (This action cannot be undone.)", 
                                                indicatorCount
                                            ), [indicatorCount])
                                            // gettext("indicators are ready to be imported. Are you ready to complete the import process? (This action cannot be undone.)")
                                        }
                                    </div>
                                </div>
                                <div className="import-confirm-buttons">
                                    <button className="btn btn-sm btn-primary" onClick={ () => setViews(SUCCESS) }>Complete Import</button>
                                    <button className="btn btn-sm" onClick={ () => setViews(INITIAL) }>Cancel</button>
                                </div>
                            </div>
                        )
                    // TODO: View for a successful upload (May or may not be needed if using PNotify)
                    case SUCCESS:
                        return (
                            <div className="import-success">
                                    {/* <span>{indicatorCount}</span>&nbsp; */}
                                <div  className="import-success-text">
                                    {
                                        // # Translators: 
                                        interpolate(ngettext(
                                            "%s indicator is ready to be imported. Are you ready to complete the import process? (This action cannot be undone.)",
                                            "%s indicators are ready to be imported. Are you ready to complete the import process? (This action cannot be undone.)", 
                                            indicatorCount
                                        ), [indicatorCount])
                                        // gettext("indicators are ready to be imported. Are you ready to complete the import process? (This action cannot be undone.)")
                                    }
                                    <a href={ api.getProgramPageUrl(program_id)}>
                                        {
                                            // # Translators:
                                            gettext("Visit the program page to complete setup of these indicators.")
                                        }
                                    </a> 
                                </div>
                            </div>
                        )
                    // TODO: View for when an API call fails 
                    case ERROR:
                        return (
                            <div className="import-error">
                                <p className="text-secondary px-1 my-auto">
                                    {   
                                        // # Translators: Notification for a error that happend on the web server.
                                        gettext('There was a server-related problem')
                                    }    
                                </p>
                                <button className="btn btn-sm btn-primary" onClick={() => setViews(INITIAL) }>Try again</button>
                            </div>
                        )
                }
            })()}      
        </React.Fragment>
    )
}

const AdvancedImport = () => {
    const { tierLevelsRows } = useContext(ImportIndicatorsContext);

    const [expanded, setExpanded] = useState(false);

    return (
        <div>
            <div className="import-advanced-button">
                <FontAwesomeIcon icon={ expanded ? 'caret-down' : 'caret-right' } /> &nbsp;
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
                <p className="import-advanced-text">
                    {
                        // # Translators: Details explaining that by default the template will include 10 or 20 rows per result level. You can adjust the number if you need more or less rows.
                        gettext('By default, the template will include 10 or 20 indicator rows per result level. Adjust the numbers if you need more or fewer rows.')
                    }
                </p>
                {tierLevelsRows.map((level, i) => <LevelIndicatorCount key={i} level={level} i={i} />)}
            </div>
        </div>
    )
}

const LevelIndicatorCount = ({ level, i }) => {
    const { tierLevelsRows, setTierLevelsRows } = useContext(ImportIndicatorsContext);

    let options = [0, 5, 10, 15, 20, 25];
    let levelName = Object.keys(level)[0];
    let levelValue = tierLevelsRows[i][levelName];

    let handleSelect = (event) => {
        let updatedTiers = [...tierLevelsRows];
            updatedTiers[i] = {[levelName]: parseInt(event.target.value)}
        setTierLevelsRows(updatedTiers);
    }

    return (
        <div key={ i } className="level-count-row"> 
            <label htmlFor={ levelName }> { levelName } </label>
            <select 
                id={ levelName }
                className="level-count-options"
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