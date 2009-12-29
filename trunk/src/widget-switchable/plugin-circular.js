/**
 * Switchable Circular Plugin
 * @creator     ��<lifesinger@gmail.com>
 * @depends     kissy, yui-base, widget, switchable
 */
KISSY.add("switchable-circular", function(S) {

    var Y = YAHOO.util, Event = Y.Event, Lang = YAHOO.lang,
        SWITCHABLE = "switchable",
        RELATIVE = "relative", LEFT = "left", TOP = "top",
        SCROLLX = "scrollx", SCROLLY = "scrolly",
        Switchable = S.Switchable;

    /**
     * ���Ĭ������
     */
    S.mix(Switchable.Config, {
        circular: false
    });

    /**
     * ֯���ʼ������
     */
    S.weave(function() {
        var self = this, cfg = self.config[SWITCHABLE],
            max = self.length - 1, steps = cfg.steps,
            panels = self.panels,
            effect = cfg.effect, isX = effect === SCROLLX;

        if (!cfg.circular || (!isX && effect !== SCROLLY)) return; // ���й���Ч����Ҫ����ĵ���

        self.subscribe("beforeSwitch", function(index) {
            var activeIndex = self.activeIndex, i, from, to,
                prop = isX ? LEFT : TOP,
                panelDiff = self.viewSize[isX ? 0 : 1] / steps;

            if (activeIndex === 0 && index === max) { // �ӵ�һ�������һ��
                from = max * steps;
                to = (max + 1) * steps;

                // �����һ����ͼ�ڵ� panels ������ǰ��
                for(i = from; i < to; i++) {
                    panels[i].style.position = RELATIVE;
                    panels[i].style[prop] = "-" + panelDiff * (i + steps - 1) + "px";
                }
            }
        });

    }, "after", Switchable, "_initSwitchable");
});

/**
 * TODO:
 *   - �Ƿ���Ҫ���Ǵ� 1 �� 2 ˳ʱ�����������Ҫ��� direction �жϡ�
 */