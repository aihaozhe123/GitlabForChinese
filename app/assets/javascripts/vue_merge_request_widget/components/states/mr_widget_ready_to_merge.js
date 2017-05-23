/* global Flash */

import successSvg from 'icons/_icon_status_success.svg';
import warningSvg from 'icons/_icon_status_warning.svg';
import simplePoll from '~/lib/utils/simple_poll';
import eventHub from '../../event_hub';

export default {
  name: 'MRWidgetReadyToMerge',
  props: {
    mr: { type: Object, required: true },
    service: { type: Object, required: true },
  },
  data() {
    return {
      removeSourceBranch: true,
      mergeWhenBuildSucceeds: false,
      useCommitMessageWithDescription: false,
      setToMergeWhenPipelineSucceeds: false,
      showCommitMessageEditor: false,
      isMakingRequest: false,
      isMergingImmediately: false,
      commitMessage: this.mr.commitMessage,
      successSvg,
      warningSvg,
    };
  },
  computed: {
    commitMessageLinkTitle() {
      const withDesc = 'Include description in commit message';
      const withoutDesc = "Don't include description in commit message";

      return this.useCommitMessageWithDescription ? withoutDesc : withDesc;
    },
    mergeButtonClass() {
      const defaultClass = 'btn btn-small btn-success accept-merge-request';
      const failedClass = `${defaultClass} btn-danger`;
      const inActionClass = `${defaultClass} btn-info`;
      const { pipeline, isPipelineActive, isPipelineFailed, hasCI, ciStatus } = this.mr;

      if (hasCI && !ciStatus) {
        return failedClass;
      } else if (!pipeline) {
        return defaultClass;
      } else if (isPipelineActive) {
        return inActionClass;
      } else if (isPipelineFailed) {
        return failedClass;
      }

      return defaultClass;
    },
    mergeButtonText() {
      if (this.isMergingImmediately) {
        return '合并进行中';
      } else if (this.mr.isPipelineActive) {
        return '当流水线成功后合并';
      }

      return '合并';
    },
    shouldShowMergeOptionsDropdown() {
      return this.mr.isPipelineActive && !this.mr.onlyAllowMergeIfPipelineSucceeds;
    },
    isMergeButtonDisabled() {
      const { commitMessage } = this;
      return Boolean(!commitMessage.length
        || !this.isMergeAllowed()
        || this.isMakingRequest
        || this.mr.preventMerge);
    },
    shouldShowSquashBeforeMerge() {
      const { commitsCount, enableSquashBeforeMerge } = this.mr;
      return enableSquashBeforeMerge && commitsCount > 1;
    },
  },
  methods: {
    isMergeAllowed() {
      return !(this.mr.onlyAllowMergeIfPipelineSucceeds && this.mr.isPipelineFailed);
    },
    updateCommitMessage() {
      const cmwd = this.mr.commitMessageWithDescription;
      this.useCommitMessageWithDescription = !this.useCommitMessageWithDescription;
      this.commitMessage = this.useCommitMessageWithDescription ? cmwd : this.mr.commitMessage;
    },
    toggleCommitMessageEditor() {
      this.showCommitMessageEditor = !this.showCommitMessageEditor;
    },
    handleMergeButtonClick(mergeWhenBuildSucceeds, mergeImmediately) {
      // TODO: Remove no-param-reassign
      if (mergeWhenBuildSucceeds === undefined) {
        mergeWhenBuildSucceeds = this.mr.isPipelineActive; // eslint-disable-line no-param-reassign
      } else if (mergeImmediately) {
        this.isMergingImmediately = true;
      }

      this.setToMergeWhenPipelineSucceeds = mergeWhenBuildSucceeds === true;

      const options = {
        sha: this.mr.sha,
        commit_message: this.commitMessage,
        merge_when_pipeline_succeeds: this.setToMergeWhenPipelineSucceeds,
        should_remove_source_branch: this.removeSourceBranch === true,
      };

      // Only truthy in EE extension of this component
      if (this.setAdditionalParams) {
        this.setAdditionalParams(options);
      }

      this.isMakingRequest = true;
      this.service.merge(options)
        .then(res => res.json())
        .then((res) => {
          const hasError = res.status === 'failed' || res.status === 'hook_validation_error';

          if (res.status === 'merge_when_pipeline_succeeds') {
            eventHub.$emit('MRWidgetUpdateRequested');
          } else if (res.status === 'success') {
            this.initiateMergePolling();
          } else if (hasError) {
            eventHub.$emit('FailedToMerge', res.merge_error);
          }
        })
        .catch(() => {
          this.isMakingRequest = false;
          new Flash('Something went wrong. Please try again.'); // eslint-disable-line
        });
    },
    initiateMergePolling() {
      simplePoll((continuePolling, stopPolling) => {
        this.handleMergePolling(continuePolling, stopPolling);
      });
    },
    handleMergePolling(continuePolling, stopPolling) {
      this.service.poll()
        .then(res => res.json())
        .then((res) => {
          if (res.state === 'merged') {
            // If state is merged we should update the widget and stop the polling
            eventHub.$emit('MRWidgetUpdateRequested');
            eventHub.$emit('FetchActionsContent');
            if (window.mergeRequest) {
              window.mergeRequest.updateStatusText('status-box-open', 'status-box-merged', '已合并');
              window.mergeRequest.decreaseCounter();
            }
            stopPolling();

            // If user checked remove source branch and we didn't remove the branch yet
            // we should start another polling for source branch remove process
            if (this.removeSourceBranch && res.source_branch_exists) {
              this.initiateRemoveSourceBranchPolling();
            }
          } else if (res.merge_error) {
            eventHub.$emit('FailedToMerge', res.merge_error);
            stopPolling();
          } else {
            // MR is not merged yet, continue polling until the state becomes 'merged'
            continuePolling();
          }
        })
        .catch(() => {
          new Flash('Something went wrong while merging this merge request. Please try again.'); // eslint-disable-line
        });
    },
    initiateRemoveSourceBranchPolling() {
      // We need to show source branch is being removed spinner in another component
      eventHub.$emit('SetBranchRemoveFlag', [true]);

      simplePoll((continuePolling, stopPolling) => {
        this.handleRemoveBranchPolling(continuePolling, stopPolling);
      });
    },
    handleRemoveBranchPolling(continuePolling, stopPolling) {
      this.service.poll()
        .then(res => res.json())
        .then((res) => {
          // If source branch exists then we should continue polling
          // because removing a source branch is a background task and takes time
          if (res.source_branch_exists) {
            continuePolling();
          } else {
            // Branch is removed. Update widget, stop polling and hide the spinner
            eventHub.$emit('MRWidgetUpdateRequested', () => {
              eventHub.$emit('SetBranchRemoveFlag', [false]);
            });
            stopPolling();
          }
        })
        .catch(() => {
          new Flash('Something went wrong while removing the source branch. Please try again.'); // eslint-disable-line
        });
    },
  },
  template: `
    <div class="mr-widget-body">
      <span class="btn-group">
        <button
          @click="handleMergeButtonClick()"
          :disabled="isMergeButtonDisabled"
          :class="mergeButtonClass"
          type="button">
          <i
            v-if="isMakingRequest"
            class="fa fa-spinner fa-spin"
            aria-hidden="true" />
          {{mergeButtonText}}
        </button>
        <button
          v-if="shouldShowMergeOptionsDropdown"
          :disabled="isMergeButtonDisabled"
          type="button"
          class="btn btn-small btn-info dropdown-toggle"
          data-toggle="dropdown">
          <i
            class="fa fa-caret-down"
            aria-hidden="true" />
          <span class="sr-only">
            选择合并时刻
          </span>
        </button>
        <ul
          v-if="shouldShowMergeOptionsDropdown"
          class="dropdown-menu dropdown-menu-right"
          role="menu">
          <li>
            <a
              @click.prevent="handleMergeButtonClick(true)"
              class="merge_when_pipeline_succeeds"
              href="#">
              <span
                v-html="successSvg"
                class="merge-opt-icon"
                aria-hidden="true"></span>
              <span class="merge-opt-title">当流水线成功时合并</span>
            </a>
          </li>
          <li>
            <a
              @click.prevent="handleMergeButtonClick(false, true)"
              class="accept-merge-request"
              href="#">
              <span
                v-html="warningSvg"
                class="merge-opt-icon"
                aria-hidden="true"></span>
              <span class="merge-opt-title">立刻合并</span>
            </a>
          </li>
        </ul>
      </span>
      <template v-if="isMergeAllowed()">
        <label class="spacing">
          <input
            v-model="removeSourceBranch"
            :disabled="isMergeButtonDisabled"
            type="checkbox"/> 删除源分支
        </label>

        <!-- Placeholder for EE extension of this component -->
        <squash-before-merge
          v-if="shouldShowSquashBeforeMerge"
          :mr="mr"
          :is-merge-button-disabled="isMergeButtonDisabled" />

        <button
          @click="toggleCommitMessageEditor"
          :disabled="isMergeButtonDisabled"
          class="btn btn-default btn-xs"
          type="button">
          修改提交信息
        </button>
        <div
          v-if="showCommitMessageEditor"
          class="prepend-top-default commit-message-editor">
          <div class="form-group clearfix">
            <label
              class="control-label"
              for="commit-message">
              提交信息
            </label>
            <div class="col-sm-10">
              <div class="commit-message-container">
                <div class="max-width-marker"></div>
                <textarea
                  v-model="commitMessage"
                  class="form-control js-commit-message"
                  required="required"
                  rows="14"
                  name="提交信息"></textarea>
              </div>
              <p class="hint">尝试保持第一行不超过52个字符，其它行不超过72个字符。</p>
              <div class="hint">
                <a
                  @click.prevent="updateCommitMessage"
                  href="#">{{commitMessageLinkTitle}}</a>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <span class="bold">
          此合并请求的流水线已失败。 请重试该作业或推送一个新的提交来修复失败。
        </span>
      </template>
    </div>
  `,
};
