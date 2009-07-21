
KISSY.Editor.add("basic", function(E) {

    var //Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = YAHOO.lang,
        //isIE = YAHOO.env.ua.ie,
        TYPE = E.PLUGIN_TYPE,
        buttons;

    buttons  = "bold,italic,underline,";
    buttons += "insertOrderedList,insertUnorderedList,";
    buttons += "outdent,indent,";
    buttons += "justifyLeft,justifyCenter,justifyRight";

    E.plugins[buttons] = {
        /**
         * ���ࣺ��ͨ��ť
         */
        type: TYPE.TOOLBAR_BUTTON,

        /**
         * ��Ӧ����
         * @param {object} p
         * @param {KISSY.Editor} editor
         */
        fn: function(p, editor) {
            editor.exec(p.name);
        }
    };


    E.plugins["foreColor,backColor"] = {
        /**
         * ���ࣺ��ͨ��ť + �˵���ť
         */
        type: TYPE.TOOLBAR_BUTTON | TYPE.TOOLBAR_MENU_BUTTON,

        /**
         * ���ʱ����Ӧ����
         */
        fn: function(p, editor) {
            editor.exec(p.name);
        },

        /**
         * ����Լ��ĳ�ʼ������
         */
        init: function(p, editor) {
            var el = p.domEl,
                span = el.getElementsByTagName("span")[0],
                caption = span.parentNode;

            
            
            
        }
    };

});
