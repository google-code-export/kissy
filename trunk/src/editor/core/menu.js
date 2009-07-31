
KISSY.Editor.add("core~menu", function(E) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event,

        VISIBILITY = "visibility",
        DROP_MENU_CLASS = "kissy-drop-menu";
    
    E.Menu = {

        /**
         * ����������
         * @param {KISSY.Editor} editor dropMenu �����ı༭��ʵ��
         * @param {HTMLElement} trigger
         * @param {Array} offset dropMenu λ�õ�ƫ����
         * @return {HTMLElement} dropMenu
         */
        generateDropMenu: function(editor, trigger, offset) {
            var dropMenu = document.createElement("div"),
                 self = this;

            // ���� DOM
            dropMenu.className = DROP_MENU_CLASS;
            dropMenu.style[VISIBILITY] = "hidden";
            document.body.appendChild(dropMenu);

            // �������ʱ����ʾ������
            // ע��һ���༭��ʵ�������ֻ����һ�������������
            Event.on(trigger, "click", function(ev) {
                // �����ϴ������Լ�����
                // ���� document �ϼ�ص���󣬻�رոմ򿪵� dropMenu
                Event.stopPropagation(ev);

                // ���ص�ǰ�����������
                self._hide(editor.activeDropMenu);

                // �򿪵�ǰ trigger �� dropMenu
                if(editor.activeDropMenu != dropMenu) {
                    self._setDropMenuPosition(trigger, dropMenu, offset); // �ӳٵ���ʾʱ����λ��
                    self._show(dropMenu);
                    editor.activeDropMenu = dropMenu;

                } else { // �ڶ��ε���� trigger �ϣ��ر� activeDropMenu, ����Ϊ null. ����ᵼ�µ����ε���򲻿�
                    editor.activeDropMenu = null;                   
                }
            });

            // document ���񵽵��ʱ���رյ�ǰ�����������
            Event.on([document, editor.contentDoc], "click", function() {
                self._hide(editor.activeDropMenu);
                editor.activeDropMenu = null;
            });

            // �ı䴰�ڴ�Сʱ����̬����λ��
            this._initResizeEvent(trigger, dropMenu, offset);

            // ����
            return dropMenu;
        },

        /**
         * ���� dropMenu ��λ��
         */
        _setDropMenuPosition: function(trigger, dropMenu, offset) {
            var r = Dom.getRegion(trigger),
                left = r.left, top = r.bottom;

            if(offset) {
                left += offset[0];
                top += offset[1];
            }

            dropMenu.style.left = left + "px";
            dropMenu.style.top = top + "px";
        },

        _isVisible: function(el) {
            if(!el) return false;
            return el.style[VISIBILITY] != "hidden";
        },

        _hide: function(el) {
            if(el) {
                el.style[VISIBILITY] = "hidden";
            }
        },

        _show: function(el) {
            if(el) {
                el.style[VISIBILITY] = "visible";
            }
        },

        /**
         * window.onresize ʱ�����µ��� dropMenu ��λ��
         */
        _initResizeEvent: function(trigger, dropMenu, offset) {
            var self = this, resizeTimer;

            Event.on(window, "resize", function() {
                if (resizeTimer) {
                    clearTimeout(resizeTimer);
                }

                resizeTimer = setTimeout(function() {
                    if(self._isVisible(dropMenu)) { // ������ʾʱ����Ҫ��̬����
                        self._setDropMenuPosition(trigger, dropMenu, offset);
                    }
                }, 50);
            });
        }
    };

});
