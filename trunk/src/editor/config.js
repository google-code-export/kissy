
KISSY.Editor.add("config", function(E) {

    E.config = {
        /**
         * 基本路径
         */
        base: "",

        /**
         * 语言
         */
        language: "en",

        /**
         * 主题
         */
        theme: "default",

        /**
         * 表情，可以指定多套
         */
        smiley: ["default"],

        /**
         * Toolbar 上功能插件
         */
        toolbar: [
            "undo", "redo",
            "fontName", "fontSize", "bold", "italic", "underline", "strikeThrough", "foreColor", "backColor",
            "",
            "link", "smiley", "image", "blockquote", 
            "",
            "insertOrderedList", "insertUnorderedList", "outdent", "indent", "justifyLeft", "justifyCenter", "justifyRight",
            "",
            "removeformat", "maximize", "source"
        ]
    };

});
