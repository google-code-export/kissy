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

    // build ʱ���Ὣ  �滻Ϊ��
    S.Config = { debug: '' };

})(window, 'KISSY');

/**
 * Notes:
 *
 * 2010.04
 *  - �Ƴ��� weave ��������δ������ȫ��
 *
 * 2010.01
 *  - ���Ǽ򵥹��ú� 2/8 ԭ��ȥ���˶� YUI3 ɳ���ģ�⣨archives/2009 r402��
 *
 *  - add ���������ڲ�����Ļ�����֯��ʽ���� module �� submodule ��֯���룩��
 *  - ready ���������ⲿ����Ļ������÷�ʽ���ṩ��һ���򵥵���ɳ�䡣
 *  - mix, merge, extend, augment ������������������Ļ���ʵ�ַ�ʽ��
 *    ������� mixin ���Ժ� prototype ��ʽ��ʵ�ִ��롣
 *  - app, namespace �����������ӿ��ʵ�ֺʹ����������֯��
 *  - log �������򵥵ĵ��Թ��ߡ�
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

            // ie ��֧���� slice ת�� NodeList, ��������ͨ����
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
            // �� object, ֱ�ӷ��ؿ�
            if (typeof o !== 'object') return '';

            var buf = [], key, val;
            for (key in o) {
                val = o[key];

                // val Ϊ��Ч�ķ�����ֵ
                if (isValidParamValue(val)) {
                    buf.push(key, '=', val + '', '&');
                }
                // val Ϊ�ǿ�����
                else if (S.isArray(val) && val.length) {
                    for (var i = 0, len = val.length; i < len; ++i) {
                        if (isValidParamValue(val[i])) {
                            buf.push(key + '[]=', val[i] + '', '&');
                        }
                    }
                }
                // ������������������顢��������� object������ Function, RegExp, Date etc.����ֱ�Ӷ���
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
        // val Ϊ null, undefined, number, string, boolean ʱ������ true
        return val === null | (t !== 'object' && t !== 'function');
    }

    // ����ͨ���� url �ϼ� ?ks-debug ������ debug
    if('ks-debug' in S.unparam(location.hash)){
        S.Config.debug = true;
    }
});

/**
 * NOTES:
 *
 *  2010.04
 *   - param �� unparam Ӧ�÷���ʲô�ط����ʣ��е���ᣬĿǰ�ݷŴ˴���
 *   - ���� param, encodeURI �Ϳ����ˣ��� jQuery ����һ�¡�
 *   - param �� unparam �ǲ���ȫ����ġ��Կ�ֵ�Ĵ���� cookie ����һ�¡�
 *
 * TODO:
 *   - ���� jq �� isPlainObject
 *   - globalEval �У�appendChild ��ʽ��ı� text ��ʽ���ܸ���?
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
 *  - jQuery, YUI ����ⶼ�Ƽ�������̽������������̽������̽��ĺô������Զ���Ӧδ���豸��δ֪�豸������
 *    if(document.addEventListener) ���� IE 10 ֧�ֱ�׼�¼�������벻���޸ģ�������Ӧ�ˡ�δ�����������
 *    ����δ֪�����Ҳ����ˡ����ǣ��Ⲣ����ζ���������̽�͵ó������������������ȷ���������֪�ض�������ģ�
 *    ���Ҳ�����ĳ������̽����Խ��ʱ�����������̽�����ܴ�������ļ�࣬ͬʱҲҲ������ʲô�󻼡���֮��һ��
 *    ��Ȩ�⡣
 *  - UA.ie && UA.ie < 8 ������ζ��������Ͳ��� IE8, �п����� IE8 �ļ���ģʽ����һ�����ж���Ҫʹ�� documentMode
 *
 * TODO:
 *  - test mobile
 *  - Ȩ���Ƿ���Ҫ���� maxthon �ȹ����������̽��
 * 
 *//*
Copyright 2010, KISSY UI Library v1.0.5
MIT Licensed
build: 551 Apr 11 11:50
*/
/**
 * @module  selector
 * @author  lifesinger@gmail.com
 * @depends kissy
 */

KISSY.add('selector', function(S, undefined) {

    var doc = document,
        STRING = 'string',
        SPACE = ' ',
        ANY = '*',
        REG_ID = /^#[\w-]+$/,
        REG_QUERY = /^(?:#([\w-]+))?\s*([\w-]+|\*)?\.?([\w-]+)?$/;

    /**
     * Retrieves an Array of HTMLElement based on the given CSS selector.
     * @param {string} selector
     * @param {string|HTMLElement} context An id string or a HTMLElement used as context
     * @param {boolean} pure is for internal usage only
     * @return {Array} The array of found HTMLElement
     */
    function query(selector, context, pure) {
        var match, t, ret = [], id, tag, cls, i, len;

        // Ref: http://ejohn.org/blog/selectors-that-people-actually-use/
        // ���� 2/8 ԭ�򣬽�֧������ѡ������
        // #id
        // tag
        // .cls
        // #id tag
        // #id .cls
        // tag.cls
        // #id tag.cls
        // ע 1��REG_QUERY ����ƥ�� #id.cls ��Чֵ
        // ע 2��tag ����Ϊ * �ַ�
        // ע 3��֧�� , �ŷ���
        // ����ֵΪ����
        // ѡ������Ч������쳣ʱ�����ؿ�����

        // selector Ϊ�ַ������������������ȿ���
        // ע���հ��ַ��������жϣ�������ȥ�Զ��ܷ��ؿ�����
        if (typeof selector === STRING) {
            selector = S.trim(selector);

            // selector Ϊ #id �����������������Ż�����
            if (REG_ID.test(selector)) {
                t = getElementById(selector.slice(1));
                if (t) ret = [t]; // #id ��Чʱ�����ؿ�����
            }
            // selector Ϊ֧���б��е����� 6 ��
            else if (match = REG_QUERY.exec(selector)) { // NOTICE: assignment
                // ��ȡƥ�������Ϣ
                id = match[1];
                tag = match[2];
                cls = match[3];

                if (context = id ? getElementById(id) : tuneContext(context)) { // NOTICE: assignment

                    // #id .cls | #id tag.cls | .cls | tag.cls
                    if (cls) {
                        if (!id || selector.indexOf(SPACE) !== -1) { // �ų� #id.cls
                            ret = getElementsByClassName(cls, tag, context);
                        }
                    }
                    // #id tag | tag
                    else if (tag) { // �ų��հ��ַ���
                        ret = getElementsByTagName(context, tag);
                    }
                }
            }
            // ����ѡ����
            else if (selector.indexOf(',') > -1) {
                if (doc.querySelectorAll) {
                    ret = doc.querySelectorAll(selector);
                } else {
                    var parts = selector.split(','), r = [];
                    for (i = 0,len = parts.length; i < len; ++i) {
                        r = r.concat(query(parts[i], context));
                    }
                    ret = uniqueSort(r);
                }
            }
        }
        // ����� selector �� Node
        else if (selector && selector.nodeType) {
            ret = [selector];
        }
        // ����� selector �� NodeList
        else if (selector && selector.item) {
            ret = selector;
        }
        // ����� selector ������ֵʱ�����ؿ�����

        // �� NodeList ת��Ϊ��ͨ����
        if(ret.item) {
            ret = S.makeArray(ret);
        }

        // attach ��ʵ�÷���
        if(!pure) {
            attach(ret);
        }

        return ret;
    }

    // ���� context Ϊ����ֵ
    function tuneContext(context) {
        // 1). context Ϊ undefined ���������������ȿ���
        if (context === undefined) {
            context = doc;
        }
        // 2). context �ĵڶ�ʹ�ó����Ǵ��� #id
        else if (typeof context === STRING && REG_ID.test(context)) {
            context = getElementById(context.slice(1));
            // ע��#id ������Ч����ʱ��ȡ�� context Ϊ null
        }
        // 3). context �����Դ��� HTMLElement, ��ʱ���账��
        // 4). ���� 1 - 3, ��� context ������ HTMLElement, ��ֵΪ null
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
                    while (node = ret[i++]) { // NOTICE: assignment
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
        // ����ʹ�� querySelectorAll
        if (doc.querySelectorAll) {
            getElementsByClassName = function(cls, tag, context) {
                return context.querySelectorAll((tag ? tag : '') + '.' + cls);
            }
        }
        // ��������ͨ����
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

    // ���ڷ���ѡ��������Ҫ����ȥ�غ�����
    function uniqueSort(results) {
        var hasDuplicate = false;

        // ���� dom λ������
        results.sort(function (a, b) {
            // �ú���ֻ�ڲ�֧�� querySelectorAll �� IE7- ������б����ã�
            // ���ֻ�迼�� sourceIndex ����
            var ret = a.sourceIndex - b.sourceIndex;
            if (ret === 0) {
                hasDuplicate = true;
            }
            return ret;
        });

        // ȥ��
        if (hasDuplicate) {
            for (var i = 1; i < results.length; i++) {
                if (results[i] === results[i - 1]) {
                    results.splice(i--, 1);
                }
            }
        }

        return results;
    }

    // ���ʵ�÷����� arr ��
    function attach(arr) {
        // �������� each ���������������ڸ�����������
        arr.each = function(fn, context) {
            S.each(arr, fn, context);
        };
    }

    // public api
    S.query = query;
    S.get = function(selector, context) {
        return query(selector, context, true)[0] || null;
    }
});

/**
 * Notes:
 *
 * 2010.01
 *  - �� reg exec �Ľ��(id, tag, className)�� cache, ���ֶ�����Ӱ���С��ȥ����
 *  - getElementById ʹ��Ƶ����ߣ�ʹ��ֱ��ͨ���Ż���
 *  - getElementsByClassName �������� querySelectorAll, �� IE ϵ�в�֧�֡�
 *  - instanceof ��������Ӱ�졣
 *  - �ڲ������Ĳ��������� cls, context �ȵ��쳣������Ѿ��� query �������б�֤���������ࡰ��������
 *  - query ������һ��д�˽� 100 �У��ڶ��췢���ܼ򻯵� 50 �У�һ�����������ֻ����Խ�һ������
 *    30 �����¡�ͻȻ�ȷ���Ȥȥ�� jQuery ����ʷ���룬��֤�Ƿ������ƾ�������
 *  - query �����е������жϿ����ˡ�Ƶ�����ȡ�ԭ�����п��ܳ��ֵ��������ǰ�档
 *  - Array �� push ���������� j++ �������������������
 *  - ����ֵ���Ժ� Sizzle һ�£�����ʱ���������飻����������������ؿ����顣
 *
 *  - ��ѹ���Ƕȿ��ǣ������Խ� getElmentsByTagName �� getElementsByClassName ����Ϊ������
 *    �����о�������̫��ѹ���ء������Ǳ������滻�ĺá�
 *
 *  - ���� getElementsByClassName �Ľ���д�����������ķ����
 *
 * 2010.02
 *  - ��ӶԷ���ѡ������֧�֣���Ҫ�ο� Sizzle �Ĵ��룬��ȥ���˶Է� Grade A ���������֧�֣�
 *
 * 2010.03
 *  - ����ԭ�� dom ������ api: S.query ��������; S.get ���ص�һ����
 *    ���� Node �� api: S.one, �� Node ��ʵ�֡�
 *    ���� NodeList �� api: S.all, �� NodeList ��ʵ�֡�
 *    ͨ�� api �ķֲ㣬ͬʱ��������û��͸߼��û�������
 *
 * Bugs:
 *  - S.query('#test-data *') �ȴ� * �ŵ�ѡ�������� IE6 �·��ص�ֵ���ԡ�jQuery �����Ҳ�д� bug, ���졣
 *
 * References:
 *  - http://ejohn.org/blog/selectors-that-people-actually-use/
 *  - http://ejohn.org/blog/thoughts-on-queryselectorall/
 *  - MDC: querySelector, querySelectorAll, getElementsByClassName
 *  - Sizzle: http://github.com/jeresig/sizzle
 *  - MINI: http://james.padolsey.com/javascript/mini/
 *  - Peppy: http://jamesdonaghue.com/?p=40
 *  - Sly: http://github.com/digitarald/sly
 *  - XPath, TreeWalker��http://www.cnblogs.com/rubylouvre/archive/2009/07/24/1529640.html
 *
 *  - http://www.quirksmode.org/blog/archives/2006/01/contains_for_mo.html
 *  - http://www.quirksmode.org/dom/getElementsByTagNames.html
 *  - http://ejohn.org/blog/comparing-document-position/
 *  - http://github.com/jeresig/sizzle/blob/master/sizzle.js
 */
/**
 * @module  dom-base
 * @author  lifesinger@gmail.com
 */

KISSY.add('dom-base', function(S, undefined) {

    var doc = document,
        docElement = doc.documentElement,
        TEXT = docElement.textContent !== undefined ? 'textContent' : 'innerText',
        ua = S.UA,
        ie = ua.ie,
        oldIE = ie && ie < 8,
        CUSTOM_ATTRS = {
            readonly: 'readOnly'
        },
        RE_SPECIAL_ATTRS = /href|src|style/,
        RE_NORMALIZED_ATTRS = /href|src|colspan|rowspan/,
        RE_RETURN = /\r/g,
        RE_RADIO_CHECK = /radio|checkbox/,
        defaultFrag = doc.createElement('DIV'),
        RE_TAG = /^[a-z]+$/i;

    if(oldIE) {
        S.mix(CUSTOM_ATTRS, {
            'for': 'htmlFor',
            'class': 'className'
        });
    }

    S.DOM = {

        /**
         * Returns a NodeList that matches the selector.
         */
        query: S.query,

        /**
         * Returns the first element that matches the selector.
         */
        get: S.get,

        /**
         * Gets or sets the attribute of the HTMLElement.
         */
        attr: function(el, name, val) {
            // don't set attributes on element nodes
            if (!el || el.nodeType !== 1) {
                return undefined;
            }

            var ret;
            name = name.toLowerCase();
            name = CUSTOM_ATTRS[name] || name;

            // get attribute
            if (val === undefined) {
                // ������ el[name] ��ȡ mapping ����ֵ��
                //  - ������ȷ��ȡ readonly, checked, selected ������ mapping ����ֵ
                //  - ���Ի�ȡ�� getAttribute ��һ���ܻ�ȡ����ֵ������ tabindex Ĭ��ֵ
                //  - href, src ֱ�ӻ�ȡ���� normalized ���ֵ���ų���
                if(!RE_SPECIAL_ATTRS.test(name)) {
                    ret = el[name];
                }
                // get style
                else if(name === 'style') {
                    ret = el.style.cssText;
                }
                
                // �� getAttribute ��ȡ�� mapping ���Ժ� href, src ��ֵ��
                if(ret === undefined) {
                    ret = el.getAttribute(name);
                }

                // fix ie bugs:
                if (oldIE && RE_NORMALIZED_ATTRS.test(name)) {
                    // ������ href, src, ���� rowspan �ȷ� mapping ���ԣ�Ҳ��Ҫ�õ� 2 ����������ȡԭʼֵ
                    ret = el.getAttribute(name, 2);
                }

                // ���ڲ����ڵ����ԣ�ͳһ���� undefined
                return ret === null ? undefined : ret;
            }

            // set attribute
            if(name === 'style') {
                el.style.cssText = val;
            }
            else {
                // convert the value to a string (all browsers do this but IE)
                el.setAttribute(name, '' + val);
            }
        },

        /**
         * Removes the attribute of the HTMLElement.
         */
        removeAttr: function(el, name) {
            if(el && el.nodeType === 1) {
                el.removeAttribute(name);
            }
        },

        /**
         * Get the current value of the HTMLElement.
         */
        val: function(el, value) {
            if(!el || el.nodeType !== 1) {
                return undefined;
            }

            // get value
            if(value === undefined) {

                // ��û���趨 value ʱ����׼����� option.value == option.text
                // ie7- �� optinos.value == '', ��Ҫ�� el.attributes.value ���ж��Ƿ����趨 value
                if(nodeNameIs('option', el)) {
                    return (el.attributes.value || {}).specified ? el.value : el.text;
                }

                // ���� select, �ر��� multiple type, ���ں����صļ���������
                if(nodeNameIs('select', el)) {
                    var index = el.selectedIndex,
                        options = el.options;

                    if (index < 0) {
                        return null;
                    }
                    else if(el.type === 'select-one') {
                        return S.DOM.val(options[index]);
                    }

                    // Loop through all the selected options
                    var ret = [], i = 0, len = options.length;
                    for (; i < len; ++i) {
                        if (options[i].selected) {
                            ret.push(S.DOM.val(options[i]));
                        }
                    }
                    // Multi-Selects return an array
                    return ret;
                }

                // Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
                if(ua.webkit && RE_RADIO_CHECK.test(el.type)) {
                    return el.getAttribute('value') === null ? 'on' : el.value;
                }

                // ��ͨԪ�ص� value, ��һ���� \r
                return (el.value || '').replace(RE_RETURN, '');
            }

            // set value
            if (nodeNameIs('select', el)) {
                var vals = S.makeArray(value),
                    opts = el.options, opt;

                for (i = 0,len = opts.length; i < len; ++i) {
                    opt = opts[i];
                    opt.selected = S.inArray(S.DOM.val(opt), vals);
                }

                if (!vals.length) {
                    el.selectedIndex = -1;
                }
            }
            else {
                el.value = value;
            }
        },

        /**
         * Gets or sets styles on the HTMLElement.
         */
        css: function(el, prop, val) {
            // get style
            if(val === undefined) {
                return el.style[prop];
            }

            // set style
            S.each(S.makeArray(el), function(elem) {
                elem.style[prop] = val;
            });

            // TODO:
            //  - ���Ǹ��ּ�����������쳣��� opacity, z-index, float
            //  - more test cases
        },

        /**
         * Gets or sets the the text content of the HTMLElement.
         */
        text: function(el, val) {
            // getText
            if (val === undefined) {
                return (el || {})[TEXT] || '';
            }

            // setText
            if (el) {
                el[TEXT] = val;
            }
        },

        /**
         * Gets the HTML contents of the HTMLElement.
         */
        html: function(el, htmlString) {
            // set html
            if(htmlString === undefined) {
                return el.innerHTML;
            }

            // get html
            el.innerHTML = htmlString;

            // TODO:
            //  - ���Ǹ��ּ��ݺ��쳣����ӷ�����
        },

        /**
         * Gets the children of the HTMLElement.
         */
        children: function(el) {
            if(el.children) { // ֻ�� firefox �ĵͰ汾��֧��
                return S.makeArray(el.children);
            }
            return getSiblings(el.firstChild);
        },

        /**
         * Gets the siblings of the HTMLElment.
         */
        siblings: function(el) {
            return getSiblings(el.parentNode.firstChild, el);
        },

        /**
         * Gets the immediately following sibling of the element.
         */
        next: function(el) {
            return nth(el, 1, 'nextSibling');
        },

        /**
         * Gets the immediately preceding sibling of the element.
         */
        prev: function(el) {
            return nth(el, 1, 'previousSibling');
        },

        /**
         * Gets the parentNode of the elment.
         */
        parent: function(el) {
            var parent = el.parentNode;
            return parent && parent.nodeType !== 11 ? parent : null;
        },

        /**
         * Creates a new HTMLElement using the provided html string.
         */
        create: function(html, ownerDoc) {
            if (typeof html === 'string') {
                html = S.trim(html); // match IE which trims whitespace from innerHTML
            }

            // simple tag
            if(RE_TAG.test(html)) {
                return (ownerDoc || doc).createElement(html);
            }
            
            var ret = null, nodes, frag;

            frag = ownerDoc ? ownerDoc.createElement('DIV') : defaultFrag;
            frag.innerHTML = html;
            nodes = frag.childNodes;

            if(nodes.length === 1) {
                // return single node, breaking parentNode ref from "fragment"
                ret = nodes[0].parentNode.removeChild(nodes[0]);
            }
            else {
                ret = nl2frag(nodes, ownerDoc || doc);
            }

            return ret;
        },

        /**
         * Creates a stylesheet from a text blob of rules.
         * These rules will be wrapped in a STYLE tag and appended to the HEAD of the document.
         * @param {String} cssText The text containing the css rules
         * @param {String} id An id to add to the stylesheet for later removal
         */
        addStyleSheet: function(cssText, id) {
            var head = doc.getElementsByTagName('head')[0],
                el = doc.createElement('style');

            id && (el.id = id);
            head.appendChild(el); // ����ӵ� DOM ���У������� cssText ��� hack ��ʧЧ

            if (el.styleSheet) { // IE
                el.styleSheet.cssText = cssText;
            } else { // W3C
                el.appendChild(doc.createTextNode(cssText));
            }
        }
    };

    // �ж� el �� nodeName �Ƿ�ָ��ֵ
    function nodeNameIs(val, el) {
        return el && el.nodeName.toUpperCase() === val.toUpperCase();
    }

    // ��ȡԪ�� el ������ siblings
    function getSiblings(n/* first */, el) {
        for (var r = [], j = 0; n; n = n.nextSibling) {
            if (n.nodeType === 1 && n !== el) {
                r[j++] = n;
            }
        }
        return r;
    }

    // ��ȡԪ�� el �� dir(ection) �ϵĵ� n ��Ԫ��
    function nth(el, n, dir) {
        n = n || 0;
        for (var i = 0; el; el = el[dir]) {
            if (el.nodeType === 1 && i++ === n) {
                break;
            }
        }
        return el;
    }

    // �� nodeList ת��Ϊ fragment
    function nl2frag(nodes, ownerDoc) {
        var ret = null, i, len;

        if (nodes && (nodes.push || nodes.item) && nodes[0]) {
            ownerDoc = ownerDoc || nodes[0].ownerDocument;
            ret = ownerDoc.createDocumentFragment();

            if (nodes.item) { // convert live list to static array
                nodes = S.makeArray(nodes);
            }

            for (i = 0, len = nodes.length; i < len; ++i) {
                ret.appendChild(nodes[i]);
            }
        }
        // else inline with log for minification
        else {
            S.error('unable to convert ' + nodes + ' to fragment');
        }

        return ret;
    }
});

/**
 * Notes:
 *
 * 2010.03
 *  ~ attr:
 *    - �� jquery/support.js �У�special attrs �ﻹ�� maxlength, cellspacing,
 *      rowspan, colspan, useap, frameboder, �����Է��֣��� Grade-A ���������
 *      ���޼��������⡣
 *    - �� colspan/rowspan ����ֵ��������ʱ��ie7- ���Զ��������� href һ������Ҫ����
 *      �� 2 �������������jQuery δ���ǣ����ڼ����� bug.
 *    - jQuery ������δ��ʽ�趨 tabindex ʱ�����ļ������⣬kissy ����ԣ�̫�������ˣ�
 *    - jquery/attributes.js: Safari mis-reports the default selected
 *      property of an option �� Safari 4 �����޸�
 *
 * TODO:
 *  - create �Ľ�һ�����ƣ����� cache, �� table, form Ԫ�ص�֧�ֵȵ�
 *//**
 * @module  dom-class
 * @author  lifesinger@gmail.com
 * @depends kissy, dom-base
 */

KISSY.add('dom-class', function(S, undefined) {

    var SPACE = ' ',
        DOM = S.DOM;

    S.mix(DOM, {

        /**
         * Determines whether a HTMLElement has the given className.
         */
        hasClass: function(el, className) {
            if (!className || !el || !el.className) return false;

            return (SPACE + el.className + SPACE).indexOf(SPACE + className + SPACE) > -1;
        },

        /**
         * Adds a given className to a HTMLElement.
         */
        addClass: function(el, className) {
            if(batch(el, addClass, DOM, className)) return;
            if (!className || !el) return;
            if (hasClass(el, className)) return;

            el.className += SPACE + className;
        },

        /**
         * Removes a given className from a HTMLElement.
         */
        removeClass: function(el, className) {
            if(batch(el, removeClass, DOM, className)) return;
            if (!hasClass(el, className)) return;

            el.className = (SPACE + el.className + SPACE).replace(SPACE + className + SPACE, SPACE);
            if (hasClass(el, className)) {
                removeClass(el, className);
            }
        },

        /**
         * Replace a class with another class for a given element.
         * If no oldClassName is present, the newClassName is simply added.
         */
        replaceClass: function(el, oldC, newC) {
            removeClass(el, oldC);
            addClass(el, newC);
        },

        /**
         * If the className exists on the node it is removed, if it doesn't exist it is added.
         * @param {boolean} force addClass optional boolean to indicate whether class
         * should be added or removed regardless of current state.
         */
        toggleClass: function(el, className, force) {
            if(batch(el, DOM.toggleClass, DOM, className, force)) return;

            var add = (force !== undefined) ? force :
                      !(hasClass(el, className));

            if (add) {
                addClass(el, className);
            } else {
                removeClass(el, className);
            }
        }
    });

    function batch(arr, method, context) {
        if (S.isArray(arr)) {
            S.each(arr, function(item) {
                method.apply(context, Array.prototype.slice.call(arguments, 3));
            });
            return true;
        }
    }

    // for quick access
    var hasClass = DOM.hasClass,
        addClass = DOM.addClass,
        removeClass = DOM.removeClass;
});

/**
 * TODO:
 *   - hasClass needs batch?
 *//*
Copyright 2010, KISSY UI Library v1.0.5
MIT Licensed
build: 527 Apr 6 22:39
*/
/**
 * @module  event
 * @author  lifesinger@gmail.com
 */

KISSY.add('event', function(S, undefined) {

    var DOM = S.DOM,
        win = window,
        doc = document,
        simpleAdd = doc.addEventListener ?
                    function(el, type, fn) {
                        if (el.addEventListener) {
                            el.addEventListener(type, fn, false);
                        }
                    } :
                    function(el, type, fn) {
                        if (el.attachEvent) {
                            el.attachEvent('on' + type, fn);
                        }
                    },
        simpleRemove = doc.removeEventListener ?
                       function(el, type, fn) {
                           if (el.removeEventListener) {
                               el.removeEventListener(type, fn, false);
                           }
                       } :
                       function(el, type, fn) {
                           if (el.detachEvent) {
                               el.detachEvent('on' + type, fn);
                           }
                       },
        EVENT_GUID = 'data-ks-event-guid',
        SPACE = ' ',
        guid = S.now(),
        // { id: { target: el, events: { type: { handle: obj, listeners: [...] } } }, ... }
        cache = { };

    var Event = {

        // such as: { 'mouseenter' : { fix: 'mouseover', handle: fn } }
        special: { },

        /**
         * Adds an event listener
         *
         * @param {String} target An element or custom EventTarget to assign the listener to
         * @param {String} type The type of event to append
         * @param {Function} fn The event handler
         */
        add: function(target, type, fn) {
            // ([targetA, targetB], 'click focus', fn)
            if(batch('add', target, type, fn)) return;

            var id = getID(target),
                special, events, eventHandle;

            // ������Ч�� target �� ��������
            if(id === -1 || !type || !S.isFunction(fn)) return;

            // ��û����ӹ��κ��¼�
            if (!id) {
                setID(target, (id = guid++));
                cache[id] = {
                    target: target,
                    events: { }
                };
            }

            // û����ӹ��������¼�
            events = cache[id].events;
            special = (!target.isCustomEventTarget && Event.special[type]) || { }; // special ����� element
            if (!events[type]) {
                eventHandle = function(event, eventData) {
                    if (!event || !event.fixed) {
                        event = new S.EventObject(target, event, type);

                        if(S.isPlainObject(eventData)) {
                            S.mix(event, eventData);
                        }
                    }

                    if(special.setup) {
                        special.setup(event);
                    }

                    return (special.handle || Event._handle)(target, event, events[type].listeners);
                };

                events[type] = {
                    handle: eventHandle,
                    listeners: []
                };

                if(!target.isCustomEventTarget) {
                    simpleAdd(target, special.fix || type, eventHandle);
                }
                else if(target._addEvent) { // such as Node
                    target._addEvent(type, eventHandle);
                }
            }

            // ���� listener
            events[type].listeners.push(fn);
        },

        /**
         * Detach an event or set of events from an element.
         */
        remove: function(target, type /* optional */, fn /* optional */) {
            // ([targetA, targetB], 'click focus', fn)
            if(batch('remove', target, type, fn)) return;

            var id = getID(target),
                events, eventsType, listeners,
                i, len, c, t;

            if (id === -1) return; // ������Ч�� target
            if(!id || !(c = cache[id])) return; // �� cache
            if(c.target !== target) return; // target ��ƥ��
            events = c.events || { };

            if((eventsType = events[type])) {
                listeners = eventsType.listeners;
                len = listeners.length;

                // �Ƴ� fn
                if(S.isFunction(fn) && len && S.inArray(fn, listeners)) {
                    t = [];
                    for(i = 0; i < len; ++i) {
                        if(fn !== listeners[i]) {
                            t.push(listeners[i]);
                        }
                    }
                    listeners = t;
                    len = t.length;
                }

                // remove(el, type)or fn ���Ƴ���
                if(fn === undefined || len === 0) {
                    if(!target.isCustomEventTarget) {
                        simpleRemove(target, type, eventsType.handle);
                    }
                    delete cache[id].type;
                }
            }

            // remove(el) or type ���Ƴ���
            if(type === undefined || S.isEmptyObject(events)) {
                for(type in events) {
                    Event.remove(target, type);
                }
                delete cache[id];
                removeID(target);
            }
        },

        // static
        _handle: function(target, event, listeners) {
            var ret, i = 0, len = listeners.length;

            for (; i < len; ++i) {
                ret = listeners[i].call(target, event);

                if (event.isImmediatePropagationStopped) {
                    break;
                }

                if (ret === false) {
                    event.halt();
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

    function batch(methodName, targets, types, fn) {

        // on([targetA, targetB], type, fn)
        if (S.isArray(targets)) {
            S.each(targets, function(target) {
                Event[methodName](target, types, fn);
            });
            return true;
        }

        // on(target, 'click focus', fn)
        if ((types = S.trim(types)) && types.indexOf(SPACE) > 0) {
            S.each(types.split(SPACE), function(type) {
                Event[methodName](targets, type, fn);
            });
            return true;
        }
    }

    function getID(target) {
        var ret = -1;

        // text and comment node
        if (target.nodeType === 3 || target.nodeType === 8) {
            return ret;
        }

        if (target.nodeType) { // HTML Element
            ret = DOM.attr(target, EVENT_GUID);
        }
        else if (target.isCustomEventTarget) { // custom EventTarget
            ret = target.eventTargetId;
        }
        else { // window, iframe, etc.
            ret = target[EVENT_GUID];
        }

        return ret;
    }

    function setID(target, id) {
        if (target.nodeType) { // HTML Element
            DOM.attr(target, EVENT_GUID, id);
        }
        else if (target.isCustomEventTarget) { // custom EventTarget
            target.eventTargetId = id;
        }
        else { // window, iframe, etc.
            try {
                target[EVENT_GUID] = id;
            } catch(e) {
                S.error(e);
            }
        }
    }

    function removeID(target) {
        if (target.nodeType) { // HTML Element
            DOM.removeAttr(target, EVENT_GUID);
        }
        else if (target.isCustomEventTarget) { // custom EventTarget
            target.eventTargetId = undefined;
        }
        else { // window, iframe, etc
            target[EVENT_GUID] = undefined;
        }
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
                    } catch(e) {
                    }
                }
            }
        });
    }
});

/**
 * TODO:
 *   - �о� jq �� expando cache ��ʽ
 *   - event || window.event, ʲô�����ȡ window.event ? IE4 ?
 *   - ���꾡ϸ�µ� test cases
 *   - �ڴ�й©����
 *   - target Ϊ window, iframe ���������ʱ�� test case
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

        if (domEvent) { // element
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
 * Notes:
 *  2010.04
 *   - http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
 *
 * TODO:
 *   - pageX, clientX, scrollLeft, clientLeft ����ϸͼ��
 */
/**
 * @module  EventTarget
 * @author  lifesinger@gmail.com
 */

KISSY.add('event-target', function(S, undefined) {

    var Event = S.Event;

    /**
     * EventTarget provides the implementation for any object to publish,
     * subscribe and fire to custom events.
     */
    S.EventTarget = {

        eventTargetId: undefined,

        isCustomEventTarget: true,

        fire: function(type, eventData) {
            var id = this.eventTargetId || -1,
                cache = Event._getCache(id) || { },
                events = cache.events || { },
                t = events[type];

            if(t && S.isFunction(t.handle)) {
                t.handle(undefined, eventData);
            }
        },

        on: function(type, fn) {
            Event.add(this, type, fn);
        },

        detach: function(type, fn) {
            Event.remove(this, type, fn);
        }
    };
});

/**
 * Notes:
 *  2010.04
 *   - ��ʼ���� api: publish, fire, on, detach. ʵ��ʵ��ʱ���֣�publish �ǲ���Ҫ
 *     �ģ�on ʱ���Զ� publish. api ��Ϊ������/����/������
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
 *  - ie6 �£�ԭ���� mouseenter/leave ò��Ҳ�� bug, ���� <div><div /><div /><div /></div>, jQuery Ҳ�쳣��
 *    ��Ҫ��һ���о�
 *//*
Copyright 2010, KISSY UI Library v1.0.5
MIT Licensed
build: 548 Apr 9 23:53
*/
/**
 * @module  node
 * @author  lifesinger@gmail.com
 */

KISSY.add('node', function(S) {

    var DOM = S.DOM,
        NP = Node.prototype;

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

        // handle Node(HTMLElement)
        if (html.nodeType) {
            domNode = html;
        }
        else if (typeof html === 'string') {
            domNode = DOM.create(html, ownerDocument);
        }

        if (props) {
            S.error('not implemented'); // TODO
        }

        self[0] = domNode;
    }

    // import dom methods
    S.each(['attr', 'removeAttr', 'css'],
        function(methodName) {
            NP[methodName] = function(name, val) {
                var domNode = this[0];
                if(val === undefined) {
                    return DOM[methodName](domNode, name);
                } else {
                    DOM[methodName](domNode, name, val);
                    return this;
                }
            }
        });

    S.each(['val', 'text', 'html'],
            function(methodName) {
                NP[methodName] = function(val) {
                    var domNode = this[0];
                    if(val === undefined) {
                        return DOM[methodName](domNode);
                    } else {
                        DOM[methodName](domNode, val);
                        return this;
                    }
                }
            });

    S.each(['children', 'siblings', 'next', 'prev', 'parent'],
        function(methodName) {
            NP[methodName] = function() {
                var ret = DOM[methodName](this[0]);
                return ret ? new S[ret.length ? 'NodeList' : 'Node'](ret) : null;
            }
        });

    S.each(['hasClass', 'addClass', 'removeClass', 'replaceClass', 'toggleClass'],
        function(methodName) {
            NP[methodName] = function() {
                var ret = DOM[methodName].apply(DOM, [this[0]].concat(S.makeArray(arguments)));
                // ֻ�� hasClass �з���ֵ
                return typeof ret === 'boolean' ? ret : this;
            }
        });

    // import event methods
    S.mix(NP, S.EventTarget);
    NP._addEvent = function(type, handle) {
        S.Event._simpleAdd(this[0], type, handle);
    };
    delete NP.fire;    

    // add more methods
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
        },

        /**
         * Insert the element to the end of the parent.
         */
        appendTo: function(parent) {
            if((parent = S.get(parent)) && parent.appendChild) {
                parent.appendChild(this[0]);
            }
            return this;
        }
    });

    // query api
    S.one = function(selector, context) {
        return new Node(S.get(selector, context));
    };

    S.Node = Node;
});

/**
 * TODO:
 *   - append/appendTo, insertBefore/insertAfter, after/before �Ȳ�����ʵ�ֺͲ���
 */
/**
 * @module  nodelist
 * @author  lifesinger@gmail.com
 * @depends kissy, dom
 */

KISSY.add('nodelist', function(S) {

    var DOM = S.DOM,
        push = Array.prototype.push,
        NP = NodeList.prototype;

    /**
     * The NodeList class provides a wrapper for manipulating DOM NodeList.
     */
    function NodeList(domNodes) {
        // factory or constructor
        if (!(this instanceof NodeList)) {
            return new NodeList(domNodes);
        }

        // push nodes
        push.apply(this, domNodes || []);
    }

    S.mix(NP, {

        /**
         * Ĭ�ϳ���Ϊ 0
         */
        length: 0,

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
 *   - each �������� fn �� this, �� jQuery ��ָ��ԭ�������������Ա����������⡣
 *     �����û��ǶȽ���this �ĵ�һֱ���� $(this), kissy �� yui3 ����һ�£�����
 *     ���ܣ�һ������Ϊ�ס�
 *   - ���� each �������ƺ�������Ҫ import ���� dom ���������岻��
 *   - dom �ǵͼ� api, node ���м� api, ���Ƿֲ��һ��ԭ�򡣻���һ��ԭ���ǣ����
 *     ֱ���� node ��ʵ�� dom �������򲻴�ý� dom �ķ�����ϵ� nodelist ���
 *     ��˵�������ɱ�����Լ api ��ơ�
 *
 */