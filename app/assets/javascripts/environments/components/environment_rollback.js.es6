/* global Vue */

window.Vue = require('vue');

(() => {
  window.gl = window.gl || {};
  window.gl.environmentsList = window.gl.environmentsList || {};

  gl.environmentsList.RollbackComponent = Vue.component('rollback-component', {
    props: {
      retryUrl: {
        type: String,
        default: '',
      },

      isLastDeployment: {
        type: Boolean,
        default: true,
      },
    },

    template: `
      <a class="btn" :href="retryUrl" data-method="post" rel="nofollow">
        <span v-if="isLastDeployment">
          重新部署
        </span>
        <span v-else>
          回滚
        </span>
      </a>
    `,
  });
})();
