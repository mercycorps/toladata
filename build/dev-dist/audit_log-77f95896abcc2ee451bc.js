(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["audit_log"],{

/***/ "49gj":
/*!***********************************************************!*\
  !*** ./js/pages/tola_management_pages/audit_log/views.js ***!
  \***********************************************************/
/*! exports provided: DisaggregationDiffs, ResultChangeset, IndicatorChangeset, IndicatorNameSpan, IndexView */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DisaggregationDiffs", function() { return DisaggregationDiffs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ResultChangeset", function() { return ResultChangeset; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IndicatorChangeset", function() { return IndicatorChangeset; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IndicatorNameSpan", function() { return IndicatorNameSpan; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IndexView", function() { return IndexView; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var _components_pagination__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../components/pagination */ "RCjz");
/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ "IP2g");
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! mobx */ "2vnA");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! classnames */ "TSYQ");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _components_indicatorModalComponents__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../components/indicatorModalComponents */ "hzyr");
/* harmony import */ var _components_loading_spinner__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../components/loading-spinner */ "DDFe");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }









var emptyValue = "—";
var DisaggregationDiffs = function DisaggregationDiffs(_ref) {
  var disagg_type = _ref.disagg_type,
      disagg_diffs = _ref.disagg_diffs;
  disagg_diffs.sort(function (a, b) {
    return a.custom_sort - b.custom_sort;
  });
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h4", {
    className: "disagg-type__title text-small"
  }, gettext(disagg_type)), disagg_diffs.map(function (diff) {
    var displayValue = ["", null, undefined].includes(diff.value) ? emptyValue : localizeNumber(normalizeNumber(diff.value));
    var displayClasses = classnames__WEBPACK_IMPORTED_MODULE_5___default()("change__field__value", {
      "empty-value": displayValue === emptyValue
    });
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "change__field",
      key: diff.id
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "change__field__name"
    }, diff.name, ":"), " ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: displayClasses
    }, displayValue));
  }));
};
var ResultChangeset = function ResultChangeset(_ref2) {
  var data = _ref2.data,
      name = _ref2.name,
      pretty_name = _ref2.pretty_name;
  var displayValue = "";

  if (["", null, undefined].includes(data)) {
    displayValue = emptyValue;
  } else if (isNaN(data)) {
    displayValue = data;
  } else {
    displayValue = localizeNumber(data);
  }

  if (name === 'id') {
    return null;
  } else if (name === 'evidence_url') {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "change__field"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", {
      className: "change__field__name"
    }, pretty_name), ": ", data !== 'N/A' && data !== '' ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
      className: "change__field__value--evidence-url",
      href: displayValue,
      target: "_blank"
    }, displayValue) : data);
  } else if (name === 'disaggregation_values') {
    if (Object.entries(data).length) {
      var groupedDiffs = {};
      Object.values(data).forEach(function (entry) {
        var groupKey = entry.type || "__none__";

        if (entry.type in groupedDiffs) {
          groupedDiffs[groupKey].push(entry);
        } else {
          groupedDiffs[groupKey] = [entry];
        }
      });
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "changelog__change__targets"
      }, Object.keys(groupedDiffs).sort().map(function (typeName) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(DisaggregationDiffs, {
          key: typeName + '_diff',
          disagg_type: typeName === "__none__" ? "" : typeName,
          disagg_diffs: groupedDiffs[typeName]
        });
      }));
    } else {
      return null;
    }
  } else {
    var displayClasses = classnames__WEBPACK_IMPORTED_MODULE_5___default()("change__field__value", {
      "empty-value": displayValue === emptyValue
    });
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "change__field"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", {
      className: "change__field__name"
    }, pretty_name), ": ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: displayClasses
    }, displayValue));
  }
};

var ProgramDatesChangeset = function ProgramDatesChangeset(_ref3) {
  var data = _ref3.data,
      name = _ref3.name,
      pretty_name = _ref3.pretty_name;
  var displayValue = ["", null].includes(data) ? "–" : data;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, pretty_name, ": ", displayValue);
};

var IndicatorChangeset = function IndicatorChangeset(_ref4) {
  var data = _ref4.data,
      name = _ref4.name,
      pretty_name = _ref4.pretty_name,
      indicator = _ref4.indicator;

  if (name === "baseline_na") {
    return null;
  }

  if (name === 'targets') {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "changelog__change__targets"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h4", {
      className: "text-small"
    }, gettext('Targets changed')), Object.entries(data).map(function (_ref5) {
      var _ref6 = _slicedToArray(_ref5, 2),
          id = _ref6[0],
          target = _ref6[1];

      var displayValue = ["", null, undefined].includes(target.value) ? emptyValue : localizeNumber(target.value);
      var displayClasses = classnames__WEBPACK_IMPORTED_MODULE_5___default()({
        "empty-value": displayValue === emptyValue
      });
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "change__field",
        key: id
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", {
        className: "change__field__name"
      }, target.name, ":"), " ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: displayClasses
      }, displayValue));
    }));
  } else {
    var displayValue = "";

    if (["", null, undefined].includes(data)) {
      displayValue = emptyValue;
    } else if (isNaN(data)) {
      displayValue = data;
    } else {
      displayValue = localizeNumber(data);
    }

    if (name === "baseline_value" && displayValue === emptyValue) {
      // Need to differentiate between no value (new indicator) and "N/A" (from N/A checkbox)
      displayValue = data === "" ? emptyValue : "N/A";
    }

    var displayClasses = classnames__WEBPACK_IMPORTED_MODULE_5___default()({
      "empty-value": displayValue === emptyValue
    });
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "change__field"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", {
      className: "change__field__name"
    }, name === 'name' ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, gettext('Indicator'), " ", indicator.results_aware_number, ": ") : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, pretty_name, ": ")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: displayClasses
    }, displayValue));
  }
};

var ResultLevelChangeset = function ResultLevelChangeset(_ref7) {
  var data = _ref7.data,
      name = _ref7.name,
      pretty_name = _ref7.pretty_name,
      level = _ref7.level;
  var displayValue = ["", null, undefined].includes(data) ? emptyValue : data.toString();
  var displayClasses = displayValue === emptyValue ? "empty-value" : null;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "change__field"
  }, name !== 'name' ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", {
    className: "change__field__name"
  }, pretty_name, ": ") : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
    className: "field__level-tier"
  }, level.tier, " ", level.display_ontology, ": ")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
    className: displayClasses
  }, displayValue));
};

var ChangesetEntry = /*#__PURE__*/function (_React$Component) {
  _inherits(ChangesetEntry, _React$Component);

  var _super = _createSuper(ChangesetEntry);

  function ChangesetEntry() {
    _classCallCheck(this, ChangesetEntry);

    return _super.apply(this, arguments);
  }

  _createClass(ChangesetEntry, [{
    key: "renderType",
    value: function renderType(type, data, name, pretty_name, indicator, level) {
      switch (type) {
        case 'indicator_changed':
        case 'indicator_created':
        case 'indicator_deleted':
          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorChangeset, {
            data: data,
            name: name,
            pretty_name: pretty_name,
            indicator: indicator,
            level: level
          });
          break;

        case 'result_changed':
        case 'result_created':
        case 'result_deleted':
          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ResultChangeset, {
            data: data,
            name: name,
            pretty_name: pretty_name
          });
          break;

        case 'program_dates_changed':
          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ProgramDatesChangeset, {
            data: data,
            name: name,
            pretty_name: pretty_name
          });
          break;

        case 'level_changed':
          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ResultLevelChangeset, {
            data: data,
            name: name,
            pretty_name: pretty_name,
            level: level
          });
          break;
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          data = _this$props.data,
          type = _this$props.type,
          name = _this$props.name,
          pretty_name = _this$props.pretty_name,
          indicator = _this$props.indicator,
          level = _this$props.level;
      return this.renderType(type, data, name, pretty_name, indicator, level);
    }
  }]);

  return ChangesetEntry;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

var IndicatorNameSpan = function IndicatorNameSpan(_ref8) {
  var indicator = _ref8.indicator,
      result_info = _ref8.result_info;

  if (!indicator) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, gettext('N/A'));
  }

  var indicator_output = '';

  if (indicator.results_aware_number) {
    indicator_output = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, gettext('Indicator'), " ", indicator.results_aware_number, ":"), " ", indicator.name);
  } else {
    indicator_output = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, gettext('Indicator'), ":"), " ", indicator.name);
  } // # Translators: This is part of a change log.  The result date of the Result that has been changed is being shown


  var result_output = result_info ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    className: "mt-2"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, gettext("Result date:")), " ", result_info.date) : null;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, indicator_output, result_output);
};

var ResultLevel = function ResultLevel(_ref9) {
  var indicator = _ref9.indicator,
      level = _ref9.level;

  if (level) {
    return "".concat(level.tier, " ").concat(level.display_ontology);
  }

  if (indicator) {
    if (indicator.leveltier_name && indicator.level_display_ontology) return "".concat(indicator.leveltier_name, " ").concat(indicator.level_display_ontology);else if (indicator.leveltier_name) return indicator.leveltier_name;
  }

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, gettext('N/A'));
};

var IndexView = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref10) {
  var store = _ref10.store;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    id: "audit-log-index-view"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("header", {
    className: "page-title"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h1", {
    className: "page-title h2"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
    href: "/program/".concat(store.program_id, "/")
  }, store.program_name), ": ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
    className: "font-weight-normal text-muted text-nowrap"
  }, gettext("Indicator change log"), "\xA0", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("small", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
    className: "fa fa-history"
  }))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "admin-list__controls"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "controls__bulk-actions"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "btn-group"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_indicatorModalComponents__WEBPACK_IMPORTED_MODULE_6__["ExpandAllButton"], {
    clickHandler: function clickHandler() {
      return store.expandAllExpandos();
    },
    disabled: store.log_rows.length === store.expando_rows.size
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_indicatorModalComponents__WEBPACK_IMPORTED_MODULE_6__["CollapseAllButton"], {
    clickHandler: function clickHandler() {
      return store.collapseAllExpandos();
    },
    disabled: store.expando_rows.size === 0
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "controls__buttons"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
    className: "btn btn-secondary btn-sm",
    href: "/api/tola_management/program/".concat(store.program_id, "/export_audit_log")
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
    className: "fas fa-download"
  }), gettext("Excel")))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "admin-list__table"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_loading_spinner__WEBPACK_IMPORTED_MODULE_7__["default"], {
    isLoading: store.fetching
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("table", {
    className: "table table-sm table-bordered bg-white text-small changelog"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("thead", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    className: "text-nowrap"
  }, gettext("Date and time")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    className: "text-nowrap"
  }, gettext("Result level")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    className: "text-nowrap"
  }, gettext("Indicators and results")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    className: "text-nowrap"
  }, gettext("User")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    className: "text-nowrap"
  }, gettext("Organization")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    className: "text-nowrap"
  }, gettext("Change type")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    className: "text-nowrap"
  }, gettext("Previous entry")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    className: "text-nowrap"
  }, gettext("New entry")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    className: "text-nowrap"
  }, gettext("Reason for change")))), store.log_rows.map(function (data) {
    var is_expanded = store.expando_rows.has(data.id);
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tbody", {
      key: data.id
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
      className: is_expanded ? 'changelog__entry__header is-expanded' : 'changelog__entry__header',
      onClick: function onClick() {
        return store.toggleRowExpando(data.id);
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
      className: "text-action"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_3__["FontAwesomeIcon"], {
      icon: is_expanded ? 'caret-down' : 'caret-right'
    }), "\xA0", data.date, " (UTC)"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ResultLevel, {
      indicator: data.indicator,
      level: data.level
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorNameSpan, {
      indicator: data.indicator,
      result_info: data.result_info
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, data.user), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, data.organization), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
      className: "text-nowrap"
    }, data.pretty_change_type), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
      className: "text-action"
    }, is_expanded ? '' : '...'), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
      className: "text-action"
    }, is_expanded ? '' : '...'), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
      className: "text-action"
    }, is_expanded ? '' : '...')), is_expanded && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
      className: "changelog__entry__row",
      key: data.id
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
      className: "changelog__change--prev"
    }, data.diff_list.map(function (changeset) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangesetEntry, {
        key: changeset.name,
        name: changeset.name,
        pretty_name: changeset.pretty_name,
        type: data.change_type,
        data: changeset.prev,
        indicator: data.indicator,
        level: data.level
      });
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
      className: "changelog__change--new"
    }, data.diff_list.map(function (changeset) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangesetEntry, {
        key: changeset.name,
        name: changeset.name,
        pretty_name: changeset.pretty_name,
        type: data.change_type,
        data: changeset["new"],
        indicator: data.indicator,
        level: data.level
      });
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
      className: "changelog__change--rationale"
    }, data.rationale_selected_options && data.rationale_selected_options.map(function (option) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, {
        key: option
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "changelog__change--rationale-option"
      }, option), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("br", null));
    }), data.rationale_selected_options && data.rationale_selected_options.length > 0 && data.rationale && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("br", null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "changelog__change--rationale-text"
    }, data.rationale))));
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "admin-list__metadata"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "metadata__count text-muted text-small"
  }, store.entries_count ? "".concat(store.entries_count, " ").concat(gettext("entries")) : "--"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "metadata__controls"
  }, store.total_pages && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_pagination__WEBPACK_IMPORTED_MODULE_2__["default"], {
    pageCount: store.total_pages,
    initialPage: store.current_page,
    onPageChange: function onPageChange(page) {
      return store.changePage(page);
    }
  })))));
});

/***/ }),

/***/ "6bbB":
/*!***********************************************************!*\
  !*** ./js/pages/tola_management_pages/audit_log/index.js ***!
  \***********************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "i8i4");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./models */ "qnQo");
/* harmony import */ var _views__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./views */ "49gj");




/*
 * Model/Store setup
 */

var store = new _models__WEBPACK_IMPORTED_MODULE_2__["ProgramAuditLogStore"](jsContext.program_id, jsContext.program_name);
react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_views__WEBPACK_IMPORTED_MODULE_3__["IndexView"], {
  store: store
}), document.querySelector('#app_root'));

/***/ }),

/***/ "DDFe":
/*!******************************************!*\
  !*** ./js/components/loading-spinner.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }



var LoadingSpinner = function LoadingSpinner(_ref) {
  var children = _ref.children,
      isLoading = _ref.isLoading,
      className = _ref.className,
      props = _objectWithoutProperties(_ref, ["children", "isLoading", "className"]);

  var loading = isLoading ? 'loading' : '';
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", _extends({
    className: 'loading-spinner__container ' + loading + ' ' + (className || '')
  }, props), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "loading-spinner__overlay"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "loading-spinner__spinner"
  })), children);
};

/* harmony default export */ __webpack_exports__["default"] = (LoadingSpinner);

/***/ }),

/***/ "RCjz":
/*!*************************************!*\
  !*** ./js/components/pagination.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_paginate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-paginate */ "I+5a");
/* harmony import */ var react_paginate__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_paginate__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mobx-react */ "okNM");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }




/***
    Props:

    - pageCount: total number of pages
    - initialPage: which page should be highlighted as active initially
    - onPageChange: a function to receive the newly selected page
*/

var Pagination = function Pagination(props) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_paginate__WEBPACK_IMPORTED_MODULE_1___default.a, _extends({
    previousLabel: '‹',
    previousClassName: 'page-item previous',
    previousLinkClassName: 'page-link',
    nextLabel: '›',
    nextClassName: 'page-item next',
    nextLinkClassName: 'page-link',
    breakLabel: "...",
    disabledClassName: 'disabled',
    breakClassName: 'page-item disabled',
    breakLinkClassName: 'page-link',
    pageClassName: 'page-item',
    pageLinkClassName: 'page-link',
    marginPagesDisplayed: 2,
    pageRangeDisplayed: 5,
    containerClassName: "pagination",
    activeClassName: "active"
  }, props));
};

/* harmony default export */ __webpack_exports__["default"] = (Pagination);

/***/ }),

/***/ "XoI5":
/*!*******************!*\
  !*** ./js/api.js ***!
  \*******************/
/*! exports provided: api */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "api", function() { return api; });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "vDqi");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);

var api = axios__WEBPACK_IMPORTED_MODULE_0___default.a.create({
  withCredentials: true,
  baseURL: '/api/',
  headers: {
    "X-CSRFToken": document.cookie.replace(/(?:(?:^|.*;\s*)csrftoken\s*\=\s*([^;]*).*$)|^.*$/, "$1")
  }
});

/***/ }),

/***/ "h6br":
/*!*********************************************************!*\
  !*** ./js/pages/tola_management_pages/audit_log/api.js ***!
  \*********************************************************/
/*! exports provided: fetchProgramAuditLogWithFilter, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchProgramAuditLogWithFilter", function() { return fetchProgramAuditLogWithFilter; });
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../api */ "XoI5");

var fetchProgramAuditLogWithFilter = function fetchProgramAuditLogWithFilter(program_id, page) {
  return _api__WEBPACK_IMPORTED_MODULE_0__["api"].get("/tola_management/program/".concat(program_id, "/audit_log/"), {
    params: {
      page: page
    }
  }).then(function (response) {
    var data = response.data;
    var total_results_count = data.count;
    var current_results_count = data.results.length;
    var total_pages = data.page_count;
    return {
      logs: data.results,
      total_pages: total_pages,
      total_entries: total_results_count,
      next_page: data.next,
      prev_page: data.previous
    };
  });
};
/* harmony default export */ __webpack_exports__["default"] = ({
  fetchProgramAuditLogWithFilter: fetchProgramAuditLogWithFilter
});

/***/ }),

/***/ "hzyr":
/*!***************************************************!*\
  !*** ./js/components/indicatorModalComponents.js ***!
  \***************************************************/
/*! exports provided: AddIndicatorButton, UpdateIndicatorButton, ExpandAllButton, CollapseAllButton */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AddIndicatorButton", function() { return AddIndicatorButton; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UpdateIndicatorButton", function() { return UpdateIndicatorButton; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ExpandAllButton", function() { return ExpandAllButton; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CollapseAllButton", function() { return CollapseAllButton; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "okNM");
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }



var AddIndicatorButton = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref) {
  var readonly = _ref.readonly,
      params = _objectWithoutProperties(_ref, ["readonly"]);

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
    type: "button",
    disabled: readonly,
    className: "btn btn-sm btn-link px-0 btn-add text-nowrap",
    onClick: function onClick(e) {
      openCreateIndicatorFormModal(params);
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
    className: "fas fa-plus-circle"
  }), " ", gettext("Add indicator"));
});
var UpdateIndicatorButton = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref2) {
  var readonly = _ref2.readonly,
      _ref2$label = _ref2.label,
      label = _ref2$label === void 0 ? null : _ref2$label,
      params = _objectWithoutProperties(_ref2, ["readonly", "label"]);

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
    type: "button",
    disabled: readonly,
    className: "btn btn-link",
    onClick: function onClick(e) {
      openUpdateIndicatorFormModal(params);
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
    className: "fas fa-cog"
  }), label);
});
var ExpandAllButton = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref3) {
  var clickHandler = _ref3.clickHandler,
      disabled = _ref3.disabled;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
    className: "btn btn-medium text-action btn-sm",
    onClick: clickHandler,
    disabled: disabled
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
    className: "fas fa-plus-square"
  }), gettext('Expand all'));
});
var CollapseAllButton = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref4) {
  var clickHandler = _ref4.clickHandler,
      disabled = _ref4.disabled;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
    className: "btn btn-medium text-action btn-sm",
    onClick: clickHandler,
    disabled: disabled
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
    className: "fas fa-minus-square"
  }), gettext('Collapse all'));
});

/***/ }),

/***/ "qnQo":
/*!************************************************************!*\
  !*** ./js/pages/tola_management_pages/audit_log/models.js ***!
  \************************************************************/
/*! exports provided: ProgramAuditLogStore */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProgramAuditLogStore", function() { return ProgramAuditLogStore; });
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mobx */ "2vnA");
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./api */ "h6br");
var _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _temp;

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }



var ProgramAuditLogStore = (_class = (_temp = /*#__PURE__*/function () {
  // UI state - track what history rows are expanded
  function ProgramAuditLogStore(program_id, program_name) {
    _classCallCheck(this, ProgramAuditLogStore);

    _initializerDefineProperty(this, "program_id", _descriptor, this);

    _initializerDefineProperty(this, "program_name", _descriptor2, this);

    _initializerDefineProperty(this, "log_rows", _descriptor3, this);

    _initializerDefineProperty(this, "fetching", _descriptor4, this);

    _initializerDefineProperty(this, "current_page", _descriptor5, this);

    _initializerDefineProperty(this, "entries_count", _descriptor6, this);

    _initializerDefineProperty(this, "total_pages", _descriptor7, this);

    _initializerDefineProperty(this, "next_page", _descriptor8, this);

    _initializerDefineProperty(this, "previous_page", _descriptor9, this);

    _initializerDefineProperty(this, "expando_rows", _descriptor10, this);

    this.program_id = program_id;
    this.program_name = program_name;
    this.fetchProgramAuditLog();
  }

  _createClass(ProgramAuditLogStore, [{
    key: "fetchProgramAuditLog",
    value: function fetchProgramAuditLog() {
      var _this = this;

      this.fetching = true;
      _api__WEBPACK_IMPORTED_MODULE_1__["default"].fetchProgramAuditLogWithFilter(this.program_id, this.current_page + 1).then(function (results) {
        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this.fetching = false;
          _this.log_rows = results.logs;
          _this.entries_count = results.total_entries;
          _this.total_pages = results.total_pages;
          _this.next_page = results.next_page;
          _this.previous_page = results.previous_page;
        });
      });
    }
  }, {
    key: "changePage",
    value: function changePage(page) {
      if (page.selected != this.current_page) {
        this.current_page = page.selected;
        this.fetchProgramAuditLog();
      }
    }
  }, {
    key: "toggleRowExpando",
    value: function toggleRowExpando(row_id) {
      if (this.expando_rows.has(row_id)) {
        this.expando_rows["delete"](row_id);
      } else {
        this.expando_rows.add(row_id);
      }
    }
  }, {
    key: "expandAllExpandos",
    value: function expandAllExpandos() {
      var _this2 = this;

      this.log_rows.forEach(function (row) {
        return _this2.expando_rows.add(row.id);
      });
    }
  }, {
    key: "collapseAllExpandos",
    value: function collapseAllExpandos() {
      this.expando_rows.clear();
    }
  }]);

  return ProgramAuditLogStore;
}(), _temp), (_descriptor = _applyDecoratedDescriptor(_class.prototype, "program_id", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "program_name", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, "log_rows", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, "fetching", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class.prototype, "current_page", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0;
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class.prototype, "entries_count", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0;
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class.prototype, "total_pages", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0;
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class.prototype, "next_page", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor9 = _applyDecoratedDescriptor(_class.prototype, "previous_page", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor10 = _applyDecoratedDescriptor(_class.prototype, "expando_rows", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new Set();
  }
}), _applyDecoratedDescriptor(_class.prototype, "fetchProgramAuditLog", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "fetchProgramAuditLog"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "changePage", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "changePage"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "toggleRowExpando", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "toggleRowExpando"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "expandAllExpandos", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "expandAllExpandos"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "collapseAllExpandos", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "collapseAllExpandos"), _class.prototype)), _class);

/***/ })

},[["6bbB","runtime","vendors"]]]);
//# sourceMappingURL=audit_log-77f95896abcc2ee451bc.js.map