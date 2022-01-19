import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HelpText } from '../components/HelpText.js'

const DisaggregationFields = ({ indicatorID, disagg, disaggregationData, disaggregationArray, setDisaggregationData, total, title, helptext, formErrors, readOnly }) => {
    const [expanded, setExpanded] = useState(false);

    let disaggID = disagg.reduce((id, disaggregation) => {
        id = id + (id === "" ? "" : "-") + disaggregation.pk;
        return id;
    },"")

    let totals = disagg.reduce((labelsArr, currentDisaggregation) => {
        let totalDisagg = disaggregationArray && disaggregationArray.filter(currentDisagg => {
            return currentDisagg.disaggregation_type.includes("Actual") &&
            currentDisagg.double_counting === currentDisaggregation.double_counting
            
        })
        let sumVal = disaggregationArray && totalDisagg[0].labels.filter(labelObj => labelObj.label === currentDisaggregation.count_type)[0]
        labelsArr.unshift(sumVal)
        return labelsArr;
    }, []);

    useEffect(() => {
        $(`#${indicatorID}-${disaggID}`).on('show.bs.collapse', function() {
            setExpanded(true);
        })
        $(`#${indicatorID}-${disaggID}`).on('hide.bs.collapse', function() {
            setExpanded(false);
        })
    }, [])

    let handleDataEntry = (value, inputDisaggPk, customsort) => {
        let update = {...disaggregationData};
        update[inputDisaggPk].labels[customsort - 1] = {...disaggregationData[inputDisaggPk].labels[customsort - 1], value: value};
        setDisaggregationData(update);
    }

    return (
        <fieldset>
            <ul className="list-group form-list-group">
                <li className="list-group-item heading-row">
                    <div className="item__value--header">
                        <a className="item__label--accordion accordion-header collapsed" data-toggle="collapse" href={`#${indicatorID}-${disaggID}`} aria-expanded={expanded} aria-controls={`#${disaggID}`}>
                            <FontAwesomeIcon icon={ expanded ? 'caret-down' : 'caret-right' } />&nbsp;
                            <label className="label--required">{title || disagg[0].disaggregation_type}</label>
                        </a>

                        <HelpText text={helptext[disaggID]}/>

                        {
                            !expanded && formErrors[disaggID] &&
                            <span className="needs-attention"><i className="fas fa-exclamation-triangle"></i>{gettext("Needs Attention")}</span>
                        }
                    </div>
                    <div className="item__value--container" style={{display: expanded ? "inherit" : "none"}}>
                        {
                            disagg.length !== 1 &&
                            <div className="bin heading">{gettext("Without double counting")}</div>
                        }
                        <div className="bin heading">{gettext("With double counting")}</div>
                    </div>
                </li>
            </ul>
        <ul className="list-group form-list-group collapse" id={`${indicatorID}-${disaggID}`}>
            {
                disagg[0].labels.map((labelObj) => {
                    return (
                        <li key={`${disaggID}-${labelObj.customsort}`} className="list-group-item">
                            <div className="item__label">{labelObj.label}</div>
                            <div className="item__value--container">
                                {
                                    disagg.map(currentDisagg => {
                                        return (
                                            <input 
                                                key={`id_${disaggID}-${currentDisagg.pk}-${labelObj.customsort}`}
                                                id={`id_${disaggID}-${currentDisagg.pk}-${labelObj.customsort}`}
                                                name={`disaggregation-formset-${disaggID}-${labelObj.customsort}-label_pk`} 
                                                type="number" 
                                                className="bin form-control input-value"
                                                disabled={readOnly}
                                                value={disaggregationData[currentDisagg.pk].labels[labelObj.customsort - 1].value || ""}
                                                onChange={(e) => handleDataEntry(e.target.value, currentDisagg.pk, labelObj.customsort)}
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
                        disagg.map(currentDisagg => {
                            return (
                                <div key={currentDisagg.pk} className="bin">{disaggregationData[currentDisagg.pk].labels.reduce((sum, label) => {
                                    sum+= parseInt(label.value) || 0;
                                    return sum}, 0)}
                                </div>
                            )
                        })
                    }
                </div>
            </li>

            <li className="list-group-item reference-row">
                <div className="item__label">{`Actual ${totals[0].label.toLowerCase()} value`}</div>
                <div className="item__value--container">
                    {
                        disagg.map((currentDisagg, i) => {
                            return (
                                <div key={i} className="bin">{parseInt(totals[i].value || 0)}</div>
                            )
                        })
                    }
                </div>
            </li>
            {
                formErrors[disaggID] &&
                    <span id={`validation_id_${[disaggID]}`} className="has-error">{formErrors[disaggID]}</span>
            }
        </ul>
        </fieldset>
    )
}

export { DisaggregationFields };