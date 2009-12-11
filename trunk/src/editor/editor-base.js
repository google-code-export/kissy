/**
 * KISSY.Editor ���ı��༭��
 * @module      editor
 * @creator     ��<lifesinger@gmail.com>
 * @depends     kissy-core, yahoo-dom-event
 */
KISSY.add("editor", function(S) {

    /**
     * @constructor
     * @param {string|HTMLElement} textarea
     * @param {object} config
     */
    function Editor(textarea, config) {
        var E = Editor;
        // allow instantiation without the new operator
        if (!(this instanceof E)) {
            return new E(textarea, config);
        }

        if (!E._isReady) {
            E._setup();
        }
        return new E.Instance(textarea, config);
    }

    S.mix(Editor, {
        /**
         * �汾��
         */
        version: "1.0",

        /**
         * �������ã��� lang Ŀ¼���
         */
        lang: {},

        /**
         * ����ע��Ĳ��
         * ע��plugin = { name: pluginName, type: pluginType, init: initFn, ... }
         */
        plugins: {},

        /**
         * ��Ӳ��
         * @param {string|Array} name
         */
        addPlugin: function(name, p) {
            var arr = typeof name == "string" ? [name] : name,
                plugins = this.plugins,
                key, i, len;

            for (i = 0,len = arr.length; i < len; ++i) {
                key = arr[i];

                if (!plugins[key]) { // ��������
                    plugins[key] = S.merge(p, {
                        name: key
                    });
                }
            }
        },

        /**
         * �Ƿ������ setup
         */
        _isReady: false,

        /**
         * setup to use
         */
        _setup: function() {
            this._loadModules();
            this._isReady = true;
        },

        /**
         * �Ѽ��ص�ģ��
         */
        _attached: {},

        /**
         * ����ע�������ģ��
         */
        _loadModules: function() {
            var mods = KISSY.Editor.Env.mods,
                attached = this._attached,
                name, m;

            for (name in mods) {
                m = mods[name];
                if (m) {
                    attached[name] = m;
                    if (m.fn) {
                        m.fn(this);
                    }
                }
                // ע�⣺m.details ��ʱû�õ�������Ԥ������չ�ӿ�
            }

            // TODO
            // lang �ļ��ؿ����ӳٵ�ʵ����ʱ��ֻ���ص�ǰ lang
        }
    });

    S.Editor = Editor;
});

KISSY.Editor = {
    /**
     * ȫ�ֻ�������
     */
    Env: {
        /**
         * ������ӵ�ģ��
         * ע��mod = { name: modName, fn: initFn, details: {...} }
         */
        mods: {}
    },

    /**
     * ���ģ��
     */
    add: function(name, fn, details) {

        this.Env.mods[name] = {
            name: name,
            fn: fn,
            details: details || {}
        };

        return this; // chain support
    }
};

// TODO
// 1. �Զ��滻ҳ���е� textarea ? Լ�������� class �Ĳ��滻
