
KISSY.Editor.add("core~command", function(E) {

    var ua = YAHOO.env.ua,

        CUSTOM_COMMANDS = {
            backColor: ua.gecko ? "hiliteColor" : "backColor"
        },
        TAG_COMMANDS = "bold,italic,underline,strikeThrough",
        STYLE_WITH_CSS = "styleWithCSS",
        EXEC_COMMAND = "execCommand";
    
    E.Command = {

        /**
         * ִ�� doc.execCommand
         */
        exec: function(doc, cmdName, val, styleWithCSS) {
            cmdName = CUSTOM_COMMANDS[cmdName] || cmdName;

            this._preExec(doc, cmdName, styleWithCSS);
            doc[EXEC_COMMAND](cmdName, false, val);
        },

        _preExec: function(doc, cmdName, styleWithCSS) {

            // �ر� gecko ������� styleWithCSS ���ԣ�ʹ�ò��������ݺ� ie һ��
            if (ua.gecko) {
                var val = typeof styleWithCSS === "undefined" ? (TAG_COMMANDS.indexOf(cmdName) === -1) : styleWithCSS;
                doc[EXEC_COMMAND](STYLE_WITH_CSS, false, val);
            }
        }
    };

});
