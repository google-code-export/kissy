/*
Copyright (c) 2009, Kissy UI Library. All rights reserved.
MIT Licensed.
http://kissy.googlecode.com/

Date: 2009-12-29 17:49:04
Revision: 375
*/
KISSY.add("switchable-autoplay",function(c){var e=YAHOO.util,b=e.Event,d=YAHOO.lang,f="switchable",a=c.Switchable;c.mix(a.Config,{autoplay:false,interval:5,pauseOnHover:true});c.weave(function(){var h=this,g=h.config[f];if(!g.autoplay){return}if(g.pauseOnHover){b.on(h.container,"mouseenter",function(){h.paused=true});b.on(h.container,"mouseleave",function(){h.paused=false})}h.autoplayTimer=d.later(g.interval*1000,h,function(){if(h.paused){return}h.switchTo(h.activeIndex<h.length-1?h.activeIndex+1:0)},null,true)},"after",a,"_initSwitchable")});
