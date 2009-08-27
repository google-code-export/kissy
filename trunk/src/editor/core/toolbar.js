
KISSY.Editor.add("core~toolbar", function(E) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = YAHOO.lang,
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
            var el, type = p.type;

            // �� plugin û������ lang ʱ������Ĭ����������
            // TODO: �����ع��� instance ģ�����Ϊ lang ����ʵ�����
            if (!p.lang) p.lang = this.lang[p.name] || {};

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
