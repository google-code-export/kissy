/*
Copyright (c) 2009, Kissy UI Library. All rights reserved.
MIT Licensed.
http://kissy.googlecode.com/

Date: 2009-12-23 08:44:05
Revision: 334
*/
/**
 * �����ӳټ������
 * ���� img, textarea, �Լ��ض�Ԫ�ؼ�������ʱ�Ļص�����
 * @module      datalazyload
 * @creator     ��<lifesinger@gmail.com>
 * @depends     kissy-core, yahoo-dom-event
 */
KISSY.add("datalazyload", function(S) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = YAHOO.lang,
        win = window, doc = document,
        DATA_SRC = "data-lazyload-src",
        LAZY_TEXTAREA_CLS = "ks-datalazyload",
        CUSTOM_LAZYLOAD_CLS = "ks-datalazyload-custom",
        MOD = { AUTO: "auto", MANUAL: "manual" },
        DEFAULT = "default",

        defaultConfig = {

            /**
             * ������ģʽ
             *   auto   - �Զ�����html ���ʱ������ img.src ���κδ���
             *   manual - ��� html ʱ���Ѿ�����Ҫ�ӳټ��ص�ͼƬ�� src �����滻Ϊ DATA_SRC
             * ע������ textarea ���ݣ�ֻ���ֶ�ģʽ
             */
            mod: MOD.MANUAL,

            /**
             * ��ǰ�Ӵ����£�diff px ��� img/textarea �ӳټ���
             * �ʵ����ô�ֵ���������û����϶�ʱ�о������Ѿ����غ�
             * Ĭ��Ϊ��ǰ�Ӵ��߶ȣ���������Ĳ��ӳټ��أ�
             */
            diff: DEFAULT,

            /**
             * ͼ���ռλͼ
             */
            placeholder: "http://a.tbcdn.cn/kissy/1.0.2/build/datalazyload/dot.gif"
        };

    /**
     * �ӳټ������
     * @constructor
     */
    function DataLazyload(containers, config) {
        // factory or constructor
        if (!(this instanceof arguments.callee)) {
            return new arguments.callee(containers, config);
        }

        // ��������� config һ������
        if (typeof config === "undefined") {
            config = containers;
            containers = [doc];
        }

        // containers ��һ�� HTMLElement ʱ
        if (!Lang.isArray(containers)) {
            containers = [Dom.get(containers) || doc];
        }

        /**
         * ͼƬ�������������Զ������Ĭ��Ϊ [doc]
         * @type Array
         */
        this.containers = containers;

        /**
         * ���ò���
         * @type Object
         */
        this.config = S.merge(defaultConfig, config || {});

        /**
         * ��Ҫ�ӳ����ص�ͼƬ
         * @type Array
         */
        //this.images

        /**
         * ��Ҫ�ӳٴ���� textarea
         * @type Array
         */
        //this.areaes

        /**
         * ���ӳ���󶨵Ļص�����
         * @type object
         */
        this.callbacks = {els: [], fns: []};

        /**
         * ��ʼ�ӳٵ� Y ����
         * @type number
         */
        //this.threshold

        this._init();
    }

    S.mix(DataLazyload.prototype, {

        /**
         * ��ʼ��
         * @protected
         */
        _init: function() {
            this.threshold = this._getThreshold();
            this._filterItems();

            if (this._getItemsLength()) {
                this._initLoadEvent();
            }
        },

        /**
         * ��ʼ�������¼�
         * @protected
         */
        _initLoadEvent: function() {
            var timer, self = this;

            // scroll �� resize ʱ������ͼƬ
            Event.on(win, "scroll", loader);
            Event.on(win, "resize", function() {
                self.threshold = self._getThreshold();
                loader();
            });

            // ��Ҫ��������һ�Σ��Ա�֤��һ�����ӳ���ɼ�
            if (self._getItemsLength()) {
                Event.onDOMReady(function() {
                    loadItems();
                });
            }

            // ���غ���
            function loader() {
                if (timer) return;
                timer = setTimeout(function() {
                    loadItems();
                    timer = null;
                }, 100); // 0.1s �ڣ��û��о�����
            }

            // �����ӳ���
            function loadItems() {
                self._loadItems();

                if (self._getItemsLength() === 0) {
                    Event.removeListener(win, "scroll", loader);
                    Event.removeListener(win, "resize", loader);
                }
            }
        },

        /**
         * ��ȡ����ʼ����Ҫ�ӳٵ� img �� textarea
         * @protected
         */
        _filterItems: function() {
            var containers = this.containers,
                threshold = this.threshold,
                placeholder = this.config.placeholder,
                isManualMod = this.config.mod === MOD.MANUAL,
                n, N, imgs, areaes, i, len, img, data_src,
                lazyImgs = [], lazyAreaes = [];

            for (n = 0,N = containers.length; n < N; ++n) {
                imgs = containers[n].getElementsByTagName("img");

                for (i = 0,len = imgs.length; i < len; ++i) {
                    img = imgs[i];
                    data_src = img.getAttribute(DATA_SRC);

                    if (isManualMod) { // �ֹ�ģʽ��ֻ������ data-src ��ͼƬ
                        if (data_src) {
                            img.src = placeholder;
                            lazyImgs.push(img);
                        }
                    } else { // �Զ�ģʽ��ֻ���� threshold ���� data-src ��ͼƬ
                        // ע�⣺���� data-src ���������������ʵ����������ظ�����
                        // �ᵼ�� data-src ��� placeholder
                        if (Dom.getY(img) > threshold && !data_src) {
                            img.setAttribute(DATA_SRC, img.src);
                            img.src = placeholder;
                            lazyImgs.push(img);
                        }
                    }
                }

                // ���� textarea
                areaes = containers[n].getElementsByTagName("textarea");
                for( i = 0, len = areaes.length; i < len; ++i) {
                    if(Dom.hasClass(areaes[i], LAZY_TEXTAREA_CLS)) {
                        lazyAreaes.push(areaes[i]);
                    }
                }
            }

            this.images = lazyImgs;
            this.areaes = lazyAreaes;
        },

        /**
         * �����ӳ���
         */
        _loadItems: function() {
            this._loadImgs();
            this._loadAreaes();
            this._fireCallbacks();
        },

        /**
         * ����ͼƬ
         * @protected
         */
        _loadImgs: function() {
            var imgs = this.images,
                scrollTop = Dom.getDocumentScrollTop(),
                threshold = this.threshold + scrollTop,
                i, img, data_src, remain = [];

            for (i = 0; img = imgs[i++];) {
                if (Dom.getY(img) <= threshold) {
                    data_src = img.getAttribute(DATA_SRC);

                    if (data_src && img.src != data_src) {
                        img.src = data_src;
                        img.removeAttribute(DATA_SRC);
                    }
                } else {
                    remain.push(img);
                }
            }

            this.images = remain;
        },

        /**
         * ���� textarea ����
         * @protected
         */
        _loadAreaes: function() {
            var areaes = this.areaes,
                scrollTop = Dom.getDocumentScrollTop(),
                threshold = this.threshold + scrollTop,
                i, area, parent, remain = [];

            for (i = 0; area = areaes[i++];) {
                parent = area.parentNode;
                // ע��area ���ܴ��� display: none ״̬��Dom.getY(area) ��ȡ���� Y ֵ
                //    ���������� area.parentNode
                if (Dom.getY(parent) <= threshold) {
                    parent.innerHTML = area.value;
                } else {
                    remain.push(area);
                }
            }

            this.areaes = remain;
        },

        /**
         * �����ص�
         * @protected
         */
        _fireCallbacks: function() {
            var callbacks = this.callbacks,
                els = callbacks.els, fns = callbacks.fns,
                scrollTop = Dom.getDocumentScrollTop(),
                threshold = this.threshold + scrollTop,
                i, el, fn, remainEls = [], remainFns = [];

            for (i = 0; (el = els[i]) && (fn = fns[i++]);) {
                if (Dom.getY(el) <= threshold) {
                    fn.call(el);
                } else {
                    remainEls.push(el);
                    remainFns.push(fn);
                }

            }

            callbacks.els = remainEls;
            callbacks.fns = remainFns;
        },

        /**
         * ��ӻص��������� el ������������ͼ��ʱ������ fn
         */
        addCallback: function(el, fn) {
            el = Dom.get(el);
            if(el && typeof fn === "function") {
                this.callbacks.els.push(el);
                this.callbacks.fns.push(fn);
            }
        },

        /**
         * ��ȡ��ֵ
         * @protected
         */
        _getThreshold: function() {
            var diff = this.config.diff,
                ret = Dom.getViewportHeight();

            if (diff === DEFAULT) return 2 * ret; // diff Ĭ��Ϊ��ǰ�Ӵ��߶ȣ���������Ĳ��ӳټ��أ�
            else return ret + diff;
        },

        /**
         * ��ȡ��ǰ�ӳ��������
         * @protected
         */
        _getItemsLength: function() {
            return this.images.length + this.areaes.length + this.callbacks.els.length;
        },

        /**
         * �����Զ����ӳ�����
         */
        loadCustomLazyData: function(parent) {
            var textarea = parent.getElementsByTagName("textarea")[0];
            if (textarea && Dom.hasClass(textarea, CUSTOM_LAZYLOAD_CLS)) {
                parent.innerHTML = textarea.value;
            }
        }
    });

    S.DataLazyload = DataLazyload;
});

/**
 * NOTES:
 *
 * ģʽΪ auto ʱ��
 *  1. �� Firefox �·ǳ��������ű�����ʱ����û���κ�ͼƬ��ʼ���أ������������ӳټ��ء�
 *  2. �� IE �²����������ű�����ʱ���в���ͼƬ�Ѿ���������������ӣ��ⲿ�� abort ����
 *     ���ڹ���ʱ�ӳټ��أ�������������������
 *  3. �� Safari �� Chrome �£���Ϊ webkit �ں� bug�������޷� abort �����ء���
 *     �ű���ȫ���á�
 *  4. �� Opera �£��� Firefox һ�£�������
 *
 * ģʽΪ manual ʱ����Ҫ�ӳټ��ص�ͼƬ��src �����滻Ϊ data-lazyload-src, ���� src ��ֵ��Ϊ placeholder ��
 *  1. ���κ�������¶���������ʵ�֡�
 *  2. ȱ���ǲ�������ǿ���� JS ʱ��ͼƬ����չʾ��
 *
 * ȱ�㣺
 *  1. ���ڴ󲿷�����£���Ҫ�϶��鿴���ݵ�ҳ�棨�����������ҳ�������ٹ���ʱ����������
 *     �����飨�û��������������ã����ر������ٲ���ʱ��
 *  2. auto ģʽ��֧�� Webkit �ں��������IE �£��п��ܵ��� HTTP �����������ӡ�
 *
 * �ŵ㣺
 *  1. ���Ժܺõ����ҳ���ʼ�����ٶȡ�
 *  2. ��һ������ת���ӳټ���ͼƬ���Լ���������
 *
 * �ο����ϣ�
 *  1. http://davidwalsh.name/lazyload MooTools ��ͼƬ�ӳٲ��
 *  2. http://vip.qq.com/ ģ�����ʱ�����滻��ͼƬ�� src
 *  3. http://www.appelsiini.net/projects/lazyload jQuery Lazyload
 *  4. http://www.dynamixlabs.com/2008/01/17/a-quick-look-add-a-loading-icon-to-your-larger-images/
 *  5. http://www.nczonline.net/blog/2009/11/30/empty-image-src-can-destroy-your-site/
 *
 * �ر�Ҫע��Ĳ�������:
 *  1. ��ʼ���ں�С�����󴰿�ʱ��ͼƬ��������
 *  2. ҳ���й���λ��ʱ��ˢ��ҳ�棬ͼƬ��������
 *  3. �ֶ�ģʽ����һ�����ӳ�ͼƬʱ����������
 *
 * 2009-12-17 ���䣺
 *  1. textarea �ӳټ���Լ����ҳ������Ҫ�ӳٵ� dom �ڵ㣬����
 *       <textarea class="ks-datalazysrc invisible">dom code</textarea>
 *     �������� hidden �� class, �������� invisible, ���趨 height = "ʵ�ʸ߶�".
 *     �������Ա�֤����ʱ��diff ����ʵ��Ч��
 *     ע�⣺textarea ���غ󣬻��滻���������е��������ݡ�
 *  2. �ӳ� callback Լ����dataLazyload.addCallback(el, fn) ��ʾ�� el ��������ʱ������ fn.
 *  3. ���в���������ഥ��һ�Σ����� callback. �����϶�������ʱ��ֻ�� el ��һ�γ���ʱ�ᴥ�� fn �ص���
 */

/**
 * TODOs:
 *   - [ȡ��] ����ͼƬ���ӳټ��أ����� css ��ı���ͼƬ�� sprite ���Ѵ���
 *   - [ȡ��] ����ʱ�� loading ͼ������δ�趨��С��ͼƬ��������������[�ο����� 4]��
 */

/**
 * UPDATE LOG:
 *   - 2009-12-17 yubo �� imglazyload ����Ϊ datalazyload, ֧�� textarea ��ʽ�ӳٺ��ض�Ԫ�ؼ�������ʱ�Ļص�����
 */