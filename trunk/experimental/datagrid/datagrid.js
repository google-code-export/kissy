/**
 * DataGrid
 * @creator     ����<fool2fish@gmail.com>
 * @depends     kissy-core, yui2-yahoo-dom-event, yui2-connection
 */

/**
 * DataGrid���ܵ㣺
 * 1������Դ
 * 2�������ͷ��������ͷ(���)
 * 3  �����С�������(���)
 * 4���û��Զ�����ʾ��(���)
 * 5����ɾ��
 * 6��������������
 * 7��������������(���)
 * 8����ѡ����ѡ��ȫѡ����ѡ����(���)
 * 9���������˷�ҳ(���)
 * 10��������������(���)
 * 11����Ŀչ������ɣ�
 * 12������ĳ�д��루��ɣ�
 */

/**
 * 2010.04.12 ��review����
 * 1�����Ĭ�����ã����������µĴ������(���)
 * 2��ʹ��var self=this����ߴ���ѹ���ʣ���ɣ�
 * 3��ʹ�þֲ�������ߴ���Ч�ʣ���ɣ�
 * 4������ļ���init&config,render,bind,util��
 */

/**
 * ����
 * 1������Դ���棨�κ�д����ʱ�Զ���ջ��棩
 * 2��Ŀǰ����Դ����datagrid�£������Ժ�datasource�����ļ�����
 * 3������Զ����¼�(���)
 * 4��תyui������kissy��kissy���з�����ɣ�
 */

KISSY.add("datagrid", function(S) {
    
    var DOM = S.DOM, Event = S.Event, YDOM = YAHOO.util.Dom, YEvent= YAHOO.util.Event, YConnect=YAHOO.util.Connect,
        doc=document,
        //���������е�����
        COL_CHECKBOX = 'COL_CHECKBOX', COL_RADIO = 'COL_RADIO', COL_EXTRA = 'COL_EXTRA',
        //�������columnDefʱҪ�õ��������ڲ�����
        KS_DEPTH = 'KSDepth', KS_FATHER_IDX='KSFatherIdx', KS_CHILDREN_AMOUNT='KSChildrenAmount',
        //����ʽ
        POST = 'post',GET = 'get',
        //��class
        CLS_ROW = 'row', CLS_ROW_EXTRA = 'row-extra', CLS_ROW_SELECTED = 'row-selected', CLS_ROW_EXPANDED = 'row-expanded',
        //��������������th�������ֶ�
        ATTR_ROW_IDX = 'data-idx',ATTR_SORT_FIELD='data-sort-field',
        //��Ԫ��class
        CLS_CELL_CHECKBOX = 'cell-checkbox', CLS_CELL_RADIO = 'cell-radio', CLS_CELL_EXTRA = 'cell-extra',
        //����class
        CLS_SORTABLE = 'sortable', CLS_SORT_DES = 'sort-des', CLS_SORT_ASC = 'sort-asc',
        //����ʽ
        DES = 'desc', ASC = 'asc',
        //����icon��class
        CLS_ICON_EXPAND = 'icon-expand', CLS_ICON_CHECKBOX = 'icon-checkbox', CLS_ICON_RADIO = 'icon-radio',
        //�Զ����¼�
        EVENT_RENDER_ROW = 'renderRow' , EVENT_RENDER_ROW_EXTRA = 'renderRowExtra', EVENT_GET_DATA = 'getData',
        ROW_CLICK_SELECT_EXTRA_TAG = ' a img input button select option textarea label ';
        ;

    /**
     * DataGrid
     * @constructor
     * @param container ���ñ�������
     * @param datasource ����Դ��uri
     */
    function DataGrid(container,datasource){
        var self = this ;
        //��������
        self.container = S.get(container);
        DOM.addClass( self.container , 'ks-datagrid' );
        //���ɱ��Ԫ��
        self.tableEl = createEl( 'table' , 'datagrid-table' , null , self.container );
        //����loadingԪ��
        var loadingTrEl = createEl( 'tr' , 'row row-loading' , createEl( 'td' ) );
        self._loadingEl = createEl( 'tbody' , null , loadingTrEl );
        //��¼����Դuri(Ŀǰ����Դ���ܼ�����datagrid������У���ֻ����json��ʽ�ķ�������)
        self._datasourceUri = datasource ;
    }

    S.mix(DataGrid.prototype,{

        /**************************************************************************************************************
         * @����Դ
         * ע��Ŀǰ����Դ������datagrid��Ժ��Ƕ���
         *************************************************************************************************************/

        /**
         * ����datasource��ָ��datasource����ֶε���;
         * Ĭ��ֵ�� DataGrid.datasourceDef
         */
        datasourceDef:null,
        /**
         * �������ݵķ�ʽ
         */
        connectMethod:POST,        
        //��¼���һ�β�ѯ�������͵�����
        _latestQueryData:'',
        //JSON��ʽ������Դ
        _liveData:null,
        //����Դ�е��б�����
        _listData:null,
        _dataCache:{},
        
        /**************************************************************************************************************
         * @�����
         *************************************************************************************************************/
        
        /**
         * �����У�������Ⱦ���粻���壬���Զ����ݷ�������������
         * ����
         * columnDef=[
         *      {label:'',xType:COL_EXPAND},
         *      {label:'',xType:COL_CHECKBOX},
         *      {label:'���ֿ�������',children:[
         *          {label:'��������',sortable:true,field:'index'},
         *          {label:'������',sortable:true,field:'age'}
         *      ]},
         *      {label:'�ֶ���Ⱦ',children:[
         *          {label:'��һ�ֶ�',field:'name'},
         *          {label:'�����ֶ�',field:['nickname','homepage'],parser:funtion('nickname','homepage'){...}}
         *      ]},
         *      {label:'',xType:COL_EXTRA,field:[...],parser:function(){...}}
         * ]
         */
        columnDef:null,
        //������
        _columnAmount:null,
        //����columnDef��õ��ı�ͷ�ж���
        _theadColDef:null,
        //����columnDef��õ��ı�����ͨ�ж���
        _colDef:null,
        //����columnDef��õ��ı�����չ�ж���
        _colExtraDef:null,
        //����columnDef��õ���ѡ���ж���
        _colSelectDef:null,

        /**************************************************************************************************************
         * @���Ԫ��
         *************************************************************************************************************/

        //colgroupԪ��
        _colgroupEl:null,
        //��ͷ
        _theadEl:null,
        //���������thԪ��
        _sortTrigger:[],
        //��ǰ�����th
        _curSortTrigger:null,
        //����ȫѡ��Ԫ��
        _selectAllTrigger:null,
        //��ʾloading��tbody
        _loadingEl:null,
        //װ�����ݵ�tbody
        _tbodyEl:null,
        //��׼���������
        _rowElArr:null,

        /**************************************************************************************************************
         * @������Ⱦ
         *************************************************************************************************************/

        /**
         * ��Ⱦ��������postData�����Ⱦ��ͷ�ȸ���Ԫ��
         * @param postData
         */
        render:function(postData){
            var self = this ;
            self.datasourceDef = self.datasourceDef || {};
            self.datasourceDef = S.merge( DataGrid.datasourceDef , self.datasourceDef );
            //���ҳ����
            if(self.paginationDef){
                self.paginationDef = S.merge( DataGrid.paginationDef , self.paginationDef );
                self._renderPagination();
            }
            self.update(postData);
        },

        /**
         * ���±�����ݣ�postData����������Ҫ�κβ���Ҳ��Ҫ���ݿ��ַ�����������²���ִ��
         * @param postData
         */
        update:function(postData){
            var self = this ;
            function parseColumnDefCallback(theadColDef, colDef, colExtraDef, colSelectDef){
                self._parseColumnDefPreProcessor(theadColDef, colDef, colExtraDef, colSelectDef);
                self._renderColgroup();
                self._renderThead();
                if(self._listData) self._renderTbody();
                self._endLoading();
                //��������
                if(self._sortTrigger.length>0) self._activateRowSort();
                //������չ����
                if(colExtraDef) self._activateRowExpand();
                //ѡ���й���
                if(colSelectDef) self._activateRowSelect();
            }
            if( postData == undefined ){
                if( self.columnDef && !self._colDef){
                    //������ж��嵫δ�������򵥴������ж���
                    parseColumnDefToFlat( self.columnDef,null,parseColumnDefCallback,self);
                }
                return;
            }
            self._startLoading();
            var paginationDef = this.paginationDef ;
            //��������˷�ҳ���壬��postData��δָ��dataLimit�������postData
            if(paginationDef && !getQueryParamValue( postData ,paginationDef.dataLimit )){
                postData = setQueryParamValue(postData, this.datasourceDef.dataLimit, paginationDef.dataLimit);
            }
            var callback={
                success:function(o){
                    var self = this ;
                    self._dataPreProcessor(o);
                    self.fire( EVENT_GET_DATA,{liveData:self._liveData} );
                    //�������ɹ����ҷ���������ȷ
                    if(self._requestResult){
                        var listData = self._listData;
                        //������ж����ҷ������б����ݣ�����ݷ��������Զ������ж���,���ֹ�����
                        if( (!self.columnDef) && listData && listData.length > 0 ){
                            self.columnDef = [];
                            for( var i in listData[0]){
                                 self.columnDef.push({label:i,field:i});
                            }
                        }
                        //����ж���û��������
                        if(!self._colDef){
                            //����columnDef���ɹ���ʼ��ʼ������
                            parseColumnDefToFlat( self.columnDef,null,parseColumnDefCallback,self);
                        //����ж��屻������
                        }else{
                            if(listData) self._renderTbody();
                            self._endLoading();
                        }
                        //�������һ�εĲ�ѯ����
                        self._latestQueryData = postData;
                        //����ҳ��
                        if( self.paginationDef ) self._updatePagination();
                    }else{
                        self._endLoading();
                    }
                },
                failure:function(){
                    alert('error:��ȡ����ʧ�ܣ���ˢ��ҳ�����Ի���ϵ����Ա��');
                    this._endLoading();
                },
                scope:self
            };
            YConnect.asyncRequest(this.connectMethod, this._datasourceUri, callback, postData);
        },

        //ÿ���첽���󷵻�ֵ�Ļ�������
        _dataPreProcessor:function(o){
            var self = this ;
            try{
                self._liveData = eval('('+o.responseText+')');
            }catch(e){
                alert('error���뷵��JSON��ʽ�����ݡ�');
                self._endLoading();
                return;
            }
            var datasourceDef = self.datasourceDef ;
            self._requestResult = self._liveData[datasourceDef.success];
            if(self._requestResult){
                self._listData = self._liveData[datasourceDef.listData];
            }
        },

        //ÿ�ν�����columnDef֮��Ļ�������
        _parseColumnDefPreProcessor:function(theadColDef, colDef, colExtraDef, colSelectDef){
            var self = this ;
            self._theadColDef =theadColDef;
            self._colDef = colDef;
            self._colExtraDef = colExtraDef;
            self._colSelectDef = colSelectDef;
            self._columnAmount = colDef.length ;
            if( colExtraDef ) self._columnAmount++;
            if( colSelectDef ) self._columnAmount++;
        },

        //��ʾloading״̬
        _startLoading:function(){
            var self = this ;
            if( self._columnAmount ){
                var loadingTd = self._loadingEl.getElementsByTagName( 'td' )[0];
                loadingTd.colSpan = self._columnAmount;
            }
            //notice��û�а�loadingEl�ӵ�tableEl�У�����diaplay:none�ķ�ʽ���л�loading�����ʾ������Ϊie��ʹ��jsȥdisplay:none loadingEl���е����⣺�߶��޷��������±߿���һֱ�ɼ�
            if(YDOM.getFirstChild( self.tableEl )){
                var firstChild = YDOM.getFirstChild( self.tableEl );
                YDOM.insertBefore( self._loadingEl , firstChild );
            }else{
                self.tableEl.appendChild( self._loadingEl );
            }
        },

        //����loading״̬
        _endLoading:function(){
            var self = this ;
            if(YDOM.isAncestor( self.tableEl , self._loadingEl )) self.tableEl.removeChild( self._loadingEl );
        },

        //��Ⱦcolgroup�������ӵ����Ԫ����
        _renderColgroup:function(){
            var self = this ,
                colgroupEl = doc.createElement('colgroup');
            if( self._colExtraDef ){
                var col =  createEl( 'col' , null , null , colgroupEl );
                    col.width = '25';
            }
            if( self._colSelectDef ){
                var col =  createEl( 'col' , null , null , colgroupEl );
                    col.width = '25';
            }
            var colDef = self._colDef;
            for( var i = 0 , len = colDef.length ; i < len ; i++ ){
                var col =  createEl( 'col' , null , null , colgroupEl );
                if( colDef[i].width ) col.width = colDef[i].width;
            }
            if( self._colgroupEl ) self.tableEl.removeChild( self._colgroupEl );
            self._colgroupEl = colgroupEl;
            self.tableEl.appendChild( self._colgroupEl );
        },

        //��Ⱦ��ͷ��ͨ��Ԫ��
        _renderTheadCell:function( cellDef ){
            var cell = createEl('th');
            //�������th
            if( cellDef[KS_CHILDREN_AMOUNT] == 0 ){
                //������
                if( cellDef.xType ){
                    cell.className = CLS_CELL_EXTRA;
                    //ȫѡ
                    if( cellDef.xType == COL_CHECKBOX ){
                        cell.innerHTML = '<i class="' + CLS_ICON_CHECKBOX + '"></i>';
                    }

                //����
                }else if( cellDef.sortable ){
                    cell.className = CLS_SORTABLE;
                    cell.setAttribute( ATTR_SORT_FIELD , cellDef.field );
                    cell.innerHTML = '<i class="icon"></i>';
                    this._sortTrigger.push( cell );
                }
            //�������th
            }else{
                cell.colSpan = cellDef[KS_CHILDREN_AMOUNT];
            }
            //���ֱ�ǩ
            if( cellDef.label ) cell.innerHTML = cellDef.label + cell.innerHTML;
            return cell;
        },

        //��Ⱦ��ͷ��չ�е�Ԫ��
        _renderTheadCellExpand:function(){
            return createEl( 'th' , CLS_CELL_EXTRA );
        },

        //��Ⱦ���ѡ���е�Ԫ��
        _renderTheadCellSelect:function( selectType ){
            var cell = createEl( 'th' , CLS_CELL_EXTRA );
            if( selectType == COL_CHECKBOX ) this._selectAllTrigger = createEl( 'i' , CLS_ICON_CHECKBOX , null , cell );
            return cell;
        },

        //��Ⱦ��ͷ
        _renderThead:function(){
            var self = this,
                theadColDef=this._theadColDef,
                theadEl = doc.createElement('thead'),
                depth = theadColDef.length;
            for(var i = 0 , ilen = theadColDef.length ; i < ilen ; i++){
                var row = createEl( 'tr' , 'row' );
                //��չ��ť��
                if( i == 0){
                    if(self._colExtraDef){
                        var theadCellExpand = self._renderTheadCellExpand();
                            theadCellExpand.rowSpan = ilen;
                        row.appendChild(theadCellExpand);
                    }
                    if(self._colSelectDef){
                        var theadCellSelect = self._renderTheadCellSelect(self._colSelectDef);
                             theadCellSelect.rowSpan = ilen;
                        row.appendChild(theadCellSelect);
                    }
                }
                //��ͨ��
                for(var j = 0 , jlen = theadColDef[i].length ; j < jlen ; j++){
                    var cellDef = theadColDef[i][j];
                    if(cellDef[KS_DEPTH] != i) continue;
                    var cell = self._renderTheadCell(cellDef);
                    if( cellDef[KS_CHILDREN_AMOUNT] == 0 && depth-1 > i) cell.rowSpan = depth - i;
                    row.appendChild(cell);
                }
                theadEl.appendChild(row);
            }
            if(self._theadEl) self.tableEl.removeChild(self._theadEl);
            self._theadEl = theadEl;
            self.tableEl.appendChild(self._theadEl);
        },

        //��Ⱦ��Ԫ��
        _renderCell:function( cellDef , recordData ){
            var cell = doc.createElement('td');
            //���ָ�����ֶ�
            if(cellDef.field != undefined ){
                //����ǵ��ֶ�
                if(typeof cellDef.field == 'string'){
                    var fieldValue = recordData[cellDef.field];
                    //�������Ⱦ��
                    if(cellDef.parser){
                        appendChild( cell , cellDef.parser(fieldValue));
                    //�������Ⱦ��
                    }else{
                        cell.innerHTML = fieldValue;
                    }
                //����Ǹ����ֶ�
                }else if(S.isArray(cellDef.field)){
                    var fieldValueArr=[];
                    for(var i = 0 , len = cellDef.field.length ; i<len ; i++){
                        fieldValueArr.push(recordData[cellDef.field[i]]);
                    }
                    //�������Ⱦ��
                    if(cellDef.parser){
                        appendChild( cell , cellDef.parser.apply(window,fieldValueArr) );
                    //�������Ⱦ��
                    }else{
                        cell.innerHTML = fieldValueArr.join(' ');
                    }
                }
            //���ûָ���ֶ�
            }else{
                //�������Ⱦ��
                if(cellDef.parser){
                    appendChild( cell , cellDef.parser());
                //�������Ⱦ��
                }else{
                    cell.innerHTML = '';
                }
            }
            return cell;
        },
        
        //��Ⱦչ����ť��Ԫ��
        _renderCellExpand:function(){
            return createEl( 'td' , CLS_CELL_EXTRA ,  '<i class="' + CLS_ICON_EXPAND + '"></i>' );
        },
        
        //��Ⱦѡ��Ԫ��
        _renderCellSelect:function(selectType){
            if(selectType == COL_CHECKBOX){
                 var inner = '<i class="' + CLS_ICON_CHECKBOX + '"></i>';
            }else if(selectType == COL_RADIO){
                 var inner = '<i class="' + CLS_ICON_RADIO + '"></i>';
            }
            return createEl( 'td', CLS_CELL_EXTRA , inner );
        },
        
        //��Ⱦ��׼��
        _renderRow:function(recordData){
            var self = this, colDef = self._colDef;
            var row = createEl( 'tr' , CLS_ROW );
            //��չ��ť
            if(self._colExtraDef) row.appendChild(self._renderCellExpand());
            //��ѡ���ߵ�ѡ��ť
            if(self._colSelectDef) row.appendChild(self._renderCellSelect(self._colSelectDef));
            for(var i = 0 , len = colDef.length ; i < len ; i++){
                row.appendChild(self._renderCell(colDef[i],recordData));
            }
            self.fire( EVENT_RENDER_ROW , { row : row , recordData : recordData });
            return row;
        },

        //��Ⱦ��չ�У���չ�е����ݷŵ�һ������չʾ��
        _renderRowExtra:function(recordData){
            var self = this ;
            var row = createEl( 'tr' , CLS_ROW_EXTRA ),
                colSpan = self._columnAmount;
            if(self._colExtraDef){
                createEl( 'td' , CLS_CELL_EXTRA , null , row );
                colSpan--;
            }
            if(self._colSelectDef){
                createEl( 'td' , CLS_CELL_EXTRA , null , row );
                colSpan--;
            }
            var cell = self._renderCell(self._colExtraDef,recordData);
                cell.colSpan = colSpan;
            row.appendChild(cell);
            self.fire( EVENT_RENDER_ROW_EXTRA , { row : row , recordData : recordData });
            return row;
        },

        //��Ⱦ�����
        _renderTbody:function(){
            var self = this;
            self._rowElArr = [];
            var listData = self._listData;
            var tbodyEl = doc.createElement('tbody');
            for(var i = 0 , len = listData.length ; i < len ; i++){
                var row = self._renderRow(listData[i]);
                    row.setAttribute(ATTR_ROW_IDX,i);
                self._rowElArr.push(row);
                tbodyEl.appendChild(row);
                if( self._colExtraDef && self._colExtraDef.expand ){
                    var rowExtra = self._renderRowExtra(listData[i]);
                        rowExtra.setAttribute(ATTR_ROW_IDX,i);
                    tbodyEl.appendChild(rowExtra);
                    DOM.addClass( row , CLS_ROW_EXPANDED );
                    DOM.addClass( rowExtra , CLS_ROW_EXPANDED );
                }
            }
            if(self._tbodyEl) self.tableEl.removeChild(self._tbodyEl);
            self._tbodyEl = tbodyEl;
            self.tableEl.appendChild(self._tbodyEl);
        },

        //����������
        _activateRowSort:function(){
            var self = this , sortTrigger  = self._sortTrigger;
            Event.on(sortTrigger, 'click', function(e){
                if( !self._listData || self._listData.length == 0 ) return;
                var t = this;
                var sortBy = t.getAttribute( ATTR_SORT_FIELD );;
                var sortType;
                //����������� �� ���õ�ǰ���򴥵����ʽ
                if( DOM.hasClass( t , CLS_SORT_ASC ) ){
                    sortType = DES;
                    DOM.removeClass( t, CLS_SORT_ASC);
                    DOM.addClass( t, CLS_SORT_DES);
                //���Ŀǰ�ǽ������л���Ŀǰ��������
                }else{
                    sortType = ASC;
                    DOM.addClass( t, CLS_SORT_ASC);
                    DOM.removeClass( t, CLS_SORT_DES);
                }
                //�޸�ǰһ�����򴥵����ʽ
                if( self._curSortTrigger && self._curSortTrigger != t ){
                    DOM.removeClass( self._curSortTrigger, CLS_SORT_DES);
                    DOM.removeClass( self._curSortTrigger, CLS_SORT_ASC);
                }
                self._curSortTrigger = t;
                var queryData = setQueryParamValue( self._latestQueryData,self.datasourceDef.sortBy, sortBy);
                queryData = setQueryParamValue( queryData,self.datasourceDef.sortType, sortType);
                self.update(queryData);
            });
        },

        //������ѡ����
        _activateRowSelect:function(){
            var self = this , selectType = self._colSelectDef;
            function selectJudgement(t){
                return  ( DOM.hasClass( t , CLS_ICON_CHECKBOX) || -ROW_CLICK_SELECT_EXTRA_TAG.indexOf( ' '+t.nodeName.toLowerCase()+' ' ) ) && YDOM.getAncestorByTagName( t , 'tbody' )
            }
            if( selectType == COL_CHECKBOX ){
                Event.on(self.tableEl,'click',function(e){
                    var t = e.target;
                    if( selectJudgement(t) ){
                        var row = YDOM.getAncestorByClassName( t , CLS_ROW ) || YDOM.getAncestorByClassName( t , CLS_ROW_EXTRA );
                        self.toggleSelectRow( row.getAttribute( ATTR_ROW_IDX ));
                    }else if( t == self._selectAllTrigger){
                        var theadRow = self._theadEl.getElementsByTagName('tr')[0];
                        if( DOM.hasClass( theadRow , CLS_ROW_SELECTED ) ){
                            self.deselectAll();
                        }else{
                            self.selectAll();
                        }
                    }
                });
            }else if( selectType == COL_RADIO ){
                var curSelectedIdx;
                Event.on(self.tableEl,'click',function(e){
                    var t = e.target;
                    if( selectJudgement(t) ){
                        var row = YDOM.getAncestorByClassName( t , CLS_ROW ) || YDOM.getAncestorByClassName( t , CLS_ROW_EXTRA );
                        if( curSelectedIdx != undefined ) self.deselectRow(curSelectedIdx);
                        curSelectedIdx = row.getAttribute( ATTR_ROW_IDX );
                        self.selectRow( curSelectedIdx );
                    }
                });
            }
        },
        
        //������չ�й���
        _activateRowExpand:function(){
            var self = this;
            Event.on(self.tableEl,'click',function(e){
                var t = e.target;
                if( DOM.hasClass( t , CLS_ICON_EXPAND ) ){
                    var row = YDOM.getAncestorByClassName( t , CLS_ROW );
                    var nextSibling = YDOM.getNextSibling( row );
                    //���row������Ԫ�أ���������Ԫ�ز�����չ��
                    if( !nextSibling || !DOM.hasClass( nextSibling , CLS_ROW_EXTRA ) ){
                        var idx = row.getAttribute( ATTR_ROW_IDX );
                        var rowExtra = self._renderRowExtra( self._listData[idx] );
                            rowExtra.setAttribute( ATTR_ROW_IDX , idx );
                        if(DOM.hasClass( row , CLS_ROW_SELECTED )) YDOM.addClass( rowExtra, CLS_ROW_SELECTED );
                        YDOM.insertAfter( rowExtra , row );
                    }else{
                        var rowExtra = nextSibling;
                    }
                    DOM.toggleClass( row , CLS_ROW_EXPANDED );
                    DOM.toggleClass( rowExtra , CLS_ROW_EXPANDED );
                }
            });
        },

        /**************************************************************************************************************
         * @��ҳ
         *************************************************************************************************************/

        /**
         * ��ҳ����
         * Ĭ��ֵ�� DataGrid.paginationDef
         */
        paginationDef:null,
        //��ҳ
        _paginationEl:null,
        //��Ⱦ��ҳ
        _renderPagination:function(){
            var self = this;
            var paginationEl = createEl( 'div', 'ks-pagination');
            var wrapperEl = createEl( 'div' , 'standard' , null , paginationEl);
            self._pageInfoEl = createEl( 'span' , 'page-info' , null , wrapperEl);
            self._pageStartEl = createEl( 'a' , 'page-start' , '��ҳ' , wrapperEl);
            self._pageStartDisabledEl = createEl( 'span' , 'page-start' , '��ҳ' , wrapperEl);
            self._pagePrevEl = createEl( 'a' , 'page-prev' , '��һҳ' , wrapperEl);
            self._pagePrevDisabledEl = createEl( 'span' , 'page-prev' , '��һҳ' , wrapperEl);
            self._curPageNumEl = createEl( 'span' , 'page' , '1' , wrapperEl);
            self._pageNumElArr = [];
            for( var i = 0 , len = self.paginationDef.pageNumLength ; i < len ; i++ ){
                var pageNumEl = createEl( 'a' , 'page' , null , wrapperEl);
                    pageNumEl.setAttribute('data-page-idx',i);
                this._pageNumElArr.push(pageNumEl);
            }
            self._pageNextEl = createEl( 'a' , 'page-next' , '��һҳ' , wrapperEl);
            self._pageNextDisabledEl = createEl( 'span' , 'page-next' , '��һҳ' , wrapperEl);
            self._pageEndEl = createEl( 'a' , 'page-end' , 'ĩҳ' , wrapperEl);
            self._pageEndDisabledEl = createEl( 'span' , 'page-end' , 'ĩҳ' , wrapperEl);
            self._pageSkipEl = createEl( 'span' , 'page-skip' , '����<input type="text" size="3" class="jump-to">ҳ <button class="page-skip-button" type="button">ȷ��</button>' , wrapperEl);
            self._pageSkipInputEl = self._pageSkipEl.getElementsByTagName('input')[0];
            self._pageSkipBtnEl = self._pageSkipEl.getElementsByTagName('button')[0];
            self._dataLimitEl = createEl( 'span' , 'data-limit' , 'ÿҳ<select><option value=""></option><option value="20">20</option><option value="40">40</option><option value="60">60</option><option value="80">80</option></select>��' , wrapperEl);
            self._dataLimitSetEl = self._dataLimitEl.getElementsByTagName('select')[0];

            if(self.paginationDef.position == 'bottom'){
                YDOM.insertAfter( paginationEl, self.tableEl );
            }else{
                YDOM.insertBefore( paginationEl, self.tableEl );
            }
            self._paginationEl = paginationEl;
            
            function pageTurning(e){
                var t = this ;
                var queryData = self._latestQueryData,
                    datasourceDef = self.datasourceDef,
                    dataStart = parseInt(getQueryParamValue(queryData,self.datasourceDef.dataStart) || 0,10),
                    dataLimit = parseInt(getQueryParamValue(queryData,self.datasourceDef.dataLimit),10),
                    dataAmount = parseInt(self._liveData[datasourceDef.dataAmount],10),
                    totalPageNumLength = Math.ceil(dataAmount/dataLimit);
                if( t == self._pageStartEl ){
                    dataStart = '0';
                }else if( t == self._pagePrevEl ){
                    dataStart -= dataLimit;
                }else if( t == self._pageNextEl ){
                    dataStart += dataLimit;
                }else if( t == self._pageEndEl ){
                    dataStart = ( totalPageNumLength - 1 ) * dataLimit ;
                }else if( t == self._pageSkipBtnEl ){
                    var skipTo = Math.min( parseInt( self._pageSkipInputEl.value , 10 ) || 1 , totalPageNumLength );
                        self._pageSkipInputEl.value = skipTo;
                    dataStart = ( skipTo - 1 ) * dataLimit;
                }else{
                    dataStart = ( t.innerHTML - 1 ) * dataLimit ;
                }
                var postData = setQueryParamValue(queryData,datasourceDef.dataStart,dataStart);
                self.update(postData);
            }
            var pageTurningTrigger = self._pageNumElArr.concat(self._pageStartEl , self._pagePrevEl , self._pageNextEl , self._pageEndEl ) ;
            hide.apply(window,pageTurningTrigger);
            hide(self._pageSkipEl,self._dataLimitEl);
            Event.on( pageTurningTrigger , 'click' , pageTurning );
            Event.on( self._pageSkipBtnEl , 'click' , pageTurning );
            Event.on( self._dataLimitSetEl , 'change' , function(e){
                if( !self._listData ) return;
                var t = this;
                if( !t.options[0].value){
                    var curLimit = self.paginationDef.dataLimit;
                    var curLimitInSelect = false ;
                    for( var i = 0 , len = t.options.length ; i < len ; i++ ){
                        if( t.options[i].value == curLimit ){
                            curLimitInSelect = true;
                            break;
                        }
                    }
                    if( curLimitInSelect ){
                        t.removeChild( t.options[0] );
                    }else{
                        t.options[0].value = t.options[0].innerHTML = curLimit;
                    }
                }
                self.paginationDef.dataLimit = t.value;
                self.update( self._latestQueryData );
            } );
        },
        //���·�ҳ
        _updatePagination:function(){
            var self = this,
                queryData = self._latestQueryData,
                dataStart = parseInt(getQueryParamValue(queryData,self.datasourceDef.dataStart) || 0,10),
                dataLimit = parseInt(getQueryParamValue(queryData,self.datasourceDef.dataLimit),10),
                dataAmount = parseInt(self._liveData[self.datasourceDef.dataAmount],10),
                pageNumLength = self.paginationDef.pageNumLength,
                totalPageNumLength = Math.ceil(dataAmount/dataLimit);

            show(self._pageSkipEl);
            show(self._dataLimitEl);
            //��ʾ��¼������
            self._pageInfoEl.innerHTML = '��'+ totalPageNumLength +'ҳ';
            //�ж���һҳ״̬
            if(dataStart){
                show( self._pageStartEl , self._pagePrevEl );
                hide( self._pageStartDisabledEl , self._pagePrevDisabledEl );
            }else{
                hide( self._pageStartEl , self._pagePrevEl );
                show( self._pageStartDisabledEl ,self._pagePrevDisabledEl );
            }
            //�ж���һҳ״̬
            if( dataStart + dataLimit >= dataAmount ){
                hide( self._pageNextEl, self._pageEndEl );
                show( self._pageNextDisabledEl , self._pageEndDisabledEl );
            }else{
                show( self._pageNextEl , self._pageEndEl );
                hide( self._pageNextDisabledEl , self._pageEndDisabledEl );
            }
            //��ʾ��ǰҳ
            var curPageNum = Math.ceil(dataStart / dataLimit)+1;
            self._curPageNumEl.innerHTML = curPageNum;
            //��ǰҳ����ҳ���е�λ��
            var curPageIdx = Math.floor( Math.min(totalPageNumLength,pageNumLength) / 2 );
            //����ҳ�루����ҳ��+ҳ�����=������ҳ�룩
            var basicPageNum = 0;
            if( curPageNum - curPageIdx <= 0 ){
                curPageIdx = curPageNum-1;
            }else if( curPageNum > totalPageNumLength - Math.min(totalPageNumLength,pageNumLength) + curPageIdx + 1 ){
                curPageIdx = curPageNum - ( totalPageNumLength - Math.min(totalPageNumLength,pageNumLength));
                basicPageNum = totalPageNumLength - Math.min(totalPageNumLength,pageNumLength);
            }else{
                basicPageNum = curPageNum - curPageIdx - 1;
            }
             //��Ⱦҳ��
            for(var i = 0 , len = pageNumLength ; i < len ; i++){
                //����ҳ���г�����ҳ���Ĳ���
                if( totalPageNumLength < i+1 ){
                    hide(self._pageNumElArr[i]);
                }else{
                    self._pageNumElArr[i].innerHTML = i + 1 + basicPageNum ;
                    if( i + 1 + basicPageNum == curPageNum ){
                        YDOM.insertBefore( self._curPageNumEl , self._pageNumElArr[i]);
                        hide(self._pageNumElArr[i]);
                    }else{
                        show(self._pageNumElArr[i]);
                    }
                }
            }
        },

        /**************************************************************************************************************
         * @ѡ�����
         *************************************************************************************************************/

        /**
         * �л�ָ����ѡ��״̬
         * @param idx ������
         */
        toggleSelectRow:function(){
            for(var i = 0 , len = arguments.length ; i < len ; i++){
                this._toggleSelectRow(arguments[i]);
            }
            this._checkIfSelectAll();
        },
        /**
         * ѡ��ָ����
         * @param idx ������
         */
        selectRow:function(){
            for(var i = 0 , len = arguments.length ; i < len ; i++){
                this._toggleSelectRow(arguments[i],1);
            }
            this._checkIfSelectAll();
        },
        /**
         * ȡ��ѡ��ָ����
         * @param idx ������
         */
        deselectRow:function(){
            for(var i = 0 , len = arguments.length ; i < len ; i++){
                this._toggleSelectRow(arguments[i],0);
            }
            this._checkIfSelectAll();
        },
        /**
         * ȫѡ
         */
        selectAll:function(){
            for(var i = 0 , len = this._rowElArr.length ; i < len ; i++){
                this._toggleSelectRow(i,1);
            }
            this._checkIfSelectAll();
        },
        /**
         * ȫ��ѡ
         */
        deselectAll:function(){
            for(var i = 0 , len = this._rowElArr.length ; i < len ; i++){
                this._toggleSelectRow(i,0);
            }
            this._checkIfSelectAll();
        },
        /**
         * ��ѡ
         */
        selectInverse:function(){
            for(var i = 0 , len = this._rowElArr.length ; i < len ; i++){
                this._toggleSelectRow(this._rowElArr[i]);
            }
            this._checkIfSelectAll();
        },

        /**
         * ��ȡ��ѡ��record������
         */
        getSelectedIndex:function(){
            return this._getSelected('index');
        },
        /**
         * ��ȡ��ѡ�е�record
         */
        getSelectedRecord:function(){
            return this._getSelected();
        },

        /**
         * ��ָ������������ʾΪָ����ѡ��״̬
         * @param idx Ҫ�л�ѡ��״̬������listData�е�������
         * @param selectType 1Ϊѡ�У�0Ϊȡ��ѡ�У�������Ϊ�Զ��л�
         */
        _toggleSelectRow:function(idx,selectType){
            var row = this._rowElArr[idx];
            var nextSibling = YDOM.getNextSibling( row );
            if( nextSibling && DOM.hasClass( nextSibling , CLS_ROW_EXTRA )) var rowExtra = nextSibling;
            if(selectType == undefined){
                DOM.toggleClass( row , CLS_ROW_SELECTED );
                if(rowExtra) DOM.toggleClass( rowExtra , CLS_ROW_SELECTED );
            }else if(selectType){
                DOM.addClass( row , CLS_ROW_SELECTED );
                if(rowExtra) DOM.addClass( rowExtra , CLS_ROW_SELECTED );
            }else{
                DOM.removeClass( row , CLS_ROW_SELECTED );
                if(rowExtra) DOM.removeClass( rowExtra , CLS_ROW_SELECTED );
            }
        },

        //����Ƿ�ȫѡ
        _checkIfSelectAll:function(){
            var ifSelectAll = true , rowElArr = this._rowElArr;
            for(var i = 0 , len = rowElArr.length ; i < len ; i++){
                if( !DOM.hasClass( rowElArr[i] , CLS_ROW_SELECTED)){
                    ifSelectAll = false;
                    break;
                }
            }
            var theadRow = this._theadEl.getElementsByTagName('tr')[0];
            if(ifSelectAll){
                DOM.addClass( theadRow , CLS_ROW_SELECTED );
            }else{
                DOM.removeClass( theadRow , CLS_ROW_SELECTED );
            }
        },

        /**
         * ��ȡѡ�е��л���record
         * @param returnBy Ĭ��'record'����ѡ'index'
         */
        _getSelected:function(returnBy){
            var selected = [];
            for( var  i = 0 , len = this._rowElArr.length ; i < len ; i++ ){
                if( YDOM.hasClass( this._rowElArr[i] , CLS_ROW_SELECTED ) ){
                    if(returnBy == 'index'){
                        selected.push( i );
                    }else{
                        selected.push( this._listData[i] );
                    }
                }
            }
            if( selected.length ==  0 ){
                return null;
            }else{
                return selected;
            }
        },


        /**************************************************************************************************************
         * @��ɾ�Ĳ���
         *************************************************************************************************************/

        addRecord:function(){

        },
        modifyRecord:function(){

        },
        deleteRecord:function(){

        }       


    });

    S.mix(DataGrid.prototype, S.EventTarget);

    /******************************************************************************************************************
     * @Ĭ������
     *****************************************************************************************************************/

    //����ԴĬ�϶���
    DataGrid.datasourceDef = {
        success:'success',
        listData:'dataList',
        info:'info',
        dataStart:'start',
        dataLimit:'limit',
        dataAmount:'total',
        sortType:'sorttype',
        sortBy:'sortby'
    };

    //��ҳĬ�϶���
    DataGrid.paginationDef = {
        dataLimit:5,
        pageNumLength:8,
        position:'bottom'
    };

    /******************************************************************************************************************
     * @util
     *****************************************************************************************************************/

    function createEl(tagName,className,inner ,parentNode){
        var el = doc.createElement(tagName);
        if(className) el.className = className;
        if(inner){
            if( typeof inner == 'string' ){
                el.innerHTML = inner;
            }else{
                el.appendChild(inner);
            }
        };
        if(parentNode) parentNode.appendChild(el);
        return el;
    }

    function appendChild( o , child ){
        if( o == undefined || child ==undefined ) return;
        if( typeof child == 'string' ){
            o.innerHTML = child;
        }else{
            o.appendChild( child );
        }
    };

    /**
     * ��ȡ��ѯ�ַ�����ָ��key��ֵ�����û���򷵻�null
     * @param queryString
     * @param key
     */
    function getQueryParamValue(queryString, key) {
        var result = queryString.match(new RegExp('(?:^|&)' + key + '=(.*?)(?=$|&)'));
        return result && result[1];
    }

    /**
     * ����ѯ�ַ���ָ��key��ֵ������ֵ
     * @param queryString
     * @param key
     * @param newValue
     */
    function setQueryParamValue(queryString, key, newValue) {
          var newParam = key + '=' + newValue;
          if (!queryString) return newParam;

          var replaced = false;
          var params = queryString.split('&');
          for (var i = 0; i < params.length; i++) {
            if (params[i].split('=')[0] == key) {
              params[i] = newParam;
              replaced = true;
            }
          }
          if (replaced) return params.join('&');
          return queryString + '&' + newParam;
     }

    /**
     * �滻Ԫ��
     * @param oldEl
     * @param newEl
     */
    function  replaceEl(oldEl,newEl){
        var parentEl=oldEl.parentNode;
        var refEl=DOM.next(oldEl);
        parentEl.removeChild(oldEl);
        if(refEl){
            YDOM.insertBefore(newEl,refEl);
        }else{
            parentEl.appendChild(newEl);
        }
    }

    /**
     * ��ȡһ��HTML�ַ���ǰ����ǩ�ı�ǩ��
     * @param str
     */
    function getLeadingTagName(str){
        var m = str.match(/^\s*<(\w+)/);
        if(m){
            return m[1].toLowerCase();
        }else{
            return null;
        }
    }

    /**
     * ��һ��HTML�ַ���ת����DOMԪ�أ������ظ�Ԫ�أ�Ҫ�����ҽ���һ����߲㼶Ԫ�أ�
     * @param str
     */
    function parseStrToEl(str){
        var tagName=getLeadingTagName(str);
        if(!tagName){
            alert('Your html string is illegal.');
            return;
        }
        var tableElPresuffix={pre:'<table class="wrapper">',suf:'</table>'};
        var tagPresuffix={
            colgroup:tableElPresuffix,
            thead:tableElPresuffix,
            tbody:tableElPresuffix,
            tr:tableElPresuffix,
            th:{pre:'<table><tr class="wrapper">',suf:'</tr></table>'},
            td:{pre:'<table><tr class="wrapper">',suf:'</tr></table>'},
            tfoot:tableElPresuffix
        };
        if(!tagPresuffix[tagName]) tagPresuffix[tagName]={pre:'<div class="wrapper">',suf:'</div>'};
        var tempNode=doc.createElement('div');
            tempNode.innerHTML=tagPresuffix[tagName].pre + str + tagPresuffix[tagName].suf;
        var wrapper=YDOM.getElementsByClassName('wrapper','*',tempNode)[0];
        /*
        ��ʹ���ĵ���Ƭʱ�����صĶ����ָ����ĵ���Ƭ������������������Ԫ�أ�����ֻ����һ����߲�Ԫ�ص����
        var docFragment=doc.createDocumentFragment();
        while(YDOM.getFirstChild(wrapper)){
            docFragment.appendChild(YDOM.getFirstChild(wrapper));    
        }
        */
        return YDOM.getFirstChild(wrapper);
    }

    /**
     * ��columnDef�����νṹչ���ɶ�ά����ṹ
     * @param columnDef �������趨
     * @param childrenKey ָ�����е�key
     * @param callback ������Ļص�����
     * @param callbackObj �ص������е�thisָ��Ķ���
     */
    function parseColumnDefToFlat(columnDef,childrenKey,callback,callbackObj){
        childrenKey = childrenKey || 'children';
        //������ı�ͷ����
        var theadColDef = [];
        //��������ж���
        var colDef = [];
        //�����ж���
        var colExtraDef = null;
        //����ѡ���еķ�ʽ
        var colSelectDef = null;
        //���������
        var depth=1;

        //�����ж����е��������趨��Ҫ���������趨ȫ��Ҫ����߲㼶����
        function filterColDef(columnDef){
            var colDef=[];
            for( var i = 0 , len = columnDef.length ; i < len ; i++){
                //�������չ��ť��
                if(columnDef[i].xType == COL_EXTRA){
                    colExtraDef = columnDef[i];
                //����Ǹ�ѡ����
                }else if(columnDef[i].xType == COL_CHECKBOX){
                    colSelectDef = COL_CHECKBOX;
                //����ǵ�ѡ����
                }else if(columnDef[i].xType == COL_RADIO){
                    colSelectDef = COL_RADIO;
                }else{
                    colDef.push(columnDef[i]);
                }
            }
            return colDef;
        }
        //�õ����˵��������趨�����趨
        var pureColDef = filterColDef(columnDef);

        //�ж�tree�Ƿ�������
        function ifTreeHasChildren(tree){
            for(var i = 0, len = tree.length; i < len; i++){
                if(tree[i][childrenKey] && tree[i][childrenKey].length>0){
                    return true;
                }
            }
            return false;
        }

        //���µ�ǰ�ڵ����и��ڵ��childrenAmountֵ���ӽڵ�����
        function updateFathersChildrenAmount(subTree){
            var step = subTree[childrenKey].length-1;
            var curTree = subTree;
            var curDepth = subTree[KS_DEPTH];
            while(curDepth > 0){
                var fatherTree = theadColDef[curDepth-1][curTree[KS_FATHER_IDX]];
                fatherTree[KS_CHILDREN_AMOUNT] = fatherTree[KS_CHILDREN_AMOUNT] + step;
                curTree = fatherTree;
                curDepth = fatherTree[KS_DEPTH];
            }
        }

        //ת����
        function parse(tree){
            //�ж��������
            var treeHasChildren = ifTreeHasChildren(tree);
            //��������
            var subTree = [];
            theadColDef[depth-1] = [];
            for(var i = 0,ilen = tree.length; i < ilen; i++){
                /* ���tree[i][KS_DEPTH]�����ڣ����¼tree[i]���������
                 * ����Ҫ���ж�����Ϊ����ڵ�ǰ�㼶��tree���ӽڵ�������
                 * tree[i]�պ�û���ӽڵ��ˣ���ô�����tree[i]����tree[i]��һ�㼶���ӽڵ�
                 * �����Ļ���ȷ���õ���theadDef�����һ��Ԫ�أ����飩ΪcolDef
                 */
                if(tree[i][KS_DEPTH] == undefined) tree[i][KS_DEPTH] = depth-1;
                //jitree[i]��ӵ�theadColDef[depth-1]������ȥ
                theadColDef[depth-1].push(tree[i]);
                //���tree��������tree[i]������
                if(treeHasChildren){
                    if(tree[i][childrenKey]){
                        //��¼tree[i]����Ԫ����
                        tree[i][KS_CHILDREN_AMOUNT]=tree[i][childrenKey].length;
                        for(var j=0,jlen=tree[i][childrenKey].length;j<jlen;j++){
                            //��tree[i]�ӽڵ��м�¼tree[i]���ڶ�ά�����������
                            tree[i][childrenKey][j][KS_FATHER_IDX]=i;
                            //������ͬһ�㼶��tree[i]�ӽڵ�ŵ�һ������
                            subTree.push(tree[i][childrenKey][j]);
                        }
                        updateFathersChildrenAmount(tree[i]);
                    }else{
                        tree[i][KS_CHILDREN_AMOUNT]=0;
                        subTree.push(tree[i]);
                    }
                //���������
                }else{
                    tree[i][KS_CHILDREN_AMOUNT]=0;
                }
            }
            depth++;
            if(subTree.length>0){
                arguments.callee(subTree);
            }else{
                colDef = theadColDef[theadColDef.length-1];
                if(callback) callback.call(callbackObj || window , theadColDef, colDef, colExtraDef, colSelectDef);
            }
        }
        parse(pureColDef);
    }

    //��ʾָ��Ԫ��
    function show(){
        for( var i = 0 ,len = arguments.length ; i < len ; i++ ){
            arguments[i].style.display='';
        }
    }
    //�����ƶ�Ԫ��
    function hide(el){
        for( var i = 0 ,len = arguments.length ; i < len ; i++ ){
            arguments[i].style.display='none';
        }
    }

    S.DataGrid = DataGrid;
});
