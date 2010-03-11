/*
Copyright 2010, KISSY UI Library v1.0.4
MIT Licensed
build: 481 Mar 11 14:28
*/
/*
Copyright 2010, KISSY UI Library v1.0.4
MIT Licensed
build: 480 Mar 11 14:06
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
        AP = Array.prototype,
        forEach = AP.forEach,
        indexOf = AP.indexOf,
        REG_TRIM = /^\s+|\s+$/g,

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
        version: '1.0.4',

        /**
         * Initializes KISSY object.
         * @private
         */
        _init: function() {
            this.Env = {
                mods: {}
            };

            this.Config = {
                debug: true
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
         * @param {function} s  the object that supplies the properties to augment
         * @param {string[]} wl a whitelist
         * @return {object} the augmented object
         */
        augment: function(r, s, ov, wl) {
            return mix(r.prototype, s.prototype, ov, wl);
        },

        /**
         * Execute the supplied method after the specified function.
         * @param {function} fn the function to execute
         * @param {string} when before or after
         * @param {object} obj the object hosting the method to displace
         * @param {string} sFn the name of the method to displace
         */
        weave: function(fn, when, obj, sFn) {
            var arr = [obj[sFn], fn];
            if (when === 'before') arr.reverse();

            obj[sFn] = function() {
                for (var i = 0, ret; i < 2; ++i) {
                    ret = arr[i].apply(this, arguments);
                }
                return ret;
            };
            return this;
        },

        /**
         * Clones KISSY to another global object.
         * <pre>
         * S.cloneTo('TB');
         * </pre>
         * @return {object}  A reference to the clone object
         */
        cloneTo: function(name) {
            var O = win[name] || {};

            mix(O, this);
            O._init();
            mix(O.Env.mods, this.Env.mods);

            return (win[name] = O);
        },

        /**
         * Returns the namespace specified and creates it if it doesn't exist. Be careful
         * when naming packages. Reserved words may work in some browsers and not others.
         * <pre>
         * S.namespace('KISSY.app'); // returns KISSY.app
         * S.namespace('app.Shop'); // returns KISSY.app.Shop
         * S.cloneTo('TB');
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
         * Report the index of some elements in the array.
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
         * Prints debug info.
         * @param {string} msg The message to log.
         * @param {string} cat The log category for the message. Default
         * categories are "info", "warn", "error", time" etc.
         * @param {string} src The source of the the message (opt)
         * @return {KISSY}
         */
        log: function(msg, cat, src) {
            var c = this.Config;

            if (c.debug) {
                src && (msg = src + ': ' + msg);
                if (win.console !== undefined && console.log) {
                    console[cat && console[cat] ? cat : 'log'](msg);
                }
            }

            return this;
        }
    });

    S._init();

})(window, 'KISSY');

/**
 * Notes:
 *
 * 2010.01
 *  - ���Ǽ򵥹��ú� 2/8 ԭ��ȥ���˶� YUI3 ɳ���ģ�⣨archives/2009 r402��
 *
 *  - add ���������ڲ�����Ļ�����֯��ʽ���� module �� submodule ��֯���룩��
 *  - ready ���������ⲿ����Ļ������÷�ʽ���ṩ��һ���򵥵���ɳ�䡣
 *  - mix, merge, extend, augment, weave ������������������Ļ���ʵ�ַ�ʽ��
 *    ������� mixin ���Ժ� prototype ��ʽ��ʵ�ִ��롣
 *  - cloneTo, namespace �����������ӿ��ʵ�ֺʹ����������֯��
 *  - each, indexOf, trim ��������ԭ�� JS ����ǿ��
 *  - log �������򵥵ĵ��Թ��ߡ�
 * 
 *  - �������ܣ�each, indexOf, trim ��������ԭ��������
 *  - ���Ǽ򵥹��ã�ȥ�� indexOf �� fromIndex ��֧�֡�
 *
 *  - �ַ���������� trim, each �ȷ��������Կ������� S.query() �ķ�ʽ������Ҫ
 *    ������ԭ��������ϡ����뷨����ϸȨ�⣬������
 */
/*
Copyright 2010, KISSY UI Library v1.0.4
MIT Licensed
build: 480 Mar 11 14:06
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
            ret = makeArray(ret);
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

    // �� NodeList ת��Ϊ��ͨ����
    function makeArray(nodeList) {
        return Array.prototype.slice.call(nodeList);
    }
    // ie ��֧���� slice ת�� NodeList, ��������ͨ����
    try {
        makeArray(doc.documentElement.childNodes);
    }
    catch(e) {
        makeArray = function(nodeList) {
            var ret = [], i = 0, len = nodeList.length;
            for (; i < len; ++i) {
                ret[i] = nodeList[i];
            }
            return ret;
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
/*
Copyright 2010, KISSY UI Library v1.0.4
MIT Licensed
build: 480 Mar 11 14:06
*/
/**
 * @module  dom-base
 * @author  lifesinger@gmail.com
 * @depends kissy, selector
 */

KISSY.add('dom-base', function(S, undefined) {

    var doc = document,
        docElement = doc.documentElement,
        TEXT = docElement.textContent !== undefined ? 'textContent' : 'innerText',
        CUSTOM_ATTRIBUTES = (!docElement.hasAttribute) ? { // IE < 8
                'for': 'htmlFor',
                'class': 'className'
            } : { },
        SPACE = ' ';

    S.Dom = {

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
            name = CUSTOM_ATTRIBUTES[name] || name;

            if (el && el.getAttribute) {
                // getAttr
                if (val === undefined) {
                    return el.getAttribute(attr) || ''; // '' is added per DOM spec.
                }
                // setAttr
                el.setAttribute(attr, val);
            }
        },

        /**
         * Removes the attribute of the HTMLElement.
         */
        removeAttr: function(el, name) {
            if(el & el.removeAttribute) {
                el.removeAttribute(name);
            }
        },

        /**
         * Determines whether a HTMLElement has the given className.
         */
        hasClass: function(el, className) {
            if (!className || !el.className) return false;

            return (SPACE + el.className + SPACE).indexOf(SPACE + className + SPACE) > -1;
        },

        /**
         * Adds a given className to a HTMLElement.
         */
        addClass: function(el, className) {
            if (!className) return;
            if (hasClass(el, className)) return;

            el.className += SPACE + className;
        },

        /**
         * Removes a given className from a HTMLElement.
         */
        removeClass: function(el, className) {
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
            var add = (force !== undefined) ? force :
                      !(hasClass(el, className));

            if (add) {
                addClass(el, className);
            } else {
                removeClass(el, className);
            }
        },

        /**
         * Gets or sets styles on the HTMLElement.
         */
        css: function(el, prop, val) {
            // TODO
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
         * Get the HTML contents of the HTMLElement.
         */
        html: function(el, htmlString) {
            // TODO
        },

        /**
         * Get the current value of the HTMLElement.
         */
        val: function(el, value) {
            // TODO
        },

        /**
         * Creates a new HTMLElement using the provided html string.
         */
        create: function(htmlString, ownerDocument) {
            // TODO
        }
    };

    // for quick access
    var hasClass = S.Dom.hasClass,
        addClass = S.Dom.addClass,
        removeClass = S.Dom.removeClass;
});
/*
Copyright 2010, KISSY UI Library v1.0.4
MIT Licensed
build: 480 Mar 11 14:06
*/
/**
 * �����ӳټ������
 * ���� img, textarea, �Լ��ض�Ԫ�ؼ�������ʱ�Ļص�����
 * @module      datalazyload
 * @creator     ��<lifesinger@gmail.com>
 * @depends     kissy, yahoo-dom-event
 */
KISSY.add('datalazyload', function(S, undefined) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = YAHOO.lang,
        win = window, doc = document,
        IMG_DATA_SRC = 'data-lazyload-src',
        TEXTAREA_DATA_CLS = 'ks-datalazyload',
        CUSTOM_IMG_DATA_SRC = IMG_DATA_SRC + '-custom',
        CUSTOM_TEXTAREA_DATA_CLS = TEXTAREA_DATA_CLS + '-custom',
        MOD = { AUTO: 'auto', MANUAL: 'manual' },
        DEFAULT = 'default', NONE = 'none',

        defaultConfig = {

            /**
             * ������ģʽ
             *   auto   - �Զ�����html ���ʱ������ img.src ���κδ���
             *   manual - ��� html ʱ���Ѿ�����Ҫ�ӳټ��ص�ͼƬ�� src �����滻Ϊ IMG_DATA_SRC
             * ע������ textarea ���ݣ�ֻ���ֶ�ģʽ
             */
            mod: MOD.MANUAL,

            /**
             * ��ǰ�Ӵ����£�diff px ��� img/textarea �ӳټ���
             * �ʵ����ô�ֵ���������û����϶�ʱ�о������Ѿ����غ�
             * Ĭ��Ϊ��ǰ�Ӵ��߶ȣ���������Ĳ��ӳټ��أ�
             */
            diff: DEFAULT,

            /**
             * ͼ���ռλͼ
             */
            placeholder: 'http://a.tbcdn.cn/kissy/1.0.4/build/datalazyload/dot.gif'
        };

    /**
     * �ӳټ������
     * @constructor
     */
    function DataLazyload(containers, config) {
        var self = this;

        // factory or constructor
        if (!(self instanceof DataLazyload)) {
            return new DataLazyload(containers, config);
        }

        // ��������� config һ������
        if (config === undefined) {
            config = containers;
            containers = [doc];
        }

        // containers ��һ�� HTMLElement ʱ
        if (!Lang.isArray(containers)) {
            containers = [Dom.get(containers) || doc];
        }

        /**
         * ͼƬ�������������Զ������Ĭ��Ϊ [doc]
         * @type Array
         */
        self.containers = containers;

        /**
         * ���ò���
         * @type Object
         */
        self.config = S.merge(defaultConfig, config || {});

        /**
         * ��Ҫ�ӳ����ص�ͼƬ
         * @type Array
         */
        //self.images

        /**
         * ��Ҫ�ӳٴ���� textarea
         * @type Array
         */
        //self.areaes

        /**
         * ���ӳ���󶨵Ļص�����
         * @type object
         */
        self.callbacks = {els: [], fns: []};

        /**
         * ��ʼ�ӳٵ� Y ����
         * @type number
         */
        //self.threshold

        self._init();
    }

    S.mix(DataLazyload.prototype, {

        /**
         * ��ʼ��
         * @protected
         */
        _init: function() {
            var self = this;

            self.threshold = self._getThreshold();
            self._filterItems();

            if (self._getItemsLength()) {
                self._initLoadEvent();
            }
        },

        /**
         * ��ʼ�������¼�
         * @protected
         */
        _initLoadEvent: function() {
            var timer, self = this;

            // scroll �� resize ʱ������ͼƬ
            Event.on(win, 'scroll', loader);
            Event.on(win, 'resize', function() {
                self.threshold = self._getThreshold();
                loader();
            });

            // ��Ҫ��������һ�Σ��Ա�֤��һ�����ӳ���ɼ�
            if (self._getItemsLength()) {
                Event.onDOMReady(function() {
                    loadItems();
                });
            }

            // ���غ���
            function loader() {
                if (timer) return;
                timer = setTimeout(function() {
                    loadItems();
                    timer = null;
                }, 100); // 0.1s �ڣ��û��о�����
            }

            // �����ӳ���
            function loadItems() {
                self._loadItems();

                if (self._getItemsLength() === 0) {
                    Event.removeListener(win, 'scroll', loader);
                    Event.removeListener(win, 'resize', loader);
                }
            }
        },

        /**
         * ��ȡ����ʼ����Ҫ�ӳٵ� img �� textarea
         * @protected
         */
        _filterItems: function() {
            var self = this,
                containers = self.containers,
                threshold = self.threshold,
                placeholder = self.config.placeholder,
                isManualMod = self.config.mod === MOD.MANUAL,
                n, N, imgs, areaes, i, len, img, area, data_src,
                lazyImgs = [], lazyAreaes = [];

            for (n = 0,N = containers.length; n < N; ++n) {
                imgs = containers[n].getElementsByTagName('img');

                for (i = 0,len = imgs.length; i < len; ++i) {
                    img = imgs[i];
                    data_src = img.getAttribute(IMG_DATA_SRC);

                    if (isManualMod) { // �ֹ�ģʽ��ֻ������ data-src ��ͼƬ
                        if (data_src) {
                            img.src = placeholder;
                            lazyImgs.push(img);
                        }
                    } else { // �Զ�ģʽ��ֻ���� threshold ���� data-src ��ͼƬ
                        // ע�⣺���� data-src ���������������ʵ����������ظ�����
                        // �ᵼ�� data-src ��� placeholder
                        if (Dom.getY(img) > threshold && !data_src) {
                            img.setAttribute(IMG_DATA_SRC, img.src);
                            img.src = placeholder;
                            lazyImgs.push(img);
                        }
                    }
                }

                // ���� textarea
                areaes = containers[n].getElementsByTagName('textarea');
                for (i = 0,len = areaes.length; i < len; ++i) {
                    area = areaes[i];
                    if (Dom.hasClass(area, TEXTAREA_DATA_CLS)) {
                        lazyAreaes.push(area);
                    }
                }
            }

            self.images = lazyImgs;
            self.areaes = lazyAreaes;
        },

        /**
         * �����ӳ���
         */
        _loadItems: function() {
            var self = this;

            self._loadImgs();
            self._loadAreaes();
            self._fireCallbacks();
        },

        /**
         * ����ͼƬ
         * @protected
         */
        _loadImgs: function() {
            var self = this,
                imgs = self.images,
                scrollTop = Dom.getDocumentScrollTop(),
                threshold = self.threshold + scrollTop,
                i, img, data_src, remain = [];

            for (i = 0; img = imgs[i++];) {
                if (Dom.getY(img) <= threshold) {
                    self._loadImgSrc(img);
                } else {
                    remain.push(img);
                }
            }

            self.images = remain;
        },

        /**
         * ����ͼƬ src
         * @static
         */
        _loadImgSrc: function(img, flag) {
            flag = flag || IMG_DATA_SRC;
            var data_src = img.getAttribute(flag);

            if (data_src && img.src != data_src) {
                img.src = data_src;
                img.removeAttribute(flag);
            }
        },

        /**
         * ���� textarea ����
         * @protected
         */
        _loadAreaes: function() {
            var self = this,
                areaes = self.areaes,
                scrollTop = Dom.getDocumentScrollTop(),
                threshold = self.threshold + scrollTop,
                i, area, parent, remain = [];

            for (i = 0; area = areaes[i++];) {
                parent = area.parentNode;
                // ע��area ���ܴ��� display: none ״̬��Dom.getY(area) ��ȡ���� Y ֵ
                //    ���������� area.parentNode
                if (Dom.getY(parent) <= threshold) {
                    self._loadDataFromArea(parent, area);
                } else {
                    remain.push(area);
                }
            }

            self.areaes = remain;
        },

        /**
         * �� textarea �м�������
         * @static
         */
        _loadDataFromArea: function(parent, area) {
            //parent.innerHTML = area.value; // ���ַ�ʽ�ᵼ�� chrome ���� bug

            // �������ز�ȥ����ʽ
            var content = document.createElement('DIV');
            content.innerHTML = area.value;
            area.style.display = NONE;
            area.className = ''; // clear hooks
            parent.appendChild(content);
        },

        /**
         * �����ص�
         * @protected
         */
        _fireCallbacks: function() {
            var self = this,
                callbacks = self.callbacks,
                els = callbacks.els, fns = callbacks.fns,
                scrollTop = Dom.getDocumentScrollTop(),
                threshold = self.threshold + scrollTop,
                i, el, fn, remainEls = [], remainFns = [];

            for (i = 0; (el = els[i]) && (fn = fns[i++]);) {
                if (Dom.getY(el) <= threshold) {
                    fn.call(el);
                } else {
                    remainEls.push(el);
                    remainFns.push(fn);
                }

            }

            callbacks.els = remainEls;
            callbacks.fns = remainFns;
        },

        /**
         * ��ӻص��������� el ������������ͼ��ʱ������ fn
         */
        addCallback: function(el, fn) {
            el = Dom.get(el);
            if (el && typeof fn === 'function') {
                this.callbacks.els.push(el);
                this.callbacks.fns.push(fn);
            }
        },

        /**
         * ��ȡ��ֵ
         * @protected
         */
        _getThreshold: function() {
            var diff = this.config.diff,
                ret = Dom.getViewportHeight();

            if (diff === DEFAULT) return 2 * ret; // diff Ĭ��Ϊ��ǰ�Ӵ��߶ȣ���������Ĳ��ӳټ��أ�
            else return ret + diff;
        },

        /**
         * ��ȡ��ǰ�ӳ��������
         * @protected
         */
        _getItemsLength: function() {
            var self = this;
            return self.images.length + self.areaes.length + self.callbacks.els.length;
        },

        /**
         * �����Զ����ӳ�����
         * @static
         */
        loadCustomLazyData: function(containers, type, flag) {
            var self = this, area, imgs;


            // ֧������
            if (!Lang.isArray(containers)) {
                containers = [Dom.get(containers)];
            }

            // ��������
            S.each(containers, function(container) {
                switch (type) {
                    case 'textarea-data':
                        area = container.getElementsByTagName('textarea')[0];
                        if (area && Dom.hasClass(area, flag || CUSTOM_TEXTAREA_DATA_CLS)) {
                            self._loadDataFromArea(container, area);
                        }
                        break;
                    //case 'img-src':
                    default:
                        //S.log('loadCustomLazyData container = ' + container.src);
                        if (container.nodeName === 'IMG') { // �������ͼƬ
                            imgs = [container];
                        } else {
                            imgs = container.getElementsByTagName('img');
                        }
                        for (var i = 0, len = imgs.length; i < len; i++) {
                            self._loadImgSrc(imgs[i], flag || CUSTOM_IMG_DATA_SRC);
                        }
                }
            });
        }
    });

    // attach static methods
    S.mix(DataLazyload, DataLazyload.prototype, true, ['loadCustomLazyData', '_loadImgSrc', '_loadDataFromArea']);

    S.DataLazyload = DataLazyload;
});

/**
 * NOTES:
 *
 * ģʽΪ auto ʱ��
 *  1. �� Firefox �·ǳ��������ű�����ʱ����û���κ�ͼƬ��ʼ���أ������������ӳټ��ء�
 *  2. �� IE �²����������ű�����ʱ���в���ͼƬ�Ѿ���������������ӣ��ⲿ�� abort ����
 *     ���ڹ���ʱ�ӳټ��أ�������������������
 *  3. �� Safari �� Chrome �£���Ϊ webkit �ں� bug�������޷� abort �����ء���
 *     �ű���ȫ���á�
 *  4. �� Opera �£��� Firefox һ�£�������
 *
 * ģʽΪ manual ʱ����Ҫ�ӳټ��ص�ͼƬ��src �����滻Ϊ data-lazyload-src, ���� src ��ֵ��Ϊ placeholder ��
 *  1. ���κ�������¶���������ʵ�֡�
 *  2. ȱ���ǲ�������ǿ���� JS ʱ��ͼƬ����չʾ��
 *
 * ȱ�㣺
 *  1. ���ڴ󲿷�����£���Ҫ�϶��鿴���ݵ�ҳ�棨�����������ҳ�������ٹ���ʱ����������
 *     �����飨�û��������������ã����ر������ٲ���ʱ��
 *  2. auto ģʽ��֧�� Webkit �ں��������IE �£��п��ܵ��� HTTP �����������ӡ�
 *
 * �ŵ㣺
 *  1. ���Ժܺõ����ҳ���ʼ�����ٶȡ�
 *  2. ��һ������ת���ӳټ���ͼƬ���Լ���������
 *
 * �ο����ϣ�
 *  1. http://davidwalsh.name/lazyload MooTools ��ͼƬ�ӳٲ��
 *  2. http://vip.qq.com/ ģ�����ʱ�����滻��ͼƬ�� src
 *  3. http://www.appelsiini.net/projects/lazyload jQuery Lazyload
 *  4. http://www.dynamixlabs.com/2008/01/17/a-quick-look-add-a-loading-icon-to-your-larger-images/
 *  5. http://www.nczonline.net/blog/2009/11/30/empty-image-src-can-destroy-your-site/
 *
 * �ر�Ҫע��Ĳ�������:
 *  1. ��ʼ���ں�С�����󴰿�ʱ��ͼƬ��������
 *  2. ҳ���й���λ��ʱ��ˢ��ҳ�棬ͼƬ��������
 *  3. �ֶ�ģʽ����һ�����ӳ�ͼƬʱ����������
 *
 * 2009-12-17 ���䣺
 *  1. textarea �ӳټ���Լ����ҳ������Ҫ�ӳٵ� dom �ڵ㣬����
 *       <textarea class='ks-datalazysrc invisible'>dom code</textarea>
 *     �������� hidden �� class, �������� invisible, ���趨 height = 'ʵ�ʸ߶�'.
 *     �������Ա�֤����ʱ��diff ����ʵ��Ч��
 *     ע�⣺textarea ���غ󣬻��滻���������е��������ݡ�
 *  2. �ӳ� callback Լ����dataLazyload.addCallback(el, fn) ��ʾ�� el ��������ʱ������ fn.
 *  3. ���в���������ഥ��һ�Σ����� callback. �����϶�������ʱ��ֻ�� el ��һ�γ���ʱ�ᴥ�� fn �ص���
 */

/**
 * TODOs:
 *   - [ȡ��] ����ͼƬ���ӳټ��أ����� css ��ı���ͼƬ�� sprite ���Ѵ���
 *   - [ȡ��] ����ʱ�� loading ͼ������δ�趨��С��ͼƬ��������������[�ο����� 4]��
 */

/**
 * UPDATE LOG:
 *   - 2009-12-17 yubo �� imglazyload ����Ϊ datalazyload, ֧�� textarea ��ʽ�ӳٺ��ض�Ԫ�ؼ�������ʱ�Ļص�����
 *//*
Copyright 2010, KISSY UI Library v1.0.4
MIT Licensed
build: 480 Mar 11 14:06
*/
/**
 * ��ʾ��ȫ���
 * @module      suggest
 * @creator     ��<lifesinger@gmail.com>
 * @depends     kissy-core, yahoo-dom-event
 */
KISSY.add("suggest", function(S, undefined) {

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
        var self = this;

        // allow instantiation without the new operator
        if (!(self instanceof Suggest)) {
            return new Suggest(textInput, dataSource, config);
        }

        /**
         * �ı������
         * @type HTMLElement
         */
        self.textInput = Dom.get(textInput);

        /**
         * ��ȡ���ݵ�URL �� JSON��ʽ�ľ�̬����
         * @type {String|Object}
         */
        self.dataSource = dataSource;

        /**
         * JSON��̬����Դ
         * @type Object ��ʽΪ {"query1" : [["key1", "result1"], []], "query2" : [[], []]}
         */
        self.JSONDataSource = Lang.isObject(dataSource) ? dataSource : null;

        /**
         * ͨ��jsonp���ص�����
         * @type Object
         */
        self.returnedData = null;

        /**
         * ���ò���
         * @type Object
         */
        self.config = Lang.merge(defaultConfig, config || {});

        /**
         * �����ʾ��Ϣ������
         * @type HTMLElement
         */
        self.container = null;

        /**
         * ������ֵ
         * @type String
         */
        self.query = "";

        /**
         * ��ȡ����ʱ�Ĳ���
         * @type String
         */
        self.queryParams = "";

        /**
         * �ڲ���ʱ��
         * @private
         * @type Object
         */
        self._timer = null;

        /**
         * ��ʱ���Ƿ�������״̬
         * @private
         * @type Boolean
         */
        self._isRunning = false;

        /**
         * ��ȡ���ݵ�scriptԪ��
         * @type HTMLElement
         */
        self.dataScript = null;

        /**
         * ���ݻ���
         * @private
         * @type Object
         */
        self._dataCache = {};

        /**
         * ����script��ʱ���
         * @type String
         */
        self._latestScriptTime = "";

        /**
         * script���ص������Ƿ��Ѿ�����
         * @type Boolean
         */
        self._scriptDataIsOut = false;

        /**
         * �Ƿ��ڼ���ѡ��״̬
         * @private
         * @type Boolean
         */
        self._onKeyboardSelecting = false;

        /**
         * ��ʾ��ĵ�ǰѡ����
         * @type Boolean
         */
        self.selectedItem = null;

        // init
        self._init();
    }

    S.mix(Suggest.prototype, {
        /**
         * ��ʼ������
         * @protected
         */
        _init: function() {
            var self = this;
            
            // init DOM
            self._initTextInput();
            self._initContainer();
            if (self.config.useShim) self._initShim();
            self._initStyle();

            // create events
            self.createEvent(BEFORE_DATA_REQUEST);
            self.createEvent(ON_DATA_RETURN);
            self.createEvent(BEFORE_SHOW);
            self.createEvent(ON_ITEM_SELECT);

            // window resize event
            self._initResizeEvent();
        },

        /**
         * ��ʼ�������
         * @protected
         */
        _initTextInput: function() {
            var self = this;

            // turn off autocomplete
            self.textInput.setAttribute("autocomplete", "off");

            // focus
            // 2009-12-10 yubo: �ӳٵ� keydown �� start
            //            Event.on(this.textInput, "focus", function() {
            //                instance.start();
            //            });

            // blur
            Event.on(self.textInput, "blur", function() {
                self.stop();
                self.hide();
            });

            // auto focus
            if (self.config.autoFocus) self.textInput.focus();

            // keydown
            // ע������Ŀǰ����Opera9.64�У����뷨����ʱ�����ɲ��ᴥ���κμ����¼�
            var pressingCount = 0; // ������סĳ��ʱ������������keydown������ע��Operaֻ�ᴥ��һ�Ρ�
            Event.on(self.textInput, "keydown", function(ev) {
                var keyCode = ev.keyCode;
                //console.log("keydown " + keyCode);

                switch (keyCode) {
                    case 27: // ESC����������ʾ�㲢��ԭ��ʼ����
                        self.hide();
                        self.textInput.value = self.query;
                        break;
                    case 13: // ENTER��
                        // �ύ��ǰ����������ʾ�㲢ֹͣ��ʱ��
                        self.textInput.blur(); // ��һ�仹������ֹ���������Ĭ���ύ�¼�

                        // ����Ǽ���ѡ��ĳ���س�������onItemSelect�¼�
                        if (self._onKeyboardSelecting) {
                            if (self.textInput.value == self._getSelectedItemKey()) { // ȷ��ֵƥ��
                                self.fireEvent(ON_ITEM_SELECT, self.textInput.value);
                            }
                        }

                        // �ύ��
                        self._submitForm();
                        break;
                    case 40: // DOWN��
                    case 38: // UP��
                        // ��ס������ʱ����ʱ����
                        if (pressingCount++ == 0) {
                            if (self._isRunning) self.stop();
                            self._onKeyboardSelecting = true;
                            self.selectItem(keyCode == 40);

                        } else if (pressingCount == 3) {
                            pressingCount = 0;
                        }
                        break;
                }

                // �� DOWN/UP ��ʱ��������ʱ��
                if (keyCode != 40 && keyCode != 38) {
                    if (!self._isRunning) {
                        // 1. �����ٽ�����js��δ������ʱ���û����ܾ��Ѿ���ʼ����
                        //    ��ʱ��focus�¼��Ѿ����ᴥ������Ҫ��keyup�ﴥ����ʱ��
                        // 2. ��DOWN/UP��ʱ����Ҫ���ʱ��
                        self.start();
                    }
                    self._onKeyboardSelecting = false;
                }
            });

            // reset pressingCount
            Event.on(self.textInput, "keyup", function() {
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
            var self = this,
                r = Dom.getRegion(self.textInput),
                left = r.left,
                w = r.right - left - 2;  // ��ȥborder��2px

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

            self.container.style.left = left + "px";
            self.container.style.top = r.bottom + "px";

            if (self.config.containerWidth == "auto") {
                self.container.style.width = w + "px";
            } else {
                self.container.style.width = self.config.containerWidth;
            }
        },

        /**
         * ��ʼ�������¼�
         * ��Ԫ�ض����������¼���ð�ݵ�����ͳһ����
         * @protected
         */
        _initContainerEvent: function() {
            var self = this;

            // ����¼�
            Event.on(self.container, "mousemove", function(ev) {
                //console.log("mouse move");
                var target = Event.getTarget(ev);

                if (target.nodeName != "LI") {
                    target = Dom.getAncestorByTagName(target, "li");
                }
                if (Dom.isAncestor(self.container, target)) {
                    if (target != self.selectedItem) {
                        // �Ƴ��ϵ�
                        self._removeSelectedItem();
                        // �����µ�
                        self._setSelectedItem(target);
                    }
                }
            });

            var mouseDownItem = null;
            self.container.onmousedown = function(e) {
                e = e || win.event;
                // ��갴�´���item
                mouseDownItem = e.target || e.srcElement;

                // ��갴��ʱ��������򲻻�ʧȥ����
                // 1. for IE
                self.textInput.onbeforedeactivate = function() {
                    win.event.returnValue = false;
                    self.textInput.onbeforedeactivate = null;
                };
                // 2. for W3C
                return false;
            };

            // mouseup�¼�
            Event.on(self.container, "mouseup", function(ev) {
                // ��mousedown����ʾ�㣬��mouseup����ʾ����ʱ�������Ч
                if (!self._isInContainer(Event.getXY(ev))) return;
                var target = Event.getTarget(ev);
                // ����ʾ��A�������꣬�ƶ���B���ͷţ�������onItemSelect
                if (target != mouseDownItem) return;

                // ����ڹرհ�ť��
                if (target.className == CLOSE_BTN_CLASS) {
                    self.hide();
                    return;
                }

                // ���ܵ����li����Ԫ����
                if (target.nodeName != "LI") {
                    target = Dom.getAncestorByTagName(target, "li");
                }
                // ��������container�ڲ���li��
                if (Dom.isAncestor(self.container, target)) {
                    self._updateInputFromSelectItem(target);

                    // ����ѡ���¼�
                    //console.log("on item select");
                    self.fireEvent(ON_ITEM_SELECT, self.textInput.value);

                    // �ύ��ǰ����������ʾ�㲢ֹͣ��ʱ��
                    self.textInput.blur();

                    // �ύ��
                    self._submitForm();
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
            var self = this, resizeTimer;

            Event.on(win, "resize", function() {
                if (resizeTimer) {
                    clearTimeout(resizeTimer);
                }

                resizeTimer = setTimeout(function() {
                    self._setContainerRegion();
                    self._setShimRegion();
                }, 50);
            });
        },

        /**
         * ������ʱ������ʼ�����û�����
         */
        start: function() {
            var self = this;
            
            Suggest.focusInstance = self;
            self._timer = setTimeout(function() {
                self.updateContent();
                self._timer = setTimeout(arguments.callee, self.config.timerDelay);
            }, self.config.timerDelay);

            self._isRunning = true;
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
            var self = this;
            if (!self._needUpdate()) return;
            //console.log("update data");

            self._updateQueryValueFromInput();
            var q = self.query;

            // 1. ����Ϊ��ʱ��������ʾ��
            if (!Lang.trim(q).length) {
                self._fillContainer("");
                self.hide();
                return;
            }

            if (self._dataCache[q] !== undefined) { // 2. ʹ�û�������
                //console.log("use cache");
                self.returnedData = "using cache";
                self._fillContainer(self._dataCache[q]);
                self._displayContainer();

            } else if (self.JSONDataSource) { // 3. ʹ��JSON��̬����Դ
                self.handleResponse(self.JSONDataSource[q]);

            } else { // 4. �������������
                self.requestData();
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
            var self = this;
            
            //console.log("request data via script");
            if (!ie) self.dataScript = null; // IE����Ҫ���´���scriptԪ��

            if (!self.dataScript) {
                var script = doc.createElement("script");
                script.type = "text/javascript";
                script.charset = "utf-8";

                // jQuery ajax.js line 275:
                // Use insertBefore instead of appendChild  to circumvent an IE6 bug.
                // This arises when a base node is used.
                head.insertBefore(script, head.firstChild);
                self.dataScript = script;

                if (!ie) {
                    var t = new Date().getTime();
                    self._latestScriptTime = t;
                    script.setAttribute("time", t);

                    Event.on(script, "load", function() {
                        //console.log("on load");
                        // �жϷ��ص������Ƿ��Ѿ�����
                        self._scriptDataIsOut = script.getAttribute("time") != self._latestScriptTime;
                    });
                }
            }

            // ע�⣺û��Ҫ��ʱ������Ƿ񻺴��ɷ��������ص�Headerͷ����
            self.queryParams = "q=" + encodeURIComponent(self.query) + "&code=utf-8&callback=" + CALLBACK_STR;
            self.fireEvent(BEFORE_DATA_REQUEST, self.query);
            self.dataScript.src = self.dataSource + "?" + self.queryParams;
        },

        /**
         * �����ȡ������
         * @param {Object} data
         */
        handleResponse: function(data) {
            var self = this;
            
            //console.log("handle response");
            if (self._scriptDataIsOut) return; // �����������ݣ�����ᵼ��bug��1. ����keyֵ���ԣ� 2. �������ݵ��µ�����

            self.returnedData = data;
            self.fireEvent(ON_DATA_RETURN, data);

            // ��ʽ������
            self.returnedData = self.formatData(self.returnedData);

            // �������
            var content = "";
            var len = self.returnedData.length;
            if (len > 0) {
                var list = doc.createElement("ol");
                for (var i = 0; i < len; ++i) {
                    var itemData = self.returnedData[i];
                    var li = self.formatItem(itemData["key"], itemData["result"]);
                    // ����keyֵ��attribute��
                    li.setAttribute("key", itemData["key"]);
                    list.appendChild(li);
                }
                content = list;
            }
            self._fillContainer(content);

            // ������ʱ����ӵײ�
            if (len > 0) self.appendBottom();

            // fire event
            if (Lang.trim(self.container.innerHTML)) {
                // ʵ������beforeCache�������û��ĽǶȿ�����beforeShow
                self.fireEvent(BEFORE_SHOW, self.container);
            }

            // cache
            self._dataCache[self.query] = self.container.innerHTML;

            // ��ʾ����
            self._displayContainer();
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

            if (result !== undefined) { // ����û��
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
            if (S.trim(this.container.innerHTML)) {
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
            var self = this;
            
            //console.log("select item " + down);
            var items = self.container.getElementsByTagName("li");
            if (items.length == 0) return;

            // �п�����ESC�����ˣ�ֱ����ʾ����
            if (!self.isVisible()) {
                self.show();
                return; // ����ԭ����ѡ��״̬
            }
            var newSelectedItem;

            // û��ѡ����ʱ��ѡ�е�һ/�����
            if (!self.selectedItem) {
                newSelectedItem = items[down ? 0 : items.length - 1];
            } else {
                // ѡ����/��һ��
                newSelectedItem = Dom[down ? "getNextSibling" : "getPreviousSibling"](self.selectedItem);
                // �Ѿ��������/ǰһ��ʱ����λ������򣬲���ԭ����ֵ
                if (!newSelectedItem) {
                    self.textInput.value = self.query;
                }
            }

            // �Ƴ���ǰѡ����
            self._removeSelectedItem();

            // ѡ������
            if (newSelectedItem) {
                self._setSelectedItem(newSelectedItem);
                self._updateInputFromSelectItem();
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

    S.Suggest = Suggest;
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
 *
 * 2010-03-10 ���£� ȥ������ģʽ����Ӧ kissy �µĴ�����֯��ʽ��
 */
/*
Copyright 2010, KISSY UI Library v1.0.4
MIT Licensed
build: 480 Mar 11 14:06
*/
/**
 * Switchable
 * @creator     ��<lifesinger@gmail.com>
 * @depends     kissy, yui-base, selector, dom-base
 */
KISSY.add('switchable', function(S, undefined) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = YAHOO.lang,
        doc = document,
        DISPLAY = 'display', BLOCK = 'block', NONE = 'none',
        FORWARD = 'forward', BACKWARD = 'backward',
        DOT = '.',
        BEFORE_SWITCH = 'beforeSwitch', ON_SWITCH = 'onSwitch',
        CLS_PREFIX = 'ks-switchable-';

    /**
     * Switchable Widget
     * attached members��
     *   - this.container
     *   - this.config
     *   - this.triggers  ����Ϊ��ֵ []
     *   - this.panels    �϶���ֵ���� length > 1
     *   - this.content
     *   - this.length
     *   - this.activeIndex
     *   - this.switchTimer
     */
    function Switchable(container, config) {
        var self = this;

        // ����������Ϣ
        config = config || {};
        if (!('mackupType' in config)) {
            if (config.panelCls) {
                config.mackupType = 1;
            } else if (config.panels) {
                config.mackupType = 2;
            }
        }
        config = S.merge(Switchable.Config, config);

        /**
         * the container of widget
         * @type HTMLElement
         */
        self.container = S.get(container);

        /**
         * ���ò���
         * @type object
         */
        self.config = config;

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
        if (self.activeIndex === undefined) {
            self.activeIndex = config.activeIndex;
        }

        self._init();
    }

    // Ĭ������
    Switchable.Config = {
        mackupType: 0, // mackup �����ͣ�ȡֵ���£�

        // 0 - Ĭ�Ͻṹ��ͨ�� nav �� content ����ȡ triggers �� panels
        navCls: CLS_PREFIX + 'nav',
        contentCls: CLS_PREFIX + 'content',

        // 1 - �ʶ���ͨ�� cls ����ȡ triggers �� panels
        triggerCls: CLS_PREFIX + 'trigger',
        panelCls: CLS_PREFIX + 'panel',

        // 2 - ��ȫ���ɣ�ֱ�Ӵ��� triggers �� panels
        triggers: [],
        panels: [],

        // �Ƿ��д���
        hasTriggers: true,

        // ��������
        triggerType: 'mouse', // or 'click'
        // �����ӳ�
        delay: .1, // 100ms

        activeIndex: 0, // mackup ��Ĭ�ϼ����Ӧ����� index һ��
        activeTriggerCls: 'active',

        // �л���ͼ���ж��ٸ� panels
        steps: 1,

        // �л���ͼ����Ĵ�С��һ�㲻��Ҫ�趨��ֵ��������ȡֵ����ȷʱ�������ֹ�ָ����С
        viewSize: []
    };

    // �����Ϣ
    Switchable.Plugins = [];

    S.mix(Switchable.prototype, {

        /**
         * init switchable
         */
        _init: function() {
            var self = this, cfg = self.config;

            // parse mackup
            if (self.panels.length === 0) {
                self._parseMackup();
            }

            // create custom events
            self.createEvent(BEFORE_SWITCH);
            self.createEvent(ON_SWITCH);

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
         * ���� mackup, ��ȡ triggers, panels, content
         */
        _parseMackup: function() {
            var self = this, container = self.container,
                cfg = self.config,
                hasTriggers = cfg.hasTriggers,
                nav, content, triggers = [], panels = [], i, n, m;

            switch (cfg.mackupType) {
                case 0: // Ĭ�Ͻṹ
                    nav = S.get(DOT + cfg.navCls, container);
                    if (nav) {
                        triggers = Dom.getChildren(nav);
                    }
                    content = S.get(DOT + cfg.contentCls, container);
                    panels = Dom.getChildren(content);
                    break;
                case 1: // �ʶ����
                    triggers = S.query(DOT + cfg.triggerCls, container);
                    panels = S.query(DOT + cfg.panelCls, container);
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
                for (i = 0, m = triggers.length; i < m; i++) {
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
            var self = this, cfg = self.config,
                ul = doc.createElement('UL'), li, i;

            ul.className = cfg.navCls;
            for (i = 0; i < len; i++) {
                li = doc.createElement('LI');
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
            var self = this, cfg = self.config,
                triggers = self.triggers, trigger,
                i, len = triggers.length;

            for (i = 0; i < len; i++) {
                (function(index) {
                    trigger = triggers[index];

                    // ��Ӧ����� Tab ��
                    Event.on(trigger, 'click', function() {
                        self._onFocusTrigger(index);
                    });
                    Event.on(trigger, 'focus', function() {
                        self._onFocusTrigger(index);
                    });

                    // ��Ӧ�������
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
            //S.log('Triggerable._onMouseEnterTrigger: index = ' + index);

            // ���ظ����������磺����ʾ����ʱ���������ٻ����ٻ����������ش���
            if (self.activeIndex !== index) {
                self.switchTimer = Lang.later(self.config.delay * 1000, self, function() {
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
            var self = this, cfg = self.config,
                triggers = self.triggers, panels = self.panels,
                activeIndex = self.activeIndex,
                steps = cfg.steps,
                fromIndex = activeIndex * steps, toIndex = index * steps;
            //S.log('Triggerable.switchTo: index = ' + index);

            if (index === activeIndex) return self;
            if (!self.fireEvent(BEFORE_SWITCH, index)) return self;

            // switch active trigger
            if (cfg.hasTriggers) {
                self._switchTrigger(activeIndex > -1 ? triggers[activeIndex] : null, triggers[index]);
            }

            // switch active panels
            if (direction === undefined) {
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
            var activeTriggerCls = this.config.activeTriggerCls;

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
 * Notes:
 *
 * 2010.03
 *  - �ع���ȥ�� Widget, ���ִ���ֱ�Ӳ��� kissy ������
 *  - ������ƴ� weave ֯�뷨�ĳ� hook ���ӷ�
 *
 * TODOs:
 *  - http://malsup.com/jquery/cycle/
 *  - http://www.mall.taobao.com/go/chn/mall_chl/flagship.php
 * 
 * References:
 *  - jQuery Scrollable http://flowplayer.org/tools/scrollable.html
 *//**
 * Switchable Autoplay Plugin
 * @creator     ��<lifesinger@gmail.com>
 * @depends     kissy, yui-base, selector, dom-base
 */
KISSY.add('switchable-autoplay', function(S) {

    var Y = YAHOO.util, Event = Y.Event, Lang = YAHOO.lang,
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
     * ��Ӳ��
     * attached members:
     *   - this.paused
     *   - this.autoplayTimer
     */
    Switchable.Plugins.push({
        name: 'autoplay',

        init: function(host) {
            var cfg = host.config;
            if (!cfg.autoplay) return;

            // �����ͣ��ֹͣ�Զ�����
            if (cfg.pauseOnHover) {
                Event.on(host.container, 'mouseenter', function() {
                    host.paused = true;
                });
                Event.on(host.container, 'mouseleave', function() {
                    // ���� interval Ϊ 10s
                    // �� 8s ʱ��ͨ�� focus ���������л���ͣ�� 1s ������Ƴ�
                    // ��ʱ����� setTimeout, �ٹ� 1s ������������ panel �����滻��
                    // Ϊ�˱�֤ÿ�� panel ����ʾʱ�䶼��С�� interval, �˴����� setTimeout
                    setTimeout(function() {
                        host.paused = false;
                    }, cfg.interval * 1000);
                });
            }

            // �����Զ�����
            host.autoplayTimer = Lang.later(cfg.interval * 1000, host, function() {
                if (host.paused) return;
                host.switchTo(host.activeIndex < host.length - 1 ? host.activeIndex + 1 : 0);
            }, null, true);
        }
    });
});

/**
 * TODO:
 *  - �Ƿ���Ҫ�ṩ play / pause / stop API ?
 *  - autoplayTimer �� switchTimer �Ĺ�����
 */
/**
 * Switchable Effect Plugin
 * @creator     ��<lifesinger@gmail.com>
 * @depends     kissy, yui-base, yui-animation, switchable
 */
KISSY.add('switchable-effect', function(S) {

    var Y = YAHOO.util, Dom = Y.Dom,
        DISPLAY = 'display', BLOCK = 'block', NONE = 'none',
        OPACITY = 'opacity', Z_INDEX = 'z-index',
        RELATIVE = 'relative', ABSOLUTE = 'absolute',
        SCROLLX = 'scrollx', SCROLLY = 'scrolly', FADE = 'fade',
        Switchable = S.Switchable, Effects;

    /**
     * ���Ĭ������
     */
    S.mix(Switchable.Config, {
        effect: NONE, // 'scrollx', 'scrolly', 'fade' ����ֱ�Ӵ��� custom effect fn
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
                throw new Error('fade effect only supports steps == 1.');
            }
            var self = this, cfg = self.config,
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
            var self = this, cfg = self.config,
                isX = cfg.effect === SCROLLX,
                diff = self.viewSize[isX ? 0 : 1] * index,
                attributes = {};

            attributes[isX ? 'left' : 'top'] = { to: -diff };

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
     * ��Ӳ��
     * attached members:
     *   - this.viewSize
     */
    Switchable.Plugins.push({
        name: 'effect',

        /**
         * ���� effect, ������ʼ״̬
         */
        init: function(host) {
            var cfg = host.config,
                effect = cfg.effect,
                panels = host.panels,
                steps = cfg.steps,
                activeIndex = host.activeIndex,
                fromIndex = activeIndex * steps,
                toIndex = fromIndex + steps - 1,
                i, len = panels.length;

            // 1. ��ȡ�߿�
            host.viewSize = [
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
                        host.content.style.position = ABSOLUTE;
                        host.content.parentNode.style.position = RELATIVE; // ע��content �ĸ�����һ���� container

                        // ˮƽ����
                        if (effect === SCROLLX) {
                            Dom.setStyle(panels, 'float', 'left');

                            // ��������ȣ��Ա�֤�пռ��� panels ˮƽ�Ų�
                            host.content.style.width = host.viewSize[0] * (len / steps) + 'px';
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
        }
    });

    /**
     * �����л�����
     */
    S.mix(Switchable.prototype, {
        /**
         * �л���ͼ
         */
        _switchView: function(fromEls, toEls, index, direction) {
            var self = this, cfg = self.config,
                effect = cfg.effect,
                fn = typeof effect === 'function' ? effect : Effects[effect];

            fn.call(self, fromEls, toEls, function() {
                self.fireEvent('onSwitch', index);
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
 * @depends     kissy, yui-base, switchable
 */
KISSY.add('switchable-circular', function(S) {

    var Y = YAHOO.util,
        RELATIVE = 'relative',
        LEFT = 'left', TOP = 'top',
        PX = 'px', EMPTY = '',
        FORWARD = 'forward', BACKWARD = 'backward',
        SCROLLX = 'scrollx', SCROLLY = 'scrolly',
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
        var self = this, cfg = self.config,
            len = self.length,
            activeIndex = self.activeIndex,
            isX = cfg.scrollType === SCROLLX,
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
        var self = this, cfg = self.config,
            steps = cfg.steps,
            len = self.length,
            start = isBackward ? len - 1 : 0,
            from = start * steps,
            to = (start + 1) * steps,
            i;

        // ���� panels ����һ����ͼ��
        for (i = from; i < to; i++) {
            panels[i].style.position = RELATIVE;
            panels[i].style[prop] = (isBackward ? '-' : EMPTY) + viewDiff * len + PX;
        }

        // ƫ����
        return isBackward ? viewDiff : -viewDiff * len;
    }

    /**
     * ��ԭλ��
     */
    function resetPosition(panels, index, isBackward, prop, viewDiff) {
        var self = this, cfg = self.config,
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
     * ��Ӳ��
     */
    Switchable.Plugins.push({
        name: 'circular',

        /**
         * ���� effect, ������ʼ״̬
         */
        init: function(host) {
            var cfg = host.config;

            // ���й���Ч����Ҫ����ĵ���
            if (cfg.circular && (cfg.effect === SCROLLX || cfg.effect === SCROLLY)) {
                // ���ǹ���Ч������
                cfg.scrollType = cfg.effect; // ���浽 scrollType ��
                cfg.effect = circularScroll;
            }
        }
    });
});

/**
 * TODO:
 *   - �Ƿ���Ҫ���Ǵ� 0 �� 2�������һ���� �� backward ��������Ҫ�����
 *//**
 * Switchable Lazyload Plugin
 * @creator     ��<lifesinger@gmail.com>
 * @depends     kissy, yui-base, switchable, datalazyload
 */
KISSY.add('switchable-lazyload', function(S) {

    var Y = YAHOO.util, Dom = Y.Dom,
        BEFORE_SWITCH = 'beforeSwitch',
        IMG_SRC = 'img-src', TEXTAREA_DATA = 'textarea-data',
        FLAGS = {},
        Switchable = S.Switchable,
        DataLazyload = S.DataLazyload;

    FLAGS[IMG_SRC] = 'data-lazyload-src-custom';
    FLAGS[TEXTAREA_DATA] = 'ks-datalazyload-custom';

    /**
     * ���Ĭ������
     */
    S.mix(Switchable.Config, {
        lazyDataType: '', // 'img-src' or 'textarea-data'
        lazyDataFlag: ''  // 'data-lazyload-src-custom' or 'ks-datalazyload-custom'
    });

    /**
     * ֯���ʼ������
     */
    Switchable.Plugins.push({
        name: 'autoplay',

        init: function(host) {
            var cfg = host.config,
                type = cfg.lazyDataType, flag = cfg.lazyDataFlag || FLAGS[type];
            if (!DataLazyload || !type || !flag) return; // û���ӳ���

            host.subscribe(BEFORE_SWITCH, loadLazyData);

            /**
             * �����ӳ�����
             */
            function loadLazyData(index) {
                var steps = cfg.steps,
                    from = index * steps ,
                    to = from + steps;

                DataLazyload.loadCustomLazyData(host.panels.slice(from, to), type, flag);
                if (isAllDone()) {
                    host.unsubscribe(BEFORE_SWITCH, loadLazyData);
                }
            }

            /**
             * �Ƿ��Ѽ������
             */
            function isAllDone() {
                var imgs, textareas, i, len;

                if (type === IMG_SRC) {
                    imgs = host.container.getElementsByTagName('img');
                    for (i = 0,len = imgs.length; i < len; i++) {
                        if (imgs[i].getAttribute(flag)) return false;
                    }
                } else if (type === TEXTAREA_DATA) {
                    textareas = host.container.getElementsByTagName('textarea');
                    for (i = 0,len = textareas.length; i < len; i++) {
                        if (Dom.hasClass(textareas[i], flag)) return false;
                    }
                }

                return true;
            }

        }
    });
});
/**
 * Tabs Widget
 * @creator     ��<lifesinger@gmail.com>
 * @depends     kissy, yui-base
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
 * @creator     ��<lifesinger@gmail.com>
 * @depends     kissy, yui-base
 */
KISSY.add('slide', function(S) {

    /**
     * Ĭ�����ã��� Switchable ��ͬ�Ĳ��ִ˴�δ�г�
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

        config = S.merge(defaultConfig, config || { });
        Slide.superclass.constructor.call(self, container, config);
    }

    S.extend(Slide, S.Switchable);
    S.Slide = Slide;
});
/**
 * Carousel Widget
 * @creator     ��<lifesinger@gmail.com>
 * @depends     kissy, yui-base
 */
KISSY.add('carousel', function(S) {

        /**
         * Ĭ�����ã��� Switchable ��ͬ�Ĳ��ִ˴�δ�г�
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

        config = S.merge(defaultConfig, config || { });
        Carousel.superclass.constructor.call(self, container, config);
    }

    S.extend(Carousel, S.Switchable);
    S.Carousel = Carousel;
});
/**
 * �����˵����
 * @module      megamenu
 * @creator     ��<lifesinger@gmail.com>
 * @depends     kissy-core, yui-base, switchable
 */
KISSY.add('megamenu', function(S) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = YAHOO.lang,
        NONE = 'none', BLOCK = 'block',
        CLOSEBTN_TMPL = '<span class=\'{hook_cls}\'></span>',
        CLS_PREFIX = 'ks-megamenu-',

        /**
         * Ĭ�����ã��� Switchable ��ͬ�����ô˴�δ�г�
         */
        defaultConfig = {
            hideDelay: .5,    // �����ӳ�

            viewCls: CLS_PREFIX + 'view',
            closeBtnCls: CLS_PREFIX + 'closebtn',

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
        self._initView();
        if (self.config.showCloseBtn) self._initCloseBtn();

    }

    S.extend(MegaMenu, S.Switchable);

    S.mix(MegaMenu.prototype, {

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
            //S.log('Triggerable._onMouseEnterTrigger: index = ' + index);
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
                view = Dom.getElementsByClassName(cfg.viewCls, '*', self.container)[0];

            // �Զ����� view
            if (!view) {
                view = document.createElement('DIV');
                view.className = cfg.viewCls;
                self.container.appendChild(view);
            }

            // init events
            Event.on(view, 'mouseenter', function() {
                if (self.hideTimer) self.hideTimer.cancel();
            });
            Event.on(view, 'mouseleave', function() {
                self.hideTimer = Lang.later(cfg.hideDelay * 1000, self, 'hide');
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

            view.innerHTML = CLOSEBTN_TMPL.replace('{hook_cls}', self.config.closeBtnCls);
            Event.on(view.firstChild, 'click', function() {
                self.hide();
            });

            // ���� viewContent
            el = document.createElement('div');
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
            self.fireEvent('onSwitch', index);
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
 */