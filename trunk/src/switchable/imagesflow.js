// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=gbk nobomb:
/**
 * Imagesflow
 *
 * @author mingcheng<i.feelinglucky#gmail.com>
 * @date   2010-04-05
 * @link   http://www.gracecode.com/
 */

KISSY.add('imagesflow', function(S) {
    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = YAHOO.lang;

    /**
     * Imagesflow ��Ĭ������
     */
    var defaultConfig = {
        flowLength: 4, // Max number of images on each side of the focussed one
        aspectRatio: 1.964, // Aspect ratio of the ImageFlow container (width divided by height)
        step: 150,
        height: 350,
        width: 500,
        offset: 0, // ���
        animSpeed: 50,  // ������������룩
        switchToMiddle: true // �Զ��л����м�
    };
    var MAGIC_NUMBER = 90, MAGIC_DIVISOR = 1.25;

    var Imagesflow = function(container, config) {
        var self = this;

        if (!(self instanceof Imagesflow)) {
            return new Imagesflow(container, config);
        }
        config = S.merge(defaultConfig, config || {});

        self.panels   = config.panels;
        self.triggers = self.panels;

        Imagesflow.superclass.constructor.call(self, container, config);

        //self._init();
    }
    S.extend(Imagesflow, S.Switchable);

    /**
     *
     */
    S.mix(Imagesflow.prototype, {
        _init: function() {
            var self = this, cfg = self.config, panels = self.panels;

            self.busy        = false;         // ����״̬
            self.curFrame    = 0;             // ��ǰ����֡
            self.targetFrame = 0;             // Ŀ�����֡
            self.zIndex      = panels.length; // ��� zIndex ֵ

            self.maxFocus  = cfg.flowLength * cfg.step;
            self.region    = Dom.getRegion(self.container); // ����������ʹ�С
            self.maxHeight = Math.round(self.region.width / cfg.aspectRatio); // ���߶�
            self.middleLine = self.region.width / 2; // �м���

            // �Զ��л����м�?
            if (cfg.switchToMiddle) {
                self.switchTo(Math.floor(panels.length/2));
            } else {
                self._frame(0);
            }
        },

        switchTo: function(index) {
            var self = this, cfg = self.config,
                triggers = self.triggers, panels = self.panels,
                activeIndex = self.activeIndex;

            self.perIndex = parseInt(index, 10);

            //S.log('Triggerable.switchTo: index = ' + index);

            // �����Ҫ�л����ǵ�ǰ���򷵻�
            if (index === activeIndex && !self.busy) {
                //console.warn('busy');
                return self;
            }
            //if (!self.fire(BEFORE_SWITCH, index)) return self;

            // switch active trigger
            if (cfg.hasTriggers) {
                self._switchTrigger(activeIndex > -1 ? triggers[activeIndex] : null, triggers[index]);
            }

            self.targetFrame = -index * cfg.step;

            // �л�����Ч��
            self._switchView();

            // update activeIndex
            self.activeIndex = index;

            return self; // chain
        },

        /**
         * ���ж���
         *
         * @return void
         */
        _switchView: function(fromPanels, toPanels, index, direction) {
            var self = this, panels = self.panels, cfg = self.config;
            if (self.targetFrame < self.curFrame - 1 || self.targetFrame > self.curFrame + 1) {
                self._frame(self.curFrame + (self.targetFrame - self.curFrame) / 3);
                self._timer = Lang.later(cfg.animSpeed, self, self._switchView);
                self.busy = true;
            } else {
                // callback
                
                
                self.busy = false; // �������
            }
        },

        /**
         * ����ÿ֡����
         *
         * @return void
         */
        _frame: function(frame) {
            var self = this, cfg = self.config, panels = self.panels, 
                region = self.region, middleLine = self.middleLine - cfg.offset, curPanels, curImgPos;

            self.curFrame = frame; // ��ǵ�ǰ֡

            for (var index = 0, len = panels.length; index < len; index++) {
                curPanels = self.panels[index];
                curImgPos = index * -cfg.step;
                if ((curImgPos + self.maxFocus) < self.targetFrame || (curImgPos - self.maxFocus) > self.targetFrame) {
                    // ���ض���ķ���
                    Dom.setStyle(curPanels, 'visibility', 'hidden');
                } else {
                    // ������������
                    var x = (Math.sqrt(10000 + frame * frame) + 100), xs = frame / x * middleLine + middleLine;
                    var height = (cfg.width / cfg.height * MAGIC_NUMBER) / x * middleLine, width = 0;

                    if (height > self.maxHeight) {
                        height = self.maxHeight;
                    }
                    width  = cfg.width / cfg.height * height;

                    // ���㲢���õ�ǰλ��
                    Dom.setStyle(curPanels, 'left', xs - (MAGIC_NUMBER/MAGIC_DIVISOR) / x * middleLine + 'px');
                    if (height && width) {
                        Dom.setStyle(curPanels, 'height', height + 'px');
                        Dom.setStyle(curPanels, 'width',  width + 'px');
                        Dom.setStyle(curPanels, 'top', region.height / 2 - height / 2 + 'px');
                    }
                    Dom.setStyle(curPanels, 'z-index', self.zIndex * 100 - Math.ceil(x));
                    //*/

                    // �ظ����¼�
                    // @todo Ч������
                    ///*
                    ~function(index) {
                        if (self.perIndex == index) {
                            curPanels.onclick = function(e) {
                                alert('current');
                                //EVENT_ON_CURRENT
                            }
                        } else {
                            curPanels.onclick = function(e) {
                                self.switchTo(index);
                                return false;
                            }
                        }
                    }(index);
                    // */

                    Dom.setStyle(curPanels, 'visibility', 'visible');
                }

                frame += cfg.step;
            }
        }
    });

    S.Imagesflow = Imagesflow;
});
