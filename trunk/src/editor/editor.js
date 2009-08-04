/**
 * KISSY.Editor ���ı��༭��
 * editor.js
 * requires: yahoo-dom-event
 * @author lifesinger@gmail.com
 */

var KISSY = window.KISSY || {};

/**
 * @class Editor
 * @requires YAHOO.util.Dom
 * @requires YAHOO.util.Event
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

                if (!attached[name] && m) {
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
        language: "en",

        /**
         * ����
         */
        theme: "default",

        /**
         * Toolbar �Ϲ��ܲ��
         */
        toolbar: [
            "undo", "redo",
            "fontName", "fontSize", "bold", "italic", "underline", "strikeThrough", "foreColor", "backColor",
            "",
            "link",
            "",
            "insertOrderedList", "insertUnorderedList", "outdent", "indent", "justifyLeft", "justifyCenter", "justifyRight"
        ]
    };

});

KISSY.Editor.add("lang~en", function(E) {

    E.lang["en"] = {

        // Toolbar buttons
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
          title           : "Font",
          options         : {
              "Default"         : "Arial",
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
          text            : "Font Size",  
          title           : "Font size",
          options         : {
              "Default"         : "10pt",
              "8"               : "8pt",
              "10"              : "10pt",
              "12"              : "12pt",
              "14"              : "14pt",
              "18"              : "18pt",
              "24"              : "24pt",
              "36"              : "36pt"
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
            title         : "Add or remove link (Ctrl+K)",
            dialogMessage : "Enter the URL"
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

        // Common messages and labels
        common: {
            ok            : "OK",
            cancel        : "Cancel"
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
        TOOLBAR_SELECT: 8
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
        }
    };

});

KISSY.Editor.add("core~command", function(E) {

    var ua = YAHOO.env.ua,

        CUSTOM_COMMANDS = {
            backColor: ua.gecko ? "hiliteColor" : "backColor"
        },
        BASIC_COMMANDS = "bold,italic,underline,strike,strikeThrough",
        STYLE_WITH_CSS = "styleWithCSS",
        EXEC_COMMAND = "execCommand";
    
    E.Command = {

        /**
         * ִ�� doc.execCommand
         */
        exec: function(doc, cmdName, val) {
            cmdName = CUSTOM_COMMANDS[cmdName] || cmdName;

            this._preExec(doc, cmdName);
            doc[EXEC_COMMAND](cmdName, false, val);
        },

        _preExec: function(doc, cmdName) {

            // �ر� gecko ������� styleWithCSS ���ԣ�ʹ�ò��������ݺ� ie һ��
            if (ua.gecko) {
                var val = BASIC_COMMANDS.indexOf(cmdName) == -1;
                doc[EXEC_COMMAND](STYLE_WITH_CSS, false, val);
            }
        }
    };

});
KISSY.Editor.add("core~range", function(E) {

    E.Range = {

        /**
         * ��ȡѡ���������
         */
        getSelectionRange: function(win) {
            var doc = win.document,
                selection, range;

            if (win.getSelection) { // W3C
                selection = win.getSelection();

                if (selection.getRangeAt)
                    range = selection.getRangeAt(0);

                else { // Safari! TODO: ������
                    range = doc.createRange();
                    range.setStart(selection.anchorNode, selection.anchorOffset);
                    range.setEnd(selection.focusNode, selection.focusOffset);
                }

            } else if (doc.selection) { // IE
                range = doc.selection.createRange();
            }

            return range;
        }
    };

});

KISSY.Editor.add("core~instance", function(E) {

    var Y = YAHOO.util, Dom = Y.Dom, Lang = YAHOO.lang,
        EDITOR_CLASSNAME = "kissy-editor",

        EDITOR_TMPL  =  '<div class="kissy-editor-toolbar"></div>' +
                        '<iframe frameborder="0"></iframe>' +
                        '<div class="kissy-editor-statusbar"></div>',

        CONTENT_TMPL =  '<!DOCTYPE html>' +
                        '<html>' +
                        '<head>' +
                        '<title>Rich Text Area</title>' +
                        '<meta http-equiv="Content-Type" content="text/html; charset=GBK18030" />' +
                        '<link type="text/css" href="{CONTENT_CSS}" rel="stylesheet" />' +
                        '</head>' +
                        '<body>{CONTENT}</body>' +
                        '</html>',

        THEMES_DIR = "themes",
        //EDITOR_CSS = "editor.css", TODO: ��̬���� editor.css
        CONTENT_CSS =  "content.css";

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
         * @property toolbar
         * @property contentWin
         * @property contentDoc
         * @property statusbar
         */

        // init
        this._init();
    };

    E.Instance.prototype = {
        /**
         * ��ʼ������
         */
        _init: function() {
            this._renderUI();
            this._initPlugins();
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
                plugins = E.plugins;

            // �������ϵĲ��
            E.Toolbar.init(this);

            // �������
            for(key in plugins) {
                p = plugins[key];
                if(p.inited) continue;

                if(p.init) {
                    p.init(this);
                }
                p.inited = true;
            }
        },

        /**
         * ���� DOM �ṹ
         */
        _renderContainer: function() {
            var textarea = this.textarea,
                region = Dom.getRegion(textarea),
                width = (region.right - region.left) + "px",
                height = (region.bottom - region.top) + "px",
                container = document.createElement("div"),
                iframe;

            container.className = EDITOR_CLASSNAME;
            container.style.width = width;
            container.innerHTML = EDITOR_TMPL;

            iframe = container.childNodes[1];
            iframe.style.width = width;
            iframe.style.height = height;
            iframe.setAttribute("frameBorder", 0);

            textarea.style.display = "none";
            Dom.insertBefore(container, textarea);

            this.container = container;
            this.toolbar = container.childNodes[0];
            this.contentWin = iframe.contentWindow;
            this.contentDoc = iframe.contentWindow.document;
            this.statusbar = container.childNodes[2];

            // TODO Ŀǰ�Ǹ��� textatea �Ŀ�����趨 editor �Ŀ�ȡ����Կ��� config ��ָ�����
        },

        _setupContentPanel: function() {
            var doc = this.contentDoc,
                config = this.config,
                contentCSSUrl = config.base + THEMES_DIR + "/" + config.theme + "/" + CONTENT_CSS;

            // ��ʼ�� iframe ������
            doc.open();
            doc.write(CONTENT_TMPL
                    .replace("{CONTENT_CSS}", contentCSSUrl)
                    .replace("{CONTENT}", this.textarea.value));
            doc.close();

            doc.designMode = "on";
            // ע1���� tinymce �designMode = "on" ���� try catch �
            //     ԭ������ firefox �£���iframe �� display: none ��������ᵼ�´���
            //     �������Ҳ��ԣ�firefox 3+ �������޴�����
            // ע2���� tinymce ������ ie ������ contentEditable = true.
            //     ԭ������ ie �£�IE needs to use contentEditable or it will display non secure items for HTTPS
            //     �����ʱ����ӣ����Ժ�����������ʱ�ټ��ϡ�

            // �ر� firefox Ĭ�ϴ򿪵� spellcheck
            //doc.body.setAttribute("spellcheck", "false");

            // TODO �� ie ��ѡ�񱳾�ɫΪ ���װ���
        },

        /**
         * ִ�� execCommand
         */
        execCommand: function(commandName, val) {
            this.contentWin.focus(); // ��ԭ����
            E.Command.exec(this.contentDoc, commandName, val);
        },

        /**
         * �õ�����
         */
        getData: function() {
            var bd = this.contentDoc.body,
                data = '', p = E.plugins["save"];

            // Firefox �£�_moz_editor_bogus_node, _moz_dirty ����������
            // ��Щ�������ԣ����� innerHTML ��ȡʱ���Զ�������

            // ֻ�б�ǩû�ı�����ʱ����������Ϊ��
            if(E.Dom.getText(bd)) {
               data = bd.innerHTML;

                if(p && p.filterData) {
                    data = p.filterData(data);
                }
            }

            return data;
        },

        /**
         * ��ȡѡ������� Range ����
         */
        getSelectionRange: function() {
            return E.Range.getSelectionRange(this.contentWin);
        }
    };

});

KISSY.Editor.add("core~toolbar", function(E) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event,
        isIE = YAHOO.env.ua.ie,
        TYPE = E.PLUGIN_TYPE,
        TOOLBAR_SEPARATOR_TMPL = '<div class="kissy-toolbar-separator kissy-inline-block"></div>',

        TOOLBAR_BUTTON_TMPL = '' +
'<div class="kissy-toolbar-button kissy-inline-block" title="{TITLE}">' +
    '<div class="kissy-toolbar-button-outer-box">' +
        '<div class="kissy-toolbar-button-inner-box">' +
            '<span class="kissy-toolbar-item kissy-toolbar-{NAME}">{TEXT}</span>' +
        '</div>' +
    '</div>' +
'</div>',

        TOOLBAR_MENU_BUTTON_TMPL = '' +
'<div class="kissy-toolbar-menu-button-caption kissy-inline-block">' +
    '<span class="kissy-toolbar-item kissy-toolbar-{NAME}">{TEXT}</span>' +
'</div>' +
'<div class="kissy-toolbar-menu-button-dropdown kissy-inline-block"></div>',

        TOOLBAR_MENU_BUTTON = 'kissy-toolbar-menu-button',
        TOOLBAR_SELECT = 'kissy-toolbar-select',
        TOOLBAR_BUTTON_ACTIVE = "kissy-toolbar-button-active",

        editor, // ��ǰ editor ʵ��
        config, // ��ǰ editor ʵ��������
        lang, // ��ǰ editor ʵ��������
        items, // ��ǰ editor ʵ���������ϵ�������

        plugins, // ����ע���ʵ��
        div = document.createElement("div"); // ͨ�� el ����

    
    E.Toolbar = {

        /**
         * ���ݴ���ı༭��ʵ������ʼ��ʵ���Ĺ�����
         * @param {KISSY.Editor} instance
         */
        init: function(instance) {
            var i, len, key;

            // ���º�ʵ����ص�ȫ�ֱ���
            editor = instance;
            config = editor.config;
            lang = E.lang[config.language];
            items = config.toolbar;
            plugins = E.plugins; // ����������£���֤�� Editor._setup() ֮��ִ��

            // ����������ҵ���ز�������ӵ���������
            for (i = 0,len = items.length; i < len; ++i) {
                key = items[i];
                if (key) {
                    if (!(key in plugins)) continue; // ���������У���������ޣ�ֱ�Ӻ���
                    // ��Ӳ����
                    this._addItem(plugins[key]);

                } else { // ��ӷָ���
                    this._addSeparator();
                }
            }
        },

        /**
         * ��ӹ�������
         */
        _addItem: function(p) {
            var el, type = p.type;

            // �� plugin û������ lang ʱ������Ĭ����������
            // TODO: �����ع��� instance ģ�����Ϊ lang ����ʵ�����
            if (!p.lang) p.lang = lang[p.name] || {};

            // ����ģ�幹�� DOM
            div.innerHTML = TOOLBAR_BUTTON_TMPL
                    .replace("{TITLE}", p.lang.title || "")
                    .replace("{NAME}", p.name)
                    .replace("{TEXT}", p.lang.text || "");

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
            if (p.init) {
                p.init(editor);
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
                    p.exec(editor);
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

                if (el.contains) {
                    isChild = el.contains(toElement);
                } else if (el.compareDocumentPosition) {
                    isChild = el.compareDocumentPosition(toElement) & 8;
                }
                if (isChild) return;

                Dom.removeClass(el, TOOLBAR_BUTTON_ACTIVE);
            });
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
            if(isIE) el = this.setItemUnselectable(el);
            editor.toolbar.appendChild(el);
        },

        /**
         * ��Ԫ�ز���ѡ����� ie �� selection ��ʧ������
         */
        setItemUnselectable: function(el) {
            var arr, i, len, n, a;

            // �� ie �²���
            //arr = [el].concat(Array.prototype.slice.call(el.getElementsByTagName("*")));

            arr = el.getElementsByTagName("*");
            for (i = -1, len = arr.length; i < len; ++i) {
                a = (i == -1) ? el : arr[i];
                
                n = a.nodeName;
                if (n && n != "INPUT") {
                    a.setAttribute("unselectable", "on");
                }
            }

            return el;
        }
    };

});

KISSY.Editor.add("core~menu", function(E) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event,

        VISIBILITY = "visibility",
        DROP_MENU_CLASS = "kissy-drop-menu";
    
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

            // ���� DOM
            dropMenu.className = DROP_MENU_CLASS;
            dropMenu.style[VISIBILITY] = "hidden";
            document.body.appendChild(dropMenu);

            // �������ʱ����ʾ������
            // ע��һ���༭��ʵ�������ֻ����һ�������������
            Event.on(trigger, "click", function(ev) {
                // �����ϴ������Լ�����
                // ���� document �ϼ�ص���󣬻�رոմ򿪵� dropMenu
                Event.stopPropagation(ev);

                // ���ص�ǰ�����������
                self._hide(editor.activeDropMenu);

                // �򿪵�ǰ trigger �� dropMenu
                if(editor.activeDropMenu != dropMenu) {
                    self._setDropMenuPosition(trigger, dropMenu, offset); // �ӳٵ���ʾʱ����λ��
                    self._show(dropMenu);
                    editor.activeDropMenu = dropMenu;

                } else { // �ڶ��ε���� trigger �ϣ��ر� activeDropMenu, ����Ϊ null. ����ᵼ�µ����ε���򲻿�
                    editor.activeDropMenu = null;                   
                }
            });

            // document ���񵽵��ʱ���رյ�ǰ�����������
            Event.on([document, editor.contentDoc], "click", function() {
                self._hide(editor.activeDropMenu);
                editor.activeDropMenu = null;
            });

            // �ı䴰�ڴ�Сʱ����̬����λ��
            this._initResizeEvent(trigger, dropMenu, offset);

            // ����
            return dropMenu;
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
            return el.style[VISIBILITY] != "hidden";
        },

        _hide: function(el) {
            if(el) {
                el.style[VISIBILITY] = "hidden";
            }
        },

        _show: function(el) {
            if(el) {
                el.style[VISIBILITY] = "visible";
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
        }
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
         * @param {KISSY.Editor} editor
         */
        exec: function(editor) {
            editor.execCommand(this.name);
        }
    });

 });

KISSY.Editor.add("plugins~font", function(E) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event,
        isIE = YAHOO.env.ua.ie,
        TYPE = E.PLUGIN_TYPE,

        SELECT_TMPL = '<ul class="kissy-select-list">{LI}</ul>',
        OPTION_TMPL = '<li class="kissy-option" data-value="{VALUE}">' +
                          '<span class="kissy-option-checkbox"></span>' +
                          '<span style="{STYLE}">{KEY}</span>' +
                      '</li>',
        OPTION_SELECTED = "kissy-option-selected",
        DEFAULT = "Default";

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
         * ��ʼ��
         */
        init: function(editor) {
            var el = this.domEl;

            this.options = this.lang.options;
            this.selectHead = el.getElementsByTagName("span")[0];

            this._initSelectList(editor, el);

            // ѡ�е�ǰֵ
            this._setSelectedOption(this.options[DEFAULT]);
        },

        /**
         * ��ʼ������ѡ���
         */
        _initSelectList: function(editor, trigger) {
            this.selectList = E.Menu.generateDropMenu(editor, trigger, [1, 0]);

            // ��ʼ�������� DOM
            this._renderSelectList();

            // ע��ѡȡ�¼�
            this._bindPickEvent(editor);
        },

        /**
         * ��ʼ�������� DOM
         */
        _renderSelectList: function() {
            var htmlCode = "", options = this.options,
                key, val;

            for(key in options) {
                if(key == DEFAULT) continue;
                val = options[key];

                htmlCode += OPTION_TMPL
                        .replace("{VALUE}", val)
                        .replace("{STYLE}", this._getOptionStyle(val))
                        .replace("{KEY}", key);
            }

            // ��ӵ� DOM ��
            this.selectList.innerHTML = SELECT_TMPL.replace("{LI}", htmlCode);

            // ��Ӹ��Ի� class
            Dom.addClass(this.selectList, "kissy-drop-menu-" + this.name);

            // ��� ie�����ò���ѡ��
            if (isIE) E.Toolbar.setItemUnselectable(this.selectList);
        },

        /**
         * ��ȡɫ�¼�
         */
        _bindPickEvent: function(editor) {
            var self = this;

            Event.on(this.selectList, "click", function(ev) {
                var target = Event.getTarget(ev), val;

                if(target.nodeName != "LI") {
                    target = Dom.getAncestorByTagName(target, "li");
                }
                if(!target) return;

                val = target.getAttribute("data-value");
                //console.log(val);

                if(val) {
                    // ���µ�ǰֵ
                    self._setSelectedOption(val);

                    // ִ������
                    editor.execCommand(self.name, self.selectedValue);
                }
            });
        },

        /**
         * ѡ��ĳһ��
         */
        _setSelectedOption: function(val) {
            this.selectedValue = val;

            // ���� head
            this.selectHead.innerHTML = this._getOptionKey(val);

            // ���� selectList �е�ѡ����
            this._updateSelectedOption(val);
        },

        _getOptionStyle: function(val) {
          if(this.name == "fontName") {
              return "font-family:" + val;
          } else { // font size
              return "font-size:" + val;
          }
        },

        _getOptionKey: function(val) {
            var options = this.options, key;

            for(key in options) {
                if(key == DEFAULT) continue;
                
                if(options[key] == val) {
                    return key;
                }
            }
        },

        /**
         * �����������ѡ����
         */
        _updateSelectedOption: function(val) {
            var items = this.selectList.getElementsByTagName("li"),
                i, len = items.length, item;

            for(i = 0; i < len; ++i) {
                item = items[i];

                if(item.getAttribute("data-value") == val) {
                    Dom.addClass(item, OPTION_SELECTED);
                } else {
                    Dom.removeClass(item, OPTION_SELECTED);
                }
            }
        }
    });

});

// TODO
//  1. �� google, �Լ����¼���֧��

KISSY.Editor.add("plugins~color", function(E) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event,
        isIE = YAHOO.env.ua.ie,
        TYPE = E.PLUGIN_TYPE,

        PALETTE_TABLE_TMPL = '<table class="kissy-palette-table"><tbody>{TR}</tbody></table>',
        PALETTE_CELL_TMPL = '<td class="kissy-palette-cell"><div class="kissy-palette-colorswatch" title="{COLOR}" style="background-color:{COLOR}"></div></td>',

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

        PALETTE_CELL_SELECTED = "kissy-palette-cell-selected";

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
         * �����������˵���
         */
        dropMenu: null,

        /**
         * ��ʼ��
         */
        init: function(editor) {
            var el = this.domEl,
                caption = el.getElementsByTagName("span")[0].parentNode;

            this.color = (this.name == "foreColor") ? "#000000" : "#ffffff";

            Dom.addClass(el, "kissy-toolbar-color-button");
            caption.innerHTML = '<div class="kissy-toolbar-color-button-indicator" style="border-bottom-color:' + this.color + '">'
                               + caption.innerHTML
                               + '</div>';

            this._indicator = caption.firstChild;

            // �����ַ�����
            //  1. ���� MS Office 2007, �������������ͷʱ���ŵ��������򡣵�� caption ʱ��ֱ��������ɫ��
            //  2. ���� Google Docs, ������ caption �� dropdown����ÿ�ε��������������
            // ���߼��Ͻ�������1�������ǣ����� web ҳ���ϣ���ť�Ƚ�С������2�������������������ԡ�
            // ������÷���2
            this._initDropMenu(editor, el);
        },

        /**
         * ��ʼ�������˵�
         */
        _initDropMenu: function(editor, trigger) {
            this.dropMenu = E.Menu.generateDropMenu(editor, trigger, [1, 0]);

            // �����������ڵ�����
            this._generatePalettes();

            // ��� ie�����ò���ѡ��
            if (isIE) E.Toolbar.setItemUnselectable(this.dropMenu);

            // ע�����¼�
            this._bindPickEvent(editor);

            // ѡ�е�ǰɫ
            this._updateSelectedColor(this.color);

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
        _bindPickEvent: function(editor) {
            var self = this;

            Event.on(this.dropMenu, "click", function(ev) {
                var target = Event.getTarget(ev),
                    attr = target.getAttribute("title");

                if(attr && attr.indexOf("RGB") === 0) {
                    // ���µ�ǰֵ
                    self.setColor(E.Color.toHex(attr));

                    // ִ������
                    editor.execCommand(self.name, self.color);
                }
            });
        },

        /**
         * ������ɫ
         * @param {string} val ��ʽ #RRGGBB or #RGB
         */
        setColor: function(val) {
            this.color = val;

            // ���� indicator
            this._indicator.style.borderBottomColor = val;

            // ���� dropMenu ���Ӧ��ѡ����
            this._updateSelectedColor(val);
        },

        /**
         * ���������˵���ѡ�е���ɫ
         * @param {string} val ��ʽ #RRGGBB or #RGB
         */
        _updateSelectedColor: function(val) {
            var i, len, swatch,
                swatches = this.dropMenu.getElementsByTagName("div");

            for(i = 0, len = swatches.length; i < len; ++i) {
                swatch = swatches[i];

                // ��ȡ�� backgroundColor �ڲ�ͬ������£���ʽ�в��죬��Ҫͳһת�����ٱȽ�
                if(E.Color.toHex(swatch.style.backgroundColor) == val) {
                    Dom.addClass(swatch.parentNode, PALETTE_CELL_SELECTED);
                } else {
                    Dom.removeClass(swatch.parentNode, PALETTE_CELL_SELECTED);
                }
            }
        }
    });

});

// TODO
//  1. �� google, �Լ����¼���֧��

KISSY.Editor.add("plugins~link", function(E) {

    var TYPE = E.PLUGIN_TYPE,
        Lang = YAHOO.lang;

    E.addPlugin("link", {
        /**
         * ���ࣺ��ͨ��ť
         */
        type: TYPE.TOOLBAR_BUTTON,

        /**
         * ��Ӧ����
         * @param {KISSY.Editor} editor
         */
        exec: function(editor) {
            var msg = this.lang.dialogMessage,
                url = "http://",
                range = editor.getSelectionRange(),
                container = range.startContainer,
                parentEl;

           if(container.nodeType == 3) { // TextNode
               parentEl = container.parentNode;
               if(parentEl.nodeName == "A") {
                   url = parentEl.href;
               }
           }

            url = Lang.trim(window.prompt(msg, url));

            if(url) {
                editor.execCommand("createLink", url);
            } else {
                editor.execCommand("unLink", url);
            }

            // TODO:
            // ��ѡ����������/һ���ְ�������ʱ�����ɵ��������ݵĵ��Ŵ���
            // Ŀǰֻ�� Google Docs �����Ż��������༭�������������Ĭ�ϵĴ���ʽ��
            // �ȼ��ڴˣ����Ժ��Ż���
        }
    });

 });

KISSY.Editor.add("plugins~indent", function(E) {

    var TYPE = E.PLUGIN_TYPE;

    E.addPlugin(["indent", "outdent"], {
        /**
         * ���ࣺ��ͨ��ť
         */
        type: TYPE.TOOLBAR_BUTTON,

        /**
         * ��Ӧ����
         * @param {KISSY.Editor} editor
         */
        exec: function(editor) {
            editor.execCommand(this.name);
        }
    });

 });

// TODO:
//  Ŀǰ�� Google Docs���������⴦���ڲ�ͬ������±��ֲ�ͬ��
//  ����ʱ���ˣ����Կ��Ƿ��� CKEditor ��ʵ�ַ�ʽ��

KISSY.Editor.add("plugins~justify", function(E) {

    var Y = YAHOO.util, Dom = Y.Dom,
        TYPE = E.PLUGIN_TYPE,
        UA = YAHOO.env.ua,

        // Ref: CKEditor - core/dom/elementpath.js
        JUSTIFY_ELEMENTS = {

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
        },

        plugin = {
            /**
             * ���ࣺ��ͨ��ť
             */
            type: TYPE.TOOLBAR_BUTTON,

            /**
             * ��Ӧ����
             * @param {KISSY.Editor} editor
             */
            exec: function(editor) {
                editor.execCommand(this.name);
            }
        };

    // ע��ie �£�Ĭ��ʹ�� align ������ʵ�ֶ���
    // ��������������� range �ķ�ʽ��ʵ�֣��Ա��ֺ����������һ��
    if (UA.ie) {

        plugin.exec = function(editor) {
            var range = editor.getSelectionRange(),
                parentEl = range.parentElement(),
                justifyAncestor;

            // ��ȡ�ɶ���ĸ�Ԫ��
            if (isJustifyElement(parentEl)) {
                justifyAncestor = parentEl;
            } else {
                justifyAncestor = getJustifyAncestor(parentEl);
            }

            // ���� text-align
            if (justifyAncestor) {
                justifyAncestor.style.textAlign = this.name.substring(7).toLowerCase();
            }

            /**
             * ��ȡ�����ö���ĸ�Ԫ��
             */
            function getJustifyAncestor(el) {
                return Dom.getAncestorBy(el, function(arg) {
                    return isJustifyElement(arg);
                });
            }

            /**
             * �ж��Ƿ�ɶ���Ԫ��
             */
            function isJustifyElement(el) {
                return JUSTIFY_ELEMENTS[el.nodeName.toLowerCase()];
            }
        };
    }
    
    // ע����
    E.addPlugin(["justifyLeft", "justifyCenter", "justifyRight"], plugin);

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
         * @param {KISSY.Editor} editor
         */
        exec: function(editor) {
            // TODO
            // ����ϸ��
            editor.execCommand(this.name);
        }
    });

 });

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
        type: TYPE.CUSTOM,

        /**
         * ��ʼ��
         */
        init: function(editor) {
            var textarea = editor.textarea,
                form = textarea.form;

            if(form) {
                Event.on(form, "submit", function() {
                    textarea.value = editor.getData();
                });
            }
        },

        /**
         * ��������
         */
        filterData: function(data) {

            data = data.replace(/<(\/?)([^>]+)>/g, function(m, slash, tag) {

                // �� ie �Ĵ�д��ǩ�� style ������ֵת��ΪСд
                tag = tag.toLowerCase();

                // �ñ�ǩ���廯
                var map = TAG_MAP[tag],
                    ret = tag;

                // �Ҳ���ʱ��������Сдת��
                if(map) {
                    ret = map["tag"];
                    if(!slash && map["style"]) {
                        ret += ' style="' + map["style"] + '"';
                    }
                }

                return "<" + slash + ret + ">";
            });

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
        }
    });
 });
