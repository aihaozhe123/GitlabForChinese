/*= require vue */
/* global Vue */

(() => {
  window.gl = window.gl || {};
  window.gl.environmentsList = window.gl.environmentsList || {};

  window.gl.environmentsList.RollbackComponent = Vue.component('rollback-component', {
    props: {
      retry_url: {
        type: String,
        default: '',
      },
      is_last_deployment: {
        type: Boolean,
        default: true,
      },
    },

    template: `
      <a class="btn" :href="retry_url" data-method="post" rel="nofollow">
        <span v-if="is_last_deployment">
          重新部署
        </span>
        <span v-else>
          回滚
        </span>
      </a>
    `,
  });
})();
