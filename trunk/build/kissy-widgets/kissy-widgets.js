/*
Copyright (c) 2010, Kissy UI Library. All rights reserved.
MIT Licensed.
http://kissy.googlecode.com/

Date: 2009-12-30 15:58:46
Revision: 383
*/
/**
 * Widget
 * @creator     ��<lifesinger@gmail.com>
 * @depends     kissy, yui-base
 */
KISSY.add("widget", function(S) {

    /**
     * Widget Class
     * @constructor
     */
    function Widget(container, config) {
        var self = this;

        // factory or constructor
        if (!(self instanceof Widget)) {
            return new Widget(container, config);
        }

        /**
         * the container of widget
         * @type HTMLElement
         */
        self.container = YAHOO.util.Dom.get(container);

        /**
         * config infomation
         * @type object
         */
        self.config = config || {};
    }

    S.Widget = Widget;
});
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

        // ����������Ϣ���Զ�����Ĭ������
        if (config.panelCls) {
            Switchable.Config.mackupType = 1;
        } else if (config.panels) {
            Switchable.Config.mackupType = 2;
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
        var self = this, cfg = self.config[SWITCHABLE],
            effect = cfg.effect, Effects = Switchable.Effects;

        // ���й���Ч����Ҫ����ĵ���
        if (!cfg.circular || (effect !== SCROLLX && effect !== SCROLLY)) return;

        // ���ǹ���Ч������
        Effects[SCROLLX] = Effects[SCROLLY] = Effects.scroll = circularScroll;

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
/**
 * �����˵����
 * @module      megamenu
 * @creator     ��<lifesinger@gmail.com>
 * @depends     kissy-core, yui-base, widget, switchable
 */
KISSY.add("megamenu", function(S) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = YAHOO.lang,
        NONE = "none", BLOCK = "block",
        CLOSEBTN_TMPL = "<span class=\"{hook_cls}\"></span>",
        SWITCHABLE = "switchable",
        CLS_PREFIX = "ks-megamenu-",

        /**
         * Ĭ�����ã��� Switchable ��ͬ�����ô˴�δ�г�
         */
        defaultConfig = {
            hideDelay: .5,    // �����ӳ�

            viewCls: CLS_PREFIX + "view",
            closeBtnCls: CLS_PREFIX + "closebtn",

            showCloseBtn: true, // �Ƿ���ʾ�رհ�ť

            activeIndex: -1 // Ĭ��û�м�����
        };

    /**
     * @class MegaMenu
     * @constructor
     */
    function MegaMenu(container, config) {
        var self = this;

        // factory or constructor
        if (!(self instanceof MegaMenu)) {
            return new MegaMenu(container, config);
        }

        config = S.merge(defaultConfig, config || { });
        MegaMenu.superclass.constructor.call(self, container, config);
        self.switchable(self.config);

        // add quick access for config
        self.config = self.config[SWITCHABLE];
        self.config[SWITCHABLE] = self.config;

        /**
         * ��ʾ����
         */
        //self.view

        /**
         * ��ʾ�����������Ԫ��
         */
        //self.viewContent

        /**
         * ��ʱ��
         */
        //self.hideTimer

        // init
        self._init();

    }

    S.extend(MegaMenu, S.Widget);

    S.mix(MegaMenu.prototype, {

        /**
         * ��ʼ������
         */
        _init: function() {
            var self = this;

            self._initView();
            if (self.config.showCloseBtn) self._initCloseBtn();
        },

        /**
         * click or tab ������ trigger ʱ�������¼�
         */
        _onFocusTrigger: function(index) {
            var self = this;
            if (self.activeIndex === index) return; // �ظ����
            if (self.switchTimer) self.switchTimer.cancel(); // ���磺�������������̵������ʱ�����¼�����ȡ����
            if (self.hideTimer) self.hideTimer.cancel(); // ȡ������

            self.switchTo(index);
        },

        /**
         * ��������� trigger ��ʱ�������¼�
         */
        _onMouseEnterTrigger: function(index) {
            //S.log("Triggerable._onMouseEnterTrigger: index = " + index);
            var self = this;
            if (self.hideTimer) self.hideTimer.cancel(); // ȡ������

            // ���ظ����������磺����ʾ����ʱ���������ٻ����ٻ����������ش���
            self.switchTimer = Lang.later(self.config.delay * 1000, self, function() {
                self.switchTo(index);
            });
        },

        /**
         * ����Ƴ� trigger ʱ�������¼�
         */
        _onMouseLeaveTrigger: function() {
            var self = this;
            if (self.switchTimer) self.switchTimer.cancel();

            self.hideTimer = Lang.later(self.config.hideDelay * 1000, self, function() {
                self.hide();
            });
        },

        /**
         * ��ʼ����ʾ����
         */
        _initView: function() {
            var self = this, cfg = self.config,
                view = Dom.getElementsByClassName(cfg.viewCls, "*", self.container)[0];

            // �Զ����� view
            if (!view) {
                view = document.createElement("DIV");
                view.className = cfg.viewCls;
                self.container.appendChild(view);
            }

            // init events
            Event.on(view, "mouseenter", function() {
                if (self.hideTimer) self.hideTimer.cancel();
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
         * �л���ͼ�ڵ�����
         * @override
         */
        _switchView: function(oldContents, newContents, index) {
            var self = this;

            // ��ʾ view
            self.view.style.display = BLOCK;

            // ����������
            self.viewContent.innerHTML = newContents[0].innerHTML;

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

    S.MegaMenu = MegaMenu;
});

/**
 * TODO:
 *   - �� YAHOO ��ҳ��������ʾ���λ������Ӧ
 *//**
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
