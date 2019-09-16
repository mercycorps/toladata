/*
  Some nice helper functions to help with date parsing and localization

  In the future it may make sense to use moment.js, luxon, or date-fns,
  but for now, just get by with the native browser APIs and save some bytes.

  Confusingly, native Date() objects are actually date/time objects.

  Surprisingly, the Django i18n/l10n JS tools do not provide access to the language code
  of the current language in use.
 */

const languageCode = window.userLang; // set in base.html by Django

const n = "numeric",
    s = "short",
    l = "long",
    d2 = "2-digit";


const DATE_MED = {
    year: n,
    month: s,
    day: n
};


// Returns native Date()
export function dateFromISOString(isoDateStr) {
    return new Date(isoDateStr);  // modern browsers can just parse it
}

// "2017-01-01" -> Date with local timezone (not UTC)
// also lives in base.js (localDateFromISOStr)
export function localDateFromISOString(dateStr) {
    let dateInts = dateStr.split('-').map(function(x) {return parseInt(x)});
    return new Date(dateInts[0], dateInts[1]-1, dateInts[2]);
}



// Date() -> "Oct 2, 2018" (localized)
// JS equiv of the Django template filter:   |date:"MEDIUM_DATE_FORMAT"
export function mediumDateFormatStr(date) {
    return new Intl.DateTimeFormat(languageCode, DATE_MED).format(date);
}
