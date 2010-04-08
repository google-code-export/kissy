/**
 * DataGrid
 * @creator     ����<fool2fish@gmail.com>
 * @depends     yahoo-dom-event, kissy-core
 */

/**
 * DataGrid���ܵ㣺
 * 1������Դ
 * 2�������ͷ
 * 3  ������
 * 4���û��Զ�����ʾ��
 * 5����ɾ��
 * 6��������������
 * 7��������������
 * 8����ѡ����ѡ��ȫѡ����ѡ����
 * 9���������˷�ҳ
 * 10��������������
 * 11����Ŀչ��
 * 12������ĳ�д���
 */

KISSY.add("datagrid", function(S) {
    var DOM = S.DOM, Event = S.Event,YDOM = YAHOO.util.Dom,
        doc=document,
        COL_CHECKBOX='col-checkbox',COL_RADIO='col-radio',COL_EXTRA='col-extra',
        KS_DEPTH='KSDepth',KS_FATHER_IDX='KSFatherIdx',KS_CHILDREN_AMOUNT='KSChildrenAmount',
        LOADING_EL_STR='<tbody><tr class="row row-loading"><td colspan="10"></td></tr></tbody>'
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
            this.tableEl.appendChild(this.loadingEl);
            this.loadingEl.style.display='none';
        this.datasource=datasourceUri;
        
        //ע�����е���¼�
        Event.add(this.tableEl,'click',function(e){

        });
    }

    S.mix(DataGrid.prototype,{
        /**
         * ����datasource��ָ��datasource����ֶε���;����δ���壬��ʹ��Ĭ��ֵ��
         * datasourceDef={
         *      success:'success',
         *      listData:'',
         *      recordPrimaryKey:'',
         *      dataStart:'',
         *      datalength:'',
         *      dataFilter:'',
         *      info:'info'
         * }
         */
        datasouceDef:null,
        /**
         * JSON��ʽ������Դ
         */
        liveData:null,
        /**
         * ����Դ�е��б�����
         */
        listData:null,
        /**
         * �����У�������Ⱦ����δ���壬����ȾdataList�������ֶΣ�
         * columnDef=[
         *      {label:'',xType:COL_EXPAND},
         *      {label:'',xType:COL_CHECKBOX},
         *      {label:'���ֿ�������',children:[
         *          {label:'��������',sortable:true,field:'index'},
         *          {label:'������',sortable:true,field:'age'}
         *      ]},
         *      {label:'�ֶ���Ⱦ',children:[
         *          {label:'��һ�ֶ�',field:'name'},
         *          {label:'�����ֶ�',field:['nickname','homepage'],render:funtion('nickname','homepage'){...}}
         *      ]},
         *      {label:'',xType:COL_EXTRA,field:[...],render:function(){...}}
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
        //��ʾloading��tbody
        loadingEl:null,
        //װ�����ݵ�tbody
        tbodyEl:null,
        //��β
        tfootEl:null,
        //��ҳ
        paginationEl:null,
        startLoading:function(){
            this.loadingEl.style.display='table-row';
        },
        endLoading:function(){
            this.loadingEl.style.display='none';
        },
        init:function(postData){
            this.startLoading();
            postData = postData || '';
            if(!this.columnDef){
                
            }
            var callback = function(flatColumnDef, colExtraDef, colSelectDef){
                this.theadColDef = flatColumnDef;
                this.colDef = flatColumnDef[flatColumnDef.length-1];
                this.colExtraDef = colExtraDef;
                this.colSelectDef = colSelectDef;
                this._renderThead();
                this._renderTbody();
                this._renderTfoot();
                this.endLoading();
            };
            parseColumnDefToFlat(this.columnDef,'children',callback,this);
        },
        _renderThead:function(){
            var theadColDef=this.theadColDef;
            var colgroupHTMLFrag = '<colgroup>';
            var theadHTMLFrag = '<thead>';
            var depth = theadColDef.length;
            for(var i = 0 , ilen = theadColDef.length ; i < ilen ; i++){
                theadHTMLFrag += '<tr class="row">';
                //��չ��ť��
                if( i == 0){
                    if(this.colExtraDef){
                       theadHTMLFrag += '<th class="col-extra" rowspan="' + ilen + '"></th>';
                    }
                    if(this.colSelectDef == COL_CHECKBOX){
                       theadHTMLFrag += '<th class="col-extra" rowspan="' + ilen + '"><i class="icon-checkbox"></i></th>';
                    }else if(this.colSelectDef == COL_RADIO){
                       theadHTMLFrag += '<th class="col-extra" rowspan="' + ilen + '"></th>';
                    }
                }
                for(var j = 0 , jlen = theadColDef[i].length ; j < jlen ; j++){
                    theadHTMLFrag += '<th';
                    //�������th
                    if(theadColDef[i][j][KS_CHILDREN_AMOUNT] == 0){
                        //������
                        if(theadColDef[i][j].xType){
                            colgroupHTMLFrag += '<col width="25" />';
                            theadHTMLFrag += ' class="col-extra"';
                        }else{
                            colgroupHTMLFrag += '<col />';
                            //����
                            if(theadColDef[i][j].sortable){
                                theadHTMLFrag += ' class="sortable"';
                            }
                        }
                        //rowspan
                        if(depth-1>i){
                            theadHTMLFrag += ' rowspan="' + (depth-i) + '"';
                        }
                    //�������th
                    }else{
                        theadHTMLFrag += ' colspan="' + theadColDef[i][j][KS_CHILDREN_AMOUNT] + '"';
                    }
                    theadHTMLFrag += '>';
                    //���ֱ�ǩ
                    theadHTMLFrag += theadColDef[i][j].label ? theadColDef[i][j].label : '';
                    if(theadColDef[i][j][KS_CHILDREN_AMOUNT] == 0){
                        //ȫѡ icon
                        theadHTMLFrag += ( theadColDef[i][j].xType == COL_CHECKBOX ) ? '<i class="icon-checkbox"></i>' : '';
                        //���� icon
                        theadHTMLFrag += theadColDef[i][j].sortable ? '<i class="icon"></i>' : '';
                    }                     
                    theadHTMLFrag += '</th>';
                }
                theadHTMLFrag += '</tr>';
            }
            colgroupHTMLFrag += '</colgroup>';
            theadHTMLFrag += '</thead>';
            if(this.colgroupEl) this.tableEl.removeChild(this.colgroupEl);
            if(this.theadEl) this.tableEl.removeChild(this.theadEl);
            this.colgroupEl = parseStrToEl(colgroupHTMLFrag);
            this.theadEl = parseStrToEl(theadHTMLFrag);
            this.tableEl.appendChild(this.colgroupEl);
            this.tableEl.appendChild(this.theadEl);
            this.columnAmount=this.colgroupEl.getElementsByTagName('col').length;
        },
        _renderTbody:function(){
            var listData = this.listData;
            var tbodyHTMLFrag = '<tbody>';
            for(var i = 0 , len = listData.length ; i < len ; i++){
                 tbodyHTMLFrag += this._renderRow(listData[i],i);   
            }
            tbodyHTMLFrag += '</tbody>';
            if(this.tbodyEl) this.tableEl.removeChild(this.tbodyEl);
            this.tbodyEl = parseStrToEl(tbodyHTMLFrag);
            this.tableEl.appendChild(this.tbodyEl);
        },
        /**
         * ��Ⱦ��������
         * @param {Object} recordData ��������
         * @param {Boolean} [returnType] �������ͣ����Ϊ1�Ļ�����domԪ�أ����Ϊ0�򷵻�ƴ�Ӻõ�HTMLƬ��
         * @param {String} [rowCls] ���Զ���ӵ�tr�ϵ�class��������������ʾ��������(Ŀǰ�޶������)
         */
        _renderRow:function(recordData, idx, returnType, rowCls){
            var colDef = this.colDef;
            var rowHTMLFrag = '<tr class="row' + (rowCls ? ' ' + rowCls : '') + '"' + (idx ? 'data-idx="' + idx + '"' : '') + '>';
            //��չ��ť
            if(this.colExtraDef) rowHTMLFrag += '<td class="col-extra"><i class="icon-expand"></i></td>';
            //��ѡ���ߵ�ѡ��ť
            if(this.colSelectDef == COL_CHECKBOX){
                 rowHTMLFrag += '<td class="col-extra"><i class="icon-checkbox"></i></td>';
            }else if(this.colSelectDef == COL_RADIO){
                 rowHTMLFrag += '<td class="col-extra"><i class="icon-radio"></i></td>';
            }
            for(var i = 0 , ilen = this.colDef.length ; i < ilen ; i++){
                rowHTMLFrag += '<td>';
                if(typeof colDef[i].field != 'undefined'){
                    //���ֶ�
                    if( typeof colDef[i].field == 'string'){
                        var fieldValue = recordData[colDef[i].field];
                        //��Ҫ������Ⱦ��
                        if(colDef[i].render){
                            rowHTMLFrag += colDef[i].render(fieldValue);
                        //����Ҫ������Ⱦ��
                        }else{
                            rowHTMLFrag += fieldValue;
                        }
                    //�����ֶ�
                    }else if(S.isArray(colDef[i].field)){
                        var fieldValueArr=[];
                        for(var j = 0 , jlen = colDef[i].field.length ; j < jlen ; i++){
                            fieldValueArr.push(recordData[colDef[i].field[j]]);
                        }
                        //��Ҫ������Ⱦ��
                        if(colDef[i].render){
                           rowHTMLFrag += colDef[i].render.apply(window,fieldValueArr);
                        //����Ҫ������Ⱦ��
                        }else{
                            rowHTMLFrag += fieldValueArr.toString();
                        }
                    };
                }else{
                    rowHTMLFrag += ' ';
                }
                rowHTMLFrag += '</td>';
            }
            rowHTMLFrag += '</tr>';
            if(returnType){
                return parseStrToEl(rowHTMLFrag);
            }else{
                return rowHTMLFrag;
            }
        },
        _renderRowExtra:function(){

        },
        _renderTfoot:function(){
            var tfootHTMLFrag='<tfoot><tr><td colspan="' + this.columnAmount + '"></td></tr></tfoot>';
            if(this.tfootEl) this.tableEl.removeChild(this.tfootEl);
            this.tfootEl = parseStrToEl(tfootHTMLFrag);
            this.tfootEl.appendChild(this.tbodyEl);
        },
        update:function(){

        },
        renderPagination:function(){},
        appendRecord:function(){},
        addRecord:function(record){},
        modifyRecord:function(record){},
        deleteRecord:function(recordIdx){},
        moveRecord:function(recordIdx,toIndex){},
        select:function(recordIdx){},
        selectAll:function(){},
        deselectAll:function(){},
        selectInverse:function(){},
        getSelectedRecord:function(){}
    });

    DataGrid.Config={
        
    };

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
            YDOM.insertBefore(newEl,refEl)
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
            alert('your html string is illegal.');
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
     * @param columnDef
     */
    function parseColumnDefToFlat(columnDef,childrenKey,callback,callbackObj){
        childrenKey = childrenKey || 'children';
        //����ת����Ķ�ά����
        var flatColumnDef=[];
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
                var fatherTree = flatColumnDef[curDepth-1][curTree[KS_FATHER_IDX]];
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
            flatColumnDef[depth-1] = [];            
            for(var i = 0,ilen = tree.length; i < ilen; i++){
                //��¼tree[i]���������鱾�������
                tree[i][KS_DEPTH] = depth-1;
                //��tree[i]��ӵ�flatColumnDef[depth-1]������ȥ
                flatColumnDef[depth-1].push(tree[i]);
                //���tree�Ľڵ���������tree[i]������
                if(treeHasChildren && tree[i][childrenKey]){
                    //��¼tree[i]����Ԫ����
                    tree[i][KS_CHILDREN_AMOUNT]=tree[i][childrenKey].length;
                    for(var j=0,jlen=tree[i][childrenKey].length;j<jlen;j++){
                        //��tree[i]�ӽڵ��м�¼tree[i]���ڶ�ά�����������
                        tree[i][childrenKey][j][KS_FATHER_IDX]=i;
                        //������ͬһ�㼶��tree[i]�ӽڵ�ŵ�һ������
                        subTree.push(tree[i][childrenKey][j]);
                    }
                    updateFathersChildrenAmount(tree[i]);
                //���������
                }else{
                    tree[i][KS_CHILDREN_AMOUNT]=0;
                }
            }
            depth++;
            if(subTree.length>0){
                arguments.callee(subTree);
            }else{
                callback.call(callbackObj || window , flatColumnDef, colExtraDef, colSelectDef);
                //console.log(flatColumnDef);
                //console.log(colExtraDef);
                //console.log(colSelectDef);
            }
        }
        parse(pureColDef);
    }
    
    var test=[
       {label:'��ѡ��',xType:COL_CHECKBOX},
       {label:'����'},
       {label:'��������',children:[
           {label:'������',sortable:true},
           {label:'������',sortable:true},
       ]},
       {label:'���㸴����',children:[
           {label:'��һ��',children:[
               {label:'����1'},
               {label:'����2'},
           ]},
           {label:'�ڶ���',sortable:true,field:'age'},
       ]},
       {label:'��չ��',xType:COL_EXTRA}
    ];
    parseColumnDefToFlat(test,null,function(){});

    S.DataGrid = DataGrid;
});
