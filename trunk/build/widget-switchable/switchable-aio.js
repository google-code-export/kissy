/*
Copyright (c) 2010, Kissy UI Library. All rights reserved.
MIT Licensed.
http://kissy.googlecode.com/

Date: 2009-12-30 20:23:55
Revision: 388
*/
/**
 * Switchable
 * @creator     ��<lifesinger@gmail.com>
 * @depends     kissy, yui-base, widget
 */
KISSY.add("switchable", function(S) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = YAHOO.lang,
        UNDEFINED = "undefined",
        DISPLAY = "display", BLOCK = "block", NONE = "none",
        FORWARD = "forward", BACKWARD = "backward",
        SWITCHABLE = "switchable",
        BEFORE_SWITCH = "beforeSwitch", ON_SWITCH = "onSwitch",
        CLS_PREFIX = "ks-switchable-";

    function Switchable() {
    }

    Switchable.Config = {
        mackupType: 0, // mackup �����ͣ�ȡֵ���£�

        // 0 - Ĭ�Ͻṹ��ͨ�� nav �� content ����ȡ triggers �� panels
        navCls: CLS_PREFIX + "nav",
        contentCls: CLS_PREFIX + "content",

        // 1 - �ʶ���ͨ�� cls ����ȡ triggers �� panels
        triggerCls: CLS_PREFIX + "trigger",
        panelCls: CLS_PREFIX + "panel",

        // 2 - ��ȫ���ɣ�ֱ�Ӵ��� triggers �� panels
        triggers: [],
        panels: [],

        // �Ƿ��д���
        hasTriggers: true,

        // ��������
        triggerType: "mouse", // or "click"
        // �����ӳ�
        delay: .1, // 100ms

        activeIndex: 0, // mackup ��Ĭ�ϼ����Ӧ����� index һ��
        activeTriggerCls: "active",

        // �л���ͼ���ж��ٸ� panels
        steps: 1,

        // �л���ͼ����Ĵ�С��һ�㲻��Ҫ�趨��ֵ��������ȡֵ����ȷʱ�������ֹ�ָ����С
        viewSize: []
    };

    /**
     * Attaches switchable ablility to Widget.
     * required members��
     *   - this.container
     *   - this.config
     * attached members:
     *   - this.triggers  ����Ϊ��ֵ []
     *   - this.panels    �϶���ֵ���� length > 1
     *   - this.content
     *   - this.length
     *   - this.activeIndex
     *   - this.switchTimer
     */
    S.Widget.prototype.switchable = function(config) {
        var self = this;
        config = config || {};

        // ����������Ϣ������Ĭ������
        if (!("mackupType" in config)) {
            if (config.panelCls) {
                config.mackupType = 1;
            } else if (config.panels) {
                config.mackupType = 2;
            }
        }

        /**
         * ���ò���
         * @type object
         */
        self.config[SWITCHABLE] = S.merge(Switchable.Config, config || {});

        /**
         * triggers
         * @type Array of HTMLElement
         */
        self.triggers = self.triggers || [];

        /**
         * panels
         * @type Array of HTMLElement
         */
        self.panels = self.panels || [];

        /**
         * length = panels.length / steps
         * @type number
         */
        //self.length

        /**
         * the parentNode of panels
         * @type HTMLElement
         */
        //self.content

        /**
         * ��ǰ����� index
         * @type number
         */
        if (typeof self.activeIndex === UNDEFINED) {
            self.activeIndex = self.config[SWITCHABLE].activeIndex;
        }

        // attach and init
        S.mix(self, Switchable.prototype, false);
        self._initSwitchable();

        return self; // support chain
    };

    S.mix(Switchable.prototype, {

        /**
         * init switchable
         */
        _initSwitchable: function() {
            var self = this, cfg = self.config[SWITCHABLE];

            // parse mackup
            if (self.panels.length === 0) {
                self._parseSwitchableMackup();
            }

            // create custom events
            self.createEvent(BEFORE_SWITCH);
            self.createEvent(ON_SWITCH);

            // bind triggers
            if (cfg.hasTriggers) {
                self._bindTriggers();
            }
        },

        /**
         * ���� mackup �� switchable ���֣���ȡ triggers, panels, content
         */
        _parseSwitchableMackup: function() {
            var self = this, container = self.container,
                cfg = self.config[SWITCHABLE], hasTriggers = cfg.hasTriggers,
                nav, content, triggers = [], panels = [], i, n, m,
                getElementsByClassName = Dom.getElementsByClassName;

            switch (cfg.mackupType) {
                case 0: // Ĭ�Ͻṹ
                    nav = getElementsByClassName(cfg.navCls, "*", container)[0];
                    if (nav) triggers = Dom.getChildren(nav);
                    content = getElementsByClassName(cfg.contentCls, "*", container)[0];
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


            // get length
            n = panels.length;
            self.length = n / cfg.steps;

            // �Զ����� triggers
            if (hasTriggers && n > 0 && triggers.length === 0) {
                triggers = self._generateTriggersMackup(self.length);
            }

            // �� triggers ת��Ϊ��ͨ����
            if (hasTriggers) {
                for (i = 0,m = triggers.length; i < m; i++) {
                    self.triggers.push(triggers[i]);
                }
            }
            // �� panels ת��Ϊ��ͨ����
            for (i = 0; i < n; i++) {
                self.panels.push(panels[i]);
            }

            // get content
            self.content = content || panels[0].parentNode;
        },

        /**
         * �Զ����� triggers �� mackup
         */
        _generateTriggersMackup: function(len) {
            var self = this, cfg = self.config[SWITCHABLE],
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
            return Dom.getChildren(ul);
        },

        /**
         * �� triggers ����¼�
         */
        _bindTriggers: function() {
            var self = this, cfg = self.config[SWITCHABLE],
                triggers = self.triggers, trigger,
                i, len = triggers.length;

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
         */
        _onFocusTrigger: function(index) {
            var self = this;
            if (self.activeIndex === index) return; // �ظ����
            if (self.switchTimer) self.switchTimer.cancel(); // ���磺�������������̵������ʱ�����¼�����ȡ����
            self.switchTo(index);
        },

        /**
         * ��������� trigger ��ʱ�������¼�
         */
        _onMouseEnterTrigger: function(index) {
            var self = this;
            //S.log("Triggerable._onMouseEnterTrigger: index = " + index);

            // ���ظ����������磺����ʾ����ʱ���������ٻ����ٻ����������ش���
            if (self.activeIndex !== index) {
                self.switchTimer = Lang.later(self.config[SWITCHABLE].delay * 1000, self, function() {
                    self.switchTo(index);
                });
            }
        },

        /**
         * ����Ƴ� trigger ʱ�������¼�
         */
        _onMouseLeaveTrigger: function() {
            var self = this;
            if (self.switchTimer) self.switchTimer.cancel();
        },

        /**
         * �л�����
         */
        switchTo: function(index, direction) {
            var self = this, cfg = self.config[SWITCHABLE],
                triggers = self.triggers, panels = self.panels,
                activeIndex = self.activeIndex,
                steps = cfg.steps,
                fromIndex = activeIndex * steps, toIndex = index * steps;
            //S.log("Triggerable.switchTo: index = " + index);

            if (index === activeIndex) return self;
            if (!self.fireEvent(BEFORE_SWITCH, index)) return self;

            // switch active trigger
            if (cfg.hasTriggers) {
                self._switchTrigger(activeIndex > -1 ? triggers[activeIndex] : null, triggers[index]);
            }

            // switch active panels
            if (typeof direction === UNDEFINED) {
                direction = index > activeIndex ? FORWARD : FORWARD;
            }
            // TODO: slice �Ƿ����������½�����Ҫ����
            self._switchView(
                panels.slice(fromIndex, fromIndex + steps),
                panels.slice(toIndex, toIndex + steps),
                index,
                direction);

            // update activeIndex
            self.activeIndex = index;

            return self; // chain
        },

        /**
         * �л���ǰ����
         */
        _switchTrigger: function(fromTrigger, toTrigger/*, index*/) {
            var activeTriggerCls = this.config[SWITCHABLE].activeTriggerCls;

            if (fromTrigger) Dom.removeClass(fromTrigger, activeTriggerCls);
            Dom.addClass(toTrigger, activeTriggerCls);
        },

        /**
         * �л���ǰ��ͼ
         */
        _switchView: function(fromPanels, toPanels, index/*, direction*/) {
            // ��򵥵��л�Ч����ֱ������/��ʾ
            Dom.setStyle(fromPanels, DISPLAY, NONE);
            Dom.setStyle(toPanels, DISPLAY, BLOCK);

            // fire onSwitch
            this.fireEvent(ON_SWITCH, index);
        },

        /**
         * �л�����һ����ͼ
         */
        prev: function() {
            var self = this, activeIndex = self.activeIndex;
            self.switchTo(activeIndex > 0 ? activeIndex - 1 : self.length - 1, BACKWARD);
            // TODO: fire event when at first/last view.
        },

        /**
         * �л�����һ����ͼ
         */
        next: function() {
            var self = this, activeIndex = self.activeIndex;
            self.switchTo(activeIndex < self.length - 1 ? activeIndex + 1 : 0, FORWARD);
        }
    });

    S.augment(Switchable, Y.EventProvider);
    
    S.Switchable = Switchable;
});
/**
 * Switchable Autoplay Plugin
 * @creator     ��<lifesinger@gmail.com>
 * @depends     kissy, yui-base, widget, switchable
 */
KISSY.add("switchable-autoplay", function(S) {

    var Y = YAHOO.util, Event = Y.Event, Lang = YAHOO.lang,
        SWITCHABLE = "switchable",
        Switchable = S.Switchable;

    /**
     * ���Ĭ������
     */
    S.mix(Switchable.Config, {
        autoplay: false,
        interval: 5, // �Զ����ż��ʱ��
        pauseOnHover: true  // triggerType Ϊ mouse ʱ�������ͣ�� slide ���Ƿ���ͣ�Զ�����
    });

    /**
     * ֯���ʼ������
     * attached members:
     *   - this.paused
     *   - this.autoPlayTimer
     */
    S.weave(function() {
        var self = this, cfg = self.config[SWITCHABLE];
        if (!cfg.autoplay) return;

        // �����ͣ��ֹͣ�Զ�����
        if (cfg.pauseOnHover) {
            Event.on(self.container, "mouseenter", function() {
                self.paused = true;
            });
            Event.on(self.container, "mouseleave", function() {
                self.paused = false;
            });
        }

        // �����Զ�����
        self.autoplayTimer = Lang.later(cfg.interval * 1000, self, function() {
            if (self.paused) return;
            self.switchTo(self.activeIndex < self.length - 1 ? self.activeIndex + 1 : 0);
        }, null, true);

    }, "after", Switchable.prototype, "_initSwitchable");
});

/**
 * TODO:
 *  - �Ƿ���Ҫ�ṩ play / pause / stop API ?
 *  - autoplayTimer �� switchTimer �Ĺ�����
 */
/**
 * Switchable Effect Plugin
 * @creator     ��<lifesinger@gmail.com>
 * @depends     kissy, yui-base, yui-animation, widget, switchable
 */
KISSY.add("switchable-effect", function(S) {

    var Y = YAHOO.util, Dom = Y.Dom,
        SWITCHABLE = "switchable",
        DISPLAY = "display", BLOCK = "block", NONE = "none",
        OPACITY = "opacity", Z_INDEX = "z-index",
        RELATIVE = "relative", ABSOLUTE = "absolute",
        SCROLLX = "scrollx", SCROLLY = "scrolly", FADE = "fade",
        Switchable = S.Switchable, Effects;

    /**
     * ���Ĭ������
     */
    S.mix(Switchable.Config, {
        effect: NONE, // "scrollx", "scrolly", "fade" ����ֱ�Ӵ��� custom effect fn
        duration: .5, // ������ʱ��
        easing: Y.Easing.easeNone // easing method
    });

    /**
     * ����Ч����
     */
    Switchable.Effects = {

        // �����ص���ʾ/����Ч��
        none: function(fromEls, toEls, callback) {
            Dom.setStyle(fromEls, DISPLAY, NONE);
            Dom.setStyle(toEls, DISPLAY, BLOCK);
            callback();
        },

        // ��������Ч��
        fade: function(fromEls, toEls, callback) {
            if(fromEls.length !== 1) {
                throw new Error("fade effect only supports steps == 1.");
            }
            var self = this, cfg = self.config[SWITCHABLE],
                fromEl = fromEls[0], toEl = toEls[0];
            if (self.anim) self.anim.stop();

            // ������ʾ��һ��
            Dom.setStyle(toEl, OPACITY, 1);

            // �����л�
            self.anim = new Y.Anim(fromEl, {opacity: {to: 0}}, cfg.duration, cfg.easing);
            self.anim.onComplete.subscribe(function() {
                self.anim = null; // free

                // �л� z-index
                Dom.setStyle(toEl, Z_INDEX, 9);
                Dom.setStyle(fromEl, Z_INDEX, 1);

                callback();
            });
            self.anim.animate();
        },

        // ˮƽ/��ֱ����Ч��
        scroll: function(fromEls, toEls, callback, index) {
            var self = this, cfg = self.config[SWITCHABLE],
                isX = cfg.effect === SCROLLX,
                diff = self.viewSize[isX ? 0 : 1] * index,
                attributes = {};

            attributes[isX ? "left" : "top"] = { to: -diff };

            if (self.anim) self.anim.stop();
            self.anim = new Y.Anim(self.content, attributes, cfg.duration, cfg.easing);
            self.anim.onComplete.subscribe(function() {
                self.anim = null; // free
                callback();
            });
            self.anim.animate();
        }
    };
    Effects = Switchable.Effects;
    Effects[SCROLLX] = Effects[SCROLLY] = Effects.scroll;

    /**
     * ֯���ʼ������������ effect, ������ʼ״̬
     * attached members:
     *   - this.viewSize
     */
    S.weave(function() {
        var self = this, cfg = self.config[SWITCHABLE],
            effect = cfg.effect, panels = self.panels, steps = cfg.steps,
            activeIndex = self.activeIndex,
            fromIndex = activeIndex * steps, toIndex = fromIndex + steps - 1,
            i, len = panels.length;

        // 1. ��ȡ�߿�
        self.viewSize = [
            cfg.viewSize[0] || panels[0].offsetWidth * steps,
            cfg.viewSize[0] || panels[0].offsetHeight * steps
            ];
        // ע������ panel �ĳߴ�Ӧ����ͬ
        //    ���ָ����һ�� panel �� width �� height����Ϊ Safari �£�ͼƬδ����ʱ����ȡ�� offsetHeight ��ֵ�᲻��

        // 2. ��ʼ�� panels ��ʽ
        if (effect !== NONE) { // effect = scrollx, scrolly, fade
            // ��Щ��Ч��Ҫ�� panels ����ʾ����
            for (i = 0; i < len; i++) {
                panels[i].style.display = BLOCK;
            }

            switch (effect) {
                // ����ǹ���Ч��
                case SCROLLX:
                case SCROLLY:
                    // ���ö�λ��Ϣ��Ϊ����Ч�����̵�
                    self.content.style.position = ABSOLUTE;
                    self.content.parentNode.style.position = RELATIVE; // ע��content �ĸ�����һ���� container

                    // ˮƽ����
                    if (effect === SCROLLX) {
                        Dom.setStyle(panels, "float", "left");

                        // ��������ȣ��Ա�֤�пռ��� panels ˮƽ�Ų�
                        this.content.style.width = self.viewSize[0] * (len / steps) + "px";
                    }
                    break;

                // �����͸��Ч�������ʼ��͸��
                case FADE:
                    for (i = 0; i < len; i++) {
                        Dom.setStyle(panels[i], OPACITY, (i >= fromIndex && i <= toIndex) ? 1 : 0);
                        panels[i].style.position = ABSOLUTE;
                        panels[i].style.zIndex = (i >= fromIndex && i <= toIndex) ? 9 : 1;
                    }
                    break;
            }
        }

        // 3. �� CSS ���Ҫ�� container �趨�߿�� overflow: hidden
        //    nav �� cls �� CSS ָ��

    }, "after", Switchable.prototype, "_initSwitchable");

    /**
     * �����л�����
     */
    S.mix(Switchable.prototype, {
       /**
         * �л���ͼ
         */
        _switchView: function(fromEls, toEls, index, direction) {
            var self = this, cfg = self.config[SWITCHABLE],
                effect = cfg.effect,
                fn = typeof effect === "function" ? effect : Effects[effect];

            fn.call(self, fromEls, toEls, function() {
                // fire event
                self.fireEvent("onSwitch", index);
            }, index, direction);
        }
    });
});

/**
 * TODO:
 *  - apple ��ҳЧ��
 */
/**
 * Switchable Circular Plugin
 * @creator     ��<lifesinger@gmail.com>
 * @depends     kissy, yui-base, widget, switchable
 */
KISSY.add("switchable-circular", function(S) {

    var Y = YAHOO.util,
        SWITCHABLE = "switchable",
        RELATIVE = "relative",
        LEFT = "left", TOP = "top",
        PX = "px", EMPTY = "",
        FORWARD = "forward", BACKWARD = "backward",
        SCROLLX = "scrollx", SCROLLY = "scrolly",
        Switchable = S.Switchable;

    /**
     * ���Ĭ������
     */
    S.mix(Switchable.Config, {
        circular: false
    });

    /**
     * ѭ������Ч������
     */
    function circularScroll(fromEls, toEls, callback, index, direction) {
        var self = this, cfg = self.config[SWITCHABLE],
            len = self.length,
            activeIndex = self.activeIndex,
            isX = cfg.effect === SCROLLX,
            prop = isX ? LEFT : TOP,
            viewDiff = self.viewSize[isX ? 0 : 1],
            diff = -viewDiff * index,
            attributes = {},
            isCritical,
            isBackward = direction === BACKWARD;

        // �ӵ�һ��������������һ�� or �����һ�������������һ��
        isCritical = (isBackward && activeIndex === 0 && index === len - 1)
                     || (direction === FORWARD && activeIndex === len - 1 && index === 0);

        if(isCritical) {
            // ����λ�ò���ȡ diff
            diff = adjustPosition.call(self, self.panels, index, isBackward, prop, viewDiff);
        }
        attributes[prop] = { to: diff };

        // ��ʼ����
        if (self.anim) self.anim.stop();
        self.anim = new Y.Anim(self.content, attributes, cfg.duration, cfg.easing);
        self.anim.onComplete.subscribe(function() {
            if(isCritical) {
                // ��ԭλ��
                resetPosition.call(self, self.panels, index, isBackward, prop, viewDiff);
            }
            // free
            self.anim = null;
            callback();
        });
        self.anim.animate();
    }

    /**
     * ����λ��
     */
    function adjustPosition(panels, index, isBackward, prop, viewDiff) {
        var self = this, cfg = self.config[SWITCHABLE],
            steps = cfg.steps,
            len = self.length,
            start = isBackward ? len - 1 : 0,
            from = start * steps,
            to = (start + 1) * steps,
            i;

        // ���� panels ����һ����ͼ��
        for (i = from; i < to; i++) {
            panels[i].style.position = RELATIVE;
            panels[i].style[prop] = (isBackward ? "-" : EMPTY) + viewDiff * len + PX;
        }

        // ƫ����
        return isBackward ? viewDiff : -viewDiff * len;
    }

    /**
     * ��ԭλ��
     */
    function resetPosition(panels, index, isBackward, prop, viewDiff) {
        var self = this, cfg = self.config[SWITCHABLE],
            steps = cfg.steps,
            len = self.length,
            start = isBackward ? len - 1 : 0,
            from = start * steps,
            to = (start + 1) * steps,
            i;

        // ������ɺ󣬸�λ������״̬
        for (i = from; i < to; i++) {
            panels[i].style.position = EMPTY;
            panels[i].style[prop] = EMPTY;
        }

        // ˲�Ƶ�����λ��
        self.content.style[prop] = isBackward ? -viewDiff * (len - 1) + PX : EMPTY;
    }

    /**
     * ֯���ʼ������
     */
    S.weave(function() {
        var self = this, cfg = self.config[SWITCHABLE];

        // ���й���Ч����Ҫ����ĵ���
        if (cfg.circular && (cfg.effect === SCROLLX || cfg.effect === SCROLLY)) {
            // ���ǹ���Ч������
            cfg.effect = circularScroll;
        }

    }, "after", Switchable.prototype, "_initSwitchable");
});

/**
 * TODO:
 *   - �Ƿ���Ҫ���Ǵ� 0 �� 2�������һ���� �� backward ��������Ҫ�����
 *//**
 * Switchable Lazyload Plugin
 * @creator     ��<lifesinger@gmail.com>
 * @depends     kissy, yui-base, widget, switchable, datalazyload
 */
KISSY.add("switchable-lazyload", function(S) {

    var Y = YAHOO.util, Dom = Y.Dom,
        SWITCHABLE = "switchable",
        BEFORE_SWITCH = "beforeSwitch",
        IMG_SRC = "img-src", TEXTAREA_DATA = "textarea-data",
        FLAGS = {},
        Switchable = S.Switchable,
        DataLazyload = S.DataLazyload;

    FLAGS[IMG_SRC] = "data-lazyload-src-custom";
    FLAGS[TEXTAREA_DATA] = "ks-datalazyload-custom";

    /**
     * ���Ĭ������
     */
    S.mix(Switchable.Config, {
        lazyDataType: "", // "img-src" or "textarea-data"
        lazyDataFlag: "" // "data-lazyload-src-custom" or "ks-datalazyload-custom"
    });

    /**
     * ֯���ʼ������
     */
    S.weave(function() {
        var self = this, cfg = self.config[SWITCHABLE],
            type = cfg.lazyDataType, flag = cfg.lazyDataFlag || FLAGS[type];
        if(!DataLazyload || !type || !flag) return; // û���ӳ���

        self.subscribe(BEFORE_SWITCH, loadLazyData);

        /**
         * �����ӳ�����
         */
        function loadLazyData(index) {
            //S.log("switchable-lazyload: index = " + index);
            var steps = cfg.steps, from = index * steps , to = from + steps;

            DataLazyload.loadCustomLazyData(self.panels.slice(from, to), type, flag);
            if(isAllDone()) {
                self.unsubscribe(BEFORE_SWITCH, loadLazyData);
            }
        }

        /**
         * �Ƿ��Ѽ������
         */
        function isAllDone() {
            var imgs, textareas, i, len;

            if(type === IMG_SRC) {
                imgs = self.container.getElementsByTagName("img");
                for(i = 0, len = imgs.length; i < len; i++) {
                    if(imgs[i].getAttribute(flag)) return false;
                }
            } else if(type === TEXTAREA_DATA) {
                textareas = self.container.getElementsByTagName("textarea");
                for(i = 0, len = textareas.length; i < len; i++) {
                    if(Dom.hasClass(textareas[i], flag)) return false;
                }
            }

            return true;
        }

    }, "after", Switchable.prototype, "_initSwitchable");
});
/**
 * Tabs Widget
 * @creator     ��<lifesinger@gmail.com>
 * @depends     kissy, yui-base
 */
KISSY.add("tabs", function(S) {

    var SWITCHABLE = "switchable";

    /**
     * Tabs Class
     * @constructor
     */
    function Tabs(container, config) {
        var self = this;

        // factory or constructor
        if (!(self instanceof Tabs)) {
            return new Tabs(container, config);
        }

        Tabs.superclass.constructor.call(self, container, config);
        self.switchable(self.config);

        // add quick access for config
        self.config = self.config[SWITCHABLE];
        self.config[SWITCHABLE] = self.config;
    }

    S.extend(Tabs, S.Widget);
    S.Tabs = Tabs;
});
/**
 * Tabs Widget
 * @creator     ��<lifesinger@gmail.com>
 * @depends     kissy, yui-base
 */
KISSY.add("slide", function(S) {

    var SWITCHABLE = "switchable",

    /**
     * Ĭ�����ã��� Switchable ��ͬ�Ĳ��ִ˴�δ�г�
     */
    defaultConfig = {
        autoplay: true,
        circular: true
    };

    /**
     * Slide Class
     * @constructor
     */
    function Slide(container, config) {
        var self = this;

        // factory or constructor
        if (!(self instanceof Slide)) {
            return new Slide(container, config);
        }

        config = S.merge(defaultConfig, config || { });
        Slide.superclass.constructor.call(self, container, config);
        self.switchable(self.config);

        // add quick access for config
        self.config = self.config[SWITCHABLE];
        self.config[SWITCHABLE] = self.config;
    }

    S.extend(Slide, S.Widget);
    S.Slide = Slide;
});
/**
 * Carousel Widget
 * @creator     ��<lifesinger@gmail.com>
 * @depends     kissy, yui-base
 */
KISSY.add("carousel", function(S) {

    var SWITCHABLE = "switchable",

        /**
         * Ĭ�����ã��� Switchable ��ͬ�Ĳ��ִ˴�δ�г�
         */
        defaultConfig = {
            circular: true
        };

    /**
     * Carousel Class
     * @constructor
     */
    function Carousel(container, config) {
        var self = this;

        // factory or constructor
        if (!(self instanceof Carousel)) {
            return new Carousel(container, config);
        }

        config = S.merge(defaultConfig, config || { });
        Carousel.superclass.constructor.call(self, container, config);
        self.switchable(self.config);

        // add quick access for config
        self.config = self.config[SWITCHABLE];
        self.config[SWITCHABLE] = self.config;
    }

    S.extend(Carousel, S.Widget);
    S.Carousel = Carousel;
});
