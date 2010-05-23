/**
 * @module  cookie
 * @author  lifesinger@gmail.com
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

        set: function(name, val, expires, domain, path, secure) {
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

            // domain
            if (isNotEmptyString(domain)) {
                text += '; domain=' + domain;
            }

            // path
            if (isNotEmptyString(path)) {
                text += '; path=' + path;
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
 * NOTES:
 *
 *  2010.04
 *   - get ����Ҫ���� ie �£�
 *     ֵΪ�յ� cookie Ϊ 'test3; test3=3; test3tt=2; test1=t1test3; test3', û�е��ںš�
 *     ���������ȡ�������� split �ַ����ķ�ʽ����ȡ��
 *   - api ����ϣ�ԭ������ jQuery �ļ������S.cookie(name, ...), �����ǵ�����չ�ԣ�Ŀǰ
 *     �����ɾ�̬������ķ�ʽ���š�
 *
 */
