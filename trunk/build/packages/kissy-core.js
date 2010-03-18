/*
Copyright 2010, KISSY UI Library v1.0.4
MIT Licensed
build: 498 Mar 18 13:49
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
build: 498 Mar 18 13:49
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
build: 498 Mar 18 13:49
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
