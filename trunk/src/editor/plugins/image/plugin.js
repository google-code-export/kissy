
KISSY.Editor.add("plugins~image", function(E) {

    var Y = YAHOO.util, Event = Y.Event, Lang = YAHOO.lang,
        isIE = YAHOO.env.ua.ie,
        TYPE = E.PLUGIN_TYPE,

        DIALOG_CLS = "kissy-image-dialog",
        BTN_OK_CLS = "kissy-image-dialog-ok",
        BTN_CANCEL_CLS = "kissy-image-dialog-cancel",

        DIALOG_TMPL = ['<form onsubmit="return false"><fieldset>',
                          '<legend>{web_legend}</legend>',
                          '<input name="imageUrl" size="50" />',
                          '<div class="kissy-dialog-buttons">',
                              '<button name="ok" class="', BTN_OK_CLS, '">{ok}</button>',
                              '<button name="cancel" class="', BTN_CANCEL_CLS ,'">{cancel}</button>',
                          '</div>',
                      '</fieldset></form>'].join("");

    E.addPlugin("image", {
        /**
         * ���ࣺ��ͨ��ť
         */
        type: TYPE.TOOLBAR_BUTTON,

        /**
         * �����ĶԻ���
         */
        dialog: null,

        /**
         * �����ı�
         */
        form: null,

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
            dialog.innerHTML = DIALOG_TMPL.replace(/\{([^}]+)\}/g, function(match, key) {
                return lang[key] ? lang[key] : key;
            });

            this.dialog = dialog;
            this.form = dialog.getElementsByTagName("form")[0];

            if(isIE) {
                E.Dom.setItemUnselectable(dialog);
            }
        },

        /**
         * ���¼�
         */
        _bindUI: function() {
            var form = this.form, self = this;

            // ��ʾ/���ضԻ���ʱ���¼�
            Event.on(this.domEl, "click", function() {
                // ������ʾʱ����
                if (self.dialog.style.visibility === isIE ? "hidden" : "visible") { // �¼��Ĵ���˳��ͬ
                    self._syncUI();
                }
            });

            // ע�����ť����¼�
            Event.on(this.dialog, "click", function(ev) {
                var target = Event.getTarget(ev);

                switch(target.className) {
                    case BTN_OK_CLS:
                        self._insertImage(form.imageUrl.value);
                        break;
                    case BTN_CANCEL_CLS: // ֱ������ð�ݣ��رնԻ���
                        break;
                    default: // ����ڷǰ�ť����ֹͣð�ݣ������Ի���
                        Event.stopPropagation(ev);
                }
            });
        },

        /**
         * ���½����ϵı�ֵ
         */
        _syncUI: function() {
            this.range = this.editor.getSelectionRange();
            this.form.imageUrl.value = "";
        },

        /**
         * ����ͼƬ
         */
        _insertImage: function(imageUrl) {
            imageUrl = Lang.trim(imageUrl);

            // url Ϊ��ʱ��������
            if (imageUrl.length === 0) {
                return;
            }

            var editor = this.editor,
                range = this.range,
                img;

            // ����ͼƬ
            if (!isIE) {
                img = document.createElement("img");
                img.src = imageUrl;
                img.setAttribute("title", "");
                range.insertNode(img);
            } else {
                range.select();
                editor.execCommand("insertImage", imageUrl);
            }
        }
    });

 });

// TODO:
//  1. ͼƬ�ϴ�����