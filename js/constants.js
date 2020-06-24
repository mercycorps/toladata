function getGlobal(key) {
    if ((typeof JS_GLOBALS !== 'undefined')  && JS_GLOBALS.hasOwnProperty(key)) {
        return JS_GLOBALS[key];
    }
    return null;
}


/**
 * IPTT Constants:
 */
const BLANK_LABEL = '---------';
const BLANK_OPTION = {
    value: null,
    label: BLANK_LABEL
};
const BLANK_TABLE_CELL = '—';


const TVA = 1;
const TIMEPERIODS = 2;

const TIME_AWARE_FREQUENCIES = [3, 4, 5, 6, 7];
const IRREGULAR_FREQUENCIES = [1, 2];

const TVA_FREQUENCY_LABELS = Object.freeze(
    {
        1: gettext("Life of Program (LoP) only"),
        2: gettext("Midline and endline"),
        3: gettext("Annual"),
        4: gettext("Semi-annual"),
        5: gettext("Tri-annual"),
        6: gettext("Quarterly"),
        7: gettext("Monthly")
    }
);

const TIMEPERIODS_FREQUENCY_LABELS = Object.freeze(
    {
        3: gettext("Years"),
        4: gettext("Semi-annual periods"),
        5: gettext("Tri-annual periods"),
        6: gettext("Quarters"),
        7: gettext("Months")
    }
);

export { BLANK_OPTION, BLANK_LABEL, BLANK_TABLE_CELL, TVA, TIMEPERIODS, TIME_AWARE_FREQUENCIES,
         IRREGULAR_FREQUENCIES, TVA_FREQUENCY_LABELS, TIMEPERIODS_FREQUENCY_LABELS };

const GROUP_BY_CHAIN = 1;
const GROUP_BY_LEVEL = 2;

export { GROUP_BY_CHAIN, GROUP_BY_LEVEL };

const _gettext = (typeof gettext !== 'undefined') ?  gettext : (s) => s;

function getPeriodLabels() {
    return {
        targetperiodLabels: {
            1: _gettext("Life of Program (LoP) only"),
            3: _gettext("Annual"),
            2: _gettext("Midline and endline"),
            5: _gettext("Tri-annual"),
            4: _gettext("Semi-annual"),
            7: _gettext("Monthly"),
            6: _gettext("Quarterly")
        },
        timeperiodLabels: {
            3: _gettext("Years"),
            5: _gettext("Tri-annual periods"),
            4: _gettext("Semi-annual periods"),
            7: _gettext("Months"),
            6: _gettext("Quarters")
        }
    };
}

export {getPeriodLabels};

export const STATUS_CODES = {
    NO_INDICATOR_IN_UPDATE: 1
};

export const IndicatorFilterType = Object.freeze({
    noFilter: 0,
    missingTarget: 1,
    missingResults: 2,
    missingEvidence: 3,

    aboveTarget: 5,
    belowTarget: 6,
    onTarget: 7,
    nonReporting: 8
});

export const RFC_OPTIONS = getGlobal('reason_for_change_options') ?? [];