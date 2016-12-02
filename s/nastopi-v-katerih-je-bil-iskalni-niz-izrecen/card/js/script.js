(function() {
  var PAGE_SIZE = 49

  new Vue({
    el: '#nastopi-v-katerih-je-bil-iskalni-niz-izrecen',
    computed: {
      speeches: function() {
        var that = this
        return this.rawSpeeches.map(function(speech) {
          var date = new Date(speech.date)

          if (speech.person.type === 'mp') {
            speech.memberUrl = that.urls.base + that.urls.personLink.base + that.urls.person[speech.person.id].slug + that.urls.personLink.pregled
            speech.partyUrl = that.urls.base + that.urls.partyLink.base + that.urls.party[speech.person.party.id].acronym + that.urls.partyLink.pregled
          }

          speech.memberImageUrl = 'https://cdn.parlameter.si/v1/parlassets/img/people/square/' + String(speech.person.gov_id) + '.png'
          speech.formattedDate = date.getDate() + ". " + (date.getMonth() + 1) + ". " + date.getFullYear()
          speech.speechUrl = that.urls.base + that.urls.sessionLink.transkript + speech.session_id + '/#!' + speech.speech_id

          return speech
        })
      }
    },
    data: function() {
      return {
        rawSpeeches: nastopiVKaterihData.highlighting,
        urls: nastopiVKaterihUrlsData,
        dataUrl: nastopiVKaterihCustomUrl + '/',
        page: 0,
        fetching: false
      }
    },
    methods: {
      checkIfBottom: function(event) {
        var el = this.$el

        if(el.scrollTop + el.offsetHeight >= el.scrollHeight) {
          this.fetchNextPage()
        }
      },
      fetchNextPage: function() {
        if (this.fetching === true) return

        var that = this
        this.page++

        this.fetching = true
        $.get(this.dataUrl + this.page, function(response) {
          if (response.highlighting.length === 0) {
            that.$el.removeEventListener('scroll', that.checkIfBottom)
          }
          else {
            that.rawSpeeches = that.rawSpeeches.concat(response.highlighting)
          }
          that.fetching = false
        })
      }
    },
    mounted: function() {
      if (this.rawSpeeches.length >= PAGE_SIZE) {
        this.$el.addEventListener('scroll', this.checkIfBottom)
      }
    }
  })

  makeEmbedSwitch();
  activateCopyButton();
  addCardRippling();
}())
