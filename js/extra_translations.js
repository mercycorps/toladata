

/*************  IMPORTANT!!!!!
 * This file is just to store strings that need to appear in the djangojs.po files but
 * whose values are stored in the database rather than the code.  If you are updating
 * this file, there is probably a corresponding Python file that needs to be updated.
 *
 * In order to be picked up by the makemessagesjs management command, this file must be
 * a .js file.
*/


/*
Note: if you updating globalDisaggregationTypes, you should probably be updating
indicators.models.DisaggregationType.GLOBAL_DISAGGREGATION_LABELS
 */
const globalDisaggregationTypes = [
    gettext("Sex and Age Disaggregated Data (SADD)"),
    gettext("Sectors Direct with double counting"),
    gettext("Sectors Indirect with double counting"),
    gettext("SADD (including unknown) with double counting"),
    gettext("SADD (including unknown) without double counting"),
    gettext("Actual without double counting"),
    gettext("Actual with double counting")
];
