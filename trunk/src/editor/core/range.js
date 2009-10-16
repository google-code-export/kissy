KISSY.Editor.add("core~range", function(E) {

    var isIE = YAHOO.env.ua.ie;

    E.Range = {

        /**
         * ��ȡѡ���������
         */
        getSelectionRange: function(win) {
            var doc = win.document,
                selection, range;

            if (win.getSelection) { // W3C
                selection = win.getSelection();

                if (selection.getRangeAt) {
                    range = selection.getRangeAt(0);

                } else { // for Old Webkit! �߰汾���Ѿ�֧�� getRangeAt
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
         * ��ȡ����
         */
        getCommonAncestor: function(range) {
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
        },

        /**
         * ����ѡ�� for ie
         */
        saveRange: function(editor) {
            // 1. ���� range, �Ա㻹ԭ
            isIE && editor.contentWin.focus(); // ȷ���������� range �Ǳ༭����ģ����� [Issue 39]

            // 2. �ۼ�����ť�ϣ����ع�꣬���� ie �¹�����ʾ�ڲ�����
            // ͨ�� blur / focus �ȷ�ʽ�� ie7- ����Ч
            // ע�⣺2 �� 1 ��ͻ��Ȩ�⿼�ǣ�����ȡ��2
            //isIE && editor.contentDoc.selection.empty();

            return editor.getSelectionRange();
        }
    };

});
