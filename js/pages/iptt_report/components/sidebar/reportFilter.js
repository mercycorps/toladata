import React from 'react';
import { observer, inject } from 'mobx-react';
import { MultiSelectCheckbox } from '../../../../components/selectWidgets';


/**
 * input-ready multi-select checkbox widget for filtering IPTT report by level
 * contains both "grouping" and "chaining" filtering options, displayed as two optgroups
 * labeling for second optgroup is based on Program's definition of tier 2 (stored in rootStore.selectedProgram)
 */
const LevelSelect = inject('filterStore')(
    observer(({ filterStore }) => {
        const updateSelected = (selected) => {
            filterStore.levelTierFilters = {
                levels: selected.filter(s => s.category === "level").map(s => s.value),
                tiers: selected.filter(s => s.category === "tier").map(s => s.value),
                oldLevels: selected.filter(s => s.category === "oldLevel").map(s => s.value),
            };
        };
        return <MultiSelectCheckbox
                    label={ gettext('Levels') }
                    options={ filterStore.levelTierOptions }
                    value={ filterStore.levelTierFilters }
                    update={ selected => {filterStore.levelTierFilters = {
                                levels: selected.filter(s => s.category === "level").map(s => s.value),
                                tiers: selected.filter(s => s.category === "tier").map(s => s.value),
                                oldLevels: selected.filter(s => s.category === "oldLevel").map(s => s.value),
                             };} }
                />;
    })
);

/**
 * multi-select checkbox for selecting sites for filtering IPTT */
const SiteSelect = inject('filterStore')(
    observer(({ filterStore }) => {
        return <MultiSelectCheckbox
                    label={
                        /* # Translators: labels sites that a data could be collected at */
                        gettext('Sites')
                    }
                    options={ filterStore.siteOptions }
                    value={ filterStore.siteFilters }
                    update={ selected => {filterStore.siteFilters = selected.map(s => s.value);} }
                />;
    })
);


/**
 * multi-select checkbox for selecting types for filtering IPTT */
const TypeSelect = inject('filterStore')(
    observer(({ filterStore }) => {
        return <MultiSelectCheckbox
                    label={
                        /* # Translators: labels types of indicators to filter by */
                        gettext('Types')
                    }
                    options={ filterStore.indicatorTypeOptions }
                    value={ filterStore.indicatorTypeFilters }
                    update={ selected => {filterStore.indicatorTypeFilters = selected.map(s => s.value);} }
                />;
    })
);


/**
 * multi-select checkbox for selecting sectors for filtering IPTT */
const SectorSelect = inject('filterStore')(
    observer(({ filterStore }) => {
        return <MultiSelectCheckbox
                    label={
                        /* # Translators: labels sectors (i.e. 'Food Security') that an indicator can be categorized as */
                        gettext('Sectors')
                    }
                    options={ filterStore.sectorOptions }
                    value={ filterStore.sectorFilters }
                    update={ selected => {filterStore.sectorFilters = selected.map(s => s.value);} }
                />;
    })
);


/**
 * multi-select checkbox for selecting indicators for filtering IPTT */
const IndicatorSelect = inject('filterStore')(
    observer(({ filterStore }) => {
        return <MultiSelectCheckbox
                    label={
                        /* # Translators: labels a filter to select which indicators to display */
                        gettext('Indicators')
                    }
                    options={ filterStore.indicatorOptions }
                    value={ filterStore.indicatorFilters }
                    update={ selected => {filterStore.indicatorFilters = selected.map(s => s.value);} }
                />;
    })
);
export { LevelSelect, SiteSelect, TypeSelect, SectorSelect, IndicatorSelect };