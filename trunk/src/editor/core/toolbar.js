
KISSY.Editor.add("toolbar", function(E) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = YAHOO.lang,
        isIE = YAHOO.env.ua.ie,
        TOOLBAR_BUTTON_TMPL =  '',
        TOOLBAR_SEPARATOR_TMPL = '<div class="kissy-toolbar-separator"></div>';

    TOOLBAR_BUTTON_TMPL += '<div class="kissy-toolbar-button" title="{TITLE}">';
    TOOLBAR_BUTTON_TMPL += '    <div class="kissy-toolbar-button-outer-box">';
    TOOLBAR_BUTTON_TMPL += '        <div class="kissy-toolbar-button-inner-box">';
    TOOLBAR_BUTTON_TMPL += '            <span class="kissy-toolbar-item kissy-toolbar-{NAME}">{TEXT}</span>';
    TOOLBAR_BUTTON_TMPL += '        </div>';
    TOOLBAR_BUTTON_TMPL += '    </div>';
    TOOLBAR_BUTTON_TMPL += '</div>';


    E.Toolbar = {

        /**
         * ���ݴ���ı༭��ʵ������ʼ��ʵ���Ĺ�����
         * @param {KISSY.Editor} editor
         */
        init: function(editor) {
            var toolbar = editor.toolbar,
                config = editor.config,
                lang = E.lang[config.language],
                items = config.toolbar,
                i, len, item, name,
                div = document.createElement("div");

            for(i = 0, len = items.length; i < len; ++i) {
                name = items[i];

                if (name) {

                    item = {
                        name      : name, // bold
                        text      : lang[name].text, // Bold
                        title     : lang[name].title // Bold (Ctrl+B)
                    };

                    div.innerHTML = TOOLBAR_BUTTON_TMPL
                            .replace("{TITLE}", item.title)
                            .replace("{NAME}", item.name)
                            .replace("{TEXT}", item.text);
                    
                } else {
                    div.innerHTML = TOOLBAR_SEPARATOR_TMPL;
                }

                toolbar.appendChild(div.firstChild);
            }
        }
    };

});
