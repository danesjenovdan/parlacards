/* global Vue vocabulary voteData makeEmbedSwitch activateCopyButton addCardRippling */

((randomId) => {
  const capitalise = string => string[0].toUpperCase() + string.substring(1);

  // eslint-disable-next-line no-new
  new Vue({
    el: `#glasovanja-${randomId}`,
    components: ['SearchDropdown'],
    computed: {
      tagPlaceholder() {
        return this.selectedTags.length > 0 ? `Izbranih: ${this.selectedTags.length}` : 'Izberi';
      },
      monthPlaceholder() {
        return this.selectedMonths.length > 0 ? `Izbranih: ${this.selectedMonths.length}` : 'Izberi';
      },
      selectedTags() {
        return this.allTags
          .filter(tag => tag.selected)
          .map(tag => tag.id);
      },
      selectedMonths() {
        return this.allMonths.filter(month => month.selected);
      },
      selectedOptions() {
        return this.allOptions.filter(option => option.selected)
                              .map(option => option.id);
      },
      filteredVotingDays() {
        const filterBallots = (ballot) => {
          const tagMatch = this.selectedTags.length === 0 ||
            ballot.tags.filter(tag => this.selectedTags.indexOf(tag) > -1).length > 0;
          const textMatch = this.textFilter === '' ||
            ballot.motion.toLowerCase().indexOf(this.textFilter.toLowerCase()) > -1;
          const optionMatch = this.selectedOptions.length === 0 ||
            this.selectedOptions.indexOf(ballot.option) > -1;

          return tagMatch && textMatch && optionMatch;
        };

        const filterDates = (votingDay) => {
          if (this.selectedMonths.length === 0) return true;

          const [, month, year] = votingDay.date.split(' ').map(string => parseInt(string, 10));

          return this.selectedMonths.filter(m => m.month === month && m.year === year).length > 0;
        };

        return this.votingDays
          .map(votingDay => ({
            date: votingDay.date,
            ballots: votingDay.ballots
              .filter(filterBallots)
              .map((ballot) => {
                const ballotClone = JSON.parse(JSON.stringify(ballot));
                if (ballot.option === 'ni') {
                  ballotClone.label = `Ni ${vocabulary.glasovati[this.person.gender]} o`;
                } else {
                  ballotClone.label = `${capitalise(vocabulary.glasovati[this.person.gender])} ${ballot.option.toUpperCase()}`;
                }

                if (ballot.result !== 'none') {
                  ballotClone.outcome = ballot.result === true ? 'Predlog sprejet' : 'Predlog zavrnjen'
                }

                return ballotClone;
              }),
          }))
          .filter(votingDay => votingDay.ballots.length > 0)
          .filter(filterDates);
      },
    },
    data() {
      return {
        allTags: voteData.all_tags.map(tag => ({ id: tag, label: tag, selected: false })),
        allOptions: [
          { id: 'za', class: 'for', label: 'ZA', selected: false },
          { id: 'proti', class: 'against', label: 'PROTI', selected: false },
          { id: 'kvorum', class: 'kvorum', label: 'VZDRŽAN', selected: false },
          { id: 'ni', class: 'ni', label: 'NI', selected: false },
        ],
        allMonths: [
          { id: 'jan17', label: 'Januar 2017', month: 1, year: 2017, selected: false },
          { id: 'dec16', label: 'December 2016', month: 12, year: 2016, selected: false },
          { id: 'nov16', label: 'November 2016', month: 11, year: 2016, selected: false },
          { id: 'okt16', label: 'Oktober 2016', month: 10, year: 2016, selected: false },
          { id: 'sep16', label: 'September 2016', month: 9, year: 2016, selected: false },
          { id: 'avg16', label: 'Avgust 2016', month: 8, year: 2016, selected: false },
          { id: 'jul16', label: 'Julij 2016', month: 7, year: 2016, selected: false },
          { id: 'jun16', label: 'Junij 2016', month: 6, year: 2016, selected: false },
          { id: 'maj16', label: 'Maj 2016', month: 5, year: 2016, selected: false },
          { id: 'apr16', label: 'April 2016', month: 4, year: 2016, selected: false },
          { id: 'mar16', label: 'Marec 2016', month: 3, year: 2016, selected: false },
          { id: 'feb16', label: 'Februar 2016', month: 2, year: 2016, selected: false },
          { id: 'jan16', label: 'Januar 2016', month: 1, year: 2016, selected: false },
        ],
        votingDays: voteData.results,
        person: voteData.person,
        textFilter: '',
        selectedOptions: [],
      };
    },
    methods: {
      toggleOption(optionId) {
        const clickedOption = this.allOptions.filter(option => option.id === optionId)[0];
        clickedOption.selected = !clickedOption.selected;
      },
    },
  });

  makeEmbedSwitch();
  activateCopyButton();
  addCardRippling();
})(/* SCRIPT_PARAMS */);
