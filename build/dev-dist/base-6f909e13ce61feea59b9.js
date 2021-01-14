(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["base"],{

/***/ "4a4Y":
/*!******************************************!*\
  !*** ./js/components/changesetNotice.js ***!
  \******************************************/
/*! exports provided: create_unified_changeset_notice, testables */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "create_unified_changeset_notice", function() { return create_unified_changeset_notice; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "testables", function() { return testables; });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "v38i");
 //import PNotify from 'pnotify/dist/es/PNotify.js'; // needed for jest teseting, leaving in for future testing attempts
//import 'pnotify/dist/es/PNotifyCallbacks.js';
//import 'pnotify/dist/es/PNotifyButtons.js';

var create_rfc_dropdown = function create_rfc_dropdown() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$custom_rfc_optio = _ref.custom_rfc_options,
      custom_rfc_options = _ref$custom_rfc_optio === void 0 ? null : _ref$custom_rfc_optio;

  var options = custom_rfc_options || _constants__WEBPACK_IMPORTED_MODULE_0__["RFC_OPTIONS"];

  if (!options) {
    return '';
  }

  var rfc_section = document.createElement('section');
  rfc_section.classList.add('pnotify__reason-for-change');
  var form_div = document.createElement('div');
  form_div.classList.add('form-group');
  var label = document.createElement('label'); // # Translators: This is a label for a dropdown that presents several possible justifications for changing a value

  label.appendChild(document.createTextNode(gettext('Reason for change')));
  label.htmlFor = 'reasons_for_change_select';
  form_div.appendChild(label);
  var select = document.createElement('select');
  select.name = 'reasons_for_change';
  select.id = 'reasons_for_change_select';
  select.setAttribute('multiple', '');
  select.classList.add('form-control');

  for (var i = 0; i < options.length; i++) {
    var optionElement = document.createElement('option');
    optionElement.value = options[i].value;
    optionElement.label = options[i].label;
    optionElement.text = options[i].label;

    if (i == options.length - 1) {
      var divider = document.createElement('option');
      divider.setAttribute('data-role', 'divider');
      select.appendChild(divider);
    }

    select.appendChild(optionElement);
  }

  form_div.appendChild(select);
  rfc_section.appendChild(form_div);
  return rfc_section;
};
/*
* Consider using this notification function rather than the more specific ones above.  It should be able to
* everything they can do. The configurable parameters are for the 4 sections of the notification and
* for other visual and functional elements. Leave any of these null or false to omit them.
* There is NO DEFAULT TEXT. You must explicitly provide text to text elements.
*/


var create_unified_changeset_notice = function create_unified_changeset_notice() {
  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref2$header = _ref2.header,
      header = _ref2$header === void 0 ? null : _ref2$header,
      _ref2$show_icon = _ref2.show_icon,
      show_icon = _ref2$show_icon === void 0 ? true : _ref2$show_icon,
      _ref2$message_text = _ref2.message_text,
      message_text = _ref2$message_text === void 0 ? null : _ref2$message_text,
      _ref2$preamble = _ref2.preamble,
      preamble = _ref2$preamble === void 0 ? null : _ref2$preamble,
      _ref2$on_submit = _ref2.on_submit,
      on_submit = _ref2$on_submit === void 0 ? function () {} : _ref2$on_submit,
      _ref2$on_cancel = _ref2.on_cancel,
      on_cancel = _ref2$on_cancel === void 0 ? function () {} : _ref2$on_cancel,
      _ref2$rfc_required = _ref2.rfc_required,
      rfc_required = _ref2$rfc_required === void 0 ? true : _ref2$rfc_required,
      _ref2$rfc_options = _ref2.rfc_options,
      rfc_options = _ref2$rfc_options === void 0 ? null : _ref2$rfc_options,
      _ref2$rationale_requi = _ref2.rationale_required,
      rationale_required = _ref2$rationale_requi === void 0 ? true : _ref2$rationale_requi,
      _ref2$include_rationa = _ref2.include_rationale,
      include_rationale = _ref2$include_rationa === void 0 ? false : _ref2$include_rationa,
      _ref2$validation_type = _ref2.validation_type,
      validation_type = _ref2$validation_type === void 0 ? 0 : _ref2$validation_type,
      _ref2$showCloser = _ref2.showCloser,
      showCloser = _ref2$showCloser === void 0 ? true : _ref2$showCloser,
      _ref2$confirm_text = _ref2.confirm_text,
      confirm_text = _ref2$confirm_text === void 0 ? gettext('Ok') : _ref2$confirm_text,
      _ref2$cancel_text = _ref2.cancel_text,
      cancel_text = _ref2$cancel_text === void 0 ? gettext('Cancel') : _ref2$cancel_text,
      _ref2$context = _ref2.context,
      context = _ref2$context === void 0 ? null : _ref2$context,
      _ref2$notice_type = _ref2.notice_type,
      notice_type = _ref2$notice_type === void 0 ? 'notice' : _ref2$notice_type,
      _ref2$blocking = _ref2.blocking,
      blocking = _ref2$blocking === void 0 ? true : _ref2$blocking,
      _ref2$self_dismissing = _ref2.self_dismissing,
      self_dismissing = _ref2$self_dismissing === void 0 ? false : _ref2$self_dismissing,
      _ref2$dismiss_delay = _ref2.dismiss_delay,
      dismiss_delay = _ref2$dismiss_delay === void 0 ? 8000 : _ref2$dismiss_delay;

  var header_icons = {
    'error': 'fa-exclamation-triangle',
    'info': 'fa-info-circle',
    'success': 'fa-check-circle',
    'notice': 'fa-exclamation-triangle'
  };
  var color_classes = {
    'error': 'danger',
    'info': 'info',
    'success': 'success',
    'notice': 'primary'
  };
  var icon = '';

  if (show_icon) {
    icon = "<i class=\"fas ".concat(header_icons[notice_type], "\"></i>");
  }

  var header_section = header || icon ? "<header class=\"pnotify__header\">\n            <h4>\n                ".concat(icon, "\n                ").concat(header ? header : '', "\n            </h4>\n        </header>") : '';
  var preamble_section = !preamble ? '' : "<section class=\"pnotify__preamble\">\n            <p><b>".concat(preamble, "</b></p>\n        </section>");
  var message_section = !message_text ? '' : "<section class=\"pnotify__message\">\n            <p>".concat(message_text, "</p>\n        </section>");
  var rfc_section = '';

  if (rfc_options !== null) {
    var custom_rfc_options = rfc_options === true ? null : rfc_options;
    rfc_section = create_rfc_dropdown({
      custom_rfc_options: custom_rfc_options
    }).outerHTML;
  } // # Translators: This is the label for a textbox where a user can provide details about their reason for selecting a particular option


  var rationale_label = rfc_section.length > 0 ? "<label>".concat(gettext("Details"), "</label>") : '';
  var rationale_section = !include_rationale ? '' : "<section class=\"pnotify__rationale\">\n            <div class=\"form-group\">\n                ".concat(rationale_label, "\n                <textarea class=\"form-control\" name=\"rationale\" />\n            </div>\n        </section>");
  var inner = "\n        ".concat(header_section, "\n        ").concat(preamble_section, "\n        ").concat(message_section, "\n        ").concat(rfc_section, "\n        ").concat(rationale_section, "\n    "); // IMPORTANT TODO
  // **************
  // Following code cribs from create_changeset_notice
  // I left create_changeset_notice untouched to avoid lots of regressions
  // I think we should deprecate create_changeset_notice entirely

  var confirm_button = {
    text: confirm_text,
    primary: true,
    addClass: 'btn-sm btn-' + color_classes[notice_type],
    click: function click(notice) {
      var close = true;
      var textarea = $(notice.refs.elem).find('textarea[name="rationale"]');
      textarea.parent().find('.invalid-feedback').remove();
      var rationale = textarea.val() ? textarea.val().trim() : undefined; // trim whitespace to disallow whitespace-only submission

      var rfc_select = $(notice.refs.elem).find('select[name="reasons_for_change"]');
      var reasons_for_change = (rfc_select.val() || []).map(function (v) {
        return parseInt(v);
      });
      var is_valid = false;

      switch (validation_type) {
        case 1:
          // Uses RFC dropdown logic (either a rationale or a non-Other reason for change required):
          is_valid = rationale || reasons_for_change.length > 0 && reasons_for_change.indexOf(1) == -1;
          break;

        case 0:
        default:
          // Either a rationale is submitted, or there was no rationale form, or it was optional:
          is_valid = (rationale || !include_rationale || !rationale_required) && ( // Either one or more reasons for change or there were no options or they weren't required:
          reasons_for_change.length > 0 || !rfc_options || !rfc_required);
      }

      if (is_valid) {
        textarea.removeClass('is-invalid');
      } else {
        textarea.addClass('is-invalid');
        textarea.parent().append('<div class="invalid-feedback">' + gettext('A reason is required.') + '</div>');
        return false;
      }

      if (on_submit) {
        close = on_submit(rationale, reasons_for_change, validation_type);

        if (close === undefined) {
          close = true;
        }
      }

      if (close) {
        document.getElementById('notification_blocking_div').style.display = 'none';
        notice.close();
      }
    }
  };
  var cancel_button = {
    text: cancel_text,
    addClass: 'btn-sm',
    click: function click(notice) {
      close = on_cancel();

      if (close === undefined) {
        close = true;
      }

      if (close) {
        document.getElementById('notification_blocking_div').style.display = 'none';
        notice.close();
      }
    }
  };
  var changeset_buttons = [];

  if (confirm_text) {
    changeset_buttons.push(confirm_button);
  }

  if (cancel_text) {
    changeset_buttons.push(cancel_button);
  }

  var notice = PNotify.alert({
    text: $("<div><form action=\"\" method=\"post\" class=\"form\">".concat(inner, "</form></div>")).html(),
    textTrusted: true,
    icon: false,
    width: '350px',
    hide: self_dismissing,
    delay: dismiss_delay,
    type: notice_type,
    addClass: 'program-page__rationale-form',
    stack: {
      'overlayClose': true,
      'dir1': 'right',
      'dir2': 'up',
      'firstpos1': 20,
      'firstpos2': 20,
      'context': context
    },
    modules: {
      Buttons: {
        closer: showCloser,
        closerHover: false,
        sticker: false
      },
      Confirm: {
        align: 'flex-start',
        confirm: true,
        buttons: changeset_buttons
      }
    }
  });
  $('.pnotify__reason-for-change select').multiselect({
    numberDisplayed: 1,
    // # Translators: (preceded by a number) e.g. "4 options selected"
    nSelectedText: " ".concat(gettext('selected')),
    // # Translators: for a dropdown menu with no options checked:
    nonSelectedText: gettext('None selected')
  });

  if (on_cancel) {
    notice.on('click', function (e) {
      if ($(e.target).is('.ui-pnotify-closer *')) {
        var _close = on_cancel();

        if (_close || _close === undefined) {
          document.getElementById('notification_blocking_div').style.display = 'none';
          notice.close();
        }
      }
    });
  } // END CRIBBED CODE

};


var testables = {
  create_rfc_dropdown: create_rfc_dropdown
};

/***/ }),

/***/ "RdLr":
/*!************************!*\
  !*** ./scss/tola.scss ***!
  \************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "WtQ/":
/*!*********************************!*\
  !*** ./js/general_utilities.js ***!
  \*********************************/
/*! exports provided: flattenArray, ensureNumericArray, reloadPageIfCached, indicatorManualNumberSort, localizeNumber, localizePercent, sortObjectListByValue */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "flattenArray", function() { return flattenArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ensureNumericArray", function() { return ensureNumericArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "reloadPageIfCached", function() { return reloadPageIfCached; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "indicatorManualNumberSort", function() { return indicatorManualNumberSort; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "localizeNumber", function() { return localizeNumber; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "localizePercent", function() { return localizePercent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sortObjectListByValue", function() { return sortObjectListByValue; });
var SPANISH = 'es';
var FRENCH = 'fr';
var ENGLISH = 'en';

function flattenArray(arr) {
  var depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

  if (depth == 5) {
    return arr;
  }

  var flattened = [];
  arr.forEach(function (item) {
    if (Array.isArray(item)) {
      flattened = flattened.concat(flattenArray(item, depth + 1));
    } else {
      flattened.push(item);
    }
  });
  return flattened;
}

function ensureNumericArray(value) {
  if (!Array.isArray(value)) {
    value = parseInt(value);

    if (value && !isNaN(value)) {
      return [value];
    }

    return false;
  }

  var arr = value.map(function (x) {
    return parseInt(x);
  }).filter(function (x) {
    return !isNaN(x);
  });

  if (arr && Array.isArray(arr) && arr.length > 0) {
    return arr;
  }

  return false;
}
/*
 * Are we loading a cached page? If so, reload to avoid displaying stale indicator data
 * See ticket #1423
 */


function reloadPageIfCached() {
  // moving the cache check to after page load as firefox calculates transfer size at the end
  $(function () {
    var isCached = window.performance.getEntriesByType("navigation")[0].transferSize === 0; //adding a second check to ensure that if for whatever reason teh transfersize reads wrong, we don't reload on
    //a reload:

    var isReload = window.performance.getEntriesByType("navigation")[0].type === "reload";

    if (isCached && !isReload) {
      window.location.reload();
    }
  });
}

var indicatorManualNumberSort = function indicatorManualNumberSort(levelFunc, numberFunc) {
  return function (indicatorA, indicatorB) {
    var levelA = levelFunc(indicatorA);
    var levelB = levelFunc(indicatorB);

    if (levelA && !levelB) {
      return 1;
    }

    if (levelB && !levelA) {
      return -1;
    }

    if (levelA != levelB) {
      return parseInt(levelA) - parseInt(levelB);
    }

    var numberA = (numberFunc(indicatorA) || '').split('.');
    var numberB = (numberFunc(indicatorB) || '').split('.');

    for (var i = 0; i < Math.max(numberA.length, numberB.length); i++) {
      if (numberA[i] && numberB[i]) {
        for (var j = 0; j < Math.max(numberA[i].length, numberB[i].length); j++) {
          if (numberA[i][j] && numberB[i][j]) {
            if (numberA[i].charCodeAt(j) != numberB[i].charCodeAt(j)) {
              return numberA[i].charCodeAt(j) - numberB[i].charCodeAt(j);
            }
          } else if (numberA[i][j]) {
            return 1;
          } else if (numberB[i][j]) {
            return -1;
          }
        }
      } else if (numberA[i]) {
        return 1;
      } else if (numberB[i]) {
        return -1;
      }
    }

    return 0;
  };
};

var localizeNumber = function localizeNumber(val) {
  if (val === undefined || val === null || isNaN(parseFloat(val))) {
    return null;
  }

  var intPart = val.toString();
  var floatPart = null;

  if (val.toString().includes(",")) {
    intPart = val.toString().split(",")[0];
    floatPart = val.toString().split(",").length > 1 ? val.toString().split(",")[1] : null;
  } else if (val.toString().includes(".")) {
    intPart = val.toString().split(".")[0];
    floatPart = val.toString().split(".").length > 1 ? val.toString().split(".")[1] : null;
  }

  floatPart = floatPart && floatPart.length > 0 ? floatPart : null;
  var displayValue;

  switch (window.userLang) {
    case SPANISH:
      displayValue = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

      if (floatPart) {
        displayValue += ",".concat(floatPart);
      }

      break;

    case FRENCH:
      displayValue = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, String.fromCharCode(160)); //nbsp

      if (floatPart) {
        displayValue += ",".concat(floatPart);
      }

      break;

    case ENGLISH:
    default:
      displayValue = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      if (floatPart) {
        displayValue += ".".concat(floatPart);
      }

      break;
  }

  return displayValue;
};

var localizePercent = function localizePercent(val) {
  if (val === undefined || val === null || isNaN(parseFloat(val))) {
    return null;
  }

  var percent = localizeNumber(Math.round(val * 10000) / 100);
  return percent === null ? null : "".concat(percent, "%");
};

var sortObjectListByValue = function sortObjectListByValue(objects) {
  var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'label';
  return objects.sort(function (a, b) {
    return a[key].toUpperCase() > b[key].toUpperCase() ? 1 : -1;
  });
};



/***/ }),

/***/ "YqHn":
/*!********************!*\
  !*** ./js/base.js ***!
  \********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_polyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/polyfill */ "55Il");
/* harmony import */ var _babel_polyfill__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_polyfill__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _scss_tola_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../scss/tola.scss */ "RdLr");
/* harmony import */ var react_virtualized_styles_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-virtualized/styles.css */ "Rkej");
/* harmony import */ var components_changesetNotice_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! components/changesetNotice.js */ "4a4Y");
/* harmony import */ var general_utilities__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! general_utilities */ "WtQ/");
// Run the app's SCSS through webpack



/*
 * Moved legacy app.js code here - Contains global functions called by template code
 * along with global setup to be performed on every page
 *
 * If you decide to add a new function to this grab bag, and want to call it from Django
 * template code, make sure to add it to the `window` obj to make it globally accessible
 */

/*
 * Global AJAX handlers for CSRF handling and redirection on logout for AJAX requests
 */

function getCookie(name) {
  var cookieValue = null;

  if (document.cookie && document.cookie != '') {
    var cookies = document.cookie.split(';');

    for (var i = 0; i < cookies.length; i++) {
      var cookie = jQuery.trim(cookies[i]); // Does this cookie string begin with the name we want?

      if (cookie.substring(0, name.length + 1) == name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }

  return cookieValue;
}

function csrfSafeMethod(method) {
  // these HTTP methods do not require CSRF protection
  return /^(GET|HEAD|OPTIONS|TRACE)$/.test(method);
}

function redirectToLoginOnLoginScreenHeader(jqxhr) {
  if (jqxhr.getResponseHeader("Login-Screen") != null && jqxhr.getResponseHeader("Login-Screen").length) {
    // Not logged in - the 302 redirect is implicit and jQuery has no way to know it happened
    // check special header set by our login view to see if that's where we ended up
    window.location = js_context.loginUrl;
  }
}
/*
 * Set the csrf header before sending the actual ajax request
 * while protecting csrf token from being sent to other domains
 *
 * Attach to success/error here instead of ajaxSuccess()/ajaxError() below
 * as these take priority and will not fail to run if an exception is
 * thrown in the app code handler
 */


$.ajaxSetup({
  crossDomain: false,
  // obviates need for sameOrigin test
  beforeSend: function beforeSend(xhr, settings) {
    if (!csrfSafeMethod(settings.type)) {
      xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
    }
  },
  success: function success(data, status, jqxhr) {
    redirectToLoginOnLoginScreenHeader(jqxhr);
  },
  error: function error(jqxhr) {
    redirectToLoginOnLoginScreenHeader(jqxhr);
  }
});
/*
 * Global AJAX handlers for indicating a request in progress + error reporting
 */

$(document).ajaxStart(function () {
  $('#ajaxloading').show();
}).ajaxStop(function () {
  $('#ajaxloading').hide();
}).ajaxError(function (event, jqxhr, settings, thrownError) {
  if (settings.suppressErrors === true) {//do nothing
  } else {
    if (jqxhr.readyState === 4) {
      // HTTP error (can be checked by XMLHttpRequest.status and XMLHttpRequest.statusText)
      // TODO: Give better error mssages based on HTTP status code
      var errorStr = "".concat(jqxhr.status, ": ").concat(jqxhr.statusText);

      if (jqxhr.status === 403) {
        // Permission denied
        notifyError(js_context.strings.permissionError, js_context.strings.permissionErrorDescription);
      } else {
        // all other errors
        notifyError(js_context.strings.serverError, errorStr);
      }
    } else if (jqxhr.readyState === 0) {
      // Network error (i.e. connection refused, access denied due to CORS, etc.)
      notifyError(js_context.strings.networkError, js_context.strings.networkErrorTryAgain);
    } else {
      // something weird is happening
      notifyError(js_context.strings.unknownNetworkError, jqxhr.statusText);
    }
  }
});

if (!Date.prototype.toISODate) {
  Date.prototype.toISODate = function () {
    return this.getFullYear() + '-' + ('0' + (this.getMonth() + 1)).slice(-2) + '-' + ('0' + this.getDate()).slice(-2);
  };
}

function zeroPad(n, width) {
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(0) + n;
}

function isDate(dateVal) {
  /*
  var pattern = /^(\d{4})-(\d{2})-(\d{2})$/;
  var dateArray = dateVal.match(pattern);
  if (dateArray == null) return false;
   var currentYear = (new Date).getFullYear();
  var year = dateArray[1];
  var month = dateArray[2];
  var day = dateArray[3];
  if (year < 2010 || year > (currentYear+3)) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  return new Date(dateVal) === 'Invalid Date' ? false : true;
  */
  var date = new Date(dateVal);

  if (date == 'Invalid Date') {
    return false;
  }

  var currentYear = new Date().getFullYear();

  if (date.getFullYear() > currentYear + 100 || date.getFullYear() < 1980) {
    return false;
  }

  return true;
}

window.isDate = isDate;

function formatDate(dateString) {
  var day = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  // Returns an ISO formatted naive datestring
  // Use only to sanitize simplified date strings e.g. for hidden fields or data attributes
  // If you’re trying to format a date[string] for user display, you probably want something else
  if (dateString == null || dateString == undefined || dateString.length == 0 || dateString == 'undefined' || dateString == 'null') {
    return '';
  }

  try {
    var dateval = new Date(dateString);
    var tz = dateval.getTimezoneOffset();
    var hrs = dateval.getHours();

    if (hrs > 0) {
      // alert("offsetting timezone tz=" + tz + " hrs = " + hrs);
      dateval.setMinutes(dateval.getMinutes() + tz);
    }

    var year = dateval.getFullYear();
    var month = zeroPad(dateval.getMonth() + 1, 2);
    var paddedDay = zeroPad(day == 0 ? dateval.getDate() : day, 2);
    var ret = year + '-' + month + '-' + paddedDay;
    return ret;
  } catch (err) {
    console.log(err);

    try {
      var dateArray = dateString.split('-');
      var year = dateArray[0];
      var month = zeroPad(parseInt(dateArray[1]), 2);
      var paddedDay = zeroPad(day == 0 ? dateArray[2] : day, 2);
      var ret = year + '-' + month + '-' + paddedDay;
      return ret;
    } catch (err) {
      return dateString == (null ? undefined : dateString);
    }
  }
}

window.formatDate = formatDate; // "2017-01-01" -> Date with local timezone (not UTC)

function localDateFromISOStr(dateStr) {
  var dateInts = dateStr.split('-').map(function (x) {
    return parseInt(x);
  });
  return new Date(dateInts[0], dateInts[1] - 1, dateInts[2]);
}

window.localDateFromISOStr = localDateFromISOStr; // Return Date() with local timezone at midnight

function localdate() {
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

window.localdate = localdate;
var n = "numeric",
    s = "short",
    l = "long",
    d2 = "2-digit";
var DATE_MED = {
  year: n,
  month: s,
  day: n
}; // Date() -> "Oct 2, 2018" (localized)
// JS equiv of the Django template filter:   |date:"MEDIUM_DATE_FORMAT"

function mediumDateFormatStr(date) {
  var languageCode = window.userLang; // set in base.html by Django

  return new Intl.DateTimeFormat(languageCode, DATE_MED).format(date);
}

window.mediumDateFormatStr = mediumDateFormatStr;
/**
 *  updates session variables for the currently logged in user
 *  @param {Object} sessionVarsToUpdate - key value pairs of session variable name and updated value
 *  @param {function} [callback] - callback to run upon successful session update
 *  @returns {Promise} Promise object with the resutls of the ajax call
 */

function sendSessionVariableUpdate(sessionVarsToUpdate) {
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var ajaxSettings = {
    url: '/update_user_session/',
    type: 'PUT',
    contentType: 'application/json',
    data: JSON.stringify(sessionVarsToUpdate),
    processData: false
  };
  var updateRequest = $.ajax(ajaxSettings);

  if (callback) {
    updateRequest.done(callback);
  }

  return updateRequest;
}

$(function () {
  // Javascript to enable link to tab
  var hash = document.location.hash;

  if (hash) {
    $('.nav-tabs a[href="' + hash + '"]').tab('show');
  } // Change hash for page-reload


  $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
    window.location.hash = e.target.hash;
  }); // Enable popovers

  $('[data-toggle="popover"]').popover({
    html: true
  });
  $('[data-toggle="popover"]').on('click', function (e) {
    e.preventDefault();
  });
  /* specific actions tied to item-specific site-wide events here: */
  // in case of covid alert dismissal, update the session to clear it for the rest of this login session:

  $('#covid-banner-alert').on('close.bs.alert', function () {
    sendSessionVariableUpdate({
      show_covid_banner: false
    });
  });
}); //App specific JavaScript

$(function () {
  $('[data-toggle="tooltip"]').tooltip();
}); //custom jquery to trigger date picker, info pop-over and print category text

$(document).ready(function () {
  $('.datepicker').datepicker({
    dateFormat: "yy-mm-dd"
  });
});
/*
 * Create and show a Bootstrap alert.
 */

function createAlert(type, message, fade, whereToAppend) {
  if (whereToAppend == undefined) {
    whereToAppend = "#messages";
  }

  $(whereToAppend).append($("<div class='alert alert-" + type + " dynamic-alert alert-dismissable' style='margin-top:0;'>" + "<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>" + "<p>" + message + "</p>" + "</div>"));

  if (fade == true) {
    // Remove the alert after 5 seconds if the user does not close it.
    $(".dynamic-alert").delay(5000).fadeOut("slow", function () {
      $(this).remove();
    });
  }
}

window.createAlert = createAlert;
/* Configure PNotify global settings */

/* Do so on document ready since lib is included after app.js */

$(function () {
  PNotify.defaults.styling = 'bootstrap4'; // Bootstrap version 4

  PNotify.defaults.icons = 'fontawesome5'; // Font Awesome 5
  // Show close button and hide pin button

  PNotify.modules.Buttons.defaults.closerHover = false;
  PNotify.modules.Buttons.defaults.sticker = false;
});
/* Notifications */

function notifyError(title, msg) {
  PNotify.alert({
    text: msg,
    title: title,
    hide: false,
    type: 'error'
  });
}

window.notifyError = notifyError;

function autoDismissingNotification() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$message = _ref.message,
      message = _ref$message === void 0 ? '' : _ref$message,
      _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'success' : _ref$type,
      _ref$title = _ref.title,
      title = _ref$title === void 0 ? gettext("Success") : _ref$title,
      _ref$hide = _ref.hide,
      hide = _ref$hide === void 0 ? true : _ref$hide,
      _ref$textTrusted = _ref.textTrusted,
      textTrusted = _ref$textTrusted === void 0 ? false : _ref$textTrusted;

  var notice = PNotify.alert({
    title: title,
    text: message,
    type: type,
    hide: hide,
    textTrusted: textTrusted,
    width: '350px',
    minHeight: '150px',
    delay: 3000,
    stack: {
      'dir1': 'right',
      'dir2': 'up',
      'firstpos1': 0,
      'firstpos2': 0
    },
    modules: {
      Buttons: {
        closer: true,
        closerHover: false,
        sticker: false
      }
    }
  });
  return notice;
}

window.autoDismissingNotification = autoDismissingNotification;
$(document).ready(function () {
  $(document).on('hidden.bs.modal', '.modal', function () {
    if ($('.modal:visible').length) {
      $(document.body).addClass('modal-open');
    } else {
      $(document.body).removeClass('modal-open');
    }
  });
});
/*
* Pop-up window for help docs and guidance on forms
*/

function newPopup(url, windowName) {
  return window.open(url, windowName, 'height=768,width=1366,left=1200,top=10,titlebar=no,toolbar=no,menubar=no,location=no,directories=no,status=no');
}

window.newPopup = newPopup; // EXAMPLE: <a onclick="newPopup('https://docs.google.com/document/d/1tDwo3m1ychefNiAMr-8hCZnhEugQlt36AOyUYHlPbVo/edit?usp=sharing','Form Help/Guidance'); return false;" href="#" class="btn btn-sm btn-info">Form Help/Guidance</a>

var DEFAULT_DESTRUCTIVE_MESSAGE = gettext("Your changes will be recorded in a change log. For future reference, please share your reason for these changes.");
var DEFAULT_NONDESTRUCTIVE_MESSAGE = gettext('Your changes will be recorded in a change log. For future reference, please share your reason for these changes.');
var DEFAULT_NO_RATIONALE_TEXT = gettext("This action cannot be undone");
window.DEFAULT_DESTRUCTIVE_MESSAGE = DEFAULT_DESTRUCTIVE_MESSAGE;
window.DEFAULT_NONDESTRUCTIVE_MESSAGE = DEFAULT_NONDESTRUCTIVE_MESSAGE;
window.DEFAULT_NO_RATIONALE_TEXT = DEFAULT_NO_RATIONALE_TEXT; // This is only until we get indicator_form_common_js moved to webpack and out of html (makemessages bug)
// these translation strings are used exclusively in the indicator setup form:

var target_with_results_text = function target_with_results_text(numResults) {
  return interpolate(ngettext('Removing this target means that %s result will no longer have targets associated with it.', 'Removing this target means that %s results will no longer have targets associated with them.', numResults), [numResults]);
};

window.target_with_results_text = target_with_results_text;

var create_changeset_notice = function create_changeset_notice() {
  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref2$on_submit = _ref2.on_submit,
      on_submit = _ref2$on_submit === void 0 ? function () {} : _ref2$on_submit,
      _ref2$on_cancel = _ref2.on_cancel,
      on_cancel = _ref2$on_cancel === void 0 ? function () {} : _ref2$on_cancel,
      _ref2$confirm_text = _ref2.confirm_text,
      confirm_text = _ref2$confirm_text === void 0 ? gettext('Ok') : _ref2$confirm_text,
      _ref2$cancel_text = _ref2.cancel_text,
      cancel_text = _ref2$cancel_text === void 0 ? gettext('Cancel') : _ref2$cancel_text,
      _ref2$type = _ref2.type,
      type = _ref2$type === void 0 ? 'notice' : _ref2$type,
      _ref2$inner = _ref2.inner,
      inner = _ref2$inner === void 0 ? '' : _ref2$inner,
      _ref2$context = _ref2.context,
      context = _ref2$context === void 0 ? null : _ref2$context,
      _ref2$rationale_requi = _ref2.rationale_required,
      rationale_required = _ref2$rationale_requi === void 0 ? true : _ref2$rationale_requi,
      _ref2$showCloser = _ref2.showCloser,
      showCloser = _ref2$showCloser === void 0 ? false : _ref2$showCloser;

  var notice = PNotify.alert({
    text: $("<div><form action=\"\" method=\"post\" class=\"form\">".concat(inner, "</form></div>")).html(),
    textTrusted: true,
    icon: false,
    width: '350px',
    hide: false,
    type: type,
    addClass: 'program-page__rationale-form',
    stack: {
      'overlayClose': true,
      'dir1': 'right',
      'dir2': 'up',
      'firstpos1': 20,
      'firstpos2': 20,
      'context': context
    },
    modules: {
      Buttons: {
        closer: showCloser,
        closerHover: false,
        sticker: false
      },
      Confirm: {
        confirm: true,
        buttons: [{
          text: confirm_text,
          primary: true,
          addClass: type == 'error' ? 'btn-danger' : '',
          click: function click(notice) {
            var close = true;
            var textarea = $(notice.refs.elem).find('textarea[name="rationale"]');
            var rationale = textarea.val();
            textarea.parent().find('.invalid-feedback').remove();

            if (!rationale && rationale_required) {
              textarea.addClass('is-invalid');
              textarea.parent().append('<div class="invalid-feedback">' + gettext('A reason is required.') + '</div>');
              return false;
            } else {
              textarea.removeClass('is-invalid');
            }

            if (on_submit) {
              close = on_submit(rationale);

              if (close === undefined) {
                close = true;
              }
            }

            if (close) {
              document.getElementById('notification_blocking_div').style.display = 'none';
              notice.close();
            }
          }
        }, {
          text: cancel_text,
          click: function click(notice) {
            close = on_cancel();

            if (close === undefined) {
              close = true;
            }

            if (close) {
              document.getElementById('notification_blocking_div').style.display = 'none';
              notice.close();
            }
          }
        }]
      }
    }
  });

  if (on_cancel) {
    notice.on('click', function (e) {
      if ($(e.target).is('.ui-pnotify-closer *')) {
        var _close = on_cancel();

        if (_close || _close === undefined) {
          document.getElementById('notification_blocking_div').style.display = 'none';
          notice.close();
        }
      }
    });
  }
}; // Consider using the create_unified_changeset_notice instead of this one


window.create_destructive_changeset_notice = function () {
  var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref3$message_text = _ref3.message_text,
      message_text = _ref3$message_text === void 0 ? DEFAULT_DESTRUCTIVE_MESSAGE : _ref3$message_text,
      _ref3$on_submit = _ref3.on_submit,
      on_submit = _ref3$on_submit === void 0 ? function () {} : _ref3$on_submit,
      _ref3$on_cancel = _ref3.on_cancel,
      on_cancel = _ref3$on_cancel === void 0 ? function () {} : _ref3$on_cancel,
      _ref3$confirm_text = _ref3.confirm_text,
      confirm_text = _ref3$confirm_text === void 0 ? gettext('Ok') : _ref3$confirm_text,
      _ref3$cancel_text = _ref3.cancel_text,
      cancel_text = _ref3$cancel_text === void 0 ? gettext('Cancel') : _ref3$cancel_text,
      _ref3$context = _ref3.context,
      context = _ref3$context === void 0 ? null : _ref3$context,
      _ref3$no_preamble = _ref3.no_preamble,
      no_preamble = _ref3$no_preamble === void 0 ? false : _ref3$no_preamble,
      _ref3$showCloser = _ref3.showCloser,
      showCloser = _ref3$showCloser === void 0 ? false : _ref3$showCloser,
      _ref3$preamble = _ref3.preamble,
      preamble = _ref3$preamble === void 0 ? false : _ref3$preamble;

  if (!message_text) {
    message_text = DEFAULT_DESTRUCTIVE_MESSAGE;
  }

  if (!preamble) {
    preamble = no_preamble ? '' : "<span class='text-danger'>".concat(gettext("This action cannot be undone."), "</span>");
  }

  var inner = "\n        <div class=\"row\">\n            <div class=\"col\">\n                <h2 class=\"text-danger\">".concat(gettext("Warning"), "</h2>\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"col\">\n                ").concat(preamble, "\n                ").concat(message_text, "\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"col\">\n                <div class=\"form-group\">\n                    <textarea class=\"form-control\" name=\"rationale\"></textarea>\n                </div>\n            </div>\n        </div>\n    ");
  return create_changeset_notice({
    message_text: message_text,
    on_submit: on_submit,
    on_cancel: on_cancel,
    confirm_text: confirm_text,
    cancel_text: cancel_text,
    type: 'error',
    inner: inner,
    context: context,
    showCloser: showCloser
  });
}; // Consider using the create_unified_changeset_notice instead of this one


window.create_nondestructive_changeset_notice = function () {
  var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref4$message_text = _ref4.message_text,
      message_text = _ref4$message_text === void 0 ? DEFAULT_NONDESTRUCTIVE_MESSAGE : _ref4$message_text,
      _ref4$on_submit = _ref4.on_submit,
      on_submit = _ref4$on_submit === void 0 ? function () {} : _ref4$on_submit,
      _ref4$on_cancel = _ref4.on_cancel,
      on_cancel = _ref4$on_cancel === void 0 ? function () {} : _ref4$on_cancel,
      _ref4$confirm_text = _ref4.confirm_text,
      confirm_text = _ref4$confirm_text === void 0 ? gettext('Ok') : _ref4$confirm_text,
      _ref4$cancel_text = _ref4.cancel_text,
      cancel_text = _ref4$cancel_text === void 0 ? gettext('Cancel') : _ref4$cancel_text,
      _ref4$context = _ref4.context,
      context = _ref4$context === void 0 ? null : _ref4$context;

  if (!message_text) {
    message_text = DEFAULT_NONDESTRUCTIVE_MESSAGE;
  }

  var inner = "\n        <div class=\"row\">\n            <div class=\"col\">\n                <h2>".concat(gettext("Reason for change"), "</h2>\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"col\">\n                ").concat(message_text, "\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"col\">\n                <div class=\"form-group\">\n                    <textarea class=\"form-control\" name=\"rationale\"></textarea>\n                </div>\n            </div>\n        </div>\n    ");
  return create_changeset_notice({
    message_text: message_text,
    on_submit: on_submit,
    on_cancel: on_cancel,
    confirm_text: confirm_text,
    cancel_text: cancel_text,
    type: 'notice',
    inner: inner,
    context: context
  });
}; // Consider using the create_unified_changeset_notice instead of this one


window.create_no_rationale_changeset_notice = function () {
  var _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref5$message_text = _ref5.message_text,
      message_text = _ref5$message_text === void 0 ? DEFAULT_NO_RATIONALE_TEXT : _ref5$message_text,
      _ref5$on_submit = _ref5.on_submit,
      on_submit = _ref5$on_submit === void 0 ? function () {} : _ref5$on_submit,
      _ref5$on_cancel = _ref5.on_cancel,
      on_cancel = _ref5$on_cancel === void 0 ? function () {} : _ref5$on_cancel,
      _ref5$confirm_text = _ref5.confirm_text,
      confirm_text = _ref5$confirm_text === void 0 ? gettext('Ok') : _ref5$confirm_text,
      _ref5$cancel_text = _ref5.cancel_text,
      cancel_text = _ref5$cancel_text === void 0 ? gettext('Cancel') : _ref5$cancel_text,
      _ref5$context = _ref5.context,
      context = _ref5$context === void 0 ? null : _ref5$context,
      _ref5$type = _ref5.type,
      type = _ref5$type === void 0 ? 'error' : _ref5$type,
      _ref5$preamble = _ref5.preamble,
      preamble = _ref5$preamble === void 0 ? false : _ref5$preamble,
      _ref5$blocking = _ref5.blocking,
      blocking = _ref5$blocking === void 0 ? false : _ref5$blocking;

  if (blocking) {
    document.getElementById('notification_blocking_div').style.display = 'block';
  }

  if (!message_text) {
    message_text = DEFAULT_NO_RATIONALE_TEXT;
  }

  if (!preamble) {
    preamble = gettext("This action cannot be undone.");
  }

  ;
  var inner = "\n        <div class=\"row\">\n            <div class=\"col\">\n                <h2 class=\"pnotify--header\"><i class=\"fas fa-exclamation-triangle\"></i>".concat(gettext("Warning"), "</h2>\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"col\">\n                <span class='text-danger'>\n                    ").concat(preamble, "\n                </span>\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"col\">\n                <span>\n                    ").concat(message_text, "\n                </span>\n            </div>\n        </div>\n    ");
  return create_changeset_notice({
    message_text: message_text,
    on_submit: on_submit,
    on_cancel: on_cancel,
    confirm_text: confirm_text,
    cancel_text: cancel_text,
    type: type,
    inner: inner,
    context: context,
    rationale_required: false,
    showCloser: true
  });
};
/*
* Consider using this notification function rather than the more specific ones above.  It should be able to
* everything they can do. The configurable parameters are for the 4 sections of the notification and
* for other visual and functional elements. Leave any of these null or false to omit them.
* There is NO DEFAULT TEXT. You must explicitly provide text to text elements.
*/



window.create_unified_changeset_notice = components_changesetNotice_js__WEBPACK_IMPORTED_MODULE_3__["create_unified_changeset_notice"];

var createPnotifyAlert = function createPnotifyAlert(passedInConfig) {
  var config = {
    textTrusted: true,
    icon: false,
    width: '350px',
    hide: true,
    delay: 2000,
    type: 'alert'
  };
  Object.assign(config, passedInConfig);
  var faClass = "fa-exclamation-triangle";

  if (config.type == "success") {
    faClass = "fa-check-circle";
  }

  var inner = "\n        <div class=\"row\">\n            <div class=\"col\">\n                <h2 class=\"pnotify--header\"><i class=\"fas ".concat(faClass, "\"></i>").concat(gettext("Success!"), "</h2>\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"col\">\n                <span class='text-success'>\n                    ").concat(config.preamble, "\n                </span>\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"col\">\n                <span>\n                    ").concat(config.message_text, "\n                </span>\n            </div>\n        </div>\n    ");
  config.text = $("<div><form action=\"\" method=\"post\" class=\"form container\">".concat(inner, "</form></div>")).html();
  PNotify.alert(config);
};

window.success_notice = function (userConfig) {
  var config = {
    message_text: "Update successful.",
    preamble: "",
    animation: "fade",
    type: "success"
  };
  Object.assign(config, userConfig);
  createPnotifyAlert(config);
};
/*
 * Take a jquery element and scroll the to the bottom of said element
 * The element should represent the top level element controlled by a scroll bar
 * One might think that is always 'html' but can also be a modal div overlay or possibly
 * a div with overflow: scroll
 */


function scrollToBottom($el) {
  var height = $el.prop('scrollHeight');
  $el.animate({
    scrollTop: height
  }, 'slow');
}

window.scrollToBottom = scrollToBottom;
var CONTROL_CHARACTER_KEYCODES = [8, //backspace
9, //tab
13, //enter
27, //escape
35, //end,
36, //home
37, //arrow left
39, //arrow right
46 //delete
];
var SPANISH = 'es';
var FRENCH = 'fr';
var ENGLISH = 'en';
/***********
 * LOCALE-AWARE FORM INPUT FUNCTIONS:
 *  these functions are for _inputs_ (and divs/spans being used to show user input)
 *  they do not account for thousands separators, and merely convert back and forth between ',' and '.' floating-point separators
 **********/

/**
 * takes a selector string, (i.e. '#id_achieved') returns an input that is validated based on
 * universal rules (2 decimal places, comma or period as floating-point separator, no negative signs)
 * e.g.```
 *      let $myInput = window.getValidatedNumericInput('#my_input_id');
 * ```
 * returns the input selected by $('#my_input_id') but with rules preventing non-numeric input, and with an auto-updating
 * display value (strips trailing zeros, converts floating point to locale-aware display of a number)
 */

function getValidatedNumericInput(selector) {
  var $input = $(selector);
  var floatingPointSeparator = [FRENCH, SPANISH].includes(userLang) ? 188 : 190;

  function preventNonNumericInput(e) {
    // allow cursor control characters:
    if (CONTROL_CHARACTER_KEYCODES.includes(e.keyCode) || // allow: Ctrl characters (don't break browsers):
    e.ctrlKey === true || e.metaKey === true) {
      // don't do anything (allow key to be used as normal)
      return;
    } // if decimal point/comma, and already 2 digits to the right of it, and cursor is to the right of it, prevent:


    var curVal = "".concat($(e.target).val());
    var floatingPointPosition = Math.max(curVal.indexOf('.'), curVal.indexOf(','));
    var curSelection = curVal.slice(e.target.selectionStart, e.target.selectionEnd);
    var selectionContainsSeparator = curSelection && curSelection.length > 0 && (curSelection.match(/[,.]/) || []).length > 0;

    if ((curVal.match(/[,.]/) || []).length > 0 && curVal.length - floatingPointPosition > 2 && e.target.selectionStart > floatingPointPosition && (!curSelection || curSelection.length < 1)) {
      //prevent numbers more than 2 spaces to the right of the decimal/comma from being entered:
      e.preventDefault();
      return;
    } // allow numbers (48 - 57 map to 0-9):


    if (e.keyCode >= 48 && e.keyCode <= 57 && !e.shiftKey || // allow numpad numbers:
    e.keyCode >= 96 && e.keyCode <= 105 && !e.shiftKey || // allow comma or period if there isn't one already:
    e.keyCode == floatingPointSeparator && ((curVal.match(/[,.]/) || []).length < 1 || selectionContainsSeparator) && !e.shiftKey) {
      // don't do anything (allow number / decimal / comma to be entered as normal)
      return;
    } // prevent any key not mentioned above from being entered:


    e.preventDefault();
    return;
  }

  $input.keydown(preventNonNumericInput);
  $input.each(function () {
    $(this).updateDisplayVal();
  });
  $input.on('blur', function (e) {
    $(e.target).updateDisplayVal();
  });
  return $input;
}

window.getValidatedNumericInput = getValidatedNumericInput;
jQuery.fn.extend({
  // $input.numericVal() returns a float or null, and handles a displayed value with a comma floating-point separator or decimal
  // so "43,2" as a French/Spanish number returns, from numericVal(), the float 43.2
  numericVal: function numericVal() {
    if (this.is('input')) {
      return !isNaN(parseFloat(this.val().replace(',', '.'))) ? parseFloat(this.val().replace(',', '.')) : null;
    }

    if (this.is('div')) {
      var value = this.html();
      value = value.replace("%", "");
      value = value.replace(',', '.');
      value = parseFloat(value);
      return !isNaN(value) ? value : null;
    }
  },
  // updates the displayed value based on the stored numeric value of an input:
  updateDisplayVal: function updateDisplayVal() {
    this.displayVal(this.val());
  },
  // helper function: called with a float/int/string representation of a number, returns a display-ready string,
  // with trailing zeros removed (and trailing , or .) and the correct floating-point separator based on language
  toDisplayVal: function toDisplayVal(value) {
    value = "".concat(value).replace(',', '.');

    if (isNaN(parseFloat(value))) {
      return '';
    }

    value = "".concat(parseFloat(value).toFixed(2));

    if ([FRENCH, SPANISH].includes(userLang)) {
      value = value.replace('.', ',');
    } else {
      value = value.replace(',', '.');
    }

    value = value.replace(new RegExp("([,\.][1-9])?[,\.]?0+$"), "$1");
    return value;
  },
  // called with a float/int/string representation of a number, processes it with the above helper function toDisplayVal,
  // and sets the val (if an input) or the inner html (if a span/div)
  displayVal: function displayVal(value) {
    var percent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    value = this.toDisplayVal(value);

    if (this.is('input')) {
      this.val(value);
    }

    if (this.is('div') || this.is('span')) {
      this.html("".concat(value));
    }
  }
});
/***********
 * LOCALE-AWARE DISPLAY FUNCTIONS
 *  these functions are for _display_ - they will break forms
 *  they account for thousands separators and floating point separators, and trim zeros.
 *  12423.40:
 *      ES: 12.423,4
 *      FR: 12 423,4
 *      EN: 12,423.4
 **********/


window.localizeNumber = general_utilities__WEBPACK_IMPORTED_MODULE_4__["localizeNumber"];
window.localizePercent = general_utilities__WEBPACK_IMPORTED_MODULE_4__["localizePercent"]; // Useful if you need to delocalize form values, e.g. to evaluate if the form has changed.
// Doesn't delocalize the thousands separator.

window.delocalizeRadix = function (localizedValue) {
  var delocalized = localizedValue.replace(",", ".");
  return isNaN(delocalized) ? localizedValue : delocalized;
};

window.normalizeNumber = function (value) {
  if (isNaN(parseFloat(value)) || isDate(value)) {
    return value;
  } else {
    return parseFloat(value).toString();
  }
};

/***/ }),

/***/ "v38i":
/*!*************************!*\
  !*** ./js/constants.js ***!
  \*************************/
/*! exports provided: BLANK_OPTION, BLANK_LABEL, BLANK_TABLE_CELL, EM_DASH, TVA, TIMEPERIODS, TIME_AWARE_FREQUENCIES, IRREGULAR_FREQUENCIES, TVA_FREQUENCY_LABELS, TIMEPERIODS_FREQUENCY_LABELS, GROUP_BY_CHAIN, GROUP_BY_LEVEL, getPeriodLabels, STATUS_CODES, IndicatorFilterType, RFC_OPTIONS */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BLANK_OPTION", function() { return BLANK_OPTION; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BLANK_LABEL", function() { return BLANK_LABEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BLANK_TABLE_CELL", function() { return BLANK_TABLE_CELL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EM_DASH", function() { return EM_DASH; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TVA", function() { return TVA; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TIMEPERIODS", function() { return TIMEPERIODS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TIME_AWARE_FREQUENCIES", function() { return TIME_AWARE_FREQUENCIES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IRREGULAR_FREQUENCIES", function() { return IRREGULAR_FREQUENCIES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TVA_FREQUENCY_LABELS", function() { return TVA_FREQUENCY_LABELS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TIMEPERIODS_FREQUENCY_LABELS", function() { return TIMEPERIODS_FREQUENCY_LABELS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GROUP_BY_CHAIN", function() { return GROUP_BY_CHAIN; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GROUP_BY_LEVEL", function() { return GROUP_BY_LEVEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getPeriodLabels", function() { return getPeriodLabels; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "STATUS_CODES", function() { return STATUS_CODES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IndicatorFilterType", function() { return IndicatorFilterType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RFC_OPTIONS", function() { return RFC_OPTIONS; });
var _getGlobal;

/* Site-wide constants */

/**
 * JS_GLOBALS is in base.html (base Tola template) - delivered by middleware from the backend
 * this function returns the global constant for a given key (i.e. 'reason_for_change_options')
 */
function getGlobal(key) {
  if (typeof JS_GLOBALS !== 'undefined' && JS_GLOBALS.hasOwnProperty(key)) {
    return JS_GLOBALS[key];
  }

  return null;
}
/**
 * IPTT Constants:
 */


var BLANK_LABEL = '---------';
var BLANK_OPTION = {
  value: null,
  label: BLANK_LABEL
};
var EM_DASH = "—";
var BLANK_TABLE_CELL = EM_DASH;
var TVA = 1;
var TIMEPERIODS = 2;
var TIME_AWARE_FREQUENCIES = [3, 4, 5, 6, 7];
var IRREGULAR_FREQUENCIES = [1, 2];
var TVA_FREQUENCY_LABELS = Object.freeze({
  1: gettext("Life of Program (LoP) only"),
  2: gettext("Midline and endline"),
  3: gettext("Annual"),
  4: gettext("Semi-annual"),
  5: gettext("Tri-annual"),
  6: gettext("Quarterly"),
  7: gettext("Monthly")
});
var TIMEPERIODS_FREQUENCY_LABELS = Object.freeze({
  3: gettext("Years"),
  4: gettext("Semi-annual periods"),
  5: gettext("Tri-annual periods"),
  6: gettext("Quarters"),
  7: gettext("Months")
});

var GROUP_BY_CHAIN = 1;
var GROUP_BY_LEVEL = 2;


var _gettext = typeof gettext !== 'undefined' ? gettext : function (s) {
  return s;
};

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


var STATUS_CODES = {
  NO_INDICATOR_IN_UPDATE: 1
};
var IndicatorFilterType = Object.freeze({
  noFilter: 0,
  missingTarget: 1,
  missingResults: 2,
  missingEvidence: 3,
  aboveTarget: 5,
  belowTarget: 6,
  onTarget: 7,
  nonReporting: 8
});
var RFC_OPTIONS = (_getGlobal = getGlobal('reason_for_change_options')) !== null && _getGlobal !== void 0 ? _getGlobal : [];

/***/ })

},[["YqHn","runtime","vendors"]]]);
//# sourceMappingURL=base-6f909e13ce61feea59b9.js.map