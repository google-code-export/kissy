
KISSY.Editor.add("plugins~link", function(E) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = YAHOO.lang,
        isIE = YAHOO.env.ua.ie,
        TYPE = E.PLUGIN_TYPE, Range = E.Range,
        timeStamp = new Date().getTime(),
        HREF_REG = /^\w+:\/\/.*|#.*$/,

        DIALOG_CLS = "ks-editor-link",
        NEW_LINK_CLS = "ks-editor-link-newlink-mode",
        BTN_OK_CLS = "ks-editor-btn-ok",
        BTN_CANCEL_CLS = "ks-editor-btn-cancel",
        BTN_REMOVE_CLS = "ks-editor-link-remove",
        DEFAULT_HREF = "http://",

        DIALOG_TMPL = ['<form onsubmit="return false"><ul>',
                          '<li class="ks-editor-link-href"><label>{href}</label><input name="href" size="40" value="http://" type="text" /></li>',
                          '<li class="ks-editor-link-target"><input name="target" id="target_"', timeStamp ,' type="checkbox" /> <label for="target_"', timeStamp ,'>{target}</label></li>',
                          '<li class="ks-editor-dialog-actions">',
                              '<button name="ok" class="', BTN_OK_CLS, '">{ok}</button>',
                              '<span class="', BTN_CANCEL_CLS ,'">{cancel}</span>',
                              '<span class="', BTN_REMOVE_CLS ,'">{remove}</span>',
                          '</li>',
                      '</ul></form>'].join("");

    E.addPlugin("link", {
        /**
         * ���ࣺ��ť
         */
        type: TYPE.TOOLBAR_DROP_BUTTON,

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
            if(isIE) this.domEl.focus(); // �ۼ�����ť�ϣ����ع�꣬���� ie �¹�����ʾ�ڲ�����

            var form = this.form,
                container = Range.getCommonAncestor(this.range),
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

            var range = this.range,
                container = Range.getCommonAncestor(range),
                containerIsA = container.nodeName === "A", // ��ͼƬ������
                parentEl = container.parentNode,
                parentIsA = parentEl && (parentEl.nodeName === "A"), // ��������
                a, div = document.createElement("div"), fragment;

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
            a = document.createElement("a");
            a.href = href;
            if (target) a.setAttribute("target", "_blank");

            if (isIE) {
                if ("text" in range) { // TextRange
                    if (range.select) range.select();

                    a.innerHTML = range.htmlText || href;
                    div.innerHTML = "";
                    div.appendChild(a);
                    range.pasteHTML(div.innerHTML);

                } else { // ControlRange
                    // TODO: ControlRange ���ӵ� target ʵ��
                    this.editor.execCommand("createLink", href);
                }

            } else { // W3C
                if(range.collapsed) {
                    a.innerHTML = href;
                }
                else {
                    fragment = range.cloneContents();
                    while(fragment.firstChild) {
                        a.appendChild(fragment.firstChild);
                    }
                }
                range.deleteContents(); // ɾ��ԭ����
                range.insertNode(a); // ��������
                range.selectNode(a); // ѡ������
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
                container = Range.getCommonAncestor(range),
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