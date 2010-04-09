/*
Copyright 2010, KISSY UI Library v1.0.5
MIT Licensed
build: 543 Apr 9 08:13
*/
(function(d,n,l){if(d[n]===l)d[n]={};n=d[n];var j=d.document,h=function(g,q,v,e){if(!q||!g)return g;if(v===l)v=true;var p,m,t;if(e&&(t=e.length))for(p=0;p<t;p++){m=e[p];if(m in q)if(v||!(m in g))g[m]=q[m]}else for(m in q)if(v||!(m in g))g[m]=q[m];return g},k=false,r=[],s=false;h(n,{version:"1.0.5",_init:function(){this.Env={mods:{}};this.Config={debug:true}},add:function(g,q){this.Env.mods[g]={name:g,fn:q};q(this);return this},ready:function(g){s||this._bindReady();k?g.call(d,this):r.push(g);return this},
_bindReady:function(){var g=this,q=j.documentElement.doScroll,v=q?"onreadystatechange":"DOMContentLoaded";s=true;if(j.attachEvent){if(d!=d.top){var e=function(){if(j.readyState==="complete"){j.detachEvent(v,e);g._fireReady()}};j.attachEvent(v,e)}else{var p=function(){try{q("left");g._fireReady()}catch(t){setTimeout(p,1)}};p()}d.attachEvent("onload",function(){g._fireReady()})}else{var m=function(){j.removeEventListener(v,m,false);g._fireReady()};j.addEventListener(v,m,false)}},_fireReady:function(){if(!k){k=
true;if(r){for(var g,q=0;g=r[q++];)g.call(d,this);r=null}}},mix:h,merge:function(){var g=arguments,q={},v,e=g.length;for(v=0;v<e;++v)h(q,g[v]);return q},extend:function(g,q,v,e){if(!q||!g)return g;var p=Object.prototype,m=q.prototype,t=function(f){function b(){}b.prototype=f;return new b}(m);g.prototype=t;t.constructor=g;g.superclass=m;if(q!==Object&&m.constructor===p.constructor)m.constructor=q;v&&h(t,v);e&&h(g,e);return g},augment:function(g,q,v,e){return h(g.prototype,n.isFunction(q)?q.prototype:
q,v,e)},weave:function(g,q,v,e){var p=[v[e],g];q==="before"&&p.reverse();v[e]=function(){for(var m=0,t;m<2;++m)t=p[m].apply(this,arguments);return t};return this},app:function(g){var q=d[g]||{};h(q,this,true,["_init","add","namespace"]);q._init();return d[g]=q},namespace:function(){var g=arguments,q=g.length,v=null,e,p,m;for(e=0;e<q;++e){m=(""+g[e]).split(".");v=this;for(p=d[m[0]]===v?1:0;p<m.length;++p)v=v[m[p]]=v[m[p]]||{}}return v},log:function(g,q,v){if(this.Config.debug){v&&(g=v+": "+g);if(d.console!==
l&&console.log)console[q&&console[q]?q:"log"](g)}return this},error:function(g){throw g;},now:function(){return(new Date).getTime()}});n._init()})(window,"KISSY");
KISSY.add("lang",function(d,n){function l(e){var p=typeof e;return e===null|(p!=="object"&&p!=="function")}var j=document,h=Array.prototype,k=h.forEach,r=h.indexOf,s=h.slice,g=/^\s+|\s+$/g,q=/^(\w+)\[\]$/,v=Object.prototype.toString;d.mix(d,{each:k?function(e,p,m){k.call(e,p,m);return this}:function(e,p,m){var t=e&&e.length||0,f;for(f=0;f<t;++f)p.call(m||this,e[f],f,e);return this},trim:String.prototype.trim?function(e){return(e||"").trim()}:function(e){return(e||"").replace(g,"")},isPlainObject:function(e){return e&&
v.call(e)==="[object Object]"&&!e.nodeType&&!e.setInterval},isEmptyObject:function(e){for(var p in e)return false;return true},isFunction:function(e){return v.call(e)==="[object Function]"},isArray:function(e){return v.call(e)==="[object Array]"},indexOf:r?function(e,p){return r.call(p,e)}:function(e,p){for(var m=0,t=p.length;m<t;++m)if(p[m]===e)return m;return-1},inArray:function(e,p){return d.indexOf(e,p)!==-1},makeArray:function(e){if(e===null||e===n)return[];if(d.isArray(e))return e;if(typeof e.length!==
"number"||typeof e==="string"||d.isFunction(e))return[e];if(e.item&&d.UA.ie){for(var p=[],m=0,t=e.length;m<t;++m)p[m]=e[m];return p}return s.call(e)},param:function(e){if(typeof e!=="object")return"";var p=[],m,t;for(m in e){t=e[m];if(l(t))p.push(m,"=",t+"","&");else if(d.isArray(t)&&t.length)for(var f=0,b=t.length;f<b;++f)l(t[f])&&p.push(m+"[]=",t[f]+"","&")}p.pop();return encodeURI(p.join(""))},unparam:function(e,p){if(typeof e!=="string"||(e=decodeURI(d.trim(e))).length===0)return{};var m={};e=
e.split(p||"&");for(var t,f,b=0,i=e.length;b<i;++b){t=e[b].split("=");p=t[0];t=t[1]||"";if((f=p.match(q))&&f[1]){m[f[1]]=m[f[1]]||[];m[f[1]].push(t)}else m[p]=t}return m},later:function(e,p,m,t,f){p=p||0;t=t||{};var b=e,i=d.makeArray(f),a;if(typeof e==="string")b=t[e];b||d.error("method undefined");e=function(){b.apply(t,i)};a=m?setInterval(e,p):setTimeout(e,p);return{id:a,interval:m,cancel:function(){this.interval?clearInterval(a):clearTimeout(a)}}},globalEval:function(e){if(e=d.trim(e)){var p=j.getElementsByTagName("head")[0]||
j.documentElement,m=j.createElement("script");if(d.UA.ie)m.text=e;else m.appendChild(j.createTextNode(e));p.insertBefore(m,p.firstChild);p.removeChild(m)}}})});
KISSY.add("ua",function(d){var n=navigator.userAgent,l,j={ie:0,gecko:0,firefox:0,opera:0,webkit:0,safari:0,chrome:0,mobile:""},h=function(k){var r=0;return parseFloat(k.replace(/\./g,function(){return r++===0?".":""}))};if((l=n.match(/AppleWebKit\/([\d.]*)/))&&l[1]){j.webkit=h(l[1]);if((l=n.match(/Chrome\/([\d.]*)/))&&l[1])j.chrome=h(l[1]);else if((l=n.match(/\/([\d.]*) Safari/))&&l[1])j.safari=h(l[1]);if(/ Mobile\//.test(n))j.mobile="Apple";else if(l=n.match(/NokiaN[^\/]*|Android \d\.\d|webOS\/\d\.\d/))j.mobile=
l[0]}else if((l=n.match(/Opera\/.* Version\/([\d.]*)/))&&l[1]){j.opera=h(l[1]);if(n.match(/Opera Mini[^;]*/))j.mobile=l[0]}else if((l=n.match(/MSIE\s([^;]*)/))&&l[1])j.ie=h(l[1]);else if(l=n.match(/Gecko/)){j.gecko=1;if((l=n.match(/rv:([\d.]*)/))&&l[1])j.gecko=h(l[1]);if((l=n.match(/Firefox\/([\d.]*)/))&&l[1])j.firefox=h(l[1])}d.UA=j});
KISSY.add("selector",function(d,n){function l(f,b,i){var a,c=[],o,u;if(typeof f===v){f=d.trim(f);if(m.test(f)){if(b=h(f.slice(1)))c=[b]}else if(a=t.exec(f)){o=a[1];u=a[2];a=a[3];if(b=o?h(o):j(b))if(a){if(!o||f.indexOf(e)!==-1)c=r(a,u,b)}else if(u)c=k(b,u)}else if(f.indexOf(",")>-1)if(q.querySelectorAll)c=q.querySelectorAll(f);else{o=f.split(",");u=[];c=0;for(f=o.length;c<f;++c)u=u.concat(l(o[c],b));c=s(u)}}else if(f&&f.nodeType)c=[f];else if(f&&f.item)c=f;if(c.item)c=d.makeArray(c);i||g(c);return c}
function j(f){if(f===n)f=q;else if(typeof f===v&&m.test(f))f=h(f.slice(1));else if(f&&f.nodeType!==1&&f.nodeType!==9)f=null;return f}function h(f){return q.getElementById(f)}function k(f,b){return f.getElementsByTagName(b)}function r(f,b,i){i=f=i.getElementsByClassName(f);var a=0,c=0,o=f.length,u;if(b&&b!==p){i=[];for(b=b.toUpperCase();a<o;++a){u=f[a];if(u.tagName===b)i[c++]=u}}return i}function s(f){var b=false;f.sort(function(a,c){a=a.sourceIndex-c.sourceIndex;if(a===0)b=true;return a});if(b)for(var i=
1;i<f.length;i++)f[i]===f[i-1]&&f.splice(i--,1);return f}function g(f){f.each=function(b,i){d.each(f,b,i)}}var q=document,v="string",e=" ",p="*",m=/^#[\w-]+$/,t=/^(?:#([\w-]+))?\s*([\w-]+|\*)?\.?([\w-]+)?$/;(function(){var f=q.createElement("div");f.appendChild(q.createComment(""));if(f.getElementsByTagName(p).length>0)k=function(b,i){b=b.getElementsByTagName(i);if(i===p){i=[];for(var a=0,c=0,o;o=b[a++];)if(o.nodeType===1)i[c++]=o;b=i}return b}})();q.getElementsByClassName||(r=q.querySelectorAll?
function(f,b,i){return i.querySelectorAll((b?b:"")+"."+f)}:function(f,b,i){b=i.getElementsByTagName(b||p);i=[];var a=0,c=0,o=b.length,u,w;for(f=e+f+e;a<o;++a){u=b[a];if((w=u.className)&&(e+w+e).indexOf(f)>-1)i[c++]=u}return i});d.query=l;d.get=function(f,b){return l(f,b,true)[0]||null}});
KISSY.add("dom-base",function(d,n){function l(a,c){return c&&c.nodeName.toUpperCase()===a.toUpperCase()}function j(a,c){for(var o=[],u=0;a;a=a.nextSibling)if(a.nodeType===1&&a!==c)o[u++]=a;return o}function h(a,c,o){c=c||0;for(var u=0;a;a=a[o])if(a.nodeType===1&&u++===c)break;return a}function k(a,c){var o=null,u;if(a&&(a.push||a.item)&&a[0]){c=c||a[0].ownerDocument;o=c.createDocumentFragment();if(a.item)a=d.makeArray(a);c=0;for(u=a.length;c<u;++c)o.appendChild(a[c])}else d.error("unable to convert "+
a+" to fragment");return o}var r=document,s=r.documentElement.textContent!==n?"textContent":"innerText",g=d.UA,q=g.ie,v=q&&q<8,e={readonly:"readOnly"},p=/href|src|style/,m=/href|src|colspan|rowspan/,t=/\r/g,f=/radio|checkbox/,b=r.createElement("DIV"),i=/^[a-z]+$/i;v&&d.mix(e,{"for":"htmlFor","class":"className"});d.DOM={query:d.query,get:d.get,attr:function(a,c,o){if(!a||a.nodeType!==1)return n;var u;c=c.toLowerCase();c=e[c]||c;if(o===n){if(p.test(c)){if(c==="style")u=a.style.cssText}else u=a[c];
if(u===n)u=a.getAttribute(c);if(v&&m.test(c))u=a.getAttribute(c,2);return u===null?n:u}if(c==="style")a.style.cssText=o;else a.setAttribute(c,""+o)},removeAttr:function(a,c){a&&a.nodeType===1&&a.removeAttribute(c)},val:function(a,c){if(!a||a.nodeType!==1)return n;if(c===n){if(l("option",a))return(a.attributes.value||{}).specified?a.value:a.text;if(l("select",a)){c=a.selectedIndex;var o=a.options;if(c<0)return null;else if(a.type==="select-one")return d.DOM.val(o[c]);a=[];c=0;for(var u=o.length;c<
u;++c)o[c].selected&&a.push(d.DOM.val(o[c]));return a}if(g.webkit&&f.test(a.type))return a.getAttribute("value")===null?"on":a.value;return(a.value||"").replace(t,"")}if(l("select",a)){o=d.makeArray(c);var w=a.options,x;c=0;for(u=w.length;c<u;++c){x=w[c];x.selected=d.inArray(d.DOM.val(x),o)}if(!o.length)a.selectedIndex=-1}else a.value=c},css:function(a,c,o){if(o===n)return a.style[c];d.each(d.makeArray(a),function(u){u.style[c]=o})},text:function(a,c){if(c===n)return(a||{})[s]||"";if(a)a[s]=c},html:function(a,
c){if(c===n)return a.innerHTML;a.innerHTML=c},children:function(a){if(a.children)return d.makeArray(a.children);return j(a.firstChild)},siblings:function(a){return j(a.parentNode.firstChild,a)},next:function(a){return h(a,1,"nextSibling")},prev:function(a){return h(a,1,"previousSibling")},parent:function(a){return(a=a.parentNode)&&a.nodeType!==11?a:null},create:function(a,c){if(typeof a==="string")a=d.trim(a);if(i.test(a))return(c||r).createElement(a);var o=null;o=c?c.createElement("DIV"):b;o.innerHTML=
a;a=o.childNodes;return o=a.length===1?a[0].parentNode.removeChild(a[0]):k(a,c||r)}}});
KISSY.add("dom-class",function(d,n){function l(s,g,q){if(d.isArray(s)){d.each(s,function(){g.apply(q,Array.prototype.slice.call(arguments,3))});return true}}var j=d.DOM;d.mix(j,{hasClass:function(s,g){if(!g||!s||!s.className)return false;return(" "+s.className+" ").indexOf(" "+g+" ")>-1},addClass:function(s,g){if(!l(s,k,j,g))if(g&&s)h(s,g)||(s.className+=" "+g)},removeClass:function(s,g){if(!l(s,r,j,g))if(h(s,g)){s.className=(" "+s.className+" ").replace(" "+g+" "," ");h(s,g)&&r(s,g)}},replaceClass:function(s,
g,q){r(s,g);k(s,q)},toggleClass:function(s,g,q){l(s,j.toggleClass,j,g,q)||((q!==n?q:!h(s,g))?k(s,g):r(s,g))}});var h=j.hasClass,k=j.addClass,r=j.removeClass});
KISSY.add("event",function(d,n){function l(b,i,a,c){if(d.isArray(i)){d.each(i,function(o){f[b](o,a,c)});return true}if((a=d.trim(a))&&a.indexOf(p)>0){d.each(a.split(p),function(o){f[b](i,o,c)});return true}}function j(b){var i=-1;if(b.nodeType===3||b.nodeType===8)return i;return i=b.nodeType?r.attr(b,e):b.isCustomEventTarget?b.eventTargetId:b[e]}function h(b,i){if(b.nodeType)r.attr(b,e,i);else if(b.isCustomEventTarget)b.eventTargetId=i;else try{b[e]=i}catch(a){d.error(a)}}function k(b){if(b.nodeType)r.removeAttr(b,
e);else if(b.isCustomEventTarget)b.eventTargetId=n;else b[e]=n}var r=d.DOM,s=window,g=document,q=g.addEventListener?function(b,i,a){b.addEventListener&&b.addEventListener(i,a,false)}:function(b,i,a){b.attachEvent&&b.attachEvent("on"+i,a)},v=g.removeEventListener?function(b,i,a){b.removeEventListener&&b.removeEventListener(i,a,false)}:function(b,i,a){b.detachEvent&&b.detachEvent("on"+i,a)},e="data-ks-event-guid",p=" ",m=d.now(),t={},f={special:{},add:function(b,i,a){if(!l("add",b,i,a)){var c=j(b),
o,u;if(!(c===-1||!i||!d.isFunction(a))){if(!c){h(b,c=m++);t[c]={target:b,events:{}}}u=t[c].events;o=!b.isCustomEventTarget&&f.special[i]||{};if(!u[i]){c=function(w,x){if(!w||!w.fixed){w=new d.EventObject(b,w,i);d.isPlainObject(x)&&d.mix(w,x)}o.setup&&o.setup(w);return(o.handle||f._handle)(b,w,u[i].listeners)};u[i]={handle:c,listeners:[]};if(b.isCustomEventTarget)b._addEvent&&b._addEvent(i,c);else q(b,o.fix||i,c)}u[i].listeners.push(a)}}},remove:function(b,i,a){if(!l("remove",b,i,a)){var c=j(b),o,
u,w,x,y,z;if(c!==-1)if(c&&(o=t[c]))if(o.target===b){o=o.events||{};if(u=o[i]){w=u.listeners;y=w.length;if(d.isFunction(a)&&y&&d.inArray(a,w)){z=[];for(x=0;x<y;++x)a!==w[x]&&z.push(w[x]);y=z.length}if(a===n||y===0){b.isCustomEventTarget||v(b,i,u.handle);delete t[c].type}}if(i===n||d.isEmptyObject(o)){for(i in o)f.remove(b,i);delete t[c];k(b)}}}},_handle:function(b,i,a){for(var c,o=0,u=a.length;o<u;++o){c=a[o].call(b,i);if(i.isImmediatePropagationStopped)break;c===false&&i.halt()}return c},_getCache:function(b){return t[b]},
_simpleAdd:q,_simpleRemove:v};f.on=f.add;d.Event=f;s.attachEvent&&!s.addEventListener&&s.attachEvent("onunload",function(){var b,i;for(b in t)if(i=t[b].target)try{f.remove(i)}catch(a){}})});
KISSY.add("event-object",function(d,n){function l(k,r,s){this.currentTarget=k;this.originalEvent=r||{};if(r){this.type=r.type;this._fix()}else{this.type=s;this.target=k}this.fixed=true}var j=document,h="altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" ");d.mix(l.prototype,
{_fix:function(){for(var k=this.originalEvent,r=h.length,s;r;){s=h[--r];this[s]=k[s]}if(!this.target)this.target=this.srcElement||j;if(this.target.nodeType===3)this.target=this.target.parentNode;if(!this.relatedTarget&&this.fromElement)this.relatedTarget=this.fromElement===this.target?this.toElement:this.fromElement;if(this.pageX===n&&this.clientX!==n){k=j.documentElement;r=j.body;this.pageX=this.clientX+(k&&k.scrollLeft||r&&r.scrollLeft||0)-(k&&k.clientLeft||r&&r.clientLeft||0);this.pageY=this.clientY+
(k&&k.scrollTop||r&&r.scrollTop||0)-(k&&k.clientTop||r&&r.clientTop||0)}if(this.which===n)this.which=this.charCode!==n?this.charCode:this.keyCode;if(this.metaKey===n)this.metaKey=this.ctrlKey;if(!this.which&&this.button!==n)this.which=this.button&1?1:this.button&2?3:this.button&4?2:0},preventDefault:function(){var k=this.originalEvent;if(k.preventDefault)k.preventDefault();else k.returnValue=false;this.isDefaultPrevented=true},stopPropagation:function(){var k=this.originalEvent;if(k.stopPropagation)k.stopPropagation();
else k.cancelBubble=true;this.isPropagationStopped=true},stopImmediatePropagation:function(){var k=this.originalEvent;k.stopImmediatePropagation?k.stopImmediatePropagation():this.stopPropagation();this.isImmediatePropagationStopped=true},halt:function(k){k?this.stopImmediatePropagation():this.stopPropagation();this.preventDefault()}});d.EventObject=l});
KISSY.add("event-target",function(d,n){var l=d.Event;d.EventTarget={eventTargetId:n,isCustomEventTarget:true,fire:function(j,h){(j=((l._getCache(this.eventTargetId||-1)||{}).events||{})[j])&&d.isFunction(j.handle)&&j.handle(n,h)},on:function(j,h){l.add(this,j,h)},detach:function(j,h){l.remove(this,j,h)}}});
KISSY.add("event-mouseenter",function(d){var n=d.Event;d.UA.ie||d.each([{name:"mouseenter",fix:"mouseover"},{name:"mouseleave",fix:"mouseout"}],function(l){n.special[l.name]={fix:l.fix,setup:function(j){j.type=l.name},handle:function(j,h,k){var r=h.relatedTarget;try{for(;r&&r!==j;)r=r.parentNode;r!==j&&n._handle(j,h,k)}catch(s){}}}})});
KISSY.add("node",function(d){function n(h,k,r){var s;if(!(this instanceof n))return new n(h,k,r);if(!h)return null;if(h.nodeType)s=h;else if(typeof h==="string")s=l.create(h,r);k&&d.error("not implemented");this[0]=s}var l=d.DOM,j=n.prototype;d.each(["attr","removeAttr","css"],function(h){j[h]=function(k,r){var s=this[0];if(r===undefined)return l[h](s,k);else{l[h](s,k,r);return this}}});d.each(["val","text","html"],function(h){j[h]=function(k){var r=this[0];if(k===undefined)return l[h](r);else{l[h](r,
k);return this}}});d.each(["children","siblings","next","prev","parent"],function(h){j[h]=function(){var k=l[h](this[0]);return k?new d[k.length?"NodeList":"Node"](k):null}});d.each(["hasClass","addClass","removeClass","replaceClass","toggleClass"],function(h){j[h]=function(){var k=l[h].apply(l,[this[0]].concat(d.makeArray(arguments)));return typeof k==="boolean"?k:this}});d.mix(j,d.EventTarget);j._addEvent=function(h,k){d.Event._simpleAdd(this[0],h,k)};delete j.fire;d.mix(j,{one:function(h){return d.one(h,
this[0])},all:function(h){return d.all(h,this[0])}});d.one=function(h,k){return new n(d.get(h,k))};d.Node=n});KISSY.add("nodelist",function(d){function n(j){if(!(this instanceof n))return new n(j);l.apply(this,j||[])}var l=Array.prototype.push;d.mix(n.prototype,{length:0,each:function(j,h){for(var k=this.length,r=0,s;r<k;++r){s=new d.Node(this[r]);j.call(h||s,s,r,this)}return this}});d.all=function(j,h){return new n(d.query(j,h,true))};d.NodeList=n});
