var progressbarTooltip = {
    init: function(classname) {

      var $majorparent = $('.' + classname);

      $majorparent.append('<div class="progressbar-tooltip tooltip-' + classname + '"></div>');

      $majorparent.find('.tooltipme')
          .on('mouseover', function(e) {

              $('.tooltip-' + classname)
                  .css('opacity', 0.9)
                  .html($(this).data('name'))
                      .css("left", (e.pageX - ($('.tooltip-' + classname).width() / 2) - $majorparent.offset().left))
                      .css("top", (e.pageY - 30 - $majorparent.offset().top));

          })
          .on('mouseout', function(e) {
            $('.tooltip-' + classname)
                  .css('opacity', 0);
          });
  }
}

progressbarTooltip.init('card-delovno-telo-komisija-odbor');

makeEmbedSwitch();
activateCopyButton();
addCardRippling();