
KISSY.Editor.add("plugins~smiley", function(E) {

    var TYPE = E.PLUGIN_TYPE;

    E.addPlugin("smiley", {
        /**
         * ���ࣺ��ͨ��ť
         */
        type: TYPE.TOOLBAR_BUTTON,

        /**
         * ��Ӧ����
         * @param {KISSY.Editor} editor
         */
        exec: function(editor) {
            alert("todo");
        }
    });

 });
