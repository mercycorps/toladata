(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["iptt_report"],{

/***/ "/u1a":
/*!***************************************************************!*\
  !*** ./js/pages/iptt_report/components/report/headerCells.js ***!
  \***************************************************************/
/*! exports provided: BorderedHeader, UnBorderedHeader, PeriodHeader, TVAHeader, ActualHeader */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BorderedHeader", function() { return BorderedHeader; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UnBorderedHeader", function() { return UnBorderedHeader; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PeriodHeader", function() { return PeriodHeader; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TVAHeader", function() { return TVAHeader; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ActualHeader", function() { return ActualHeader; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);


var BorderedHeader = function BorderedHeader(_ref) {
  var label = _ref.label,
      styleWidth = _ref.styleWidth;
  var style = styleWidth ? {
    minWidth: "".concat(styleWidth, "px")
  } : {};
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    scope: "col",
    className: "align-bottom text-uppercase",
    style: style
  }, label);
};

var UnBorderedHeader = function UnBorderedHeader(props) {
  var style = props.styleWidth ? {
    minWidth: "".concat(props.styleWidth, "px")
  } : {};
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    scope: "col",
    className: "align-bottom text-uppercase td-no-side-borders",
    style: style
  }, props.label);
};

var PeriodHeader = function PeriodHeader(props) {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
    scope: "colgroup",
    colSpan: props.isTVA ? 3 : 1,
    className: "text-center title-row text-nowrap align-bottom"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
    className: "text-uppercase"
  }, props.period.name), props.period.range && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("br", null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("small", null, props.period.range)));
};

var TargetHeader = function TargetHeader() {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    scope: "col",
    className: "align-bottom text-uppercase text-right",
    style: {
      minWidth: '110px'
    }
  },
  /* # Translators: Column header for a target value column */
  gettext('Target'));
};

var ActualHeader = function ActualHeader() {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    scope: "col",
    className: "align-bottom text-uppercase text-right",
    style: {
      minWidth: '110px'
    }
  },
  /* # Translators: Column header for an "actual" or achieved/real value column */
  gettext('Actual'));
};

var PercentMetHeader = function PercentMetHeader() {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    scope: "col",
    className: "align-bottom text-uppercase text-right",
    style: {
      minWidth: '110px'
    }
  },
  /* # Translators: Column header for a percent-met column */
  gettext('% met'));
};

var TVAHeader = function TVAHeader() {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(TargetHeader, null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ActualHeader, null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(PercentMetHeader, null));
};



/***/ }),

/***/ "2et8":
/*!*************************************************!*\
  !*** ./js/pages/iptt_report/components/main.js ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _sidebar_sidebar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sidebar/sidebar */ "R+SQ");
/* harmony import */ var _report_ipttReport__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./report/ipttReport */ "MOkO");




var IPTTReportApp = function IPTTReportApp() {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_sidebar_sidebar__WEBPACK_IMPORTED_MODULE_1__["default"], null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_report_ipttReport__WEBPACK_IMPORTED_MODULE_2__["default"], null));
};

/* harmony default export */ __webpack_exports__["default"] = (IPTTReportApp);

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
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




var HelpPopover =
/*#__PURE__*/
function (_React$Component) {
  _inherits(HelpPopover, _React$Component);

  function HelpPopover(props) {
    var _this;

    _classCallCheck(this, HelpPopover);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(HelpPopover).call(this, props));
    _this.content = props.content;
    _this.placement = props.placement || null;
    return _this;
  }

  _createClass(HelpPopover, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        tabIndex: "0",
        "data-toggle": "popover",
        "data-trigger": "focus",
        "data-html": "true",
        "data-placement": this.placement,
        "data-content": this.content
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "far fa-question-circle"
      }));
    }
  }]);

  return HelpPopover;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);


var BootstrapPopoverButton =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(BootstrapPopoverButton, _React$Component2);

  function BootstrapPopoverButton() {
    var _getPrototypeOf2;

    var _this2;

    _classCallCheck(this, BootstrapPopoverButton);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this2 = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(BootstrapPopoverButton)).call.apply(_getPrototypeOf2, [this].concat(args)));
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

/***/ "B3lr":
/*!*****************************************************!*\
  !*** ./js/pages/iptt_report/models/programStore.js ***!
  \*****************************************************/
/*! exports provided: Program, PeriodRange, Period, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Program", function() { return Program; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PeriodRange", function() { return PeriodRange; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Period", function() { return Period; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ProgramStore; });
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mobx */ "2vnA");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../constants */ "v38i");
var _class, _temp, _class3, _temp2, _class5, _temp3, _class7, _temp4, _class9, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _temp5, _class11, _descriptor20, _descriptor21, _descriptor22, _temp6;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and set to use loose mode. ' + 'To use proposal-class-properties in spec mode with decorators, wait for ' + 'the next major version of decorators in stage 2.'); }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object['ke' + 'ys'](descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object['define' + 'Property'](target, property, desc); desc = null; } return desc; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }




var _gettext = typeof gettext !== 'undefined' ? gettext : function (s) {
  return s;
};

var Indicator =
/*#__PURE__*/
function () {
  function Indicator(indicatorJSON, program) {
    var _this$reportData;

    _classCallCheck(this, Indicator);

    this.program = null;
    this.pk = null;
    this.levelpk = null;
    this.number = null;
    this.name = null;
    this.unitOfMeasure = null;
    this.directionOfChange = null;
    this.is_cumulative = null;
    this.unitType = null;
    this.baseline = null;
    this.baseline_na = null;
    this.typePks = [];
    this.sitePks = [];
    this.sectorPk = null;
    this.lopTarget = null;
    this.lopActual = null;
    this.lopMet = null;
    this.frequency = null;
    this.sortIndex = null;
    this.reportData = (_this$reportData = {}, _defineProperty(_this$reportData, _constants__WEBPACK_IMPORTED_MODULE_1__["TIMEPERIODS"], {}), _defineProperty(_this$reportData, _constants__WEBPACK_IMPORTED_MODULE_1__["TVA"], {}), _this$reportData);
    this.pk = parseInt(indicatorJSON.pk);
    this.number = indicatorJSON.number;
    this.old_number = indicatorJSON.old_number;
    this.name = indicatorJSON.name;
    this.unitOfMeasure = indicatorJSON.unitOfMeasure;
    this.directionOfChange = indicatorJSON.directionOfChange;
    this.is_cumulative = indicatorJSON.is_cumulative;
    this.unitType = indicatorJSON.unitType;
    this.baseline = indicatorJSON.baseline;
    this.baseline_na = this.baseline === null ? true : indicatorJSON.baseline_na;
    this.typePks = indicatorJSON.indicatorTypes.map(function (indicatorType) {
      return parseInt(indicatorType.pk);
    });
    this.sitePks = indicatorJSON.sites.map(function (site) {
      return parseInt(site.pk);
    });
    this.sectorPk = indicatorJSON.sector && indicatorJSON.sector.pk && parseInt(indicatorJSON.sector.pk);
    this.lopTarget = parseFloat(indicatorJSON.lopTarget);
    this.lopActual = parseFloat(indicatorJSON.lopActual);
    this.lopMet = indicatorJSON.lopMet && !isNaN(parseFloat(indicatorJSON.lopMet)) ? parseFloat(indicatorJSON.lopMet) * 100 : null;
    this.frequency = parseInt(indicatorJSON.frequency);
    this.loadReportData(indicatorJSON.reportData);
    this.sortIndex = parseInt(indicatorJSON.sortIndex);
    this.levelpk = parseInt(indicatorJSON.levelpk) || null;
    this.program = program;
  }

  _createClass(Indicator, [{
    key: "loadReportData",
    value: function loadReportData(reportJSON) {
      var _this = this;

      if (reportJSON.timeperiods) {
        Object.keys(reportJSON.timeperiods).forEach(function (frequency) {
          _this.reportData[_constants__WEBPACK_IMPORTED_MODULE_1__["TIMEPERIODS"]][frequency] = reportJSON.timeperiods[frequency].map(function (result) {
            return parseFloat(result);
          });
        });
      }

      if (reportJSON.tva) {
        Object.keys(reportJSON.tva).forEach(function (frequency) {
          _this.reportData[_constants__WEBPACK_IMPORTED_MODULE_1__["TVA"]][frequency] = reportJSON.tva[frequency].map(function (resultSet) {
            return {
              target: parseFloat(resultSet.target),
              actual: parseFloat(resultSet.value),
              met: resultSet.target && !isNaN(parseFloat(resultSet.target)) && resultSet.value && !isNaN(parseFloat(resultSet.value)) && parseFloat(resultSet.target) != 0 ? parseFloat(resultSet.value) / parseFloat(resultSet.target) * 100 : null
            };
          });
        });
      }
    }
  }, {
    key: "level",
    get: function get() {
      return this.program.getLevel(this.levelpk);
    }
  }, {
    key: "levelName",
    get: function get() {
      return this.level ? this.level.old ? this.level.displayName : this.level.name : null;
    }
  }, {
    key: "cumulative",
    get: function get() {
      return this.is_cumulative;
    }
  }]);

  return Indicator;
}();

var Level = (_class = (_temp =
/*#__PURE__*/
function () {
  function Level(levelJSON, program) {
    _classCallCheck(this, Level);

    this.program = null;
    this.pk = null;
    this.name = null;
    this.displayName = null;
    this._sort = null;
    this.program = program;
    this.pk = parseInt(levelJSON.pk);
    this.name = levelJSON.name;
    this.displayName = levelJSON.display_name;
    this._sort = parseInt(levelJSON.sort);
  }

  _createClass(Level, [{
    key: "indicators",
    get: function get() {
      var _this2 = this;

      return this.program.indicators.filter(function (indicator) {
        return indicator.levelpk == _this2.pk;
      });
    }
  }]);

  return Level;
}(), _temp), (_applyDecoratedDescriptor(_class.prototype, "indicators", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "indicators"), _class.prototype)), _class);
var OldLevel = (_class3 = (_temp2 =
/*#__PURE__*/
function (_Level) {
  _inherits(OldLevel, _Level);

  function OldLevel() {
    var _getPrototypeOf2;

    var _this3;

    _classCallCheck(this, OldLevel);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this3 = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(OldLevel)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this3.old = true;
    return _this3;
  }

  _createClass(OldLevel, [{
    key: "sort",
    get: function get() {
      return this._sort;
    }
  }]);

  return OldLevel;
}(Level), _temp2), (_applyDecoratedDescriptor(_class3.prototype, "sort", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class3.prototype, "sort"), _class3.prototype)), _class3);
var NewLevel = (_class5 = (_temp3 =
/*#__PURE__*/
function (_Level2) {
  _inherits(NewLevel, _Level2);

  function NewLevel(levelJSON, program) {
    var _this4;

    _classCallCheck(this, NewLevel);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(NewLevel).call(this, levelJSON, program));
    _this4.old = false;
    _this4.tierPk = null;
    _this4.ontology = null;
    _this4.sortOntology = null;
    _this4.depth = null;
    _this4._level2parent = null;
    _this4._parent = null;
    _this4.tierPk = parseInt(levelJSON.tierPk);
    _this4.ontology = levelJSON.ontology;
    _this4.sortOntology = levelJSON.sort_ontology;
    _this4.depth = parseInt(levelJSON.depth);
    _this4._level2parent = parseInt(levelJSON.level2parent);
    _this4._parent = parseInt(levelJSON.parent);
    return _this4;
  }

  _createClass(NewLevel, [{
    key: "tier",
    get: function get() {
      return this.program.getTier(this.tierPk);
    }
  }, {
    key: "outcomeChainDisplay",
    get: function get() {
      var subLevelText = gettext('and sub-levels:');
      return "".concat(this.tier.name, " ").concat(this.sortDisplay, " ").concat(subLevelText, ": ").concat(this.name);
    }
  }, {
    key: "childLevels",
    get: function get() {
      var _this5 = this;

      return this.program.levels.filter(function (level) {
        return level._parent == _this5.pk;
      });
    }
  }, {
    key: "sort",
    get: function get() {
      return this.sortOntology || this._sort;
    }
  }, {
    key: "sortDisplay",
    get: function get() {
      return this._sort;
    }
  }]);

  return NewLevel;
}(Level), _temp3), (_applyDecoratedDescriptor(_class5.prototype, "sort", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class5.prototype, "sort"), _class5.prototype), _applyDecoratedDescriptor(_class5.prototype, "sortDisplay", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class5.prototype, "sortDisplay"), _class5.prototype)), _class5);
var Tier = (_class7 = (_temp4 =
/*#__PURE__*/
function () {
  function Tier(levelJSON, program) {
    _classCallCheck(this, Tier);

    this.program = null;
    this.pk = null;
    this.name = null;
    this.depth = null;
    this.program = program;
    this.pk = parseInt(levelJSON.tierPk);
    this.name = levelJSON.tier;
    this.depth = parseInt(levelJSON.depth);
  }

  _createClass(Tier, [{
    key: "levels",
    get: function get() {
      var _this6 = this;

      return this.program.levels.filter(function (level) {
        return level.tierPk == _this6.pk;
      });
    }
  }]);

  return Tier;
}(), _temp4), (_applyDecoratedDescriptor(_class7.prototype, "levels", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class7.prototype, "levels"), _class7.prototype)), _class7);

var Period =
/*#__PURE__*/
function () {
  function Period(periodJSON, index, frequency) {
    _classCallCheck(this, Period);

    this.index = null;
    this.start = null;
    this.end = null;
    this.current = null;
    this.name = null;
    this.display = null;
    this.range = null;
    this.index = index;
    this.start = new Date(periodJSON[5]);
    this.end = new Date(periodJSON[6]);
    this.startDisplay = periodJSON[0];
    this.endDisplay = periodJSON[1];

    if (_constants__WEBPACK_IMPORTED_MODULE_1__["TIME_AWARE_FREQUENCIES"].includes(frequency)) {
      this.current = frequency === 7 ? periodJSON.length > 4 && (periodJSON[4] === true || periodJSON[4] === "True") : periodJSON.length > 2 && (periodJSON[2] === true || periodJSON[2] === "True");

      switch (frequency) {
        case 3:
          this.name = "".concat(_gettext('Year'), " ").concat(index + 1);
          this.range = "".concat(periodJSON[0], " - ").concat(periodJSON[1]);
          this.display = "".concat(this.name, " (").concat(this.range, ")");
          break;

        case 4:
          this.name = "".concat(_gettext('Semi-annual period'), " ").concat(index + 1);
          this.range = "".concat(periodJSON[0], " - ").concat(periodJSON[1]);
          this.display = "".concat(this.name, " (").concat(this.range, ")");
          break;

        case 5:
          this.name = "".concat(_gettext('Tri-annual period'), " ").concat(index + 1);
          this.range = "".concat(periodJSON[0], " - ").concat(periodJSON[1]);
          this.display = "".concat(this.name, " (").concat(this.range, ")");
          break;

        case 6:
          this.name = "".concat(_gettext('Quarter'), " ").concat(index + 1);
          this.range = "".concat(periodJSON[0], " - ").concat(periodJSON[1], ")");
          this.display = "".concat(this.name, " (").concat(this.range, ")");
          break;

        case 7:
          this.name = "".concat(periodJSON[2], " ").concat(periodJSON[3]);
          this.range = false;
          this.display = this.name;
          break;
      }
    }

    if (frequency === 2 || frequency === 8) {
      this.name = periodJSON[2];
    }
  }

  _createClass(Period, [{
    key: "startAfter",
    value: function startAfter(date) {
      if (this.start.getUTCFullYear() < date.getUTCFullYear()) {
        return false;
      } else if (this.start.getUTCFullYear() > date.getUTCFullYear()) {
        return true;
      } else if (this.start.getUTCMonth() < date.getUTCMonth()) {
        return false;
      } else if (this.start.getUTCMonth() > date.getUTCMonth()) {
        return true;
      } else if (this.start.getUTCDate() < date.getUTCDate()) {
        return false;
      }

      return true;
    }
  }, {
    key: "endBefore",
    value: function endBefore(date) {
      if (this.end.getUTCFullYear() > date.getUTCFullYear()) {
        return false;
      } else if (this.end.getUTCFullYear() < date.getUTCFullYear()) {
        return true;
      } else if (this.end.getUTCMonth() > date.getUTCMonth()) {
        return false;
      } else if (this.end.getUTCMonth() < date.getUTCMonth()) {
        return true;
      } else if (this.end.getUTCDate() > date.getUTCDate()) {
        return false;
      }

      return true;
    }
  }, {
    key: "year",
    get: function get() {
      return this.start.getUTCFullYear();
    }
  }]);

  return Period;
}();

var PeriodRange =
/*#__PURE__*/
function () {
  function PeriodRange(frequency, periodsJSON) {
    var _this7 = this;

    _classCallCheck(this, PeriodRange);

    this.frequency = null;
    this.periods = [];

    this.getPeriod = function () {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref$startAfter = _ref.startAfter,
          startAfter = _ref$startAfter === void 0 ? null : _ref$startAfter,
          _ref$endBefore = _ref.endBefore,
          endBefore = _ref$endBefore === void 0 ? null : _ref$endBefore,
          _ref$current = _ref.current,
          current = _ref$current === void 0 ? null : _ref$current,
          _ref$last = _ref.last,
          last = _ref$last === void 0 ? null : _ref$last,
          _ref$index = _ref.index,
          index = _ref$index === void 0 ? null : _ref$index;

      if (startAfter !== null) {
        return _this7.startAfter(startAfter)[0];
      } else if (endBefore !== null) {
        return _this7.endBefore(endBefore).slice(-1)[0];
      } else if (current !== null) {
        return _this7.currentPeriods.slice(-1)[0];
      } else if (last !== null) {
        return _this7.periods.slice(-1)[0];
      } else if (index !== null) {
        return _this7.periods[index];
      }
    };

    this.frequency = parseInt(frequency);
    this.periods = periodsJSON.map(function (periodJSON, index) {
      return new Period(periodJSON, index, _this7.frequency);
    });
  }

  _createClass(PeriodRange, [{
    key: "periodRange",
    value: function periodRange(startPeriod, endPeriod) {
      return this.periods.slice(startPeriod, endPeriod + 1);
    }
  }, {
    key: "startAfter",
    value: function startAfter(date) {
      return this.periods.filter(function (period) {
        return period.startAfter(date);
      });
    }
  }, {
    key: "endBefore",
    value: function endBefore(date) {
      return this.periods.filter(function (period) {
        return period.endBefore(date);
      });
    }
  }, {
    key: "filter",
    value: function filter(filterFn) {
      return this.periods.filter(filterFn);
    }
  }, {
    key: "currentPeriods",
    get: function get() {
      return this.periods.filter(function (period) {
        return !period.current;
      });
    }
  }]);

  return PeriodRange;
}();

var Program = (_class9 = (_temp5 =
/*#__PURE__*/
function () {
  function Program(JSON) {
    var _this8 = this;

    _classCallCheck(this, Program);

    _initializerDefineProperty(this, "pk", _descriptor, this);

    _initializerDefineProperty(this, "name", _descriptor2, this);

    _initializerDefineProperty(this, "reportingStart", _descriptor3, this);

    _initializerDefineProperty(this, "reportingEnd", _descriptor4, this);

    _initializerDefineProperty(this, "frequencies", _descriptor5, this);

    _initializerDefineProperty(this, "validTVA", _descriptor6, this);

    _initializerDefineProperty(this, "validTIMEPERIODS", _descriptor7, this);

    _initializerDefineProperty(this, "periods", _descriptor8, this);

    _initializerDefineProperty(this, "oldLevels", _descriptor9, this);

    _initializerDefineProperty(this, "_resultChainFilterLabel", _descriptor10, this);

    _initializerDefineProperty(this, "_shortResultChainLabel", _descriptor11, this);

    _initializerDefineProperty(this, "initialized", _descriptor12, this);

    _initializerDefineProperty(this, "calls", _descriptor13, this);

    _initializerDefineProperty(this, "_levels", _descriptor14, this);

    _initializerDefineProperty(this, "_tiers", _descriptor15, this);

    _initializerDefineProperty(this, "_sites", _descriptor16, this);

    _initializerDefineProperty(this, "_sectors", _descriptor17, this);

    _initializerDefineProperty(this, "_types", _descriptor18, this);

    _initializerDefineProperty(this, "_indicators", _descriptor19, this);

    this.getIndicator = function (indicatorPk) {
      if (_this8._indicators[indicatorPk] && _this8._indicators[indicatorPk] !== undefined) {
        return _this8._indicators[indicatorPk];
      }

      return {};
    };

    this.updateProgramData = function (reportJSON) {
      _this8.addLevels(reportJSON.levels);

      if (reportJSON.indicators && Array.isArray(reportJSON.indicators)) {
        reportJSON.indicators.forEach(function (indicatorJSON) {
          var indicatorPk = parseInt(indicatorJSON.pk);

          if (indicatorJSON.sector && indicatorJSON.sector.pk) {
            var sectorPk = parseInt(indicatorJSON.sector.pk);

            if (_this8._sectors[sectorPk] === undefined) {
              _this8._sectors[sectorPk] = {
                pk: sectorPk,
                name: indicatorJSON.sector.name || ''
              };
            }
          }

          if (indicatorJSON.sites && Array.isArray(indicatorJSON.sites)) {
            indicatorJSON.sites.forEach(function (siteJSON) {
              var sitePk = parseInt(siteJSON.pk);

              if (_this8._sites[sitePk] === undefined) {
                _this8._sites[sitePk] = {
                  pk: sitePk,
                  name: siteJSON.name
                };
              }
            });
          }

          if (indicatorJSON.indicatorTypes && Array.isArray(indicatorJSON.indicatorTypes)) {
            indicatorJSON.indicatorTypes.forEach(function (typeJSON) {
              var typePk = parseInt(typeJSON.pk);

              if (_this8._types[typePk] === undefined) {
                _this8._types[typePk] = {
                  pk: typePk,
                  name: typeJSON.name
                };
              }
            });
          }
        });
      }
    };

    this.loadReportData = function (reportJSON) {
      _this8.updateProgramData(reportJSON);

      if (reportJSON.indicators && Array.isArray(reportJSON.indicators)) {
        reportJSON.indicators.forEach(function (indicatorJSON) {
          var indicatorPk = parseInt(indicatorJSON.pk);

          if (_this8._indicators[indicatorPk] && _this8._indicators[indicatorPk].pk === indicatorPk) {
            _this8._indicators[indicatorPk].loadReportData(indicatorJSON.reportData);
          } else {
            _this8._indicators[indicatorPk] = new Indicator(indicatorJSON, _this8);
          }
        });
      }

      _this8.initialized[parseInt(reportJSON.reportType)].push(parseInt(reportJSON.reportFrequency));

      _this8.calls[parseInt(reportJSON.reportType)][parseInt(reportJSON.reportFrequency)] = false;
    };

    this.loadIndicatorData = function (reportJSON) {
      _this8.updateProgramData(reportJSON);

      if (reportJSON.indicator) {
        var indicatorPk = parseInt(reportJSON.indicator.pk);

        if (_this8._indicators[indicatorPk]) {
          delete _this8._indicators[indicatorPk];
        }

        _this8._indicators[indicatorPk] = new Indicator(reportJSON.indicator, _this8);
        return Promise.resolve(indicatorPk);
      } else {
        return Promise.reject(_constants__WEBPACK_IMPORTED_MODULE_1__["STATUS_CODES"].NO_INDICATOR_IN_UPDATE);
      }
    };

    this.validFrequency = function (frequency) {
      return _this8.frequencies.includes(frequency);
    };

    this.periodsFor = function (frequency) {
      return _this8.periods[parseInt(frequency)];
    };

    this.currentPeriod = function (frequency) {
      return _this8.periodsFor(frequency).getPeriod({
        current: true
      });
    };

    this.lastPeriod = function (frequency) {
      return _this8.periodsFor(frequency).getPeriod({
        last: true
      });
    };

    this.isLoaded = function (reportType, frequency) {
      return _this8.initialized[reportType].includes(frequency);
    };

    this.isLoading = function (reportType, frequency) {
      var loadingValue = _this8.calls[reportType][frequency];

      if (loadingValue === undefined || loadingValue === false) {
        return false;
      }

      return loadingValue;
    };

    this.setLoading = function (reportType, frequency, call) {
      _this8.calls[reportType][frequency] = call;
    };

    this.addLevels = function (levelsJSON) {
      if (!_this8.oldLevels) {
        levelsJSON.forEach(function (levelJSON) {
          var levelPk = parseInt(levelJSON.pk);

          if (!isNaN(levelPk)) {
            _this8._levels[levelPk] = new NewLevel(levelJSON, _this8);
            var tierPk = parseInt(levelJSON.tierPk);

            if (!isNaN(tierPk)) {
              if (!_this8._tiers[tierPk]) {
                _this8._tiers[tierPk] = new Tier(levelJSON, _this8);
              }
            }
          }
        });
      } else {
        levelsJSON.forEach(function (levelJSON) {
          var levelPk = parseInt(levelJSON.pk);

          if (!isNaN(levelPk)) {
            _this8._levels[levelPk] = new OldLevel(levelJSON, _this8);
          }
        });
      }
    };

    this.getLevel = function (pk) {
      pk = parseInt(pk);
      return _this8._levels[pk] !== undefined ? _this8._levels[pk] : null;
    };

    this.getTier = function (pk) {
      pk = parseInt(pk);
      return _this8._tiers[pk] !== undefined ? _this8._tiers[pk] : null;
    };

    this.validLevel = function (level) {
      return _this8._levels[level] !== undefined;
    };

    this.validTier = function (tier) {
      return !_this8.oldLevels && _this8._tiers[tier] !== undefined;
    };

    this.validType = function (type) {
      return _this8._types[type] !== undefined;
    };

    this.validSite = function (site) {
      return _this8._sites[site] !== undefined;
    };

    this.validSector = function (sector) {
      return _this8._sectors[sector] !== undefined;
    };

    this.validIndicator = function (indicator) {
      return _this8._indicators[indicator] !== undefined;
    };

    this.pk = parseInt(JSON.id);
    this.name = JSON.name;
    this.frequencies = JSON.frequencies.map(Number);
    this.reportingStart = JSON.reporting_period_start;
    this.reportingEnd = JSON.reporting_period_end;
    this.validTVA = this.frequencies.length > 0;
    this.validTIMEPERIODS = true;
    this.oldLevels = JSON.old_style_levels === true || JSON.old_style_levels === "True";
    this._resultChainFilterLabel = JSON.result_chain_filter_label;
    this._shortResultChainLabel = JSON.short_result_chain_label;
    Object.entries(JSON.periodDateRanges).forEach(function (_ref2) {
      var _ref3 = _slicedToArray(_ref2, 2),
          frequency = _ref3[0],
          periodsJSON = _ref3[1];

      _this8.periods[parseInt(frequency)] = new PeriodRange(frequency, periodsJSON);
    });
  }

  _createClass(Program, [{
    key: "levels",
    get: function get() {
      return this._levels && Object.values(this._levels);
    }
  }, {
    key: "tiers",
    get: function get() {
      return !this.oldLevels && this._tiers && Object.values(this._tiers).sort(function (x, y) {
        return x.depth - y.depth;
      });
    }
  }, {
    key: "resultChainFilterLabel",
    get: function get() {
      return this._resultChainFilterLabel || this.tiers && this.tiers.length > 1 && "by ".concat(this.tiers[1].name, " chain");
    }
  }, {
    key: "shortResultChainLabel",
    get: function get() {
      return this._shortResultChainLabel || this.tiers && this.tiers.length > 1 && "".concat(this.tiers[1].name, " chains");
    }
  }, {
    key: "types",
    get: function get() {
      return this._types && Object.values(this._types);
    }
  }, {
    key: "sectors",
    get: function get() {
      return this._sectors && Object.values(this._sectors);
    }
  }, {
    key: "sites",
    get: function get() {
      return this._sites && Object.values(this._sites);
    }
  }, {
    key: "indicators",
    get: function get() {
      return this._indicators && Object.values(this._indicators);
    }
  }, {
    key: "unassignedIndicators",
    get: function get() {
      return this.indicators.filter(function (indicator) {
        return indicator.level === null;
      });
    }
  }, {
    key: "programPageUrl",
    get: function get() {
      return "/program/".concat(this.pk, "/");
    }
  }]);

  return Program;
}(), _temp5), (_descriptor = _applyDecoratedDescriptor(_class9.prototype, "pk", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class9.prototype, "name", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class9.prototype, "reportingStart", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class9.prototype, "reportingEnd", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class9.prototype, "frequencies", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class9.prototype, "validTVA", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class9.prototype, "validTIMEPERIODS", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class9.prototype, "periods", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor9 = _applyDecoratedDescriptor(_class9.prototype, "oldLevels", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor10 = _applyDecoratedDescriptor(_class9.prototype, "_resultChainFilterLabel", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor11 = _applyDecoratedDescriptor(_class9.prototype, "_shortResultChainLabel", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor12 = _applyDecoratedDescriptor(_class9.prototype, "initialized", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _ref4;

    return _ref4 = {}, _defineProperty(_ref4, _constants__WEBPACK_IMPORTED_MODULE_1__["TVA"], []), _defineProperty(_ref4, _constants__WEBPACK_IMPORTED_MODULE_1__["TIMEPERIODS"], []), _ref4;
  }
}), _descriptor13 = _applyDecoratedDescriptor(_class9.prototype, "calls", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _ref5;

    return _ref5 = {}, _defineProperty(_ref5, _constants__WEBPACK_IMPORTED_MODULE_1__["TVA"], {}), _defineProperty(_ref5, _constants__WEBPACK_IMPORTED_MODULE_1__["TIMEPERIODS"], {}), _ref5;
  }
}), _descriptor14 = _applyDecoratedDescriptor(_class9.prototype, "_levels", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor15 = _applyDecoratedDescriptor(_class9.prototype, "_tiers", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor16 = _applyDecoratedDescriptor(_class9.prototype, "_sites", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor17 = _applyDecoratedDescriptor(_class9.prototype, "_sectors", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor18 = _applyDecoratedDescriptor(_class9.prototype, "_types", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor19 = _applyDecoratedDescriptor(_class9.prototype, "_indicators", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {};
  }
}), _applyDecoratedDescriptor(_class9.prototype, "levels", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class9.prototype, "levels"), _class9.prototype), _applyDecoratedDescriptor(_class9.prototype, "tiers", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class9.prototype, "tiers"), _class9.prototype), _applyDecoratedDescriptor(_class9.prototype, "resultChainFilterLabel", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class9.prototype, "resultChainFilterLabel"), _class9.prototype), _applyDecoratedDescriptor(_class9.prototype, "shortResultChainLabel", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class9.prototype, "shortResultChainLabel"), _class9.prototype), _applyDecoratedDescriptor(_class9.prototype, "types", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class9.prototype, "types"), _class9.prototype), _applyDecoratedDescriptor(_class9.prototype, "sectors", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class9.prototype, "sectors"), _class9.prototype), _applyDecoratedDescriptor(_class9.prototype, "sites", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class9.prototype, "sites"), _class9.prototype), _applyDecoratedDescriptor(_class9.prototype, "indicators", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class9.prototype, "indicators"), _class9.prototype), _applyDecoratedDescriptor(_class9.prototype, "unassignedIndicators", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class9.prototype, "unassignedIndicators"), _class9.prototype), _applyDecoratedDescriptor(_class9.prototype, "programPageUrl", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class9.prototype, "programPageUrl"), _class9.prototype)), _class9);
/* Export for testing: */


var ProgramStore = (_class11 = (_temp6 =
/*#__PURE__*/
function () {
  function ProgramStore(contextData, api) {
    var _this9 = this;

    _classCallCheck(this, ProgramStore);

    _initializerDefineProperty(this, "_programs", _descriptor20, this);

    this.api = null;

    this.addPrograms = function (programsJSON) {
      programsJSON.forEach(function (programJSON) {
        _this9.addProgram(programJSON);
      });
    };

    this.addProgram = function (programJSON) {
      _this9._programs[programJSON.id] = new Program(programJSON);
    };

    this.validProgramId = function (reportType) {
      return function (id) {
        return _this9.programs.filter(reportType === _constants__WEBPACK_IMPORTED_MODULE_1__["TVA"] ? function (program) {
          return program.validTVA;
        } : function (program) {
          return program.validTIMEPERIODS;
        }).map(function (program) {
          return program.pk;
        }).includes(id);
      };
    };

    this.getPrograms = function (reportType) {
      return _this9.programs.filter(reportType === _constants__WEBPACK_IMPORTED_MODULE_1__["TVA"] ? function (program) {
        return program.validTVA;
      } : function (program) {
        return program.validTIMEPERIODS;
      });
    };

    this.getProgram = function (id) {
      return _this9._programs[id];
    };

    this.loadProgram = function (reportType, id, frequency) {
      if (_this9.getProgram(id).isLoaded(reportType, frequency)) {
        return Promise.resolve(_this9.getProgram(id));
      } else if (_this9.getProgram(id).isLoading(reportType, frequency) !== false) {
        return Promise.resolve(_this9.getProgram(id).isLoading(reportType, frequency));
      }

      var dataHandler = _this9.getProgram(id).loadReportData;

      var call = _this9.api.callForReportData(reportType, id, frequency).then(dataHandler);

      _this9.getProgram(id).setLoading(reportType, frequency, call);

      return call;
    };

    this.getLoadedProgram = function (reportType, id, frequency) {
      return _this9.loadProgram(reportType, id, frequency).then(function () {
        return _this9.getProgram(id);
      });
    };

    this.sortByName = function (programA, programB) {
      return programA.name > programB.name ? 1 : programB.name < programA.name ? -1 : 0;
    };

    _initializerDefineProperty(this, "updateIndicator", _descriptor21, this);

    _initializerDefineProperty(this, "removeIndicator", _descriptor22, this);

    this.api = api;
    this.addPrograms(contextData.programs);

    if (contextData.reportData !== undefined) {
      this.getProgram(parseInt(contextData.reportData.programId)).loadReportData(contextData.reportData);
    }
  }
  /**
   * used at init - runs through program JSON and stores validated JSON data as program objects
   */


  _createClass(ProgramStore, [{
    key: "programs",
    get: function get() {
      return Object.values(this._programs).sort(this.sortByName);
    }
    /**
     * returns a validator function for the specified report type to check ids for validity against
     */

  }]);

  return ProgramStore;
}(), _temp6), (_descriptor20 = _applyDecoratedDescriptor(_class11.prototype, "_programs", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {};
  }
}), _applyDecoratedDescriptor(_class11.prototype, "programs", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class11.prototype, "programs"), _class11.prototype), _descriptor21 = _applyDecoratedDescriptor(_class11.prototype, "updateIndicator", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this10 = this;

    return function (reportType, programId, frequencyId, indicatorId) {
      var program = _this10.getProgram(programId) || null;

      if (program) {
        var call = _this10.api.callForIndicatorData(reportType, programId, frequencyId, indicatorId).then(program.loadIndicatorData).then(function (pk) {//do something with the pk here?  It updated!
        }, function (code) {//do something with the failure here?
        });

        return call;
      }
    };
  }
}), _descriptor22 = _applyDecoratedDescriptor(_class11.prototype, "removeIndicator", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this11 = this;

    return function (programId, indicatorId) {
      var program = _this11.getProgram(programId) || null;

      if (program && program._indicators[indicatorId]) {
        delete program._indicators[indicatorId];
        return true;
      }

      return false;
    };
  }
})), _class11);


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
var _dec, _class, _temp, _class3, _temp2, _dec2, _class5, _temp3, _dec3, _class7, _temp4;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }






var PinPopover =
/*#__PURE__*/
function (_React$Component) {
  _inherits(PinPopover, _React$Component);

  function PinPopover(props) {
    var _this;

    _classCallCheck(this, PinPopover);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PinPopover).call(this, props));
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
      return !_this.props.routeStore.pinData || !_this.state.reportName;
    };

    _this.handleClick = function () {
      _this.setState({
        status: _this.SENDING
      });

      $.ajax({
        type: "POST",
        url: _this.props.routeStore.pinUrl,
        data: _objectSpread({
          name: _this.state.reportName
        }, _this.props.routeStore.pinData),
        success: function success() {
          _this.setState({
            status: _this.SENT
          });

          _this.props.updatePosition();
        },
        error: function error(ev) {
          _this.setState({
            status: _this.FAILED
          });

          console.log("ajax error:", ev);
        }
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

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, function () {
        switch (_this2.state.status) {
          case _this2.SENT:
            return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
              className: "form-group"
            }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, gettext('Success!  This report is now pinned to the program page'))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
              href: _this2.props.filterStore.programPageUrl
            }, gettext('Visit the program page now.'))));

          case _this2.FAILED:
            return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
              className: "form-group"
            }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, gettext('Something went wrong when attempting to pin this report'))));

          case _this2.NOT_SENT:
            return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
              className: "form-group"
            }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
              className: ""
            },
            /* # Translators: a field where users can name their newly created report */
            gettext('Report name')), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
              type: "text",
              className: "form-control",
              value: _this2.state.reportName,
              onChange: _this2.handleChange,
              disabled: _this2.state.sending
            })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
              type: "button",
              onClick: _this2.handleClick,
              disabled: _this2.isDisabled(),
              className: "btn btn-primary btn-block"
            }, gettext('Pin to program page')));

          case _this2.SENDING:
            return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
              className: "btn btn-primary",
              disabled: true
            }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
              src: "/static/img/ajax-loader.gif"
            }), "\xA0", gettext('Sending'));
        }
      }());
    }
  }]);

  return PinPopover;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

var PinButton = (_dec = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["inject"])('filterStore', 'routeStore'), _dec(_class = (_temp =
/*#__PURE__*/
function (_BootstrapPopoverButt) {
  _inherits(PinButton, _BootstrapPopoverButt);

  function PinButton() {
    var _getPrototypeOf2;

    var _this3;

    _classCallCheck(this, PinButton);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this3 = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(PinButton)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this3.popoverName = 'pin';

    _this3.getPopoverContent = function () {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(PinPopover, {
        filterStore: _this3.props.filterStore,
        routeStore: _this3.props.routeStore,
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
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        href: "#",
        className: "btn btn-sm btn-secondary",
        ref: "target"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-thumbtack"
      }),
      /* # Translators: a button that lets a user "pin" (verb) a report to their home page */
      gettext('Pin')));
    }
  }]);

  return PinButton;
}(_components_helpPopover__WEBPACK_IMPORTED_MODULE_3__["BootstrapPopoverButton"]), _temp)) || _class);

var ExcelPopover = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class3 = (_temp2 =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(ExcelPopover, _React$Component2);

  function ExcelPopover() {
    var _getPrototypeOf3;

    var _this4;

    _classCallCheck(this, ExcelPopover);

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    _this4 = _possibleConstructorReturn(this, (_getPrototypeOf3 = _getPrototypeOf(ExcelPopover)).call.apply(_getPrototypeOf3, [this].concat(args)));

    _this4.getCurrent = function () {
      if (_this4.props.routeStore.excelUrl) {
        window.open(_this4.props.routeStore.excelUrl, '_blank');
      }
    };

    _this4.getAll = function () {
      if (_this4.props.routeStore.fullExcelUrl) {
        window.open(_this4.props.routeStore.fullExcelUrl, '_blank');
      }
    };

    return _this4;
  }

  _createClass(ExcelPopover, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        type: "button",
        className: "btn btn-primary btn-block",
        onClick: this.getCurrent
      },
      /* # Translators: a download button for a report containing just the data currently displayed */
      gettext('Current view')), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        type: "button",
        className: "btn btn-primary btn-block",
        onClick: this.getAll
      },
      /* # Translators: a download button for a report containing all available data */
      gettext('All program data')));
    }
  }]);

  return ExcelPopover;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp2)) || _class3;

var ExcelPopoverButton = (_dec2 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["inject"])('filterStore', 'routeStore'), _dec2(_class5 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class5 = (_temp3 =
/*#__PURE__*/
function (_BootstrapPopoverButt2) {
  _inherits(ExcelPopoverButton, _BootstrapPopoverButt2);

  function ExcelPopoverButton() {
    var _getPrototypeOf4;

    var _this5;

    _classCallCheck(this, ExcelPopoverButton);

    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    _this5 = _possibleConstructorReturn(this, (_getPrototypeOf4 = _getPrototypeOf(ExcelPopoverButton)).call.apply(_getPrototypeOf4, [this].concat(args)));
    _this5.popoverName = 'excel';

    _this5.getPopoverContent = function () {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ExcelPopover, {
        filterStore: _this5.props.filterStore,
        routeStore: _this5.props.routeStore
      });
    };

    return _this5;
  }

  _createClass(ExcelPopoverButton, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        type: "button",
        className: "btn btn-sm btn-secondary",
        ref: "target"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-download"
      }), " Excel"));
    }
  }]);

  return ExcelPopoverButton;
}(_components_helpPopover__WEBPACK_IMPORTED_MODULE_3__["BootstrapPopoverButton"]), _temp3)) || _class5) || _class5);
var ExcelButton = (_dec3 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["inject"])('routeStore'), _dec3(_class7 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class7 = (_temp4 =
/*#__PURE__*/
function (_React$Component3) {
  _inherits(ExcelButton, _React$Component3);

  function ExcelButton() {
    var _getPrototypeOf5;

    var _this6;

    _classCallCheck(this, ExcelButton);

    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    _this6 = _possibleConstructorReturn(this, (_getPrototypeOf5 = _getPrototypeOf(ExcelButton)).call.apply(_getPrototypeOf5, [this].concat(args)));

    _this6.handleClick = function () {
      if (_this6.props.routeStore.excelUrl) {
        window.open(_this6.props.routeStore.excelUrl, '_blank');
      }
    };

    return _this6;
  }

  _createClass(ExcelButton, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        type: "button",
        className: "btn btn-sm btn-secondary",
        onClick: this.handleClick
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-download"
      }), " Excel"));
    }
  }]);

  return ExcelButton;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp4)) || _class7) || _class7);

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
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../constants */ "v38i");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }





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

var IndicatorEditModalCell = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('filterStore')(function (_ref) {
  var filterStore = _ref.filterStore,
      indicator = _ref.indicator;

  var loadModal = function loadModal(e) {
    e.preventDefault();
    var url = "/indicators/indicator_update/".concat(indicator.pk, "/?modal=true");
    $("#indicator_modal_content").empty();
    $("#modalmessages").empty();
    $("#indicator_modal_content").load(url);
    $("#indicator_modal_div").modal('show').on('updated.tola.indicator.save', filterStore.indicatorUpdate).on('deleted.tola.indicator.save', filterStore.indicatorDelete).one('hidden.bs.modal', function (ev) {
      $(ev.target).off('.tola.save');
    });
  };

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
    className: "td-no-side-borders"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
    type: "button",
    className: "btn btn-link p-1 float-right",
    onClick: loadModal
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
    className: "fas fa-cog"
  })));
});

var IndicatorResultModalCell = function IndicatorResultModalCell(_ref2) {
  var indicator = _ref2.indicator;

  var loadModal = function loadModal(e) {
    e.preventDefault();
    var url = "/indicators/result_table/".concat(indicator.pk, "/0/?edit=false");
    $("#indicator_modal_content").empty();
    $("#modalmessages").empty();
    $("#indicator_modal_content").load(url);
    $("#indicator_modal_div").modal('show');
  };

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
    className: "td-no-side-borders"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
    type: "button",
    className: "btn btn-link p-1 indicator-ajax-popup indicator-data",
    onClick: loadModal
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
    className: "fas fa-table"
  })), indicator.name);
};

var IndicatorCell = function IndicatorCell(_ref3) {
  var value = _ref3.value,
      resultCell = _ref3.resultCell,
      props = _objectWithoutProperties(_ref3, ["value", "resultCell"]);

  var displayValue = value || value === 0 ? value : _constants__WEBPACK_IMPORTED_MODULE_2__["BLANK_TABLE_CELL"];

  if (resultCell && resultCell === true) {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", props, displayValue);
  }

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", _extends({
    className: "td-no-side-borders"
  }, props), displayValue);
};

var PercentCell = function PercentCell(_ref4) {
  var value = _ref4.value,
      props = _objectWithoutProperties(_ref4, ["value"]);

  value = ipttRound(value, true);
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorCell, _extends({
    value: value,
    align: "right"
  }, props));
};

var NumberCell = function NumberCell(_ref5) {
  var value = _ref5.value,
      props = _objectWithoutProperties(_ref5, ["value"]);

  value = ipttRound(value, false);
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorCell, _extends({
    value: value,
    align: "right"
  }, props));
};

var TVAResultsGroup = function TVAResultsGroup(_ref6) {
  var value = _ref6.value,
      resultCell = _ref6.resultCell,
      props = _objectWithoutProperties(_ref6, ["value", "resultCell"]);

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(NumberCell, {
    value: value.target
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(NumberCell, {
    value: value.actual
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(PercentCell, {
    value: value.met
  }));
};

var TVAResultsGroupPercent = function TVAResultsGroupPercent(_ref7) {
  var value = _ref7.value,
      resultCell = _ref7.resultCell,
      props = _objectWithoutProperties(_ref7, ["value", "resultCell"]);

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(PercentCell, {
    value: value.target
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(PercentCell, {
    value: value.actual
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(PercentCell, {
    value: value.met
  }));
};

var IndicatorRow = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('reportStore')(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref8) {
  var reportStore = _ref8.reportStore,
      indicator = _ref8.indicator,
      levelCol = _ref8.levelCol;
  var ValueCell;
  var PeriodCell;

  if (indicator.unitType == '%') {
    ValueCell = PercentCell;
    PeriodCell = reportStore.isTVA ? TVAResultsGroupPercent : PercentCell;
  } else {
    ValueCell = NumberCell;
    PeriodCell = reportStore.isTVA ? TVAResultsGroup : NumberCell;
  }

  var cumulative = indicator.cumulative === null ? null : indicator.cumulative ? gettext('Cumulative') : gettext('Non-cumulative');
  var displayNumber = indicator.number;

  if (displayNumber && displayNumber.length > 0 && displayNumber.slice(-1) == ":") {
    displayNumber = displayNumber.slice(0, -1);
  }

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorCell, {
    value: displayNumber
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorResultModalCell, {
    indicator: indicator
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorEditModalCell, {
    indicator: indicator
  }), levelCol && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorCell, {
    value: indicator.levelName
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorCell, {
    value: indicator.unitOfMeasure
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorCell, {
    value: indicator.directionOfChange || gettext('N/A'),
    align: "center"
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorCell, {
    value: cumulative || gettext('N/A')
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorCell, {
    value: indicator.unitType,
    align: "center"
  }), indicator.baseline_na ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorCell, {
    value: gettext('N/A'),
    align: "right"
  }) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ValueCell, {
    value: indicator.baseline
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ValueCell, {
    value: indicator.lopTarget
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ValueCell, {
    value: indicator.lopActual
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(PercentCell, {
    value: indicator.lopMet
  }), reportStore.periodValues(indicator).map(function (value, index) {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(PeriodCell, {
      value: value,
      key: index,
      resultCell: true
    });
  }));
}));
var LevelTitleRow = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('reportStore')(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref9) {
  var reportStore = _ref9.reportStore,
      children = _ref9.children;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
    colSpan: reportStore.reportWidth,
    className: "iptt-level-row"
  }, children));
}));

var LevelRow = function LevelRow(_ref10) {
  var level = _ref10.level;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LevelTitleRow, null, level.tier.name, level.ontology ? " ".concat(level.ontology) : '', ": ", level.name);
};

var BlankLevelRow = function BlankLevelRow() {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LevelTitleRow, null, gettext('Indicators unassigned to a results framework level'));
};

var LevelGroup = function LevelGroup(_ref11) {
  var level = _ref11.level,
      indicators = _ref11.indicators;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, level ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LevelRow, {
    level: level
  }) : indicators && indicators.length > 0 && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(BlankLevelRow, null), indicators.map(function (indicator, index) {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorRow, {
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
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-select */ "y2Vs");
/* harmony import */ var react_multiselect_checkboxes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-multiselect-checkboxes */ "VCnP");
/* harmony import */ var react_multiselect_checkboxes__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_multiselect_checkboxes__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _formUtils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../formUtils */ "G56O");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../constants */ "v38i");
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }






var SingleReactSelect = function SingleReactSelect(props) {
  var selectId = Object(_formUtils__WEBPACK_IMPORTED_MODULE_3__["uniqueId"])('react-select');
  var labelClasses = props.labelClasses || "col-form-label text-uppercase";
  var formRowClasses = props.formRowClasses || "form-row mb-3";
  var selectClasses = props.selectClasses || "tola-react-select";
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: formRowClasses
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    htmlFor: selectId,
    className: labelClasses
  }, props.label), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_1__["default"], {
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
  var formattedOptions = props.options && props.options.length == 1 && props.options[0].value !== undefined ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
    value: props.options[0].value
  }, props.options[0].label) : props.options && props.options.length > 0 && props.options[0].options && props.options[0].options !== undefined ? props.options.map(function (optgroup, index) {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("optgroup", {
      label: optgroup.label,
      key: index
    }, optgroup.options.map(function (option) {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
        value: option.value,
        key: option.value
      }, option.label);
    }));
  }) : props.options.map(function (option, index) {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
      value: option.value,
      key: index
    }, option.label);
  });
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "form-row mb-3"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    htmlFor: selectId,
    className: "col-form-label text-uppercase"
  }, props.label), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("select", {
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
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: formGroupClass
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    htmlFor: selectId,
    className: labelClass
  }, props.label), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("select", {
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
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null);
  } else {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("hr", {
      style: {
        margin: '3px 0px 0px 0px'
      }
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
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
  var multiSelectProps = !props.options || props.options.length == 0 ? {
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
        if (_ref.value.length == 0) {
          return gettext('None selected');
        }

        if (_ref.value.length == 1) {
          return _ref.value[0].label;
        }

        return "".concat(_ref.value.length, "  ").concat(gettext('selected'));
      }

      return _ref.value.label;
    }
  };
  var baseStyles = {
    dropdownButton: function dropdownButton(base) {
      return !props.options || props.options.length == 0 ? _objectSpread({}, base, {
        backgroundColor: '#E5E6E8',
        background: ''
      }) : base;
    },
    option: function option(provided, state) {
      return _objectSpread({}, provided, {
        padding: '1px 12px',
        display: 'inline-block'
      });
    },
    container: function container(provided, state) {
      return _objectSpread({}, provided, {
        backgroundColor: '#f5f5f5'
      });
    }
  };

  var formatOptionLabel = function formatOptionLabel(props) {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      style: {
        display: "inline-block",
        float: "right",
        width: "90%"
      }
    }, props.label);
  };

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "form-row mb-2 tola-react-multiselect-row"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    htmlFor: selectId,
    className: "col-form-label text-uppercase"
  }, props.label), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_multiselect_checkboxes__WEBPACK_IMPORTED_MODULE_2___default.a, _extends({
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

  var options = [react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
    value: _constants__WEBPACK_IMPORTED_MODULE_4__["GROUP_BY_CHAIN"],
    key: 1
  }, chainLabel), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
    value: _constants__WEBPACK_IMPORTED_MODULE_4__["GROUP_BY_LEVEL"],
    key: 2
  },
  /* # Translators: refers to grouping the report by the level of the indicator */
  gettext('by Level'))];
  ;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SingleSelect, _extends({
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

/***/ "J3fw":
/*!*****************************************************************!*\
  !*** ./js/pages/iptt_report/components/sidebar/reportFilter.js ***!
  \*****************************************************************/
/*! exports provided: LevelSelect, SiteSelect, TypeSelect, SectorSelect, IndicatorSelect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LevelSelect", function() { return LevelSelect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SiteSelect", function() { return SiteSelect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TypeSelect", function() { return TypeSelect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SectorSelect", function() { return SectorSelect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IndicatorSelect", function() { return IndicatorSelect; });
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
    var levelSelects = selected.filter(function (option) {
      return option.filterType == 'level';
    }).map(function (option) {
      return option.value;
    });
    var tierSelects = selected.filter(function (option) {
      return option.filterType == 'tier';
    }).map(function (option) {
      return option.value;
    });

    if (levelSelects && levelSelects.length > 0 && tierSelects && tierSelects.length > 0) {
      if (filterStore.levels.length == levelSelects.length) {
        filterStore.tiers = tierSelects;
      } else {
        filterStore.levels = levelSelects;
      }
    } else if (levelSelects && levelSelects.length > 0) {
      filterStore.levels = levelSelects;
    } else if (tierSelects && tierSelects.length > 0) {
      filterStore.tiers = tierSelects;
    } else {
      filterStore.levels = [];
      filterStore.tiers = [];
    }
  };

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_selectWidgets__WEBPACK_IMPORTED_MODULE_2__["MultiSelectCheckbox"], {
    label: gettext('Levels'),
    options: filterStore.levelOptions,
    value: filterStore.levels && filterStore.levels.length > 0 ? filterStore.levelsSelected : filterStore.tiers && filterStore.tiers.length > 0 ? filterStore.tiersSelected : [],
    update: updateSelected
  });
}));
/**
 * multi-select checkbox for selecting sites for filtering IPTT */

var SiteSelect = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('filterStore')(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref2) {
  var filterStore = _ref2.filterStore;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_selectWidgets__WEBPACK_IMPORTED_MODULE_2__["MultiSelectCheckbox"], {
    label:
    /* # Translators: labels sites that a data could be collected at */
    gettext('Sites'),
    options: filterStore.siteOptions,
    value: filterStore.sitesSelected,
    update: function update(selected) {
      filterStore.sites = selected.map(function (s) {
        return s.value;
      });
    }
  });
}));
/**
 * multi-select checkbox for selecting types for filtering IPTT */

var TypeSelect = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('filterStore')(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref3) {
  var filterStore = _ref3.filterStore;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_selectWidgets__WEBPACK_IMPORTED_MODULE_2__["MultiSelectCheckbox"], {
    label:
    /* # Translators: labels types of indicators to filter by */
    gettext('Types'),
    options: filterStore.typeOptions,
    value: filterStore.typesSelected,
    update: function update(selected) {
      filterStore.types = selected.map(function (s) {
        return s.value;
      });
    }
  });
}));
/**
 * multi-select checkbox for selecting sectors for filtering IPTT */

var SectorSelect = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('filterStore')(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref4) {
  var filterStore = _ref4.filterStore;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_selectWidgets__WEBPACK_IMPORTED_MODULE_2__["MultiSelectCheckbox"], {
    label:
    /* # Translators: labels sectors (i.e. 'Food Security') that an indicator can be categorized as */
    gettext('Sectors'),
    options: filterStore.sectorOptions,
    value: filterStore.sectorsSelected,
    update: function update(selected) {
      filterStore.sectors = selected.map(function (s) {
        return s.value;
      });
    }
  });
}));
/**
 * multi-select checkbox for selecting indicators for filtering IPTT */

var IndicatorSelect = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('filterStore')(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref5) {
  var filterStore = _ref5.filterStore;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_selectWidgets__WEBPACK_IMPORTED_MODULE_2__["MultiSelectCheckbox"], {
    label:
    /* # Translators: labels a filter to select which indicators to display */
    gettext('Indicators'),
    options: filterStore.indicatorOptions,
    value: filterStore.indicatorsSelected,
    update: function update(selected) {
      filterStore.indicators = selected.map(function (s) {
        return s.value;
      });
    }
  });
}));


/***/ }),

/***/ "MOkO":
/*!**************************************************************!*\
  !*** ./js/pages/iptt_report/components/report/ipttReport.js ***!
  \**************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _header__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./header */ "nzxa");
/* harmony import */ var _table__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./table */ "YYuc");




var IPTTReport = function IPTTReport() {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("main", {
    className: "iptt_table_wrapper"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    id: "id_div_top_iptt_report"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_header__WEBPACK_IMPORTED_MODULE_1__["default"], null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_table__WEBPACK_IMPORTED_MODULE_2__["default"], null)));
};

/* harmony default export */ __webpack_exports__["default"] = (IPTTReport);

/***/ }),

/***/ "N38U":
/*!****************************************************!*\
  !*** ./js/pages/iptt_report/models/filterStore.js ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return FilterStore; });
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mobx */ "2vnA");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../constants */ "v38i");
/* harmony import */ var _general_utilities__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../general_utilities */ "WtQ/");
var _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _temp;

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object['ke' + 'ys'](descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object['define' + 'Property'](target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and set to use loose mode. ' + 'To use proposal-class-properties in spec mode with decorators, wait for ' + 'the next major version of decorators in stage 2.'); }





var _gettext = typeof gettext !== 'undefined' ? gettext : function (s) {
  return s;
};

var _getPeriodLabels = Object(_constants__WEBPACK_IMPORTED_MODULE_1__["getPeriodLabels"])(),
    targetperiodLabels = _getPeriodLabels.targetperiodLabels,
    timeperiodLabels = _getPeriodLabels.timeperiodLabels;

var FilterStore = (_class = (_temp =
/*#__PURE__*/
function () {
  function FilterStore(programStore) {
    var _this = this;

    _classCallCheck(this, FilterStore);

    this.programStore = null;

    _initializerDefineProperty(this, "_reportType", _descriptor, this);

    _initializerDefineProperty(this, "_programId", _descriptor2, this);

    _initializerDefineProperty(this, "_frequencyId", _descriptor3, this);

    _initializerDefineProperty(this, "_startPeriod", _descriptor4, this);

    _initializerDefineProperty(this, "_endPeriod", _descriptor5, this);

    _initializerDefineProperty(this, "_groupBy", _descriptor6, this);

    _initializerDefineProperty(this, "_levels", _descriptor7, this);

    _initializerDefineProperty(this, "_tiers", _descriptor8, this);

    _initializerDefineProperty(this, "_sites", _descriptor9, this);

    _initializerDefineProperty(this, "_sectors", _descriptor10, this);

    _initializerDefineProperty(this, "_types", _descriptor11, this);

    _initializerDefineProperty(this, "_indicators", _descriptor12, this);

    _initializerDefineProperty(this, "_latchMostRecent", _descriptor13, this);

    this._oldShowAll = null;
    this._oldMostRecent = null;

    this._validFrequency = function (frequencyId) {
      if (frequencyId && _this.program) {
        if (_this.isTVA) {
          return _this.program.validFrequency(frequencyId);
        } else {
          return _constants__WEBPACK_IMPORTED_MODULE_1__["TIME_AWARE_FREQUENCIES"].includes(frequencyId);
        }
      }

      return false;
    };

    _initializerDefineProperty(this, "clearFilters", _descriptor14, this);

    _initializerDefineProperty(this, "indicatorUpdate", _descriptor15, this);

    _initializerDefineProperty(this, "indicatorDelete", _descriptor16, this);

    this.programStore = programStore;
    var reportChange = Object(mobx__WEBPACK_IMPORTED_MODULE_0__["reaction"])(function () {
      return _this.frequencyId !== null && [_this.reportType, _this.programId, _this.frequencyId];
    }, function (reportParams) {
      _this._reportParamsUpdated(reportParams);
    });
  }

  _createClass(FilterStore, [{
    key: "getLoadedProgram",

    /* Returns a promise to be completed after programStore loads the program from the API call
     * promise will immediately complete if the program is already loaded
     */
    value: function getLoadedProgram() {
      this.updateTransitionParams();

      if (this.reportType && this.program && this.frequencyId) {
        return this.programStore.getLoadedProgram(this.reportType, this.programId, this.frequencyId);
      } else {
        return Promise.reject(false);
      }
    }
  }, {
    key: "updateTransitionParams",
    value: function updateTransitionParams() {
      this._oldShowAll = this.showAll;
      this._oldMostRecent = this.mostRecent;
      this._latchMostRecent = false;
    }
  }, {
    key: "clearTransitionParams",
    value: function clearTransitionParams() {
      this._oldShowAll = null;
      this._oldMostRecent = null;
    }
  }, {
    key: "_reportParamsUpdated",

    /* Action to take (as a reaction) when report type, program id, or frequencyid change
     * contains logic for:
     *  - updating the program in the programstore (including api call if necessary)
     *  - making sure the new frequency is valid (and if not replacing with one that is)
     *  - updating start and end periods to make sense in the new frequency
     *  - clearing indicator filters
     */
    value: function _reportParamsUpdated(_ref) {
      var _this2 = this;

      var _ref2 = _slicedToArray(_ref, 3),
          reportType = _ref2[0],
          programId = _ref2[1],
          frequencyId = _ref2[2];

      this.programStore.loadProgram(reportType, programId, frequencyId).then(function () {
        var showAll = _this2.oldShowAll;
        var mostRecent = _this2.oldMostRecent;

        _this2.clearTransitionParams();

        _this2.frequencyId = _this2.frequencyId || null;

        if (!_this2._validFrequency(frequencyId)) {
          _this2.frequencyId = _this2.isTVA ? _this2.program.frequencies[0] : _constants__WEBPACK_IMPORTED_MODULE_1__["TIME_AWARE_FREQUENCIES"][0];
          _this2.showAll = true;
        }

        if (showAll) {
          _this2.showAll = true;
        } else if (mostRecent !== false) {
          _this2.mostRecent = mostRecent;
        } else {
          _this2.startPeriod = _this2.startPeriod || 0;
          _this2.endPeriod = _this2.endPeriod || _this2.lastPeriod.index;
        }

        if (_this2.reportType === _constants__WEBPACK_IMPORTED_MODULE_1__["TVA"] && _this2.indicators && _this2.indicators.length > 0) {
          _this2.indicators = [];
        }
      });
    }
    /* Whether the start and end period selectors are enabled */

  }, {
    key: "setStartPeriodFromDate",
    value: function setStartPeriodFromDate(dateObj) {
      if (this.periods) {
        this.startPeriod = this.periods.getPeriod({
          startAfter: dateObj
        }).index;
      }

      return null;
    }
  }, {
    key: "setEndPeriodFromDate",
    value: function setEndPeriodFromDate(dateObj) {
      if (this.periods) {
        this.endPeriod = this.periods.getPeriod({
          endBefore: dateObj
        }).index;
      }

      return null;
    }
    /* whether the program is using old-style (non-satsuma) levels */

  }, {
    key: "_getPeriodOptions",
    value: function _getPeriodOptions(periodFilter) {
      if (!this.frequencyId || !_constants__WEBPACK_IMPORTED_MODULE_1__["TIME_AWARE_FREQUENCIES"].includes(this.frequencyId)) {
        return [_constants__WEBPACK_IMPORTED_MODULE_1__["BLANK_OPTION"]];
      } else if (this.frequencyId == 3) {
        // years don't have year-based opt-groups:
        return this.periods.filter(periodFilter).map(function (period) {
          return {
            label: period.display,
            value: period.index
          };
        });
      } else {
        var periods = this.periods.filter(periodFilter); // all non-annual time-aware frequencies are opt-grouped by year:

        var years = Array.from(new Set(this.periods.filter(periodFilter).map(function (period) {
          return period.year;
        }))).filter(function (year) {
          return !isNaN(year);
        }).sort();
        return years.map(function (year) {
          var options = periods.filter(function (period) {
            return period.year === year;
          }).map(function (period) {
            return {
              label: period.display,
              value: period.index
            };
          });
          return {
            label: year,
            options: options
          };
        });
      }
    }
  }, {
    key: "filterIndicators",
    value: function filterIndicators(indicatorSet) {
      var _this3 = this;

      var skip = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var indicators = indicatorSet.sort(function (a, b) {
        return a.sortIndex - b.sortIndex;
      });

      if (this.groupByDisabled) {
        indicators = indicators.sort(function (a, b) {
          if (a.levelpk && b.levelpk) {
            if (a.levelpk != b.levelpk) {
              return a.levelpk < b.levelpk ? -1 : b.levelpk < a.levelpk ? 1 : 0;
            } else if (a.old_number && b.old_number) {
              return a.old_number < b.old_number ? -1 : b.old_number < a.old_number ? 1 : 0;
            } else if (a.old_number) {
              return -1;
            } else if (b.old_numbeR) {
              return 1;
            }

            return 0;
          } else if (a.levelpk) {
            return -1;
          } else if (b.levelpk) {
            return 1;
          }

          return 0;
        });
      }

      if (this.reportType === _constants__WEBPACK_IMPORTED_MODULE_1__["TVA"]) {
        indicators = indicators.filter(function (indicator) {
          return indicator.frequency == _this3.frequencyId;
        });
      }

      if (skip !== 'indicators' && this.indicators && this.indicators.length > 0) {
        indicators = indicators.filter(function (indicator) {
          return _this3.indicators.includes(indicator.pk);
        });
      }

      if (skip !== 'types' && this.types && this.types.length > 0) {
        indicators = indicators.filter(function (indicator) {
          return indicator.typePks.length > 0 && indicator.typePks.filter(function (pk) {
            return _this3.types.includes(pk);
          }).length > 0;
        });
      }

      if (skip !== 'sites' && this.sites && this.sites.length > 0) {
        indicators = indicators.filter(function (indicator) {
          return indicator.sitePks.length > 0 && indicator.sitePks.filter(function (pk) {
            return _this3.sites.includes(pk);
          }).length > 0;
        });
      }

      if (skip !== 'sectors' && this.sectors && this.sectors.length > 0) {
        indicators = indicators.filter(function (indicator) {
          return indicator.sectorPk && _this3.sectors.includes(indicator.sectorPk);
        });
      }

      if (skip !== 'levels' && this.levels && this.levels.length > 0) {
        if (this.groupByDisabled) {
          indicators = indicators.filter(function (indicator) {
            return indicator.level && _this3.levels.includes(indicator.levelpk);
          });
        } else {
          indicators = indicators.filter(function (indicator) {
            return indicator.level && (_this3.levels.includes(indicator.level.pk) || _this3.levels.includes(indicator.level._level2parent));
          });
        }
      } else if (skip !== 'levels' && this.tiers && this.tiers.length > 0) {
        indicators = indicators.filter(function (indicator) {
          return indicator.level && indicator.level.tierPk && _this3.tiers.includes(indicator.level.tierPk);
        });
      }

      return indicators || [];
    }
  }, {
    key: "filterLevels",
    value: function filterLevels() {
      var skip = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var levels = false;

      if (this.groupBy === _constants__WEBPACK_IMPORTED_MODULE_1__["GROUP_BY_LEVEL"]) {
        levels = this.program.levels.sort(function (levela, levelb) {
          return levela.sort - levelb.sort;
        }).sort(function (levela, levelb) {
          return levela.depth - levelb.depth;
        });
      } else if (this.groupBy === _constants__WEBPACK_IMPORTED_MODULE_1__["GROUP_BY_CHAIN"]) {
        var parents = this.program.levels.filter(function (level) {
          return !level._parent;
        });
        levels = this._findChildren(parents, []);
      }

      if (levels) {
        var levelPks;

        if (skip) {
          levelPks = new Set(this.filterIndicators(this.program.indicators, skip).map(function (indicator) {
            return indicator.levelpk;
          }));
        } else {
          levelPks = new Set(this.filteredIndicators.map(function (indicator) {
            return indicator.levelpk;
          }));
        }

        if (this.levels && this.levels.length > 0 || this.tiers && this.tiers.length > 0 || this.indicators && this.indicators.length > 0) {
          levels = levels.filter(function (level) {
            return levelPks.has(level.pk);
          });
        } else {
          levels = levels.filter(function (level) {
            return !level._parent || levelPks.has(level.pk);
          });
        }

        if (levels.length == 1 && !levelPks.has(levels[0].pk)) {
          return [];
        }

        return levels;
      }

      return [];
    }
  }, {
    key: "_findChildren",
    value: function _findChildren(parents) {
      var levels = [];

      for (var i = 0; i < parents.length; i++) {
        levels.push(parents[i]);

        if (parents[i].childLevels && parents[i].childLevels.length > 0) {
          levels = levels.concat(this._findChildren(parents[i].childLevels));
        }
      }

      return levels;
    }
  }, {
    key: "reportType",
    set: function set(reportType) {
      reportType = parseInt(reportType);

      if (reportType && [_constants__WEBPACK_IMPORTED_MODULE_1__["TVA"], _constants__WEBPACK_IMPORTED_MODULE_1__["TIMEPERIODS"]].includes(reportType)) {
        this._reportType = reportType;
      } else {
        this._reportType = null;
      }
    },
    get: function get() {
      return this._reportType;
    }
  }, {
    key: "isTVA",
    get: function get() {
      return this.reportType === _constants__WEBPACK_IMPORTED_MODULE_1__["TVA"];
    }
    /* returns a function which will check program IDs for validity given the report type:
     * - for timeperiods: does the program exist and have indicators
     * - for tva: does the program exist and have indicators in TVA frequencies
     */

  }, {
    key: "_validProgramId",
    get: function get() {
      return this.programStore.validProgramId(this._reportType);
    }
  }, {
    key: "programId",
    set: function set(programId) {
      programId = parseInt(programId);

      if (this._validProgramId(programId)) {
        this.updateTransitionParams();
        this._programId = programId;
      }
    },
    get: function get() {
      return this._programId;
    }
  }, {
    key: "program",
    get: function get() {
      if (this._programId !== null) {
        return this.programStore.getProgram(this._programId);
      }

      return null;
    }
    /* Whether the frequency selector is disabled */

  }, {
    key: "frequencyDisabled",
    get: function get() {
      return !(this.program !== null);
    }
    /* Internally checks if frequency is valid selection before saving
     *  - must be time-aware for Timeperiods report
     *  - must be a valid frequency for the program for TVA report
     */

  }, {
    key: "frequencyId",
    set: function set(frequencyId) {
      frequencyId = parseInt(frequencyId);

      if (this._validFrequency(frequencyId)) {
        this.updateTransitionParams();
        this._frequencyId = frequencyId;
      }
    },
    get: function get() {
      if (this._frequencyId) {
        return this._frequencyId;
      }

      return null;
    }
  }, {
    key: "programIsLoaded",
    get: function get() {
      if (this.frequencyId) {
        return this.program.isLoaded(this.reportType, this.frequencyId);
      }

      return false;
    }
  }, {
    key: "oldShowAll",
    get: function get() {
      return this._oldShowAll;
    }
  }, {
    key: "oldMostRecent",
    get: function get() {
      return this._oldMostRecent;
    }
  }, {
    key: "periodsDisabled",
    get: function get() {
      var ret = !_constants__WEBPACK_IMPORTED_MODULE_1__["TIME_AWARE_FREQUENCIES"].includes(this.frequencyId);
      return ret;
    }
    /* Returns all periods for the given program and frequency
     *   Note this returns a PeriodRange (see ./programStore.js for details)
     */

  }, {
    key: "periods",
    get: function get() {
      if (this.frequencyId && this.frequencyId !== 1) {
        return this.program.periodsFor(this.frequencyId);
      }

      return null;
    }
    /* Returns the last period for the current program/frequency (for setting end) */

  }, {
    key: "lastPeriod",
    get: function get() {
      if (this.frequencyId) {
        return this.program.lastPeriod(this.frequencyId);
      }

      return null;
    }
    /* "Current" here means most recently completed (for calculating most recent x periods) */

  }, {
    key: "currentPeriod",
    get: function get() {
      if (this.frequencyId) {
        return this.program.currentPeriod(this.frequencyId);
      }

      return null;
    }
  }, {
    key: "startPeriod",
    set: function set(startPeriod) {
      if (this.lastPeriod !== null) {
        this._startPeriod = Math.max(0, Math.min(this.lastPeriod.index, startPeriod));
        this._latchMostRecent = false;

        if (this.endPeriod && this._startPeriod > this.endPeriod) {
          this.endPeriod = startPeriod;
        }
      }
    },
    get: function get() {
      if (!this.periodsDisabled && this.lastPeriod !== null && this._startPeriod <= this.lastPeriod.index) {
        return this._startPeriod;
      }

      return null;
    }
  }, {
    key: "endPeriod",
    set: function set(endPeriod) {
      if (this.lastPeriod !== null) {
        this._endPeriod = Math.max(this.startPeriod || 0, Math.min(this.lastPeriod.index, endPeriod));
        this._latchMostRecent = false;
      }
    },
    get: function get() {
      if (!this.periodsDisabled && this.lastPeriod !== null && this._endPeriod <= this.lastPeriod.index) {
        return this._endPeriod;
      }

      return null;
    }
  }, {
    key: "showAll",
    set: function set(showAll) {
      if (showAll === true && this.lastPeriod) {
        this.startPeriod = 0;
        this.endPeriod = this.lastPeriod.index;
        this._latchMostRecent = false;
      }
    },
    get: function get() {
      return !this._latchMostRecent && this._internalShowAll;
    }
  }, {
    key: "_internalShowAll",
    get: function get() {
      return this.startPeriod === 0 && this.lastPeriod && this.endPeriod === this.lastPeriod.index;
    }
  }, {
    key: "mostRecent",
    set: function set(count) {
      if (this.currentPeriod) {
        this.endPeriod = this.currentPeriod.index;
        this.startPeriod = Math.max(0, this.currentPeriod.index - (parseInt(count) || 2) + 1);
        this._latchMostRecent = this._internalShowAll;
      }
    },
    get: function get() {
      if (!this.showAll && this.currentPeriod && this.endPeriod === this.currentPeriod.index) {
        return this.currentPeriod.index - this.startPeriod + 1;
      }

      return false;
    }
    /* Added so that the most recent display can bypass show-all logic and display a value */

  }, {
    key: "_mostRecentValue",
    get: function get() {
      if (this.currentPeriod && this.endPeriod === this.currentPeriod.index) {
        return this.currentPeriod.index - this.startPeriod + 1;
      }

      return false;
    }
  }, {
    key: "oldLevels",
    get: function get() {
      if (this.program !== null) {
        return this.program.oldLevels;
      }

      return null;
    }
  }, {
    key: "groupByDisabled",
    get: function get() {
      return this.oldLevels !== false;
    }
  }, {
    key: "groupBy",
    set: function set(groupBy) {
      if ([_constants__WEBPACK_IMPORTED_MODULE_1__["GROUP_BY_CHAIN"], _constants__WEBPACK_IMPORTED_MODULE_1__["GROUP_BY_LEVEL"]].includes(parseInt(groupBy))) {
        this._groupBy = parseInt(groupBy);
      }
    },
    get: function get() {
      if (!this.groupByDisabled) {
        return this._groupBy || _constants__WEBPACK_IMPORTED_MODULE_1__["GROUP_BY_CHAIN"];
      }

      return null;
    }
  }, {
    key: "resultChainFilterLabel",
    get: function get() {
      return this.program.resultChainFilterLabel;
    }
    /* whether the lower-half filters (which filter visible indicators) are enabled
     * Logic: they are enabled when the program is fully loaded for this frequency
     */

  }, {
    key: "filtersDisabled",
    get: function get() {
      return !this.programIsLoaded;
    }
    /* Levels = old-style levels (assigned pk manually in views_reports.py)
     * or new style levels (specific rf level items, i.e. Output 1.1) by pk
     */

  }, {
    key: "levels",
    set: function set(levels) {
      if (!this.filtersDisabled && Object(_general_utilities__WEBPACK_IMPORTED_MODULE_2__["ensureNumericArray"])(levels)) {
        this._levels = Object(_general_utilities__WEBPACK_IMPORTED_MODULE_2__["ensureNumericArray"])(levels);
        this._tiers = [];
      } else {
        this._levels = [];
      }
    },
    get: function get() {
      if (!this.filtersDisabled && this._levels && this._levels.length > 0) {
        return this._levels.filter(this.program.validLevel);
      }

      return [];
    }
    /* Tiers: only for new style levels, the leveltier (i.e. Outcome) */

  }, {
    key: "tiers",
    set: function set(tiers) {
      if (!this.filtersDisabled && !this.groupByDisabled && Object(_general_utilities__WEBPACK_IMPORTED_MODULE_2__["ensureNumericArray"])(tiers)) {
        this._tiers = Object(_general_utilities__WEBPACK_IMPORTED_MODULE_2__["ensureNumericArray"])(tiers);
        this._levels = [];
      } else {
        this._tiers = [];
      }
    },
    get: function get() {
      if (!this.filtersDisabled && this._tiers && this._tiers.length > 0 && !this.groupByDisabled) {
        return this._tiers.filter(this.program.validTier);
      }

      return [];
    }
  }, {
    key: "sites",
    set: function set(sites) {
      if (!this.filtersDisabled && Object(_general_utilities__WEBPACK_IMPORTED_MODULE_2__["ensureNumericArray"])(sites)) {
        this._sites = Object(_general_utilities__WEBPACK_IMPORTED_MODULE_2__["ensureNumericArray"])(sites);
      } else {
        this._sites = [];
      }
    },
    get: function get() {
      if (!this.filtersDisabled && this._sites && this._sites.length > 0) {
        return this._sites.filter(this.program.validSite);
      }

      return [];
    }
    /* "Types" as in Indicator Types (i.e. Custom/donor) */

  }, {
    key: "types",
    set: function set(types) {
      if (!this.filtersDisabled && Object(_general_utilities__WEBPACK_IMPORTED_MODULE_2__["ensureNumericArray"])(types)) {
        this._types = Object(_general_utilities__WEBPACK_IMPORTED_MODULE_2__["ensureNumericArray"])(types);
      } else {
        this._types = [];
      }
    },
    get: function get() {
      if (!this.filtersDisabled && this._types && this._types.length > 0) {
        return this._types.filter(this.program.validType);
      }

      return [];
    }
  }, {
    key: "sectors",
    set: function set(sectors) {
      if (!this.filtersDisabled && Object(_general_utilities__WEBPACK_IMPORTED_MODULE_2__["ensureNumericArray"])(sectors)) {
        this._sectors = Object(_general_utilities__WEBPACK_IMPORTED_MODULE_2__["ensureNumericArray"])(sectors);
      } else {
        this._sectors = [];
      }
    },
    get: function get() {
      if (!this.filtersDisabled && this._sectors && this._sectors.length > 0) {
        return this._sectors.filter(this.program.validSector);
      }

      return [];
    }
    /* setting indicator PKs for filtering ( show only those indicators) */

  }, {
    key: "indicators",
    set: function set(indicators) {
      if (!this.filtersDisabled && Object(_general_utilities__WEBPACK_IMPORTED_MODULE_2__["ensureNumericArray"])(indicators)) {
        this._indicators = Object(_general_utilities__WEBPACK_IMPORTED_MODULE_2__["ensureNumericArray"])(indicators);
      } else {
        this._indicators = [];
      }
    },
    get: function get() {
      if (!this.filtersDisabled && this._indicators && this._indicators.length > 0) {
        return this._indicators.filter(this.program.validIndicator);
      }

      return [];
    }
    /** OPTION providers for select widgets: ******/

  }, {
    key: "programOptions",
    get: function get() {
      var programs = this.reportType && this.programStore.getPrograms(this.reportType);
      return programs && programs.length > 0 ? programs.map(function (program) {
        return {
          value: program.pk,
          label: program.name
        };
      }) : [_constants__WEBPACK_IMPORTED_MODULE_1__["BLANK_OPTION"]];
    }
  }, {
    key: "selectedProgramOption",
    get: function get() {
      if (this.program) {
        return {
          value: this.programId,
          label: this.program.name
        };
      }

      return null;
    }
  }, {
    key: "frequencyOptions",
    get: function get() {
      if (this.program && this.reportType === _constants__WEBPACK_IMPORTED_MODULE_1__["TIMEPERIODS"]) {
        return _constants__WEBPACK_IMPORTED_MODULE_1__["TIME_AWARE_FREQUENCIES"].map(function (pk) {
          return {
            value: pk,
            label: timeperiodLabels[pk]
          };
        });
      } else if (this.program && this.reportType === _constants__WEBPACK_IMPORTED_MODULE_1__["TVA"]) {
        return this.program.frequencies.filter(function (pk) {
          return pk !== 8;
        }).map(function (pk) {
          return {
            value: pk,
            label: targetperiodLabels[pk]
          };
        });
      } else {
        return [_constants__WEBPACK_IMPORTED_MODULE_1__["BLANK_OPTION"]];
      }
    }
  }, {
    key: "selectedFrequencyOption",
    get: function get() {
      if (this.frequencyId) {
        return {
          value: this.frequencyId,
          label: this.isTVA ? targetperiodLabels[this.frequencyId] : timeperiodLabels[this.frequencyId]
        };
      } else {
        return _constants__WEBPACK_IMPORTED_MODULE_1__["BLANK_OPTION"];
      }
    }
  }, {
    key: "startOptions",
    get: function get() {
      return this._getPeriodOptions(function () {
        return true;
      });
    }
    /* Label for the date section under the title of the report */

  }, {
    key: "startPeriodLabel",
    get: function get() {
      if (this.startPeriod !== null) {
        return this.periods.getPeriod({
          index: this.startPeriod
        }).startDisplay;
      }

      if (this.frequencyId === 1 || this.frequencyId === 2) {
        return this.program.reportingStart;
      }

      return null;
    }
  }, {
    key: "endOptions",
    get: function get() {
      var _this4 = this;

      var periodFilter = function periodFilter(period) {
        return period.index >= _this4.startPeriod;
      };

      return this._getPeriodOptions(periodFilter);
    }
    /* Label for the date section under the title of the report */

  }, {
    key: "endPeriodLabel",
    get: function get() {
      if (this.endPeriod !== null) {
        return this.periods.getPeriod({
          index: this.endPeriod
        }).endDisplay;
      }

      if (this.frequencyId === 1 || this.frequencyId === 2) {
        return this.program.reportingEnd;
      }

      return null;
    }
  }, {
    key: "levelOptions",
    get: function get() {
      if (!this.filtersDisabled && this.groupByDisabled) {
        // old-style (non-RF) levels:
        var availableLevels = this.levels.concat(this.filterIndicators(this.program.indicators, 'levels').map(function (indicator) {
          return indicator.level ? indicator.level.pk : null;
        }));
        return this.program.levels.filter(function (level) {
          return availableLevels.includes(level.pk);
        }).sort(function (x, y) {
          return x.pk - y.pk;
        }).map(function (level) {
          return {
            value: level.pk,
            label: level.name,
            filterType: 'level'
          };
        });
      } else if (!this.filtersDisabled) {
        // new style levels and leveltiers:
        var availableTiers = this.tiers.concat(this.filterIndicators(this.program.indicators, 'levels').map(function (indicator) {
          return indicator.level ? indicator.level.tierPk : null;
        }));
        var tiers = this.program.tiers.filter(function (tier) {
          return availableTiers.includes(tier.pk);
        });

        var _availableLevels = Object(_general_utilities__WEBPACK_IMPORTED_MODULE_2__["flattenArray"])(this.levels.concat(this.filterIndicators(this.program.indicators, 'levels').map(function (indicator) {
          return indicator.level ? [indicator.level.pk, indicator.level._level2parent] : [];
        })));

        var levels = this.program.levels.filter(function (level) {
          return _availableLevels.includes(level.pk);
        });
        var options = [];

        if (tiers && tiers.length > 0) {
          options.push({
            label: '',
            options: tiers.sort(function (x, y) {
              return x.depth - y.depth;
            }).map(function (tier) {
              return {
                value: tier.pk,
                label: tier.name,
                filterType: 'tier'
              };
            })
          });
        }

        if (levels && levels.length > 0) {
          options.push({
            label: this.program.shortResultChainLabel,
            options: levels.filter(function (level) {
              return level.tier.depth == 2;
            }).map(function (level) {
              return {
                value: level.pk,
                label: level.outcomeChainDisplay,
                filterType: 'level'
              };
            })
          });
        }

        return options;
      }

      return null;
    }
  }, {
    key: "levelsSelected",
    get: function get() {
      var _this5 = this;

      if (this.levels && this.levels.length > 0) {
        return this.program.levels.filter(function (level) {
          return _this5.levels.includes(level.pk);
        }).map(function (level) {
          return {
            value: level.pk,
            label: level.name,
            filterType: 'level'
          };
        });
      }

      return [];
    }
  }, {
    key: "tiersSelected",
    get: function get() {
      var _this6 = this;

      if (this.tiers && this.tiers.length > 0) {
        return this.program.tiers.filter(function (tier) {
          return _this6.tiers.includes(tier.pk);
        }).map(function (tier) {
          return {
            value: tier.pk,
            label: tier.name,
            filterType: 'tier'
          };
        });
      }

      return [];
    }
  }, {
    key: "typeOptions",
    get: function get() {
      if (!this.filtersDisabled) {
        var availableTypes = Object(_general_utilities__WEBPACK_IMPORTED_MODULE_2__["flattenArray"])(this.types.concat(this.filterIndicators(this.program.indicators, 'types').map(function (indicator) {
          return indicator.typePks;
        })));
        return this.program.types.filter(function (iType) {
          return availableTypes.includes(iType.pk);
        }).map(function (iType) {
          return {
            value: iType.pk,
            label: iType.name
          };
        });
      }

      return null;
    }
  }, {
    key: "typesSelected",
    get: function get() {
      var _this7 = this;

      if (this.types && this.types.length > 0) {
        return this.typeOptions.filter(function (typeOpt) {
          return _this7.types.includes(typeOpt.value);
        });
      }

      return [];
    }
  }, {
    key: "sectorOptions",
    get: function get() {
      if (!this.filtersDisabled) {
        var availableSectors = this.sectors.concat(this.filterIndicators(this.program.indicators, 'sectors').map(function (indicator) {
          return indicator.sectorPk;
        }));
        return this.program.sectors.filter(function (sector) {
          return availableSectors.includes(sector.pk);
        }).map(function (sector) {
          return {
            value: sector.pk,
            label: sector.name
          };
        });
      }

      return null;
    }
  }, {
    key: "sectorsSelected",
    get: function get() {
      var _this8 = this;

      if (this.sectors && this.sectors.length > 0) {
        return this.sectorOptions.filter(function (sector) {
          return _this8.sectors.includes(sector.value);
        });
      }

      return [];
    }
  }, {
    key: "siteOptions",
    get: function get() {
      if (!this.filtersDisabled) {
        var availableSites = this.sites.concat(Object(_general_utilities__WEBPACK_IMPORTED_MODULE_2__["flattenArray"])(this.filterIndicators(this.program.indicators, 'sites').map(function (indicator) {
          return indicator.sitePks;
        })));
        return this.program.sites.filter(function (site) {
          return availableSites.includes(site.pk);
        }).map(function (site) {
          return {
            value: site.pk,
            label: site.name
          };
        });
      }

      return null;
    }
  }, {
    key: "sitesSelected",
    get: function get() {
      var _this9 = this;

      if (this.sites && this.sites.length > 0) {
        return this.siteOptions.filter(function (site) {
          return _this9.sites.includes(site.value);
        });
      }

      return [];
    }
  }, {
    key: "indicatorOptions",
    get: function get() {
      var _this10 = this;

      if (!this.filtersDisabled) {
        if (this.groupByDisabled) {
          return this.filterIndicators(this.program.indicators, 'indicators').map(function (indicator) {
            return {
              value: indicator.pk,
              label: indicator.name
            };
          });
        } else {
          return this.filterLevels('indicators').map(function (level) {
            return {
              label: "".concat(level.tier.name, " ").concat(level.sortDisplay),
              options: _this10.filterIndicators(level.indicators, 'indicators').map(function (indicator) {
                return {
                  value: indicator.pk,
                  label: "".concat(indicator.number || '', " ").concat(indicator.name)
                };
              })
            };
          }).concat([{
            label: gettext('Indicators unassigned to a results framework level'),
            options: this.filterIndicators(this.program.unassignedIndicators, 'indicators').map(function (indicator) {
              return {
                value: indicator.pk,
                label: indicator.name
              };
            })
          }]).filter(function (_ref3) {
            var label = _ref3.label,
                options = _ref3.options;
            return options && options.length > 0;
          });
        }
      }

      return [];
    }
  }, {
    key: "indicatorsSelected",
    get: function get() {
      var _this11 = this;

      if (this.indicators && this.indicators.length > 0) {
        var indicatorOptions = this.groupByDisabled ? this.indicatorOptions : Object(_general_utilities__WEBPACK_IMPORTED_MODULE_2__["flattenArray"])(this.indicatorOptions.map(function (optgroup) {
          return optgroup.options;
        }));
        return indicatorOptions.filter(function (indicator) {
          return _this11.indicators.includes(indicator.value);
        });
      }

      return [];
    }
  }, {
    key: "noFilters",

    /* whether this is in an unfiltered state */
    get: function get() {
      return (!this.indicators || this.indicators.length == 0) && (!this.types || this.types.length == 0) && (!this.levels || this.levels.length == 0) && (!this.tiers || this.tiers.length == 0) && (!this.sectors || this.sectors.length == 0) && (!this.sites || this.sites.length == 0);
    }
  }, {
    key: "programPageUrl",
    get: function get() {
      if (this.program) {
        return this.program.programPageUrl;
      }

      return false;
    }
  }, {
    key: "filteredIndicators",
    get: function get() {
      return this.filterIndicators(this.program.indicators);
    }
  }, {
    key: "filteredLevels",
    get: function get() {
      return this.filterLevels(false);
    }
  }]);

  return FilterStore;
}(), _temp), (_descriptor = _applyDecoratedDescriptor(_class.prototype, "_reportType", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "_programId", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, "_frequencyId", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, "_startPeriod", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class.prototype, "_endPeriod", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class.prototype, "_groupBy", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class.prototype, "_levels", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class.prototype, "_tiers", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor9 = _applyDecoratedDescriptor(_class.prototype, "_sites", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor10 = _applyDecoratedDescriptor(_class.prototype, "_sectors", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor11 = _applyDecoratedDescriptor(_class.prototype, "_types", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor12 = _applyDecoratedDescriptor(_class.prototype, "_indicators", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor13 = _applyDecoratedDescriptor(_class.prototype, "_latchMostRecent", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _applyDecoratedDescriptor(_class.prototype, "reportType", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "reportType"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "isTVA", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "isTVA"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "_validProgramId", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "_validProgramId"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "programId", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "programId"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "program", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "program"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "frequencyDisabled", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "frequencyDisabled"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "frequencyId", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "frequencyId"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "programIsLoaded", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "programIsLoaded"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "_reportParamsUpdated", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "_reportParamsUpdated"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "periodsDisabled", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "periodsDisabled"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "periods", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "periods"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "lastPeriod", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "lastPeriod"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "currentPeriod", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "currentPeriod"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "startPeriod", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "startPeriod"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "endPeriod", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "endPeriod"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "_internalShowAll", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "_internalShowAll"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "showAll", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "showAll"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "mostRecent", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "mostRecent"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "_mostRecentValue", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "_mostRecentValue"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "oldLevels", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "oldLevels"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "groupByDisabled", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "groupByDisabled"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "groupBy", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "groupBy"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "resultChainFilterLabel", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "resultChainFilterLabel"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "filtersDisabled", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "filtersDisabled"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "levels", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "levels"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "tiers", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "tiers"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "sites", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "sites"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "types", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "types"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "sectors", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "sectors"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "indicators", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "indicators"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "programOptions", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "programOptions"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "selectedProgramOption", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "selectedProgramOption"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "frequencyOptions", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "frequencyOptions"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "selectedFrequencyOption", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "selectedFrequencyOption"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "startOptions", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "startOptions"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "startPeriodLabel", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "startPeriodLabel"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "endOptions", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "endOptions"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "endPeriodLabel", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "endPeriodLabel"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "levelOptions", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "levelOptions"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "levelsSelected", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "levelsSelected"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "tiersSelected", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "tiersSelected"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "typeOptions", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "typeOptions"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "typesSelected", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "typesSelected"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "sectorOptions", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "sectorOptions"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "sectorsSelected", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "sectorsSelected"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "siteOptions", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "siteOptions"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "sitesSelected", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "sitesSelected"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "indicatorOptions", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "indicatorOptions"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "indicatorsSelected", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "indicatorsSelected"), _class.prototype), _descriptor14 = _applyDecoratedDescriptor(_class.prototype, "clearFilters", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this12 = this;

    return function () {
      _this12.sectors = [];
      _this12.types = [];
      _this12.sites = [];
      _this12.indicators = [];
      _this12.levels = [];
      _this12.tiers = [];
    };
  }
}), _applyDecoratedDescriptor(_class.prototype, "noFilters", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "noFilters"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "programPageUrl", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "programPageUrl"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "filteredIndicators", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "filteredIndicators"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "filteredLevels", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "filteredLevels"), _class.prototype), _descriptor15 = _applyDecoratedDescriptor(_class.prototype, "indicatorUpdate", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this13 = this;

    return function (ev, _ref4) {
      var programId = _ref4.programId,
          indicatorId = _ref4.indicatorId,
          params = _objectWithoutProperties(_ref4, ["programId", "indicatorId"]);

      if (programId && programId == _this13.programId) {
        _this13.programStore.updateIndicator(_this13.reportType, programId, _this13.frequencyId, indicatorId);
      }
    };
  }
}), _descriptor16 = _applyDecoratedDescriptor(_class.prototype, "indicatorDelete", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this14 = this;

    return function (ev, _ref5) {
      var programId = _ref5.programId,
          indicatorId = _ref5.indicatorId,
          params = _objectWithoutProperties(_ref5, ["programId", "indicatorId"]);

      if (programId && programId == _this14.programId) {
        _this14.programStore.removeIndicator(programId, indicatorId);
      }
    };
  }
})), _class);


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



var IPTTSidebar = function IPTTSidebar() {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "sidebar_wrapper"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "collapse width show",
    id: "sidebar"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_filterForm__WEBPACK_IMPORTED_MODULE_1__["default"], null)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "sidebar-toggle"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
    href: "#",
    "data-target": "#sidebar",
    "data-toggle": "collapse",
    title:
    /* # Translators: A toggle button that hides a sidebar of filter options */
    gettext('Show/Hide Filters')
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
    className: "fa fa-chevron-left"
  }))));
};

/* harmony default export */ __webpack_exports__["default"] = (IPTTSidebar);

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
/* harmony import */ var _headerCells__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./headerCells */ "/u1a");



var ProgramNameRow = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('reportStore')(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref) {
  var reportStore = _ref.reportStore;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
    className: "title-row"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
    colSpan: reportStore.levelColumn ? 9 : 8,
    id: "id_td_iptt_program_name",
    className: "align-bottom pt-2"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h5", {
    className: "m-0"
  }, reportStore.programName)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
    scope: "colgroup",
    colSpan: "3",
    className: "text-center title-row text-nowrap align-bottom text-uppercase"
  },
  /* # Translators: header for a group of columns showing totals over the life of the program */
  gettext('Life of program')), reportStore.reportPeriods.map(function (period, index) {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_headerCells__WEBPACK_IMPORTED_MODULE_2__["PeriodHeader"], {
      isTVA: reportStore.isTVA,
      key: index,
      period: period
    });
  }));
}));
var ColumnHeaderRow = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('reportStore')(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref2) {
  var reportStore = _ref2.reportStore;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_headerCells__WEBPACK_IMPORTED_MODULE_2__["BorderedHeader"], {
    styleWidth: 110,
    align: "center",
    label:
    /* # Translators: Abbreviation as column header for "number" column */
    gettext('No.')
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_headerCells__WEBPACK_IMPORTED_MODULE_2__["UnBorderedHeader"], {
    styleWidth: 600,
    label:
    /* # Translators: Column header for indicator Name column */
    gettext('Indicator')
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_headerCells__WEBPACK_IMPORTED_MODULE_2__["UnBorderedHeader"], null), reportStore.levelColumn && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_headerCells__WEBPACK_IMPORTED_MODULE_2__["BorderedHeader"], {
    styleWidth: 90,
    label:
    /* # Translators: Column header for indicator Level name column */
    gettext('Level')
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_headerCells__WEBPACK_IMPORTED_MODULE_2__["BorderedHeader"], {
    styleWidth: 250,
    label:
    /* # Translators: Column header */
    gettext('Unit of measure')
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_headerCells__WEBPACK_IMPORTED_MODULE_2__["BorderedHeader"], {
    label:
    /* # Translators: Column header for "direction of change" column (increasing/decreasing) */
    gettext('Change')
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_headerCells__WEBPACK_IMPORTED_MODULE_2__["BorderedHeader"], {
    styleWidth: 130,
    label:
    /* # Translators: Column header, stands for "Cumulative"/"Non-cumulative" */
    gettext('C / NC')
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_headerCells__WEBPACK_IMPORTED_MODULE_2__["BorderedHeader"], {
    styleWidth: 50,
    label:
    /* # Translators: Column header, numeric or percentage type indicator */
    gettext('# / %')
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_headerCells__WEBPACK_IMPORTED_MODULE_2__["BorderedHeader"], {
    label:
    /* # Translators: Column header */
    gettext('Baseline')
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_headerCells__WEBPACK_IMPORTED_MODULE_2__["TVAHeader"], null), reportStore.reportPeriods.map(function (period, index) {
    return reportStore.isTVA ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_headerCells__WEBPACK_IMPORTED_MODULE_2__["TVAHeader"], {
      key: index
    }) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_headerCells__WEBPACK_IMPORTED_MODULE_2__["ActualHeader"], {
      key: index
    });
  }));
}));

var ReportTableHeader = function ReportTableHeader() {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("thead", {
    className: "thead-light"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ProgramNameRow, null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ColumnHeaderRow, null));
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
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_reportSelect__WEBPACK_IMPORTED_MODULE_2__["ProgramSelect"], null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_reportSelect__WEBPACK_IMPORTED_MODULE_2__["FrequencySelect"], null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_reportSelect__WEBPACK_IMPORTED_MODULE_2__["TimeframeRadio"], null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_reportSelect__WEBPACK_IMPORTED_MODULE_2__["StartDateSelect"], null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_reportSelect__WEBPACK_IMPORTED_MODULE_2__["EndDateSelect"], null), filterStore.oldLevels === false && filterStore.resultChainFilterLabel !== false && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_reportSelect__WEBPACK_IMPORTED_MODULE_2__["GroupingSelect"], null));
}));

var FilterMiddle = function FilterMiddle() {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_reportFilter__WEBPACK_IMPORTED_MODULE_3__["LevelSelect"], null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_reportFilter__WEBPACK_IMPORTED_MODULE_3__["SiteSelect"], null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_reportFilter__WEBPACK_IMPORTED_MODULE_3__["TypeSelect"], null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_reportFilter__WEBPACK_IMPORTED_MODULE_3__["SectorSelect"], null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_reportFilter__WEBPACK_IMPORTED_MODULE_3__["IndicatorSelect"], null));
};

var IPTTFilterForm = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('filterStore')(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref2) {
  var filterStore = _ref2.filterStore;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("nav", {
    id: "id_iptt_report_filter"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "p-3",
    id: "filter-top"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h3", {
    className: "filter-title text-title-case"
  },
  /* # Translators: Labels a set of filters to select which data to show */
  gettext('Report Options')), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(FilterTop, null)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    id: "filter-middle",
    className: "px-3 pt-3 pb-2"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(FilterMiddle, null)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    id: "filter-bottom"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_buttons__WEBPACK_IMPORTED_MODULE_4__["IPTTButton"], {
    label:
    /* # Translators: clears all filters set on a report */
    gettext('Clear filters'),
    action: filterStore.clearFilters,
    isDisabled: filterStore.noFilters
  })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    id: "filter-extra",
    className: " d-flex justify-content-between no-gutters p-3"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
    href: "/tola_management/audit_log/" + filterStore.programId,
    className: "btn-link"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
    className: "fas fa-history"
  }), " ", gettext("Change log"))));
}));
/* harmony default export */ __webpack_exports__["default"] = (IPTTFilterForm);

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

/***/ "XGqG":
/*!****************************************!*\
  !*** ./js/pages/iptt_report/router.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ipttRouter; });
/* harmony import */ var router5__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! router5 */ "wgi2");
/* harmony import */ var router5_plugin_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! router5-plugin-browser */ "0pHI");
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mobx */ "2vnA");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../constants */ "v38i");
var _class, _temp;

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object['ke' + 'ys'](descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object['define' + 'Property'](target, property, desc); desc = null; } return desc; }





var ipttRouter = (_class = (_temp =
/*#__PURE__*/
function () {
  function ipttRouter(filterStore, jsContext) {
    var _this = this;

    _classCallCheck(this, ipttRouter);

    this.filterStore = null;

    this.init = function () {
      _this.router = Object(router5__WEBPACK_IMPORTED_MODULE_0__["default"])(_this.routes, {
        trailingSlashMode: 'always'
      });

      _this.router.setRootPath(_this.queryParams);

      _this.router.usePlugin(Object(router5_plugin_browser__WEBPACK_IMPORTED_MODULE_1__["default"])({
        useHash: false,
        base: '/indicators'
      }));

      _this.router.start();

      var _this$router$getState = _this.router.getState(),
          currentRouteName = _this$router$getState.name,
          currentRouteParams = _this$router$getState.params;

      _this.processParams(_objectSpread({
        name: currentRouteName
      }, currentRouteParams)).then(function () {
        if (_this.router.buildPath(currentRouteName, currentRouteParams) != _this.router.buildPath(_this.routeName, _this.routeParams)) {
          _this.router.navigate(_this.routeName, _this.routeParams, {
            replace: true
          });
        }

        var navigateWhenRouteChanges = Object(mobx__WEBPACK_IMPORTED_MODULE_2__["reaction"])(function () {
          return [_this.routeName, _this.routeParams];
        }, function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
              name = _ref2[0],
              params = _ref2[1];

          return _this.router.navigate(name, params);
        });
      });
    };

    this.processParams = function () {
      var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref3$name = _ref3.name,
          name = _ref3$name === void 0 ? null : _ref3$name,
          _ref3$programId = _ref3.programId,
          programId = _ref3$programId === void 0 ? null : _ref3$programId,
          _ref3$frequency = _ref3.frequency,
          frequency = _ref3$frequency === void 0 ? null : _ref3$frequency,
          _ref3$start = _ref3.start,
          start = _ref3$start === void 0 ? null : _ref3$start,
          _ref3$end = _ref3.end,
          end = _ref3$end === void 0 ? null : _ref3$end,
          _ref3$mr = _ref3.mr,
          mr = _ref3$mr === void 0 ? null : _ref3$mr,
          _ref3$timeperiods = _ref3.timeperiods,
          timeperiods = _ref3$timeperiods === void 0 ? null : _ref3$timeperiods,
          _ref3$targetperiods = _ref3.targetperiods,
          targetperiods = _ref3$targetperiods === void 0 ? null : _ref3$targetperiods,
          _ref3$timeframe = _ref3.timeframe,
          timeframe = _ref3$timeframe === void 0 ? null : _ref3$timeframe,
          _ref3$numrecentcount = _ref3.numrecentcount,
          numrecentcount = _ref3$numrecentcount === void 0 ? null : _ref3$numrecentcount,
          _ref3$numrecentperiod = _ref3.numrecentperiods,
          numrecentperiods = _ref3$numrecentperiod === void 0 ? null : _ref3$numrecentperiod,
          _ref3$start_period = _ref3.start_period,
          start_period = _ref3$start_period === void 0 ? null : _ref3$start_period,
          _ref3$end_period = _ref3.end_period,
          end_period = _ref3$end_period === void 0 ? null : _ref3$end_period,
          _ref3$groupby = _ref3.groupby,
          groupby = _ref3$groupby === void 0 ? null : _ref3$groupby,
          _ref3$levels = _ref3.levels,
          levels = _ref3$levels === void 0 ? null : _ref3$levels,
          _ref3$tiers = _ref3.tiers,
          tiers = _ref3$tiers === void 0 ? null : _ref3$tiers,
          _ref3$sites = _ref3.sites,
          sites = _ref3$sites === void 0 ? null : _ref3$sites,
          _ref3$sectors = _ref3.sectors,
          sectors = _ref3$sectors === void 0 ? null : _ref3$sectors,
          _ref3$types = _ref3.types,
          types = _ref3$types === void 0 ? null : _ref3$types,
          _ref3$indicators = _ref3.indicators,
          indicators = _ref3$indicators === void 0 ? null : _ref3$indicators;

      if (_this.filterStore === null) {
        throw "data not loaded";
      }

      _this.filterStore.reportType = name == 'iptt.tva' ? _constants__WEBPACK_IMPORTED_MODULE_3__["TVA"] : name == 'iptt.timeperiods' ? _constants__WEBPACK_IMPORTED_MODULE_3__["TIMEPERIODS"] : null;
      _this.filterStore.programId = parseInt(programId);

      if (frequency !== null) {
        _this.filterStore.frequencyId = parseInt(frequency);
      } else if (_this.reportType === _constants__WEBPACK_IMPORTED_MODULE_3__["TVA"] && targetperiods !== null) {
        _this.filterStore.frequencyId = parseInt(targetperiods);
      } else if (_this.reportType === _constants__WEBPACK_IMPORTED_MODULE_3__["TIMEPERIODS"] && timeperiods !== null) {
        _this.filterStore.frequencyId = parseInt(timeperiods);
      }

      if (start !== null) {
        _this.filterStore.startPeriod = parseInt(start);
      } else if (start_period !== null && !isNaN(Date.parse(start_period))) {
        _this.filterStore.setStartPeriodFromDate(new Date(start_period));
      }

      if (end !== null) {
        _this.filterStore.endPeriod = parseInt(end);
      } else if (end_period !== null && !isNaN(Date.parse(end_period))) {
        _this.filterStore.setEndPeriodFromDate(new Date(end_period));
      }

      if (mr !== null) {
        _this.filterStore._latchMostRecent = true;
      }

      if (timeframe !== null && parseInt(timeframe) == 1) {
        _this.filterStore.showAll = true;
      } else if (timeframe !== null && parseInt(timeframe) == 2) {
        _this.filterStore.mostRecent = parseInt(numrecentperiods) || parseInt(numrecentcount) || 2;
      }

      if (groupby !== null && (parseInt(groupby) === _constants__WEBPACK_IMPORTED_MODULE_3__["GROUP_BY_CHAIN"] || parseInt(groupby) === _constants__WEBPACK_IMPORTED_MODULE_3__["GROUP_BY_LEVEL"])) {
        _this.filterStore.groupBy = parseInt(groupby);
      }

      return _this.filterStore.getLoadedProgram().then(function () {
        if (levels !== null) {
          tiers = null;
          _this.filterStore.levels = _this.parseArrayParams(levels);
        }

        if (tiers !== null) {
          _this.filterStore.tiers = _this.parseArrayParams(tiers);
        }

        if (types !== null) {
          _this.filterStore.types = _this.parseArrayParams(types);
        }

        if (sites !== null) {
          _this.filterStore.sites = _this.parseArrayParams(sites);
        }

        if (sectors !== null) {
          _this.filterStore.sectors = _this.parseArrayParams(sectors);
        }

        if (indicators !== null) {
          _this.filterStore.indicators = _this.parseArrayParams(indicators);
        }

        return true;
      }, function () {
        return false;
      });
    };

    this.parseArrayParams = function (param) {
      if (typeof param === 'string' || param instanceof String) {
        return [parseInt(param)];
      } else if (Array.isArray(param)) {
        return param.map(function (p) {
          return parseInt(p);
        });
      } else if (Number.isInteger(param)) {
        return param;
      } else if (!isNaN(parseInt(param))) {
        return [parseInt(param)];
      }

      return null;
    };

    this.parseToArrayParams = function (param) {
      if (Array.isArray(param)) {
        return param.map(_this.parseToArrayParams);
      } else if (typeof param === 'string' || param instanceof String) {
        return param;
      }

      return String(param);
    };

    if (jsContext && jsContext.pin_url) {
      this.pinUrl = jsContext.pin_url;
    }

    this.routes = [{
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
      name: 'ipttAPI',
      path: '/iptt_api?reportType&programId',
      children: [{
        name: 'ipttData',
        path: '/iptt_report_data/'
      }, {
        name: 'ipttExcel',
        path: '/iptt_excel/?fullTVA'
      }]
    }];
    this.goodQueryParams = ['frequency', 'start', 'end', 'levels', 'types', 'sites', 'sectors', 'indicators', 'tiers', 'groupby', 'mr'];
    this.oldQueryParams = ['timeframe', 'numrecentperiods', 'numrecentcount', 'start_period', 'end_period'];
    this.queryParams = '?' + this.goodQueryParams.concat(this.oldQueryParams).join('&');
    this.filterStore = filterStore;
  }

  _createClass(ipttRouter, [{
    key: "reportType",
    get: function get() {
      return this.filterStore.reportType;
    }
  }, {
    key: "routeName",
    get: function get() {
      return this.reportType === _constants__WEBPACK_IMPORTED_MODULE_3__["TVA"] ? 'iptt.tva' : this.reportType === _constants__WEBPACK_IMPORTED_MODULE_3__["TIMEPERIODS"] ? 'iptt.timeperiods' : 'iptt';
    }
  }, {
    key: "routeParams",
    get: function get() {
      var _this2 = this;

      var params = {};
      var keys = ['programId', 'levels', 'tiers', 'sectors', 'sites', 'types', 'indicators'];
      keys.forEach(function (k) {
        if (_this2.filterStore[k] !== null) {
          params[k] = _this2.parseToArrayParams(_this2.filterStore[k]);
        }
      });

      if (this.filterStore.frequencyId !== null) {
        params.frequency = String(this.filterStore.frequencyId);
      }

      if (this.filterStore.startPeriod !== null) {
        params.start = String(this.filterStore.startPeriod);
      }

      if (this.filterStore.endPeriod !== null) {
        params.end = String(this.filterStore.endPeriod);
      }

      if (this.filterStore.groupBy !== null) {
        params.groupby = String(this.filterStore.groupBy);
      }

      return params;
    }
  }, {
    key: "pinData",
    get: function get() {
      var _this$routeParams = this.routeParams,
          programId = _this$routeParams.programId,
          params = _objectWithoutProperties(_this$routeParams, ["programId"]);

      var reportType = this.reportType === _constants__WEBPACK_IMPORTED_MODULE_3__["TVA"] ? 'targetperiods' : this.reportType === _constants__WEBPACK_IMPORTED_MODULE_3__["TIMEPERIODS"] ? 'timeperiods' : null;
      var queryString = [];
      Object.keys(params).forEach(function (k) {
        if (params[k]) {
          if (!Array.isArray(params[k])) {
            queryString.push([k, params[k]]);
          } else if (params[k].length == 1) {
            queryString.push([k, params[k][0]]);
          } else {
            params[k].forEach(function (v) {
              queryString.push([k, v]);
            });
          }
        }
      });

      if (this.filterStore._latchMostRecent && this.filterStore._internalShowAll) {
        queryString.push(['mr', 1]);
      }

      return {
        program: programId,
        report_type: reportType,
        query_string: queryString.map(function (_ref4) {
          var _ref5 = _slicedToArray(_ref4, 2),
              k = _ref5[0],
              v = _ref5[1];

          return "".concat(k, "=").concat(v);
        }).join('&')
      };
    }
  }, {
    key: "dataUrl",
    get: function get() {
      return this.router.buildUrl('ipttAPI.ipttData', this.routeParams);
    }
  }, {
    key: "excelUrl",
    get: function get() {
      if (this.filterStore.frequencyId) {
        return this.router.buildUrl('ipttAPI.ipttExcel', _objectSpread({}, this.routeParams, {
          reportType: this.reportType,
          fullTVA: false
        }));
      }

      return false;
    }
  }, {
    key: "fullExcelUrl",
    get: function get() {
      if (this.filterStore.isTVA && this.filterStore.programId) {
        return this.router.buildUrl('ipttAPI.ipttExcel', {
          programId: this.filterStore.programId,
          fullTVA: true,
          groupby: this.filterStore.groupBy
        });
      }

      return false;
    }
  }]);

  return ipttRouter;
}(), _temp), (_applyDecoratedDescriptor(_class.prototype, "reportType", [mobx__WEBPACK_IMPORTED_MODULE_2__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "reportType"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "routeName", [mobx__WEBPACK_IMPORTED_MODULE_2__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "routeName"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "routeParams", [mobx__WEBPACK_IMPORTED_MODULE_2__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "routeParams"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "pinData", [mobx__WEBPACK_IMPORTED_MODULE_2__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "pinData"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "dataUrl", [mobx__WEBPACK_IMPORTED_MODULE_2__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "dataUrl"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "excelUrl", [mobx__WEBPACK_IMPORTED_MODULE_2__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "excelUrl"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "fullExcelUrl", [mobx__WEBPACK_IMPORTED_MODULE_2__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "fullExcelUrl"), _class.prototype)), _class);


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
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
    type: "reset",
    className: "btn btn-block btn-reset" + (props.isDisabled ? " disabled" : ""),
    onClick: props.action
  }, props.label);
};

/***/ }),

/***/ "YYuc":
/*!*********************************************************!*\
  !*** ./js/pages/iptt_report/components/report/table.js ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _tableHeader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tableHeader */ "UCRK");
/* harmony import */ var _tableBody__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tableBody */ "eLjl");




var IPTTTable = function IPTTTable() {
  //return (
  //    <table className="table table-sm table-bordered table-hover table__iptt" id="iptt_table">
  //        <IPTTTableHead />
  //        <IPTTTableBody />
  //    </table>
  //    );
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("table", {
    className: "table table-sm table-bordered table-hover table__iptt",
    id: "iptt_table"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_tableHeader__WEBPACK_IMPORTED_MODULE_1__["default"], null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_tableBody__WEBPACK_IMPORTED_MODULE_2__["default"], null));
};

/* harmony default export */ __webpack_exports__["default"] = (IPTTTable);

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



var ReportTableBody = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('reportStore')(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref) {
  var reportStore = _ref.reportStore;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tbody", null, reportStore.levelRows ? reportStore.groupedIndicatorRows.map(function (_ref2, index) {
    var level = _ref2.level,
        indicators = _ref2.indicators;
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_tableRows__WEBPACK_IMPORTED_MODULE_2__["LevelGroup"], {
      level: level,
      indicators: indicators,
      key: index
    });
  }) : reportStore.indicatorRows.map(function (indicator, index) {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_tableRows__WEBPACK_IMPORTED_MODULE_2__["IndicatorRow"], {
      indicator: indicator,
      levelCol: reportStore.levelColumn,
      key: index
    });
  }));
}));
/* harmony default export */ __webpack_exports__["default"] = (ReportTableBody);

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
/* harmony import */ var _router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./router */ "XGqG");
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./api */ "wKB/");
/* harmony import */ var _models_programStore__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./models/programStore */ "B3lr");
/* harmony import */ var _models_filterStore__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./models/filterStore */ "N38U");
/* harmony import */ var _models_reportStore__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./models/reportStore */ "sJKi");
/* harmony import */ var _components_main__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/main */ "2et8");
/**
 * entry point for the iptt_report webpack bundle
 */









var API = new _api__WEBPACK_IMPORTED_MODULE_4__["default"](jsContext.api_url);
var dataStore = new _models_programStore__WEBPACK_IMPORTED_MODULE_5__["default"](jsContext, API);
var filterStore = new _models_filterStore__WEBPACK_IMPORTED_MODULE_6__["default"](dataStore);
var reportStore = new _models_reportStore__WEBPACK_IMPORTED_MODULE_7__["default"](filterStore);
var routeStore = new _router__WEBPACK_IMPORTED_MODULE_3__["default"](filterStore, jsContext);
routeStore.init();
react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(mobx_react__WEBPACK_IMPORTED_MODULE_2__["Provider"], {
  filterStore: filterStore,
  routeStore: routeStore,
  reportStore: reportStore
}, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_main__WEBPACK_IMPORTED_MODULE_8__["default"], null)), document.querySelector('#id_div_content'));

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



var IPTTHeader = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('filterStore')(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref) {
  var filterStore = _ref.filterStore;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "page-subheader"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    id: "id_span_iptt_date_range",
    className: "subheader__title"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", {
    className: "pt-3 text-title-case"
  }, gettext('Indicator Performance Tracking Table')), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h4", {
    className: "pb-3"
  }, filterStore.startPeriodLabel && filterStore.endPeriodLabel ? filterStore.startPeriodLabel + " - " + filterStore.endPeriodLabel : "")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "subheader__actions"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "btn-row"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_buttons__WEBPACK_IMPORTED_MODULE_2__["PinButton"], null), filterStore.isTVA ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_buttons__WEBPACK_IMPORTED_MODULE_2__["ExcelPopoverButton"], null) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_buttons__WEBPACK_IMPORTED_MODULE_2__["ExcelButton"], null))));
}));
/* harmony default export */ __webpack_exports__["default"] = (IPTTHeader);

/***/ }),

/***/ "sJKi":
/*!****************************************************!*\
  !*** ./js/pages/iptt_report/models/reportStore.js ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ReportStore; });
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mobx */ "2vnA");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../constants */ "v38i");
var _class;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object['ke' + 'ys'](descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object['define' + 'Property'](target, property, desc); desc = null; } return desc; }




var _gettext = typeof gettext !== 'undefined' ? gettext : function (s) {
  return s;
};

var ReportStore = (_class =
/*#__PURE__*/
function () {
  function ReportStore(filterStore) {
    _classCallCheck(this, ReportStore);

    this.filterStore = filterStore;
  }

  _createClass(ReportStore, [{
    key: "periodValues",
    value: function periodValues(indicator) {
      if (this.filterStore.frequencyId == 1) {
        return [];
      }

      if (this.filterStore.frequencyId && this.filterStore.programIsLoaded) {
        var reportData = indicator.reportData[this.filterStore.reportType][this.filterStore.frequencyId];

        if (reportData && reportData !== undefined) {
          return this.filterStore.frequencyId == 2 ? reportData : reportData.slice(this.filterStore.startPeriod, this.filterStore.endPeriod + 1) || [];
        } else {
          var _reportData = indicator.program.getIndicator(indicator.pk).reportData[this.filterStore.reportType][this.filterStore.frequencyId];

          if (_reportData && _reportData !== undefined) {
            return this.filterstore.frequencyId == 2 ? _reportData : _reportData.slice(this.filterStore.startPeriod, this.filterStore.endPeriod + 1);
          }
        }
      }

      return [];
    }
  }, {
    key: "isTVA",
    get: function get() {
      return this.filterStore.reportType === _constants__WEBPACK_IMPORTED_MODULE_1__["TVA"];
    }
  }, {
    key: "programName",
    get: function get() {
      if (this.filterStore.program) {
        return this.filterStore.program.name;
      }

      return null;
    }
  }, {
    key: "levelColumn",
    get: function get() {
      return this.filterStore.oldLevels === true;
    }
  }, {
    key: "levelRows",
    get: function get() {
      return this.filterStore.oldLevels === false;
    }
  }, {
    key: "reportPeriods",
    get: function get() {
      if (this.filterStore.periods) {
        if (this.filterStore.frequencyId == 2) {
          return this.filterStore.periods.periods;
        }

        return this.filterStore.periods.periodRange(this.filterStore.startPeriod, this.filterStore.endPeriod) || [];
      }

      return [];
    }
  }, {
    key: "indicatorRows",
    get: function get() {
      if (this.levelRows) {
        return [];
      }

      if (this.filterStore.frequencyId && this.filterStore.programIsLoaded) {
        return this.filterStore.filteredIndicators || [];
      }

      return [];
    }
  }, {
    key: "groupedIndicatorRows",
    get: function get() {
      var _this = this;

      if (!this.levelRows) {
        return [];
      }

      if (this.filterStore.frequencyId && this.filterStore.programIsLoaded) {
        return this.filterStore.filteredLevels.map(function (level) {
          return {
            level: level,
            indicators: _this.filterStore.filterIndicators(level.indicators)
          };
        }).concat([{
          level: null,
          indicators: this.filterStore.filteredIndicators.filter(function (indicator) {
            return !indicator.levelpk;
          })
        }]);
      }

      return [];
    }
  }, {
    key: "reportWidth",
    get: function get() {
      return 8 + (this.levelColumn && 1) + 3 + this.reportPeriods.length * (1 + (this.filterStore.isTVA && 2));
    }
  }]);

  return ReportStore;
}(), (_applyDecoratedDescriptor(_class.prototype, "isTVA", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "isTVA"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "programName", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "programName"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "levelColumn", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "levelColumn"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "levelRows", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "levelRows"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "reportPeriods", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "reportPeriods"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "indicatorRows", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "indicatorRows"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "groupedIndicatorRows", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "groupedIndicatorRows"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "reportWidth", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "reportWidth"), _class.prototype)), _class);

;

/***/ }),

/***/ "v38i":
/*!*************************!*\
  !*** ./js/constants.js ***!
  \*************************/
/*! exports provided: BLANK_OPTION, BLANK_LABEL, BLANK_TABLE_CELL, TVA, TIMEPERIODS, TIME_AWARE_FREQUENCIES, GROUP_BY_CHAIN, GROUP_BY_LEVEL, getPeriodLabels, STATUS_CODES */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BLANK_OPTION", function() { return BLANK_OPTION; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BLANK_LABEL", function() { return BLANK_LABEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BLANK_TABLE_CELL", function() { return BLANK_TABLE_CELL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TVA", function() { return TVA; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TIMEPERIODS", function() { return TIMEPERIODS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TIME_AWARE_FREQUENCIES", function() { return TIME_AWARE_FREQUENCIES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GROUP_BY_CHAIN", function() { return GROUP_BY_CHAIN; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GROUP_BY_LEVEL", function() { return GROUP_BY_LEVEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getPeriodLabels", function() { return getPeriodLabels; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "STATUS_CODES", function() { return STATUS_CODES; });
/**
 * IPTT Constants:
 */
var BLANK_LABEL = '---------';
var BLANK_OPTION = {
  value: null,
  label: BLANK_LABEL
};
var BLANK_TABLE_CELL = '—';
var TVA = 1;
var TIMEPERIODS = 2;
var TIME_AWARE_FREQUENCIES = [3, 4, 5, 6, 7];

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
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mobx */ "2vnA");
/* harmony import */ var _components_selectWidgets__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../components/selectWidgets */ "Ez0T");
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





/**  false && <Selectors.PeriodSelect />}
                { false && <Selectors.TimeFrameRadio />}
                { false && <Selectors.StartDateSelect />}
                { false && <Selectors.EndDateSelect />}
                { false && filterStore.oldLevels === false &&
                    <Selectors.GroupingSelect />*/

/**
 * input-ready filtering single-select for Programs available to user in IPTT Report
 * uses SingleSelect in js/components/selectWidgets
 */

var ProgramSelect = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('filterStore')(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref) {
  var filterStore = _ref.filterStore;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_selectWidgets__WEBPACK_IMPORTED_MODULE_3__["SingleReactSelect"], {
    label: gettext('Program'),
    options: filterStore.programOptions,
    value: filterStore.selectedProgramOption,
    update: function update(selected) {
      filterStore.programId = selected.value;
    }
  });
}));
/**
 * input-ready filtering single-select for Frequencies available for selected program in IPTT Report
 * uses SingleSelect in js/components/selectWidgets
 */

var FrequencySelect = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('filterStore')(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref2) {
  var filterStore = _ref2.filterStore;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_selectWidgets__WEBPACK_IMPORTED_MODULE_3__["SingleReactSelect"], {
    label: filterStore.isTVA ? gettext('Target periods') : gettext('Time periods'),
    options: filterStore.frequencyOptions,
    value: filterStore.selectedFrequencyOption,
    update: function update(selected) {
      filterStore.frequencyId = selected.value;
    }
  });
}));
/**
 * Show All radio / Most Recent radio / number of Most Recent periods input combo component
 * For selecting start and end of IPTT report
 * controlled component - logic to update date selects in filterStore model (../models)
 */

var TimeframeRadio = (_dec = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('filterStore'), _dec(_class = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class = (_temp =
/*#__PURE__*/
function (_React$Component) {
  _inherits(TimeframeRadio, _React$Component);

  function TimeframeRadio(props) {
    var _this;

    _classCallCheck(this, TimeframeRadio);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TimeframeRadio).call(this, props));

    _this.setShowAll = function () {
      _this.setState({
        focus: false,
        revert: false
      });

      _this.props.filterStore.showAll = true;
    };

    _this.checkMostRecent = function () {
      _this.mostRecentInputRef.current.focus();
    };

    _this.handleChange = function (e) {
      _this.setState({
        mostRecentValue: e.target.value
      });
    };

    _this.handleBlur = function (e) {
      if (!_this.state.revert && _this.state.mostRecentValue !== '') {
        _this.props.filterStore.mostRecent = _this.state.mostRecentValue;

        _this.setState({
          focus: false,
          revert: false,
          mostRecentValue: _this.props.filterStore._mostRecentValue
        });
      } else if (_this.state.revert) {
        _this.setShowAll();
      } else {
        _this.setState({
          focus: false
        });
      }
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
      var newState = {
        focus: true,
        mostRecentValue: _this.props.filterStore._mostRecentValue || ''
      };

      if (!_this.mostRecentValue) {
        newState.mostRecentValue = '';
      }

      _this.setState(newState);
    };

    _this.mostRecentInputRef = react__WEBPACK_IMPORTED_MODULE_0___default.a.createRef();
    _this.state = {
      focus: false,
      mostRecentValue: props.filterStore.mostRecent || '',
      revert: false
    };
    return _this;
  }

  _createClass(TimeframeRadio, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-row mb-3"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "col-sm-4"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-check form-check-inline pt-1"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "form-check-input"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "radio",
        checked: !this.props.filterStore.periodsDisabled && !this.state.focus && this.props.filterStore.showAll,
        disabled: this.props.filterStore.periodsDisabled,
        onChange: this.setShowAll
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        onClick: this.setShowAll,
        className: "form-check-label"
      },
      /* # Translators: option to show all periods for the report */
      gettext('Show all')))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "col-sm-4 p-0"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-check form-check-inline pt-1"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "form-check-input"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "radio",
        checked: !this.props.filterStore.periodsDisabled && (this.state.focus || this.props.filterStore.mostRecent),
        disabled: this.props.filterStore.periodsDisabled,
        onChange: this.checkMostRecent
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        onClick: this.checkMostRecent,
        className: "form-check-label"
      },
      /* # Translators: option to show a number of recent periods for the report */
      gettext('Most recent')))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "col-sm-4"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "number",
        className: "form-control",
        value: !this.props.filterStore.periodsDisabled && this.mostRecentValue,
        ref: this.mostRecentInputRef,
        disabled: this.props.filterStore.periodsDisabled,
        onChange: this.handleChange,
        onFocus: this.handleFocus,
        onBlur: this.handleBlur,
        onKeyDown: this.handleKeyDown
      })));
    }
  }, {
    key: "mostRecentValue",
    get: function get() {
      if (this.state.focus) {
        return this.state.mostRecentValue;
      } else {
        return this.props.filterStore.mostRecent || '';
      }
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
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_selectWidgets__WEBPACK_IMPORTED_MODULE_3__["DateSelect"], {
    label:
    /* # Translators: menu for selecting the start date for a report */
    gettext('Start'),
    disabled: filterStore.periodsDisabled,
    value: filterStore.startPeriod || '',
    update: function update(e) {
      filterStore.startPeriod = e.target.value;
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
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_selectWidgets__WEBPACK_IMPORTED_MODULE_3__["DateSelect"], {
    label:
    /* # Translators: menu for selecting the end date for a report */
    gettext('End'),
    disabled: filterStore.periodsDisabled,
    value: filterStore.endPeriod || '',
    update: function update(e) {
      filterStore.endPeriod = e.target.value;
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
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_selectWidgets__WEBPACK_IMPORTED_MODULE_3__["GroupBySelect"], {
    chainLabel: filterStore.resultChainFilterLabel,
    disabled: filterStore.groupByDisabled,
    value: filterStore.groupBy,
    update: function update(e) {
      filterStore.groupBy = e.target.value;
    }
  });
}));


/***/ }),

/***/ "wKB/":
/*!*************************************!*\
  !*** ./js/pages/iptt_report/api.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ReportAPI; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * API for IPTT report - handles updating IPTT report data when a new program/frequency is selected
 */
var ReportAPI =
/*#__PURE__*/
function () {
  function ReportAPI(ajaxURL) {
    _classCallCheck(this, ReportAPI);

    this.url = ajaxURL;
  }

  _createClass(ReportAPI, [{
    key: "callForReportData",
    value: function callForReportData(reportType, programId, frequency) {
      var params = {
        programId: programId,
        frequency: frequency,
        reportType: reportType
      };
      return $.get(this.url, params);
    }
  }, {
    key: "callForIndicatorData",
    value: function callForIndicatorData(reportType, programId, frequency, indicatorId) {
      var params = {
        programId: programId,
        reportType: reportType,
        frequency: frequency,
        indicatorId: indicatorId,
        updateIndicator: '1'
      };
      return $.get(this.url, params);
    }
  }]);

  return ReportAPI;
}();



/***/ })

},[["mYfJ","runtime","vendors"]]]);
//# sourceMappingURL=iptt_report-a2a92742310da9b74393.js.map