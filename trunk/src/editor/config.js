
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
            "source",
            "",
            "undo", "redo",
            "",
            "fontName", "fontSize", "bold", "italic", "underline", "strikeThrough", "foreColor", "backColor",
            "",
            "link", "smiley", "image", "blockquote", 
            "",
            "insertOrderedList", "insertUnorderedList", "outdent", "indent", "justifyLeft", "justifyCenter", "justifyRight"
            //"",
            //"removeformat"
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
