
KISSY.Editor.add("toolbar", function(E) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, //Lang = YAHOO.lang,
        isIE = YAHOO.env.ua.ie,
        TYPE = E.PLUGIN_TYPE,
        TOOLBAR_SEPARATOR_TMPL = '<div class="kissy-toolbar-separator"></div>',

        TOOLBAR_BUTTON_TMPL = '\
<div class="kissy-toolbar-button" title="{TITLE}">\
    <div class="kissy-toolbar-button-outer-box">\
        <div class="kissy-toolbar-button-inner-box">\
            <span class="kissy-toolbar-item kissy-toolbar-{NAME}">{TEXT}</span>\
        </div>\
    </div>\
</div>',
        TOOLBAR_MENU_BUTTON_CLASS = "kissy-toolbar-menu-button",
        TOOLBAR_MENU_BUTTON_TMPL = '\
<div class="kissy-toolbar-menu-button-caption">\
    <span class="kissy-toolbar-item kissy-toolbar-{NAME}">{TEXT}</span>\
</div>\
<div class="kissy-toolbar-menu-button-dropdown"></div>';

    E.Toolbar = {

        /**
         * ���ݴ���ı༭��ʵ������ʼ��ʵ���Ĺ�����
         * @param {KISSY.Editor} editor
         */
        init: function(editor) {
            var config = editor.config,
                lang = E.lang[config.language],
                items = config.toolbar,
                plugins = E.plugins,
                i, len, key, button,
                div = document.createElement("div");

            for (i = 0,len = items.length; i < len; ++i) {
                key = items[i];

                if (key) {
                    if (!(key in plugins)) continue; // �п������������е��������

                    (function() {
                        var p = plugins[key], innerBox, el;

                        // �� p ׷�Ӽ�ֵ
                        p.name = key;
                        p.lang = lang[key];

                        // ����ģ�幹�� DOM
                        div.innerHTML = TOOLBAR_BUTTON_TMPL
                                .replace("{TITLE}", p.lang.title)
                                .replace("{NAME}", p.name)
                                .replace("{TEXT}", p.lang.text);

                        p.domEl = el = div.firstChild;

                        // ���ݹ������Ĳ�����ͣ����� DOM �ṹ
                        // TODO ֧�ָ���������������
                        if(p.type & TYPE.TOOLBAR_MENU_BUTTON) { // �����˵�
                            Dom.addClass(el, TOOLBAR_MENU_BUTTON_CLASS);
                            innerBox = el.getElementsByTagName("span")[0].parentNode;
                            innerBox.innerHTML = TOOLBAR_MENU_BUTTON_TMPL
                                .replace("{NAME}", p.name)
                                .replace("{TEXT}", p.lang.text);

                        }

                        // ���ò���Լ��ĳ�ʼ������
                        // ����ĸ��Ի��ӿ�
                        if(p.init) {
                            p.init(p, editor);
                        }

                        // ע����ʱ����Ӧ����
                        if (p.fn) {
                            Event.on(el, "click", function() {
                                p.fn(p, editor);
                            });
                        }
                    })();

                } else { // �ָ���
                    div.innerHTML = TOOLBAR_SEPARATOR_TMPL;
                }

                button = div.firstChild;
                if(isIE) button = this._setItemUnselectable(button);
                editor.toolbar.appendChild(button);
            }
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
