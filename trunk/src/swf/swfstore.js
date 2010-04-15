/**
 * Provides a swf based storage implementation.
 */

KISSY.add('swfstore', function(S, undefined) {

    var UA = S.UA, Cookie = S.Cookie,
        SWFSTORE = 'swfstore',
        doc = document;

    /**
     * Class for the YUI SWFStore util.
     * @constructor
     * @param {String} swfUrl The URL of the SWF to be embedded into the page.
     * @param container {String|HTMLElement} Container element for the Flash Player instance.
     * @param shareData {Boolean} Whether or not data should be shared across browsers
     * @param useCompression {Boolean} Container element for the Flash Player instance
     */
    function SWFStore(swfUrl, container, shareData, useCompression) {
        var browser = 'other',
            cookie = Cookie.get(SWFSTORE),
            params,
            self = this;

        // convert booleans to strings for flashvars compatibility
        shareData = (shareData !== undefined ? shareData : true) + '';
        useCompression = (useCompression !== undefined ? useCompression : true) + '';

        // browser detection
        if (UA.ie) browser = 'ie';
        else if (UA.gecko) browser = 'gecko';
        else if (UA.webkit) browser = 'webkit';
        else if (UA.opera) browser = 'opera';

        // set cookie
        if (!cookie || cookie === 'null') {
            Cookie.set(SWFSTORE, (cookie = Math.round(Math.random() * Math.PI * 100000)));
        }

        params = {
            version: 9.115,
            useExpressInstall: false,
            fixedAttributes: {
                allowScriptAccess:'always',
                allowNetworking:'all',
                scale:'noScale'
            },
            flashVars: {
                allowedDomain : doc.location.hostname,
                shareData: shareData,
                browser: cookie,
                useCompression: useCompression
            }
        };

        // ���û�д��룬���Զ�����
        if(!container) {
            // ע��container �� style ������ visibility:hidden or display: none, �����쳣
            container = new S.Node('<div style="height:0;width:0;overflow:hidden"></div>').appendTo(doc.body)[0];
        }
        self.embeddedSWF = new S.SWF(container, swfUrl || 'swfstore.swf', params);

        // �� flash fired events ��֪ͨ�� swfstore
        self.embeddedSWF._eventHandler = function(event) {
            S.SWF.prototype._eventHandler.call(self, event);
        }
    }

    // events support
    S.augment(SWFStore, S.EventTarget);

    // methods
    S.augment(SWFStore, {
        /**
         * Saves data to local storage. It returns a String that can
         * be one of three values: 'true' if the storage succeeded; 'false' if the user
         * has denied storage on their machine or storage space allotted is not sufficient.
         * <p>The size limit for the passed parameters is ~40Kb.</p>
         * @param data {Object} The data to store
         * @param key {String} The name of the 'cookie' or store
         * @return {Boolean} Whether or not the save was successful
         */
        setItem: function(key, data) {
            if (typeof data === 'string') { // ����ͨ��
                // double encode strings to prevent parsing error
                // http://yuilibrary.com/projects/yui2/ticket/2528593
                data = data.replace(/\\/g, '\\\\');
            } else {
                data = S.JSON.stringify(data) + ''; // ���磺stringify(undefined) = undefined, ǿ��ת��Ϊ�ַ���
            }

            // �� name Ϊ��ֵʱ��Ŀǰ�ᴥ�� swf ���ڲ��쳣���˴�������ռ�ֵ
            if ((key = S.trim(key + ''))) {
                try {
                    return this.embeddedSWF.callSWF('setItem', [key, data]);
                }
                catch(e) { // �� swf �쳣ʱ����һ��������Ϣ
                    this.fire('error', { message: e });
                }
            }
        },

        /**
         * alias for getVauleOf
         */
        getItem: function(key) {
            return this.embeddedSWF.callSWF('getValueOf', [key]);
        }
    });

    S.each([
        'getValueAt', 'getNameAt', //'getTypeAt',
        'getValueOf', //'getTypeOf',
        'getItems', 'getLength',
        'removeItem', 'removeItemAt', 'clear',
        //'getShareData', 'setShareData',
        //'getUseCompression', 'setUseCompression',
        'calculateCurrentSize', 'hasAdequateDimensions', 'setSize',
        'getModificationDate', 'displaySettings'
    ], function(methodName) {
        SWFStore.prototype[methodName] = function() {
            try {
                return this.embeddedSWF.callSWF(methodName, S.makeArray(arguments));
            }
            catch(e) { // �� swf �쳣ʱ����һ��������Ϣ
                this.fire('error', { message: e });
            }
        }
    });

    S.SWFStore = SWFStore;
});

/**
 * NOTES:
 *
 *  - [2010-04-09] yubo: ȥ�� getTypeAt, getTypeOf, getShareData �����ú͵���
 *     ���ʺ�С�Ľӿڣ���Ը�ټ����ӿڣ�Ҳ��Ϊ�˹��ܶ�����
 *
 * TODO:
 *   - �㲥���ܣ��������б仯ʱ���Զ�֪ͨ����ҳ��
 *   - Bug: ��� Remove, �� name ������ʱ���Ὣ���һ��ɾ��
 *   - container �� overflow:hidden �Ƿ��б�Ҫ?
 */
