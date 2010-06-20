/**
 * @module  dom-offset
 * @author  lifesinger@gmail.com
 */
KISSY.add('dom-offset', function(S, undefined) {

    var DOM = S.DOM,
        win = window,
        doc = document,
        docElem = doc.documentElement,
        OWNER_DOCUMENT = 'ownerDocument',
        GET_BOUNDING_CLIENT_RECT = 'getBoundingClientRect';

    S.mix(DOM, {

        offset: function(elem, val) {
            if (!(elem = S.get(elem)) || !elem[OWNER_DOCUMENT]) return null;

            // getter
            if (val === undefined) {
                return getOffset(elem);
            }

            // setter
            setOffset(elem, val);
        },

        /**
         * Returns the left scroll value of the document.
         */
        scrollLeft: function() {
            return win.pageXOffset || docElem.scrollLeft || doc.body.scrollLeft;
        },

        /**
         * Returns the top scroll value of the document.
         */
        scrollTop: function() {
            return win.pageYOffset || docElem.scrollTop || doc.body.scrollTop;
        }
    });

    function getOffset(elem) {
        var box, x = 0, y = 0;

        // 1. ���� body �� docElem, ֱ�ӷ��� 0, ���󲿷�����£��ⶼ����������
        // 2. ���� GBS �������ݣ�A-Grade Browsers ����֧�� getBoundingClientRect �����������ٿ��Ǵ�ͳ��ʵ�ַ�ʽ
        if (elem !== doc.body && elem !== docElem && elem[GET_BOUNDING_CLIENT_RECT]) {
            box = elem[GET_BOUNDING_CLIENT_RECT]();

            // ע��jQuery �����Ǽ�ȥ docElem.clientLeft/clientTop
            // �����Է��֣����������ᵼ�µ� html �� body �б߾�/�߿���ʽʱ����ȡ��ֵ����ȷ
            // ���⣬ie6 ����� html �� margin ֵ�����˵���û��˭��ȥ���� html �� margin

            x = box.left + DOM.scrollLeft();
            y = box.top + DOM.scrollTop();
        }

        return { left: x, top: y };
    }

    function setOffset(elem, val) {
        
    }
});

/**
 * TODO:
 *  - �����Ƿ�ʵ�� jQuery �� position, offsetParent �ȹ���
 *
 */
