/**
 * @module  dom-attr
 * @author  lifesinger@gmail.com
 */
KISSY.add('dom-attr', function(S, undefined) {

    var UA = S.UA,
        ie = UA.ie,
        oldIE = ie && ie < 8,

        RE_SPECIAL_ATTRS = /href|src|style/,
        RE_NORMALIZED_ATTRS = /href|src|colspan|rowspan/,

        CUSTOM_ATTRS = {
            readonly: 'readOnly'
        };

    if(oldIE) {
        S.mix(CUSTOM_ATTRS, {
            'for': 'htmlFor',
            'class': 'className'
        });
    }

    S.mix(S.DOM, {

        /**
         * Gets or sets the attribute of the HTMLElement.
         */
        attr: function(el, name, val) {
            if(!(name = S.trim(name))) return;

            name = name.toLowerCase();
            name = CUSTOM_ATTRS[name] || name;

            // get attribute
            if (val === undefined) {
                // supports css selector/Node/NodeList
                el = S.get(el);

                // only get attributes on element nodes
                if (!el || el.nodeType !== 1) {
                    return undefined;
                }

                var ret;

                // ������ el[name] ��ȡ mapping ����ֵ��
                //  - ������ȷ��ȡ readonly, checked, selected ������ mapping ����ֵ
                //  - ���Ի�ȡ�� getAttribute ��һ���ܻ�ȡ����ֵ������ tabindex Ĭ��ֵ
                //  - href, src ֱ�ӻ�ȡ���� normalized ���ֵ���ų���
                //  - style ��Ҫ�� getAttribute ����ȡ�ַ���ֵ��Ҳ�ų���
                if(!RE_SPECIAL_ATTRS.test(name)) {
                    ret = el[name];
                }
                
                // �� getAttribute ��ȡ�� mapping ���Ժ� href/src/style ��ֵ��
                if(ret === undefined) {
                    ret = el.getAttribute(name);
                }

                // fix ie bugs
                if (oldIE) {
                    // ������ href, src, ���� rowspan �ȷ� mapping ���ԣ�Ҳ��Ҫ�õ� 2 ����������ȡԭʼֵ
                    if(RE_NORMALIZED_ATTRS.test(name)) {
                        ret = el.getAttribute(name, 2);
                    }
                    // �ڱ�׼������£��� getAttribute ��ȡ style ֵ
                    // IE7- �£���Ҫ�� cssText ����ȡ
                    else if(name === 'style') {
                        ret = el.style.cssText;
                    }
                }

                // ���ڲ����ڵ����ԣ�ͳһ���� undefined
                return ret === null ? undefined : ret;
            }

            // set attribute
            S.each(S.query(el), function(elem) {
                // only set attributes on element nodes
                if (!elem || elem.nodeType !== 1) {
                    return;
                }

                if (oldIE && name === 'style') {
                    elem.style.cssText = val;
                }
                else {
                    // convert the value to a string (all browsers do this but IE)
                    elem.setAttribute(name, '' + val);
                }
            });
        },

        /**
         * Removes the attribute of the HTMLElement.
         */
        removeAttr: function(el, name) {
            S.each(S.query(el), function(elem) {
                if (elem && elem.nodeType === 1) {
                    elem.removeAttribute(name);
                }
            });
        }
    });
});

/**
 * NOTES:
 *
 * 2010.03
 *  - �� jquery/support.js �У�special attrs �ﻹ�� maxlength, cellspacing,
 *    rowspan, colspan, useap, frameboder, �����Է��֣��� Grade-A ���������
 *    ���޼��������⡣
 *  - �� colspan/rowspan ����ֵ��������ʱ��ie7- ���Զ��������� href һ������Ҫ����
 *    �� 2 �������������jQuery δ���ǣ����ڼ����� bug.
 *  - jQuery ������δ��ʽ�趨 tabindex ʱ�����ļ������⣬kissy ����ԣ�̫�������ˣ�
 *  - jquery/attributes.js: Safari mis-reports the default selected
 *    property of an option �� Safari 4 �����޸�
 *
 */
