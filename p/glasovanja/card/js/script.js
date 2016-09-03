var voteElements = $('#glasovanja-' + pGlasovanjaRandomId + ' .votes li');

function filterPGlasovanjaByTags(tags) {
  var index = 0,
      empty = false;

  if (tags === null) {
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

$('#glasovanja-' + pGlasovanjaRandomId + ' .tag-selector')
  .on('change', function(event) {
    filterPGlasovanjaByTags($(event.currentTarget).val());
  })
  .select2({
    dropdownParent: $('#glasovanja-' + pGlasovanjaRandomId)
  })

filterPGlasovanjaByTags(null)
