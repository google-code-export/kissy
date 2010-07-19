/*
Copyright 2010, KISSY UI Library v1.0.8
MIT Licensed
build: 872 Jul 19 10:18
*/
KISSY.add("cookie",function(w){function u(o){return typeof o==="string"&&o!==""}var x=document,y=encodeURIComponent,z=decodeURIComponent;w.Cookie={get:function(o){var n;if(u(o))if(o=x.cookie.match("(?:^| )"+o+"(?:(?:=([^;]*))|;|$)"))n=o[1]?z(o[1]):"";return n},set:function(o,n,h,i,v,k){n=y(n);var m=h;if(typeof m==="number"){m=new Date;m.setTime(m.getTime()+h*864E5)}if(m instanceof Date)n+="; expires="+m.toUTCString();if(u(i))n+="; domain="+i;if(u(v))n+="; path="+v;if(k)n+="; secure";x.cookie=o+"="+
n},remove:function(o,n,h,i){this.set(o,"",0,n,h,i)}}});
KISSY.add("json",function(w){function u(k){return k<10?"0"+k:k}function x(k){o.lastIndex=0;return o.test(k)?'"'+k.replace(o,function(m){var p=i[m];return typeof p==="string"?p:"\\u"+("0000"+m.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+k+'"'}function y(k,m){var p,r,s=n,q,a=m[k];if(a&&typeof a==="object"&&typeof a.toJSON==="function")a=a.toJSON(k);if(typeof v==="function")a=v.call(m,k,a);switch(typeof a){case "string":return x(a);case "number":return isFinite(a)?String(a):"null";case "boolean":case "null":return String(a);
case "object":if(!a)return"null";n+=h;q=[];if(Object.prototype.toString.apply(a)==="[object Array]"){r=a.length;for(k=0;k<r;k+=1)q[k]=y(k,a)||"null";m=q.length===0?"[]":n?"[\n"+n+q.join(",\n"+n)+"\n"+s+"]":"["+q.join(",")+"]";n=s;return m}if(v&&typeof v==="object"){r=v.length;for(k=0;k<r;k+=1){p=v[k];if(typeof p==="string")if(m=y(p,a))q.push(x(p)+(n?": ":":")+m)}}else for(p in a)if(Object.hasOwnProperty.call(a,p))if(m=y(p,a))q.push(x(p)+(n?": ":":")+m);m=q.length===0?"{}":n?"{\n"+n+q.join(",\n"+n)+
"\n"+s+"}":"{"+q.join(",")+"}";n=s;return m}}w=w.JSON=window.JSON||{};if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+u(this.getUTCMonth()+1)+"-"+u(this.getUTCDate())+"T"+u(this.getUTCHours())+":"+u(this.getUTCMinutes())+":"+u(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()}}var z=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
o=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,n,h,i={"\u0008":"\\b","\t":"\\t","\n":"\\n","\u000c":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},v;if(typeof w.stringify!=="function")w.stringify=function(k,m,p){var r;h=n="";if(typeof p==="number")for(r=0;r<p;r+=1)h+=" ";else if(typeof p==="string")h=p;if((v=m)&&typeof m!=="function"&&(typeof m!=="object"||typeof m.length!=="number"))throw new Error("JSON.stringify");return y("",
{"":k})};if(typeof w.parse!=="function")w.parse=function(k,m){function p(r,s){var q,a,b=r[s];if(b&&typeof b==="object")for(q in b)if(Object.hasOwnProperty.call(b,q)){a=p(b,q);if(a!==undefined)b[q]=a;else delete b[q]}return m.call(r,s,b)}k=String(k);z.lastIndex=0;if(z.test(k))k=k.replace(z,function(r){return"\\u"+("0000"+r.charCodeAt(0).toString(16)).slice(-4)});if(/^[\],:{}\s]*$/.test(k.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){k=eval("("+k+")");return typeof m==="function"?p({"":k},""):k}throw new SyntaxError("JSON.parse");}});
(function(){function w(a,b,c,d,e,f){e=0;for(var j=d.length;e<j;e++){var g=d[e];if(g){g=g[a];for(var l=false;g;){if(g.sizcache===c){l=d[g.sizset];break}if(g.nodeType===1&&!f){g.sizcache=c;g.sizset=e}if(g.nodeName.toLowerCase()===b){l=g;break}g=g[a]}d[e]=l}}}function u(a,b,c,d,e,f){e=0;for(var j=d.length;e<j;e++){var g=d[e];if(g){g=g[a];for(var l=false;g;){if(g.sizcache===c){l=d[g.sizset];break}if(g.nodeType===1){if(!f){g.sizcache=c;g.sizset=e}if(typeof b!=="string"){if(g===b){l=true;break}}else if(h.filter(b,
[g]).length>0){l=g;break}}g=g[a]}d[e]=l}}}var x=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,y=0,z=Object.prototype.toString,o=false,n=true;[0,0].sort(function(){n=false;return 0});var h=function(a,b,c,d){c=c||[];var e=b=b||document;if(b.nodeType!==1&&b.nodeType!==9)return[];if(!a||typeof a!=="string")return c;var f=[],j,g,l,D,A=true,C=h.isXML(b),B=a,t;do{x.exec("");if(j=x.exec(B)){B=j[3];f.push(j[1]);if(j[2]){D=
j[3];break}}}while(j);if(f.length>1&&v.exec(a))if(f.length===2&&i.relative[f[0]])g=q(f[0]+f[1],b);else for(g=i.relative[f[0]]?[b]:h(f.shift(),b);f.length;){a=f.shift();if(i.relative[a])a+=f.shift();g=q(a,g)}else{if(!d&&f.length>1&&b.nodeType===9&&!C&&i.match.ID.test(f[0])&&!i.match.ID.test(f[f.length-1])){j=h.find(f.shift(),b,C);b=j.expr?h.filter(j.expr,j.set)[0]:j.set[0]}if(b){j=d?{expr:f.pop(),set:p(d)}:h.find(f.pop(),f.length===1&&(f[0]==="~"||f[0]==="+")&&b.parentNode?b.parentNode:b,C);g=j.expr?
h.filter(j.expr,j.set):j.set;if(f.length>0)l=p(g);else A=false;for(;f.length;){j=t=f.pop();if(i.relative[t])j=f.pop();else t="";if(j==null)j=b;i.relative[t](l,j,C)}}else l=[]}l||(l=g);l||h.error(t||a);if(z.call(l)==="[object Array]")if(A)if(b&&b.nodeType===1)for(a=0;l[a]!=null;a++){if(l[a]&&(l[a]===true||l[a].nodeType===1&&h.contains(b,l[a])))c.push(g[a])}else for(a=0;l[a]!=null;a++)l[a]&&l[a].nodeType===1&&c.push(g[a]);else c.push.apply(c,l);else p(l,c);if(D){h(D,e,c,d);h.uniqueSort(c)}return c};
h.uniqueSort=function(a){if(s){o=n;a.sort(s);if(o)for(var b=1;b<a.length;b++)a[b]===a[b-1]&&a.splice(b--,1)}return a};h.matches=function(a,b){return h(a,null,null,b)};h.find=function(a,b,c){var d;if(!a)return[];for(var e=0,f=i.order.length;e<f;e++){var j=i.order[e],g;if(g=i.leftMatch[j].exec(a)){var l=g[1];g.splice(1,1);if(l.substr(l.length-1)!=="\\"){g[1]=(g[1]||"").replace(/\\/g,"");d=i.find[j](g,b,c);if(d!=null){a=a.replace(i.match[j],"");break}}}}d||(d=b.getElementsByTagName("*"));return{set:d,
expr:a}};h.filter=function(a,b,c,d){for(var e=a,f=[],j=b,g,l,D=b&&b[0]&&h.isXML(b[0]);a&&b.length;){for(var A in i.filter)if((g=i.leftMatch[A].exec(a))!=null&&g[2]){var C=i.filter[A],B,t;t=g[1];l=false;g.splice(1,1);if(t.substr(t.length-1)!=="\\"){if(j===f)f=[];if(i.preFilter[A])if(g=i.preFilter[A](g,j,c,f,d,D)){if(g===true)continue}else l=B=true;if(g)for(var E=0;(t=j[E])!=null;E++)if(t){B=C(t,g,E,j);var F=d^!!B;if(c&&B!=null)if(F)l=true;else j[E]=false;else if(F){f.push(t);l=true}}if(B!==undefined){c||
(j=f);a=a.replace(i.match[A],"");if(!l)return[];break}}}if(a===e)if(l==null)h.error(a);else break;e=a}return j};h.error=function(a){throw"Syntax error, unrecognized expression: "+a;};var i=h.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\((even|odd|[\dn+\-]*)\))?/,
POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/},leftMatch:{},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(a){return a.getAttribute("href")}},relative:{"+":function(a,b){var c=typeof b==="string",d=c&&!/\W/.test(b);c=c&&!d;if(d)b=b.toLowerCase();d=0;for(var e=a.length,f;d<e;d++)if(f=a[d]){for(;(f=f.previousSibling)&&f.nodeType!==1;);a[d]=c||f&&f.nodeName.toLowerCase()===
b?f||false:f===b}c&&h.filter(b,a,true)},">":function(a,b){var c=typeof b==="string",d,e=0,f=a.length;if(c&&!/\W/.test(b))for(b=b.toLowerCase();e<f;e++){if(d=a[e]){c=d.parentNode;a[e]=c.nodeName.toLowerCase()===b?c:false}}else{for(;e<f;e++)if(d=a[e])a[e]=c?d.parentNode:d.parentNode===b;c&&h.filter(b,a,true)}},"":function(a,b,c){var d=y++,e=u,f;if(typeof b==="string"&&!/\W/.test(b)){f=b=b.toLowerCase();e=w}e("parentNode",b,d,a,f,c)},"~":function(a,b,c){var d=y++,e=u,f;if(typeof b==="string"&&!/\W/.test(b)){f=
b=b.toLowerCase();e=w}e("previousSibling",b,d,a,f,c)}},find:{ID:function(a,b,c){if(typeof b.getElementById!=="undefined"&&!c)return(a=b.getElementById(a[1]))?[a]:[]},NAME:function(a,b){if(typeof b.getElementsByName!=="undefined"){var c=[];b=b.getElementsByName(a[1]);for(var d=0,e=b.length;d<e;d++)b[d].getAttribute("name")===a[1]&&c.push(b[d]);return c.length===0?null:c}},TAG:function(a,b){return b.getElementsByTagName(a[1])}},preFilter:{CLASS:function(a,b,c,d,e,f){a=" "+a[1].replace(/\\/g,"")+" ";
if(f)return a;f=0;for(var j;(j=b[f])!=null;f++)if(j)if(e^(j.className&&(" "+j.className+" ").replace(/[\t\n]/g," ").indexOf(a)>=0))c||d.push(j);else if(c)b[f]=false;return false},ID:function(a){return a[1].replace(/\\/g,"")},TAG:function(a){return a[1].toLowerCase()},CHILD:function(a){if(a[1]==="nth"){var b=/(-?)(\d*)n((?:\+|-)?\d*)/.exec(a[2]==="even"&&"2n"||a[2]==="odd"&&"2n+1"||!/\D/.test(a[2])&&"0n+"+a[2]||a[2]);a[2]=b[1]+(b[2]||1)-0;a[3]=b[3]-0}a[0]=y++;return a},ATTR:function(a,b,c,d,e,f){b=
a[1].replace(/\\/g,"");if(!f&&i.attrMap[b])a[1]=i.attrMap[b];if(a[2]==="~=")a[4]=" "+a[4]+" ";return a},PSEUDO:function(a,b,c,d,e){if(a[1]==="not")if((x.exec(a[3])||"").length>1||/^\w/.test(a[3]))a[3]=h(a[3],null,null,b);else{a=h.filter(a[3],b,c,true^e);c||d.push.apply(d,a);return false}else if(i.match.POS.test(a[0])||i.match.CHILD.test(a[0]))return true;return a},POS:function(a){a.unshift(true);return a}},filters:{enabled:function(a){return a.disabled===false&&a.type!=="hidden"},disabled:function(a){return a.disabled===
true},checked:function(a){return a.checked===true},selected:function(a){return a.selected===true},parent:function(a){return!!a.firstChild},empty:function(a){return!a.firstChild},has:function(a,b,c){return!!h(c[3],a).length},header:function(a){return/h\d/i.test(a.nodeName)},text:function(a){return"text"===a.type},radio:function(a){return"radio"===a.type},checkbox:function(a){return"checkbox"===a.type},file:function(a){return"file"===a.type},password:function(a){return"password"===a.type},submit:function(a){return"submit"===
a.type},image:function(a){return"image"===a.type},reset:function(a){return"reset"===a.type},button:function(a){return"button"===a.type||a.nodeName.toLowerCase()==="button"},input:function(a){return/input|select|textarea|button/i.test(a.nodeName)}},setFilters:{first:function(a,b){return b===0},last:function(a,b,c,d){return b===d.length-1},even:function(a,b){return b%2===0},odd:function(a,b){return b%2===1},lt:function(a,b,c){return b<c[3]-0},gt:function(a,b,c){return b>c[3]-0},nth:function(a,b,c){return c[3]-
0===b},eq:function(a,b,c){return c[3]-0===b}},filter:{PSEUDO:function(a,b,c,d){var e=b[1],f=i.filters[e];if(f)return f(a,c,b,d);else if(e==="contains")return(a.textContent||a.innerText||h.getText([a])||"").indexOf(b[3])>=0;else if(e==="not"){b=b[3];c=0;for(d=b.length;c<d;c++)if(b[c]===a)return false;return true}else h.error("Syntax error, unrecognized expression: "+e)},CHILD:function(a,b){var c=b[1],d=a;switch(c){case "only":case "first":for(;d=d.previousSibling;)if(d.nodeType===1)return false;if(c===
"first")return true;d=a;case "last":for(;d=d.nextSibling;)if(d.nodeType===1)return false;return true;case "nth":c=b[2];var e=b[3];if(c===1&&e===0)return true;b=b[0];var f=a.parentNode;if(f&&(f.sizcache!==b||!a.nodeIndex)){var j=0;for(d=f.firstChild;d;d=d.nextSibling)if(d.nodeType===1)d.nodeIndex=++j;f.sizcache=b}a=a.nodeIndex-e;return c===0?a===0:a%c===0&&a/c>=0}},ID:function(a,b){return a.nodeType===1&&a.getAttribute("id")===b},TAG:function(a,b){return b==="*"&&a.nodeType===1||a.nodeName.toLowerCase()===
b},CLASS:function(a,b){return(" "+(a.className||a.getAttribute("class"))+" ").indexOf(b)>-1},ATTR:function(a,b){var c=b[1];a=i.attrHandle[c]?i.attrHandle[c](a):a[c]!=null?a[c]:a.getAttribute(c);c=a+"";var d=b[2];b=b[4];return a==null?d==="!=":d==="="?c===b:d==="*="?c.indexOf(b)>=0:d==="~="?(" "+c+" ").indexOf(b)>=0:!b?c&&a!==false:d==="!="?c!==b:d==="^="?c.indexOf(b)===0:d==="$="?c.substr(c.length-b.length)===b:d==="|="?c===b||c.substr(0,b.length+1)===b+"-":false},POS:function(a,b,c,d){var e=i.setFilters[b[2]];
if(e)return e(a,c,b,d)}}},v=i.match.POS,k=function(a,b){return"\\"+(b-0+1)};for(var m in i.match){i.match[m]=new RegExp(i.match[m].source+/(?![^\[]*\])(?![^\(]*\))/.source);i.leftMatch[m]=new RegExp(/(^(?:.|\r|\n)*?)/.source+i.match[m].source.replace(/\\(\d+)/g,k))}var p=function(a,b){a=Array.prototype.slice.call(a,0);if(b){b.push.apply(b,a);return b}return a};try{Array.prototype.slice.call(document.documentElement.childNodes,0)}catch(r){p=function(a,b){b=b||[];var c=0;if(z.call(a)==="[object Array]")Array.prototype.push.apply(b,
a);else if(typeof a.length==="number")for(var d=a.length;c<d;c++)b.push(a[c]);else for(;a[c];c++)b.push(a[c]);return b}}var s;if(document.documentElement.compareDocumentPosition)s=function(a,b){if(!a.compareDocumentPosition||!b.compareDocumentPosition){if(a==b)o=true;return a.compareDocumentPosition?-1:1}a=a.compareDocumentPosition(b)&4?-1:a===b?0:1;if(a===0)o=true;return a};else if("sourceIndex"in document.documentElement)s=function(a,b){if(!a.sourceIndex||!b.sourceIndex){if(a==b)o=true;return a.sourceIndex?
-1:1}a=a.sourceIndex-b.sourceIndex;if(a===0)o=true;return a};else if(document.createRange)s=function(a,b){if(!a.ownerDocument||!b.ownerDocument){if(a==b)o=true;return a.ownerDocument?-1:1}var c=a.ownerDocument.createRange(),d=b.ownerDocument.createRange();c.setStart(a,0);c.setEnd(a,0);d.setStart(b,0);d.setEnd(b,0);a=c.compareBoundaryPoints(Range.START_TO_END,d);if(a===0)o=true;return a};h.getText=function(a){for(var b="",c,d=0;a[d];d++){c=a[d];if(c.nodeType===3||c.nodeType===4)b+=c.nodeValue;else if(c.nodeType!==
8)b+=h.getText(c.childNodes)}return b};(function(){var a=document.createElement("div"),b="script"+(new Date).getTime();a.innerHTML="<a name='"+b+"'/>";var c=document.documentElement;c.insertBefore(a,c.firstChild);if(document.getElementById(b)){i.find.ID=function(d,e,f){if(typeof e.getElementById!=="undefined"&&!f)return(e=e.getElementById(d[1]))?e.id===d[1]||typeof e.getAttributeNode!=="undefined"&&e.getAttributeNode("id").nodeValue===d[1]?[e]:undefined:[]};i.filter.ID=function(d,e){var f=typeof d.getAttributeNode!==
"undefined"&&d.getAttributeNode("id");return d.nodeType===1&&f&&f.nodeValue===e}}c.removeChild(a);c=a=null})();(function(){var a=document.createElement("div");a.appendChild(document.createComment(""));if(a.getElementsByTagName("*").length>0)i.find.TAG=function(b,c){c=c.getElementsByTagName(b[1]);if(b[1]==="*"){b=[];for(var d=0;c[d];d++)c[d].nodeType===1&&b.push(c[d]);c=b}return c};a.innerHTML="<a href='#'></a>";if(a.firstChild&&typeof a.firstChild.getAttribute!=="undefined"&&a.firstChild.getAttribute("href")!==
"#")i.attrHandle.href=function(b){return b.getAttribute("href",2)};a=null})();document.querySelectorAll&&function(){var a=h,b=document.createElement("div");b.innerHTML="<p class='TEST'></p>";if(!(b.querySelectorAll&&b.querySelectorAll(".TEST").length===0)){h=function(d,e,f,j){e=e||document;if(!j&&e.nodeType===9&&!h.isXML(e))try{return p(e.querySelectorAll(d),f)}catch(g){}return a(d,e,f,j)};for(var c in a)h[c]=a[c];b=null}}();(function(){var a=document.createElement("div");a.innerHTML="<div class='test e'></div><div class='test'></div>";
if(!(!a.getElementsByClassName||a.getElementsByClassName("e").length===0)){a.lastChild.className="e";if(a.getElementsByClassName("e").length!==1){i.order.splice(1,0,"CLASS");i.find.CLASS=function(b,c,d){if(typeof c.getElementsByClassName!=="undefined"&&!d)return c.getElementsByClassName(b[1])};a=null}}})();h.contains=document.compareDocumentPosition?function(a,b){return!!(a.compareDocumentPosition(b)&16)}:function(a,b){return a!==b&&(a.contains?a.contains(b):true)};h.isXML=function(a){return(a=(a?
a.ownerDocument||a:0).documentElement)?a.nodeName!=="HTML":false};var q=function(a,b){var c=[],d="",e;for(b=b.nodeType?[b]:b;e=i.match.PSEUDO.exec(a);){d+=e[0];a=a.replace(i.match.PSEUDO,"")}a=i.relative[a]?a+"*":a;e=0;for(var f=b.length;e<f;e++)h(a,b[e],c);return h.filter(d,c)};KISSY.ExternalSelector=h;KISSY.ExternalSelector._filter=function(a,b){return h.matches(b,KISSY.query(a))}})();
