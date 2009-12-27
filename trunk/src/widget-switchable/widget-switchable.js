/**
 * Widget Switchable
 * @creator     ��<lifesinger@gmail.com>
 * @depends     kissy, yui-base, widget
 */
KISSY.add("widget-switchable", function(S) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = YAHOO.lang,
        UNDEFINED = "undefined",
        SWITCHABLE = "switchable",
        BEFORE_SWITCH = "beforeSwitch", ON_SWITCH = "onSwitch",
        CLS_PREFIX = "ks-switchable-",
        Switchable = { };

        Switchable.Config = {
            mackupType: 0, // mackup �����ͣ�ȡֵ���£�

            // 0 - Ĭ�Ͻṹ��ͨ�� nav �� content ����ȡ triggers �� panels
            navCls: CLS_PREFIX + "nav",
            contentCls: CLS_PREFIX + "content",

            // 1 - �ʶ���ͨ�� cls ����ȡ triggers �� panels
            triggerCls: CLS_PREFIX + "trigger",
            panelCls: CLS_PREFIX + "panel",

            // 2 - ��ȫ���ɣ�ֱ�Ӵ��� triggers �� panels
            triggers: [],
            panels: [],

            // �Ƿ�û�д���
            noTriggers: false,

            // ��������
            triggerType: "mouse", // or "click"
            // �����ӳ�
            delay: .1, // 100ms

            activeIndex: 0, // mackup ��Ĭ�ϼ����Ӧ����� index һ��
            activeTriggerCls: "active"
        };

    /**
     * Attaches switchable ablility to Widget.
     * required members��
     *   - this.container
     *   - this.config
     * attached members:
     *   - this.triggers  ֵΪ [] ʱ�������޴���
     *   - this.panels    �϶���ֵ���� length > 1
     *   - this.activeIndex
     *   - this.switchTimer
     */
    S.Widget.prototype.switchable = function(config) {
        var self = this; config = config || {};

        // ����������Ϣ���Զ�����Ĭ������
        if (config.panelCls) {
            Switchable.Config.mackupType = 1;
        } else if (config.panels) {
            Switchable.Config.mackupType = 2;
        }

        /**
         * ���ò���
         * @type object
         */
        self.config[SWITCHABLE] = S.merge(Switchable.Config, config || {});

        /**
         * triggers
         * @type Array of HTMLElement
         */
        self.triggers = self.triggers || [];

        /**
         * panels
         * @type Array of HTMLElement
         */
        self.panels = self.panels || [];

        /**
         * ��ǰ����� index
         * @type number
         */
        if (typeof self.activeIndex === UNDEFINED) {
            self.activeIndex = self.config[SWITCHABLE].activeIndex;
        }

        // attach and init
        S.mix(self, Switchable);
        self._initSwitchable();

        return self; // chain
    };

    S.mix(Switchable, {

        /**
         * init switchable
         */
        _initSwitchable: function() {
            var self = this;

            // parse mackup
            if(!self.panels.length) {
                self._parseSwitchableMackup();
            }

            // create custom events
            self.createEvent(BEFORE_SWITCH);
            self.createEvent(ON_SWITCH);

            // bind triggers
            if(self.triggers.length) {
                self._bindTriggers();
            }
        },

        /**
         * ���� mackup �� switchable ���֣���ȡ triggers, panels, nav, content
         */
        _parseSwitchableMackup: function() {
            var self = this, container = self.container, cfg = self.config[SWITCHABLE],
                nav, content, triggers = [], panels = [], i, len,
                getElementsByClassName = Dom.getElementsByClassName,
                hasTriggers = !cfg.noTriggers;

            switch (cfg.mackupType) {
                case 0: // Ĭ�Ͻṹ
                    nav = getElementsByClassName(cfg.navCls, "*", container)[0];
                    content = getElementsByClassName(cfg.contentCls, "*", container)[0];
                    if(nav) triggers = Dom.getChildren(nav);
                    panels = Dom.getChildren(content);
                    break;
                case 1: // �ʶ����
                    triggers = getElementsByClassName(cfg.triggerCls, "*", container);
                    panels = getElementsByClassName(cfg.panelCls, "*", container);
                    break;
                case 2: // ��ȫ����
                    triggers = cfg.triggers;
                    panels = cfg.panels;
                    break;
            }

            // �Զ����� triggers
            len = panels.length;
            if(hasTriggers && len > 0 && !triggers.length) {
                triggers = self._generateTriggersMackup(len);
            }

            // �� triggers �� panels ת��Ϊ��ͨ����
            for (i = 0; i < len; i++) {
                if(hasTriggers) self.triggers.push(triggers[i]);
                self.panels.push(panels[i]);
            }

            // ��ȡ nav, content
            if(hasTriggers) self.nav = nav || triggers[0].parentNode;
            self.content = content || panels[0].parentNode;
        },

        /**
         * �Զ����� triggers �� mackup
         * @protected
         */
        _generateTriggersMackup: function(len) {
            var self = this, cfg = self.config[SWITCHABLE],
                ul = document.createElement("UL"), li, i;

            ul.className = cfg.navCls;
            for (i = 0; i < len; i++) {
                li = document.createElement("LI");
                if (i === self.activeIndex) {
                    li.className = cfg.activeTriggerCls;
                }
                li.innerHTML = i + 1;
                ul.appendChild(li);
            }

            self.container.appendChild(ul);
            return Dom.getChildren(ul);
        },

        /**
         * �� triggers ����¼�
         */
        _bindTriggers: function() {
            var self = this, cfg = self.config[SWITCHABLE],
                triggers = self.triggers, trigger,
                i, len = triggers.length;

            for (i = 0; i < len; i++) {
                (function(index) {
                    trigger = triggers[index];

                    // ��Ӧ����� Tab ��
                    Event.on(trigger, "click", function() {
                        self._onFocusTrigger(index);
                    });
                    Event.on(trigger, "focus", function() {
                        self._onFocusTrigger(index);
                    });

                    // ��Ӧ�������
                    if (cfg.triggerType === "mouse") {
                        Event.on(trigger, "mouseenter", function() {
                            self._onMouseEnterTrigger(index);
                        });
                        Event.on(trigger, "mouseleave", function() {
                            self._onMouseLeaveTrigger(index);
                        });
                    }
                })(i);
            }
        },

        /**
         * click or tab ������ trigger ʱ�������¼�
         */
        _onFocusTrigger: function(index) {
            var self = this;
            if (self.activeIndex === index) return; // �ظ����
            if (self.switchTimer) self.switchTimer.cancel(); // ���磺�������������̵������ʱ�����¼�����ȡ����
            self.switchTo(index);
        },

        /**
         * ��������� trigger ��ʱ�������¼�
         */
        _onMouseEnterTrigger: function(index) {
            var self = this;
            //S.log("Triggerable._onMouseEnterTrigger: index = " + index);

            // ���ظ����������磺����ʾ����ʱ���������ٻ����ٻ����������ش���
            if (self.activeIndex !== index) {
                self.switchTimer = Lang.later(self.config[SWITCHABLE].delay * 1000, self, function() {
                    self.switchTo(index);
                });
            }
        },

        /**
         * ����Ƴ� trigger ʱ�������¼�
         */
        _onMouseLeaveTrigger: function() {
            var self = this;
            if (self.switchTimer) self.switchTimer.cancel();
        },

        /**
         * �л�����
         */
        switchTo: function(index) {
            var self = this, cfg = self.config[SWITCHABLE],
                triggers = self.triggers, panels = self.panels,
                activeIndex = self.activeIndex;
            //S.log("Triggerable.switchTo: index = " + index);

            // fire event
            if (!self.fireEvent(BEFORE_SWITCH, index)) return self;

            // switch active trigger
            if(!cfg.noTriggers) {
                self._switchTrigger(activeIndex > -1 ? triggers[activeIndex] : null, triggers[index]);
            }

            // switch active panel
            self._switchPanel(panels[activeIndex], panels[index], index);

            // update activeIndex
            self.activeIndex = index;

            return self; // chain
        },

        /**
         * �л���ǰ����
         */
        _switchTrigger: function(fromEl, toEl/*, index*/) {
            var activeTriggerCls = this.config[SWITCHABLE].activeTriggerCls;

            if (fromEl) Dom.removeClass(fromEl, activeTriggerCls);
            Dom.addClass(toEl, activeTriggerCls);
        },

        /**
         * �л���ǰ���
         */
        _switchPanel: function(fromEl, toEl, index) {
            // ��򵥵��л�Ч����ֱ������/��ʾ
            fromEl.style.display = "none";
            toEl.style.display = "block";

            // fire onSwitch
            this.fireEvent(ON_SWITCH, index);
        }
    });

    S.mix(Switchable, Y.EventProvider.prototype);
    S.Switchable = Switchable;
});
