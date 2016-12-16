/* global progressbarTooltip makeEmbedSwitch activateCopyButton addCardRippling */

((randomId, className) => {
  new Vue({ el: `#${className}-${randomId}` });

  progressbarTooltip.init(className);

  makeEmbedSwitch();
  activateCopyButton();
  addCardRippling();
})(/* SCRIPT_PARAMS */);
