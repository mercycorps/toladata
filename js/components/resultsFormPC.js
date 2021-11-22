import React from 'react'

const PCResultsForm = () => {
    return (
        <React.Fragment>
            {/* Common fields  */}
            <CommonFields />
            {/* Dissaggregation fields */}
            <DissaggregationFields />
            {/* Evidence fields */}
            <EvidenceFields />
        </React.Fragment>
    )
}

const CommonFields = () => {
    return (
        <div>
            Common Fields
        </div>
    )
}

const EvidenceFields = () => {
    return (
        <div>
            Evidence Fields
        </div>
    )
}

const DissaggregationFields = () => {
    return (
        <div>
            Dissaggregation Fields
        </div>
    )
}


export default PCResultsForm;
