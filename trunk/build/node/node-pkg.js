/*
Copyright 2010, KISSY UI Library v1.0.5
MIT Licensed
build: 521 Apr 5 12:27
*/
/**
 * @module  node
 * @author  lifesinger@gmail.com
 * @depends kissy, dom
 */

KISSY.add('node', function(S) {

    var DOM = S.DOM,
        Event = S.Event,
        NP = Node.prototype;

    /**
     * The Node class provides a wrapper for manipulating DOM Node.
     */
    function Node(html, props, ownerDocument) {
        var self = this, domNode;

        // factory or constructor
        if (!(self instanceof Node)) {
            return new Node(html, props, ownerDocument);
        }

        // handle Node(''), Node(null), or Node(undefined)
        if (!html) {
            return null;
        }

        // handle Node(HTMLElement)
        if (html.nodeType) {
            domNode = html;
        }
        else if (typeof html === 'string') {
            domNode = DOM.create(html, ownerDocument);
        }

        if (props) {
            S.error('not implemented'); // TODO
        }

        self[0] = domNode;
    }

    // import dom methods
    S.each(['attr', 'removeAttr'],
        function(methodName) {
            NP[methodName] = function(name, val) {
                var domNode = this[0];
                if(val === undefined) {
                    return DOM[methodName](domNode, name);
                } else {
                    DOM[methodName](domNode, name, val);
                    return this;
                }
            }
        });

    S.each(['val', 'text'],
            function(methodName) {
                NP[methodName] = function(val) {
                    var domNode = this[0];
                    if(val === undefined) {
                        return DOM[methodName](domNode);
                    } else {
                        DOM[methodName](domNode, val);
                        return this;
                    }
                }
            });

    S.each(['hasClass', 'addClass', 'removeClass', 'replaceClass', 'toggleClass'],
        function(methodName) {
            NP[methodName] = function() {
                var ret = DOM[methodName].apply(DOM, [this[0]].concat(S.makeArray(arguments)));
                // ֻ�� hasClass �з���ֵ
                return typeof ret === 'boolean' ? ret : this;
            }
        });

    // import event methods
    S.mix(NP, S.EventTarget);
    NP._addEvent = function(type, handle) {
        S.Event._simpleAdd(this[0], type, handle);
    };
    delete NP.fire;    

    // add more methods
    S.mix(NP, {

        /**
         * Retrieves a node based on the given CSS selector.
         */
        one: function(selector) {
            return S.one(selector, this[0]);
        },

        /**
         * Retrieves a nodeList based on the given CSS selector.
         */
        all: function(selector) {
            return S.all(selector, this[0]);
        }

    });

    // query api
    S.one = function(selector, context) {
        return new Node(S.get(selector, context));
    };

    S.Node = Node;
});
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