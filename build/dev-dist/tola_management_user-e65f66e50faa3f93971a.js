(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["tola_management_user"],{

/***/ "4BAa":
/*!******************************************************************************!*\
  !*** ./js/pages/tola_management_pages/user/components/edit_user_programs.js ***!
  \******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return EditUserPrograms; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx */ "2vnA");
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var react_virtualized__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-virtualized */ "c7k8");
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../models */ "iEWS");
/* harmony import */ var components_checkboxed_multi_select__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! components/checkboxed-multi-select */ "Z2Y6");
/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ "IP2g");
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

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }







 //we need a pretty peculiar structure to accommodate the virtualized table

var create_country_objects = function create_country_objects(countries, store) {
  return Object.entries(countries).reduce(function (countries, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        id = _ref2[0],
        country = _ref2[1];

    return _objectSpread(_objectSpread({}, countries), {}, _defineProperty({}, id, _objectSpread(_objectSpread({}, country), {}, {
      type: 'country',
      options: [{
        label: gettext('Individual programs only'),
        value: 'none'
      }].concat(_toConsumableArray(store.country_role_choices)),
      admin_access: store.is_superuser,
      programs: new Set(country.programs)
    })));
  }, {});
};

var create_program_objects = function create_program_objects(programs, store) {
  return Object.entries(programs).reduce(function (programs, _ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        id = _ref4[0],
        program = _ref4[1];

    return _objectSpread(_objectSpread({}, programs), {}, _defineProperty({}, id, _objectSpread(_objectSpread({}, program), {}, {
      type: 'program',
      options: store.program_role_choices
    })));
  }, {});
};
/**
 * This function returns countries and programs as a flat ordered list as they will be displayed in the virtualized table.
 *
 * @param {Object[]} countries - the country objects created by create_country_objects (with program info)
 * @param {Object[]} programs - the program objects created by create_program_objects (with user role info)
 * @param {@callback} isExpanded - The callback which determines if a given country ID should be expanded, incorporating
 *                                filter states and previous user toggles
 * @returns {Object[]} - the countries and programs as rowData for the virtualized table
 */


var flattened_listing = function flattened_listing(countries, programs, isExpanded) {
  return countries.flatMap(function (country) {
    return (//flatMap to return a flattened list
      [country].concat(_toConsumableArray(isExpanded(country.id) ? Array.from(country.programs) //only show programs if country is expanded
      .filter(function (program_id) {
        return programs[program_id];
      }) // don't include programs we don't have information for (filtered out)
      .map(function (program_id) {
        return _objectSpread(_objectSpread({}, programs[program_id]), {}, {
          id: "".concat(country.id, "_").concat(program_id),
          country_id: country.id
        });
      }) : []))
    );
  });
};

var apply_program_filter = function apply_program_filter(programs, countries, filter_string) {
  if (!filter_string) {
    return {
      programs: programs,
      countries: countries
    };
  }

  var filtered_programs = Object.entries(programs).filter(function (_ref5) {
    var _ref6 = _slicedToArray(_ref5, 2),
        _ = _ref6[0],
        program = _ref6[1];

    return program.name.toLowerCase().includes(filter_string.toLowerCase());
  }).map(function (_ref7) {
    var _ref8 = _slicedToArray(_ref7, 2),
        _ = _ref8[0],
        p = _ref8[1];

    return p;
  });
  var filtered_countries = Object.entries(countries).filter(function (_ref9) {
    var _ref10 = _slicedToArray(_ref9, 2),
        _ = _ref10[0],
        country = _ref10[1];

    return filtered_programs.some(function (program) {
      return country.programs.has(program.id);
    });
  }).map(function (_ref11) {
    var _ref12 = _slicedToArray(_ref11, 2),
        _ = _ref12[0],
        c = _ref12[1];

    return c;
  });
  return {
    countries: filtered_countries.reduce(function (countries, country) {
      return _objectSpread(_objectSpread({}, countries), {}, _defineProperty({}, country.id, country));
    }, {}),
    programs: filtered_programs.reduce(function (programs, program) {
      return _objectSpread(_objectSpread({}, programs), {}, _defineProperty({}, program.id, program));
    }, {})
  };
};

var apply_country_filter = function apply_country_filter(countries, filtered) {
  if (filtered.length > 0) {
    return filtered.filter(function (id) {
      return countries[id];
    }).map(function (id) {
      return countries[id];
    }).reduce(function (countries, country) {
      return _objectSpread(_objectSpread({}, countries), {}, _defineProperty({}, country.id, country));
    }, {});
  } else {
    return countries;
  }
};

var create_user_access = function create_user_access(user_access) {
  return {
    countries: Object.entries(user_access.countries).reduce(function (countries, _ref13) {
      var _ref14 = _slicedToArray(_ref13, 2),
          id = _ref14[0],
          country = _ref14[1];

      return _objectSpread(_objectSpread({}, countries), {}, _defineProperty({}, id, _objectSpread(_objectSpread({}, country), {}, {
        has_access: true
      })));
    }, {}),
    programs: user_access.programs.reduce(function (programs, program) {
      return _objectSpread(_objectSpread({}, programs), {}, _defineProperty({}, "".concat(program.country, "_").concat(program.program), _objectSpread(_objectSpread({}, program), {}, {
        has_access: true
      })));
    }, {})
  };
};

var country_has_all_access = function country_has_all_access(country, visible_programs, user_program_access) {
  return Array.from(country.programs).filter(function (program_id) {
    return !!visible_programs[program_id];
  }).every(function (program_id) {
    return user_program_access.programs["".concat(country.id, "_").concat(program_id)] && user_program_access.programs["".concat(country.id, "_").concat(program_id)].has_access;
  });
};

var EditUserPrograms = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class = /*#__PURE__*/function (_React$Component) {
  _inherits(EditUserPrograms, _React$Component);

  var _super = _createSuper(EditUserPrograms);

  function EditUserPrograms(props) {
    var _this;

    _classCallCheck(this, EditUserPrograms);

    _this = _super.call(this, props);
    var store = props.store;
    var countries = create_country_objects(store.countries, store);
    var programs = create_program_objects(store.programs, store);
    _this.countryStore = new _models__WEBPACK_IMPORTED_MODULE_4__["CountryStore"](store.regions, store.countries); // callback for determining if a country is expanded based on filter state (initial program filter of ''):

    var isExpanded = _this.isExpanded.bind(_assertThisInitialized(_this), '');

    _this.state = {
      program_filter: '',
      countries: countries,
      programs: programs,
      filtered_countries: countries,
      filtered_programs: programs,
      ordered_country_ids: store.ordered_country_ids,
      flattened_programs: flattened_listing(store.ordered_country_ids.filter(function (id) {
        return id in countries;
      }).map(function (id) {
        return countries[id];
      }), programs, isExpanded),
      original_user_program_access: create_user_access(store.editing_target_data.access),
      user_program_access: create_user_access(store.editing_target_data.access)
    };
    return _this;
  }

  _createClass(EditUserPrograms, [{
    key: "saveForm",
    value: function saveForm() {
      var _this2 = this;

      //marshal the data back into the format we received it
      //filtering out all !has_access
      var access = this.state.user_program_access;
      this.props.onSave({
        countries: Object.entries(access.countries).filter(function (_ref15) {
          var _ref16 = _slicedToArray(_ref15, 2),
              _ = _ref16[0],
              country = _ref16[1];

          return _this2.props.store.is_superuser;
        }).filter(function (_ref17) {
          var _ref18 = _slicedToArray(_ref17, 2),
              _ = _ref18[0],
              country = _ref18[1];

          return country.has_access;
        }).reduce(function (countries, _ref19) {
          var _ref20 = _slicedToArray(_ref19, 2),
              id = _ref20[0],
              country = _ref20[1];

          return _objectSpread(_objectSpread({}, countries), {}, _defineProperty({}, id, country));
        }, {}),
        programs: Object.entries(access.programs).filter(function (_ref21) {
          var _ref22 = _slicedToArray(_ref21, 2),
              _ = _ref22[0],
              program = _ref22[1];

          return program.has_access;
        }).map(function (_ref23) {
          var _ref24 = _slicedToArray(_ref23, 2),
              _ = _ref24[0],
              program = _ref24[1];

          return program;
        })
      });
      this.hasUnsavedDataAction();
    }
  }, {
    key: "hasUnsavedDataAction",
    value: function hasUnsavedDataAction() {
      var access = {
        countries: Object.entries(this.state.user_program_access.countries).filter(function (_ref25) {
          var _ref26 = _slicedToArray(_ref25, 2),
              _ = _ref26[0],
              country = _ref26[1];

          return country.has_access;
        }).reduce(function (countries, _ref27) {
          var _ref28 = _slicedToArray(_ref27, 2),
              id = _ref28[0],
              country = _ref28[1];

          return _objectSpread(_objectSpread({}, countries), {}, _defineProperty({}, id, country));
        }, {}),
        programs: Object.entries(this.state.user_program_access.programs).filter(function (_ref29) {
          var _ref30 = _slicedToArray(_ref29, 2),
              _ = _ref30[0],
              program = _ref30[1];

          return program.has_access;
        }).reduce(function (programs, _ref31) {
          var _ref32 = _slicedToArray(_ref31, 2),
              id = _ref32[0],
              program = _ref32[1];

          return _objectSpread(_objectSpread({}, programs), {}, _defineProperty({}, id, program));
        }, {})
      };
      this.props.onIsDirtyChange(JSON.stringify(access) != JSON.stringify(this.state.original_user_program_access));
    }
  }, {
    key: "resetForm",
    value: function resetForm() {
      var _this3 = this;

      this.setState({
        user_program_access: {
          countries: _objectSpread({}, this.state.original_user_program_access.countries),
          programs: _objectSpread({}, this.state.original_user_program_access.programs)
        }
      }, function () {
        return _this3.hasUnsavedDataAction();
      });
    }
  }, {
    key: "toggleProgramAccess",
    value: function toggleProgramAccess(program_key) {
      var _this4 = this;

      var current_program_access = this.state.user_program_access.programs;

      var updated_program_access = function () {
        if (current_program_access[program_key]) {
          return _objectSpread(_objectSpread({}, current_program_access[program_key]), {}, {
            has_access: !current_program_access[program_key].has_access
          });
        } else {
          //TODO: want to find a more resilient way to handle a compound key
          var _program_key$split = program_key.split('_'),
              _program_key$split2 = _slicedToArray(_program_key$split, 2),
              country = _program_key$split2[0],
              program = _program_key$split2[1];

          return {
            country: country,
            program: program,
            role: 'low',
            has_access: true
          };
        }
      }();

      this.setState({
        user_program_access: _objectSpread(_objectSpread({}, this.state.user_program_access), {}, {
          programs: _objectSpread(_objectSpread({}, current_program_access), {}, _defineProperty({}, program_key, updated_program_access))
        })
      }, function () {
        return _this4.hasUnsavedDataAction();
      });
    }
  }, {
    key: "toggleAllProgramsForCountry",
    value: function toggleAllProgramsForCountry(country_id) {
      var _this5 = this;

      var country = this.state.countries[country_id];

      var new_program_access = function () {
        var country_has_all_checked = country_has_all_access(country, _this5.state.filtered_programs, _this5.state.user_program_access);

        if (country_has_all_checked) {
          //toggle all off
          return Array.from(country.programs).filter(function (program_id) {
            return !!_this5.state.filtered_programs[program_id];
          }).reduce(function (programs, program_id) {
            var program_key = "".concat(country.id, "_").concat(program_id);
            var program = _this5.state.user_program_access.programs[program_key];

            if (program) {
              return _objectSpread(_objectSpread({}, programs), {}, _defineProperty({}, program_key, _objectSpread(_objectSpread({}, program), {}, {
                has_access: false
              })));
            } else {
              return programs;
            }
          }, {});
        } else {
          //toggle all on
          return Array.from(country.programs).filter(function (program_id) {
            return !!_this5.state.filtered_programs[program_id];
          }).reduce(function (programs, program_id) {
            var program_key = "".concat(country.id, "_").concat(program_id);
            var program = _this5.state.user_program_access.programs[program_key];

            if (program) {
              return _objectSpread(_objectSpread({}, programs), {}, _defineProperty({}, program_key, _objectSpread(_objectSpread({}, program), {}, {
                has_access: true
              })));
            } else {
              return _objectSpread(_objectSpread({}, programs), {}, _defineProperty({}, program_key, {
                program: program_id,
                country: country.id,
                role: 'low',
                has_access: true
              }));
            }
          }, {});
        }
      }();

      this.setState({
        user_program_access: _objectSpread(_objectSpread({}, this.state.user_program_access), {}, {
          programs: _objectSpread(_objectSpread({}, this.state.user_program_access.programs), new_program_access)
        })
      }, function () {
        return _this5.hasUnsavedDataAction();
      });
    }
  }, {
    key: "changeCountryRole",
    value: function changeCountryRole(country_id, new_val) {
      var _this6 = this;

      var country = _objectSpread({}, this.state.user_program_access.countries[country_id]);

      var new_country_access = function () {
        if (new_val != 'none') {
          return _objectSpread(_objectSpread({}, country), {}, {
            role: new_val,
            has_access: true
          });
        } else {
          return _objectSpread(_objectSpread({}, country), {}, {
            role: new_val,
            has_access: false
          });
        }
      }();

      this.setState({
        user_program_access: _objectSpread(_objectSpread({}, this.state.user_program_access), {}, {
          countries: _objectSpread(_objectSpread({}, this.state.user_program_access.countries), {}, _defineProperty({}, country_id, new_country_access))
        })
      }, function () {
        return _this6.hasUnsavedDataAction();
      });
    }
  }, {
    key: "changeProgramRole",
    value: function changeProgramRole(program_key, new_val) {
      var _this7 = this;

      var _program_key$split3 = program_key.split('_'),
          _program_key$split4 = _slicedToArray(_program_key$split3, 2),
          country_id = _program_key$split4[0],
          program_id = _program_key$split4[1];

      var access = this.state.user_program_access;

      var new_program_access = function () {
        if (access[country_id] && access[country_id].has_access && new_val == 'low') {
          return {
            program: program_id,
            country: country_id,
            role: new_val,
            has_access: false
          };
        } else {
          return {
            program: program_id,
            country: country_id,
            role: new_val,
            has_access: true
          };
        }
      }();

      this.setState({
        user_program_access: _objectSpread(_objectSpread({}, this.state.user_program_access), {}, {
          programs: _objectSpread(_objectSpread({}, this.state.user_program_access.programs), {}, _defineProperty({}, program_key, new_program_access))
        })
      }, function () {
        return _this7.hasUnsavedDataAction();
      });
    }
  }, {
    key: "clearFilter",
    value: function clearFilter() {
      var val = '';
      var filtered_countries = apply_country_filter(this.state.countries, this.countryStore.selectedCountries);

      var _apply_program_filter = apply_program_filter(this.state.programs, filtered_countries, val),
          countries = _apply_program_filter.countries,
          programs = _apply_program_filter.programs; // callback for determining if a country is expanded based on filter state:


      var isExpanded = this.isExpanded.bind(this, val);
      this.setState({
        program_filter: val,
        filtered_programs: programs,
        filtered_countries: countries,
        flattened_programs: flattened_listing(this.state.ordered_country_ids.filter(function (id) {
          return id in countries;
        }).map(function (id) {
          return countries[id];
        }), programs, isExpanded)
      });
    }
  }, {
    key: "updateProgramFilter",
    value: function updateProgramFilter(val) {
      var filtered_countries = apply_country_filter(this.state.countries, this.countryStore.selectedCountries);

      var _apply_program_filter2 = apply_program_filter(this.state.programs, filtered_countries, val),
          countries = _apply_program_filter2.countries,
          programs = _apply_program_filter2.programs; // callback for determining if a country is expanded based on filter state:


      var isExpanded = this.isExpanded.bind(this, val);
      this.setState({
        program_filter: val,
        filtered_programs: programs,
        filtered_countries: countries,
        flattened_programs: flattened_listing(this.state.ordered_country_ids.filter(function (id) {
          return id in countries;
        }).map(function (id) {
          return countries[id];
        }), programs, isExpanded)
      });
    }
  }, {
    key: "changeCountryFilter",
    value: function changeCountryFilter(e) {
      this.countryStore.updateSelected(e);
      var filtered_countries = apply_country_filter(this.state.countries, this.countryStore.selectedCountries, true);

      var _apply_program_filter3 = apply_program_filter(this.state.programs, filtered_countries, this.state.program_filter),
          countries = _apply_program_filter3.countries,
          programs = _apply_program_filter3.programs; // callback for determining if a country is expanded based on filter state:


      var isExpanded = this.isExpanded.bind(this, this.state.program_filter);
      this.setState({
        filtered_countries: countries,
        flattened_programs: flattened_listing(this.state.ordered_country_ids.filter(function (id) {
          return id in countries;
        }).map(function (id) {
          return countries[id];
        }), this.state.filtered_programs, isExpanded)
      });
    }
  }, {
    key: "toggleCountryExpanded",
    value: function toggleCountryExpanded(id) {
      this.countryStore.toggleExpanded(id);
      var filtered_countries = apply_country_filter(this.state.countries, this.countryStore.selectedCountries);

      var _apply_program_filter4 = apply_program_filter(this.state.programs, filtered_countries, this.state.program_filter),
          countries = _apply_program_filter4.countries,
          programs = _apply_program_filter4.programs; // callback for determining if a country is expanded based on filter state:


      var isExpanded = this.isExpanded.bind(this, this.state.program_filter);
      this.setState({
        filtered_countries: countries,
        flattened_programs: flattened_listing(this.state.ordered_country_ids.filter(function (id) {
          return id in countries;
        }).map(function (id) {
          return countries[id];
        }), this.state.filtered_programs, isExpanded)
      });
    }
  }, {
    key: "isExpanded",
    value: function isExpanded(program_filter, countryId) {
      // when bound with this and program_filter state (a string), and called with country ID, returns true if country should be expanded
      if (program_filter && program_filter.length > 0) {
        // all countries left showing given a program filter should be expanded to show the programs filtered to
        return true;
      } // countryStore tracks toggling of expanded/collapsed state


      return this.countryStore.isExpanded(countryId);
    }
  }, {
    key: "render",
    value: function render() {
      var _this8 = this;

      var _this$props = this.props,
          user = _this$props.user,
          onSave = _this$props.onSave;

      var is_checked = function is_checked(data) {
        var access = _this8.state.user_program_access;

        if (data.type == 'country') {
          return access.countries[data.id] && access.countries[data.id].has_access || false;
        } else {
          if (_this8.state.user_program_access.countries[data.country_id] && _this8.state.user_program_access.countries[data.country_id].has_access) {
            return true;
          }

          return access.programs[data.id] && access.programs[data.id].has_access || false;
        }
      };

      var is_check_disabled = function is_check_disabled(data) {
        if (data.type == 'country') {
          return !(_this8.state.countries[data.id].programs.size > 0) || !(_this8.props.store.access.countries[data.id] && _this8.props.store.access.countries[data.id].role == 'basic_admin') || _this8.state.user_program_access.countries[data.id] && _this8.state.user_program_access.countries[data.id].has_access;
        } else {
          if (_this8.state.user_program_access.countries[data.country_id] && _this8.state.user_program_access.countries[data.country_id].has_access) {
            return true;
          }

          return !_this8.props.store.access.countries[data.country_id] || _this8.props.store.access.countries[data.country_id].role != 'basic_admin';
        }
      };

      var is_role_disabled = function is_role_disabled(data) {
        if (data.type == 'country') {
          return !_this8.props.store.is_superuser;
        } else {
          return !_this8.props.store.access.countries[data.country_id] || _this8.props.store.access.countries[data.country_id].role != 'basic_admin' || !(_this8.state.user_program_access.programs[data.id] && _this8.state.user_program_access.programs[data.id].has_access) && !(_this8.state.user_program_access.countries[data.country_id] && _this8.state.user_program_access.countries[data.country_id].has_access);
        }
      };

      var get_role = function get_role(data) {
        if (data.type == 'country') {
          var country_access = _this8.state.user_program_access.countries;

          if (!country_access[data.id]) {
            return 'none';
          } else {
            return country_access[data.id].role;
          }
        } else {
          var program_access = _this8.state.user_program_access.programs;

          if (!program_access[data.id]) {
            return _this8.props.store.program_role_choices[0].value;
          } else {
            return program_access[data.id].role;
          }
        }
      };

      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "tab-pane--react edit-user-programs"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", {
        className: "no-bold"
      }, user.name ? user.name + ': ' : '', gettext("Programs and Roles"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("sup", null, "   ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        target: "_blank",
        href: "https://learn.mercycorps.org/index.php/TOLA:Section_05/en#5.4_User_Roles_Matrix_.28Program_Permissions.29"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        "aria-label": // # Translators: link to learn more about permissions-granting roles a user can be assigned
        gettext('More information on Program Roles'),
        className: "far fa-question-circle"
      })))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "edit-user-programs__filter-form"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "edit-user-programs__country-filter form-group react-multiselect-checkbox"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_checkboxed_multi_select__WEBPACK_IMPORTED_MODULE_5__["default"], {
        placeholder: // # Translators: This is placeholder text on a dropdown of countries which limit the displayed programs
        gettext("Filter countries"),
        isMulti: true,
        value: this.countryStore.selectedOptions,
        options: this.countryStore.groupedOptions,
        onChange: function onChange(e) {
          return _this8.changeCountryFilter(e);
        }
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group edit-user-programs__program-filter"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "input-group"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        placeholder: // # Translators: this is placeholder text on a dropdown of programs which limit the displayed results
        gettext("Filter programs"),
        type: "text",
        value: this.state.program_filter,
        className: "form-control",
        onChange: function onChange(e) {
          return _this8.updateProgramFilter(e.target.value);
        }
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "input-group-append"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        onClick: function onClick(e) {
          e.preventDefault();

          _this8.clearFilter();
        }
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "input-group-text"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fa fa-times-circle"
      }))))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "virtualized-table__wrapper"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_virtualized__WEBPACK_IMPORTED_MODULE_3__["AutoSizer"], null, function (_ref33) {
        var height = _ref33.height,
            width = _ref33.width;
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_virtualized__WEBPACK_IMPORTED_MODULE_3__["Table"], {
          height: height,
          headerHeight: 50,
          width: width,
          rowGetter: function rowGetter(_ref34) {
            var index = _ref34.index;
            return _this8.state.flattened_programs[index];
          },
          rowHeight: 50,
          rowCount: _this8.state.flattened_programs.length
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_virtualized__WEBPACK_IMPORTED_MODULE_3__["Column"], {
          dataKey: "not_applicable_but_required",
          label:
          /* # Translators: Column header for a checkbox indicating if a user has access to a program */
          gettext("Has access?"),
          width: 100,
          cellDataGetter: function cellDataGetter(_ref35) {
            var rowData = _ref35.rowData;
            return {
              checked: is_checked(rowData),
              disabled: is_check_disabled(rowData),
              id: rowData.id,
              type: rowData.type,
              expanded: rowData.type == "country" ? _this8.state.program_filter || _this8.countryStore.isExpanded(rowData.id) : false,
              programsCount: rowData.type == "country" ? rowData.programs.size : null,
              action: rowData.type == "country" ? _this8.toggleAllProgramsForCountry.bind(_this8) : _this8.toggleProgramAccess.bind(_this8)
            };
          },
          cellRenderer: function cellRenderer(_ref36) {
            var cellData = _ref36.cellData;

            if (cellData.type == 'country') {
              var country_has_all_checked = country_has_all_access(_this8.state.countries[cellData.id], _this8.state.filtered_programs, _this8.state.user_program_access);
              var button_label = country_has_all_checked ? gettext('Deselect All') : gettext('Select All');
              var selectAllButton = cellData.disabled || !cellData.expanded ? null : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
                className: "edit-user-programs__select-all",
                onClick: function onClick(e) {
                  return cellData.action(cellData.id);
                }
              }, button_label);
              return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
                className: "check-column"
              }, selectAllButton);
            } else {
              return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
                className: "check-column"
              }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
                type: "checkbox",
                checked: cellData.checked,
                disabled: cellData.disabled,
                onChange: function onChange() {
                  return cellData.action(cellData.id);
                }
              }));
            }
          }
        }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_virtualized__WEBPACK_IMPORTED_MODULE_3__["Column"], {
          dataKey: "not_applicable_but_required",
          label: gettext("Countries and Programs"),
          width: 200,
          flexGrow: 2,
          className: "pl-0",
          cellDataGetter: function cellDataGetter(_ref37) {
            var rowData = _ref37.rowData;
            return {
              expanded: rowData.type == "country" ? _this8.state.program_filter || _this8.countryStore.isExpanded(rowData.id) : false,
              programsCount: rowData.type == "country" ? rowData.programs.size : null,
              expandoAction: rowData.type == "country" ? _this8.toggleCountryExpanded.bind(_this8, rowData.id) : null,
              bold: rowData.type == "country",
              name: rowData.name
            };
          },
          cellRenderer: function cellRenderer(_ref38) {
            var cellData = _ref38.cellData;

            if (cellData.bold) {
              var expandoIcon = cellData.programsCount ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_6__["FontAwesomeIcon"], {
                icon: cellData.expanded ? 'caret-down' : 'caret-right'
              }) : null;
              var nameCellInner = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
                className: "expando-toggle__icon"
              }, expandoIcon), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
                className: "expando-toggle__label"
              }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, cellData.name)));

              if (cellData.programsCount) {
                return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
                  className: "edit-user-programs__expando expando-toggle icon__clickable",
                  onClick: cellData.expandoAction
                }, nameCellInner);
              } else {
                return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
                  className: "edit-user-programs__expando expando-toggle"
                }, nameCellInner);
              }
            } else {
              return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, cellData.name);
            }
          }
        }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_virtualized__WEBPACK_IMPORTED_MODULE_3__["Column"], {
          width: 100,
          flexGrow: 1,
          className: "pl-0",
          dataKey: "not_applicable_but_required",
          label: gettext("Roles and Permissions"),
          cellDataGetter: function cellDataGetter(_ref39) {
            var rowData = _ref39.rowData;
            return {
              id: rowData.id,
              disabled: is_role_disabled(rowData),
              type: rowData.type,
              options: rowData.options,
              action: rowData.type == "country" ? _this8.changeCountryRole.bind(_this8) : _this8.changeProgramRole.bind(_this8)
            };
          },
          cellRenderer: function cellRenderer(_ref40) {
            var cellData = _ref40.cellData;
            return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("select", {
              disabled: cellData.disabled,
              value: get_role(cellData),
              onChange: function onChange(e) {
                return cellData.action(cellData.id, e.target.value);
              }
            }, cellData.options.map(function (option) {
              return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
                key: option.value,
                value: option.value
              }, option.label);
            }));
          }
        }));
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group btn-row"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        type: "button",
        className: "btn btn-primary",
        onClick: function onClick() {
          return _this8.saveForm();
        }
      }, "Save Changes"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        type: "button",
        className: "btn btn-reset",
        onClick: function onClick() {
          return _this8.resetForm();
        }
      }, "Reset")));
    }
  }]);

  return EditUserPrograms;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component)) || _class;



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

/***/ "6iO6":
/*!*****************************************************************************!*\
  !*** ./js/pages/tola_management_pages/user/components/edit_user_profile.js ***!
  \*****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return EditUserProfile; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-select */ "Cs6D");
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! mobx */ "2vnA");
var _class;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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






var EditUserProfile = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class = /*#__PURE__*/function (_React$Component) {
  _inherits(EditUserProfile, _React$Component);

  var _super = _createSuper(EditUserProfile);

  function EditUserProfile(props) {
    var _this;

    _classCallCheck(this, EditUserProfile);

    _this = _super.call(this, props);
    var userData = props.userData;
    var filtered_orgs = props.organizations.filter(function (o) {
      return o.value != 1 || props.is_superuser;
    });
    var organization_listing = [];

    var _iterator = _createForOfIteratorHelper(filtered_orgs),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var org = _step.value;
        var org_js = Object(mobx__WEBPACK_IMPORTED_MODULE_3__["toJS"])(org);

        if (org_js.label === "Mercy Corps") {
          // # Translators: This is an deactivated menu item visible to users, indicating that assignment of this option is manaaged by another system.
          org_js.label = gettext("Mercy Corps -- managed by Okta");
          org_js.isDisabled = true;
        }

        organization_listing.push(org_js);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    var selected_organization = organization_listing.find(function (o) {
      return o.value == userData.organization_id;
    });
    _this.hasMCEmail = userData.email.endsWith("@mercycorps.org");
    _this.state = {
      original_user_data: _objectSpread({}, userData),
      managed_user_data: _objectSpread({}, userData),
      selected_organization: selected_organization,
      organization_listing: organization_listing
    };
    return _this;
  }

  _createClass(EditUserProfile, [{
    key: "save",
    value: function save() {
      this.props.onUpdate(this.state.managed_user_data);
    }
  }, {
    key: "saveNew",
    value: function saveNew(e) {
      e.preventDefault();
      this.props.onCreate(this.state.managed_user_data);
    }
  }, {
    key: "saveNewAndAddAnother",
    value: function saveNewAndAddAnother(e) {
      e.preventDefault();
      this.props.onCreateAndAddAnother(this.state.managed_user_data);
    }
  }, {
    key: "updateFirstName",
    value: function updateFirstName(new_first_name) {
      var _this2 = this;

      this.setState({
        managed_user_data: _objectSpread(_objectSpread({}, this.state.managed_user_data), {}, {
          first_name: new_first_name
        })
      }, function () {
        return _this2.hasUnsavedDataAction();
      });
    }
  }, {
    key: "updateLastName",
    value: function updateLastName(new_last_name) {
      var _this3 = this;

      this.setState({
        managed_user_data: _objectSpread(_objectSpread({}, this.state.managed_user_data), {}, {
          last_name: new_last_name
        })
      }, function () {
        return _this3.hasUnsavedDataAction();
      });
    }
  }, {
    key: "updateUsername",
    value: function updateUsername(new_username) {
      var _this4 = this;

      this.setState({
        managed_user_data: _objectSpread(_objectSpread({}, this.state.managed_user_data), {}, {
          username: new_username
        })
      }, function () {
        return _this4.hasUnsavedDataAction();
      });
    }
  }, {
    key: "updateOrganization",
    value: function updateOrganization(new_option) {
      var _this5 = this;

      this.setState({
        managed_user_data: _objectSpread(_objectSpread({}, this.state.managed_user_data), {}, {
          organization_id: new_option.value
        }),
        selected_organization: new_option
      }, function () {
        return _this5.hasUnsavedDataAction();
      });
    }
  }, {
    key: "updateTitle",
    value: function updateTitle(new_title) {
      var _this6 = this;

      this.setState({
        managed_user_data: _objectSpread(_objectSpread({}, this.state.managed_user_data), {}, {
          title: new_title
        })
      }, function () {
        return _this6.hasUnsavedDataAction();
      });
    }
  }, {
    key: "updateEmail",
    value: function updateEmail(new_email) {
      var _this7 = this;

      this.setState({
        managed_user_data: _objectSpread(_objectSpread({}, this.state.managed_user_data), {}, {
          email: new_email
        })
      }, function () {
        return _this7.hasUnsavedDataAction();
      });
    }
  }, {
    key: "updatePhone",
    value: function updatePhone(new_phone) {
      var _this8 = this;

      this.setState({
        managed_user_data: _objectSpread(_objectSpread({}, this.state.managed_user_data), {}, {
          phone_number: new_phone
        })
      }, function () {
        return _this8.hasUnsavedDataAction();
      });
    }
  }, {
    key: "updateModeOfContact",
    value: function updateModeOfContact(new_mode_of_contact) {
      var _this9 = this;

      this.setState({
        managed_user_data: _objectSpread(_objectSpread({}, this.state.managed_user_data), {}, {
          mode_of_contact: new_mode_of_contact
        })
      }, function () {
        return _this9.hasUnsavedDataAction();
      });
    }
  }, {
    key: "hasUnsavedDataAction",
    value: function hasUnsavedDataAction() {
      this.props.onIsDirtyChange(JSON.stringify(this.state.managed_user_data) != JSON.stringify(this.state.original_user_data));
    }
  }, {
    key: "resetForm",
    value: function resetForm() {
      var _this10 = this;

      var selected_organization = this.state.organization_listing.find(function (o) {
        return o.value == _this10.state.original_user_data.organization_id;
      });
      this.setState({
        managed_user_data: this.state.original_user_data,
        selected_organization: selected_organization
      }, function () {
        return _this10.hasUnsavedDataAction();
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this11 = this;

      var ud = this.state.managed_user_data;
      var e = this.props.errors;
      var disabled = this.props.disabled;
      var error_classes = {
        first_name: e.first_name ? 'is-invalid' : '',
        last_name: e.last_name ? 'is-invalid' : '',
        username: e.username ? 'is-invalid' : '',
        email: e.email ? 'is-invalid' : '',
        organization: e.organization_id ? 'is-invalid' : ''
      };
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "tab-pane--react"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", {
        className: "no-bold"
      }, ud.name ? ud.name + ': ' : '', gettext("Profile")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("form", {
        className: "form"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "label--required",
        htmlFor: "user-first-name-input"
      }, gettext("Preferred First Name")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        disabled: disabled || this.hasMCEmail,
        className: "form-control " + error_classes.first_name,
        type: "text",
        value: ud.first_name || '',
        onChange: function onChange(e) {
          return _this11.updateFirstName(e.target.value);
        },
        id: "user-first-name-input",
        required: true
      }), e.first_name && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "invalid-feedback"
      }, e.first_name)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "label--required",
        htmlFor: "user-last-name-input"
      }, gettext("Preferred Last Name")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        disabled: disabled || this.hasMCEmail,
        className: "form-control " + error_classes.last_name,
        type: "text",
        value: ud.last_name || '',
        onChange: function onChange(e) {
          return _this11.updateLastName(e.target.value);
        },
        id: "user-last-name-input",
        required: true
      }), e.last_name && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "invalid-feedback"
      }, e.last_name)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "label--required",
        htmlFor: "user-username-input"
      }, gettext("Username")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        disabled: disabled || this.hasMCEmail,
        className: "form-control " + error_classes.username,
        type: "text",
        value: ud.username || '',
        onChange: function onChange(e) {
          return _this11.updateUsername(e.target.value);
        },
        id: "user-username-input",
        required: true
      }), e.username && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "invalid-feedback"
      }, e.username)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "label--required",
        htmlFor: "user-organization-input"
      }, gettext("Organization")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_1__["default"], {
        isDisabled: disabled || this.hasMCEmail,
        className: "react-select " + error_classes.organization,
        value: this.state.selected_organization,
        options: this.state.organization_listing,
        onChange: function onChange(e) {
          return _this11.updateOrganization(e);
        } // # Translators: This is the default option for a dropdown menu
        ,
        placeholder: gettext("None Selected"),
        id: "user-organization-input"
      }), e.organization_id && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "invalid-feedback feedback--react-select"
      }, e.organization_id)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        htmlFor: "user-title-input"
      }, gettext("Title")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        disabled: disabled,
        maxLength: "50",
        type: "text",
        value: ud.title || '',
        onChange: function onChange(e) {
          return _this11.updateTitle(e.target.value);
        },
        className: "form-control",
        id: "user-title-input"
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "label--required",
        htmlFor: "user-email-input"
      }, gettext("Email")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        disabled: disabled || this.hasMCEmail,
        className: "form-control " + error_classes.email,
        type: "email",
        value: ud.email || '',
        onChange: function onChange(e) {
          return _this11.updateEmail(e.target.value);
        },
        id: "user-email-input"
      }), e.email && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "invalid-feedback"
      }, e.email)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        htmlFor: "user-phone-input"
      }, gettext("Phone")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        disabled: disabled,
        type: "tel",
        value: ud.phone_number || '',
        onChange: function onChange(e) {
          return _this11.updatePhone(e.target.value);
        },
        className: "form-control",
        id: "user-phone-input"
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        htmlFor: "user-mode-of-contact-input"
      }, gettext("Preferred Mode of Contact")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        disabled: disabled,
        type: "text",
        value: ud.mode_of_contact || '',
        onChange: function onChange(e) {
          return _this11.updateModeOfContact(e.target.value);
        },
        className: "form-control",
        id: "user-mode-of-contact-input"
      })), this.props["new"] && !disabled && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group btn-row"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-primary",
        type: "button",
        onClick: function onClick(e) {
          return _this11.saveNew(e);
        }
      }, gettext("Save changes")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-secondary",
        onClick: function onClick(e) {
          return _this11.saveNewAndAddAnother(e);
        }
      }, gettext("Save And Add Another")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-reset",
        type: "button",
        onClick: function onClick() {
          return _this11.resetForm();
        }
      }, gettext("Reset"))), !this.props["new"] && !disabled && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group btn-row"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-primary",
        type: "button",
        onClick: function onClick(e) {
          return _this11.save();
        }
      }, gettext("Save changes")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-reset",
        type: "button",
        onClick: function onClick() {
          return _this11.resetForm();
        }
      }, gettext("Reset")))));
    }
  }]);

  return EditUserProfile;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component)) || _class;



/***/ }),

/***/ "9KAa":
/*!******************************************************!*\
  !*** ./js/pages/tola_management_pages/user/index.js ***!
  \******************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "i8i4");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./models */ "iEWS");
/* harmony import */ var _views__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./views */ "hw7v");




var app_root = '#app_root';
/*
 * Model/Store setup
 */

var store = new _models__WEBPACK_IMPORTED_MODULE_2__["UserStore"](jsContext);
react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_views__WEBPACK_IMPORTED_MODULE_3__["IndexView"], {
  store: store
}), document.querySelector(app_root));

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

/***/ "F9bR":
/*!*****************************************************************************!*\
  !*** ./js/pages/tola_management_pages/user/components/edit_user_history.js ***!
  \*****************************************************************************/
/*! exports provided: EditUserHistory, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EditUserHistory", function() { return EditUserHistory; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-select */ "Cs6D");
/* harmony import */ var react_virtualized__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-virtualized */ "c7k8");
/* harmony import */ var components_changelog__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! components/changelog */ "KnAV");
var _class, _temp;

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






var status_options = [{
  value: true,
  label: gettext('Active')
}, {
  value: false,
  label: gettext('Inactive')
}];
var EditUserHistory = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class = (_temp = /*#__PURE__*/function (_React$Component) {
  _inherits(EditUserHistory, _React$Component);

  var _super = _createSuper(EditUserHistory);

  function EditUserHistory(props) {
    var _this;

    _classCallCheck(this, EditUserHistory);

    _this = _super.call(this, props);

    _this.toggleChangeLogRowExpando = function (row_id) {
      _this.props.store.toggleChangeLogRowExpando(row_id);
    };

    _this.state = {
      original_user_data: {
        user: {
          is_active: props.userData.user.is_active
        }
      },
      user_data: {
        user: {
          is_active: props.userData.user.is_active
        }
      }
    };
    return _this;
  }

  _createClass(EditUserHistory, [{
    key: "save",
    value: function save() {
      this.props.onSave(this.state.user_data);
    }
  }, {
    key: "onChange",
    value: function onChange(new_value) {
      var _this2 = this;

      this.setState({
        user_data: {
          user: {
            is_active: new_value.value
          }
        }
      }, function () {
        return _this2.hasUnsavedDataAction();
      });
    }
  }, {
    key: "onResendRegistrationEmail",
    value: function onResendRegistrationEmail() {
      this.props.onResendRegistrationEmail();
    }
  }, {
    key: "hasUnsavedDataAction",
    value: function hasUnsavedDataAction() {
      this.props.onIsDirtyChange(this.state.user_data.user.is_active == this.state.user_data.user.is_active);
    }
  }, {
    key: "onReset",
    value: function onReset() {
      var _this3 = this;

      this.setState({
        user_data: this.state.original_user_data
      }, function () {
        return _this3.hasUnsavedDataAction();
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var selected = status_options.find(function (option) {
        return option.value == _this4.state.user_data.user.is_active;
      });
      var _this$props = this.props,
          history = _this$props.history,
          store = _this$props.store;
      var changelog_expanded_rows = store.changelog_expanded_rows;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "edit-user-history"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", {
        className: "no-bold"
      }, this.state.user_data.name ? this.state.user_data.name + ': ' : '', gettext("Status and History")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-secondary",
        onClick: function onClick() {
          return _this4.onResendRegistrationEmail();
        }
      }, gettext("Resend Registration Email"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "label--required",
        htmlFor: "user-status-input"
      }, gettext("Status")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_2__["default"], {
        isDisabled: this.props.disabled,
        options: status_options,
        value: selected,
        id: "user-status-input",
        onChange: function onChange(new_value) {
          return _this4.onChange(new_value);
        }
      })), !this.props.disabled && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-primary",
        type: "button",
        onClick: function onClick() {
          return _this4.save();
        }
      }, gettext("Save Changes")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-reset",
        type: "button",
        onClick: function onClick() {
          return _this4.onReset();
        }
      }, gettext("Reset"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_changelog__WEBPACK_IMPORTED_MODULE_4__["default"], {
        data: history,
        expanded_rows: changelog_expanded_rows,
        toggle_expando_cb: function toggle_expando_cb(row_id) {
          return store.toggleChangeLogRowExpando(row_id);
        }
      }));
    }
  }]);

  return EditUserHistory;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _temp)) || _class;
/* harmony default export */ __webpack_exports__["default"] = (EditUserHistory);

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

/***/ "LX42":
/*!****************************************************!*\
  !*** ./js/pages/tola_management_pages/user/api.js ***!
  \****************************************************/
/*! exports provided: fetchUsersWithFilter, fetchUser, saveUserProfile, updateUserIsActive, fetchUserProgramAccess, saveUserPrograms, fetchUserHistory, createUser, resendRegistrationEmail, bulkUpdateUserStatus, bulkAddPrograms, bulkRemovePrograms, fetchUserAggregates, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchUsersWithFilter", function() { return fetchUsersWithFilter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchUser", function() { return fetchUser; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "saveUserProfile", function() { return saveUserProfile; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateUserIsActive", function() { return updateUserIsActive; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchUserProgramAccess", function() { return fetchUserProgramAccess; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "saveUserPrograms", function() { return saveUserPrograms; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchUserHistory", function() { return fetchUserHistory; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createUser", function() { return createUser; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resendRegistrationEmail", function() { return resendRegistrationEmail; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bulkUpdateUserStatus", function() { return bulkUpdateUserStatus; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bulkAddPrograms", function() { return bulkAddPrograms; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bulkRemovePrograms", function() { return bulkRemovePrograms; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchUserAggregates", function() { return fetchUserAggregates; });
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../api */ "XoI5");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


var fetchUsersWithFilter = function fetchUsersWithFilter(page, filters) {
  return _api__WEBPACK_IMPORTED_MODULE_0__["api"].get('/tola_management/user/', {
    params: _objectSpread({
      page: page
    }, filters)
  }).then(function (response) {
    var data = response.data;
    var total_results_count = data.count;
    var current_results_count = data.results.length;
    var total_pages = data.page_count;
    return {
      users: data.results,
      total_pages: total_pages,
      total_users: total_results_count,
      next_page: data.next,
      prev_page: data.previous
    };
  });
};
var fetchUser = function fetchUser(user_id) {
  return _api__WEBPACK_IMPORTED_MODULE_0__["api"].get("/tola_management/user/".concat(user_id, "/")).then(function (response) {
    return response.data;
  });
};
var saveUserProfile = function saveUserProfile(user_id, data) {
  return _api__WEBPACK_IMPORTED_MODULE_0__["api"].put("/tola_management/user/".concat(user_id, "/"), data).then(function (response) {
    return response.data;
  });
};
var updateUserIsActive = function updateUserIsActive(user_id, data) {
  return _api__WEBPACK_IMPORTED_MODULE_0__["api"].put("/tola_management/user/".concat(user_id, "/is_active/"), data).then(function (response) {
    return response.data;
  });
};
var fetchUserProgramAccess = function fetchUserProgramAccess(user_id) {
  return _api__WEBPACK_IMPORTED_MODULE_0__["api"].get("/tola_management/user/".concat(user_id, "/program_access/")).then(function (response) {
    return response.data;
  });
};
var saveUserPrograms = function saveUserPrograms(user_id, data) {
  return _api__WEBPACK_IMPORTED_MODULE_0__["api"].put("/tola_management/user/".concat(user_id, "/program_access/"), data).then(function (response) {});
};
var fetchUserHistory = function fetchUserHistory(user_id) {
  return _api__WEBPACK_IMPORTED_MODULE_0__["api"].get("/tola_management/user/".concat(user_id, "/history/")).then(function (response) {
    return response.data;
  });
};
var createUser = function createUser(new_user_data) {
  return _api__WEBPACK_IMPORTED_MODULE_0__["api"].post("/tola_management/user/", new_user_data).then(function (response) {
    return response.data;
  });
};
var resendRegistrationEmail = function resendRegistrationEmail(user_id) {
  return _api__WEBPACK_IMPORTED_MODULE_0__["api"].post("/tola_management/user/".concat(user_id, "/resend_registration_email/"), {}).then(function (response) {
    return response.data;
  });
};
var bulkUpdateUserStatus = function bulkUpdateUserStatus(user_ids, new_status) {
  return _api__WEBPACK_IMPORTED_MODULE_0__["api"].post("/tola_management/user/bulk_update_status/", {
    user_ids: user_ids,
    new_status: new_status
  }).then(function (response) {
    return response.data;
  });
};
var bulkAddPrograms = function bulkAddPrograms(user_ids, added_programs) {
  return _api__WEBPACK_IMPORTED_MODULE_0__["api"].post("/tola_management/user/bulk_add_programs/", {
    user_ids: user_ids,
    added_programs: added_programs
  }).then(function (response) {
    return response.data;
  });
};
var bulkRemovePrograms = function bulkRemovePrograms(user_ids, removed_programs) {
  return _api__WEBPACK_IMPORTED_MODULE_0__["api"].post("/tola_management/user/bulk_remove_programs/", {
    user_ids: user_ids,
    removed_programs: removed_programs
  }).then(function (response) {
    return response.data;
  });
};
var fetchUserAggregates = function fetchUserAggregates(user_id) {
  return _api__WEBPACK_IMPORTED_MODULE_0__["api"].get("/tola_management/user/".concat(user_id, "/aggregate_data/")).then(function (response) {
    return response.data;
  });
};
/* harmony default export */ __webpack_exports__["default"] = ({
  fetchUsersWithFilter: fetchUsersWithFilter,
  fetchUser: fetchUser,
  saveUserProfile: saveUserProfile,
  fetchUserProgramAccess: fetchUserProgramAccess,
  saveUserPrograms: saveUserPrograms,
  fetchUserHistory: fetchUserHistory,
  createUser: createUser,
  resendRegistrationEmail: resendRegistrationEmail,
  bulkUpdateUserStatus: bulkUpdateUserStatus,
  bulkAddPrograms: bulkAddPrograms,
  bulkRemovePrograms: bulkRemovePrograms,
  fetchUserAggregates: fetchUserAggregates,
  updateUserIsActive: updateUserIsActive
});

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

/***/ "hw7v":
/*!******************************************************!*\
  !*** ./js/pages/tola_management_pages/user/views.js ***!
  \******************************************************/
/*! exports provided: IndexView */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IndexView", function() { return IndexView; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-select */ "Cs6D");
/* harmony import */ var components_checkboxed_multi_select__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! components/checkboxed-multi-select */ "Z2Y6");
/* harmony import */ var components_management_table__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! components/management-table */ "TGVD");
/* harmony import */ var _components_user_editor__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/user_editor */ "pyWi");
/* harmony import */ var _components_edit_user_profile__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/edit_user_profile */ "6iO6");
/* harmony import */ var _components_edit_user_programs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/edit_user_programs */ "4BAa");
/* harmony import */ var _components_edit_user_history__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/edit_user_history */ "F9bR");
/* harmony import */ var components_pagination__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! components/pagination */ "RCjz");
/* harmony import */ var components_loading_spinner__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! components/loading-spinner */ "DDFe");
/* harmony import */ var components_folding_sidebar__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! components/folding-sidebar */ "tnXs");
/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @fortawesome/react-fontawesome */ "IP2g");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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













 // # Translators: Nothing selected by user

var selection_placeholder = gettext("None Selected");
var UserFilter = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref) {
  var store = _ref.store,
      selections = _ref.selections;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "form-group react-multiselect-checkbox"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    htmlFor: "users_filter"
  }, gettext("Find a User")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_checkboxed_multi_select__WEBPACK_IMPORTED_MODULE_3__["default"], {
    value: store.filters.users,
    options: selections,
    onChange: function onChange(e) {
      return store.changeUserFilter(e);
    },
    placeholder: selection_placeholder,
    id: "users_filter"
  }));
});
var CountryFilter = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref2) {
  var store = _ref2.store,
      selections = _ref2.selections;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "form-group react-multiselect-checkbox"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    htmlFor: "countries_permitted_filter"
  }, gettext("Countries Permitted")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_checkboxed_multi_select__WEBPACK_IMPORTED_MODULE_3__["default"], {
    value: store.filters.countries,
    options: selections,
    onChange: function onChange(e) {
      return store.changeCountryFilter(e);
    },
    placeholder: selection_placeholder,
    id: "countries_permitted_filter"
  }));
});
var BaseCountryFilter = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref3) {
  var store = _ref3.store,
      selections = _ref3.selections;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "form-group react-multiselect-checkbox"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    htmlFor: "base_country_filter"
  }, gettext("Base Country")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_checkboxed_multi_select__WEBPACK_IMPORTED_MODULE_3__["default"], {
    value: store.filters.base_countries,
    options: selections,
    onChange: function onChange(e) {
      return store.changeBaseCountryFilter(e);
    },
    placeholder: selection_placeholder,
    id: "base_country_filter"
  }));
});
var ProgramFilter = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref4) {
  var store = _ref4.store,
      selections = _ref4.selections;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "form-group react-multiselect-checkbox"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    htmlFor: "programs_filter"
  }, gettext("Programs")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_checkboxed_multi_select__WEBPACK_IMPORTED_MODULE_3__["default"], {
    value: store.filters.programs,
    options: selections,
    onChange: function onChange(e) {
      return store.changeProgramFilter(e);
    },
    placeholder: selection_placeholder,
    id: "programs_filter"
  }));
});

var SetUserStatusBulkAction = /*#__PURE__*/function (_React$Component) {
  _inherits(SetUserStatusBulkAction, _React$Component);

  var _super = _createSuper(SetUserStatusBulkAction);

  function SetUserStatusBulkAction(props) {
    var _this;

    _classCallCheck(this, SetUserStatusBulkAction);

    _this = _super.call(this, props);
    _this.state = {
      value: []
    };
    return _this;
  }

  _createClass(SetUserStatusBulkAction, [{
    key: "onChange",
    value: function onChange(new_val) {
      this.setState({
        value: new_val
      });
    }
  }, {
    key: "onApply",
    value: function onApply() {
      this.props.onApply(this.state.value);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_2__["default"], {
        options: this.props.options,
        value: this.state.value,
        onChange: function onChange(val) {
          return _this2.onChange(val);
        }
      });
    }
  }]);

  return SetUserStatusBulkAction;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

var UpdateProgramsBulkAction = /*#__PURE__*/function (_React$Component2) {
  _inherits(UpdateProgramsBulkAction, _React$Component2);

  var _super2 = _createSuper(UpdateProgramsBulkAction);

  function UpdateProgramsBulkAction(props) {
    var _this3;

    _classCallCheck(this, UpdateProgramsBulkAction);

    _this3 = _super2.call(this, props);
    _this3.state = {
      values: []
    };
    return _this3;
  }

  _createClass(UpdateProgramsBulkAction, [{
    key: "onChange",
    value: function onChange(new_vals) {
      this.setState({
        values: new_vals
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_checkboxed_multi_select__WEBPACK_IMPORTED_MODULE_3__["default"], {
        options: this.props.options,
        value: this.state.values,
        onChange: function onChange(val) {
          return _this4.onChange(val);
        }
      });
    }
  }]);

  return UpdateProgramsBulkAction;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

var BulkActions = /*#__PURE__*/function (_React$Component3) {
  _inherits(BulkActions, _React$Component3);

  var _super3 = _createSuper(BulkActions);

  function BulkActions(props) {
    var _this5;

    _classCallCheck(this, BulkActions);

    _this5 = _super3.call(this, props);
    _this5.active_child = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createRef();
    _this5.state = {
      current_action: null,
      current_vals: []
    };
    return _this5;
  }

  _createClass(BulkActions, [{
    key: "onActionChanged",
    value: function onActionChanged(new_action) {
      this.setState({
        current_action: new_action.value,
        current_vals: []
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
      var _this6 = this;

      var selected = this.props.secondaryOptions[this.state.current_action];
      var SecondaryComponent = selected && selected.component;
      var apply_disabled = !this.state.current_action || Array.isArray(this.state.current_vals) && !this.state.current_vals.length || !this.state.current_vals;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "controls__bulk-actions"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "bulk__select"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_2__["default"], {
        placeholder: gettext("Bulk Actions"),
        value: this.props.primaryOptions.find(function (o) {
          return o.value == _this6.state.current_action;
        }),
        options: this.props.primaryOptions,
        onChange: function onChange(val) {
          return _this6.onActionChanged(val);
        }
      })), selected && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "bulk__select"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SecondaryComponent, {
        placeholder: gettext("Select..."),
        value: this.state.current_vals,
        onChange: function onChange(vals) {
          return _this6.onChange(vals);
        }
      })), !selected && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "bulk__select"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_2__["default"], {
        placeholder: "---",
        noOptionsMessage: function noOptionsMessage() {
          return gettext('No options');
        }
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-secondary",
        disabled: apply_disabled,
        onClick: function onClick() {
          return _this6.onApply();
        }
      }, gettext('Apply')));
    }
  }]);

  return BulkActions;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

var IndexView = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref5) {
  var store = _ref5.store;
  var programOptions = store.program_selections;
  var bulk_actions = {
    primary_options: [// # Translators: Set an account to active or inactive
    {
      label: gettext('Set account status'),
      value: 'set_account_status'
    }, // # Translators: Associate a user with a program granting permission
    {
      label: gettext('Add to program'),
      value: 'add_to_program'
    }, // # Translators: Disassociate a user with a program removing permission
    {
      label: gettext('Remove from program'),
      value: 'remove_from_program'
    }],
    secondary_options: {
      set_account_status: {
        component: function component(props) {
          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_2__["default"], _extends({
            options: store.user_status_options
          }, props));
        },
        onApply: function onApply(option) {
          return store.bulkUpdateUserStatus(option.value);
        }
      },
      add_to_program: {
        component: function component(props) {
          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_checkboxed_multi_select__WEBPACK_IMPORTED_MODULE_3__["default"], _extends({
            options: store.program_bulk_selections
          }, props));
        },
        onApply: function onApply(vals) {
          return store.bulkAddPrograms(vals.map(function (option) {
            return option.value;
          }));
        }
      },
      remove_from_program: {
        component: function component(props) {
          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_checkboxed_multi_select__WEBPACK_IMPORTED_MODULE_3__["default"], _extends({
            options: store.program_bulk_selections
          }, props));
        },
        onApply: function onApply(vals) {
          return store.bulkRemovePrograms(vals.map(function (option) {
            return option.value;
          }));
        }
      }
    }
  };
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    id: "user-management-index-view",
    className: "row"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_folding_sidebar__WEBPACK_IMPORTED_MODULE_11__["default"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "filter-section"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(CountryFilter, {
    store: store,
    selections: store.countries_selections
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(BaseCountryFilter, {
    store: store,
    selections: store.countries_selections
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ProgramFilter, {
    store: store,
    selections: store.program_selections
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "form-group react-multiselect-checkbox"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    htmlFor: "organization_filter"
  }, gettext("Organization")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_checkboxed_multi_select__WEBPACK_IMPORTED_MODULE_3__["default"], {
    value: store.filters.organizations,
    options: store.organization_selections,
    onChange: function onChange(e) {
      return store.changeOrganizationFilter(e);
    },
    placeholder: selection_placeholder,
    id: "organization_filter"
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    htmlFor: "status_filter"
  }, gettext("Status")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_2__["default"], {
    value: store.filters.user_status,
    options: store.user_status_options,
    onChange: function onChange(e) {
      return store.changeUserStatusFilter(e);
    },
    placeholder: selection_placeholder,
    id: "status_filter"
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    htmlFor: "admin_role_filter"
  }, gettext("Administrator?")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_2__["default"], {
    value: store.filters.admin_role,
    options: store.admin_role_options,
    onChange: function onChange(e) {
      return store.changeAdminRoleFilter(e);
    },
    placeholder: selection_placeholder,
    id: "admin_role_filter"
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
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
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h1", null, gettext("Admin:"), " ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("small", null, gettext("Users")))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "admin-list__controls"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(BulkActions, {
    primaryOptions: bulk_actions.primary_options,
    secondaryOptions: bulk_actions.secondary_options
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "controls__buttons"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
    href: "#",
    tabIndex: "0",
    className: "btn btn-link btn-add",
    onClick: function onClick() {
      return store.createUser();
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
    className: "fas fa-plus-circle"
  }), gettext("Add user")))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "admin-list__top-filter"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(UserFilter, {
    store: store,
    selections: store.user_selections
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_loading_spinner__WEBPACK_IMPORTED_MODULE_10__["default"], {
    isLoading: store.fetching_users_listing || store.applying_bulk_updates
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "admin-list__table"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_management_table__WEBPACK_IMPORTED_MODULE_4__["default"], {
    data: store.users_listing.map(function (id) {
      return store.users[id];
    }),
    keyField: "id",
    HeaderRow: function HeaderRow(_ref6) {
      var Col = _ref6.Col,
          Row = _ref6.Row;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Row, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, {
        size: "0.5"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "checkbox",
        checked: store.bulk_targets_all,
        onChange: function onChange() {
          return store.toggleBulkTargetsAll();
        }
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, {
        size: "2",
        className: "td--stretch"
      }, gettext("User")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, null, gettext("Organization")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, null, gettext("Programs")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, {
        size: "0.25"
      }, gettext("Status")));
    },
    Row: function Row(_ref7) {
      var Col = _ref7.Col,
          Row = _ref7.Row,
          data = _ref7.data;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Row, {
        expanded: data.id == store.editing_target,
        Expando: Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref8) {
          var Wrapper = _ref8.Wrapper;
          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Wrapper, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_user_editor__WEBPACK_IMPORTED_MODULE_5__["default"], {
            notifyPaneChange: function notifyPaneChange(new_pane) {
              return store.onProfilePaneChange(new_pane);
            },
            "new": data.id == 'new',
            active_pane: store.active_editor_pane,
            ProfileSection: Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function () {
              return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_loading_spinner__WEBPACK_IMPORTED_MODULE_10__["default"], {
                isLoading: store.fetching_editing_target || store.saving_user_profile || store.saving_user_programs
              }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_edit_user_profile__WEBPACK_IMPORTED_MODULE_6__["default"], {
                disabled: data.organization_id == 1 && !store.is_superuser && data.id != 'new',
                is_superuser: store.is_superuser,
                "new": data.id == 'new',
                userData: store.editing_target_data.profile,
                errors: store.editing_errors,
                key: store.editing_target_data.profile.id,
                onUpdate: function onUpdate(new_user_data) {
                  return store.updateUserProfile(data.id, new_user_data);
                },
                onCreate: function onCreate(new_user_data) {
                  return store.saveNewUser(new_user_data);
                },
                onCreateAndAddAnother: function onCreateAndAddAnother(new_user_data) {
                  return store.saveNewUserAndAddAnother(new_user_data);
                },
                organizations: store.organization_selections,
                onIsDirtyChange: function onIsDirtyChange(is_dirty) {
                  return store.setActiveFormIsDirty(is_dirty);
                }
              }));
            }),
            ProgramSection: Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function () {
              return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_loading_spinner__WEBPACK_IMPORTED_MODULE_10__["default"], {
                isLoading: store.fetching_editing_target || store.saving_user_profile || store.saving_user_programs
              }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_edit_user_programs__WEBPACK_IMPORTED_MODULE_7__["default"], {
                store: store,
                user: data,
                adminUserProgramRoles: store.access.program,
                adminUserCountryRoles: store.access.countries,
                onSave: function onSave(new_program_data) {
                  return store.saveUserPrograms(data.id, new_program_data);
                },
                onIsDirtyChange: function onIsDirtyChange(is_dirty) {
                  return store.setActiveFormIsDirty(is_dirty);
                }
              }));
            }),
            HistorySection: Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function () {
              return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_loading_spinner__WEBPACK_IMPORTED_MODULE_10__["default"], {
                isLoading: store.fetching_editing_target || store.saving_user_profile || store.saving_user_programs
              }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_edit_user_history__WEBPACK_IMPORTED_MODULE_8__["default"], {
                store: store,
                disabled: data.organization_id == 1 && !store.is_superuser,
                userData: store.editing_target_data.profile,
                history: store.editing_target_data.history,
                onResendRegistrationEmail: function onResendRegistrationEmail() {
                  return store.resendRegistrationEmail(data.id);
                },
                onSave: function onSave(new_data) {
                  return store.updateUserIsActive(data.id, new_data);
                },
                onIsDirtyChange: function onIsDirtyChange(is_dirty) {
                  return store.setActiveFormIsDirty(is_dirty);
                }
              }));
            })
          }));
        })
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, {
        size: "0.5"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "checkbox",
        checked: store.bulk_targets.get(data.id) || false,
        onChange: function onChange() {
          return store.toggleBulkTarget(data.id);
        }
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, {
        size: "2",
        className: "td--stretch"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "expando-toggle icon__clickable",
        onClick: function onClick() {
          return store.toggleEditingTarget(data.id);
        }
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "expando-toggle__icon"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_12__["FontAwesomeIcon"], {
        icon: store.editing_target == data.id ? 'caret-down' : 'caret-right'
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "expando-toggle__label"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-user"
      }), "\xA0", data.name || "---", " ", data.is_super && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "badge badge-danger"
      }, gettext("Super Admin"))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-building"
      }), "\xA0", data.organization_name || "---"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, {
        className: "text-nowrap"
      }, data.user_programs ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "/tola_management/program/?users[]=".concat(data.id)
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-cubes"
      }), "\xA0", // # Translators: preceded by a number, i.e. "3 programs" or "1 program"
      interpolate(ngettext("%s program", "%s programs", data.user_programs), [data.user_programs])) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-cubes"
      }), "\xA0", // # Translators: when no programs are connected to the item
      gettext("0 programs"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, {
        size: "0.25"
      }, data.is_active ? gettext('Active') : gettext('Inactive')));
    }
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "admin-list__metadata"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "metadata__count text-muted text-small"
  }, store.users_count ? "".concat(store.users_count, " ").concat(gettext("users")) : "--"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "metadata__controls"
  }, store.total_pages && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_pagination__WEBPACK_IMPORTED_MODULE_9__["default"], {
    pageCount: store.total_pages,
    initialPage: store.current_page,
    onPageChange: function onPageChange(page) {
      return store.changePage(page);
    }
  })))));
});

/***/ }),

/***/ "iEWS":
/*!*******************************************************!*\
  !*** ./js/pages/tola_management_pages/user/models.js ***!
  \*******************************************************/
/*! exports provided: UserStore, CountryStore */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserStore", function() { return UserStore; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CountryStore", function() { return CountryStore; });
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mobx */ "2vnA");
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./api */ "LX42");
/* harmony import */ var _general_utilities__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../general_utilities */ "WtQ/");
var _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, _descriptor25, _descriptor26, _descriptor27, _descriptor28, _descriptor29, _descriptor30, _descriptor31, _descriptor32, _descriptor33, _temp, _class3, _descriptor34, _descriptor35, _descriptor36, _descriptor37, _temp2;

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

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




var default_user = {
  id: null,
  first_name: "",
  last_name: "",
  username: "",
  email: "",
  phone_number: "",
  organization_id: null,
  mode_of_contact: "",
  title: "",
  user_programs: 0,
  user: {
    is_active: true
  }
};
var default_editing_target_data = {
  profile: _objectSpread({}, default_user),
  access: {
    country: {},
    programs: []
  },
  history: []
};
var UserStore = (_class = (_temp = /*#__PURE__*/function () {
  //filter options
  // UI state - track what history rows are expanded
  function UserStore(_ref) {
    var _this = this;

    var regions = _ref.regions,
        countries = _ref.countries,
        organizations = _ref.organizations,
        programs = _ref.programs,
        users = _ref.users,
        access = _ref.access,
        is_superuser = _ref.is_superuser,
        programs_filter = _ref.programs_filter,
        country_filter = _ref.country_filter,
        organizations_filter = _ref.organizations_filter,
        program_role_choices = _ref.program_role_choices,
        country_role_choices = _ref.country_role_choices;

    _classCallCheck(this, UserStore);

    _initializerDefineProperty(this, "users", _descriptor, this);

    _initializerDefineProperty(this, "users_listing", _descriptor2, this);

    _initializerDefineProperty(this, "users_count", _descriptor3, this);

    _initializerDefineProperty(this, "fetching_users_listing", _descriptor4, this);

    _initializerDefineProperty(this, "current_page", _descriptor5, this);

    _initializerDefineProperty(this, "total_pages", _descriptor6, this);

    _initializerDefineProperty(this, "bulk_targets", _descriptor7, this);

    _initializerDefineProperty(this, "bulk_targets_all", _descriptor8, this);

    _initializerDefineProperty(this, "applying_bulk_updates", _descriptor9, this);

    _initializerDefineProperty(this, "saving_user_profile", _descriptor10, this);

    _initializerDefineProperty(this, "saving_user_programs", _descriptor11, this);

    _initializerDefineProperty(this, "access", _descriptor12, this);

    _initializerDefineProperty(this, "is_superuser", _descriptor13, this);

    _initializerDefineProperty(this, "fetching_editing_target", _descriptor14, this);

    _initializerDefineProperty(this, "editing_target", _descriptor15, this);

    _initializerDefineProperty(this, "editing_target_data", _descriptor16, this);

    _initializerDefineProperty(this, "editing_errors", _descriptor17, this);

    _initializerDefineProperty(this, "new_user", _descriptor18, this);

    _initializerDefineProperty(this, "countries", _descriptor19, this);

    _initializerDefineProperty(this, "ordered_country_ids", _descriptor20, this);

    _initializerDefineProperty(this, "organizations", _descriptor21, this);

    _initializerDefineProperty(this, "programs", _descriptor22, this);

    _initializerDefineProperty(this, "available_users", _descriptor23, this);

    _initializerDefineProperty(this, "countries_selections", _descriptor24, this);

    _initializerDefineProperty(this, "organization_selections", _descriptor25, this);

    _initializerDefineProperty(this, "program_selections", _descriptor26, this);

    _initializerDefineProperty(this, "user_selections", _descriptor27, this);

    _initializerDefineProperty(this, "program_bulk_selections", _descriptor28, this);

    _initializerDefineProperty(this, "unsaved_changes_actions", _descriptor29, this);

    _initializerDefineProperty(this, "active_editor_pane", _descriptor30, this);

    this.active_pane_is_dirty = false;
    this.country_role_choices = [];
    this.program_role_choices = [];
    this.user_status_options = [{
      value: 1,
      label: gettext('Active')
    }, {
      value: 0,
      label: gettext('Inactive')
    }];
    this.admin_role_options = [{
      value: 1,
      label: gettext('Yes')
    }, {
      value: 0,
      label: gettext('No')
    }];

    _initializerDefineProperty(this, "filters", _descriptor31, this);

    _initializerDefineProperty(this, "appliedFilters", _descriptor32, this);

    _initializerDefineProperty(this, "changelog_expanded_rows", _descriptor33, this);

    this.regions = regions;
    this.countries = countries;
    this.ordered_country_ids = Object.values(countries).sort(function (a, b) {
      return a.name.localeCompare(b.name);
    }).map(function (country) {
      return country.id;
    });
    this.organizations = organizations;
    this.programs = programs;
    this.available_users = users.filter(function (user) {
      return user.name;
    });
    this.countries_selections = Object(_general_utilities__WEBPACK_IMPORTED_MODULE_2__["sortObjectListByValue"])(this.ordered_country_ids.map(function (id) {
      return _this.countries[id];
    }).map(function (country) {
      return {
        value: country.id,
        label: country.name
      };
    }));
    this.organization_selections = Object(_general_utilities__WEBPACK_IMPORTED_MODULE_2__["sortObjectListByValue"])(Object.values(organizations).map(function (org) {
      return {
        value: org.id,
        label: org.name
      };
    }));
    this.program_selections = this.createProgramSelections(this.programs);
    this.user_selections = this.available_users.map(function (user) {
      return {
        value: user.id,
        label: user.name
      };
    });
    this.program_bulk_selections = this.ordered_country_ids.map(function (id) {
      return _this.countries[id];
    }).map(function (country) {
      return {
        label: country.name,
        options: country.programs.map(function (program_id) {
          return {
            label: country.name + ": " + programs[program_id].name,
            value: country.id + "_" + program_id
          };
        })
      };
    });
    this.access = access;
    this.is_superuser = is_superuser;
    this.filters.programs = programs_filter.map(function (id) {
      return _this.programs[id];
    }).map(function (program) {
      return {
        label: program.name,
        value: program.id
      };
    });
    this.filters.organizations = organizations_filter.map(function (id) {
      return _this.organizations[id];
    }).map(function (org) {
      return {
        label: org.name,
        value: org.id
      };
    });
    this.filters.countries = country_filter.map(function (id) {
      return _this.countries[id];
    }).map(function (country) {
      return {
        label: country.name,
        value: country.id
      };
    });
    this.country_role_choices = country_role_choices.map(function (_ref2) {
      var _ref3 = _slicedToArray(_ref2, 2),
          value = _ref3[0],
          label = _ref3[1];

      return {
        label: label,
        value: value
      };
    });
    this.program_role_choices = program_role_choices.map(function (_ref4) {
      var _ref5 = _slicedToArray(_ref4, 2),
          value = _ref5[0],
          label = _ref5[1];

      return {
        label: label,
        value: value
      };
    });
    this.appliedFilters = _objectSpread({}, this.filters);
    this.fetchUsers();
  }
  /*******************
  we turn the complex intermediate filter objects into simple lists for
  transmission to the api, (while retaining their filter keys)
   eg
   {
  ...
  countries: [{label: 'Afghanistan', value: 1}]
  }
   becomes
   {
  ...
  countries: [1]
  }
   */


  _createClass(UserStore, [{
    key: "marshalFilters",
    value: function marshalFilters(filters) {
      return Object.entries(filters).reduce(function (xs, x) {
        if (Array.isArray(x[1])) {
          xs[x[0]] = x[1].map(function (x) {
            return x.value;
          });
        } else {
          xs[x[0]] = x[1].value;
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
    key: "getSelectedBulkTargetIDs",
    value: function getSelectedBulkTargetIDs() {
      return _toConsumableArray(this.bulk_targets.entries()).filter(function (_ref6) {
        var _ref7 = _slicedToArray(_ref6, 2),
            _ = _ref7[0],
            selected = _ref7[1];

        return selected;
      }).map(function (_ref8) {
        var _ref9 = _slicedToArray(_ref8, 2),
            user_id = _ref9[0],
            _ = _ref9[1];

        return user_id;
      });
    }
  }, {
    key: "onSaveErrorHandler",
    value: function onSaveErrorHandler(message) {
      PNotify.error({
        // # Translators: Saving to the server failed
        text: message || gettext('Saving Failed'),
        delay: 5000
      });
    }
  }, {
    key: "onSaveSuccessHandler",
    value: function onSaveSuccessHandler(message) {
      // # Translators: Saving to the server succeeded
      PNotify.success({
        text: message || gettext('Successfully Saved'),
        delay: 5000
      });
    }
  }, {
    key: "createProgramSelections",
    value: function createProgramSelections(programs) {
      return Object(_general_utilities__WEBPACK_IMPORTED_MODULE_2__["sortObjectListByValue"])(Object.values(programs).map(function (program) {
        return {
          value: program.id,
          label: program.name
        };
      }));
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
    key: "fetchUsers",
    value: function fetchUsers() {
      var _this2 = this;

      if (this.dirtyConfirm()) {
        this.fetching_users_listing = true;
        _api__WEBPACK_IMPORTED_MODULE_1__["default"].fetchUsersWithFilter(this.current_page + 1, this.marshalFilters(this.appliedFilters)).then(function (results) {
          Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
            _this2.active_editor_pane = 'profile';
            _this2.active_pane_is_dirty = false;
            _this2.fetching_users_listing = false;
            _this2.users = results.users.reduce(function (xs, x) {
              xs[x.id] = x;
              return xs;
            }, {});
            _this2.users_listing = results.users.map(function (u) {
              return u.id;
            });
            _this2.bulk_targets_all = false;
            _this2.bulk_targets = new Map();
            _this2.users_count = results.total_users;
            _this2.total_pages = results.total_pages;
            _this2.next_page = results.next_page;
            _this2.previous_page = results.previous_page;
          });
        });
      }
    }
  }, {
    key: "applyFilters",
    value: function applyFilters() {
      this.appliedFilters = _objectSpread({}, this.filters);
      this.current_page = 0;
      this.fetchUsers();
    }
  }, {
    key: "changePage",
    value: function changePage(page) {
      if (page.selected != this.current_page) {
        this.current_page = page.selected;
        this.fetchUsers();
      }
    }
  }, {
    key: "toggleBulkTargetsAll",
    value: function toggleBulkTargetsAll() {
      var _this3 = this;

      this.bulk_targets_all = !this.bulk_targets_all;
      var user_ids = Object.values(this.users_listing);
      this.bulk_targets = new Map(user_ids.map(function (id) {
        return [id, _this3.bulk_targets_all];
      }));
    }
  }, {
    key: "toggleBulkTarget",
    value: function toggleBulkTarget(target_id) {
      this.bulk_targets.set(target_id, !this.bulk_targets.get(target_id));
    }
  }, {
    key: "changeCountryFilter",
    value: function changeCountryFilter(countries) {
      var _this4 = this;

      this.filters.countries = countries;

      if (countries.length == 0) {
        this.program_selections = this.createProgramSelections(this.programs);
      } else {
        var candidate_programs = countries.map(function (selection) {
          return selection.value;
        }).map(function (id) {
          return _this4.countries[id];
        }).flatMap(function (country) {
          return country.programs;
        });
        var selected_programs_set = new Set(candidate_programs);
        this.program_selections = this.createProgramSelections(Array.from(selected_programs_set).map(function (id) {
          return _this4.programs[id];
        }));
      }
    }
  }, {
    key: "changeBaseCountryFilter",
    value: function changeBaseCountryFilter(base_countries) {
      this.filters.base_countries = base_countries;
    }
  }, {
    key: "changeOrganizationFilter",
    value: function changeOrganizationFilter(organizations) {
      this.filters.organizations = organizations;
    }
  }, {
    key: "changeProgramFilter",
    value: function changeProgramFilter(programs) {
      this.filters.programs = programs;
    }
  }, {
    key: "changeUserStatusFilter",
    value: function changeUserStatusFilter(status) {
      this.filters.user_status = status;
    }
  }, {
    key: "changeAdminRoleFilter",
    value: function changeAdminRoleFilter(role) {
      this.filters.admin_role = role;
    }
  }, {
    key: "changeUserFilter",
    value: function changeUserFilter(users) {
      this.filters.users = users; // "Find a user" filter should immediately activate filters:

      this.applyFilters();
    }
  }, {
    key: "toggleEditingTarget",
    value: function toggleEditingTarget(user_id) {
      var _this5 = this;

      if (this.dirtyConfirm()) {
        this.editing_errors = {};
        this.editing_target_data = _objectSpread({}, default_editing_target_data);
        this.active_pane_is_dirty = false;

        if (this.editing_target == 'new') {
          this.users_listing.shift();
        }

        this.active_editor_pane = 'profile';

        if (this.editing_target == user_id) {
          this.editing_target = null;
        } else {
          this.editing_target = user_id;
          this.fetching_editing_target = true;
          Promise.all([_api__WEBPACK_IMPORTED_MODULE_1__["default"].fetchUser(user_id), _api__WEBPACK_IMPORTED_MODULE_1__["default"].fetchUserProgramAccess(user_id), _api__WEBPACK_IMPORTED_MODULE_1__["default"].fetchUserHistory(user_id)]).then(function (_ref10) {
            var _ref11 = _slicedToArray(_ref10, 3),
                user = _ref11[0],
                access_data = _ref11[1],
                history_data = _ref11[2];

            Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
              _this5.fetching_editing_target = false;
              _this5.editing_target_data = {
                profile: user,
                access: access_data,
                history: history_data
              };
            });
          });
        }
      }
    }
  }, {
    key: "updateActiveEditPage",
    value: function updateActiveEditPage(section_name) {
      this.active_edit_page = section_name;
      this.active_pane_is_dirty = false;
    }
  }, {
    key: "createUser",
    value: function createUser() {
      if (this.dirtyConfirm()) {
        this.editing_errors = {};
        this.active_pane_is_dirty = false;
        this.active_editor_pane = 'profile';

        if (this.editing_target == 'new') {
          this.users_listing.shift();
        }

        this.editing_target_data = _objectSpread({}, default_editing_target_data);
        this.users["new"] = {
          id: "new",
          name: "",
          organization_name: "",
          user_programs: 0,
          is_active: false
        };
        this.users_listing.unshift("new");
        this.editing_target = 'new';
      }
    }
  }, {
    key: "updateUserProfile",
    value: function updateUserProfile(user_id, new_user_data) {
      var _this6 = this;

      this.saving_user_profile = true;
      this.editing_errors = {};
      this.active_pane_is_dirty = false;
      _api__WEBPACK_IMPORTED_MODULE_1__["default"].saveUserProfile(user_id, new_user_data).then(function (result) {
        return Promise.all([_api__WEBPACK_IMPORTED_MODULE_1__["default"].fetchUserAggregates(result.id), _api__WEBPACK_IMPORTED_MODULE_1__["default"].fetchUserHistory(result.id)]).then(function (_ref12) {
          var _ref13 = _slicedToArray(_ref12, 2),
              aggregates = _ref13[0],
              history = _ref13[1];

          _this6.onSaveSuccessHandler();

          Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
            _this6.saving_user_profile = false;
            _this6.users[result.id] = {
              id: result.id,
              name: result.name,
              organization_name: _this6.organizations[result.organization_id].name,
              user_programs: aggregates.program_count,
              is_active: result.user.is_active
            };
            _this6.active_pane_is_dirty = false;
            _this6.editing_target_data.profile = result;
            _this6.editing_target_data.history = history;
          });
        });
      })["catch"](function (errors) {
        _this6.onSaveErrorHandler(errors.response.data.detail);

        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this6.saving_user_profile = false;
          _this6.editing_errors = errors.response.data;
        });
      });
    }
  }, {
    key: "updateUserIsActive",
    value: function updateUserIsActive(user_id, new_user_data) {
      var _this7 = this;

      this.saving_user_profile = true;
      this.editing_errors = {};
      this.active_pane_is_dirty = false;
      _api__WEBPACK_IMPORTED_MODULE_1__["default"].updateUserIsActive(user_id, new_user_data).then(function (result) {
        return Promise.all([_api__WEBPACK_IMPORTED_MODULE_1__["default"].fetchUserAggregates(user_id), _api__WEBPACK_IMPORTED_MODULE_1__["default"].fetchUserHistory(user_id)]).then(function (_ref14) {
          var _ref15 = _slicedToArray(_ref14, 2),
              aggregates = _ref15[0],
              history = _ref15[1];

          _this7.onSaveSuccessHandler();

          Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
            _this7.saving_user_profile = false;
            _this7.users[result.id] = {
              id: result.id,
              name: result.name,
              organization_name: _this7.organizations[result.organization_id].name,
              user_programs: aggregates.program_count,
              is_active: result.user.is_active
            };
            _this7.active_pane_is_dirty = false;
            _this7.editing_target_data.profile = result;
            _this7.editing_target_data.history = history;
          });
        });
      })["catch"](function (errors) {
        _this7.onSaveErrorHandler(errors.response.data.detail);

        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this7.saving_user_profile = false;
          _this7.editing_errors = errors.response.data;
        });
      });
    }
  }, {
    key: "resendRegistrationEmail",
    value: function resendRegistrationEmail(user_id) {
      var _this8 = this;

      this.saving_user_profile = true;
      _api__WEBPACK_IMPORTED_MODULE_1__["default"].resendRegistrationEmail(user_id).then(function (result) {
        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this8.saving_user_profile = false; // # Translators: An email was sent to the user to verify that the email address is valid

          _this8.onSaveSuccessHandler(gettext("Verification email sent"));
        });
      })["catch"](function () {
        // # Translators: Sending an email to the user did not work
        _this8.onSaveSuccessHandler(gettext("Verification email send failed"));
      });
    }
  }, {
    key: "saveNewUser",
    value: function saveNewUser(new_user_data) {
      var _this9 = this;

      this.saving_user_profile = true;
      this.editing_errors = {};
      this.active_pane_is_dirty = false;
      _api__WEBPACK_IMPORTED_MODULE_1__["default"].createUser(new_user_data).then(function (result) {
        return _api__WEBPACK_IMPORTED_MODULE_1__["default"].fetchUserAggregates(result.id).then(function (aggregates) {
          _this9.onSaveSuccessHandler();

          Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
            _this9.saving_user_profile = false;
            _this9.users[result.id] = {
              id: result.id,
              name: result.name,
              organization_name: _this9.organizations[result.organization_id].name,
              user_programs: aggregates.program_count,
              is_active: result.user.is_active
            };
            _this9.active_pane_is_dirty = false;

            _this9.user_selections.push({
              value: result.id,
              label: result.name
            });

            _this9.users_listing[0] = result.id;
            _this9.editing_target = null;

            _this9.toggleEditingTarget(result.id);

            delete _this9.users["new"];
          });
        });
      })["catch"](function (errors) {
        _this9.onSaveErrorHandler(errors.response.data.detail);

        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this9.saving_user_profile = false;
          _this9.editing_errors = errors.response.data;
        });
      });
    }
  }, {
    key: "saveNewUserAndAddAnother",
    value: function saveNewUserAndAddAnother(new_user_data) {
      var _this10 = this;

      this.saving_user_profile = true;
      this.editing_errors = {};
      this.active_pane_is_dirty = false;
      _api__WEBPACK_IMPORTED_MODULE_1__["default"].createUser(new_user_data).then(function (result) {
        return _api__WEBPACK_IMPORTED_MODULE_1__["default"].fetchUserAggregates(result.id).then(function (aggregates) {
          _this10.onSaveSuccessHandler();

          Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
            _this10.saving_user_profile = false;
            _this10.users[result.id] = {
              id: result.id,
              name: result.name,
              organization_name: _this10.organizations[result.organization_id].name,
              user_programs: aggregates.program_count,
              is_active: result.user.is_active
            };
            _this10.active_pane_is_dirty = false;

            _this10.user_selections.push({
              value: result.id,
              label: result.name
            });

            _this10.users_listing[0] = result.id;
            delete _this10.users["new"];

            _this10.createUser();
          });
        });
      })["catch"](function (errors) {
        _this10.onSaveErrorHandler(errors.response.data.detail);

        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this10.saving_user_profile = false;
          _this10.editing_errors = errors.response.data;
        });
      });
    }
  }, {
    key: "saveUserPrograms",
    value: function saveUserPrograms(user_id, new_user_programs_data) {
      var _this11 = this;

      this.saving_user_programs = true;
      this.active_pane_is_dirty = false;
      _api__WEBPACK_IMPORTED_MODULE_1__["default"].saveUserPrograms(user_id, new_user_programs_data).then(function (result) {
        return Promise.all([_api__WEBPACK_IMPORTED_MODULE_1__["default"].fetchUserAggregates(user_id), _api__WEBPACK_IMPORTED_MODULE_1__["default"].fetchUserHistory(user_id), _api__WEBPACK_IMPORTED_MODULE_1__["default"].fetchUserProgramAccess(user_id)]).then(function (_ref16) {
          var _ref17 = _slicedToArray(_ref16, 3),
              aggregates = _ref17[0],
              history = _ref17[1],
              access = _ref17[2];

          Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
            _this11.saving_user_programs = false;
            _this11.users[user_id].user_programs = aggregates.program_count;
            _this11.editing_target_data.history = history;
            _this11.editing_target_data.access = access;
            _this11.active_pane_is_dirty = false;
          });

          _this11.onSaveSuccessHandler();
        });
      })["catch"](function (errors) {
        _this11.onSaveErrorHandler(errors.response.data.detail);

        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this11.saving_user_programs = false;
        });
      });
    }
  }, {
    key: "bulkUpdateUserStatus",
    value: function bulkUpdateUserStatus(new_status) {
      var _this12 = this;

      this.applying_bulk_updates = true;
      _api__WEBPACK_IMPORTED_MODULE_1__["default"].bulkUpdateUserStatus(this.getSelectedBulkTargetIDs(), new_status).then(function (result) {
        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          result.forEach(function (updated) {
            var user = Object.assign(_this12.users[updated.id], updated);
            _this12.users[user.id] = user;
          });
          _this12.applying_bulk_updates = false;
        });

        _this12.onSaveSuccessHandler();
      })["catch"](function (response) {
        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this12.applying_bulk_updates = false;
        });

        _this12.onSaveErrorHandler();
      });
    }
  }, {
    key: "bulkAddPrograms",
    value: function bulkAddPrograms(added_programs) {
      var _this13 = this;

      this.applying_bulk_updates = true;
      _api__WEBPACK_IMPORTED_MODULE_1__["default"].bulkAddPrograms(this.getSelectedBulkTargetIDs(), added_programs.map(function (key) {
        var _key$split = key.split('_'),
            _key$split2 = _slicedToArray(_key$split, 2),
            country_id = _key$split2[0],
            program_id = _key$split2[1];

        return {
          country: country_id,
          program: program_id,
          role: 'low'
        };
      })).then(function (result) {
        //update open user programs
        var updated_users = _this13.getSelectedBulkTargetIDs();

        updated_users.forEach(function (id) {
          if (_this13.editing_target == id) {
            _api__WEBPACK_IMPORTED_MODULE_1__["default"].fetchUserProgramAccess(id).then(function (access) {
              Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
                _this13.editing_target_data.access = access;
              });
            });
          }
        });
        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          Object.entries(result).forEach(function (_ref18) {
            var _ref19 = _slicedToArray(_ref18, 2),
                id = _ref19[0],
                count = _ref19[1];

            _this13.users[id].user_programs = count;
          });
          _this13.applying_bulk_updates = false;
        });

        _this13.onSaveSuccessHandler();
      })["catch"](function (response) {
        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this13.applying_bulk_updates = false;
        });

        _this13.onSaveErrorHandler();
      });
    }
  }, {
    key: "bulkRemovePrograms",
    value: function bulkRemovePrograms(removed_programs) {
      var _this14 = this;

      this.applying_bulk_updates = true;
      _api__WEBPACK_IMPORTED_MODULE_1__["default"].bulkRemovePrograms(this.getSelectedBulkTargetIDs(), removed_programs.map(function (key) {
        var _key$split3 = key.split('_'),
            _key$split4 = _slicedToArray(_key$split3, 2),
            country_id = _key$split4[0],
            program_id = _key$split4[1];

        return {
          country: country_id,
          program: program_id,
          role: 'low'
        };
      })).then(function (result) {
        //update open user programs
        var updated_users = _this14.getSelectedBulkTargetIDs();

        updated_users.forEach(function (id) {
          if (_this14.editing_target == id) {
            _api__WEBPACK_IMPORTED_MODULE_1__["default"].fetchUserProgramAccess(id).then(function (access) {
              Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
                _this14.editing_target_data.access = access;
              });
            });
          }
        });
        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          Object.entries(result).forEach(function (_ref20) {
            var _ref21 = _slicedToArray(_ref20, 2),
                id = _ref21[0],
                count = _ref21[1];

            _this14.users[id].user_programs = count;
          });
          _this14.applying_bulk_updates = false;
        });

        _this14.onSaveSuccessHandler();
      })["catch"](function (response) {
        Object(mobx__WEBPACK_IMPORTED_MODULE_0__["runInAction"])(function () {
          _this14.applying_bulk_updates = false;
        });

        _this14.onSaveErrorHandler();
      });
    }
  }, {
    key: "clearFilters",
    value: function clearFilters() {
      this.filters = {
        countries: [],
        base_countries: [],
        organizations: [],
        programs: [],
        user_status: '',
        admin_role: '',
        users: this.filters.users || []
      };
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
    key: "countriesByRegion",
    get: function get() {
      var _this15 = this;

      return Object.values(this.regions || {}).map(function (region) {
        return {
          id: region.id,
          name: gettext(region.name),
          countries: Object.values(_this15.countries).filter(function (country) {
            return country.region == region.id;
          })
        };
      }).filter(function (region) {
        return region.countries.length > 0;
      }).sort(function (regionA, regionB) {
        return regionA.name.toUpperCase() < regionB.name.toUpperCase() ? -1 : 1;
      });
    }
  }]);

  return UserStore;
}(), _temp), (_descriptor = _applyDecoratedDescriptor(_class.prototype, "users", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "users_listing", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, "users_count", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, "fetching_users_listing", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
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
}), _descriptor6 = _applyDecoratedDescriptor(_class.prototype, "total_pages", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class.prototype, "bulk_targets", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new Map();
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class.prototype, "bulk_targets_all", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor9 = _applyDecoratedDescriptor(_class.prototype, "applying_bulk_updates", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor10 = _applyDecoratedDescriptor(_class.prototype, "saving_user_profile", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor11 = _applyDecoratedDescriptor(_class.prototype, "saving_user_programs", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor12 = _applyDecoratedDescriptor(_class.prototype, "access", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {
      countries: {},
      programs: {}
    };
  }
}), _descriptor13 = _applyDecoratedDescriptor(_class.prototype, "is_superuser", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor14 = _applyDecoratedDescriptor(_class.prototype, "fetching_editing_target", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor15 = _applyDecoratedDescriptor(_class.prototype, "editing_target", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor16 = _applyDecoratedDescriptor(_class.prototype, "editing_target_data", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return _objectSpread({}, default_editing_target_data);
  }
}), _descriptor17 = _applyDecoratedDescriptor(_class.prototype, "editing_errors", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor18 = _applyDecoratedDescriptor(_class.prototype, "new_user", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor19 = _applyDecoratedDescriptor(_class.prototype, "countries", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor20 = _applyDecoratedDescriptor(_class.prototype, "ordered_country_ids", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor21 = _applyDecoratedDescriptor(_class.prototype, "organizations", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor22 = _applyDecoratedDescriptor(_class.prototype, "programs", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor23 = _applyDecoratedDescriptor(_class.prototype, "available_users", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor24 = _applyDecoratedDescriptor(_class.prototype, "countries_selections", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor25 = _applyDecoratedDescriptor(_class.prototype, "organization_selections", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor26 = _applyDecoratedDescriptor(_class.prototype, "program_selections", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor27 = _applyDecoratedDescriptor(_class.prototype, "user_selections", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor28 = _applyDecoratedDescriptor(_class.prototype, "program_bulk_selections", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor29 = _applyDecoratedDescriptor(_class.prototype, "unsaved_changes_actions", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {
      save: function save() {},
      discard: function discard() {}
    };
  }
}), _descriptor30 = _applyDecoratedDescriptor(_class.prototype, "active_editor_pane", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 'profile';
  }
}), _descriptor31 = _applyDecoratedDescriptor(_class.prototype, "filters", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {
      countries: [],
      base_countries: [],
      organizations: [],
      programs: [],
      user_status: '',
      admin_role: '',
      users: []
    };
  }
}), _descriptor32 = _applyDecoratedDescriptor(_class.prototype, "appliedFilters", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor33 = _applyDecoratedDescriptor(_class.prototype, "changelog_expanded_rows", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new Set();
  }
}), _applyDecoratedDescriptor(_class.prototype, "countriesByRegion", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class.prototype, "countriesByRegion"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "onProfilePaneChange", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "onProfilePaneChange"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "fetchUsers", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "fetchUsers"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "applyFilters", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "applyFilters"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "changePage", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "changePage"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "toggleBulkTargetsAll", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "toggleBulkTargetsAll"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "toggleBulkTarget", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "toggleBulkTarget"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "changeCountryFilter", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "changeCountryFilter"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "changeBaseCountryFilter", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "changeBaseCountryFilter"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "changeOrganizationFilter", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "changeOrganizationFilter"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "changeProgramFilter", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "changeProgramFilter"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "changeUserStatusFilter", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "changeUserStatusFilter"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "changeAdminRoleFilter", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "changeAdminRoleFilter"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "changeUserFilter", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "changeUserFilter"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "toggleEditingTarget", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "toggleEditingTarget"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "updateActiveEditPage", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "updateActiveEditPage"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "createUser", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "createUser"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "updateUserProfile", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "updateUserProfile"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "updateUserIsActive", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "updateUserIsActive"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "resendRegistrationEmail", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "resendRegistrationEmail"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "saveNewUser", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "saveNewUser"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "saveNewUserAndAddAnother", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "saveNewUserAndAddAnother"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "saveUserPrograms", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "saveUserPrograms"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "bulkUpdateUserStatus", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "bulkUpdateUserStatus"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "bulkAddPrograms", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "bulkAddPrograms"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "bulkRemovePrograms", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "bulkRemovePrograms"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "clearFilters", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "clearFilters"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "toggleChangeLogRowExpando", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "toggleChangeLogRowExpando"), _class.prototype)), _class);
/**
 * To manage a list of countries and regions being selected and unselected,
 * this takes region data and country data (including country.region) and makes a store that
 * handles selecting and unselecting regions and countries intelligently:
 *   - if all countries in a region are selected, that region becomes automatically selected
 *   - if one country from a selected region is unselected, that region is automatically unselected
 *   - selecting a region automatically selects all countries from that region
 *   - unselecteding a region automatically unselects all countries from that region
 */

var CountryStore = (_class3 = (_temp2 = /*#__PURE__*/function () {
  function CountryStore(regions, countries) {
    _classCallCheck(this, CountryStore);

    _initializerDefineProperty(this, "regions", _descriptor34, this);

    _initializerDefineProperty(this, "countries", _descriptor35, this);

    _initializerDefineProperty(this, "_selectedCountryIds", _descriptor36, this);

    _initializerDefineProperty(this, "_expandedCountryIds", _descriptor37, this);

    this.regions = regions;
    this.countries = countries;
    this._selectedCountryIds = [];
    this._expandedCountryIds = new Set(_toConsumableArray(Object.keys(this.countries).map(function (id) {
      return parseInt(id);
    })));

    this.nameSort = function (objA, objB) {
      return objA.name.toUpperCase() < objB.name.toUpperCase() ? -1 : 1;
    };
  }

  _createClass(CountryStore, [{
    key: "isExpanded",
    value: function isExpanded(countryId) {
      return this._expandedCountryIds.has(parseInt(countryId));
    }
  }, {
    key: "toggleExpanded",
    value: function toggleExpanded(countryId) {
      if (this._expandedCountryIds.has(parseInt(countryId))) {
        this._expandedCountryIds["delete"](parseInt(countryId));
      } else {
        this._expandedCountryIds.add(parseInt(countryId));
      }
    }
  }, {
    key: "setExpanded",
    value: function setExpanded(countryId) {
      this._expandedCountryIds.add(parseInt(countryId));
    }
  }, {
    key: "removeRegion",
    value: function removeRegion(regionId) {
      var countryIds = Object.values(this.countries).filter(function (country) {
        return country.region == regionId;
      }).map(function (country) {
        return country.id;
      });
      this._selectedCountryIds = this._selectedCountryIds.filter(function (id) {
        return !countryIds.includes(id);
      });
    }
  }, {
    key: "addRegion",
    value: function addRegion(regionId) {
      var countryIds = Object.values(this.countries).filter(function (country) {
        return country.region == regionId;
      }).map(function (country) {
        return country.id;
      });
      this._selectedCountryIds = _toConsumableArray(new Set([].concat(_toConsumableArray(this._selectedCountryIds), _toConsumableArray(countryIds))));
    }
  }, {
    key: "removeCountry",
    value: function removeCountry(countryId) {
      this._selectedCountryIds = this._selectedCountryIds.filter(function (id) {
        return id !== countryId;
      });

      this._expandedCountryIds["delete"](parseInt(countryId));
    }
  }, {
    key: "addCountry",
    value: function addCountry(countryId) {
      this._selectedCountryIds = _toConsumableArray(new Set([].concat(_toConsumableArray(this._selectedCountryIds), [countryId])));

      this._expandedCountryIds.add(parseInt(countryId));
    }
  }, {
    key: "updateSelected",
    value: function updateSelected(selected) {
      var _this16 = this;

      if (selected.length == 0) {
        // selection is cleared
        this._selectedCountryIds = [];
        this._expandedCountryIds = new Set(_toConsumableArray(Object.keys(this.countries).map(function (id) {
          return parseInt(id);
        })));
      } else if (selected.length < this.selectedOptions.length) {
        // user removed items
        var unSelected = function unSelected(option) {
          return !selected.map(function (option) {
            return option.value;
          }).includes(option.value);
        };

        var missingOptions = this.selectedOptions.filter(unSelected);
        missingOptions.forEach(function (option) {
          if (option.value && "".concat(option.value).includes('r')) {
            _this16.removeRegion(option.value.slice(2));
          } else if (option.value) {
            _this16.removeCountry(option.value);
          }
        });

        if (this.selectedOptions.length == 0) {
          // expand all countries (no selection means all expanded:)
          this._expandedCountryIds = new Set(_toConsumableArray(Object.keys(this.countries).map(function (id) {
            return parseInt(id);
          })));
        }
      } else {
        // user added items
        if (this.selectedOptions.length == 0) {
          this._expandedCountryIds = new Set([]);
        }

        var notYetSelected = function notYetSelected(option) {
          return !_this16.selectedOptions.map(function (option) {
            return option.value;
          }).includes(option.value);
        };

        var addedOptions = selected.filter(notYetSelected);
        addedOptions.forEach(function (option) {
          if (option.value && "".concat(option.value).includes('r')) {
            _this16.addRegion(option.value.slice(2));
          } else if (option.value) {
            _this16.addCountry(option.value);
          }
        });
      }
    }
  }, {
    key: "orderedRegions",
    get: function get() {
      var _this17 = this;

      return Object.values(this.regions || {}).map(function (region) {
        return {
          id: region.id,
          name: gettext(region.name),
          countries: Object.values(_this17.countries).filter(function (country) {
            return country.region == region.id;
          }).sort(_this17.nameSort)
        };
      }).filter(function (region) {
        return region.countries.length > 0;
      }).sort(this.nameSort);
    }
  }, {
    key: "groupedOptions",
    get: function get() {
      // in the following possible options listing, "selectable: false" ensures the group heading
      // will not have a checkbox adjacent to it
      return [{
        // # Translators: a list of groups of countries (i.e. "Asia")
        label: gettext("Regions"),
        value: null,
        selectable: false,
        options: this.orderedRegions.map(function (region) {
          return {
            label: region.name,
            value: "r-".concat(region.id)
          };
        })
      }].concat(_toConsumableArray(this.orderedRegions.map(function (region) {
        return {
          label: region.name,
          value: null,
          divider: true,
          options: region.countries.map(function (country) {
            return {
              label: country.name,
              value: country.id
            };
          })
        };
      })));
    }
  }, {
    key: "selectedCountries",
    get: function get() {
      return this._selectedCountryIds.map(function (countryId) {
        return parseInt(countryId);
      });
    }
  }, {
    key: "selectedOptions",
    get: function get() {
      var _this18 = this;

      // in the following selected option listing, "nolist" prevents counting the option in the
      // "n selected" (i.e. "4 selected") display on the multiselect:
      var isSelected = function isSelected(country) {
        return _this18.selectedCountries.includes(country.id);
      };

      return [].concat(_toConsumableArray(this.orderedRegions.filter(function (region) {
        return region.countries.every(isSelected);
      }).map(function (region) {
        return {
          value: "r-".concat(region.id),
          label: region.name,
          noList: true
        };
      })), _toConsumableArray(this.selectedCountries.map(function (countryId) {
        return {
          label: _this18.countries[countryId].name,
          value: _this18.countries[countryId].id
        };
      })));
    }
  }]);

  return CountryStore;
}(), _temp2), (_descriptor34 = _applyDecoratedDescriptor(_class3.prototype, "regions", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor35 = _applyDecoratedDescriptor(_class3.prototype, "countries", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor36 = _applyDecoratedDescriptor(_class3.prototype, "_selectedCountryIds", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor37 = _applyDecoratedDescriptor(_class3.prototype, "_expandedCountryIds", [mobx__WEBPACK_IMPORTED_MODULE_0__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _applyDecoratedDescriptor(_class3.prototype, "orderedRegions", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class3.prototype, "orderedRegions"), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, "groupedOptions", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class3.prototype, "groupedOptions"), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, "selectedCountries", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class3.prototype, "selectedCountries"), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, "selectedOptions", [mobx__WEBPACK_IMPORTED_MODULE_0__["computed"]], Object.getOwnPropertyDescriptor(_class3.prototype, "selectedOptions"), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, "toggleExpanded", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class3.prototype, "toggleExpanded"), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, "setExpanded", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class3.prototype, "setExpanded"), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, "removeRegion", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class3.prototype, "removeRegion"), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, "addRegion", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class3.prototype, "addRegion"), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, "removeCountry", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class3.prototype, "removeCountry"), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, "addCountry", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class3.prototype, "addCountry"), _class3.prototype), _applyDecoratedDescriptor(_class3.prototype, "updateSelected", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class3.prototype, "updateSelected"), _class3.prototype)), _class3);

/***/ }),

/***/ "pyWi":
/*!***********************************************************************!*\
  !*** ./js/pages/tola_management_pages/user/components/user_editor.js ***!
  \***********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return UserEditor; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "q1tI");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "okNM");
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




var UserEditor = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class = /*#__PURE__*/function (_React$Component) {
  _inherits(UserEditor, _React$Component);

  var _super = _createSuper(UserEditor);

  function UserEditor() {
    _classCallCheck(this, UserEditor);

    return _super.apply(this, arguments);
  }

  _createClass(UserEditor, [{
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
          ProgramSection = _this$props.ProgramSection,
          HistorySection = _this$props.HistorySection,
          active_pane = _this$props.active_pane;
      var profile_active_class = active_pane == 'profile' ? 'active' : '';
      var programs_active_class = active_pane == 'programs_and_roles' ? 'active' : '';
      var history_active_class = active_pane == 'status_and_history' ? 'active' : '';
      var new_class = this.props["new"] ? 'disabled' : '';
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "tab-set--vertical"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", {
        className: "nav nav-tabs"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
        className: "nav-item"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        className: "nav-link ".concat(profile_active_class),
        onClick: function onClick(e) {
          e.preventDefault();

          _this.updateActivePage('profile');
        }
      }, gettext("Profile"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
        className: "nav-item"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        className: "nav-link text-nowrap ".concat(programs_active_class, " ").concat(new_class),
        onClick: function onClick(e) {
          e.preventDefault();

          _this.updateActivePage('programs_and_roles');
        }
      }, gettext("Programs and Roles"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
        className: "nav-item"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        className: "nav-link text-nowrap ".concat(history_active_class, " ").concat(new_class),
        onClick: function onClick(e) {
          e.preventDefault();

          _this.updateActivePage('status_and_history');
        }
      }, gettext("Status and History")))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "tab-content"
      }, active_pane == 'profile' && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ProfileSection, null), active_pane == 'programs_and_roles' && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ProgramSection, null), active_pane == 'status_and_history' && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(HistorySection, null)));
    }
  }]);

  return UserEditor;
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

},[["9KAa","runtime","vendors"]]]);
//# sourceMappingURL=tola_management_user-e65f66e50faa3f93971a.js.map