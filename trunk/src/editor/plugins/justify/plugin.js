
KISSY.Editor.add("plugins~justify", function(E) {

    var //Y = YAHOO.util, Dom = Y.Dom,
        TYPE = E.PLUGIN_TYPE,
        //UA = YAHOO.env.ua,

        //JUSTIFY_ELEMENTS = E.Dom.BLOCK_ELEMENTS,

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
    // ע��ѡ�������ж����ʱ������Ĵ��������� [Issue 4]
    // ��ʱ������Ĭ�ϵ����������
//    if (UA.ie) {
//
//        plugin.exec = function() {
//            var range = this.editor.getSelectionRange(),
//                parentEl, justifyAncestor;
//
//            if(range.parentElement) { // TextRange
//                parentEl = range.parentElement();
//            } else if(range.item) { // ControlRange
//                parentEl = range.item(0);
//            } else { // �����κδ���
//                return;
//            }
//
//            // ��ȡ�ɶ���ĸ�Ԫ��
//            if (isJustifyElement(parentEl)) {
//                justifyAncestor = parentEl;
//            } else {
//                justifyAncestor = getJustifyAncestor(parentEl);
//            }
//
//            // ���� text-align
//            if (justifyAncestor) {
//                justifyAncestor.style.textAlign = this.name.substring(7).toLowerCase();
//            }
//
//            /**
//             * ��ȡ�����ö���ĸ�Ԫ��
//             */
//            function getJustifyAncestor(el) {
//                return Dom.getAncestorBy(el, function(elem) {
//                    return isJustifyElement(elem);
//                });
//            }
//
//            /**
//             * �ж��Ƿ�ɶ���Ԫ��
//             */
//            function isJustifyElement(el) {
//                return JUSTIFY_ELEMENTS[el.nodeName.toLowerCase()];
//            }
//        };
//    }


    // ע����
    E.addPlugin(["justifyLeft", "justifyCenter", "justifyRight"], plugin);

});
