/* global Vue, gl */
/* eslint-disable no-param-reassign */

((gl) => {
  gl.VuePipelineUrl = Vue.extend({
    props: [
      'pipeline',
    ],
    computed: {
      user() {
        return !!this.pipeline.user;
      },
    },
    template: `
      <td>
        <a :href='pipeline.path'>
          <span class="pipeline-id">#{{pipeline.id}}</span>
        </a>
        <span>by</span>
        <a
          v-if='user'
          :href='pipeline.user.web_url'
        >
          <img
            v-if='user'
            class="avatar has-tooltip s20 "
            :title='pipeline.user.name'
            data-container="body"
            :src='pipeline.user.avatar_url'
          >
        </a>
        <span
          v-if='!user'
          class="api monospace"
        >
          API
        </span>
        <span
          v-if='pipeline.flags.latest'
          class="label label-success has-tooltip"
          title="这是该分支最新的管道"
          data-original-title="这是该分支最新的管道"
        >
          最新
        </span>
        <span
          v-if='pipeline.flags.yaml_errors'
          class="label label-danger has-tooltip"
          :title='pipeline.yaml_errors'
          :data-original-title='pipeline.yaml_errors'
        >
          yaml 无效
        </span>
        <span
          v-if='pipeline.flags.stuck'
          class="label label-warning"
        >
          等待
        </span>
      </td>
    `,
  });
})(window.gl || (window.gl = {}));
