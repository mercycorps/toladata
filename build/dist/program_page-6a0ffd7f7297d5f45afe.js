(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{DaGC:function(e,t){$("[data-delete-pinned-report]").click(function(e){e.preventDefault();var t=$(this).data("deletePinnedReport"),r=$(this).closest(".pinned-report");window.confirm(gettext("Warning: This action cannot be undone. Are you sure you want to delete this pinned report?"))&&$.ajax({type:"POST",url:jsContext.delete_pinned_report_url,data:{pinned_report_id:t},success:function(){r.remove()}})})},LBcr:function(e,t,r){"use strict";r.d(t,"a",function(){return o}),r.d(t,"b",function(){return l}),r.d(t,"c",function(){return c});var n=window.userLang,a="numeric",i={year:a,month:"short",day:a};function o(e){return new Date(e)}function l(e){var t=e.split("-").map(function(e){return parseInt(e)});return new Date(t[0],t[1]-1,t[2])}function c(e){return new Intl.DateTimeFormat(n,i).format(e)}},aJgA:function(e,t,r){"use strict";r.r(t);var n,a,i,o,l,c,s,d,u,p=r("q1tI"),I=r.n(p),g=r("i8i4"),f=r.n(g),m=r("qtBC"),h=r("wgi2"),y=r("0pHI"),v=r("TSYQ"),E=r.n(v),b=r("okNM"),_=r("hzyr"),w=r("7O5W"),k=r("IP2g"),O=r("wHSu"),T=r("2vnA");function N(e,t,r,n){r&&Object.defineProperty(e,t,{enumerable:r.enumerable,configurable:r.configurable,writable:r.writable,value:r.initializer?r.initializer.call(n):void 0})}function S(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function x(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function j(e,t,r){return t&&x(e.prototype,t),r&&x(e,r),e}function C(r,n,e,t,a){var i={};return Object.keys(t).forEach(function(e){i[e]=t[e]}),i.enumerable=!!i.enumerable,i.configurable=!!i.configurable,("value"in i||i.initializer)&&(i.writable=!0),i=e.slice().reverse().reduce(function(e,t){return t(r,n,e)||e},i),a&&void 0!==i.initializer&&(i.value=i.initializer?i.initializer.call(a):void 0,i.initializer=void 0),void 0===i.initializer&&(Object.defineProperty(r,n,i),i=null),i}var L,R,F,P=Object.freeze({noFilter:0,missingTarget:1,missingResults:2,missingEvidence:3,aboveTarget:5,belowTarget:6,onTarget:7}),M=(a=C((n=function(){function t(e){S(this,t),N(this,"indicators",a,this),this.indicators=e,this.updateIndicator=this.updateIndicator.bind(this),this.removeIndicator=this.removeIndicator.bind(this),this.filterIndicators=this.filterIndicators.bind(this)}return j(t,[{key:"updateIndicator",value:function(t){var e=this.indicators.findIndex(function(e){return e.id===t.id});-1<e?this.indicators[e]=t:this.indicators.push(t)}},{key:"removeIndicator",value:function(t){this.indicators=this.indicators.filter(function(e){return e.id!=t})}},{key:"sortIndicators",value:function(e,t,r){return e?r:t?r.slice().sort(function(e,t){if(e.level&&e.level.ontology){if(t.level&&t.level.ontology){for(var r=e.level.ontology.split("."),n=t.level.ontology.split("."),a=0;a<r.length;a++)if(r[a]!=n[a])return r[a]-n[a];return 0}return-1}return t.level&&t.level.ontology?1:0}):r.slice().sort(function(e,t){if(e.level&&e.level.level_depth){if(t.level&&t.level.level_depth){if(e.level.level_depth!==t.level.level_depth)return e.level.level_depth-t.level.level_depth;for(var r=e.level.ontology.split("."),n=t.level.ontology.split("."),a=0;a<r.length;a++)if(r[a]!=n[a])return r[a]-n[a];return(e.level_order||0)-(t.level_order||0)}return-1}return t.level&&t.level.level_depth?1:0})}},{key:"filterIndicators",value:function(e){var t;switch(e){case P.missingTarget:t=this.getIndicatorsNeedingTargets;break;case P.missingResults:t=this.getIndicatorsNeedingResults;break;case P.missingEvidence:t=this.getIndicatorsNeedingEvidence;break;case P.aboveTarget:t=this.getIndicatorsAboveTarget;break;case P.belowTarget:t=this.getIndicatorsBelowTarget;break;case P.onTarget:t=this.getIndicatorsOnTarget;break;case P.noFilter:default:t=this.indicators}return t}},{key:"getIndicatorsNeedingTargets",get:function(){return this.indicators.filter(function(e){return 0===e.all_targets_defined})}},{key:"getIndicatorsNeedingResults",get:function(){return this.indicators.filter(function(e){return 0===e.results_count})}},{key:"getIndicatorsNeedingEvidence",get:function(){return this.indicators.filter(function(e){return e.results_count!==e.results_with_evidence_count})}},{key:"getIndicatorsNotReporting",get:function(){return this.indicators.filter(function(e){return null===e.over_under})}},{key:"getIndicatorsAboveTarget",get:function(){return this.indicators.filter(function(e){return 0<e.over_under})}},{key:"getIndicatorsBelowTarget",get:function(){return this.indicators.filter(function(e){return e.over_under<0})}},{key:"getIndicatorsOnTarget",get:function(){return this.indicators.filter(function(e){return 0===e.over_under})}},{key:"getIndicatorsReporting",get:function(){return this.indicators.filter(function(e){return!0===e.reporting})}},{key:"getTotalResultsCount",get:function(){return this.indicators.reduce(function(e,t){return e+t.results_count},0)}},{key:"getTotalResultsWithEvidenceCount",get:function(){return this.indicators.reduce(function(e,t){return e+t.results_with_evidence_count},0)}}]),t}()).prototype,"indicators",[T.n],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return[]}}),C(n.prototype,"updateIndicator",[T.d],Object.getOwnPropertyDescriptor(n.prototype,"updateIndicator"),n.prototype),C(n.prototype,"removeIndicator",[T.d],Object.getOwnPropertyDescriptor(n.prototype,"removeIndicator"),n.prototype),C(n.prototype,"getIndicatorsNeedingTargets",[T.f],Object.getOwnPropertyDescriptor(n.prototype,"getIndicatorsNeedingTargets"),n.prototype),C(n.prototype,"getIndicatorsNeedingResults",[T.f],Object.getOwnPropertyDescriptor(n.prototype,"getIndicatorsNeedingResults"),n.prototype),C(n.prototype,"getIndicatorsNeedingEvidence",[T.f],Object.getOwnPropertyDescriptor(n.prototype,"getIndicatorsNeedingEvidence"),n.prototype),C(n.prototype,"getIndicatorsNotReporting",[T.f],Object.getOwnPropertyDescriptor(n.prototype,"getIndicatorsNotReporting"),n.prototype),C(n.prototype,"getIndicatorsAboveTarget",[T.f],Object.getOwnPropertyDescriptor(n.prototype,"getIndicatorsAboveTarget"),n.prototype),C(n.prototype,"getIndicatorsBelowTarget",[T.f],Object.getOwnPropertyDescriptor(n.prototype,"getIndicatorsBelowTarget"),n.prototype),C(n.prototype,"getIndicatorsOnTarget",[T.f],Object.getOwnPropertyDescriptor(n.prototype,"getIndicatorsOnTarget"),n.prototype),C(n.prototype,"getIndicatorsReporting",[T.f],Object.getOwnPropertyDescriptor(n.prototype,"getIndicatorsReporting"),n.prototype),C(n.prototype,"getTotalResultsCount",[T.f],Object.getOwnPropertyDescriptor(n.prototype,"getTotalResultsCount"),n.prototype),C(n.prototype,"getTotalResultsWithEvidenceCount",[T.f],Object.getOwnPropertyDescriptor(n.prototype,"getTotalResultsWithEvidenceCount"),n.prototype),n),D=(o=C((i=function(){function r(e,t){S(this,r),this.indicatorStore=void 0,N(this,"program",o,this),N(this,"resultsMap",l,this),this.indicatorStore=new M(e),this.program=t,this.addResultsHTML=this.addResultsHTML.bind(this),this.deleteResultsHTML=this.deleteResultsHTML.bind(this)}return j(r,[{key:"addResultsHTML",value:function(e,t){this.resultsMap.set(parseInt(e),t)}},{key:"deleteResultsHTML",value:function(e){this.resultsMap.delete(e)}},{key:"deleteAllResultsHTML",value:function(){this.resultsMap.clear()}},{key:"oldStyleLevels",get:function(){return!this.program.results_framework}}]),r}()).prototype,"program",[T.n],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return{}}}),l=C(i.prototype,"resultsMap",[T.n],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return new Map}}),C(i.prototype,"addResultsHTML",[T.d],Object.getOwnPropertyDescriptor(i.prototype,"addResultsHTML"),i.prototype),C(i.prototype,"deleteResultsHTML",[T.d],Object.getOwnPropertyDescriptor(i.prototype,"deleteResultsHTML"),i.prototype),C(i.prototype,"deleteAllResultsHTML",[T.d],Object.getOwnPropertyDescriptor(i.prototype,"deleteAllResultsHTML"),i.prototype),C(i.prototype,"oldStyleLevels",[T.f],Object.getOwnPropertyDescriptor(i.prototype,"oldStyleLevels"),i.prototype),i),B=(s=C((c=function(){function t(e){S(this,t),N(this,"currentIndicatorFilter",s,this),N(this,"selectedIndicatorId",d,this),N(this,"groupByChain",u,this),this.resultChainFilterLabel=e,this.setIndicatorFilter=this.setIndicatorFilter.bind(this),this.clearIndicatorFilter=this.clearIndicatorFilter.bind(this),this.setSelectedIndicatorId=this.setSelectedIndicatorId.bind(this)}return j(t,[{key:"setIndicatorFilter",value:function(e){this.currentIndicatorFilter=e}},{key:"clearIndicatorFilter",value:function(){this.currentIndicatorFilter=null}},{key:"setSelectedIndicatorId",value:function(e){this.selectedIndicatorId=e}},{key:"setGroupBy",value:function(e){this.groupByChain=1==e}},{key:"groupByOptions",get:function(){return[{value:1,label:this.resultChainFilterLabel},{value:2,label:gettext("by Level")}]}},{key:"selectedGroupByOption",get:function(){return this.groupByChain?this.groupByOptions[0]:this.groupByOptions[1]}}]),t}()).prototype,"currentIndicatorFilter",[T.n],{configurable:!0,enumerable:!0,writable:!0,initializer:null}),d=C(c.prototype,"selectedIndicatorId",[T.n],{configurable:!0,enumerable:!0,writable:!0,initializer:null}),u=C(c.prototype,"groupByChain",[T.n],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return!0}}),C(c.prototype,"setIndicatorFilter",[T.d],Object.getOwnPropertyDescriptor(c.prototype,"setIndicatorFilter"),c.prototype),C(c.prototype,"clearIndicatorFilter",[T.d],Object.getOwnPropertyDescriptor(c.prototype,"clearIndicatorFilter"),c.prototype),C(c.prototype,"setSelectedIndicatorId",[T.d],Object.getOwnPropertyDescriptor(c.prototype,"setSelectedIndicatorId"),c.prototype),C(c.prototype,"groupByOptions",[T.f],Object.getOwnPropertyDescriptor(c.prototype,"groupByOptions"),c.prototype),C(c.prototype,"selectedGroupByOption",[T.f],Object.getOwnPropertyDescriptor(c.prototype,"selectedGroupByOption"),c.prototype),C(c.prototype,"setGroupBy",[T.d],Object.getOwnPropertyDescriptor(c.prototype,"setGroupBy"),c.prototype),c),A=r("y2Vs");function H(e){return(H="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function z(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function G(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function q(e,t,r){return t&&G(e.prototype,t),r&&G(e,r),e}function U(e,t){return!t||"object"!==H(t)&&"function"!=typeof t?J(e):t}function J(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function W(e){return(W=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function K(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&V(e,t)}function V(e,t){return(V=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}w.b.add(O.b,O.c);var Y,Q,X=Object(b.c)(L=function(e){function r(e){var t;return z(this,r),(t=U(this,W(r).call(this,e))).onShowAllClick=function(e){e.preventDefault(),m.a.emit("nav-clear-all-indicator-filters")},t}return K(r,I.a.Component),q(r,[{key:"render",value:function(){var e=this.props,t=e.indicatorCount,r=e.programId,n=e.currentIndicatorFilter,a=e.filterApplied,i=e.readonly;return I.a.createElement("div",{className:"indicators-list__header"},I.a.createElement("h3",{className:"no-bold"},I.a.createElement("span",{id:"indicators-list-title"},function(e,t){var r;switch(e){case P.missingTarget:return r=ngettext("%s indicator has missing targets","%s indicators have missing targets",t),interpolate(r,[t]);case P.missingResults:return r=ngettext("%s indicator has missing results","%s indicators have missing results",t),interpolate(r,[t]);case P.missingEvidence:return r=ngettext("%s indicator has missing evidence","%s indicators have missing evidence",t),interpolate(r,[t]);case P.aboveTarget:return r=ngettext("%s indicator is >15% above target","%s indicators are >15% above target",t),interpolate(r,[t]);case P.belowTarget:return r=ngettext("%s indicator is >15% below target","%s indicators are >15% below target",t),interpolate(r,[t]);case P.onTarget:return r=ngettext("%s indicator is on track","%s indicators are on track",t),interpolate(r,[t]);default:return r=ngettext("%s indicator","%s indicators",t),interpolate(r,[t])}}(n,t)," "),a&&I.a.createElement("a",{href:"#",id:"show-all-indicators",onClick:this.onShowAllClick},I.a.createElement("small",null,gettext("Show all")))),I.a.createElement("div",null,!i&&I.a.createElement(_.a,{readonly:i,programId:r})))}}]),r}())||L,Z=Object(b.c)(R=function(e){function i(){var e,t;z(this,i);for(var r=arguments.length,n=new Array(r),a=0;a<r;a++)n[a]=arguments[a];return(t=U(this,(e=W(i)).call.apply(e,[this].concat(n)))).onSelection=function(e){var t=e?e.value:null;t&&m.a.emit("nav-select-indicator-to-filter",t)},t.onGroupingSelection=function(e){t.props.uiStore.setGroupBy(e.value)},t}return K(i,I.a.Component),q(i,[{key:"render",value:function(){var e=this.props.rootStore.indicatorStore.indicators,t=this.props.uiStore.selectedIndicatorId,r=e.map(function(e){return{value:e.id,label:e.name}}),n=null;t&&(n=r.find(function(e){return e.value===t}));var a=this.props.uiStore.groupByOptions,i=this.props.uiStore.selectedGroupByOption;return I.a.createElement("nav",{className:"list__filters list__filters--block-label",id:"id_div_indicators"},I.a.createElement("div",{className:"form-group"},I.a.createElement("label",{className:""},gettext("Find an indicator:")),I.a.createElement("div",{className:""},I.a.createElement(A.default,{options:r,value:n,isClearable:!1,placeholder:gettext("None"),onChange:this.onSelection}))),!this.props.rootStore.oldStyleLevels&&I.a.createElement(I.a.Fragment,null,I.a.createElement("div",{className:"form-group"},I.a.createElement("label",{className:""},gettext("Group indicators:")),I.a.createElement("div",{className:""},I.a.createElement(A.default,{options:a,value:i,isClearable:!1,onChange:this.onGroupingSelection})))))}}]),i}())||R,ee=Object(b.c)(F=function(e){function r(e){var t;return z(this,r),(t=U(this,W(r).call(this,e))).onIndicatorUpdateClick=t.onIndicatorUpdateClick.bind(J(J(t))),t.onIndicatorResultsToggleClick=t.onIndicatorResultsToggleClick.bind(J(J(t))),t}return K(r,I.a.Component),q(r,[{key:"onIndicatorUpdateClick",value:function(e,t){e.preventDefault(),m.a.emit("open-indicator-update-modal",t)}},{key:"onIndicatorResultsToggleClick",value:function(e,t){e.preventDefault(),this.props.resultsMap.has(t)?m.a.emit("delete-indicator-results",t):m.a.emit("load-indicator-results",t)}},{key:"render",value:function(){var o=this,e=this.props.indicators,t=this.props.program,l=new Date(t.reporting_period_end),c=this.props.resultsMap;return I.a.createElement("table",{className:"table indicators-list"},I.a.createElement("thead",null,I.a.createElement("tr",{className:"table-header"},I.a.createElement("th",{className:"",id:"id_indicator_name_col_header"},gettext("Indicator")),I.a.createElement("th",{className:"",id:"id_indicator_buttons_col_header"}," "),this.props.oldStyleLevels&&I.a.createElement("th",{className:"",id:"id_indicator_level_col_header"},gettext("Level")),I.a.createElement("th",{className:"",id:"id_indicator_unit_col_header"},gettext("Unit of measure")),I.a.createElement("th",{className:"text-right",id:"id_indicator_baseline_col_header"},gettext("Baseline")),I.a.createElement("th",{className:"text-right",id:"id_indicator_target_col_header"},gettext("Target")))),I.a.createElement("tbody",null,e.map(function(t){var e=c.has(t.id),r=c.get(t.id),n=t.target_period_last_end_date?new Date(t.target_period_last_end_date):null,a=2==parseInt(t.unit_of_measure_type)?function(e){return e?"".concat(e,"%"):""}:function(e){return e?"".concat(e):""},i=function(e){return""==e||isNaN(parseFloat(e))?"":"00"==(e=parseFloat(e).toFixed(2)).slice(-2)?a(e.slice(0,-3)):"0"==e.slice(-1)?a(e.slice(0,-1)):a(e)};return I.a.createElement(I.a.Fragment,{key:t.id},I.a.createElement("tr",{className:E()("indicators-list__row","indicators-list__indicator-header",{"is-highlighted":t.just_created,"is-expanded":e})},I.a.createElement("td",null,I.a.createElement("a",{href:"#",className:"indicator_results_toggle btn btn-link text-left",onClick:function(e){return o.onIndicatorResultsToggleClick(e,t.id)}},I.a.createElement(k.a,{icon:e?"caret-down":"caret-right"}),I.a.createElement("strong",null,t.number_if_numbering||t.number_display?t.number_display+":":"")," ",I.a.createElement("span",{className:"indicator_name"},t.name)),t.key_performance_indicator&&I.a.createElement("span",{className:"badge"},"KPI"),n&&n<l&&I.a.createElement("a",{href:"/indicators/indicator_update/".concat(t.id,"/"),className:"indicator-link color-red missing_targets","data-toggle":"modal","data-target":"#indicator_modal_div","data-tab":"targets"},I.a.createElement("i",{className:"fas fa-bullseye"})," Missing targets")),I.a.createElement("td",null,I.a.createElement("a",{href:"#",className:"indicator-link",onClick:function(e){return o.onIndicatorUpdateClick(e,t.id)}},I.a.createElement("i",{className:"fas fa-cog"}))),o.props.oldStyleLevels&&I.a.createElement("td",null,t.old_level),I.a.createElement("td",null,t.unit_of_measure),I.a.createElement("td",{className:"text-right"},t.baseline_na?gettext("N/A"):i(t.baseline)),I.a.createElement("td",{className:"text-right"},i(t.lop_target_active))),e&&I.a.createElement("tr",{className:"indicators-list__row indicators-list__indicator-body"},I.a.createElement("td",{colSpan:"6",ref:function(e){return $(e).find('[data-toggle="popover"]').popover({html:!0})}},I.a.createElement("div",{dangerouslySetInnerHTML:{__html:r}}))))})))}}]),r}())||F,te=Object(b.c)(function(e){var t=e.rootStore.program,r=e.rootStore.indicatorStore,n=e.rootStore.resultsMap,a=e.uiStore.currentIndicatorFilter,i=e.uiStore.selectedIndicatorId,o=e.uiStore.groupByChain,l=r.filterIndicators(a);return l=r.sortIndicators(e.rootStore.oldStyleLevels,o,l),i&&(l=l.filter(function(e){return e.id==i})),I.a.createElement(I.a.Fragment,null,I.a.createElement(X,{indicatorCount:l.length,programId:t.id,currentIndicatorFilter:a,filterApplied:a||i,readonly:e.readonly}),I.a.createElement(Z,{uiStore:e.uiStore,rootStore:e.rootStore}),t.does_it_need_additional_target_periods&&I.a.createElement("div",{id:"id_missing_targets_msg",className:"color-red"},I.a.createElement("i",{className:"fas fa-bullseye"})," ",gettext("Some indicators have missing targets. To enter these values, click the target icon near the indicator name.")),I.a.createElement(ee,{indicators:l,resultsMap:n,program:t,oldStyleLevels:e.rootStore.oldStyleLevels}))}),re=r("LBcr");function ne(){return(ne=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e}).apply(this,arguments)}function ae(e){return(ae="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function ie(e){return function(e){if(Array.isArray(e)){for(var t=0,r=new Array(e.length);t<e.length;t++)r[t]=e[t];return r}}(e)||function(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function oe(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function le(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function ce(e,t,r){return t&&le(e.prototype,t),r&&le(e,r),e}function se(e,t){return!t||"object"!==ae(t)&&"function"!=typeof t?function(e){if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(e):t}function de(e){return(de=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function ue(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&pe(e,t)}function pe(e,t){return(pe=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var ge=Object(b.c)(Y=function(e){function i(){var e,t;oe(this,i);for(var r=arguments.length,n=new Array(r),a=0;a<r;a++)n[a]=arguments[a];return(t=se(this,(e=de(i)).call.apply(e,[this].concat(n)))).handleClick=function(e){e.preventDefault(),t.props.disabled||0==t.unfilledPercent||m.a.emit("nav-apply-gauge-tank-filter",t.props.filterType)},t}return ue(i,I.a.Component),ce(i,[{key:"render",value:function(){var e=this.props,t=e.allIndicatorsLength,r=e.filteredIndicatorsLength,n=e.title,a=e.filledLabel,i=e.unfilledLabel,o=e.cta,l=e.emptyLabel,c=e.disabled,s=this.props.filterType===this.props.currentIndicatorFilter,d=t<=0||t==r?100:0==r?0:Math.max(1,Math.min(Math.round(r/t*100),99)),u=100-(this.unfilledPercent=d);return I.a.createElement("div",{className:E()("gauge",{"filter-trigger":0<d&&!c,"is-highlighted":s}),onClick:this.handleClick},I.a.createElement("h6",{className:"gauge__title"},n),I.a.createElement("div",{className:"gauge__overview"},I.a.createElement("div",{className:"gauge__graphic gauge__graphic--tank{% if filled_percent == 0 %} gauge__graphic--empty{% endif %}"},I.a.createElement("div",{className:"graphic__tick-marks"},ie(Array(10)).map(function(e,t){return I.a.createElement("div",{key:t,className:"graphic__tick"})})),I.a.createElement("div",{className:"graphic__tank--unfilled",style:{flexBasis:"".concat(d,"%")}}),I.a.createElement("div",{className:"graphic__tank--filled",style:{flexBasis:"".concat(u,"%")}})),I.a.createElement("div",{className:"gauge__labels"},0<u?I.a.createElement(I.a.Fragment,null,I.a.createElement("div",{className:"gauge__label text-muted"},d,"% ",i),I.a.createElement("div",{className:"gauge__label"},I.a.createElement("span",{className:"gauge__value"},u,"% ",a))):I.a.createElement("div",{className:"gauge__label"},I.a.createElement("span",{className:"text-danger"},I.a.createElement("strong",null,l))))),0<d&&!c&&I.a.createElement("div",{className:"gauge__cta"},I.a.createElement("span",{className:"btn-link btn-inline"},I.a.createElement("i",{className:"fas fa-exclamation-triangle text-warning"})," ",o)," "))}}]),i}())||Y,fe=Object(b.c)(Q=function(e){function r(e){var t;return oe(this,r),(t=se(this,de(r).call(this,e))).onFilterLinkClick=function(e,t){e.preventDefault(),m.a.emit("nav-apply-gauge-tank-filter",t)},t.handledFilterTypes=new Set([P.aboveTarget,P.belowTarget,P.onTarget]),t}return ue(r,I.a.Component),ce(r,[{key:"componentDidUpdate",value:function(){$(this.el).find('[data-toggle="popover"]').popover({html:!0})}},{key:"render",value:function(){var t=this,e=this.props,r=e.indicatorStore,n=e.program,a=this.props.currentIndicatorFilter,i=this.handledFilterTypes.has(a),o=r.indicators.length,l=r.getIndicatorsNotReporting.length,c=r.getIndicatorsAboveTarget.length,s=r.getIndicatorsBelowTarget.length,d=r.getIndicatorsOnTarget.length,u=0<o?function(e){return e==o?100:0==e?0:Math.max(1,Math.min(Math.round(e/o*100),99))}:function(e){return 0},p=u(c),g=u(d),f=u(s),m=u(l),h=100*this.props.indicatorOnScopeMargin,y=(Object(re.b)(n.reporting_period_start),0===r.getIndicatorsReporting.length||0===r.getTotalResultsCount),v=function(){var e=gettext("<strong>%(percentHigh)s%</strong> are >%(marginPercent)s% above target");return{__html:interpolate(e,{percentHigh:p,marginPercent:h},!0)}},b=function(){var e=gettext("<strong>%s%</strong> are on track");return{__html:interpolate(e,[g])}},_=function(){var e=gettext("<strong>%(percentBelow)s%</strong> are >%(marginPercent)s% below target");return{__html:interpolate(e,{percentBelow:f,marginPercent:h},!0)}};return I.a.createElement(function(e){return I.a.createElement("div",{className:E()("gauge",{"is-highlighted":i}),ref:function(e){return t.el=e}},I.a.createElement("h6",{className:"gauge__title"},gettext("Indicators on track")),I.a.createElement("div",{className:"gauge__overview"},e.children))},null,I.a.createElement("div",{className:"gauge__graphic gauge__graphic--performance-band"},I.a.createElement("div",{className:"graphic__tick-marks"},ie(Array(10)).map(function(e,t){return I.a.createElement("div",{key:t,className:"graphic__tick"})})),I.a.createElement("div",{className:"graphic__performance-band--above-target",style:{flexBasis:"".concat(p,"%")}}),I.a.createElement("div",{className:"graphic__performance-band--on-target",style:{flexBasis:"".concat(g,"%")}}),I.a.createElement("div",{className:"graphic__performance-band--below-target",style:{flexBasis:"".concat(f,"%")}})),y?I.a.createElement("div",{className:"gauge__labels"},I.a.createElement("div",{className:"gauge__label"},I.a.createElement("p",{className:"text-muted"},gettext("Unavailable until the first target period ends with results reported.")))):I.a.createElement(function(e){return I.a.createElement("div",{className:"gauge__labels"},I.a.createElement("div",{className:"gauge__label"},I.a.createElement("span",{className:"text-muted"},interpolate(gettext("%(percentNonReporting)s% unavailable"),{percentNonReporting:m},!0))," ",I.a.createElement("a",{href:"#",tabIndex:"0","data-toggle":"popover","data-placement":"right","data-trigger":"focus","data-content":gettext("The indicator has no targets, no completed target periods, or no results reported."),onClick:function(e){return e.preventDefault()}},I.a.createElement("i",{className:"far fa-question-circle"}))),I.a.createElement("div",{className:"gauge__label"},I.a.createElement("span",{className:"gauge__value--above filter-trigger--band",onClick:function(e){return t.onFilterLinkClick(e,P.aboveTarget)},dangerouslySetInnerHTML:v()})),I.a.createElement("div",{className:"gauge__label"},I.a.createElement("span",{className:"gauge__value filter-trigger--band",onClick:function(e){return t.onFilterLinkClick(e,P.onTarget)},dangerouslySetInnerHTML:b()})," ",I.a.createElement("a",{href:"#",tabIndex:"0","data-toggle":"popover","data-placement":"right","data-trigger":"focus","data-content":gettext("The actual value matches the target value, plus or minus 15%. So if your target is 100 and your result is 110, the indicator is 10% above target and on track.  <br><br>Please note that if your indicator has a decreasing direction of change, then “above” and “below” are switched. In that case, if your target is 100 and your result is 200, your indicator is 50% below target and not on track.<br><br><a href='https://docs.google.com/document/d/1Gl9bxJJ6hdhCXeoOCoR1mnVKZa2FlEOhaJcjexiHzY0' target='_blank'>See our documentation for more information.</a>"),onClick:function(e){return e.preventDefault()}},I.a.createElement("i",{className:"far fa-question-circle"}))),I.a.createElement("div",{className:"gauge__label"},I.a.createElement("span",{className:"gauge__value--below filter-trigger--band",onClick:function(e){return t.onFilterLinkClick(e,P.belowTarget)},dangerouslySetInnerHTML:_()})))},null))}}]),r}())||Q,me=Object(b.c)(function(e){var t=e.rootStore.program,r=e.rootStore.indicatorStore,n=r.indicators,a=e.uiStore.currentIndicatorFilter,i=this.props.indicatorOnScopeMargin,o={title:gettext("Indicators with targets"),filledLabel:gettext("have targets"),unfilledLabel:gettext("no targets"),cta:gettext("Indicators missing targets"),emptyLabel:gettext("No targets")},l={title:gettext("Indicators with results"),filledLabel:gettext("have results"),unfilledLabel:gettext("no results"),cta:gettext("Indicators missing results"),emptyLabel:gettext("No results")},c={title:gettext("Results with evidence"),filledLabel:gettext("have evidence"),unfilledLabel:gettext("no evidence"),cta:gettext("Indicators missing evidence"),emptyLabel:gettext("No evidence")},s=n.map(function(e){return 1===e.all_targets_defined}).some(function(e){return e}),d=n.map(function(e){return e.results_count}).some(function(e){return 0<e});return 0===n.length?null:I.a.createElement("div",{className:"status__gauges"},I.a.createElement(fe,{currentIndicatorFilter:a,indicatorOnScopeMargin:i,indicatorStore:r,program:t}),I.a.createElement(ge,ne({filterType:P.missingTarget,currentIndicatorFilter:a,allIndicatorsLength:n.length,filteredIndicatorsLength:r.getIndicatorsNeedingTargets.length},o)),I.a.createElement(ge,ne({filterType:P.missingResults,currentIndicatorFilter:a,allIndicatorsLength:n.length,filteredIndicatorsLength:r.getIndicatorsNeedingResults.length,disabled:!s},l)),I.a.createElement(ge,ne({filterType:P.missingEvidence,currentIndicatorFilter:a,allIndicatorsLength:r.getTotalResultsCount,filteredIndicatorsLength:r.getTotalResultsCount-r.getTotalResultsWithEvidenceCount,disabled:!s||!d},c)))}),he=(r("DaGC"),new D(jsContext.indicators,jsContext.program)),ye=new B(jsContext.result_chain_filter);m.a.on("open-indicator-update-modal",function(e){var t="/indicators/indicator_update/".concat(e,"/");$("#indicator_modal_content").empty(),$("#modalmessages").empty(),$("#indicator_modal_content").load(t),$("#indicator_modal_div").modal("show")}),m.a.on("load-indicator-results",function(t){if(t){var e="/indicators/result_table/".concat(t,"/").concat(he.program.id,"/");$.get(e,function(e){he.addResultsHTML(t,e)})}}),m.a.on("delete-indicator-results",function(e){he.deleteResultsHTML(e)}),m.a.on("reload-indicator",function(e){$.get("/indicators/api/indicator/".concat(e),he.indicatorStore.updateIndicator)}),m.a.on("indicator-deleted",he.indicatorStore.removeIndicator),m.a.on("close-all-indicators",function(){he.deleteAllResultsHTML()}),m.a.on("apply-gauge-tank-filter",function(e){m.a.emit("clear-all-indicator-filters"),ye.setIndicatorFilter(e)}),m.a.on("clear-all-indicator-filters",function(){ye.clearIndicatorFilter(),m.a.emit("select-indicator-to-filter",null),m.a.emit("close-all-indicators")}),m.a.on("select-indicator-to-filter",function(e){ye.clearIndicatorFilter(),ye.setSelectedIndicatorId(e),m.a.emit("load-indicator-results",e)}),f.a.render(I.a.createElement(te,{rootStore:he,uiStore:ye,readonly:jsContext.readonly}),document.querySelector("#indicator-list-react-component")),f.a.render(I.a.createElement(me,{rootStore:he,uiStore:ye,indicatorOnScopeMargin:jsContext.indicator_on_scope_margin}),document.querySelector("#program-metrics-react-component")),$("#indicator-list-react-component").on("click",".results__link",function(e){e.preventDefault();var t=$(this).attr("href");t+="?modal=1",$("#indicator_modal_content").empty(),$("#modalmessages").empty(),$("#indicator_results_modal_content").load(t),$("#indicator_results_div").modal("show")}),$("#indicator-list-react-component").on("click",".indicator-link[data-tab]",function(e){e.preventDefault();var t=$(this).attr("href");t+="?modal=1";var r=$(this).data("tab");r&&""!=r&&null!=r&&"undefined"!=r&&(t+="&targetsactive=true"),$("#indicator_modal_content").empty(),$("#modalmessages").empty(),$("#indicator_modal_content").load(t),$("#indicator_modal_div").modal("show")}),$("#indicator_modal_div").on("created.tola.indicator.save",function(e,t){m.a.emit("reload-indicator",t.indicatorId)}),$("#indicator_modal_div").on("updated.tola.indicator.save",function(e,t){var r=t.indicatorId;m.a.emit("reload-indicator",r),he.resultsMap.has(r)&&m.a.emit("load-indicator-results",r)}),$("#indicator_modal_div").on("deleted.tola.indicator.save",function(e,t){m.a.emit("indicator-deleted",t.indicatorId)}),$("#indicator_results_div").on("hidden.bs.modal",function(e){if(!0===$(this).find("form").data("recordchanged")){var t=$(this).find("form #id_indicator").val();m.a.emit("load-indicator-results",t),m.a.emit("reload-indicator",t)}});var ve=[{name:"all",path:"/",filterType:P.noFilter},{name:"targets",path:"/targets",filterType:P.missingTarget},{name:"results",path:"/results",filterType:P.missingResults},{name:"evidence",path:"/evidence",filterType:P.missingEvidence},{name:"scope",path:"/scope",forwardTo:"scope.on"},{name:"scope.on",path:"/on",filterType:P.onTarget},{name:"scope.above",path:"/above",filterType:P.aboveTarget},{name:"scope.below",path:"/below",filterType:P.belowTarget},{name:"indicator",path:"/indicator/:indicator_id<\\d+>",filterType:P.noFilter}],be=Object(h.b)(ve,{defaultRoute:"all",defaultParams:{},trailingSlashMode:"always"});be.usePlugin(Object(y.a)({useHash:!0,base:"/program/"+jsContext.program.id+"/"})),be.subscribe(function(e){var t=e.route.name,r=e.route.params;if("indicator"!==t){var n=ve.find(function(e){return e.name===t});m.a.emit("apply-gauge-tank-filter",n.filterType)}else m.a.emit("select-indicator-to-filter",parseInt(r.indicator_id))}),be.start(),m.a.on("nav-apply-gauge-tank-filter",function(t){var e=ve.find(function(e){return e.filterType===t});be.navigate(e.name)}),m.a.on("nav-clear-all-indicator-filters",function(){be.navigate("all")}),m.a.on("nav-select-indicator-to-filter",function(e){be.navigate("indicator",{indicator_id:e})}),$(function(){var e=0===window.performance.getEntriesByType("navigation")[0].transferSize,t="reload"===window.performance.getEntriesByType("navigation")[0].type;e&&!t&&window.location.reload()})},hzyr:function(e,t,r){"use strict";r.d(t,"a",function(){return l}),r.d(t,"b",function(){return c});var n=r("q1tI"),i=r.n(n),a=r("okNM");function o(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],0<=t.indexOf(r)||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],0<=t.indexOf(r)||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var l=Object(a.c)(function(e){var t=e.readonly,r=o(e,["readonly"]);return i.a.createElement("button",{type:"button",disabled:t,className:"btn btn-link btn-add",onClick:function(e){openCreateIndicatorFormModal(r)}},i.a.createElement("i",{className:"fas fa-plus-circle"})," ",gettext("Add indicator"))}),c=Object(a.c)(function(e){var t=e.readonly,r=e.label,n=void 0===r?null:r,a=o(e,["readonly","label"]);return i.a.createElement("button",{type:"button",disabled:t,className:"btn btn-link",onClick:function(e){openUpdateIndicatorFormModal(a)}},i.a.createElement("i",{className:"fas fa-cog"}),n)})},qtBC:function(e,t,r){"use strict";var n=r("7+Rn"),a=r.n(n)()();t.a=a}},[["aJgA",0,1]]]);