
KISSY.Editor.add("plugins~save", function(E) {

    var Y = YAHOO.util, Event = Y.Event,
        TYPE = E.PLUGIN_TYPE,

        TAG_MAP = {
            b: { tag: "strong" },
            i: { tag: "em" },
            u: { tag: "span", style: "text-decoration:underline" },
            strike: { tag: "span", style: "text-decoration:line-through" }
        };


    E.addPlugin("save", {
        /**
         * ����
         */
        type: TYPE.FUNC,

        /**
         * ��ʼ��
         */
        init: function() {
            var editor = this.editor,
                textarea = editor.textarea,
                form = textarea.form;

            if(form) {
                Event.on(form, "submit", function() {
                    if(!editor.sourceMode) {
                        //var val = editor.getData();
                        // ͳһ��ʽ  �ɺ�̨����
//                        if(val && val.indexOf('<div class="ks-editor-post">') !== 0) {
//                            val = '<div class="ks-editor-post">' + val + '</div>';
//                        }
                        textarea.value = editor.getData();
                    }
                });
            }
        },

        /**
         * ��������
         */
        filterData: function(data) {

            data = data.replace(/<(\/?)([^>\s]+)([^>]*)>/g, function(m, slash, tag, attr) {

                // �� ie �Ĵ�д��ǩת��ΪСд
                tag = tag.toLowerCase();

                // �ñ�ǩ���廯
                var map = TAG_MAP[tag],
                    ret = tag;

                // ����� <tag> ���ֲ������Եı�ǩ����һ������
                if(map && !attr) {
                    ret = map["tag"];
                    if(!slash && map["style"]) {
                        ret += ' style="' + map["style"] + '"';
                    }
                }

                return "<" + slash + ret + attr + ">";
            });

            // ���� word ����������
            if(data.indexOf("mso") > 0) {
                data = this.filterWord(data);
            }

            return data;

            // ע:
            //  1. �� data �ܴ�ʱ������� replace ���ܻ����������⡣
            //    �����£��Ѿ������ replace �ϲ�����һ������������£��������������⣩
            //
            //  2. �������廯��google ��ʵ�ã���δ�ض�
            // TODO: ��һ���Ż������� <span style="..."><span style="..."> ����span���Ժϲ�Ϊһ��

            // FCKEditor ʵ���˲������廯
            // Google Docs ������ʵ������
            // KISSY Editor ��ԭ���ǣ��ڱ�֤ʵ�õĻ����ϣ��������廯
        },

        /**
         * ���� word ճ����������������
         * Ref: CKEditor - pastefromword plugin
         */
        filterWord: function(html) {

            // Remove onmouseover and onmouseout events (from MS Word comments effect)
            html = html.replace(/<(\w[^>]*) onmouseover="([^\"]*)"([^>]*)/gi, "<$1$3");
            html = html.replace(/<(\w[^>]*) onmouseout="([^\"]*)"([^>]*)/gi, "<$1$3");

            // The original <Hn> tag send from Word is something like this: <Hn style="margin-top:0px;margin-bottom:0px">
            html = html.replace(/<H(\d)([^>]*)>/gi, "<h$1>");

            // Word likes to insert extra <font> tags, when using MSIE. (Wierd).
            html = html.replace(/<(H\d)><FONT[^>]*>([\s\S]*?)<\/FONT><\/\1>/gi, "<$1>$2<\/$1>");
            html = html.replace(/<(H\d)><EM>([\s\S]*?)<\/EM><\/\1>/gi, "<$1>$2<\/$1>");

            // Remove <meta xx...>
            html = html.replace(/<meta[^>]*>/ig, "");

            // Remove <link rel="xx" href="file:///...">
            html = html.replace(/<link rel="\S+" href="file:[^>]*">/ig, "");

            // Remove <!--[if gte mso 9|10]>...<![endif]-->
            html = html.replace(/<!--\[if gte mso [0-9]{1,2}\]>[\s\S]*?<!\[endif\]-->/ig, "");

            // Remove <style> ...mso...</style>
            html = html.replace(/<style>[\s\S]*?mso[\s\S]*?<\/style>/ig, "");

            // Remove lang="..."
            html = html.replace(/ lang=".+?"/ig, "");

            // Remove <o:p></o:p>
            html = html.replace(/<o:p><\/o:p>/ig, "");

            // Remove class="MsoNormal"
            html = html.replace(/ class="Mso.+?"/ig, "");

            // Remove XML elements and declarations
            html = html.replace(/<\\?\?xml[^>]*>/ig, "") ;

            return html;
        }

    });
 });
