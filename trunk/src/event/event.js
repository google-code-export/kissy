/**
 * @module  event
 * @author  lifesinger@gmail.com
 */
KISSY.add('event', function(S, undefined) {

    var DOM = S.DOM,
        win = window, doc = document,
        simpleAdd = doc.addEventListener ?
                    function(el, type, fn) {
                        if (el.addEventListener) {
                            el.addEventListener(type, fn, false);
                        }
                    } :
                    function(el, type, fn) {
                        if (el.attachEvent) {
                            el.attachEvent('on' + type, fn);
                        }
                    },
        simpleRemove = doc.removeEventListener ?
                       function(el, type, fn) {
                           if (el.removeEventListener) {
                               el.removeEventListener(type, fn, false);
                           }
                       } :
                       function(el, type, fn) {
                           if (el.detachEvent) {
                               el.detachEvent('on' + type, fn);
                           }
                       },
        EVENT_GUID = 'data-ks-event-guid',
        SPACE = ' ',
        guid = S.now(),
        // { id: { target: el, events: { type: { handle: obj, listeners: [...] } } }, ... }
        cache = { };

    var Event = {

        // such as: { 'mouseenter' : { fix: 'mouseover', handle: fn } }
        special: { },

        /**
         * Adds an event listener.
         * @param target {Element} An element or custom EventTarget to assign the listener to.
         * @param type {String} The type of event to append.
         * @param fn {Function} The event handler.
         * @param scope {Object} (optional) The scope (this reference) in which the handler function is executed.
         */
        add: function(target, type, fn, scope /* optional */) {
            if(batch('add', target, type, fn, scope)) return;

            var id = getID(target),
                special, events, eventHandle;

            // ������Ч�� target �� ��������
            if(id === -1 || !type || !S.isFunction(fn)) return;

            // ��û����ӹ��κ��¼�
            if (!id) {
                setID(target, (id = guid++));
                cache[id] = {
                    target: target,
                    events: { }
                };
            }

            // û����ӹ��������¼�
            events = cache[id].events;
            special = (!target.isCustomEventTarget && Event.special[type]) || { }; // special ����� element
            if (!events[type]) {
                eventHandle = function(event, eventData) {
                    if (!event || !event.fixed) {
                        event = new S.EventObject(target, event, type);

                        if(S.isPlainObject(eventData)) {
                            S.mix(event, eventData);
                        }
                    }

                    if(special.setup) {
                        special.setup(event);
                    }

                    return (special.handle || Event._handle)(target, event, events[type].listeners, scope);
                };

                events[type] = {
                    handle: eventHandle,
                    listeners: []
                };

                if(!target.isCustomEventTarget) {
                    simpleAdd(target, special.fix || type, eventHandle);
                }
                else if(target._addEvent) { // such as Node
                    target._addEvent(type, eventHandle);
                }
            }

            // ���� listener
            events[type].listeners.push(fn);
        },

        /**
         * Detach an event or set of events from an element.
         */
        remove: function(target, type /* optional */, fn /* optional */) {
            if(batch('remove', target, type, fn)) return;

            var id = getID(target),
                events, eventsType, listeners,
                i, len, c, t;

            if (id === -1) return; // ������Ч�� target
            if(!id || !(c = cache[id])) return; // �� cache
            if(c.target !== target) return; // target ��ƥ��
            events = c.events || { };

            if((eventsType = events[type])) {
                listeners = eventsType.listeners;
                len = listeners.length;

                // �Ƴ� fn
                if(S.isFunction(fn) && len && S.inArray(fn, listeners)) {
                    t = [];
                    for(i = 0; i < len; ++i) {
                        if(fn !== listeners[i]) {
                            t.push(listeners[i]);
                        }
                    }
                    listeners = t;
                    len = t.length;
                }

                // remove(el, type)or fn ���Ƴ���
                if(fn === undefined || len === 0) {
                    if(!target.isCustomEventTarget) {
                        simpleRemove(target, type, eventsType.handle);
                    }
                    delete cache[id].type;
                }
            }

            // remove(el) or type ���Ƴ���
            if(type === undefined || S.isEmptyObject(events)) {
                for(type in events) {
                    Event.remove(target, type);
                }
                delete cache[id];
                removeID(target);
            }
        },

        _handle: function(target, event, listeners, scope) {
            var ret, i = 0, len = listeners.length;
            scope = scope || target;

            for (; i < len; ++i) {
                ret = listeners[i].call(scope, event);

                // �Զ����¼����󣬿����� return false ������ֹͣ������������
                // ע�⣺return false ��ֹͣ��ǰ target �ĺ���������������������ֹð��
                // Ŀǰû��ʵ���Զ����¼������ð�ݣ���� return false �� stopImmediatePropagation Ч����һ����
                if ((ret === false && target.isCustomEventTarget) ||
                    event.isImmediatePropagationStopped) {
                    break;
                }
            }

            return ret;
        },

        _getCache: function(id) {
            return cache[id];
        },

        _simpleAdd: simpleAdd,
        _simpleRemove: simpleRemove
    };

    // shorthand
    Event.on = Event.add;

    function batch(methodName, targets, types, fn, scope) {

        // on('#id tag.className', type, fn)
        if(S.isString(targets)) {
            targets = S.query(targets);
        }

        // on([targetA, targetB], type, fn)
        if (S.isArray(targets)) {
            S.each(targets, function(target) {
                Event[methodName](target, types, fn, scope);
            });
            return true;
        }

        // on(target, 'click focus', fn)
        if ((types = S.trim(types)) && types.indexOf(SPACE) > 0) {
            S.each(types.split(SPACE), function(type) {
                Event[methodName](targets, type, fn, scope);
            });
            return true;
        }
    }

    function getID(target) {
        var ret = -1;

        // text and comment node
        if (target.nodeType === 3 || target.nodeType === 8) {
            return ret;
        }

        // HTML Element
        if (target.nodeType) {
            ret = DOM.attr(target, EVENT_GUID);
        }
        // custom EventTarget
        else if (target.isCustomEventTarget) {
            ret = target.eventTargetId;
        }
        // window, iframe, etc.
        else {
            ret = target[EVENT_GUID];
        }

        return ret;
    }

    function setID(target, id) {
        // text and comment node
        if (target.nodeType === 3 || target.nodeType === 8) {
            return S.error('Text or comment node is not valid event target.');
        }

        // HTML Element
        if (target.nodeType) {
            DOM.attr(target, EVENT_GUID, id);
        }
        // custom EventTarget
        else if (target.isCustomEventTarget) {
            target.eventTargetId = id;
        }
        // window, iframe, etc.
        else {
            try {
                target[EVENT_GUID] = id;
            } catch(ex) {
                S.error(ex);
            }
        }
    }

    function removeID(target) {
        // HTML Element
        if (target.nodeType) {
            DOM.removeAttr(target, EVENT_GUID);
        }
        // custom EventTarget
        else if (target.isCustomEventTarget) {
            target.eventTargetId = undefined;
        }
        // window, iframe, etc.
        else {
            target[EVENT_GUID] = undefined;
        }
    }

    S.Event = Event;

    // Prevent memory leaks in IE
    // Window isn't included so as not to unbind existing unload events
    // More info: http://isaacschlueter.com/2006/10/msie-memory-leaks/
    if (win.attachEvent && !win.addEventListener) {
        win.attachEvent('onunload', function() {
            var id, target;
            for (id in cache) {
                if ((target = cache[id].target)) {
                    // try/catch is to handle iframes being unloaded
                    try {
                        Event.remove(target);
                    } catch(ex) {
                    }
                }
            }
        });
    }
});

/**
 * TODO:
 *   - �о� jq �� expando cache ��ʽ
 *   - event || window.event, ʲô�����ȡ window.event ? IE4 ?
 *   - ���꾡ϸ�µ� test cases
 *   - �ڴ�й©����
 *   - target Ϊ window, iframe ���������ʱ�� test case
 */
