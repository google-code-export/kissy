
KISSY.Editor.add("plugins~color", function(E) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event,
        UA = YAHOO.env.ua,
        isIE = UA.ie,
        TYPE = E.PLUGIN_TYPE,

        PALETTE_TABLE_TMPL = '<div class="ks-editor-palette-table"><table><tbody>{TR}</tbody></table></div>',
        PALETTE_CELL_TMPL = '<td class="ks-editor-palette-cell"><div class="ks-editor-palette-colorswatch" title="{COLOR}" style="background-color:{COLOR}"></div></td>',

        COLOR_GRAY = ["000", "444", "666", "999", "CCC", "EEE", "F3F3F3", "FFF"],
        COLOR_NORMAL = ["F00", "F90", "FF0", "0F0", "0FF", "00F", "90F", "F0F"],
        COLOR_DETAIL = [
                "F4CCCC", "FCE5CD", "FFF2CC", "D9EAD3", "D0E0E3", "CFE2F3", "D9D2E9", "EAD1DC",
                "EA9999", "F9CB9C", "FFE599", "B6D7A8", "A2C4C9", "9FC5E8", "B4A7D6", "D5A6BD",
                "E06666", "F6B26B", "FFD966", "93C47D", "76A5AF", "6FA8DC", "8E7CC3", "C27BAD",
                "CC0000", "E69138", "F1C232", "6AA84F", "45818E", "3D85C6", "674EA7", "A64D79",
                "990000", "B45F06", "BF9000", "38761D", "134F5C", "0B5394", "351C75", "741B47",
                "660000", "783F04", "7F6000", "274E13", "0C343D", "073763", "20124D", "4C1130"
        ],

        PALETTE_CELL_CLS = "ks-editor-palette-colorswatch",
        PALETTE_CELL_SELECTED = "ks-editor-palette-cell-selected";

    E.addPlugin(["foreColor", "backColor"], {
        /**
         * ���ࣺ�˵���ť
         */
        type: TYPE.TOOLBAR_MENU_BUTTON,

        /**
         * ��ǰѡȡɫ
         */
        color: "",

        /**
         * ��ǰ��ɫָʾ��
         */
        _indicator: null,

        /**
         * ȡɫ��
         */
        swatches: null,

        /**
         * �����������˵���
         */
        dropMenu: null,

        range: null,

        /**
         * ��ʼ��
         */
        init: function() {
            var el = this.domEl,
                caption = el.getElementsByTagName("span")[0].parentNode;

            this.color = this._getDefaultColor();

            Dom.addClass(el, "ks-editor-toolbar-color-button");
            caption.innerHTML = '<div class="ks-editor-toolbar-color-button-indicator" style="border-bottom-color:' + this.color + '">'
                               + caption.innerHTML
                               + '</div>';

            this._indicator = caption.firstChild;

            this._renderUI();
            this._bindUI();

            this.swatches = Dom.getElementsByClassName(PALETTE_CELL_CLS, "div", this.dropMenu);
        },

        _renderUI: function() {
            // �����ַ�����
            //  1. ���� MS Office 2007, �������������ͷʱ���ŵ��������򡣵�� caption ʱ��ֱ��������ɫ��
            //  2. ���� Google Docs, ������ caption �� dropdown����ÿ�ε��������������
            // ���߼��Ͻ�������1�������ǣ����� web ҳ���ϣ���ť�Ƚ�С������2�������������������ԡ�
            // ������÷���2

            this.dropMenu = E.Menu.generateDropMenu(this.editor, this.domEl, [1, 0]);

            // �����������ڵ�����
            this._generatePalettes();

            // ��� ie�����ò���ѡ��
            if (isIE) E.Dom.setItemUnselectable(this.dropMenu);
        },

        _bindUI: function() {
            // ע��ѡȡ�¼�
            this._bindPickEvent();

            Event.on(this.domEl, "click", function() {
                // ���� range, �Ա㻹ԭ
                this.range = self.editor.getSelectionRange();

                // �ۼ�����ť�ϣ����ع�꣬���� ie �¹�����ʾ�ڲ�����
                // ע��ͨ�� blur / focus �ȷ�ʽ�� ie7- ����Ч
                isIE && this.editor.contentDoc.selection.empty();

                // ����ѡ��ɫ
                this._updateSelectedColor(this.color);
            }, this, true);
        },

        /**
         * ����ȡɫ��
         */
        _generatePalettes: function() {
            var htmlCode = "";

            // �ڰ�ɫ��
            htmlCode += this._getPaletteTable(COLOR_GRAY);

            // ����ɫ��
            htmlCode += this._getPaletteTable(COLOR_NORMAL);

            // ��ϸɫ��
            htmlCode += this._getPaletteTable(COLOR_DETAIL);

            // ��ӵ� DOM ��
            this.dropMenu.innerHTML = htmlCode;
        },

        _getPaletteTable: function(colors) {
            var i, len = colors.length, color,
                trs = "<tr>";

            for(i = 0, len = colors.length; i < len; ++i) {
                if(i != 0 && i % 8 == 0) {
                    trs += "</tr><tr>";
                }

                color = E.Color.toRGB("#" + colors[i]).toUpperCase();
                //console.log("color = " + color);
                trs += PALETTE_CELL_TMPL.replace(/{COLOR}/g, color);
            }
            trs += "</tr>";

            return PALETTE_TABLE_TMPL.replace("{TR}", trs);
        },

        /**
         * ��ȡɫ�¼�
         */
        _bindPickEvent: function() {
            var self = this;

            Event.on(this.dropMenu, "click", function(ev) {
                var target = Event.getTarget(ev),
                    attr = target.getAttribute("title");

                if(attr && attr.indexOf("RGB") === 0) {
                    self._doAction(attr);
                }
            });
        },

        /**
         * ִ�в���
         */
        _doAction: function(val) {
            if (!val) return;

            // ���µ�ǰֵ
            this.setColor(E.Color.toHex(val));

            // ��ԭѡ��
            var range = this.range;
            if (isIE && range.select) range.select();

            // ִ������
            this.editor.execCommand(this.name, this.color);
        },
        
        /**
         * ������ɫ
         * @param {string} val ��ʽ #RRGGBB or #RGB
         */
        setColor: function(val) {
            this.color = val;

            this._updateIndicatorColor(val);
            this._updateSelectedColor(val);
        },

        /**
         * ����ָʾ������ɫ
         * @param val HEX ��ʽ
         */
        _updateIndicatorColor: function(val) {
            // ���� indicator
            this._indicator.style.borderBottomColor = val;
        },

        /**
         * ���������˵���ѡ�е���ɫ
         * @param {string} val ��ʽ #RRGGBB or #RGB
         */
        _updateSelectedColor: function(val) {
            var i, len, swatch, swatches = this.swatches;

            for(i = 0, len = swatches.length; i < len; ++i) {
                swatch = swatches[i];

                // ��ȡ�� backgroundColor �ڲ�ͬ������£���ʽ�в��죬��Ҫͳһת�����ٱȽ�
                if(E.Color.toHex(swatch.style.backgroundColor) == val) {
                    Dom.addClass(swatch.parentNode, PALETTE_CELL_SELECTED);
                } else {
                    Dom.removeClass(swatch.parentNode, PALETTE_CELL_SELECTED);
                }
            }
        },

        /**
         * ���°�ť״̬
         */
        updateState: function() {
            var doc = this.editor.contentDoc,
                name = this.name, t, val;

            if(name == "backColor" && UA.gecko) name = "hiliteColor";

            try {
                if (doc.queryCommandEnabled(name)) {
                    t = doc.queryCommandValue(name);

                    isIE && (t = E.Color.int2hex(t));
                    if (t === "transparent") t = ""; // ����ɫΪ͸��ɫʱ��ȡĬ��ɫ
                    if(t === "rgba(0, 0, 0, 0)") t = ""; // webkit �ı���ɫ�� rgba ��
                    //console.log(t);
                    
                    val = t ? E.Color.toHex(t) : this._getDefaultColor(); // t Ϊ���ַ���ʱ����ʾ����ڿ��л���δ������ʽ�ĵط�
                    if (val && val != this.color) {
                        this.color = val;
                        this._updateIndicatorColor(val);
                    }
                }
            } catch(ex) {
            }
        },

        _getDefaultColor: function() {
            return (this.name == "foreColor") ? "#000000" : "#ffffff";
        }
    });

});

// TODO
//  1. �� google, �Լ����¼���֧��
