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
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "okNM");
/* harmony import */ var react_virtualized__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-virtualized */ "c7k8");
/* harmony import */ var components_checkboxed_multi_select__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! components/checkboxed-multi-select */ "Z2Y6");
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

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }




 //we need a pretty peculiar structure to accommodate the virtualized table

var create_country_objects = function create_country_objects(countries, store) {
  return Object.entries(countries).reduce(function (countries, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        id = _ref2[0],
        country = _ref2[1];

    return _objectSpread({}, countries, _defineProperty({}, id, _objectSpread({}, country, {
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

    return _objectSpread({}, programs, _defineProperty({}, id, _objectSpread({}, program, {
      type: 'program',
      options: store.program_role_choices
    })));
  }, {});
}; //we need to flatten the country -> program heirarchy to support the virtualized table


var flattened_listing = function flattened_listing(countries, programs) {
  return countries.flatMap(function (country) {
    return [country].concat(_toConsumableArray(Array.from(country.programs).filter(function (program_id) {
      return programs[program_id];
    }).map(function (program_id) {
      return _objectSpread({}, programs[program_id], {
        id: "".concat(country.id, "_").concat(program_id),
        country_id: country.id
      });
    })));
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
      return _objectSpread({}, countries, _defineProperty({}, country.id, country));
    }, {}),
    programs: filtered_programs.reduce(function (programs, program) {
      return _objectSpread({}, programs, _defineProperty({}, program.id, program));
    }, {})
  };
};

var apply_country_filter = function apply_country_filter(countries, filtered) {
  if (filtered.length > 0) {
    return filtered.filter(function (option) {
      return countries[option.value];
    }).map(function (option) {
      return countries[option.value];
    }).reduce(function (countries, country) {
      return _objectSpread({}, countries, _defineProperty({}, country.id, country));
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

      return _objectSpread({}, countries, _defineProperty({}, id, _objectSpread({}, country, {
        has_access: true
      })));
    }, {}),
    programs: user_access.programs.reduce(function (programs, program) {
      return _objectSpread({}, programs, _defineProperty({}, "".concat(program.country, "_").concat(program.program), _objectSpread({}, program, {
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

var EditUserPrograms = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class =
/*#__PURE__*/
function (_React$Component) {
  _inherits(EditUserPrograms, _React$Component);

  function EditUserPrograms(props) {
    var _this;

    _classCallCheck(this, EditUserPrograms);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(EditUserPrograms).call(this, props));
    var store = props.store;
    var countries = create_country_objects(store.countries, store);
    var programs = create_program_objects(store.programs, store);
    _this.state = {
      program_filter: '',
      country_filter: [],
      country_selections: Object.entries(store.countries).map(function (_ref15) {
        var _ref16 = _slicedToArray(_ref15, 2),
            _ = _ref16[0],
            country = _ref16[1];

        return {
          value: country.id,
          label: country.name
        };
      }),
      countries: countries,
      programs: programs,
      filtered_countries: countries,
      filtered_programs: programs,
      ordered_country_ids: store.ordered_country_ids,
      flattened_programs: flattened_listing(store.ordered_country_ids.filter(function (id) {
        return id in countries;
      }).map(function (id) {
        return countries[id];
      }), programs),
      original_user_program_access: create_user_access(store.editing_target_data.access),
      user_program_access: create_user_access(store.editing_target_data.access)
    };
    return _this;
  }

  _createClass(EditUserPrograms, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(next_props) {
      var _this2 = this;

      var store = next_props.store;
      var countries_obj = create_country_objects(store.countries, store);
      var programs_obj = create_program_objects(store.programs, store);
      var filtered_countries = apply_country_filter(countries_obj, this.state.country_filter);

      var _apply_program_filter = apply_program_filter(programs_obj, filtered_countries, this.state.program_filter),
          countries = _apply_program_filter.countries,
          programs = _apply_program_filter.programs;

      this.setState({
        countries: countries_obj,
        programs: programs_obj,
        country_selections: Object.entries(store.countries).map(function (_ref17) {
          var _ref18 = _slicedToArray(_ref17, 2),
              _ = _ref18[0],
              country = _ref18[1];

          return {
            value: country.id,
            label: country.name
          };
        }),
        filtered_countries: countries,
        filtered_programs: programs,
        ordered_country_ids: store.ordered_country_ids,
        flattened_programs: flattened_listing(store.ordered_country_ids.filter(function (id) {
          return id in countries;
        }).map(function (id) {
          return countries[id];
        }), programs),
        original_user_program_access: create_user_access(store.editing_target_data.access),
        user_program_access: create_user_access(store.editing_target_data.access)
      }, function () {
        return _this2.hasUnsavedDataAction();
      });
    }
  }, {
    key: "saveForm",
    value: function saveForm() {
      var _this3 = this;

      //marshal the data back into the format we received it
      //filtering out all !has_access
      var access = this.state.user_program_access;
      this.props.onSave({
        countries: Object.entries(access.countries).filter(function (_ref19) {
          var _ref20 = _slicedToArray(_ref19, 2),
              _ = _ref20[0],
              country = _ref20[1];

          return _this3.props.store.is_superuser;
        }).filter(function (_ref21) {
          var _ref22 = _slicedToArray(_ref21, 2),
              _ = _ref22[0],
              country = _ref22[1];

          return country.has_access;
        }).reduce(function (countries, _ref23) {
          var _ref24 = _slicedToArray(_ref23, 2),
              id = _ref24[0],
              country = _ref24[1];

          return _objectSpread({}, countries, _defineProperty({}, id, country));
        }, {}),
        programs: Object.entries(access.programs).filter(function (_ref25) {
          var _ref26 = _slicedToArray(_ref25, 2),
              _ = _ref26[0],
              program = _ref26[1];

          return program.has_access;
        }).map(function (_ref27) {
          var _ref28 = _slicedToArray(_ref27, 2),
              _ = _ref28[0],
              program = _ref28[1];

          return program;
        })
      });
      this.hasUnsavedDataAction();
    }
  }, {
    key: "hasUnsavedDataAction",
    value: function hasUnsavedDataAction() {
      var access = {
        countries: Object.entries(this.state.user_program_access.countries).filter(function (_ref29) {
          var _ref30 = _slicedToArray(_ref29, 2),
              _ = _ref30[0],
              country = _ref30[1];

          return country.has_access;
        }).reduce(function (countries, _ref31) {
          var _ref32 = _slicedToArray(_ref31, 2),
              id = _ref32[0],
              country = _ref32[1];

          return _objectSpread({}, countries, _defineProperty({}, id, country));
        }, {}),
        programs: Object.entries(this.state.user_program_access.programs).filter(function (_ref33) {
          var _ref34 = _slicedToArray(_ref33, 2),
              _ = _ref34[0],
              program = _ref34[1];

          return program.has_access;
        }).reduce(function (programs, _ref35) {
          var _ref36 = _slicedToArray(_ref35, 2),
              id = _ref36[0],
              program = _ref36[1];

          return _objectSpread({}, programs, _defineProperty({}, id, program));
        }, {})
      };
      this.props.onIsDirtyChange(JSON.stringify(access) != JSON.stringify(this.state.original_user_program_access));
    }
  }, {
    key: "resetForm",
    value: function resetForm() {
      var _this4 = this;

      this.setState({
        user_program_access: {
          countries: _objectSpread({}, this.state.original_user_program_access.countries),
          programs: _objectSpread({}, this.state.original_user_program_access.programs)
        }
      }, function () {
        return _this4.hasUnsavedDataAction();
      });
    }
  }, {
    key: "toggleProgramAccess",
    value: function toggleProgramAccess(program_key) {
      var _this5 = this;

      var current_program_access = this.state.user_program_access.programs;

      var updated_program_access = function () {
        if (current_program_access[program_key]) {
          return _objectSpread({}, current_program_access[program_key], {
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
        user_program_access: _objectSpread({}, this.state.user_program_access, {
          programs: _objectSpread({}, current_program_access, _defineProperty({}, program_key, updated_program_access))
        })
      }, function () {
        return _this5.hasUnsavedDataAction();
      });
    }
  }, {
    key: "toggleAllProgramsForCountry",
    value: function toggleAllProgramsForCountry(country_id) {
      var _this6 = this;

      var country = this.state.countries[country_id];

      var new_program_access = function () {
        var country_has_all_checked = country_has_all_access(country, _this6.state.filtered_programs, _this6.state.user_program_access);

        if (country_has_all_checked) {
          //toggle all off
          return Array.from(country.programs).filter(function (program_id) {
            return !!_this6.state.filtered_programs[program_id];
          }).reduce(function (programs, program_id) {
            var program_key = "".concat(country.id, "_").concat(program_id);
            var program = _this6.state.user_program_access.programs[program_key];

            if (program) {
              return _objectSpread({}, programs, _defineProperty({}, program_key, _objectSpread({}, program, {
                has_access: false
              })));
            } else {
              return programs;
            }
          }, {});
        } else {
          //toggle all on
          return Array.from(country.programs).filter(function (program_id) {
            return !!_this6.state.filtered_programs[program_id];
          }).reduce(function (programs, program_id) {
            var program_key = "".concat(country.id, "_").concat(program_id);
            var program = _this6.state.user_program_access.programs[program_key];

            if (program) {
              return _objectSpread({}, programs, _defineProperty({}, program_key, _objectSpread({}, program, {
                has_access: true
              })));
            } else {
              return _objectSpread({}, programs, _defineProperty({}, program_key, {
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
        user_program_access: _objectSpread({}, this.state.user_program_access, {
          programs: _objectSpread({}, this.state.user_program_access.programs, new_program_access)
        })
      }, function () {
        return _this6.hasUnsavedDataAction();
      });
    }
  }, {
    key: "changeCountryRole",
    value: function changeCountryRole(country_id, new_val) {
      var _this7 = this;

      var country = _objectSpread({}, this.state.user_program_access.countries[country_id]);

      var new_country_access = function () {
        if (new_val != 'none') {
          return _objectSpread({}, country, {
            role: new_val,
            has_access: true
          });
        } else {
          return _objectSpread({}, country, {
            role: new_val,
            has_access: false
          });
        }
      }();

      this.setState({
        user_program_access: _objectSpread({}, this.state.user_program_access, {
          countries: _objectSpread({}, this.state.user_program_access.countries, _defineProperty({}, country_id, new_country_access))
        })
      }, function () {
        return _this7.hasUnsavedDataAction();
      });
    }
  }, {
    key: "changeProgramRole",
    value: function changeProgramRole(program_key, new_val) {
      var _this8 = this;

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
        user_program_access: _objectSpread({}, this.state.user_program_access, {
          programs: _objectSpread({}, this.state.user_program_access.programs, _defineProperty({}, program_key, new_program_access))
        })
      }, function () {
        return _this8.hasUnsavedDataAction();
      });
    }
  }, {
    key: "clearFilter",
    value: function clearFilter() {
      var val = '';
      var filtered_countries = apply_country_filter(this.state.countries, this.state.country_filter);

      var _apply_program_filter2 = apply_program_filter(this.state.programs, filtered_countries, val),
          countries = _apply_program_filter2.countries,
          programs = _apply_program_filter2.programs;

      this.setState({
        program_filter: val,
        filtered_programs: programs,
        filtered_countries: countries,
        flattened_programs: flattened_listing(this.state.ordered_country_ids.filter(function (id) {
          return id in countries;
        }).map(function (id) {
          return countries[id];
        }), programs)
      });
    }
  }, {
    key: "updateProgramFilter",
    value: function updateProgramFilter(val) {
      var filtered_countries = apply_country_filter(this.state.countries, this.state.country_filter);

      var _apply_program_filter3 = apply_program_filter(this.state.programs, filtered_countries, val),
          countries = _apply_program_filter3.countries,
          programs = _apply_program_filter3.programs;

      this.setState({
        program_filter: val,
        filtered_programs: programs,
        filtered_countries: countries,
        flattened_programs: flattened_listing(this.state.ordered_country_ids.filter(function (id) {
          return id in countries;
        }).map(function (id) {
          return countries[id];
        }), programs)
      });
    }
  }, {
    key: "changeCountryFilter",
    value: function changeCountryFilter(e) {
      var filtered_countries = apply_country_filter(this.state.countries, e);

      var _apply_program_filter4 = apply_program_filter(this.state.programs, filtered_countries, this.state.program_filter),
          countries = _apply_program_filter4.countries,
          programs = _apply_program_filter4.programs;

      this.setState({
        country_filter: e,
        filtered_countries: countries,
        flattened_programs: flattened_listing(this.state.ordered_country_ids.filter(function (id) {
          return id in countries;
        }).map(function (id) {
          return countries[id];
        }), this.state.filtered_programs)
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this9 = this;

      var _this$props = this.props,
          user = _this$props.user,
          onSave = _this$props.onSave;

      var is_checked = function is_checked(data) {
        var access = _this9.state.user_program_access;

        if (data.type == 'country') {
          return access.countries[data.id] && access.countries[data.id].has_access || false;
        } else {
          if (_this9.state.user_program_access.countries[data.country_id] && _this9.state.user_program_access.countries[data.country_id].has_access) {
            return true;
          }

          return access.programs[data.id] && access.programs[data.id].has_access || false;
        }
      };

      var is_check_disabled = function is_check_disabled(data) {
        if (data.type == 'country') {
          return !(_this9.state.countries[data.id].programs.size > 0) || !(_this9.props.store.access.countries[data.id] && _this9.props.store.access.countries[data.id].role == 'basic_admin') || _this9.state.user_program_access.countries[data.id] && _this9.state.user_program_access.countries[data.id].has_access;
        } else {
          if (_this9.state.user_program_access.countries[data.country_id] && _this9.state.user_program_access.countries[data.country_id].has_access) {
            return true;
          }

          return !_this9.props.store.access.countries[data.country_id] || _this9.props.store.access.countries[data.country_id].role != 'basic_admin';
        }
      };

      var is_role_disabled = function is_role_disabled(data) {
        if (data.type == 'country') {
          return !_this9.props.store.is_superuser;
        } else {
          return !_this9.props.store.access.countries[data.country_id] || _this9.props.store.access.countries[data.country_id].role != 'basic_admin' || !(_this9.state.user_program_access.programs[data.id] && _this9.state.user_program_access.programs[data.id].has_access) && !(_this9.state.user_program_access.countries[data.country_id] && _this9.state.user_program_access.countries[data.country_id].has_access);
        }
      };

      var get_role = function get_role(data) {
        if (data.type == 'country') {
          var country_access = _this9.state.user_program_access.countries;

          if (!country_access[data.id]) {
            return 'none';
          } else {
            return country_access[data.id].role;
          }
        } else {
          var program_access = _this9.state.user_program_access.programs;

          if (!program_access[data.id]) {
            return _this9.props.store.program_role_choices[0].value;
          } else {
            return program_access[data.id].role;
          }
        }
      };

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "tab-pane--react edit-user-programs"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", {
        className: "no-bold"
      }, user.name ? user.name + ': ' : '', gettext("Programs and Roles"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("sup", null, "   ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        target: "_blank",
        href: "https://learn.mercycorps.org/index.php/TOLA:Section_05/en#5.4_User_Roles_Matrix_.28Program_Permissions.29"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        "aria-label": gettext('More information on Program Roles'),
        className: "far fa-question-circle"
      })))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "edit-user-programs__filter-form"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "edit-user-programs__country-filter form-group react-multiselect-checkbox"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_checkboxed_multi_select__WEBPACK_IMPORTED_MODULE_3__["default"], {
        placeholder: gettext("Filter countries"),
        isMulti: true,
        value: this.state.country_filter,
        options: this.state.country_selections,
        onChange: function onChange(e) {
          return _this9.changeCountryFilter(e);
        }
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group edit-user-programs__program-filter"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "input-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        placeholder: gettext("Filter programs"),
        type: "text",
        value: this.state.program_filter,
        className: "form-control",
        onChange: function onChange(e) {
          return _this9.updateProgramFilter(e.target.value);
        }
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "input-group-append"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        onClick: function onClick(e) {
          e.preventDefault();

          _this9.clearFilter();
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "input-group-text"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fa fa-times-circle"
      }))))))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "virtualized-table__wrapper"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_virtualized__WEBPACK_IMPORTED_MODULE_2__["AutoSizer"], null, function (_ref37) {
        var height = _ref37.height,
            width = _ref37.width;
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_virtualized__WEBPACK_IMPORTED_MODULE_2__["Table"], {
          height: height,
          headerHeight: 50,
          width: width,
          rowGetter: function rowGetter(_ref38) {
            var index = _ref38.index;
            return _this9.state.flattened_programs[index];
          },
          rowHeight: 50,
          rowCount: _this9.state.flattened_programs.length
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_virtualized__WEBPACK_IMPORTED_MODULE_2__["Column"], {
          dataKey: "not_applicable_but_required",
          label:
          /* # Translators: Column header for a checkbox indicating if a user has access to a program */
          gettext("Has access?"),
          width: 100,
          cellDataGetter: function cellDataGetter(_ref39) {
            var rowData = _ref39.rowData;
            return {
              checked: is_checked(rowData),
              disabled: is_check_disabled(rowData),
              id: rowData.id,
              type: rowData.type,
              action: rowData.type == "country" ? _this9.toggleAllProgramsForCountry.bind(_this9) : _this9.toggleProgramAccess.bind(_this9)
            };
          },
          cellRenderer: function cellRenderer(_ref40) {
            var cellData = _ref40.cellData;

            if (cellData.type == 'country') {
              var country_has_all_checked = country_has_all_access(_this9.state.countries[cellData.id], _this9.state.filtered_programs, _this9.state.user_program_access);
              var button_label = country_has_all_checked ? gettext('Deselect All') : gettext('Select All');

              if (cellData.disabled) {
                return null;
              } else {
                return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
                  className: "check-column"
                }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
                  className: "edit-user-programs__select-all",
                  onClick: function onClick(e) {
                    return cellData.action(cellData.id);
                  }
                }, button_label));
              }
            } else {
              return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
                className: "check-column"
              }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
                type: "checkbox",
                checked: cellData.checked,
                disabled: cellData.disabled,
                onChange: function onChange() {
                  return cellData.action(cellData.id);
                }
              }));
            }
          }
        }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_virtualized__WEBPACK_IMPORTED_MODULE_2__["Column"], {
          dataKey: "not_applicable_but_required",
          label: gettext("Countries and Programs"),
          width: 200,
          flexGrow: 2,
          cellDataGetter: function cellDataGetter(_ref41) {
            var rowData = _ref41.rowData;
            return {
              bold: rowData.type == "country",
              name: rowData.name
            };
          },
          cellRenderer: function cellRenderer(_ref42) {
            var cellData = _ref42.cellData;

            if (cellData.bold) {
              return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, cellData.name);
            } else {
              return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, cellData.name);
            }
          }
        }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_virtualized__WEBPACK_IMPORTED_MODULE_2__["Column"], {
          width: 100,
          flexGrow: 1,
          dataKey: "not_applicable_but_required",
          label: gettext("Roles and Permissions"),
          cellDataGetter: function cellDataGetter(_ref43) {
            var rowData = _ref43.rowData;
            return {
              id: rowData.id,
              disabled: is_role_disabled(rowData),
              type: rowData.type,
              options: rowData.options,
              action: rowData.type == "country" ? _this9.changeCountryRole.bind(_this9) : _this9.changeProgramRole.bind(_this9)
            };
          },
          cellRenderer: function cellRenderer(_ref44) {
            var cellData = _ref44.cellData;
            return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("select", {
              disabled: cellData.disabled,
              value: get_role(cellData),
              onChange: function onChange(e) {
                return cellData.action(cellData.id, e.target.value);
              }
            }, cellData.options.map(function (option) {
              return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
                key: option.value,
                value: option.value
              }, option.label);
            }));
          }
        }));
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group btn-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        type: "button",
        className: "btn btn-primary",
        onClick: function onClick() {
          return _this9.saveForm();
        }
      }, "Save Changes"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        type: "button",
        className: "btn btn-reset",
        onClick: function onClick() {
          return _this9.resetForm();
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
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-select */ "y2Vs");
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mobx-react */ "okNM");
var _class;

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





var EditUserProfile = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class =
/*#__PURE__*/
function (_React$Component) {
  _inherits(EditUserProfile, _React$Component);

  function EditUserProfile(props) {
    var _this;

    _classCallCheck(this, EditUserProfile);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(EditUserProfile).call(this, props));
    var userData = props.userData;
    var organization_listing = props.organizations.filter(function (o) {
      return o.value != 1 || props.is_superuser;
    });
    var selected_organization = organization_listing.find(function (o) {
      return o.value == userData.organization_id;
    });
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
        managed_user_data: _objectSpread({}, this.state.managed_user_data, {
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
        managed_user_data: _objectSpread({}, this.state.managed_user_data, {
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
        managed_user_data: _objectSpread({}, this.state.managed_user_data, {
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
        managed_user_data: _objectSpread({}, this.state.managed_user_data, {
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
        managed_user_data: _objectSpread({}, this.state.managed_user_data, {
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
        managed_user_data: _objectSpread({}, this.state.managed_user_data, {
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
        managed_user_data: _objectSpread({}, this.state.managed_user_data, {
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
        managed_user_data: _objectSpread({}, this.state.managed_user_data, {
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
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "tab-pane--react"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", {
        className: "no-bold"
      }, ud.name ? ud.name + ': ' : '', gettext("Profile")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("form", {
        className: "form"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "label--required",
        htmlFor: "user-first-name-input"
      }, gettext("Preferred First Name")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        disabled: disabled,
        className: "form-control " + error_classes.first_name,
        type: "text",
        value: ud.first_name,
        onChange: function onChange(e) {
          return _this11.updateFirstName(e.target.value);
        },
        id: "user-first-name-input",
        required: true
      }), e.first_name && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "invalid-feedback"
      }, e.first_name)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "label--required",
        htmlFor: "user-last-name-input"
      }, gettext("Preferred Last Name")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        disabled: disabled,
        className: "form-control " + error_classes.last_name,
        type: "text",
        value: ud.last_name,
        onChange: function onChange(e) {
          return _this11.updateLastName(e.target.value);
        },
        id: "user-last-name-input",
        required: true
      }), e.last_name && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "invalid-feedback"
      }, e.last_name)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "label--required",
        htmlFor: "user-username-input"
      }, gettext("Username")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        disabled: disabled,
        className: "form-control " + error_classes.username,
        type: "text",
        value: ud.username,
        onChange: function onChange(e) {
          return _this11.updateUsername(e.target.value);
        },
        id: "user-username-input",
        required: true
      }), e.username && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "invalid-feedback"
      }, e.username)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "label--required",
        htmlFor: "user-organization-input"
      }, gettext("Organization")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_1__["default"], {
        isDisabled: disabled,
        className: "react-select " + error_classes.organization,
        value: this.state.selected_organization,
        options: this.state.organization_listing,
        onChange: function onChange(e) {
          return _this11.updateOrganization(e);
        },
        placeholder: "None Selected",
        id: "user-organization-input"
      }), e.organization_id && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "invalid-feedback feedback--react-select"
      }, e.organization_id)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        htmlFor: "user-title-input"
      }, gettext("Title")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        disabled: disabled,
        maxLength: "50",
        type: "text",
        value: ud.title,
        onChange: function onChange(e) {
          return _this11.updateTitle(e.target.value);
        },
        className: "form-control",
        id: "user-title-input"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "label--required",
        htmlFor: "user-email-input"
      }, gettext("Email")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        disabled: disabled,
        className: "form-control " + error_classes.email,
        type: "email",
        value: ud.email,
        onChange: function onChange(e) {
          return _this11.updateEmail(e.target.value);
        },
        id: "user-email-input"
      }), e.email && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "invalid-feedback"
      }, e.email)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        htmlFor: "user-phone-input"
      }, gettext("Phone")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        disabled: disabled,
        type: "tel",
        value: ud.phone_number,
        onChange: function onChange(e) {
          return _this11.updatePhone(e.target.value);
        },
        className: "form-control",
        id: "user-phone-input"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        htmlFor: "user-mode-of-contact-input"
      }, gettext("Preferred Mode of Contact")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        disabled: disabled,
        type: "text",
        value: ud.mode_of_contact,
        onChange: function onChange(e) {
          return _this11.updateModeOfContact(e.target.value);
        },
        className: "form-control",
        id: "user-mode-of-contact-input"
      })), this.props.new && !disabled && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group btn-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-primary",
        type: "button",
        onClick: function onClick(e) {
          return _this11.saveNew(e);
        }
      }, gettext("Save changes")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-secondary",
        onClick: function onClick(e) {
          return _this11.saveNewAndAddAnother(e);
        }
      }, gettext("Save And Add Another")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-reset",
        type: "button",
        onClick: function onClick() {
          return _this11.resetForm();
        }
      }, gettext("Reset"))), !this.props.new && !disabled && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group btn-row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-primary",
        type: "button",
        onClick: function onClick(e) {
          return _this11.save();
        }
      }, gettext("Save changes")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
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
react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_views__WEBPACK_IMPORTED_MODULE_3__["IndexView"], {
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
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-select */ "y2Vs");
/* harmony import */ var react_virtualized__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-virtualized */ "c7k8");
/* harmony import */ var components_changelog__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! components/changelog */ "KnAV");
var _class, _temp;

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
  value: true,
  label: gettext('Active')
}, {
  value: false,
  label: gettext('Inactive')
}];
var EditUserHistory = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class = (_temp =
/*#__PURE__*/
function (_React$Component) {
  _inherits(EditUserHistory, _React$Component);

  function EditUserHistory(props) {
    var _this;

    _classCallCheck(this, EditUserHistory);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(EditUserHistory).call(this, props));

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
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "edit-user-history"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", {
        className: "no-bold"
      }, this.state.user_data.name ? this.state.user_data.name + ': ' : '', gettext("Status and History")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-secondary",
        onClick: function onClick() {
          return _this4.onResendRegistrationEmail();
        }
      }, gettext("Resend Registration Email"))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "label--required",
        htmlFor: "user-status-input"
      }, gettext("Status")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_2__["default"], {
        isDisabled: this.props.disabled,
        options: status_options,
        value: selected,
        id: "user-status-input",
        onChange: function onChange(new_value) {
          return _this4.onChange(new_value);
        }
      })), !this.props.disabled && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-primary",
        type: "button",
        onClick: function onClick() {
          return _this4.save();
        }
      }, gettext("Save Changes")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn btn-reset",
        type: "button",
        onClick: function onClick() {
          return _this4.onReset();
        }
      }, gettext("Reset"))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_changelog__WEBPACK_IMPORTED_MODULE_4__["default"], {
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
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

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
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-select */ "y2Vs");
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

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }













 // # Translators: Nothing selected by user

var selection_placeholder = gettext("None Selected");
var UserFilter = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref) {
  var store = _ref.store,
      selections = _ref.selections;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "form-group react-multiselect-checkbox"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    htmlFor: "users_filter"
  }, gettext("Users")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_checkboxed_multi_select__WEBPACK_IMPORTED_MODULE_3__["default"], {
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
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "form-group react-multiselect-checkbox"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    htmlFor: "countries_permitted_filter"
  }, gettext("Countries Permitted")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_checkboxed_multi_select__WEBPACK_IMPORTED_MODULE_3__["default"], {
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
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "form-group react-multiselect-checkbox"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    htmlFor: "base_country_filter"
  }, gettext("Base Country")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_checkboxed_multi_select__WEBPACK_IMPORTED_MODULE_3__["default"], {
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
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "form-group react-multiselect-checkbox"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    htmlFor: "programs_filter"
  }, gettext("Programs")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_checkboxed_multi_select__WEBPACK_IMPORTED_MODULE_3__["default"], {
    value: store.filters.programs,
    options: selections,
    onChange: function onChange(e) {
      return store.changeProgramFilter(e);
    },
    placeholder: selection_placeholder,
    id: "programs_filter"
  }));
});

var SetUserStatusBulkAction =
/*#__PURE__*/
function (_React$Component) {
  _inherits(SetUserStatusBulkAction, _React$Component);

  function SetUserStatusBulkAction(props) {
    var _this;

    _classCallCheck(this, SetUserStatusBulkAction);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SetUserStatusBulkAction).call(this, props));
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

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_2__["default"], {
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

var UpdateProgramsBulkAction =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(UpdateProgramsBulkAction, _React$Component2);

  function UpdateProgramsBulkAction(props) {
    var _this3;

    _classCallCheck(this, UpdateProgramsBulkAction);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(UpdateProgramsBulkAction).call(this, props));
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

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_checkboxed_multi_select__WEBPACK_IMPORTED_MODULE_3__["default"], {
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

var BulkActions =
/*#__PURE__*/
function (_React$Component3) {
  _inherits(BulkActions, _React$Component3);

  function BulkActions(props) {
    var _this5;

    _classCallCheck(this, BulkActions);

    _this5 = _possibleConstructorReturn(this, _getPrototypeOf(BulkActions).call(this, props));
    _this5.active_child = react__WEBPACK_IMPORTED_MODULE_0___default.a.createRef();
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
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "controls__bulk-actions"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "bulk__select"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_2__["default"], {
        placeholder: gettext("Bulk Actions"),
        value: this.props.primaryOptions.find(function (o) {
          return o.value == _this6.state.current_action;
        }),
        options: this.props.primaryOptions,
        onChange: function onChange(val) {
          return _this6.onActionChanged(val);
        }
      })), selected && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "bulk__select"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SecondaryComponent, {
        placeholder: gettext("Select..."),
        value: this.state.current_vals,
        onChange: function onChange(vals) {
          return _this6.onChange(vals);
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
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_2__["default"], _extends({
            options: store.user_status_options
          }, props));
        },
        onApply: function onApply(option) {
          return store.bulkUpdateUserStatus(option.value);
        }
      },
      add_to_program: {
        component: function component(props) {
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_checkboxed_multi_select__WEBPACK_IMPORTED_MODULE_3__["default"], _extends({
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
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_checkboxed_multi_select__WEBPACK_IMPORTED_MODULE_3__["default"], _extends({
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
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    id: "user-management-index-view",
    className: "row"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_folding_sidebar__WEBPACK_IMPORTED_MODULE_11__["default"], null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "filter-section"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(CountryFilter, {
    store: store,
    selections: store.countries_selections
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(BaseCountryFilter, {
    store: store,
    selections: store.countries_selections
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ProgramFilter, {
    store: store,
    selections: store.program_selections
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "form-group react-multiselect-checkbox"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    htmlFor: "organization_filter"
  }, gettext("Organization")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_checkboxed_multi_select__WEBPACK_IMPORTED_MODULE_3__["default"], {
    value: store.filters.organizations,
    options: store.organization_selections,
    onChange: function onChange(e) {
      return store.changeOrganizationFilter(e);
    },
    placeholder: selection_placeholder,
    id: "organization_filter"
  })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "form-group"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    htmlFor: "status_filter"
  }, gettext("Status")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_2__["default"], {
    value: store.filters.user_status,
    options: store.user_status_options,
    onChange: function onChange(e) {
      return store.changeUserStatusFilter(e);
    },
    placeholder: selection_placeholder,
    id: "status_filter"
  })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "form-group"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
    htmlFor: "admin_role_filter"
  }, gettext("Administrator?")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_2__["default"], {
    value: store.filters.admin_role,
    options: store.admin_role_options,
    onChange: function onChange(e) {
      return store.changeAdminRoleFilter(e);
    },
    placeholder: selection_placeholder,
    id: "admin_role_filter"
  })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(UserFilter, {
    store: store,
    selections: store.user_selections
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
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h1", null, gettext("Admin:"), " ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("small", null, gettext("Users")))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "admin-list__controls"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(BulkActions, {
    primaryOptions: bulk_actions.primary_options,
    secondaryOptions: bulk_actions.secondary_options
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "controls__buttons"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
    href: "#",
    tabIndex: "0",
    className: "btn btn-link btn-add",
    onClick: function onClick() {
      return store.createUser();
    }
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
    className: "fas fa-plus-circle"
  }), gettext("Add user")))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_loading_spinner__WEBPACK_IMPORTED_MODULE_10__["default"], {
    isLoading: store.fetching_users_listing || store.applying_bulk_updates
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "admin-list__table"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_management_table__WEBPACK_IMPORTED_MODULE_4__["default"], {
    data: store.users_listing.map(function (id) {
      return store.users[id];
    }),
    keyField: "id",
    HeaderRow: function HeaderRow(_ref6) {
      var Col = _ref6.Col,
          Row = _ref6.Row;
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
      }, gettext("User")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, null, gettext("Organization")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, null, gettext("Programs")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, {
        size: "0.25"
      }, gettext("Status")));
    },
    Row: function Row(_ref7) {
      var Col = _ref7.Col,
          Row = _ref7.Row,
          data = _ref7.data;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Row, {
        expanded: data.id == store.editing_target,
        Expando: Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function (_ref8) {
          var Wrapper = _ref8.Wrapper;
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Wrapper, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_user_editor__WEBPACK_IMPORTED_MODULE_5__["default"], {
            notifyPaneChange: function notifyPaneChange(new_pane) {
              return store.onProfilePaneChange(new_pane);
            },
            new: data.id == 'new',
            active_pane: store.active_editor_pane,
            ProfileSection: Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(function () {
              return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_loading_spinner__WEBPACK_IMPORTED_MODULE_10__["default"], {
                isLoading: store.fetching_editing_target || store.saving_user_profile || store.saving_user_programs
              }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_edit_user_profile__WEBPACK_IMPORTED_MODULE_6__["default"], {
                disabled: data.organization_id == 1 && !store.is_superuser && data.id != 'new',
                is_superuser: store.is_superuser,
                new: data.id == 'new',
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
              return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_loading_spinner__WEBPACK_IMPORTED_MODULE_10__["default"], {
                isLoading: store.fetching_editing_target || store.saving_user_profile || store.saving_user_programs
              }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_edit_user_programs__WEBPACK_IMPORTED_MODULE_7__["default"], {
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
              return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_loading_spinner__WEBPACK_IMPORTED_MODULE_10__["default"], {
                isLoading: store.fetching_editing_target || store.saving_user_profile || store.saving_user_programs
              }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_edit_user_history__WEBPACK_IMPORTED_MODULE_8__["default"], {
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
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, {
        size: "0.5"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "checkbox",
        checked: store.bulk_targets.get(data.id) || false,
        onChange: function onChange() {
          return store.toggleBulkTarget(data.id);
        }
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, {
        size: "2",
        className: "td--stretch"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
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
        className: "fas fa-user"
      }), "\xA0", data.name || "---", " ", data.is_super && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "badge badge-danger"
      }, gettext("Super Admin"))))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-building"
      }), "\xA0", data.organization_name || "---"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, {
        className: "text-nowrap"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "/tola_management/program/?users[]=".concat(data.id)
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-cubes"
      }), "\xA0", data.user_programs, " ", gettext("programs"))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Col, {
        size: "0.25"
      }, data.is_active ? gettext('Active') : gettext('Inactive')));
    }
  }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "admin-list__metadata"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "metadata__count text-muted text-small"
  }, store.users_count ? "".concat(store.users_count, " ").concat(gettext("users")) : "--"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "metadata__controls"
  }, store.total_pages && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(components_pagination__WEBPACK_IMPORTED_MODULE_9__["default"], {
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
/*! exports provided: UserStore */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserStore", function() { return UserStore; });
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mobx */ "2vnA");
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./api */ "LX42");
var _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, _descriptor25, _descriptor26, _descriptor27, _descriptor28, _descriptor29, _descriptor30, _descriptor31, _descriptor32, _descriptor33, _temp;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

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

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

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
var UserStore = (_class = (_temp =
/*#__PURE__*/
function () {
  //filter options
  // UI state - track what history rows are expanded
  function UserStore(_ref) {
    var _this = this;

    var countries = _ref.countries,
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
    this.countries_selections = this.ordered_country_ids.map(function (id) {
      return _this.countries[id];
    }).map(function (country) {
      return {
        value: country.id,
        label: country.name
      };
    });
    this.organization_selections = Object.values(organizations).map(function (org) {
      return {
        value: org.id,
        label: org.name
      };
    });
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
      return Object.values(programs).map(function (program) {
        return {
          value: program.id,
          label: program.name
        };
      });
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
      this.filters.users = users;
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
      }).catch(function (errors) {
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
      }).catch(function (errors) {
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
      }).catch(function () {
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
      }).catch(function (errors) {
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
      }).catch(function (errors) {
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
      }).catch(function (errors) {
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
      }).catch(function (response) {
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
      }).catch(function (response) {
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
      }).catch(function (response) {
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
        users: []
      };
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
}), _applyDecoratedDescriptor(_class.prototype, "onProfilePaneChange", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "onProfilePaneChange"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "fetchUsers", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "fetchUsers"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "applyFilters", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "applyFilters"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "changePage", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "changePage"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "toggleBulkTargetsAll", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "toggleBulkTargetsAll"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "toggleBulkTarget", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "toggleBulkTarget"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "changeCountryFilter", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "changeCountryFilter"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "changeBaseCountryFilter", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "changeBaseCountryFilter"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "changeOrganizationFilter", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "changeOrganizationFilter"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "changeProgramFilter", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "changeProgramFilter"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "changeUserStatusFilter", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "changeUserStatusFilter"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "changeAdminRoleFilter", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "changeAdminRoleFilter"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "changeUserFilter", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "changeUserFilter"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "toggleEditingTarget", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "toggleEditingTarget"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "updateActiveEditPage", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "updateActiveEditPage"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "createUser", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "createUser"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "updateUserProfile", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "updateUserProfile"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "updateUserIsActive", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "updateUserIsActive"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "resendRegistrationEmail", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "resendRegistrationEmail"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "saveNewUser", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "saveNewUser"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "saveNewUserAndAddAnother", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "saveNewUserAndAddAnother"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "saveUserPrograms", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "saveUserPrograms"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "bulkUpdateUserStatus", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "bulkUpdateUserStatus"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "bulkAddPrograms", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "bulkAddPrograms"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "bulkRemovePrograms", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "bulkRemovePrograms"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "clearFilters", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "clearFilters"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "toggleChangeLogRowExpando", [mobx__WEBPACK_IMPORTED_MODULE_0__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "toggleChangeLogRowExpando"), _class.prototype)), _class);

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

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




var UserEditor = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class =
/*#__PURE__*/
function (_React$Component) {
  _inherits(UserEditor, _React$Component);

  function UserEditor() {
    _classCallCheck(this, UserEditor);

    return _possibleConstructorReturn(this, _getPrototypeOf(UserEditor).apply(this, arguments));
  }

  _createClass(UserEditor, [{
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
          ProgramSection = _this$props.ProgramSection,
          HistorySection = _this$props.HistorySection,
          active_pane = _this$props.active_pane;
      var profile_active_class = active_pane == 'profile' ? 'active' : '';
      var programs_active_class = active_pane == 'programs_and_roles' ? 'active' : '';
      var history_active_class = active_pane == 'status_and_history' ? 'active' : '';
      var new_class = this.props.new ? 'disabled' : '';
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "tab-set--vertical"
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
        className: "nav-link text-nowrap ".concat(programs_active_class, " ").concat(new_class),
        onClick: function onClick(e) {
          e.preventDefault();

          _this.updateActivePage('programs_and_roles');
        }
      }, gettext("Programs and Roles"))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
        className: "nav-item"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "#",
        className: "nav-link text-nowrap ".concat(history_active_class, " ").concat(new_class),
        onClick: function onClick(e) {
          e.preventDefault();

          _this.updateActivePage('status_and_history');
        }
      }, gettext("Status and History")))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "tab-content"
      }, active_pane == 'profile' && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ProfileSection, null), active_pane == 'programs_and_roles' && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ProgramSection, null), active_pane == 'status_and_history' && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(HistorySection, null)));
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

},[["9KAa","runtime","vendors"]]]);
//# sourceMappingURL=tola_management_user-a7e0e3c503fb5848d6b0.js.map