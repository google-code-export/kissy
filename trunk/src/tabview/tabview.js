/**
 * TabView
 * @module      tabview
 * @depends     yahoo-dom-event, kissy-core, triggerable
 */
KISSY.add("tabview", function(S) {

    var Y = YAHOO.util, Dom = Y.Dom, Lang = YAHOO.lang,
        CLS_PRE = "ks-tabview-",

        defaultConfig = {
            mackupType: 0, // mackup �����ͣ�ȡֵ���£�

            // 0 - Ĭ�Ͻṹ��ͨ�� nav �� content ����ȡ triggers �� panels
            navCls: CLS_PRE + "nav",
            contentCls: CLS_PRE + "content",

            // 1 - �ʶ����ṹ��ͨ�� cls ����ȡ triggers �� panels
            triggerCls: CLS_PRE + "trigger",
            panelCls: CLS_PRE + "panel",

            // 2 - ��ȫ���ɽṹ��ֱ�Ӵ��� triggers �� panels
            triggers: [],
            panels: [],

            // ��������
            triggerType: "mouse", // or "click"
            // �����ӳ�
            triggerDelay: 0.1, // 100ms

            activeIndex: 0, // Ϊ�˱�����˸��mackup��Ĭ�ϼ����Ӧ����� index һ��
            activeTriggerCls: CLS_PRE + "trigger-active"
        };

    /**
     * TabView
     * @constructor
     */
    function TabView(container, config) {
        // ʹ container ֧������
        if (Lang.isArray(container)) {
            for (var rets = [], i = 0, len = container.length; i < len; i++) {
                rets[rets.length] = new arguments.callee(container[i], config);
            }
            return rets;
        }

        // factory or constructor
        if (!(this instanceof arguments.callee)) {
            return new arguments.callee(container, config);
        }

        /**
         * ����
         * @type HTMLElement
         */
        this.container = Dom.get(container);

        /**
         * ���ò���
         * @type Object
         */
        this.config = S.merge(defaultConfig, config || {});

        /**
         * triggers
         * @type Array of HTMLElement
         */
        this.triggers = [];

        /**
         * panels
         * @type Array of HTMLElement
         */
        this.panels = [];

        /**
         * ��ǰ����� index
         * @type number
         */
        this.activeIndex = this.config.activeIndex;

        // init
        this._init();
    }

    S.mix(TabView.prototype, {

        /**
         * ��ʼ��
         * @protected
         */
        _init: function() {
            this._parseMackup();
            this._initTriggers();
        },

        /**
         * ���� mackup, ��ȡ triggers �� panels
         * @protected
         */
        _parseMackup: function() {
            var self = this,
                container = self.container, cfg = self.config,
                nav, content, triggers = [], panels = [], n, m, i, len,
                getElementsByClassName = Dom.getElementsByClassName;

            switch (cfg.mackupType) {
                case 0: // Ĭ�Ͻṹ
                    nav = getElementsByClassName(cfg.navCls, "*", container)[0];
                    content = getElementsByClassName(cfg.contentCls, "*", container)[0];
                    triggers = Dom.getChildren(nav);
                    panels = Dom.getChildren(content);
                    break;
                case 1: // �ʶ����
                    triggers = getElementsByClassName(cfg.triggerCls, "*", container);
                    panels = getElementsByClassName(cfg.panelCls, "*", container);
                    break;
                case 2: // ��ȫ����
                    triggers = cfg.triggers;
                    panels = cfg.panels;
                    break;
            }

            // �� triggers �� panels ����ƥ��
            n = triggers.length;
            m = panels.length;
            for(i = 0, len = n > m ? m : n; i < len; i++) {
                self.triggers.push(triggers[i]);
                self.panels.push(panels[i]);
            }
        }
    });

    S.augment(TabView, S.Triggerable);
    S.TabView = TabView;
});
