import React, { useState, useContext, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Select from 'react-select';
import api from '../apiv2';

export const ImportIndicatorsContext = React.createContext();

// **********************************************
// ***** Import Indicators Button Component *****
// **********************************************
export class ImportIndicatorsButton extends React.Component {
    popoverName = "importIndicators";
    popoverTitle = gettext("Import indicators");

    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.state = {
            inactiveTimer: null,
            tierLevelsUsed: [],
            storedView: {view: 0}, // Store the current popover view, valid, and/or invalid rows to reopen where left off if closed
            storedTierLevelsRows: [], // Store the popover's desired tier level row counts to reopen where left off if closed
        }
    }

    componentDidMount = () => {
        // make a cancelable (class method) function so clicking out of the popover will close it:
        this.bodyClickHandler = (ev) => {
            if ($(`#${this.popoverName}_popover_content`).parent().find($(ev.target)).length == 0) {
                $(this.myRef.current).popover('hide');
            }
        }
        const popoverOpenHandler = () => {
            // first make it so any click outside of the popover will hide it:
            $('body').on('click', this.bodyClickHandler);
            // update position (it's had content loaded):
            $(this.myRef.current).popover('update')
                //when it hides destroy the body clickhandler:
                .on('hide.bs.popover', () => {$('body').off('click', this.bodyClickHandler);});
        };
        const shownFn = (ev) => {
            ReactDOM.render(
                this.getPopoverContent(),
                document.querySelector(`#${this.popoverName}_popover_content`),
                popoverOpenHandler
            );
            $(`#${this.popoverName}_popover_content`).parent().parent().addClass('indicator-import__popover');
        };
        $(this.myRef.current).popover({
            content: `<div id="${this.popoverName}_popover_content"></div>`,
            title: this.popoverTitle ? `<div>${this.popoverTitle}</div>` : "",
            html: true,
            placement: 'bottom',
            boundary: 'viewport',
        }).on('shown.bs.popover', shownFn);

        // Handling Incactive Time Outs
        // Clear stored views and tier level rows counts states if time runs out
        $(this.myRef.current).on('hide.bs.popover', () => {
            this.setState({
                inactiveTimer: setTimeout(() => {
                    this.setState({
                        storedView: {view: 0},
                        storedTierLevelsRows: [],
                    })
                }, 60000)
            })
        })

        // Clear inactive timer if popover is re-opened before time runs out
        $(this.myRef.current).on('show.bs.popover', () => {
            clearTimeout(this.state.inactiveTimer);
        })
    }

    // Method to store the current popover view and valid/invalid row counts if available
    setStoredView = (currentView) => {
        this.setState({
            storedView: currentView.view !== 3 ? currentView : {view: 0}
        })
    }
    // Method to store the selected desired number of tier level rows
    setStoredTierLevelsRows = (updatedTierLevelsRow) => {
        this.setState({
            storedTierLevelsRows: updatedTierLevelsRow
        })
    }
    componentDidUpdate(prevProps, ) {
        // If the user changes the RF template(tier levels), empty the stored states
        if (this.props.levelTiers !== prevProps.levelTiers) {
            this.setState({
                storedView: {view: 0},
                storedTierLevelsRows: [],
            })
        }
    }

    // Provides the content for when the Import indicators button is clicked
    getPopoverContent = () => {

        // Determine what tier levels have been created/used in the Results Framework
        let tierLevelsUsed = [];
        this.props.levelTiers.map((tier, i) => {
            tierLevelsUsed[i] = {
                name: tier.name,
                used: false,
            }
        })
        this.props.levels.map((level) => {
            tierLevelsUsed[level.level_depth - 1].used = true;
        })

        return (
            <ImportIndicatorsPopover 
                page={ this.props.page }
                program_id={ this.props.program_id }
                tierLevelsUsed={ tierLevelsUsed }
                storedView={ this.state.storedView }
                setStoredView={ this.setStoredView }
                storedTierLevelsRows={ this.state.storedTierLevelsRows }
                setStoredTierLevelsRows={ this.setStoredTierLevelsRows }
            />
        );
    }

    render() {
        return (
                <React.Fragment>
                    <button
                    id="importButton"
                    role="button"
                    type="button"
                    ref={this.myRef}
                    className={"btn btn-sm pl-2 " + (this.props.page === "resultsFramework" ? "btn-primary" : "btn-add")}
                    >
                        <i className="fas fa-upload mr-2"></i>
                            {
                                //  # Translators: a button to open the import indicators popover
                                gettext('Import indicators')
                            }
                    </button>
                </React.Fragment>
        );
    }
}

// ***************************************
// ***** Import Indicators Component *****
// ***************************************
export const ImportIndicatorsPopover = ({ page, program_id, tierLevelsUsed, storedTierLevelsRows, setStoredTierLevelsRows, storedView, setStoredView }) => {
    // These define the different cases/views of the Popover to switch between.
    let INITIAL = 0;
    let FEEDBACK = 1;
    let CONFIRM = 2;
    let SUCCESS = 3;
    let ERROR = 4;
    let LOADING = 5;

    // State Variables
    const [views, setViews] = useState(INITIAL); // View of the Popover
    const [prevView, setPrevView] = useState({view: 0, valid: 0, invalid: 0}); // Last view/values of the Popover to return to if theres an error
    const [validIndicatorsCount, setvalidIndicatorsCount] = useState(0); // Number of indicators that have passed validation and are ready to import
    const [invalidIndicatorsCount, setInvalidIndicatorsCount] = useState(0); // Number of indicators that have failed validation and needs fixing
    const [tierLevelsRows, setTierLevelsRows] = useState([]); // State to hold the tier levels name and the desired number of rows for the excel template
    const [displayError, setDisplayError] = useState({view: null, error: []}); // ie {view: INITIAL, error: []}
    const [downloadOrUpload, setDownloadOrUpload] = useState(null); // TODO: used for handling mulitple downloaders/uploaders

    let defaultTierLevelRows = [];
    useEffect(() => {
        // When popover opens (after closing for a short period) if there are stored views, valid, and invalid values, make them appear to continue from where the user left off
        storedView.view !== 0 ? setViews(storedView.view) : null;
        storedView.valid ? setvalidIndicatorsCount(storedView.valid) : null;
        storedView.invalid ? setInvalidIndicatorsCount(storedView.invalid) : null;

        tierLevelsUsed.map((tier, i) => {
            // Default number of rows per level is set to 10 or 20 on mount.
            defaultTierLevelRows[i] =  { name: tier.name, rows: i < tierLevelsUsed.length - 2 ? 10 : 20 };
        })

        // Use stored tier levels rows count if it was selected previously before closing and is still available/active
        if (storedTierLevelsRows.length > 0 && JSON.stringify(storedTierLevelsRows) !== JSON.stringify(defaultTierLevelRows)) {
            setTierLevelsRows(storedTierLevelsRows);
            $('#optionsForm').collapse('show') // Open Advanced option collapsible because the row count is different than the default row count
        } else {
            setTierLevelsRows(defaultTierLevelRows);
        }
    }, [])

    // Store the tier level row count when selections are made
    useEffect(() => {
        setStoredTierLevelsRows(tierLevelsRows);
    }, [tierLevelsRows])

    // Reduce the array of errors to remove duplicate messaging
    let reduceErrorCodes = (codes) => {
        let reducer = (accumulator, code) => {
            errorCodes[code] && accumulator.indexOf(errorCodes[code].message) === -1 && accumulator.push(errorCodes[code].message);
            return accumulator;
        };
        return codes.reduce(reducer, []);
    };

    // Handles view changes
    let viewChange = (before, after, valid = 0, invalid = 0) => {
        setPrevView({view: before, valid: valid, invalid: invalid}); // Store last view/values if needing to go back a step
        setStoredView({view: after, valid: valid, invalid: invalid}); // Store view/values if popover is closed
        setViews(after); // Switch view to the next step
    };

    // Download template file providing the program ID and number of rows per tier level
    let handleDownload = () => {
        setDownloadOrUpload("download"); // TODO: Multi downloaders
        api.downloadTemplate(program_id, tierLevelsRows)
            .then(response => {
                if (response.status === 404) {
                    viewChange(INITIAL, ERROR);
                } else {
                    if (response.status !== 200) {
                        if (response.data.error_codes && response.data.error_codes.toString().slice(0, 1) === "1" ) {
                            let errorsMessagesToDisplay = reduceErrorCodes(response.data.error_codes);
                            setDisplayError({view: INITIAL, error: errorsMessagesToDisplay});
                        } else {
                            viewChange(INITIAL, ERROR);
                        }
                    }
                }
            })
    }

    // Upload template file and send api request
    let handleUpload = (e) => {
        setDownloadOrUpload("upload") // TODO: Multi uploaders
        let loading = false;
        let stopLoading;
        let loadingTimer = setTimeout(() => {
            setViews(LOADING);
            loading = true;
            stopLoading = setTimeout(() => { // Prevents the forever spinner situation
                setViews(INITIAL);
            }, 60000);
        }, 1000);

        api.uploadTemplate(program_id, e.target.files[0])
                .then(response => {
                    let handleResponse = () => {
                        if (response.status === 404) {
                            viewChange(INITIAL, ERROR);
                        } else {
                            // Used ternary operator to prevent failue for a invalid upload file 500 error.
                            let validCount = response.data ? response.data.valid : 0;
                            let invalidCount = response.data ? response.data.invalid : 0;
                            setvalidIndicatorsCount(validCount);
                            setInvalidIndicatorsCount(invalidCount);
                            // Successful upload with no errors and all rows valid
                            if (response.status === 200) { 
                                viewChange(INITIAL, CONFIRM, validCount);
                            // Unsuccessful upload with fatal errors
                            } else if ( response.status === 406 ) {
                                let errorsMessagesToDisplay = reduceErrorCodes(response.data.error_codes)
                                if (errorsMessagesToDisplay.length > 0) {
                                    setDisplayError({view: INITIAL, error: errorsMessagesToDisplay});
                                    viewChange(INITIAL, INITIAL);
                                } else {
                                    viewChange(INITIAL, ERROR);
                                }
                            // Unsuccessful upload with errors and/or invalid rows
                            } else if (response.status.toString().slice(0, 1) === "4") {
                                viewChange(INITIAL, FEEDBACK, validCount, invalidCount);
                            // Handles any other error/problem
                            } else {
                                viewChange(INITIAL, ERROR, validCount, invalidCount);
                            }
                        }
                    }
                    if (loading) {
                        setTimeout(() => {
                            handleResponse();
                            clearTimeout(stopLoading);
                        }, 1000)
                    } else {
                        handleResponse();
                        clearTimeout(loadingTimer);
                    }
                })
    }

    // Triggers the file upload from the Upload button
    let uploadClick = () => {
        document.getElementById("fileUpload").click();
    }

    // Handle download the error feedback file
    let handleFeedback = () => {
        api.downloadFeedback(program_id)
        .then(response => {
            if (response.status !== 200) {
                viewChange(FEEDBACK, ERROR, validIndicatorsCount, invalidIndicatorsCount);
            }
        })
    }

    // Handle confirm and complete importing indicators
    let handleConfirm = () => {
        let loading = false;
        let stopLoading;
        let loadingTimer = setTimeout(() => {
            setViews(LOADING);
            loading = true;
            stopLoading = setTimeout(() => { // Prevents the forever spinner situation
                setViews(CONFIRM);
            }, 60000);
        }, 1000)
        api.confirmUpload(program_id)
            .then(response => {
                let handleResponse = () => {
                    if (response.status === 404) {
                        viewChange(CONFIRM, ERROR, validIndicatorsCount)
                    } else {
                        if (response.status === 200) {
                            viewChange(CONFIRM, SUCCESS, validIndicatorsCount);
                        } else {
                            let errorsMessagesToDisplay = reduceErrorCodes(response.data.error_codes);
                            setDisplayError({view: CONFIRM, error: errorsMessagesToDisplay});
                            viewChange(CONFIRM, CONFIRM, validIndicatorsCount);
                        }
                    }
                }
                if (loading) {
                    setTimeout(() => {
                        handleResponse();
                        clearTimeout(stopLoading);
                    }, 1000)
                } else {
                    clearTimeout(loadingTimer);
                    handleResponse();
                }
            })
    }

    // Handle clicking cancel and closing the popover
    let handleClose = () => {
        $('.popover').popover('hide');
        setStoredView({view: 0});
        setStoredTierLevelsRows([]);
    }

    // TODO/IN-WORK: Handle Continue when there are multiple downloaders or uploaders
    let handleContinue = () => {
        if (downloadOrUpload === "download") {
            handleDownload();
        } else {
            // TODO: Update for when the users clicks to continue to upload when theres multiple uploaders
            console.log("Continue Upload");
            // handleUpload();
        }
    }

    // TODO/IN-WORK: Need to determine how to handle continue button for downloading and uploading. Structure and Styles are in place.
    let multipleUploadWarning =
        <div className="import-initial-text">
            <div className="import-initial-text-error">
                <span>
                    {errorMessages[errorCodes[106].message]}&nbsp;
                    <a
                        className="import-initial-text-error-link"
                        role="link"
                        href={ `/tola_management/audit_log/${program_id}/` }
                        target="_blank"
                    >
                        {
                            // # Translators: Link to the program change log to view more details.
                            gettext("View the program change log for more details.")
                        }
                    </a>
                </span>
            </div>
            <div className="import-initial-text-error-confirm">
                {
                    // # Translators: Confirrm the user wants to continue.
                    gettext("Are you sure you want to continue?")
                }
            </div>
            <div className="import-initial-text-error-buttons">
                <button
                    role="button"
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={ () => handleContinue() }
                >
                    {
                        // # Translators: Button to continue and upload the template
                        gettext("Continue")
                    }
                </button>
                <button
                    role="button"
                    type="button"
                    className="btn btn-sm"
                    onClick={ () => handleClose() }
                >
                    {
                        // # Translators: Button to cancel the import process and close the popover
                        gettext("Cancel")
                    }
                </button>
            </div>
        </div>

    return (
        <React.Fragment>
            {(() => {
                switch(views) {
                    // ***** View for downloading and uploading the template *****
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
                                    {displayError.view === INITIAL && displayError.error.indexOf(5) === -1 &&
                                        displayError.error.map(message_id => {
                                            return (
                                                <div key={message_id} className="import-initial-text-error">
                                                    { errorMessages[message_id] }
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                {/* TODO: Update to handle multiply downloaders/uploaders scenarios */}
                                {displayError.error.indexOf(5) >= 0 ?
                                    multipleUploadWarning
                                :
                                <React.Fragment>
                                    <ImportIndicatorsContext.Provider
                                        value={{
                                            tierLevelsUsed: tierLevelsUsed,
                                            tierLevelsRows: tierLevelsRows,
                                            setTierLevelsRows: setTierLevelsRows,
                                        }}>
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
                                                // # Translators: Button to upload the import indicators template
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
                                </React.Fragment>
                                }
                            </div>
                        );
                    // ***** View to provide error feedback on their uploaded template *****
                    case FEEDBACK:
                        return (
                            <div className="import-feedback">
                                <div className="import-feedback-valid">
                                    {views === FEEDBACK ? <div><i className="fas fa-check-circle"/></div> : null}
                                    {
                                        // # Translators: The count of indicators that have passed validation and are ready to be imported to complete the process. This cannot be undone after completing.
                                        interpolate(ngettext("%s indicator is ready to be imported.",
                                            "%s indicators are ready to be imported.",
                                            validIndicatorsCount
                                        ), [validIndicatorsCount])
                                    }
                                </div>
                                <div className="import-feedback-invalid">
                                    {views === FEEDBACK ? <div><i className="fas fa-exclamation-triangle"/></div> : null}
                                    {
                                        // # Translators: The count of indicators that have passed validation and are ready to be imported to complete the process. This cannot be undone after completing.
                                        interpolate(ngettext("%s indicator has missing or invalid information.",
                                            "%s indicators have missing or invalid information.",
                                            invalidIndicatorsCount
                                        ), [invalidIndicatorsCount])
                                    }
                                </div>
                                <div className="import-feedback-download">
                                    <span
                                        role="button"
                                        onClick={ () => handleFeedback() }
                                    >

                                            {
                                                // # Translators: Download an excel template with errors that need fixing highlighted
                                                gettext("Download a copy of your template with errors highlighted")
                                            }
                                    </span>
                                    {
                                        // # Translators: Fix the errors from the feedback file and upload the excel template again.
                                        gettext(", fix the errors, and upload again.")
                                    }
                                </div>
                            </div>
                        )
                    // ***** View to ask users to confirm the upload *****
                    case CONFIRM:
                        return (
                            <div className="import-confirm">
                                <div className="import-confirm-text">
                                    {displayError.view === CONFIRM ?
                                        <div>
                                            {
                                            // displayError.error.indexOf(5) === -1 && // TODO: Display error 5 is the error message for the mulitple uploaders scenario. Will update when working on that scenario
                                                displayError.error.map(message_id => {
                                                    return (
                                                        <div key={message_id} className="import-confirm-text-error">
                                                            { errorMessages[message_id] }
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                        :
                                        <React.Fragment>
                                            <React.Fragment>
                                                {views === CONFIRM ? <div><i className="fas fa-check-circle"/></div> : null}
                                            </React.Fragment>
                                            <div>
                                                {
                                                    // # Translators: The count of indicators that have passed validation and are ready to be imported to complete the process. This cannot be undone after completing.
                                                    interpolate(ngettext("%s indicator is ready to be imported. Are you ready to complete the import process? (This action cannot be undone.)",
                                                        "%s indicators are ready to be imported. Are you ready to complete the import process? (This action cannot be undone.)",
                                                        validIndicatorsCount
                                                    ), [validIndicatorsCount])
                                                }
                                            </div>
                                        </React.Fragment>
                                    }
                                </div>
                                <div className="import-confirm-buttons">
                                {displayError.view !== CONFIRM ?
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
                                    :
                                    <React.Fragment>
                                        <button
                                            role="button"
                                            type="button"
                                            className="btn btn-sm btn-primary"
                                            onClick={ () => uploadClick() }
                                        >
                                            {
                                                // # Translators: Button to confirm and complete the import process
                                                gettext("Upload Template")
                                            }
                                        </button>
                                        <input
                                            id="fileUpload"
                                            type="file"
                                            style={{ display: "none" }}
                                            onChange={ (e) => {
                                                handleUpload(e);
                                                setDisplayError({view: null, error: []});
                                            }}
                                        />
                                    </React.Fragment>

                                    }
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
                    // ***** View for a successful upload *****
                    case SUCCESS:
                        return (
                            <div className="import-success">
                                <div  className="import-success-text">
                                    <React.Fragment>
                                        {views === SUCCESS ? <div><i className="fas fa-check-circle"/></div> : null}
                                    </React.Fragment>
                                    {
                                        // # Translators: Message with the count of indicators that were successfully imported but they require additional details before they can be submitted.
                                        interpolate(ngettext("%s indicator was successfully imported, but require additional details before results can be submitted.",
                                            "%s indicators were successfully imported, but require additional details before results can be submitted.",
                                            validIndicatorsCount
                                        ), [validIndicatorsCount])
                                    }
                                </div>
                                { page === "resultsFramework" &&
                                    <a role="link" href={ api.getProgramPageUrl(program_id) }>
                                        {
                                            // # Translators: A link to the program page to add the addition setup information for the imported indicators.
                                            gettext("Visit the program page to complete setup of these indicators.")
                                        }
                                    </a>
                                }
                            </div>
                        )
                    // TODO: ***** View for when an API call fails *****
                    case ERROR:
                        return (
                            <div className="import-error">
                                <div className="import-error__text">
                                    <React.Fragment>
                                        {views === ERROR ? <div><i className="fas fa-exclamation-triangle server-error"/></div> : null}
                                    </React.Fragment>
                                    <p className="text-secondary px-1 my-auto">
                                        {
                                            // # Translators: Notification for a error that happend on the web server.
                                            gettext('There was a server-related problem.')
                                        }
                                    </p>
                                </div>
                                <button 
                                    className="btn btn-sm btn-primary" 
                                    onClick={() => viewChange(ERROR, prevView.view, prevView.valid, prevView.invalid)}
                                >
                                    {
                                        // # Translators: A button to try import over after a error occurred.
                                        gettext('Try again')
                                    }
                                </button>
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
// *************************************
// ***** Advanced Import Component *****
// *************************************
const AdvancedImport = () => {
    const { tierLevelsRows } = useContext(ImportIndicatorsContext);

    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        $('#optionsForm').on('show.bs.collapse', function() {
            setExpanded(true)
        })
        $('#optionsForm').on('hide.bs.collapse', function() {
            setExpanded(false)
        })
    }, [])

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

// **************************************
// ***** LeveL Indicator Count Rows *****
// **************************************
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
            rows: event.value,
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
            <label htmlFor={ level.name }> { gettext(level.name) } </label>
            <Select
                id={ level.name }
                className="level-count-options"
                options={options}
                defaultValue={ {value: level.rows, label: level.rows} }
                isDisabled={!tierLevelsUsed[i].used}
                onChange={ (event) => handleSelect(event) }
                styles={customStyles}
                >
            </Select>
        </div>
    )
}
// *******************************
// ***** Error Code Messages *****
// *******************************
// TODO: Add/Update error codes
let errorCodes = {
    100 : {
        type: "Program doesn't match",
        message: 1,
    },
    101 : {
        type: "No new indicators",
        message: 2,
    },
    102 : {
        type: "Undertermined Level",
        message: 1,
    },
    103 : {
        type: "Template not found",
        message: 3,
    },
    104 : {
        type: "Mismatch tiers",
        message: 1,
    },
    105 : {
        type: "Indicator data not found",
        message: 4,
    },
    106 : {
        type: "Mismatch level count",
        message: 1,
    },
    107 : {
        type: "Mismatch headers",
        message: 1,
    },
    108 : {
        type: "Save validation error",
        message: 4,
    },
    109 : {
        type: "Invalid level header",
        message: 1,
    },
    110 : {
        type: "Multiple feedback templates found",
        message: 4,
    },
    111 : {
        type: "Invalid level column value",
        message: 1,
    },
    112 : {
        type: "Autonumbered program has indicator numbers that are out of their expected sequence",
        message: 1,
    },
    120 : {
        type: "Someone else uploaded a template in the last 24 hours",
        message: 5,
    },
}

let errorMessages = {
    1 :
        // # Translators: Message to user that we cannot import the their file. This could be caused by the wrong file being selected, or the structure of the file was changed, or the results framework was updated and does not match the template anymore.
        gettext("We can’t import indicators from this file. This can happen if the wrong file is selected, the template structure is modified, or the results framework was updated and no longer matches the template."),
    2 :
        // # Translators: Messsage to user that there aren't any new indicators in the uploaded file.
        gettext("We can't find any indicators in this file."),
    3 :
        // # Translators: Message to user that the import indicator process could not be completed. If the problem continues, contact your TolaData administrator.
        gettext("Sorry, we couldn’t complete the import process. If the problem persists, please contact your TolaData administrator."),
    4 :
        // # Translators: Message to user that the import could not be completed and to find out the reason, upload the import template again.
        gettext("Sorry, we couldn’t complete the import process. To figure out what went wrong, please upload your template again."),
    5 :
        // # Translators: Message to user that someone else has uploaded a template in the last 24 hours and may be in the process of importing indicators to this program. You can view the program change log to see more details.
        gettext("Someone else uploaded a template in the last 24 hours, and may be in the process of adding indicators to this program."),
}
