/**
 * @module  cookie
 * @author  lifesinger@gmail.com
 * @depends kissy
 */

KISSY.add('cookie', function(S) {

    var doc = document,
        encode = encodeURIComponent,
        decode = decodeURIComponent;

    S.Cookie = {

        /**
         * ��ȡ cookie ֵ
         * @return {string} ��� name �����ڣ����� undefined
         */
        get: function(name) {
            var ret, m;

            if (isNotEmptyString(name)) {
                if ((m = doc.cookie.match('(?:^| )' + name + '(?:(?:=([^;]*))|;|$)'))) {
                    ret = m[1] ? decode(m[1]) : '';
                }
            }
            return ret;
        },

        set: function(name, val, expires, path, domain, secure) {
            var text = encode(val), date = expires;

            // �ӵ�ǰʱ�俪ʼ������������
            if (typeof date === 'number') {
                date = new Date();
                date.setTime(date.getTime() + expires * 86400000);
            }
            // expiration date
            if (date instanceof Date) {
                text += '; expires=' + date.toUTCString();
            }

            // path
            if (isNotEmptyString(path)) {
                text += '; path=' + path;
            }

            // domain
            if (isNotEmptyString(domain)) {
                text += '; domain=' + domain;
            }

            // secure
            if (secure) {
                text += '; secure';
            }

            doc.cookie = name + '=' + text;
        },

        remove: function(name) {
            // ���̹���
            this.set(name, '', 0);
        }
    };

    function isNotEmptyString(val) {
        return typeof val === 'string' && val !== '';
    }

});

/**
 * Notes:
 *
 *  2010.04
 *   - get ����Ҫ���� ie �£�
 *     ֵΪ�յ� cookie Ϊ 'test3; test3=3; test3tt=2; test1=t1test3; test3', û�е��ںš�
 *     ���������ȡ�������� split �ַ����ķ�ʽ����ȡ��
 *
 */