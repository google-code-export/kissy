KISSY.add("slider",function(d){var h=YAHOO.util,f=h.Dom,b=h.Event,g=YAHOO.lang;var a={triggersClass:"triggers",currentClass:"current",eventType:"mouse",effect:"none",delay:5000,speed:500,autoPlay:true,startAt:0,direction:"vertical"};var c={none:function(){var i=this.config,j=this.direction;this.scroller[j.x?"scrollLeft":"scrollTop"]=this.next*this.switchSize},fade:function(){var j=this.config,i=this.panels,l=i[this.current]||i[0],k=i[this.next]||i[i.length-1];if(!this._initFade){f.setStyle(i,"position","absolute");f.setStyle(i,"top",j.slideOffsetY||0);f.setStyle(i,"left",j.slideOffsetX||0);f.setStyle(i,"z-index",1);f.setStyle(i,"display","none");this.initFade=true}if(this._anim&&this._fading){this._anim.stop();f.setStyle(i,"display","none")}this._fading=true;f.setStyle(l,"z-index",2);f.setStyle(k,"z-index",1);f.setStyle(k,"opacity",1);f.setStyle([l,k],"display","");this._anim=new YAHOO.util.Anim(l,{opacity:{from:1,to:0}},j.speed/1000||0.5,j.easing||h.Easing.easeNone);this._anim.onComplete.subscribe(function(){f.setStyle(l,"display","none");f.setStyle([l,k],"z-index",1);this._fading=false},this,true);this._anim.animate()},scroll:function(){var j=this.config;var i={scroll:{to:[]}};i.scroll.to[this.direction.x?0:1]=this.next*this.switchSize;if(this._anim){this._anim.stop()}this._anim=new h.Scroll(this.scroller,i,j.speed/1000||0.5,j.easing||h.Easing.easeOutStrong);this._anim.animate()}};var e=function(i,j){this.config=g.merge(a,j||{});this.container=f.get(i);this._init()};g.augmentObject(e.prototype,{_init:function(){var l=this.config,k=this.container,r;this.direction={x:(l.direction=="horizontal")||(l.direction=="h"),y:(l.direction=="vertical")||(l.direction=="v")};this.panels=l.panels||g.merge([],k.getElementsByTagName("li"));this.total=this.panels.length;this.switchSize=parseInt(this.config.switchSize,10);if(!this.switchSize){this.switchSize=this.panels[0][this.direction.x?"clientWidth":"clientHeight"]}this.scroller=l.scroller||this.panels[0].parentNode;this.triggers=l.triggers;if(!this.triggers){var p=document.createElement("ul");f.addClass(p,l.triggersClass);for(var n=0;n<this.total;){var q=document.createElement("li");q.innerHTML=++n;p.appendChild(q)}this.container.appendChild(p);this.triggers=g.merge([],p.getElementsByTagName("li"))}this.current=g.isNumber(l.startAt)?l.startAt:0;if(g.isFunction(l.effect)){r=l.effect}else{if(g.isString(l.effect)&&g.isFunction(c[l.effect])){r=c[l.effect]}else{r=r.none}}this.effect=new h.CustomEvent("effect",this,false,h.CustomEvent.FLAT);this.effect.subscribe(r);if(g.isFunction(l.onSwitch)){this.onSwitchEvent=new h.CustomEvent("onSwitchEvent",this,false,h.CustomEvent.FLAT);this.onSwitchEvent.subscribe(l.onSwitch)}b.on(k,"mouseover",function(i){this.sleep()},this,true);b.on(k,"mouseout",function(i){if(l.autoPlay){this.wakeup()}},this,true);for(var n=0,o=this.triggers.length,m,j=YAHOO.env.ie;n<o;n++){(function(i){switch(l.eventType.toLowerCase()){case"mouse":b.on(this.triggers[i],j?"mouseenter":"mouseover",function(s){if(m){m.cancel()}m=g.later(50,this,function(){this.switchTo(i)})},this,true);b.on(this.triggers[i],j?"mouseleave":"mouseout",function(s){if(m){m.cancel()}if(l.autoPlay){this.wakeup()}},this,true);break;default:b.on(this.triggers[i],"click",function(s){b.stopEvent(s);if(m){m.cancel()}m=g.later(50,this,function(){this.switchTo(i)})},this,true)}}).call(this,n)}f.addClass(this.triggers[this.current],l.currentClass);this.scroller.scrollTop=this.switchSize*this.current;this.scroller.scrollLeft=this.switchSize*this.current;if(l.autoPlay&&this.panels.length>1){this.pause=false;g.later(l.delay,this,function(){this.switchTo(this.current+1)})}},switchTo:function(j){var i=this.config;if(this.pause&&!g.isNumber(j)){return}if(this.timer){this.timer.cancel()}this.next=g.isNumber(j)?j:this.current+1;if(this.next>=this.total){this.next=0}this.effect.fire();this.current=this.next;if(g.isObject(this.onSwitchEvent)&&this.onSwitchEvent.fire){this.onSwitchEvent.fire()}f.removeClass(this.triggers,i.currentClass);f.addClass(this.triggers[this.current],i.currentClass);if(i.autoPlay){this.timer=g.later(i.delay,this,arguments.callee)}},sleep:function(){this.pause=true;if(this.timer){this.timer.cancel()}},wakeup:function(){if(this.timer){this.timer.cancel()}this.pause=false;this.timer=g.later(this.config.delay,this,function(){this.switchTo(this.current+1)})}});d.Slider=e});
