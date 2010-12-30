/*
Copyright 2010, KISSY UI Library v1.1.7dev
MIT Licensed
build time: ${build.time}
*/
KISSY.add("ajax",function(d,B){function i(a){a=d.merge(J,a);if(a.url){if(a.data&&!d.isString(a.data))a.data=d.param(a.data);a.context=a.context||a;var b,e=n,g,f=a.type.toUpperCase();if(a.dataType===w){b=a.jsonpCallback||w+d.now();a.url=a.url+(a.url.indexOf("?")===-1?"?":"&")+(a.jsonp+"="+b);a.dataType=C;var o=j[b];j[b]=function(k){if(d.isFunction(o))o(k);else{j[b]=B;try{delete j[b]}catch(h){}}p([n,q],k,e,c,a)}}if(a.data&&f===x)a.url=a.url+(a.url.indexOf("?")===-1?"?":"&")+a.data;if(a.dataType===C){l(D,
a);f=d.getScript(a.url,b?null:function(){p([n,q],t,e,c,a)});l(E,a);return f}var r=false,c=a.xhr();l(D,a);c.open(f,a.url,a.async);try{if(a.data||a.contentType)c.setRequestHeader(F,a.contentType);c.setRequestHeader("Accept",a.dataType&&a.accepts[a.dataType]?a.accepts[a.dataType]+", */*; q=0.01":a.accepts._default)}catch(L){}c.onreadystatechange=function(k){if(!c||c.readyState===0||k==="abort"){r||p(q,null,s,c,a);r=true;if(c)c.onreadystatechange=G}else if(!r&&c&&(c.readyState===4||k===u)){r=true;c.onreadystatechange=
G;var h;if(k===u)h=u;else{a:{try{h=c.status>=200&&c.status<300||c.status===304||c.status===1223;break a}catch(M){}h=false}h=h?n:s}e=h;try{h=c;var v=a.dataType,y=t,H,m=h;if(!d.isString(m)){y=h.getResponseHeader(F)||t;m=(H=v==="xml"||!v&&y.indexOf("xml")>=0)?h.responseXML:h.responseText;if(H&&m.documentElement.nodeName===z)throw z;}if(d.isString(m))if(v===A||!v&&y.indexOf(A)>=0)m=d.JSON.parse(m);g=m}catch(N){e=z}p([e===n?n:s,q],g,e,c,a);if(k===u){c.abort();l(K,a)}if(a.async)c=null}};l(E,a);try{c.send(f===
I?a.data:null)}catch(O){p([s,q],g,s,c,a)}a.async||l(q,a);return c}}function p(a,b,e,g,f){if(d.isArray(a))d.each(a,function(o){p(o,b,e,g,f)});else{e===a&&f[a]&&f[a].call(f.context,b,e,g);l(a,f)}}function l(a,b){i.fire(a,{ajaxConfig:b})}var j=window,G=function(){},x="GET",I="POST",F="Content-Type",A="json",w=A+"p",C="script",t="",D="start",E="send",K="stop",n="success",q="complete",s="error",u="timeout",z="parsererror",J={type:x,url:t,contentType:"application/x-www-form-urlencoded",async:true,data:null,
xhr:j.ActiveXObject?function(){if(j.XmlHttpRequest)try{return new j.XMLHttpRequest}catch(a){}try{return new j.ActiveXObject("Microsoft.XMLHTTP")}catch(b){}}:function(){return new j.XMLHttpRequest},accepts:{xml:"application/xml, text/xml",html:"text/html",script:"text/javascript, application/javascript",json:"application/json, text/javascript",text:"text/plain",_default:"*/*"},jsonp:"callback"};d.mix(i,d.EventTarget);d.mix(i,{get:function(a,b,e,g,f){if(d.isFunction(b)){g=e;e=b}return i({type:f||x,
url:a,data:b,success:function(o,r,c){e&&e.call(this,o,r,c)},dataType:g})},post:function(a,b,e,g){if(d.isFunction(b)){g=e;e=b;b=B}return i.get(a,b,e,g,I)},jsonp:function(a,b,e){if(d.isFunction(b)){e=b;b=null}return i.get(a,b,e,w)}});i.getScript=d.getScript;d.io=d.ajax=i.ajax=i;d.jsonp=i.jsonp;d.IO=i});