/*
Copyright 2010, KISSY UI Library v1.0.5
MIT Licensed
build: 551 Apr 11 12:05
*/
/**
 * @module kissy
 * @author lifesinger@gmail.com
 */
(function(win, S, undefined) {

    // If KISSY is already defined, the existing KISSY object will not
    // be overwritten so that defined namespaces are preserved.
    if (win[S] === undefined) win[S] = {};
    S = win[S]; // shortcut

    var doc = win.document,

        // Copies all the properties of s to r.
        mix = function(r, s, ov, wl) {
            if (!s || !r) return r;
            if (ov === undefined) ov = true;
            var i, p, l;

            if (wl && (l = wl.length)) {
                for (i = 0; i < l; i++) {
                    p = wl[i];
                    if (p in s) {
                        if (ov || !(p in r)) {
                            r[p] = s[p];
                        }
                    }
                }
            } else {
                for (p in s) {
                    if (ov || !(p in r)) {
                        r[p] = s[p];
                    }
                }
            }
            return r;
        },

        // Is the DOM ready to be used? Set to true once it occurs.
        isReady = false,

        // The functions to execute on DOM ready.
        readyList = [],

        // Has the ready events already been bound?
        readyBound = false;

    mix(S, {

        /**
         * The version of the library.
         * @type {string}
         */
        version: '1.0.5',

        /**
         * Initializes KISSY object.
         * @private
         */
        _init: function() {
            this.Env = {
                mods: {}
            };
        },

        /**
         * Registers a module.
         * @param {string} name module name
         * @param {function} fn entry point into the module that is used to bind module to KISSY
         * <pre>
         * KISSY.add('module-name', function(S){ });
         * </pre>
         * @return {KISSY}
         */
        add: function(name, fn) {
            var self = this;

            // override mode
            self.Env.mods[name] = {
                name: name,
                fn: fn
            };

            // call entry point immediately
            fn(self);

            // chain support
            return self;
        },

        /**
         * Specify a function to execute when the DOM is fully loaded.
         * @param {function} fn A function to execute after the DOM is ready
         * <pre>
         * KISSY.ready(function(S){ });
         * </pre>
         * @return {KISSY}
         */
        ready: function(fn) {
            // Attach the listeners
            if (!readyBound) this._bindReady();

            // If the DOM is already ready
            if (isReady) {
                // Execute the function immediately
                fn.call(win, this);
            } else {
                // Remember the function for later
                readyList.push(fn);
            }

            return this;
        },

        /**
         * Binds ready events.
         */
        _bindReady: function() {
            var self = this,
                doScroll = doc.documentElement.doScroll,
                eventType = doScroll ? 'onreadystatechange' : 'DOMContentLoaded';

            // Set to true once it runs
            readyBound = true;

            // IE event model is used
            if (doc.attachEvent) {
                if (win != win.top) { // iframe
                    function stateChange() {
                        if (doc.readyState === 'complete') {
                            // remove onreadystatechange listener
                            doc.detachEvent(eventType, stateChange);
                            self._fireReady();
                        }
                    }
                    doc.attachEvent(eventType, stateChange);
                } else {
                    function readyScroll() {
                        try {
                            // Ref: http://javascript.nwbox.com/IEContentLoaded/
                            doScroll('left');
                            self._fireReady();
                        } catch(ex) {
                            setTimeout(readyScroll, 1);
                        }
                    }
                    readyScroll();
                }

                // A fallback to window.onload, that will always work.
                win.attachEvent('onload', function() {
                    self._fireReady();
                });
                
            } else { // w3c mode
                function domReady() {
                    doc.removeEventListener(eventType, domReady, false);
                    self._fireReady();
                }
                doc.addEventListener(eventType, domReady, false);
            }
        },

        /**
         * Executes functions bound to ready event.
         */
        _fireReady: function() {
            if(isReady) return;
            
            // Remember that the DOM is ready
            isReady = true;

            // If there are functions bound, to execute
            if (readyList) {
                // Execute all of them
                var fn, i = 0;
                while (fn = readyList[i++]) {
                    fn.call(win, this);
                }

                // Reset the list of functions
                readyList = null;
            }
        },

        /**
         * Copies all the properties of s to r.
         * @return {object} the augmented object
         */
        mix: mix,

        /**
         * Returns a new object containing all of the properties of
         * all the supplied objects. The properties from later objects
         * will overwrite those in earlier objects. Passing in a
         * single object will create a shallow copy of it.
         * @return {object} the new merged object
         */
        merge: function() {
            var a = arguments, o = {}, i, l = a.length;
            for (i = 0; i < l; ++i) {
                mix(o, a[i]);
            }
            return o;
        },

        /**
         * Utility to set up the prototype, constructor and superclass properties to
         * support an inheritance strategy that can chain constructors and methods.
         * Static members will not be inherited.
         * @param {function} r the object to modify
         * @param {function} s the object to inherit
         * @param {object} px prototype properties to add/override
         * @param {object} sx static properties to add/override
         * @return {object} r
         */
        extend: function(r, s, px, sx) {
            if (!s || !r) return r;

            var OP = Object.prototype,
                O = function (o) {
                    function F() {
                    }

                    F.prototype = o;
                    return new F();
                },
                sp = s.prototype,
                rp = O(sp);

            r.prototype = rp;
            rp.constructor = r;
            r.superclass = sp;

            // assign constructor property
            if (s !== Object && sp.constructor === OP.constructor) {
                sp.constructor = s;
            }

            // add prototype overrides
            if (px) {
                mix(rp, px);
            }

            // add object overrides
            if (sx) {
                mix(r, sx);
            }

            return r;
        },

        /**
         * Applies prototype properties from the supplier to the receiver.
         * @param {function} r  the object to receive the augmentation
         * @param {object|function} s  the object that supplies the properties to augment
         * @param {string[]} wl a whitelist
         * @return {object} the augmented object
         */
        augment: function(r, s, ov, wl) {
            return mix(r.prototype, S.isFunction(s) ? s.prototype : s, ov, wl);
        },

        /**
         * create app based on KISSY.
         * <pre>
         * S.app('TB');
         * </pre>
         * @return {object}  A reference to the app global object
         */
        app: function(name, r) {
            var O = win[name] || { };

            mix(O, this, true, ['_init', 'add', 'namespace']);
            O._init();

            return mix((win[name] = O), r);
        },

        /**
         * Returns the namespace specified and creates it if it doesn't exist. Be careful
         * when naming packages. Reserved words may work in some browsers and not others.
         * <pre>
         * S.namespace('KISSY.app'); // returns KISSY.app
         * S.namespace('app.Shop'); // returns KISSY.app.Shop
         * S.app('TB');
         * TB.namespace('TB.app'); // returns TB.app
         * TB.namespace('app.Shop'); // returns TB.app.Shop
         * </pre>
         * @return {object}  A reference to the last namespace object created
         */
        namespace: function() {
            var a = arguments, l = a.length, o = null, i, j, p;

            for (i = 0; i < l; ++i) {
                p = ('' + a[i]).split('.');
                o = this;
                for (j = (win[p[0]] === o) ? 1 : 0; j < p.length; ++j) {
                    o = o[p[j]] = o[p[j]] || {};
                }
            }
            return o;
        },

        /**
         * Prints debug info.
         * @param {string} msg The message to log.
         * @param {string} cat The log category for the message. Default
         * categories are "info", "warn", "error", time" etc.
         * @param {string} src The source of the the message (opt)
         * @return {KISSY}
         */
        log: function(msg, cat, src) {
            if (this.Config.debug) {
                src && (msg = src + ': ' + msg);
                if (win.console !== undefined && console.log) {
                    console[cat && console[cat] ? cat : 'log'](msg);
                }
            }

            return this;
        },

        /**
         * Throws error message.
         * @param msg
         */
        error: function(msg) {
            if(this.Config.debug) {
                throw msg;
            }
        },

        /**
         * get current timeStamp
         */
        now: function() {
            return new Date().getTime();
        }
    });

    S._init();

    // build 时，会将  替换为空
    S.Config = { debug: '' };

})(window, 'KISSY');

/**
 * Notes:
 *
 * 2010.04
 *  - 移除掉 weave 方法，尚未考虑周全。
 *
 * 2010.01
 *  - 考虑简单够用和 2/8 原则，去掉了对 YUI3 沙箱的模拟（archives/2009 r402）
 *
 *  - add 方法决定内部代码的基本组织方式（用 module 和 submodule 组织代码）。
 *  - ready 方法决定外部代码的基本调用方式，提供了一个简单的弱沙箱。
 *  - mix, merge, extend, augment 方法，决定了类库代码的基本实现方式，
 *    充分利用 mixin 特性和 prototype 方式来实现代码。
 *  - app, namespace 方法，决定子库的实现和代码的整体组织。
 *  - log 方法，简单的调试工具。
 *
 */
/**
 * @module  lang
 * @author  lifesinger@gmail.com
 * @depends kissy
 */

KISSY.add('lang', function(S, undefined) {

    var doc = document,
        AP = Array.prototype,
        forEach = AP.forEach,
        indexOf = AP.indexOf,
        slice = AP.slice,
        REG_TRIM = /^\s+|\s+$/g,
        REG_ARR_KEY = /^(\w+)\[\]$/,
        toString = Object.prototype.toString;

    S.mix(S, {

        /**
         * Executes the supplied function on each item in the array.
         * @param {array} arr the array to iterate
         * @param {function} fn the function to execute on each item. The function
         * receives three arguments: the value, the index, the full array.
         * @param {object} context optional context object
         */
        each: forEach ?
              function (arr, fn, context) {
                  forEach.call(arr, fn, context);
                  return this;
              } :
              function(arr, fn, context) {
                  var l = (arr && arr.length) || 0, i;
                  for (i = 0; i < l; ++i) {
                      fn.call(context || this, arr[i], i, arr);
                  }
                  return this;
              },

        /**
         * Remove the whitespace from the beginning and end of a string.
         * @param {string} str
         */
        trim: String.prototype.trim ?
              function(str) {
                  return (str || '').trim();
              } :
              function(str) {
                  return (str || '').replace(REG_TRIM, '');
              },

        /**
         * Check to see if an object is a plain object (created using "{}" or "new Object").
         */
        isPlainObject: function(obj) {
            return obj && toString.call(obj) === '[object Object]' && !obj.nodeType && !obj.setInterval;
        },

        isEmptyObject: function(obj) {
            for (var p in obj) {
                return false;
            }
            return true;
        },

        // NOTE: DOM methods and functions like alert aren't supported. They return false on IE.
        isFunction: function(obj) {
            return toString.call(obj) === '[object Function]';
        },

        isArray: function(obj) {
            return toString.call(obj) === '[object Array]';
        },

        /**
         * Search for a specified value within an array.
         */
        indexOf: indexOf ?
                 function(elem, arr) {
                     return indexOf.call(arr, elem);
                 } :
                 function(elem, arr) {
                     for (var i = 0, len = arr.length; i < len; ++i) {
                         if (arr[i] === elem) {
                             return i;
                         }
                     }
                     return -1;
                 },

        /**
         * Search for a specified value index within an array.
         */
        inArray: function(arr, elem) {
            return S.indexOf(arr, elem) !== -1;
        },

        makeArray: function(obj) {
            if (obj === null || obj === undefined) return [];
            if (S.isArray(obj)) return obj;

            // The strings and functions also have 'length'
            if (typeof obj.length !== 'number' || typeof obj === 'string' || S.isFunction(obj)) {
                return [obj];
            }

            // ie 不支持用 slice 转换 NodeList, 降级到普通方法
            if (obj.item && S.UA.ie) {
                var ret = [], i = 0, len = obj.length;
                for (; i < len; ++i) {
                    ret[i] = obj[i];
                }
                return ret;
            }

            // array-like
            return slice.call(obj);

        },

        /**
         * Creates a serialized string of an array or object.
         * <pre>
         *     {foo: 1, bar: 2}    // -> 'foo=1&bar=2'
         *     {foo: 1, bar: [2, 3]}    // -> 'foo=1&bar[]=2&bar[]=3'
         *     {foo: '', bar: 2}    // -> 'foo=&bar=2'
         *     {foo: undefined, bar: 2}    // -> 'foo=undefined&bar=2'
         *     {foo: true, bar: 2}    // -> 'foo=true&bar=2'
         * </pre>
         */
        param: function(o) {
            // 非 object, 直接返回空
            if (typeof o !== 'object') return '';

            var buf = [], key, val;
            for (key in o) {
                val = o[key];

                // val 为有效的非数组值
                if (isValidParamValue(val)) {
                    buf.push(key, '=', val + '', '&');
                }
                // val 为非空数组
                else if (S.isArray(val) && val.length) {
                    for (var i = 0, len = val.length; i < len; ++i) {
                        if (isValidParamValue(val[i])) {
                            buf.push(key + '[]=', val[i] + '', '&');
                        }
                    }
                }
                // 其它情况：包括空数组、不是数组的 object（包括 Function, RegExp, Date etc.），直接丢弃
            }

            buf.pop();
            return encodeURI(buf.join(''));
        },

        /**
         * Parses a URI-like query string and returns an object composed of parameter/value pairs.
         * <pre>
         * 'section=blog&id=45'        // -> {section: 'blog', id: '45'}
         * 'section=blog&tag[]=js&tag[]=doc' // -> {section: 'blog', tag: ['js', 'doc']}
         * 'tag=ruby%20on%20rails'        // -> {tag: 'ruby on rails'}
         * 'id=45&raw'        // -> {id: '45', raw: ''}
         * </pre>
         */
        unparam: function(str, sep) {
            if (typeof str !== 'string' || (str = decodeURI(S.trim(str))).length === 0) return { };

            var ret = {},
                pairs = str.split(sep || '&'),
                pair, key, val, m,
                i = 0, len = pairs.length;

            for (; i < len; ++i) {
                pair = pairs[i].split('=');
                key = pair[0];
                val = pair[1] || '';

                if ((m = key.match(REG_ARR_KEY)) && m[1]) {
                    ret[m[1]] = ret[m[1]] || [];
                    ret[m[1]].push(val);
                } else {
                    ret[key] = val;
                }
            }
            return ret;
        },

        /**
         * Executes the supplied function in the context of the supplied
         * object 'when' milliseconds later. Executes the function a
         * single time unless periodic is set to true.
         * @param when {int} the number of milliseconds to wait until the fn
         * is executed.
         * @param o the context object.
         * @param fn {Function|String} the function to execute or the name of
         * the method in the 'o' object to execute.
         * @param data [Array] data that is provided to the function. This accepts
         * either a single item or an array. If an array is provided, the
         * function is executed with one parameter for each array item. If
         * you need to pass a single array parameter, it needs to be wrapped in
         * an array [myarray].
         * @param periodic {boolean} if true, executes continuously at supplied
         * interval until canceled.
         * @return {object} a timer object. Call the cancel() method on this object to
         * stop the timer.
         */
        later: function(fn, when, periodic, o, data) {
            when = when || 0;
            o = o || { };
            var m = fn, d = S.makeArray(data), f, r;

            if (typeof fn === 'string') {
                m = o[fn];
            }

            if (!m) {
                S.error('method undefined');
            }

            f = function() {
                m.apply(o, d);
            };

            r = (periodic) ? setInterval(f, when) : setTimeout(f, when);

            return {
                id: r,
                interval: periodic,
                cancel: function() {
                    if (this.interval) {
                        clearInterval(r);
                    } else {
                        clearTimeout(r);
                    }
                }
            };
        },

        /**
         * Evalulates a script in a global context
         */
        globalEval: function(data) {
            if ((data = S.trim(data))) {
                // Inspired by code by Andrea Giammarchi
                // http://webreflection.blogspot.com/2007/08/global-scope-evaluation-and-dom.html
                var head = doc.getElementsByTagName('head')[0] || doc.documentElement,
                    script = doc.createElement('script');

                if (S.UA.ie) { // TODO: feature test
                    script.text = data;
                } else {
                    script.appendChild(doc.createTextNode(data));
                }

                // Use insertBefore instead of appendChild to circumvent an IE6 bug.
                // This arises when a base node is used.
                head.insertBefore(script, head.firstChild);
                head.removeChild(script);
            }
        }
    });

    function isValidParamValue(val) {
        var t = typeof val;
        // val 为 null, undefined, number, string, boolean 时，返回 true
        return val === null | (t !== 'object' && t !== 'function');
    }

    // 可以通过在 url 上加 ?ks-debug 来开启 debug
    if('ks-debug' in S.unparam(location.hash)){
        S.Config.debug = true;
    }
});

/**
 * NOTES:
 *
 *  2010.04
 *   - param 和 unparam 应该放在什么地方合适？有点纠结，目前暂放此处。
 *   - 对于 param, encodeURI 就可以了，和 jQuery 保持一致。
 *   - param 和 unparam 是不完全可逆的。对空值的处理和 cookie 保持一致。
 *
 * TODO:
 *   - 分析 jq 的 isPlainObject
 *   - globalEval 中，appendChild 方式真的比 text 方式性能更好?
 *
 */
/**
 * @module  ua
 * @author  lifesinger@gmail.com
 * @depends kissy
 */

KISSY.add('ua', function(S) {

    var ua = navigator.userAgent,
        m,
        o = {
            ie: 0,
            gecko: 0,
            firefox:  0,
            opera: 0,
            webkit: 0,
            safari: 0,
            chrome: 0,
            mobile: ''
        },
        numberify = function(s) {
            var c = 0;
            // convert '1.2.3.4' to 1.234
            return parseFloat(s.replace(/\./g, function() {
                return (c++ === 0) ? '.' : '';
            }));
        };

    // WebKit
    if ((m = ua.match(/AppleWebKit\/([\d.]*)/)) && m[1]) {
        o.webkit = numberify(m[1]);

        // Chrome
        if ((m = ua.match(/Chrome\/([\d.]*)/)) && m[1]) {
            o.chrome = numberify(m[1]);
        }
        // Safari
        else if ((m = ua.match(/\/([\d.]*) Safari/)) && m[1]) {
            o.safari = numberify(m[1]);
        }

        // Apple Mobile
        if (/ Mobile\//.test(ua)) {
            o.mobile = 'Apple'; // iPhone or iPod Touch
        }
        // Other WebKit Mobile Browsers
        else if ((m = ua.match(/NokiaN[^\/]*|Android \d\.\d|webOS\/\d\.\d/))) {
            o.mobile = m[0]; // Nokia N-series, Android, webOS, ex: NokiaN95
        }
    }
    // NOT WebKit
    else {
        // Opera
        if ((m = ua.match(/Opera\/.* Version\/([\d.]*)/)) && m[1]) {
            o.opera = numberify(m[1]);

            // Opera Mini
            if ((ua.match(/Opera Mini[^;]*/))) {
                o.mobile = m[0]; // ex: Opera Mini/2.0.4509/1316
            }

        // NOT WebKit or Opera
        } else {
            // MSIE
            if ((m = ua.match(/MSIE\s([^;]*)/)) && m[1]) {
                o.ie = numberify(m[1]);

            // NOT WebKit, Opera or IE
            } else {
                // Gecko
                if ((m = ua.match(/Gecko/))) {
                    o.gecko = 1; // Gecko detected, look for revision
                    if ((m = ua.match(/rv:([\d.]*)/)) && m[1]) {
                        o.gecko = numberify(m[1]);
                    }

                    // Firefox
                    if ((m = ua.match(/Firefox\/([\d.]*)/)) && m[1]) {
                        o.firefox = numberify(m[1]);
                    }
                }
            }
        }
    }

    S.UA = o;
});

/**
 * Notes:
 *
 * 2010.03
 *  - jQuery, YUI 等类库都推荐用特性探测替代浏览器嗅探。特性探测的好处是能自动适应未来设备和未知设备，比如
 *    if(document.addEventListener) 假设 IE 10 支持标准事件，则代码不用修改，就自适应了“未来浏览器”。
 *    对于未知浏览器也是如此。但是，这并不意味着浏览器嗅探就得彻底抛弃。当代码很明确就是针对已知特定浏览器的，
 *    并且并非是某个特性探测可以解决时，用浏览器嗅探反而能带来代码的简洁，同时也也不会有什么后患。总之，一切
 *    皆权衡。
 *  - UA.ie && UA.ie < 8 并不意味着浏览器就不是 IE8, 有可能是 IE8 的兼容模式。进一步的判断需要使用 documentMode
 *
 * TODO:
 *  - test mobile
 *  - 权衡是否需要加入 maxthon 等国内浏览器嗅探？
 * 
 */