/**
 * @module  lang
 * @author  lifesinger@gmail.com
 * @depends kissy
 */

KISSY.add('lang', function(S, undefined) {

    var AP = Array.prototype,
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
        inArray: indexOf ?
                 function(elem, arr) {
                     return indexOf.call(arr, elem) !== -1;
                 } :
                 function(elem, arr) {
                     for (var i = 0, len = arr.length; i < len; ++i) {
                         if (arr[i] === elem) {
                             return true;
                         }
                     }
                     return false;
                 },

        makeArray: function(obj) {
            if (obj === null) return [];
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
            if (typeof str !== 'string' || (str = decodeURI(S.trim(str))).length === 0) return {};

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
        }
    });

    function isValidParamValue(val) {
        var t = typeof val;
        // val Ϊ null, undefined, number, string, boolean ʱ������ true
        return val === null | (t !== 'object' && t !== 'function');
    }

});

/**
 * Notes:
 *
 *  2010.04
 *   - param �� unparam Ӧ�÷���ʲô�ط����ʣ��е���ᣬĿǰ�ݷŴ˴���
 *   - ���� param, encodeURI �Ϳ����ˣ��� jQuery ����һ�¡�
 *   - param �� unparam �ǲ���ȫ����ġ��Կ�ֵ�Ĵ���� cookie ����һ�¡�
 *
 */
