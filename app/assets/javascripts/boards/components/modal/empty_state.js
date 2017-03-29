/* global Vue */
(() => {
  const ModalStore = gl.issueBoards.ModalStore;

  gl.issueBoards.ModalEmptyState = Vue.extend({
    mixins: [gl.issueBoards.ModalMixins],
    data() {
      return ModalStore.store;
    },
    props: {
      image: {
        type: String,
        required: true,
      },
      newIssuePath: {
        type: String,
        required: true,
      },
    },
    computed: {
      contents() {
        const obj = {
          title: '您尚未向项目添加任何问题',
          content: `
            问题可能是项目中需要讨论的错误、待办事项或功能请求。
            此外，问题是可搜索和可过滤的。
          `,
        };

        if (this.activeTab === 'selected') {
          obj.title = '您尚未选择任何问题';
          obj.content = `
            返回到 <strong>所有问题</strong> ，
            并选择一些问题添加到您的看板。
          `;
        }

        return obj;
      },
    },
    template: `
      <section class="empty-state">
        <div class="row">
          <div class="col-xs-12 col-sm-6 col-sm-push-6">
            <aside class="svg-content" v-html="image"></aside>
          </div>
          <div class="col-xs-12 col-sm-6 col-sm-pull-6">
            <div class="text-content">
              <h4>{{ contents.title }}</h4>
              <p v-html="contents.content"></p>
              <a
                :href="newIssuePath"
                class="btn btn-success btn-inverted"
                v-if="activeTab === 'all'">
                新问题
              </a>
              <button
                type="button"
                class="btn btn-default"
                @click="changeTab('all')"
                v-if="activeTab === 'selected'">
                所有问题
              </button>
            </div>
          </div>
        </div>
      </section>
    `,
  });
})();
