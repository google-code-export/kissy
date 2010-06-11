/**
 * DataGrid Operate
 * @creator     ����<fool2fish@gmail.com>
 * @depends     kissy-core, yui2-yahoo-dom-event, yui2-connection
 */

KISSY.add("datagrid-operate", function(S) {

    var DOM = S.DOM, Event = S.Event, YDOM = YAHOO.util.Dom,
        doc = document,

        DataGrid = S.DataGrid,
        create = DataGrid.create,

        //�����е�����
        COL_CHECKBOX = 'COL_CHECKBOX', COL_RADIO = 'COL_RADIO', COL_EXTRA = 'COL_EXTRA',

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
        ATTR_ROW_IDX = 'data-list-idx',ATTR_CELL_IDX = 'data-cell-idx', ATTR_SORT_FIELD = 'data-sort-field',

        //����ʽ
        DESC = 'desc', ASC = 'asc';

    S.augment(S.DataGrid,{
        
        /**************************************************************************************************************
         * ����ʱ���̶���ͷ����
         *************************************************************************************************************/
        _activateFixThead:function(){
            var scrollState = 0,
                self = this,
                container = self.container,
                table = self._tableEl,
                thead = self._theadEl,
                proxy = create('<table class="ks-datagrid-proxy ks-datagrid"></table>');
            
            S.ready(function() {
                doc.body.appendChild(proxy);
            });

            if(!self._defColWidth) self._setColWidth();

            Event.on(window,'scroll',function(){
                var theadHeight = thead.offsetHeight,
                    tWidth = container.offsetWidth,
                    tHeight = container.offsetHeight,
                    tLeft =  YDOM.getX(container),
                    tTop =  YDOM.getY(container),
                    scrollTop = YDOM.getDocumentScrollTop();
                if(scrollTop<tTop){
                    if(scrollState){
                        table.style.paddingTop = 0;
                        table.appendChild(thead);
                    }
                    scrollState = 0;                    
                }else if( scrollTop > tTop+tHeight-theadHeight){
                    if(scrollState != 3){
                        proxy.style.top = '-400px';
                    }
                    scrollState = 3;
                }else{
                    if(!scrollState){
                        table.style.paddingTop = theadHeight + 'px';
                        proxy.appendChild(thead);
                    }
                    if(scrollState!=2){
                        proxy.style.top='0px';
                        proxy.style.left = tLeft+'px';
                        proxy.style.width = tWidth+'px';
                    }
                    if(S.UA.ie===6){
                        proxy.style.top = scrollTop+'px';
                    }
                    scrollState = 2;
                }                                                                                    
            });

            Event.on(window,'resize',function(){
                proxy.style.width = container.offsetWidth+'px';                
            });
        },

        /**
         * ��Ⱦ��������û�����ݣ���Ϊ��Ⱦ����ͷ��,��ȡÿ�е�ʵ�ʿ�Ȳ���ֵ
         */
        _setColWidth:function(){
            var self = this ,
                colArr = self._colgroupEl.getElementsByTagName('col'),
                thArr = self._theadEl.getElementsByTagName('th');
            for(var i=0,len=colArr.length;i<len;i++){
                if(!colArr[i].width) colArr[i].width = colArr[i].offsetWidth;
            }
            for(var j=0,len2=thArr.length;j<len2;j++){
                if((!thArr[j].width) && (thArr[j].className.indexOf(CLS_CELL_EXTRA)<0)) thArr[j].width = thArr[j].offsetWidth;
            }

        },

        /**************************************************************************************************************
         * ��������ѡ���к���չ�й���
         *************************************************************************************************************/
        
        //����������
        _activateRowSort:function(){
            var self = this , sortTrigger = self._sortTrigger;
            Event.on(sortTrigger, 'click', function(e){
                if( !self._listData || self._listData.length == 0 ) return;
                var t = this;
                var sortBy = t.getAttribute( ATTR_SORT_FIELD );;
                var sortType;
                //����������� �� ���õ�ǰ���򴥵����ʽ
                if( DOM.hasClass( t , CLS_SORT_ASC ) ){
                    sortType = DESC;
                    DOM.removeClass( t, CLS_SORT_ASC);
                    DOM.addClass( t, CLS_SORT_DESC);
                //���Ŀǰ�ǽ������л���Ŀǰ��������
                }else{
                    sortType = ASC;
                    DOM.addClass( t, CLS_SORT_ASC);
                    DOM.removeClass( t, CLS_SORT_DESC);
                }
                //�޸�ǰһ�����򴥵����ʽ
                if( self._curSortTrigger && self._curSortTrigger != t ){
                    DOM.removeClass( self._curSortTrigger, CLS_SORT_DESC);
                    DOM.removeClass( self._curSortTrigger, CLS_SORT_ASC);
                }
                self._curSortTrigger = t;
                var queryData = DataGrid.setQueryParamValue( self._latestQueryData,self.datasourceDef.sortBy, sortBy);
                queryData = DataGrid.setQueryParamValue( queryData,self.datasourceDef.sortType, sortType);
                self.update(queryData);
            });
        },

        //������ѡ����
        _activateRowSelect:function(){
            var self = this ,selectDef=self._colSelectDef, selectType = selectDef.xType, curSelectedIdx;
            function getRow(t){
                var tc = t.className,p=t.parentNode,pc=p.className;
                //���tΪ��ѡ/��ѡ��ťicon
                if( p.nodeName.toLowerCase()=='td'&&(tc.indexOf(CLS_ICON_CHECKBOX)+1 || tc.indexOf(CLS_ICON_RADIO)+1)){
                    return p.parentNode;
                //����Ϊtd
                }else if(pc.indexOf(CLS_ROW)+1 || pc.indexOf(CLS_ROW_EXTRA)+1){
                    return p;
                }else{
                    return null;
                }
            }

            Event.on(self._tableEl,'click',function(e){
                var t=e.target, row = getRow(t);
                if(!row) return;
                if(selectType == COL_CHECKBOX){
                    self.toggleSelectRow( row.getAttribute( ATTR_ROW_IDX ));
                }else if(selectType == COL_RADIO){
                    if( curSelectedIdx != undefined ) self.deselectRow(curSelectedIdx);
                    curSelectedIdx = row.getAttribute( ATTR_ROW_IDX );
                    self.selectRow( curSelectedIdx );
                }
            });

            /**
             * ȫѡ/ȡ��ȫѡ
             * ���ڹ���ʱ����̶�ҳͷ����thead����ʱ��table��ȡ����������Ҫֱ�ӽ��¼�ע����ȫѡ������
             */
            if(self._selectAllTrigger){
                Event.on(self._selectAllTrigger,'click',function(){
                    if(!self._tbodyEl) return;
                    var theadRow = self._theadEl.getElementsByTagName('tr')[0];
                    if(DOM.hasClass(theadRow,CLS_ROW_SELECTED)){
                        self.deselectAll();
                    }else{
                        self.selectAll();
                    }
                });
            }

        },

        //������չ�й���
        _activateRowExpand:function(){
            var self = this;
            Event.on(self._tableEl,'click',function(e){
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
        }


        /**************************************************************************************************************
         * @��ɾ�Ĳ���
         *************************************************************************************************************/

        /*addRecord:function(){

        },
        modifyRecord:function(){

        },
        deleteRecord:function(){

        }*/
    });

});