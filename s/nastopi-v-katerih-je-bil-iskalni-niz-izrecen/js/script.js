(function() {
  var PAGE_SIZE = 50

  new Vue({
    el: '#vue-nvkjbini',
    computed: {
      speeches: function() {
        var that = this
        return this.rawSpeeches.map(function(speech) {
          var date = new Date(speech.date)

          if (speech.person.type === 'mp') {
            speech.memberUrl = that.urls.base + that.urls.personLink.base + that.urls.person[speech.person.id].slug + that.urls.personLink.pregled
            if (speech.person.party.acronym.indexOf('NeP') === -1) {
              speech.partyUrl = that.urls.base + that.urls.partyLink.base + that.urls.party[speech.person.party.id].acronym + that.urls.partyLink.pregled
            }
          }

          speech.memberImageUrl = 'https://cdn.parlameter.si/v1/parlassets/img/people/square/' + String(speech.person.gov_id) + '.png'
          speech.formattedDate = date.getDate() + ". " + (date.getMonth() + 1) + ". " + date.getFullYear()
          speech.speechUrl = 'https://parlameter.si/seja/transkript/' + speech.session_id + '#' + speech.speech_id;

          return speech
        })
      }
    },
    data: function() {
      return {
        rawSpeeches: nastopiVKaterihData.highlighting,
        urls: nastopiVKaterihUrlsData,
        dataUrl: nastopiVKaterihCustomUrl + '/',
        allResults: nastopiVKaterihData.response.numFound,
        page: 0,
        fetching: false
      }
    },
    methods: {
      checkIfBottom: function(event) {
        if(this.$el.scrollTop + this.$el.offsetHeight >= this.$el.scrollHeight) {
          this.fetchNextPage()
        }
      },
      fetchNextPage: function() {
        if (this.fetching === true) return

        var that = this
        this.fetching = true
        this.page++

        $.get(this.dataUrl + this.page, function(response) {
          that.rawSpeeches = that.rawSpeeches.concat(response.highlighting)

          if (that.allResults <= (that.page + 1) * PAGE_SIZE) {
            that.$el.removeEventListener('scroll', that.checkIfBottom)
          }

          that.fetching = false
        })
      }
    },
    mounted: function() {
      if (this.allResults > PAGE_SIZE) {
        this.$el.addEventListener('scroll', this.checkIfBottom)
      }
    }
  })

  makeEmbedSwitch();
  activateCopyButton();
  addCardRippling();
}());

$(document).ready(function() {
  $('.shadowhunter').next().children('.stickinme').off('scroll');
  $('.shadowhunter').next().children('.stickinme').on('scroll', function (e) {
      if ($(e.currentTarget).offset().top > $(e.currentTarget).children('.thing-list').offset().top) {
          $(e.currentTarget).parents('.card-content').prev().addClass('shadow');
      } else {
          $(e.currentTarget).parents('.card-content').prev().removeClass('shadow');
      }
  });
});
