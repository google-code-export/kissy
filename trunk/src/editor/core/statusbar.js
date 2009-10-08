
KISSY.Editor.add("core~statusbar", function(E) {

    var Y = YAHOO.util, Lang = YAHOO.lang,
        isIE = YAHOO.env.ua.ie,

        SEP_TMPL = '<div class="ks-editor-stripbar-sep kissy-inline-block"></div>',
        ITEM_TMPL = '<div class="ks-editor-statusbar-item ks-editor-{NAME} ks-inline-block"></div>',

        div = document.createElement("div"); // ͨ�� el ����

    E.Statusbar = function(editor) {

        /**
         * ������ı༭��ʵ��
         */
        this.editor = editor;

        /**
         * �����������
         */
        this.config = editor.config;

        /**
         * ��ǰ����
         */
        this.lang = E.lang[this.config.language];
    };
    
    Lang.augmentObject(E.Statusbar.prototype, {

        /**
         * ��ʼ��
         */
        init: function() {
            var items = this.config.statusbar,
                plugins = this.editor.plugins,
                key;

            // ����������ҵ���ز�������ӵ���������
            for (var i = 0, len = items.length; i < len; ++i) {
                key = items[i];
                if (key) {
                    if (!(key in plugins)) continue; // ���������У������صĲ�����ޣ�ֱ�Ӻ���

                    // ��Ӳ����
                    this._addItem(plugins[key]);

                } else { // ��ӷָ���
                    this._addSep();
                }
            }
        },

        /**
         * ��ӹ�������
         */
        _addItem: function(p) {
            var el, lang = this.lang;

            // �� plugin û������ lang ʱ������Ĭ����������
            // TODO: �����ع��� instance ģ�����Ϊ lang ����ʵ�����
            if (!p.lang) p.lang = Lang.merge(lang["common"], this.lang[p.name] || {});

            // ����ģ�幹�� DOM
            div.innerHTML = ITEM_TMPL.replace("{NAME}", p.name);

            // �õ� domEl
            p.domEl = el = div.firstChild;

            // ��ӵ�������
            this._addToStatusbar(el);

            // ���ò���Լ��ĳ�ʼ�����������ǲ���ĸ��Ի��ӿ�
            // init ������ӵ����������棬���Ա�֤ DOM ��������ȡ region �Ȳ�������ȷ��
            p.editor = this.editor; // �� p ���� editor ����
            if (p.init) {
                p.init();
            }

            // ���Ϊ�ѳ�ʼ�����
            p.inited = true;
        },

        /**
         * ��ӷָ���
         */
        _addSep: function() {
            div.innerHTML = SEP_TMPL;
            this._addToStatusbar(div.firstChild);
        },

        /**
         * �� item �� �ָ��� ��ӵ�״̬��
         */
        _addToStatusbar: function(el) {
            if(isIE) el = E.Dom.setItemUnselectable(el);
            this.domEl.appendChild(el);
        }
    });

});
