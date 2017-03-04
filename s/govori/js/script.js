/* global window document $ makeEmbedSwitch activateCopyButton addCardRippling */

(() => {
  // SELECTION QUOTING
  function getSelected() {
    if (window.getSelection) return window.getSelection();
    else if (document.getSelection) return document.getSelection();

    const selection = document.selection && document.selection.createRange();
    if (selection.text) return selection;
    return false;
  }

  function makeSpeechesEventful() {
    $('.speech-holder').not('.eventful').each((i, e) => {
      $(e).addClass('eventful');

      const cardElement = $(e);
      const speechTextElement = cardElement.find('.speech-text');
      const quoteElement = cardElement.find('.everything .quote-button');
      const speechId = cardElement.find('.myid').val();

      speechTextElement.on('mouseup', (event) => {
        event.preventDefault();

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
      quoteElement.on('mousedown', event => event.preventDefault());

      quoteElement.on('click', () => {
        const selectedText = quoteElement.data().text.trim();
        const allText = cardElement.find('.mywords').val();
        const startIndex = allText.indexOf(selectedText);
        const endIndex = startIndex + selectedText.length;
        const url = `https://analize.parlameter.si/v1/s/setQuote/${speechId}/${startIndex}/${endIndex}`;

        $.ajax({
          url,
          async: false,
          dataType: 'json',
          success: result => window.open(`https://glej.parlameter.si/s/citat/${result.id}?frame=true`),
        });
      });

      // QUOTE-FULL SPEECH TOGGLING
      cardElement.on('click', '.full-text-link', (event) => {
        event.preventDefault();
        cardElement.removeClass('just-quote');
      });
    });
  }

  makeSpeechesEventful();
  makeEmbedSwitch();
  activateCopyButton();
  addCardRippling();
})(/* SCRIPT_PARAMS */);
