<script>
  /* global Flash */
  import eventHub from '../eventhub';
  import DeployKeysService from '../service';
  import DeployKeysStore from '../store';
  import keysPanel from './keys_panel.vue';

  export default {
    data() {
      return {
        isLoading: false,
        store: new DeployKeysStore(),
      };
    },
    props: {
      endpoint: {
        type: String,
        required: true,
      },
    },
    computed: {
      hasKeys() {
        return Object.keys(this.keys).length;
      },
      keys() {
        return this.store.keys;
      },
    },
    components: {
      keysPanel,
    },
    methods: {
      fetchKeys() {
        this.isLoading = true;

        this.service.getKeys()
          .then((data) => {
            this.isLoading = false;
            this.store.keys = data;
          })
          .catch(() => new Flash('获取部署密钥失败'));
      },
      enableKey(deployKey) {
        this.service.enableKey(deployKey.id)
          .then(() => this.fetchKeys())
          .catch(() => new Flash('启用部署密钥失败'));
      },
      disableKey(deployKey) {
        // eslint-disable-next-line no-alert
        if (confirm('您确定要删除此部署密钥？')) {
          this.service.disableKey(deployKey.id)
            .then(() => this.fetchKeys())
            .catch(() => new Flash('删除部署密钥失败'));
        }
      },
    },
    created() {
      this.service = new DeployKeysService(this.endpoint);

      eventHub.$on('enable.key', this.enableKey);
      eventHub.$on('remove.key', this.disableKey);
      eventHub.$on('disable.key', this.disableKey);
    },
    mounted() {
      this.fetchKeys();
    },
    beforeDestroy() {
      eventHub.$off('enable.key', this.enableKey);
      eventHub.$off('remove.key', this.disableKey);
      eventHub.$off('disable.key', this.disableKey);
    },
  };
</script>

<template>
  <div class="col-lg-9 col-lg-offset-3 append-bottom-default deploy-keys">
    <div
      class="text-center"
      v-if="isLoading && !hasKeys">
      <i
        class="fa fa-spinner fa-spin fa-2x"
        aria-hidden="true"
        aria-label="正在载入部署密钥">
      </i>
    </div>
    <div v-else-if="hasKeys">
      <keys-panel
        title="为此项目启用部署密钥"
        :keys="keys.enabled_keys"
        :store="store" />
      <keys-panel
        title="从可访问的项目中部署密钥"
        :keys="keys.available_project_keys"
        :store="store" />
      <keys-panel
        v-if="keys.public_keys.length"
        title="公共部署密钥可用于任何项目"
        :keys="keys.public_keys"
        :store="store" />
    </div>
  </div>
</template>
