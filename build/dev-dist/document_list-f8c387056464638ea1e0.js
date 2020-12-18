(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["document_list"],{

/***/ "Hqim":
/*!******************************************!*\
  !*** ./js/pages/document_list/models.js ***!
  \******************************************/
/*! exports provided: DocumentListStore, DocumentListUIStore */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DocumentListStore", function() { return DocumentListStore; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DocumentListUIStore", function() { return DocumentListUIStore; });
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mobx */ "2vnA");
var _class, _descriptor, _descriptor2, _descriptor3, _temp, _class3, _descriptor4, _descriptor5, _descriptor6, _temp2;

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }


var DocumentListStore = (_class = (_temp = function DocumentListStore(documents, programs, allowProjectsAccess) {
  _classCallCheck(this, DocumentListStore);

  _initializerDefineProperty(this, "documents", _descriptor, this);

  _initializerDefineProperty(this, "programs", _descriptor2, this);

  _initializerDefineProperty(this, "allowProjectsAccess", _descriptor3, this);

  this.documents = documents;
  this.programs = programs;
  this.allowProjectsAccess = allowProjectsAccess;
}, _temp), (_descriptor = _applyDecoratedDescriptor(_class.prototype, "documents", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "programs", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, "allowProjectsAccess", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
})), _class);
var DocumentListUIStore = (_class3 = (_temp2 = /*#__PURE__*/function () {
  // program filter selection
  // single document filter selection
  // legacy URL filter for projects
  function DocumentListUIStore() {
    _classCallCheck(this, DocumentListUIStore);

    _initializerDefineProperty(this, "selectedProgramId", _descriptor4, this);

    _initializerDefineProperty(this, "selectedDocumentId", _descriptor5, this);

    _initializerDefineProperty(this, "selectedProjectId", _descriptor6, this);

    this.setSelectedProgramId = this.setSelectedProgramId.bind(this);
    this.clearSelectedProgramId = this.clearSelectedProgramId.bind(this);
    this.setSelectedDocumentId = this.setSelectedDocumentId.bind(this);
    this.clearSelectedDocumentId = this.clearSelectedDocumentId.bind(this);
    this.setSelectedProjectId = this.setSelectedProjectId.bind(this);
    this.clearSelectedProjectId = this.clearSelectedProjectId.bind(this);
  }

  _createClass(DocumentListUIStore, [{
    key: "setSelectedProgramId",
    value: function setSelectedProgramId(programId) {
      this.selectedProgramId = programId;
    }
  }, {
    key: "clearSelectedProgramId",
    value: function clearSelectedProgramId() {
      this.selectedProgramId = null;
    }
  }, {
    key: "setSelectedDocumentId",
    value: function setSelectedDocumentId(documentId) {
      this.selectedDocumentId = documentId;
    }
  }, {
    key: "clearSelectedDocumentId",
    value: function clearSelectedDocumentId() {
      this.selectedDocumentId = null;
    }
  }, {
    key: "setSelectedProjectId",
    value: function setSelectedProjectId(projectId) {
      this.selectedProjectId = projectId;
    }
  }, {
    key: "clearSelectedProjectId",
    value: function clearSelectedProjectId() {
      this.selectedProjectId = null;
    }
  }]);

  return DocumentListUIStore;
}(), _temp2), (_descriptor4 = _applyDecoratedDescriptor(_class3.prototype, "selectedProgramId", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor5 = _applyDecoratedDescriptor(_class3.prototype, "selectedDocumentId", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor6 = _applyDecoratedDescriptor(_class3.prototype, "selectedProjectId", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _applyDecoratedDescriptor(_class3.prototype, "setSelectedProgramId", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class3.prototype, "setSelectedProgramId"), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, "clearSelectedProgramId", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class3.prototype, "clearSelectedProgramId"), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, "setSelectedDocumentId", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class3.prototype, "setSelectedDocumentId"), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, "clearSelectedDocumentId", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class3.prototype, "clearSelectedDocumentId"), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, "setSelectedProjectId", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class3.prototype, "setSelectedProjectId"), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, "clearSelectedProjectId", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class3.prototype, "clearSelectedProjectId"), _class3.prototype)), _class3);

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

/***/ "QxHc":
/*!************************************************************!*\
  !*** ./js/pages/document_list/components/document_list.js ***!
  \************************************************************/
/*! exports provided: DocumentsView */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DocumentsView", function() { return DocumentsView; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "TSYQ");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var react_bootstrap_table_next__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-bootstrap-table-next */ "QL2g");
/* harmony import */ var react_bootstrap_table_next__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_bootstrap_table_next__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_bootstrap_table2_paginator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-bootstrap-table2-paginator */ "FoaG");
/* harmony import */ var react_bootstrap_table2_paginator__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_bootstrap_table2_paginator__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-select */ "Cs6D");
/* harmony import */ var _eventbus__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../eventbus */ "qtBC");
/* harmony import */ var _date_utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../date_utils */ "LBcr");
var _class, _class2, _class3;

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








 // Given the full documents list in rootStore, and the selected filters in uiStore, apply filtering (sans individual document select)

function filterDocuments(rootStore, uiStore) {
  var documents = rootStore.documents;

  if (uiStore.selectedProgramId) {
    documents = documents.filter(function (r) {
      return r.program === uiStore.selectedProgramId;
    });
  }

  if (uiStore.selectedProjectId) {
    documents = documents.filter(function (r) {
      return r.project && r.project.id === uiStore.selectedProjectId;
    });
  }

  return documents;
}

var ProgramFilterSelect = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class = /*#__PURE__*/function (_React$Component) {
  _inherits(ProgramFilterSelect, _React$Component);

  var _super = _createSuper(ProgramFilterSelect);

  function ProgramFilterSelect(props) {
    var _this;

    _classCallCheck(this, ProgramFilterSelect);

    _this = _super.call(this, props);
    _this.onSelection = _this.onSelection.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(ProgramFilterSelect, [{
    key: "onSelection",
    value: function onSelection(selectedObject) {
      var programId = selectedObject ? selectedObject.value : null;
      _eventbus__WEBPACK_IMPORTED_MODULE_6__["default"].emit('program-id-filter-selected', programId);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          rootStore = _this$props.rootStore,
          uiStore = _this$props.uiStore;
      var programs = rootStore.programs;
      var selectedProgramId = uiStore.selectedProgramId;
      var programOptions = programs.map(function (p) {
        return {
          value: p.id,
          label: p.name
        };
      });
      var selectedValue = null;

      if (selectedProgramId) {
        selectedValue = programOptions.find(function (p) {
          return p.value === selectedProgramId;
        });
      }

      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_5__["default"], {
        options: programOptions,
        value: selectedValue,
        isClearable: true,
        placeholder: gettext('Filter by program'),
        onChange: this.onSelection
      });
    }
  }]);

  return ProgramFilterSelect;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component)) || _class;

var DocumentFilterSelect = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class2 = /*#__PURE__*/function (_React$Component2) {
  _inherits(DocumentFilterSelect, _React$Component2);

  var _super2 = _createSuper(DocumentFilterSelect);

  function DocumentFilterSelect(props) {
    var _this2;

    _classCallCheck(this, DocumentFilterSelect);

    _this2 = _super2.call(this, props);
    _this2.onSelection = _this2.onSelection.bind(_assertThisInitialized(_this2));
    return _this2;
  }

  _createClass(DocumentFilterSelect, [{
    key: "onSelection",
    value: function onSelection(selectedObject) {
      var documentId = selectedObject ? selectedObject.value : null;
      _eventbus__WEBPACK_IMPORTED_MODULE_6__["default"].emit('document-id-filter-selected', documentId);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          rootStore = _this$props2.rootStore,
          uiStore = _this$props2.uiStore;
      var documents = filterDocuments(rootStore, uiStore);
      var selectedDocumentId = uiStore.selectedDocumentId;
      var documentOptions = documents.map(function (r) {
        return {
          value: r.id,
          label: r.name
        };
      });
      var selectedValue = null;

      if (selectedDocumentId) {
        selectedValue = documentOptions.find(function (r) {
          return r.value === selectedDocumentId;
        });
      }

      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_5__["default"], {
        options: documentOptions,
        value: selectedValue,
        isClearable: true,
        placeholder: gettext('Find a document'),
        onChange: this.onSelection
      });
    }
  }]);

  return DocumentFilterSelect;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component)) || _class2;

var DocumentsFilterBar = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class3 = /*#__PURE__*/function (_React$Component3) {
  _inherits(DocumentsFilterBar, _React$Component3);

  var _super3 = _createSuper(DocumentsFilterBar);

  function DocumentsFilterBar() {
    _classCallCheck(this, DocumentsFilterBar);

    return _super3.apply(this, arguments);
  }

  _createClass(DocumentsFilterBar, [{
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          rootStore = _this$props3.rootStore,
          uiStore = _this$props3.uiStore,
          readonly = _this$props3.readonly;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "row"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "col-3"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ProgramFilterSelect, {
        rootStore: rootStore,
        uiStore: uiStore
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "col-3"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(DocumentFilterSelect, {
        rootStore: rootStore,
        uiStore: uiStore
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "col-3 text-right"
      }, !readonly && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "/workflow/documentation_add",
        className: "btn btn-link btn-add"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-plus-circle"
      }), " ", gettext("Add document"))));
    }
  }]);

  return DocumentsFilterBar;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component)) || _class3;

var DocumentsListTable = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(function (_ref) {
  var rootStore = _ref.rootStore,
      uiStore = _ref.uiStore,
      access = _ref.access;
  // Apply filters to displayed list of documents
  var documents = filterDocuments(rootStore, uiStore); // filter down by individual document select

  if (uiStore.selectedDocumentId) {
    documents = documents.filter(function (r) {
      return r.id === uiStore.selectedDocumentId;
    });
  } // If no documents, don't show a table


  if (documents.length === 0) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, "No documents available"));
  }

  var columns = [{
    dataField: 'name',
    text: gettext('Document'),
    sort: true,
    formatter: function formatter(cell, row) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: row.url,
        target: "_blank"
      }, row.name);
    }
  }, {
    dataField: 'create_date',
    text: gettext('Date added'),
    sort: true,
    formatter: function formatter(cell, row) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, Object(_date_utils__WEBPACK_IMPORTED_MODULE_7__["mediumDateFormatStr"])(Object(_date_utils__WEBPACK_IMPORTED_MODULE_7__["dateFromISOString"])(row.create_date)));
    }
  }, {
    dataField: 'project.project_name',
    text: gettext('Project'),
    hidden: !rootStore.allowProjectsAccess
  }, {
    dataField: 'actions',
    isDummyField: true,
    text: '',
    align: 'right',
    formatter: function formatter(cell, row) {
      if (access[row.program] && (access[row.program].role == 'high' || access[row.program].role == 'medium')) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          className: "text-nowrap"
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
          href: "/workflow/documentation_delete/" + row.id,
          className: "btn p-0 pr-4 btn-sm btn-text text-danger"
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "fas fa-trash-alt"
        }), "\xA0", gettext("Delete")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
          href: "/workflow/documentation_update/" + row.id,
          className: "btn p-0 btn-sm btn-text"
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "fas fa-edit"
        }), "\xA0", gettext("Edit")));
      } else {
        return null;
      }
    }
  }];
  var defaultSorted = [{
    dataField: 'create_date',
    order: 'desc'
  }];
  var paginationOptions = {
    prePageText: '‹',
    nextPageText: '›',
    firstPageText: '«',
    lastPageText: '»',
    sizePerPage: 50,
    // page: 2,
    showTotal: true,
    paginationTotalRenderer: function paginationTotalRenderer(from, to, size) {
      /* # Translators: Ex. Showing rows 1 to 50 of 92 */
      var str = interpolate(gettext('Showing rows %(fromCount)s to %(toCount)s of %(totalCount)s'), {
        fromCount: from,
        toCount: to,
        totalCount: size
      }, true);
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "metadata__count text-muted text-small"
      }, "\xA0", str);
    }
  };
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap_table_next__WEBPACK_IMPORTED_MODULE_3___default.a, {
    keyField: "id",
    data: documents,
    columns: columns,
    bootstrap4: true,
    pagination: react_bootstrap_table2_paginator__WEBPACK_IMPORTED_MODULE_4___default()(paginationOptions),
    defaultSorted: defaultSorted
  });
});
var DocumentsView = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(function (_ref2) {
  var rootStore = _ref2.rootStore,
      uiStore = _ref2.uiStore,
      readonly = _ref2.readonly,
      access = _ref2.access;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(DocumentsFilterBar, {
    rootStore: rootStore,
    uiStore: uiStore,
    readonly: readonly
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("br", null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(DocumentsListTable, {
    rootStore: rootStore,
    uiStore: uiStore,
    access: access
  }));
});

/***/ }),

/***/ "Wr7D":
/*!*****************************************!*\
  !*** ./js/pages/document_list/index.js ***!
  \*****************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "i8i4");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var router5__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! router5 */ "wgi2");
/* harmony import */ var router5_plugin_browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! router5-plugin-browser */ "0pHI");
/* harmony import */ var _eventbus__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../eventbus */ "qtBC");
/* harmony import */ var _components_document_list__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/document_list */ "QxHc");
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./models */ "Hqim");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }







 // console.log(jsContext);

var _jsContext = jsContext,
    documents = _jsContext.documents,
    programs = _jsContext.programs,
    allowProjectsAccess = _jsContext.allowProjectsAccess,
    readonly = _jsContext.readonly,
    access = _jsContext.access;
/*
 * Model/Store setup
 */

var rootStore = new _models__WEBPACK_IMPORTED_MODULE_6__["DocumentListStore"](documents, programs, allowProjectsAccess);
var uiStore = new _models__WEBPACK_IMPORTED_MODULE_6__["DocumentListUIStore"]();
/*
 * Routing
 */

var routes = [{
  name: 'documents',
  path: '/?program_id&project_id&document_id'
}]; // When the URL changes due to navigation, back button press, etc

function onNavigation(navRoutes) {
  var previousRoute = navRoutes.previousRoute,
      route = navRoutes.route;
  var params = route.params;

  if (params.program_id) {
    uiStore.setSelectedProgramId(parseInt(params.program_id));
  } else {
    uiStore.clearSelectedProgramId();
  }

  if (params.document_id) {
    uiStore.setSelectedDocumentId(parseInt(params.document_id));
  } else {
    uiStore.clearSelectedDocumentId();
  }

  if (params.project_id) {
    uiStore.setSelectedProjectId(parseInt(params.project_id));
  } else {
    uiStore.clearSelectedProjectId();
  }
}

var router = Object(router5__WEBPACK_IMPORTED_MODULE_2__["default"])(routes, {
  defaultRoute: 'all',
  // used if route not found
  defaultParams: {}
});
router.usePlugin(Object(router5_plugin_browser__WEBPACK_IMPORTED_MODULE_3__["default"])({
  useHash: false,
  base: '/workflow/documentation_list'
}));
router.subscribe(onNavigation);
router.start();
/*
 * Event Handlers
 */
// program filter selection

_eventbus__WEBPACK_IMPORTED_MODULE_4__["default"].on('program-id-filter-selected', function (programId) {
  if (programId) {
    router.navigate('documents', {
      program_id: programId
    });
  } else {
    router.navigate('documents');
  }
});
_eventbus__WEBPACK_IMPORTED_MODULE_4__["default"].on('document-id-filter-selected', function (documentId) {
  var programId = uiStore.selectedProgramId;
  var qs = {};

  if (programId) {
    qs.program_id = programId;
  }

  if (documentId) {
    qs.document_id = documentId;
  }

  router.navigate('documents', qs);
});
/*
 * React components on page
 */

var mapped_program_access = access.programs.reduce(function (programs, program) {
  return _objectSpread(_objectSpread({}, programs), {}, _defineProperty({}, program.program, program));
}, {});
react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_document_list__WEBPACK_IMPORTED_MODULE_5__["DocumentsView"], {
  rootStore: rootStore,
  uiStore: uiStore,
  readonly: readonly,
  access: mapped_program_access
}), document.querySelector('#documents-view'));

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

/***/ })

},[["Wr7D","runtime","vendors"]]]);
//# sourceMappingURL=document_list-f8c387056464638ea1e0.js.map