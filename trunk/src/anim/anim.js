/**
 * @module   anim
 * @author   lifesinger@gmail.com
 * @depends  ks-core
 */
KISSY.add('anim', function(S, undefined) {

    var DOM = S.DOM, Easing = S.Easing,
        PARSE_FLOAT = parseFloat,
        parseEl = DOM.create('<div>'),
        PROPS = ('backgroundColor borderBottomColor borderBottomWidth borderBottomStyle borderLeftColor borderLeftWidth borderLeftStyle ' +
            'borderRightColor borderRightWidth borderRightStyle borderSpacing borderTopColor borderTopWidth borderTopStyle bottom color ' +
            'font fontFamily fontSize fontWeight height left letterSpacing lineHeight marginBottom marginLeft marginRight marginTop maxHeight ' +
            'maxWidth minHeight minWidth opacity outlineColor outlineOffset outlineWidth paddingBottom paddingLeft ' +
            'paddingRight paddingTop right textIndent top width wordSpacing zIndex').split(' '),

        STEP_INTERVAL = 13,
        EVENT_START = 'start',
        EVENT_STEP = 'step',
        EVENT_COMPLETE = 'complete',

        defaultConfig = {
            duration: 1,
            easing: Easing.easeNone
            //queue: true
        };

    /**
     * Anim Class
     * @constructor
     */
    function Anim(elem, props, duration, easing, callback) {
        // ignore non-exist element
        if (!(elem = S.get(elem))) return;

        // factory or constructor
        if (!(this instanceof Anim)) {
            return new Anim(elem, props, duration, easing, callback);
        }

        var self = this,
            isConfig = S.isPlainObject(duration),
            style = props, config;

        /**
         * the related dom element
         */
        self.domEl = elem;

        /**
         * the transition properties
         * 可以是 "width: 200px; color: #ccc" 字符串形式
         * 也可以是 { width: '200px', color: '#ccc' } 对象形式
         */
        if (S.isPlainObject(style)) {
            style = S.param(style, ';').replace(/=/g, ':');
        }
        self.props = normalize(style);
        // normalize 后：
        // props = {
        //          width: { v: 200, unit: 'px', f: interpolate }
        //          color: { v: '#ccc', unit: '', f: color }
        //         }

        /**
         * animation config
         */
        if (isConfig) {
            config = S.merge(defaultConfig, duration);
        } else {
            config = S.clone(defaultConfig);
            duration && (config.duration = PARSE_FLOAT(duration, 10) || 1);
            S.isString(easing) && (easing = Easing[easing]); // 可以是字符串, 比如 'easingOut'
            S.isFunction(easing) && (config.easing = easing);
            S.isFunction(callback) && (config.complete = callback);
        }
        self.config = config;

        /**
         * timer
         */
        //self.timer = undefined;

        // register callback
        if (S.isFunction(callback)) {
            self.on(EVENT_COMPLETE, callback);
        }
    }

    S.augment(Anim, S.EventTarget, {

        run: function() {
            var self = this, config = self.config,
                elem = self.domEl,
                duration = config.duration * 1000,
                easing = config.easing,
                start = S.now(), finish = start + duration,
                target = self.props,
                source = {}, prop, go;

            for (prop in target) source[prop] = parse(DOM.css(elem, prop));
            if(self.fire(EVENT_START) === false) return;

            self.stop(); // 先停止掉正在运行的动画

            self.timer = S.later((go = function () {
                var time = S.now(),
                    t = time > finish ? 1 : (time - start) / duration,
                    sp, tp;

                for (prop in target) {
                    sp = source[prop];
                    tp = target[prop];

                    // 单位不一样时，以 tp.u 的为主，同时 sp 从 0 开始
                    // 比如：ie 下 border-width 默认为 medium
                    if(sp.u !== tp.u) sp.v = 0;

                    // go
                    DOM.css(elem, prop, tp.f(sp.v, tp.v, easing(t)) + tp.u);
                }

                if ((self.fire(EVENT_STEP) === false) || time > finish) {
                    self.stop();
                    self.fire(EVENT_COMPLETE);
                }
            }), STEP_INTERVAL, true);

            // 立刻执行
            go();

            return self;
        },

        stop: function() {
            var self = this;

            if (self.timer) {
                self.timer.cancel();
                self.timer = undefined;
            }

            return self;
        }
    });

    S.Anim = Anim;

    function normalize(style) {
        var css, rules = { }, i = PROPS.length, v;
        parseEl.innerHTML = '<div style="' + style + '"></div>';
        css = parseEl.childNodes[0].style;
        while (i--) if ((v = css[PROPS[i]])) rules[PROPS[i]] = parse(v);
        return rules;
    }

    function parse(val) {
        var num = PARSE_FLOAT(val), unit = (val + '').replace(/^[-\d\.]+/, '');
        return isNaN(num) ? { v: unit, u: '', f: colorEtc } : { v: num, u: unit, f: interpolate };
    }

    function interpolate(source, target, pos) {
        return (source + (target - source) * pos).toFixed(3);
    }

    function colorEtc(source, target, pos) {
        var i = 2, j, c, tmp, v = [], r = [];

        while (j = 3, c = arguments[i - 1], i--) {
            if (s(c, 0, 4) === 'rgb(') {
                c = c.match(/\d+/g);
                while (j--) v.push(~~c[j]);
            }
            else if(s(c, 0) === '#') {
                if (c.length === 4) c = '#' + s(c, 1) + s(c, 1) + s(c, 2) + s(c, 2) + s(c, 3) + s(c, 3);
                while (j--) v.push(parseInt(s(c, 1 + j * 2, 2), 16));
            }
            else { // red, black 等值，以及其它一切非颜色值，直接返回 target
                return target;
            }
        }

        while (j--) {
            tmp = ~~(v[j + 3] + (v[j] - v[j + 3]) * pos);
            r.push(tmp < 0 ? 0 : tmp > 255 ? 255 : tmp);
        }

        return 'rgb(' + r.join(',') + ')';
    }

    function s(str, p, c) {
        return str.substr(p, c || 1);
    }
});

/**
 * TODO:
 *  - 实现 jQuery Effects 的 queue / specialEasing / += / toogle,show,hide 等特性
 *  - 还有些情况就是动画不一定改变 CSS, 有可能是 scroll-left 等
 *
 * NOTES:
 *  - 与 emile 相比，增加了 borderStyle, 使得 border: 5px solid #ccc 能从无到有，正确显示
 *  - api 借鉴了 YUI, jQuery 以及 http://www.w3.org/TR/css3-transitions/
 *  - 代码实现了借鉴了 Emile.js: http://github.com/madrobby/emile
 */
