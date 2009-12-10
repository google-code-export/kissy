/*
Copyright (c) 2009, Kissy UI Library. All rights reserved.
MIT Licensed.
http://kissy.googlecode.com/

Date: 2009-12-10 22:19:49
Revision: 297
*/
/**
 * @module kissy
 * @creator lifesinger@gmail.com
 */

if (typeof KISSY === "undefined" || !KISSY) {
    /**
     * The KISSY global object.
     * @constructor
     * @global
     */
    function KISSY(c) {
        var o = this;
        // allow instantiation without the new operator
        if (!(o instanceof arguments.callee)) {
            return new arguments.callee(c);
        }

        // init the core environment
        o._init();
        o._config(c);

        // bind the specified additional modules for this instance
        o._setup();

        return o;
    }
}

(function(S) {

    var win = window, UNDEFINED = "undefined",
        mix = function(r, s, ov) {
                if(!s || !r) return r;
                if(typeof ov === UNDEFINED) ov = true;
                var p;
                if (ov || !(p in r)) {
                    for (p in s) {
                        r[p] = s[p];
                    }
                }
                return r;
            };

    mix(S.prototype, {

        /**
         * Register a module
         * @param name {string} module name
         * @param fn {function} entry point into the module that is used to bind module to the KISSY instance
         * @param version {string} version string
         * @param details optional config data:
         * submodules - sub modules
         * requires - features that should be present before loading
         * optional - optional features that should be present if load optional defined
         * use - features that should be attached automatically
         * @return {KISSY} the KISSY instance
         */
        add: function(name, fn, version, details) {
            S.Env.mods[name] = {
                name: name,
                fn: fn,
                version: version,
                details: details || {}
            };
            return this; // chain support
        },

        /**
         * Initialize this KISSY instance
         * @private
         */
        _init: function() {
            var o = this;
            o.version = "@VERSION@";

            o.Env = {
                mods: {},
                _used: {},
                _attached: {}
            };

            o.config = {
                debug: true
            };
        },

        /**
         * Initialize this config
         * @private
         */
        _config: function(c) {
            mix(this.config, c);
        },

        /**
         * Attaches whatever modules were defined when the instance was created.
         * @private
         */
        _setup: function() {
            this.use("kissy-base");
        },

        /**
         * Bind a module to a KISSY instance
         * <pre>
         * KISSY().use("*", function(S){});
         * KISSY().use("editor", function(S){});
         * KISSY().use(function(S){});
         * </pre>
         * @return {KISSY} the KISSY instance
         */
        use: function() {
            var o = this,
                a = Array.prototype.slice.call(arguments, 0),
                mods = S.Env.mods,
                used = o.Env._used,
                l = a.length,
                callback = a[l - 1],
                i, k, name, r = [];

            // the last argument is callback
            if (typeof callback === "function") {
                a.pop();
            } else {
                callback = null;
            }

            // bind everything available
            if (a[0] === "*") {
                a = [];
                for (k in mods) {
                    a.push(k);
                }
                if (callback) {
                    a.push(callback);
                }
                return o.use.apply(o, a);
            }

            // process each module
            function f(name) {
                // only attach a module once
                if (used[name]) return;

                var m = mods[name], j, n, subs;

                if (m) {
                    used[name] = true;
                    subs = m.details.submodules;
                }

                // make sure submodules are attached
                if (subs) {
                    if (typeof subs === "string") subs = [subs];
                    for (j = 0,n = subs.length; j < n; j++) {
                        f(subs[j]);
                    }
                }

                // add this module to full list of things to attach
                r.push(name);
            }
            for (i = 0; i < l; i++) {
                f(a[i]);
            }

            // attach available modules
            o._attach(r);

            // callback
            if(callback) {
                callback(o);
            }

            // chain support
            return o;
        },

        /**
         * Attaches modules to a KISSY instance
         */
        _attach: function(r) {
            var mods = S.Env.mods,
                attached = this.Env._attached,
                i, l = r.length, name, m;

            for (i = 0; i < l; i++) {
                name = r[i];
                m = mods[name];
                if (!attached[name] && m) {
                    attached[name] = true;
                    if (m.fn) {
                        m.fn(this);
                    }
                }
            }
        },

        /**
         * Copies all the properties of s to r. overwrite mode.
         * @return {object} the augmented object
         */
        mix: mix,

        /**
         * Returns a new object containing all of the properties of
         * all the supplied objects.  The properties from later objects
         * will overwrite those in earlier objects.  Passing in a
         * single object will create a shallow copy of it.
         * @return {object} the new merged object
         */
        merge: function() {
            var a = arguments, o = {}, i, l = a.length;
            for (i = 0; i < l; ++i) {
                mix(o, a[i], true);
            }
            return o;
        },

        /**
         * Utility to set up the prototype, constructor and superclass properties to
         * support an inheritance strategy that can chain constructors and methods.
         * Static members will not be inherited.
         *
         * @method extend
         * @param {Function} r the object to modify
         * @param {Function} s the object to inherit
         * @param {Object} px prototype properties to add/override
         * @param {Object} sx static properties to add/override
         * @return {KISSY} the KISSY instance
         */
        extend: function(r, s, px, sx) {
            if (!s || !r) return r;

            var OP = Object.prototype,
                O = function (o) {
                    function F() {}
                    F.prototype = o;
                    return new F();
                },
                sp = s.prototype,
                rp = O(sp);

            r.prototype = rp;
            rp.constructor = r;
            r.superclass = sp;

            // assign constructor property
            if (s !== Object && sp.constructor === OP.constructor) {
                sp.constructor = s;
            }

            // add prototype overrides
            if (px) {
                mix(rp, px);
            }

            // add object overrides
            if (sx) {
                mix(r, sx);
            }

            return r;
        },

        /**
         * Clones KISSY to another global object.
         * <pre>
         * S.cloneTo("TaoBao");
         * </pre>
         * @return {object}  A reference to the last object
         */
        cloneTo: function(name) {
            win[name] = function(c) {
                // allow instantiation without the new operator
                if (!(this instanceof arguments.callee)) {
                    return new arguments.callee(c);
                }
                r.superclass.constructor.apply(this, c);
            };
            var r = win[name];
            S.extend(r, S, null, S);
            return r;
        },

        /**
         * Returns the namespace specified and creates it if it doesn't exist
         * Be careful when naming packages. Reserved words may work in some browsers
         * and not others.
         * <pre>
         * S.cloneTo("TB");
         * TB.namespace("TB.app"); // returns TB.app
         * TB.namespace("app.Shop"); // returns TB.app.Shop
         * </pre>
         * @return {object}  A reference to the last namespace object created
         */
        namespace: function() {
            var a = arguments, l = a.length, o = this, i, j, p;
            // allow instance.namespace() to work fine.
            if(typeof o === "object") o = o.constructor;

            for (i = 0; i < l; i++) {
                p = ("" + a[i]).split(".");
                for (j = (win[p[0]] === o) ? 1 : 0; j < p.length; j++) {
                    o[p[j]] = o[p[j]] || {};
                    o = o[p[j]];
                }
            }
            return o;
        },

        /**
         * print debug info
         * @param {String} msg The message to log.
         * @param {String} cat The log category for the message. Default
         * categories are "info", "warn", "error", time".
         * Custom categories can be used as well. (opt)
         * @param {String} src The source of the the message (opt)
         * @return {KISSY} KISSY instance
         */
        log: function(msg, cat, src) {
            var c = this.config;

            if (c.debug) {
                src && (msg = src + ": " + msg);
                if (typeof console !== UNDEFINED && console.log) {
                    console[cat && console[cat] ? cat : "log"](msg);
                } else if (typeof opera !== UNDEFINED) {
                    opera.postError(msg);
                }
            }

            return this;
        }
    });

    // Give the KISSY global the same properties as an instance.
    // More importantly, the KISSY global provides global metadata,
    // so env needs to be configured.
    mix(S, S.prototype);
    S._init();

})(KISSY);
