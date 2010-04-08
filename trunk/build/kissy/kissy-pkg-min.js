/*
Copyright 2010, KISSY UI Library v1.0.5
MIT Licensed
build: 530 Apr 7 21:32
*/
(function(i,k,e){if(i[k]===e)i[k]={};k=i[k];var j=i.document,m=function(d,f,h,a){if(!f||!d)return d;if(h===e)h=true;var c,b,g;if(a&&(g=a.length))for(c=0;c<g;c++){b=a[c];if(b in f)if(h||!(b in d))d[b]=f[b]}else for(b in f)if(h||!(b in d))d[b]=f[b];return d},p=false,o=[],q=false;m(k,{version:"1.0.5",_init:function(){this.Env={mods:{}};this.Config={debug:true}},add:function(d,f){this.Env.mods[d]={name:d,fn:f};f(this);return this},ready:function(d){q||this._bindReady();p?d.call(i,this):o.push(d);
return this},_bindReady:function(){var d=this,f=j.documentElement.doScroll,h=f?"onreadystatechange":"DOMContentLoaded";q=true;if(j.attachEvent){if(i!=i.top){var a=function(){if(j.readyState==="complete"){j.detachEvent(h,a);d._fireReady()}};j.attachEvent(h,a)}else{var c=function(){try{f("left");d._fireReady()}catch(g){setTimeout(c,1)}};c()}i.attachEvent("onload",function(){d._fireReady()})}else{var b=function(){j.removeEventListener(h,b,false);d._fireReady()};j.addEventListener(h,b,false)}},_fireReady:function(){if(!p){p=
true;if(o){for(var d,f=0;d=o[f++];)d.call(i,this);o=null}}},mix:m,merge:function(){var d=arguments,f={},h,a=d.length;for(h=0;h<a;++h)m(f,d[h]);return f},extend:function(d,f,h,a){if(!f||!d)return d;var c=Object.prototype,b=f.prototype,g=function(l){function n(){}n.prototype=l;return new n}(b);d.prototype=g;g.constructor=d;d.superclass=b;if(f!==Object&&b.constructor===c.constructor)b.constructor=f;h&&m(g,h);a&&m(d,a);return d},augment:function(d,f,h,a){return m(d.prototype,k.isFunction(f)?f.prototype:
f,h,a)},weave:function(d,f,h,a){var c=[h[a],d];f==="before"&&c.reverse();h[a]=function(){for(var b=0,g;b<2;++b)g=c[b].apply(this,arguments);return g};return this},app:function(d){var f=i[d]||{};m(f,this,true,["_init","add","namespace"]);f._init();return i[d]=f},namespace:function(){var d=arguments,f=d.length,h=null,a,c,b;for(a=0;a<f;++a){b=(""+d[a]).split(".");h=this;for(c=i[b[0]]===h?1:0;c<b.length;++c)h=h[b[c]]=h[b[c]]||{}}return h},log:function(d,f,h){if(this.Config.debug){h&&(d=h+": "+d);if(i.console!==
e&&console.log)console[f&&console[f]?f:"log"](d)}return this},error:function(d){throw d;},now:function(){return(new Date).getTime()}});k._init()})(window,"KISSY");
KISSY.add("lang",function(i,k){function e(a){var c=typeof a;return a===null|(c!=="object"&&c!=="function")}var j=document,m=Array.prototype,p=m.forEach,o=m.indexOf,q=m.slice,d=/^\s+|\s+$/g,f=/^(\w+)\[\]$/,h=Object.prototype.toString;i.mix(i,{each:p?function(a,c,b){p.call(a,c,b);return this}:function(a,c,b){var g=a&&a.length||0,l;for(l=0;l<g;++l)c.call(b||this,a[l],l,a);return this},trim:String.prototype.trim?function(a){return(a||"").trim()}:function(a){return(a||"").replace(d,"")},isPlainObject:function(a){return a&&
h.call(a)==="[object Object]"&&!a.nodeType&&!a.setInterval},isEmptyObject:function(a){for(var c in a)return false;return true},isFunction:function(a){return h.call(a)==="[object Function]"},isArray:function(a){return h.call(a)==="[object Array]"},indexOf:o?function(a,c){return o.call(c,a)}:function(a,c){for(var b=0,g=c.length;b<g;++b)if(c[b]===a)return b;return-1},inArray:function(a,c){return i.indexOf(a,c)!==-1},makeArray:function(a){if(a===null||a===k)return[];if(i.isArray(a))return a;if(typeof a.length!==
"number"||typeof a==="string"||i.isFunction(a))return[a];if(a.item&&i.UA.ie){for(var c=[],b=0,g=a.length;b<g;++b)c[b]=a[b];return c}return q.call(a)},param:function(a){if(typeof a!=="object")return"";var c=[],b,g;for(b in a){g=a[b];if(e(g))c.push(b,"=",g+"","&");else if(i.isArray(g)&&g.length)for(var l=0,n=g.length;l<n;++l)e(g[l])&&c.push(b+"[]=",g[l]+"","&")}c.pop();return encodeURI(c.join(""))},unparam:function(a,c){if(typeof a!=="string"||(a=decodeURI(i.trim(a))).length===0)return{};var b={};a=
a.split(c||"&");for(var g,l,n=0,s=a.length;n<s;++n){g=a[n].split("=");c=g[0];g=g[1]||"";if((l=c.match(f))&&l[1]){b[l[1]]=b[l[1]]||[];b[l[1]].push(g)}else b[c]=g}return b},later:function(a,c,b,g,l){c=c||0;g=g||{};var n=a,s=i.makeArray(l),r;if(typeof a==="string")n=g[a];n||i.error("method undefined");a=function(){n.apply(g,s)};r=b?setInterval(a,c):setTimeout(a,c);return{id:r,interval:b,cancel:function(){this.interval?clearInterval(r):clearTimeout(r)}}},globalEval:function(a){if(a=i.trim(a)){var c=j.getElementsByTagName("head")[0]||
j.documentElement,b=j.createElement("script");if(i.UA.ie)b.text=a;else b.appendChild(j.createTextNode(a));c.insertBefore(b,c.firstChild);c.removeChild(b)}}})});
KISSY.add("ua",function(i){var k=navigator.userAgent,e,j={ie:0,gecko:0,firefox:0,opera:0,webkit:0,safari:0,chrome:0,mobile:""},m=function(p){var o=0;return parseFloat(p.replace(/\./g,function(){return o++===0?".":""}))};if((e=k.match(/AppleWebKit\/([\d.]*)/))&&e[1]){j.webkit=m(e[1]);if((e=k.match(/Chrome\/([\d.]*)/))&&e[1])j.chrome=m(e[1]);else if((e=k.match(/\/([\d.]*) Safari/))&&e[1])j.safari=m(e[1]);if(/ Mobile\//.test(k))j.mobile="Apple";else if(e=k.match(/NokiaN[^\/]*|Android \d\.\d|webOS\/\d\.\d/))j.mobile=
e[0]}else if((e=k.match(/Opera\/.* Version\/([\d.]*)/))&&e[1]){j.opera=m(e[1]);if(k.match(/Opera Mini[^;]*/))j.mobile=e[0]}else if((e=k.match(/MSIE\s([^;]*)/))&&e[1])j.ie=m(e[1]);else if(e=k.match(/Gecko/)){j.gecko=1;if((e=k.match(/rv:([\d.]*)/))&&e[1])j.gecko=m(e[1]);if((e=k.match(/Firefox\/([\d.]*)/))&&e[1])j.firefox=m(e[1])}i.UA=j});
KISSY.add("json",function(i){var k=window.JSON;i.JSON={parse:function(e){if(typeof e!=="string"||!e)return null;e=i.trim(e);if(/^[\],:{}\s]*$/.test(e.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return(k||{}).parse?k.parse(e):(new Function("return "+e))();else jQuery.error("Invalid JSON: "+e)}}});
