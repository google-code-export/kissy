
KISSY.Editor.add("plugins~wordcount", function(E) {

    var TYPE = E.PLUGIN_TYPE;

    E.addPlugin("wordcount", {
        /**
         * ���ࣺ״̬�����
         */
        type: TYPE.STATUSBAR_ITEM,

        /**
         * ��Ӧ����
         */
        exec: function() {
            alert("haha");
        }
    });

 });
