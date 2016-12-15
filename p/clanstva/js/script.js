/* global makeEmbedSwitch activateCopyButton addCardRippling */

((randomId) => {
  new Vue({ el: `#clanstva-${randomId}` });

  makeEmbedSwitch();
  activateCopyButton();
  addCardRippling();
})(/* SCRIPT_PARAMS */);
