/**
 * @module  selector
 * @author  lifesinger@gmail.com
 * @depends kissy, dom
 */

KISSY.add('selector', function(S, undefined) {

    var doc = document,
        STRING = 'string',
        SPACE = ' ',
        slice = Array.prototype.slice,
        REG_ID = /^#[\w-]+$/,
        REG_QUERY = /^(?:#([\w-]+))?\s*([\w-]+)?\.?([\w-]+)?$/;

    /**
     * Retrieves an Array of HTMLElement based on the given CSS selector.
     * @param {string} selector
     * @param {string|HTMLElement} context An id string or a HTMLElement used as context
     * @return {Array} The array of found HTMLElement
     */
    S.query = function(selector, context) {
        var match, t, ret = [], id, tag, cls;

        // Ref: http://ejohn.org/blog/selectors-that-people-actually-use/        
        // ���� 2/8 ԭ�򣬽�֧������ѡ������
        // #id
        // tag
        // .cls
        // #id tag
        // #id .cls
        // tag.cls
        // #id tag.cls
        // ע�⣺REG_QUERY ����ƥ�� #id.cls ��Чֵ
        // ����ֵΪ���飬û�ҵ�ʱ���ؿ�����
        // ���ѡ��������������б��У����߲����Ƿ���ͳͳ���쳣

        // selector Ϊ�ַ������������������ȿ���
        // ע�����ַ��������жϣ�������ȥ�Զ��ܷ��ؿ�����
        if (typeof selector === STRING) {
            selector = S.trim(selector);

            // selector Ϊ #id �����������������Ż�����
            if (REG_ID.test(selector)) {
                t = getElementById(selector.slice(1));
                if (t) ret = [t]; // #id ��Чʱ�����ؿ�����
            }
            // selector Ϊ֧���б��е����� 6 ��
            else if (match = REG_QUERY.exec(selector)) {
                // ��ȡƥ�������Ϣ
                id = match[1];
                tag = match[2];
                cls = match[3];

                if (id) {
                    // ����˴������ܵ����Ϊ��#id tag, #id .cls, #id tag.cls, #id.cls
                    // ���� #id.cls ����Чѡ����

                    t = getElementById(id);

                    // #id tag
                    if (tag && !cls) {
                        ret = getElementsByTagName(t, tag);
                    }
                    // #id .cls or #id tag.cls
                    else {
                        if (selector.indexOf(SPACE) !== -1) { // �ų� #id.cls
                            ret = getElementsByClassName(cls, tag, t);
                        }
                    }
                }
                else {
                    context = tuneContext(context);

                    // .class or tag.class
                    if (cls) {
                        ret = getElementsByClassName(cls, tag, context);
                    }
                    // tag
                    else if(tag) { // ע�������ж� tag, ����ȥ�� selector Ϊ�հ��ַ��������
                        ret = getElementsByTagName(context, tag);
                    }
                }
            }
        }
        // ����� selector �� Node
        else if (selector.nodeType) {
            ret = [selector];
        }
        // ����� selector �� NodeList
        else if (selector.item) {
            ret = selector;
        }
        // ����� selector ������ֵʱ�����ؿ�����

        // �� NodeList ת��Ϊ��ͨ���飬�������ʹ�÷���
        return attachMethods(ret.item ? makeArray(ret) : ret);
    };

    // ���� context
    function tuneContext(context) {
        // 1). context Ϊ undefined ���������������ȿ��ǡ�
        if (context === undefined) {
            context = doc;
        }
        // 2). context �ĵڶ�ʹ�ó����Ǵ��� #id
        else if (typeof context === STRING && REG_ID.test(context)) {
            context = getElementById(context.slice(1));
            // ע��#id ������Ч����ʱ��ȡ�� context Ϊ null. ������Ĵ����л��׳�Ԥ�ڵ��쳣��
        }
        // 3). context �����Դ��� HTMLElement, ��ʱ���账��
        // 4). ������������� context �Ĵ���ֵ������Ĵ����Զ����׳��쳣��
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

    // query .cls
    function getElementsByClassName(cls, tag, context) {
        var els = context.getElementsByTagName(tag || '*'),
            ret = [], i = 0, j = 0, len = els.length, el, t;

        cls = SPACE + cls + SPACE;
        for (; i < len; i++) {
            el = els[i];
            t = el.className;
            if (t && (SPACE + t + SPACE).indexOf(cls) > -1) {
                ret[j++] = el;
            }
        }
        return ret;
    }

    // ��ԭ���� getElementsByClassName
    if (doc.getElementsByClassName) {
        getElementsByClassName = function(cls, tag, context) {
            var els = context.getElementsByClassName(cls),
                ret = els, i = 0, j = 0, len = els.length, el;

            if (tag) {
                ret = [];
                tag = tag.toUpperCase();
                for (; i < len; i++) {
                    el = els[i];
                    if (el.tagName === tag) {
                        ret[j++] = el;
                    }
                }
            }
            return ret;
        }
    }
    // ��ԭ���� querySelectorAll
    else if (doc.querySelectorAll) {
        getElementsByClassName = function(cls, tag, context) {
            return context.querySelectorAll((tag ? tag : '') + '.' + cls);
        }
    }

    // �� NodeList ת��Ϊ��ͨ����
    function makeArray(nodeList) {
        return slice.call(nodeList, 0);
    }

    // ie ��֧�� slice ת�� NodeList, ��������ͨ����
    try {
        slice.call(doc.documentElement.childNodes, 0);
    }
    catch(e) {
        makeArray = function(nodeList) {
            var ret = [], i, len;
            for (i = 0,len = nodeList.length; i < len; i++) {
                ret[i] = nodeList[i];
            }
            return ret;
        }
    }

    // ���ʵ�÷����� arr ��
    function attachMethods(arr) {
        return S.mix(arr, S.Dom);
    }

});

/**
 * NOTES:
 *
 * 2010.01:
 *  - �� reg exec �Ľ��(id, tag, className)�� cache, ���ֶ�����Ӱ���С��ȥ��
 *  - getElementById ʹ��Ƶ����ߣ�ʹ��ֱ��ͨ���Ż�
 *  - getElementsByClassName �������� querySelectorAll, �� IE ϵ�в�֧��
 *  - new Node() ���� Node �ܼ򵥣��ڴ���ѭ���£�������Ҳ�������Խ���
 *  - instanceof ��������Ӱ��
 *
 * References:
 *  - querySelectorAll context ��ע��㣺http://ejohn.org/blog/thoughts-on-queryselectorall/
 */