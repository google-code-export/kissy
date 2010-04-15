/**
 * Popup
 * @creator     ����<fool2fish@gmail.com>
 * @depends     kissy-core, yui-core, yui2-animation
 */

KISSY.add("datagrid", function(S) {
    var DOM = S.DOM, Event = S.Event , YDom = YAHOO.util.Dom ,
        doc = document
        ;

    /**
     * Popup
     * @constructor
     */
    function Popup(trigger, popup, config){
        var self=this;

        // ����͵�����
        trigger = S.query( trigger );
        popup = S.get( popup );
        if( !trigger || !popup ) return;

        popup.style.position = 'absolute' ;
        popup.style.display = 'none' ;

        // ��������ת��body��һ����Ԫ��
        S.ready(function(S) {
            doc.body.appendChild( popup );
        });

        // ����
        config = config || {};
        config = S.merge(Popup.Config, config);

        // ����
        if( config.hasMask && !Popup.mask && config.triggerType == 'click' ){
            S.ready(function(S) {
                var mask = document.createElement("div");
					mask.className = "ks-popup-mask";
					doc.body.appendChild(mask);
					mask.style.display = "none";
				Popup.mask=mask;
                var maskStyle = '.ks-popup-mask{position:absolute;left:0;top:0;width:100%;font-size:0px;line-height:0px;background:#000;filter:alpha(opacity=20);opacity:0.2;}';
                DOM.addStyleSheet(maskStyle, 'KSPopupMask');
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

        // trigger click handler
        function triggerClickHandler(e){
            e.preventDefault();
            self.prevTrigger = self.curTrigger ;
            self.curTrigger = this ;
            if( self.prevTrigger == self.curTrigger ){
                self.popup.style.display == 'none' ? self.show() : self.hide() ;
            }else{
                self.show();
            }
        }

        // mouseenter handler
        function mouseenterHandler(e){
            clearTimeout( self._popupHideTimeId );
            // ���mouseenter�Ķ����Ǵ���
            if( this != popup ){
                self.prevTrigger = self.curTrigger ;
                self.curTrigger = this ;
            }
            self._popupShowTimeId = setTimeout( function(){ self.show(); }, config.delay * 1000 );
        }

        // mouselive handler
        function mouseleaveHandler(e){
            clearTimeout( self._popupShowTimeId );
		    self._popupHideTimeId = setTimeout( function(){ self.hide(); }, config.delay * 1000 );
        }

        //ע���¼�
        if( config.triggerType == 'click' ){
            Event.on( trigger , 'click' , triggerClickHandler );
        }else if( config.triggerType == 'mouse' ){
            if( config.disableClick ) Event.on( trigger , 'click' , function(e){ e.preventDefault(); } );
            Event.on( trigger , 'mouseenter', mouseenterHandler );
			Event.on( trigger , 'mouseleave', mouseleaveHandler );
			Event.on( popup , 'mouseenter', mouseenterHandler );
			Event.on( popup , 'mouseleave', mouseleaveHandler );
        }

        self.trigger = trigger ;
        self.popup = popup ;
        self.config = config ;
    }

    S.mix(Popup.prototype,{
        //˽������
		_popupHideTimeId:null,
		_popupShowTimeId:null,
        //ǰһ�δ���
        prevTrigger:null,
        //��ǰ����
		curTrigger:null,
        //��ʾ������
        show:function(){
            var self = this ;
            if( self.config.triggerType = 'click' && self.config.hasMask ) Popup.showMask();
            var config = self.config , popup = self.popup ;
            popup.style.display = 'block';
            if( config.width != 'auto' ) popup.style.width = config.width+'px';
            if( config.height != 'auto' ) popup.style.height = config.height+'px';
			var pos = YDom.getXY( self.curTrigger );
			if ( S.isArray ( config.offset ) ) {
				pos[0] += parseInt( config.offset[0] , 10 );
				pos[1] += parseInt( config.offset[1] , 10 );
			}
			var  tw = self.curTrigger.offsetWidth, th = self.curTrigger.offsetHeight,
				pw = popup.offsetWidth , ph = popup.offsetHeight,
				dw = YDom.getViewportWidth(), dh = YDom.getViewportHeight(),
				sl = YDom.getDocumentScrollLeft(), st = YDom.getDocumentScrollTop(),
				l = pos[0], t = pos[1];
			if (config.position == 'left') {
				l = pos[0]-pw;
				t = (config.align == 'center')?(t-ph/2+th/2):(config.align == 'bottom')?(t+th-ph):t;
			} else if (config.position == 'right') {
				l = pos[0]+tw;
				t = (config.align == 'center')?(t-ph/2+th/2):(config.align == 'bottom')?(t+th-ph):t;
			} else if (config.position == 'bottom') {
				t = t+th;
				l = (config.align == 'center')?(l+tw/2-pw/2):(config.align == 'right')?(l+tw-pw):l;
			} else if (config.position == 'top') {
				t = t-ph;
				l = (config.align == 'center')?(l+tw/2-pw/2):(config.align == 'right')?(l+tw-pw):l;
			}
            //��ֹ����
			if(config.autoFit) {
				if ( t-st+ph > dh ) t = dh-ph+st-2; /* 2px ƫ�� */
                if ( l-sl+pw > dw) l = dw-pw+sl-2;
                t = Math.max( t , 0 );
			    l = Math.max( l , 0 );
			}
			popup.style.top = t + 'px';
			popup.style.left = l + 'px';
        },
        //���ص�����
        hide:function(){
            var self = this ;
            if( self.config.triggerType = 'click' && self.config.hasMask ) Popup.hideMask();
            self.popup.style.display = 'none';            
        },
        //����ָ��Ԫ��Ϊ����
        attachTrigger:function(el){

        },
        //ȡ��ָ������
        detachTrigger:function(el){

        }
    });

    S.mix( Popup.prototype , S.EventTarget );

    /******************************************************************************************************************
     * @Ĭ������
     *****************************************************************************************************************/

    //Ĭ������
    Popup.Config = {
        // ��������
        triggerType: 'click', // or 'mouse'
        // �Ƿ���ֹ�����Ĭ�ϵ���¼���ֻ�е�triggerType=='mouse'��ʱ����趨��Ч��
        disableClick: false,
        // �����ӳ�
        delay: 0.1, // 100ms
        // ��ʾ�������ص�����ʱ�Ķ���Ч��
        animType: null,// 'fade' , 'width' , 'height' , 'both'
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
        mask.style.height = YDom.getDocumentHeight() + 'px';
    };
    //��������
    Popup.hideMask = function(){
        var mask = Popup.mask ;
        if( mask ) mask.style.display = 'none';
    }

    S.Popup = Popup;
});

