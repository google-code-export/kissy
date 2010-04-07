/*
Copyright 2010, KISSY UI Library v1.0.5
MIT Licensed
build: 528 Apr 7 08:20
*/
KISSY.add("datalazyload",function(e,n){function m(a,b){if(!(this instanceof m))return new m(a,b);if(b===n){b=a;a=[d]}e.isArray(a)||(a=[e.get(a)||d]);this.containers=a;this.config=e.merge(h,b||{});this.callbacks={els:[],fns:[]};this._init()}var j=e.DOM,o=e.Event,q=YAHOO.util.Dom,p=window,d=document,f={AUTO:"auto",MANUAL:"manual"},h={mod:f.MANUAL,diff:"default",placeholder:"http://a.tbcdn.cn/kissy/1.0.4/build/datalazyload/dot.gif"},k=m.prototype;e.mix(k,{_init:function(){this.threshold=this._getThreshold();
this._filterItems();this._getItemsLength()&&this._initLoadEvent()},_initLoadEvent:function(){function a(){c||(c=setTimeout(function(){b();c=null},100))}function b(){g._loadItems();if(g._getItemsLength()===0){o.remove(p,"scroll",a);o.remove(p,"resize",a)}}var c,g=this;o.on(p,"scroll",a);o.on(p,"resize",function(){g.threshold=g._getThreshold();a()});g._getItemsLength()&&e.ready(function(){b()})},_filterItems:function(){var a=this.containers,b=this.threshold,c=this.config.placeholder,g=this.config.mod===
f.MANUAL,i,r,s,l,u,t,v,w=[],x=[];i=0;for(r=a.length;i<r;++i){s=e.query("img",a[i]);l=0;for(u=s.length;l<u;++l){t=s[l];v=t.getAttribute("data-lazyload-src");if(g){if(v){t.src=c;w.push(t)}}else if(q.getY(t)>b&&!v){t.setAttribute("data-lazyload-src",t.src);t.src=c;w.push(t)}}s=e.query("textarea",a[i]);l=0;for(u=s.length;l<u;++l){t=s[l];j.hasClass(t,"ks-datalazyload")&&x.push(t)}}this.images=w;this.areaes=x},_loadItems:function(){this._loadImgs();this._loadAreaes();this._fireCallbacks()},_loadImgs:function(){var a=
this.images,b=this.threshold+q.getDocumentScrollTop(),c,g,i=[];for(c=0;g=a[c++];)q.getY(g)<=b?this._loadImgSrc(g):i.push(g);this.images=i},_loadImgSrc:function(a,b){b=b||"data-lazyload-src";var c=a.getAttribute(b);if(c&&a.src!=c){a.src=c;a.removeAttribute(b)}},_loadAreaes:function(){var a=this.areaes,b=this.threshold+q.getDocumentScrollTop(),c,g,i,r=[];for(c=0;g=a[c++];){i=g;if(q.getY(i)===n)i=g.parentNode;q.getY(i)<=b?this._loadDataFromArea(g.parentNode,g):r.push(g)}this.areaes=r},_loadDataFromArea:function(a,
b){var c=j.create(b.value);b.style.display="none";b.value="";b.className="";a.insertBefore(c,b);e.UA.gecko||e.query("script",c).each(function(g){e.globalEval(g.text)})},_fireCallbacks:function(){var a=this.callbacks,b=a.els,c=a.fns,g=this.threshold+q.getDocumentScrollTop(),i,r,s,l=[],u=[];for(i=0;(r=b[i])&&(s=c[i++]);)if(q.getY(r)<=g)s.call(r);else{l.push(r);u.push(s)}a.els=l;a.fns=u},addCallback:function(a,b){if((a=e.get(a))&&typeof b==="function"){this.callbacks.els.push(a);this.callbacks.fns.push(b)}},
_getThreshold:function(){var a=this.config.diff,b=q.getViewportHeight();return a==="default"?2*b:b+a},_getItemsLength:function(){return this.images.length+this.areaes.length+this.callbacks.els.length},loadCustomLazyData:function(a,b,c){var g=this,i,r;e.isArray(a)||(a=[e.get(a)]);e.each(a,function(s){switch(b){case "textarea-data":if((i=e.get("textarea",s))&&j.hasClass(i,c||"ks-datalazyload-custom"))g._loadDataFromArea(s,i);break;default:r=s.nodeName==="IMG"?[s]:e.query("img",s);s=0;for(var l=r.length;s<
l;s++)g._loadImgSrc(r[s],c||"data-lazyload-src-custom")}})}});e.mix(m,k,true,["loadCustomLazyData","_loadImgSrc","_loadDataFromArea"]);e.DataLazyload=m});
KISSY.add("suggest",function(e,n){function m(a,b,c){if(!(this instanceof m))return new m(a,b,c);this.textInput=e.get(a);this.dataSource=b;this.JSONDataSource=e.isPlainObject(b)?b:null;this.returnedData=null;this.config=e.merge(k,c||{});this.container=null;this.queryParams=this.query="";this._timer=null;this._isRunning=false;this.dataScript=null;this._dataCache={};this._latestScriptTime="";this._onKeyboardSelecting=this._scriptDataIsOut=false;this.selectedItem=null;this._init()}var j=YAHOO.util.Dom,
o=e.DOM,q=e.Event,p=window,d=document,f=d.getElementsByTagName("head")[0],h=YAHOO.env.ua.ie,k={containerCls:"",containerWidth:"auto",resultFormat:"约%result%条结果",showCloseBtn:false,closeBtnText:"关闭",useShim:h===6,timerDelay:200,autoFocus:false,submitFormOnClickSelect:true};e.mix(m.prototype,{_init:function(){this._initTextInput();this._initContainer();this.config.useShim&&this._initShim();this._initStyle();this._initResizeEvent()},_initTextInput:function(){var a=this;a.textInput.setAttribute("autocomplete",
"off");q.on(a.textInput,"blur",function(){a.stop();a.hide()});a.config.autoFocus&&a.textInput.focus();var b=0;q.on(a.textInput,"keydown",function(c){c=c.keyCode;switch(c){case 27:a.hide();a.textInput.value=a.query;a.query.length===0&&a.textInput.blur();break;case 13:a.textInput.blur();a._onKeyboardSelecting&&a.textInput.value==a._getSelectedItemKey()&&a.fire("itemSelect");a._submitForm();break;case 40:case 38:if(b++==0){a._isRunning&&a.stop();a._onKeyboardSelecting=true;a.selectItem(c===40)}else if(b==
3)b=0;break}if(c!=40&&c!=38){a._isRunning||a.start();a._onKeyboardSelecting=false}});q.on(a.textInput,"keyup",function(){b=0})},_initContainer:function(){var a=d.createElement("div"),b=this.config.containerCls;a.className="ks-suggest-container";if(b)a.className+=" "+b;a.style.position="absolute";a.style.visibility="hidden";this.container=a;this._setContainerRegion();this._initContainerEvent();d.body.insertBefore(a,d.body.firstChild)},_setContainerRegion:function(){var a=j.getRegion(this.textInput),
b=a.left,c=a.right-b-2;c=c>0?c:0;if(d.documentMode===7&&(h===7||h===8))b-=2;else e.UA.gecko&&b++;this.container.style.left=b+"px";this.container.style.top=a.bottom+"px";this.container.style.width=this.config.containerWidth=="auto"?c+"px":this.config.containerWidth},_initContainerEvent:function(){var a=this;q.on(a.container,"mousemove",function(c){c=c.target;if(c.nodeName!="LI")c=j.getAncestorByTagName(c,"li");if(j.isAncestor(a.container,c))if(c!=a.selectedItem){a._removeSelectedItem();a._setSelectedItem(c)}});
var b=null;a.container.onmousedown=function(c){b=c.target;a.textInput.onbeforedeactivate=function(){p.event.returnValue=false;a.textInput.onbeforedeactivate=null};return false};q.on(a.container,"mouseup",function(c){if(a._isInContainer([c.pageX,c.pageY])){c=c.target;if(c==b)if(c.className=="ks-suggest-close-btn")a.hide();else{if(c.nodeName!="LI")c=j.getAncestorByTagName(c,"li");if(j.isAncestor(a.container,c)){a._updateInputFromSelectItem(c);a.fire("itemSelect");a.textInput.blur();a._submitForm()}}}})},
_submitForm:function(){if(this.config.submitFormOnClickSelect){var a=this.textInput.form;if(a){if(d.createEvent){var b=d.createEvent("MouseEvents");b.initEvent("submit",true,false);a.dispatchEvent(b)}else d.createEventObject&&a.fireEvent("onsubmit");a.submit()}}},_isInContainer:function(a){var b=j.getRegion(this.container);return a[0]>=b.left&&a[0]<=b.right&&a[1]>=b.top&&a[1]<=b.bottom},_initShim:function(){var a=d.createElement("iframe");a.src="about:blank";a.className="ks-suggest-shim";a.style.position=
"absolute";a.style.visibility="hidden";a.style.border="none";this.container.shim=a;this._setShimRegion();d.body.insertBefore(a,d.body.firstChild)},_setShimRegion:function(){var a=this.container,b=a.shim;if(b){b.style.left=parseInt(a.style.left)-2+"px";b.style.top=a.style.top;b.style.width=parseInt(a.style.width)+2+"px"}},_initStyle:function(){var a=e.get("#ks-suggest-style");if(!a){a=d.createElement("style");a.id="ks-suggest-style";f.appendChild(a);if(a.styleSheet)a.styleSheet.cssText=".ks-suggest-container{background:white;border:1px solid #999;z-index:99999}.ks-suggest-shim{z-index:99998}.ks-suggest-container li{color:#404040;padding:1px 0 2px;font-size:12px;line-height:18px;float:left;width:100%}.ks-suggest-container li.selected{background-color:#39F;cursor:default}.ks-suggest-key{float:left;text-align:left;padding-left:5px}.ks-suggest-result{float:right;text-align:right;padding-right:5px;color:green}.ks-suggest-container li.selected span{color:#FFF;cursor:default}.ks-suggest-bottom{padding:0 5px 5px}.ks-suggest-close-btn{float:right}.ks-suggest-container li,.suggest-bottom{overflow:hidden;zoom:1;clear:both}.ks-suggest-container{*margin-left:2px;_margin-left:-2px;_margin-top:-3px}";
else a.appendChild(d.createTextNode(".ks-suggest-container{background:white;border:1px solid #999;z-index:99999}.ks-suggest-shim{z-index:99998}.ks-suggest-container li{color:#404040;padding:1px 0 2px;font-size:12px;line-height:18px;float:left;width:100%}.ks-suggest-container li.selected{background-color:#39F;cursor:default}.ks-suggest-key{float:left;text-align:left;padding-left:5px}.ks-suggest-result{float:right;text-align:right;padding-right:5px;color:green}.ks-suggest-container li.selected span{color:#FFF;cursor:default}.ks-suggest-bottom{padding:0 5px 5px}.ks-suggest-close-btn{float:right}.ks-suggest-container li,.suggest-bottom{overflow:hidden;zoom:1;clear:both}.ks-suggest-container{*margin-left:2px;_margin-left:-2px;_margin-top:-3px}"))}},
_initResizeEvent:function(){var a=this,b;q.on(p,"resize",function(){b&&clearTimeout(b);b=setTimeout(function(){a._setContainerRegion();a._setShimRegion()},50)})},start:function(){var a=this;m.focusInstance=a;a._timer=setTimeout(function(){a.updateContent();a._timer=setTimeout(arguments.callee,a.config.timerDelay)},a.config.timerDelay);a._isRunning=true},stop:function(){m.focusInstance=null;clearTimeout(this._timer);this._isRunning=false},show:function(){if(!this.isVisible()){var a=this.container,
b=a.shim;a.style.visibility="";if(b){if(!b.style.height){a=j.getRegion(a);b.style.height=a.bottom-a.top-2+"px"}b.style.visibility=""}}},hide:function(){if(this.isVisible()){var a=this.container,b=a.shim;if(b)b.style.visibility="hidden";a.style.visibility="hidden"}},isVisible:function(){return this.container.style.visibility!="hidden"},updateContent:function(){if(this._needUpdate()){this._updateQueryValueFromInput();var a=this.query;if(e.trim(a).length)if(this._dataCache[a]!==n){this.returnedData=
"using cache";this._fillContainer(this._dataCache[a]);this._displayContainer()}else this.JSONDataSource?this.handleResponse(this.JSONDataSource[a]):this.requestData();else{this._fillContainer("");this.hide()}}},_needUpdate:function(){return this.textInput.value!=this.query},requestData:function(){var a=this;if(!h)a.dataScript=null;if(!a.dataScript){var b=d.createElement("script");b.charset="utf-8";f.insertBefore(b,f.firstChild);a.dataScript=b;if(!h){var c=(new Date).getTime();a._latestScriptTime=
c;b.setAttribute("time",c);q.on(b,"load",function(){a._scriptDataIsOut=b.getAttribute("time")!=a._latestScriptTime})}}a.queryParams="q="+encodeURIComponent(a.query)+"&code=utf-8&callback=g_ks_suggest_callback";a.fire("dataRequest");a.dataScript.src=a.dataSource+"?"+a.queryParams},handleResponse:function(a){if(!this._scriptDataIsOut){this.returnedData=a;this.fire("dataReturn");this.returnedData=this.formatData(this.returnedData);var b="";a=this.returnedData.length;if(a>0){b=d.createElement("ol");for(var c=
0;c<a;++c){var g=this.returnedData[c],i=this.formatItem(g.key,g.result);i.setAttribute("key",g.key);o.addClass(i,c%2?"even":"odd");b.appendChild(i)}b=b}this._fillContainer(b);a>0&&this.appendBottom();e.trim(this.container.innerHTML)&&this.fire("show");this._dataCache[this.query]=this.container.innerHTML;this._displayContainer()}},formatData:function(a){var b=[];if(!a)return b;if(e.isArray(a.result))a=a.result;var c=a.length;if(!c)return b;for(var g,i=0;i<c;++i){g=a[i];b[i]=typeof g==="string"?{key:g}:
e.isArray(g)&&g.length>=2?{key:g[0],result:g[1]}:g}return b},formatItem:function(a,b){var c=d.createElement("li"),g=d.createElement("span");g.className="ks-suggest-key";g.appendChild(d.createTextNode(a));c.appendChild(g);if(b!==n){a=this.config.resultFormat.replace("%result%",b);if(e.trim(a)){b=d.createElement("span");b.className="ks-suggest-result";b.appendChild(d.createTextNode(a));c.appendChild(b)}}return c},appendBottom:function(){var a=d.createElement("div");a.className="ks-suggest-bottom";if(this.config.showCloseBtn){var b=
d.createElement("a");b.href="javascript: void(0)";b.setAttribute("target","_self");b.className="ks-suggest-close-btn";b.appendChild(d.createTextNode(this.config.closeBtnText));a.appendChild(b)}e.trim(a.innerHTML)&&this.container.appendChild(a)},_fillContainer:function(a){if(a.nodeType==1){this.container.innerHTML="";this.container.appendChild(a)}else this.container.innerHTML=a;this.selectedItem=null},_displayContainer:function(){e.trim(this.container.innerHTML)?this.show():this.hide()},selectItem:function(a){var b=
this.container.getElementsByTagName("li");if(b.length!=0)if(this.isVisible()){if(this.selectedItem){a=j[a?"getNextSibling":"getPreviousSibling"](this.selectedItem);if(!a)this.textInput.value=this.query}else a=b[a?0:b.length-1];this._removeSelectedItem();if(a){this._setSelectedItem(a);this._updateInputFromSelectItem()}}else this.show()},_removeSelectedItem:function(){o.removeClass(this.selectedItem,"selected");this.selectedItem=null},_setSelectedItem:function(a){o.addClass(a,"selected");this.selectedItem=
a},_getSelectedItemKey:function(){if(!this.selectedItem)return"";return this.selectedItem.getAttribute("key")},_updateQueryValueFromInput:function(){this.query=this.textInput.value},_updateInputFromSelectItem:function(){this.textInput.value=this._getSelectedItemKey(this.selectedItem)}});e.mix(m.prototype,e.EventTarget);p.g_ks_suggest_callback=function(a){m.focusInstance&&setTimeout(function(){m.focusInstance.handleResponse(a)},0)};e.Suggest=m});
KISSY.add("switchable",function(e,n){function m(d,f){f=f||{};if(!("mackupType"in f))if(f.panelCls)f.mackupType=1;else if(f.panels)f.mackupType=2;f=e.merge(m.Config,f);this.container=e.get(d);this.config=f;this.triggers=this.triggers||[];this.panels=this.panels||[];if(this.activeIndex===n)this.activeIndex=f.activeIndex;this._init()}var j=e.DOM,o=e.Event,q=document,p=m.prototype;m.Config={mackupType:0,navCls:"ks-switchable-nav",contentCls:"ks-switchable-content",triggerCls:"ks-switchable-trigger",panelCls:"ks-switchable-panel",
triggers:[],panels:[],hasTriggers:true,triggerType:"mouse",delay:0.1,activeIndex:0,activeTriggerCls:"active",steps:1,viewSize:[]};m.Plugins=[];e.mix(p,{_init:function(){var d=this,f=d.config;d.panels.length===0&&d._parseMackup();f.hasTriggers&&d._bindTriggers();e.each(m.Plugins,function(h){h.init&&h.init(d)})},_parseMackup:function(){var d=this.container,f=this.config,h=f.hasTriggers,k,a=[],b=[];switch(f.mackupType){case 0:if(k=e.get("."+f.navCls,d))a=j.children(k);k=e.get("."+f.contentCls,d);b=j.children(k);
break;case 1:a=e.query("."+f.triggerCls,d);b=e.query("."+f.panelCls,d);break;case 2:a=f.triggers;b=f.panels;break}d=b.length;this.length=d/f.steps;if(h&&d>0&&a.length===0)a=this._generateTriggersMackup(this.length);if(h){f=0;for(h=a.length;f<h;f++)this.triggers.push(a[f])}for(f=0;f<d;f++)this.panels.push(b[f]);this.content=k||b[0].parentNode},_generateTriggersMackup:function(d){var f=this.config,h=q.createElement("UL"),k,a;h.className=f.navCls;for(a=0;a<d;a++){k=q.createElement("LI");if(a===this.activeIndex)k.className=
f.activeTriggerCls;k.innerHTML=a+1;h.appendChild(k)}this.container.appendChild(h);return j.children(h)},_bindTriggers:function(){var d=this,f=d.config,h=d.triggers,k,a,b=h.length;for(a=0;a<b;a++)(function(c){k=h[c];o.on(k,"click focus",function(){d._onFocusTrigger(c)});if(f.triggerType==="mouse"){o.on(k,"mouseenter",function(){d._onMouseEnterTrigger(c)});o.on(k,"mouseleave",function(){d._onMouseLeaveTrigger(c)})}})(a)},_onFocusTrigger:function(d){if(this.activeIndex!==d){this.switchTimer&&this.switchTimer.cancel();
this.switchTo(d)}},_onMouseEnterTrigger:function(d){var f=this;if(f.activeIndex!==d)f.switchTimer=e.later(function(){f.switchTo(d)},f.config.delay*1E3)},_onMouseLeaveTrigger:function(){this.switchTimer&&this.switchTimer.cancel()},switchTo:function(d,f){var h=this.config,k=this.triggers,a=this.panels,b=this.activeIndex,c=h.steps,g=b*c,i=d*c;if(d===b)return this;if(this.fire("beforeSwitch",{toIndex:d})===false)return this;if(h.hasTriggers)this._switchTrigger(b>-1?k[b]:null,k[d]);if(f===n)f=d>b?"forward":
"forward";this._switchView(a.slice(g,g+c),a.slice(i,i+c),d,f);this.activeIndex=d;return this},_switchTrigger:function(d,f){var h=this.config.activeTriggerCls;d&&j.removeClass(d,h);j.addClass(f,h)},_switchView:function(d,f){j.css(d,"display","none");j.css(f,"display","block");this.fire("switch")},prev:function(){var d=this.activeIndex;this.switchTo(d>0?d-1:this.length-1,"backward")},next:function(){var d=this.activeIndex;this.switchTo(d<this.length-1?d+1:0,"forward")}});e.mix(p,e.EventTarget);e.Switchable=
m});
KISSY.add("switchable-autoplay",function(e){var n=e.Event,m=e.Switchable;e.mix(m.Config,{autoplay:false,interval:5,pauseOnHover:true});m.Plugins.push({name:"autoplay",init:function(j){var o=j.config;if(o.autoplay){if(o.pauseOnHover){n.on(j.container,"mouseenter",function(){j.paused=true});n.on(j.container,"mouseleave",function(){setTimeout(function(){j.paused=false},o.interval*1E3)})}j.autoplayTimer=e.later(function(){j.paused||j.switchTo(j.activeIndex<j.length-1?j.activeIndex+1:0)},o.interval*1E3,
true)}}})});
KISSY.add("switchable-effect",function(e){var n=YAHOO.util,m=e.DOM,j=n.Dom,o=e.Switchable,q;e.mix(o.Config,{effect:"none",duration:0.5,easing:n.Easing.easeNone});o.Effects={none:function(p,d,f){m.css(p,"display","none");m.css(d,"display","block");f()},fade:function(p,d,f){p.length!==1&&e.error("fade effect only supports steps == 1.");var h=this,k=h.config,a=p[0],b=d[0];h.anim&&h.anim.stop();j.setStyle(b,"opacity",1);h.anim=new n.Anim(a,{opacity:{to:0}},k.duration,k.easing);h.anim.onComplete.subscribe(function(){h.anim=null;
j.setStyle(b,"z-index",9);j.setStyle(a,"z-index",1);f()});h.anim.animate()},scroll:function(p,d,f,h){var k=this;p=k.config;d=p.effect==="scrollx";var a={};a[d?"left":"top"]={to:-(k.viewSize[d?0:1]*h)};k.anim&&k.anim.stop();k.anim=new n.Anim(k.content,a,p.duration,p.easing);k.anim.onComplete.subscribe(function(){k.anim=null;f()});k.anim.animate()}};q=o.Effects;q.scrollx=q.scrolly=q.scroll;o.Plugins.push({name:"effect",init:function(p){var d=p.config,f=d.effect,h=p.panels,k=d.steps,a=p.activeIndex*
k,b=a+k-1,c=h.length;p.viewSize=[d.viewSize[0]||h[0].offsetWidth*k,d.viewSize[0]||h[0].offsetHeight*k];if(f!=="none"){for(d=0;d<c;d++)h[d].style.display="block";switch(f){case "scrollx":case "scrolly":p.content.style.position="absolute";p.content.parentNode.style.position="relative";if(f==="scrollx"){j.setStyle(h,"float","left");p.content.style.width=p.viewSize[0]*(c/k)+"px"}break;case "fade":for(d=0;d<c;d++){j.setStyle(h[d],"opacity",d>=a&&d<=b?1:0);h[d].style.position="absolute";h[d].style.zIndex=
d>=a&&d<=b?9:1}break}}}});e.mix(o.prototype,{_switchView:function(p,d,f,h){var k=this,a=k.config.effect;(e.isFunction(a)?a:q[a]).call(k,p,d,function(){k.fire("switch")},f,h)}})});
KISSY.add("switchable-circular",function(e){function n(c,g,i,r,s){var l=this;c=l.config;g=l.length;var u=l.activeIndex,t=c.scrollType===a,v=t?q:p,w=l.viewSize[t?0:1];t=-w*r;var x={},z,y=s===k;if(z=y&&u===0&&r===g-1||s===h&&u===g-1&&r===0)t=m.call(l,l.panels,r,y,v,w);x[v]={to:t};l.anim&&l.anim.stop();l.anim=new YAHOO.util.Anim(l.content,x,c.duration,c.easing);l.anim.onComplete.subscribe(function(){z&&j.call(l,l.panels,r,y,v,w);l.anim=null;i()});l.anim.animate()}function m(c,g,i,r,s){var l=this.config.steps;
g=this.length;var u=i?g-1:0,t=(u+1)*l;for(l=u*l;l<t;l++){c[l].style.position=o;c[l].style[r]=(i?"-":f)+s*g+d}return i?s:-s*g}function j(c,g,i,r,s){var l=this.config.steps;g=this.length;var u=i?g-1:0,t=(u+1)*l;for(l=u*l;l<t;l++){c[l].style.position=f;c[l].style[r]=f}this.content.style[r]=i?-s*(g-1)+d:f}var o="relative",q="left",p="top",d="px",f="",h="forward",k="backward",a="scrollx",b=e.Switchable;e.mix(b.Config,{circular:false});b.Plugins.push({name:"circular",init:function(c){c=c.config;if(c.circular&&
(c.effect===a||c.effect==="scrolly")){c.scrollType=c.effect;c.effect=n}}})});
KISSY.add("switchable-lazyload",function(e){var n=e.DOM,m="beforeSwitch",j="img-src",o="textarea-data",q={},p=e.Switchable,d=e.DataLazyload;q[j]="data-lazyload-src-custom";q[o]="ks-datalazyload-custom";e.mix(p.Config,{lazyDataType:"",lazyDataFlag:""});p.Plugins.push({name:"autoplay",init:function(f){function h(g){var i=a.steps;g=g.toIndex*i;d.loadCustomLazyData(f.panels.slice(g,g+i),b,c);k()&&f.detach(m,h)}function k(){var g,i,r;if(b===j){g=e.query("img",f.container);i=0;for(r=g.length;i<r;i++)if(n.attr(g[i],
c))return false}else if(b===o){g=e.query("textarea",f.container);i=0;for(r=g.length;i<r;i++)if(n.hasClass(g[i],c))return false}return true}var a=f.config,b=a.lazyDataType,c=a.lazyDataFlag||q[b];!d||!b||!c||f.on(m,h)}})});KISSY.add("tabs",function(e){function n(m,j){if(!(this instanceof n))return new n(m,j);n.superclass.constructor.call(this,m,j)}e.extend(n,e.Switchable);e.Tabs=n});
KISSY.add("slide",function(e){function n(j,o){if(!(this instanceof n))return new n(j,o);o=e.merge(m,o||{});n.superclass.constructor.call(this,j,o)}var m={autoplay:true,circular:true};e.extend(n,e.Switchable);e.Slide=n});KISSY.add("carousel",function(e){function n(j,o){if(!(this instanceof n))return new n(j,o);o=e.merge(m,o||{});n.superclass.constructor.call(this,j,o)}var m={circular:true};e.extend(n,e.Switchable);e.Carousel=n});
