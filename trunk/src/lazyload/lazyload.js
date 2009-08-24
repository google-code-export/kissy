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
                placeholder: ""
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

        /**
         * ��Ҫ�ӳ����ص�ͼƬ
         */
        //this.images

        // init
        this._init();
    }

    ;

    Lazyload.prototype = {
        /**
         * ��ʼ��
         * @protected
         */
        _init: function() {

            this.images = this._filterImages();

            alert(this.images.length);

        },

        /**
         * �ҵ���Ҫ�ӳ����ص�ͼƬ
         */
        _filterImages: function() {
            var container = this.container,
                images = container.getElementsByTagName("img"),
                config = this.config,
                threshold = Dom.getDocumentScrollTop() + Dom.getViewportHeight() + config.diff,
                img, ret = [];

            for(var i = 0, len = images.length; i < len; ++i) {
                img = images[i];
                if(Dom.getX(img) > threshold) {
                    ret.push(img);
                }
            }

            return ret;
        },

        constructor: Lazyload
    };

    return Lazyload;
})();
