/**
 * @module  dom-insertion
 * @author  lifesinger@gmail.com
 */
KISSY.add('dom-insertion', function(S) {

    var DOM = S.DOM,
        PARENT_NODE = 'parentNode',
        NEXT_SIBLING = 'nextSibling';

    S.mix(DOM, {

        /**
         * Inserts the new node as the previous sibling of the reference node.
         * @return {HTMLElement} The node that was inserted (or null if insert fails)
         */
        insertBefore: function(newNode, refNode) {
            newNode = DOM.create(newNode);
            refNode = S.get(refNode);

            if (newNode && refNode && refNode[PARENT_NODE]) {
                refNode[PARENT_NODE].insertBefore(newNode, refNode);
            }

            return newNode;
        },

        /**
         * Inserts the new node as the next sibling of the reference node.
         * @return {HTMLElement} The node that was inserted (or null if insert fails)
         */
        insertAfter: function(newNode, refNode) {
            newNode = DOM.create(newNode);
            refNode = S.get(refNode);

            if (newNode && refNode && refNode[PARENT_NODE]) {
                if (refNode[NEXT_SIBLING]) {
                    refNode[PARENT_NODE].insertBefore(newNode, refNode[NEXT_SIBLING]);
                } else {
                    refNode[PARENT_NODE].appendChild(newNode);
                }
            }

            return newNode;
        }
    });

});

/**
 * NOTES:
 *  - appendChild/removeChild/replaceChild ֱ����ԭ����
 *  - append/appendTo, prepend/prependTo, wrap/unwrap ���� Node ��
 *
 */
