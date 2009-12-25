/**
 * �����˵����
 * @module      megamenu
 * @creator     ��<lifesinger@gmail.com>
 * @depends     kissy-core, yui-base
 */
KISSY.add("megamenu", function(S) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = YAHOO.lang,
        NONE = "none", BLOCK = "block",
        CLOSEBTN_TMPL = "<span class=\"{hook_cls}\"></span>",
        BEFORE_SHOW = "beforeShow",
        ON_HIDE = "onHide",
        CLS_PREFIX = "ks-megamenu-",

        defaultConfig = {

            triggerType: "mouse", // or "click" ��������
            triggerDelay: 0.1, // �����ӳ�
            hideDelay: .5,    // �����ӳ�

            // ֻ֧���ʶ����ṹ��view �����Զ�����
            itemCls: CLS_PREFIX + "item",
            viewCls: CLS_PREFIX + "view",
            contentCls: CLS_PREFIX + "content",
            activeItemCls: CLS_PREFIX + "item-active",
            closeBtnCls: CLS_PREFIX + "closebtn",

            showCloseBtn: true // �Ƿ���ʾ�رհ�ť
        };

    /**
     * @class MegaMenu
     * @constructor
     */
    function MegaMenu(container, config) {
        var self = this,
            cfg = S.merge(defaultConfig, config || {});
        
        // factory or constructor
        if (!(self instanceof arguments.callee)) {
            return new arguments.callee(container, config);
        }

        /**
         * �˵�����
         * @type HTMLElement
         */
        self.container = Dom.get(container);

        /**
         * ���ò���
         * @type Object
         */
        self.config = cfg;

        /**
         * �˵���
         */
        self.triggers = Dom.getElementsByClassName(cfg.itemCls, "*", container);

        /**
         * ��ʾ����
         */
        self.view = Dom.getElementsByClassName(cfg.viewCls, "*", container)[0];
        self.view.contentEl = self.view; // contentEl �Ƿ������ݵ��������޹رհ�ťʱ������ view ����

        /**
         * ����
         */
        self.contents = [];
        Dom.getElementsByClassName(cfg.contentCls, "*", container, function(each) {
            self.contents.push(each.value || each.innerHTML);
        });

        /**
         * ��ʱ��
         */
        self.showTimer = null;
        self.hideTimer = null;

        /**
         * ��ǰ������
         */
        self.activeIndex = -1;

        // init
        self._init();
    }

    S.mix(MegaMenu.prototype, {

        _init: function() {
            var self = this;

            if(self.config.showCloseBtn){
                self._initCloseBtn();
            }

            self._bindUI();
        },

        _initCloseBtn: function() {
            var self = this, el, view = self.view;

            view.innerHTML = CLOSEBTN_TMPL.replace("{hook_cls}", self.config.closeBtnCls);
            Event.on(view.firstChild, "click", function() {
                self.hide();
            });

            el = document.createElement("div");
            view.appendChild(el);
            view.contentEl = el;
        },

        _bindUI: function() {
            var o = this, items = o.triggers, view = o.view,
                delay = o.config.delay, i, len = o.triggers.length;

            for (i = 0; i < len; i++) {
                (function(index) {
                    Event.on(items[index], "mouseover", function() {
                        if(o.hideTimer) o.hideTimer.cancel();

                        // ���ظ����������磺����ʾ����ʱ���������ٻ����ٻ������������ٴ���ʾ��
                        if(o.activeIndex !== index) {
                            o.showTimer = Lang.later(delay[0], o, "show", index);
                        }
                    });

                    Event.on(items[index], "mouseout", function() {
                        if(o.showTimer) o.showTimer.cancel();
                        o.hideTimer = Lang.later(delay[1], o, "hide");
                    });
                })(i);
            }

            Event.on(view, "mouseover", function() {
                if (o.hideTimer) o.hideTimer.cancel();
            });

            Event.on(view, "mouseout", function() {
                o.hideTimer = Lang.later(delay[1], o, "hide");
            });
        },

        updateContent: function(index) {
            this.view.contentEl.innerHTML = this.contents[index];
        },

        show: function(index) {
            var o = this, view = o.view,
                activeIndex = o.activeIndex,
                curCls = o.config.activeItemCls;

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
                Dom.removeClass(o.triggers[activeIndex], curCls);
            }
            Dom.addClass(o.triggers[index], curCls);

            // load new content
            o.updateContent(index);

            // update
            o.activeIndex = index;
        },

        hide: function() {
            var o = this;

            // hide current
            Dom.removeClass(o.triggers[o.activeIndex], o.config.activeItemCls);
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
