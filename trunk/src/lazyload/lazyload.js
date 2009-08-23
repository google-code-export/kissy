/**
 * KISSY.Lazyload ͼƬ�ӳټ������
 *
 * lazyload.js
 * requires: yahoo-dom-event
 *
 * @author lifesinger@gmail.com
 */

var KISSY = window.KISSY || {};

/**
 * ͼƬ�ӳټ������
 * @class Lazyload
 * @requires YAHOO.util.Dom
 * @requires YAHOO.util.Event
 * @constructor
 */
KISSY.Lazyload = (function() {
    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = YAHOO.lang,

        /**
         * Ĭ������
         */
        defaultConfig = {
            /**
             * ��ǰ�Ӵ����£�diff px ���ͼƬ�ӳټ���
             */
            diff: 200,

            /**
             * ռλָʾͼ
             */
            placeholder: "loading.gif"
        };

    function Lazyload(id, config) {

        // Allow instantiation without the new operator
        if (!(this instanceof Lazyload)) {
            new Lazyload(id, config);
        }

        /**
         * ͼƬ����������Ĭ��Ϊ document
         * @type HTMLElement
         */
        this.container = Dom.get(id) || document;

        /**
         * ���ò���
         * @type Object
         */
        this.config = Lang.merge(defaultConfig, config || {});

        // init
        this._init();
    };

    Lazyload.prototype = {
        /**
         * ��ʼ��
         * @protected
         */
        _init: function() {

        },
        
        constructor: Lazyload
    };

    return Lazyload;
})();
