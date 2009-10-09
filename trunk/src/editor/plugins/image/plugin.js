
KISSY.Editor.add("plugins~image", function(E) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = YAHOO.lang,
        isIE = YAHOO.env.ua.ie,
        TYPE = E.PLUGIN_TYPE,

        DIALOG_CLS = "ks-editor-image",
        BTN_OK_CLS = "ks-editor-btn-ok",
        BTN_CANCEL_CLS = "ks-editor-btn-cancel",
        TAB_CLS = "ks-editor-image-tabs",
        TAB_CONTENT_CLS = "ks-editor-image-tab-content",
        SELECTED_TAB_CLS = "ks-editor-image-tab-selected",
        TABS_TMPL = { local: '<li rel="local" class="' + SELECTED_TAB_CLS  + '">{tab_local}</li>',
                      link: '<li rel="link">{tab_link}</li>',
                      album: '<li rel="album">{tab_album}</li>'
                    },

        DIALOG_TMPL = ['<form onsubmit="return false">',
                          '<ul class="', TAB_CLS ,' ks-clearfix">',
                          '</ul>',
                          '<div class="', TAB_CONTENT_CLS, '" rel="local">',
                              '<label>{label_local}</label>',
                              '<input type="file" size="40" name="localPath" />',
                          '</div>',
                          '<div class="', TAB_CONTENT_CLS, '" rel="link" style="display: none">',
                              '<label>{label_link}</label>',
                              '<input name="imageUrl" size="50" />',
                          '</div>',
                          '<div class="', TAB_CONTENT_CLS, '" rel="album" style="display: none">',
                              '<label>{label_album}</label>',
                              '<p>��δʵ��</p>', // TODO: �������ѡ��ͼƬ
                          '</div>',
                          '<div class="ks-editor-dialog-actions">',
                              '<button name="ok" class="', BTN_OK_CLS, '">{ok}</button>',
                              '<span class="', BTN_CANCEL_CLS ,'">{cancel}</span>',
                          '</div>',
                      '</form>'].join("");

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
            var dialog = this.dialog, form = this.form, self = this;

            // ��ʾ/���ضԻ���ʱ���¼�
            Event.on(this.domEl, "click", function() {
                // ������ʾʱ����
                if (self.dialog.style.visibility === isIE ? "hidden" : "visible") { // �¼��Ĵ���˳��ͬ
                    self._syncUI();
                }
            });

            // tab �л�
            var tabs = Dom.getElementsByClassName(TAB_CLS, "ul", dialog)[0].childNodes,
                panels = Dom.getElementsByClassName(TAB_CONTENT_CLS, "div", dialog),
                len = tabs.length;
            Event.on(tabs, "click", function() {
                var j = 0;
                for(var i = 0; i < len; i++) {
                    Dom.removeClass(tabs[i], SELECTED_TAB_CLS);
                    panels[i].style.display = "none";
                    if(tabs[i] == this) j = i;
                }

                Dom.addClass(tabs[j], SELECTED_TAB_CLS);
                panels[j].style.display = "";
            });

            // ע�����ť����¼�
            Event.on(dialog, "click", function(ev) {
                var target = Event.getTarget(ev);

                switch(target.className) {
                    case BTN_OK_CLS:
                        self._insertImage(form["imageUrl"].value);
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
            this.form["imageUrl"].value = "";
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
