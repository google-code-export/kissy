/**
 * @module  dom-traversal
 * @author  lifesinger@gmail.com
 */
KISSY.add('dom-traversal', function(S, undefined) {

    var DOM = S.DOM,
        isElementNode = DOM._isElementNode;

    S.mix(DOM, {

        /**
         * Gets the children of the first matched element.
         */
        children: function(elem) {
            var ret = [];
            if ((elem = S.get(elem))) {
                // ֻ�� firefox �ĵͰ汾��֧�� children
                ret = elem.children ? S.makeArray(elem.children) : getSiblings(elem.firstChild);
            }
            return ret;
        },

        /**
         * Gets the siblings of the first matched element.
         */
        siblings: function(elem) {
            var ret = [];
            if ((elem = S.get(elem)) && elem.parentNode) {
                ret = getSiblings(elem.parentNode.firstChild, elem);
            }
            return ret;
        },

        /**
         * Gets the immediately following sibling of the element.
         */
        next: function(elem, n) {
            var ret = null;
            if ((elem = S.get(elem))) {
                ret = nth(elem, n === undefined ? 1 : n);
            }
            return ret;
        },

        /**
         * Gets the immediately preceding sibling of the element.
         */
        prev: function(elem, n) {
            return this.next(elem, n === undefined ? -1 : -n);
        },

        /**
         * Gets the parentNode of the elment.
         */
        parent: function(elem, n) {
            var parent = elem.parentNode;
            return parent && parent.nodeType !== 11 ? parent : null;
        }
    });

    // ��ȡԪ�� n ������ siblings, ������ elem
    function getSiblings(n/* first */, elem) {
        for (var r = [], j = 0; n; n = n.nextSibling) {
            if (isElementNode(n) && n !== elem) {
                r[j++] = n;
            }
        }
        return r;
    }

    // ��ȡԪ�� elem �� d(irection) �ϵĵ� n ��Ԫ��
    function nth(elem, n, d) {
        var ret = null;

        if ((elem = S.get(elem))) {
            n = n || 0;
            if(n === 0) return elem;

            if (d === undefined) d = n > 0 ? 'nextSibling' : 'previousSibling';
            if (n < 0) n = -n;

            for (var i = 0; n && (ret = elem[d]); ) {
                if (isElementNode(ret) && i++ === n) {
                    break;
                }
            }
        }

        return ret;
    }
});

/**
 * NOTES:
 *
 *  - api ������ϣ�û�и��� jQuery. һ��Ϊ�˺����� api һ�£����� first-all ԭ�򡣶��Ǵ��û�
 *    �������������ڲ����ĵ���������˼������£��û��⿴�������������������������Ĺ��ܡ�
 *
 */
