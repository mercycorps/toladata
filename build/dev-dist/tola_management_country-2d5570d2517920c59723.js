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
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }













var CountryFilter = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref) {
  var store = _ref.store,
      filterOptions = _ref.filterOptions;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "form-group react-multiselect-checkbox"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    htmlFor: "countries_filter"
  }, gettext("Countries")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_checkboxed_multi_select__WEBPACK_IMPORTED_MODULE_2__["default"], {
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
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "form-group react-multiselect-checkbox"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    htmlFor: "organizations_filter"
  }, gettext("Organizations")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_checkboxed_multi_select__WEBPACK_IMPORTED_MODULE_2__["default"], {
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
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "form-group react-multiselect-checkbox"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    htmlFor: "programs-filter"
  }, gettext("Programs")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_checkboxed_multi_select__WEBPACK_IMPORTED_MODULE_2__["default"], {
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
  var countryFilterOptions = store.allCountries.map(function (country) {
    return {
      value: country.id,
      label: country.country
    };
  });
  var organizationFilterOptions = Object.entries(store.organizations).map(function (_ref5) {
    var _ref6 = _slicedToArray(_ref5, 2),
        id = _ref6[0],
        org = _ref6[1];

    return {
      value: org.id,
      label: org.name
    };
  });
  var programFilterOptions = Object.entries(store.allPrograms).map(function (_ref7) {
    var _ref8 = _slicedToArray(_ref7, 2),
        id = _ref8[0],
        program = _ref8[1];

    return {
      value: program.id,
      label: program.name
    };
  });
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    id: "country-management-index-view",
    className: "row"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_folding_sidebar__WEBPACK_IMPORTED_MODULE_10__["default"], null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "filter-section"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(OrganizationFilter, {
    store: store,
    filterOptions: organizationFilterOptions
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ProgramFilter, {
    store: store,
    filterOptions: programFilterOptions
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(CountryFilter, {
    store: store,
    filterOptions: countryFilterOptions
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
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h1", null, gettext("Admin:"), " ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("small", null, gettext("Countries")))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "admin-list__controls"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "controls__bulk-actions"
  }), store.is_superuser && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "controls__buttons"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
    href: "#",
    tabIndex: "0",
    className: "btn btn-link btn-add",
    onClick: function onClick() {
      return store.addCountry();
    }
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
    className: "fas fa-plus-circle"
  }), gettext("Add Country")))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_loading_spinner__WEBPACK_IMPORTED_MODULE_9__["default"], {
    isLoading: store.fetching_main_listing || store.applying_bulk_updates
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "admin-list__table"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_management_table__WEBPACK_IMPORTED_MODULE_3__["default"], {
    newData: store.new_country,
    data: store.countries,
    keyField: "id",
    HeaderRow: function HeaderRow(_ref9) {
      var Col = _ref9.Col,
          Row = _ref9.Row;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Row, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, {
        size: ".2"
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, {
        size: "2",
        className: "td--stretch"
      }, gettext("Country")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, null, gettext("Organizations")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, null, gettext("Programs")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, null, gettext("Users")));
    },
    Row: function Row(_ref10) {
      var Col = _ref10.Col,
          Row = _ref10.Row,
          data = _ref10.data;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Row, {
        expanded: data.id == store.editing_target,
        Expando: Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref11) {
          var Wrapper = _ref11.Wrapper;
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Wrapper, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_country_editor__WEBPACK_IMPORTED_MODULE_5__["default"], {
            notifyPaneChange: function notifyPaneChange(new_pane) {
              return store.onProfilePaneChange(new_pane);
            },
            active_pane: store.active_editor_pane,
            new: data.id == 'new',
            ProfileSection: Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function () {
              return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_loading_spinner__WEBPACK_IMPORTED_MODULE_9__["default"], {
                isLoading: store.fetching_editing_data || store.saving
              }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_edit_country_profile__WEBPACK_IMPORTED_MODULE_6__["default"], {
                new: data.id == 'new',
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
              return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_loading_spinner__WEBPACK_IMPORTED_MODULE_9__["default"], {
                isLoading: store.fetching_editing_data || store.saving
              }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_edit_objectives__WEBPACK_IMPORTED_MODULE_8__["default"], {
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
              return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_loading_spinner__WEBPACK_IMPORTED_MODULE_9__["default"], {
                isLoading: store.fetching_editing_data || store.saving
              }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_edit_disaggregations__WEBPACK_IMPORTED_MODULE_7__["default"], {
                country_id: data.id,
                disaggregations: store.editing_disaggregations_data,
                addDisaggregation: function addDisaggregation() {
                  return store.addDisaggregation();
                },
                onDelete: function onDelete(id) {
                  return store.deleteDisaggregation(id);
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
            fetchObjectives: function fetchObjectives(countryId) {
              return store.fetchObjectives(countryId);
            }
          }));
        })
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, {
        size: "0.2"
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, {
        size: "2",
        className: "td--stretch"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "expando-toggle icon__clickable",
        onClick: function onClick() {
          return store.toggleEditingTarget(data.id);
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "expando-toggle__icon"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_11__["FontAwesomeIcon"], {
        icon: store.editing_target == data.id ? 'caret-down' : 'caret-right'
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "expando-toggle__label"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-globe"
      }), "\xA0", data.country || "---"))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, {
        className: "text-nowrap"
      }, data.organizations.length ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "/tola_management/organization/?countries[]=".concat(data.id)
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-building"
      }), "\xA0", data.organizations.length, " ", gettext("Organizations")) : '---'), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, {
        className: "text-nowrap"
      }, data.programCount ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "/tola_management/program/?countries[]=".concat(data.id)
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-cubes"
      }), "\xA0", data.programCount, " ", gettext("Programs")) : "---"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, {
        className: "text-nowrap"
      }, data.user_count ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "/tola_management/user/?countries[]=".concat(data.id)
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-users"
      }), "\xA0", data.user_count, " ", gettext("Users")) : '---'));
    }
  }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "admin-list__metadata"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "metadata__count text-muted text-small"
  }, store.country_count ? "".concat(store.country_count, " ").concat(gettext("countries")) : "---"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "metadata__controls"
  }, store.total_pages && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_pagination__WEBPACK_IMPORTED_MODULE_4__["default"], {
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
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-select */ "y2Vs");
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! classnames */ "TSYQ");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_3__);
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

var EditCountryProfile = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class =
/*#__PURE__*/
function (_React$Component) {
  _inherits(EditCountryProfile, _React$Component);

  function EditCountryProfile(props) {
    var _this;

    _classCallCheck(this, EditCountryProfile);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(EditCountryProfile).call(this, props));
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
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "tab-pane--react"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("form", {
        className: "form"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        htmlFor: "country-name-input"
      }, gettext("Country name"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "required"
      }, "*")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
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
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ErrorFeedback, {
        errorMessages: this.formErrors('country')
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        htmlFor: "country-description-input"
      }, gettext("Description")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("textarea", {
        value: formdata.description,
        onChange: function onChange(e) {
          return _this4.updateFormField('description', e.target.value);
        },
        className: classnames__WEBPACK_IMPORTED_MODULE_3___default()('form-control', {
          'is-invalid': this.formErrors('description')
        }),
        id: "country-description-input"
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ErrorFeedback, {
        errorMessages: this.formErrors('description')
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        htmlFor: "country-code-input"
      }, gettext("Country Code")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        value: formdata.code,
        onChange: function onChange(e) {
          return _this4.updateFormField('code', e.target.value);
        },
        className: classnames__WEBPACK_IMPORTED_MODULE_3___default()('form-control', {
          'is-invalid': this.formErrors('code')
        }),
        id: "country-code-input"
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ErrorFeedback, {
        errorMessages: this.formErrors('code')
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

  return EditCountryProfile;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component)) || _class;



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
var _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, _descriptor25, _descriptor26, _descriptor27, _temp;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

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


var new_objective_data = {
  id: 'new',
  name: '',
  description: '',
  status: ''
};
var CountryStore = (_class = (_temp =
/*#__PURE__*/
function () {
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

    _initializerDefineProperty(this, "saving", _descriptor23, this);

    _initializerDefineProperty(this, "bulk_targets", _descriptor24, this);

    _initializerDefineProperty(this, "applying_bulk_updates", _descriptor25, this);

    _initializerDefineProperty(this, "bulk_targets_all", _descriptor26, this);

    _initializerDefineProperty(this, "active_editor_pane", _descriptor27, this);

    this.active_pane_is_dirty = false;
    this;
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
    }
  }, {
    key: "clearFilters",
    value: function clearFilters() {
      var clearFilters = {
        countries: [],
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
        if (this.editing_target == 'new') {
          this.countries.shift();
          this.editing_errors = {};
        }

        this.active_editor_pane = 'profile';
        this.active_pane_is_dirty = false;

        if (this.editing_target == id) {
          this.editing_target = false;
          this.editing_errors = {};
        } else {
          this.editing_target = id;
          this.fetching_editing_data = true;
          Promise.all([this.api.fetchCountryObjectives(id), this.api.fetchCountryDisaggregations(id)]).then(function (_ref3) {
            var _ref4 = _slicedToArray(_ref3, 2),
                objectives_resp = _ref4[0],
                disaggregations_resp = _ref4[1];

            Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
              _this2.fetching_editing_data = false;
              _this2.editing_objectives_data = objectives_resp.data;
              _this2.editing_disaggregations_data = disaggregations_resp.data;
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
    key: "onSaveSuccessHandler",
    value: function onSaveSuccessHandler() {
      PNotify.success({
        text: gettext("Successfully Saved"),
        delay: 5000
      });
    }
  }, {
    key: "onSaveErrorHandler",
    value: function onSaveErrorHandler(message) {
      PNotify.error({
        text: message || gettext("Saving Failed"),
        delay: 5000
      });
    }
  }, {
    key: "onDeleteSuccessHandler",
    value: function onDeleteSuccessHandler() {
      PNotify.success({
        text: gettext("Successfully Deleted"),
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
      var _this3 = this;

      country_data.id = null;
      this.saving = true;
      this.api.createCountry(country_data).then(function (response) {
        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this3.saving = false;
          _this3.editing_errors = {};
          _this3.editing_target = response.data.id;
          _this3.active_pane_is_dirty = false;

          _this3.countries.shift();

          _this3.countries.unshift(response.data);

          _this3.allCountries.unshift(response.data);

          _this3.onSaveSuccessHandler();
        });
      }).catch(function (errors) {
        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this3.saving = false;
          _this3.editing_errors = errors.response.data;

          _this3.onSaveErrorHandler(errors.response.data.detail);
        });
      });
    }
  }, {
    key: "updateCountry",
    value: function updateCountry(id, country_data) {
      var _this4 = this;

      this.saving = true;
      this.api.updateCountry(id, country_data).then(function (response) {
        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this4.saving = false;
          _this4.editing_errors = {};
          _this4.active_pane_is_dirty = false;

          _this4.updateLocalList(response.data);

          _this4.onSaveSuccessHandler();
        });
      }).catch(function (errors) {
        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this4.saving = false;
          _this4.editing_errors = errors.response.data;

          _this4.onSaveErrorHandler(errors.response.data.detail);
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
      var _this5 = this;

      this.editing_objectives_errors = {};
      this.api.updateObjective(id, data).then(function (response) {
        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this5.onSaveSuccessHandler();

          var updatedObjective = response.data;
          _this5.active_pane_is_dirty = false;
          _this5.editing_objectives_data = _this5.editing_objectives_data.map(function (objective) {
            if (objective.id == updatedObjective.id) {
              return updatedObjective;
            }

            return objective;
          });
        });
      }).catch(function (errors) {
        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this5.saving = false;
          _this5.editing_objectives_errors = errors.response.data;

          _this5.onSaveErrorHandler(errors.response.data.detail);
        });
      });
    }
  }, {
    key: "createObjective",
    value: function createObjective(data) {
      var _this6 = this;

      this.editing_objectives_errors = {};
      this.api.createObjective(data).then(function (response) {
        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this6.onSaveSuccessHandler();

          _this6.active_pane_is_dirty = false;
          var newObjective = response.data;
          _this6.editing_objectives_data = [].concat(_toConsumableArray(_this6.editing_objectives_data.filter(function (objective) {
            return objective.id != 'new';
          })), [newObjective]);
        });
      }).catch(function (errors) {
        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this6.saving = false;
          _this6.editing_objectives_errors = errors.response.data;

          _this6.onSaveErrorHandler(errors.response.data.detail);
        });
      });
    }
  }, {
    key: "deleteObjective",
    value: function deleteObjective(id) {
      var _this7 = this;

      if (id == 'new') {
        this.editing_objectives_data = this.editing_objectives_data.filter(function (objective) {
          return objective.id != 'new';
        });
        return;
      }

      this.api.deleteObjective(id).then(function (response) {
        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this7.editing_objectives_data = _this7.editing_objectives_data.filter(function (objective) {
            return objective.id != id;
          });

          _this7.onDeleteSuccessHandler();
        });
      }).catch(function (errors) {
        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this7.onSaveErrorHandler(errors.response.data.detail);
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
        labels: []
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
    value: function deleteDisaggregation(id) {
      if (id == 'new') {
        this.editing_disaggregations_data = this.editing_disaggregations_data.filter(function (disagg) {
          return disagg.id != 'new';
        });
        return;
      }
      /*
      this.api.deleteDisaggregation(id).then(response => {
          runInAction(() => {
              this.editing_disaggregations_data = this.editing_disaggregations_data.filter(disagg => disagg.id!=id)
              this.onDeleteSuccessHandler()
          })
      }
      */

    }
  }, {
    key: "updateDisaggregation",
    value: function updateDisaggregation(id, data) {
      var _this8 = this;

      this.editing_disaggregations_errors = {};
      this.api.updateDisaggregation(id, data).then(function (response) {
        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this8.onSaveSuccessHandler();

          var updatedDisaggregation = response.data;
          _this8.active_pane_is_dirty = false;
          _this8.editing_disaggregations_data = _this8.editing_disaggregations_data.map(function (disaggregation) {
            if (disaggregation.id == updatedDisaggregation.id) {
              return updatedDisaggregation;
            }

            return disaggregation;
          });
        });
      }).catch(function (errors) {
        _this8.saving = false;
        _this8.editing_disaggregations_errors = errors.response.data;

        _this8.onSaveErrorHandler();
      });
    }
  }, {
    key: "createDisaggregation",
    value: function createDisaggregation(data) {
      var _this9 = this;

      this.editing_disaggregations_errors = {};
      this.api.createDisaggregation(data).then(function (response) {
        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this9.onSaveSuccessHandler();

          var newDisaggregation = response.data;
          _this9.active_pane_is_dirty = false;
          _this9.editing_disaggregations_data = [].concat(_toConsumableArray(_this9.editing_disaggregations_data.filter(function (disaggregation) {
            return disaggregation.id != 'new';
          })), [newDisaggregation]);
        });
      }).catch(function (errors) {
        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this9.saving = false;
          _this9.editing_disaggregations_errors = errors.response.data;

          _this9.onSaveErrorHandler();
        });
      });
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
}), _descriptor23 = _applyDecoratedDescriptor(_class.prototype, "saving", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor24 = _applyDecoratedDescriptor(_class.prototype, "bulk_targets", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new Map();
  }
}), _descriptor25 = _applyDecoratedDescriptor(_class.prototype, "applying_bulk_updates", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor26 = _applyDecoratedDescriptor(_class.prototype, "bulk_targets_all", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _applyDecoratedDescriptor(_class.prototype, "fetchCountries", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "fetchCountries"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "applyFilters", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "applyFilters"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "changePage", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "changePage"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "changeFilter", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "changeFilter"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "clearFilters", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "clearFilters"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "toggleEditingTarget", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "toggleEditingTarget"), _class.prototype), _descriptor27 = _applyDecoratedDescriptor(_class.prototype, "active_editor_pane", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 'profile';
  }
}), _applyDecoratedDescriptor(_class.prototype, "onProfilePaneChange", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "onProfilePaneChange"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "addCountry", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "addCountry"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "saveNewCountry", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "saveNewCountry"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "updateCountry", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "updateCountry"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "addObjective", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "addObjective"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "updateObjective", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "updateObjective"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "createObjective", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "createObjective"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "deleteObjective", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "deleteObjective"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "clearObjectiveEditingErrors", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "clearObjectiveEditingErrors"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "clearDisaggregationEditingErrors", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "clearDisaggregationEditingErrors"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "addDisaggregation", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "addDisaggregation"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "deleteDisaggregation", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "deleteDisaggregation"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "updateDisaggregation", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "updateDisaggregation"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "createDisaggregation", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "createDisaggregation"), _class.prototype)), _class);

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
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-select */ "y2Vs");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! classnames */ "TSYQ");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ "IP2g");
var _class, _class2;

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

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "invalid-feedback"
  }, errorMessages.map(function (message, index) {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      key: index
    }, message);
  }));
});

var StrategicObjectiveForm = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class =
/*#__PURE__*/
function (_React$Component) {
  _inherits(StrategicObjectiveForm, _React$Component);

  function StrategicObjectiveForm(props) {
    var _this;

    _classCallCheck(this, StrategicObjectiveForm);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(StrategicObjectiveForm).call(this, props));
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
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "accordion-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "accordion-row__content"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        onClick: expandAction,
        className: "btn accordion-row__btn btn-link",
        tabIndex: "0"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_4__["FontAwesomeIcon"], {
        icon: expanded ? 'caret-down' : 'caret-right'
      }), objective.id == 'new' ? gettext("New Strategic Objective") : objective.name), expanded && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("form", {
        className: "form card card-body bg-white"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "label--required",
        htmlFor: "objective-name-input"
      }, gettext("Short name")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
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
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ErrorFeedback, {
        errorMessages: this.formErrors('name')
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        htmlFor: "objective-description-input"
      }, gettext("Description")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("textarea", {
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
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ErrorFeedback, {
        errorMessages: this.formErrors('description')
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        htmlFor: "objective-status-input"
      }, gettext("Status")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_2__["default"], {
        value: selectedStatus,
        options: statusOptions,
        onChange: function onChange(e) {
          return _this4.updateFormField('status', e.value);
        },
        className: classnames__WEBPACK_IMPORTED_MODULE_3___default()('react-select', {
          'is-invalid': this.formErrors('status')
        }),
        id: "objective-status-input"
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ErrorFeedback, {
        errorMessages: this.formErrors('status')
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "objective-form-buttons"
      }, objective.id == 'new' && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group btn-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-primary",
        type: "button",
        onClick: function onClick() {
          return createObjective(managed_data);
        }
      }, gettext("Save Changes"))), objective.id != 'new' && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group btn-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-primary",
        type: "button",
        onClick: function onClick() {
          return saveObjective(managed_data);
        }
      }, gettext("Save Changes")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-reset",
        type: "button",
        onClick: function onClick() {
          return _this4.resetForm();
        }
      }, gettext("Reset"))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "right-buttons"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        tabIndex: "0",
        onClick: deleteAction,
        className: "btn btn-link btn-danger"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-trash"
      }), gettext("Delete")))))));
    }
  }]);

  return StrategicObjectiveForm;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component)) || _class;

var EditObjectives = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class2 =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(EditObjectives, _React$Component2);

  function EditObjectives(props) {
    var _this5;

    _classCallCheck(this, EditObjectives);

    _this5 = _possibleConstructorReturn(this, _getPrototypeOf(EditObjectives).call(this, props));
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
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "tab-pane--react"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h3", null, gettext("Strategic Objectives")), objectives.map(function (objective) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(StrategicObjectiveForm, {
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
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        tabIndex: "0",
        onClick: function onClick() {
          return _this6.addObjective();
        },
        className: "btn btn-link btn-add"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
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
react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_views__WEBPACK_IMPORTED_MODULE_3__["IndexView"], {
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

/***/ "e0fF":
/*!*******************************************************!*\
  !*** ./js/pages/tola_management_pages/country/api.js ***!
  \*******************************************************/
/*! exports provided: fetchCountries, createCountry, updateCountry, fetchCountryObjectives, fetchCountryDisaggregations, createObjective, updateObjective, deleteObjective, createDisaggregation, updateDisaggregation, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchCountries", function() { return fetchCountries; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createCountry", function() { return createCountry; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateCountry", function() { return updateCountry; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchCountryObjectives", function() { return fetchCountryObjectives; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchCountryDisaggregations", function() { return fetchCountryDisaggregations; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createObjective", function() { return createObjective; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateObjective", function() { return updateObjective; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deleteObjective", function() { return deleteObjective; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createDisaggregation", function() { return createDisaggregation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateDisaggregation", function() { return updateDisaggregation; });
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../api */ "XoI5");
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

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
  return _api__WEBPACK_IMPORTED_MODULE_0__["api"].delete("/tola_management/countryobjective/".concat(id));
};
var createDisaggregation = function createDisaggregation(data) {
  return _api__WEBPACK_IMPORTED_MODULE_0__["api"].post('/tola_management/countrydisaggregation/', data);
};
var updateDisaggregation = function updateDisaggregation(id, data) {
  return _api__WEBPACK_IMPORTED_MODULE_0__["api"].put("/tola_management/countrydisaggregation/".concat(id, "/"), data);
}; //export const deleteDisaggregation = (id) => api.delete(`/tola_management/countrydisaggregation/${id}`)

/* harmony default export */ __webpack_exports__["default"] = ({
  fetchCountries: fetchCountries,
  fetchCountryObjectives: fetchCountryObjectives,
  fetchCountryDisaggregations: fetchCountryDisaggregations,
  createCountry: createCountry,
  updateCountry: updateCountry,
  createObjective: createObjective,
  updateObjective: updateObjective,
  deleteObjective: deleteObjective,
  createDisaggregation: createDisaggregation,
  updateDisaggregation: updateDisaggregation //deleteDisaggregation,

});

/***/ }),

/***/ "hLpu":
/*!***********************************************************************************!*\
  !*** ./js/pages/tola_management_pages/country/components/edit_disaggregations.js ***!
  \***********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return EditDisaggregations; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ "TSYQ");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ "IP2g");
var _class, _class2;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

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





var ErrorFeedback = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref) {
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

var DisaggregationType = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class =
/*#__PURE__*/
function (_React$Component) {
  _inherits(DisaggregationType, _React$Component);

  function DisaggregationType(props) {
    var _this;

    _classCallCheck(this, DisaggregationType);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DisaggregationType).call(this, props));
    var disaggregation = _this.props.disaggregation;
    var labels = disaggregation.labels.map(function (x) {
      return _objectSpread({}, x);
    });
    _this.state = {
      managed_data: _objectSpread({}, disaggregation, {
        labels: _toConsumableArray(labels)
      })
    };
    return _this;
  }

  _createClass(DisaggregationType, [{
    key: "hasUnsavedDataAction",
    value: function hasUnsavedDataAction() {
      var labels = this.props.disaggregation.labels.map(function (x) {
        return _objectSpread({}, x);
      });
      this.props.onIsDirtyChange(JSON.stringify(this.state.managed_data) != JSON.stringify(_objectSpread({}, this.props.disaggregation, {
        labels: _toConsumableArray(labels)
      })));
    }
  }, {
    key: "resetForm",
    value: function resetForm() {
      var _this2 = this;

      this.props.clearErrors();
      var disaggregation = this.props.disaggregation;
      var labels = disaggregation.labels.map(function (x) {
        return _objectSpread({}, x);
      });
      this.setState({
        managed_data: _objectSpread({}, disaggregation, {
          labels: _toConsumableArray(labels)
        })
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
    key: "updateDisaggregationTypeField",
    value: function updateDisaggregationTypeField(value) {
      var _this3 = this;

      this.setState({
        managed_data: _objectSpread({}, this.state.managed_data, {
          disaggregation_type: value
        })
      }, function () {
        return _this3.hasUnsavedDataAction();
      });
    }
  }, {
    key: "updateLabel",
    value: function updateLabel(labelIndex, value) {
      var _this4 = this;

      var managed_data = this.state.managed_data;
      var updatedLabels = this.state.managed_data.labels.map(function (label, idx) {
        if (idx == labelIndex) {
          return Object.assign(label, {
            label: value
          });
        }

        return label;
      });
      this.setState({
        managed_data: _objectSpread({}, managed_data, {
          labels: _toConsumableArray(updatedLabels)
        })
      }, function () {
        return _this4.hasUnsavedDataAction();
      });
    }
  }, {
    key: "appendLabel",
    value: function appendLabel() {
      var _this5 = this;

      var newLabel = {
        id: 'new',
        label: ''
      };
      var managed_data = this.state.managed_data;
      this.setState({
        managed_data: _objectSpread({}, managed_data, {
          labels: [].concat(_toConsumableArray(managed_data.labels), [newLabel])
        })
      }, function () {
        return _this5.hasUnsavedDataAction();
      });
    }
  }, {
    key: "deleteLabel",
    value: function deleteLabel(labelIndex) {
      var _this6 = this;

      var managed_data = this.state.managed_data;
      var updatedLabels = managed_data.labels.filter(function (label, idx) {
        return idx != labelIndex || label.in_use;
      });
      this.setState({
        managed_data: _objectSpread({}, managed_data, {
          labels: _toConsumableArray(updatedLabels)
        })
      }, function () {
        return _this6.hasUnsavedDataAction();
      });
    }
  }, {
    key: "save",
    value: function save() {
      var managed_data = this.state.managed_data;
      this.props.saveDisaggregation(managed_data);
    }
    /* could be used to add deletion, but this is not currently spec'd
    canDelete(disaggregation) {
        const labels_inuse = disaggregation.labels.some(label=>label.in_use)
        if ((disaggregation.id == 'new') || !labels_inuse ) {
            return true
        }
        return false
    }
    */

  }, {
    key: "render",
    value: function render() {
      var _this7 = this;

      var _this$props = this.props,
          disaggregation = _this$props.disaggregation,
          expanded = _this$props.expanded,
          expandAction = _this$props.expandAction,
          deleteAction = _this$props.deleteAction,
          errors = _this$props.errors;
      var managed_data = this.state.managed_data;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "accordion-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "accordion-row__content"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        onClick: expandAction,
        className: "btn accordion-row__btn btn-link",
        tabIndex: "0"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_3__["FontAwesomeIcon"], {
        icon: expanded ? 'caret-down' : 'caret-right'
      }), disaggregation.id == 'new' ? "New Disaggregation type" : disaggregation.disaggregation_type), expanded && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("form", {
        className: "form card card-body bg-white"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "label--required",
        htmlFor: "disaggregation-type-input"
      }, gettext('Disaggregation Type')), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        id: "disaggregation-type-input",
        className: classnames__WEBPACK_IMPORTED_MODULE_2___default()('form-control', {
          'is-invalid': this.formErrors('disaggregation_type')
        }),
        value: managed_data.disaggregation_type,
        onChange: function onChange(e) {
          return _this7.updateDisaggregationTypeField(e.target.value);
        },
        type: "text",
        required: true
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ErrorFeedback, {
        errorMessages: this.formErrors('disaggregation_type')
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", null, "Labels"), managed_data.labels.map(function (label, labelIndex) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          key: labelIndex,
          className: "form-group disaggregation-label-group"
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
          value: label.label,
          onChange: function onChange(e) {
            return _this7.updateLabel(labelIndex, e.target.value);
          },
          className: classnames__WEBPACK_IMPORTED_MODULE_2___default()("form-control", {
            "is-invalid": errors.labels ? Object.keys(errors.labels[labelIndex]).length : false
          })
        }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
          tabIndex: "0",
          onClick: function onClick() {
            return _this7.deleteLabel(labelIndex);
          },
          className: classnames__WEBPACK_IMPORTED_MODULE_2___default()("btn btn-link btn-danger", {
            'disabled': label.in_use
          }),
          disabled: label.in_use
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "fas fa-trash"
        }), gettext('Remove')));
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        tabIndex: "0",
        onClick: function onClick() {
          return _this7.appendLabel();
        },
        className: "btn btn-link btn-add"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-plus-circle"
      }), gettext('Add another option'))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "disaggregation-form-buttons"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-row btn-row"
      }, disaggregation.id == 'new' ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-primary",
        onClick: function onClick(e) {
          return _this7.save();
        },
        type: "button"
      }, gettext('Save Changes')) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-primary",
        onClick: function onClick(e) {
          return _this7.save();
        },
        type: "button"
      }, gettext('Save Changes')), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-reset",
        type: "button",
        onClick: function onClick() {
          return _this7.resetForm();
        }
      }, gettext('Reset'))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "right-buttons"
      }, disaggregation.id == 'new' && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        tabIndex: "0",
        onClick: deleteAction,
        className: "btn btn-link btn-danger"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-trash"
      }), gettext('Delete'))))))));
    }
  }]);

  return DisaggregationType;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component)) || _class;

var EditDisaggregations = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class2 =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(EditDisaggregations, _React$Component2);

  function EditDisaggregations(props) {
    var _this8;

    _classCallCheck(this, EditDisaggregations);

    _this8 = _possibleConstructorReturn(this, _getPrototypeOf(EditDisaggregations).call(this, props));
    _this8.state = {
      expanded_id: null,
      is_dirty: false
    };
    return _this8;
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
    key: "addDisaggregation",
    value: function addDisaggregation() {
      if (this.dirtyConfirm()) {
        this.props.addDisaggregation();
        this.setState({
          expanded_id: 'new'
        });
      }
    }
  }, {
    key: "saveDisaggregation",
    value: function saveDisaggregation(data) {
      var withCountry = Object.assign(data, {
        country: this.props.country_id
      });

      if (data.id == 'new') {
        this.props.onCreate(withCountry);
      } else {
        this.props.onUpdate(data.id, withCountry);
      }

      this.setState({
        is_dirty: false
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this9 = this;

      var disaggregations = this.props.disaggregations;
      var expanded_id = this.state.expanded_id;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "tab-pane--react"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h3", null, gettext('Country Disaggregations')), disaggregations.map(function (disaggregation) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(DisaggregationType, {
          key: disaggregation.id,
          disaggregation: disaggregation,
          expanded: disaggregation.id == expanded_id,
          expandAction: function expandAction() {
            return _this9.toggleExpand(disaggregation.id);
          },
          updateLabel: function updateLabel(labelIndex, value) {
            return _this9.updateLabel(disaggregation.id, labelIndex, value);
          },
          deleteAction: function deleteAction() {
            return _this9.props.onDelete(disaggregation.id);
          },
          saveDisaggregation: function saveDisaggregation(data) {
            return _this9.saveDisaggregation(data);
          },
          errors: _this9.props.errors,
          clearErrors: _this9.props.clearErrors,
          onIsDirtyChange: function onIsDirtyChange(is_dirty) {
            return _this9.handleDirtyUpdate(is_dirty);
          }
        });
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, !disaggregations.find(function (d) {
        return d.id == 'new';
      }) && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        tabIndex: "0",
        className: "btn btn-link btn-add",
        onClick: function onClick() {
          return _this9.addDisaggregation();
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-plus-circle"
      }), gettext("Add country disaggregation"))));
    }
  }]);

  return EditDisaggregations;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component)) || _class2;



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

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }





var CountryEditor = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class =
/*#__PURE__*/
function (_React$Component) {
  _inherits(CountryEditor, _React$Component);

  function CountryEditor() {
    _classCallCheck(this, CountryEditor);

    return _possibleConstructorReturn(this, _getPrototypeOf(CountryEditor).apply(this, arguments));
  }

  _createClass(CountryEditor, [{
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
          StrategicObjectiveSection = _this$props.StrategicObjectiveSection,
          DisaggregationSection = _this$props.DisaggregationSection,
          active_pane = _this$props.active_pane;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "tab-set--vertical"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", {
        className: "nav nav-tabs"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
        className: "nav-item"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        className: classnames__WEBPACK_IMPORTED_MODULE_2___default()('nav-link', {
          'active': active_pane == 'profile'
        }),
        onClick: function onClick(e) {
          e.preventDefault();

          _this.updateActivePage('profile');
        }
      }, gettext("Profile"))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
        className: "nav-item"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        className: classnames__WEBPACK_IMPORTED_MODULE_2___default()('nav-link', {
          'active': active_pane == 'objectives',
          'disabled': this.props.new
        }),
        onClick: function onClick(e) {
          e.preventDefault();

          _this.updateActivePage('objectives');
        }
      }, gettext("Strategic Objectives"))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
        className: "nav-item"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        className: classnames__WEBPACK_IMPORTED_MODULE_2___default()('nav-link', {
          'active': active_pane == 'disaggregations',
          'disabled': this.props.new
        }),
        onClick: function onClick(e) {
          e.preventDefault();

          _this.updateActivePage('disaggregations');
        }
      }, gettext("Country Disaggregations")))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "tab-content"
      }, active_pane == 'profile' && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ProfileSection, null), active_pane == 'objectives' && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(StrategicObjectiveSection, null), active_pane == 'disaggregations' && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(DisaggregationSection, null)));
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

/***/ })

},[["NlW9","runtime","vendors"]]]);
//# sourceMappingURL=tola_management_country-2d5570d2517920c59723.js.map