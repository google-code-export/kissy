
KISSY.Editor.add("plugins~wordcount", function(E) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event,
        TYPE = E.PLUGIN_TYPE,
        ALARM_CLS = "ks-editor-wordcount-alarm";

    E.addPlugin("wordcount", {

        /**
         * ���ࣺ״̬�����
         */
        type: TYPE.STATUSBAR_ITEM,

        total: Infinity,

        remain: Infinity,

        threshold: 0,

        remainEl: null,

        /**
         * ��ʼ��
         */
        init: function() {
            this.total = this.lang["total"];
            this.threshold = this.lang["threshold"];

            this.renderUI();
            this.bindUI();

            // ȷ���������������ݼ�����ɺ�
            var self = this;
            setTimeout(function() {
                self.syncUI();
            }, 500);
        },

        renderUI: function() {
            this.domEl.innerHTML = this.lang["tmpl"]
                    .replace("%remain%", "<em>" + this.total + "</em>");

            this.remainEl = this.domEl.getElementsByTagName("em")[0];
        },

        bindUI: function() {
            var editor = this.editor;

            Event.on(editor.textarea, "keyup", this.syncUI, this, true);

            Event.on(editor.contentDoc, "keyup", this.syncUI, this, true);
            // TODO: ��������/�����������
            Event.on(editor.container, "click", this.syncUI, this, true);
        },

        syncUI: function() {
            this.remain = this.total - this.editor.getData().length;
            this.remainEl.innerHTML = this.remain;

            if(this.remain <= this.threshold) {
                Dom.addClass(this.domEl, ALARM_CLS);
            } else {
                Dom.removeClass(this.domEl, ALARM_CLS);
            }
        }
    });

 });

/**
 * TODO:
 *   - ���� GBK �����£�һ�������ַ�����Ϊ 2
 */