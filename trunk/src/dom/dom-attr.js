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

        RE_SPECIAL_ATTRS = /href|src|style/,
        RE_NORMALIZED_ATTRS = /href|src|colspan|rowspan/,
        RE_RETURN = /\r/g,
        RE_RADIO_CHECK = /radio|checkbox/,

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
         * Gets the value of an attribute for the first element in the set of matched elements or
         * Sets an attribute for the set of matched elements.
         */
        attr: function(selector, name, val) {
            if(!(name = S.trim(name))) return;

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
            if(value === undefined) {
                // supports css selector/Node/NodeList
                var el = S.get(selector);

                // only gets value on element nodes
                if (!isElementNode(el)) {
                    return undefined;
                }

                // ��û���趨 value ʱ����׼����� option.value === option.text
                // ie7- �£�û���趨 value ʱ��option.value === '', ��Ҫ�� el.attributes.value ���ж��Ƿ����趨 value
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
                if(UA.webkit && RE_RADIO_CHECK.test(el.type)) {
                    return el.getAttribute('value') === null ? 'on' : el.value;
                }

                // ��ͨԪ�ص� value, ��һ���� \r
                return (el.value || '').replace(RE_RETURN, '');
            }

            // setter
            S.each(S.query(selector), function(el) {
                if (nodeNameIs('select', el)) {
                    var vals = S.makeArray(value),
                        opts = el.options, opt;

                    for (i = 0, len = opts.length; i < len; ++i) {
                        opt = opts[i];
                        opt.selected = S.inArray(S.DOM.val(opt), vals);
                    }

                    if (!vals.length) {
                        el.selectedIndex = -1;
                    }
                }
                else if(isElementNode(el)) {
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

                // only gets value on element nodes
                if (isElementNode(el)) {
                    return el[TEXT] || '';
                }
            }
            // setter
            else {
                S.each(S.query(selector), function(el) {
                   if(isElementNode(el)) {
                       el[TEXT] = val;
                   }
                });
            }
        }
    });

    // �ж� el �� nodeName �Ƿ�ָ��ֵ
    function nodeNameIs(val, el) {
        return el && el.nodeName.toUpperCase() === val.toUpperCase();
    }

    // �ǲ��� element node
    function isElementNode(el) {
        return el && el.nodeType === 1;
    }
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
