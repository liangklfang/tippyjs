!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):t.Tippy=e()}(this,function(){"use strict";function t(t){var e=!1,n=0,r=document.createElement("span");return new MutationObserver(function(){t(),e=!1}).observe(r,{attributes:!0}),function(){e||(e=!0,r.setAttribute("x-index",n),n+=1)}}function e(t){var e=!1;return function(){e||(e=!0,setTimeout(function(){e=!1,t()},Dt))}}function n(t){return""!==t&&!isNaN(parseFloat(t))&&isFinite(t)}function r(t,e){Object.keys(e).forEach(function(r){var i="";-1!==["width","height","top","right","bottom","left"].indexOf(r)&&n(e[r])&&(i="px"),t.style[r]=e[r]+i})}function i(t){var e={};return t&&"[object Function]"===e.toString.call(t)}function o(t,e){if(1!==t.nodeType)return[];var n=window.getComputedStyle(t,null);return e?n[e]:n}function a(t){return"HTML"===t.nodeName?t:t.parentNode||t.host}function s(t){if(!t||-1!==["HTML","BODY","#document"].indexOf(t.nodeName))return window.document.body;var e=o(t),n=e.overflow,r=e.overflowX;return/(auto|scroll)/.test(n+e.overflowY+r)?t:s(a(t))}function u(t){var e=t.nodeName;return"BODY"!==e&&("HTML"===e||t.firstElementChild.offsetParent===t)}function p(t){return null!==t.parentNode?p(t.parentNode):t}function l(t){var e=t&&t.offsetParent,n=e&&e.nodeName;return n&&"BODY"!==n&&"HTML"!==n?e:window.document.documentElement}function c(t,e){if(!(t&&t.nodeType&&e&&e.nodeType))return window.document.documentElement;var n=t.compareDocumentPosition(e)&Node.DOCUMENT_POSITION_FOLLOWING,r=n?t:e,i=n?e:t,o=document.createRange();o.setStart(r,0),o.setEnd(i,0);var a=o.commonAncestorContainer;if(t!==a&&e!==a||r.contains(i))return u(a)?a:l(a);var s=p(t);return s.host?c(s.host,e):c(t,p(e).host)}function f(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"top",n="top"===e?"scrollTop":"scrollLeft",r=t.nodeName;if("BODY"===r||"HTML"===r){var i=window.document.documentElement;return(window.document.scrollingElement||i)[n]}return t[n]}function d(t,e){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],r=f(e,"top"),i=f(e,"left"),o=n?-1:1;return t.top+=r*o,t.bottom+=r*o,t.left+=i*o,t.right+=i*o,t}function h(t,e){var n="x"===e?"Left":"Top",r="Left"===n?"Right":"Bottom";return+t["border"+n+"Width"].split("px")[0]+ +t["border"+r+"Width"].split("px")[0]}function m(t,e,n,r){return Math.max(e["offset"+t],n["client"+t],n["offset"+t],Pt()?n["offset"+t]+r["margin"+("Height"===t?"Top":"Left")]+r["margin"+("Height"===t?"Bottom":"Right")]:0)}function v(){var t=window.document.body,e=window.document.documentElement,n=Pt()&&window.getComputedStyle(e);return{height:m("Height",t,e,n),width:m("Width",t,e,n)}}function g(t){return Rt({},t,{right:t.left+t.width,bottom:t.top+t.height})}function b(t){var e={};if(Pt())try{e=t.getBoundingClientRect();var n=f(t,"top"),r=f(t,"left");e.top+=n,e.left+=r,e.bottom+=n,e.right+=r}catch(t){}else e=t.getBoundingClientRect();var i={left:e.left,top:e.top,width:e.right-e.left,height:e.bottom-e.top},a="HTML"===t.nodeName?v():{},s=a.width||t.clientWidth||i.right-i.left,u=a.height||t.clientHeight||i.bottom-i.top,p=t.offsetWidth-s,l=t.offsetHeight-u;if(p||l){var c=o(t);p-=h(c,"x"),l-=h(c,"y"),i.width-=p,i.height-=l}return g(i)}function w(t,e){var n=Pt(),r="HTML"===e.nodeName,i=b(t),a=b(e),u=s(t),p=g({top:i.top-a.top,left:i.left-a.left,width:i.width,height:i.height});if(r||"BODY"===e.nodeName){var l=o(e),c=n&&r?0:+l.borderTopWidth.split("px")[0],f=n&&r?0:+l.borderLeftWidth.split("px")[0],h=n&&r?0:+l.marginTop.split("px")[0],m=n&&r?0:+l.marginLeft.split("px")[0];p.top-=c-h,p.bottom-=c-h,p.left-=f-m,p.right-=f-m,p.marginTop=h,p.marginLeft=m}return(n?e.contains(u):e===u&&"BODY"!==u.nodeName)&&(p=d(p,e)),p}function y(t){var e=window.document.documentElement,n=w(t,e),r=Math.max(e.clientWidth,window.innerWidth||0),i=Math.max(e.clientHeight,window.innerHeight||0),o=f(e),a=f(e,"left");return g({top:o-n.top+n.marginTop,left:a-n.left+n.marginLeft,width:r,height:i})}function E(t){var e=t.nodeName;return"BODY"!==e&&"HTML"!==e&&("fixed"===o(t,"position")||E(a(t)))}function x(t,e,n,r){var i={top:0,left:0},o=c(t,e);if("viewport"===r)i=y(o);else{var u=void 0;"scrollParent"===r?(u=s(a(t)),"BODY"===u.nodeName&&(u=window.document.documentElement)):u="window"===r?window.document.documentElement:r;var p=w(u,o);if("HTML"!==u.nodeName||E(o))i=p;else{var l=v(),f=l.height,d=l.width;i.top+=p.top-p.marginTop,i.bottom=f+p.top,i.left+=p.left-p.marginLeft,i.right=d+p.left}}return i.left+=n,i.top+=n,i.right-=n,i.bottom-=n,i}function O(t){return t.width*t.height}function T(t,e,n,r,i){var o=arguments.length>5&&void 0!==arguments[5]?arguments[5]:0;if(-1===t.indexOf("auto"))return t;var a=x(n,r,o,i),s={top:{width:a.width,height:e.top-a.top},right:{width:a.right-e.right,height:a.height},bottom:{width:a.width,height:a.bottom-e.bottom},left:{width:e.left-a.left,height:a.height}},u=Object.keys(s).map(function(t){return Rt({key:t},s[t],{area:O(s[t])})}).sort(function(t,e){return e.area-t.area}),p=u.filter(function(t){var e=t.width,r=t.height;return e>=n.clientWidth&&r>=n.clientHeight}),l=p.length>0?p[0].key:u[0].key,c=t.split("-")[1];return l+(c?"-"+c:"")}function L(t,e,n){return w(n,c(e,n))}function k(t){var e=window.getComputedStyle(t),n=parseFloat(e.marginTop)+parseFloat(e.marginBottom),r=parseFloat(e.marginLeft)+parseFloat(e.marginRight);return{width:t.offsetWidth+r,height:t.offsetHeight+n}}function A(t){var e={left:"right",right:"left",bottom:"top",top:"bottom"};return t.replace(/left|right|bottom|top/g,function(t){return e[t]})}function C(t,e,n){n=n.split("-")[0];var r=k(t),i={width:r.width,height:r.height},o=-1!==["right","left"].indexOf(n),a=o?"top":"left",s=o?"left":"top",u=o?"height":"width",p=o?"width":"height";return i[a]=e[a]+e[u]/2-r[u]/2,i[s]=n===s?e[s]-r[p]:e[A(s)],i}function M(t,e){return Array.prototype.find?t.find(e):t.filter(e)[0]}function S(t,e,n){if(Array.prototype.findIndex)return t.findIndex(function(t){return t[e]===n});var r=M(t,function(t){return t[e]===n});return t.indexOf(r)}function H(t,e,n){return(void 0===n?t:t.slice(0,S(t,"name",n))).forEach(function(t){t.function&&console.warn("`modifier.function` is deprecated, use `modifier.fn`!");var n=t.function||t.fn;t.enabled&&i(n)&&(e=n(e,t))}),e}function D(){if(!this.state.isDestroyed){var t={instance:this,styles:{},attributes:{},flipped:!1,offsets:{}};t.offsets.reference=L(this.state,this.popper,this.reference),t.placement=T(this.options.placement,t.offsets.reference,this.popper,this.reference,this.options.modifiers.flip.boundariesElement,this.options.modifiers.flip.padding),t.originalPlacement=t.placement,t.offsets.popper=C(this.popper,t.offsets.reference,t.placement),t.offsets.popper.position="absolute",t=H(this.modifiers,t),this.state.isCreated?this.options.onUpdate(t):(this.state.isCreated=!0,this.options.onCreate(t))}}function N(t,e){return t.some(function(t){var n=t.name;return t.enabled&&n===e})}function B(t){for(var e=[!1,"ms","webkit","moz","o"],n=t.charAt(0).toUpperCase()+t.slice(1),r=0;r<e.length-1;r++){var i=e[r],o=i?""+i+n:t;if(void 0!==window.document.body.style[o])return o}return null}function I(){return this.state.isDestroyed=!0,N(this.modifiers,"applyStyle")&&(this.popper.removeAttribute("x-placement"),this.popper.style.left="",this.popper.style.position="",this.popper.style.top="",this.popper.style[B("transform")]=""),this.disableEventListeners(),this.options.removeOnDestroy&&this.popper.parentNode.removeChild(this.popper),this}function F(t,e,n,r){var i="BODY"===t.nodeName,o=i?window:t;o.addEventListener(e,n,{passive:!0}),i||F(s(o.parentNode),e,n,r),r.push(o)}function P(t,e,n,r){n.updateBound=r,window.addEventListener("resize",n.updateBound,{passive:!0});var i=s(t);return F(i,"scroll",n.updateBound,n.scrollParents),n.scrollElement=i,n.eventsEnabled=!0,n}function W(){this.state.eventsEnabled||(this.state=P(this.reference,this.options,this.state,this.scheduleUpdate))}function q(t,e){return window.removeEventListener("resize",e.updateBound),e.scrollParents.forEach(function(t){t.removeEventListener("scroll",e.updateBound)}),e.updateBound=null,e.scrollParents=[],e.scrollElement=null,e.eventsEnabled=!1,e}function j(){this.state.eventsEnabled&&(window.cancelAnimationFrame(this.scheduleUpdate),this.state=q(this.reference,this.state))}function R(t,e){Object.keys(e).forEach(function(n){!1!==e[n]?t.setAttribute(n,e[n]):t.removeAttribute(n)})}function U(t,e){var n={position:t.offsets.popper.position},i={"x-placement":t.placement},o=Math.round(t.offsets.popper.left),a=Math.round(t.offsets.popper.top),s=B("transform");return e.gpuAcceleration&&s?(n[s]="translate3d("+o+"px, "+a+"px, 0)",n.top=0,n.left=0,n.willChange="transform"):(n.left=o,n.top=a,n.willChange="top, left"),r(t.instance.popper,Rt({},n,t.styles)),R(t.instance.popper,Rt({},i,t.attributes)),t.offsets.arrow&&r(t.arrowElement,t.offsets.arrow),t}function Y(t,e,n,r,i){var o=L(i,e,t),a=T(n.placement,o,e,t,n.modifiers.flip.boundariesElement,n.modifiers.flip.padding);return e.setAttribute("x-placement",a),n}function z(t,e,n){var r=M(t,function(t){return t.name===e}),i=!!r&&t.some(function(t){return t.name===n&&t.enabled&&t.order<r.order});if(!i){var o="`"+e+"`",a="`"+n+"`";console.warn(a+" modifier is required by "+o+" modifier in order to work, be sure to include it before "+o+"!")}return i}function K(t,e){if(!z(t.instance.modifiers,"arrow","keepTogether"))return t;var n=e.element;if("string"==typeof n){if(!(n=t.instance.popper.querySelector(n)))return t}else if(!t.instance.popper.contains(n))return console.warn("WARNING: `arrow.element` must be child of its popper element!"),t;var r=t.placement.split("-")[0],i=g(t.offsets.popper),o=t.offsets.reference,a=-1!==["left","right"].indexOf(r),s=a?"height":"width",u=a?"top":"left",p=a?"left":"top",l=a?"bottom":"right",c=k(n)[s];o[l]-c<i[u]&&(t.offsets.popper[u]-=i[u]-(o[l]-c)),o[u]+c>i[l]&&(t.offsets.popper[u]+=o[u]+c-i[l]);var f=o[u]+o[s]/2-c/2,d=f-g(t.offsets.popper)[u];return d=Math.max(Math.min(i[s]-c,d),0),t.arrowElement=n,t.offsets.arrow={},t.offsets.arrow[u]=Math.round(d),t.offsets.arrow[p]="",t}function X(t){return"end"===t?"start":"start"===t?"end":t}function G(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=Yt.indexOf(t),r=Yt.slice(n+1).concat(Yt.slice(0,n));return e?r.reverse():r}function V(t,e){if(N(t.instance.modifiers,"inner"))return t;if(t.flipped&&t.placement===t.originalPlacement)return t;var n=x(t.instance.popper,t.instance.reference,e.padding,e.boundariesElement),r=t.placement.split("-")[0],i=A(r),o=t.placement.split("-")[1]||"",a=[];switch(e.behavior){case zt.FLIP:a=[r,i];break;case zt.CLOCKWISE:a=G(r);break;case zt.COUNTERCLOCKWISE:a=G(r,!0);break;default:a=e.behavior}return a.forEach(function(s,u){if(r!==s||a.length===u+1)return t;r=t.placement.split("-")[0],i=A(r);var p=g(t.offsets.popper),l=t.offsets.reference,c=Math.floor,f="left"===r&&c(p.right)>c(l.left)||"right"===r&&c(p.left)<c(l.right)||"top"===r&&c(p.bottom)>c(l.top)||"bottom"===r&&c(p.top)<c(l.bottom),d=c(p.left)<c(n.left),h=c(p.right)>c(n.right),m=c(p.top)<c(n.top),v=c(p.bottom)>c(n.bottom),b="left"===r&&d||"right"===r&&h||"top"===r&&m||"bottom"===r&&v,w=-1!==["top","bottom"].indexOf(r),y=!!e.flipVariations&&(w&&"start"===o&&d||w&&"end"===o&&h||!w&&"start"===o&&m||!w&&"end"===o&&v);(f||b||y)&&(t.flipped=!0,(f||b)&&(r=a[u+1]),y&&(o=X(o)),t.placement=r+(o?"-"+o:""),t.offsets.popper=Rt({},t.offsets.popper,C(t.instance.popper,t.offsets.reference,t.placement)),t=H(t.instance.modifiers,t,"flip"))}),t}function _(t){var e=g(t.offsets.popper),n=t.offsets.reference,r=t.placement.split("-")[0],i=Math.floor,o=-1!==["top","bottom"].indexOf(r),a=o?"right":"bottom",s=o?"left":"top",u=o?"width":"height";return e[a]<i(n[s])&&(t.offsets.popper[s]=i(n[s])-e[u]),e[s]>i(n[a])&&(t.offsets.popper[s]=i(n[a])),t}function J(t,e,n,r){var i=t.match(/((?:\-|\+)?\d*\.?\d*)(.*)/),o=+i[1],a=i[2];if(!o)return t;if(0===a.indexOf("%")){var s=void 0;switch(a){case"%p":s=n;break;case"%":case"%r":default:s=r}return g(s)[e]/100*o}if("vh"===a||"vw"===a){return("vh"===a?Math.max(document.documentElement.clientHeight,window.innerHeight||0):Math.max(document.documentElement.clientWidth,window.innerWidth||0))/100*o}return o}function Q(t,e,r,i){var o=[0,0],a=-1!==["right","left"].indexOf(i),s=t.split(/(\+|\-)/).map(function(t){return t.trim()}),u=s.indexOf(M(s,function(t){return-1!==t.search(/,|\s/)}));s[u]&&-1===s[u].indexOf(",")&&console.warn("Offsets separated by white space(s) are deprecated, use a comma (,) instead.");var p=-1!==u?[s.slice(0,u).concat([s[u].split(/\s*,\s*|\s+/)[0]]),[s[u].split(/\s*,\s*|\s+/)[1]].concat(s.slice(u+1))]:[s];return p=p.map(function(t,n){var i=(1===n?!a:a)?"height":"width",o=!1;return t.reduce(function(t,e){return""===t[t.length-1]&&-1!==["+","-"].indexOf(e)?(t[t.length-1]=e,o=!0,t):o?(t[t.length-1]+=e,o=!1,t):t.concat(e)},[]).map(function(t){return J(t,i,e,r)})}),p.forEach(function(t,e){t.forEach(function(r,i){n(r)&&(o[e]+=r*("-"===t[i-1]?-1:1))})}),o}function Z(t,e){var r=e.offset,i=t.placement,o=t.offsets,a=o.popper,s=o.reference,u=i.split("-")[0],p=void 0;return p=n(+r)?[+r,0]:Q(r,a,s,u),"left"===u?(a.top+=p[0],a.left-=p[1]):"right"===u?(a.top+=p[0],a.left+=p[1]):"top"===u?(a.left+=p[0],a.top-=p[1]):"bottom"===u&&(a.left+=p[0],a.top+=p[1]),t.popper=a,t}function $(t,e){var n=e.boundariesElement||l(t.instance.popper),r=x(t.instance.popper,t.instance.reference,e.padding,n);e.boundaries=r;var i=e.priority,o=g(t.offsets.popper),a={primary:function(t){var n=o[t];return o[t]<r[t]&&!e.escapeWithReference&&(n=Math.max(o[t],r[t])),jt({},t,n)},secondary:function(t){var n="right"===t?"left":"top",i=o[n];return o[t]>r[t]&&!e.escapeWithReference&&(i=Math.min(o[n],r[t]-("right"===t?o.width:o.height))),jt({},n,i)}};return i.forEach(function(t){var e=-1!==["left","top"].indexOf(t)?"primary":"secondary";o=Rt({},o,a[e](t))}),t.offsets.popper=o,t}function tt(t){var e=t.placement,n=e.split("-")[0],r=e.split("-")[1];if(r){var i=t.offsets.reference,o=g(t.offsets.popper),a=-1!==["bottom","top"].indexOf(n),s=a?"left":"top",u=a?"width":"height",p={start:jt({},s,i[s]),end:jt({},s,i[s]+i[u]-o[u])};t.offsets.popper=Rt({},o,p[r])}return t}function et(t){if(!z(t.instance.modifiers,"hide","preventOverflow"))return t;var e=t.offsets.reference,n=M(t.instance.modifiers,function(t){return"preventOverflow"===t.name}).boundaries;if(e.bottom<n.top||e.left>n.right||e.top>n.bottom||e.right<n.left){if(!0===t.hide)return t;t.hide=!0,t.attributes["x-out-of-boundaries"]=""}else{if(!1===t.hide)return t;t.hide=!1,t.attributes["x-out-of-boundaries"]=!1}return t}function nt(t){var e=t.placement,n=e.split("-")[0],r=g(t.offsets.popper),i=g(t.offsets.reference),o=-1!==["left","right"].indexOf(n),a=-1===["top","left"].indexOf(n);return r[o?"left":"top"]=i[e]-(a?r[o?"width":"height"]:0),t.placement=A(e),t.offsets.popper=g(r),t}function rt(){rt.done||(rt.done=!0,document.addEventListener("click",function(t){if(!(t.target instanceof Element))return xt();var e=at(t.target,ee.el),n=at(t.target,ee.popper);if(n){if(st(te,function(t){return t.popper===n}).settings.interactive)return}if(e){var r=st(te,function(t){return t.el===e}),i=r.popper,o=r.settings,a=o.hideOnClick,s=o.multiple,u=o.trigger;if(!0!==a||Zt.touch||clearTimeout(i.getAttribute("data-delay")),!s&&Zt.touch||!s&&-1!==u.indexOf("click"))return xt(r);if(!0!==a||-1!==u.indexOf("click"))return}!at(t.target,ee.controller)&&document.querySelector(ee.popper)&&xt()}),Zt.supportsTouch?document.addEventListener("touchstart",function t(){Zt.touch=!0,Zt.iOS&&document.body.classList.add("tippy-touch"),document.removeEventListener("touchstart",t)}):(navigator.maxTouchPoints>0||navigator.msMaxTouchPoints>0)&&(Zt.touch=!0),ne.appendTo=document.body)}function it(t){for(var e=[!1,"webkit"],n=t.charAt(0).toUpperCase()+t.slice(1),r=0;r<e.length;r++){var i=e[r],o=i?""+i+n:t;if(void 0!==window.document.body.style[o])return o}return null}function ot(t){return t.replace(/-.+/,"")}function at(t,e){return Element.prototype.matches||(Element.prototype.matches=Element.prototype.matchesSelector||Element.prototype.webkitMatchesSelector||Element.prototype.mozMatchesSelector||Element.prototype.msMatchesSelector||function(t){for(var e=(this.document||this.ownerDocument).querySelectorAll(t),n=e.length;--n>=0&&e.item(n)!==this;);return n>-1}),Element.prototype.closest||(Element.prototype.closest=function(t){for(var e=this;e;){if(e.matches(t))return e;e=e.parentElement}}),t.closest(e)}function st(t,e){return Array.prototype.find?t.find(e):t.filter(e)[0]}function ut(t){var e={view:window,bubbles:!0,cancelable:!0},n=window.MouseEvent?new MouseEvent("click",e):new Event("click",e);t.dispatchEvent(n)}function pt(t){var e=t.el,n=t.popper,r=t.settings,i=r.position,o=r.popperOptions,a=r.offset,s=r.distance,u=n.querySelector(ee.tooltip),p=Jt({placement:i},o||{},{modifiers:Jt({},o?o.modifiers:{},{flip:Jt({padding:s+5},o&&o.modifiers?o.modifiers.flip:{}),offset:Jt({offset:a},o&&o.modifiers?o.modifiers.offset:{})}),onUpdate:function(){u.style.top="",u.style.bottom="",u.style.left="",u.style.right="",u.style[ot(n.getAttribute("x-placement"))]=-(s-ne.distance)+"px"}});return new Gt(e,n,p)}function lt(t,e,n){var r=n.position,i=n.distance,o=n.arrow,a=n.animateFill,s=n.inertia,u=n.animation,p=n.arrowSize,l=n.size,c=n.theme,f=n.html,d=n.zIndex,h=document.createElement("div");h.setAttribute("class","tippy-popper"),h.setAttribute("role","tooltip"),h.setAttribute("aria-hidden","true"),h.setAttribute("id","tippy-tooltip-"+t),h.style.zIndex=d;var m=document.createElement("div");if(m.setAttribute("class","tippy-tooltip tippy-tooltip--"+l+" "+c+"-theme leave"),m.setAttribute("data-animation",u),o){var v=document.createElement("div");v.setAttribute("class","arrow-"+p),v.setAttribute("x-arrow",""),m.appendChild(v)}if(a){m.setAttribute("data-animatefill","");var g=document.createElement("div");g.setAttribute("class","leave"),g.setAttribute("x-circle",""),m.appendChild(g)}s&&m.setAttribute("data-inertia","");var b=document.createElement("div");if(b.setAttribute("class","tippy-tooltip-content"),f){var w=void 0;f instanceof Element?(b.appendChild(f),w=f.id||"tippy-html-template"):(b.innerHTML=document.getElementById(f.replace("#","")).innerHTML,w=f),h.classList.add("html-template"),h.setAttribute("tabindex","0"),m.setAttribute("data-template-id",w)}else b.innerHTML=e;return m.style[ot(r)]=-(i-ne.distance)+"px",m.appendChild(b),h.appendChild(m),h}function ct(t,e,n,r){var i=[];return"manual"===t?i:(e.addEventListener(t,n.handleTrigger),i.push({event:t,handler:n.handleTrigger}),"mouseenter"===t&&(Zt.supportsTouch&&r&&(e.addEventListener("touchstart",n.handleTrigger),i.push({event:"touchstart",handler:n.handleTrigger}),e.addEventListener("touchend",n.handleMouseleave),i.push({event:"touchend",handler:n.handleMouseleave})),e.addEventListener("mouseleave",n.handleMouseleave),i.push({event:"mouseleave",handler:n.handleMouseleave})),"focus"===t&&(e.addEventListener("blur",n.handleBlur),i.push({event:"blur",handler:n.handleBlur})),i)}function ft(t){var e=t.getAttribute("title");t.setAttribute("data-original-title",e||"html"),t.removeAttribute("title")}function dt(t){var e=t.getBoundingClientRect();return e.top>=0&&e.left>=0&&e.bottom<=(window.innerHeight||document.documentElement.clientHeight)&&e.right<=(window.innerWidth||document.documentElement.clientWidth)}function ht(t){var e=this,n=st(te,function(t){return t.el===e}),r=n.popper,i=ot(r.getAttribute("x-placement")),o=Math.round(r.offsetWidth/2),a=Math.round(r.offsetHeight/2),s=document.documentElement.offsetWidth||document.body.offsetWidth,u=t.pageX,p=t.pageY,l=void 0,c=void 0;switch(i){case"top":l=u-o,c=p-2.5*a;break;case"left":l=u-2*o-15,c=p-a;break;case"right":l=u+a,c=p-a;break;case"bottom":l=u-o,c=p+a/1.5}var f=u+5+o>s,d=u-5-o<0;"top"!==i&&"bottom"!==i||(f&&(l=s-5-2*o),d&&(l=5)),r.style[it("transform")]="translate3d("+l+"px, "+c+"px, 0)"}function mt(t,e){e?window.getComputedStyle(e)[it("transform")]:window.getComputedStyle(t).opacity}function vt(t,e){t.forEach(function(t){t&&e(t.classList)})}function gt(t,e){var n=e;t.forEach(function(t){t&&(n=e,t.hasAttribute("x-circle")&&(n=Math.round(n/1.2)),t.style[it("transitionDuration")]=n+"ms")})}function bt(t,e,n){var r=t.popper.querySelector(ee.tooltip),i=!1,o=function t(e){e.target===r&&(i=!0,r.removeEventListener("webkitTransitionEnd",t),r.removeEventListener("transitionend",t),n())};r.addEventListener("webkitTransitionEnd",o),r.addEventListener("transitionend",o),clearTimeout(t.transitionendTimeout),t.transitionendTimeout=setTimeout(function(){!i&&n()},e)}function wt(t){return"visible"===t.style.visibility}function yt(t){var e=t.el,n=(t.popper,t.listeners,t.settings),r=n.appendTo,i=n.followCursor;r.appendChild(t.popper),t.popperInstance?(t.popperInstance.update(),!i&&t.popperInstance.enableEventListeners()):(t.popperInstance=pt(t),i&&!Zt.touch&&(e.addEventListener("mousemove",ht),t.popperInstance.disableEventListeners()))}function Et(t){var e=t.popper,n=t.popperInstance,r=t.settings.stickyDuration,i=function(){return e.style[it("transitionDuration")]=r+"ms"},o=function(){return e.style[it("transitionDuration")]=""};ie(function t(){n&&n.scheduleUpdate(),i(),wt(e)?window.requestAnimationFrame(t):o()})}function xt(t){te.forEach(function(e){var n=e.popper,r=e.tippyInstance,i=e.settings,o=i.appendTo,a=i.hideOnClick,s=i.hideDuration,u=i.trigger;if(o.contains(n)){var p=!0===a||-1!==u.indexOf("focus"),l=!t||n!==t.popper;p&&l&&r.hide(n,s)}})}function Ot(t){return t instanceof Element?[t]:[].slice.call(document.querySelectorAll(t))}function Tt(t,e,n){if(!e.getAttribute("x-placement"))return!1;var r=t.clientX,i=t.clientY,o=n.interactiveBorder,a=n.distance,s=e.getBoundingClientRect(),u=ot(e.getAttribute("x-placement")),p=o+a,l={top:s.top-i>o,bottom:i-s.bottom>o,left:s.left-r>o,right:r-s.right>o};switch(u){case"top":l.top=s.top-i>p;break;case"bottom":l.bottom=i-s.bottom>p;break;case"left":l.left=s.left-r>p;break;case"right":l.right=r-s.right>p}return l.top||l.bottom||l.left||l.right}function Lt(t,e){var n=re.reduce(function(n,r){var i=t.getAttribute("data-"+r.toLowerCase())||e[r];return"false"===i&&(i=!1),"true"===i&&(i=!0),isNaN(parseFloat(i))||(i=parseFloat(i)),n[r]=i,n},{});return n.arrow&&(n.animateFill=!1),Jt({},e,n)}function kt(t,e,n){var r=this,i=(n.position,n.delay),o=n.hideDelay,a=n.hideDuration,s=n.duration,u=n.interactive,p=(n.interactiveBorder,n.distance,n.hideOnClick),l=n.trigger,c=n.touchHold,f=function(){clearTimeout(e.getAttribute("data-delay")),clearTimeout(e.getAttribute("data-hidedelay"))},d=function(){if(f(),!wt(e))if(i){var t=setTimeout(function(){return r.show(e,s)},i);e.setAttribute("data-delay",t)}else r.show(e,s)},h=function(t){return r.callbacks.wait?r.callbacks.wait.call(e,d,t):d()},m=function(){if(f(),o){var t=setTimeout(function(){return r.hide(e,a)},o);e.setAttribute("data-hidedelay",t)}else r.hide(e,a)};return{handleTrigger:function(n){if("mouseenter"===n.type&&Zt.supportsTouch&&Zt.touch){if(c)return;if(Zt.iOS){var r=function(){return ut(t)};"A"===t.nodeName?setTimeout(r,300):r()}}var i="click"===n.type,o="persistent"!==p;i&&wt(e)&&o?m():h(n)},handleMouseleave:function(r){if(!("mouseleave"===r.type&&Zt.supportsTouch&&Zt.touch&&c)){if(u){var i=function r(i){var o=function(){document.removeEventListener("mousemove",r),m()},a=at(i.target,ee.el),s=at(i.target,ee.popper)===e,u=a===t,p=-1!==l.indexOf("click");if(a&&a!==t)return o();s||u||p||Tt(i,e,n)&&o()};return document.addEventListener("mousemove",i)}m()}},handleBlur:function(t){!Zt.touch&&t.relatedTarget&&(at(t.relatedTarget,ee.popper)||m())}}}function At(t){var e=this;t.forEach(function(t){var n=Lt(t,e.settings),r=n.html,i=n.trigger,o=n.touchHold,a=t.getAttribute("title");if(a||r){var s=$t;t.setAttribute("data-tooltipped",""),t.setAttribute("aria-describedby","tippy-tooltip-"+s),ft(t);var u=lt(s,a,n),p=kt.call(e,t,u,n),l=[];i.trim().split(" ").forEach(function(e){return l=l.concat(ct(e,t,p,o))}),te.push({id:s,el:t,popper:u,settings:n,listeners:l,tippyInstance:e}),$t++}})}function Ct(t,e){return new oe(t,e)}for(var Mt=["native code","[object MutationObserverConstructor]"],St="undefined"!=typeof window,Ht=["Edge","Trident","Firefox"],Dt=0,Nt=0;Nt<Ht.length;Nt+=1)if(St&&navigator.userAgent.indexOf(Ht[Nt])>=0){Dt=1;break}var Bt=St&&function(t){return Mt.some(function(e){return(t||"").toString().indexOf(e)>-1})}(window.MutationObserver),It=Bt?t:e,Ft=void 0,Pt=function(){return void 0===Ft&&(Ft=-1!==navigator.appVersion.indexOf("MSIE 10")),Ft},Wt=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")},qt=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),jt=function(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t},Rt=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t},Ut=["auto-start","auto","auto-end","top-start","top","top-end","right-start","right","right-end","bottom-end","bottom","bottom-start","left-end","left","left-start"],Yt=Ut.slice(3),zt={FLIP:"flip",CLOCKWISE:"clockwise",COUNTERCLOCKWISE:"counterclockwise"},Kt={shift:{order:100,enabled:!0,fn:tt},offset:{order:200,enabled:!0,fn:Z,offset:0},preventOverflow:{order:300,enabled:!0,fn:$,priority:["left","right","top","bottom"],padding:5,boundariesElement:"scrollParent"},keepTogether:{order:400,enabled:!0,fn:_},arrow:{order:500,enabled:!0,fn:K,element:"[x-arrow]"},flip:{order:600,enabled:!0,fn:V,behavior:"flip",padding:5,boundariesElement:"viewport"},inner:{order:700,enabled:!1,fn:nt},hide:{order:800,enabled:!0,fn:et},applyStyle:{order:900,enabled:!0,fn:U,onLoad:Y,gpuAcceleration:!0}},Xt={placement:"bottom",eventsEnabled:!0,removeOnDestroy:!1,onCreate:function(){},onUpdate:function(){},modifiers:Kt},Gt=function(){function t(e,n){var o=this,a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};Wt(this,t),this.scheduleUpdate=function(){return requestAnimationFrame(o.update)},this.update=It(this.update.bind(this)),this.options=Rt({},t.Defaults,a),this.state={isDestroyed:!1,isCreated:!1,scrollParents:[]},this.reference=e.jquery?e[0]:e,this.popper=n.jquery?n[0]:n,r(this.popper,{position:"absolute"}),this.options.modifiers={},Object.keys(Rt({},t.Defaults.modifiers,a.modifiers)).forEach(function(e){o.options.modifiers[e]=Rt({},t.Defaults.modifiers[e]||{},a.modifiers?a.modifiers[e]:{})}),this.modifiers=Object.keys(this.options.modifiers).map(function(t){return Rt({name:t},o.options.modifiers[t])}).sort(function(t,e){return t.order-e.order}),this.modifiers.forEach(function(t){t.enabled&&i(t.onLoad)&&t.onLoad(o.reference,o.popper,o.options,t,o.state)}),this.update();var s=this.options.eventsEnabled;s&&this.enableEventListeners(),this.state.eventsEnabled=s}return qt(t,[{key:"update",value:function(){return D.call(this)}},{key:"destroy",value:function(){return I.call(this)}},{key:"enableEventListeners",value:function(){return W.call(this)}},{key:"disableEventListeners",value:function(){return j.call(this)}}]),t}();Gt.Utils=("undefined"!=typeof window?window:global).PopperUtils,Gt.placements=Ut,Gt.Defaults=Xt;var Vt=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")},_t=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),Jt=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t},Qt="undefined"!=typeof window,Zt={};Qt&&(Zt.supported=!!window.requestAnimationFrame,Zt.supportsTouch="ontouchstart"in window,Zt.iOS=/iPhone|iPad|iPod/.test(navigator.userAgent)&&!window.MSStream,Zt.touch=!1);var $t=1,te=[],ee={popper:".tippy-popper",tooltip:".tippy-tooltip",content:".tippy-tooltip-content",circle:"[x-circle]",arrow:"[x-arrow]",el:"[data-tooltipped]",controller:"[data-tippy-controller]"},ne={html:!1,position:"top",animation:"shift",animateFill:!0,arrow:!1,arrowSize:"regular",delay:0,hideDelay:0,trigger:"mouseenter focus",duration:375,hideDuration:375,interactive:!1,interactiveBorder:2,theme:"dark",size:"regular",distance:10,offset:0,hideOnClick:!0,multiple:!1,followCursor:!1,inertia:!1,flipDuration:300,sticky:!1,stickyDuration:200,appendTo:null,zIndex:9999,touchHold:!1,popperOptions:{}},re=Zt.supported&&Object.keys(ne),ie=function(){var t=void 0;return function(e){clearTimeout(t),window.requestAnimationFrame(function(){t=setTimeout(e,0)})}}(),oe=function(){function t(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};Vt(this,t),Zt.supported&&(rt(),this.selector=e,this.settings=Jt({},ne,n),this.callbacks={wait:n.wait,beforeShown:n.beforeShown||new Function,shown:n.shown||new Function,beforeHidden:n.beforeHidden||new Function,hidden:n.hidden||new Function},At.call(this,Ot(e)))}return _t(t,[{key:"getPopperElement",value:function(t){try{return st(te,function(e){return e.el===t}).popper}catch(t){console.error("[Tippy error]: Element does not exist in any Tippy instances")}}},{key:"getTooltippedElement",value:function(t){try{return st(te,function(e){return e.popper===t}).el}catch(t){console.error("[Tippy error]: Popper does not exist in any Tippy instances")}}},{key:"getReference",value:function(t){return st(te,function(e){return e.el===t})||st(te,function(e){return e.popper===t})}},{key:"show",value:function(t){var e=this,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.settings.duration;this.callbacks.beforeShown.call(t);var r=st(te,function(e){return e.popper===t}),i=t.querySelector(ee.tooltip),o=t.querySelector(ee.circle),a=r.el,s=r.settings,u=s.appendTo,p=s.sticky,l=s.interactive,c=s.followCursor,f=s.flipDuration;gt([t,i,o],0),!u.contains(t)&&yt(r),t.style.visibility="visible",t.setAttribute("aria-hidden","false"),ie(function(){wt(t)&&(!c&&r.popperInstance.update(),gt([i,o],n),!c&&gt([t],f),l&&a.classList.add("active"),p&&Et(r),mt(i,o),vt([i,o],function(t){t.contains("tippy-notransition")&&t.remove("tippy-notransition"),t.remove("leave"),t.add("enter")}),bt(r,n,function(){wt(t)&&!r.onShownFired&&(l&&t.focus(),i.classList.add("tippy-notransition"),r.onShownFired=!0,e.callbacks.shown.call(t))}))})}},{key:"hide",value:function(t){var e=this,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.settings.duration;this.callbacks.beforeHidden.call(t);var r=st(te,function(e){return e.popper===t}),i=t.querySelector(ee.tooltip),o=t.querySelector(ee.circle),a=(t.querySelector(ee.content),r.el),s=r.settings,u=s.appendTo,p=(s.sticky,s.interactive),l=(s.followCursor,s.html),c=s.trigger;r.onShownFired=!1,p&&a.classList.remove("active"),t.style.visibility="hidden",t.setAttribute("aria-hidden","true"),n===ne.hideDuration?n=parseInt(i.style[it("transitionDuration")]):gt([i,o],n),vt([i,o],function(t){t.contains("tippy-tooltip")&&t.remove("tippy-notransition"),t.remove("enter"),t.add("leave")}),l&&-1!==c.indexOf("click")&&dt(a)&&a.focus(),bt(r,n,function(){!wt(t)&&u.contains(t)&&(r.popperInstance.disableEventListeners(),u.removeChild(t),e.callbacks.hidden.call(t))})}},{key:"destroy",value:function(t){var e=st(te,function(e){return e.popper===t}),n=e.el,r=e.popperInstance,i=e.listeners;wt(t)&&this.hide(t,0),i.forEach(function(t){return n.removeEventListener(t.event,t.handler)}),n.setAttribute("title",n.getAttribute("data-original-title")),n.removeAttribute("data-original-title"),n.removeAttribute("data-tooltipped"),n.removeAttribute("aria-describedby"),r&&r.destroy(),te.splice(te.map(function(t){return t.popper}).indexOf(t),1)}},{key:"update",value:function(t){var e=st(te,function(e){return e.popper===t
}),n=t.querySelector(ee.content),r=e.el,i=e.settings.html;i?n.innerHTML=i instanceof Element?i.innerHTML:document.getElementById(i.replace("#","")).innerHTML:(n.innerHTML=r.getAttribute("title")||r.getAttribute("data-original-title"),ft(r))}}]),t}();return Ct.defaultSettings=ne,Ct});
