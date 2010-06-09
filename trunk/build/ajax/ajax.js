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
 */
