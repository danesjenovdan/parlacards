/* global progressbarTooltip makeEmbedSwitch activateCopyButton addCardRippling */

((randomId, className) => {
  new Vue({
    el: `#razrez-glasovanj-${randomId}`,
    mounted() {
      progressbarTooltip.init(className);

      makeEmbedSwitch();
      activateCopyButton();
      addCardRippling();
    },
  });
})(/* SCRIPT_PARAMS */);
