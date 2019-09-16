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
/* harmony import */ var _models_root_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./models/root_store */ "xL1x");
/* harmony import */ var _components_main__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/main */ "kvAA");





var rootStore = new _models_root_store__WEBPACK_IMPORTED_MODULE_3__["default"](jsContext);
react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(mobx_react__WEBPACK_IMPORTED_MODULE_2__["Provider"], {
  rootStore: rootStore
}, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_main__WEBPACK_IMPORTED_MODULE_4__["IPTTQuickstartForm"], null)), document.querySelector('#id_div_top_quickstart_iptt'));

/***/ }),

/***/ "CozX":
/*!***********************************************************!*\
  !*** ./js/pages/iptt_quickstart/models/program_models.js ***!
  \***********************************************************/
/*! exports provided: QSProgram, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QSProgram", function() { return QSProgram; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return QSProgramStore; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var QSProgram =
/*#__PURE__*/
function () {
  function QSProgram(rootStore, programJSON) {
    _classCallCheck(this, QSProgram);

    this.rootStore = rootStore;
    this.id = parseInt(programJSON.id);
    this.name = programJSON.name;
    this.frequencies = programJSON.frequencies;
    this.periodDateRanges = programJSON.periodDateRanges;
  }

  _createClass(QSProgram, [{
    key: "periods",
    value: function periods(frequency) {
      return frequency in this.periodDateRanges ? this.periodDateRanges[frequency] : false;
    }
  }, {
    key: "periodCount",
    value: function periodCount(frequency) {
      return this.periods(frequency) ? this.periods(frequency).length : 0;
    }
  }]);

  return QSProgram;
}();

var QSProgramStore =
/*#__PURE__*/
function () {
  function QSProgramStore(rootStore, programsJSON) {
    var _this = this;

    _classCallCheck(this, QSProgramStore);

    this.rootStore = rootStore;
    this.programs = {};
    programsJSON.forEach(function (programJSON) {
      _this.programs[programJSON.id] = new QSProgram(_this.rootStore, programJSON);
    });
  }

  _createClass(QSProgramStore, [{
    key: "getProgram",
    value: function getProgram(id) {
      return this.programs[id];
    }
  }, {
    key: "programList",
    get: function get() {
      return Object.values(this.programs).sort(function (a, b) {
        return a.name.toUpperCase() < b.name.toUpperCase() ? -1 : a.name.toUpperCase() > b.name.toUpperCase() ? 1 : 0;
      });
    }
  }]);

  return QSProgramStore;
}();



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
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "d-flex justify-content-center mb-1"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
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
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-select */ "y2Vs");
var _dec, _class, _temp, _dec2, _class3, _temp2, _dec3, _class5, _temp3;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }





var IPTTSelectWrapper = function IPTTSelectWrapper(props) {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "form-row mb-3"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    className: "col-form-label text-uppercase"
  }, props.label), props.children);
};

var QSTVAProgramSelect = (_dec = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('rootStore'), _dec(_class = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class = (_temp =
/*#__PURE__*/
function (_React$Component) {
  _inherits(QSTVAProgramSelect, _React$Component);

  function QSTVAProgramSelect() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, QSTVAProgramSelect);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(QSTVAProgramSelect)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.selectProgram = function (selected) {
      _this.props.rootStore.setTVAProgram(selected.value);
    };

    return _this;
  }

  _createClass(QSTVAProgramSelect, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IPTTSelectWrapper, {
        label: gettext('Program')
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_2__["default"], {
        options: this.props.rootStore.tvaProgramOptions,
        value: this.props.rootStore.selectedTVAProgram,
        onChange: this.selectProgram,
        className: "tola-react-select"
      }));
    }
  }]);

  return QSTVAProgramSelect;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp)) || _class) || _class);
var QSTimeperiodsProgramSelect = (_dec2 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('rootStore'), _dec2(_class3 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class3 = (_temp2 =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(QSTimeperiodsProgramSelect, _React$Component2);

  function QSTimeperiodsProgramSelect() {
    var _getPrototypeOf3;

    var _this2;

    _classCallCheck(this, QSTimeperiodsProgramSelect);

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    _this2 = _possibleConstructorReturn(this, (_getPrototypeOf3 = _getPrototypeOf(QSTimeperiodsProgramSelect)).call.apply(_getPrototypeOf3, [this].concat(args)));

    _this2.selectProgram = function (selected) {
      _this2.props.rootStore.setTimeperiodsProgram(selected.value);
    };

    return _this2;
  }

  _createClass(QSTimeperiodsProgramSelect, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IPTTSelectWrapper, {
        label: gettext('Program')
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_2__["default"], {
        options: this.props.rootStore.timeperiodsProgramOptions,
        value: this.props.rootStore.selectedTimeperiodsProgram,
        onChange: this.selectProgram,
        className: "tola-react-select"
      }));
    }
  }]);

  return QSTimeperiodsProgramSelect;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp2)) || _class3) || _class3);
var QSTVAPeriodSelect = (_dec3 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('rootStore'), _dec3(_class5 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class5 = (_temp3 =
/*#__PURE__*/
function (_React$Component3) {
  _inherits(QSTVAPeriodSelect, _React$Component3);

  function QSTVAPeriodSelect() {
    var _getPrototypeOf4;

    var _this3;

    _classCallCheck(this, QSTVAPeriodSelect);

    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    _this3 = _possibleConstructorReturn(this, (_getPrototypeOf4 = _getPrototypeOf(QSTVAPeriodSelect)).call.apply(_getPrototypeOf4, [this].concat(args)));

    _this3.selectFrequency = function (selected) {
      _this3.props.rootStore.setFrequency(selected.value);
    };

    return _this3;
  }

  _createClass(QSTVAPeriodSelect, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IPTTSelectWrapper, {
        label: gettext('Target periods')
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_2__["default"], {
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

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




var QSTVATimeFrameRadio = (_dec = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('rootStore'), _dec(_class = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class = (_temp =
/*#__PURE__*/
function (_React$Component) {
  _inherits(QSTVATimeFrameRadio, _React$Component);

  function QSTVATimeFrameRadio() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, QSTVATimeFrameRadio);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(QSTVATimeFrameRadio)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.setMostRecentCount = function (e) {
      _this.props.rootStore.setMostRecentCount(e.target.value);
    };

    return _this;
  }

  _createClass(QSTVATimeFrameRadio, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group d-lg-flex pb-4"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: classnames__WEBPACK_IMPORTED_MODULE_2___default()('form-check', 'form-check-inline', 'pt-1', 'pr-2', {
          'form-check-inline--is-disabled': this.props.rootStore.periodCountDisabled
        })
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "form-check-input"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "radio",
        checked: this.props.rootStore.showAll,
        disabled: this.props.rootStore.periodCountDisabled,
        onChange: this.props.rootStore.setShowAll,
        id: "id_targetperiods-timeframe_0"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "form-check-label",
        htmlFor: "id_targetperiods-timeframe_0"
      }, gettext('Show all'))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: classnames__WEBPACK_IMPORTED_MODULE_2___default()('form-check', 'form-check-inline', 'pt-1', {
          'form-check-inline--is-disabled': this.props.rootStore.periodCountDisabled
        })
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "form-check-input"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "radio",
        checked: this.props.rootStore.mostRecent,
        disabled: this.props.rootStore.periodCountDisabled,
        onChange: this.props.rootStore.setMostRecent,
        id: "id_targetperiods-timeframe_1"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "form-check-label",
        htmlFor: "id_targetperiods-timeframe_1"
      }, gettext('Most recent'))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "number",
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
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "col-sm-6"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "card"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "card-body"
  }, children)));
};

var TVAQuickstartForm = function TVAQuickstartForm() {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(QuickstartCard, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h5", {
    className: "card-title"
  },
  /* # Translators: description of a report type, comparison with targets */
  gettext('Periodic targets vs. actuals')), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    className: "card-subtitle text-muted mb-2"
  },
  /* # Translators: label on a form that describes the report it will display */
  gettext('View results organized by target period for indicators that share the same target frequency')), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_selects__WEBPACK_IMPORTED_MODULE_1__["QSTVAProgramSelect"], null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_selects__WEBPACK_IMPORTED_MODULE_1__["QSTVAPeriodSelect"], null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_radios__WEBPACK_IMPORTED_MODULE_2__["QSTVATimeFrameRadio"], null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_buttons__WEBPACK_IMPORTED_MODULE_3__["IPTTSubmit"], {
    url: 'tvaURL'
  }));
};

var TimeperiodsQuickstartForm = function TimeperiodsQuickstartForm() {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(QuickstartCard, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h5", {
    className: "card-title"
  },
  /* # Translators: description of a report type, showing only recent updates */
  gettext('Recent progress for all indicators')), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    className: "card-subtitle text-muted mb-2"
  },
  /* # Translators: label on a form describing the report it will display */
  gettext('View the most recent two months of results. (You can customize your time periods.) This report does not include periodic targets')), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_selects__WEBPACK_IMPORTED_MODULE_1__["QSTimeperiodsProgramSelect"], null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_buttons__WEBPACK_IMPORTED_MODULE_3__["IPTTSubmit"], {
    url: 'timeperiodsURL'
  }));
};

var IPTTQuickstartForm = function IPTTQuickstartForm() {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "row"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(TVAQuickstartForm, null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(TimeperiodsQuickstartForm, null));
};

/***/ }),

/***/ "xL1x":
/*!*******************************************************!*\
  !*** ./js/pages/iptt_quickstart/models/root_store.js ***!
  \*******************************************************/
/*! exports provided: BLANK_LABEL, TVA, TIMEPERIODS, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BLANK_LABEL", function() { return BLANK_LABEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TVA", function() { return TVA; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TIMEPERIODS", function() { return TIMEPERIODS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return QSRootStore; });
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mobx */ "2vnA");
/* harmony import */ var _program_models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./program_models */ "CozX");
var _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _temp;

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object['ke' + 'ys'](descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object['define' + 'Property'](target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and set to use loose mode. ' + 'To use proposal-class-properties in spec mode with decorators, wait for ' + 'the next major version of decorators in stage 2.'); }

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

var _gettext = typeof gettext !== 'undefined' ? gettext : function (s) {
  return s;
};

var QSRootStore = (_class = (_temp =
/*#__PURE__*/
function () {
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

    this.programStore = new _program_models__WEBPACK_IMPORTED_MODULE_1__["default"](this, contextData.programs);
    this.periodLabels = {
      1: _gettext("Life of Program (LoP) only"),
      3: _gettext("Annual"),
      2: _gettext("Midline and endline"),
      5: _gettext("Tri-annual"),
      4: _gettext("Semi-annual"),
      7: _gettext("Monthly"),
      6: _gettext("Quarterly")
    };
    this.iptt_url = contextData.iptt_url;
    var resetFrequency = Object(mobx__WEBPACK_IMPORTED_MODULE_0__["reaction"])(function () {
      return _this.tvaProgramId;
    }, function (programId) {
      if (programId !== null && _this.frequencyId !== null && _this.programStore.getProgram(programId).frequencies.indexOf(_this.frequencyId) == -1) {
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
    value: function setTVAProgram(id) {
      if (id === null) {
        this.tvaProgramId = null;
      } else {
        this.tvaProgramId = id;
      }
    }
    /* SET tva program to the designated ID, and make the report type Timeperiods */

  }, {
    key: "setTimeperiodsProgram",
    value: function setTimeperiodsProgram(id) {
      if (id === null) {
        this.timeperiodsProgramId = null;
      } else {
        this.timeperiodsProgramId = id;
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
          value: program.id,
          label: program.name
        };
      });
    }
    /* options for program selection in TVA form (must have available frequencies) */

  }, {
    key: "tvaProgramOptions",
    get: function get() {
      return this.programStore.programList.filter(function (program) {
        return program.frequencies.length > 0;
      }).map(function (program) {
        return {
          value: program.id,
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

      return this.programStore.getProgram(this.tvaProgramId).frequencies.map(function (id) {
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
    key: "tvaURL",
    get: function get() {
      if (this.tvaProgramId !== null && this.frequencyId !== null) {
        var url = "".concat(this.iptt_url).concat(this.tvaProgramId, "/targetperiods/?frequency=").concat(this.frequencyId);

        if (this.frequencyId == 1 || this.frequencyId == 2) {
          return url;
        } else if (this.showAll) {
          return "".concat(url, "&timeframe=1");
        }

        return "".concat(url, "&timeframe=2&numrecentcount=").concat(this.mostRecentCount);
      }

      return false;
    }
  }, {
    key: "timeperiodsURL",
    get: function get() {
      if (this.timeperiodsProgramId !== null) {
        return "".concat(this.iptt_url).concat(this.timeperiodsProgramId, "/timeperiods/") + "?frequency=7&timeframe=2&numrecentcount=2";
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
}), _applyDecoratedDescriptor(_class.prototype, "frequencyOptions", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "frequencyOptions"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "selectedTVAProgram", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "selectedTVAProgram"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "selectedTimeperiodsProgram", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "selectedTimeperiodsProgram"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "selectedFrequency", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "selectedFrequency"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "periodCountDisabled", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "periodCountDisabled"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "mostRecentCountDisplay", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "mostRecentCountDisplay"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "setTVAProgram", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "setTVAProgram"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "setTimeperiodsProgram", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "setTimeperiodsProgram"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "setFrequency", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "setFrequency"), _class.prototype), _descriptor7 = _applyDecoratedDescriptor(_class.prototype, "setMostRecent", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], {
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

      count = Math.min(count, _this4.programStore.getProgram(_this4.tvaProgramId).periodCount(_this4.frequencyId));
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


/***/ })

},[["+aul","runtime","vendors"]]]);
//# sourceMappingURL=iptt_quickstart-55a0c546caf8c443363f.js.map