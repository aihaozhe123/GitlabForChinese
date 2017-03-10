/* global Vue */
(() => {
  Vue.component('time-tracking-help-state', {
    name: 'time-tracking-help-state',
    props: ['docsUrl'],
    template: `
      <div class='time-tracking-help-state'>
        <div class='time-tracking-info'>
          <h4>使用斜杠命令跟踪时间</h4>
          <p>斜杠命令可以在问题描述和注释框中使用。</p>
          <p>
            <code>/estimate</code>
            将使用最新命令更新评估时间。
          </p>
          <p>
            <code>/spend</code>
            将更新花费的时间总和。
          </p>
          <a class='btn btn-default learn-more-button' :href='docsUrl'>学习更多</a>
        </div>
      </div>
    `,
  });
})();
