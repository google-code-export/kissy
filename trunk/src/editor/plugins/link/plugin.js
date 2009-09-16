
KISSY.Editor.add("plugins~link", function(E) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = YAHOO.lang,
        isIE = YAHOO.env.ua.ie,
        TYPE = E.PLUGIN_TYPE, Range = E.Range,
        timeStamp = new Date().getTime(),
        HREF_REG = /^\w+:\/\/.*|#.*$/,

        DIALOG_CLS = "kissy-link-dialog",
        NEW_LINK_CLS = "kissy-link-dialog-newlink-mode",
        BTN_OK_CLS = "kissy-link-dialog-ok",
        BTN_CANCEL_CLS = "kissy-link-dialog-cancel",
        BTN_REMOVE_CLS = "kissy-link-dialog-remove",
        DEFAULT_HREF = "http://",

        DIALOG_TMPL = ['<form onsubmit="return false"><ul>',
                          '<li class="kissy-link-dialog-href"><label>{href}</label><input name="href" size="40" value="http://" type="text" /></li>',
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
                if(self.dialog.style.visibility === isIE ? "hidden" : "visible") { // �¼��Ĵ���˳��ͬ
                    self._syncUI();
                }
            });

            // ע�����ť����¼�
            Event.on(this.dialog, "click", function(ev) {
                var target = Event.getTarget(ev);

                switch(target.className) {
                    case BTN_OK_CLS:
                        self._createLink(form.href.value, form.target.checked);
                        break;
                    case BTN_CANCEL_CLS: // ֱ������ð�ݣ��رնԻ���
                        break;
                    case BTN_REMOVE_CLS:
                        self._unLink();
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

            var form = this.form,
                container = Range.getStartContainer(this.range),
                containerIsA = container.nodeName === "A", // ͼƬ������
                parentEl = container.parentNode,
                parentIsA = parentEl && (parentEl.nodeName === "A"), // ��������
                a;

            // �޸����ӽ���
            if (containerIsA || parentIsA) {
                a = containerIsA ? container : parentEl;
                form.href.value = a.href;
                form.target.checked = a.target === "_blank";
                Dom.removeClass(form, NEW_LINK_CLS);
                return;
            }

            // �½����ӽ���
            form.href.value = DEFAULT_HREF;
            form.target.checked = false;
            Dom.addClass(form, NEW_LINK_CLS);
        },

        /**
         * ����/�޸�����
         */
        _createLink: function(href, target) {
            href = this._getValidHref(href);

            // href Ϊ��ʱ���Ƴ�����
            if (href.length === 0) {
                this._unLink();
                return;
            }

            var editor = this.editor,
                range = this.range,
                container = Range.getStartContainer(range),
                containerIsA = container.nodeName === "A", // ��ͼƬ������
                parentEl = container.parentNode,
                parentIsA = parentEl && (parentEl.nodeName === "A"), // ��������
                a;

            // �޸�����
            if (containerIsA || parentIsA) {
                a = containerIsA ? container : parentEl;
                a.href = href;
                if (target) {
                    a.setAttribute("target", "_blank");
                } else {
                    a.removeAttribute("target");
                }
                return;
            }

            // ��������
            var selectedText = Range.getSelectedText(range);
            if (container.nodeType == 3 && !selectedText) { // �ı�����
                if (!isIE) {
                    a = document.createElement("A");
                    a.innerHTML = href;
                    range.insertNode(a);
                } else {
                    range.pasteHTML('<a href="' + href + '">' + href + '</a>');
                }
            } else {
                if(range.select) range.select();
                editor.execCommand("createLink", href);
            }
        },

        _getValidHref: function(href) {
            href = Lang.trim(href);
            if(href && !HREF_REG.test(href)) { // ��Ϊ�� �� �����ϱ�׼ģʽ abcd://efg
               href = DEFAULT_HREF + href; // ���Ĭ��ǰ׺
            }
            return href;
        },

        /**
         * �Ƴ�����
         */
        _unLink: function() {
            var editor = this.editor,
                range = this.range,
                selectedText = Range.getSelectedText(range),
                container = Range.getStartContainer(range),
                parentEl;

            // û��ѡ������ʱ
            if (!selectedText && container.nodeType == 3) {
                parentEl = container.parentNode;
                if (parentEl.nodeName == "A") {
                    parentEl.parentNode.replaceChild(container, parentEl);
                }
            } else {
                if(range.select) range.select();
                editor.execCommand("unLink", null);
            }
        }
    });

 });

// TODO:
// ��ѡ����������/һ���ְ�������ʱ�����ɵ��������ݵĵ��Ŵ���
// Ŀǰֻ�� Google Docs �����Ż��������༭�������������Ĭ�ϵĴ���ʽ��
// �ȼ��ڴˣ����Ժ��Ż���

/**
 * Notes:
 *  1. �� ie �£�����������ϵİ�ťʱ���ᵼ�� iframe �༭����� range ѡ����ʧ������취�ǣ�
 *     ������Ԫ����� unselectable ���ԡ����ǣ����� text input ��Ϊ�������룬������ unselectable
 *     ���ԡ���͵�����ì�ܡ���ˣ�Ȩ��֮��Ľ���취�ǣ��ڶԻ��򵯳�ǰ���� range ���󱣴�������
 *     ��ʧ����ͨ�� range.select() ѡ���������������Ѿ���������
 *  2. Ŀǰֻ�� CKEditor �� TinyMCE ����ȫ�ӹ������ı༭������ú��������� 1 �Ľ��������Ŀǰ�Ѿ�
 *     ���ã��ɱ�Ҳ�ܵ͡�
 */