(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["iptt_quickstart"],{

/***/ "+aul":
/*!*******************************************!*\
  !*** ./js/pages/iptt_quickstart/index.js ***!
  \*******************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "i8i4");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var _models_ipttQSRootStore__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./models/ipttQSRootStore */ "VBrE");
/* harmony import */ var _components_main__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/main */ "kvAA");





var rootStore = new _models_ipttQSRootStore__WEBPACK_IMPORTED_MODULE_3__["default"](jsContext);
react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(mobx_react__WEBPACK_IMPORTED_MODULE_2__["Provider"], {
  rootStore: rootStore
}, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_main__WEBPACK_IMPORTED_MODULE_4__["IPTTQuickstartForm"], null)), document.querySelector('#id_div_top_quickstart_iptt'));

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

/***/ "I1cX":
/*!********************************************************!*\
  !*** ./js/pages/iptt_quickstart/components/buttons.js ***!
  \********************************************************/
/*! exports provided: IPTTSubmit */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IPTTSubmit", function() { return IPTTSubmit; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "okNM");


var IPTTSubmit = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('rootStore')(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref) {
  var url = _ref.url,
      rootStore = _ref.rootStore;

  var handleClick = function handleClick() {
    return window.location.href = rootStore[url];
  };

  var inlineCSS = {
    width: '100%'
  };
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "d-flex justify-content-center mb-1"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
    className: "btn btn-primary",
    onClick: handleClick,
    disabled: !rootStore[url],
    style: inlineCSS
  }, gettext('View report')));
}));

/***/ }),

/***/ "NP74":
/*!********************************************************!*\
  !*** ./js/pages/iptt_quickstart/components/selects.js ***!
  \********************************************************/
/*! exports provided: QSTVAProgramSelect, QSTimeperiodsProgramSelect, QSTVAPeriodSelect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QSTVAProgramSelect", function() { return QSTVAProgramSelect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QSTimeperiodsProgramSelect", function() { return QSTimeperiodsProgramSelect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QSTVAPeriodSelect", function() { return QSTVAPeriodSelect; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-select */ "Cs6D");
var _dec, _class, _temp, _dec2, _class3, _temp2, _dec3, _class5, _temp3;

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





var IPTTSelectWrapper = function IPTTSelectWrapper(props) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "form-row mb-3"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    className: "col-form-label text-uppercase"
  }, props.label), props.children);
};

var QSTVAProgramSelect = (_dec = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('rootStore'), _dec(_class = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class = (_temp = /*#__PURE__*/function (_React$Component) {
  _inherits(QSTVAProgramSelect, _React$Component);

  var _super = _createSuper(QSTVAProgramSelect);

  function QSTVAProgramSelect() {
    var _this;

    _classCallCheck(this, QSTVAProgramSelect);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _this.selectProgram = function (selected) {
      _this.props.rootStore.setTVAProgram(selected.value);
    };

    return _this;
  }

  _createClass(QSTVAProgramSelect, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IPTTSelectWrapper, {
        label: gettext('Program')
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_2__["default"], {
        options: this.props.rootStore.tvaProgramOptions,
        value: this.props.rootStore.selectedTVAProgram,
        onChange: this.selectProgram,
        className: "tola-react-select"
      }));
    }
  }]);

  return QSTVAProgramSelect;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp)) || _class) || _class);
var QSTimeperiodsProgramSelect = (_dec2 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('rootStore'), _dec2(_class3 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class3 = (_temp2 = /*#__PURE__*/function (_React$Component2) {
  _inherits(QSTimeperiodsProgramSelect, _React$Component2);

  var _super2 = _createSuper(QSTimeperiodsProgramSelect);

  function QSTimeperiodsProgramSelect() {
    var _this2;

    _classCallCheck(this, QSTimeperiodsProgramSelect);

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    _this2 = _super2.call.apply(_super2, [this].concat(args));

    _this2.selectProgram = function (selected) {
      _this2.props.rootStore.setTimeperiodsProgram(selected.value);
    };

    return _this2;
  }

  _createClass(QSTimeperiodsProgramSelect, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IPTTSelectWrapper, {
        label: gettext('Program')
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_2__["default"], {
        options: this.props.rootStore.timeperiodsProgramOptions,
        value: this.props.rootStore.selectedTimeperiodsProgram,
        onChange: this.selectProgram,
        className: "tola-react-select"
      }));
    }
  }]);

  return QSTimeperiodsProgramSelect;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp2)) || _class3) || _class3);
var QSTVAPeriodSelect = (_dec3 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('rootStore'), _dec3(_class5 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class5 = (_temp3 = /*#__PURE__*/function (_React$Component3) {
  _inherits(QSTVAPeriodSelect, _React$Component3);

  var _super3 = _createSuper(QSTVAPeriodSelect);

  function QSTVAPeriodSelect() {
    var _this3;

    _classCallCheck(this, QSTVAPeriodSelect);

    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    _this3 = _super3.call.apply(_super3, [this].concat(args));

    _this3.selectFrequency = function (selected) {
      _this3.props.rootStore.setFrequency(selected.value);
    };

    return _this3;
  }

  _createClass(QSTVAPeriodSelect, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IPTTSelectWrapper, {
        label: gettext('Target periods')
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_2__["default"], {
        options: this.props.rootStore.frequencyOptions,
        value: this.props.rootStore.selectedFrequency,
        onChange: this.selectFrequency,
        className: "tola-react-select"
      }));
    }
  }]);

  return QSTVAPeriodSelect;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp3)) || _class5) || _class5);

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

/***/ "Ox2K":
/*!**********************************************************!*\
  !*** ./js/pages/iptt_quickstart/models/ipttQSProgram.js ***!
  \**********************************************************/
/*! exports provided: forIpttQs, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forIpttQs", function() { return forIpttQs; });
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mobx */ "2vnA");
/* harmony import */ var _models_program__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../models/program */ "1d5Q");
/* harmony import */ var _models_periodDateRange__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../models/periodDateRange */ "OtFd");
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }




/**
 * IPTT Quickstart page specific model constructor
 * JSON params:
 *    frequencies [int]
 *    period_date_ranges (PeriodDateRange)
 * @return {Object}
 */

var forIPTTQSDateRange = function forIPTTQSDateRange() {
  var rangeJSON = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    periods: rangeJSON.periods
  };
};

var QSDateRange = Object(_models_periodDateRange__WEBPACK_IMPORTED_MODULE_2__["getPeriodDateRange"])(forIPTTQSDateRange);
var forIpttQs = function forIpttQs() {
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
      return [freq, QSDateRange({
        frequency: freq,
        periods: periodsJSON
      })];
    }))),
    validFrequency: function validFrequency(frequency) {
      return !isNaN(parseInt(frequency)) && this.frequencies.has(parseInt(frequency));
    },
    _getPeriods: function _getPeriods(frequency) {
      if (!isNaN(parseInt(frequency)) && this.periodRanges.has(parseInt(frequency))) {
        return this.periodRanges.get(parseInt(frequency));
      }

      return false;
    },
    periodCount: function periodCount(frequency) {
      var range = this._getPeriods(frequency);

      if (range) {
        return range.periodCount;
      }

      return false;
    },
    currentPeriod: function currentPeriod(frequency) {
      var range = this._getPeriods(frequency);

      if (range) {
        return range.currentPeriod + 1;
      }

      return false;
    }
  };
};
/* harmony default export */ __webpack_exports__["default"] = (Object(_models_program__WEBPACK_IMPORTED_MODULE_1__["getProgram"])(_models_program__WEBPACK_IMPORTED_MODULE_1__["withReportingPeriod"], forIpttQs));

/***/ }),

/***/ "UQOO":
/*!*******************************************************!*\
  !*** ./js/pages/iptt_quickstart/components/radios.js ***!
  \*******************************************************/
/*! exports provided: QSTVATimeFrameRadio */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QSTVATimeFrameRadio", function() { return QSTVATimeFrameRadio; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ "TSYQ");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);
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




var QSTVATimeFrameRadio = (_dec = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('rootStore'), _dec(_class = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class = (_temp = /*#__PURE__*/function (_React$Component) {
  _inherits(QSTVATimeFrameRadio, _React$Component);

  var _super = _createSuper(QSTVATimeFrameRadio);

  function QSTVATimeFrameRadio(props) {
    var _this;

    _classCallCheck(this, QSTVATimeFrameRadio);

    _this = _super.call(this, props);

    _this.setMostRecentCount = function (e) {
      // eliminate leading zeros and non-digit characters then update state and store
      var value = e.target.value.replace(/^0+/, '').replace(/[^0-9]*/gi, '');

      _this.props.rootStore.setMostRecentCount(value);
    };

    return _this;
  }

  _createClass(QSTVATimeFrameRadio, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group d-lg-flex pb-4"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: classnames__WEBPACK_IMPORTED_MODULE_2___default()('form-check', 'form-check-inline', 'pt-1', 'pr-2', {
          'form-check-inline--is-disabled': this.props.rootStore.periodCountDisabled
        })
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "form-check-input"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "radio",
        checked: this.props.rootStore.showAll,
        disabled: this.props.rootStore.periodCountDisabled,
        onChange: this.props.rootStore.setShowAll,
        id: "id_targetperiods-timeframe_0"
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "form-check-label",
        htmlFor: "id_targetperiods-timeframe_0"
      }, gettext('Show all'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: classnames__WEBPACK_IMPORTED_MODULE_2___default()('form-check', 'form-check-inline', 'pt-1', {
          'form-check-inline--is-disabled': this.props.rootStore.periodCountDisabled
        })
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "form-check-input"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "radio",
        checked: this.props.rootStore.mostRecent,
        disabled: this.props.rootStore.periodCountDisabled,
        onChange: this.props.rootStore.setMostRecent,
        id: "id_targetperiods-timeframe_1"
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "form-check-label",
        htmlFor: "id_targetperiods-timeframe_1"
      }, gettext('Most recent'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "text",
        className: "form-control",
        value: this.props.rootStore.mostRecentCountDisplay,
        disabled: this.props.rootStore.periodCountDisabled,
        placeholder: gettext('enter a number'),
        onChange: this.setMostRecentCount
      })));
    }
  }]);

  return QSTVATimeFrameRadio;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp)) || _class) || _class);

/***/ }),

/***/ "VBrE":
/*!************************************************************!*\
  !*** ./js/pages/iptt_quickstart/models/ipttQSRootStore.js ***!
  \************************************************************/
/*! exports provided: BLANK_LABEL, TVA, TIMEPERIODS, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BLANK_LABEL", function() { return BLANK_LABEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TVA", function() { return TVA; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TIMEPERIODS", function() { return TIMEPERIODS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return QSRootStore; });
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mobx */ "2vnA");
/* harmony import */ var _QSProgramStore__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./QSProgramStore */ "wzKh");
var _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _temp;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

/**
 * IPTT Quickstart React data models
 * @module: iptt_quickstart/models
 */


var BLANK_LABEL = '---------';
var TVA = 1;
var TIMEPERIODS = 2;
var BLANK_OPTION = {
  value: null,
  label: BLANK_LABEL
};
var QSRootStore = (_class = (_temp = /*#__PURE__*/function () {
  function QSRootStore(contextData) {
    var _this = this;

    _classCallCheck(this, QSRootStore);

    _initializerDefineProperty(this, "tvaProgramId", _descriptor, this);

    _initializerDefineProperty(this, "timeperiodsProgramId", _descriptor2, this);

    _initializerDefineProperty(this, "frequencyId", _descriptor3, this);

    _initializerDefineProperty(this, "showAll", _descriptor4, this);

    _initializerDefineProperty(this, "mostRecent", _descriptor5, this);

    _initializerDefineProperty(this, "mostRecentCount", _descriptor6, this);

    _initializerDefineProperty(this, "setMostRecent", _descriptor7, this);

    _initializerDefineProperty(this, "setMostRecentCount", _descriptor8, this);

    _initializerDefineProperty(this, "setShowAll", _descriptor9, this);

    this.programStore = new _QSProgramStore__WEBPACK_IMPORTED_MODULE_1__["default"](this, contextData.programs);
    this.periodLabels = {
      1: gettext("Life of Program (LoP) only"),
      2: gettext("Midline and endline"),
      3: gettext("Annual"),
      4: gettext("Semi-annual"),
      5: gettext("Tri-annual"),
      6: gettext("Quarterly"),
      7: gettext("Monthly")
    };
    this.iptt_url = contextData.iptt_url;
    var resetFrequency = Object(mobx__WEBPACK_IMPORTED_MODULE_0__["reaction"])(function () {
      return _this.tvaProgramId;
    }, function (programId) {
      if (programId !== null && _this.frequencyId !== null && !_this.programStore.getProgram(programId).frequencies.has(_this.frequencyId)) {
        _this.setFrequency(null);
      }
    });
    this.setTVAProgram(contextData.initial_selected_program_id);
    this.setTimeperiodsProgram(contextData.initial_selected_program_id);
  }
  /* options for program selection in TIMEPERIODS form */


  _createClass(QSRootStore, [{
    key: "setTVAProgram",

    /* SET tva program to the designated ID, and make the report type TVA */
    value: function setTVAProgram(programId) {
      if (isNaN(parseInt(programId))) {
        this.tvaProgramId = null;
      } else {
        this.tvaProgramId = parseInt(programId);
      }
    }
    /* SET tva program to the designated ID, and make the report type Timeperiods */

  }, {
    key: "setTimeperiodsProgram",
    value: function setTimeperiodsProgram(programId) {
      if (isNaN(parseInt(programId))) {
        this.timeperiodsProgramId = null;
      } else {
        this.timeperiodsProgramId = parseInt(programId);
      }
    }
    /* SET frequency in TVA form */

  }, {
    key: "setFrequency",
    value: function setFrequency(id) {
      this.frequencyId = id;
    }
  }, {
    key: "timeperiodsProgramOptions",
    get: function get() {
      return this.programStore.programList.map(function (program) {
        return {
          value: program.pk,
          label: program.name
        };
      });
    }
    /* options for program selection in TVA form (must have available frequencies) */

  }, {
    key: "tvaProgramOptions",
    get: function get() {
      return this.programStore.programList.filter(function (program) {
        return program.frequencies.size > 0;
      }).map(function (program) {
        return {
          value: program.pk,
          label: program.name
        };
      });
    }
    /* options for frequency selection in TVA form (must be TVA program, only shows that program's frequencies */

  }, {
    key: "frequencyOptions",
    get: function get() {
      var _this2 = this;

      if (this.tvaProgramId === null) {
        return [BLANK_OPTION];
      }

      return _toConsumableArray(this.programStore.getProgram(this.tvaProgramId).frequencies).map(function (id) {
        return {
          value: id,
          label: _this2.periodLabels[id]
        };
      });
    }
    /* GET select option (value/label) for selected Program in TVA form */

  }, {
    key: "selectedTVAProgram",
    get: function get() {
      if (this.tvaProgramId === null) {
        return BLANK_OPTION;
      }

      return {
        value: this.tvaProgramId,
        label: this.programStore.getProgram(this.tvaProgramId).name
      };
    }
    /* GET select option (value/label) for selected Program in Timeperiods form */

  }, {
    key: "selectedTimeperiodsProgram",
    get: function get() {
      if (this.timeperiodsProgramId === null) {
        return BLANK_OPTION;
      }

      return {
        value: this.timeperiodsProgramId,
        label: this.programStore.getProgram(this.timeperiodsProgramId).name
      };
    }
    /* GET select option (value/label) for selected Frequency in TVA form */

  }, {
    key: "selectedFrequency",
    get: function get() {
      if (this.tvaProgramId === null || this.frequencyId === null) {
        return BLANK_OPTION;
      }

      return {
        value: this.frequencyId,
        label: this.periodLabels[this.frequencyId]
      };
    }
    /* Whether to disable the most recent and show all radio buttons */

  }, {
    key: "periodCountDisabled",
    get: function get() {
      return this.tvaProgramId === null || [3, 4, 5, 6, 7].indexOf(this.frequencyId) == -1;
    }
    /* GET most recent display - only show value if most recent is selected */

  }, {
    key: "mostRecentCountDisplay",
    get: function get() {
      if (!this.periodCountDisabled && this.mostRecent) {
        return this.mostRecentCount;
      }

      return '';
    }
  }, {
    key: "mostRecentCountAccurate",
    get: function get() {
      if (this.mostRecent && this.mostRecentCount) {
        return Math.min(this.mostRecentCount, this.programStore.getProgram(this.tvaProgramId).currentPeriod(this.frequencyId));
      }

      return false;
    }
  }, {
    key: "tvaURL",
    get: function get() {
      if (this.tvaProgramId !== null && this.frequencyId !== null) {
        var program = this.programStore.getProgram(this.tvaProgramId);
        var url = "".concat(this.iptt_url).concat(program.pk, "/targetperiods/?frequency=").concat(this.frequencyId);

        if (this.frequencyId == 1 || this.frequencyId == 2) {
          return url;
        } else if (this.showAll) {
          return "".concat(url, "&start=0&end=").concat(program.periodCount(this.frequencyId) - 1);
        } else if (this.mostRecent && this.mostRecentCount) {
          var current = program.currentPeriod(this.frequencyId) - 1;
          var past = current - Math.max(this.mostRecentCountAccurate, 1) + 1;
          var mrURL = "".concat(url, "&start=").concat(past, "&end=").concat(current);

          if (program.currentPeriod(this.frequencyId) == program.periodCount(this.frequencyId) && past == 0) {
            return "".concat(mrURL, "&mr=1");
          }

          return mrURL;
        }
      }

      return false;
    }
  }, {
    key: "timeperiodsURL",
    get: function get() {
      if (this.timeperiodsProgramId !== null) {
        var current = this.programStore.getProgram(this.timeperiodsProgramId).currentPeriod(7) - 1;
        return "".concat(this.iptt_url).concat(this.timeperiodsProgramId, "/timeperiods/") + "?frequency=7&start=".concat(current - 1, "&end=").concat(current);
      }

      return false;
    }
  }]);

  return QSRootStore;
}(), _temp), (_descriptor = _applyDecoratedDescriptor(_class.prototype, "tvaProgramId", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "timeperiodsProgramId", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, "frequencyId", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, "showAll", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class.prototype, "mostRecent", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class.prototype, "mostRecentCount", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return '';
  }
}), _applyDecoratedDescriptor(_class.prototype, "frequencyOptions", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "frequencyOptions"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "selectedTVAProgram", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "selectedTVAProgram"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "selectedTimeperiodsProgram", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "selectedTimeperiodsProgram"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "selectedFrequency", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "selectedFrequency"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "periodCountDisabled", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "periodCountDisabled"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "mostRecentCountDisplay", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "mostRecentCountDisplay"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "mostRecentCountAccurate", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "mostRecentCountAccurate"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "setTVAProgram", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "setTVAProgram"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "setTimeperiodsProgram", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "setTimeperiodsProgram"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "setFrequency", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "setFrequency"), _class.prototype), _descriptor7 = _applyDecoratedDescriptor(_class.prototype, "setMostRecent", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this3 = this;

    return function () {
      _this3.showAll = false;
      _this3.mostRecent = true;
      _this3.mostRecentCount = '';
    };
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class.prototype, "setMostRecentCount", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this4 = this;

    return function (count) {
      _this4.setMostRecent();

      _this4.mostRecentCount = count;
    };
  }
}), _descriptor9 = _applyDecoratedDescriptor(_class.prototype, "setShowAll", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this5 = this;

    return function () {
      _this5.mostRecent = false;
      _this5.showAll = true;
      _this5.mostRecentCount = '';
    };
  }
}), _applyDecoratedDescriptor(_class.prototype, "tvaURL", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "tvaURL"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "timeperiodsURL", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "timeperiodsURL"), _class.prototype)), _class);


/***/ }),

/***/ "kvAA":
/*!*****************************************************!*\
  !*** ./js/pages/iptt_quickstart/components/main.js ***!
  \*****************************************************/
/*! exports provided: IPTTQuickstartForm */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IPTTQuickstartForm", function() { return IPTTQuickstartForm; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _selects__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./selects */ "NP74");
/* harmony import */ var _radios__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./radios */ "UQOO");
/* harmony import */ var _buttons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./buttons */ "I1cX");





var QuickstartCard = function QuickstartCard(_ref) {
  var children = _ref.children;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "col-sm-6"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "card"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "card-body"
  }, children)));
};

var TVAQuickstartForm = function TVAQuickstartForm() {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(QuickstartCard, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h5", {
    className: "card-title"
  },
  /* # Translators: description of a report type, comparison with targets */
  gettext('Periodic targets vs. actuals')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    className: "card-subtitle text-muted mb-2"
  },
  /* # Translators: label on a form that describes the report it will display */
  gettext('View results organized by target period for indicators that share the same target frequency')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_selects__WEBPACK_IMPORTED_MODULE_1__["QSTVAProgramSelect"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_selects__WEBPACK_IMPORTED_MODULE_1__["QSTVAPeriodSelect"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_radios__WEBPACK_IMPORTED_MODULE_2__["QSTVATimeFrameRadio"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_buttons__WEBPACK_IMPORTED_MODULE_3__["IPTTSubmit"], {
    url: 'tvaURL'
  }));
};

var TimeperiodsQuickstartForm = function TimeperiodsQuickstartForm() {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(QuickstartCard, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h5", {
    className: "card-title"
  },
  /* # Translators: description of a report type, showing only recent updates */
  gettext('Recent progress for all indicators')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    className: "card-subtitle text-muted mb-2"
  },
  /* # Translators: label on a form describing the report it will display */
  gettext('View the most recent two months of results. (You can customize your time periods.) This report does not include periodic targets')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_selects__WEBPACK_IMPORTED_MODULE_1__["QSTimeperiodsProgramSelect"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_buttons__WEBPACK_IMPORTED_MODULE_3__["IPTTSubmit"], {
    url: 'timeperiodsURL'
  }));
};

var IPTTQuickstartForm = function IPTTQuickstartForm() {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "row"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(TVAQuickstartForm, null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(TimeperiodsQuickstartForm, null));
};

/***/ }),

/***/ "wzKh":
/*!***********************************************************!*\
  !*** ./js/pages/iptt_quickstart/models/QSProgramStore.js ***!
  \***********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return QSProgramStore; });
/* harmony import */ var _ipttQSProgram__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ipttQSProgram */ "Ox2K");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var QSProgramStore = /*#__PURE__*/function () {
  function QSProgramStore(rootStore, programsJSON) {
    _classCallCheck(this, QSProgramStore);

    this.rootStore = rootStore;
    this.programs = new Map((programsJSON || []).map(function (programJSON) {
      var program = new _ipttQSProgram__WEBPACK_IMPORTED_MODULE_0__["default"](programJSON);
      return [program.pk, program];
    }).sort(function (a, b) {
      return a[1].name.toUpperCase() < b[1].name.toUpperCase() ? -1 : a[1].name.toUpperCase() > b[1].name.toUpperCase() ? 1 : 0;
    }));
  }

  _createClass(QSProgramStore, [{
    key: "getProgram",
    value: function getProgram(pk) {
      return this.programs.get(pk);
    }
  }, {
    key: "programList",
    get: function get() {
      return _toConsumableArray(this.programs.values());
    }
  }]);

  return QSProgramStore;
}();



/***/ })

},[["+aul","runtime","vendors"]]]);
//# sourceMappingURL=iptt_quickstart-fd228b53b1e7b59d4a01.js.map