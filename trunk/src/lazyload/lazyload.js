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
        DATA_SRC = "kissy-lazyload-src",

        /**
         * Ĭ������
         */
        defaultConfig = {
            /**
             * ��ǰ�Ӵ����£�diff px ���ͼƬ�ӳټ���
             */
            diff: 0,

            /**
             * ռλָʾͼ
             */
            placeholder: "blank.gif"
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

        /**
         * ��ʼ�ӳٵ� Y ����
         */
        //this.threshold

        // init
        this._init();
    }

    Lazyload.prototype = {
        /**
         * ��ʼ��
         * @protected
         */
        _init: function() {
            this.threshold = Dom.getViewportHeight() + this.config.diff;
            this.images = this._filterImgs();

            if (this.images.length > 0) {
                this._initScroll();
            }
        },

        /**
         * ��ʼ�������¼�
         */
        _initScroll: function() {
            var timer, self = this;

            Event.on(window, "scroll", function() {
                if(timer) return;

                timer = setTimeout(function(){
                    // load
                    self._loadImgs();

                    // free
                    if (self.images.length === 0) {
                        Event.removeListener(window, "scroll", arguments.callee);
                    }
                    clearTimeout(timer);
                    timer = null;

                }, 100); // 0.1s �ڣ��û��о�������
            });
        },

        /**
         * ��ȡ����ʼ����Ҫ�ӳ����ص�ͼƬ
         * @protected
         */
        _filterImgs: function() {
            var imgs = this.container.getElementsByTagName("img"),
                threshold = this.threshold,
                placeholder = this.config.placeholder,
                img, ret = [];

            for (var i = 0, len = imgs.length; i < len; ++i) {
                img = imgs[i];
                if (Dom.getY(img) > threshold) {
                    img.setAttribute(DATA_SRC, img.src);
                    img.src = placeholder;
                    ret.push(img);
                }
            }
            return ret;
        },

        /**
         * ����ͼƬ
         * @protected
         */
        _loadImgs: function() {
            var scrollTop = Dom.getDocumentScrollTop();
            if(scrollTop <= this.config.diff) return;

            var imgs = this.images,
                threshold = this.threshold,
                src, remain = [];

            for(var i = 0, img; img = imgs[i++];) {
                if(Dom.getY(img) < threshold + scrollTop) {
                    src = img.getAttribute(DATA_SRC);
                    if(src) {
                        img.src = src;
                        img.removeAttribute(DATA_SRC);
                    }
                } else {
                    remain.push(img);
                }
            }
            this.images = remain;
        },

        /**
         * ���캯��
         */
        constructor: Lazyload
    };

    return Lazyload;
})();
