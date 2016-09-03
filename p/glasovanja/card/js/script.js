var voteElements = $('.votes li');

function filterByTags(tags) {
  var index = 0,
      empty = false;

  if (tags.length === 0) {
    empty = true;
  }
  voteData.results.forEach(function(result) {
    var dateRendered = false;
    result.ballots.forEach(function(ballot) {
      var shouldBeVisible = empty ? true : tags.indexOf(ballot.tags[0]) > -1
      voteElements.eq(index).css({display : shouldBeVisible ? 'flex' : 'none' })
                            .toggleClass('with-date', shouldBeVisible && !dateRendered);
      dateRendered = dateRendered || shouldBeVisible;
      index++;
    })
  })
}

$('.tag-selector')
  .select2({
    dropdownParent: $('.card-glasovanja')
  })
  .on('change', function(event) {
    filterByTags($(event.currentTarget).val());
  })

filterByTags([])
