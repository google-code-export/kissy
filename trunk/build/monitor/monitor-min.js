/*
Copyright (c) 2009, Kissy UI Library. All rights reserved.
MIT Licensed.
http://kissy.googlecode.com/

Date: 2009-09-16 22:52:30
Revision: 148
*/
(function(){var c="http://igw.monitor.taobao.com/monitor-gw/receive.do",e=1000,i=10000,a=navigator.userAgent,b=window.HUBBLE_st,h=window.HUBBLE_et||window.HUBBLE_dr,d=h;if(parseInt(Math.random()*i)){return}if(!b||!h){return}var f=function(o,n,p){if(window.attachEvent){o.attachEvent("on"+n,function(){p.call(o)})}else{o.addEventListener(n,p,false)}};var m=function(){var p=[["Windows NT 5.1","WinXP"],["Windows NT 6.0","WinVista"],["Windows NT 6.1","Win7"],["Windows NT 5.2","Win2003"],["Windows NT 5.0","Win2000"],["Macintosh","Macintosh"],["Windows","WinOther"],["Ubuntu","Ubuntu"],["Linux","Linux"]];for(var o=0,n=p.length;o<n;++o){if(a.indexOf(p[o][0])!=-1){return p[o][1]}}return"Other"};var l=function(){var p=["Opera","Chrome","Safari","MSIE 6","MSIE 7","MSIE 8","Firefox"];for(var o=0,n=p.length;o<n;++o){if(a.indexOf(p[o])!=-1){return p[o].replace(" ","")}}return"Other"};var j=function(){var n=window.screen;return n?n.width+"x"+n.height:""};var g=function(r){var q=typeof r==="string"?document.getElementById(r):r;if(!q){return}var o=q.getElementsByTagName("img");for(var p=0,n=o.length;p<n;++p){f(o[p],"load",function(){var s=+new Date;if(s>d){d=s}})}};var k=function(){var o=+new Date;try{new Image().src=[c,"?page_id=",e,"&os=",m(),"&bt=",l(),"&scr=",j(),"&fl=",(o-b),"&dl=",(h-b),"&sl=",(d-h)].join("")}catch(n){}};f(window,"load",k);window.Hubble={monitorSection:g}})();
