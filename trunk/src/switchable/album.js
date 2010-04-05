/**
 * Album Widget
 * @creator     ��<lifesinger@gmail.com>
 */
KISSY.add('album', function(S) {

        /**
         * Ĭ�����ã��� Switchable ��ͬ�Ĳ��ִ˴�δ�г�
         */
        var defaultConfig = {
            circular: true
        };

    /**
     * Album Class
     * @constructor
     */
    function Album(container, config) {
        var self = this;

        // factory or constructor
        if (!(self instanceof Album)) {
            return new Album(container, config);
        }

        config = S.merge(defaultConfig, config || { });
        Album.superclass.constructor.call(self, container, config);
    }

    S.extend(Album, S.Switchable);
    S.Album = Album;
});
