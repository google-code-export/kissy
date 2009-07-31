KISSY.Editor.add("core~range", function(E) {

    E.Range = {

        /**
         * ��ȡѡ������
         */
        getSelection: function(win) {
            var selection, doc = win.document;

            if (win.getSelection) { // W3C
                selection = win.getSelection();

            } else if (doc.selection) { // IE
                selection = doc.selection.createRange();
            }
            return selection;
        },

        /**
         * ��ȡѡ������� Range ����
         */
        getSelectionRange: function(win) {
            var range, selection = this.getSelection(win);

            if (selection.getRangeAt)
                range = selection.getRangeAt(0);

            else { // Safari! TODO: ������
                range = document.createRange();
                range.setStart(selection.anchorNode, selection.anchorOffset);
                range.setEnd(selection.focusNode, selection.focusOffset);
            }

            return range;
        }
    };

});
