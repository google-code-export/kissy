/**
 * @module  dom-base
 * @author  lifesinger@gmail.com
 * @depends kissy, selector
 */

KISSY.add('dom-base', function(S, undefined) {

    var doc = document,
        docElement = doc.documentElement,
        TEXT = docElement.textContent !== undefined ? 'textContent' : 'innerText',
        ie = S.UA.ie,
        oldIE = ie && ie < 8,
        CUSTOM_ATTRS = {
            readonly: 'readOnly'
        },
        REG_SPECIAL_ATTRS = /href|src|style/,
        REG_NORMALIZED_ATTRS = /href|src|colspan|rowspan/,
        SPACE = ' ';

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
                if(!REG_SPECIAL_ATTRS.test(name)) {
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
                if (oldIE && REG_NORMALIZED_ATTRS.test(name)) {
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
        css: function(/*el, prop, val*/) {
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
        html: function(/*el, htmlString*/) {
            // TODO
        },

        /**
         * Get the current value of the HTMLElement.
         */
        val: function(/*el, value*/) {
            // TODO
        },

        /**
         * Creates a new HTMLElement using the provided html string.
         */
        create: function(/*htmlString, ownerDocument*/) {
            // TODO
            S.error('not implemented');
        }
    };

    // for quick access
    var hasClass = S.DOM.hasClass,
        addClass = S.DOM.addClass,
        removeClass = S.DOM.removeClass;
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
 */