/**
 * @module  dom
 * @author  lifesinger@gmail.com
 */
KISSY.add('dom-style-ie', function(S, undefined) {

    // only for ie
    if (!S.UA.ie) return;

    var DOM = S.DOM,
        doc = document,
        docElem = doc.documentElement,
        OPACITY = 'opacity',
        FILTER = 'filter',
        FILTERS = 'filters',
        CURRENT_STYLE = 'currentStyle',
        LEFT = 'left',
        PX = 'px',
        CUSTOM_STYLES = DOM._CUSTOM_STYLES,
        RE_NUMPX = /^-?\d+(?:px)?$/i,
        RE_NUM = /^-?\d/,
        RE_SPECIAL = /^auto$/i,
        RE_WH = /^width|height$/i,
        RE_LEFT = /^left$/i,
        POSITION = "position";
    // use alpha filter for IE opacity
    try {
        if (docElem.style[OPACITY] === undefined && docElem[FILTERS]) {

            CUSTOM_STYLES[OPACITY] = {

                get: function(elem) {
                    var val = 100;

                    try { // will error if no DXImageTransform
                        val = elem[FILTERS]['DXImageTransform.Microsoft.Alpha'][OPACITY];
                    }
                    catch(e) {
                        try {
                            val = elem[FILTERS]('alpha')[OPACITY];
                        } catch(ex) {
                            // 没有设置过 opacity 时会报错，这时返回 1 即可
                        }
                    }

                    // 和其他浏览器保持一致，转换为字符串类型
                    return val / 100 + '';
                },

                set: function(elem, val) {
                    var style = elem.style;

                    // IE has trouble with opacity if it does not have layout
                    // Force it by setting the zoom level
                    style.zoom = 1;

                    // Set the alpha filter to set the opacity
                    style[FILTER] = 'alpha(' + OPACITY + '=' + val * 100 + ')';
                }
            };
        }
    }
    catch(ex) {
        S.log('IE filters ActiveX is disabled. ex = ' + ex);
    }

    // getComputedStyle for IE
    if (!(doc.defaultView || { }).getComputedStyle && docElem[CURRENT_STYLE]) {

        DOM._getComputedStyle = function(elem, name) {
            var style = elem.style,
                ret = elem[CURRENT_STYLE][name];

            // 当 width/height 设置为百分比时，通过 pixelLeft 方式转换的 width/height 值
            // 在 ie 下不对，需要直接用 offset 方式
            // borderWidth 等值也有问题，但考虑到 borderWidth 设为百分比的概率很小，这里就不考虑了
            if (RE_WH.test(name)) {
                ret = DOM[name](elem) + PX;
            }
            //chengyu:not work when left=auto (not set)
            else if (RE_SPECIAL.test(ret) && RE_LEFT.test(name)) {
                var position = DOM.css(elem, POSITION);
                //absolute: auto == offsetLeft - margin-left
                if (position == "absolute")
                    ret = elem.offsetLeft - parseInt(DOM.css(elem, "margin-left"));
                //relative: auto ==0
                else
                    ret = 0;
            }
            // From the awesome hack by Dean Edwards
            // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291
            // If we're not dealing with a regular pixel number
            // but a number that has a weird ending, we need to convert it to pixels
            else if ((!RE_NUMPX.test(ret) && RE_NUM.test(ret)) || RE_SPECIAL.test(ret)) {

                // Remember the original values
                var left = style[LEFT];

                // Put in the new values to get a computed value out
                style[LEFT] = (name === 'fontSize') ? '1em' : (ret || 0);
                ret = style['pixelLeft'] + PX;

                // Revert the changed values
                style[LEFT] = left;
            }

            return ret;
        }
    }
});
