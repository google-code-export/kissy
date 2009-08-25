
KISSY.Editor.add("plugins~source", function(E) {

    var TYPE = E.PLUGIN_TYPE,
        iframe, iframeBd, textarea;

    E.addPlugin("source", {
        /**
         * ���ࣺ��ͨ��ť
         */
        type: TYPE.TOOLBAR_BUTTON,

        /**
         * ��ʼ������
         * @param  {KISSY.Editor} editor
         */
        init: function(editor) {
            iframe = editor.contentWin.frameElement;
            iframeBd = editor.contentDoc.body;
            textarea = editor.textarea;

            // �� textarea ���� iframe ����
            iframe.parentNode.appendChild(textarea);
        },

        /**
         * ��Ӧ����
         * @param {KISSY.Editor} editor
         */
        exec: function(editor) {
            var srcOn = editor.sourceMode;

            // ͬ������
            if(srcOn) {
                iframeBd.innerHTML = textarea.value;
            } else {
                textarea.value = editor.getContentDocData();
            }

            // ��ʾ/����
            textarea.style.display = srcOn ? "none" : "";
            iframe.style.display = srcOn ? "" : "none";

            editor.sourceMode = !srcOn;
        }
    });

 });

/**
 * TODO:
 *  1. ����༭��ʵ��ʱ���о��������⣬����Ҫ������ơ�
 */