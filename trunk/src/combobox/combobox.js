/**
 * KISSY.ComboBox ѡ������
 *
 * @creator     ��<lifesinger@gmail.com>
 * @depends     yahoo-dom-event
 */

var KISSY = window.KISSY || {};

(function() {
    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = YAHOO.lang,

        defaultConfig = {

        };

    /**
     * ѡ������
     * @class ComboBox
     * @constructor
     */
    var ComboBox = function(el, config) {
        // Factory or constructor
        if (!(this instanceof arguments.callee)) {
            return new arguments.callee(containers, config);
        }

        /**
         * ���ò���
         * @type Object
         */
        this.config = Lang.merge(defaultConfig, config || {});
    };

    Lang.augmentObject(ComboBox.prototype, {
        /**
         * ��ʼ��
         * @protected
         */
        _init: function() {
        }
    });

    KISSY.ComboBox = ComboBox;
})();
