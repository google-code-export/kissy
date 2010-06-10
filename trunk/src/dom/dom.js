/**
 * @module  dom
 * @author  lifesinger@gmail.com
 */
KISSY.add('dom', function(S, undefined) {

    var doc = document,
        defaultFrag = doc.createElement('DIV'),
        RE_TAG = /^[a-z]+$/i;

    S.DOM = {

        

        /**
         * �ǲ��� element node
         */
        _isElementNode: function(elem) {
            return elem && elem.nodeType === 1;
        },

        /**
         * Gets or sets styles on the matches elements.
         */
        css: function(el, prop, val) {
            // get style
            if(val === undefined) {
                return el.style[prop];
            }

            // set style
            S.each(S.makeArray(el), function(elem) {
                elem.style[prop] = val;
            });

            // TODO:
            //  - ���Ǹ��ּ�����������쳣��� opacity, z-index, float
            //  - more test cases
        },

        /**
         * Gets the HTML contents of the HTMLElement.
         */
        html: function(el, htmlString) {
            // set html
            if(htmlString === undefined) {
                return el.innerHTML;
            }

            // get html
            el.innerHTML = htmlString;

            // TODO:
            //  - ���Ǹ��ּ��ݺ��쳣����ӷ�����
        },

        /**
         * Creates a new HTMLElement using the provided html string.
         */
        create: function(html, ownerDoc) {
            if (typeof html === 'string') {
                html = S.trim(html); // match IE which trims whitespace from innerHTML
            }

            // simple tag
            if(RE_TAG.test(html)) {
                return (ownerDoc || doc).createElement(html);
            }
            
            var ret = null, nodes, frag;

            frag = ownerDoc ? ownerDoc.createElement('DIV') : defaultFrag;
            frag.innerHTML = html;
            nodes = frag.childNodes;

            if(nodes.length === 1) {
                // return single node, breaking parentNode ref from "fragment"
                ret = nodes[0].parentNode.removeChild(nodes[0]);
            }
            else {
                ret = nl2frag(nodes, ownerDoc || doc);
            }

            return ret;
        },

        /**
         * Creates a stylesheet from a text blob of rules.
         * These rules will be wrapped in a STYLE tag and appended to the HEAD of the document.
         * @param {String} cssText The text containing the css rules
         * @param {String} id An id to add to the stylesheet for later removal
         */
        addStyleSheet: function(cssText, id) {
            var head = doc.getElementsByTagName('head')[0],
                el = doc.createElement('style');

            id && (el.id = id);
            head.appendChild(el); // ����ӵ� DOM ���У������� cssText ��� hack ��ʧЧ

            if (el.styleSheet) { // IE
                el.styleSheet.cssText = cssText;
            } else { // W3C
                el.appendChild(doc.createTextNode(cssText));
            }
        }
    };

    // �� nodeList ת��Ϊ fragment
    function nl2frag(nodes, ownerDoc) {
        var ret = null, i, len;

        if (nodes && (nodes.push || nodes.item) && nodes[0]) {
            ownerDoc = ownerDoc || nodes[0].ownerDocument;
            ret = ownerDoc.createDocumentFragment();

            if (nodes.item) { // convert live list to static array
                nodes = S.makeArray(nodes);
            }

            for (i = 0, len = nodes.length; i < len; ++i) {
                ret.appendChild(nodes[i]);
            }
        }
        // else inline with log for minification
        else {
            S.error('unable to convert ' + nodes + ' to fragment');
        }

        return ret;
    }
});

/**
 * TODO:
 *  - create �Ľ�һ�����ƣ����� cache, �� table, form Ԫ�ص�֧�ֵȵ�
 */
