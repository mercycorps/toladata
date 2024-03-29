import React, {useState, useEffect } from 'react';
import { HelpText } from '../components/HelpText.js'

const EvidenceFields = ({ evidenceFieldsInput, setEvidenceFieldsInput, formErrors, setFormErrors, readOnly, setWasUpdated }) => {

    let handleValdation = () => {
        let detectedErrors = {...formErrors},
        evidenceURLValid = true,
        recordNameValid = true,
        evidenceURL = evidenceFieldsInput.evidence_url || "",
        recordName = evidenceFieldsInput.record_name || "";

        if(evidenceURL.length > 0) {
            if (!evidenceURL.match(/^(http(s)?|file):\/\/.+/)) {
                evidenceURLValid = false;
                detectedErrors = {...detectedErrors, evidence_url: gettext("Please enter a valid evidence link.")};
            } else if (!recordName.length > 0) {
                recordNameValid = false;
                detectedErrors = {...detectedErrors, record_name: gettext("A record name must be included along with the link.")};
            }
        } else if (recordName.length > 0) {
            evidenceURLValid = false;
            detectedErrors = {...detectedErrors, evidence_url: gettext("A link must be included along with the record name.")};
        }
        evidenceURLValid ? delete detectedErrors.evidence_url: null;
        recordNameValid ? delete detectedErrors.record_name: null;
        setFormErrors(detectedErrors);
    }

    // Trigger validation when a the file picker is used
    const [filePicked, setFilePicked] = useState(false);
    useEffect(() => {
        handleValdation();
    }, [filePicked])

    // File picker callback function for after file was picked
    function pcFilePickerCallback(fileName, url) {
        setEvidenceFieldsInput({...evidenceFieldsInput, evidence_url: url, record_name: fileName})
        setFilePicked(!filePicked);
    }

    let handleGDrive  = (e) => {
        e.preventDefault();
        gdriveFilePicker(pcFilePickerCallback);
    }

    return (
        <fieldset className="card card-body bg-primary-light border-0">
            <h3>{gettext('Evidence')}</h3>
            <p>{gettext('Link this result to a record or folder of records that serves as evidence.')}</p>
            <div className="form-group">
                <label htmlFor="id_evidence_url--pc" className="label">{gettext('Link to file or folder')}</label>

                <HelpText
                    text={ gettext('Provide a link to a file or folder in Google Drive or another shared network drive. Please be aware that TolaData does not store a copy of your record, <i>so you should not link to something on your personal computer, as no one else will be able to access it.</i>')}
                />

                <div className="d-flex btn-group">
                    <input
                        type="text"
                        name="evidence_url--pc"
                        id="id_evidence_url--pc"
                        maxLength="255"
                        className="form-control"
                        disabled={readOnly}
                        value={evidenceFieldsInput.evidence_url || ""}
                        onChange={(e) => {
                            setWasUpdated(true)
                            setEvidenceFieldsInput({...evidenceFieldsInput, evidence_url: e.target.value})
                        }}
                        onBlur={() => handleValdation()}
                    />

                    <button
                        type="button"
                        id="id_view_evidence_button--pc"
                        className="btn btn-sm btn-secondary evidence-view__btn"
                        disabled={evidenceFieldsInput.evidence_url === "" || evidenceFieldsInput.evidence_url === undefined || formErrors.evidence_url !== undefined ? true : false}
                        onClick={() => window.open(evidenceFieldsInput.evidence_url, '_blank')}
                    >{gettext('view')}</button>
                    <button
                        type="button"
                        id="id_browse_google_drive--pc"
                        className="btn btn-sm btn-link text-nowrap"
                        disabled={readOnly}
                        onClick={(event) => handleGDrive(event)}
                    >
                        <i className="fas fa-external-link-alt"></i>{gettext('Browse Google Drive')}
                    </button>
                </div>
                {
                    formErrors.evidence_url &&
                        <span id="validation_id_evidence_url--pc" className="has-error">{formErrors.evidence_url}</span>
                }

                <div className="form-group" id="div_id_record_name--pc">
                    <label htmlFor="id_record_name--pc">{gettext("Record name")}&nbsp;</label>

                    <HelpText
                        text={gettext('Give your record a short name that is easy to remember.')}
                    />

                    <input
                        type="text"
                        name="record_name--pc"
                        id="id_record_name--pc"
                        className="form-control"
                        maxLength="135"
                        disabled={readOnly}
                        value={evidenceFieldsInput.record_name || ""}
                        onChange={(e) => {
                            setWasUpdated(true)
                            setEvidenceFieldsInput({...evidenceFieldsInput, record_name: e.target.value})
                        }}
                        onBlur={() => handleValdation()}
                    />
                    {
                        formErrors.record_name &&
                            <span id="validation_id_record_name--pc" className="has-error">{formErrors.record_name}</span>
                    }
                </div>

            </div>
        </fieldset>
    )
}

export { EvidenceFields };
