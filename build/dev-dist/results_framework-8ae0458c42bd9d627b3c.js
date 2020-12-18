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
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-select */ "Cs6D");
/* harmony import */ var _components_helpPopover__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../components/helpPopover */ "4L+s");
/* harmony import */ var _level_tier_lists__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./level_tier_lists */ "K0Bk");
var _dec, _class, _temp;

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







var Picker = (_dec = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('rootStore'), _dec(_class = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class = (_temp = /*#__PURE__*/function (_React$Component) {
  _inherits(Picker, _React$Component);

  var _super = _createSuper(Picker);

  function Picker() {
    var _this;

    _classCallCheck(this, Picker);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

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
        var firstTier = this.props.rootStore.levelStore.chosenTierSet[0];
        var secondTier = this.props.rootStore.levelStore.chosenTierSet[1];
        helpIcon = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_helpPopover__WEBPACK_IMPORTED_MODULE_4__["default"], {
          key: 1 // # Translators: Warning message displayed to users explaining why they can't change a setting they could change before.
          ,
          content: interpolate(gettext('<span class="text-danger"><strong>The results framework template is locked as soon as the first %(secondTier)s is saved.</strong></span> To change templates, all saved levels must be deleted except for the original %(firstTier)s. A level can only be deleted when it has no sub-levels and no linked indicators.'), {
            secondTier: secondTier,
            firstTier: firstTier
          }, true)
        });
      } else if (this.props.rootStore.uiStore.tierLockStatus == "primed") {
        helpIcon = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_helpPopover__WEBPACK_IMPORTED_MODULE_4__["default"], {
          key: 2,
          content: this.props.rootStore.uiStore.splashWarning
        });
      }

      var tierTemplates = this.props.rootStore.levelStore.tierTemplates;

      var custom = tierTemplates.custom,
          templateVals = _objectWithoutProperties(tierTemplates, ["custom"]);

      var options = Object.keys(templateVals).sort().map(function (key) {
        return {
          value: key,
          label: tierTemplates[key]['name']
        };
      });
      options.push({
        label: "-----------------------------------------------------------",
        options: [{
          value: this.props.rootStore.levelStore.customTierSetKey,
          label: custom['name']
        }]
      });
      var selectedOption = {
        value: this.props.rootStore.levelStore.chosenTierSetKey,
        label: this.props.rootStore.levelStore.chosenTierSetName
      };
      var classes = "leveltier-picker__selectbox ";
      classes += this.props.rootStore.uiStore.tierLockStatus == "locked" ? "leveltier-picker__selectbox--disabled" : "";
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: classes
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", null, gettext('Results framework template')), "\xA0", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("small", null, helpIcon), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_3__["default"], {
        maxMenuHeight: 350,
        options: options,
        value: selectedOption,
        isDisabled: this.props.rootStore.uiStore.tierLockStatus == "locked",
        isSearchable: false,
        onChange: this.handleChange
      })));
    }
  }]);

  return Picker;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp)) || _class) || _class);

var ChangeLogLink = function ChangeLogLink(_ref) {
  var programId = _ref.programId;
  var url = "/tola_management/audit_log/".concat(programId, "/");
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "leveltier-picker__change-log-link-box"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
    href: url,
    className: "btn-link"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
    className: "fas fa-history"
  }), " ", gettext('Change log')));
};

var LevelTierPicker = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])("rootStore")(Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (props) {
  var tierListType = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_level_tier_lists__WEBPACK_IMPORTED_MODULE_5__["StaticLevelTierList"], null);

  if (this.props.rootStore.levelStore.chosenTierSetKey == this.props.rootStore.levelStore.customTierSetKey && !this.props.rootStore.levelStore.useStaticTierList && this.props.rootStore.levelStore.hasEditPermissions) {
    tierListType = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_level_tier_lists__WEBPACK_IMPORTED_MODULE_5__["EditableLevelTierList"], null);
  }

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    id: "leveltier-picker",
    className: "leveltier-picker"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "leveltier-picker__panel"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Picker, null), tierListType), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeLogLink, {
    programId: props.rootStore.levelStore.program_id
  }));
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
/* harmony import */ var _components_indicatorModalComponents__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../components/indicatorModalComponents */ "hzyr");
/* harmony import */ var react_sortable_hoc__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-sortable-hoc */ "YJCA");
/* harmony import */ var _components_helpPopover__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../components/helpPopover */ "4L+s");
/* harmony import */ var react_autosize_textarea__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-autosize-textarea */ "O6Fj");
/* harmony import */ var react_autosize_textarea__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(react_autosize_textarea__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react-select */ "Cs6D");
/* harmony import */ var _components_changesetNotice__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../components/changesetNotice */ "4a4Y");
var _dec, _class, _temp, _dec2, _class3, _temp2, _dec3, _class5, _dec4, _class6;

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















_fortawesome_fontawesome_svg_core__WEBPACK_IMPORTED_MODULE_4__["library"].add(_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_6__["faCaretDown"], _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_6__["faCaretRight"], _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_6__["faArrowsAlt"]);
var LevelTitle = /*#__PURE__*/function (_React$Component) {
  _inherits(LevelTitle, _React$Component);

  var _super = _createSuper(LevelTitle);

  function LevelTitle() {
    _classCallCheck(this, LevelTitle);

    return _super.apply(this, arguments);
  }

  _createClass(LevelTitle, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h3", {
        className: 'level-title ' + this.props.classes
      }, this.props.tierName, this.props.ontologyLabel ? " " + this.props.ontologyLabel : null);
    }
  }]);

  return LevelTitle;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

var ProgramObjectiveImport = /*#__PURE__*/function (_React$Component2) {
  _inherits(ProgramObjectiveImport, _React$Component2);

  var _super2 = _createSuper(ProgramObjectiveImport);

  function ProgramObjectiveImport() {
    var _this;

    _classCallCheck(this, ProgramObjectiveImport);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super2.call.apply(_super2, [this].concat(args));

    _this.onChange = function (item) {
      _this.props.onProgramObjectiveImport(item.value);
    };

    return _this;
  }

  _createClass(ProgramObjectiveImport, [{
    key: "render",
    value: function render() {
      var programObjectives = this.props.programObjectives; // hide if no objectives to import

      if (programObjectives.length === 0) return null;
      var options = programObjectives.map(function (entry) {
        return {
          value: entry.id,
          label: entry.name
        };
      });
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "program-objective-import mb-3"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_12__["default"] // # Translators: Take the text of a program objective and import it for editing
      , {
        placeholder: gettext('Import Program Objective'),
        onChange: this.onChange,
        value: "",
        className: "tola-react-select",
        options: options,
        isDisabled: this.props.isDisabled
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        className: "program-objective-import__icon",
        tabIndex: "0",
        "data-html": "true",
        "data-toggle": "popover",
        "data-placement": "bottom",
        "data-trigger": "focus",
        "data-content":
        /* # Translators: instructions to users containing some HTML */
        gettext("Import text from a Program Objective. <strong class='program-objective-import__popover-strong-text'>Make sure to remove levels and numbers from your text, because they are automatically displayed.</strong>"),
        onClick: function onClick(e) {
          return e.preventDefault();
        }
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "far fa-question-circle"
      })));
    }
  }]);

  return ProgramObjectiveImport;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

var LevelCardCollapsed = (_dec = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["inject"])('rootStore'), _dec(_class = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class = (_temp = /*#__PURE__*/function (_React$Component3) {
  _inherits(LevelCardCollapsed, _React$Component3);

  var _super3 = _createSuper(LevelCardCollapsed);

  function LevelCardCollapsed() {
    var _this2;

    _classCallCheck(this, LevelCardCollapsed);

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    _this2 = _super3.call.apply(_super3, [this].concat(args));

    _this2.deleteLevel = function () {
      _this2.props.rootStore.uiStore.setDisableCardActions(true);

      var levelTitle = _this2.props.levelProps.tierName + " " + _this2.props.levelProps.ontologyLabel;
      Object(_components_changesetNotice__WEBPACK_IMPORTED_MODULE_13__["create_unified_changeset_notice"])({
        header: gettext("Warning"),
        show_icon: true,
        notice_type: 'error',
        preamble: gettext("This action cannot be undone."),

        /* # Translators:  This is a confirmation prompt that is triggered by clicking on a delete button. The code is a reference to the name of the specific item being deleted.  Only one item can be deleted at a time. */
        message_text: interpolate(gettext("Are you sure you want to delete %s?"), [levelTitle]),
        on_submit: function on_submit() {
          return _this2.props.rootStore.levelStore.deleteLevelFromDB(_this2.props.level.id);
        },
        on_cancel: function on_cancel() {
          return _this2.props.rootStore.uiStore.setDisableCardActions(false);
        }
      });
    };

    _this2.editLevel = function () {
      _this2.props.rootStore.uiStore.editCard(_this2.props.level.id);
    };

    _this2.buildIPTTUrl = function (indicator_ids) {
      var url = "/indicators/iptt_report/".concat(_this2.props.rootStore.levelStore.program_id, "/timeperiods/?frequency=3&start=0&end=999");
      indicator_ids.forEach(function (i) {
        return url += "&indicators=" + i;
      });
      return url;
    };

    return _this2;
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
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState, snapshot) {
      // Enable popovers after update (they break otherwise)
      $('*[data-toggle="popover"]').popover({
        html: true
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

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
        /* # Translators: this link opens a view of all indicators linked to (associated with) a particular level (level name replaces %s) */
        var linkPreface = gettext('All indicators linked to %s');
        var linkText = interpolate(linkPreface, ["".concat(this.props.levelProps.tierName, " ").concat(this.props.levelProps.ontologyLabel)]);
        allIndicatorLinks.push("<li class=\"nav-item level-card--iptt-links\"><a href=".concat(this.buildIPTTUrl(sameLevelIndicatorIds), ">").concat(linkText, "</a></li>"));
      } // Get indicator ids linked to the descendants of this level, add the indicator ids identified
      // above, and create a hyperlink for a filtered IPTT.  Only do this if the level has sublevels.


      if (this.props.levelProps.tierName != this.props.rootStore.levelStore.chosenTierSet.slice(-1)[0]) {
        var descendantIndicatorIds = this.props.levelProps.descendantIndicatorIds;

        if (descendantIndicatorIds.length > 0) {
          descendantIndicatorIds = descendantIndicatorIds.concat(sameLevelIndicatorIds);
          /* # Translators: this link opens a view of all indicators linked to (associated with) a particular level and its child levels (level name replaces %s) */

          var _linkPreface = gettext('All indicators linked to %s and sub-levels');

          var _linkText = interpolate(_linkPreface, ["".concat(this.props.levelProps.tierName, " ").concat(this.props.levelProps.ontologyLabel)]);

          allIndicatorLinks.unshift("<li class=\"nav-item level-card--iptt-links\"><a href=".concat(this.buildIPTTUrl(descendantIndicatorIds), ">").concat(_linkText, "</a></li>"));
        }
      } // Create IPTT hyperlinks for each individual indicator linked to this level


      var individualLinks = this.props.levelProps.indicators.sort(function (a, b) {
        return a.level_order - b.level_order;
      }).map(function (indicator, index) {
        var indicatorNumber = "";

        if (!_this3.props.rootStore.levelStore.manual_numbering) {
          indicatorNumber = _this3.props.levelProps.ontologyLabel + String.fromCharCode(97 + index) + ": ";
        } else if (_this3.props.rootStore.levelStore.manual_numbering && indicator.number) {
          indicatorNumber = indicator.number + ": ";
        }

        return "<li class=\"nav-item level-card--iptt-links\"><a href=".concat(_this3.buildIPTTUrl([indicator.id]), ">").concat(indicatorNumber).concat(indicator.name, "</a></li>");
      });
      allIndicatorLinks = allIndicatorLinks.concat(individualLinks);
      var indicatorMarkup = "<ul class=\"nav flex-column\">".concat(allIndicatorLinks.join(""), "</ul>");
      var iCount = this.props.levelProps.indicators.length;
      /* # Translators: This is a count of indicators associated with another object */

      var indicatorCountText = interpolate(ngettext("%s indicator", "%s indicators", iCount), [iCount]); // The expando caret is only applied to levels that:
      // 1. Aren't at the end of the leveltier hierarchy
      // 2. Actually have children
      // The expando click should be disabled when there is a card being edited

      var expando = null;

      if (this.props.levelProps.tierName != Object(mobx__WEBPACK_IMPORTED_MODULE_3__["toJS"])(this.props.rootStore.levelStore.chosenTierSet.slice(-1)[0]) && this.props.rootStore.levelStore.levels.filter(function (l) {
        return l.parent == _this3.props.level.id;
      }).length > 0) {
        expando = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_5__["FontAwesomeIcon"], {
          className: this.props.rootStore.uiStore.disabledActionsOrActiveCard ? "" : "text-action",
          icon: this.props.rootStore.uiStore.hasVisibleChildren.indexOf(this.props.level.id) >= 0 ? 'caret-down' : 'caret-right'
        });
      }

      var expandoClasses = expando && !this.props.rootStore.uiStore.disabledActionsOrActiveCard ? "level-card__toggle" : null;
      var expandoFunc = this.props.rootStore.uiStore.disabledActionsOrActiveCard ? null : function (e) {
        return _this3.props.rootStore.uiStore.updateVisibleChildren(_this3.props.level.id);
      };
      var isIndicatorDropdownDisabled = allIndicatorLinks.length === 0 || this.props.rootStore.uiStore.disableCardActions;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "level-card level-card--collapsed",
        id: "level-card-".concat(this.props.level.id)
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: expandoClasses,
        onClick: expandoFunc
      }, expando, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "level-card--collapsed__name"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LevelTitle, {
        tierName: this.props.levelProps.tierName,
        ontologyLabel: this.props.levelProps.ontologyLabel,
        classes: "level-title--collapsed"
      }), "\xA0", this.props.level.name)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "level-card--collapsed__actions"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "actions__top btn-row"
      }, this.props.levelProps.canDelete && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        disabled: this.props.rootStore.uiStore.disableCardActions || this.props.rootStore.uiStore.activeCard,
        className: "btn btn-sm btn-link btn-danger",
        onClick: this.deleteLevel
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-trash-alt"
      }), gettext("Delete")), this.props.levelProps.canEdit && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        disabled: this.props.rootStore.uiStore.disableCardActions,
        className: "btn btn-sm btn-link btn-text edit-button",
        onClick: this.editLevel
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-edit"
      }), gettext("Edit"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "actions__bottom"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        tabIndex: "0",
        className: classnames__WEBPACK_IMPORTED_MODULE_1___default()("btn btn-sm btn-link no-bold", {
          disabled: isIndicatorDropdownDisabled
        }),
        "data-toggle": "popover",
        "data-trigger": "focus",
        "data-placement": "bottom",
        "data-html": "true",
        title:
        /* # Translators: this is the title of a button to open a popup with indicator performance metrics*/
        gettext("Track indicator performance"),
        "data-content": indicatorMarkup
      }, indicatorCountText))));
    }
  }]);

  return LevelCardCollapsed;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp)) || _class) || _class);
var LevelCardExpanded = (_dec2 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["inject"])('rootStore'), _dec2(_class3 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class3 = (_temp2 = /*#__PURE__*/function (_React$Component4) {
  _inherits(LevelCardExpanded, _React$Component4);

  var _super4 = _createSuper(LevelCardExpanded);

  function LevelCardExpanded(props) {
    var _this4;

    _classCallCheck(this, LevelCardExpanded);

    _this4 = _super4.call(this, props);

    _this4.onDragEnd = function (_ref) {
      var oldIndex = _ref.oldIndex,
          newIndex = _ref.newIndex;
      _this4.indicatorWasReordered = true;
      var indicatorId = _this4.indicators[oldIndex].id;
      var fakeChangeObj = {
        value: newIndex + 1,
        name: newIndex + 1
      };

      _this4.changeIndicatorOrder(indicatorId, fakeChangeObj);
    };

    _this4.changeIndicatorOrder = function (indicatorId, changeObj) {
      var oldIndex = _this4.indicators.find(function (i) {
        return i.id == indicatorId;
      }).level_order;

      var newIndex = changeObj.value - 1;

      var tempIndicators = _this4.indicators.slice();

      tempIndicators.splice(newIndex, 0, tempIndicators.splice(oldIndex, 1)[0]);
      tempIndicators.forEach(function (indicator, index) {
        return indicator.level_order = index;
      });

      _this4.indicators.replace(tempIndicators);

      _this4.props.rootStore.uiStore.activeCardNeedsConfirm = _this4.dataHasChanged;
      _this4.indicatorWasReordered = true;
    };

    _this4.updateSubmitType = function (newType) {
      _this4.submitType = newType;
    };

    _this4.saveLevel = function (event) {
      event.preventDefault();

      var saveFunc = function saveFunc(rationale) {
        _this4.props.rootStore.levelStore.saveLevelToDB(_this4.submitType, _this4.props.level.id, _this4.indicatorWasReordered, {
          name: _this4.name,
          assumptions: _this4.assumptions,
          rationale: rationale,
          indicators: Object(mobx__WEBPACK_IMPORTED_MODULE_3__["toJS"])(_this4.indicators)
        });
      };

      var hasIndicators = _this4.indicators.length > 0;
      var hasUpdatedAssumptions = _this4.props.level.assumptions.length > 0 && _this4.assumptions != _this4.props.level.assumptions;
      var hasUpdatedName = _this4.name != _this4.props.level.name;

      if (hasIndicators && (hasUpdatedAssumptions || hasUpdatedName)) {
        Object(_components_changesetNotice__WEBPACK_IMPORTED_MODULE_13__["create_unified_changeset_notice"])({
          header: gettext("Reason for change"),
          show_icon: true,
          message_text: gettext("Your changes will be recorded in a change log.  For future reference, please share your reason for these changes."),
          include_rationale: true,
          rationale_required: true,
          notice_type: 'notice',
          on_submit: saveFunc,
          on_cancel: function on_cancel() {
            return _this4.props.rootStore.uiStore.setDisableCardActions(false);
          }
        });
      } else {
        saveFunc('');
      }
    };

    _this4.cancelEdit = function () {
      if (_this4.props.rootStore.levelStore.levels.length == 1 && _this4.props.level.id == "new") {
        _this4.clearData();
      } else {
        _this4.props.rootStore.levelStore.cancelEdit(_this4.props.level.id);
      }
    };

    _this4.clearData = function () {
      _this4.name = "";
      _this4.assumptions = "";
    };

    _this4.onFormChange = function (event) {
      event.preventDefault();
      _this4[event.target.name] = event.target.value; // Add inline error message if name field is blanked out

      if (!_this4.name) {
        var target = $("#level-name-".concat(_this4.props.level.id));
        target.addClass("is-invalid");
        /* # Translators: This is a validation message given to the user when the user-editable name field has been deleted or omitted. */

        var feedbackText = gettext('Please complete this field.');
        target.after("<p id=name-feedback-".concat(_this4.props.level.id, " class=\"invalid-feedback\">").concat(feedbackText, "</p>"));
      } else {
        $("#level-name-".concat(_this4.props.level.id)).removeClass("is-invalid");
        $("#name-feedback-".concat(_this4.props.level.id)).remove();
      }

      _this4.props.rootStore.uiStore.activeCardNeedsConfirm = _this4.dataHasChanged;
    };

    _this4.onProgramObjectiveImport = function (programObjectiveId) {
      var programObjective = _this4.props.rootStore.levelStore.programObjectives.find(function (po) {
        return po.id === programObjectiveId;
      });

      if (programObjective != null) {
        _this4.name = programObjective.name;
        _this4.assumptions = programObjective.description;
      }
    };

    _this4.submitType = "saveOnly";
    _this4.indicatorWasReordered = false; // These 'base' vars will allow us to save orignalish data so we know whether to prompt users if they hit cancel.
    // baseIndicators will need to be updated on indicator changes other than reordering since we don't
    // want to warn for e.g. indicator creation, since users can't do anything about that.

    _this4.baseLevelString = JSON.stringify([props.level.name, props.level.assumptions]);
    _this4.baseIndicators = _this4.props.levelProps.indicators.slice().map(function (i) {
      return Object(mobx__WEBPACK_IMPORTED_MODULE_3__["toJS"])(i);
    });
    Object(mobx__WEBPACK_IMPORTED_MODULE_3__["extendObservable"])(_assertThisInitialized(_this4), {
      name: props.level.name,
      assumptions: props.level.assumptions,
      indicators: props.levelProps.indicators.sort(function (a, b) {
        return a.level_order - b.level_order;
      }),

      get dataHasChanged() {
        var baseData = this.baseLevelString + JSON.stringify(this.baseIndicators.sort(function (a, b) {
          return a.id - b.id;
        }));
        var currentData = JSON.stringify([this.name, this.assumptions]) + JSON.stringify(Object(mobx__WEBPACK_IMPORTED_MODULE_3__["toJS"])(this.indicators).sort(function (a, b) {
          return a.id - b.id;
        }));
        return currentData != baseData;
      },

      addIndicator: function addIndicator(data) {
        this.indicators.push(data);
        this.baseIndicators.push(data);
      },
      deleteIndicator: function deleteIndicator(indicatorId) {
        this.indicators = this.indicators.filter(function (i) {
          return i.id != indicatorId;
        });
        this.indicators.forEach(function (indicator, index) {
          return indicator.level_order = index;
        });
        this.baseIndicators = this.baseIndicators.filter(function (i) {
          return i.id != indicatorId;
        });
        this.baseIndicators.forEach(function (indicator, index) {
          return indicator.level_order = index;
        });
      },
      updateIndicatorName: function updateIndicatorName(indicatorId, newName) {
        this.indicators.find(function (i) {
          return i.id == indicatorId;
        }).name = newName;
        this.baseIndicators.find(function (i) {
          return i.id == indicatorId;
        }).name = newName;
        this.props.rootStore.levelStore.updateIndicatorNameInStore(indicatorId, newName);
      }
    }, {
      addIndicator: mobx__WEBPACK_IMPORTED_MODULE_3__["action"],
      deleteIndicator: mobx__WEBPACK_IMPORTED_MODULE_3__["action"],
      updateIndicatorName: mobx__WEBPACK_IMPORTED_MODULE_3__["action"]
    });
    return _this4;
  }

  _createClass(LevelCardExpanded, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      // Enable popovers after update.  This is needed for the help popover in the indicator list section.
      // Without this, the popover doesnt' pop.
      $('*[data-toggle="popover"]').popover({
        html: true
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this5 = this;

      // Enable popovers after load (they break otherwise)
      $('*[data-toggle="popover"]').popover({
        html: true
      }); // Handle indicator creation.  Need to update rootStore and component store so if you close and reopen the card, you still see the new indicator

      $('#indicator_modal_div').on('created.tola.indicator.save', function (e, params) {
        var indicatorData = {
          id: params.indicatorId,
          name: params.indicatorName,
          level: _this5.props.level.id,
          level_order: _this5.indicators.length
        };

        _this5.props.rootStore.levelStore.addIndicatorToStore(indicatorData);

        _this5.addIndicator(indicatorData);
      }); // Handle indicator deletion.  Need to update rootStore and component store so if you close and reopen the card, you still see the new indicator

      $('#indicator_modal_div').on('deleted.tola.indicator.save', function (e, params) {
        _this5.props.rootStore.levelStore.deleteIndicatorFromStore(params.indicatorId);

        _this5.deleteIndicator(params.indicatorId);
      }); // Handle indicator update.  Need to update rootStore and component store so if you close and reopen the card, you still see the new indicator

      $('#indicator_modal_div').on('updated.tola.indicator.save', function (e, params) {
        _this5.updateIndicatorName(params.indicatorId, params.indicatorName);

        if (params.levelId != _this5.props.rootStore.uiStore.activeCard) {
          // Only add the indicator to another level if it wasn't blanked out
          if (params.levelId) {
            _this5.props.rootStore.levelStore.moveIndicatorInStore(params.indicatorId, params.levelId);
          }

          _this5.deleteIndicator(params.indicatorId);
        } // Need to remount the tooltip so it reflects a potential new name.  It's a big janky, should probably use a react component instead.


        $('*[data-toggle="tooltip"]').tooltip('dispose');
        $('*[data-toggle="tooltip"]').tooltip();
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      $('#indicator_modal_div').off('updated.tola.indicator.save');
      $('#indicator_modal_div').off('deleted.tola.indicator.save');
      $('#indicator_modal_div').off('created.tola.indicator.save');
    }
  }, {
    key: "render",
    value: function render() {
      var _this6 = this;

      // Need to reference a couple of observed vars so they react to changes.
      // Simply passing the observables through to a child component or injecting them in
      // the child component doesn't work.  No doubt that there's a better way to do this.
      var tempIndicators = Object(mobx__WEBPACK_IMPORTED_MODULE_3__["toJS"])(this.indicators);
      var disabledTrigger = this.props.rootStore.uiStore.disableCardActions;
      var programObjectives = this.props.rootStore.levelStore.programObjectives;
      var indicatorSection = "";

      if (this.props.level.id == "new") {
        indicatorSection = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          className: "form-group"
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
          type: "submit",
          disabled: this.name.length == 0 || disabledTrigger,
          className: "btn btn-link btn-lg ",
          onClick: function onClick(e) {
            _this6.updateSubmitType("saveAndEnableIndicators");
          }
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "fas fa-plus-circle"
        }), interpolate(gettext("Save %s and add indicators"), [this.props.levelProps.tierName])));
      } else {
        indicatorSection = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorList, {
          level: this.props.level,
          tierName: this.props.levelProps.tierName,
          indicators: this.indicators,
          disabled: !this.name || this.props.level.id == "new" || this.props.rootStore.uiStore.disableCardActions,
          reorderDisabled: this.indicators.length < 2 || this.props.rootStore.uiStore.disableCardActions,
          changeFunc: this.changeIndicatorOrder,
          dragEndFunc: this.onDragEnd
        });
      }

      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "level-card level-card--expanded",
        id: "level-card-".concat(this.props.level.id)
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "d-flex justify-content-between"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LevelTitle, {
        tierName: this.props.levelProps.tierName,
        ontologyLabel: this.props.levelProps.ontologyLabel,
        classes: "level-title--expanded"
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ProgramObjectiveImport, {
        isDisabled: this.props.rootStore.uiStore.disableCardActions,
        programObjectives: programObjectives,
        onProgramObjectiveImport: this.onProgramObjectiveImport
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("form", {
        className: "level-card--expanded__form",
        onSubmit: this.saveLevel
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_autosize_textarea__WEBPACK_IMPORTED_MODULE_11___default.a, {
        className: "form-control",
        id: "level-name-".concat(this.props.level.id),
        name: "name",
        value: this.name || "",
        disabled: this.props.rootStore.uiStore.disableCardActions,
        autoComplete: "off",
        rows: 3,
        onChange: this.onFormChange,
        maxLength: 500
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        htmlFor: "assumptions"
      }, gettext('Assumptions')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_autosize_textarea__WEBPACK_IMPORTED_MODULE_11___default.a, {
        className: "form-control",
        id: "level-assumptions",
        disabled: !this.name || this.props.rootStore.uiStore.disableCardActions,
        name: "assumptions",
        autoComplete: "off",
        value: this.assumptions || "",
        rows: 3,
        onChange: this.onFormChange
      })), indicatorSection, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ButtonBar, {
        level: this.props.level,
        levelProps: this.props.levelProps,
        submitFunc: this.updateSubmitType,
        cancelFunc: this.cancelEdit,
        nameVal: this.name,
        tierCount: this.props.rootStore.levelStore.chosenTierSet.length
      })));
    }
  }]);

  return LevelCardExpanded;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp2)) || _class3) || _class3);
var ButtonBar = (_dec3 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["inject"])('rootStore'), _dec3(_class5 = /*#__PURE__*/function (_React$Component5) {
  _inherits(ButtonBar, _React$Component5);

  var _super5 = _createSuper(ButtonBar);

  function ButtonBar() {
    _classCallCheck(this, ButtonBar);

    return _super5.apply(this, arguments);
  }

  _createClass(ButtonBar, [{
    key: "render",
    value: function render() {
      var isDisabled = !this.props.nameVal || this.props.rootStore.uiStore.disableCardActions; // Build the button text with the right sibling level name, then build the button.

      var addAnotherButton = null;

      if (this.props.level.parent != null && this.props.level.parent != "root") {
        {
          /* # Translators: On a button, with a tiered set of objects, save current object and add another one in the same tier, e.g. "Save and add another Outcome" when the user is editing an Outcome */
        }
        var buttonText = interpolate(gettext("Save and add another %s"), [this.props.levelProps.tierName]);
        addAnotherButton = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LevelButton, {
          disabled: isDisabled,
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

        addAndLinkButton = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LevelButton, {
          disabled: isDisabled,
          classes: "btn btn-primary",
          icon: "stream",
          text: _buttonText,
          submitType: "saveAndAddChild",
          submitFunc: this.props.submitFunc
        });
      }

      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "button-bar btn-row"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LevelButton, {
        disabled: isDisabled,
        classes: "btn-primary",
        text: gettext("Save and close"),
        icon: "save",
        submitType: "saveOnly",
        submitFunc: this.props.submitFunc
      }), addAnotherButton, addAndLinkButton, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LevelButton, {
        disabled: this.props.rootStore.uiStore.disableCardActions,
        classes: "btn btn-reset",
        text: gettext("Cancel"),
        submitType: "cancel",
        submitFunc: this.props.cancelFunc
      }));
    }
  }]);

  return ButtonBar;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component)) || _class5);

var LevelButton = /*#__PURE__*/function (_React$Component6) {
  _inherits(LevelButton, _React$Component6);

  var _super6 = _createSuper(LevelButton);

  function LevelButton() {
    _classCallCheck(this, LevelButton);

    return _super6.apply(this, arguments);
  }

  _createClass(LevelButton, [{
    key: "render",
    value: function render() {
      var _this7 = this;

      var buttonType = this.props.submitType == "cancel" ? "button" : "submit";
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        disabled: this.props.disabled,
        type: buttonType,
        className: this.props.classes + ' level-button btn btn-sm',
        onClick: function onClick() {
          return _this7.props.submitFunc(_this7.props.submitType);
        }
      }, this.props.text);
    }
  }]);

  return LevelButton;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

var IndicatorList = (_dec4 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["inject"])('rootStore'), _dec4(_class6 = /*#__PURE__*/function (_React$Component7) {
  _inherits(IndicatorList, _React$Component7);

  var _super7 = _createSuper(IndicatorList);

  function IndicatorList() {
    _classCallCheck(this, IndicatorList);

    return _super7.apply(this, arguments);
  }

  _createClass(IndicatorList, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // Enable popovers after update (they break otherwise)
      $('*[data-toggle="popover"]').popover({
        html: true
      });
      $('*[data-toggle="tooltip"]').tooltip();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      $('*[data-toggle="tooltip"]').tooltip();
    }
  }, {
    key: "render",
    value: function render() {
      var _this8 = this;

      // Create the list of indicators and the dropdowns for setting the indicator order
      var options = this.props.indicators.map(function (entry, index) {
        return {
          value: index + 1,
          label: index + 1
        };
      });
      var indicatorMarkup = this.props.indicators.map(function (indicator) {
        // let options = this.props.indicators.map( (entry, index) => <option value={index+1}>{index+1}</option>);
        var tipTemplate = '<div class="tooltip sortable-list__item__tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>';
        var indicator_label = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
          "data-toggle": "tooltip",
          "data-delay": 900,
          "data-template": tipTemplate,
          title: indicator.name
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, indicator.name.replace(/(.{55})..+/, "$1...")));
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_selectWidgets__WEBPACK_IMPORTED_MODULE_7__["SingleReactSelect"], {
          update: function update(value) {
            return _this8.props.changeFunc(indicator.id, value);
          },
          selectId: "ind" + indicator.id,
          labelClasses: " ",
          formRowClasses: "sortable-list__item__label",
          selectClasses: "sortable-list__item__select",
          value: {
            value: indicator.level_order,
            label: indicator.level_order + 1
          },
          label: indicator_label,
          options: options,
          disabled: _this8.props.disabled || _this8.props.reorderDisabled
        }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          className: "sortable-list__item__actions"
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_indicatorModalComponents__WEBPACK_IMPORTED_MODULE_8__["UpdateIndicatorButton"], {
          readonly: _this8.props.disabled || _this8.props.rootStore.uiStore.disableCardActions,
          label: gettext("Settings"),
          indicatorId: indicator.id
        })));
      }); // Conditionally set the other elements that are only visible when there are indicators

      var order = null;
      var helpLink = null;
      var migratedProgramPopOverContent =
      /* # Translators: Popover for help link telling users how to associate an Indicator not yet linked to a Level */
      gettext('To link an already saved indicator to your results framework: Open the indicator from the program page and use the “Result level” menu on the Summary tab.');
      /* # Translators: Popover for help link, tell user how to disassociate an Indicator from the Level they are currently editing. */

      var popOverContent = gettext('To remove an indicator: Click “Settings”, where you can reassign the indicator to a different level or delete it.');
      var usingResultsFramework = this.props.rootStore.levelStore.usingResultsFramework;
      var popOverStr = !usingResultsFramework ? migratedProgramPopOverContent + '<br><br>' + popOverContent : popOverContent;

      if (this.props.indicators.length > 0 || !usingResultsFramework) {
        order = "Order";
        helpLink = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_helpPopover__WEBPACK_IMPORTED_MODULE_10__["default"], {
          content: popOverStr,
          placement: "bottom"
        });
      }

      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "level-card--indicator-links".concat(this.props.disabled ? " disabled" : "")
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "indicator-links__header"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h4", null, interpolate(gettext("Indicators linked to this %s"), [this.props.tierName])), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, helpLink)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "sortable-list-group"
      }, this.props.indicators.length > 0 ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "sortable-list-header"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "sortable-list-header__drag-handle"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_5__["FontAwesomeIcon"], {
        icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_6__["faArrowsAlt"]
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "sortable-list-header__label"
      }, order), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "sortable-list-header__actions"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-cog"
      }), " ", gettext("Settings"))) : null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SortableContainer, {
        onSortEnd: this.props.dragEndFunc,
        useDragHandle: true,
        lockAxis: "y",
        lockToContainerEdges: true
      }, indicatorMarkup.map(function (value, index) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SortableItem, {
          key: "item-".concat(index),
          index: index,
          value: value,
          disabled: _this8.props.disabled || _this8.props.reorderDisabled
        });
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "sortable-list-actions"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_indicatorModalComponents__WEBPACK_IMPORTED_MODULE_8__["AddIndicatorButton"], {
        readonly: !this.props.level.id || this.props.level.id == 'new' || this.props.disabled || this.props.rootStore.uiStore.disableCardActions,
        programId: this.props.rootStore.levelStore.program_id,
        levelId: this.props.level.id
      }))));
    }
  }]);

  return IndicatorList;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component)) || _class6);
var SortableItem = Object(react_sortable_hoc__WEBPACK_IMPORTED_MODULE_9__["sortableElement"])(function (_ref2) {
  var value = _ref2.value;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
    className: "sortable-list__item"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(DragHandle, null), value);
});
var SortableContainer = Object(react_sortable_hoc__WEBPACK_IMPORTED_MODULE_9__["sortableContainer"])(function (_ref3) {
  var children = _ref3.children;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", {
    className: "sortable-list"
  }, children);
});
var DragHandle = Object(react_sortable_hoc__WEBPACK_IMPORTED_MODULE_9__["sortableHandle"])(function () {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "sortable-list__item__drag-handle"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_5__["FontAwesomeIcon"], {
    icon: _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_6__["faArrowsAlt"]
  }));
});

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
/* harmony import */ var _components_changesetNotice__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../components/changesetNotice */ "4a4Y");
var _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _temp, _class3, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, _descriptor25, _descriptor26, _descriptor27, _descriptor28, _descriptor29, _descriptor30, _descriptor31, _descriptor32, _descriptor33, _temp2;

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }




var RootStore = function RootStore(program, levels, indicators, levelTiers, tierTemplates, englishTemplates, customTemplates, programObjectives, accessLevel, usingResultsFramework, maxTiers) {
  _classCallCheck(this, RootStore);

  this.levelStore = new LevelStore(program, levels, indicators, levelTiers, tierTemplates, englishTemplates, customTemplates, programObjectives, accessLevel, usingResultsFramework, maxTiers, this);
  this.uiStore = new UIStore(this);
};
var LevelStore = (_class = (_temp = /*#__PURE__*/function () {
  function LevelStore(program, levels, _indicators, levelTiers, tierTemplates, englishTemplates, customTemplates, programObjectives, accessLevel, usingResultsFramework, maxTiers, rootStore) {
    var _this = this;

    _classCallCheck(this, LevelStore);

    _initializerDefineProperty(this, "levels", _descriptor, this);

    _initializerDefineProperty(this, "indicators", _descriptor2, this);

    _initializerDefineProperty(this, "chosenTierSetKey", _descriptor3, this);

    _initializerDefineProperty(this, "useStaticTierList", _descriptor4, this);

    _initializerDefineProperty(this, "formErrors", _descriptor5, this);

    _initializerDefineProperty(this, "tierTemplates", _descriptor6, this);

    this.program_id = void 0;
    this.tierTemplates = void 0;
    this.programObjectives = void 0;
    this.defaultTemplateKey = "";
    this.customTierSetKey = "";
    this.accessLevel = false;
    this.usingResultsFramework = void 0;
    this.monitorHeaderLink = Object(mobx__WEBPACK_IMPORTED_MODULE_0__["autorun"])(function (reaction) {
      var headerSpan = $("#rf_builder_header");
      var linkedFlag = headerSpan.children("a").length > 0;

      if (_this.indicators.length > 0 && !linkedFlag) {
        var headerText = headerSpan.text();
        headerSpan.html("<a href=\"/program/".concat(_this.program_id, "/\">").concat(headerText, "</a>"));
      } else if (_this.indicators.length == 0 && linkedFlag) {
        var _headerText = $("#rf_builder_header > a").text();

        headerSpan.text(_headerText);
      } // delay is needed to prevent undefined value from being used for program_id that isn't set yet on first load.

    }, {
      delay: 50
    });

    _initializerDefineProperty(this, "updateCustomTier", _descriptor7, this);

    _initializerDefineProperty(this, "addCustomTier", _descriptor8, this);

    _initializerDefineProperty(this, "deleteCustomTier", _descriptor9, this);

    _initializerDefineProperty(this, "applyTierSet", _descriptor10, this);

    _initializerDefineProperty(this, "editTierSet", _descriptor11, this);

    this.saveCustomTemplateToDB = function () {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      // TODO: Find a better way to handle options.  e.g. return a promise to the applyTierSet function and force it to do the alerting.
      var addTier = options.addTier,
          isDeleting = options.isDeleting,
          shouldAlert = options.shouldAlert;

      if (!isDeleting) {
        _this.rootStore.uiStore.validateCustomTiers();

        if (_this.rootStore.uiStore.customFormErrors.hasErrors) return;
      }

      var tiersToSave = _toConsumableArray(_this.tierTemplates[_this.customTierSetKey]['tiers']);

      if (tiersToSave[0].length === 0) {
        tiersToSave = null;
      }

      var data = {
        program_id: _this.program_id,
        tiers: tiersToSave
      };
      _api_js__WEBPACK_IMPORTED_MODULE_1__["api"].post("/save_custom_template/", data).then(function (response) {
        // Only notify of success if the tiers have changed.
        if (shouldAlert) {
          success_notice({
            /* # Translators: Notification to user that the update they initiated was successful */
            message_text: gettext("Changes to the results framework template were saved."),
            addClass: 'program-page__rationale-form',
            stack: {
              dir1: 'up',
              dir2: 'right',
              firstpos1: 20,
              firstpos2: 20
            }
          });
        }

        if (addTier) {
          // Protect against "Add level" button smashing by checking if the last value of the tier set is an empty string.
          if (_this.chosenTierSet.slice(-1) != "") {
            _this.chosenTierSet.push("");
          }
        }

        _this.rootStore.uiStore.setAddLevelButtonLockedStatus(false);
      })["catch"](function (error) {
        _this.rootStore.uiStore.setAddLevelButtonLockedStatus(false);

        console.log('error', error);
      });
    };

    _initializerDefineProperty(this, "cancelEdit", _descriptor12, this);

    _initializerDefineProperty(this, "createNewLevelFromSibling", _descriptor13, this);

    _initializerDefineProperty(this, "createNewLevelFromParent", _descriptor14, this);

    _initializerDefineProperty(this, "createFirstLevel", _descriptor15, this);

    this.saveLevelTiersToDB = function () {
      var tier_data = {
        program_id: _this.program_id
      };

      if (_this.chosenTierSetKey === _this.customTierSetKey) {
        tier_data.tiers = _this.chosenTierSet;
      } else {
        tier_data.tiers = _this.englishTierTemlates[_this.chosenTierSetKey]['tiers'];
      } // Need to catch errors for this


      return _api_js__WEBPACK_IMPORTED_MODULE_1__["api"].post("/save_leveltiers/", tier_data);
    };

    this.deleteLevelFromDB = function (levelId) {
      var level_label = "".concat(_this.levelProperties[levelId]['tierName'], " ").concat(_this.levelProperties[levelId]['ontologyLabel']);
      _api_js__WEBPACK_IMPORTED_MODULE_1__["api"]["delete"]("/level/".concat(levelId)).then(function (response) {
        _this.levels.replace(response.data);

        _this.rootStore.uiStore.activeCard = null;

        if (_this.levels.length == 0) {
          _this.createFirstLevel();
        }

        success_notice({
          /* # Translators: Notification to user that the deletion command that they issued was successful */
          message_text: interpolate(gettext("%s was deleted."), [level_label]),
          addClass: 'program-page__rationale-form',
          stack: {
            dir1: 'up',
            dir2: 'right',
            firstpos1: 20,
            firstpos2: 20
          }
        });
      })["catch"](function (error) {
        return console.log('error', error);
      });

      _this.rootStore.uiStore.setDisableCardActions(false);
    };

    this.saveLevelToDB = function (submitType, levelId, indicatorWasUpdated, formData) {
      // if indicators have been updated, call a separate save method and remove the data from object that will be sent with the level saving post request
      if (indicatorWasUpdated) {
        _this.saveReorderedIndicatorsToDB(formData.indicators);
      }

      delete formData.indicators; // Now process the save differently depending on if it's a new level or a pre-existing one.

      var targetLevel = _this.levels.find(function (level) {
        return level.id == levelId;
      });

      var level_label = "".concat(_this.levelProperties[levelId].tierName, " ").concat(_this.levelProperties[levelId].ontologyLabel);
      var levelToSave = Object.assign(Object(mobx__WEBPACK_IMPORTED_MODULE_0__["toJS"])(targetLevel), formData);
      var levelDataWasUpdated = _this.rootStore.uiStore.activeCardNeedsConfirm;

      if (levelId == "new") {
        if (levelToSave.parent == "root") {
          $('#logframe_link').show();
        } // Don't need id, since it will be "new", and don't need rationale, since it's a new level.


        delete levelToSave.id;
        delete levelToSave.rationale;
        _api_js__WEBPACK_IMPORTED_MODULE_1__["api"].post("/insert_new_level/", levelToSave).then(function (response) {
          Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
            _this.levels.replace(response.data['all_data']);
          });
          success_notice({
            // # Translators: This is a confirmation message that confirms that change has been successfully saved to the DB.
            message_text: interpolate(gettext("%s saved."), [level_label]),
            addClass: 'program-page__rationale-form',
            stack: {
              dir1: 'up',
              dir2: 'right',
              firstpos1: 20,
              firstpos2: 20
            }
          });
          var newId = response.data["new_level"]["id"];
          _this.rootStore.uiStore.activeCard = null;

          if (submitType == "saveAndEnableIndicators") {
            Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
              _this.rootStore.uiStore.activeCard = newId;
            });
          } else if (submitType == "saveAndAddSibling") {
            _this.createNewLevelFromSibling(newId);
          } else if (submitType == "saveAndAddChild") {
            _this.createNewLevelFromParent(newId);
          }
        })["catch"](function (error) {
          return console.log('error', error);
        });
      } else {
        _api_js__WEBPACK_IMPORTED_MODULE_1__["api"].put("/level/".concat(levelId, "/"), levelToSave).then(function (response) {
          if (levelDataWasUpdated || indicatorWasUpdated) {
            success_notice({
              // # Translators:  Confirmation message that user-supplied updates were successfully applied.
              message_text: interpolate(gettext("%s updated."), [level_label]),
              addClass: 'program-page__rationale-form',
              stack: {
                dir1: 'up',
                dir2: 'right',
                firstpos1: 20,
                firstpos2: 20
              }
            });
          }

          Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
            Object.assign(targetLevel, response.data);
          });
          _this.rootStore.uiStore.activeCard = null;

          if (submitType == "saveAndAddSibling") {
            _this.createNewLevelFromSibling(levelId);
          } else if (submitType == "saveAndAddChild") {
            _this.createNewLevelFromParent(levelId);
          }
        })["catch"](function (error) {
          console.log("There was an error:", error);
        });
      }

      _this.fetchIndicatorsFromDB();

      _this.rootStore.uiStore.activeCardNeedsConfirm = false;
    };

    this.saveReorderedIndicatorsToDB = function (indicators) {
      _api_js__WEBPACK_IMPORTED_MODULE_1__["api"].post("/reorder_indicators/", indicators).then(function (response) {
        _this.fetchIndicatorsFromDB();
      })["catch"](function (error) {
        console.log("There was an error:", error);
      });
    };

    _initializerDefineProperty(this, "deleteIndicatorFromStore", _descriptor16, this);

    _initializerDefineProperty(this, "addIndicatorToStore", _descriptor17, this);

    _initializerDefineProperty(this, "moveIndicatorInStore", _descriptor18, this);

    this.fetchIndicatorsFromDB = function () {
      var indicatorId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var indicatorQParam = indicatorId ? "?indicatorId=".concat(indicatorId) : "";
      _api_js__WEBPACK_IMPORTED_MODULE_1__["api"].get("/indicator_list/".concat(_this.program_id, "/").concat(indicatorQParam)).then(function (response) {
        return Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this.indicators = response.data;
        });
      })["catch"](function (error) {
        return console.log('There was an error:', error);
      });
    };

    this.deriveTemplateKey = function (origLevelTiers) {
      // Check each tier set in the templates to see if the tier order and content are exactly the same
      // If they are, return the template key
      var levelTierStr = JSON.stringify(Object(mobx__WEBPACK_IMPORTED_MODULE_0__["toJS"])(origLevelTiers));

      for (var templateKey in _this.englishTierTemlates) {
        // not an eligable template if the key is inherited or if the lengths of the tier sets don't match.
        if (!_this.englishTierTemlates.hasOwnProperty(templateKey) || origLevelTiers.length != _this.englishTierTemlates[templateKey]['tiers'].length) {
          continue;
        }

        var templateValuesStr = JSON.stringify(_this.englishTierTemlates[templateKey]['tiers']);

        if (levelTierStr == templateValuesStr) {
          return templateKey;
        }
      } // If this has been reached, the db has stored tiers but they're not a match to a template


      return _this.customTierSetKey;
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

    this.tierIsDeletable = function (tierLevel) {
      var _iterator = _createForOfIteratorHelper(_this.levels),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var level = _step.value;

          if (level.level_depth === tierLevel && level.name.length > 0) {
            return false;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return true;
    };

    this.rootStore = rootStore;
    this.levels = levels;
    this.indicators = _indicators;
    this.englishTierTemlates = JSON.parse(englishTemplates);
    this.defaultTemplateKey = "mc_standard";
    this.customTierSetKey = "custom";
    this.program_id = program.id;
    this.manual_numbering = program.manual_numbering;
    this.programObjectives = programObjectives;
    this.accessLevel = accessLevel;
    this.usingResultsFramework = usingResultsFramework;
    this.formErrors = {
      hasError: false
    };
    this.maxTiers = maxTiers;
    this.excelURL = "/indicators/results_framework_export/".concat(program.id, "/");
    this.tierTemplates = JSON.parse(tierTemplates);
    this.tierTemplates[this.customTierSetKey] = {
      name: gettext("Custom")
    };
    this.tierTemplates[this.customTierSetKey]['tiers'] = customTemplates.names || [""]; // Set the stored tier set key and the values, if they exist.  Use the default if they don't.

    if (levelTiers.length > 0) {
      var origLevelTiers = levelTiers.map(function (t) {
        return t.name;
      });
      this.chosenTierSetKey = this.deriveTemplateKey(origLevelTiers);
    } else {
      this.chosenTierSetKey = this.defaultTemplateKey;
    }

    this.useStaticTierList = !(this.chosenTierSetKey === this.customTierSetKey && this.levels.length === 0);
  }

  _createClass(LevelStore, [{
    key: "changeTierSet",
    value: function changeTierSet(newTierSetKey) {
      var _this2 = this;

      var oldTopTier = this.chosenTierSet[0];
      this.chosenTierSetKey = newTierSetKey;

      if (this.chosenTierSetKey === this.customTierSetKey) {
        this.editTierSet(); // Set a default first tier in the event the user is switching from a defined template to a blank custom one
        // It's a bit of a hack, since new custom levels should be kept in the local component state and
        // the root store would only be modified when the "Apply" button was pressed.  But this is easier
        // than passing an the old level down to the component and the only downside seems a slightly sticky
        // first tier value when you switch from a pre-defined template, to custom, and back to pre-defined, and
        // back to custom again.  How did I write so much about 3 lines of code?

        if (!this.tierTemplates[this.customTierSetKey]['tiers'][0] && this.levels.filter(function (level) {
          return level.id !== "new";
        }).length === 1) {
          this.tierTemplates[this.customTierSetKey]['tiers'] = [gettext(oldTopTier)];
        }
      } else {
        this.rootStore.uiStore.customFormErrors = {
          hasErrors: false,
          errors: []
        };
        this.rootStore.uiStore.setDisableCardActions(false);
      }

      if (this.levels.length > 0 && this.chosenTierSetKey !== this.customTierSetKey) {
        var result = this.saveLevelTiersToDB();
        result.then(function (result) {
          if (_this2.chosenTierSetKey !== _this2.customTierSetKey && _this2.levels.filter(function (level) {
            return level.id !== "new";
          }).length > 0) {
            success_notice({
              // # Translators: Notification to user that the an update was successful
              message_text: gettext("Changes to the results framework template were saved."),
              addClass: 'program-page__rationale-form',
              stack: {
                dir1: 'up',
                dir2: 'right',
                firstpos1: 20,
                firstpos2: 20
              }
            });
          }
        })["catch"](function (error) {
          // Ok, I know this is dumb, but we're in the middle of a revamp of the alerts and I don't
          // want to add to the mess.  Punting.
          console.log("There was an error saving the template to the database");
        });
      }
    }
  }, {
    key: "updateIndicatorNameInStore",
    value: function updateIndicatorNameInStore(indicatorId, newName) {
      this.indicators.find(function (i) {
        return i.id == indicatorId;
      }).name = newName;
    }
  }, {
    key: "sortedLevels",
    get: function get() {
      return this.levels.slice().sort(function (a, b) {
        a.level_depth - b.level_depth || a.customsort - b.customsort;
      });
    }
  }, {
    key: "chosenTierSet",
    get: function get() {
      return this.tierTemplates[this.chosenTierSetKey]['tiers'];
    }
  }, {
    key: "levelProperties",
    get: function get() {
      var _this3 = this;

      var levelProperties = {};

      var _iterator2 = _createForOfIteratorHelper(this.levels),
          _step2;

      try {
        var _loop = function _loop() {
          var level = _step2.value;
          var properties = {};

          var childrenIds = _this3.getChildLevels(level.id).map(function (l) {
            return l.id;
          });

          var indicatorCount = _this3.indicators.filter(function (i) {
            return i.level == level.id;
          });

          properties['indicators'] = _this3.getLevelIndicators(level.id);
          properties['descendantIndicatorIds'] = _this3.getDescendantIndicatorIds(childrenIds);
          properties['ontologyLabel'] = _this3.buildOntology(level.id);
          properties['tierName'] = _this3.chosenTierSet[level.level_depth - 1];
          properties['childTierName'] = null;

          if (_this3.chosenTierSet.length > level.level_depth) {
            properties['childTierName'] = _this3.chosenTierSet[level.level_depth];
          }

          properties['canDelete'] = childrenIds.length == 0 && indicatorCount == 0 && _this3.hasEditPermissions;
          properties['canEdit'] = _this3.hasEditPermissions; // TODO: is this really necessary?

          levelProperties[level.id] = properties;
        };

        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          _loop();
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      return levelProperties;
    }
  }, {
    key: "chosenTierSetName",
    get: function get() {
      return this.tierTemplates[this.chosenTierSetKey]['name'];
    }
  }, {
    key: "hasEditPermissions",
    get: function get() {
      return this.accessLevel === 'high';
    } // This monitors the number of indicators attached to the program and adds/removes the header link depending on
    // whether there are indicators.  It relies on all indicators being passed up from the server each time
    // the indicator list is refreshed.

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
}), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, "useStaticTierList", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return "";
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class.prototype, "formErrors", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor6 = _applyDecoratedDescriptor(_class.prototype, "tierTemplates", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return "";
  }
}), _applyDecoratedDescriptor(_class.prototype, "sortedLevels", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "sortedLevels"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "chosenTierSet", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "chosenTierSet"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "levelProperties", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "levelProperties"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "chosenTierSetName", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "chosenTierSetName"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "hasEditPermissions", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "hasEditPermissions"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "changeTierSet", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "changeTierSet"), _class.prototype), _descriptor7 = _applyDecoratedDescriptor(_class.prototype, "updateCustomTier", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this4 = this;

    return function (event) {
      _this4.tierTemplates[_this4.customTierSetKey]['tiers'][event.target.dataset.tierorder] = event.target.value;
    };
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class.prototype, "addCustomTier", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this5 = this;

    return function () {
      _this5.rootStore.uiStore.setAddLevelButtonLockedStatus(true);

      _this5.saveCustomTemplateToDB({
        addTier: true
      });
    };
  }
}), _descriptor9 = _applyDecoratedDescriptor(_class.prototype, "deleteCustomTier", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this6 = this;

    return function (event) {
      // This prevents the delete button getting triggered when the user tabs out of the text area
      // Need to check if a) there was an interaction other than tab and b) if the action was a key press, was it an 'Enter' key?
      if (event.detail === 0 && !event.key || event.key && event.key != "Enter") {
        return false;
      }

      if (_this6.chosenTierSet.length === 1) {
        _this6.tierTemplates[_this6.customTierSetKey]['tiers'] = [""];

        _this6.rootStore.uiStore.clearValidationMessages();
      } else {
        _this6.tierTemplates[_this6.customTierSetKey]['tiers'].pop();

        _this6.rootStore.uiStore.validateCustomTiers();
      }

      _this6.saveCustomTemplateToDB({
        isDeleting: true
      });
    };
  }
}), _descriptor10 = _applyDecoratedDescriptor(_class.prototype, "applyTierSet", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this7 = this;

    return function () {
      var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (event) {
        event.preventDefault();
      }

      if (_this7.chosenTierSetKey === _this7.customTierSetKey && _this7.rootStore.uiStore.customFormErrors.hasErrors) {
        return false;
      }

      _this7.saveLevelTiersToDB();

      if (_this7.chosenTierSetKey === _this7.customTierSetKey) {
        _this7.rootStore.uiStore.validateCustomTiers();

        if (_this7.rootStore.uiStore.customFormErrors.hasErrors) return;

        _this7.saveCustomTemplateToDB({
          shouldAlert: true
        });

        _this7.useStaticTierList = true;
      }

      if (_this7.levels.length === 0) {
        _this7.createFirstLevel();
      }

      _this7.rootStore.uiStore.setDisableCardActions(false);
    };
  }
}), _descriptor11 = _applyDecoratedDescriptor(_class.prototype, "editTierSet", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this8 = this;

    return function () {
      _this8.useStaticTierList = false;

      _this8.rootStore.uiStore.setDisableCardActions(true);
    };
  }
}), _descriptor12 = _applyDecoratedDescriptor(_class.prototype, "cancelEdit", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this9 = this;

    return function (levelId) {
      if (levelId == "new") {
        var targetLevel = _this9.levels.find(function (l) {
          return l.id == levelId;
        }); // First update any customsort values that were modified when this card was created


        var siblingsToReorder = _this9.levels.filter(function (l) {
          return l.customsort > targetLevel.customsort && l.parent == targetLevel.parent;
        });

        siblingsToReorder.forEach(function (sib) {
          return sib.customsort -= 1;
        }); // Now remove the new card

        _this9.levels.replace(_this9.levels.filter(function (element) {
          return element.id != "new";
        }));
      }

      _this9.fetchIndicatorsFromDB();

      _this9.rootStore.uiStore.removeActiveCard();
    };
  }
}), _descriptor13 = _applyDecoratedDescriptor(_class.prototype, "createNewLevelFromSibling", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this10 = this;

    return function (siblingId) {
      // Copy sibling data for the new level and then clear some of it out
      var sibling = Object(mobx__WEBPACK_IMPORTED_MODULE_0__["toJS"])(_this10.levels.find(function (l) {
        return l.id == siblingId;
      }));
      var newLevel = Object.assign({}, sibling);
      newLevel.customsort += 1;
      newLevel.id = "new";
      newLevel.name = "";
      newLevel.assumptions = ""; // bump the customsort field for siblings that come after the inserted Level

      var siblingsToReorder = _this10.levels.filter(function (l) {
        return sibling && l.customsort > sibling.customsort && l.parent == sibling.parent;
      });

      siblingsToReorder.forEach(function (sib) {
        return sib.customsort += 1;
      }); // add new Level to the various Store components

      _this10.rootStore.uiStore.activeCard = "new";

      _this10.levels.push(newLevel);

      setTimeout(function () {
        $("#level-card-new")[0].scrollIntoView({
          behavior: "smooth"
        });
      }, 100);
    };
  }
}), _descriptor14 = _applyDecoratedDescriptor(_class.prototype, "createNewLevelFromParent", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this11 = this;

    return function (parentId) {
      // Copy data for the new level and then clear some of it out
      var parent = Object(mobx__WEBPACK_IMPORTED_MODULE_0__["toJS"])(_this11.levels.find(function (l) {
        return l.id == parentId;
      }));
      var newLevel = {
        id: "new",
        customsort: 1,
        name: "",
        assumptions: "",
        parent: parentId,
        level_depth: parent.level_depth + 1,
        program: _this11.program_id
      }; // bump the customsort field for siblings that come after the inserted Level

      var siblingsToReorder = _this11.levels.filter(function (l) {
        return l.parent == parentId;
      });

      siblingsToReorder.forEach(function (sib) {
        return sib.customsort += 1;
      }); // add new Level to the various Store components

      _this11.levels.push(newLevel);

      _this11.rootStore.uiStore.activeCard = "new";

      _this11.rootStore.uiStore.hasVisibleChildren.push(newLevel.parent);
    };
  }
}), _descriptor15 = _applyDecoratedDescriptor(_class.prototype, "createFirstLevel", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this12 = this;

    return function () {
      // Using "root" for parent id so the Django view can distinguish between top tier level and 2nd tier level
      var newLevel = {
        id: "new",
        program: _this12.program_id,
        name: "",
        assumptions: "",
        customsort: 1,
        level_depth: 1,
        parent: "root"
      };

      _this12.levels.push(newLevel);

      _this12.rootStore.uiStore.activeCard = "new";
    };
  }
}), _applyDecoratedDescriptor(_class.prototype, "updateIndicatorNameInStore", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "updateIndicatorNameInStore"), _class.prototype), _descriptor16 = _applyDecoratedDescriptor(_class.prototype, "deleteIndicatorFromStore", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this13 = this;

    return function (indicatorId, levelId) {
      _this13.indicators = _this13.indicators.filter(function (i) {
        return i.id != indicatorId;
      });

      _this13.indicators.filter(function (i) {
        return i.level == levelId;
      }).sort(function (a, b) {
        return a.level_order - b.level_order;
      }).forEach(function (indicator, index) {
        return indicator.level_order = index;
      });
    };
  }
}), _descriptor17 = _applyDecoratedDescriptor(_class.prototype, "addIndicatorToStore", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this14 = this;

    return function (indicatorData) {
      _this14.indicators.push(indicatorData);
    };
  }
}), _descriptor18 = _applyDecoratedDescriptor(_class.prototype, "moveIndicatorInStore", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this15 = this;

    return function (indicatorId, newLevelId) {
      var target = _this15.indicators.find(function (i) {
        return i.id == indicatorId;
      });

      target.level = newLevelId;
      target.level_order = _this15.indicators.filter(function (i) {
        return i.level == newLevelId;
      }).length - 1;
    };
  }
})), _class);
var UIStore = (_class3 = (_temp2 = /*#__PURE__*/function () {
  function UIStore(rootStore) {
    _classCallCheck(this, UIStore);

    _initializerDefineProperty(this, "activeCard", _descriptor19, this);

    _initializerDefineProperty(this, "hasVisibleChildren", _descriptor20, this);

    _initializerDefineProperty(this, "disableCardActions", _descriptor21, this);

    _initializerDefineProperty(this, "customFormErrors", _descriptor22, this);

    _initializerDefineProperty(this, "addLevelButtonIsLocked", _descriptor23, this);

    this.activeCardNeedsConfirm = "";

    _initializerDefineProperty(this, "editCard", _descriptor24, this);

    _initializerDefineProperty(this, "onLeaveConfirm", _descriptor25, this);

    _initializerDefineProperty(this, "setDisableCardActions", _descriptor26, this);

    _initializerDefineProperty(this, "removeActiveCard", _descriptor27, this);

    _initializerDefineProperty(this, "updateVisibleChildren", _descriptor28, this);

    _initializerDefineProperty(this, "expandAllLevels", _descriptor29, this);

    _initializerDefineProperty(this, "collapseAllLevels", _descriptor30, this);

    _initializerDefineProperty(this, "setAddLevelButtonLockedStatus", _descriptor31, this);

    _initializerDefineProperty(this, "validateCustomTiers", _descriptor32, this);

    _initializerDefineProperty(this, "clearValidationMessages", _descriptor33, this);

    this.rootStore = rootStore;
    this.hasVisibleChildren = this.rootStore.levelStore.levels.map(function (l) {
      return l.id;
    });
    this.activeCardNeedsConfirm = false;
    this.activeCard = null;
    this.disableCardActions = false;
    this.customFormErrors = {
      hasErrors: false,
      errors: []
    };
    this.addLevelButtonIsLocked = false; //used to prevent creating two new levels by smashing the Add Level button

    this.splashWarning = gettext('<strong class="text-danger">Choose your results framework template carefully!</strong> Once you begin building your framework, it will not be possible to change templates without first deleting saved levels.');
  }

  _createClass(UIStore, [{
    key: "tierLockStatus",
    get: function get() {
      // Tiers should be locked if user doesn't have write permissions or when more than one level exists,
      // regardless of saved or unsaved.  Allowing a second (unsaved) level to lock the tier
      // switcher prevents a user from adding a second level and switching to a custom template before saving the
      // level they're currently editing.  This could be a problem because there are two levels and potentially
      // no second tier that corresponds to the second level.
      if (!this.rootStore.levelStore.hasEditPermissions || this.rootStore.levelStore.levels.length > 1) {
        return "locked";
      } // The apply button should not be visible if there is only one level visible (i.e. saved to the db or not)
      else if (this.rootStore.levelStore.levels.length > 0) {
          return "primed";
        }

      return null;
    } // This calculation is used in to decide if the Expand All button on in the level list should be disabled or not.
    // Need count all nodes excluding leaf nodes, which is the how many id's will be in the
    // hasVisibleChildren count if a user manually expands all of the level cards.

  }, {
    key: "isExpandAllDisabled",
    get: function get() {
      if (this.rootStore.levelStore.levels.length == 0 || this.disableCardActions || this.activeCard) {
        return true;
      } else {
        var parents = new Set(this.rootStore.levelStore.levels.map(function (level) {
          return level.parent;
        }));
        parents = Array.from(parents).filter(function (p) {
          return p != null;
        });
        var sortedHasVisibleChildren = new Set(_toConsumableArray(this.hasVisibleChildren));

        var _iterator3 = _createForOfIteratorHelper(parents),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var elem = _step3.value;

            if (!sortedHasVisibleChildren.has(elem)) {
              return false;
            }
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }

        return true;
      }
    }
  }, {
    key: "disabledActionsOrActiveCard",
    get: function get() {
      return this.disableCardActions || this.activeCard;
    }
  }]);

  return UIStore;
}(), _temp2), (_descriptor19 = _applyDecoratedDescriptor(_class3.prototype, "activeCard", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor20 = _applyDecoratedDescriptor(_class3.prototype, "hasVisibleChildren", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor21 = _applyDecoratedDescriptor(_class3.prototype, "disableCardActions", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor22 = _applyDecoratedDescriptor(_class3.prototype, "customFormErrors", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor23 = _applyDecoratedDescriptor(_class3.prototype, "addLevelButtonIsLocked", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _applyDecoratedDescriptor(_class3.prototype, "tierLockStatus", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class3.prototype, "tierLockStatus"), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, "isExpandAllDisabled", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class3.prototype, "isExpandAllDisabled"), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, "disabledActionsOrActiveCard", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class3.prototype, "disabledActionsOrActiveCard"), _class3.prototype), _descriptor24 = _applyDecoratedDescriptor(_class3.prototype, "editCard", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this16 = this;

    return function (levelId) {
      var cancelledLevelId = _this16.activeCard;

      if (_this16.activeCardNeedsConfirm) {
        _this16.setDisableCardActions(true);

        $("#level-card-".concat(_this16.activeCard))[0].scrollIntoView({
          behavior: "smooth"
        });
        var oldTierName = _this16.rootStore.levelStore.levelProperties[_this16.activeCard].tierName;
        Object(_components_changesetNotice__WEBPACK_IMPORTED_MODULE_2__["create_unified_changeset_notice"])({
          header: gettext("Warning"),
          show_icon: true,

          /* # Translators:  This is a confirmation prompt that is triggered by clicking on a cancel button.  */
          message_text: gettext("Are you sure you want to continue?"),

          /* # Translators:  This is a warning provided to the user when they try to cancel the editing of something they have already modified.  */
          preamble: interpolate(gettext("Changes to this %s will not be saved"), [oldTierName]),
          notice_type: "notice",
          include_rationale: false,
          rationale_required: false,
          on_submit: function on_submit() {
            return _this16.onLeaveConfirm(levelId, cancelledLevelId);
          },
          on_cancel: function on_cancel() {
            return _this16.setDisableCardActions(false);
          }
        });
      } else {
        _this16.activeCard = levelId;

        _this16.rootStore.levelStore.levels.replace(_this16.rootStore.levelStore.levels.filter(function (l) {
          return l.id != "new";
        }));
      }
    };
  }
}), _descriptor25 = _applyDecoratedDescriptor(_class3.prototype, "onLeaveConfirm", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this17 = this;

    return function (levelId, cancelledLevelId) {
      _this17.setDisableCardActions(false);

      _this17.rootStore.levelStore.cancelEdit(cancelledLevelId);

      _this17.activeCardNeedsConfirm = false;
      _this17.activeCard = levelId; // Need to use set timeout to ensure that scrolling loses the race with components reacting to the new position of the open card.

      setTimeout(function () {
        $("#level-card-".concat(levelId))[0].scrollIntoView({
          behavior: "smooth"
        });
      }, 100);
    };
  }
}), _descriptor26 = _applyDecoratedDescriptor(_class3.prototype, "setDisableCardActions", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this18 = this;

    return function (value) {
      _this18.disableCardActions = value;
    };
  }
}), _descriptor27 = _applyDecoratedDescriptor(_class3.prototype, "removeActiveCard", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this19 = this;

    return function () {
      _this19.activeCard = null;
      _this19.rootStore.uiStore.activeCardNeedsConfirm = false;
    };
  }
}), _descriptor28 = _applyDecoratedDescriptor(_class3.prototype, "updateVisibleChildren", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this20 = this;

    return function (levelId) {
      var forceHide = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      // forceHide is to ensure that descendant levels are also hidden.
      if (_this20.hasVisibleChildren.indexOf(levelId) >= 0 || forceHide) {
        _this20.hasVisibleChildren = _this20.hasVisibleChildren.filter(function (level_id) {
          return level_id != levelId;
        });

        var childLevels = _this20.rootStore.levelStore.levels.filter(function (l) {
          return l.parent == levelId;
        });

        childLevels.forEach(function (l) {
          return _this20.updateVisibleChildren(l.id, true);
        });
      } else {
        _this20.hasVisibleChildren.push(levelId);
      }
    };
  }
}), _descriptor29 = _applyDecoratedDescriptor(_class3.prototype, "expandAllLevels", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this21 = this;

    return function () {
      _this21.hasVisibleChildren = _this21.rootStore.levelStore.levels.map(function (level) {
        return level.id;
      });
    };
  }
}), _descriptor30 = _applyDecoratedDescriptor(_class3.prototype, "collapseAllLevels", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this22 = this;

    return function () {
      return _this22.hasVisibleChildren = [];
    };
  }
}), _descriptor31 = _applyDecoratedDescriptor(_class3.prototype, "setAddLevelButtonLockedStatus", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this23 = this;

    return function (status) {
      return _this23.addLevelButtonIsLocked = status;
    };
  }
}), _descriptor32 = _applyDecoratedDescriptor(_class3.prototype, "validateCustomTiers", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this24 = this;

    return function () {
      var hasErrors = false;
      var customKey = _this24.rootStore.levelStore.customTierSetKey;
      var tiersToTest = _this24.rootStore.levelStore.tierTemplates[customKey]['tiers'];

      _this24.setAddLevelButtonLockedStatus(false);

      var errors = tiersToTest.map(function (tierName) {
        var regex = /^\s*$/;
        var whitespaceError = tierName.length === 0 || regex.test(tierName) && tierName.length > 0;
        var duplicateErrors = 0; // There will be at least 1 for the self-match.

        var commaError = tierName.indexOf(",") !== -1;
        tiersToTest.forEach(function (otherTierName) {
          if (otherTierName == tierName) {
            duplicateErrors += 1;
          }
        });

        if (whitespaceError) {
          hasErrors = true;
          /* # Translators: This is a warning messages when a user has entered duplicate names for two different objects and those names contain only white spaces, both of which are not permitted. */

          return {
            hasError: true,
            msg: gettext("Please complete this field.")
          };
        } else if (commaError) {
          hasErrors = true;
          /* # Translators: This is a warning messages when a user has entered duplicate names for two different objects */

          return {
            hasError: true,
            msg: gettext("Result levels should not contain commas.")
          };
        } else if (duplicateErrors > 1) {
          hasErrors = true;
          /* # Translators: This is a warning messages when a user has a comma in a name that shouldn't contain commas */

          return {
            hasError: true,
            msg: gettext("Result levels must have unique names.")
          };
        } else {
          return {
            hasError: false,
            msg: ""
          };
        }
      });
      _this24.customFormErrors = {
        hasErrors: hasErrors,
        errors: errors
      };
    };
  }
}), _descriptor33 = _applyDecoratedDescriptor(_class3.prototype, "clearValidationMessages", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this25 = this;

    return function () {
      _this25.customFormErrors = {
        hasErrors: false,
        errors: []
      };
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

/***/ "K0Bk":
/*!*******************************************************************!*\
  !*** ./js/pages/results_framework/components/level_tier_lists.js ***!
  \*******************************************************************/
/*! exports provided: StaticLevelTierList, EditableLevelTierList */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StaticLevelTierList", function() { return StaticLevelTierList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EditableLevelTierList", function() { return EditableLevelTierList; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mobx */ "2vnA");
/* harmony import */ var _components_actionButtons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../components/actionButtons */ "PqXH");
var _dec, _class, _dec2, _class2, _temp, _dec3, _class4, _temp2;

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






var StaticLevelTier = /*#__PURE__*/function (_React$Component) {
  _inherits(StaticLevelTier, _React$Component);

  var _super = _createSuper(StaticLevelTier);

  function StaticLevelTier() {
    _classCallCheck(this, StaticLevelTier);

    return _super.apply(this, arguments);
  }

  _createClass(StaticLevelTier, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: 'leveltier leveltier--level-' + this.props.tierLevel
      }, this.props.tierName, " ");
    }
  }]);

  return StaticLevelTier;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

var StaticLevelTierList = (_dec = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('rootStore'), _dec(_class = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class = /*#__PURE__*/function (_React$Component2) {
  _inherits(StaticLevelTierList, _React$Component2);

  var _super2 = _createSuper(StaticLevelTierList);

  function StaticLevelTierList() {
    _classCallCheck(this, StaticLevelTierList);

    return _super2.apply(this, arguments);
  }

  _createClass(StaticLevelTierList, [{
    key: "render",
    value: function render() {
      var apply_button = null; // Only show the Apply button if you haven't saved a level yet and if you're a 'high' level user.

      if (this.props.rootStore.levelStore.levels.length === 0 && this.props.rootStore.levelStore.hasEditPermissions) {
        apply_button = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          className: "leveltier-list__actions"
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
          className: "leveltier-button btn btn-primary btn-block",
          onClick: this.props.rootStore.levelStore.applyTierSet
        }, gettext("Apply")));
      }

      var settings_button = null; // Only show the settings button if you've selected to customize the tiers, you are not actively editing
      // the tiers, and you are a high level user.

      if (this.props.rootStore.levelStore.chosenTierSetKey == this.props.rootStore.levelStore.customTierSetKey && this.props.rootStore.levelStore.useStaticTierList && this.props.rootStore.levelStore.hasEditPermissions) {
        settings_button = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
          className: "btn btn-link leveltier-list leveltier--editable__settings",
          onClick: this.props.rootStore.levelStore.editTierSet
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "fa fa-cog"
        }), gettext("Settings"));
      }

      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: "leveltier-list",
        className: "leveltier-list"
      }, this.props.rootStore.levelStore.chosenTierSet.length > 0 ? this.props.rootStore.levelStore.chosenTierSet.map(function (tier, index) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(StaticLevelTier, {
          key: index,
          tierLevel: index,
          tierName: tier
        });
      }) : null), settings_button, apply_button);
    }
  }]);

  return StaticLevelTierList;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component)) || _class) || _class);
var EditableLevelTier = (_dec2 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('rootStore'), _dec2(_class2 = (_temp = /*#__PURE__*/function (_React$Component3) {
  _inherits(EditableLevelTier, _React$Component3);

  var _super3 = _createSuper(EditableLevelTier);

  function EditableLevelTier(props) {
    var _this;

    _classCallCheck(this, EditableLevelTier);

    _this = _super3.call(this, props);

    _this.onBlur = function (event) {
      /*
      When the onBlur event is triggered, if the user has fixed errors in the level tiers, React/MobX will redraw the elements
      on the page.  When that onBlur event happens to be a button click (e.g. the Apply button), the onDraw redraw prevents the button's
      onClick from firing.  This code is required to make sure buttons don't need to be clicked twice.
      If the user is deleting a level, that should be called before the validation is called.
       */
      if (event.relatedTarget && event.relatedTarget.classList.contains("btn-delete")) {
        _this.props.rootStore.levelStore.deleteCustomTier(event);
      } else {
        _this.props.rootStore.uiStore.validateCustomTiers();

        if (event.relatedTarget && event.relatedTarget.id == "applyButton") {
          _this.props.rootStore.levelStore.applyTierSet();
        }

        if (event.relatedTarget && event.relatedTarget.id == "addLevelButton") {
          _this.props.rootStore.levelStore.addCustomTier();
        }
      }
    };

    _this.inputRef = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createRef();
    return _this;
  }

  _createClass(EditableLevelTier, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.inputRef.current.focus();
    }
  }, {
    key: "render",
    value: function render() {
      var deleteButton = null;

      if (this.props.showDeleteButton) {
        deleteButton = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_actionButtons__WEBPACK_IMPORTED_MODULE_3__["DeleteButton"], {
          buttonClasses: "p-0",
          type: "button",
          disabled: this.props.rootStore.uiStore.customFormErrors.hasErrors,
          action: this.props.rootStore.levelStore.deleteCustomTier
        });
      }

      var lockButton = null;

      if (this.props.showLockButton) {
        lockButton = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
          tabIndex: "0",
          className: "btn btn-sm btn-link",
          "data-toggle": "popover",
          "data-trigger": "focus",
          "data-placement": "bottom"
          /* # Translators: This is the help text of an icon that indicates that this element can't be deleted */
          ,
          "data-content": gettext("This level is being used in the results framework")
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "fa fa-lock text-muted"
        }));
      }

      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "leveltier--editable__label"
      },
      /* # Translators: This is one of several user modifiable fields, e.g. "Level 1", "Level 2", etc... Level 1 is the top of the hierarchy, Level six is the bottom.*/
      interpolate(gettext("Level %s"), [this.props.tierOrder + 1])), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "leveltier--editable"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        ref: this.inputRef,
        className: "leveltier--editable__input form-control",
        type: "text",
        maxLength: 75,
        "data-tierorder": this.props.tierOrder,
        value: this.props.tierName,
        onChange: this.props.rootStore.levelStore.updateCustomTier,
        onBlur: this.onBlur
      }), deleteButton, lockButton), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "has-error"
      }, this.props.errorMsg)));
    }
  }]);

  return EditableLevelTier;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp)) || _class2);
var EditableLevelTierList = (_dec3 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('rootStore'), _dec3(_class4 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class4 = (_temp2 = /*#__PURE__*/function (_React$Component4) {
  _inherits(EditableLevelTierList, _React$Component4);

  var _super4 = _createSuper(EditableLevelTierList);

  function EditableLevelTierList() {
    var _this2;

    _classCallCheck(this, EditableLevelTierList);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this2 = _super4.call.apply(_super4, [this].concat(args));

    _this2.customTemplateFormSubmit = function (event) {
      return event.preventDefault();
    };

    return _this2;
  }

  _createClass(EditableLevelTierList, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // Enable popovers after update (they break otherwise)
      $('*[data-toggle="popover"]').popover({
        html: true
      });
    } // Need this just to ensure that the implicit submit that takes place for single input forms is blocked

  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var customKey = this.props.rootStore.levelStore.customTierSetKey; // Loop through each custom tier and build the input field, error message, and delete/lock icon

      var savedTiers = this.props.rootStore.levelStore.chosenTierSet.map(function (tier, index) {
        var errorObj = _this3.props.rootStore.uiStore.customFormErrors.errors.length > index ? _this3.props.rootStore.uiStore.customFormErrors.errors[index] : null;
        var errorMsg = errorObj && errorObj.hasError ? errorObj.msg : null;
        var showLockButton = !_this3.props.rootStore.levelStore.tierIsDeletable(index + 1);
        var showDeleteButton = index === _this3.props.rootStore.levelStore.chosenTierSet.length - 1 && !showLockButton && !(_this3.props.rootStore.levelStore.chosenTierSet.length === 1 && tier.length === 0);
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(EditableLevelTier, {
          key: index,
          tierName: tier,
          showDeleteButton: showDeleteButton,
          showLockButton: showLockButton,
          tierOrder: index,
          errorMsg: errorMsg
        });
      }) || null; // At the bottom of the tier list, show the add level and apply buttons, if appropriate.

      var isAddTierButtonDisabled = !this.props.rootStore.levelStore.tierTemplates[customKey]['tiers'].every(function (tierName) {
        return tierName.length > 0;
      }) || this.props.rootStore.uiStore.addLevelButtonIsLocked;
      var addTierButton = savedTiers.length >= this.props.rootStore.levelStore.maxTiers ? null : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        id: "addLevelButton",
        type: "button",
        className: "btn btn-link btn-add",
        disabled: isAddTierButtonDisabled,
        onClick: this.props.rootStore.levelStore.addCustomTier
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fa fa-plus-circle"
      }), "Add level");
      var applyButton = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "leveltier-list__actions"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        id: "applyButton",
        className: "leveltier-button btn btn-primary btn-block",
        disabled: isAddTierButtonDisabled,
        type: "button",
        onClick: this.props.rootStore.levelStore.applyTierSet
      }, gettext("Apply")));
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("form", {
        onSubmit: this.customTemplateFormSubmit
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: "leveltier-list",
        className: "leveltier-list"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: ""
      }, savedTiers), addTierButton), applyButton);
    }
  }]);

  return EditableLevelTierList;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp2)) || _class4) || _class4);

/***/ }),

/***/ "PqXH":
/*!****************************************!*\
  !*** ./js/components/actionButtons.js ***!
  \****************************************/
/*! exports provided: DeleteButton, ExpandAllButton, CollapseAllButton */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DeleteButton", function() { return DeleteButton; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ExpandAllButton", function() { return ExpandAllButton; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CollapseAllButton", function() { return CollapseAllButton; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ "TSYQ");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _fortawesome_fontawesome_svg_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @fortawesome/fontawesome-svg-core */ "7O5W");
/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ "IP2g");
/* harmony import */ var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons */ "wHSu");
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







_fortawesome_fontawesome_svg_core__WEBPACK_IMPORTED_MODULE_3__["library"].add(_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_5__["faPlusSquare"], _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_5__["faMinusSquare"]);
_fortawesome_fontawesome_svg_core__WEBPACK_IMPORTED_MODULE_3__["library"].add(_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_5__["faPlusSquare"], _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_5__["faMinusSquare"]);
var DeleteButton = /*#__PURE__*/function (_React$Component) {
  _inherits(DeleteButton, _React$Component);

  var _super = _createSuper(DeleteButton);

  function DeleteButton() {
    _classCallCheck(this, DeleteButton);

    return _super.apply(this, arguments);
  }

  _createClass(DeleteButton, [{
    key: "render",
    value: function render() {
      var buttonClasses = classnames__WEBPACK_IMPORTED_MODULE_2___default()('btn-delete btn btn-sm text-danger', this.props.buttonClasses);
      var iconClasses = classnames__WEBPACK_IMPORTED_MODULE_2___default()('fa fa-times', this.props.iconClasses);
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        type: this.props.type || "button",
        onClick: this.props.action,
        onKeyUp: this.props.action,
        className: buttonClasses
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: iconClasses
      }));
    }
  }]);

  return DeleteButton;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);
var ExpandAllButton = /*#__PURE__*/function (_React$Component2) {
  _inherits(ExpandAllButton, _React$Component2);

  var _super2 = _createSuper(ExpandAllButton);

  function ExpandAllButton() {
    _classCallCheck(this, ExpandAllButton);

    return _super2.apply(this, arguments);
  }

  _createClass(ExpandAllButton, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-medium text-action btn-sm",
        onClick: this.props.expandFunc,
        disabled: this.props.isDisabled
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_4__["FontAwesomeIcon"], {
        icon: "plus-square"
      }), gettext('Expand all'));
    }
  }]);

  return ExpandAllButton;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);
var CollapseAllButton = /*#__PURE__*/function (_React$Component3) {
  _inherits(CollapseAllButton, _React$Component3);

  var _super3 = _createSuper(CollapseAllButton);

  function CollapseAllButton() {
    _classCallCheck(this, CollapseAllButton);

    return _super3.apply(this, arguments);
  }

  _createClass(CollapseAllButton, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-medium text-action btn-sm",
        onClick: this.props.collapseFunc,
        disabled: this.props.isDisabled
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_4__["FontAwesomeIcon"], {
        icon: "minus-square"
      }), gettext('Collapse all'));
    }
  }]);

  return CollapseAllButton;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

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
/* harmony import */ var _general_utilities__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../general_utilities */ "WtQ/");
/* harmony import */ var _components_level_list__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/level_list */ "t8du");
/* harmony import */ var _components_leveltier_picker__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/leveltier_picker */ "/l02");
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./models */ "FtQq");










/*
 * Model/Store setup
 */

var _jsContext = jsContext,
    program = _jsContext.program,
    levels = _jsContext.levels,
    indicators = _jsContext.indicators,
    levelTiers = _jsContext.levelTiers,
    tierTemplates = _jsContext.tierTemplates,
    englishTemplates = _jsContext.englishTemplates,
    customTemplates = _jsContext.customTemplates,
    programObjectives = _jsContext.programObjectives,
    accessLevel = _jsContext.accessLevel,
    usingResultsFramework = _jsContext.usingResultsFramework,
    maxTiers = _jsContext.maxTiers;
var rootStore = new _models__WEBPACK_IMPORTED_MODULE_9__["RootStore"](program, levels, indicators, levelTiers, tierTemplates, englishTemplates, customTemplates, programObjectives, accessLevel, usingResultsFramework, maxTiers);
/*
 * React components on page
 */

react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(mobx_react__WEBPACK_IMPORTED_MODULE_2__["Provider"], {
  rootStore: rootStore
}, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_leveltier_picker__WEBPACK_IMPORTED_MODULE_8__["LevelTierPicker"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_level_list__WEBPACK_IMPORTED_MODULE_7__["LevelListPanel"], null))), document.querySelector('#level-builder-react-component'));
Object(_general_utilities__WEBPACK_IMPORTED_MODULE_6__["reloadPageIfCached"])();

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
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mobx */ "2vnA");
/* harmony import */ var _fortawesome_fontawesome_svg_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @fortawesome/fontawesome-svg-core */ "7O5W");
/* harmony import */ var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons */ "wHSu");
/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ "IP2g");
/* harmony import */ var _level_cards__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./level_cards */ "5Za8");
/* harmony import */ var _components_actionButtons__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../components/actionButtons */ "PqXH");
var _dec, _class, _dec2, _class2, _temp;

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









_fortawesome_fontawesome_svg_core__WEBPACK_IMPORTED_MODULE_3__["library"].add(_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_4__["faCaretDown"], _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_4__["faCaretRight"], _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_4__["faSitemap"]);
var LevelList = (_dec = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('rootStore'), _dec(_class = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class = /*#__PURE__*/function (_React$Component) {
  _inherits(LevelList, _React$Component);

  var _super = _createSuper(LevelList);

  function LevelList() {
    _classCallCheck(this, LevelList);

    return _super.apply(this, arguments);
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

        if (_this.props.rootStore.uiStore.activeCard == elem.id) {
          card = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_level_cards__WEBPACK_IMPORTED_MODULE_6__["LevelCardExpanded"], {
            level: elem,
            levelProps: _this.props.rootStore.levelStore.levelProperties[elem.id]
          });
        } else {
          card = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_level_cards__WEBPACK_IMPORTED_MODULE_6__["LevelCardCollapsed"], {
            level: elem,
            levelProps: _this.props.rootStore.levelStore.levelProperties[elem.id]
          });
        }

        var children = _this.props.rootStore.levelStore.sortedLevels.filter(function (level) {
          return level.parent == elem.id;
        });

        var childLevels = null;

        if (children.length > 0) {
          childLevels = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LevelList, {
            rootStore: _this.props.rootStore,
            renderList: children
          });
        }

        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          key: elem.id,
          className: "leveltier--new"
        }, card, childLevels);
      });
    }
  }]);

  return LevelList;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component)) || _class) || _class);
var LevelListPanel = (_dec2 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('rootStore'), _dec2(_class2 = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class2 = (_temp = /*#__PURE__*/function (_React$Component2) {
  _inherits(LevelListPanel, _React$Component2);

  var _super2 = _createSuper(LevelListPanel);

  function LevelListPanel() {
    var _this2;

    _classCallCheck(this, LevelListPanel);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this2 = _super2.call.apply(_super2, [this].concat(args));

    _this2.getWarningText = function () {
      return {
        __html: _this2.props.rootStore.uiStore.splashWarning
      };
    };

    return _this2;
  }

  _createClass(LevelListPanel, [{
    key: "render",
    value: function render() {
      var _this3 = this;

      var isCollapseAllDisabled = this.props.rootStore.uiStore.hasVisibleChildren.length === 0 || this.props.rootStore.uiStore.disableCardActions || this.props.rootStore.uiStore.activeCard;
      var expandoDiv = null;

      if (this.props.rootStore.levelStore.levels.filter(function (l) {
        return l.id !== "new";
      }).length > 1) {
        var excelClickHandler = function excelClickHandler() {
          window.open(_this3.props.rootStore.levelStore.excelURL, '_blank');
        };

        expandoDiv = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          className: "level-list--expandos"
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          className: "btn-group"
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_actionButtons__WEBPACK_IMPORTED_MODULE_7__["ExpandAllButton"], {
          isDisabled: this.props.rootStore.uiStore.isExpandAllDisabled,
          expandFunc: this.props.rootStore.uiStore.expandAllLevels
        }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_actionButtons__WEBPACK_IMPORTED_MODULE_7__["CollapseAllButton"], {
          isDisabled: isCollapseAllDisabled,
          collapseFunc: this.props.rootStore.uiStore.collapseAllLevels
        })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          className: "level-list--action-buttons"
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
          type: "button",
          className: "btn btn-sm btn-secondary",
          onClick: excelClickHandler
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "fas fa-download"
        }), //  # Translators: a button to download a spreadsheet
        gettext('Excel'))));
      }

      var panel = '';

      if (this.props.rootStore.levelStore.levels.length == 0) {
        panel = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          className: "level-list-panel"
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          className: "level-list-panel__dingbat"
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_5__["FontAwesomeIcon"], {
          icon: "sitemap"
        })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          className: "level-list-panel__text text-large",
          dangerouslySetInnerHTML: this.getWarningText()
        }));
      } else {
        panel = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          id: "level-list",
          style: {
            flexGrow: "2"
          }
        }, expandoDiv, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LevelList, {
          renderList: "initial"
        }));
      }

      return panel;
    }
  }]);

  return LevelListPanel;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp)) || _class2) || _class2);

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

},[["QTZG","runtime","vendors"]]]);
//# sourceMappingURL=results_framework-8ae0458c42bd9d627b3c.js.map