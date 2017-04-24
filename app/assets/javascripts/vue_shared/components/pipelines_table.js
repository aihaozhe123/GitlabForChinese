import PipelinesTableRowComponent from './pipelines_table_row';

/**
 * Pipelines Table Component.
 *
 * Given an array of objects, renders a table.
 */
export default {
  props: {
    pipelines: {
      type: Array,
      required: true,
      default: () => ([]),
    },

    service: {
      type: Object,
      required: true,
    },
  },

  components: {
    'pipelines-table-row-component': PipelinesTableRowComponent,
  },

  template: `
    <table class="table ci-table">
      <thead>
        <tr>
          <th class="js-pipeline-status pipeline-status">状态</th>
          <th class="js-pipeline-info pipeline-info">流水线</th>
          <th class="js-pipeline-commit pipeline-commit">提交</th>
          <th class="js-pipeline-stages pipeline-stages">阶段</th>
          <th class="js-pipeline-date pipeline-date"></th>
          <th class="js-pipeline-actions pipeline-actions"></th>
        </tr>
      </thead>
      <tbody>
        <template v-for="model in pipelines"
          v-bind:model="model">
          <tr is="pipelines-table-row-component"
            :pipeline="model"
            :service="service"></tr>
        </template>
      </tbody>
    </table>
  `,
};
