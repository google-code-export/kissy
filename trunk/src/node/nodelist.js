/**
 * @module  nodelist
 * @author  lifesinger@gmail.com
 * @depends kissy, dom
 */

KISSY.add('nodelist', function(S) {

    var DOM = S.DOM,
        push = Array.prototype.push,
        NP = NodeList.prototype;

    /**
     * The NodeList class provides a wrapper for manipulating DOM NodeList.
     */
    function NodeList(domNodes) {
        // factory or constructor
        if (!(this instanceof NodeList)) {
            return new NodeList(domNodes);
        }

        // push nodes
        push.apply(this, domNodes || []);
    }

    S.mix(NP, {

        /**
         * Ĭ�ϳ���Ϊ 0
         */
        length: 0,

        /**
         * Applies the given function to each Node in the NodeList. 
         * @param fn The function to apply. It receives 3 arguments: the current node instance, the node's index, and the NodeList instance
         * @param context An optional context to apply the function with Default context is the current Node instance
         */
        each: function(fn, context) {
            var len = this.length, i = 0, node;
            for (; i < len; ++i) {
                node = new S.Node(this[i]);
                fn.call(context || node, node, i, this);
            }
            return this;
        }
    });

    // query api
    S.all = function(selector, context) {
        return new NodeList(S.query(selector, context, true));
    };

    S.NodeList = NodeList;
});

/**
 * Notes:
 *
 *  2010.04
 *   - each �������� fn �� this, �� jQuery ��ָ��ԭ�������������Ա����������⡣
 *     �����û��ǶȽ���this �ĵ�һֱ���� $(this), kissy �� yui3 ����һ�£�����
 *     ���ܣ�һ������Ϊ�ס�
 *   - ���� each �������ƺ�������Ҫ import ���� dom ���������岻��
 *   - dom �ǵͼ� api, node ���м� api, ���Ƿֲ��һ��ԭ�򡣻���һ��ԭ���ǣ����
 *     ֱ���� node ��ʵ�� dom �������򲻴�ý� dom �ķ�����ϵ� nodelist ���
 *     ��˵�������ɱ�����Լ api ��ơ�
 *
 */