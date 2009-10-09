
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
                              '<p>尚未实现</p>', // TODO: 从相册中选择图片
                          '</div>',
                          '<div class="ks-editor-dialog-actions">',
                              '<button name="ok" class="', BTN_OK_CLS, '">{ok}</button>',
                              '<span class="', BTN_CANCEL_CLS ,'">{cancel}</span>',
                          '</div>',
                      '</form>'].join("");

    E.addPlugin("image", {
        /**
         * 种类：普通按钮
         */
        type: TYPE.TOOLBAR_BUTTON,

        /**
         * 关联的对话框
         */
        dialog: null,

        /**
         * 关联的表单
         */
        form: null,

        /**
         * 关联的 range 对象
         */
        range: null,

        /**
         * 初始化函数
         */
        init: function() {
            this._renderUI();
            this._bindUI();
        },

        /**
         * 初始化对话框界面
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
         * 绑定事件
         */
        _bindUI: function() {
            var dialog = this.dialog, form = this.form, self = this;

            // 显示/隐藏对话框时的事件
            Event.on(this.domEl, "click", function() {
                // 仅在显示时更新
                if (self.dialog.style.visibility === isIE ? "hidden" : "visible") { // 事件的触发顺序不同
                    self._syncUI();
                }
            });

            // tab 切换
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

            // 注册表单按钮点击事件
            Event.on(dialog, "click", function(ev) {
                var target = Event.getTarget(ev);

                switch(target.className) {
                    case BTN_OK_CLS:
                        self._insertImage(form["imageUrl"].value);
                        break;
                    case BTN_CANCEL_CLS: // 直接往上冒泡，关闭对话框
                        break;
                    default: // 点击在非按钮处，停止冒泡，保留对话框
                        Event.stopPropagation(ev);
                }
            });
        },

        /**
         * 更新界面上的表单值
         */
        _syncUI: function() {
            this.range = this.editor.getSelectionRange();
            this.form["imageUrl"].value = "";
        },

        /**
         * 插入图片
         */
        _insertImage: function(imageUrl) {
            imageUrl = Lang.trim(imageUrl);

            // url 为空时，不处理
            if (imageUrl.length === 0) {
                return;
            }

            var editor = this.editor,
                range = this.range,
                img;

            // 插入图片
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
