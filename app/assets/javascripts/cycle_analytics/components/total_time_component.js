/* eslint-disable no-param-reassign */

import Vue from 'vue';

((global) => {
  global.cycleAnalytics = global.cycleAnalytics || {};

  global.cycleAnalytics.TotalTimeComponent = Vue.extend({
    props: {
      time: Object,
    },
    template: `
      <span class="total-time">
        <template v-if="Object.keys(time).length">
          <template v-if="time.days">{{ time.days }} <span>天</span></template>
          <template v-if="time.hours">{{ time.hours }} <span>小时</span></template>
          <template v-if="time.mins && !time.days">{{ time.mins }} <span>分钟</span></template>
          <template v-if="time.seconds && Object.keys(time).length === 1 || time.seconds === 0">{{ time.seconds }} <span>秒</span></template>
        </template>
        <template v-else>
          --
        </template>
      </span>
    `,
  });
})(window.gl || (window.gl = {}));
