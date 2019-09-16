(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["tola_management_program"],{

/***/ "1faY":
/*!*********************************************************!*\
  !*** ./js/pages/tola_management_pages/program/index.js ***!
  \*********************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "i8i4");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./models */ "xQ6g");
/* harmony import */ var _views__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./views */ "qXK4");
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./api */ "Fe2F");





var app_root = '#app_root';
/*
 * Model/Store setup
 */

var _jsContext = jsContext,
    country_filter = _jsContext.country_filter,
    organization_filter = _jsContext.organization_filter,
    users_filter = _jsContext.users_filter,
    allCountries = _jsContext.allCountries,
    countries = _jsContext.countries,
    organizations = _jsContext.organizations,
    users = _jsContext.users,
    programFilterPrograms = _jsContext.programFilterPrograms,
    sectors = _jsContext.sectors;
/* formatting filters to be used by the ProgramStore */

var makeCountryOptions = function makeCountryOptions(country_ids) {
  return country_ids.map(function (id) {
    return countries[id];
  }).map(function (country) {
    return {
      label: country.name,
      value: country.id
    };
  });
};

var makeOrganizationOptions = function makeOrganizationOptions(org_ids) {
  return org_ids.map(function (id) {
    return organizations[id];
  }).map(function (org) {
    return {
      label: org.name,
      value: org.id
    };
  });
};

var makeUserOptions = function makeUserOptions(user_ids) {
  return user_ids.map(function (id) {
    return users[id];
  }).map(function (user) {
    return {
      label: user.name,
      value: user.id
    };
  });
};

var filters = {
  countries: makeCountryOptions(country_filter),
  organizations: makeOrganizationOptions(organization_filter),
  users: makeUserOptions(users_filter)
};
var initialData = {
  countries: countries,
  allCountries: allCountries,
  organizations: organizations,
  programFilterPrograms: programFilterPrograms,
  sectors: sectors,
  filters: filters,
  users: users
};
var store = new _models__WEBPACK_IMPORTED_MODULE_2__["ProgramStore"](_api__WEBPACK_IMPORTED_MODULE_4__["default"], initialData);
react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_views__WEBPACK_IMPORTED_MODULE_3__["IndexView"], {
  store: store
}), document.querySelector(app_root));

/***/ }),

/***/ "5Xg7":
/*!***************************************************!*\
  !*** ./js/components/virtualized-react-select.js ***!
  \***************************************************/
/*! exports provided: VirtualizedMenuList, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VirtualizedMenuList", function() { return VirtualizedMenuList; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_virtualized__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-virtualized */ "c7k8");
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-select */ "y2Vs");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




var VirtualizedMenuList =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(VirtualizedMenuList, _React$PureComponent);

  function VirtualizedMenuList(props) {
    var _this;

    _classCallCheck(this, VirtualizedMenuList);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(VirtualizedMenuList).call(this, props));
    _this.cache = new react_virtualized__WEBPACK_IMPORTED_MODULE_1__["CellMeasurerCache"]({
      fixedWidth: true,
      defaultHeight: 35
    });
    _this.filter_val = "";
    return _this;
  }

  _createClass(VirtualizedMenuList, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          options = _this$props.options,
          children = _this$props.children,
          maxHeight = _this$props.maxHeight,
          getValue = _this$props.getValue,
          selectProps = _this$props.selectProps;
      var rowCount = children.length || 0; //gotta be a way to improve this. it's ok after the first couple of
      //characters search, but it's slow prior to that

      if (selectProps.inputValue !== this.filter_val) {
        this.filter_val = selectProps.inputValue;
        this.cache.clearAll();
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        style: {
          display: "flex",
          height: "100vh",
          maxHeight: maxHeight + "px"
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        style: {
          flex: "1 1 auto"
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_virtualized__WEBPACK_IMPORTED_MODULE_1__["AutoSizer"], null, function (_ref) {
        var width = _ref.width,
            height = _ref.height;
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_virtualized__WEBPACK_IMPORTED_MODULE_1__["List"], {
          height: height,
          width: width,
          deferredMeasurementCache: _this2.cache,
          rowCount: rowCount,
          rowHeight: _this2.cache.rowHeight,
          noRowsRenderer: function noRowsRenderer() {
            return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, "No selections available");
          },
          rowRenderer: function rowRenderer(_ref2) {
            var index = _ref2.index,
                parent = _ref2.parent,
                key = _ref2.key,
                style = _ref2.style;
            return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_virtualized__WEBPACK_IMPORTED_MODULE_1__["CellMeasurer"], {
              key: key,
              cache: _this2.cache,
              parent: parent,
              columnIndex: 0,
              rowIndex: index
            }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
              style: style
            }, children[index]));
          }
        });
      })));
    }
  }]);

  return VirtualizedMenuList;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.PureComponent);

var VirtualizedSelect = function VirtualizedSelect(props) {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_2__["default"], _extends({
    components: {
      VirtualizedMenuList: VirtualizedMenuList
    }
  }, props));
};

/* harmony default export */ __webpack_exports__["default"] = (VirtualizedSelect);

/***/ }),

/***/ "7Eka":
/*!******************************************************************************!*\
  !*** ./js/pages/tola_management_pages/program/components/program_history.js ***!
  \******************************************************************************/
/*! exports provided: ProgramHistory, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProgramHistory", function() { return ProgramHistory; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-select */ "y2Vs");
/* harmony import */ var react_virtualized__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-virtualized */ "c7k8");
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var components_expander__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! components/expander */ "H4hL");
/* harmony import */ var components_changelog__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! components/changelog */ "KnAV");
var _class;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }







var status_options = [{
  value: 'Funded',
  label: gettext('Active')
}, {
  value: 'Completed',
  label: gettext('Inactive')
}];
var ProgramHistory = Object(mobx_react__WEBPACK_IMPORTED_MODULE_3__["observer"])(_class =
/*#__PURE__*/
function (_React$Component) {
  _inherits(ProgramHistory, _React$Component);

  function ProgramHistory(props) {
    var _this;

    _classCallCheck(this, ProgramHistory);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ProgramHistory).call(this, props));
    var program_data = props.program_data;
    _this.state = {
      managed_status: Object.assign({}, program_data),
      original_status: Object.assign({}, program_data)
    };
    return _this;
  }

  _createClass(ProgramHistory, [{
    key: "hasUnsavedDataAction",
    value: function hasUnsavedDataAction() {
      this.props.onIsDirtyChange(JSON.stringify(this.state.managed_status) != JSON.stringify(this.state.original_status));
    }
  }, {
    key: "onStatusChange",
    value: function onStatusChange(selection) {
      var _this2 = this;

      var value = selection.value;
      this.setState({
        managed_status: Object.assign(this.state.managed_status, {
          'funding_status': value
        })
      }, function () {
        return _this2.hasUnsavedDataAction();
      });
    }
  }, {
    key: "onSave",
    value: function onSave() {
      this.props.onSave(this.state.original_status.id, this.state.managed_status);
    }
  }, {
    key: "onReset",
    value: function onReset() {
      var _this3 = this;

      this.setState({
        managed_status: this.state.original_status
      }, function () {
        return _this3.hasUnsavedDataAction();
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var _this$props = this.props,
          history = _this$props.history,
          store = _this$props.store;
      var changelog_expanded_rows = store.changelog_expanded_rows;
      var currentStatusSelection = status_options.find(function (x) {
        return x.value == _this4.state.managed_status.funding_status;
      });
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "tab-pane--react admin-edit-pane"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", {
        className: "no-bold"
      }, this.props.program_data.name ? this.props.program_data.name + ': ' : '', gettext("Status and History")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        htmlFor: "status-input",
        className: "label--required",
        required: true
      }, gettext("Status")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_1__["default"], {
        isSearchable: false,
        options: status_options,
        value: currentStatusSelection,
        onChange: function onChange(new_value) {
          return _this4.onStatusChange(new_value);
        }
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "col"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group btn-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-primary",
        type: "button",
        onClick: function onClick() {
          return _this4.onSave();
        }
      }, gettext("Save Changes")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-reset",
        type: "button",
        onClick: function onClick() {
          return _this4.onReset();
        }
      }, gettext("Reset"))))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_changelog__WEBPACK_IMPORTED_MODULE_5__["default"], {
        data: history,
        expanded_rows: changelog_expanded_rows,
        toggle_expando_cb: function toggle_expando_cb(row_id) {
          return store.toggleChangeLogRowExpando(row_id);
        }
      }));
    }
  }]);

  return ProgramHistory;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component)) || _class;
/* harmony default export */ __webpack_exports__["default"] = (ProgramHistory);

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
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", _extends({
    className: 'loading-spinner__container ' + loading + ' ' + (className || '')
  }, props), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "loading-spinner__overlay"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "loading-spinner__spinner"
  })), children);
};

/* harmony default export */ __webpack_exports__["default"] = (LoadingSpinner);

/***/ }),

/***/ "Fe2F":
/*!*******************************************************!*\
  !*** ./js/pages/tola_management_pages/program/api.js ***!
  \*******************************************************/
/*! exports provided: fetchPrograms, fetchProgramsForFilter, createProgram, updateProgram, validateGaitId, updateProgramFundingStatusBulk, fetchProgramHistory, syncGAITDates, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchPrograms", function() { return fetchPrograms; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchProgramsForFilter", function() { return fetchProgramsForFilter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createProgram", function() { return createProgram; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateProgram", function() { return updateProgram; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validateGaitId", function() { return validateGaitId; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateProgramFundingStatusBulk", function() { return updateProgramFundingStatusBulk; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchProgramHistory", function() { return fetchProgramHistory; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "syncGAITDates", function() { return syncGAITDates; });
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../api */ "XoI5");
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


var fetchPrograms = function fetchPrograms(page, filters) {
  return _api__WEBPACK_IMPORTED_MODULE_0__["api"].get('/tola_management/program/', {
    params: _objectSpread({
      page: page
    }, filters)
  }).then(function (response) {
    var data = response.data;
    var results = data.results;
    var total_results = data.count;
    var total_pages = data.page_count;
    var next_page = data.next;
    var prev_page = data.previous;
    return {
      results: results,
      total_results: total_results,
      total_pages: total_pages,
      next_page: next_page,
      prev_page: prev_page
    };
  });
};
var fetchProgramsForFilter = function fetchProgramsForFilter(filters) {
  return _api__WEBPACK_IMPORTED_MODULE_0__["api"].get('/tola_management/program/program_filter_options', {
    params: _objectSpread({}, filters)
  });
};
var createProgram = function createProgram(data) {
  return _api__WEBPACK_IMPORTED_MODULE_0__["api"].post('/tola_management/program/', data);
};
var updateProgram = function updateProgram(id, data) {
  return _api__WEBPACK_IMPORTED_MODULE_0__["api"].put("/tola_management/program/".concat(id, "/"), data);
}; // endpoint to check if gait ID is unique and return a GAIT link to view similar programs if it is not.

var validateGaitId = function validateGaitId(gaitId, id) {
  return _api__WEBPACK_IMPORTED_MODULE_0__["api"].get("/tola_management/program/".concat(id, "/gait/").concat(gaitId, "/"));
};
var updateProgramFundingStatusBulk = function updateProgramFundingStatusBulk(ids, funding_status) {
  return _api__WEBPACK_IMPORTED_MODULE_0__["api"].post('/tola_management/program/bulk_update_status/', {
    ids: ids,
    funding_status: funding_status
  });
};
var fetchProgramHistory = function fetchProgramHistory(id) {
  return _api__WEBPACK_IMPORTED_MODULE_0__["api"].get("/tola_management/program/".concat(id, "/history/"));
};
var syncGAITDates = function syncGAITDates(id) {
  return _api__WEBPACK_IMPORTED_MODULE_0__["api"].put("/tola_management/program/".concat(id, "/sync_gait_dates/"));
};
/* harmony default export */ __webpack_exports__["default"] = ({
  fetchPrograms: fetchPrograms,
  fetchProgramsForFilter: fetchProgramsForFilter,
  fetchProgramHistory: fetchProgramHistory,
  createProgram: createProgram,
  updateProgram: updateProgram,
  updateProgramFundingStatusBulk: updateProgramFundingStatusBulk,
  validateGaitId: validateGaitId,
  syncGAITDates: syncGAITDates
});

/***/ }),

/***/ "H4hL":
/*!***********************************!*\
  !*** ./js/components/expander.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }



var Expander =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Expander, _React$Component);

  function Expander(props) {
    var _this;

    _classCallCheck(this, Expander);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Expander).call(this, props));
    _this.state = {
      expanded: false,
      overflowing: false
    };
    _this.ref = react__WEBPACK_IMPORTED_MODULE_0___default.a.createRef();
    return _this;
  }

  _createClass(Expander, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.ref.current.scrollHeight > this.ref.current.clientHeight) {
        this.setState({
          overflowing: true
        });
      }
    }
  }, {
    key: "toggleExpanded",
    value: function toggleExpanded(e) {
      e.preventDefault();
      this.setState({
        expanded: !this.state.expanded
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "changelog-entry"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        ref: this.ref,
        className: "changelog-entry__expanding",
        style: {
          height: !this.state.expanded && (this.props.height || 50)
        }
      }, this.props.children), this.state.overflowing && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "changelog-entry__expand-trigger"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "",
        onClick: function onClick(e) {
          return _this2.toggleExpanded(e);
        }
      }, this.state.expanded ? 'Show Less' : 'Show More')));
    }
  }]);

  return Expander;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

/* harmony default export */ __webpack_exports__["default"] = (Expander);

/***/ }),

/***/ "KnAV":
/*!************************************!*\
  !*** ./js/components/changelog.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ "IP2g");
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }





var ChangeField = function ChangeField(_ref) {
  var name = _ref.name,
      data = _ref.data;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "change__field"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, name), ": ", data != undefined && data != null ? data.toString() : 'N/A');
};

var ChangeLogEntryHeader = function ChangeLogEntryHeader(_ref2) {
  var data = _ref2.data,
      is_expanded = _ref2.is_expanded,
      toggle_expando_cb = _ref2.toggle_expando_cb;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
    className: is_expanded ? 'changelog__entry__header is-expanded' : 'changelog__entry__header',
    onClick: function onClick() {
      return toggle_expando_cb(data.id);
    }
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
    className: "text-nowrap text-action"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_2__["FontAwesomeIcon"], {
    icon: is_expanded ? 'caret-down' : 'caret-right'
  }), "\xA0", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, data.date)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
    className: "text-nowrap"
  }, data.admin_user), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
    className: "text-nowrap"
  }, data.pretty_change_type), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null));
};

var ChangeLogEntryRow = function ChangeLogEntryRow(_ref3) {
  var data = _ref3.data;

  if (data.change_type == 'user_programs_updated') {
    // Create multiple row for program/country changes:
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, Object.entries(data.diff_list.countries).length > 0 && Object.entries(data.diff_list.countries).map(function (_ref4) {
      var _ref5 = _slicedToArray(_ref4, 2),
          id = _ref5[0],
          country = _ref5[1];

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
        key: id,
        className: "changelog__entry__row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "changelog__change--prev"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeField, {
        name: "country",
        data: country.prev.country
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeField, {
        name: "role",
        data: country.prev.role
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "changelog__change--new"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeField, {
        name: "country",
        data: country.new.country
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeField, {
        name: "role",
        data: country.new.role
      }))));
    }), Object.entries(data.diff_list.programs).length > 0 && Object.entries(data.diff_list.programs).map(function (_ref6) {
      var _ref7 = _slicedToArray(_ref6, 2),
          id = _ref7[0],
          program = _ref7[1];

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
        key: id,
        className: "changelog__entry__row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "changelog__change--prev"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeField, {
        name: "program",
        data: program.prev.program
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeField, {
        name: "country",
        data: program.prev.country
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeField, {
        name: "role",
        data: program.prev.role
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "changelog__change--new"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeField, {
        name: "program",
        data: program.new.program
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeField, {
        name: "country",
        data: program.new.country
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeField, {
        name: "role",
        data: program.new.role
      }))));
    }));
  } else {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
      className: "changelog__entry__row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
      className: "text-nowrap"
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "changelog__change--prev"
    }, data.diff_list.map(function (changeset, id) {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeField, {
        key: id,
        name: changeset.pretty_name,
        data: changeset.prev
      });
    }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "changelog__change--new"
    }, data.diff_list.map(function (changeset, id) {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeField, {
        key: id,
        name: changeset.pretty_name,
        data: changeset.new
      });
    }))));
  }
};

var ChangeLogEntry = function ChangeLogEntry(_ref8) {
  var data = _ref8.data,
      is_expanded = _ref8.is_expanded,
      toggle_expando_cb = _ref8.toggle_expando_cb;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tbody", {
    className: "changelog__entry",
    key: data.id
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeLogEntryHeader, {
    data: data,
    is_expanded: is_expanded,
    toggle_expando_cb: toggle_expando_cb
  }), is_expanded && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeLogEntryRow, {
    data: data
  }));
};

var ChangeLog = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref9) {
  var data = _ref9.data,
      expanded_rows = _ref9.expanded_rows,
      toggle_expando_cb = _ref9.toggle_expando_cb;
  // If expanded_rows is not null/undefined then use it to control expansion/collapse of entries
  // otherwise, default it to "open"
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("table", {
    className: "table table-sm bg-white table-bordered text-small changelog"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("thead", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    className: "text-nowrap"
  }, gettext("Date")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    className: "text-nowrap"
  }, gettext("Admin")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    className: "text-nowrap"
  }, gettext("Change Type")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    className: "text-nowrap td--half-stretch"
  }, gettext("Previous Entry")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    className: "text-nowrap td--half-stretch"
  }, gettext("New Entry")))), data.map(function (entry) {
    var is_expanded = true;

    if (expanded_rows) {
      is_expanded = expanded_rows.has(entry.id);
    }

    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeLogEntry, {
      key: entry.id,
      data: entry,
      is_expanded: is_expanded,
      toggle_expando_cb: toggle_expando_cb
    });
  }));
});
/* harmony default export */ __webpack_exports__["default"] = (ChangeLog);

/***/ }),

/***/ "P05O":
/*!***********************************************************************************!*\
  !*** ./js/pages/tola_management_pages/program/components/edit_program_profile.js ***!
  \***********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return EditProgramProfile; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-select */ "y2Vs");
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var components_checkboxed_multi_select__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! components/checkboxed-multi-select */ "Z2Y6");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! classnames */ "TSYQ");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_4__);
var _class;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }






var ErrorFeedback = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(function (_ref) {
  var errorMessages = _ref.errorMessages;

  if (!errorMessages) {
    return null;
  }

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "invalid-feedback"
  }, errorMessages.map(function (message, index) {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      key: index
    }, message);
  }));
});

var EditProgramProfile = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class =
/*#__PURE__*/
function (_React$Component) {
  _inherits(EditProgramProfile, _React$Component);

  function EditProgramProfile(props) {
    var _this;

    _classCallCheck(this, EditProgramProfile);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(EditProgramProfile).call(this, props));
    var program_data = props.program_data;
    _this.state = {
      original_data: Object.assign({}, program_data),
      managed_data: Object.assign({}, program_data)
    };
    return _this;
  }

  _createClass(EditProgramProfile, [{
    key: "hasUnsavedDataAction",
    value: function hasUnsavedDataAction() {
      this.props.onIsDirtyChange(JSON.stringify(this.state.managed_data) != JSON.stringify(this.state.original_data));
    }
  }, {
    key: "save",
    value: function save() {
      var program_id = this.props.program_data.id;
      var program_data = this.state.managed_data;
      this.props.onUpdate(program_id, program_data);
    }
  }, {
    key: "saveNew",
    value: function saveNew(e) {
      e.preventDefault();
      var program_data = this.state.managed_data;
      this.props.onCreate(program_data);
    }
  }, {
    key: "updateFormField",
    value: function updateFormField(fieldKey, val) {
      var _this2 = this;

      this.setState({
        managed_data: Object.assign(this.state.managed_data, _defineProperty({}, fieldKey, val))
      }, function () {
        return _this2.hasUnsavedDataAction();
      });
    }
  }, {
    key: "resetForm",
    value: function resetForm() {
      var _this3 = this;

      this.setState({
        managed_data: Object.assign({}, this.state.original_data)
      }, function () {
        return _this3.hasUnsavedDataAction();
      });
    }
  }, {
    key: "formErrors",
    value: function formErrors(fieldKey) {
      return this.props.errors[fieldKey];
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var formdata = this.state.managed_data;
      var selectedCountries = formdata.country.map(function (x) {
        return _this4.props.countryOptions.find(function (y) {
          return y.value == x;
        });
      });
      var selectedSectors = formdata.sector.map(function (x) {
        return _this4.props.sectorOptions.find(function (y) {
          return y.value == x;
        });
      });
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "tab-pane--react"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", {
        className: "no-bold"
      }, this.props.program_data.name ? this.props.program_data.name + ': ' : '', gettext("Profile")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("form", {
        className: "form"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "label--required",
        htmlFor: "program-name-input"
      }, gettext("Program name")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "text",
        value: formdata.name,
        onChange: function onChange(e) {
          return _this4.updateFormField('name', e.target.value);
        },
        className: classnames__WEBPACK_IMPORTED_MODULE_4___default()('form-control', {
          'is-invalid': this.formErrors('name')
        }),
        id: "program-name-input",
        required: true
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ErrorFeedback, {
        errorMessages: this.formErrors('name')
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        htmlFor: "program-gait-input"
      }, gettext("GAIT ID")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "tel",
        value: formdata.gaitid,
        onChange: function onChange(e) {
          return _this4.updateFormField('gaitid', e.target.value);
        },
        className: classnames__WEBPACK_IMPORTED_MODULE_4___default()('form-control', {
          'is-invalid': this.formErrors('gaitid')
        }),
        id: "program-gait-input",
        disabled: !this.props.new
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ErrorFeedback, {
        errorMessages: this.formErrors('gaitid')
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        htmlFor: "program-fund-code-input"
      }, gettext("Fund Code")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "tel",
        value: "",
        onChange: function onChange(e) {
          return _this4.updateFormField('fundCode', e.target.value);
        },
        className: classnames__WEBPACK_IMPORTED_MODULE_4___default()('form-control', {
          'is-invalid': this.formErrors('fundCode')
        }),
        id: "program-fund-code-input",
        disabled: true
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ErrorFeedback, {
        errorMessages: this.formErrors('fundCode')
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        htmlFor: "program-description-input"
      }, gettext("Description")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("textarea", {
        value: formdata.description || '',
        onChange: function onChange(e) {
          return _this4.updateFormField('description', e.target.value);
        },
        className: classnames__WEBPACK_IMPORTED_MODULE_4___default()('form-control', {
          'is-invalid': this.formErrors('description')
        }),
        id: "program-description-input"
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ErrorFeedback, {
        errorMessages: this.formErrors('description')
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group react-multiselect-checkbox"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        htmlFor: "program-county-input",
        className: "label--required"
      }, gettext("Countries")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_checkboxed_multi_select__WEBPACK_IMPORTED_MODULE_3__["default"], {
        value: selectedCountries,
        options: this.props.countryOptions,
        onChange: function onChange(e) {
          return _this4.updateFormField('country', e.map(function (x) {
            return x.value;
          }));
        },
        className: classnames__WEBPACK_IMPORTED_MODULE_4___default()('react-select', {
          'is-invalid': this.formErrors('country')
        }),
        id: "program-country-input"
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ErrorFeedback, {
        errorMessages: this.formErrors('country')
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group react-multiselect-checkbox"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        htmlFor: "program-sectors-input"
      }, gettext("Sectors")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_checkboxed_multi_select__WEBPACK_IMPORTED_MODULE_3__["default"], {
        value: selectedSectors,
        options: this.props.sectorOptions,
        onChange: function onChange(e) {
          return _this4.updateFormField('sector', e.map(function (x) {
            return x.value;
          }));
        },
        className: classnames__WEBPACK_IMPORTED_MODULE_4___default()('react-select', {
          'is-invalid': this.formErrors('sector')
        }),
        id: "program-sectors-input"
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ErrorFeedback, {
        errorMessages: this.formErrors('sector')
      })), this.props.new && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group btn-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-primary",
        type: "button",
        onClick: function onClick(e) {
          return _this4.saveNew(e);
        }
      }, gettext("Save Changes")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-reset",
        type: "button",
        onClick: function onClick() {
          return _this4.resetForm();
        }
      }, gettext("Reset"))), !this.props.new && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group btn-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-primary",
        type: "button",
        onClick: function onClick(e) {
          return _this4.save(e);
        }
      }, gettext("Save Changes")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-reset",
        type: "button",
        onClick: function onClick() {
          return _this4.resetForm();
        }
      }, gettext("Reset")))));
    }
  }]);

  return EditProgramProfile;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component)) || _class;



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
/* harmony import */ var react_paginate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-paginate */ "werx");
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
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_paginate__WEBPACK_IMPORTED_MODULE_1___default.a, _extends({
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

/***/ "TGVD":
/*!*******************************************!*\
  !*** ./js/components/management-table.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ "TSYQ");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }



 // TODO: "size" is no longer used

var ColumnComponent = function ColumnComponent(_ref) {
  var className = _ref.className,
      size = _ref.size,
      props = _objectWithoutProperties(_ref, ["className", "size"]);

  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("td", _extends({
    className: ["mgmt-table__col", className].join(' ')
  }, props), props.children);
}; // TODO: this is redundant with ColumnComponent


var HeaderColumnComponent = function HeaderColumnComponent(_ref2) {
  var className = _ref2.className,
      size = _ref2.size,
      props = _objectWithoutProperties(_ref2, ["className", "size"]);

  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("th", _extends({
    className: ["mgmt-table__col", className].join(' ')
  }, props), props.children);
};

var InnerRowComponent = function InnerRowComponent(_ref3) {
  var className = _ref3.className,
      props = _objectWithoutProperties(_ref3, ["className"]);

  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("tr", _extends({
    className: ["mgmt-table__row", className].join(' ')
  }, props), props.children);
}; // TODO: this is redundant with InnerRowComponent


var HeaderRowComponent = function HeaderRowComponent(_ref4) {
  var className = _ref4.className,
      props = _objectWithoutProperties(_ref4, ["className"]);

  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("tr", _extends({
    className: ["mgmt-table__row table-header", className].join(' ')
  }, props), props.children);
};
/***
    A wrapper for the rendering of the given row renderer, it takes and expando
    renderer used to render expanded content

    Props:
    - expanded: whether the expando content is shown or not
    - Expando: The content to render when the expando is shown
*/


var RowComponent = Object(mobx_react__WEBPACK_IMPORTED_MODULE_0__["observer"])(function (_ref5) {
  var className = _ref5.className,
      expanded = _ref5.expanded,
      Expando = _ref5.Expando,
      props = _objectWithoutProperties(_ref5, ["className", "expanded", "Expando"]);

  if (Expando) {
    var ObservedExpando = Object(mobx_react__WEBPACK_IMPORTED_MODULE_0__["observer"])(Expando);
    return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("tbody", _extends({
      className: classnames__WEBPACK_IMPORTED_MODULE_2___default()(["mgmt-table__body", className].join(' '), {
        "is-expanded": expanded
      })
    }, props), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(InnerRowComponent, null, props.children), expanded && react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(ObservedExpando, {
      Wrapper: ExpandoWrapper
    }));
  } else {
    return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("tbody", _extends({
      className: ["mgmt-table__body", className].join(' ')
    }, props), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(InnerRowComponent, null, props.children));
  }
});

var ExpandoWrapper = function ExpandoWrapper(_ref6) {
  var className = _ref6.className,
      props = _objectWithoutProperties(_ref6, ["className"]);

  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("tr", _extends({
    className: ["mgmt-table__row--expanded", className].join(' ')
  }, props), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("td", {
    colSpan: "6"
  }, props.children));
};

var RowList = Object(mobx_react__WEBPACK_IMPORTED_MODULE_0__["observer"])(function (_ref7) {
  var data = _ref7.data,
      Row = _ref7.Row,
      keyField = _ref7.keyField,
      props = _objectWithoutProperties(_ref7, ["data", "Row", "keyField"]);

  var ObservedRow = Object(mobx_react__WEBPACK_IMPORTED_MODULE_0__["observer"])(Row);
  return data.map(function (row_data) {
    return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(ObservedRow, {
      key: row_data[keyField],
      data: row_data,
      Col: ColumnComponent,
      Row: RowComponent
    });
  });
});
/*
   Props:

   - HeaderRow: a function to render the header row. it receives a component
   prop to render the header column and row

   - Row: a function used to render each row. it receives a component prop to
    render the row (see RowComponent), it receives the relevant data for that
    row as a prop: data

   - data: the dataset used to render the table, it must be an array

   - keyField: field to use for key on rows and expando checking

 */

var ManagementTable = Object(mobx_react__WEBPACK_IMPORTED_MODULE_0__["observer"])(function (_ref8) {
  var HeaderRow = _ref8.HeaderRow,
      className = _ref8.className,
      props = _objectWithoutProperties(_ref8, ["HeaderRow", "className"]);

  var ObservedHeaderRow = Object(mobx_react__WEBPACK_IMPORTED_MODULE_0__["observer"])(HeaderRow);
  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("table", {
    className: ['table bg-white', className].join(' ')
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("thead", null, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(ObservedHeaderRow, {
    Col: HeaderColumnComponent,
    Row: HeaderRowComponent
  })), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(RowList, props));
});
/* harmony default export */ __webpack_exports__["default"] = (ManagementTable);

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

/***/ "Z2Y6":
/*!**************************************************!*\
  !*** ./js/components/checkboxed-multi-select.js ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-select */ "y2Vs");
/* harmony import */ var _virtualized_react_select__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./virtualized-react-select */ "5Xg7");
/* harmony import */ var react_multiselect_checkboxes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-multiselect-checkboxes */ "VCnP");
/* harmony import */ var react_multiselect_checkboxes__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_multiselect_checkboxes__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! mobx-react */ "okNM");
var _class, _temp;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }







var CountLabel = function CountLabel(props) {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "count__label"
  }, props.children, props.clearable && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    onClick: props.clearSelect
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
    className: "fa fa-times",
    "aria-hidden": "true"
  })));
};

var CheckboxedMultiSelect = Object(mobx_react__WEBPACK_IMPORTED_MODULE_4__["observer"])(_class = (_temp =
/*#__PURE__*/
function (_React$Component) {
  _inherits(CheckboxedMultiSelect, _React$Component);

  function CheckboxedMultiSelect(props) {
    var _this;

    _classCallCheck(this, CheckboxedMultiSelect);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CheckboxedMultiSelect).call(this, props));

    _this.clearSelect = function (e) {
      e.stopPropagation();

      _this.props.onChange([]);

      ;
    };

    _this.makeLabel = function (_ref3) {
      var placeholderButtonLabel = _ref3.placeholderButtonLabel,
          thisValue = _ref3.value;

      if (!thisValue) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(CountLabel, {
          clearable: false
        }, placeholderButtonLabel);
      }

      if (Array.isArray(thisValue)) {
        if (thisValue.length === 0) {
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(CountLabel, {
            clearable: false
          }, placeholderButtonLabel);
        }

        if (thisValue.length === 1) {
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(CountLabel, {
            clearable: true,
            clearSelect: _this.clearSelect
          }, thisValue[0].label);
        }

        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(CountLabel, {
          clearable: true,
          clearSelect: _this.clearSelect
        }, "".concat(thisValue.length, " ", gettext("selected")));
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(CountLabel, {
        clearable: false
      }, thisValue.label);
    };

    return _this;
  }

  _createClass(CheckboxedMultiSelect, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_multiselect_checkboxes__WEBPACK_IMPORTED_MODULE_3___default.a, _extends({}, this.props, {
        placeholder: gettext("Search"),
        placeholderButtonLabel: this.props.placeholder,
        getDropdownButtonLabel: this.makeLabel,
        components: {
          MenuList: _virtualized_react_select__WEBPACK_IMPORTED_MODULE_2__["VirtualizedMenuList"]
        }
      }));
    }
  }]);

  return CheckboxedMultiSelect;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp)) || _class;

/* harmony default export */ __webpack_exports__["default"] = (CheckboxedMultiSelect);

/***/ }),

/***/ "qXK4":
/*!*********************************************************!*\
  !*** ./js/pages/tola_management_pages/program/views.js ***!
  \*********************************************************/
/*! exports provided: IndexView */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IndexView", function() { return IndexView; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-select */ "y2Vs");
/* harmony import */ var components_checkboxed_multi_select__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! components/checkboxed-multi-select */ "Z2Y6");
/* harmony import */ var components_management_table__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! components/management-table */ "TGVD");
/* harmony import */ var components_pagination__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! components/pagination */ "RCjz");
/* harmony import */ var _components_program_editor__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/program_editor */ "tlOy");
/* harmony import */ var _components_edit_program_profile__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/edit_program_profile */ "P05O");
/* harmony import */ var _components_program_settings__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/program_settings */ "vNzB");
/* harmony import */ var _components_program_history__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./components/program_history */ "7Eka");
/* harmony import */ var components_loading_spinner__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! components/loading-spinner */ "DDFe");
/* harmony import */ var components_folding_sidebar__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! components/folding-sidebar */ "tnXs");
/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ "IP2g");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }














var UserFilter = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref) {
  var store = _ref.store,
      filterOptions = _ref.filterOptions;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "form-group react-multiselect-checkbox"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    htmlFor: "users_filter"
  }, gettext("Users")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_checkboxed_multi_select__WEBPACK_IMPORTED_MODULE_3__["default"], {
    value: store.filters.users,
    options: filterOptions,
    onChange: function onChange(e) {
      return store.changeFilter('users', e);
    },
    placeholder: gettext("None Selected"),
    id: "users_filter"
  }));
});
var CountryFilter = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref2) {
  var store = _ref2.store,
      filterOptions = _ref2.filterOptions;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "form-group react-multiselect-checkbox"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    htmlFor: "countries_filter"
  }, gettext("Countries")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_checkboxed_multi_select__WEBPACK_IMPORTED_MODULE_3__["default"], {
    value: store.filters.countries,
    options: filterOptions,
    onChange: function onChange(e) {
      return store.changeFilter('countries', e);
    },
    placeholder: gettext("None Selected"),
    id: "countries_filter"
  }));
});
var OrganizationFilter = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref3) {
  var store = _ref3.store,
      filterOptions = _ref3.filterOptions;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "form-group react-multiselect-checkbox"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    htmlFor: "organizations_filter"
  }, gettext("Organizations")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_checkboxed_multi_select__WEBPACK_IMPORTED_MODULE_3__["default"], {
    value: store.filters.organizations,
    options: filterOptions,
    onChange: function onChange(e) {
      return store.changeFilter('organizations', e);
    },
    placeholder: gettext("None Selected"),
    id: "organizations_filter"
  }));
});
var SectorFilter = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref4) {
  var store = _ref4.store,
      filterOptions = _ref4.filterOptions;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "form-group react-multiselect-checkbox"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    htmlFor: "sector-filter"
  }, gettext("Sectors")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_checkboxed_multi_select__WEBPACK_IMPORTED_MODULE_3__["default"], {
    value: store.filters.sectors,
    options: filterOptions,
    onChange: function onChange(e) {
      return store.changeFilter('sectors', e);
    },
    placeholder: gettext("None Selected"),
    id: "sector-filter"
  }));
});
var ProgramStatusFilter = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref5) {
  var store = _ref5.store;
  var statusFilterOptions = [{
    value: 'Active',
    label: gettext('Active')
  }, {
    value: 'Inactive',
    label: gettext('Inactive')
  }];
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "form-group"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    htmlFor: "program-status-filter"
  }, gettext("Status")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_2__["default"], {
    isMulti: false,
    value: store.filters.programStatus,
    options: statusFilterOptions,
    onChange: function onChange(e) {
      return store.changeFilter('programStatus', e);
    },
    placeholder: gettext("None Selected"),
    id: "program-status-filter"
  }));
});
var ProgramFilter = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref6) {
  var store = _ref6.store,
      filterOptions = _ref6.filterOptions;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "form-group react-multiselect-checkbox"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    htmlFor: "programs-filter"
  }, gettext("Programs")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_checkboxed_multi_select__WEBPACK_IMPORTED_MODULE_3__["default"], {
    value: store.filters.programs,
    options: filterOptions,
    onChange: function onChange(e) {
      return store.changeFilter('programs', e);
    },
    placeholder: gettext("None Selected"),
    id: "programs-filter"
  }));
});

var BulkActions =
/*#__PURE__*/
function (_React$Component) {
  _inherits(BulkActions, _React$Component);

  function BulkActions(props) {
    var _this;

    _classCallCheck(this, BulkActions);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(BulkActions).call(this, props));
    _this.active_child = react__WEBPACK_IMPORTED_MODULE_0___default.a.createRef();
    _this.state = {
      current_action: null,
      current_vals: []
    };
    return _this;
  }

  _createClass(BulkActions, [{
    key: "onActionChanged",
    value: function onActionChanged(new_action) {
      this.setState({
        current_action: new_action.value
      });
    }
  }, {
    key: "onChange",
    value: function onChange(vals) {
      this.setState({
        current_vals: vals
      });
    }
  }, {
    key: "onApply",
    value: function onApply() {
      var selected = this.props.secondaryOptions[this.state.current_action];

      if (selected) {
        selected.onApply(this.state.current_vals);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var selected = this.props.secondaryOptions[this.state.current_action];
      var SecondaryComponent = selected && selected.component;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "controls__bulk-actions"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "bulk__select"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_2__["default"], {
        placeholder: gettext("Bulk Actions"),
        value: this.props.primaryOptions.find(function (o) {
          return o.value == _this2.state.current_action;
        }),
        options: this.props.primaryOptions,
        onChange: function onChange(val) {
          return _this2.onActionChanged(val);
        }
      })), selected && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "bulk__select"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SecondaryComponent, {
        placeholder: gettext("Select..."),
        value: this.state.current_vals,
        onChange: function onChange(vals) {
          return _this2.onChange(vals);
        }
      })), !selected && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "bulk__select"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_2__["default"], {
        placeholder: "---",
        noOptionsMessage: function noOptionsMessage() {
          return gettext('No options');
        }
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-secondary",
        disabled: !this.state.current_action,
        onClick: function onClick() {
          return _this2.onApply();
        }
      }, gettext("Apply")));
    }
  }]);

  return BulkActions;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

var IndexView = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref7) {
  var store = _ref7.store;
  var allCountryOptions = Object.entries(store.allCountries).map(function (_ref8) {
    var _ref9 = _slicedToArray(_ref8, 2),
        id = _ref9[0],
        country = _ref9[1];

    return {
      value: country.id,
      label: country.name
    };
  });
  var countryFilterOptions = Object.entries(store.countries).map(function (_ref10) {
    var _ref11 = _slicedToArray(_ref10, 2),
        id = _ref11[0],
        country = _ref11[1];

    return {
      value: country.id,
      label: country.name
    };
  });
  var organizationFilterOptions = Object.entries(store.organizations).map(function (_ref12) {
    var _ref13 = _slicedToArray(_ref12, 2),
        id = _ref13[0],
        org = _ref13[1];

    return {
      value: org.id,
      label: org.name
    };
  });
  var sectorFilterOptions = store.sectors.map(function (x) {
    return {
      value: x.id,
      label: x.name
    };
  });
  var programFilterOptions = Object.entries(store.programFilterPrograms).map(function (_ref14) {
    var _ref15 = _slicedToArray(_ref14, 2),
        id = _ref15[0],
        program = _ref15[1];

    return {
      value: program.id,
      label: program.name
    };
  });
  var userFilterOptions = Object.entries(store.users).map(function (_ref16) {
    var _ref17 = _slicedToArray(_ref16, 2),
        id = _ref17[0],
        user = _ref17[1];

    return {
      value: user.id,
      label: user.name
    };
  });
  var bulkProgramStatusOptions = [{
    value: 'Funded',
    label: gettext('Active')
  }, {
    value: 'Completed',
    label: gettext('Inactive')
  }]; // See #1479 as to why this makes sense

  var fundingStatusDisplayStr = function fundingStatusDisplayStr(funding_status_str) {
    return funding_status_str.toLowerCase() === 'funded' ? gettext('Active') : gettext('Inactive');
  };

  var bulk_actions = {
    primary_options: [{
      label: gettext('Set program status'),
      value: 'set_program_status'
    }],
    secondary_options: {
      set_program_status: {
        component: function component(props) {
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_2__["default"], _extends({
            options: bulkProgramStatusOptions
          }, props));
        },
        onApply: function onApply(option) {
          return store.bulkUpdateProgramStatus(option.value);
        }
      }
    }
  };

  var organizationColumn = function organizationColumn(data) {
    if (data.organizations) {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "/tola_management/organization/?programs[]=".concat(data.id)
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-building"
      }), "\xA0", data.onlyOrganizationId ? store.organizations[data.onlyOrganizationId].name : "".concat(data.organizations, " organizations"));
    }

    return "---";
  };

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    id: "program-management-index-view",
    className: "row"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_folding_sidebar__WEBPACK_IMPORTED_MODULE_11__["default"], null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "filter-section"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(CountryFilter, {
    store: store,
    filterOptions: countryFilterOptions
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(UserFilter, {
    store: store,
    filterOptions: userFilterOptions
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(OrganizationFilter, {
    store: store,
    filterOptions: organizationFilterOptions
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SectorFilter, {
    store: store,
    filterOptions: sectorFilterOptions
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ProgramStatusFilter, {
    store: store
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ProgramFilter, {
    store: store,
    filterOptions: programFilterOptions
  })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "filter-section filter-buttons"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
    className: "btn btn-primary",
    onClick: function onClick() {
      return store.applyFilters();
    }
  }, gettext("Apply")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
    className: "btn btn-reset",
    onClick: function onClick() {
      return store.clearFilters();
    }
  }, gettext("Reset")))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "col admin-list"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("header", {
    className: "page-title"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h1", null, gettext("Admin:"), " ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("small", null, gettext("Programs")))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "admin-list__controls"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(BulkActions, {
    primaryOptions: bulk_actions.primary_options,
    secondaryOptions: bulk_actions.secondary_options
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "controls__buttons"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
    href: "#",
    className: "btn btn-link btn-add",
    tabIndex: "0",
    onClick: function onClick() {
      return store.createProgram();
    }
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
    className: "fas fa-plus-circle"
  }), gettext("Add Program")))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_loading_spinner__WEBPACK_IMPORTED_MODULE_10__["default"], {
    isLoading: store.fetching_main_listing || store.applying_bulk_updates
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "admin-list__table"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_management_table__WEBPACK_IMPORTED_MODULE_4__["default"], {
    newData: store.new_program,
    data: store.programs,
    keyField: "id",
    HeaderRow: function HeaderRow(_ref18) {
      var Col = _ref18.Col,
          Row = _ref18.Row;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Row, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, {
        size: "0.5"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "checkbox",
        checked: store.bulk_targets_all,
        onChange: function onChange() {
          return store.toggleBulkTargetsAll();
        }
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, {
        size: "2",
        className: "td--stretch"
      }, gettext("Program")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, null, gettext("Organizations")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, null, gettext("Users")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, null, gettext("Status")));
    },
    Row: function Row(_ref19) {
      var Col = _ref19.Col,
          Row = _ref19.Row,
          data = _ref19.data;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Row, {
        expanded: data.id == store.editing_target,
        Expando: Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref20) {
          var Wrapper = _ref20.Wrapper;
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Wrapper, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_program_editor__WEBPACK_IMPORTED_MODULE_6__["default"], {
            new: data.id == 'new',
            active_pane: store.active_editor_pane,
            notifyPaneChange: function notifyPaneChange(new_pane) {
              return store.onProfilePaneChange(new_pane);
            },
            ProfileSection: Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function () {
              return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_loading_spinner__WEBPACK_IMPORTED_MODULE_10__["default"], {
                isLoading: store.saving
              }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_edit_program_profile__WEBPACK_IMPORTED_MODULE_7__["default"], {
                onIsDirtyChange: function onIsDirtyChange(is_dirty) {
                  return store.setActiveFormIsDirty(is_dirty);
                },
                new: data.id == 'new',
                program_data: data,
                onUpdate: function onUpdate(id, data) {
                  return store.updateProgram(id, data);
                },
                onCreate: function onCreate(new_program_data) {
                  return store.saveNewProgram(new_program_data);
                },
                sectorOptions: sectorFilterOptions,
                countryOptions: allCountryOptions,
                errors: store.editing_errors
              }));
            }),
            SettingsSection: Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function () {
              return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_loading_spinner__WEBPACK_IMPORTED_MODULE_10__["default"], {
                isLoading: store.saving
              }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_program_settings__WEBPACK_IMPORTED_MODULE_8__["default"], {
                program_data: data,
                store: store,
                onSave: function onSave(id, data) {
                  return store.updateProgram(id, data);
                }
              }));
            }),
            HistorySection: Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function () {
              return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_loading_spinner__WEBPACK_IMPORTED_MODULE_10__["default"], {
                isLoading: store.saving
              }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_program_history__WEBPACK_IMPORTED_MODULE_9__["default"], {
                store: store,
                onIsDirtyChange: function onIsDirtyChange(is_dirty) {
                  return store.setActiveFormIsDirty(is_dirty);
                },
                program_data: data,
                fetching_history: store.fetching_editing_history,
                history: store.editing_history,
                saving: store.saving,
                onSave: function onSave(id, data) {
                  return store.updateProgram(id, data);
                }
              }));
            })
          }));
        })
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, {
        size: "0.5"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "checkbox",
        disabled: data.id == 'new',
        checked: store.bulk_targets.get(data.id) || false,
        onChange: function onChange() {
          return store.toggleBulkTarget(data.id);
        }
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, {
        size: "2",
        className: "td--stretch"
      }, data.id == 'new' && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "expando-toggle icon__disabled"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "expando-toggle__icon"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_12__["FontAwesomeIcon"], {
        icon: store.editing_target == data.id ? 'caret-down' : 'caret-right'
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "expando-toggle__label"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-cube"
      }), "\xA0", data.name || "New Program")), data.id != 'new' && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "expando-toggle icon__clickable",
        onClick: function onClick() {
          return store.toggleEditingTarget(data.id);
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "expando-toggle__icon"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_12__["FontAwesomeIcon"], {
        icon: store.editing_target == data.id ? 'caret-down' : 'caret-right'
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "expando-toggle__label"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-cube"
      }), "\xA0", data.name || "New Program"))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, null, organizationColumn(data)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, {
        className: "text-nowrap"
      }, data.program_users ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "/tola_management/user/?programs[]=".concat(data.id)
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-users"
      }), "\xA0", data.program_users, " ", gettext("users")) : '---'), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, null, fundingStatusDisplayStr(data.funding_status)));
    }
  }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "admin-list__metadata"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "metadata__count text-small text-muted"
  }, store.program_count ? "".concat(store.program_count, " ").concat(gettext("programs")) : "---"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "metadata__controls"
  }, store.total_pages && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_pagination__WEBPACK_IMPORTED_MODULE_5__["default"], {
    pageCount: store.total_pages,
    initialPage: store.current_page,
    onPageChange: function onPageChange(page) {
      return store.changePage(page);
    }
  })))));
});

/***/ }),

/***/ "tlOy":
/*!*****************************************************************************!*\
  !*** ./js/pages/tola_management_pages/program/components/program_editor.js ***!
  \*****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ProgramEditor; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "okNM");
var _class;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




var ProgramEditor = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class =
/*#__PURE__*/
function (_React$Component) {
  _inherits(ProgramEditor, _React$Component);

  function ProgramEditor() {
    _classCallCheck(this, ProgramEditor);

    return _possibleConstructorReturn(this, _getPrototypeOf(ProgramEditor).apply(this, arguments));
  }

  _createClass(ProgramEditor, [{
    key: "updateActivePage",
    value: function updateActivePage(new_page) {
      if (!this.props.new) {
        this.props.notifyPaneChange(new_page);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;

      var _this$props = this.props,
          ProfileSection = _this$props.ProfileSection,
          SettingsSection = _this$props.SettingsSection,
          HistorySection = _this$props.HistorySection,
          active_pane = _this$props.active_pane;
      var profile_active_class = active_pane == 'profile' ? 'active' : '';
      var settings_active_class = active_pane == 'settings' ? 'active' : '';
      var history_active_class = active_pane == 'status_and_history' ? 'active' : '';
      var new_class = this.props.new ? 'disabled' : '';
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "user-editor tab-set--vertical"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", {
        className: "nav nav-tabs"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
        className: "nav-item"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        className: "nav-link ".concat(profile_active_class),
        onClick: function onClick(e) {
          e.preventDefault();

          _this.updateActivePage('profile');
        }
      }, gettext("Profile"))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
        className: "nav-item"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        className: "nav-link ".concat(settings_active_class, " ").concat(new_class),
        onClick: function onClick(e) {
          e.preventDefault();

          _this.updateActivePage('settings');
        }
      }, gettext("Settings"))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
        className: "nav-item"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        className: "nav-link ".concat(history_active_class, " ").concat(new_class),
        onClick: function onClick(e) {
          e.preventDefault();

          _this.updateActivePage('status_and_history');
        }
      }, gettext("Status and History")))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "tab-content"
      }, active_pane == 'profile' && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ProfileSection, null), active_pane == 'settings' && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SettingsSection, null), active_pane == 'status_and_history' && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(HistorySection, null)));
    }
  }]);

  return ProgramEditor;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component)) || _class;



/***/ }),

/***/ "tnXs":
/*!******************************************!*\
  !*** ./js/components/folding-sidebar.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }


/* Sidebar expando/collapso mimicking bootstrap behavior
 * CSS in components/_folding_sidebar.scss
 * Usage: <FoldingSidebar>
 *          children to be hidden when toggle is clicked
 *         </FoldingSidebar>
 */

var FoldingSidebar =
/*#__PURE__*/
function (_React$Component) {
  _inherits(FoldingSidebar, _React$Component);

  function FoldingSidebar(props) {
    var _this;

    _classCallCheck(this, FoldingSidebar);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FoldingSidebar).call(this, props));

    _this.updateDimensions = function () {
      if (!_this.state.folded && !_this.state.folding) {
        _this.setState(function () {
          return {
            resize: true
          };
        }, function () {
          _this.contentWidth = _this.contentsContainer.current.offsetWidth;

          _this.setState({
            resize: false
          });
        });
      }
    };

    _this.state = {
      folding: false,
      folded: false,
      resize: false
    };
    _this.contentsContainer = react__WEBPACK_IMPORTED_MODULE_0___default.a.createRef();
    return _this;
  }

  _createClass(FoldingSidebar, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.contentWidth = this.contentsContainer.current.offsetWidth;
      window.addEventListener("resize", this.updateDimensions);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      window.removeEventListener("resize", this.updateDimensions);
    }
  }, {
    key: "toggleFolded",
    value: function toggleFolded() {
      if (!this.state.folding) {
        this.setState({
          folding: true,
          folded: !this.state.folded
        });
      } else {
        this.foldComplete();
      }
    }
  }, {
    key: "foldComplete",
    value: function foldComplete() {
      this.setState(function () {
        return {
          folding: false
        };
      }, this.updateDimensions);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          className = _this$props.className,
          props = _objectWithoutProperties(_this$props, ["className"]);

      var icon = this.state.folded ? this.state.folding ? "fa-angle-double-left" : "fa-chevron-right" : this.state.folding ? "fa-angle-double-right" : "fa-chevron-left";
      var width = this.state.folded ? "0px" : this.state.resize ? "auto" : this.contentWidth + "px";
      var overflow = this.state.folded || this.state.folding ? "hidden" : "visible";
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", _extends({
        className: "folding-sidebar " + (className || '')
      }, props), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "folding-sidebar__contents",
        onTransitionEnd: function onTransitionEnd() {
          return _this2.foldComplete();
        },
        ref: this.contentsContainer,
        style: {
          width: width,
          overflow: overflow
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, this.props.children)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "folding-sidebar__trigger",
        onClick: function onClick() {
          return _this2.toggleFolded();
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        key: icon
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "fa " + icon
      }))));
    }
  }]);

  return FoldingSidebar;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

/* harmony default export */ __webpack_exports__["default"] = (FoldingSidebar);

/***/ }),

/***/ "vNzB":
/*!*******************************************************************************!*\
  !*** ./js/pages/tola_management_pages/program/components/program_settings.js ***!
  \*******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ProgramSettings; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "okNM");
var _class, _temp;

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




var ProgramSettings = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class = (_temp =
/*#__PURE__*/
function (_React$Component) {
  _inherits(ProgramSettings, _React$Component);

  function ProgramSettings(props) {
    var _this;

    _classCallCheck(this, ProgramSettings);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ProgramSettings).call(this, props));

    _this.autonumberChange = function (e) {
      if (e.target.value == "2") {
        _this.setState({
          autonumber: false
        });
      } else {
        _this.setState({
          autonumber: true
        });
      }
    };

    _this.groupingChange = function (e) {
      if (e.target.checked) {
        _this.setState({
          grouping: 2
        });
      } else {
        _this.setState({
          grouping: 1
        });
      }
    };

    _this.save = function (e) {
      e.preventDefault();

      var data = _objectSpread({}, _this.props.program_data);

      if (_this.state.grouping !== false) {
        data._using_results_framework = _this.state.grouping;
      }

      if (_this.state.autonumber !== null) {
        data.auto_number_indicators = _this.state.autonumber;
      }

      _this.props.onSave(_this.props.program_data.id, data);
    };

    var grouping = props.program_data._using_results_framework === undefined ? false : props.program_data._using_results_framework;
    var autonumber = grouping === 1 ? null : props.program_data.auto_number_indicators;
    _this.state = {
      autonumber: autonumber,
      grouping: grouping
    };
    var originalState = {
      autonumber: autonumber,
      grouping: grouping
    };

    _this.resetForm = function () {
      _this.setState(originalState);
    };

    _this.formDirty = function () {
      return _this.state.autonumber != originalState.autonumber || _this.state.grouping != originalState.grouping;
    };

    return _this;
  }

  _createClass(ProgramSettings, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "tab-pane--react"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", {
        className: "no-bold"
      }, this.props.program_data.name ? this.props.program_data.name + ': ' : '', gettext("Settings")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "d-flex flex-column w-75 pr-5"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("form", {
        className: "form"
      }, this.state.grouping !== false && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h4", null, gettext("Indicator grouping")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-check mb-3"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        className: "form-check-input",
        type: "checkbox",
        name: "grouping",
        id: "grouping",
        checked: this.state.grouping == 2,
        onChange: this.groupingChange
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "form-check-label",
        htmlFor: "grouping"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, gettext('Group indicators according to the results framework'), ":"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, "\xA0 ", gettext('After you have set a results framework for this program and assigned indicators to it, ' + 'select this option to retire the original indicator levels and view indicators grouped by ' + 'results framework levels instead.  This setting affects the program page, indicator plan, ' + 'and IPTT reports.'))))), this.state.autonumber !== null && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h4", null, gettext("Indicator numbering")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-check mb-3"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        className: "form-check-input",
        type: "radio",
        value: "1",
        name: "autonumber",
        id: "autonumber_on",
        checked: this.state.autonumber,
        onChange: this.autonumberChange
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "form-check-label",
        htmlFor: "autonumber_on"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, // # Translators: Auto-number meaning the system will do this automatically
      gettext('Auto-number indicators (recommended)'), ":"), "\xA0 ", gettext('Indicator numbers are automatically determined by their results framework assignments.'))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-check mb-5"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        className: "form-check-input",
        type: "radio",
        value: "2",
        name: "autonumber",
        id: "autonumber_off",
        checked: !this.state.autonumber,
        onChange: this.autonumberChange
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "form-check-label",
        htmlFor: "autonumber_off"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, gettext('Manually number indicators'), ":"), "\xA0 ", gettext('If your donor requires a special numbering convention, you can enter a custom number for each indicator.'), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", {
        className: "text-danger"
      }, "\xA0 ", gettext('Manually entered numbers do not affect the order in which indicators are listed; they are purely for display purposes.'))))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group btn-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        disabled: !this.formDirty(),
        className: "btn btn-primary",
        type: "button",
        onClick: function onClick(e) {
          return _this2.save(e);
        }
      }, gettext("Save Changes")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-reset",
        type: "button",
        onClick: function onClick() {
          return _this2.resetForm();
        }
      }, gettext("Reset"))))));
    }
  }]);

  return ProgramSettings;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp)) || _class;



/***/ }),

/***/ "xQ6g":
/*!**********************************************************!*\
  !*** ./js/pages/tola_management_pages/program/models.js ***!
  \**********************************************************/
/*! exports provided: ProgramStore */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProgramStore", function() { return ProgramStore; });
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mobx */ "2vnA");
var _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, _temp;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object['ke' + 'ys'](descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object['define' + 'Property'](target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and set to use loose mode. ' + 'To use proposal-class-properties in spec mode with decorators, wait for ' + 'the next major version of decorators in stage 2.'); }


var ProgramStore = (_class = (_temp =
/*#__PURE__*/
function () {
  //filter options
  // UI state - track what history rows are expanded
  function ProgramStore(api, initialData) {
    _classCallCheck(this, ProgramStore);

    _initializerDefineProperty(this, "countries", _descriptor, this);

    _initializerDefineProperty(this, "allCountries", _descriptor2, this);

    _initializerDefineProperty(this, "organizations", _descriptor3, this);

    _initializerDefineProperty(this, "users", _descriptor4, this);

    _initializerDefineProperty(this, "sectors", _descriptor5, this);

    _initializerDefineProperty(this, "filters", _descriptor6, this);

    _initializerDefineProperty(this, "appliedFilters", _descriptor7, this);

    _initializerDefineProperty(this, "programFilterPrograms", _descriptor8, this);

    _initializerDefineProperty(this, "programs", _descriptor9, this);

    _initializerDefineProperty(this, "program_count", _descriptor10, this);

    _initializerDefineProperty(this, "new_program", _descriptor11, this);

    _initializerDefineProperty(this, "fetching_main_listing", _descriptor12, this);

    _initializerDefineProperty(this, "current_page", _descriptor13, this);

    _initializerDefineProperty(this, "total_pages", _descriptor14, this);

    _initializerDefineProperty(this, "bulk_targets", _descriptor15, this);

    _initializerDefineProperty(this, "bulk_targets_all", _descriptor16, this);

    _initializerDefineProperty(this, "editing_target", _descriptor17, this);

    _initializerDefineProperty(this, "editing_errors", _descriptor18, this);

    _initializerDefineProperty(this, "fetching_editing_history", _descriptor19, this);

    _initializerDefineProperty(this, "editing_history", _descriptor20, this);

    _initializerDefineProperty(this, "saving", _descriptor21, this);

    _initializerDefineProperty(this, "applying_bulk_updates", _descriptor22, this);

    _initializerDefineProperty(this, "active_editor_pane", _descriptor23, this);

    _initializerDefineProperty(this, "changelog_expanded_rows", _descriptor24, this);

    this.active_pane_is_dirty = false;
    this.api = api;
    Object.assign(this, initialData);
    this.appliedFilters = _objectSpread({}, this.filters);
    this.fetchPrograms();
  }

  _createClass(ProgramStore, [{
    key: "marshalFilters",
    value: function marshalFilters(filters) {
      return Object.entries(filters).reduce(function (xs, _ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            filterKey = _ref2[0],
            filterValue = _ref2[1];

        if (Array.isArray(filterValue)) {
          xs[filterKey] = filterValue.map(function (x) {
            return x.value;
          });
        } else if (filterValue) {
          xs[filterKey] = filterValue.value;
        }

        return xs;
      }, {});
    }
  }, {
    key: "dirtyConfirm",
    value: function dirtyConfirm() {
      return !this.active_pane_is_dirty || this.active_pane_is_dirty && confirm(gettext("You have unsaved changes. Are you sure you want to discard them?"));
    }
  }, {
    key: "onProfilePaneChange",
    value: function onProfilePaneChange(new_pane) {
      if (this.dirtyConfirm()) {
        this.active_editor_pane = new_pane;
        this.active_pane_is_dirty = false;
      }
    }
  }, {
    key: "setActiveFormIsDirty",
    value: function setActiveFormIsDirty(is_dirty) {
      this.active_pane_is_dirty = is_dirty;
    }
  }, {
    key: "setActivePaneSaveAction",
    value: function setActivePaneSaveAction(action) {
      this.active_pane_save = action;
    }
  }, {
    key: "fetchPrograms",
    value: function fetchPrograms() {
      var _this = this;

      if (this.dirtyConfirm()) {
        this.fetching_main_listing = true;
        this.api.fetchPrograms(this.current_page + 1, this.marshalFilters(this.appliedFilters)).then(function (results) {
          Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
            _this.fetching_main_listing = false;
            _this.programs = results.results;
            _this.program_count = results.total_results;
            _this.total_pages = results.total_pages;
            _this.next_page = results.next_page;
            _this.previous_page = results.previous_page;
            _this.active_editor_pane = 'profile';
            _this.active_pane_is_dirty = false;
          });
        });
        this.api.fetchProgramsForFilter(this.marshalFilters(this.appliedFilters)).then(function (response) {
          Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
            _this.programFilterPrograms = response.data;
          });
        });
      }
    }
  }, {
    key: "applyFilters",
    value: function applyFilters() {
      this.appliedFilters = _objectSpread({}, this.filters);
      this.current_page = 0;
      this.fetchPrograms();
    }
  }, {
    key: "changePage",
    value: function changePage(page) {
      if (page.selected == this.current_page) {
        return;
      }

      this.current_page = page.selected;
      this.bulk_targets = new Map();
      this.bulk_targets_all = false;
      this.fetchPrograms();
    }
  }, {
    key: "changeFilter",
    value: function changeFilter(filterKey, value) {
      this.filters = Object.assign(this.filters, _defineProperty({}, filterKey, value));
    }
  }, {
    key: "clearFilters",
    value: function clearFilters() {
      var clearFilters = {
        countries: [],
        organizations: [],
        sectors: [],
        programStatus: null,
        programs: [],
        users: []
      };
      this.filters = Object.assign(this.filters, clearFilters);
    }
  }, {
    key: "toggleEditingTarget",
    value: function toggleEditingTarget(id) {
      var _this2 = this;

      if (this.dirtyConfirm()) {
        if (this.editing_target == 'new') {
          this.programs.shift();
          this.editing_errors = {};
        }

        this.active_editor_pane = 'profile';

        if (this.editing_target == id) {
          this.editing_target = false;
          this.editing_errors = {};
        } else {
          this.editing_target = id;
          this.fetching_editing_history = true;
          this.api.fetchProgramHistory(id).then(function (resp) {
            Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
              _this2.fetching_editing_history = false;
              _this2.editing_history = resp.data;
            });
          });
        }
      }
    }
  }, {
    key: "updateLocalPrograms",
    value: function updateLocalPrograms(updated) {
      this.programs = this.programs.reduce(function (acc, current) {
        if (current.id == updated.id) {
          acc.push(updated);
        } else {
          acc.push(current);
        }

        return acc;
      }, []);
    }
  }, {
    key: "onSaveSuccessHandler",
    value: function onSaveSuccessHandler() {
      PNotify.success({
        text: gettext("Successfully saved"),
        delay: 5000
      });
    }
  }, {
    key: "onSaveErrorHandler",
    value: function onSaveErrorHandler() {
      PNotify.error({
        text: gettext("Saving failed"),
        delay: 5000
      });
    }
  }, {
    key: "onGAITDatesSyncSuccess",
    value: function onGAITDatesSyncSuccess() {
      // # Translators: Notify user that the program start and end date were successfully retrieved from the GAIT service and added to the newly saved Program
      PNotify.success({
        text: gettext("Successfully synced GAIT program start and end dates"),
        delay: 5000
      });
    }
  }, {
    key: "onGAITDatesSyncFailure",
    value: function onGAITDatesSyncFailure(reason, program_id) {
      var _this3 = this;

      PNotify.notice({
        // # Translators: Notify user that the program start and end date failed to be retrieved from the GAIT service with a specific reason appended after the :
        text: gettext("Failed to sync GAIT program start and end dates: " + reason),
        hide: false,
        modules: {
          Confirm: {
            confirm: true,
            buttons: [{
              // # Translators: A request failed, ask the user if they want to try the request again
              text: gettext('Retry'),
              primary: true,
              click: function click(notice) {
                _this3.syncGAITDates(program_id);

                notice.close();
              }
            }, {
              // # Translators: button label - ignore the current warning modal on display
              text: gettext('Ignore'),
              click: function click(notice) {
                notice.close();
              }
            }]
          }
        }
      });
    }
  }, {
    key: "createProgram",
    value: function createProgram() {
      if (this.dirtyConfirm()) {
        if (this.editing_target == 'new') {
          this.programs.shift();
        }

        this.active_editor_pane = 'profile';
        this.active_pane_is_dirty = false;
        var new_program_data = {
          id: "new",
          name: "",
          gaitid: "",
          fundcode: "",
          funding_status: "Funded",
          description: "",
          country: [],
          sector: []
        };
        this.programs.unshift(new_program_data);
        this.editing_target = 'new';
      }
    }
    /*
     * if there is no GAIT Id, resolve and move on,
     * if there is a GAIT ID, call to see if it is unique, and if not confirm that the user wants to enter a
     * duplicate GAIT ID for this program (displaying the link to view programs with the same ID in GAIT)
     */

  }, {
    key: "validateGaitId",
    value: function validateGaitId(program_data) {
      var _this4 = this;

      if (program_data.gaitid) {
        var id = program_data.id || 0;
        return new Promise(function (resolve, reject) {
          _this4.api.validateGaitId(program_data.gaitid, id).then(function (response) {
            if (response.data.unique === false) {
              var message_intro = gettext('The GAIT ID for this program is shared with at least one other program.');
              var link_text = gettext('View programs with this ID in GAIT.');
              var preamble_text = "".concat(message_intro, " <a href=\"").concat(response.data.gait_link, "\" target=\"_blank\">").concat(link_text, "</a>");
              window.create_no_rationale_changeset_notice({
                message_text: gettext('Are you sure you want to continue?'),
                on_submit: resolve,
                on_cancel: reject,
                preamble: preamble_text
              });
            } else {
              resolve();
            }
          }).catch(function (e) {
            return reject(e);
          });
        });
      } else {
        return new Promise(function (resolve, reject) {
          return resolve();
        });
      }
    }
    /*
     * Returns a promise that requests that GAIT start/end dates are synced to the
     * existing program with the given program id
     */

  }, {
    key: "syncGAITDates",
    value: function syncGAITDates(program_id) {
      var _this5 = this;

      // get GAIT dates into the program model on the server
      return this.api.syncGAITDates(program_id).then(function (gaitSyncResponse) {
        var gait_error = gaitSyncResponse.data.gait_error;

        if (!gait_error) {
          _this5.onGAITDatesSyncSuccess();
        } else {
          _this5.onGAITDatesSyncFailure(gait_error, program_id);
        }
      }).catch(function (error) {
        // # Translators: error message when trying to connect to the server
        _this5.onGAITDatesSyncFailure(gettext('There was a network or server connection error.'), program_id);

        return Promise.reject('Request error to sync GAIT dates');
      });
    }
  }, {
    key: "saveNewProgram",
    value: function saveNewProgram(program_data) {
      var _this6 = this;

      program_data.id = null;
      this.saving = true;
      this.validateGaitId(program_data).then(function () {
        // create program
        return _this6.api.createProgram(program_data).catch(function (error) {
          // form validation error handling
          if (error.response) {
            Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
              _this6.editing_errors = error.response.data;
            });
          } // propagate error to avoid trying to continue


          return Promise.reject('program creation failed');
        });
      }).then(function (response) {
        // now pull history data of newly created program
        return Promise.all([response, _this6.api.fetchProgramHistory(response.data.id)]);
      }).then(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
            response = _ref4[0],
            history = _ref4[1];

        // update the model
        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this6.editing_errors = {};
          _this6.editing_target = response.data.id;
          _this6.editing_target_data = response.data;
          _this6.editing_history = history.data;

          _this6.programs.shift();

          _this6.programs.unshift(response.data);

          _this6.programFilterPrograms.unshift(response.data);

          _this6.active_pane_is_dirty = false;

          _this6.onSaveSuccessHandler();
        });
        return response;
      }).then(function (response) {
        // don't try to sync gait dates without an id
        if (!response.data.gaitid) {
          return Promise.reject('No GAIT id on program');
        }

        return _this6.syncGAITDates(response.data.id);
      }).finally(function () {
        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this6.saving = false;
        });
      }).catch(function (error) {
        console.log('bottom level catch');
        console.log(error);
      });
    }
  }, {
    key: "updateProgram",
    value: function updateProgram(id, program_data) {
      var _this7 = this;

      this.saving = true;
      this.api.updateProgram(id, program_data).then(function (response) {
        return _this7.api.fetchProgramHistory(id).then(function (history) {
          return Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
            _this7.saving = false;
            _this7.editing_errors = {};
            _this7.active_pane_is_dirty = false;
            _this7.editing_target_data = program_data;

            _this7.updateLocalPrograms(response.data);

            _this7.editing_history = history.data;

            _this7.onSaveSuccessHandler();
          });
        });
      }).catch(function (errors) {
        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this7.saving = false;
          _this7.editing_errors = errors.response.data;

          _this7.onSaveErrorHandler();
        });
      });
    }
  }, {
    key: "toggleBulkTarget",
    value: function toggleBulkTarget(target_id) {
      this.bulk_targets.set(target_id, !this.bulk_targets.get(target_id));
    }
  }, {
    key: "toggleBulkTargetsAll",
    value: function toggleBulkTargetsAll() {
      var _this8 = this;

      this.bulk_targets_all = !this.bulk_targets_all;
      this.bulk_targets = new Map(this.programs.map(function (program) {
        return [program.id, _this8.bulk_targets_all];
      }));
    }
  }, {
    key: "postBulkUpdateLocalPrograms",
    value: function postBulkUpdateLocalPrograms(updatedPrograms) {
      var updatedProgramsById = new Map(updatedPrograms.map(function (program) {
        return [program.id, program];
      }));
      this.programs = this.programs.reduce(function (acc, current) {
        var updated = updatedProgramsById.get(current.id);

        if (updated) {
          acc.push(Object.assign(current, updated));
        } else {
          acc.push(current);
        }

        return acc;
      }, []);
    }
  }, {
    key: "bulkUpdateProgramStatus",
    value: function bulkUpdateProgramStatus(new_status) {
      var _this9 = this;

      var ids = Array.from(this.bulk_targets.entries()).filter(function (_ref5) {
        var _ref6 = _slicedToArray(_ref5, 2),
            id = _ref6[0],
            targeted = _ref6[1];

        return targeted;
      }).map(function (_ref7) {
        var _ref8 = _slicedToArray(_ref7, 2),
            id = _ref8[0],
            targeted = _ref8[1];

        return id;
      });

      if (ids.length && new_status) {
        this.applying_bulk_updates = true;
        this.api.updateProgramFundingStatusBulk(ids, new_status).then(function (response) {
          var updatedPrograms = response.data;
          Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
            _this9.postBulkUpdateLocalPrograms(updatedPrograms);

            _this9.applying_bulk_updates = false;

            _this9.onSaveSuccessHandler();
          });
        }).catch(function (error) {
          Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
            _this9.applying_bulk_updates = false;

            _this9.onSaveErrorHandler();
          });
        });
      }
    }
  }, {
    key: "toggleChangeLogRowExpando",
    value: function toggleChangeLogRowExpando(row_id) {
      if (this.changelog_expanded_rows.has(row_id)) {
        this.changelog_expanded_rows.delete(row_id);
      } else {
        this.changelog_expanded_rows.add(row_id);
      }
    }
  }]);

  return ProgramStore;
}(), _temp), (_descriptor = _applyDecoratedDescriptor(_class.prototype, "countries", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "allCountries", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, "organizations", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, "users", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class.prototype, "sectors", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class.prototype, "filters", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {
      countries: [],
      organizations: [],
      sectors: [],
      programStatus: null,
      programs: [],
      users: []
    };
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class.prototype, "appliedFilters", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class.prototype, "programFilterPrograms", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor9 = _applyDecoratedDescriptor(_class.prototype, "programs", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor10 = _applyDecoratedDescriptor(_class.prototype, "program_count", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0;
  }
}), _descriptor11 = _applyDecoratedDescriptor(_class.prototype, "new_program", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor12 = _applyDecoratedDescriptor(_class.prototype, "fetching_main_listing", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor13 = _applyDecoratedDescriptor(_class.prototype, "current_page", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0;
  }
}), _descriptor14 = _applyDecoratedDescriptor(_class.prototype, "total_pages", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor15 = _applyDecoratedDescriptor(_class.prototype, "bulk_targets", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new Map();
  }
}), _descriptor16 = _applyDecoratedDescriptor(_class.prototype, "bulk_targets_all", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor17 = _applyDecoratedDescriptor(_class.prototype, "editing_target", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor18 = _applyDecoratedDescriptor(_class.prototype, "editing_errors", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor19 = _applyDecoratedDescriptor(_class.prototype, "fetching_editing_history", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor20 = _applyDecoratedDescriptor(_class.prototype, "editing_history", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor21 = _applyDecoratedDescriptor(_class.prototype, "saving", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor22 = _applyDecoratedDescriptor(_class.prototype, "applying_bulk_updates", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor23 = _applyDecoratedDescriptor(_class.prototype, "active_editor_pane", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 'profile';
  }
}), _descriptor24 = _applyDecoratedDescriptor(_class.prototype, "changelog_expanded_rows", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new Set();
  }
}), _applyDecoratedDescriptor(_class.prototype, "onProfilePaneChange", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "onProfilePaneChange"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "fetchPrograms", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "fetchPrograms"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "applyFilters", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "applyFilters"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "changePage", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "changePage"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "changeFilter", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "changeFilter"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "clearFilters", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "clearFilters"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "toggleEditingTarget", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "toggleEditingTarget"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "createProgram", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "createProgram"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "saveNewProgram", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "saveNewProgram"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "updateProgram", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "updateProgram"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "toggleBulkTarget", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "toggleBulkTarget"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "toggleBulkTargetsAll", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "toggleBulkTargetsAll"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "bulkUpdateProgramStatus", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "bulkUpdateProgramStatus"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "toggleChangeLogRowExpando", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "toggleChangeLogRowExpando"), _class.prototype)), _class);

/***/ })

},[["1faY","runtime","vendors"]]]);
//# sourceMappingURL=tola_management_program-cb6d6bc0d7a4be37deb8.js.map