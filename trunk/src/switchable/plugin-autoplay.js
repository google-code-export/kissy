/**
 * Switchable Autoplay Plugin
 * @creator     ��<lifesinger@gmail.com>
 */
KISSY.add('switchable-autoplay', function(S) {

    var Event = S.Event,
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
     * ��Ӳ��
     * attached members:
     *   - this.paused
     *   - this.autoplayTimer
     */
    Switchable.Plugins.push({
        name: 'autoplay',

        init: function(host) {
            var cfg = host.config;
            if (!cfg.autoplay) return;

            // �����ͣ��ֹͣ�Զ�����
            if (cfg.pauseOnHover) {
                Event.on(host.container, 'mouseenter', function() {
                    host.paused = true;
                });
                Event.on(host.container, 'mouseleave', function() {
                    // ���� interval Ϊ 10s
                    // �� 8s ʱ��ͨ�� focus ���������л���ͣ�� 1s ������Ƴ�
                    // ��ʱ����� setTimeout, �ٹ� 1s ������������ panel �����滻��
                    // Ϊ�˱�֤ÿ�� panel ����ʾʱ�䶼��С�� interval, �˴����� setTimeout
                    setTimeout(function() {
                        host.paused = false;
                    }, cfg.interval * 1000);
                });
            }

            // �����Զ�����
            host.autoplayTimer = S.later(function() {
                if (host.paused) return;
                host.switchTo(host.activeIndex < host.length - 1 ? host.activeIndex + 1 : 0);
            }, cfg.interval * 1000, true);
        }
    });
});

/**
 * TODO:
 *  - �Ƿ���Ҫ�ṩ play / pause / stop API ?
 *  - autoplayTimer �� switchTimer �Ĺ�����
 */
