
KISSY.Editor.add("core~command", function(E) {

    var ua = YAHOO.env.ua,

        CUSTOM_COMMANDS = {
            backColor: ua.gecko ? "hiliteColor" : "backColor"
        },
        BASIC_COMMANDS = "bold,italic,underline,strike,strikeThrough",
        STYLE_WITH_CSS = "styleWithCSS",
        EXEC_COMMAND = "execCommand";
    
    E.Command = {

        /**
         * ִ�� doc.execCommand
         */
        exec: function(doc, cmdName, val) {
            cmdName = CUSTOM_COMMANDS[cmdName] || cmdName;

            this._preExec(doc, cmdName);
            doc[EXEC_COMMAND](cmdName, false, val);
        },

        _preExec: function(doc, cmdName) {

            // �ر� gecko ������� styleWithCSS ���ԣ�ʹ�ò��������ݺ� ie һ��
            if (ua.gecko) {
                var val = BASIC_COMMANDS.indexOf(cmdName) == -1;
                doc[EXEC_COMMAND](STYLE_WITH_CSS, false, val);
            }
        }
    };

});
