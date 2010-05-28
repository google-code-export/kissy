/**
 * DataGrid Render
 * @creator     ����<fool2fish@gmail.com>
 * @depends     kissy-core, yui2-yahoo-dom-event, yui2-connection
 */

KISSY.add("datagrid-render", function(S) {

    var DOM = S.DOM, Event = S.Event, YDOM = YAHOO.util.Dom,YConnect=YAHOO.util.Connect,
        doc = document,

        DataGrid = S.DataGrid,
        create = DataGrid.create,

        //�����е�����
        COL_CHECKBOX = 'COL_CHECKBOX', COL_RADIO = 'COL_RADIO', COL_EXTRA = 'COL_EXTRA',
        //����columnDefʱҪ�õ��������ڲ�����
        KS_DEPTH = 'KSDepth', KS_FATHER_IDX = 'KSFatherIdx', KS_CHILDREN_AMOUNT = 'KSChildrenAmount',

        //classǰ׺
        CLS_PREFIX = 'ks-datagrid-',
        //��class
        CLS_ROW = CLS_PREFIX + 'row', CLS_ROW_EXTRA = CLS_PREFIX + 'row-extra', CLS_ROW_SELECTED = CLS_PREFIX + 'row-selected', CLS_ROW_EXPANDED = CLS_PREFIX + 'row-expanded',

        //���ⵥԪ��class
        CLS_CELL_EXTRA = CLS_PREFIX + 'cell-extra',
        //����Ԫ��class
        CLS_SORTABLE = CLS_PREFIX + 'cell-sortable', CLS_SORT_DESC = CLS_PREFIX + 'cell-desc', CLS_SORT_ASC = CLS_PREFIX + 'cell-asc',
        //����icon��class
        CLS_ICON_EXPAND = CLS_PREFIX + 'icon-expand', CLS_ICON_CHECKBOX = CLS_PREFIX + 'icon-checkbox', CLS_ICON_RADIO = CLS_PREFIX + 'icon-radio',

        //��������������th�������ֶ�
        ATTR_ROW_IDX = 'data-list-idx',ATTR_SORT_FIELD = 'data-sort-field',

        //�Զ����¼�
        EVENT_RENDER_ROW = 'renderRow' , EVENT_RENDER_ROW_EXTRA = 'renderRowExtra', EVENT_GET_DATA = 'getData';

    S.augment(S.DataGrid, {

        /**
         * ��Ⱦ��������postData�����Ⱦ��ͷ�ȸ���Ԫ��
         * @param postData
         */
        render:function(postData) {
            var self = this ;
            self.datasourceDef = S.merge(DataGrid.datasourceDef, self.datasourceDef || {});
            //���ҳ����
            if (self.paginationDef) {
                self.paginationDef = S.merge(DataGrid.paginationDef, self.paginationDef);
                self._renderPagination();
            }
            self.update(postData);
        },

        /**
         * ���±�����ݣ�postData����������Ҫ�κβ���Ҳ��Ҫ���ݿ��ַ�����������²���ִ��
         * @param postData
         */
        update:function(postData) {
            var self = this ;

            function parseColumnDefCallback(theadColDef, colDef, colExtraDef, colSelectDef) {
                self._parseColumnDefPreProcessor(theadColDef, colDef, colExtraDef, colSelectDef);
                self._renderColgroup();
                self._renderThead();
                if (self._listData) self._renderTbody();
                self._endLoading();
                //��������
                if (self._sortTrigger.length > 0) self._activateRowSort();
                //������չ����
                if (colExtraDef) self._activateRowExpand();
                //ѡ���й���
                if (colSelectDef) self._activateRowSelect();
            }

            if (postData == undefined) {
                if (self.columnDef && !self._colDef) {
                    //������ж��嵫δ�������򵥴������ж���
                    parseColumnDefToFlat(self.columnDef, null, parseColumnDefCallback, self);
                }
                return;
            }
            self._startLoading();
            var paginationDef = this.paginationDef ;
            //��������˷�ҳ���壬��postData��δָ��dataLimit�������postData
            if (paginationDef && !DataGrid.getQueryParamValue(postData, paginationDef.dataLimit)) {
                postData = DataGrid.setQueryParamValue(postData, this.datasourceDef.dataLimit, paginationDef.dataLimit);
            }
            var callback = {
                success:function(o) {
                    var self = this ;
                    self._dataPreProcessor(o);
                    self.fire(EVENT_GET_DATA, {liveData:self._liveData});
                    //�������ɹ����ҷ���������ȷ
                    if (self._requestResult) {
                        var listData = self._listData;
                        //������ж����ҷ������б����ݣ�����ݷ��������Զ������ж���,���ֹ�����
                        if ((!self.columnDef) && listData && listData.length > 0) {
                            self.columnDef = [];
                            for (var i in listData[0]) {
                                self.columnDef.push({label:i,field:i});
                            }
                        }
                        //����ж���û��������
                        if (!self._colDef) {
                            //����columnDef���ɹ���ʼ��ʼ������
                            parseColumnDefToFlat(self.columnDef, null, parseColumnDefCallback, self);
                            //����ж��屻������
                        } else {
                            if (listData) self._renderTbody();
                            self._endLoading();
                        }
                        //�������һ�εĲ�ѯ����
                        self._latestQueryData = postData;
                        //����ҳ��
                        if (self.paginationDef) self._updatePagination();
                        //ȡ��ȫѡ
                        DOM.removeClass( self._theadEl.getElementsByTagName('tr')[0] , CLS_ROW_SELECTED )
                    } else {
                        self._endLoading();
                    }
                },
                failure:function() {
                    alert('error:��ȡ����ʧ�ܣ���ˢ��ҳ�����Ի���ϵ����Ա��');
                    this._endLoading();
                },
                scope:self
            };
            YConnect.asyncRequest(this.connectMethod, this._datasourceUri, callback, postData);
        },

        //ÿ���첽���󷵻�ֵ�Ļ�������
        _dataPreProcessor:function(o) {
            var self = this ;
            try {
                self._liveData = eval('(' + o.responseText + ')');
            } catch(e) {
                alert('error���뷵��JSON��ʽ�����ݡ�');
                self._endLoading();
                return;
            }
            var datasourceDef = self.datasourceDef ;
            self._requestResult = self._liveData[datasourceDef.success];
            if (self._requestResult) {
                self._listData = self._liveData[datasourceDef.listData];
            }
        },

        //ÿ�ν�����columnDef֮��Ļ�������
        _parseColumnDefPreProcessor:function(theadColDef, colDef, colExtraDef, colSelectDef) {
            var self = this ;
            self._theadColDef = theadColDef;
            self._colDef = colDef;
            self._colExtraDef = colExtraDef;
            self._colSelectDef = colSelectDef;
            self._columnAmount = colDef.length;
            if (colExtraDef) self._columnAmount++;
            if (colSelectDef) self._columnAmount++;
        },

        //��ʾloading״̬
        _startLoading:function() {
            var self = this , container = self.container, loadingEl = self._loadingEl;            
            loadingEl.style.left = YDOM.getX(container) +'px';
            loadingEl.style.top = YDOM.getY(container) +'px';
            loadingEl.style.width = container.offsetWidth +'px';
            loadingEl.style.height = container.offsetHeight+'px'; //����֣�ʹ��YDOM.getStyle�޷����ie����ȷ��ֵ
            loadingEl.style.display = '';
        },

        //����loading״̬
        _endLoading:function() {
           this._loadingEl.style.display = 'none';
        },

        //��Ⱦcolgroup�������ӵ����Ԫ����
        _renderColgroup:function() {
            var self = this ,
                colgroupEl = doc.createElement('colgroup');
            if (self._colExtraDef) {
                create('<col width="25" />', colgroupEl);
            }
            if (self._colSelectDef) {
                create('<col width="25" />', colgroupEl);
            }
            var colDef = self._colDef;
            for (var i = 0 , len = colDef.length; i < len; i++) {
                var col = create('<col />', colgroupEl);
                if (colDef[i].width) col.width = colDef[i].width;
            }
            if (self._colgroupEl) self.tableEl.removeChild(self._colgroupEl);
            self._colgroupEl = colgroupEl;
            self.tableEl.appendChild(self._colgroupEl);
        },

        //��Ⱦ��ͷ��ͨ��Ԫ��
        _renderTheadCell:function(cellDef) {
            var cell = create('<th></th>');
            //�������th
            if (cellDef[KS_CHILDREN_AMOUNT] == 0) {
                //������
                if (cellDef.xType) {
                    cell.className = CLS_CELL_EXTRA;
                    //ȫѡ
                    if (cellDef.xType == COL_CHECKBOX) {
                        cell.innerHTML = '<i class="' + CLS_ICON_CHECKBOX + '"></i>';
                    }

                    //����
                } else if (cellDef.sortable) {
                    cell.className = CLS_SORTABLE;
                    cell.setAttribute(ATTR_SORT_FIELD, cellDef.field);
                    cell.innerHTML = '<i class="'+CLS_PREFIX+'icon"></i>';
                    this._sortTrigger.push(cell);
                }
                if(cellDef.width) cell.width = cellDef.width;
                //�������th
            } else {
                cell.colSpan = cellDef[KS_CHILDREN_AMOUNT];
            }
            //���ֱ�ǩ
            if (cellDef.label) cell.innerHTML = cellDef.label + cell.innerHTML;
            return cell;
        },

        //��Ⱦ��ͷ��չ�е�Ԫ��
        _renderTheadCellExpand:function() {
            return create('<th class="'+CLS_CELL_EXTRA+'"></th>');
        },

        //��Ⱦ���ѡ���е�Ԫ��
        _renderTheadCellSelect:function(selectType) {
            var cell = create('<th class="'+CLS_CELL_EXTRA+'"></th>');
            if (selectType == COL_CHECKBOX) this._selectAllTrigger = create('<i class="'+CLS_ICON_CHECKBOX+'"></i>', cell);
            return cell;
        },

        //��Ⱦ��ͷ
        _renderThead:function() {
            var self = this,
                theadColDef = this._theadColDef,
                theadEl = doc.createElement('thead'),
                depth = theadColDef.length;
            for (var i = 0 , ilen = theadColDef.length; i < ilen; i++) {
                var row = create('<tr class="'+ CLS_ROW +'"></tr>');        
                //��չ��ť��
                if (i == 0) {
                    if (self._colExtraDef) {
                        var theadCellExpand = self._renderTheadCellExpand();
                        theadCellExpand.rowSpan = ilen;
                        row.appendChild(theadCellExpand);
                    }
                    if (self._colSelectDef) {
                        var theadCellSelect = self._renderTheadCellSelect(self._colSelectDef);
                        theadCellSelect.rowSpan = ilen;
                        row.appendChild(theadCellSelect);
                    }
                }
                //��ͨ��
                for (var j = 0 , jlen = theadColDef[i].length; j < jlen; j++) {
                    var cellDef = theadColDef[i][j];
                    if (cellDef[KS_DEPTH] != i) continue;
                    var cell = self._renderTheadCell(cellDef);
                    if (cellDef[KS_CHILDREN_AMOUNT] == 0 && depth - 1 > i) cell.rowSpan = depth - i;
                    row.appendChild(cell);
                }
                theadEl.appendChild(row);
            }
            if (self._theadEl) self.tableEl.removeChild(self._theadEl);
            self._theadEl = theadEl;
            self.tableEl.appendChild(self._theadEl);
        },

        //��Ⱦ��Ԫ��
        _renderCell:function(cellDef, recordData) {
            var cell = doc.createElement('td'),
                fieldArr = [], valueArr = [];
            if(cellDef.field) fieldArr = fieldArr.concat(cellDef.field);
            for(var i = 0,len=fieldArr.length;i<len;i++){
                valueArr.push(recordData[fieldArr[i]]);
            }
            appendChild(cell,cellDef.parser ? cellDef.parser.apply(window, valueArr) : valueArr.join(' '));
            return cell;
        },

        //��Ⱦչ����ť��Ԫ��
        _renderCellExpand:function() {
            return create('<td class="'+ CLS_CELL_EXTRA + '"><i class="' + CLS_ICON_EXPAND + '"></i></td>');
        },

        //��Ⱦѡ��Ԫ��
        _renderCellSelect:function(selectType) {
            if (selectType == COL_CHECKBOX) {
                var inner = '<i class="' + CLS_ICON_CHECKBOX + '"></i>';
            } else if (selectType == COL_RADIO) {
                var inner = '<i class="' + CLS_ICON_RADIO + '"></i>';
            }
            return create('<td class="' + CLS_CELL_EXTRA + '">'+ inner +'</td>');
        },

        //��Ⱦ��׼��
        _renderRow:function(recordData) {
            var self = this, colDef = self._colDef;
            var row = create('<tr class="'+ CLS_ROW +'"></tr>');
            //��չ��ť
            if (self._colExtraDef) row.appendChild(self._renderCellExpand());
            //��ѡ���ߵ�ѡ��ť
            if (self._colSelectDef) row.appendChild(self._renderCellSelect(self._colSelectDef));
            for (var i = 0 , len = colDef.length; i < len; i++) {
                row.appendChild(self._renderCell(colDef[i], recordData));
            }
            self.fire(EVENT_RENDER_ROW, { row : row , recordData : recordData });
            return row;
        },

        //��Ⱦ��չ�У���չ�е����ݷŵ�һ������չʾ��
        _renderRowExtra:function(recordData) {
            var self = this ;
            var row = create('<tr class="'+ CLS_ROW_EXTRA + '"></tr>'),
                colSpan = self._columnAmount;
            if (self._colExtraDef) {
                create('<td class="'+ CLS_CELL_EXTRA +'"></td>',row);
                colSpan--;
            }
            if (self._colSelectDef) {
                create('<td class="'+ CLS_CELL_EXTRA +'"></td>', row);
                colSpan--;
            }
            var cell = self._renderCell(self._colExtraDef, recordData);
            cell.colSpan = colSpan;
            row.appendChild(cell);
            self.fire(EVENT_RENDER_ROW_EXTRA, { row : row , recordData : recordData });
            return row;
        },

        //��Ⱦ�����
        _renderTbody:function() {
            var self = this;
            self._rowElArr = [];
            var listData = self._listData;
            var tbodyEl = doc.createElement('tbody');
            for (var i = 0 , len = listData.length; i < len; i++) {
                var row = self._renderRow(listData[i]);
                row.setAttribute(ATTR_ROW_IDX, i);
                self._rowElArr.push(row);
                tbodyEl.appendChild(row);
                if (self._colExtraDef && self._colExtraDef.expand) {
                    var rowExtra = self._renderRowExtra(listData[i]);
                    rowExtra.setAttribute(ATTR_ROW_IDX, i);
                    tbodyEl.appendChild(rowExtra);
                    DOM.addClass(row, CLS_ROW_EXPANDED);
                    DOM.addClass(rowExtra, CLS_ROW_EXPANDED);
                }
            }
            if (self._tbodyEl) self.tableEl.removeChild(self._tbodyEl);
            self._tbodyEl = tbodyEl;
            self.tableEl.appendChild(self._tbodyEl);
        }
    });

    /**
     * ��columnDef�����νṹչ���ɶ�ά����ṹ
     * @param columnDef �������趨
     * @param childrenKey ָ�����е�key
     * @param callback ������Ļص�����
     * @param callbackObj �ص������е�thisָ��Ķ���
     */
    function parseColumnDefToFlat(columnDef, childrenKey, callback, callbackObj) {
        childrenKey = childrenKey || 'children';
        //������ı�ͷ����
        var theadColDef = [],
            //��������ж���
                colDef = [],
            //�����ж���
                colExtraDef = null,
            //����ѡ���еķ�ʽ
                colSelectDef = null,
            //���������
                depth = 1;


        //�����ж����е��������趨��Ҫ���������趨ȫ��Ҫ����߲㼶����
        function filterColDef(columnDef) {
            var colDef = [];
            for (var i = 0 , len = columnDef.length; i < len; i++) {
                //�������չ��ť��
                if (columnDef[i].xType == COL_EXTRA) {
                    colExtraDef = columnDef[i];
                    //����Ǹ�ѡ����
                } else if (columnDef[i].xType == COL_CHECKBOX) {
                    colSelectDef = COL_CHECKBOX;
                    //����ǵ�ѡ����
                } else if (columnDef[i].xType == COL_RADIO) {
                    colSelectDef = COL_RADIO;
                } else {
                    colDef.push(columnDef[i]);
                }
            }
            return colDef;
        }

        //�õ����˵��������趨�����趨
        var pureColDef = filterColDef(columnDef);

        //�ж�tree�Ƿ�������
        function ifTreeHasChildren(tree) {
            for (var i = 0, len = tree.length; i < len; i++) {
                if (tree[i][childrenKey] && tree[i][childrenKey].length > 0) {
                    return true;
                }
            }
            return false;
        }

        //���µ�ǰ�ڵ����и��ڵ��childrenAmountֵ���ӽڵ�����
        function updateFathersChildrenAmount(subTree) {
            var step = subTree[childrenKey].length - 1;
            var curTree = subTree;
            var curDepth = subTree[KS_DEPTH];
            while (curDepth > 0) {
                var fatherTree = theadColDef[curDepth - 1][curTree[KS_FATHER_IDX]];
                fatherTree[KS_CHILDREN_AMOUNT] = fatherTree[KS_CHILDREN_AMOUNT] + step;
                curTree = fatherTree;
                curDepth = fatherTree[KS_DEPTH];
            }
        }

        //ת����
        function parse(tree) {
            //�ж��������
            var treeHasChildren = ifTreeHasChildren(tree);
            //��������
            var subTree = [];
            theadColDef[depth - 1] = [];
            for (var i = 0,ilen = tree.length; i < ilen; i++) {
                /* ���tree[i][KS_DEPTH]�����ڣ����¼tree[i]���������
                 * ����Ҫ���ж�����Ϊ����ڵ�ǰ�㼶��tree���ӽڵ�������
                 * tree[i]�պ�û���ӽڵ��ˣ���ô�����tree[i]����tree[i]��һ�㼶���ӽڵ�
                 * �����Ļ���ȷ���õ���theadDef�����һ��Ԫ�أ����飩ΪcolDef
                 */
                if (tree[i][KS_DEPTH] == undefined) tree[i][KS_DEPTH] = depth - 1;
                //jitree[i]��ӵ�theadColDef[depth-1]������ȥ
                theadColDef[depth - 1].push(tree[i]);
                //���tree��������tree[i]������
                if (treeHasChildren) {
                    if (tree[i][childrenKey]) {
                        //��¼tree[i]����Ԫ����
                        tree[i][KS_CHILDREN_AMOUNT] = tree[i][childrenKey].length;
                        for (var j = 0,jlen = tree[i][childrenKey].length; j < jlen; j++) {
                            //��tree[i]�ӽڵ��м�¼tree[i]���ڶ�ά�����������
                            tree[i][childrenKey][j][KS_FATHER_IDX] = i;
                            //������ͬһ�㼶��tree[i]�ӽڵ�ŵ�һ������
                            subTree.push(tree[i][childrenKey][j]);
                        }
                        updateFathersChildrenAmount(tree[i]);
                    } else {
                        tree[i][KS_CHILDREN_AMOUNT] = 0;
                        subTree.push(tree[i]);
                    }
                    //���������
                } else {
                    tree[i][KS_CHILDREN_AMOUNT] = 0;
                }
            }
            depth++;
            if (subTree.length > 0) {
                arguments.callee(subTree);
            } else {
                colDef = theadColDef[theadColDef.length - 1];
                if (callback) callback.call(callbackObj || window, theadColDef, colDef, colExtraDef, colSelectDef);
            }
        }

        parse(pureColDef);
    }

    /**
     * ��ָ����Ԫ����ӵ���Ԫ����ȥ
     */
    function appendChild(father, child) {
        if (father == undefined || child == undefined) return;
        if (typeof child == 'string') {
            father.innerHTML = father.innerHTML + child;
        } else {
            father.appendChild(child);
        }
    }

    ;
});