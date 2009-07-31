
KISSY.Editor.add("plugins~save", function(E) {

    var Y = YAHOO.util, Event = Y.Event,
        TYPE = E.PLUGIN_TYPE;


    E.addPlugin("save", {
        /**
         * ����
         */
        type: TYPE.CUSTOM,

        /**
         * ��ʼ��
         */
        init: function(editor) {
            var textarea = editor.textarea,
                form = textarea.form;

            if(form) {
                Event.on(form, "submit", function() {
                    textarea.value = editor.getData();
                });
            }
        },

        /**
         * ��������
         */
        filterData: function(data) {

            //if(ua.gecko) {
                //data = data
                        // �� gecko �ı�ǩ���廯
                        //.replace(/<b>/g, "<strong>").replace(/<\/b>/g, "</strong>")
                        //.replace(/<i>/g, "<em>").replace(/<\/i>/g, "</em>")
                  //      ;

            //} else if(ua.ie) {
                data = data
                        // �� ie �Ĵ�д��ǩ�� style ������ֵת��ΪСд
                        .replace(/<\/?[^>]+>/g, function(tag) {
                            return tag.toLowerCase();
                        })
                        // �ñ�ǩ��ʽ��
                        .replace(/<strong>/g, "<b>").replace(/<\/strong>/g, "</b>")
                        .replace(/<em>/g, "<i>").replace(/<\/em>/g, "</i>")
                        ;
            //}

            return data;

            // ע:
            //  1. ���༭������Ϊ��ʽ�༭����������༭����
            //  2. ʵ�����廯����Ҫ�� b, i, u, s ת��Ϊ strong, em, ins, del. ����ʵ��ʹ�ó����У�
            //     б�岻һ����ʾǿ�����»���Ҳ�����������룬��� goto 1.
            //  4. ȥ���� ua �жϣ�����Ϊ�п��ܴ������ط� copy ���������� word.
            //  5. �� data �ܴ�ʱ������� replace ���ܻ����������⡣
        }
    });
 });
