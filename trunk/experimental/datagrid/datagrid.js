/**
 * DataGrid
 * @creator     沉鱼<fool2fish@gmail.com>
 * @depends     kissy-core, yui2-yahoo-dom-event, yui2-connection
 */

/**
 * DataGrid功能点：
 * 1、数据源
 * 2、定义表头、解析表头(完成)
 * 3  定义列、解析列(完成)
 * 4、用户自定义显示列
 * 5、增删改
 * 6、其他单条操作
 * 7、其他批量操作
 * 8、单选、多选、全选、反选功能
 * 9、服务器端翻页
 * 10、服务器端排序
 * 11、条目展开
 * 12、高亮某行代码
 */

KISSY.add("datagrid", function(S) {
    var DOM = S.DOM, Event = S.Event, YDOM = YAHOO.util.Dom, YEvent= YAHOO.util.Event, YConnect=YAHOO.util.Connect,
        doc=document,
        //定义特殊列的类型
        COL_CHECKBOX = 'COL_CHECKBOX', COL_RADIO = 'COL_RADIO', COL_EXTRA = 'COL_EXTRA',
        //定义解析columnDef时要用到的三个内部属性
        KS_DEPTH = 'KSDepth', KS_FATHER_IDX='KSFatherIdx', KS_CHILDREN_AMOUNT='KSChildrenAmount',
        //loading的html片段 
        LOADING_EL_STR = '<tbody><tr class="row row-loading"><td></td></tr></tbody>',
        //请求方式
        POST = 'post',GET = 'get',
        //行class
        CLS_ROW = 'row', CLS_ROW_EXTRA = 'row-extra', CLS_ROW_SELECTED = 'row-selected', CLS_ROW_EXPANDED = 'row-expanded',
        ATTR_ROW_IDX = 'data-idx',
        //单元格class
        CLS_CELL_CHECKBOX = 'cell-checkbox', CLS_CELL_RADIO = 'cell-radio', CLS_CELL_EXTRA = 'cell-extra',
        //排序class
        CLS_SORTABLE = 'sortable', CLS_SORT_DES = 'sort-des', CLS_SORT_ASC = 'sort-asc',
        //特殊icon的class
        CLS_ICON_EXPAND = 'icon-expand', CLS_ICON_CHECKBOX = 'icon-checkbox', CLS_ICON_RADIO = 'icon-radio',
        //单击选择某列时，例外的元素
        TAG_NAME_EXCEPTION = ' a input button select option textarea '
        ;

    /**
     * DataGrid
     * @constructor
     */
    function DataGrid(container,datasourceUri){
        //设置容器
        this.container = S.get(container);
            DOM.addClass(this.container,'ks-datagrid');
        //生成表格元素
        this.tableEl=doc.createElement('table');
            this.container.appendChild(this.tableEl);
            DOM.addClass(this.tableEl,'datagrid-table');
        //生成loading元素
        this.loadingEl=parseStrToEl(LOADING_EL_STR);
        //记录数据源uri
        this.datasourceUri=datasourceUri;
    }

    S.mix(DataGrid.prototype,{
        connectMethod:POST,
        /**
         * 定义datasource，指定datasource里各字段的用途(必须手工定义)
         * datasourceDef={
         *      success:'success',
         *      listData:'dataList',
         *      recordPrimaryKey:'id',
         *      dataStart:'start',
         *      datalength:'pageSize',
         *      dataAmount:'total'
         *      info:'info'
         * }
         */
        datasourceDef:null,
        /**
         * 记录最近一次查询类请求发送的数据
         */
        queryData:null,
        /**
         * JSON格式的数据源
         */
        liveData:null,
        /**
         * 数据源中的列表数据
         */
        listData:null,
        /**
         * 定义列，用于渲染（若未定义，则渲染dataList中所有字段）
         * columnDef=[
         *      {label:'',xType:COL_EXPAND},
         *      {label:'',xType:COL_CHECKBOX},
         *      {label:'各种可排序列',children:[
         *          {label:'可排序列',sortable:true,field:'index'},
         *          {label:'升序列',sortable:true,field:'age'}
         *      ]},
         *      {label:'字段渲染',children:[
         *          {label:'单一字段',field:'name'},
         *          {label:'复合字段',field:['nickname','homepage'],parser:funtion('nickname','homepage'){...}}
         *      ]},
         *      {label:'',xType:COL_EXTRA,field:[...],parser:function(){...}}
         * ]
         */
        columnDef:null,
        //总列数
        columnAmount:null,
        //解析columnDef后得到的表头列定义
        theadColDef:null,
        //解析columnDef后得到的表身普通列定义
        colDef:null,
        //解析columnDef后得到的表身扩展列定义
        colExtraDef:null,
        //解析columnDef后得到的选择列定义
        colSelectDef:null,
        /**
         * 定义字段，用于修改（若未定义，则所有字段都以填写输入框的形式修改）
         * fieldDef={
         *      index:{},
         *      realname:{},
         *      nickname:{},
         *      pagename:{},
         *      pageurl:{}
         * }
         */
        fieldDef:null,
        //表格
        tableEl:null,
        //colgroup元素
        colgroupEl:null,
        //表头
        theadEl:null,
        //触发全选的元素
        selectAllTrigger:null,
        //显示loading的tbody
        loadingEl:null,
        //装载数据的tbody
        tbodyEl:null,
        //标准列数组对象
        rowElArr:null,
        //表尾
        tfootEl:null,
        //翻页
        paginationEl:null,
        startLoading:function(){
            if(this.columnAmount){
                var loadingTd = this.loadingEl.getElementsByTagName('td')[0];
                loadingTd.colSpan = this.columnAmount;
            }
            //notice：没有把loadingEl加到tableEl中，采用diaplay:none的方式来切换loading框的显示，是因为ie下使用js去display:none loadingEl会有点问题：高度无法消除，下边框线一直可见
            if(YDOM.getFirstChild(this.tableEl)){
                var firstChild = YDOM.getFirstChild(this.tableEl);
                YDOM.insertBefore(this.loadingEl, firstChild);
            }else{
                this.tableEl.appendChild(this.loadingEl);
            }
        },
        endLoading:function(){
            this.tableEl.removeChild(this.loadingEl);
        },
        /**
         * 每次异步请求返回值的基本处理
         * @param o
         */
        _dataPreProcessor:function(o){
            try{
                this.liveData = eval('('+o.responseText+')');
            }catch(e){
                alert('错误：请返回JSON格式的数据。');
                return;
            }
            this.requestResult = this.liveData[this.datasourceDef.success];
            if(this.requestResult){
                this.listData = this.liveData[this.datasourceDef.listData];
            }else{
                var info = this.liveData[this.datasourceDef.info];
                alert('错误：'+info);
            }
        },
        /**
         * 每次解析完columnDef之后的基本处理
         */
        _parseColumnDefPreProcessor:function(theadColDef, colDef, colExtraDef, colSelectDef){
            this.theadColDef =theadColDef;
            this.colDef = colDef;
            this.colExtraDef = colExtraDef;
            this.colSelectDef = colSelectDef;
        },
        init:function(postData){
            //确认datasourceDef定义过
            if(!this.datasourceDef){
                alert('请先定义组件的datasourceDef属性。');
                return;
            }
            //显示loading状态
            this.startLoading();
            var callback={
                success:function(o){
                    this._dataPreProcessor(o);
                    //如果请求成功，且返回数据正确
                    if(this.requestResult){
                        //如果columnDef没有定义
                        if(!this.columnDef){
                            this.columnDef=[];
                            var recordExample = this.listData[0];
                            for(var i in recordExample){
                                this.columnDef.push({label:i,field:i});
                            }
                        }
                        //解析columnDef，并设置回调（回调套回调，真bt啊）
                        parseColumnDefToFlat(this.columnDef,'children',function(theadColDef, colDef, colExtraDef, colSelectDef){
                            this._parseColumnDefPreProcessor(theadColDef, colDef, colExtraDef, colSelectDef);
                            
                            this._renderThead();
                            //渲染表头后，表格的列数确定，要重新渲染一次loading
                            this.startLoading();
                            this._renderTbody();
                            this._renderTfoot();
                            this.endLoading();
                            //激活扩展功能
                            if(colExtraDef) this._activateRowExpand();
                            //选择行功能
                            if(colSelectDef) this._activateRowSelect(colSelectDef);
                        },this);
                    }
                },
                failure:function(){alert('获取数据失败，请刷新页面重试或联系管理员。');},
                scope:this
            };
            YConnect.asyncRequest(this.connectMethod,this.datasourceUri,callback,postData || '');
        },
        /**
         * 渲染普通th
         * @param cellDef
         */
        _renderTheadCell:function(cellDef){
            var cell = doc.createElement('th');
            //如果无子th
            if(cellDef[KS_CHILDREN_AMOUNT] == 0){
                //特殊列
                if(cellDef.xType){
                    cell.className = CLS_CELL_EXTRA;
                    //全选
                    if(cellDef.xType == COL_CHECKBOX){
                        cell.innerHTML = '<i class="' + CLS_ICON_CHECKBOX + '"></i>';
                    }

                //排序
                }else if(cellDef.sortable){
                    cell.className = CLS_SORTABLE;
                    cell.innerHTML = '<i class="icon"></i>';
                }
            //如果有子th
            }else{
                cell.colSpan = cellDef[KS_CHILDREN_AMOUNT];
            }
            //文字标签
            if(cellDef.label) cell.innerHTML = cellDef.label + cell.innerHTML;
            return cell;
        },
        /**
         * 渲染扩展按钮列的th
         */
        _renderTheadCellExpand:function(){
            var cell = doc.createElement('th');
                cell.className = CLS_CELL_EXTRA;
            return cell;
        },
        /**
         * 渲染选择列的th
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
         * 渲染表头
         */
        _renderThead:function(){
            var theadColDef=this.theadColDef;
            var colgroupEl = doc.createElement('colgroup');
            var theadEl = doc.createElement('thead');
            var depth = theadColDef.length;
            for(var i = 0 , ilen = theadColDef.length ; i < ilen ; i++){
                var row = doc.createElement('tr');
                    row.className = 'row';
                //扩展按钮列
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
                //普通列
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
         * 渲染普通单元格
         * @param cellDef 单元格设定
         * @param recordData 单条数据
         */
        _renderCell:function(cellDef,recordData){
            var cell = doc.createElement('td');
            //如果指定了字段
            if(typeof cellDef.field != 'undefined'){
                //如果是单字段
                if(typeof cellDef.field == 'string'){
                    var fieldValue = recordData[cellDef.field];
                    //如果有渲染器
                    if(cellDef.parser){
                        cell.innerHTML = cellDef.parser(fieldValue);
                    //如果无渲染器
                    }else{
                        cell.innerHTML = fieldValue;
                    }
                //如果是复合字段
                }else if(S.isArray(cellDef.field)){
                    var fieldValueArr=[];
                    for(var i = 0 , len = cellDef.field.length ; i<len ; i++){
                        fieldValueArr.push(recordData[cellDef.field[i]]);
                    }
                    //如果有渲染器
                    if(cellDef.parser){
                        cell.innerHTML = cellDef.parser.apply(window,fieldValueArr);
                    //如果无渲染器
                    }else{
                        cell.innerHTML = fieldValueArr.join(' ');
                    }
                }
            //如果没指定字段
            }else{
                //如果有渲染器
                if(cellDef.parser){
                    cell.innerHTML = cellDef.parser();
                //如果无渲染器
                }else{
                    cell.innerHTML = '';
                }
            }
            return cell;
        },
        /**
         * 渲染展开按钮单元格
         */
        _renderCellExpand:function(){
            var cell = doc.createElement('td');
            cell.className = CLS_CELL_EXTRA;
            cell.innerHTML = '<i class="' + CLS_ICON_EXPAND + '"></i>';
            return cell;
        },
        /**
         * 渲染选择单元格
         * @param selectType 选择类型 接受 COL_CHECKBOX 活 COL_RADIO 两个参数值
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
         * 渲染行
         * @param recordData 单条数据
         */
        _renderRow:function(recordData){
            var colDef = this.colDef;
            var row = doc.createElement('tr');
             row.className = CLS_ROW ;
            //扩展按钮
            if(this.colExtraDef) row.appendChild(this._renderCellExpand());
            //复选或者单选按钮
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
            }
            if(this.tbodyEl) this.tableEl.removeChild(this.tbodyEl);
            this.tbodyEl = tbodyEl;
            this.tableEl.appendChild(this.tbodyEl);
        },
        _renderTfoot:function(){
            var tfootHTMLFrag='<tfoot><tr><td colspan="' + this.columnAmount + '"></td></tr></tfoot>';
            if(this.tfootEl) this.tableEl.removeChild(this.tfootEl);
            this.tfootEl = parseStrToEl(tfootHTMLFrag);
            this.tableEl.appendChild(this.tfootEl);
        },
        update:function(){

        },
        renderPagination:function(){},
        appendRecord:function(){},
        addRecord:function(){},
        modifyRecord:function(){},
        deleteRecord:function(){},
        moveRecord:function(){},
        /**
         * 将指定索引的行显示为指定的选中状态
         * @param idx 要切换选中状态的行在listData中的索引号
         * @param selectType 1为选中，0为取消选中，不填则为自动切换
         */
        _toggleSelectRow:function(idx,selectType){
            var row = this.rowElArr[idx];
            var nextSibling = YDOM.getNextSibling( row );
            if( nextSibling && YDOM.hasClass( nextSibling , CLS_ROW_EXTRA )) var rowExtra = nextSibling;
            if(typeof selectType == 'undefined'){
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
        getSelectedRecord:function(){},
        _activateRowSelect:function(selectType){
            if( selectType == COL_CHECKBOX ){
                YEvent.on(this.tableEl,'click',function(e){
                    var t = YEvent.getTarget(e);
                    if( (YDOM.hasClass( t , CLS_ICON_CHECKBOX) || t.nodeName.toLowerCase() == 'td') && YDOM.getAncestorByTagName( t , 'tbody' ) ){
                        var row = YDOM.getAncestorByClassName( t , CLS_ROW ) || YDOM.getAncestorByClassName( t , CLS_ROW_EXTRA );
                        this.toggleSelectRow( row.getAttribute(ATTR_ROW_IDX ));
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
                alert('沉鱼还没有写好单选行的功能…');    
            }
        },
        _activateRowExpand:function(){
            YEvent.on(this.tableEl,'click',function(e){
                var t = YEvent.getTarget(e);
                if( YDOM.hasClass( t , CLS_ICON_EXPAND ) ){
                    var row = YDOM.getAncestorByClassName( t , CLS_ROW );
                    var nextSibling = YDOM.getNextSibling( row );
                    //如果row无相邻元素，或者相邻元素不是扩展列
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

    DataGrid.Config={
        
    };

    /**
     * 替换元素
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
     * 获取一段HTML字符串前导标签的标签名
     * @param str
     */
    function getLeadingTagName(str){
        var m = str.match(/^\s*<(\w+)/);
        if(m){
            return m[1].toLowerCase();
        }else{
            alert('your html string is illegal.');
            return null;
        }
    }

    /**
     * 将一段HTML字符串转换成DOM元素，并返回该元素（要求有且仅有一个最高层级元素）
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
        当使用文档碎片时，返回的对象会指向该文档碎片，而不是里面真正的元素，故暂只考虑一个最高层元素的情况
        var docFragment=doc.createDocumentFragment();
        while(YDOM.getFirstChild(wrapper)){
            docFragment.appendChild(YDOM.getFirstChild(wrapper));    
        }
        */
        return YDOM.getFirstChild(wrapper);
    }

    /**
     * 将columnDef的树形结构展开成二维数组结构
     * @param columnDef 表格的列设定
     * @param childrenKey 指向子列的key
     * @param callback 解析后的回调函数
     * @param callbackObj 回调函数中的this指向的对象
     */
    function parseColumnDefToFlat(columnDef,childrenKey,callback,callbackObj){
        childrenKey = childrenKey || 'children';
        //解析后的表头定义
        var theadColDef = [];
        //解析后的列定义
        var colDef = [];
        //额外列定义
        var colExtraDef = null;
        //定义选择列的方式
        var colSelectDef = null;
        //定义树深度
        var depth=1;

        //过滤列定义中的特殊列设定，要求特殊列设定全部要在最高层级设置
        function filterColDef(columnDef){
            var colDef=[];
            for( var i = 0 , len = columnDef.length ; i < len ; i++){
                //如果是扩展按钮列
                if(columnDef[i].xType == COL_EXTRA){
                    colExtraDef = columnDef[i];
                //如果是复选框列
                }else if(columnDef[i].xType == COL_CHECKBOX){
                    colSelectDef = COL_CHECKBOX;
                //如果是单选框列
                }else if(columnDef[i].xType == COL_RADIO){
                    colSelectDef = COL_RADIO;
                }else{
                    colDef.push(columnDef[i]);
                }
            }
            return colDef;
        }
        //得到过滤掉特殊列设定的列设定
        var pureColDef = filterColDef(columnDef);


        //判断tree是否有子树
        function ifTreeHasChildren(tree){
            for(var i = 0, len = tree.length; i < len; i++){
                if(tree[i][childrenKey] && tree[i][childrenKey].length>0){
                    return true;
                }
            }
            return false;
        }

        //更新当前节点所有父节点的childrenAmount值（子节点数）
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

        //转换树
        function parse(tree){
            //判定子树情况
            var treeHasChildren = ifTreeHasChildren(tree);
            //定义子树
            var subTree = [];
            theadColDef[depth-1] = [];
            for(var i = 0,ilen = tree.length; i < ilen; i++){
                /* 如果tree[i][KS_DEPTH]不存在，则记录tree[i]的真正深度
                 * 这里要做判定是因为如果在当前层级的tree有子节点的情况下
                 * tree[i]刚好没有子节点了，那么，会把tree[i]当做tree[i]下一层级的子节点
                 * 这样的话，确保得到的theadDef的最后一个元素（数组）为colDef
                 */
                if(typeof tree[i][KS_DEPTH] == 'undefined') tree[i][KS_DEPTH] = depth-1;
                //jitree[i]添加到theadColDef[depth-1]数组中去
                theadColDef[depth-1].push(tree[i]);
                //如果tree有子树且tree[i]有子树
                if(treeHasChildren){
                    if(tree[i][childrenKey]){
                        //记录tree[i]的子元素数
                        tree[i][KS_CHILDREN_AMOUNT]=tree[i][childrenKey].length;
                        for(var j=0,jlen=tree[i][childrenKey].length;j<jlen;j++){
                            //在tree[i]子节点中记录tree[i]所在二维子数组的索引
                            tree[i][childrenKey][j][KS_FATHER_IDX]=i;
                            //将所有同一层级的tree[i]子节点放到一个数组
                            subTree.push(tree[i][childrenKey][j]);
                        }
                        updateFathersChildrenAmount(tree[i]);
                    }else{
                        tree[i][KS_CHILDREN_AMOUNT]=0;
                        subTree.push(tree[i]);
                    }
                //如果无子树
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
                //console.log(theadColDef);
                //console.log(colDef);
                //console.log(colExtraDef);
                //console.log(colSelectDef);
            }
        }
        parse(pureColDef);
    }

    S.DataGrid = DataGrid;
});
