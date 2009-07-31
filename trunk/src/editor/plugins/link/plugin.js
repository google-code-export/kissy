
KISSY.Editor.add("plugins~link", function(E) {

    var TYPE = E.PLUGIN_TYPE;

    E.addPlugin("link", {
        /**
         * ���ࣺ��ͨ��ť
         */
        type: TYPE.TOOLBAR_BUTTON,

        /**
         * ��Ӧ����
         * @param {KISSY.Editor} editor
         */
        fn: function(editor) {
            var lang = this.lang, val;

            // TODO
            // ����ϸ��
            val = window.prompt(lang.dialogMessage, "http://");
            editor.execCommand("createLink", val);
        }
    });

 });
