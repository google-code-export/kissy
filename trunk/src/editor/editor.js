/**
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
            "link", "smiley", "image", "blockquote", 
            "",
            "insertOrderedList", "insertUnorderedList", "outdent", "indent", "justifyLeft", "justifyCenter", "justifyRight",
            "",
            "removeformat", "maximize", "source"
        ]
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
              "Default"         : "2",
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
            web_legend    : "Enter image web address:",
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
        TOOLBAR_SELECT: 8,
        FUNC: 16 // ���������ʲ������ UI
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
        },

        /**
         * ��ȡ��ʼ����������
         */
        getContainer: function(range) {
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
        }
    };

});

KISSY.Editor.add("core~instance", function(E) {

    var Y = YAHOO.util, Dom = Y.Dom, Lang = YAHOO.lang,
        EDITOR_CLASSNAME = "kissy-editor",

        EDITOR_TMPL  =  '<div class="kissy-editor-toolbar"></div>' +
                        '<div class="kissy-editor-content"><iframe frameborder="0" allowtransparency="true"></iframe></div>' +
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

            // �������
            for(key in plugins) {
                p = plugins[key];
                if(p.inited) continue;

                p.editor = this; // �� p ���� editor ����
                if(p.init) {
                    p.init();
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
            iframe.style.height = "100%";
            iframe.setAttribute("frameBorder", 0);

            textarea.style.display = "none";
            Dom.insertBefore(container, textarea);

            this.container = container;
            this.toolbar.domEl = container.childNodes[0];
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
    });

});

KISSY.Editor.add("core~toolbar", function(E) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = YAHOO.lang,
        isIE = YAHOO.env.ua.ie,
        isIE6 = isIE === 6,
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
        TOOLBAR_BUTTON_HOVER = "kissy-toolbar-button-hover",

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
    };
    
    Lang.augmentObject(E.Toolbar.prototype, {

        /**
         * ��ʼ��������
         */
        init: function() {
            var items = this.config.toolbar,
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
                    this._addSeparator();
                }
            }
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
                        .replace("outer-box", "outer-box kissy-inline-block")
                        .replace("inner-box", "inner-box kissy-inline-block");
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
        }
    });

});

KISSY.Editor.add("core~menu", function(E) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event,

        VISIBILITY = "visibility",
        HIDDEN = "hidden",
        VISIBLE = "visible",
        DROP_MENU_CLASS = "kissy-drop-menu",
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
            return el.style[VISIBILITY] != HIDDEN;
        },

        _hide: function(el) {
            if(el) {
                if(shim) {
                    shim.style[VISIBILITY] = HIDDEN;
                }

                el.style[VISIBILITY] = HIDDEN;
            }
        },

        _show: function(el) {
            if(el) {
                if(YAHOO.env.ua.ie === 6) {
                    if(!shim) this._initShim();
                    this._setShimRegion(el);
                    shim.style[VISIBILITY] = VISIBLE;
                }

                el.style[VISIBILITY] = VISIBLE;
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
            shim.style.visibility = HIDDEN;
            shim.style.border = "none";
            document.body.appendChild(shim);
        },

        /**
         * ���� shim �� region
         * @protected
         */
        _setShimRegion: function(el) {
            if (shim) {
                var r = Dom.getRegion(el);
                shim.style.left = r.left + "px";
                shim.style.top = r.top + "px";
                shim.style.width = r.width + "px";
                shim.style.height = r.height + "px";
            }
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
         */
        exec: function() {
            this.editor.execCommand(this.name);
        }
    });

 });
KISSY.Editor.add("plugins~blockquote", function(E) {

    var Y = YAHOO.util, Dom = Y.Dom,
        TYPE = E.PLUGIN_TYPE,

        BLOCKQUOTE = "blockquote",
        BLOCKQUOTE_ELEMENTS = E.Dom.BLOCK_ELEMENTS;

    E.addPlugin("blockquote", {
        /**
         * ���ࣺ��ͨ��ť
         */
        type: TYPE.TOOLBAR_BUTTON,

        /**
         * ��Ӧ����
         */
        exec: function() {
            var editor = this.editor,
                range = editor.getSelectionRange(),
                parentEl = E.Range.getContainer(range),
                quotableAncestor;

            if(!parentEl) return;

            // ��ȡ�����õĸ�Ԫ��
            if (this.isQuotableElement(parentEl)) {
                quotableAncestor = parentEl;
            } else {
                quotableAncestor = this.getQuotableAncestor(parentEl);
            }

            // exec
            if (quotableAncestor) {
                var isQuoted = quotableAncestor.parentNode.nodeName.toLowerCase() === BLOCKQUOTE;
                editor.execCommand(isQuoted ? "outdent" : "indent", null, false);
            }
        },

        /**
         * ��ȡ�����õĸ�Ԫ��
         */
        getQuotableAncestor: function(el) {
            var self = this;
            return Dom.getAncestorBy(el, function(elem) {
                return self.isQuotableElement(elem);
            });
        },

        /**
         * �ж��Ƿ�ɶ���Ԫ��
         */
        isQuotableElement: function(el) {
            return BLOCKQUOTE_ELEMENTS[el.nodeName.toLowerCase()];
        }
    });
});

// NOTES:
//  Ŀǰ��ʽ�� Google Docs

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
        init: function() {
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
            this._initDropMenu(el);
        },

        /**
         * ��ʼ�������˵�
         */
        _initDropMenu: function(trigger) {
            this.dropMenu = E.Menu.generateDropMenu(this.editor, trigger, [1, 0]);

            // �����������ڵ�����
            this._generatePalettes();

            // ��� ie�����ò���ѡ��
            if (isIE) E.Dom.setItemUnselectable(this.dropMenu);

            // ע�����¼�
            this._bindPickEvent();

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
        _bindPickEvent: function() {
            var self = this;

            Event.on(this.dropMenu, "click", function(ev) {
                var target = Event.getTarget(ev),
                    attr = target.getAttribute("title");

                if(attr && attr.indexOf("RGB") === 0) {
                    // ���µ�ǰֵ
                    self.setColor(E.Color.toHex(attr));

                    // ִ������
                    self.editor.execCommand(self.name, self.color);
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
//  2. ���仯ʱ����̬���µ�ǰ��ɫָʾֵ

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
        init: function() {
            var el = this.domEl;

            this.options = this.lang.options;
            this.selectHead = el.getElementsByTagName("span")[0];

            this._initSelectList(el);

            // ѡ�е�ǰֵ
            this._setSelectedOption(this.options[DEFAULT]);
        },

        /**
         * ��ʼ������ѡ���
         */
        _initSelectList: function(trigger) {
            this.selectList = E.Menu.generateDropMenu(this.editor, trigger, [1, 0]);

            // ��ʼ�������� DOM
            this._renderSelectList();

            // ע��ѡȡ�¼�
            this._bindPickEvent();
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
                        .replace("{STYLE}", this._getOptionStyle(key, val))
                        .replace("{KEY}", key);
            }

            // ��ӵ� DOM ��
            this.selectList.innerHTML = SELECT_TMPL.replace("{LI}", htmlCode);

            // ��Ӹ��Ի� class
            Dom.addClass(this.selectList, "kissy-drop-menu-" + this.name);

            // ��� ie�����ò���ѡ��
            if (isIE) E.Dom.setItemUnselectable(this.selectList);
        },

        /**
         * ��ȡɫ�¼�
         */
        _bindPickEvent: function() {
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
                    self.editor.execCommand(self.name, self.selectedValue);
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
//  2. ���仯ʱ����̬���µ�ǰ������ʾֵ

KISSY.Editor.add("plugins~image", function(E) {

    var Y = YAHOO.util, Event = Y.Event, Lang = YAHOO.lang,
        isIE = YAHOO.env.ua.ie,
        TYPE = E.PLUGIN_TYPE,

        DIALOG_CLS = "kissy-image-dialog",
        BTN_OK_CLS = "kissy-image-dialog-ok",
        BTN_CANCEL_CLS = "kissy-image-dialog-cancel",

        DIALOG_TMPL = ['<form onsubmit="return false"><fieldset>',
                          '<legend>{web_legend}</legend>',
                          '<input name="imageUrl" size="50" />',
                          '<div class="kissy-dialog-buttons">',
                              '<button name="ok" class="', BTN_OK_CLS, '">{ok}</button>',
                              '<button name="cancel" class="', BTN_CANCEL_CLS ,'">{cancel}</button>',
                          '</div>',
                      '</fieldset></form>'].join("");

    E.addPlugin("image", {
        /**
         * ���ࣺ��ͨ��ť
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

            if(isIE) {
                E.Dom.setItemUnselectable(dialog);
            }
        },

        /**
         * ���¼�
         */
        _bindUI: function() {
            var form = this.form, self = this;

            // ��ʾ/���ضԻ���ʱ���¼�
            Event.on(this.domEl, "click", function() {
                // ������ʾʱ����
                if (self.dialog.style.visibility === isIE ? "hidden" : "visible") { // �¼��Ĵ���˳��ͬ
                    self._syncUI();
                }
            });

            // ע�����ť����¼�
            Event.on(this.dialog, "click", function(ev) {
                var target = Event.getTarget(ev);

                switch(target.className) {
                    case BTN_OK_CLS:
                        self._insertImage(form.imageUrl.value);
                        break;
                    case BTN_CANCEL_CLS: // ֱ������ð�ݣ��رնԻ���
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
            this.range = this.editor.getSelectionRange();
            this.form.imageUrl.value = "";
        },

        /**
         * ����ͼƬ
         */
        _insertImage: function(imageUrl) {
            imageUrl = Lang.trim(imageUrl);

            // url Ϊ��ʱ��������
            if (imageUrl.length === 0) {
                return;
            }

            var editor = this.editor,
                range = this.range,
                img;

            // ����ͼƬ
            if (!isIE) {
                img = document.createElement("img");
                img.src = imageUrl;
                img.setAttribute("title", "");
                range.insertNode(img);
            } else {
                range.select();
                editor.execCommand("insertImage", imageUrl);
            }
        }
    });

 });

// TODO:
//  1. ͼƬ�ϴ�����
KISSY.Editor.add("plugins~indent", function(E) {

    var Y = YAHOO.util, Dom = Y.Dom, Lang = YAHOO.lang,
        TYPE = E.PLUGIN_TYPE,
        UA = YAHOO.env.ua,

        INDENT_ELEMENTS = Lang.merge(E.Dom.BLOCK_ELEMENTS, {
            li: 0 // ȡ�� li Ԫ�صĵ����������� ol/ul ��������
        }),
        INDENT_STEP = "40",
        INDENT_UNIT = "px",

        plugin = {
            /**
             * ���ࣺ��ͨ��ť
             */
            type: TYPE.TOOLBAR_BUTTON,

            /**
             * ��Ӧ����
             */
            exec: function() {
                this.editor.execCommand(this.name);
            }
        };

    // ע��ie �£�Ĭ��ʹ�� blockquote Ԫ����ʵ������
    // ��������������� range �ķ�ʽ��ʵ�֣��Ա��ֺ����������һ��
    if (UA.ie) {

        plugin.exec = function() {
            var range = this.editor.getSelectionRange(),
                parentEl, indentableAncestor;

            if(range.parentElement) { // TextRange
                parentEl = range.parentElement();
            } else if(range.item) { // ControlRange
                parentEl = range.item(0);
            } else { // �����κδ���
                return;
            }

            // ��ȡ�������ĸ�Ԫ��
            if (isIndentableElement(parentEl)) {
                 indentableAncestor = parentEl;
            } else {
                 indentableAncestor = getIndentableAncestor(parentEl);
            }

            // ���� margin-left
            if (indentableAncestor) {
                var val = parseInt(indentableAncestor.style.marginLeft) >> 0;
                val += (this.name === "indent" ? +1 : -1) * INDENT_STEP;

                indentableAncestor.style.marginLeft = val + INDENT_UNIT;
            }

            /**
             * ��ȡ�������ĸ�Ԫ��
             */
            function getIndentableAncestor(el) {
                return Dom.getAncestorBy(el, function(elem) {
                    return isIndentableElement(elem);
                });
            }

            /**
             * �ж��Ƿ������Ԫ��
             */
            function isIndentableElement(el) {
                return INDENT_ELEMENTS[el.nodeName.toLowerCase()];
            }
        };
    }

    // ע����
    E.addPlugin(["indent", "outdent"], plugin);
 });

// TODO:
//  1. �� rtl ��֧��
KISSY.Editor.add("plugins~justify", function(E) {

    var Y = YAHOO.util, Dom = Y.Dom,
        TYPE = E.PLUGIN_TYPE,
        UA = YAHOO.env.ua,

        JUSTIFY_ELEMENTS = E.Dom.BLOCK_ELEMENTS,

        plugin = {
            /**
             * ���ࣺ��ͨ��ť
             */
            type: TYPE.TOOLBAR_BUTTON,

            /**
             * ��Ӧ����
             */
            exec: function() {
                this.editor.execCommand(this.name);
            }
        };

    // ע��ie �£�Ĭ��ʹ�� align ������ʵ�ֶ���
    // ��������������� range �ķ�ʽ��ʵ�֣��Ա��ֺ����������һ��
    if (UA.ie) {

        plugin.exec = function() {
            var range = this.editor.getSelectionRange(),
                parentEl, justifyAncestor;

            if(range.parentElement) { // TextRange
                parentEl = range.parentElement();
            } else if(range.item) { // ControlRange
                parentEl = range.item(0);
            } else { // �����κδ���
                return;
            }

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
                return Dom.getAncestorBy(el, function(elem) {
                    return isJustifyElement(elem);
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

KISSY.Editor.add("plugins~link", function(E) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = YAHOO.lang,
        isIE = YAHOO.env.ua.ie,
        TYPE = E.PLUGIN_TYPE, Range = E.Range,
        timeStamp = new Date().getTime(),
        HREF_REG = /^\w+:\/\/.*|#.*$/,

        DIALOG_CLS = "kissy-link-dialog",
        NEW_LINK_CLS = "kissy-link-dialog-newlink-mode",
        BTN_OK_CLS = "kissy-link-dialog-ok",
        BTN_CANCEL_CLS = "kissy-link-dialog-cancel",
        BTN_REMOVE_CLS = "kissy-link-dialog-remove",
        DEFAULT_HREF = "http://",

        DIALOG_TMPL = ['<form onsubmit="return false"><ul>',
                          '<li class="kissy-link-dialog-href"><label>{href}</label><input name="href" size="40" value="http://" type="text" /></li>',
                          '<li class="kissy-link-dialog-target"><input name="target" id="target_"', timeStamp ,' type="checkbox" /> <label for="target_"', timeStamp ,'>{target}</label></li>',
                          '<li class="kissy-link-dialog-actions">',
                              '<button name="ok" class="', BTN_OK_CLS, '">{ok}</button>',
                              '<button name="cancel" class="', BTN_CANCEL_CLS ,'">{cancel}</button>',
                              '<span class="', BTN_REMOVE_CLS ,'">{remove}</span>',
                          '</li>',
                      '</ul></form>'].join("");

    E.addPlugin("link", {
        /**
         * ���ࣺ��ͨ��ť
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

            if(isIE) {
                E.Dom.setItemUnselectable(dialog);
            }
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
            this.range = this.editor.getSelectionRange();

            var form = this.form,
                container = Range.getContainer(this.range),
                containerIsA = container.nodeName === "A", // ͼƬ������
                parentEl = container.parentNode,
                parentIsA = parentEl && (parentEl.nodeName === "A"), // ��������
                a;

            // �޸����ӽ���
            if (containerIsA || parentIsA) {
                a = containerIsA ? container : parentEl;
                form.href.value = a.href;
                form.target.checked = a.target === "_blank";
                Dom.removeClass(form, NEW_LINK_CLS);
                return;
            }

            // �½����ӽ���
            form.href.value = DEFAULT_HREF;
            form.target.checked = false;
            Dom.addClass(form, NEW_LINK_CLS);
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

            var editor = this.editor,
                range = this.range,
                container = Range.getContainer(range),
                containerIsA = container.nodeName === "A", // ��ͼƬ������
                parentEl = container.parentNode,
                parentIsA = parentEl && (parentEl.nodeName === "A"), // ��������
                a;

            // �޸�����
            if (containerIsA || parentIsA) {
                a = containerIsA ? container : parentEl;
                a.href = href;
                if (target) {
                    a.setAttribute("target", "_blank");
                } else {
                    a.removeAttribute("target");
                }
                return;
            }

            // ��������
            var selectedText = Range.getSelectedText(range);
            if (container.nodeType == 3 && !selectedText) { // �ı�����
                if (!isIE) {
                    a = document.createElement("A");
                    a.innerHTML = href;
                    range.insertNode(a);
                } else {
                    range.pasteHTML('<a href="' + href + '">' + href + '</a>');
                }
            } else {
                if(range.select) range.select();
                editor.execCommand("createLink", href);
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
                container = Range.getContainer(range),
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
KISSY.Editor.add("plugins~maximize", function(E) {

    var TYPE = E.PLUGIN_TYPE;

    E.addPlugin("maximize", {
        /**
         * ���ࣺ��ͨ��ť
         */
        type: TYPE.TOOLBAR_BUTTON,

        /**
         * ��Ӧ����
         */
        exec: function() {
            alert("todo");
        }
    });

 });
KISSY.Editor.add("plugins~removeformat", function(E) {

    var Y = YAHOO.util, Dom = Y.Dom,
        Range = E.Range,
        TYPE = E.PLUGIN_TYPE,

        FORMAT_TAGS_REG = /^(b|big|code|del|dfn|em|font|i|ins|kbd|q|samp|small|span|strike|strong|sub|sup|tt|u|var)$/g,
        FORMAT_ATTRS = ["class","style","lang","width","height","align","hspace","valign"];

    E.addPlugin("removeformat", {
        /**
         * ���ࣺ��ͨ��ť
         */
        type: TYPE.TOOLBAR_BUTTON,

        /**
         * ��Ӧ����
         */
        exec: function() {
            var editor = this.editor,
                range = editor.getSelectionRange(),
                parentEl = E.Range.getContainer(range);
            if (!parentEl) return;

            alert("����ʵ����");

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
                        textarea.value = editor.getData();
                    }
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

                // ����� <tag> ���ֲ������Եı�ǩ����һ������
                if(tag.indexOf(" ") == -1 && map) {
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

KISSY.Editor.add("plugins~smiley", function(E) {

    var TYPE = E.PLUGIN_TYPE;

    E.addPlugin("smiley", {
        /**
         * ���ࣺ��ͨ��ť
         */
        type: TYPE.TOOLBAR_BUTTON,

        /**
         * ��Ӧ����
         */
        exec: function() {
            alert("todo");
        }
    });

 });

KISSY.Editor.add("plugins~source", function(E) {

    var TYPE = E.PLUGIN_TYPE;

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

            // �л���ʾ
            this.textarea.style.display = srcOn ? "none" : "";
            this.iframe.style.display = srcOn ? "" : "none";

            // ����״̬
            editor.sourceMode = !srcOn;
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
