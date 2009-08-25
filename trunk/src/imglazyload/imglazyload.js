/**
 * KISSY.ImageLazyload ͼƬ�ӳټ������
 *
 * imglazyload.js
 * requires: yahoo-dom-event
 *
 * @author lifesinger@gmail.com
 */

var KISSY = window.KISSY || {};

(function() {
    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = YAHOO.lang,
        DATA_SRC = "data-lazyload",

        defaultConfig = {
            /**
             * ��ǰ�Ӵ����£�diff px ���ͼƬ�ӳټ���
             * �ʵ����ô�ֵ���������û����϶�ʱ�о�ͼƬ�Ѿ����غ�
             * Ĭ��Ϊ��ǰ�Ӵ��߶ȣ���ǰ����һ����
             */
            diff: Dom.getViewportHeight(),

            /**
             * ռλָʾͼ
             */
            placeholder: "spaceball.gif"
        };

    /**
     * ͼƬ�ӳټ������
     * @class Lazyload
     * @requires YAHOO.util.Dom
     * @requires YAHOO.util.Event
     * @constructor
     */
    function ImageLazyload(id, config) {
        // Factory or constructor
        if (!(this instanceof arguments.callee)) {
            return new arguments.callee(id, config);
        }

        // ��������� config ����
        if(typeof config === "undefined") {
            config = id;
            id = document;
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
    };

    Lang.augmentObject(ImageLazyload.prototype, {
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
         * @protected
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
                    timer = null;

                }, 100); // 0.1s �ڣ��û��о�����
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
        }
    });

    KISSY.ImageLazyload = ImageLazyload;
})();

/**
 * NOTES:
 *
 * Ŀǰ�ķ�����
 *  1. �� Firefox �·ǳ��������ű�����ʱ����û���κ�ͼƬ��ʼ���أ������������ӳټ��ء�
 *  2. �� IE �²����������ű�����ʱ���в���ͼƬ�Ѿ���������������ӣ��ⲿ�� Abort ����
 *     ���ڹ���ʱ�ӳټ��أ����� listing ��ҳ��˵����������������������
 *  3. �� Safari �� Chrome �£���Ϊ webkit �ں� bug�������޷� Abort �����ء���
 *     �ű���ȫ���á�
 *  4. �� Opera �£��� Firefox һ�£�������
 *
 * ȱ�㣺
 *  1. ���ڴ󲿷�����£���Ҫ�϶��鿴���ݵ�ҳ�棨�����������ҳ��������ʱ���������û���
 *     �顣�û��������ǣ����������á��ӳټ��ػ���ս�û������ģ��ر������ٲ���ʱ��
 *  2. ��֧�� Webkit �ں��������IE �£��п��ܵ��� HTTP �����������ӡ�
 *
 * �ŵ㣺
 *  1. ���һ��ҳ�棬�󲿷��û��ڵ�һ������ת���ӳټ���ͼƬ���Լ���������������ܡ�
 *
 * Ӧ��ǰ����У�
 *  1. ҳ��Ĺ������������ʣ��ж����û���Զֻ����һ����
 *  2. �ӳټ���ͼƬ���û����ĵ���ս����ǰ����һ���Ƿ������⣿
 *
 * �ο����ϣ�
 *  1. http://davidwalsh.name/lazyload MooTools ��ͼƬ�ӳٲ��
 *  2. http://vip.qq.com/ ģ�����ʱ�����滻��ͼƬ�� src. ����ʹ��������������¶�
 *     ��ʵ���ӳټ��ء�ȱ���ǣ���������ǿ���� JS ʱ��ͼƬ����չʾ�����������治����
 *  3. http://www.appelsiini.net/projects/lazyload jQuery Lazyload
 *
 * ���ĸп����������е㼦��
 */