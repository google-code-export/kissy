/**
 * @module  EventTarget
 * @author  lifesinger@gmail.com
 */

KISSY.add('event-target', function(S, undefined) {

    var Event = S.Event;

    /**
     * EventTarget provides the implementation for any object to publish,
     * subscribe and fire to custom events.
     */
    S.EventTarget = {

        eventTargetId: undefined,

        isCustomEventTarget: true,

        fire: function(type) {
            var id = this.eventTargetId || -1,
                cache = Event._getCache(id) || { },
                events = cache.events || { },
                t = events[type];

            if(t && S.isFunction(t.handle)) {
                t.handle();
            }
        },

        on: function(type, fn) {
            Event.add(this, type, fn);
        },

        detach: function(type, fn) {
            Event.remove(this, type, fn);
        }
    };
});

/**
 * Notes:
 *  2010.04
 *   - ��ʼ���� api: publish, fire, on, detach. ʵ��ʵ��ʱ���֣�publish �ǲ���Ҫ
 *     �ģ�on ʱ���Զ� publish. api ��Ϊ������/����/������
 */
