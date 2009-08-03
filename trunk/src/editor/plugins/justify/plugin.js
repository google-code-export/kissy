
KISSY.Editor.add("plugins~justify", function(E) {

    var TYPE = E.PLUGIN_TYPE,
        isIE = YAHOO.env.ua.ie;

    E.addPlugin(["justifyLeft", "justifyCenter", "justifyRight"], {
        /**
         * ���ࣺ��ͨ��ť
         */
        type: TYPE.TOOLBAR_BUTTON,

        /**
         * ��Ӧ����
         * @param {KISSY.Editor} editor
         */
        fn: function(editor) {
            if(isIE) {
                this._ieFn(editor);
            } else {
                editor.execCommand(this.name);
            }
        },

        /**
         * ie ����Ӧ����
         */
        _ieFn: function(editor) {
            var range = editor.getSelectionRange(),
                parentEl = range.parentElement();

            alert(parentEl);
        }
    });

 });
