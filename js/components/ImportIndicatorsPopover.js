import React, { useState, useContext, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Select from 'react-select';
import { BootstrapPopoverButton } from './helpPopover';
import api from '../apiv2';

export const ImportIndicatorsContext = React.createContext();

export class ImportIndicatorsButton extends BootstrapPopoverButton {
    // Overriding variables in the BootstrapPopoverButton
    popoverName = "importIndicators";
    popoverTitle = gettext("Import indicators");

    constructor(props) {
        super(props);
    }

    // Overriding a method in the BootstrapPopoverButton and provides the content for when the Import indicators button is clicked
    getPopoverContent = () => {
        let tierLevelsUsed = [];
        this.props.chosenTiers.map((tier, i) => {
            tierLevelsUsed[i] = {
                name: tier,
                used: false,
            }
        })
        this.props.levels.map((level) => {
            tierLevelsUsed[level.level_depth - 1].used = true;
        })
        return (
                <ImportIndicatorsPopover program_id={ this.props.program_id } tierLevelsUsed={ tierLevelsUsed } />
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

export const ImportIndicatorsPopover = ({ program_id, tierLevelsUsed }) => {

    // These define the different cases/views of the Popover to switch between.
    let INITIAL = 0;
    let FEEDBACK = 1;
    let CONFIRM = 2;
    let SUCCESS = 3;
    let ERROR = 4;
    let LOADING = 5;

    // State Variables
    const [views, setViews] = useState(INITIAL); // View of the Popover
    const [validIndicatorsCount, setvalidIndicatorsCount] = useState(0); // Number of indicators that have passed validation and are ready to import
    const [invalidIndicatorsCount, setInvalidIndicatorsCount] = useState(0); // Number of indicators that have failed validation and needs fixing
    const [tierLevelsRows, setTierLevelsRows] = useState([]); // State to hold the tier levels name and the desired number of rows for the excel template

    // Default number of rows per level is set to 10 or 20 on mount.
    useEffect(() => {
        let level = [];
        tierLevelsUsed.map((tier, i) => {
            level[i] =  { name: tier.name, rows: i < tierLevelsUsed.length - 2 ? 10 : 20 };
        })
        setTierLevelsRows(level);
    }, [])

    // Download template file providing the program ID and number of rows per tier level
    let handleDownload = () => {
        api.downloadTemplate(program_id, tierLevelsRows)
            .then(response => {
                if (response.error) {
                    setViews(ERROR);
                } 
            })
    }

    // Upload template file and send api request
    let handleUpload = (e) => {
        let loading = false;
        let loadingTimer = setTimeout(() => {
            setViews(LOADING)
            loading = true;
        }, 1000)
        let files = e.target.files;
        let reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = (e) => {
        api.uploadTemplate(e.target.result)
                .then(response => {
                    let handleResponse = () => {
                        if (!response.error) {
                            setvalidIndicatorsCount(response.valid);
                            setInvalidIndicatorsCount(response.invalid);
                            response.invalid > 0 ? setViews(FEEDBACK) : setViews(CONFIRM);
                        } else {
                            setViews(ERROR)
                        }
                    }
                    if (loading) {
                        setTimeout(() => {
                            handleResponse();
                        }, 1000)
                    } else {
                        clearTimeout(loadingTimer);
                        handleResponse();
                    }
                })
        }
    }

    // Triggers the file upload from the Upload button
    let uploadClick = () => {
        document.getElementById("fileUpload").click();
    }

    // Handle confirm and complete importing indicators
    let handleConfirm = () => {
        let loading = false;
        let loadingTimer = setTimeout(() => {
            setViews(LOADING)
            loading = true;
        }, 1000)
        api.confirmUpload()
            .then(response => {
                let handleResponse = () => {
                    if (!response.error) {
                        setViews(SUCCESS);
                    } else {
                        setViews(ERROR);
                    }
                }
                if (loading) {
                    setTimeout(() => {
                        handleResponse();
                    }, 1000)
                } else {
                    clearTimeout(loadingTimer);
                    handleResponse();
                }
            })
    }

    // Handle clicking cancel and closing the popover
    let handleClose = () => {
        $('.popover').popover('hide')
    }

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

                                    <ImportIndicatorsContext.Provider value={{ tierLevelsUsed: tierLevelsUsed, tierLevelsRows: tierLevelsRows, setTierLevelsRows: setTierLevelsRows }}>
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
                                <a 
                                    type="submit" 
                                    value="submit" 
                                    role="button"
                                    href="#">
                                        {
                                            // # Translators:
                                            gettext("Download a copy of your template with errors highlighted")
                                        }
                                </a>
                                <button 
                                    role="button"
                                    type="button"
                                    className="btn btn-sm btn-primary" 
                                    onClick={ () => setViews(CONFIRM) }>
                                        {
                                            // # Translators:
                                            gettext("Upload")
                                        }
                                </button>
                            </div>
                        )
                    // View to ask users to confirm the upload
                    case CONFIRM:
                        return (
                            <div className="import-confirm">
                                <div className="import-confirm-text">
                                    {views === CONFIRM ? <div><i className="fas fa-check-circle"/></div> : null}
                                    <div>
                                        {
                                            // # Translators: The count of indicators that have passed validation and are ready to be imported to complete the process. This cannot be undone after completing. 
                                            interpolate(ngettext(
                                                "%s indicator is ready to be imported. Are you ready to complete the import process? (This action cannot be undone.)",
                                                "%s indicators are ready to be imported. Are you ready to complete the import process? (This action cannot be undone.)", 
                                                validIndicatorsCount
                                            ), [validIndicatorsCount])
                                        }
                                    </div>
                                </div>
                                <div className="import-confirm-buttons">
                                    <button 
                                        role="button"
                                        type="button"
                                        className="btn btn-sm btn-primary" 
                                        onClick={ () => handleConfirm() }
                                    >
                                        {
                                            // # Translators: Button to confirm and complete the import process
                                            gettext("Complete import")
                                        }
                                    </button>
                                    <button 
                                        role="button"
                                        type="button"
                                        className="btn btn-sm import-confirm-buttons-cancel" 
                                        onClick={ () => handleClose() }
                                    >
                                        {
                                            // # Translators: Button to cancel the import process and close the popover
                                            gettext("Cancel")
                                        }
                                    </button>
                                </div>
                            </div>
                        )
                    // View for a successful upload (May or may not be needed if using PNotify)
                    case SUCCESS:
                        return (
                            <div className="import-success">
                                <div  className="import-success-text">
                                    {views === SUCCESS ? <div><i className="fas fa-check-circle"/></div> : null}
                                    {
                                        // # Translators: Message with the count of indicators that were successfully imported but they require additional details before they can be submitted.
                                        interpolate(ngettext(
                                            "%s indicator was successfully imported, but require additional details before results can be submitted.",
                                            "%s indicators were successfully imported, but require additional details before results can be submitted.",
                                            validIndicatorsCount
                                        ), [validIndicatorsCount])
                                        // gettext("indicators are ready to be imported. Are you ready to complete the import process? (This action cannot be undone.)")
                                    }
                                </div>
                                <a role="link" href={ api.getProgramPageUrl(program_id) }>
                                    {
                                        // # Translators: A link to the program page to add the addition setup information for the imported indicators.
                                        gettext("Visit the program page to complete setup of these indicators.")
                                    }
                                </a> 
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
                    // TODO: View for when waiting for an API calls response
                    case LOADING:
                        return (
                            <div className="import-loading" disabled>
                                <img src='/static/img/duck.gif' />&nbsp;
                                {/* <img src='/static/img/paint_spinner.gif'/>&nbsp; */}
                                {/* <img src='/static/img/ajax-loader.gif' />&nbsp; */}
                            </div>
                        );
                }
            })()}      
        </React.Fragment>
    )
}

const AdvancedImport = () => {
    const { tierLevelsRows } = useContext(ImportIndicatorsContext);

    const [expanded, setExpanded] = useState(false);

    return (
        <div className="import-advanced">
            <div className="import-advanced-button">
                <FontAwesomeIcon icon={ expanded ? 'caret-down' : 'caret-right' } /> &nbsp;
                <a 
                    className="import-advanced-button-toggle"
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
    const { tierLevelsUsed, tierLevelsRows, setTierLevelsRows } = useContext(ImportIndicatorsContext);

    let choices = [0, 5, 10, 15, 20, 25];
    let options = [];
    choices.map((choice, i) => {
        options[i] = {
            label: choice,
            value: choice,
        }
    })

    // Handles updating state when an option is selected from the dropdown.
    let handleSelect = (event) => {
        let updatedTiers = $.extend(true, [], tierLevelsRows);
        updatedTiers[i] = {
            name: level.name,
            rows: event.value
        };
        setTierLevelsRows(updatedTiers);
    }

    // Custom styling to reduce height and veritically center the dropdown
    const customStyles = {
        control: base => ({
            ...base,
            height: 30,
            minHeight: 30,
        }),
        valueContainer: base => ({
            ...base,
            height: 25,
            minHeight: 25,
        }),
        indicatorsContainer: base => ({
            ...base,
            height: 25,
            minHeight: 25,
        }),
        indicatorSeparator: base => ({
            ...base,
            height: 15,
            minHeight: 15,
            marginTop: 6,
        }),
        singleValue: base => ({
            ...base,
            paddingBottom: 2,
        })
      };

    return (
        <div key={ i } className="level-count-row"> 
            <label htmlFor={ level.name }> { level.name } </label>
            <Select 
                id={ level.name }
                className="level-count-options"
                options={options}
                value={ {value: level.rows, label: level.rows} }
                isDisabled={!tierLevelsUsed[i].used}
                onChange={ (event) => handleSelect(event) }
                styles={customStyles}
                >
            </Select>
        </div>
    )
}