function equalizeWidth() {
    var max = 0;
    var iterations = +$('.term').length;
    $.each($('.' + className + ' .term'), function(i, e) {
        if ($(e).width() > max) {
            max = $(e).width();
        }
        if (i === iterations - 1) {
            $('.' + className + ' .term').css('width', max);
            $('.frequency').css('width', $('.' + className + ' .term').parent().width() - max - 10);
            console.log('ping');
        }
    });
}

equalizeWidth();
$(window).on('resize', function() {
    equalizeWidth();
});
