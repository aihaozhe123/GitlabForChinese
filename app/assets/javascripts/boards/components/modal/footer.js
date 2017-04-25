/* eslint-disable no-new */
/* global Flash */

import Vue from 'vue';

require('./lists_dropdown');

(() => {
  const ModalStore = gl.issueBoards.ModalStore;

  gl.issueBoards.ModalFooter = Vue.extend({
    mixins: [gl.issueBoards.ModalMixins],
    data() {
      return {
        modal: ModalStore.store,
        state: gl.issueBoards.BoardsStore.state,
      };
    },
    computed: {
      submitDisabled() {
        return !ModalStore.selectedCount();
      },
      submitText() {
        const count = ModalStore.selectedCount();

        return `添加 ${count} 个问题`;
      },
    },
    methods: {
      addIssues() {
        const list = this.modal.selectedList || this.state.lists[0];
        const selectedIssues = ModalStore.getSelectedIssues();
        const issueIds = selectedIssues.map(issue => issue.globalId);

        // Post the data to the backend
        gl.boardService.bulkUpdate(issueIds, {
          add_label_ids: [list.label.id],
        }).catch(() => {
          new Flash('无法更新问题，请重试。', 'alert');

          selectedIssues.forEach((issue) => {
            list.removeIssue(issue);
            list.issuesSize -= 1;
          });
        });

        // Add the issues on the frontend
        selectedIssues.forEach((issue) => {
          list.addIssue(issue);
          list.issuesSize += 1;
        });

        this.toggleModal(false);
      },
    },
    components: {
      'lists-dropdown': gl.issueBoards.ModalFooterListsDropdown,
    },
    template: `
      <footer
        class="form-actions add-issues-footer">
        <div class="pull-left">
          <button
            class="btn btn-success"
            type="button"
            :disabled="submitDisabled"
            @click="addIssues">
            {{ submitText }}
          </button>
          <span class="inline add-issues-footer-to-list">
            到列表
          </span>
          <lists-dropdown></lists-dropdown>
        </div>
        <button
          class="btn btn-default pull-right"
          type="button"
          @click="toggleModal(false)">
          取消
        </button>
      </footer>
    `,
  });
})();
