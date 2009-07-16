/**
 * Grids BigBang Script by lifesinger@gmail.com
 */

YUI().use("dd", function(Y) {
    // ���ñ���
    var page, content, pageWidth, ROW_TMPL, COL_SUB_TMPL, COL_EXTRA_TMPL,
        GRIDS_N = 24,
        UNIT_COL = 40,
        UNIT_GUTTER = 10,
        LAYOUT = "layout",
        GRID = "grid",
        DEFAULT_COL1 = LAYOUT + " " + GRID,
        DEFAULT_COL2 = LAYOUT + " " + GRID + "-m0s5",
        CLS_LAYOUT = "." + LAYOUT,
        HIDDEN = "hidden",
        FLOAT_RIGHT = "float-right",
        DD_PROXY = "dd-proxy",
        CLS_MAIN_WRAP = ".main-wrap",
        CLS_COL_SUB = ".col-sub",
        CLS_COL_EXTRA = ".col-extra",
        CLS_ADD_COL = ".add-col",
        CLS_DEL_COL = ".del-col",
        CLS_COL_STRIP = ".col-strip",
        CLS_COL_WIDTH = ".col-width",
        CLS_DD_HANDLE = ".dd-handle",
        CLS_TOOL_BOX = ".tool-box";

    var BigBang = {
        /**
         * ��ʼ��
         */
        init: function() {
            var self = this;
            page = Y.get("#page");
            content = Y.get("#content");

            // 1. �л�ҳ����
            pageWidth = Y.get("#page-width");
            pageWidth.on("change", function() {
                self.switchPageWidth(this.get("value"));
            });

            // 2. ����У�����У�ɾ���У�ɾ����
            ROW_TMPL  = Y.get("#row-tmpl").get("innerHTML");
            COL_SUB_TMPL = Y.get("#col-sub-tmpl").get("innerHTML");
            COL_EXTRA_TMPL = Y.get("#col-extra-tmpl").get("innerHTML");
            content.delegate("click", function(e) {
                var button = e.currentTarget;

                if(button.getAttribute("id") === "add-row") {
                    self.insertRow(Y.Node.getDOMNode(button.ancestor()));

                } else if(button.hasClass("del-row")) {
                    self.removeRow(button.ancestor(".layout"));

                } else if(button.hasClass("add-col")) {
                    self.insertCol(button);

                } else if(button.hasClass("del-col")) {
                    self.removeCol(button);
                }
            }, "span");

            // 3. onresize
            Y.on("resize", function() {
                if(pageWidth.get("value") === "auto") {
                    self._updateAllColMainWidth();
                }
            }, window);
        },

        /**
         * ��ʼ���Ϸ�
         */
        initDD: function(col) {
            
            var drag = new Y.DD.Drag({
                node: col.query(CLS_TOOL_BOX),
                handles: [CLS_DD_HANDLE]
            });

            var layout = col.ancestor(CLS_LAYOUT),
                layoutType,
                gridCls,
                newGridCls,
                mCol = layout.query(CLS_MAIN_WRAP),
                sCol = layout.query(CLS_COL_SUB),
                eCol,
                sN,
                eN,
                mHalf, // main-wrap Ԫ�صİ��
                sHalf, // col-sub Ԫ�صİ��
                eHalf, // col-extra Ԫ�صİ��
                pHalf, // proxy Ԫ�صİ��
                mX, // main-wrap �����ߵ� X ����ֵ
                sX, // col-sub �����ߵ� X ����ֵ
                eX, // col-extra �����ߵ� X ����ֵ
                pX, // proxy �����ߵ� X ����ֵ
                p,  // proxy node
                self = this;

            drag.on("drag:start", function() {
                p = this.get("dragNode");

                // ������ʽ
                p.addClass(DD_PROXY);

                // ��ȡ��ʼֵ
                // ע�������ɾ���к�������Щֵ������£���˷��� drag:start
                layoutType = self._getLayoutType(layout);
                gridCls = self._getGridCls(layout);
                eCol = layout.query(CLS_COL_EXTRA);
                sN = parseInt(gridCls.replace(/^.+s(\d).*$/, "$1"));
                eN = parseInt(gridCls.replace(/^.+e(\d).*$/, "$1"));
                sHalf = (sN * UNIT_COL - UNIT_GUTTER) / 2;
                eHalf = (eN * UNIT_COL - UNIT_GUTTER) / 2;
                mHalf = parseInt(mCol.getComputedStyle("width")) / 2;
                pHalf = parseInt(p.getComputedStyle("width")) / 2;
                mX = mCol.getX() + mHalf;
                sX = sCol.getX() + sHalf;
                if(eCol) eX = eCol.getX() + eHalf;
            });

            drag.on("drag:drag", function(e) {
                var args;

                // �õ���ǰ����
                pX = e.pageX + pHalf;

                if (layoutType === 2) { // ����
                    args = [[mX], [pX, sN], null];

                } else if(layoutType === 3) { // ����
                    if(col.hasClass(CLS_COL_SUB.slice(1))) { // �϶����� col-sub
                        args = [[mX], [pX, sN], [eX, eN]];

                    } else { // �϶����� col-extra
                        args = [[mX], [sX, sN], [pX, eN]];
                    }
                }

                //console.log(args);
                newGridCls = self._getGridClsByPosition(args[0], args[1], args[2]);
                //console.log("newGridCls = " + newGridCls);
                if (newGridCls && newGridCls != gridCls) {
                    layout.replaceClass(gridCls, newGridCls);

                    // ������Щֵ��Ҫ��̬���£�������������жϲ���
                    gridCls = newGridCls;
                    mX = mCol.getX() + mHalf;
                    sX = sCol.getX() + sHalf;
                    if(eCol) eX = eCol.getX() + eHalf;

                    // ����������־��λ��
                    self._updateResizeFlag(layoutType, gridCls, sCol, eCol);
                }
            });

            drag.on("drag:end", function() {
                // ��ԭ��ʽ
                p.removeClass(DD_PROXY);
                p.removeAttribute("style");
            });
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

            this._updateAllColMainWidth();
        },

        /**
         * ���� gridCls ֱ�Ӳ���һ��դ�񲼾�
         */
        insertLayout: function() {
            // TODO
        },

        /**
         * ������
         */
        insertRow: function(where) {
            var row = content.create(ROW_TMPL);
            content.insert(row, where);
            this._updateColMainWidth(row);
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
        insertCol: function(pos) {
            var layout = pos.ancestor(CLS_LAYOUT),
                layoutType = this._getLayoutType(layout),
                gridCls, newGridCls, col, needSyncUI = true;

            if (layoutType === 1) { // ͨ��
                layout.setAttribute("class", DEFAULT_COL2);

                col = layout.create(COL_SUB_TMPL);
                layout.append(col);
                this.initDD(col);

            } else if(layoutType === 2) { // ����
                gridCls = this._getGridCls(layout);
                newGridCls = gridCls.replace(/^(.+)m0(.*)$/, "$1m0e6$2");
                layout.replaceClass(gridCls, newGridCls);

                col = layout.create(COL_EXTRA_TMPL);
                layout.append(col);
                this.initDD(col);

            } else {
                needSyncUI = false;
            }

            if(needSyncUI) this._syncUI(layout);
        },

        /**
         * ɾ����
         */
        removeCol: function(pos) {
            var layout = pos.ancestor(CLS_LAYOUT),
                layoutType = this._getLayoutType(layout),
                gridCls, newGridCls, needSyncUI = true;

            if (layoutType === 2) { // ����
                layout.query(CLS_COL_SUB).remove();
                layout.setAttribute("class", DEFAULT_COL1);

            } else if(layoutType === 3) { // ����
                layout.query(CLS_COL_EXTRA).remove();

                gridCls = this._getGridCls(layout);
                newGridCls = gridCls.replace(/^(.+)e\d(.*)$/, "$1$2");
                layout.replaceClass(gridCls, newGridCls);

            } else {
                needSyncUI = false;
            }

            if(needSyncUI) this._syncUI(layout);
        },

        /**
         * ����������ť״̬�� UI ��Ϣ
         */
        _syncUI: function(layout) {
            // Ϊ�˼�����ϣ���������� gridCls ���� UI
            // �����ᵼ��ĳЩ����µ���ν���£���������˵���������ܼ��ٸ��Ӷȣ���ֵ�õ�
            var gridCls = this._getGridCls(layout),
                layoutType = this._getLayoutType(layout),
                sCol = layout.query(CLS_COL_SUB),
                eCol = layout.query(CLS_COL_EXTRA),
                sN = gridCls.replace(/^grid-.*s(\d).*$/, "$1") >> 0, eN = 0, mN = 0;

            if(layoutType === 3) eN = gridCls.replace(/^grid-.*e(\d).*$/, "$1") >> 0;
            mN = GRIDS_N - sN - eN;

            // ��������
            if(mN) { this._updateColMainWidth(layout); }
            if(sN) { this._updateColWidth(layout.query(CLS_COL_SUB), sN); }
            if(eN) { this._updateColWidth(layout.query(CLS_COL_EXTRA), eN); }

            // ����ʱ��1. ���ء�����С� 2. ���� col-sub �ġ�ɾ����
            if(layoutType === 3) {
                layout.query(CLS_ADD_COL).addClass(HIDDEN);
                sCol.query(CLS_DEL_COL).addClass(HIDDEN);
            } else
            // ����ʱ��1. ��ʾ������С� 2. ��ʾ col-sub �ġ�ɾ����
            if(layoutType === 2) {
                layout.query(CLS_ADD_COL).removeClass(HIDDEN);
                sCol.query(CLS_DEL_COL).removeClass(HIDDEN);
            }

            // ����������־��λ��
            this._updateResizeFlag(layoutType, gridCls, sCol, eCol);
        },

        /**
         * �����п�
         */
        _updateColWidth: function(col, val) {
            val = Y.Lang.isNumber(val) ? val * UNIT_COL - UNIT_GUTTER + "px" : val;
            col.query(CLS_COL_WIDTH).setContent(val);
        },

        /**
         * ���� col-main ���п�
         */
        _updateColMainWidth: function(layout) {
            var mainWrap = layout.query(CLS_MAIN_WRAP);
            this._updateColWidth(mainWrap, Y.DOM.getComputedStyle(Y.Node.getDOMNode(mainWrap), "width"));
        },

        /**
         * �������� col-main ���п�
         */
        _updateAllColMainWidth: function() {
            var self = this;
            Y.all(CLS_LAYOUT).each(function(layout) {
                self._updateColMainWidth(layout);
            });
        },

        /**
         * ���� resize ��־��
         */
        _updateResizeFlag: function(layoutType, gridCls, sCol, eCol) {
            if(layoutType > 1) {
                if(/^.+s\d.*m0.*$/.test(gridCls)) { // col-sub �� col-main ���
                    sCol.query(CLS_COL_STRIP).addClass(FLOAT_RIGHT);
                } else {
                    sCol.query(CLS_COL_STRIP).removeClass(FLOAT_RIGHT);
                }

                if (layoutType > 2) {
                    if (/^.+e\d.*m0.*$/.test(gridCls)) { // col-extra �� col-main ���
                        eCol.query(CLS_COL_STRIP).addClass(FLOAT_RIGHT);
                    } else {
                        eCol.query(CLS_COL_STRIP).removeClass(FLOAT_RIGHT);
                    }
                }
            }
        },

        /**
         * ��ȡ��������
         * @return 1 - ͨ��, 2 - ����, 3 - ����, 0 - �������
         */
        _getLayoutType: function(layout) {
            if(layout.hasClass(GRID)) return 1;

            var gridCls = this._getGridCls(layout);
            if(gridCls.indexOf("e") != -1) return 3;
            if(gridCls.indexOf("s" != -1)) return 2;

            return 0;
        },

        /**
         * ��ȡ layout �� grid ����
         */
        _getGridCls: function(layout) {
            return layout.getAttribute("class").replace(/^.*(grid-\S+).*$/, "$1");
        },

        /**
         * ���������ߵ�λ�õõ���Ӧ�� gridCls
         * @param m [mX]
         * @param s [sX, sN]
         * @param e [eX, eN]
         */
        _getGridClsByPosition: function(m, s, e) {
            if(m[0] == s[0]) return "";
            if(e && (m[0] == e[0] || s[0] == e[0])) return "";

            var cls = "grid-";
            if(!e) { // ����
                cls += m[0] < s[0] ? "m0" + "s" + s[1] : "s" + s[1] + "m0";

            } else { // ����
                if(     m[0] < s[0] && s[0] < e[0]) cls += "m0s" + s[1] + "e" + e[1];
                else if(m[0] < e[0] && e[0] < s[0]) cls += "m0e" + e[1] + "s" + s[1];
                else if(s[0] < m[0] && m[0] < e[0]) cls += "s" + s[1] + "m0e" + e[1];
                else if(s[0] < e[0] && e[0] < m[0]) cls += "s" + s[1] + "e" + e[1] + "m0";
                else if(e[0] < s[0] && s[0] < m[0]) cls += "e" + e[1] + "s" + s[1] + "m0";
                else if(e[0] < m[0] && m[0] < s[0]) cls += "e" + e[1] + "m0s" + s[1];

            }

            return cls;
        }
    };

    Y.on("domready", function() { BigBang.init(); });
});