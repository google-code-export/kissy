
KISSY.Editor.add("toolbar", function(E) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, //Lang = YAHOO.lang,
        isIE = YAHOO.env.ua.ie,
        TYPE = E.PLUGIN_TYPE,
        TOOLBAR_SEPARATOR_TMPL = '<div class="kissy-toolbar-separator kissy-inline-block"></div>',

        TOOLBAR_BUTTON_TMPL = '\
<div class="kissy-toolbar-button kissy-inline-block" title="{TITLE}">\
    <div class="kissy-toolbar-button-outer-box">\
        <div class="kissy-toolbar-button-inner-box">\
            <span class="kissy-toolbar-item kissy-toolbar-{NAME}">{TEXT}</span>\
        </div>\
    </div>\
</div>',
        TOOLBAR_MENU_BUTTON_TMPL = '\
<div class="kissy-toolbar-menu-button-caption kissy-inline-block">\
    <span class="kissy-toolbar-item kissy-toolbar-{NAME}">{TEXT}</span>\
</div>\
<div class="kissy-toolbar-menu-button-dropdown kissy-inline-block"></div>',

        TOOLBAR_BUTTON_ACTIVE = "kissy-toolbar-button-active",

        config, // ��ǰ editor ʵ��������
        lang, // ��ǰ editor ʵ��������
        items, // ��ǰ editor ʵ���������ϵ�������
        plugins = E.plugins, // ����ע���ʵ��
        div = document.createElement("div"); // ͨ�� el ����

    
    E.Toolbar = {

        /**
         * ���ݴ���ı༭��ʵ������ʼ��ʵ���Ĺ�����
         * @param {KISSY.Editor} editor
         */
        init: function(editor) {
            var i, len, key, button;

            // ����ʵ����ر���
            config = editor.config;
            lang = E.lang[config.language];
            items = config.toolbar;

            for (i = 0,len = items.length; i < len; ++i) {
                key = items[i];

                if (key) {
                    if (!(key in plugins)) continue; // ���������У���������ޣ�ֱ�Ӻ���
                    this._initItem(key, editor);

                } else { // �ָ���
                    div.innerHTML = TOOLBAR_SEPARATOR_TMPL;
                }

                button = div.firstChild;
                if(isIE) button = this._setItemUnselectable(button);
                editor.toolbar.appendChild(button);
            }
        },

        /**
         * ��ʼ���������ϵ���
         */
        _initItem: function(key, editor) {
            var p = plugins[key], innerBox, el;

            // ��plugin û������ lang ʱ������Ĭ����������
            if (!p.lang) p.lang = lang[key];

            // ����ģ�幹�� DOM
            div.innerHTML = TOOLBAR_BUTTON_TMPL
                    .replace("{TITLE}", p.lang.title)
                    .replace("{NAME}", p.name)
                    .replace("{TEXT}", p.lang.text);

            p.domEl = el = div.firstChild;

            // ���ݹ������Ĳ�����ͣ����� DOM �ṹ
            // TODO ֧�ָ���������������
            if (p.type & TYPE.TOOLBAR_MENU_BUTTON) { // �����˵�
                innerBox = el.getElementsByTagName("span")[0].parentNode;
                innerBox.innerHTML = TOOLBAR_MENU_BUTTON_TMPL
                        .replace("{NAME}", p.name)
                        .replace("{TEXT}", p.lang.text);
            }

            // ���ò���Լ��ĳ�ʼ������
            // ����ĸ��Ի��ӿ�
            if (p.init) {
                p.init(p, editor);
            }

            // ע����ʱ����Ӧ����
            if (p.fn) {
                Event.on(el, "click", function() {
                    p.fn(p, editor);
                });
            }

            // ��������ʱ����ť���µ�Ч��
            Event.on(el, "mousedown", function() {
                Dom.addClass(el, TOOLBAR_BUTTON_ACTIVE);
            });
            Event.on(el, "mouseup", function() {
                Dom.removeClass(el, TOOLBAR_BUTTON_ACTIVE);
            });
            // TODO ����������¼����ڰ���״̬������Ƴ�������ʱ��״̬���л��ͻ�ԭ
            Event.on(el, "mouseout", function(e) {
                var toElement = Event.getRelatedTarget(e), isChild;
                if (el.contains) {
                    isChild = el.contains(toElement);
                } else if (el.compareDocumentPosition) { // ff 3.5 ��ò����Ч��������һ������ȷ��
                    isChild = el.compareDocumentPosition(toElement) & 16;
                }
                if (isChild) return;

                Dom.removeClass(el, TOOLBAR_BUTTON_ACTIVE);
            });


        },

        /**
         * ��Ԫ�ز���ѡ����� ie �� selection ��ʧ������
         */
        _setItemUnselectable: function(el) {
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
