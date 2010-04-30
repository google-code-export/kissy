/**
 * CoupleSelect
 * @creator     ����<fool2fish@gmail.com>
 * @depends     kissy-core, yui-core
 */

KISSY.add("coupleselect", function(S) {
    var DOM = S.DOM, Event = S.Event , YDOM = YAHOO.util.Dom ,
        KS_CS_PREFIX = 'ks-cs-',
        doc = document;

    /**
     * CoupleSelect
     * @constructor
     */
    function CoupleSelect(container,config){
        container = S.get(container);
        if(!container) return;

        var self=this;
        self.container = container;
        config = S.merge(defaultConfig, config);
        self.sourceBox = S.get('.'+config.sourceBoxCls);
        self.targetBox = S.get('.'+config.targetBoxCls);
        self.items = S.query('.'+config.itemCls);

        /**
         * ��ǰ����
         */
		//self.curTrigger = undefined;

    }

    S.augment(CoupleSelect,{
        // item���������
        _bindItem:function(){},
        _onClickItem:function(e){},
        _onDbclickItem:function(e){},
        // ���item���
        _bindAddItemTrigger:function(){},
        _addItems:function(){},
        _addItem:function(){},
        // �Ƴ�item���
        _bindRemoveItemTrigger:function(){},
        _removeItems :function(){},
        _removeItem:function(){},
        // �ƶ�item���
        _bindMoveTopTrigger:function(){},
        _bindMoveUpTrigger:function(){},
        _bindMoveDownTrigger:function(){},                                                           
        _bindMoveBottomTrigger:function(){},
        _moveItemTop:function(e){},
        _moveItemUp:function(e){},
        _moveItemDown:function(e){},
        _moveItemBotton:function(e){},
        _moveItem:function(){},
        // ��ȡitem���
        getItems:function(){}
        
    });

    S.augment( CoupleSelect , S.EventTarget );

    S.CoupleSelect = CoupleSelect;

    //Ĭ������                                                                                                                       -
    var defaultConfig = {

        sourceBoxCls:KS_CS_PREFIX+'source-box',
        targetBoxCls:KS_CS_PREFIX+'target-box',

        itemCls:KS_CS_PREFIX+'item',
        itemSelectedCls:KS_CS_PREFIX+'selected',

        enableMultiSelect:false,
        enableReaddItem:true,
        enableMoveByDbclick:true,

        // ����һ�����ò�Ҫ�޸ģ�ʹ��Ĭ�ϼ���
        addItemTriggerCls:KS_CS_PREFIX+'add',
        removeItemTriggerCls:KS_CS_PREFIX+'remove',

        moveItemTopTriggerCls:KS_CS_PREFIX+'move-top',
        moveItemUpTriggerCls:KS_CS_PREFIX+'move-up',
        moveItemDownTriggerCls:KS_CS_PREFIX+'move-down',
        moveItemBottomTriggerCls:KS_CS_PREFIX+'move-bottom'
        
    };

});

/**
 * Notes:
 *
 * 2010.04.26
 *      -
 * 
 */

