(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["program_page"],{

/***/ "/DQ0":
/*!************************************************************!*\
  !*** ./js/pages/program_page/models/programPageProgram.js ***!
  \************************************************************/
/*! exports provided: forProgramPage, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forProgramPage", function() { return forProgramPage; });
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mobx */ "2vnA");
/* harmony import */ var _apiv2__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../apiv2 */ "5/4V");
/* harmony import */ var _models_program__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../models/program */ "1d5Q");
/* harmony import */ var _programPageIndicator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./programPageIndicator */ "RWoE");




/**
 *  Program Page specific model constructor
 *  JSON params:
 *      needs_additional_target_periods (boolean)
 *      indicators (ProgramPageIndicator)
 *  @return {Object}
 */

var forProgramPage = function forProgramPage() {
  var programJSON = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    indicators: programJSON.indicators ? new Map(Object.values(programJSON.indicators).map(function (indicatorJSON) {
      return new _programPageIndicator__WEBPACK_IMPORTED_MODULE_3__["default"](indicatorJSON);
    }).map(function (indicator) {
      return [indicator.pk, indicator];
    })) : new Map(),
    needsAdditionalTargetPeriods: Boolean(programJSON.needs_additional_target_periods),
    _expandedIndicators: new Set(),
    isExpanded: function isExpanded(indicatorPk) {
      return this._expandedIndicators.has(parseInt(indicatorPk));
    },
    expand: Object(mobx__WEBPACK_IMPORTED_MODULE_0__["action"])(function (indicatorPk) {
      this._expandedIndicators.add(parseInt(indicatorPk));
    }),
    collapse: Object(mobx__WEBPACK_IMPORTED_MODULE_0__["action"])(function (indicatorPk) {
      this._expandedIndicators["delete"](parseInt(indicatorPk));
    }),
    expandAll: Object(mobx__WEBPACK_IMPORTED_MODULE_0__["action"])(function () {
      this._expandedIndicators = new Set(this.indicators.keys());
    }),
    collapseAll: Object(mobx__WEBPACK_IMPORTED_MODULE_0__["action"])(function () {
      this._expandedIndicators.clear();
    }),
    updateIndicator: Object(mobx__WEBPACK_IMPORTED_MODULE_0__["action"])(function (rawIndicatorPk) {
      var _this = this;

      var indicatorPk = parseInt(rawIndicatorPk);
      return _apiv2__WEBPACK_IMPORTED_MODULE_1__["default"].updateProgramPageIndicator(indicatorPk).then(function (results) {
        if (results.indicator) {
          var indicator = Object(_programPageIndicator__WEBPACK_IMPORTED_MODULE_3__["default"])(results.indicator);

          _this.indicators.set(indicator.pk, indicator);
        }

        return results;
      }).then(this._applyOrderUpdate.bind(this));
    }),
    reloadIndicators: Object(mobx__WEBPACK_IMPORTED_MODULE_0__["action"])(function () {
      var _this2 = this;

      return _apiv2__WEBPACK_IMPORTED_MODULE_1__["default"].updateAllProgramPageIndicators(this.pk).then(function (results) {
        _this2.indicators = new Map((results.indicators || []).map(_programPageIndicator__WEBPACK_IMPORTED_MODULE_3__["default"]).map(function (indicator) {
          return [indicator.pk, indicator];
        }));
        return results;
      }).then(this._applyOrderUpdate.bind(this));
    }),
    deleteIndicator: Object(mobx__WEBPACK_IMPORTED_MODULE_0__["action"])(function (indicatorPk) {
      var _this3 = this;

      return this.updateOrder().then(function (success) {
        return _this3.indicators["delete"](parseInt(indicatorPk));
      });
    })
  };
};
/* harmony default export */ __webpack_exports__["default"] = (Object(_models_program__WEBPACK_IMPORTED_MODULE_2__["getProgram"])(_models_program__WEBPACK_IMPORTED_MODULE_2__["withReportingPeriod"], _models_program__WEBPACK_IMPORTED_MODULE_2__["withProgramLevelOrdering"], forProgramPage));

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

/***/ "DaGC":
/*!*************************************************!*\
  !*** ./js/pages/program_page/pinned_reports.js ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return setupPinningDelete; });
// On pinned report delete btn click
function setupPinningDelete(deletePinnedReportURL) {
  function deleteCallback(e) {
    e.preventDefault();
    var prId = $(this).data('deletePinnedReport');
    var pinnedReport = $(this).closest('.pinned-report');

    if (deletePinnedReportURL && window.confirm(gettext('Warning: This action cannot be undone. Are you sure you want to delete this pinned report?'))) {
      $.ajax({
        type: "POST",
        url: deletePinnedReportURL,
        data: {
          pinned_report_id: prId
        },
        success: function success() {
          pinnedReport.remove();
        }
      });
    }
  }

  $('[data-delete-pinned-report]').click(deleteCallback);
}

/***/ }),

/***/ "KPAS":
/*!************************************************************!*\
  !*** ./js/pages/program_page/components/indicator_list.js ***!
  \************************************************************/
/*! exports provided: StatusHeader, IndicatorFilter, IndicatorListTable, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StatusHeader", function() { return StatusHeader; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IndicatorFilter", function() { return IndicatorFilter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IndicatorListTable", function() { return IndicatorListTable; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "TSYQ");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var _eventbus__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../eventbus */ "qtBC");
/* harmony import */ var _components_indicatorModalComponents__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../components/indicatorModalComponents */ "hzyr");
/* harmony import */ var _resultsTable__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./resultsTable */ "w68X");
/* harmony import */ var _fortawesome_fontawesome_svg_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @fortawesome/fontawesome-svg-core */ "7O5W");
/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ "IP2g");
/* harmony import */ var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons */ "wHSu");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../constants */ "v38i");
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-select */ "Cs6D");
var _class, _class2, _temp, _class4;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

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












_fortawesome_fontawesome_svg_core__WEBPACK_IMPORTED_MODULE_6__["library"].add(_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_8__["faCaretDown"], _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_8__["faCaretRight"]);

function getStatusIndicatorString(filterType, indicatorCount) {
  var fmts;

  switch (filterType) {
    case _constants__WEBPACK_IMPORTED_MODULE_9__["IndicatorFilterType"].missingTarget:
      // # Translators: The number of indicators that do not have targets defined on them
      fmts = ngettext("%s indicator has missing targets", "%s indicators have missing targets", indicatorCount);
      return interpolate(fmts, [indicatorCount]);

    case _constants__WEBPACK_IMPORTED_MODULE_9__["IndicatorFilterType"].missingResults:
      // # Translators: The number of indicators that no one has entered in any results for
      fmts = ngettext("%s indicator has missing results", "%s indicators have missing results", indicatorCount);
      return interpolate(fmts, [indicatorCount]);

    case _constants__WEBPACK_IMPORTED_MODULE_9__["IndicatorFilterType"].missingEvidence:
      // # Translators: The number of indicators that contain results that are not backed up with evidence
      fmts = ngettext("%s indicator has missing evidence", "%s indicators have missing evidence", indicatorCount);
      return interpolate(fmts, [indicatorCount]);

    case _constants__WEBPACK_IMPORTED_MODULE_9__["IndicatorFilterType"].aboveTarget:
      // # Translators: shows what number of indicators are a certain percentage above target. Example: 3 indicators are >15% above target
      fmts = ngettext("%s indicator is >15% above target", "%s indicators are >15% above target", indicatorCount);
      return interpolate(fmts, [indicatorCount]);

    case _constants__WEBPACK_IMPORTED_MODULE_9__["IndicatorFilterType"].belowTarget:
      // # Translators: shows what number of indicators are a certain percentage below target. Example: 3 indicators are >15% below target
      fmts = ngettext("%s indicator is >15% below target", "%s indicators are >15% below target", indicatorCount);
      return interpolate(fmts, [indicatorCount]);

    case _constants__WEBPACK_IMPORTED_MODULE_9__["IndicatorFilterType"].onTarget:
      // # Translators: shows what number of indicators are within a set range of target. Example: 3 indicators are on track
      fmts = ngettext("%s indicator is on track", "%s indicators are on track", indicatorCount);
      return interpolate(fmts, [indicatorCount]);

    case _constants__WEBPACK_IMPORTED_MODULE_9__["IndicatorFilterType"].nonReporting:
      // # Translators: shows what number of indicators that for various reasons are not being reported for program metrics
      fmts = ngettext("%s indicator is unavailable", "%s indicators are unavailable", indicatorCount);
      return interpolate(fmts, [indicatorCount]);

    default:
      // # Translators: the number of indicators in a list. Example: 3 indicators
      fmts = ngettext("%s indicator", "%s indicators", indicatorCount);
      return interpolate(fmts, [indicatorCount]);
  }
}

var StatusHeader = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class = /*#__PURE__*/function (_React$Component) {
  _inherits(StatusHeader, _React$Component);

  var _super = _createSuper(StatusHeader);

  function StatusHeader(props) {
    var _this;

    _classCallCheck(this, StatusHeader);

    _this = _super.call(this, props);

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
          filterApplied = _this$props.filterApplied;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "indicators-list__header"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h3", {
        className: "no-bold"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        id: "indicators-list-title"
      }, getStatusIndicatorString(currentIndicatorFilter, indicatorCount)), filterApplied && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("small", {
        className: "ml-2 text-medium-dark text-nowrap"
      }, "|", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        className: "btn btn-sm btn-link btn-inline ml-2",
        href: "#",
        id: "show-all-indicators",
        onClick: this.onShowAllClick
      }, // # Translators: A link that shows all the indicators, some of which are currently filtered from view
      gettext('Show all indicators')))));
    }
  }]);

  return StatusHeader;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component)) || _class;
var IndicatorFilter = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class2 = (_temp = /*#__PURE__*/function (_React$Component2) {
  _inherits(IndicatorFilter, _React$Component2);

  var _super2 = _createSuper(IndicatorFilter);

  function IndicatorFilter() {
    var _this2;

    _classCallCheck(this, IndicatorFilter);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this2 = _super2.call.apply(_super2, [this].concat(args));

    _this2.onIndicatorSelection = function (selected) {
      var selectedIndicatorId = selected ? selected.value : null;

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
      var _this3 = this;

      var indicatorSelectOptions = this.props.rootStore.allIndicators.map(function (i) {
        return {
          value: i.pk,
          label: i.name
        };
      });
      var indicatorSelectValue = this.props.uiStore.selectedIndicatorId ? indicatorSelectOptions.find(function (i) {
        return i.value === _this3.props.uiStore.selectedIndicatorId;
      }) : null;
      var indicatorGroupingOptions = this.props.uiStore.groupByOptions;
      var groupingValue = this.props.uiStore.selectedGroupByOption;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("nav", {
        className: "list__filters list__filters--block-label",
        id: "id_div_indicators"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: ""
      }, gettext("Find an indicator:")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: ""
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_10__["default"], {
        options: indicatorSelectOptions,
        value: indicatorSelectValue,
        isClearable: false,
        placeholder: gettext('None'),
        onChange: this.onIndicatorSelection
      }))), // show Group By only if program is on results framework AND has two levels (filter label is not false)
      this.props.uiStore.resultChainFilterLabel && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: ""
      }, gettext("Group indicators:")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: ""
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_10__["default"], {
        options: indicatorGroupingOptions,
        value: groupingValue,
        isClearable: false,
        onChange: this.onGroupingSelection
      })))));
    }
  }]);

  return IndicatorFilter;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp)) || _class2;
var IndicatorListTable = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class4 = /*#__PURE__*/function (_React$Component3) {
  _inherits(IndicatorListTable, _React$Component3);

  var _super3 = _createSuper(IndicatorListTable);

  function IndicatorListTable(props) {
    var _this4;

    _classCallCheck(this, IndicatorListTable);

    _this4 = _super3.call(this, props);
    _this4.onIndicatorUpdateClick = _this4.onIndicatorUpdateClick.bind(_assertThisInitialized(_this4));
    _this4.onIndicatorResultsToggleClick = _this4.onIndicatorResultsToggleClick.bind(_assertThisInitialized(_this4));
    return _this4;
  }

  _createClass(IndicatorListTable, [{
    key: "onIndicatorUpdateClick",
    value: function onIndicatorUpdateClick(e, indicatorPk) {
      e.preventDefault();
      _eventbus__WEBPACK_IMPORTED_MODULE_3__["default"].emit('open-indicator-update-modal', indicatorPk);
    }
  }, {
    key: "onIndicatorResultsToggleClick",
    value: function onIndicatorResultsToggleClick(e, indicatorPk) {
      e.preventDefault();

      if (this.props.program.isExpanded(indicatorPk)) {
        this.props.program.collapse(indicatorPk);
      } else {
        this.props.program.expand(indicatorPk);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this5 = this;

      var indicators = this.props.indicators;
      var program = this.props.program;
      var editable = !this.props.readOnly;
      var resultEditable = !this.props.resultReadOnly;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("table", {
        className: "table indicators-list"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("thead", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
        className: "table-header"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
        className: "",
        id: "id_indicator_name_col_header"
      }, gettext("Indicator")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
        className: "",
        id: "id_indicator_buttons_col_header"
      }, "\xA0"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
        className: "",
        id: "id_indicator_unit_col_header"
      }, gettext("Unit of measure")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
        className: "text-right",
        id: "id_indicator_baseline_col_header"
      }, gettext("Baseline")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
        className: "text-right",
        id: "id_indicator_target_col_header"
      }, gettext("Target")))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tbody", null, indicators.map(function (indicator) {
        var targetPeriodLastEndDate = indicator.targetPeriodLastEndDate;
        var localizeFunc = window.localizeNumber;
        var displayFunc = indicator.isPercent ? function (val) {
          return val ? "".concat(localizeFunc(val), "%") : '';
        } : function (val) {
          return val ? "".concat(localizeFunc(val)) : '';
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

        var displayUnassignedWarning = indicator.noTargetResults.length > 0 && indicator.periodicTargets.length > 0;
        var displayMissingTargetsWarning = indicator.periodicTargets.length === 0;
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, {
          key: indicator.pk
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
          className: classnames__WEBPACK_IMPORTED_MODULE_1___default()("indicators-list__row", "indicators-list__indicator-header", {
            "is-highlighted": indicator.wasJustCreated,
            "is-expanded": program.isExpanded(indicator.pk)
          })
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
          href: "#",
          className: "indicator_results_toggle btn text-action text-left",
          tabIndex: "0",
          onClick: function onClick(e) {
            return _this5.onIndicatorResultsToggleClick(e, indicator.pk);
          }
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_7__["FontAwesomeIcon"], {
          icon: program.isExpanded(indicator.pk) ? 'caret-down' : 'caret-right'
        }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, indicator.number ? indicator.number + ':' : ''), "\xA0", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
          className: "indicator_name"
        }, indicator.name)), displayUnassignedWarning && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
          className: "text-danger ml-3"
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "fas fa-bullseye"
        }), " ",
        /* # Translators: Warning provided when a result is not longer associated with any target.  It is a warning about state rather than an action.  The full sentence might read "There are results not assigned to targets" rather than "Results have been unassigned from targets. */
        gettext('Results unassigned to targets')), displayMissingTargetsWarning && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
          className: "text-danger ml-3"
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "fas fa-bullseye"
        }), " ", // # Translators: Warning message displayed when a critical piece of information (targets) have not been created for an indicator.
        gettext('Indicator missing targets')), indicator.isKeyPerformanceIndicator && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
          className: "badge"
        }, "KPI"), targetPeriodLastEndDate && program.reportingPeriodEnd > targetPeriodLastEndDate && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
          href: "/indicators/indicator_update/".concat(indicator.pk, "/"),
          className: "indicator-link color-red missing_targets",
          "data-toggle": "modal",
          "data-target": "#indicator_modal_div",
          "data-tab": "targets"
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "fas fa-bullseye"
        }), " ",
        /* # Translators: Adj: labels this indicator as one which is missing one or more targets */
        gettext('Missing targets'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
          href: "#",
          className: "indicator-link",
          onClick: function onClick(e) {
            return _this5.onIndicatorUpdateClick(e, indicator.pk);
          }
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "fas fa-cog"
        }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, indicator.unitOfMeasure), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
          className: "text-right"
        }, indicator.baseline === null ? gettext('N/A') : numberCellFunc(indicator.baseline)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
          className: "text-right"
        }, numberCellFunc(indicator.lopTarget))), program.isExpanded(indicator.pk) && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
          className: "indicators-list__row indicators-list__indicator-body"
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
          colSpan: "6"
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_resultsTable__WEBPACK_IMPORTED_MODULE_5__["default"], {
          indicator: indicator,
          editable: editable,
          resultEditable: resultEditable
        }))));
      })));
    }
  }]);

  return IndicatorListTable;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component)) || _class4;
var IndicatorListTableButtons = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(function (_ref) {
  var program = _ref.program,
      rootStore = _ref.rootStore,
      props = _objectWithoutProperties(_ref, ["program", "rootStore"]);

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "indicator-list__buttons-row"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "expand-collapse-buttons"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_indicatorModalComponents__WEBPACK_IMPORTED_MODULE_4__["ExpandAllButton"], {
    clickHandler: function clickHandler() {
      program.expandAll();
    },
    disabled: rootStore.allExpanded
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_indicatorModalComponents__WEBPACK_IMPORTED_MODULE_4__["CollapseAllButton"], {
    clickHandler: function clickHandler() {
      program.collapseAll();
    },
    disabled: rootStore.allCollapsed
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "indicator-list__add-indicator-button"
  }, !rootStore.readOnly && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_indicatorModalComponents__WEBPACK_IMPORTED_MODULE_4__["AddIndicatorButton"], {
    readonly: rootStore.readOnly,
    programId: program.pk
  })));
});
var IndicatorList = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(function (props) {
  var program = props.rootStore.program;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(StatusHeader, {
    indicatorCount: props.rootStore.indicators.length,
    programId: program.pk,
    currentIndicatorFilter: props.uiStore.currentIndicatorFilter,
    filterApplied: props.uiStore.filterApplied
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorFilter, {
    uiStore: props.uiStore,
    rootStore: props.rootStore
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorListTableButtons, {
    program: program,
    rootStore: props.rootStore
  }), program.needsAdditionalTargetPeriods && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    id: "id_missing_targets_msg",
    className: "color-red"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
    className: "fas fa-bullseye"
  }), "\xA0", gettext('Some indicators have missing targets. To enter these values, click the target icon near the indicator name.')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorListTable, {
    indicators: props.rootStore.indicators,
    program: program,
    readOnly: props.rootStore.readOnly,
    resultReadOnly: props.rootStore.resultReadOnly
  }));
});
/* harmony default export */ __webpack_exports__["default"] = (IndicatorList);

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

/***/ "RWoE":
/*!**************************************************************!*\
  !*** ./js/pages/program_page/models/programPageIndicator.js ***!
  \**************************************************************/
/*! exports provided: forProgramPage, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forProgramPage", function() { return forProgramPage; });
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mobx */ "2vnA");
/* harmony import */ var _models_indicator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../models/indicator */ "My+N");
/* harmony import */ var _models_formattingUtils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../models/formattingUtils */ "NHe6");




var programPageResult = function programPageResult() {
  var resultJSON = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return Object(mobx__WEBPACK_IMPORTED_MODULE_0__["observable"])({
    _formatDecimal: _models_formattingUtils__WEBPACK_IMPORTED_MODULE_2__["formatDecimal"],
    pk: resultJSON.pk,
    dateCollected: resultJSON.date_collected,
    _achieved: resultJSON.achieved,
    evidenceUrl: resultJSON.evidence_url || false,
    recordName: resultJSON.record_name || false,

    get achieved() {
      return this._formatDecimal(this._achieved);
    }

  });
};

var programPageTarget = function programPageTarget() {
  var targetJSON = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return Object(mobx__WEBPACK_IMPORTED_MODULE_0__["observable"])({
    _formatDecimal: _models_formattingUtils__WEBPACK_IMPORTED_MODULE_2__["formatDecimal"],
    periodName: targetJSON.period_name,
    dateRange: targetJSON.date_range || null,
    completed: Boolean(targetJSON.completed),
    mostRecentlyCompleted: Boolean(targetJSON.most_recently_completed),
    _target: targetJSON.target,
    _actual: targetJSON.actual,
    _percentMet: targetJSON.percent_met,
    results: (targetJSON.results || []).map(function (resultJSON) {
      return programPageResult(resultJSON);
    }),

    get target() {
      return this._formatDecimal(this._target);
    },

    get actual() {
      return this._formatDecimal(this._actual);
    },

    get percentMet() {
      return this._formatDecimal(this._percentMet);
    }

  });
};
/**
 *  Program Page specific model constructor
 *  JSON params:
 *      number (str)
 *      was_just_created (boolean)
 *      is_key_performance_indicator (boolean)
 *      is_reporting (boolean)
 *      over_under (number)
 *      has_all_targets_defined (boolean)
 *      results_count (number)
 *      has_results (boolean)
 *      results_with_evidence_count (number)
 *      missing_evidence (boolean)
 *  @return {Object}
 */


var forProgramPage = function forProgramPage() {
  var indicatorJSON = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    number: indicatorJSON.number || false,
    wasJustCreated: Boolean(indicatorJSON.was_just_created),
    isKeyPerformanceIndicator: Boolean(indicatorJSON.is_key_performance_indicator),
    isReporting: Boolean(indicatorJSON.is_reporting),
    hasAllTargetsDefined: Boolean(indicatorJSON.has_all_targets_defined),
    resultsCount: !isNaN(parseInt(indicatorJSON.results_count)) ? parseInt(indicatorJSON.results_count) : false,
    hasResults: Boolean(indicatorJSON.has_results),
    resultsWithEvidenceCount: !isNaN(parseInt(indicatorJSON.results_with_evidence_count)) ? parseInt(indicatorJSON.results_with_evidence_count) : false,
    missingEvidence: Boolean(indicatorJSON.missing_evidence),
    mostRecentlyCompletedTargetEndDate: indicatorJSON.target_frequency && indicatorJSON.most_recent_completed_target_end_date ? new Date(indicatorJSON.most_recent_completed_target_end_date) : null,
    targetPeriodLastEndDate: indicatorJSON.target_frequency && indicatorJSON.target_period_last_end_date ? new Date(indicatorJSON.target_period_last_end_date) : null,
    _overUnder: !isNaN(parseInt(indicatorJSON.over_under)) ? parseInt(indicatorJSON.over_under) : false,

    get belowTarget() {
      return this.isReporting && this._overUnder !== false && this._overUnder < 0;
    },

    get aboveTarget() {
      return this.isReporting && this._overUnder !== false && this._overUnder > 0;
    },

    get inScope() {
      return this.isReporting && this._overUnder !== false && this._overUnder == 0;
    },

    reportingPeriod: indicatorJSON.reporting_period || false,
    periodicTargets: (indicatorJSON.periodic_targets || []).map(function (targetJSON) {
      return programPageTarget(targetJSON);
    }),
    noTargetResults: (indicatorJSON.no_target_results || []).map(function (resultJSON) {
      return programPageResult(resultJSON);
    }),

    get noTargets() {
      return !(this.frequency && this.periodicTargets && this.periodicTargets.length > 0);
    },

    updateData: function updateData(updateJSON) {
      if (updateJSON.pk && !isNaN(parseInt(updateJSON.pk)) && parseInt(updateJSON.pk) === this.pk) {
        this.number = updateJSON.number || false;
      }
    }
  };
};
/* harmony default export */ __webpack_exports__["default"] = (Object(_models_indicator__WEBPACK_IMPORTED_MODULE_1__["getIndicator"])(_models_indicator__WEBPACK_IMPORTED_MODULE_1__["withMeasurement"], forProgramPage));

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
/* harmony import */ var _models_programPageRootStore__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./models/programPageRootStore */ "rYDD");
/* harmony import */ var _general_utilities__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../general_utilities */ "WtQ/");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../constants */ "v38i");
/* harmony import */ var _pinned_reports__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./pinned_reports */ "DaGC");












if (reactContext.deletePinnedReportURL) {
  Object(_pinned_reports__WEBPACK_IMPORTED_MODULE_10__["default"])(reactContext.deletePinnedReportURL);
}
/*
 * Model/Store setup
 */


var rootStore = new _models_programPageRootStore__WEBPACK_IMPORTED_MODULE_7__["default"](reactContext);
var uiStore = rootStore.uiStore;
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
  rootStore.program.collapseAll();
}); // filter down by selecting individual indicator

_eventbus__WEBPACK_IMPORTED_MODULE_2__["default"].on('select-indicator-to-filter', function (selectedIndicatorPk) {
  // clear gauge tank filters
  uiStore.clearIndicatorFilter();
  uiStore.setSelectedIndicatorId(selectedIndicatorPk);
});
/*
 * React components on page
 */

react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_indicator_list__WEBPACK_IMPORTED_MODULE_5__["default"], {
  rootStore: rootStore,
  uiStore: uiStore
}), document.querySelector('#indicator-list-react-component'));
react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_program_metrics__WEBPACK_IMPORTED_MODULE_6__["ProgramMetrics"], {
  rootStore: rootStore,
  uiStore: uiStore
}), document.querySelector('#program-metrics-react-component'));
/*
 * Copied and modified JS from indicator_list_modals.js to allow modals to work
 * without being completely converted to React
 */

function openResultsModal(url) {
  url += "?modal=1";
  $("#indicator_modal_content").empty();
  $("#modalmessages").empty();
  $("#indicator_results_modal_content").load(url);
  $("#indicator_results_div").modal('show');
} // Open the CollectDataUpdate (update results) form in a modal


$("#indicator-list-react-component").on("click", ".results__link", function (e) {
  e.preventDefault();
  var url = $(this).attr("href");
  openResultsModal(url);
});
$('#indicator_results_div').on('review.tola.results.warning', function (e, params) {
  var url = params.url;
  openResultsModal(url);
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
  rootStore.program.updateIndicator(parseInt(params.indicatorId));
}); // when indicator update modal form completes a save or change to periodic targets

$('#indicator_modal_div').on('updated.tola.indicator.save', function (e, params) {
  var indicatorId = parseInt(params.indicatorId);
  rootStore.program.updateIndicator(indicatorId);
}); // when indicator is deleted from modal

$('#indicator_modal_div').on('deleted.tola.indicator.save', function (e, params) {
  rootStore.program.deleteIndicator(params.indicatorId);
}); // When "add results" modal is closed, the targets data needs refreshing
// the indicator itself also needs refreshing for the gas tank gauge

$('#indicator_results_div').on('save.tola.result_form', function (e) {
  var indicatorPk = parseInt($(this).find('form #id_indicator').val());
  rootStore.program.updateIndicator(indicatorPk);
});
/*
 * Routes setup:
 */

var routes = [{
  name: 'all',
  path: '/',
  filterType: _constants__WEBPACK_IMPORTED_MODULE_9__["IndicatorFilterType"].noFilter
}, {
  name: 'targets',
  path: '/targets',
  filterType: _constants__WEBPACK_IMPORTED_MODULE_9__["IndicatorFilterType"].missingTarget
}, {
  name: 'results',
  path: '/results',
  filterType: _constants__WEBPACK_IMPORTED_MODULE_9__["IndicatorFilterType"].missingResults
}, {
  name: 'evidence',
  path: '/evidence',
  filterType: _constants__WEBPACK_IMPORTED_MODULE_9__["IndicatorFilterType"].missingEvidence
}, {
  name: 'scope',
  path: '/scope',
  forwardTo: 'scope.on'
}, {
  name: 'scope.on',
  path: '/on',
  filterType: _constants__WEBPACK_IMPORTED_MODULE_9__["IndicatorFilterType"].onTarget
}, {
  name: 'scope.above',
  path: '/above',
  filterType: _constants__WEBPACK_IMPORTED_MODULE_9__["IndicatorFilterType"].aboveTarget
}, {
  name: 'scope.below',
  path: '/below',
  filterType: _constants__WEBPACK_IMPORTED_MODULE_9__["IndicatorFilterType"].belowTarget
}, {
  name: 'scope.nonreporting',
  path: '/nonreporting',
  filterType: _constants__WEBPACK_IMPORTED_MODULE_9__["IndicatorFilterType"].nonReporting
}, {
  name: 'indicator',
  path: '/indicator/:indicator_id<\\d+>',
  filterType: _constants__WEBPACK_IMPORTED_MODULE_9__["IndicatorFilterType"].noFilter
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
  base: '/program/' + rootStore.program.pk + '/'
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

/***/ "dIZS":
/*!************************************************************!*\
  !*** ./js/pages/program_page/models/programPageUIStore.js ***!
  \************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ProgramPageUIStore; });
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mobx */ "2vnA");
var _class, _descriptor, _descriptor2, _descriptor3, _temp;

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }


var ProgramPageUIStore = (_class = (_temp = /*#__PURE__*/function () {
  // selected gas gauge filter
  // indicators filter
  function ProgramPageUIStore(rootStore) {
    _classCallCheck(this, ProgramPageUIStore);

    _initializerDefineProperty(this, "currentIndicatorFilter", _descriptor, this);

    _initializerDefineProperty(this, "selectedIndicatorId", _descriptor2, this);

    _initializerDefineProperty(this, "groupByChain", _descriptor3, this);

    this.setIndicatorFilter = this.setIndicatorFilter.bind(this);
    this.clearIndicatorFilter = this.clearIndicatorFilter.bind(this);
    this.setSelectedIndicatorId = this.setSelectedIndicatorId.bind(this);
    this.rootStore = rootStore;
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
      this.selectedIndicatorId = null;
      this.rootStore.program.collapseAll();
    }
  }, {
    key: "setSelectedIndicatorId",
    value: function setSelectedIndicatorId(indicatorPk) {
      this.clearIndicatorFilter();
      this.selectedIndicatorId = indicatorPk;
      this.rootStore.program.expand(indicatorPk);
    }
  }, {
    key: "setGroupBy",
    value: function setGroupBy(value) {
      this.groupByChain = value == 1;
    }
  }, {
    key: "filterApplied",
    get: function get() {
      return !(!this.currentIndicatorFilter && !this.selectedIndicatorId);
    }
  }, {
    key: "resultChainFilterLabel",
    get: function get() {
      return this.rootStore.program.resultChainFilterLabel;
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
}(), _temp), (_descriptor = _applyDecoratedDescriptor(_class.prototype, "currentIndicatorFilter", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "selectedIndicatorId", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, "groupByChain", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return true;
  }
}), _applyDecoratedDescriptor(_class.prototype, "setIndicatorFilter", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "setIndicatorFilter"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "clearIndicatorFilter", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "clearIndicatorFilter"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "setSelectedIndicatorId", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "setSelectedIndicatorId"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "filterApplied", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "filterApplied"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "resultChainFilterLabel", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "resultChainFilterLabel"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "groupByOptions", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "groupByOptions"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "selectedGroupByOption", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "selectedGroupByOption"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "setGroupBy", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "setGroupBy"), _class.prototype)), _class);


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
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../constants */ "v38i");
/* harmony import */ var _date_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../date_utils */ "LBcr");
var _class, _temp, _class3, _temp2;

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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








var GaugeTank = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class = (_temp = /*#__PURE__*/function (_React$Component) {
  _inherits(GaugeTank, _React$Component);

  var _super = _createSuper(GaugeTank);

  function GaugeTank() {
    var _this;

    _classCallCheck(this, GaugeTank);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

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
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('gauge', {
          'filter-trigger': unfilledPercent > 0 && !disabled,
          'is-highlighted': isHighlighted
        }),
        onClick: this.handleClick
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h6", {
        className: "gauge__title"
      }, title), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "gauge__overview"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "gauge__graphic gauge__graphic--tank ".concat(filledPercent == 0 ? "gauge__graphic--empty" : "")
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "graphic__tick-marks"
      }, _toConsumableArray(Array(tickCount)).map(function (e, i) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          key: i,
          className: "graphic__tick"
        });
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "graphic__tank--unfilled",
        style: {
          'height': "".concat(unfilledPercent, "%")
        }
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "graphic__tank--filled",
        style: {
          'height': "".concat(filledPercent, "%")
        }
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "gauge__labels"
      }, filledPercent > 0 ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "gauge__label text-muted"
      }, unfilledPercent, "% ", unfilledLabel), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "gauge__label"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "gauge__value"
      }, filledPercent, "% ", filledLabel))) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "gauge__label"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "text-danger"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, emptyLabel))))), unfilledPercent > 0 && !disabled && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "gauge__cta"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "btn-link btn-inline"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-exclamation-triangle text-warning"
      }), " ", cta), "\xA0"));
    }
  }]);

  return GaugeTank;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp)) || _class;

var GaugeBand = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class3 = (_temp2 = /*#__PURE__*/function (_React$Component2) {
  _inherits(GaugeBand, _React$Component2);

  var _super2 = _createSuper(GaugeBand);

  function GaugeBand(props) {
    var _this2;

    _classCallCheck(this, GaugeBand);

    _this2 = _super2.call(this, props);

    _this2.onFilterLinkClick = function (e, filterType) {
      e.preventDefault();
      _eventbus__WEBPACK_IMPORTED_MODULE_3__["default"].emit('nav-apply-gauge-tank-filter', filterType);
    };

    _this2.handledFilterTypes = new Set([_constants__WEBPACK_IMPORTED_MODULE_4__["IndicatorFilterType"].aboveTarget, _constants__WEBPACK_IMPORTED_MODULE_4__["IndicatorFilterType"].belowTarget, _constants__WEBPACK_IMPORTED_MODULE_4__["IndicatorFilterType"].onTarget, _constants__WEBPACK_IMPORTED_MODULE_4__["IndicatorFilterType"].nonReporting]);
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
          rootStore = _this$props2.rootStore,
          currentIndicatorFilter = _this$props2.currentIndicatorFilter,
          program = _this$props2.program;
      var isHighlighted = this.handledFilterTypes.has(currentIndicatorFilter);
      var totalIndicatorCount = rootStore.allIndicators.length;
      var nonReportingCount = rootStore.getIndicatorsNotReporting.length;
      var highCount = rootStore.getIndicatorsAboveTarget.length;
      var lowCount = rootStore.getIndicatorsBelowTarget.length;
      var onTargetCount = rootStore.getIndicatorsOnTarget.length; //100 and 0 should only represent absolute "all" and "none" values respectively (no round to 100 or to 0)

      var makePercent = totalIndicatorCount > 0 ? function (x) {
        return x == totalIndicatorCount ? 100 : x == 0 ? 0 : Math.max(1, Math.min(Math.round(x / totalIndicatorCount * 100), 99));
      } : function (x) {
        return 0;
      };
      var percentHigh = makePercent(highCount);
      var percentOnTarget = makePercent(onTargetCount);
      var percentBelow = makePercent(lowCount);
      var percentNonReporting = makePercent(nonReportingCount);
      var marginPercent = this.props.rootStore.onScopeMargin * 100;
      var programPeriodStartDate = program.reportingPeriodStart;
      var gaugeHasErrors = rootStore.getIndicatorsReporting.length === 0 || rootStore.getTotalResultsCount === 0; // Top level wrapper of component

      var Gauge = function Gauge(props) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('gauge', {
            'is-highlighted': isHighlighted
          }),
          ref: function ref(el) {
            return _this3.el = el;
          }
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h6", {
          className: "gauge__title"
        }, gettext('Indicators on track')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          className: "gauge__overview"
        }, props.children));
      };

      var GaugeLabels = function GaugeLabels(props) {
        // success case
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          className: "gauge__labels"
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          className: "gauge__label"
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
          className: "text-muted filter-trigger--band",
          onClick: function onClick(e) {
            return _this3.onFilterLinkClick(e, _constants__WEBPACK_IMPORTED_MODULE_4__["IndicatorFilterType"].nonReporting);
          }
        },
        /* # Translators: variable %s shows what percentage of indicators have no targets reporting data. Example: 31% unavailable */
        interpolate(gettext('%(percentNonReporting)s% unavailable'), {
          percentNonReporting: percentNonReporting
        }, true)), ' ', /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
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
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "far fa-question-circle"
        }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          className: "gauge__label"
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
          className: "gauge__value--above filter-trigger--band",
          onClick: function onClick(e) {
            return _this3.onFilterLinkClick(e, _constants__WEBPACK_IMPORTED_MODULE_4__["IndicatorFilterType"].aboveTarget);
          },
          dangerouslySetInnerHTML: aboveTargetMarkup()
        })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          className: "gauge__label"
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
          className: "gauge__value filter-trigger--band",
          onClick: function onClick(e) {
            return _this3.onFilterLinkClick(e, _constants__WEBPACK_IMPORTED_MODULE_4__["IndicatorFilterType"].onTarget);
          },
          dangerouslySetInnerHTML: onTargetMarkup()
        }), ' ', /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
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
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "far fa-question-circle"
        }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          className: "gauge__label"
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
          className: "gauge__value--below filter-trigger--band",
          onClick: function onClick(e) {
            return _this3.onFilterLinkClick(e, _constants__WEBPACK_IMPORTED_MODULE_4__["IndicatorFilterType"].belowTarget);
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

      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Gauge, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "gauge__graphic gauge__graphic--performance-band ".concat(gaugeHasErrors ? "gauge__graphic--empty" : "")
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "graphic__tick-marks"
      }, _toConsumableArray(Array(tickCount)).map(function (e, i) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          key: i,
          className: "graphic__tick"
        });
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "graphic__performance-band--above-target",
        style: {
          'height': "".concat(percentHigh, "%")
        }
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "graphic__performance-band--on-target",
        style: {
          'height': "".concat(percentOnTarget, "%")
        }
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "graphic__performance-band--below-target",
        style: {
          'height': "".concat(percentBelow, "%")
        }
      })), gaugeHasErrors ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "gauge__labels"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "gauge__label"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
        className: "text-muted"
      }, gettext("Unavailable until the first target period ends with results reported.")))) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(GaugeLabels, null));
    }
  }]);

  return GaugeBand;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp2)) || _class3;

var ProgramMetrics = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(function (props) {
  var program = props.rootStore.program;
  var indicators = props.rootStore.allIndicators;
  var currentIndicatorFilter = props.uiStore.currentIndicatorFilter;
  var indicatorOnScopeMargin = props.rootStore.indicatorOnScopeMargin; // Use objs for labels below to allow for translator notes to be added

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

  var someTargetsDefined = indicators.map(function (i) {
    return i.hasAllTargetsDefined;
  }).some(function (b) {
    return b;
  }); // Do any indicators have results?

  var someResults = indicators.map(function (i) {
    return i.resultsCount;
  }).some(function (count) {
    return count > 0;
  }); // Do not display on pages with no indicators

  if (indicators.length === 0) return null;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "status__gauges"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(GaugeBand, {
    currentIndicatorFilter: currentIndicatorFilter,
    indicatorOnScopeMargin: indicatorOnScopeMargin,
    rootStore: props.rootStore,
    program: program
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(GaugeTank, _extends({
    filterType: _constants__WEBPACK_IMPORTED_MODULE_4__["IndicatorFilterType"].missingTarget,
    currentIndicatorFilter: currentIndicatorFilter,
    allIndicatorsLength: indicators.length,
    filteredIndicatorsLength: props.rootStore.getIndicatorsNeedingTargets.length
  }, targetLabels)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(GaugeTank, _extends({
    filterType: _constants__WEBPACK_IMPORTED_MODULE_4__["IndicatorFilterType"].missingResults,
    currentIndicatorFilter: currentIndicatorFilter,
    allIndicatorsLength: indicators.length,
    filteredIndicatorsLength: props.rootStore.getIndicatorsNeedingResults.length,
    disabled: !someTargetsDefined
  }, resultsLabels)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(GaugeTank, _extends({
    filterType: _constants__WEBPACK_IMPORTED_MODULE_4__["IndicatorFilterType"].missingEvidence,
    currentIndicatorFilter: currentIndicatorFilter // The names below are misleading as this gauge is measuring *results*, not indicators
    ,
    allIndicatorsLength: props.rootStore.getTotalResultsCount,
    filteredIndicatorsLength: props.rootStore.getTotalResultsCount - props.rootStore.getTotalResultsWithEvidenceCount,
    disabled: !someTargetsDefined || !someResults
  }, evidenceLabels)));
});

/***/ }),

/***/ "rYDD":
/*!**************************************************************!*\
  !*** ./js/pages/program_page/models/programPageRootStore.js ***!
  \**************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ProgramPageRootStore; });
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mobx */ "2vnA");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-dom */ "i8i4");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _programPageProgram__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./programPageProgram */ "/DQ0");
/* harmony import */ var _programPageUIStore__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./programPageUIStore */ "dIZS");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../constants */ "v38i");
var _class, _descriptor, _descriptor2, _temp;

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }







var ProgramPageRootStore = (_class = (_temp = /*#__PURE__*/function () {
  function ProgramPageRootStore() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$programJSON = _ref.programJSON,
        programJSON = _ref$programJSON === void 0 ? {} : _ref$programJSON,
        _ref$onScopeMargin = _ref.onScopeMargin,
        onScopeMargin = _ref$onScopeMargin === void 0 ? 0.15 : _ref$onScopeMargin,
        _ref$deletePinnedRepo = _ref.deletePinnedReportURL,
        deletePinnedReportURL = _ref$deletePinnedRepo === void 0 ? null : _ref$deletePinnedRepo,
        _ref$readOnly = _ref.readOnly,
        readOnly = _ref$readOnly === void 0 ? true : _ref$readOnly,
        _ref$resultReadOnly = _ref.resultReadOnly,
        resultReadOnly = _ref$resultReadOnly === void 0 ? true : _ref$resultReadOnly;

    _classCallCheck(this, ProgramPageRootStore);

    _initializerDefineProperty(this, "program", _descriptor, this);

    _initializerDefineProperty(this, "uiStore", _descriptor2, this);

    this.readOnly = readOnly;
    this.resultReadOnly = resultReadOnly;
    this.onScopeMargin = onScopeMargin;
    this.deletePinnedReportURL = deletePinnedReportURL;
    this.program = Object(_programPageProgram__WEBPACK_IMPORTED_MODULE_3__["default"])(programJSON);
    this.uiStore = new _programPageUIStore__WEBPACK_IMPORTED_MODULE_4__["default"](this);
  }

  _createClass(ProgramPageRootStore, [{
    key: "filterIndicators",
    value: function filterIndicators(filterType) {
      var indicatorPk = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var indicators;

      switch (filterType) {
        case _constants__WEBPACK_IMPORTED_MODULE_5__["IndicatorFilterType"].missingTarget:
          indicators = this.getIndicatorsNeedingTargets;
          break;

        case _constants__WEBPACK_IMPORTED_MODULE_5__["IndicatorFilterType"].missingResults:
          indicators = this.getIndicatorsNeedingResults;
          break;

        case _constants__WEBPACK_IMPORTED_MODULE_5__["IndicatorFilterType"].missingEvidence:
          indicators = this.getIndicatorsNeedingEvidence;
          break;

        case _constants__WEBPACK_IMPORTED_MODULE_5__["IndicatorFilterType"].aboveTarget:
          indicators = this.getIndicatorsAboveTarget;
          break;

        case _constants__WEBPACK_IMPORTED_MODULE_5__["IndicatorFilterType"].belowTarget:
          indicators = this.getIndicatorsBelowTarget;
          break;

        case _constants__WEBPACK_IMPORTED_MODULE_5__["IndicatorFilterType"].onTarget:
          indicators = this.getIndicatorsOnTarget;
          break;

        case _constants__WEBPACK_IMPORTED_MODULE_5__["IndicatorFilterType"].nonReporting:
          indicators = this.getIndicatorsNotReporting;
          break;

        case _constants__WEBPACK_IMPORTED_MODULE_5__["IndicatorFilterType"].noFilter:
        default:
          indicators = this._sortedIndicators;
      }

      if (indicatorPk && !isNaN(parseInt(indicatorPk))) {
        indicators = indicators.filter(function (i) {
          return i.pk == parseInt(indicatorPk);
        });
      }

      return indicators;
    }
  }, {
    key: "_sortedIndicators",
    get: function get() {
      if (this.program.resultsFramework && this.uiStore.groupByChain) {
        return this.program.indicatorsInChainOrder;
      }

      return this.program.indicatorsInLevelOrder;
    }
  }, {
    key: "getIndicatorsNeedingTargets",
    get: function get() {
      return this._sortedIndicators.filter(function (i) {
        return !i.hasAllTargetsDefined;
      });
    }
  }, {
    key: "getIndicatorsNeedingResults",
    get: function get() {
      return this._sortedIndicators.filter(function (i) {
        return !i.hasResults;
      });
    }
  }, {
    key: "getIndicatorsNeedingEvidence",
    get: function get() {
      return this._sortedIndicators.filter(function (i) {
        return i.missingEvidence;
      });
    }
  }, {
    key: "getIndicatorsNotReporting",
    get: function get() {
      return this._sortedIndicators.filter(function (i) {
        return !i.isReporting;
      });
    }
  }, {
    key: "getIndicatorsAboveTarget",
    get: function get() {
      return this._sortedIndicators.filter(function (i) {
        return i.aboveTarget;
      });
    }
  }, {
    key: "getIndicatorsBelowTarget",
    get: function get() {
      return this._sortedIndicators.filter(function (i) {
        return i.belowTarget;
      });
    }
  }, {
    key: "getIndicatorsOnTarget",
    get: function get() {
      return this._sortedIndicators.filter(function (i) {
        return i.inScope;
      });
    }
  }, {
    key: "getIndicatorsReporting",
    get: function get() {
      return this._sortedIndicators.filter(function (i) {
        return i.isReporting;
      });
    }
  }, {
    key: "getTotalResultsCount",
    get: function get() {
      return this.allIndicators.reduce(function (acc, i) {
        return acc + i.resultsCount;
      }, 0);
    }
  }, {
    key: "getTotalResultsWithEvidenceCount",
    get: function get() {
      return this.allIndicators.reduce(function (acc, i) {
        return acc + i.resultsWithEvidenceCount;
      }, 0);
    }
  }, {
    key: "indicators",
    get: function get() {
      return this.filterIndicators(this.uiStore.currentIndicatorFilter, this.uiStore.selectedIndicatorId);
    }
  }, {
    key: "allExpanded",
    get: function get() {
      var _this = this;

      return this.indicators.every(function (indicator) {
        return _this.program.isExpanded(indicator.pk);
      });
    }
  }, {
    key: "allCollapsed",
    get: function get() {
      var _this2 = this;

      return this.indicators.every(function (indicator) {
        return !_this2.program.isExpanded(indicator.pk);
      });
    }
  }, {
    key: "allIndicators",
    get: function get() {
      return this._sortedIndicators;
    }
  }]);

  return ProgramPageRootStore;
}(), _temp), (_descriptor = _applyDecoratedDescriptor(_class.prototype, "program", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "uiStore", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _applyDecoratedDescriptor(_class.prototype, "_sortedIndicators", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "_sortedIndicators"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "getIndicatorsNeedingTargets", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "getIndicatorsNeedingTargets"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "getIndicatorsNeedingResults", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "getIndicatorsNeedingResults"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "getIndicatorsNeedingEvidence", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "getIndicatorsNeedingEvidence"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "getIndicatorsNotReporting", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "getIndicatorsNotReporting"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "getIndicatorsAboveTarget", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "getIndicatorsAboveTarget"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "getIndicatorsBelowTarget", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "getIndicatorsBelowTarget"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "getIndicatorsOnTarget", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "getIndicatorsOnTarget"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "getIndicatorsReporting", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "getIndicatorsReporting"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "getTotalResultsCount", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "getTotalResultsCount"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "getTotalResultsWithEvidenceCount", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "getTotalResultsWithEvidenceCount"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "indicators", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "indicators"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "allExpanded", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "allExpanded"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "allCollapsed", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "allCollapsed"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "allIndicators", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "allIndicators"), _class.prototype)), _class);


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

/***/ "w68X":
/*!**********************************************************!*\
  !*** ./js/pages/program_page/components/resultsTable.js ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ResultsTable; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ "IP2g");
/* harmony import */ var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons */ "wHSu");
/* harmony import */ var _general_utilities__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../general_utilities */ "WtQ/");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../constants */ "v38i");
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

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





 // # Translators: short for Not Applicable

var N_A = gettext("N/A");
/* For passing the localizer function down to the various parts of the results table, we need a context item.
 * Note: this replaces the <provider>/@inject methods from mobx-react with a less-opinionated context.
 * Default value (just localizenumber, no percent) is only used for testing (when no Provider) exists.
 * Docs: https://reactjs.org/docs/context.html
 */

var LocalizerContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createContext(_general_utilities__WEBPACK_IMPORTED_MODULE_3__["localizeNumber"]);
/*
 * Creates a <span class="badge">xx%</span> component that when clicked pops up help text
 * using bootstraps popover library
 */

var ProgressPopover = /*#__PURE__*/function (_React$Component) {
  _inherits(ProgressPopover, _React$Component);

  var _super = _createSuper(ProgressPopover);

  function ProgressPopover() {
    _classCallCheck(this, ProgressPopover);

    return _super.apply(this, arguments);
  }

  _createClass(ProgressPopover, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // Enable popovers after mount (they break otherwise)
      $('*[data-toggle="popover"]').popover({
        html: true
      });
    }
  }, {
    key: "render",
    value: function render() {
      var percent = Object(_general_utilities__WEBPACK_IMPORTED_MODULE_3__["localizePercent"])(this.props.val);
      var badgeClass, onTrackMsg, msg;
      msg = interpolate( // # Translators: Explains how performance is categorized as close to the target or not close to the target
      gettext("<p><strong>The actual value is %(percent)s of the target value.</strong> An indicator is on track if the result is no less than 85% of the target and no more than 115% of the target.</p><p><em>Remember to consider your direction of change when thinking about whether the indicator is on track.</em></p>"), {
        percent: percent
      }, true);

      if (percent && this.props.val > 0.85 && this.props.val < 1.15) {
        badgeClass = "badge-success-light"; // # Translators: Label for an indicator that is within a target range

        onTrackMsg = gettext("On track");
      } else {
        badgeClass = "badge-warning-light"; // # Translators: Label for an indicator that is above or below the target value

        onTrackMsg = gettext("Not on track");
      }

      var content = "<h4 class=\"badge ".concat(badgeClass, "\">").concat(onTrackMsg, "</h4>").concat(msg);
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        tabIndex: "0",
        className: "badge ".concat(badgeClass),
        "data-toggle": "popover",
        "data-placement": "right",
        "data-trigger": "focus",
        "data-content": content
      }, percent));
    }
  }]);

  return ProgressPopover;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);
/**
 * the cells in the results table containing result date, value, and evidence link, with formatting
 */


var ResultCells = function ResultCells(_ref) {
  var result = _ref.result,
      noTarget = _ref.noTarget,
      props = _objectWithoutProperties(_ref, ["result", "noTarget"]);

  var localizer = Object(react__WEBPACK_IMPORTED_MODULE_0__["useContext"])(LocalizerContext);
  var noTargetsClass = noTarget ? " bg-danger-lighter" : "";
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
    className: "results__result--date ".concat(noTargetsClass)
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
    href: "/indicators/result_update/".concat(result.pk, "/"),
    className: "results__link"
  }, result.dateCollected)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
    className: "results__result--value ".concat(noTargetsClass)
  }, localizer(result.achieved)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
    className: "td--stretch results__result--url"
  }, result.evidenceUrl && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
    href: result.evidenceUrl,
    target: "_blank"
  }, result.recordName || result.evidenceUrl)));
};
/**
 * row(s) in the results table
 *  - one instance per target period
 *  - includes supplemental result rows if more than one result for this target period
 *  - includes progress summation row if this target period is the most recently completed one
 */


var TargetPeriodRows = function TargetPeriodRows(_ref2) {
  var target = _ref2.target,
      indicator = _ref2.indicator,
      props = _objectWithoutProperties(_ref2, ["target", "indicator"]);

  var localizer = Object(react__WEBPACK_IMPORTED_MODULE_0__["useContext"])(LocalizerContext);
  var rowspan = target.results.length || 1;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
    className: indicator.timeAware && target.completed ? "results__row--main pt-ended" : "results__row--main"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
    rowSpan: rowspan,
    className: "results__row__target-period"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", {
    className: "text-uppercase"
  }, target.periodName)), target.dateRange && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "text-nowrap"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("small", null, target.dateRange))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
    rowSpan: rowspan,
    className: "text-right"
  }, localizer(target.target) || _constants__WEBPACK_IMPORTED_MODULE_4__["EM_DASH"]), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
    rowSpan: rowspan,
    className: "text-right"
  }, localizer(target.actual) || _constants__WEBPACK_IMPORTED_MODULE_4__["EM_DASH"]), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
    rowSpan: rowspan,
    className: "text-right td--pad"
  }, target.percentMet && target.completed ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ProgressPopover, {
    val: target.percentMet
  }) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
    className: "badge"
  }, Object(_general_utilities__WEBPACK_IMPORTED_MODULE_3__["localizePercent"])(target.percentMet) || N_A)), target.results && target.results.length > 0 ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ResultCells, {
    result: target.results[0],
    noTarget: false
  }) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
    className: "results__result--nodata",
    colSpan: "2"
  }, // # Translators: Shown in a results cell when there are no results to display
  gettext("No results reported")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null))), target.results.length > 1 && target.results.slice(1).map(function (result, idx) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
      key: idx,
      className: indicator.timeAware && target.completed ? "results__row--supplemental pt-ended" : "results__row--supplemental"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ResultCells, {
      result: result,
      noTarget: false
    }));
  }), target.mostRecentlyCompleted && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
    className: "results__row--subtotal"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("em", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, // # Translators: Label for a row showing totals from program start until today
  gettext("Program to date")))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "text-nowrap"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("small", null, indicator.reportingPeriod))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
    className: "text-right"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, localizer(indicator.lopTargetProgress) || _constants__WEBPACK_IMPORTED_MODULE_4__["EM_DASH"])), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
    className: "text-right"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, localizer(indicator.lopActualProgress) || _constants__WEBPACK_IMPORTED_MODULE_4__["EM_DASH"])), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
    className: "text-right"
  }, indicator.lopMetProgress ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ProgressPopover, {
    val: indicator.lopMetProgress
  }) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
    className: "badge"
  }, N_A)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
    colSpan: "3",
    className: "bg-medium"
  })));
};
/*
 * Row for orphaned results - target period cells are blank, Result cells render with a warning background
 *  - noTarget={true} produces the warning background
 */


var NoTargetResultRow = function NoTargetResultRow(_ref3) {
  var result = _ref3.result,
      props = _objectWithoutProperties(_ref3, ["result"]);

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ResultCells, {
    result: result,
    noTarget: true
  }));
};
/*
 *  Summative row at the bottom of a results table.  Always shown if table is shown, even if all cells are blank
 *  Contains a message (stretched across result/evidence columns) explaining summation rules
 */


var LoPRow = function LoPRow(_ref4) {
  var indicator = _ref4.indicator,
      props = _objectWithoutProperties(_ref4, ["indicator"]);

  var localizer = Object(react__WEBPACK_IMPORTED_MODULE_0__["useContext"])(LocalizerContext);
  var lopMessage;

  if (indicator.noTargets) {
    // if no targets, don't explain summing, it competes with the "add targets" messaging
    lopMessage = "";
  } else if (indicator.isPercent || indicator.isCumulative) {
    // # Translators: explanation of the summing rules for the totals row on a list of results
    lopMessage = gettext("Results are cumulative. The Life of Program result mirrors the latest period result.");
  } else {
    // # Translators: explanation of the summing rules for the totals row on a list of results
    lopMessage = gettext("Results are non-cumulative. The Life of Program result is the sum of target period results.");
  }

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
    className: "bg-white"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, // # Translators: identifies a results row as summative for the entire life of the program
  gettext('Life of Program'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
    className: "text-right"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, localizer(indicator.lopTarget) || _constants__WEBPACK_IMPORTED_MODULE_4__["EM_DASH"])), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
    className: "text-right"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, localizer(indicator.lopActual) || _constants__WEBPACK_IMPORTED_MODULE_4__["EM_DASH"])), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
    className: "text-right"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
    className: "badge"
  }, Object(_general_utilities__WEBPACK_IMPORTED_MODULE_3__["localizePercent"])(indicator.lopMet) || N_A)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
    colSpan: "3"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "help-text"
  }, lopMessage)));
};
/*
 * Table section of the results table (rows are results)
 *  - Header (column headers)
 *  - Periodic Target row(s) for each target period provided (not shown if no targets assigned)
 *      - this includes supplemental rows for multiple results on one target period
 *      - this includes the "progress row" after the most recently completed period if applicable
 *  - Summative "LoP" row for life of program totals
 */


var ResultsTableTable = function ResultsTableTable(_ref5) {
  var indicator = _ref5.indicator,
      editable = _ref5.editable,
      props = _objectWithoutProperties(_ref5, ["indicator", "editable"]);

  var localizer = function localizer(val) {
    var localized = Object(_general_utilities__WEBPACK_IMPORTED_MODULE_3__["localizeNumber"])(val);

    if (localized && indicator.isPercent) {
      return "".concat(localized, "%");
    }

    return localized;
  };

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LocalizerContext.Provider, {
    value: localizer
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("table", {
    className: "table results-table"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("thead", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
    className: "table-header"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, // # Translators: Header for a column listing periods in which results are grouped
  gettext('Target period')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    className: "text-right"
  }, // # Translators: Header for a column listing values defined as targets for each row
  gettext('Target')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    className: "text-right"
  }, // # Translators: Header for a column listing actual result values for each row
  pgettext('table (short) header', 'Actual')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    className: "td--pad text-right"
  }, // # Translators: Header for a column listing the progress towards the target value
  gettext('% Met')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    colSpan: "2"
  }, // # Translators: Header for a column listing actual results for a given period
  gettext('Results')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    className: "td--stretch"
  }, // # Translators: Header for a column listing supporting documents for results
  gettext('Evidence')))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tbody", null, indicator.periodicTargets.map(function (periodicTarget, idx) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(TargetPeriodRows, {
      key: "targetrow-".concat(idx),
      target: periodicTarget,
      indicator: indicator
    });
  }), indicator.noTargetResults.map(function (result, idx) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(NoTargetResultRow, {
      key: "notarget-".concat(idx),
      result: result
    });
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LoPRow, {
    indicator: indicator
  }))));
};
/*
 *  Actions/Messages section under the results table (shows even if no table is displayed)
 *      Actions:
 *          - add targets button (shown if targets are not set up && "editable" is true (permissions to edit))
 *          - add result button (shown if editable is true, disabled if targets are not set up)
 *      Messages:
 *          - "This indicator has no targets" - shown if true
 */


var ResultsTableActions = function ResultsTableActions(_ref6) {
  var indicator = _ref6.indicator,
      editable = _ref6.editable,
      resultEditable = _ref6.resultEditable,
      props = _objectWithoutProperties(_ref6, ["indicator", "editable", "resultEditable"]);

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "results-table__actions"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "cd-actions__message"
  }, indicator.noTargets && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "text-danger"
  }, editable && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
    href: "/indicators/indicator_update/".concat(indicator.pk, "/"),
    "data-tab": "#targets",
    className: "indicator-link btn btn-success"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_1__["FontAwesomeIcon"], {
    icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_2__["faPlusCircle"]
  }), // # Translators: Button label which opens a form to add targets to a given indicator
  gettext('Add targets')))), resultEditable && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: indicator.noTargets ? "cd-actions__button disable-span" : "cd-actions__button"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
    href: "/indicators/result_add/".concat(indicator.pk, "/"),
    className: "btn-link btn-add results__link"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_1__["FontAwesomeIcon"], {
    icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_2__["faPlusCircle"]
  }), // # Translators: a button that lets the user add a new result
  gettext('Add result'))));
};
/*
 * Results table consists of a table with rows for each target period, and an "Actions/messages" section below
 *  Table only shows if there are targets and/or results (an indicator with no targets and no results recorded
 *  only gets the "actions" section)
 */


var ResultsTable = /*#__PURE__*/function (_React$Component2) {
  _inherits(ResultsTable, _React$Component2);

  var _super2 = _createSuper(ResultsTable);

  function ResultsTable() {
    _classCallCheck(this, ResultsTable);

    return _super2.apply(this, arguments);
  }

  _createClass(ResultsTable, [{
    key: "render",
    value: function render() {
      var showTable = !this.props.indicator.noTargets || this.props.indicator.noTargetResults.length > 0;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "results-table__wrapper"
      }, showTable && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ResultsTableTable, {
        indicator: this.props.indicator,
        editable: this.props.editable
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ResultsTableActions, {
        indicator: this.props.indicator,
        editable: this.props.editable,
        resultEditable: this.props.resultEditable
      }));
    }
  }]);

  return ResultsTable;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);



/***/ })

},[["aJgA","runtime","vendors"]]]);
//# sourceMappingURL=program_page-70b40cbe02f4b3733945.js.map