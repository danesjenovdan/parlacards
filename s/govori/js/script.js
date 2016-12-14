/* global window document $ makeEmbedSwitch activateCopyButton addCardRippling */

(() => {
  function formatDate(unformattedDate) {
    const date = new Date(unformattedDate);
    return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`;
  }

  // SELECTION QUOTING
  function getSelected() {
    if (window.getSelection) {
      return window.getSelection();
    } else if (document.getSelection) {
      return document.getSelection();
    }
    const selection = document.selection && document.selection.createRange();
    if (selection.text) {
      return selection;
    }
    return false;
  }

  function makeSpeechesEventful() {
    $.each($('.card-govori').not('.hidden').not('.eventful'), (i, e) => {
      $(e).addClass('eventful');

      const cardElement = $(e);
      const contentElement = cardElement.find('.card-content');
      const speechTextElement = cardElement.find('.speech-text');
      const quoteElement = cardElement.find('.everything .quote-button');
      const toggleElement = cardElement.find('.toggle-arrow');
      const speechId = cardElement.find('.myid').val();
      const cardId = cardElement.data('randomid');

      speechTextElement.on('mouseup', (event) => {
        event.preventDefault();

        if (contentElement.hasClass('closed')) {
          return;
        }

        const selection = getSelected();

        if (selection && selection.toString().length > 0) {
          const parentOffsetTop = speechTextElement.get(0).getBoundingClientRect().top;
          const rectangle = selection.getRangeAt(0).getBoundingClientRect();
          const quoteIconOffset = (rectangle.top - parentOffsetTop) + (rectangle.height / 2);

          quoteElement.data({ text: selection.toString() });
          quoteElement.css({
            top: `${quoteIconOffset}px`,
            display: 'block',
          });
        } else {
          quoteElement.css({ display: 'none' });
        }
      });

      // This prevents deselection of text when clicking on quote icon
      quoteElement.on('mousedown', (event) => {
        event.preventDefault();
      });

      quoteElement.on('click', () => {
        const selectedText = quoteElement.data().text.trim();
        const allText = $(`#${cardId}words`).val();
        const startIndex = allText.indexOf(selectedText);
        const endIndex = startIndex + selectedText.length;
        const url = `https://analize.parlameter.si/v1/s/setQuote/${speechId}/${startIndex}/${endIndex}`;

        $.get(url, (result) => {
          const newCardUrl = `https://glej.parlameter.si/s/citat/${result.id}`;
          $.get(newCardUrl, (response) => {
            cardElement.parent().html(response);
          });
        });
      });

      toggleElement.on('click', () => {
        contentElement.toggleClass('closed')
                      .removeClass('similar-expanded');

        quoteElement.css({ display: 'none' });
      });

      // QUOTE-FULL SPEECH TOGGLING
      cardElement.on('click', '.full-text-link', (event) => {
        event.preventDefault();
        contentElement.removeClass('just-quote closed');
      });

      // SIMILAR SPEECH TABS
      const similarSpeechWrapperElement = cardElement.find('.similar-speech');
      // const similarSpeechTabSelector = cardElement.find('a.speech');
      // const similarSpeechCloseSelector = cardElement.find('.close-button');

      similarSpeechWrapperElement.on('click', 'a.speech', () => {
        contentElement.addClass('similar-expanded');
      });

      similarSpeechWrapperElement.on('click', '.close-button', () => {
        contentElement.removeClass('similar-expanded');
      });

      // Fetch similar speeches
      $.get(`https://isci.parlameter.si/mlt/${speechId}`, (response) => {
        const maxScore = response.response.maxScore;
        const speeches = response.response.docs.slice(0, 5);
        const minScore = speeches[4] ? speeches[4].score : 0;
        const tabs = [];
        const tabContents = [];

        speeches.forEach((speech, index) => {
          tabs.push($(
          `<li role="tab"${index === 0 ? 'class="active"' : ''}>\
            <a class="speech" href="#${speech.speech_id}_${cardId}" data-toggle="tab">\
              <div class="portrait" style="background-image: url('https://cdn.parlameter.si/v1/parlassets/img/people/square/${speech.person.gov_id}.png')"></div>\
              <div class="name">${speech.person.name}</div>\
              <div class="date">${formatDate(speech.date)}</div>\
              <div class="rating" style="width: ${(((speech.score - minScore) / (maxScore - minScore)) * 50) + 50}%"></div>\
            </a>\
          </li>`,
        ));

          tabContents.push($(
          `<div role="tabpanel" class="tab-pane${index === 0 ? ' active' : ''}" id="${speech.speech_id}_${cardId}">\
            <div class="similar-speech-heading">${
              speech.session_name}, ${formatDate(speech.date)
              }<div class="close-button"></div>\
            </div>\
            <div class="similar-speech-text">${speech.content_t[0]}</div>\
            <a class="similar-speech-link" href="#">Pokaži znotraj seje &gt;</a>\
          </div>`,
        ));
        });

        similarSpeechWrapperElement.find('.similar-speech-tabs ul').append(tabs);
        similarSpeechWrapperElement.find('.similar-speech-content').append(tabContents);
      });
    });
  }

  makeSpeechesEventful();

  $(document).on('scroll', () => {
    if ($('.last').offset().top - $(document).scrollTop() < $(window).height()) {
      const $last = $('.last');
      const $next = $('.last').next();

      $next.children('div').removeClass('hidden');

      $last.removeClass('last');
      $next.addClass('last');

      makeSpeechesEventful();
    }
  });

  const url = document.location.href;

  if (url.indexOf('#!') !== -1) {
    const speechId = url.split('#!')[1];
    const $speechElement = $(document).find(`.s${speechId}`);
    const $speechParent = $speechElement.parent();

    $('.last').removeClass('last');

    $speechElement.removeClass('hidden');
    $speechParent.addClass('last');

    $.each($speechParent.prevAll(), (i, e) => {
      $(e).children('div').removeClass('hidden');
    });

    window.setTimeout(() => {
      $('body').animate({
        scrollTop: $speechParent.offset().top + 200,
      });

      makeSpeechesEventful();
    }, 1000);
  }

  makeEmbedSwitch();
  activateCopyButton();
  addCardRippling();
})();
