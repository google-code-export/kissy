/**
 * SlideView
 * @module      slideview
 * @creator     ��<lifesinger@gmail.com>
 * @depends     kissy-core, yahoo-dom-event
 */
KISSY.add("slideview", function(S) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = YAHOO.lang,

        defaultConfig = {
        };

    /**
     * Triggerable
     * @constructor
     */
    function SlideView(container, config) {
        // factory or constructor
        if (!(this instanceof arguments.callee)) {
            return new arguments.callee(container, config);
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

    S.mix(SlideView.prototype, {

        /**
         * ��ʼ��
         * @protected
         */
        _init: function() {
        }
    });

    S.mix(SlideView.prototype, S.Triggerable);
    S.SlideView = SlideView;
});
