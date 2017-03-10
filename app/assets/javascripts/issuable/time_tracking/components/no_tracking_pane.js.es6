/* global Vue */
(() => {
  Vue.component('time-tracking-no-tracking-pane', {
    name: 'time-tracking-no-tracking-pane',
    template: `
      <div class='time-tracking-no-tracking-pane'>
        <span class='no-value'>没有评估或花费的时间</span>
      </div>
    `,
  });
})();
