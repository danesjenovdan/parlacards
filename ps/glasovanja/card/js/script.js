var voteElements = $('#glasovanja-' + psGlasovanjaRandomId + ' .votes li');

function filterPsGlasovanjaByTags(tags) {
  var index = 0,
      empty = false;

  if (tags === null) {
    empty = true;
  }
  PsVoteData.results.forEach(function(result) {
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

$('#glasovanja-' + psGlasovanjaRandomId + ' .tag-selector')
    .on('change', function(event) {
      filterPsGlasovanjaByTags($(event.currentTarget).val());
    })
  .select2({
    dropdownParent: $('#glasovanja-' + psGlasovanjaRandomId)
  })

filterPsGlasovanjaByTags(null)
