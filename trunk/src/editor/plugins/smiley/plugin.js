
KISSY.Editor.add("plugins~smiley", function(E) {

    var Y = YAHOO.util, Event = Y.Event, Lang = YAHOO.lang,
        isIE = YAHOO.env.ua.ie,
        TYPE = E.PLUGIN_TYPE,

        DIALOG_CLS = "ks-editor-smiley-dialog",
        ICONS_CLS = "ks-editor-smiley-icons",
        SPRITE_CLS = "ks-editor-smiley-sprite",

        defaultConfig = {
                tabs: ["default"]
            };

    E.addPlugin("smiley", {
        /**
         * ���ࣺ��ͨ��ť
         */
        type: TYPE.TOOLBAR_BUTTON,

        /**
         * ������
         */
        config: {},

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
            this.config = Lang.merge(defaultConfig, this.editor.config.pluginsConfig[this.name] || {});

            this._renderUI();
            this._bindUI();
        },

        /**
         * ��ʼ���Ի������
         */
        _renderUI: function() {
            var dialog = E.Menu.generateDropMenu(this.editor, this.domEl, [1, 0]);

            dialog.className += " " + DIALOG_CLS;
            this.dialog = dialog;
            this._renderDialog();

            if(isIE) E.Dom.setItemUnselectable(dialog);
        },

        _renderDialog: function() {
            var smileyConfig = E.Smilies[this.config["tabs"][0]], // TODO: ֧�ֶ�� tab
                mode = smileyConfig["mode"];

            if(mode === "icons") this._renderIcons(smileyConfig);
            else if(mode === "sprite") this._renderSprite(smileyConfig);

        },

        _renderIcons: function(config) {
            var base = this.editor.config.base + "smilies/" + config["name"] + "/",
                fileNames = config["fileNames"],
                fileExt = "." + config["fileExt"],
                cols = config["cols"],
                htmlCode = [],
                i, len = fileNames.length, name;

            htmlCode.push('<div class="' + ICONS_CLS + '">');
            for(i = 0; i < len; i++) {
                name = fileNames[i];

                htmlCode.push(
                        '<img src="' + base +  name + fileExt
                        + '" alt="' + name
                        + '" title="' + name
                        + '" />');

                if(i % cols === cols - 1) htmlCode.push("<br />");
            }
            htmlCode.push('</div');

            this.dialog.innerHTML = htmlCode.join("");
        },

        _renderSprite: function(config) {
            var base = config.base,
                filePattern = config["filePattern"],
                fileExt = "." + config["fileExt"],
                len = filePattern.end + 1,
                step = filePattern.step,
                i, code = [];

            code.push('<div class="' + SPRITE_CLS + ' ks-clearfix" style="' + config["spriteStyle"] + '">');
            for(i = 0; i < len; i += step) {
                code.push(
                        '<span data-icon="' + base +  i + fileExt
                        + '" style="' + config["unitStyle"] + '"></span>');
            }
            code.push('</div');

            this.dialog.innerHTML = code.join("");
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
                    case "SPAN":
                        self._insertImage(target.getAttribute("data-icon"), "");
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
