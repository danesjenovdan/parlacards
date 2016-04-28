/* global Ps */

/**
 * Your code below
 * @type {{init: Function}}
 */
var lastActivity = {

    init : function() {

        this.initalizeScrollbar();

    },



    initalizeScrollbar : function(id, options) {
        var _id = (typeof(id) !== 'undefined') ? id : 'scrollbar';

        var defaultOptions = {
            wheelSpeed: 2,
            wheelPropagation: true,
            minScrollbarLength: 100,
            maxScrollbarLength: 100
        };

        var _options = (typeof(options) !== 'undefined') ? options : defaultOptions;

        var container = document.getElementById(_id);

        Ps.initialize(container, _options);
    }


};

$(function() {
    lastActivity.init();
});
