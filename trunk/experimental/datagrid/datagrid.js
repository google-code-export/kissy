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
 * 1�����Ĭ�����ã����������µĴ������
 * 2��ʹ��var self=this����ߴ���ѹ����
 * 3��ʹ�þֲ�������ߴ���Ч��
 * 4������ļ���init&config,render,bind,util��
 */

/**
 * ����
 * 1������Դ���棨�κ�д����ʱ�Զ���ջ��棩
 * 2��Ŀǰ����Դ����datagrid�£������Ժ�datasource�����ļ�����
 * 3������Զ����¼�
 * 4��תyui������kissy
 */

KISSY.add("datagrid", function(S) {
    var DOM = S.DOM, Event = S.Event, YDOM = YAHOO.util.Dom, YEvent= YAHOO.util.Event, YConnect=YAHOO.util.Connect,
        doc=document,
        //���������е�����
        COL_CHECKBOX = 'COL_CHECKBOX', COL_RADIO = 'COL_RADIO', COL_EXTRA = 'COL_EXTRA',
        //�������columnDefʱҪ�õ��������ڲ�����
        KS_DEPTH = 'KSDepth', KS_FATHER_IDX='KSFatherIdx', KS_CHILDREN_AMOUNT='KSChildrenAmount',
        //loading��htmlƬ�� 
        LOADING_EL_STR = '<tbody><tr class="row row-loading"><td></td></tr></tbody>',
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
        //����ѡ��ĳ��ʱ�������Ԫ��
        TAG_NAME_EXCEPTION = ' a input button select option textarea '
        ;

    /**
     * DataGrid
     * @constructor
     */
    function DataGrid(container,datasourceUri){
        //��������
        this.container = S.get(container);
            DOM.addClass(this.container,'ks-datagrid');
        //���ɱ��Ԫ��
        this.tableEl=doc.createElement('table');
            this.container.appendChild(this.tableEl);
            DOM.addClass(this.tableEl,'datagrid-table');
        //����loadingԪ��
        this.loadingEl=parseStrToEl(LOADING_EL_STR);
        //��¼����Դuri
        this.datasourceUri=datasourceUri;
    }

    S.mix(DataGrid.prototype,{
        connectMethod:POST,
        /**
         * ����datasource��ָ��datasource����ֶε���;(�����ֹ�����)
         */
        datasourceDef:null,
        /**
         * ��¼���һ�β�ѯ�������͵�����
         */
        latestQueryData:'',
        /**
         * JSON��ʽ������Դ
         */
        liveData:null,
        /**
         * ����Դ�е��б�����
         */
        listData:null,
        /**
         * �����У�������Ⱦ(�����ֹ�����)
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
        columnAmount:null,
        //����columnDef��õ��ı�ͷ�ж���
        theadColDef:null,
        //����columnDef��õ��ı�����ͨ�ж���
        colDef:null,
        //����columnDef��õ��ı�����չ�ж���
        colExtraDef:null,
        //����columnDef��õ���ѡ���ж���
        colSelectDef:null,
        /**
         * �����ֶΣ������޸ģ���δ���壬�������ֶζ�����д��������ʽ�޸ģ�
         * fieldDef={
         *      index:{},
         *      realname:{},
         *      nickname:{},
         *      pagename:{},
         *      pageurl:{}
         * }
         */
        fieldDef:null,
        //���
        tableEl:null,
        //colgroupԪ��
        colgroupEl:null,
        //��ͷ
        theadEl:null,
        //���������thԪ��
        sortTrigger:[],
        //��ǰ�����th
        curSortTrigger:null,
        //����ȫѡ��Ԫ��
        selectAllTrigger:null,
        //��ʾloading��tbody
        loadingEl:null,
        //װ�����ݵ�tbody
        tbodyEl:null,
        //��׼���������
        rowElArr:null,
        //��β
        tfootEl:null,
        /**
         * ��ҳ����
         */
        paginationDef:null,
        //��ҳ
        paginationEl:null,
        startLoading:function(){
            if(this.columnAmount){
                var loadingTd = this.loadingEl.getElementsByTagName('td')[0];
                loadingTd.colSpan = this.columnAmount;
            }
            //notice��û�а�loadingEl�ӵ�tableEl�У�����diaplay:none�ķ�ʽ���л�loading�����ʾ������Ϊie��ʹ��jsȥdisplay:none loadingEl���е����⣺�߶��޷��������±߿���һֱ�ɼ�
            if(YDOM.getFirstChild(this.tableEl)){
                var firstChild = YDOM.getFirstChild(this.tableEl);
                YDOM.insertBefore(this.loadingEl, firstChild);
            }else{
                this.tableEl.appendChild(this.loadingEl);
            }
        },
        endLoading:function(){
            if(YDOM.isAncestor( this.tableEl , this.loadingEl )) this.tableEl.removeChild( this.loadingEl );
        },
        /**
         * ÿ���첽���󷵻�ֵ�Ļ�������
         * @param o
         */
        _dataPreProcessor:function(o){
            try{
                this.liveData = eval('('+o.responseText+')');
            }catch(e){
                alert('�����뷵��JSON��ʽ�����ݡ�');
                this.endLoading();
                return;
                
            }
            this.requestResult = this.liveData[this.datasourceDef.success];
            if(this.requestResult){
                this.listData = this.liveData[this.datasourceDef.listData];
            }else{
                var info = this.liveData[this.datasourceDef.info];
                alert('����'+info);
                this.endLoading();
            }
        },
        /**
         * ÿ�ν�����columnDef֮��Ļ�������
         */
        _parseColumnDefPreProcessor:function(theadColDef, colDef, colExtraDef, colSelectDef){
            this.theadColDef =theadColDef;
            this.colDef = colDef;
            this.colExtraDef = colExtraDef;
            this.colSelectDef = colSelectDef;
        },
        update:function(postData){
            if(postData == undefined) return;
            this.startLoading();
            var paginationDef = this.paginationDef ;
            //��������˷�ҳ���壬��postData��δָ��dataLimit�������postData
            if(paginationDef && !getQueryParamValue( postData ,paginationDef.dataLimit )){
                postData = setQueryParamValue(postData, this.datasourceDef.dataLimit, paginationDef.dataLimit);
            }
            var callback={
                success:function(o){
                    var self = this ;
                    self._dataPreProcessor(o);
                    //�������ɹ����ҷ���������ȷ
                    if(self.requestResult){
                        var listData = self.listData;
                        //������ж����ҷ������б����ݣ�����ݷ��������Զ������ж���,���ֹ�����
                        if( ! self.columnDef && listData.length > 0 ){
                            if(  listData.length > 0 ){
                                self.columnDef = [];
                                for( var i in listData[0]){
                                     self.columnDef.push({label:i,field:i});
                                }
                            }else{
                                return;
                            }
                        }
                        //����ж��屻������
                        if(!self.colDef){
                            //����columnDef���ɹ���ʼ��ʼ������
                            parseColumnDefToFlat( self.columnDef,null,function(theadColDef, colDef, colExtraDef, colSelectDef){
                                var self = this ;
                                self._parseColumnDefPreProcessor(theadColDef, colDef, colExtraDef, colSelectDef);
                                self._renderThead();
                                self._renderTbody();
                                this.endLoading();
                                //��������
                                if(self.sortTrigger.length>0) self._activateRowSort();
                                //������չ����
                                if(colExtraDef) self._activateRowExpand();
                                //ѡ���й���
                                if(colSelectDef) self._activateRowSelect();
                            },self);
                        //����ж���û��������
                        }else{
                            self._renderTbody();
                            self.endLoading();
                        }
                        //�������һ�εĲ�ѯ����
                        self.latestQueryData = postData;
                        //����ҳ��
                        if( self.paginationDef ) self._updatePagination();
                    }
                },
                failure:function(){
                    alert('��ȡ����ʧ�ܣ���ˢ��ҳ�����Ի���ϵ����Ա��');
                    this.endLoading();
                },
                scope:this
            };
            YConnect.asyncRequest(this.connectMethod, this.datasourceUri, callback, postData);
        },
        render:function(postData){
            var self = this ;
            self.datasourceDef = self.datasourceDef || {};
            self.datasourceDef = S.merge( DataGrid.datasourceDef , self.datasourceDef );
            if(self.paginationDef){
                self.paginationDef = S.merge( DataGrid.paginationDef , self.paginationDef );
                self._renderPagination();
            }
            self.update(postData);
        },
        /**
         * ��Ⱦ��ͨth
         * @param cellDef
         */
        _renderTheadCell:function(cellDef){
            var cell = doc.createElement('th');
            //�������th
            if(cellDef[KS_CHILDREN_AMOUNT] == 0){
                //������
                if(cellDef.xType){
                    cell.className = CLS_CELL_EXTRA;
                    //ȫѡ
                    if(cellDef.xType == COL_CHECKBOX){
                        cell.innerHTML = '<i class="' + CLS_ICON_CHECKBOX + '"></i>';
                    }

                //����
                }else if(cellDef.sortable){                    
                    cell.className = CLS_SORTABLE;
                    cell.setAttribute( ATTR_SORT_FIELD , cellDef.field );
                    cell.innerHTML = '<i class="icon"></i>';
                    this.sortTrigger.push(cell);
                }
            //�������th
            }else{
                cell.colSpan = cellDef[KS_CHILDREN_AMOUNT];
            }
            //���ֱ�ǩ
            if(cellDef.label) cell.innerHTML = cellDef.label + cell.innerHTML;
            return cell;
        },
        /**
         * ��Ⱦ��չ��ť�е�th
         */
        _renderTheadCellExpand:function(){
            var cell = doc.createElement('th');
                cell.className = CLS_CELL_EXTRA;
            return cell;
        },
        /**
         * ��Ⱦѡ���е�th
         * @param selectType
         */
        _renderTheadCellSelect:function(selectType){
            var cell = doc.createElement('th');
                cell.className = CLS_CELL_EXTRA;
            if(selectType == COL_CHECKBOX){
                this.selectAllTrigger = doc.createElement('i');
                this.selectAllTrigger.className =  CLS_ICON_CHECKBOX;
                cell.appendChild( this.selectAllTrigger );
            }
            return cell;
        },
        /**
         * ��Ⱦ��ͷ
         */
        _renderThead:function(){
            var theadColDef=this.theadColDef;
            var colgroupEl = doc.createElement('colgroup');
            var theadEl = doc.createElement('thead');
            var depth = theadColDef.length;
            for(var i = 0 , ilen = theadColDef.length ; i < ilen ; i++){
                var row = doc.createElement('tr');
                    row.className = 'row';
                //��չ��ť��
                if( i == 0){
                    if(this.colExtraDef){
                        var theadCellExpand = this._renderTheadCellExpand();
                            theadCellExpand.rowSpan = ilen;
                        row.appendChild(theadCellExpand);
                        var col =  doc.createElement('col');
                            col.width = '25';
                        colgroupEl.appendChild(col);
                    }
                    if(this.colSelectDef){
                        var theadCellSelect = this._renderTheadCellSelect(this.colSelectDef);
                             theadCellSelect.rowSpan = ilen;
                        row.appendChild(theadCellSelect);
                        var col =  doc.createElement('col');
                            col.width = '25';
                        colgroupEl.appendChild(col);
                    }
                }
                //��ͨ��
                for(var j = 0 , jlen = theadColDef[i].length ; j < jlen ; j++){
                    var cellDef = theadColDef[i][j];
                    if(cellDef[KS_DEPTH] != i) continue;
                    var cell = this._renderTheadCell(cellDef);                      
                    if(cellDef[KS_CHILDREN_AMOUNT] == 0){
                        colgroupEl.appendChild(doc.createElement('col'));
                        if(depth-1>i){
                            cell.rowSpan = depth - i;
                        }
                    }
                    row.appendChild(cell);
                }
                theadEl.appendChild(row);
            }
            if(this.colgroupEl) this.tableEl.removeChild(this.colgroupEl);
            if(this.theadEl) this.tableEl.removeChild(this.theadEl);
            this.colgroupEl = colgroupEl;
            this.theadEl = theadEl;
            this.tableEl.appendChild(this.colgroupEl);
            this.tableEl.appendChild(this.theadEl);
            this.columnAmount=this.colgroupEl.getElementsByTagName('col').length;
        },
        /**
         * ��Ⱦ��ͨ��Ԫ��
         * @param cellDef ��Ԫ���趨
         * @param recordData ��������
         */
        _renderCell:function(cellDef,recordData){
            var cell = doc.createElement('td');
            //���ָ�����ֶ�
            if(cellDef.field != undefined ){
                //����ǵ��ֶ�
                if(typeof cellDef.field == 'string'){
                    var fieldValue = recordData[cellDef.field];
                    //�������Ⱦ��
                    if(cellDef.parser){
                        cell.innerHTML = cellDef.parser(fieldValue);
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
                        cell.innerHTML = cellDef.parser.apply(window,fieldValueArr);
                    //�������Ⱦ��
                    }else{
                        cell.innerHTML = fieldValueArr.join(' ');
                    }
                }
            //���ûָ���ֶ�
            }else{
                //�������Ⱦ��
                if(cellDef.parser){
                    cell.innerHTML = cellDef.parser();
                //�������Ⱦ��
                }else{
                    cell.innerHTML = '';
                }
            }
            return cell;
        },
        /**
         * ��Ⱦչ����ť��Ԫ��
         */
        _renderCellExpand:function(){
            var cell = doc.createElement('td');
            cell.className = CLS_CELL_EXTRA;
            cell.innerHTML = '<i class="' + CLS_ICON_EXPAND + '"></i>';
            return cell;
        },
        /**
         * ��Ⱦѡ��Ԫ��
         * @param selectType ѡ������ ���� COL_CHECKBOX �� COL_RADIO ��������ֵ
         */
        _renderCellSelect:function(selectType){
            var cell = doc.createElement('td');
            cell.className = CLS_CELL_EXTRA;
            if(selectType == COL_CHECKBOX){
                 cell.innerHTML = '<i class="' + CLS_ICON_CHECKBOX + '"></i>';
            }else if(selectType == COL_RADIO){
                 cell.innerHTML = '<i class="' + CLS_ICON_RADIO + '"></i>';
            }
            return cell;
        },
        /**
         * ��Ⱦ��
         * @param recordData ��������
         */
        _renderRow:function(recordData){
            var colDef = this.colDef;
            var row = doc.createElement('tr');
             row.className = CLS_ROW ;
            //��չ��ť
            if(this.colExtraDef) row.appendChild(this._renderCellExpand());
            //��ѡ���ߵ�ѡ��ť
            if(this.colSelectDef) row.appendChild(this._renderCellSelect(this.colSelectDef));
            for(var i = 0 , len = colDef.length ; i < len ; i++){
                row.appendChild(this._renderCell(colDef[i],recordData));
            }
            return row;
        },
        _renderRowExtra:function(recordData){
            var row = doc.createElement('tr');
                row.className = CLS_ROW_EXTRA ;
            if(this.colExtraDef){
                var td = doc.createElement('td');
                    td.className = CLS_CELL_EXTRA;
                row.appendChild(td);
            }
            if(this.colSelectDef){
                var td = doc.createElement('td');
                    td.className = CLS_CELL_EXTRA;
                row.appendChild(td);
            }
            var cell = this._renderCell(this.colExtraDef,recordData); 
                cell.colSpan = this.columnAmount;
            row.appendChild(cell);
            return row;
        },
        _renderTbody:function(){
            this.rowElArr = [];
            var listData = this.listData;
            var tbodyEl = doc.createElement('tbody');
            for(var i = 0 , len = listData.length ; i < len ; i++){
                var row = this._renderRow(listData[i]);
                    row.setAttribute(ATTR_ROW_IDX,i);
                this.rowElArr.push(row);
                tbodyEl.appendChild(row);
                if( this.colExtraDef && this.colExtraDef.expand ){
                    var rowExtra = this._renderRowExtra(listData[i]);
                        rowExtra.setAttribute(ATTR_ROW_IDX,i);
                    tbodyEl.appendChild(rowExtra);
                    DOM.addClass( row , CLS_ROW_EXPANDED );
                    DOM.addClass( rowExtra , CLS_ROW_EXPANDED );
                }
            }
            if(this.tbodyEl) this.tableEl.removeChild(this.tbodyEl);
            this.tbodyEl = tbodyEl;
            this.tableEl.appendChild(this.tbodyEl);
        },
        _renderTfoot:function(){
            
        },
        _renderPagination:function(){
            var self = this;
            function createEl(tagName,className,innerHTML ,parentNode){
                var el = doc.createElement(tagName);
                if(className) el.className = className;
                if(innerHTML) el.innerHTML = innerHTML;
                if(parentNode) parentNode.appendChild(el);
                return el;
            }
            var paginationEl = createEl( 'div', 'ks-pagination');
            var wrapperEl = createEl( 'div' , 'standard' , null , paginationEl);
            self._pageInfoEl = createEl( 'span' , 'page-info' , null , wrapperEl);
            self._pageStartEl = createEl( 'a' , 'page-start' , '��ҳ' , wrapperEl);
            self._pageStartDisabledEl = createEl( 'span' , 'page-start' , '��ҳ' , wrapperEl);
            self._pagePrevEl = createEl( 'a' , 'page-prev' , '��һҳ' , wrapperEl);
            self._pagePrevDisabledEl = createEl( 'span' , 'page-prev' , '��һҳ' , wrapperEl);
            self._curPageNumEl = createEl( 'span' , 'page' , null , wrapperEl);
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
            var pageSkipEl = createEl( 'span' , 'page-skip' , '����<input type="text" size="3" class="jump-to">ҳ <button class="page-skip-button" type="button">ȷ��</button>' , wrapperEl);
            self._pageSkipInputEl = pageSkipEl.getElementsByTagName('input')[0];
            self._pageSkipBtnEl = pageSkipEl.getElementsByTagName('button')[0];

            if(self.paginationDef.position == 'bottom'){
                YDOM.insertAfter( paginationEl, self.tableEl );
            }else{
                YDOM.insertBefore( paginationEl, self.tableEl );
            }
            self._paginationEl = paginationEl;

            function pageTurning(e){
                var t = this ;
                var queryData = self.latestQueryData,
                    datasourceDef = self.datasourceDef,
                    dataStart = parseInt(getQueryParamValue(queryData,self.datasourceDef.dataStart) || 0,10),
                    dataLimit = parseInt(getQueryParamValue(queryData,self.datasourceDef.dataLimit),10),
                    dataAmount = parseInt(self.liveData[datasourceDef.dataAmount],10),
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
            var pageTurningTrigger = self._pageNumElArr.concat(self._pageStartEl , self._pagePrevEl , self._pageNextEl , self._pageEndEl , self._pageSkipBtnEl ) ;
            Event.on (pageTurningTrigger , 'click' , pageTurning );
        },
        _updatePagination:function(){
            var self = this;
            var queryData = this.latestQueryData;
            var dataStart = parseInt(getQueryParamValue(queryData,this.datasourceDef.dataStart) || 0,10);
            var dataLimit = parseInt(getQueryParamValue(queryData,this.datasourceDef.dataLimit),10);
            var dataAmount = parseInt(this.liveData[this.datasourceDef.dataAmount],10);
            var pageNumLength = this.paginationDef.pageNumLength;
            var totalPageNumLength = Math.ceil(dataAmount/dataLimit);
            //��ʾ��¼������
            this._pageInfoEl.innerHTML = '��'+ totalPageNumLength +'ҳ';
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
                hide( this._pageNextEl, this._pageEndEl );
                show( this._pageNextDisabledEl , this._pageEndDisabledEl );
            }else{
                show( this._pageNextEl , this._pageEndEl );
                hide( this._pageNextDisabledEl , this._pageEndDisabledEl );
            }
            //��ʾ��ǰҳ
            var curPageNum = Math.ceil(dataStart / dataLimit)+1;
            this._curPageNumEl.innerHTML = curPageNum;
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
                    hide(this._pageNumElArr[i]);
                }else{
                    this._pageNumElArr[i].innerHTML = i + 1 + basicPageNum ;
                    if( i + 1 + basicPageNum == curPageNum ){
                        YDOM.insertBefore( this._curPageNumEl , this._pageNumElArr[i]);
                        hide(this._pageNumElArr[i]);
                    }else{                         
                        show(this._pageNumElArr[i]);
                    }
                }
            }      
        },
        addRecord:function(){

        },
        modifyRecord:function(){

        },
        deleteRecord:function(){
            
        },
        /**
         * ��ָ������������ʾΪָ����ѡ��״̬
         * @param idx Ҫ�л�ѡ��״̬������listData�е�������
         * @param selectType 1Ϊѡ�У�0Ϊȡ��ѡ�У�������Ϊ�Զ��л�
         */
        _toggleSelectRow:function(idx,selectType){
            var row = this.rowElArr[idx];
            var nextSibling = YDOM.getNextSibling( row );
            if( nextSibling && YDOM.hasClass( nextSibling , CLS_ROW_EXTRA )) var rowExtra = nextSibling;
            if(selectType == undefined){
                DOM.toggleClass( row , CLS_ROW_SELECTED );
                if(rowExtra) DOM.toggleClass( rowExtra , CLS_ROW_SELECTED );
            }else if(selectType){
                YDOM.addClass( row , CLS_ROW_SELECTED );
                if(rowExtra) YDOM.addClass( rowExtra , CLS_ROW_SELECTED );
            }else{
                YDOM.removeClass( row , CLS_ROW_SELECTED );
                if(rowExtra) YDOM.removeClass( rowExtra , CLS_ROW_SELECTED );
            }
        },
        _checkIfSelectAll:function(){
            var ifSelectAll = true;
            for(var i = 0 , len = this.rowElArr.length ; i < len ; i++){
                if( !YDOM.hasClass( this.rowElArr[i] , CLS_ROW_SELECTED)){
                    ifSelectAll = false;
                    break;
                }
            }
            var theadRow = this.theadEl.getElementsByTagName('tr')[0];
            if(ifSelectAll){
                YDOM.addClass( theadRow , CLS_ROW_SELECTED );
            }else{
                YDOM.removeClass( theadRow , CLS_ROW_SELECTED );
            }
        },
        toggleSelectRow:function(){
            for(var i = 0 , len = arguments.length ; i < len ; i++){
                this._toggleSelectRow(arguments[i]);
            }
            this._checkIfSelectAll();
        },
        selectRow:function(){
            for(var i = 0 , len = arguments.length ; i < len ; i++){
                this._toggleSelectRow(arguments[i],1);
            }
            this._checkIfSelectAll();
        },
        deselectRow:function(){
            for(var i = 0 , len = arguments.length ; i < len ; i++){
                this._toggleSelectRow(arguments[i],0);
            }
            this._checkIfSelectAll();
        },
        selectAll:function(){
            for(var i = 0 , len = this.rowElArr.length ; i < len ; i++){
                this._toggleSelectRow(i,1);
            }
            this._checkIfSelectAll();
        },
        deselectAll:function(){
            for(var i = 0 , len = this.rowElArr.length ; i < len ; i++){
                this._toggleSelectRow(i,0);
            }
            this._checkIfSelectAll();
        },
        selectInverse:function(){
            for(var i = 0 , len = this.rowElArr.length ; i < len ; i++){
                this._toggleSelectRow(this.rowElArr[i]);
            }
            this._checkIfSelectAll();
        },
        /**
         * ��ȡѡ�е��л���record
         * @param returnBy Ĭ��'record'����ѡ'index'
         */
        _getSelected:function(returnBy){
            var selected = [];
            for( var  i = 0 , len = this.rowElArr.length ; i < len ; i++ ){
                if( YDOM.hasClass( this.rowElArr[i] , CLS_ROW_SELECTED ) ){
                    if(returnBy == 'index'){
                        selected.push( i );
                    }else{
                        selected.push( this.listData[i] );
                    }
                }
            }
            if( selected.length ==  0 ){
                return null;
            }else{
                return selected;
            }
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
         * ����������
         */
        _activateRowSort:function(){
            var sortTrigger  = this.sortTrigger;
            YEvent.on(sortTrigger, 'click', function(e){
                var t = YEvent.getTarget(e);
                var sortBy;
                var sortType;
                if( t.nodeName.toLowerCase() != 'th' ) t = YDOM.getAncestorByClassName( t,  CLS_SORTABLE);
                //��ȡ�����ֶ�
                sortBy = t.getAttribute( ATTR_SORT_FIELD );
                //����������� �� ���õ�ǰ���򴥵����ʽ
                if( YDOM.hasClass( t , CLS_SORT_ASC ) ){
                    sortType = DES;
                    YDOM.removeClass( t, CLS_SORT_ASC);
                    YDOM.addClass( t, CLS_SORT_DES);
                //���Ŀǰ�ǽ������л���Ŀǰ��������
                }else{
                    sortType = ASC;
                    YDOM.addClass( t, CLS_SORT_ASC);
                    YDOM.removeClass( t, CLS_SORT_DES);
                }
                //�޸�ǰһ�����򴥵����ʽ
                if( this.curSortTrigger && this.curSortTrigger != t ){
                    YDOM.removeClass( this.curSortTrigger, CLS_SORT_DES);
                    YDOM.removeClass( this.curSortTrigger, CLS_SORT_ASC);
                }
                this.curSortTrigger = t;
                var queryData = setQueryParamValue( this.latestQueryData,this.datasourceDef.sortBy, sortBy);
                queryData = setQueryParamValue( queryData,this.datasourceDef.sortType, sortType);
                this.update(queryData);
            }, this, true);
        },
        /**
         * ������ѡ����
         */
        _activateRowSelect:function(){
            var selectType = this.colSelectDef;
            if( selectType == COL_CHECKBOX ){
                YEvent.on(this.tableEl,'click',function(e){
                    var t = YEvent.getTarget(e);
                    if( (YDOM.hasClass( t , CLS_ICON_CHECKBOX) || t.nodeName.toLowerCase() == 'td') && YDOM.getAncestorByTagName( t , 'tbody' ) ){
                        var row = YDOM.getAncestorByClassName( t , CLS_ROW ) || YDOM.getAncestorByClassName( t , CLS_ROW_EXTRA );
                        this.toggleSelectRow( row.getAttribute( ATTR_ROW_IDX ));
                    }else if( t == this.selectAllTrigger){
                        var theadRow = this.theadEl.getElementsByTagName('tr')[0];
                        if( YDOM.hasClass( theadRow , CLS_ROW_SELECTED ) ){
                            this.deselectAll();
                        }else{
                            this.selectAll();
                        }
                    }
                },this,true);
            }else if( selectType == COL_RADIO ){
                var curSelectedIdx;
                YEvent.on(this.tableEl,'click',function(e){
                    var t = YEvent.getTarget(e);
                    if( (YDOM.hasClass( t , CLS_ICON_RADIO) || t.nodeName.toLowerCase() == 'td') && YDOM.getAncestorByTagName( t , 'tbody' )){
                        var row = YDOM.getAncestorByClassName( t , CLS_ROW ) || YDOM.getAncestorByClassName( t , CLS_ROW_EXTRA );
                        if( curSelectedIdx != undefined ) this.deselectRow(curSelectedIdx);
                        curSelectedIdx = row.getAttribute( ATTR_ROW_IDX );
                        this.selectRow( curSelectedIdx );
                    }
                },this,true);
            }
        },
        /**
         * ������չ�й���
         */
        _activateRowExpand:function(){
            YEvent.on(this.tableEl,'click',function(e){
                var t = YEvent.getTarget(e);
                if( YDOM.hasClass( t , CLS_ICON_EXPAND ) ){
                    var row = YDOM.getAncestorByClassName( t , CLS_ROW );
                    var nextSibling = YDOM.getNextSibling( row );
                    //���row������Ԫ�أ���������Ԫ�ز�����չ��
                    if( !nextSibling || !YDOM.hasClass( nextSibling , CLS_ROW_EXTRA ) ){
                        var idx = row.getAttribute( ATTR_ROW_IDX );
                        var rowExtra = this._renderRowExtra( this.listData[idx] );
                            rowExtra.setAttribute( ATTR_ROW_IDX , idx );
                        if(YDOM.hasClass( row , CLS_ROW_SELECTED )) YDOM.addClass( rowExtra, CLS_ROW_SELECTED );
                        YDOM.insertAfter( rowExtra , row );
                    }else{
                        var rowExtra = nextSibling;
                    }
                    DOM.toggleClass( row , CLS_ROW_EXPANDED );
                    DOM.toggleClass( rowExtra , CLS_ROW_EXPANDED );
                }
            },this,true);
        }
    });

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

    function show(){
        for( var i = 0 ,len = arguments.length ; i < len ; i++ ){
            arguments[i].style.display='';
        }
    }
    function hide(el){
        for( var i = 0 ,len = arguments.length ; i < len ; i++ ){
            arguments[i].style.display='none';
        }
    }

    S.DataGrid = DataGrid;
});
