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
     *   - this.autoplayTimer
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
                // ���� interval Ϊ 10s
                // �� 8s ʱ��ͨ�� focus ���������л���ͣ�� 1s ������Ƴ�
                // ��ʱ����� setTimeout, �ٹ� 1s ������������ panel �����滻��
                // Ϊ�˱�֤ÿ�� panel ����ʾʱ�䶼��С�� interval, �˴����� setTimeout
                setTimeout(function() {
                    self.paused = false;
                }, cfg.interval * 1000);
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
