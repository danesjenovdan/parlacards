makeEmbedSwitch();
activateCopyButton();


var cardRippling = false;
function addCardRippling(element) {

    $('.card-circle-button').on('click', function(e) {
        if (!cardRippling) {

            cardRippling = true;

            var $parentcontainer = $(this).parents('.card-container');
            var $this = $(this);


            if (!$(this).hasClass('card-exit')) { // show back

                $parentcontainer
                    .children('.card-footer')
                    .children('.card-circle-button')
                    .text('')
                    .removeClass('card-exit');
                $parentcontainer
                    .children('.card-footer')
                    .children('.card-info')
                    .text('i');

                $(this)
                    .text('×')
                    .addClass('card-exit');

                $parentcontainer
                    .addClass('covered')
                    .addClass('clicked-' + $this.data('back'));
                
                window.setTimeout(function() {
                    $parentcontainer.children('.card-content').children().addClass('hidden');
                }, 200);
                
                window.setTimeout(function() {
                    $parentcontainer.children('.card-content').children('.card-content-' + $this.data('back')).removeClass('hidden');
                }, 250);
                
                window.setTimeout(function() {
                    $parentcontainer
                        .removeClass('covered')
                        .removeClass('clicked-' + $this.data('back'));
                    
                    cardRippling = false;
                }, 600);

            } else {

                $(this).removeClass('card-exit');
                $('.card-info').text('i');
                $('.card-embed, .card-share').text('');

                $parentcontainer
                    .addClass('revealed')
                    .addClass('clicked-' + $this.data('back'));
                
                window.setTimeout(function() {
                    $parentcontainer.children('.card-content').children().addClass('hidden');
                }, 200);
                
                window.setTimeout(function() {
                    $parentcontainer.children('.card-content').children('.card-content-front').removeClass('hidden');
                }, 250);
                
                window.setTimeout(function() {
                    $parentcontainer
                        .removeClass('revealed')
                        .removeClass('clicked-' + $this.data('back'));
                    
                    cardRippling = false;
                }, 1000);
            }
        }
    });
}