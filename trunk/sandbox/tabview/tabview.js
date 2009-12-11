/**
 * Tab �л����
 * @module      tabview
 * @creator     ��ǫ<yunqian@taobao.com>
 * @depends     kissy-core, yahoo-dom-event
 */
KISSY.add("tabview", function(S) {

    if (!Array.prototype.indexOf) {
        /**
         * ��ȡԪ���������е�λ��
         *
         * @param {Object} obj Ԫ��
         * @param {Number} fromIndex ��ʼλ��
         * @link http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Objects:Array:indexOf
         * @return Intger
         */
        Array.prototype.indexOf = function (obj, fromIndex) {
            if (fromIndex == null) {
                fromIndex = 0;
            } else if (fromIndex < 0) {
                fromIndex = Math.max(0, this.length + fromIndex);
            }
            for (var i = fromIndex; i < this.length; i++) {
                if (this[i] === obj)
                    return i;
            }
            return -1;
        };
    }

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = YAHOO.lang,

        /**
         * Ĭ������
         */
        defaultConfig = {
            eventType:      'click',        // �¼����ͣ�������Ϊmouse
            holderClass:    'tab-holder',   // tab holder��classname
            holderTagname:  'ul',           // tab holder��tagname
            triggerTagname: 'li',           // trigger��tagname
            panelClass:     'tab-panel',    // tab panel��classname
            autoTabIdx:     0,              // �Զ�ѡ�е�tab��ţ�nullΪ��ѡ
            stopEvent:      true,           // ֹͣ�¼�����
            onSwitch:       null,           // �л�tabʱִ�е��Զ����¼�
            delay:          0.1             // ��ʱ�л�����λ���룬����eventTypeΪmouseʱ��Ч
        },

        /**
         * ��ʱ�л���ʱ��
         */
        timer = null;

    var Tab = function(container, config) {
        // ʹcontainer֧������
        if (Lang.isArray(container)) {
            var rets = [], i = 0, len = container.length;
            for (; i < len; i++) {
                rets[rets.length] = new arguments.callee(container[i], config);
            }
            return rets;
        }

        // Factory or constructor
        if (!(this instanceof arguments.callee)) {
            return new arguments.callee(container, config);
        }

        /**
         * ��������
         */
        this.container = Dom.get(container);

        /**
         * ���ò���
         * @type Object
         */
        this.config = Lang.merge(defaultConfig, config || {});

        this.init();
    };

    /**
     * ������ʱ����panel���ͼƬ
     * @param container
     */
    function loadImgs(container) {
        var imgs = container.getElementsByTagName('img'),
                i = 0,
                len = imgs.length;

        for (; i < len; i++) {
            imgs[i].src = imgs[i].getAttribute('data-lazyload-src');
            imgs[i].removeAttribute('data-lazyload-src');
        }
    }

    S.mix(Tab.prototype, {
        /**
         * ��ʼ��
         * @protected
         */
        init: function() {
            var t = this,
                    c = t.config,
                    holder, triggerBoxes, triggers, panels;

            // ��ȡԪ��
            holder = Dom.getElementsByClassName(c.holderClass, c.holderTagname, t.container)[0];
            triggerBoxes = holder.getElementsByTagName('li');
            triggers = c.triggerTagname === 'li' ? triggerBoxes : holder.getElementsByTagName('a');
            panels = Dom.getElementsByClassName(c.panelClass, 'div', t.container);

            // �����Զ����¼�
            t.createEvent('switch');
            c.onSwitch && t.subscribe('switch', c.onSwitch);

            // ���¼�
            if (c.eventType === 'mouse') {
                Event.on(triggers, 'focus', t['focusHandler'], {scope: t});
                Event.on(triggers, 'mouseover', t['mouseoverHandler'], {scope: t});
                Event.on(triggers, 'mouseout', t['mouseoutHandler']);
            }
            Event.on(triggers, 'click', t['focusHandler'], {scope: t});

            // hook to class
            t.triggerBoxes = triggerBoxes;
            t.triggers = triggers;
            t.panels = panels;

            // �Զ�ѡ��
            if (c.autoTabIdx !== null) {
                t.switchTo(c.autoTabIdx);
            }
        },

        /**
         * focus �¼�������
         * @param {Event} e
         * @param {Object} o
         * @protected
         */
        focusHandler: function(e, o) {
            var t = o.scope,
                    c = t.config,
                    idx = Array.prototype.indexOf.call(t.triggers, this);

            timer && timer.cancel();
            t.switchTo(idx);

            // ie�²���"��һ��"��e��typeof e.typeΪunknown
            if (c.stopEvent && typeof e.type !== 'unknown' && e.type === 'click') {
                Event.stopEvent(e);
            }
        },

        /**
         * mouseover �¼�������
         * @param {Event} e
         * @param {Object} o
         * @protected
         */
        mouseoverHandler: function(e, o) {
            var t = o.scope,
                    c = t.config,
                    rt = Event.getRelatedTarget(e);

            if (rt !== this && !Dom.isAncestor(this, rt)) {
                t[c.delay ? 'delayHandler' : 'focusHandler'].call(this, e, o);
            }
        },

        /**
         * delay �¼�������
         * @param {Event} e
         * @param {Object} o
         * @protected
         */
        delayHandler: function(e, o) {
            var t = o.scope;

            timer = Lang.later(t.config.delay * 1000, this, t['focusHandler'], [e, o]);
        },

        /**
         * mouseout �¼�������
         * @param {Event} e
         * @protected
         */
        mouseoutHandler: function(e) {
            var rt = Event.getRelatedTarget(e);

            if (rt !== this && !Dom.isAncestor(this, rt)) {
                timer && timer.cancel();
            }
        },

        /**
         * �л���ĳ��Tab
         * @param {Number} idx
         * @public
         */
        switchTo: function(idx) {
            var t = this,
                    r = Dom.removeClass,
                    a = Dom.addClass;

            a(t.panels, 'hidden');
            r(t.panels[idx], 'hidden');
            r(t.triggerBoxes, 'selected');
            a(t.triggerBoxes[idx], 'selected');

            if (t.triggerBoxes[idx].getAttribute('data-lazyload')) {
                loadImgs(t.panels[idx]);
                t.triggerBoxes[idx].removeAttribute('data-lazyload');
            }

            t.fireEvent('switch');
        }
    });

    S.mix(Tab.prototype, Y.EventProvider.prototype);

    S.TabView = Tab;
});
