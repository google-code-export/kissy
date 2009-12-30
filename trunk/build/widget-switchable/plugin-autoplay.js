/*
Copyright (c) 2010, Kissy UI Library. All rights reserved.
MIT Licensed.
http://kissy.googlecode.com/

Date: 2009-12-30 20:31:18
Revision: 389
*/
/**
 * Switchable Autoplay Plugin
 * @creator     ��<lifesinger@gmail.com>
 * @depends     kissy, yui-base, widget, switchable
 */
KISSY.add("switchable-autoplay", function(S) {

    var Y = YAHOO.util, Event = Y.Event, Lang = YAHOO.lang,
        SWITCHABLE = "switchable",
        Switchable = S.Switchable;

    /**
     * ���Ĭ������
     */
    S.mix(Switchable.Config, {
        autoplay: false,
        interval: 5, // �Զ����ż��ʱ��
        pauseOnHover: true  // triggerType Ϊ mouse ʱ�������ͣ�� slide ���Ƿ���ͣ�Զ�����
    });

    /**
     * ֯���ʼ������
     * attached members:
     *   - this.paused
     *   - this.autoPlayTimer
     */
    S.weave(function() {
        var self = this, cfg = self.config[SWITCHABLE];
        if (!cfg.autoplay) return;

        // �����ͣ��ֹͣ�Զ�����
        if (cfg.pauseOnHover) {
            Event.on(self.container, "mouseenter", function() {
                self.paused = true;
            });
            Event.on(self.container, "mouseleave", function() {
                self.paused = false;
            });
        }

        // �����Զ�����
        self.autoplayTimer = Lang.later(cfg.interval * 1000, self, function() {
            if (self.paused) return;
            self.switchTo(self.activeIndex < self.length - 1 ? self.activeIndex + 1 : 0);
        }, null, true);

    }, "after", Switchable.prototype, "_initSwitchable");
});

/**
 * TODO:
 *  - �Ƿ���Ҫ�ṩ play / pause / stop API ?
 *  - autoplayTimer �� switchTimer �Ĺ�����
 */
