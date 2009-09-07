/**
 * KISSY.ImageLazyload ͼƬ�ӳټ������
 *
 * @creator     ��<lifesinger@gmail.com>
 * @depends     yahoo-dom-event
 */

var KISSY = window.KISSY || {};

(function() {
    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = YAHOO.lang,
        DATA_SRC = "data-lazyload-src",
        MOD = { AUTO: "auto", MANUAL: "manual" },

        defaultConfig = {

            /**
             * ������ģʽ
             *  auto   - �Զ�����html ���ʱ������ img.src ���κδ���
             *  manual - ��� html ʱ���Ѿ�����Ҫ�ӳټ��ص� img.src �滻Ϊ img.DATA_SRC
             */
            mod: MOD.AUTO,

            /**
             * ��ǰ�Ӵ����£�diff px ���ͼƬ�ӳټ���
             * �ʵ����ô�ֵ���������û����϶�ʱ�о�ͼƬ�Ѿ����غ�
             * Ĭ��Ϊ��ǰ�Ӵ��߶ȣ���������Ĳ��ӳټ��أ�
             */
            diff: Dom.getViewportHeight(),

            /**
             * ռλָʾͼ
             */
            placeholder: "spaceball.gif"
        };

    /**
     * ͼƬ�ӳټ������
     * @class ImageLazyload
     * @constructor
     */
    var ImageLazyload = function(containers, config) {
        // Factory or constructor
        if (!(this instanceof arguments.callee)) {
            return new arguments.callee(containers, config);
        }

        // ��������� config һ������
        if(typeof config === "undefined") {
            config = containers;
            containers = [document];
        }

        // containers ��һ�� HTMLElement
        if(!Lang.isArray(containers)) {
            containers = [Dom.get(containers) || document];
        }

        /**
         * ͼƬ�������������Զ������Ĭ��Ϊ [document]
         * @type Array
         */
        this.containers = containers;

        /**
         * ���ò���
         * @type Object
         */
        this.config = Lang.merge(defaultConfig, config || {});

        /**
         * ��Ҫ�ӳ����ص�ͼƬ
         * @type Array
         */
        //this.images

        /**
         * ��ʼ�ӳٵ� Y ����
         * @type number
         */
        //this.threshold

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
                this._initLoadEvent();
            }
        },

        /**
         * ��ʼ�������¼�
         * @protected
         */
        _initLoadEvent: function() {
            var timer, self = this;

            // ����ʱ������ͼƬ
            Event.on(window, "scroll", function() {
                if(timer) return;

                timer = setTimeout(function() {
                    // load
                    self._loadImgs();

                    // free
                    if (self.images.length === 0) {
                        Event.removeListener(window, "scroll", arguments.callee);
                    }
                    timer = null;

                }, 100); // 0.1s �ڣ��û��о�����
            });

            // �ֹ�ģʽʱ����һ��Ҳ�п����� data-src ��
            if(this.config.mod === MOD.MANUAL && Dom.getDocumentScrollTop() === 0) {
                // ��Ҫ��������һ�Σ��Ա�֤��һ��ͼƬ�ɼ�
                Event.onDOMReady(function() {
                    self._loadImgs(true);
                });
            }
        },

        /**
         * ��ȡ����ʼ����Ҫ�ӳ����ص�ͼƬ
         * @protected
         */
        _filterImgs: function() {
            var containers = this.containers,
                threshold = this.threshold,
                placeholder = this.config.placeholder,
                isManualMod = this.config.mod === MOD.MANUAL,
                img, data_src, ret = [];

            for (var n = 0, N = containers.length; n < N; ++n) {
                var imgs = containers[n].getElementsByTagName("img");

                for (var i = 0, len = imgs.length; i < len; ++i) {
                    img = imgs[i];
                    data_src = img.getAttribute(DATA_SRC);

                    // �ֹ�ģʽ��ֻ�账���� data-src ��ͼƬ
                    // ԭ�򣺵��в���Ҫ�ӳٵ�ͼƬ�� threshold �Ժ�ʱ��ֻ������ data-src ��ͼƬ����
                    //      ���� IE �±� abort ���� http ͼƬ����
                    if (isManualMod && data_src) {
                        img.src = placeholder;
                        ret.push(img);

                    // �Զ�ģʽ��ֻ�账�� threshold ���ͼƬ
                    } else if (Dom.getY(img) > threshold) {
                        img.setAttribute(DATA_SRC, img.src);
                        img.src = placeholder;
                        ret.push(img);
                    }
                }
            }

            return ret;
        },

        /**
         * ����ͼƬ
         * @protected
         */
        _loadImgs: function(force) {
            var scrollTop = Dom.getDocumentScrollTop();
            if(!force && scrollTop <= this.config.diff) return;

            var imgs = this.images,
                threshold = this.threshold,
                data_src, remain = [];

            for(var i = 0, img; img = imgs[i++];) {
                if(Dom.getY(img) < threshold + scrollTop) {
                    data_src = img.getAttribute(DATA_SRC);

                    if(data_src && img.src != data_src) {
                        img.src = data_src;
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
 * �п����������е㼦��
 *
 * 2009-09-03 ���£�
 *  1. ���ǵ�ͼƬ������ SEO Ӱ���С����Ѷһ��ʼ���滻�� src �ķ����ǿ��еġ�
 *  2. �����Ա� srp ҳ�棬����һ��ͼƬ�ӳټ��أ���һ�������Ȩ�⡣
 *  3. ���� 2 ��ȱ���ǣ������û���Ļ�ܸߣ���һ��¶���� data-src ����û���������Ļʱ��
 *     �ӳٵĿհ�ͼƬ��Զ������ء��������Ͽ��ԣ�
 */