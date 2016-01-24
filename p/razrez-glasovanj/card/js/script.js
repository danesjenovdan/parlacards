/* global Ps */

function iframeResizePipe()
{
    // What's the page height?
    var height = document.body.scrollHeight;
    // Going to 'pipe' the data to the parent through the helpframe..
    var pipe = document.getElementById('helpframe');
    // Cachebuster a precaution here to stop browser caching interfering
    pipe.src = 'http://localhost:9001/helper?height='+height+'&cacheb='+Math.random();
}

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
