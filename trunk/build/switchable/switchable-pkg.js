/*
Copyright 2010, KISSY UI Library v1.0.8
MIT Licensed
build: 881 Jul 19 23:46
*/
/**
 * Switchable
 * @creator  玉伯<lifesinger@gmail.com>
 * @depends  ks-core
 */
KISSY.add('switchable', function(S, undefined) {

    var DOM = S.DOM, Event = S.Event,
        DISPLAY = 'display', BLOCK = 'block', NONE = 'none',
        FORWARD = 'forward', BACKWARD = 'backward',
        DOT = '.',
        EVENT_BEFORE_SWITCH = 'beforeSwitch', EVENT_SWITCH = 'switch',
        CLS_PREFIX = 'ks-switchable-';

    /**
     * Switchable Widget
     * attached members：
     *   - this.container
     *   - this.config
     *   - this.triggers  可以为空值 []
     *   - this.panels    可以为空值 []
     *   - this.content
     *   - this.length
     *   - this.activeIndex
     *   - this.switchTimer
     */
    function Switchable(container, config) {
        var self = this;

        // 调整配置信息
        config = config || {};
        if (!('markupType' in config)) {
            if (config.panelCls) {
                config.markupType = 1;
            } else if (config.panels) {
                config.markupType = 2;
            }
        }
        config = S.merge(Switchable.Config, config);

        /**
         * the container of widget
         * @type HTMLElement
         */
        self.container = S.get(container);

        /**
         * 配置参数
         * @type Object
         */
        self.config = config;

        /**
         * triggers
         * @type Array of HTMLElement
         */
        //self.triggers

        /**
         * panels
         * @type Array of HTMLElement
         */
        //self.panels

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
         * 当前激活的 index
         * @type Number
         */
        self.activeIndex = config.activeIndex;

        self._init();
    }

    // 默认配置
    Switchable.Config = {
        markupType: 0, // markup 的类型，取值如下：

        // 0 - 默认结构：通过 nav 和 content 来获取 triggers 和 panels
        navCls: CLS_PREFIX + 'nav',
        contentCls: CLS_PREFIX + 'content',

        // 1 - 适度灵活：通过 cls 来获取 triggers 和 panels
        triggerCls: CLS_PREFIX + 'trigger',
        panelCls: CLS_PREFIX + 'panel',

        // 2 - 完全自由：直接传入 triggers 和 panels
        triggers: [],
        panels: [],

        // 是否有触点
        hasTriggers: true,

        // 触发类型
        triggerType: 'mouse', // or 'click'
        // 触发延迟
        delay: .1, // 100ms

        activeIndex: 0, // markup 的默认激活项，应该与此 index 一致
        activeTriggerCls: 'active',

        // 可见视图内有多少个 panels
        steps: 1,

        // 可见视图区域的大小。一般不需要设定此值，仅当获取值不正确时，用于手工指定大小
        viewSize: []
    };

    // 插件
    Switchable.Plugins = [];

    S.augment(Switchable, S.EventTarget, {

        /**
         * init switchable
         */
        _init: function() {
            var self = this, cfg = self.config;

            // parse markup
            self._parseMarkup();

            // bind triggers
            if (cfg.hasTriggers) {
                self._bindTriggers();
            }

            // init plugins
            S.each(Switchable.Plugins, function(plugin) {
                if(plugin.init) {
                    plugin.init(self);
                }
            });
        },

        /**
         * 解析 markup, 获取 triggers, panels, content
         */
        _parseMarkup: function() {
            var self = this, container = self.container,
                cfg = self.config,
                nav, content, triggers = [], panels = [], i, n, m;

            switch (cfg.markupType) {
                case 0: // 默认结构
                    nav = S.get(DOT + cfg.navCls, container);
                    if (nav) triggers = DOM.children(nav);
                    content = S.get(DOT + cfg.contentCls, container);
                    panels = DOM.children(content);
                    break;
                case 1: // 适度灵活
                    triggers = S.query(DOT + cfg.triggerCls, container);
                    panels = S.query(DOT + cfg.panelCls, container);
                    break;
                case 2: // 完全自由
                    triggers = cfg.triggers;
                    panels = cfg.panels;
                    break;
            }


            // get length
            n = panels.length;
            self.length = n / cfg.steps;

            // 自动生成 triggers
            if (cfg.hasTriggers && n > 0 && triggers.length === 0) {
                triggers = self._generateTriggersMarkup(self.length);
            }

            // 将 triggers 和 panels 转换为普通数组
            self.triggers = S.makeArray(triggers);
            self.panels = S.makeArray(panels);

            // get content
            self.content = content || panels[0].parentNode;
        },

        /**
         * 自动生成 triggers 的 markup
         */
        _generateTriggersMarkup: function(len) {
            var self = this, cfg = self.config,
                ul = DOM.create('<ul>'), li, i;

            ul.className = cfg.navCls;
            for (i = 0; i < len; i++) {
                li = DOM.create('<li>');
                if (i === self.activeIndex) {
                    li.className = cfg.activeTriggerCls;
                }
                li.innerHTML = i + 1;
                ul.appendChild(li);
            }

            self.container.appendChild(ul);
            return DOM.children(ul);
        },

        /**
         * 给 triggers 添加事件
         */
        _bindTriggers: function() {
            var self = this, cfg = self.config,
                triggers = self.triggers, trigger,
                i, len = triggers.length;

            for (i = 0; i < len; i++) {
                (function(index) {
                    trigger = triggers[index];

                    // 响应点击和 Tab 键
                    Event.on(trigger, 'click focus', function() {
                        self._onFocusTrigger(index);
                    });

                    // 响应鼠标悬浮
                    if (cfg.triggerType === 'mouse') {
                        Event.on(trigger, 'mouseenter', function() {
                            self._onMouseEnterTrigger(index);
                        });
                        Event.on(trigger, 'mouseleave', function() {
                            self._onMouseLeaveTrigger(index);
                        });
                    }
                })(i);
            }
        },

        /**
         * click or tab 键激活 trigger 时触发的事件
         */
        _onFocusTrigger: function(index) {
            var self = this;
            if (self.activeIndex === index) return; // 重复点击
            this._cancelSwitchTimer(); // 比如：先悬浮，再立刻点击，这时悬浮触发的切换可以取消掉。

            self.switchTo(index);
        },

        /**
         * 鼠标悬浮在 trigger 上时触发的事件
         */
        _onMouseEnterTrigger: function(index) {
            var self = this;
            if (self.activeIndex === index) return; // 重复悬浮。比如：已显示内容时，将鼠标快速滑出再滑进来，不必再次触发。

            self.switchTimer = S.later(function() {
                self.switchTo(index);
            }, self.config.delay * 1000);
        },

        /**
         * 鼠标移出 trigger 时触发的事件
         */
        _onMouseLeaveTrigger: function() {
            this._cancelSwitchTimer();
        },

        /**
         * 取消切换定时器
         */
        _cancelSwitchTimer: function() {
            var self = this;
            if(self.switchTimer) {
                self.switchTimer.cancel();
                self.switchTimer = undefined;
            }
        },

        /**
         * 切换操作
         */
        switchTo: function(index, direction) {
            var self = this, cfg = self.config,
                triggers = self.triggers, panels = self.panels,
                activeIndex = self.activeIndex,
                steps = cfg.steps,
                fromIndex = activeIndex * steps, toIndex = index * steps;

            if (index === activeIndex) return self; // 再次避免重复触发
            if (self.fire(EVENT_BEFORE_SWITCH, {toIndex: index}) === false) return self;

            // switch active trigger
            if (cfg.hasTriggers) {
                self._switchTrigger(activeIndex > -1 ? triggers[activeIndex] : null, triggers[index]);
            }

            // switch active panels
            if (direction === undefined) {
                direction = index > activeIndex ? FORWARD : BACKWARD;
            }

            // switch view
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
         * 切换当前触点
         */
        _switchTrigger: function(fromTrigger, toTrigger/*, index*/) {
            var activeTriggerCls = this.config.activeTriggerCls;

            if (fromTrigger) DOM.removeClass(fromTrigger, activeTriggerCls);
            DOM.addClass(toTrigger, activeTriggerCls);
        },

        /**
         * 切换视图
         */
        _switchView: function(fromPanels, toPanels/*, index, direction*/) {
            // 最简单的切换效果：直接隐藏/显示
            DOM.css(fromPanels, DISPLAY, NONE);
            DOM.css(toPanels, DISPLAY, BLOCK);

            // fire onSwitch
            this.fire(EVENT_SWITCH);
        },

        /**
         * 切换到上一视图
         */
        prev: function() {
            var self = this, activeIndex = self.activeIndex;
            self.switchTo(activeIndex > 0 ? activeIndex - 1 : self.length - 1, BACKWARD);
        },

        /**
         * 切换到下一视图
         */
        next: function() {
            var self = this, activeIndex = self.activeIndex;
            self.switchTo(activeIndex < self.length - 1 ? activeIndex + 1 : 0, FORWARD);
        }
    });

    S.Switchable = Switchable;
});

/**
 * NOTES:
 *
 * 2010.07
 *  - 重构，去掉对 YUI2-Animation 的依赖
 *
 * 2010.04
 *  - 重构，脱离对 yahoo-dom-event 的依赖
 *
 * 2010.03
 *  - 重构，去掉 Widget, 部分代码直接采用 kissy 基础库
 *  - 插件机制从 weave 织入法改成 hook 钩子法
 *
 * TODO:
 *  - http://malsup.com/jquery/cycle/
 *  - http://www.mall.taobao.com/go/chn/mall_chl/flagship.php
 *  - 对 touch 设备的支持
 *
 * References:
 *  - jQuery Scrollable http://flowplayer.org/tools/scrollable.html
 *
 */
/**
 * Switchable Autoplay Plugin
 * @creator  玉伯<lifesinger@gmail.com>
 */
KISSY.add('switchable-autoplay', function(S) {

    var Event = S.Event,
        Switchable = S.Switchable;

    /**
     * 添加默认配置
     */
    S.mix(Switchable.Config, {
        autoplay: false,
        interval: 5, // 自动播放间隔时间
        pauseOnHover: true  // triggerType 为 mouse 时，鼠标悬停在 slide 上是否暂停自动播放
    });

    /**
     * 添加插件
     * attached members:
     *   - this.paused
     *   - this.autoplayTimer
     */
    Switchable.Plugins.push({

        name: 'autoplay',

        init: function(host) {
            var cfg = host.config;
            if (!cfg.autoplay) return;

            // 鼠标悬停，停止自动播放
            if (cfg.pauseOnHover) {
                Event.on(host.container, 'mouseenter', function() {
                    host.paused = true;
                });
                Event.on(host.container, 'mouseleave', function() {
                    // 假设 interval 为 10s
                    // 在 8s 时，通过 focus 主动触发切换，停留 1s 后，鼠标移出
                    // 这时如果不 setTimeout, 再过 1s 后，主动触发的 panel 将被替换掉
                    // 为了保证每个 panel 的显示时间都不小于 interval, 此处加上 setTimeout
                    S.later(function() {
                        host.paused = false;
                    }, cfg.interval * 1000);
                });
            }

            // 设置自动播放
            host.autoplayTimer = S.later(function() {
                if (host.paused) return;
                host.switchTo(host.activeIndex < host.length - 1 ? host.activeIndex + 1 : 0);
            }, cfg.interval * 1000, true);
        }
    });
});

/**
 * TODO:
 *  - 是否需要提供 play / pause / stop API ?
 *  - autoplayTimer 和 switchTimer 的关联？
 */
/**
 * Switchable Effect Plugin
 * @creator  玉伯<lifesinger@gmail.com>
 */
KISSY.add('switchable-effect', function(S, undefined) {

    var DOM = S.DOM, Anim = S.Anim,
        DISPLAY = 'display', BLOCK = 'block', NONE = 'none',
        OPACITY = 'opacity', Z_INDEX = 'z-index',
        POSITION = 'position', RELATIVE = 'relative', ABSOLUTE = 'absolute',
        SCROLLX = 'scrollx', SCROLLY = 'scrolly', FADE = 'fade',
        LEFT = 'left', TOP = 'top', FLOAT = 'float',
        Switchable = S.Switchable, Effects;

    /**
     * 添加默认配置
     */
    S.mix(Switchable.Config, {
        effect: NONE, // 'scrollx', 'scrolly', 'fade' 或者直接传入 custom effect fn
        duration: .5, // 动画的时长
        easing: 'easeNone' // easing method
    });

    /**
     * 定义效果集
     */
    Switchable.Effects = {

        // 最朴素的显示/隐藏效果
        none: function(fromEls, toEls, callback) {
            DOM.css(fromEls, DISPLAY, NONE);
            DOM.css(toEls, DISPLAY, BLOCK);
            callback();
        },

        // 淡隐淡现效果
        fade: function(fromEls, toEls, callback) {
            if (fromEls.length !== 1) {
                S.error('fade effect only supports steps == 1.');
            }
            var self = this, cfg = self.config,
                fromEl = fromEls[0], toEl = toEls[0];

            if (self.anim) self.anim.stop();

            // 首先显示下一张
            DOM.css(toEl, OPACITY, 1);

            // 动画切换
            self.anim = new Anim(fromEl, { opacity: 0 }, cfg.duration, cfg.easing, function() {
                self.anim = undefined; // free

                // 切换 z-index
                DOM.css(toEl, Z_INDEX, 9);
                DOM.css(fromEl, Z_INDEX, 1);

                callback();
            }).run();
        },

        // 水平/垂直滚动效果
        scroll: function(fromEls, toEls, callback, index) {
            var self = this, cfg = self.config,
                isX = cfg.effect === SCROLLX,
                diff = self.viewSize[isX ? 0 : 1] * index,
                props = { };

            props[isX ? LEFT : TOP] = -diff;
            if (self.anim) self.anim.stop();

            self.anim = new Anim(self.content, props, cfg.duration, cfg.easing, function() {
                self.anim = undefined; // free
                callback();
            }).run();
        }
    };
    Effects = Switchable.Effects;
    Effects[SCROLLX] = Effects[SCROLLY] = Effects.scroll;

    /**
     * 添加插件
     * attached members:
     *   - this.viewSize
     */
    Switchable.Plugins.push({

        name: 'effect',

        /**
         * 根据 effect, 调整初始状态
         */
        init: function(host) {
            var cfg = host.config, effect = cfg.effect,
                panels = host.panels, content = host.content,
                steps = cfg.steps,
                activeIndex = host.activeIndex,
                len = panels.length;

            // 1. 获取高宽
            host.viewSize = [
                cfg.viewSize[0] || panels[0].offsetWidth * steps,
                cfg.viewSize[1] || panels[0].offsetHeight * steps
            ];
            // 注：所有 panel 的尺寸应该相同
            //    最好指定第一个 panel 的 width 和 height, 因为 Safari 下，图片未加载时，读取的 offsetHeight 等值会不对

            // 2. 初始化 panels 样式
            if (effect !== NONE) { // effect = scrollx, scrolly, fade

                // 这些特效需要将 panels 都显示出来
                S.each(panels, function(panel) {
                    DOM.css(panel, DISPLAY, BLOCK);
                });

                switch (effect) {
                    // 如果是滚动效果
                    case SCROLLX:
                    case SCROLLY:
                        // 设置定位信息，为滚动效果做铺垫
                        DOM.css(content, POSITION, ABSOLUTE);
                        DOM.css(content.parentNode, POSITION, RELATIVE); // 注：content 的父级不一定是 container

                        // 水平排列
                        if (effect === SCROLLX) {
                            DOM.css(panels, FLOAT, LEFT);

                            // 设置最大宽度，以保证有空间让 panels 水平排布
                            DOM.width(content, host.viewSize[0] * (len / steps));
                        }
                        break;

                    // 如果是透明效果，则初始化透明
                    case FADE:
                        var min = activeIndex * steps,
                            max = min + steps - 1,
                            isActivePanel;

                        S.each(panels, function(panel, i) {
                            isActivePanel = i >= min && i <= max;
                            DOM.css(panel, {
                                opacity: isActivePanel ? 1 : 0,
                                position: ABSOLUTE,
                                zIndex: isActivePanel ? 9 : 1
                            });
                        });
                        break;
                }
            }

            // 3. 在 CSS 里，需要给 container 设定高宽和 overflow: hidden
        }
    });

    /**
     * 覆盖切换方法
     */
    S.augment(Switchable, {

        _switchView: function(fromEls, toEls, index, direction) {
            var self = this, cfg = self.config,
                effect = cfg.effect,
                fn = S.isFunction(effect) ? effect : Effects[effect];

            fn.call(self, fromEls, toEls, function() {
                self.fire('switch');
            }, index, direction);
        }

    });
});
/**
 * Switchable Circular Plugin
 * @creator  玉伯<lifesinger@gmail.com>
 */
KISSY.add('switchable-circular', function(S, undefined) {

    var POSITION = 'position', RELATIVE = 'relative',
        LEFT = 'left', TOP = 'top',
        EMPTY = '',
        FORWARD = 'forward', BACKWARD = 'backward',
        SCROLLX = 'scrollx', SCROLLY = 'scrolly',
        Switchable = S.Switchable;

    /**
     * 添加默认配置
     */
    S.mix(Switchable.Config, {
        circular: false
    });

    /**
     * 循环滚动效果函数
     */
    function circularScroll(fromEls, toEls, callback, index, direction) {
        var self = this, cfg = self.config,
            len = self.length,
            activeIndex = self.activeIndex,
            isX = cfg.scrollType === SCROLLX,
            prop = isX ? LEFT : TOP,
            viewDiff = self.viewSize[isX ? 0 : 1],
            diff = -viewDiff * index,
            props = {},
            isCritical,
            isBackward = direction === BACKWARD;

        // 从第一个反向滚动到最后一个 or 从最后一个正向滚动到第一个
        isCritical = (isBackward && activeIndex === 0 && index === len - 1)
            || (direction === FORWARD && activeIndex === len - 1 && index === 0);

        if (isCritical) {
            // 调整位置并获取 diff
            diff = adjustPosition.call(self, self.panels, index, isBackward, prop, viewDiff);
        }
        props[prop] = diff;

        // 开始动画
        if (self.anim) self.anim.stop();
        self.anim = new S.Anim(self.content, props, cfg.duration, cfg.easing, function() {
            if (isCritical) {
                // 复原位置
                resetPosition.call(self, self.panels, index, isBackward, prop, viewDiff);
            }
            // free
            self.anim = undefined;
            callback();
        }).run();
    }

    /**
     * 调整位置
     */
    function adjustPosition(panels, index, isBackward, prop, viewDiff) {
        var self = this, cfg = self.config,
            steps = cfg.steps,
            len = self.length,
            start = isBackward ? len - 1 : 0,
            from = start * steps,
            to = (start + 1) * steps,
            i;

        // 调整 panels 到下一个视图中
        for (i = from; i < to; i++) {
            DOM.css(panels[i], POSITION, RELATIVE);
            DOM.css(panels[i], prop, (isBackward ? -1 : 1) * viewDiff * len);
        }

        // 偏移量
        return isBackward ? viewDiff : -viewDiff * len;
    }

    /**
     * 复原位置
     */
    function resetPosition(panels, index, isBackward, prop, viewDiff) {
        var self = this, cfg = self.config,
            steps = cfg.steps,
            len = self.length,
            start = isBackward ? len - 1 : 0,
            from = start * steps,
            to = (start + 1) * steps,
            i;

        // 滚动完成后，复位到正常状态
        for (i = from; i < to; i++) {
            DOM.css(panels[i], POSITION, EMPTY);
            DOM.css(panels[i], prop, EMPTY);
        }

        // 瞬移到正常位置
        DOM.css(self.content, prop, isBackward ? -viewDiff * (len - 1) : EMPTY);
    }

    /**
     * 添加插件
     */
    Switchable.Plugins.push({

        name: 'circular',

        /**
         * 根据 effect, 调整初始状态
         */
        init: function(host) {
            var cfg = host.config;

            // 仅有滚动效果需要下面的调整
            if (cfg.circular && (cfg.effect === SCROLLX || cfg.effect === SCROLLY)) {
                // 覆盖滚动效果函数
                cfg.scrollType = cfg.effect; // 保存到 scrollType 中
                cfg.effect = circularScroll;
            }
        }
    });
});

/**
 * TODO:
 *   - 是否需要考虑从 0 到 2（非最后一个） 的 backward 滚动？需要更灵活
 */
/**
 * Switchable Lazyload Plugin
 * @creator  玉伯<lifesinger@gmail.com>
 */
KISSY.add('switchable-lazyload', function(S) {

    var DOM = S.DOM,
        EVENT_BEFORE_SWITCH = 'beforeSwitch',
        IMG_SRC = 'img-src',
        TEXTAREA_DATA = 'textarea-data',
        FLAGS = { },
        Switchable = S.Switchable;

    FLAGS[IMG_SRC] = 'data-lazyload-src-custom';
    FLAGS[TEXTAREA_DATA] = 'ks-datalazyload-custom';

    /**
     * 添加默认配置
     */
    S.mix(Switchable.Config, {
        lazyDataType: '', // 'img-src' or 'textarea-data'
        lazyDataFlag: ''  // 'data-lazyload-src-custom' or 'ks-datalazyload-custom'
    });

    /**
     * 织入初始化函数
     */
    Switchable.Plugins.push({

        name: 'lazyload',

        init: function(host) {
            var DataLazyload = S.DataLazyload,
                cfg = host.config,
                type = cfg.lazyDataType, flag = cfg.lazyDataFlag || FLAGS[type];

            if (!DataLazyload || !type || !flag) return; // 没有延迟项

            host.on(EVENT_BEFORE_SWITCH, loadLazyData);

            /**
             * 加载延迟数据
             */
            function loadLazyData(ev) {
                var steps = cfg.steps,
                    from = ev.toIndex * steps ,
                    to = from + steps;

                DataLazyload.loadCustomLazyData(host.panels.slice(from, to), type, flag);
                if (isAllDone()) {
                    host.detach(EVENT_BEFORE_SWITCH, loadLazyData);
                }
            }

            /**
             * 是否都已加载完成
             */
            function isAllDone() {
                var elems, i, len,
                    tagName = (type === IMG_SRC) ? 'img' : (type === TEXTAREA_DATA ? 'textarea' : '');

                if (tagName) {
                    elems = S.query(tagName, host.container);
                    for (i = 0, len = elems.length; i < len; i++) {
                        if (DOM.attr(elems[i], flag)) return false;
                    }
                }
                return true;
            }
        }
    });
});
/**
 * Tabs Widget
 * @creator  玉伯<lifesinger@gmail.com>
 */
KISSY.add('tabs', function(S) {

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
    }

    S.extend(Tabs, S.Switchable);
    S.Tabs = Tabs;
});
/**
 * Tabs Widget
 * @creator     玉伯<lifesinger@gmail.com>
 */
KISSY.add('slide', function(S) {

    /**
     * 默认配置，和 Switchable 相同的部分此处未列出
     */
    var defaultConfig = {
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

        Slide.superclass.constructor.call(self, container, S.merge(defaultConfig, config));
    }

    S.extend(Slide, S.Switchable);
    S.Slide = Slide;
});
/**
 * Carousel Widget
 * @creator  玉伯<lifesinger@gmail.com>
 */
KISSY.add('carousel', function(S) {

    /**
     * 默认配置，和 Switchable 相同的部分此处未列出
     */
    var defaultConfig = {
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

        Carousel.superclass.constructor.call(self, container, S.merge(defaultConfig, config));
    }

    S.extend(Carousel, S.Switchable);
    S.Carousel = Carousel;
});
