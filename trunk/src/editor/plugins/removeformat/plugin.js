KISSY.Editor.add("plugins~removeformat", function(E) {

    var Y = YAHOO.util, Dom = Y.Dom,
        Range = E.Range,
        TYPE = E.PLUGIN_TYPE,

        FORMAT_TAGS_REG = /^(b|big|code|del|dfn|em|font|i|ins|kbd|q|samp|small|span|strike|strong|sub|sup|tt|u|var)$/g,
        FORMAT_ATTRS = ["class","style","lang","width","height","align","hspace","valign"];

    E.addPlugin("removeformat", {
        /**
         * ���ࣺ��ͨ��ť
         */
        type: TYPE.TOOLBAR_BUTTON,

        /**
         * ��Ӧ����
         */
        exec: function() {
            var editor = this.editor,
                range = editor.getSelectionRange(),
                parentEl = E.Range.getContainer(range);
            if (!parentEl) return;

            alert("����ʵ����");

        }
    });
});
