// $(document).ready(function() {
    function equalizeWidth() {
        var max = 0;
        var iterations = +$('.term').length;
        $.each($('.term'), function(i, e) {
            if ($(e).width() > max) {
                max = $(e).width();
            }
            if (i === iterations - 1) {
                $('.term').css('width', max);
                $('.frequency').css('width', $('.term').parent().width() - max - 10);
                console.log('ping');
            }
        });
    }

// });

equalizeWidth();
$(window).on('resize', function() {
    equalizeWidth();
});

addCardFlip();
makeEmbedSwitch();
activateCopyButton();
addCardRippling();