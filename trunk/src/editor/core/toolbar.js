/**
 * module: toolbar
 */

(function(editor) {
    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = YAHOO.lang,
        isIE = YAHOO.env.ua.ie;

    editor.Toolbar = {

        /**
         * ���ݴ���ı༭��ʵ������ʼ��ʵ���Ĺ�����
         * @param {KISSY.Editor} instance
         */
        init: function(instance) {
            var toolbar = instance.toolbar,
                config = instance.config,
                lang = editor.lang[instance.lang],
                items = config.toolbar,
                i, len;

            for(i = 0, len = items.length; i < len; ++i) {
                
            }
        }


    };

})(KISSY.Editor);
