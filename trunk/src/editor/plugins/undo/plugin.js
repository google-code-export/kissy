
KISSY.Editor.add("plugins~undo", function(E) {

    var TYPE = E.PLUGIN_TYPE;

    E.addPlugin(["undo", "redo"], {
        /**
         * ���ࣺ��ͨ��ť
         */
        type: TYPE.TOOLBAR_BUTTON,

        /**
         * ��Ӧ����
         */
        exec: function() {
            // TODO �ӹ�
            this.editor.execCommand(this.name);
        }
    });

 });

/**
 * TODO:
 *   - ie �£�ֻҪ�� dom ������undo �� redo �ͻ�ʧЧ��
 *     http://swik.net/qooxdoo/qooxdoo+news/Clashed+with+IE%E2%80%99s+execCommand/cj7g7
 */