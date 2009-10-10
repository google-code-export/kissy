
KISSY.Editor.add("config", function(E) {

    E.config = {
        /**
         * ����·��
         */
        base: "",

        /**
         * ����
         */
        language: "en",

        /**
         * ����
         */
        theme: "default",

        /**
         * Toolbar �Ϲ��ܲ��
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
        ],

        /**
         * Statusbar �ϵĲ��
         */
        statusbar: [
            "wordcount",
            "resize"
        ],

        /**
         * ���������
         */
        pluginsConfig: { }
    };

});
