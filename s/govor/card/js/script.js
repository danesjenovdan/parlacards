/* ========================================================================
 * Bootstrap: tab.js v3.3.6
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    // jscs:disable requireDollarBeforejQueryAssignment
    this.element = $(element)
    // jscs:enable requireDollarBeforejQueryAssignment
  }

  Tab.VERSION = '3.3.6'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu').length) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

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

var cardElement = $('.card-govor');
var contentElement = cardElement.find('.card-content');
var speechTextElement = cardElement.find('.speech-text');
var quoteElement = cardElement.find('.everything .quote-button');
var toggleElement = cardElement.find('.toggle-arrow');

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
  var selectedText = quoteElement.data().text.trim();
  var allText = speechData.content.replace(/\s+/g, ' ').trim();
  var startIndex = allText.indexOf(selectedText);
  var endIndex = startIndex + selectedText.length;
  var url = 'https://analize.parlameter.si/v1/s/setQuote/' + speechData.speech_id + '/' + startIndex + '/' + endIndex;

  $.get(url, function(result) {
    console.log('Successfully saved quote!', 'https://analize.parlameter.si/v1/s/getQuote/' + result.id);
  })
})

toggleElement.on('click', function(event) {
  contentElement.toggleClass('closed')
                .removeClass('similar-expanded');
;
  quoteElement.css({ display: 'none' });
})

// QUOTE-FULL SPEECH TOGGLING
cardElement.on('click', '.full-text-link', function(event) {
  event.preventDefault();
  contentElement.removeClass('just-quote closed');
});

// SIMILAR SPEECH TABS
var similarSpeechWrapperElement = cardElement.find('.similar-speech');
var similarSpeechTabSelector = 'a.speech';
var similarSpeechCloseSelector = '.close-button';

similarSpeechWrapperElement.on('click', similarSpeechTabSelector, function() {
  contentElement.addClass('similar-expanded');
})

similarSpeechWrapperElement.on('click', similarSpeechCloseSelector, function() {
  contentElement.removeClass('similar-expanded');
})

// Fetch similar speeches
$.get('https://isci.parlameter.si/mlt/' + speechData.speech_id, function(response) {
  var maxScore = response.response.maxScore;
  var speeches = response.response.docs.slice(0, 5);
  var minScore = speeches[4].score;

  var tabs = [];
  var tabContents = [];

  speeches.forEach(function(speech, index) {
    tabs.push($(
      '<li role="tab"' + (index === 0 ? 'class="active"' : '') + '>\
        <a class="speech" href="#' + speech.speech_id + '_' + randomId + '" data-toggle="tab">\
          <div class="portrait" style="background-image: url(\'https://cdn.parlameter.si/v1/img/people/' + speech.person.gov_id + '.png\')"></div>\
          <div class="name">' + speech.person.name + '</div>\
          <div class="date">' + formatDate(speech.date) + '</div>\
          <div class="rating" style="width: ' + ((speech.score - minScore) / (maxScore - minScore) * 50 + 50) + '%"></div>\
        </a>\
      </li>'
    ));

    tabContents.push($(
      '<div role="tabpanel" class="tab-pane' + (index === 0 ? ' active' : '') + '" id="' + speech.speech_id + '_' + randomId + '">\
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
})
