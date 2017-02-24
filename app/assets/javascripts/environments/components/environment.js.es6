/* eslint-disable no-param-reassign, no-new */
/* global Vue */
/* global EnvironmentsService */
/* global Flash */

window.Vue = require('vue');
window.Vue.use(require('vue-resource'));
require('../services/environments_service');
require('./environment_item');

(() => {
  window.gl = window.gl || {};

  gl.environmentsList.EnvironmentsComponent = Vue.component('environment-component', {
    props: {
      store: {
        type: Object,
        required: true,
        default: () => ({}),
      },
    },

    components: {
      'environment-item': gl.environmentsList.EnvironmentItem,
    },

    data() {
      const environmentsData = document.querySelector('#environments-list-view').dataset;

      return {
        state: this.store.state,
        visibility: 'available',
        isLoading: false,
        cssContainerClass: environmentsData.cssClass,
        endpoint: environmentsData.environmentsDataEndpoint,
        canCreateDeployment: environmentsData.canCreateDeployment,
        canReadEnvironment: environmentsData.canReadEnvironment,
        canCreateEnvironment: environmentsData.canCreateEnvironment,
        projectEnvironmentsPath: environmentsData.projectEnvironmentsPath,
        projectStoppedEnvironmentsPath: environmentsData.projectStoppedEnvironmentsPath,
        newEnvironmentPath: environmentsData.newEnvironmentPath,
        helpPagePath: environmentsData.helpPagePath,
        commitIconSvg: environmentsData.commitIconSvg,
        playIconSvg: environmentsData.playIconSvg,
        terminalIconSvg: environmentsData.terminalIconSvg,
      };
    },

    computed: {
      scope() {
        return this.$options.getQueryParameter('scope');
      },

      canReadEnvironmentParsed() {
        return this.$options.convertPermissionToBoolean(this.canReadEnvironment);
      },

      canCreateDeploymentParsed() {
        return this.$options.convertPermissionToBoolean(this.canCreateDeployment);
      },

      canCreateEnvironmentParsed() {
        return this.$options.convertPermissionToBoolean(this.canCreateEnvironment);
      },
    },

    /**
     * Fetches all the environments and stores them.
     * Toggles loading property.
     */
    created() {
      gl.environmentsService = new EnvironmentsService(this.endpoint);

      const scope = this.$options.getQueryParameter('scope');
      if (scope) {
        this.store.storeVisibility(scope);
      }

      this.isLoading = true;

      return gl.environmentsService.all()
        .then(resp => resp.json())
        .then((json) => {
          this.store.storeEnvironments(json);
          this.isLoading = false;
        })
        .catch(() => {
          this.isLoading = false;
          new Flash('An error occurred while fetching the environments.', 'alert');
        });
    },

    /**
     * Transforms the url parameter into an object and
     * returns the one requested.
     *
     * @param  {String} param
     * @returns {String}       The value of the requested parameter.
     */
    getQueryParameter(parameter) {
      return window.location.search.substring(1).split('&').reduce((acc, param) => {
        const paramSplited = param.split('=');
        acc[paramSplited[0]] = paramSplited[1];
        return acc;
      }, {})[parameter];
    },

    /**
     * Converts permission provided as strings to booleans.
     * @param  {String} string
     * @returns {Boolean}
     */
    convertPermissionToBoolean(string) {
      return string === 'true';
    },

    methods: {
      toggleRow(model) {
        return this.store.toggleFolder(model.name);
      },
    },

    template: `
      <div :class="cssContainerClass">
        <div class="top-area">
          <ul v-if="!isLoading" class="nav-links">
            <li v-bind:class="{ 'active': scope === undefined }">
              <a :href="projectEnvironmentsPath">
                活动的
                <span class="badge js-available-environments-count">
                  {{state.availableCounter}}
                </span>
              </a>
            </li><li v-bind:class="{ 'active' : scope === 'stopped' }">
              <a :href="projectStoppedEnvironmentsPath">
                停止的
                <span class="badge js-stopped-environments-count">
                  {{state.stoppedCounter}}
                </span>
              </a>
            </li>
          </ul>
          <div v-if="canCreateEnvironmentParsed && !isLoading" class="nav-controls">
            <a :href="newEnvironmentPath" class="btn btn-create">
              新环境
            </a>
          </div>
        </div>

        <div class="environments-container">
          <div class="environments-list-loading text-center" v-if="isLoading">
            <i class="fa fa-spinner fa-spin"></i>
          </div>

          <div class="blank-state blank-state-no-icon"
            v-if="!isLoading && state.environments.length === 0">
            <h2 class="blank-state-title js-blank-state-title">
              您现在没有任何环境。
            </h2>
            <p class="blank-state-text">
              环境是部署代码的地方，例如暂存或生产。
              <br />
              <a :href="helpPagePath">
                阅读更多关于环境
              </a>
            </p>

            <a
              v-if="canCreateEnvironmentParsed"
              :href="newEnvironmentPath"
              class="btn btn-create js-new-environment-button">
              新环境
            </a>
          </div>

          <div class="table-holder"
            v-if="!isLoading && state.filteredEnvironments.length > 0">
            <table class="table ci-table environments">
              <thead>
                <tr>
                  <th class="environments-name">环境</th>
                  <th class="environments-deploy">最后部署</th>
                  <th class="environments-build">作业</th>
                  <th class="environments-commit">提交</th>
                  <th class="environments-date">更新时间</th>
                  <th class="hidden-xs environments-actions"></th>
                </tr>
              </thead>
              <tbody>
                <template v-for="model in state.filteredEnvironments"
                  v-bind:model="model">

                  <tr
                    is="environment-item"
                    :model="model"
                    :toggleRow="toggleRow.bind(model)"
                    :can-create-deployment="canCreateDeploymentParsed"
                    :can-read-environment="canReadEnvironmentParsed"
                    :play-icon-svg="playIconSvg"
                    :terminal-icon-svg="terminalIconSvg"
                    :commit-icon-svg="commitIconSvg"></tr>

                  <tr v-if="model.isOpen && model.children && model.children.length > 0"
                    is="environment-item"
                    v-for="children in model.children"
                    :model="children"
                    :toggleRow="toggleRow.bind(children)"
                    :can-create-deployment="canCreateDeploymentParsed"
                    :can-read-environment="canReadEnvironmentParsed"
                    :play-icon-svg="playIconSvg"
                    :terminal-icon-svg="terminalIconSvg"
                    :commit-icon-svg="commitIconSvg">
                    </tr>

                </template>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `,
  });
})();
