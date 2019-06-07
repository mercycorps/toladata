(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["results_framework"],{

/***/ "/l02":
/*!*******************************************************************!*\
  !*** ./js/pages/results_framework/components/leveltier_picker.js ***!
  \*******************************************************************/
/*! exports provided: LevelTierPicker */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LevelTierPicker", function() { return LevelTierPicker; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mobx */ "2vnA");
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-select */ "y2Vs");
var _dec, _class, _temp, _dec2, _class3;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }





var Picker = (_dec = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('rootStore'), _dec(_class = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class = (_temp =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Picker, _React$Component);

  function Picker() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, Picker);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Picker)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.handleChange = function (selectedTemplate) {
      _this.props.rootStore.levelStore.changeTierSet(selectedTemplate.value);
    };

    return _this;
  }

  _createClass(Picker, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      // Enable popovers after update (they break otherwise)
      $('*[data-toggle="popover"]').popover({
        html: true
      });
    }
  }, {
    key: "render",
    value: function render() {
      var helpIcon = null;

      if (this.props.rootStore.uiStore.tierLockStatus == "locked") {
        helpIcon = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
          href: "#",
          tabIndex: "0",
          "data-toggle": "popover",
          "data-trigger": "focus",
          "data-html": "true",
          "data-content": gettext('<span class="text-danger"><strong>The results framework template cannot be changed after levels are saved.</strong></span> To change templates, all saved levels first must be deleted.  A level can be deleted when it has no sub-levels and no linked indicators.')
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "far fa-question-circle"
        }));
      } else if (this.props.rootStore.uiStore.tierLockStatus == "primed") {
        helpIcon = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
          href: "#",
          tabIndex: "0",
          "data-toggle": "popover",
          "data-trigger": "focus",
          "data-html": "true",
          "data-content": gettext('<span class="text-danger"><strong>Choose your results framework template carefully!</strong></span> Once you begin building your framework, it will not be possible to change templates without first deleting all saved levels.')
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "far fa-question-circle"
        }));
      }

      var tierTemplates = this.props.rootStore.levelStore.tierTemplates;
      var options = Object.keys(tierTemplates).map(function (key) {
        return {
          value: key,
          label: tierTemplates[key]['name']
        };
      });
      var selectedOption = {
        value: this.props.rootStore.levelStore.chosenTierSetKey,
        label: this.props.rootStore.levelStore.chosenTierSetName
      };
      var classes = "leveltier-picker__selectbox ";
      classes += this.props.rootStore.uiStore.tierLockStatus == "locked" ? "leveltier-picker__selectbox--disabled" : "";
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: classes
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", null, gettext('Results framework template')), "\xA0", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("small", null, helpIcon), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_3__["default"], {
        options: options,
        value: selectedOption,
        isDisabled: this.props.rootStore.uiStore.tierLockStatus == "locked" ? true : false,
        onChange: this.handleChange
      })));
    }
  }]);

  return Picker;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp)) || _class) || _class);

var LevelTier =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(LevelTier, _React$Component2);

  function LevelTier() {
    _classCallCheck(this, LevelTier);

    return _possibleConstructorReturn(this, _getPrototypeOf(LevelTier).apply(this, arguments));
  }

  _createClass(LevelTier, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: 'leveltier leveltier--level-' + this.props.tierLevel
      }, this.props.tierName, " ");
    }
  }]);

  return LevelTier;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

var LevelTierList = (_dec2 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('rootStore'), _dec2(_class3 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class3 =
/*#__PURE__*/
function (_React$Component3) {
  _inherits(LevelTierList, _React$Component3);

  function LevelTierList() {
    _classCallCheck(this, LevelTierList);

    return _possibleConstructorReturn(this, _getPrototypeOf(LevelTierList).apply(this, arguments));
  }

  _createClass(LevelTierList, [{
    key: "render",
    value: function render() {
      var apply_button = null;

      if (this.props.rootStore.levelStore.levels.length == 0) {
        apply_button = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
          className: "leveltier-button btn btn-primary btn-block",
          onClick: this.props.rootStore.levelStore.createFirstLevel
        }, gettext("Apply"));
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: "leveltier-list",
        className: "leveltier-list"
      }, this.props.rootStore.levelStore.chosenTierSet.length > 0 ? this.props.rootStore.levelStore.chosenTierSet.map(function (tier, index) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LevelTier, {
          key: index,
          tierLevel: index,
          tierName: tier
        });
      }) : null), apply_button ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "leveltier-list__actions"
      }, apply_button) : null);
    }
  }]);

  return LevelTierList;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component)) || _class3) || _class3);
var LevelTierPicker = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])("rootStore")(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (props) {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    id: "leveltier-picker",
    className: "leveltier-picker"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Picker, null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LevelTierList, null))
  /*<div id="alerts2" style={{minHeight:"50px", minWidth:"50px", backgroundColor:"red"}}></div>*/
  ;
}));

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

/***/ "5Za8":
/*!**************************************************************!*\
  !*** ./js/pages/results_framework/components/level_cards.js ***!
  \**************************************************************/
/*! exports provided: LevelTitle, LevelCardCollapsed, LevelCardExpanded */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LevelTitle", function() { return LevelTitle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LevelCardCollapsed", function() { return LevelCardCollapsed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LevelCardExpanded", function() { return LevelCardExpanded; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "TSYQ");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! mobx */ "2vnA");
/* harmony import */ var _fortawesome_fontawesome_svg_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @fortawesome/fontawesome-svg-core */ "7O5W");
/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ "IP2g");
/* harmony import */ var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons */ "wHSu");
/* harmony import */ var _components_selectWidgets__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../components/selectWidgets */ "Ez0T");
/* harmony import */ var react_sortable_hoc__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-sortable-hoc */ "0zu5");
/* harmony import */ var react_sortable_hoc__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react_sortable_hoc__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _components_helpPopover__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../components/helpPopover */ "4L+s");
var _dec, _class, _temp, _dec2, _class3, _temp2, _dec3, _class5;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }











_fortawesome_fontawesome_svg_core__WEBPACK_IMPORTED_MODULE_4__["library"].add(_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_6__["faCaretDown"], _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_6__["faCaretRight"], _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_6__["faArrowsAlt"]);
var LevelTitle =
/*#__PURE__*/
function (_React$Component) {
  _inherits(LevelTitle, _React$Component);

  function LevelTitle() {
    _classCallCheck(this, LevelTitle);

    return _possibleConstructorReturn(this, _getPrototypeOf(LevelTitle).apply(this, arguments));
  }

  _createClass(LevelTitle, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h3", {
        className: 'level-title ' + this.props.classes
      }, this.props.tierName, this.props.ontologyLabel ? " " + this.props.ontologyLabel : null);
    }
  }]);

  return LevelTitle;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);
var LevelCardCollapsed = (_dec = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["inject"])('rootStore'), _dec(_class = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class = (_temp =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(LevelCardCollapsed, _React$Component2);

  function LevelCardCollapsed() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, LevelCardCollapsed);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(LevelCardCollapsed)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.deleteLevel = function () {
      var levelTitle = _this.props.levelProps.tierName + " " + _this.props.levelProps.ontologyLabel;
      create_no_rationale_changeset_notice({
        /* # Translators:  This is a confirmation prompt that is triggered by clicking on a delete button. The code is a reference to the specific item being deleted.  Only one item can be deleted at a time. */
        message_text: "Are you sure you want to delete ".concat(levelTitle, "?"),
        on_submit: function on_submit() {
          return _this.props.rootStore.levelStore.deleteLevelFromDB(_this.props.level.id);
        }
      });
    };

    _this.editLevel = function () {
      _this.props.rootStore.uiStore.addExpandedCard(_this.props.level.id);
    };

    _this.buildIPTTUrl = function (indicator_ids) {
      var url = "/indicators/iptt_report/".concat(_this.props.rootStore.levelStore.program_id, "/timeperiods/?frequency=3&start=0&end=999");
      indicator_ids.forEach(function (i) {
        return url += "&indicators=" + i;
      });
      return url;
    };

    return _this;
  }

  _createClass(LevelCardCollapsed, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // Enable popovers after update (they break otherwise)
      $('*[data-toggle="popover"]').popover({
        html: true
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      // the level card shouldn't be displayed if it's parent level is not expandoed (except
      // if the level is the top level one).
      if (this.props.rootStore.uiStore.hasVisibleChildren.indexOf(this.props.level.parent) < 0 && this.props.level.parent != null) {
        return null;
      } // Prepare the indicator links for the indicator popover


      var allIndicatorLinks = []; // Get indicator ids linked to this level and create a hyperlink for a filtered IPTT.

      var sameLevelIndicatorIds = this.props.levelProps.indicators.map(function (i) {
        return i.id;
      });

      if (sameLevelIndicatorIds.length > 0) {
        var linkText = "All indicators linked to ".concat(this.props.levelProps.tierName, " ").concat(this.props.levelProps.ontologyLabel);
        allIndicatorLinks.push("<a href=".concat(this.buildIPTTUrl(sameLevelIndicatorIds), ">").concat(linkText, "</a>"));
      } // Get indicator ids linked to the descendants of this level, add the indicator ids identified
      // above, and create a hyperlink for a filtered IPTT.  Only do this if the level has sublevels.


      if (this.props.levelProps.tierName != this.props.rootStore.levelStore.chosenTierSet.slice(-1)[0]) {
        var descendantIndicatorIds = this.props.levelProps.descendantIndicatorIds;
        descendantIndicatorIds = descendantIndicatorIds.concat(sameLevelIndicatorIds);

        if (descendantIndicatorIds.length > 0) {
          var _linkText = "All indicators linked to ".concat(this.props.levelProps.tierName, " ").concat(this.props.levelProps.ontologyLabel, " and sub-levels");

          allIndicatorLinks.unshift("<a href=".concat(this.buildIPTTUrl(descendantIndicatorIds), ">").concat(_linkText, "</a>"));
        }
      } // Create IPTT hyperlinks for each individual indicator linked to this level


      var individualLinks = this.props.levelProps.indicators.map(function (indicator, index) {
        var ontologyLabel = _this2.props.levelProps.ontologyLabel + String.fromCharCode(97 + index) + ": ";
        return "<li class=\"nav-item\"><a href=".concat(_this2.buildIPTTUrl([indicator.id]), ">").concat(ontologyLabel).concat(indicator.name, "</a></li>");
      });
      allIndicatorLinks = allIndicatorLinks.concat(individualLinks);
      var indicatorMarkup = "<ul class=\"nav flex-column\">".concat(allIndicatorLinks.join("<br>"), "</ul>");
      var iCount = this.props.levelProps.indicators.length;
      /* # Translators: This is a count of indicators associated with another object */

      var indicatorCountText = interpolate(ngettext("%s indicator", "%s indicators", iCount), [iCount]); // The expando caret is only applied to levels that:
      // 1. Aren't at the end of the leveltier hierarchy
      // 2. Actually have children

      var expando = null;

      if (this.props.levelProps.tierName != Object(mobx__WEBPACK_IMPORTED_MODULE_3__["toJS"])(this.props.rootStore.levelStore.chosenTierSet.slice(-1)[0]) && this.props.rootStore.levelStore.levels.filter(function (l) {
        return l.parent == _this2.props.level.id;
      }).length > 0) {
        expando = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_5__["FontAwesomeIcon"], {
          className: "text-action",
          icon: this.props.rootStore.uiStore.hasVisibleChildren.indexOf(this.props.level.id) >= 0 ? 'caret-down' : 'caret-right'
        });
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "level-card level-card--collapsed",
        id: this.props.level.id
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: expando ? "level-card__toggle" : "",
        onClick: function onClick(e) {
          return _this2.props.rootStore.uiStore.updateVisibleChildren(_this2.props.level.id);
        }
      }, expando, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "level-card--collapsed__name"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LevelTitle, {
        tierName: this.props.levelProps.tierName,
        ontologyLabel: this.props.levelProps.ontologyLabel,
        classes: "level-title--collapsed"
      }), "\xA0", this.props.level.name)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "level-card--collapsed__actions"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "actions__top btn-row"
      }, this.props.levelProps.canDelete && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-sm btn-link btn-danger",
        onClick: this.deleteLevel
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-trash-alt"
      }), gettext("Delete")), this.props.levelProps.canEdit && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-sm btn-link btn-text",
        onClick: this.editLevel
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-edit"
      }), gettext("Edit"))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "actions__bottom"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-sm btn-link no-bold",
        "data-toggle": "popover",
        "data-trigger": "focus",
        "data-placement": "bottom",
        "data-html": "true",
        title: "Track indicator performance",
        "data-content": indicatorMarkup,
        disabled: allIndicatorLinks.length == 0
      }, indicatorCountText))));
    }
  }]);

  return LevelCardCollapsed;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp)) || _class) || _class);
var LevelCardExpanded = (_dec2 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["inject"])('rootStore'), _dec2(_class3 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class3 = (_temp2 =
/*#__PURE__*/
function (_React$Component3) {
  _inherits(LevelCardExpanded, _React$Component3);

  function LevelCardExpanded(props) {
    var _this3;

    _classCallCheck(this, LevelCardExpanded);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(LevelCardExpanded).call(this, props));

    _this3.onDragEnd = function (_ref) {
      var oldIndex = _ref.oldIndex,
          newIndex = _ref.newIndex;
      var indicatorId = _this3.indicators[oldIndex].id;
      var fakeChangeObj = {
        value: newIndex + 1,
        name: newIndex + 1
      };

      _this3.updateIndicatorOrder(fakeChangeObj, indicatorId);
    };

    _this3.updateIndicatorOrder = function (changeObj, indicatorId) {
      _this3.indicatorWasReordered = true;
      var oldIndex = _this3.indicators.find(function (i) {
        return i.id == indicatorId;
      }).level_order - 1;
      var newIndex = changeObj.value - 1;

      var tempIndicators = _this3.indicators.slice();

      tempIndicators.splice(newIndex, 0, tempIndicators.splice(oldIndex, 1)[0]);
      tempIndicators.forEach(function (indicator, index) {
        return indicator.level_order = index + 1;
      });

      _this3.indicators.replace(tempIndicators);
    };

    _this3.updateSubmitType = function (newType) {
      _this3.submitType = newType;
    };

    _this3.saveLevel = function (event) {
      event.preventDefault();

      _this3.props.rootStore.levelStore.saveLevelToDB(_this3.submitType, _this3.props.level.id, _this3.indicatorWasReordered, {
        name: _this3.name,
        assumptions: _this3.assumptions,
        indicators: Object(mobx__WEBPACK_IMPORTED_MODULE_3__["toJS"])(_this3.indicators)
      });
    };

    _this3.cancelEdit = function () {
      _this3.props.rootStore.levelStore.cancelEdit(_this3.props.level.id);
    };

    _this3.onFormChange = function (event) {
      event.preventDefault();
      _this3[event.target.name] = event.target.value;
    };

    _this3.submitType = "saveOnly";
    _this3.indicatorWasReordered = false;
    Object(mobx__WEBPACK_IMPORTED_MODULE_3__["extendObservable"])(_assertThisInitialized(_assertThisInitialized(_this3)), {
      name: props.level.name,
      assumptions: props.level.assumptions,
      indicators: props.levelProps.indicators.sort(function (a, b) {
        return a.level_order - b.level_order;
      })
    });
    return _this3;
  }

  _createClass(LevelCardExpanded, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // Enable popovers after update (they break otherwise)
      $('*[data-toggle="popover"]').popover({
        html: true
      });
    }
  }, {
    key: "render",
    value: function render() {
      // Need to reference indicators so it reacts to changes.  Simply passing the observable this.indicators through
      // to IndicatorList will result in a non-reactive Indicator list form fields.
      var tempIndicators = Object(mobx__WEBPACK_IMPORTED_MODULE_3__["toJS"])(this.indicators);
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "level-card level-card--expanded",
        id: this.props.level.id
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LevelTitle, {
        tierName: this.props.levelProps.tierName,
        ontologyLabel: this.props.levelProps.ontologyLabel,
        classes: "level-title--expanded"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("form", {
        className: "level-card--expanded__form",
        onSubmit: this.saveLevel
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("textarea", {
        className: "form-control",
        id: "level-name",
        name: "name",
        value: this.name || "",
        autoComplete: "off",
        onChange: this.onFormChange
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        htmlFor: "assumptions"
      }, "Assumptions"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("textarea", {
        className: "form-control",
        id: "level-assumptions",
        disabled: this.name ? "" : "disabled",
        name: "assumptions",
        autoComplete: "off",
        value: this.assumptions || "",
        onChange: this.onFormChange
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorList, {
        level: this.props.level,
        tierName: this.props.levelProps.tierName,
        indicators: this.indicators,
        changeFunc: this.updateIndicatorOrder,
        dragEndFunc: this.onDragEnd
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ButtonBar, {
        level: this.props.level,
        levelProps: this.props.levelProps,
        isActive: this.props.rootStore.uiStore.expandedCards[0] == this.props.level.id,
        submitFunc: this.updateSubmitType,
        cancelFunc: this.cancelEdit,
        nameVal: this.name,
        tierCount: this.props.rootStore.levelStore.chosenTierSet.length
      })));
    }
  }]);

  return LevelCardExpanded;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp2)) || _class3) || _class3);
var ButtonBar = (_dec3 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["inject"])('rootStore'), _dec3(_class5 =
/*#__PURE__*/
function (_React$Component4) {
  _inherits(ButtonBar, _React$Component4);

  function ButtonBar() {
    _classCallCheck(this, ButtonBar);

    return _possibleConstructorReturn(this, _getPrototypeOf(ButtonBar).apply(this, arguments));
  }

  _createClass(ButtonBar, [{
    key: "render",
    value: function render() {
      var disabledText = this.props.isActive && this.props.nameVal ? "" : "disabled"; // Build the button text with the right sibling level name, then build the button.

      var addAnotherButton = null;

      if (this.props.level.parent != null && this.props.level.parent != "root") {
        {
          /* # Translators: On a button, with a tiered set of objects, save current object and add another one in the same tier, e.g. "Save and add another Outcome" when the user is editing an Outcome */
        }
        var buttonText = interpolate(gettext("Save and add another %s"), [this.props.levelProps.tierName]);
        addAnotherButton = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LevelButton, {
          disabledText: disabledText,
          classes: "btn-primary",
          icon: "plus-circle",
          text: buttonText,
          submitType: "saveAndAddSibling",
          submitFunc: this.props.submitFunc
        });
      } // Build the button text with the right child level name, then build the button.


      var addAndLinkButton = null;
      var tierCount = this.props.rootStore.levelStore.chosenTierSet.length;

      if (this.props.level.level_depth < tierCount) {
        {
          /* # Translators: On a button, with a tiered set of objects, save current object and add another one in the next lower tier, e.g. "Save and add another Activity" when the user is editing a Goal */
        }

        var _buttonText = interpolate(gettext("Save and link %s"), [this.props.levelProps.childTierName]);

        addAndLinkButton = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LevelButton, {
          disabledText: disabledText,
          classes: "btn btn-primary",
          icon: "stream",
          text: _buttonText,
          submitType: "saveAndAddChild",
          submitFunc: this.props.submitFunc
        });
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "button-bar btn-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LevelButton, {
        disabledText: disabledText,
        classes: "btn-primary",
        text: gettext("Save and close"),
        icon: "save",
        submitType: "saveOnly",
        submitFunc: this.props.submitFunc
      }), addAnotherButton, addAndLinkButton, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LevelButton, {
        classes: "btn btn-reset",
        text: gettext("Cancel"),
        submitType: "cancel",
        submitFunc: this.props.cancelFunc
      }));
    }
  }]);

  return ButtonBar;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component)) || _class5);

var LevelButton =
/*#__PURE__*/
function (_React$Component5) {
  _inherits(LevelButton, _React$Component5);

  function LevelButton() {
    _classCallCheck(this, LevelButton);

    return _possibleConstructorReturn(this, _getPrototypeOf(LevelButton).apply(this, arguments));
  }

  _createClass(LevelButton, [{
    key: "render",
    value: function render() {
      var _this4 = this;

      var buttonType = this.props.submitType == "cancel" ? "button" : "submit";
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        disabled: this.props.disabledText,
        type: buttonType,
        className: this.props.classes + ' level-button btn btn-sm',
        onClick: function onClick() {
          return _this4.props.submitFunc(_this4.props.submitType);
        }
      }, this.props.text);
    }
  }]);

  return LevelButton;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

var IndicatorList =
/*#__PURE__*/
function (_React$Component6) {
  _inherits(IndicatorList, _React$Component6);

  function IndicatorList() {
    _classCallCheck(this, IndicatorList);

    return _possibleConstructorReturn(this, _getPrototypeOf(IndicatorList).apply(this, arguments));
  }

  _createClass(IndicatorList, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // Enable popovers after update (they break otherwise)
      $('*[data-toggle="popover"]').popover({
        html: true
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this5 = this;

      // Create the list of indicators and the dropdowns for setting the indicator order
      var options = this.props.indicators.map(function (entry, index) {
        return {
          value: index + 1,
          label: index + 1
        };
      });
      var indicatorMarkup = [];
      this.props.indicators.forEach(function (indicator) {
        // let options = this.props.indicators.map( (entry, index) => <option value={index+1}>{index+1}</option>);
        indicatorMarkup.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_selectWidgets__WEBPACK_IMPORTED_MODULE_7__["SingleReactSelect"], {
          update: function update(value) {
            return _this5.props.changeFunc(value, indicator.id);
          },
          selectId: "ind" + indicator.id,
          labelClasses: "col-form-label",
          value: {
            value: indicator.level_order,
            label: indicator.level_order
          },
          label: indicator.name,
          options: options
        }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
          href: "#",
          className: "indicator-link"
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "fas fa-cog"
        }), " Settings")));
      }); // Conditionally set the other elements that are only visible when there are indicators

      var order = null;
      var helpLink = null;

      if (this.props.indicators.length > 0) {
        order = "Order";
        helpLink = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_helpPopover__WEBPACK_IMPORTED_MODULE_9__["default"], {
          content: "To remove an indicator: Click \u201CSettings\u201D, where you can reassign the indicator to a different level or delete it.",
          placement: "bottom"
        });
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", {
        id: "level-card--indicator-links",
        style: {
          backgroundColor: "white",
          padding: "1em"
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, "Indicators Linked to this ", this.props.tierName, order, helpLink), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SortableContainer, {
        onSortEnd: this.props.dragEndFunc,
        useDragHandle: true,
        lockAxis: "y",
        lockToContainerEdges: true
      }, indicatorMarkup.map(function (value, index) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SortableItem, {
          key: "item-".concat(index),
          index: index,
          value: value
        });
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        role: "button",
        className: "btn btn-link btn-add"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
        className: "fas fa-plus-circle"
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, "Add Indicator"))));
    }
  }]);

  return IndicatorList;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

var SortableItem = Object(react_sortable_hoc__WEBPACK_IMPORTED_MODULE_8__["sortableElement"])(function (_ref2) {
  var value = _ref2.value;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(DragHandle, null), value);
});
var SortableContainer = Object(react_sortable_hoc__WEBPACK_IMPORTED_MODULE_8__["sortableContainer"])(function (_ref3) {
  var children = _ref3.children;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", null, children);
});
var DragHandle = Object(react_sortable_hoc__WEBPACK_IMPORTED_MODULE_8__["sortableHandle"])(function () {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_5__["FontAwesomeIcon"], {
    icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_6__["faArrowsAlt"]
  }));
});

/***/ }),

/***/ "Ez0T":
/*!****************************************!*\
  !*** ./js/components/selectWidgets.js ***!
  \****************************************/
/*! exports provided: SingleReactSelect, DateSelect, SingleSelect, MultiSelectCheckbox */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SingleReactSelect", function() { return SingleReactSelect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DateSelect", function() { return DateSelect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SingleSelect", function() { return SingleSelect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MultiSelectCheckbox", function() { return MultiSelectCheckbox; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-select */ "y2Vs");
/* harmony import */ var react_multiselect_checkboxes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-multiselect-checkboxes */ "VCnP");
/* harmony import */ var react_multiselect_checkboxes__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_multiselect_checkboxes__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _formUtils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../formUtils */ "G56O");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





var SingleReactSelect = function SingleReactSelect(props) {
  var selectId = Object(_formUtils__WEBPACK_IMPORTED_MODULE_3__["uniqueId"])('react-select');
  var labelClasses = props.labelClasses || "col-form-label text-uppercase";
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "form-row mb-3"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    htmlFor: selectId,
    className: labelClasses
  }, props.label), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_1__["default"], {
    onChange: props.update,
    value: props.value,
    id: selectId,
    className: "tola-react-select",
    disabled: props.disabled,
    options: props.options
  }));
};
var DateSelect = function DateSelect(props) {
  var selectId = Object(_formUtils__WEBPACK_IMPORTED_MODULE_3__["uniqueId"])('date-select');
  var formattedOptions = props.options && props.options.length == 1 && props.options[0].value !== undefined ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
    value: props.options[0].value
  }, props.options[0].label) : props.options && props.options[0].options !== undefined ? props.options.map(function (optgroup, index) {
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
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "form-row mb-3"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    htmlFor: selectId,
    className: "col-form-label text-uppercase"
  }, props.label), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("select", {
    onChange: props.update,
    value: props.value,
    id: selectId,
    className: "form-control",
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

/***/ }),

/***/ "FtQq":
/*!**********************************************!*\
  !*** ./js/pages/results_framework/models.js ***!
  \**********************************************/
/*! exports provided: RootStore, LevelStore, UIStore */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RootStore", function() { return RootStore; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LevelStore", function() { return LevelStore; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UIStore", function() { return UIStore; });
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mobx */ "2vnA");
/* harmony import */ var _api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../api.js */ "XoI5");
var _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _temp, _class3, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _temp2;

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object['ke' + 'ys'](descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object['define' + 'Property'](target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and set to use loose mode. ' + 'To use proposal-class-properties in spec mode with decorators, wait for ' + 'the next major version of decorators in stage 2.'); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var RootStore = function RootStore(program_id, levels, indicators, levelTiers, tierTemplates, accessLevel) {
  _classCallCheck(this, RootStore);

  this.levelStore = new LevelStore(program_id, levels, indicators, levelTiers, tierTemplates, accessLevel, this);
  this.uiStore = new UIStore(this);
};
var LevelStore = (_class = (_temp =
/*#__PURE__*/
function () {
  function LevelStore(program_id, levels, _indicators, levelTiers, tierTemplates, accessLevel, rootStore) {
    var _this = this;

    _classCallCheck(this, LevelStore);

    _initializerDefineProperty(this, "levels", _descriptor, this);

    _initializerDefineProperty(this, "indicators", _descriptor2, this);

    _initializerDefineProperty(this, "chosenTierSetKey", _descriptor3, this);

    _initializerDefineProperty(this, "chosenTierSet", _descriptor4, this);

    this.tierTemplates = void 0;
    this.defaultTemplateKey = "";
    this.customTierSetKey = "";
    this.program_id = "";
    this.accessLevel = false;

    _initializerDefineProperty(this, "cancelEdit", _descriptor5, this);

    _initializerDefineProperty(this, "createNewLevelFromSibling", _descriptor6, this);

    _initializerDefineProperty(this, "createNewLevelFromParent", _descriptor7, this);

    _initializerDefineProperty(this, "createFirstLevel", _descriptor8, this);

    this.saveLevelTiersToDB = function () {
      var tier_data = {
        program_id: _this.program_id,
        tiers: _this.chosenTierSet
      };
      _api_js__WEBPACK_IMPORTED_MODULE_1__["api"].post("/save_leveltiers/", tier_data).then(function (response) {}).catch(function (error) {
        return console.log('error', error);
      });
    };

    this.deleteLevelFromDB = function (levelId) {
      var level_label = "".concat(_this.levelProperties[levelId]['tierName'], " ").concat(_this.levelProperties[levelId]['ontologyLabel']);
      _api_js__WEBPACK_IMPORTED_MODULE_1__["api"].delete("/level/".concat(levelId)).then(function (response) {
        _this.levels.replace(response.data);

        _this.rootStore.uiStore.removeExpandedCard(levelId);

        if (_this.levels.length == 0) {
          _this.createFirstLevel();
        } // Translators: Notification to user that the deletion command that they issued was successful


        success_notice({
          message_text: gettext("".concat(level_label, " was successfully deleted.")),
          addClass: 'program-page__rationale-form',
          stack: {
            dir1: 'up',
            dir2: 'right',
            firstpos1: 20,
            firstpos2: 20
          }
        });
      }).catch(function (error) {
        return console.log('error', error);
      });
    };

    this.saveLevelToDB = function (submitType, levelId, indicatorWasUpdated, formData) {
      if (indicatorWasUpdated) {
        _this.saveReorderedIndicatorsToDB(formData.indicators);
      }

      delete formData.indicators;

      var targetLevel = _this.levels.find(function (level) {
        return level.id == levelId;
      });

      var levelToSave = Object.assign(Object(mobx__WEBPACK_IMPORTED_MODULE_0__["toJS"])(targetLevel), formData);

      if (levelId == "new") {
        if (levelToSave.parent == "root") {
          _this.saveLevelTiersToDB();
        }

        delete levelToSave.id;
        _api_js__WEBPACK_IMPORTED_MODULE_1__["api"].post("/insert_new_level/", levelToSave).then(function (response) {
          Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
            _this.levels.replace(response.data['all_data']);
          });
          var newId = response.data["new_level"]["id"];

          _this.rootStore.uiStore.removeExpandedCard(levelId);

          if (submitType == "saveAndAddSibling") {
            _this.createNewLevelFromSibling(newId);
          } else if (submitType == "saveAndAddChild") {
            _this.createNewLevelFromParent(newId);
          }
        }).catch(function (error) {
          return console.log('error', error);
        });
      } else {
        _api_js__WEBPACK_IMPORTED_MODULE_1__["api"].put("/level/".concat(levelId, "/"), levelToSave).then(function (response) {
          Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
            Object.assign(targetLevel, response.data);
          });

          _this.rootStore.uiStore.removeExpandedCard(levelId);

          if (submitType == "saveAndAddSibling") {
            _this.createNewLevelFromSibling(levelId);
          } else if (submitType == "saveAndAddChild") {
            _this.createNewLevelFromParent(levelId);
          }
        }).catch(function (error) {
          console.log("There was an error:", error);
        });
      }
    };

    this.saveReorderedIndicatorsToDB = function (indicators) {
      _api_js__WEBPACK_IMPORTED_MODULE_1__["api"].post("/reorder_indicators/", indicators).then(function (response) {}).catch(function (error) {
        console.log("There was an error:", error);
      });
    };

    this.deriveTemplateKey = function () {
      // Check each tier set in the templates to see if the tier order and content are exactly the same
      // If they are, return the template key
      var levelTierStr = JSON.stringify(Object(mobx__WEBPACK_IMPORTED_MODULE_0__["toJS"])(_this.chosenTierSet));

      for (var templateKey in _this.tierTemplates) {
        // not an eligable template if the key is inherited or if the lengths of the tier sets don't match.
        if (!_this.tierTemplates.hasOwnProperty(templateKey) || _this.chosenTierSet.length != _this.tierTemplates[templateKey]['tiers'].length) {
          continue;
        }

        var templateValuesStr = JSON.stringify(_this.tierTemplates[templateKey]['tiers']);

        if (levelTierStr == templateValuesStr) {
          return templateKey;
        }
      } // If this has been reached, the db has stored tiers but they're not a match to a template


      return "custom";
    };

    this.buildOntology = function (levelId) {
      var ontologyArray = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var level = Object(mobx__WEBPACK_IMPORTED_MODULE_0__["toJS"])(_this.levels.find(function (l) {
        return l.id == levelId;
      }));
      /*  If there is no parent (saved top tier level) or the parent is "root" (unsaved top tier level)
          then we should return with adding to the ontology because there is no ontology entry for the top tier
       */

      if (level.parent && level.parent != "root") {
        ontologyArray.unshift(level.customsort);
        return _this.buildOntology(level.parent, ontologyArray);
      } else {
        return ontologyArray.join(".");
      }
    };

    this.getChildLevels = function (levelId) {
      return _this.levels.filter(function (l) {
        return l.parent == levelId;
      });
    };

    this.getLevelIndicators = function (levelId) {
      return _this.indicators.filter(function (i) {
        return i.level == levelId;
      });
    };

    this.getDescendantIndicatorIds = function (childLevelIds) {
      var childLevels = _this.levels.filter(function (l) {
        return childLevelIds.includes(l.id);
      });

      var newIndicatorIds = [];
      childLevels.forEach(function (childLevel) {
        newIndicatorIds = newIndicatorIds.concat(_this.indicators.filter(function (i) {
          return i.level == childLevel.id;
        }).map(function (i) {
          return i.id;
        }));

        var grandChildIds = _this.levels.filter(function (l) {
          return l.parent == childLevel.id;
        }).map(function (l) {
          return l.id;
        });

        newIndicatorIds = newIndicatorIds.concat(_this.getDescendantIndicatorIds(grandChildIds, newIndicatorIds));
      });
      return newIndicatorIds;
    };

    this.rootStore = rootStore;
    this.levels = levels;
    this.indicators = _indicators;
    this.tierTemplates = tierTemplates;
    this.defaultTemplateKey = "mc_standard";
    this.customTierSetKey = "custom";
    this.program_id = program_id;
    this.accessLevel = accessLevel; // Set the stored tier set key and the values, if they exist.  Use the default if they don't.

    if (levelTiers.length > 0) {
      // deriveTemplateKey relies on chosenTierSet to be populated, so need to set it first.
      this.chosenTierSet = levelTiers.map(function (t) {
        return t.name;
      });
      this.chosenTierSetKey = this.deriveTemplateKey(levelTiers);
    } else {
      this.chosenTierSetKey = this.defaultTemplateKey;
      this.chosenTierSet = this.tierTemplates[this.chosenTierSetKey]['tiers'];
    }
  }

  _createClass(LevelStore, [{
    key: "changeTierSet",
    value: function changeTierSet(newTierSetKey) {
      this.chosenTierSetKey = newTierSetKey;
      this.chosenTierSet = this.tierTemplates[newTierSetKey]['tiers'];
    }
  }, {
    key: "sortedLevels",
    get: function get() {
      return this.levels.slice().sort(function (a, b) {
        a.level_depth - b.level_depth || a.customsort - b.customsort;
      });
    }
  }, {
    key: "levelProperties",
    get: function get() {
      var _this2 = this;

      var levelProperties = {};
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        var _loop = function _loop() {
          var level = _step.value;
          var properties = {};

          var childrenIds = _this2.getChildLevels(level.id).map(function (l) {
            return l.id;
          });

          var indicatorCount = _this2.indicators.filter(function (i) {
            return i.level == level.id;
          });

          properties['indicators'] = _this2.getLevelIndicators(level.id);
          properties['descendantIndicatorIds'] = _this2.getDescendantIndicatorIds(childrenIds);
          properties['ontologyLabel'] = _this2.buildOntology(level.id);
          properties['tierName'] = _this2.chosenTierSet[level.level_depth - 1];
          properties['childTierName'] = null;

          if (_this2.chosenTierSet.length > level.level_depth) {
            properties['childTierName'] = _this2.chosenTierSet[level.level_depth];
          }

          properties['canDelete'] = childrenIds.length == 0 && indicatorCount == 0 && _this2.accessLevel == 'high';
          properties['canEdit'] = _this2.accessLevel == 'high';
          levelProperties[level.id] = properties;
        };

        for (var _iterator = this.levels[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          _loop();
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return levelProperties;
    }
  }, {
    key: "chosenTierSetName",
    get: function get() {
      if (this.chosenTierSetKey == this.customTierSetKey) {
        return "Custom";
      } else {
        return this.tierTemplates[this.chosenTierSetKey]['name'];
      }
    }
  }]);

  return LevelStore;
}(), _temp), (_descriptor = _applyDecoratedDescriptor(_class.prototype, "levels", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "indicators", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, "chosenTierSetKey", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return "";
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, "chosenTierSet", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _applyDecoratedDescriptor(_class.prototype, "sortedLevels", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "sortedLevels"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "levelProperties", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "levelProperties"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "chosenTierSetName", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "chosenTierSetName"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "changeTierSet", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "changeTierSet"), _class.prototype), _descriptor5 = _applyDecoratedDescriptor(_class.prototype, "cancelEdit", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this3 = this;

    return function (levelId) {
      if (levelId == "new") {
        var targetLevel = _this3.levels.find(function (l) {
          return l.id == levelId;
        }); // First update any customsort values that were modified when this card was created


        var siblingsToReorder = _this3.levels.filter(function (l) {
          return l.customsort > targetLevel.customsort && l.parent == targetLevel.parent;
        });

        siblingsToReorder.forEach(function (sib) {
          return sib.customsort -= 1;
        }); // Now remove the new card

        _this3.levels.replace(_this3.levels.filter(function (element) {
          return element.id != "new";
        }));
      }

      _this3.rootStore.uiStore.removeExpandedCard(levelId);
    };
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class.prototype, "createNewLevelFromSibling", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this4 = this;

    return function (siblingId) {
      // Copy sibling data for the new level and then clear some of it out
      var sibling = Object(mobx__WEBPACK_IMPORTED_MODULE_0__["toJS"])(_this4.levels.find(function (l) {
        return l.id == siblingId;
      }));
      var newLevel = Object.assign({}, sibling);
      newLevel.customsort += 1;
      newLevel.id = "new";
      newLevel.name = "";
      newLevel.assumptions = ""; // bump the customsort field for siblings that come after the inserted Level

      var siblingsToReorder = _this4.levels.filter(function (l) {
        return sibling && l.customsort > sibling.customsort && l.parent == sibling.parent;
      });

      siblingsToReorder.forEach(function (sib) {
        return sib.customsort += 1;
      }); // add new Level to the various Store components

      _this4.rootStore.uiStore.expandedCards.push("new");

      _this4.rootStore.uiStore.activeCard = "new";

      _this4.levels.push(newLevel); // TODO: change focus to new level, since it could be very far from the one that triggered the create

    };
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class.prototype, "createNewLevelFromParent", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this5 = this;

    return function (parentId) {
      // Copy data for the new level and then clear some of it out
      var parent = Object(mobx__WEBPACK_IMPORTED_MODULE_0__["toJS"])(_this5.levels.find(function (l) {
        return l.id == parentId;
      }));
      var newLevel = {
        id: "new",
        customsort: 1,
        name: "",
        assumptions: "",
        parent: parentId,
        level_depth: parent.level_depth + 1,
        program: _this5.program_id
      }; // bump the customsort field for siblings that come after the inserted Level

      var siblingsToReorder = _this5.levels.filter(function (l) {
        return l.parent == parentId;
      });

      siblingsToReorder.forEach(function (sib) {
        return sib.customsort += 1;
      }); // add new Level to the various Store components

      _this5.rootStore.uiStore.expandedCards.push("new");

      _this5.rootStore.uiStore.activeCard = "new";

      _this5.levels.push(newLevel);

      _this5.rootStore.uiStore.hasVisibleChildren.push(newLevel.parent);
    };
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class.prototype, "createFirstLevel", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this6 = this;

    return function () {
      // Using "root" for parent id so the Django view can distinguish between top tier level and 2nd tier level
      var newLevel = {
        id: "new",
        program: _this6.program_id,
        name: "",
        assumptions: "",
        customsort: 1,
        level_depth: 1,
        parent: "root"
      };

      _this6.levels.push(newLevel);

      _this6.rootStore.uiStore.expandedCards.push("new");
    };
  }
})), _class);
var UIStore = (_class3 = (_temp2 =
/*#__PURE__*/
function () {
  function UIStore(rootStore) {
    _classCallCheck(this, UIStore);

    _initializerDefineProperty(this, "expandedCards", _descriptor9, this);

    _initializerDefineProperty(this, "hasVisibleChildren", _descriptor10, this);

    _initializerDefineProperty(this, "addExpandedCard", _descriptor11, this);

    _initializerDefineProperty(this, "removeExpandedCard", _descriptor12, this);

    _initializerDefineProperty(this, "updateVisibleChildren", _descriptor13, this);

    this.rootStore = rootStore;
    this.hasVisibleChildren = this.rootStore.levelStore.levels.map(function (l) {
      return l.id;
    });
  }

  _createClass(UIStore, [{
    key: "tierLockStatus",
    get: function get() {
      // The leveltier picker should be disabled if there is at least one saved level in the DB.
      var notNewLevels = this.rootStore.levelStore.levels.filter(function (l) {
        return l.id != "new";
      });

      if (notNewLevels.length > 0) {
        return "locked";
      } // The apply button should not be visible if there is only one level visible (i.e. saved to the db or not)
      else if (this.rootStore.levelStore.levels.length == 1) {
          return "primed";
        }

      return null;
    }
  }]);

  return UIStore;
}(), _temp2), (_descriptor9 = _applyDecoratedDescriptor(_class3.prototype, "expandedCards", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor10 = _applyDecoratedDescriptor(_class3.prototype, "hasVisibleChildren", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _applyDecoratedDescriptor(_class3.prototype, "tierLockStatus", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class3.prototype, "tierLockStatus"), _class3.prototype), _descriptor11 = _applyDecoratedDescriptor(_class3.prototype, "addExpandedCard", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this7 = this;

    return function (levelId) {
      if (!_this7.expandedCards.includes(levelId)) {
        _this7.expandedCards.push(levelId);
      }
    };
  }
}), _descriptor12 = _applyDecoratedDescriptor(_class3.prototype, "removeExpandedCard", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this8 = this;

    return function (levelId) {
      _this8.expandedCards = _this8.expandedCards.filter(function (level_id) {
        return level_id != levelId;
      });
    };
  }
}), _descriptor13 = _applyDecoratedDescriptor(_class3.prototype, "updateVisibleChildren", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this9 = this;

    return function (levelId) {
      var forceHide = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var forceShow = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      // forceHide is to ensure that descendant levels are also made hidden, even if they are not actually visible.
      if (_this9.hasVisibleChildren.indexOf(levelId) >= 0 || forceHide) {
        _this9.hasVisibleChildren = _this9.hasVisibleChildren.filter(function (level_id) {
          return level_id != levelId;
        });

        var childLevels = _this9.rootStore.levelStore.levels.filter(function (l) {
          return l.parent == levelId;
        });

        childLevels.forEach(function (l) {
          return _this9.updateVisibleChildren(l.id, true);
        });
      } else {
        _this9.hasVisibleChildren.push(levelId);
      }
    };
  }
})), _class3);

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

/***/ "QTZG":
/*!*********************************************!*\
  !*** ./js/pages/results_framework/index.js ***!
  \*********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "i8i4");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var _eventbus__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../eventbus */ "qtBC");
/* harmony import */ var router5__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! router5 */ "wgi2");
/* harmony import */ var router5_plugin_browser__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! router5-plugin-browser */ "0pHI");
/* harmony import */ var _components_level_list__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/level_list */ "t8du");
/* harmony import */ var _components_leveltier_picker__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/leveltier_picker */ "/l02");
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./models */ "FtQq");









/*
 * Model/Store setup
 */

var _jsContext = jsContext,
    program_id = _jsContext.program_id,
    levels = _jsContext.levels,
    indicators = _jsContext.indicators,
    levelTiers = _jsContext.levelTiers,
    tierTemplates = _jsContext.tierTemplates,
    accessLevel = _jsContext.accessLevel;
var rootStore = new _models__WEBPACK_IMPORTED_MODULE_8__["RootStore"](program_id, levels, indicators, levelTiers, tierTemplates, accessLevel);
/*
 * React components on page
 */

react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(mobx_react__WEBPACK_IMPORTED_MODULE_2__["Provider"], {
  rootStore: rootStore
}, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_leveltier_picker__WEBPACK_IMPORTED_MODULE_7__["LevelTierPicker"], null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_level_list__WEBPACK_IMPORTED_MODULE_6__["LevelListPanel"], null))), document.querySelector('#level-builder-react-component'));

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

/***/ "t8du":
/*!*************************************************************!*\
  !*** ./js/pages/results_framework/components/level_list.js ***!
  \*************************************************************/
/*! exports provided: LevelListPanel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LevelListPanel", function() { return LevelListPanel; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "TSYQ");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! mobx */ "2vnA");
/* harmony import */ var _fortawesome_fontawesome_svg_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @fortawesome/fontawesome-svg-core */ "7O5W");
/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ "IP2g");
/* harmony import */ var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons */ "wHSu");
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-select */ "y2Vs");
/* harmony import */ var _level_cards__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./level_cards */ "5Za8");
var _dec, _class, _dec2, _class2;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }










_fortawesome_fontawesome_svg_core__WEBPACK_IMPORTED_MODULE_4__["library"].add(_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_6__["faCaretDown"], _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_6__["faCaretRight"]);
var LevelList = (_dec = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["inject"])('rootStore'), _dec(_class = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class =
/*#__PURE__*/
function (_React$Component) {
  _inherits(LevelList, _React$Component);

  function LevelList() {
    _classCallCheck(this, LevelList);

    return _possibleConstructorReturn(this, _getPrototypeOf(LevelList).apply(this, arguments));
  }

  _createClass(LevelList, [{
    key: "render",
    value: function render() {
      var _this = this;

      var renderList = [];

      if (this.props.renderList == 'initial') {
        renderList = this.props.rootStore.levelStore.sortedLevels.filter(function (level) {
          return ['root', null].indexOf(level.parent) != -1;
        });
      } else {
        renderList = this.props.renderList.sort(function (a, b) {
          return a.customsort - b.customsort;
        });
      }

      return renderList.map(function (elem) {
        var card = '';

        if (_this.props.rootStore.uiStore.expandedCards.indexOf(elem.id) !== -1) {
          card = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_level_cards__WEBPACK_IMPORTED_MODULE_8__["LevelCardExpanded"], {
            level: elem,
            levelProps: _this.props.rootStore.levelStore.levelProperties[elem.id]
          });
        } else {
          card = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_level_cards__WEBPACK_IMPORTED_MODULE_8__["LevelCardCollapsed"], {
            level: elem,
            levelProps: _this.props.rootStore.levelStore.levelProperties[elem.id]
          });
        }

        var children = _this.props.rootStore.levelStore.sortedLevels.filter(function (level) {
          return level.parent == elem.id;
        });

        var childLevels = null;

        if (children.length > 0) {
          childLevels = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LevelList, {
            rootStore: _this.props.rootStore,
            renderList: children
          });
        }

        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          key: elem.id,
          className: "leveltier--new"
        }, card, childLevels);
      });
    }
  }]);

  return LevelList;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component)) || _class) || _class);
var LevelListPanel = (_dec2 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["inject"])('rootStore'), _dec2(_class2 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class2 =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(LevelListPanel, _React$Component2);

  function LevelListPanel() {
    _classCallCheck(this, LevelListPanel);

    return _possibleConstructorReturn(this, _getPrototypeOf(LevelListPanel).apply(this, arguments));
  }

  _createClass(LevelListPanel, [{
    key: "render",
    value: function render() {
      if (this.props.rootStore.levelStore.levels.length == 0) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          className: "level-list-panel"
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          className: "level-list-panel__dingbat"
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "fas fa-sitemap"
        })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          className: "level-list-panel__text text-large"
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", {
          className: "text-danger"
        }, "Choose your results framework template carefully!"), " Once you begin building your framework, it will not be possible to change templates without first deleting all saved levels."));
      } else {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          id: "level-list",
          style: {
            flexGrow: "2"
          }
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LevelList, {
          renderList: "initial"
        }));
      }
    }
  }]);

  return LevelListPanel;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component)) || _class2) || _class2);

/***/ })

},[["QTZG","runtime","vendors"]]]);
//# sourceMappingURL=results_framework-770eadeab93ea3562329.js.map