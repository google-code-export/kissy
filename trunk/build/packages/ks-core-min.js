/*
Copyright 2010, KISSY UI Library v1.0.8
MIT Licensed
build: 871 Jul 19 08:52
*/
(function(b,o,l){if(b[o]===l)b[o]={};o=b[o];var k=b.document,p=function(s,g,r,v){if(!g||!s)return s;if(r===l)r=true;var w,d,h;if(v&&(h=v.length))for(w=0;w<h;w++){d=v[w];if(d in g)if(r||!(d in s))s[d]=g[d]}else for(d in g)if(r||!(d in s))s[d]=g[d];return s},q=false,i=[],m=false,t=/^#?([\w-]+)$/;p(o,{version:"1.0.8",_init:function(){this.Env={mods:{},guid:0}},add:function(s,g){this.Env.mods[s]={name:s,fn:g};g(this);return this},ready:function(s){m||this._bindReady();q?s.call(b,this):i.push(s);return this},
_bindReady:function(){var s=this,g=k.documentElement.doScroll,r=g?"onreadystatechange":"DOMContentLoaded",v=function(){s._fireReady()};m=true;if(k.readyState==="complete")return v();if(k.addEventListener){var w=function(){k.removeEventListener(r,w,false);v()};k.addEventListener(r,w,false);b.addEventListener("load",v,false)}else{var d=function(){if(k.readyState==="complete"){k.detachEvent(r,d);v()}};k.attachEvent(r,d);b.attachEvent("onload",v);if(b==b.top){var h=function(){try{g("left");v()}catch(a){setTimeout(h,
1)}};h()}}},_fireReady:function(){if(!q){q=true;if(i){for(var s,g=0;s=i[g++];)s.call(b,this);i=null}}},available:function(s,g){if((s=(s+"").match(t)[1])&&o.isFunction(g))var r=1,v=o.later(function(){if(k.getElementById(s)&&(g()||1)||++r>500)v.cancel()},40,true)},mix:p,merge:function(){var s={},g,r=arguments.length;for(g=0;g<r;++g)p(s,arguments[g]);return s},augment:function(){var s=arguments,g=s.length-2,r=s[0],v=s[g],w=s[g+1],d=1;if(!o.isArray(w)){v=w;w=l;g++}if(!o.isBoolean(v)){v=l;g++}for(;d<g;d++)p(r.prototype,
s[d].prototype||s[d],v,w);return r},extend:function(s,g,r,v){if(!g||!s)return s;var w=Object.prototype,d=g.prototype,h=function(a){function c(){}c.prototype=a;return new c}(d);s.prototype=h;h.constructor=s;s.superclass=d;if(g!==Object&&d.constructor===w.constructor)d.constructor=g;r&&p(h,r);v&&p(s,v);return s},namespace:function(){var s=arguments.length,g=null,r,v,w;for(r=0;r<s;++r){w=(""+arguments[r]).split(".");g=this;for(v=b[w[0]]===g?1:0;v<w.length;++v)g=g[w[v]]=g[w[v]]||{}}return g},app:function(s,
g){var r=b[s]||{};p(r,this,true,["_init","add","namespace"]);r._init();return p(b[s]=r,typeof g==="function"?g():g)},log:function(s,g,r){if(this.Config.debug){if(r)s=r+": "+s;if(b.console!==l&&console.log)console[g&&console[g]?g:"log"](s)}return this},error:function(s){if(this.Config.debug)throw s;},guid:function(s){var g=this.Env.guid++ +"";return s?s+g:g}});o._init();o.Config={debug:""}})(window,"KISSY");
KISSY.add("kissy-lang",function(b,o){function l(a){var c=typeof a;return a===null||c!=="object"&&c!=="function"}var k=window,p=document,q=location,i=Array.prototype,m=i.indexOf,t=i.filter,s=String.prototype.trim,g=Object.prototype.toString,r=encodeURIComponent,v=decodeURIComponent,w=/^\s+|\s+$/g,d=/^(\w+)\[\]$/,h=/\S/;b.mix(b,{isUndefined:function(a){return a===o},isBoolean:function(a){return typeof a==="boolean"},isString:function(a){return typeof a==="string"},isNumber:function(a){return typeof a===
"number"&&isFinite(a)},isPlainObject:function(a){return a&&g.call(a)==="[object Object]"&&!a.nodeType&&!a.setInterval},isEmptyObject:function(a){for(var c in a)return false;return true},isFunction:function(a){return g.call(a)==="[object Function]"},isArray:function(a){return g.call(a)==="[object Array]"},trim:s?function(a){return a==o?"":s.call(a)}:function(a){return a==o?"":a.toString().replace(w,"")},each:function(a,c,f){for(var n=a&&a.length||0,u=0;u<n;++u)c.call(f||k,a[u],u,a)},indexOf:m?function(a,
c){return m.call(c,a)}:function(a,c){for(var f=0,n=c.length;f<n;++f)if(c[f]===a)return f;return-1},inArray:function(a,c){return b.indexOf(a,c)>-1},makeArray:function(a){if(a===null||a===o)return[];if(b.isArray(a))return a;if(typeof a.length!=="number"||typeof a==="string"||b.isFunction(a))return[a];if(a.item&&b.UA.ie){for(var c=[],f=0,n=a.length;f<n;++f)c[f]=a[f];return c}return i.slice.call(a)},filter:t?function(a,c,f){return t.call(a,c,f)}:function(a,c,f){var n=[];b.each(a,function(u,e,j){c.call(f,
u,e,j)&&n.push(u)});return n},param:function(a,c){if(!b.isPlainObject(a))return"";c=c||"&";var f=[],n,u;for(n in a){u=a[n];n=r(n);if(l(u))f.push(n,"=",r(u+""),c);else if(b.isArray(u)&&u.length)for(var e=0,j=u.length;e<j;++e)l(u[e])&&f.push(n,"[]=",r(u[e]+""),c)}f.pop();return f.join("")},unparam:function(a,c){if(typeof a!=="string"||(a=b.trim(a)).length===0)return{};var f={};a=a.split(c||"&");for(var n,u,e,j=0,x=a.length;j<x;++j){c=a[j].split("=");n=v(c[0]);try{u=v(c[1]||"")}catch(y){u=c[1]||""}if((e=
n.match(d))&&e[1]){f[e[1]]=f[e[1]]||[];f[e[1]].push(u)}else f[n]=u}return f},later:function(a,c,f,n,u){c=c||0;n=n||{};var e=a,j=b.makeArray(u),x;if(typeof a==="string")e=n[a];e||b.error("method undefined");a=function(){e.apply(n,j)};x=f?setInterval(a,c):setTimeout(a,c);return{id:x,interval:f,cancel:function(){this.interval?clearInterval(x):clearTimeout(x)}}},clone:function(a){var c=a,f,n;if(a&&((f=b.isArray(a))||b.isPlainObject(a))){c=f?[]:{};for(n in a)if(a.hasOwnProperty(n))c[n]=b.clone(a[n])}return c},
now:function(){return(new Date).getTime()},globalEval:function(a){if(a&&h.test(a)){var c=p.getElementsByTagName("head")[0]||p.documentElement,f=p.createElement("script");f.text=a;c.insertBefore(f,c.firstChild);c.removeChild(f)}}});if(q&&q.search&&q.search.indexOf("ks-debug")!==-1)b.Config.debug=true});
KISSY.add("kissy-ua",function(b){var o=navigator.userAgent,l,k={webkit:0,chrome:0,safari:0,gecko:0,firefox:0,ie:0,opera:0,mobile:""},p=function(q){var i=0;return parseFloat(q.replace(/\./g,function(){return i++===0?".":""}))};if((l=o.match(/AppleWebKit\/([\d.]*)/))&&l[1]){k.webkit=p(l[1]);if((l=o.match(/Chrome\/([\d.]*)/))&&l[1])k.chrome=p(l[1]);else if((l=o.match(/\/([\d.]*) Safari/))&&l[1])k.safari=p(l[1]);if(/ Mobile\//.test(o))k.mobile="Apple";else if(l=o.match(/NokiaN[^\/]*|Android \d\.\d|webOS\/\d\.\d/))k.mobile=
l[0]}else if((l=o.match(/Opera\/.* Version\/([\d.]*)/))&&l[1]){k.opera=p(l[1]);if(o.match(/Opera Mini[^;]*/))k.mobile=l[0]}else if((l=o.match(/MSIE\s([^;]*)/))&&l[1])k.ie=p(l[1]);else if(l=o.match(/Gecko/)){k.gecko=1;if((l=o.match(/rv:([\d.]*)/))&&l[1])k.gecko=p(l[1]);if((l=o.match(/Firefox\/([\d.]*)/))&&l[1])k.firefox=p(l[1])}b.UA=k});KISSY.add("dom",function(b){b.DOM={_isElementNode:function(o){return o&&o.nodeType===1}}});
KISSY.add("selector",function(b,o){function l(d,h){var a,c=[],f,n;h=k(h);if(b.isString(d)){d=b.trim(d);if(v.test(d)){if(d=p(d.slice(1)))c=[d]}else if(a=w.exec(d)){f=a[1];n=a[2];a=a[3];if(h=f?p(f):h)if(a)if(!f||d.indexOf(g)!==-1)c=i(a,n,h);else{if((d=p(f))&&s.hasClass(d,a))c=[d]}else if(n)c=q(h,n)}else if(b.ExternalSelector)return b.ExternalSelector(d,h);else m(d)}else if(d&&d.nodeType)c=[d];else if(d&&(b.isArray(d)||d.item||d.getDOMNode))c=d;if(c.item)c=b.makeArray(c);return c}function k(d){if(d===
o)d=t;else if(b.isString(d)&&v.test(d))d=p(d.slice(1));else if(d&&d.nodeType!==1&&d.nodeType!==9)d=null;return d}function p(d){return t.getElementById(d)}function q(d,h){return d.getElementsByTagName(h)}function i(d,h,a){a=d=a.getElementsByClassName(d);var c=0,f=0,n=d.length,u;if(h&&h!==r){a=[];for(h=h.toUpperCase();c<n;++c){u=d[c];if(u.tagName===h)a[f++]=u}}return a}function m(d){b.error("Unsupported selector: "+d)}var t=document,s=b.DOM,g=" ",r="*",v=/^#[\w-]+$/,w=/^(?:#([\w-]+))?\s*([\w-]+|\*)?\.?([\w-]+)?$/;
(function(){var d=t.createElement("div");d.appendChild(t.createComment(""));if(d.getElementsByTagName(r).length>0)q=function(h,a){h=h.getElementsByTagName(a);if(a===r){a=[];for(var c=0,f=0,n;n=h[c++];)if(n.nodeType===1)a[f++]=n;h=a}return h}})();t.getElementsByClassName||(i=t.querySelectorAll?function(d,h,a){return a.querySelectorAll((h?h:"")+"."+d)}:function(d,h,a){h=a.getElementsByTagName(h||r);a=[];var c=0,f=0,n=h.length,u,e;for(d=g+d+g;c<n;++c){u=h[c];if((e=u.className)&&(g+e+g).indexOf(d)>-1)a[f++]=
u}return a});b.query=l;b.get=function(d,h){return l(d,h)[0]||null};b.mix(s,{query:l,get:b.get,filter:function(d,h){var a=l(d),c,f,n,u=[];if(b.isString(h)&&(c=w.exec(h))&&!c[1]){f=c[2];n=c[3];h=function(e){return!(f&&e.tagName!==f.toUpperCase()||n&&!s.hasClass(e,n))}}if(b.isFunction(h))u=b.filter(a,h);else if(h&&b.ExternalSelector)u=b.ExternalSelector._filter(d,h);else m(h);return u},test:function(d,h){d=l(d);return s.filter(d,h).length===d.length}})});
KISSY.add("dom-class",function(b,o){function l(i,m,t,s){if(!(m=b.trim(m)))return s?false:o;i=b.query(i);var g=0,r=i.length;m=m.split(p);for(var v;g<r;g++){v=i[g];if(v.nodeType===1){v=t(v,m,m.length);if(v!==o)return v}}if(s)return false}var k=b.DOM,p=/[\.\s]\s*\.?/,q=/[\n\t]/g;b.mix(k,{hasClass:function(i,m){return l(i,m,function(t,s,g){if(t=t.className){t=" "+t+" ";for(var r=0,v=true;r<g;r++)if(t.indexOf(" "+s[r]+" ")<0){v=false;break}if(v)return true}},true)},addClass:function(i,m){l(i,m,function(t,
s,g){var r=t.className;if(r){var v=" "+r+" ";r=r;for(var w=0;w<g;w++)if(v.indexOf(" "+s[w]+" ")<0)r+=" "+s[w];t.className=b.trim(r)}else t.className=m})},removeClass:function(i,m){l(i,m,function(t,s,g){var r=t.className;if(r)if(g){r=(" "+r+" ").replace(q," ");for(var v=0,w;v<g;v++)for(w=" "+s[v]+" ";r.indexOf(w)>=0;)r=r.replace(w," ");t.className=b.trim(r)}else t.className=""})},replaceClass:function(i,m,t){k.removeClass(i,m);k.addClass(i,t)},toggleClass:function(i,m,t){var s=b.isBoolean(t),g;l(i,
m,function(r,v,w){for(var d=0,h;d<w;d++){h=v[d];g=s?!t:k.hasClass(r,h);k[g?"removeClass":"addClass"](r,h)}})}})});
KISSY.add("dom-attr",function(b,o){function l(d,h){return h&&h.nodeName.toUpperCase()===d.toUpperCase()}var k=b.UA,p=k.ie,q=p&&p<8,i=document.documentElement.textContent!==o?"textContent":"innerText",m=b.DOM,t=m._isElementNode,s=/href|src|style/,g=/href|src|colspan|rowspan/,r=/\r/g,v=/radio|checkbox/,w={readonly:"readOnly"};q&&b.mix(w,{"for":"htmlFor","class":"className"});b.mix(m,{attr:function(d,h,a){if(h=b.trim(h)){h=h.toLowerCase();h=w[h]||h;if(a===o){d=b.get(d);if(!t(d))return o;var c;s.test(h)||
(c=d[h]);if(c===o)c=d.getAttribute(h);if(q)if(g.test(h))c=d.getAttribute(h,2);else if(h==="style")c=d.style.cssText;return c===null?o:c}b.each(b.query(d),function(f){if(t(f))if(q&&h==="style")f.style.cssText=a;else f.setAttribute(h,""+a)})}},removeAttr:function(d,h){b.each(b.query(d),function(a){t(a)&&a.removeAttribute(h)})},val:function(d,h){if(h===o){var a=b.get(d);if(!t(a))return o;if(l("option",a))return(a.attributes.value||{}).specified?a.value:a.text;if(l("select",a)){var c=a.selectedIndex;
d=a.options;if(c<0)return null;else if(a.type==="select-one")return m.val(d[c]);a=[];for(var f=0,n=d.length;f<n;++f)d[f].selected&&a.push(m.val(d[f]));return a}if(k.webkit&&v.test(a.type))return a.getAttribute("value")===null?"on":a.value;return(a.value||"").replace(r,"")}b.each(b.query(d),function(u){if(l("select",u)){if(b.isNumber(h))h+="";var e=b.makeArray(h),j=u.options,x;f=0;for(n=j.length;f<n;++f){x=j[f];x.selected=b.inArray(m.val(x),e)}if(!e.length)u.selectedIndex=-1}else if(t(u))u.value=h})},
text:function(d,h){if(h===o){d=b.get(d);if(t(d))return d[i]||""}else b.each(b.query(d),function(a){if(t(a))a[i]=h})}})});
KISSY.add("dom-style",function(b,o){function l(a,c){var f=b.get(a),n=c===t?f.offsetWidth:f.offsetHeight;b.each(c===t?["Left","Right"]:["Top","Bottom"],function(u){n-=parseFloat(p._getComputedStyle(f,"padding"+u))||0;n-=parseFloat(p._getComputedStyle(f,"border"+u+"Width"))||0});return n}function k(a,c,f){var n=f;if(f===s&&r.test(c)){n=0;if(p.css(a,"position")==="absolute"){f=a[c==="left"?"offsetLeft":"offsetTop"];if(q.ie===8||q.opera)f-=g(p.css(a.offsetParent,"border-"+c+"-width"))||0;n=f-(g(p.css(a,
"margin-"+c))||0)}}return n}var p=b.DOM,q=b.UA,i=document,m=i.documentElement,t="width",s="auto",g=parseInt,r=/^left|top$/,v=/width|height|top|left|right|bottom|margin|padding/i,w=/-([a-z])/ig,d=function(a,c){return c.toUpperCase()},h={};b.mix(p,{_CUSTOM_STYLES:h,_getComputedStyle:function(a,c){var f="",n=a.ownerDocument;if(a.style)f=n.defaultView.getComputedStyle(a,null)[c];return f},css:function(a,c,f){if(b.isPlainObject(c))for(var n in c)p.css(a,n,c[n]);else{if(c.indexOf("-")>0)c=c.replace(w,d);
c=h[c]||c;if(f===o){a=b.get(a);n="";if(a&&a.style){n=c.get?c.get(a):a.style[c];if(n===""&&!c.get)n=k(a,c,p._getComputedStyle(a,c))}return n===o?"":n}else{if(f===null||f==="")f="";else if(!isNaN(new Number(f))&&v.test(c))f+="px";(c===t||c==="height")&&parseFloat(f)<0||b.each(b.query(a),function(u){if(u&&u.style)c.set?c.set(u,f):(u.style[c]=f)})}}},width:function(a,c){if(c===o)return l(a,t);else p.css(a,t,c)},height:function(a,c){if(c===o)return l(a,"height");else p.css(a,"height",c)},addStyleSheet:function(a,
c){var f;if(c)f=b.get(c);f||(f=p.create("<style>",{id:c}));b.get("head").appendChild(f);if(f.styleSheet)f.styleSheet.cssText=a;else f.appendChild(i.createTextNode(a))}});if(m.style.cssFloat!==o)h["float"]="cssFloat";else if(m.style.styleFloat!==o)h["float"]="styleFloat"});
KISSY.add("dom-style-ie",function(b,o){if(b.UA.ie){var l=b.DOM,k=document,p=k.documentElement,q=l._CUSTOM_STYLES,i=/^-?\d+(?:px)?$/i,m=/^-?\d/,t=/^width|height$/;try{if(p.style.opacity===o&&p.filters)q.opacity={get:function(g){var r=100;try{r=g.filters["DXImageTransform.Microsoft.Alpha"].opacity}catch(v){try{r=g.filters("alpha").opacity}catch(w){}}return r/100+""},set:function(g,r){g=g.style;g.zoom=1;g.filter="alpha(opacity="+r*100+")"}}}catch(s){b.log("IE filters ActiveX is disabled. ex = "+s)}if(!(k.defaultView||
{}).getComputedStyle&&p.currentStyle)l._getComputedStyle=function(g,r){var v=g.style,w=g.currentStyle[r];if(t.test(r))w=l[r](g)+"px";else if(!i.test(w)&&m.test(w)){g=v.left;v.left=r==="fontSize"?"1em":w||0;w=v.pixelLeft+"px";v.left=g}return w}}});
KISSY.add("dom-offset",function(b,o){function l(e){var j=0,x=0,y=p(e[h]);if(e[u]){e=e[u]();j=e[a]+q[f](y);x=e[c]+q[n](y)}return{left:j,top:x}}function k(e,j){if(q.css(e,v)==="static")e.style[v]=w;var x=l(e),y={},z,B;for(B in j){z=r(q.css(e,B),10)||0;y[B]=z+j[B]-x[B]}q.css(e,y)}function p(e){return e&&"scrollTo"in e&&e[d]?e:e&&e.nodeType===9?e.defaultView||e.parentWindow:false}var q=b.DOM,i=window,m=document,t=q._isElementNode,s=m.compatMode==="CSS1Compat",g=Math.max,r=parseInt,v="position",w="relative",
d="document",h="ownerDocument",a="left",c="top",f="scrollLeft",n="scrollTop",u="getBoundingClientRect";b.mix(q,{offset:function(e,j){if(!(e=b.get(e))||!e[h])return null;if(j===o)return l(e);k(e,j)},scrollIntoView:function(e,j,x,y){if((e=b.get(e))&&e[h]){j=b.get(j);y=y===o?true:!!y;x=x===o?true:!!x;if(!t(j))return e.scrollIntoView(x);var z=q.offset(e),B=q.offset(j),A={left:z[a]-B[a],top:z[c]-B[c]};z=j.clientHeight;B=j.clientWidth;var C=q[f](j),D=q[n](j),F=C+B,G=D+z,E=e.offsetHeight;e=e.offsetWidth;
var H=A.left+C-(r(q.css(j,"borderLeftWidth"))||0);A=A.top+D-(r(q.css(j,"borderTopWidth"))||0);var I=H+e,J=A+E;if(E>z||A<D||x)j[n]=A;else if(J>G)j[n]=J-z;if(y)if(e>B||H<C||x)j[f]=H;else if(I>F)j[f]=I-B}}});b.each(["Left","Top"],function(e,j){var x="scroll"+e;q[x]=function(y){var z=0,B=y===o?i:p(y),A;if(B&&(A=B[d]))z=B[j?"pageYOffset":"pageXOffset"]||A.documentElement[x]||A.body[x];else if(t(y=b.get(y)))z=y[x];return z}});b.each(["Width","Height"],function(e){q["doc"+e]=function(j){j=j||m;return g(s?
j.documentElement["scroll"+e]:j.body["scroll"+e],q["viewport"+e](j))};q["viewport"+e]=function(j){var x="inner"+e;j=p(j)||i;var y=j[d];return x in j?j[x]:s?y.documentElement["client"+e]:y.body["client"+e]}})});
KISSY.add("dom-traversal",function(b,o){function l(i,m,t,s){if(!(i=b.get(i)))return null;if(m===o)m=1;var g=null,r,v;if(b.isNumber(m)&&m>=0){if(m===0)return i;r=0;v=m;m=function(){return++r===v}}for(;i=i[t];)if(q(i)&&(!m||p.test(i,m))&&(!s||s(i))){g=i;break}return g}function k(i,m,t){var s=[];var g=i=b.get(i);if(i&&t)g=i.parentNode;if(g){t=0;for(g=g.firstChild;g;g=g.nextSibling)if(q(g)&&g!==i&&(!m||p.test(g,m)))s[t++]=g}return s}var p=b.DOM,q=p._isElementNode;b.mix(p,{parent:function(i,m){return l(i,
m,"parentNode",function(t){return t.nodeType!=11})},next:function(i,m){return l(i,m,"nextSibling")},prev:function(i,m){return l(i,m,"previousSibling")},siblings:function(i,m){return k(i,m,true)},children:function(i,m){return k(i,m)},contains:function(i,m){var t=false;if((i=b.get(i))&&(m=b.get(m)))if(i.contains)return i.contains(m);else if(i.compareDocumentPosition)return!!(i.compareDocumentPosition(m)&16);else for(;!t&&(m=m.parentNode);)t=m==i;return t}})});
KISSY.add("dom-create",function(b,o){function l(e,j){if(g(e)&&j)for(var x in j)m.attr(e,x,j[x]);return e}function k(e,j){var x=null,y;if(e&&(e.push||e.item)&&e[0]){j=j||e[0].ownerDocument;x=j.createDocumentFragment();if(e.item)e=b.makeArray(e);j=0;for(y=e.length;j<y;j++)x.appendChild(e[j])}else b.log("Unable to convert "+e+" to fragment.");return x}function p(e,j,x,y){if(x){var z=b.guid("ks-tmp-");j+='<span id="'+z+'"></span>';b.available(z,function(){var B=b.get("head"),A,C,D,F,G,E;for(d.lastIndex=
0;A=d.exec(j);)if((D=(C=A[1])?C.match(h):false)&&D[2]){A=i.createElement("script");A.src=D[2];if((F=C.match(a))&&F[2])A.charset=F[2];A.async=true;B.appendChild(A)}else if((E=A[2])&&E.length>0)b.globalEval(E);(G=i.getElementById(z))&&m.remove(G);b.isFunction(y)&&y()});q(e,j)}else{q(e,j);b.isFunction(y)&&y()}}function q(e,j){j=j.replace(d,"");try{e.innerHTML=j}catch(x){for(;e.firstChild;)e.removeChild(e.firstChild);j&&e.appendChild(m.create(j))}}var i=document,m=b.DOM,t=b.UA,s=t.ie,g=m._isElementNode,
r=i.createElement("div"),v=/<(\w+)/,w=/^<(\w+)\s*\/?>(?:<\/\1>)?$/,d=/<script([^>]*)>([\s\S]*?)<\/script>/ig,h=/\ssrc=(['"])(.*?)\1/i,a=/\scharset=(['"])(.*?)\1/i;b.mix(m,{create:function(e,j,x){if(g(e))return e;if(!(e=b.trim(e)))return null;var y=null;y=m._creators;var z,B="div",A;if(z=w.exec(e))y=(x||i).createElement(z[1]);else{if((z=v.exec(e))&&(A=z[1])&&b.isFunction(y[A=A.toLowerCase()]))B=A;e=y[B](e,x).childNodes;y=e.length===1?e[0].parentNode.removeChild(e[0]):k(e,x||i)}return l(y,j)},_creators:{div:function(e,
j){j=j?j.createElement("div"):r;j.innerHTML=e;return j}},html:function(e,j,x,y){if(j===o){e=b.get(e);if(g(e))return e.innerHTML}else b.each(b.query(e),function(z){g(z)&&p(z,j,x,y)})},remove:function(e){b.each(b.query(e),function(j){g(j)&&j.parentNode&&j.parentNode.removeChild(j)})}});if(t.gecko||s){var c=m._creators,f=m.create,n=/(?:\/(?:thead|tfoot|caption|col|colgroup)>)+\s*<tbody/;t={option:"select",td:"tr",tr:"tbody",tbody:"table",col:"colgroup",legend:"fieldset"};for(var u in t)(function(e){c[u]=
function(j,x){return f("<"+e+">"+j+"</"+e+">",null,x)}})(t[u]);if(s){c.script=function(e,j){j=j?j.createElement("div"):r;j.innerHTML="-"+e;j.removeChild(j.firstChild);return j};if(s<8)c.tbody=function(e,j){j=f("<table>"+e+"</table>",null,j);var x=j.children.tags("tbody")[0];j.children.length>1&&x&&!n.test(e)&&x.parentNode.removeChild(x);return j}}b.mix(c,{optgroup:c.option,th:c.td,thead:c.tbody,tfoot:c.tbody,caption:c.tbody,colgroup:c.tbody})}});
KISSY.add("dom-insertion",function(b){var o=b.DOM;b.mix(o,{insertBefore:function(l,k){l=o.create(l);k=b.get(k);l&&k&&k.parentNode&&k.parentNode.insertBefore(l,k);return l},insertAfter:function(l,k){l=o.create(l);k=b.get(k);if(l&&k&&k.parentNode)k.nextSibling?k.parentNode.insertBefore(l,k.nextSibling):k.parentNode.appendChild(l);return l}})});
KISSY.add("event",function(b,o){function l(a,c,f,n,u){if(b.isString(c))c=b.query(c);if(b.isArray(c)){b.each(c,function(e){h[a](e,f,n,u)});return true}if((f=b.trim(f))&&f.indexOf(v)>0){b.each(f.split(v),function(e){h[a](c,e,n,u)});return true}}function k(a){return i(a)?a[r]:-1}function p(a,c){if(!i(a))return b.error("Text or comment node is not valid event target.");try{a[r]=c}catch(f){b.error(f)}}function q(a){try{a[r]=o;delete a[r]}catch(c){}}function i(a){return a&&a.nodeType!==3&&a.nodeType!==
8}var m=window,t=document,s=t.addEventListener?function(a,c,f,n){a.addEventListener&&a.addEventListener(c,f,!!n)}:function(a,c,f){a.attachEvent&&a.attachEvent("on"+c,f)},g=t.removeEventListener?function(a,c,f,n){a.removeEventListener&&a.removeEventListener(c,f,!!n)}:function(a,c,f){a.detachEvent&&a.detachEvent("on"+c,f)},r="ksEventTargetId",v=" ",w=b.now(),d={},h={EVENT_GUID:r,special:{},add:function(a,c,f,n){if(!l("add",a,c,f,n)){var u=k(a),e,j;if(!(u===-1||!c||!b.isFunction(f))){if(!u){p(a,u=w++);
d[u]={target:a,events:{}}}j=d[u].events;e=!a.isCustomEventTarget&&h.special[c]||{};if(!j[c]){u=function(x,y){if(!x||!x.fixed){x=new b.EventObject(a,x,c);b.isPlainObject(y)&&b.mix(x,y)}e.setup&&e.setup(x);return(e.handle||h._handle)(a,x,j[c].listeners,n)};j[c]={handle:u,listeners:[]};if(a.isCustomEventTarget)a._addEvent&&a._addEvent(c,u);else s(a,e.fix||c,u,e.capture)}j[c].listeners.push(f)}}},remove:function(a,c,f){if(!l("remove",a,c,f)){var n=k(a),u,e,j,x,y,z;if(n!==-1)if(n&&(u=d[n]))if(u.target===
a){u=u.events||{};if(e=u[c]){j=e.listeners;y=j.length;if(b.isFunction(f)&&y&&b.inArray(f,j)){z=[];for(x=0;x<y;++x)f!==j[x]&&z.push(j[x]);y=z.length}if(f===o||y===0){if(a.isCustomEventTarget)a._addEvent&&a._removeEvent(c,e.handle);else g(a,c,e.handle);delete u[c]}}if(c===o||b.isEmptyObject(u)){for(c in u)h.remove(a,c);delete d[n];q(a)}}}},_handle:function(a,c,f,n){f=f.slice(0);var u,e=0,j=f.length;for(n=n||a;e<j;++e){u=f[e].call(n,c);if(u===false&&a.isCustomEventTarget||c.isImmediatePropagationStopped)break}return u},
_getCache:function(a){return d[a]},_simpleAdd:s,_simpleRemove:g};h.on=h.add;b.Event=h;m.attachEvent&&!m.addEventListener&&m.attachEvent("onunload",function(){var a,c;for(a in d)if(c=d[a].target)try{h.remove(c)}catch(f){}})});
KISSY.add("event-object",function(b,o){function l(q,i,m){this.currentTarget=q;this.originalEvent=i||{};if(i){this.type=i.type;this._fix()}else{this.type=m;this.target=q}this.fixed=true}var k=document,p="altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" ");b.mix(l.prototype,
{_fix:function(){for(var q=this.originalEvent,i=p.length,m;i;){m=p[--i];this[m]=q[m]}if(!this.target)this.target=this.srcElement||k;if(this.target.nodeType===3)this.target=this.target.parentNode;if(!this.relatedTarget&&this.fromElement)this.relatedTarget=this.fromElement===this.target?this.toElement:this.fromElement;if(this.pageX===o&&this.clientX!==o){q=k.documentElement;i=k.body;this.pageX=this.clientX+(q&&q.scrollLeft||i&&i.scrollLeft||0)-(q&&q.clientLeft||i&&i.clientLeft||0);this.pageY=this.clientY+
(q&&q.scrollTop||i&&i.scrollTop||0)-(q&&q.clientTop||i&&i.clientTop||0)}if(this.which===o)this.which=this.charCode!==o?this.charCode:this.keyCode;if(this.metaKey===o)this.metaKey=this.ctrlKey;if(!this.which&&this.button!==o)this.which=this.button&1?1:this.button&2?3:this.button&4?2:0},preventDefault:function(){var q=this.originalEvent;if(q.preventDefault)q.preventDefault();else q.returnValue=false;this.isDefaultPrevented=true},stopPropagation:function(){var q=this.originalEvent;if(q.stopPropagation)q.stopPropagation();
else q.cancelBubble=true;this.isPropagationStopped=true},stopImmediatePropagation:function(){var q=this.originalEvent;q.stopImmediatePropagation?q.stopImmediatePropagation():this.stopPropagation();this.isImmediatePropagationStopped=true},halt:function(q){q?this.stopImmediatePropagation():this.stopPropagation();this.preventDefault()}});b.EventObject=l});
KISSY.add("event-target",function(b,o){var l=b.Event,k=l.EVENT_GUID;b.EventTarget={isCustomEventTarget:true,fire:function(p,q){if((p=((l._getCache(this[k]||-1)||{}).events||{})[p])&&b.isFunction(p.handle))return p.handle(o,q)},on:function(p,q,i){l.add(this,p,q,i)},detach:function(p,q){l.remove(this,p,q)}}});
KISSY.add("event-mouseenter",function(b){var o=b.Event;b.UA.ie||b.each([{name:"mouseenter",fix:"mouseover"},{name:"mouseleave",fix:"mouseout"}],function(l){o.special[l.name]={fix:l.fix,setup:function(k){k.type=l.name},handle:function(k,p,q){var i=p.relatedTarget;try{for(;i&&i!==k;)i=i.parentNode;i!==k&&o._handle(k,p,q)}catch(m){}}}})});
KISSY.add("event-focusin",function(b){var o=b.Event;document.addEventListener&&b.each([{name:"focusin",fix:"focus"},{name:"focusout",fix:"blur"}],function(l){o.special[l.name]={fix:l.fix,capture:true,setup:function(k){k.type=l.name}}})});
KISSY.add("node",function(b){function o(k,p,q){var i;if(!(this instanceof o))return new o(k,p,q);if(!k)return null;if(l._isElementNode(k))i=k;else if(typeof k==="string")i=l.create(k,p,q);this[0]=i}var l=b.DOM;b.augment(o,{length:1,getDOMNode:function(){return this[0]}});b.one=function(k,p){return new o(b.get(k,p))};b.Node=o});
KISSY.add("nodelist",function(b){function o(p){if(!(this instanceof o))return new o(p);k.push.apply(this,p||[])}var l=b.DOM,k=Array.prototype;b.mix(o.prototype,{length:0,item:function(p){var q=null;if(l._isElementNode(this[p]))q=new b.Node(this[p]);return q},getDOMNodes:function(){return k.slice.call(this)},each:function(p,q){for(var i=this.length,m=0,t;m<i;++m){t=new b.Node(this[m]);p.call(q||t,t,m,this)}return this}});b.all=function(p,q){return new o(b.query(p,q,true))};b.NodeList=o});
KISSY.add("node-attach",function(b,o){function l(w,arguments,d,h){var a=[this[w?s:t]()].concat(b.makeArray(arguments));if(arguments[d]===o)return h.apply(p,a);else{h.apply(p,a);return this}}function k(w,d){b.each(w,function(h){b.each([i,m],function(a,c){a[h]=function(f){switch(d){case g:return function(){return l.call(this,c,arguments,1,f)};case r:return function(){return l.call(this,c,arguments,0,f)};case v:return function(){var n=this[c?s:t]();return(n=f.apply(p,[n].concat(b.makeArray(arguments))))?
new b[n.length?"NodeList":"Node"](n):null};default:return function(){var n=this[c?s:t]();n=f.apply(p,[n].concat(b.makeArray(arguments)));return n===o?this:n}}}(p[h])})})}var p=b.DOM,q=b.Event,i=b.Node.prototype,m=b.NodeList.prototype,t="getDOMNode",s=t+"s",g=1,r=2,v=4;b.mix(i,{one:function(w){return b.one(w,this[0])},all:function(w){return b.all(w,this[0])}});k(["hasClass","addClass","removeClass","replaceClass","toggleClass"]);k(["attr","removeAttr"],g);k(["val","text"],r);k(["css"],g);k(["width",
"height"],r);k(["offset"],r);k(["scrollIntoView"]);k(["parent","next","prev","siblings","children"],v);k(["contains"]);k(["html"],r);k(["remove"]);k(["insertBefore","insertAfter"],v);b.each([i,m],function(w){b.mix(w,{append:function(d){d&&b.each(this,function(h){h.appendChild(p.create(d))});return this},appendTo:function(d){if((d=b.get(d))&&d.appendChild)b.each(this,function(h){d.appendChild(h)});return this}})});b.each([i,m],function(w){b.mix(w,b.EventTarget);w._addEvent=function(d,h){for(var a=
0,c=this.length;a<c;a++)q._simpleAdd(this[a],d,h)};w._removeEvent=function(d,h){for(var a=0,c=this.length;a<c;a++)q._simpleRemove(this[a],d,h)};delete w.fire})});
KISSY.add("ajax",function(b){var o=document,l=o.createElement("script").readyState?function(k,p){k.onreadystatechange=function(){var q=k.readyState;if(q==="loaded"||q==="complete"){k.onreadystatechange=null;p.call(this)}}}:function(k,p){k.onload=p};b.Ajax={request:function(){b.error("not implemented")},getScript:function(k,p,q){var i=b.get("head")||o.documentElement,m=o.createElement("script");m.src=k;if(q)m.charset=q;m.async=true;b.isFunction(p)&&l(m,p);i.appendChild(m)}}});
