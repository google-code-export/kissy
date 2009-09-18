
KISSY.Editor.add("plugins~maximize", function(E) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event,
        TYPE = E.PLUGIN_TYPE,
        MAXIMIZE_MODE_CLS = "kissy-editor-maximize-mode";

    E.addPlugin("maximize", {
        /**
         * ���ࣺ��ͨ��ť
         */
        type: TYPE.TOOLBAR_BUTTON,

        /**
         * �༭������
         */
        container: null,

        /**
         * �����ĸ��ڵ�
         */
        containerParentNode: null,

        /**
         * ��ʼ��
         */
        init: function() {
            this.container = this.editor.container;
            this.containerParentNode = this.container.parentNode;
        },

        /**
         * ��Ӧ����
         */
        exec: function() {
            var container = this.container;

            if(Dom.hasClass(container, MAXIMIZE_MODE_CLS)) {
                this.containerParentNode.appendChild(container);
                Dom.removeClass(container, MAXIMIZE_MODE_CLS);
            } else {
                document.body.appendChild(container);
                Dom.addClass(container, MAXIMIZE_MODE_CLS);
            }

        }
    });

 });
