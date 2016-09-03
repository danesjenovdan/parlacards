var voteElements = $('.votes li');

$('.tag-selector')
  .select2({
    dropdownParent: $('.card-glasovanja')
  })
  .on('change', function(event) {
    var index = 0,
        activeTags = $(event.currentTarget).val(),
        hideAll = false;

    if (!activeTags) {
      hideAll = true;
    }
    voteData.results.forEach(function(result) {
      var dateRendered = false;
      result.ballots.forEach(function(ballot) {
        var shouldBeVisible = hideAll ? false : activeTags.indexOf(ballot.tags[0]) > -1
        voteElements.eq(index).css({display : shouldBeVisible ? 'flex' : 'none' })
                              .children('.date').css({visibility: shouldBeVisible && !dateRendered ? 'visible' : 'hidden'});
        dateRendered = dateRendered || shouldBeVisible;
        index++;
      })
    })
  })
