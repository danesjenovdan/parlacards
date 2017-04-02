/* global $ Vue vocabulary voteData voteState makeEmbedSwitch activateCopyButton
addCardRippling */

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
      dropdownItems() {
        const validTags = [];
        const validMonths = [];

        this.getFilteredVotingDays(true).forEach((votingDay) => {
          const [, month, year] = votingDay.date.split(' ').map(string => parseInt(string, 10));
          const monthId = `${year}-${month}`;
          if (validMonths.indexOf(monthId) === -1) validMonths.push(monthId);

          votingDay.ballots
            .forEach((ballot) => {
              ballot.tags.forEach((tag) => {
                if (validTags.indexOf(tag) === -1) validTags.push(tag);
              });
            });
        });

        return {
          tags: this.allTags.filter(tag => validTags.indexOf(tag.id) > -1),
          months: this.allMonths.filter(month => validMonths.indexOf(month.id) > -1),
        };
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
        return this.getFilteredVotingDays();
      },
      cardUrl() {
        const state = {};

        if (this.selectedTags.length > 0) state.tags = this.selectedTags;
        if (this.selectedMonths.length > 0) state.months = this.selectedMonths.map(month => month.id);
        if (this.textFilter.length > 0) state.text = this.textFilter;
        if (this.selectedOptions.length > 0) state.options = this.selectedOptions;

        return `https://glej.parlameter.si/p/glasovanja/${voteData.person.id}/?state=${encodeURIComponent(JSON.stringify(state))}&altHeader=true`;
      },
    },
    data() {
      const allMonths = [
        { id: '2017-2', label: 'Februar 2017', month: 2, year: 2017, selected: false },
        { id: '2017-1', label: 'Januar 2017', month: 1, year: 2017, selected: false },
        { id: '2016-12', label: 'December 2016', month: 12, year: 2016, selected: false },
        { id: '2016-11', label: 'November 2016', month: 11, year: 2016, selected: false },
        { id: '2016-10', label: 'Oktober 2016', month: 10, year: 2016, selected: false },
        { id: '2016-9', label: 'September 2016', month: 9, year: 2016, selected: false },
        { id: '2016-8', label: 'Avgust 2016', month: 8, year: 2016, selected: false },
        { id: '2016-7', label: 'Julij 2016', month: 7, year: 2016, selected: false },
        { id: '2016-6', label: 'Junij 2016', month: 6, year: 2016, selected: false },
        { id: '2016-5', label: 'Maj 2016', month: 5, year: 2016, selected: false },
        { id: '2016-4', label: 'April 2016', month: 4, year: 2016, selected: false },
        { id: '2016-3', label: 'Marec 2016', month: 3, year: 2016, selected: false },
        { id: '2016-2', label: 'Februar 2016', month: 2, year: 2016, selected: false },
        { id: '2016-1', label: 'Januar 2016', month: 1, year: 2016, selected: false },
      ];
      const allTags = voteData.all_tags.map(tag => ({ id: tag, label: tag, selected: false }));
      const allOptions = [
        { id: 'za', class: 'for', label: 'ZA', selected: false },
        { id: 'proti', class: 'against', label: 'PROTI', selected: false },
        { id: 'kvorum', class: 'kvorum', label: 'VZDRŽAN', selected: false },
        { id: 'ni', class: 'ni', label: 'NI', selected: false },
      ];
      const textFilter = voteState.text || '';

      const toggleFromState = (stateParameter, itemArray) => {
        if (voteState[stateParameter]) {
          itemArray.forEach((item) => {
            if (voteState[stateParameter].indexOf(item.id) > -1) {
              // eslint-disable-next-line no-param-reassign
              item.selected = true;
            }
          });
        }
      };

      toggleFromState('months', allMonths);
      toggleFromState('tags', allTags);
      toggleFromState('options', allOptions);

      return {
        allTags,
        allOptions,
        allMonths,
        votingDays: voteData.results,
        person: voteData.person,
        textFilter,
        selectedOptions: [],
        shortenedCardUrl: '',
      };
    },
    methods: {
      toggleOption(optionId) {
        const clickedOption = this.allOptions.filter(option => option.id === optionId)[0];
        clickedOption.selected = !clickedOption.selected;
      },
      getFilteredVotingDays(onlyFilterByText = false) {
        const filterBallots = (ballot) => {
          const tagMatch = onlyFilterByText || this.selectedTags.length === 0 ||
            ballot.tags.filter(tag => this.selectedTags.indexOf(tag) > -1).length > 0;
          const textMatch = this.textFilter === '' ||
            ballot.motion.toLowerCase().indexOf(this.textFilter.toLowerCase()) > -1;
          const optionMatch = onlyFilterByText || this.selectedOptions.length === 0 ||
            this.selectedOptions.indexOf(ballot.option) > -1;

          return tagMatch && textMatch && optionMatch;
        };

        const filterDates = (votingDay) => {
          if (onlyFilterByText || this.selectedMonths.length === 0) return true;

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
                  ballotClone.outcome = ballot.result === true ? 'Predlog sprejet' : 'Predlog zavrnjen';
                }

                return ballotClone;
              }),
          }))
          .filter(votingDay => votingDay.ballots.length > 0)
          .filter(filterDates);
      },
      shortenUrl(url) {
        $.get(`https://parla.me/shortner/generate?url=${encodeURIComponent(`${url}&frame=true`)}`, (response) => {
          this.shortenedCardUrl = response;
          this.$el.querySelector('.card-content-share button, .btn-copy-embed').textContent = 'KOPIRAJ';
        });
      },
    },
    created() {
      this.shortenUrl(this.cardUrl);
    },
    watch: {
      cardUrl(newValue) {
        this.shortenUrl(newValue);
      },
    },
  });

  makeEmbedSwitch();
  activateCopyButton();
  addCardRippling();
})(/* SCRIPT_PARAMS */);
