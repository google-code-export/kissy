/*
Copyright 2010, KISSY UI Library v1.0.8
MIT Licensed
build: 888 Jul 20 19:33
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

        // Copies all the properties of s to r
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
        readyBound = false,

        // The number of poll times.
        POLL_RETRYS = 500,

        // The poll interval in milliseconds.
        POLL_INTERVAL = 40,

        // #id or id
        RE_IDSTR = /^#?([\w-]+)$/;

    mix(S, {
        /**
         * The version of the library.
         * @type {String}
         */
        version: '1.0.8',

        /**
         * Initializes KISSY object.
         * @private
         */
        _init: function() {
            // Env 对象目前仅用于内部，为模块动态加载预留接口
            this.Env = {
                mods: { },
                guid: 0
            };
        },

        /**
         * Registers a module.
         * @param name {String} module name
         * @param fn {Function} entry point into the module that is used to bind module to KISSY
         * <code>
         * KISSY.add('module-name', function(S){ });
         * </code>
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
         * @param fn {Function} A function to execute after the DOM is ready
         * <code>
         * KISSY.ready(function(S){ });
         * </code>
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
                eventType = doScroll ? 'onreadystatechange' : 'DOMContentLoaded',
                COMPLETE = 'complete',
                fire = function() {
                    self._fireReady();
                };

            // Set to true once it runs
            readyBound = true;

            // Catch cases where ready() is called after the
            // browser event has already occurred.
            if (doc.readyState === COMPLETE) {
                return fire();
            }

            // w3c mode
            if (doc.addEventListener) {
                function domReady() {
                    doc.removeEventListener(eventType, domReady, false);
                    fire();
                }

                doc.addEventListener(eventType, domReady, false);

                // A fallback to window.onload, that will always work
			    win.addEventListener('load', fire, false);
            }
            // IE event model is used
            else {
                function stateChange() {
                    if (doc.readyState === COMPLETE) {
                        doc.detachEvent(eventType, stateChange);
                        fire();
                    }
                }

                // ensure firing before onload, maybe late but safe also for iframes
                doc.attachEvent(eventType, stateChange);

                // A fallback to window.onload, that will always work.
                win.attachEvent('onload', fire);

                if (win == win.top) { // not an iframe
                    function readyScroll() {
                        try {
                            // Ref: http://javascript.nwbox.com/IEContentLoaded/
                            doScroll('left');
                            fire();
                        } catch(ex) {
                            setTimeout(readyScroll, 1);
                        }
                    }
                    readyScroll();
                }
            }
        },

        /**
         * Executes functions bound to ready event.
         */
        _fireReady: function() {
            if (isReady) return;

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
         * Executes the supplied callback when the item with the supplied id is found.
         * @param id <String> The id of the element, or an array of ids to look for.
         * @param fn <Function> What to execute when the element is found.
         */
        available: function(id, fn) {
            id = (id + '').match(RE_IDSTR)[1];
            if (!id || !S.isFunction(fn)) return;

            var retryCount = 1,

                timer = S.later(function() {
                    if (doc.getElementById(id) && (fn() || 1) || ++retryCount > POLL_RETRYS) {
                        timer.cancel();
                    }

                }, POLL_INTERVAL, true);
        },

        /**
         * Copies all the properties of s to r.
         * @return {Object} the augmented object
         */
        mix: mix,

        /**
         * Returns a new object containing all of the properties of
         * all the supplied objects. The properties from later objects
         * will overwrite those in earlier objects. Passing in a
         * single object will create a shallow copy of it.
         * @return {Object} the new merged object
         */
        merge: function() {
            var o = {}, i, l = arguments.length;
            for (i = 0; i < l; ++i) {
                mix(o, arguments[i]);
            }
            return o;
        },

        /**
         * Applies prototype properties from the supplier to the receiver.
         * @return {Object} the augmented object
         */
        augment: function(/*r, s1, s2, ..., ov, wl*/) {
            var args = arguments, len = args.length - 2,
                r = args[0], ov = args[len], wl = args[len + 1],
                i = 1;

            if (!S.isArray(wl)) {
                ov = wl;
                wl = undefined;
                len++;
            }

            if (!S.isBoolean(ov)) {
                ov = undefined;
                len++;
            }

            for (; i < len; i++) {
                mix(r.prototype, args[i].prototype || args[i], ov, wl);
            }

            return r;
        },

        /**
         * Utility to set up the prototype, constructor and superclass properties to
         * support an inheritance strategy that can chain constructors and methods.
         * Static members will not be inherited.
         * @param r {Function} the object to modify
         * @param s {Function} the object to inherit
         * @param px {Object} prototype properties to add/override
         * @param sx {Object} static properties to add/override
         * @return r {Object}
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
         * Returns the namespace specified and creates it if it doesn't exist. Be careful
         * when naming packages. Reserved words may work in some browsers and not others.
         * <code>
         * S.namespace('KISSY.app'); // returns KISSY.app
         * S.namespace('app.Shop'); // returns KISSY.app.Shop
         * </code>
         * @return {Object}  A reference to the last namespace object created
         */
        namespace: function() {
            var l = arguments.length, o = null, i, j, p;

            for (i = 0; i < l; ++i) {
                p = ('' + arguments[i]).split('.');
                o = this;
                for (j = (win[p[0]] === o) ? 1 : 0; j < p.length; ++j) {
                    o = o[p[j]] = o[p[j]] || {};
                }
            }
            return o;
        },

        /**
         * create app based on KISSY.
         * @param name {String} the app name
         * @param sx {Object} static properties to add/override
         * <code>
         * S.app('TB');
         * TB.namespace('app'); // returns TB.app
         * </code>
         * @return {Object}  A reference to the app global object
         */
        app: function(name, sx) {
            var O = win[name] || {};

            mix(O, this, true, ['_init', 'add', 'namespace']);
            O._init();

            return mix((win[name] = O), typeof sx === 'function' ? sx() : sx);
        },

        /**
         * Prints debug info.
         * @param msg {String} the message to log.
         * @param cat {String} the log category for the message. Default
         *        categories are "info", "warn", "error", "time" etc.
         * @param src {String} the source of the the message (opt)
         * @return {KISSY}
         */
        log: function(msg, cat, src) {
            if (this.Config.debug) {
                if (src) {
                    msg = src + ': ' + msg;
                }
                if (win['console'] !== undefined && console.log) {
                    console[cat && console[cat] ? cat : 'log'](msg);
                }
            }
            return this;
        },

        /**
         * Throws error message.
         */
        error: function(msg) {
            if (this.Config.debug) {
                throw msg;
            }
        },

        /*
         * Generate a global unique id.
         * @param pre {String} optional guid prefix
         * @return {String} the guid
         */
        guid: function(pre) {
            var id = this.Env.guid++ + '';
            return pre ? pre + id : id;
        }
    });

    S._init();

    // build 时，会将 @DEBUG@ 替换为空
    S.Config = { debug: '@DEBUG@' };

})(window, 'KISSY');

/**
 * NOTES:
 *
 * 2010.07
 *  - 增加 available 和 guid 方法。
 *
 * 2010.04
 *  - 移除掉 weave 方法，尚未考虑周全。
 *
 * 2010.01
 *  - add 方法决定内部代码的基本组织方式（用 module 和 submodule 来组织代码）。
 *  - ready, available 方法决定外部代码的基本调用方式，提供了一个简单的弱沙箱。
 *  - mix, merge, augment, extend 方法，决定了类库代码的基本实现方式，充分利用 mixin 特性和 prototype 方式来实现代码。
 *  - namespace, app 方法，决定子库的实现和代码的整体组织。
 *  - log, error 方法，简单的调试工具和报错机制。
 *  - guid 方法，全局辅助方法。
 *  - 考虑简单够用和 2/8 原则，去掉对 YUI3 沙箱的模拟。（archives/2009 r402）
 *
 * TODO:
 *  - 模块动态加载 require 方法的实现。
 *
 */
/**
 * @module  kissy-lang
 * @author  lifesinger@gmail.com
 */
KISSY.add('kissy-lang', function(S, undefined) {

    var win = window, doc = document, loc = location,
        AP = Array.prototype,
        indexOf = AP.indexOf, filter = AP.filter,
        trim = String.prototype.trim,
        toString = Object.prototype.toString,
        encode = encodeURIComponent,
        decode = decodeURIComponent,
        HAS_OWN_PROPERTY = 'hasOwnProperty',
        SEP = '&',
        REG_TRIM = /^\s+|\s+$/g,
        REG_ARR_KEY = /^(\w+)\[\]$/,
        REG_NOT_WHITE = /\S/;

    S.mix(S, {

        /**
         * Determines whether or not the provided object is undefined.
         */
        isUndefined: function(o) {
            return o === undefined;
        },

        /**
         * Determines whether or not the provided object is a boolean.
         */
        isBoolean: function(o) {
            return typeof o === 'boolean';
        },

        /**
         * Determines whether or not the provided object is a string.
         */
        isString: function(o) {
            return typeof o === 'string';
        },

        /**
         * Determines whether or not the provided item is a legal number.
         * NOTICE: Infinity and NaN return false.
         */
        isNumber: function(o) {
            return typeof o === 'number' && isFinite(o);
        },

        /**
         * Checks to see if an object is a plain object (created using "{}" or "new Object").
         */
        isPlainObject: function(o) {
            // Make sure that DOM nodes and window objects don't pass through.
            return o && toString.call(o) === '[object Object]' && !o['nodeType'] && !o['setInterval'];
        },

        /**
         * Checks to see if an object is empty.
         */
        isEmptyObject: function(o) {
            for (var p in o) {
                return false;
            }
            return true;
        },

        /**
         * Determines whether or not the provided object is a function.
         * NOTICE: DOM methods and functions like alert aren't supported. They return false on IE.
         */
        isFunction: function(o) {
            //return typeof o === 'function';
            // Safari 下，typeof NodeList 也返回 function
            return toString.call(o) === '[object Function]';
        },

        /**
         * Determines whether or not the provided object is an array.
         */
        isArray: function(o) {
            return toString.call(o) === '[object Array]';
        },

        /**
         * Removes the whitespace from the beginning and end of a string.
         */
        trim: trim ?
            function(str) {
                return (str == undefined) ? '' : trim.call(str);
            } :
            function(str) {
                return (str == undefined) ? '' : str.toString().replace(REG_TRIM, '');
            },

        /**
         * Executes the supplied function on each item in the array.
         * @param arr {Array} the array to iterate
         * @param fn {Function} the function to execute on each item. The function
         *        receives three arguments: the value, the index, the full array.
         * @param context {Object} (opt)
         */
        each: function(arr, fn, context) {
            var l = (arr && arr.length) || 0, i = 0;
            for (; i < l; ++i) {
                fn.call(context || win, arr[i], i, arr);
            }
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
        inArray: function(elem, arr) {
            return S.indexOf(elem, arr) > -1;
        },

        /**
         * Converts object to a true array.
         */
        makeArray: function(o) {
            if (o === null || o === undefined) return [];
            if (S.isArray(o)) return o;

            // The strings and functions also have 'length'
            if (typeof o.length !== 'number' || typeof o === 'string' || S.isFunction(o)) {
                return [o];
            }

            // ie 不支持用 slice 转换 NodeList, 降级到普通方法
            if (o.item && S.UA.ie) {
                var ret = [], i = 0, len = o.length;
                for (; i < len; ++i) {
                    ret[i] = o[i];
                }
                return ret;
            }

            // array-like
            return AP.slice.call(o);
        },

        /**
         * Executes the supplied function on each item in the array.
         * Returns a new array containing the items that the supplied
         * function returned true for.
         * @param arr {Array} the array to iterate
         * @param fn {Function} the function to execute on each item
         * @param context {Object} optional context object
         * @return {Array} The items on which the supplied function
         *         returned true. If no items matched an empty array is
         *         returned.
         */
        filter: filter ?
            function(arr, fn, context) {
                return filter.call(arr, fn, context);
            } :
            function(arr, fn, context) {
                var ret = [];
                S.each(arr, function(item, i, arr) {
                    if (fn.call(context, item, i, arr)) {
                        ret.push(item);
                    }
                });
                return ret;
            },

        /**
         * Creates a serialized string of an array or object.
         * <code>
         * {foo: 1, bar: 2}    // -> 'foo=1&bar=2'
         * {foo: 1, bar: [2, 3]}    // -> 'foo=1&bar[]=2&bar[]=3'
         * {foo: '', bar: 2}    // -> 'foo=&bar=2'
         * {foo: undefined, bar: 2}    // -> 'foo=undefined&bar=2'
         * {foo: true, bar: 2}    // -> 'foo=true&bar=2'
         * </code>
         */
        param: function(o, sep) {
            // 非 plain object, 直接返回空
            if (!S.isPlainObject(o)) return '';
            sep = sep || SEP;

            var buf = [], key, val;
            for (key in o) {
                val = o[key];
                key = encode(key);

                // val 为有效的非数组值
                if (isValidParamValue(val)) {
                    buf.push(key, '=', encode(val + ''), sep);
                }
                // val 为非空数组
                else if (S.isArray(val) && val.length) {
                    for (var i = 0, len = val.length; i < len; ++i) {
                        if (isValidParamValue(val[i])) {
                            buf.push(key, '[]=', encode(val[i] + ''), sep);
                        }
                    }
                }
                // 其它情况：包括空数组、不是数组的 object（包括 Function, RegExp, Date etc.），直接丢弃
            }
            buf.pop();
            return buf.join('');
        },

        /**
         * Parses a URI-like query string and returns an object composed of parameter/value pairs.
         * <code>
         * 'section=blog&id=45'        // -> {section: 'blog', id: '45'}
         * 'section=blog&tag[]=js&tag[]=doc' // -> {section: 'blog', tag: ['js', 'doc']}
         * 'tag=ruby%20on%20rails'        // -> {tag: 'ruby on rails'}
         * 'id=45&raw'        // -> {id: '45', raw: ''}
         * </code>
         */
        unparam: function(str, sep) {
            if (typeof str !== 'string' || (str = S.trim(str)).length === 0) return {};

            var ret = {},
                pairs = str.split(sep || SEP),
                pair, key, val, m,
                i = 0, len = pairs.length;

            for (; i < len; ++i) {
                pair = pairs[i].split('=');
                key = decode(pair[0]);

                // pair[1] 可能包含 gbk 编码的中文，而 decodeURIComponent 仅能处理 utf-8 编码的中文，否则报错
                try {
                    val = decode(pair[1] || '');
                } catch (ex) {
                    val = pair[1] || '';
                }

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
         * @param fn {Function|String} the function to execute or the name of the method in
         *        the 'o' object to execute.
         * @param when {Number} the number of milliseconds to wait until the fn is executed.
         * @param periodic {Boolean} if true, executes continuously at supplied interval
         *        until canceled.
         * @param o {Object} the context object.
         * @param data [Array] that is provided to the function. This accepts either a single
         *        item or an array. If an array is provided, the function is executed with
         *        one parameter for each array item. If you need to pass a single array
         *        parameter, it needs to be wrapped in an array [myarray].
         * @return {Object} a timer object. Call the cancel() method on this object to stop
         *         the timer.
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
         * Creates a deep copy of a plain object or array. Others are returned untouched.
         */
        clone: function(o) {
            var ret = o, b, k;

            // array or plain object
            if (o && ((b = S.isArray(o)) || S.isPlainObject(o))) {
                ret = b ? [] : {};
                for (k in o) {
                    if (o[HAS_OWN_PROPERTY](k)) {
                        ret[k] = S.clone(o[k]);
                    }
                }
            }

            return ret;
        },

        /**
         * Gets current date in milliseconds.
         */
        now: function() {
            return new Date().getTime();
        },

        /**
         * Evalulates a script in a global context.
         */
        globalEval: function(data) {
            if (data && REG_NOT_WHITE.test(data)) {
                // Inspired by code by Andrea Giammarchi
                // http://webreflection.blogspot.com/2007/08/global-scope-evaluation-and-dom.html
                var head = doc.getElementsByTagName('head')[0] || doc.documentElement,
                    script = doc.createElement('script');

                // It works! All browsers support!
                script.text = data;

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
        return val === null || (t !== 'object' && t !== 'function');
    }

    // 可以通过在 url 上加 ?ks-debug 来开启 debug 模式
    if (loc && loc.search && loc.search.indexOf('ks-debug') !== -1) {
        S.Config.debug = true;
    }
});

/**
 * NOTES:
 *
 *  2010.06
 *   - unparam 里的 try catch 让人很难受，但为了顺应国情，决定还是留着。
 *
 *  2010.05
 *   - 增加 filter 方法。
 *   - globalEval 中，直接采用 text 赋值，去掉 appendChild 方式。
 *
 *  2010.04
 *   - param 和 unparam 应该放在什么地方合适？有点纠结，目前暂放此处。
 *   - param 和 unparam 是不完全可逆的。对空值的处理和 cookie 保持一致。
 *
 * TODO:
 *   - 分析 jq 的 isPlainObject 对 constructor 等细节处理
 *
 */
/**
 * @module  kissy-ua
 * @author  lifesinger@gmail.com
 */
KISSY.add('kissy-ua', function(S) {

    var ua = navigator.userAgent,
        m,
        o = {
            webkit: 0,
            chrome: 0,
            safari: 0,
            gecko: 0,
            firefox:  0,
            ie: 0,
            opera: 0,
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
            o.mobile = 'Apple'; // iPad, iPhone or iPod Touch
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
 * NOTES:
 *
 * 2010.03
 *  - jQuery, YUI 等类库都推荐用特性探测替代浏览器嗅探。特性探测的好处是能自动适应未来设备和未知设备，比如
 *    if(document.addEventListener) 假设 IE9 支持标准事件，则代码不用修改，就自适应了“未来浏览器”。
 *    对于未知浏览器也是如此。但是，这并不意味着浏览器嗅探就得彻底抛弃。当代码很明确就是针对已知特定浏览器的，
 *    同时并非是某个特性探测可以解决时，用浏览器嗅探反而能带来代码的简洁，同时也也不会有什么后患。总之，一切
 *    皆权衡。
 *  - UA.ie && UA.ie < 8 并不意味着浏览器就不是 IE8, 有可能是 IE8 的兼容模式。进一步的判断需要使用 documentMode.
 *
 * TODO:
 *  - test mobile
 *  - 是否需要加入 maxthon 等国内浏览器嗅探？
 * 
 */
/*
Copyright 2010, KISSY UI Library v1.0.8
MIT Licensed
build: 888 Jul 20 19:32
*/
/**
 * @module  dom
 * @author  lifesinger@gmail.com
 */
KISSY.add('dom', function(S) {

    var DOM = {

        /**
         * 是不是 element/text node
         */
        _isSupportedNode: function(elem) {
            return DOM._isElementNode(elem) || DOM._isTextNode(elem);
        },

        /**
         * 是不是 element node
         */
        _isElementNode: function(elem) {
            return elem && elem.nodeType === 1;
        },

        /**
         * 是不是 text node
         */
        _isTextNode: function(elem) {
            return elem && elem.nodeType === 3;
        }
    };

    S.DOM = DOM;
});
/**
 * @module  selector
 * @author  lifesinger@gmail.com
 */
KISSY.add('selector', function(S, undefined) {

    var doc = document,
        DOM = S.DOM,
        SPACE = ' ',
        ANY = '*',
        REG_ID = /^#[\w-]+$/,
        REG_QUERY = /^(?:#([\w-]+))?\s*([\w-]+|\*)?\.?([\w-]+)?$/;

    /**
     * Retrieves an Array of HTMLElement based on the given CSS selector.
     * @param {string} selector
     * @param {string|HTMLElement} context An #id string or a HTMLElement used as context
     * @return {Array} The array of found HTMLElement
     */
    function query(selector, context) {
        var match, t, ret = [], id, tag, cls;
        context = tuneContext(context);

        // Ref: http://ejohn.org/blog/selectors-that-people-actually-use/
        // 考虑 2/8 原则，仅支持以下选择器：
        // #id
        // tag
        // .cls
        // #id tag
        // #id .cls
        // tag.cls
        // #id tag.cls
        // 注 1：REG_QUERY 还会匹配 #id.cls
        // 注 2：tag 可以为 * 字符
        // 返回值为数组
        // 选择器不支持时，抛出异常

        // selector 为字符串是最常见的情况，优先考虑
        // 注：空白字符串无需判断，运行下去自动能返回空数组
        if (S.isString(selector)) {
            selector = S.trim(selector);

            // selector 为 #id 是最常见的情况，特殊优化处理
            if (REG_ID.test(selector)) {
                t = getElementById(selector.slice(1));
                if (t) ret = [t]; // #id 无效时，返回空数组
            }
            // selector 为支持列表中的其它 6 种
            else if ((match = REG_QUERY.exec(selector))) {
                // 获取匹配出的信息
                id = match[1];
                tag = match[2];
                cls = match[3];

                if ((context = id ? getElementById(id) : context)) {

                    // #id .cls | #id tag.cls | .cls | tag.cls
                    if (cls) {
                        if (!id || selector.indexOf(SPACE) !== -1) { // 排除 #id.cls
                            ret = getElementsByClassName(cls, tag, context);
                        }
                        // 处理 #id.cls
                        else {
                            t = getElementById(id);
                            if(t && DOM.hasClass(t, cls)) {
                                ret = [t];
                            }
                        }
                    }
                    // #id tag | tag
                    else if (tag) { // 排除空白字符串
                        ret = getElementsByTagName(context, tag);
                    }
                }
            }
            // 采用外部选择器
            else if(S.ExternalSelector) {
                return S.ExternalSelector(selector, context);
            }
            // 依旧不支持，抛异常
            else {
                error(selector);
            }
        }
        // 传入的 selector 是 Node
        else if (selector && selector.nodeType) {
            ret = [selector];
        }
        // 传入的 selector 是 NodeList（包括 KISSY.Node/NodeList） 或已是 Array
        else if (selector && (S.isArray(selector) || selector.item || selector.getDOMNode)) {
            ret = selector;
        }
        // 传入的 selector 是其它值时，返回空数组

        // 将 NodeList 转换为普通数组
        if(ret.item) {
            ret = S.makeArray(ret);
        }

        return ret;
    }

    // 调整 context 为合理值
    function tuneContext(context) {
        // 1). context 为 undefined 是最常见的情况，优先考虑
        if (context === undefined) {
            context = doc;
        }
        // 2). context 的第二使用场景是传入 #id
        else if (S.isString(context) && REG_ID.test(context)) {
            context = getElementById(context.slice(1));
            // 注：#id 可能无效，这时获取的 context 为 null
        }
        // 3). context 还可以传入 HTMLElement, 此时无需处理
        // 4). 经历 1 - 3, 如果 context 还不是 HTMLElement, 赋值为 null
        else if (context && context.nodeType !== 1 && context.nodeType !== 9) {
            context = null;
        }
        return context;
    }

    // query #id
    function getElementById(id) {
        return doc.getElementById(id);
    }

    // query tag
    function getElementsByTagName(el, tag) {
        return el.getElementsByTagName(tag);
    }
    (function() {
        // Check to see if the browser returns only elements
        // when doing getElementsByTagName('*')

        // Create a fake element
        var div = doc.createElement('div');
        div.appendChild(doc.createComment(''));

        // Make sure no comments are found
        if (div.getElementsByTagName(ANY).length > 0) {
            getElementsByTagName = function(el, tag) {
                var ret = el.getElementsByTagName(tag);

                if (tag === ANY) {
                    var t = [], i = 0, j = 0, node;
                    while ((node = ret[i++])) {
                        // Filter out possible comments
                        if (node.nodeType === 1) {
                            t[j++] = node;
                        }
                    }
                    ret = t;
                }
                return ret;
            };
        }
    })();

    // query .cls
    function getElementsByClassName(cls, tag, context) {
        var els = context.getElementsByClassName(cls),
            ret = els, i = 0, j = 0, len = els.length, el;

        if (tag && tag !== ANY) {
            ret = [];
            tag = tag.toUpperCase();
            for (; i < len; ++i) {
                el = els[i];
                if (el.tagName === tag) {
                    ret[j++] = el;
                }
            }
        }
        return ret;
    }
    if (!doc.getElementsByClassName) {
        // 降级使用 querySelectorAll
        if (doc.querySelectorAll) {
            getElementsByClassName = function(cls, tag, context) {
                return context.querySelectorAll((tag ? tag : '') + '.' + cls);
            }
        }
        // 降级到普通方法
        else {
            getElementsByClassName = function(cls, tag, context) {
                var els = context.getElementsByTagName(tag || ANY),
                    ret = [], i = 0, j = 0, len = els.length, el, t;

                cls = SPACE + cls + SPACE;
                for (; i < len; ++i) {
                    el = els[i];
                    t = el.className;
                    if (t && (SPACE + t + SPACE).indexOf(cls) > -1) {
                        ret[j++] = el;
                    }
                }
                return ret;
            }
        }
    }

    // throw exception
    function error(msg) {
        S.error('Unsupported selector: ' + msg);
    }

    // public api
    S.query = query;
    S.get = function(selector, context) {
        return query(selector, context)[0] || null;
    };

    S.mix(DOM, {

        query: query,

        get: S.get,

        /**
         * Filters an array of elements to only include matches of a filter.
         * @param filter selector or fn
         */
        filter: function(selector, filter) {
            var elems = query(selector), match, tag, cls, ret = [];

            // 默认仅支持最简单的 tag.cls 形式
            if (S.isString(filter) && (match = REG_QUERY.exec(filter)) && !match[1]) {
                tag = match[2];
                cls = match[3];
                filter = function(elem) {
                    return !((tag && elem.tagName !== tag.toUpperCase()) || (cls && !DOM.hasClass(elem, cls)));
                }
            }

            if (S.isFunction(filter)) {
                ret = S.filter(elems, filter);
            }
            // 其它复杂 filter, 采用外部选择器
            else if (filter && S.ExternalSelector) {
                ret = S.ExternalSelector._filter(selector, filter);
            }
            // filter 为空或不支持的 selector
            else {
                error(filter);
            }

            return ret;
        },

        /**
         * Returns true if the passed element(s) match the passed filter
         */
        test: function(selector, filter) {
            var elems = query(selector);
            return DOM.filter(elems, filter).length === elems.length;
        }

    });
});

/**
 * NOTES:
 *
 * 2010.01
 *  - 对 reg exec 的结果(id, tag, className)做 cache, 发现对性能影响很小，去掉。
 *  - getElementById 使用频率最高，使用直达通道优化。
 *  - getElementsByClassName 性能优于 querySelectorAll, 但 IE 系列不支持。
 *  - instanceof 对性能有影响。
 *  - 内部方法的参数，比如 cls, context 等的异常情况，已经在 query 方法中有保证，无需冗余“防卫”。
 *  - query 方法中的条件判断考虑了“频率优先”原则。最有可能出现的情况放在前面。
 *  - Array 的 push 方法可以用 j++ 来替代，性能有提升。
 *  - 返回值策略和 Sizzle 一致，正常时，返回数组；其它所有情况，返回空数组。
 *
 *  - 从压缩角度考虑，还可以将 getElmentsByTagName 和 getElementsByClassName 定义为常量，
 *    不过感觉这样做太“压缩控”，还是保留不替换的好。
 *
 *  - 调整 getElementsByClassName 的降级写法，性能最差的放最后。
 *
 * 2010.02
 *  - 添加对分组选择器的支持（主要参考 Sizzle 的代码，代去除了对非 Grade A 级浏览器的支持）
 *
 * 2010.03
 *  - 基于原生 dom 的两个 api: S.query 返回数组; S.get 返回第一个。
 *    基于 Node 的 api: S.one, 在 Node 中实现。
 *    基于 NodeList 的 api: S.all, 在 NodeList 中实现。
 *    通过 api 的分层，同时满足初级用户和高级用户的需求。
 *
 * 2010.05
 *  - 去掉给 S.query 返回值默认添加的 each 方法，保持纯净。
 *  - 对于不支持的 selector, 采用外部耦合进来的 Selector.
 *
 * 2010.06
 *  - 增加 filter 和 test 方法
 * 
 * 2010.07
 *  - 取消对 , 分组的支持，group 直接用 Sizzle
 *
 * Bugs:
 *  - S.query('#test-data *') 等带 * 号的选择器，在 IE6 下返回的值不对。jQuery 等类库也有此 bug, 诡异。
 *
 * References:
 *  - http://ejohn.org/blog/selectors-that-people-actually-use/
 *  - http://ejohn.org/blog/thoughts-on-queryselectorall/
 *  - MDC: querySelector, querySelectorAll, getElementsByClassName
 *  - Sizzle: http://github.com/jeresig/sizzle
 *  - MINI: http://james.padolsey.com/javascript/mini/
 *  - Peppy: http://jamesdonaghue.com/?p=40
 *  - Sly: http://github.com/digitarald/sly
 *  - XPath, TreeWalker：http://www.cnblogs.com/rubylouvre/archive/2009/07/24/1529640.html
 *
 *  - http://www.quirksmode.org/blog/archives/2006/01/contains_for_mo.html
 *  - http://www.quirksmode.org/dom/getElementsByTagNames.html
 *  - http://ejohn.org/blog/comparing-document-position/
 *  - http://github.com/jeresig/sizzle/blob/master/sizzle.js
 */
/**
 * @module  dom-class
 * @author  lifesinger@gmail.com
 */
KISSY.add('dom-class', function(S, undefined) {

    var SPACE = ' ',
        DOM = S.DOM,
        REG_SPLIT = /[\.\s]\s*\.?/,
        REG_CLASS = /[\n\t]/g;

    S.mix(DOM, {

        /**
         * Determine whether any of the matched elements are assigned the given class.
         */
        hasClass: function(selector, value) {
            return batch(selector, value, function(elem, classNames, cl) {
                var elemClass = elem.className;
                if (elemClass) {
                    var className = SPACE + elemClass + SPACE, j = 0, ret = true;
                    for (; j < cl; j++) {
                        if (className.indexOf(SPACE + classNames[j] + SPACE) < 0) {
                            ret = false;
                            break;
                        }
                    }
                    if (ret) return true;
                }
            }, true);
        },

        /**
         * Adds the specified class(es) to each of the set of matched elements.
         */
        addClass: function(selector, value) {
            batch(selector, value, function(elem, classNames, cl) {
                var elemClass = elem.className;
                if (!elemClass) {
                    elem.className = value;
                }
                else {
                    var className = SPACE + elemClass + SPACE, setClass = elemClass, j = 0;
                    for (; j < cl; j++) {
                        if (className.indexOf(SPACE + classNames[j] + SPACE) < 0) {
                            setClass += SPACE + classNames[j];
                        }
                    }
                    elem.className = S.trim(setClass);
                }
            });
        },

        /**
         * Remove a single class, multiple classes, or all classes from each element in the set of matched elements.
         */
        removeClass: function(selector, value) {
            batch(selector, value, function(elem, classNames, cl) {
                var elemClass = elem.className;
                if (elemClass) {
                    if (!cl) {
                        elem.className = '';
                    }
                    else {
                        var className = (SPACE + elemClass + SPACE).replace(REG_CLASS, SPACE), j = 0, needle;
                        for (; j < cl; j++) {
                            needle = SPACE + classNames[j] + SPACE;
                            // 一个 cls 有可能多次出现：'link link2 link link3 link'
                            while (className.indexOf(needle) >= 0) {
                                className = className.replace(needle, SPACE);
                            }
                        }
                        elem.className = S.trim(className);
                    }
                }
            });
        },

        /**
         * Replace a class with another class for matched elements.
         * If no oldClassName is present, the newClassName is simply added.
         */
        replaceClass: function(selector, oldClassName, newClassName) {
            DOM.removeClass(selector, oldClassName);
            DOM.addClass(selector, newClassName);
        },

        /**
         * Add or remove one or more classes from each element in the set of
         * matched elements, depending on either the class's presence or the
         * value of the switch argument.
         * @param state {Boolean} optional boolean to indicate whether class
         *        should be added or removed regardless of current state.
         */
        toggleClass: function(selector, value, state) {
            var isBool = S.isBoolean(state), has;

            batch(selector, value, function(elem, classNames, cl) {
                var j = 0, className;
                for (; j < cl; j++) {
                    className = classNames[j];
                    has = isBool ? !state : DOM.hasClass(elem, className);
                    DOM[has ? 'removeClass' : 'addClass'](elem, className);
                }
            });
        }
    });

    function batch(selector, value, fn, resultIsBool) {
        if (!(value = S.trim(value))) return resultIsBool ? false : undefined;

        var elems = S.query(selector),
            i = 0, len = elems.length,
            classNames = value.split(REG_SPLIT),
            elem, ret;

        for (; i < len; i++) {
            elem = elems[i];
            if (DOM._isElementNode(elem)) {
                ret = fn(elem, classNames, classNames.length);
                if (ret !== undefined) return ret;
            }
        }

        if (resultIsBool) return false;
    }
});

/**
 * NOTES:
 *   - hasClass/addClass/removeClass 的逻辑和 jQuery 保持一致
 *   - toggleClass 不支持 value 为 undefined 的情形（jQuery 支持）
 */
/**
 * @module  dom-attr
 * @author  lifesinger@gmail.com
 */
KISSY.add('dom-attr', function(S, undefined) {

    var UA = S.UA,
        ie = UA.ie,
        oldIE = ie && ie < 8,

        doc = document,
        docElement = doc.documentElement,
        TEXT = docElement.textContent !== undefined ? 'textContent' : 'innerText',

        DOM = S.DOM,
        isElementNode = DOM._isElementNode,
        isTextNode = DOM._isTextNode,
        
        RE_SPECIAL_ATTRS = /href|src|style/,
        RE_NORMALIZED_ATTRS = /href|src|colspan|rowspan/,
        RE_RETURN = /\r/g,
        RE_RADIO_CHECK = /radio|checkbox/,

        CUSTOM_ATTRS = {
            readonly: 'readOnly'
        };

    if (oldIE) {
        S.mix(CUSTOM_ATTRS, {
            'for': 'htmlFor',
            'class': 'className'
        });
    }

    S.mix(DOM, {

        /**
         * Gets the value of an attribute for the first element in the set of matched elements or
         * Sets an attribute for the set of matched elements.
         */
        attr: function(selector, name, val) {
            if (!(name = S.trim(name))) return;

            name = name.toLowerCase();
            name = CUSTOM_ATTRS[name] || name;

            // getter
            if (val === undefined) {
                // supports css selector/Node/NodeList
                var el = S.get(selector);

                // only get attributes on element nodes
                if (!isElementNode(el)) {
                    return undefined;
                }

                var ret;

                // 优先用 el[name] 获取 mapping 属性值：
                //  - 可以正确获取 readonly, checked, selected 等特殊 mapping 属性值
                //  - 可以获取用 getAttribute 不一定能获取到的值，比如 tabindex 默认值
                //  - href, src 直接获取的是 normalized 后的值，排除掉
                //  - style 需要用 getAttribute 来获取字符串值，也排除掉
                if (!RE_SPECIAL_ATTRS.test(name)) {
                    ret = el[name];
                }

                // 用 getAttribute 获取非 mapping 属性和 href/src/style 的值：
                if (ret === undefined) {
                    ret = el.getAttribute(name);
                }

                // fix ie bugs
                if (oldIE) {
                    // 不光是 href, src, 还有 rowspan 等非 mapping 属性，也需要用第 2 个参数来获取原始值
                    if (RE_NORMALIZED_ATTRS.test(name)) {
                        ret = el.getAttribute(name, 2);
                    }
                    // 在标准浏览器下，用 getAttribute 获取 style 值
                    // IE7- 下，需要用 cssText 来获取
                    else if (name === 'style') {
                        ret = el.style.cssText;
                    }
                }

                // 对于不存在的属性，统一返回 undefined
                return ret === null ? undefined : ret;
            }

            // setter
            S.each(S.query(selector), function(el) {
                // only set attributes on element nodes
                if (!isElementNode(el)) {
                    return;
                }

                if (oldIE && name === 'style') {
                    el.style.cssText = val;
                }
                else {
                    // convert the value to a string (all browsers do this but IE)
                    el.setAttribute(name, '' + val);
                }
            });
        },

        /**
         * Removes the attribute of the matched elements.
         */
        removeAttr: function(selector, name) {
            S.each(S.query(selector), function(el) {
                if (isElementNode(el)) {
                    el.removeAttribute(name);
                }
            });
        },

        /**
         * Gets the current value of the first element in the set of matched or
         * Sets the value of each element in the set of matched elements.
         */
        val: function(selector, value) {
            // getter
            if (value === undefined) {
                // supports css selector/Node/NodeList
                var el = S.get(selector);

                // only gets value on element nodes
                if (!isElementNode(el)) {
                    return undefined;
                }

                // 当没有设定 value 时，标准浏览器 option.value === option.text
                // ie7- 下，没有设定 value 时，option.value === '', 需要用 el.attributes.value 来判断是否有设定 value
                if (nodeNameIs('option', el)) {
                    return (el.attributes.value || {}).specified ? el.value : el.text;
                }

                // 对于 select, 特别是 multiple type, 存在很严重的兼容性问题
                if (nodeNameIs('select', el)) {
                    var index = el.selectedIndex,
                        options = el.options;

                    if (index < 0) {
                        return null;
                    }
                    else if (el.type === 'select-one') {
                        return DOM.val(options[index]);
                    }

                    // Loop through all the selected options
                    var ret = [], i = 0, len = options.length;
                    for (; i < len; ++i) {
                        if (options[i].selected) {
                            ret.push(DOM.val(options[i]));
                        }
                    }
                    // Multi-Selects return an array
                    return ret;
                }

                // Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
                if (UA.webkit && RE_RADIO_CHECK.test(el.type)) {
                    return el.getAttribute('value') === null ? 'on' : el.value;
                }

                // 普通元素的 value, 归一化掉 \r
                return (el.value || '').replace(RE_RETURN, '');
            }

            // setter
            S.each(S.query(selector), function(el) {
                if (nodeNameIs('select', el)) {
                    // 强制转换数值为字符串，以保证下面的 inArray 正常工作
                    if (S.isNumber(value)) {
                        value += '';
                    }

                    var vals = S.makeArray(value),
                        opts = el.options, opt;

                    for (i = 0,len = opts.length; i < len; ++i) {
                        opt = opts[i];
                        opt.selected = S.inArray(DOM.val(opt), vals);
                    }

                    if (!vals.length) {
                        el.selectedIndex = -1;
                    }
                }
                else if (isElementNode(el)) {
                    el.value = value;
                }
            });
        },

        /**
         * Gets the text context of the first element in the set of matched elements or
         * Sets the text content of the matched elements.
         */
        text: function(selector, val) {
            // getter
            if (val === undefined) {
                // supports css selector/Node/NodeList
                var el = S.get(selector);

                // only gets value on supported nodes
                if (isElementNode(el)) {
                    return el[TEXT] || '';
                }
                else if (isTextNode(el)) {
                    return el.nodeValue;
                }
            }
            // setter
            else {
                S.each(S.query(selector), function(el) {
                    if (isElementNode(el)) {
                        el[TEXT] = val;
                    }
                    else if (isTextNode(el)) {
                        el.nodeValue = val;
                    }
                });
            }
        }
    });

    // 判断 el 的 nodeName 是否指定值
    function nodeNameIs(val, el) {
        return el && el.nodeName.toUpperCase() === val.toUpperCase();
    }
});

/**
 * NOTES:
 *
 * 2010.03
 *  - 在 jquery/support.js 中，special attrs 里还有 maxlength, cellspacing,
 *    rowspan, colspan, useap, frameboder, 但测试发现，在 Grade-A 级浏览器中
 *    并无兼容性问题。
 *  - 当 colspan/rowspan 属性值设置有误时，ie7- 会自动纠正，和 href 一样，需要传递
 *    第 2 个参数来解决。jQuery 未考虑，存在兼容性 bug.
 *  - jQuery 考虑了未显式设定 tabindex 时引发的兼容问题，kissy 里忽略（太不常用了）
 *  - jquery/attributes.js: Safari mis-reports the default selected
 *    property of an option 在 Safari 4 中已修复。
 *
 */
/**
 * @module  dom
 * @author  lifesinger@gmail.com
 */
KISSY.add('dom-style', function(S, undefined) {

    var DOM = S.DOM, UA = S.UA,
        doc = document, docElem = doc.documentElement,
        STYLE = 'style', FLOAT = 'float',
        CSS_FLOAT = 'cssFloat', STYLE_FLOAT = 'styleFloat',
        WIDTH = 'width', HEIGHT = 'height',
        AUTO = 'auto',
        PARSEINT = parseInt,
        RE_LT = /^left|top$/,
        RE_NEED_UNIT = /width|height|top|left|right|bottom|margin|padding/i,
        RE_DASH = /-([a-z])/ig,
        CAMELCASE_FN = function(all, letter) {
            return letter.toUpperCase();
        },
        EMPTY = '',
        DEFAULT_UNIT = 'px',
        CUSTOM_STYLES = { };

    S.mix(DOM, {

        _CUSTOM_STYLES: CUSTOM_STYLES,

        _getComputedStyle: function(elem, name) {
            var val = '', d = elem.ownerDocument;

            if (elem[STYLE]) {
                val = d.defaultView.getComputedStyle(elem, null)[name];
            }
            return val;
        },

        /**
         * Gets or sets styles on the matches elements.
         */
        css: function(selector, name, val) {
            // suports hash
            if (S.isPlainObject(name)) {
                for (var k in name) {
                    DOM.css(selector, k, name[k]);
                }
                return;
            }
            
            if(name.indexOf('-') > 0) {
                // webkit 认识 camel-case, 其它内核只认识 cameCase
                name = name.replace(RE_DASH, CAMELCASE_FN);
            }
            name = CUSTOM_STYLES[name] || name;

            // getter
            if (val === undefined) {
                // supports css selector/Node/NodeList
                var elem = S.get(selector), ret = '';

                if (elem && elem.style) {
                    ret = name.get ? name.get(elem) : elem.style[name];

                    // 有 get 的直接用自定义函数的返回值
                    if(ret === '' && !name.get) {
                        ret = fixComputedStyle(elem, name, DOM._getComputedStyle(elem, name));
                    }
                }

                return ret === undefined ? '' : ret;
            }
            // setter
            else {
                // normalize unsetting
                if (val === null || val === EMPTY) {
                    val = EMPTY;
                }
                // number values may need a unit
                else if (!isNaN(new Number(val)) && RE_NEED_UNIT.test(name)) {
                    val += DEFAULT_UNIT;
                }

                // ignore negative width and height values
                if ((name === WIDTH || name === HEIGHT) && parseFloat(val) < 0) {
                    return;
                }

                S.each(S.query(selector), function(elem) {
                    if (elem && elem.style) {
                        name.set ? name.set(elem, val) : (elem.style[name] = val);
                    }
                });
            }
        },

        /**
         * Get the current computed width for the first element in the set of matched elements or
         * set the CSS width of each element in the set of matched elements.
         */
        width: function(selector, value) {
            // getter
            if(value === undefined) {
                return getWH(selector, WIDTH);
            }
            // setter
            else {
                DOM.css(selector, WIDTH, value);
            }
        },

        /**
         * Get the current computed height for the first element in the set of matched elements or
         * set the CSS height of each element in the set of matched elements.
         */
        height: function(selector, value) {
            // getter
            if (value === undefined) {
                return getWH(selector, HEIGHT);
            }
            // setter
            else {
                DOM.css(selector, HEIGHT, value);
            }
        },

        /**
         * Creates a stylesheet from a text blob of rules.
         * These rules will be wrapped in a STYLE tag and appended to the HEAD of the document.
         * @param {String} cssText The text containing the css rules
         * @param {String} id An id to add to the stylesheet for later removal
         */
        addStyleSheet: function(cssText, id) {
            var elem;

            // 有的话，直接获取
            if (id) elem = S.get(id);
            if (!elem) elem = DOM.create('<style>', { id: id });

            // 先添加到 DOM 树中，再给 cssText 赋值，否则 css hack 会失效
            S.get('head').appendChild(elem);

            if (elem.styleSheet) { // IE
                elem.styleSheet.cssText = cssText;
            } else { // W3C
                elem.appendChild(doc.createTextNode(cssText));
            }
        }
    });

    // normalize reserved word float alternatives ("cssFloat" or "styleFloat")
    if (docElem[STYLE][CSS_FLOAT] !== undefined) {
        CUSTOM_STYLES[FLOAT] = CSS_FLOAT;
    }
    else if(docElem[STYLE][STYLE_FLOAT] !== undefined) {
        CUSTOM_STYLES[FLOAT] = STYLE_FLOAT;
    }

    function getWH(selector, name) {
        var elem = S.get(selector),
            which = name === WIDTH ? ['Left', 'Right'] : ['Top', 'Bottom'],
            val = name === WIDTH ? elem.offsetWidth : elem.offsetHeight;

        S.each(which, function(direction) {
            val -= parseFloat(DOM._getComputedStyle(elem, 'padding' + direction)) || 0;
            val -= parseFloat(DOM._getComputedStyle(elem, 'border' + direction + 'Width')) || 0;
        });

        return val;
    }

    // 修正 getComputedStyle 返回值的部分浏览器兼容性问题
    function fixComputedStyle(elem, name, val) {
        var offset, ret = val;

        // 1. 当没有设置 style.left 时，getComputedStyle 在不同浏览器下，返回值不同
        //    比如：firefox 返回 0, webkit/ie 返回 auto
        // 2. style.left 设置为百分比时，返回值为百分比
        // 对于第一种情况，如果是 relative 元素，值为 0. 如果是 absolute 元素，值为 offsetLeft - marginLeft
        // 对于第二种情况，大部分类库都未做处理，属于“明之而不 fix”的保留 bug
        if (val === AUTO && RE_LT.test(name)) {
            ret = 0;

            if (DOM.css(elem, 'position') === 'absolute') {
                offset = elem[name === 'left' ? 'offsetLeft' : 'offsetTop'];

                // ie8 下，elem.offsetLeft 包含 offsetParent 的 border 宽度，需要减掉
                // TODO: 改成特性探测
                if (UA.ie === 8 || UA.opera) {
                    offset -= PARSEINT(DOM.css(elem.offsetParent, 'border-' + name + '-width')) || 0;
                }

                ret = offset - (PARSEINT(DOM.css(elem, 'margin-' + name)) || 0);
            }
        }

        return ret;
    }

});

/**
 * NOTES:
 *  - Opera 下，color 默认返回 #XXYYZZ, 非 rgb(). 目前 jQuery 等类库均忽略此差异，KISSY 也忽略。
 *  - Safari 低版本，transparent 会返回为 rgba(0, 0, 0, 0), 考虑低版本才有此 bug, 亦忽略。
 *
 *  - 非 webkit 下，jQuery.css paddingLeft 返回 style 值， padding-left 返回 computedStyle 值，
 *    返回的值不同。KISSY 做了统一，更符合预期。
 *
 *  - getComputedStyle 在 webkit 下，会舍弃小数部分，ie 下会四舍五入，gecko 下直接输出 float 值。
 *
 *  - color: blue 继承值，getComputedStyle, 在 ie 下返回 blue, opera 返回 #0000ff, 其它浏览器
 *    返回 rgb(0, 0, 255)
 *
 *  - border-width 值，ie 下有可能返回 medium/thin/thick 等值，其它浏览器返回 px 值。
 *
 *  - 总之：要使得返回值完全一致是不大可能的，jQuery/ExtJS/KISSY 未“追求完美”。YUI3 做了部分完美处理，但
 *    依旧存在浏览器差异。
 */
/**
 * @module  dom
 * @author  lifesinger@gmail.com
 */
KISSY.add('dom-style-ie', function(S, undefined) {

    // only for ie
    if (!S.UA.ie) return;

    var DOM = S.DOM,
        doc = document,
        docElem = doc.documentElement,
        OPACITY = 'opacity',
        FILTER = 'filter',
        FILTERS = 'filters',
        CURRENT_STYLE = 'currentStyle',
        RUNTIME_STYLE = 'runtimeStyle',
        LEFT = 'left',
        PX = 'px',
        CUSTOM_STYLES = DOM._CUSTOM_STYLES,
        RE_NUMPX = /^-?\d+(?:px)?$/i,
	    RE_NUM = /^-?\d/,
        RE_WH = /^width|height$/;

    // use alpha filter for IE opacity
    try {
        if (docElem.style[OPACITY] === undefined && docElem[FILTERS]) {

            CUSTOM_STYLES[OPACITY] = {

                get: function(elem) {
                    var val = 100;

                    try { // will error if no DXImageTransform
                        val = elem[FILTERS]['DXImageTransform.Microsoft.Alpha'][OPACITY];
                    }
                    catch(e) {
                        try {
                            val = elem[FILTERS]('alpha')[OPACITY];
                        } catch(ex) {
                            // 没有设置过 opacity 时会报错，这时返回 1 即可
                        }
                    }

                    // 和其他浏览器保持一致，转换为字符串类型
                    return val / 100 + '';
                },

                set: function(elem, val) {
                    var style = elem.style;

                    // IE has trouble with opacity if it does not have layout
                    // Force it by setting the zoom level
                    style.zoom = 1;

                    // Set the alpha filter to set the opacity
                    style[FILTER] = 'alpha(' + OPACITY + '=' + val * 100 + ')';
                }
            };
        }
    }
    catch(ex) {
        S.log('IE filters ActiveX is disabled. ex = ' + ex);
    }

    // getComputedStyle for IE
    if (!(doc.defaultView || { }).getComputedStyle && docElem[CURRENT_STYLE]) {

        DOM._getComputedStyle = function(elem, name) {
            var style = elem.style,
                ret = elem[CURRENT_STYLE][name];

            // 当 width/height 设置为百分比时，通过 pixelLeft 方式转换的 width/height 值
            // 在 ie 下不对，需要直接用 offset 方式
            // borderWidth 等值也有问题，但考虑到 borderWidth 设为百分比的概率很小，这里就不考虑了
            if(RE_WH.test(name)) {
                ret = DOM[name](elem) + PX;
            }
            // From the awesome hack by Dean Edwards
            // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291
            // If we're not dealing with a regular pixel number
            // but a number that has a weird ending, we need to convert it to pixels
            else if ((!RE_NUMPX.test(ret) && RE_NUM.test(ret))) {
                // Remember the original values
				var left = style[LEFT], rsLeft = elem[RUNTIME_STYLE][LEFT];

				// Put in the new values to get a computed value out
				elem[RUNTIME_STYLE][LEFT] = elem[CURRENT_STYLE][LEFT];
				style[LEFT] = name === 'fontSize' ? '1em' : (ret || 0);
				ret = style['pixelLeft'] + PX;

				// Revert the changed values
				style[LEFT] = left;
				elem[RUNTIME_STYLE][LEFT] = rsLeft;
            }

            return ret;
        }
    }
});
/**
 * @module  dom-offset
 * @author  lifesinger@gmail.com
 */
KISSY.add('dom-offset', function(S, undefined) {

    var DOM = S.DOM,
        win = window, doc = document,
        isElementNode = DOM._isElementNode,
        isStrict = doc.compatMode === 'CSS1Compat',
        MAX = Math.max, PARSEINT = parseInt,
        POSITION = 'position', RELATIVE = 'relative',
        DOCUMENT = 'document', BODY = 'body',
        DOC_ELEMENT = 'documentElement',
        OWNER_DOCUMENT = 'ownerDocument',
        VIEWPORT = 'viewport',
        SCROLL = 'scroll', CLIENT = 'client',
        LEFT = 'left', TOP = 'top',
        SCROLL_LEFT = SCROLL + 'Left', SCROLL_TOP = SCROLL + 'Top',
        GET_BOUNDING_CLIENT_RECT = 'getBoundingClientRect';

    S.mix(DOM, {

        /**
         * Gets the current coordinates of the element, relative to the document.
         */
        offset: function(elem, val) {
            // ownerDocument 的判断可以保证 elem 没有游离在 document 之外（比如 fragment）
            if (!(elem = S.get(elem)) || !elem[OWNER_DOCUMENT]) return null;

            // getter
            if (val === undefined) {
                return getOffset(elem);
            }

            // setter
            setOffset(elem, val);
        },

        /**
         * Makes elem visible in the container
         * @refer http://www.w3.org/TR/2009/WD-html5-20090423/editing.html#scrollIntoView
         *        http://www.sencha.com/deploy/dev/docs/source/Element.scroll-more.html#scrollIntoView
         *        http://yiminghe.javaeye.com/blog/390732
         */
        scrollIntoView: function(elem, container, top, hscroll) {
            if (!(elem = S.get(elem)) || !elem[OWNER_DOCUMENT]) return;

            container = S.get(container);
            hscroll = hscroll === undefined ? true : !!hscroll;
            top = top === undefined ? true : !!top;

            // use native for scrollIntoView(elem, top)
            if (!isElementNode(container)) {
                // 注意：
                // 1. Opera 不支持 top 参数
                // 2. 当 container 已经在视窗中时，也会重新定位
                return elem.scrollIntoView(top);
            }

            var elemOffset = DOM.offset(elem),
                containerOffset = DOM.offset(container),

                // elem 相对 container 视窗的坐标
                diff = {
                    left: elemOffset[LEFT] - containerOffset[LEFT],
                    top: elemOffset[TOP] - containerOffset[TOP]
                },

                // container 视窗的高宽
                ch = container.clientHeight,
                cw = container.clientWidth,

                // container 视窗相对 container 元素的坐标
                cl = DOM[SCROLL_LEFT](container),
                ct = DOM[SCROLL_TOP](container),
                cr = cl + cw,
                cb = ct + ch,

                // elem 的高宽
                eh = elem.offsetHeight,
                ew = elem.offsetWidth,

                // elem 相对 container 元素的坐标
                // 注：diff.left 含 border, cl 也含 border, 因此要减去一个
                l = diff.left + cl - (PARSEINT(DOM.css(container, 'borderLeftWidth')) || 0),
                t = diff.top + ct - (PARSEINT(DOM.css(container, 'borderTopWidth')) || 0),
                r = l + ew,
                b = t + eh;

            // 根据情况将 elem 定位到 container 视窗中
            // 1. 当 eh > ch 时，优先显示 elem 的顶部，对用户来说，这样更合理
            // 2. 当 t < ct 时，elem 在 container 视窗上方，优先顶部对齐
            // 3. 当 b > cb 时，elem 在 container 视窗下方，优先底部对齐
            // 4. 其它情况下，elem 已经在 container 视窗中，无需任何操作
            if(eh > ch || t < ct || top) {
                container[SCROLL_TOP] = t;
            }
            else if(b > cb) {
                container[SCROLL_TOP] = b - ch;
            }

            // 水平方向与上面同理
            if (hscroll) {
                if (ew > cw || l < cl || top) {
                    container[SCROLL_LEFT] = l;
                } else if (r > cr) {
                    container[SCROLL_LEFT] = r - cw;
                }
            }
        }
    });

    // add ScrollLeft/ScrollTop getter methods
    S.each(['Left', 'Top'], function(name, i) {
        var method = SCROLL + name;

        DOM[method] = function(elem) {
            var ret = 0,
                w = elem === undefined ? win : getWin(elem),
                d;

			if(w && (d = w[DOCUMENT])) {
                ret = w[i ? 'pageYOffset' : 'pageXOffset']
                    || d[DOC_ELEMENT][method]
                    || d[BODY][method]
            }
            else if(isElementNode((elem = S.get(elem)))) {
                ret = elem[method];
            }
            return ret;
        }
    });

    // add docWidth/Height, viewportWidth/Height getter methods
    S.each(['Width', 'Height'], function(name) {
        DOM['doc' + name] = function(refDoc) {
            var d = refDoc || doc;
            return MAX(isStrict ? d[DOC_ELEMENT][SCROLL + name] : d[BODY][SCROLL + name],
                DOM[VIEWPORT + name](d));
        };

        DOM[VIEWPORT + name] = function(refWin) {
            var prop = 'inner' + name,
                w = getWin(refWin) || win,
                d = w[DOCUMENT];
            return (prop in w) ? w[prop] :
                (isStrict ? d[DOC_ELEMENT][CLIENT + name] : d[BODY][CLIENT + name]);
        }
    });

    // 获取 elem 相对 elem.ownerDocument 的坐标
    function getOffset(elem) {
        var box, x = 0, y = 0,
            w = getWin(elem[OWNER_DOCUMENT]);

        // 根据 GBS 最新数据，A-Grade Browsers 都已支持 getBoundingClientRect 方法，不用再考虑传统的实现方式
        if (elem[GET_BOUNDING_CLIENT_RECT]) {
            box = elem[GET_BOUNDING_CLIENT_RECT]();

            // 注：jQuery 还考虑减去 docElem.clientLeft/clientTop
            // 但测试发现，这样反而会导致当 html 和 body 有边距/边框样式时，获取的值不正确
            // 此外，ie6 会忽略 html 的 margin 值，幸运地是没有谁会去设置 html 的 margin

            x = box[LEFT] + DOM[SCROLL_LEFT](w);
            y = box[TOP] + DOM[SCROLL_TOP](w);
        }

        return { left: x, top: y };
    }

    // 设置 elem 相对 elem.ownerDocument 的坐标
    function setOffset(elem, offset) {
        // set position first, in-case top/left are set even on static elem
        if (DOM.css(elem, POSITION) === 'static') {
            elem.style[POSITION] = RELATIVE;
        }
        var old = getOffset(elem), ret = { }, current, key;

        for(key in offset) {
            current = PARSEINT(DOM.css(elem, key), 10) || 0;
            ret[key] = current + offset[key] - old[key];
        }
        DOM.css(elem, ret);
    }

    // elem 为 window 时，直接返回
    // elem 为 document 时，返回关联的 window
    // 其它值，返回 false
    function getWin(elem) {
        return (elem && ('scrollTo' in elem) && elem[DOCUMENT]) ?
            elem :
            elem && elem.nodeType === 9 ?
                elem.defaultView || elem.parentWindow :
                false;
    }

});

/**
 * TODO:
 *  - 考虑是否实现 jQuery 的 position, offsetParent 等功能
 *  - 更详细的测试用例（比如：测试 position 为 fixed 的情况）
 */
/**
 * @module  dom-traversal
 * @author  lifesinger@gmail.com
 */
KISSY.add('dom-traversal', function(S, undefined) {

    var DOM = S.DOM,
        isElementNode = DOM._isElementNode;

    S.mix(DOM, {

        /**
         * Gets the parent node of the first matched element.
         */
        parent: function(selector, filter) {
            return nth(selector, filter, 'parentNode', function(elem) {
                return elem.nodeType != 11;
            });
        },

        /**
         * Gets the following sibling of the first matched element.
         */
        next: function(selector, filter) {
            return nth(selector, filter, 'nextSibling');
        },

        /**
         * Gets the preceding sibling of the first matched element.
         */
        prev: function(selector, filter) {
            return nth(selector, filter, 'previousSibling');
        },

        /**
         * Gets the siblings of the first matched element.
         */
        siblings: function(selector, filter) {
            return getSiblings(selector, filter, true);
        },

        /**
         * Gets the children of the first matched element.
         */
        children: function(selector, filter) {
            return getSiblings(selector, filter);
        },

        /**
         * Check to see if a DOM node is within another DOM node.
         */
        contains: function(container, contained) {
            var ret = false;

            if ((container = S.get(container)) && (contained = S.get(contained))) {
                if (container.contains) {
                    return container.contains(contained);
                }
                else if (container.compareDocumentPosition) {
                    return !!(container.compareDocumentPosition(contained) & 16);
                }
                else {
                    while (!ret && (contained = contained.parentNode)) {
                        ret = contained == container;
                    }
                }
            }
            
            return ret;
        }
    });

    // 获取元素 elem 在 direction 方向上满足 filter 的第一个元素
    // filter 可为 number, selector, fn
    // direction 可为 parentNode, nextSibling, previousSibling
    function nth(elem, filter, direction, extraFilter) {
        if (!(elem = S.get(elem))) return null;
        if(filter === undefined) filter = 1; // 默认取 1
        var ret = null, fi, flen;

        if(S.isNumber(filter) && filter >= 0) {
            if(filter === 0) return elem;
            fi = 0;
            flen = filter;
            filter = function() {
                return ++fi === flen;
            };
        }

        while((elem = elem[direction])) {
            if (isElementNode(elem) && (!filter || DOM.test(elem, filter)) && (!extraFilter || extraFilter(elem))) {
                ret = elem;
                break;
            }
        }

        return ret;
    }

    // 获取元素 elem 的 siblings, 不包括自身
    function getSiblings(selector, filter, parent) {
        var ret = [], elem = S.get(selector), j, parentNode = elem, next;
        if (elem && parent) parentNode = elem.parentNode;

        if (parentNode) {
            for (j = 0, next = parentNode.firstChild; next; next = next.nextSibling) {
                if (isElementNode(next) && next !== elem && (!filter || DOM.test(next, filter))) {
                    ret[j++] = next;
                }
            }
        }

        return ret;
    }

});

/**
 * NOTES:
 *
 *  - api 的设计上，没有跟随 jQuery. 一是为了和其他 api 一致，保持 first-all 原则。二是
 *    遵循 8/2 原则，用尽可能少的代码满足用户最常用的功能。
 *
 */
/**
 * @module  dom-create
 * @author  lifesinger@gmail.com
 */
KISSY.add('dom-create', function(S, undefined) {

    var doc = document,
        DOM = S.DOM, UA = S.UA, ie = UA.ie,
        isSupportedNode = DOM._isSupportedNode,
        isElementNode = DOM._isElementNode,
        DIV = 'div',
        PARENT_NODE = 'parentNode',
        DEFAULT_DIV = doc.createElement(DIV),
        RE_TAG = /<(\w+)/,
        RE_SIMPLE_TAG = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,
        RE_SCRIPT = /<script([^>]*)>([\s\S]*?)<\/script>/ig,
        RE_SCRIPT_SRC = /\ssrc=(['"])(.*?)\1/i,
        RE_SCRIPT_CHARSET = /\scharset=(['"])(.*?)\1/i;

    S.mix(DOM, {

        /**
         * Creates a new HTMLElement using the provided html string.
         */
        create: function(html, props, ownerDoc) {
            if (isSupportedNode(html)) return html;
            if (!(html = S.trim(html))) return null;

            var ret = null, creators = DOM._creators,
                m, tag = DIV, k, nodes;

            // 简单 tag, 比如 DOM.create('<p>')
            if ((m = RE_SIMPLE_TAG.exec(html))) {
                ret = (ownerDoc || doc).createElement(m[1]);
            }
            // 复杂情况，比如 DOM.create('<img src="sprite.png" />')
            else {
                if ((m = RE_TAG.exec(html)) && (k = m[1]) && S.isFunction(creators[(k = k.toLowerCase())])) {
                    tag = k;
                }

                nodes = creators[tag](html, ownerDoc).childNodes;

                if (nodes.length === 1) {
                    // return single node, breaking parentNode ref from "fragment"
                    ret = nodes[0][PARENT_NODE].removeChild(nodes[0]);
                }
                else {
                    // return multiple nodes as a fragment
                    ret = nl2frag(nodes, ownerDoc || doc);
                }
            }

            return attachProps(ret, props);
        },

        _creators: {
            div: function(html, ownerDoc) {
                var frag = ownerDoc ? ownerDoc.createElement(DIV) : DEFAULT_DIV;
                frag.innerHTML = html;
                return frag;
            }
        },

        /**
         * Gets/Sets the HTML contents of the HTMLElement.
         * @param {Boolean} loadScripts (optional) True to look for and process scripts (defaults to false).
         * @param {Function} callback (optional) For async script loading you can be notified when the update completes.
         */
        html: function(selector, val, loadScripts, callback) {
            // getter
            if (val === undefined) {
                // supports css selector/Node/NodeList
                var el = S.get(selector);

                // only gets value on element nodes
                if (isElementNode(el)) {
                    return el.innerHTML;
                }
            }
            // setter
            else {
                S.each(S.query(selector), function(elem) {
                    if (isElementNode(elem)) {
                        setHTML(elem, val, loadScripts, callback);
                    }
                });
            }
        },

        /**
         * Remove the set of matched elements from the DOM.
         */
        remove: function(selector) {
            S.each(S.query(selector), function(el) {
                if (isElementNode(el) && el.parentNode) {
                    el.parentNode.removeChild(el);
                }
            });
        }
    });

    // 添加成员到元素中
    function attachProps(elem, props) {
        if (isElementNode(elem) && props) {
            for (var p in props) {
                DOM.attr(elem, p, props[p]);
            }
        }
        return elem;
    }

    // 将 nodeList 转换为 fragment
    function nl2frag(nodes, ownerDoc) {
        var ret = null, i, len;

        if (nodes && (nodes.push || nodes.item) && nodes[0]) {
            ownerDoc = ownerDoc || nodes[0].ownerDocument;
            ret = ownerDoc.createDocumentFragment();

            if (nodes.item) { // convert live list to static array
                nodes = S.makeArray(nodes);
            }

            for (i = 0,len = nodes.length; i < len; i++) {
                ret.appendChild(nodes[i]);
            }
        }
        else {
            S.log('Unable to convert ' + nodes + ' to fragment.');
        }

        return ret;
    }

    /**
     * Update the innerHTML of this element, optionally searching for and processing scripts.
     * @refer http://www.sencha.com/deploy/dev/docs/source/Element-more.html#method-Ext.Element-update
     *        http://lifesinger.googlecode.com/svn/trunk/lab/2010/innerhtml-and-script-tags.html
     */
    function setHTML(elem, html, loadScripts, callback) {
        if (!loadScripts) {
            setHTMLSimple(elem, html);
            S.isFunction(callback) && callback();
            return;
        }

        var id = S.guid('ks-tmp-');
        html += '<span id="' + id + '"></span>';

        // 确保脚本执行时，相关联的 DOM 元素已经准备好
        S.available(id, function() {
            var hd = S.get('head'),
                match, attrs, srcMatch, charsetMatch,
                t, s, text;

            RE_SCRIPT.lastIndex = 0;
            while ((match = RE_SCRIPT.exec(html))) {
                attrs = match[1];
                srcMatch = attrs ? attrs.match(RE_SCRIPT_SRC) : false;

                // script via src
                if (srcMatch && srcMatch[2]) {
                    s = doc.createElement('script');
                    s.src = srcMatch[2];
                    // set charset
                    if ((charsetMatch = attrs.match(RE_SCRIPT_CHARSET)) && charsetMatch[2]) {
                        s.charset = charsetMatch[2];
                    }
                    s.async = true; // make sure async in gecko
                    hd.appendChild(s);
                }
                // inline script
                else if ((text = match[2]) && text.length > 0) {
                    S.globalEval(text);

                }
            }

            // 删除探测节点
            (t = doc.getElementById(id)) && DOM.remove(t);

            // 回调
            S.isFunction(callback) && callback();
        });

        setHTMLSimple(elem, html);
    }

    // 直接通过 innerHTML 设置 html
    function setHTMLSimple(elem, html) {
        html = html.replace(RE_SCRIPT, ''); // 过滤掉所有 script
        try {
            elem.innerHTML = html;
        } catch(ex) { // table.innerHTML = html will throw error in ie.
            // remove any remaining nodes
            while (elem.firstChild) {
                elem.removeChild(elem.firstChild);
            }
            // html == '' 时，无需再 appendChild
            if (html) elem.appendChild(DOM.create(html));
        }
    }

    // only for gecko and ie
    if (UA.gecko || ie) {
        // 定义 creators, 处理浏览器兼容
        var creators = DOM._creators,
            create = DOM.create,
            TABLE_OPEN = '<table>',
            TABLE_CLOSE = '</table>',
            RE_TBODY = /(?:\/(?:thead|tfoot|caption|col|colgroup)>)+\s*<tbody/,
            creatorsMap = {
                option: 'select',
                td: 'tr',
                tr: 'tbody',
                tbody: 'table',
                col: 'colgroup',
                legend: 'fieldset' // ie 支持，但 gecko 不支持
            };

        for (var p in creatorsMap) {
            (function(tag) {
                creators[p] = function(html, ownerDoc) {
                    return create('<' + tag + '>' + html + '</' + tag + '>', null, ownerDoc);
                }
            })(creatorsMap[p]);
        }

        if (ie) {
            // IE 下不能单独添加 script 元素
            creators.script = function(html, ownerDoc) {
                var frag = ownerDoc ? ownerDoc.createElement(DIV) : DEFAULT_DIV;
                frag.innerHTML = '-' + html;
                frag.removeChild(frag.firstChild);
                return frag;
            };

            // IE7- adds TBODY when creating thead/tfoot/caption/col/colgroup elements
            if (ie < 8) {
                creators.tbody = function(html, ownerDoc) {
                    var frag = create(TABLE_OPEN + html + TABLE_CLOSE, null, ownerDoc),
                        tbody = frag.children['tags']('tbody')[0];

                    if (frag.children.length > 1 && tbody && !RE_TBODY.test(html)) {
                        tbody[PARENT_NODE].removeChild(tbody); // strip extraneous tbody
                    }
                    return frag;
                };
            }
        }

        S.mix(creators, {
            optgroup: creators.option, // gecko 支持，但 ie 不支持
            th: creators.td,
            thead: creators.tbody,
            tfoot: creators.tbody,
            caption: creators.tbody,
            colgroup: creators.tbody
        });
    }
});

/**
 * TODO:
 *  - 研究 jQuery 的 buildFragment 和 clean
 *  - 增加 cache, 完善 test cases
 *  - 支持更多 props
 *  - remove 时，是否需要移除事件，以避免内存泄漏？需要详细的测试。
 */
/**
 * @module  dom-insertion
 * @author  lifesinger@gmail.com
 */
KISSY.add('dom-insertion', function(S) {

    var DOM = S.DOM,
        PARENT_NODE = 'parentNode',
        NEXT_SIBLING = 'nextSibling';

    S.mix(DOM, {

        /**
         * Inserts the new node as the previous sibling of the reference node.
         * @return {HTMLElement} The node that was inserted (or null if insert fails)
         */
        insertBefore: function(newNode, refNode) {
            newNode = DOM.create(newNode);
            refNode = S.get(refNode);

            if (newNode && refNode && refNode[PARENT_NODE]) {
                refNode[PARENT_NODE].insertBefore(newNode, refNode);
            }

            return newNode;
        },

        /**
         * Inserts the new node as the next sibling of the reference node.
         * @return {HTMLElement} The node that was inserted (or null if insert fails)
         */
        insertAfter: function(newNode, refNode) {
            newNode = DOM.create(newNode);
            refNode = S.get(refNode);

            if (newNode && refNode && refNode[PARENT_NODE]) {
                if (refNode[NEXT_SIBLING]) {
                    refNode[PARENT_NODE].insertBefore(newNode, refNode[NEXT_SIBLING]);
                } else {
                    refNode[PARENT_NODE].appendChild(newNode);
                }
            }

            return newNode;
        }
    });

});

/**
 * NOTES:
 *  - appendChild/removeChild/replaceChild 直接用原生的
 *  - append/appendTo, prepend/prependTo, wrap/unwrap 放在 Node 里
 *
 */
/*
Copyright 2010, KISSY UI Library v1.0.8
MIT Licensed
build: 888 Jul 20 19:33
*/
/**
 * @module  event
 * @author  lifesinger@gmail.com
 */
KISSY.add('event', function(S, undefined) {

    var win = window, doc = document,
        simpleAdd = doc.addEventListener ?
            function(el, type, fn, capture) {
                if (el.addEventListener) {
                    //boolean capture is better
                    el.addEventListener(type, fn, !!capture);
                }
            } :
            function(el, type, fn) {
                if (el.attachEvent) {
                    el.attachEvent('on' + type, fn);
                }
            },
        simpleRemove = doc.removeEventListener ?
            function(el, type, fn, capture) {
                if (el.removeEventListener) {
                    el.removeEventListener(type, fn, !!capture);
                }
            } :
            function(el, type, fn) {
                if (el.detachEvent) {
                    el.detachEvent('on' + type, fn);
                }
            },
        EVENT_GUID = 'ksEventTargetId',
        SPACE = ' ',
        guid = S.now(),
        // { id: { target: el, events: { type: { handle: obj, listeners: [...] } } }, ... }
        cache = { };

    var Event = {

        EVENT_GUID: EVENT_GUID,

        // such as: { 'mouseenter' : { fix: 'mouseover', handle: fn } }
        special: { },

        /**
         * Adds an event listener.
         * @param target {Element} An element or custom EventTarget to assign the listener to.
         * @param type {String} The type of event to append.
         * @param fn {Function} The event handler.
         * @param scope {Object} (optional) The scope (this reference) in which the handler function is executed.
         */
        add: function(target, type, fn, scope /* optional */) {
            if (batch('add', target, type, fn, scope)) return;

            var id = getID(target),
                special, events, eventHandle;

            // 不是有效的 target 或 参数不对
            if (id === -1 || !type || !S.isFunction(fn)) return;

            // 还没有添加过任何事件
            if (!id) {
                setID(target, (id = guid++));
                cache[id] = {
                    target: target,
                    events: { }
                };
            }

            // 没有添加过该类型事件
            events = cache[id].events;
            special = (!target.isCustomEventTarget && Event.special[type]) || { }; // special 仅针对 element
            if (!events[type]) {
                eventHandle = function(event, eventData) {
                    if (!event || !event.fixed) {
                        event = new S.EventObject(target, event, type);

                        if (S.isPlainObject(eventData)) {
                            S.mix(event, eventData);
                        }
                    }

                    if (special.setup) {
                        special.setup(event);
                    }

                    return (special.handle || Event._handle)(target, event, events[type].listeners, scope);
                };

                events[type] = {
                    handle: eventHandle,
                    listeners: []
                };

                if (!target.isCustomEventTarget) {
                    simpleAdd(target, special.fix || type, eventHandle, special.capture);
                }
                else if (target._addEvent) { // such as Node
                    target._addEvent(type, eventHandle);
                }
            }

            // 增加 listener
            events[type].listeners.push(fn);
        },

        /**
         * Detach an event or set of events from an element.
         */
        remove: function(target, type /* optional */, fn /* optional */) {
            if (batch('remove', target, type, fn)) return;

            var id = getID(target),
                events, eventsType, listeners,
                i, len, c, t;

            if (id === -1) return; // 不是有效的 target
            if (!id || !(c = cache[id])) return; // 无 cache
            if (c.target !== target) return; // target 不匹配
            events = c.events || { };

            if ((eventsType = events[type])) {
                listeners = eventsType.listeners;
                len = listeners.length;

                // 移除 fn
                if (S.isFunction(fn) && len && S.inArray(fn, listeners)) {
                    t = [];
                    for (i = 0; i < len; ++i) {
                        if (fn !== listeners[i]) {
                            t.push(listeners[i]);
                        }
                    }
                    listeners = t;
                    len = t.length;
                }

                // remove(el, type) or fn 已移除光
                if (fn === undefined || len === 0) {
                    if (!target.isCustomEventTarget) {
                        simpleRemove(target, type, eventsType.handle);
                    } else if (target._addEvent) { // such as Node
                        target._removeEvent(type, eventsType.handle);
                    }
                    delete events[type];
                }
            }

            // remove(el) or type 已移除光
            if (type === undefined || S.isEmptyObject(events)) {
                for (type in events) {
                    Event.remove(target, type);
                }
                delete cache[id];
                removeID(target);
            }
        },

        _handle: function(target, event, listeners, scope) {
            /* As some listeners may remove themselves from the
             event, the original array length is dynamic. So,
             let's make a copy of all listeners, so we are
             sure we'll call all of them.*/
            listeners = listeners.slice(0);

            var ret, i = 0, len = listeners.length;
            scope = scope || target;

            for (; i < len; ++i) {
                ret = listeners[i].call(scope, event);

                // 自定义事件对象，可以用 return false 来立刻停止后续监听函数
                // 注意：return false 仅停止当前 target 的后续监听函数，并不会阻止冒泡
                // 目前没有实现自定义事件对象的冒泡，因此 return false 和 stopImmediatePropagation 效果是一样的
                if ((ret === false && target.isCustomEventTarget) ||
                    event.isImmediatePropagationStopped) {
                    break;
                }
            }

            return ret;
        },

        _getCache: function(id) {
            return cache[id];
        },

        _simpleAdd: simpleAdd,
        _simpleRemove: simpleRemove
    };

    // shorthand
    Event.on = Event.add;

    function batch(methodName, targets, types, fn, scope) {
        // on('#id tag.className', type, fn)
        if (S.isString(targets)) {
            targets = S.query(targets);
        }

        // on([targetA, targetB], type, fn)
        if (S.isArray(targets)) {
            S.each(targets, function(target) {
                Event[methodName](target, types, fn, scope);
            });
            return true;
        }

        // on(target, 'click focus', fn)
        if ((types = S.trim(types)) && types.indexOf(SPACE) > 0) {
            S.each(types.split(SPACE), function(type) {
                Event[methodName](targets, type, fn, scope);
            });
            return true;
        }
    }

    function getID(target) {
        return isValidTarget(target) ? target[EVENT_GUID] : -1;
    }

    function setID(target, id) {
        if (!isValidTarget(target)) {
            return S.error('Text or comment node is not valid event target.');
        }

        try {
            target[EVENT_GUID] = id;
        } catch(ex) {
            // iframe 跨域等情况会报错
            S.error(ex);
        }
    }

    function removeID(target) {
        try {
            target[EVENT_GUID] = undefined;
            delete target[EVENT_GUID];
        } catch(ex) {
        }
    }

    function isValidTarget(target) {
        // 3 - is text node
        // 8 - is comment node
        return target && target.nodeType !== 3 && target.nodeType !== 8;
    }

    S.Event = Event;

    // Prevent memory leaks in IE
    // Window isn't included so as not to unbind existing unload events
    // More info: http://isaacschlueter.com/2006/10/msie-memory-leaks/
    if (win.attachEvent && !win.addEventListener) {
        win.attachEvent('onunload', function() {
            var id, target;
            for (id in cache) {
                if ((target = cache[id].target)) {
                    // try/catch is to handle iframes being unloaded
                    try {
                        Event.remove(target);
                    } catch(ex) {
                    }
                }
            }
        });
    }
});

/**
 * TODO:
 *   - event || window.event, 什么情况下取 window.event ? IE4 ?
 *   - 更详尽细致的 test cases
 *   - 内存泄漏测试
 *   - target 为 window, iframe 等特殊对象时的 test case
 *   - special events 的 teardown 方法缺失，需要做特殊处理
 */
/**
 * @module  EventObject
 * @author  lifesinger@gmail.com
 */
KISSY.add('event-object', function(S, undefined) {

    var doc = document,
        props = 'altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which'.split(' ');

    /**
     * KISSY's event system normalizes the event object according to
     * W3C standards. The event object is guaranteed to be passed to
     * the event handler. Most properties from the original event are
     * copied over and normalized to the new event object.
     */
    function EventObject(currentTarget, domEvent, type) {
        var self = this;
        self.currentTarget = currentTarget;
        self.originalEvent = domEvent || { };

        if (domEvent) { // html element
            self.type = domEvent.type;
            self._fix();
        }
        else { // custom
            self.type = type;
            self.target = currentTarget;
        }

        self.fixed = true;
    }

    S.mix(EventObject.prototype, {

        _fix: function() {
            var self = this,
                originalEvent = self.originalEvent,
                l = props.length, prop;

            // clone properties of the original event object
            while (l) {
                prop = props[--l];
                self[prop] = originalEvent[prop];
            }

            // fix target property, if necessary
            if (!self.target) {
                self.target = self.srcElement || doc; // srcElement might not be defined either
            }

        // check if target is a textnode (safari)
            if (self.target.nodeType === 3) {
                self.target = self.target.parentNode;
            }

            // add relatedTarget, if necessary
            if (!self.relatedTarget && self.fromElement) {
                self.relatedTarget = (self.fromElement === self.target) ? self.toElement : self.fromElement;
            }

            // calculate pageX/Y if missing and clientX/Y available
            if (self.pageX === undefined && self.clientX !== undefined) {
                var docEl = doc.documentElement, bd = doc.body;
                self.pageX = self.clientX + (docEl && docEl.scrollLeft || bd && bd.scrollLeft || 0) - (docEl && docEl.clientLeft || bd && bd.clientLeft || 0);
                self.pageY = self.clientY + (docEl && docEl.scrollTop || bd && bd.scrollTop || 0) - (docEl && docEl.clientTop || bd && bd.clientTop || 0);
            }

            // add which for key events
            if (self.which === undefined) {
                self.which = (self.charCode !== undefined) ? self.charCode : self.keyCode;
            }

            // add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
            if (self.metaKey === undefined) {
                self.metaKey = self.ctrlKey;
            }

            // add which for click: 1 === left; 2 === middle; 3 === right
            // Note: button is not normalized, so don't use it
            if (!self.which && self.button !== undefined) {
                self.which = (self.button & 1 ? 1 : (self.button & 2 ? 3 : ( self.button & 4 ? 2 : 0)));
            }
        },

        /**
         * Prevents the event's default behavior
         */
        preventDefault: function() {
            var e = this.originalEvent;

            // if preventDefault exists run it on the original event
            if (e.preventDefault) {
                e.preventDefault();
            }
            // otherwise set the returnValue property of the original event to false (IE)
            else {
                e.returnValue = false;
            }

            this.isDefaultPrevented = true;
        },

        /**
         * Stops the propagation to the next bubble target
         */
        stopPropagation: function() {
            var e = this.originalEvent;

            // if stopPropagation exists run it on the original event
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            // otherwise set the cancelBubble property of the original event to true (IE)
            else {
                e.cancelBubble = true;
            }

            this.isPropagationStopped = true;
        },

        /**
         * Stops the propagation to the next bubble target and
         * prevents any additional listeners from being exectued
         * on the current target.
         */
        stopImmediatePropagation: function() {
            var e = this.originalEvent;

            if (e.stopImmediatePropagation) {
                e.stopImmediatePropagation();
            } else {
                this.stopPropagation();
            }

            this.isImmediatePropagationStopped = true;
        },

        /**
         * Stops the event propagation and prevents the default
         * event behavior.
         * @param immediate {boolean} if true additional listeners
         * on the current target will not be executed
         */
        halt: function(immediate) {
            if (immediate) {
                this.stopImmediatePropagation();
            } else {
                this.stopPropagation();
            }

            this.preventDefault();
        }
    });

    S.EventObject = EventObject;

});

/**
 * NOTES:
 *
 *  2010.04
 *   - http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
 *
 * TODO:
 *   - pageX, clientX, scrollLeft, clientLeft 的详细测试
 */
/**
 * @module  EventTarget
 * @author  lifesinger@gmail.com
 */
KISSY.add('event-target', function(S, undefined) {

    var Event = S.Event,
        EVENT_GUID = Event.EVENT_GUID;

    /**
     * EventTarget provides the implementation for any object to publish,
     * subscribe and fire to custom events.
     */
    S.EventTarget = {

        //ksEventTargetId: undefined,

        isCustomEventTarget: true,

        fire: function(type, eventData) {
            var id = this[EVENT_GUID] || -1,
                cache = Event._getCache(id) || { },
                events = cache.events || { },
                t = events[type];

            if(t && S.isFunction(t.handle)) {
                return t.handle(undefined, eventData);
            }
        },

        on: function(type, fn, scope) {
            Event.add(this, type, fn, scope);
        },

        detach: function(type, fn) {
            Event.remove(this, type, fn);
        }
    };
});

/**
 * NOTES:
 *
 *  2010.04
 *   - 初始设想 api: publish, fire, on, detach. 实际实现时发现，publish 是不需要
 *     的，on 时能自动 publish. api 简化为：触发/订阅/反订阅
 *
 *   - detach 命名是因为 removeEventListener 太长，remove 则太容易冲突
 */
/**
 * @module  event-mouseenter
 * @author  lifesinger@gmail.com
 */
KISSY.add('event-mouseenter', function(S) {

    var Event = S.Event;

    if (!S.UA.ie) {
        S.each([
            { name: 'mouseenter', fix: 'mouseover' },
            { name: 'mouseleave', fix: 'mouseout' }
        ], function(o) {

            Event.special[o.name] = {

                fix: o.fix,

                setup: function(event) {
                    event.type = o.name;
                },

                handle: function(el, event, listeners) {
                    // Check if mouse(over|out) are still within the same parent element
                    var parent = event.relatedTarget;

                    // Firefox sometimes assigns relatedTarget a XUL element
                    // which we cannot access the parentNode property of
                    try {
                        // Traverse up the tree
                        while (parent && parent !== el) {
                            parent = parent.parentNode;
                        }

                        if (parent !== el) {
                            // handle event if we actually just moused on to a non sub-element
                            Event._handle(el, event, listeners);
                        }
                    } catch(e) {
                    }
                }
            }
        });
    }
});

/**
 * TODO:
 *  - ie6 下，原生的 mouseenter/leave 貌似也有 bug, 比如 <div><div /><div /><div /></div>
 *    jQuery 也异常，需要进一步研究
 */
/**
 * @module  event-focusin
 * @author  lifesinger@gmail.com
 */
KISSY.add('event-focusin', function(S) {

    var Event = S.Event;

    // 让非 IE 浏览器支持 focusin/focusout
    if (document.addEventListener) {
        S.each([
            { name: 'focusin', fix: 'focus' },
            { name: 'focusout', fix: 'blur' }
        ], function(o) {

            Event.special[o.name] = {

                fix: o.fix,

                capture: true,

                setup: function(event) {
                    event.type = o.name;
                }
            }
        });
    }
});

/**
 * NOTES:
 *  - webkit 和 opera 已支持 DOMFocusIn/DOMFocusOut 事件，但上面的写法已经能达到预期效果，暂时不考虑原生支持。
 */
/*
Copyright 2010, KISSY UI Library v1.0.8
MIT Licensed
build: 888 Jul 20 19:33
*/
/**
 * @module  node
 * @author  lifesinger@gmail.com
 */
KISSY.add('node', function(S) {

    var DOM = S.DOM;

    /**
     * The Node class provides a wrapper for manipulating DOM Node.
     */
    function Node(html, props, ownerDocument) {
        var self = this, domNode;

        // factory or constructor
        if (!(self instanceof Node)) {
            return new Node(html, props, ownerDocument);
        }

        // handle Node(''), Node(null), or Node(undefined)
        if (!html) {
            return null;
        }

        // handle supported node
        if (DOM._isSupportedNode(html)) {
            domNode = html;
        }
        else if (typeof html === 'string') {
            domNode = DOM.create(html, props, ownerDocument);
        }

        self[0] = domNode;
    }

    S.augment(Node, {

        /**
         * 长度为 1
         */
        length: 1,

        /**
         * Retrieves the DOMNode.
         */
        getDOMNode: function() {
            return this[0];
        }
    });

    // query api
    S.one = function(selector, context) {
        return new Node(S.get(selector, context));
    };

    S.Node = Node;
});
/**
 * @module  nodelist
 * @author  lifesinger@gmail.com
 */
KISSY.add('nodelist', function(S) {

    var DOM = S.DOM,
        AP = Array.prototype;

    /**
     * The NodeList class provides a wrapper for manipulating DOM NodeList.
     */
    function NodeList(domNodes) {
        // factory or constructor
        if (!(this instanceof NodeList)) {
            return new NodeList(domNodes);
        }

        // push nodes
        AP.push.apply(this, domNodes || []);
    }

    S.mix(NodeList.prototype, {

        /**
         * 默认长度为 0
         */
        length: 0,

        /**
         * Retrieves the Node instance at the given index
         */
        item: function(index) {
            var ret = null;
            if(DOM._isElementNode(this[index])) {
                ret = new S.Node(this[index]);
            }
            return ret;
        },

        /**
         * Retrieves the DOMNodes.
         */
        getDOMNodes: function() {
            return AP.slice.call(this);
        },

        /**
         * Applies the given function to each Node in the NodeList.
         * @param fn The function to apply. It receives 3 arguments: the current node instance, the node's index, and the NodeList instance
         * @param context An optional context to apply the function with Default context is the current Node instance
         */
        each: function(fn, context) {
            var len = this.length, i = 0, node;
            for (; i < len; ++i) {
                node = new S.Node(this[i]);
                fn.call(context || node, node, i, this);
            }
            return this;
        }
    });

    // query api
    S.all = function(selector, context) {
        return new NodeList(S.query(selector, context, true));
    };

    S.NodeList = NodeList;
});

/**
 * Notes:
 *
 *  2010.04
 *   - each 方法传给 fn 的 this, 在 jQuery 里指向原生对象，这样可以避免性能问题。
 *     但从用户角度讲，this 的第一直觉是 $(this), kissy 和 yui3 保持一致，牺牲
 *     性能，以易用为首。
 *   - 有了 each 方法，似乎不再需要 import 所有 dom 方法，意义不大。
 *   - dom 是低级 api, node 是中级 api, 这是分层的一个原因。还有一个原因是，如果
 *     直接在 node 里实现 dom 方法，则不大好将 dom 的方法耦合到 nodelist 里。可
 *     以说，技术成本会制约 api 设计。
 */
/**
 * @module  node-attach
 * @author  lifesinger@gmail.com
 */
KISSY.add('node-attach', function(S, undefined) {

    var DOM = S.DOM, Event = S.Event,
        NP = S.Node.prototype,
        NLP = S.NodeList.prototype,
        GET_DOM_NODE = 'getDOMNode',
        GET_DOM_NODES = GET_DOM_NODE + 's',
        HAS_NAME = 1,
        ONLY_VAL = 2,
        ALWAYS_NODE = 4;

    function normalGetterSetter(isNodeList, arguments, valIndex, fn) {
        var elems = this[isNodeList ? GET_DOM_NODES : GET_DOM_NODE](),
            args = [elems].concat(S.makeArray(arguments));

        if (arguments[valIndex] === undefined) {
            return fn.apply(DOM, args);
        } else {
            fn.apply(DOM, args);
            return this;
        }
    }

    function attach(methodNames, type) {
        S.each(methodNames, function(methodName) {
            S.each([NP, NLP], function(P, isNodeList) {

                P[methodName] = (function(fn) {
                    switch (type) {
                        // fn(name, value, /* other arguments */): attr, css etc.
                        case HAS_NAME:
                            return function() {
                                return normalGetterSetter.call(this, isNodeList, arguments, 1, fn);
                            };

                        // fn(value, /* other arguments */): text, html, val etc.
                        case ONLY_VAL:
                            return function() {
                                return normalGetterSetter.call(this, isNodeList, arguments, 0, fn);
                            };

                        // parent, next 等返回 Node/NodeList 的方法
                        case ALWAYS_NODE:
                            return function() {
                                var elems = this[isNodeList ? GET_DOM_NODES : GET_DOM_NODE](),
                                    ret = fn.apply(DOM, [elems].concat(S.makeArray(arguments)));
                                return ret ? new S[ret.length ? 'NodeList' : 'Node'](ret) : null;
                            };

                        default:
                            return function() {
                                // 有非 undefined 返回值时，直接 return 返回值；没返回值时，return this, 以支持链式调用。
                                var elems = this[isNodeList ? GET_DOM_NODES : GET_DOM_NODE](),
                                    ret = fn.apply(DOM, [elems].concat(S.makeArray(arguments)));
                                return ret === undefined ? this : ret;
                            };
                    }
                })(DOM[methodName]);
            });
        });
    }

    // selector
    S.mix(NP, {
        /**
         * Retrieves a node based on the given CSS selector.
         */
        one: function(selector) {
            return S.one(selector, this[0]);
        },

        /**
         * Retrieves a nodeList based on the given CSS selector.
         */
        all: function(selector) {
            return S.all(selector, this[0]);
        }
    });

    // dom-class
    attach(['hasClass', 'addClass', 'removeClass', 'replaceClass', 'toggleClass']);

    // dom-attr
    attach(['attr', 'removeAttr'], HAS_NAME);
    attach(['val', 'text'], ONLY_VAL);

    // dom-style
    attach(['css'], HAS_NAME);
    attach(['width', 'height'], ONLY_VAL);

    // dom-offset
    attach(['offset'], ONLY_VAL);
    attach(['scrollIntoView']);

    // dom-traversal
    attach(['parent', 'next', 'prev', 'siblings', 'children'], ALWAYS_NODE);
    attach(['contains']);

    // dom-create
    attach(['html'], ONLY_VAL);
    attach(['remove']);

    // dom-insertion
    //attach(['insertBefore', 'insertAfter'], ALWAYS_NODE); TODO: 目前参数传递有问题
    S.each([NP, NLP], function(P) {
        S.mix(P, {

            /**
             *  Insert content to the end of the node.
             */
            append: function(html) {
                if (html) {
                    S.each(this, function(elem) {
                        elem.appendChild(DOM.create(html));
                    });
                }
                return this;
            },

            /**
             * Insert the element to the end of the parent.
             */
            appendTo: function(parent) {
                if ((parent = S.get(parent)) && parent.appendChild) {
                    S.each(this, function(elem) {
                        parent.appendChild(elem);
                    });
                }
                return this;
            }
        });
    });


    // event-target
    S.each([NP, NLP], function(P) {
        S.mix(P, S.EventTarget);
        P._addEvent = function(type, handle) {
            for (var i = 0, len = this.length; i < len; i++) {
                Event._simpleAdd(this[i], type, handle);
            }
        };
        P._removeEvent = function(type, handle) {
            for (var i = 0, len = this.length; i < len; i++) {
                Event._simpleRemove(this[i], type, handle);
            }
        };
        delete P.fire;
    });
});
/*
Copyright 2010, KISSY UI Library v1.0.8
MIT Licensed
build: 888 Jul 20 19:32
*/
/**
 * @module  ajax
 * @author  lifesinger@gmail.com
 */
KISSY.add('ajax', function(S) {

    var doc = document,
        testNode = doc.createElement('script'),
        // try branching
        fn = testNode.readyState ? function(node, callback) {
            node.onreadystatechange = function() {
                var rs = node.readyState;
                if (rs === 'loaded' || rs === 'complete') {
                    // handle memory leak in IE
                    node.onreadystatechange = null;
                    callback.call(this);
                }
            };
        } : function(node, callback) {
            node.onload = callback;
        };

    S.Ajax = {

        /**
         * Sends an HTTP request to a remote server.
         */
        request: function(/*url, options*/) {
            S.error('not implemented'); // TODO
        },

        /**
         * Load a JavaScript file from the server using a GET HTTP request, then execute it.
         */
        getScript: function(url, callback, charset) {
            var head = S.get('head') || doc.documentElement,
                node = doc.createElement('script');

            node.src = url;
            if (charset) node.charset = charset;
            node.async = true;

            if (S.isFunction(callback)) {
                fn(node, callback);
            }

            head.appendChild(node);
        }
    };

});

/**
 * NOTES:
 *  2010.04
 *   - api 考虑：jQuery 的全耦合在 jQuery 对象上，ajaxComplete 等方法不优雅。
 *         YUI2 的 YAHOO.util.Connect.Get.script 层级太深，YUI3 的 io 则
 *         野心过大，KISSY 借鉴 ExtJS, 部分方法借鉴 jQuery.
 *
 */
/*
Copyright 2010, KISSY UI Library v1.0.8
MIT Licensed
build: 888 Jul 20 19:32
*/
/**
 * @module  cookie
 * @author  lifesinger@gmail.com
 * @depends ks-core
 */
KISSY.add('cookie', function(S) {

    var doc = document,
        encode = encodeURIComponent,
        decode = decodeURIComponent;

    S.Cookie = {

        /**
         * 获取 cookie 值
         * @return {string} 如果 name 不存在，返回 undefined
         */
        get: function(name) {
            var ret, m;

            if (isNotEmptyString(name)) {
                if ((m = doc.cookie.match('(?:^| )' + name + '(?:(?:=([^;]*))|;|$)'))) {
                    ret = m[1] ? decode(m[1]) : '';
                }
            }
            return ret;
        },

        set: function(name, val, expires, domain, path, secure) {
            var text = encode(val), date = expires;

            // 从当前时间开始，多少天后过期
            if (typeof date === 'number') {
                date = new Date();
                date.setTime(date.getTime() + expires * 86400000);
            }
            // expiration date
            if (date instanceof Date) {
                text += '; expires=' + date.toUTCString();
            }

            // domain
            if (isNotEmptyString(domain)) {
                text += '; domain=' + domain;
            }

            // path
            if (isNotEmptyString(path)) {
                text += '; path=' + path;
            }

            // secure
            if (secure) {
                text += '; secure';
            }

            doc.cookie = name + '=' + text;
        },

        remove: function(name, domain, path, secure) {
            // 置空，并立刻过期
            this.set(name, '', 0, domain, path, secure);
        }
    };

    function isNotEmptyString(val) {
        return S.isString(val) && val !== '';
    }

});

/**
 * NOTES:
 *
 *  2010.04
 *   - get 方法要考虑 ie 下，
 *     值为空的 cookie 为 'test3; test3=3; test3tt=2; test1=t1test3; test3', 没有等于号。
 *     除了正则获取，还可以 split 字符串的方式来获取。
 *   - api 设计上，原本想借鉴 jQuery 的简明风格：S.cookie(name, ...), 但考虑到可扩展性，目前
 *     独立成静态工具类的方式更优。
 *
 */
/*
Copyright 2010, KISSY UI Library v1.0.8
MIT Licensed
build: 888 Jul 20 19:33
*/
/**
 * from http://www.JSON.org/json2.js
 * 2010-03-20
 */

KISSY.add('json', function (S) {

    var JSON = S.JSON = window.JSON || { };

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function () {

            return isFinite(this.valueOf()) ?
                   this.getUTCFullYear() + '-' +
                   f(this.getUTCMonth() + 1) + '-' +
                   f(this.getUTCDate()) + 'T' +
                   f(this.getUTCHours()) + ':' +
                   f(this.getUTCMinutes()) + ':' +
                   f(this.getUTCSeconds()) + 'Z' : null;
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function () {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

        // If the string contains no control characters, no quote characters, and no
        // backslash characters, then we can safely slap some quotes around it.
        // Otherwise we must also replace the offending characters with safe escape
        // sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ?
               '"' + string.replace(escapable, function (a) {
                   var c = meta[a];
                   return typeof c === 'string' ? c :
                          '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
               }) + '"' :
               '"' + string + '"';
    }


    function str(key, holder) {

        // Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

        // If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
            typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

        // If we were called with a replacer function, then call the replacer to
        // obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

        // What happens next depends on the value's type.

        switch (typeof value) {
            case 'string':
                return quote(value);

            case 'number':

                // JSON numbers must be finite. Encode non-finite numbers as null.

                return isFinite(value) ? String(value) : 'null';

            case 'boolean':
            case 'null':

                // If the value is a boolean or null, convert it to a string. Note:
                // typeof null does not produce 'null'. The case is included here in
                // the remote chance that this gets fixed someday.

                return String(value);

            // If the type is 'object', we might be dealing with an object or an array or
            // null.

            case 'object':

                // Due to a specification blunder in ECMAScript, typeof null is 'object',
                // so watch out for that case.

                if (!value) {
                    return 'null';
                }

                // Make an array to hold the partial results of stringifying this object value.

                gap += indent;
                partial = [];

                // Is the value an array?

                if (Object.prototype.toString.apply(value) === '[object Array]') {

                    // The value is an array. Stringify every element. Use null as a placeholder
                    // for non-JSON values.

                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }

                    // Join all of the elements together, separated with commas, and wrap them in
                    // brackets.

                    v = partial.length === 0 ? '[]' :
                        gap ? '[\n' + gap +
                              partial.join(',\n' + gap) + '\n' +
                              mind + ']' :
                        '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }

                // If the replacer is an array, use it to select the members to be stringified.

                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        k = rep[i];
                        if (typeof k === 'string') {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {

                    // Otherwise, iterate through all of the keys in the object.

                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }

                // Join all of the member texts together, separated with commas,
                // and wrap them in braces.

                v = partial.length === 0 ? '{}' :
                    gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                          mind + '}' : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
        }
    }

    // If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

            // The stringify method takes a value and an optional replacer, and an optional
            // space parameter, and returns a JSON text. The replacer can be a function
            // that can replace values, or an array of strings that will select the keys.
            // A default replacer method can be provided. Use of the space parameter can
            // produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

            // If the space parameter is a number, make an indent string containing that
            // many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

                // If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

            // If there is a replacer, it must be a function or an array.
            // Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                (typeof replacer !== 'object' ||
                 typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

            // Make a fake root object containing our value under the key of ''.
            // Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


    // If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

            // The parse method takes a text and an optional reviver function, and returns
            // a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

                // The walk method is used to recursively walk the resulting structure so
                // that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


            // Parsing happens in four stages. In the first stage, we replace certain
            // Unicode characters with escape sequences. JavaScript handles many characters
            // incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                           ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

            // In the second stage, we run the text against regular expressions that look
            // for non-JSON patterns. We are especially concerned with '()' and 'new'
            // because they can cause invocation, and '=' because it can cause mutation.
            // But just to be safe, we want to reject all unexpected forms.

            // We split the second stage into 4 regexp operations in order to work around
            // crippling inefficiencies in IE's and Safari's regexp engines. First we
            // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
            // replace all simple value tokens with ']' characters. Third, we delete all
            // open brackets that follow a colon or comma or that begin the text. Finally,
            // we look to see that the remaining characters are only whitespace or ']' or
            // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/.
                test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
                replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
                replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

                // In the third stage we use the eval function to compile the text into a
                // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
                // in JavaScript: it can begin a block or an object literal. We wrap the text
                // in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

                // In the optional fourth stage, we recursively walk the new structure, passing
                // each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                       walk({'': j}, '') : j;
            }

            // If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
});
/*
Copyright 2010, KISSY UI Library v1.0.8
MIT Licensed
build: 888 Jul 20 19:33
*/
/*!
 * Sizzle CSS Selector Engine - v1.0
 *  Copyright 2009, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function(){
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function(selector, context, results, seed) {
	results = results || [];
	context = context || document;

	var origContext = context;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}
	
	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var parts = [], m, set, checkSet, extra, prune = true, contextXML = Sizzle.isXML(context),
		soFar = selector, ret, cur, pop, i;
	
	// Reset the position of the chunker regexp (start from head)
	do {
		chunker.exec("");
		m = chunker.exec(soFar);

		if ( m ) {
			soFar = m[3];
		
			parts.push( m[1] );
		
			if ( m[2] ) {
				extra = m[3];
				break;
			}
		}
	} while ( m );

	if ( parts.length > 1 && origPOS.exec( selector ) ) {
		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context );
		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}
				
				set = posProcess( selector, set );
			}
		}
	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {
			ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ? Sizzle.filter( ret.expr, ret.set )[0] : ret.set[0];
		}

		if ( context ) {
			ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );
			set = ret.expr ? Sizzle.filter( ret.expr, ret.set ) : ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray(set);
			} else {
				prune = false;
			}

			while ( parts.length ) {
				cur = parts.pop();
				pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}
		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		Sizzle.error( cur || selector );
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );
		} else if ( context && context.nodeType === 1 ) {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}
		} else {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}
	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function(results){
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort(sortOrder);

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[i-1] ) {
					results.splice(i--, 1);
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function(expr, set){
	return Sizzle(expr, null, null, set);
};

Sizzle.find = function(expr, context, isXML){
	var set;

	if ( !expr ) {
		return [];
	}

	for ( var i = 0, l = Expr.order.length; i < l; i++ ) {
		var type = Expr.order[i], match;
		
		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			var left = match[1];
			match.splice(1,1);

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace(/\\/g, "");
				set = Expr.find[ type ]( match, context, isXML );
				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = context.getElementsByTagName("*");
	}

	return {set: set, expr: expr};
};

Sizzle.filter = function(expr, set, inplace, not){
	var old = expr, result = [], curLoop = set, match, anyFound,
		isXMLFilter = set && set[0] && Sizzle.isXML(set[0]);

	while ( expr && set.length ) {
		for ( var type in Expr.filter ) {
			if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
				var filter = Expr.filter[ type ], found, item, left = match[1];
				anyFound = false;

				match.splice(1,1);

				if ( left.substr( left.length - 1 ) === "\\" ) {
					continue;
				}

				if ( curLoop === result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;
					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( var i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							var pass = not ^ !!found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;
								} else {
									curLoop[i] = false;
								}
							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr === old ) {
			if ( anyFound == null ) {
				Sizzle.error( expr );
			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

Sizzle.error = function( msg ) {
	throw "Syntax error, unrecognized expression: " + msg;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],
	match: {
		ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\((even|odd|[\dn+\-]*)\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
	},
	leftMatch: {},
	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},
	attrHandle: {
		href: function(elem){
			return elem.getAttribute("href");
		}
	},
	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !/\W/.test(part),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},
		">": function(checkSet, part){
			var isPartStr = typeof part === "string",
				elem, i = 0, l = checkSet.length;

			if ( isPartStr && !/\W/.test(part) ) {
				part = part.toLowerCase();

				for ( ; i < l; i++ ) {
					elem = checkSet[i];
					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
					}
				}
			} else {
				for ( ; i < l; i++ ) {
					elem = checkSet[i];
					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},
		"": function(checkSet, part, isXML){
			var doneName = done++, checkFn = dirCheck, nodeCheck;

			if ( typeof part === "string" && !/\W/.test(part) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn("parentNode", part, doneName, checkSet, nodeCheck, isXML);
		},
		"~": function(checkSet, part, isXML){
			var doneName = done++, checkFn = dirCheck, nodeCheck;

			if ( typeof part === "string" && !/\W/.test(part) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn("previousSibling", part, doneName, checkSet, nodeCheck, isXML);
		}
	},
	find: {
		ID: function(match, context, isXML){
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				return m ? [m] : [];
			}
		},
		NAME: function(match, context){
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [], results = context.getElementsByName(match[1]);

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},
		TAG: function(match, context){
			return context.getElementsByTagName(match[1]);
		}
	},
	preFilter: {
		CLASS: function(match, curLoop, inplace, result, not, isXML){
			match = " " + match[1].replace(/\\/g, "") + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n]/g, " ").indexOf(match) >= 0) ) {
						if ( !inplace ) {
							result.push( elem );
						}
					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},
		ID: function(match){
			return match[1].replace(/\\/g, "");
		},
		TAG: function(match, curLoop){
			return match[1].toLowerCase();
		},
		CHILD: function(match){
			if ( match[1] === "nth" ) {
				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},
		ATTR: function(match, curLoop, inplace, result, not, isXML){
			var name = match[1].replace(/\\/g, "");
			
			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},
		PSEUDO: function(match, curLoop, inplace, result, not){
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);
				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);
					if ( !inplace ) {
						result.push.apply( result, ret );
					}
					return false;
				}
			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}
			
			return match;
		},
		POS: function(match){
			match.unshift( true );
			return match;
		}
	},
	filters: {
		enabled: function(elem){
			return elem.disabled === false && elem.type !== "hidden";
		},
		disabled: function(elem){
			return elem.disabled === true;
		},
		checked: function(elem){
			return elem.checked === true;
		},
		selected: function(elem){
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			elem.parentNode.selectedIndex;
			return elem.selected === true;
		},
		parent: function(elem){
			return !!elem.firstChild;
		},
		empty: function(elem){
			return !elem.firstChild;
		},
		has: function(elem, i, match){
			return !!Sizzle( match[3], elem ).length;
		},
		header: function(elem){
			return (/h\d/i).test( elem.nodeName );
		},
		text: function(elem){
			return "text" === elem.type;
		},
		radio: function(elem){
			return "radio" === elem.type;
		},
		checkbox: function(elem){
			return "checkbox" === elem.type;
		},
		file: function(elem){
			return "file" === elem.type;
		},
		password: function(elem){
			return "password" === elem.type;
		},
		submit: function(elem){
			return "submit" === elem.type;
		},
		image: function(elem){
			return "image" === elem.type;
		},
		reset: function(elem){
			return "reset" === elem.type;
		},
		button: function(elem){
			return "button" === elem.type || elem.nodeName.toLowerCase() === "button";
		},
		input: function(elem){
			return (/input|select|textarea|button/i).test(elem.nodeName);
		}
	},
	setFilters: {
		first: function(elem, i){
			return i === 0;
		},
		last: function(elem, i, match, array){
			return i === array.length - 1;
		},
		even: function(elem, i){
			return i % 2 === 0;
		},
		odd: function(elem, i){
			return i % 2 === 1;
		},
		lt: function(elem, i, match){
			return i < match[3] - 0;
		},
		gt: function(elem, i, match){
			return i > match[3] - 0;
		},
		nth: function(elem, i, match){
			return match[3] - 0 === i;
		},
		eq: function(elem, i, match){
			return match[3] - 0 === i;
		}
	},
	filter: {
		PSEUDO: function(elem, match, i, array){
			var name = match[1], filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || Sizzle.getText([ elem ]) || "").indexOf(match[3]) >= 0;
			} else if ( name === "not" ) {
				var not = match[3];

				for ( var j = 0, l = not.length; j < l; j++ ) {
					if ( not[j] === elem ) {
						return false;
					}
				}

				return true;
			} else {
				Sizzle.error( "Syntax error, unrecognized expression: " + name );
			}
		},
		CHILD: function(elem, match){
			var type = match[1], node = elem;
			switch (type) {
				case 'only':
				case 'first':
					while ( (node = node.previousSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}
					if ( type === "first" ) { 
						return true; 
					}
					node = elem;
				case 'last':
					while ( (node = node.nextSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}
					return true;
				case 'nth':
					var first = match[2], last = match[3];

					if ( first === 1 && last === 0 ) {
						return true;
					}
					
					var doneName = match[0],
						parent = elem.parentNode;
	
					if ( parent && (parent.sizcache !== doneName || !elem.nodeIndex) ) {
						var count = 0;
						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						} 
						parent.sizcache = doneName;
					}
					
					var diff = elem.nodeIndex - last;
					if ( first === 0 ) {
						return diff === 0;
					} else {
						return ( diff % first === 0 && diff / first >= 0 );
					}
			}
		},
		ID: function(elem, match){
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},
		TAG: function(elem, match){
			return (match === "*" && elem.nodeType === 1) || elem.nodeName.toLowerCase() === match;
		},
		CLASS: function(elem, match){
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},
		ATTR: function(elem, match){
			var name = match[1],
				result = Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value !== check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},
		POS: function(elem, match, i, array){
			var name = match[2], filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS,
	fescape = function(all, num){
		return "\\" + (num - 0 + 1);
	};

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
	Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
}

var makeArray = function(array, results) {
	array = Array.prototype.slice.call( array, 0 );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}
	
	return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
	Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
} catch(e){
	makeArray = function(array, results) {
		var ret = results || [], i = 0;

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );
		} else {
			if ( typeof array.length === "number" ) {
				for ( var l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}
			} else {
				for ( ; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
			if ( a == b ) {
				hasDuplicate = true;
			}
			return a.compareDocumentPosition ? -1 : 1;
		}

		var ret = a.compareDocumentPosition(b) & 4 ? -1 : a === b ? 0 : 1;
		if ( ret === 0 ) {
			hasDuplicate = true;
		}
		return ret;
	};
} else if ( "sourceIndex" in document.documentElement ) {
	sortOrder = function( a, b ) {
		if ( !a.sourceIndex || !b.sourceIndex ) {
			if ( a == b ) {
				hasDuplicate = true;
			}
			return a.sourceIndex ? -1 : 1;
		}

		var ret = a.sourceIndex - b.sourceIndex;
		if ( ret === 0 ) {
			hasDuplicate = true;
		}
		return ret;
	};
} else if ( document.createRange ) {
	sortOrder = function( a, b ) {
		if ( !a.ownerDocument || !b.ownerDocument ) {
			if ( a == b ) {
				hasDuplicate = true;
			}
			return a.ownerDocument ? -1 : 1;
		}

		var aRange = a.ownerDocument.createRange(), bRange = b.ownerDocument.createRange();
		aRange.setStart(a, 0);
		aRange.setEnd(a, 0);
		bRange.setStart(b, 0);
		bRange.setEnd(b, 0);
		var ret = aRange.compareBoundaryPoints(Range.START_TO_END, bRange);
		if ( ret === 0 ) {
			hasDuplicate = true;
		}
		return ret;
	};
}

// Utility function for retreiving the text value of an array of DOM nodes
Sizzle.getText = function( elems ) {
	var ret = "", elem;

	for ( var i = 0; elems[i]; i++ ) {
		elem = elems[i];

		// Get the text from text nodes and CDATA nodes
		if ( elem.nodeType === 3 || elem.nodeType === 4 ) {
			ret += elem.nodeValue;

		// Traverse everything else, except comment nodes
		} else if ( elem.nodeType !== 8 ) {
			ret += Sizzle.getText( elem.childNodes );
		}
	}

	return ret;
};

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("div"),
		id = "script" + (new Date()).getTime();
	form.innerHTML = "<a name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it quickly
	var root = document.documentElement;
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( document.getElementById( id ) ) {
		Expr.find.ID = function(match, context, isXML){
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				return m ? m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ? [m] : undefined : [];
			}
		};

		Expr.filter.ID = function(elem, match){
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );
	root = form = null; // release memory in IE
})();

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function(match, context){
			var results = context.getElementsByTagName(match[1]);

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";
	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {
		Expr.attrHandle.href = function(elem){
			return elem.getAttribute("href", 2);
		};
	}

	div = null; // release memory in IE
})();

if ( document.querySelectorAll ) {
	(function(){
		var oldSizzle = Sizzle, div = document.createElement("div");
		div.innerHTML = "<p class='TEST'></p>";

		// Safari can't handle uppercase or unicode characters when
		// in quirks mode.
		if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
			return;
		}
	
		Sizzle = function(query, context, extra, seed){
			context = context || document;

			// Only use querySelectorAll on non-XML documents
			// (ID selectors don't work in non-HTML documents)
			if ( !seed && context.nodeType === 9 && !Sizzle.isXML(context) ) {
				try {
					return makeArray( context.querySelectorAll(query), extra );
				} catch(e){}
			}
		
			return oldSizzle(query, context, extra, seed);
		};

		for ( var prop in oldSizzle ) {
			Sizzle[ prop ] = oldSizzle[ prop ];
		}

		div = null; // release memory in IE
	})();
}

(function(){
	var div = document.createElement("div");

	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	// Opera can't find a second classname (in 9.6)
	// Also, make sure that getElementsByClassName actually exists
	if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
		return;
	}

	// Safari caches class attributes, doesn't catch changes (in 3.2)
	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 ) {
		return;
	}
	
	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function(match, context, isXML) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};

	div = null; // release memory in IE
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];
		if ( elem ) {
			elem = elem[dir];
			var match = false;

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem.sizcache = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName.toLowerCase() === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];
		if ( elem ) {
			elem = elem[dir];
			var match = false;

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem.sizcache = doneName;
						elem.sizset = i;
					}
					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

Sizzle.contains = document.compareDocumentPosition ? function(a, b){
	return !!(a.compareDocumentPosition(b) & 16);
} : function(a, b){
	return a !== b && (a.contains ? a.contains(b) : true);
};

Sizzle.isXML = function(elem){
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833) 
	var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function(selector, context){
	var tmpSet = [], later = "", match,
		root = context.nodeType ? [context] : context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet );
	}

	return Sizzle.filter( later, tmpSet );
};

// EXPOSE
KISSY.ExternalSelector = Sizzle;
KISSY.ExternalSelector._filter = function(selector, filter) {
    //Sizzle.matches( String selector, Array<DOMElement> set )
    return Sizzle.matches(filter, KISSY.query(selector));
};

})();
/*
Copyright 2010, KISSY UI Library v1.0.8
MIT Licensed
build: 888 Jul 20 19:32
*/
/**
 * 数据延迟加载组件
 * @module   datalazyload
 * @creator  玉伯<lifesinger@gmail.com>
 * @depends  ks-core
 */
KISSY.add('datalazyload', function(S, undefined) {

    var DOM = S.DOM, Event = S.Event,
        win = window, doc = document,

        IMG_DATA_SRC = 'data-lazyload-src',
        TEXTAREA_DATA_CLS = 'ks-datalazyload',
        CUSTOM_IMG_DATA_SRC = IMG_DATA_SRC + '-custom',
        CUSTOM_TEXTAREA_DATA_CLS = TEXTAREA_DATA_CLS + '-custom',
        MOD = { AUTO: 'auto', MANUAL: 'manual' },
        DISPLAY = 'none', DEFAULT = 'default', NONE = 'none',
        SCROLL = 'scroll', RESIZE = 'resize',

        defaultConfig = {

            /**
             * 懒处理模式
             *   auto   - 自动化。html 输出时，不对 img.src 做任何处理
             *   manual - 输出 html 时，已经将需要延迟加载的图片的 src 属性替换为 IMG_DATA_SRC
             * 注：对于 textarea 数据，只有手动模式
             */
            mod: MOD.MANUAL,

            /**
             * 当前视窗往下，diff px 外的 img/textarea 延迟加载
             * 适当设置此值，可以让用户在拖动时感觉数据已经加载好
             * 默认为当前视窗高度（两屏以外的才延迟加载）
             */
            diff: DEFAULT,

            /**
             * 图像的占位图，默认无
             */
            placeholder: NONE
        };

    /**
     * 延迟加载组件
     * @constructor
     */
    function DataLazyload(containers, config) {
        var self = this;

        // factory or constructor
        if (!(self instanceof DataLazyload)) {
            return new DataLazyload(containers, config);
        }

        // 允许仅传递 config 一个参数
        if (config === undefined) {
            config = containers;
            containers = [doc];
        }

        // containers 是一个 HTMLElement 时
        if (!S.isArray(containers)) {
            containers = [S.get(containers) || doc];
        }

        /**
         * 图片所在容器（可以多个），默认为 [doc]
         * @type Array
         */
        self.containers = containers;

        /**
         * 配置参数
         * @type Object
         */
        self.config = S.merge(defaultConfig, config);

        /**
         * 需要延迟下载的图片
         * @type Array
         */
        //self.images

        /**
         * 需要延迟处理的 textarea
         * @type Array
         */
        //self.areas

        /**
         * 开始延迟的 Y 坐标
         * @type number
         */
        //self.threshold

        self._init();
    }

    S.augment(DataLazyload, {

        /**
         * 初始化
         * @protected
         */
        _init: function() {
            var self = this;
            self.threshold = self._getThreshold();

            self._filterItems();
            self._getItemsLength() && self._initLoadEvent();
        },

        /**
         * 获取并初始化需要延迟的 images 和 areas
         * @protected
         */
        _filterItems: function() {
            var self = this,
                containers = self.containers,
                n, N, imgs, areas, i, len, img, area,
                lazyImgs = [], lazyAreas = [];

            for (n = 0,N = containers.length; n < N; ++n) {
                imgs = S.query('img', containers[n]);
                lazyImgs = lazyImgs.concat(S.filter(imgs, self._filterImg, self));

                areas = S.query('textarea', containers[n]);
                lazyAreas = lazyAreas.concat(S.filter(areas, self._filterArea, self));
            }

            self.images = lazyImgs;
            self.areas = lazyAreas;
        },

        /**
         * filter for lazyload image
         */
        _filterImg: function(img) {
            var self = this,
                dataSrc = img.getAttribute(IMG_DATA_SRC),
                threshold = self.threshold,
                placeholder = self.config.placeholder,
                isManualMod = self.config.mod === MOD.MANUAL;

            // 手工模式，只处理有 data-src 的图片
            if (isManualMod) {
                if (dataSrc) {
                    if (placeholder !== NONE) {
                        img.src = placeholder;
                    }
                    return true;
                }
            }
            // 自动模式，只处理 threshold 外无 data-src 的图片
            else {
                // 注意：已有 data-src 的项，可能已有其它实例处理过，不用再次处理
                if (DOM.offset(img).top > threshold && !dataSrc) {
                    DOM.attr(img, IMG_DATA_SRC, img.src);
                    if (placeholder !== NONE) {
                        img.src = placeholder;
                    } else {
                        img.removeAttribute('src');
                    }
                    return true;
                }
            }
        },

        /**
         * filter for lazyload textarea
         */
        _filterArea: function(area) {
            return DOM.hasClass(area, TEXTAREA_DATA_CLS);
        },

        /**
         * 初始化加载事件
         * @protected
         */
        _initLoadEvent: function() {
            var timer, self = this;

            // scroll 和 resize 时，加载图片
            Event.on(win, SCROLL, loader);
            Event.on(win, RESIZE, function() {
                self.threshold = self._getThreshold();
                loader();
            });

            // 需要立即加载一次，以保证第一屏的延迟项可见
            if (self._getItemsLength()) {
                S.ready(function() {
                    loadItems();
                });
            }

            // 加载函数
            function loader() {
                if (timer) return;
                timer = setTimeout(function() {
                    loadItems();
                    timer = null;
                }, 100); // 0.1s 内，用户感觉流畅
            }

            // 加载延迟项
            function loadItems() {
                self._loadItems();
                if (self._getItemsLength() === 0) {
                    Event.remove(win, SCROLL, loader);
                    Event.remove(win, RESIZE, loader);
                }
            }
        },

        /**
         * 加载延迟项
         */
        _loadItems: function() {
            this._loadImgs();
            this._loadAreas();
        },

        /**
         * 加载图片
         * @protected
         */
        _loadImgs: function() {
            var self = this;
            self.images = S.filter(self.images, self._loadImg, self);
        },

        /**
         * 监控滚动，处理图片
         */
        _loadImg: function(img) {
            var self = this,
                scrollTop = DOM.scrollTop(),
                threshold = self.threshold + scrollTop,
                offset = DOM.offset(img);

            if (offset.top <= threshold) {
                self._loadImgSrc(img);
            } else {
                return true;
            }
        },

        /**
         * 加载图片 src
         * @static
         */
        _loadImgSrc: function(img, flag) {
            flag = flag || IMG_DATA_SRC;
            var dataSrc = img.getAttribute(flag);

            if (dataSrc && img.src != dataSrc) {
                img.src = dataSrc;
                img.removeAttribute(flag);
            }
        },

        /**
         * 加载 textarea 数据
         * @protected
         */
        _loadAreas: function() {
            var self = this;
            self.areas = S.filter(self.areas, self._loadArea, self);
        },

        /**
         * 监控滚动，处理 textarea
         */
        _loadArea: function(area) {
            var self = this,
                top = DOM.offset(area).top;

            // 注：area 可能处于 display: none 状态，top 返回 0
            // 这种情况下用 area.parentNode 的 Y 值来判断
            if (!top && DOM.css(area, DISPLAY) == NONE) {
                top = DOM.offset(area.parentNode).top;
            }

            if (top <= self.threshold + DOM.scrollTop()) {
                self._loadAreaData(area.parentNode, area);
            } else {
                return true;
            }
        },

        /**
         * 从 textarea 中加载数据
         * @static
         */
        _loadAreaData: function(container, area) {
            //chengyu 大幅重构，使用正则识别 html 字符串里的 script，提高性能
            // 为了通用性，不要搜索 container 内的全部 script dom 节点执行

            // 采用隐藏 textarea 但不去除方式，去除会引发 Chrome 下错乱
            area.style.display = NONE;
            area.className = ''; // clear hook

            var content = DOM.create('<div>');
            container.insertBefore(content, area);
            DOM.html(content, area.value, true);

            //area.value = ''; // bug fix: 注释掉，不能清空，否则 F5 刷新，会丢内容
        },

        /**
         * 获取阈值
         * @protected
         */
        _getThreshold: function() {
            var diff = this.config.diff,
                vh = DOM.viewportHeight();

            if (diff === DEFAULT) return 2 * vh; // diff 默认为当前视窗高度（两屏以外的才延迟加载）
            else return vh + diff;
        },

        /**
         * 获取当前延迟项的数量
         * @protected
         */
        _getItemsLength: function() {
            return this.images.length + this.areas.length;
        },

        /**
         * 加载自定义延迟数据
         * @static
         */
        loadCustomLazyData: function(containers, type, flag) {
            var self = this, area, imgs;

            // 支持数组
            if (!S.isArray(containers)) {
                containers = [S.get(containers)];
            }

            // 遍历处理
            S.each(containers, function(container) {
                switch (type) {

                    case 'textarea-data':
                        area = S.get('textarea', container);
                        if (area && DOM.hasClass(area, flag || CUSTOM_TEXTAREA_DATA_CLS)) {
                            self._loadAreaData(container, area);
                        }
                        break;
                    
                    //case 'img-src':
                    default:
                        if (container.nodeName === 'IMG') { // 本身就是图片
                            imgs = [container];
                        } else {
                            imgs = S.query('img', container);
                        }

                        S.each(imgs, function(img) {
                            self._loadImgSrc(img, flag || CUSTOM_IMG_DATA_SRC);
                        });
                }
            });
        }
    });

    // attach static methods
    S.mix(DataLazyload, DataLazyload.prototype, true, ['loadCustomLazyData', '_loadImgSrc', '_loadAreaData']);

    S.DataLazyload = DataLazyload;
});

/**
 * NOTES:
 *
 * 模式为 auto 时：
 *  1. 在 Firefox 下非常完美。脚本运行时，还没有任何图片开始下载，能真正做到延迟加载。
 *  2. 在 IE 下不尽完美。脚本运行时，有部分图片已经与服务器建立链接，这部分 abort 掉，
 *     再在滚动时延迟加载，反而增加了链接数。
 *  3. 在 Safari 和 Chrome 下，因为 webkit 内核 bug，导致无法 abort 掉下载。该
 *     脚本完全无用。
 *  4. 在 Opera 下，和 Firefox 一致，完美。
 *  5. 2010-07-12: 发现在 Firefox 下，也有导致部分 Aborted 链接。
 *
 * 模式为 manual 时：（要延迟加载的图片，src 属性替换为 data-lazyload-src, 并将 src 的值赋为 placeholder ）
 *  1. 在任何浏览器下都可以完美实现。
 *  2. 缺点是不渐进增强，无 JS 时，图片不能展示。
 *
 * 缺点：
 *  1. 对于大部分情况下，需要拖动查看内容的页面（比如搜索结果页），快速滚动时加载有损用
 *     户体验（用户期望所滚即所得），特别是网速不好时。
 *  2. auto 模式不支持 Webkit 内核浏览器；IE 下，有可能导致 HTTP 链接数的增加。
 *
 * 优点：
 *  1. 可以很好的提高页面初始加载速度。
 *  2. 第一屏就跳转，延迟加载图片可以减少流量。
 *
 * 参考资料：
 *  1. http://davidwalsh.name/lazyload MooTools 的图片延迟插件
 *  2. http://vip.qq.com/ 模板输出时，就替换掉图片的 src
 *  3. http://www.appelsiini.net/projects/lazyload jQuery Lazyload
 *  4. http://www.dynamixlabs.com/2008/01/17/a-quick-look-add-a-loading-icon-to-your-larger-images/
 *  5. http://www.nczonline.net/blog/2009/11/30/empty-image-src-can-destroy-your-site/
 *
 * 特别要注意的测试用例:
 *  1. 初始窗口很小，拉大窗口时，图片加载正常
 *  2. 页面有滚动位置时，刷新页面，图片加载正常
 *  3. 手动模式，第一屏有延迟图片时，加载正常
 *
 * 2009-12-17 补充：
 *  1. textarea 延迟加载约定：页面中需要延迟的 dom 节点，放在
 *       <textarea class='ks-datalazysrc invisible'>dom code</textarea>
 *     里。可以添加 hidden 等 class, 但建议用 invisible, 并设定 height = '实际高度'，这样可以保证
 *     滚动时，diff 更真实有效。
 *     注意：textarea 加载后，会替换掉父容器中的所有内容。
 *  2. 延迟 callback 约定：dataLazyload.addCallback(el, fn) 表示当 el 即将出现时，触发 fn.
 *  3. 所有操作都是最多触发一次，比如 callback. 来回拖动滚动条时，只有 el 第一次出现时会触发 fn 回调。
 */

/**
 * TODO:
 *   - [取消] 背景图片的延迟加载（对于 css 里的背景图片和 sprite 很难处理）
 *   - [取消] 加载时的 loading 图（对于未设定大小的图片，很难完美处理[参考资料 4]）
 */

/**
 * UPDATE LOG:
 *   - 2010-07-10 yiminghe@gmail.com(chengyu) 重构，使用正则表达式识别 html 中的脚本，使用 EventTarget 自定义事件机制来处理回调
 *   - 2010-05-10 yubo ie6 下，在 dom ready 后执行，会导致 placeholder 重复加载，为比避免此问题，默认为 none, 去掉占位图
 *   - 2010-04-05 yubo 重构，使得对 YUI 的依赖仅限于 YDOM
 *   - 2009-12-17 yubo 将 imglazyload 升级为 datalazyload, 支持 textarea 方式延迟和特定元素即将出现时的回调函数
 */
/*
Copyright 2010, KISSY UI Library v1.0.8
MIT Licensed
build: 890 Jul 20 22:07
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
        EVENT_BEFORE_INIT = 'beforeInit', EVENT_INIT = 'init',
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

            // fire event
            if(self.fire(EVENT_BEFORE_INIT) === false) return;

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
            
            self.fire(EVENT_INIT);
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
            if (!self._triggerIsValid()) return; // 重复点击

            this._cancelSwitchTimer(); // 比如：先悬浮，再立刻点击，这时悬浮触发的切换可以取消掉。
            self.switchTo(index);
        },

        /**
         * 鼠标悬浮在 trigger 上时触发的事件
         */
        _onMouseEnterTrigger: function(index) {
            var self = this;
            if (!self._triggerIsValid()) return; // 重复悬浮。比如：已显示内容时，将鼠标快速滑出再滑进来，不必再次触发。

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
         * 重复触发时的有效判断
         */
        _triggerIsValid: function(index) {
            return this.activeIndex !== index;
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

            if (!self._triggerIsValid()) return self; // 再次避免重复触发
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
        _switchView: function(fromPanels, toPanels, index/*, direction*/) {
            // 最简单的切换效果：直接隐藏/显示
            DOM.css(fromPanels, DISPLAY, NONE);
            DOM.css(toPanels, DISPLAY, BLOCK);

            // fire onSwitch events
            this._fireOnSwitch(index);
        },

        /**
         * 触发 switch 相关事件
         */
        _fireOnSwitch: function(index) {
            this.fire(EVENT_SWITCH, { currentIndex: index });
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
KISSY.add('switchable-autoplay', function(S, undefined) {

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
            var cfg = host.config, interval = cfg.interval * 1000, leaveTimer;
            if (!cfg.autoplay) return;

            // 鼠标悬停，停止自动播放
            if (cfg.pauseOnHover) {
                Event.on(host.container, 'mouseenter', function() {
                    // 当鼠标移出后，又快速移动进来，这时要将 leaveTimer 取消掉
                    // 否则 pauseOnHover 会失效
                    if(leaveTimer) {
                        leaveTimer.cancel();
                        leaveTimer = undefined;
                    }
                    host.paused = true;
                });
                Event.on(host.container, 'mouseleave', function() {
                    // 假设 interval 为 10s
                    // 在 8s 时，通过 focus 主动触发切换，停留 1s 后，鼠标移出
                    // 这时如果不 setTimeout, 再过 1s 后，主动触发的 panel 将被替换掉
                    // 为了保证每个 panel 的显示时间都不小于 interval, 此处加上 setTimeout
                    leaveTimer = S.later(function() {
                        host.paused = false;
                        leaveTimer = undefined;
                    }, interval);
                });
            }

            // 设置自动播放
            host.autoplayTimer = S.later(function() {
                if (host.paused) return;
                // 自动播放默认 forward（不提供配置），这样可以保证 circular 在临界点正确切换
                host.switchTo(host.activeIndex < host.length - 1 ? host.activeIndex + 1 : 0, 'forward');
            }, interval, true);
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
        LEFT = 'left', TOP = 'top', FLOAT = 'float', PX = 'px',
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

            if (self.anim) self.anim.stop(true);

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

            props[isX ? LEFT : TOP] = -diff + PX;
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
                self._fireOnSwitch(index);
            }, index, direction);
        }

    });
});
/**
 * Switchable Circular Plugin
 * @creator  玉伯<lifesinger@gmail.com>
 */
KISSY.add('switchable-circular', function(S, undefined) {

    var DOM = S.DOM,
        POSITION = 'position', RELATIVE = 'relative',
        LEFT = 'left', TOP = 'top',
        EMPTY = '', PX = 'px',
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
        props[prop] = diff + PX;

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
                    isImgSrc = type === IMG_SRC,
                    tagName = isImgSrc ? 'img' : (type === TEXTAREA_DATA ? 'textarea' : '');

                if (tagName) {
                    elems = S.query(tagName, host.container);
                    for (i = 0, len = elems.length; i < len; i++) {
                        if (isImgSrc ? DOM.attr(elems[i], flag) : DOM.hasClass(elems[i], flag)) return false;
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
KISSY.add('carousel', function(S, undefined) {

    var DOM = S.DOM, Event = S.Event,
        CLS_PREFIX = 'ks-switchable-', DOT = '.',
        PREV_BTN = 'prevBtn', NEXT_BTN = 'nextBtn',

        /**
         * 默认配置，和 Switchable 相同的部分此处未列出
         */
        defaultConfig = {
            circular: true,
            prevBtnCls: CLS_PREFIX + 'prev-btn',
            nextBtnCls: CLS_PREFIX + 'next-btn',
            disableBtnCls: CLS_PREFIX + 'disable-btn'
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

        // 插入 carousel 的初始化逻辑
        self.on('init', function() { init_carousel(self); });

        // call super
        Carousel.superclass.constructor.call(self, container, S.merge(defaultConfig, config));
    }

    S.extend(Carousel, S.Switchable);
    S.Carousel = Carousel;

    /**
     * Carousel 的初始化逻辑
     * 增加了:
     *   self.prevBtn
     *   self.nextBtn
     */
    function init_carousel(self) {
        var cfg = self.config, disableCls = cfg.disableBtnCls;

        // 获取 prev/next 按钮，并添加事件
        S.each(['prev', 'next'], function(d) {
            var btn = self[d + 'Btn'] = S.get(DOT + cfg[d + 'BtnCls'], self.container);

            Event.on(btn, 'click', function(ev) {
                ev.preventDefault();
                if(!DOM.hasClass(btn, disableCls)) self[d]();
            });
        });

        // 注册 switch 事件，处理 prevBtn/nextBtn 的 disable 状态
        // circular = true 时，无需处理
        if (!cfg.circular) {
            self.on('switch', function(ev) {
                var i = ev.currentIndex,
                    disableBtn = (i === 0) ? self[PREV_BTN]
                        : (i === self.length - 1) ? self[NEXT_BTN]
                        : undefined;

                DOM.removeClass([self[PREV_BTN], self[NEXT_BTN]], disableCls);
                if (disableBtn) DOM.addClass(disableBtn, disableCls);
            });
        }

        // 触发 itemSelected 事件
        Event.on(self.panels, 'click focus', function() {
            self.fire('itemSelected', { item: this });
        });
    }
});


/**
 * NOTES:
 *
 * 2010.07
 *  - 添加对 prevBtn/nextBtn 的支持
 *  - 添加 itemSelected 事件
 *
 * TODO:
 *  - 对键盘事件的支持，比如 Up/Down 触发 prevItem/nextItem, PgDn/PgUp 触发 prev/next
 *  - itemSelected 时，自动居中的特性
 */
/**
 * Accordion Widget
 * @creator  沉鱼<fool2fish@gmail.com>
 */
KISSY.add('accordion', function(S) {

    var DOM = S.DOM,
        DISPLAY = 'display', BLOCK = 'block', NONE = 'none',

        defaultConfig = {
            triggerType: 'click',
            multiple: false
        };

    /**
     * Accordion Class
     * @constructor
     */
    function Accordion(container, config) {
        var self = this;

        // factory or constructor
        if (!(self instanceof Accordion)) {
            return new Accordion(container, config);
        }

        Accordion.superclass.constructor.call(self, container, S.merge(defaultConfig, config));
    }

    S.extend(Accordion, S.Switchable);
    S.Accordion = Accordion;

    S.augment(Accordion, {

        /**
         * 重复触发时的有效判断
         */
        _triggerIsValid: function(index) {
            // multiple 模式下，再次触发意味着切换展开/收缩状态
            return this.activeIndex !== index || this.config.multiple;
        },

        /**
         * 切换视图
         */
        _switchView: function(fromPanels, toPanels, index) {
            var self = this, cfg = self.config,
                panel = toPanels[0];

            if (cfg.multiple) {
                DOM.toggleClass(self.triggers[index], cfg.activeTriggerCls);
                DOM.css(panel, DISPLAY, panel.style[DISPLAY] == NONE ? BLOCK : NONE);
                this._fireOnSwitch(index);
            }
            else {
                Accordion.superclass._switchView.call(self, fromPanels, toPanels, index);
            }
        }
    });
});

/**
 * TODO:
 *
 *  - 支持动画
 *
 */
