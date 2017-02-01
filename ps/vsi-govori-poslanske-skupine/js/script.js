makeEmbedSwitch();
activateCopyButton();
addCardRippling();

// $.each($('.date'), function(i ,e) {
//     $(e).data('offset', $(e).position().top);
// });
// $('.stickinme').on('scroll', function(i, e) {
//     $.each($('.date'), function(i, e) {
//         if ($(e).position().top <= 0) {
//             $(e).css({
//                 'top': - $(e).parent().position().top - $(e).data('offset')
//             });
//         } else if ($(e).position().top <= - $(e).parent().position().top - $(e).data('offset')) {
//             $(e).css({
//                 'top': - $(e).parent().position().top - $(e).data('offset')
//             });
//         } else {
//             $(e).css({
//                 'top': 0
//             });
//         }
//     });
// });