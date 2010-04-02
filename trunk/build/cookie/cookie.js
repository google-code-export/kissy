/*
Copyright 2010, KISSY UI Library v1.0.5
MIT Licensed
build: 516 Apr 2 09:07
*/
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
 * Notes:
 *
 *  2010.04
 *   - get ����Ҫ���� ie �£�
 *     ֵΪ�յ� cookie Ϊ 'test3; test3=3; test3tt=2; test1=t1test3; test3', û�е��ںš�
 *     ���������ȡ�������� split �ַ����ķ�ʽ����ȡ��
 *   - api ����ϣ������Բ�ȡ jQuery �ļ������S.cookie(name, ...), �����ǵ�����չ�ԣ�Ŀǰ
 *     �����ɾ�̬������ķ�ʽ���š�
 *
 */