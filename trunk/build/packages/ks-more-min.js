/*
Copyright 2010, KISSY UI Library v1.0.5
MIT Licensed
build: 669 May 22 23:47
*/
KISSY.add("node",function(c){function m(g,l,j){var d;if(!(this instanceof m))return new m(g,l,j);if(!g)return null;if(g.nodeType)d=g;else if(typeof g==="string")d=n.create(g,j);l&&c.error("not implemented");this[0]=d}var n=c.DOM,h=m.prototype;c.each(["attr","removeAttr","css"],function(g){h[g]=function(l,j){var d=this[0];if(j===undefined)return n[g](d,l);else{n[g](d,l,j);return this}}});c.each(["val","text","html"],function(g){h[g]=function(l){var j=this[0];if(l===undefined)return n[g](j);else{n[g](j,
l);return this}}});c.each(["children","siblings","next","prev","parent"],function(g){h[g]=function(){var l=n[g](this[0]);return l?new c[l.length?"NodeList":"Node"](l):null}});c.each(["hasClass","addClass","removeClass","replaceClass","toggleClass"],function(g){h[g]=function(){var l=n[g].apply(n,[this[0]].concat(c.makeArray(arguments)));return typeof l==="boolean"?l:this}});c.mix(h,c.EventTarget);h._addEvent=function(g,l){c.Event._simpleAdd(this[0],g,l)};delete h.fire;c.mix(h,{one:function(g){return c.one(g,
this[0])},all:function(g){return c.all(g,this[0])},appendTo:function(g){if((g=c.get(g))&&g.appendChild)g.appendChild(this[0]);return this}});c.one=function(g,l){return new m(c.get(g,l))};c.Node=m});
KISSY.add("nodelist",function(c){function m(h){if(!(this instanceof m))return new m(h);n.apply(this,h||[])}var n=Array.prototype.push;c.mix(m.prototype,{length:0,each:function(h,g){for(var l=this.length,j=0,d;j<l;++j){d=new c.Node(this[j]);h.call(g||d,d,j,this)}return this}});c.all=function(h,g){return new m(c.query(h,g,true))};c.NodeList=m});
KISSY.add("cookie",function(c){function m(l){return typeof l==="string"&&l!==""}var n=document,h=encodeURIComponent,g=decodeURIComponent;c.Cookie={get:function(l){var j;if(m(l))if(l=n.cookie.match("(?:^| )"+l+"(?:(?:=([^;]*))|;|$)"))j=l[1]?g(l[1]):"";return j},set:function(l,j,d,i,o,f){j=h(j);var a=d;if(typeof a==="number"){a=new Date;a.setTime(a.getTime()+d*864E5)}if(a instanceof Date)j+="; expires="+a.toUTCString();if(m(i))j+="; domain="+i;if(m(o))j+="; path="+o;if(f)j+="; secure";n.cookie=l+"="+
j},remove:function(l){this.set(l,"",0)}}});
KISSY.add("json",function(c){function m(f){return f<10?"0"+f:f}function n(f){l.lastIndex=0;return l.test(f)?'"'+f.replace(l,function(a){var b=i[a];return typeof b==="string"?b:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+f+'"'}function h(f,a){var b,e,k=j,p,q=a[f];if(q&&typeof q==="object"&&typeof q.toJSON==="function")q=q.toJSON(f);if(typeof o==="function")q=o.call(a,f,q);switch(typeof q){case "string":return n(q);case "number":return isFinite(q)?String(q):"null";case "boolean":case "null":return String(q);
case "object":if(!q)return"null";j+=d;p=[];if(Object.prototype.toString.apply(q)==="[object Array]"){e=q.length;for(f=0;f<e;f+=1)p[f]=h(f,q)||"null";a=p.length===0?"[]":j?"[\n"+j+p.join(",\n"+j)+"\n"+k+"]":"["+p.join(",")+"]";j=k;return a}if(o&&typeof o==="object"){e=o.length;for(f=0;f<e;f+=1){b=o[f];if(typeof b==="string")if(a=h(b,q))p.push(n(b)+(j?": ":":")+a)}}else for(b in q)if(Object.hasOwnProperty.call(q,b))if(a=h(b,q))p.push(n(b)+(j?": ":":")+a);a=p.length===0?"{}":j?"{\n"+j+p.join(",\n"+j)+
"\n"+k+"}":"{"+p.join(",")+"}";j=k;return a}}c=c.JSON=window.JSON||{};if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+m(this.getUTCMonth()+1)+"-"+m(this.getUTCDate())+"T"+m(this.getUTCHours())+":"+m(this.getUTCMinutes())+":"+m(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()}}var g=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
l=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,j,d,i={"":"\\b","\t":"\\t","\n":"\\n","":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},o;if(typeof c.stringify!=="function")c.stringify=function(f,a,b){var e;d=j="";if(typeof b==="number")for(e=0;e<b;e+=1)d+=" ";else if(typeof b==="string")d=b;if((o=a)&&typeof a!=="function"&&(typeof a!=="object"||typeof a.length!=="number"))throw new Error("JSON.stringify");return h("",{"":f})};
if(typeof c.parse!=="function")c.parse=function(f,a){function b(e,k){var p,q,s=e[k];if(s&&typeof s==="object")for(p in s)if(Object.hasOwnProperty.call(s,p)){q=b(s,p);if(q!==undefined)s[p]=q;else delete s[p]}return a.call(e,k,s)}f=String(f);g.lastIndex=0;if(g.test(f))f=f.replace(g,function(e){return"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)});if(/^[\],:{}\s]*$/.test(f.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){f=eval("("+f+")");return typeof a==="function"?b({"":f},""):f}throw new SyntaxError("JSON.parse");}});
KISSY.add("ajax",function(c){var m=document,n=c.UA;c.Ajax={request:function(){c.error("not implemented")},getScript:function(h,g,l){var j=m.getElementsByTagName("head")[0]||m.documentElement,d=m.createElement("script");d.src=h;if(l)d.charset=l;d.async=true;if(c.isFunction(g))if(n.ie)d.onreadystatechange=function(){var i=d.readyState;if(i==="loaded"||i==="complete"){d.onreadystatechange=null;g()}};else d.onload=g;j.appendChild(d)}}});
KISSY.add("swf-ua",function(c){function m(j){var d=j[0]+".";switch(j[2].toString().length){case 1:d+="00";break;case 2:d+="0";break}return d+j[2]}c=c.UA;var n=0,h;if(c.ie){try{h=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");h.AllowScriptAccess="always"}catch(g){if(h!==null)n=6}if(n===0)try{n=m((new ActiveXObject("ShockwaveFlash.ShockwaveFlash")).GetVariable("$version").replace(/[A-Za-z\s]+/g,"").split(","))}catch(l){}}else if(h=navigator.mimeTypes["application/x-shockwave-flash"])if(h=h.enabledPlugin)n=
m(h.description.replace(/\s[rd]/g,".").replace(/[a-z\s]+/ig,"").split("."));c.flash=parseFloat(n)});
KISSY.add("swf",function(c){function m(f,a,b){var e="ks-swf-"+h++,k=parseFloat(b.version)||g;k=n.flash>=k;var p=n.flash>=8&&b.useExpressInstall&&!k,q=p?d:a;a="YUISwfId="+e+"&YUIBridgeCallback="+i;var s="<object ";this.id=e;m.instances[e]=this;if((f=c.get(f))&&(k||p)&&q){s+='id="'+e+'" ';s+=n.ie?'classid="'+l+'" ':'type="'+j+'" data="'+q+'" ';s+='width="100%" height="100%">';if(n.ie)s+='<param name="movie" value="'+q+'"/>';for(var r in b.fixedAttributes)if(o.hasOwnProperty(r))s+='<param name="'+r+
'" value="'+b.fixedAttributes[r]+'"/>';for(var u in b.flashVars){r=b.flashVars[u];if(typeof r==="string")a+="&"+u+"="+encodeURIComponent(r)}s+='<param name="flashVars" value="'+a+'"/>';s+="</object>";f.innerHTML=s;this.swf=c.get("#"+e)}}var n=c.UA,h=c.now(),g=10.22,l="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000",j="application/x-shockwave-flash",d="http://fpdownload.macromedia.com/pub/flashplayer/update/current/swf/autoUpdater.swf?"+h,i="KISSY.SWF.eventHandler",o={align:"",allowNetworking:"",allowScriptAccess:"",
base:"",bgcolor:"",menu:"",name:"",quality:"",salign:"",scale:"",tabindex:"",wmode:""};m.instances=(c.SWF||{}).instances||{};m.eventHandler=function(f,a){m.instances[f]._eventHandler(a)};c.augment(m,c.EventTarget);c.augment(m,{_eventHandler:function(f){var a=f.type;if(a==="log")c.log(f.message);else a&&this.fire(a,f)},callSWF:function(f,a){if(this.swf[f])return this.swf[f].apply(this.swf,a||[])}});c.SWF=m});
KISSY.add("swfstore",function(c,m){function n(d,i,o,f){var a="other",b=g.get(l),e=this;o=(o!==m?o:true)+"";f=(f!==m?f:true)+"";if(h.ie)a="ie";else if(h.gecko)a="gecko";else if(h.webkit)a="webkit";else if(h.opera)a="opera";if(!b||b==="null")g.set(l,b=Math.round(Math.random()*Math.PI*1E5));o={version:9.115,useExpressInstall:false,fixedAttributes:{allowScriptAccess:"always",allowNetworking:"all",scale:"noScale"},flashVars:{allowedDomain:j.location.hostname,shareData:o,browser:b,useCompression:f}};i||
(i=(new c.Node('<div style="height:0;width:0;overflow:hidden"></div>')).appendTo(j.body)[0]);e.embeddedSWF=new c.SWF(i,d||"swfstore.swf",o);e.embeddedSWF._eventHandler=function(k){c.SWF.prototype._eventHandler.call(e,k)}}var h=c.UA,g=c.Cookie,l="swfstore",j=document;c.augment(n,c.EventTarget);c.augment(n,{setItem:function(d,i){i=typeof i==="string"?i.replace(/\\/g,"\\\\"):c.JSON.stringify(i)+"";if(d=c.trim(d+""))try{return this.embeddedSWF.callSWF("setItem",[d,i])}catch(o){this.fire("error",{message:o})}},
getItem:function(d){return this.embeddedSWF.callSWF("getValueOf",[d])}});c.each(["getValueAt","getNameAt","getValueOf","getItems","getLength","removeItem","removeItemAt","clear","calculateCurrentSize","hasAdequateDimensions","setSize","getModificationDate","displaySettings"],function(d){n.prototype[d]=function(){try{return this.embeddedSWF.callSWF(d,c.makeArray(arguments))}catch(i){this.fire("error",{message:i})}}});c.SWFStore=n});
KISSY.add("datalazyload",function(c,m){function n(a,b){if(!(this instanceof n))return new n(a,b);if(b===m){b=a;a=[d]}c.isArray(a)||(a=[c.get(a)||d]);this.containers=a;this.config=c.merge(o,b||{});this.callbacks={els:[],fns:[]};this._init()}var h=c.DOM,g=c.Event,l=YAHOO.util.Dom,j=window,d=document,i={AUTO:"auto",MANUAL:"manual"},o={mod:i.MANUAL,diff:"default",placeholder:"http://a.tbcdn.cn/kissy/1.0.4/build/datalazyload/dot.gif"},f=n.prototype;c.mix(f,{_init:function(){this.threshold=this._getThreshold();
this._filterItems();this._getItemsLength()&&this._initLoadEvent()},_initLoadEvent:function(){function a(){e||(e=setTimeout(function(){b();e=null},100))}function b(){k._loadItems();if(k._getItemsLength()===0){g.remove(j,"scroll",a);g.remove(j,"resize",a)}}var e,k=this;g.on(j,"scroll",a);g.on(j,"resize",function(){k.threshold=k._getThreshold();a()});k._getItemsLength()&&c.ready(function(){b()})},_filterItems:function(){var a=this.containers,b=this.threshold,e=this.config.placeholder,k=this.config.mod===
i.MANUAL,p,q,s,r,u,t,v,w=[],x=[];p=0;for(q=a.length;p<q;++p){s=c.query("img",a[p]);r=0;for(u=s.length;r<u;++r){t=s[r];v=t.getAttribute("data-lazyload-src");if(k){if(v){t.src=e;w.push(t)}}else if(l.getY(t)>b&&!v){t.setAttribute("data-lazyload-src",t.src);t.src=e;w.push(t)}}s=c.query("textarea",a[p]);r=0;for(u=s.length;r<u;++r){t=s[r];h.hasClass(t,"ks-datalazyload")&&x.push(t)}}this.images=w;this.areaes=x},_loadItems:function(){this._loadImgs();this._loadAreaes();this._fireCallbacks()},_loadImgs:function(){var a=
this.images,b=this.threshold+l.getDocumentScrollTop(),e,k,p=[];for(e=0;k=a[e++];)l.getY(k)<=b?this._loadImgSrc(k):p.push(k);this.images=p},_loadImgSrc:function(a,b){b=b||"data-lazyload-src";var e=a.getAttribute(b);if(e&&a.src!=e){a.src=e;a.removeAttribute(b)}},_loadAreaes:function(){var a=this.areaes,b=this.threshold+l.getDocumentScrollTop(),e,k,p,q=[];for(e=0;k=a[e++];){p=k;if(l.getY(p)===m)p=k.parentNode;l.getY(p)<=b?this._loadDataFromArea(k.parentNode,k):q.push(k)}this.areaes=q},_loadDataFromArea:function(a,
b){var e=h.create(b.value);b.style.display="none";b.className="";a.insertBefore(e,b);c.UA.gecko||c.query("script",a).each(function(k){c.globalEval(k.text)})},_fireCallbacks:function(){var a=this.callbacks,b=a.els,e=a.fns,k=this.threshold+l.getDocumentScrollTop(),p,q,s,r=[],u=[];for(p=0;(q=b[p])&&(s=e[p++]);)if(l.getY(q)<=k)s.call(q);else{r.push(q);u.push(s)}a.els=r;a.fns=u},addCallback:function(a,b){if((a=c.get(a))&&typeof b==="function"){this.callbacks.els.push(a);this.callbacks.fns.push(b)}},_getThreshold:function(){var a=
this.config.diff,b=l.getViewportHeight();return a==="default"?2*b:b+a},_getItemsLength:function(){return this.images.length+this.areaes.length+this.callbacks.els.length},loadCustomLazyData:function(a,b,e){var k=this,p,q;c.isArray(a)||(a=[c.get(a)]);c.each(a,function(s){switch(b){case "textarea-data":if((p=c.get("textarea",s))&&h.hasClass(p,e||"ks-datalazyload-custom"))k._loadDataFromArea(s,p);break;default:q=s.nodeName==="IMG"?[s]:c.query("img",s);s=0;for(var r=q.length;s<r;s++)k._loadImgSrc(q[s],
e||"data-lazyload-src-custom")}})}});c.mix(n,f,true,["loadCustomLazyData","_loadImgSrc","_loadDataFromArea"]);c.DataLazyload=n});
KISSY.add("suggest",function(c,m){function n(a,b,e){if(!(this instanceof n))return new n(a,b,e);this.textInput=c.get(a);this.dataSource=b;this.JSONDataSource=c.isPlainObject(b)?b:null;this.returnedData=null;this.config=c.merge(f,e||{});this.container=null;this.queryParams=this.query="";this._timer=null;this._isRunning=false;this.dataScript=null;this._dataCache={};this._latestScriptTime="";this._onKeyboardSelecting=this._scriptDataIsOut=false;this.selectedItem=null;this._init()}var h=YAHOO.util.Dom,
g=c.DOM,l=c.Event,j=window,d=document,i=d.getElementsByTagName("head")[0],o=YAHOO.env.ua.ie,f={containerCls:"",containerWidth:"auto",resultFormat:"约%result%条结果",showCloseBtn:false,closeBtnText:"关闭",useShim:o===6,timerDelay:200,autoFocus:false,submitFormOnClickSelect:true};c.mix(n.prototype,{_init:function(){this._initTextInput();this._initContainer();this.config.useShim&&this._initShim();this._initStyle();this._initResizeEvent()},_initTextInput:function(){var a=this;a.textInput.setAttribute("autocomplete",
"off");l.on(a.textInput,"blur",function(){a.stop();a.hide()});a.config.autoFocus&&a.textInput.focus();var b=0;l.on(a.textInput,"keydown",function(e){e=e.keyCode;switch(e){case 27:a.hide();a.textInput.value=a.query;a.query.length===0&&a.textInput.blur();break;case 13:a.textInput.blur();a._onKeyboardSelecting&&a.textInput.value==a._getSelectedItemKey()&&a.fire("itemSelect");a._submitForm();break;case 40:case 38:if(b++==0){a._isRunning&&a.stop();a._onKeyboardSelecting=true;a.selectItem(e===40)}else if(b==
3)b=0;break}if(e!=40&&e!=38){a._isRunning||a.start();a._onKeyboardSelecting=false}});l.on(a.textInput,"keyup",function(){b=0})},_initContainer:function(){var a=d.createElement("div"),b=this.config.containerCls;a.className="ks-suggest-container";if(b)a.className+=" "+b;a.style.position="absolute";a.style.visibility="hidden";this.container=a;this._setContainerRegion();this._initContainerEvent();d.body.insertBefore(a,d.body.firstChild)},_setContainerRegion:function(){var a=h.getRegion(this.textInput),
b=a.left,e=a.right-b-2;e=e>0?e:0;if(d.documentMode===7&&(o===7||o===8))b-=2;else c.UA.gecko&&b++;this.container.style.left=b+"px";this.container.style.top=a.bottom+"px";this.container.style.width=this.config.containerWidth=="auto"?e+"px":this.config.containerWidth},_initContainerEvent:function(){var a=this;l.on(a.container,"mousemove",function(e){e=e.target;if(e.nodeName!="LI")e=h.getAncestorByTagName(e,"li");if(h.isAncestor(a.container,e))if(e!=a.selectedItem){a._removeSelectedItem();a._setSelectedItem(e)}});
var b=null;l.on(a.container,"mousedown",function(e){b=e.target;a.textInput.onbeforedeactivate=function(){j.event.returnValue=false;a.textInput.onbeforedeactivate=null};return false});l.on(a.container,"mouseup",function(e){if(a._isInContainer([e.pageX,e.pageY])){e=e.target;if(e==b)if(e.className=="ks-suggest-close-btn")a.hide();else{if(e.nodeName!="LI")e=h.getAncestorByTagName(e,"li");if(h.isAncestor(a.container,e)){a._updateInputFromSelectItem(e);a.fire("itemSelect");a.textInput.blur();a._submitForm()}}}})},
_submitForm:function(){if(this.config.submitFormOnClickSelect){var a=this.textInput.form;if(a){if(d.createEvent){var b=d.createEvent("MouseEvents");b.initEvent("submit",true,false);a.dispatchEvent(b)}else d.createEventObject&&a.fireEvent("onsubmit");a.submit()}}},_isInContainer:function(a){var b=h.getRegion(this.container);return a[0]>=b.left&&a[0]<=b.right&&a[1]>=b.top&&a[1]<=b.bottom},_initShim:function(){var a=d.createElement("iframe");a.src="about:blank";a.className="ks-suggest-shim";a.style.position=
"absolute";a.style.visibility="hidden";a.style.border="none";this.container.shim=a;this._setShimRegion();d.body.insertBefore(a,d.body.firstChild)},_setShimRegion:function(){var a=this.container,b=a.shim;if(b){b.style.left=parseInt(a.style.left)-2+"px";b.style.top=a.style.top;b.style.width=parseInt(a.style.width)+2+"px"}},_initStyle:function(){c.get("#ks-suggest-style")||g.addStyleSheet(".ks-suggest-container{background:white;border:1px solid #999;z-index:99999}.ks-suggest-shim{z-index:99998}.ks-suggest-container li{color:#404040;padding:1px 0 2px;font-size:12px;line-height:18px;float:left;width:100%}.ks-suggest-container li.selected{background-color:#39F;cursor:default}.ks-suggest-key{float:left;text-align:left;padding-left:5px}.ks-suggest-result{float:right;text-align:right;padding-right:5px;color:green}.ks-suggest-container li.selected span{color:#FFF;cursor:default}.ks-suggest-bottom{padding:0 5px 5px}.ks-suggest-close-btn{float:right}.ks-suggest-container li,.suggest-bottom{overflow:hidden;zoom:1;clear:both}.ks-suggest-container{*margin-left:2px;_margin-left:-2px;_margin-top:-3px}",
"ks-suggest-style")},_initResizeEvent:function(){var a=this,b;l.on(j,"resize",function(){b&&clearTimeout(b);b=setTimeout(function(){a._setContainerRegion();a._setShimRegion()},50)})},start:function(){var a=this;n.focusInstance=a;a._timer=setTimeout(function(){a.updateContent();a._timer=setTimeout(arguments.callee,a.config.timerDelay)},a.config.timerDelay);a._isRunning=true},stop:function(){n.focusInstance=null;clearTimeout(this._timer);this._isRunning=false},show:function(){if(!this.isVisible()){var a=
this.container,b=a.shim;a.style.visibility="";if(b){if(!b.style.height){a=h.getRegion(a);b.style.height=a.bottom-a.top-2+"px"}b.style.visibility=""}}},hide:function(){if(this.isVisible()){var a=this.container,b=a.shim;if(b)b.style.visibility="hidden";a.style.visibility="hidden"}},isVisible:function(){return this.container.style.visibility!="hidden"},updateContent:function(){if(this._needUpdate()){this._updateQueryValueFromInput();var a=this.query;if(c.trim(a).length)if(this._dataCache[a]!==m){this.returnedData=
"using cache";this._fillContainer(this._dataCache[a]);this._displayContainer()}else this.JSONDataSource?this.handleResponse(this.JSONDataSource[a]):this.requestData();else{this._fillContainer("");this.hide()}}},_needUpdate:function(){return this.textInput.value!=this.query},requestData:function(){var a=this;if(!o)a.dataScript=null;if(!a.dataScript){var b=d.createElement("script");b.charset="utf-8";i.insertBefore(b,i.firstChild);a.dataScript=b;if(!o){var e=(new Date).getTime();a._latestScriptTime=
e;b.setAttribute("time",e);l.on(b,"load",function(){a._scriptDataIsOut=b.getAttribute("time")!=a._latestScriptTime})}}a.queryParams="q="+encodeURIComponent(a.query)+"&code=utf-8&callback=g_ks_suggest_callback";a.fire("dataRequest");a.dataScript.src=a.dataSource+"?"+a.queryParams},handleResponse:function(a){if(!this._scriptDataIsOut){this.returnedData=a;this.fire("dataReturn");this.returnedData=this.formatData(this.returnedData);var b="";a=this.returnedData.length;if(a>0){b=d.createElement("ol");for(var e=
0;e<a;++e){var k=this.returnedData[e],p=this.formatItem(k.key,k.result);p.setAttribute("key",k.key);g.addClass(p,e%2?"even":"odd");b.appendChild(p)}b=b}this._fillContainer(b);a>0&&this.appendBottom();c.trim(this.container.innerHTML)&&this.fire("show");this._dataCache[this.query]=this.container.innerHTML;this._displayContainer()}},formatData:function(a){var b=[];if(!a)return b;if(c.isArray(a.result))a=a.result;var e=a.length;if(!e)return b;for(var k,p=0;p<e;++p){k=a[p];b[p]=typeof k==="string"?{key:k}:
c.isArray(k)&&k.length>=2?{key:k[0],result:k[1]}:k}return b},formatItem:function(a,b){var e=d.createElement("li"),k=d.createElement("span");k.className="ks-suggest-key";k.appendChild(d.createTextNode(a));e.appendChild(k);if(b!==m){a=this.config.resultFormat.replace("%result%",b);if(c.trim(a)){b=d.createElement("span");b.className="ks-suggest-result";b.appendChild(d.createTextNode(a));e.appendChild(b)}}return e},appendBottom:function(){var a=d.createElement("div");a.className="ks-suggest-bottom";if(this.config.showCloseBtn){var b=
d.createElement("a");b.href="javascript: void(0)";b.setAttribute("target","_self");b.className="ks-suggest-close-btn";b.appendChild(d.createTextNode(this.config.closeBtnText));a.appendChild(b)}c.trim(a.innerHTML)&&this.container.appendChild(a)},_fillContainer:function(a){if(a.nodeType==1){this.container.innerHTML="";this.container.appendChild(a)}else this.container.innerHTML=a;this.selectedItem=null},_displayContainer:function(){c.trim(this.container.innerHTML)?this.show():this.hide()},selectItem:function(a){var b=
this.container.getElementsByTagName("li");if(b.length!=0)if(this.isVisible()){if(this.selectedItem){a=h[a?"getNextSibling":"getPreviousSibling"](this.selectedItem);if(!a)this.textInput.value=this.query}else a=b[a?0:b.length-1];this._removeSelectedItem();if(a){this._setSelectedItem(a);this._updateInputFromSelectItem()}}else this.show()},_removeSelectedItem:function(){g.removeClass(this.selectedItem,"selected");this.selectedItem=null},_setSelectedItem:function(a){g.addClass(a,"selected");this.selectedItem=
a},_getSelectedItemKey:function(){if(!this.selectedItem)return"";return this.selectedItem.getAttribute("key")},_updateQueryValueFromInput:function(){this.query=this.textInput.value},_updateInputFromSelectItem:function(){this.textInput.value=this._getSelectedItemKey(this.selectedItem)}});c.mix(n.prototype,c.EventTarget);j.g_ks_suggest_callback=function(a){n.focusInstance&&setTimeout(function(){n.focusInstance.handleResponse(a)},0)};c.Suggest=n});
KISSY.add("switchable",function(c,m){function n(d,i){i=i||{};if(!("markupType"in i))if(i.panelCls)i.markupType=1;else if(i.panels)i.markupType=2;i=c.merge(n.Config,i);this.container=c.get(d);this.config=i;this.triggers=this.triggers||[];this.panels=this.panels||[];if(this.activeIndex===m)this.activeIndex=i.activeIndex;this._init()}var h=c.DOM,g=c.Event,l=document,j=n.prototype;n.Config={markupType:0,navCls:"ks-switchable-nav",contentCls:"ks-switchable-content",triggerCls:"ks-switchable-trigger",panelCls:"ks-switchable-panel",
triggers:[],panels:[],hasTriggers:true,triggerType:"mouse",delay:0.1,activeIndex:0,activeTriggerCls:"active",steps:1,viewSize:[]};n.Plugins=[];c.mix(j,{_init:function(){var d=this,i=d.config;d.panels.length===0&&d._parseMarkup();i.hasTriggers&&d._bindTriggers();c.each(n.Plugins,function(o){o.init&&o.init(d)})},_parseMarkup:function(){var d=this.container,i=this.config,o=i.hasTriggers,f,a=[],b=[];switch(i.markupType){case 0:if(f=c.get("."+i.navCls,d))a=h.children(f);f=c.get("."+i.contentCls,d);b=h.children(f);
break;case 1:a=c.query("."+i.triggerCls,d);b=c.query("."+i.panelCls,d);break;case 2:a=i.triggers;b=i.panels;break}d=b.length;this.length=d/i.steps;if(o&&d>0&&a.length===0)a=this._generateTriggersMarkup(this.length);this.triggers=c.makeArray(a);this.panels=c.makeArray(b);this.content=f||b[0].parentNode},_generateTriggersMarkup:function(d){var i=this.config,o=l.createElement("UL"),f,a;o.className=i.navCls;for(a=0;a<d;a++){f=l.createElement("LI");if(a===this.activeIndex)f.className=i.activeTriggerCls;
f.innerHTML=a+1;o.appendChild(f)}this.container.appendChild(o);return h.children(o)},_bindTriggers:function(){var d=this,i=d.config,o=d.triggers,f,a,b=o.length;for(a=0;a<b;a++)(function(e){f=o[e];g.on(f,"click focus",function(){d._onFocusTrigger(e)});if(i.triggerType==="mouse"){g.on(f,"mouseenter",function(){d._onMouseEnterTrigger(e)});g.on(f,"mouseleave",function(){d._onMouseLeaveTrigger(e)})}})(a)},_onFocusTrigger:function(d){if(this.activeIndex!==d){this.switchTimer&&this.switchTimer.cancel();
this.switchTo(d)}},_onMouseEnterTrigger:function(d){var i=this;if(i.activeIndex!==d)i.switchTimer=c.later(function(){i.switchTo(d)},i.config.delay*1E3)},_onMouseLeaveTrigger:function(){this.switchTimer&&this.switchTimer.cancel()},switchTo:function(d,i){var o=this.config,f=this.triggers,a=this.panels,b=this.activeIndex,e=o.steps,k=b*e,p=d*e;if(d===b)return this;if(this.fire("beforeSwitch",{toIndex:d})===false)return this;if(o.hasTriggers)this._switchTrigger(b>-1?f[b]:null,f[d]);if(i===m)i=d>b?"forward":
"forward";this._switchView(a.slice(k,k+e),a.slice(p,p+e),d,i);this.activeIndex=d;return this},_switchTrigger:function(d,i){var o=this.config.activeTriggerCls;d&&h.removeClass(d,o);h.addClass(i,o)},_switchView:function(d,i){h.css(d,"display","none");h.css(i,"display","block");this.fire("switch")},prev:function(){var d=this.activeIndex;this.switchTo(d>0?d-1:this.length-1,"backward")},next:function(){var d=this.activeIndex;this.switchTo(d<this.length-1?d+1:0,"forward")}});c.mix(j,c.EventTarget);c.Switchable=
n});
KISSY.add("switchable-autoplay",function(c){var m=c.Event,n=c.Switchable;c.mix(n.Config,{autoplay:false,interval:5,pauseOnHover:true});n.Plugins.push({name:"autoplay",init:function(h){var g=h.config;if(g.autoplay){if(g.pauseOnHover){m.on(h.container,"mouseenter",function(){h.paused=true});m.on(h.container,"mouseleave",function(){setTimeout(function(){h.paused=false},g.interval*1E3)})}h.autoplayTimer=c.later(function(){h.paused||h.switchTo(h.activeIndex<h.length-1?h.activeIndex+1:0)},g.interval*1E3,
true)}}})});
KISSY.add("switchable-effect",function(c){var m=YAHOO.util,n=c.DOM,h=m.Dom,g=c.Switchable,l;c.mix(g.Config,{effect:"none",duration:0.5,easing:m.Easing.easeNone});g.Effects={none:function(j,d,i){n.css(j,"display","none");n.css(d,"display","block");i()},fade:function(j,d,i){j.length!==1&&c.error("fade effect only supports steps == 1.");var o=this,f=o.config,a=j[0],b=d[0];o.anim&&o.anim.stop();h.setStyle(b,"opacity",1);o.anim=new m.Anim(a,{opacity:{to:0}},f.duration,f.easing);o.anim.onComplete.subscribe(function(){o.anim=null;
h.setStyle(b,"z-index",9);h.setStyle(a,"z-index",1);i()});o.anim.animate()},scroll:function(j,d,i,o){var f=this;j=f.config;d=j.effect==="scrollx";var a={};a[d?"left":"top"]={to:-(f.viewSize[d?0:1]*o)};f.anim&&f.anim.stop();f.anim=new m.Anim(f.content,a,j.duration,j.easing);f.anim.onComplete.subscribe(function(){f.anim=null;i()});f.anim.animate()}};l=g.Effects;l.scrollx=l.scrolly=l.scroll;g.Plugins.push({name:"effect",init:function(j){var d=j.config,i=d.effect,o=j.panels,f=d.steps,a=j.activeIndex*
f,b=a+f-1,e=o.length;j.viewSize=[d.viewSize[0]||o[0].offsetWidth*f,d.viewSize[0]||o[0].offsetHeight*f];if(i!=="none"){for(d=0;d<e;d++)o[d].style.display="block";switch(i){case "scrollx":case "scrolly":j.content.style.position="absolute";j.content.parentNode.style.position="relative";if(i==="scrollx"){h.setStyle(o,"float","left");j.content.style.width=j.viewSize[0]*(e/f)+"px"}break;case "fade":for(d=0;d<e;d++){h.setStyle(o[d],"opacity",d>=a&&d<=b?1:0);o[d].style.position="absolute";o[d].style.zIndex=
d>=a&&d<=b?9:1}break}}}});c.mix(g.prototype,{_switchView:function(j,d,i,o){var f=this,a=f.config.effect;(c.isFunction(a)?a:l[a]).call(f,j,d,function(){f.fire("switch")},i,o)}})});
KISSY.add("switchable-circular",function(c){function m(e,k,p,q,s){var r=this;e=r.config;k=r.length;var u=r.activeIndex,t=e.scrollType===a,v=t?l:j,w=r.viewSize[t?0:1];t=-w*q;var x={},z,y=s===f;if(z=y&&u===0&&q===k-1||s===o&&u===k-1&&q===0)t=n.call(r,r.panels,q,y,v,w);x[v]={to:t};r.anim&&r.anim.stop();r.anim=new YAHOO.util.Anim(r.content,x,e.duration,e.easing);r.anim.onComplete.subscribe(function(){z&&h.call(r,r.panels,q,y,v,w);r.anim=null;p()});r.anim.animate()}function n(e,k,p,q,s){var r=this.config.steps;
k=this.length;var u=p?k-1:0,t=(u+1)*r;for(r=u*r;r<t;r++){e[r].style.position=g;e[r].style[q]=(p?"-":i)+s*k+d}return p?s:-s*k}function h(e,k,p,q,s){var r=this.config.steps;k=this.length;var u=p?k-1:0,t=(u+1)*r;for(r=u*r;r<t;r++){e[r].style.position=i;e[r].style[q]=i}this.content.style[q]=p?-s*(k-1)+d:i}var g="relative",l="left",j="top",d="px",i="",o="forward",f="backward",a="scrollx",b=c.Switchable;c.mix(b.Config,{circular:false});b.Plugins.push({name:"circular",init:function(e){e=e.config;if(e.circular&&
(e.effect===a||e.effect==="scrolly")){e.scrollType=e.effect;e.effect=m}}})});
KISSY.add("switchable-lazyload",function(c){var m=c.DOM,n="beforeSwitch",h="img-src",g="textarea-data",l={},j=c.Switchable,d=c.DataLazyload;l[h]="data-lazyload-src-custom";l[g]="ks-datalazyload-custom";c.mix(j.Config,{lazyDataType:"",lazyDataFlag:""});j.Plugins.push({name:"autoplay",init:function(i){function o(k){var p=a.steps;k=k.toIndex*p;d.loadCustomLazyData(i.panels.slice(k,k+p),b,e);f()&&i.detach(n,o)}function f(){var k,p,q;if(b===h){k=c.query("img",i.container);p=0;for(q=k.length;p<q;p++)if(m.attr(k[p],
e))return false}else if(b===g){k=c.query("textarea",i.container);p=0;for(q=k.length;p<q;p++)if(m.hasClass(k[p],e))return false}return true}var a=i.config,b=a.lazyDataType,e=a.lazyDataFlag||l[b];!d||!b||!e||i.on(n,o)}})});KISSY.add("tabs",function(c){function m(n,h){if(!(this instanceof m))return new m(n,h);m.superclass.constructor.call(this,n,h)}c.extend(m,c.Switchable);c.Tabs=m});
KISSY.add("slide",function(c){function m(h,g){if(!(this instanceof m))return new m(h,g);g=c.merge(n,g||{});m.superclass.constructor.call(this,h,g)}var n={autoplay:true,circular:true};c.extend(m,c.Switchable);c.Slide=m});KISSY.add("carousel",function(c){function m(h,g){if(!(this instanceof m))return new m(h,g);g=c.merge(n,g||{});m.superclass.constructor.call(this,h,g)}var n={circular:true};c.extend(m,c.Switchable);c.Carousel=m});
