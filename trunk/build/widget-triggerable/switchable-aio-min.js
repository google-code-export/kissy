/*
Copyright (c) 2010, Kissy UI Library. All rights reserved.
MIT Licensed.
http://kissy.googlecode.com/

Date: 2009-12-30 20:19:58
Revision: 387
*/
KISSY.add("switchable",function(g){var c=YAHOO.util,i=c.Dom,o=c.Event,k=YAHOO.lang,l="undefined",d="display",a="block",n="none",b="forward",f="backward",j="switchable",m="beforeSwitch",h="onSwitch",e="ks-switchable-";function p(){}p.Config={mackupType:0,navCls:e+"nav",contentCls:e+"content",triggerCls:e+"trigger",panelCls:e+"panel",triggers:[],panels:[],hasTriggers:true,triggerType:"mouse",delay:0.1,activeIndex:0,activeTriggerCls:"active",steps:1,viewSize:[]};g.Widget.prototype.switchable=function(r){var q=this;r=r||{};if(!("mackupType" in r)){if(r.panelCls){r.mackupType=1}else{if(r.panels){r.mackupType=2}}}q.config[j]=g.merge(p.Config,r||{});q.triggers=q.triggers||[];q.panels=q.panels||[];if(typeof q.activeIndex===l){q.activeIndex=q.config[j].activeIndex}g.mix(q,p.prototype,false);q._initSwitchable();return q};g.mix(p.prototype,{_initSwitchable:function(){var r=this,q=r.config[j];if(r.panels.length===0){r._parseSwitchableMackup()}r.createEvent(m);r.createEvent(h);if(q.hasTriggers){r._bindTriggers()}},_parseSwitchableMackup:function(){var A=this,r=A.container,v=A.config[j],B=v.hasTriggers,q,w,y=[],x=[],u,s,t,z=i.getElementsByClassName;switch(v.mackupType){case 0:q=z(v.navCls,"*",r)[0];if(q){y=i.getChildren(q)}w=z(v.contentCls,"*",r)[0];x=i.getChildren(w);break;case 1:y=z(v.triggerCls,"*",r);x=z(v.panelCls,"*",r);break;case 2:y=v.triggers;x=v.panels;break}s=x.length;A.length=s/v.steps;if(B&&s>0&&y.length===0){y=A._generateTriggersMackup(A.length)}if(B){for(u=0,t=y.length;u<t;u++){A.triggers.push(y[u])}}for(u=0;u<s;u++){A.panels.push(x[u])}A.content=w||x[0].parentNode},_generateTriggersMackup:function(r){var t=this,s=t.config[j],v=document.createElement("UL"),q,u;v.className=s.navCls;for(u=0;u<r;u++){q=document.createElement("LI");if(u===t.activeIndex){q.className=s.activeTriggerCls}q.innerHTML=u+1;v.appendChild(q)}t.container.appendChild(v);return i.getChildren(v)},_bindTriggers:function(){var s=this,r=s.config[j],v=s.triggers,t,u,q=v.length;for(u=0;u<q;u++){(function(w){t=v[w];o.on(t,"click",function(){s._onFocusTrigger(w)});o.on(t,"focus",function(){s._onFocusTrigger(w)});if(r.triggerType==="mouse"){o.on(t,"mouseenter",function(){s._onMouseEnterTrigger(w)});o.on(t,"mouseleave",function(){s._onMouseLeaveTrigger(w)})}})(u)}},_onFocusTrigger:function(r){var q=this;if(q.activeIndex===r){return}if(q.switchTimer){q.switchTimer.cancel()}q.switchTo(r)},_onMouseEnterTrigger:function(r){var q=this;if(q.activeIndex!==r){q.switchTimer=k.later(q.config[j].delay*1000,q,function(){q.switchTo(r)})}},_onMouseLeaveTrigger:function(){var q=this;if(q.switchTimer){q.switchTimer.cancel()}},switchTo:function(r,x){var y=this,s=y.config[j],u=y.triggers,t=y.panels,z=y.activeIndex,v=s.steps,w=z*v,q=r*v;if(r===z){return y}if(!y.fireEvent(m,r)){return y}if(s.hasTriggers){y._switchTrigger(z>-1?u[z]:null,u[r])}if(typeof x===l){x=r>z?b:b}y._switchView(t.slice(w,w+v),t.slice(q,q+v),r,x);y.activeIndex=r;return y},_switchTrigger:function(s,q){var r=this.config[j].activeTriggerCls;if(s){i.removeClass(s,r)}i.addClass(q,r)},_switchView:function(s,r,q){i.setStyle(s,d,n);i.setStyle(r,d,a);this.fireEvent(h,q)},prev:function(){var r=this,q=r.activeIndex;r.switchTo(q>0?q-1:r.length-1,f)},next:function(){var r=this,q=r.activeIndex;r.switchTo(q<r.length-1?q+1:0,b)}});g.augment(p,c.EventProvider);g.Switchable=p});KISSY.add("switchable-autoplay",function(c){var e=YAHOO.util,b=e.Event,d=YAHOO.lang,f="switchable",a=c.Switchable;c.mix(a.Config,{autoplay:false,interval:5,pauseOnHover:true});c.weave(function(){var h=this,g=h.config[f];if(!g.autoplay){return}if(g.pauseOnHover){b.on(h.container,"mouseenter",function(){h.paused=true});b.on(h.container,"mouseleave",function(){h.paused=false})}h.autoplayTimer=d.later(g.interval*1000,h,function(){if(h.paused){return}h.switchTo(h.activeIndex<h.length-1?h.activeIndex+1:0)},null,true)},"after",a.prototype,"_initSwitchable")});KISSY.add("switchable-effect",function(i){var d=YAHOO.util,j=d.Dom,l="switchable",h="display",a="block",n="none",p="opacity",g="z-index",k="relative",f="absolute",c="scrollx",b="scrolly",e="fade",o=i.Switchable,m;i.mix(o.Config,{effect:n,duration:0.5,easing:d.Easing.easeNone});o.Effects={none:function(r,q,s){j.setStyle(r,h,n);j.setStyle(q,h,a);s()},fade:function(v,q,w){if(v.length!==1){throw new Error("fade effect only supports steps == 1.")}var s=this,r=s.config[l],u=v[0],t=q[0];if(s.anim){s.anim.stop()}j.setStyle(t,p,1);s.anim=new d.Anim(u,{opacity:{to:0}},r.duration,r.easing);s.anim.onComplete.subscribe(function(){s.anim=null;j.setStyle(t,g,9);j.setStyle(u,g,1);w()});s.anim.animate()},scroll:function(u,r,w,s){var x=this,t=x.config[l],y=t.effect===c,v=x.viewSize[y?0:1]*s,q={};q[y?"left":"top"]={to:-v};if(x.anim){x.anim.stop()}x.anim=new d.Anim(x.content,q,t.duration,t.easing);x.anim.onComplete.subscribe(function(){x.anim=null;w()});x.anim.animate()}};m=o.Effects;m[c]=m[b]=m.scroll;i.weave(function(){var x=this,t=x.config[l],z=t.effect,u=x.panels,v=t.steps,y=x.activeIndex,w=y*v,q=w+v-1,r,s=u.length;x.viewSize=[t.viewSize[0]||u[0].offsetWidth*v,t.viewSize[0]||u[0].offsetHeight*v];if(z!==n){for(r=0;r<s;r++){u[r].style.display=a}switch(z){case c:case b:x.content.style.position=f;x.content.parentNode.style.position=k;if(z===c){j.setStyle(u,"float","left");this.content.style.width=x.viewSize[0]*(s/v)+"px"}break;case e:for(r=0;r<s;r++){j.setStyle(u[r],p,(r>=w&&r<=q)?1:0);u[r].style.position=f;u[r].style.zIndex=(r>=w&&r<=q)?9:1}break}}},"after",o.prototype,"_initSwitchable");i.mix(o.prototype,{_switchView:function(x,q,t,w){var s=this,r=s.config[l],v=r.effect,u=typeof v==="function"?v:m[v];u.call(s,x,q,function(){s.fireEvent("onSwitch",t)},t,w)}})});KISSY.add("switchable-circular",function(k){var e=YAHOO.util,m="switchable",l="relative",f="left",h="top",i="px",g="",d="forward",j="backward",c="scrollx",a="scrolly",o=k.Switchable;k.mix(o.Config,{circular:false});function p(y,s,C,v,A){var E=this,w=E.config[m],x=E.length,D=E.activeIndex,F=w.effect===c,q=F?f:h,u=E.viewSize[F?0:1],B=-u*v,r={},t,z=A===j;t=(z&&D===0&&v===x-1)||(A===d&&D===x-1&&v===0);if(t){B=b.call(E,E.panels,v,z,q,u)}r[q]={to:B};if(E.anim){E.anim.stop()}E.anim=new e.Anim(E.content,r,w.duration,w.easing);E.anim.onComplete.subscribe(function(){if(t){n.call(E,E.panels,v,z,q,u)}E.anim=null;C()});E.anim.animate()}function b(x,u,y,q,v){var C=this,w=C.config[m],z=w.steps,t=C.length,r=y?t-1:0,B=r*z,A=(r+1)*z,s;for(s=B;s<A;s++){x[s].style.position=l;x[s].style[q]=(y?"-":g)+v*t+i}return y?v:-v*t}function n(x,u,y,q,v){var C=this,w=C.config[m],z=w.steps,t=C.length,r=y?t-1:0,B=r*z,A=(r+1)*z,s;for(s=B;s<A;s++){x[s].style.position=g;x[s].style[q]=g}C.content.style[q]=y?-v*(t-1)+i:g}k.weave(function(){var r=this,q=r.config[m];if(q.circular&&(q.effect===c||q.effect===a)){q.effect=p}},"after",o.prototype,"_initSwitchable")});KISSY.add("switchable-lazyload",function(c){var a=YAHOO.util,d=a.Dom,e="switchable",g="beforeSwitch",h="img-src",f="textarea-data",i={},j=c.Switchable,b=c.DataLazyload;i[h]="data-lazyload-src-custom";i[f]="ks-datalazyload-custom";c.mix(j.Config,{lazyDataType:"",lazyDataFlag:""});c.weave(function(){var m=this,l=m.config[e],o=l.lazyDataType,k=l.lazyDataFlag||i[o];if(!b||!o||!k){return}m.subscribe(g,p);function p(r){var q=l.steps,t=r*q,s=t+q;b.loadCustomLazyData(m.panels.slice(t,s),o,k);if(n()){m.unsubscribe(g,p)}}function n(){var t,r,s,q;if(o===h){t=m.container.getElementsByTagName("img");for(s=0,q=t.length;s<q;s++){if(t[s].getAttribute(k)){return false}}}else{if(o===f){r=m.container.getElementsByTagName("textarea");for(s=0,q=r.length;s<q;s++){if(d.hasClass(r[s],k)){return false}}}}return true}},"after",j.prototype,"_initSwitchable")});KISSY.add("tabs",function(b){var c="switchable";function a(d,f){var e=this;if(!(e instanceof a)){return new a(d,f)}a.superclass.constructor.call(e,d,f);e.switchable(e.config);e.config=e.config[c];e.config[c]=e.config}b.extend(a,b.Widget);b.Tabs=a});KISSY.add("slide",function(b){var d="switchable",a={autoplay:true,circular:true};function c(e,g){var f=this;if(!(f instanceof c)){return new c(e,g)}g=b.merge(a,g||{});c.superclass.constructor.call(f,e,g);f.switchable(f.config);f.config=f.config[d];f.config[d]=f.config}b.extend(c,b.Widget);b.Slide=c});KISSY.add("carousel",function(b){var d="switchable",a={circular:true};function c(e,g){var f=this;if(!(f instanceof c)){return new c(e,g)}g=b.merge(a,g||{});c.superclass.constructor.call(f,e,g);f.switchable(f.config);f.config=f.config[d];f.config[d]=f.config}b.extend(c,b.Widget);b.Carousel=c});
