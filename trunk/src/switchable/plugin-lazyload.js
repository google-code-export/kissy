/**
 * Switchable Lazyload Plugin
 * @creator     ��<lifesinger@gmail.com>
 * @depends     kissy, yui-base, switchable, datalazyload
 */
KISSY.add('switchable-lazyload', function(S) {

    var Y = YAHOO.util, Dom = Y.Dom,
        BEFORE_SWITCH = 'beforeSwitch',
        IMG_SRC = 'img-src', TEXTAREA_DATA = 'textarea-data',
        FLAGS = {},
        Switchable = S.Switchable,
        DataLazyload = S.DataLazyload;

    FLAGS[IMG_SRC] = 'data-lazyload-src-custom';
    FLAGS[TEXTAREA_DATA] = 'ks-datalazyload-custom';

    /**
     * ���Ĭ������
     */
    S.mix(Switchable.Config, {
        lazyDataType: '', // 'img-src' or 'textarea-data'
        lazyDataFlag: ''  // 'data-lazyload-src-custom' or 'ks-datalazyload-custom'
    });

    /**
     * ֯���ʼ������
     */
    Switchable.Plugins.push({
        name: 'autoplay',

        init: function(host) {
            var cfg = host.config,
                type = cfg.lazyDataType, flag = cfg.lazyDataFlag || FLAGS[type];
            if (!DataLazyload || !type || !flag) return; // û���ӳ���

            host.subscribe(BEFORE_SWITCH, loadLazyData);

            /**
             * �����ӳ�����
             */
            function loadLazyData(index) {
                var steps = cfg.steps,
                    from = index * steps ,
                    to = from + steps;

                DataLazyload.loadCustomLazyData(host.panels.slice(from, to), type, flag);
                if (isAllDone()) {
                    host.unsubscribe(BEFORE_SWITCH, loadLazyData);
                }
            }

            /**
             * �Ƿ��Ѽ������
             */
            function isAllDone() {
                var imgs, textareas, i, len;

                if (type === IMG_SRC) {
                    imgs = host.container.getElementsByTagName('img');
                    for (i = 0,len = imgs.length; i < len; i++) {
                        if (imgs[i].getAttribute(flag)) return false;
                    }
                } else if (type === TEXTAREA_DATA) {
                    textareas = host.container.getElementsByTagName('textarea');
                    for (i = 0,len = textareas.length; i < len; i++) {
                        if (Dom.hasClass(textareas[i], flag)) return false;
                    }
                }

                return true;
            }

        }
    });
});
