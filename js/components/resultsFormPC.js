import React, { useState, useEffect } from 'react';
import CheckboxedMultiSelect from 'components/checkboxed-multi-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { api } from '../apiv2';


const PCResultsForm = ({programID, indicatorID, disaggregations, reportingPeriodStart, reportingPeriodEnd}) => {

    let outcomeThemesData = [
        {value: 1, label: "Humanitarian response"},
        {value: 2, label: "Food security"},
        {value: 3, label: "Economic opportunity"},
        {value: 4, label: "Climate adaptation and water security"},
        {value: 5, label: "Peace and governance"},
        {value: 6, label: "Resilience"},
    ]

    let disaggregationsFake= [
        {
            id: "SADD_including_unknown",
            name: "SADD (including unknown)",
            helpText: "Only include SADD for Direct participants.",
            columns: ["With double counting", "Without double counting"],
            values: [
                "Age Unknown M",
                "Age Unknown F",
                "Age Unknown Unknown Sex",
                "0-5 M",
                "0-5 F",
                "0-5 Unknown Sex",
                "6-9 M",
                "6-9 F",
                "6-9 Unknown Sex",
                "10-14 M",
                "10-14 F",
                "10-14 Unknown Sex",
                "15-19 M",
                "15-19 F",
                "15-19 Unknown Sex",
                "20-24 M",
                "20-24 F",
                "20-24 Unknown Sex",
                "25-34 M",
                "25-34 F",
                "25-34 Unknown Sex",
                "35-49 M",
                "35-49 F",
                "35-49 Unknown Sex",
                "50+ M",
                "50+ F",
                "50+ Unknown Sex",
            ],
        },
        {
            id: "sector_direct",
            name: "Sector - Direct Participants",
            helpText: "Provide a disaggregation of participants reached by sector. Only provide the figure with double counting. Refer to MEL Tip Sheet: Guidelines on Counting and Reporting Participant Numbers [link: https://library.mercycorps.org/record/16929?ln=en] for a description of outcome themes.",
            columns: ["With double counting"],
            values: [
                "Agriculture",
                "Cash and voucher assistance",
                "Environment (DRR, Energy, and Water)",
                "Employment",
                "Financial Services",
                "Nutrition",
                "Infastructure (non-WASH, non-energy)",
            ]
        },
        {
            id: "sector_indirect",
            name: "Sector - Indirect Participants",
            helpText: "Provide a disaggregation of participants reached by sector. Only provide the figure with double counting. Refer to MEL Tip Sheet: Guidelines on Counting and Reporting Participant Numbers [link: https://library.mercycorps.org/record/16929?ln=en] for a description of outcome themes.",
            columns: ["With double counting"],
            values: [
                "Agriculture",
                "Cash and voucher assistance",
                "Environment (DRR, Energy, and Water)",
                "Employment",
                "Financial Services",
                "Nutrition",
                "Infastructure (non-WASH, non-energy)",
            ]
        },
    ]

    // console.log('disaggregations', disaggregations);

    const columnOptions = [
        {
            id: "with_double",
            name: "With double counting",
        }, 
        {
            id: "without_double",
            name: "Without double counting",
        }
    ]
    let cols = {
        591: [columnOptions[0]],
        590: [columnOptions[0]],
        109: [columnOptions[1], columnOptions[0]],
        576: [columnOptions[1], columnOptions[0]],
        577: [columnOptions[0]],
        578: [columnOptions[0]],
        579: [columnOptions[1], columnOptions[0]],
    }

    useEffect(() => {
        $(`#addResultModal_${indicatorID}`).on('hidden.bs.modal', function () {
            setCommonFieldsInput({date_collected: "", fiscal_year: "FY 2022: 1 July 2021 - 30 June 2022"})
            setEvidenceFieldsInput({})
            setActualFieldsInput({})
            setDisaggregationFieldsInput({})
            setSumValues({})
            setFormErrors({})
        })

        $(document).on("keyup", function(event) {
            if(event.key === 'Escape') {
                $(`#addResultModal_${indicatorID}`).modal('hide');
            }
        })
    }, [])

    const [commonFieldsInput, setCommonFieldsInput] = useState({fiscal_year: "FY 2022: 1 July 2021 - 30 June 2022"});
    const [evidenceFieldsInput, setEvidenceFieldsInput] = useState({});
    const [actualFieldsInput, setActualFieldsInput] = useState({});
    const [disaggregationFieldsInput, setDisaggregationFieldsInput] = useState({});
    const [sumValues, setSumValues] = useState({});
    const [formErrors, setFormErrors] = useState({});

    let validateForm = () => {
        let detectedErrors = {};
        if (!commonFieldsInput.date_collected || commonFieldsInput.date_collected === "") {
            detectedErrors = {...detectedErrors, date_collected: gettext("This date should be within the fiscal year of the reporting period.")}
        };

        if (!commonFieldsInput.outcome_theme || commonFieldsInput.outcome_theme === []) {
            detectedErrors = {...detectedErrors, outcome_theme: gettext("Please complete this field. You can select more than one outcome theme.")}
        };
        if (Object.entries(actualFieldsInput).length === 0) {
            detectedErrors = {...detectedErrors, 576: gettext("With double counting is required. Please complete this field.")}
        } else {
            if (!actualFieldsInput["576"]["0"]["0"] || actualFieldsInput["576"]["0"]["0"].value === "" || !actualFieldsInput["576"]["0"]["1"] || actualFieldsInput["576"]["0"]["1"].value === "") {
                detectedErrors = {...detectedErrors, 576: gettext("With double counting is required. Please complete this field.")}
            }
            
            if (actualFieldsInput["576"]["1"]) {
                if (parseInt(actualFieldsInput["576"]["1"]["0"].value) > parseInt(actualFieldsInput["576"]["0"]["0"].value) || 
                parseInt(actualFieldsInput["576"]["1"]["1"].value) > parseInt(actualFieldsInput["576"]["0"]["1"].value)) {
                    detectedErrors = {...detectedErrors, 576: gettext("Direct/indirect without double counting should be equal or lower than Direct/indirect with double counting.")}
                }
            }
        }

        if (disaggregationFieldsInput["579"]) {
            if ( sumValues["576"] && sumValues["579"] && sumValues["579"]["0"] !== sumValues['576']["0"]) {
                detectedErrors = {...detectedErrors, 579: gettext("The sum of 'SADD with double counting' should be equal to the sum of 'Direct with double counting'. The sum of 'SADD without double counting' should be equal to the sum of 'Direct without double counting'.")}
            }
            if (sumValues["576"] && sumValues["579"] && sumValues["579"]["1"] !== sumValues["576"]["1"]) {
                detectedErrors = {...detectedErrors, 579: gettext("The sum of 'SADD with double counting' should be equal to the sum of 'Direct with double counting'. The sum of 'SADD without double counting' should be equal to the sum of 'Direct without double counting'.")}
            }
        }

        // disaggregations.map(currentDisaggregation => {
        //     if (currentDisaggregation.pk !== 576) {
        //         if(!disaggregationFieldsInput[currentDisaggregation.pk] || sumValues[currentDisaggregation.pk]["0"] === 0) {
        //             detectedErrors = {...detectedErrors, [currentDisaggregation.pk]: errors[currentDisaggregation.pk].errorMessage}
        //         }
        //     }
        // })

        setFormErrors(detectedErrors);
    }


    let formatData = (data) => {
        let formatedData = [];
        Object.keys(data).map(key => {
            formatedData.push({name: key, value: data[key]})
        })
        return formatedData;
    }

    let handleSubmit = (e) => {
        e.preventDefault();
        validateForm();
        console.log('commonFieldsInput:', commonFieldsInput)
        console.log('actualFieldsInput:', actualFieldsInput)
        console.log('disaggregationFieldsInput:', disaggregationFieldsInput);
        console.log('evidenceFieldsInput', evidenceFieldsInput);
        console.log('sumValues:', sumValues);
        let data = [];
        // data = data.concat(formatData({indicator: indicatorID, program: programID}))
        // data = data.concat(formatData(commonFieldsInput));
        // data = data.concat(formatData(actualFieldsInput));
        // data = data.concat(formatData(disaggregationFieldsInput));
        // console.log("Data", data);
        // let form_data = new FormData;
    }

    return (
        <div style={{textAlign: "left"}}>
            <h2>
                {
                    gettext('Result')
                }
            </h2>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            <h3 className="no-bold indicator_name">
                {
                    gettext('Participant Count')
                }
            </h3>

            {/* <form onSubmit={(e) => handleSubmit(e)}> */}
                <CommonFields
                    reportingPeriodEnd={reportingPeriodEnd}
                    reportingPeriodStart={reportingPeriodStart}
                    commonFieldsInput={commonFieldsInput}
                    setCommonFieldsInput={setCommonFieldsInput}
                    outcomeThemesData={outcomeThemesData}
                    formErrors={formErrors}
                />

                {
                    disaggregations.map((disagg, i) => {
                        if (disagg.pk === 576) {
                            return <ActualValueFields
                                key={disagg.pk}
                                actualFieldsInput={actualFieldsInput} 
                                setActualFieldsInput={setActualFieldsInput}
                                disagg={disagg}
                                sumValues={sumValues}
                                setSumValues={setSumValues}
                                cols={cols}
                                formErrors={formErrors}
                            />
                        }
                    })
                }

                {disaggregations.map((disagg, i) => {
                    if ( [578, 579].indexOf(disagg.pk) >= 0 ) {
                        return <DissaggregationFields 
                                    key={disagg.pk}
                                    indicatorID={indicatorID}
                                    disagg={disagg} 
                                    actualFieldsInput={actualFieldsInput}
                                    disaggregationFieldsInput={disaggregationFieldsInput}
                                    setDisaggregationFieldsInput={setDisaggregationFieldsInput}
                                    sumValues={sumValues}
                                    setSumValues={setSumValues}
                                    cols={cols}
                                    formErrors={formErrors}
                                />

                    }
                })}
                <EvidenceFields
                    evidenceFieldsInput={evidenceFieldsInput}
                    setEvidenceFieldsInput={setEvidenceFieldsInput}
                    formErrors={formErrors}
                />

                <div className="form-actions">
                    <div>
                        <button 
                            type="button" 
                            className="btn btn-primary result-group" 
                            id="result-submit-create" 
                            onClick={(e) => handleSubmit(e)}
                        >{gettext('Save and close')}
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-reset result-group" 
                            id="result-cancel-btn"
                            data-dismiss="modal"
                        >{gettext('Cancel')}
                        </button>
                    </div>

                        {/* {% if object.id %}
                            <button type="button" className="btn btn-primary" id="result-submit-update">{% trans 'Save and close' %}</button>
                        {% else %} */}
                            {/* <button type="submit" className="btn btn-primary" id="result-submit-create">{gettext('Save and close')}</button> */}
                        {/* {% endif %} */}
                </div>
            {/* </form> */}
        </div>
    )
}



// ***** Common Fields Section *****
const CommonFields = ({ reportingPeriodStart, reportingPeriodEnd, commonFieldsInput, setCommonFieldsInput, outcomeThemesData, formErrors }) => {

    // console.log(reportingPeriodStart, reportingPeriodEnd);

    return (
        <fieldset>
            <div className="form-group" id="div_id_date_collected">
                <label htmlFor="id_date_collected" className="label--required">{gettext('Result date')}</label>

                <a href="#"
                tabIndex="0"
                data-toggle="popover"
                data-placement="right"
                data-trigger="focus"
                data-content={ gettext('If data collection occurred within the fiscal year, enter the date where data was collected. If data collection occurred after the end of the fiscal year, enter the last day of the fiscal year (June 30).')}>
                    &nbsp;<i className="far fa-question-circle"></i>
                </a>

                <input 
                    type="date" 
                    name="date_collected" 
                    id="id_date_collected" 
                    className={`datepicker form-control hasDatepicker ${formErrors.date_collected && "is-invalid"}`}
                    required
                    autoComplete="off" 
                    min={reportingPeriodStart}
                    max={reportingPeriodEnd}
                    value={commonFieldsInput.date_collected || ""}
                    onChange={(e) => setCommonFieldsInput({...commonFieldsInput, [e.target.name]: e.target.value})}
                />
                {
                    formErrors.date_collected &&
                        <span id="validation_id_date_collected" className="has-error">{formErrors.date_collected}</span>
                }
            </div>

            <div className="form-group" id="div_id_fiscal_year">
                <label htmlFor="id_fiscal_year" className="label--required">{gettext('Fiscal year')}</label>

                <a href="#"
                tabIndex="0"
                data-toggle="popover"
                data-placement="right"
                data-trigger="focus"
                data-content={ gettext('Fiscal years run from July 1 to June 30 of the following year.')}>
                    &nbsp;<i className="far fa-question-circle"></i>
                </a>

                <input 
                    type="text" 
                    name="fiscal_year" 
                    id="id_fiscal_year" 
                    className="form-control" 
                    required autoComplete="off" 
                    disabled 
                    value={commonFieldsInput.fiscal_year}
                    onChange={(e) => setCommonFieldsInput({...commonFieldsInput, [e.target.name]: e.target.value})}
                />
            </div>

            <div className="form-group react-multiselect-checkbox" id="div_id_outcome_theme">
                <label htmlFor="id_outcome_theme" className="label--required">{gettext('Outcome theme')}</label>

                <a href="#"
                tabIndex="0"
                data-toggle="popover"
                data-placement="right"
                data-trigger="focus"
                data-content={ gettext('Outcome themes are the main areas of a program. Refer to MEL Tip Sheet: Guidelines on Counting and Reporting Participant Numbers [link: https://library.mercycorps.org/record/16929?ln=en] for a description of outcome themes.')}>
                    &nbsp;<i className="far fa-question-circle"></i>
                </a>

                <CheckboxedMultiSelect 
                    options={outcomeThemesData}
                    placeholder={gettext("None Selected")}
                    className={`${formErrors.outcome_theme && "is-invalid"}`}
                    id="outcome_themes_multiselect"
                    value={commonFieldsInput.outcome_theme}
                    onChange={(e) => setCommonFieldsInput({...commonFieldsInput, outcome_theme: e})}
                />
                {
                    formErrors.outcome_theme &&
                        <span id="validation_id_outcome_theme" className="has-error">{formErrors.outcome_theme}</span>
                }
            </div>

        </fieldset>
    )
}



// ***** Acutal Values Fields Section *****
const ActualValueFields = ({ actualFieldsInput, setActualFieldsInput, disagg, sumValues, setSumValues, cols, formErrors }) => {
    // console.log(disagg, formErrors);
    // console.log('actualFieldsInput:', actualFieldsInput);

    useEffect(() => {
        let initializeActuals = {[disagg.pk]: {0: [], 1: []}}
        disagg.labels.map(currentLabel => {
            initializeActuals[disagg.pk]["0"][0] = {...currentLabel, value: ""}
            initializeActuals[disagg.pk]["0"][1] = {...currentLabel, value: ""}
            initializeActuals[disagg.pk]["1"][0] = {...currentLabel, value: ""}
            initializeActuals[disagg.pk]["1"][1] = {...currentLabel, value: ""}
        })
        setActualFieldsInput(initializeActuals);
    }, [])


    let handleDataEntry = (value, disagg, label, rowIndex, colIndex, colLength) => {
        let colSortedIndex = colLength - 1 - colIndex; // Column index from right to left to align the same column of the disaggregations with 2 columns with ones with 1 column
        
        let updatedDisaggFields = {...actualFieldsInput};
        !updatedDisaggFields[disagg] && (updatedDisaggFields[disagg] = {});
        !updatedDisaggFields[disagg][colSortedIndex] && (updatedDisaggFields[disagg][colSortedIndex] = []);
        updatedDisaggFields[disagg][colSortedIndex][rowIndex] = {...label, value: value};
        setActualFieldsInput(updatedDisaggFields);

        let updatedSumValues = {...sumValues};
        !updatedSumValues[disagg] && (updatedSumValues[disagg] = {});
        let sum = updatedDisaggFields[disagg][colSortedIndex].reduce((total, currentLabel) => {
            return total + parseInt(currentLabel.value || 0);
        }, 0)
        updatedSumValues[disagg][colSortedIndex] = sum;
        setSumValues(updatedSumValues);

        console.log(value, "|", disagg, "|", label, "|", rowIndex, "|", colIndex, "|", colLength);
        // console.log('updatedDisaggFields:', updatedDisaggFields);
        // console.log('updatedSumValues:', updatedSumValues);
        // console.log('sumValues', sumValues);
    }

    return (
        <React.Fragment>
           <ul className="list-group form-list-group">
                <li className="list-group-item heading-row">
                    <div className="item__label">
                        <label className="label--required">{gettext('Total Participant Actual Values')}</label>

                        <a href="#"
                            tabIndex="0"
                            data-toggle="popover"
                            data-placement="right"
                            data-trigger="focus"
                            data-content={
                                // # Translators:
                                gettext('Include the participants with double counting on the left and participants without double counting across programs on the right. If two programs share participants,  only discount double counting in one program!<br/><br/><strong>Direct participants</strong> – are those who have received a tangible benefit from the program, either as the actual program participants or the intended recipients of the program benefits.<br/><br/><strong>Indirect participants</strong> – are those who received a tangible benefit through their proximity to or contact with program participants or activities.')
                            }>
                                &nbsp;<i className="far fa-question-circle"></i>
                        </a>
                    </div>
                    <div className="item__value--container">
                        {
                        cols[disagg.pk].map((column, i) => {
                            return (
                                <div key={i} className="bin heading">{column.name}</div>
                                )
                            })
                        }
                    </div>
                </li>

                {
                   disagg.labels.map((label, rowIndex) => {
                       return (
                            <li key={`${disagg.pk}-${label.pk}-${rowIndex}`} className="list-group-item">
                                <div className="item__label">Actual {label.name} value</div>
                                <div className="item__value--container">
                                    {
                                        cols[disagg.pk].map((column, colIndex) => {
                                            let sortedColumnIndex = cols[disagg.pk].length - 1 - colIndex;
                                            let value;
                                            try { value = actualFieldsInput[disagg.pk][sortedColumnIndex][rowIndex].value; } 
                                            catch { value = ""}

                                            return (
                                                <input 
                                                    key={`${disagg.pk}-${label.pk}-${rowIndex}-${colIndex}`}
                                                    type="number" 
                                                    className="bin form-control input-value" 
                                                    name={`disaggregation-formset-${disagg.pk}-${rowIndex}-label_pk-${column.id}`} 
                                                    id={`id_${column.id}`}
                                                    value={value}
                                                    onChange={(e) => handleDataEntry(e.target.value, disagg.pk, label, rowIndex, colIndex, cols[disagg.pk].length)}
                                                />
                                            )
                                        })
                                    }
                                </div>
                            </li>
                       )
                   })
               }

                <li className="list-group-item reference-row">
                    <div className="item__label">{gettext("Actual total value")}</div>
                    <div className="item__value--container">
                        {
                            cols[disagg.pk].map((column, colIndex) => {
                                let sortedColumnIndex = cols[disagg.pk].length - 1 - colIndex;
                                let value;
                                try{ value = sumValues[disagg.pk][sortedColumnIndex] }
                                catch{ value = 0 }
                                return (
                                    <div key={colIndex} className="bin">{value}</div>
                                )
                            })
                        }
                    </div>
                </li>
                {
                    formErrors[disagg.pk] &&
                        <span id={`validation_id_${disagg.pk}`} className="has-error">{formErrors[disagg.pk]}</span>
                }
           </ul>
        </React.Fragment>
    )
}



// ***** Dissaggreagation Fields Section *****
const DissaggregationFields = ({disagg, indicatorID, actualFieldsInput, disaggregationFieldsInput, setDisaggregationFieldsInput, sumValues, setSumValues, cols, formErrors}) => {

    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        $(`#${indicatorID}-${disagg.pk}`).on('show.bs.collapse', function() {
            setExpanded(true);
        })
        $(`#${indicatorID}-${disagg.pk}`).on('hide.bs.collapse', function() {
            setExpanded(false);
        })
    }, [])
    
    let handleDataEntry = (value, disagg, label, rowIndex, colIndex, colLength) => {
        let colSortedIndex = colLength - 1 - colIndex; // Column index from right to left to align the same column of the disaggregations with 2 columns with ones with 1 column
        
        let updatedDisaggFields = {...disaggregationFieldsInput};
        !updatedDisaggFields[disagg] && (updatedDisaggFields[disagg] = {});
        !updatedDisaggFields[disagg][colSortedIndex] && (updatedDisaggFields[disagg][colSortedIndex] = []);
        updatedDisaggFields[disagg][colSortedIndex][rowIndex] = {...label, value: value};
        setDisaggregationFieldsInput(updatedDisaggFields);

        let updatedSumValues = {...sumValues};
        !updatedSumValues[disagg] && (updatedSumValues[disagg] = {});
        let sum = updatedDisaggFields[disagg][colSortedIndex].reduce((total, currentLabel) => {
            return total + parseInt(currentLabel.value || 0);
        }, 0)
        updatedSumValues[disagg][colSortedIndex] = sum;
        setSumValues(updatedSumValues);

        console.log(value, "|", disagg, "|", label, "|", rowIndex, "|", colIndex, "|", colLength);
        console.log('disaggregationFieldsInput:', updatedDisaggFields);
        console.log('updatedSumValues:', updatedSumValues);
        console.log('sumValues', sumValues);
    }

    return (
        <fieldset>
            <ul className="list-group form-list-group">
                <li className="list-group-item heading-row">
                    <div>
                        <a className="item__label accordion-header collapsed" data-toggle="collapse" href={`#${indicatorID}-${disagg.pk}`} aria-expanded={expanded} aria-controls={`#${disagg.pk}`}>
                            <FontAwesomeIcon icon={ expanded ? 'caret-down' : 'caret-right' } />&nbsp;
                            <label className="label--required">{disagg.name}</label>
                        </a>

                        <a href="#"
                            tabIndex="0"
                            data-toggle="popover"
                            data-placement="right"
                            data-trigger="focus"
                            // data-content={ gettext(disagg.helpText)}>
                            data-content={ gettext("Helptext")}>
                                <i className="far fa-question-circle"></i>
                        </a>

                        {
                            !expanded && formErrors[disagg.pk] &&
                            <span className="needs-attention"><i className="fas fa-exclamation-triangle"></i> Needs Attention</span>
                        }
                    </div>
                    <div className="item__value--container" style={{display: expanded ? "inherit" : "none"}}>
                        {
                            cols[disagg.pk].map((column, i) => {
                            return (
                                <div key={i} className="bin heading">{column.name}</div>
                                )
                            })
                        }
                    </div>
                </li>
            </ul>
           <ul className="list-group form-list-group collapse" id={`${indicatorID}-${disagg.pk}`}>

               {
                   disagg.labels.map((label, rowIndex) => {
                       return (
                            <li key={`${disagg.pk}-${label.pk}-${rowIndex}`} className="list-group-item">
                                <div className="item__label">{label.name}</div>
                                <div className="item__value--container">
                                    {
                                        cols[disagg.pk].map((column, colIndex) => {
                                            let sortedColumnIndex = cols[disagg.pk].length - 1 - colIndex;
                                            let value;
                                            try { value = disaggregationFieldsInput[disagg.pk][sortedColumnIndex][rowIndex].value; } 
                                            catch { value = ""}

                                            return (
                                                <input 
                                                    key={`${disagg.pk}-${label.pk}-${rowIndex}-${colIndex}`}
                                                    type="number" 
                                                    className="bin form-control input-value" 
                                                    name={`disaggregation-formset-${disagg.pk}-${rowIndex}-label_pk-${column.id}`} 
                                                    id={`id_${column.id}`}
                                                    value={value}
                                                    onChange={(e) => handleDataEntry(e.target.value, disagg.pk, label, rowIndex, colIndex, cols[disagg.pk].length)}
                                                />
                                            )
                                        })
                                    }
                                </div>
                            </li>
                       )
                   })
               }

                <li className="list-group-item sum-row">
                    <div className="item__label">{gettext("Sum")}</div>
                    <div className="item__value--container">
                        {
                            cols[disagg.pk].map((column, colIndex) => {
                                let sortedColumnIndex = cols[disagg.pk].length - 1 - colIndex;
                                let value;
                                try{ value = sumValues[disagg.pk][sortedColumnIndex] }
                                catch{ value = 0 }
                                return (
                                    <div key={colIndex} className="bin">{value}</div>
                                )
                            })
                        }
                    </div>
                </li>

                <li className="list-group-item reference-row">

                    <div className="item__label">{gettext("Actual Direct value")}</div>

                    <div className="item__value--container">
                        {
                            cols[disagg.pk].map((column, colIndex) => {
                                let sortedColumnIndex = cols[disagg.pk].length - 1 - colIndex;
                                let value;
                                try{ value = actualFieldsInput[576][sortedColumnIndex][0].value }// TODO: update for direct or indirect
                                catch{ value = 0 }
                                return (
                                    <div key={colIndex} className="bin">{value}</div>
                                )
                            })
                        }
                    </div>
                </li>
                {
                    formErrors[disagg.pk] &&
                        <span id={`validation_id_${[disagg.pk]}`} className="has-error">{formErrors[disagg.pk]}</span>
                }
           </ul>
        </fieldset>
    )
}



// ***** Evidence Fields Section *****
const EvidenceFields = ({ evidenceFieldsInput, setEvidenceFieldsInput, formErrors }) => {

    const [validEvidenceURL, setValidEvidenceURL] = useState(false);

    useEffect(() => {
        if(evidenceFieldsInput.evidence_url) {
            let evidenceURLHasValue = evidenceFieldsInput.evidence_url.match(/^(http(s)?|file):\/\/.+/);
            setValidEvidenceURL(evidenceURLHasValue);
        }
    }, [evidenceFieldsInput.evidence_url])

    return (
        <div className="card card-body bg-primary-light border-0">
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
                <label htmlFor="id_record_url" className="label--required">
                    {
                        gettext('Link to file or folder')
                    }
                </label>
                <a href="#"
                    tabIndex="0"
                    data-toggle="popover"
                    data-placement="right"
                    data-trigger="focus"
                    data-content=
                    {
                        // # Translators: 
                        gettext('Provide a link to a file or folder in Google Drive or another shared network drive. Please be aware that TolaData does not store a copy of your record, <i>so you should not link to something on your personal computer, as no one else will be able to access it.</i>')
                        
                    }
                >
                    &nbsp;<i className="far fa-question-circle"></i>
                </a>

                <div className="d-flex btn-group">
                    <input 
                        type="text" 
                        name="evidence_url" 
                        id="id_evidence_url" 
                        maxLength="255" 
                        className="form-control"
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
                        onClick={() => alert("Google")}
                    >
                        <i className="fas fa-external-link-alt"></i>{gettext('Browse Google Drive')}
                    </button>
                </div>

                <div className="form-group" id="div_id_record_name">
                    <label htmlFor="id_record_name">{gettext("Record name")}&nbsp;</label>

                    <a href="#"
                        tabIndex="0"
                        data-toggle="popover"
                        data-placement="right"
                        data-trigger="focus"
                        data-content={gettext('Give your record a short name that is easy to remember.')}>
                            <i className="far fa-question-circle"></i>
                    </a>

                    <input 
                        type="text" 
                        name="record_name" 
                        id="id_record_name" 
                        className="form-control" 
                        maxLength="135"
                        value={evidenceFieldsInput.record_name || ""}
                        onChange={(e) => setEvidenceFieldsInput({...evidenceFieldsInput, [e.target.name]: e.target.value})}
                    />
                </div>

            </div>
        </div>
    )
}


export default PCResultsForm;

let errors = {
    576: { // Actuals    
        errorMessage: 
            // # Translators: 
            gettext("Direct/indirect without double counting should be equal or lower than Direct/indirect with double counting.")
    },
    // 578: { // Sector
    //     errorMessage: 
    //         // # Translators:
    //         gettext("The sum of sector participants can be higher than the 'Direct with double counting' of the indicator.")
    // },
    579: { // SADD
        errorMessage: 
            // # Translators:
            gettext("The sum of 'SADD with double counting' should be equal to the sum of 'Direct with double counting'. The sum of 'SADD without double counting' should be equal to the sum of 'Direct without double counting'.")
    },
}