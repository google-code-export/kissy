/*
Copyright 2010, KISSY UI Library v1.0.5
MIT Licensed
build: 524 Apr 6 09:10
*/
/**
 * @module  cookie
 * @author  lifesinger@gmail.com
 * @depends kissy
 */

KISSY.add('cookie', function(S) {

    var doc = document,
        encode = encodeURIComponent,
        decode = decodeURIComponent;

    S.Cookie = {

        /**
         * ��ȡ cookie ֵ
         * @return {string} ��� name �����ڣ����� undefined
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

            // �ӵ�ǰʱ�俪ʼ������������
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

        remove: function(name) {
            // ���̹���
            this.set(name, '', 0);
        }
    };

    function isNotEmptyString(val) {
        return typeof val === 'string' && val !== '';
    }

});

/**
 * Notes:
 *
 *  2010.04
 *   - get ����Ҫ���� ie �£�
 *     ֵΪ�յ� cookie Ϊ 'test3; test3=3; test3tt=2; test1=t1test3; test3', û�е��ںš�
 *     ���������ȡ�������� split �ַ����ķ�ʽ����ȡ��
 *   - api ����ϣ�ԭ������ jQuery �ļ������S.cookie(name, ...), �����ǵ�����չ�ԣ�Ŀǰ
 *     �����ɾ�̬������ķ�ʽ���š�
 *
 *//*
Copyright 2010, KISSY UI Library v1.0.5
MIT Licensed
build: 545 Apr 9 13:24
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

        Date.prototype.toJSON = function (key) {

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
        Boolean.prototype.toJSON = function (key) {
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
Copyright 2010, KISSY UI Library v1.0.5
MIT Licensed
build: 524 Apr 6 09:10
*/
/**
 * @module  ajax
 * @author  lifesinger@gmail.com
 * @depends kissy
 */

KISSY.add('ajax', function(S) {

    var doc = document,
        UA = S.UA;
    
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
            var head = doc.getElementsByTagName('head')[0] || doc.documentElement,
                node = doc.createElement('script');

            node.src = url;
            if(charset) node.charset = charset;
            node.async = true;

            if (S.isFunction(callback)) {
                if (UA.ie) {
                    node.onreadystatechange = function() {
                        var rs = node.readyState;
                        if (rs === 'loaded' || rs === 'complete') {
                            // handle memory leak in IE
                            node.onreadystatechange = null;
                            callback();
                        }
                    };
                } else {
                    node.onload = callback;
                }
            }

            head.appendChild(node);
        }
    };

});

/**
 * Notes:
 *
 *  2010.04
 *   - api ���ǣ�jQuery ��ȫ����� jQuery �����ϣ�ajaxComplete �ȷ����Եò����š�
 *         YUI2 �� YAHOO.util.Connect.Get.script �㼶̫�YUI3 �� io ��Ұ��
 *         ����KISSY ��� ExtJS, ���ַ������ jQuery.
 *
 *//*
Copyright 2010, KISSY UI Library v1.0.5
MIT Licensed
build: 543 Apr 9 08:13
*/
/**
 * SWF UA info
 * author: lifesinger@gmail.com
 */

KISSY.add('swf-ua', function(S) {

    var UA = S.UA,
        version = 0, sF = 'ShockwaveFlash',
        ax6, mF, eP;

    if (UA.ie) {
        try {
            ax6 = new ActiveXObject(sF + '.' + sF + '.6');
            ax6.AllowScriptAccess = 'always';
        } catch(e) {
            if (ax6 !== null) {
                version = 6.0;
            }
        }

        if (version === 0) {
            try {
                version = numerify(
                    new ActiveXObject(sF + '.' + sF)
                        .GetVariable('$version')
                        .replace(/[A-Za-z\s]+/g, '')
                        .split(',')
                    );

            } catch (e) {
            }
        }
    } else {
        if ((mF = navigator.mimeTypes['application/x-shockwave-flash'])) {
            if ((eP = mF.enabledPlugin)) {
                version = numerify(
                    eP.description
                        .replace(/\s[rd]/g, '.')
                        .replace(/[a-z\s]+/ig, '')
                        .split('.')
                    );
            }
        }
    }

    function numerify(arr) {
        var ret = arr[0] + '.';
        switch (arr[2].toString().length) {
            case 1:
                ret += '00';
                break;
            case 2:
                ret += '0';
                break;
        }
        return (ret += arr[2]);
    }

    UA.flash = parseFloat(version);
});
/**
 * The SWF utility is a tool for embedding Flash applications in HTML pages.
 * author: lifesinger@gmail.com
 */

KISSY.add('swf', function(S) {

    var UA = S.UA,
        uid = S.now(),

        VERSION = 10.22,
        CID = 'clsid:d27cdb6e-ae6d-11cf-96b8-444553540000',
        TYPE = 'application/x-shockwave-flash',
        EXPRESS_INSTALL_URL = 'http://fpdownload.macromedia.com/pub/flashplayer/update/current/swf/autoUpdater.swf?' + uid,
        EVENT_HANDLER = 'KISSY.SWF.eventHandler',

        possibleAttributes = {align:'', allowNetworking:'', allowScriptAccess:'', base:'', bgcolor:'', menu:'', name:'', quality:'', salign:'', scale:'', tabindex:'', wmode:''};


    /**
     * Creates the SWF instance and keeps the configuration data
     *
     * @constructor
     * @param {String|HTMLElement} el The id of the element, or the element itself that the SWF will be inserted into.
     *        The width and height of the SWF will be set to the width and height of this container element.
     * @param {Object} params (optional) Configuration parameters for the Flash application and values for Flashvars
     *        to be passed to the SWF.
     */
    function SWF(el, swfUrl, params) {
        var self = this,
            id = 'ks-swf-' + uid++,
            flashVersion = parseFloat(params.version) || VERSION,
            isFlashVersionRight = UA.flash >= flashVersion,
            canExpressInstall = UA.flash >= 8.0,
            shouldExpressInstall = canExpressInstall && params.useExpressInstall && !isFlashVersionRight,
            flashUrl = (shouldExpressInstall) ? EXPRESS_INSTALL_URL : swfUrl,
            // TODO: rename
            flashvars = 'YUISwfId=' + id + '&YUIBridgeCallback=' + EVENT_HANDLER,
            ret = '<object ';

        self.id = id;
        SWF.instances[id] = self;

        if ((el = S.get(el)) && (isFlashVersionRight || shouldExpressInstall) && flashUrl) {
            ret += 'id="' + id + '" ';

            if (UA.ie) {
                ret += 'classid="' + CID + '" '
            } else {
                ret += 'type="' + TYPE + '" data="' + flashUrl + '" ';
            }

            ret += 'width="100%" height="100%">';

            if (UA.ie) {
                ret += '<param name="movie" value="' + flashUrl + '"/>';
            }

            for (var attr in params.fixedAttributes) {
                if (possibleAttributes.hasOwnProperty(attr)) {
                    ret += '<param name="' + attr + '" value="' + params.fixedAttributes[attr] + '"/>';
                }
            }

            for (var flashvar in params.flashVars) {
                var fvar = params.flashVars[flashvar];
                if (typeof fvar === 'string') {
                    flashvars += "&" + flashvar + "=" + encodeURIComponent(fvar);
                }
            }

            ret += '<param name="flashVars" value="' + flashvars + '"/>';
            ret += "</object>";

            el.innerHTML = ret;
            self.swf = S.get('#' + id);
        }
    }

    /**
     * The static collection of all instances of the SWFs on the page.
     * @static
     */
    SWF.instances = (S.SWF || { }).instances || { };

    /**
     * Handles an event coming from within the SWF and delegate it to a specific instance of SWF.
     * @static
     */
    SWF.eventHandler = function(swfId, event) {
        SWF.instances[swfId]._eventHandler(event);
    };

    S.augment(SWF, S.EventTarget);
    S.augment(SWF, {

        _eventHandler: function(event) {
            var self = this,
                type = event.type;

            if (type === 'log') {
                S.log(event.message);
            } else if(type) {
                self.fire(type, event);
            }
        },

        /**
         * Calls a specific function exposed by the SWF's ExternalInterface.
         * @param func {string} the name of the function to call
         * @param args {array} the set of arguments to pass to the function.
         */
        callSWF: function (func, args) {
            var self = this;
            if (self.swf[func]) {
                return self.swf[func].apply(self.swf, args || []);
            }
        }
    });

    S.SWF = SWF;
});
/**
 * Provides a swf based storage implementation.
 */

KISSY.add('swfstore', function(S, undefined) {

    var UA = S.UA, Cookie = S.Cookie,
        SWFSTORE = 'swfstore',
        doc = document;

    /**
     * Class for the YUI SWFStore util.
     * @constructor
     * @param el {String|HTMLElement} Container element for the Flash Player instance.
     * @param {String} swfUrl The URL of the SWF to be embedded into the page.
     * @param shareData {Boolean} Whether or not data should be shared across browsers
     * @param useCompression {Boolean} Container element for the Flash Player instance.
     */
    function SWFStore(el, swfUrl, shareData, useCompression) {
        var browser = 'other',
            cookie = Cookie.get(SWFSTORE),
            params,
            self = this;

        // convert booleans to strings for flashvars compatibility
        shareData = (shareData !== undefined ? shareData : true) + '';
        useCompression = (useCompression !== undefined ? useCompression : true) + '';

        // browser detection
        if (UA.ie) browser = 'ie';
        else if (UA.gecko) browser = 'gecko';
        else if (UA.webkit) browser = 'webkit';
        else if (UA.opera) browser = 'opera';

        // set cookie
        if (!cookie || cookie === 'null') {
            Cookie.set(SWFSTORE, (cookie = Math.round(Math.random() * Math.PI * 100000)));
        }

        params = {
            version: 9.115,
            useExpressInstall: false,
            fixedAttributes: {
                allowScriptAccess:'always',
                allowNetworking:'all',
                scale:'noScale'
            },
            flashVars: {
                allowedDomain : doc.location.hostname,
                shareData: shareData,
                browser: cookie,
                useCompression: useCompression
            }
        };

        self.embeddedSWF = new S.SWF(el, swfUrl || 'swfstore.swf', params);

        // �� flash fired events ��֪ͨ�� swfstore
        self.embeddedSWF._eventHandler = function(event) {
            S.SWF.prototype._eventHandler.call(self, event);
        }
    }

    // events support
    S.augment(SWFStore, S.EventTarget);

    // methods
    S.augment(SWFStore, {
        /**
         * Saves data to local storage. It returns a String that can
         * be one of three values: 'true' if the storage succeeded; 'false' if the user
         * has denied storage on their machine or storage space allotted is not sufficient.
         * <p>The size limit for the passed parameters is ~40Kb.</p>
         * @param data {Object} The data to store
         * @param location {String} The name of the 'cookie' or store
         * @return {Boolean} Whether or not the save was successful
         */
        setItem: function(location, data) {
            if (typeof data === 'string') { // ����ͨ��
                // double encode strings to prevent parsing error
                // http://yuilibrary.com/projects/yui2/ticket/2528593
                data = data.replace(/\\/g, '\\\\');
            } else {
                data = S.JSON.stringify(data) + ''; // ���磺stringify(undefined) = undefined, ǿ��ת��Ϊ�ַ���
            }

            // �� name Ϊ��ֵʱ��Ŀǰ�ᴥ�� swf ���ڲ��쳣���˴�������ռ�ֵ
            if ((location = S.trim(location + ''))) {
                try {
                    return this.embeddedSWF.callSWF('setItem', [location, data]);
                }
                catch(e) { // �� swf �쳣ʱ����һ��������Ϣ
                    this.fire('error', { message: e });
                }
            }
        }
    });

    S.each([
        'getValueAt', 'getNameAt', 'getTypeAt',
        'getValueOf', 'getTypeOf',
        'getItems', 'getLength',
        'removeItem', 'removeItemAt', 'clear',
        'getShareData', 'setShareData',
        'getUseCompression', 'setUseCompression',
        'calculateCurrentSize', 'hasAdequateDimensions', 'setSize',
        'getModificationDate', 'displaySettings'
    ], function(methodName) {
        SWFStore.prototype[methodName] = function() {
            try {
                return this.embeddedSWF.callSWF(methodName, S.makeArray(arguments));
            }
            catch(e) { // �� swf �쳣ʱ����һ��������Ϣ
                this.fire('error', { message: e });
            }
        }
    });

    S.SWFStore = SWFStore;
});

/**
 * TODO:
 *   - �㲥���ܣ��������б仯ʱ���Զ�֪ͨ����ҳ��
 *
 *   - Bug: ��� Remove, �� name ������ʱ���Ὣ���һ��ɾ��
 */
/*
Copyright 2010, KISSY UI Library v1.0.5
MIT Licensed
build: 537 Apr 8 19:58
*/
/**
 * �����ӳټ������
 * ���� img, textarea, �Լ��ض�Ԫ�ؼ�������ʱ�Ļص�����
 * @module      datalazyload
 * @creator     ��<lifesinger@gmail.com>
 * @depends     kissy-core, yahoo-dom-event
 */
KISSY.add('datalazyload', function(S, undefined) {

    var DOM = S.DOM, Event = S.Event, YDOM = YAHOO.util.Dom,
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
        },
        DP = DataLazyload.prototype;

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
        if (!S.isArray(containers)) {
            containers = [S.get(containers) || doc];
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

    S.mix(DP, {

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
                S.ready(function() {
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
                    Event.remove(win, 'scroll', loader);
                    Event.remove(win, 'resize', loader);
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
                imgs = S.query('img', containers[n]);

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
                        if (YDOM.getY(img) > threshold && !data_src) {
                            img.setAttribute(IMG_DATA_SRC, img.src);
                            img.src = placeholder;
                            lazyImgs.push(img);
                        }
                    }
                }

                // ���� textarea
                areaes = S.query('textarea', containers[n]);
                for (i = 0,len = areaes.length; i < len; ++i) {
                    area = areaes[i];
                    if (DOM.hasClass(area, TEXTAREA_DATA_CLS)) {
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
                scrollTop = YDOM.getDocumentScrollTop(),
                threshold = self.threshold + scrollTop,
                i, img, data_src, remain = [];

            for (i = 0; img = imgs[i++];) {
                if (YDOM.getY(img) <= threshold) {
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
                scrollTop = YDOM.getDocumentScrollTop(),
                threshold = self.threshold + scrollTop,
                i, area, el, remain = [];

            for (i = 0; area = areaes[i++];) {
                el = area;

                // ע��area ���ܴ��� display: none ״̬��Dom.getY(area) ���� undefined
                //    ����������� area.parentNode �� Y ֵ���ж�
                if(YDOM.getY(el) === undefined) {
                    el = area.parentNode;
                }

                if (YDOM.getY(el) <= threshold) {
                    self._loadDataFromArea(area.parentNode, area);
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
        _loadDataFromArea: function(container, area) {
            //container.innerHTML = area.value; // ���ַ�ʽ�ᵼ�� chrome ���� bug

            // �������ز�ȥ����ʽ
            var content = DOM.create(area.value);
            area.style.display = NONE;
            //area.value = ''; // clear content  ������գ����� F5 ˢ�£��ᶪ����
            area.className = ''; // clear hook
            container.insertBefore(content, area);

            // ִ������Ľű�
            if(!S.UA.gecko) { // firefox ���Զ�ִ�� TODO: feature test
                S.query('script', content).each(function(script) {
                    S.globalEval(script.text);
                });
            }
        },

        /**
         * �����ص�
         * @protected
         */
        _fireCallbacks: function() {
            var self = this,
                callbacks = self.callbacks,
                els = callbacks.els, fns = callbacks.fns,
                scrollTop = YDOM.getDocumentScrollTop(),
                threshold = self.threshold + scrollTop,
                i, el, fn, remainEls = [], remainFns = [];

            for (i = 0; (el = els[i]) && (fn = fns[i++]);) {
                if (YDOM.getY(el) <= threshold) {
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
            el = S.get(el);
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
                ret = YDOM.getViewportHeight();

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
            if (!S.isArray(containers)) {
                containers = [S.get(containers)];
            }

            // ��������
            S.each(containers, function(container) {
                switch (type) {
                    case 'textarea-data':
                        area = S.get('textarea', container);
                        if (area && DOM.hasClass(area, flag || CUSTOM_TEXTAREA_DATA_CLS)) {
                            self._loadDataFromArea(container, area);
                        }
                        break;
                    //case 'img-src':
                    default:
                        //S.log('loadCustomLazyData container = ' + container.src);
                        if (container.nodeName === 'IMG') { // �������ͼƬ
                            imgs = [container];
                        } else {
                            imgs = S.query('img', container);
                        }
                        for (var i = 0, len = imgs.length; i < len; i++) {
                            self._loadImgSrc(imgs[i], flag || CUSTOM_IMG_DATA_SRC);
                        }
                }
            });
        }
    });

    // attach static methods
    S.mix(DataLazyload, DP, true, ['loadCustomLazyData', '_loadImgSrc', '_loadDataFromArea']);

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
 * TODO:
 *   - [ȡ��] ����ͼƬ���ӳټ��أ����� css ��ı���ͼƬ�� sprite ���Ѵ���
 *   - [ȡ��] ����ʱ�� loading ͼ������δ�趨��С��ͼƬ��������������[�ο����� 4]��
 */

/**
 * UPDATE LOG:
 *   - 2010-04-05 yubo �ع���ʹ�ö� YUI ������������ YDOM
 *   - 2009-12-17 yubo �� imglazyload ����Ϊ datalazyload, ֧�� textarea ��ʽ�ӳٺ��ض�Ԫ�ؼ�������ʱ�Ļص�����
 */
/*
Copyright 2010, KISSY UI Library v1.0.5
MIT Licensed
build: 527 Apr 6 22:48
*/
/**
 * ��ʾ��ȫ���
 * @module      suggest
 * @creator     ��<lifesinger@gmail.com>
 * @depends     kissy-core, yahoo-dom-event
 */
KISSY.add("suggest", function(S, undefined) {

    var YDOM = YAHOO.util.Dom, DOM = S.DOM, Event = S.Event,
        win = window, doc = document,
        head = doc.getElementsByTagName("head")[0],
        ie = YAHOO.env.ua.ie, ie6 = (ie === 6),

        CALLBACK_STR = "g_ks_suggest_callback", // Լ����ȫ�ֻص�����
        STYLE_ID = "ks-suggest-style", // ��ʽ style Ԫ�ص� id

        CONTAINER_CLASS = "ks-suggest-container",
        KEY_EL_CLASS = "ks-suggest-key", // ��ʾ���У�key Ԫ�ص� class
        RESULT_EL_CLASS = "ks-suggest-result", // ��ʾ���У�result Ԫ�ص� class
        SELECTED_ITEM_CLASS = "selected", // ��ʾ���У�ѡ����� class
        ODD_ITEM_CLASS = "odd", // ��ʾ���У�������� class
        EVEN_ITEM_CLASS = "even", // ��ʾ���У�ż����� class
        BOTTOM_CLASS = "ks-suggest-bottom",
        CLOSE_BTN_CLASS = "ks-suggest-close-btn",
        SHIM_CLASS = "ks-suggest-shim", // iframe shim �� class

        EVENT_DATA_REQUEST = "dataRequest",
        EVENT_DATA_RETURN = "dataReturn",
        EVENT_SHOW = "show",
        EVENT_ITEM_SELECT = "itemSelect",

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
            containerCls: "",

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
        self.textInput = S.get(textInput);

        /**
         * ��ȡ���ݵ�URL �� JSON��ʽ�ľ�̬����
         * @type {String|Object}
         */
        self.dataSource = dataSource;

        /**
         * JSON��̬����Դ
         * @type Object ��ʽΪ {"query1" : [["key1", "result1"], []], "query2" : [[], []]}
         */
        self.JSONDataSource = S.isPlainObject(dataSource) ? dataSource : null;

        /**
         * ͨ��jsonp���ص�����
         * @type Object
         */
        self.returnedData = null;

        /**
         * ���ò���
         * @type Object
         */
        self.config = S.merge(defaultConfig, config || { });

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

                        // �������Ϊ��ʱ������ ESC ���������ʧȥ����
                        if(self.query.length === 0) {
                            self.textInput.blur();
                        }
                        break;
                    case 13: // ENTER��
                        // �ύ��ǰ����������ʾ�㲢ֹͣ��ʱ��
                        self.textInput.blur(); // ��һ�仹������ֹ���������Ĭ���ύ�¼�

                        // ����Ǽ���ѡ��ĳ���س�������onItemSelect�¼�
                        if (self._onKeyboardSelecting) {
                            if (self.textInput.value == self._getSelectedItemKey()) { // ȷ��ֵƥ��
                                self.fire(EVENT_ITEM_SELECT);
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
                            self.selectItem(keyCode === 40);

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
                customContainerClass = this.config.containerCls;

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
                r = YDOM.getRegion(self.textInput),
                left = r.left,
                w = r.right - left - 2;  // ��ȥborder��2px

            // bug fix: w Ӧ���ж����Ƿ���� 0, ������� width ��ʱ�����С�� 0, ie �»ᱨ������Ч�Ĵ���
            w = w > 0 ? w : 0;

            // ie8 ����ģʽ
            // document.documentMode:
            // 5 - Quirks Mode
            // 7 - IE7 Standards
            // 8 - IE8 Standards
            var docMode = doc.documentMode;
            if (docMode === 7 && (ie === 7 || ie === 8)) {
                left -= 2;
            } else if (S.UA.gecko) { // firefox����ƫһ���� ע���� input ���ڵĸ��������� margin: auto ʱ�����
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
                var target = ev.target;

                if (target.nodeName != "LI") {
                    target = YDOM.getAncestorByTagName(target, "li");
                }
                if (YDOM.isAncestor(self.container, target)) {
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
                // ��갴�´���item
                mouseDownItem = e.target;

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
                if (!self._isInContainer([ev.pageX, ev.pageY])) return;

                var target = ev.target;
                // ����ʾ��A�������꣬�ƶ���B���ͷţ�������onItemSelect
                if (target != mouseDownItem) return;

                // ����ڹرհ�ť��
                if (target.className == CLOSE_BTN_CLASS) {
                    self.hide();
                    return;
                }

                // ���ܵ����li����Ԫ����
                if (target.nodeName != "LI") {
                    target = YDOM.getAncestorByTagName(target, "li");
                }
                // ��������container�ڲ���li��
                if (YDOM.isAncestor(self.container, target)) {
                    self._updateInputFromSelectItem(target);

                    // ����ѡ���¼�
                    //console.log("on item select");
                    self.fire(EVENT_ITEM_SELECT);

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
            var r = YDOM.getRegion(this.container);
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
            var styleEl = S.get('#' + STYLE_ID);
            if (styleEl) return; // ��ֹ���ʵ��ʱ�ظ����

            var style = ".ks-suggest-container{background:white;border:1px solid #999;z-index:99999}"
                + ".ks-suggest-shim{z-index:99998}"
                + ".ks-suggest-container li{color:#404040;padding:1px 0 2px;font-size:12px;line-height:18px;float:left;width:100%}"
                + ".ks-suggest-container li.selected{background-color:#39F;cursor:default}"
                + ".ks-suggest-key{float:left;text-align:left;padding-left:5px}"
                + ".ks-suggest-result{float:right;text-align:right;padding-right:5px;color:green}"
                + ".ks-suggest-container li.selected span{color:#FFF;cursor:default}"
                // + ".ks-suggest-container li.selected .suggest-result{color:green}"
                + ".ks-suggest-bottom{padding:0 5px 5px}"
                + ".ks-suggest-close-btn{float:right}"
                + ".ks-suggest-container li,.suggest-bottom{overflow:hidden;zoom:1;clear:both}"
                /* hacks */
                + ".ks-suggest-container{*margin-left:2px;_margin-left:-2px;_margin-top:-3px}";

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
                    var r = YDOM.getRegion(container);
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
            if (!S.trim(q).length) {
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
            self.fire(EVENT_DATA_REQUEST);
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
            self.fire(EVENT_DATA_RETURN);

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
                    // �����ż class
                    DOM.addClass(li, i % 2 ? EVEN_ITEM_CLASS : ODD_ITEM_CLASS);
                    list.appendChild(li);
                }
                content = list;
            }
            self._fillContainer(content);

            // ������ʱ����ӵײ�
            if (len > 0) self.appendBottom();

            // fire event
            if (S.trim(self.container.innerHTML)) {
                // ʵ������beforeCache�������û��ĽǶȿ�����beforeShow
                self.fire(EVENT_SHOW);
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
            if (S.isArray(data["result"])) data = data["result"];
            var len = data.length;
            if (!len) return arr;

            var item;
            for (var i = 0; i < len; ++i) {
                item = data[i];

                if (typeof item === "string") { // ֻ��keyֵʱ
                    arr[i] = {"key" : item};
                } else if (S.isArray(item) && item.length >= 2) { // ["key", "result"] ȡ����ǰ2��
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
                if (S.trim(resultText)) { // ��ֵʱ�Ŵ���
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

                bottom.appendChild(closeBtn);
            }

            // ����������ʱ�����
            if (S.trim(bottom.innerHTML)) {
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
                newSelectedItem = YDOM[down ? "getNextSibling" : "getPreviousSibling"](self.selectedItem);
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
            DOM.removeClass(this.selectedItem, SELECTED_ITEM_CLASS);
            this.selectedItem = null;
        },

        /**
         * ���õ�ǰѡ����
         * @protected
         * @param {HTMLElement} item
         */
        _setSelectedItem: function(item) {
            //console.log("set selected item");
            DOM.addClass(item, SELECTED_ITEM_CLASS);
            this.selectedItem = item;
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

    S.mix(Suggest.prototype, S.EventTarget);

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
 *                  containerCls ��Ϊ���Ի���ʽ�Ľӿڼ���
 *
 * 2009-12-10 ���£� ���� kissy module ��֯���롣Ϊ�˱�����ɳ���£���ȫ�ֻص��������Ƕ������������⣬
 *                  ���ù���ģʽ��
 *
 * 2010-03-10 ���£� ȥ������ģʽ����Ӧ kissy �µĴ�����֯��ʽ��
 */
/*
Copyright 2010, KISSY UI Library v1.0.5
MIT Licensed
build: 543 Apr 9 08:13
*/
/**
 * Switchable
 * @creator     ��<lifesinger@gmail.com>
 * @depends     kissy-core, yui2-animation
 */
KISSY.add('switchable', function(S, undefined) {

    var DOM = S.DOM, Event = S.Event,
        doc = document,
        DISPLAY = 'display', BLOCK = 'block', NONE = 'none',
        FORWARD = 'forward', BACKWARD = 'backward',
        DOT = '.',
        EVENT_BEFORE_SWITCH = 'beforeSwitch', EVENT_SWITCH = 'switch',
        CLS_PREFIX = 'ks-switchable-',
        SP = Switchable.prototype;

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
        markupType: 0, // markup �����ͣ�ȡֵ���£�

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

        activeIndex: 0, // markup ��Ĭ�ϼ����Ӧ����� index һ��
        activeTriggerCls: 'active',

        // �ɼ���ͼ���ж��ٸ� panels
        steps: 1,

        // �ɼ���ͼ����Ĵ�С��һ�㲻��Ҫ�趨��ֵ��������ȡֵ����ȷʱ�������ֹ�ָ����С
        viewSize: []
    };

    // ���
    Switchable.Plugins = [];

    S.mix(SP, {

        /**
         * init switchable
         */
        _init: function() {
            var self = this, cfg = self.config;

            // parse markup
            if (self.panels.length === 0) {
                self._parseMarkup();
            }

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
         * ���� markup, ��ȡ triggers, panels, content
         */
        _parseMarkup: function() {
            var self = this, container = self.container,
                cfg = self.config,
                hasTriggers = cfg.hasTriggers,
                nav, content, triggers = [], panels = [], i, n, m;

            switch (cfg.markupType) {
                case 0: // Ĭ�Ͻṹ
                    nav = S.get(DOT + cfg.navCls, container);
                    if (nav) {
                        triggers = DOM.children(nav);
                    }
                    content = S.get(DOT + cfg.contentCls, container);
                    panels = DOM.children(content);
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
                triggers = self._generateTriggersMarkup(self.length);
            }

            // �� triggers �� panels ת��Ϊ��ͨ����
            self.triggers = S.makeArray(triggers);
            self.panels = S.makeArray(panels);

            // get content
            self.content = content || panels[0].parentNode;
        },

        /**
         * �Զ����� triggers �� markup
         */
        _generateTriggersMarkup: function(len) {
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
            return DOM.children(ul);
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
                    Event.on(trigger, 'click focus', function() {
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
                self.switchTimer = S.later(function() {
                    self.switchTo(index);
                }, self.config.delay * 1000);
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
            if (self.fire(EVENT_BEFORE_SWITCH, {toIndex: index}) === false) return self;

            // switch active trigger
            if (cfg.hasTriggers) {
                self._switchTrigger(activeIndex > -1 ? triggers[activeIndex] : null, triggers[index]);
            }

            // switch active panels
            if (direction === undefined) {
                direction = index > activeIndex ? FORWARD : FORWARD;
            }

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

            if (fromTrigger) DOM.removeClass(fromTrigger, activeTriggerCls);
            DOM.addClass(toTrigger, activeTriggerCls);
        },

        /**
         * �л���ͼ
         */
        _switchView: function(fromPanels, toPanels/*, index, direction*/) {
            // ��򵥵��л�Ч����ֱ������/��ʾ
            DOM.css(fromPanels, DISPLAY, NONE);
            DOM.css(toPanels, DISPLAY, BLOCK);

            // fire onSwitch
            this.fire(EVENT_SWITCH);
        },

        /**
         * �л�����һ��ͼ
         */
        prev: function() {
            var self = this, activeIndex = self.activeIndex;
            self.switchTo(activeIndex > 0 ? activeIndex - 1 : self.length - 1, BACKWARD);
        },

        /**
         * �л�����һ��ͼ
         */
        next: function() {
            var self = this, activeIndex = self.activeIndex;
            self.switchTo(activeIndex < self.length - 1 ? activeIndex + 1 : 0, FORWARD);
        }
    });

    S.mix(SP, S.EventTarget);
    
    S.Switchable = Switchable;
});

/**
 * NOTES:
 *
 * 2010.04
 *  - �ع�������� yahoo-dom-event ������
 *
 * 2010.03
 *  - �ع���ȥ�� Widget, ���ִ���ֱ�Ӳ��� kissy ������
 *  - ������ƴ� weave ֯�뷨�ĳ� hook ���ӷ�
 *
 * TODO:
 *  - http://malsup.com/jquery/cycle/
 *  - http://www.mall.taobao.com/go/chn/mall_chl/flagship.php
 * 
 * References:
 *  - jQuery Scrollable http://flowplayer.org/tools/scrollable.html
 *
 */
/**
 * Switchable Autoplay Plugin
 * @creator     ��<lifesinger@gmail.com>
 */
KISSY.add('switchable-autoplay', function(S) {

    var Event = S.Event,
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
            host.autoplayTimer = S.later(function() {
                if (host.paused) return;
                host.switchTo(host.activeIndex < host.length - 1 ? host.activeIndex + 1 : 0);
            }, cfg.interval * 1000, true);
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
 */
KISSY.add('switchable-effect', function(S) {

    var Y = YAHOO.util, DOM = S.DOM, YDOM = Y.Dom,
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
            DOM.css(fromEls, DISPLAY, NONE);
            DOM.css(toEls, DISPLAY, BLOCK);
            callback();
        },

        // ��������Ч��
        fade: function(fromEls, toEls, callback) {
            if(fromEls.length !== 1) {
                S.error('fade effect only supports steps == 1.');
            }
            var self = this, cfg = self.config,
                fromEl = fromEls[0], toEl = toEls[0];
            if (self.anim) self.anim.stop();

            // ������ʾ��һ��
            YDOM.setStyle(toEl, OPACITY, 1);

            // �����л�
            self.anim = new Y.Anim(fromEl, {opacity: {to: 0}}, cfg.duration, cfg.easing);
            self.anim.onComplete.subscribe(function() {
                self.anim = null; // free

                // �л� z-index
                YDOM.setStyle(toEl, Z_INDEX, 9);
                YDOM.setStyle(fromEl, Z_INDEX, 1);

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
                            YDOM.setStyle(panels, 'float', 'left');

                            // ��������ȣ��Ա�֤�пռ��� panels ˮƽ�Ų�
                            host.content.style.width = host.viewSize[0] * (len / steps) + 'px';
                        }
                        break;

                    // �����͸��Ч�������ʼ��͸��
                    case FADE:
                        for (i = 0; i < len; i++) {
                            YDOM.setStyle(panels[i], OPACITY, (i >= fromIndex && i <= toIndex) ? 1 : 0);
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
                fn = S.isFunction(effect) ? effect : Effects[effect];

            fn.call(self, fromEls, toEls, function() {
                self.fire('switch');
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
 */
KISSY.add('switchable-circular', function(S) {

    var RELATIVE = 'relative',
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
        self.anim = new YAHOO.util.Anim(self.content, attributes, cfg.duration, cfg.easing);
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
 */
/**
 * Switchable Lazyload Plugin
 * @creator     ��<lifesinger@gmail.com>
 */
KISSY.add('switchable-lazyload', function(S) {

    var DOM = S.DOM,
        EVENT_BEFORE_SWITCH = 'beforeSwitch',
        IMG_SRC = 'img-src',
        TEXTAREA_DATA = 'textarea-data',
        FLAGS = { },
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

            host.on(EVENT_BEFORE_SWITCH, loadLazyData);

            /**
             * �����ӳ�����
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
             * �Ƿ��Ѽ������
             */
            function isAllDone() {
                var imgs, textareas, i, len;

                if (type === IMG_SRC) {
                    imgs = S.query('img', host.container);
                    for (i = 0,len = imgs.length; i < len; i++) {
                        if (DOM.attr(imgs[i], flag)) return false;
                    }
                } else if (type === TEXTAREA_DATA) {
                    textareas = S.query('textarea', host.container);
                    for (i = 0,len = textareas.length; i < len; i++) {
                        if (DOM.hasClass(textareas[i], flag)) return false;
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
// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=gbk nobomb:
/**
 * CoversFlow
 * @author mingcheng<i.feelinglucky#gmail.com> - http://www.gracecode.com/
 * @update log:
 *    [2010-04-08] yubo: ���� & �Ż����ִ���
 */

KISSY.add('coversflow', function(S) {
    var Y = YAHOO.util, YDOM = Y.Dom, DOM = S.DOM, Event = S.Event,
        VISIBILITY = 'visibility', CLICK = 'click',
        MAGIC_NUMBER = 90,
        MAGIC_DIVISOR = 1.25,
        EVENT_BEFORE_SWITCH = 'beforeSwitch',
        EVENT_ON_CURRENT = 'onCurrent',
        EVENT_TWEEN = 'tween',
        EVENT_FINISHED = 'finished',

        /**
         * Ĭ������
         */
        defaultConfig = {
            flowLength: 4, // Max number of images on each side of the focused one
            aspectRatio: 1.964, // Aspect ratio of the ImageFlow container (width divided by height)
            step: 150, // ������ͨ�����ø���
            width: 500, // ������Ŀ�
            height: 350, // ������ĸ�
            offset: 0, // ���
            animSpeed: 50,  // ������������룩
            autoSwitchToMiddle: true, // �Զ��л����м�
            hasTriggers: false, // ������� panels
            circular: true
        };

    function CoversFlow(container, config) {
        var self = this;

        if (!(self instanceof CoversFlow)) {
            return new CoversFlow(container, config);
        }

        config = S.merge(defaultConfig, config || {});
        CoversFlow.superclass.constructor.call(self, container, config);

        self._initFlow();
    }

    S.extend(CoversFlow, S.Switchable);

    S.augment(CoversFlow, {

        _initFlow: function() {
            var self = this, config = self.config;
            
            self.busy = false;             // ����״̬
            self.curFrame = 0;             // ��ǰ����֡
            self.targetFrame = 0;          // Ŀ�����֡
            self.zIndex = self.length;     // ��� zIndex ֵ
            self.region = YDOM.getRegion(self.container); // ����������ʹ�С

            self.maxFocus = config.flowLength * config.step;
            self.maxHeight = self.region.height + Math.round(self.region.height / config.aspectRatio); // ���߶�
            self.middleLine = self.region.width / 2; // �м���

            // �¼�ע��
            self.on(EVENT_BEFORE_SWITCH, function(ev) {
                var index = ev.toIndex;

                self.perIndex = index; // Ԥ�������Ŀ��
                self.targetFrame = -index * self.config.step;
                return !self.busy;
            });

            // �Զ��л����м�
            if (config.autoSwitchToMiddle) {
                self.switchTo(Math.floor(self.length / 2));
            } else {
                self._frame(0);
            }
        },

        _switchView: function() {
            var self = this, cfg = self.config;

            if (self.targetFrame < self.curFrame - 1 || self.targetFrame > self.curFrame + 1) {
                // fire onSwitch
                self._frame(self.curFrame + (self.targetFrame - self.curFrame) / 3);
                self._timer = S.later(self._switchView, cfg.animSpeed, false, self);
                self.busy = true;
            } else {
                self.fire(EVENT_FINISHED);
                self.busy = false; // �������
            }
        },

        /**
         * ����ÿ֡����
         */
        _frame: function(frame) {
            var self = this, cfg = self.config, panels = self.panels,
                region = self.region, middleLine = self.middleLine - cfg.offset, curPanel, curImgPos;

            self.curFrame = frame; // ��ǵ�ǰ֡

            for (var index = 0, len = panels.length; index < len; index++) {
                curPanel = self.panels[index];
                curImgPos = index * -cfg.step;
                if ((curImgPos + self.maxFocus) < self.targetFrame || (curImgPos - self.maxFocus) > self.targetFrame) {
                    // ���ض���ķ���
                    DOM.css(curPanel, VISIBILITY, 'hidden');
                } else {
                    // ������������
                    var x = (Math.sqrt(10000 + frame * frame) + 100), xs = frame / x * middleLine + middleLine;
                    var height = (cfg.width / cfg.height * MAGIC_NUMBER) / x * middleLine, width = 0;

                    if (height > self.maxHeight) {
                        height = self.maxHeight;
                    }
                    width = cfg.width / cfg.height * height;

                    // ���㲢���õ�ǰλ��
                    DOM.css(curPanel, 'left', xs - (MAGIC_NUMBER / MAGIC_DIVISOR) / x * middleLine + 'px');
                    if (height && width) {
                        DOM.css(curPanel, 'height', height + 'px');
                        DOM.css(curPanel, 'width', width + 'px');
                        DOM.css(curPanel, 'top', region.height / 2 - height / 2 + 'px');
                    }
                    DOM.css(curPanel, 'zIndex', self.zIndex * 100 - Math.ceil(x));
                    DOM.css(curPanel, VISIBILITY, 'visible');

                    // �󶨵���¼�
                    self._bindPanel(curPanel, index);
                }

                self.fire(EVENT_TWEEN, { panel: curPanel, index: index });
                frame += cfg.step;
            }
        },

        /**
         * ���¼�
         */
        _bindPanel: function(curPanel, index) {
            var self = this;

            Event.remove(curPanel);

            if (self.perIndex === index) {
                Event.add(curPanel, CLICK, function() {
                    return self.fire(EVENT_ON_CURRENT, { panel: curPanel, index: index });
                });
            } else {
                Event.add(curPanel, CLICK, function(ev) {
                    ev.preventDefault();
                    self.switchTo(index);
                });
            }
        }
    });

    S.CoversFlow = CoversFlow;

});

/**
 * TODO:
 *   - ��һ���Ż��㷨�Ͳ��� api
 */
