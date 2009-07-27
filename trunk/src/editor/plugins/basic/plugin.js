
KISSY.Editor.add("plugins~base", function(E) {

    var TYPE = E.PLUGIN_TYPE,
        buttons  = "bold,italic,underline,strikeThrough," +
                   "insertOrderedList,insertUnorderedList," +
                   "outdent,indent," +
                   "justifyLeft,justifyCenter,justifyRight";

    E.addPlugin(buttons.split(","), {
        /**
         * 种类：普通按钮
         */
        type: TYPE.TOOLBAR_BUTTON,

        /**
         * 响应函数
         * @param {KISSY.Editor} editor
         */
        fn: function(editor) {
            editor.execCommand(this.name);
        }
    });

 });
