(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["audit_log"],{

/***/ "49gj":
/*!***********************************************************!*\
  !*** ./js/pages/tola_management_pages/audit_log/views.js ***!
  \***********************************************************/
/*! exports provided: IndexView */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IndexView", function() { return IndexView; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var components_pagination__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! components/pagination */ "RCjz");
/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ "IP2g");
/* harmony import */ var components_loading_spinner__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! components/loading-spinner */ "DDFe");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }







var ResultChangeset = function ResultChangeset(_ref) {
  var data = _ref.data,
      name = _ref.name,
      pretty_name = _ref.pretty_name;

  if (name == 'evidence_url') {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "change__field"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, pretty_name), ": ", data != 'N/A' && data !== '' ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
      href: data,
      target: "_blank"
    }, "Link") : data);
  } else if (name === 'disaggregation_values') {
    if (Object.entries(data).length) {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "changelog__change__targets"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h4", {
        className: "text-small"
      }, gettext('Disaggregated values changed')), Object.entries(data).map(function (_ref2) {
        var _ref3 = _slicedToArray(_ref2, 2),
            id = _ref3[0],
            dv = _ref3[1];

        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          className: "change__field",
          key: id
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, dv.name, ":"), " ", dv.value);
      }));
    } else {
      return null;
    }
  } else {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "change__field"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, pretty_name), ": ", data);
  }
};

var ProgramDatesChangeset = function ProgramDatesChangeset(_ref4) {
  var data = _ref4.data,
      name = _ref4.name,
      pretty_name = _ref4.pretty_name;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, pretty_name, ": ", data);
};

var IndicatorChangeset = function IndicatorChangeset(_ref5) {
  var data = _ref5.data,
      name = _ref5.name,
      pretty_name = _ref5.pretty_name;

  if (name == 'targets') {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "changelog__change__targets"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h4", {
      className: "text-small"
    }, gettext('Targets changed')), Object.entries(data).map(function (_ref6) {
      var _ref7 = _slicedToArray(_ref6, 2),
          id = _ref7[0],
          target = _ref7[1];

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "change__field",
        key: id
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, target.name, ":"), " ", target.value);
    }));
  } else {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "change__field"
    }, name !== 'name' ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, pretty_name, ": ") : '', data !== null && data !== undefined ? data.toString() : gettext('N/A'));
  }
};

var ResultLevelChangeset = function ResultLevelChangeset(_ref8) {
  var data = _ref8.data,
      name = _ref8.name,
      pretty_name = _ref8.pretty_name;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "change__field"
  }, name !== 'name' ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, pretty_name, ": ") : '', data !== null && data !== undefined ? data.toString() : gettext('N/A'));
};

var ChangesetEntry =
/*#__PURE__*/
function (_React$Component) {
  _inherits(ChangesetEntry, _React$Component);

  function ChangesetEntry() {
    _classCallCheck(this, ChangesetEntry);

    return _possibleConstructorReturn(this, _getPrototypeOf(ChangesetEntry).apply(this, arguments));
  }

  _createClass(ChangesetEntry, [{
    key: "renderType",
    value: function renderType(type, data, name, pretty_name) {
      switch (type) {
        case 'indicator_changed':
        case 'indicator_created':
        case 'indicator_deleted':
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorChangeset, {
            data: data,
            name: name,
            pretty_name: pretty_name
          });
          break;

        case 'result_changed':
        case 'result_created':
        case 'result_deleted':
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ResultChangeset, {
            data: data,
            name: name,
            pretty_name: pretty_name
          });
          break;

        case 'program_dates_changed':
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ProgramDatesChangeset, {
            data: data,
            name: name,
            pretty_name: pretty_name
          });
          break;

        case 'level_changed':
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ResultLevelChangeset, {
            data: data,
            name: name,
            pretty_name: pretty_name
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
          pretty_name = _this$props.pretty_name;
      return this.renderType(type, data, name, pretty_name);
    }
  }]);

  return ChangesetEntry;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

var ExpandAllButton = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref9) {
  var store = _ref9.store;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
    className: "btn btn-medium text-action btn-sm",
    onClick: function onClick() {
      return store.expandAllExpandos();
    },
    disabled: store.log_rows.length === store.expando_rows.size
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
    className: "fas fa-plus-square"
  }), gettext('Expand all'));
});
var CollapseAllButton = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref10) {
  var store = _ref10.store;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
    className: "btn btn-medium text-action btn-sm",
    onClick: function onClick() {
      return store.collapsAllExpandos();
    },
    disabled: store.expando_rows.size === 0
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
    className: "fas fa-minus-square"
  }), gettext('Collapse all'));
});

var IndicatorNameSpan = function IndicatorNameSpan(_ref11) {
  var indicator = _ref11.indicator;

  if (!indicator) {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, gettext('N/A'));
  }

  if (indicator.results_aware_number) {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, gettext('Indicator'), " ", indicator.results_aware_number, ":"), " ", indicator.name);
  } else {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, gettext('Indicator'), ":"), " ", indicator.name);
  }
};

var ResultLevel = function ResultLevel(_ref12) {
  var indicator = _ref12.indicator,
      level = _ref12.level;

  if (indicator) {
    if (indicator.leveltier_name && indicator.level_display_ontology) return "".concat(indicator.leveltier_name, " ").concat(indicator.level_display_ontology);else if (indicator.leveltier_name) return indicator.leveltier_name;
  }

  if (level) {
    return "".concat(level.name, " ").concat(level.display_ontology);
  }

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, gettext('N/A'));
};

var IndexView = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref13) {
  var store = _ref13.store;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    id: "audit-log-index-view"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("header", {
    className: "page-title"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h1", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("small", null, gettext("Indicator change log:")), " ", store.program_name)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "admin-list__controls"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "controls__bulk-actions"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "btn-group"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ExpandAllButton, {
    store: store
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(CollapseAllButton, {
    store: store
  }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "controls__buttons"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
    className: "btn btn-secondary btn-sm",
    href: "/api/tola_management/program/".concat(store.program_id, "/export_audit_log")
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
    className: "fas fa-download"
  }), gettext("Excel")))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "admin-list__table"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_loading_spinner__WEBPACK_IMPORTED_MODULE_4__["default"], {
    isLoading: store.fetching
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("table", {
    className: "table table-sm table-bordered bg-white text-small changelog"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("thead", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    className: "text-nowrap"
  }, gettext("Date and time")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    className: "text-nowrap"
  }, gettext("Result Level")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    className: "text-nowrap"
  }, gettext("Indicator")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    className: "text-nowrap"
  }, gettext("User")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    className: "text-nowrap"
  }, gettext("Organization")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    className: "text-nowrap"
  }, gettext("Change type")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    className: "text-nowrap"
  }, gettext("Previous entry")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    className: "text-nowrap"
  }, gettext("New entry")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    className: "text-nowrap"
  }, gettext("Reason for change")))), store.log_rows.map(function (data) {
    var is_expanded = store.expando_rows.has(data.id);
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tbody", {
      key: data.id
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
      className: is_expanded ? 'changelog__entry__header is-expanded' : 'changelog__entry__header',
      onClick: function onClick() {
        return store.toggleRowExpando(data.id);
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
      className: "text-action"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_3__["FontAwesomeIcon"], {
      icon: is_expanded ? 'caret-down' : 'caret-right'
    }), "\xA0", data.date), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ResultLevel, {
      indicator: data.indicator,
      level: data.level
    })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IndicatorNameSpan, {
      indicator: data.indicator
    })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, data.user), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, data.organization), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
      className: "text-nowrap"
    }, data.pretty_change_type), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null)), is_expanded && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
      className: "changelog__entry__row",
      key: data.id
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
      className: "changelog__change--prev"
    }, data.diff_list.map(function (changeset) {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangesetEntry, {
        key: changeset.name,
        name: changeset.name,
        pretty_name: changeset.pretty_name,
        type: data.change_type,
        data: changeset.prev
      });
    })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
      className: "changelog__change--new"
    }, data.diff_list.map(function (changeset) {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangesetEntry, {
        key: changeset.name,
        name: changeset.name,
        pretty_name: changeset.pretty_name,
        type: data.change_type,
        data: changeset.new
      });
    })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
      className: "changelog__change--rationale"
    }, data.rationale)));
  }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "admin-list__metadata"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "metadata__count text-muted text-small"
  }, store.entries_count ? "".concat(store.entries_count, " ").concat(gettext("entries")) : "--"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "metadata__controls"
  }, store.total_pages && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_pagination__WEBPACK_IMPORTED_MODULE_2__["default"], {
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
react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_views__WEBPACK_IMPORTED_MODULE_3__["IndexView"], {
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

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object['ke' + 'ys'](descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object['define' + 'Property'](target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and set to use loose mode. ' + 'To use proposal-class-properties in spec mode with decorators, wait for ' + 'the next major version of decorators in stage 2.'); }



var ProgramAuditLogStore = (_class = (_temp =
/*#__PURE__*/
function () {
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
        this.expando_rows.delete(row_id);
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
    key: "collapsAllExpandos",
    value: function collapsAllExpandos() {
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
}), _applyDecoratedDescriptor(_class.prototype, "fetchProgramAuditLog", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "fetchProgramAuditLog"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "changePage", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "changePage"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "toggleRowExpando", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "toggleRowExpando"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "expandAllExpandos", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "expandAllExpandos"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "collapsAllExpandos", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "collapsAllExpandos"), _class.prototype)), _class);

/***/ })

},[["6bbB","runtime","vendors"]]]);
//# sourceMappingURL=audit_log-7c654dccdd4a6ccd0ba2.js.map