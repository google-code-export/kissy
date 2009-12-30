/*
Copyright (c) 2010, Kissy UI Library. All rights reserved.
MIT Licensed.
http://kissy.googlecode.com/

Date: 2009-12-30 15:58:31
Revision: 383
*/
/**
 * ���õ�ԭ��������
 * ע������ҳ����Ҫԭ���ű�ʱ�����ô���ķ�������������£���ֱ�ӵ��� YUI �ķ�����
 * @creator     ��<yubo@taobao.com>
 * @depends     kissy
 */

KISSY.add("basic-util", function(S) {

    var win = window, doc = document, decode = decodeURIComponent,
        ua = navigator.userAgent.toLowerCase(),
        ie = /msie/.test(ua) && !/opera/.test(ua),
        //ie6 = ie && !/msie 7/.test(ua) && !/msie 8/.test(ua),
        get = function(id) {
            return typeof(id) !== "string" ? id : doc.getElementById(id);
        };

    S.BasicUtil = {

        /**
         * ���� id ��ȡԪ��
         */
        get: get,

        /**
         * ���� class ��ȡԪ��
         */
        getElementsByClassName: function(className, tag, root) {
            var ret = [],
                els = (get(root) || doc).getElementsByTagName(tag || "*"),
                reg = new RegExp("(^| )" + className + "( |$)", "i");

            for (var i = 0, l = els.length; i < l; i++) {
                if (reg.test(els[i].className)) {
                    ret.push(els[i]);
                }
            }
            return ret;
        },

        /**
         * �ж� el �Ƿ���ĳ�� class
         */
        hasClass: function(el, className) {
            el = get(el);
            if (!className || !el.className) return false;

            return (" " + el.className + " ").indexOf(" " + className + " ") > -1;
        },

        /**
         * �� el ��� class
         */
        addClass: function(el, className) {
            if (!className) return;
            el = get(el);
            if (this.hasClass(el, className)) return;

            el.className += " " + className;
        },

        /**
         * ɾ�� el ��ĳ�� class
         */
        removeClass: function(el, className) {
            el = get(el);
            if (!this.hasClass(el, className)) return;

            el.className = (" " + el.className + " ").replace(" " + className + " ", " ");
            if (this.hasClass(el, className)) {
                this.removeClass(el, className);
            }
        },

        /**
         * ����¼�
         */
        addEvent: function () {
            if (win.addEventListener) {
                return function(el, type, fn, capture) {
                    get(el).addEventListener(type, fn, !!capture);
                };
            } else if (win.attachEvent) {
                return function(el, type, fn) {
                    get(el).attachEvent("on" + type, function() {
                        fn.apply(el);
                    });
                };
            }
        }(),

        /**
         * �Ƴ��¼�
         */
        removeEvent: function() {
            if (win.removeEventListener) {
                return function (el, type, fn, capture) {
                    el.removeEventListener(type, fn, !!capture);
                };
            } else if (win.detachEvent) {
                return function (el, type, fn) {
                    el.detachEvent("on" + type, fn);
                };
            }
        }(),

        /**
         * ��ȡָ�� Cookie ֵ
         */
        getCookie: function(name) {
            var m = doc.cookie.match("(?:^|;)\\s*" + name + "=([^;]*)");
            return (m && m[1]) ? decode(m[1]) : "";
        },


        /**
         * ��ȡ�����˵Ŀհ��ַ�
         */
        trim: function(str) {
            return str.replace(/^\s+|\s+$/g, "");
        },

        /**
         * �� a=b&c=d ����Ϊ { a: b, c: d }
         */
        parseQueryParams: function(str) {
            var ret = {}, params = str.split("&"),
                p, pos, k, v;
            for (var i = 0, len = params.length; i < len; ++i) {
                p = params[i];
                pos = p.indexOf("=");
                k = p.slice(0, pos);
                v = p.slice(pos + 1);
                ret[decode(k)] = decode(v);
            }
            return ret;
        },

        /**
         * ��ȡ��ǰ hostname �� domain
         * Ĭ�Ϸ���һ�����磺
         *     www.daily.taobao.net -> daily.taobao.net
         *     shop.taobao.com      -> taobao.com
         * @param {number} deep ָ�����ټ������� deep = 2, �� www.xyz.taobao.com -> taobao.com
         * ע�⣺���� sina.com.cn �����������������������������Ҫ�ֶ�ָ�� deep
         */
        pickDomain: function(deep, hostname) {
            hostname = hostname || location.hostname;
            var arr = hostname.split("."), len = arr.length;
            if (len <= 2) return hostname; // ������� taobao.com ���ֶ�����ʱ��ֱ�ӷ���

            deep = deep || 1; // Ĭ�ϼ���һ��
            if (deep > len - 2) deep = len - 2; // deep ����ʱ�����ٱ���������

            return arr.slice(deep).join(".");
        },

        /**
         * �򵥵��첽��ȡ js
         */
        getScript: function (url, callback, charset) {
            var node = doc.createElement("script");

            node.charset = charset || doc.charset || doc.characterSet;
            node.src = url;

            if (typeof callback === "function") {
                if (ie) {
                    node.onreadystatechange = function() {
                        var rs = node.readyState;
                        if (rs === "loaded" || rs === "complete") {
                            node.onreadystatechange = null;
                            callback();
                        }
                    };
                } else {
                    node.onload = callback;
                }
            }

            doc.getElementsByTagName("head")[0].appendChild(node);
        },

        /**
         * �򵥵� onDomReady ģ�ⷽ��
         */
        onReady:  function(callback) {
            if (ie) {
                var timer = setInterval(function() {
                    try {
                        doc.documentElement.doScroll("left");
                        clearInterval(timer);
                        callback();
                    } catch (ex) {
                    }
                }, 50);
            } else { // FireFox, Opera, Safari 3+
                window.addEventListener("load", callback, false);
            }

        }
    };
});
