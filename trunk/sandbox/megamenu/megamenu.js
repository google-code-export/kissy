/**
 * �����˵����
 * @module      megamenu
 * @creator     ��<lifesinger@gmail.com>
 * @depends     kissy-core, yahoo-dom-event
 */
KISSY.add("megamenu", function(S) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = YAHOO.lang,

        ITEM_CLS = "ks-megamenu-item",
        VIEW_CLS = "ks-megamenu-view",
        CONTENT_CLS = "ks-megamenu-content",
        CURRENT_ITEM_CLS = ITEM_CLS + "-current",
        NONE = "none",
        BLOCK = "block",
        CLOSEBTN_TMPL = '<span class="ks-megamenu-closebtn">X</span>',

        BEFORE_SHOW = "beforeShow",
        ON_HIDE = "onHide",

        defaultConfig = {

            /**
             * �ӳ�ʱ��
             */
            delay: 0.5,

            /**
             * �Ƿ���ʾ�رհ�ť
             */
            showCloseBtn: true
        };

    /**
     * @class MegaMenu
     * @constructor
     */
    function MegaMenu(container, config) {
        // factory or constructor
        if (!(this instanceof arguments.callee)) {
            return new arguments.callee(container, config);
        }

        /**
         * �˵�����
         * @type HTMLElement
         */
        this.container = Dom.get(container);

        /**
         * ���ò���
         * @type Object
         */
        this.config = S.merge(defaultConfig, config || {});
        this.config.delay *= 1000;

        /**
         * �˵���
         */
        this.items = Dom.getElementsByClassName(ITEM_CLS, "*", container);

        /**
         * ��ʾ����
         */
        this.view = Dom.getElementsByClassName(VIEW_CLS, "*", container)[0];
        this.view.contentEl = this.view; // dataEl �Ƿ������ݵ��������޹رհ�ťʱ������ view ����

        /**
         * ����
         */
        this.contents = [];
        Dom.getElementsByClassName(CONTENT_CLS, "*", container, function(each) {
            this.contents.push(each.value || each.innerHTML);
        }, this, true);

        /**
         * ��ʱ��
         */
        this.showTimer = null;
        this.hideTimer = null;

        /**
         * ��ǰ������
         */
        this.activeIndex = -1;

        // go
        this._init();
    }

    S.mix(MegaMenu.prototype, {

        _init: function() {
            var o = this;

            if(o.config.showCloseBtn){
                o._initCloseBtn();
            }

            o._bindUI();
        },

        _initCloseBtn: function() {
            var o = this, el, view = o.view;

            view.innerHTML = CLOSEBTN_TMPL;
            Event.on(view.firstChild, "click", function() {
                o.hide();
            });

            el = document.createElement("div");
            view.appendChild(el);
            view.contentEl = el;
        },

        _bindUI: function() {
            var o = this, items = o.items, view = o.view,
                delay = o.config.delay, i, len = o.items.length;

            for (i = 0; i < len; i++) {
                (function(index) {
                    Event.on(items[index], "mouseover", function() {
                        if(o.hideTimer) o.hideTimer.cancel();

                        // ���ظ����������磺����ʾ����ʱ���������ٻ����ٻ������������ٴ���ʾ��
                        if(o.activeIndex !== index) {
                            o.showTimer = Lang.later(delay, o, "show", index);
                        }
                    });

                    Event.on(items[index], "mouseout", function() {
                        if(o.showTimer) o.showTimer.cancel();
                        o.hideTimer = Lang.later(delay, o, "hide");
                    });
                })(i);
            }

            Event.on(view, "mouseover", function() {
                if (o.hideTimer) o.hideTimer.cancel();
            });

            Event.on(view, "mouseout", function() {
                o.hideTimer = Lang.later(delay, o, "hide");
            });
        },

        updateContent: function(index) {
            this.view.contentEl.innerHTML = this.contents[index];
        },

        show: function(index) {
            var o = this, view = o.view, activeIndex = o.activeIndex;

            // bugfix: YAHOO.lang.later ��� d = d || [];
            index = index || 0;

            if(activeIndex === index) return; // �ظ�����

            // fire event
            o.fireEvent(BEFORE_SHOW, o);

            // show view
            if(view.style.display !== BLOCK) {
                view.style.display = BLOCK;
            }

            // toggle current item
            if(activeIndex >= 0) {
                Dom.removeClass(o.items[activeIndex], CURRENT_ITEM_CLS);
            }
            Dom.addClass(o.items[index], CURRENT_ITEM_CLS);

            // load new content
            o.updateContent(index);

            // update
            o.activeIndex = index;
        },

        hide: function() {
            var o = this;

            // hide current
            Dom.removeClass(o.items[o.activeIndex], CURRENT_ITEM_CLS);
            o.view.style.display = NONE;

            // update
            o.activeIndex = -1;

            // fire event
            o.fireEvent(ON_HIDE, o);
        }
    });

    S.mix(MegaMenu.prototype, Y.EventProvider.prototype);

    S.MegaMenu = MegaMenu;
});
