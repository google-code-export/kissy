/**
 * @module  dom-traversal
 * @author  lifesinger@gmail.com
 */
KISSY.add('dom-traversal', function(S) {

    S.mix(S.DOM, {

        /**
         * Gets the children of the first matched element.
         */
        children: function(el) {
            var ret = [];
            if ((el = S.get(el))) {
                // ֻ�� firefox �ĵͰ汾��֧�� children
                ret = el.children ? S.makeArray(el.children) : getSiblings(el.firstChild);
            }
            return ret;
        },

        /**
         * Gets the siblings of the HTMLElment.
         */
        siblings: function(el) {
            return getSiblings(el.parentNode.firstChild, el);
        },

        /**
         * Gets the immediately following sibling of the element.
         */
        next: function(el) {
            return nth(el, 1, 'nextSibling');
        },

        /**
         * Gets the immediately preceding sibling of the element.
         */
        prev: function(el) {
            return nth(el, 1, 'previousSibling');
        },

        /**
         * Gets the parentNode of the elment.
         */
        parent: function(el) {
            var parent = el.parentNode;
            return parent && parent.nodeType !== 11 ? parent : null;
        }
    });

    // ��ȡԪ�� el ������ siblings
    function getSiblings(n/* first */, el) {
        for (var r = [], j = 0; n; n = n.nextSibling) {
            if (n.nodeType === 1 && n !== el) {
                r[j++] = n;
            }
        }
        return r;
    }

    // ��ȡԪ�� el �� dir(ection) �ϵĵ� n ��Ԫ��
    function nth(el, n, dir) {
        n = n || 0;
        for (var i = 0; el; el = el[dir]) {
            if (el.nodeType === 1 && i++ === n) {
                break;
            }
        }
        return el;
    }

});
