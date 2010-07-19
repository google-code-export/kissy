/*
Copyright 2010, KISSY UI Library v1.0.8
MIT Licensed
build: 871 Jul 19 08:51
*/
(function(h,k,g){if(h[k]===g)h[k]={};k=h[k];var l=h.document,p=function(b,c,f,i){if(!c||!b)return b;if(f===g)f=true;var o,m,r;if(i&&(r=i.length))for(o=0;o<r;o++){m=i[o];if(m in c)if(f||!(m in b))b[m]=c[m]}else for(m in c)if(f||!(m in b))b[m]=c[m];return b},t=false,s=[],w=false,x=/^#?([\w-]+)$/;p(k,{version:"1.0.8",_init:function(){this.Env={mods:{},guid:0}},add:function(b,c){this.Env.mods[b]={name:b,fn:c};c(this);return this},ready:function(b){w||this._bindReady();t?b.call(h,this):s.push(b);return this},
_bindReady:function(){var b=this,c=l.documentElement.doScroll,f=c?"onreadystatechange":"DOMContentLoaded",i=function(){b._fireReady()};w=true;if(l.readyState==="complete")return i();if(l.addEventListener){var o=function(){l.removeEventListener(f,o,false);i()};l.addEventListener(f,o,false);h.addEventListener("load",i,false)}else{var m=function(){if(l.readyState==="complete"){l.detachEvent(f,m);i()}};l.attachEvent(f,m);h.attachEvent("onload",i);if(h==h.top){var r=function(){try{c("left");i()}catch(a){setTimeout(r,
1)}};r()}}},_fireReady:function(){if(!t){t=true;if(s){for(var b,c=0;b=s[c++];)b.call(h,this);s=null}}},available:function(b,c){if((b=(b+"").match(x)[1])&&k.isFunction(c))var f=1,i=k.later(function(){if(l.getElementById(b)&&(c()||1)||++f>500)i.cancel()},40,true)},mix:p,merge:function(){var b={},c,f=arguments.length;for(c=0;c<f;++c)p(b,arguments[c]);return b},augment:function(){var b=arguments,c=b.length-2,f=b[0],i=b[c],o=b[c+1],m=1;if(!k.isArray(o)){i=o;o=g;c++}if(!k.isBoolean(i)){i=g;c++}for(;m<c;m++)p(f.prototype,
b[m].prototype||b[m],i,o);return f},extend:function(b,c,f,i){if(!c||!b)return b;var o=Object.prototype,m=c.prototype,r=function(a){function d(){}d.prototype=a;return new d}(m);b.prototype=r;r.constructor=b;b.superclass=m;if(c!==Object&&m.constructor===o.constructor)m.constructor=c;f&&p(r,f);i&&p(b,i);return b},namespace:function(){var b=arguments.length,c=null,f,i,o;for(f=0;f<b;++f){o=(""+arguments[f]).split(".");c=this;for(i=h[o[0]]===c?1:0;i<o.length;++i)c=c[o[i]]=c[o[i]]||{}}return c},app:function(b,
c){var f=h[b]||{};p(f,this,true,["_init","add","namespace"]);f._init();return p(h[b]=f,typeof c==="function"?c():c)},log:function(b,c,f){if(this.Config.debug){if(f)b=f+": "+b;if(h.console!==g&&console.log)console[c&&console[c]?c:"log"](b)}return this},error:function(b){if(this.Config.debug)throw b;},guid:function(b){var c=this.Env.guid++ +"";return b?b+c:c}});k._init();k.Config={debug:""}})(window,"KISSY");
KISSY.add("kissy-lang",function(h,k){function g(a){var d=typeof a;return a===null||d!=="object"&&d!=="function"}var l=window,p=document,t=location,s=Array.prototype,w=s.indexOf,x=s.filter,b=String.prototype.trim,c=Object.prototype.toString,f=encodeURIComponent,i=decodeURIComponent,o=/^\s+|\s+$/g,m=/^(\w+)\[\]$/,r=/\S/;h.mix(h,{isUndefined:function(a){return a===k},isBoolean:function(a){return typeof a==="boolean"},isString:function(a){return typeof a==="string"},isNumber:function(a){return typeof a===
"number"&&isFinite(a)},isPlainObject:function(a){return a&&c.call(a)==="[object Object]"&&!a.nodeType&&!a.setInterval},isEmptyObject:function(a){for(var d in a)return false;return true},isFunction:function(a){return c.call(a)==="[object Function]"},isArray:function(a){return c.call(a)==="[object Array]"},trim:b?function(a){return a==k?"":b.call(a)}:function(a){return a==k?"":a.toString().replace(o,"")},each:function(a,d,e){for(var j=a&&a.length||0,n=0;n<j;++n)d.call(e||l,a[n],n,a)},indexOf:w?function(a,
d){return w.call(d,a)}:function(a,d){for(var e=0,j=d.length;e<j;++e)if(d[e]===a)return e;return-1},inArray:function(a,d){return h.indexOf(a,d)>-1},makeArray:function(a){if(a===null||a===k)return[];if(h.isArray(a))return a;if(typeof a.length!=="number"||typeof a==="string"||h.isFunction(a))return[a];if(a.item&&h.UA.ie){for(var d=[],e=0,j=a.length;e<j;++e)d[e]=a[e];return d}return s.slice.call(a)},filter:x?function(a,d,e){return x.call(a,d,e)}:function(a,d,e){var j=[];h.each(a,function(n,q,u){d.call(e,
n,q,u)&&j.push(n)});return j},param:function(a,d){if(!h.isPlainObject(a))return"";d=d||"&";var e=[],j,n;for(j in a){n=a[j];j=f(j);if(g(n))e.push(j,"=",f(n+""),d);else if(h.isArray(n)&&n.length)for(var q=0,u=n.length;q<u;++q)g(n[q])&&e.push(j,"[]=",f(n[q]+""),d)}e.pop();return e.join("")},unparam:function(a,d){if(typeof a!=="string"||(a=h.trim(a)).length===0)return{};var e={};a=a.split(d||"&");for(var j,n,q,u=0,v=a.length;u<v;++u){d=a[u].split("=");j=i(d[0]);try{n=i(d[1]||"")}catch(y){n=d[1]||""}if((q=
j.match(m))&&q[1]){e[q[1]]=e[q[1]]||[];e[q[1]].push(n)}else e[j]=n}return e},later:function(a,d,e,j,n){d=d||0;j=j||{};var q=a,u=h.makeArray(n),v;if(typeof a==="string")q=j[a];q||h.error("method undefined");a=function(){q.apply(j,u)};v=e?setInterval(a,d):setTimeout(a,d);return{id:v,interval:e,cancel:function(){this.interval?clearInterval(v):clearTimeout(v)}}},clone:function(a){var d=a,e,j;if(a&&((e=h.isArray(a))||h.isPlainObject(a))){d=e?[]:{};for(j in a)if(a.hasOwnProperty(j))d[j]=h.clone(a[j])}return d},
now:function(){return(new Date).getTime()},globalEval:function(a){if(a&&r.test(a)){var d=p.getElementsByTagName("head")[0]||p.documentElement,e=p.createElement("script");e.text=a;d.insertBefore(e,d.firstChild);d.removeChild(e)}}});if(t&&t.search&&t.search.indexOf("ks-debug")!==-1)h.Config.debug=true});
KISSY.add("kissy-ua",function(h){var k=navigator.userAgent,g,l={webkit:0,chrome:0,safari:0,gecko:0,firefox:0,ie:0,opera:0,mobile:""},p=function(t){var s=0;return parseFloat(t.replace(/\./g,function(){return s++===0?".":""}))};if((g=k.match(/AppleWebKit\/([\d.]*)/))&&g[1]){l.webkit=p(g[1]);if((g=k.match(/Chrome\/([\d.]*)/))&&g[1])l.chrome=p(g[1]);else if((g=k.match(/\/([\d.]*) Safari/))&&g[1])l.safari=p(g[1]);if(/ Mobile\//.test(k))l.mobile="Apple";else if(g=k.match(/NokiaN[^\/]*|Android \d\.\d|webOS\/\d\.\d/))l.mobile=
g[0]}else if((g=k.match(/Opera\/.* Version\/([\d.]*)/))&&g[1]){l.opera=p(g[1]);if(k.match(/Opera Mini[^;]*/))l.mobile=g[0]}else if((g=k.match(/MSIE\s([^;]*)/))&&g[1])l.ie=p(g[1]);else if(g=k.match(/Gecko/)){l.gecko=1;if((g=k.match(/rv:([\d.]*)/))&&g[1])l.gecko=p(g[1]);if((g=k.match(/Firefox\/([\d.]*)/))&&g[1])l.firefox=p(g[1])}h.UA=l});
