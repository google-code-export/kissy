
KISSY.Editor.add("plugins~blockquote", function(E) {

    var TYPE = E.PLUGIN_TYPE;

    E.addPlugin("blockquote", {
        /**
         * ���ࣺ��ͨ��ť
         */
        type: TYPE.TOOLBAR_BUTTON,

        /**
         * ��Ӧ����
         */
        exec: function() {
            alert("todo");
        }
    });

 });
