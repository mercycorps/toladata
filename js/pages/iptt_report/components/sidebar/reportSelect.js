import React from 'react';
import { observer, inject } from 'mobx-react';
import { SingleReactSelect, DateSelect, GroupBySelect } from '../../../../components/selectWidgets';

/**
 * input-ready filtering single-select for Programs available to user in IPTT Report
 * uses SingleSelect in js/components/selectWidgets
 */

const ProgramSelect = inject('filterStore')(
    observer(({ filterStore }) => {
        return (
            <SingleReactSelect
                label={ gettext('Program') }
                options={ filterStore.programOptions }
                value={ filterStore.selectedProgramOption }
                update={ selected => { filterStore.selectedProgramOption = selected } }
            />
        );
    })
);

/**
 * input-ready filtering single-select for Frequencies available for selected program in IPTT Report
 * uses SingleSelect in js/components/selectWidgets
 */

const FrequencySelect = inject('filterStore')(
    observer(({ filterStore }) => {
        return (
            <SingleReactSelect
                label={
                    filterStore.isTVA ?
                        gettext('Target periods') :
                        gettext('Time periods')
                }
                options={ filterStore.frequencyOptions }
                value={ filterStore.selectedFrequencyOption }
                update={ selected => { filterStore.selectedFrequencyOption = selected; } }
            />
        );
    })
);

/**
 * Show All radio / Most Recent radio / number of Most Recent periods input combo component
 * For selecting start and end of IPTT report
 * controlled component - logic to update date selects in filterStore model (../models)
 */
@inject('filterStore')
@observer
class TimeframeRadio extends React.Component {
    constructor(props) {
        super(props);
        this.mostRecentInputRef = React.createRef();
        this.state = {
            focus: false,
            revert: false,
            mostRecentValue: this.props.filterStore.mostRecentValue
        };
    }
    
    checkMostRecent = (e) => {
        let mostRecentCount = isNaN(parseInt(this.state.mostRecentValue)) ? 2 : parseInt(this.state.mostRecentValue);
        this.setState({mostRecentValue: mostRecentCount});
        this.mostRecentInputRef.current.focus();
    }
    
    handleChange = (e) => {
        this.setState({mostRecentValue: e.target.value});
    }

    handleBlur = (e) => {
        if (!this.state.revert) {
            this.props.filterStore.mostRecentValue = this.state.mostRecentValue;
        }
        this.setState({focus: false, revert: false, mostRecentValue: this.props.filterStore.mostRecentValue});
    }
    
    handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            e.target.blur();
        } else if (e.keyCode === 27) {
            this.setState({revert: true},
                () => {this.mostRecentInputRef.current.blur();});
        }
    }

    handleFocus = (e) => {
        this.setState({focus: true, revert: false, mostRecentValue: this.props.filterStore.mostRecentValue});
    }

    render() {
        return (
            <div className="form-row mb-3">
                <div className="col-sm-4">
                    <div className="form-check form-check-inline pt-1">
                        <span className="form-check-input">
                            <input type="radio"
                                   checked={ !this.state.focus && this.props.filterStore.showAll }
                                   disabled={ this.props.filterStore.periodsDisabled }
                                   onChange={ e => { this.props.filterStore.showAll = true } }
                                   />
                        </span>
                        <label onClick={ e => {this.props.filterStore.showAll = true} } 
                               className="form-check-label text-nowrap">
                            {
                                /* # Translators: option to show all periods for the report */
                                gettext('Show all')
                            }
                        </label>
                    </div>
                </div>
                <div className="col-sm-4 p-0">
                    <div className="form-check form-check-inline pt-1">
                        <span className="form-check-input">
                            <input type="radio"
                                   checked={ this.state.focus || this.props.filterStore.mostRecentChecked }
                                   disabled={ this.props.filterStore.periodsDisabled }
                                   onChange={ this.checkMostRecent }
                                   />
                        </span>
                        <label onClick={ this.checkMostRecent }
                               className="form-check-label text-nowrap">
                            {
                                /* # Translators: option to show a number of recent periods for the report */
                                gettext('Most recent')
                            }
                        </label>
                    </div>
                </div>
                <div className="col-sm-4">
                    <input type="number" className="form-control"
                           value={ this.state.focus ? this.state.mostRecentValue : this.props.filterStore.mostRecentValue }
                           ref={ this.mostRecentInputRef }
                           disabled={ this.props.filterStore.periodsDisabled }
                           onChange={ this.handleChange }
                           onFocus={ this.handleFocus }
                           onBlur={ this.handleBlur }
                           onKeyDown={ this.handleKeyDown }
                           />
                </div>
           </div>
        );
    }
}

/**
 * non input-ready dropdown for periods available for Start of IPTT Report select
 * composes DateSelect in components/selectWidgets
 */
const StartDateSelect = inject('filterStore')(
    observer(({ filterStore }) => {
        return <DateSelect
                    label={
                        /* # Translators: menu for selecting the start date for a report */
                        gettext('Start')
                    }
                    disabled={ filterStore.periodsDisabled }
                    value={ filterStore.startPeriodValue || '' }
                    update={ e => {filterStore.startPeriodValue = e.target.value;} }
                    options={ filterStore.startOptions }
                />
    })
);

/**
 * non input-ready dropdown for periods available for End of IPTT Report select
 * composes DateSelect in components/selectWidgets
 */
const EndDateSelect = inject('filterStore')(
    observer(({ filterStore }) => {
        return <DateSelect
                    label={
                        /* # Translators: menu for selecting the end date for a report */
                        gettext('End')
                    }
                    disabled={ filterStore.periodsDisabled }
                    value={ filterStore.endPeriodValue || '' }
                    update={ e => {filterStore.endPeriodValue = e.target.value;} }
                    options={ filterStore.endOptions }
                />
    })
);

/**
 * single select with non dynamic options (dynamic labeling based on program's name for tier 2)
 * selects "grouping" or "chaining" based display of indicators in report and filter dropdowns
 */
const GroupingSelect = inject('filterStore')(
    observer(({ filterStore }) => {
        return <GroupBySelect
                    chainLabel={ filterStore.resultChainFilterLabel }
                    value={ filterStore.groupBy }
                    update={ e => { filterStore.groupBy = e.target.value;} }
                />
    })
);


export { ProgramSelect, FrequencySelect, TimeframeRadio, StartDateSelect, EndDateSelect, GroupingSelect };