
KISSY.Editor.add("plugins~indent", function(E) {

    var TYPE = E.PLUGIN_TYPE;

    E.addPlugin(["indent", "outdent"], {
        /**
         * ���ࣺ��ͨ��ť
         */
        type: TYPE.TOOLBAR_BUTTON,

        /**
         * ��Ӧ����
         */
        exec: function() {
            this.editor.execCommand(this.name);
        }
    });

 });

// TODO:
//  Ŀǰ�� Google Docs���������⴦���ڲ�ͬ������±��ֲ�ͬ��
//  ����ʱ���ˣ����Կ��Ƿ��� CKEditor ��ʵ�ַ�ʽ��
