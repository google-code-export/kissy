
KISSY.Editor.add("core~instance", function(E) {

    var Y = YAHOO.util, Dom = Y.Dom, Event = Y.Event, Lang = YAHOO.lang,
        EDITOR_CLASSNAME = "ks-editor",

        EDITOR_TMPL  =  '<div class="ks-editor-toolbar"></div>' +
                        '<div class="ks-editor-content"><iframe frameborder="0" allowtransparency="true"></iframe></div>' +
                        '<div class="ks-editor-statusbar"></div>',

        CONTENT_TMPL =  '<!DOCTYPE html>' +
                        '<html>' +
                        '<head>' +
                        '<title>Rich Text Area</title>' +
                        '<meta http-equiv="content-type" content="text/html; charset=gb18030" />' +
                        '<link type="text/css" href="{CONTENT_CSS}" rel="stylesheet" />' +
                        '</head>' +
                        '<body>{CONTENT}</body>' +
                        '</html>',

        THEMES_DIR = "themes",
        //EDITOR_CSS = "editor.css", TODO: ��̬���� editor.css
        CONTENT_CSS =  "content.css";

    /**
     * �༭����ʵ����
     */
    E.Instance = function(textarea, config) {
        /**
         * ������� textarea Ԫ��
         */
        this.textarea = Dom.get(textarea);

        /**
         * ������
         */
        this.config = Lang.merge(E.config, config || {});

        /**
         * ������ renderUI �и�ֵ
         * @property container
         * @property contentWin
         * @property contentDoc
         * @property statusbar
         */

        /**
         * ���ʵ����صĲ��
         */
        //this.plugins = [];

        /**
         * �Ƿ���Դ��༭״̬
         */
        this.sourceMode = false;

        /**
         * ������
         */
        this.toolbar = new E.Toolbar(this);

        /**
         * ״̬��
         */
        this.statusbar = new E.Statusbar(this);

        // init
        this._init();
    };

    Lang.augmentObject(E.Instance.prototype, {
        /**
         * ��ʼ������
         */
        _init: function() {
            this._renderUI();
            this._initPlugins();
        },

        _renderUI: function() {
            this._renderContainer();
            this._setupContentPanel();
        },

        /**
         * ��ʼ�����в��
         */
        _initPlugins: function() {
            var key, p,
                staticPlugins = E.plugins,
                plugins = [];

            // ÿ��ʵ����ӵ��һ���Լ��� plugins �б�
            for(key in staticPlugins) {
                plugins[key] = staticPlugins[key];
            }
            this.plugins = plugins;

            // �������ϵĲ��
            this.toolbar.init();

            // ״̬���ϵĲ��
            this.statusbar.init();
            
            // �������
            for(key in plugins) {
                p = plugins[key];
                if(p.inited) continue;

                p.editor = this; // �� p ���� editor ����
                if(p.init) {
                    p.init();
                }
                p.inited = true;
            }
        },

        /**
         * ���� DOM �ṹ
         */
        _renderContainer: function() {
            var textarea = this.textarea,
                region = Dom.getRegion(textarea),
                width = (region.right - region.left - 2) + "px", // YUI �� getRegion �� 2px ƫ��
                height = (region.bottom - region.top - 2) + "px",
                container = document.createElement("div"),
                content, iframe;

            container.className = EDITOR_CLASSNAME;
            container.style.width = width;
            container.innerHTML = EDITOR_TMPL;

            content = container.childNodes[1];
            content.style.width = "100%";
            content.style.height = height;

            iframe = content.childNodes[0];
            iframe.style.width = "100%";
            iframe.style.height = "100%";
            iframe.setAttribute("frameBorder", 0);

            textarea.style.display = "none";
            Dom.insertBefore(container, textarea);

            this.container = container;
            this.toolbar.domEl = container.childNodes[0];
            this.contentWin = iframe.contentWindow;
            this.contentDoc = iframe.contentWindow.document;
            
            this.statusbar.domEl = container.childNodes[2];

            // TODO Ŀǰ�Ǹ��� textatea �Ŀ�����趨 editor �Ŀ�ȡ����Կ��� config ��ָ�����
        },

        _setupContentPanel: function() {
            var doc = this.contentDoc,
                config = this.config,
                contentCSSUrl = config.base + THEMES_DIR + "/" + config.theme + "/" + CONTENT_CSS;

            // ��ʼ�� iframe ������
            doc.open();
            doc.write(CONTENT_TMPL
                    .replace("{CONTENT_CSS}", contentCSSUrl)
                    .replace("{CONTENT}", this.textarea.value));
            doc.close();

            doc.designMode = "on";
            // ע1���� tinymce �designMode = "on" ���� try catch �
            //     ԭ������ firefox �£���iframe �� display: none ��������ᵼ�´���
            //     �������Ҳ��ԣ�firefox 3+ �������޴�����
            // ע2���� tinymce ������ ie ������ contentEditable = true.
            //     ԭ������ ie �£�IE needs to use contentEditable or it will display non secure items for HTTPS
            //     �����ʱ����ӣ����Ժ�����������ʱ�ټ��ϡ�

            // �ر� firefox Ĭ�ϴ򿪵� spellcheck
            //doc.body.setAttribute("spellcheck", "false");

            // TODO �� ie ��ѡ�񱳾�ɫΪ ���װ���

            // �ó�ʼ��������ʼ���� p ��ǩ��
//            Event.on(doc, "click", function() {
//                if(Lang.trim(E.Dom.getText(doc.body.innerHTML)).length === 0) {
//                    doc.body.innerHTML = ""; // �������
//
//                    var p = document.createElement("p");
//                    doc.body.appendChild(p);
//
//                    var range = this.getSelectionRange();
//                    range.insertNode(p);
//                    // TODO
//                }
//            });
        },

        /**
         * ִ�� execCommand
         */
        execCommand: function(commandName, val, styleWithCSS) {
            this.contentWin.focus(); // ��ԭ����
            E.Command.exec(this.contentDoc, commandName, val, styleWithCSS);
        },

        /**
         * ��ȡ����
         */
        getData: function() {
            if(this.sourceMode) {
                return this.textarea.value;
            }
            return this.getContentDocData();
        },

        /**
         * ��ȡ contentDoc �е�����
         */
        getContentDocData: function() {
            var bd = this.contentDoc.body,
                data = "", p = E.plugins["save"];

            // Firefox �£�_moz_editor_bogus_node, _moz_dirty ����������
            // ��Щ�������ԣ����� innerHTML ��ȡʱ���Զ�������

            // ֻ�б�ǩû�ı�����ʱ����������Ϊ��
            if(E.Dom.getText(bd)) {
               data = bd.innerHTML;

                if(p && p.filterData) {
                    data = p.filterData(data);
                }
            }

            return data;
        },

        /**
         * ��ȡѡ������� Range ����
         */
        getSelectionRange: function() {
            return E.Range.getSelectionRange(this.contentWin);
        }
    });

});
