
KISSY.Editor.add("plugins~smiley", function(E) {

    var Y = YAHOO.util, Event = Y.Event, Lang = YAHOO.lang,
        isIE = YAHOO.env.ua.ie,
        TYPE = E.PLUGIN_TYPE,

        DIALOG_CLS = "kissy-smiley-dialog",
        DIALOG_TMPL = '<div class="kissy-smiley-icons">{icons}</div>';

    E.addPlugin("smiley", {
        /**
         * ���ࣺ��ͨ��ť
         */
        type: TYPE.TOOLBAR_BUTTON,

        /**
         * �����ĶԻ���
         */
        dialog: null,

        /**
         * ������ range ����
         */
        range: null,

        /**
         * ��ʼ������
         */
        init: function() {
            this._renderUI();
            this._bindUI();
        },

        /**
         * ��ʼ���Ի������
         */
        _renderUI: function() {
            var dialog = E.Menu.generateDropMenu(this.editor, this.domEl, [1, 0]),
                lang = this.lang;

            dialog.className += " " + DIALOG_CLS;
            dialog.innerHTML = DIALOG_TMPL
                    .replace("{icons}", this._getIconsList());

            this.dialog = dialog;

            if(isIE) {
                E.Dom.setItemUnselectable(dialog);
            }
        },

        _getIconsList: function() {
            var config = this.editor.config,
                smileyName = config.smiley,
                base = config.base + "smilies/" + smileyName + "/",
                smiley = E.Smilies[smileyName],
                fileNames = smiley["fileNames"],
                fileExt = "." + smiley["fileExt"],
                code = [],
                i, len = fileNames.length, name;

            for(i = 0; i < len; i++) {
                name = fileNames[i];

                code.push(
                        '<img src="' + base +  name + fileExt
                        + '" alt="' + name
                        + '" title="' + name
                        + '" />');

                // TODO: �� 5 ������
                if(i % 5 === 4) code.push("<br />");
            }

            return code.join("");
        },

        /**
         * ���¼�
         */
        _bindUI: function() {
            var self = this;

            // ע�����ť����¼�
            Event.on(this.dialog, "click", function(ev) {
                var target = Event.getTarget(ev);

                switch(target.nodeName) {
                    case "IMG":
                        self._insertImage(target.src, target.getAttribute("alt"));
                        break;
                    default: // ����ڷǰ�ť����ֹͣð�ݣ������Ի���
                        Event.stopPropagation(ev);
                }
            });
        },

        /**
         * ����ͼƬ
         */
        _insertImage: function(url, alt) {
            url = Lang.trim(url);

            // url Ϊ��ʱ��������
            if (url.length === 0) {
                return;
            }

            var editor = this.editor,
                range = editor.getSelectionRange(),
                img;

            // ����ͼƬ
            if (!isIE) {
                img = document.createElement("img");
                img.src = url;
                img.setAttribute("alt", alt);
                range.insertNode(img);
            } else {
                editor.execCommand("insertImage", url);
            }
        }
    });

 });

// TODO:
//  1. ���ױ���֧��
//  2. ����Ķ������֧�֣����� alt �� title ��Ϣ
