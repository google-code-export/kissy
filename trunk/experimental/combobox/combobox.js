/**
 * KISSY.ComboBox ѡ������
 *
 * @creator     ��<lifesinger@gmail.com>
 * @depends     yahoo-dom-event
 */

var KISSY = window.KISSY || {};

(function() {
    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = YAHOO.lang,

        TMPL_CAPTION = '<div class="kissy-combobox-caption" style="width:{width}">' +
                          '<input type="text" autocomplete="off" />' +
                          '<span class="kissy-combobox-trigger"></span>' +
                      '</div>',
        TMPL_DROPLIST = '<div class="kissy-combobx-droplist" style="width:{width};max-height:{max-height}">' +
                           '<ol>' +
                               '<li>{option}</li>' +
                           '</ol>' +
                       '</div>',

        tmplDiv = document.createElement("div"), // ͨ�� el ����

        defaultConfig = {

            /**
             * ���Ͽ�Ŀ��
             */
            width: "150px",

            /**
             * �����б�Ŀ�ȣ�Ĭ�Ϻ�ͷ������һ��
             */
            dropListWidth: "150px",

            /**
             * �����б�����߶ȣ�Ĭ��ȡ 300px = 20�� * 15px
             */
            dropListHeight: "300px"
        };

    /**
     * ѡ������
     * @class ComboBox
     * @constructor
     */
    var ComboBox = function(el, config) {
        // Factory or constructor
        if (!(this instanceof arguments.callee)) {
            return new arguments.callee(el, config);
        }

        /**
         * ������ĳ�ʼ dom Ԫ��
         * @type {HTMLElement} ����Ϊ select Ԫ�ػ� input Ԫ��
         * TODO: Ŀǰֻ���� orgEl Ϊ select �����
         */
        this.orgEl = Dom.get(el);

        /**
         * ���ò���
         * @type {object}
         */
        this.config = Lang.merge(defaultConfig, config || {});

        /**
         * ���Ͽ��ͷ��
         * @type {HTMLElement}
         */
        //this.caption

        /**
         * ���Ͽ�������б�
         * @type {HTMLElement}
         */
        // this.dropList

        this._init();
    };

    Lang.augmentObject(ComboBox.prototype, {

        _init: function() {
            this._renderUI();
        },

        _renderUI: function() {
            this._renderCaption();
            this._renderDropList();
        },

        _renderCaption: function() {
            var config = this.config, orgEl = this.orgEl,
                caption;

            tmplDiv.innerHTML = TMPL_CAPTION
                    .replace("{width}", config.width);

            caption = tmplDiv.firstChild;
            orgEl.parentNode.insertBefore(caption, orgEl);

            this.caption = caption;
        },

        _renderDropList: function() {
            var config = this.config, dropList;

            tmplDiv.innerHTML = TMPL_DROPLIST
                    .replace("{width}", config.dropListWidth)
                    .replace("{max-height}", config.dropListHeight);

            dropList = tmplDiv.firstChild;
            document.body.appendChild(dropList);

            this.dropList = dropList;
        }

    });

    KISSY.ComboBox = ComboBox;
})();
