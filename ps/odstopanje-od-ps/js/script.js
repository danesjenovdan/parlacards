function odstopanjeodpsHeight() {
    if($(".card-odstopanje-od-ps").length < 1 ){
        return false;
    }
    var h = 0;
    $(".card-odstopanje-od-ps .member p").each(function (k, v) {
        if(h<$(this).height()){
            h = $(this).height();
        }
    });
    $(".card-odstopanje-od-ps .member p").height(h);
}

/*odstopanjeodpsHeight();*/

makeEmbedSwitch();
activateCopyButton();
addCardRippling();