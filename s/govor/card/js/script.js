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

function generateQuote() {

}

var cardElement = $('.card-govor');
var contentElement = cardElement.find('.card-content');
var speechTextElement = cardElement.find('.speech-text');
var quoteElement = cardElement.find('.quote-button');
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
  contentElement.toggleClass('closed');
  quoteElement.css({ display: 'none' });
})
