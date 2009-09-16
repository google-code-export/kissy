
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
