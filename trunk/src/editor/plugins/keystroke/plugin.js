
KISSY.Editor.add("plugins~keystroke", function(E) {

    var Y = YAHOO.util, Event = Y.Event,
        UA = YAHOO.env.ua,
        TYPE = E.PLUGIN_TYPE;


    E.addPlugin("keystroke", {
        /**
         * ����
         */
        type: TYPE.FUNC,

        /**
         * ��ʼ��
         */
        init: function() {
            var editor = this.editor;

            // [bug fix] ie7- �£����� Tab ���󣬹�껹�ڱ༭������˸�����һس��ύ��Ч
            if (UA.ie && UA.ie < 8) {
                Event.on(editor.contentDoc, "keydown", function(ev) {
                    if(ev.keyCode == 9) {
                        this.selection.empty();
                    }
                });
            }

            // Ctrl + Enter �ύ
            var form = editor.textarea.form;
            if (form) {
                new YAHOO.util.KeyListener(
                        editor.contentDoc,
                        { ctrl: true, keys: 13 },
                        {
                            fn: function() {
                                    if (!editor.sourceMode) {
                                        editor.textarea.value = editor.getData();
                                    }
                                    form.submit();
                                }
                        }
                ).enable();
            }
        }

    });
 });
