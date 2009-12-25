/**
 * TabView
 * @module      tabview
 * @creator     ��<lifesinger@gmail.com>, ��ǫ<yunqian@taobao.com>
 * @depends     yahoo-dom-event, kissy-core, triggerable
 */
KISSY.add("tabview", function(S) {

    var Y = YAHOO.util, Dom = Y.Dom, Lang = YAHOO.lang,
        CLS_PREFIX = "ks-tabview-",

        defaultConfig = {
            mackupType: 0, // mackup �����ͣ�ȡֵ���£�

            // 0 - Ĭ�Ͻṹ��ͨ�� nav �� content ����ȡ triggers �� panels
            navCls: CLS_PREFIX + "nav",
            contentCls: CLS_PREFIX + "content",

            // 1 - �ʶ����ṹ��ͨ�� cls ����ȡ triggers �� panels
            triggerCls: CLS_PREFIX + "trigger",
            panelCls: CLS_PREFIX + "panel",

            // 2 - ��ȫ���ɽṹ��ֱ�Ӵ��� triggers �� panels
            triggers: [],
            panels: [],

            // ��������
            triggerType: "mouse", // or "click"
            // �����ӳ�
            triggerDelay: 0.1, // 100ms

            activeIndex: 0, // Ϊ�˱�����˸��mackup��Ĭ�ϼ����Ӧ����� index һ��
            activeTriggerCls: CLS_PREFIX + "trigger-active"
        };

    /**
     * TabView
     * @constructor
     */
    function TabView(container, config) {
        var self = this;
        
        // ʹ container ֧������
        if (Lang.isArray(container)) {
            for (var rets = [], i = 0, len = container.length; i < len; i++) {
                rets[rets.length] = new arguments.callee(container[i], config);
            }
            return rets;
        }

        // factory or constructor
        if (!(self instanceof arguments.callee)) {
            return new arguments.callee(container, config);
        }

        /**
         * ����
         * @type HTMLElement
         */
        self.container = Dom.get(container);

        // ����������Ϣ���Զ�����Ĭ������
        if(config.triggerCls) {
            defaultConfig.mackupType = 1;
        } else if(config.triggers) {
            defaultConfig.mackupType = 2;
        }

        /**
         * ���ò���
         * @type Object
         */
        self.config = S.merge(defaultConfig, config || {});

        /**
         * triggers
         * @type Array of HTMLElement
         */
        self.triggers = [];

        /**
         * panels
         * @type Array of HTMLElement
         */
        self.panels = [];

        /**
         * ��ǰ����� index
         * @type number
         */
        self.activeIndex = self.config.activeIndex;

        // init
        self._init();
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

    S.augment(TabView, S.Triggerable, false);    
    S.TabView = TabView;
});
