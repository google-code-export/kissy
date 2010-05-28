/**
 * DataGrid Pagination
 * @creator     ����<fool2fish@gmail.com>
 * @depends     kissy-core, yui2-yahoo-dom-event, yui2-connection
 */

KISSY.add("datagrid-pagination", function(S) {

    var DOM = S.DOM, Event = S.Event, YDOM = YAHOO.util.Dom,
        DataGrid = S.DataGrid,
        create = DataGrid.create,
        CLS_PAGE_PREFIX = 'ks-pagination-';

    S.augment(S.DataGrid, {
        
        //��Ⱦ��ҳ
        _renderPagination:function() {
            var self = this;
            var paginationEl = create('<div class="ks-bar"></div>');
            var paginationBox = create('<div class="ks-pagination"></div>',paginationEl);
            var wrapperEl = create('<div class="' + CLS_PAGE_PREFIX + 'wrapper"></div>', paginationBox);
            self._pageInfoEl = create('<span class="' + CLS_PAGE_PREFIX + 'info"></span>',wrapperEl);
            self._pageStartEl = create('<a class="' + CLS_PAGE_PREFIX + 'start">��ҳ</a>',wrapperEl);
            self._pageStartDisabledEl = create('<span class="' + CLS_PAGE_PREFIX + 'start">��ҳ</span>', wrapperEl);
            self._pagePrevEl = create('<a class="' + CLS_PAGE_PREFIX + 'prev">��һҳ</a>', wrapperEl);
            self._pagePrevDisabledEl = create('<span class="' + CLS_PAGE_PREFIX + 'prev">��һҳ</span>', wrapperEl);
            self._curPageNumEl = create('<span class="' + CLS_PAGE_PREFIX + 'page">1</span>', wrapperEl);
            self._pageNumElArr = [];
            for (var i = 0 , len = self.paginationDef.pageNumLength; i < len; i++) {
                var pageNumEl = create('<a class="' + CLS_PAGE_PREFIX + 'page" ks-data-page-idx="'+i+'"></a>', wrapperEl);
                this._pageNumElArr.push(pageNumEl);
            }
            self._pageNextEl = create('<a class="' + CLS_PAGE_PREFIX + 'next">��һҳ</a>', wrapperEl);
            self._pageNextDisabledEl = create('<span class="' + CLS_PAGE_PREFIX + 'next">��һҳ</span>', wrapperEl);
            self._pageEndEl = create('<a class="' + CLS_PAGE_PREFIX + 'end">ĩҳ</a>', wrapperEl);
            self._pageEndDisabledEl = create('<span class="' + CLS_PAGE_PREFIX + 'end">ĩҳ</span>', wrapperEl);
            self._pageSkipEl = create('<span class="' + CLS_PAGE_PREFIX + 'skip">����<input type="text" class="' + CLS_PAGE_PREFIX + 'skip-to"/>ҳ<button type="button" class="' + CLS_PAGE_PREFIX + 'skip-button">ȷ��</button><span>', wrapperEl);
            self._pageSkipInputEl = self._pageSkipEl.getElementsByTagName('input')[0];
            self._pageSkipBtnEl = self._pageSkipEl.getElementsByTagName('button')[0];

            var curLimit = self.paginationDef.dataLimit, defaultOptionStr = '';
            if( (curLimit < 100) && curLimit%20) defaultOptionStr='<option value="'+curLimit+'">'+curLimit+'</option>';
            
            self._dataLimitEl = create('<span class="' + CLS_PAGE_PREFIX + 'data-limit">ÿҳ<select value="'+curLimit+'">'+ defaultOptionStr + '<option value="20">20</option><option value="40">40</option><option value="60">60</option><option value="80">80</option></select>��<span>', wrapperEl);
            self._dataLimitSetEl = self._dataLimitEl.getElementsByTagName('select')[0];

            if (self.paginationDef.position == 'bottom') {
                YDOM.insertAfter(paginationEl, self.tableEl);
            } else {
                YDOM.insertBefore(paginationEl, self.tableEl);
            }
            self._paginationEl = paginationEl;

            function pageTurning() {
                var t = this ;
                var queryData = self._latestQueryData,
                    datasourceDef = self.datasourceDef,
                    dataStart = parseInt(DataGrid.getQueryParamValue(queryData, self.datasourceDef.dataStart) || 0, 10),
                    dataLimit = parseInt(DataGrid.getQueryParamValue(queryData, self.datasourceDef.dataLimit), 10),
                    dataAmount = parseInt(self._liveData[datasourceDef.dataAmount], 10),
                    totalPageNumLength = Math.ceil(dataAmount / dataLimit);
                if (t == self._pageStartEl) {
                    dataStart = '0';
                } else if (t == self._pagePrevEl) {
                    dataStart -= dataLimit;
                } else if (t == self._pageNextEl) {
                    dataStart += dataLimit;
                } else if (t == self._pageEndEl) {
                    dataStart = ( totalPageNumLength - 1 ) * dataLimit;
                } else if (t == self._pageSkipBtnEl) {
                    var skipTo = Math.min(parseInt(self._pageSkipInputEl.value, 10) || 1, totalPageNumLength);
                    self._pageSkipInputEl.value = skipTo;
                    dataStart = ( skipTo - 1 ) * dataLimit;
                } else {
                    dataStart = ( t.innerHTML - 1 ) * dataLimit;
                }
                var postData = DataGrid.setQueryParamValue(queryData, datasourceDef.dataStart, dataStart);
                self.update(postData);
            }

            var pageTurningTrigger = self._pageNumElArr.concat(self._pageStartEl, self._pagePrevEl, self._pageNextEl, self._pageEndEl) ;
            hide.apply(window, pageTurningTrigger);
            hide(self._pageSkipEl, self._dataLimitEl);
            Event.on(pageTurningTrigger, 'click', pageTurning);
            Event.on(self._pageSkipBtnEl, 'click', pageTurning);
            Event.on(self._dataLimitSetEl, 'change', function() {
                if (!self._listData) return;
                var t = this;
                self.paginationDef.dataLimit = t.value;
                self.update(self._latestQueryData);
            });
        },
        //���·�ҳ
        _updatePagination:function() {
            var self = this,
                queryData = self._latestQueryData,
                dataStart = parseInt(DataGrid.getQueryParamValue(queryData, self.datasourceDef.dataStart) || 0, 10),
                dataLimit = parseInt(DataGrid.getQueryParamValue(queryData, self.datasourceDef.dataLimit), 10),
                dataAmount = parseInt(self._liveData[self.datasourceDef.dataAmount], 10),
                pageNumLength = self.paginationDef.pageNumLength,
                totalPageNumLength = Math.ceil(dataAmount / dataLimit);

            show(self._pageSkipEl);
            show(self._dataLimitEl);
            //��ʾ��¼������
            self._pageInfoEl.innerHTML = '��'+ totalPageNumLength + 'ҳ/'+ dataAmount +'�� ';
            //�ж���һҳ״̬
            if (dataStart) {
                show(self._pageStartEl, self._pagePrevEl);
                hide(self._pageStartDisabledEl, self._pagePrevDisabledEl);
            } else {
                hide(self._pageStartEl, self._pagePrevEl);
                show(self._pageStartDisabledEl, self._pagePrevDisabledEl);
            }
            //�ж���һҳ״̬
            if (dataStart + dataLimit >= dataAmount) {
                hide(self._pageNextEl, self._pageEndEl);
                show(self._pageNextDisabledEl, self._pageEndDisabledEl);
            } else {
                show(self._pageNextEl, self._pageEndEl);
                hide(self._pageNextDisabledEl, self._pageEndDisabledEl);
            }
            //��ʾ��ǰҳ
            var curPageNum = Math.ceil(dataStart / dataLimit) + 1;
            self._curPageNumEl.innerHTML = curPageNum;
            //��ǰҳ����ҳ���е�λ��
            var curPageIdx = Math.floor(Math.min(totalPageNumLength, pageNumLength) / 2);
            //����ҳ�루����ҳ��+ҳ�����=������ҳ�룩
            var basicPageNum = 0;
            if (curPageNum - curPageIdx <= 0) {
                curPageIdx = curPageNum - 1;
            } else if (curPageNum > totalPageNumLength - Math.min(totalPageNumLength, pageNumLength) + curPageIdx + 1) {
                curPageIdx = curPageNum - ( totalPageNumLength - Math.min(totalPageNumLength, pageNumLength));
                basicPageNum = totalPageNumLength - Math.min(totalPageNumLength, pageNumLength);
            } else {
                basicPageNum = curPageNum - curPageIdx - 1;
            }
            //��Ⱦҳ��
            for (var i = 0 , len = pageNumLength; i < len; i++) {
                //����ҳ���г�����ҳ���Ĳ���
                if (totalPageNumLength < i + 1) {
                    hide(self._pageNumElArr[i]);
                } else {
                    self._pageNumElArr[i].innerHTML = i + 1 + basicPageNum;
                    if (i + 1 + basicPageNum == curPageNum) {
                        YDOM.insertBefore(self._curPageNumEl, self._pageNumElArr[i]);
                        hide(self._pageNumElArr[i]);
                    } else {
                        show(self._pageNumElArr[i]);
                    }
                }
            }
        }
    });

    //��ʾָ��Ԫ��
    function show(){
        for( var i = 0 ,len = arguments.length ; i < len ; i++ ){
            arguments[i].style.display='';
        }
    }
    //����ָ��Ԫ��
    function hide(){
        for( var i = 0 ,len = arguments.length ; i < len ; i++ ){
            arguments[i].style.display='none';
        }
    }
});