/*
Copyright (c) 2010, Kissy UI Library. All rights reserved.
MIT Licensed.
http://kissy.googlecode.com/

Date: 2009-12-30 20:23:55
Revision: 388
*/
KISSY.add("slide",function(b){var d="switchable",a={autoplay:true,circular:true};function c(e,g){var f=this;if(!(f instanceof c)){return new c(e,g)}g=b.merge(a,g||{});c.superclass.constructor.call(f,e,g);f.switchable(f.config);f.config=f.config[d];f.config[d]=f.config}b.extend(c,b.Widget);b.Slide=c});
