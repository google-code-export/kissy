/**
 * �Ŵ�Ч��
 * @module      imagezoom
 * @creater     qiaohua@taobao.com
 * @depender    kissy-core
 * @version     0.2
 */

KISSY.add("imagezoom", function(S, undefined) {
    var DOM = S.DOM,
        EVENT = S.Event,
        HIDDEN = 'hidden',
        IMGZOOM_CONTAINER_CLS = 'ks-imagezoom-container',
        IMGZOOM_MAGNIFIER_CLS = 'ks-imagezoom-magnifier',
        IMGZOOM_VIEWER_CLS = 'ks-imagezoom-viewer',
        IMGZOOM_GLASS_CLS = 'ks-imagezoom-glass',
        IMGZOOM_ICON_CLS = 'ks-imagezoom-icon',
        IMGZOOM_VIEWER_BK_CLS = 'ks-imagezoom-viewer-bk',
        POSITION = ['top', 'right', 'bottom', 'left'],
        TYPE = ['default', 'glass', 'follow'],
        
        /**
         * imagezoom��Ĭ������
         */
        defaultConfig = {
            /**
             * Ĭ������
             */
            bigImageSrc: '',    // ��ͼƬ·��, Ϊ''ʱȡԭͼ·��
            offset: 10,         // ��ͼƫ����
            glassSize: {height:100, width:100},      // ��Ƭ��,���
            useZoomIcon: true,          // �Ƿ���Ҫzoomicon
            zType: 'default',           // ѡ����ʾģʽ, ��ѡֵ: TYPE
            position: 'right',          // ��ͼ��ʾλ��, ��ѡֵ: POSITION
            preload: true,              // �Ƿ�Ԥ����
            timeout: 6000,              // �ȴ���ͼ����ʱ��, ��λ: ms
            bigImageSize: {height:900, width:900}     // �趨��ͼ�ĸ߿��
        };
        
        /** 
         * �Ŵ����
         * @class ImageZoom
         * @constructor
         * @param {String|HTMLElement} image
         * @param {Object} config
         */
        function ImageZoom(img, cfg) {
            var self = this;
            
            if (!(self instanceof ImageZoom)) {
                return new ImageZoom(img, cfg);
            }
            
            /**
             * ��Ҫ���ŵ�ͼƬ
             * @type HTMLElement
             */
            self.image = S.get(img);
            if (!self.image) {
                return;
            }
            /**
             * ��������
             * @type HTMLElement
             */
            self.container = null;
            
            /**
             * Сͼ���
             * @type HTMLElement
             */
            self.origin = null;
            
            /**
             * �Ŵ���ʾ��ͼƬ���
             * @type HTMLElement
             */
            self.viewer = null;
            
            /**
             * �Ŵ���ʾ��ͼƬ
             * @type HTMLElement
             */
            self.bigImage = null;
            
            /**
             * ���ò���
             * @type Object
             */
            self.config = S.merge(defaultConfig, cfg);
            
            /**
             * ��Ƭ
             * @type HTMLElement
             */
            self.glass = null;
            
            /**
             * �Ŵ�ͼ��
             * @type HTMLElement
             */
            self.zoomIcon = null;
            
            /**
             * Сͼ����״̬
             */
            self.imageReady = false;
            
            /**
             * ��ͼ����״̬
             */
            self.bigImageReady = false;
            
            /**
             * ��Ϣ��ʾ��ʱ
             */
            self.timer = null;
            
            // ��Сͼ�������֮��, ��ʼ��
            self.image.onload = function(){
                if (!self.imageReady) {
                    self.imageReady = !self.imageReady;
                    self._init();
                }
            }
            if (!self.imageReady && self.image.complete && self.getSize(self.image).height) { 
                self.imageReady = !self.imageReady;
                self._init();
            }
        }
        
        S.augment(ImageZoom, {
            /**
             * ��ʼ������
             * @protected
             */
            _init: function() {
                var self = this,
                    i = self.image;
                
                self._initContainer();
                
                /**
                 * ��������DOM
                 */
                var cfg = self.config,
                    g = self.glass,
                    z = self.zoomIcon;
                
                // ���ô�ͼ·��, ���û���趨��ͼͼƬ����ԭͼ·��
                if (!cfg.bigImageSrc) cfg.bigImageSrc = DOM.attr(i, 'src');
                else if (cfg.preload) {
                    // Ԥ���ش�ͼ
                    new Image().src = cfg.bigImageSrc;
                }
                
                /**
                 * ������Сͼʱ, ��ʾ��ͼ
                 */
                EVENT.on(self.origin, 'mouseenter', function(ev) {
                    // ��ʾ��Ƭ
                    if (g) DOM.removeClass(g, HIDDEN);
                    // ���طŴ�ͼ��
                    if (z) DOM.addClass(z, HIDDEN);
                    
                    // ����/��ʾ��ͼ
                    if (!self.viewer) {
                        self._createZoom(ev);
                    } else DOM.removeClass(self.viewer, HIDDEN);
                    // ���ô�ͼ���س�ʱ��ʱ��
                    self.timer = setTimeout(function(){
                        if (!self.bigImageReady) self.showMsg();
                    }, self.config.timeout);
                });
                
                /**
                 * ����뿪Сͼʱ, ���ش�ͼ
                 */
                EVENT.on(self.origin, 'mouseleave', function(ev) {
                    // ���ؾ�Ƭ
                    if (g) DOM.addClass(g, HIDDEN);
                    // ��ʾ�Ŵ�
                    if (z) DOM.removeClass(z, HIDDEN);
                    
                    // ���ش�ͼ
                    if (self.viewer) DOM.addClass(self.viewer, HIDDEN);
                    if (self.timer) clearTimeout(self.timer);
                });
            },
            
            /**
             * ����config��������DOM
             */
            _initContainer: function() {
                var self = this,
                    cfg = self.config,
                    c, o,
                    i = self.image,
                    g, z;
                
                // ������������
                c = DOM.create('<div>');
                DOM.addClass(c, IMGZOOM_CONTAINER_CLS);
                DOM.parent(i).insertBefore(c, i);
                self.container = c;
                
                // ����Сͼ���
                o = DOM.create('<div>');
                DOM.addClass(o, IMGZOOM_MAGNIFIER_CLS);
                o.appendChild(i);
                c.appendChild(o);
                self.origin = o;
                
                // ��Ƭģʽ��
                if (TYPE[1] == cfg.zType) {
                    g = DOM.create('<div>');
                    DOM.addClass(g, IMGZOOM_GLASS_CLS);
                    DOM.addClass(g, HIDDEN);
                    g.style.height = cfg.glassSize.height+'px';
                    g.style.width = cfg.glassSize.width+'px';
                    o.appendChild(g);
                    self.glass = g;
                }
                // ��Ҫ��ʾ�Ŵ�ͼ��
                if (cfg.useZoomIcon) {
                    z = DOM.create('<div>');
                    DOM.addClass(z, IMGZOOM_ICON_CLS);
                    o.appendChild(z);
                    self.zoomIcon = z;
                }
                
                // ����������С��λ��
                self.container.style.height = parseInt(self.getStyle(o, 'marginTop')) + parseInt(self.getStyle(o, 'marginBottom')) + self.getSize(o).height + 'px';
            },
            
            /**
             * ������ͼ����ʾDOM
             */
            _createZoom: function(ev) {
                var self = this,
                    cfg = self.config,
                    v;
                
                // ������ʾ�����DOM�ṹ
                v = DOM.create('<div>');
                DOM.addClass(v, IMGZOOM_VIEWER_CLS);
                DOM.addClass(v, IMGZOOM_VIEWER_BK_CLS);
                var bimg = DOM.create('<img>');
                DOM.attr(bimg, 'src', cfg.bigImageSrc);
                v.appendChild(bimg);
                // �����ʾ����ԭ��DOM��, ����ģʽ�е�����
                if (TYPE[2] == cfg.zType) {
                    self.origin.appendChild(v);
                } else {
                    self.container.appendChild(v);
                }
                self.bigImage = bimg;
                self.viewer = v;
                
                self._updateViewer(ev, false);
                self._zoom();
                // ��ͼ������Ϻ������ʾ����
                self.bigImage.onload = function() {
                    if (!self.bigImageReady) {
                        self.bigImageReady = !self.bigImageReady;
                        self._updateViewer(ev, true);
                    }
                }
                if (!self.bigImageReady && self.bigImage.complete && self.getSize(self.bigImage).height) {
                    self.bigImageReady = !self.bigImageReady;
                    self._updateViewer(ev, true);
                }
            },
            
            /**
             * ���÷Ŵ�ͼƬ��ʾ��ƫ����
             */
            _zoom: function() {
                var self = this,
                    cfg = self.config,
                    g = self.glass;
                /**
                 * �ƶ����ʱ���´�ͼƫ����
                 */
                EVENT.on(self.origin, 'mousemove', function(ev) {
                    // ��Ƭƫ����������
                    var glassOffset = self.getGlassOffset(ev);
                    if (g) {
                        g.style.left = glassOffset.left + 'px';
                        g.style.top = glassOffset.top + 'px';
                    }
                    // �����ͼƫ����������
                    var imageSize = self.getSize(self.image),
                        zoom = self.getSize(self.bigImage),
                        i = 0,
                        j = 0,
                        scrollx = Math.round(glassOffset.left*zoom.width/imageSize.width),
                        scrolly = Math.round(glassOffset.top*zoom.height/imageSize.height);
                    if (TYPE[2] == cfg.zType) {
                        var glassSize = self.getSize(g);
                        i = glassSize.width/2;
                        j = glassSize.height/2
                    }
                    self.viewer.scrollLeft = scrollx + i;
                    self.viewer.scrollTop = scrolly + j;
                    
                    // ����ģʽ�¸�����ʾ����λ��
                    if (TYPE[2] == cfg.zType) {
                        self.viewer.style.left = glassOffset.left + 'px';
                        self.viewer.style.top = glassOffset.top + 'px';
                    }
                });
            },
            
            /**
             * ������ʾ�����С��λ��
             */
            _updateViewer: function(ev, ready) {
                var self = this;
                if (ready) {
                    if (self.timer) clearTimeout(self.timer);
                    self.hideMsg();
                }
                var i = self.image,
                    cfg = self.config,
                    imageOffset = DOM.offset(i),
                    glassSize = self.getSize(self.glass);
                
                
                // ������ʾ����λ��
                var leftPos, topPos, vHeight, vWidth;
                if (TYPE[2] == cfg.zType) {
                    // ����ģʽ��, ������ʾ�����ʼλ��
                    var mousePoint = self.getMousePoint(ev),
                        cursorX = mousePoint.x - imageOffset.left,
                        cursorY = mousePoint.y - imageOffset.top;
                    topPos = cursorX - glassSize.width/2;
                    leftPos = cursorY - glassSize.height/2;
                    // ����ģʽ��, ��ʾ�����߶����û��趨��glass��߶Ⱦ���
                    vHeight = glassSize.height;
                    vWidth =  glassSize.width;
                } else {
                    // ������ʾ�ڲ�ͬλ���ϼ���left��topֵ
                    var bigImageSize,
                        imageSize = self.getSize(i),
                        o = self.origin,
                        v = self.viewer,
                        btw = parseInt(self.getStyle(v, 'borderTopWidth')),
                        blw = parseInt(self.getStyle(v, 'borderLeftWidth')),
                        containerOffset = DOM.offset(self.container);
                    if (!ready) {
                        bigImageSize = cfg.bigImageSize;
                    } else {
                        bigImageSize = self.getSize(self.bigImage);
                    }
                    if (POSITION[0] == cfg.position) {
                        topPos = - (imageSize.height + btw + cfg.offset - parseInt(self.getStyle(o, 'marginTop'))*2);
                        leftPos = imageOffset.left - containerOffset.left;
                    } else if (POSITION[2] == cfg.position) {
                        topPos = imageSize.height + imageOffset.top + cfg.offset - containerOffset.top;
                        leftPos = imageOffset.left - containerOffset.left;
                    } else if (POSITION[3] == cfg.position) {
                        topPos = imageOffset.top - containerOffset.top;
                        leftPos = - (imageSize.width + blw + cfg.offset - parseInt(self.getStyle(o, 'marginLeft'))*2);
                    } else {
                        topPos = imageOffset.top - containerOffset.top;
                        leftPos = imageOffset.left + imageSize.width + cfg.offset - containerOffset.left;
                    }
                    // ����ģʽ��, ��ʾ�����߶��ɴ�Сͼ�ı�������
                    vHeight = Math.round(bigImageSize.height*glassSize.height/imageSize.height);
                    vWidth = Math.round(bigImageSize.width*glassSize.width/imageSize.width);
                }
                self.viewer.style.height = vHeight + 'px';
                self.viewer.style.width = vWidth + 'px';
                self.viewer.style.top = topPos + 'px';
                self.viewer.style.left = leftPos + 'px';
            },
            
            /**
             * ��ȡ��Ƭ��ƫ����
             * @param ev    �������¼�
             * @return  offset ��Ƭ�ڷŴ�Ŀ��Ԫ���ϵĺ�����λ��
             */
            getGlassOffset: function(ev) {
                var self = this,
                    i = self.image,
                    offset = {
                        left: 0,
                        top: 0
                    };
                // Сͼƫ����
                var imageOffset = DOM.offset(i);
                // �����ҳ���ϵ�λ��
                var mousePoint = self.getMousePoint(ev);
                // ��Ƭʵ�ʳߴ�
                var glassSize = self.getSize(self.glass);
                // Сͼʵ�ʳߴ�
                var imageSize = self.getSize(i);
                // ������λ��
                var cursorX = mousePoint.x - imageOffset.left;
                // ��Ƭ����ƫ����
                offset.left = cursorX - glassSize.width/2;
                var i = 0,
                    j = 0;
                // ����ģʽ��, ƫ�����Ʋ�ͬ
                if (TYPE[2] == self.config.zType) {
                    i = glassSize.width/2;
                    j = glassSize.height/2;
                }
                if (offset.left < -i) {
                    offset.left = 0;
                } else if (offset.left > imageSize.width - glassSize.width + i) {
                    offset.left = imageSize.width - glassSize.width;
                }
                // �������λ��
                var cursorY = mousePoint.y - imageOffset.top;
                // ��Ƭ����ƫ����
                offset.top = cursorY - glassSize.height/2;
                if (offset.top < -j) {
                    offset.top = 0;
                } else if (offset.top > imageSize.height - glassSize.height + j) {
                    offset.top = imageSize.height - glassSize.height;
                }
                return offset;
            },
            
            /**
             * ��ȡԪ�صĿ�߶�(���������ߺ͹�����)
             * @param   HTMLElement
             * @return  Ԫ�ؿɼ��ߴ�
             */
            getSize: function(elm) {
                if (!elm) return this.config.glassSize;
                return {
                    width: elm.clientWidth,
                    height: elm.clientWidth
                };
            },
            
            /**
             * ��ȡ�����ҳ���ϵ�λ��
             * @param ev        �����¼�
             * @return offset   �����ҳ���ϵĺ�����λ��
             */
            getMousePoint: function(ev) {
                return {x: ev.pageX, y: ev.pageY}
            },
            
            /**
             * ��ȡԪ����ʽ
             * @param elm Ŀ��Ԫ��
             * @param p   ��ʽ����
             * @return Ԫ�ض�Ӧ����ʽ
             */
            getStyle: function(elm, p){
                if (typeof elm == 'string') {
                    elm = S.get(elm);
                }

                if (window.getComputedStyle) {
                    //document.defaultView 
                    var y = window.getComputedStyle(elm, '');
                } else if (elm.currentStyle) {
                    var y = elm.currentStyle;
                }
                return y[p];
            },
            
            /**
             * ��ͼƬ������ʱ��ʾ��ʾ��Ϣ
             */
            showMsg: function(){
                var b = S.get('b', self.viewer);
                if (!b) {
                    b = DOM.create('<b></b>');
                    this.viewer.appendChild(b);
                    DOM.removeClass(this.viewer, IMGZOOM_VIEWER_BK_CLS);
                }
                DOM.html(b, 'ͼƬ�ݲ�����');
            },
            hideMsg: function(){
                var b = S.get('b', this.viewer);
                DOM.html(b, '');
                DOM.addClass(this.viewer, IMGZOOM_VIEWER_BK_CLS);
            }
        });
        
        S.augment(ImageZoom, S.EventTarget);
        
        S.ImageZoom = ImageZoom;
    
});

/**
 * NOTES:
 *  2010.6
 *      - ����positionѡ��, ��̬��������dom;
 *      - Сͼ����;
 *      - ��ͼ����֮�������ʾ;
 *      - �������ģʽ
 *      - ����Timeout
 *      - 6. 24  ȥ��yahoo-dom-event����
 *  TODO:
 *      - ���뷴תģʽ;
 */
