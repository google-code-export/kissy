
KISSY.Editor.add("plugins~source", function(E) {

    var Y = YAHOO.util, Dom = Y.Dom,
        UA = YAHOO.env.ua,
        TYPE = E.PLUGIN_TYPE,

        TOOLBAR_BUTTON_SELECTED = "ks-editor-toolbar-button-selected",
        SRC_MODE_CLS = "ks-editor-src-mode";

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

            // ��� class
            Dom.addClass(this.domEl, "ks-editor-toolbar-source-button");
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

            // [bug fix] ie7-�£��л���Դ��ʱ��iframe �Ĺ�껹�ɼ��������ص�
            if(UA.ie && UA.ie < 8) {
                editor.contentDoc.selection.empty();
            }

            // �л���ʾ
            this.textarea.style.display = srcOn ? "none" : "";
            this.iframe.style.display = srcOn ? "" : "none";

            // ����״̬
            editor.sourceMode = !srcOn;

            // ���°�ť״̬
            this._updateButtonState();
        },

        /**
         * ���°�ť״̬
         */
        _updateButtonState: function() {
            var editor = this.editor,
                srcOn = editor.sourceMode;

            if(srcOn) {
                Dom.addClass(editor.container, SRC_MODE_CLS);
                Dom.addClass(this.domEl, TOOLBAR_BUTTON_SELECTED);
            } else {
                Dom.removeClass(editor.container, SRC_MODE_CLS);
                Dom.removeClass(this.domEl, TOOLBAR_BUTTON_SELECTED);
            }
        }

    });

 });
