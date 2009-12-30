/*
Copyright (c) 2009, Kissy UI Library. All rights reserved.
MIT Licensed.
http://kissy.googlecode.com/

Date: 2009-12-30 12:18:26
Revision: 380
*/
KISSY.add("datalazyload",function(g){var a=YAHOO.util,h=a.Dom,n=a.Event,j=YAHOO.lang,k=window,m=document,l="data-lazyload-src",o="ks-datalazyload",f=l+"-custom",b=o+"-custom",d={AUTO:"auto",MANUAL:"manual"},i="default",e={mod:d.MANUAL,diff:i,placeholder:"http://a.tbcdn.cn/kissy/1.0.2/build/datalazyload/dot.gif"};function c(r,q){var p=this;if(!(p instanceof arguments.callee)){return new arguments.callee(r,q)}if(typeof q==="undefined"){q=r;r=[m]}if(!j.isArray(r)){r=[h.get(r)||m]}p.containers=r;p.config=g.merge(e,q||{});p.callbacks={els:[],fns:[]};setTimeout(function(){p._init()},0)}g.mix(c.prototype,{_init:function(){var p=this;p.threshold=p._getThreshold();p._filterItems();if(p._getItemsLength()){p._initLoadEvent()}},_initLoadEvent:function(){var s,r=this;n.on(k,"scroll",p);n.on(k,"resize",function(){r.threshold=r._getThreshold();p()});if(r._getItemsLength()){n.onDOMReady(function(){q()})}function p(){if(s){return}s=setTimeout(function(){q();s=null},100)}function q(){r._loadItems();if(r._getItemsLength()===0){n.removeListener(k,"scroll",p);n.removeListener(k,"resize",p)}}},_filterItems:function(){var B=this,q=B.containers,w=B.threshold,A=B.config.placeholder,r=B.config.mod===d.MANUAL,p,y,v,u,t,x,s,D,C=[],z=[];for(p=0,y=q.length;p<y;++p){v=q[p].getElementsByTagName("img");for(t=0,x=v.length;t<x;++t){s=v[t];D=s.getAttribute(l);if(r){if(D){s.src=A;C.push(s)}}else{if(h.getY(s)>w&&!D){s.setAttribute(l,s.src);s.src=A;C.push(s)}}}u=q[p].getElementsByTagName("textarea");for(t=0,x=u.length;t<x;++t){if(h.hasClass(u[t],o)){z.push(u[t])}}}B.images=C;B.areaes=z},_loadItems:function(){var p=this;p._loadImgs();p._loadAreaes();p._fireCallbacks()},_loadImgs:function(){var r=this,w=r.images,t=h.getDocumentScrollTop(),p=r.threshold+t,s,q,v,u=[];for(s=0;q=w[s++];){if(h.getY(q)<=p){r._loadImgSrc(q)}else{u.push(q)}}r.images=u},_loadImgSrc:function(q,p){p=p||l;var r=q.getAttribute(p);if(r&&q.src!=r){q.src=r;q.removeAttribute(p)}},_loadAreaes:function(){var q=this,u=q.areaes,v=h.getDocumentScrollTop(),p=q.threshold+v,r,t,s,w=[];for(r=0;t=u[r++];){s=t.parentNode;if(h.getY(s)<=p){s.innerHTML=t.value}else{w.push(t)}}q.areaes=w},_fireCallbacks:function(){var z=this,v=z.callbacks,s=v.els,y=v.fns,p=h.getDocumentScrollTop(),u=z.threshold+p,t,q,x,w=[],r=[];for(t=0;(q=s[t])&&(x=y[t++]);){if(h.getY(q)<=u){x.call(q)}else{w.push(q);r.push(x)}}v.els=w;v.fns=r},addCallback:function(q,p){q=h.get(q);if(q&&typeof p==="function"){this.callbacks.els.push(q);this.callbacks.fns.push(p)}},_getThreshold:function(){var q=this.config.diff,p=h.getViewportHeight();if(q===i){return 2*p}else{return p+q}},_getItemsLength:function(){var p=this;return p.images.length+p.areaes.length+p.callbacks.els.length},loadCustomLazyData:function(t,s,q){var r=this,p,u;if(!j.isArray(t)){t=[h.get(t)]}g.each(t,function(w){switch(s){case"textarea-data":p=w.getElementsByTagName("textarea")[0];if(p&&h.hasClass(p,q||b)){w.innerHTML=p.value}break;default:if(w.nodeName==="IMG"){u=[w]}else{u=w.getElementsByTagName("img")}for(var x=0,v=u.length;x<v;x++){r._loadImgSrc(u[x],q||f)}}})}});g.mix(c,c.prototype,true,["loadCustomLazyData","_loadImgSrc"]);g.DataLazyload=c});
