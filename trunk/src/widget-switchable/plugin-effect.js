/**
 * Switchable Effect Plugin
 * @creator     ��<lifesinger@gmail.com>
 * @depends     kissy, yui-base, yui-animation, widget, widget-switchable
 */
KISSY.add("widget-switchable-effect", function(S) {

    var Y = YAHOO.util, Dom = Y.Dom,
        SWITCHABLE = "switchable",
        BLOCK = "block", NONE = "none",
        OPACITY = "opacity", Z_INDEX = "z-index",
        RELATIVE = "relative", ABSOLUTE = "absolute",
        SCROLLX = "scrollx", SCROLLY = "scrolly", FADE = "fade",
        Switchable = S.Switchable;

    /**
     * ���Ĭ������
     */
    S.mix(Switchable.Config, {
        effectType: NONE, // "scrollx", "scrolly", "fade"
        animDuration: .5, // �����л�Ч��ʱ���л���ʱ��
        animEasing: Y.Easing.easeNone, // easing method

        panelSize: [] // ���� panel �Ŀ�ߡ�һ�㲻��Ҫ�趨��ֵ
        // ֻ�е��޷���ȷ��ȡ�߿�ʱ������Ҫ�趨
        // ���縸��Ԫ�� display: none ʱ���޷���ȡ�� offsetWidth, offsetHeight
    });

    /**
     * ����Ч����
     */
    var effects = {

        // �����ص���ʾ/����Ч��
        none: function(fromEl, toEl, callback) {
            fromEl.style.display = NONE;
            toEl.style.display = BLOCK;
            callback();
        },

        // ��������Ч��
        fade: function(fromEl, toEl, callback) {
            var self = this, cfg = self.config[SWITCHABLE];
            if (self.anim) self.anim.stop();

            // ������ʾ��һ��
            Dom.setStyle(toEl, OPACITY, 1);

            // �����л�
            self.anim = new Y.Anim(fromEl, {opacity: {to: 0}}, cfg.animDuration, cfg.animEasing);
            self.anim.onComplete.subscribe(function() {
                self.anim = null; // free

                // �л� z-index
                Dom.setStyle(toEl, Z_INDEX, 9);
                Dom.setStyle(fromEl, Z_INDEX, 1);

                callback();
            });
            self.anim.animate();
        },

        // ˮƽ/��ֱ����Ч��
        scroll: function(fromEl, toEl, callback, index) {
            var self = this, cfg = self.config[SWITCHABLE],
                isX = cfg.effectType === SCROLLX,
                diff = self.panelSize[isX ? 0 : 1] * index,
                attributes = {};

            attributes[isX ? "left" : "top"] = { to: -diff };

            if (self.anim) self.anim.stop();
            self.anim = new Y.Anim(self.content, attributes, cfg.animDuration, cfg.animEasing);
            self.anim.onComplete.subscribe(function() {
                self.anim = null; // free
                callback();
            });
            self.anim.animate();
        }
    };
    effects[SCROLLX] = effects[SCROLLY] = effects.scroll;

    /**
     * ֯���ʼ������������ effectType��������ʼ״̬
     */
    S.weave(function() {
        var self = this, cfg = self.config[SWITCHABLE],
            type = cfg.effectType, panels = self.panels,
            i, len = self.triggers.length,
            activeIndex = self.activeIndex;

        // 1. ��ȡ�߿�
        self.panelSize = [
            cfg.panelSize[0] || panels[0].offsetWidth,
            cfg.panelSize[0] || panels[0].offsetHeight
            ];
        // ע������ panel �ĳߴ�Ӧ����ͬ
        //    ���ָ����һ�� panel �� width �� height����Ϊ Safari �£�ͼƬδ����ʱ����ȡ�� offsetHeight ��ֵ�᲻��

        // 2. ��ʼ�� panels ��ʽ
        if (type === NONE) {
            // Ĭ�������ֻ��ʾ activePanel
            for (i = 0; i < len; i++) {
                panels[i].style.display = i === activeIndex ? BLOCK : NONE;
            }

        } else { // type = scrollx, scrolly, fade

            // ��Щ��Ч��Ҫ�� panels ����ʾ����
            for (i = 0; i < len; i++) {
                panels[i].style.display = BLOCK;
            }

            switch (type) {
                // ����ǹ���Ч��
                case SCROLLX:
                case SCROLLY:
                    // ���ö�λ��Ϣ��Ϊ����Ч�����̵�
                    self.container.style.position = RELATIVE;
                    self.content.style.position = ABSOLUTE;

                    // ˮƽ����
                    if (type === SCROLLX) {
                        Dom.setStyle(panels, "float", "left");

                        // ��������ȣ��Ա�֤�пռ��� panels ˮƽ�Ų�
                        this.content.style.width = self.panelSize[0] * len + "px";
                    }
                    break;

                // �����͸��Ч�������ʼ��͸��
                case FADE:
                    for (i = 0; i < len; i++) {
                        Dom.setStyle(panels[i], OPACITY, i === self.activeIndex ? 1 : 0);
                        panels[i].style.position = ABSOLUTE;
                        panels[i].style.zIndex = i === self.activeIndex ? 9 : 1;
                    }
                    break;
            }
        }

        // 3. �� CSS ���Ҫ�� container �趨�߿�� overflow: hidden
        //    nav �� cls �� CSS ָ��

    }, "after", Switchable, "_initSwitchable");

    /**
     * �����л�����
     */
    S.mix(Switchable, {
       /**
         * �л�����
         */
        _switchPanel: function(fromEl, toEl, index) {
            var self = this, cfg = self.config[SWITCHABLE];

            effects[cfg.effectType].call(self, fromEl, toEl, function() {
                // fire event
                self.fireEvent("onSwitch", index);
            }, index);
        }
    });
});
