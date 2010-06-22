/**
 * �Ŵ�Ч��
 * @module      imagezoom
 * @creater     qiaohua@taobao.com
 * @depender    kissy-core, yahoo-dom-event
 */

KISSY.add("imagezoom", function(S, undefined) {
    var DOM = S.DOM,
        EVENT = S.Event,
        YDOM = YAHOO.util.Dom,
        HIDDEN = 'hidden',
        IMGZOOM_CONTAINER_CLS = 'ks-imagezoom-container',
        IMGZOOM_MAGNIFIER_CLS = 'ks-imagezoom-magnifier',
        IMGZOOM_VIEWER_CLS = 'ks-imagezoom-viewer',
        IMGZOOM_GLASS_CLS = 'ks-imagezoom-glass',
        IMGZOOM_ICON_CLS = 'ks-imagezoom-icon',
        POSITION = ['top', 'right', 'bottom', 'left'],
        TYPE = ['default', 'glass', 'overlay'],
        IMG_READY = false,      // Сͼ����״̬
        BIGIMG_READY = false,   // ��ͼ����״̬
        /**
         * imagezoom��Ĭ������
         */
        defaultConfig = {
            /**
             * Ĭ������
             */
            bigImageSrc: '',    // ��ͼƬ·��, Ϊ''ʱȡԭͼ·��
            offset: 10,         // ��ͼƫ����
            glassSize: [100, 100],      // ��Ƭ��,���
            useZoomIcon: true,          // �Ƿ���Ҫzoomicon
            zType: 'default',           // ѡ����ʾģʽ, ��ѡֵ: TYPE
            position: 'right',          // ��ͼ��ʾλ��, ��ѡֵ: POSITION
            preload: true               // �Ƿ�Ԥ����
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
            
            // ��Сͼ�������֮��, ��ʼ��
            self.image.onload = function(){
                if (!IMG_READY) {
                    IMG_READY = !IMG_READY;
                    self._init();
                }
            }
            if (!IMG_READY && self.image.complete) {
                IMG_READY = !IMG_READY;
                self._init();
            }
        }
        
        S.augment(ImageZoom, {
            /**
             * ��ʼ������
             * @protected
             */
            _init: function() {
                /**
                 * ��������DOM
                 */
                this._initContainer();
                
                var self = this,
                    cfg = self.config,
                    i = self.image,
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
                    
                    self._zoom(ev);
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
                c = DOM.create('div');
                DOM.addClass(c, IMGZOOM_CONTAINER_CLS);
                DOM.parent(i).insertBefore(c, i);
                self.container = c;
                
                // ����Сͼ���
                o = DOM.create('div');
                DOM.addClass(o, IMGZOOM_MAGNIFIER_CLS);
                o.appendChild(i);
                c.appendChild(o);
                self.origin = o;
                
                // ��Ƭģʽ��
                if (TYPE[1] == cfg.zType) {
                    g = DOM.create('div');
                    DOM.addClass(g, IMGZOOM_GLASS_CLS);
                    DOM.addClass(g, HIDDEN);
                    g.style.height = cfg.glassSize[0]+'px';
                    g.style.width = cfg.glassSize[1]+'px';
                    o.appendChild(g);
                    self.glass = g;
                }
                // ��Ҫ��ʾ�Ŵ�ͼ��
                if (cfg.useZoomIcon) {
                    z = DOM.create('div');
                    DOM.addClass(z, IMGZOOM_ICON_CLS);
                    o.appendChild(z);
                    self.zoomIcon = z;
                }
                
                // ����������С��λ��
                self.container.style.height = parseInt(self.getStyle(o, 'marginTop')) + parseInt(self.getStyle(o, 'marginBottom')) + self.getSize(o).height + 'px';
                if (POSITION[0] == cfg.position) {
                    self.container.style.marginTop = self.getSize(i).height + parseInt(self.getStyle(i, 'borderTopWidth')) + cfg.offset + 'px';
                } else if (POSITION[3] == cfg.position) {
                    self.container.style.marginLeft = self.getSize(i).width + parseInt(self.getStyle(i, 'borderLeftWidth')) + cfg.offset + 'px';
                }
            },
            
            /**
             * ���÷Ŵ�ͼƬ��ʾ��ƫ����
             * @param ev    �������¼�
             */
            _zoom: function(ev) {
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
             * ������ͼ����ʾDOM
             */
            _createZoom: function(ev) {
                var self = this,
                    cfg = self.config,
                    i = self.image, v;
                
                // ������ͼ��ʾDOM�ṹ
                v = DOM.create('div');
                DOM.addClass(v, IMGZOOM_VIEWER_CLS);
                var bimg = DOM.create('img');
                DOM.attr(bimg, 'src', cfg.bigImageSrc);
                v.appendChild(bimg);
                // ��ӵ�ԭ��DOM��
                if (TYPE[2] == cfg.zType) {
                    self.origin.appendChild(v);
                } else {
                    self.container.appendChild(v);
                }
                self.bigImage = bimg;
                self.viewer = v;
                
                // ��ȡСͼƬƫ����, ʵ�ʳߴ�, ��Ƭʵ�ʳߴ�
                var imageOffset = self.getOffset(i),
                    imageSize = self.getSize(i),
                    glassSize = self.getSize(self.glass);
                
                // �����ͼƫ����
                var leftPos, topPos;
                // ����ԭͼ�߿���
                var btw = parseInt(self.getStyle(i, 'borderTopWidth')),
                    blw = parseInt(self.getStyle(i, 'borderLeftWidth'));
                if (TYPE[2] == cfg.zType) {
                    // ��ʾ�����ʼλ��
                    var mousePoint = self.getMousePoint(ev),
                        cursorX = mousePoint.x - imageOffset.left,
                        cursorY = mousePoint.y - imageOffset.top;
                    leftPos = cursorX - glassSize.width/2;
                    topPos = cursorY - glassSize.height/2;
                } else if (POSITION[0] == cfg.position) {
                    topPos = - (imageSize.height + btw + cfg.offset - parseInt(self.getStyle(self.origin, 'marginTop')));
                    leftPos = imageOffset.left;
                } else if (POSITION[2] == cfg.position) {
                    topPos = imageSize.height + imageOffset.top + cfg.offset;
                    leftPos = imageOffset.left;
                } else if (POSITION[3] == cfg.position) {
                    topPos = imageOffset.top;
                    leftPos = - (imageSize.width + blw + cfg.offset - parseInt(self.getStyle(self.origin, 'marginLeft')));
                } else {
                    topPos = imageOffset.top;
                    leftPos = imageOffset.left + imageSize.width + cfg.offset;
                }
                self.viewer.style.top = topPos + 'px';
                self.viewer.style.left = leftPos + 'px';
                
                if (TYPE[2] == cfg.zType) {
                    // ����ģʽ��, ��ʾ�����߶����û��趨��glass��߶Ⱦ���
                    self.viewer.style.height = glassSize.height + 'px';
                    self.viewer.style.width =  glassSize.width + 'px';
                } else {
                    self.viewer.style.height = imageSize.height - btw*2 + 'px';
                    self.viewer.style.width =  Math.round(imageSize.height/glassSize.height*glassSize.width) - blw*2 + 'px';
                    // ��ͼ����������������ʾ�����߶�
                    self.bigImage.onload = function() {
                        if (!BIGIMG_READY) {
                            BIGIMG_READY = !BIGIMG_READY;
                            self._updateViewer();
                        }
                    }
                    if (!BIGIMG_READY && self.bigImage.complete) {
                        BIGIMG_READY = !BIGIMG_READY;
                        self._updateViewer();
                    }
                }
                DOM.removeClass(v, HIDDEN);
            },
            
            /**
             * ������ʾ�����С
             */
            _updateViewer: function() {
                var self = this,
                    bigImageSize = self.getSize(self.bigImage),
                    imageSize = self.getSize(self.image),
                    glassSize = self.getSize(self.glass);
                self.viewer.style.height = Math.round(bigImageSize.height*glassSize.height/imageSize.height) + 'px';
                self.viewer.style.width = Math.round(bigImageSize.width*glassSize.width/imageSize.width) + 'px';
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
                var imageOffset = self.getOffset(i);
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
                var cfg = this.config;
                if (!elm) return {height: cfg.glassSize[0], width: cfg.glassSize[1]};
                return {
                    width: elm.offsetWidth,
                    height: elm.offsetHeight
                };
            },
            
            /**
             * ��ȡ�ۼ�ƫ����, ��Ԫ�ص�ҳ�����Ͻǵĺ��к��������
             * @param   elm    Ŀ��Ԫ��
             * @return  left  ����ƫ�ƾ���, top:����ƫ�ƾ���
             */
            getOffset: function(elm) {
                return {
                    left: YDOM.getXY(elm)[0],
                    top: YDOM.getXY(elm)[1]
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
            }
        });
        
        S.augment(ImageZoom, S.EventTarget);
        
        S.ImageZoom = ImageZoom;
    
});

/**
 * NOTES:
 *  2010.6
 *      - ����positionѡ��, ��̬��������dom;
 *      - Сͼ����֮����ܼ���;
 *      - ��ͼ����
 *      - �������ģʽ
 *  TODO:
 *      - ���뷴תģʽ;
 */
