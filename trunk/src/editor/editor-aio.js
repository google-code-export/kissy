/*!
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.8.0r4
*/
if(typeof YAHOO=="undefined"||!YAHOO){var YAHOO={};}YAHOO.namespace=function(){var A=arguments,E=null,C,B,D;for(C=0;C<A.length;C=C+1){D=(""+A[C]).split(".");E=YAHOO;for(B=(D[0]=="YAHOO")?1:0;B<D.length;B=B+1){E[D[B]]=E[D[B]]||{};E=E[D[B]];}}return E;};YAHOO.log=function(D,A,C){var B=YAHOO.widget.Logger;if(B&&B.log){return B.log(D,A,C);}else{return false;}};YAHOO.register=function(A,E,D){var I=YAHOO.env.modules,B,H,G,F,C;if(!I[A]){I[A]={versions:[],builds:[]};}B=I[A];H=D.version;G=D.build;F=YAHOO.env.listeners;B.name=A;B.version=H;B.build=G;B.versions.push(H);B.builds.push(G);B.mainClass=E;for(C=0;C<F.length;C=C+1){F[C](B);}if(E){E.VERSION=H;E.BUILD=G;}else{YAHOO.log("mainClass is undefined for module "+A,"warn");}};YAHOO.env=YAHOO.env||{modules:[],listeners:[]};YAHOO.env.getVersion=function(A){return YAHOO.env.modules[A]||null;};YAHOO.env.ua=function(){var D=function(H){var I=0;return parseFloat(H.replace(/\./g,function(){return(I++==1)?"":".";}));},G=navigator,F={ie:0,opera:0,gecko:0,webkit:0,mobile:null,air:0,caja:G.cajaVersion,secure:false,os:null},C=navigator&&navigator.userAgent,E=window&&window.location,B=E&&E.href,A;F.secure=B&&(B.toLowerCase().indexOf("https")===0);if(C){if((/windows|win32/i).test(C)){F.os="windows";}else{if((/macintosh/i).test(C)){F.os="macintosh";}}if((/KHTML/).test(C)){F.webkit=1;}A=C.match(/AppleWebKit\/([^\s]*)/);if(A&&A[1]){F.webkit=D(A[1]);if(/ Mobile\//.test(C)){F.mobile="Apple";}else{A=C.match(/NokiaN[^\/]*/);if(A){F.mobile=A[0];}}A=C.match(/AdobeAIR\/([^\s]*)/);if(A){F.air=A[0];}}if(!F.webkit){A=C.match(/Opera[\s\/]([^\s]*)/);if(A&&A[1]){F.opera=D(A[1]);A=C.match(/Opera Mini[^;]*/);if(A){F.mobile=A[0];}}else{A=C.match(/MSIE\s([^;]*)/);if(A&&A[1]){F.ie=D(A[1]);}else{A=C.match(/Gecko\/([^\s]*)/);if(A){F.gecko=1;A=C.match(/rv:([^\s\)]*)/);if(A&&A[1]){F.gecko=D(A[1]);}}}}}}return F;}();(function(){YAHOO.namespace("util","widget","example");if("undefined"!==typeof YAHOO_config){var B=YAHOO_config.listener,A=YAHOO.env.listeners,D=true,C;if(B){for(C=0;C<A.length;C++){if(A[C]==B){D=false;break;}}if(D){A.push(B);}}}})();YAHOO.lang=YAHOO.lang||{};(function(){var B=YAHOO.lang,A=Object.prototype,H="[object Array]",C="[object Function]",G="[object Object]",E=[],F=["toString","valueOf"],D={isArray:function(I){return A.toString.apply(I)===H;},isBoolean:function(I){return typeof I==="boolean";},isFunction:function(I){return(typeof I==="function")||A.toString.apply(I)===C;},isNull:function(I){return I===null;},isNumber:function(I){return typeof I==="number"&&isFinite(I);},isObject:function(I){return(I&&(typeof I==="object"||B.isFunction(I)))||false;},isString:function(I){return typeof I==="string";},isUndefined:function(I){return typeof I==="undefined";},_IEEnumFix:(YAHOO.env.ua.ie)?function(K,J){var I,M,L;for(I=0;I<F.length;I=I+1){M=F[I];L=J[M];if(B.isFunction(L)&&L!=A[M]){K[M]=L;}}}:function(){},extend:function(L,M,K){if(!M||!L){throw new Error("extend failed, please check that "+"all dependencies are included.");}var J=function(){},I;J.prototype=M.prototype;L.prototype=new J();L.prototype.constructor=L;L.superclass=M.prototype;if(M.prototype.constructor==A.constructor){M.prototype.constructor=M;}if(K){for(I in K){if(B.hasOwnProperty(K,I)){L.prototype[I]=K[I];}}B._IEEnumFix(L.prototype,K);}},augmentObject:function(M,L){if(!L||!M){throw new Error("Absorb failed, verify dependencies.");}var I=arguments,K,N,J=I[2];if(J&&J!==true){for(K=2;K<I.length;K=K+1){M[I[K]]=L[I[K]];}}else{for(N in L){if(J||!(N in M)){M[N]=L[N];}}B._IEEnumFix(M,L);}},augmentProto:function(L,K){if(!K||!L){throw new Error("Augment failed, verify dependencies.");}var I=[L.prototype,K.prototype],J;for(J=2;J<arguments.length;J=J+1){I.push(arguments[J]);}B.augmentObject.apply(this,I);},dump:function(I,N){var K,M,P=[],Q="{...}",J="f(){...}",O=", ",L=" => ";if(!B.isObject(I)){return I+"";}else{if(I instanceof Date||("nodeType" in I&&"tagName" in I)){return I;}else{if(B.isFunction(I)){return J;}}}N=(B.isNumber(N))?N:3;if(B.isArray(I)){P.push("[");for(K=0,M=I.length;K<M;K=K+1){if(B.isObject(I[K])){P.push((N>0)?B.dump(I[K],N-1):Q);}else{P.push(I[K]);}P.push(O);}if(P.length>1){P.pop();}P.push("]");}else{P.push("{");for(K in I){if(B.hasOwnProperty(I,K)){P.push(K+L);if(B.isObject(I[K])){P.push((N>0)?B.dump(I[K],N-1):Q);}else{P.push(I[K]);}P.push(O);}}if(P.length>1){P.pop();}P.push("}");}return P.join("");},substitute:function(Y,J,R){var N,M,L,U,V,X,T=[],K,O="dump",S=" ",I="{",W="}",Q,P;for(;;){N=Y.lastIndexOf(I);if(N<0){break;}M=Y.indexOf(W,N);if(N+1>=M){break;}K=Y.substring(N+1,M);U=K;X=null;L=U.indexOf(S);if(L>-1){X=U.substring(L+1);U=U.substring(0,L);}V=J[U];if(R){V=R(U,V,X);}if(B.isObject(V)){if(B.isArray(V)){V=B.dump(V,parseInt(X,10));}else{X=X||"";Q=X.indexOf(O);if(Q>-1){X=X.substring(4);}P=V.toString();if(P===G||Q>-1){V=B.dump(V,parseInt(X,10));}else{V=P;}}}else{if(!B.isString(V)&&!B.isNumber(V)){V="~-"+T.length+"-~";T[T.length]=K;}}Y=Y.substring(0,N)+V+Y.substring(M+1);}for(N=T.length-1;N>=0;N=N-1){Y=Y.replace(new RegExp("~-"+N+"-~"),"{"+T[N]+"}","g");}return Y;},trim:function(I){try{return I.replace(/^\s+|\s+$/g,"");}catch(J){return I;}},merge:function(){var L={},J=arguments,I=J.length,K;for(K=0;K<I;K=K+1){B.augmentObject(L,J[K],true);}return L;},later:function(P,J,Q,L,M){P=P||0;J=J||{};var K=Q,O=L,N,I;if(B.isString(Q)){K=J[Q];}if(!K){throw new TypeError("method undefined");}if(O&&!B.isArray(O)){O=[L];}N=function(){K.apply(J,O||E);};I=(M)?setInterval(N,P):setTimeout(N,P);return{interval:M,cancel:function(){if(this.interval){clearInterval(I);}else{clearTimeout(I);}}};},isValue:function(I){return(B.isObject(I)||B.isString(I)||B.isNumber(I)||B.isBoolean(I));}};B.hasOwnProperty=(A.hasOwnProperty)?function(I,J){return I&&I.hasOwnProperty(J);}:function(I,J){return !B.isUndefined(I[J])&&I.constructor.prototype[J]!==I[J];};D.augmentObject(B,D,true);YAHOO.util.Lang=B;B.augment=B.augmentProto;YAHOO.augment=B.augmentProto;YAHOO.extend=B.extend;})();YAHOO.register("yahoo",YAHOO,{version:"2.8.0r4",build:"2449"});
(function(){YAHOO.env._id_counter=YAHOO.env._id_counter||0;var E=YAHOO.util,L=YAHOO.lang,m=YAHOO.env.ua,A=YAHOO.lang.trim,d={},h={},N=/^t(?:able|d|h)$/i,X=/color$/i,K=window.document,W=K.documentElement,e="ownerDocument",n="defaultView",v="documentElement",t="compatMode",b="offsetLeft",P="offsetTop",u="offsetParent",Z="parentNode",l="nodeType",C="tagName",O="scrollLeft",i="scrollTop",Q="getBoundingClientRect",w="getComputedStyle",a="currentStyle",M="CSS1Compat",c="BackCompat",g="class",F="className",J="",B=" ",s="(?:^|\\s)",k="(?= |$)",U="g",p="position",f="fixed",V="relative",j="left",o="top",r="medium",q="borderLeftWidth",R="borderTopWidth",D=m.opera,I=m.webkit,H=m.gecko,T=m.ie;E.Dom={CUSTOM_ATTRIBUTES:(!W.hasAttribute)?{"for":"htmlFor","class":F}:{"htmlFor":"for","className":g},DOT_ATTRIBUTES:{},get:function(z){var AB,x,AA,y,Y,G;if(z){if(z[l]||z.item){return z;}if(typeof z==="string"){AB=z;z=K.getElementById(z);G=(z)?z.attributes:null;if(z&&G&&G.id&&G.id.value===AB){return z;}else{if(z&&K.all){z=null;x=K.all[AB];for(y=0,Y=x.length;y<Y;++y){if(x[y].id===AB){return x[y];}}}}return z;}if(YAHOO.util.Element&&z instanceof YAHOO.util.Element){z=z.get("element");}if("length" in z){AA=[];for(y=0,Y=z.length;y<Y;++y){AA[AA.length]=E.Dom.get(z[y]);}return AA;}return z;}return null;},getComputedStyle:function(G,Y){if(window[w]){return G[e][n][w](G,null)[Y];}else{if(G[a]){return E.Dom.IE_ComputedStyle.get(G,Y);}}},getStyle:function(G,Y){return E.Dom.batch(G,E.Dom._getStyle,Y);},_getStyle:function(){if(window[w]){return function(G,y){y=(y==="float")?y="cssFloat":E.Dom._toCamel(y);var x=G.style[y],Y;if(!x){Y=G[e][n][w](G,null);if(Y){x=Y[y];}}return x;};}else{if(W[a]){return function(G,y){var x;switch(y){case"opacity":x=100;try{x=G.filters["DXImageTransform.Microsoft.Alpha"].opacity;}catch(z){try{x=G.filters("alpha").opacity;}catch(Y){}}return x/100;case"float":y="styleFloat";default:y=E.Dom._toCamel(y);x=G[a]?G[a][y]:null;return(G.style[y]||x);}};}}}(),setStyle:function(G,Y,x){E.Dom.batch(G,E.Dom._setStyle,{prop:Y,val:x});},_setStyle:function(){if(T){return function(Y,G){var x=E.Dom._toCamel(G.prop),y=G.val;if(Y){switch(x){case"opacity":if(L.isString(Y.style.filter)){Y.style.filter="alpha(opacity="+y*100+")";if(!Y[a]||!Y[a].hasLayout){Y.style.zoom=1;}}break;case"float":x="styleFloat";default:Y.style[x]=y;}}else{}};}else{return function(Y,G){var x=E.Dom._toCamel(G.prop),y=G.val;if(Y){if(x=="float"){x="cssFloat";}Y.style[x]=y;}else{}};}}(),getXY:function(G){return E.Dom.batch(G,E.Dom._getXY);},_canPosition:function(G){return(E.Dom._getStyle(G,"display")!=="none"&&E.Dom._inDoc(G));},_getXY:function(){if(K[v][Q]){return function(y){var z,Y,AA,AF,AE,AD,AC,G,x,AB=Math.floor,AG=false;if(E.Dom._canPosition(y)){AA=y[Q]();AF=y[e];z=E.Dom.getDocumentScrollLeft(AF);Y=E.Dom.getDocumentScrollTop(AF);AG=[AB(AA[j]),AB(AA[o])];if(T&&m.ie<8){AE=2;AD=2;AC=AF[t];if(m.ie===6){if(AC!==c){AE=0;AD=0;}}if((AC===c)){G=S(AF[v],q);x=S(AF[v],R);if(G!==r){AE=parseInt(G,10);}if(x!==r){AD=parseInt(x,10);}}AG[0]-=AE;AG[1]-=AD;}if((Y||z)){AG[0]+=z;AG[1]+=Y;}AG[0]=AB(AG[0]);AG[1]=AB(AG[1]);}else{}return AG;};}else{return function(y){var x,Y,AA,AB,AC,z=false,G=y;if(E.Dom._canPosition(y)){z=[y[b],y[P]];x=E.Dom.getDocumentScrollLeft(y[e]);Y=E.Dom.getDocumentScrollTop(y[e]);AC=((H||m.webkit>519)?true:false);while((G=G[u])){z[0]+=G[b];z[1]+=G[P];if(AC){z=E.Dom._calcBorders(G,z);}}if(E.Dom._getStyle(y,p)!==f){G=y;while((G=G[Z])&&G[C]){AA=G[i];AB=G[O];if(H&&(E.Dom._getStyle(G,"overflow")!=="visible")){z=E.Dom._calcBorders(G,z);}if(AA||AB){z[0]-=AB;z[1]-=AA;}}z[0]+=x;z[1]+=Y;}else{if(D){z[0]-=x;z[1]-=Y;}else{if(I||H){z[0]+=x;z[1]+=Y;}}}z[0]=Math.floor(z[0]);z[1]=Math.floor(z[1]);}else{}return z;};}}(),getX:function(G){var Y=function(x){return E.Dom.getXY(x)[0];};return E.Dom.batch(G,Y,E.Dom,true);},getY:function(G){var Y=function(x){return E.Dom.getXY(x)[1];};return E.Dom.batch(G,Y,E.Dom,true);},setXY:function(G,x,Y){E.Dom.batch(G,E.Dom._setXY,{pos:x,noRetry:Y});},_setXY:function(G,z){var AA=E.Dom._getStyle(G,p),y=E.Dom.setStyle,AD=z.pos,Y=z.noRetry,AB=[parseInt(E.Dom.getComputedStyle(G,j),10),parseInt(E.Dom.getComputedStyle(G,o),10)],AC,x;if(AA=="static"){AA=V;y(G,p,AA);}AC=E.Dom._getXY(G);if(!AD||AC===false){return false;}if(isNaN(AB[0])){AB[0]=(AA==V)?0:G[b];}if(isNaN(AB[1])){AB[1]=(AA==V)?0:G[P];}if(AD[0]!==null){y(G,j,AD[0]-AC[0]+AB[0]+"px");}if(AD[1]!==null){y(G,o,AD[1]-AC[1]+AB[1]+"px");}if(!Y){x=E.Dom._getXY(G);if((AD[0]!==null&&x[0]!=AD[0])||(AD[1]!==null&&x[1]!=AD[1])){E.Dom._setXY(G,{pos:AD,noRetry:true});}}},setX:function(Y,G){E.Dom.setXY(Y,[G,null]);},setY:function(G,Y){E.Dom.setXY(G,[null,Y]);},getRegion:function(G){var Y=function(x){var y=false;if(E.Dom._canPosition(x)){y=E.Region.getRegion(x);}else{}return y;};return E.Dom.batch(G,Y,E.Dom,true);},getClientWidth:function(){return E.Dom.getViewportWidth();},getClientHeight:function(){return E.Dom.getViewportHeight();},getElementsByClassName:function(AB,AF,AC,AE,x,AD){AF=AF||"*";AC=(AC)?E.Dom.get(AC):null||K;if(!AC){return[];}var Y=[],G=AC.getElementsByTagName(AF),z=E.Dom.hasClass;for(var y=0,AA=G.length;y<AA;++y){if(z(G[y],AB)){Y[Y.length]=G[y];}}if(AE){E.Dom.batch(Y,AE,x,AD);}return Y;},hasClass:function(Y,G){return E.Dom.batch(Y,E.Dom._hasClass,G);},_hasClass:function(x,Y){var G=false,y;if(x&&Y){y=E.Dom._getAttribute(x,F)||J;if(Y.exec){G=Y.test(y);}else{G=Y&&(B+y+B).indexOf(B+Y+B)>-1;}}else{}return G;},addClass:function(Y,G){return E.Dom.batch(Y,E.Dom._addClass,G);},_addClass:function(x,Y){var G=false,y;if(x&&Y){y=E.Dom._getAttribute(x,F)||J;if(!E.Dom._hasClass(x,Y)){E.Dom.setAttribute(x,F,A(y+B+Y));G=true;}}else{}return G;},removeClass:function(Y,G){return E.Dom.batch(Y,E.Dom._removeClass,G);},_removeClass:function(y,x){var Y=false,AA,z,G;if(y&&x){AA=E.Dom._getAttribute(y,F)||J;E.Dom.setAttribute(y,F,AA.replace(E.Dom._getClassRegex(x),J));z=E.Dom._getAttribute(y,F);if(AA!==z){E.Dom.setAttribute(y,F,A(z));Y=true;if(E.Dom._getAttribute(y,F)===""){G=(y.hasAttribute&&y.hasAttribute(g))?g:F;
y.removeAttribute(G);}}}else{}return Y;},replaceClass:function(x,Y,G){return E.Dom.batch(x,E.Dom._replaceClass,{from:Y,to:G});},_replaceClass:function(y,x){var Y,AB,AA,G=false,z;if(y&&x){AB=x.from;AA=x.to;if(!AA){G=false;}else{if(!AB){G=E.Dom._addClass(y,x.to);}else{if(AB!==AA){z=E.Dom._getAttribute(y,F)||J;Y=(B+z.replace(E.Dom._getClassRegex(AB),B+AA)).split(E.Dom._getClassRegex(AA));Y.splice(1,0,B+AA);E.Dom.setAttribute(y,F,A(Y.join(J)));G=true;}}}}else{}return G;},generateId:function(G,x){x=x||"yui-gen";var Y=function(y){if(y&&y.id){return y.id;}var z=x+YAHOO.env._id_counter++;if(y){if(y[e]&&y[e].getElementById(z)){return E.Dom.generateId(y,z+x);}y.id=z;}return z;};return E.Dom.batch(G,Y,E.Dom,true)||Y.apply(E.Dom,arguments);},isAncestor:function(Y,x){Y=E.Dom.get(Y);x=E.Dom.get(x);var G=false;if((Y&&x)&&(Y[l]&&x[l])){if(Y.contains&&Y!==x){G=Y.contains(x);}else{if(Y.compareDocumentPosition){G=!!(Y.compareDocumentPosition(x)&16);}}}else{}return G;},inDocument:function(G,Y){return E.Dom._inDoc(E.Dom.get(G),Y);},_inDoc:function(Y,x){var G=false;if(Y&&Y[C]){x=x||Y[e];G=E.Dom.isAncestor(x[v],Y);}else{}return G;},getElementsBy:function(Y,AF,AB,AD,y,AC,AE){AF=AF||"*";AB=(AB)?E.Dom.get(AB):null||K;if(!AB){return[];}var x=[],G=AB.getElementsByTagName(AF);for(var z=0,AA=G.length;z<AA;++z){if(Y(G[z])){if(AE){x=G[z];break;}else{x[x.length]=G[z];}}}if(AD){E.Dom.batch(x,AD,y,AC);}return x;},getElementBy:function(x,G,Y){return E.Dom.getElementsBy(x,G,Y,null,null,null,true);},batch:function(x,AB,AA,z){var y=[],Y=(z)?AA:window;x=(x&&(x[C]||x.item))?x:E.Dom.get(x);if(x&&AB){if(x[C]||x.length===undefined){return AB.call(Y,x,AA);}for(var G=0;G<x.length;++G){y[y.length]=AB.call(Y,x[G],AA);}}else{return false;}return y;},getDocumentHeight:function(){var Y=(K[t]!=M||I)?K.body.scrollHeight:W.scrollHeight,G=Math.max(Y,E.Dom.getViewportHeight());return G;},getDocumentWidth:function(){var Y=(K[t]!=M||I)?K.body.scrollWidth:W.scrollWidth,G=Math.max(Y,E.Dom.getViewportWidth());return G;},getViewportHeight:function(){var G=self.innerHeight,Y=K[t];if((Y||T)&&!D){G=(Y==M)?W.clientHeight:K.body.clientHeight;}return G;},getViewportWidth:function(){var G=self.innerWidth,Y=K[t];if(Y||T){G=(Y==M)?W.clientWidth:K.body.clientWidth;}return G;},getAncestorBy:function(G,Y){while((G=G[Z])){if(E.Dom._testElement(G,Y)){return G;}}return null;},getAncestorByClassName:function(Y,G){Y=E.Dom.get(Y);if(!Y){return null;}var x=function(y){return E.Dom.hasClass(y,G);};return E.Dom.getAncestorBy(Y,x);},getAncestorByTagName:function(Y,G){Y=E.Dom.get(Y);if(!Y){return null;}var x=function(y){return y[C]&&y[C].toUpperCase()==G.toUpperCase();};return E.Dom.getAncestorBy(Y,x);},getPreviousSiblingBy:function(G,Y){while(G){G=G.previousSibling;if(E.Dom._testElement(G,Y)){return G;}}return null;},getPreviousSibling:function(G){G=E.Dom.get(G);if(!G){return null;}return E.Dom.getPreviousSiblingBy(G);},getNextSiblingBy:function(G,Y){while(G){G=G.nextSibling;if(E.Dom._testElement(G,Y)){return G;}}return null;},getNextSibling:function(G){G=E.Dom.get(G);if(!G){return null;}return E.Dom.getNextSiblingBy(G);},getFirstChildBy:function(G,x){var Y=(E.Dom._testElement(G.firstChild,x))?G.firstChild:null;return Y||E.Dom.getNextSiblingBy(G.firstChild,x);},getFirstChild:function(G,Y){G=E.Dom.get(G);if(!G){return null;}return E.Dom.getFirstChildBy(G);},getLastChildBy:function(G,x){if(!G){return null;}var Y=(E.Dom._testElement(G.lastChild,x))?G.lastChild:null;return Y||E.Dom.getPreviousSiblingBy(G.lastChild,x);},getLastChild:function(G){G=E.Dom.get(G);return E.Dom.getLastChildBy(G);},getChildrenBy:function(Y,y){var x=E.Dom.getFirstChildBy(Y,y),G=x?[x]:[];E.Dom.getNextSiblingBy(x,function(z){if(!y||y(z)){G[G.length]=z;}return false;});return G;},getChildren:function(G){G=E.Dom.get(G);if(!G){}return E.Dom.getChildrenBy(G);},getDocumentScrollLeft:function(G){G=G||K;return Math.max(G[v].scrollLeft,G.body.scrollLeft);},getDocumentScrollTop:function(G){G=G||K;return Math.max(G[v].scrollTop,G.body.scrollTop);},insertBefore:function(Y,G){Y=E.Dom.get(Y);G=E.Dom.get(G);if(!Y||!G||!G[Z]){return null;}return G[Z].insertBefore(Y,G);},insertAfter:function(Y,G){Y=E.Dom.get(Y);G=E.Dom.get(G);if(!Y||!G||!G[Z]){return null;}if(G.nextSibling){return G[Z].insertBefore(Y,G.nextSibling);}else{return G[Z].appendChild(Y);}},getClientRegion:function(){var x=E.Dom.getDocumentScrollTop(),Y=E.Dom.getDocumentScrollLeft(),y=E.Dom.getViewportWidth()+Y,G=E.Dom.getViewportHeight()+x;return new E.Region(x,y,G,Y);},setAttribute:function(Y,G,x){E.Dom.batch(Y,E.Dom._setAttribute,{attr:G,val:x});},_setAttribute:function(x,Y){var G=E.Dom._toCamel(Y.attr),y=Y.val;if(x&&x.setAttribute){if(E.Dom.DOT_ATTRIBUTES[G]){x[G]=y;}else{G=E.Dom.CUSTOM_ATTRIBUTES[G]||G;x.setAttribute(G,y);}}else{}},getAttribute:function(Y,G){return E.Dom.batch(Y,E.Dom._getAttribute,G);},_getAttribute:function(Y,G){var x;G=E.Dom.CUSTOM_ATTRIBUTES[G]||G;if(Y&&Y.getAttribute){x=Y.getAttribute(G,2);}else{}return x;},_toCamel:function(Y){var x=d;function G(y,z){return z.toUpperCase();}return x[Y]||(x[Y]=Y.indexOf("-")===-1?Y:Y.replace(/-([a-z])/gi,G));},_getClassRegex:function(Y){var G;if(Y!==undefined){if(Y.exec){G=Y;}else{G=h[Y];if(!G){Y=Y.replace(E.Dom._patterns.CLASS_RE_TOKENS,"\\$1");G=h[Y]=new RegExp(s+Y+k,U);}}}return G;},_patterns:{ROOT_TAG:/^body|html$/i,CLASS_RE_TOKENS:/([\.\(\)\^\$\*\+\?\|\[\]\{\}\\])/g},_testElement:function(G,Y){return G&&G[l]==1&&(!Y||Y(G));},_calcBorders:function(x,y){var Y=parseInt(E.Dom[w](x,R),10)||0,G=parseInt(E.Dom[w](x,q),10)||0;if(H){if(N.test(x[C])){Y=0;G=0;}}y[0]+=G;y[1]+=Y;return y;}};var S=E.Dom[w];if(m.opera){E.Dom[w]=function(Y,G){var x=S(Y,G);if(X.test(G)){x=E.Dom.Color.toRGB(x);}return x;};}if(m.webkit){E.Dom[w]=function(Y,G){var x=S(Y,G);if(x==="rgba(0, 0, 0, 0)"){x="transparent";}return x;};}if(m.ie&&m.ie>=8&&K.documentElement.hasAttribute){E.Dom.DOT_ATTRIBUTES.type=true;}})();YAHOO.util.Region=function(C,D,A,B){this.top=C;this.y=C;this[1]=C;this.right=D;this.bottom=A;this.left=B;this.x=B;this[0]=B;
this.width=this.right-this.left;this.height=this.bottom-this.top;};YAHOO.util.Region.prototype.contains=function(A){return(A.left>=this.left&&A.right<=this.right&&A.top>=this.top&&A.bottom<=this.bottom);};YAHOO.util.Region.prototype.getArea=function(){return((this.bottom-this.top)*(this.right-this.left));};YAHOO.util.Region.prototype.intersect=function(E){var C=Math.max(this.top,E.top),D=Math.min(this.right,E.right),A=Math.min(this.bottom,E.bottom),B=Math.max(this.left,E.left);if(A>=C&&D>=B){return new YAHOO.util.Region(C,D,A,B);}else{return null;}};YAHOO.util.Region.prototype.union=function(E){var C=Math.min(this.top,E.top),D=Math.max(this.right,E.right),A=Math.max(this.bottom,E.bottom),B=Math.min(this.left,E.left);return new YAHOO.util.Region(C,D,A,B);};YAHOO.util.Region.prototype.toString=function(){return("Region {"+"top: "+this.top+", right: "+this.right+", bottom: "+this.bottom+", left: "+this.left+", height: "+this.height+", width: "+this.width+"}");};YAHOO.util.Region.getRegion=function(D){var F=YAHOO.util.Dom.getXY(D),C=F[1],E=F[0]+D.offsetWidth,A=F[1]+D.offsetHeight,B=F[0];return new YAHOO.util.Region(C,E,A,B);};YAHOO.util.Point=function(A,B){if(YAHOO.lang.isArray(A)){B=A[1];A=A[0];}YAHOO.util.Point.superclass.constructor.call(this,B,A,B,A);};YAHOO.extend(YAHOO.util.Point,YAHOO.util.Region);(function(){var B=YAHOO.util,A="clientTop",F="clientLeft",J="parentNode",K="right",W="hasLayout",I="px",U="opacity",L="auto",D="borderLeftWidth",G="borderTopWidth",P="borderRightWidth",V="borderBottomWidth",S="visible",Q="transparent",N="height",E="width",H="style",T="currentStyle",R=/^width|height$/,O=/^(\d[.\d]*)+(em|ex|px|gd|rem|vw|vh|vm|ch|mm|cm|in|pt|pc|deg|rad|ms|s|hz|khz|%){1}?/i,M={get:function(X,Z){var Y="",a=X[T][Z];if(Z===U){Y=B.Dom.getStyle(X,U);}else{if(!a||(a.indexOf&&a.indexOf(I)>-1)){Y=a;}else{if(B.Dom.IE_COMPUTED[Z]){Y=B.Dom.IE_COMPUTED[Z](X,Z);}else{if(O.test(a)){Y=B.Dom.IE.ComputedStyle.getPixel(X,Z);}else{Y=a;}}}}return Y;},getOffset:function(Z,e){var b=Z[T][e],X=e.charAt(0).toUpperCase()+e.substr(1),c="offset"+X,Y="pixel"+X,a="",d;if(b==L){d=Z[c];if(d===undefined){a=0;}a=d;if(R.test(e)){Z[H][e]=d;if(Z[c]>d){a=d-(Z[c]-d);}Z[H][e]=L;}}else{if(!Z[H][Y]&&!Z[H][e]){Z[H][e]=b;}a=Z[H][Y];}return a+I;},getBorderWidth:function(X,Z){var Y=null;if(!X[T][W]){X[H].zoom=1;}switch(Z){case G:Y=X[A];break;case V:Y=X.offsetHeight-X.clientHeight-X[A];break;case D:Y=X[F];break;case P:Y=X.offsetWidth-X.clientWidth-X[F];break;}return Y+I;},getPixel:function(Y,X){var a=null,b=Y[T][K],Z=Y[T][X];Y[H][K]=Z;a=Y[H].pixelRight;Y[H][K]=b;return a+I;},getMargin:function(Y,X){var Z;if(Y[T][X]==L){Z=0+I;}else{Z=B.Dom.IE.ComputedStyle.getPixel(Y,X);}return Z;},getVisibility:function(Y,X){var Z;while((Z=Y[T])&&Z[X]=="inherit"){Y=Y[J];}return(Z)?Z[X]:S;},getColor:function(Y,X){return B.Dom.Color.toRGB(Y[T][X])||Q;},getBorderColor:function(Y,X){var Z=Y[T],a=Z[X]||Z.color;return B.Dom.Color.toRGB(B.Dom.Color.toHex(a));}},C={};C.top=C.right=C.bottom=C.left=C[E]=C[N]=M.getOffset;C.color=M.getColor;C[G]=C[P]=C[V]=C[D]=M.getBorderWidth;C.marginTop=C.marginRight=C.marginBottom=C.marginLeft=M.getMargin;C.visibility=M.getVisibility;C.borderColor=C.borderTopColor=C.borderRightColor=C.borderBottomColor=C.borderLeftColor=M.getBorderColor;B.Dom.IE_COMPUTED=C;B.Dom.IE_ComputedStyle=M;})();(function(){var C="toString",A=parseInt,B=RegExp,D=YAHOO.util;D.Dom.Color={KEYWORDS:{black:"000",silver:"c0c0c0",gray:"808080",white:"fff",maroon:"800000",red:"f00",purple:"800080",fuchsia:"f0f",green:"008000",lime:"0f0",olive:"808000",yellow:"ff0",navy:"000080",blue:"00f",teal:"008080",aqua:"0ff"},re_RGB:/^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i,re_hex:/^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i,re_hex3:/([0-9A-F])/gi,toRGB:function(E){if(!D.Dom.Color.re_RGB.test(E)){E=D.Dom.Color.toHex(E);}if(D.Dom.Color.re_hex.exec(E)){E="rgb("+[A(B.$1,16),A(B.$2,16),A(B.$3,16)].join(", ")+")";}return E;},toHex:function(H){H=D.Dom.Color.KEYWORDS[H]||H;if(D.Dom.Color.re_RGB.exec(H)){var G=(B.$1.length===1)?"0"+B.$1:Number(B.$1),F=(B.$2.length===1)?"0"+B.$2:Number(B.$2),E=(B.$3.length===1)?"0"+B.$3:Number(B.$3);H=[G[C](16),F[C](16),E[C](16)].join("");}if(H.length<6){H=H.replace(D.Dom.Color.re_hex3,"$1$1");}if(H!=="transparent"&&H.indexOf("#")<0){H="#"+H;}return H.toLowerCase();}};}());YAHOO.register("dom",YAHOO.util.Dom,{version:"2.8.0r4",build:"2449"});YAHOO.util.CustomEvent=function(D,C,B,A,E){this.type=D;this.scope=C||window;this.silent=B;this.fireOnce=E;this.fired=false;this.firedWith=null;this.signature=A||YAHOO.util.CustomEvent.LIST;this.subscribers=[];if(!this.silent){}var F="_YUICEOnSubscribe";if(D!==F){this.subscribeEvent=new YAHOO.util.CustomEvent(F,this,true);}this.lastError=null;};YAHOO.util.CustomEvent.LIST=0;YAHOO.util.CustomEvent.FLAT=1;YAHOO.util.CustomEvent.prototype={subscribe:function(B,C,D){if(!B){throw new Error("Invalid callback for subscriber to '"+this.type+"'");}if(this.subscribeEvent){this.subscribeEvent.fire(B,C,D);}var A=new YAHOO.util.Subscriber(B,C,D);if(this.fireOnce&&this.fired){this.notify(A,this.firedWith);}else{this.subscribers.push(A);}},unsubscribe:function(D,F){if(!D){return this.unsubscribeAll();}var E=false;for(var B=0,A=this.subscribers.length;B<A;++B){var C=this.subscribers[B];if(C&&C.contains(D,F)){this._delete(B);E=true;}}return E;},fire:function(){this.lastError=null;var H=[],A=this.subscribers.length;var D=[].slice.call(arguments,0),C=true,F,B=false;if(this.fireOnce){if(this.fired){return true;}else{this.firedWith=D;}}this.fired=true;if(!A&&this.silent){return true;}if(!this.silent){}var E=this.subscribers.slice();for(F=0;F<A;++F){var G=E[F];if(!G){B=true;}else{C=this.notify(G,D);if(false===C){if(!this.silent){}break;}}}return(C!==false);},notify:function(F,C){var B,H=null,E=F.getScope(this.scope),A=YAHOO.util.Event.throwErrors;if(!this.silent){}if(this.signature==YAHOO.util.CustomEvent.FLAT){if(C.length>0){H=C[0];}try{B=F.fn.call(E,H,F.obj);}catch(G){this.lastError=G;if(A){throw G;}}}else{try{B=F.fn.call(E,this.type,C,F.obj);}catch(D){this.lastError=D;if(A){throw D;}}}return B;},unsubscribeAll:function(){var A=this.subscribers.length,B;for(B=A-1;B>-1;B--){this._delete(B);}this.subscribers=[];return A;},_delete:function(A){var B=this.subscribers[A];if(B){delete B.fn;delete B.obj;}this.subscribers.splice(A,1);},toString:function(){return"CustomEvent: "+"'"+this.type+"', "+"context: "+this.scope;}};YAHOO.util.Subscriber=function(A,B,C){this.fn=A;this.obj=YAHOO.lang.isUndefined(B)?null:B;this.overrideContext=C;};YAHOO.util.Subscriber.prototype.getScope=function(A){if(this.overrideContext){if(this.overrideContext===true){return this.obj;}else{return this.overrideContext;}}return A;};YAHOO.util.Subscriber.prototype.contains=function(A,B){if(B){return(this.fn==A&&this.obj==B);}else{return(this.fn==A);}};YAHOO.util.Subscriber.prototype.toString=function(){return"Subscriber { obj: "+this.obj+", overrideContext: "+(this.overrideContext||"no")+" }";};if(!YAHOO.util.Event){YAHOO.util.Event=function(){var G=false,H=[],J=[],A=0,E=[],B=0,C={63232:38,63233:40,63234:37,63235:39,63276:33,63277:34,25:9},D=YAHOO.env.ua.ie,F="focusin",I="focusout";return{POLL_RETRYS:500,POLL_INTERVAL:40,EL:0,TYPE:1,FN:2,WFN:3,UNLOAD_OBJ:3,ADJ_SCOPE:4,OBJ:5,OVERRIDE:6,CAPTURE:7,lastError:null,isSafari:YAHOO.env.ua.webkit,webkit:YAHOO.env.ua.webkit,isIE:D,_interval:null,_dri:null,_specialTypes:{focusin:(D?"focusin":"focus"),focusout:(D?"focusout":"blur")},DOMReady:false,throwErrors:false,startInterval:function(){if(!this._interval){this._interval=YAHOO.lang.later(this.POLL_INTERVAL,this,this._tryPreloadAttach,null,true);}},onAvailable:function(Q,M,O,P,N){var K=(YAHOO.lang.isString(Q))?[Q]:Q;for(var L=0;L<K.length;L=L+1){E.push({id:K[L],fn:M,obj:O,overrideContext:P,checkReady:N});}A=this.POLL_RETRYS;this.startInterval();},onContentReady:function(N,K,L,M){this.onAvailable(N,K,L,M,true);},onDOMReady:function(){this.DOMReadyEvent.subscribe.apply(this.DOMReadyEvent,arguments);},_addListener:function(M,K,V,P,T,Y){if(!V||!V.call){return false;}if(this._isValidCollection(M)){var W=true;for(var Q=0,S=M.length;Q<S;++Q){W=this.on(M[Q],K,V,P,T)&&W;}return W;}else{if(YAHOO.lang.isString(M)){var O=this.getEl(M);if(O){M=O;}else{this.onAvailable(M,function(){YAHOO.util.Event._addListener(M,K,V,P,T,Y);});return true;}}}if(!M){return false;}if("unload"==K&&P!==this){J[J.length]=[M,K,V,P,T];return true;}var L=M;if(T){if(T===true){L=P;}else{L=T;}}var N=function(Z){return V.call(L,YAHOO.util.Event.getEvent(Z,M),P);};var X=[M,K,V,N,L,P,T,Y];var R=H.length;H[R]=X;try{this._simpleAdd(M,K,N,Y);}catch(U){this.lastError=U;this.removeListener(M,K,V);return false;}return true;},_getType:function(K){return this._specialTypes[K]||K;},addListener:function(M,P,L,N,O){var K=((P==F||P==I)&&!YAHOO.env.ua.ie)?true:false;return this._addListener(M,this._getType(P),L,N,O,K);},addFocusListener:function(L,K,M,N){return this.on(L,F,K,M,N);},removeFocusListener:function(L,K){return this.removeListener(L,F,K);},addBlurListener:function(L,K,M,N){return this.on(L,I,K,M,N);},removeBlurListener:function(L,K){return this.removeListener(L,I,K);},removeListener:function(L,K,R){var M,P,U;K=this._getType(K);if(typeof L=="string"){L=this.getEl(L);}else{if(this._isValidCollection(L)){var S=true;for(M=L.length-1;M>-1;M--){S=(this.removeListener(L[M],K,R)&&S);}return S;}}if(!R||!R.call){return this.purgeElement(L,false,K);}if("unload"==K){for(M=J.length-1;M>-1;M--){U=J[M];if(U&&U[0]==L&&U[1]==K&&U[2]==R){J.splice(M,1);return true;}}return false;}var N=null;var O=arguments[3];if("undefined"===typeof O){O=this._getCacheIndex(H,L,K,R);}if(O>=0){N=H[O];}if(!L||!N){return false;}var T=N[this.CAPTURE]===true?true:false;try{this._simpleRemove(L,K,N[this.WFN],T);}catch(Q){this.lastError=Q;return false;}delete H[O][this.WFN];delete H[O][this.FN];H.splice(O,1);return true;},getTarget:function(M,L){var K=M.target||M.srcElement;return this.resolveTextNode(K);},resolveTextNode:function(L){try{if(L&&3==L.nodeType){return L.parentNode;}}catch(K){}return L;},getPageX:function(L){var K=L.pageX;if(!K&&0!==K){K=L.clientX||0;if(this.isIE){K+=this._getScrollLeft();}}return K;},getPageY:function(K){var L=K.pageY;if(!L&&0!==L){L=K.clientY||0;if(this.isIE){L+=this._getScrollTop();}}return L;},getXY:function(K){return[this.getPageX(K),this.getPageY(K)];},getRelatedTarget:function(L){var K=L.relatedTarget;if(!K){if(L.type=="mouseout"){K=L.toElement;
}else{if(L.type=="mouseover"){K=L.fromElement;}}}return this.resolveTextNode(K);},getTime:function(M){if(!M.time){var L=new Date().getTime();try{M.time=L;}catch(K){this.lastError=K;return L;}}return M.time;},stopEvent:function(K){this.stopPropagation(K);this.preventDefault(K);},stopPropagation:function(K){if(K.stopPropagation){K.stopPropagation();}else{K.cancelBubble=true;}},preventDefault:function(K){if(K.preventDefault){K.preventDefault();}else{K.returnValue=false;}},getEvent:function(M,K){var L=M||window.event;if(!L){var N=this.getEvent.caller;while(N){L=N.arguments[0];if(L&&Event==L.constructor){break;}N=N.caller;}}return L;},getCharCode:function(L){var K=L.keyCode||L.charCode||0;if(YAHOO.env.ua.webkit&&(K in C)){K=C[K];}return K;},_getCacheIndex:function(M,P,Q,O){for(var N=0,L=M.length;N<L;N=N+1){var K=M[N];if(K&&K[this.FN]==O&&K[this.EL]==P&&K[this.TYPE]==Q){return N;}}return -1;},generateId:function(K){var L=K.id;if(!L){L="yuievtautoid-"+B;++B;K.id=L;}return L;},_isValidCollection:function(L){try{return(L&&typeof L!=="string"&&L.length&&!L.tagName&&!L.alert&&typeof L[0]!=="undefined");}catch(K){return false;}},elCache:{},getEl:function(K){return(typeof K==="string")?document.getElementById(K):K;},clearCache:function(){},DOMReadyEvent:new YAHOO.util.CustomEvent("DOMReady",YAHOO,0,0,1),_load:function(L){if(!G){G=true;var K=YAHOO.util.Event;K._ready();K._tryPreloadAttach();}},_ready:function(L){var K=YAHOO.util.Event;if(!K.DOMReady){K.DOMReady=true;K.DOMReadyEvent.fire();K._simpleRemove(document,"DOMContentLoaded",K._ready);}},_tryPreloadAttach:function(){if(E.length===0){A=0;if(this._interval){this._interval.cancel();this._interval=null;}return;}if(this.locked){return;}if(this.isIE){if(!this.DOMReady){this.startInterval();return;}}this.locked=true;var Q=!G;if(!Q){Q=(A>0&&E.length>0);}var P=[];var R=function(T,U){var S=T;if(U.overrideContext){if(U.overrideContext===true){S=U.obj;}else{S=U.overrideContext;}}U.fn.call(S,U.obj);};var L,K,O,N,M=[];for(L=0,K=E.length;L<K;L=L+1){O=E[L];if(O){N=this.getEl(O.id);if(N){if(O.checkReady){if(G||N.nextSibling||!Q){M.push(O);E[L]=null;}}else{R(N,O);E[L]=null;}}else{P.push(O);}}}for(L=0,K=M.length;L<K;L=L+1){O=M[L];R(this.getEl(O.id),O);}A--;if(Q){for(L=E.length-1;L>-1;L--){O=E[L];if(!O||!O.id){E.splice(L,1);}}this.startInterval();}else{if(this._interval){this._interval.cancel();this._interval=null;}}this.locked=false;},purgeElement:function(O,P,R){var M=(YAHOO.lang.isString(O))?this.getEl(O):O;var Q=this.getListeners(M,R),N,K;if(Q){for(N=Q.length-1;N>-1;N--){var L=Q[N];this.removeListener(M,L.type,L.fn);}}if(P&&M&&M.childNodes){for(N=0,K=M.childNodes.length;N<K;++N){this.purgeElement(M.childNodes[N],P,R);}}},getListeners:function(M,K){var P=[],L;if(!K){L=[H,J];}else{if(K==="unload"){L=[J];}else{K=this._getType(K);L=[H];}}var R=(YAHOO.lang.isString(M))?this.getEl(M):M;for(var O=0;O<L.length;O=O+1){var T=L[O];if(T){for(var Q=0,S=T.length;Q<S;++Q){var N=T[Q];if(N&&N[this.EL]===R&&(!K||K===N[this.TYPE])){P.push({type:N[this.TYPE],fn:N[this.FN],obj:N[this.OBJ],adjust:N[this.OVERRIDE],scope:N[this.ADJ_SCOPE],index:Q});}}}}return(P.length)?P:null;},_unload:function(R){var L=YAHOO.util.Event,O,N,M,Q,P,S=J.slice(),K;for(O=0,Q=J.length;O<Q;++O){M=S[O];if(M){K=window;if(M[L.ADJ_SCOPE]){if(M[L.ADJ_SCOPE]===true){K=M[L.UNLOAD_OBJ];}else{K=M[L.ADJ_SCOPE];}}M[L.FN].call(K,L.getEvent(R,M[L.EL]),M[L.UNLOAD_OBJ]);S[O]=null;}}M=null;K=null;J=null;if(H){for(N=H.length-1;N>-1;N--){M=H[N];if(M){L.removeListener(M[L.EL],M[L.TYPE],M[L.FN],N);}}M=null;}L._simpleRemove(window,"unload",L._unload);},_getScrollLeft:function(){return this._getScroll()[1];},_getScrollTop:function(){return this._getScroll()[0];},_getScroll:function(){var K=document.documentElement,L=document.body;if(K&&(K.scrollTop||K.scrollLeft)){return[K.scrollTop,K.scrollLeft];}else{if(L){return[L.scrollTop,L.scrollLeft];}else{return[0,0];}}},regCE:function(){},_simpleAdd:function(){if(window.addEventListener){return function(M,N,L,K){M.addEventListener(N,L,(K));};}else{if(window.attachEvent){return function(M,N,L,K){M.attachEvent("on"+N,L);};}else{return function(){};}}}(),_simpleRemove:function(){if(window.removeEventListener){return function(M,N,L,K){M.removeEventListener(N,L,(K));};}else{if(window.detachEvent){return function(L,M,K){L.detachEvent("on"+M,K);};}else{return function(){};}}}()};}();(function(){var EU=YAHOO.util.Event;EU.on=EU.addListener;EU.onFocus=EU.addFocusListener;EU.onBlur=EU.addBlurListener;
/* DOMReady: based on work by: Dean Edwards/John Resig/Matthias Miller/Diego Perini */
if(EU.isIE){if(self!==self.top){document.onreadystatechange=function(){if(document.readyState=="complete"){document.onreadystatechange=null;EU._ready();}};}else{YAHOO.util.Event.onDOMReady(YAHOO.util.Event._tryPreloadAttach,YAHOO.util.Event,true);var n=document.createElement("p");EU._dri=setInterval(function(){try{n.doScroll("left");clearInterval(EU._dri);EU._dri=null;EU._ready();n=null;}catch(ex){}},EU.POLL_INTERVAL);}}else{if(EU.webkit&&EU.webkit<525){EU._dri=setInterval(function(){var rs=document.readyState;if("loaded"==rs||"complete"==rs){clearInterval(EU._dri);EU._dri=null;EU._ready();}},EU.POLL_INTERVAL);}else{EU._simpleAdd(document,"DOMContentLoaded",EU._ready);}}EU._simpleAdd(window,"load",EU._load);EU._simpleAdd(window,"unload",EU._unload);EU._tryPreloadAttach();})();}YAHOO.util.EventProvider=function(){};YAHOO.util.EventProvider.prototype={__yui_events:null,__yui_subscribers:null,subscribe:function(A,C,F,E){this.__yui_events=this.__yui_events||{};var D=this.__yui_events[A];if(D){D.subscribe(C,F,E);}else{this.__yui_subscribers=this.__yui_subscribers||{};var B=this.__yui_subscribers;if(!B[A]){B[A]=[];}B[A].push({fn:C,obj:F,overrideContext:E});}},unsubscribe:function(C,E,G){this.__yui_events=this.__yui_events||{};var A=this.__yui_events;if(C){var F=A[C];if(F){return F.unsubscribe(E,G);}}else{var B=true;for(var D in A){if(YAHOO.lang.hasOwnProperty(A,D)){B=B&&A[D].unsubscribe(E,G);}}return B;}return false;},unsubscribeAll:function(A){return this.unsubscribe(A);
},createEvent:function(B,G){this.__yui_events=this.__yui_events||{};var E=G||{},D=this.__yui_events,F;if(D[B]){}else{F=new YAHOO.util.CustomEvent(B,E.scope||this,E.silent,YAHOO.util.CustomEvent.FLAT,E.fireOnce);D[B]=F;if(E.onSubscribeCallback){F.subscribeEvent.subscribe(E.onSubscribeCallback);}this.__yui_subscribers=this.__yui_subscribers||{};var A=this.__yui_subscribers[B];if(A){for(var C=0;C<A.length;++C){F.subscribe(A[C].fn,A[C].obj,A[C].overrideContext);}}}return D[B];},fireEvent:function(B){this.__yui_events=this.__yui_events||{};var D=this.__yui_events[B];if(!D){return null;}var A=[];for(var C=1;C<arguments.length;++C){A.push(arguments[C]);}return D.fire.apply(D,A);},hasEvent:function(A){if(this.__yui_events){if(this.__yui_events[A]){return true;}}return false;}};(function(){var A=YAHOO.util.Event,C=YAHOO.lang;YAHOO.util.KeyListener=function(D,I,E,F){if(!D){}else{if(!I){}else{if(!E){}}}if(!F){F=YAHOO.util.KeyListener.KEYDOWN;}var G=new YAHOO.util.CustomEvent("keyPressed");this.enabledEvent=new YAHOO.util.CustomEvent("enabled");this.disabledEvent=new YAHOO.util.CustomEvent("disabled");if(C.isString(D)){D=document.getElementById(D);}if(C.isFunction(E)){G.subscribe(E);}else{G.subscribe(E.fn,E.scope,E.correctScope);}function H(O,N){if(!I.shift){I.shift=false;}if(!I.alt){I.alt=false;}if(!I.ctrl){I.ctrl=false;}if(O.shiftKey==I.shift&&O.altKey==I.alt&&O.ctrlKey==I.ctrl){var J,M=I.keys,L;if(YAHOO.lang.isArray(M)){for(var K=0;K<M.length;K++){J=M[K];L=A.getCharCode(O);if(J==L){G.fire(L,O);break;}}}else{L=A.getCharCode(O);if(M==L){G.fire(L,O);}}}}this.enable=function(){if(!this.enabled){A.on(D,F,H);this.enabledEvent.fire(I);}this.enabled=true;};this.disable=function(){if(this.enabled){A.removeListener(D,F,H);this.disabledEvent.fire(I);}this.enabled=false;};this.toString=function(){return"KeyListener ["+I.keys+"] "+D.tagName+(D.id?"["+D.id+"]":"");};};var B=YAHOO.util.KeyListener;B.KEYDOWN="keydown";B.KEYUP="keyup";B.KEY={ALT:18,BACK_SPACE:8,CAPS_LOCK:20,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,META:224,NUM_LOCK:144,PAGE_DOWN:34,PAGE_UP:33,PAUSE:19,PRINTSCREEN:44,RIGHT:39,SCROLL_LOCK:145,SHIFT:16,SPACE:32,TAB:9,UP:38};})();YAHOO.register("event",YAHOO.util.Event,{version:"2.8.0r4",build:"2449"});YAHOO.register("yahoo-dom-event", YAHOO, {version: "2.8.0r4", build: "2449"});
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.8.0r4
*/
(function(){var l=YAHOO.lang,isFunction=l.isFunction,isObject=l.isObject,isArray=l.isArray,_toStr=Object.prototype.toString,Native=(YAHOO.env.ua.caja?window:this).JSON,_UNICODE_EXCEPTIONS=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,_ESCAPES=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,_VALUES=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,_BRACKETS=/(?:^|:|,)(?:\s*\[)+/g,_UNSAFE=/^[\],:{}\s]*$/,_SPECIAL_CHARS=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,_CHARS={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},UNDEFINED="undefined",OBJECT="object",NULL="null",STRING="string",NUMBER="number",BOOLEAN="boolean",DATE="date",_allowable={"undefined":UNDEFINED,"string":STRING,"[object String]":STRING,"number":NUMBER,"[object Number]":NUMBER,"boolean":BOOLEAN,"[object Boolean]":BOOLEAN,"[object Date]":DATE,"[object RegExp]":OBJECT},EMPTY="",OPEN_O="{",CLOSE_O="}",OPEN_A="[",CLOSE_A="]",COMMA=",",COMMA_CR=",\n",CR="\n",COLON=":",COLON_SP=": ",QUOTE='"';Native=_toStr.call(Native)==="[object JSON]"&&Native;function _char(c){if(!_CHARS[c]){_CHARS[c]="\\u"+("0000"+(+(c.charCodeAt(0))).toString(16)).slice(-4);}return _CHARS[c];}function _revive(data,reviver){var walk=function(o,key){var k,v,value=o[key];if(value&&typeof value==="object"){for(k in value){if(l.hasOwnProperty(value,k)){v=walk(value,k);if(v===undefined){delete value[k];}else{value[k]=v;}}}}return reviver.call(o,key,value);};return typeof reviver==="function"?walk({"":data},""):data;}function _prepare(s){return s.replace(_UNICODE_EXCEPTIONS,_char);}function _isSafe(str){return l.isString(str)&&_UNSAFE.test(str.replace(_ESCAPES,"@").replace(_VALUES,"]").replace(_BRACKETS,""));}function _parse(s,reviver){s=_prepare(s);if(_isSafe(s)){return _revive(eval("("+s+")"),reviver);}throw new SyntaxError("JSON.parse");}function _type(o){var t=typeof o;return _allowable[t]||_allowable[_toStr.call(o)]||(t===OBJECT?(o?OBJECT:NULL):UNDEFINED);}function _string(s){return QUOTE+s.replace(_SPECIAL_CHARS,_char)+QUOTE;}function _indent(s,space){return s.replace(/^/gm,space);}function _stringify(o,w,space){if(o===undefined){return undefined;}var replacer=isFunction(w)?w:null,format=_toStr.call(space).match(/String|Number/)||[],_date=YAHOO.lang.JSON.dateToString,stack=[],tmp,i,len;if(replacer||!isArray(w)){w=undefined;}if(w){tmp={};for(i=0,len=w.length;i<len;++i){tmp[w[i]]=true;}w=tmp;}space=format[0]==="Number"?new Array(Math.min(Math.max(0,space),10)+1).join(" "):(space||EMPTY).slice(0,10);function _serialize(h,key){var value=h[key],t=_type(value),a=[],colon=space?COLON_SP:COLON,arr,i,keys,k,v;if(isObject(value)&&isFunction(value.toJSON)){value=value.toJSON(key);}else{if(t===DATE){value=_date(value);}}if(isFunction(replacer)){value=replacer.call(h,key,value);}if(value!==h[key]){t=_type(value);}switch(t){case DATE:case OBJECT:break;case STRING:return _string(value);case NUMBER:return isFinite(value)?value+EMPTY:NULL;case BOOLEAN:return value+EMPTY;case NULL:return NULL;default:return undefined;}for(i=stack.length-1;i>=0;--i){if(stack[i]===value){throw new Error("JSON.stringify. Cyclical reference");}}arr=isArray(value);stack.push(value);if(arr){for(i=value.length-1;i>=0;--i){a[i]=_serialize(value,i)||NULL;}}else{keys=w||value;i=0;for(k in keys){if(keys.hasOwnProperty(k)){v=_serialize(value,k);if(v){a[i++]=_string(k)+colon+v;}}}}stack.pop();if(space&&a.length){return arr?OPEN_A+CR+_indent(a.join(COMMA_CR),space)+CR+CLOSE_A:OPEN_O+CR+_indent(a.join(COMMA_CR),space)+CR+CLOSE_O;}else{return arr?OPEN_A+a.join(COMMA)+CLOSE_A:OPEN_O+a.join(COMMA)+CLOSE_O;}}return _serialize({"":o},"");}YAHOO.lang.JSON={useNativeParse:!!Native,useNativeStringify:!!Native,isSafe:function(s){return _isSafe(_prepare(s));},parse:function(s,reviver){return Native&&YAHOO.lang.JSON.useNativeParse?Native.parse(s,reviver):_parse(s,reviver);},stringify:function(o,w,space){return Native&&YAHOO.lang.JSON.useNativeStringify?Native.stringify(o,w,space):_stringify(o,w,space);},dateToString:function(d){function _zeroPad(v){return v<10?"0"+v:v;}return d.getUTCFullYear()+"-"+_zeroPad(d.getUTCMonth()+1)+"-"+_zeroPad(d.getUTCDate())+"T"+_zeroPad(d.getUTCHours())+COLON+_zeroPad(d.getUTCMinutes())+COLON+_zeroPad(d.getUTCSeconds())+"Z";},stringToDate:function(str){var m=str.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{3}))?Z$/);if(m){var d=new Date();d.setUTCFullYear(m[1],m[2]-1,m[3]);d.setUTCHours(m[4],m[5],m[6],(m[7]||0));return d;}return str;}};YAHOO.lang.JSON.isValid=YAHOO.lang.JSON.isSafe;})();YAHOO.register("json",YAHOO.lang.JSON,{version:"2.8.0r4",build:"2449"});/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.8.0r4
*/
YAHOO.util.Connect={_msxml_progid:["Microsoft.XMLHTTP","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP"],_http_headers:{},_has_http_headers:false,_use_default_post_header:true,_default_post_header:"application/x-www-form-urlencoded; charset=UTF-8",_default_form_header:"application/x-www-form-urlencoded",_use_default_xhr_header:true,_default_xhr_header:"XMLHttpRequest",_has_default_headers:true,_default_headers:{},_poll:{},_timeOut:{},_polling_interval:50,_transaction_id:0,startEvent:new YAHOO.util.CustomEvent("start"),completeEvent:new YAHOO.util.CustomEvent("complete"),successEvent:new YAHOO.util.CustomEvent("success"),failureEvent:new YAHOO.util.CustomEvent("failure"),abortEvent:new YAHOO.util.CustomEvent("abort"),_customEvents:{onStart:["startEvent","start"],onComplete:["completeEvent","complete"],onSuccess:["successEvent","success"],onFailure:["failureEvent","failure"],onUpload:["uploadEvent","upload"],onAbort:["abortEvent","abort"]},setProgId:function(A){this._msxml_progid.unshift(A);},setDefaultPostHeader:function(A){if(typeof A=="string"){this._default_post_header=A;}else{if(typeof A=="boolean"){this._use_default_post_header=A;}}},setDefaultXhrHeader:function(A){if(typeof A=="string"){this._default_xhr_header=A;}else{this._use_default_xhr_header=A;}},setPollingInterval:function(A){if(typeof A=="number"&&isFinite(A)){this._polling_interval=A;}},createXhrObject:function(F){var D,A,B;try{A=new XMLHttpRequest();D={conn:A,tId:F,xhr:true};}catch(C){for(B=0;B<this._msxml_progid.length;++B){try{A=new ActiveXObject(this._msxml_progid[B]);D={conn:A,tId:F,xhr:true};break;}catch(E){}}}finally{return D;}},getConnectionObject:function(A){var C,D=this._transaction_id;try{if(!A){C=this.createXhrObject(D);}else{C={tId:D};if(A==="xdr"){C.conn=this._transport;C.xdr=true;}else{if(A==="upload"){C.upload=true;}}}if(C){this._transaction_id++;}}catch(B){}return C;},asyncRequest:function(G,D,F,A){var E,C,B=(F&&F.argument)?F.argument:null;if(this._isFileUpload){C="upload";}else{if(F.xdr){C="xdr";}}E=this.getConnectionObject(C);if(!E){return null;}else{if(F&&F.customevents){this.initCustomEvents(E,F);}if(this._isFormSubmit){if(this._isFileUpload){this.uploadFile(E,F,D,A);return E;}if(G.toUpperCase()=="GET"){if(this._sFormData.length!==0){D+=((D.indexOf("?")==-1)?"?":"&")+this._sFormData;}}else{if(G.toUpperCase()=="POST"){A=A?this._sFormData+"&"+A:this._sFormData;}}}if(G.toUpperCase()=="GET"&&(F&&F.cache===false)){D+=((D.indexOf("?")==-1)?"?":"&")+"rnd="+new Date().valueOf().toString();}if(this._use_default_xhr_header){if(!this._default_headers["X-Requested-With"]){this.initHeader("X-Requested-With",this._default_xhr_header,true);}}if((G.toUpperCase()==="POST"&&this._use_default_post_header)&&this._isFormSubmit===false){this.initHeader("Content-Type",this._default_post_header);}if(E.xdr){this.xdr(E,G,D,F,A);return E;}E.conn.open(G,D,true);if(this._has_default_headers||this._has_http_headers){this.setHeader(E);}this.handleReadyState(E,F);E.conn.send(A||"");if(this._isFormSubmit===true){this.resetFormState();}this.startEvent.fire(E,B);if(E.startEvent){E.startEvent.fire(E,B);}return E;}},initCustomEvents:function(A,C){var B;for(B in C.customevents){if(this._customEvents[B][0]){A[this._customEvents[B][0]]=new YAHOO.util.CustomEvent(this._customEvents[B][1],(C.scope)?C.scope:null);A[this._customEvents[B][0]].subscribe(C.customevents[B]);}}},handleReadyState:function(C,D){var B=this,A=(D&&D.argument)?D.argument:null;if(D&&D.timeout){this._timeOut[C.tId]=window.setTimeout(function(){B.abort(C,D,true);},D.timeout);}this._poll[C.tId]=window.setInterval(function(){if(C.conn&&C.conn.readyState===4){window.clearInterval(B._poll[C.tId]);delete B._poll[C.tId];if(D&&D.timeout){window.clearTimeout(B._timeOut[C.tId]);delete B._timeOut[C.tId];}B.completeEvent.fire(C,A);if(C.completeEvent){C.completeEvent.fire(C,A);}B.handleTransactionResponse(C,D);}},this._polling_interval);},handleTransactionResponse:function(B,I,D){var E,A,G=(I&&I.argument)?I.argument:null,C=(B.r&&B.r.statusText==="xdr:success")?true:false,H=(B.r&&B.r.statusText==="xdr:failure")?true:false,J=D;try{if((B.conn.status!==undefined&&B.conn.status!==0)||C){E=B.conn.status;}else{if(H&&!J){E=0;}else{E=13030;}}}catch(F){E=13030;}if((E>=200&&E<300)||E===1223||C){A=B.xdr?B.r:this.createResponseObject(B,G);if(I&&I.success){if(!I.scope){I.success(A);}else{I.success.apply(I.scope,[A]);}}this.successEvent.fire(A);if(B.successEvent){B.successEvent.fire(A);}}else{switch(E){case 12002:case 12029:case 12030:case 12031:case 12152:case 13030:A=this.createExceptionObject(B.tId,G,(D?D:false));if(I&&I.failure){if(!I.scope){I.failure(A);}else{I.failure.apply(I.scope,[A]);}}break;default:A=(B.xdr)?B.response:this.createResponseObject(B,G);if(I&&I.failure){if(!I.scope){I.failure(A);}else{I.failure.apply(I.scope,[A]);}}}this.failureEvent.fire(A);if(B.failureEvent){B.failureEvent.fire(A);}}this.releaseObject(B);A=null;},createResponseObject:function(A,G){var D={},I={},E,C,F,B;try{C=A.conn.getAllResponseHeaders();F=C.split("\n");for(E=0;E<F.length;E++){B=F[E].indexOf(":");if(B!=-1){I[F[E].substring(0,B)]=YAHOO.lang.trim(F[E].substring(B+2));}}}catch(H){}D.tId=A.tId;D.status=(A.conn.status==1223)?204:A.conn.status;D.statusText=(A.conn.status==1223)?"No Content":A.conn.statusText;D.getResponseHeader=I;D.getAllResponseHeaders=C;D.responseText=A.conn.responseText;D.responseXML=A.conn.responseXML;if(G){D.argument=G;}return D;},createExceptionObject:function(H,D,A){var F=0,G="communication failure",C=-1,B="transaction aborted",E={};E.tId=H;if(A){E.status=C;E.statusText=B;}else{E.status=F;E.statusText=G;}if(D){E.argument=D;}return E;},initHeader:function(A,D,C){var B=(C)?this._default_headers:this._http_headers;B[A]=D;if(C){this._has_default_headers=true;}else{this._has_http_headers=true;}},setHeader:function(A){var B;if(this._has_default_headers){for(B in this._default_headers){if(YAHOO.lang.hasOwnProperty(this._default_headers,B)){A.conn.setRequestHeader(B,this._default_headers[B]);}}}if(this._has_http_headers){for(B in this._http_headers){if(YAHOO.lang.hasOwnProperty(this._http_headers,B)){A.conn.setRequestHeader(B,this._http_headers[B]);
}}this._http_headers={};this._has_http_headers=false;}},resetDefaultHeaders:function(){this._default_headers={};this._has_default_headers=false;},abort:function(E,G,A){var D,B=(G&&G.argument)?G.argument:null;E=E||{};if(E.conn){if(E.xhr){if(this.isCallInProgress(E)){E.conn.abort();window.clearInterval(this._poll[E.tId]);delete this._poll[E.tId];if(A){window.clearTimeout(this._timeOut[E.tId]);delete this._timeOut[E.tId];}D=true;}}else{if(E.xdr){E.conn.abort(E.tId);D=true;}}}else{if(E.upload){var C="yuiIO"+E.tId;var F=document.getElementById(C);if(F){YAHOO.util.Event.removeListener(F,"load");document.body.removeChild(F);if(A){window.clearTimeout(this._timeOut[E.tId]);delete this._timeOut[E.tId];}D=true;}}else{D=false;}}if(D===true){this.abortEvent.fire(E,B);if(E.abortEvent){E.abortEvent.fire(E,B);}this.handleTransactionResponse(E,G,true);}return D;},isCallInProgress:function(A){A=A||{};if(A.xhr&&A.conn){return A.conn.readyState!==4&&A.conn.readyState!==0;}else{if(A.xdr&&A.conn){return A.conn.isCallInProgress(A.tId);}else{if(A.upload===true){return document.getElementById("yuiIO"+A.tId)?true:false;}else{return false;}}}},releaseObject:function(A){if(A&&A.conn){A.conn=null;A=null;}}};(function(){var G=YAHOO.util.Connect,H={};function D(I){var J='<object id="YUIConnectionSwf" type="application/x-shockwave-flash" data="'+I+'" width="0" height="0">'+'<param name="movie" value="'+I+'">'+'<param name="allowScriptAccess" value="always">'+"</object>",K=document.createElement("div");document.body.appendChild(K);K.innerHTML=J;}function B(L,I,J,M,K){H[parseInt(L.tId)]={"o":L,"c":M};if(K){M.method=I;M.data=K;}L.conn.send(J,M,L.tId);}function E(I){D(I);G._transport=document.getElementById("YUIConnectionSwf");}function C(){G.xdrReadyEvent.fire();}function A(J,I){if(J){G.startEvent.fire(J,I.argument);if(J.startEvent){J.startEvent.fire(J,I.argument);}}}function F(J){var K=H[J.tId].o,I=H[J.tId].c;if(J.statusText==="xdr:start"){A(K,I);return;}J.responseText=decodeURI(J.responseText);K.r=J;if(I.argument){K.r.argument=I.argument;}this.handleTransactionResponse(K,I,J.statusText==="xdr:abort"?true:false);delete H[J.tId];}G.xdr=B;G.swf=D;G.transport=E;G.xdrReadyEvent=new YAHOO.util.CustomEvent("xdrReady");G.xdrReady=C;G.handleXdrResponse=F;})();(function(){var D=YAHOO.util.Connect,F=YAHOO.util.Event;D._isFormSubmit=false;D._isFileUpload=false;D._formNode=null;D._sFormData=null;D._submitElementValue=null;D.uploadEvent=new YAHOO.util.CustomEvent("upload"),D._hasSubmitListener=function(){if(F){F.addListener(document,"click",function(J){var I=F.getTarget(J),H=I.nodeName.toLowerCase();if((H==="input"||H==="button")&&(I.type&&I.type.toLowerCase()=="submit")){D._submitElementValue=encodeURIComponent(I.name)+"="+encodeURIComponent(I.value);}});return true;}return false;}();function G(T,O,J){var S,I,R,P,W,Q=false,M=[],V=0,L,N,K,U,H;this.resetFormState();if(typeof T=="string"){S=(document.getElementById(T)||document.forms[T]);}else{if(typeof T=="object"){S=T;}else{return;}}if(O){this.createFrame(J?J:null);this._isFormSubmit=true;this._isFileUpload=true;this._formNode=S;return;}for(L=0,N=S.elements.length;L<N;++L){I=S.elements[L];W=I.disabled;R=I.name;if(!W&&R){R=encodeURIComponent(R)+"=";P=encodeURIComponent(I.value);switch(I.type){case"select-one":if(I.selectedIndex>-1){H=I.options[I.selectedIndex];M[V++]=R+encodeURIComponent((H.attributes.value&&H.attributes.value.specified)?H.value:H.text);}break;case"select-multiple":if(I.selectedIndex>-1){for(K=I.selectedIndex,U=I.options.length;K<U;++K){H=I.options[K];if(H.selected){M[V++]=R+encodeURIComponent((H.attributes.value&&H.attributes.value.specified)?H.value:H.text);}}}break;case"radio":case"checkbox":if(I.checked){M[V++]=R+P;}break;case"file":case undefined:case"reset":case"button":break;case"submit":if(Q===false){if(this._hasSubmitListener&&this._submitElementValue){M[V++]=this._submitElementValue;}Q=true;}break;default:M[V++]=R+P;}}}this._isFormSubmit=true;this._sFormData=M.join("&");this.initHeader("Content-Type",this._default_form_header);return this._sFormData;}function C(){this._isFormSubmit=false;this._isFileUpload=false;this._formNode=null;this._sFormData="";}function B(H){var I="yuiIO"+this._transaction_id,J;if(YAHOO.env.ua.ie){J=document.createElement('<iframe id="'+I+'" name="'+I+'" />');if(typeof H=="boolean"){J.src="javascript:false";}}else{J=document.createElement("iframe");J.id=I;J.name=I;}J.style.position="absolute";J.style.top="-1000px";J.style.left="-1000px";document.body.appendChild(J);}function E(H){var K=[],I=H.split("&"),J,L;for(J=0;J<I.length;J++){L=I[J].indexOf("=");if(L!=-1){K[J]=document.createElement("input");K[J].type="hidden";K[J].name=decodeURIComponent(I[J].substring(0,L));K[J].value=decodeURIComponent(I[J].substring(L+1));this._formNode.appendChild(K[J]);}}return K;}function A(K,V,L,J){var Q="yuiIO"+K.tId,R="multipart/form-data",T=document.getElementById(Q),M=(document.documentMode&&document.documentMode===8)?true:false,W=this,S=(V&&V.argument)?V.argument:null,U,P,I,O,H,N;H={action:this._formNode.getAttribute("action"),method:this._formNode.getAttribute("method"),target:this._formNode.getAttribute("target")};this._formNode.setAttribute("action",L);this._formNode.setAttribute("method","POST");this._formNode.setAttribute("target",Q);if(YAHOO.env.ua.ie&&!M){this._formNode.setAttribute("encoding",R);}else{this._formNode.setAttribute("enctype",R);}if(J){U=this.appendPostData(J);}this._formNode.submit();this.startEvent.fire(K,S);if(K.startEvent){K.startEvent.fire(K,S);}if(V&&V.timeout){this._timeOut[K.tId]=window.setTimeout(function(){W.abort(K,V,true);},V.timeout);}if(U&&U.length>0){for(P=0;P<U.length;P++){this._formNode.removeChild(U[P]);}}for(I in H){if(YAHOO.lang.hasOwnProperty(H,I)){if(H[I]){this._formNode.setAttribute(I,H[I]);}else{this._formNode.removeAttribute(I);}}}this.resetFormState();N=function(){if(V&&V.timeout){window.clearTimeout(W._timeOut[K.tId]);delete W._timeOut[K.tId];}W.completeEvent.fire(K,S);if(K.completeEvent){K.completeEvent.fire(K,S);
}O={tId:K.tId,argument:V.argument};try{O.responseText=T.contentWindow.document.body?T.contentWindow.document.body.innerHTML:T.contentWindow.document.documentElement.textContent;O.responseXML=T.contentWindow.document.XMLDocument?T.contentWindow.document.XMLDocument:T.contentWindow.document;}catch(X){}if(V&&V.upload){if(!V.scope){V.upload(O);}else{V.upload.apply(V.scope,[O]);}}W.uploadEvent.fire(O);if(K.uploadEvent){K.uploadEvent.fire(O);}F.removeListener(T,"load",N);setTimeout(function(){document.body.removeChild(T);W.releaseObject(K);},100);};F.addListener(T,"load",N);}D.setForm=G;D.resetFormState=C;D.createFrame=B;D.appendPostData=E;D.uploadFile=A;})();YAHOO.register("connection",YAHOO.util.Connect,{version:"2.8.0r4",build:"2449"});/**
 * KISSY.Editor ���ı��༭��
 *
 * @creator     ��<lifesinger@gmail.com>
 * @depends     yahoo-dom-event
 */

var KISSY = window.KISSY || {};

/**
 * @class Editor
 * @constructor
 * @param {string|HTMLElement} textarea
 * @param {object} config
 */
KISSY.Editor = function(textarea, config) {
    var E = KISSY.Editor;

    if (!(this instanceof E)) {
        return new E(textarea, config);
    } else {
        if (!E._isReady) {
            E._setup();
        }
        return new E.Instance(textarea, config);
    }
};

(function(E) {
    var Lang = YAHOO.lang;

    Lang.augmentObject(E, {
        /**
         * �汾��
         */
        version: "0.1",

        /**
         * �������ã��� lang Ŀ¼���
         */
        lang: {},

        /**
         * ������ӵ�ģ��
         * ע��mod = { name: modName, fn: initFn, details: {...} }
         */
        mods: {},

        /**
         * ����ע��Ĳ��
         * ע��plugin = { name: pluginName, type: pluginType, init: initFn, ... }
         */
        plugins: {},

        /**
         * ���ģ��
         */
        add: function(name, fn, details) {

            this.mods[name] = {
                name: name,
                fn: fn,
                details: details || {}
            };

            return this; // chain support
        },

        /**
         * ��Ӳ��
         * @param {string|Array} name
         */
        addPlugin: function(name, p) {
            var arr = typeof name == "string" ? [name] : name,
                plugins = this.plugins,
                key, i, len;

            for (i = 0,len = arr.length; i < len; ++i) {
                key = arr[i];

                if (!plugins[key]) { // ��������
                    plugins[key] = Lang.merge(p, {
                        name: key
                    });
                }
            }
        },

        /**
         * �Ƿ������ setup
         */
        _isReady: false,

        /**
         * setup to use
         */
        _setup: function() {
            this._loadModules();
            this._isReady = true;
        },

        /**
         * �Ѽ��ص�ģ��
         */
        _attached: {},

        /**
         * ����ע�������ģ��
         */
        _loadModules: function() {
            var mods = this.mods,
                attached = this._attached,
                name, m;

            for (name in mods) {
                m = mods[name];

                if (!attached[name] && m) { // ��������
                    attached[name] = m;

                    if (m.fn) {
                        m.fn(this);
                    }
                }

                // ע�⣺m.details ��ʱû�õ�������Ԥ������չ�ӿ�
            }

            // TODO
            // lang �ļ��ؿ����ӳٵ�ʵ����ʱ��ֻ���ص�ǰ lang
        }
    });

})(KISSY.Editor);

// TODO
// 1. �Զ��滻ҳ���е� textarea ? Լ�������� class �Ĳ��滻

KISSY.Editor.add("config", function(E) {

    E.config = {
        /**
         * ����·��
         */
        base: "",

        /**
         * ����
         */
        language: "zh-cn",

        /**
         * ����
         */
        theme: "default",

        /**
         * Toolbar �Ϲ��ܲ��
         */
        toolbar: [
            "source",
            "",
            /*"undo", "redo",
            "",*/
            "fontName", "fontSize", "bold", "italic", "underline", "strikeThrough", "foreColor", "backColor",
            "",
            "link", "smiley", "image",
            "",
            "insertOrderedList", "insertUnorderedList", "outdent", "indent", "justifyLeft", "justifyCenter", "justifyRight"
            //"",
            //"removeformat"
        ],

        /**
         * Statusbar �ϵĲ��
         */
        statusbar: [
            "wordcount",
            "resize"
        ],

        /**
         * ���������
         */
        pluginsConfig: { }

        /**
         * �Զ��۽�
         */
        // autoFocus: false
    };

});

KISSY.Editor.add("lang~en", function(E) {

    E.lang["en"] = {

        // Toolbar buttons
        source: {
          text            : "Source",
          title           : "Source"
        },
        undo: {
          text            : "Undo",
          title           : "Undo (Ctrl+Z)"
        },
        redo: {
          text            : "Redo",
          title           : "Redo (Ctrl+Y)"
        },
        fontName: {
          text            : "Font Name",  
          title           : "Font Name",
          options         : {
              "Arial"           : "Arial",
              "Times New Roman" : "Times New Roman",
              "Arial Black"     : "Arial Black",
              "Arial Narrow"    : "Arial Narrow",
              "Comic Sans MS"   : "Comic Sans MS",
              "Courier New"     : "Courier New",
              "Garamond"        : "Garamond",
              "Georgia"         : "Georgia",
              "Tahoma"          : "Tahoma",
              "Trebuchet MS"    : "Trebuchet MS",
              "Verdana"         : "Verdana"
          }
        },
        fontSize: {
          text            : "Size",
          title           : "Font size",
          options         : {
              "8"               : "1",
              "10"              : "2",
              "12"              : "3",
              "14"              : "4",
              "18"              : "5",
              "24"              : "6",
              "36"              : "7"
          }
        },
        bold: {
            text          : "Bold",
            title         : "Bold (Ctrl+B)"
        },
        italic: {
            text          : "Italic",
            title         : "Italick (Ctrl+I)"
        },
        underline: {
            text          : "Underline",
            title         : "Underline (Ctrl+U)"
        },
        strikeThrough: {
            text          : "Strikeout",
            title         : "Strikeout"
        },
        link: {
            text          : "Link",
            title         : "Insert/Edit link",
            href          : "URL:",
            target        : "Open link in new window",
            remove        : "Remove link"
        },
        blockquote: {
            text          : "Blockquote",
            title         : "Insert blockquote"
        },
        smiley: {
            text          : "Smiley",
            title         : "Insert smiley"
        },
        image: {
            text          : "Image",
            title         : "Insert image",
            tab_link      : "Web Image",
            tab_local     : "Local Image",
            tab_album     : "Album Image",
            label_link    : "Enter image web address:",
            label_local   : "Browse your computer for the image file to upload:",
            label_album   : "Select the image from your album:",
            uploading     : "Uploading...",
            upload_error  : "Exception occurs when uploading file.",
            upload_filter : "Only allow PNG, GIF, JPG image type.",
            ok            : "Insert"
        },
        insertOrderedList: {
            text          : "Numbered List",
            title         : "Numbered List (Ctrl+7)"
        },
        insertUnorderedList: {
            text          : "Bullet List",
            title         : "Bullet List (Ctrl+8)"
        },
        outdent: {
            text          : "Decrease Indent",
            title         : "Decrease Indent"
        },
        indent: {
            text          : "Increase Indent",
            title         : "Increase Indent"
        },
        justifyLeft: {
            text          : "Left Justify",
            title         : "Left Justify (Ctrl+L)"
        },
        justifyCenter: {
            text          : "Center Justify",
            title         : "Center Justify (Ctrl+E)"
        },
        justifyRight: {
            text          : "Right Justify",
            title         : "Right Justify (Ctrl+R)"
        },
        foreColor: {
            text          : "Text Color",
            title         : "Text Color"
        },
        backColor: {
            text          : "Text Background Color",
            title         : "Text Background Color"
        },
        maximize: {
          text            : "Maximize",
          title           : "Maximize"
        },
        removeformat: {
          text            : "Remove Format",
          title           : "Remove Format"
        },
        wordcount: {
          tmpl            : "Remain %remain% words (include html code)"
        },
        resize: {
            larger_text   : "Larger",
            larger_title  : "Enlarge the editor",
            smaller_text  : "Smaller",
            smaller_title : "Shrink the editor"
        },

        // Common messages and labels
        common: {
            ok            : "OK",
            cancel        : "Cancel"
        }
    };

});

KISSY.Editor.add("lang~zh-cn", function(E) {

    E.lang["zh-cn"] = {

        // Toolbar buttons
        source: {
          text            : "Դ��",
          title           : "Դ��"
        },
        undo: {
          text            : "����",
          title           : "����"
        },
        redo: {
          text            : "����",
          title           : "����"
        },
        fontName: {
          text            : "����",
          title           : "����",
          options         : {
              "����"             : "����",
              "����"             : "����",
              "����"             : "����",
              "����"             : "����_GB2312",
              //"��Բ"             : "��Բ",
              "΢���ź�"          : "΢���ź�",
              "Georgia"         : "Georgia",
              //"Garamond"        : "Garamond",
              "Times New Roman" : "Times New Roman",
              "Impact"          : "Impact",
              "Courier New"     : "Courier New",
              "Arial"           : "Arial",
              "Verdana"         : "Verdana",
              "Tahoma"          : "Tahoma"
          }
        },
        fontSize: {
          text            : "��С",
          title           : "��С",
          options         : {
              "8"               : "1",
              "10"              : "2",
              "12"              : "3",
              "14"              : "4",
              "18"              : "5",
              "24"              : "6",
              "36"              : "7"
          }
        },
        bold: {
            text          : "����",
            title         : "����"
        },
        italic: {
            text          : "б��",
            title         : "б��"
        },
        underline: {
            text          : "�»���",
            title         : "�»���"
        },
        strikeThrough: {
            text          : "ɾ����",
            title         : "ɾ����"
        },
        link: {
            text          : "����",
            title         : "����/�༭����",
            href          : "URL:",
            target        : "���´��ڴ�����",
            remove        : "�Ƴ�����"
        },
        blockquote: {
            text          : "����",
            title         : "����"
        },
        smiley: {
            text          : "����",
            title         : "�������"
        },
        image: {
            text          : "ͼƬ",
            title         : "����ͼƬ",
            tab_link      : "����ͼƬ",
            tab_local     : "�����ϴ�",
            tab_album     : "�ҵ����",
            label_link    : "������ͼƬ��ַ��",
            label_local   : "��ѡ�񱾵�ͼƬ��",
            label_album   : "��ѡ�����ͼƬ��",
            uploading     : "�����ϴ�...",
            upload_error  : "�Բ����ϴ��ļ�ʱ�����˴���",
            upload_filter : "��֧�� JPG, PNG �� GIF ͼƬ��������ѡ��",
            ok            : "����"
        },
        insertOrderedList: {
            text          : "�����б�",
            title         : "�����б�"
        },
        insertUnorderedList: {
            text          : "�����б�",
            title         : "�����б�"
        },
        outdent: {
            text          : "��������",
            title         : "��������"
        },
        indent: {
            text          : "��������",
            title         : "��������"
        },
        justifyLeft: {
            text          : "�����",
            title         : "�����"
        },
        justifyCenter: {
            text          : "���ж���",
            title         : "���ж���"
        },
        justifyRight: {
            text          : "�Ҷ���",
            title         : "�Ҷ���"
        },
        foreColor: {
            text          : "�ı���ɫ",
            title         : "�ı���ɫ"
        },
        backColor: {
            text          : "������ɫ",
            title         : "������ɫ"
        },
        maximize: {
          text            : "ȫ���༭",
          title           : "ȫ���༭"
        },
        removeformat: {
          text            : "�����ʽ",
          title           : "�����ʽ"
        },
        wordcount: {
          tmpl            : "���������� %remain% �֣��� html ���룩"
        },
        resize: {
            larger_text   : "����",
            larger_title  : "����༭����",
            smaller_text  : "��С",
            smaller_title : "��С�༭����"
        },

        // Common messages and labels
        common: {
            ok            : "ȷ��",
            cancel        : "ȡ��"
        }
    };

});

KISSY.Editor.add("core~plugin", function(E) {

    /**
     * �������
     */
    E.PLUGIN_TYPE = {
        CUSTOM: 0,
        TOOLBAR_SEPARATOR: 1,
        TOOLBAR_BUTTON: 2,
        TOOLBAR_MENU_BUTTON: 4,
        TOOLBAR_SELECT: 8,
        STATUSBAR_ITEM: 16,
        FUNC: 32 // ���������ʲ������ UI
    };

});

KISSY.Editor.add("core~dom", function(E) {

    var UA = YAHOO.env.ua;

    E.Dom = {

        /**
         * ��ȡԪ�ص��ı�����
         */
        getText: function(el) {
            return el ? (el.textContent || '') : '';
        },

        /**
         * ��Ԫ�ز���ѡ����� ie �� selection ��ʧ������
         */
        setItemUnselectable: function(el) {
            var arr, i, len, n, a;

            arr = el.getElementsByTagName("*");
            for (i = -1, len = arr.length; i < len; ++i) {
                a = (i == -1) ? el : arr[i];

                n = a.nodeName;
                if (n && n != "INPUT") {
                    a.setAttribute("unselectable", "on");
                }
            }

            return el;
        },

        // Ref: CKEditor - core/dom/elementpath.js
        BLOCK_ELEMENTS: {

            /* �ṹԪ�� */
            blockquote:1,
            div:1,
            h1:1,h2:1,h3:1,h4:1,h5:1,h6:1,
            hr:1,
            p:1,

            /* �ı���ʽԪ�� */
            address:1,
            center:1,
            pre:1,

            /* ��Ԫ�� */
            form:1,
            fieldset:1,
            caption:1,

            /* ���Ԫ�� */
            table:1,
            tbody:1,
            tr:1, th:1, td:1,

            /* �б�Ԫ�� */
            ul:1, ol:1, dl:1,
            dt:1, dd:1, li:1
        }
    };

    // for ie
    if (UA.ie) {
        E.Dom.getText = function(el) {
            return el ? (el.innerText || '') : '';
        };
    }

});

KISSY.Editor.add("core~color", function(E) {

    var TO_STRING = "toString",
        PARSE_INT = parseInt,
        RE = RegExp;

    E.Color = {
        KEYWORDS: {
            black: "000",
            silver: "c0c0c0",
            gray: "808080",
            white: "fff",
            maroon: "800000",
            red: "f00",
            purple: "800080",
            fuchsia: "f0f",
            green: "008000",
            lime: "0f0",
            olive: "808000",
            yellow: "ff0",
            navy: "000080",
            blue: "00f",
            teal: "008080",
            aqua: "0ff"
        },

        re_RGB: /^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i,
        re_hex: /^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i,
        re_hex3: /([0-9A-F])/gi,

        toRGB: function(val) {
            if (!this.re_RGB.test(val)) {
                val = this.toHex(val);
            }

            if(this.re_hex.exec(val)) {
                val = "rgb(" + [
                    PARSE_INT(RE.$1, 16),
                    PARSE_INT(RE.$2, 16),
                    PARSE_INT(RE.$3, 16)
                ].join(", ") + ")";
            }
            return val;
        },

        toHex: function(val) {
            val = this.KEYWORDS[val] || val;

            if (this.re_RGB.exec(val)) {
                var r = (RE.$1 >> 0)[TO_STRING](16),
                    g = (RE.$2 >> 0)[TO_STRING](16),
                    b = (RE.$3 >> 0)[TO_STRING](16);

                val = [
                    r.length == 1 ? "0" + r : r,
                    g.length == 1 ? "0" + g : g,
                    b.length == 1 ? "0" + b : b
                ].join("");
            }

            if (val.length < 6) {
                val = val.replace(this.re_hex3, "$1$1");
            }

            if (val !== "transparent" && val.indexOf("#") < 0) {
                val = "#" + val;
            }

            return val.toLowerCase();
        },

        /**
         * Convert the custom integer (B G R) format to hex format.
         */
        int2hex: function(val) {
            var red, green, blue;

            val = val >> 0;
            red = val & 255;
            green = (val >> 8) & 255;
            blue = (val >> 16) & 255;

            return this.toHex("rgb(" + red + "," + green +"," + blue + ")");
        }
    };

});

KISSY.Editor.add("core~command", function(E) {

    var ua = YAHOO.env.ua,

        CUSTOM_COMMANDS = {
            backColor: ua.gecko ? "hiliteColor" : "backColor"
        },
        TAG_COMMANDS = "bold,italic,underline,strikeThrough",
        STYLE_WITH_CSS = "styleWithCSS",
        EXEC_COMMAND = "execCommand";
    
    E.Command = {

        /**
         * ִ�� doc.execCommand
         */
        exec: function(doc, cmdName, val, styleWithCSS) {
            cmdName = CUSTOM_COMMANDS[cmdName] || cmdName;

            this._preExec(doc, cmdName, styleWithCSS);
            doc[EXEC_COMMAND](cmdName, false, val);
        },

        _preExec: function(doc, cmdName, styleWithCSS) {

            // �ر� gecko ������� styleWithCSS ���ԣ�ʹ�ò��������ݺ� ie һ��
            if (ua.gecko) {
                var val = typeof styleWithCSS === "undefined" ? (TAG_COMMANDS.indexOf(cmdName) === -1) : styleWithCSS;
                doc[EXEC_COMMAND](STYLE_WITH_CSS, false, val);
            }
        }
    };

});
KISSY.Editor.add("core~range", function(E) {

    var isIE = YAHOO.env.ua.ie;

    E.Range = {

        /**
         * ��ȡѡ���������
         */
        getSelectionRange: function(win) {
            var doc = win.document,
                selection, range;

            if (win.getSelection) { // W3C
                selection = win.getSelection();

                if (selection.getRangeAt) {
                    range = selection.getRangeAt(0);

                } else { // for Old Webkit! �߰汾���Ѿ�֧�� getRangeAt
                    range = doc.createRange();
                    range.setStart(selection.anchorNode, selection.anchorOffset);
                    range.setEnd(selection.focusNode, selection.focusOffset);
                }

            } else if (doc.selection) { // IE
                range = doc.selection.createRange();
            }

            return range;
        },

        /**
         * ��ȡ����
         */
        getCommonAncestor: function(range) {
            return range.startContainer || // w3c
                   (range.parentElement && range.parentElement()) || // ms TextRange
                   (range.commonParentElement && range.commonParentElement()); // ms IHTMLControlRange
        },

        /**
         * ��ȡѡ���ı�
         */
        getSelectedText: function(range) {
            if("text" in range) return range.text;
            return range.toString ? range.toString() : ""; // ms IHTMLControlRange �� toString ����
        },

        /**
         * ����ѡ�� for ie
         */
        saveRange: function(editor) {
            // 1. ���� range, �Ա㻹ԭ
            isIE && editor.contentWin.focus(); // ȷ���������� range �Ǳ༭����ģ����� [Issue 39]

            // 2. �ۼ�����ť�ϣ����ع�꣬���� ie �¹�����ʾ�ڲ�����
            // ͨ�� blur / focus �ȷ�ʽ�� ie7- ����Ч
            // ע�⣺2 �� 1 ��ͻ��Ȩ�⿼�ǣ�����ȡ��2
            //isIE && editor.contentDoc.selection.empty();

            return editor.getSelectionRange();
        }
    };

});

KISSY.Editor.add("core~instance", function(E) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = YAHOO.lang,
        UA = YAHOO.env.ua,
        ie = UA.ie,
        EDITOR_CLASSNAME = "ks-editor",

        EDITOR_TMPL  =  '<div class="ks-editor-toolbar"></div>' +
                        '<div class="ks-editor-content"><iframe frameborder="0" allowtransparency="1"></iframe></div>' +
                        '<div class="ks-editor-statusbar"></div>',

        CONTENT_TMPL =  '<!DOCTYPE html>' +
                        '<html>' +
                        '<head>' +
                        '<title>Rich Text Area</title>' +
                        '<meta http-equiv="content-type" content="text/html; charset=gb18030" />' +
                        '<link type="text/css" href="{CONTENT_CSS}" rel="stylesheet" />' +
                        '</head>' +
                        '<body spellcheck="false" class="ks-editor-post">{CONTENT}</body>' +
                        '</html>',

        THEMES_DIR = "themes";

    /**
     * �༭����ʵ����
     */
    E.Instance = function(textarea, config) {
        /**
         * ������� textarea Ԫ��
         */
        this.textarea = Dom.get(textarea);

        /**
         * ������
         */
        this.config = Lang.merge(E.config, config || {});

        /**
         * ������ renderUI �и�ֵ
         * @property container
         * @property contentWin
         * @property contentDoc
         * @property statusbar
         */

        /**
         * ���ʵ����صĲ��
         */
        //this.plugins = [];

        /**
         * �Ƿ���Դ��༭״̬
         */
        this.sourceMode = false;

        /**
         * ������
         */
        this.toolbar = new E.Toolbar(this);

        /**
         * ״̬��
         */
        this.statusbar = new E.Statusbar(this);

        // init
        this._init();
    };

    Lang.augmentObject(E.Instance.prototype, {
        /**
         * ��ʼ������
         */
        _init: function() {
            this._renderUI();
            this._initPlugins();
            this._initAutoFocus();
        },

        _renderUI: function() {
            this._renderContainer();
            this._setupContentPanel();
        },

        /**
         * ��ʼ�����в��
         */
        _initPlugins: function() {
            var key, p,
                staticPlugins = E.plugins,
                plugins = [];

            // ÿ��ʵ����ӵ��һ���Լ��� plugins �б�
            for(key in staticPlugins) {
                plugins[key] = staticPlugins[key];
            }
            this.plugins = plugins;

            // �������ϵĲ��
            this.toolbar.init();

            // ״̬���ϵĲ��
            this.statusbar.init();
            
            // ���������Բ��
            for (key in plugins) {
                p = plugins[key];
                if (p.inited) continue;

                if (p.type === E.PLUGIN_TYPE.FUNC) {
                    p.editor = this; // �� p ���� editor ����
                    if (p.init) {
                        p.init();
                    }
                    p.inited = true;
                }
            }
        },

        /**
         * ���� DOM �ṹ
         */
        _renderContainer: function() {
            var textarea = this.textarea,
                region = Dom.getRegion(textarea),
                width = (region.right - region.left - 2) + "px", // YUI �� getRegion �� 2px ƫ��
                height = (region.bottom - region.top - 2) + "px",
                container = document.createElement("div"),
                content, iframe;

            container.className = EDITOR_CLASSNAME;
            container.style.width = width;
            container.innerHTML = EDITOR_TMPL;

            content = container.childNodes[1];
            content.style.width = "100%";
            content.style.height = height;

            iframe = content.childNodes[0];
            iframe.style.width = "100%";
            iframe.style.height = "100%"; // ʹ�� resize �������������
            iframe.setAttribute("frameBorder", 0);

            textarea.style.display = "none";
            Dom.insertBefore(container, textarea);

            this.container = container;
            this.toolbar.domEl = container.childNodes[0];
            this.contentWin = iframe.contentWindow;
            this.contentDoc = iframe.contentWindow.document;
            
            this.statusbar.domEl = container.childNodes[2];

            // TODO Ŀǰ�Ǹ��� textatea �Ŀ�����趨 editor �Ŀ�ȡ����Կ��� config ��ָ�����
        },

        _setupContentPanel: function() {
            var doc = this.contentDoc,
                config = this.config,
                contentCSS = "content" + (config.debug ? "" : "-min") + ".css",
                contentCSSUrl = config.base + THEMES_DIR + "/" + config.theme + "/" + contentCSS,
                self = this;

            // ��ʼ�� iframe ������
            doc.open();
            doc.write(CONTENT_TMPL
                    .replace("{CONTENT_CSS}", contentCSSUrl)
                    .replace("{CONTENT}", this.textarea.value));
            doc.close();

            if (ie) {
                // �� contentEditable ���������� ie ��ѡ��Ϊ�ڵװ���
                doc.body.contentEditable = "true";
            } else {
                // firefox �� designMode ��֧�ָ���
                doc.designMode = "on";
            }

            // ע1���� tinymce �designMode = "on" ���� try catch �
            //     ԭ������ firefox �£���iframe �� display: none ��������ᵼ�´���
            //     �������Ҳ��ԣ�firefox 3+ �������޴�����
            // ע2�� ie �� contentEditable = true.
            //     ԭ������ ie �£�IE needs to use contentEditable or it will display non secure items for HTTPS
            // Ref:
            //   - Differences between designMode and contentEditable
            //     http://74.125.153.132/search?q=cache:5LveNs1yHyMJ:nagoon97.wordpress.com/2008/04/20/differences-between-designmode-and-contenteditable/+ie+contentEditable+designMode+different&cd=6&hl=en&ct=clnk

            // TODO: �ó�ʼ��������ʼ���� p ��ǩ��
            // ����Ĵ���취���׵�
//            if (Lang.trim(doc.body.innerHTML).length === 0) {
//                if(UA.gecko) {
//                    doc.body.innerHTML = '<p><br _moz_editor_bogus_node="TRUE" _moz_dirty=""/></p>';
//                } else {
//                    doc.body.innerHTML = '<p></p>';
//                }
//            }

            if(ie) {
                // ����� iframe doc �� body ����ʱ����ԭ����λ��
                Event.on(doc, "click", function() {
                    if (doc.activeElement.parentNode.nodeType === 9) { // ����� doc ��
                        self._focusToEnd();
                    }
                });
            }
        },

        _initAutoFocus: function() {
            if (this.config.autoFocus) {
                this._focusToEnd();
            } else if (ie === 6) { // ie6 �£����Զ��۽�
                this.contentDoc.selection.empty();
            }
        },

        /**
         * ����궨λ�����һ��Ԫ��
         */
        _focusToEnd: function() {
            this.contentWin.focus();

            var lastChild = this.contentDoc.body.lastChild,
                range = E.Range.getSelectionRange(this.contentWin);

            if (UA.ie) {
                try { // ��ʱ�ᱨ���༭�� ie �£��л�Դ���룬���л���ȥ������༭�����ڣ�����Чָ���JS����
                    range.moveToElementText(lastChild);
                } catch(ex) { }
                range.collapse(false);
                range.select();

            } else {
                try {
                    range.setEnd(lastChild, lastChild.childNodes.length);
                } catch(ex) { }
                range.collapse(false);
            }
        },

        /**
         * ��ȡ����
         */
        focus: function() {
          this._focusToEnd();
        },

        /**
         * ִ�� execCommand
         */
        execCommand: function(commandName, val, styleWithCSS) {
            this.contentWin.focus(); // ��ԭ����
            E.Command.exec(this.contentDoc, commandName, val, styleWithCSS);
        },

        /**
         * ��ȡ����
         */
        getData: function() {
            if(this.sourceMode) {
                return this.textarea.value;
            }
            return this.getContentDocData();
        },

        /**
         * ��ȡ contentDoc �е�����
         */
        getContentDocData: function() {
            var bd = this.contentDoc.body,
                data = "", p = E.plugins["save"];

            // Firefox �£�_moz_editor_bogus_node, _moz_dirty ����������
            // ��Щ�������ԣ����� innerHTML ��ȡʱ���Զ�������

            data = bd.innerHTML;
            if(data == "<br>") data = ""; // firefox �»��Զ�����һ�� br

            if(p && p.filterData) {
                data = p.filterData(data);
            }

            return data;
        },

        /**
         * ��ȡѡ������� Range ����
         */
        getSelectionRange: function() {
            return E.Range.getSelectionRange(this.contentWin);
        }
    });

});

KISSY.Editor.add("core~toolbar", function(E) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = YAHOO.lang,
        isIE = YAHOO.env.ua.ie,
        isIE6 = isIE === 6,
        TYPE = E.PLUGIN_TYPE,
        TOOLBAR_SEPARATOR_TMPL = '<div class="ks-editor-stripbar-sep ks-inline-block"></div>',

        TOOLBAR_BUTTON_TMPL = '' +
'<div class="ks-editor-toolbar-button ks-inline-block" title="{TITLE}">' +
    '<div class="ks-editor-toolbar-button-outer-box">' +
        '<div class="ks-editor-toolbar-button-inner-box">' +
            '<span class="ks-editor-toolbar-item ks-editor-toolbar-{NAME}">{TEXT}</span>' +
        '</div>' +
    '</div>' +
'</div>',

        TOOLBAR_MENU_BUTTON_TMPL = '' +
'<div class="ks-editor-toolbar-menu-button-caption ks-inline-block">' +
    '<span class="ks-editor-toolbar-item ks-editor-toolbar-{NAME}">{TEXT}</span>' +
'</div>' +
'<div class="ks-editor-toolbar-menu-button-dropdown ks-inline-block"></div>',

        TOOLBAR_MENU_BUTTON = "ks-editor-toolbar-menu-button",
        TOOLBAR_SELECT = "ks-editor-toolbar-select",
        TOOLBAR_BUTTON_ACTIVE = "ks-editor-toolbar-button-active",
        TOOLBAR_BUTTON_HOVER = "ks-editor-toolbar-button-hover",
        TOOLBAR_BUTTON_SELECTED = "ks-editor-toolbar-button-selected",
    
        STATE_CMDS = "fontName,fontSize,bold,italic,underline,strikeThrough"
                     + "insertOrderedList,insertUnorderedList"
                     + "justifyLeft,justifyCenter,justifyRight",

        div = document.createElement("div"); // ͨ�� el ����


    E.Toolbar = function(editor) {

        /**
         * ������ı༭��ʵ��
         */
        this.editor = editor;

        /**
         * �����������
         */
        this.config = editor.config;

        /**
         * ��ǰ����
         */
        this.lang = E.lang[this.config.language];

        /**
         * ���м��صĹ��������
         */
        this.items = [];

        /**
         * ������Ҫ��̬����״̬�Ĺ����������
         */
        this.stateItems = [];
    };
    
    Lang.augmentObject(E.Toolbar.prototype, {

        /**
         * ��ʼ��������
         */
        init: function() {
            var items = this.config.toolbar,
                plugins = this.editor.plugins,
                key, p;

            // ����������ҵ���ز�������ӵ���������
            for (var i = 0, len = items.length; i < len; ++i) {
                key = items[i];
                if (key) {
                    if (!(key in plugins)) continue; // ���������У������صĲ�����ޣ�ֱ�Ӻ���

                    // ��Ӳ����
                    p = plugins[key];
                    this._addItem(p);

                    this.items.push(p);
                    if(STATE_CMDS.indexOf(p.name) !== -1) {
                        this.stateItems.push(p);
                    }

                } else { // ��ӷָ���
                    this._addSeparator();
                }
            }

            // ״̬����
            this._initUpdateState();
        },

        /**
         * ��ӹ�������
         */
        _addItem: function(p) {
            var el, type = p.type, lang = this.lang, html;

            // �� plugin û������ lang ʱ������Ĭ����������
            // TODO: �����ع��� instance ģ�����Ϊ lang ����ʵ�����
            if (!p.lang) p.lang = Lang.merge(lang["common"], this.lang[p.name] || {});

            // ����ģ�幹�� DOM
            html = TOOLBAR_BUTTON_TMPL
                    .replace("{TITLE}", p.lang.title || "")
                    .replace("{NAME}", p.name)
                    .replace("{TEXT}", p.lang.text || "");
            if (isIE6) {
                html = html
                        .replace("outer-box", "outer-box ks-inline-block")
                        .replace("inner-box", "inner-box ks-inline-block");
            }
            div.innerHTML = html;

            // �õ� domEl
            p.domEl = el = div.firstChild;

            // ���ݲ�����ͣ����� DOM �ṹ
            if (type == TYPE.TOOLBAR_MENU_BUTTON || type == TYPE.TOOLBAR_SELECT) {
                // ע��select ��һ������� menu button
                this._renderMenuButton(p);

                if(type == TYPE.TOOLBAR_SELECT) {
                    this._renderSelect(p);
                }
            }

            // ���¼�
            this._bindItemUI(p);

            // ��ӵ�������
            this._addToToolbar(el);

            // ���ò���Լ��ĳ�ʼ�����������ǲ���ĸ��Ի��ӿ�
            // init ������ӵ����������棬���Ա�֤ DOM ��������ȡ region �Ȳ�������ȷ��
            p.editor = this.editor; // �� p ���� editor ����
            if (p.init) {
                p.init();
            }

            // ���Ϊ�ѳ�ʼ�����
            p.inited = true;
        },

        /**
         * ��ʼ��������ť�� DOM
         */
        _renderMenuButton: function(p) {
            var el = p.domEl,
                innerBox = el.getElementsByTagName("span")[0].parentNode;

            Dom.addClass(el, TOOLBAR_MENU_BUTTON);
            innerBox.innerHTML = TOOLBAR_MENU_BUTTON_TMPL
                    .replace("{NAME}", p.name)
                    .replace("{TEXT}", p.lang.text || "");
        },

        /**
         * ��ʼ�� selectBox �� DOM
         */
        _renderSelect: function(p) {
            Dom.addClass(p.domEl, TOOLBAR_SELECT);
        },

        /**
         * ������������¼�
         */
        _bindItemUI: function(p) {
            var el = p.domEl;

            // 1. ע����ʱ����Ӧ����
            if (p.exec) {
                Event.on(el, "click", function() {
                    p.exec();
                });
            }

            // 2. ��������ʱ����ť���µ�Ч��
            Event.on(el, "mousedown", function() {
                Dom.addClass(el, TOOLBAR_BUTTON_ACTIVE);
            });
            Event.on(el, "mouseup", function() {
                Dom.removeClass(el, TOOLBAR_BUTTON_ACTIVE);
            });
            // TODO ����Ч����������������״̬��������Ƴ������밴ťʱ����ť״̬���л�
            // ע��firefox �£���ס�����������Ƴ������밴ťʱ�����ᴥ�� mouseout. ��Ҫ�о��� google �����ʵ�ֵ�
            Event.on(el, "mouseout", function(e) {
                var toElement = Event.getRelatedTarget(e), isChild;

                try {
                    if (el.contains) {
                        isChild = el.contains(toElement);
                    } else if (el.compareDocumentPosition) {
                        isChild = el.compareDocumentPosition(toElement) & 8;
                    }
                } catch(e) {
                    isChild = false; // �Ѿ��ƶ��� iframe ��
                }
                if (isChild) return;

                Dom.removeClass(el, TOOLBAR_BUTTON_ACTIVE);
            });

            // 3. ie6 �£�ģ�� hover
            if(isIE6) {
                Event.on(el, "mouseenter", function() {
                    Dom.addClass(el, TOOLBAR_BUTTON_HOVER);
                });
                Event.on(el, "mouseleave", function() {
                    Dom.removeClass(el, TOOLBAR_BUTTON_HOVER);
                });
            }
        },

        /**
         * ��ӷָ���
         */
        _addSeparator: function() {
            div.innerHTML = TOOLBAR_SEPARATOR_TMPL;
            this._addToToolbar(div.firstChild);
        },

        /**
         * �� item �� �ָ��� ��ӵ�������
         */
        _addToToolbar: function(el) {
            if(isIE) el = E.Dom.setItemUnselectable(el);
            this.domEl.appendChild(el);
        },

        /**
         * ��ʼ����ť״̬�Ķ�̬����
         */
        _initUpdateState: function() {
            var doc = this.editor.contentDoc,
                self = this;

            Event.on(doc, "click", function() { self.updateState(); });
            Event.on(doc, "keyup", function(ev) {
                var keyCode = ev.keyCode;

                // PGUP,PGDN,END,HOME: 33 - 36
                // LEFT,UP,RIGHT,DOWN��37 - 40
                // BACKSPACE: 8
                // ENTER: 13
                // DEL: 46
                if((keyCode >= 33 && keyCode <= 40)
                    || keyCode === 8
                    || keyCode === 13
                    || keyCode === 46) {
                    self.updateState();
                }
            });

            // TODO: ���ճ��ʱ���¼���ճ������Ҫ���°�ť״̬
        },

        /**
         * ��ť״̬�Ķ�̬���£�������ťѡ��״̬�ĸ��¡������ֺŵĸ��¡���ɫ�Ķ�̬���µȣ�
         * ���� Google Docs ��ԭ�������а�ťʼ�տɵ����ֻ����״̬�������ð�ť
         */
        updateState: function(filterNames) {
            var items = this.stateItems, p;
            filterNames = filterNames ? filterNames.join("|") : "";

            for(var i = 0, len = items.length; i < len; i++) {
                p = items[i];
                
                if(filterNames && filterNames.indexOf(p.name) === -1)
                    continue;

                // ���ò���Լ���״̬���º���
                if(p.updateState) {
                    p.updateState();
                    continue;
                }

                // Ĭ�ϵ�״̬���º���
                this.updateItemState(p);
            }

            // TODO: webkit �£������״̬û��ȡ��
        },

        updateItemState: function(p) {
            var doc = this.editor.contentDoc;

            // Ĭ�ϵ�״̬���º���
            try {
                if (doc.queryCommandEnabled(p.name)) {
                    if (doc.queryCommandState(p.name)) {
                        Dom.addClass(p.domEl, TOOLBAR_BUTTON_SELECTED);
                    } else {
                        Dom.removeClass(p.domEl, TOOLBAR_BUTTON_SELECTED);
                    }
                }
            } catch(ex) {
            }
        }
    });

});

KISSY.Editor.add("core~statusbar", function(E) {

    var Y = YAHOO.util, Lang = YAHOO.lang,
        isIE = YAHOO.env.ua.ie,

        SEP_TMPL = '<div class="ks-editor-stripbar-sep kissy-inline-block"></div>',
        ITEM_TMPL = '<div class="ks-editor-statusbar-item ks-editor-{NAME} ks-inline-block"></div>',

        div = document.createElement("div"); // ͨ�� el ����

    E.Statusbar = function(editor) {

        /**
         * ������ı༭��ʵ��
         */
        this.editor = editor;

        /**
         * �����������
         */
        this.config = editor.config;

        /**
         * ��ǰ����
         */
        this.lang = E.lang[this.config.language];
    };
    
    Lang.augmentObject(E.Statusbar.prototype, {

        /**
         * ��ʼ��
         */
        init: function() {
            var items = this.config.statusbar,
                plugins = this.editor.plugins,
                key;

            // ����������ҵ���ز�������ӵ���������
            for (var i = 0, len = items.length; i < len; ++i) {
                key = items[i];
                if (key) {
                    if (!(key in plugins)) continue; // ���������У������صĲ�����ޣ�ֱ�Ӻ���

                    // ��Ӳ����
                    this._addItem(plugins[key]);

                } else { // ��ӷָ���
                    this._addSep();
                }
            }
        },

        /**
         * ��ӹ�������
         */
        _addItem: function(p) {
            var el, lang = this.lang;

            // �� plugin û������ lang ʱ������Ĭ����������
            // TODO: �����ع��� instance ģ�����Ϊ lang ����ʵ�����
            if (!p.lang) p.lang = Lang.merge(lang["common"], this.lang[p.name] || {});

            // ����ģ�幹�� DOM
            div.innerHTML = ITEM_TMPL.replace("{NAME}", p.name);

            // �õ� domEl
            p.domEl = el = div.firstChild;

            // ��ӵ�������
            this._addToToolbar(el);

            // ���ò���Լ��ĳ�ʼ�����������ǲ���ĸ��Ի��ӿ�
            // init ������ӵ����������棬���Ա�֤ DOM ��������ȡ region �Ȳ�������ȷ��
            p.editor = this.editor; // �� p ���� editor ����
            if (p.init) {
                p.init();
            }

            // ���Ϊ�ѳ�ʼ�����
            p.inited = true;
        },

        /**
         * ��ӷָ���
         */
        _addSep: function() {
            div.innerHTML = SEP_TMPL;
            this._addToToolbar(div.firstChild);
        },

        /**
         * �� item �� �ָ��� ��ӵ�״̬��
         */
        _addToToolbar: function(el) {
            if(isIE) el = E.Dom.setItemUnselectable(el);
            this.domEl.appendChild(el);
        }
    });

});

KISSY.Editor.add("core~menu", function(E) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event,
        UA = YAHOO.env.ua,

        DISPLAY = "display",
        NONE = "none",
        EMPTY = "",
        DROP_MENU_CLASS = "ks-editor-drop-menu",
        SHADOW_CLASS = "ks-editor-drop-menu-shadow",
        CONTENT_CLASS = "ks-editor-drop-menu-content",
        SELECTED_CLASS = "ks-editor-toolbar-button-selected",
        SHIM_CLASS = DROP_MENU_CLASS + "-shim", //  // iframe shim �� class
        shim; // ����һ�� shim ����
    
    E.Menu = {

        /**
         * ����������
         * @param {KISSY.Editor} editor dropMenu �����ı༭��ʵ��
         * @param {HTMLElement} trigger
         * @param {Array} offset dropMenu λ�õ�ƫ����
         * @return {HTMLElement} dropMenu
         */
        generateDropMenu: function(editor, trigger, offset) {
            var dropMenu = document.createElement("div"),
                 self = this;

            // �����Ӱ��
            dropMenu.innerHTML = '<div class="' + SHADOW_CLASS + '"></div>'
                               + '<div class="' + CONTENT_CLASS + '"></div>';
            
            // ���� DOM
            dropMenu.className = DROP_MENU_CLASS;
            dropMenu.style[DISPLAY] = NONE;
            document.body.appendChild(dropMenu);

            // �������ʱ����ʾ������
            // ע��һ���༭��ʵ�������ֻ����һ�������������
            Event.on(trigger, "click", function(ev) {
                // �����ϴ������Լ�����
                // ���� document �ϼ�ص���󣬻�رոմ򿪵� dropMenu
                Event.stopPropagation(ev);

                // ���ص�ǰ�����������
                editor.activeDropMenu && self._hide(editor);

                // �򿪵�ǰ trigger �� dropMenu
                if(editor.activeDropMenu != dropMenu) {
                    self._setDropMenuPosition(trigger, dropMenu, offset); // �ӳٵ���ʾʱ����λ��
                    editor.activeDropMenu = dropMenu;
                    editor.activeDropButton = trigger;
                    self._show(editor);

                } else { // �ڶ��ε���� trigger �ϣ��ر� activeDropMenu, ����Ϊ null. ����ᵼ�µ����ε���򲻿�
                    editor.activeDropMenu = null;
                    editor.activeDropButton = null;
                }
            });

            // document ���񵽵��ʱ���رյ�ǰ�����������
            Event.on([document, editor.contentDoc], "click", function() {
                if(editor.activeDropMenu) {
                    self.hideActiveDropMenu(editor);

                    // ��ԭѡ���ͽ���
                    if (this == editor.contentDoc) {
                        // TODO: [bug 58]  ��Ҫ��дһ�� focusmanager ��ͳһ������
//                        if (UA.ie) {
//                            var range = editor.getSelectionRange();
//                            range.select();
//                        }
                        editor.contentWin.focus();
                    }
                }
            });

            // �ı䴰�ڴ�Сʱ����̬����λ��
            this._initResizeEvent(trigger, dropMenu, offset);

            // ����
            return dropMenu.childNodes[1]; // ���� content ����
        },

        /**
         * ���� dropMenu ��λ��
         */
        _setDropMenuPosition: function(trigger, dropMenu, offset) {
            var r = Dom.getRegion(trigger),
                left = r.left, top = r.bottom;

            if(offset) {
                left += offset[0];
                top += offset[1];
            }

            dropMenu.style.left = left + "px";
            dropMenu.style.top = top + "px";
        },

        _isVisible: function(el) {
            if(!el) return false;
            return el.style[DISPLAY] != NONE;
        },

        /**
         * ���ر༭����ǰ�򿪵�������
         */
        hideActiveDropMenu: function(editor) {
            this._hide(editor);
            editor.activeDropMenu = null;
            editor.activeDropButton = null;
        },

        _hide: function(editor) {
            var dropMenu = editor.activeDropMenu,
                dropButton = editor.activeDropButton;

            if(dropMenu) {
                shim && (shim.style[DISPLAY] = NONE);

                dropMenu.style[DISPLAY] = NONE;
                //dropMenu.style.visibility = "hidden";
                // ע��visibilty ��ʽ�ᵼ��ie�£��ϴ��������ļ���ѡ����ѡȡ�ļ��򣩺󣬱༭���򽹵㶪ʧ
            }

            dropButton && (Dom.removeClass(dropButton, SELECTED_CLASS));
        },

        _show: function(editor) {
            var dropMenu = editor.activeDropMenu,
                dropButton = editor.activeDropButton;

            if (dropMenu) {
                dropMenu.style[DISPLAY] = EMPTY;

                if (UA.ie === 6) {
                    this._updateShimRegion(dropMenu);
                    shim.style[DISPLAY] = EMPTY;
                }
            }

            dropButton && (Dom.addClass(dropButton, SELECTED_CLASS));
        },

        _updateShimRegion: function(el) {
            if(el) {
                if(UA.ie === 6) {
                    if(!shim) this._initShim();
                    this._setShimRegion(el);
                }
            }
        },

        /**
         * window.onresize ʱ�����µ��� dropMenu ��λ��
         */
        _initResizeEvent: function(trigger, dropMenu, offset) {
            var self = this, resizeTimer;

            Event.on(window, "resize", function() {
                if (resizeTimer) {
                    clearTimeout(resizeTimer);
                }

                resizeTimer = setTimeout(function() {
                    if(self._isVisible(dropMenu)) { // ������ʾʱ����Ҫ��̬����
                        self._setDropMenuPosition(trigger, dropMenu, offset);
                    }
                }, 50);
            });
        },

        _initShim: function() {
            shim = document.createElement("iframe");
            shim.src = "about:blank";
            shim.className = SHIM_CLASS;
            shim.style.position = "absolute";
            shim.style[DISPLAY] = NONE;
            shim.style.border = NONE;
            document.body.appendChild(shim);
        },

        /**
         * ���� shim �� region
         * @protected
         */
        _setShimRegion: function(el) {
            if (shim && this._isVisible(el)) {
                var r = Dom.getRegion(el);
                if (r.width > 0) {
                    shim.style.left = r.left + "px";
                    shim.style.top = r.top + "px";
                    shim.style.width = (r.width - 1) + "px"; // ��һ���أ����� ie6 �»�¶��һ����
                    shim.style.height = (r.height - 1) + "px";
                }
            }
        }
    };

});


KISSY.Editor.add("smilies~config~default", function(E) {

    E.Smilies = E.Smilies || {};

    E.Smilies["default"] = {

        name: "default",

        mode: "icons",

        cols: 5,
        
        fileNames: [
                "smile",  "confused",  "cool",      "cry",   "eek",
                "angry",  "wink",      "sweat",     "lol",   "stun",
                "razz",   "shy",       "rolleyes",  "sad",   "happy",
                "yes",    "no",        "heart",     "idea",  "rose"
        ],

        fileExt: "gif"
    };

});

KISSY.Editor.add("smilies~config~wangwang", function(E) {

    E.Smilies = E.Smilies || {};

    E.Smilies["wangwang"] = {

        name: "wangwang",

        mode: "sprite",

		base: "http://a.tbcdn.cn/sys/wangwang/smiley/48x48/",

		spriteStyle: "background: url(http://a.tbcdn.cn/sys/wangwang/smiley/sprite.png) no-repeat -1px 0; width: 288px; height: 235px",

        unitStyle: "width: 24px; height: 24px",

		filePattern: {
			start : 0,
			end   : 98,
		    step  : 1	
		},

        fileExt: "gif"
    };

});

KISSY.Editor.add("plugins~base", function(E) {

    var TYPE = E.PLUGIN_TYPE,
        buttons  = "bold,italic,underline,strikeThrough," +
                   "insertOrderedList,insertUnorderedList";

    E.addPlugin(buttons.split(","), {
        /**
         * ���ࣺ��ͨ��ť
         */
        type: TYPE.TOOLBAR_BUTTON,

        /**
         * ��Ӧ����
         */
        exec: function() {
            // ִ������
            this.editor.execCommand(this.name);

            // ����״̬
            this.editor.toolbar.updateState();
        }
    });

 });

KISSY.Editor.add("plugins~color", function(E) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event,
        UA = YAHOO.env.ua,
        isIE = UA.ie,
        TYPE = E.PLUGIN_TYPE,

        PALETTE_TABLE_TMPL = '<div class="ks-editor-palette-table"><table><tbody>{TR}</tbody></table></div>',
        PALETTE_CELL_TMPL = '<td class="ks-editor-palette-cell"><div class="ks-editor-palette-colorswatch" title="{COLOR}" style="background-color:{COLOR}"></div></td>',

        COLOR_GRAY = ["000", "444", "666", "999", "CCC", "EEE", "F3F3F3", "FFF"],
        COLOR_NORMAL = ["F00", "F90", "FF0", "0F0", "0FF", "00F", "90F", "F0F"],
        COLOR_DETAIL = [
                "F4CCCC", "FCE5CD", "FFF2CC", "D9EAD3", "D0E0E3", "CFE2F3", "D9D2E9", "EAD1DC",
                "EA9999", "F9CB9C", "FFE599", "B6D7A8", "A2C4C9", "9FC5E8", "B4A7D6", "D5A6BD",
                "E06666", "F6B26B", "FFD966", "93C47D", "76A5AF", "6FA8DC", "8E7CC3", "C27BAD",
                "CC0000", "E69138", "F1C232", "6AA84F", "45818E", "3D85C6", "674EA7", "A64D79",
                "990000", "B45F06", "BF9000", "38761D", "134F5C", "0B5394", "351C75", "741B47",
                "660000", "783F04", "7F6000", "274E13", "0C343D", "073763", "20124D", "4C1130"
        ],

        PALETTE_CELL_CLS = "ks-editor-palette-colorswatch",
        PALETTE_CELL_SELECTED = "ks-editor-palette-cell-selected";

    E.addPlugin(["foreColor", "backColor"], {
        /**
         * ���ࣺ�˵���ť
         */
        type: TYPE.TOOLBAR_MENU_BUTTON,

        /**
         * ��ǰѡȡɫ
         */
        color: "",

        /**
         * ��ǰ��ɫָʾ��
         */
        _indicator: null,

        /**
         * ȡɫ��
         */
        swatches: null,

        /**
         * �����������˵���
         */
        dropMenu: null,

        range: null,

        /**
         * ��ʼ��
         */
        init: function() {
            var el = this.domEl,
                caption = el.getElementsByTagName("span")[0].parentNode;

            this.color = this._getDefaultColor();

            Dom.addClass(el, "ks-editor-toolbar-color-button");
            caption.innerHTML = '<div class="ks-editor-toolbar-color-button-indicator" style="border-bottom-color:' + this.color + '">'
                               + caption.innerHTML
                               + '</div>';

            this._indicator = caption.firstChild;

            this._renderUI();
            this._bindUI();

            this.swatches = Dom.getElementsByClassName(PALETTE_CELL_CLS, "div", this.dropMenu);
        },

        _renderUI: function() {
            // �����ַ�����
            //  1. ���� MS Office 2007, �������������ͷʱ���ŵ��������򡣵�� caption ʱ��ֱ��������ɫ��
            //  2. ���� Google Docs, ������ caption �� dropdown����ÿ�ε��������������
            // ���߼��Ͻ�������1�������ǣ����� web ҳ���ϣ���ť�Ƚ�С������2�������������������ԡ�
            // ������÷���2

            this.dropMenu = E.Menu.generateDropMenu(this.editor, this.domEl, [1, 0]);

            // �����������ڵ�����
            this._generatePalettes();

            // ��� ie�����ò���ѡ��
            if (isIE) E.Dom.setItemUnselectable(this.dropMenu);
        },

        _bindUI: function() {
            // ע��ѡȡ�¼�
            this._bindPickEvent();

            Event.on(this.domEl, "click", function() {
                // ���� range, �Ա㻹ԭ
                this.range = this.editor.getSelectionRange();

                // �ۼ�����ť�ϣ����ع�꣬���� ie �¹�����ʾ�ڲ�����
                // ע��ͨ�� blur / focus �ȷ�ʽ�� ie7- ����Ч
                isIE && this.editor.contentDoc.selection.empty();

                // ����ѡ��ɫ
                this._updateSelectedColor(this.color);
            }, this, true);
        },

        /**
         * ����ȡɫ��
         */
        _generatePalettes: function() {
            var htmlCode = "";

            // �ڰ�ɫ��
            htmlCode += this._getPaletteTable(COLOR_GRAY);

            // ����ɫ��
            htmlCode += this._getPaletteTable(COLOR_NORMAL);

            // ��ϸɫ��
            htmlCode += this._getPaletteTable(COLOR_DETAIL);

            // ��ӵ� DOM ��
            this.dropMenu.innerHTML = htmlCode;
        },

        _getPaletteTable: function(colors) {
            var i, len = colors.length, color,
                trs = "<tr>";

            for(i = 0, len = colors.length; i < len; ++i) {
                if(i != 0 && i % 8 == 0) {
                    trs += "</tr><tr>";
                }

                color = E.Color.toRGB("#" + colors[i]).toUpperCase();
                //console.log("color = " + color);
                trs += PALETTE_CELL_TMPL.replace(/{COLOR}/g, color);
            }
            trs += "</tr>";

            return PALETTE_TABLE_TMPL.replace("{TR}", trs);
        },

        /**
         * ��ȡɫ�¼�
         */
        _bindPickEvent: function() {
            var self = this;

            Event.on(this.dropMenu, "click", function(ev) {
                var target = Event.getTarget(ev),
                    attr = target.getAttribute("title");

                if(attr && attr.indexOf("RGB") === 0) {
                    self._doAction(attr);
                }

                // �ر�������
                Event.stopPropagation(ev);
                E.Menu.hideActiveDropMenu(self.editor);
                // ע����������ֹ���¼�ð�ݣ��Լ�����Ի���Ĺرգ�����Ϊ
                // �� Firefox �£���ִ�� doAction ��doc ��ȡ�� click
                // ���� updateState ʱ������ȡ������ǰ����ɫֵ��
                // ��������������Ҳ�кô�����������²���Ҫ���� updateState
            });
        },

        /**
         * ִ�в���
         */
        _doAction: function(val) {
            if (!val) return;

            // ���µ�ǰֵ
            this.setColor(E.Color.toHex(val));

            // ��ԭѡ��
            var range = this.range;
            if (isIE && range.select) range.select();

            // ִ������
            this.editor.execCommand(this.name, this.color);
        },
        
        /**
         * ������ɫ
         * @param {string} val ��ʽ #RRGGBB or #RGB
         */
        setColor: function(val) {
            this.color = val;

            this._updateIndicatorColor(val);
            this._updateSelectedColor(val);
        },

        /**
         * ����ָʾ������ɫ
         * @param val HEX ��ʽ
         */
        _updateIndicatorColor: function(val) {
            // ���� indicator
            this._indicator.style.borderBottomColor = val;
        },

        /**
         * ���������˵���ѡ�е���ɫ
         * @param {string} val ��ʽ #RRGGBB or #RGB
         */
        _updateSelectedColor: function(val) {
            var i, len, swatch, swatches = this.swatches;

            for(i = 0, len = swatches.length; i < len; ++i) {
                swatch = swatches[i];

                // ��ȡ�� backgroundColor �ڲ�ͬ������£���ʽ�в��죬��Ҫͳһת�����ٱȽ�
                if(E.Color.toHex(swatch.style.backgroundColor) == val) {
                    Dom.addClass(swatch.parentNode, PALETTE_CELL_SELECTED);
                } else {
                    Dom.removeClass(swatch.parentNode, PALETTE_CELL_SELECTED);
                }
            }
        },

        /**
         * ���°�ť״̬
         */
        // ie �£�queryCommandValue �޷���ȷ��ȡ�� backColor ��ֵ
        // �ɴ���ô˹��ܣ�ģ�� Office2007 �Ĵ�����ʾ����ѡȡɫ
//        updateState: function() {
//            var doc = this.editor.contentDoc,
//                name = this.name, t, val;
//
//            if(name == "backColor" && UA.gecko) name = "hiliteColor";
//
//            try {
//                if (doc.queryCommandEnabled(name)) {
//                    t = doc.queryCommandValue(name);
//
//                    if(isIE && typeof t == "number") { // ie�£����� backColor, ��ʱ���� int ��ʽ����ʱ�ֻ�ֱ�ӷ��� hex ��ʽ
//                        t = E.Color.int2hex(t);
//                    }
//                    if (t === "transparent") t = ""; // ����ɫΪ͸��ɫʱ��ȡĬ��ɫ
//                    if(t === "rgba(0, 0, 0, 0)") t = ""; // webkit �ı���ɫ�� rgba ��
//
//                    val = t ? E.Color.toHex(t) : this._getDefaultColor(); // t Ϊ���ַ���ʱ����ʾ����ڿ��л���δ������ʽ�ĵط�
//                    if (val && val != this.color) {
//                        this.color = val;
//                        this._updateIndicatorColor(val);
//                    }
//                }
//            } catch(ex) {
//            }
//        },

        _getDefaultColor: function() {
            return (this.name == "foreColor") ? "#000000" : "#ffffff";
        }
    });

});

// TODO
//  1. �� google, �Լ����¼���֧��

KISSY.Editor.add("plugins~font", function(E) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event,
        UA = YAHOO.env.ua,
        TYPE = E.PLUGIN_TYPE,

        OPTION_ITEM_HOVER_CLS = "ks-editor-option-hover",
        SELECT_TMPL = '<ul class="ks-editor-select-list">{LI}</ul>',
        OPTION_TMPL = '<li class="ks-editor-option" data-value="{VALUE}">' +
                          '<span class="ks-editor-option-checkbox"></span>' +
                          '<span style="{STYLE}">{KEY}</span>' +
                      '</li>',
        OPTION_SELECTED = "ks-editor-option-selected",
        WEBKIT_FONT_SIZE = {
            "10px" : 1,
            "13px" : 2,
            "16px" : 3,
            "18px" : 4,
            "24px" : 5,
            "32px" : 6,
            "48px" : 7
        };

    E.addPlugin(["fontName", "fontSize"], {
        /**
         * ���ࣺ�˵���ť
         */
        type: TYPE.TOOLBAR_SELECT,

        /**
         * ��ǰѡ��ֵ
         */
        selectedValue: "",

        /**
         * ѡ���ͷ��
         */
        selectHead: null,

        /**
         * ����������ѡ���б�
         */
        selectList: null,

        /**
         * �������������ѡ��ֵ
         */
        options: [],

        /**
         * �����б���
         */
        items: null,

        /**
         * ѡ�е���
         */
        selectedItem: null,

        /**
         * ѡ���������
         */
        range: null,

        /**
         * ��ʼ��
         */
        init: function() {
            this.options = this.lang.options;
            this.selectHead = this.domEl.getElementsByTagName("span")[0];

            this._renderUI();
            this._bindUI();
        },

        _renderUI: function() {
            // ��ʼ�������� DOM
            this.selectList = E.Menu.generateDropMenu(this.editor, this.domEl, [1, 0]);
            this._renderSelectList();
            this.items = this.selectList.getElementsByTagName("li");
        },

        _bindUI: function() {
            // ע��ѡȡ�¼�
            this._bindPickEvent();

            Event.on(this.domEl, "click", function() {
                // ���� range, �Ա㻹ԭ
                this.range = this.editor.getSelectionRange();

                // �ۼ�����ť�ϣ����ع�꣬���� ie �¹�����ʾ�ڲ�����
                // ע��ͨ�� blur / focus �ȷ�ʽ�� ie7- ����Ч
                UA.ie && this.editor.contentDoc.selection.empty();

                // �����������е�ѡ����
                if(this.selectedValue) {
                    this._updateSelectedOption(this.selectedValue);
                } else if(this.selectedItem) {
                    Dom.removeClass(this.selectedItem, OPTION_SELECTED);
                    this.selectedItem = null;
                }
                
            }, this, true);
        },

        /**
         * ��ʼ�������� DOM
         */
        _renderSelectList: function() {
            var htmlCode = "", options = this.options,
                key, val;

            for(key in options) {
                val = options[key];

                htmlCode += OPTION_TMPL
                        .replace("{VALUE}", val)
                        .replace("{STYLE}", this._getOptionStyle(key, val))
                        .replace("{KEY}", key);
            }

            // ��ӵ� DOM ��
            this.selectList.innerHTML = SELECT_TMPL.replace("{LI}", htmlCode);

            // ��Ӹ��Ի� class
            Dom.addClass(this.selectList, "ks-editor-drop-menu-" + this.name);
        },

        /**
         * ��ȡɫ�¼�
         */
        _bindPickEvent: function() {
            var self = this;

            Event.on(this.selectList, "click", function(ev) {
                var target = Event.getTarget(ev);

                if(target.nodeName != "LI") {
                    target = Dom.getAncestorByTagName(target, "li");
                }
                if(!target) return;

                self._doAction(target.getAttribute("data-value"));

                // �ر�������
                Event.stopPropagation(ev);
                E.Menu.hideActiveDropMenu(self.editor);
                // ע����������ֹ���¼�ð�ݣ��Լ�����Ի���Ĺرգ�����Ϊ
                // �� Firefox �£���ִ�� doAction ��doc ��ȡ�� click
                // ���� updateState ʱ������ȡ������ǰ����ɫֵ��
                // ��������������Ҳ�кô�����������²���Ҫ���� updateState
            });

            // ie6 �£�ģ�� hover
            if(UA.ie === 6) {
                Event.on(this.items, "mouseenter", function() {
                    Dom.addClass(this, OPTION_ITEM_HOVER_CLS);
                });
                Event.on(this.items, "mouseleave", function() {
                    Dom.removeClass(this, OPTION_ITEM_HOVER_CLS);
                });
            }
        },

        /**
         * ִ�в���
         */
        _doAction: function(val) {
            if(!val) return;

            this.selectedValue = val;

            // ���µ�ǰֵ
            this._setOption(val);

            // ��ԭѡ��
            var range = this.range;
            if(UA.ie && range.select) range.select();

            // ִ������
            this.editor.execCommand(this.name, this.selectedValue);
        },

        /**
         * ѡ��ĳһ��
         */
        _setOption: function(val) {
            // ����ͷ��
            this._updateHeadText(this._getOptionKey(val));

            // �����б�ѡ����
            this._updateSelectedOption(val);
        },

        _getOptionStyle: function(key, val) {
          if(this.name == "fontName") {
              return "font-family:" + val;
          } else { // font size
              return "font-size:" + key + "px";
          }
        },

        _getOptionKey: function(val) {
            var options = this.options, key;
            
            for(key in options) {
                if(options[key] == val) {
                    return key;
                }
            }
            return null;
        },

        _updateHeadText: function(val) {
            this.selectHead.innerHTML = val;
        },

        /**
         * �����������ѡ����
         */
        _updateSelectedOption: function(val) {
            var items = this.items,
                i, len = items.length, item;

            for(i = 0; i < len; ++i) {
                item = items[i];

                if(item.getAttribute("data-value") == val) {
                    Dom.addClass(item, OPTION_SELECTED);
                    this.selectedItem = item;
                } else {
                    Dom.removeClass(item, OPTION_SELECTED);
                }
            }
        },

        /**
         * ���°�ť״̬
         */
        updateState: function() {
            var doc = this.editor.contentDoc,
                options = this.options,
                name = this.name, key, val;

            try {
                if (doc.queryCommandEnabled(name)) {
                    val = doc.queryCommandValue(name);

                    if(UA.webkit && name == "fontSize") {
                        val = this._getWebkitFontSize(val);
                    }
                    
                    val && (key = this._getOptionKey(val));
                    //console.log(key + " : " + val);

                    if (key in options) {
                        if(val != this.selectedValue) {
                            this.selectedValue = val;
                            this._updateHeadText(key);
                        }
                    } else {
                        this.selectedValue = "";
                        this._updateHeadText(this.lang.text);
                    }
                }

            } catch(ex) {
            }
        },

        _getWebkitFontSize: function(val) {
            if(val in WEBKIT_FONT_SIZE) return WEBKIT_FONT_SIZE[val];
            return null;
        }
    });

});

// TODO
//  1. �� google, �Լ����¼���֧��
//  3. ie �½ӹܣ������괦��ĳ��ǩ�ڣ��ı�����ʱ���ı�������α�ǩ������

KISSY.Editor.add("plugins~image", function(E) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Connect = Y.Connect, Lang = YAHOO.lang,
        UA = YAHOO.env.ua,
        isIE = UA.ie,
        TYPE = E.PLUGIN_TYPE,

        DIALOG_CLS = "ks-editor-image",
        BTN_OK_CLS = "ks-editor-btn-ok",
        BTN_CANCEL_CLS = "ks-editor-btn-cancel",
        TAB_CLS = "ks-editor-image-tabs",
        TAB_CONTENT_CLS = "ks-editor-image-tab-content",
        UPLOADING_CLS = "ks-editor-image-uploading",
        ACTIONS_CLS = "ks-editor-dialog-actions",
        NO_TAB_CLS = "ks-editor-image-no-tab",
        SELECTED_TAB_CLS = "ks-editor-image-tab-selected",

        TABS_TMPL = { local: '<li rel="local" class="' + SELECTED_TAB_CLS  + '">{tab_local}</li>',
                      link: '<li rel="link">{tab_link}</li>',
                      album: '<li rel="album">{tab_album}</li>'
                    },

        DIALOG_TMPL = ['<form action="javascript: void(0)">',
                          '<ul class="', TAB_CLS ,' ks-clearfix">',
                          '</ul>',
                          '<div class="', TAB_CONTENT_CLS, '" rel="local" style="display: none">',
                              '<label>{label_local}</label>',
                              '<input type="file" size="40" name="imgFile" unselectable="on" />',
                              '{local_extraCode}',
                          '</div>',
                          '<div class="', TAB_CONTENT_CLS, '" rel="link">',
                              '<label>{label_link}</label>',
                              '<input name="imgUrl" size="50" />',
                          '</div>',
                          '<div class="', TAB_CONTENT_CLS, '" rel="album" style="display: none">',
                              '<label>{label_album}</label>',
                              '<p style="width: 300px">��δʵ��...</p>', // TODO: �������ѡ��ͼƬ
                          '</div>',
                          '<div class="', UPLOADING_CLS, '" style="display: none">',
                              '<p style="width: 300px">{uploading}</p>',
                          '</div>',
                          '<div class="', ACTIONS_CLS ,'">',
                              '<button name="ok" class="', BTN_OK_CLS, '">{ok}</button>',
                              '<span class="', BTN_CANCEL_CLS ,'">{cancel}</span>',
                          '</div>',
                      '</form>'].join(""),

        defaultConfig = {
            tabs: ["link"],
            upload: {
                actionUrl: "",
                filter: "png|gif|jpg|jpeg",
                filterMsg: "", // Ĭ��Ϊ this.lang.upload_filter
                enableXdr: false,
                connectionSwf: "http://a.tbcdn.cn/yui/2.8.0r4/build/connection/connection.swf",
                formatResponse: function(data) {
                    var ret = [];
                    for (var key in data) ret.push(data[key]);
                    return ret;
                },
                extraCode: ""
            }
        };

    E.addPlugin("image", {
        /**
         * ���ࣺ��ť
         */
        type: TYPE.TOOLBAR_BUTTON,

        /**
         * ������
         */
        config: {},

        /**
         * �����ĶԻ���
         */
        dialog: null,

        /**
         * �����ı�
         */
        form: null,

        /**
         * ������ range ����
         */
        range: null,

        currentTab: null,
        currentPanel: null,
        uploadingPanel: null,
        actionsBar: null,

        /**
         * ��ʼ������
         */
        init: function() {
            var pluginConfig = this.editor.config.pluginsConfig[this.name] || {};
            defaultConfig.upload.filterMsg = this.lang["upload_filter"];
            this.config = Lang.merge(defaultConfig, pluginConfig);
            this.config.upload = Lang.merge(defaultConfig.upload, pluginConfig.upload || {});

            this._renderUI();
            this._bindUI();

            this.actionsBar = Dom.getElementsByClassName(ACTIONS_CLS, "div", this.dialog)[0];
            this.uploadingPanel = Dom.getElementsByClassName(UPLOADING_CLS, "div", this.dialog)[0];
            this.config.upload.enableXdr && this._initXdrUpload();
        },

        /**
         * ��ʼ���Ի������
         */
        _renderUI: function() {
            var dialog = E.Menu.generateDropMenu(this.editor, this.domEl, [1, 0]),
                lang = this.lang;

            // ����Զ�����
            lang["local_extraCode"] = this.config.upload.extraCode;

            dialog.className += " " + DIALOG_CLS;
            dialog.innerHTML = DIALOG_TMPL.replace(/\{([^}]+)\}/g, function(match, key) {
                return (key in lang) ? lang[key] : key;
            });

            this.dialog = dialog;
            this.form = dialog.getElementsByTagName("form")[0];
            if(isIE) E.Dom.setItemUnselectable(dialog);

            this._renderTabs();
        },

        _renderTabs: function() {
            var lang = this.lang, self = this,
                ul = Dom.getElementsByClassName(TAB_CLS, "ul", this.dialog)[0],
                panels = Dom.getElementsByClassName(TAB_CONTENT_CLS, "div", this.dialog);

            // ����������� tabs
            var keys = this.config["tabs"], html = "";
            for(var k = 0, l = keys.length; k < l; k++) {
                html += TABS_TMPL[keys[k]];
            }

            // �İ�
            ul.innerHTML = html.replace(/\{([^}]+)\}/g, function(match, key) {
                return (key in lang) ? lang[key] : key;
            });

            // ֻ��һ�� tabs ʱ����ʾ
            var tabs = ul.childNodes, len = panels.length;
            if(tabs.length === 1) {
                Dom.addClass(this.dialog, NO_TAB_CLS);
            }

            // �л�
            switchTab(tabs[0]); // Ĭ��ѡ�е�һ��Tab
            Event.on(tabs, "click", function() {
                switchTab(this);
            });

            function switchTab(trigger) {
                var j = 0, rel = trigger.getAttribute("rel");
                for (var i = 0; i < len; i++) {
                    if(tabs[i]) Dom.removeClass(tabs[i], SELECTED_TAB_CLS);
                    panels[i].style.display = "none";

                    if (panels[i].getAttribute("rel") == rel) {
                        j = i;
                    }
                }

                // ie6 �£������ iframe shim
                if(UA.ie === 6) E.Menu._updateShimRegion(self.dialog);

                Dom.addClass(trigger, SELECTED_TAB_CLS);
                panels[j].style.display = "";

                self.currentTab = trigger.getAttribute("rel");
                self.currentPanel = panels[j];
            }
        },

        /**
         * ���¼�
         */
        _bindUI: function() {
            var self = this;

            // ��ʾ/���ضԻ���ʱ���¼�
            Event.on(this.domEl, "click", function() {
                // ������ʾʱ����
                if (self.dialog.style.visibility === isIE ? "hidden" : "visible") { // �¼��Ĵ���˳��ͬ
                    self._syncUI();
                }
            });

            // ע�����ť����¼�
            Event.on(this.dialog, "click", function(ev) {
                var target = Event.getTarget(ev),
                    currentTab = self.currentTab;

                switch(target.className) {
                    case BTN_OK_CLS:
                        if(currentTab === "local") {
                            Event.stopPropagation(ev);
                            self._insertLocalImage();
                        } else {
                            self._insertWebImage();
                        }
                        break;
                    case BTN_CANCEL_CLS: // ֱ������ð�ݣ��رնԻ���
                        break;
                    default: // ����ڷǰ�ť����ֹͣð�ݣ������Ի���
                        Event.stopPropagation(ev);
                }
            });
        },

        /**
         * ��ʼ�������ϴ�
         */
        _initXdrUpload: function() {
            var tabs = this.config["tabs"];

            for(var i = 0, len = tabs.length; i < len; i++) {
                if(tabs[i] === "local") { // ���ϴ� tab ʱ�Ž������²���
                    Connect.transport(this.config.upload.connectionSwf);
                    //Connect.xdrReadyEvent.subscribe(function(){ alert("xdr ready"); });
                    break;
                }
            }
        },

        _insertLocalImage: function() {
            var form = this.form,
                uploadConfig = this.config.upload,
                imgFile = form["imgFile"].value,
                actionUrl = uploadConfig.actionUrl,
                self = this, ext;

            if (imgFile && actionUrl) {

                // ����ļ������Ƿ���ȷ
                if(uploadConfig.filter !== "*") {
                    ext = imgFile.substring(imgFile.lastIndexOf(".") + 1).toLowerCase();
                    if(uploadConfig.filter.indexOf(ext) == -1) {
                        alert(uploadConfig.filterMsg);
                        self.form.reset();
                        return;
                    }
                }

                // ��ʾ�ϴ�������
                this.uploadingPanel.style.display = "";
                this.currentPanel.style.display = "none";
                this.actionsBar.style.display = "none";
                if(UA.ie === 6) E.Menu._updateShimRegion(this.dialog); // ie6 �£�������� iframe shim

                // ���� XHR
                Connect.setForm(form, true);
                Connect.asyncRequest("post", actionUrl, {
                    upload: function(o) {
                        try {
                            // ��׼��ʽ���£�
                            // �ɹ�ʱ������ ["0", "ͼƬ��ַ"]
                            // ʧ��ʱ������ ["1", "������Ϣ"]
                            var data = uploadConfig.formatResponse(Lang.JSON.parse(o.responseText));
                            if (data[0] == "0") {
                                self._insertImage(data[1]);
                                self._hideDialog();
                            } else {
                                self._onUploadError(data[1]);
                            }
                        }
                        catch(ex) {
                            self._onUploadError(
                                    Lang.dump(ex) +
                                    "\no = " + Lang.dump(o) +
                                    "\n[from upload catch code]");
                        }
                    },
                    xdr: uploadConfig.enableXdr
                });
            } else {
                self._hideDialog();
            }
        },

        _onUploadError: function(msg) {
            alert(this.lang["upload_error"] + "\n\n" + msg);
            this._hideDialog();

            // ���������´������ͣ�
            //   - json parse �쳣������ actionUrl �����ڡ�δ��¼������ȸ�������
            //   - �������˷��ش�����Ϣ ["1", "error msg"]
        },

        _insertWebImage: function() {
            var imgUrl = this.form["imgUrl"].value;
            imgUrl && this._insertImage(imgUrl);
        },

        /**
         * ���ضԻ���
         */
        _hideDialog: function() {
            var activeDropMenu = this.editor.activeDropMenu;
            if(activeDropMenu && Dom.isAncestor(activeDropMenu, this.dialog)) {
                E.Menu.hideActiveDropMenu(this.editor);
            }

            // ��ԭ����
            this.editor.contentWin.focus();
        },

        /**
         * ���½����ϵı�ֵ
         */
        _syncUI: function() {
            // ���� range, �Ա㻹ԭ
            this.range = E.Range.saveRange(this.editor);

            // reset
            this.form.reset();

            // restore
            this.uploadingPanel.style.display = "none";
            this.currentPanel.style.display = "";
            this.actionsBar.style.display = "";
        },

        /**
         * ����ͼƬ
         */
        _insertImage: function(url, alt) {
            url = Lang.trim(url);

            // url Ϊ��ʱ��������
            if (url.length === 0) {
                return;
            }

            var editor = this.editor,
                range = this.range;

            // ����ͼƬ
            if (window.getSelection) { // W3C
                var img = editor.contentDoc.createElement("img");
                img.src = url;
                if(alt) img.setAttribute("alt", alt);

                range.deleteContents(); // ���ѡ������
                range.insertNode(img); // ����ͼƬ

                // ʹ����������ͼƬʱ������ں���
                if(UA.webkit) {
                    var selection = editor.contentWin.getSelection();
                    selection.addRange(range);
                    selection.collapseToEnd();
                } else {
                    range.setStartAfter(img);
                }

                editor.contentWin.focus(); // ��ʾ���

            } else if(document.selection) { // IE
                // ��ԭ����
                editor.contentWin.focus();

                if("text" in range) { // TextRange
                    range.select(); // ��ԭѡ��

                    var html = '<img src="' + url + '"';
                    alt && (html += ' "alt="' + alt + '"');
                    html += '>';
                    range.pasteHTML(html);

                } else { // ControlRange
                    range.execCommand("insertImage", false, url);
                }
            }
        }
    });

 });

/**
 * NOTES:
 *   - <input type="file" unselectable="on" /> ��һ�У�������һ���硣������� unselectable, �ᵼ�� IE ��
 *     ���㶪ʧ��range.select() �� contentDoc.focus() �����ã������Ϻ�˳�������ͬʱ���Զ�ʹ�� IE7- �²���
 *     ���롣
 *
 * TODO:
 *   - ����֧��
 */

KISSY.Editor.add("plugins~indent", function(E) {

    var //Y = YAHOO.util, Dom = Y.Dom, Lang = YAHOO.lang,
        TYPE = E.PLUGIN_TYPE,
        //UA = YAHOO.env.ua,

//        INDENT_ELEMENTS = Lang.merge(E.Dom.BLOCK_ELEMENTS, {
//            li: 0 // ȡ�� li Ԫ�صĵ����������� ol/ul ��������
//        }),
//        INDENT_STEP = "40",
//        INDENT_UNIT = "px",

        plugin = {
            /**
             * ���ࣺ��ͨ��ť
             */
            type: TYPE.TOOLBAR_BUTTON,

            /**
             * ��Ӧ����
             */
            exec: function() {
                // ִ������
                this.editor.execCommand(this.name);

                // ����״̬
                // ����ʱ�����ܻ�ɵ� list ��״̬
                this.editor.toolbar.updateState();
            }
        };

    // ע��ie �£�Ĭ��ʹ�� blockquote Ԫ����ʵ������
    // ��������������� range �ķ�ʽ��ʵ�֣��Ա��ֺ����������һ��
    // ie �£���ʱ������Ĭ�ϵ�
//    if (UA.ie) {
//
//        plugin.exec = function() {
//            var range = this.editor.getSelectionRange(),
//                parentEl, indentableAncestor;
//
//            if(range.parentElement) { // TextRange
//                parentEl = range.parentElement();
//            } else if(range.item) { // ControlRange
//                parentEl = range.item(0);
//            } else { // �����κδ���
//                return;
//            }
//
//            // TODO: �� CKEditor һ������ȫʵ�ֶ������ iterator
//            // ������ blockquote ��ʱ��������ѡ���Ķ����ĸ���Ԫ�ظպ���body���龰
//            // ע�⣺Ҫ�� blockquote ����ʽΪ������ʽ
//            if(parentEl === this.editor.contentDoc.body) {
//                this.editor.execCommand(this.name);
//                return;
//            }
//            // end of ��ʱ�������
//
//            // ��ȡ�������ĸ�Ԫ��
//            if (isIndentableElement(parentEl)) {
//                 indentableAncestor = parentEl;
//            } else {
//                 indentableAncestor = getIndentableAncestor(parentEl);
//            }
//
//            // ���� margin-left
//            if (indentableAncestor) {
//                var val = parseInt(indentableAncestor.style.marginLeft) >> 0;
//                val += (this.name === "indent" ? +1 : -1) * INDENT_STEP;
//
//                indentableAncestor.style.marginLeft = val + INDENT_UNIT;
//            }
//
//            /**
//             * ��ȡ�������ĸ�Ԫ��
//             */
//            function getIndentableAncestor(el) {
//                return Dom.getAncestorBy(el, function(elem) {
//                    return isIndentableElement(elem);
//                });
//            }
//
//            /**
//             * �ж��Ƿ������Ԫ��
//             */
//            function isIndentableElement(el) {
//                return INDENT_ELEMENTS[el.nodeName.toLowerCase()];
//            }
//        };
//    }

    // ע����
    E.addPlugin(["indent", "outdent"], plugin);
 });

/**
 * NOTES:
 * 
 *  - Ҫ����ȫ�ӹ� ie ��Ĭ��ʵ�֣���Ҫ���ǵ����غܶࡣ���磺
 *     1. range ֻ�� inline Ԫ�أ�����Ĵ�����ʵ��
 *     2. range ����������Ŀ�Ԫ�أ������Ҫʵ��һ�� blockIterator
 *     3. range ����Ԫ�غ���һ����Ԫ�صĲ��֣��������Ҫʵ��һ�� html parser ��Э��
 *
 */

KISSY.Editor.add("plugins~justify", function(E) {

    var //Y = YAHOO.util, Dom = Y.Dom,
        TYPE = E.PLUGIN_TYPE,
        NAMES = ["justifyLeft", "justifyCenter", "justifyRight"],
        //UA = YAHOO.env.ua,

        //JUSTIFY_ELEMENTS = E.Dom.BLOCK_ELEMENTS,

        plugin = {
            /**
             * ���ࣺ��ͨ��ť
             */
            type: TYPE.TOOLBAR_BUTTON,

            /**
             * ��Ӧ����
             */
            exec: function() {
                // ִ������
                this.editor.execCommand(this.name);

                // ����״̬
                this.editor.toolbar.updateState(NAMES);
            }
        };

    // ע��ie �£�Ĭ��ʹ�� align ������ʵ�ֶ���
    // ��������������� range �ķ�ʽ��ʵ�֣��Ա��ֺ����������һ��
    // ע��ѡ�������ж����ʱ������Ĵ��������� [Issue 4]
    // ��ʱ������Ĭ�ϵ����������
//    if (UA.ie) {
//
//        plugin.exec = function() {
//            var range = this.editor.getSelectionRange(),
//                parentEl, justifyAncestor;
//
//            if(range.parentElement) { // TextRange
//                parentEl = range.parentElement();
//            } else if(range.item) { // ControlRange
//                parentEl = range.item(0);
//            } else { // �����κδ���
//                return;
//            }
//
//            // ��ȡ�ɶ���ĸ�Ԫ��
//            if (isJustifyElement(parentEl)) {
//                justifyAncestor = parentEl;
//            } else {
//                justifyAncestor = getJustifyAncestor(parentEl);
//            }
//
//            // ���� text-align
//            if (justifyAncestor) {
//                justifyAncestor.style.textAlign = this.name.substring(7).toLowerCase();
//            }
//
//            /**
//             * ��ȡ�����ö���ĸ�Ԫ��
//             */
//            function getJustifyAncestor(el) {
//                return Dom.getAncestorBy(el, function(elem) {
//                    return isJustifyElement(elem);
//                });
//            }
//
//            /**
//             * �ж��Ƿ�ɶ���Ԫ��
//             */
//            function isJustifyElement(el) {
//                return JUSTIFY_ELEMENTS[el.nodeName.toLowerCase()];
//            }
//        };
//    }


    // ע����
    E.addPlugin(NAMES, plugin);

});

KISSY.Editor.add("plugins~keystroke", function(E) {

    var Y = YAHOO.util, Event = Y.Event,
        UA = YAHOO.env.ua,
        TYPE = E.PLUGIN_TYPE;


    E.addPlugin("keystroke", {
        /**
         * ����
         */
        type: TYPE.FUNC,

        /**
         * ��ʼ��
         */
        init: function() {
            var editor = this.editor;

            // [bug fix] ie7- �£����� Tab ���󣬹�껹�ڱ༭������˸�����һس��ύ��Ч
            if (UA.ie && UA.ie < 8) {
                Event.on(editor.contentDoc, "keydown", function(ev) {
                    if(ev.keyCode == 9) {
                        this.selection.empty();
                    }
                });
            }
        }

    });
 });

KISSY.Editor.add("plugins~link", function(E) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = YAHOO.lang,
        UA = YAHOO.env.ua, isIE = UA.ie,
        TYPE = E.PLUGIN_TYPE, Range = E.Range,
        timeStamp = new Date().getTime(),
        HREF_REG = /^\w+:\/\/.*|#.*$/,

        DIALOG_CLS = "ks-editor-link",
        NEW_LINK_CLS = "ks-editor-link-newlink-mode",
        BTN_OK_CLS = "ks-editor-btn-ok",
        BTN_CANCEL_CLS = "ks-editor-btn-cancel",
        BTN_REMOVE_CLS = "ks-editor-link-remove",
        DEFAULT_HREF = "http://",

        DIALOG_TMPL = ['<form onsubmit="return false"><ul>',
                          '<li class="ks-editor-link-href"><label>{href}</label><input name="href" style="width: 220px" value="http://" type="text" /></li>',
                          '<li class="ks-editor-link-target"><input name="target" id="target_"', timeStamp ,' type="checkbox" /> <label for="target_"', timeStamp ,'>{target}</label></li>',
                          '<li class="ks-editor-dialog-actions">',
                              '<button name="ok" class="', BTN_OK_CLS, '">{ok}</button>',
                              '<span class="', BTN_CANCEL_CLS ,'">{cancel}</span>',
                              '<span class="', BTN_REMOVE_CLS ,'">{remove}</span>',
                          '</li>',
                      '</ul></form>'].join("");

    E.addPlugin("link", {
        /**
         * ���ࣺ��ť
         */
        type: TYPE.TOOLBAR_BUTTON,

        /**
         * �����ĶԻ���
         */
        dialog: null,

        /**
         * �����ı�
         */
        form: null,

        /**
         * ������ range ����
         */
        range: null,

        /**
         * ��ʼ������
         */
        init: function() {
            this._renderUI();
            this._bindUI();
        },

        /**
         * ��ʼ���Ի������
         */
        _renderUI: function() {
            var dialog = E.Menu.generateDropMenu(this.editor, this.domEl, [1, 0]),
                lang = this.lang;

            dialog.className += " " + DIALOG_CLS;
            dialog.innerHTML = DIALOG_TMPL.replace(/\{([^}]+)\}/g, function(match, key) {
                return lang[key] ? lang[key] : key;
            });

            this.dialog = dialog;
            this.form = dialog.getElementsByTagName("form")[0];

            // webkit ����Ĭ�ϵ� exeCommand, ������ target ����
            UA.webkit && (this.form.target.parentNode.style.display = "none");

            isIE && E.Dom.setItemUnselectable(dialog);
        },

        /**
         * ���¼�
         */
        _bindUI: function() {
            var form = this.form, self = this;

            // ��ʾ/���ضԻ���ʱ���¼�
            Event.on(this.domEl, "click", function() {
                // ������ʾʱ����
                if(self.dialog.style.visibility === isIE ? "hidden" : "visible") { // �¼��Ĵ���˳��ͬ
                    self._syncUI();
                }
            });

            // ע�����ť����¼�
            Event.on(this.dialog, "click", function(ev) {
                var target = Event.getTarget(ev);

                switch(target.className) {
                    case BTN_OK_CLS:
                        self._createLink(form.href.value, form.target.checked);
                        break;
                    case BTN_CANCEL_CLS: // ֱ������ð�ݣ��رնԻ���
                        break;
                    case BTN_REMOVE_CLS:
                        self._unLink();
                        break;
                    default: // ����ڷǰ�ť����ֹͣð�ݣ������Ի���
                        Event.stopPropagation(ev);
                }
            });
        },

        /**
         * ���½����ϵı�ֵ
         */
        _syncUI: function() {
            // ���� range, �Ա㻹ԭ
            this.range = E.Range.saveRange(this.editor);

            var form = this.form, container, a;

            container = Range.getCommonAncestor(this.range);
            a = (container.nodeName == "A") ? container : Dom.getAncestorByTagName(container, "A");

            // �޸����ӽ���
            if(a) {
                form.href.value = a.href;
                form.target.checked = a.target === "_blank";
                Dom.removeClass(form, NEW_LINK_CLS);

            } else { // �½����ӽ���
                form.href.value = DEFAULT_HREF;
                form.target.checked = false;
                Dom.addClass(form, NEW_LINK_CLS);
            }

            // ���� setTimout ��� for ie
            setTimeout(function() {
                form.href.select();
            }, 50);
        },

        /**
         * ����/�޸�����
         */
        _createLink: function(href, target) {
            href = this._getValidHref(href);

            // href Ϊ��ʱ���Ƴ�����
            if (href.length === 0) {
                this._unLink();
                return;
            }

            var range = this.range,
                div = document.createElement("div"),
                a, container, fragment;

            // �޸�����
            container = Range.getCommonAncestor(range);
            a = (container.nodeName == "A") ? container : Dom.getAncestorByTagName(container, "A");
            if (a) {
                a.href = href;
                if (target) a.setAttribute("target", "_blank");
                else a.removeAttribute("target");
                return;
            }

            // ��������
            a = document.createElement("a");
            a.href = href;
            if (target) a.setAttribute("target", "_blank");

            if (isIE) {
                if (range.select) range.select();
                
                if("text" in range) { // TextRange
                    a.innerHTML = range.htmlText || href;
                    div.innerHTML = "";
                    div.appendChild(a);
                    range.pasteHTML(div.innerHTML);
                } else { // ControlRange
                    // TODO: ControlRange ���ӵ� target ʵ��
                    this.editor.execCommand("createLink", href);
                }

            } else if(UA.webkit) { // TODO: https://bugs.webkit.org/show_bug.cgi?id=16867
                this.editor.execCommand("createLink", href);

            } else { // W3C
                if(range.collapsed) {
                    a.innerHTML = href;
                } else {
                    fragment = range.cloneContents();
                    while(fragment.firstChild) {
                        a.appendChild(fragment.firstChild);
                    }
                }
                range.deleteContents(); // ɾ��ԭ����
                range.insertNode(a); // ��������
                range.selectNode(a); // ѡ������
            }
        },

        _getValidHref: function(href) {
            href = Lang.trim(href);
            if(href && !HREF_REG.test(href)) { // ��Ϊ�� �� �����ϱ�׼ģʽ abcd://efg
               href = DEFAULT_HREF + href; // ���Ĭ��ǰ׺
            }
            return href;
        },

        /**
         * �Ƴ�����
         */
        _unLink: function() {
            var editor = this.editor,
                range = this.range,
                selectedText = Range.getSelectedText(range),
                container = Range.getCommonAncestor(range),
                parentEl;

            // û��ѡ������ʱ
            if (!selectedText && container.nodeType == 3) {
                parentEl = container.parentNode;
                if (parentEl.nodeName == "A") {
                    parentEl.parentNode.replaceChild(container, parentEl);
                }
            } else {
                if(range.select) range.select();
                editor.execCommand("unLink", null);
            }
        }
    });

 });

// TODO:
// ��ѡ����������/һ���ְ�������ʱ�����ɵ��������ݵĵ��Ŵ���
// Ŀǰֻ�� Google Docs �����Ż��������༭�������������Ĭ�ϵĴ���ʽ��
// �ȼ��ڴˣ����Ժ��Ż���

/**
 * Notes:
 *  1. �� ie �£�����������ϵİ�ťʱ���ᵼ�� iframe �༭����� range ѡ����ʧ������취�ǣ�
 *     ������Ԫ����� unselectable ���ԡ����ǣ����� text input ��Ϊ�������룬������ unselectable
 *     ���ԡ���͵�����ì�ܡ���ˣ�Ȩ��֮��Ľ���취�ǣ��ڶԻ��򵯳�ǰ���� range ���󱣴�������
 *     ��ʧ����ͨ�� range.select() ѡ���������������Ѿ���������
 *  2. Ŀǰֻ�� CKEditor �� TinyMCE ����ȫ�ӹ������ı༭������ú��������� 1 �Ľ��������Ŀǰ�Ѿ�
 *     ���ã��ɱ�Ҳ�ܵ͡�
 */
KISSY.Editor.add("plugins~resize", function(E) {

    var Y = YAHOO.util, Event = Y.Event,
        UA = YAHOO.env.ua,
        TYPE = E.PLUGIN_TYPE,

        TMPL = '<span class="ks-editor-resize-larger" title="{larger_title}">{larger_text}</span>'
             + '<span class="ks-editor-resize-smaller" title="{smaller_title}">{smaller_text}</span>';


    E.addPlugin("resize", {

        /**
         * ���ࣺ״̬�����
         */
        type: TYPE.STATUSBAR_ITEM,

        contentEl: null,

        currentHeight: 0,

        /**
         * ��ʼ��
         */
        init: function() {
            this.contentEl = this.editor.container.childNodes[1];
            this.currentHeight = parseInt(this.contentEl.style.height);

            this.renderUI();
            this.bindUI();
        },

        renderUI: function() {
            var lang = this.lang;

            this.domEl.innerHTML = TMPL.replace(/\{([^}]+)\}/g, function(match, key) {
                            return lang[key] ? lang[key] : key;
                        });
        },

        bindUI: function() {
            var spans = this.domEl.getElementsByTagName("span"),
                largerEl = spans[0],
                smallerEl = spans[1],
                contentEl = this.contentEl;

            Event.on(largerEl, "click", function() {
                this.currentHeight += 100;
                this._doResize();
            }, this, true);

            Event.on(smallerEl, "click", function() {

                // ����С�� 0
                if (this.currentHeight < 100) {
                    this.currentHeight = 0;
                } else {
                    this.currentHeight -= 100;
                }

                this._doResize();
            }, this, true);
        },

        _doResize: function() {
            this.contentEl.style.height = this.currentHeight + "px";

            // ����ͨ������ textarea �� height: 100% �Զ�����Ӧ�߶���
            // �� ie7- �� css ���������⣬��˸ɴ����������� js �㶨
            this.editor.textarea.style.height = this.currentHeight + "px";
        }

    });

 });

/**
 * TODO:
 *   - ��ȫ���༭Ҳ����˴�
 */
KISSY.Editor.add("plugins~save", function(E) {

    var Y = YAHOO.util, Event = Y.Event,
        TYPE = E.PLUGIN_TYPE,

        TAG_MAP = {
            b: { tag: "strong" },
            i: { tag: "em" },
            u: { tag: "span", style: "text-decoration:underline" },
            strike: { tag: "span", style: "text-decoration:line-through" }
        };


    E.addPlugin("save", {
        /**
         * ����
         */
        type: TYPE.FUNC,

        /**
         * ��ʼ��
         */
        init: function() {
            var editor = this.editor,
                textarea = editor.textarea,
                form = textarea.form;

            if(form) {
                Event.on(form, "submit", function() {
                    if(!editor.sourceMode) {
                        //var val = editor.getData();
                        // ͳһ��ʽ  �ɺ�̨����
//                        if(val && val.indexOf('<div class="ks-editor-post">') !== 0) {
//                            val = '<div class="ks-editor-post">' + val + '</div>';
//                        }
                        textarea.value = editor.getData();
                    }
                });
            }
        },

        /**
         * ��������
         */
        filterData: function(data) {

            data = data.replace(/<(\/?)([^>\s]+)([^>]*)>/g, function(m, slash, tag, attr) {

                // �� ie �Ĵ�д��ǩת��ΪСд
                tag = tag.toLowerCase();

                // �ñ�ǩ���廯
                var map = TAG_MAP[tag],
                    ret = tag;

                // ����� <tag> ���ֲ������Եı�ǩ����һ������
                if(map && !attr) {
                    ret = map["tag"];
                    if(!slash && map["style"]) {
                        ret += ' style="' + map["style"] + '"';
                    }
                }

                return "<" + slash + ret + attr + ">";
            });

            // ���� word ����������
            if(data.indexOf("mso") > 0) {
                data = this.filterWord(data);
            }

            return data;

            // ע:
            //  1. �� data �ܴ�ʱ������� replace ���ܻ����������⡣
            //    �����£��Ѿ������ replace �ϲ�����һ������������£��������������⣩
            //
            //  2. �������廯��google ��ʵ�ã���δ�ض�
            // TODO: ��һ���Ż������� <span style="..."><span style="..."> ����span���Ժϲ�Ϊһ��

            // FCKEditor ʵ���˲������廯
            // Google Docs ������ʵ������
            // KISSY Editor ��ԭ���ǣ��ڱ�֤ʵ�õĻ����ϣ��������廯
        },

        /**
         * ���� word ճ����������������
         * Ref: CKEditor - pastefromword plugin
         */
        filterWord: function(html) {

            // Remove onmouseover and onmouseout events (from MS Word comments effect)
            html = html.replace(/<(\w[^>]*) onmouseover="([^\"]*)"([^>]*)/gi, "<$1$3");
            html = html.replace(/<(\w[^>]*) onmouseout="([^\"]*)"([^>]*)/gi, "<$1$3");

            // The original <Hn> tag send from Word is something like this: <Hn style="margin-top:0px;margin-bottom:0px">
            html = html.replace(/<H(\d)([^>]*)>/gi, "<h$1>");

            // Word likes to insert extra <font> tags, when using MSIE. (Wierd).
            html = html.replace(/<(H\d)><FONT[^>]*>([\s\S]*?)<\/FONT><\/\1>/gi, "<$1>$2<\/$1>");
            html = html.replace(/<(H\d)><EM>([\s\S]*?)<\/EM><\/\1>/gi, "<$1>$2<\/$1>");

            // Remove <meta xx...>
            html = html.replace(/<meta[^>]*>/ig, "");

            // Remove <link rel="xx" href="file:///...">
            html = html.replace(/<link rel="\S+" href="file:[^>]*">/ig, "");

            // Remove <!--[if gte mso 9|10]>...<![endif]-->
            html = html.replace(/<!--\[if gte mso [0-9]{1,2}\]>[\s\S]*?<!\[endif\]-->/ig, "");

            // Remove <style> ...mso...</style>
            html = html.replace(/<style>[\s\S]*?mso[\s\S]*?<\/style>/ig, "");

            // Remove lang="..."
            html = html.replace(/ lang=".+?"/ig, "");

            // Remove <o:p></o:p>
            html = html.replace(/<o:p><\/o:p>/ig, "");

            // Remove class="MsoNormal"
            html = html.replace(/ class="Mso.+?"/ig, "");

            return html;
        }

    });
 });

KISSY.Editor.add("plugins~smiley", function(E) {

    var Y = YAHOO.util, Event = Y.Event, Lang = YAHOO.lang,
        UA = YAHOO.env.ua,
        TYPE = E.PLUGIN_TYPE,

        DIALOG_CLS = "ks-editor-smiley-dialog",
        ICONS_CLS = "ks-editor-smiley-icons",
        SPRITE_CLS = "ks-editor-smiley-sprite",

        defaultConfig = {
                tabs: ["default"]
            };

    E.addPlugin("smiley", {
        /**
         * ���ࣺ��ť
         */
        type: TYPE.TOOLBAR_BUTTON,

        /**
         * ������
         */
        config: {},

        /**
         * �����ĶԻ���
         */
        dialog: null,

        /**
         * ������ range ����
         */
        range: null,

        /**
         * ��ʼ������
         */
        init: function() {
            this.config = Lang.merge(defaultConfig, this.editor.config.pluginsConfig[this.name] || {});

            this._renderUI();
            this._bindUI();
        },

        /**
         * ��ʼ���Ի������
         */
        _renderUI: function() {
            var dialog = E.Menu.generateDropMenu(this.editor, this.domEl, [1, 0]);

            dialog.className += " " + DIALOG_CLS;
            this.dialog = dialog;
            this._renderDialog();

            if(UA.ie) E.Dom.setItemUnselectable(dialog);
        },

        _renderDialog: function() {
            var smileyConfig = E.Smilies[this.config["tabs"][0]], // TODO: ֧�ֶ�� tab
                mode = smileyConfig["mode"];

            if(mode === "icons") this._renderIcons(smileyConfig);
            else if(mode === "sprite") this._renderSprite(smileyConfig);

        },

        _renderIcons: function(config) {
            var base = this.editor.config.base + "smilies/" + config["name"] + "/",
                fileNames = config["fileNames"],
                fileExt = "." + config["fileExt"],
                cols = config["cols"],
                htmlCode = [],
                i, len = fileNames.length, name;

            htmlCode.push('<div class="' + ICONS_CLS + '">');
            for(i = 0; i < len; i++) {
                name = fileNames[i];

                htmlCode.push(
                        '<img src="' + base +  name + fileExt
                        + '" alt="' + name
                        + '" title="' + name
                        + '" />');

                if(i % cols === cols - 1) htmlCode.push("<br />");
            }
            htmlCode.push('</div');

            this.dialog.innerHTML = htmlCode.join("");
        },

        _renderSprite: function(config) {
            var base = config.base,
                filePattern = config["filePattern"],
                fileExt = "." + config["fileExt"],
                len = filePattern.end + 1,
                step = filePattern.step,
                i, code = [];

            code.push('<div class="' + SPRITE_CLS + ' ks-clearfix" style="' + config["spriteStyle"] + '">');
            for(i = 0; i < len; i += step) {
                code.push(
                        '<span data-icon="' + base +  i + fileExt
                        + '" style="' + config["unitStyle"] + '"></span>');
            }
            code.push('</div');

            this.dialog.innerHTML = code.join("");
        },

        /**
         * ���¼�
         */
        _bindUI: function() {
            var self = this;

            // range ����
            Event.on(this.domEl, "click", function() {
                self.range = E.Range.saveRange(self.editor);
            });

            // ע�����ť����¼�
            Event.on(this.dialog, "click", function(ev) {
                var target = Event.getTarget(ev);

                switch(target.nodeName) {
                    case "IMG":
                        self._insertImage(target.src, target.getAttribute("alt"));
                        break;
                    case "SPAN":
                        self._insertImage(target.getAttribute("data-icon"), "");
                        break;
                    default: // ����ڷǰ�ť����ֹͣð�ݣ������Ի���
                        Event.stopPropagation(ev);
                }
            });
        },

        /**
         * ����ͼƬ
         */
        _insertImage: function(url, alt) {
            url = Lang.trim(url);

            // url Ϊ��ʱ��������
            if (url.length === 0) {
                return;
            }

            var editor = this.editor,
                range = this.range;

            // ����ͼƬ
            if (window.getSelection) { // W3C
                var img = editor.contentDoc.createElement("img");
                img.src = url;
                img.setAttribute("alt", alt);

                range.deleteContents(); // ���ѡ������
                range.insertNode(img); // ����ͼƬ

                // ʹ����������ͼƬʱ������ں���
                if(UA.webkit) {
                    var selection = editor.contentWin.getSelection();
                    selection.addRange(range);
                    selection.collapseToEnd();
                } else {
                    range.setStartAfter(img);
                }

                editor.contentWin.focus(); // ��ʾ���

            } else if(document.selection) { // IE
                if("text" in range) { // TextRange
                    range.pasteHTML('<img src="' + url + '" alt="' + alt + '" />');

                } else { // ControlRange
                    editor.execCommand("insertImage", url);
                }
            }
        }
    });

 });

/**
 * NOTES:
 *   - Webkit �£����ܽ�һ�� document �ڴ����� dom �ڵ��ƶ�����һ�� document
 *     http://www.codingforums.com/archive/index.php/t-153219.html 
 */
// TODO:
//  1. ���ױ���֧��
//  2. ����Ķ������֧�֣����� alt �� title ��Ϣ

KISSY.Editor.add("plugins~source", function(E) {

    var Y = YAHOO.util, Dom = Y.Dom,
        UA = YAHOO.env.ua,
        TYPE = E.PLUGIN_TYPE,

        TOOLBAR_BUTTON_SELECTED = "ks-editor-toolbar-button-selected",
        SRC_MODE_CLS = "ks-editor-src-mode";

    /**
     * �鿴Դ������
     */
    E.addPlugin("source", {
        /**
         * ���ࣺ��ͨ��ť
         */
        type: TYPE.TOOLBAR_BUTTON,

        /**
         * ��ʼ������
         */
        init: function() {
            var editor = this.editor;

            this.iframe = editor.contentWin.frameElement;
            this.textarea = editor.textarea;

            // �� textarea ���� iframe ����
            this.iframe.parentNode.appendChild(editor.textarea);

            // ��� class
            Dom.addClass(this.domEl, "ks-editor-toolbar-source-button");
        },

        /**
         * ��Ӧ����
         */
        exec: function() {
            var editor = this.editor,
                srcOn = editor.sourceMode;

            // ͬ������
            if(srcOn) {
                editor.contentDoc.body.innerHTML = this.textarea.value;
            } else {
                this.textarea.value = editor.getContentDocData();
            }

            // [bug fix] ie7-�£��л���Դ��ʱ��iframe �Ĺ�껹�ɼ��������ص�
            if(UA.ie && UA.ie < 8) {
                editor.contentDoc.selection.empty();
            }

            // �л���ʾ
            this.textarea.style.display = srcOn ? "none" : "";
            this.iframe.style.display = srcOn ? "" : "none";

            // ����״̬
            editor.sourceMode = !srcOn;

            // ���°�ť״̬
            this._updateButtonState();
        },

        /**
         * ���°�ť״̬
         */
        _updateButtonState: function() {
            var editor = this.editor,
                srcOn = editor.sourceMode;

            if(srcOn) {
                Dom.addClass(editor.container, SRC_MODE_CLS);
                Dom.addClass(this.domEl, TOOLBAR_BUTTON_SELECTED);
            } else {
                Dom.removeClass(editor.container, SRC_MODE_CLS);
                Dom.removeClass(this.domEl, TOOLBAR_BUTTON_SELECTED);
            }
        }

    });

 });

KISSY.Editor.add("plugins~undo", function(E) {

    var TYPE = E.PLUGIN_TYPE;

    E.addPlugin(["undo", "redo"], {
        /**
         * ���ࣺ��ͨ��ť
         */
        type: TYPE.TOOLBAR_BUTTON,

        /**
         * ��Ӧ����
         */
        exec: function() {
            // TODO �ӹ�
            this.editor.execCommand(this.name);
        }
    });

 });

/**
 * TODO:
 *   - ie �£�ֻҪ�� dom ������undo �� redo �ͻ�ʧЧ��
 *     http://swik.net/qooxdoo/qooxdoo+news/Clashed+with+IE%E2%80%99s+execCommand/cj7g7
 */
KISSY.Editor.add("plugins~wordcount", function(E) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = YAHOO.lang,
        TYPE = E.PLUGIN_TYPE,
        ALARM_CLS = "ks-editor-wordcount-alarm",

        defaultConfig = {
            total       : 50000,
            threshold   : 100
        };

    E.addPlugin("wordcount", {

        /**
         * ���ࣺ״̬�����
         */
        type: TYPE.STATUSBAR_ITEM,

        total: Infinity,

        remain: Infinity,

        threshold: 0,

        remainEl: null,

        /**
         * ��ʼ��
         */
        init: function() {
            var config = Lang.merge(defaultConfig, this.editor.config.pluginsConfig[this.name] || {});
            this.total = config["total"];
            this.threshold = config["threshold"];

            this.renderUI();
            this.bindUI();

            // ȷ���������������ݼ�����ɺ�
            var self = this;
            setTimeout(function() {
                self.syncUI();
            }, 50);
        },

        renderUI: function() {
            this.domEl.innerHTML = this.lang["tmpl"]
                    .replace("%remain%", "<em>" + this.total + "</em>");

            this.remainEl = this.domEl.getElementsByTagName("em")[0];
        },

        bindUI: function() {
            var editor = this.editor;

            Event.on(editor.textarea, "keyup", this.syncUI, this, true);

            Event.on(editor.contentDoc, "keyup", this.syncUI, this, true);
            // TODO: ��������/�����������
            Event.on(editor.container, "click", this.syncUI, this, true);
        },

        syncUI: function() {
            this.remain = this.total - this.editor.getData().length;
            this.remainEl.innerHTML = this.remain;

            if(this.remain <= this.threshold) {
                Dom.addClass(this.domEl, ALARM_CLS);
            } else {
                Dom.removeClass(this.domEl, ALARM_CLS);
            }
        }
    });

 });

/**
 * TODO:
 *   - ���� GBK �����£�һ�������ַ�����Ϊ 2
 */