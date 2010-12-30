/**
 * loading mask support for overlay
 * @author: 承玉<yiminghe@gmail.com>
 */
KISSY.add("uibase-loading", function(S) {
    S.namespace("UIBase");
    function Loading() {
        //S.log("LoadingExt init");
    }

    Loading.prototype = {
        loading:function() {
            var self = this;
            if (!self._loadingExtEl) {
                self._loadingExtEl = new S.Node("<div " +
                    "class='ks-ext-loading'" +
                    " style='position: absolute;" +
                    "border: none;" +
                    "width: 100%;" +
                    "top: 0;" +
                    "left: 0;" +
                    "z-index: 99999;" +
                    "height:100%;" +
                    "*height: expression(this.parentNode.offsetHeight);" + "'>")
                    .appendTo(self.get("el"));
            }
            self._loadingExtEl.show();
        },

        unloading:function() {
            var lel = this._loadingExtEl;
            lel && lel.hide();
        }
    };

    S.UIBase.Loading = Loading;

},{
    host:"uibase"
});
