/**
 * SlideView
 * @module      slideview
 * @creator     ��<lifesinger@gmail.com>, ����<mingcheng@taobao.com>
 * @depends     kissy-core, yui-base, triggerable
 */
KISSY.add("slideview", function(S) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = YAHOO.lang,
        BLOCK = "block", NONE = "none",
        OPACITY = "opacity", Z_INDEX = "z-index",
        RELATIVE = "relative", ABSOLUTE = "absolute",
        SCROLLX = "scrollx", SCROLLY = "scrolly", FADE ="fade",
        CLS_PREFIX = "ks-slideview-",

        defaultConfig = {
            // mackup �ǹ̶��ģ���� demo. nav �����Զ�����
            navCls: CLS_PREFIX + "nav",
            contentCls: CLS_PREFIX + "content",

            triggerType: "mouse", // or "click" ��������
            triggerDelay: 0.1, // �����ӳ�

            autoPlay: true,
            autoPlayInterval: 5, // �Զ����ż��ʱ��
            pauseOnMouseOver: true,  // triggerType Ϊ mouse ʱ�������ͣ�� slide ���Ƿ���ͣ�Զ�����

            effectType: NONE, // "scrollx", "scrolly", "fade"
            animDuration: .5, // �����л�Ч��ʱ���л���ʱ��
            animEasing: Y.Easing.easeNone, // easing method

            activeIndex: 0, // Ϊ�˱�����˸��mackup��Ĭ�ϼ����Ӧ����� index һ��
            activeTriggerCls: CLS_PREFIX + "trigger-active",

            panelSize: [] // ���� panel �Ŀ�ߡ�һ�㲻��Ҫ�趨��ֵ
            // ֻ�е��޷���ȷ��ȡ�߿�ʱ������Ҫ�趨
            // ���縸��Ԫ�� display: none ʱ���޷���ȡ�� offsetWidth, offsetHeight
        },

        // Ч����
        effects = {

            // �����ص���ʾ/����Ч��
            none: function(fromPanel, toPanel, callback) {
                fromPanel.style.display = NONE;
                toPanel.style.display = BLOCK;
                callback();
            },

            // ��������Ч��
            fade: function(fromPanel, toPanel, callback) {
                var self = this, cfg = self.config;
                if (self.anim) self.anim.stop();

                // ������ʾ��һ��
                Dom.setStyle(toPanel, OPACITY, 1);

                // �����л�
                self.anim = new Y.Anim(fromPanel, {opacity: {to: 0}}, cfg.animDuration, cfg.animEasing);
                self.anim.onComplete.subscribe(function() {
                    self.anim = null; // free

                    // �л� z-index
                    Dom.setStyle(toPanel, Z_INDEX, 9);
                    Dom.setStyle(fromPanel, Z_INDEX, 1);

                    callback();
                });
                self.anim.animate();
            },

            // ˮƽ/��ֱ����Ч��
            scroll: function(fromPanel, toPanel, callback, index) {
                var self = this, cfg = self.config,
                    isX = cfg.effectType === SCROLLX,
                    diff = self.panelSize[isX ? 0 : 1] * index,
                    attributes = {};

                attributes[isX ? "left" : "top"] = { to: -diff };

                if (self.anim) self.anim.stop();
                self.anim = new Y.Anim(self.content, attributes, cfg.animDuration, cfg.animEasing);
                self.anim.onComplete.subscribe(function() {
                    self.anim = null; // free
                    callback();
                });
                self.anim.animate();
            }
        };
    effects[SCROLLX] = effects[SCROLLY] = effects.scroll;

    /**
     * SlideView
     * @constructor
     */
    function SlideView(container, config) {
        var self = this;
        config = config || {};
        
        // factory or constructor
        if (!(self instanceof arguments.callee)) {
            return new arguments.callee(container, config);
        }

        /**
         * ����
         * @type HTMLElement
         */
        self.container = Dom.get(container);

        // ����Ч�����ͣ�����Ĭ������
        if (config.effectType === SCROLLX || config.effectType === SCROLLY) {
            defaultConfig.animDuration = .8;
            defaultConfig.animEasing = Y.Easing.easeOutStrong;
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
         * nav
         * @type HTMLElement
         */

        /**
         * content
         * @type HTMLElement
         */

        /**
         * panelSize
         * @type Array  [x, y]
         */
        self.panelSize = [];

        /**
         * ��ǰ����� index
         * @type number
         */
        self.activeIndex = self.config.activeIndex;

        /**
         * anim
         * @type YAHOO.util.Anim
         */

        /**
         * �Զ������Ƿ���ͣ
         * @type boolean
         */
        //self.paused = false;

        // init
        self._init();
    }

    S.mix(SlideView.prototype, {

        /**
         * ��ʼ��
         * @protected
         */
        _init: function() {
            var self = this, cfg = self.config;

            self._parseMackup();
            self._initStyle();
            self._initTriggers();

            if (cfg.autoPlay) self._initAutoPlay();
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

            content = getElementsByClassName(cfg.contentCls, "*", container)[0];
            panels = Dom.getChildren(content);
            nav = getElementsByClassName(cfg.navCls, "*", container)[0] || self._generateNavMackup(panels.length);
            triggers = Dom.getChildren(nav);

            // �� triggers �� panels ����ƥ��
            n = triggers.length;
            m = panels.length;
            for (i = 0,len = n > m ? m : n; i < len; i++) {
                self.triggers.push(triggers[i]);
                self.panels.push(panels[i]);
            }

            self.nav = nav;
            self.content = content;
        },

        /**
         * �Զ����� nav �� mackup
         * @protected
         */
        _generateNavMackup: function(len) {
            var self = this, cfg = self.config,
                ul = document.createElement("UL"), li, i;

            ul.className = cfg.navCls;
            for (i = 0; i < len; i++) {
                li = document.createElement("LI");
                if (i === self.activeIndex) {
                    li.className = cfg.activeTriggerCls;
                }
                li.innerHTML = i + 1;
                ul.appendChild(li);
            }

            self.container.appendChild(ul);
            return ul;
        },

        /**
         * ���� effectType��������ʼ״̬
         * @protected
         */
        _initStyle: function() {
            var self = this,
                cfg = self.config, type = cfg.effectType,
                panels = self.panels,
                i, len = self.triggers.length,
                activeIndex = self.activeIndex;

            // 1. ��ȡ�߿�
            self.panelSize[0] = cfg.panelSize[0] || panels[0].offsetWidth;
            self.panelSize[1] = cfg.panelSize[0] || panels[0].offsetHeight; // ���� panel �ĳߴ�Ӧ����ͬ
            // ���ָ����һ�� panel �� width �� height����Ϊ Safari �£�ͼƬδ����ʱ����ȡ�� offsetHeight ��ֵ�᲻��

            // 2. ��ʼ�� panels ��ʽ
            if (type === NONE) {
                // Ĭ�������ֻ��ʾ activePanel
                for (i = 0; i < len; i++) {
                    panels[i].style.display = i === activeIndex ? BLOCK : NONE;
                }

            } else { // type = scrollx, scrolly, fade

                // ��Щ��Ч��Ҫ�� panels ����ʾ����
                for (i = 0; i < len; i++) {
                    panels[i].style.display = BLOCK;
                }

                switch(type) {
                    // ����ǹ���Ч��
                    case SCROLLX:
                    case SCROLLY:
                        // ���ö�λ��Ϣ��Ϊ����Ч�����̵�
                        self.container.style.position = RELATIVE;
                        self.content.style.position = ABSOLUTE;

                        // ˮƽ����
                        if (type === SCROLLX) {
                            Dom.setStyle(panels, "float", "left");

                            // ��������ȣ��Ա�֤�пռ��� panels ˮƽ�Ų�
                            this.content.style.width = self.panelSize[0] * len + "px";
                        }
                    break;

                    // �����͸��Ч�������ʼ��͸��
                    case FADE:
                        for (i = 0; i < len; i++) {
                            Dom.setStyle(panels[i], OPACITY, i === self.activeIndex ? 1 : 0);
                            panels[i].style.position = ABSOLUTE;
                            panels[i].style.zIndex = i === self.activeIndex ? 9 : 1;
                        }
                    break;
                }
            }

            // 3. ��Ӧ�� CSS �container ��Ҫ���ø߿�� overflow: hidden
            //    nav �� cls �� CSS ָ��
        },

        /**
         * �����Զ�����
         * @protected
         */
        _initAutoPlay: function() {
            var self = this,
                cfg = self.config, max = self.panels.length - 1;

            // �����ͣ��ֹͣ�Զ�����
            if (cfg.pauseOnMouseOver) {
                Event.on([self.content, self.nav], "mouseenter", function() {
                    self.paused = true;
                });

                Event.on([self.content, self.nav], "mouseleave", function() {
                    self.paused = false;
                });
            }

            // �����Զ�����
            self.autoPlayTimer = Lang.later(cfg.autoPlayInterval * 1000, this, function() {
                if (self.paused) return;
                self.switchTo(self.activeIndex < max ? self.activeIndex + 1 : 0);
            }, null, true);
        },

        /**
         * �л�����
         * @protected
         */
        _switchContent: function(fromPanel, toPanel, index) {
            var self = this;

            effects[self.config.effectType].call(self, fromPanel, toPanel, function() {
                // fire onSwitch
                self.fireEvent("onSwitch", index);
            }, index);
        }
    });

    S.augment(SlideView, S.Triggerable, false);
    S.SlideView = SlideView;
});
