/**
 * SlideView
 * @module      slideview
 * @creator     �Ա�ǰ�˼ܹ��з���
 * @depends     kissy-core, yahoo-dom-event
 */
KISSY.add("slideview", function(S) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = YAHOO.lang,
        BLOCK = "block", NONE = "none",
        OPACITY = "opacity", Z_INDEX = "z-index",
        RELATIVE = "relative", ABSOLUTE = "absolute",
        CLS_PREFIX = "ks-slideview-",
        TYPES = { NONE: "none", SCROLLX: "scrollx", SCROLLY: "scrolly", FADE: "fade" },

        defaultConfig = {
            // mackup �ǹ̶��ģ���� demo. nav �����Զ�����
            navCls: CLS_PREFIX + "nav",
            contentCls: CLS_PREFIX + "content",

            triggerType: "mouse", // or "click" ��������
            triggerDelay: 0.1, // �����ӳ�

            autoPlay: true,
            autoPlayInterval: 5, // �Զ����ż��ʱ��
            pauseOnMouseOver: true,  // triggerType Ϊ mouse ʱ�������ͣ�� slide ���Ƿ���ͣ�Զ�����

            effectType: TYPES.NONE, // "scrollx", "scrolly", "fade"
            animDuration: .5, // �����л�Ч��ʱ���л���ʱ��
            animEasing: Y.Easing && Y.Easing.easeNone, // easing method

            activeIndex: 0, // Ϊ�˱�����˸��mackup��Ĭ�ϼ����Ӧ����� index һ��
            activeTriggerCls: CLS_PREFIX + "trigger-active",

            panelSize: [] // ���� panel �Ŀ�ߡ�һ�㲻��Ҫ�趨��ֵ
            // ֻ�е��޷���ȷ��ȡ�߿�ʱ������Ҫ�趨
            // ���縸��Ԫ�� display: none ʱ���޷���ȡ�� offsetWidth, offsetHeight
        },

        // Ч����
        effects = {

            // �����ص���ʾ/����Ч��
            none: function(fromPanel, toPanel) {
                fromPanel.style.display = NONE;
                toPanel.style.display = BLOCK;
            },

            // ��������Ч��
            fade: function(fromPanel, toPanel) {
                var self = this, cfg = self.config;

                // ���� z-index
                Dom.setStyle(toPanel, Z_INDEX, 1);
                Dom.setStyle(fromPanel, Z_INDEX, 9);

                // ������ʾ��һ��
                Dom.setStyle(toPanel, OPACITY, 1);

                // ����Ч��
                self.anim = new Y.Anim(fromPanel, { opacity: { to: 0 } }, cfg.animDuration, cfg.animEasing);
                self.anim.onComplete.subscribe(function() {
                    self.anim = null; // free
                    
                    // ��������ȷ
                    Dom.setStyle(toPanel, Z_INDEX, 9);
                    Dom.setStyle(fromPanel, Z_INDEX, 1);
                });
                self.anim.animate();
            },

            // ˮƽ/��ֱ����Ч��
            scroll: function(fromPanel, toPanel, index, isX) {
                var self = this, cfg = self.config,
                    diff = self.panelSize[isX ? 0 : 1] * index,
                    attributes = {};

                attributes[isX ? "left" : "top"] = { to: -diff };
                self.anim = new Y.Anim(self.content, attributes, cfg.animDuration, cfg.animEasing);
                self.anim.onComplete.subscribe(function() {
                    self.anim = null; // free
                });
                self.anim.animate();
            }
        };
    effects[TYPES.SCROLLX] = effects[TYPES.SCROLLY] = effects.scroll;

    /**
     * SlideView
     * @constructor
     */
    function SlideView(container, config) {
        // factory or constructor
        if (!(this instanceof arguments.callee)) {
            return new arguments.callee(container, config);
        }

        /**
         * ����
         * @type HTMLElement
         */
        this.container = Dom.get(container);

        // ����Ч�����ͣ�����Ĭ������
        if (config.effectType === TYPES.SCROLLX || config.effectType === TYPES.SCROLLY) {
            defaultConfig.animDuration = .8;
            defaultConfig.animEasing = Y.Easing && Y.Easing.easeOutStrong;
        }

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
        this.panelSize = [];

        /**
         * ��ǰ����� index
         * @type number
         */
        this.activeIndex = this.config.activeIndex;

        /**
         * anim
         * @type YAHOO.util.Anim
         */

        /**
         * �Զ������Ƿ���ͣ
         */
        this.autoPlayIsPaused = false;

        // init
        this._init();
    }

    S.augment(SlideView, S.Triggerable);

    S.mix(SlideView.prototype, {

        /**
         * ��ʼ��
         * @protected
         */
        _init: function() {
            var self = this;

            self._parseMackup();
            self._initStyle();
            self._initTriggers();

            if (self.config.autoPlay) {
                self._initAutoPlay();
            }
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
            if (type === TYPES.NONE) {
                // Ĭ�������ֻ��ʾ activePanel
                for (i = 0; i < len; i++) {
                    panels[i].style.display = i === activeIndex ? BLOCK : NONE;
                }

            } else { // type = scrollx, scrolly, fade

                // ��Щ��Ч��Ҫ�� panels ����ʾ����
                for (i = 0; i < len; i++) {
                    panels[i].style.display = BLOCK;
                }

                // ���ö�λ��Ϣ��Ϊ����Ч�����̵�
                if (type === TYPES.SCROLLX || type === TYPES.SCROLLY) {
                    self.container.style.position = RELATIVE;
                    self.content.style.position = ABSOLUTE;

                    // ˮƽ����
                    if (type === TYPES.SCROLLX) {
                        Dom.setStyle(panels, "float", "left");

                        // ��������ȣ��Ա�֤�пռ��� panels ˮƽ�Ų�
                        this.content.style.width = self.panelSize[0] * len + "px";
                    }
                }

                // ��ʼ��͸��
                if (type === TYPES.FADE) {
                    for (i = 0; i < len; i++) {
                        Dom.setStyle(panels[i], OPACITY, i === self.activeIndex ? 1 : 0);
                        panels[i].style.position = ABSOLUTE;
                        panels[i].style.zIndex = i === self.activeIndex ? 9 : 1;
                    }
                }
            }

            // 3. ��Ӧ�� CSS �container ��Ҫ���ø߿�� overflow: hidden
            //    nav �� cls �� CSS ָ��
        },

        /**
         * �����Զ�����
         */
        _initAutoPlay: function() {
            var self = this, cfg = self.config, max = self.panels.length - 1;

            // �����ͣ��ֹͣ�Զ�����
            if (cfg.pauseOnMouseOver) {
                Event.on([self.content, self.nav], "mouseenter", function() {
                    self.autoPlayIsPaused = true;
                });

                Event.on([self.content, self.nav], "mouseleave", function() {
                    self.autoPlayIsPaused = false;
                });
            }

            // �����Զ�����
            if (cfg.autoPlay) {
                self.autoPlayTimer = Lang.later(cfg.autoPlayInterval * 1000, this, function() {
                    if (self.autoPlayIsPaused) return;
                    self.switchTo(self.activeIndex < max ? self.activeIndex + 1 : 0);
                }, null, true);
            }
        },

        /**
         * �л�����
         * @protected
         */
        _switchContent: function(fromPanel, toPanel, index) {
            var self = this, cfg = self.config, type = cfg.effectType;


            // fire effect fn
            effects[type].call(this, fromPanel, toPanel, index, type === TYPES.SCROLLX);
        }
    });

    S.SlideView = SlideView;
});

/**
 * TODO:
 *   - onSwitch �Ĵ����б�Ҫ���ڶ�����������
 */
