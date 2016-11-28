(function(){
  function capitalise(string) {
    return string[0].toUpperCase() + string.substring(1)
  }

  new Vue({
    el: '#glasovanja-' + psGlasovanjaRandomId,
    components: ['SearchDropdown'],
    computed: {
      inputPlaceholder: function() {
        return this.selectedTags.length > 0 ? 'Izbranih filtrov: ' + this.selectedTags.length : 'Izberi filtre'
      },
      selectedTags: function() {
        return this.allTags
          .filter(function(tag) { return tag.selected })
          .map(function(tag) { return tag.id });
      },
      filteredVotingDays: function() {
        var currentDate = '',
            that = this;

        return this.votingDays
          .map(function(votingDay) {
            var newObject = {}

            if (currentDate !== votingDay.date) {
              currentDate = votingDay.date;
              newObject.date = votingDay.date;
            }

            newObject.ballots = votingDay.ballots.filter(function(ballot) {
              if (that.selectedTags.length > 0) {
                var match = false;
                ballot.tags.forEach(function(tag) {
                  match = match || that.selectedTags.indexOf(tag) > -1;
                })

                return match
              }
              return true
            })
            .map(function(ballot) {
              var ballotClone = JSON.parse(JSON.stringify(ballot));
              if (ballot.option === 'ni') {
                ballotClone.label = 'NISO glasovali o';
              } else if (ballot.option === 'za'){
                ballotClone.label = 'Glasovali ZA';
              } else if (ballot.option === 'proti'){
                ballotClone.label = 'Glasovali PROTI';
              } else if (ballot.option === 'kvorum'){
                ballotClone.label = 'VZDRŽALI so se glasovanja o';
              }
              return ballotClone;
            })

            return newObject
          })
          .filter(function(votingDay) { return votingDay.ballots.length > 0 })
      }
    },
    data: function() {
      return {
        allTags: psVoteData.all_tags.map(function(tag) {
          var smalltag = tag;
          if (smalltag.length > 44) {
            smalltag = smalltag.substring(0, 44) + '...'
          }
          return { id: tag, label: smalltag, selected: false }
        }),
        votingDays: psVoteData.results
      }
    }
  })
})();

progressbarTooltip.init(className);

addCardRippling();
makeEmbedSwitch();
activateCopyButton();
