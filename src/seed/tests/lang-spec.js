describe('lang.js', function() {

    var S = KISSY,
        host = S.__HOST,
        doc = host['document'],
        web = host['setInterval'],
        fn = function() {
        };

    it('S.type', function() {
        expect(S.type(null)).toBe('null');

        expect(S.type(undefined)).toBe('undefined');
        expect(S.type()).toBe('undefined');

        expect(S.type(true)).toBe('boolean');
        expect(S.type(false)).toBe('boolean');
        expect(S.type(Boolean(true))).toBe('boolean');

        expect(S.type(1)).toBe('number');
        expect(S.type(0)).toBe('number');
        expect(S.type(Number(1))).toBe('number');

        expect(S.type('')).toBe('string');
        expect(S.type('a')).toBe('string');
        expect(S.type(String('a'))).toBe('string');

        expect(S.type({})).toBe('object');

        expect(S.type(/foo/)).toBe('regexp');
        expect(S.type(new RegExp('asdf'))).toBe('regexp');

        expect(S.type([1])).toBe('array');

        expect(S.type(new Date())).toBe('date');

        expect(S.type(new Function('return;'))).toBe('function');
        expect(S.type(fn)).toBe('function');

        expect(S.type(host)).toBe('object');

        if (web) {
            expect(S.type(doc)).toBe('object');
            expect(S.type(doc.body)).toBe('object');
            expect(S.type(doc.createTextNode('foo'))).toBe('object');
            expect(S.type(doc.getElementsByTagName('*'))).toBe('object');
        }
    });

    it('S.isNull', function() {
        expect(S.isNull(null)).toBe(true);
        expect(S.isNull()).toBe(false);
    });

    it('S.isUndefined', function() {
        expect(S.isUndefined(null)).toBe(false);
        expect(S.isUndefined()).toBe(true);
        expect(S.isUndefined(undefined)).toBe(true);
    });

    it('S.isBoolean', function() {
        expect(S.isBoolean(true)).toBe(true);
        expect(S.isBoolean(false)).toBe(true);
        expect(S.isBoolean(Boolean(false))).toBe(true);
        expect(S.isBoolean(!1)).toBe(true);

        expect(S.isBoolean()).toBe(false);
        expect(S.isBoolean(null)).toBe(false);
        expect(S.isBoolean({})).toBe(false);
        expect(S.isBoolean(host)).toBe(false);
    });

    it('S.isNumber', function() {
        expect(S.isNumber(1)).toBe(true);
        expect(S.isNumber(0)).toBe(true);
        expect(S.isNumber(Number(1))).toBe(true);

        expect(S.isNumber(Infinity)).toBe(true);
        expect(S.isNumber(-Infinity)).toBe(true);
        expect(S.isNumber(NaN)).toBe(true);

        expect(S.isNumber({})).toBe(false);
        expect(S.isNumber('1')).toBe(false);
    });

    it('S.isString', function() {
        expect(S.isString('')).toBe(true);
        expect(S.isString('a')).toBe(true);
        expect(S.isString(String('a'))).toBe(true);

        expect(S.isString()).toBe(false);
        expect(S.isString({})).toBe(false);
        expect(S.isString(null)).toBe(false);
        expect(S.isString(host)).toBe(false);
    });

    it('S.isFunction', function() {
        // Make sure that false values return false
        expect(S.isFunction()).toBe(false);
        expect(S.isFunction(null)).toBe(false);
        expect(S.isFunction(undefined)).toBe(false);
        expect(S.isFunction('')).toBe(false);
        expect(S.isFunction(0)).toBe(false);

        // Check built-ins
        expect(S.isFunction(String)).toBe(true);
        expect(S.isFunction(Array)).toBe(true);
        expect(S.isFunction(Object)).toBe(true);
        expect(S.isFunction(Function)).toBe(true);

        // Check string, object etc.
        expect(S.isFunction('str')).toBe(false);
        expect(S.isFunction(['arr'])).toBe(false);
        expect(S.isFunction({})).toBe(false);

    	// Make sure normal functions still work
        expect(S.isFunction(fn)).toBe(true);

        // exclude dom elements
        if (web) {
            expect(S.isFunction(doc.createElement('object'))).toBe(false);
            expect(S.isFunction(doc.body.childNodes)).toBe(false);
            expect(S.isFunction(doc.body.firstChild)).toBe(false);
        }
    });

    it('S.isArray', function() {
        expect(S.isArray([])).toBe(true);

        expect(S.isArray()).toBe(false);
        expect(S.isArray(arguments)).toBe(false);

        if(web) {
            expect(S.isArray(doc.getElementsByTagName('*'))).toBe(false);
        }
    });

    it('S.isDate', function() {
        expect(S.isDate(new Date())).toBe(true);
        expect(S.isDate('2010/12/5')).toBe(false);
    });

    it('S.isRegExp', function() {
        expect(S.isRegExp(/s/)).toBe(true);
        expect(S.isRegExp(new RegExp('asdf'))).toBe(true);
    });

    it('S.isObject', function() {
        expect(S.isObject({})).toBe(true);
        expect(S.isObject(new fn())).toBe(true);
        expect(S.isObject(host)).toBe(true);

        expect(S.isObject()).toBe(false);
        expect(S.isObject(null)).toBe(false);
        expect(S.isObject(1)).toBe(false);
        expect(S.isObject('a')).toBe(false);
        expect(S.isObject(true)).toBe(false);
    });

    it('S.isEmptyObject', function() {
        expect(S.isEmptyObject({})).toBe(true);
        expect(S.isEmptyObject(new Object())).toBe(true);

        expect(S.isEmptyObject({ a: 1 })).toBe(false);
        expect(S.isEmptyObject([])).toBe(true);

        // Failed in Safari/Opera
        //expect(S.isEmptyObject(fn)).toBe(true);
    });

    it('S.isPlainObject', function() {
        // The use case that we want to match
        expect(S.isPlainObject({})).toBe(true);
        expect(S.isPlainObject(new fn)).toBe(true);

        // Not objects shouldn't be matched
        expect(S.isPlainObject('')).toBe('');
        expect(S.isPlainObject(0)).toBe(0);
        expect(S.isPlainObject(1)).toBe(false);
        expect(S.isPlainObject(true)).toBe(false);
        expect(S.isPlainObject(null)).toBe(null);
        expect(S.isPlainObject(undefined)).toBe(undefined);
        expect(S.isPlainObject([])).toBe(false);
        expect(S.isPlainObject(new Date)).toBe(false);
        expect(S.isPlainObject(fn)).toBe(false);

        // DOM Element
        if(web) {
            expect(S.isPlainObject(doc.createElement('div'))).toBe(false);
        }

        // Host
        expect(S.isPlainObject(host)).toBe(false);
    });

    it('S.clone', function() {
        // non array or plain object, just return
        expect(S.clone()).toBe(undefined);
        expect(S.clone(null)).toBe(null);
        expect(S.clone(1)).toBe(1);
        expect(S.clone(true)).toBe(true);
        expect(S.clone('a')).toBe('a');
        expect(S.clone(fn)).toBe(fn);


        // clone plain object
        var t = { a: 0, b: { b1: 1, b2: 'a' } };
        var t2 = S.clone(t);
        t.a = 1;
        expect(t2.a).toBe(0);
        expect(t2.b.b1).toBe(1);
        t2.b.b2 = 'b';
        expect(t2.b.b2).toBe('b');

        // clone array
        var t3 = ['a', 2, 3, t];
        var t4 = S.clone(t3);
        t3[1] = 1;
        t3.push(5);
        expect(t4[1]).toBe(2);
        expect(t4.length).toBe(4);

        // recursive clone
        var CLONE_MARKER = '__~ks_cloned',
            Tom = {},
            Green = {
                father: Tom
            };
        Tom.son = Green;

        var Tom2 = S.clone(Tom);
        expect(Tom2.son).toEqual(Green);
        expect(Tom2[CLONE_MARKER]).toBeUndefined();

        var Green2 = S.clone(Green);
        expect(Green2.father).toEqual(Tom);
        expect(Green2[CLONE_MARKER]).toBeUndefined();

        // filter function
        var t5 = [1, 2, 3, 4, 5, 6];
        var t6 = S.clone(t5, function(v) { return v % 2 === 0; });
        expect(t6.length).toBe(3);
        expect(t6[0]).toBe(2);
        expect(t6[1]).toBe(4);
        expect(t6[2]).toBe(6);
    });

    it('S.trim', function() {
        var str = '    lots of spaces before and after    ';
        expect(S.trim(str)).toBe('lots of spaces before and after');

        // special
        expect(S.trim(false)).toBe('false');
        expect(S.trim(0)).toBe('0');
        expect(S.trim('')).toBe('');
        expect(S.trim(NaN)).toBe('NaN');
        expect(S.trim(null)).toBe('');
        expect(S.trim()).toBe('');
        expect(S.trim({})).toBe({}.toString());
    });

    it('S.substitute', function() {
        var myString = "{subject} is {property_1} and {property_2}.";
        var myObject = {subject: 'Jack Bauer', property_1: 'our lord', property_2: 'savior'};

        expect(S.substitute(myString, myObject)).toBe('Jack Bauer is our lord and savior.');

        expect(S.substitute(1)).toBe(1);
        expect(S.substitute()).toBe(undefined);
        expect(S.substitute('a', fn)).toBe('a');
        expect(S.substitute(fn)).toBe(fn);
    });

    it('S.each', function() {
        var ret = 0;

        S.each([1,2,3,4,5], function(num) {
            ret += num;
        });

        expect(ret).toBe(15);

        // test context
        S.each([1], function() {
            expect(this).toBe(host);
        });
    });

    it('S.indexOf', function() {
        var a;

        expect(S.indexOf(6, [1, 2, 3, 4, 5])).toBe(-1);
        expect(S.indexOf(2, [1, 2, 3, 4, 5])).toBe(1);

        expect(S.indexOf(a, [1, 2, 3, 4, undefined])).toBe(4);
        expect(S.indexOf({}, [1, 2, 3, 4, undefined])).toBe(-1);
    });

    it('S.lastIndexOf', function() {
        expect(S.indexOf(6, [1, 2, 3, 4, 5])).toBe(-1);
        expect(S.indexOf(2, [1, 2, 3, 4, 5])).toBe(1);
    });

    it('S.unique', function() {
        if(host['hostType'] === 'console') return; // BESENShell has bug for Array.prototype.splice

        expect(S.unique([1,2,1]).length).toBe(2);
        expect(S.unique([1,2,'1']).length).toBe(3);
        expect(S.unique(['1','1','1']).length).toBe(1);

        expect(S.unique(['a','b','a'])[0]).toBe('a');
        expect(S.unique(['a','b','a'], true)[0]).toBe('b');
    });

    it('S.inArray', function() {
        var a;

        expect(S.inArray(2, [1, 2, 3, 4, 5])).toBe(true);
        expect(S.inArray(6, [1, 2, 3, 4, 5])).toBe(false);

        expect(S.inArray(a, [1, 2, 3, 4, undefined])).toBe(true);
        expect(S.inArray({}, [1, 2, 3, 4, {}])).toBe(false);
    });

    it('S.filter', function() {
        var ret = S.filter([1, 2, 3, 4, 5], function(item) {
            return item % 2 === 0;
        });

        expect(ret.length).toBe(2);
    });

    it('S.now', function() {       
        expect(S.type(S.now())).toBe('number');
    });
});
