(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{"+aul":function(e,t,r){"use strict";r.r(t);var o,n,a,i,l,c,s,u,p=r("q1tI"),m=r.n(p),d=r("i8i4"),f=r.n(d),h=r("okNM"),b=r("2vnA");function y(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var r=[],o=!0,n=!1,a=void 0;try{for(var i,l=e[Symbol.iterator]();!(o=(i=l.next()).done)&&(r.push(i.value),!t||r.length!==t);o=!0);}catch(e){n=!0,a=e}finally{try{o||null==l.return||l.return()}finally{if(n)throw a}}return r}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function v(e,t,r,o){r&&Object.defineProperty(e,t,{enumerable:r.enumerable,configurable:r.configurable,writable:r.writable,value:r.initializer?r.initializer.call(o):void 0})}function g(r,o,e,t,n){var a={};return Object.keys(t).forEach(function(e){a[e]=t[e]}),a.enumerable=!!a.enumerable,a.configurable=!!a.configurable,("value"in a||a.initializer)&&(a.writable=!0),a=e.slice().reverse().reduce(function(e,t){return t(r,o,e)||e},a),n&&void 0!==a.initializer&&(a.value=a.initializer?a.initializer.call(n):void 0,a.initializer=void 0),void 0===a.initializer&&(Object.defineProperty(r,o,a),a=null),a}function S(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function O(e,t){for(var r=0;r<t.length;r++){var o=t[r];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function P(e,t,r){return t&&O(e.prototype,t),r&&O(e,r),e}var w,E,j,R="---------",k=function(){function r(e,t){S(this,r),this.rootStore=e,this.id=t.id,this.name=t.name,this.frequencies=t.frequencies,this.periodDateRanges=t.periodDateRanges}return P(r,[{key:"periods",value:function(e){return e in this.periodDateRanges&&this.periodDateRanges[e]}},{key:"periodCount",value:function(e){return this.periods(e)?this.periods(e).length:0}}]),r}(),T=function(){function o(e,t){var r=this;S(this,o),this.rootStore=e,this.programs={},t.forEach(function(e){r.programs[e.id]=new k(r.rootStore,e)})}return P(o,[{key:"getProgram",value:function(e){return this.programs[e]}}]),o}(),q=(n=g((o=function(){function r(e){var t=this;S(this,r),v(this,"reportType",n,this),v(this,"tvaSelectedProgram",a,this),v(this,"timeperiodsSelectedProgram",i,this),v(this,"tvaSelectedFrequencyId",l,this),v(this,"tvaShowAll",c,this),v(this,"tvaMostRecent",s,this),v(this,"tvaMostRecentCount",u,this),this.setTVAShowAll=function(){t.tvaShowAll=!0,t.tvaMostRecent=!1},this.setTVAMostRecent=function(e){t.tvaMostRecent=!0,t.tvaShowAll=!1,null!=e&&(t.tvaMostRecentCount=e)},this.programStore=new T(this,e.programs),this.periodLabels=e.labels.targetperiods}return P(r,[{key:"setTVAProgramId",value:function(e){null===e?this.tvaSelectedProgram=null:null!=this.tvaSelectedProgram&&this.tvaSelectedProgram.id==e||(this.tvaSelectedProgram=this.programStore.getProgram(e),this.tvaSelectedFrequencyId&&-1==this.tvaSelectedProgram.frequencies.indexOf(parseInt(this.tvaSelectedFrequencyId))&&this.setTVAFrequencyId(null)),this.reportType=1}},{key:"setTimeperiodsProgramId",value:function(e){null===e?this.timeperiodsSelectedProgram=null:null!=this.timeperiodsSelectedProgram&&this.timeperiodsSelectedProgram.id==e||(this.timeperiodsSelectedProgram=this.programStore.getProgram(e)),this.reportType=2}},{key:"setTVAFrequencyId",value:function(e){null===e?this.tvaSelectedFrequencyId=null:this.tvaSelectedFrequencyId!=e&&(this.tvaSelectedFrequencyId=e),this.reportType=1}},{key:"selectedTVAProgramOption",get:function(){return null===this.tvaSelectedProgram||2==this.reportType?{value:null,label:R}:{value:this.tvaSelectedProgram.id,label:this.tvaSelectedProgram.name}}},{key:"selectedTimeperiodsProgramOption",get:function(){return null===this.timeperiodsSelectedProgram||1==this.reportType?{value:null,label:R}:{value:this.timeperiodsSelectedProgram.id,label:this.timeperiodsSelectedProgram.name}}},{key:"timeperiodsProgramOptions",get:function(){return Object.entries(this.programStore.programs).map(function(e){var t=y(e,2);return{value:t[0],label:t[1].name}})}},{key:"tvaProgramOptions",get:function(){return Object.entries(this.programStore.programs).filter(function(e){var t=y(e,2);t[0];return 0<t[1].frequencies.length}).map(function(e){var t=y(e,2);return{value:t[0],label:t[1].name}})}},{key:"tvaSelectedFrequencyOption",get:function(){return 2==this.reportType||null===this.tvaSelectedProgram||null===this.tvaSelectedFrequencyId?{value:null,label:R}:{value:this.tvaSelectedFrequencyId,label:this.periodLabels[this.tvaSelectedFrequencyId]}}},{key:"tvaFrequencyOptions",get:function(){var t=this;return null===this.tvaSelectedProgram||2==this.reportType?[{value:null,label:R}]:this.tvaSelectedProgram.frequencies.map(function(e){return{value:e,label:t.periodLabels[e]}})}},{key:"tvaRadioDisabled",get:function(){return!(1==this.reportType&&null!=this.tvaSelectedProgram&&null!==this.tvaSelectedFrequencyId)}},{key:"tvaMostRecentCountDisplay",get:function(){return this.tvaMostRecent?this.tvaMostRecentCount:""}},{key:"tvaURL",get:function(){if(2==this.reportType||null==this.tvaSelectedProgram||null==this.tvaSelectedFrequencyId)return!1;var e="/indicators/iptt_report/"+this.tvaSelectedProgram.id+"/targetperiods/?frequency="+this.tvaSelectedFrequencyId;return this.tvaShowAll?e+"&timeframe=1":this.tvaMostRecent?e+"&timeframe=2&numrecentcount="+this.tvaMostRecentCount:e}},{key:"timeperiodsURL",get:function(){return 1!=this.reportType&&null!=this.timeperiodsSelectedProgram&&"/indicators/iptt_report/"+this.timeperiodsSelectedProgram.id+"/timeperiods/?frequency="+"7&timeframe=2&numrecentcount=2"}}]),r}()).prototype,"reportType",[b.l],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return null}}),a=g(o.prototype,"tvaSelectedProgram",[b.l],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return null}}),i=g(o.prototype,"timeperiodsSelectedProgram",[b.l],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return null}}),l=g(o.prototype,"tvaSelectedFrequencyId",[b.l],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return null}}),c=g(o.prototype,"tvaShowAll",[b.l],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return!0}}),s=g(o.prototype,"tvaMostRecent",[b.l],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return null}}),u=g(o.prototype,"tvaMostRecentCount",[b.l],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return 2}}),g(o.prototype,"selectedTVAProgramOption",[b.e],Object.getOwnPropertyDescriptor(o.prototype,"selectedTVAProgramOption"),o.prototype),g(o.prototype,"selectedTimeperiodsProgramOption",[b.e],Object.getOwnPropertyDescriptor(o.prototype,"selectedTimeperiodsProgramOption"),o.prototype),g(o.prototype,"tvaSelectedFrequencyOption",[b.e],Object.getOwnPropertyDescriptor(o.prototype,"tvaSelectedFrequencyOption"),o.prototype),g(o.prototype,"tvaFrequencyOptions",[b.e],Object.getOwnPropertyDescriptor(o.prototype,"tvaFrequencyOptions"),o.prototype),g(o.prototype,"tvaRadioDisabled",[b.e],Object.getOwnPropertyDescriptor(o.prototype,"tvaRadioDisabled"),o.prototype),g(o.prototype,"tvaMostRecentCountDisplay",[b.e],Object.getOwnPropertyDescriptor(o.prototype,"tvaMostRecentCountDisplay"),o.prototype),g(o.prototype,"tvaURL",[b.e],Object.getOwnPropertyDescriptor(o.prototype,"tvaURL"),o.prototype),g(o.prototype,"timeperiodsURL",[b.e],Object.getOwnPropertyDescriptor(o.prototype,"timeperiodsURL"),o.prototype),o),A=r("y2Vs");function F(e){return(F="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function C(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function N(e,t){for(var r=0;r<t.length;r++){var o=t[r];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function M(e,t,r){return t&&N(e.prototype,t),r&&N(e,r),e}function I(e,t){return!t||"object"!==F(t)&&"function"!=typeof t?function(e){if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(e):t}function D(e){return(D=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function _(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&z(e,t)}function z(e,t){return(z=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var V,L=function(e){return m.a.createElement("div",{className:"form-row mb-3"},m.a.createElement("label",{className:"col-form-label text-uppercase"},e.label),e.children)},x=Object(h.b)("labels","rootStore")(w=Object(h.c)(w=function(e){function a(){var e,t;C(this,a);for(var r=arguments.length,o=new Array(r),n=0;n<r;n++)o[n]=arguments[n];return(t=I(this,(e=D(a)).call.apply(e,[this].concat(o)))).selectProgram=function(e){t.props.rootStore.setTVAProgramId(e.value)},t}return _(a,m.a.Component),M(a,[{key:"render",value:function(){return m.a.createElement(L,{label:this.props.labels.programSelect},m.a.createElement(A.default,{options:this.props.rootStore.tvaProgramOptions,value:this.props.rootStore.selectedTVAProgramOption,onChange:this.selectProgram,className:"iptt-react-select"}))}}]),a}())||w)||w,U=Object(h.b)("labels","rootStore")(E=Object(h.c)(E=function(e){function a(){var e,t;C(this,a);for(var r=arguments.length,o=new Array(r),n=0;n<r;n++)o[n]=arguments[n];return(t=I(this,(e=D(a)).call.apply(e,[this].concat(o)))).selectProgram=function(e){t.props.rootStore.setTimeperiodsProgramId(e.value)},t}return _(a,m.a.Component),M(a,[{key:"render",value:function(){return m.a.createElement(L,{label:this.props.labels.programSelect},m.a.createElement(A.default,{options:this.props.rootStore.timeperiodsProgramOptions,value:this.props.rootStore.selectedTimeperiodsProgramOption,onChange:this.selectProgram,className:"iptt-react-select"}))}}]),a}())||E)||E,J=Object(h.b)("labels","rootStore")(j=Object(h.c)(j=function(e){function a(){var e,t;C(this,a);for(var r=arguments.length,o=new Array(r),n=0;n<r;n++)o[n]=arguments[n];return(t=I(this,(e=D(a)).call.apply(e,[this].concat(o)))).selectFrequency=function(e){t.props.rootStore.setTVAFrequencyId(e.value)},t}return _(a,m.a.Component),M(a,[{key:"render",value:function(){return m.a.createElement(L,{label:this.props.labels.periodSelect},m.a.createElement(A.default,{options:this.props.rootStore.tvaFrequencyOptions,value:this.props.rootStore.tvaSelectedFrequencyOption,onChange:this.selectFrequency,className:"iptt-react-select"}))}}]),a}())||j)||j;function B(e){return(B="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function G(e,t){for(var r=0;r<t.length;r++){var o=t[r];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function H(e,t){return!t||"object"!==B(t)&&"function"!=typeof t?function(e){if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(e):t}function K(e){return(K=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function Q(e,t){return(Q=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var W=Object(h.b)("labels","rootStore")(V=Object(h.c)(V=function(e){function a(){var e,t;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,a);for(var r=arguments.length,o=new Array(r),n=0;n<r;n++)o[n]=arguments[n];return(t=H(this,(e=K(a)).call.apply(e,[this].concat(o)))).checkMostRecent=function(){t.props.rootStore.setTVAMostRecent(null)},t.updateMostRecentCount=function(e){t.props.rootStore.setTVAMostRecent(e.target.value)},t}var t,r,o;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&Q(e,t)}(a,m.a.Component),t=a,(r=[{key:"render",value:function(){return m.a.createElement("div",{className:"form-row mb-3"},m.a.createElement("div",{className:"col-sm-4"},m.a.createElement("div",{className:"form-check form-check-inline pt-1"},m.a.createElement("span",{className:"form-check-input"},m.a.createElement("input",{type:"radio",checked:this.props.rootStore.tvaShowAll,disabled:this.props.rootStore.tvaRadioDisabled,onChange:this.props.rootStore.setTVAShowAll})),m.a.createElement("label",{className:"form-check-label"},this.props.labels.showAll))),m.a.createElement("div",{className:"col-sm-4 p-0"},m.a.createElement("div",{className:"form-check form-check-inline pt-1"},m.a.createElement("span",{className:"form-check-input"},m.a.createElement("input",{type:"radio",checked:this.props.rootStore.tvaMostRecent,disabled:this.props.rootStore.tvaRadioDisabled,onChange:this.checkMostRecent})),m.a.createElement("label",{className:"form-check-label"},this.props.labels.mostRecent))),m.a.createElement("div",{className:"col-sm-4"},m.a.createElement("input",{type:"number",className:"form-control",value:this.props.rootStore.tvaMostRecentCountDisplay,disabled:this.props.rootStore.tvaRadioDisabled,placeholder:this.props.labels.mostRecentPlaceholder,onChange:this.updateMostRecentCount})))}}])&&G(t.prototype,r),o&&G(t,o),a}())||V)||V,X=Object(h.b)("labels","rootStore")(Object(h.c)(function(e){var t=e.url,r=e.labels,o=e.rootStore;return m.a.createElement("div",{className:"d-flex justify-content-center mb-1"},m.a.createElement("button",{className:"btn btn-primary",onClick:function(){return window.location.href=o[t]},disabled:!o[t],style:{width:"100%"}},r.submitButton))})),Y=function(e){var t=e.children;return m.a.createElement("div",{className:"col-sm-6"},m.a.createElement("div",{className:"card"},m.a.createElement("div",{className:"card-body"},t)))},Z=Object(h.b)("labels")(Object(h.c)(function(e){var t=e.labels;return m.a.createElement(Y,null,m.a.createElement("h5",{className:"card-title"},t.tvaFilterTitle),m.a.createElement("p",{className:"card-subtitle text-muted mb-2"},t.tvaFilterSubtitle),m.a.createElement(x,null),m.a.createElement(J,null),m.a.createElement(W,null),m.a.createElement(X,{url:"tvaURL"}))})),$=Object(h.b)("labels")(Object(h.c)(function(e){var t=e.labels;return m.a.createElement(Y,null,m.a.createElement("h5",{className:"card-title"},t.timeperiodsFilterTitle),m.a.createElement("p",{className:"card-subtitle text-muted mb-2"},t.timeperiodsFilterSubtitle),m.a.createElement(U,null),m.a.createElement(X,{url:"timeperiodsURL"}))})),ee=jsContext.labels,te=new q(jsContext);f.a.render(m.a.createElement(h.a,{labels:ee,rootStore:te},m.a.createElement(function(){return m.a.createElement("div",{className:"row"},m.a.createElement(Z,null),m.a.createElement($,null))},null)),document.querySelector("#id_div_top_quickstart_iptt"))}},[["+aul",0,1]]]);