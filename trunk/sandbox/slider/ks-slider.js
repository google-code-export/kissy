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
        // panels: null, // ���ָ�������Զ�Ѱ�ң�Ĭ�ϻ�ȡ container ������ li
        //triggers: null, // ���ָ�������Զ����� triggers
		currentClass: 'current', // ��� trigger ��ǰ�� className
		eventType: 'mouse', // trigger ������ʽ: 'click' Ϊ��� 'mouse' Ϊ�������
        effect: 'none', // չ��Ч����Ŀǰ������Ч�� 'none', 'fade', 'scroll'��
                        // ����˲���Ϊ function����ʹ���Զ���Ч��
		delay: 5000, // ���̼��ӳ�չ��ʱ��
		speed: 500, // ���̹����Լ�����ʱ�䣬��Ч��Ϊ 'none' ʱ��Ч
		autoPlay: true, // �Ƿ��Զ�����
        //switchSize: false,
        startAt: 0, // ��ʼ�����ڼ�����Ƭ
        //onSwitch: function() {},
        direction: 'vertical' // �������� 'horizontal(h)' or 'vertical(v)'
	};

    /**
     * չ��Ч��
     */
    var _effects = {
        'none': function() {
            var config = this.config, direction = this.direction;
            this.scroller[direction.x ? 'scrollLeft' : 'scrollTop'] = this.next * this.switchSize;
        },

        'fade': function() {
            var config = this.config, panels = this.panels,
                current = panels[this.current] || panels[0], next = panels[this.next] || panels[panels.length - 1];

            // init fade elements at first time
            if (!this._initFade) {
                Dom.setStyle(panels, 'position', 'absolute');
                Dom.setStyle(panels, 'top',  config.slideOffsetY || 0);
                Dom.setStyle(panels, 'left', config.slideOffsetX || 0);
                Dom.setStyle(panels, 'z-index', 1);
                Dom.setStyle(panels, 'display', 'none');
                this.initFade = true;
            }

            if (this._anim && this._fading) {
                this._anim.stop();
                Dom.setStyle(panels, 'display', 'none');
            }
            this._fading = true;
            Dom.setStyle(current, 'z-index', 2);
            Dom.setStyle(next, 'z-index', 1); Dom.setStyle(next, 'opacity', 1);
            Dom.setStyle([current, next] , 'display', '');
            this._anim = new YAHOO.util.Anim(current, {opacity: {from: 1, to: 0}}, 
                            config.speed/1000 || .5, config.easing || Y.Easing.easeNone); 
            this._anim.onComplete.subscribe(function() {
                Dom.setStyle(current, 'display', 'none');
                Dom.setStyle([current, next], 'z-index', 1);
                this._fading = false;
            }, this, true);

            this._anim.animate();
        },

        'scroll': function() {
            var config = this.config;
            var attributes = {scroll: {to:[]}};
            attributes.scroll.to[this.direction.x ? 0 : 1] = this.next * this.switchSize;
            if (this._anim) { this._anim.stop(); }
            this._anim = new Y.Scroll(this.scroller, attributes, 
                    config.speed/1000 || .5, config.easing || Y.Easing.easeOutStrong);
            /*
            anim.onComplete.subscribe(function() {
                // ...
            });
            */
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
        this.config = Lang.merge(defaultConfig, config || {});
        this.container = Dom.get(container);
        this._init();
    };

    Lang.augmentObject(Slider.prototype, {
        _init: function() {
            var config = this.config, container = this.container, effect;

            // ȷ���������򣬷���Ч����������
            this.direction = {
                x: (config.direction == 'horizontal') || (config.direction == 'h'),
                y: (config.direction == 'vertical')   || (config.direction == 'v')       
            };

            // ��ȡ���
            this.panels = config.panels || Lang.merge([], container.getElementsByTagName('li'));

            // ������������
            this.total = this.panels.length;

            // �����л���С��������е� panels ����ͬ����С
            this.switchSize = parseInt(this.config.switchSize, 10);
            if (!this.switchSize) {
                this.switchSize = this.panels[0][this.direction.x ? 'clientWidth' : 'clientHeight'];
            }

            // ��ȡ����Ԫ�أ�Ĭ��Ϊ li ���ϼ���Ҳ���� li ���� ol
            this.scroller = config.scroller || this.panels[0].parentNode;

            // ������
            this.triggers = config.triggers;
            if (!this.triggers) {
                var triggers = document.createElement('ul');
                Dom.addClass(triggers, config.triggersClass);
                for(var i = 0; i < this.total;) {
                    var t = document.createElement('li');
                    t.innerHTML = ++i;
                    triggers.appendChild(t);
                }
                this.container.appendChild(triggers);
                this.triggers = Lang.merge([], triggers.getElementsByTagName('li'));
            }

            // ȷ����ʼ��λ��
            this.current = Lang.isNumber(config.startAt) ? config.startAt : 0;

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

            for (var i = 0, len = this.triggers.length, _timer, ie = YAHOO.env.ie; i < len; i++) {
                (function(index) {
                    switch(config.eventType.toLowerCase()) {
                        case 'mouse':
                            Event.on(this.triggers[index], ie ? 'mouseenter': 'mouseover', function(e) {
                                if (_timer) _timer.cancel();
                                _timer = Lang.later(50, this, function() {
                                    this.switchTo(index);                               
                                });
                            }, this, true);

                            Event.on(this.triggers[index], ie ? 'mouseleave' : 'mouseout', function(e) {
                                if (_timer) _timer.cancel();
                                if (config.autoPlay) {
                                    this.wakeup();
                                }
                            }, this, true);
                            break;
                        default: 
                            Event.on(this.triggers[index], 'click', function(e) {
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
            Dom.addClass(this.triggers[this.current], config.currentClass);
            this.scroller.scrollTop = this.switchSize * this.current;
            this.scroller.scrollLeft = this.switchSize * this.current;

            // �Ƿ��Զ�����
            if (config.autoPlay && this.panels.length > 1) {
                this.pause = false;
                Lang.later(config.delay, this, 
                    function() {
                        this.switchTo(this.current + 1);
                    }
                );
            }
        },

        switchTo: function(index) {
            var config = this.config;

            //
            if (this.pause && !Lang.isNumber(index)) {
                return;
            }

            //
            if (this.timer) this.timer.cancel();

            //
            this.next = Lang.isNumber(index) ? index : this.current + 1;
            if (this.next >= this.total) {
                this.next = 0;
            }

            //
            this.effect.fire();

            // 
            this.current = this.next;

            // run callback
            if (Lang.isObject(this.onSwitchEvent) && this.onSwitchEvent.fire) {
                this.onSwitchEvent.fire();
            }

            // make current trigger class
            Dom.removeClass(this.triggers, config.currentClass);
            Dom.addClass(this.triggers[this.current], config.currentClass);

            // continue paly?
            if (config.autoPlay) {
                this.timer = Lang.later(config.delay, this, arguments.callee);
            }
        },

        sleep: function() {
            this.pause = true;
            if (this.timer) {
                this.timer.cancel();
            }
        },

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
