/**
 * @module  node
 * @author  lifesinger@gmail.com
 * @depends kissy, dom
 */

KISSY.add('node', function(S) {

    var DOM = S.DOM;

    /**
     * The Node class provides a wrapper for manipulating DOM Node.
     */
    function Node(html, props, ownerDocument) {
        var self = this, domNode, match;

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

    // imports standard methods from DOM
    S.each([
        'attr', 'removeAttr', 'val', 'text',
        'create',
        'hasClass', 'addClass', 'removeClass', 'replaceClass', 'toggleClass'],
        function(methodName) {

            Node.prototype[methodName] = function(name, val) {
                var domNode = this[0];

                if(val === undefined) {
                    return DOM[methodName](domNode, name);
                }
                else {
                    DOM[methodName](domNode, name, val);
                    return this;
                }
            }
        });

    // add more methods
    S.mix(Node.prototype, {

    });

    // query api
    S.one = function(selector, context) {
        return new Node(S.get(selector, context));
    };

    S.Node = Node;

});
