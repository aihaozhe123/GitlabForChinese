/**
 * Render environments table.
 */
import EnvironmentTableRowComponent from './environment_item';

export default {
  components: {
    'environment-item': EnvironmentTableRowComponent,
  },

  props: {
    environments: {
      type: Array,
      required: true,
      default: () => ([]),
    },

    canReadEnvironment: {
      type: Boolean,
      required: false,
      default: false,
    },

    canCreateDeployment: {
      type: Boolean,
      required: false,
      default: false,
    },

    service: {
      type: Object,
      required: true,
    },

    isLoadingFolderContent: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  methods: {
    folderUrl(model) {
      return `${window.location.pathname}/folders/${model.folderName}`;
    },
  },

  template: `
    <table class="table ci-table">
      <thead>
        <tr>
          <th class="environments-name">环境</th>
          <th class="environments-deploy">最后部署</th>
          <th class="environments-build">作业</th>
          <th class="environments-commit">提交</th>
          <th class="environments-date">更新时间</th>
          <th class="environments-actions"></th>
        </tr>
      </thead>
      <tbody>
        <template v-for="model in environments"
          v-bind:model="model">
          <tr is="environment-item"
            :model="model"
            :can-create-deployment="canCreateDeployment"
            :can-read-environment="canReadEnvironment"
            :service="service"></tr>

          <template v-if="model.isFolder && model.isOpen && model.children && model.children.length > 0">
            <tr v-if="isLoadingFolderContent">
              <td colspan="6" class="text-center">
                <i class="fa fa-spin fa-spinner fa-2x" aria-hidden="true"/>
              </td>
            </tr>

            <template v-else>
              <tr is="environment-item"
                v-for="children in model.children"
                :model="children"
                :can-create-deployment="canCreateDeployment"
                :can-read-environment="canReadEnvironment"
                :service="service"></tr>

              <tr>
                <td colspan="6" class="text-center">
                  <a :href="folderUrl(model)" class="btn btn-default">
                    Show all
                  </a>
                </td>
              </tr>
            </template>
          </template>
        </template>
      </tbody>
    </table>
  `,
};
