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
        }
    };

});
