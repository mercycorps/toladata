// indicators.page.js -- page object for testing the top-level Program
// Indicators page
var util = require('../lib/testutil.js');

var parms = util.readConfig();
parms.baseurl += '/indicators/home/0/0/0';

/** Click the indicator data button for the specified indicator
 * @param {string} indicatorName - The name of the indicator
 * @returns Nothing
 */
function clickIndicatorDataButton(indicatorName) {
}

/** Click the delete button for the specified indicator
 * @param {string} indicatorName - The name of the indicator to delete
 * @returns Nothing
 */
function clickIndicatorDeleteButton(indicatorName) {
}

/** Click the indicator data button for the specified indicator
 * @param {string} indicatorName - The name of the indicator to edit
 * @returns Nothing
 */
function clickIndicatorEditButton(indicatorName) {
}

/** Click the Indicators dropdown button
 * @returns Nothing
 */
function clickIndicatorsDropdown() {
  browser.$('#dropdownIndicator').click();
}

/** Click the Indicator Type dropdown
 * @returns Nothing
 */
function clickIndicatorTypeDropdown() {
  browser.$('#dropdownIndicatorType').click();
}

// FIXME: Should this be a per-program method?
/** Click the New Indicator button for the current program
 * @param {string} - The name of the indicator
 * @returns Nothing
 */
function clickNewIndicatorButton() {
  browser.waitForVisible('=New Indicator', 1000);
  browser.$('=New Indicator').click();
}

/** Click the Programs dropdown
 * @returns Nothing
 */
function clickProgramsDropdown() {
  browser.$('#dropdownProgram').click();
}

/** Create a new basic indicator with the specified required values
 * @param {string} name - The new name for the indicator (defaults to "Temporary")
 * @param {string} unit - The unit of measurement for this target
 * @param {integer} lopTarget - The LoP target for this indicator
 * @param {integer|boolean} - Non-zero integer OR false if a baseline is not applicable
 * @param {string} frequency - One of the 8 pre-defined periodic intervals
 * @returns Nothing
 */
function createNewProgramIndicator(name, unit, lopTarget, baseline, frequency) {
  clickNewIndicatorButton();
  saveNewIndicator();
  setIndicatorName(name);
  setUnitOfMeasure(unit);
  setLoPTarget(lopTarget);
  setBaseline(baseline);
  setTargetFrequency(frequency);
  saveIndicatorChanges();
}

/** Get a list of the indicators in the Indicators dropdown
 * Returns {Array<string>} - returns an array of the text strings making up the
 * indicators dropdown menu
 */
function getIndicatorsList() {
  let list = browser.$('ul.dropdown-menu[aria-labelledby="dropdownIndicator"]');
  let listItems = list.$$('li>a');
  let indicators = new Array();
  for (let listItem of listItems) {
    indicators.push(listItem.getText());
  }
  return indicators;
}

/** Get a list of the indicator types in the Indicator Type dropdown
 * Returns {Array<string>} - returns an array of the text strings making up the
 * indicator types dropdown menu
 */
function getIndicatorTypeList() {
  let list = browser.$('ul.dropdown-menu[aria-labelledby="dropdownIndicatorType"]');
  let listItems = list.$$('li>a');
  let indicatorTypes = new Array();
  for (let listItem of listItems) {
    indicatorTypes.push(listItem.getText());
  }
  return indicatorTypes;
}

/** Get a list of the program names in the Programs dropdown
 * Returns {Array<string>} - returns an array of the text strings making up the
 * Programs dropdown menu
 */
function getProgramsList() {
  let list = browser.$('ul.dropdown-menu[aria-labelledby="dropdownProgram"]');
  let listItems = list.$$('li>a');
  let programs = new Array();
  for (let listItem of listItems) {
    programs.push(listItem.getText());
  }
  return programs;
}

/** Get a list of the program names in the main Program table
 * Returns {Array<string>} - returns an array of the text strings of the
 * program names in the programs table
 */
function getProgramsTable() {
  let rows = browser.$('div#toplevel_div').$$('div.panel-heading');
  let programs = new Array();
  for(let row of rows) {
    programs.push(row.$('h4').getText());
  }
  return programs;
}

/** Click the "Save changes" button on the Indicator edit screen
 * @returns Nothing
 */
function saveIndicatorChanges() {
  let saveChanges = $('input[value="Save changes"]');
  saveChanges.click();
}

/** Click the "save" button on the new indicator to save a new basic indicator
 * @returns Nothing
 */
function saveNewIndicator() {
  // Accept the default values
  let saveNew = $('form').$('input[value="save"]');
  saveNew.click();
}

/** Type a baseline value into the baseline text field on the Targets
 * tab unless the "Not applicable" check box has been checked
 * @param {integer|boolean} value - The integral value to be set or
 * "false" to ignore the baseline requirement
 * @returns Nothing
 */
function setBaseline(value = false) {
  if (value) {
    let targetsTab = browser.$('=Targets');
    targetsTab.click();
    let baseline = $('input#id_baseline');
    baseline.setValue(value);
  } else {
      browser.$('#id_baseline_na').click();
  }
}

/** Type an indicator name into the Name field on the Performance
 * tab of the indicator edit screen
 * @param {string} name - The new name for the indicator
 * @returns Nothing
 */
function setIndicatorName(name) {
  let perfTab = browser.$('=Performance');
  perfTab.click();
  let indName = $('input#id_name');
  indName.setValue(name);
}

/** Type LoP target value name into "Life of Program (LoP) target" text
 * field on the Targets tab of the indicator edit screen
 * @param {string} name - The new name for the indicator
 * @returns Nothing
 */
function setLoPTarget(value) {
  let targetsTab = browser.$('=Targets');
  targetsTab.click();
  let lopTarget = $('input#id_lop_target');
  lopTarget.setValue(value);
}

// FIXME: should not be hard-coding the value to select
/** Select the target frequency from the Target Frequency dropdown on the
 *  the Targets tab of the indicator edit screen
 * @param {string} value - The target frequency to select from the dropdown
 * @returns Nothing
 */
function setTargetFrequency(value) {
  let targetsTab = browser.$('=Targets');
  targetsTab.click();
  let targetFreq = $('select#id_target_frequency');
  targetFreq.selectByValue(1);
}

/** Type the unit of measure into the Unit of measure text field on
 * the Targets tab of the indicator edit screen
 * @param {string} unit - The new name for the indicator
 * @returns Nothing
 */
function setUnitOfMeasure(unit) {
  let targetsTab = browser.$('=Targets');
  targetsTab.click();
  let bucket = $('input#id_unit_of_measure');
  bucket.setValue('Buckets');
}

/** Open the specified page in the browser
 * @param {string} url - The URL to display in the browser; defaults
 * to the baseurl value from the config file
 * @returns Nothing
 */
function open(url = parms.baseurl) {
  browser.url(url);
}

// FIXME: This should be a property
/** Return the page title
 * @returns {string} - The title of the current page
 */
function pageName() {
  // On this page, the "title" is actually the <h2> caption
  return browser.$('h2').getText();
}

/** Select the specified program from the Programs dropdown
 * @param {string} program - The name of the program to select
 * from the Programs dropdown menu
 * @returns Nothing
 */
function selectProgram(program) {
  browser.$('#dropdownProgram').click();
  let items = browser.$('div.btn-group').$('ul.dropdown-menu').$$('li>a');
  for (let item of items) {
    if (program == item.getText()) {
      item.click();
      break;
    }
  }
}

exports.clickIndicatorDataButton = clickIndicatorDataButton;
exports.clickIndicatorDeleteButton = clickIndicatorDeleteButton;
exports.clickIndicatorEditButton = clickIndicatorEditButton;
exports.clickIndicatorsDropdown = clickIndicatorsDropdown;
exports.clickIndicatorTypeDropdown = clickIndicatorTypeDropdown;
exports.clickNewIndicatorButton = clickNewIndicatorButton;
exports.clickProgramsDropdown = clickProgramsDropdown;
exports.createNewProgramIndicator = createNewProgramIndicator;
exports.getIndicatorsList = getIndicatorsList;
exports.getIndicatorTypeList = getIndicatorTypeList;
exports.getProgramsList = getProgramsList;
exports.getProgramsTable = getProgramsTable;
exports.open = open;
exports.pageName = pageName;
exports.saveIndicatorChanges = saveIndicatorChanges;
exports.saveNewIndicator = saveNewIndicator;
exports.selectProgram = selectProgram;
exports.setIndicatorName = setIndicatorName;
exports.setUnitOfMeasure = setUnitOfMeasure;
exports.setLoPTarget = setLoPTarget;
exports.setBaseline = setBaseline;
exports.setTargetFrequency = setTargetFrequency;

/*
exports.clickSaveChangesButton = clickSaveChangesButton;
exports.clickPerformanceTab = clickPerformanceTab;
exports.clickTargetsTab = clickTargetsTab;
*/
