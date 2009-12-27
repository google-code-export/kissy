/**
 * Switchable Autoplay Plugin
 * @creator     ��<lifesinger@gmail.com>
 * @depends     kissy, yui-base, widget, widget-switchable
 */
KISSY.add("widget-switchable-autoplay", function(S) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = YAHOO.lang,
        SWITCHABLE = "switchable",
        Switchable = S.Switchable;

    S.mix(Switchable.Config, {
        autoPlay: false,
        autoPlayInterval: 5, // �Զ����ż��ʱ��
        pauseOnHover: true  // triggerType Ϊ mouse ʱ�������ͣ�� slide ���Ƿ���ͣ�Զ�����
    });

    /**
     * ��ʼ���Զ�����
     */
    function initAutoPlay() {
        var self = this, cfg = self.config[SWITCHABLE], max;
        if (!cfg.autoPlay) return;

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
        max = self.panels.length - 1;
        self.autoPlayTimer = Lang.later(cfg.autoPlayInterval * 1000, self, function() {
            if (self.paused) return;
            self.switchTo(self.activeIndex < max ? self.activeIndex + 1 : 0);
        }, null, true);
    }

    S.weave(initAutoPlay, "after", Switchable, "_initSwitchable");
});
