/**
 * Grids BigBang Script by lifesinger@gmail.com
 */

if(typeof KISSY === "undefined" || !KISSY) {
    KISSY = {};
}

YUI({
    /*base: "http://t-yubo/assets/yui/3.0.0/build/",*/
    debug: false,
    /*filter: 'debug',*/
    modules: {
        "yui2-utilities": {
            fullpath: "http://yui.yahooapis.com/2.7.0/build/utilities/utilities.js"
        },
        "resize": {
            fullpath: "http://yui.yahooapis.com/2.7.0/build/resize/resize-min.js",
            requires: ["yui2-utilities"]
        }
    }
}).use("dd", "resize", function(Y) {
    // ���ñ����ͳ���
    var NS = KISSY,
        page, content, pageWidth, ROW_TMPL, COL_SUB_TMPL, COL_EXTRA_TMPL,
        GRIDS_N = 24,
        UNIT_COL = 40,
        UNIT_GUTTER = 10,
        COL_MIN_N = 4,
        COL_MIN_WIDTH = UNIT_COL * COL_MIN_N - UNIT_GUTTER,
        COL_SUB_DEFAULT_N = 5, // col-sub ��Ĭ�Ͽ��
        COL_EXTRA_DEFAULT_N = 6, // col-extra ��Ĭ�Ͽ��
        LAYOUT = "layout",
        GRID = "grid",
        DEFAULT_COL1 = LAYOUT + " " + GRID + "-m",
        DEFAULT_COL2 = LAYOUT + " " + GRID + "-m0s" + COL_SUB_DEFAULT_N,
        RE_SCOL_N = /^.+s(\d+).*$/,
        RE_ECOL_N = /^.+e(\d+).*$/,
        HIDDEN = "hidden",
        FLOAT_RIGHT = "float-right",
        DD_PROXY = "dd-proxy",
        CLS_LAYOUT = "." + LAYOUT,
        CLS_ONE_COL = "." + GRID + "-m",
        CLS_MAIN_WRAP = ".main-wrap",
        CLS_COL_SUB = ".col-sub",
        CLS_COL_EXTRA = ".col-extra",
        CLS_ADD_COL = ".add-col",
        CLS_DEL_COL = ".del-col",
        CLS_COL_WIDTH = ".col-width",
        CLS_DD_HANDLE = ".dd-handle",
        CLS_TOOL_BOX = ".tool-box";

    NS.BigBang = {
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

            // 3. window onresize
            Y.on("resize", function() {
                if(pageWidth.get("value") === "auto") {
                    self._updateAllColMainWidth();
                }
            }, window);

            // 4. ���� HTML ����
            Y.on("click", function() {
                self.generateHTMLCode();
            }, "#build-code");

            // 5. ���ɷ�������
            Y.on("click", function() {
                self.generateShareLink();
            }, "#share-link");
        },

        /**
         * ��ʼ�� col
         */
        initCol: function(col) {
            this._initDD(col);
            this._initResize(col);
        },

        /**
         * ��ʼ���Ϸ�
         */
        _initDD: function(col) {
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
                col.setStyle("zIndex", "99");

                // ��ȡ��ʼֵ
                // ע�������ɾ���к�������Щֵ������£���˷��� drag:start
                layoutType = self._getLayoutType(layout);
                gridCls = self._getGridCls(layout);
                eCol = layout.query(CLS_COL_EXTRA);
                sN = parseInt(gridCls.replace(RE_SCOL_N, "$1"));
                eN = parseInt(gridCls.replace(RE_ECOL_N, "$1"));
                sHalf = self._getWidthByN(sN) / 2;
                eHalf = self._getWidthByN(eN) / 2;
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
                col.setStyle("zIndex", "");
            });
        },

        /**
         * ��ʼ�� Resize
         */
        _initResize: function(col) {
            var resize = new YAHOO.util.Resize(Y.Node.getDOMNode(col),
                    {
                        handles: ["r", "l"],
                        proxy: true,
                        setSize: false
                    });

            var layout = col.ancestor(CLS_LAYOUT),
                layoutWidth,
                gridCls,
                newGridCls,
                proxy = Y.get(resize.getProxyEl()),
                activeHandle,
                handleAtLeft = true,
                sWidth,
                eWidth,
                activeColCls = col.hasClass(CLS_COL_SUB.slice(1)) ? CLS_COL_SUB : CLS_COL_EXTRA,
                colLeft,
                colWidth,
                activeN,
                self = this;

            resize.on('startResize', function() {
                activeHandle = Y.get(this.getActiveHandleEl());
                handleAtLeft = activeHandle.hasClass('yui-resize-handle-l');

                // ������Щֵ����resizeע����п������϶����ı�
                gridCls = self._getGridCls(layout);
                sWidth = self._getWidthByN(parseInt(gridCls.replace(RE_SCOL_N, "$1")));
                eWidth = self._getWidthByN(parseInt(gridCls.replace(RE_ECOL_N, "$1")));

                // ������Щֵ���ڴ���������л�ҳ���ȵ������£��п��ܻ�ı䣬��˷��� resize start �л�ȡ
                layoutWidth = parseInt(layout.getComputedStyle("width"));
                colLeft = col.getX();
                colWidth = parseInt(col.getComputedStyle("width")); // �����Ѿ� resize ��
            });

            resize.on('proxyResize', function(e) {
                if(handleAtLeft) {
                    proxy.setStyles({
                        left: (colLeft - (e.width - colWidth)) + "px"
                    });
                }

                // ��̬��ʾ���
                self._updateColWidth(col, self._getGridWidth(e.width) + "px");
            });

            resize.on('endResize', function(e) {
                // ��������ʱ���õ���ʽ
                col.removeAttribute("style");

                // ��ȡ��ǰ������ col ���
                if(activeColCls === CLS_COL_SUB) {
                    sWidth = self._getWidthByN(self._getNByWidth(e.width));
                } else {
                    eWidth = self._getWidthByN(self._getNByWidth(e.width));
                }

                // ������ȷ���դ��
                activeN = self._calcActiveColWidth(layoutWidth, activeColCls, sWidth, eWidth);
                //console.log("activeN = " + activeN);

                // ��ȡ�µ� gridCls
                newGridCls = self._adjustGridClsByWidth(gridCls, activeColCls, activeN);
                //console.log("newGridCls = " + newGridCls);

                if (newGridCls && newGridCls != gridCls) {
                    layout.replaceClass(gridCls, newGridCls);
                    gridCls = newGridCls;

                    // �����п�
                    self._updateColMainWidth(layout);
                }
                
                // �п������쵽С����С��ȣ���ʱû������ gridCls �仯����������Ҫ�����п�
                self._updateColWidth(col, self._getWidthByN(activeN) + "px");
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
         * ������
         */
        insertRow: function(where) {
            var row = content.create(ROW_TMPL);
            content.insert(row, where);
            this._updateColMainWidth(row);
            return row;
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
                this.initCol(col);

            } else if(layoutType === 2) { // ����
                gridCls = this._getGridCls(layout);
                newGridCls = gridCls.replace(/^(.+)m0(.*)$/, "$1m0e" + COL_EXTRA_DEFAULT_N + "$2");
                layout.replaceClass(gridCls, newGridCls);

                col = layout.create(COL_EXTRA_TMPL);
                layout.append(col);
                this.initCol(col);

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
                newGridCls = gridCls.replace(/^(.+)e\d+(.*)$/, "$1$2");
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
                sN = gridCls.replace(RE_SCOL_N, "$1") >> 0, eN = 0, mN = 0;

            if(layoutType === 3) eN = gridCls.replace(RE_ECOL_N, "$1") >> 0;
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
            val = Y.Lang.isNumber(val) ? this._getWidthByN(val) + "px" : val;
            col.query(CLS_COL_WIDTH).setContent(val);
        },

        /**
         * ���� col-main ���п�
         */
        _updateColMainWidth: function(layout) {
            var mainWrap = layout.query(CLS_MAIN_WRAP),
                mainWidth = parseInt(mainWrap.getComputedStyle("width"));
            this._updateColWidth(mainWrap, mainWidth + "px");

            this._updateAddColButton(layout, mainWidth);
        },

        /**
         * ���¡�����С���ť����ʾ״̬
         */
        _updateAddColButton: function(layout, mainWidth) {
            // �����С��һ��ֵʱ���Ѿ�������� col-extra �ˣ���Ҫ������Ӱ�ť
            if(mainWidth < this._getWidthByN(COL_MIN_N + COL_EXTRA_DEFAULT_N)) {
                layout.query(CLS_ADD_COL).addClass(HIDDEN);

            } else if(!layout.query(CLS_COL_EXTRA)) { // ��������
                layout.query(CLS_ADD_COL).removeClass(HIDDEN);
            }
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
                if(/^.+s\d+.*m0.*$/.test(gridCls)) { // col-sub �� col-main ���
                    sCol.addClass(FLOAT_RIGHT); // for YUI 2 Resize
                } else {
                    sCol.removeClass(FLOAT_RIGHT); // for YUI 2 Resize
                }

                if (layoutType > 2) {
                    if (/^.+e\d+.*m0.*$/.test(gridCls)) { // col-extra �� col-main ���
                        //eCol.query(CLS_COL_STRIP).addClass(FLOAT_RIGHT);
                        eCol.addClass(FLOAT_RIGHT); // for YUI 2 Resize
                    } else {
                        //eCol.query(CLS_COL_STRIP).removeClass(FLOAT_RIGHT);
                        eCol.removeClass(FLOAT_RIGHT); // for YUI 2 Resize
                    }
                }
            }
        },

        /**
         * ��ȡ��������
         * @return {number} layoutType 1 - ͨ��, 2 - ����, 3 - ����, 0 - �������
         */
        _getLayoutType: function(layout) {
            if(layout.hasClass(CLS_ONE_COL.slice(1))) return 1;

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
        },

        /**
         * �������� resize �� col �Ŀ��Ϊ����ֵ
         * @return {number} activeN
         */
        _calcActiveColWidth: function(layoutWidth, activeColCls, sWidth, eWidth) {
            eWidth = eWidth >> 0;
            var sN = this._getNByWidth(sWidth),
                eN = this._getNByWidth(eWidth),
                activeN, mWidth;

            // ����С����С���
            if(sN < COL_MIN_N) {
                sN = COL_MIN_N;
                sWidth = COL_MIN_WIDTH;
            }
            if(eN < COL_MIN_N) {
                eN = COL_MIN_N;
                eWidth = COL_MIN_WIDTH;
            }

            // Ҳ����̫��ʹ�� main-wrap �Ŀ��С����С���
            activeN = (activeColCls === CLS_COL_SUB) ? sN : eN;
            mWidth = layoutWidth - sWidth - eWidth;
            while (mWidth < COL_MIN_WIDTH) {
                activeN--;
                mWidth += UNIT_COL;
            }
            return activeN;
        },

        /**
         * ���ݿ��ֵ���� gridCls
         */
        _adjustGridClsByWidth: function(gridCls, activeColCls, activeN) {
            var colFlag = activeColCls === CLS_COL_SUB ? "s" : "e",
                re = new RegExp("^(.+" + colFlag + ")(\\d+)(.*)$");

            return gridCls.replace(re, function(s, m1, m2, m3) {
                return m1 + activeN + m3;
            });
        },

        _getWidthByN: function(n) {
            return n * UNIT_COL - UNIT_GUTTER;
        },

        _getNByWidth: function(width) {
            width = width >> 0;
            return Math.floor((width + UNIT_GUTTER) / UNIT_COL);
        },

        _getGridWidth: function(width) {
            return this._getWidthByN(this._getNByWidth(width));
        },

        /**
         * ���� gridCls ֱ�Ӳ���һ��դ�񲼾�
         * @param {string|Array} gridFlags ���磺"m0s5" �� ["s5m0e6", "m0s6", "m"]
         */
        insertLayout: function(gridFlags) {
            if(Y.Lang.isString(gridFlags)) gridFlags = [gridFlags];
            var self = this, row,
                defaultCls = CLS_ONE_COL.slice(1),
                newCls,
                insertPos = Y.Node.getDOMNode(Y.get("#add-row").get("parentNode"));

            Y.each(gridFlags, function(flag) {
                if(!self.checkGridFlagIsValid(flag)) return;
                newCls = GRID + "-" + flag;

                row = self.insertRow(insertPos);
                if(newCls != defaultCls) {
                    row.replaceClass(defaultCls, newCls);
                }

                if(flag.indexOf("s") != -1) { // col-sub
                    row.append(COL_SUB_TMPL);
                    self.initCol(row.query(CLS_COL_SUB));
                }
                if(flag.indexOf("e") != -1) { // col-extra
                    row.append(COL_EXTRA_TMPL);
                    self.initCol(row.query(CLS_COL_EXTRA));
                }

                // ���� UI ��Ϣ
                self._syncUI(row);
            });
        },

        /**
         * ��� flag �Ƿ����դ����
         */
        checkGridFlagIsValid: function(flag) {
            if(!flag) return false;

            // 1. ͨ��
            if(flag === "m") return true;

            // 2. ����
            if(/^m0s\d{1,2}|s\d{1,2}m0$/.test(flag)) return true;

            // 3. ����
            var m = flag.match(/[m|s|e]\d{1,2}/g);

            // ��ƥ�����ƥ������Ϊ3
            if(!m || m.length != 3) return false;

            // ���з� [m|s|e]\d{1,2} �ַ�
            if(flag != m.join("")) return false;

            // ���� mm, ss, ee
            if(m[0].charAt(0) == m[1].charAt(0)) return false;
            if(m[0].charAt(0) == m[2].charAt(0)) return false;
            return m[1].charAt(0) != m[2].charAt(0);
        },

        /**
         * �� location.hash ������Ĭ�ϲ���
         * @param {string} hash ��ʽΪ s5m0e6-m0s6-m
         */
        parseHash: function(hash) {
            if(hash) {
                this.insertLayout(hash.split("-"));
            }
        },

        /**
         * ���� HTML ����
         */
        generateHTMLCode: function() {
            // TODO
            alert("Ī��Ī������δʵ�֡�");
        },

        /**
         * ���ɷ�������
         */
        generateShareLink: function() {
            var hash = [], cls;

            Y.each(content.queryAll(CLS_LAYOUT), function(layout) {
                cls = layout.getAttribute("class");
                hash.push(cls.replace(/^.*grid-(.+).*$/i, "$1"));
            });

            location.replace("#" + hash.join("-"));
        }
    };

    Y.on("domready", function() {
        NS.BigBang.init();

        // ���� loading
        Y.get("#page-loading").addClass("hidden");

        // �� hash ���ȡ��������
        if(location.hash) {
            NS.BigBang.parseHash(location.hash.slice(1));

        } else {
            // ���Ĭ�ϲ���
            NS.BigBang.insertLayout(["s5m0e6", "m0s6", "m"]);
        }

        // ��ʾ������ť
        Y.get("#page-width").removeClass("hidden");
        Y.get("#add-row").removeClass("hidden");
        Y.get("#bottom-operations").removeClass("hidden");
    });
});
