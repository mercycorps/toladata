(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["program_page"],{

/***/ "DaGC":
/*!*************************************************!*\
  !*** ./js/pages/program_page/pinned_reports.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// On pinned report delete btn click
$('[data-delete-pinned-report]').click(function (e) {
  e.preventDefault();
  var prId = $(this).data('deletePinnedReport');
  var pinnedReport = $(this).closest('.pinned-report');

  if (window.confirm(gettext('Warning: This action cannot be undone. Are you sure you want to delete this pinned report?'))) {
    $.ajax({
      type: "POST",
      url: jsContext.delete_pinned_report_url,
      data: {
        pinned_report_id: prId
      },
      success: function success() {
        pinnedReport.remove();
      }
    });
  }
});

/***/ }),

/***/ "KPAS":
/*!************************************************************!*\
  !*** ./js/pages/program_page/components/indicator_list.js ***!
  \************************************************************/
/*! exports provided: IndicatorList */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IndicatorList", function() { return IndicatorList; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "TSYQ");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var _eventbus__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../eventbus */ "qtBC");
/* harmony import */ var _components_indicatorModalComponents__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../components/indicatorModalComponents */ "hzyr");
/* harmony import */ var _fortawesome_fontawesome_svg_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @fortawesome/fontawesome-svg-core */ "7O5W");
/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ "IP2g");
/* harmony import */ var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons */ "wHSu");
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../models */ "YVM2");
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-select */ "y2Vs");
var _class, _class2, _temp, _class4;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }











_fortawesome_fontawesome_svg_core__WEBPACK_IMPORTED_MODULE_5__["library"].add(_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_7__["faCaretDown"], _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_7__["faCaretRight"]);

function getStatusIndicatorString(filterType, indicatorCount) {
  var fmts;

  switch (filterType) {
    case _models__WEBPACK_IMPORTED_MODULE_8__["IndicatorFilterType"].missingTarget:
      // # Translators: The number of indicators that do not have targets defined on them
      fmts = ngettext("%s indicator has missing targets", "%s indicators have missing targets", indicatorCount);
      return interpolate(fmts, [indicatorCount]);

    case _models__WEBPACK_IMPORTED_MODULE_8__["IndicatorFilterType"].missingResults:
      // # Translators: The number of indicators that no one has entered in any results for
      fmts = ngettext("%s indicator has missing results", "%s indicators have missing results", indicatorCount);
      return interpolate(fmts, [indicatorCount]);

    case _models__WEBPACK_IMPORTED_MODULE_8__["IndicatorFilterType"].missingEvidence:
      // # Translators: The number of indicators that contain results that are not backed up with evidence
      fmts = ngettext("%s indicator has missing evidence", "%s indicators have missing evidence", indicatorCount);
      return interpolate(fmts, [indicatorCount]);

    case _models__WEBPACK_IMPORTED_MODULE_8__["IndicatorFilterType"].aboveTarget:
      // # Translators: shows what number of indicators are a certain percentage above target. Example: 3 indicators are >15% above target
      fmts = ngettext("%s indicator is >15% above target", "%s indicators are >15% above target", indicatorCount);
      return interpolate(fmts, [indicatorCount]);

    case _models__WEBPACK_IMPORTED_MODULE_8__["IndicatorFilterType"].belowTarget:
      // # Translators: shows what number of indicators are a certain percentage below target. Example: 3 indicators are >15% below target
      fmts = ngettext("%s indicator is >15% below target", "%s indicators are >15% below target", indicatorCount);
      return interpolate(fmts, [indicatorCount]);

    case _models__WEBPACK_IMPORTED_MODULE_8__["IndicatorFilterType"].onTarget:
      // # Translators: shows what number of indicators are within a set range of target. Example: 3 indicators are on track
      fmts = ngettext("%s indicator is on track", "%s indicators are on track", indicatorCount);
      return interpolate(fmts, [indicatorCount]);

    default:
      // # Translators: the number of indicators in a list. Example: 3 indicators
      fmts = ngettext("%s indicator", "%s indicators", indicatorCount);
      return interpolate(fmts, [indicatorCount]);
  }
}

var StatusHeader = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class =
/*#__PURE__*/
function (_React$Component) {
  _inherits(StatusHeader, _React$Component);

  function StatusHeader(props) {
    var _this;

    _classCallCheck(this, StatusHeader);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(StatusHeader).call(this, props));

    _this.onShowAllClick = function (e) {
      e.preventDefault();
      _eventbus__WEBPACK_IMPORTED_MODULE_3__["default"].emit('nav-clear-all-indicator-filters');
    };

    return _this;
  }

  _createClass(StatusHeader, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          indicatorCount = _this$props.indicatorCount,
          programId = _this$props.programId,
          currentIndicatorFilter = _this$props.currentIndicatorFilter,
          filterApplied = _this$props.filterApplied,
          readonly = _this$props.readonly;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "indicators-list__header"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h3", {
        className: "no-bold"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        id: "indicators-list-title"
      }, getStatusIndicatorString(currentIndicatorFilter, indicatorCount), " "), filterApplied && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        id: "show-all-indicators",
        onClick: this.onShowAllClick
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("small", null, gettext('Show all')))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, !readonly && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_indicatorModalComponents__WEBPACK_IMPORTED_MODULE_4__["AddIndicatorButton"], {
        readonly: readonly,
        programId: programId
      })));
    }
  }]);

  return StatusHeader;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component)) || _class;

var IndicatorFilter = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class2 = (_temp =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(IndicatorFilter, _React$Component2);

  function IndicatorFilter() {
    var _getPrototypeOf2;

    var _this2;

    _classCallCheck(this, IndicatorFilter);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this2 = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(IndicatorFilter)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this2.onSelection = function (selectedObject) {
      var selectedIndicatorId = selectedObject ? selectedObject.value : null;

      if (selectedIndicatorId) {
        _eventbus__WEBPACK_IMPORTED_MODULE_3__["default"].emit('nav-select-indicator-to-filter', selectedIndicatorId);
      }
    };

    _this2.onGroupingSelection = function (selected) {
      _this2.props.uiStore.setGroupBy(selected.value);
    };

    return _this2;
  }

  _createClass(IndicatorFilter, [{
    key: "render",
    value: function render() {
      var indicators = this.props.rootStore.indicatorStore.indicators;
      var selectedIndicatorId = this.props.uiStore.selectedIndicatorId;
      var indicatorSelectOptions = indicators.map(function (i) {
        return {
          value: i.id,
          label: i.name
        };
      });
      var selectedValue = null;

      if (selectedIndicatorId) {
        selectedValue = indicatorSelectOptions.find(function (i) {
          return i.value === selectedIndicatorId;
        });
      }

      var indicatorGroupingOptions = this.props.uiStore.groupByOptions;
      var groupingValue = this.props.uiStore.selectedGroupByOption;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("nav", {
        className: "list__filters list__filters--block-label",
        id: "id_div_indicators"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: ""
      }, gettext("Find an indicator:")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: ""
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_9__["default"], {
        options: indicatorSelectOptions,
        value: selectedValue,
        isClearable: false,
        placeholder: gettext('None'),
        onChange: this.onSelection
      }))), // show Group By only if program is on results framework AND has two levels (filter label is not false)
      !this.props.rootStore.oldStyleLevels && this.props.uiStore.resultChainFilterLabel && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: ""
      }, gettext("Group indicators:")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: ""
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_9__["default"], {
        options: indicatorGroupingOptions,
        value: groupingValue,
        isClearable: false,
        onChange: this.onGroupingSelection
      })))));
    }
  }]);

  return IndicatorFilter;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp)) || _class2;

var IndicatorListTable = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class4 =
/*#__PURE__*/
function (_React$Component3) {
  _inherits(IndicatorListTable, _React$Component3);

  function IndicatorListTable(props) {
    var _this3;

    _classCallCheck(this, IndicatorListTable);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(IndicatorListTable).call(this, props));
    _this3.onIndicatorUpdateClick = _this3.onIndicatorUpdateClick.bind(_assertThisInitialized(_assertThisInitialized(_this3)));
    _this3.onIndicatorResultsToggleClick = _this3.onIndicatorResultsToggleClick.bind(_assertThisInitialized(_assertThisInitialized(_this3)));
    return _this3;
  }

  _createClass(IndicatorListTable, [{
    key: "onIndicatorUpdateClick",
    value: function onIndicatorUpdateClick(e, indicatorId) {
      e.preventDefault();
      _eventbus__WEBPACK_IMPORTED_MODULE_3__["default"].emit('open-indicator-update-modal', indicatorId);
    }
  }, {
    key: "onIndicatorResultsToggleClick",
    value: function onIndicatorResultsToggleClick(e, indicatorId) {
      e.preventDefault();
      var resultsMap = this.props.resultsMap;

      if (resultsMap.has(indicatorId)) {
        _eventbus__WEBPACK_IMPORTED_MODULE_3__["default"].emit('delete-indicator-results', indicatorId);
      } else {
        _eventbus__WEBPACK_IMPORTED_MODULE_3__["default"].emit('load-indicator-results', indicatorId);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var indicators = this.props.indicators;
      var program = this.props.program;
      var programReportingPeriodEndDate = new Date(program.reporting_period_end);
      var resultsMap = this.props.resultsMap;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("table", {
        className: "table indicators-list"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("thead", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
        className: "table-header"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
        className: "",
        id: "id_indicator_name_col_header"
      }, gettext("Indicator")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
        className: "",
        id: "id_indicator_buttons_col_header"
      }, "\xA0"), this.props.oldStyleLevels && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
        className: "",
        id: "id_indicator_level_col_header"
      }, gettext("Level")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
        className: "",
        id: "id_indicator_unit_col_header"
      }, gettext("Unit of measure")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
        className: "text-right",
        id: "id_indicator_baseline_col_header"
      }, gettext("Baseline")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
        className: "text-right",
        id: "id_indicator_target_col_header"
      }, gettext("Target")))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tbody", null, indicators.map(function (indicator) {
        var resultsExist = resultsMap.has(indicator.id);
        var resultsStr = resultsMap.get(indicator.id);
        var targetPeriodLastEndDate = indicator.target_period_last_end_date ? new Date(indicator.target_period_last_end_date) : null; // ^^^ Because calling Date() on null returns the current date, and we actually need null!

        var displayFunc = parseInt(indicator.unit_of_measure_type) == 2 ? function (val) {
          return val ? "".concat(val, "%") : '';
        } : function (val) {
          return val ? "".concat(val) : '';
        };

        var numberCellFunc = function numberCellFunc(val) {
          if (val == '' || isNaN(parseFloat(val))) {
            return '';
          }

          val = parseFloat(val).toFixed(2);

          if (val.slice(-2) == "00") {
            return displayFunc(val.slice(0, -3));
          } else if (val.slice(-1) == "0") {
            return displayFunc(val.slice(0, -1));
          }

          return displayFunc(val);
        };

        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, {
          key: indicator.id
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
          className: classnames__WEBPACK_IMPORTED_MODULE_1___default()("indicators-list__row", "indicators-list__indicator-header", {
            "is-highlighted": indicator.just_created,
            "is-expanded": resultsExist
          })
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
          href: "#",
          className: "indicator_results_toggle btn btn-link text-left",
          onClick: function onClick(e) {
            return _this4.onIndicatorResultsToggleClick(e, indicator.id);
          }
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_6__["FontAwesomeIcon"], {
          icon: resultsExist ? 'caret-down' : 'caret-right'
        }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, indicator.number_if_numbering || indicator.number_display ? indicator.number_display + ':' : ''), "\xA0", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
          className: "indicator_name"
        }, indicator.name)), indicator.key_performance_indicator && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
          className: "badge"
        }, "KPI"), targetPeriodLastEndDate && programReportingPeriodEndDate > targetPeriodLastEndDate && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
          href: "/indicators/indicator_update/".concat(indicator.id, "/"),
          className: "indicator-link color-red missing_targets",
          "data-toggle": "modal",
          "data-target": "#indicator_modal_div",
          "data-tab": "targets"
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "fas fa-bullseye"
        }), " Missing targets")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
          href: "#",
          className: "indicator-link",
          onClick: function onClick(e) {
            return _this4.onIndicatorUpdateClick(e, indicator.id);
          }
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "fas fa-cog"
        }))), _this4.props.oldStyleLevels && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, indicator.old_level), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, indicator.unit_of_measure), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
          className: "text-right"
        }, indicator.baseline_na ? gettext('N/A') : numberCellFunc(indicator.baseline)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
          className: "text-right"
        }, numberCellFunc(indicator.lop_target_active))), resultsExist && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
          className: "indicators-list__row indicators-list__indicator-body"
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
          colSpan: "6",
          ref: function ref(el) {
            return $(el).find('[data-toggle="popover"]').popover({
              html: true
            });
          }
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          dangerouslySetInnerHTML: {
            __html: resultsStr
          }
        }))));
      })));
    }
  }]);

  return IndicatorListTable;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component)) || _class4;

var IndicatorList = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(function (props) {
  var program = props.rootStore.program;
  var indicatorStore = props.rootStore.indicatorStore; // const indicators = props.rootStore.indicatorStore.indicators;

  var resultsMap = props.rootStore.resultsMap;
  var currentIndicatorFilter = props.uiStore.currentIndicatorFilter;
  var selectedIndicatorId = props.uiStore.selectedIndicatorId;
  var sortByChain = props.uiStore.groupByChain; // Either a gas gauge filter is applied, or an indicator has been selected, but not both
  // apply gas gauge filter

  var filteredIndicators = indicatorStore.filterIndicators(currentIndicatorFilter);
  filteredIndicators = indicatorStore.sortIndicators(props.rootStore.oldStyleLevels, sortByChain, filteredIndicators);

  if (selectedIndicatorId) {
    filteredIndicators = filteredIndicators.filter(function (i) {
      return i.id == selectedIndicatorId;
    });
  }

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(StatusHeader, {
    indicatorCount: filteredIndicators.length,
    programId: program.id,
    currentIndicatorFilter: currentIndicatorFilter,
    filterApplied: currentIndicatorFilter || selectedIndicatorId,
    readonly: props.readonly
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorFilter, {
    uiStore: props.uiStore,
    rootStore: props.rootStore
  }), program.does_it_need_additional_target_periods && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    id: "id_missing_targets_msg",
    className: "color-red"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
    className: "fas fa-bullseye"
  }), "\xA0", gettext('Some indicators have missing targets. To enter these values, click the target icon near the indicator name.')), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorListTable, {
    indicators: filteredIndicators,
    resultsMap: resultsMap,
    program: program,
    oldStyleLevels: props.rootStore.oldStyleLevels
  }));
});

/***/ }),

/***/ "LBcr":
/*!**************************!*\
  !*** ./js/date_utils.js ***!
  \**************************/
/*! exports provided: dateFromISOString, localDateFromISOString, mediumDateFormatStr */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dateFromISOString", function() { return dateFromISOString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "localDateFromISOString", function() { return localDateFromISOString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mediumDateFormatStr", function() { return mediumDateFormatStr; });
/*
  Some nice helper functions to help with date parsing and localization

  In the future it may make sense to use moment.js, luxon, or date-fns,
  but for now, just get by with the native browser APIs and save some bytes.

  Confusingly, native Date() objects are actually date/time objects.

  Surprisingly, the Django i18n/l10n JS tools do not provide access to the language code
  of the current language in use.
 */
var languageCode = window.userLang; // set in base.html by Django

var n = "numeric",
    s = "short",
    l = "long",
    d2 = "2-digit";
var DATE_MED = {
  year: n,
  month: s,
  day: n
}; // Returns native Date()

function dateFromISOString(isoDateStr) {
  return new Date(isoDateStr); // modern browsers can just parse it
} // "2017-01-01" -> Date with local timezone (not UTC)
// also lives in base.js (localDateFromISOStr)

function localDateFromISOString(dateStr) {
  var dateInts = dateStr.split('-').map(function (x) {
    return parseInt(x);
  });
  return new Date(dateInts[0], dateInts[1] - 1, dateInts[2]);
} // Date() -> "Oct 2, 2018" (localized)
// JS equiv of the Django template filter:   |date:"MEDIUM_DATE_FORMAT"

function mediumDateFormatStr(date) {
  return new Intl.DateTimeFormat(languageCode, DATE_MED).format(date);
}

/***/ }),

/***/ "WtQ/":
/*!*********************************!*\
  !*** ./js/general_utilities.js ***!
  \*********************************/
/*! exports provided: flattenArray, ensureNumericArray, reloadPageIfCached, indicatorManualNumberSort */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "flattenArray", function() { return flattenArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ensureNumericArray", function() { return ensureNumericArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "reloadPageIfCached", function() { return reloadPageIfCached; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "indicatorManualNumberSort", function() { return indicatorManualNumberSort; });
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



/***/ }),

/***/ "YVM2":
/*!*****************************************!*\
  !*** ./js/pages/program_page/models.js ***!
  \*****************************************/
/*! exports provided: IndicatorFilterType, IndicatorStore, ProgramPageStore, ProgramPageUIStore */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IndicatorFilterType", function() { return IndicatorFilterType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IndicatorStore", function() { return IndicatorStore; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProgramPageStore", function() { return ProgramPageStore; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProgramPageUIStore", function() { return ProgramPageUIStore; });
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mobx */ "2vnA");
/* harmony import */ var _general_utilities__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../general_utilities */ "WtQ/");
var _class, _descriptor, _temp, _class3, _descriptor2, _descriptor3, _temp2, _class5, _descriptor4, _descriptor5, _descriptor6, _temp3;

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object['ke' + 'ys'](descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object['define' + 'Property'](target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and set to use loose mode. ' + 'To use proposal-class-properties in spec mode with decorators, wait for ' + 'the next major version of decorators in stage 2.'); }


 // Types of filters available on the program page

var IndicatorFilterType = Object.freeze({
  noFilter: 0,
  missingTarget: 1,
  missingResults: 2,
  missingEvidence: 3,
  aboveTarget: 5,
  belowTarget: 6,
  onTarget: 7
});
var IndicatorStore = (_class = (_temp =
/*#__PURE__*/
function () {
  function IndicatorStore(indicators) {
    _classCallCheck(this, IndicatorStore);

    _initializerDefineProperty(this, "indicators", _descriptor, this);

    this.indicators = indicators;
    this.updateIndicator = this.updateIndicator.bind(this);
    this.removeIndicator = this.removeIndicator.bind(this);
    this.filterIndicators = this.filterIndicators.bind(this);
    this.setIndicators = this.setIndicators.bind(this);
  }

  _createClass(IndicatorStore, [{
    key: "updateIndicator",
    value: function updateIndicator(indicator) {
      var i = this.indicators.findIndex(function (e) {
        return e.id === indicator.id;
      });

      if (i > -1) {
        this.indicators[i] = indicator;
      } else {
        this.indicators.push(indicator);
      }
    }
  }, {
    key: "setIndicators",
    value: function setIndicators(indicators) {
      this.indicators = indicators;
    }
  }, {
    key: "removeIndicator",
    value: function removeIndicator(indicatorId) {
      this.indicators = this.indicators.filter(function (e) {
        return e.id != indicatorId;
      });
    }
  }, {
    key: "sortIndicators",
    value: function sortIndicators(oldStyleLevels, sortByChain, indicators) {
      if (oldStyleLevels) {
        return indicators.slice().sort(Object(_general_utilities__WEBPACK_IMPORTED_MODULE_1__["indicatorManualNumberSort"])(function (indicator) {
          return indicator.old_level_pk;
        }, function (indicator) {
          return indicator.number_if_numbering;
        }));
      } else if (!sortByChain) {
        return indicators.slice().sort(function (a, b) {
          if (a.level && a.level.level_depth) {
            if (b.level && b.level.level_depth) {
              if (a.level.level_depth === b.level.level_depth) {
                var a_ontology = a.level.ontology.split('.');
                var b_ontology = b.level.ontology.split('.');

                for (var i = 0; i < a_ontology.length; i++) {
                  if (a_ontology[i] != b_ontology[i]) {
                    return a_ontology[i] - b_ontology[i];
                  }
                }

                return (a.level_order || 0) - (b.level_order || 0);
              }

              return a.level.level_depth - b.level.level_depth;
            }

            return -1;
          }

          return b.level && b.level.level_depth ? 1 : 0;
        });
      } else {
        return indicators.slice().sort(function (a, b) {
          if (a.level && a.level.ontology) {
            if (b.level && b.level.ontology) {
              var a_ontology = a.level.ontology.split('.');
              var b_ontology = b.level.ontology.split('.');

              for (var i = 0; i < a_ontology.length; i++) {
                if (a_ontology[i] != b_ontology[i]) {
                  return a_ontology[i] - b_ontology[i];
                }
              }

              return 0;
            }

            return -1;
          }

          return b.level && b.level.ontology ? 1 : 0;
        });
      }
    }
  }, {
    key: "filterIndicators",
    value: function filterIndicators(filterType) {
      var indicators;

      switch (filterType) {
        case IndicatorFilterType.missingTarget:
          indicators = this.getIndicatorsNeedingTargets;
          break;

        case IndicatorFilterType.missingResults:
          indicators = this.getIndicatorsNeedingResults;
          break;

        case IndicatorFilterType.missingEvidence:
          indicators = this.getIndicatorsNeedingEvidence;
          break;

        case IndicatorFilterType.aboveTarget:
          indicators = this.getIndicatorsAboveTarget;
          break;

        case IndicatorFilterType.belowTarget:
          indicators = this.getIndicatorsBelowTarget;
          break;

        case IndicatorFilterType.onTarget:
          indicators = this.getIndicatorsOnTarget;
          break;

        case IndicatorFilterType.noFilter:
        default:
          indicators = this.indicators;
      }

      return indicators;
    }
  }, {
    key: "getIndicatorsNeedingTargets",
    get: function get() {
      return this.indicators.filter(function (i) {
        return i.all_targets_defined === 0;
      });
    }
  }, {
    key: "getIndicatorsNeedingResults",
    get: function get() {
      return this.indicators.filter(function (i) {
        return i.results_count === 0;
      });
    }
  }, {
    key: "getIndicatorsNeedingEvidence",
    get: function get() {
      return this.indicators.filter(function (i) {
        return i.results_count !== i.results_with_evidence_count;
      });
    }
  }, {
    key: "getIndicatorsNotReporting",
    get: function get() {
      return this.indicators.filter(function (i) {
        return i.over_under === null;
      });
    }
  }, {
    key: "getIndicatorsAboveTarget",
    get: function get() {
      return this.indicators.filter(function (i) {
        return i.over_under > 0;
      });
    }
  }, {
    key: "getIndicatorsBelowTarget",
    get: function get() {
      return this.indicators.filter(function (i) {
        return i.over_under < 0;
      });
    }
  }, {
    key: "getIndicatorsOnTarget",
    get: function get() {
      return this.indicators.filter(function (i) {
        return i.over_under === 0;
      });
    }
  }, {
    key: "getIndicatorsReporting",
    get: function get() {
      return this.indicators.filter(function (i) {
        return i.reporting === true;
      });
    }
  }, {
    key: "getTotalResultsCount",
    get: function get() {
      return this.indicators.reduce(function (acc, i) {
        return acc + i.results_count;
      }, 0);
    }
  }, {
    key: "getTotalResultsWithEvidenceCount",
    get: function get() {
      return this.indicators.reduce(function (acc, i) {
        return acc + i.results_with_evidence_count;
      }, 0);
    }
  }]);

  return IndicatorStore;
}(), _temp), (_descriptor = _applyDecoratedDescriptor(_class.prototype, "indicators", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _applyDecoratedDescriptor(_class.prototype, "updateIndicator", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "updateIndicator"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "setIndicators", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "setIndicators"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "removeIndicator", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "removeIndicator"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "getIndicatorsNeedingTargets", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "getIndicatorsNeedingTargets"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "getIndicatorsNeedingResults", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "getIndicatorsNeedingResults"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "getIndicatorsNeedingEvidence", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "getIndicatorsNeedingEvidence"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "getIndicatorsNotReporting", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "getIndicatorsNotReporting"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "getIndicatorsAboveTarget", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "getIndicatorsAboveTarget"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "getIndicatorsBelowTarget", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "getIndicatorsBelowTarget"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "getIndicatorsOnTarget", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "getIndicatorsOnTarget"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "getIndicatorsReporting", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "getIndicatorsReporting"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "getTotalResultsCount", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "getTotalResultsCount"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "getTotalResultsWithEvidenceCount", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "getTotalResultsWithEvidenceCount"), _class.prototype)), _class);
var ProgramPageStore = (_class3 = (_temp2 =
/*#__PURE__*/
function () {
  // indicator id -> results HTML str
  function ProgramPageStore(indicators, program) {
    _classCallCheck(this, ProgramPageStore);

    this.indicatorStore = void 0;

    _initializerDefineProperty(this, "program", _descriptor2, this);

    _initializerDefineProperty(this, "resultsMap", _descriptor3, this);

    this.indicatorStore = new IndicatorStore(indicators);
    this.program = program;
    this.addResultsHTML = this.addResultsHTML.bind(this);
    this.deleteResultsHTML = this.deleteResultsHTML.bind(this);
  }

  _createClass(ProgramPageStore, [{
    key: "addResultsHTML",
    value: function addResultsHTML(indicatorId, htmlStr) {
      this.resultsMap.set(parseInt(indicatorId), htmlStr);
    }
  }, {
    key: "deleteResultsHTML",
    value: function deleteResultsHTML(indicatorId) {
      this.resultsMap.delete(indicatorId);
    }
  }, {
    key: "deleteAllResultsHTML",
    value: function deleteAllResultsHTML() {
      this.resultsMap.clear();
    }
  }, {
    key: "oldStyleLevels",
    get: function get() {
      return !this.program.results_framework;
    }
  }]);

  return ProgramPageStore;
}(), _temp2), (_descriptor2 = _applyDecoratedDescriptor(_class3.prototype, "program", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class3.prototype, "resultsMap", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new Map();
  }
}), _applyDecoratedDescriptor(_class3.prototype, "addResultsHTML", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class3.prototype, "addResultsHTML"), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, "deleteResultsHTML", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class3.prototype, "deleteResultsHTML"), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, "deleteAllResultsHTML", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class3.prototype, "deleteAllResultsHTML"), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, "oldStyleLevels", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class3.prototype, "oldStyleLevels"), _class3.prototype)), _class3);
var ProgramPageUIStore = (_class5 = (_temp3 =
/*#__PURE__*/
function () {
  // selected gas gauge filter
  // indicators filter
  function ProgramPageUIStore(resultChainFilterLabel) {
    _classCallCheck(this, ProgramPageUIStore);

    _initializerDefineProperty(this, "currentIndicatorFilter", _descriptor4, this);

    _initializerDefineProperty(this, "selectedIndicatorId", _descriptor5, this);

    _initializerDefineProperty(this, "groupByChain", _descriptor6, this);

    this.resultChainFilterLabel = resultChainFilterLabel;
    this.setIndicatorFilter = this.setIndicatorFilter.bind(this);
    this.clearIndicatorFilter = this.clearIndicatorFilter.bind(this);
    this.setSelectedIndicatorId = this.setSelectedIndicatorId.bind(this);
  }

  _createClass(ProgramPageUIStore, [{
    key: "setIndicatorFilter",
    value: function setIndicatorFilter(indicatorFilter) {
      this.currentIndicatorFilter = indicatorFilter;
    }
  }, {
    key: "clearIndicatorFilter",
    value: function clearIndicatorFilter() {
      this.currentIndicatorFilter = null;
    }
  }, {
    key: "setSelectedIndicatorId",
    value: function setSelectedIndicatorId(selectedIndicatorId) {
      this.selectedIndicatorId = selectedIndicatorId;
    }
  }, {
    key: "setGroupBy",
    value: function setGroupBy(value) {
      this.groupByChain = value == 1;
    }
  }, {
    key: "groupByOptions",
    get: function get() {
      return [{
        value: 1,
        label: this.resultChainFilterLabel
      }, {
        value: 2,
        label: gettext('by Level')
      }];
    }
  }, {
    key: "selectedGroupByOption",
    get: function get() {
      return this.groupByChain ? this.groupByOptions[0] : this.groupByOptions[1];
    }
  }]);

  return ProgramPageUIStore;
}(), _temp3), (_descriptor4 = _applyDecoratedDescriptor(_class5.prototype, "currentIndicatorFilter", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor5 = _applyDecoratedDescriptor(_class5.prototype, "selectedIndicatorId", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor6 = _applyDecoratedDescriptor(_class5.prototype, "groupByChain", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return true;
  }
}), _applyDecoratedDescriptor(_class5.prototype, "setIndicatorFilter", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class5.prototype, "setIndicatorFilter"), _class5.prototype), _applyDecoratedDescriptor(_class5.prototype, "clearIndicatorFilter", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class5.prototype, "clearIndicatorFilter"), _class5.prototype), _applyDecoratedDescriptor(_class5.prototype, "setSelectedIndicatorId", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class5.prototype, "setSelectedIndicatorId"), _class5.prototype), _applyDecoratedDescriptor(_class5.prototype, "groupByOptions", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class5.prototype, "groupByOptions"), _class5.prototype), _applyDecoratedDescriptor(_class5.prototype, "selectedGroupByOption", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class5.prototype, "selectedGroupByOption"), _class5.prototype), _applyDecoratedDescriptor(_class5.prototype, "setGroupBy", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class5.prototype, "setGroupBy"), _class5.prototype)), _class5);

/***/ }),

/***/ "aJgA":
/*!****************************************!*\
  !*** ./js/pages/program_page/index.js ***!
  \****************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "i8i4");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _eventbus__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../eventbus */ "qtBC");
/* harmony import */ var router5__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! router5 */ "wgi2");
/* harmony import */ var router5_plugin_browser__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! router5-plugin-browser */ "0pHI");
/* harmony import */ var _components_indicator_list__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/indicator_list */ "KPAS");
/* harmony import */ var _components_program_metrics__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/program_metrics */ "rE5y");
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./models */ "YVM2");
/* harmony import */ var _general_utilities__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../general_utilities */ "WtQ/");
/* harmony import */ var _pinned_reports__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./pinned_reports */ "DaGC");
/* harmony import */ var _pinned_reports__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_pinned_reports__WEBPACK_IMPORTED_MODULE_9__);










/*
 * Model/Store setup
 */

var rootStore = new _models__WEBPACK_IMPORTED_MODULE_7__["ProgramPageStore"](jsContext.indicators, jsContext.program);
var uiStore = new _models__WEBPACK_IMPORTED_MODULE_7__["ProgramPageUIStore"](jsContext.result_chain_filter);
/*
 * Event Handlers
 */
// open indicator update modal with form loaded from server

_eventbus__WEBPACK_IMPORTED_MODULE_2__["default"].on('open-indicator-update-modal', function (indicatorId) {
  // Note: depends on indicator_list_modals.html
  var url = "/indicators/indicator_update/".concat(indicatorId, "/");
  $("#indicator_modal_content").empty();
  $("#modalmessages").empty();
  $("#indicator_modal_content").load(url);
  $("#indicator_modal_div").modal('show');
}); // get results html blob for indicator

_eventbus__WEBPACK_IMPORTED_MODULE_2__["default"].on('load-indicator-results', function (indicatorId) {
  if (!indicatorId) return;
  var url = "/indicators/result_table/".concat(indicatorId, "/").concat(rootStore.program.id, "/");
  $.get(url, function (data) {
    rootStore.addResultsHTML(indicatorId, data);
  });
}); // delete (hide) results html blob for indicator

_eventbus__WEBPACK_IMPORTED_MODULE_2__["default"].on('delete-indicator-results', function (indicatorId) {
  rootStore.deleteResultsHTML(indicatorId);
}); // reload singular indicator json obj

_eventbus__WEBPACK_IMPORTED_MODULE_2__["default"].on('reload-indicator', function (indicatorId) {
  $.get("/indicators/api/indicator/".concat(indicatorId), rootStore.indicatorStore.updateIndicator);
}); // reload all indicators json obj

_eventbus__WEBPACK_IMPORTED_MODULE_2__["default"].on('reload-all-indicators', function (programId) {
  $.get("/indicators/api/indicators/".concat(programId), function (data) {
    return rootStore.indicatorStore.setIndicators(data.indicators);
  });
}); // remove an indicator from the list
//eventBus.on('indicator-deleted', rootStore.indicatorStore.removeIndicator);
// close all expanded indicators in the table

_eventbus__WEBPACK_IMPORTED_MODULE_2__["default"].on('close-all-indicators', function () {
  rootStore.deleteAllResultsHTML();
}); // Indicator filters are controlled through routes
// these should no longer be called directly from components
// apply a gas gauge filter. Takes in IndicatorFilterType enum value

_eventbus__WEBPACK_IMPORTED_MODULE_2__["default"].on('apply-gauge-tank-filter', function (indicatorFilter) {
  // reset all filters
  _eventbus__WEBPACK_IMPORTED_MODULE_2__["default"].emit('clear-all-indicator-filters');
  uiStore.setIndicatorFilter(indicatorFilter);
}); // clear all gas tank and indicator select filters

_eventbus__WEBPACK_IMPORTED_MODULE_2__["default"].on('clear-all-indicator-filters', function () {
  uiStore.clearIndicatorFilter();
  _eventbus__WEBPACK_IMPORTED_MODULE_2__["default"].emit('select-indicator-to-filter', null);
  _eventbus__WEBPACK_IMPORTED_MODULE_2__["default"].emit('close-all-indicators');
}); // filter down by selecting individual indicator

_eventbus__WEBPACK_IMPORTED_MODULE_2__["default"].on('select-indicator-to-filter', function (selectedIndicatorId) {
  // clear gauge tank filters
  uiStore.clearIndicatorFilter();
  uiStore.setSelectedIndicatorId(selectedIndicatorId); // Open up results pane as well

  _eventbus__WEBPACK_IMPORTED_MODULE_2__["default"].emit('load-indicator-results', selectedIndicatorId);
});
/*
 * React components on page
 */

react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_indicator_list__WEBPACK_IMPORTED_MODULE_5__["IndicatorList"], {
  rootStore: rootStore,
  uiStore: uiStore,
  readonly: jsContext.readonly
}), document.querySelector('#indicator-list-react-component'));
react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_program_metrics__WEBPACK_IMPORTED_MODULE_6__["ProgramMetrics"], {
  rootStore: rootStore,
  uiStore: uiStore,
  indicatorOnScopeMargin: jsContext.indicator_on_scope_margin
}), document.querySelector('#program-metrics-react-component'));
/*
 * Copied and modified JS from indicator_list_modals.js to allow modals to work
 * without being completely converted to React
 */
// Open the CollectDataUpdate (update results) form in a modal

$("#indicator-list-react-component").on("click", ".results__link", function (e) {
  e.preventDefault();
  var url = $(this).attr("href");
  url += "?modal=1";
  $("#indicator_modal_content").empty();
  $("#modalmessages").empty();
  $("#indicator_results_modal_content").load(url);
  $("#indicator_results_div").modal('show');
}); // Open the IndicatorUpdate (Add targets btn in results section (HTML)) Form in a modal

$("#indicator-list-react-component").on("click", ".indicator-link[data-tab]", function (e) {
  e.preventDefault();
  var url = $(this).attr("href");
  url += "?modal=1";
  var tab = $(this).data("tab");

  if (tab && tab != '' && tab != undefined && tab != 'undefined') {
    url += "&targetsactive=true";
  }

  $("#indicator_modal_content").empty();
  $("#modalmessages").empty();
  $("#indicator_modal_content").load(url);
  $("#indicator_modal_div").modal('show');
}); // when indicator creation modal form completes a save

$('#indicator_modal_div').on('created.tola.indicator.save', function (e, params) {
  _eventbus__WEBPACK_IMPORTED_MODULE_2__["default"].emit('reload-indicator', params.indicatorId);
}); // when indicator update modal form completes a save or change to periodic targets

$('#indicator_modal_div').on('updated.tola.indicator.save', function (e, params) {
  var indicatorId = params.indicatorId;
  var programId = params.programId;
  _eventbus__WEBPACK_IMPORTED_MODULE_2__["default"].emit('reload-all-indicators', programId);

  if (rootStore.resultsMap.has(indicatorId)) {
    _eventbus__WEBPACK_IMPORTED_MODULE_2__["default"].emit('load-indicator-results', indicatorId);
  }
}); // when indicator is deleted from modal

$('#indicator_modal_div').on('deleted.tola.indicator.save', function (e, params) {
  _eventbus__WEBPACK_IMPORTED_MODULE_2__["default"].emit('reload-all-indicators', params.programId);
}); // When "add results" modal is closed, the targets data needs refreshing
// the indicator itself also needs refreshing for the gas tank gauge

$('#indicator_results_div').on('hidden.bs.modal', function (e) {
  var recordchanged = $(this).find('form').data('recordchanged');

  if (recordchanged === true) {
    var indicator_id = $(this).find('form #id_indicator').val();
    _eventbus__WEBPACK_IMPORTED_MODULE_2__["default"].emit('load-indicator-results', indicator_id);
    _eventbus__WEBPACK_IMPORTED_MODULE_2__["default"].emit('reload-indicator', indicator_id);
  }
});
/*
 * Routes setup:
 */

var routes = [{
  name: 'all',
  path: '/',
  filterType: _models__WEBPACK_IMPORTED_MODULE_7__["IndicatorFilterType"].noFilter
}, {
  name: 'targets',
  path: '/targets',
  filterType: _models__WEBPACK_IMPORTED_MODULE_7__["IndicatorFilterType"].missingTarget
}, {
  name: 'results',
  path: '/results',
  filterType: _models__WEBPACK_IMPORTED_MODULE_7__["IndicatorFilterType"].missingResults
}, {
  name: 'evidence',
  path: '/evidence',
  filterType: _models__WEBPACK_IMPORTED_MODULE_7__["IndicatorFilterType"].missingEvidence
}, {
  name: 'scope',
  path: '/scope',
  forwardTo: 'scope.on'
}, {
  name: 'scope.on',
  path: '/on',
  filterType: _models__WEBPACK_IMPORTED_MODULE_7__["IndicatorFilterType"].onTarget
}, {
  name: 'scope.above',
  path: '/above',
  filterType: _models__WEBPACK_IMPORTED_MODULE_7__["IndicatorFilterType"].aboveTarget
}, {
  name: 'scope.below',
  path: '/below',
  filterType: _models__WEBPACK_IMPORTED_MODULE_7__["IndicatorFilterType"].belowTarget
}, {
  name: 'indicator',
  path: '/indicator/:indicator_id<\\d+>',
  filterType: _models__WEBPACK_IMPORTED_MODULE_7__["IndicatorFilterType"].noFilter
}];
var router = Object(router5__WEBPACK_IMPORTED_MODULE_3__["default"])(routes, {
  defaultRoute: 'all',
  //unrouted: show all indicators
  defaultParams: {},
  trailingSlashMode: 'always'
});

var onNavigation = function onNavigation(navRoutes) {
  var routeName = navRoutes.route.name;
  var params = navRoutes.route.params;

  if (routeName === 'indicator') {
    _eventbus__WEBPACK_IMPORTED_MODULE_2__["default"].emit('select-indicator-to-filter', parseInt(params.indicator_id));
    return;
  }

  var routeObj = routes.find(function (r) {
    return r.name === routeName;
  });
  _eventbus__WEBPACK_IMPORTED_MODULE_2__["default"].emit('apply-gauge-tank-filter', routeObj.filterType);
};

router.usePlugin(Object(router5_plugin_browser__WEBPACK_IMPORTED_MODULE_4__["default"])({
  useHash: true,
  base: '/program/' + jsContext.program.id + '/'
}));
router.subscribe(onNavigation);
router.start(); // nav events

_eventbus__WEBPACK_IMPORTED_MODULE_2__["default"].on('nav-apply-gauge-tank-filter', function (indicatorFilter) {
  // Find route based on filter type and go
  var routeObj = routes.find(function (r) {
    return r.filterType === indicatorFilter;
  });
  router.navigate(routeObj.name);
});
_eventbus__WEBPACK_IMPORTED_MODULE_2__["default"].on('nav-clear-all-indicator-filters', function () {
  router.navigate('all');
});
_eventbus__WEBPACK_IMPORTED_MODULE_2__["default"].on('nav-select-indicator-to-filter', function (selectedIndicatorId) {
  router.navigate('indicator', {
    'indicator_id': selectedIndicatorId
  });
});
Object(_general_utilities__WEBPACK_IMPORTED_MODULE_8__["reloadPageIfCached"])();

/***/ }),

/***/ "hzyr":
/*!***************************************************!*\
  !*** ./js/components/indicatorModalComponents.js ***!
  \***************************************************/
/*! exports provided: AddIndicatorButton, UpdateIndicatorButton */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AddIndicatorButton", function() { return AddIndicatorButton; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UpdateIndicatorButton", function() { return UpdateIndicatorButton; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "okNM");
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }



var AddIndicatorButton = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref) {
  var readonly = _ref.readonly,
      params = _objectWithoutProperties(_ref, ["readonly"]);

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
    type: "button",
    disabled: readonly,
    className: "btn btn-link btn-add",
    onClick: function onClick(e) {
      openCreateIndicatorFormModal(params);
    }
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
    className: "fas fa-plus-circle"
  }), " ", gettext("Add indicator"));
});
var UpdateIndicatorButton = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref2) {
  var readonly = _ref2.readonly,
      _ref2$label = _ref2.label,
      label = _ref2$label === void 0 ? null : _ref2$label,
      params = _objectWithoutProperties(_ref2, ["readonly", "label"]);

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
    type: "button",
    disabled: readonly,
    className: "btn btn-link",
    onClick: function onClick(e) {
      openUpdateIndicatorFormModal(params);
    }
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
    className: "fas fa-cog"
  }), label);
});

/***/ }),

/***/ "qtBC":
/*!************************!*\
  !*** ./js/eventbus.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var nanobus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! nanobus */ "7+Rn");
/* harmony import */ var nanobus__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(nanobus__WEBPACK_IMPORTED_MODULE_0__);
// A global instance of an event bus

var globalEventBus = nanobus__WEBPACK_IMPORTED_MODULE_0___default()();
/* harmony default export */ __webpack_exports__["default"] = (globalEventBus);

/***/ }),

/***/ "rE5y":
/*!*************************************************************!*\
  !*** ./js/pages/program_page/components/program_metrics.js ***!
  \*************************************************************/
/*! exports provided: ProgramMetrics */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProgramMetrics", function() { return ProgramMetrics; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "TSYQ");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var _eventbus__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../eventbus */ "qtBC");
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../models */ "YVM2");
/* harmony import */ var _date_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../date_utils */ "LBcr");
var _class, _temp, _class3, _temp2;

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }








var GaugeTank = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class = (_temp =
/*#__PURE__*/
function (_React$Component) {
  _inherits(GaugeTank, _React$Component);

  function GaugeTank() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, GaugeTank);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(GaugeTank)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.handleClick = function (e) {
      e.preventDefault();

      if (!_this.props.disabled && _this.unfilledPercent != 0) {
        _eventbus__WEBPACK_IMPORTED_MODULE_3__["default"].emit('nav-apply-gauge-tank-filter', _this.props.filterType);
      }
    };

    return _this;
  }

  _createClass(GaugeTank, [{
    key: "render",
    value: function render() {
      var tickCount = 10;
      var _this$props = this.props,
          allIndicatorsLength = _this$props.allIndicatorsLength,
          filteredIndicatorsLength = _this$props.filteredIndicatorsLength,
          title = _this$props.title,
          filledLabel = _this$props.filledLabel,
          unfilledLabel = _this$props.unfilledLabel,
          cta = _this$props.cta,
          emptyLabel = _this$props.emptyLabel,
          disabled = _this$props.disabled;
      var filterType = this.props.filterType;
      var currentIndicatorFilter = this.props.currentIndicatorFilter;
      var isHighlighted = filterType === currentIndicatorFilter; // Gauge should only show 100%/0% if filtered == all/0 (absolute 100%, not rounding to 100%)
      // to accomplish this, added a Math.max and Math.min to prevent rounding to absolute values:

      var unfilledPercent = allIndicatorsLength <= 0 || allIndicatorsLength == filteredIndicatorsLength ? 100 : filteredIndicatorsLength == 0 ? 0 : Math.max(1, Math.min(Math.round(filteredIndicatorsLength / allIndicatorsLength * 100), 99));
      this.unfilledPercent = unfilledPercent;
      var filledPercent = 100 - unfilledPercent;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('gauge', {
          'filter-trigger': unfilledPercent > 0 && !disabled,
          'is-highlighted': isHighlighted
        }),
        onClick: this.handleClick
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h6", {
        className: "gauge__title"
      }, title), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "gauge__overview"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "gauge__graphic gauge__graphic--tank{% if filled_percent == 0 %} gauge__graphic--empty{% endif %}"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "graphic__tick-marks"
      }, _toConsumableArray(Array(tickCount)).map(function (e, i) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          key: i,
          className: "graphic__tick"
        });
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "graphic__tank--unfilled",
        style: {
          'flexBasis': "".concat(unfilledPercent, "%")
        }
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "graphic__tank--filled",
        style: {
          'flexBasis': "".concat(filledPercent, "%")
        }
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "gauge__labels"
      }, filledPercent > 0 ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "gauge__label text-muted"
      }, unfilledPercent, "% ", unfilledLabel), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "gauge__label"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "gauge__value"
      }, filledPercent, "% ", filledLabel))) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "gauge__label"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "text-danger"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, emptyLabel))))), unfilledPercent > 0 && !disabled && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "gauge__cta"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "btn-link btn-inline"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-exclamation-triangle text-warning"
      }), " ", cta), "\xA0"));
    }
  }]);

  return GaugeTank;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp)) || _class;

var GaugeBand = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class3 = (_temp2 =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(GaugeBand, _React$Component2);

  function GaugeBand(props) {
    var _this2;

    _classCallCheck(this, GaugeBand);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(GaugeBand).call(this, props));

    _this2.onFilterLinkClick = function (e, filterType) {
      e.preventDefault();
      _eventbus__WEBPACK_IMPORTED_MODULE_3__["default"].emit('nav-apply-gauge-tank-filter', filterType);
    };

    _this2.handledFilterTypes = new Set([_models__WEBPACK_IMPORTED_MODULE_4__["IndicatorFilterType"].aboveTarget, _models__WEBPACK_IMPORTED_MODULE_4__["IndicatorFilterType"].belowTarget, _models__WEBPACK_IMPORTED_MODULE_4__["IndicatorFilterType"].onTarget]);
    return _this2;
  }

  _createClass(GaugeBand, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      // Enable popovers after update (they break otherwise)
      $(this.el).find('[data-toggle="popover"]').popover({
        html: true
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var tickCount = 10;
      var _this$props2 = this.props,
          indicatorStore = _this$props2.indicatorStore,
          program = _this$props2.program;
      var currentIndicatorFilter = this.props.currentIndicatorFilter;
      var isHighlighted = this.handledFilterTypes.has(currentIndicatorFilter);
      var totalIndicatorCount = indicatorStore.indicators.length;
      var nonReportingCount = indicatorStore.getIndicatorsNotReporting.length;
      var highCount = indicatorStore.getIndicatorsAboveTarget.length;
      var lowCount = indicatorStore.getIndicatorsBelowTarget.length;
      var onTargetCount = indicatorStore.getIndicatorsOnTarget.length; //100 and 0 should only represent absolute "all" and "none" values respectively (no round to 100 or to 0)

      var makePercent = totalIndicatorCount > 0 ? function (x) {
        return x == totalIndicatorCount ? 100 : x == 0 ? 0 : Math.max(1, Math.min(Math.round(x / totalIndicatorCount * 100), 99));
      } : function (x) {
        return 0;
      };
      var percentHigh = makePercent(highCount);
      var percentOnTarget = makePercent(onTargetCount);
      var percentBelow = makePercent(lowCount);
      var percentNonReporting = makePercent(nonReportingCount);
      var marginPercent = this.props.indicatorOnScopeMargin * 100;
      var programPeriodStartDate = Object(_date_utils__WEBPACK_IMPORTED_MODULE_5__["localDateFromISOString"])(program.reporting_period_start);
      var gaugeHasErrors = indicatorStore.getIndicatorsReporting.length === 0 || indicatorStore.getTotalResultsCount === 0; // Top level wrapper of component

      var Gauge = function Gauge(props) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('gauge', {
            'is-highlighted': isHighlighted
          }),
          ref: function ref(el) {
            return _this3.el = el;
          }
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h6", {
          className: "gauge__title"
        }, gettext('Indicators on track')), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          className: "gauge__overview"
        }, props.children));
      };

      var GaugeLabels = function GaugeLabels(props) {
        // success case
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          className: "gauge__labels"
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          className: "gauge__label"
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
          className: "text-muted"
        },
        /* # Translators: variable %s shows what percentage of indicators have no targets reporting data. Example: 31% unavailable */
        interpolate(gettext('%(percentNonReporting)s% unavailable'), {
          percentNonReporting: percentNonReporting
        }, true)), ' ', react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
          href: "#",
          tabIndex: "0",
          "data-toggle": "popover",
          "data-placement": "right",
          "data-trigger": "focus",
          "data-content":
          /* # Translators: help text for the percentage of indicators with no targets reporting data. */
          gettext("The indicator has no targets, no completed target periods, or no results reported."),
          onClick: function onClick(e) {
            return e.preventDefault();
          }
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "far fa-question-circle"
        }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          className: "gauge__label"
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
          className: "gauge__value--above filter-trigger--band",
          onClick: function onClick(e) {
            return _this3.onFilterLinkClick(e, _models__WEBPACK_IMPORTED_MODULE_4__["IndicatorFilterType"].aboveTarget);
          },
          dangerouslySetInnerHTML: aboveTargetMarkup()
        })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          className: "gauge__label"
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
          className: "gauge__value filter-trigger--band",
          onClick: function onClick(e) {
            return _this3.onFilterLinkClick(e, _models__WEBPACK_IMPORTED_MODULE_4__["IndicatorFilterType"].onTarget);
          },
          dangerouslySetInnerHTML: onTargetMarkup()
        }), ' ', react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
          href: "#",
          tabIndex: "0",
          "data-toggle": "popover",
          "data-placement": "right",
          "data-trigger": "focus",
          "data-content":
          /* # Translators: Help text explaining what an "on track" indicator is. */
          gettext("The actual value matches the target value, plus or minus 15%. So if your target is 100 and your result is 110, the indicator is 10% above target and on track.  <br><br>Please note that if your indicator has a decreasing direction of change, then “above” and “below” are switched. In that case, if your target is 100 and your result is 200, your indicator is 50% below target and not on track.<br><br><a href='https://docs.google.com/document/d/1Gl9bxJJ6hdhCXeoOCoR1mnVKZa2FlEOhaJcjexiHzY0' target='_blank'>See our documentation for more information.</a>"),
          onClick: function onClick(e) {
            return e.preventDefault();
          }
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "far fa-question-circle"
        }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          className: "gauge__label"
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
          className: "gauge__value--below filter-trigger--band",
          onClick: function onClick(e) {
            return _this3.onFilterLinkClick(e, _models__WEBPACK_IMPORTED_MODULE_4__["IndicatorFilterType"].belowTarget);
          },
          dangerouslySetInnerHTML: belowTargetMarkup()
        })));
      }; // Handle strings containing HTML markup


      var aboveTargetMarkup = function aboveTargetMarkup() {
        /* # Translators: variable %(percentHigh)s shows what percentage of indicators are a certain percentage above target percent %(marginPercent)s. Example: 31% are >15% above target */
        var s = gettext('<strong>%(percentHigh)s%</strong> are >%(marginPercent)s% above target');
        return {
          __html: interpolate(s, {
            percentHigh: percentHigh,
            marginPercent: marginPercent
          }, true)
        };
      };

      var onTargetMarkup = function onTargetMarkup() {
        /* # Translators: variable %s shows what percentage of indicators are within a set range of target. Example: 31%  are on track */
        var s = gettext('<strong>%s%</strong> are on track');
        return {
          __html: interpolate(s, [percentOnTarget])
        };
      };

      var belowTargetMarkup = function belowTargetMarkup() {
        /* # Translators: variable %(percentBelow)s shows what percentage of indicators are a certain percentage below target. The variable %(marginPercent)s is that percentage. Example: 31% are >15% below target */
        var s = gettext('<strong>%(percentBelow)s%</strong> are >%(marginPercent)s% below target');
        return {
          __html: interpolate(s, {
            percentBelow: percentBelow,
            marginPercent: marginPercent
          }, true)
        };
      };

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Gauge, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "gauge__graphic gauge__graphic--performance-band"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "graphic__tick-marks"
      }, _toConsumableArray(Array(tickCount)).map(function (e, i) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          key: i,
          className: "graphic__tick"
        });
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "graphic__performance-band--above-target",
        style: {
          'flexBasis': "".concat(percentHigh, "%")
        }
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "graphic__performance-band--on-target",
        style: {
          'flexBasis': "".concat(percentOnTarget, "%")
        }
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "graphic__performance-band--below-target",
        style: {
          'flexBasis': "".concat(percentBelow, "%")
        }
      })), gaugeHasErrors ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "gauge__labels"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "gauge__label"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
        className: "text-muted"
      }, gettext("Unavailable until the first target period ends with results reported.")))) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(GaugeLabels, null));
    }
  }]);

  return GaugeBand;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp2)) || _class3;

var ProgramMetrics = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(function (props) {
  var program = props.rootStore.program;
  var indicatorStore = props.rootStore.indicatorStore;
  var indicators = indicatorStore.indicators;
  var currentIndicatorFilter = props.uiStore.currentIndicatorFilter;
  var indicatorOnScopeMargin = this.props.indicatorOnScopeMargin; // Use objs for labels below to allow for translator notes to be added

  var targetLabels = {
    /* # Translators: title of a graphic showing indicators with targets */
    title: gettext("Indicators with targets"),

    /* # Translators: a label in a graphic. Example: 31% have targets */
    filledLabel: gettext("have targets"),

    /* # Translators: a label in a graphic. Example: 31% no targets */
    unfilledLabel: gettext("no targets"),

    /* # Translators: a link that displays a filtered list of indicators which are missing targets */
    cta: gettext("Indicators missing targets"),
    emptyLabel: gettext("No targets")
  };
  var resultsLabels = {
    /* # Translators: title of a graphic showing indicators with results */
    title: gettext("Indicators with results"),

    /* # Translators: a label in a graphic. Example: 31% have results */
    filledLabel: gettext("have results"),

    /* # Translators: a label in a graphic. Example: 31% no results */
    unfilledLabel: gettext("no results"),

    /* # Translators: a link that displays a filtered list of indicators which are missing results */
    cta: gettext("Indicators missing results"),
    emptyLabel: gettext("No results")
  };
  var evidenceLabels = {
    /* # Translators: title of a graphic showing results with evidence */
    title: gettext("Results with evidence"),

    /* # Translators: a label in a graphic. Example: 31% have evidence */
    filledLabel: gettext("have evidence"),

    /* # Translators: a label in a graphic. Example: 31% no evidence */
    unfilledLabel: gettext("no evidence"),

    /* # Translators: a link that displays a filtered list of indicators which are missing evidence */
    cta: gettext("Indicators missing evidence"),
    emptyLabel: gettext("No evidence")
  }; // Are some targets defined on any indicators?
  // all_targets_defined is an int (1,0) instead of bool

  var someTargetsDefined = indicators.map(function (i) {
    return i.all_targets_defined === 1;
  }).some(function (b) {
    return b;
  }); // Do any indicators have results?

  var someResults = indicators.map(function (i) {
    return i.results_count;
  }).some(function (count) {
    return count > 0;
  }); // Do not display on pages with no indicators

  if (indicators.length === 0) return null;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "status__gauges"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(GaugeBand, {
    currentIndicatorFilter: currentIndicatorFilter,
    indicatorOnScopeMargin: indicatorOnScopeMargin,
    indicatorStore: indicatorStore,
    program: program
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(GaugeTank, _extends({
    filterType: _models__WEBPACK_IMPORTED_MODULE_4__["IndicatorFilterType"].missingTarget,
    currentIndicatorFilter: currentIndicatorFilter,
    allIndicatorsLength: indicators.length,
    filteredIndicatorsLength: indicatorStore.getIndicatorsNeedingTargets.length
  }, targetLabels)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(GaugeTank, _extends({
    filterType: _models__WEBPACK_IMPORTED_MODULE_4__["IndicatorFilterType"].missingResults,
    currentIndicatorFilter: currentIndicatorFilter,
    allIndicatorsLength: indicators.length,
    filteredIndicatorsLength: indicatorStore.getIndicatorsNeedingResults.length,
    disabled: !someTargetsDefined
  }, resultsLabels)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(GaugeTank, _extends({
    filterType: _models__WEBPACK_IMPORTED_MODULE_4__["IndicatorFilterType"].missingEvidence,
    currentIndicatorFilter: currentIndicatorFilter // The names below are misleading as this gauge is measuring *results*, not indicators
    ,
    allIndicatorsLength: indicatorStore.getTotalResultsCount,
    filteredIndicatorsLength: indicatorStore.getTotalResultsCount - indicatorStore.getTotalResultsWithEvidenceCount,
    disabled: !someTargetsDefined || !someResults
  }, evidenceLabels)));
});

/***/ })

},[["aJgA","runtime","vendors"]]]);
//# sourceMappingURL=program_page-4a538de9999890cb74e0.js.map