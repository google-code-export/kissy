
KISSY.Editor.add("plugins~link", function(E) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = YAHOO.lang,
        isIE = YAHOO.env.ua.ie,
        TYPE = E.PLUGIN_TYPE, Range = E.Range,
        timeStamp = new Date().getTime(),

        DIALOG_CLS = "kissy-link-dialog",
        NEW_LINK_CLS = "kissy-link-dialog-newlink-mode",
        BTN_OK_CLS = "kissy-link-dialog-ok",
        BTN_CANCEL_CLS = "kissy-link-dialog-cancel",
        BTN_REMOVE_CLS = "kissy-link-dialog-remove",
        DEFAULT_HREF = "http://",

        DIALOG_TMPL = ['<form onsubmit="return false"><ul>',
                          '<li class="kissy-link-dialog-href"><label>{href}</label><input name="href" size="40" value="http://" type="text" /></li>',
                          '<li class="kissy-link-dialog-text"><label>{text}</label><input name="text" size="40" type="text" /></li>',
                          '<li class="kissy-link-dialog-target"><input name="target" id="target_"', timeStamp ,' type="checkbox" /> <label for="target_"', timeStamp ,'>{target}</label></li>',
                          '<li class="kissy-link-dialog-actions">',
                              '<button name="ok" class="', BTN_OK_CLS, '">{ok}</button>',
                              '<button name="cancel" class="', BTN_CANCEL_CLS ,'">{cancel}</button>',
                              '<span class="', BTN_REMOVE_CLS ,'">{remove}</span>',
                          '</li>',
                      '</ul></form>'].join("");

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
         * �����ı�
         */
        form: null,

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
        },

        /**
         * ���¼�
         */
        _bindUI: function() {
            var form = this.form, self = this;

            // ��ʾ/���ضԻ���ʱ���¼�
            Event.on(this.domEl, "click", function() {
                // TODO��������ʾʱ����
                self._syncUI();
            });

            // ע�����ť����¼�
            Event.on(this.dialog, "click", function(ev) {
                var target = Event.getTarget(ev);

                switch(target.className) {
                    case BTN_OK_CLS:
                        self._createLink(form.href.value, form.text.value, form.target.checked);
                        break;
                    case BTN_CANCEL_CLS: // ֱ������ð�ݣ��رնԻ���
                        break;
                    case BTN_REMOVE_CLS:
                        self._removeLink();
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
            var editor = this.editor,
                form = this.form,
                range = editor.getSelectionRange(),
                container = Range.getStartContainer(range),
                parentEl;

            // �޸�����
            if (container.nodeType == 3) { // TextNode
                parentEl = container.parentNode;
                if (parentEl.nodeName == "A") {
                    form.href.value = parentEl.href;
                    form.text.value = E.Dom.getText(parentEl);
                    form.target.checked = parentEl.target === "_blank";
                    Dom.removeClass(form, NEW_LINK_CLS);
                    return;
                }
            }

            // �½�����
            form.href.value = DEFAULT_HREF;
            form.text.value = Range.getSelectedText(range);
            Dom.addClass(form, NEW_LINK_CLS);
        },

        /**
         * ����/�޸�����
         */
        _createLink: function(href, text, target) {
            // href Ϊ��ʱ���Ƴ����ӡ� TODO: �Զ���� http ��ϸ�ڲ���������
            if (href.length < 7) {
                this._removeLink();
                return;
            }

            // text Ϊ��ʱ���Զ���Ϊ href ��ֵ
            if (!text) text = href;

            var editor = this.editor,
                range = editor.getSelectionRange(),
                container = Range.getStartContainer(range),
                parentEl;

            // �޸�����
            if (container.nodeType == 3) { // TextNode
                parentEl = container.parentNode;
                if (parentEl.nodeName == "A") {
                    parentEl.href = href;
                    parentEl.innerHTML = text;
                    if (target) {
                        parentEl.setAttribute("target", "_blank");
                    } else {
                        parentEl.removeAttribute("target");
                    }
                    return;
                }
            }

            // ��������
            var selectedText = Range.getSelectedText(range);
            if (!selectedText) {
                if (!isIE) {
                    var a = document.createElement("A");
                    a.innerHTML = text;
                    range.insertNode(a);
                } else {
                    range.pasteHTML('<a href="' + href + '">' + text + '</a>');
                }
            }
            editor.execCommand("createLink", href);
        },

        _removeLink: function() {
            this.editor.execCommand("unLink");
        }
    });

 });

// TODO:
// ��ѡ����������/һ���ְ�������ʱ�����ɵ��������ݵĵ��Ŵ���
// Ŀǰֻ�� Google Docs �����Ż��������༭�������������Ĭ�ϵĴ���ʽ��
// �ȼ��ڴˣ����Ժ��Ż���