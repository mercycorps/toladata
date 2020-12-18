(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["iptt_report"],{

/***/ "+jGO":
/*!*******************************************************!*\
  !*** ./js/pages/iptt_report/components/ipttReport.js ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _sidebar_sidebar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sidebar/sidebar */ "R+SQ");
/* harmony import */ var _report_reportBody__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./report/reportBody */ "HYjZ");



/* harmony default export */ __webpack_exports__["default"] = (function () {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_sidebar_sidebar__WEBPACK_IMPORTED_MODULE_1__["default"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_report_reportBody__WEBPACK_IMPORTED_MODULE_2__["default"], null));
});

/***/ }),

/***/ "/u1a":
/*!***************************************************************!*\
  !*** ./js/pages/iptt_report/components/report/headerCells.js ***!
  \***************************************************************/
/*! exports provided: HeaderCell, LopHeaderWithPopover, PeriodHeader, TVAHeader, ActualHeader */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HeaderCell", function() { return HeaderCell; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LopHeaderWithPopover", function() { return LopHeaderWithPopover; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PeriodHeader", function() { return PeriodHeader; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TVAHeader", function() { return TVAHeader; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ActualHeader", function() { return ActualHeader; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_icons_fa__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-icons/fa */ "ma3e");
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




var HeaderCell = function HeaderCell(props) {
  var style = props.styleWidth ? {
    minWidth: "".concat(props.styleWidth, "px")
  } : {};
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    scope: "col",
    colSpan: props.colSpan,
    className: props.className,
    style: style
  }, props.label);
};

var LopHeaderWithPopover = /*#__PURE__*/function (_React$Component) {
  _inherits(LopHeaderWithPopover, _React$Component);

  var _super = _createSuper(LopHeaderWithPopover);

  function LopHeaderWithPopover() {
    _classCallCheck(this, LopHeaderWithPopover);

    return _super.apply(this, arguments);
  }

  _createClass(LopHeaderWithPopover, [{
    key: "render",
    value: function render() {
      // # Translators: label on a report, column header for a column of values that have been rounded
      var msg = gettext('All values in this report are rounded to two decimal places.');
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "text-uppercase"
      }, this.props.children, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        className: "popover-icon",
        tabIndex: "0",
        "data-toggle": "popover",
        "data-placement": "right",
        "data-trigger": "focus",
        "data-content": msg
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_icons_fa__WEBPACK_IMPORTED_MODULE_1__["FaRegQuestionCircle"], null)));
    }
  }]);

  return LopHeaderWithPopover;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

var PeriodHeader = function PeriodHeader(props) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
    scope: "colgroup",
    colSpan: props.isTVA ? 3 : 1,
    className: "iptt-period-header"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
    className: "text-uppercase"
  }, props.period.name), props.period.range && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("br", null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("small", null, props.period.range)));
};

var TargetHeader = function TargetHeader() {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    scope: "col",
    className: "iptt-period-subheader",
    style: {
      minWidth: '110px'
    }
  },
  /* # Translators: Column header for a target value column */
  gettext('Target'));
};

var ActualHeader = function ActualHeader() {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    scope: "col",
    className: "iptt-period-subheader",
    style: {
      minWidth: '110px'
    }
  },
  /* # Translators: Column header for an "actual" or achieved/real value column */
  pgettext('report (long) header', 'Actual'));
};

var PercentMetHeader = function PercentMetHeader() {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    scope: "col",
    className: "iptt-period-subheader",
    style: {
      minWidth: '110px'
    }
  },
  /* # Translators: Column header for a percent-met column */
  gettext('% Met'));
};

var TVAHeader = function TVAHeader() {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(TargetHeader, null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ActualHeader, null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(PercentMetHeader, null));
};



/***/ }),

/***/ "1d5Q":
/*!******************************!*\
  !*** ./js/models/program.js ***!
  \******************************/
/*! exports provided: getProgram, withReportingPeriod, withProgramLevelOrdering, withRFLevelOrdering */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getProgram", function() { return getProgram; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "withReportingPeriod", function() { return withReportingPeriod; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "withProgramLevelOrdering", function() { return withProgramLevelOrdering; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "withRFLevelOrdering", function() { return withRFLevelOrdering; });
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mobx */ "2vnA");
/* harmony import */ var _apiv2__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../apiv2 */ "5/4V");
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }




var _gettext = typeof gettext !== 'undefined' ? gettext : function (s) {
  return s;
};
/**
 *  Base program constructor
 *  JSON params:
 *      pk (string|number)
 *      name (string)
 *      results_framework (boolean)
 *      by_result_chain (string)
 *  @return {Object}
 */


var bareProgram = function bareProgram() {
  var programJSON = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    pk: parseInt(programJSON.pk),
    name: programJSON.name,
    resultsFramework: Boolean(programJSON.results_framework),
    _resultChainFilterLabel: programJSON.by_result_chain || _gettext("by Outcome chain"),

    get resultChainFilterLabel() {
      return this.resultsFramework ? this._resultChainFilterLabel : null;
    }

  };
};

var getProgram = function getProgram() {
  for (var _len = arguments.length, programConstructors = new Array(_len), _key = 0; _key < _len; _key++) {
    programConstructors[_key] = arguments[_key];
  }

  return function () {
    var programJSON = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return [bareProgram].concat(programConstructors).reduce(function (acc, fn) {
      return Object(mobx__WEBPACK_IMPORTED_MODULE_0__["extendObservable"])(acc, fn(programJSON));
    }, {});
  };
};
/**
 * Extends program with reporting date start/end processing
 * JSON params:
 *      reporting_period_start_iso (string - ISO date format e.g. "2018-01-14")
 *      reporting_period_end_iso (string - ISO date format e.g. "2018-12-02")
 */

var withReportingPeriod = function withReportingPeriod() {
  var programJSON = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    reportingPeriodStart: new Date(programJSON.reporting_period_start_iso),
    reportingPeriodEnd: new Date(programJSON.reporting_period_end_iso)
  };
};
/**
 *  Extends program with program-wide indicator ordering (rf-aware)
 *  JSON params:
 *      indicator_pks_level_order ([int])
 *      indicator_pks_chain_order ([int])
 */

var withProgramLevelOrdering = function withProgramLevelOrdering() {
  var programJSON = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    _indicatorsLevelOrder: Object(mobx__WEBPACK_IMPORTED_MODULE_0__["observable"])(programJSON.indicator_pks_level_order || []),
    _indicatorsChainOrder: Object(mobx__WEBPACK_IMPORTED_MODULE_0__["observable"])(programJSON.indicator_pks_chain_order || []),
    _applyOrderUpdate: function _applyOrderUpdate(results) {
      var _this = this;

      Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
        _this._indicatorsLevelOrder = results.indicator_pks_level_order || [];
        _this._indicatorsChainOrder = results.indicator_pks_chain_order || [];
        Object.entries(results.indicators || {}).forEach(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
              pk = _ref2[0],
              indicatorJSON = _ref2[1];

          if (!isNaN(parseInt(pk)) && _this.indicators.has(parseInt(pk))) {
            _this.indicators.get(parseInt(pk)).updateData(indicatorJSON);
          }
        });
        return results;
      });
    },
    updateOrder: function updateOrder() {
      return _apiv2__WEBPACK_IMPORTED_MODULE_1__["default"].programLevelOrdering(this.pk).then(this._applyOrderUpdate.bind(this));
    },

    get indicatorsInLevelOrder() {
      var _this2 = this;

      return this._indicatorsLevelOrder.map(function (pk) {
        return _this2.indicators.get(pk);
      });
    },

    get indicatorsInChainOrder() {
      var _this3 = this;

      if (this.hasOwnProperty('resultsFramework') && this.resultsFramework === false) {
        return this.indicatorsInLevelOrder;
      }

      return this._indicatorsChainOrder.map(function (pk) {
        return _this3.indicators.get(pk);
      });
    }

  };
};
/**
 *  Extends program with level-by-level indicator ordering (rf-aware)
 *  JSON params:
 *      level_pks_level_order ([int])
 *      level_pks_chain_order ([int])
 *      indicator_pks_for_level ([{pk: int, indicator_pks; [int]}])
 *      unassigned_indicator_pks ([int])
 */

var withRFLevelOrdering = function withRFLevelOrdering() {
  var programJSON = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    _levelsLevelOrder: Object(mobx__WEBPACK_IMPORTED_MODULE_0__["observable"])(programJSON.level_pks_level_order || []),
    _levelsChainOrder: Object(mobx__WEBPACK_IMPORTED_MODULE_0__["observable"])(programJSON.level_pks_chain_order || []),
    _unassignedIndicators: Object(mobx__WEBPACK_IMPORTED_MODULE_0__["observable"])(programJSON.unassigned_indicator_pks || []),
    levelIndicators: Object(mobx__WEBPACK_IMPORTED_MODULE_0__["observable"])(new Map((programJSON.indicator_pks_for_level || []).map(function (levelMapJSON) {
      return [levelMapJSON.pk, levelMapJSON.indicator_pks];
    }))),
    updateOrder: function updateOrder() {
      var _this4 = this;

      return _apiv2__WEBPACK_IMPORTED_MODULE_1__["default"].rfLevelOrdering(this.pk).then(function (results) {
        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this4._levelsLevelOrder = results.level_pks_level_order || [];
          _this4._levelsChainOrder = results.level_pks_chain_order || [];
          _this4._unassignedIndicators = results.unassigned_indicator_pks || [];

          _this4._updateLevelIndicatorsOrder(results.indicator_pks_for_level);

          return true;
        });
      });
    },

    get levelsInLevelOrder() {
      var _this5 = this;

      return this._levelsLevelOrder.map(function (pk) {
        return _this5.levels.get(pk);
      }) || [];
    },

    get levelsInChainOrder() {
      var _this6 = this;

      if (this.hasOwnProperty('resultsFramework') && this.resultsFramework === false) {
        return this.levelsInLevelOrder;
      }

      return this._levelsChainOrder.map(function (pk) {
        return _this6.levels.get(pk);
      }) || [];
    },

    get unassignedIndicators() {
      var _this7 = this;

      return this._unassignedIndicators.map(function (pk) {
        return _this7.indicators.get(pk);
      }) || [];
    },

    get indicatorsInLevelOrder() {
      var _this8 = this;

      if (!this.resultsFramework) {
        return this.unassignedIndicators;
      }

      return Array.prototype.concat.apply([], this.levelsInLevelOrder.map(function (level) {
        return _this8.levelIndicators.get(level.pk).filter(function (pk) {
          return _this8.indicators.has(pk);
        }).map(function (pk) {
          return _this8.indicators.get(pk);
        });
      })).concat(this.unassignedIndicators);
    },

    get indicatorsInChainOrder() {
      var _this9 = this;

      if (!this.resultsFramework) {
        return this.unassignedIndicators;
      }

      return Array.prototype.concat.apply([], this.levelsInChainOrder.map(function (level) {
        return _this9.levelIndicators.get(level.pk).filter(function (pk) {
          return _this9.indicators.has(pk);
        }).map(function (pk) {
          return _this9.indicators.get(pk);
        });
      })).concat(this.unassignedIndicators);
    },

    _updateLevelIndicatorsOrder: function _updateLevelIndicatorsOrder() {
      var _this10 = this;

      var orderByLevel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
        _this10.levelIndicators.clear();

        orderByLevel.forEach(function (_ref3) {
          var pk = _ref3.pk,
              indicator_pks = _ref3.indicator_pks;

          _this10.levelIndicators.set(pk, indicator_pks);
        });
      });
    }
  };
};

/***/ }),

/***/ "3DQe":
/*!******************************************************!*\
  !*** ./js/pages/iptt_report/models/ipttRootStore.js ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mobx */ "2vnA");
/* harmony import */ var _filterStore__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./filterStore */ "N38U");
/* harmony import */ var _reportStore__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./reportStore */ "sJKi");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../constants */ "v38i");
/* harmony import */ var _apiv2__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../apiv2 */ "5/4V");
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }






/* harmony default export */ __webpack_exports__["default"] = (function () {
  var reactContext = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var rootStore = Object(mobx__WEBPACK_IMPORTED_MODULE_0__["observable"])({
    _filterStore: Object(_filterStore__WEBPACK_IMPORTED_MODULE_1__["default"])(reactContext),

    get filterStore() {
      return this._filterStore;
    },

    _reportStore: Object(_reportStore__WEBPACK_IMPORTED_MODULE_2__["default"])(reactContext.report || {}),
    _expandoRows: [],
    expandAllRows: function expandAllRows() {
      this._expandoRows.forEach(function (row) {
        row.expandRow();
      });
    },

    get allExpanded() {
      return this._expandoRows.every(function (row) {
        return row.state.expanded;
      });
    },

    get allCollapsed() {
      return this._expandoRows.every(function (row) {
        return !row.state.expanded;
      });
    },

    collapseAllRows: function collapseAllRows() {
      this._expandoRows.forEach(function (row) {
        row.collapseRow();
      });
    },

    get reportStore() {
      return this._reportStore;
    },

    get currentReport() {
      return this.reportStore.getReport(this.filterStore.selectedFrequency);
    },

    loadReportData: function loadReportData() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref$update = _ref.update,
          update = _ref$update === void 0 ? false : _ref$update;

      return this.reportStore.callForReportData({
        programPk: this.filterStore.selectedProgramId,
        frequency: this.filterStore.selectedFrequency,
        reportType: this.filterStore.isTVA ? _constants__WEBPACK_IMPORTED_MODULE_3__["TVA"] : _constants__WEBPACK_IMPORTED_MODULE_3__["TIMEPERIODS"],
        update: update
      });
    },

    get pinParams() {
      return {
        program: this.filterStore.selectedProgramId,
        report_type: this.filterStore.isTVA ? 'targetperiods' : 'timeperiods',
        query_string: this.filterStore.queryString
      };
    },

    get pinAPI() {
      return {
        programPageUrl: _apiv2__WEBPACK_IMPORTED_MODULE_4__["default"].getProgramPageUrl(this.filterStore.selectedProgramId),
        pinReady: true,
        pinParams: this.pinParams,
        savePin: function savePin(params) {
          return _apiv2__WEBPACK_IMPORTED_MODULE_4__["default"].savePinnedReport(params);
        }
      };
    },

    get excelAPI() {
      return {
        excelUrl: this.filterStore.excelUrl,
        fullExcelUrl: this.filterStore.fullExcelUrl
      };
    },

    get currentProgram() {
      return this.filterStore.programFilterData;
    },

    get currentProgramPageUrl() {
      return this.currentProgram ? _apiv2__WEBPACK_IMPORTED_MODULE_4__["default"].getProgramPageUrl(this.currentProgram.pk) : null;
    },

    get isTVA() {
      return this.filterStore.isTVA;
    },

    get resultsFramework() {
      return this.filterStore.resultsFramework;
    },

    get levelRows() {
      var _this = this;

      return this.filterStore.resultsFramework && this.filterStore.allLevels.length > 0 ? this.filterStore.getLevelIndicatorGroups().filter(function (levelGroup) {
        return levelGroup.indicators.length > 0 || !_this.filterStore.filtersActive && levelGroup.level !== null && levelGroup.level.tierDepth === 1;
      }) : false;
    },

    get indicatorRows() {
      return this.filterStore.getAllIndicators();
    },

    get reportPeriods() {
      return this.currentProgram && this.filterStore.selectedFrequency && this.filterStore.selectedFrequency !== 1 ? this.filterStore.selectedFrequency == 2 ? this.currentProgram.periodRanges.get(this.filterStore.selectedFrequency).periods : this.currentProgram.periodRanges.get(this.filterStore.selectedFrequency).periods.slice(this.filterStore.startPeriodValue, this.filterStore.endPeriodValue + 1) : [];
    },

    getReportData: function getReportData(indicatorPk) {
      return this.currentReport && this.currentReport.has(parseInt(indicatorPk)) ? this.currentReport.get(parseInt(indicatorPk)) : {};
    },
    periodValues: function periodValues(indicatorPk) {
      var periodValues = this.currentReport.has(parseInt(indicatorPk)) ? this.filterStore.selectedFrequency == 2 ? this.currentReport.get(parseInt(indicatorPk)).periodValues : this.currentReport.get(parseInt(indicatorPk)).periodValues.slice(this.filterStore.startPeriodValue, this.filterStore.endPeriodValue + 1) : [];

      if (periodValues && !this.isTVA) {
        periodValues = periodValues.map(function (periodValue) {
          return periodValue.actual;
        });
      }

      return periodValues;
    },
    disaggregatedLop: function disaggregatedLop(indicatorPk, disaggregationPk) {
      return this.currentReport.has(parseInt(indicatorPk)) ? this.currentReport.get(parseInt(indicatorPk)).disaggregatedLop(parseInt(disaggregationPk)) : null;
    },
    disaggregatedPeriodValues: function disaggregatedPeriodValues(indicatorPk, disaggregationPk) {
      var periodValues = this.currentReport.has(parseInt(indicatorPk)) ? this.currentReport.get(parseInt(indicatorPk)).disaggregatedPeriodValues(parseInt(disaggregationPk)) : null;

      if (periodValues && this.filterStore.selectedFrequency != 2) {
        periodValues = periodValues.slice(this.filterStore.startPeriodValue, this.filterStore.endPeriodValue + 1);
      }

      if (periodValues && !this.isTVA) {
        periodValues = periodValues.map(function (periodValue) {
          return periodValue.actual;
        });
      }

      return periodValues || [];
    },

    get hiddenCategories() {
      return this.filterStore._hiddenCategories === true;
    },

    get baseColumns() {
      return 8 + (this.filterStore.resultsFramework ? 0 : 1) - this.filterStore._hiddenColumns.length;
    },

    get reportColumnWidth() {
      return this.baseColumns + (!this.resultsFramework && 1) + 3 + this.reportPeriods.length * (this.isTVA ? 3 : 1);
    },

    get activeDisaggregationPks() {
      return this.filterStore.currentDisaggregations;
    },

    indicatorHasActiveDisaggregations: function indicatorHasActiveDisaggregations(indicator) {
      var _this2 = this;

      if (!indicator.hasDisaggregations(this.activeDisaggregationPks)) {
        return false;
      }

      if (this.hiddenCategories) {
        return this.activeDisaggregationPks.map(function (pk) {
          return _this2.getDisaggregationLabels(pk).labels || [];
        }).reduce(function (a, b) {
          return a.concat(b);
        }, []).filter(function (label) {
          return _this2.disaggregatedLop(indicator.pk, label.pk);
        }).length > 0;
      }

      return true;
    },
    getDisaggregationLabels: function getDisaggregationLabels(disaggregationPk) {
      return this.currentProgram && this.currentProgram.disaggregations.has(disaggregationPk) ? this.currentProgram.disaggregations.get(disaggregationPk) : false;
    },

    get hasUOMColumn() {
      return !this.filterStore._hiddenColumns.includes(0);
    },

    get hasChangeColumn() {
      return !this.filterStore._hiddenColumns.includes(1);
    },

    get hasCNCColumn() {
      return !this.filterStore._hiddenColumns.includes(2);
    },

    get hasUOMTypeColumn() {
      return !this.filterStore._hiddenColumns.includes(3);
    },

    get hasBaselineColumn() {
      return !this.filterStore._hiddenColumns.includes(4);
    },

    loadResultsModal: function loadResultsModal(indicatorPk) {
      _apiv2__WEBPACK_IMPORTED_MODULE_4__["default"].indicatorResultsTable(indicatorPk, false).then(function (data) {
        $('#modalmessages').empty();
        var $modal = $('#indicator_modal_content');
        $modal.empty().html(data);
        $('#indicator_modal_div').modal('show');
        $modal.find('[data-toggle="popover"]').popover({
          html: true,
          placement: 'right',
          container: $modal,
          // note: this template is just the default with the addition of a width attribute
          // already tried: container, boundary, placement, offset, and loading order, but this works:
          template: '<div class="popover" style="width: 325px;" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'
        });
      });
    },
    indicatorUpdate: function indicatorUpdate(e, _ref2) {
      var _this3 = this;

      var indicatorId = _ref2.indicatorId,
          data = _objectWithoutProperties(_ref2, ["indicatorId"]);

      return this.filterStore.updateProgramFilterData().then(function () {
        _this3.loadReportData({
          update: true
        });
      });
    },
    indicatorDelete: function indicatorDelete(e, _ref3) {
      var indicatorId = _ref3.indicatorId,
          data = _objectWithoutProperties(_ref3, ["indicatorId"]);

      this.filterStore.programFilterData.deleteIndicator(indicatorId);
    }
  });

  var _updateReportData = Object(mobx__WEBPACK_IMPORTED_MODULE_0__["reaction"])(function () {
    return [rootStore.filterStore.selectedProgramId, rootStore.filterStore.selectedFrequency];
  }, function (_ref4) {
    var _ref5 = _slicedToArray(_ref4, 2),
        programId = _ref5[0],
        frequency = _ref5[1];

    if (programId && frequency) {
      rootStore.loadReportData();
    }
  }, {
    fireImmediately: true
  });

  return rootStore;
});

/***/ }),

/***/ "4L+s":
/*!**************************************!*\
  !*** ./js/components/helpPopover.js ***!
  \**************************************/
/*! exports provided: default, BootstrapPopoverButton */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return HelpPopover; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BootstrapPopoverButton", function() { return BootstrapPopoverButton; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "i8i4");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
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




var HelpPopover = /*#__PURE__*/function (_React$Component) {
  _inherits(HelpPopover, _React$Component);

  var _super = _createSuper(HelpPopover);

  function HelpPopover(props) {
    var _this;

    _classCallCheck(this, HelpPopover);

    _this = _super.call(this, props);
    _this.placement = props.placement || null;
    _this.popoverRef = props.innerRef || /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createRef();
    _this.iconClass = props.iconClass || "far fa-question-circle";
    _this.iconStyle = props.iconStyle || {};
    _this.linkStyle = {};

    if (props.linkHeight) {
      _this.linkStyle.height = props.linkHeight;
    }

    return _this;
  }

  _createClass(HelpPopover, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        tabIndex: "0",
        style: this.linkStyle,
        "data-toggle": "popover",
        "data-trigger": "focus",
        "data-html": "true",
        "data-placement": this.placement,
        "data-content": this.props.content,
        className: this.props.className,
        ref: this.popoverRef
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        "aria-label": this.props.ariaText,
        style: this.iconStyle,
        className: this.iconClass
      }));
    }
  }]);

  return HelpPopover;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);


var BootstrapPopoverButton = /*#__PURE__*/function (_React$Component2) {
  _inherits(BootstrapPopoverButton, _React$Component2);

  var _super2 = _createSuper(BootstrapPopoverButton);

  function BootstrapPopoverButton() {
    var _this2;

    _classCallCheck(this, BootstrapPopoverButton);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this2 = _super2.call.apply(_super2, [this].concat(args));
    _this2.popoverName = 'base';

    _this2.componentDidMount = function () {
      // make a cancelable (class method) function so clicking out of the popover will close it:
      _this2.bodyClickHandler = function (ev) {
        if ($("#".concat(_this2.popoverName, "_popover_content")).parent().find($(ev.target)).length == 0) {
          $(_this2.refs.target).popover('hide');
        }
      };

      var popoverOpenHandler = function popoverOpenHandler() {
        // first make it so any click outside of the popover will hide it:
        $('body').on('click', _this2.bodyClickHandler); // update position (it's had content loaded):

        $(_this2.refs.target).popover('update') //when it hides destroy the body clickhandler:
        .on('hide.bs.popover', function () {
          $('body').off('click', _this2.bodyClickHandler);
        });
      };

      var shownFn = function shownFn(ev) {
        react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render(_this2.getPopoverContent(), document.querySelector("#".concat(_this2.popoverName, "_popover_content")), popoverOpenHandler);
      };

      $(_this2.refs.target).popover({
        content: "<div id=\"".concat(_this2.popoverName, "_popover_content\"></div>"),
        html: true,
        placement: 'bottom'
      }).on('shown.bs.popover', shownFn);
    };

    _this2.getPopoverContent = function () {
      throw new Error('not implemented');
    };

    return _this2;
  }

  return BootstrapPopoverButton;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

/***/ }),

/***/ "5/4V":
/*!*********************!*\
  !*** ./js/apiv2.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "vDqi");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! qs */ "Qyje");
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(qs__WEBPACK_IMPORTED_MODULE_1__);


var api = {
  apiInstance: axios__WEBPACK_IMPORTED_MODULE_0___default.a.create({
    withCredentials: true,
    baseURL: '/indicators/api/',
    responseType: 'json',
    headers: {
      "X-CSRFToken": document.cookie.replace(/(?:(?:^|.*;\s*)csrftoken\s*\=\s*([^;]*).*$)|^.*$/, "$1")
    }
  }),
  documentInstance: axios__WEBPACK_IMPORTED_MODULE_0___default.a.create({
    withCredentials: true,
    baseURL: '/indicators/api/',
    responseType: 'document',
    headers: {
      "X-CSRFToken": document.cookie.replace(/(?:(?:^|.*;\s*)csrftoken\s*\=\s*([^;]*).*$)|^.*$/, "$1")
    },
    transformResponse: [function (response) {
      return new XMLSerializer().serializeToString(response);
    }]
  }),
  formPostInstance: axios__WEBPACK_IMPORTED_MODULE_0___default.a.create({
    withCredentials: true,
    baseURL: '/indicators/api/',
    responseType: 'json',
    headers: {
      "X-CSRFToken": document.cookie.replace(/(?:(?:^|.*;\s*)csrftoken\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
      'content-type': 'application/x-www-form-urlencoded'
    }
  }),
  logFailure: function logFailure(failureMsg) {
    console.log("api call failed:", failureMsg);
  },
  getProgramPageUrl: function getProgramPageUrl(programPk) {
    return !isNaN(parseInt(programPk)) ? "/program/".concat(programPk, "/") : false;
  },
  programLevelOrdering: function programLevelOrdering(programPk) {
    return this.apiInstance.get("/program/ordering/".concat(programPk, "/")).then(function (response) {
      return response.data;
    })["catch"](this.logFailure);
  },
  rfLevelOrdering: function rfLevelOrdering(programPk) {
    return this.apiInstance.get("/program/level_ordering/".concat(programPk, "/")).then(function (response) {
      return response.data;
    })["catch"](this.logFailure);
  },
  indicatorResultsTable: function indicatorResultsTable(indicatorPk, editable) {
    return this.documentInstance.get("/result_table/".concat(indicatorPk, "/"), {
      params: {
        raw: true,
        edit: editable
      }
    }).then(function (response) {
      return response.data;
    })["catch"](this.logFailure);
  },
  updateProgramPageIndicator: function updateProgramPageIndicator(indicatorPk) {
    return this.apiInstance.get("/program_page/indicator/".concat(indicatorPk, "/")).then(function (response) {
      return response.data;
    })["catch"](this.logFailure);
  },
  updateAllProgramPageIndicators: function updateAllProgramPageIndicators(programPk) {
    return this.apiInstance.get("/program_page/".concat(programPk, "/")).then(function (response) {
      return response.data;
    })["catch"](this.logFailure);
  },
  ipttFilterData: function ipttFilterData(programPk) {
    return this.apiInstance.get("/iptt/".concat(programPk, "/filter_data/")).then(function (response) {
      return response.data;
    })["catch"](this.logFailure);
  },
  getIPTTReportData: function getIPTTReportData() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        programPk = _ref.programPk,
        frequency = _ref.frequency,
        reportType = _ref.reportType;

    return this.apiInstance.get("/iptt/".concat(programPk, "/report_data/"), {
      params: {
        frequency: frequency,
        report_type: reportType
      }
    }).then(function (response) {
      return response.data;
    })["catch"](this.logFailure);
  },
  savePinnedReport: function savePinnedReport(reportData) {
    return this.formPostInstance.post("/pinned_report/", qs__WEBPACK_IMPORTED_MODULE_1___default.a.stringify(reportData))["catch"](this.logFailure);
  },
  updateIPTTIndicator: function updateIPTTIndicator(indicatorPk) {
    return this.apiInstance.get("/iptt/indicator/".concat(indicatorPk, "/")).then(function (response) {
      return response.data;
    })["catch"](this.logFailure);
  }
};
/* harmony default export */ __webpack_exports__["default"] = (api);

/***/ }),

/***/ "67ur":
/*!************************************************************!*\
  !*** ./js/pages/iptt_report/models/ipttIndicatorReport.js ***!
  \************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mobx */ "2vnA");
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }


/*
 * Take an array [{index: #, actual: #},] and fill in all indices from 0 to max with actual: null
 * Uncompresses serialized report data for IPTT
 */

var impliedNullValuesMapper = function impliedNullValuesMapper(values) {
  // map of existing (non-null) indices to their actual value
  var valuesMap = new Map(values.map(function (v) {
    return [v.index, v.actual];
  })); // iterate from 0 to largest index value provided

  var valuesArray = _toConsumableArray(Array(Math.max.apply(Math, _toConsumableArray(values.map(function (v) {
    return v.index;
  }))) + 1).keys()) // for each either provide the value from the values Map if it exists (this value was provided) or default to null
  .map(function (i) {
    return {
      index: i,
      actual: valuesMap.has(i) ? valuesMap.get(i) : null
    };
  });

  return valuesArray;
};

function getPeriodData() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$target = _ref.target,
      target = _ref$target === void 0 ? null : _ref$target,
      _ref$actual = _ref.actual,
      actual = _ref$actual === void 0 ? null : _ref$actual,
      _ref$met = _ref.met,
      met = _ref$met === void 0 ? null : _ref$met,
      _ref$disaggregations = _ref.disaggregations,
      disaggregations = _ref$disaggregations === void 0 ? {} : _ref$disaggregations;

  var disaggregatedPeriodData = new Map(Object.entries(disaggregations).map(function (_ref2) {
    var _ref3 = _slicedToArray(_ref2, 2),
        disaggregationPk = _ref3[0],
        disaggregationJSON = _ref3[1];

    return [parseInt(disaggregationPk), {
      actual: disaggregationJSON.actual
    }];
  }));
  return {
    target: target,
    actual: actual,
    met: met,
    disaggregations: disaggregatedPeriodData
  };
}

var getIndicatorReport = function getIndicatorReport(frequency) {
  var indicatorReportJSON = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return Object(mobx__WEBPACK_IMPORTED_MODULE_0__["observable"])({
    pk: parseInt(indicatorReportJSON.pk),
    frequency: parseInt(frequency),
    _lopPeriod: getPeriodData(indicatorReportJSON.lop_period),

    get lopTarget() {
      return this._lopPeriod.target;
    },

    get lopActual() {
      return this._lopPeriod.actual;
    },

    get lopMet() {
      return this._lopPeriod.met;
    },

    _reportData: Object(mobx__WEBPACK_IMPORTED_MODULE_0__["observable"])(new Map((indicatorReportJSON.periods || []).map(function (periodJSON) {
      return [parseInt(periodJSON.count), getPeriodData(periodJSON)];
    }))),

    get periodValues() {
      return Array.from(this._reportData.values());
    },

    _disaggregatedData: Object(mobx__WEBPACK_IMPORTED_MODULE_0__["observable"])(new Map(Object.entries(indicatorReportJSON.disaggregated_data || {}).map(function (_ref4) {
      var _ref5 = _slicedToArray(_ref4, 2),
          disaggregationPk = _ref5[0],
          disaggregationJSON = _ref5[1];

      return [parseInt(disaggregationPk), disaggregationJSON];
    }))),
    disaggregatedLop: function disaggregatedLop(disaggregationPk) {
      return !isNaN(parseInt(disaggregationPk)) && this._lopPeriod.disaggregations.has(parseInt(disaggregationPk)) ? this._lopPeriod.disaggregations.get(parseInt(disaggregationPk)).actual : null;
    },
    disaggregatedPeriodValues: function disaggregatedPeriodValues(disaggregationPk) {
      return !isNaN(parseInt(disaggregationPk)) ? this.periodValues.map(function (period) {
        return period.disaggregations.get(parseInt(disaggregationPk));
      }) : [];
    }
  });
};

/* harmony default export */ __webpack_exports__["default"] = (getIndicatorReport);

/***/ }),

/***/ "BBG7":
/*!***********************************************************!*\
  !*** ./js/pages/iptt_report/components/report/buttons.js ***!
  \***********************************************************/
/*! exports provided: PinButton, ExcelPopoverButton, ExcelButton */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PinButton", function() { return PinButton; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ExcelPopoverButton", function() { return ExcelPopoverButton; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ExcelButton", function() { return ExcelButton; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "i8i4");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var _components_helpPopover__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../components/helpPopover */ "4L+s");
var _class, _temp, _dec, _class3, _temp2, _class5, _temp3, _class7, _temp4, _class9, _temp5;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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






var PinPopover = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class = (_temp = /*#__PURE__*/function (_React$Component) {
  _inherits(PinPopover, _React$Component);

  var _super = _createSuper(PinPopover);

  function PinPopover(props) {
    var _this;

    _classCallCheck(this, PinPopover);

    _this = _super.call(this, props);
    _this.NOT_SENT = 0;
    _this.SENDING = 1;
    _this.SENT = 2;
    _this.FAILED = 3;

    _this.handleChange = function (e) {
      _this.setState({
        reportName: e.target.value
      });
    };

    _this.isDisabled = function () {
      return !_this.props.rootStore.pinAPI.pinReady || !_this.state.reportName;
    };

    _this.handleClick = function () {
      _this.setState({
        status: _this.SENDING
      });

      _this.props.rootStore.pinAPI.savePin(_objectSpread({
        name: _this.state.reportName
      }, _this.props.rootStore.pinParams)).then(function () {
        _this.setState({
          status: _this.SENT
        });

        _this.props.updatePosition();
      })["catch"](function () {
        _this.setState({
          status: _this.FAILED
        });

        console.log("ajax error:", ev);
      });
    };

    _this.state = {
      reportName: '',
      status: _this.NOT_SENT
    };
    return _this;
  }

  _createClass(PinPopover, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, function () {
        switch (_this2.state.status) {
          case _this2.SENT:
            return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
              className: "form-group"
            }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, gettext('Success!  This report is now pinned to the program page'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
              href: _this2.props.rootStore.pinAPI.programPageUrl
            }, gettext('Visit the program page now.'))));

          case _this2.FAILED:
            return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
              className: "form-group"
            }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, gettext('Something went wrong when attempting to pin this report'))));

          case _this2.NOT_SENT:
            return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
              className: "form-group"
            }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
              className: ""
            },
            /* # Translators: a field where users can name their newly created report */
            gettext('Report name')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
              type: "text",
              className: "form-control",
              value: _this2.state.reportName,
              onChange: _this2.handleChange,
              disabled: _this2.state.sending
            })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
              type: "button",
              onClick: _this2.handleClick,
              disabled: _this2.isDisabled(),
              className: "btn btn-primary btn-block"
            }, gettext('Pin to program page')));

          case _this2.SENDING:
            return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
              className: "btn btn-primary",
              disabled: true
            }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
              src: "/static/img/ajax-loader.gif"
            }), "\xA0", gettext('Sending'));
        }
      }());
    }
  }]);

  return PinPopover;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp)) || _class;

var PinButton = (_dec = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["inject"])('rootStore'), _dec(_class3 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class3 = (_temp2 = /*#__PURE__*/function (_BootstrapPopoverButt) {
  _inherits(PinButton, _BootstrapPopoverButt);

  var _super2 = _createSuper(PinButton);

  function PinButton() {
    var _this3;

    _classCallCheck(this, PinButton);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this3 = _super2.call.apply(_super2, [this].concat(args));
    _this3.popoverName = 'pin';

    _this3.getPopoverContent = function () {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(PinPopover, {
        rootStore: _this3.props.rootStore,
        updatePosition: function updatePosition() {
          $(_this3.refs.target).popover('update');
        }
      });
    };

    return _this3;
  }

  _createClass(PinButton, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        href: "#",
        className: "btn btn-sm btn-secondary",
        ref: "target"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-thumbtack"
      }),
      /* # Translators: a button that lets a user "pin" (verb) a report to their home page */
      gettext('Pin')));
    }
  }]);

  return PinButton;
}(_components_helpPopover__WEBPACK_IMPORTED_MODULE_3__["BootstrapPopoverButton"]), _temp2)) || _class3) || _class3);

var ExcelPopover = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class5 = (_temp3 = /*#__PURE__*/function (_React$Component2) {
  _inherits(ExcelPopover, _React$Component2);

  var _super3 = _createSuper(ExcelPopover);

  function ExcelPopover() {
    var _this4;

    _classCallCheck(this, ExcelPopover);

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    _this4 = _super3.call.apply(_super3, [this].concat(args));

    _this4.getCurrent = function () {
      if (_this4.props.excelUrl) {
        window.open(_this4.props.excelUrl, '_blank');
      }
    };

    _this4.getAll = function () {
      if (_this4.props.fullExcelUrl) {
        window.open(_this4.props.fullExcelUrl, '_blank');
      }
    };

    return _this4;
  }

  _createClass(ExcelPopover, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        type: "button",
        className: "btn btn-primary btn-block",
        onClick: this.getCurrent
      },
      /* # Translators: a download button for a report containing just the data currently displayed */
      gettext('Current view')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        type: "button",
        className: "btn btn-primary btn-block",
        onClick: this.getAll
      },
      /* # Translators: a download button for a report containing all available data */
      gettext('All program data')));
    }
  }]);

  return ExcelPopover;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp3)) || _class5;

var ExcelPopoverButton = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class7 = (_temp4 = /*#__PURE__*/function (_BootstrapPopoverButt2) {
  _inherits(ExcelPopoverButton, _BootstrapPopoverButt2);

  var _super4 = _createSuper(ExcelPopoverButton);

  function ExcelPopoverButton() {
    var _this5;

    _classCallCheck(this, ExcelPopoverButton);

    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    _this5 = _super4.call.apply(_super4, [this].concat(args));
    _this5.popoverName = 'excel';

    _this5.getPopoverContent = function () {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ExcelPopover, _this5.props);
    };

    return _this5;
  }

  _createClass(ExcelPopoverButton, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        type: "button",
        className: "btn btn-sm btn-secondary",
        ref: "target"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-download"
      }), " Excel"));
    }
  }]);

  return ExcelPopoverButton;
}(_components_helpPopover__WEBPACK_IMPORTED_MODULE_3__["BootstrapPopoverButton"]), _temp4)) || _class7;
var ExcelButton = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class9 = (_temp5 = /*#__PURE__*/function (_React$Component3) {
  _inherits(ExcelButton, _React$Component3);

  var _super5 = _createSuper(ExcelButton);

  function ExcelButton() {
    var _this6;

    _classCallCheck(this, ExcelButton);

    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    _this6 = _super5.call.apply(_super5, [this].concat(args));

    _this6.handleClick = function () {
      if (_this6.props.excelUrl) {
        window.open(_this6.props.excelUrl, '_blank');
      }
    };

    return _this6;
  }

  _createClass(ExcelButton, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        type: "button",
        className: "btn btn-sm btn-secondary",
        onClick: this.handleClick
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-download"
      }), " Excel"));
    }
  }]);

  return ExcelButton;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp5)) || _class9;

/***/ }),

/***/ "EBDj":
/*!*************************************************************!*\
  !*** ./js/pages/iptt_report/components/report/tableRows.js ***!
  \*************************************************************/
/*! exports provided: LevelGroup, IndicatorRow */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LevelGroup", function() { return LevelGroup; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IndicatorRow", function() { return IndicatorRow; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var _fortawesome_fontawesome_svg_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @fortawesome/fontawesome-svg-core */ "7O5W");
/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ "IP2g");
/* harmony import */ var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons */ "wHSu");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../constants */ "v38i");
var _dec, _class, _temp;

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

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }







_fortawesome_fontawesome_svg_core__WEBPACK_IMPORTED_MODULE_2__["library"].add(_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_4__["faCaretDown"], _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_4__["faCaretRight"]);

function ipttRound(value, percent) {
  if (value == gettext('N/A')) {
    return value;
  }

  if (value !== '' && !isNaN(parseFloat(value))) {
    if (!Number.isInteger(value)) {
      value = Number.parseFloat(value).toFixed(2);
      value = value.endsWith('00') ? parseInt(value) : value.endsWith('0') ? value.slice(0, -1) : value;
    } else {
      value = String(value);
    }

    return percent === true ? "".concat(value, "%") : value;
  }

  return null;
}

var IndicatorEditModalCell = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('rootStore')(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref) {
  var rootStore = _ref.rootStore,
      indicator = _ref.indicator;

  var loadModal = function loadModal(e) {
    e.preventDefault();
    var url = "/indicators/indicator_update/".concat(indicator.pk, "/?modal=true");
    $("#indicator_modal_content").empty();
    $("#modalmessages").empty();
    $("#indicator_modal_content").load(url);
    $("#indicator_modal_div").modal('show').on('updated.tola.indicator.save', rootStore.indicatorUpdate.bind(rootStore)).on('deleted.tola.indicator.save', rootStore.indicatorDelete.bind(rootStore)).one('hidden.bs.modal', function (ev) {
      $(ev.target).off('.tola.save');
    });
  };

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
    className: "indicator-edit-modal-cell "
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
    type: "button",
    className: "btn btn-link p-1 float-right",
    onClick: loadModal
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
    className: "fas fa-cog"
  })));
}));
var IndicatorResultModalCell = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])("rootStore")(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref2) {
  var indicator = _ref2.indicator,
      rootStore = _ref2.rootStore;

  var loadModal = function loadModal(e) {
    e.preventDefault();
    rootStore.loadResultsModal(indicator.pk);
  };

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
    className: "indicator-result-modal-cell "
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
    type: "button",
    className: "btn btn-link p-1 indicator-ajax-popup indicator-data",
    onClick: loadModal
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
    className: "fas fa-table"
  })));
}));

var IndicatorCell = function IndicatorCell(_ref3) {
  var value = _ref3.value,
      resultCell = _ref3.resultCell,
      props = _objectWithoutProperties(_ref3, ["value", "resultCell"]);

  var displayValue = value || value === 0 ? value : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
    className: "empty-value"
  }, _constants__WEBPACK_IMPORTED_MODULE_5__["BLANK_TABLE_CELL"]);

  if (resultCell && resultCell === true) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", _extends({
      className: "indicator-cell result-cell"
    }, props), displayValue);
  }

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", _extends({
    className: "indicator-cell "
  }, props), displayValue);
};

var ExpandoCell = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref4) {
  var value = _ref4.value,
      expanded = _ref4.expanded,
      clickHandler = _ref4.clickHandler,
      props = _objectWithoutProperties(_ref4, ["value", "expanded", "clickHandler"]);

  var displayValue = value || value === 0 ? value : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
    className: "empty-value"
  }, _constants__WEBPACK_IMPORTED_MODULE_5__["BLANK_TABLE_CELL"]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", _extends({
    className: "expando-cell "
  }, props, {
    onClick: clickHandler
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_3__["FontAwesomeIcon"], {
    icon: expanded ? 'caret-down' : 'caret-right'
  }), "\xA0", displayValue);
});
var IndicatorNameExpandoCell = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref5) {
  var value = _ref5.value,
      expanded = _ref5.expanded,
      clickHandler = _ref5.clickHandler,
      props = _objectWithoutProperties(_ref5, ["value", "expanded", "clickHandler"]);

  var displayValue = value || value === 0 ? value : _constants__WEBPACK_IMPORTED_MODULE_5__["BLANK_TABLE_CELL"];
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", _extends({
    className: "indicator-cell expando-cell "
  }, props, {
    onClick: clickHandler
  }), displayValue);
});
var localizeFunc = window.localizeNumber;

var PercentCell = function PercentCell(_ref6) {
  var value = _ref6.value,
      props = _objectWithoutProperties(_ref6, ["value"]);

  value = value !== undefined && value !== null ? "".concat(localizeFunc(value), "%") : null;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorCell, _extends({
    className: "indicator-cell percent-cell",
    value: value
  }, props));
};

var NumberCell = function NumberCell(_ref7) {
  var value = _ref7.value,
      props = _objectWithoutProperties(_ref7, ["value"]);

  value = value !== undefined && value !== null ? localizeFunc(value) : null;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorCell, _extends({
    className: "indicator-cell number-cell",
    value: value
  }, props));
};

var TVAResultsGroup = function TVAResultsGroup(_ref8) {
  var value = _ref8.value,
      resultCell = _ref8.resultCell,
      props = _objectWithoutProperties(_ref8, ["value", "resultCell"]);

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(NumberCell, {
    value: value.target
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(NumberCell, {
    value: value.actual
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(PercentCell, {
    value: value.met
  }));
};

var TVAResultsGroupPercent = function TVAResultsGroupPercent(_ref9) {
  var value = _ref9.value,
      resultCell = _ref9.resultCell,
      props = _objectWithoutProperties(_ref9, ["value", "resultCell"]);

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(PercentCell, {
    value: value.target
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(PercentCell, {
    value: value.actual
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(PercentCell, {
    value: value.met
  }));
};

var DisaggregationTable = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('rootStore')(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref10) {
  var indicator = _ref10.indicator,
      disaggregationPk = _ref10.disaggregationPk,
      rootStore = _ref10.rootStore;
  var disaggregation = rootStore.getDisaggregationLabels(disaggregationPk);

  if (!disaggregation) {
    return null;
  }

  var ValueCell = NumberCell;

  if (indicator.isPercent) {
    ValueCell = PercentCell;
  }

  var labels = rootStore.hiddenCategories ? disaggregation.labels.filter(function (label) {
    return rootStore.disaggregatedLop(indicator.pk, label.pk);
  }) : disaggregation.labels;

  if (!labels) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null);
  }

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, labels.map(function (label, idx) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
      className: idx == labels.length - 1 ? "disaggregation-end-row" : "",
      key: idx
    }, idx == 0 && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
      className: "disaggregation-name-cell",
      colSpan: 2,
      rowSpan: labels.length
    }, disaggregation.name), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
      colSpan: rootStore.hasBaselineColumn ? rootStore.baseColumns - 2 : rootStore.baseColumns - 1,
      className: "disaggregation-label-cell"
    }, label.name), rootStore.hasBaselineColumn && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
      className: "disaggregation-value-cell base-column empty-value"
    }, "\u2014"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
      className: "disaggregation-value-cell lop-column empty-value"
    }, "\u2014"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ValueCell, {
      className: "disaggregation-value-cell lop-column",
      value: ipttRound(rootStore.disaggregatedLop(indicator.pk, label.pk), false)
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
      className: "disaggregation-value-cell lop-column empty-value"
    }, "\u2014"), rootStore.disaggregatedPeriodValues(indicator.pk, label.pk).map(function (periodValue, idx) {
      return rootStore.isTVA ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, {
        key: idx
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
        className: "disaggregation-value-cell empty-value"
      }, "\u2014"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ValueCell, {
        key: idx,
        value: periodValue.actual
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
        className: "disaggregation-value-cell empty-value"
      }, "\u2014")) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ValueCell, {
        key: idx,
        value: periodValue
      });
    }));
  }));
}));
var IndicatorRow = (_dec = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('rootStore'), _dec(_class = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class = (_temp = /*#__PURE__*/function (_React$Component) {
  _inherits(IndicatorRow, _React$Component);

  var _super = _createSuper(IndicatorRow);

  function IndicatorRow(props) {
    var _this;

    _classCallCheck(this, IndicatorRow);

    _this = _super.call(this, props);

    _this.handleExpandoClick = function (e) {
      _this.setState({
        expanded: !_this.state.expanded
      });
    };

    _this.expandRow = function () {
      _this.setState({
        expanded: true
      });
    };

    _this.collapseRow = function () {
      _this.setState({
        expanded: false
      });
    };

    _this.state = {
      expanded: false
    };
    return _this;
  }

  _createClass(IndicatorRow, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.props.rootStore._expandoRows.push(this);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var _this2 = this;

      this.props.rootStore._expandoRows = this.props.rootStore._expandoRows.filter(function (row) {
        return row != _this2;
      });
    }
  }, {
    key: "render",
    value: function render() {
      var indicator = this.props.indicator;
      var rootStore = this.props.rootStore;
      var ValueCell;
      var PeriodCell;

      if (indicator.isPercent) {
        ValueCell = PercentCell;
        PeriodCell = rootStore.isTVA ? TVAResultsGroupPercent : PercentCell;
      } else {
        ValueCell = NumberCell;
        PeriodCell = rootStore.isTVA ? TVAResultsGroup : NumberCell;
      }

      var cumulative = indicator.isCumulative === null ? null : indicator.isCumulative ? gettext('Cumulative') : gettext('Non-cumulative');
      var displayNumber = indicator.number;

      if (displayNumber && displayNumber.length > 0 && displayNumber.slice(-1) == ":") {
        displayNumber = displayNumber.slice(0, -1);
      }

      var reportData = rootStore.getReportData(indicator.pk);
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, rootStore.indicatorHasActiveDisaggregations(indicator) ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ExpandoCell, {
        value: displayNumber,
        expanded: this.state.expanded,
        clickHandler: this.handleExpandoClick
      }) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorCell, {
        className: "indicator-cell ",
        value: displayNumber
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorResultModalCell, {
        indicator: indicator
      }), rootStore.indicatorHasActiveDisaggregations(indicator) ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorNameExpandoCell, {
        value: indicator.name,
        expanded: this.state.expanded,
        clickHandler: this.handleExpandoClick
      }) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorCell, {
        className: "indicator-cell ",
        value: indicator.name
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorEditModalCell, {
        indicator: indicator
      }), !rootStore.resultsFramework && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorCell, {
        className: "indicator-cell ",
        value: indicator.oldLevelDisplay
      }), rootStore.hasUOMColumn && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorCell, {
        className: "indicator-cell ",
        value: indicator.unitOfMeasure
      }), rootStore.hasChangeColumn && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorCell, {
        className: "indicator-cell ",
        value: indicator.directionOfChange || gettext('N/A')
      }), rootStore.hasCNCColumn && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorCell, {
        className: "indicator-cell ",
        value: cumulative || gettext('N/A')
      }), rootStore.hasUOMTypeColumn && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorCell, {
        className: "indicator-cell is-percent-column ",
        value: indicator.isPercent ? '%' : '#'
      }), rootStore.hasBaselineColumn && (indicator.baseline === null ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorCell, {
        className: "indicator-cell baseline-column",
        value: gettext('N/A')
      }) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ValueCell, {
        value: indicator.baseline,
        className: "lop-column"
      })), reportData && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ValueCell, {
        value: reportData.lopTarget,
        className: "lop-column "
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ValueCell, {
        value: reportData.lopActual,
        className: "lop-column"
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(PercentCell, {
        value: reportData.lopMet,
        className: "lop-column"
      }), reportData.periodValues && rootStore.periodValues(indicator.pk).map(function (value, index) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(PeriodCell, {
          value: value,
          key: index,
          resultCell: true
        });
      }))), this.state.expanded && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, rootStore.activeDisaggregationPks.filter(function (pk) {
        return indicator.hasDisaggregation(pk);
      }).map(function (pk) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, {
          key: pk
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(DisaggregationTable, {
          indicator: indicator,
          disaggregationPk: pk
        }));
      })));
    }
  }]);

  return IndicatorRow;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp)) || _class) || _class);
var LevelTitleRow = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('rootStore')(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref11) {
  var rootStore = _ref11.rootStore,
      children = _ref11.children;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
    colSpan: rootStore.reportColumnWidth + 1,
    className: "iptt-level-row"
  }, children));
}));

var LevelRow = function LevelRow(_ref12) {
  var level = _ref12.level;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LevelTitleRow, null, level.tierNumber, ": ", level.name);
};

var BlankLevelRow = function BlankLevelRow() {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LevelTitleRow, null, gettext('Indicators unassigned to a results framework level'));
};

var LevelGroup = function LevelGroup(_ref13) {
  var level = _ref13.level,
      indicators = _ref13.indicators;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, level ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LevelRow, {
    level: level
  }) : indicators && indicators.length > 0 && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(BlankLevelRow, null), indicators.map(function (indicator, index) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorRow, {
      indicator: indicator,
      levelCol: false,
      key: index
    });
  }));
};



/***/ }),

/***/ "Ez0T":
/*!****************************************!*\
  !*** ./js/components/selectWidgets.js ***!
  \****************************************/
/*! exports provided: SingleReactSelect, DateSelect, SingleSelect, MultiSelectCheckbox, GroupBySelect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SingleReactSelect", function() { return SingleReactSelect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DateSelect", function() { return DateSelect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SingleSelect", function() { return SingleSelect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MultiSelectCheckbox", function() { return MultiSelectCheckbox; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GroupBySelect", function() { return GroupBySelect; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-select */ "Cs6D");
/* harmony import */ var react_multiselect_checkboxes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-multiselect-checkboxes */ "VCnP");
/* harmony import */ var react_multiselect_checkboxes__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_multiselect_checkboxes__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _formUtils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../formUtils */ "G56O");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../constants */ "v38i");
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }






var SingleReactSelect = function SingleReactSelect(props) {
  var selectId = Object(_formUtils__WEBPACK_IMPORTED_MODULE_3__["uniqueId"])('react-select');
  var labelClasses = props.labelClasses || "col-form-label text-uppercase";
  var formRowClasses = props.formRowClasses || "form-row mb-3";
  var selectClasses = props.selectClasses || "tola-react-select";
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: formRowClasses
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    htmlFor: selectId,
    className: labelClasses
  }, props.label), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_1__["default"], {
    onChange: props.update,
    value: props.value,
    id: selectId,
    className: selectClasses,
    isDisabled: props.disabled,
    options: props.options
  }));
};
var DateSelect = function DateSelect(props) {
  var selectId = Object(_formUtils__WEBPACK_IMPORTED_MODULE_3__["uniqueId"])('date-select');
  var formattedOptions = props.options && props.options.length == 1 && props.options[0].value !== undefined ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
    value: props.options[0].value
  }, props.options[0].label) : props.options && props.options.length > 0 && props.options[0].options && props.options[0].options !== undefined ? props.options.map(function (optgroup, index) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("optgroup", {
      label: optgroup.label,
      key: index
    }, optgroup.options.map(function (option) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
        value: option.value,
        key: option.value
      }, option.label);
    }));
  }) : props.options.map(function (option, index) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
      value: option.value,
      key: index
    }, option.label);
  });
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "form-row mb-3"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    htmlFor: selectId,
    className: "col-form-label text-uppercase"
  }, props.label), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("select", {
    className: "form-control",
    id: selectId,
    value: props.value,
    onChange: props.update,
    disabled: props.disabled
  }, formattedOptions));
};
var SingleSelect = function SingleSelect(props) {
  var selectId = Object(_formUtils__WEBPACK_IMPORTED_MODULE_3__["uniqueId"])('react-select');
  var formGroupClass = props.formGroupClass || "form-row mb-3";
  var labelClass = props.labelClass || "col-form-label text-uppercase";
  var selectClass = props.selectClass || "form-control";
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: formGroupClass
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    htmlFor: selectId,
    className: labelClass
  }, props.label), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("select", {
    onChange: props.update,
    value: props.value,
    id: selectId,
    className: selectClass,
    disabled: props.disabled
  }, props.options));
};
/**
 * styling element to replace OptGroup headings in react multiselect checkbox widgets - used for
 * MultiSelectCheckbox when optgroups are required
 */

var GroupHeading = function GroupHeading(props) {
  if (props.children == '') {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null);
  } else {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("hr", {
      style: {
        margin: '3px 0px 0px 0px'
      }
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "text-muted",
      style: {
        textTransform: 'uppercase',
        paddingLeft: '4px',
        marginBottom: '2px'
      }
    }, props.children));
  }
};
/**
 * Styles ReactMultiSelectCheckbox to fit Tola styles
 */


var MultiSelectCheckbox = function MultiSelectCheckbox(props) {
  var selectId = Object(_formUtils__WEBPACK_IMPORTED_MODULE_3__["uniqueId"])('multiselect');
  var blankOptions = !props.options || props.options.length == 0 || props.options.length == 1 && props.options[0].value === null;
  var multiSelectProps = blankOptions ? {
    getDropdownButtonLabel: function getDropdownButtonLabel() {
      return gettext('None available');
    },
    isDisabled: true,
    menuIsOpen: false,
    options: []
  } : {
    isMulti: true,
    options: props.options,
    getDropdownButtonLabel: function getDropdownButtonLabel(_ref) {
      if (!_ref.value) {
        return gettext('None selected');
      }

      if (Array.isArray(_ref.value)) {
        var options = _ref.value.filter(function (option) {
          return !option.noList;
        });

        if (options.length == 0) {
          return gettext('None selected');
        }

        if (options.length == 1) {
          return options[0].label;
        }

        return "".concat(options.length, "  ").concat(gettext('selected'));
      }

      return _ref.value.label;
    }
  };
  var baseStyles = {
    dropdownButton: function dropdownButton(base) {
      return blankOptions ? _objectSpread(_objectSpread({}, base), {}, {
        backgroundColor: '#E5E6E8',
        background: ''
      }) : base;
    },
    option: function option(provided, state) {
      return _objectSpread(_objectSpread({}, provided), {}, {
        padding: '1px 12px',
        display: 'inline-block'
      });
    },
    container: function container(provided, state) {
      return _objectSpread(_objectSpread({}, provided), {}, {
        backgroundColor: '#f5f5f5'
      });
    }
  };

  var formatOptionLabel = function formatOptionLabel(props) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      style: {
        display: "inline-block",
        "float": "right",
        width: "90%"
      }
    }, props.label);
  };

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "form-row mb-2 tola-react-multiselect-row"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    htmlFor: selectId,
    className: "col-form-label text-uppercase"
  }, props.label), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_multiselect_checkboxes__WEBPACK_IMPORTED_MODULE_2___default.a, _extends({
    id: selectId,
    styles: baseStyles,
    formatOptionLabel: formatOptionLabel,
    components: {
      GroupHeading: GroupHeading
    },
    value: props.value,
    onChange: props.update
  }, multiSelectProps)));
};
var GroupBySelect = function GroupBySelect(_ref2) {
  var chainLabel = _ref2.chainLabel,
      selectProps = _objectWithoutProperties(_ref2, ["chainLabel"]);

  var options = [/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
    value: _constants__WEBPACK_IMPORTED_MODULE_4__["GROUP_BY_CHAIN"],
    key: 1
  }, chainLabel), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
    value: _constants__WEBPACK_IMPORTED_MODULE_4__["GROUP_BY_LEVEL"],
    key: 2
  },
  /* # Translators: refers to grouping the report by the level of the indicator */
  gettext('by Level'))];
  ;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SingleSelect, _extends({
    label:
    /* # Translators: menu for selecting how rows are grouped in a report */
    gettext('Group indicators'),
    options: options
  }, selectProps));
};

/***/ }),

/***/ "G56O":
/*!*************************!*\
  !*** ./js/formUtils.js ***!
  \*************************/
/*! exports provided: uniqueId */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "uniqueId", function() { return uniqueId; });
/*
 * ID generating code &c. for form inputs
 */
var lastId = 0;
function uniqueId() {
  var prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'id';
  lastId++;
  return "".concat(prefix).concat(lastId);
}

/***/ }),

/***/ "HYjZ":
/*!**************************************************************!*\
  !*** ./js/pages/iptt_report/components/report/reportBody.js ***!
  \**************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _header__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./header */ "nzxa");
/* harmony import */ var _tableHeader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tableHeader */ "UCRK");
/* harmony import */ var _tableBody__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./tableBody */ "eLjl");




/* harmony default export */ __webpack_exports__["default"] = (function () {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("main", {
    className: "iptt_table_wrapper"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    id: "id_div_top_iptt_report"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_header__WEBPACK_IMPORTED_MODULE_1__["default"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("table", {
    className: "table table-sm table-hover table__iptt",
    id: "iptt_table"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_tableHeader__WEBPACK_IMPORTED_MODULE_2__["default"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_tableBody__WEBPACK_IMPORTED_MODULE_3__["default"], null))));
});

/***/ }),

/***/ "J3fw":
/*!*****************************************************************!*\
  !*** ./js/pages/iptt_report/components/sidebar/reportFilter.js ***!
  \*****************************************************************/
/*! exports provided: LevelSelect, DisaggregationSelect, SiteSelect, TypeSelect, SectorSelect, IndicatorSelect, HiddenColumnSelect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LevelSelect", function() { return LevelSelect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DisaggregationSelect", function() { return DisaggregationSelect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SiteSelect", function() { return SiteSelect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TypeSelect", function() { return TypeSelect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SectorSelect", function() { return SectorSelect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IndicatorSelect", function() { return IndicatorSelect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HiddenColumnSelect", function() { return HiddenColumnSelect; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var _components_selectWidgets__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../components/selectWidgets */ "Ez0T");



/**
 * input-ready multi-select checkbox widget for filtering IPTT report by level
 * contains both "grouping" and "chaining" filtering options, displayed as two optgroups
 * labeling for second optgroup is based on Program's definition of tier 2 (stored in rootStore.selectedProgram)
 */

var LevelSelect = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('filterStore')(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref) {
  var filterStore = _ref.filterStore;

  var updateSelected = function updateSelected(selected) {
    filterStore.levelTierFilters = {
      levels: selected.filter(function (s) {
        return s.category === "level";
      }).map(function (s) {
        return s.value;
      }),
      tiers: selected.filter(function (s) {
        return s.category === "tier";
      }).map(function (s) {
        return s.value;
      }),
      oldLevels: selected.filter(function (s) {
        return s.category === "oldLevel";
      }).map(function (s) {
        return s.value;
      })
    };
  };

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_selectWidgets__WEBPACK_IMPORTED_MODULE_2__["MultiSelectCheckbox"], {
    label: gettext('Levels'),
    options: filterStore.levelTierOptions,
    value: filterStore.levelTierFilters,
    update: function update(selected) {
      filterStore.levelTierFilters = {
        levels: selected.filter(function (s) {
          return s.category === "level";
        }).map(function (s) {
          return s.value;
        }),
        tiers: selected.filter(function (s) {
          return s.category === "tier";
        }).map(function (s) {
          return s.value;
        }),
        oldLevels: selected.filter(function (s) {
          return s.category === "oldLevel";
        }).map(function (s) {
          return s.value;
        })
      };
    }
  });
}));
/**
 * input-ready multi-select checkbox widget for filtering IPTT report by disaggregations
 */

var DisaggregationSelect = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('filterStore')(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref2) {
  var filterStore = _ref2.filterStore;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_selectWidgets__WEBPACK_IMPORTED_MODULE_2__["MultiSelectCheckbox"], {
    label:
    /* # Translators: labels categories that  data could be disaggregated into */
    gettext('Disaggregations'),
    options: filterStore.disaggregationOptions,
    value: filterStore.disaggregationFilters,
    update: function update(selected) {
      filterStore.disaggregationFilters = selected.map(function (s) {
        return s.value;
      });
    }
  });
}));
var HiddenColumnSelect = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('filterStore')(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref3) {
  var filterStore = _ref3.filterStore;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_selectWidgets__WEBPACK_IMPORTED_MODULE_2__["MultiSelectCheckbox"], {
    label:
    /* # Translators: labels columns that could be hidden in the report */
    gettext('Hide columns'),
    options: filterStore.hideColumnOptions,
    value: filterStore.hiddenColumns,
    update: function update(selected) {
      filterStore.hiddenColumns = selected.map(function (s) {
        return s.value;
      });
    }
  });
}));
/**
 * multi-select checkbox for selecting sites for filtering IPTT */

var SiteSelect = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('filterStore')(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref4) {
  var filterStore = _ref4.filterStore;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_selectWidgets__WEBPACK_IMPORTED_MODULE_2__["MultiSelectCheckbox"], {
    label:
    /* # Translators: labels sites that a data could be collected at */
    gettext('Sites'),
    options: filterStore.siteOptions,
    value: filterStore.siteFilters,
    update: function update(selected) {
      filterStore.siteFilters = selected.map(function (s) {
        return s.value;
      });
    }
  });
}));
/**
 * multi-select checkbox for selecting types for filtering IPTT */

var TypeSelect = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('filterStore')(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref5) {
  var filterStore = _ref5.filterStore;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_selectWidgets__WEBPACK_IMPORTED_MODULE_2__["MultiSelectCheckbox"], {
    label:
    /* # Translators: labels types of indicators to filter by */
    gettext('Types'),
    options: filterStore.indicatorTypeOptions,
    value: filterStore.indicatorTypeFilters,
    update: function update(selected) {
      filterStore.indicatorTypeFilters = selected.map(function (s) {
        return s.value;
      });
    }
  });
}));
/**
 * multi-select checkbox for selecting sectors for filtering IPTT */

var SectorSelect = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('filterStore')(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref6) {
  var filterStore = _ref6.filterStore;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_selectWidgets__WEBPACK_IMPORTED_MODULE_2__["MultiSelectCheckbox"], {
    label:
    /* # Translators: labels sectors (i.e. 'Food Security') that an indicator can be categorized as */
    gettext('Sectors'),
    options: filterStore.sectorOptions,
    value: filterStore.sectorFilters,
    update: function update(selected) {
      filterStore.sectorFilters = selected.map(function (s) {
        return s.value;
      });
    }
  });
}));
/**
 * multi-select checkbox for selecting indicators for filtering IPTT */

var IndicatorSelect = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('filterStore')(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref7) {
  var filterStore = _ref7.filterStore;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_selectWidgets__WEBPACK_IMPORTED_MODULE_2__["MultiSelectCheckbox"], {
    label:
    /* # Translators: labels a filter to select which indicators to display */
    gettext('Indicators'),
    options: filterStore.indicatorOptions,
    value: filterStore.indicatorFilters,
    update: function update(selected) {
      filterStore.indicatorFilters = selected.map(function (s) {
        return s.value;
      });
    }
  });
}));


/***/ }),

/***/ "My+N":
/*!********************************!*\
  !*** ./js/models/indicator.js ***!
  \********************************/
/*! exports provided: getIndicator, withMeasurement */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getIndicator", function() { return getIndicator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "withMeasurement", function() { return withMeasurement; });
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mobx */ "2vnA");
/* harmony import */ var _formattingUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./formattingUtils */ "NHe6");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants */ "v38i");




var _gettext = typeof gettext !== 'undefined' ? gettext : function (s) {
  return s;
};
/**
 *  Base indicator constructor
 *  JSON params:
 *      pk (string|number)
 *      name (string)
 *      level_pk (number)
 *      old_level_name (string)
 *      means_of_verification (string)
 *  @return {Object}
 */


var bareIndicator = function bareIndicator() {
  var indicatorJSON = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    pk: parseInt(indicatorJSON.pk),
    name: indicatorJSON.name,
    levelPk: !isNaN(parseInt(indicatorJSON.level_pk)) ? parseInt(indicatorJSON.level_pk) : false,
    oldLevelDisplay: indicatorJSON.old_level_name || false,
    meansOfVerification: indicatorJSON.means_of_verification || false
  };
};

var getIndicator = function getIndicator() {
  for (var _len = arguments.length, indicatorConstructors = new Array(_len), _key = 0; _key < _len; _key++) {
    indicatorConstructors[_key] = arguments[_key];
  }

  return function (indicatorJSON) {
    return [bareIndicator].concat(indicatorConstructors).reduce(function (acc, fn) {
      return Object(mobx__WEBPACK_IMPORTED_MODULE_0__["extendObservable"])(acc, fn(indicatorJSON));
    }, {});
  };
};
/**
 *  indicator constructor where unit and measurement figures are recorded
 *  JSON params:
 *      unit_of_measure (string)
 *      is_percent (boolean)
 *      is_cumulative (boolean)
 *      direction_of_change (string)
 *      baseline (number)
 *      lop_target (number)
 *  @return {Object}
 */

var withMeasurement = function withMeasurement() {
  var indicatorJSON = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    _formatDecimal: _formattingUtils__WEBPACK_IMPORTED_MODULE_1__["formatDecimal"],
    frequency: parseInt(indicatorJSON.target_frequency),

    get timeAware() {
      return _constants__WEBPACK_IMPORTED_MODULE_2__["TIME_AWARE_FREQUENCIES"].includes(this.frequency);
    },

    unitOfMeasure: indicatorJSON.unit_of_measure || false,
    isPercent: Boolean(indicatorJSON.is_percent),
    isCumulative: Boolean(indicatorJSON.is_cumulative),
    directionOfChange: indicatorJSON.direction_of_change || false,
    baseline: indicatorJSON.baseline || null,
    _lopTarget: indicatorJSON.lop_target || null,
    _lopActual: indicatorJSON.lop_actual || null,
    _lopMet: indicatorJSON.lop_met || null,
    _lopTargetProgress: indicatorJSON.lop_target_progress || null,
    _lopActualProgress: indicatorJSON.lop_actual_progress || null,
    _lopMetProgress: indicatorJSON.lop_met_progress || null,

    get lopTarget() {
      return this._formatDecimal(this._lopTarget);
    },

    get lopActual() {
      return this._formatDecimal(this._lopActual);
    },

    get lopMet() {
      return this._formatDecimal(this._lopMet);
    },

    get lopTargetProgress() {
      return this._formatDecimal(this._lopTargetProgress);
    },

    get lopActualProgress() {
      return this._formatDecimal(this._lopActualProgress);
    },

    get lopMetProgress() {
      return this._formatDecimal(this._lopMetProgress);
    }

  };
};

/***/ }),

/***/ "N38U":
/*!****************************************************!*\
  !*** ./js/pages/iptt_report/models/filterStore.js ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mobx */ "2vnA");
/* harmony import */ var _ipttProgram__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ipttProgram */ "m6yc");
/* harmony import */ var _router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../router */ "XGqG");
/* harmony import */ var _apiv2__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../apiv2 */ "5/4V");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../constants */ "v38i");
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }







var getProgramsList = function getProgramsList() {
  var programsList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return mobx__WEBPACK_IMPORTED_MODULE_0__["observable"].object({
    _allPrograms: new Map(programsList.filter(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 3),
          pk = _ref2[0],
          name = _ref2[1],
          tvaCount = _ref2[2];

      return !isNaN(parseInt(pk));
    }).map(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 3),
          pk = _ref4[0],
          name = _ref4[1],
          tvaCount = _ref4[2];

      return [parseInt(pk), {
        pk: parseInt(pk),
        name: name,
        tvaCount: parseInt(tvaCount)
      }];
    })),
    listPrograms: function listPrograms() {
      return Array.from(this._allPrograms.values());
    },
    listTvaPrograms: function listTvaPrograms() {
      return this.listPrograms().filter(function (program) {
        return program.tvaCount > 0;
      });
    },
    getProgram: function getProgram(programId) {
      return !isNaN(parseInt(programId)) ? this._allPrograms.get(parseInt(programId)) : null;
    },
    hasProgram: function hasProgram(programId) {
      return !isNaN(parseInt(programId)) ? this._allPrograms.has(parseInt(programId)) : false;
    }
  });
};

var getProgramsFilterData = function getProgramsFilterData() {
  var programData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var program = Object(_ipttProgram__WEBPACK_IMPORTED_MODULE_1__["default"])(programData);
  return mobx__WEBPACK_IMPORTED_MODULE_0__["observable"].object({
    _programs: new Map([[program.pk, program]]),
    getProgramFilterData: function getProgramFilterData(programId) {
      return this._programs.has(parseInt(programId)) ? this._programs.get(parseInt(programId)) : null;
    },
    loadProgramFilterData: function loadProgramFilterData(programId) {
      var _this = this;

      if (!isNaN(parseInt(programId))) {
        return _apiv2__WEBPACK_IMPORTED_MODULE_3__["default"].ipttFilterData(programId).then(function (data) {
          return Object(_ipttProgram__WEBPACK_IMPORTED_MODULE_1__["default"])(data);
        }).then(function (program) {
          Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
            _this._programs.set(program.pk, program);

            return program;
          });
        });
      }

      return Promise.reject('invalid program Id');
    }
  });
};

/* harmony default export */ __webpack_exports__["default"] = (function () {
  var reactContext = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var router = Object(_router__WEBPACK_IMPORTED_MODULE_2__["default"])();
  var filterStore = mobx__WEBPACK_IMPORTED_MODULE_0__["observable"].object({
    _programsListStore: getProgramsList(reactContext.programs_list || []),
    _programFilterDataStore: getProgramsFilterData(reactContext.program_data),
    _router: router,
    _reportType: null,
    _selectedProgramId: null,
    _selectedFrequency: null,
    _start: null,
    _end: null,
    _mostRecentForce: null,
    _groupBy: _constants__WEBPACK_IMPORTED_MODULE_4__["GROUP_BY_CHAIN"],
    _indicatorFilters: {},
    _hiddenColumns: [],
    _hiddenCategories: false,

    get isTVA() {
      return this._reportType === _constants__WEBPACK_IMPORTED_MODULE_4__["TVA"];
    },

    get selectedProgramId() {
      return this._programsListStore.hasProgram(this._selectedProgramId) ? this._selectedProgramId : null;
    },

    /**
     * Method instead of setter because there are side effects (updating frequency/timeframe)
     */
    setProgramId: function setProgramId(programId) {
      var _this2 = this;

      programId = parseInt(programId);

      if (isNaN(programId)) {
        this._selectedProgramId = null;
      } else if (programId !== this._selectedProgramId) {
        this.clearFilters();
        var frequency = this.selectedFrequency;
        var periods = {
          mostRecent: this.mostRecentValue != '' ? this.mostRecentValue : null,
          showAll: this.showAll,
          start: this.startPeriodValue,
          end: this.endPeriodValue
        };
        this._selectedProgramId = programId;
        return this.updateProgramFilterData().then(function () {
          _this2.setFrequency(frequency);

          _this2.setPeriods(periods);
        });
      }
    },

    /**
     * Options throughout returns a [{value, label}] array to supply select options
     */
    get programOptions() {
      return (this.isTVA ? this._programsListStore.listTvaPrograms() : this._programsListStore.listPrograms()).map(function (program) {
        return {
          value: program.pk,
          label: program.name
        };
      });
    },

    get selectedProgramOption() {
      var program = this._programsListStore.getProgram(this.selectedProgramId);

      return program && program !== null ? {
        value: program.pk,
        label: program.name
      } : _constants__WEBPACK_IMPORTED_MODULE_4__["BLANK_OPTION"];
    },

    set selectedProgramOption(option) {
      this.setProgramId(option.value);
    },

    get programFilterData() {
      return this._programFilterDataStore.getProgramFilterData(this.selectedProgramId);
    },

    updateProgramFilterData: function updateProgramFilterData() {
      return this._programFilterDataStore.loadProgramFilterData(this.selectedProgramId);
    },

    get _frequencyLabels() {
      return this.isTVA ? _constants__WEBPACK_IMPORTED_MODULE_4__["TVA_FREQUENCY_LABELS"] : _constants__WEBPACK_IMPORTED_MODULE_4__["TIMEPERIODS_FREQUENCY_LABELS"];
    },

    get frequencyDisabled() {
      return this.selectedProgramId === null;
    },

    get frequencyOptions() {
      var _this3 = this;

      if (this.programFilterData) {
        return (this.isTVA ? Array.from(this.programFilterData.frequencies).sort() : _constants__WEBPACK_IMPORTED_MODULE_4__["TIME_AWARE_FREQUENCIES"]).map(function (frequency) {
          return {
            value: frequency,
            label: _this3._frequencyLabels[frequency]
          };
        });
      }

      return [_constants__WEBPACK_IMPORTED_MODULE_4__["BLANK_OPTION"]];
    },

    get selectedFrequency() {
      return this.selectedProgramId && !isNaN(parseInt(this._selectedFrequency)) ? parseInt(this._selectedFrequency) : null;
    },

    /**
     * method instead of setter because of side effects (updating timeframe)
     */
    setFrequency: function setFrequency(frequency) {
      frequency = parseInt(frequency);

      if (isNaN(frequency)) {
        this._selectedFrequency = null;
        return false;
      }

      if (this.isTVA && !this.programFilterData.frequencies.has(frequency)) {
        frequency = parseInt(Array.from(this.programFilterData.frequencies).sort()[0]);
      } else if (!this.isTVA && !_constants__WEBPACK_IMPORTED_MODULE_4__["TIME_AWARE_FREQUENCIES"].includes(frequency)) {
        frequency = parseInt(_constants__WEBPACK_IMPORTED_MODULE_4__["TIME_AWARE_FREQUENCIES"][0]);
      }

      if (frequency !== this._selectedFrequency) {
        var periods = {
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
      return this.programFilterData && this.selectedFrequency !== null ? {
        value: this.selectedFrequency,
        label: this._frequencyLabels[this.selectedFrequency]
      } : _constants__WEBPACK_IMPORTED_MODULE_4__["BLANK_OPTION"];
    },

    set selectedFrequencyOption(option) {
      this.setFrequency(option.value);
    },

    get periodsDisabled() {
      return !this.programFilterData || !_constants__WEBPACK_IMPORTED_MODULE_4__["TIME_AWARE_FREQUENCIES"].includes(this.selectedFrequency);
    },

    get periodRange() {
      return this.periodsDisabled ? {
        years: [],
        options: [_constants__WEBPACK_IMPORTED_MODULE_4__["BLANK_OPTION"]]
      } : this.programFilterData.periodRanges.get(this.selectedFrequency);
    },

    get startOptions() {
      var _this4 = this;

      if (_constants__WEBPACK_IMPORTED_MODULE_4__["IRREGULAR_FREQUENCIES"].includes(this.selectedFrequency)) {
        // select is disabled for irregular frequencies, display blank in disabled box
        return [_constants__WEBPACK_IMPORTED_MODULE_4__["BLANK_OPTION"]];
      }

      if (this.selectedFrequency == 3) {
        return this.periodRange.options;
      }

      var yearGroups = this.periodRange.years.map(function (year) {
        return {
          label: year,
          options: _this4.periodRange.options.filter(function (periodRange) {
            return periodRange.year == year;
          })
        };
      }).filter(function (yearGroup) {
        return yearGroup.options.length > 0;
      });

      if (yearGroups.length == 0) {
        return [_constants__WEBPACK_IMPORTED_MODULE_4__["BLANK_OPTION"]];
      }

      if (yearGroups.length == 1) {
        return yearGroups[0].options;
      }

      return yearGroups;
    },

    get endOptions() {
      var _this5 = this;

      if (_constants__WEBPACK_IMPORTED_MODULE_4__["IRREGULAR_FREQUENCIES"].includes(this.selectedFrequency)) {
        // select is disabled for irregular frequencies, display blank in disabled box
        return [_constants__WEBPACK_IMPORTED_MODULE_4__["BLANK_OPTION"]];
      }

      var options = this.periodRange.options.filter(function (periodOption) {
        return !_this5.startPeriodValue || periodOption.value >= _this5.startPeriodValue;
      });

      if (this.selectedFrequency == 3) {
        return options;
      }

      var yearGroups = this.periodRange.years.map(function (year) {
        return {
          label: year,
          options: options.filter(function (periodRange) {
            return periodRange.year == year;
          })
        };
      }).filter(function (yearGroup) {
        return yearGroup.options.length > 0;
      });

      if (yearGroups.length == 0) {
        return [_constants__WEBPACK_IMPORTED_MODULE_4__["BLANK_OPTION"]];
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
      return this.periodsDisabled || this.showAll || this.endPeriodValue !== this._currentPeriod ? '' : this.endPeriodValue - this.startPeriodValue + 1;
    },

    get showAll() {
      /* _mostRecentForce - for when the selected # of most recent periods is the same as
       * all periods, but the checkbox should say "most recent"
       */
      return this.periodsDisabled || this._mostRecentForce ? false : this.startPeriodValue === 0 && this._lastPeriod && this.endPeriodValue == this._lastPeriod;
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
        var unForce = Object(mobx__WEBPACK_IMPORTED_MODULE_0__["reaction"])(function () {
          return [self.mostRecentChecked, self.startPeriodValue, self.endPeriodValue];
        }, function (checked, reaction) {
          self._mostRecentForce = false;
          reaction.dispose();
        });
      }
    },

    get startPeriod() {
      if (this.programFilterData && _constants__WEBPACK_IMPORTED_MODULE_4__["IRREGULAR_FREQUENCIES"].includes(this.selectedFrequency)) {
        return this.programFilterData.periodRanges.get(this.selectedFrequency).periods[0];
      }

      return this.programFilterData && this.selectedFrequency && this._start !== null ? this.programFilterData.periodRanges.get(this.selectedFrequency).periods[this._start] : null;
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
      if (this.programFilterData && _constants__WEBPACK_IMPORTED_MODULE_4__["IRREGULAR_FREQUENCIES"].includes(this.selectedFrequency)) {
        return this.programFilterData.periodRanges.get(this.selectedFrequency).periods.slice(-1).pop();
      }

      return this.programFilterData && this.selectedFrequency && this._end !== null ? this.programFilterData.periodRanges.get(this.selectedFrequency).periods[this._end] : null;
    },

    get endPeriodValue() {
      return this.periodsDisabled ? null : this._end;
    },

    set endPeriodValue(endPeriod) {
      endPeriod = !isNaN(parseInt(endPeriod)) ? parseInt(endPeriod) : this._lastPeriod;

      if (this._lastPeriod !== null) {
        this._end = Math.max(this.startPeriodValue || 0, Math.min(this._lastPeriod, endPeriod));
      }
    },

    setTimeframe: function setTimeframe() {
      var _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref5$mostRecent = _ref5.mostRecent,
          mostRecent = _ref5$mostRecent === void 0 ? null : _ref5$mostRecent,
          _ref5$showAll = _ref5.showAll,
          showAll = _ref5$showAll === void 0 ? null : _ref5$showAll;

      if (mostRecent) {
        this.mostRecentValue = mostRecent;
      }

      if (showAll) {
        this.showAll = true;
      }
    },
    setPeriods: function setPeriods(_ref6) {
      var _ref6$mostRecent = _ref6.mostRecent,
          mostRecent = _ref6$mostRecent === void 0 ? null : _ref6$mostRecent,
          _ref6$showAll = _ref6.showAll,
          showAll = _ref6$showAll === void 0 ? null : _ref6$showAll,
          _ref6$start = _ref6.start,
          start = _ref6$start === void 0 ? null : _ref6$start,
          _ref6$end = _ref6.end,
          end = _ref6$end === void 0 ? null : _ref6$end;

      if (mostRecent) {
        this.mostRecentValue = mostRecent;
      } else if (showAll) {
        this.showAll = true;
      } else {
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
      this._groupBy = parseInt(groupBy) === _constants__WEBPACK_IMPORTED_MODULE_4__["GROUP_BY_LEVEL"] ? _constants__WEBPACK_IMPORTED_MODULE_4__["GROUP_BY_LEVEL"] : _constants__WEBPACK_IMPORTED_MODULE_4__["GROUP_BY_CHAIN"];
    },

    get allLevels() {
      return (this.resultsFramework ? this.groupBy === _constants__WEBPACK_IMPORTED_MODULE_4__["GROUP_BY_CHAIN"] ? this.programFilterData.levelsInChainOrder : this.programFilterData.levelsInLevelOrder : []) || [];
    },

    get levels() {
      return this.allLevels;
    },

    get _levelOptions() {
      var levelPks = this.resultsFramework ? [].concat(_toConsumableArray(this.getAllIndicators('levels').map(function (indicator) {
        return indicator.levelPk;
      })), _toConsumableArray(this._indicatorFilters.levels)) : [];
      return this.levels.filter(function (level) {
        return level.isResultChainLevel && levelPks.includes(level.pk);
      }).map(function (level) {
        return {
          value: level.pk,
          label: level.resultChainLabel,
          category: "level"
        };
      });
    },

    get _tierOptions() {
      var _this6 = this;

      var tierPks = this.resultsFramework ? [].concat(_toConsumableArray(this.getAllIndicators('levels').filter(function (indicator) {
        return indicator.levelPk;
      }).map(function (indicator) {
        return _this6.programFilterData.levels.get(indicator.levelPk).tierPk;
      })), _toConsumableArray(this._indicatorFilters.tiers)) : [];
      return this.programFilterData ? (Array.from(this.programFilterData.tiers.values()) || []).filter(function (tier) {
        return tierPks.includes(tier.pk);
      }).map(function (tier) {
        return {
          value: tier.pk,
          label: tier.name,
          category: "tier"
        };
      }) : [];
    },

    get _oldLevelOptions() {
      var oldLevelPks = this.resultsFramework ? [] : [].concat(_toConsumableArray(this.getAllIndicators('levels').map(function (indicator) {
        return indicator.levelPk;
      })), _toConsumableArray(this._indicatorFilters.oldLevels));
      return this.programFilterData ? (Array.from(this.programFilterData.oldLevels.values()) || []).filter(function (oldLevel) {
        return oldLevelPks.includes(oldLevel.pk);
      }).map(function (oldLevel) {
        return {
          value: oldLevel.pk,
          label: oldLevel.name,
          category: "oldLevel"
        };
      }) : [_constants__WEBPACK_IMPORTED_MODULE_4__["BLANK_OPTION"]];
    },

    get levelTierOptions() {
      if (!this.programFilterData) {
        return [_constants__WEBPACK_IMPORTED_MODULE_4__["BLANK_OPTION"]];
      }

      if (this.programFilterData.resultsFramework) {
        var optGroups = [{
          label: '',
          options: this._tierOptions
        }, {
          label: this.programFilterData.resultChainLabel,
          options: this._levelOptions
        }].filter(function (optGroup) {
          return optGroup.options && optGroup.options.length > 0;
        });

        if (optGroups && optGroups.length > 0) {
          return optGroups;
        }

        return [_constants__WEBPACK_IMPORTED_MODULE_4__["BLANK_OPTION"]];
      }

      return this._oldLevelOptions && this._oldLevelOptions.length > 0 ? this._oldLevelOptions : [_constants__WEBPACK_IMPORTED_MODULE_4__["BLANK_OPTION"]];
    },

    get levelTierFilters() {
      var _this7 = this;

      return [].concat(_toConsumableArray(this._tierOptions.filter(function (option) {
        return _this7._indicatorFilters.tiers.includes(option.value);
      })), _toConsumableArray(this._levelOptions.filter(function (option) {
        return _this7._indicatorFilters.levels.includes(option.value);
      })), _toConsumableArray(this._oldLevelOptions.filter(function (option) {
        return _this7._indicatorFilters.oldLevels.includes(option.value);
      })));
    },

    set levelTierFilters(_temp) {
      var _ref7 = _temp === void 0 ? {} : _temp,
          _ref7$levels = _ref7.levels,
          levels = _ref7$levels === void 0 ? [] : _ref7$levels,
          _ref7$tiers = _ref7.tiers,
          tiers = _ref7$tiers === void 0 ? [] : _ref7$tiers,
          _ref7$oldLevels = _ref7.oldLevels,
          oldLevels = _ref7$oldLevels === void 0 ? [] : _ref7$oldLevels;

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
      var sectorPks = [].concat(_toConsumableArray(new Set(this.getAllIndicators('sectors').filter(function (indicator) {
        return indicator.sectorPk;
      }).map(function (indicator) {
        return indicator.sectorPk;
      }))), _toConsumableArray(this._indicatorFilters.sectors));
      return this.programFilterData ? Array.from(this.programFilterData.sectors.values()).filter(function (sector) {
        return sectorPks.includes(sector.pk);
      }).map(function (sector) {
        return {
          value: sector.pk,
          label: sector.name
        };
      }) : [_constants__WEBPACK_IMPORTED_MODULE_4__["BLANK_OPTION"]];
    },

    get sectorFilters() {
      var _this8 = this;

      return this.sectorOptions.filter(function (option) {
        return _this8._indicatorFilters.sectors.includes(option.value);
      });
    },

    set sectorFilters(sectorFilterValues) {
      if (sectorFilterValues === void 0) {
        sectorFilterValues = [];
      }

      this._indicatorFilters.sectors = sectorFilterValues.map(function (v) {
        return parseInt(v);
      });
    },

    get siteOptions() {
      var sitePks = [].concat(_toConsumableArray(new Set(this.getAllIndicators('sites').map(function (indicator) {
        return Array.from(indicator._sitePks.values());
      }).reduce(function (a, b) {
        return a.concat(b);
      }, []))), _toConsumableArray(this._indicatorFilters.sites));
      return this.programFilterData ? Array.from(this.programFilterData.sites.values()).filter(function (site) {
        return sitePks.includes(site.pk);
      }).map(function (site) {
        return {
          value: site.pk,
          label: site.name
        };
      }) : [_constants__WEBPACK_IMPORTED_MODULE_4__["BLANK_OPTION"]];
    },

    get siteFilters() {
      var _this9 = this;

      return this.siteOptions.filter(function (option) {
        return _this9._indicatorFilters.sites.includes(option.value);
      });
    },

    set siteFilters(siteFilterValues) {
      if (siteFilterValues === void 0) {
        siteFilterValues = [];
      }

      this._indicatorFilters.sites = siteFilterValues.map(function (v) {
        return parseInt(v);
      });
    },

    get disaggregationOptions() {
      var disaggregationPks = [].concat(_toConsumableArray(new Set(this.getAllIndicators('disaggregations').map(function (indicator) {
        return Array.from(indicator._disaggregationPks.values());
      }).reduce(function (a, b) {
        return a.concat(b);
      }, []))), _toConsumableArray(this._indicatorFilters.disaggregations));

      if (!this.programFilterData) {
        return [_constants__WEBPACK_IMPORTED_MODULE_4__["BLANK_OPTION"]];
      }

      var disaggregationOptions = Array.from(this.programFilterData.disaggregations.values()).filter(function (disaggregation) {
        return disaggregationPks.includes(disaggregation.pk);
      }).map(function (disaggregation) {
        return {
          value: disaggregation.pk,
          label: disaggregation.name,
          country: disaggregation.country
        };
      });

      var countries = _toConsumableArray(new Set(disaggregationOptions.map(function (option) {
        return option.country;
      }))).filter(function (country) {
        return country !== null;
      }).sort();

      var optgroups = [];
      /* # Translators: User-selectable option that filters out rows from a table where the disaggregation category has not been used (i.e. avoids showing lots of blank rows. */

      optgroups.push({
        value: "hide-categories",
        label: gettext('Only show categories with results'),
        noList: true
      });

      if (disaggregationOptions.filter(function (option) {
        return option.country === null;
      }).length > 0) {
        /* # Translators: filter that allows users to select only those disaggregation types that are available across the globe (i.e. across the agency). */
        optgroups.push({
          label: gettext('Global disaggregations'),
          options: disaggregationOptions.filter(function (option) {
            return option.country === null;
          })
        });
      }

      countries.forEach(function (country) {
        /* # Translators: A list of disaggregation types follows this header. */
        optgroups.push({
          label: "".concat(country, " ").concat(gettext('Disaggregations')),
          options: disaggregationOptions.filter(function (option) {
            return option.country === country;
          })
        });
      });
      return optgroups;
    },

    get currentDisaggregations() {
      var disaggregationPks = this._indicatorFilters.disaggregations && this._indicatorFilters.disaggregations.length > 0 ? this._indicatorFilters.disaggregations : _toConsumableArray(new Set(this.getAllIndicators('disaggregations').map(function (indicator) {
        return Array.from(indicator._disaggregationPks.values());
      }).reduce(function (a, b) {
        return a.concat(b);
      }, [])));
      return this.programFilterData ? Array.from(this.programFilterData.disaggregations.values()).filter(function (disaggregation) {
        return disaggregationPks.includes(disaggregation.pk);
      }).sort(function (disagg_a, disagg_b) {
        return disagg_a.name > disagg_b.name ? 1 : -1;
      }).map(function (disaggregation) {
        return disaggregation.pk;
      }) : [];
    },

    get disaggregationFilters() {
      var _this10 = this;

      var disaggregationOptions = [].concat.apply([], this.disaggregationOptions.slice(1).map(function (optgroup) {
        return optgroup.options;
      }));
      disaggregationOptions = disaggregationOptions.filter(function (option) {
        return option && option.value && _this10._indicatorFilters.disaggregations.includes(option.value);
      });

      if (this._hiddenCategories) {
        disaggregationOptions = [this.disaggregationOptions[0]].concat(_toConsumableArray(disaggregationOptions));
      }

      return disaggregationOptions;
    },

    set disaggregationFilters(disaggregationFilterValues) {
      if (disaggregationFilterValues === void 0) {
        disaggregationFilterValues = [];
      }

      this._indicatorFilters.disaggregations = disaggregationFilterValues.filter(function (v) {
        return v != 'hide-categories' && v != 'NaN' && !isNaN(parseInt(v));
      }).map(function (v) {
        return parseInt(v);
      });
      this._hiddenCategories = disaggregationFilterValues.includes('hide-categories');
    },

    get indicatorTypeOptions() {
      var typePks = [].concat(_toConsumableArray(new Set(this.getAllIndicators('types').map(function (indicator) {
        return Array.from(indicator._typePks.values());
      }).reduce(function (a, b) {
        return a.concat(b);
      }, []))), _toConsumableArray(this._indicatorFilters.indicatorTypes));
      return this.programFilterData ? Array.from(this.programFilterData.indicatorTypes.values()).filter(function (indicatorType) {
        return typePks.includes(indicatorType.pk);
      }).map(function (indicatorType) {
        return {
          value: indicatorType.pk,
          label: indicatorType.name
        };
      }) : [_constants__WEBPACK_IMPORTED_MODULE_4__["BLANK_OPTION"]];
    },

    get indicatorTypeFilters() {
      var _this11 = this;

      return this.indicatorTypeOptions.filter(function (option) {
        return _this11._indicatorFilters.indicatorTypes.includes(option.value);
      });
    },

    set indicatorTypeFilters(indicatorTypeFilterValues) {
      if (indicatorTypeFilterValues === void 0) {
        indicatorTypeFilterValues = [];
      }

      this._indicatorFilters.indicatorTypes = indicatorTypeFilterValues.map(function (v) {
        return parseInt(v);
      });
    },

    _filterFrequency: function _filterFrequency(indicators) {
      var _this12 = this;

      indicators = indicators || [];

      if (this.isTVA) {
        indicators = indicators.filter(function (indicator) {
          return indicator.frequency == _this12.selectedFrequency;
        });
      }

      return indicators;
    },
    _filterLevelTiers: function _filterLevelTiers(indicators) {
      var _this13 = this;

      indicators = indicators || [];

      if (this.resultsFramework && this._indicatorFilters.tiers && this._indicatorFilters.tiers.length > 0) {
        indicators = indicators.filter(function (indicator) {
          return indicator.levelPk && _this13._indicatorFilters.tiers.some(function (tierPk) {
            return _this13.programFilterData.levels.get(indicator.levelPk).showForTier(tierPk);
          });
        });
      }

      if (this.resultsFramework && this._indicatorFilters.levels && this._indicatorFilters.levels.length > 0) {
        indicators = indicators.filter(function (indicator) {
          return indicator.levelPk && _this13._indicatorFilters.levels.some(function (levelPk) {
            return _this13.programFilterData.levels.get(indicator.levelPk).showForChain(levelPk);
          });
        });
      }

      if (!this.resultsFramework && this._indicatorFilters.oldLevels && this._indicatorFilters.oldLevels.length > 0) {
        indicators = indicators.filter(function (indicator) {
          return indicator.levelPk && _this13._indicatorFilters.oldLevels.includes(indicator.levelPk);
        });
      }

      return indicators;
    },
    _filterSites: function _filterSites(indicators) {
      var _this14 = this;

      if (this._indicatorFilters.sites && this._indicatorFilters.sites.length > 0) {
        indicators = indicators.filter(function (indicator) {
          return _this14._indicatorFilters.sites.some(function (sitePk) {
            return indicator.hasSite(sitePk);
          });
        });
      }

      return indicators;
    },
    _filterDisaggregations: function _filterDisaggregations(indicators) {
      var _this15 = this;

      if (this._indicatorFilters.disaggregations && this._indicatorFilters.disaggregations.length > 0) {
        indicators = indicators.filter(function (indicator) {
          return _this15._indicatorFilters.disaggregations.some(function (disaggregationPk) {
            return indicator.hasDisaggregation(disaggregationPk);
          });
        });
      }

      return indicators;
    },
    _filterIndicatorTypes: function _filterIndicatorTypes(indicators) {
      var _this16 = this;

      if (this._indicatorFilters.indicatorTypes && this._indicatorFilters.indicatorTypes.length > 0) {
        indicators = indicators.filter(function (indicator) {
          return _this16._indicatorFilters.indicatorTypes.some(function (typePk) {
            return indicator.hasIndicatorType(typePk);
          });
        });
      }

      return indicators;
    },
    _filterSectors: function _filterSectors(indicators) {
      var _this17 = this;

      if (this._indicatorFilters.sectors && this._indicatorFilters.sectors.length > 0) {
        indicators = indicators.filter(function (indicator) {
          return indicator.sectorPk && _this17._indicatorFilters.sectors.includes(indicator.sectorPk);
        });
      }

      return indicators;
    },
    _filterIndicatorFilter: function _filterIndicatorFilter(indicators) {
      var _this18 = this;

      indicators = indicators || [];

      if (this._indicatorFilters.indicators && this._indicatorFilters.indicators.length > 0) {
        indicators = indicators.filter(function (indicator) {
          return _this18._indicatorFilters.indicators.includes(indicator.pk);
        });
      }

      return indicators;
    },
    filterIndicators: function filterIndicators(indicators) {
      var skip = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
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
    getUnassignedIndicators: function getUnassignedIndicators() {
      var skip = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      return this.filterIndicators(this.programFilterData.unassignedIndicators, skip);
    },
    getLevelIndicators: function getLevelIndicators(levelPk) {
      var _this19 = this;

      var skip = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      return this.filterIndicators((this.programFilterData.levelIndicators.get(levelPk) || []).map(function (indicatorPk) {
        return _this19.programFilterData.indicators.get(indicatorPk);
      }), skip) || [];
    },
    getAllIndicators: function getAllIndicators() {
      var skip = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (this.programFilterData) {
        var indicators = this.groupBy === _constants__WEBPACK_IMPORTED_MODULE_4__["GROUP_BY_CHAIN"] ? this.programFilterData.indicatorsInChainOrder : this.programFilterData.indicatorsInLevelOrder;
        return this.filterIndicators(indicators, skip);
      }

      return [];
    },
    getLevelIndicatorGroups: function getLevelIndicatorGroups() {
      var _this20 = this;

      var skip = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (this.resultsFramework) {
        return [].concat(_toConsumableArray(this.levels.map(function (level) {
          return {
            level: level,
            indicators: _this20.getLevelIndicators(level.pk, skip)
          };
        })), [{
          level: null,
          indicators: this.getUnassignedIndicators(skip)
        }]);
      }

      return (Array.from(this.programFilterData.oldLevels.values()) || []).map(function (oldLevel) {
        return {
          level: oldLevel,
          indicators: _this20.getAllIndicators(skip).filter(function (indicator) {
            return indicator.levelPk == oldLevel.pk;
          })
        };
      });
    },

    get indicatorOptions() {
      if (this.programFilterData) {
        var groups = this.getLevelIndicatorGroups('indicators');

        if (this.resultsFramework) {
          groups = groups.map(
          /* # Translators: Allows users to filter an indicator list for indicators that are unassigned. */
          function (levelGroup) {
            return {
              label: levelGroup.level ? levelGroup.level.tierNumber : gettext('Indicators unassigned to  a results framework level'),
              options: levelGroup.indicators.map(function (indicator) {
                return {
                  value: indicator.pk,
                  label: indicator.name
                };
              })
            };
          });
        } else {
          groups = groups.map(function (levelGroup) {
            return {
              label: levelGroup.level.name,
              options: levelGroup.indicators.map(function (indicator) {
                return {
                  value: indicator.pk,
                  label: indicator.name
                };
              })
            };
          });
        }

        groups = groups.filter(function (levelGroup) {
          return levelGroup.options && levelGroup.options.length > 0;
        });

        if (groups.length === 0) {
          return [_constants__WEBPACK_IMPORTED_MODULE_4__["BLANK_OPTION"]];
        } else if (groups.length === 1) {
          return groups[0].options;
        }

        return groups;
      }

      return [_constants__WEBPACK_IMPORTED_MODULE_4__["BLANK_OPTION"]];
    },

    get indicatorFilters() {
      var _this21 = this;

      var options = this.indicatorOptions;

      if (!options || options.length == 0) {
        return [];
      }

      if (options[0].options && options[0].options.length > 0) {
        options = options.reduce(function (acc, optGroup) {
          return [].concat(_toConsumableArray(acc), _toConsumableArray(optGroup.options));
        }, []);
      }

      return options.filter(function (option) {
        return _this21._indicatorFilters.indicators.includes(option.value);
      });
    },

    set indicatorFilters(indicatorFilterValues) {
      if (indicatorFilterValues === void 0) {
        indicatorFilterValues = [];
      }

      this._indicatorFilters.indicators = indicatorFilterValues.map(function (v) {
        return parseInt(v);
      });
    },

    clearFilters: function clearFilters() {
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
      this._hiddenCategories = false;
    },

    get filtersActive() {
      return Object.values(this._indicatorFilters).reduce(function (a, b) {
        return a + b.length;
      }, 0) > 0 || this._hiddenCategories;
    },

    get hideColumnOptions() {
      return [{
        label: gettext('Unit of measure'),
        value: 0
      }, {
        label: gettext('Change'),
        value: 1
      }, {
        label: gettext('C / NC'),
        value: 2
      }, {
        label: '# / %',
        value: 3
      }, {
        label: gettext('Baseline'),
        value: 4
      }];
    },

    get hiddenColumns() {
      var _this22 = this;

      return this.hideColumnOptions.filter(function (option) {
        return _this22._hiddenColumns.includes(option.value);
      });
    },

    set hiddenColumns(hiddenColumnOptions) {
      if (hiddenColumnOptions === void 0) {
        hiddenColumnOptions = [];
      }

      this._hiddenColumns = hiddenColumnOptions.map(function (v) {
        return parseInt(v);
      });
    },

    get pathParams() {
      var params = {
        tva: this.isTVA,
        programId: this.selectedProgramId,
        frequency: this.selectedFrequency,
        start: this.startPeriodValue,
        end: this.endPeriodValue,
        mr: this._mostRecentForce ? 1 : null,
        groupby: this.groupBy,
        levels: (this.resultsFramework ? this.levelTierFilters.filter(function (f) {
          return f.category == "level";
        }) : this.levelTierFilters.filter(function (f) {
          return f.category == "oldLevel";
        })).map(function (f) {
          return f.value;
        }),
        tiers: this.resultsFramework ? this.levelTierFilters.filter(function (f) {
          return f.category == "tier";
        }).map(function (f) {
          return f.value;
        }) : null,
        sectors: this.sectorFilters.map(function (f) {
          return f.value;
        }),
        sites: this.siteFilters.map(function (f) {
          return f.value;
        }),
        types: this.indicatorTypeFilters.map(function (f) {
          return f.value;
        }),
        indicators: this.indicatorFilters.map(function (f) {
          return f.value;
        }),
        disaggregations: this.disaggregationFilters.map(function (f) {
          return f.value;
        }),
        columns: this.hiddenColumns.map(function (f) {
          return f.value;
        })
      };
      Object.keys(params).forEach(function (key) {
        return params[key] === null && delete params[key];
      });
      return params;
    },

    updateParams: function updateParams(params) {
      if (params.programId) {
        this._router.updateParams(params);
      }
    },

    get queryString() {
      var _this$pathParams = this.pathParams,
          tva = _this$pathParams.tva,
          programId = _this$pathParams.programId,
          params = _objectWithoutProperties(_this$pathParams, ["tva", "programId"]);

      return Object.entries(params).filter(function (_ref8) {
        var _ref9 = _slicedToArray(_ref8, 2),
            key = _ref9[0],
            value = _ref9[1];

        return (value === 0 || value) && (!Array.isArray(value) || value.length > 0);
      }).map(function (_ref10) {
        var _ref11 = _slicedToArray(_ref10, 2),
            key = _ref11[0],
            value = _ref11[1];

        return !Array.isArray(value) ? "".concat(key, "=").concat(value) : value.map(function (v) {
          return "".concat(key, "=").concat(v);
        }).join('&');
      }).reduce(function (a, b) {
        return a.concat(b);
      }, []).join('&');
    },

    get excelUrl() {
      return this.selectedFrequency ? this._router.getExcelUrl(this.pathParams) : false;
    },

    get fullExcelUrl() {
      return this.selectedProgramId ? this._router.getFullExcelUrl(this.pathParams) : false;
    }

  });
  filterStore._reportType = filterStore._router.isTVA ? _constants__WEBPACK_IMPORTED_MODULE_4__["TVA"] : _constants__WEBPACK_IMPORTED_MODULE_4__["TIMEPERIODS"];
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
    oldLevels: filterStore._router.levels
  };

  var _updateRouter = Object(mobx__WEBPACK_IMPORTED_MODULE_0__["reaction"])(function () {
    return filterStore.pathParams;
  }, function (params) {
    return filterStore.updateParams(params);
  }, {
    fireImmediately: true
  });

  return filterStore;
});

/***/ }),

/***/ "NHe6":
/*!**************************************!*\
  !*** ./js/models/formattingUtils.js ***!
  \**************************************/
/*! exports provided: formatDecimal */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "formatDecimal", function() { return formatDecimal; });
/**
 * Formats a decimal number from the received JSON value to a valid JS model value
 * formatting for user language / percent / etc. is next step, this normalizes nulls, strings, etc.
 * to a float if it has a decimal component, and an int otherwise
 */
var formatDecimal = function formatDecimal(value) {
  if (isNaN(parseFloat(value))) {
    return false;
  }

  value = parseFloat(value);

  if (Number.isInteger(value)) {
    return parseInt(value);
  }

  return value;
};

/***/ }),

/***/ "OtFd":
/*!**************************************!*\
  !*** ./js/models/periodDateRange.js ***!
  \**************************************/
/*! exports provided: getPeriodDateRange */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getPeriodDateRange", function() { return getPeriodDateRange; });
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mobx */ "2vnA");


var bareRange = function bareRange() {
  var rangeJSON = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    frequency: parseInt(rangeJSON.frequency),

    get periodCount() {
      return this.periods.length;
    },

    get currentPeriod() {
      if ([1, 2, 8].includes(this.frequency)) {
        return null;
      }

      return this.periods.filter(function (period) {
        return period.past;
      }).length - 1;
    },

    getLabel: function getLabel(period) {
      if ([3, 4, 5, 6].includes(this.frequency)) {
        return "".concat(period.name, " (").concat(period.label, ")");
      }

      if (this.frequency == 7) {
        return period.name;
      }
    },

    get options() {
      var _this = this;

      return this.periods.map(function (period, index) {
        return {
          value: index,
          label: _this.getLabel(period),
          year: period.year
        };
      });
    }

  };
};

var getPeriodDateRange = function getPeriodDateRange() {
  for (var _len = arguments.length, rangeConstructors = new Array(_len), _key = 0; _key < _len; _key++) {
    rangeConstructors[_key] = arguments[_key];
  }

  return function (rangeJSON) {
    return [bareRange].concat(rangeConstructors).reduce(function (acc, fn) {
      return Object(mobx__WEBPACK_IMPORTED_MODULE_0__["extendObservable"])(acc, fn(rangeJSON));
    }, {});
  };
};

/***/ }),

/***/ "R+SQ":
/*!************************************************************!*\
  !*** ./js/pages/iptt_report/components/sidebar/sidebar.js ***!
  \************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _filterForm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./filterForm */ "W6Lt");


/* harmony default export */ __webpack_exports__["default"] = (function () {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "sidebar_wrapper"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "collapse width show",
    id: "sidebar"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_filterForm__WEBPACK_IMPORTED_MODULE_1__["default"], null)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "sidebar-toggle"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
    href: "#",
    "data-target": "#sidebar",
    "data-toggle": "collapse",
    title:
    /* # Translators: A toggle button that hides a sidebar of filter options */
    gettext('Show/Hide Filters')
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
    className: "fa fa-chevron-left"
  }))));
});

/***/ }),

/***/ "UCRK":
/*!***************************************************************!*\
  !*** ./js/pages/iptt_report/components/report/tableHeader.js ***!
  \***************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var _fortawesome_fontawesome_svg_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @fortawesome/fontawesome-svg-core */ "7O5W");
/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ "IP2g");
/* harmony import */ var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons */ "wHSu");
/* harmony import */ var _headerCells__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./headerCells */ "/u1a");





_fortawesome_fontawesome_svg_core__WEBPACK_IMPORTED_MODULE_2__["library"].add(_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_4__["faPlusSquare"], _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_4__["faMinusSquare"]);

var ColGroups = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('rootStore')(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref) {
  var rootStore = _ref.rootStore;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("colgroup", {
    span: rootStore.baseColumns + 1,
    className: "iptt-base-columns"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("colgroup", {
    span: 3,
    className: "iptt-lop-columns"
  }), rootStore.reportPeriods.map(function (period, index) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("colgroup", {
      key: index,
      span: rootStore.isTVA ? 3 : 1,
      className: "iptt-period-columns",
      id: 'period-' + index
    });
  }));
}));
var ProgramNameRow = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('rootStore')(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref2) {
  var rootStore = _ref2.rootStore;
  var program = rootStore.currentProgram;

  if (!program) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, "Loading"));
  }

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
    className: "title-row"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
    colSpan: rootStore.baseColumns + 1,
    className: "base-column"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
    className: "btn btn-medium text-action btn-sm",
    onClick: rootStore.expandAllRows.bind(rootStore),
    disabled: rootStore.allExpanded
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_3__["FontAwesomeIcon"], {
    icon: "plus-square"
  }), gettext('Expand all')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
    className: "btn btn-medium text-action btn-sm",
    onClick: rootStore.collapseAllRows.bind(rootStore),
    disabled: rootStore.allCollapsed
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_3__["FontAwesomeIcon"], {
    icon: "minus-square"
  }), gettext('Collapse all'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
    colSpan: 3 // centered under LOP superheader
    ,
    className: "iptt-period-header"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_headerCells__WEBPACK_IMPORTED_MODULE_5__["LopHeaderWithPopover"], null,
  /* # Translators: header for a group of columns showing totals over the life of the program */
  gettext('Life of program'))), rootStore.reportPeriods.map(function (period, index) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_headerCells__WEBPACK_IMPORTED_MODULE_5__["PeriodHeader"], {
      isTVA: rootStore.isTVA,
      key: index,
      period: period
    });
  }));
}));
var ColumnHeaderRow = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('rootStore')(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref3) {
  var rootStore = _ref3.rootStore;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_headerCells__WEBPACK_IMPORTED_MODULE_5__["HeaderCell"], {
    styleWidth: 110,
    className: "base-column",
    label:
    /* # Translators: Abbreviation as column header for "number" column */
    gettext('No.')
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_headerCells__WEBPACK_IMPORTED_MODULE_5__["HeaderCell"], {
    className: "base-column",
    styleWidth: 600,
    colSpan: 2,
    label:
    /* # Translators: Column header for indicator Name column */
    gettext('Indicator')
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_headerCells__WEBPACK_IMPORTED_MODULE_5__["HeaderCell"], {
    className: "base-column" // empty cell above gear widget column

  }), !rootStore.filterStore.resultsFramework && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_headerCells__WEBPACK_IMPORTED_MODULE_5__["HeaderCell"], {
    className: "base-column",
    styleWidth: 90,
    label:
    /* # Translators: Column header for indicator Level name column */
    gettext('Level')
  }), rootStore.hasUOMColumn && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_headerCells__WEBPACK_IMPORTED_MODULE_5__["HeaderCell"], {
    className: "base-column",
    styleWidth: 250,
    label:
    /* # Translators: Column header */
    gettext('Unit of measure')
  }), rootStore.hasChangeColumn && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_headerCells__WEBPACK_IMPORTED_MODULE_5__["HeaderCell"], {
    className: "base-column",
    label:
    /* # Translators: Column header for "direction of change" column (increasing/decreasing) */
    gettext('Change')
  }), rootStore.hasCNCColumn && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_headerCells__WEBPACK_IMPORTED_MODULE_5__["HeaderCell"], {
    className: "base-column",
    styleWidth: 130,
    label:
    /* # Translators: Column header, stands for "Cumulative"/"Non-cumulative" */
    gettext('C / NC')
  }), rootStore.hasUOMTypeColumn && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_headerCells__WEBPACK_IMPORTED_MODULE_5__["HeaderCell"], {
    className: "base-column",
    styleWidth: 50,
    label:
    /* # Translators: Column header, numeric or percentage type indicator */
    gettext('# / %')
  }), rootStore.hasBaselineColumn && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_headerCells__WEBPACK_IMPORTED_MODULE_5__["HeaderCell"], {
    className: "base-column",
    label:
    /* # Translators: Column header */
    gettext('Baseline')
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_headerCells__WEBPACK_IMPORTED_MODULE_5__["HeaderCell"], {
    styleWidth: 110,
    className: "lop-column",
    label:
    /* # Translators: Column header for a target value column */
    gettext('Target')
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_headerCells__WEBPACK_IMPORTED_MODULE_5__["HeaderCell"], {
    styleWidth: 110,
    className: "lop-column",
    label:
    /* # Translators: Column header for an "actual" or achieved/real value column */
    pgettext('report (long) header', 'Actual')
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_headerCells__WEBPACK_IMPORTED_MODULE_5__["HeaderCell"], {
    styleWidth: 110,
    className: "lop-column",
    label:
    /* # Translators: Column header for a percent-met column */
    gettext('% Met')
  }), rootStore.reportPeriods.map(function (period, index) {
    return rootStore.isTVA ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_headerCells__WEBPACK_IMPORTED_MODULE_5__["TVAHeader"], {
      key: index
    }) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_headerCells__WEBPACK_IMPORTED_MODULE_5__["ActualHeader"], {
      key: index
    });
  }));
}));

var ReportTableHeader = function ReportTableHeader() {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ColGroups, null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("thead", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ProgramNameRow, null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ColumnHeaderRow, null)));
};

/* harmony default export */ __webpack_exports__["default"] = (ReportTableHeader);

/***/ }),

/***/ "W6Lt":
/*!***************************************************************!*\
  !*** ./js/pages/iptt_report/components/sidebar/filterForm.js ***!
  \***************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var _reportSelect__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./reportSelect */ "wEMH");
/* harmony import */ var _reportFilter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./reportFilter */ "J3fw");
/* harmony import */ var _buttons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./buttons */ "XV4f");





var FilterTop = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('filterStore')(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref) {
  var filterStore = _ref.filterStore;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_reportSelect__WEBPACK_IMPORTED_MODULE_2__["ProgramSelect"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_reportSelect__WEBPACK_IMPORTED_MODULE_2__["FrequencySelect"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_reportSelect__WEBPACK_IMPORTED_MODULE_2__["TimeframeRadio"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_reportSelect__WEBPACK_IMPORTED_MODULE_2__["StartDateSelect"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_reportSelect__WEBPACK_IMPORTED_MODULE_2__["EndDateSelect"], null), filterStore.resultsFramework && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_reportSelect__WEBPACK_IMPORTED_MODULE_2__["GroupingSelect"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_reportFilter__WEBPACK_IMPORTED_MODULE_3__["HiddenColumnSelect"], null));
}));

var FilterMiddle = function FilterMiddle() {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_reportFilter__WEBPACK_IMPORTED_MODULE_3__["LevelSelect"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_reportFilter__WEBPACK_IMPORTED_MODULE_3__["DisaggregationSelect"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_reportFilter__WEBPACK_IMPORTED_MODULE_3__["SiteSelect"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_reportFilter__WEBPACK_IMPORTED_MODULE_3__["TypeSelect"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_reportFilter__WEBPACK_IMPORTED_MODULE_3__["SectorSelect"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_reportFilter__WEBPACK_IMPORTED_MODULE_3__["IndicatorSelect"], null));
};

var IPTTFilterForm = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('filterStore')(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref2) {
  var filterStore = _ref2.filterStore;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("nav", {
    id: "id_iptt_report_filter"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "p-3",
    id: "filter-top"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h3", {
    className: "filter-title text-title-case"
  },
  /* # Translators: Labels a set of filters to select which data to show */
  gettext('Report Options')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(FilterTop, null)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    id: "filter-middle",
    className: "px-3 pt-3 pb-2"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(FilterMiddle, null)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    id: "filter-bottom"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_buttons__WEBPACK_IMPORTED_MODULE_4__["IPTTButton"], {
    label:
    /* # Translators: clears all filters set on a report */
    gettext('Clear filters'),
    action: filterStore.clearFilters.bind(filterStore),
    isDisabled: !filterStore.filtersActive
  })), filterStore.programFilterData && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    id: "filter-extra",
    className: " d-flex justify-content-between no-gutters p-3"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
    href: "/tola_management/audit_log/".concat(filterStore.selectedProgramId, "/"),
    className: "btn-link"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
    className: "fas fa-history"
  }), " ", gettext("Change log"))));
}));
/* harmony default export */ __webpack_exports__["default"] = (IPTTFilterForm);

/***/ }),

/***/ "XGqG":
/*!****************************************!*\
  !*** ./js/pages/iptt_report/router.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var router5__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! router5 */ "wgi2");
/* harmony import */ var router5_plugin_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! router5-plugin-browser */ "0pHI");
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mobx */ "2vnA");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../constants */ "v38i");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }





var goodQueryParams = ['frequency', 'start', 'end', 'levels', 'types', 'sites', 'disaggregations', 'sectors', 'indicators', 'tiers', 'groupby', 'mr', 'columns'];
var oldQueryParams = ['timeframe', 'numrecentperiods', 'numrecentcount', 'start_period', 'end_period'];
var queryParams = '?' + [].concat(goodQueryParams, oldQueryParams).join('&');
var routes = [{
  name: 'iptt',
  path: '/iptt_report/:programId<\\d+>',
  children: [{
    name: 'timeperiods',
    path: '/timeperiods?timeperiods'
  }, {
    name: 'tva',
    path: '/targetperiods?targetperiods'
  }]
}, {
  name: 'ipttExcel',
  path: '/iptt_api/iptt_excel?fullTVA&reportType&programId'
}];

var parseArrayParams = function parseArrayParams(param) {
  if (typeof param === 'string' || param instanceof String) {
    return [parseInt(param)];
  } else if (Array.isArray(param)) {
    return param.map(function (p) {
      return parseInt(p);
    });
  } else if (Number.isInteger(param)) {
    return [param];
  } else if (!isNaN(parseInt(param))) {
    return [parseInt(param)];
  }

  return [];
};

/* harmony default export */ __webpack_exports__["default"] = (function () {
  var router = Object(router5__WEBPACK_IMPORTED_MODULE_0__["default"])(routes, {
    trailingSlashMode: 'always'
  });
  router.setRootPath(queryParams);
  router.usePlugin(Object(router5_plugin_browser__WEBPACK_IMPORTED_MODULE_1__["default"])({
    useHash: false,
    base: '/indicators'
  }));
  router.start();
  return mobx__WEBPACK_IMPORTED_MODULE_2__["observable"].object({
    _router: router,

    get isTVA() {
      return this._router.getState().name === 'iptt.tva';
    },

    get programId() {
      return this._router.getState().params.programId;
    },

    get frequency() {
      var _this$_router$getStat = this._router.getState().params,
          frequency = _this$_router$getStat.frequency,
          timeperiods = _this$_router$getStat.timeperiods,
          targetperiods = _this$_router$getStat.targetperiods,
          params = _objectWithoutProperties(_this$_router$getStat, ["frequency", "timeperiods", "targetperiods"]);

      if (!isNaN(parseInt(frequency))) {
        return parseInt(frequency);
      }

      if (!isNaN(parseInt(timeperiods))) {
        return parseInt(timeperiods);
      }

      if (!isNaN(parseInt(targetperiods))) {
        return parseInt(targetperiods);
      }

      return null;
    },

    get start() {
      return this._router.getState().params.start;
    },

    get end() {
      return this._router.getState().params.end;
    },

    get timeframe() {
      if (this._router.getState().params.timeframe == 2) {
        return {
          mostRecent: this._router.getState().params.numrecentperiods
        };
      } else if (this._router.getState().params.timeframe == 1) {
        return {
          showAll: true
        };
      }

      return false;
    },

    get mr() {
      return this._router.getState().params.mr == 1;
    },

    get groupBy() {
      return this._router.getState().params.groupby;
    },

    get levels() {
      return parseArrayParams(this._router.getState().params.levels);
    },

    get tiers() {
      return parseArrayParams(this._router.getState().params.tiers);
    },

    get sectors() {
      return parseArrayParams(this._router.getState().params.sectors);
    },

    get sites() {
      return parseArrayParams(this._router.getState().params.sites);
    },

    get disaggregations() {
      return parseArrayParams(this._router.getState().params.disaggregations);
    },

    get hiddenCategories() {
      var disaggParams = this._router.getState().params.disaggregations;

      return Array.isArray(disaggParams) ? disaggParams.includes('hide-categories') : disaggParams && disaggParams == 'hide-categories';
    },

    get columns() {
      return parseArrayParams(this._router.getState().params.columns);
    },

    get types() {
      return parseArrayParams(this._router.getState().params.types);
    },

    get indicators() {
      return parseArrayParams(this._router.getState().params.indicators);
    },

    updateParams: function updateParams(_ref) {
      var tva = _ref.tva,
          params = _objectWithoutProperties(_ref, ["tva"]);

      var routeName = tva ? 'iptt.tva' : 'iptt.timeperiods';

      var path = this._router.buildPath(routeName, params);

      if (path !== this._router.getState().path) {
        this._router.navigate(routeName, params, {
          replace: true
        });
      }
    },

    get queryParams() {
      return this._router.getState().params;
    },

    getExcelUrl: function getExcelUrl(_ref2) {
      var tva = _ref2.tva,
          params = _objectWithoutProperties(_ref2, ["tva"]);

      return this._router.buildUrl('ipttExcel', _objectSpread(_objectSpread({}, params), {}, {
        reportType: tva ? _constants__WEBPACK_IMPORTED_MODULE_3__["TVA"] : _constants__WEBPACK_IMPORTED_MODULE_3__["TIMEPERIODS"],
        fullTVA: false
      }));
    },
    getFullExcelUrl: function getFullExcelUrl(_ref3) {
      var programId = _ref3.programId,
          groupby = _ref3.groupby,
          params = _objectWithoutProperties(_ref3, ["programId", "groupby"]);

      return this._router.buildUrl('ipttExcel', {
        programId: programId,
        groupBy: groupby,
        fullTVA: true
      });
    }
  });
});

/***/ }),

/***/ "XV4f":
/*!************************************************************!*\
  !*** ./js/pages/iptt_report/components/sidebar/buttons.js ***!
  \************************************************************/
/*! exports provided: IPTTButton */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IPTTButton", function() { return IPTTButton; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

var IPTTButton = function IPTTButton(props) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
    type: "reset",
    className: "btn btn-block btn-reset" + (props.isDisabled ? " disabled" : ""),
    onClick: props.action
  }, props.label);
};

/***/ }),

/***/ "eLjl":
/*!*************************************************************!*\
  !*** ./js/pages/iptt_report/components/report/tableBody.js ***!
  \*************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var _tableRows__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tableRows */ "EBDj");



var ReportTableBody = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('rootStore', 'filterStore')(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref) {
  var rootStore = _ref.rootStore,
      filterStore = _ref.filterStore;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tbody", null, rootStore.levelRows ? rootStore.levelRows.map(function (levelRow, index) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_tableRows__WEBPACK_IMPORTED_MODULE_2__["LevelGroup"], {
      level: levelRow.level,
      indicators: levelRow.indicators,
      key: index
    });
  }) : rootStore.indicatorRows.map(function (indicator, index) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_tableRows__WEBPACK_IMPORTED_MODULE_2__["IndicatorRow"], {
      indicator: indicator,
      key: index
    });
  }));
}));
/* harmony default export */ __webpack_exports__["default"] = (ReportTableBody);

/***/ }),

/***/ "gu28":
/*!******************************************************!*\
  !*** ./js/pages/iptt_report/models/ipttIndicator.js ***!
  \******************************************************/
/*! exports provided: forIPTT, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forIPTT", function() { return forIPTT; });
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mobx */ "2vnA");
/* harmony import */ var _models_indicator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../models/indicator */ "My+N");


/**
 * IPTT specific indicator model constructor:
 * JSON params:
 *    sector_pk int
 *    indicator_type_pks  [int]
 *    site_pks [int]
 */

var forIPTT = function forIPTT() {
  var indicatorJSON = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    number: indicatorJSON.number || null,
    sectorPk: indicatorJSON.sector_pk || null,
    _typePks: Object(mobx__WEBPACK_IMPORTED_MODULE_0__["observable"])(new Set(indicatorJSON.indicator_type_pks || [])),
    hasIndicatorType: function hasIndicatorType(indicatorTypePk) {
      return !isNaN(parseInt(indicatorTypePk)) && this._typePks.has(parseInt(indicatorTypePk));
    },
    _sitePks: Object(mobx__WEBPACK_IMPORTED_MODULE_0__["observable"])(new Set(indicatorJSON.site_pks || [])),
    hasSite: function hasSite(sitePk) {
      return !isNaN(parseInt(sitePk)) && this._sitePks.has(parseInt(sitePk));
    },
    _disaggregationPks: Object(mobx__WEBPACK_IMPORTED_MODULE_0__["observable"])(new Set(indicatorJSON.disaggregation_pks || [])),
    hasDisaggregation: function hasDisaggregation(disaggregationPk) {
      return !isNaN(parseInt(disaggregationPk)) && this._disaggregationPks.has(parseInt(disaggregationPk));
    },
    hasDisaggregations: function hasDisaggregations(disaggregationsPks) {
      var _this = this;

      return disaggregationsPks.filter(function (pk) {
        return _this._disaggregationPks.has(pk);
      }).length > 0;
    }
  };
};
/* harmony default export */ __webpack_exports__["default"] = (Object(_models_indicator__WEBPACK_IMPORTED_MODULE_1__["getIndicator"])(_models_indicator__WEBPACK_IMPORTED_MODULE_1__["withMeasurement"], forIPTT));

/***/ }),

/***/ "m6yc":
/*!****************************************************!*\
  !*** ./js/pages/iptt_report/models/ipttProgram.js ***!
  \****************************************************/
/*! exports provided: forIPTT, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forIPTT", function() { return forIPTT; });
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mobx */ "2vnA");
/* harmony import */ var _models_program__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../models/program */ "1d5Q");
/* harmony import */ var _models_periodDateRange__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../models/periodDateRange */ "OtFd");
/* harmony import */ var _ipttIndicator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ipttIndicator */ "gu28");
/* harmony import */ var _ipttLevel__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ipttLevel */ "uXzT");
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }







var IPTTPeriod = function IPTTPeriod() {
  var periodJSON = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    _frequency: parseInt(periodJSON.frequency),
    _name: periodJSON.name,
    label: periodJSON.label,
    start: new Date(periodJSON.start),
    startLabel: periodJSON.start_label,
    end: new Date(periodJSON.end),
    endLabel: periodJSON.end_label,
    past: Boolean(periodJSON.past),
    year: periodJSON.year,

    get range() {
      return [2, 7].includes(this._frequency) ? null : "".concat(this.startLabel, " \u2013 ").concat(this.endLabel);
    },

    get name() {
      return this._frequency == 7 ? "".concat(this._name, " ").concat(this.year) : this._name;
    }

  };
};

var forIPTTDateRange = function forIPTTDateRange() {
  var rangeJSON = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    periods: rangeJSON.periods.map(function (periodJSON) {
      return IPTTPeriod(_objectSpread(_objectSpread({}, periodJSON), {}, {
        frequency: rangeJSON.frequency
      }));
    }),
    years: _toConsumableArray(new Set(rangeJSON.periods.map(function (periodJSON) {
      return periodJSON.year;
    }))).sort()
  };
};

var IPTTPeriodDateRange = Object(_models_periodDateRange__WEBPACK_IMPORTED_MODULE_2__["getPeriodDateRange"])(forIPTTDateRange);
/**
 * IPTT Report page specific model constructor
 * JSON params:
 *   frequencies [int]
 *   period_date_ranges (IPTTPeriodDateRange)
 * @return {Object}
 */

var forIPTT = function forIPTT() {
  var programJSON = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    frequencies: Object(mobx__WEBPACK_IMPORTED_MODULE_0__["observable"])(new Set((programJSON.frequencies || []).map(function (frequency) {
      return parseInt(frequency);
    }).filter(function (frequency) {
      return !isNaN(frequency);
    }))),
    periodRanges: Object(mobx__WEBPACK_IMPORTED_MODULE_0__["observable"])(new Map(Object.entries(programJSON.period_date_ranges || {}).map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          frequency = _ref2[0],
          periodsJSON = _ref2[1];

      var freq = parseInt(frequency);
      return [freq, IPTTPeriodDateRange({
        frequency: freq,
        periods: periodsJSON
      })];
    }))),
    validFrequency: function validFrequency(frequency) {
      return !isNaN(parseInt(frequency)) && this.frequencies.has(parseInt(frequency));
    },
    resultChainLabel: programJSON.result_chain_label,
    indicators: Object(mobx__WEBPACK_IMPORTED_MODULE_0__["observable"])(new Map((programJSON.indicators || []).map(function (indicatorJSON) {
      return Object(_ipttIndicator__WEBPACK_IMPORTED_MODULE_3__["default"])(indicatorJSON);
    }).map(function (indicator) {
      return [indicator.pk, indicator];
    }))),
    levels: Object(mobx__WEBPACK_IMPORTED_MODULE_0__["observable"])(new Map((programJSON.levels || []).map(function (levelJSON) {
      return Object(_ipttLevel__WEBPACK_IMPORTED_MODULE_4__["default"])(levelJSON);
    }).map(function (level) {
      return [level.pk, level];
    }))),
    tiers: Object(mobx__WEBPACK_IMPORTED_MODULE_0__["observable"])(new Map((programJSON.tiers || []).map(function (tierJSON) {
      return [parseInt(tierJSON.pk), {
        pk: parseInt(tierJSON.pk),
        name: tierJSON.name,
        depth: tierJSON.tier_depth
      }];
    }))),
    oldLevels: Object(mobx__WEBPACK_IMPORTED_MODULE_0__["observable"])(new Map((programJSON.old_levels || []).map(function (oldLevelJSON) {
      return [parseInt(oldLevelJSON.pk), {
        pk: oldLevelJSON.pk,
        name: oldLevelJSON.name
      }];
    }))),
    sectors: Object(mobx__WEBPACK_IMPORTED_MODULE_0__["observable"])(new Map((programJSON.sectors || []).map(function (sectorJSON) {
      return [parseInt(sectorJSON.pk), {
        pk: parseInt(sectorJSON.pk),
        name: sectorJSON.name
      }];
    }))),
    sites: Object(mobx__WEBPACK_IMPORTED_MODULE_0__["observable"])(new Map((programJSON.sites || []).map(function (siteJSON) {
      return [parseInt(siteJSON.pk), {
        pk: parseInt(siteJSON.pk),
        name: siteJSON.name
      }];
    }))),
    disaggregations: Object(mobx__WEBPACK_IMPORTED_MODULE_0__["observable"])(new Map((programJSON.disaggregations || []).map(function (disaggregationJSON) {
      return [parseInt(disaggregationJSON.pk), {
        pk: parseInt(disaggregationJSON.pk),
        // Only translate disagg type if it's a global disagg
        name: disaggregationJSON.country ? disaggregationJSON.name : gettext(disaggregationJSON.name),
        country: disaggregationJSON.country || null,
        labels: (disaggregationJSON.labels || []).map(function (labelJSON) {
          return {
            pk: parseInt(labelJSON.pk),
            name: labelJSON.name
          };
        })
      }];
    }).filter(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
          disaggregationPk = _ref4[0],
          disaggregation = _ref4[1];

      return disaggregation.labels && disaggregation.labels.length > 0;
    }))),
    indicatorTypes: Object(mobx__WEBPACK_IMPORTED_MODULE_0__["observable"])(new Map((programJSON.indicator_types || []).map(function (indicatorTypeJSON) {
      return [parseInt(indicatorTypeJSON.pk), {
        pk: parseInt(indicatorTypeJSON.pk),
        name: indicatorTypeJSON.name
      }];
    }))),
    deleteIndicator: function deleteIndicator(indicatorPk) {
      var _this = this;

      if (!isNaN(parseInt(indicatorPk))) {
        return this.updateOrder().then(function (success) {
          _this.indicators["delete"](parseInt(indicatorPk));
        });
      }

      return this.updateOrder();
    }
  };
};
/* harmony default export */ __webpack_exports__["default"] = (Object(_models_program__WEBPACK_IMPORTED_MODULE_1__["getProgram"])(_models_program__WEBPACK_IMPORTED_MODULE_1__["withReportingPeriod"], _models_program__WEBPACK_IMPORTED_MODULE_1__["withRFLevelOrdering"], forIPTT));

/***/ }),

/***/ "mYfJ":
/*!***************************************!*\
  !*** ./js/pages/iptt_report/index.js ***!
  \***************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "i8i4");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var _components_ipttReport__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/ipttReport */ "+jGO");
/* harmony import */ var _models_ipttRootStore__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./models/ipttRootStore */ "3DQe");
/**
 * entry point for the iptt_report webpack bundle
 */





var rootStore = new _models_ipttRootStore__WEBPACK_IMPORTED_MODULE_4__["default"](reactContext);
react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(mobx_react__WEBPACK_IMPORTED_MODULE_2__["Provider"], {
  rootStore: rootStore,
  filterStore: rootStore.filterStore,
  reportStore: rootStore.reportStore
}, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_ipttReport__WEBPACK_IMPORTED_MODULE_3__["default"], null)), document.querySelector('#id_div_content'));

/***/ }),

/***/ "nzxa":
/*!**********************************************************!*\
  !*** ./js/pages/iptt_report/components/report/header.js ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var _buttons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./buttons */ "BBG7");



var IPTTHeader = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('filterStore', 'rootStore')(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref) {
  var filterStore = _ref.filterStore,
      rootStore = _ref.rootStore;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "page-subheader"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    id: "id_span_iptt_date_range",
    className: "subheader__title"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", {
    className: "text-title-case"
  }, gettext('Indicator Performance Tracking Table')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h4", null, filterStore.startPeriod && filterStore.endPeriod ? filterStore.startPeriod.startLabel + " - " + filterStore.endPeriod.endLabel : "")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "subheader__actions"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "btn-row"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_buttons__WEBPACK_IMPORTED_MODULE_2__["PinButton"], null), filterStore.isTVA ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_buttons__WEBPACK_IMPORTED_MODULE_2__["ExcelPopoverButton"], rootStore.excelAPI) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_buttons__WEBPACK_IMPORTED_MODULE_2__["ExcelButton"], {
    excelUrl: rootStore.excelAPI.excelUrl
  })))), rootStore.currentProgram && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h3", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
    href: rootStore.currentProgramPageUrl
  }, rootStore.currentProgram.name)));
}));
/* harmony default export */ __webpack_exports__["default"] = (IPTTHeader);

/***/ }),

/***/ "palW":
/*!****************************!*\
  !*** ./js/models/level.js ***!
  \****************************/
/*! exports provided: getLevel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getLevel", function() { return getLevel; });
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mobx */ "2vnA");

/**
 * Bare level constructor
 * JSON params:
 *  pk: (string|number)
 *  name: (str)
 *  ontology: (str)
 *  tier_name ([tr] (str))
 */

var bareLevel = function bareLevel() {
  var levelJSON = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    pk: parseInt(levelJSON.pk),
    name: levelJSON.name,
    ontology: levelJSON.ontology || null,
    tierName: levelJSON.tier_name
  };
};

var getLevel = function getLevel() {
  for (var _len = arguments.length, levelConstructors = new Array(_len), _key = 0; _key < _len; _key++) {
    levelConstructors[_key] = arguments[_key];
  }

  return function () {
    var levelJSON = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return [bareLevel].concat(levelConstructors).reduce(function (acc, fn) {
      return Object(mobx__WEBPACK_IMPORTED_MODULE_0__["extendObservable"])(acc, fn(levelJSON));
    }, {});
  };
};

/***/ }),

/***/ "sJKi":
/*!****************************************************!*\
  !*** ./js/pages/iptt_report/models/reportStore.js ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mobx */ "2vnA");
/* harmony import */ var _ipttIndicatorReport__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ipttIndicatorReport */ "67ur");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../constants */ "v38i");
/* harmony import */ var _apiv2__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../apiv2 */ "5/4V");
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }





/* harmony default export */ __webpack_exports__["default"] = (function () {
  var reportJSON = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var LOADING = 1;
  var LOADED = 2;
  var reportStore = Object(mobx__WEBPACK_IMPORTED_MODULE_0__["observable"])({
    _reportMap: mobx__WEBPACK_IMPORTED_MODULE_0__["observable"].map([].concat(_toConsumableArray(_constants__WEBPACK_IMPORTED_MODULE_2__["TIME_AWARE_FREQUENCIES"]), _toConsumableArray(_constants__WEBPACK_IMPORTED_MODULE_2__["IRREGULAR_FREQUENCIES"])).sort().map(function (frequency) {
      return [frequency, mobx__WEBPACK_IMPORTED_MODULE_0__["observable"].map()];
    })),
    getReport: function getReport(frequency) {
      return this._reportMap.get(frequency);
    },
    programStatus: mobx__WEBPACK_IMPORTED_MODULE_0__["observable"].map([].concat(_toConsumableArray(_constants__WEBPACK_IMPORTED_MODULE_2__["TIME_AWARE_FREQUENCIES"]), _toConsumableArray(_constants__WEBPACK_IMPORTED_MODULE_2__["IRREGULAR_FREQUENCIES"])).sort().map(function (frequency) {
      return [frequency, mobx__WEBPACK_IMPORTED_MODULE_0__["observable"].map()];
    })),
    callForReportData: function callForReportData(_ref) {
      var _this = this;

      var update = _ref.update,
          params = _objectWithoutProperties(_ref, ["update"]);

      var programPk = parseInt(params.programPk);
      var frequency = parseInt(params.frequency);

      if (this.programStatus.get(frequency).get(programPk) === LOADING) {
        return Promise.resolve(false);
      }

      if (!update && this.programStatus.get(frequency).get(programPk) === LOADED) {
        return Promise.resolve(false);
      }

      this.programStatus.get(frequency).set(programPk, LOADING);
      return _apiv2__WEBPACK_IMPORTED_MODULE_3__["default"].getIPTTReportData(params).then(function (data) {
        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this.updateReportData(data);
        });
      });
    },
    updateReportData: function updateReportData(reportData) {
      var _this2 = this;

      var frequency = parseInt(reportData.report_frequency);
      (reportData.report_data || []).forEach(function (indicatorReportJSON) {
        var indicatorReport = Object(_ipttIndicatorReport__WEBPACK_IMPORTED_MODULE_1__["default"])(frequency, indicatorReportJSON);

        _this2._reportMap.get(frequency).set(indicatorReport.pk, indicatorReport);
      });
      this.programStatus.get(frequency).set(parseInt(reportData.program_pk), LOADED);
      return reportData;
    }
  });

  if (reportJSON && reportJSON.report_data) {
    var frequency = parseInt(reportJSON.report_frequency);
    var initialReportData = reportStore.getReport(frequency);
    (reportJSON.report_data || []).map(function (indicatorReportJSON) {
      return Object(_ipttIndicatorReport__WEBPACK_IMPORTED_MODULE_1__["default"])(frequency, indicatorReportJSON);
    }).forEach(function (indicatorReport) {
      return initialReportData.set(indicatorReport.pk, indicatorReport);
    });
    reportStore.programStatus.get(frequency).set(parseInt(reportJSON.program_pk), LOADED);
  }

  return reportStore;
});

/***/ }),

/***/ "uXzT":
/*!**************************************************!*\
  !*** ./js/pages/iptt_report/models/ipttLevel.js ***!
  \**************************************************/
/*! exports provided: forIPTT, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forIPTT", function() { return forIPTT; });
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mobx */ "2vnA");
/* harmony import */ var _models_level__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../models/level */ "palW");


/**
 * IPTT specific level model constructor:
 * JSON params:
 *    tier_pk int
 *    chain_pk int
 */

var forIPTT = function forIPTT() {
  var levelJSON = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    tierPk: !isNaN(parseInt(levelJSON.tier_pk)) ? parseInt(levelJSON.tier_pk) : null,
    tierDepth: parseInt(levelJSON.tier_depth),
    showForTier: function showForTier(tierPk) {
      return !isNaN(parseInt(tierPk)) && parseInt(tierPk) === this.tierPk;
    },
    chainPk: !isNaN(parseInt(levelJSON.chain_pk)) ? parseInt(levelJSON.chain_pk) : null,
    _alwaysShowChain: false,
    // && levelJSON.chain_pk === 'all',
    showForChain: function showForChain(chainPk) {
      return this._alwaysShowChain || !isNaN(parseInt(chainPk)) && parseInt(chainPk) === this.chainPk;
    },

    get isResultChainLevel() {
      return this.chainPk && this.chainPk == this.pk;
    },

    get tierNumber() {
      return "".concat(this.tierName) + (this.ontology ? " ".concat(this.ontology) : "");
    },

    get resultChainLabel() {
      /* # Translators: this labels a filter option for a label as including subordinate levels */
      var labelStr = gettext('%(this_level_number)s and sub-levels: %(this_level_full_name)s');
      return interpolate(labelStr, {
        this_level_number: this.tierNumber,
        this_level_full_name: this.name
      }, true);
    }

  };
};
/* harmony default export */ __webpack_exports__["default"] = (Object(_models_level__WEBPACK_IMPORTED_MODULE_1__["getLevel"])(forIPTT));

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

/***/ }),

/***/ "wEMH":
/*!*****************************************************************!*\
  !*** ./js/pages/iptt_report/components/sidebar/reportSelect.js ***!
  \*****************************************************************/
/*! exports provided: ProgramSelect, FrequencySelect, TimeframeRadio, StartDateSelect, EndDateSelect, GroupingSelect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProgramSelect", function() { return ProgramSelect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FrequencySelect", function() { return FrequencySelect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TimeframeRadio", function() { return TimeframeRadio; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StartDateSelect", function() { return StartDateSelect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EndDateSelect", function() { return EndDateSelect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GroupingSelect", function() { return GroupingSelect; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var _components_selectWidgets__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../components/selectWidgets */ "Ez0T");
var _dec, _class, _temp;

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




/**
 * input-ready filtering single-select for Programs available to user in IPTT Report
 * uses SingleSelect in js/components/selectWidgets
 */

var ProgramSelect = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('filterStore')(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref) {
  var filterStore = _ref.filterStore;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_selectWidgets__WEBPACK_IMPORTED_MODULE_2__["SingleReactSelect"], {
    label: gettext('Program'),
    options: filterStore.programOptions,
    value: filterStore.selectedProgramOption,
    update: function update(selected) {
      filterStore.selectedProgramOption = selected;
    }
  });
}));
/**
 * input-ready filtering single-select for Frequencies available for selected program in IPTT Report
 * uses SingleSelect in js/components/selectWidgets
 */

var FrequencySelect = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('filterStore')(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref2) {
  var filterStore = _ref2.filterStore;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_selectWidgets__WEBPACK_IMPORTED_MODULE_2__["SingleReactSelect"], {
    label: filterStore.isTVA ? gettext('Target periods') : gettext('Time periods'),
    options: filterStore.frequencyOptions,
    disabled: filterStore.frequencyDisabled,
    value: filterStore.selectedFrequencyOption,
    update: function update(selected) {
      filterStore.selectedFrequencyOption = selected;
    }
  });
}));
/**
 * Show All radio / Most Recent radio / number of Most Recent periods input combo component
 * For selecting start and end of IPTT report
 * controlled component - logic to update date selects in filterStore model (../models)
 */

var TimeframeRadio = (_dec = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('filterStore'), _dec(_class = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class = (_temp = /*#__PURE__*/function (_React$Component) {
  _inherits(TimeframeRadio, _React$Component);

  var _super = _createSuper(TimeframeRadio);

  function TimeframeRadio(props) {
    var _this;

    _classCallCheck(this, TimeframeRadio);

    _this = _super.call(this, props);

    _this.checkMostRecent = function (e) {
      var mostRecentCount = isNaN(parseInt(_this.state.mostRecentValue)) ? 2 : parseInt(_this.state.mostRecentValue);

      _this.setState({
        mostRecentValue: mostRecentCount
      });

      _this.mostRecentInputRef.current.focus();
    };

    _this.handleChange = function (e) {
      var pattern = /^[0-9]+$/;

      if (pattern.exec(e.target.value) || !e.target.value) {
        _this.setState({
          mostRecentValue: e.target.value
        });
      }
    };

    _this.handleBlur = function (e) {
      if (!_this.state.revert) {
        _this.props.filterStore.mostRecentValue = _this.state.mostRecentValue;
      }

      _this.setState({
        focus: false,
        revert: false,
        mostRecentValue: _this.props.filterStore.mostRecentValue
      });
    };

    _this.handleKeyDown = function (e) {
      if (e.keyCode === 13) {
        e.target.blur();
      } else if (e.keyCode === 27) {
        _this.setState({
          revert: true
        }, function () {
          _this.mostRecentInputRef.current.blur();
        });
      }
    };

    _this.handleFocus = function (e) {
      _this.setState({
        focus: true,
        revert: false,
        mostRecentValue: _this.props.filterStore.mostRecentValue
      });
    };

    _this.mostRecentInputRef = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createRef();
    _this.state = {
      focus: false,
      revert: false,
      mostRecentValue: _this.props.filterStore.mostRecentValue
    };
    return _this;
  }

  _createClass(TimeframeRadio, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-row mb-3"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "col-sm-4"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-check form-check-inline pt-1"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "form-check-input"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "radio",
        checked: !this.state.focus && this.props.filterStore.showAll,
        disabled: this.props.filterStore.periodsDisabled,
        onChange: function onChange(e) {
          _this2.props.filterStore.showAll = true;
        }
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        onClick: function onClick(e) {
          _this2.props.filterStore.showAll = true;
        },
        className: "form-check-label text-nowrap"
      },
      /* # Translators: option to show all periods for the report */
      gettext('Show all')))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "col-sm-4 p-0"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-check form-check-inline mr-1 pt-1 float-right"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "form-check-input"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "radio",
        checked: this.state.focus || this.props.filterStore.mostRecentChecked,
        disabled: this.props.filterStore.periodsDisabled,
        onChange: this.checkMostRecent
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        onClick: this.checkMostRecent,
        className: "form-check-label text-nowrap"
      },
      /* # Translators: option to show a number of recent periods for the report */
      gettext('Most recent')))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "col-sm-3"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        className: "form-control pl-3",
        value: this.state.focus ? this.state.mostRecentValue : this.props.filterStore.mostRecentValue,
        ref: this.mostRecentInputRef,
        disabled: this.props.filterStore.periodsDisabled,
        onChange: this.handleChange,
        onFocus: this.handleFocus,
        onBlur: this.handleBlur,
        onKeyDown: this.handleKeyDown
      })));
    }
  }]);

  return TimeframeRadio;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp)) || _class) || _class);
/**
 * non input-ready dropdown for periods available for Start of IPTT Report select
 * composes DateSelect in components/selectWidgets
 */

var StartDateSelect = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('filterStore')(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref3) {
  var filterStore = _ref3.filterStore;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_selectWidgets__WEBPACK_IMPORTED_MODULE_2__["DateSelect"], {
    label:
    /* # Translators: menu for selecting the start date for a report */
    gettext('Start'),
    disabled: filterStore.periodsDisabled,
    value: filterStore.startPeriodValue || '',
    update: function update(e) {
      filterStore.startPeriodValue = e.target.value;
    },
    options: filterStore.startOptions
  });
}));
/**
 * non input-ready dropdown for periods available for End of IPTT Report select
 * composes DateSelect in components/selectWidgets
 */

var EndDateSelect = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('filterStore')(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref4) {
  var filterStore = _ref4.filterStore;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_selectWidgets__WEBPACK_IMPORTED_MODULE_2__["DateSelect"], {
    label:
    /* # Translators: menu for selecting the end date for a report */
    gettext('End'),
    disabled: filterStore.periodsDisabled,
    value: filterStore.endPeriodValue || '',
    update: function update(e) {
      filterStore.endPeriodValue = e.target.value;
    },
    options: filterStore.endOptions
  });
}));
/**
 * single select with non dynamic options (dynamic labeling based on program's name for tier 2)
 * selects "grouping" or "chaining" based display of indicators in report and filter dropdowns
 */

var GroupingSelect = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('filterStore')(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref5) {
  var filterStore = _ref5.filterStore;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_selectWidgets__WEBPACK_IMPORTED_MODULE_2__["GroupBySelect"], {
    chainLabel: filterStore.resultChainFilterLabel,
    value: filterStore.groupBy,
    update: function update(e) {
      filterStore.groupBy = e.target.value;
    }
  });
}));


/***/ })

},[["mYfJ","runtime","vendors"]]]);
//# sourceMappingURL=iptt_report-8a87ba7cd4092690ead8.js.map