
KISSY.Editor.add("plugins~font", function(E) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event,
        UA = YAHOO.env.ua,
        TYPE = E.PLUGIN_TYPE,

        OPTION_ITEM_HOVER_CLS = "ks-editor-option-hover",
        SELECT_TMPL = '<ul class="ks-editor-select-list">{LI}</ul>',
        OPTION_TMPL = '<li class="ks-editor-option" data-value="{VALUE}">' +
                          '<span class="ks-editor-option-checkbox"></span>' +
                          '<span style="{STYLE}">{KEY}</span>' +
                      '</li>',
        OPTION_SELECTED = "ks-editor-option-selected";

    E.addPlugin(["fontName", "fontSize"], {
        /**
         * ���ࣺ�˵���ť
         */
        type: TYPE.TOOLBAR_SELECT,

        /**
         * ��ǰѡ��ֵ
         */
        selectedValue: "",

        /**
         * ѡ���ͷ��
         */
        selectHead: null,

        /**
         * ����������ѡ���б�
         */
        selectList: null,

        /**
         * �������������ѡ��ֵ
         */
        options: [],

        range: null,

        /**
         * ��ʼ��
         */
        init: function() {
            this.options = this.lang.options;
            this.selectHead = this.domEl.getElementsByTagName("span")[0];

            this._renderUI();
            this._bindUI();
        },

        _renderUI: function() {
            // ��ʼ�������� DOM
            this.selectList = E.Menu.generateDropMenu(this.editor, this.domEl, [1, 0]);
            this._renderSelectList();
        },

        _bindUI: function() {
            // ע��ѡȡ�¼�
            this._bindPickEvent();

            // ie �� range ����
            if(UA.ie) {
                var self = this;
                Event.on(this.domEl, "click", function() {
                    // ���� range, �Ա㻹ԭ
                    self.range = self.editor.getSelectionRange();

                    // �ۼ�����ť�ϣ����ع�꣬���� ie �¹�����ʾ�ڲ�����
                    // ע��ͨ�� blur / focus �ȷ�ʽ�� ie7- ����Ч
                    self.editor.contentDoc.selection.empty();
                });
            }
        },

        /**
         * ��ʼ�������� DOM
         */
        _renderSelectList: function() {
            var htmlCode = "", options = this.options,
                key, val;

            for(key in options) {
                val = options[key];

                htmlCode += OPTION_TMPL
                        .replace("{VALUE}", val)
                        .replace("{STYLE}", this._getOptionStyle(key, val))
                        .replace("{KEY}", key);
            }

            // ��ӵ� DOM ��
            this.selectList.innerHTML = SELECT_TMPL.replace("{LI}", htmlCode);

            // ��Ӹ��Ի� class
            Dom.addClass(this.selectList, "ks-editor-drop-menu-" + this.name);
        },

        /**
         * ��ȡɫ�¼�
         */
        _bindPickEvent: function() {
            var self = this;

            Event.on(this.selectList, "click", function(ev) {
                var target = Event.getTarget(ev);

                if(target.nodeName != "LI") {
                    target = Dom.getAncestorByTagName(target, "li");
                }
                if(!target) return;

                self._doAction(target.getAttribute("data-value"));
            });

            // ie6 �£�ģ�� hover
            if(UA.ie === 6) {
                var els = this.selectList.getElementsByTagName("li");
                Event.on(els, "mouseenter", function() {
                    Dom.addClass(this, OPTION_ITEM_HOVER_CLS);
                });
                Event.on(els, "mouseleave", function() {
                    Dom.removeClass(this, OPTION_ITEM_HOVER_CLS);
                });
            }
        },

        /**
         * ִ�в���
         */
        _doAction: function(val) {
            if(!val) return;

            // ���µ�ǰֵ
            this._setSelectedOption(val);

            // ��ԭѡ��
            var range = this.range;
            if(UA.ie && range.select) range.select();

            // ִ������
            this.editor.execCommand(this.name, this.selectedValue);
        },

        /**
         * ѡ��ĳһ��
         */
        _setSelectedOption: function(val) {
            this.selectedValue = val;

            // ���� head
            this.selectHead.innerHTML = this._getOptionKey(val);

            // ���� selectList �е�ѡ����
            if(val != this.text) {
                this._updateSelectedOption(val);
            }
        },

        _getOptionStyle: function(key, val) {
          if(this.name == "fontName") {
              return "font-family:" + val;
          } else { // font size
              return "font-size:" + key + "px";
          }
        },

        _getOptionKey: function(val) {
            var options = this.options, key;

            for(key in options) {
                if(options[key] == val) {
                    return key;
                }
            }
        },

        /**
         * �����������ѡ����
         */
        _updateSelectedOption: function(val) {
            var items = this.selectList.getElementsByTagName("li"),
                i, len = items.length, item;

            for(i = 0; i < len; ++i) {
                item = items[i];

                if(item.getAttribute("data-value") == val) {
                    Dom.addClass(item, OPTION_SELECTED);
                } else {
                    Dom.removeClass(item, OPTION_SELECTED);
                }
            }
        }
    });

});

// TODO
//  1. �� google, �Լ����¼���֧��
//  2. ���仯ʱ����̬���µ�ǰ������ʾֵ
//  3. ie �½ӹܣ������괦��ĳ��ǩ�ڣ��ı�����ʱ���ı�������α�ǩ������
