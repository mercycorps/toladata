import { observable, runInAction, reaction } from 'mobx';
import IPTTProgram from './ipttProgram';
import IPTTRouter from '../router';
import api from '../../../apiv2';

import { TVA, TIMEPERIODS, BLANK_OPTION, TIME_AWARE_FREQUENCIES, IRREGULAR_FREQUENCIES,
    TVA_FREQUENCY_LABELS, TIMEPERIODS_FREQUENCY_LABELS, GROUP_BY_LEVEL, GROUP_BY_CHAIN } from '../../../constants';


const getProgramsList = (
    programsList = []
) => observable.object({
    _allPrograms: new Map((programsList).filter(([pk, name, tvaCount]) => !isNaN(parseInt(pk)))
                          .map(([pk, name, tvaCount]) => [parseInt(pk), {pk: parseInt(pk), name: name, tvaCount: parseInt(tvaCount)}])),
    listPrograms() {
        return Array.from(this._allPrograms.values())
    },
    listTvaPrograms() {
        return this.listPrograms().filter(program => program.tvaCount > 0);
    },
    getProgram(programId) {
        return !isNaN(parseInt(programId)) ? this._allPrograms.get(parseInt(programId)) : null;
    },
    hasProgram(programId) {
        return !isNaN(parseInt(programId)) ? this._allPrograms.has(parseInt(programId)) : false;
    }
});


const getProgramsFilterData = (
    programData = {}
) => {
    let program = IPTTProgram(programData);
    return observable.object({
        _programs: new Map([[program.pk, program]]),
        getProgramFilterData(programId) {
            return this._programs.has(parseInt(programId)) ? this._programs.get(parseInt(programId)) : null;
        },
        loadProgramFilterData(programId) {
            if (!isNaN(parseInt(programId))) {
                return api.ipttFilterData(programId).then(data => IPTTProgram(data))
                    .then(program => {
                        runInAction(() => {
                            this._programs.set(program.pk, program);
                            return program;
                        });
                    });
            }
            return Promise.reject('invalid program Id');
        }
    });
}


export default (
    reactContext = {}
) => {
    const router = IPTTRouter();
    const filterStore = observable.object({
        _programsListStore: getProgramsList(reactContext.programs_list || []),
        _programFilterDataStore: getProgramsFilterData(reactContext.program_data),
        _router: router,
        _reportType: null,
        _selectedProgramId: null,
        _selectedFrequency: null,
        _start: null,
        _end: null,
        _mostRecentForce: null,
        _groupBy: GROUP_BY_CHAIN,
        _indicatorFilters: {},
        _hiddenColumns: [],
        _hiddenCategories: false,
        get isTVA() {
            return this._reportType === TVA;
        },
        get selectedProgramId() {
            return this._programsListStore.hasProgram(this._selectedProgramId) ? this._selectedProgramId : null;
        },
        /**
         * Method instead of setter because there are side effects (updating frequency/timeframe)
         */
        setProgramId(programId) {
            programId = parseInt(programId);
            if (isNaN(programId)) {
                this._selectedProgramId = null;
            }
            else if (programId !== this._selectedProgramId) {
                this.clearFilters();
                const frequency = this.selectedFrequency;
                const periods = {
                    mostRecent: this.mostRecentValue != '' ? this.mostRecentValue : null,
                    showAll: this.showAll,
                    start: this.startPeriodValue,
                    end: this.endPeriodValue
                };
                this._selectedProgramId = programId;
                return this.updateProgramFilterData().then(
                    () => {
                        this.setFrequency(frequency);
                        this.setPeriods(periods);
                    }
                );
            }
        },
        /**
         * Options throughout returns a [{value, label}] array to supply select options
         */
        get programOptions() {
            return (this.isTVA ? this._programsListStore.listTvaPrograms() :
                                this._programsListStore.listPrograms())
                        .map(program => ({value: program.pk, label: program.name}));
        },
        get selectedProgramOption() {
            let program = this._programsListStore.getProgram(this.selectedProgramId);
            return (program && program !== null) ? {value: program.pk, label: program.name} : BLANK_OPTION;
        },
        set selectedProgramOption(option) {
            this.setProgramId(option.value);
        },
        get programFilterData() {
            return this._programFilterDataStore.getProgramFilterData(this.selectedProgramId);
        },
        updateProgramFilterData() {
            return this._programFilterDataStore.loadProgramFilterData(this.selectedProgramId);
        },
        get _frequencyLabels() {
            return this.isTVA ? TVA_FREQUENCY_LABELS : TIMEPERIODS_FREQUENCY_LABELS;
        },
        get frequencyDisabled() {
            return this.selectedProgramId === null;
        },
        get frequencyOptions() {
            if (this.programFilterData) {
                return (this.isTVA ?
                        Array.from(this.programFilterData.frequencies).sort() : TIME_AWARE_FREQUENCIES
                    ).map(frequency => ({value: frequency, label: this._frequencyLabels[frequency]}));
            } return [BLANK_OPTION];
        },
        get selectedFrequency() {
            return (this.selectedProgramId && !isNaN(parseInt(this._selectedFrequency))) ? parseInt(this._selectedFrequency) : null;
        },
        /**
         * method instead of setter because of side effects (updating timeframe)
         */
        setFrequency(frequency) {
            frequency = parseInt(frequency);
            if (isNaN(frequency)) {
                this._selectedFrequency = null;
                return false;
            }
            if (this.isTVA && !this.programFilterData.frequencies.has(frequency)) {
                frequency = parseInt(Array.from(this.programFilterData.frequencies).sort()[0]);
            } else if (!this.isTVA && !TIME_AWARE_FREQUENCIES.includes(frequency)) {
                frequency = parseInt(TIME_AWARE_FREQUENCIES[0]);
            }
            if (frequency !== this._selectedFrequency) {
                const periods = {
                    mostRecent: this.mostRecentValue != '' ? this.mostRecentValue : null,
                    showAll: this.showAll,
                    start: this.startPeriodValue,
                    end: this.endPeriodValue
                };

                this._selectedFrequency = frequency;
                this.setPeriods(periods);
                return true;
            }
        },
        get selectedFrequencyOption() {
            return (this.programFilterData && this.selectedFrequency !== null) ?
                {value: this.selectedFrequency, label: this._frequencyLabels[this.selectedFrequency]} :
                BLANK_OPTION;
        },
        set selectedFrequencyOption(option) {
            this.setFrequency(option.value);
        },
        get periodsDisabled() {
            return !this.programFilterData || !TIME_AWARE_FREQUENCIES.includes(this.selectedFrequency);
        },
        get periodRange() {
            return this.periodsDisabled ?
                {years: [], options: [BLANK_OPTION]} :
                this.programFilterData.periodRanges.get(this.selectedFrequency);
        },
        get startOptions() {
            if (IRREGULAR_FREQUENCIES.includes(this.selectedFrequency)) {
                // select is disabled for irregular frequencies, display blank in disabled box
                return [BLANK_OPTION];
            }
            if (this.selectedFrequency == 3) {
                return this.periodRange.options;
            }
            let yearGroups = this.periodRange.years.map(
                year => ({label: year, options: this.periodRange.options.filter(periodRange => periodRange.year == year)})
            ).filter(yearGroup => yearGroup.options.length > 0)
            if (yearGroups.length == 0) {
                return [BLANK_OPTION];
            }
            if (yearGroups.length == 1) {
                return yearGroups[0].options;
            }
            return yearGroups;
        },
        get endOptions() {
            if (IRREGULAR_FREQUENCIES.includes(this.selectedFrequency)) {
                // select is disabled for irregular frequencies, display blank in disabled box
                return [BLANK_OPTION];
            }
            let options = this.periodRange.options.filter(periodOption => (!this.startPeriodValue || (periodOption.value >= this.startPeriodValue)));
            if (this.selectedFrequency == 3) {
                return options;
            }
            let yearGroups = this.periodRange.years.map(
                year => ({label: year, options: options.filter(periodRange => periodRange.year == year)})
            ).filter(yearGroup => yearGroup.options.length > 0);
            if (yearGroups.length == 0) {
                return [BLANK_OPTION];
            }
            if (yearGroups.length == 1) {
                return yearGroups[0].options;
            }
            return yearGroups;
        },
        get _lastPeriod() {
            return this.periodsDisabled ? null : this.programFilterData.periodRanges.get(this.selectedFrequency).periodCount - 1;
        },
        get _currentPeriod() {
            return this.periodsDisabled ? null : this.programFilterData.periodRanges.get(this.selectedFrequency).currentPeriod;
        },
        get mostRecentChecked() {
            return this.mostRecentValue !== '';
        },
        get mostRecentValue() {
            return (this.periodsDisabled || this.showAll || this.endPeriodValue !== this._currentPeriod) ? '' :
                    this.endPeriodValue - this.startPeriodValue + 1;
        },
        get showAll() {
            /* _mostRecentForce - for when the selected # of most recent periods is the same as
             * all periods, but the checkbox should say "most recent"
             */
            return (this.periodsDisabled || this._mostRecentForce) ? false :
                this.startPeriodValue === 0 && this._lastPeriod && this.endPeriodValue == this._lastPeriod;
        },
        set showAll(value) {
            this._mostRecentForce = false;
            this.startPeriodValue = 0;
            this.endPeriodValue = this._lastPeriod;
        },
        set mostRecentValue(value) {
            this.startPeriodValue = 0;
            this.endPeriodValue = this._currentPeriod;
            this.startPeriodValue = this.endPeriodValue - value + 1;
            if (this.showAll) {
                this._mostRecentForce = true;
                var self = this;
                const unForce = reaction(
                    () => [self.mostRecentChecked, self.startPeriodValue, self.endPeriodValue],
                    (checked, reaction) => {
                        self._mostRecentForce = false;
                        reaction.dispose();
                    }
                );
            }
        },
        get startPeriod() {
            if (this.programFilterData && IRREGULAR_FREQUENCIES.includes(this.selectedFrequency)) {
                return this.programFilterData.periodRanges.get(this.selectedFrequency).periods[0];
            }
            return (this.programFilterData && this.selectedFrequency && this._start !== null) ?
                        this.programFilterData.periodRanges.get(this.selectedFrequency).periods[this._start] :
                        null;
        },
        get startPeriodValue() {
            return this.periodsDisabled ? null : this._start;
        },
        set startPeriodValue(startPeriod) {
            startPeriod = !isNaN(parseInt(startPeriod)) ? parseInt(startPeriod) : 0;
            if (this._lastPeriod !== null) {
                this._start = Math.max(0, Math.min(this._lastPeriod, startPeriod));
            }
            if (this.endPeriodValue && this.startPeriodValue > this.endPeriodValue) {
                this.endPeriodValue = this.startPeriodValue;
            }
        },
        get endPeriod() {
            if (this.programFilterData && IRREGULAR_FREQUENCIES.includes(this.selectedFrequency)) {
                return this.programFilterData.periodRanges.get(this.selectedFrequency).periods.slice(-1).pop();
            }
            return (this.programFilterData && this.selectedFrequency && this._end !== null) ?
                        this.programFilterData.periodRanges.get(this.selectedFrequency).periods[this._end] :
                        null;
        },
        get endPeriodValue() {
            return this.periodsDisabled ? null : this._end;
        },
        set endPeriodValue(endPeriod) {
            endPeriod = !isNaN(parseInt(endPeriod)) ? parseInt(endPeriod) : this._lastPeriod;
            if (this._lastPeriod !== null) {
                this._end = Math.max((this.startPeriodValue || 0), Math.min(this._lastPeriod, endPeriod));
            }
        },
        setTimeframe({mostRecent = null, showAll = null} = {}) {
            if (mostRecent) {
                this.mostRecentValue = mostRecent;
            }
            if (showAll) {
                this.showAll = true;
            }
        },
        setPeriods({mostRecent = null, showAll = null, start = null, end = null}) {
            if (mostRecent) {
                this.mostRecentValue = mostRecent;
            }
            else if (showAll) {
                this.showAll = true;
            }
            else {
                this.startPeriodValue = start;
                this.endPeriodValue = end;
            }
        },
        get resultsFramework() {
            return this.programFilterData && this.programFilterData.resultsFramework;
        },
        get resultChainFilterLabel() {
            return this.programFilterData ? this.programFilterData.resultChainFilterLabel : null;
        },
        get groupBy() {
            return this.resultsFramework ? this._groupBy : null;
        },
        set groupBy(groupBy) {
            this._groupBy = parseInt(groupBy) === GROUP_BY_LEVEL ? GROUP_BY_LEVEL : GROUP_BY_CHAIN;
        },
        get allLevels() {
            return (this.resultsFramework ?
                    (this.groupBy === GROUP_BY_CHAIN) ?
                      this.programFilterData.levelsInChainOrder :
                      this.programFilterData.levelsInLevelOrder : []) || [];
        },
        get levels() {
            return this.allLevels;
        },
        get _levelOptions() {
            let levelPks = this.resultsFramework ?
                [...this.getAllIndicators('levels').map(indicator => indicator.levelPk),
                 ...this._indicatorFilters.levels] : [];
            return this.levels.filter(
                level => (level.isResultChainLevel && levelPks.includes(level.pk)))
            .map(
                level => ({value: level.pk, label: level.resultChainLabel, category: "level"})
            );
        },
        get _tierOptions() {
            let tierPks = this.resultsFramework ?
                [...this.getAllIndicators('levels')
                    .filter(indicator => indicator.levelPk)
                    .map(indicator => this.programFilterData.levels.get(indicator.levelPk).tierPk),
                    ...this._indicatorFilters.tiers] : [];
            return this.programFilterData ?
                (Array.from(this.programFilterData.tiers.values()) || [])
                .filter(tier => tierPks.includes(tier.pk))
                .map(tier => ({value: tier.pk, label: tier.name, category: "tier"})) : [];
        },
        get _oldLevelOptions() {
            let oldLevelPks = this.resultsFramework ? [] :
                [...this.getAllIndicators('levels').map(indicator => indicator.levelPk),
                 ...this._indicatorFilters.oldLevels];
            return this.programFilterData ?
                (Array.from(this.programFilterData.oldLevels.values()) || [])
                .filter(oldLevel => oldLevelPks.includes(oldLevel.pk))
                .map(oldLevel => ({value: oldLevel.pk, label: oldLevel.name, category: "oldLevel"})) :
            [BLANK_OPTION];
        },
        get levelTierOptions() {
            if (!this.programFilterData) {
                return [BLANK_OPTION];
            }
            if (this.programFilterData.resultsFramework) {
                let optGroups = [
                    {label: '', options: this._tierOptions},
                    {label: this.programFilterData.resultChainLabel, options: this._levelOptions}
                ].filter(optGroup => (optGroup.options && optGroup.options.length > 0));
                if (optGroups && optGroups.length > 0) {
                    return optGroups;
                }
                return [BLANK_OPTION];
            }
            return (this._oldLevelOptions && this._oldLevelOptions.length > 0) ? this._oldLevelOptions : [BLANK_OPTION];
        },
        get levelTierFilters() {
            return [
                ...this._tierOptions.filter(option => this._indicatorFilters.tiers.includes(option.value)),
                ...this._levelOptions.filter(option => this._indicatorFilters.levels.includes(option.value)),
                ...this._oldLevelOptions.filter(option => this._indicatorFilters.oldLevels.includes(option.value)),
            ];
        },
        set levelTierFilters({levels = [], tiers = [], oldLevels = []} = {}) {
            if (tiers.length > 0 && levels.length > 0) {
                if (this._indicatorFilters.levels.length > 0) {
                    levels = [];
                } else {
                    tiers = [];
                }
            }
            this._indicatorFilters.tiers = this.resultsFramework ? tiers : [];
            this._indicatorFilters.levels = this.resultsFramework ? levels : [];
            this._indicatorFilters.oldLevels = this.resultsFramework ? [] : oldLevels;
        },
        get sectorOptions() {
            let sectorPks = [...new Set(this.getAllIndicators('sectors')
                .filter(indicator => indicator.sectorPk)
                .map(indicator => indicator.sectorPk)),
            ...this._indicatorFilters.sectors];
            return this.programFilterData ?
                    Array.from(this.programFilterData.sectors.values())
                        .filter(sector => sectorPks.includes(sector.pk))
                        .map(sector => ({value: sector.pk, label: sector.name})) :
                    [BLANK_OPTION];
        },
        get sectorFilters() {
            return this.sectorOptions.filter(option => this._indicatorFilters.sectors.includes(option.value));
        },
        set sectorFilters(sectorFilterValues = []) {
            this._indicatorFilters.sectors = sectorFilterValues.map(v => parseInt(v));
        },
        get siteOptions() {
            let sitePks = [...new Set(this.getAllIndicators('sites').map(
                indicator => Array.from(indicator._sitePks.values())
            ).reduce((a, b) => a.concat(b), [])),
            ...this._indicatorFilters.sites];
            return this.programFilterData ?
                    Array.from(this.programFilterData.sites.values())
                        .filter(site => sitePks.includes(site.pk))
                        .map(site => ({value: site.pk, label: site.name})) :
                    [BLANK_OPTION];
        },
        get siteFilters() {
            return this.siteOptions.filter(option => this._indicatorFilters.sites.includes(option.value));
        },
        set siteFilters(siteFilterValues = []) {
            this._indicatorFilters.sites = siteFilterValues.map(v => parseInt(v));
        },
        get disaggregationOptions() {
            let disaggregationPks = [...new Set(this.getAllIndicators('disaggregations').map(
                indicator => Array.from(indicator._disaggregationPks.values())
            ).reduce((a, b) => a.concat(b), [])),
            ...this._indicatorFilters.disaggregations];
            if (!this.programFilterData) {
                return [BLANK_OPTION];
            }
            let disaggregationOptions = Array.from(this.programFilterData.disaggregations.values())
                                                .filter(disaggregation => disaggregationPks.includes(disaggregation.pk))
                                                .map(disaggregation => ({value: disaggregation.pk, label: gettext(disaggregation.name), country: disaggregation.country}));
            let countries = [...new Set(disaggregationOptions.map(option => option.country))].filter(country => country !== null).sort();
            let optgroups = [];
            optgroups.push({value: "hide-categories", label: gettext('Only show categories with results'), noList: true});
            if (disaggregationOptions.filter(option => option.country === null).length > 0) {
                optgroups.push({label: gettext('Global disaggregations'), options: disaggregationOptions.filter(option => option.country === null)});
            }
            countries.forEach(
                country => {
                    optgroups.push({label: `${country} ${gettext('Disaggregations')}`, options:disaggregationOptions.filter(option => option.country === country)});
                }
            );
            return optgroups;
        },
        get currentDisaggregations() {
            let disaggregationPks = (this._indicatorFilters.disaggregations && this._indicatorFilters.disaggregations.length > 0)
                ? this._indicatorFilters.disaggregations
                : [...new Set(this.getAllIndicators('disaggregations').map(
                        indicator => Array.from(indicator._disaggregationPks.values())
                    ).reduce((a, b) => a.concat(b), []))];
            return this.programFilterData ?
                Array.from(this.programFilterData.disaggregations.values())
                    .filter(disaggregation => disaggregationPks.includes(disaggregation.pk))
                    .sort((disagg_a, disagg_b) => (disagg_a.name > disagg_b.name) ? 1 : -1)
                    .map(disaggregation => disaggregation.pk) : []
        },
        get disaggregationFilters() {
            let disaggregationOptions = [].concat.apply([], this.disaggregationOptions.slice(1).map(optgroup => optgroup.options));
            disaggregationOptions = disaggregationOptions.filter(option => (option && option.value && this._indicatorFilters.disaggregations.includes(option.value)));
            if (this._hiddenCategories) {
                disaggregationOptions = [this.disaggregationOptions[0], ...disaggregationOptions];
            }
            return disaggregationOptions;
        },
        set disaggregationFilters(disaggregationFilterValues = []) {
            this._indicatorFilters.disaggregations = disaggregationFilterValues.filter(v => (v != 'hide-categories' && v != 'NaN' && !isNaN(parseInt(v)))).map(v => parseInt(v));
            this._hiddenCategories = disaggregationFilterValues.includes('hide-categories');
        },
        get indicatorTypeOptions() {
            let typePks = [...new Set(this.getAllIndicators('types').map(
                indicator => Array.from(indicator._typePks.values())
            ).reduce((a, b) => a.concat(b), [])),
            ...this._indicatorFilters.indicatorTypes];
            return this.programFilterData ?
                    Array.from(this.programFilterData.indicatorTypes.values())
                        .filter(indicatorType => typePks.includes(indicatorType.pk))
                        .map(indicatorType => ({value: indicatorType.pk, label: indicatorType.name})) :
                    [BLANK_OPTION];
        },
        get indicatorTypeFilters() {
            return this.indicatorTypeOptions.filter(option => this._indicatorFilters.indicatorTypes.includes(option.value));
        },
        set indicatorTypeFilters(indicatorTypeFilterValues = []) {
            this._indicatorFilters.indicatorTypes = indicatorTypeFilterValues.map(v => parseInt(v));
        },
        _filterFrequency(indicators) {
            indicators = indicators || [];
            if (this.isTVA) {
                indicators = indicators.filter(indicator => indicator.frequency == this.selectedFrequency);
            }
            return indicators;
        },
        _filterLevelTiers(indicators) {
            indicators = indicators || [];
            if (this.resultsFramework && this._indicatorFilters.tiers && this._indicatorFilters.tiers.length > 0) {
                indicators = indicators.filter(indicator => {
                    return (indicator.levelPk &&
                            this._indicatorFilters.tiers.some(
                                tierPk => this.programFilterData.levels.get(indicator.levelPk).showForTier(tierPk)));
                });
            }
            if (this.resultsFramework && this._indicatorFilters.levels && this._indicatorFilters.levels.length > 0) {
                indicators = indicators.filter(indicator => {
                    return (indicator.levelPk &&
                            this._indicatorFilters.levels.some(
                                levelPk => this.programFilterData.levels.get(indicator.levelPk).showForChain(levelPk)
                            ));
                });
            }
            if (!this.resultsFramework && this._indicatorFilters.oldLevels && this._indicatorFilters.oldLevels.length > 0) {
                indicators = indicators.filter(indicator => (indicator.levelPk && this._indicatorFilters.oldLevels.includes(indicator.levelPk)));
            }
            return indicators;
        },
        _filterSites(indicators) {
            if (this._indicatorFilters.sites && this._indicatorFilters.sites.length > 0) {
                indicators = indicators.filter(
                    indicator => this._indicatorFilters.sites.some(sitePk => indicator.hasSite(sitePk))
                );
            }
            return indicators;
        },
        _filterDisaggregations(indicators) {
            if (this._indicatorFilters.disaggregations && this._indicatorFilters.disaggregations.length > 0) {
                indicators = indicators.filter(
                    indicator => this._indicatorFilters.disaggregations.some(disaggregationPk => indicator.hasDisaggregation(disaggregationPk))
                );
            }
            return indicators;
        },
        _filterIndicatorTypes(indicators) {
            if (this._indicatorFilters.indicatorTypes && this._indicatorFilters.indicatorTypes.length > 0) {
                indicators = indicators.filter(
                    indicator => this._indicatorFilters.indicatorTypes.some(typePk => indicator.hasIndicatorType(typePk))
                );
            }
            return indicators;
        },
        _filterSectors(indicators) {
            if (this._indicatorFilters.sectors && this._indicatorFilters.sectors.length > 0) {
                indicators = indicators.filter(
                    indicator => (indicator.sectorPk && this._indicatorFilters.sectors.includes(indicator.sectorPk))
                );
            }
            return indicators;
        },
        _filterIndicatorFilter(indicators) {
            indicators = indicators || [];
            if (this._indicatorFilters.indicators && this._indicatorFilters.indicators.length > 0) {
                indicators = indicators.filter(indicator => this._indicatorFilters.indicators.includes(indicator.pk));
            }
            return indicators;
        },
        filterIndicators(indicators, skip=false) {
            indicators = indicators || [];
            indicators = this._filterFrequency(indicators);
            if (skip != 'levels') {
                indicators = this._filterLevelTiers(indicators);
            }
            if (skip != 'disaggregations') {
                indicators = this._filterDisaggregations(indicators);
            }
            if (skip != 'sites') {
                indicators = this._filterSites(indicators);
            }
            if (skip != 'types') {
                indicators = this._filterIndicatorTypes(indicators);
            }
            if (skip != 'sectors') {
                indicators = this._filterSectors(indicators);
            }
            if (skip != 'indicators') {
                indicators = this._filterIndicatorFilter(indicators);
            }
            return indicators;
        },
        getUnassignedIndicators(skip=false) {
            return this.filterIndicators(this.programFilterData.unassignedIndicators, skip);
        },
        getLevelIndicators(levelPk, skip=false) {
            return this.filterIndicators((this.programFilterData.levelIndicators.get(levelPk) || [])
                .map(
                    indicatorPk => this.programFilterData.indicators.get(indicatorPk)
                ), skip) || [];
        },
        getAllIndicators(skip=false) {
            if (this.programFilterData) {
                let indicators = this.groupBy === GROUP_BY_CHAIN ?
                            this.programFilterData.indicatorsInChainOrder :
                            this.programFilterData.indicatorsInLevelOrder;
                return this.filterIndicators(indicators, skip);
            }
            return [];
        },
        getLevelIndicatorGroups(skip=false) {
            if (this.resultsFramework) {
                return [...this.levels.map(
                    level => ({level: level, indicators: this.getLevelIndicators(level.pk, skip)})
                ), {level: null, indicators: this.getUnassignedIndicators(skip)}];
            }
            return (Array.from(this.programFilterData.oldLevels.values()) || [])
                    .map(oldLevel => ({level: oldLevel,
                                      indicators: this.getAllIndicators(skip)
                                                    .filter(indicator => indicator.levelPk == oldLevel.pk)
                                     }));
        },
        get indicatorOptions() {
            if (this.programFilterData) {
                let groups = this.getLevelIndicatorGroups('indicators');
                if (this.resultsFramework) {
                    groups = groups.map(
                        levelGroup => ({label: levelGroup.level ? levelGroup.level.tierNumber : gettext('Indicators unassigned to  a results framework level'),
                                        options: levelGroup.indicators.map(indicator => ({value: indicator.pk, label: indicator.name}))
                    }));
                } else {
                    groups = groups.map(
                        levelGroup => ({label: levelGroup.level.name,
                                        options: levelGroup.indicators.map(indicator => ({value: indicator.pk, label: indicator.name}))
                        }));
                }
                groups = groups.filter(
                    levelGroup => levelGroup.options && levelGroup.options.length > 0
                );
                if (groups.length === 0) {
                    return [BLANK_OPTION];
                } else if (groups.length === 1) {
                    return groups[0].options;
                }
                return groups;
            }
            return [BLANK_OPTION];
        },
        get indicatorFilters() {
            var options = this.indicatorOptions;
            if (!options || options.length == 0) {
                return [];
            }
            if (options[0].options && options[0].options.length > 0) {
                options = options.reduce((acc, optGroup) => [...acc, ...optGroup.options], []);
            }
            return options.filter(option => this._indicatorFilters.indicators.includes(option.value));
        },
        set indicatorFilters(indicatorFilterValues = []) {
            this._indicatorFilters.indicators = indicatorFilterValues.map(v => parseInt(v));
        },
        clearFilters() {
            this._indicatorFilters = {
                levels: [],
                tiers: [],
                oldLevels: [],
                disaggregations: [],
                sectors: [],
                sites: [],
                indicatorTypes: [],
                indicators: []
            };
        },
        get filtersActive() {
            return Object.values(this._indicatorFilters).reduce((a, b) => a + b.length, 0) > 0;
        },
        get hideColumnOptions() {
            return [
                {label: gettext('Unit of measure'), value: 0},
                {label: gettext('Change'), value: 1},
                {label: gettext('C / NC'), value: 2},
                {label: '# / %', value: 3},
                {label: gettext('Baseline'), value: 4}
            ];
        },
        get hiddenColumns() {
            return this.hideColumnOptions.filter(option => this._hiddenColumns.includes(option.value));
        },
        set hiddenColumns(hiddenColumnOptions = []) {
            this._hiddenColumns = hiddenColumnOptions.map(v => parseInt(v));
        },
        get pathParams() {
            let params = {
                tva: this.isTVA,
                programId: this.selectedProgramId,
                frequency: this.selectedFrequency,
                start: this.startPeriodValue,
                end: this.endPeriodValue,
                mr: this._mostRecentForce ? 1 : null,
                groupby: this.groupBy,
                levels: (this.resultsFramework ?
                            this.levelTierFilters.filter(f => f.category == "level") :
                            this.levelTierFilters.filter(f => f.category == "oldLevel")
                        ).map(f => f.value),
                tiers: this.resultsFramework ? this.levelTierFilters.filter(f => f.category == "tier").map(f => f.value) : null,
                sectors: this.sectorFilters.map(f => f.value),
                sites: this.siteFilters.map(f => f.value),
                types: this.indicatorTypeFilters.map(f => f.value),
                indicators: this.indicatorFilters.map(f => f.value),
                disaggregations: this.disaggregationFilters.map(f => f.value),
                columns: this.hiddenColumns.map(f => f.value),
            };
            Object.keys(params).forEach(
                key => (params[key] === null) && delete params[key]
            );
            return params;
        },
        updateParams(params) {
            if (params.programId) {
                this._router.updateParams(params);
            }
        },
        get queryString() {
            let {tva, programId, ...params} = this.pathParams;
            return Object.entries(params).filter(
                ([key, value]) => (value === 0 || value) && (!Array.isArray(value) || value.length > 0)
            ).map(
                ([key, value]) => (!Array.isArray(value) ?
                    `${key}=${value}` : value.map(v => `${key}=${v}`).join('&')
                )
            ).reduce((a, b) => a.concat(b), []).join('&');
        },
        get excelUrl() {
            return this.selectedFrequency ? this._router.getExcelUrl(this.pathParams) : false;
        },
        get fullExcelUrl() {
            return this.selectedProgramId ? this._router.getFullExcelUrl(this.pathParams) : false;
        },
    });
    filterStore._reportType = filterStore._router.isTVA ? TVA : TIMEPERIODS;
    filterStore._selectedProgramId = filterStore._router.programId;
    filterStore._selectedFrequency = filterStore._router.frequency;
    if (filterStore._router.timeframe) {
        filterStore.setTimeframe(filterStore._router.timeframe);
    } else {
        filterStore.startPeriodValue = filterStore._router.start;
        filterStore.endPeriodValue = filterStore._router.end;
    }
    filterStore._mostRecentForce = filterStore._router.mr;
    filterStore.groupBy = filterStore._router.groupBy;
    filterStore.sectorFilters = filterStore._router.sectors;
    filterStore.siteFilters = filterStore._router.sites;
    filterStore.disaggregationFilters = filterStore._router.disaggregations;
    filterStore.indicatorTypeFilters = filterStore._router.types;
    filterStore.indicatorFilters = filterStore._router.indicators;
    filterStore._hiddenColumns = filterStore._router.columns;
    filterStore._hiddenCategories = filterStore._router.hiddenCategories;
    filterStore.levelTierFilters = {
        levels: filterStore._router.levels,
        tiers: filterStore._router.tiers,
        oldLevels: filterStore._router.levels,
    };
    const _updateRouter = reaction(
        () => filterStore.pathParams,
        params => filterStore.updateParams(params),
        {fireImmediately: true}
    );
    return filterStore;
}
