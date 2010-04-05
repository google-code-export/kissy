/*
Copyright 2010, KISSY UI Library v1.0.5
MIT Licensed
build: 522 Apr 5 22:24
*/
KISSY.add("switchable",function(c,h){function o(a,b){b=b||{};if(!("mackupType"in b))if(b.panelCls)b.mackupType=1;else if(b.panels)b.mackupType=2;b=c.merge(o.Config,b);this.container=c.get(a);this.config=b;this.triggers=this.triggers||[];this.panels=this.panels||[];if(this.activeIndex===h)this.activeIndex=b.activeIndex;this._init()}var f=c.DOM,j=c.Event,r=document,m=o.prototype;o.Config={mackupType:0,navCls:"ks-switchable-nav",contentCls:"ks-switchable-content",triggerCls:"ks-switchable-trigger",panelCls:"ks-switchable-panel",
triggers:[],panels:[],hasTriggers:true,triggerType:"mouse",delay:0.1,activeIndex:0,activeTriggerCls:"active",steps:1,viewSize:[]};o.Plugins=[];c.mix(m,{_init:function(){var a=this,b=a.config;a.panels.length===0&&a._parseMackup();b.hasTriggers&&a._bindTriggers();c.each(o.Plugins,function(d){d.init&&d.init(a)})},_parseMackup:function(){var a=this.container,b=this.config,d=b.hasTriggers,e,g=[],l=[];switch(b.mackupType){case 0:if(e=c.get("."+b.navCls,a))g=f.children(e);e=c.get("."+b.contentCls,a);l=f.children(e);
break;case 1:g=c.query("."+b.triggerCls,a);l=c.query("."+b.panelCls,a);break;case 2:g=b.triggers;l=b.panels;break}a=l.length;this.length=a/b.steps;if(d&&a>0&&g.length===0)g=this._generateTriggersMackup(this.length);if(d){b=0;for(d=g.length;b<d;b++)this.triggers.push(g[b])}for(b=0;b<a;b++)this.panels.push(l[b]);this.content=e||l[0].parentNode},_generateTriggersMackup:function(a){var b=this.config,d=r.createElement("UL"),e,g;d.className=b.navCls;for(g=0;g<a;g++){e=r.createElement("LI");if(g===this.activeIndex)e.className=
b.activeTriggerCls;e.innerHTML=g+1;d.appendChild(e)}this.container.appendChild(d);return f.children(d)},_bindTriggers:function(){var a=this,b=a.config,d=a.triggers,e,g,l=d.length;for(g=0;g<l;g++)(function(i){e=d[i];j.on(e,"click",function(){a._onFocusTrigger(i)});j.on(e,"focus",function(){a._onFocusTrigger(i)});if(b.triggerType==="mouse"){j.on(e,"mouseenter",function(){a._onMouseEnterTrigger(i)});j.on(e,"mouseleave",function(){a._onMouseLeaveTrigger(i)})}})(g)},_onFocusTrigger:function(a){if(this.activeIndex!==
a){this.switchTimer&&this.switchTimer.cancel();this.switchTo(a)}},_onMouseEnterTrigger:function(a){var b=this;if(b.activeIndex!==a)b.switchTimer=c.later(function(){b.switchTo(a)},b.config.delay*1E3)},_onMouseLeaveTrigger:function(){this.switchTimer&&this.switchTimer.cancel()},switchTo:function(a,b){var d=this.config,e=this.triggers,g=this.panels,l=this.activeIndex,i=d.steps,n=l*i,p=a*i;if(a===l)return this;if(this.fire("beforeSwitch",{toIndex:a})===false)return this;if(d.hasTriggers)this._switchTrigger(l>
-1?e[l]:null,e[a]);if(b===h)b=a>l?"forward":"forward";this._switchView(g.slice(n,n+i),g.slice(p,p+i),a,b);this.activeIndex=a;return this},_switchTrigger:function(a,b){var d=this.config.activeTriggerCls;a&&f.removeClass(a,d);f.addClass(b,d)},_switchView:function(a,b){f.css(a,"display","none");f.css(b,"display","block");this.fire("switch")},prev:function(){var a=this.activeIndex;this.switchTo(a>0?a-1:this.length-1,"backward")},next:function(){var a=this.activeIndex;this.switchTo(a<this.length-1?a+1:
0,"forward")}});c.mix(m,c.EventTarget);c.Switchable=o});
KISSY.add("switchable-autoplay",function(c){var h=c.Event,o=c.Switchable;c.mix(o.Config,{autoplay:false,interval:5,pauseOnHover:true});o.Plugins.push({name:"autoplay",init:function(f){var j=f.config;if(j.autoplay){if(j.pauseOnHover){h.on(f.container,"mouseenter",function(){f.paused=true});h.on(f.container,"mouseleave",function(){setTimeout(function(){f.paused=false},j.interval*1E3)})}f.autoplayTimer=c.later(function(){f.paused||f.switchTo(f.activeIndex<f.length-1?f.activeIndex+1:0)},j.interval*1E3,
true)}}})});
KISSY.add("switchable-effect",function(c){var h=YAHOO.util,o=c.DOM,f=h.Dom,j=c.Switchable,r;c.mix(j.Config,{effect:"none",duration:0.5,easing:h.Easing.easeNone});j.Effects={none:function(m,a,b){o.css(m,"display","none");o.css(a,"display","block");b()},fade:function(m,a,b){m.length!==1&&c.error("fade effect only supports steps == 1.");var d=this,e=d.config,g=m[0],l=a[0];d.anim&&d.anim.stop();f.setStyle(l,"opacity",1);d.anim=new h.Anim(g,{opacity:{to:0}},e.duration,e.easing);d.anim.onComplete.subscribe(function(){d.anim=null;
f.setStyle(l,"z-index",9);f.setStyle(g,"z-index",1);b()});d.anim.animate()},scroll:function(m,a,b,d){var e=this;m=e.config;a=m.effect==="scrollx";var g={};g[a?"left":"top"]={to:-(e.viewSize[a?0:1]*d)};e.anim&&e.anim.stop();e.anim=new h.Anim(e.content,g,m.duration,m.easing);e.anim.onComplete.subscribe(function(){e.anim=null;b()});e.anim.animate()}};r=j.Effects;r.scrollx=r.scrolly=r.scroll;j.Plugins.push({name:"effect",init:function(m){var a=m.config,b=a.effect,d=m.panels,e=a.steps,g=m.activeIndex*
e,l=g+e-1,i=d.length;m.viewSize=[a.viewSize[0]||d[0].offsetWidth*e,a.viewSize[0]||d[0].offsetHeight*e];if(b!=="none"){for(a=0;a<i;a++)d[a].style.display="block";switch(b){case "scrollx":case "scrolly":m.content.style.position="absolute";m.content.parentNode.style.position="relative";if(b==="scrollx"){f.setStyle(d,"float","left");m.content.style.width=m.viewSize[0]*(i/e)+"px"}break;case "fade":for(a=0;a<i;a++){f.setStyle(d[a],"opacity",a>=g&&a<=l?1:0);d[a].style.position="absolute";d[a].style.zIndex=
a>=g&&a<=l?9:1}break}}}});c.mix(j.prototype,{_switchView:function(m,a,b,d){var e=this,g=e.config.effect;(typeof g==="function"?g:r[g]).call(e,m,a,function(){e.fire("switch")},b,d)}})});
KISSY.add("switchable-circular",function(c){function h(i,n,p,q,t){var k=this;i=k.config;n=k.length;var u=k.activeIndex,s=i.scrollType===g,v=s?r:m,w=k.viewSize[s?0:1];s=-w*q;var y={},z,x=t===e;if(z=x&&u===0&&q===n-1||t===d&&u===n-1&&q===0)s=o.call(k,k.panels,q,x,v,w);y[v]={to:s};k.anim&&k.anim.stop();k.anim=new YAHOO.util.Anim(k.content,y,i.duration,i.easing);k.anim.onComplete.subscribe(function(){z&&f.call(k,k.panels,q,x,v,w);k.anim=null;p()});k.anim.animate()}function o(i,n,p,q,t){var k=this.config.steps;
n=this.length;var u=p?n-1:0,s=(u+1)*k;for(k=u*k;k<s;k++){i[k].style.position=j;i[k].style[q]=(p?"-":b)+t*n+a}return p?t:-t*n}function f(i,n,p,q,t){var k=this.config.steps;n=this.length;var u=p?n-1:0,s=(u+1)*k;for(k=u*k;k<s;k++){i[k].style.position=b;i[k].style[q]=b}this.content.style[q]=p?-t*(n-1)+a:b}var j="relative",r="left",m="top",a="px",b="",d="forward",e="backward",g="scrollx",l=c.Switchable;c.mix(l.Config,{circular:false});l.Plugins.push({name:"circular",init:function(i){i=i.config;if(i.circular&&
(i.effect===g||i.effect==="scrolly")){i.scrollType=i.effect;i.effect=h}}})});
KISSY.add("switchable-lazyload",function(c){var h=c.DOM,o="beforeSwitch",f="img-src",j="textarea-data",r={},m=c.Switchable,a=c.DataLazyload;r[f]="data-lazyload-src-custom";r[j]="ks-datalazyload-custom";c.mix(m.Config,{lazyDataType:"",lazyDataFlag:""});m.Plugins.push({name:"autoplay",init:function(b){function d(n){var p=g.steps;n=n.toIndex*p;a.loadCustomLazyData(b.panels.slice(n,n+p),l,i);e()&&b.detach(o,d)}function e(){var n,p,q;if(l===f){n=c.query("img",b.container);p=0;for(q=n.length;p<q;p++)if(h.attr(n[p],
i))return false}else if(l===j){n=c.query("textarea",b.container);p=0;for(q=n.length;p<q;p++)if(h.hasClass(n[p],i))return false}return true}var g=b.config,l=g.lazyDataType,i=g.lazyDataFlag||r[l];!a||!l||!i||b.on(o,d)}})});KISSY.add("tabs",function(c){function h(o,f){if(!(this instanceof h))return new h(o,f);h.superclass.constructor.call(this,o,f)}c.extend(h,c.Switchable);c.Tabs=h});
KISSY.add("slide",function(c){function h(f,j){if(!(this instanceof h))return new h(f,j);j=c.merge(o,j||{});h.superclass.constructor.call(this,f,j)}var o={autoplay:true,circular:true};c.extend(h,c.Switchable);c.Slide=h});KISSY.add("carousel",function(c){function h(f,j){if(!(this instanceof h))return new h(f,j);j=c.merge(o,j||{});h.superclass.constructor.call(this,f,j)}var o={circular:true};c.extend(h,c.Switchable);c.Carousel=h});
KISSY.add("album",function(c){function h(f,j){if(!(this instanceof h))return new h(f,j);j=c.merge(o,j||{});h.superclass.constructor.call(this,f,j)}var o={circular:true};c.extend(h,c.Switchable);c.Album=h});
