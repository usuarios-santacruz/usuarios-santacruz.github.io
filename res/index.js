(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{"23aj":function(e,t,n){"use strict";n.r(t);var r=n("ERkP"),a=n.n(r),o=n("ysqo"),u=n.n(o),i=n("7xIC"),c=n.n(i),l=n("0D0S"),f=n.n(l),s=a.a.createElement,d=function(e){var t=e.data,n=f()().publicRuntimeConfig.BANK_NAME_DISPLAY,r=f()().publicRuntimeConfig.BANK_URL_DISPLAY;return t&&s(a.a.Fragment,null,s(u.a,null,s("title",null,t.page.fields.title?t.page.fields.title:"".concat(n)),s("meta",{name:"description",content:t.page.fields.description?t.page.fields.description:"".concat(n," - ").concat(r)})))};d.getInitialProps=function(e){e.res;return c.a.push("/personas"),{}},t.default=d},DSo7:function(e,t){e.exports=function(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}},J9Yr:function(e,t,n){"use strict";var r=n("zQIG"),a=n("N7I1"),o=n("8mBC"),u=n("I/kN"),i=n("cMav"),c=n("pSQP"),l=n("iN+R");function f(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}Object.defineProperty(t,"__esModule",{value:!0});var s=n("ERkP"),d=!1;t.default=function(){var e,t=new Set;function n(n){e=n.props.reduceComponentsToState(l(t),n.props),n.props.handleStateChange&&n.props.handleStateChange(e)}return function(l){u(v,l);var s,p=(s=v,function(){var e,t=c(s);if(f()){var n=c(this).constructor;e=Reflect.construct(t,arguments,n)}else e=t.apply(this,arguments);return i(this,e)});function v(e){var o;return r(this,v),o=p.call(this,e),d&&(t.add(a(o)),n(a(o))),o}return o(v,null,[{key:"rewind",value:function(){var n=e;return e=void 0,t.clear(),n}}]),o(v,[{key:"componentDidMount",value:function(){t.add(this),n(this)}},{key:"componentDidUpdate",value:function(){n(this)}},{key:"componentWillUnmount",value:function(){t.delete(this),n(this)}},{key:"render",value:function(){return null}}]),v}(s.Component)}},TZT2:function(e,t,n){"use strict";var r=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t};Object.defineProperty(t,"__esModule",{value:!0});var a=r(n("ERkP"));t.AmpStateContext=a.createContext({})},bOkD:function(e,t){e.exports=function(e){if(Array.isArray(e)){for(var t=0,n=new Array(e.length);t<e.length;t++)n[t]=e[t];return n}}},dq4L:function(e,t,n){"use strict";var r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});var a=r(n("ERkP")),o=n("TZT2");function u(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.ampFirst,n=void 0!==t&&t,r=e.hybrid,a=void 0!==r&&r,o=e.hasQuery;return n||a&&(void 0!==o&&o)}t.isInAmpMode=u,t.useAmp=function(){return u(a.default.useContext(o.AmpStateContext))}},"iN+R":function(e,t,n){var r=n("bOkD"),a=n("DSo7"),o=n("uYlf");e.exports=function(e){return r(e)||a(e)||o()}},"op+c":function(e,t,n){"use strict";var r=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t};Object.defineProperty(t,"__esModule",{value:!0});var a=r(n("ERkP"));t.HeadManagerContext=a.createContext(null)},uYlf:function(e,t){e.exports=function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}},yaYD:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return n("23aj")}])},ysqo:function(e,t,n){"use strict";var r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});var a=r(n("ERkP")),o=r(n("J9Yr")),u=n("TZT2"),i=n("op+c"),c=n("dq4L");function l(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=[a.default.createElement("meta",{charSet:"utf-8"})];return e||t.push(a.default.createElement("meta",{name:"viewport",content:"width=device-width"})),t}function f(e,t){return"string"===typeof t||"number"===typeof t?e:t.type===a.default.Fragment?e.concat(a.default.Children.toArray(t.props.children).reduce((function(e,t){return"string"===typeof t||"number"===typeof t?e:e.concat(t)}),[])):e.concat(t)}t.defaultHead=l;var s=["name","httpEquiv","charSet","itemProp"];function d(e,t){return e.reduce((function(e,t){var n=a.default.Children.toArray(t.props.children);return e.concat(n)}),[]).reduce(f,[]).reverse().concat(l(t.inAmpMode)).filter(function(){var e=new Set,t=new Set,n=new Set,r={};return function(a){var o=!0;if(a.key&&"number"!==typeof a.key&&a.key.indexOf("$")>0){var u=a.key.slice(a.key.indexOf("$")+1);e.has(u)?o=!1:e.add(u)}switch(a.type){case"title":case"base":t.has(a.type)?o=!1:t.add(a.type);break;case"meta":for(var i=0,c=s.length;i<c;i++){var l=s[i];if(a.props.hasOwnProperty(l))if("charSet"===l)n.has(l)?o=!1:n.add(l);else{var f=a.props[l],d=r[l]||new Set;d.has(f)?o=!1:(d.add(f),r[l]=d)}}}return o}}()).reverse().map((function(e,t){var n=e.key||t;return a.default.cloneElement(e,{key:n})}))}var p=o.default();function v(e){var t=e.children;return a.default.createElement(u.AmpStateContext.Consumer,null,(function(e){return a.default.createElement(i.HeadManagerContext.Consumer,null,(function(n){return a.default.createElement(p,{reduceComponentsToState:d,handleStateChange:n,inAmpMode:c.isInAmpMode(e)},t)}))}))}v.rewind=p.rewind,t.default=v}},[["yaYD",1,3,2]]]);