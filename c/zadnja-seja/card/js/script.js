function equalizeWidth() {
    var max = 0;
    var iterations = +$('.' + className + ' .term').length;
    $.each($('.' + className + ' .term'), function(i, e) {
        if ($(e).width() > max) {
            max = $(e).width();
        }
        if (i === iterations - 1) {
            $('.' + className + ' .term').css('width', max);
            $('.' + className + ' .frequency').css('width', $('.' + className + ' .term').parent().width() - max - 10);
            console.log('ping');
        }
    });
}

equalizeWidth();
$(window).on('resize', function() {
    equalizeWidth();

    // var avgwidth = 0;
    // var sumwidth = 0;
    // var counter = 0;
    // var newwidth = 0;
    // $.each($('.pspris-container'), function(i, e) {
    //     sumwidth = sumwidth + $(e).width();
    //     counter = counter + 1;
    // });
    // avgwidth = sumwidth/counter;
    // $.each($('.pspris-container'), function(i, e) {
    //     if ($(e).width() < avgwidth - 1) {
    //         newwidth = $(e).width();
    //     }
    // });
    // $('.pspris-container').width(newwidth);

});

makeEmbedSwitch();
activateCopyButton();
addCardRippling();