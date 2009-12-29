/**
 * �����˵����
 * @module      megamenu
 * @creator     ��<lifesinger@gmail.com>
 * @depends     kissy-core, yui-base, widget, switchable
 */
KISSY.add("megamenu", function(S) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = YAHOO.lang,
        NONE = "none", BLOCK = "block",
        CLOSEBTN_TMPL = "<span class=\"{hook_cls}\"></span>",
        SWITCHABLE = "switchable",
        CLS_PREFIX = "ks-megamenu-",

        /**
         * Ĭ�����ã��� Switchable ��ͬ�����ô˴�δ�г�
         */
        defaultConfig = {
            hideDelay: .5,    // �����ӳ�

            viewCls: CLS_PREFIX + "view",
            closeBtnCls: CLS_PREFIX + "closebtn",

            showCloseBtn: true // �Ƿ���ʾ�رհ�ť
        };

    /**
     * @class MegaMenu
     * @constructor
     */
    function MegaMenu(container, config) {
        var self = this;

        // factory or constructor
        if (!(self instanceof arguments.callee)) {
            return new arguments.callee(container, config);
        }

        // extend Widget
        MegaMenu.superclass.constructor.call(self, container);

        /**
         * ���ò���
         * @type Object
         */
        self.config = S.merge(defaultConfig, config || {});

        // attach Switchable
        self.switchable(config);
        S.mix(self.config, self.config[SWITCHABLE]);

        /**
         * ��ʾ����
         */
        //self.view

        /**
         * ��ʾ�����������Ԫ��
         */
        //self.viewContent

        /**
         * ��ʱ��
         */
        //self.hideTimer

        /**
         * ��ǰ������
         */
        self.activeIndex = -1;

        // init
        S.mix(self, Self);
        self._init();

    }
    S.extend(MegaMenu, S.Widget);

    /**
     * MegaMenu ���еĳ�Ա
     */
    var Self = {

        /**
         * ��ʼ������
         * @protected
         */
        _init: function() {
            var self = this;

            self._initView();
            if(self.config.showCloseBtn) self._initCloseBtn();
        },

        /**
         * click or tab ������ trigger ʱ�������¼�
         * @override
         */
        _onFocusTrigger: function(index) {
            var self = this;
            if (self.activeIndex === index) return; // �ظ����
            if (self.switchTimer) self.switchTimer.cancel(); // ���磺�������������̵������ʱ�����¼�����ȡ����
            if(self.hideTimer) self.hideTimer.cancel(); // ȡ������

            self.switchTo(index);
        },

        /**
         * ��������� trigger ��ʱ�������¼�
         * @override
         */
        _onMouseEnterTrigger: function(index) {
            //S.log("Triggerable._onMouseEnterTrigger: index = " + index);
            var self = this;
            if(self.hideTimer) self.hideTimer.cancel(); // ȡ������

            // ���ظ����������磺����ʾ����ʱ���������ٻ����ٻ����������ش���
            self.switchTimer = Lang.later(self.config.delay * 1000, self, function() {
                self.switchTo(index);
            });
        },

        /**
         * ����Ƴ� trigger ʱ�������¼�
         * @override
         */
        _onMouseLeaveTrigger: function() {
            var self = this;
            if (self.switchTimer) self.switchTimer.cancel();

            self.hideTimer = Lang.later(self.config.hideDelay * 1000, self, function() {
                self.hide();
            });
        },

        /**
         * ��ʼ����ʾ����
         * @protected
         */
        _initView: function() {
            var self = this, cfg = self.config,
                view = Dom.getElementsByClassName(cfg.viewCls, "*", self.container)[0];

            // �Զ����� view
            if(!view) {
                view = document.createElement("DIV");
                view.className = cfg.viewCls;
                self.container.appendChild(view);
            }

            // init events
            Event.on(view, "mouseenter", function() {
                if(self.hideTimer) self.hideTimer.cancel();
            });
            Event.on(view, "mouseleave", function() {
                self.hideTimer = Lang.later(cfg.hideDelay * 1000, self, "hide");
            });

            // viewContent �Ƿ������ݵ��������޹رհ�ťʱ������ view ����
            self.viewContent = view;
            self.view = view;
        },

        /**
         * ��ʼ���رհ�ť
         * @protected
         */
        _initCloseBtn: function() {
            var self = this, el, view = self.view;

            view.innerHTML = CLOSEBTN_TMPL.replace("{hook_cls}", self.config.closeBtnCls);
            Event.on(view.firstChild, "click", function() {
                self.hide();
            });

            // ���� viewContent
            el = document.createElement("div");
            view.appendChild(el);
            self.viewContent = el;
        },

        /**
         * �л���ͼ�ڵ�����
         * @override
         */
        _switchView: function(oldContents, newContents, index) {
            var self = this;

            // ��ʾ view
            self.view.style.display = BLOCK;

            // ����������
            self.viewContent.innerHTML = newContents[0].innerHTML;

            // fire onSwitch
            self.fireEvent("onSwitch", index);
        },

        /**
         * ��������
         */
        hide: function() {
            var self = this;

            // hide current
            Dom.removeClass(self.triggers[self.activeIndex], self.config.activeTriggerCls);
            self.view.style.display = NONE;

            // update
            self.activeIndex = -1;
        }
    };

    S.MegaMenu = MegaMenu;
});

/**
 * TODO:
 *   - �� YAHOO ��ҳ��������ʾ���λ������Ӧ
 */