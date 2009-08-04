
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
