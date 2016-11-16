(function(){
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

            return newObject
          })
          .filter(function(votingDay) { return votingDay.ballots.length > 0 })
      }
    },
    data: function() {
      return {
        allTags: psVoteData.all_tags.map(function(tag) {
          return { id: tag, label: tag, selected: false }
        }),
        votingDays: psVoteData.results
      }
    }
  })
})();

addCardFlip();
makeEmbedSwitch();
activateCopyButton();
