/**
 * Triggerable
 * @module      triggerable
 * @creator     ��<lifesinger@gmail.com>
 * @depends     kissy-core, yahoo-dom-event
 */
KISSY.add("triggerable", function(S) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = YAHOO.lang,
        win = window, doc = document,

        defaultConfig = {
        };

    /**
     * Triggerable
     * @constructor
     */
    function Triggerable(triggers, panels, config) {
        // factory or constructor
        if (!(this instanceof arguments.callee)) {
            return new arguments.callee(triggers, panels, config);
        }

        /**
         * ����
         * @type HTMLElement
         */
        this.container = Dom.get(container);

        /**
         * ���ò���
         * @type Object
         */
        this.config = S.merge(defaultConfig, config || {});

        this._init();
    }

    S.mix(TriggerableView.prototype, {

        /**
         * ��ʼ��
         * @protected
         */
        _init: function() {
        }
    });

    S.Triggerable = Triggerable;
});
