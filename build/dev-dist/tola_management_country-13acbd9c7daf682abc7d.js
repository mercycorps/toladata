(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["tola_management_country"],{

/***/ "/UUj":
/*!*********************************************************!*\
  !*** ./js/pages/tola_management_pages/country/views.js ***!
  \*********************************************************/
/*! exports provided: IndexView */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IndexView", function() { return IndexView; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var components_checkboxed_multi_select__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! components/checkboxed-multi-select */ "Z2Y6");
/* harmony import */ var components_management_table__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! components/management-table */ "TGVD");
/* harmony import */ var components_pagination__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! components/pagination */ "RCjz");
/* harmony import */ var _components_country_editor__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/country_editor */ "micH");
/* harmony import */ var _components_edit_country_profile__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/edit_country_profile */ "1//Y");
/* harmony import */ var _components_edit_disaggregations__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/edit_disaggregations */ "hLpu");
/* harmony import */ var _components_edit_objectives__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/edit_objectives */ "5G0W");
/* harmony import */ var components_loading_spinner__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! components/loading-spinner */ "DDFe");
/* harmony import */ var components_folding_sidebar__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! components/folding-sidebar */ "tnXs");
/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ "IP2g");
/* harmony import */ var _components_country_history__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./components/country_history */ "9flW");
/* harmony import */ var _general_utilities__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../general_utilities */ "WtQ/");
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }















var CountryFilter = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref) {
  var store = _ref.store,
      filterOptions = _ref.filterOptions;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "form-group react-multiselect-checkbox"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    htmlFor: "countries_filter"
  }, gettext("Find a Country")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_checkboxed_multi_select__WEBPACK_IMPORTED_MODULE_2__["default"], {
    value: store.filters.countries,
    options: filterOptions,
    onChange: function onChange(e) {
      return store.changeFilter('countries', e);
    },
    placeholder: gettext("None Selected"),
    id: "countries_filter"
  }));
});
var OrganizationFilter = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref2) {
  var store = _ref2.store,
      filterOptions = _ref2.filterOptions;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "form-group react-multiselect-checkbox"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    htmlFor: "organizations_filter"
  }, gettext("Organizations")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_checkboxed_multi_select__WEBPACK_IMPORTED_MODULE_2__["default"], {
    value: store.filters.organizations,
    options: filterOptions,
    onChange: function onChange(e) {
      return store.changeFilter('organizations', e);
    },
    placeholder: gettext("None Selected"),
    id: "organizations_filter"
  }));
});
var ProgramFilter = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref3) {
  var store = _ref3.store,
      filterOptions = _ref3.filterOptions;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "form-group react-multiselect-checkbox"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    htmlFor: "programs-filter"
  }, gettext("Programs")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_checkboxed_multi_select__WEBPACK_IMPORTED_MODULE_2__["default"], {
    value: store.filters.programs,
    options: filterOptions,
    onChange: function onChange(e) {
      return store.changeFilter('programs', e);
    },
    placeholder: gettext("None Selected"),
    id: "programs-filter"
  }));
});
var IndexView = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref4) {
  var store = _ref4.store;
  var countryFilterOptions = Object(_general_utilities__WEBPACK_IMPORTED_MODULE_13__["sortObjectListByValue"])(store.allCountries.map(function (country) {
    return {
      value: country.id,
      label: country.country
    };
  }));
  var organizationFilterOptions = Object(_general_utilities__WEBPACK_IMPORTED_MODULE_13__["sortObjectListByValue"])(Object.entries(store.organizations).map(function (_ref5) {
    var _ref6 = _slicedToArray(_ref5, 2),
        id = _ref6[0],
        org = _ref6[1];

    return {
      value: org.id,
      label: org.name
    };
  }));
  var programFilterOptions = Object(_general_utilities__WEBPACK_IMPORTED_MODULE_13__["sortObjectListByValue"])(Object.entries(store.allPrograms).map(function (_ref7) {
    var _ref8 = _slicedToArray(_ref7, 2),
        id = _ref8[0],
        program = _ref8[1];

    return {
      value: program.id,
      label: program.name
    };
  }));
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    id: "country-management-index-view",
    className: "row"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_folding_sidebar__WEBPACK_IMPORTED_MODULE_10__["default"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "filter-section"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(OrganizationFilter, {
    store: store,
    filterOptions: organizationFilterOptions
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ProgramFilter, {
    store: store,
    filterOptions: programFilterOptions
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "filter-section filter-buttons"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
    className: "btn btn-primary",
    onClick: function onClick() {
      return store.applyFilters();
    }
  }, gettext("Apply")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
    className: "btn btn-reset",
    onClick: function onClick() {
      return store.clearFilters();
    }
  }, gettext("Reset")))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "col admin-list"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("header", {
    className: "page-title"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h1", null, gettext("Admin:"), " ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("small", null, gettext("Countries")))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "admin-list__controls"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "controls__top-filter"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(CountryFilter, {
    store: store,
    filterOptions: countryFilterOptions
  })), store.is_superuser && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "controls__buttons"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
    href: "#",
    tabIndex: "0",
    className: "btn btn-link btn-add",
    onClick: function onClick() {
      return store.addCountry();
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
    className: "fas fa-plus-circle"
  }), gettext("Add Country")))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_loading_spinner__WEBPACK_IMPORTED_MODULE_9__["default"], {
    isLoading: store.fetching_main_listing || store.applying_bulk_updates
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "admin-list__table"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_management_table__WEBPACK_IMPORTED_MODULE_3__["default"], {
    newData: store.new_country,
    data: store.countries,
    keyField: "id",
    HeaderRow: function HeaderRow(_ref9) {
      var Col = _ref9.Col,
          Row = _ref9.Row;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Row, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, {
        size: "1"
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, {
        size: "60"
      }, gettext("Country")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, null, gettext("Organizations")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, null, gettext("Programs")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, null, gettext("Users")));
    },
    Row: function Row(_ref10) {
      var Col = _ref10.Col,
          Row = _ref10.Row,
          data = _ref10.data;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Row, {
        expanded: data.id == store.editing_target,
        Expando: Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref11) {
          var Wrapper = _ref11.Wrapper;
          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Wrapper, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_country_editor__WEBPACK_IMPORTED_MODULE_5__["default"], {
            notifyPaneChange: function notifyPaneChange(new_pane) {
              return store.onProfilePaneChange(new_pane);
            },
            active_pane: store.active_editor_pane,
            "new": data.id == 'new',
            ProfileSection: Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function () {
              return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_loading_spinner__WEBPACK_IMPORTED_MODULE_9__["default"], {
                isLoading: store.fetching_editing_data || store.saving || store.fetching_editing_history
              }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_edit_country_profile__WEBPACK_IMPORTED_MODULE_6__["default"], {
                "new": data.id == 'new',
                country_data: data,
                organizationOptions: organizationFilterOptions,
                onUpdate: function onUpdate(id, data) {
                  return store.updateCountry(id, data);
                },
                onCreate: function onCreate(new_country_data) {
                  return store.saveNewCountry(new_country_data);
                },
                errors: store.editing_errors,
                onIsDirtyChange: function onIsDirtyChange(is_dirty) {
                  return store.setActiveFormIsDirty(is_dirty);
                }
              }));
            }),
            StrategicObjectiveSection: Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function () {
              return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_loading_spinner__WEBPACK_IMPORTED_MODULE_9__["default"], {
                isLoading: store.fetching_editing_data || store.saving || store.fetching_editing_history
              }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_edit_objectives__WEBPACK_IMPORTED_MODULE_8__["default"], {
                country_id: data.id,
                objectives: store.editing_objectives_data,
                addObjective: function addObjective() {
                  return store.addObjective();
                },
                onUpdate: function onUpdate(id, data) {
                  return store.updateObjective(id, data);
                },
                onCreate: function onCreate(data) {
                  return store.createObjective(data);
                },
                onDelete: function onDelete(id) {
                  return store.deleteObjective(id);
                },
                errors: store.editing_objectives_errors,
                clearErrors: function clearErrors() {
                  return store.clearObjectiveEditingErrors();
                },
                onIsDirtyChange: function onIsDirtyChange(is_dirty) {
                  return store.setActiveFormIsDirty(is_dirty);
                }
              }));
            }),
            DisaggregationSection: Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function () {
              return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_loading_spinner__WEBPACK_IMPORTED_MODULE_9__["default"], {
                isLoading: store.fetching_editing_data || store.saving || store.fetching_editing_history
              }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_edit_disaggregations__WEBPACK_IMPORTED_MODULE_7__["default"], {
                country_id: data.id,
                countryName: data.country,
                programs: store.getCountryPrograms(data.id),
                disaggregations: store.editing_disaggregations_data,
                addDisaggregation: function addDisaggregation() {
                  return store.addDisaggregation();
                },
                assignLabelErrors: store.assignDisaggregationLabelErrors,
                onDelete: store.deleteDisaggregation.bind(store),
                onArchive: function onArchive(id) {
                  return store.archiveDisaggregation(id);
                },
                onUnarchive: function onUnarchive(id) {
                  return store.unarchiveDisaggregation(id);
                },
                onUpdate: function onUpdate(id, data) {
                  return store.updateDisaggregation(id, data);
                },
                onCreate: function onCreate(data) {
                  return store.createDisaggregation(data);
                },
                errors: store.editing_disaggregations_errors,
                clearErrors: function clearErrors() {
                  return store.clearDisaggregationEditingErrors();
                },
                onIsDirtyChange: function onIsDirtyChange(is_dirty) {
                  return store.setActiveFormIsDirty(is_dirty);
                }
              }));
            }),
            HistorySection: Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function () {
              return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_loading_spinner__WEBPACK_IMPORTED_MODULE_9__["default"], {
                isLoading: store.fetching_editing_data || store.saving || store.fetching_editing_history
              }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_country_history__WEBPACK_IMPORTED_MODULE_12__["default"], {
                store: store,
                history: store.editing_history
              }));
            }),
            fetchObjectives: function fetchObjectives(countryId) {
              return store.fetchObjectives(countryId);
            }
          }));
        })
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, {
        size: "0.2"
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, {
        size: "2",
        className: "td--stretch"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "expando-toggle icon__clickable",
        onClick: function onClick() {
          return store.toggleEditingTarget(data.id);
        }
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "expando-toggle__icon"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_11__["FontAwesomeIcon"], {
        icon: store.editing_target == data.id ? 'caret-down' : 'caret-right'
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "expando-toggle__label"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-globe"
      }), "\xA0", data.country || "---"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, {
        className: "text-nowrap"
      }, data.organizations_count ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "/tola_management/organization/?countries[]=".concat(data.id)
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-building"
      }), "\xA0", // # Translators: preceded by a number, i.e. "3 organizations" or "1 organization"
      interpolate(ngettext("%s organization", "%s organizations", data.organizations_count), [data.organizations_count])) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-building"
      }), "\xA0", // # Translators: when no organizations are connected to the item
      gettext("0 organizations"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, {
        className: "text-nowrap"
      }, data.programs_count ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "/tola_management/program/?countries[]=".concat(data.id)
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-cubes"
      }), "\xA0", // # Translators: preceded by a number, i.e. "3 programs" or "1 program"
      interpolate(ngettext("%s program", "%s programs", data.programs_count), [data.programs_count])) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-cubes"
      }), "\xA0", // # Translators: when no programs are connected to the item
      gettext("0 programs"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, {
        className: "text-nowrap"
      }, data.users_count ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "/tola_management/user/?countries[]=".concat(data.id)
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-users"
      }), "\xA0", // # Translators: preceded by a number, i.e. "3 users" or "1 user"
      interpolate(ngettext("%s user", "%s users", data.users_count), [data.users_count])) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-users"
      }), "\xA0", // # Translators: when no users are connected to the item
      gettext("0 users"))));
    }
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "admin-list__metadata"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "metadata__count text-muted text-small"
  }, store.country_count ? "".concat(store.country_count, " ").concat(gettext("countries")) : "---"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "metadata__controls"
  }, store.total_pages && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_pagination__WEBPACK_IMPORTED_MODULE_4__["default"], {
    pageCount: store.total_pages,
    initialPage: store.current_page,
    onPageChange: function onPageChange(page) {
      return store.changePage(page);
    }
  })))));
});

/***/ }),

/***/ "1//Y":
/*!***********************************************************************************!*\
  !*** ./js/pages/tola_management_pages/country/components/edit_country_profile.js ***!
  \***********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return EditCountryProfile; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-select */ "Cs6D");
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! classnames */ "TSYQ");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_3__);
var _class;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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





var ErrorFeedback = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(function (_ref) {
  var errorMessages = _ref.errorMessages;

  if (!errorMessages) {
    return null;
  }

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "invalid-feedback"
  }, errorMessages.map(function (message, index) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      key: index
    }, message);
  }));
});

var EditCountryProfile = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class = /*#__PURE__*/function (_React$Component) {
  _inherits(EditCountryProfile, _React$Component);

  var _super = _createSuper(EditCountryProfile);

  function EditCountryProfile(props) {
    var _this;

    _classCallCheck(this, EditCountryProfile);

    _this = _super.call(this, props);
    var country_data = props.country_data;
    _this.state = {
      original_data: Object.assign({}, country_data),
      managed_data: Object.assign({}, country_data)
    };
    return _this;
  }

  _createClass(EditCountryProfile, [{
    key: "hasUnsavedDataAction",
    value: function hasUnsavedDataAction() {
      this.props.onIsDirtyChange(JSON.stringify(this.state.managed_data) != JSON.stringify(this.state.original_data));
    }
  }, {
    key: "save",
    value: function save() {
      var country_id = this.props.country_data.id;
      var country_data = this.state.managed_data;
      this.props.onUpdate(country_id, country_data);
    }
  }, {
    key: "saveNew",
    value: function saveNew() {
      var country_data = this.state.managed_data;
      this.props.onCreate(country_data);
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
      var selectedOrganization = this.props.organizationOptions.find(function (x) {
        return x.value == formdata.organization;
      });
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "tab-pane--react"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("form", {
        className: "form"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        htmlFor: "country-name-input"
      }, gettext("Country name"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "required"
      }, "*")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "text",
        value: formdata.country,
        onChange: function onChange(e) {
          return _this4.updateFormField('country', e.target.value);
        },
        className: classnames__WEBPACK_IMPORTED_MODULE_3___default()('form-control', {
          'is-invalid': this.formErrors('country')
        }),
        id: "country-name-input",
        required: true
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ErrorFeedback, {
        errorMessages: this.formErrors('country')
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        htmlFor: "country-description-input"
      }, gettext("Description")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("textarea", {
        value: formdata.description,
        onChange: function onChange(e) {
          return _this4.updateFormField('description', e.target.value);
        },
        className: classnames__WEBPACK_IMPORTED_MODULE_3___default()('form-control', {
          'is-invalid': this.formErrors('description')
        }),
        id: "country-description-input"
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ErrorFeedback, {
        errorMessages: this.formErrors('description')
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        htmlFor: "country-code-input"
      }, gettext("Country Code")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        value: formdata.code,
        onChange: function onChange(e) {
          return _this4.updateFormField('code', e.target.value);
        },
        className: classnames__WEBPACK_IMPORTED_MODULE_3___default()('form-control', {
          'is-invalid': this.formErrors('code')
        }),
        id: "country-code-input"
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ErrorFeedback, {
        errorMessages: this.formErrors('code')
      })), this.props["new"] && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group btn-row"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-primary",
        type: "button",
        onClick: function onClick(e) {
          return _this4.saveNew(e);
        }
      }, gettext("Save Changes")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-reset",
        type: "button",
        onClick: function onClick() {
          return _this4.resetForm();
        }
      }, gettext("Reset"))), !this.props["new"] && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group btn-row"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-primary",
        type: "button",
        onClick: function onClick(e) {
          return _this4.save(e);
        }
      }, gettext("Save Changes")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-reset",
        type: "button",
        onClick: function onClick() {
          return _this4.resetForm();
        }
      }, gettext("Reset")))));
    }
  }]);

  return EditCountryProfile;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component)) || _class;



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

/***/ "4ex3":
/*!**********************************************************!*\
  !*** ./js/pages/tola_management_pages/country/models.js ***!
  \**********************************************************/
/*! exports provided: CountryStore */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CountryStore", function() { return CountryStore; });
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mobx */ "2vnA");
/* harmony import */ var _components_changesetNotice__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../components/changesetNotice */ "4a4Y");
var _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, _descriptor25, _descriptor26, _descriptor27, _descriptor28, _descriptor29, _descriptor30, _descriptor31, _temp;

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

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }



var new_objective_data = {
  id: 'new',
  name: '',
  description: '',
  status: ''
};
var CountryStore = (_class = (_temp = /*#__PURE__*/function () {
  //filter options
  function CountryStore(api, initialData) {
    _classCallCheck(this, CountryStore);

    _initializerDefineProperty(this, "organizations", _descriptor, this);

    _initializerDefineProperty(this, "users", _descriptor2, this);

    _initializerDefineProperty(this, "sectors", _descriptor3, this);

    _initializerDefineProperty(this, "filters", _descriptor4, this);

    _initializerDefineProperty(this, "appliedFilters", _descriptor5, this);

    _initializerDefineProperty(this, "is_superuser", _descriptor6, this);

    _initializerDefineProperty(this, "allCountries", _descriptor7, this);

    _initializerDefineProperty(this, "countries", _descriptor8, this);

    _initializerDefineProperty(this, "country_count", _descriptor9, this);

    _initializerDefineProperty(this, "new_country", _descriptor10, this);

    _initializerDefineProperty(this, "fetching_main_listing", _descriptor11, this);

    _initializerDefineProperty(this, "current_page", _descriptor12, this);

    _initializerDefineProperty(this, "total_pages", _descriptor13, this);

    _initializerDefineProperty(this, "bulk_targets", _descriptor14, this);

    _initializerDefineProperty(this, "bulk_targets_all", _descriptor15, this);

    _initializerDefineProperty(this, "editing_target", _descriptor16, this);

    _initializerDefineProperty(this, "editing_errors", _descriptor17, this);

    _initializerDefineProperty(this, "fetching_editing_data", _descriptor18, this);

    _initializerDefineProperty(this, "editing_objectives_data", _descriptor19, this);

    _initializerDefineProperty(this, "editing_objectives_errors", _descriptor20, this);

    _initializerDefineProperty(this, "editing_disaggregations_data", _descriptor21, this);

    _initializerDefineProperty(this, "editing_disaggregations_errors", _descriptor22, this);

    _initializerDefineProperty(this, "fetching_editing_history", _descriptor23, this);

    _initializerDefineProperty(this, "editing_history", _descriptor24, this);

    _initializerDefineProperty(this, "saving", _descriptor25, this);

    _initializerDefineProperty(this, "bulk_targets", _descriptor26, this);

    _initializerDefineProperty(this, "applying_bulk_updates", _descriptor27, this);

    _initializerDefineProperty(this, "bulk_targets_all", _descriptor28, this);

    _initializerDefineProperty(this, "changelog_expanded_rows", _descriptor29, this);

    _initializerDefineProperty(this, "active_editor_pane", _descriptor30, this);

    this.active_pane_is_dirty = false;

    _initializerDefineProperty(this, "assignDisaggregationLabelErrors", _descriptor31, this);

    this.api = api;
    Object.assign(this, initialData);
    this.appliedFilters = _objectSpread({}, this.filters);
    this.fetchCountries();
  }

  _createClass(CountryStore, [{
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
    key: "getCountryPrograms",
    value: function getCountryPrograms(countryID) {
      return this.allPrograms.filter(function (program) {
        return program.country.includes(countryID);
      });
    }
  }, {
    key: "fetchCountries",
    value: function fetchCountries() {
      var _this = this;

      if (this.dirtyConfirm()) {
        this.fetching_main_listing = true;
        this.api.fetchCountries(this.current_page + 1, this.marshalFilters(this.appliedFilters)).then(function (results) {
          Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
            _this.active_editor_pane = 'profile';
            _this.active_pane_is_dirty = false;
            _this.fetching_main_listing = false;
            _this.countries = results.results;
            _this.country_count = results.total_results;
            _this.total_pages = results.total_pages;
            _this.next_page = results.next_page;
            _this.previous_page = results.previous_page;
          });
        });
      }
    }
  }, {
    key: "applyFilters",
    value: function applyFilters() {
      this.appliedFilters = _objectSpread({}, this.filters);
      this.current_page = 0;
      this.fetchCountries();
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
      this.fetchCountries();
    }
  }, {
    key: "changeFilter",
    value: function changeFilter(filterKey, value) {
      this.filters = Object.assign(this.filters, _defineProperty({}, filterKey, value));

      if (filterKey === "countries") {
        // for "Find a country" filter, immediately apply filters when value changes:
        this.applyFilters();
      }
    }
  }, {
    key: "clearFilters",
    value: function clearFilters() {
      var clearFilters = {
        countries: this.filters.countries || [],
        organizations: [],
        sectors: [],
        programStatus: null,
        programs: []
      };
      this.filters = Object.assign(this.filters, clearFilters);
    }
  }, {
    key: "toggleEditingTarget",
    value: function toggleEditingTarget(id) {
      var _this2 = this;

      if (this.dirtyConfirm()) {
        if (this.editing_target === 'new') {
          this.countries.shift();
          this.editing_errors = {};
        }

        this.active_editor_pane = 'profile';
        this.active_pane_is_dirty = false;
        this.editing_disaggregations_errors = {};

        if (this.editing_target === id) {
          this.editing_target = false;
          this.editing_errors = {};
        } else {
          this.editing_target = id;
          this.fetching_editing_data = true;
          this.fetching_editing_history = true;
          Promise.all([this.api.fetchCountryObjectives(id), this.api.fetchCountryDisaggregations(id)]).then(function (_ref3) {
            var _ref4 = _slicedToArray(_ref3, 2),
                objectives_resp = _ref4[0],
                disaggregations_resp = _ref4[1];

            Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
              _this2.fetching_editing_data = false;
              _this2.fetching_editing_history = true;
              _this2.editing_objectives_data = objectives_resp.data;
              _this2.editing_disaggregations_data = disaggregations_resp.data;

              _this2.updateHistory(id);
            });
          });
        }
      }
    }
  }, {
    key: "updateLocalList",
    value: function updateLocalList(updated) {
      this.countries = this.countries.reduce(function (acc, current) {
        if (current.id == updated.id) {
          acc.push(updated);
        } else {
          acc.push(current);
        }

        return acc;
      }, []);
    }
  }, {
    key: "updateHistory",
    value: function updateHistory(id) {
      var _this3 = this;

      if (id === "new") {
        this.editing_history = [];
      } else {
        this.api.fetchCountryHistory(id).then(function (response) {
          _this3.editing_history = response.data;
          _this3.fetching_editing_history = false;
        })["catch"](function (errors) {
          _this3.fetching_editing_history = false;
        });
      }
    }
  }, {
    key: "onSaveSuccessHandler",
    value: function onSaveSuccessHandler() {
      var _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          retroProgramCount = _ref5.retroProgramCount;

      var message = gettext("Successfully saved");

      if (retroProgramCount) {
        message = interpolate(ngettext( // # Translators: Success message shown to user when a new disaggregation has been saved and associated with existing data.
        "Disaggregation saved and automatically selected for all indicators in %s program.", "Disaggregation saved and automatically selected for all indicators in %s programs.", retroProgramCount), [retroProgramCount]);
      }

      PNotify.success({
        text: message,
        delay: 5000
      });
    }
  }, {
    key: "onSaveErrorHandler",
    value: function onSaveErrorHandler(message) {
      PNotify.error({
        text: message || gettext("Saving failed"),
        delay: 5000
      });
    }
  }, {
    key: "onDeleteSuccessHandler",
    value: function onDeleteSuccessHandler() {
      // # Translators: Notification that a user has been able to delete a disaggregation
      PNotify.success({
        text: gettext("Successfully deleted"),
        delay: 5000
      });
    }
  }, {
    key: "onArchiveSuccessHandler",
    value: function onArchiveSuccessHandler() {
      // # Translators: Notification that a user has been able to disable a disaggregation
      PNotify.success({
        text: gettext("Successfully archived"),
        delay: 5000
      });
    }
  }, {
    key: "onUnarchiveSuccessHandler",
    value: function onUnarchiveSuccessHandler() {
      // # Translators: Notification that a user has been able to reactivate a disaggregation
      PNotify.success({
        text: gettext("Successfully unarchived"),
        delay: 5000
      });
    }
  }, {
    key: "onDuplicatedDisaggLabelMessage",
    value: function onDuplicatedDisaggLabelMessage(message) {
      PNotify.error({
        text: message || // # Translators: error message generated when item names are duplicated but are required to be unqiue.
        gettext("Saving failed: Disaggregation categories should be unique within a disaggregation."),
        delay: 5000
      });
    }
  }, {
    key: "onDuplicatedDisaggTypeMessage",
    value: function onDuplicatedDisaggTypeMessage(message) {
      PNotify.error({
        text: message || // # Translators: error message generated when item names are duplicated but are required to be unqiue.
        gettext("Saving failed: disaggregation names should be unique within a country."),
        delay: 5000
      });
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
    key: "addCountry",
    value: function addCountry() {
      if (this.dirtyConfirm()) {
        if (this.editing_target == 'new') {
          this.countries.shift();
        }

        this.active_editor_pane = 'profile';
        this.active_pane_is_dirty = false;
        var new_country_data = {
          id: "new",
          country: "",
          description: "",
          code: "",
          organizations: []
        };
        this.countries.unshift(new_country_data);
        this.editing_target = 'new';
      }
    }
  }, {
    key: "saveNewCountry",
    value: function saveNewCountry(country_data) {
      var _this4 = this;

      country_data.id = null;
      this.saving = true;
      this.api.createCountry(country_data).then(function (response) {
        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this4.saving = false;
          _this4.editing_errors = {};
          _this4.editing_target = response.data.id;
          _this4.active_pane_is_dirty = false;

          _this4.countries.shift();

          _this4.countries.unshift(response.data);

          _this4.allCountries.unshift(response.data);

          _this4.onSaveSuccessHandler();

          _this4.updateHistory(response.data.id);
        });
      })["catch"](function (errors) {
        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this4.saving = false;
          _this4.editing_errors = errors.response.data;

          _this4.onSaveErrorHandler(errors.response.data.detail);
        });
      });
    }
  }, {
    key: "updateCountry",
    value: function updateCountry(id, country_data) {
      var _this5 = this;

      this.saving = true;
      this.api.updateCountry(id, country_data).then(function (response) {
        return Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this5.saving = false;
          _this5.editing_errors = {};
          _this5.active_pane_is_dirty = false;

          _this5.updateLocalList(response.data);

          _this5.onSaveSuccessHandler();

          _this5.updateHistory(id);
        });
      })["catch"](function (errors) {
        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this5.saving = false;
          _this5.editing_errors = errors.response.data;

          _this5.onSaveErrorHandler(errors.response.data.detail);
        });
      });
    }
  }, {
    key: "addObjective",
    value: function addObjective() {
      if (this.editing_objectives_data.find(function (objective) {
        return objective.id == 'new';
      })) {
        return;
      }

      this.editing_objectives_data = [].concat(_toConsumableArray(this.editing_objectives_data), [new_objective_data]);
    }
  }, {
    key: "updateObjective",
    value: function updateObjective(id, data) {
      var _this6 = this;

      this.editing_objectives_errors = {};
      this.api.updateObjective(id, data).then(function (response) {
        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this6.onSaveSuccessHandler();

          var updatedObjective = response.data;
          _this6.active_pane_is_dirty = false;
          _this6.editing_objectives_data = _this6.editing_objectives_data.map(function (objective) {
            if (objective.id == updatedObjective.id) {
              return updatedObjective;
            }

            return objective;
          });
        });
      })["catch"](function (errors) {
        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this6.saving = false;
          _this6.editing_objectives_errors = errors.response.data;

          _this6.onSaveErrorHandler(errors.response.data.detail);
        });
      });
    }
  }, {
    key: "createObjective",
    value: function createObjective(data) {
      var _this7 = this;

      this.editing_objectives_errors = {};
      this.api.createObjective(data).then(function (response) {
        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this7.onSaveSuccessHandler();

          _this7.active_pane_is_dirty = false;
          var newObjective = response.data;
          _this7.editing_objectives_data = [].concat(_toConsumableArray(_this7.editing_objectives_data.filter(function (objective) {
            return objective.id != 'new';
          })), [newObjective]);
        });
      })["catch"](function (errors) {
        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this7.saving = false;
          _this7.editing_objectives_errors = errors.response.data;

          _this7.onSaveErrorHandler(errors.response.data.detail);
        });
      });
    }
  }, {
    key: "deleteObjective",
    value: function deleteObjective(id) {
      var _this8 = this;

      if (id == 'new') {
        this.editing_objectives_data = this.editing_objectives_data.filter(function (objective) {
          return objective.id != 'new';
        });
        return;
      }

      this.api.deleteObjective(id).then(function (response) {
        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this8.editing_objectives_data = _this8.editing_objectives_data.filter(function (objective) {
            return objective.id != id;
          });

          _this8.onDeleteSuccessHandler();
        });
      })["catch"](function (errors) {
        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this8.onSaveErrorHandler(errors.response.data.detail);
        });
      });
    }
  }, {
    key: "clearObjectiveEditingErrors",
    value: function clearObjectiveEditingErrors() {
      this.editing_objectives_errors = {};
    }
  }, {
    key: "clearDisaggregationEditingErrors",
    value: function clearDisaggregationEditingErrors() {
      this.editing_disaggregations_errors = {};
    }
  }, {
    key: "addDisaggregation",
    value: function addDisaggregation() {
      var new_disaggregation_data = {
        id: 'new',
        disaggregation_type: "",
        selected_by_default: false,
        is_archived: false,
        labels: [{
          id: 'new',
          label: '',
          createdId: 'new-0'
        }]
      };

      if (this.editing_disaggregations_data.find(function (disaggregation) {
        return disaggregation.id == 'new';
      })) {
        return;
      }

      this.editing_disaggregations_data = [].concat(_toConsumableArray(this.editing_disaggregations_data), [new_disaggregation_data]);
    }
  }, {
    key: "deleteDisaggregation",
    value: function deleteDisaggregation(id, callback) {
      var _this9 = this;

      Object(_components_changesetNotice__WEBPACK_IMPORTED_MODULE_1__["create_unified_changeset_notice"])({
        header: gettext("Warning"),
        show_icon: true,
        preamble: gettext("This action cannot be undone."),
        // # Translators: This is a confirmation prompt to confirm a user wants to delete an item
        message_text: gettext("Are you sure you want to delete this disaggregation?"),
        include_rationale: false,
        rationale_required: false,
        showCloser: true,
        notice_type: 'error',
        on_submit: function on_submit() {
          if (id == 'new') {
            _this9.editing_disaggregations_data = _this9.editing_disaggregations_data.filter(function (disagg) {
              return disagg.id != 'new';
            });
            _this9.active_pane_is_dirty = false;
            callback && callback();
            return;
          } else {
            _this9.api.deleteDisaggregation(id).then(function (response) {
              Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
                _this9.editing_disaggregations_data = _this9.editing_disaggregations_data.filter(function (disagg) {
                  return disagg.id != id;
                });
                _this9.active_pane_is_dirty = false;

                _this9.onDeleteSuccessHandler();

                _this9.updateHistory(_this9.editing_target);

                callback && callback();
              });
            });
          }
        },
        on_cancel: function on_cancel() {},
        blocking: true
      });
    }
  }, {
    key: "archiveDisaggregation",
    value: function archiveDisaggregation(id) {
      var _this10 = this;

      Object(_components_changesetNotice__WEBPACK_IMPORTED_MODULE_1__["create_unified_changeset_notice"])({
        header: gettext("Warning"),
        show_icon: true,
        // # Translators: This is part of a confirmation prompt to archive a type of disaggregation (e.g. "gender" or "age")
        preamble: gettext("New programs will be unable to use this disaggregation. (Programs already using the disaggregation will be unaffected.)"),
        // # Translators: This is a confirmation prompt to confirm a user wants to archive an item
        message_text: gettext("Are you sure you want to continue?"),
        include_rationale: false,
        rationale_required: false,
        notice_type: 'notice',
        showCloser: true,
        on_submit: function on_submit() {
          _this10.api.deleteDisaggregation(id).then(function (response) {
            Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
              _this10.editing_disaggregations_data.filter(function (disagg) {
                return disagg.id == id;
              }).forEach(function (disagg) {
                disagg.is_archived = true;
              });

              _this10.active_pane_is_dirty = false;

              _this10.onArchiveSuccessHandler();

              _this10.updateHistory(_this10.editing_target);
            });
          });
        },
        on_cancel: function on_cancel() {},
        blocking: true
      });
    }
  }, {
    key: "unarchiveDisaggregation",
    value: function unarchiveDisaggregation(id) {
      var _this11 = this;

      var countryData = this.countries.find(function (country) {
        return country.id == _this11.editing_target;
      });
      var countryName = countryData ? countryData.country : "this country";
      Object(_components_changesetNotice__WEBPACK_IMPORTED_MODULE_1__["create_unified_changeset_notice"])({
        header: gettext("Warning"),
        show_icon: true,
        // # Translators: This is part of a confirmation prompt to unarchive a type of disaggregation (e.g. "gender" or "age")
        preamble: interpolate(gettext("All programs in %s will be able to use this disaggregation."), [countryName]),
        // # Translators: This is a confirmation prompt to confirm a user wants to unarchive an item
        message_text: gettext("Are you sure you want to continue?"),
        notice_type: 'notice',
        showCloser: true,
        on_submit: function on_submit() {
          _this11.api.partialUpdateDisaggregation(id, {
            is_archived: false
          }).then(function (response) {
            Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
              _this11.editing_disaggregations_data.filter(function (disagg) {
                return disagg.id == id;
              }).forEach(function (disagg) {
                disagg.is_archived = false;
              });

              _this11.active_pane_is_dirty = false;

              _this11.onUnarchiveSuccessHandler();

              _this11.updateHistory(_this11.editing_target);
            });
          });
        },
        on_cancel: function on_cancel() {},
        blocking: true
      });
    }
  }, {
    key: "updateDisaggregation",
    value: function updateDisaggregation(id, data) {
      var _this12 = this;

      this.assignDisaggregationErrors(this.editing_disaggregations_data, data, id);
      var hasLabelErrors = this.editing_disaggregations_errors.hasOwnProperty('labels') && this.editing_disaggregations_errors['labels'].length > 0 && this.editing_disaggregations_errors['labels'].some(function (entry) {
        return entry.hasOwnProperty('label');
      });

      if (this.editing_disaggregations_errors['disaggregation_type'] || hasLabelErrors) {
        return;
      }

      delete data.is_archived;
      this.api.updateDisaggregation(id, data).then(function (response) {
        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this12.onSaveSuccessHandler();

          var updatedDisaggregation = response.data;
          _this12.active_pane_is_dirty = false;
          _this12.editing_disaggregations_data = _this12.editing_disaggregations_data.map(function (disaggregation) {
            if (disaggregation.id == updatedDisaggregation.id) {
              return updatedDisaggregation;
            }

            return disaggregation;
          });

          _this12.updateHistory(_this12.editing_target);
        });
      })["catch"](function (errors) {
        _this12.saving = false;
        _this12.editing_disaggregations_errors = errors.response.data;

        _this12.onSaveErrorHandler();
      });
    }
  }, {
    key: "createDisaggregation",
    value: function createDisaggregation(data) {
      var _this13 = this;

      this.assignDisaggregationErrors(this.editing_disaggregations_data, data, "new");
      var hasLabelErrors = this.editing_disaggregations_errors.hasOwnProperty('labels') && this.editing_disaggregations_errors['labels'].length > 0 && this.editing_disaggregations_errors['labels'].some(function (entry) {
        return entry.hasOwnProperty('label');
      });

      if (this.editing_disaggregations_errors['disaggregation_type'] || hasLabelErrors) {
        this.saving = false;
        return Promise.reject("Validation failed");
      }

      var retroProgramCount = data.hasOwnProperty('retroPrograms') ? data.retroPrograms.length : 0;
      return this.api.createDisaggregation(data).then(function (response) {
        _this13.updateHistory(response.data.country);

        return Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this13.onSaveSuccessHandler({
            retroProgramCount: retroProgramCount
          });

          var newDisaggregation = response.data;
          _this13.editing_history = history.data;
          _this13.active_pane_is_dirty = false;
          _this13.editing_disaggregations_data = [].concat(_toConsumableArray(_this13.editing_disaggregations_data.filter(function (disaggregation) {
            return disaggregation.id != 'new';
          })), [newDisaggregation]);
          return newDisaggregation;
        });
      })["catch"](function (errors) {
        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this13.saving = false;
          _this13.editing_disaggregations_errors = errors.response.data;

          _this13.onSaveErrorHandler();
        });
        return Promise.reject("API handling error");
      });
    }
  }, {
    key: "toggleChangeLogRowExpando",
    value: function toggleChangeLogRowExpando(row_id) {
      if (this.changelog_expanded_rows.has(row_id)) {
        this.changelog_expanded_rows["delete"](row_id);
      } else {
        this.changelog_expanded_rows.add(row_id);
      }
    }
  }, {
    key: "assignDisaggregationErrors",
    value: function assignDisaggregationErrors(existingDisagg, newDisagg, disaggId) {
      var existingDisaggTypes = existingDisagg.filter(function (disagg) {
        return disagg.id !== disaggId;
      }).map(function (disagg) {
        return disagg.disaggregation_type;
      });

      if (existingDisaggTypes.includes(newDisagg.disaggregation_type)) {
        var countryName = this.allCountries.filter(function (c) {
          return parseInt(c.id) === parseInt(newDisagg.country);
        })[0] || ""; // # Translators:  This error message appears underneath a user-input name if it appears more than once in a set of names.  Only unique names are allowed.

        this.editing_disaggregations_errors['disaggregation_type'] = [interpolate(gettext("There is already a disaggregation type called \"%(newDisagg)s\" in %(country)s. Please choose a unique name."), {
          newDisagg: newDisagg['disaggregation_type'],
          country: countryName.country
        }, true)];
      } else {
        this.editing_disaggregations_errors = {};
      }

      this.assignDisaggregationLabelErrors(newDisagg);
    }
  }, {
    key: "findDuplicateLabelIndexes",
    value: function findDuplicateLabelIndexes(label_list) {
      var lowerCaseList = label_list.map(function (label) {
        return label.toLowerCase();
      });
      var dupeIndexes = new Set();
      lowerCaseList.forEach(function (label, index) {
        var dupeIndex = lowerCaseList.indexOf(label, index + 1);

        if (dupeIndex > 0) {
          dupeIndexes.add(index).add(dupeIndex);
        }
      });
      return Array.from(dupeIndexes);
    }
  }]);

  return CountryStore;
}(), _temp), (_descriptor = _applyDecoratedDescriptor(_class.prototype, "organizations", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "users", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, "sectors", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, "filters", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {
      countries: [],
      organizations: [],
      sectors: [],
      programStatus: null,
      programs: []
    };
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class.prototype, "appliedFilters", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class.prototype, "is_superuser", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class.prototype, "allCountries", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class.prototype, "countries", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor9 = _applyDecoratedDescriptor(_class.prototype, "country_count", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0;
  }
}), _descriptor10 = _applyDecoratedDescriptor(_class.prototype, "new_country", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor11 = _applyDecoratedDescriptor(_class.prototype, "fetching_main_listing", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor12 = _applyDecoratedDescriptor(_class.prototype, "current_page", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0;
  }
}), _descriptor13 = _applyDecoratedDescriptor(_class.prototype, "total_pages", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor14 = _applyDecoratedDescriptor(_class.prototype, "bulk_targets", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new Map();
  }
}), _descriptor15 = _applyDecoratedDescriptor(_class.prototype, "bulk_targets_all", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor16 = _applyDecoratedDescriptor(_class.prototype, "editing_target", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor17 = _applyDecoratedDescriptor(_class.prototype, "editing_errors", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor18 = _applyDecoratedDescriptor(_class.prototype, "fetching_editing_data", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor19 = _applyDecoratedDescriptor(_class.prototype, "editing_objectives_data", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor20 = _applyDecoratedDescriptor(_class.prototype, "editing_objectives_errors", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor21 = _applyDecoratedDescriptor(_class.prototype, "editing_disaggregations_data", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor22 = _applyDecoratedDescriptor(_class.prototype, "editing_disaggregations_errors", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor23 = _applyDecoratedDescriptor(_class.prototype, "fetching_editing_history", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor24 = _applyDecoratedDescriptor(_class.prototype, "editing_history", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor25 = _applyDecoratedDescriptor(_class.prototype, "saving", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor26 = _applyDecoratedDescriptor(_class.prototype, "bulk_targets", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new Map();
  }
}), _descriptor27 = _applyDecoratedDescriptor(_class.prototype, "applying_bulk_updates", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor28 = _applyDecoratedDescriptor(_class.prototype, "bulk_targets_all", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor29 = _applyDecoratedDescriptor(_class.prototype, "changelog_expanded_rows", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new Set();
  }
}), _applyDecoratedDescriptor(_class.prototype, "fetchCountries", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "fetchCountries"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "applyFilters", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "applyFilters"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "changePage", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "changePage"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "changeFilter", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "changeFilter"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "clearFilters", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "clearFilters"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "toggleEditingTarget", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "toggleEditingTarget"), _class.prototype), _descriptor30 = _applyDecoratedDescriptor(_class.prototype, "active_editor_pane", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 'profile';
  }
}), _applyDecoratedDescriptor(_class.prototype, "onProfilePaneChange", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "onProfilePaneChange"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "addCountry", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "addCountry"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "saveNewCountry", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "saveNewCountry"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "updateCountry", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "updateCountry"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "addObjective", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "addObjective"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "updateObjective", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "updateObjective"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "createObjective", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "createObjective"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "deleteObjective", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "deleteObjective"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "clearObjectiveEditingErrors", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "clearObjectiveEditingErrors"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "clearDisaggregationEditingErrors", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "clearDisaggregationEditingErrors"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "addDisaggregation", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "addDisaggregation"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "deleteDisaggregation", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "deleteDisaggregation"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "archiveDisaggregation", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "archiveDisaggregation"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "unarchiveDisaggregation", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "unarchiveDisaggregation"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "updateDisaggregation", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "updateDisaggregation"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "createDisaggregation", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "createDisaggregation"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "toggleChangeLogRowExpando", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "toggleChangeLogRowExpando"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "assignDisaggregationErrors", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "assignDisaggregationErrors"), _class.prototype), _descriptor31 = _applyDecoratedDescriptor(_class.prototype, "assignDisaggregationLabelErrors", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this14 = this;

    return function (newDisagg) {
      var duplicateIndexes = _this14.findDuplicateLabelIndexes(newDisagg.labels.map(function (label) {
        return label.label;
      }));

      var labelErrors = Array(newDisagg.labels.length).fill().map(function (e) {
        return {};
      });
      newDisagg.labels.forEach(function (label, index) {
        if (!label.label || label.label.length === 0) {
          // # Translators:  This error message appears underneath user-input labels that appear more than once in a set of labels.  Only unique labels are allowed.
          labelErrors[index]['label'] = [gettext("Categories must not be blank.")];
        } else if (duplicateIndexes.includes(index)) {
          // # Translators:  This error message appears underneath user-input labels that appear more than once in a set of labels.  Only unique labels are allowed.
          labelErrors[index]['label'] = [gettext("Categories must have unique names.")];
        }
      });
      _this14.editing_disaggregations_errors['labels'] = labelErrors;
    };
  }
})), _class);

/***/ }),

/***/ "5G0W":
/*!******************************************************************************!*\
  !*** ./js/pages/tola_management_pages/country/components/edit_objectives.js ***!
  \******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return EditObjectives; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-select */ "Cs6D");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! classnames */ "TSYQ");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ "IP2g");
var _class, _class2;

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






var statusOptions = [{
  value: 'proposed',
  label: gettext('Proposed')
}, {
  value: 'active',
  label: gettext('Active')
}, {
  value: 'acheived',
  label: gettext('Achieved')
}];
var ErrorFeedback = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref) {
  var errorMessages = _ref.errorMessages;

  if (!errorMessages) {
    return null;
  }

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "invalid-feedback"
  }, errorMessages.map(function (message, index) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      key: index
    }, message);
  }));
});

var StrategicObjectiveForm = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class = /*#__PURE__*/function (_React$Component) {
  _inherits(StrategicObjectiveForm, _React$Component);

  var _super = _createSuper(StrategicObjectiveForm);

  function StrategicObjectiveForm(props) {
    var _this;

    _classCallCheck(this, StrategicObjectiveForm);

    _this = _super.call(this, props);
    var objective = props.objective;
    _this.state = {
      managed_data: _objectSpread({}, objective)
    };
    return _this;
  }

  _createClass(StrategicObjectiveForm, [{
    key: "hasUnsavedDataAction",
    value: function hasUnsavedDataAction() {
      this.props.onIsDirtyChange(JSON.stringify(this.state.managed_data) != JSON.stringify(this.props.objective));
    }
  }, {
    key: "updateFormField",
    value: function updateFormField(fieldKey, value) {
      var _this2 = this;

      var managed_data = this.state.managed_data;
      var modified = Object.assign(managed_data, _defineProperty({}, fieldKey, value));
      this.setState({
        managed_data: modified
      }, function () {
        return _this2.hasUnsavedDataAction();
      });
    }
  }, {
    key: "formErrors",
    value: function formErrors(fieldKey) {
      return this.props.errors[fieldKey];
    }
  }, {
    key: "resetForm",
    value: function resetForm() {
      var _this3 = this;

      this.props.clearErrors();
      var objective = this.props.objective;
      this.setState({
        managed_data: _objectSpread({}, objective)
      }, function () {
        return _this3.hasUnsavedDataAction();
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var _this$props = this.props,
          objective = _this$props.objective,
          expanded = _this$props.expanded,
          expandAction = _this$props.expandAction,
          deleteAction = _this$props.deleteAction,
          saveObjective = _this$props.saveObjective,
          createObjective = _this$props.createObjective;
      var managed_data = this.state.managed_data;
      var objective_status = managed_data.status;
      var selectedStatus = objective_status ? statusOptions.find(function (x) {
        return x.value == objective_status;
      }) : {};
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "accordion-row"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "accordion-row__content"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        onClick: expandAction,
        className: "btn accordion-row__btn btn-link",
        tabIndex: "0"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_4__["FontAwesomeIcon"], {
        icon: expanded ? 'caret-down' : 'caret-right'
      }), objective.id == 'new' ? gettext("New Strategic Objective") : objective.name), expanded && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("form", {
        className: "form card card-body bg-white"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "label--required",
        htmlFor: "objective-name-input"
      }, gettext("Short name")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        id: "objective-name-input",
        className: classnames__WEBPACK_IMPORTED_MODULE_3___default()('form-control', {
          'is-invalid': this.formErrors('name')
        }),
        value: managed_data.name,
        onChange: function onChange(e) {
          return _this4.updateFormField('name', e.target.value);
        },
        type: "text",
        required: true
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ErrorFeedback, {
        errorMessages: this.formErrors('name')
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        htmlFor: "objective-description-input"
      }, gettext("Description")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("textarea", {
        id: "objective-description-input",
        className: classnames__WEBPACK_IMPORTED_MODULE_3___default()('form-control', {
          'is-invalid': this.formErrors('description')
        }),
        value: managed_data.description,
        onChange: function onChange(e) {
          return _this4.updateFormField('description', e.target.value);
        },
        type: "text",
        required: true
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ErrorFeedback, {
        errorMessages: this.formErrors('description')
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        htmlFor: "objective-status-input"
      }, gettext("Status")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_2__["default"], {
        value: selectedStatus,
        options: statusOptions,
        onChange: function onChange(e) {
          return _this4.updateFormField('status', e.value);
        },
        className: classnames__WEBPACK_IMPORTED_MODULE_3___default()('react-select', {
          'is-invalid': this.formErrors('status')
        }),
        id: "objective-status-input"
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ErrorFeedback, {
        errorMessages: this.formErrors('status')
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "objective-form-buttons"
      }, objective.id == 'new' && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group btn-row"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-primary",
        type: "button",
        onClick: function onClick() {
          return createObjective(managed_data);
        }
      }, gettext("Save Changes"))), objective.id != 'new' && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group btn-row"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-primary",
        type: "button",
        onClick: function onClick() {
          return saveObjective(managed_data);
        }
      }, gettext("Save Changes")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-reset",
        type: "button",
        onClick: function onClick() {
          return _this4.resetForm();
        }
      }, gettext("Reset"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "right-buttons"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        tabIndex: "0",
        onClick: deleteAction,
        className: "btn btn-link btn-danger"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-trash"
      }), gettext("Delete")))))));
    }
  }]);

  return StrategicObjectiveForm;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component)) || _class;

var EditObjectives = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class2 = /*#__PURE__*/function (_React$Component2) {
  _inherits(EditObjectives, _React$Component2);

  var _super2 = _createSuper(EditObjectives);

  function EditObjectives(props) {
    var _this5;

    _classCallCheck(this, EditObjectives);

    _this5 = _super2.call(this, props);
    _this5.state = {
      expanded_id: null,
      is_dirty: false
    };
    return _this5;
  }

  _createClass(EditObjectives, [{
    key: "handleDirtyUpdate",
    value: function handleDirtyUpdate(is_dirty) {
      this.setState({
        is_dirty: is_dirty
      });
      this.props.onIsDirtyChange(is_dirty);
    }
  }, {
    key: "dirtyConfirm",
    value: function dirtyConfirm() {
      return !this.state.is_dirty || this.state.is_dirty && confirm(gettext("You have unsaved changes. Are you sure you want to discard them?"));
    }
  }, {
    key: "toggleExpand",
    value: function toggleExpand(id) {
      this.props.clearErrors();

      if (this.dirtyConfirm()) {
        var expanded_id = this.state.expanded_id;

        if (id == expanded_id) {
          this.setState({
            expanded_id: null
          });
        } else {
          this.setState({
            expanded_id: id
          });
        }

        if (expanded_id == 'new') {
          this.props.onDelete(expanded_id);
        }

        this.handleDirtyUpdate(false);
      }
    }
  }, {
    key: "addObjective",
    value: function addObjective() {
      if (this.dirtyConfirm()) {
        this.props.clearErrors();
        this.props.addObjective();
        this.setState({
          expanded_id: 'new'
        });
        this.handleDirtyUpdate(false);
      }
    }
  }, {
    key: "deleteObjectiveAction",
    value: function deleteObjectiveAction(objectiveId) {
      if (objectiveId == 'new') {
        this.props.onDelete(objectiveId);
        return;
      }

      if (confirm(gettext("Delete Strategic Objective?"))) {
        this.props.onDelete(objectiveId);
      }
    }
  }, {
    key: "updateObjective",
    value: function updateObjective(objectiveId, data) {
      this.props.onUpdate(objectiveId, data);
      this.setState({
        is_dirty: false
      });
    }
  }, {
    key: "createObjective",
    value: function createObjective(data) {
      var objectiveData = Object.assign(data, {
        country: this.props.country_id
      });
      this.props.onCreate(objectiveData);
      this.setState({
        is_dirty: false
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this6 = this;

      var _this$state = this.state,
          expanded_id = _this$state.expanded_id,
          new_objective = _this$state.new_objective;
      var objectives = this.props.objectives;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "tab-pane--react"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h3", null, gettext("Strategic Objectives")), objectives.map(function (objective) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(StrategicObjectiveForm, {
          key: objective.id,
          objective: objective,
          expanded: objective.id == expanded_id,
          expandAction: function expandAction() {
            return _this6.toggleExpand(objective.id);
          },
          deleteAction: function deleteAction() {
            return _this6.deleteObjectiveAction(objective.id);
          },
          saveObjective: function saveObjective(data) {
            return _this6.updateObjective(objective.id, data);
          },
          createObjective: function createObjective(data) {
            return _this6.createObjective(data);
          },
          errors: _this6.props.errors,
          clearErrors: _this6.props.clearErrors,
          onIsDirtyChange: function onIsDirtyChange(is_dirty) {
            return _this6.handleDirtyUpdate(is_dirty);
          }
        });
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        tabIndex: "0",
        onClick: function onClick() {
          return _this6.addObjective();
        },
        className: "btn btn-link btn-add"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-plus-circle"
      }), gettext("Add strategic objective"))));
    }
  }]);

  return EditObjectives;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component)) || _class2;



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
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-select */ "Cs6D");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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




var VirtualizedMenuList = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(VirtualizedMenuList, _React$PureComponent);

  var _super = _createSuper(VirtualizedMenuList);

  function VirtualizedMenuList(props) {
    var _this;

    _classCallCheck(this, VirtualizedMenuList);

    _this = _super.call(this, props);
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

      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        style: {
          display: "flex",
          height: "100vh",
          maxHeight: maxHeight + "px"
        }
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        style: {
          flex: "1 1 auto"
        }
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_virtualized__WEBPACK_IMPORTED_MODULE_1__["AutoSizer"], null, function (_ref) {
        var width = _ref.width,
            height = _ref.height;
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_virtualized__WEBPACK_IMPORTED_MODULE_1__["List"], {
          height: height,
          width: width,
          deferredMeasurementCache: _this2.cache,
          rowCount: rowCount,
          rowHeight: _this2.cache.rowHeight,
          noRowsRenderer: function noRowsRenderer() {
            return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, "No selections available");
          },
          rowRenderer: function rowRenderer(_ref2) {
            var index = _ref2.index,
                parent = _ref2.parent,
                key = _ref2.key,
                style = _ref2.style;
            return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_virtualized__WEBPACK_IMPORTED_MODULE_1__["CellMeasurer"], {
              key: key,
              cache: _this2.cache,
              parent: parent,
              columnIndex: 0,
              rowIndex: index
            }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
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
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_2__["default"], _extends({
    components: {
      VirtualizedMenuList: VirtualizedMenuList
    }
  }, props));
};

/* harmony default export */ __webpack_exports__["default"] = (VirtualizedSelect);

/***/ }),

/***/ "9flW":
/*!******************************************************************************!*\
  !*** ./js/pages/tola_management_pages/country/components/country_history.js ***!
  \******************************************************************************/
/*! exports provided: CountryHistory, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CountryHistory", function() { return CountryHistory; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var components_changelog__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! components/changelog */ "KnAV");
var _class;

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




var CountryHistory = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class = /*#__PURE__*/function (_React$Component) {
  _inherits(CountryHistory, _React$Component);

  var _super = _createSuper(CountryHistory);

  function CountryHistory() {
    _classCallCheck(this, CountryHistory);

    return _super.apply(this, arguments);
  }

  _createClass(CountryHistory, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          history = _this$props.history,
          store = _this$props.store;
      var changelog_expanded_rows = store.changelog_expanded_rows;
      var country_name = store.editing_target ? store.countries.filter(function (c) {
        return c.id === store.editing_target;
      })[0].country + ": " : "";
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "tab-pane--react admin-edit-pane"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", {
        className: "no-bold"
      }, country_name, gettext("History")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_changelog__WEBPACK_IMPORTED_MODULE_2__["default"], {
        data: history,
        expanded_rows: changelog_expanded_rows,
        toggle_expando_cb: function toggle_expando_cb(row_id) {
          return store.toggleChangeLogRowExpando(row_id);
        }
      }));
    }
  }]);

  return CountryHistory;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component)) || _class;
/* harmony default export */ __webpack_exports__["default"] = (CountryHistory);

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
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", _extends({
    className: 'loading-spinner__container ' + loading + ' ' + (className || '')
  }, props), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "loading-spinner__overlay"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "loading-spinner__spinner"
  })), children);
};

/* harmony default export */ __webpack_exports__["default"] = (LoadingSpinner);

/***/ }),

/***/ "KnAV":
/*!************************************!*\
  !*** ./js/components/changelog.js ***!
  \************************************/
/*! exports provided: ChangeField, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChangeField", function() { return ChangeField; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ "IP2g");
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! mobx */ "2vnA");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../constants */ "v38i");
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }






var ChangeField = function ChangeField(_ref) {
  var name = _ref.name,
      data = _ref.data,
      _ref$extraTitleText = _ref.extraTitleText,
      extraTitleText = _ref$extraTitleText === void 0 ? null : _ref$extraTitleText;
  var extraTitle = extraTitleText ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h4", {
    className: "disagg-type__title, text-small"
  }, extraTitleText) : null;

  if (name === "Disaggregation categories" && _typeof(data) === 'object' && data !== null) {
    var sorted_labels = Object.values(data).sort(function (a, b) {
      return a.custom_sort - b.custom_sort;
    });
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, name, ": "), extraTitle, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", {
      className: "no-list-style"
    }, sorted_labels.map(function (entry, index) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
        key: index
      }, entry.label !== undefined && entry.label !== null ? entry.label : "");
    })));
  } else {
    var change_value;

    if (data !== undefined && data !== null && data !== "N/A") {
      change_value = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "change__field__value"
      }, ["true", "false"].includes(data.toString()) ? data.toString().replace("t", "T").replace("f", "F") : data.toString());
    } else {
      change_value = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "change__field__value empty-value"
      }, _constants__WEBPACK_IMPORTED_MODULE_4__["EM_DASH"]);
    }

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "change__field"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", {
      className: "change__field__name"
    }, name), ": ", change_value);
  }
};

var ChangeLogEntryHeader = function ChangeLogEntryHeader(_ref2) {
  var data = _ref2.data,
      is_expanded = _ref2.is_expanded,
      toggle_expando_cb = _ref2.toggle_expando_cb;
  // TODO: apply is-expanded dynamically
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
    className: is_expanded ? 'changelog__entry__header is-expanded' : 'changelog__entry__header',
    onClick: function onClick() {
      return toggle_expando_cb(data.id);
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
    className: "text-nowrap text-action"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_2__["FontAwesomeIcon"], {
    icon: is_expanded ? 'caret-down' : 'caret-right'
  }), "\xA0", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, data.date)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
    className: "text-nowrap"
  }, data.admin_user), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
    className: "text-nowrap"
  }, data.pretty_change_type), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null));
};

var ChangeLogEntryRow = function ChangeLogEntryRow(props) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
    key: props.id,
    className: "changelog__entry__row"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "changelog__change--prev"
  }, props.previous)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "changelog__change--new"
  }, props["new"])));
};

var ChangeLogEntryRowBuilder = function ChangeLogEntryRowBuilder(_ref3) {
  var data = _ref3.data;
  var allRows = []; // We should never need this but just in case someone manages to store a log entry without actual diffs, give them
  // a soft place to land.

  var nullRow = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeLogEntryRow, {
    previous: gettext("No differences found"),
    "new": null,
    id: 1,
    key: 1
  }); // If they manage to store a log without any diffs at all, send them to the soft landing place.

  if (Array.isArray(data.diff_list) && data.diff_list.length === 0 || Object.keys(data.diff_list || {}).length === 0) {
    allRows.push(nullRow);
    return allRows;
  }

  if (data.change_type === 'user_programs_updated') {
    // Create multiple row for program/country changes:
    if (data.diff_list.base_country) {
      var previousEntry = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeField, {
        name: data.diff_list.base_country.pretty_name,
        data: data.diff_list.base_country.prev
      });
      var newEntry = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeField, {
        name: data.diff_list.base_country.pretty_name,
        data: data.diff_list.base_country["new"]
      });
      allRows.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeLogEntryRow, {
        previous: previousEntry,
        "new": newEntry,
        id: "base_country",
        key: "base_country"
      }));
    }

    Object.entries(data.diff_list.countries).forEach(function (_ref4) {
      var _ref5 = _slicedToArray(_ref4, 2),
          id = _ref5[0],
          country = _ref5[1];

      var key = "".concat(id, "_").concat(country);
      var previousEntry = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeField, {
        name: gettext("Country"),
        data: country.prev.country
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeField, {
        name: gettext("Role"),
        data: country.prev.role
      }));
      var newEntry = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeField, {
        name: gettext("Country"),
        data: country["new"].country
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeField, {
        name: gettext("Role"),
        data: country["new"].role
      }));
      allRows.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeLogEntryRow, {
        previous: previousEntry,
        "new": newEntry,
        id: key,
        key: key
      }));
    });
    Object.entries(data.diff_list.programs).forEach(function (_ref6) {
      var _ref7 = _slicedToArray(_ref6, 2),
          id = _ref7[0],
          program = _ref7[1];

      var key = "".concat(id, "_").concat(program);
      var previousEntry = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeField, {
        name: gettext("Program"),
        data: program.prev.program
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeField, {
        name: gettext("Country"),
        data: program.prev.country
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeField, {
        name: gettext("Role"),
        data: program.prev.role
      }));
      var newEntry = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeField, {
        name: gettext("Program"),
        data: program["new"].program
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeField, {
        name: gettext("Country"),
        data: program["new"].country
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeField, {
        name: gettext("Role"),
        data: program["new"].role
      }));
      allRows.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeLogEntryRow, {
        previous: previousEntry,
        "new": newEntry,
        id: key,
        key: key
      }));
    });
  } else {
    var extraTitleText = null;
    var skipDisaggType = false;

    if (data.pretty_change_type === "Country disaggregation updated") {
      var diff_list = data.diff_list;
      var disaggType = diff_list.filter(function (diff) {
        return diff.name === "disaggregation_type";
      });

      if (disaggType[0].prev === disaggType[0]["new"]) {
        extraTitleText = disaggType[0].prev;
        skipDisaggType = true;
      }
    }

    data.diff_list.forEach(function (changeSet, id) {
      var key = "".concat(id, "_").concat(changeSet.pretty_name);

      if (!(changeSet.name === "disaggregation_type" && skipDisaggType)) {
        var _previousEntry = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeField, {
          key: id,
          name: changeSet.pretty_name,
          data: changeSet.prev,
          id: id,
          extraTitleText: extraTitleText
        }));

        var _newEntry = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeField, {
          key: id,
          name: changeSet.pretty_name,
          data: changeSet["new"],
          id: id,
          extraTitleText: extraTitleText
        }));

        allRows.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeLogEntryRow, {
          previous: _previousEntry,
          "new": _newEntry,
          id: key,
          key: key
        }));
      }
    });
  } // If they manage to store a log with identical values in diffs, send them to the soft landing place.  Hopefully
  // the system will refuse to log no-difference diffs.


  if (allRows.length === 0) {
    allRows.push(nullRow);
  }

  return allRows;
};

var ChangeLogEntry = function ChangeLogEntry(_ref8) {
  var data = _ref8.data,
      is_expanded = _ref8.is_expanded,
      toggle_expando_cb = _ref8.toggle_expando_cb;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tbody", {
    className: "changelog__entry",
    key: data.id
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeLogEntryHeader, {
    data: data,
    is_expanded: is_expanded,
    toggle_expando_cb: toggle_expando_cb
  }), is_expanded && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeLogEntryRowBuilder, {
    data: data
  }));
};

var ChangeLog = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref9) {
  var data = _ref9.data,
      expanded_rows = _ref9.expanded_rows,
      toggle_expando_cb = _ref9.toggle_expando_cb;
  // If expanded_rows is not null/undefined then use it to control expansion/collapse of entries
  // otherwise, default it to "open"
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("table", {
    className: "table table-sm bg-white table-bordered text-small changelog"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("thead", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    className: "text-nowrap"
  }, gettext("Date")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    className: "text-nowrap"
  }, gettext("Admin")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    className: "text-nowrap"
  }, gettext("Change Type")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    className: "text-nowrap td--half-stretch"
  }, gettext("Previous Entry")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    className: "text-nowrap td--half-stretch"
  }, gettext("New Entry")))), data.map(function (entry) {
    var is_expanded = true;

    if (expanded_rows) {
      is_expanded = expanded_rows.has(entry.id);
    }

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ChangeLogEntry, {
      key: entry.id,
      data: entry,
      is_expanded: is_expanded,
      toggle_expando_cb: toggle_expando_cb
    });
  }));
});
/* harmony default export */ __webpack_exports__["default"] = (ChangeLog);

/***/ }),

/***/ "NlW9":
/*!*********************************************************!*\
  !*** ./js/pages/tola_management_pages/country/index.js ***!
  \*********************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "i8i4");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./models */ "4ex3");
/* harmony import */ var _views__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./views */ "/UUj");
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./api */ "e0fF");





var app_root = '#app_root';
/*
 * Model/Store setup
 */

var initialData = {
  allCountries: jsContext.countries,
  organizations: jsContext.organizations,
  allPrograms: jsContext.programs,
  is_superuser: jsContext.is_superuser
};
var store = new _models__WEBPACK_IMPORTED_MODULE_2__["CountryStore"](_api__WEBPACK_IMPORTED_MODULE_4__["default"], initialData);
react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_views__WEBPACK_IMPORTED_MODULE_3__["IndexView"], {
  store: store
}), document.querySelector(app_root));

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
/* harmony import */ var react_paginate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-paginate */ "I+5a");
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
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_paginate__WEBPACK_IMPORTED_MODULE_1___default.a, _extends({
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

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("td", _extends({
    className: ["mgmt-table__col", className].join(' ')
  }, props), props.children);
}; // TODO: this is redundant with ColumnComponent


var HeaderColumnComponent = function HeaderColumnComponent(_ref2) {
  var className = _ref2.className,
      size = _ref2.size,
      props = _objectWithoutProperties(_ref2, ["className", "size"]);

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("th", _extends({
    className: ["mgmt-table__col", "mgmt-table__col__width-".concat(size), className].join(' ')
  }, props), props.children);
};

var InnerRowComponent = function InnerRowComponent(_ref3) {
  var className = _ref3.className,
      props = _objectWithoutProperties(_ref3, ["className"]);

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("tr", _extends({
    className: ["mgmt-table__row", className].join(' ')
  }, props), props.children);
}; // TODO: this is redundant with InnerRowComponent


var HeaderRowComponent = function HeaderRowComponent(_ref4) {
  var className = _ref4.className,
      props = _objectWithoutProperties(_ref4, ["className"]);

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("tr", _extends({
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
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("tbody", _extends({
      className: classnames__WEBPACK_IMPORTED_MODULE_2___default()(["mgmt-table__body", className].join(' '), {
        "is-expanded": expanded
      })
    }, props), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(InnerRowComponent, null, props.children), expanded && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(ObservedExpando, {
      Wrapper: ExpandoWrapper
    }));
  } else {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("tbody", _extends({
      className: ["mgmt-table__body", className].join(' ')
    }, props), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(InnerRowComponent, null, props.children));
  }
});

var ExpandoWrapper = function ExpandoWrapper(_ref6) {
  var className = _ref6.className,
      props = _objectWithoutProperties(_ref6, ["className"]);

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("tr", _extends({
    className: ["mgmt-table__row--expanded", className].join(' ')
  }, props), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("td", {
    colSpan: "5"
  }, props.children));
};

var RowList = Object(mobx_react__WEBPACK_IMPORTED_MODULE_0__["observer"])(function (_ref7) {
  var data = _ref7.data,
      Row = _ref7.Row,
      keyField = _ref7.keyField,
      props = _objectWithoutProperties(_ref7, ["data", "Row", "keyField"]);

  var ObservedRow = Object(mobx_react__WEBPACK_IMPORTED_MODULE_0__["observer"])(Row);
  return data.map(function (row_data) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(ObservedRow, {
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
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("table", {
    className: ['table bg-white', className].join(' ')
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("thead", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(ObservedHeaderRow, {
    Col: HeaderColumnComponent,
    Row: HeaderRowComponent
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(RowList, props));
});
/* harmony default export */ __webpack_exports__["default"] = (ManagementTable);

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
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-select */ "Cs6D");
/* harmony import */ var _virtualized_react_select__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./virtualized-react-select */ "5Xg7");
/* harmony import */ var react_multiselect_checkboxes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-multiselect-checkboxes */ "VCnP");
/* harmony import */ var react_multiselect_checkboxes__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_multiselect_checkboxes__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_multiselect_checkboxes_lib_CheckboxGroup__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-multiselect-checkboxes/lib/CheckboxGroup */ "oary");
/* harmony import */ var react_multiselect_checkboxes_lib_CheckboxGroup__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_multiselect_checkboxes_lib_CheckboxGroup__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var emotion__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! emotion */ "PAeb");
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! mobx-react */ "okNM");
var _class, _temp;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }








/* JSX Element to display, e.g. "4 selected" in a multiselect dropdown */

var CountLabel = function CountLabel(props) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "count__label"
  }, props.children, props.clearable && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    onClick: props.clearSelect
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
    className: "fa fa-times",
    "aria-hidden": "true"
  })));
};
/*
 * CheckboxGroup drop in replacement that delivers a heading without a checkbox if the optgroup has
 * the attribute "selectable: false"
 * Also adds a vertical divider above any optgroup with the attribute divider: true
 */


function Group(props) {
  if (props.data.selectable === false) {
    var children = props.children,
        className = props.className,
        cx = props.cx,
        getStyles = props.getStyles,
        Heading = props.Heading,
        setValue = props.setValue,
        data = props.data,
        label = props.label,
        getValue = props.getValue,
        theme = props.theme,
        getOptionValue = props.selectProps.getOptionValue;
    var headingProps = {
      getStyles: getStyles,
      cx: cx,
      theme: theme,
      indeterminate: false,
      checked: false
    };
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: cx(Object(emotion__WEBPACK_IMPORTED_MODULE_5__["css"])(getStyles('group', props)), {
        group: true
      }, className)
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: cx(Object(emotion__WEBPACK_IMPORTED_MODULE_5__["css"])(getStyles('groupHeading', _objectSpread({}, headingProps))), {
        'group-heading': true
      }, className)
    }, props.data.label), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, props.children));
  }

  if (props.data.divider === true) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("hr", {
      style: {
        margin: '3px 0px 0px 0px'
      }
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_multiselect_checkboxes_lib_CheckboxGroup__WEBPACK_IMPORTED_MODULE_4___default.a, props));
  }

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_multiselect_checkboxes_lib_CheckboxGroup__WEBPACK_IMPORTED_MODULE_4___default.a, props);
}
/*
 *  A wrapper for react-multiselect-checkboxes which implements:
 *      - translated "n selected" if multiple options are selected (including a "noList" attribute for uncounted selections
 *      - optgroups without checkboxes if {selectable: false} applied to optgroup object
 *      - virtualization (??) - this functionality from external vendor needs verification
 */


var CheckboxedMultiSelect = Object(mobx_react__WEBPACK_IMPORTED_MODULE_6__["observer"])(_class = (_temp = /*#__PURE__*/function (_React$Component) {
  _inherits(CheckboxedMultiSelect, _React$Component);

  var _super = _createSuper(CheckboxedMultiSelect);

  function CheckboxedMultiSelect(props) {
    var _this;

    _classCallCheck(this, CheckboxedMultiSelect);

    _this = _super.call(this, props);

    _this.clearSelect = function (e) {
      e.stopPropagation();

      _this.props.onChange([]);

      ;
    };

    _this.makeLabel = function (_ref3) {
      var placeholderButtonLabel = _ref3.placeholderButtonLabel,
          thisValue = _ref3.value;

      if (!thisValue) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(CountLabel, {
          clearable: false
        }, placeholderButtonLabel);
      }

      if (Array.isArray(thisValue)) {
        // don't count options with the option attribute noList: true
        var filteredValues = thisValue.filter(function (option) {
          return !option.noList;
        });

        if (filteredValues.length === 0) {
          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(CountLabel, {
            clearable: false
          }, placeholderButtonLabel);
        }

        if (filteredValues.length === 1) {
          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(CountLabel, {
            clearable: true,
            clearSelect: _this.clearSelect
          }, filteredValues[0].label);
        }

        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(CountLabel, {
          clearable: true,
          clearSelect: _this.clearSelect
        }, // # Translators: prefixed with a number, as in "4 selected" displayed on a multi-select
        "".concat(filteredValues.length, " ", gettext("selected")));
      }

      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(CountLabel, {
        clearable: false
      }, thisValue.label);
    };

    return _this;
  }

  _createClass(CheckboxedMultiSelect, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_multiselect_checkboxes__WEBPACK_IMPORTED_MODULE_3___default.a, _extends({}, this.props, {
        placeholder: // # Translators: placeholder text in a search box
        gettext("Search"),
        placeholderButtonLabel: this.props.placeholder,
        getDropdownButtonLabel: this.makeLabel,
        components: {
          MenuList: _virtualized_react_select__WEBPACK_IMPORTED_MODULE_2__["VirtualizedMenuList"],
          Group: Group
        }
      }));
    }
  }]);

  return CheckboxedMultiSelect;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp)) || _class;

/* harmony default export */ __webpack_exports__["default"] = (CheckboxedMultiSelect);

/***/ }),

/***/ "e0fF":
/*!*******************************************************!*\
  !*** ./js/pages/tola_management_pages/country/api.js ***!
  \*******************************************************/
/*! exports provided: fetchCountries, createCountry, updateCountry, fetchCountryObjectives, fetchCountryHistory, fetchCountryDisaggregations, createObjective, updateObjective, deleteObjective, createDisaggregation, updateDisaggregation, partialUpdateDisaggregation, deleteDisaggregation, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchCountries", function() { return fetchCountries; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createCountry", function() { return createCountry; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateCountry", function() { return updateCountry; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchCountryObjectives", function() { return fetchCountryObjectives; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchCountryHistory", function() { return fetchCountryHistory; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchCountryDisaggregations", function() { return fetchCountryDisaggregations; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createObjective", function() { return createObjective; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateObjective", function() { return updateObjective; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deleteObjective", function() { return deleteObjective; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createDisaggregation", function() { return createDisaggregation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateDisaggregation", function() { return updateDisaggregation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "partialUpdateDisaggregation", function() { return partialUpdateDisaggregation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deleteDisaggregation", function() { return deleteDisaggregation; });
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../api */ "XoI5");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


var fetchCountries = function fetchCountries(page, filters) {
  return _api__WEBPACK_IMPORTED_MODULE_0__["api"].get('/tola_management/country/', {
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
var createCountry = function createCountry(data) {
  return _api__WEBPACK_IMPORTED_MODULE_0__["api"].post('/tola_management/country/', data);
};
var updateCountry = function updateCountry(id, data) {
  return _api__WEBPACK_IMPORTED_MODULE_0__["api"].put("/tola_management/country/".concat(id, "/"), data);
};
var fetchCountryObjectives = function fetchCountryObjectives(countryId) {
  return _api__WEBPACK_IMPORTED_MODULE_0__["api"].get('/tola_management/countryobjective/', {
    params: {
      country: countryId
    }
  });
};
var fetchCountryHistory = function fetchCountryHistory(id) {
  return _api__WEBPACK_IMPORTED_MODULE_0__["api"].get("/tola_management/country/".concat(id, "/history/"));
};
var fetchCountryDisaggregations = function fetchCountryDisaggregations(countryId) {
  return _api__WEBPACK_IMPORTED_MODULE_0__["api"].get('/tola_management/countrydisaggregation/', {
    params: {
      country: countryId
    }
  });
};
var createObjective = function createObjective(data) {
  return _api__WEBPACK_IMPORTED_MODULE_0__["api"].post('/tola_management/countryobjective/', data);
};
var updateObjective = function updateObjective(id, data) {
  return _api__WEBPACK_IMPORTED_MODULE_0__["api"].put("/tola_management/countryobjective/".concat(id, "/"), data);
};
var deleteObjective = function deleteObjective(id) {
  return _api__WEBPACK_IMPORTED_MODULE_0__["api"]["delete"]("/tola_management/countryobjective/".concat(id));
};
var createDisaggregation = function createDisaggregation(data) {
  return _api__WEBPACK_IMPORTED_MODULE_0__["api"].post('/tola_management/countrydisaggregation/', data);
};
var updateDisaggregation = function updateDisaggregation(id, data) {
  return _api__WEBPACK_IMPORTED_MODULE_0__["api"].put("/tola_management/countrydisaggregation/".concat(id, "/"), data);
};
var partialUpdateDisaggregation = function partialUpdateDisaggregation(id, data) {
  return _api__WEBPACK_IMPORTED_MODULE_0__["api"].patch("/tola_management/countrydisaggregation/".concat(id, "/"), data);
};
var deleteDisaggregation = function deleteDisaggregation(id) {
  return _api__WEBPACK_IMPORTED_MODULE_0__["api"]["delete"]("/tola_management/countrydisaggregation/".concat(id));
};
/* harmony default export */ __webpack_exports__["default"] = ({
  fetchCountries: fetchCountries,
  fetchCountryObjectives: fetchCountryObjectives,
  fetchCountryHistory: fetchCountryHistory,
  fetchCountryDisaggregations: fetchCountryDisaggregations,
  createCountry: createCountry,
  updateCountry: updateCountry,
  createObjective: createObjective,
  updateObjective: updateObjective,
  deleteObjective: deleteObjective,
  createDisaggregation: createDisaggregation,
  updateDisaggregation: updateDisaggregation,
  partialUpdateDisaggregation: partialUpdateDisaggregation,
  deleteDisaggregation: deleteDisaggregation
});

/***/ }),

/***/ "hLpu":
/*!***********************************************************************************!*\
  !*** ./js/pages/tola_management_pages/country/components/edit_disaggregations.js ***!
  \***********************************************************************************/
/*! exports provided: CheckBoxList, RetroProgramCheckBoxWrapper, DisaggregationType, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CheckBoxList", function() { return CheckBoxList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RetroProgramCheckBoxWrapper", function() { return RetroProgramCheckBoxWrapper; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DisaggregationType", function() { return DisaggregationType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return EditDisaggregations; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx */ "2vnA");
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var react_beautiful_dnd__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-beautiful-dnd */ "ngQI");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! classnames */ "TSYQ");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ "IP2g");
/* harmony import */ var _components_helpPopover__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../components/helpPopover */ "4L+s");
/* harmony import */ var _components_changesetNotice__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../components/changesetNotice */ "4a4Y");
var _class, _temp, _class3, _class4, _temp2, _class6;

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

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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










var ErrorFeedback = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(function (_ref) {
  var errorMessages = _ref.errorMessages;

  if (!errorMessages) {
    return null;
  }

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "invalid-feedback"
  }, errorMessages.map(function (message, index) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      key: index
    }, message);
  }));
});

var CategoryForm = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class = (_temp = /*#__PURE__*/function (_React$Component) {
  _inherits(CategoryForm, _React$Component);

  var _super = _createSuper(CategoryForm);

  function CategoryForm(props) {
    var _this;

    _classCallCheck(this, CategoryForm);

    _this = _super.call(this, props);

    _this.componentDidMount = function () {
      if (_this.disabledRef.current) {
        $(_this.disabledRef.current).popover({
          html: true
        });
      }
    };

    _this.disabledRef = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createRef();
    return _this;
  }

  _createClass(CategoryForm, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          index = _this$props.index,
          category = _this$props.category,
          listLength = _this$props.listLength,
          props = _objectWithoutProperties(_this$props, ["index", "category", "listLength"]);

      var isInvalid = props.errors && props.errors.labels && props.errors.labels.length > index && props.errors.labels[index].hasOwnProperty('label') && props.errors.labels[index]['label'].length;
      var deletionElement = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        tabIndex: "0",
        onClick: function onClick() {
          return props.deleteLabel(index);
        },
        className: classnames__WEBPACK_IMPORTED_MODULE_4___default()("btn btn-link btn-danger text-nowrap", {
          'disabled': category.in_use
        })
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-trash"
      }), gettext('Remove'));

      if (props.disabled || category.in_use) {
        var _React$createElement;

        // In the case that there is only one category and it is in use or archived, preference the disabled
        // element over the null element
        deletionElement = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_helpPopover__WEBPACK_IMPORTED_MODULE_6__["default"], (_React$createElement = {
          key: 1,
          content: gettext('This category cannot be edited or removed because it was used to disaggregate a result.'),
          placement: "bottom",
          className: "btn btn-link",
          iconClass: "fa fa-lock text-muted"
        }, _defineProperty(_React$createElement, "className", "btn btn-link"), _defineProperty(_React$createElement, "innerRef", this.disabledRef), _defineProperty(_React$createElement, "ariaText", gettext('Explanation for absence of delete button')), _React$createElement));
      } else if (listLength === 1) {
        deletionElement = null;
      }

      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group col-md-7"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        value: category.label,
        onChange: function onChange(e) {
          return props.updateLabel(index, {
            label: e.target.value
          });
        },
        className: classnames__WEBPACK_IMPORTED_MODULE_4___default()("form-control", {
          "is-invalid": isInvalid
        }),
        disabled: category.in_use || props.disabled
      }), props.errors.labels && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ErrorFeedback, {
        errorMessages: props.errors.labels.length > index ? props.errors.labels[index]['label'] : null
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group col-md-2"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("select", {
        value: category.customsort,
        onChange: function onChange(e) {
          return props.updateLabelOrder(index, e.target.value - 1);
        },
        className: "form-control",
        disabled: props.disabled
      }, Array.from(Array(listLength).keys()).map(function (value) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
          value: value + 1,
          key: value
        }, value + 1);
      }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, deletionElement));
    }
  }]);

  return CategoryForm;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp)) || _class;

var DisaggregationCategoryList = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(function (_ref2) {
  var id = _ref2.id,
      categories = _ref2.categories,
      props = _objectWithoutProperties(_ref2, ["id", "categories"]);

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_beautiful_dnd__WEBPACK_IMPORTED_MODULE_3__["DragDropContext"], {
    onDragEnd: function onDragEnd(_ref3) {
      var _ref3$source = _ref3.source,
          s = _ref3$source === void 0 ? null : _ref3$source,
          _ref3$destination = _ref3.destination,
          d = _ref3$destination === void 0 ? null : _ref3$destination;
      s !== null && d !== null && props.updateLabelOrder(s.index, d.index);
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_beautiful_dnd__WEBPACK_IMPORTED_MODULE_3__["Droppable"], {
    droppableId: "disaggregation-category-list-".concat(id),
    renderClone: function renderClone(provided, snapshot, rubric) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", _extends({
        className: "form-group mb-0 disaggregation-label-group",
        ref: provided.innerRef
      }, provided.draggableProps), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", _extends({
        className: "draggable-arrow"
      }, provided.dragHandleProps), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-arrows-alt fa-lg"
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(CategoryForm, _extends({
        index: rubric.source.index,
        category: categories[rubric.source.index],
        listLength: categories.length
      }, props)));
    }
  }, function (provided, snapshot) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", _extends({
      ref: provided.innerRef
    }, provided.droppableProps), categories.map(function (category, index) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_beautiful_dnd__WEBPACK_IMPORTED_MODULE_3__["Draggable"], {
        draggableId: category.id == 'new' ? category.createdId : String(category.id),
        index: index,
        isDragDisabled: props.disabled,
        key: category.id == 'new' ? category.createdId : category.id
      }, function (provided, snapshot) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", _extends({
          className: "form-group mb-0 disaggregation-label-group",
          ref: provided.innerRef
        }, provided.draggableProps), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", _extends({
          className: "draggable-arrow"
        }, provided.dragHandleProps), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "fas fa-arrows-alt fa-lg"
        })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(CategoryForm, _extends({
          index: index,
          category: category,
          listLength: categories.length
        }, props)));
      });
    }), provided.placeholder);
  }));
});
var CheckBoxList = function CheckBoxList(props) {
  return props.checkBoxOptions.map(function (option) {
    var _option$checked;

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
      className: "mb-1",
      key: option.id
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
      type: "checkbox",
      className: "align-text-top",
      autoComplete: "false",
      name: option.name,
      value: option.name,
      checked: (_option$checked = option.checked) !== null && _option$checked !== void 0 ? _option$checked : false,
      onChange: function onChange(e) {
        return props.onUpdate(option.id, e.target.checked);
      }
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "ml-2"
    }, option.name));
  });
};
var RetroProgramCheckBoxWrapper = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class3 = /*#__PURE__*/function (_React$Component2) {
  _inherits(RetroProgramCheckBoxWrapper, _React$Component2);

  var _super2 = _createSuper(RetroProgramCheckBoxWrapper);

  function RetroProgramCheckBoxWrapper(props) {
    var _this2;

    _classCallCheck(this, RetroProgramCheckBoxWrapper);

    _this2 = _super2.call(this, props);
    _this2.retroactiveAssignmentPopup = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createRef();
    return _this2;
  }

  _createClass(RetroProgramCheckBoxWrapper, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.retroactiveAssignmentPopup.current) {
        $(this.retroactiveAssignmentPopup.current).popover({
          html: true
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var checkBoxOptions = Object.values(this.props.programs).sort(function (a, b) {
        return a.name < b.name ? -1 : 1;
      });
      var checkBoxComponent = null;

      if (this.props.programsExpanded) {
        checkBoxComponent = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          id: "disagg-admin__programs",
          className: "ml-2 mt-2 d-flex flex-column disaggregation-programs"
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(CheckBoxList, {
          checkBoxOptions: checkBoxOptions,
          onUpdate: this.props.onRetroUpdate
        }));
      } // # Translators: This is text provided when a user clicks a help link.  It allows users to select which elements they want to apply the changes to.


      var helpText = gettext('<p>Select a program if you plan to disaggregate all or most of its indicators by these categories.</p><p><span class="text-danger"><strong>This bulk assignment cannot be undone.</strong></span> But you can always manually remove the disaggregation from individual indicators.</p>');
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "mt-2 ml-4 retro-programs"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        onClick: this.props.toggleProgramViz,
        className: classnames__WEBPACK_IMPORTED_MODULE_4___default()('accordion-row__btn', 'btn', 'btn-link', 'disaggregation--programs__header', {
          disabled: this.props.disabled
        }),
        tabIndex: "0"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_5__["FontAwesomeIcon"], {
        icon: this.props.programsExpanded ? 'caret-down' : 'caret-right'
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "mr-1"
      }, gettext("Assign new disaggregation to all indicators in a program"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_helpPopover__WEBPACK_IMPORTED_MODULE_6__["default"], {
        key: 1,
        content: helpText,
        placement: "right",
        innerRef: this.retroactiveAssignmentPopup // # Translators: this is alt text for a help icon
        ,
        ariaText: gettext('More information on assigning disaggregations to existing indicators')
      }), checkBoxComponent);
    }
  }]);

  return RetroProgramCheckBoxWrapper;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component)) || _class3;
var DisaggregationType = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class4 = (_temp2 = /*#__PURE__*/function (_React$Component3) {
  _inherits(DisaggregationType, _React$Component3);

  var _super3 = _createSuper(DisaggregationType);

  function DisaggregationType(props) {
    var _this3;

    _classCallCheck(this, DisaggregationType);

    _this3 = _super3.call(this, props);

    _this3.componentDidUpdate = function () {
      /*
      This is a super ugly hack to fix a bug and avoid re-writing the state management of this component.
      Without this code block, if a new label is added and the form is saved, the id of "new"
      never gets replaced with the real id coming from the server.  So if the user tries to add
      another label and save, a validation error occurs because it looks like there are two
      new labels, one of which would be a duplicate.
       */
      if (_this3.state.labels) {
        var labelMap = _this3.props.disaggregation.labels.reduce(function (accum, labelObj) {
          accum[labelObj.label] = labelObj.id;
          return accum;
        }, {});

        var a = new Set(Object.keys(labelMap));

        if (a.size === _this3.state.labels.length) {
          _this3.state.labels.forEach(function (labelInState) {
            if (labelInState.id === "new") {
              if (Object.keys(labelMap).includes(labelInState.label)) {
                labelInState.id = labelMap[labelInState.label];
              }
            }
          });
        }
      }

      if (_this3.selectedByDefaultPopup.current) {
        $(_this3.selectedByDefaultPopup.current).popover({
          html: true
        });
      }
    };

    var disaggregation = _this3.props.disaggregation;
    _this3.state = _objectSpread(_objectSpread({}, disaggregation), {}, {
      labels: _this3.orderLabels(disaggregation.labels),
      programsExpanded: false
    });
    _this3.programsForRetro = Object(mobx__WEBPACK_IMPORTED_MODULE_1__["observable"])(props.programs.reduce(function (accum, program) {
      accum[program.id] = {
        id: program.id,
        name: program.name,
        checked: false
      };
      return accum;
    }, {}));
    _this3.labelsCreated = 0;
    _this3.selectedByDefaultPopup = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createRef();
    return _this3;
  }

  _createClass(DisaggregationType, [{
    key: "orderLabels",
    value: function orderLabels(labels) {
      return labels.slice().map(function (label, index) {
        return _objectSpread(_objectSpread({}, label), {}, {
          customsort: index + 1
        });
      });
    }
  }, {
    key: "hasUnsavedDataAction",
    value: function hasUnsavedDataAction() {
      var labels = this.props.disaggregation.labels.map(function (x) {
        return _objectSpread({}, x);
      });
      var changedDisaggs = JSON.stringify(this.state) !== JSON.stringify(_objectSpread(_objectSpread({}, this.props.disaggregation), {}, {
        labels: _toConsumableArray(labels)
      }));
      var changedRetro = Object.values(this.programsForRetro).some(function (programObj) {
        return programObj.checked;
      });
      this.props.onIsDirtyChange(changedDisaggs || changedRetro);
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      $('[data-toggle="popover"]').popover();
    }
  }, {
    key: "resetForm",
    value: function resetForm() {
      var _this4 = this;

      this.props.clearErrors();
      this.setState(_objectSpread(_objectSpread({}, this.props.disaggregation), {}, {
        labels: this.orderLabels(this.props.disaggregation.labels)
      }), function () {
        return _this4.hasUnsavedDataAction();
      });
    }
  }, {
    key: "formErrors",
    value: function formErrors(fieldKey) {
      return this.props.errors[fieldKey];
    }
  }, {
    key: "updateDisaggregationTypeField",
    value: function updateDisaggregationTypeField(value) {
      var _this5 = this;

      this.setState({
        disaggregation_type: value
      }, function () {
        return _this5.hasUnsavedDataAction();
      });
    }
  }, {
    key: "updateSelectedByDefault",
    value: function updateSelectedByDefault(checked) {
      var _this6 = this;

      if (checked !== true) {
        this.clearCheckedPrograms();
        this.togglePrograms();
      }

      this.setState({
        selected_by_default: checked == true
      }, function () {
        return _this6.hasUnsavedDataAction();
      });
    }
  }, {
    key: "updateRetroPrograms",
    value: function updateRetroPrograms(id, checked) {
      var _this7 = this;

      Object(mobx__WEBPACK_IMPORTED_MODULE_1__["runInAction"])(function () {
        _this7.programsForRetro[id]['checked'] = checked;
      });
      this.hasUnsavedDataAction();
    }
  }, {
    key: "togglePrograms",
    value: function togglePrograms() {
      this.setState({
        programsExpanded: !this.state.programsExpanded
      });
    }
  }, {
    key: "clearCheckedPrograms",
    value: function clearCheckedPrograms() {
      var _loop = function _loop() {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
            key = _Object$entries$_i[0],
            value = _Object$entries$_i[1];

        Object(mobx__WEBPACK_IMPORTED_MODULE_1__["runInAction"])(function () {
          return value.checked = false;
        });
      };

      for (var _i = 0, _Object$entries = Object.entries(this.programsForRetro); _i < _Object$entries.length; _i++) {
        _loop();
      }
    }
  }, {
    key: "updateLabel",
    value: function updateLabel(labelIndex, updatedValues) {
      var _this8 = this;

      var labels = this.state.labels;
      labels[labelIndex] = _objectSpread(_objectSpread({}, labels[labelIndex]), updatedValues);
      this.setState({
        labels: this.orderLabels(labels)
      }, function () {
        return _this8.hasUnsavedDataAction();
      });
    }
  }, {
    key: "updateLabelOrder",
    value: function updateLabelOrder(oldIndex, newIndex) {
      var _this9 = this;

      var labels = this.state.labels;
      var remainingLabels = [].concat(_toConsumableArray(labels.slice(0, oldIndex)), _toConsumableArray(labels.slice(oldIndex + 1)));
      var reorderedLabels = this.orderLabels([].concat(_toConsumableArray(remainingLabels.slice(0, newIndex)), [labels[oldIndex]], _toConsumableArray(remainingLabels.slice(newIndex))));
      this.setState({
        labels: reorderedLabels
      }, function () {
        return _this9.hasUnsavedDataAction();
      });
      this.props.assignLabelErrors({
        labels: reorderedLabels
      });
    }
  }, {
    key: "appendLabel",
    value: function appendLabel() {
      var _this10 = this;

      this.labelsCreated += 1;
      var newLabel = {
        id: 'new',
        label: '',
        createdId: "new-".concat(this.labelsCreated)
      };
      this.setState({
        labels: this.orderLabels([].concat(_toConsumableArray(this.state.labels), [newLabel]))
      }, function () {
        $('.disaggregation-label-group').last().find('input').first().focus();

        _this10.hasUnsavedDataAction();
      });
    }
  }, {
    key: "deleteLabel",
    value: function deleteLabel(labelIndex) {
      var _this11 = this;

      var updatedLabels = this.orderLabels([].concat(_toConsumableArray(this.state.labels.slice(0, labelIndex)), _toConsumableArray(this.state.labels.slice(labelIndex + 1))));
      this.setState({
        labels: updatedLabels
      }, function () {
        return _this11.hasUnsavedDataAction();
      });
      this.props.assignLabelErrors({
        labels: updatedLabels
      });
    }
  }, {
    key: "save",
    value: function save() {
      var savedData = _objectSpread({}, this.state);

      delete savedData.programsExpanded;
      var retroPrograms = Object.values(this.programsForRetro).filter(function (program) {
        return program.checked;
      });

      if (retroPrograms.length > 0) {
        savedData['retroPrograms'] = retroPrograms.map(function (programObj) {
          return programObj.id;
        });
      }

      this.props.saveDisaggregation(savedData);
    }
  }, {
    key: "render",
    value: function render() {
      var _this12 = this;

      var _this$props2 = this.props,
          disaggregation = _this$props2.disaggregation,
          expanded = _this$props2.expanded,
          expandAction = _this$props2.expandAction,
          deleteAction = _this$props2.deleteAction,
          archiveAction = _this$props2.archiveAction,
          unarchiveAction = _this$props2.unarchiveAction,
          errors = _this$props2.errors;
      var managed_data = this.state;
      var retroPrograms = managed_data.id === "new" ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(RetroProgramCheckBoxWrapper, {
        programs: this.programsForRetro,
        disabled: this.state.selected_by_default !== true,
        toggleProgramViz: this.togglePrograms.bind(this),
        programsExpanded: this.state.programsExpanded,
        onRetroUpdate: this.updateRetroPrograms.bind(this)
      }) : null;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "accordion-row"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "accordion-row__content"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        onClick: function onClick() {
          expandAction(_this12.resetForm.bind(_this12));
        },
        className: "btn accordion-row__btn btn-link",
        tabIndex: "0"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_5__["FontAwesomeIcon"], {
        icon: expanded ? 'caret-down' : 'caret-right'
      }), disaggregation.id === 'new' ? "New disaggregation" : disaggregation.disaggregation_type), disaggregation.is_archived && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "text-muted font-weight-bold ml-2"
      }, "(Archived)"), expanded && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("form", {
        className: "form card card-body bg-white"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "label--required",
        htmlFor: "disaggregation-type-input"
      }, gettext('Disaggregation')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        id: "disaggregation-type-input",
        className: classnames__WEBPACK_IMPORTED_MODULE_4___default()('form-control', {
          'is-invalid': this.formErrors('disaggregation_type')
        }),
        value: managed_data.disaggregation_type,
        onChange: function onChange(e) {
          return _this12.updateDisaggregationTypeField(e.target.value);
        },
        type: "text",
        required: true,
        disabled: disaggregation.is_archived
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ErrorFeedback, {
        errorMessages: this.formErrors('disaggregation_type')
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-check",
        style: {
          marginTop: '8px'
        }
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        className: "form-check-input",
        type: "checkbox",
        checked: managed_data.selected_by_default,
        onChange: function onChange(e) {
          _this12.updateSelectedByDefault(e.target.checked);
        },
        id: "selected-by-default-checkbox",
        disabled: disaggregation.is_archived
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "form-check-label mr-2",
        htmlFor: "selected-by-default-checkbox"
      }, // # Translators: This labels a checkbox, when checked, it will make the associated item "on" (selected) for all new indicators
      gettext('Selected by default')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_helpPopover__WEBPACK_IMPORTED_MODULE_6__["default"], {
        key: 1 // # Translators: Help text for the "selected by default" checkbox on the disaggregation form
        ,
        content: "<p>".concat(interpolate(gettext('When adding a new program indicator, this disaggregation will be selected by default for every program in %s. The disaggregation can be manually removed from an indicator on the indicator setup form.'), [gettext(this.props.countryName)]), "</p>"),
        placement: "right",
        innerRef: this.selectedByDefaultPopup,
        ariaText: gettext('More information on "selected by default"')
      })), retroPrograms), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group",
        style: {
          marginTop: '8px'
        }
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "row"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "col-md-7"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h4", null, gettext('Categories'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        style: {
          marginLeft: '38px'
        }
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", null, gettext('Order')))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(DisaggregationCategoryList, {
        id: disaggregation.id,
        categories: this.state.labels,
        disabled: disaggregation.is_archived,
        updateLabelOrder: this.updateLabelOrder.bind(this),
        updateLabel: this.updateLabel.bind(this),
        deleteLabel: this.deleteLabel.bind(this),
        errors: errors
      }), !disaggregation.is_archived && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        style: {
          marginTop: '-15px',
          marginLeft: '-5px'
        }
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        tabIndex: "0",
        onClick: function onClick() {
          return _this12.appendLabel();
        },
        className: "btn btn-link btn-add"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-plus-circle"
      }), gettext('Add a category')))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "disaggregation-form-buttons"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-row btn-row"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-primary",
        onClick: function onClick(e) {
          return _this12.save();
        },
        disabled: disaggregation.is_archived,
        type: "button"
      }, gettext('Save Changes')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-reset",
        type: "button",
        onClick: function onClick() {
          return _this12.resetForm();
        } // # Translators:  Button label.  Allows users to undo whatever changes they have made.
        ,
        disabled: disaggregation.is_archived
      }, gettext('Reset'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "right-buttons"
      }, disaggregation.is_archived ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        tabIndex: "0",
        onClick: unarchiveAction,
        className: "btn btn-link"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-archive"
      }), // # Translators: this is a verb (on a button that archives the selected item)
      gettext('Unarchive disaggregation')) : disaggregation.id == 'new' || !disaggregation.has_indicators ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        tabIndex: "0",
        onClick: deleteAction,
        className: "btn btn-link btn-danger"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-trash"
      }), gettext('Delete disaggregation')) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        tabIndex: "0",
        onClick: archiveAction,
        className: "btn btn-link"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-archive"
      }), // # Translators: this is a verb (on a button that archives the selected item)
      gettext('Archive disaggregation')))))));
    }
  }]);

  return DisaggregationType;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp2)) || _class4;

var EditDisaggregations = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class6 = /*#__PURE__*/function (_React$Component4) {
  _inherits(EditDisaggregations, _React$Component4);

  var _super4 = _createSuper(EditDisaggregations);

  function EditDisaggregations(props) {
    var _this13;

    _classCallCheck(this, EditDisaggregations);

    _this13 = _super4.call(this, props);
    _this13.state = {
      expanded_id: null,
      is_dirty: false,
      formReset: null,
      origSelectedByDefault: false
    };
    return _this13;
  }

  _createClass(EditDisaggregations, [{
    key: "handleDirtyUpdate",
    value: function handleDirtyUpdate(is_dirty) {
      this.setState({
        is_dirty: is_dirty
      });
      this.props.onIsDirtyChange(is_dirty);
    }
  }, {
    key: "dirtyConfirm",
    value: function dirtyConfirm() {
      return !this.state.is_dirty || this.state.is_dirty && confirm(gettext("You have unsaved changes. Are you sure you want to discard them?"));
    }
  }, {
    key: "toggleExpand",
    value: function toggleExpand(id, formReset) {
      this.props.clearErrors();

      if (this.dirtyConfirm()) {
        var expanded_id = this.state.expanded_id;

        if (id == expanded_id) {
          this.state.is_dirty && formReset && formReset();
          this.setState({
            expanded_id: null,
            formReset: null,
            origSelectedByDefault: null
          });
        } else {
          if (this.state.formReset) {
            this.state.is_dirty && this.state.formReset();
          }

          var currentDisaggList = this.props.disaggregations.filter(function (disagg) {
            return disagg.id === id;
          });
          var selectedByDefault = currentDisaggList.length > 0 ? currentDisaggList[0].selected_by_default : null;
          this.setState({
            expanded_id: id,
            formReset: formReset,
            origSelectedByDefault: selectedByDefault
          });
        }

        if (expanded_id === 'new') {
          this.onDelete(expanded_id);
        }

        this.handleDirtyUpdate(false);
      }
    }
  }, {
    key: "addDisaggregation",
    value: function addDisaggregation() {
      if (this.dirtyConfirm()) {
        this.props.addDisaggregation();
        this.setState({
          expanded_id: 'new',
          origSelectedByDefault: false
        }, function () {
          $('#disaggregation-type-input').focus();
        });
      }
    }
  }, {
    key: "onDelete",
    value: function onDelete(id) {
      var _this14 = this;

      this.props.onDelete(id, function () {
        _this14.setState({
          is_dirty: false,
          expanded_id: null,
          formReset: null
        });
      });
      this.props.clearErrors();
    }
  }, {
    key: "onSaveChangesPress",
    value: function onSaveChangesPress(data) {
      var _this15 = this;

      if (this.state.origSelectedByDefault !== data.selected_by_default) {
        var preamble = "";

        if (data.selected_by_default && data.hasOwnProperty('retroPrograms')) {
          // # Translators:  This is a warning popup when the user tries to do something that has broader effects than they might anticipate
          preamble = interpolate(ngettext( // # Translators:  Warning message about how the new type of disaggregation the user has created will be applied to existing and new data
          "This disaggregation will be automatically selected for all new indicators in %s and for existing indicators in %s program.", "This disaggregation will be automatically selected for all new indicators in %s and for existing indicators in %s programs.", data.retroPrograms.length), [gettext(this.props.countryName), data.retroPrograms.length]);
        } else if (data.selected_by_default) {
          // # Translators:  This is a warning popup when the user tries to do something that has broader effects than they might anticipate
          preamble = interpolate(gettext("This disaggregation will be automatically selected for all new indicators in %s. Existing indicators will be unaffected."), [gettext(this.props.countryName)]);
        } else {
          // # Translators:  This is a warning popup when the user tries to do something that has broader effects than they might anticipate
          preamble = interpolate(gettext("This disaggregation will no longer be automatically selected for all new indicators in %s. Existing indicators will be unaffected."), [this.props.countryName]);
        }

        Object(_components_changesetNotice__WEBPACK_IMPORTED_MODULE_7__["create_unified_changeset_notice"])({
          header: gettext("Warning"),
          show_icon: true,
          preamble: preamble,
          // # Translators: This is the prompt on a popup that has warned users about a change they are about to make that could have broad consequences
          message_text: gettext("Are you sure you want to continue?"),
          notice_type: "notice",
          showCloser: true,
          on_submit: function on_submit() {
            return _this15.saveDisaggregation(data);
          },
          on_cancel: function on_cancel() {}
        });
      } else {
        this.saveDisaggregation(data);
      }
    }
  }, {
    key: "saveDisaggregation",
    value: function saveDisaggregation(data) {
      var _this16 = this;

      var withCountry = Object.assign(data, {
        country: this.props.country_id
      });

      if (data.id === 'new') {
        this.props.onCreate(withCountry).then(function (newDisaggregation) {
          _this16.setState({
            expanded_id: newDisaggregation.id,
            formReset: null,
            origSelectedByDefault: data.selected_by_default
          });
        }, function () {});
      } else {
        this.props.onUpdate(data.id, withCountry);
        this.setState({
          origSelectedByDefault: data.selected_by_default
        });
      }

      this.setState({
        is_dirty: false
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this17 = this;

      var disaggregations = this.props.disaggregations;
      var expanded_id = this.state.expanded_id;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "tab-pane--react"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "d-flex justify-content-between"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h3", null, gettext('Country Disaggregations')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, !disaggregations.find(function (d) {
        return d.id == 'new';
      }) && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        tabIndex: "0",
        className: "btn btn-link btn-add",
        onClick: function onClick() {
          return _this17.addDisaggregation();
        }
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-plus-circle"
      }), gettext("Add country disaggregation")))), disaggregations.map(function (disaggregation) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(DisaggregationType, {
          key: disaggregation.id,
          disaggregation: disaggregation,
          programs: _this17.props.programs,
          expanded: disaggregation.id == expanded_id,
          assignLabelErrors: _this17.props.assignLabelErrors,
          expandAction: function expandAction(callback) {
            return _this17.toggleExpand(disaggregation.id, callback);
          },
          updateLabel: function updateLabel(labelIndex, value) {
            return _this17.updateLabel(disaggregation.id, labelIndex, value);
          },
          deleteAction: _this17.onDelete.bind(_this17, disaggregation.id),
          archiveAction: function archiveAction() {
            return _this17.props.onArchive(disaggregation.id);
          },
          unarchiveAction: function unarchiveAction() {
            return _this17.props.onUnarchive(disaggregation.id);
          },
          saveDisaggregation: function saveDisaggregation(data) {
            return _this17.onSaveChangesPress(data);
          },
          errors: _this17.props.errors,
          clearErrors: _this17.props.clearErrors,
          onIsDirtyChange: function onIsDirtyChange(is_dirty) {
            return _this17.handleDirtyUpdate(is_dirty);
          },
          countryName: _this17.props.countryName
        });
      }));
    }
  }]);

  return EditDisaggregations;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component)) || _class6;



/***/ }),

/***/ "micH":
/*!*****************************************************************************!*\
  !*** ./js/pages/tola_management_pages/country/components/country_editor.js ***!
  \*****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return CountryEditor; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ "TSYQ");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);
var _class;

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





var CountryEditor = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class = /*#__PURE__*/function (_React$Component) {
  _inherits(CountryEditor, _React$Component);

  var _super = _createSuper(CountryEditor);

  function CountryEditor() {
    _classCallCheck(this, CountryEditor);

    return _super.apply(this, arguments);
  }

  _createClass(CountryEditor, [{
    key: "updateActivePage",
    value: function updateActivePage(new_page) {
      if (!this.props["new"]) {
        this.props.notifyPaneChange(new_page);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;

      var _this$props = this.props,
          ProfileSection = _this$props.ProfileSection,
          StrategicObjectiveSection = _this$props.StrategicObjectiveSection,
          DisaggregationSection = _this$props.DisaggregationSection,
          HistorySection = _this$props.HistorySection,
          active_pane = _this$props.active_pane;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "tab-set--vertical"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", {
        className: "nav nav-tabs"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
        className: "nav-item"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        className: classnames__WEBPACK_IMPORTED_MODULE_2___default()('nav-link', {
          'active': active_pane == 'profile'
        }),
        onClick: function onClick(e) {
          e.preventDefault();

          _this.updateActivePage('profile');
        }
      }, gettext("Profile"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
        className: "nav-item"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        className: classnames__WEBPACK_IMPORTED_MODULE_2___default()('nav-link', {
          'active': active_pane == 'objectives',
          'disabled': this.props["new"]
        }),
        onClick: function onClick(e) {
          e.preventDefault();

          _this.updateActivePage('objectives');
        }
      }, gettext("Strategic Objectives"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
        className: "nav-item"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        className: classnames__WEBPACK_IMPORTED_MODULE_2___default()('nav-link', {
          'active': active_pane == 'disaggregations',
          'disabled': this.props["new"]
        }),
        onClick: function onClick(e) {
          e.preventDefault();

          _this.updateActivePage('disaggregations');
        }
      }, gettext("Country Disaggregations"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
        className: "nav-item"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        className: classnames__WEBPACK_IMPORTED_MODULE_2___default()('nav-link', {
          'active': active_pane == 'history',
          'disabled': this.props["new"]
        }),
        onClick: function onClick(e) {
          e.preventDefault();

          _this.updateActivePage('history');
        }
      }, gettext("History")))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "tab-content"
      }, active_pane == 'profile' && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ProfileSection, null), active_pane == 'objectives' && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(StrategicObjectiveSection, null), active_pane == 'disaggregations' && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(DisaggregationSection, null), active_pane == 'history' && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(HistorySection, null)));
    }
  }]);

  return CountryEditor;
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
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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


/* Sidebar expando/collapso mimicking bootstrap behavior
 * CSS in components/_folding_sidebar.scss
 * Usage: <FoldingSidebar>
 *          children to be hidden when toggle is clicked
 *         </FoldingSidebar>
 */

var FoldingSidebar = /*#__PURE__*/function (_React$Component) {
  _inherits(FoldingSidebar, _React$Component);

  var _super = _createSuper(FoldingSidebar);

  function FoldingSidebar(props) {
    var _this;

    _classCallCheck(this, FoldingSidebar);

    _this = _super.call(this, props);

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
    _this.contentsContainer = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createRef();
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
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", _extends({
        className: "folding-sidebar " + (className || '')
      }, props), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "folding-sidebar__contents",
        onTransitionEnd: function onTransitionEnd() {
          return _this2.foldComplete();
        },
        ref: this.contentsContainer,
        style: {
          width: width,
          overflow: overflow
        }
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, this.props.children)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "folding-sidebar__trigger",
        onClick: function onClick() {
          return _this2.toggleFolded();
        }
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        key: icon
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "fa " + icon
      }))));
    }
  }]);

  return FoldingSidebar;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

/* harmony default export */ __webpack_exports__["default"] = (FoldingSidebar);

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

},[["NlW9","runtime","vendors"]]]);
//# sourceMappingURL=tola_management_country-13acbd9c7daf682abc7d.js.map