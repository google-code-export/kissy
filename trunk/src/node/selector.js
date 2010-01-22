/**
 * @module  node
 * @author  lifesinger@gmail.com
 * @depends kissy, node
 */

KISSY.add('node-selector', function(S, undefined) {

    var doc = document,
        STRING = 'string',
        supportGBCN = doc.getElementsByClassName,
        slice = Array.prototype.slice,
        REG_ID = /^#[\w-]+$/,
        REG_QUERY = /^(#([\w-]+)?\s?|^)([\w-]+)?\.?(\w+)?$/;

    /**
     * Retrieves a Node or an Array of Nodes based on the given CSS selector.
     * @param {string} selector
     * @param {string|HTMLElement|Node} context A #id string, DOM Element, or Node to use as context.
     */
    S.query = function(selector, context) {
        var match, ret = [], id, tag, className, arr = [], i, len;

        // selector ����Ϊ��Ч���ַ�����������������ô��ȥ
        if (typeof selector !== STRING || !selector) {
            return selector;
        }

        // �� context ת��Ϊԭ�� DOM Ԫ��
        if (context === undefined) {
            context = doc;
        } else if (typeof context === STRING) {
            context = getElementById(context);
        } else if (context instanceof Node) {
            context = context.dom();
        }

        // Ϊ #id �Ż�
        if (REG_ID.test(selector)) { // case: #id
            ret = [getElementById(selector.slice(1))];
        }
        else {
            // ���� 2/8 ԭ�򣬽�֧������ѡ������
            // #id
            // .class
            // tag
            // tag.class
            // #id tag
            // #id .class
            // #id tag.class
            // Ref: http://ejohn.org/blog/selectors-that-people-actually-use/
            // ������ƥ�����Ҫ����Ϣ
            if (match = REG_QUERY.exec(selector)) {
                id = match[2];
                tag = match[3];
                className = match[4];
            }

            // �����ڲ���������ȡ��������������Ԫ��
            if (id) {
                ret = getElementById(id);

                if (tag && !className) { // case: #id tag
                    ret = getElementsByTagName(ret, tag);

                } else if (className) { // case: #id .class or #id tag.class
                    ret = getElementsByClassName(className, tag, ret);
                }

            } else if (className) { // case: .class or tag.class
                ret = getElementsByClassName(className, tag, context);

            } else if (tag) { // case: tag
                ret = getElementsByTagName(context, tag);
            }
        }

        // �� ret ת��Ϊ��ͨ���飬������� Node StaticMethods
        for (i = 0,len = ret.length; i < len; i++) {
            arr[i] = ret[i];
        }
        return S.mix(arr, S.Node.StaticMethods);
    };


    // case: #id
    function getElementById(id) {
        return doc.getElementById(id);
    }

    // case: tag
    function getElementsByTagName(el, tag) {
        return el.getElementsByTagName(tag);
    }

    // case: .class
    function getElementsByClassName(className, tag, context) {
        var els = context.getElementsByTagName(tag || '*'),
            ret = [], i, el, len, cls;

        className = ' ' + className + ' ';
        for (i = 0,len = els.length; i < len; i++) {
            el = els[i];
            cls = el.className;
            if (cls && (' ' + cls + ' ').indexOf(className) !== -1) {
                ret.push(el);
            }
        }
        return ret;
    }

    if (supportGBCN || doc.querySelectorAll) {
        getElementsByClassName = function(className, tag, context) {
            var els = supportGBCN ?
                      context.getElementsByClassName(className) :
                      context.querySelectorAll('.' + className),
                ret = els, i, el, len;

            if (tag) {
                ret = [];
                tag = tag.toUpperCase();
                for (i = 0,len = els.length; i < len; i++) {
                    el = els[i];
                    if (el.tagName === tag) {
                        ret.push(el);
                    }
                }
            }
            return ret;
        }
    }

    // �� NodeList ת��Ϊ��ͨ����
    function convertNodeListToArray(arr) {
        return slice.call(arr, 0);
    }

    try {
        slice.call(doc.documentElement.childNodes, 0);
    }
    catch(e) {
        convertNodeListToArray = function(arr) {
            var ret = [], i, len;
            for (i = 0, len = arr.length; i < len; i++) {
                ret[i] = arr[i];
            }
            return ret;
        }
    }
});

/**
 * NOTES:
 *
 * 2010-01-21:
 *  - �� reg exec �Ľ��(id, tag, className)�� cache, ���ֶ�����Ӱ���С��ȥ��
 *  - getElementById ʹ��Ƶ����ߣ�ʹ��ֱ��ͨ���Ż�
 *  - getElementsByClassName �������� querySelectorAll, �� IE ϵ�в�֧��
 *  - new Node() ���� Node �ܼ򵥣��ڴ���ѭ���£�������Ҳ�������Խ���
 *  - instanceof ��������Ӱ��
 *
 * References:
 *  - querySelectorAll context ��ע��㣺http://ejohn.org/blog/thoughts-on-queryselectorall/
 */