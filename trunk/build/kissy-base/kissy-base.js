/*
Copyright (c) 2009, Kissy UI Library. All rights reserved.
MIT Licensed.
http://kissy.googlecode.com/

Date: 2009-12-25 18:42:50
Revision: 362
*/
/**
 * �����ӳټ������
 * ���� img, textarea, �Լ��ض�Ԫ�ؼ�������ʱ�Ļص�����
 * @module      datalazyload
 * @creator     ��<lifesinger@gmail.com>
 * @depends     kissy-core, yahoo-dom-event
 */
KISSY.add("datalazyload", function(S) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = YAHOO.lang,
        win = window, doc = document,
        DATA_SRC = "data-lazyload-src",
        LAZY_TEXTAREA_CLS = "ks-datalazyload",
        CUSTOM_LAZYLOAD_CLS = "ks-datalazyload-custom",
        MOD = { AUTO: "auto", MANUAL: "manual" },
        DEFAULT = "default",

        defaultConfig = {

            /**
             * ������ģʽ
             *   auto   - �Զ�����html ���ʱ������ img.src ���κδ���
             *   manual - ��� html ʱ���Ѿ�����Ҫ�ӳټ��ص�ͼƬ�� src �����滻Ϊ DATA_SRC
             * ע������ textarea ���ݣ�ֻ���ֶ�ģʽ
             */
            mod: MOD.MANUAL,

            /**
             * ��ǰ�Ӵ����£�diff px ��� img/textarea �ӳټ���
             * �ʵ����ô�ֵ���������û����϶�ʱ�о������Ѿ����غ�
             * Ĭ��Ϊ��ǰ�Ӵ��߶ȣ���������Ĳ��ӳټ��أ�
             */
            diff: DEFAULT,

            /**
             * ͼ���ռλͼ
             */
            placeholder: "http://a.tbcdn.cn/kissy/1.0.2/build/datalazyload/dot.gif"
        };

    /**
     * �ӳټ������
     * @constructor
     */
    function DataLazyload(containers, config) {
        var self = this;
        
        // factory or constructor
        if (!(self instanceof arguments.callee)) {
            return new arguments.callee(containers, config);
        }

        // ��������� config һ������
        if (typeof config === "undefined") {
            config = containers;
            containers = [doc];
        }

        // containers ��һ�� HTMLElement ʱ
        if (!Lang.isArray(containers)) {
            containers = [Dom.get(containers) || doc];
        }

        /**
         * ͼƬ�������������Զ������Ĭ��Ϊ [doc]
         * @type Array
         */
        self.containers = containers;

        /**
         * ���ò���
         * @type Object
         */
        self.config = S.merge(defaultConfig, config || {});

        /**
         * ��Ҫ�ӳ����ص�ͼƬ
         * @type Array
         */
        //self.images

        /**
         * ��Ҫ�ӳٴ���� textarea
         * @type Array
         */
        //self.areaes

        /**
         * ���ӳ���󶨵Ļص�����
         * @type object
         */
        self.callbacks = {els: [], fns: []};

        /**
         * ��ʼ�ӳٵ� Y ����
         * @type number
         */
        //self.threshold

        self._init();
    }

    S.mix(DataLazyload.prototype, {

        /**
         * ��ʼ��
         * @protected
         */
        _init: function() {
            var self = this;
            
            self.threshold = self._getThreshold();
            self._filterItems();

            if (self._getItemsLength()) {
                self._initLoadEvent();
            }
        },

        /**
         * ��ʼ�������¼�
         * @protected
         */
        _initLoadEvent: function() {
            var timer, self = this;

            // scroll �� resize ʱ������ͼƬ
            Event.on(win, "scroll", loader);
            Event.on(win, "resize", function() {
                self.threshold = self._getThreshold();
                loader();
            });

            // ��Ҫ��������һ�Σ��Ա�֤��һ�����ӳ���ɼ�
            if (self._getItemsLength()) {
                Event.onDOMReady(function() {
                    loadItems();
                });
            }

            // ���غ���
            function loader() {
                if (timer) return;
                timer = setTimeout(function() {
                    loadItems();
                    timer = null;
                }, 100); // 0.1s �ڣ��û��о�����
            }

            // �����ӳ���
            function loadItems() {
                self._loadItems();

                if (self._getItemsLength() === 0) {
                    Event.removeListener(win, "scroll", loader);
                    Event.removeListener(win, "resize", loader);
                }
            }
        },

        /**
         * ��ȡ����ʼ����Ҫ�ӳٵ� img �� textarea
         * @protected
         */
        _filterItems: function() {
            var self = this,
                containers = self.containers,
                threshold = self.threshold,
                placeholder = self.config.placeholder,
                isManualMod = self.config.mod === MOD.MANUAL,
                n, N, imgs, areaes, i, len, img, data_src,
                lazyImgs = [], lazyAreaes = [];

            for (n = 0,N = containers.length; n < N; ++n) {
                imgs = containers[n].getElementsByTagName("img");

                for (i = 0,len = imgs.length; i < len; ++i) {
                    img = imgs[i];
                    data_src = img.getAttribute(DATA_SRC);

                    if (isManualMod) { // �ֹ�ģʽ��ֻ������ data-src ��ͼƬ
                        if (data_src) {
                            img.src = placeholder;
                            lazyImgs.push(img);
                        }
                    } else { // �Զ�ģʽ��ֻ���� threshold ���� data-src ��ͼƬ
                        // ע�⣺���� data-src ���������������ʵ����������ظ�����
                        // �ᵼ�� data-src ��� placeholder
                        if (Dom.getY(img) > threshold && !data_src) {
                            img.setAttribute(DATA_SRC, img.src);
                            img.src = placeholder;
                            lazyImgs.push(img);
                        }
                    }
                }

                // ���� textarea
                areaes = containers[n].getElementsByTagName("textarea");
                for( i = 0, len = areaes.length; i < len; ++i) {
                    if(Dom.hasClass(areaes[i], LAZY_TEXTAREA_CLS)) {
                        lazyAreaes.push(areaes[i]);
                    }
                }
            }

            self.images = lazyImgs;
            self.areaes = lazyAreaes;
        },

        /**
         * �����ӳ���
         */
        _loadItems: function() {
            var self = this;
            
            self._loadImgs();
            self._loadAreaes();
            self._fireCallbacks();
        },

        /**
         * ����ͼƬ
         * @protected
         */
        _loadImgs: function() {
            var self = this,
                imgs = self.images,
                scrollTop = Dom.getDocumentScrollTop(),
                threshold = self.threshold + scrollTop,
                i, img, data_src, remain = [];

            for (i = 0; img = imgs[i++];) {
                if (Dom.getY(img) <= threshold) {
                    data_src = img.getAttribute(DATA_SRC);

                    if (data_src && img.src != data_src) {
                        img.src = data_src;
                        img.removeAttribute(DATA_SRC);
                    }
                } else {
                    remain.push(img);
                }
            }

            self.images = remain;
        },

        /**
         * ���� textarea ����
         * @protected
         */
        _loadAreaes: function() {
            var self = this,
                areaes = self.areaes,
                scrollTop = Dom.getDocumentScrollTop(),
                threshold = self.threshold + scrollTop,
                i, area, parent, remain = [];

            for (i = 0; area = areaes[i++];) {
                parent = area.parentNode;
                // ע��area ���ܴ��� display: none ״̬��Dom.getY(area) ��ȡ���� Y ֵ
                //    ���������� area.parentNode
                if (Dom.getY(parent) <= threshold) {
                    parent.innerHTML = area.value;
                } else {
                    remain.push(area);
                }
            }

            self.areaes = remain;
        },

        /**
         * �����ص�
         * @protected
         */
        _fireCallbacks: function() {
            var self = this,
                callbacks = self.callbacks,
                els = callbacks.els, fns = callbacks.fns,
                scrollTop = Dom.getDocumentScrollTop(),
                threshold = self.threshold + scrollTop,
                i, el, fn, remainEls = [], remainFns = [];

            for (i = 0; (el = els[i]) && (fn = fns[i++]);) {
                if (Dom.getY(el) <= threshold) {
                    fn.call(el);
                } else {
                    remainEls.push(el);
                    remainFns.push(fn);
                }

            }

            callbacks.els = remainEls;
            callbacks.fns = remainFns;
        },

        /**
         * ��ӻص��������� el ������������ͼ��ʱ������ fn
         */
        addCallback: function(el, fn) {
            el = Dom.get(el);
            if(el && typeof fn === "function") {
                this.callbacks.els.push(el);
                this.callbacks.fns.push(fn);
            }
        },

        /**
         * ��ȡ��ֵ
         * @protected
         */
        _getThreshold: function() {
            var diff = this.config.diff,
                ret = Dom.getViewportHeight();

            if (diff === DEFAULT) return 2 * ret; // diff Ĭ��Ϊ��ǰ�Ӵ��߶ȣ���������Ĳ��ӳټ��أ�
            else return ret + diff;
        },

        /**
         * ��ȡ��ǰ�ӳ��������
         * @protected
         */
        _getItemsLength: function() {
            var self = this;
            return self.images.length + self.areaes.length + self.callbacks.els.length;
        },

        /**
         * �����Զ����ӳ�����
         */
        loadCustomLazyData: function(parent) {
            var textarea = parent.getElementsByTagName("textarea")[0];
            if (textarea && Dom.hasClass(textarea, CUSTOM_LAZYLOAD_CLS)) {
                parent.innerHTML = textarea.value;
            }
        }
    });

    S.DataLazyload = DataLazyload;
});

/**
 * NOTES:
 *
 * ģʽΪ auto ʱ��
 *  1. �� Firefox �·ǳ��������ű�����ʱ����û���κ�ͼƬ��ʼ���أ������������ӳټ��ء�
 *  2. �� IE �²����������ű�����ʱ���в���ͼƬ�Ѿ���������������ӣ��ⲿ�� abort ����
 *     ���ڹ���ʱ�ӳټ��أ�������������������
 *  3. �� Safari �� Chrome �£���Ϊ webkit �ں� bug�������޷� abort �����ء���
 *     �ű���ȫ���á�
 *  4. �� Opera �£��� Firefox һ�£�������
 *
 * ģʽΪ manual ʱ����Ҫ�ӳټ��ص�ͼƬ��src �����滻Ϊ data-lazyload-src, ���� src ��ֵ��Ϊ placeholder ��
 *  1. ���κ�������¶���������ʵ�֡�
 *  2. ȱ���ǲ�������ǿ���� JS ʱ��ͼƬ����չʾ��
 *
 * ȱ�㣺
 *  1. ���ڴ󲿷�����£���Ҫ�϶��鿴���ݵ�ҳ�棨�����������ҳ�������ٹ���ʱ����������
 *     �����飨�û��������������ã����ر������ٲ���ʱ��
 *  2. auto ģʽ��֧�� Webkit �ں��������IE �£��п��ܵ��� HTTP �����������ӡ�
 *
 * �ŵ㣺
 *  1. ���Ժܺõ����ҳ���ʼ�����ٶȡ�
 *  2. ��һ������ת���ӳټ���ͼƬ���Լ���������
 *
 * �ο����ϣ�
 *  1. http://davidwalsh.name/lazyload MooTools ��ͼƬ�ӳٲ��
 *  2. http://vip.qq.com/ ģ�����ʱ�����滻��ͼƬ�� src
 *  3. http://www.appelsiini.net/projects/lazyload jQuery Lazyload
 *  4. http://www.dynamixlabs.com/2008/01/17/a-quick-look-add-a-loading-icon-to-your-larger-images/
 *  5. http://www.nczonline.net/blog/2009/11/30/empty-image-src-can-destroy-your-site/
 *
 * �ر�Ҫע��Ĳ�������:
 *  1. ��ʼ���ں�С�����󴰿�ʱ��ͼƬ��������
 *  2. ҳ���й���λ��ʱ��ˢ��ҳ�棬ͼƬ��������
 *  3. �ֶ�ģʽ����һ�����ӳ�ͼƬʱ����������
 *
 * 2009-12-17 ���䣺
 *  1. textarea �ӳټ���Լ����ҳ������Ҫ�ӳٵ� dom �ڵ㣬����
 *       <textarea class="ks-datalazysrc invisible">dom code</textarea>
 *     �������� hidden �� class, �������� invisible, ���趨 height = "ʵ�ʸ߶�".
 *     �������Ա�֤����ʱ��diff ����ʵ��Ч��
 *     ע�⣺textarea ���غ󣬻��滻���������е��������ݡ�
 *  2. �ӳ� callback Լ����dataLazyload.addCallback(el, fn) ��ʾ�� el ��������ʱ������ fn.
 *  3. ���в���������ഥ��һ�Σ����� callback. �����϶�������ʱ��ֻ�� el ��һ�γ���ʱ�ᴥ�� fn �ص���
 */

/**
 * TODOs:
 *   - [ȡ��] ����ͼƬ���ӳټ��أ����� css ��ı���ͼƬ�� sprite ���Ѵ���
 *   - [ȡ��] ����ʱ�� loading ͼ������δ�趨��С��ͼƬ��������������[�ο����� 4]��
 */

/**
 * UPDATE LOG:
 *   - 2009-12-17 yubo �� imglazyload ����Ϊ datalazyload, ֧�� textarea ��ʽ�ӳٺ��ض�Ԫ�ؼ�������ʱ�Ļص�����
 *//**
 * Triggerable
 * @module      triggerable
 * @creator     ��<lifesinger@gmail.com>
 * @depends     kissy-core, yahoo-dom-event, event-mouseenter
 */
KISSY.add("triggerable", function(S) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = YAHOO.lang,
        BEFORE_SWITCH = "beforeSwitch",
        ON_SWITCH = "onSwitch";

    /**
     * Triggerable
     * @constructor
     * Լ����
     *   - this.config.triggerType   �������͡�Ĭ��Ϊ mouse
     *   - this.config.triggerDelay  �����ӳ١�Ĭ��Ϊ 0.1s
     *   - this.triggers
     *   - this.panels
     *   - this.activeIndex
     */
    function Triggerable() {
    }

    S.mix(Triggerable.prototype, {

        /**
         * ��ʼ�� triggers
         */
        _initTriggers: function() {
            var self = this;
            
            // create custom events
            self.createEvent(BEFORE_SWITCH);
            self.createEvent(ON_SWITCH);

            // bind triggers events
            self._bindTriggers();
        },

        /**
         * �� triggers ����¼�

         */
        _bindTriggers: function() {
            var self = this,
                cfg = self.config, triggers = self.triggers,
                i, len = triggers.length, trigger;

            for (i = 0; i < len; i++) {
                (function(index) {
                    trigger = triggers[index];

                    // ��Ӧ����� Tab ��
                    Event.on(trigger, "click", function() {
                        self._onFocusTrigger(index);
                    });
                    Event.on(trigger, "focus", function() {
                        self._onFocusTrigger(index);
                    });

                    // ��Ӧ�������
                    if (cfg.triggerType === "mouse") {
                        Event.on(trigger, "mouseenter", function() {
                            self._onMouseEnterTrigger(index);
                        });
                        Event.on(trigger, "mouseleave", function() {
                            self._onMouseLeaveTrigger(index);
                        });
                    }
                })(i);
            }
        },

        /**
         * click or tab ������ trigger ʱ�������¼�
         * @protected
         */
        _onFocusTrigger: function(index) {
            var self = this;
            if(self.activeIndex === index) return; // �ظ����
            if(self.showTimer) self.showTimer.cancel(); // ���磺�������������̵������ʱ�����¼�����ȡ����
            self.switchTo(index);
        },

        /**
         * ��������� trigger ��ʱ�������¼�
         * @protected
         */
        _onMouseEnterTrigger: function(index) {
            //S.log("Triggerable._onMouseEnterTrigger: index = " + index);
            var self = this;

            // ���ظ����������磺����ʾ����ʱ���������ٻ����ٻ����������ش���
            if (self.activeIndex !== index) {
                self.showTimer = Lang.later(self.config.triggerDelay * 1000, self, function() {
                    self.switchTo(index);
                });
            }
        },

        /**
         * ����Ƴ� trigger ʱ�������¼�
         * @protected
         */
        _onMouseLeaveTrigger: function() {
            var self = this;
            if (self.showTimer) self.showTimer.cancel();
        },

        /**
         * �л�����
         */
        switchTo: function(index) {
            var self = this, cfg = self.config,
                activeIndex  =self.activeIndex,
                triggers = self.triggers,
                panels = self.panels,
                fromPanel = panels[self.activeIndex],
                toPanel = panels[index];

            //S.log("Triggerable.switchTo: index = " + index);

            // fire beforeSwitch
            if(!self.fireEvent(BEFORE_SWITCH, index)) return self;
            // TODO: YUI 2.8.0r4 bug - don't pass multi args correctly
            //if(!self.fireEvent(BEFORE_SWITCH, fromPanel, toPanel, index)) return self;

            // �л� active trigger
            if(activeIndex >= 0) { // �п���Ϊ -1, ��ʾû�е�ǰ��
                Dom.removeClass(triggers[activeIndex], cfg.activeTriggerCls);
            }
            Dom.addClass(triggers[index], cfg.activeTriggerCls);

            // �����ӳ�����
            if (self.loadCustomLazyData && toPanel.nodeType === 1) {
                self.loadCustomLazyData(toPanel);
            }

            // �л� content
            self._switchContent(fromPanel, toPanel, index);

            // ���� activeIndex
            self.activeIndex = index;

            return self; // chain
        },

        /**
         * �л�����
         * @protected
         */
        _switchContent: function(fromPanel, toPanel, index) {
            var self = this;

            // ��򵥵��л�Ч����ֱ������/��ʾ
            fromPanel.style.display = "none";
            toPanel.style.display = "block";

            // fire onSwitch
            self.fireEvent(ON_SWITCH, index);
            // TODO: see above TODO
            //self.fireEvent(ON_SWITCH, toPanel, index);
        }
    });

    S.augment(Triggerable, Y.EventProvider);
    if(S.DataLazyload) {
        S.augment(Triggerable, S.DataLazyload, true, ["loadCustomLazyData"]);
    }

    S.Triggerable = Triggerable;
});
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
/**
 * �����˵����
 * @module      megamenu
 * @creator     ��<lifesinger@gmail.com>
 * @depends     kissy-core, yui-base, triggerable
 */
KISSY.add("megamenu", function(S) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = YAHOO.lang,
        NONE = "none", BLOCK = "block",
        CLOSEBTN_TMPL = "<span class=\"{hook_cls}\"></span>",
        CLS_PREFIX = "ks-megamenu-",

        defaultConfig = {

            triggerType: "mouse", // or "click" ��������
            triggerDelay: 0.1, // �����ӳ�
            hideDelay: .5,    // �����ӳ�

            // ֻ֧���ʶ����ṹ��view �����Զ�����
            triggerCls: CLS_PREFIX + "trigger",
            viewCls: CLS_PREFIX + "view",
            contentCls: CLS_PREFIX + "content",
            activeTriggerCls: CLS_PREFIX + "trigger-active",
            closeBtnCls: CLS_PREFIX + "closebtn",

            showCloseBtn: true // �Ƿ���ʾ�رհ�ť
        };

    /**
     * @class MegaMenu
     * @constructor
     */
    function MegaMenu(container, config) {
        var self = this,
            cfg = S.merge(defaultConfig, config || {});
        
        // factory or constructor
        if (!(self instanceof arguments.callee)) {
            return new arguments.callee(container, config);
        }

        /**
         * �˵�����
         * @type HTMLElement
         */
        self.container = Dom.get(container);

        /**
         * ���ò���
         * @type Object
         */
        self.config = cfg;

        /**
         * �˵���
         */
        self.triggers = Dom.getElementsByClassName(cfg.triggerCls, "*", container);

        /**
         * ��ʾ����
         */
        //self.view

        /**
         * ��ʾ�����������Ԫ��
         */
        //self.viewContent

        /**
         * ����
         */
        self.contents = [];
        Dom.getElementsByClassName(cfg.contentCls, "*", container, function(each) {
            self.contents.push(each.value || each.innerHTML);
        });
        self.panels = self.contents; // for Triggerable

        /**
         * ��ʱ��
         */
        //self.showTimer = null;
        //self.hideTimer = null;

        /**
         * ��ǰ������
         */
        self.activeIndex = -1;

        // init
        self._init();
    }

    S.mix(MegaMenu.prototype, {

        /**
         * ��ʼ������
         * @protected
         */
        _init: function() {
            var self = this;

            self._initTriggers();
            self._initView();
            if(self.config.showCloseBtn) self._initCloseBtn();
        },

        /**
         * click or tab ������ trigger ʱ�������¼�
         * @protected
         */
        _onFocusTrigger: function(index) {
            var self = this;
            if (self.activeIndex === index) return; // �ظ����
            if (self.showTimer) self.showTimer.cancel(); // ���磺�������������̵������ʱ�����¼�����ȡ����
            if(self.hideTimer) self.hideTimer.cancel(); // ȡ������

            self.switchTo(index);
        },

        /**
         * ��������� trigger ��ʱ�������¼�
         * @protected
         */
        _onMouseEnterTrigger: function(index) {
            //S.log("Triggerable._onMouseEnterTrigger: index = " + index);
            var self = this;
            if(self.hideTimer) self.hideTimer.cancel(); // ȡ������

            // ���ظ����������磺����ʾ����ʱ���������ٻ����ٻ����������ش���
            self.showTimer = Lang.later(self.config.triggerDelay * 1000, self, function() {
                self.switchTo(index);
            });
        },

        /**
         * ����Ƴ� trigger ʱ�������¼�
         * @protected
         */
        _onMouseLeaveTrigger: function() {
            var self = this;
            if (self.showTimer) self.showTimer.cancel();

            self.hideTimer = Lang.later(self.config.hideDelay * 1000, self, function() {
                self.hide();
            });
        },

        /**
         * ��ʼ����ʾ����
         * @protected
         */
        _initView: function() {
            var self = this, cfg = self.config,
                view = Dom.getElementsByClassName(cfg.viewCls, "*", self.container)[0];

            // �Զ����� view
            if(!view) {
                view = document.createElement("DIV");
                view.className = cfg.viewCls;
                self.container.appendChild(view);
            }

            // init events
            Event.on(view, "mouseenter", function() {
                if(self.hideTimer) self.hideTimer.cancel();
            });
            Event.on(view, "mouseleave", function() {
                self.hideTimer = Lang.later(cfg.hideDelay * 1000, self, "hide");
            });

            // viewContent �Ƿ������ݵ��������޹رհ�ťʱ������ view ����
            self.viewContent = view;
            self.view = view;
        },

        /**
         * ��ʼ���رհ�ť
         * @protected
         */
        _initCloseBtn: function() {
            var self = this, el, view = self.view;

            view.innerHTML = CLOSEBTN_TMPL.replace("{hook_cls}", self.config.closeBtnCls);
            Event.on(view.firstChild, "click", function() {
                self.hide();
            });

            // ���� viewContent
            el = document.createElement("div");
            view.appendChild(el);
            self.viewContent = el;
        },

        /**
         * �л�����
         * @protected
         */
        _switchContent: function(oldContent, newContent, index) {
            var self = this;

            // ��ʾ view
            self.view.style.display = BLOCK;

            // ����������
            self.viewContent.innerHTML = newContent;

            // fire onSwitch
            self.fireEvent("onSwitch", index);
        },

        /**
         * ��������
         */
        hide: function() {
            var self = this;

            // hide current
            Dom.removeClass(self.triggers[self.activeIndex], self.config.activeTriggerCls);
            self.view.style.display = NONE;

            // update
            self.activeIndex = -1;
        }
    });

    S.augment(MegaMenu, S.Triggerable, false);
    S.MegaMenu = MegaMenu;
});

/**
 * TODO:
 *   - �� YAHOO ��ҳ��������ʾ���λ������Ӧ
 */// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8 nobomb:
/**
 * KISSY - Carousel Module
 *
 * @module      carousel
 * @creator     mingcheng<i.feelinglucky#gmail.com>
 * @depends     kissy-core, yahoo-dom-event, yahoo-animate
 */

KISSY.add("scrollview", function(S) {
    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = YAHOO.lang,
        getFirstChild = Dom.getFirstChild, getLastChild  = Dom.getLastChild,
        insertBefore = Dom.insertBefore, insertAfter = Dom.insertAfter,
        getAttribute = Dom.getAttribute, setAttribute = Dom.setAttribute;

    var PREV = 'prev', NEXT = 'next', INDEX_FLAG = 'carousel:index',
        HORIZONTAL = 'horizontal', VERTICAL = 'vertical';

    var defaultConfig = {
        delay: 2000,
        speed: 500,
        startDelay: 2000,
        autoStart: true,
        direction: 'vertical', // 'horizontal(h)' or 'vertical(v)'
        scrollWidth: false,
        //easing: function() {},
        //onScroll: function() {},
        //onBeforeScroll: function() {},
        //onPause: function() {},
        //onWakeup: function() {},
        scrollSize: 1 // the number of horse scrolls, default is 1
    };


    /**
     * Get Element's real offset
     *
     * @param Object Elements
     * @private
     */
    function getRealOffset(elem) {
        var elem = Dom.get(elem),
            leftOffset = elem.offsetLeft,
            topOffset  = elem.offsetTop,
            parent     = elem.offsetParent;

        // fix IE offsetLeft bug, see
        // http://www.gtalbot.org/BrowserBugsSection/MSIE6Bugs/
        while(parent) {
            leftOffset += parent.offsetLeft;
            topOffset  += parent.offsetTop;
            parent      = parent.offsetParent;
        }

        return { top: topOffset, left: leftOffset };
    }
        

    /**
     * 找到下个节点的位罄1�7
     *
     * @private
     */
    var findNextPanel = function(ref, size, direction) {
        var func = Dom[(direction == 'prev') ? 'getPreviousSibling' : 'getNextSibling'];
        for(var i = 0; i < size; i++) {
            ref = func(ref);
            if (!ref) return false;
        }
        return ref;
    }


    /**
     * 基于平滑滚动，重新排列元素位罄1�7
     *
     * @private
     */
    var rebuildSeq = function(container, size, direction) {
        direction = (direction == PREV) ? PREV : NEXT;
        switch(direction) {
            case PREV:
                for (var i = 0; i < size; i++) {
                    insertBefore(getLastChild(container), getFirstChild(container));
                }
                break;
            default: 
                for (var i = 0; i < size; i++) {
                    insertAfter(getFirstChild(container), getLastChild(container));
                }
        }
    }




    // NOTICE: the container must be scrollable
    var ScrollView = function(container, config) {
        var self = this, config = Lang.merge(defaultConfig, config || {}),
        container, panels, currentPanel, current, total, i, len, direction;

        // carousel's elements
        container = Dom.get(container), panels = container.getElementsByTagName('li');

        // move current to first
        currentPanel = panels[0] || [], total = panels.length;
        if (total < config.scrollSize) {
            return;
        }

        // mark index
        for(i = 0, len = total; i < len; i++) {
            setAttribute(panels[i], INDEX_FLAG, i);
        }

        // mark current index
        current = getAttribute(currentPanel, INDEX_FLAG);

        // default direction value is vertical
        direction = {
            x: (config.direction == HORIZONTAL) || (config.direction == 'h'),
            y: (config.direction == VERTICAL)   || (config.direction == 'v')       
        };

        // 重新绑到实例化中
        self.config    = config,
        self.container = container, 
        self.panels    = panels,
        self.currentPanel = currentPanel,
        self.current = current,
        self.total     = total,
        self.direction = direction;

        // initialize
        self._init(); 
    }

    S.mix(ScrollView.prototype, {
        _init: function() {
            var self = this, config = self.config, container = self.container, 
                panels = self.panels,
                i, len, flag;

            // bind custom event
            var events = ['onScroll', 'onPause', 'onBeforeScroll', 'onPause', 'onWakeup'];
            for(i = 0,  len = events.length; i < len; i++) {
                flag = events[i];
                if (Lang.isFunction(config[flag])) {
                    self[flag + 'Event'] = new Y.CustomEvent(flag, self, false, Y.CustomEvent.FLAT);
                    self[flag + 'Event'].subscribe(config[flag]);
                }
            }

            // stop scroll when mouseover the container
            Event.on(container, 'mouseenter', function() {
                if (config.autoStart) self.pause();
            });

            Event.on(container, 'mouseleave',  function() {
                if (config.autoStart) self.wakeup();
            });

            // autoStart?
            if (config.autoStart) {
                Lang.later(config.startDelay, self, function() {
                    self.play();
                });
            }
        },


        play: function(direction) {
            var self = this, container = self.container, currentPanel = self.currentPanel,
                current = self.current,
                config = self.config, callee = arguments.callee, attributes,
                destination;

            direction = (direction == PREV) ? PREV : NEXT;

            // is scrolling?
            if (self._scrolling || self.paused) {
                return;
            }

            // find the destination
            do {
                destination = findNextPanel(currentPanel, config.scrollSize, direction);
                // 如果径1�7下没找到，则重新排序
                if (!destination) {
                    rebuildSeq(currentPanel.parentNode, config.scrollSize, direction);
                }
            } while(!destination);


            // 如果指定滚动距离，记彄1�7
            if (Lang.isNumber(config.scrollWidth)) {
                var offset = config.scrollWidth * config.scrollSize;
            }

            // 元素相对位置
            var currentOffset     = getRealOffset(self.currentPanel),
                containerOffset   = getRealOffset(container),
                destinationOffset = getRealOffset(destination);

            // 滚动属�1�7�1�7
            if (self.direction.y) {
                // 垂直滚动
                var from = currentOffset.top - containerOffset.top;
                attributes = {scroll: { from: [, from] }};
                attributes.scroll.to = offset ?
                    [, from + (offset * (direction == NEXT ? 1 : -1))] : [, destinationOffset.top - containerOffset.top];
            } else {
                // 水平滚动
                var from = currentOffset.left - containerOffset.left;
                attributes = { scroll: { from: [from] } };
                // 如果手动设定了滚动距禄1�7
                attributes.scroll.to = offset ? 
                    [from + (offset * (direction == NEXT ? 1 : -1))] : [destinationOffset.left - containerOffset.left];
            }

            // move current to next Item
            self.currentPanel = destination;

            // mark current horses index
            self.current = getAttribute(destination, INDEX_FLAG);

            if(Lang.isObject(self.onBeforeScrollEvent)) self.onBeforeScrollEvent.fire();

            // start scroll
            self._scrolling = true;
            if (self.anim) self.anim.stop();
            self.anim = new Y.Scroll(container, attributes, config.speed/1000, 
                                                            config.easing || Y.Easing.easeOut); 
            self.anim.onComplete.subscribe(function() {
                self._scrolling = false;

                // run the callback
                if(Lang.isObject(self.onScrollEvent)) {
                    self.onScrollEvent.fire();
                }

                // set next move time
                if (!self.paused && config.autoStart) {
                    self.timer = Lang.later(config.delay, self, callee);
                }
            });
            self.anim.animate();
        },

        pause: function() {
            var self = this;
            self.paused = true;
            // skip wakeup
            if (self._wakeupTimer) self._wakeupTimer.cancel();

            // run the callback
            if(Lang.isObject(self.onPauseEvent)) self.onPauseEvent.fire();
        },

        wakeup: function() {
            var self = this;
            self.paused = false;

            // skip wakeup for previous set
            if (self._wakeupTimer) {
                self._wakeupTimer.cancel();
            }

            // run the callback
            if(Lang.isObject(this.onWakeupEvent)) {
                self.onWakeupEvent.fire();
            }

            self._wakeupTimer = Lang.later(0, self, function() {
                self.timer = Lang.later(self.config.delay, self, self.play);
            });
        },


        jumpTo: function(index, direction) {
            var self = this, config = self.config, currentPanel = self.currentPanel, 
                total = self.total, 
                current, opponent, i, tmp, len;

            if (Lang.isUndefined(direction) && Lang.isNumber(this._prevIndex)) {
                direction = index > self._prevIndex ? NEXT : PREV;
            }
            direction = (direction == PREV) ? PREV : NEXT;
            opponent = (direction == PREV) ? NEXT : PREV;

            if (index > self.total) {
                return;
            }

            // find direction element
            for(i = 0, len = total; i < len; i++) {
                tmp = getAttribute(self.panels[i], INDEX_FLAG);
                if (tmp == index) {
                    current = self.panels[i];
                    break;
                }
            }
            if (!current) return;

            do {
                self.currentPanel = findNextPanel(current, config.scrollSize, opponent);
                // find opponent element
                if (!self.currentPanel) {
                    rebuildSeq(current.parentNode, config.scrollSize, direction);
                }
            } while(!self.currentPanel);

            //
            self._prevIndex = index;

            // start scroll
            self.play(direction);
        },

        next: function() {
            this.play('next');
        },

        prev: function() {
            this.play('prev');
        }
    });

    S.ScrollView = ScrollView;
});
/**
 * ��ʾ��ȫ���
 * @module      suggest
 * @creator     ��<lifesinger@gmail.com>
 * @depends     kissy-core, yahoo-dom-event
 */
KISSY.add("suggest", function(S) {

    if (KISSY.Suggest) {
        // ����ģʽ�����ɳ�乲��ͬһ�� Suggest
        S.Suggest = KISSY.Suggest;
        return;
    }

    // �ӳٵ� use ʱ�ų�ʼ�������ҽ���ʼ��һ��
    S.Suggest = KISSY.Suggest = (function() {

        var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = YAHOO.lang,
            win = window, doc = document,
            head = doc.getElementsByTagName("head")[0],
            ie = YAHOO.env.ua.ie, ie6 = (ie === 6),

            CALLBACK_STR = "g_ks_suggest_callback", // Լ����ȫ�ֻص�����
            STYLE_ID = "suggest-style", // ��ʽ style Ԫ�ص� id

            CONTAINER_CLASS = "suggest-container",
            KEY_EL_CLASS = "suggest-key", // ��ʾ���У�key Ԫ�ص� class
            RESULT_EL_CLASS = "suggest-result", // ��ʾ���У�result Ԫ�ص� class
            SELECTED_ITEM_CLASS = "selected", // ��ʾ���У�ѡ����� class
            BOTTOM_CLASS = "suggest-bottom",
            CLOSE_BTN_CLASS = "suggest-close-btn",
            SHIM_CLASS = "suggest-shim", // iframe shim �� class

            BEFORE_DATA_REQUEST = "beforeDataRequest",
            ON_DATA_RETURN = "onDataReturn",
            BEFORE_SHOW = "beforeShow",
            ON_ITEM_SELECT = "onItemSelect",

            /**
             * Suggest��Ĭ������
             */
            defaultConfig = {
                /**
                 * �û����Ӹ�������ʾ��� class
                 *
                 * ��ʾ���Ĭ�Ͻṹ���£�
                 * <div class="suggest-container [container-class]">
                 *     <ol>
                 *         <li>
                 *             <span class="suggest-key">...</span>
                 *             <span class="suggest-result">...</span>
                 *         </li>
                 *     </ol>
                 *     <div class="suggest-bottom">
                 *         <a class="suggest-close-btn">...</a>
                 *     </div>
                 * </div>
                 * @type String
                 */
                containerClass: "",

                /**
                 * ��ʾ��Ŀ��
                 * ע�⣺Ĭ������£���ʾ��Ŀ�Ⱥ�input�����Ŀ�ȱ���һ��
                 * ʾ��ȡֵ��"200px", "10%"�ȣ��������λ
                 * @type String
                 */
                containerWidth: "auto",

                /**
                 * result�ĸ�ʽ
                 * @type String
                 */
                resultFormat: "Լ%result%�����",

                /**
                 * �Ƿ���ʾ�رհ�ť
                 * @type Boolean
                 */
                showCloseBtn: false,

                /**
                 * �رհ�ť�ϵ�����
                 * @type String
                 */
                closeBtnText: "�ر�",

                /**
                 * �Ƿ���Ҫiframe shim
                 * @type Boolean
                 */
                useShim: ie6,

                /**
                 * ��ʱ������ʱ
                 * @type Number
                 */
                timerDelay: 200,

                /**
                 * ��ʼ�����Զ�����
                 * @type Boolean
                 */
                autoFocus: false,

                /**
                 * ��������ѡ��ʱ���Ƿ��Զ��ύ��
                 * @type Boolean
                 */
                submitFormOnClickSelect: true
            };

        /**
         * ��ʾ��ȫ���
         * @class Suggest
         * @requires YAHOO.util.Dom
         * @requires YAHOO.util.Event
         * @constructor
         * @param {String|HTMLElement} textInput
         * @param {String} dataSource
         * @param {Object} config
         */
        function Suggest(textInput, dataSource, config) {

            // allow instantiation without the new operator
            if (!(this instanceof arguments.callee)) {
                return new arguments.callee(textInput, dataSource, config);
            }

            /**
             * �ı������
             * @type HTMLElement
             */
            this.textInput = Dom.get(textInput);

            /**
             * ��ȡ���ݵ�URL �� JSON��ʽ�ľ�̬����
             * @type {String|Object}
             */
            this.dataSource = dataSource;

            /**
             * JSON��̬����Դ
             * @type Object ��ʽΪ {"query1" : [["key1", "result1"], []], "query2" : [[], []]}
             */
            this.JSONDataSource = Lang.isObject(dataSource) ? dataSource : null;

            /**
             * ͨ��jsonp���ص�����
             * @type Object
             */
            this.returnedData = null;

            /**
             * ���ò���
             * @type Object
             */
            this.config = Lang.merge(defaultConfig, config || {});

            /**
             * �����ʾ��Ϣ������
             * @type HTMLElement
             */
            this.container = null;

            /**
             * ������ֵ
             * @type String
             */
            this.query = "";

            /**
             * ��ȡ����ʱ�Ĳ���
             * @type String
             */
            this.queryParams = "";

            /**
             * �ڲ���ʱ��
             * @private
             * @type Object
             */
            this._timer = null;

            /**
             * ��ʱ���Ƿ�������״̬
             * @private
             * @type Boolean
             */
            this._isRunning = false;

            /**
             * ��ȡ���ݵ�scriptԪ��
             * @type HTMLElement
             */
            this.dataScript = null;

            /**
             * ���ݻ���
             * @private
             * @type Object
             */
            this._dataCache = {};

            /**
             * ����script��ʱ���
             * @type String
             */
            this._latestScriptTime = "";

            /**
             * script���ص������Ƿ��Ѿ�����
             * @type Boolean
             */
            this._scriptDataIsOut = false;

            /**
             * �Ƿ��ڼ���ѡ��״̬
             * @private
             * @type Boolean
             */
            this._onKeyboardSelecting = false;

            /**
             * ��ʾ��ĵ�ǰѡ����
             * @type Boolean
             */
            this.selectedItem = null;

            // init
            this._init();
        }

        S.mix(Suggest.prototype, {
            /**
             * ��ʼ������
             * @protected
             */
            _init: function() {
                // init DOM
                this._initTextInput();
                this._initContainer();
                if (this.config.useShim) this._initShim();
                this._initStyle();

                // create events
                this.createEvent(BEFORE_DATA_REQUEST);
                this.createEvent(ON_DATA_RETURN);
                this.createEvent(BEFORE_SHOW);
                this.createEvent(ON_ITEM_SELECT);

                // window resize event
                this._initResizeEvent();
            },

            /**
             * ��ʼ�������
             * @protected
             */
            _initTextInput: function() {
                var instance = this;

                // turn off autocomplete
                this.textInput.setAttribute("autocomplete", "off");

                // focus
                // 2009-12-10 yubo: �ӳٵ� keydown �� start
                //            Event.on(this.textInput, "focus", function() {
                //                instance.start();
                //            });

                // blur
                Event.on(this.textInput, "blur", function() {
                    instance.stop();
                    instance.hide();
                });

                // auto focus
                if (this.config.autoFocus) this.textInput.focus();

                // keydown
                // ע������Ŀǰ����Opera9.64�У����뷨����ʱ�����ɲ��ᴥ���κμ����¼�
                var pressingCount = 0; // ������סĳ��ʱ������������keydown������ע��Operaֻ�ᴥ��һ�Ρ�
                Event.on(this.textInput, "keydown", function(ev) {
                    var keyCode = ev.keyCode;
                    //console.log("keydown " + keyCode);

                    switch (keyCode) {
                        case 27: // ESC����������ʾ�㲢��ԭ��ʼ����
                            instance.hide();
                            instance.textInput.value = instance.query;
                            break;
                        case 13: // ENTER��
                            // �ύ��ǰ����������ʾ�㲢ֹͣ��ʱ��
                            instance.textInput.blur(); // ��һ�仹������ֹ���������Ĭ���ύ�¼�

                            // ����Ǽ���ѡ��ĳ���س�������onItemSelect�¼�
                            if (instance._onKeyboardSelecting) {
                                if (instance.textInput.value == instance._getSelectedItemKey()) { // ȷ��ֵƥ��
                                    instance.fireEvent(ON_ITEM_SELECT, instance.textInput.value);
                                }
                            }

                            // �ύ��
                            instance._submitForm();

                            break;
                        case 40: // DOWN��
                        case 38: // UP��
                            // ��ס������ʱ����ʱ����
                            if (pressingCount++ == 0) {
                                if (instance._isRunning) instance.stop();
                                instance._onKeyboardSelecting = true;
                                instance.selectItem(keyCode == 40);

                            } else if (pressingCount == 3) {
                                pressingCount = 0;
                            }
                            break;
                    }

                    // �� DOWN/UP ��ʱ��������ʱ��
                    if (keyCode != 40 && keyCode != 38) {
                        if (!instance._isRunning) {
                            // 1. �����ٽ�����js��δ������ʱ���û����ܾ��Ѿ���ʼ����
                            //    ��ʱ��focus�¼��Ѿ����ᴥ������Ҫ��keyup�ﴥ����ʱ��
                            // 2. ��DOWN/UP��ʱ����Ҫ���ʱ��
                            instance.start();
                        }
                        instance._onKeyboardSelecting = false;
                    }
                });

                // reset pressingCount
                Event.on(this.textInput, "keyup", function() {
                    //console.log("keyup");
                    pressingCount = 0;
                });
            },

            /**
             * ��ʼ����ʾ������
             * @protected
             */
            _initContainer: function() {
                // create
                var container = doc.createElement("div"),
                    customContainerClass = this.config.containerClass;

                container.className = CONTAINER_CLASS;
                if (customContainerClass) {
                    container.className += " " + customContainerClass;
                }
                container.style.position = "absolute";
                container.style.visibility = "hidden";
                this.container = container;

                this._setContainerRegion();
                this._initContainerEvent();

                // append
                doc.body.insertBefore(container, doc.body.firstChild);
            },

            /**
             * ����������left, top, width
             * @protected
             */
            _setContainerRegion: function() {
                var r = Dom.getRegion(this.textInput);
                var left = r.left, w = r.right - left - 2;  // ��ȥborder��2px

                // bug fix: w Ӧ���ж����Ƿ���� 0, ������� width ��ʱ�����С�� 0, ie �»ᱨ������Ч�Ĵ���
                w = w > 0 ? w : 0;

                // ie8����ģʽ
                // document.documentMode:
                // 5 - Quirks Mode
                // 7 - IE7 Standards
                // 8 - IE8 Standards
                var docMode = doc.documentMode;
                if (docMode === 7 && (ie === 7 || ie === 8)) {
                    left -= 2;
                } else if (YAHOO.env.ua.gecko) { // firefox����ƫһ���� ע���� input ���ڵĸ��������� margin: auto ʱ�����
                    left++;
                }

                this.container.style.left = left + "px";
                this.container.style.top = r.bottom + "px";

                if (this.config.containerWidth == "auto") {
                    this.container.style.width = w + "px";
                } else {
                    this.container.style.width = this.config.containerWidth;
                }
            },

            /**
             * ��ʼ�������¼�
             * ��Ԫ�ض����������¼���ð�ݵ�����ͳһ����
             * @protected
             */
            _initContainerEvent: function() {
                var instance = this;

                // ����¼�
                Event.on(this.container, "mousemove", function(ev) {
                    //console.log("mouse move");
                    var target = Event.getTarget(ev);

                    if (target.nodeName != "LI") {
                        target = Dom.getAncestorByTagName(target, "li");
                    }
                    if (Dom.isAncestor(instance.container, target)) {
                        if (target != instance.selectedItem) {
                            // �Ƴ��ϵ�
                            instance._removeSelectedItem();
                            // �����µ�
                            instance._setSelectedItem(target);
                        }
                    }
                });

                var mouseDownItem = null;
                this.container.onmousedown = function(e) {
                    e = e || win.event;
                    // ��갴�´���item
                    mouseDownItem = e.target || e.srcElement;

                    // ��갴��ʱ��������򲻻�ʧȥ����
                    // 1. for IE
                    instance.textInput.onbeforedeactivate = function() {
                        win.event.returnValue = false;
                        instance.textInput.onbeforedeactivate = null;
                    };
                    // 2. for W3C
                    return false;
                };

                // mouseup�¼�
                Event.on(this.container, "mouseup", function(ev) {
                    // ��mousedown����ʾ�㣬��mouseup����ʾ����ʱ�������Ч
                    if (!instance._isInContainer(Event.getXY(ev))) return;
                    var target = Event.getTarget(ev);
                    // ����ʾ��A�������꣬�ƶ���B���ͷţ�������onItemSelect
                    if (target != mouseDownItem) return;

                    // ����ڹرհ�ť��
                    if (target.className == CLOSE_BTN_CLASS) {
                        instance.hide();
                        return;
                    }

                    // ���ܵ����li����Ԫ����
                    if (target.nodeName != "LI") {
                        target = Dom.getAncestorByTagName(target, "li");
                    }
                    // ��������container�ڲ���li��
                    if (Dom.isAncestor(instance.container, target)) {
                        instance._updateInputFromSelectItem(target);

                        // ����ѡ���¼�
                        //console.log("on item select");
                        instance.fireEvent(ON_ITEM_SELECT, instance.textInput.value);

                        // �ύ��ǰ����������ʾ�㲢ֹͣ��ʱ��
                        instance.textInput.blur();

                        // �ύ��
                        instance._submitForm();
                    }
                });
            },

            /**
             * clickѡ�� or enter���ύ��
             */
            _submitForm: function() {
                // ע�����ڼ��̿���enterѡ����������html��������Ƿ��ύ������ᵼ��ĳЩ���뷨�£���enterѡ��Ӣ��ʱҲ�����ύ
                if (this.config.submitFormOnClickSelect) {
                    var form = this.textInput.form;
                    if (!form) return;

                    // ͨ��js�ύ��ʱ�����ᴥ��onsubmit�¼�
                    // ��Ҫjs�Լ�����
                    if (doc.createEvent) { // w3c
                        var evObj = doc.createEvent("MouseEvents");
                        evObj.initEvent("submit", true, false);
                        form.dispatchEvent(evObj);
                    }
                    else if (doc.createEventObject) { // ie
                        form.fireEvent("onsubmit");
                    }

                    form.submit();
                }
            },

            /**
             * �ж�p�Ƿ�����ʾ����
             * @param {Array} p [x, y]
             */
            _isInContainer: function(p) {
                var r = Dom.getRegion(this.container);
                return p[0] >= r.left && p[0] <= r.right && p[1] >= r.top && p[1] <= r.bottom;
            },

            /**
             * ���������iframe shim��
             * @protected
             */
            _initShim: function() {
                var iframe = doc.createElement("iframe");
                iframe.src = "about:blank";
                iframe.className = SHIM_CLASS;
                iframe.style.position = "absolute";
                iframe.style.visibility = "hidden";
                iframe.style.border = "none";
                this.container.shim = iframe;

                this._setShimRegion();
                doc.body.insertBefore(iframe, doc.body.firstChild);
            },

            /**
             * ����shim��left, top, width
             * @protected
             */
            _setShimRegion: function() {
                var container = this.container, shim = container.shim;
                if (shim) {
                    shim.style.left = (parseInt(container.style.left) - 2) + "px"; // ����̱���bug
                    shim.style.top = container.style.top;
                    shim.style.width = (parseInt(container.style.width) + 2) + "px";
                }
            },

            /**
             * ��ʼ����ʽ
             * @protected
             */
            _initStyle: function() {
                var styleEl = Dom.get(STYLE_ID);
                if (styleEl) return; // ��ֹ���ʵ��ʱ�ظ����

                var style = ".suggest-container{background:white;border:1px solid #999;z-index:99999}"
                    + ".suggest-shim{z-index:99998}"
                    + ".suggest-container li{color:#404040;padding:1px 0 2px;font-size:12px;line-height:18px;float:left;width:100%}"
                    + ".suggest-container li.selected{background-color:#39F;cursor:default}"
                    + ".suggest-key{float:left;text-align:left;padding-left:5px}"
                    + ".suggest-result{float:right;text-align:right;padding-right:5px;color:green}"
                    + ".suggest-container li.selected span{color:#FFF;cursor:default}"
                    // + ".suggest-container li.selected .suggest-result{color:green}"
                    + ".suggest-bottom{padding:0 5px 5px}"
                    + ".suggest-close-btn{float:right}"
                    + ".suggest-container li,.suggest-bottom{overflow:hidden;zoom:1;clear:both}"
                    /* hacks */
                    + ".suggest-container{*margin-left:2px;_margin-left:-2px;_margin-top:-3px}";

                styleEl = doc.createElement("style");
                styleEl.id = STYLE_ID;
                styleEl.type = "text/css";
                head.appendChild(styleEl); // ����ӵ�DOM���У�����cssText���hack��ʧЧ

                if (styleEl.styleSheet) { // IE
                    styleEl.styleSheet.cssText = style;
                } else { // W3C
                    styleEl.appendChild(doc.createTextNode(style));
                }
            },

            /**
             * window.onresizeʱ��������ʾ���λ��
             * @protected
             */
            _initResizeEvent: function() {
                var instance = this, resizeTimer;

                Event.on(win, "resize", function() {
                    if (resizeTimer) {
                        clearTimeout(resizeTimer);
                    }

                    resizeTimer = setTimeout(function() {
                        instance._setContainerRegion();
                        instance._setShimRegion();
                    }, 50);
                });
            },

            /**
             * ������ʱ������ʼ�����û�����
             */
            start: function() {
                Suggest.focusInstance = this;

                var instance = this;
                instance._timer = setTimeout(function() {
                    instance.updateContent();
                    instance._timer = setTimeout(arguments.callee, instance.config.timerDelay);
                }, instance.config.timerDelay);

                this._isRunning = true;
            },

            /**
             * ֹͣ��ʱ��
             */
            stop: function() {
                Suggest.focusInstance = null;
                clearTimeout(this._timer);
                this._isRunning = false;
            },

            /**
             * ��ʾ��ʾ��
             */
            show: function() {
                if (this.isVisible()) return;
                var container = this.container, shim = container.shim;

                container.style.visibility = "";

                if (shim) {
                    if (!shim.style.height) { // ��һ����ʾʱ����Ҫ�趨�߶�
                        var r = Dom.getRegion(container);
                        shim.style.height = (r.bottom - r.top - 2) + "px";
                    }
                    shim.style.visibility = "";
                }
            },

            /**
             * ������ʾ��
             */
            hide: function() {
                if (!this.isVisible()) return;
                var container = this.container, shim = container.shim;
                //console.log("hide");

                if (shim) shim.style.visibility = "hidden";
                container.style.visibility = "hidden";
            },

            /**
             * ��ʾ���Ƿ���ʾ
             */
            isVisible: function() {
                return this.container.style.visibility != "hidden";
            },

            /**
             * ������ʾ�������
             */
            updateContent: function() {
                if (!this._needUpdate()) return;
                //console.log("update data");

                this._updateQueryValueFromInput();
                var q = this.query;

                // 1. ����Ϊ��ʱ��������ʾ��
                if (!Lang.trim(q).length) {
                    this._fillContainer("");
                    this.hide();
                    return;
                }

                if (typeof this._dataCache[q] != "undefined") { // 2. ʹ�û�������
                    //console.log("use cache");
                    this.returnedData = "using cache";
                    this._fillContainer(this._dataCache[q]);
                    this._displayContainer();

                } else if (this.JSONDataSource) { // 3. ʹ��JSON��̬����Դ
                    this.handleResponse(this.JSONDataSource[q]);

                } else { // 4. �������������
                    this.requestData();
                }
            },

            /**
             * �Ƿ���Ҫ��������
             * @protected
             * @return Boolean
             */
            _needUpdate: function() {
                // ע�⣺����ո�Ҳ���б仯
                return this.textInput.value != this.query;
            },

            /**
             * ͨ��scriptԪ�ؼ�������
             */
            requestData: function() {
                //console.log("request data via script");
                if (!ie) this.dataScript = null; // IE����Ҫ���´���scriptԪ��

                if (!this.dataScript) {
                    var script = doc.createElement("script");
                    script.type = "text/javascript";
                    script.charset = "utf-8";

                    // jQuery ajax.js line 275:
                    // Use insertBefore instead of appendChild  to circumvent an IE6 bug.
                    // This arises when a base node is used.
                    head.insertBefore(script, head.firstChild);
                    this.dataScript = script;

                    if (!ie) {
                        var t = new Date().getTime();
                        this._latestScriptTime = t;
                        script.setAttribute("time", t);

                        Event.on(script, "load", function() {
                            //console.log("on load");
                            // �жϷ��ص������Ƿ��Ѿ�����
                            this._scriptDataIsOut = script.getAttribute("time") != this._latestScriptTime;
                        }, this, true);
                    }
                }

                // ע�⣺û��Ҫ��ʱ������Ƿ񻺴��ɷ��������ص�Headerͷ����
                this.queryParams = "q=" + encodeURIComponent(this.query) + "&code=utf-8&callback=" + CALLBACK_STR;
                this.fireEvent(BEFORE_DATA_REQUEST, this.query);
                this.dataScript.src = this.dataSource + "?" + this.queryParams;
            },

            /**
             * �����ȡ������
             * @param {Object} data
             */
            handleResponse: function(data) {
                //console.log("handle response");
                if (this._scriptDataIsOut) return; // �����������ݣ�����ᵼ��bug��1. ����keyֵ���ԣ� 2. �������ݵ��µ�����

                this.returnedData = data;
                this.fireEvent(ON_DATA_RETURN, data);

                // ��ʽ������
                this.returnedData = this.formatData(this.returnedData);

                // �������
                var content = "";
                var len = this.returnedData.length;
                if (len > 0) {
                    var list = doc.createElement("ol");
                    for (var i = 0; i < len; ++i) {
                        var itemData = this.returnedData[i];
                        var li = this.formatItem(itemData["key"], itemData["result"]);
                        // ����keyֵ��attribute��
                        li.setAttribute("key", itemData["key"]);
                        list.appendChild(li);
                    }
                    content = list;
                }
                this._fillContainer(content);

                // ������ʱ����ӵײ�
                if (len > 0) this.appendBottom();

                // fire event
                if (Lang.trim(this.container.innerHTML)) {
                    // ʵ������beforeCache�������û��ĽǶȿ�����beforeShow
                    this.fireEvent(BEFORE_SHOW, this.container);
                }

                // cache
                this._dataCache[this.query] = this.container.innerHTML;

                // ��ʾ����
                this._displayContainer();
            },

            /**
             * ��ʽ����������ݶ���Ϊ��׼��ʽ
             * @param {Object} data ��ʽ������3�֣�
             *  1. {"result" : [["key1", "result1"], ["key2", "result2"], ...]}
             *  2. {"result" : ["key1", "key2", ...]}
             *  3. 1��2�����
             *  4. ��׼��ʽ
             *  5. ����1-4�У�ֱ��ȡo["result"]��ֵ
             * @return Object ��׼��ʽ�����ݣ�
             *  [{"key" : "key1", "result" : "result1"}, {"key" : "key2", "result" : "result2"}, ...]
             */
            formatData: function(data) {
                var arr = [];
                if (!data) return arr;
                if (Lang.isArray(data["result"])) data = data["result"];
                var len = data.length;
                if (!len) return arr;

                var item;
                for (var i = 0; i < len; ++i) {
                    item = data[i];

                    if (Lang.isString(item)) { // ֻ��keyֵʱ
                        arr[i] = {"key" : item};
                    } else if (Lang.isArray(item) && item.length >= 2) { // ["key", "result"] ȡ����ǰ2��
                        arr[i] = {"key" : item[0], "result" : item[1]};
                    } else {
                        arr[i] = item;
                    }
                }
                return arr;
            },

            /**
             * ��ʽ�������
             * @param {String} key ��ѯ�ַ���
             * @param {Number} result ��� �ɲ���
             * @return {HTMLElement}
             */
            formatItem: function(key, result) {
                var li = doc.createElement("li");
                var keyEl = doc.createElement("span");
                keyEl.className = KEY_EL_CLASS;
                keyEl.appendChild(doc.createTextNode(key));
                li.appendChild(keyEl);

                if (typeof result != "undefined") { // ����û��
                    var resultText = this.config.resultFormat.replace("%result%", result);
                    if (Lang.trim(resultText)) { // ��ֵʱ�Ŵ���
                        var resultEl = doc.createElement("span");
                        resultEl.className = RESULT_EL_CLASS;
                        resultEl.appendChild(doc.createTextNode(resultText));
                        li.appendChild(resultEl);
                    }
                }

                return li;
            },

            /**
             * �����ʾ��ײ�
             */
            appendBottom: function() {
                var bottom = doc.createElement("div");
                bottom.className = BOTTOM_CLASS;

                if (this.config.showCloseBtn) {
                    var closeBtn = doc.createElement("a");
                    closeBtn.href = "javascript: void(0)";
                    closeBtn.setAttribute("target", "_self"); // bug fix: ����<base target="_blank" />������ᵯ���հ�ҳ��
                    closeBtn.className = CLOSE_BTN_CLASS;
                    closeBtn.appendChild(doc.createTextNode(this.config.closeBtnText));

                    // û��Ҫ�����ʱ�������ʧȥ���㣬�Զ��͹ر���
                    /*
                     Event.on(closeBtn, "click", function(ev) {
                     Event.stopEvent(ev);
                     this.hidden();
                     }, this, true);
                     */

                    bottom.appendChild(closeBtn);
                }

                // ����������ʱ�����
                if (Lang.trim(bottom.innerHTML)) {
                    this.container.appendChild(bottom);
                }
            },

            /**
             * �����ʾ��
             * @protected
             * @param {String|HTMLElement} content innerHTML or Child Node
             */
            _fillContainer: function(content) {
                if (content.nodeType == 1) {
                    this.container.innerHTML = "";
                    this.container.appendChild(content);
                } else {
                    this.container.innerHTML = content;
                }

                // һ����������ˣ�selectedItem��û�ˣ���Ҫ����
                this.selectedItem = null;
            },

            /**
             * ����contanier�����ݣ���ʾ����������
             */
            _displayContainer: function() {
                if (Lang.trim(this.container.innerHTML)) {
                    this.show();
                } else {
                    this.hide();
                }
            },

            /**
             * ѡ����ʾ���е���/��һ����
             * @param {Boolean} down true��ʾdown��false��ʾup
             */
            selectItem: function(down) {
                //console.log("select item " + down);
                var items = this.container.getElementsByTagName("li");
                if (items.length == 0) return;

                // �п�����ESC�����ˣ�ֱ����ʾ����
                if (!this.isVisible()) {
                    this.show();
                    return; // ����ԭ����ѡ��״̬
                }
                var newSelectedItem;

                // û��ѡ����ʱ��ѡ�е�һ/�����
                if (!this.selectedItem) {
                    newSelectedItem = items[down ? 0 : items.length - 1];
                } else {
                    // ѡ����/��һ��
                    newSelectedItem = Dom[down ? "getNextSibling" : "getPreviousSibling"](this.selectedItem);
                    // �Ѿ��������/ǰһ��ʱ����λ������򣬲���ԭ����ֵ
                    if (!newSelectedItem) {
                        this.textInput.value = this.query;
                    }
                }

                // �Ƴ���ǰѡ����
                this._removeSelectedItem();

                // ѡ������
                if (newSelectedItem) {
                    this._setSelectedItem(newSelectedItem);
                    this._updateInputFromSelectItem();
                }
            },

            /**
             * �Ƴ�ѡ����
             * @protected
             */
            _removeSelectedItem: function() {
                //console.log("remove selected item");
                Dom.removeClass(this.selectedItem, SELECTED_ITEM_CLASS);
                this.selectedItem = null;
            },

            /**
             * ���õ�ǰѡ����
             * @protected
             * @param {HTMLElement} item
             */
            _setSelectedItem: function(item) {
                //console.log("set selected item");
                Dom.addClass((item), SELECTED_ITEM_CLASS);
                this.selectedItem = (item);
            },

            /**
             * ��ȡ��ʾ����ѡ�����key�ַ���
             * @protected
             */
            _getSelectedItemKey: function() {
                if (!this.selectedItem) return "";

                // getElementsByClassName�Ƚ�������ܣ����û������ݵ�attribute�Ϸ���
                //var keyEl = Dom.getElementsByClassName(KEY_EL_CLASS, "*", this.selectedItem)[0];
                //return keyEl.innerHTML;

                return this.selectedItem.getAttribute("key");
            },

            /**
             * ��textInput��ֵ���µ�this.query
             * @protected
             */
            _updateQueryValueFromInput: function() {
                this.query = this.textInput.value;
            },

            /**
             * ��ѡ�����ֵ���µ�textInput
             * @protected
             */
            _updateInputFromSelectItem: function() {
                this.textInput.value = this._getSelectedItemKey(this.selectedItem);
            }

        });

        S.augment(Suggest, Y.EventProvider);

        /**
         * Լ����ȫ�ֻص�����
         */
        win[CALLBACK_STR] = function(data) {
            if (!Suggest.focusInstance) return;
            // ʹ�������� script.onload �¼���Ȼ����ִ�� callback ����
            setTimeout(function() {
                Suggest.focusInstance.handleResponse(data);
            }, 0);
        };

        return Suggest;
    })();
});


/**
 * С�᣺
 *
 * ����������룬�����󲿷���ɣ����ݴ��� + �¼�����
 *
 * һ�����ݴ����core���������˵�Ǽ򵥵ģ��� requestData + handleResponse + formatData�ȸ����������
 * ��Ҫע�����㣺
 *  a. IE�У��ı�script.src, ���Զ�ȡ����֮ǰ�����󣬲����������󡣷�IE�У������´���script���С�����
 *     requestData�����д������ִ���ʽ��ԭ��
 *  b. �����ٺ��������ݷ���ʱ���û�����������Ѹı䣬�Ѿ��������ͳ�ȥ����Ҫ�����������ݡ�Ŀǰ���ü�ʱ���
 *     �Ľ�����������õĽ�������ǣ�����API��ʹ�÷��ص������У�����queryֵ��
 *
 * �����¼������Ƽ򵥣�ʵ�����в������壬��2���֣�
 *  1. ������focus/blur�¼� + ���̿����¼�
 *  2. ��ʾ���ϵ���������͵���¼�
 * ��Ҫע�����¼��㣺
 *  a. ��Ϊ�����ʾ��ʱ�����Ȼᴥ��������blur�¼���blur�¼��е���hide��������ʾ��һ�����غ󣬾Ͳ��񲻵�
 *     ����¼��ˡ�������� this._mouseHovering ���ų����������ʹ��blurʱ���ᴥ��hide������ʾ��ĵ��
 *     �¼������д�����2009-06-18���£�����mouseup�����click�¼��������������˺ࣩܶ
 *  b. ������ƶ���ĳ���ͨ�����¼�ѡ��ĳ��ʱ����this.selectedItem��ֵ������ʾ��������������ʱ������
 *     this.selectedItem. ���ִ���ʽ��google��һ�£�����ʹ��ѡ��ĳ����أ��ٴδ�ʱ������ѡ��ԭ��
 *     ��ѡ���
 *  c. ��ie��������У������������ENTER��ʱ�����Զ��ύ�������form.target="_blank", �Զ��ύ��JS�ύ
 *     ��������ύҳ�档��������ȡ����JS�в��ύ�Ĳ��ԣ�ENTER���Ƿ��ύ������ȫ��HTML���������������
 *     ��Ҳ��ʹ�����������Ӧ���ڲ���Ҫ�ύ���ĳ����С���2009-06-18���£�����ͨ��blur()ȡ�����������Ĭ��
 *     Enter��Ӧ��������ʹ�ô����߼���mouseup��һ�£�
 *  d. onItemSelect ���������ѡ��ĳ�� �� ����ѡ��ĳ��س� �󴥷���
 *  e. ��textInput�ᴥ�����ύʱ����enter keydown �� keyup֮�䣬�ͻᴥ���ύ�������keydown�в�׽�¼���
 *     ������keydown���ܲ�׽������DOWN/UP����keyup�оͲ����ˡ�
 *
 * ���õ���һЩ��̾��顿��
 *  1. ְ��һԭ�򡣷�����ְ��Ҫ��һ������hide������show���������˸ı�visibility, �Ͳ�Ҫӵ���������ܡ���
 *     ���Ƽ򵥣���Ҫ����ȴ�������ס�����ְ��һ�����ּ򵥵ĺô��ǣ�����������߼��������������Ŀɸ�����Ҳ��
 *     ���ˡ�
 *  2. С���¼��������¼�֮���й���ʱ��Ҫ��ϸ���������ƺú���д���롣����������blur����ʾ���click�¼���
 *  3. ���Ե���Ҫ�ԡ�Ŀǰ���г�Test Cases���Ժ�Ҫ�����Զ�������֤ÿ�θĶ��󣬶���Ӱ��ԭ�й��ܡ�
 *  4. ��ѡ��ȷ���¼�����ȷ���£�̫��Ҫ�ˣ���ʡȥ�ܶ�ܶෳ�ա�
 *
 */

/**
 * 2009-08-05 ���£� �� class �����������ƶ���������ԭ���ǣ��޸�Ĭ�� className �Ŀ����Ժ�С��������һ��
 *                  containerClass ��Ϊ���Ի���ʽ�Ľӿڼ���
 *
 * 2009-12-10 ���£� ���� kissy module ��֯���롣Ϊ�˱�����ɳ���£���ȫ�ֻص��������Ƕ������������⣬
 *                  ���ù���ģʽ��
 */
