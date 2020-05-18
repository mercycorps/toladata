import React from 'react';
import { inject, observer } from 'mobx-react';
import * as Selectors from './reportSelect';
import * as Filters from './reportFilter';
import { IPTTButton } from './buttons';


const FilterTop = inject('filterStore')(
    observer(({ filterStore }) => {
        return (
            <React.Fragment>
                <Selectors.ProgramSelect />
                <Selectors.FrequencySelect />
                <Selectors.TimeframeRadio />
                <Selectors.StartDateSelect />
                <Selectors.EndDateSelect />
                { filterStore.resultsFramework &&
                    <Selectors.GroupingSelect />
                }
                <Filters.HiddenColumnSelect />
            </React.Fragment>
        );
    })
);

const FilterMiddle = () => {
    return (
        <React.Fragment>
            <Filters.LevelSelect />
            <Filters.DisaggregationSelect />
            <Filters.SiteSelect />
            <Filters.TypeSelect />
            <Filters.SectorSelect />
            <Filters.IndicatorSelect />
        </React.Fragment>
    );
}

const IPTTFilterForm = inject('filterStore')(
    observer(({ filterStore }) => {
        return (
            <nav id="id_iptt_report_filter">
                <div className="p-3" id="filter-top">
                    <h3 className="filter-title text-title-case">
                        {
                        /* # Translators: Labels a set of filters to select which data to show */
                         gettext('Report Options') }
                    </h3>
                    <FilterTop />
                </div>
                <div id="filter-middle" className="px-3 pt-3 pb-2">
                    <FilterMiddle />
                </div>
                <div id="filter-bottom">
                    <IPTTButton
                        label={
                            /* # Translators: clears all filters set on a report */
                            gettext('Clear filters')
                        }
                        action={ filterStore.clearFilters.bind(filterStore) }
                        isDisabled={ !filterStore.filtersActive }
                    />
              </div>
              { filterStore.programFilterData && (
              <div id="filter-extra" className=" d-flex justify-content-between no-gutters p-3">
                  <a href={ `/tola_management/audit_log/${filterStore.selectedProgramId}/` }
                      className="btn-link">
                      <i className="fas fa-history"></i> {gettext("Change log")}
                  </a>
              </div>
              )}
            </nav>
        );
    })
);

export default IPTTFilterForm;
