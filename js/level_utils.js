
// Returns a trimmed level ontology for display purposes
export function trimOntology(ontologyStr) {
    let ontologyArray = ontologyStr.split(".");
    return ontologyArray.slice(1).filter(i => i > 0).join(".")
}


/*************  IMPORTANT!!!!!
 * Thee templates need to be in a .js file so the translation machinery picks them up and puts them into the
 * translated strings provided to the front-end.  If you make changes here, make sure to also make them
 * in the LevelTier model in indicators/models.py.  No need to duplicate the translator comments.
 */

const rf_templates = {'mc_standard': {
        // Translators: Name of the most commonly used organizational hierarchy of KPIs at Mercy Corps.
        'name': gettext('Mercy Corps'),
        'tiers': [
            gettext('Goal'),
            gettext('Outcome'),
            gettext('Output'),
            gettext('Activity')]},
    'dfid': {
        'name': gettext('Department for International Development (DFID)'),
        'tiers': [
            gettext('Impact'),
            gettext('Outcome'),
            gettext('Output'),
            gettext('Input')]},
    'ec': {
        'name': gettext('European Commission (EC)'),
        'tiers': [
            gettext('Overall Objective'),
            gettext('Specific Objective'),
            gettext('Purpose'),
            gettext('Result'),
            gettext('Activity')]},
    'usaid1': {
        'name': gettext('USAID 1'),
        'tiers': [
            gettext('Goal'),
            gettext('Purpose'),
            gettext('Sub-Purpose'),
            gettext('Output'),
            gettext('Input')]},
    'usaid2': {
        'name': gettext('USAID 2'),
        'tiers': [
            gettext('Strategic Objective'),
            gettext('Intermediate Result'),
            gettext('Sub-Intermediate Result'),
            gettext('Output'),
            gettext('Input')]},
    'usaid_ffp': {
        'name': gettext('USAID FFP'),
        'tiers': [
            gettext('Goal'),
            gettext('Purpose'),
            gettext('Sub-Purpose'),
            gettext('Intermediate Outcome'),
            gettext('Output')]},
}
