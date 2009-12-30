/*
Copyright (c) 2010, Kissy UI Library. All rights reserved.
MIT Licensed.
http://kissy.googlecode.com/

Date: 2009-12-30 20:19:58
Revision: 387
*/
/**
 * Carousel Widget
 * @creator     ��<lifesinger@gmail.com>
 * @depends     kissy, yui-base
 */
KISSY.add("carousel", function(S) {

    var SWITCHABLE = "switchable",

        /**
         * Ĭ�����ã��� Switchable ��ͬ�Ĳ��ִ˴�δ�г�
         */
        defaultConfig = {
            circular: true
        };

    /**
     * Carousel Class
     * @constructor
     */
    function Carousel(container, config) {
        var self = this;

        // factory or constructor
        if (!(self instanceof Carousel)) {
            return new Carousel(container, config);
        }

        config = S.merge(defaultConfig, config || { });
        Carousel.superclass.constructor.call(self, container, config);
        self.switchable(self.config);

        // add quick access for config
        self.config = self.config[SWITCHABLE];
        self.config[SWITCHABLE] = self.config;
    }

    S.extend(Carousel, S.Widget);
    S.Carousel = Carousel;
});
