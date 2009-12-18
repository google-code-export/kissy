// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=gbk nobomb:
/**
 * KISSKY - Slider module
 *
 * @creator mingcheng<i.feelinglucky#gmail.com>
 * @since   2009-12-16
 * @link    http://www.gracecode.com/
 * @change
 *     [+]new feature  [*]improvement  [!]change  [x]bug fix
 *
 *  [+] 2009-12-18
 *      ��ʼ���汾
 */

KISSY.add("slider", function(S) {
    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = YAHOO.lang;

    /**
     * Ĭ������
     */
	var defaultConfig = {
		triggersClass: 'triggers', // triggers �� className
        //panels: null, // ���ָ�������Զ�Ѱ�ң�Ĭ�ϻ�ȡ container ������ li
        //triggers: null, // ���ָ�������Զ����� triggers
		currentClass: 'current', // ��� trigger ��ǰ�� className
		eventType: 'mouse', // trigger ������ʽ: 'click' Ϊ��� 'mouse' Ϊ�������
        effect: 'none', // չ��Ч����Ŀǰ������Ч�� 'none', 'fade', 'scroll'��
                        // ����˲���Ϊ function����ʹ���Զ���Ч��
		delay: 5000, // ���̼��ӳ�չ��ʱ��
		speed: 500, // ���̹����Լ�����ʱ�䣬��Ч��Ϊ 'none' ʱ��Ч
		autoPlay: true, // �Ƿ��Զ�����
        //switchSize: false, // �������룬��δָ������ȡ panel �ĸ߿�
        startAt: 0, // ��ʼ�����ڼ�����Ƭ
        //onSwitch: function() {}, // ����ʱ�Ļص�
        direction: 'vertical' // �������� 'horizontal(h)' or 'vertical(v)'
	};

    /**
     * չ��Ч��
     */
    var _effects = {
        /**
         * Ĭ�����κ�Ч����ֱ���л�
         *
         */
        'none': function() {
            var t = this, config = t.config;
            t.scroller[t.direction.x ? 'scrollLeft' : 'scrollTop'] = t.next * t.switchSize;
        },

        /**
         * ����Ч��
         */
        'fade': function() {
            var t = this, config = t.config, panels = t.panels, setStyle = Dom.setStyle,
                current = panels[t.current] || panels[0], next = panels[t.next] || panels[panels.length - 1];

            // ���״�����ʱ��ʼ���ڵ�
            if (!this._initFade) {
                setStyle(panels, 'position', 'absolute');
                setStyle(panels, 'top',  config.slideOffsetY || 0);
                setStyle(panels, 'left', config.slideOffsetX || 0);
                setStyle(panels, 'z-index', 1);
                setStyle(panels, 'display', 'none');
                this.initFade = true;
            }

            // ����ǰ�ĳ�ʼ��
            if (this._anim && this._fading) {
                this._anim.stop();
                setStyle(panels, 'display', 'none');
            }
            this._fading = true;
            setStyle(current, 'z-index', 2);
            setStyle(next, 'z-index', 1);
            setStyle(next, 'opacity', 1);
            setStyle([current, next] , 'display', '');

            // ��ʼ����
            this._anim = new YAHOO.util.Anim(current, {opacity: {from: 1, to: 0}}, 
                                    config.speed/1000 || .5, config.easing || Y.Easing.easeNone); 
            this._anim.onComplete.subscribe(function() {
                setStyle(current, 'display', 'none');
                setStyle([current, next], 'z-index', 1);
                this._fading = false;
            }, t, true);

            this._anim.animate();
        },

        /**
         * ����Ч��
         */
        'scroll': function() {
            var t = this, config = t.config, attributes = {scroll: {to:[]}};
            attributes.scroll.to[t.direction.x ? 0 : 1] = t.next * t.switchSize;
            if (this._anim) this._anim.stop();
            this._anim = new Y.Scroll(this.scroller, attributes, 
                    config.speed/1000 || .5, config.easing || Y.Easing.easeOutStrong);
            /*
            this._anim.onComplete.subscribe(function() {
                // ...
            });
            // */
            this._anim.animate();
        }
    };


    /**
     * Slider ���
     *
     * @params container Slider ����
     * @params config ���ú���
     * @return Slider ʵ��
     */
    var Slider = function(container, config) {
        this.container = Dom.get(container);
        this.config = Lang.merge(defaultConfig, config || {});
        this._init();
    };

    S.mix(Slider.prototype, {
        _init: function() {
            var config = this.config, container = this.container, effect;

            // ȷ���������򣬷���Ч����������
            var direction = {
                x: (config.direction == 'horizontal') || (config.direction == 'h'),
                y: (config.direction == 'vertical')   || (config.direction == 'v')       
            };


            // ��ȡ���
            var panels = config.panels || Lang.merge([], container.getElementsByTagName('li'));

            // ������������
            var total = panels.length;


            // �����л���С��������е� panels ����ͬ����С
            var switchSize = parseInt(this.config.switchSize, 10);
            if (!switchSize) {
                switchSize = panels[0][direction.x ? 'clientWidth' : 'clientHeight'];
            }

            // ��ȡ����Ԫ�أ�Ĭ��Ϊ li ���ϼ���Ҳ���� li ���� ol
            var scroller = config.scroller || panels[0].parentNode;

            // ���ɴ�����
            var triggers = config.triggers;
            if (!triggers) {
                var triggers = document.createElement('ul');
                Dom.addClass(triggers, config.triggersClass);
                for(var i = 0; i < total;) {
                    var tmp = document.createElement('li');
                    tmp.innerHTML = ++i;
                    triggers.appendChild(tmp);
                }
                container.appendChild(triggers);
                triggers = Lang.merge([], triggers.getElementsByTagName('li'));
            }

            // ȷ����ʼ��λ��
            var current = Lang.isNumber(config.startAt) ? config.startAt : 0;

            // ȷ������Ч��
            if (Lang.isFunction(config.effect)) {
                effect = config.effect;
            } else if (Lang.isString(config.effect) && Lang.isFunction(_effects[config.effect])) {
                effect = _effects[config.effect];
            } else {
                effect = effect['none'];
            }
            this.effect = new Y.CustomEvent('effect', this, false, Y.CustomEvent.FLAT);
            this.effect.subscribe(effect);

            // �󶨻ص�
            if (Lang.isFunction(config.onSwitch)) {
                this.onSwitchEvent = new Y.CustomEvent('onSwitchEvent', this, false, Y.CustomEvent.FLAT);
                this.onSwitchEvent.subscribe(config.onSwitch);
            }

            // ���¼�
            Event.on(container, 'mouseover', function(e) {
                this.sleep();
            }, this, true);

            Event.on(container, 'mouseout', function(e) {
                if (config.autoPlay) {
                    this.wakeup();
                }
            }, this, true);

            for (var i = 0, len = triggers.length, _timer, ie = YAHOO.env.ie; i < len; i++) {
                (function(index) {
                    switch(config.eventType.toLowerCase()) {
                        case 'mouse':
                            Event.on(triggers[index], ie ? 'mouseenter': 'mouseover', function(e) {
                                //Event.stopEvent(e);
                                if (_timer) _timer.cancel();
                                _timer = Lang.later(200, this, function() {
                                    this.switchTo(index);                               
                                });
                            }, this, true);

                            Event.on(triggers[index], ie ? 'mouseleave' : 'mouseout', function(e) {
                                if (_timer) _timer.cancel();
                                if (config.autoPlay) this.wakeup();
                            }, this, true);
                            break;
                        default: 
                            Event.on(triggers[index], 'click', function(e) {
                                Event.stopEvent(e);
                                if (_timer) _timer.cancel();
                                _timer = Lang.later(50, this, function() {
                                    this.switchTo(index);                               
                                });
                            }, this, true);
                    }
                }).call(this, i);
            }

            // ��ʼ�� triggers ����ʽ�Լ���������
            Dom.addClass(triggers[current], config.currentClass);
            scroller.scrollTop = switchSize * current;
            scroller.scrollLeft = switchSize * current;

            // �Ƿ��Զ�����
            if (config.autoPlay && total > 1) {
                this.pause = false;
                Lang.later(config.delay, this, 
                    function() {
                        this.switchTo(current + 1);
                    }
                );
            }

            // �󶨶�Ӧ���Ե�ʵ��
            this.direction = direction;
            this.panels = panels;
            this.switchSize = switchSize;
            this.scroller = scroller;
            this.triggers = triggers;
            this.current = current;
        },

        /**
         * ������ָ����λ��
         */
        switchTo: function(index) {
            var config = this.config, t = this;

            // �����ֹͣ״̬���򲻼�������
            if (t.pause && !Lang.isNumber(index)) {
                return;
            }
            if (this.timer) this.timer.cancel();

            // �����¸����λ
            this.next = Lang.isNumber(index) ? index : t.current + 1;
            if (this.next >= t.total) {
                this.next = 0;
            }

            // ִ��Ч��
            t.effect.fire();

            // ���±��λ
            this.current = this.next;

            // ִ�лص�
            if (Lang.isObject(t.onSwitchEvent) && t.onSwitchEvent.fire) {
                this.onSwitchEvent.fire();
            }

            // ���� triggers ����ʽ
            Dom.removeClass(t.triggers, config.currentClass);
            Dom.addClass(t.triggers[this.current], config.currentClass);

            // �Ƿ��������
            if (config.autoPlay) {
                this.timer = Lang.later(config.delay, this, arguments.callee);
            }
        },

        /**
         * ��ͣ����
         */
        sleep: function() {
            this.pause = true;
            if (this.timer) {
                this.timer.cancel();
            }
        },

        /**
         * ��������
         */
        wakeup: function() {
            if (this.timer) {
                this.timer.cancel();
            }
            this.pause = false;
            this.timer = Lang.later(this.config.delay, this, function() {
                this.switchTo(this.current + 1);
            });
        }
    });

    S.Slider = Slider;
});
