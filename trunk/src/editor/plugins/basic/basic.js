
KISSY.Editor.add("basic", function(E) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, //Lang = YAHOO.lang,
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
         * @param {KISSY.Editor} editor
         */
        fn: function(editor) {
            editor.execCommand(this.name);
        }
    };


    E.plugins["foreColor,backColor"] = {
        /**
         * ���ࣺ��ͨ��ť + �˵���ť
         */
        type: TYPE.TOOLBAR_BUTTON | TYPE.TOOLBAR_MENU_BUTTON,

        /**
         * ����Լ��ĳ�ʼ������
         */
        init: function(editor) {
            var el = this.domEl,
                indicatorColor = (this.name == "foreColor") ? "rgb(0,0,0)" : "rgb(255,255,255)",
                caption = el.getElementsByTagName("span")[0].parentNode,
                dropdown = caption.nextSibling;

                Dom.addClass(el, "kissy-toolbar-color-button");
                caption.innerHTML = '<div class="kissy-toolbar-color-button-indicator" style="border-bottom-color:' + indicatorColor + '">'
                                   + caption.innerHTML
                                   + '</div>';

            // ��� caption ����
            Event.on(caption, "click", function() {
                editor.execCommand(this.name);
            });
            
            // ��� dropdown ����
            Event.on(dropdown, "click", function() {
               // TODO
               console.log("click dropdown");
            });
        }
    };

});
