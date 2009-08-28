
KISSY.Editor.add("plugins~link", function(E) {

    var TYPE = E.PLUGIN_TYPE,
        Lang = YAHOO.lang,

        DIALOG_CLS = "kissy-drop-menu-linkDialog",
        DIALOG_TMPL = '<ul>' +
                          '<li><label>{lang.href}<label><input class="kissy-linkDialog-href" onclick="this.select()" value="http://" type="text" /></li>' +
                          '<li><label>{lang.text}<label><input class="kissy-linkDialog-text" type="text" /></li>' +
                          '<li><input class="kissy-linkDialog-target" type="checkbox" /><label>{lang.target}</label></li>' +
                          '<li><button </li>' +
                      '</ul>'
            ;

    E.addPlugin("link", {
        /**
         * ���ࣺ��ͨ��ť
         */
        type: TYPE.TOOLBAR_BUTTON,

        /**
         * �����ĶԻ���
         */
        dialog: null,

        /**
         * ��ʼ������
         */
        init: function() {
            this._initDialog();
        },

        /**
         * ��ʼ���Ի���
         */
        _initDialog: function() {
            var dialog = E.Menu.generateDropMenu(this.editor, this.domEl, [1, 0]),
                lang = this.lang;

            dialog.className += " " + DIALOG_CLS;
            dialog.innerHTML = DIALOG_TMPL
                    .replace("{lang.href}", lang.href)
                    .replace("{lang.text}", lang.text)
                    .replace("{lang.target}", lang.target);

            this.dialog = dialog;
        },

        /**
         * ��Ӧ����
         */
        exec2: function() {
            var editor = this.editor,
                msg = this.lang.dialogMessage,
                url = "http://",
                range = editor.getSelectionRange(),
                container = range.startContainer || range.parentElement(),
                parentEl;

           if(container.nodeType == 3) { // TextNode
               parentEl = container.parentNode;
               if(parentEl.nodeName == "A") {
                   url = parentEl.href;
               }
           }

            url = Lang.trim(window.prompt(msg, url));

            if(url) {
                editor.execCommand("createLink", url);
            } else {
                editor.execCommand("unLink", url);
            }

            // TODO:
            // ��ѡ����������/һ���ְ�������ʱ�����ɵ��������ݵĵ��Ŵ���
            // Ŀǰֻ�� Google Docs �����Ż��������༭�������������Ĭ�ϵĴ���ʽ��
            // �ȼ��ڴˣ����Ժ��Ż���
        }
    });

 });
