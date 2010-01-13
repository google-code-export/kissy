/**
 * KISSY.Combine ����㷨����
 *
 * @creator     ��<lifesinger@gmail.com>
 * @ref         http://bbs.51js.com/viewthread.php?tid=85574
 */

var KISSY = window.KISSY || {};

KISSY.Combine = function(n, m) {
    var r = [];

    function first() {
        this._next = next;

        // seed
        for (var i = 0; i < m; i++) r.push(i);
        return r;
    }

    function next() {
        var p = m - 1, max = n - 1;

        // increase
        if(r[p] < max) {
            r[p]++;
            return r;
        }

        // carry
        if(r[0] === n - m) return null;
        while (r[--p] === --max) { }
        r[p]++;
        for (var i = p + 1; i < m; i++) r[i] = r[i - 1] + 1;
        return r;
    }

    return {

        /**
         * ��ȡ��һ�����
         * @return {Array} �������һ����Ϻ󣬷��� null
         * @private
         */
        _next: first,

        /**
         * ��ȡ�� i �����
         * @param {number} i 0-based
         * @return {Array} ������ʱ������ null
         */
        item: function(i) {
            this._next = first; // reset

            while(i--) this._next();
            return this._next().concat();
        },

        /**
         * �������
         * @private
         */
        _count: null,

        /**
         * ��ȡ�������
         * @return {number}
         */
        count: function() {
            if(this._count !== null) return this._count;

            var t1 = 1, t2 = 1, i;
            for(i = n; i > n - m; i--) t1 *= i;
            for(i = m; i > 1; i--) t2 *= i;

            this._count = t1 / t2;
            return this._count;
        }
    };
};

/**
 * NOTES:
 *   - �������飺arr.slice(0) ���ܲ��� arr.concat()
 *   - ��������Ŀ����ܴ���� next ������� r.concat(). ��Ҫ��ȡ�������ʱ���� item ����
 *
 * TODO:
 *   - random(num, repeat)
 *   - item ����� cache �Ż�
 *   - ģ����͸��СӦ��
 */
