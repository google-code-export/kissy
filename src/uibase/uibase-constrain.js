/**
 * constrain extension for kissy
 * @author: 承玉<yiminghe@gmail.com>, 乔花<qiaohua@taobao.com>
 */
KISSY.add("uibase-constrain", function(S) {
    S.namespace("UIBase");

    var DOM = S.DOM;

    function Constrain() {
        //S.log("constrain init");
    }

    Constrain.ATTRS = {
        constrain:{
            //不限制
            //true:viewport限制
            //node:限制在节点范围
            value:false
        }
    };

    /**
     * 获取受限区域的宽高, 位置
     * @return {Object | undefined} {left: 0, top: 0, maxLeft: 100, maxTop: 100}
     */
    function _getConstrainRegion(constrain) {
        var ret;
        if (!constrain) return ret;
        var el = this.get("el");
        if (constrain !== true) {
            constrain = S.one(constrain);
            ret = constrain.offset();
            S.mix(ret, {
                maxLeft: ret.left + constrain[0].offsetWidth - el[0].offsetWidth,
                maxTop: ret.top + constrain[0].offsetHeight - el[0].offsetHeight
            });
        }
        // 没有指定 constrain, 表示受限于可视区域
        else {
            //不要使用 viewportWidth()
            //The innerWidth attribute, on getting,
            //must return the viewport width including the size of a rendered scroll bar (if any).
            //On getting, the clientWidth attribute returns the viewport width
            //excluding the size of a rendered scroll bar (if any)
            //  if the element is the root element 
            var vWidth = document.documentElement.clientWidth;
            ret = { left: DOM.scrollLeft(), top: DOM.scrollTop() };
            S.mix(ret, {
                maxLeft: ret.left + vWidth - el[0].offsetWidth,
                maxTop: ret.top + DOM.viewportHeight() - el[0].offsetHeight
            });
        }

        return ret;
    }

    Constrain.prototype = {
        __bindUI:function() {
            //S.log("_bindUIConstrain");

        },
        __renderUI:function() {
            //S.log("_renderUIConstrain");
            var self = this,
                attrs = self.__getDefAttrs(),
                xAttr = attrs["x"],
                yAttr = attrs["y"],
                oriXSetter = xAttr["setter"],
                oriYSetter = yAttr["setter"];
            xAttr.setter = function(v) {
                var r = oriXSetter && oriXSetter(v);
                if (r === undefined) {
                    r = v;
                }
                if (!self.get("constrain")) return r;
                var _ConstrainExtRegion = _getConstrainRegion.call(
                    self, self.get("constrain"));
                return Math.min(Math.max(r,
                    _ConstrainExtRegion.left),
                    _ConstrainExtRegion.maxLeft);
            };
            yAttr.setter = function(v) {
                var r = oriYSetter && oriYSetter(v);
                if (r === undefined) {
                    r = v;
                }
                if (!self.get("constrain")) return r;
                var _ConstrainExtRegion = _getConstrainRegion.call(
                    self, self.get("constrain"));
                return Math.min(Math.max(r,
                    _ConstrainExtRegion.top),
                    _ConstrainExtRegion.maxTop);
            };
            self.addAttr("x", xAttr);
            self.addAttr("y", yAttr);
        },

        __syncUI:function() {
            //S.log("_syncUIConstrain");
        },
        __destructor:function() {
            //S.log("constrain-ext __destructor");
        }

    };


    S.UIBase.Constrain = Constrain;

},{
    host:"uibase"
});
