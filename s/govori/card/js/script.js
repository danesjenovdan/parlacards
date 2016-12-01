

(function(){

function makeId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for(var i = 0; i < 5; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

var randomId = makeId();

function formatDate(unformattedDate) {
  var date = new Date(unformattedDate);
  return date.getDate() + ". " + (date.getMonth() + 1) + ". " + date.getFullYear()
}

// SELECTION QUOTING
function getSelected() {
  if (window.getSelection) {
    return window.getSelection();
  }
  else if (document.getSelection) {
    return document.getSelection();
  }
  else {
    var selection = document.selection && document.selection.createRange();
    if(selection.text) {
      return selection;
    }
    return false;
  }
  return false;
}

function makeSpeechesEventful() {
  $.each($('.card-govori').not('.hidden').not('.eventful'), function(i, e) {

    $(e).addClass('eventful');

    var cardElement = $(e);
    var contentElement = cardElement.find('.card-content');
    var speechTextElement = cardElement.find('.speech-text');
    var quoteElement = cardElement.find('.everything .quote-button');
    var toggleElement = cardElement.find('.toggle-arrow');
    var speechId = cardElement.find('.myid').val();
    var cardId = cardElement.data('randomid');
    

    speechTextElement.on('mouseup', function() {
        event.preventDefault();

        if(contentElement.hasClass('closed')) {
          return
        }

        var selection = getSelected();

        if (selection && selection.toString().length > 0) {
            var parentOffsetTop = speechTextElement.get(0).getBoundingClientRect().top;
            var rectangle = selection.getRangeAt(0).getBoundingClientRect();
            var quoteIconOffset = rectangle.top - parentOffsetTop + rectangle.height / 2;

            quoteElement.data({ text: selection.toString() });
            quoteElement.css({
              top: quoteIconOffset + 'px',
              display: 'block'
            });
        }
        else {
          quoteElement.css({ display: 'none' });
        }
    });

    // This prevents deselection of text when clicking on quote icon
    quoteElement.on('mousedown', function(event) {
      event.preventDefault();
    })

    quoteElement.on('click', function(event) {
      selectedText = quoteElement.data().text.trim();
      //allText = speechData.results.content.replace(/\n+/g, '').trim();
      allText = $('#' + cardId + 'words').val();
      startIndex = allText.indexOf(selectedText);
      endIndex = startIndex + selectedText.length;
      url = 'https://analize.parlameter.si/v1/s/setQuote/' + speechId + '/' + startIndex + '/' + endIndex;

      console.log(url);
      console.log(selectedText);

      

      $.get(url, function(result) {
        var newCardUrl = 'https://glej.parlameter.si/s/citat/' + result.id;
        $.get(newCardUrl, function(response) {
          cardElement.parent().html(response);
        })
      })
    })

    toggleElement.on('click', function(event) {
      contentElement.toggleClass('closed')
                    .removeClass('similar-expanded');

      quoteElement.css({ display: 'none' });
    })

    // QUOTE-FULL SPEECH TOGGLING
    cardElement.on('click', '.full-text-link', function(event) {
      event.preventDefault();
      contentElement.removeClass('just-quote closed');
    });

    // SIMILAR SPEECH TABS
    var similarSpeechWrapperElement = cardElement.find('.similar-speech');
    var similarSpeechTabSelector = cardElement.find('a.speech');
    var similarSpeechCloseSelector = cardElement.find('.close-button');

    similarSpeechWrapperElement.on('click', 'a.speech', function() {
      contentElement.addClass('similar-expanded');
    })

    similarSpeechWrapperElement.on('click', '.close-button', function() {
      contentElement.removeClass('similar-expanded');
    })

    // Fetch similar speeches
    $.get('https://isci.parlameter.si/mlt/' + speechId, function(response) {
      var maxScore = response.response.maxScore;
      var speeches = response.response.docs.slice(0, 5);
      if (speeches[4]) {
        var minScore = speeches[4].score;
      }

      var tabs = [];
      var tabContents = [];

      speeches.forEach(function(speech, index) {
        tabs.push($(
          '<li role="tab"' + (index === 0 ? 'class="active"' : '') + '>\
            <a class="speech" href="#' + speech.speech_id + '_' + cardId + '" data-toggle="tab">\
              <div class="portrait" style="background-image: url(\'https://cdn.parlameter.si/v1/parlassets/img/people/square/' + speech.person.gov_id + '.png\')"></div>\
              <div class="name">' + speech.person.name + '</div>\
              <div class="date">' + formatDate(speech.date) + '</div>\
              <div class="rating" style="width: ' + ((speech.score - minScore) / (maxScore - minScore) * 50 + 50) + '%"></div>\
            </a>\
          </li>'
        ));

        tabContents.push($(
          '<div role="tabpanel" class="tab-pane' + (index === 0 ? ' active' : '') + '" id="' + speech.speech_id + '_' + cardId + '">\
            <div class="similar-speech-heading">' +
              speech.session_name + ', ' + formatDate(speech.date) +
              '<div class="close-button"></div>\
            </div>\
            <div class="similar-speech-text">' + speech.content_t[0] + '</div>\
            <a class="similar-speech-link" href="#">Pokaži znotraj seje &gt;</a>\
          </div>'
        ));
      });

      similarSpeechWrapperElement.find('.similar-speech-tabs ul').append(tabs);
      similarSpeechWrapperElement.find('.similar-speech-content').append(tabContents);
    });

  });
}

makeSpeechesEventful();

$(document).on('scroll', function() {
  if ($('.last').offset().top - $(document).scrollTop() < $(window).height()) {
    $last = $('.last');
    $next = $('.last').next();

    $next.children('div').removeClass('hidden');

    $last.removeClass('last');
    $next.addClass('last');

    makeSpeechesEventful();
    
  }
});

var url = document.location.href;

if (url.indexOf('#!') !== -1) {

  console.log('ping2');

  var speech_id = url.split('#!')[1];
  var $speech_element = $(document).find('.s' + speech_id);
  var $speech_parent = $speech_element.parent();

  $('.last').removeClass('last');

  $speech_element.removeClass('hidden');

  $speech_parent.addClass('last');
  var limit = $speech_parent.prevAll().length;

  $.each($speech_parent.prevAll(), function(i, e) {
    $(e).children('div').removeClass('hidden');
  });

  window.setTimeout(function() {
    $('body').animate({
      'scrollTop': $speech_parent.offset().top + 200
    });

    makeSpeechesEventful();
  }, 1000);;
}

makeEmbedSwitch();
activateCopyButton();
addCardRippling();

})();