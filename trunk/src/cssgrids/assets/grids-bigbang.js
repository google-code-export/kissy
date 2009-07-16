/**
 * Grids BigBang Script by lifesinger@gmail.com
 */

YUI().use("dd", function(Y) {

    // ��չ Y
    Y.getDOMNode = function(id) {
        return document.getElementById(id.replace(/^#?(.*)$/, "$1"));
    };

    // ���ñ���
    var page, content, ROW_TMPL;

    var BigBang = {
        /**
         * ��ʼ��
         */
        init: function() {
            var self = this;
            page = Y.get("#page");
            content = Y.get("#content");

            // �л�ҳ����
            Y.on("change", function() {
                self.switchPageWidth(this.get("value"));
            }, "#page-width");

            // ����У�����У�ɾ���У�ɾ����
            ROW_TMPL  = Y.getDOMNode("#row-tmpl").innerHTML;
            content.delegate("click", function(e) {
                var button = e.currentTarget;

                if(button.getAttribute("id") === "add-row") {
                    self.insertRow(Y.Node.getDOMNode(button.ancestor()));

                } else if(button.hasClass("del-row")) {
                    self.removeRow(button.ancestor(".layout"));

                } else if(button.hasClass("add-col")) {
                    self.addCol(button);

                } else if(button.hasClass("del-col")) {

                }
            }, "span");
        },

        /**
         * �л�ҳ����
         */
        switchPageWidth: function(type) {
            switch (type) {
                case "950":
                case "750":
                    page.setAttribute("class", "w" + type);
                    content.removeAttribute("class");
                    break;
                case "auto":
                    page.removeAttribute("class");
                    content.removeAttribute("class");
                    break;
                case "hamburger":
                    page.removeAttribute("class");
                    content.setAttribute("class", "w950");
                    break;
            }
        },

        /**
         * ������
         */
        insertRow: function(where) {
            content.insert(ROW_TMPL, where);
        },

        /**
         * ɾ����
         */
        removeRow: function(row) {
            row.remove();
        },

        /**
         * ������
         */
        addCol: function(position) {
            if(position.ancestor(".col-main")) {
                
            }
        }
    };

    Y.on("domready", function() { BigBang.init(); });
});