/* eslint-disable no-param-reassign */

require('../lib/utils/text_utility');
const DEFAULT_EVENT_OBJECTS = require('./default_event_objects');

((global) => {
  global.cycleAnalytics = global.cycleAnalytics || {};

  const EMPTY_STAGE_TEXTS = {
    issue: '问题阶段显示从创建问题到将问题分配到里程碑所需的时间，或将问题添加到问题板上的列表中。开始创建问题以查看此阶段的数据。',
    plan: '计划阶段显示从上一步到推送第一个提交的时间。一旦你第一次提交，这个时间将被自动添加。',
    code: '编码阶段显示从第一次提交到创建合并请求的时间。创建第一个合并请求后，数据将自动添加到此处。',
    test: '测试阶段显示GitLab CI为相关合并请求运行每个管道所花费的时间。在第一个管道运行完成后，数据将自动添加。',
    review: '审查阶段显示从创建合并请求到合并请求的时间。在您合并第一个合并请求后，将自动添加数据。',
    staging: '暂存阶段显示将MR和部署代码合并到生产环境之间的时间。首次部署到生产时，将自动添加数据。',
    production: '生产阶段显示了创建问题和将代码部署到生产之间所需的总时间。一旦你完成了完整的想法到生产周期，数据将被自动添加。',
  };

  global.cycleAnalytics.CycleAnalyticsStore = {
    state: {
      summary: '',
      stats: '',
      analytics: '',
      events: [],
      stages: [],
    },
    setCycleAnalyticsData(data) {
      this.state = Object.assign(this.state, this.decorateData(data));
    },
    decorateData(data) {
      const newData = {};

      newData.stages = data.stats || [];
      newData.summary = data.summary || [];

      newData.summary.forEach((item) => {
        item.value = item.value || '-';
      });

      newData.stages.forEach((item) => {
        const stageSlug = gl.text.dasherize(item.title.toLowerCase());
        item.active = false;
        item.isUserAllowed = data.permissions[stageSlug];
        item.emptyStageText = EMPTY_STAGE_TEXTS[stageSlug];
        item.component = `stage-${stageSlug}-component`;
        item.slug = stageSlug;
      });
      newData.analytics = data;
      return newData;
    },
    setLoadingState(state) {
      this.state.isLoading = state;
    },
    setErrorState(state) {
      this.state.hasError = state;
    },
    deactivateAllStages() {
      this.state.stages.forEach((stage) => {
        stage.active = false;
      });
    },
    setActiveStage(stage) {
      this.deactivateAllStages();
      stage.active = true;
    },
    setStageEvents(events, stage) {
      this.state.events = this.decorateEvents(events, stage);
    },
    decorateEvents(events, stage) {
      const newEvents = [];

      events.forEach((item) => {
        if (!item) return;

        const eventItem = Object.assign({}, DEFAULT_EVENT_OBJECTS[stage.slug], item);

        eventItem.totalTime = eventItem.total_time;

        if (eventItem.author) {
          eventItem.author.webUrl = eventItem.author.web_url;
          eventItem.author.avatarUrl = eventItem.author.avatar_url;
        }

        if (eventItem.created_at) eventItem.createdAt = eventItem.created_at;
        if (eventItem.short_sha) eventItem.shortSha = eventItem.short_sha;
        if (eventItem.commit_url) eventItem.commitUrl = eventItem.commit_url;

        delete eventItem.author.web_url;
        delete eventItem.author.avatar_url;
        delete eventItem.total_time;
        delete eventItem.created_at;
        delete eventItem.short_sha;
        delete eventItem.commit_url;

        newEvents.push(eventItem);
      });

      return newEvents;
    },
    currentActiveStage() {
      return this.state.stages.find(stage => stage.active);
    },
  };
})(window.gl || (window.gl = {}));
