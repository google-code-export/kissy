/**
 * Triggerable
 * @module      triggerable
 * @creator     ��<lifesinger@gmail.com>
 * @depends     kissy-core, yahoo-dom-event
 */
KISSY.add("triggerable", function(S) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = YAHOO.lang;

    /**
     * Triggerable
     * @constructor
     * Լ����
     *   - this.config.triggerType   �������͡�Ĭ��Ϊ mouse
     *   - this.config.triggerDelay  �����ӳ١�Ĭ��Ϊ 0.1
     *   - this.triggers
     *   - this.panels
     *   - this.activeIndex
     */
    function Triggerable() {
    }

    S.mix(Triggerable.prototype, {

        /**
         * �� triggers ����¼�

         */
        _bindTriggers: function() {
            var self = this, cfg = self.config, triggers = self.triggers,
                i, len = triggers.length;

            for (i = 0; i < len; i++) {
                
                if (cfg.triggerType === "mouse") {
                    Event.on(triggers[i], "mouseover", self._onMouseOverTrigger, i, self);
                    Event.on(triggers[i], "mouseout", self._onMouseOutTrigger, i, self);
                }
            }
        },

        /**
         * ��������� trigger ��ʱ�������¼�
         * @protected
         */
        _onMouseOverTrigger: function(index) {
            var self = this;

            // ���ظ����������磺����ʾ����ʱ���������ٻ����ٻ����������ش���
            if (self.activeIndex !== index) {
                self.showTimer = Lang.later(self.config.triggerDelay, self, "switchTo", index);
            }
        },

        /**
         * ����Ƴ� trigger ʱ�������¼�
         * @protected
         */
        _onMouseOutTrigger: function() {
            var self = this;
            if (self.showTimer) self.showTimer.cancel();
        },

        /**
         * �л�����
         */
        switchTo: function(index) {

        }
    });

    S.Triggerable = Triggerable;
});
