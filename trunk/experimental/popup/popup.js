/**
 * Popup
 * @creator     ����<fool2fish@gmail.com>
 * @depends     kissy-core, yui-core
 */

KISSY.add("datagrid", function(S) {
    var DOM = S.DOM, Event = S.Event , YDOM = YAHOO.util.Dom ,
        doc = document,
        POPUP_STATE = 'data-ks-popup-state' , POPUP_STATE_ENABLED = 'enabled' , POPUP_STATE_DISABLED = 'disabled';

    /**
     * Popup
     * @constructor
     */
    function Popup(trigger, popup, config){
        var self=this;

        trigger = S.query( trigger );
        popup = S.get( popup );
        if( !trigger || !popup ) return;

        popup.style.position = 'absolute' ;
        popup.style.display = 'none' ;
        S.ready(function(S) {
            doc.body.appendChild( popup );
        });
        self.popup = popup ;

        config = config || {};
        config = S.merge(Popup.Config, config);
        self.config = config ;
        if( config.width != 'auto' ) popup.style.width = config.width+'px';
        if( config.height != 'auto' ) popup.style.height = config.height+'px';

        // ����
        if( config.hasMask && !Popup.mask && config.triggerType == 'click' ){
            S.ready(function(S) {
                var mask = document.createElement("div");
                    mask.id = 'KSPopupMask' ;
					mask.className = "ks-popup-mask" ;
                    if( S.UA.ie === 6 ){
                        mask.innerHTML = '<iframe src="mask-iframe.html" allowtransparency="true" frameborder="0" scrolling="no" style="position:absolute;width:100%;height:100%;left:0;top:0;z-index:10;background:transparent;"></iframe>';
                    }
					doc.body.appendChild(mask);
			        mask.style.display = "none";
				Popup.mask=mask;
                var maskStyle = '.ks-popup-mask{position:absolute;left:0;top:0;width:100%;font-size:0px;line-height:0px;background:#000;filter:alpha(opacity=20);opacity:0.2;}';
                DOM.addStyleSheet( maskStyle , 'KSPopupMask' );
            });
        }

        // �رհ�ť
        if( config.clsCloseBtn ){
            Event.on( popup , 'click' , function(e){
                e.preventDefault();
                var t = e.target;
                if( DOM.hasClass( t , config.clsCloseBtn ) ){
                    self.hide();
                } 				
			});
        }

        for( var i = 0 , len = trigger.length ; i < len ; i++ ){
            self.attachTrigger( trigger[i] );
        }

        // �������¼�Ϊmouseʱ�������������mouse�¼�������
        if( config.triggerType == 'mouse' ){
            Event.on( popup , 'mouseenter', function( e ){
                var el = this;
                self._mouseenterHandler( el );
            } );
            Event.on( popup , 'mouseleave', function( e ){
                var el = this;
                self._mouseleaveHandler();
            } );
        }

    }

    S.mix(Popup.prototype,{
        trigger:[],
        //ǰһ�δ���
        prevTrigger:null,
        //��ǰ����
		curTrigger:null,
        //��ʾ������
        show:function(){
            var self = this , config = self.config , popup = self.popup ;
            if( config.triggerType = 'click' && config.hasMask ){
                Popup.mask.style.zIndex = YDOM.getStyle(popup,'zIndex')-1;
                Popup.showMask();
            }
            popup.style.display = 'block';
            Popup.setPosition( popup , self.curTrigger , config.position , config.align , config.offset , config.autoFit );
            if( config.animType == 'fade') opacityAnim( popup , 0 , 1 );
        },
        //���ص�����
        hide:function(){
            var self = this , config = self.config , popup = self.popup ;
            if( config.triggerType = 'click' && config.hasMask ) Popup.hideMask();
            self.popup.style.display = 'none';            
        },
        //����ָ��Ԫ��Ϊ����
        attachTrigger:function( el ){
            var self = this , config = self.config ;
            self.enableTrigger( el );
            if( getIndexOfArrEl( self.trigger , el ) >= 0 ) return;
            self.trigger.push( el );
            //ע���¼�
            if( config.triggerType == 'click' ){
                Event.on( el , 'click' , function( e ){
                    var el = this;
                    if( el.getAttribute( POPUP_STATE) == 'POPUP_STATE_DISABLE' ) return;
                    self._triggerClickHandler( el );
                } );
            }else if( config.triggerType == 'mouse' ){
                if( config.disableClick ) Event.on( el , 'click' , function(e){ e.preventDefault(); } );
                Event.on( el , 'mouseenter', function( e ){
                    var el = this;
                    if( el.getAttribute( POPUP_STATE) == 'POPUP_STATE_DISABLE' ) return;
                    self._mouseenterHandler( el );
                } );
                Event.on( el , 'mouseleave', function( e ){
                    self._mouseleaveHandler();
                } );
            }
        },

        enableTrigger:function( el ){
            this._setTrigger( el , POPUP_STATE_ENABLED );
        },

        disableTrigger:function( el ){
            this._setTrigger( el , POPUP_STATE_DISABLED );
        },
        
		_popupHideTimeId:null,
		_popupShowTimeId:null,
        /**
         * ��굥��������¼�������
         * @param el ����
         */
        _triggerClickHandler:function(el){
            var self = this ;
            self.prevTrigger = self.curTrigger ;
            self.curTrigger = el ;
            if( self.prevTrigger == self.curTrigger ){
                self.popup.style.display == 'none' ? self.show() : self.hide() ;
            }else{
                self.show();
            }
        },
        /**
         * �����봥����ߵ�����ʱ���¼�������
         * @param el ����򵯳���
         */
        _mouseenterHandler:function(el){
            var self = this ;
            clearTimeout( self._popupHideTimeId );
            // ���mouseenter�Ķ����Ǵ���
            if( el != self.popup ){
                self.prevTrigger = self.curTrigger ;
                self.curTrigger = el ;
            }
            self._popupShowTimeId = setTimeout( function(){ self.show(); }, self.config.delay * 1000 );
        },
        /**
         * ����뿪������ߵ�����ʱ���¼�������
         * @param el ����򵯳���
         */
        _mouseleaveHandler:function(){
            var self = this;
            clearTimeout( self._popupShowTimeId );
		    self._popupHideTimeId = setTimeout( function(){ self.hide(); }, self.config.delay * 1000 );
        },
        _setTrigger:function( el , value ){
            var self = this , triggerArr = [] ;
            if( !el ){
                triggerArr = self.trigger;
            }else if( S.isArray(el) ){
                triggerArr = el;
            }else{
                triggerArr.push( el );
            }
            for( var i = 0 , len = triggerArr.length ; i < len ; i++ ){
                triggerArr[i].setAttribute( POPUP_STATE , value );
            }
        }

    });

    S.mix( Popup.prototype , S.EventTarget );

    //Ĭ������
    Popup.Config = {
        // ��������
        triggerType: 'click', // or 'mouse'
        // �Ƿ���ֹ�����Ĭ�ϵ���¼���ֻ�е�triggerType=='mouse'��ʱ����趨��Ч��
        disableClick: false,
        // �����ӳ�
        delay: 0.1, // 100ms
        // ��ʾ�������ص�����ʱ�Ķ���Ч��
        animType: null,// 'fade'
        // ��������
        width: 'auto' ,
        // ������߶�
        height: 'auto',
        // ����������ڴ����λ��
        position: 'right',// or 'bottom','left','top'
        // ����������ڴ���Ķ��뷽ʽ
        align: 'top',// or 'right','bottom','left'
        // ������ļ���λ�ó���bodyʱ�Ƿ��Զ�����λ��
        autoFit: true,
        // �Ƿ�������
        hasMask: false,
        // �������ڴ���������رյİ�ť��class
        clsCloseBtn: null
    };

    //���ֶ���
    Popup.mask = null;

    //��ʾ����
    Popup.showMask = function(){
        var mask = Popup.mask ;
        if( !mask ) return ;
        mask.style.display = 'block';
        mask.style.height = YDOM.getDocumentHeight() + 'px';
    };
    
    //��������
    Popup.hideMask = function(){
        var mask = Popup.mask ;
        if( mask ) mask.style.display = 'none';
    }

    Popup.setPosition = function( el , refEl , position , align , offset , autoFit){
        var pos = YDOM.getXY( refEl );
        if ( S.isArray ( offset ) ) {
            pos[0] += parseInt( offset[0] , 10 );
            pos[1] += parseInt( offset[1] , 10 );
        }
        var  tw = refEl.offsetWidth, th = refEl.offsetHeight,
            pw = el.offsetWidth , ph = el.offsetHeight,
            dw = YDOM.getViewportWidth(), dh = YDOM.getViewportHeight(),
            sl = YDOM.getDocumentScrollLeft(), st = YDOM.getDocumentScrollTop(),
            l = pos[0], t = pos[1];
        if (position == 'left') {
            l = pos[0]-pw;
            t = (align == 'center')?(t-ph/2+th/2):(align == 'bottom')?(t+th-ph):t;
        } else if (position == 'right') {
            l = pos[0]+tw;
            t = (align == 'center')?(t-ph/2+th/2):(align == 'bottom')?(t+th-ph):t;
        } else if (position == 'bottom') {
            t = t+th;
            l = (align == 'center')?(l+tw/2-pw/2):(align == 'right')?(l+tw-pw):l;
        } else if (position == 'top') {
            t = t-ph;
            l = (align == 'center')?(l+tw/2-pw/2):(align == 'right')?(l+tw-pw):l;
        }
        //��ֹ����
        if(autoFit) {
            if ( t-st+ph > dh ) t = dh-ph+st-2; /* 2px ƫ�� */
            if ( l-sl+pw > dw) l = dw-pw+sl-2;
            t = Math.max( t , 0 );
            l = Math.max( l , 0 );
        }
        el.style.top = t + 'px';
        el.style.left = l + 'px';
    }

    S.Popup = Popup;

    function getIndexOfArrEl( arr , el ){
        var idx = -1 ;
        for( var i = 0 , len = arr.length ; i < len ; i++ ){
            if( arr[i] == el ){
                idx = i;
                break;
            }
        }
        return idx;
    }

    function setOpacity( el , opacity ){
            el.style.filter = 'alpha(opacity=' + opacity * 100 + ')';
            el.style.opacity = opacity ;
    }

    function opacityAnim( el , from , to ){
        var curOpacity = from , step = parseInt( ( to - from ) / 10 * 100 )/ 100;
        setOpacity( el , curOpacity );
        var intervalId = setInterval( function(){
            curOpacity = curOpacity + step ;
            if(( from > to && curOpacity < to ) || ( from < to && curOpacity > to)){
                curOpacity = to;
                clearInterval( intervalId );
            }
            setOpacity( el , curOpacity );
        } , 25 );
    }
});

