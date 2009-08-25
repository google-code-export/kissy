/**
 * KISSY.Suggest ��ʾ��ȫ���
 *
 * suggest.js
 * requires: yahoo-dom-event
 *
 * @author lifesinger@gmail.com
 */

var KISSY = window.KISSY || {};

(function(NS) {
    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = YAHOO.lang,
        head = document.getElementsByTagName("head")[0],
        ie = YAHOO.env.ua.ie, ie6 = (ie === 6),

        CALLBACK_STR = "KISSY.Suggest.callback", // ע�� KISSY ��������д����
        STYLE_ID = "suggest-style", // ��ʽ style Ԫ�ص� id

        CONTAINER_CLASS = "suggest-container",
        KEY_EL_CLASS = "suggest-key", // ��ʾ���У�key Ԫ�ص� class
        RESULT_EL_CLASS = "suggest-result", // ��ʾ���У�result Ԫ�ص� class
        SELECTED_ITEM_CLASS = "selected", // ��ʾ���У�ѡ����� class
        BOTTOM_CLASS = "suggest-bottom",
        CLOSE_BTN_CLASS = "suggest-close-btn",
        SHIM_CLASS = "suggest-shim", // iframe shim �� class

        BEFORE_DATA_REQUEST = "beforeDataRequest",
        ON_DATA_RETURN = "onDataReturn",
        BEFORE_SHOW = "beforeShow",
        ON_ITEM_SELECT = "onItemSelect",

        /**
         * Suggest��Ĭ������
         */
        defaultConfig = {
        /**
         * �û����Ӹ�������ʾ��� class
         *
         * ��ʾ���Ĭ�Ͻṹ���£�
         * <div class="suggest-container [container-class]">
         *     <ol>
         *         <li>
         *             <span class="suggest-key">...</span>
         *             <span class="suggest-result">...</span>
         *         </li>
         *     </ol>
         *     <div class="suggest-bottom">
         *         <a class="suggest-close-btn">...</a>
         *     </div>
         * </div>
         * @type String
         */
        containerClass: "",

        /**
         * ��ʾ��Ŀ��
         * ע�⣺Ĭ������£���ʾ��Ŀ�Ⱥ�input�����Ŀ�ȱ���һ��
         * ʾ��ȡֵ��"200px", "10%"�ȣ��������λ
         * @type String
         */
        containerWidth: "auto",

        /**
         * result�ĸ�ʽ
         * @type String
         */
        resultFormat: "Լ%result%�����",

        /**
         * �Ƿ���ʾ�رհ�ť
         * @type Boolean
         */
        showCloseBtn: false,

        /**
         * �رհ�ť�ϵ�����
         * @type String
         */
        closeBtnText: "�ر�",

        /**
         * �Ƿ���Ҫiframe shim
         * @type Boolean
         */
        useShim: ie6,

        /**
         * ��ʱ������ʱ
         * @type Number
         */
        timerDelay: 200,

        /**
         * ��ʼ�����Զ�����
         * @type Boolean
         */
        autoFocus: false,

        /**
         * ��������ѡ��ʱ���Ƿ��Զ��ύ��
         * @type Boolean
         */
        submitFormOnClickSelect: true
    };

    /**
     * ��ʾ��ȫ���
     * @class Suggest
     * @requires YAHOO.util.Dom
     * @requires YAHOO.util.Event
     * @constructor
     * @param {String|HTMLElement} textInput
     * @param {String} dataSource
     * @param {Object} config
     */
    NS.Suggest = function(textInput, dataSource, config) {
        /**
         * �ı������
         * @type HTMLElement
         */
        this.textInput = Dom.get(textInput);

        /**
         * ��ȡ���ݵ�URL �� JSON��ʽ�ľ�̬����
         * @type {String|Object}
         */
        this.dataSource = dataSource;

        /**
         * JSON��̬����Դ
         * @type Object ��ʽΪ {"query1" : [["key1", "result1"], []], "query2" : [[], []]}
         */
        this.JSONDataSource = Lang.isObject(dataSource) ? dataSource : null;

        /**
         * ͨ��jsonp���ص�����
         * @type Object
         */
        this.returnedData = null;

        /**
         * ���ò���
         * @type Object
         */
        this.config = Lang.merge(defaultConfig, config || {});

        /**
         * �����ʾ��Ϣ������
         * @type HTMLElement
         */
        this.container = null;

        /**
         * ������ֵ
         * @type String
         */
        this.query = "";

        /**
         * ��ȡ����ʱ�Ĳ���
         * @type String
         */
        this.queryParams = "";

        /**
         * �ڲ���ʱ��
         * @private
         * @type Object
         */
        this._timer = null;

        /**
         * ��ʱ���Ƿ�������״̬
         * @private
         * @type Boolean
         */
        this._isRunning = false;

        /**
         * ��ȡ���ݵ�scriptԪ��
         * @type HTMLElement
         */
        this.dataScript = null;

        /**
         * ���ݻ���
         * @private
         * @type Object
         */
        this._dataCache = {};

        /**
         * ����script��ʱ���
         * @type String
         */
        this._latestScriptTime = "";

        /**
         * script���ص������Ƿ��Ѿ�����
         * @type Boolean
         */
        this._scriptDataIsOut = false;

        /**
         * �Ƿ��ڼ���ѡ��״̬
         * @private
         * @type Boolean
         */
        this._onKeyboardSelecting = false;

        /**
         * ��ʾ��ĵ�ǰѡ����
         * @type Boolean
         */
        this.selectedItem = null;

        // init
        this._init();
    };

    Lang.augmentObject(NS.Suggest.prototype, {
        /**
         * ��ʼ������
         * @protected
         */
        _init: function() {
            // init DOM
            this._initTextInput();
            this._initContainer();
            if (this.config.useShim) this._initShim();
            this._initStyle();

            // create events
            this.createEvent(BEFORE_DATA_REQUEST);
            this.createEvent(ON_DATA_RETURN);
            this.createEvent(BEFORE_SHOW);
            this.createEvent(ON_ITEM_SELECT);

            // window resize event
            this._initResizeEvent();
        },

        /**
         * ��ʼ�������
         * @protected
         */
        _initTextInput: function() {
            var instance = this;

            // turn off autocomplete
            this.textInput.setAttribute("autocomplete", "off");

            // focus
            Event.on(this.textInput, "focus", function() {
                instance.start();
            });

            // blur
            Event.on(this.textInput, "blur", function() {
                instance.stop();
                instance.hide();
            });

            // auto focus
            if (this.config.autoFocus) this.textInput.focus();

            // keydown
            // ע������Ŀǰ����Opera9.64�У����뷨����ʱ�����ɲ��ᴥ���κμ����¼�
            var pressingCount = 0; // ������סĳ��ʱ������������keydown������ע��Operaֻ�ᴥ��һ�Ρ�
            Event.on(this.textInput, "keydown", function(ev) {
                var keyCode = ev.charCode || ev.keyCode;
                //console.log("keydown " + keyCode);

                switch (keyCode) {
                    case 27: // ESC����������ʾ�㲢��ԭ��ʼ����
                        instance.hide();
                        instance.textInput.value = instance.query;
                        break;
                    case 13: // ENTER��
                        // �ύ��ǰ����������ʾ�㲢ֹͣ��ʱ��
                        instance.textInput.blur(); // ��һ�仹������ֹ���������Ĭ���ύ�¼�

                        // ����Ǽ���ѡ��ĳ���س�������onItemSelect�¼�
                        if (instance._onKeyboardSelecting) {
                            if (instance.textInput.value == instance._getSelectedItemKey()) { // ȷ��ֵƥ��
                                instance.fireEvent(ON_ITEM_SELECT, instance.textInput.value);
                            }
                        }

                        // �ύ��
                        instance._submitForm();

                        break;
                    case 40: // DOWN��
                    case 38: // UP��
                        // ��ס������ʱ����ʱ����
                        if (pressingCount++ == 0) {
                            if (instance._isRunning) instance.stop();
                            instance._onKeyboardSelecting = true;
                            instance.selectItem(keyCode == 40);

                        } else if (pressingCount == 3) {
                            pressingCount = 0;
                        }
                        break;
                }

                // �� DOWN/UP ��ʱ��������ʱ��
                if (keyCode != 40 && keyCode != 38) {
                    if (!instance._isRunning) {
                        // 1. �����ٽ�����js��δ������ʱ���û����ܾ��Ѿ���ʼ����
                        //    ��ʱ��focus�¼��Ѿ����ᴥ������Ҫ��keyup�ﴥ����ʱ��
                        // 2. ��DOWN/UP��ʱ����Ҫ���ʱ��
                        instance.start();
                    }
                    instance._onKeyboardSelecting = false;
                }
            });

            // reset pressingCount
            Event.on(this.textInput, "keyup", function() {
                //console.log("keyup");
                pressingCount = 0;
            });
        },

        /**
         * ��ʼ����ʾ������
         * @protected
         */
        _initContainer: function() {
            // create
            var container = document.createElement("div"),
                customContainerClass = this.config.containerClass;

            container.className = CONTAINER_CLASS;
            if(customContainerClass) {
                container.className += " " + customContainerClass;
            }
            container.style.position = "absolute";
            container.style.visibility = "hidden";
            this.container = container;

            this._setContainerRegion();
            this._initContainerEvent();

            // append
            document.body.insertBefore(container, document.body.firstChild);
        },

        /**
         * ����������left, top, width
         * @protected
         */
        _setContainerRegion: function() {
            var r = Dom.getRegion(this.textInput);
            var left = r.left, w = r.right - left - 2;  // ��ȥborder��2px

            // ie8����ģʽ
            // document.documentMode:
            // 5 - Quirks Mode
            // 7 - IE7 Standards
            // 8 - IE8 Standards
            var docMode = document.documentMode;
            if (docMode === 7 && (ie === 7 || ie === 8)) {
                left -= 2;
            } else if (YAHOO.env.ua.gecko) { // firefox����ƫһ���� ע���� input ���ڵĸ��������� margin: auto ʱ�����
                left++;
            }

            this.container.style.left = left + "px";
            this.container.style.top = r.bottom + "px";

            if (this.config.containerWidth == "auto") {
                this.container.style.width = w + "px";
            } else {
                this.container.style.width = this.config.containerWidth;
            }
        },

        /**
         * ��ʼ�������¼�
         * ��Ԫ�ض����������¼���ð�ݵ�����ͳһ����
         * @protected
         */
        _initContainerEvent: function() {
            var instance = this;

            // ����¼�
            Event.on(this.container, "mousemove", function(ev) {
                //console.log("mouse move");
                var target = Event.getTarget(ev);

                if (target.nodeName != "LI") {
                    target = Dom.getAncestorByTagName(target, "li");
                }
                if (Dom.isAncestor(instance.container, target)) {
                    if (target != instance.selectedItem) {
                        // �Ƴ��ϵ�
                        instance._removeSelectedItem();
                        // �����µ�
                        instance._setSelectedItem(target);
                    }
                }
            });

            var mouseDownItem = null;
            this.container.onmousedown = function(e) {
                e = e || window.event;
                // ��갴�´���item
                mouseDownItem = e.target || e.srcElement;

                // ��갴��ʱ��������򲻻�ʧȥ����
                // 1. for IE
                instance.textInput.onbeforedeactivate = function() {
                    window.event.returnValue = false;
                    instance.textInput.onbeforedeactivate = null;
                };
                // 2. for W3C
                return false;
            };

            // mouseup�¼�
            Event.on(this.container, "mouseup", function(ev) {
                // ��mousedown����ʾ�㣬��mouseup����ʾ����ʱ�������Ч
                if (!instance._isInContainer(Event.getXY(ev))) return;
                var target = Event.getTarget(ev);
                // ����ʾ��A�������꣬�ƶ���B���ͷţ�������onItemSelect
                if (target != mouseDownItem) return;

                // ����ڹرհ�ť��
                if (target.className == CLOSE_BTN_CLASS) {
                    instance.hide();
                    return;
                }

                // ���ܵ����li����Ԫ����
                if (target.nodeName != "LI") {
                    target = Dom.getAncestorByTagName(target, "li");
                }
                // ��������container�ڲ���li��
                if (Dom.isAncestor(instance.container, target)) {
                    instance._updateInputFromSelectItem(target);

                    // ����ѡ���¼�
                    //console.log("on item select");
                    instance.fireEvent(ON_ITEM_SELECT, instance.textInput.value);

                    // �ύ��ǰ����������ʾ�㲢ֹͣ��ʱ��
                    instance.textInput.blur();

                    // �ύ��
                    instance._submitForm();
                }
            });
        },

        /**
         * clickѡ�� or enter���ύ��
         */
        _submitForm: function() {
            // ע�����ڼ��̿���enterѡ����������html��������Ƿ��ύ������ᵼ��ĳЩ���뷨�£���enterѡ��Ӣ��ʱҲ�����ύ
            if (this.config.submitFormOnClickSelect) {
                var form = this.textInput.form;
                if (!form) return;

                // ͨ��js�ύ��ʱ�����ᴥ��onsubmit�¼�
                // ��Ҫjs�Լ�����
                if (document.createEvent) { // w3c
                    var evObj = document.createEvent("MouseEvents");
                    evObj.initEvent("submit", true, false);
                    form.dispatchEvent(evObj);
                }
                else if (document.createEventObject) { // ie
                    form.fireEvent("onsubmit");
                }

                form.submit();
            }
        },

        /**
         * �ж�p�Ƿ�����ʾ����
         * @param {Array} p [x, y]
         */
        _isInContainer: function(p) {
            var r = Dom.getRegion(this.container);
            return p[0] >= r.left && p[0] <= r.right && p[1] >= r.top && p[1] <= r.bottom;
        },

        /**
         * ���������iframe shim��
         * @protected
         */
        _initShim: function() {
            var iframe = document.createElement("iframe");
            iframe.src = "about:blank";
            iframe.className = SHIM_CLASS;
            iframe.style.position = "absolute";
            iframe.style.visibility = "hidden";
            iframe.style.border = "none";
            this.container.shim = iframe;

            this._setShimRegion();
            document.body.insertBefore(iframe, document.body.firstChild);
        },

        /**
         * ����shim��left, top, width
         * @protected
         */
        _setShimRegion: function() {
            var container = this.container, shim = container.shim;
            if (shim) {
                shim.style.left = (parseInt(container.style.left) - 2) + "px"; // ����̱���bug
                shim.style.top = container.style.top;
                shim.style.width = (parseInt(container.style.width) + 2) + "px";
            }
        },

        /**
         * ��ʼ����ʽ
         * @protected
         */
        _initStyle: function() {
            var styleEl = Dom.get(STYLE_ID);
            if (styleEl) return; // ��ֹ���ʵ��ʱ�ظ����

            var style = ".suggest-container{background:white;border:1px solid #999;z-index:99999}";
            style += ".suggest-shim{z-index:99998}";
            style += ".suggest-container li{color:#404040;padding:1px 0 2px;font-size:12px;line-height:18px;float:left;width:100%}";
            style += ".suggest-container li.selected{background-color:#39F;cursor:default}";
            style += ".suggest-key{float:left;text-align:left;padding-left:5px}";
            style += ".suggest-result{float:right;text-align:right;padding-right:5px;color:green}";
            style += ".suggest-container li.selected span{color:#FFF;cursor:default}";
            //style += ".suggest-container li.selected .suggest-result{color:green}";
            style += ".suggest-bottom{padding:0 5px 5px}";
            style += ".suggest-close-btn{float:right}";
            style += ".suggest-container li,.suggest-bottom{overflow:hidden;zoom:1;clear:both}";
            /* hacks */
            style += ".suggest-container{*margin-left:2px;_margin-left:-2px;_margin-top:-3px}";

            styleEl = document.createElement("style");
            styleEl.id = STYLE_ID;
            styleEl.type = "text/css";
            head.appendChild(styleEl); // ����ӵ�DOM���У�����cssText���hack��ʧЧ

            if (styleEl.styleSheet) { // IE
                styleEl.styleSheet.cssText = style;
            } else { // W3C
                styleEl.appendChild(document.createTextNode(style));
            }
        },

        /**
         * window.onresizeʱ��������ʾ���λ��
         * @protected
         */
        _initResizeEvent: function() {
            var instance = this, resizeTimer;

            Event.on(window, "resize", function() {
                if (resizeTimer) {
                    clearTimeout(resizeTimer);
                }

                resizeTimer = setTimeout(function() {
                    instance._setContainerRegion();
                    instance._setShimRegion();
                }, 50);
            });
        },

        /**
         * ������ʱ������ʼ�����û�����
         */
        start: function() {
            NS.Suggest.focusInstance = this;

            var instance = this;
            instance._timer = setTimeout(function() {
                instance.updateData();
                instance._timer = setTimeout(arguments.callee, instance.config.timerDelay);
            }, instance.config.timerDelay);

            this._isRunning = true;
        },

        /**
         * ֹͣ��ʱ��
         */
        stop: function() {
            NS.Suggest.focusInstance = null;
            clearTimeout(this._timer);
            this._isRunning = false;
        },

        /**
         * ��ʾ��ʾ��
         */
        show: function() {
            if (this.isVisible()) return;
            var container = this.container, shim = container.shim;

            container.style.visibility = "";

            if (shim) {
                if (!shim.style.height) { // ��һ����ʾʱ����Ҫ�趨�߶�
                    var r = Dom.getRegion(container);
                    shim.style.height = (r.bottom - r.top - 2) + "px";
                }
                shim.style.visibility = "";
            }
        },

        /**
         * ������ʾ��
         */
        hide: function() {
            if (!this.isVisible()) return;
            var container = this.container, shim = container.shim;
            //console.log("hide");

            if (shim) shim.style.visibility = "hidden";
            container.style.visibility = "hidden";
        },

        /**
         * ��ʾ���Ƿ���ʾ
         */
        isVisible: function() {
            return this.container.style.visibility != "hidden";
        },

        /**
         * ������ʾ�������
         */
        updateData: function() {
            if (!this._needUpdate()) return;
            //console.log("update data");

            this._updateQueryValueFromInput();
            var q = this.query;

            // 1. ����Ϊ��ʱ��������ʾ��
            if (!Lang.trim(q).length) {
                this._fillContainer("");
                this.hide();
                return;
            }

            if (typeof this._dataCache[q] != "undefined") { // 2. ʹ�û�������
                //console.log("use cache");
                this.returnedData = "using cache";
                this._fillContainer(this._dataCache[q]);
                this._displayContainer();

            } else if (this.JSONDataSource) { // 3. ʹ��JSON��̬����Դ
                this.handleResponse(this.JSONDataSource[q]);

            } else { // 4. �������������
                this.requestData();
            }
        },

        /**
         * �Ƿ���Ҫ��������
         * @protected
         * @return Boolean
         */
        _needUpdate: function() {
            // ע�⣺����ո�Ҳ���б仯
            return this.textInput.value != this.query;
        },

        /**
         * ͨ��scriptԪ�ؼ�������
         */
        requestData: function() {
            //console.log("request data via script");
            if (!ie) this.dataScript = null; // IE����Ҫ���´���scriptԪ��

            if (!this.dataScript) {
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.charset = "utf-8";

                // jQuery ajax.js line 275:
                // Use insertBefore instead of appendChild  to circumvent an IE6 bug.
                // This arises when a base node is used.
                head.insertBefore(script, head.firstChild);
                this.dataScript = script;

                if (!ie) {
                    var t = new Date().getTime();
                    this._latestScriptTime = t;
                    script.setAttribute("time", t);

                    Event.on(script, "load", function() {
                        //console.log("on load");
                        // �жϷ��ص������Ƿ��Ѿ�����
                        this._scriptDataIsOut = script.getAttribute("time") != this._latestScriptTime;
                    }, this, true);
                }
            }

            // ע�⣺û��Ҫ��ʱ������Ƿ񻺴��ɷ��������ص�Headerͷ����
            this.queryParams = "q=" + encodeURIComponent(this.query) + "&code=utf-8&callback=" + CALLBACK_STR;
            this.fireEvent(BEFORE_DATA_REQUEST, this.query);
            this.dataScript.src = this.dataSource + "?" + this.queryParams;
        },

        /**
         * �����ȡ������
         * @param {Object} data
         */
        handleResponse: function(data) {
            //console.log("handle response");
            if (this._scriptDataIsOut) return; // �����������ݣ�����ᵼ��bug��1. ����keyֵ���ԣ� 2. �������ݵ��µ�����

            this.returnedData = data;
            this.fireEvent(ON_DATA_RETURN, data);

            // ��ʽ������
            this.returnedData = this.formatData(this.returnedData);

            // �������
            var content = "";
            var len = this.returnedData.length;
            if (len > 0) {
                var list = document.createElement("ol");
                for (var i = 0; i < len; ++i) {
                    var itemData = this.returnedData[i];
                    var li = this.formatItem(itemData["key"], itemData["result"]);
                    // ����keyֵ��attribute��
                    li.setAttribute("key", itemData["key"]);
                    list.appendChild(li);
                }
                content = list;
            }
            this._fillContainer(content);

            // ������ʱ����ӵײ�
            if (len > 0) this.appendBottom();

            // fire event
            if (Lang.trim(this.container.innerHTML)) {
                // ʵ������beforeCache�������û��ĽǶȿ�����beforeShow
                this.fireEvent(BEFORE_SHOW, this.container);
            }

            // cache
            this._dataCache[this.query] = this.container.innerHTML;

            // ��ʾ����
            this._displayContainer();
        },

        /**
         * ��ʽ����������ݶ���Ϊ��׼��ʽ
         * @param {Object} data ��ʽ������3�֣�
         *  1. {"result" : [["key1", "result1"], ["key2", "result2"], ...]}
         *  2. {"result" : ["key1", "key2", ...]}
         *  3. 1��2�����
         *  4. ��׼��ʽ
         *  5. ����1-4�У�ֱ��ȡo["result"]��ֵ
         * @return Object ��׼��ʽ�����ݣ�
         *  [{"key" : "key1", "result" : "result1"}, {"key" : "key2", "result" : "result2"}, ...]
         */
        formatData: function(data) {
            var arr = [];
            if (!data) return arr;
            if (Lang.isArray(data["result"])) data = data["result"];
            var len = data.length;
            if (!len) return arr;

            var item;
            for (var i = 0; i < len; ++i) {
                item = data[i];

                if (Lang.isString(item)) { // ֻ��keyֵʱ
                    arr[i] = {"key" : item};
                } else if (Lang.isArray(item) && item.length >= 2) { // ["key", "result"] ȡ����ǰ2��
                    arr[i] = {"key" : item[0], "result" : item[1]};
                } else {
                    arr[i] = item;
                }
            }
            return arr;
        },

        /**
         * ��ʽ�������
         * @param {String} key ��ѯ�ַ���
         * @param {Number} result ��� �ɲ���
         * @return {HTMLElement}
         */
        formatItem: function(key, result) {
            var li = document.createElement("li");
            var keyEl = document.createElement("span");
            keyEl.className = KEY_EL_CLASS;
            keyEl.appendChild(document.createTextNode(key));
            li.appendChild(keyEl);

            if (typeof result != "undefined") { // ����û��
                var resultText = this.config.resultFormat.replace("%result%", result);
                if (Lang.trim(resultText)) { // ��ֵʱ�Ŵ���
                    var resultEl = document.createElement("span");
                    resultEl.className = RESULT_EL_CLASS;
                    resultEl.appendChild(document.createTextNode(resultText));
                    li.appendChild(resultEl);
                }
            }

            return li;
        },

        /**
         * �����ʾ��ײ�
         */
        appendBottom: function() {
            var bottom = document.createElement("div");
            bottom.className = BOTTOM_CLASS;

            if (this.config.showCloseBtn) {
                var closeBtn = document.createElement("a");
                closeBtn.href = "javascript: void(0)";
                closeBtn.setAttribute("target", "_self"); // bug fix: ����<base target="_blank" />������ᵯ���հ�ҳ��
                closeBtn.className = CLOSE_BTN_CLASS;
                closeBtn.appendChild(document.createTextNode(this.config.closeBtnText));

                // û��Ҫ�����ʱ�������ʧȥ���㣬�Զ��͹ر���
                /*
                 Event.on(closeBtn, "click", function(ev) {
                 Event.stopEvent(ev);
                 this.hidden();
                 }, this, true);
                 */

                bottom.appendChild(closeBtn);
            }

            // ����������ʱ�����
            if (Lang.trim(bottom.innerHTML)) {
                this.container.appendChild(bottom);
            }
        },

        /**
         * �����ʾ��
         * @protected
         * @param {String|HTMLElement} content innerHTML or Child Node
         */
        _fillContainer: function(content) {
            if (content.nodeType == 1) {
                this.container.innerHTML = "";
                this.container.appendChild(content);
            } else {
                this.container.innerHTML = content;
            }

            // һ����������ˣ�selectedItem��û�ˣ���Ҫ����
            this.selectedItem = null;
        },

        /**
         * ����contanier�����ݣ���ʾ����������
         */
        _displayContainer: function() {
            if (Lang.trim(this.container.innerHTML)) {
                this.show();
            } else {
                this.hide();
            }
        },

        /**
         * ѡ����ʾ���е���/��һ����
         * @param {Boolean} down true��ʾdown��false��ʾup
         */
        selectItem: function(down) {
            //console.log("select item " + down);
            var items = this.container.getElementsByTagName("li");
            if (items.length == 0) return;

            // �п�����ESC�����ˣ�ֱ����ʾ����
            if (!this.isVisible()){
                this.show();
                return; // ����ԭ����ѡ��״̬
            }
            var newSelectedItem;

            // û��ѡ����ʱ��ѡ�е�һ/�����
            if (!this.selectedItem) {
                newSelectedItem = items[down ? 0 : items.length - 1];
            } else {
                // ѡ����/��һ��
                newSelectedItem = Dom[down ? "getNextSibling" : "getPreviousSibling"](this.selectedItem);
                // �Ѿ��������/ǰһ��ʱ����λ������򣬲���ԭ����ֵ
                if (!newSelectedItem) {
                    this.textInput.value = this.query;
                }
            }

            // �Ƴ���ǰѡ����
            this._removeSelectedItem();

            // ѡ������
            if (newSelectedItem) {
                this._setSelectedItem(newSelectedItem);
                this._updateInputFromSelectItem();
            }
        },

        /**
         * �Ƴ�ѡ����
         * @protected
         */
        _removeSelectedItem: function() {
            //console.log("remove selected item");
            Dom.removeClass(this.selectedItem, SELECTED_ITEM_CLASS);
            this.selectedItem = null;
        },

        /**
         * ���õ�ǰѡ����
         * @protected
         * @param {HTMLElement} item
         */
        _setSelectedItem: function(item) {
            //console.log("set selected item");
            Dom.addClass((item), SELECTED_ITEM_CLASS);
            this.selectedItem = (item);
        },

        /**
         * ��ȡ��ʾ����ѡ�����key�ַ���
         * @protected
         */
        _getSelectedItemKey: function() {
            if (!this.selectedItem) return "";

            // getElementsByClassName�Ƚ�������ܣ����û������ݵ�attribute�Ϸ���
            //var keyEl = Dom.getElementsByClassName(KEY_EL_CLASS, "*", this.selectedItem)[0];
            //return keyEl.innerHTML;

            return this.selectedItem.getAttribute("key");
        },

        /**
         * ��textInput��ֵ���µ�this.query
         * @protected
         */
        _updateQueryValueFromInput: function() {
            this.query = this.textInput.value;
        },

        /**
         * ��ѡ�����ֵ���µ�textInput
         * @protected
         */
        _updateInputFromSelectItem: function() {
            this.textInput.value = this._getSelectedItemKey(this.selectedItem);
        }

    });

    Lang.augmentProto(NS.Suggest, Y.EventProvider);

    /**
     * ��ǰ�����ʵ��
     * @static
     */
    NS.Suggest.focusInstance = null;

    /**
     * ��jsonp�л�ȡ����
     * @method callback
     */
    NS.Suggest.callback = function(data) {
        if (!NS.Suggest.focusInstance) return;
        // ʹ��������script.onload�¼���Ȼ����ִ��callback����
        setTimeout(function() {
            NS.Suggest.focusInstance.handleResponse(data);
        }, 0);
    };

})(KISSY);


/**
 * С�᣺
 *
 * ����������룬�����󲿷���ɣ����ݴ��� + �¼�����
 *
 * һ�����ݴ����core���������˵�Ǽ򵥵ģ��� requestData + handleResponse + formatData�ȸ����������
 * ��Ҫע�����㣺
 *  a. IE�У��ı�script.src, ���Զ�ȡ����֮ǰ�����󣬲����������󡣷�IE�У������´���script���С�����
 *     requestData�����д������ִ���ʽ��ԭ��
 *  b. �����ٺ��������ݷ���ʱ���û�����������Ѹı䣬�Ѿ��������ͳ�ȥ����Ҫ�����������ݡ�Ŀǰ���ü�ʱ���
 *     �Ľ�����������õĽ�������ǣ�����API��ʹ�÷��ص������У�����queryֵ��
 *
 * �����¼������Ƽ򵥣�ʵ�����в������壬��2���֣�
 *  1. ������focus/blur�¼� + ���̿����¼�
 *  2. ��ʾ���ϵ���������͵���¼�
 * ��Ҫע�����¼��㣺
 *  a. ��Ϊ�����ʾ��ʱ�����Ȼᴥ��������blur�¼���blur�¼��е���hide��������ʾ��һ�����غ󣬾Ͳ��񲻵�
 *     ����¼��ˡ�������� this._mouseHovering ���ų����������ʹ��blurʱ���ᴥ��hide������ʾ��ĵ��
 *     �¼������д�����2009-06-18���£�����mouseup�����click�¼��������������˺ࣩܶ
 *  b. ������ƶ���ĳ���ͨ�����¼�ѡ��ĳ��ʱ����this.selectedItem��ֵ������ʾ��������������ʱ������
 *     this.selectedItem. ���ִ���ʽ��google��һ�£�����ʹ��ѡ��ĳ����أ��ٴδ�ʱ������ѡ��ԭ��
 *     ��ѡ���
 *  c. ��ie��������У������������ENTER��ʱ�����Զ��ύ�������form.target="_blank", �Զ��ύ��JS�ύ
 *     ��������ύҳ�档��������ȡ����JS�в��ύ�Ĳ��ԣ�ENTER���Ƿ��ύ������ȫ��HTML���������������
 *     ��Ҳ��ʹ�����������Ӧ���ڲ���Ҫ�ύ���ĳ����С���2009-06-18���£�����ͨ��blur()ȡ�����������Ĭ��
 *     Enter��Ӧ��������ʹ�ô����߼���mouseup��һ�£�
 *  d. onItemSelect ���������ѡ��ĳ�� �� ����ѡ��ĳ��س� �󴥷���
 *  e. ��textInput�ᴥ�����ύʱ����enter keydown �� keyup֮�䣬�ͻᴥ���ύ�������keydown�в�׽�¼���
 *     ������keydown���ܲ�׽������DOWN/UP����keyup�оͲ����ˡ�
 *
 * ���õ���һЩ��̾��顿��
 *  1. ְ��һԭ�򡣷�����ְ��Ҫ��һ������hide������show���������˸ı�visibility, �Ͳ�Ҫӵ���������ܡ���
 *     ���Ƽ򵥣���Ҫ����ȴ�������ס�����ְ��һ�����ּ򵥵ĺô��ǣ�����������߼��������������Ŀɸ�����Ҳ��
 *     ���ˡ�
 *  2. С���¼��������¼�֮���й���ʱ��Ҫ��ϸ���������ƺú���д���롣����������blur����ʾ���click�¼���
 *  3. ���Ե���Ҫ�ԡ�Ŀǰ���г�Test Cases���Ժ�Ҫ�����Զ�������֤ÿ�θĶ��󣬶���Ӱ��ԭ�й��ܡ�
 *  4. ��ѡ��ȷ���¼�����ȷ���£�̫��Ҫ�ˣ���ʡȥ�ܶ�ܶෳ�ա�
 *
 */

/**
 * 2009-08-05 ���£� �� class �����������ƶ���������ԭ���ǣ��޸�Ĭ�� className �Ŀ����Ժ�С��������һ��
 *                  containerClass ��Ϊ���Ի���ʽ�Ľӿڼ���
 */
