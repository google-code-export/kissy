
KISSY.Editor.add("plugins~smiley", function(E) {

    var TYPE = E.PLUGIN_TYPE;

    E.addPlugin("smiley", {
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
