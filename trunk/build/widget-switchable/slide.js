/*
Copyright (c) 2010, Kissy UI Library. All rights reserved.
MIT Licensed.
http://kissy.googlecode.com/

Date: 2010-01-03 21:56:25
Revision: 393
*/
/**
 * Tabs Widget
 * @creator     ��<lifesinger@gmail.com>
 * @depends     kissy, yui-base
 */
KISSY.add("slide", function(S) {

    var SWITCHABLE = "switchable",

    /**
     * Ĭ�����ã��� Switchable ��ͬ�Ĳ��ִ˴�δ�г�
     */
    defaultConfig = {
        autoplay: true,
        circular: true
    };

    /**
     * Slide Class
     * @constructor
     */
    function Slide(container, config) {
        var self = this;

        // factory or constructor
        if (!(self instanceof Slide)) {
            return new Slide(container, config);
        }

        config = S.merge(defaultConfig, config || { });
        Slide.superclass.constructor.call(self, container, config);
        self.switchable(self.config);

        // add quick access for config
        self.config = self.config[SWITCHABLE];
        self.config[SWITCHABLE] = self.config;
    }

    S.extend(Slide, S.Widget);
    S.Slide = Slide;
});
