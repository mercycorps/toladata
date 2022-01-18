import React, { useState, useEffect } from 'react';
import { HelpText } from '../components/HelpText.js'

const EvidenceFields = ({ evidenceFieldsInput, setEvidenceFieldsInput, formErrors, readOnly }) => {

    const [validEvidenceURL, setValidEvidenceURL] = useState(false);

    useEffect(() => {
        if(evidenceFieldsInput.evidence_url) {
            let evidenceURLHasValue = evidenceFieldsInput.evidence_url.match(/^(http(s)?|file):\/\/.+/);
            setValidEvidenceURL(evidenceURLHasValue);
        }
    }, [evidenceFieldsInput.evidence_url])

    let handleGDrive  = (e) => {
        e.preventDefault();
        gdriveFilePicker(filePickerCallback);
    }

    return (
        <fieldset className="card card-body bg-primary-light border-0">
            <h3>
                {
                    // # Translators:
                    gettext('Evidence')
                }
            </h3>
            <p>
                {
                    // # Translators:
                    gettext('Link this result to a record or folder of records that serves as evidence.')
                }
            </p>

            <div className="form-group">
                {/* <label htmlFor="id_record_url" className="label--required"> */}
                <label htmlFor="id_record_url" className="label">
                    {
                        gettext('Link to file or folder')
                    }
                </label>

                <HelpText
                    text={ gettext('Provide a link to a file or folder in Google Drive or another shared network drive. Please be aware that TolaData does not store a copy of your record, <i>so you should not link to something on your personal computer, as no one else will be able to access it.</i>')}
                />

                <div className="d-flex btn-group">
                    <input
                        type="text"
                        name="evidence_url"
                        id="id_evidence_url"
                        maxLength="255"
                        className="form-control"
                        disabled={readOnly}
                        value={evidenceFieldsInput.evidence_url || ""}
                        onChange={(e) => setEvidenceFieldsInput({...evidenceFieldsInput, [e.target.name]: e.target.value})}
                    />

                    <button
                        type="button"
                        id="id_view_evidence_button"
                        className="btn btn-sm btn-secondary evidence-view__btn"
                        disabled={!validEvidenceURL}
                        onClick={() => window.open(evidenceFieldsInput.evidence_url, '_blank')}
                    >{gettext('view')}</button>
                    <button
                        type="button"
                        id="id_browse_google_drive"
                        className="btn btn-sm btn-link text-nowrap"
                        disabled={readOnly}
                        onClick={(event) => handleGDrive(event)}
                    >
                        <i className="fas fa-external-link-alt"></i>{gettext('Browse Google Drive')}
                    </button>
                </div>
                {
                    formErrors.evidence_url &&
                        <span id="validation_id_evidence_url" className="has-error">{formErrors.evidence_url}</span>
                }

                <div className="form-group" id="div_id_record_name">
                    <label htmlFor="id_record_name">{gettext("Record name")}&nbsp;</label>

                    <HelpText
                        text={gettext('Give your record a short name that is easy to remember.')}
                    />

                    <input
                        type="text"
                        name="record_name"
                        id="id_record_name"
                        className="form-control"
                        maxLength="135"
                        disabled={readOnly}
                        value={evidenceFieldsInput.record_name || ""}
                        onChange={(e) => setEvidenceFieldsInput({...evidenceFieldsInput, [e.target.name]: e.target.value})}
                    />
                </div>

            </div>
        </fieldset>
    )
}

export { EvidenceFields };
