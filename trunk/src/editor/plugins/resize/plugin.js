
KISSY.Editor.add("plugins~resize", function(E) {

    var Y = YAHOO.util, Event = Y.Event,
        UA = YAHOO.env.ua,
        TYPE = E.PLUGIN_TYPE,

        TMPL = '<span class="ks-editor-resize-larger" title="{larger_title}">{larger_text}</span>'
             + '<span class="ks-editor-resize-smaller" title="{smaller_title}">{smaller_text}</span>';


    E.addPlugin("resize", {

        /**
         * ���ࣺ״̬�����
         */
        type: TYPE.STATUSBAR_ITEM,

        contentEl: null,

        currentHeight: 0,

        /**
         * ��ʼ��
         */
        init: function() {
            this.contentEl = this.editor.container.childNodes[1];
            this.currentHeight = parseInt(this.contentEl.style.height);

            this.renderUI();
            this.bindUI();
        },

        renderUI: function() {
            var lang = this.lang;

            this.domEl.innerHTML = TMPL.replace(/\{([^}]+)\}/g, function(match, key) {
                            return lang[key] ? lang[key] : key;
                        });
        },

        bindUI: function() {
            var spans = this.domEl.getElementsByTagName("span"),
                largerEl = spans[0],
                smallerEl = spans[1],
                contentEl = this.contentEl;

            Event.on(largerEl, "click", function() {
                this.currentHeight += 100;
                this._doResize();
            }, this, true);

            Event.on(smallerEl, "click", function() {

                // ����С�� 0
                if (this.currentHeight < 100) {
                    this.currentHeight = 0;
                } else {
                    this.currentHeight -= 100;
                }

                this._doResize();
            }, this, true);
        },

        _doResize: function() {
            this.contentEl.style.height = this.currentHeight + "px";

            // ����ͨ������ textarea �� height: 100% �Զ�����Ӧ�߶���
            // �� ie7- �� css ���������⣬��˸ɴ����������� js �㶨
            this.editor.textarea.style.height = this.currentHeight + "px";
        }

    });

 });

/**
 * TODO:
 *   - ��ȫ���༭Ҳ����˴�
 */