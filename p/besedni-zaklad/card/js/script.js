function fixImages() {
    $.each($('.smallbar .funblue'), function(i, e) {
        if ($(e).width() <= 30) {
            $(e).children().children('.avgminimg').css({
                'margin-left': '0'
            });
            console.log($(e).children().children('.avgminimg'));
        }
    });
}




progressbarTooltip.init(className);

makeEmbedSwitch();
activateCopyButton();
addCardRippling();