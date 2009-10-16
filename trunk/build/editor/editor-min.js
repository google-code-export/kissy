/*
Copyright (c) 2009, Kissy UI Library. All rights reserved.
MIT Licensed.
http://kissy.googlecode.com/

Date: 2009-10-16 18:01:13
Revision: 210
*/
var KISSY=window.KISSY||{};KISSY.Editor=function(a,b){var c=KISSY.Editor;if(!(this instanceof c)){return new c(a,b)}else{if(!c._isReady){c._setup()}return new c.Instance(a,b)}};(function(b){var a=YAHOO.lang;a.augmentObject(b,{version:"0.1",lang:{},mods:{},plugins:{},add:function(c,e,d){this.mods[c]={name:c,fn:e,details:d||{}};return this},addPlugin:function(f,j){var d=typeof f=="string"?[f]:f,e=this.plugins,h,g,c;for(g=0,c=d.length;g<c;++g){h=d[g];if(!e[h]){e[h]=a.merge(j,{name:h})}}},_isReady:false,_setup:function(){this._loadModules();this._isReady=true},_attached:{},_loadModules:function(){var f=this.mods,e=this._attached,d,c;for(d in f){c=f[d];if(!e[d]&&c){e[d]=c;if(c.fn){c.fn(this)}}}}})})(KISSY.Editor);KISSY.Editor.add("config",function(a){a.config={base:"",language:"en",theme:"default",toolbar:["source","","undo","redo","","fontName","fontSize","bold","italic","underline","strikeThrough","foreColor","backColor","","link","smiley","image","","insertOrderedList","insertUnorderedList","outdent","indent","justifyLeft","justifyCenter","justifyRight"],statusbar:["wordcount","resize"],pluginsConfig:{}}});KISSY.Editor.add("lang~en",function(a){a.lang.en={source:{text:"Source",title:"Source"},undo:{text:"Undo",title:"Undo (Ctrl+Z)"},redo:{text:"Redo",title:"Redo (Ctrl+Y)"},fontName:{text:"Font Name",title:"Font",options:{Default:"Arial",Arial:"Arial","Times New Roman":"Times New Roman","Arial Black":"Arial Black","Arial Narrow":"Arial Narrow","Comic Sans MS":"Comic Sans MS","Courier New":"Courier New",Garamond:"Garamond",Georgia:"Georgia",Tahoma:"Tahoma","Trebuchet MS":"Trebuchet MS",Verdana:"Verdana"}},fontSize:{text:"Font Size",title:"Font size",options:{Default:"2","8":"1","10":"2","12":"3","14":"4","18":"5","24":"6","36":"7"}},bold:{text:"Bold",title:"Bold (Ctrl+B)"},italic:{text:"Italic",title:"Italick (Ctrl+I)"},underline:{text:"Underline",title:"Underline (Ctrl+U)"},strikeThrough:{text:"Strikeout",title:"Strikeout"},link:{text:"Link",title:"Insert/Edit link",href:"URL:",target:"Open link in new window",remove:"Remove link"},blockquote:{text:"Blockquote",title:"Insert blockquote"},smiley:{text:"Smiley",title:"Insert smiley"},image:{text:"Image",title:"Insert image",tab_link:"Web Image",tab_local:"Local Image",tab_album:"Album Image",label_link:"Enter image web address:",label_local:"Browse your computer for the image file to upload:",label_album:"Select the image from your album:",uploading:"Uploading...",upload_error:"Exception occurs when uploading file.",ok:"Insert"},insertOrderedList:{text:"Numbered List",title:"Numbered List (Ctrl+7)"},insertUnorderedList:{text:"Bullet List",title:"Bullet List (Ctrl+8)"},outdent:{text:"Decrease Indent",title:"Decrease Indent"},indent:{text:"Increase Indent",title:"Increase Indent"},justifyLeft:{text:"Left Justify",title:"Left Justify (Ctrl+L)"},justifyCenter:{text:"Center Justify",title:"Center Justify (Ctrl+E)"},justifyRight:{text:"Right Justify",title:"Right Justify (Ctrl+R)"},foreColor:{text:"Text Color",title:"Text Color"},backColor:{text:"Text Background Color",title:"Text Background Color"},maximize:{text:"Maximize",title:"Maximize"},removeformat:{text:"Remove Format",title:"Remove Format"},wordcount:{tmpl:"Remain %remain% words (include html code)"},resize:{larger_text:"Larger",larger_title:"Enlarge the editor",smaller_text:"Smaller",smaller_title:"Shrink the editor"},common:{ok:"OK",cancel:"Cancel"}}});KISSY.Editor.add("lang~zh-cn",function(a){a.lang["zh-cn"]={source:{text:"\u6e90\u7801",title:"\u6e90\u7801"},undo:{text:"\u64a4\u9500",title:"\u64a4\u9500"},redo:{text:"\u91cd\u505a",title:"\u91cd\u505a"},fontName:{text:"\u5b57\u4f53",title:"\u5b57\u4f53",options:{Default:"\u5b8b\u4f53","\u5b8b\u4f53":"\u5b8b\u4f53","\u9ed1\u4f53":"\u9ed1\u4f53","\u96b6\u4e66":"\u96b6\u4e66","\u6977\u4f53":"\u6977\u4f53_GB2312","\u5fae\u8f6f\u96c5\u9ed1":"\u5fae\u8f6f\u96c5\u9ed1",Georgia:"Georgia","Times New Roman":"Times New Roman",Impact:"Impact","Courier New":"Courier New",Verdana:"Verdana"}},fontSize:{text:"\u5927\u5c0f",title:"\u5927\u5c0f",options:{Default:"2","8":"1","10":"2","12":"3","14":"4","18":"5","24":"6","36":"7"}},bold:{text:"\u7c97\u4f53",title:"\u7c97\u4f53"},italic:{text:"\u659c\u4f53",title:"\u659c\u4f53"},underline:{text:"\u4e0b\u5212\u7ebf",title:"\u4e0b\u5212\u7ebf"},strikeThrough:{text:"\u5220\u9664\u7ebf",title:"\u5220\u9664\u7ebf"},link:{text:"\u94fe\u63a5",title:"\u63d2\u5165/\u7f16\u8f91\u94fe\u63a5",href:"URL:",target:"\u5728\u65b0\u7a97\u53e3\u6253\u5f00\u94fe\u63a5",remove:"\u79fb\u9664\u94fe\u63a5"},blockquote:{text:"\u5f15\u7528",title:"\u5f15\u7528"},smiley:{text:"\u8868\u60c5",title:"\u63d2\u5165\u8868\u60c5"},image:{text:"\u56fe\u7247",title:"\u63d2\u5165\u56fe\u7247",tab_link:"\u7f51\u7edc\u56fe\u7247",tab_local:"\u672c\u5730\u4e0a\u4f20",tab_album:"\u6211\u7684\u76f8\u518c",label_link:"\u8bf7\u8f93\u5165\u56fe\u7247\u5730\u5740\uff1a",label_local:"\u8bf7\u9009\u62e9\u672c\u5730\u56fe\u7247\uff1a",label_album:"\u8bf7\u9009\u62e9\u76f8\u518c\u56fe\u7247\uff1a",uploading:"\u6b63\u5728\u4e0a\u4f20...",upload_error:"\u5bf9\u4e0d\u8d77\uff0c\u4e0a\u4f20\u6587\u4ef6\u65f6\u53d1\u751f\u4e86\u9519\u8bef\uff1a",ok:"\u63d2\u5165"},insertOrderedList:{text:"\u6709\u5e8f\u5217\u8868",title:"\u6709\u5e8f\u5217\u8868"},insertUnorderedList:{text:"\u65e0\u5e8f\u5217\u8868",title:"\u65e0\u5e8f\u5217\u8868"},outdent:{text:"\u51cf\u5c11\u7f29\u8fdb",title:"\u51cf\u5c11\u7f29\u8fdb"},indent:{text:"\u589e\u52a0\u7f29\u8fdb",title:"\u589e\u52a0\u7f29\u8fdb"},justifyLeft:{text:"\u5de6\u5bf9\u9f50",title:"\u5de6\u5bf9\u9f50"},justifyCenter:{text:"\u5c45\u4e2d\u5bf9\u9f50",title:"\u5c45\u4e2d\u5bf9\u9f50"},justifyRight:{text:"\u53f3\u5bf9\u9f50",title:"\u53f3\u5bf9\u9f50"},foreColor:{text:"\u6587\u672c\u989c\u8272",title:"\u6587\u672c\u989c\u8272"},backColor:{text:"\u80cc\u666f\u989c\u8272",title:"\u80cc\u666f\u989c\u8272"},maximize:{text:"\u5168\u5c4f\u7f16\u8f91",title:"\u5168\u5c4f\u7f16\u8f91"},removeformat:{text:"\u6e05\u9664\u683c\u5f0f",title:"\u6e05\u9664\u683c\u5f0f"},wordcount:{tmpl:"\u8fd8\u53ef\u4ee5\u8f93\u5165 %remain% \u5b57\uff08\u542b html \u4ee3\u7801\uff09"},resize:{larger_text:"\u589e\u5927",larger_title:"\u589e\u5927\u7f16\u8f91\u533a\u57df",smaller_text:"\u7f29\u5c0f",smaller_title:"\u7f29\u5c0f\u7f16\u8f91\u533a\u57df"},common:{ok:"\u786e\u5b9a",cancel:"\u53d6\u6d88"}}});KISSY.Editor.add("core~plugin",function(a){a.PLUGIN_TYPE={CUSTOM:0,TOOLBAR_SEPARATOR:1,TOOLBAR_BUTTON:2,TOOLBAR_MENU_BUTTON:4,TOOLBAR_SELECT:8,STATUSBAR_ITEM:16,FUNC:32}});KISSY.Editor.add("core~dom",function(b){var a=YAHOO.env.ua;b.Dom={getText:function(c){return c?(c.textContent||""):""},setItemUnselectable:function(g){var d,f,c,h,e;d=g.getElementsByTagName("*");for(f=-1,c=d.length;f<c;++f){e=(f==-1)?g:d[f];h=e.nodeName;if(h&&h!="INPUT"){e.setAttribute("unselectable","on")}}return g},BLOCK_ELEMENTS:{blockquote:1,div:1,h1:1,h2:1,h3:1,h4:1,h5:1,h6:1,hr:1,p:1,address:1,center:1,pre:1,form:1,fieldset:1,caption:1,table:1,tbody:1,tr:1,th:1,td:1,ul:1,ol:1,dl:1,dt:1,dd:1,li:1}};if(a.ie){b.Dom.getText=function(c){return c?(c.innerText||""):""}}});KISSY.Editor.add("core~color",function(d){var c="toString",a=parseInt,b=RegExp;d.Color={KEYWORDS:{black:"000",silver:"c0c0c0",gray:"808080",white:"fff",maroon:"800000",red:"f00",purple:"800080",fuchsia:"f0f",green:"008000",lime:"0f0",olive:"808000",yellow:"ff0",navy:"000080",blue:"00f",teal:"008080",aqua:"0ff"},re_RGB:/^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i,re_hex:/^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i,re_hex3:/([0-9A-F])/gi,toRGB:function(e){if(!this.re_RGB.test(e)){e=this.toHex(e)}if(this.re_hex.exec(e)){e="rgb("+[a(b.$1,16),a(b.$2,16),a(b.$3,16)].join(", ")+")"}return e},toHex:function(i){i=this.KEYWORDS[i]||i;if(this.re_RGB.exec(i)){var h=(b.$1>>0)[c](16),f=(b.$2>>0)[c](16),e=(b.$3>>0)[c](16);i=[h.length==1?"0"+h:h,f.length==1?"0"+f:f,e.length==1?"0"+e:e].join("")}if(i.length<6){i=i.replace(this.re_hex3,"$1$1")}if(i!=="transparent"&&i.indexOf("#")<0){i="#"+i}return i.toLowerCase()}}});KISSY.Editor.add("core~command",function(f){var d=YAHOO.env.ua,b={backColor:d.gecko?"hiliteColor":"backColor"},c="bold,italic,underline,strikeThrough",a="styleWithCSS",e="execCommand";f.Command={exec:function(i,h,j,g){h=b[h]||h;this._preExec(i,h,g);i[e](h,false,j)},_preExec:function(i,h,g){if(d.gecko){var j=typeof g==="undefined"?(c.indexOf(h)===-1):g;i[e](a,false,j)}}}});KISSY.Editor.add("core~range",function(b){var a=YAHOO.env.ua.ie;b.Range={getSelectionRange:function(f){var e=f.document,d,c;if(f.getSelection){d=f.getSelection();if(d.getRangeAt){c=d.getRangeAt(0)}else{c=e.createRange();c.setStart(d.anchorNode,d.anchorOffset);c.setEnd(d.focusNode,d.focusOffset)}}else{if(e.selection){c=e.selection.createRange()}}return c},getCommonAncestor:function(c){return c.startContainer||(c.parentElement&&c.parentElement())||(c.commonParentElement&&c.commonParentElement())},getSelectedText:function(c){if("text" in c){return c.text}return c.toString?c.toString():""},saveRange:function(c){a&&c.contentWin.focus();return c.getSelectionRange()}}});KISSY.Editor.add("core~instance",function(l){var b=YAHOO.util,e=b.Dom,j=b.Event,f=YAHOO.lang,g=YAHOO.env.ua,d=g.ie,c="ks-editor",h='<div class="ks-editor-toolbar"></div><div class="ks-editor-content"><iframe frameborder="0" allowtransparency="1"></iframe></div><div class="ks-editor-statusbar"></div>',a='<!DOCTYPE html><html><head><title>Rich Text Area</title><meta http-equiv="content-type" content="text/html; charset=gb18030" /><link type="text/css" href="{CONTENT_CSS}" rel="stylesheet" /></head><body spellcheck="false">{CONTENT}</body></html>',k="themes",i="content.css";l.Instance=function(m,n){this.textarea=e.get(m);this.config=f.merge(l.config,n||{});this.sourceMode=false;this.toolbar=new l.Toolbar(this);this.statusbar=new l.Statusbar(this);this._init()};f.augmentObject(l.Instance.prototype,{_init:function(){this._renderUI();this._initPlugins()},_renderUI:function(){this._renderContainer();this._setupContentPanel()},_initPlugins:function(){var n,o,q=l.plugins,m=[];for(n in q){m[n]=q[n]}this.plugins=m;this.toolbar.init();this.statusbar.init();for(n in m){o=m[n];if(o.inited){continue}o.editor=this;if(o.init){o.init()}o.inited=true}},_renderContainer:function(){var o=this.textarea,s=e.getRegion(o),q=(s.right-s.left-2)+"px",m=(s.bottom-s.top-2)+"px",n=document.createElement("div"),r,p;n.className=c;n.style.width=q;n.innerHTML=h;r=n.childNodes[1];r.style.width="100%";r.style.height=m;p=r.childNodes[0];p.style.width="100%";p.style.height="100%";p.setAttribute("frameBorder",0);o.style.display="none";e.insertBefore(n,o);this.container=n;this.toolbar.domEl=n.childNodes[0];this.contentWin=p.contentWindow;this.contentDoc=p.contentWindow.document;this.statusbar.domEl=n.childNodes[2]},_setupContentPanel:function(){var o=this.contentDoc,n=this.config,m=n.base+k+"/"+n.theme+"/"+i;o.open();o.write(a.replace("{CONTENT_CSS}",m).replace("{CONTENT}",this.textarea.value));o.close();if(d){o.body.contentEditable="true"}else{o.designMode="on"}if(f.trim(l.Dom.getText(o.body)).length===0){if(g.gecko){o.body.innerHTML='<p><br _moz_editor_bogus_node="TRUE" _moz_dirty=""/></p>'}else{o.body.innerHTML="<p></p>"}}if(d){j.on(o,"click",function(){if(o.activeElement.parentNode.nodeType===9){var p=o.selection.createRange();try{p.moveToElementText(o.body.lastChild)}catch(q){}p.collapse(false);p.select()}})}},execCommand:function(n,o,m){this.contentWin.focus();l.Command.exec(this.contentDoc,n,o,m)},getData:function(){if(this.sourceMode){return this.textarea.value}return this.getContentDocData()},getContentDocData:function(){var n=this.contentDoc.body,m="",o=l.plugins.save;if(l.Dom.getText(n)){m=n.innerHTML;if(o&&o.filterData){m=o.filterData(m)}}return m},getSelectionRange:function(){return l.Range.getSelectionRange(this.contentWin)}})});KISSY.Editor.add("core~toolbar",function(p){var b=YAHOO.util,i=b.Dom,n=b.Event,j=YAHOO.lang,f=YAHOO.env.ua.ie,g=f===6,l=p.PLUGIN_TYPE,h='<div class="ks-editor-stripbar-sep ks-inline-block"></div>',m='<div class="ks-editor-toolbar-button ks-inline-block" title="{TITLE}"><div class="ks-editor-toolbar-button-outer-box"><div class="ks-editor-toolbar-button-inner-box"><span class="ks-editor-toolbar-item ks-editor-toolbar-{NAME}">{TEXT}</span></div></div></div>',k='<div class="ks-editor-toolbar-menu-button-caption ks-inline-block"><span class="ks-editor-toolbar-item ks-editor-toolbar-{NAME}">{TEXT}</span></div><div class="ks-editor-toolbar-menu-button-dropdown ks-inline-block"></div>',e="ks-editor-toolbar-menu-button",d="ks-editor-toolbar-select",c="ks-editor-toolbar-button-active",o="ks-editor-toolbar-button-hover",a=document.createElement("div");p.Toolbar=function(q){this.editor=q;this.config=q.config;this.lang=p.lang[this.config.language]};j.augmentObject(p.Toolbar.prototype,{init:function(){var s=this.config.toolbar,r=this.editor.plugins,u;for(var t=0,q=s.length;t<q;++t){u=s[t];if(u){if(!(u in r)){continue}this._addItem(r[u])}else{this._addSeparator()}}},_addItem:function(t){var s,r=t.type,u=this.lang,q;if(!t.lang){t.lang=j.merge(u.common,this.lang[t.name]||{})}q=m.replace("{TITLE}",t.lang.title||"").replace("{NAME}",t.name).replace("{TEXT}",t.lang.text||"");if(g){q=q.replace("outer-box","outer-box ks-inline-block").replace("inner-box","inner-box ks-inline-block")}a.innerHTML=q;t.domEl=s=a.firstChild;if(r==l.TOOLBAR_MENU_BUTTON||r==l.TOOLBAR_SELECT){this._renderMenuButton(t);if(r==l.TOOLBAR_SELECT){this._renderSelect(t)}}this._bindItemUI(t);this._addToToolbar(s);t.editor=this.editor;if(t.init){t.init()}t.inited=true},_renderMenuButton:function(s){var r=s.domEl,q=r.getElementsByTagName("span")[0].parentNode;i.addClass(r,e);q.innerHTML=k.replace("{NAME}",s.name).replace("{TEXT}",s.lang.text||"")},_renderSelect:function(q){i.addClass(q.domEl,d)},_bindItemUI:function(r){var q=r.domEl;if(r.exec){n.on(q,"click",function(){r.exec()})}n.on(q,"mousedown",function(){i.addClass(q,c)});n.on(q,"mouseup",function(){i.removeClass(q,c)});n.on(q,"mouseout",function(u){var t=n.getRelatedTarget(u),s;try{if(q.contains){s=q.contains(t)}else{if(q.compareDocumentPosition){s=q.compareDocumentPosition(t)&8}}}catch(u){s=false}if(s){return}i.removeClass(q,c)});if(g){n.on(q,"mouseenter",function(){i.addClass(q,o)});n.on(q,"mouseleave",function(){i.removeClass(q,o)})}},_addSeparator:function(){a.innerHTML=h;this._addToToolbar(a.firstChild)},_addToToolbar:function(q){if(f){q=p.Dom.setItemUnselectable(q)}this.domEl.appendChild(q)}})});KISSY.Editor.add("core~statusbar",function(d){var e=YAHOO.util,c=YAHOO.lang,b=YAHOO.env.ua.ie,a='<div class="ks-editor-stripbar-sep kissy-inline-block"></div>',g='<div class="ks-editor-statusbar-item ks-editor-{NAME} ks-inline-block"></div>',f=document.createElement("div");d.Statusbar=function(h){this.editor=h;this.config=h.config;this.lang=d.lang[this.config.language]};c.augmentObject(d.Statusbar.prototype,{init:function(){var k=this.config.statusbar,j=this.editor.plugins,m;for(var l=0,h=k.length;l<h;++l){m=k[l];if(m){if(!(m in j)){continue}this._addItem(j[m])}else{this._addSep()}}},_addItem:function(i){var h,j=this.lang;if(!i.lang){i.lang=c.merge(j.common,this.lang[i.name]||{})}f.innerHTML=g.replace("{NAME}",i.name);i.domEl=h=f.firstChild;this._addToToolbar(h);i.editor=this.editor;if(i.init){i.init()}i.inited=true},_addSep:function(){f.innerHTML=a;this._addToToolbar(f.firstChild)},_addToToolbar:function(h){if(b){h=d.Dom.setItemUnselectable(h)}this.domEl.appendChild(h)}})});KISSY.Editor.add("core~menu",function(m){var d=YAHOO.util,h=d.Dom,l=d.Event,i=YAHOO.env.ua,f="display",j="none",e="",a="ks-editor-drop-menu",k="ks-editor-drop-menu-shadow",c="ks-editor-drop-menu-content",b=a+"-shim",g;m.Menu={generateDropMenu:function(p,o,r){var q=document.createElement("div"),n=this;q.innerHTML='<div class="'+k+'"></div><div class="'+c+'"></div>';q.className=a;q.style[f]=j;document.body.appendChild(q);l.on(o,"click",function(s){l.stopPropagation(s);n._hide(p.activeDropMenu);if(p.activeDropMenu!=q){n._setDropMenuPosition(o,q,r);n._show(q);p.activeDropMenu=q}else{p.activeDropMenu=null}});l.on([document,p.contentDoc],"click",function(){if(p.activeDropMenu){n._hide(p.activeDropMenu);p.activeDropMenu=null;p.contentWin.focus()}});this._initResizeEvent(o,q,r);return q.childNodes[1]},_setDropMenuPosition:function(n,p,t){var o=h.getRegion(n),s=o.left,q=o.bottom;if(t){s+=t[0];q+=t[1]}p.style.left=s+"px";p.style.top=q+"px"},_isVisible:function(n){if(!n){return false}return n.style[f]!=j},hideActiveDropMenu:function(n){this._hide(n.activeDropMenu);n.activeDropMenu=null},_hide:function(n){if(n){if(g){g.style[f]=j}n.style[f]=j}},_show:function(n){n.style[f]=e;if(n){if(i.ie===6){if(!g){this._initShim()}this._setShimRegion(n);g.style[f]=e}}},_initResizeEvent:function(p,q,r){var o=this,n;l.on(window,"resize",function(){if(n){clearTimeout(n)}n=setTimeout(function(){if(o._isVisible(q)){o._setDropMenuPosition(p,q,r)}},50)})},_initShim:function(){g=document.createElement("iframe");g.src="about:blank";g.className=b;g.style.position="absolute";g.style[f]=j;g.style.border=j;document.body.appendChild(g)},_setShimRegion:function(n){if(g){var o=h.getRegion(n);g.style.left=o.left+"px";g.style.top=o.top+"px";g.style.width=o.width+"px";g.style.height=o.height+"px"}}}});KISSY.Editor.add("smilies~config~default",function(a){a.Smilies=a.Smilies||{};a.Smilies["default"]={name:"default",mode:"icons",cols:5,fileNames:["smile","confused","cool","cry","eek","angry","wink","sweat","lol","stun","razz","shy","rolleyes","sad","happy","yes","no","heart","idea","rose"],fileExt:"gif"}});KISSY.Editor.add("smilies~config~wangwang",function(a){a.Smilies=a.Smilies||{};a.Smilies.wangwang={name:"wangwang",mode:"sprite",base:"http://a.tbcdn.cn/sys/wangwang/smiley/48x48/",spriteStyle:"background: url(http://a.tbcdn.cn/sys/wangwang/smiley/sprite.png) no-repeat -1px 0; width: 288px; height: 235px",unitStyle:"width: 24px; height: 24px",filePattern:{start:0,end:98,step:1},fileExt:"gif"}});KISSY.Editor.add("plugins~base",function(b){var c=b.PLUGIN_TYPE,a="bold,italic,underline,strikeThrough,insertOrderedList,insertUnorderedList";b.addPlugin(a.split(","),{type:c.TOOLBAR_BUTTON,exec:function(){this.editor.execCommand(this.name)}})});KISSY.Editor.add("plugins~blockquote",function(c){var d=YAHOO.util,b=d.Dom,f=c.PLUGIN_TYPE,a="blockquote",e=c.Dom.BLOCK_ELEMENTS;c.addPlugin("blockquote",{type:f.TOOLBAR_BUTTON,exec:function(){var j=this.editor,h=j.getSelectionRange(),i=c.Range.getCommonAncestor(h),k;if(!i){return}if(this.isQuotableElement(i)){k=i}else{k=this.getQuotableAncestor(i)}if(k){var g=k.parentNode.nodeName.toLowerCase()===a;j.execCommand(g?"outdent":"indent",null,false)}},getQuotableAncestor:function(h){var g=this;return b.getAncestorBy(h,function(i){return g.isQuotableElement(i)})},isQuotableElement:function(g){return e[g.nodeName.toLowerCase()]}})});KISSY.Editor.add("plugins~color",function(l){var b=YAHOO.util,h=b.Dom,k=b.Event,e=YAHOO.env.ua.ie,j=l.PLUGIN_TYPE,d='<div class="ks-editor-palette-table"><table><tbody>{TR}</tbody></table></div>',c='<td class="ks-editor-palette-cell"><div class="ks-editor-palette-colorswatch" title="{COLOR}" style="background-color:{COLOR}"></div></td>',i=["000","444","666","999","CCC","EEE","F3F3F3","FFF"],g=["F00","F90","FF0","0F0","0FF","00F","90F","F0F"],f=["F4CCCC","FCE5CD","FFF2CC","D9EAD3","D0E0E3","CFE2F3","D9D2E9","EAD1DC","EA9999","F9CB9C","FFE599","B6D7A8","A2C4C9","9FC5E8","B4A7D6","D5A6BD","E06666","F6B26B","FFD966","93C47D","76A5AF","6FA8DC","8E7CC3","C27BAD","CC0000","E69138","F1C232","6AA84F","45818E","3D85C6","674EA7","A64D79","990000","B45F06","BF9000","38761D","134F5C","0B5394","351C75","741B47","660000","783F04","7F6000","274E13","0C343D","073763","20124D","4C1130"],a="ks-editor-palette-cell-selected";l.addPlugin(["foreColor","backColor"],{type:j.TOOLBAR_MENU_BUTTON,color:"",_indicator:null,dropMenu:null,range:null,init:function(){var n=this.domEl,m=n.getElementsByTagName("span")[0].parentNode;this.color=(this.name=="foreColor")?"#000000":"#ffffff";h.addClass(n,"ks-editor-toolbar-color-button");m.innerHTML='<div class="ks-editor-toolbar-color-button-indicator" style="border-bottom-color:'+this.color+'">'+m.innerHTML+"</div>";this._indicator=m.firstChild;this._renderUI();this._bindUI()},_renderUI:function(){this.dropMenu=l.Menu.generateDropMenu(this.editor,this.domEl,[1,0]);this._generatePalettes();if(e){l.Dom.setItemUnselectable(this.dropMenu)}this._updateSelectedColor(this.color)},_bindUI:function(){this._bindPickEvent();if(e){var m=this;k.on(this.domEl,"click",function(){m.range=m.editor.getSelectionRange();m.editor.contentDoc.selection.empty()})}},_generatePalettes:function(){var m="";m+=this._getPaletteTable(i);m+=this._getPaletteTable(g);m+=this._getPaletteTable(f);this.dropMenu.innerHTML=m},_getPaletteTable:function(o){var q,n=o.length,p,m="<tr>";for(q=0,n=o.length;q<n;++q){if(q!=0&&q%8==0){m+="</tr><tr>"}p=l.Color.toRGB("#"+o[q]).toUpperCase();m+=c.replace(/{COLOR}/g,p)}m+="</tr>";return d.replace("{TR}",m)},_bindPickEvent:function(){var m=this;k.on(this.dropMenu,"click",function(o){var p=k.getTarget(o),n=p.getAttribute("title");if(n&&n.indexOf("RGB")===0){m._doAction(n)}})},_doAction:function(n){if(!n){return}this.setColor(l.Color.toHex(n));var m=this.range;if(e&&m.select){m.select()}this.editor.execCommand(this.name,this.color)},setColor:function(m){this.color=m;this._indicator.style.borderBottomColor=m;this._updateSelectedColor(m)},_updateSelectedColor:function(q){var o,m,p,n=this.dropMenu.getElementsByTagName("div");for(o=0,m=n.length;o<m;++o){p=n[o];if(l.Color.toHex(p.style.backgroundColor)==q){h.addClass(p.parentNode,a)}else{h.removeClass(p.parentNode,a)}}}})});KISSY.Editor.add("plugins~font",function(k){var a=YAHOO.util,b=a.Dom,j=a.Event,g=YAHOO.env.ua,f=k.PLUGIN_TYPE,e="ks-editor-option-hover",h='<ul class="ks-editor-select-list">{LI}</ul>',d='<li class="ks-editor-option" data-value="{VALUE}"><span class="ks-editor-option-checkbox"></span><span style="{STYLE}">{KEY}</span></li>',i="ks-editor-option-selected",c="Default";k.addPlugin(["fontName","fontSize"],{type:f.TOOLBAR_SELECT,selectedValue:"",selectHead:null,selectList:null,options:[],range:null,init:function(){this.options=this.lang.options;this.selectHead=this.domEl.getElementsByTagName("span")[0];this._renderUI();this._bindUI()},_renderUI:function(){this.selectList=k.Menu.generateDropMenu(this.editor,this.domEl,[1,0]);this._renderSelectList();this._setSelectedOption(this.options[c])},_bindUI:function(){this._bindPickEvent();if(g.ie){var l=this;j.on(this.domEl,"click",function(){l.range=l.editor.getSelectionRange();l.editor.contentDoc.selection.empty()})}},_renderSelectList:function(){var n="",l=this.options,m,o;for(m in l){if(m==c){continue}o=l[m];n+=d.replace("{VALUE}",o).replace("{STYLE}",this._getOptionStyle(m,o)).replace("{KEY}",m)}this.selectList.innerHTML=h.replace("{LI}",n);b.addClass(this.selectList,"ks-editor-drop-menu-"+this.name)},_bindPickEvent:function(){var l=this;j.on(this.selectList,"click",function(n){var o=j.getTarget(n);if(o.nodeName!="LI"){o=b.getAncestorByTagName(o,"li")}if(!o){return}l._doAction(o.getAttribute("data-value"))});if(g.ie===6){var m=this.selectList.getElementsByTagName("li");j.on(m,"mouseenter",function(){b.addClass(this,e)});j.on(m,"mouseleave",function(){b.removeClass(this,e)})}},_doAction:function(m){if(!m){return}this._setSelectedOption(m);var l=this.range;if(g.ie&&l.select){l.select()}this.editor.execCommand(this.name,this.selectedValue)},_setSelectedOption:function(l){this.selectedValue=l;this.selectHead.innerHTML=this._getOptionKey(l);this._updateSelectedOption(l)},_getOptionStyle:function(l,m){if(this.name=="fontName"){return"font-family:"+m}else{return"font-size:"+l+"px"}},_getOptionKey:function(n){var l=this.options,m;for(m in l){if(m==c){continue}if(l[m]==n){return m}}},_updateSelectedOption:function(p){var m=this.selectList.getElementsByTagName("li"),n,l=m.length,o;for(n=0;n<l;++n){o=m[n];if(o.getAttribute("data-value")==p){b.addClass(o,i)}else{b.removeClass(o,i)}}}})});KISSY.Editor.add("plugins~image",function(j){var c=YAHOO.util,b=c.Dom,u=c.Event,l=c.Connect,f=YAHOO.lang,k=YAHOO.env.ua,m=k.ie,h=j.PLUGIN_TYPE,d="ks-editor-image",r="ks-editor-btn-ok",e="ks-editor-btn-cancel",g="ks-editor-image-tabs",p="ks-editor-image-tab-content",n="ks-editor-image-uploading",a="ks-editor-dialog-actions",o="ks-editor-image-no-tab",t="ks-editor-image-tab-selected",s={local:'<li rel="local" class="'+t+'">{tab_local}</li>',link:'<li rel="link">{tab_link}</li>',album:'<li rel="album">{tab_album}</li>'},q=['<form action="javascript: void(0)">','<ul class="',g,' ks-clearfix">',"</ul>",'<div class="',p,'" rel="local" style="display: none">',"<label>{label_local}</label>",'<input type="file" size="40" name="imgFile" unselectable="on" />',"{local_extraCode}","</div>",'<div class="',p,'" rel="link">',"<label>{label_link}</label>",'<input name="imgUrl" size="50" />',"</div>",'<div class="',p,'" rel="album" style="display: none">',"<label>{label_album}</label>",'<p style="width: 300px">\u5c1a\u672a\u5b9e\u73b0...</p>',"</div>",'<div class="',n,'" style="display: none">','<p style="width: 300px">{uploading}</p>',"</div>",'<div class="',a,'">','<button name="ok" class="',r,'">{ok}</button>','<span class="',e,'">{cancel}</span>',"</div>","</form>"].join(""),i={tabs:["link"],upload:{actionUrl:"",filter:"*",filterMsg:"",enableXdr:false,connectionSwf:"http://a.tbcdn.cn/yui/2.8.0r4/build/connection/connection.swf",formatResponse:function(v){return v},extraCode:""}};j.addPlugin("image",{type:h.TOOLBAR_BUTTON,config:{},dialog:null,form:null,range:null,currentTab:null,currentPanel:null,uploadingPanel:null,actionsBar:null,init:function(){var v=this.editor.config.pluginsConfig[this.name]||{};this.config=f.merge(i,v);this.config.upload=f.merge(i.upload,v.upload||{});this._renderUI();this._bindUI();this.actionsBar=b.getElementsByClassName(a,"div",this.dialog)[0];this.uploadingPanel=b.getElementsByClassName(n,"div",this.dialog)[0];this.config.upload.enableXdr&&this._initXdrUpload()},_renderUI:function(){var v=j.Menu.generateDropMenu(this.editor,this.domEl,[1,0]),w=this.lang;w.local_extraCode=this.config.upload.extraCode;v.className+=" "+d;v.innerHTML=q.replace(/\{([^}]+)\}/g,function(x,y){return w[y]?w[y]:y});this.dialog=v;this.form=v.getElementsByTagName("form")[0];if(m){j.Dom.setItemUnselectable(v)}this._renderTabs()},_renderTabs:function(){var v=this.lang,F=this,B=b.getElementsByClassName(g,"ul",this.dialog)[0],C=b.getElementsByClassName(p,"div",this.dialog);var E=this.config.tabs,z="";for(var x=0,w=E.length;x<w;x++){z+=s[E[x]]}B.innerHTML=z.replace(/\{([^}]+)\}/g,function(G,H){return v[H]?v[H]:H});var D=B.childNodes,A=C.length;if(D.length===1){b.addClass(this.dialog,o)}y(D[0]);u.on(D,"click",function(){y(this)});function y(I){var H=0,G=I.getAttribute("rel");for(var J=0;J<A;J++){if(D[J]){b.removeClass(D[J],t)}C[J].style.display="none";if(C[J].getAttribute("rel")==G){H=J}}b.addClass(I,t);C[H].style.display="";F.currentTab=I.getAttribute("rel");F.currentPanel=C[H]}},_bindUI:function(){var v=this;u.on(this.domEl,"click",function(){if(v.dialog.style.visibility===m?"hidden":"visible"){v._syncUI()}});u.on(this.dialog,"click",function(w){var x=u.getTarget(w),y=v.currentTab;switch(x.className){case r:if(y==="local"){u.stopPropagation(w);v._insertLocalImage()}else{v._insertWebImage()}break;case e:break;default:u.stopPropagation(w)}})},_initXdrUpload:function(){var x=this.config.tabs;for(var w=0,v=x.length;w<v;w++){if(x[w]==="local"){l.transport(this.config.upload.connectionSwf);break}}},_insertLocalImage:function(){var A=this.form,w=this.config.upload,y=A.imgFile.value,z=w.actionUrl,v=this,x;if(y&&z){if(w.filter!=="*"){x=y.substring(y.lastIndexOf(".")+1).toLowerCase();if(w.filter.indexOf(x)==-1){alert(w.filterMsg);v.form.reset();return}}this.uploadingPanel.style.display="";this.currentPanel.style.display="none";this.actionsBar.style.display="none";l.setForm(A,true);l.asyncRequest("post",z,{upload:function(D){try{var C=w.formatResponse(f.JSON.parse(D.responseText));if(C[0]=="0"){v._insertImage(C[1]);v._hideDialog()}else{v._onUploadError(C[1])}}catch(B){v._onUploadError(f.dump(B)+"\no = "+f.dump(D)+"\n[from upload catch code]")}},xdr:w.enableXdr})}else{v._hideDialog()}},_onUploadError:function(v){alert(this.lang.upload_error+"\n\n"+v);this._hideDialog()},_insertWebImage:function(){var v=this.form.imgUrl.value;v&&this._insertImage(v)},_hideDialog:function(){var v=this.editor.activeDropMenu;if(v&&b.isAncestor(v,this.dialog)){j.Menu.hideActiveDropMenu(this.editor)}this.editor.contentWin.focus()},_syncUI:function(){this.range=j.Range.saveRange(this.editor);this.form.reset();this.uploadingPanel.style.display="none";this.currentPanel.style.display="";this.actionsBar.style.display=""},_insertImage:function(x,A){x=f.trim(x);if(x.length===0){return}var z=this.editor,w=this.range;if(window.getSelection){var v=z.contentDoc.createElement("img");v.src=x;v.setAttribute("alt",A);w.deleteContents();w.insertNode(v);if(k.webkit){var y=z.contentWin.getSelection();y.addRange(w);y.collapseToEnd()}else{w.setStartAfter(v)}z.contentWin.focus()}else{if(document.selection){z.contentWin.focus();if("text" in w){w.select();w.pasteHTML('<img src="'+x+'" alt="'+A+'" />')}else{w.execCommand("insertImage",false,x)}}}}})});KISSY.Editor.add("plugins~indent",function(j){var a=YAHOO.util,d=a.Dom,f=YAHOO.lang,g=j.PLUGIN_TYPE,h=YAHOO.env.ua,b=f.merge(j.Dom.BLOCK_ELEMENTS,{li:0}),i="40",c="px",e={type:g.TOOLBAR_BUTTON,exec:function(){this.editor.execCommand(this.name)}};if(h.ie){e.exec=function(){var m=this.editor.getSelectionRange(),n,p;if(m.parentElement){n=m.parentElement()}else{if(m.item){n=m.item(0)}else{return}}if(n===this.editor.contentDoc.body){this.editor.execCommand(this.name);return}if(l(n)){p=n}else{p=k(n)}if(p){var o=parseInt(p.style.marginLeft)>>0;o+=(this.name==="indent"?+1:-1)*i;p.style.marginLeft=o+c}function k(q){return d.getAncestorBy(q,function(r){return l(r)})}function l(q){return b[q.nodeName.toLowerCase()]}}}j.addPlugin(["indent","outdent"],e)});KISSY.Editor.add("plugins~justify",function(b){var c=b.PLUGIN_TYPE,a={type:c.TOOLBAR_BUTTON,exec:function(){this.editor.execCommand(this.name)}};b.addPlugin(["justifyLeft","justifyCenter","justifyRight"],a)});KISSY.Editor.add("plugins~link",function(q){var a=YAHOO.util,h=a.Dom,p=a.Event,j=YAHOO.lang,b=YAHOO.env.ua.ie,l=q.PLUGIN_TYPE,d=q.Range,g=new Date().getTime(),k=/^\w+:\/\/.*|#.*$/,o="ks-editor-link",m="ks-editor-link-newlink-mode",e="ks-editor-btn-ok",c="ks-editor-btn-cancel",i="ks-editor-link-remove",f="http://",n=['<form onsubmit="return false"><ul>','<li class="ks-editor-link-href"><label>{href}</label><input name="href" size="40" value="http://" type="text" /></li>','<li class="ks-editor-link-target"><input name="target" id="target_"',g,' type="checkbox" /> <label for="target_"',g,">{target}</label></li>",'<li class="ks-editor-dialog-actions">','<button name="ok" class="',e,'">{ok}</button>','<span class="',c,'">{cancel}</span>','<span class="',i,'">{remove}</span>',"</li>","</ul></form>"].join("");q.addPlugin("link",{type:l.TOOLBAR_BUTTON,dialog:null,form:null,range:null,init:function(){this._renderUI();this._bindUI()},_renderUI:function(){var r=q.Menu.generateDropMenu(this.editor,this.domEl,[1,0]),s=this.lang;r.className+=" "+o;r.innerHTML=n.replace(/\{([^}]+)\}/g,function(t,u){return s[u]?s[u]:u});this.dialog=r;this.form=r.getElementsByTagName("form")[0];b&&q.Dom.setItemUnselectable(r)},_bindUI:function(){var s=this.form,r=this;p.on(this.domEl,"click",function(){if(r.dialog.style.visibility===b?"hidden":"visible"){r._syncUI()}});p.on(this.dialog,"click",function(t){var u=p.getTarget(t);switch(u.className){case e:r._createLink(s.href.value,s.target.checked);break;case c:break;case i:r._unLink();break;default:p.stopPropagation(t)}})},_syncUI:function(){this.range=q.Range.saveRange(this.editor);var u=this.form,s=d.getCommonAncestor(this.range),w=s.nodeName==="A",t=s.parentNode,v=t&&(t.nodeName==="A"),r;if(w||v){r=w?s:t;u.href.value=r.href;u.target.checked=r.target==="_blank";h.removeClass(u,m);return}u.href.value=f;u.target.checked=false;h.addClass(u,m)},_createLink:function(s,x){s=this._getValidHref(s);if(s.length===0){this._unLink();return}var u=this.range,t=d.getCommonAncestor(u),y=t.nodeName==="A",v=t.parentNode,A=v&&(v.nodeName==="A"),z,r=document.createElement("div"),w;if(y||A){z=y?t:v;z.href=s;if(x){z.setAttribute("target","_blank")}else{z.removeAttribute("target")}return}z=document.createElement("a");z.href=s;if(x){z.setAttribute("target","_blank")}if(b){if("text" in u){if(u.select){u.select()}z.innerHTML=u.htmlText||s;r.innerHTML="";r.appendChild(z);u.pasteHTML(r.innerHTML)}else{this.editor.execCommand("createLink",s)}}else{if(u.collapsed){z.innerHTML=s}else{w=u.cloneContents();while(w.firstChild){z.appendChild(w.firstChild)}}u.deleteContents();u.insertNode(z);u.selectNode(z)}},_getValidHref:function(r){r=j.trim(r);if(r&&!k.test(r)){r=f+r}return r},_unLink:function(){var u=this.editor,s=this.range,v=d.getSelectedText(s),r=d.getCommonAncestor(s),t;if(!v&&r.nodeType==3){t=r.parentNode;if(t.nodeName=="A"){t.parentNode.replaceChild(r,t)}}else{if(s.select){s.select()}u.execCommand("unLink",null)}}})});KISSY.Editor.add("plugins~maximize",function(d){var e=YAHOO.util,c=e.Dom,a=e.Event,f=d.PLUGIN_TYPE,b="kissy-editor-maximize-mode";d.addPlugin("maximize",{type:f.TOOLBAR_BUTTON,container:null,containerParentNode:null,init:function(){this.container=this.editor.container;this.containerParentNode=this.container.parentNode},exec:function(){var g=this.container;if(c.hasClass(g,b)){this.containerParentNode.appendChild(g);c.removeClass(g,b)}else{document.body.appendChild(g);c.addClass(g,b)}}})});KISSY.Editor.add("plugins~removeformat",function(d){var f=YAHOO.util,a=f.Dom,e=d.Range,g=d.PLUGIN_TYPE,c=/^(b|big|code|del|dfn|em|font|i|ins|kbd|q|samp|small|span|strike|strong|sub|sup|tt|u|var)$/g,b=["class","style","lang","width","height","align","hspace","valign"];d.addPlugin("removeformat",{type:g.TOOLBAR_BUTTON,exec:function(){var j=this.editor,h=j.getSelectionRange(),i=d.Range.getCommonAncestor(h);if(!i){return}alert("\u6b63\u5728\u5b9e\u73b0\u4e2d")}})});KISSY.Editor.add("plugins~resize",function(d){var e=YAHOO.util,a=e.Event,b=YAHOO.env.ua,f=d.PLUGIN_TYPE,c='<span class="ks-editor-resize-larger" title="{larger_title}">{larger_text}</span><span class="ks-editor-resize-smaller" title="{smaller_title}">{smaller_text}</span>';d.addPlugin("resize",{type:f.STATUSBAR_ITEM,contentEl:null,currentHeight:0,init:function(){this.contentEl=this.editor.container.childNodes[1];this.currentHeight=parseInt(this.contentEl.style.height);this.renderUI();this.bindUI()},renderUI:function(){var g=this.lang;this.domEl.innerHTML=c.replace(/\{([^}]+)\}/g,function(h,i){return g[i]?g[i]:i})},bindUI:function(){var h=this.domEl.getElementsByTagName("span"),j=h[0],g=h[1],i=this.contentEl;a.on(j,"click",function(){this.currentHeight+=100;this._doResize()},this,true);a.on(g,"click",function(){if(this.currentHeight<100){this.currentHeight=0}else{this.currentHeight-=100}this._doResize()},this,true)},_doResize:function(){this.contentEl.style.height=this.currentHeight+"px";this.editor.textarea.style.height=this.currentHeight+"px"}})});KISSY.Editor.add("plugins~save",function(c){var d=YAHOO.util,b=d.Event,e=c.PLUGIN_TYPE,a={b:{tag:"strong"},i:{tag:"em"},u:{tag:"span",style:"text-decoration:underline"},strike:{tag:"span",style:"text-decoration:line-through"}};c.addPlugin("save",{type:e.FUNC,init:function(){var g=this.editor,f=g.textarea,h=f.form;if(h){b.on(h,"submit",function(){if(!g.sourceMode){f.value=g.getData()}})}},filterData:function(f){f=f.replace(/<(\/?)([^>\s]+)([^>]*)>/g,function(i,k,h,g){h=h.toLowerCase();var l=a[h],j=h;if(l&&!g){j=l.tag;if(!k&&l.style){j+=' style="'+l.style+'"'}}return"<"+k+j+g+">"});return f}})});KISSY.Editor.add("plugins~smiley",function(j){var a=YAHOO.util,h=a.Event,c=YAHOO.lang,e=YAHOO.env.ua,d=j.PLUGIN_TYPE,g="ks-editor-smiley-dialog",f="ks-editor-smiley-icons",i="ks-editor-smiley-sprite",b={tabs:["default"]};j.addPlugin("smiley",{type:d.TOOLBAR_BUTTON,config:{},dialog:null,range:null,init:function(){this.config=c.merge(b,this.editor.config.pluginsConfig[this.name]||{});this._renderUI();this._bindUI()},_renderUI:function(){var k=j.Menu.generateDropMenu(this.editor,this.domEl,[1,0]);k.className+=" "+g;this.dialog=k;this._renderDialog();if(e.ie){j.Dom.setItemUnselectable(k)}},_renderDialog:function(){var l=j.Smilies[this.config.tabs[0]],k=l.mode;if(k==="icons"){this._renderIcons(l)}else{if(k==="sprite"){this._renderSprite(l)}}},_renderIcons:function(m){var l=this.editor.config.base+"smilies/"+m.name+"/",n=m.fileNames,s="."+m.fileExt,r=m.cols,q=[],o,p=n.length,k;q.push('<div class="'+f+'">');for(o=0;o<p;o++){k=n[o];q.push('<img src="'+l+k+s+'" alt="'+k+'" title="'+k+'" />');if(o%r===r-1){q.push("<br />")}}q.push("</div");this.dialog.innerHTML=q.join("")},_renderSprite:function(m){var q=m.base,r=m.filePattern,l="."+m.fileExt,k=r.end+1,p=r.step,n,o=[];o.push('<div class="'+i+' ks-clearfix" style="'+m.spriteStyle+'">');for(n=0;n<k;n+=p){o.push('<span data-icon="'+q+n+l+'" style="'+m.unitStyle+'"></span>')}o.push("</div");this.dialog.innerHTML=o.join("")},_bindUI:function(){var k=this;h.on(this.domEl,"click",function(){k.range=j.Range.saveRange(k.editor)});h.on(this.dialog,"click",function(l){var m=h.getTarget(l);switch(m.nodeName){case"IMG":k._insertImage(m.src,m.getAttribute("alt"));break;case"SPAN":k._insertImage(m.getAttribute("data-icon"),"");break;default:h.stopPropagation(l)}})},_insertImage:function(m,p){m=c.trim(m);if(m.length===0){return}var o=this.editor,l=this.range;if(window.getSelection){var k=o.contentDoc.createElement("img");k.src=m;k.setAttribute("alt",p);l.deleteContents();l.insertNode(k);if(e.webkit){var n=o.contentWin.getSelection();n.addRange(l);n.collapseToEnd()}else{l.setStartAfter(k)}o.contentWin.focus()}else{if(document.selection){if("text" in l){l.pasteHTML('<img src="'+m+'" alt="'+p+'" />')}else{o.execCommand("insertImage",m)}}}}})});KISSY.Editor.add("plugins~source",function(a){var b=a.PLUGIN_TYPE;a.addPlugin("source",{type:b.TOOLBAR_BUTTON,init:function(){var c=this.editor;this.iframe=c.contentWin.frameElement;this.textarea=c.textarea;this.iframe.parentNode.appendChild(c.textarea)},exec:function(){var c=this.editor,d=c.sourceMode;if(d){c.contentDoc.body.innerHTML=this.textarea.value}else{this.textarea.value=c.getContentDocData()}this.textarea.style.display=d?"none":"";this.iframe.style.display=d?"":"none";c.sourceMode=!d}})});KISSY.Editor.add("plugins~undo",function(a){var b=a.PLUGIN_TYPE;a.addPlugin(["undo","redo"],{type:b.TOOLBAR_BUTTON,exec:function(){this.editor.execCommand(this.name)}})});KISSY.Editor.add("plugins~wordcount",function(f){var g=YAHOO.util,c=g.Dom,b=g.Event,e=YAHOO.lang,h=f.PLUGIN_TYPE,d="ks-editor-wordcount-alarm",a={total:50000,threshold:100};f.addPlugin("wordcount",{type:h.STATUSBAR_ITEM,total:Infinity,remain:Infinity,threshold:0,remainEl:null,init:function(){var j=e.merge(a,this.editor.config.pluginsConfig[this.name]||{});this.total=j.total;this.threshold=j.threshold;this.renderUI();this.bindUI();var i=this;setTimeout(function(){i.syncUI()},50)},renderUI:function(){this.domEl.innerHTML=this.lang.tmpl.replace("%remain%","<em>"+this.total+"</em>");this.remainEl=this.domEl.getElementsByTagName("em")[0]},bindUI:function(){var i=this.editor;b.on(i.textarea,"keyup",this.syncUI,this,true);b.on(i.contentDoc,"keyup",this.syncUI,this,true);b.on(i.container,"click",this.syncUI,this,true)},syncUI:function(){this.remain=this.total-this.editor.getData().length;this.remainEl.innerHTML=this.remain;if(this.remain<=this.threshold){c.addClass(this.domEl,d)}else{c.removeClass(this.domEl,d)}}})});
