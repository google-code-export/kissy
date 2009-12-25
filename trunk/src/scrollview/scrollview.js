// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=gbk nobomb:
/**
 * KISSY - ScrollView
 *
 * @module      scrollview
 * @creator     mingcheng<i.feelinglucky#gmail.com>
 * @depends     kissy-core, yahoo-dom-event, yahoo-animate
 */

KISSY.add("scrollview", function(S) {
    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = YAHOO.lang,
        getFirstChild = Dom.getFirstChild, getLastChild  = Dom.getLastChild,
        insertBefore = Dom.insertBefore, insertAfter = Dom.insertAfter,
        getAttribute = Dom.getAttribute, setAttribute = Dom.setAttribute;

    var PREV = 'prev', NEXT = 'next', INDEX_FLAG = 'carousel:index',
        HORIZONTAL = 'horizontal', VERTICAL = 'vertical',
        ON_SWITCH = 'onSwitch', ON_PAUSE = 'onPause', ON_BEFORE_SWITCH = 'onBeforeSwitch';

    var defaultConfig = {
        animDuration: .5,
        interval: 2,
        autoPlay: true,
        direction: VERTICAL, // 'horizontal(h)' or 'vertical(v)'
        pauseOnMouseOver: true,  // triggerType Ϊ mouse ʱ�������ͣ�� slide ���Ƿ���ͣ�Զ�����
        //offset: null,
        //easing: function() {},
        //onScroll: function() {},
        //onBeforeScroll: function() {},
        //onPause: function() {},
        //onWakeup: function() {},
        framesNum: 1 // ÿ�ι�����֡������������ LI��
    };

    /**
     * Get Element's real offset
     *
     * @param Object Elements
     * @private
     */
    var getRealOffset = function(elem) {
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
     * �ҵ��¸��ڵ��λ��
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
     * ����ƽ����������������Ԫ��λ��
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
        container, panels, activePanel, activeIndex, total, i, len, direction;

        // carousel's elements
        container = Dom.get(container), panels = container.getElementsByTagName('li');

        // move activeIndex to first
        activePanel = panels[0] || [], total = panels.length;
        if (total < config.framesNum) {
            return;
        }

        // mark index
        for(i = 0, len = total; i < len; i++) {
            setAttribute(panels[i], INDEX_FLAG, i);
        }

        // mark activeIndex index
        activeIndex = parseInt(getAttribute(activePanel, INDEX_FLAG), 10);

        // default direction value is vertical
        direction = {
            x: (config.direction == HORIZONTAL) || (config.direction == 'h'),
            y: (config.direction == VERTICAL)   || (config.direction == 'v')       
        };

        // ���°�ʵ������
        self.config    = config,
        self.container = container, 
        self.panels    = panels,
        self.activePanel = activePanel,
        self.activeIndex = activeIndex,
        self.total     = total,
        self.direction = direction;

        // initialize
        self._init(); 
    }

    S.mix(ScrollView.prototype, {
        _init: function() {
            var self = this; 
            // ���Զ����¼�
            self.createEvent(ON_SWITCH);
            self.createEvent(ON_PAUSE);
            self.createEvent(ON_BEFORE_SWITCH);

            // �趨�Ƿ��Զ�����
            self._initAutoPlay();
        },

        _initAutoPlay: function()  {
            var self = this, config = self.config, container = self.container;
        
            // stop scroll when mouseover the container
            if (config.autoPlay) {
                if (config.pauseOnMouseOver) {
                    Event.on(container, 'mouseenter', function() {
                        self.paused = true;
                    });

                    Event.on(container, 'mouseleave',  function() {
                        self.paused = false;
                    });
                }

                self.autoPlayTimer = Lang.later(config.interval * 1000, self, function() {
                    if (self.paused) return;
                    self.play();
                }, null, true);
            }
        },

        play: function(direction) {
            var self = this, config = self.config, 
            activeIndex = self.activeIndex, total = self.total;

            // ȷ����������
            direction = (direction == PREV) ? PREV : NEXT;

            // �����¸�������λ��
            activeIndex += (direction == NEXT ? 1 : -1) * config.framesNum;
            if (activeIndex >= total) {
                activeIndex = 0;
            } else if (activeIndex < 0) {
                activeIndex = total - 1;
            }

            this.switchTo(activeIndex, direction);
        },

        /**
         * ������Թ�����λ��
         *
         * @private
         */
        _decideOffset: function (index, direction) {
            var self = this, config = self.config, total = self.total, 
                toPanel, fromPanel, opponent, i, tmp, len;

            if (index > total) return;

            if (Lang.isUndefined(direction) && Lang.isNumber(self.prevIndex)) {
                direction = index > self.prevIndex ? NEXT : PREV;
            }
            direction = (direction == PREV) ? PREV : NEXT;
            opponent = (direction == PREV) ? NEXT : PREV;

            // Ѱ�ҹ���Ŀ��
            for(i = 0, len = total; i < len; i++) {
                tmp = getAttribute(self.panels[i], INDEX_FLAG);
                if (tmp == index) {
                    toPanel = self.panels[i];
                    break;
                }
            }
            if (!toPanel) return;

            // Ѱ����Ҫ��������ʼ��
            do {
                fromPanel = findNextPanel(toPanel, config.framesNum, opponent);
                if (!fromPanel) {
                    rebuildSeq(toPanel.parentNode, config.framesNum, direction);
                }
            } while(!fromPanel);

            self.fromPanel = fromPanel;
            self.toPanel   = toPanel;
            self.prevIndex = index;
        },

        switchTo: function(index, direction) {
            var self = this, container = self.container, 
                activePanel = self.activePanel, activeIndex = self.activeIndex,
                config = self.config, callee = arguments.callee, 
                attributes, destination;

            if (self.prevIndex == index) return;

            // ȷ�������ķ����Լ�λ��
            self._decideOffset(index, direction);

                // �������
            var activeOffset = getRealOffset(self.fromPanel),
                destinationOffset = getRealOffset(self.toPanel);
                containerOffset = getRealOffset(container),

                // ��������
                prop = self.direction.y ? 'top' : 'left',
                from = activeOffset[prop] - containerOffset[prop],
                to = destinationOffset[prop] - containerOffset[prop];

            if (self.direction.y) {
                // ��ֱ����
                attributes = {
                    scroll: {
                        from: [, from], to: [, to] 
                    }
                };
            } else {
                // ˮƽ����
                attributes = {
                    scroll: {
                        from: [from], to: [to]
                    }
                };
            }

            // move activeIndex to next Item
            self.activePanel = self.toPanel;

            // mark activeIndex horses index
            self.activeIndex = parseInt(getAttribute(self.toPanel, INDEX_FLAG), 10);

            // �������߸�ֹͣ�����Ļ���
            if (!self.fireEvent(ON_BEFORE_SWITCH, self)) {
                return self;
            }

            // ��ʼ����
            if (self.anim) self.anim.stop();
            self.anim = new Y.Scroll(container, attributes, config.animDuration, 
                                                        config.easing || Y.Easing.easeOut); 
            self.anim.onComplete.subscribe(function() {
                self.scrolling = false;

                // ��������Ժ�Ļص�
                self.fireEvent(ON_SWITCH, self);
            });

            self.scrolling = true;
            self.anim.animate();
        },

        next: function() {
            this.play(NEXT);
        },

        prev: function() {
            this.play(PREV);
        }
    });

    S.augment(ScrollView, Y.EventProvider);
    S.ScrollView = ScrollView;
});
