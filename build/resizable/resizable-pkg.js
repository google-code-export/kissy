/*
Copyright 2010, KISSY UI Library v1.1.7dev
MIT Licensed
build time: ${build.time}
*/
/**
 * resizable support for kissy
 * @author: 承玉<yiminghe@gmail.com>
 * @requires: dd
 */
KISSY.add("resizable", function(S) {

    var Draggable = S.Draggable,
        CLS_PREFIX = "ke-resizehandler",
        Node = S.Node;

    var hcNormal = {
        "t":function(minW, maxW, minH, maxH, ot, ol, ow, oh, diffT) {
            var h = getBoundValue(minH, maxH, oh - diffT);
            var t = ot + oh - h;
            return [0,h,t,0]
        },
        "b":function(minW, maxW, minH, maxH, ot, ol, ow, oh, diffT) {
            var h = getBoundValue(minH, maxH, oh + diffT);
            return [0,h,0,0];
        },
        "r":function(minW, maxW, minH, maxH, ot, ol, ow, oh, diffT, diffL) {
            var w = getBoundValue(minW, maxW, ow + diffL);
            return [w,0,0,0];
        },
        "l":function(minW, maxW, minH, maxH, ot, ol, ow, oh, diffT, diffL) {
            var w = getBoundValue(minW, maxW, ow - diffL);
            var l = ol + ow - w;
            return [w,0,0,l]
        }
    };

    var horizonal = ["l","r"],vertical = ["t","b"];
    for (var i = 0; i < horizonal.length; i++) {
        for (var j = 0; j < vertical.length; j++) {
            (function(h, v) {
                hcNormal[ h + v] = hcNormal[ v + h] = function() {
                    return merge(hcNormal[h].apply(this, arguments),
                        hcNormal[v].apply(this, arguments));
                }
            })(horizonal[i], vertical[j]);
        }
    }
    function merge(a1, a2) {
        var a = [];
        for (var i = 0; i < a1.length; i++)
            a[i] = a1[i] || a2[i];
        return a;
    }

    function getBoundValue(min, max, v) {
        return Math.min(Math.max(min, v), max);
    }


    S.Resizable = S.UIBase.create([], {
        renderUI:function() {
            var self = this,node = self.get("node");
            self.dds = {};
            if (node.css("position") == "static")
                node.css("position", "relative");
        },
        _uiSetHandlers:function(v) {
            var self = this,
                dds = self.dds,
                node = self.get("node");
            self.destructor();
            for (var i = 0; i < v.length; i++) {
                var hc = v[i],
                    el = new Node("<div class='" + CLS_PREFIX +
                        " " + CLS_PREFIX + "-" + hc + "'>")
                        .prependTo(node),
                    dd = dds[hc] = new Draggable({
                        node:el
                    });
                dd.on("drag", self._drag, self);
                dd.on("dragstart", self._dragStart, self);
            }
        },
        _dragStart:function() {
            var self = this,node = self.get("node");
            self._width = node.width();
            self._top = parseInt(node.css("top"));
            self._left = parseInt(node.css("left"));
            self._height = node.height();
        },
        _drag:function(ev) {
            var self = this,
                node = self.get("node"),
                dd = ev.currentTarget || ev.target,
                hc = self._getHanderC(dd),
                ow = self._width,
                oh = self._height,
                minW = self.get("minWidth"),
                maxW = self.get("maxWidth"),
                minH = self.get("minHeight"),
                maxH = self.get("maxHeight"),
                diffT = ev.top - dd.startNodePos.top,
                diffL = ev.left - dd.startNodePos.left,
                ot = self._top,
                ol = self._left;

            var pos = hcNormal[hc](minW, maxW, minH, maxH, ot, ol, ow, oh, diffT, diffL);
            var attr = ["width","height","top","left"];
            for (var i = 0; i < attr.length; i++) {
                if (pos[i])node.css(attr[i], pos[i]);
            }
        },

        _getHanderC:function(dd) {
            var dds = this.dds;
            for (var d in dds) {
                if (!dds.hasOwnProperty(d))return;
                if (dds[d] == dd)
                    return d;
            }
        },
        destructor:function() {
            var self = this,
                dds = self.dds;
            for (var d in dds) {
                if (!dds.hasOwnProperty(d))return;
                dds[d].destroy();
                dds[d].get("node").remove();
                delete dds[d];
            }
        }
    }, {
        ATTRS:{
            node:{
                setter:function(v) {
                    return S.one(v);
                }
            },
            minWidth:{
                value:0
            },
            minHeight:{
                value:0
            },
            maxWidth:{
                value:Number.MAX_VALUE
            },
            maxHeight:{
                value:Number.MAX_VALUE
            },
            handlers:{
                //t,tr,r,br,b,bl,l,tl
                value:[]
            }
        }
    });

}, { requires:["dd"] });
