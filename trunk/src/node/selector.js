/**
 * @module  node
 * @author  lifesinger@gmail.com
 * @depends kissy, node
 */

KISSY.add('node-selector', function(S) {

    var doc = document,
        Node = S.Node,
        STRING = 'string',
        REG_QUERY = /^(#([\w-]+)?\s?|^)([\w-]+)?\.?(\w+)?$/;

    /**
     * Retrieves a Node or an Array of Nodes based on the given CSS selector.
     * @param {string} selector
     * @param {string|HTMLElement|Node} context A #id string, DOM Element, or Node to use as context.
     * @param {boolean} dom If false, return Node, else return DOM Element. default is false.
     */
    S.query = function(selector, context, dom) {
        var match, ret, id, tag, className, i, len;

        // selector ����Ϊ��Ч���ַ�����������������ô��ȥ
        if (typeof selector !== STRING || !selector) {
            return selector;
        }

        // �� context ת��Ϊԭ�� DOM Ԫ��
        context = context || doc;
        if (typeof context === STRING) {
            context = getElementById(context);
        } else if (context instanceof Node) {
            context = context.dom();
        }

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
            ret = getElementById(id); // case: #id

            if(tag && !className) { // case: #id tag
                ret = getElementsByTagName(ret, tag);

            } else if(className) { // case: #id .class or #id tag.class
                ret = getElementsByClassName(className, tag, ret);
            }

        } else if(className) { // case: .class or tag.class
            ret = getElementsByClassName(className, tag, context);

        } else if(tag) { // case: tag
            ret = getElementsByTagName(ret, tag);
        }

        // ���ص�������
        if(!('length' in ret)) {
            return dom ? ret : Node(ret);
        }

        // ��������
        var arr = [];
        for(i = 0, len = ret.length; i < len; i++) {
            arr[i] = dom ? ret : Node(ret[i]);
        }
        return arr;
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
        var ret = [],
            els =  context.getElementsByTagName(tag || '*'),
            i = 0, el,
            len = els.length;

        className = ' ' + className + ' ';
        while(i++ < len){
            el = els[i];
            if ((' ' + el.className + ' ').indexOf(className) !== -1) {
                ret[i] = el;
            }
        }

        return ret;
    }
});
