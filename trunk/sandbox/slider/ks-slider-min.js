KISSY.add("slider",function(r){var h=YAHOO.Q,k=h.S,l=h.T,d=YAHOO.lang,w={P:"triggers",n:"current",M:"mouse",b:"none",o:5E3,B:500,g:true,k:0,direction:"vertical"},s={none:function(){var a=this;a.q[a.direction.x?"scrollLeft":"scrollTop"]=a.next*a.r},fade:function(){var a=this,c=a.d,b=a.A,e=k.ia,g=b[a.f]||b[0],i=b[a.next]||b[b.length-1];if(!this.W){e(b,"position","absolute");e(b,"top",c.ka||0);e(b,"left",c.ja||0);e(b,"z-index",1);e(b,"display","none");this.ca=true}this.a&&this.t&&this.a.stop();e(b,"display",
"none");e(g,"z-index",2);e(i,"z-index",1);e(i,"opacity",1);e([g,i],"display","");this.t=true;this.a=new YAHOO.Q.R(g,{opacity:{$:1,D:0}},c.B/1E3||0.5,c.L||h.G.X);this.a.ga.C(function(){e(g,"display","none");e([g,i],"z-index",1);this.t=false},a,true);this.a.J()},scroll:function(){var a=this,c=a.d,b={scroll:{D:[]}};b.scroll.D[a.direction.x?0:1]=a.next*a.r;this.a&&this.a.stop();this.a=new h.U(this.q,b,c.B/1E3||0.5,c.L||h.G.Y);this.a.J()}};function t(a,c){this.K=k.aa(a);this.d=d.z(w,c||{});this.I()}r.fa(t.prototype,
{I:function(){var a=this.d,c=this.K,b,e={x:a.direction=="horizontal"||a.direction=="h",y:a.direction=="vertical"||a.direction=="v"},g=a.A||d.z([],c.getElementsByTagName("li")),i=g.length,n=parseInt(this.d.r,10);n||(n=g[0][e.x?"clientWidth":"clientHeight"]);var q=a.q||g[0].parentNode,f=a.s;if(!f){f=document.createElement("ul");k.u(f,a.P);for(var m=0;m<i;){var u=document.createElement("li");u.innerHTML=++m;f.appendChild(u)}c.appendChild(f);f=d.z([],f.getElementsByTagName("li"))}var o=d.p(a.k)?a.k:0;
b=d.w(a.b)?a.b:d.ea(a.b)&&d.w(s[a.b])?s[a.b]:b.none;this.b=new h.m("effect",this,false,h.m.H);this.b.C(b);if(d.w(a.N)){this.j=new h.m("onSwitchEvent",this,false,h.m.H);this.j.C(a.N)}l.i(c,"mouseover",function(){this.O()},this,true);l.i(c,"mouseout",function(){a.g&&this.F()},this,true);m=0;c=f.length;for(var j,v=YAHOO.Z.ba;m<c;m++)(function(p){switch(a.M.toLowerCase()){case "mouse":l.i(f[p],v?"mouseenter":"mouseover",function(){j&&j.e();j=d.h(200,this,function(){this.l(p)})},this,true);l.i(f[p],v?
"mouseleave":"mouseout",function(){j&&j.e();a.g&&this.F()},this,true);break;default:l.i(f[p],"click",function(x){l.la(x);j&&j.e();j=d.h(50,this,function(){this.l(p)})},this,true)}}).call(this,m);k.u(f[o],a.n);q.scrollTop=n*o;q.scrollLeft=n*o;if(a.g&&i>1){this.pause=false;d.h(a.o,this,function(){this.l(o+1)})}this.direction=e;this.A=g;this.r=n;this.q=q;this.s=f;this.f=o;this.total=i},l:function(a){var c=this.d,b=this;if(!(b.pause&&!d.p(a))){this.c&&this.c.e();this.next=d.p(a)?a:b.f+1;if(this.next>=
b.total)this.next=d.p(c.k)?c.k:0;b.b.v();this.f=this.next;d.da(b.j)&&b.j.v&&this.j.v();k.ha(b.s,c.n);k.u(b.s[this.f],c.n);if(c.g)this.c=d.h(c.o,this,arguments.callee)}},O:function(){this.pause=true;this.c&&this.c.e()},F:function(){this.c&&this.c.e();this.pause=false;this.c=d.h(this.d.o,this,function(){this.l(this.f+1)})}});r.V=t});
