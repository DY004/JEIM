<template>
  <div class="page page__demoboard">
    <div class="page__content">
      <p class="alert">
        本页面为展板效果展示，仅展示前端页面的查询条件、模块区域、指标、图形等样式，未连接后台数据接口。您可以参考本页面，实现您的工作展板页面。
      </p>
      <headerbar @params="getParams"></headerbar>
      <div class="wrp tools clearBoth">
        <div
          v-for="(item, index) in toolList"
          :key="index"
          class="items left">
          <tool :data="item"></tool>
        </div>
      </div>
      <div class="wrp clearBoth">
        <div class="card statement left">
          <div class="card_title">人员请假、加班、出差统计</div>
          <div class="card_body">
            <statementcharts></statementcharts>
          </div>
        </div>
        <div class="card entry right">
          <div class="card_title">快捷入口</div>
          <div class="card_body">
            <entry></entry>
          </div>
        </div>
      </div>
      <div class="wrp">
        <distribution :currentUser="currentUser" :queryData="queryData"></distribution>
      </div>
    </div>
  </div>
</template>

<script>
import headerbar from './modules/headerBar';
import tool from './modules/tool';
import statementcharts from './modules/statement';
import entry from './modules/entry';
import distribution from './modules/distribution';

export default {
  name: "index",
  components: { headerbar, tool, statementcharts, entry, distribution },
  data() {
    return {
      toolList: [
        {
          color: 'rgb(21, 161, 163)',
          background: 'rgb(211, 241, 245)',
          value1: '2837',
          value2: '1837',
          icon: 'jeicon-sitemap-three',
          html: function (){
            return `<p><span class="count">${this.value1}</span> 项</p><p>总流程审批</p><p><span class="count">${this.value2}</span> 项</p><p>正在执行流程</p>`
          }
        },
        {
          color: 'rgb(119, 72, 246)',
          background: 'rgb(233, 224, 245)',
          value1: '1051',
          value2: '68.5',
          icon: 'jeicon-qjsq',
          html: function (){
            return `<p><span class="count">${this.value1}</span> 人天</p><p>本年度请假数</p><p><span class="count">${this.value2}</span> 人天</p><p>本月请假数</p>`
          }
        },
        {
          color: 'rgb(230, 132, 48)',
          background: 'rgb(233, 218, 216)',
          value1: '507.5',
          value2: '98.5',
          icon: 'jeicon-jbsq',
          html: function (){
            return `<p><span class="count">${this.value1}</span> 人天</p><p>本年度加班数</p><p><span class="count">${this.value2}</span> 人天</p><p>本月加班数</p>`
          }
        },
        {
          color: 'rgb(129, 178, 24)',
          background: 'rgb(222, 241, 236)',
          value1: '2837',
          value2: '1837',
          icon: 'jeicon-ccsq',
          html: function (){
            return `<p><span class="count">${this.value1}</span>  人天</p><p>本年度出差数</p><p><span class="count">${this.value2}</span> 人天</p><p>本月出差数</p>`
          }
        },
      ],
      currentUser: { ...JE.USER },
      user: JE.getCurrentUser(),
      queryData: {},
    }
  },
  created() {
    this.params = {
      userId: this.activeUser,
      start: 0,
      limit: this.pageSize,
    }
  },
  mounted() {
    this.currentUser = {
      id: this.user.userId,
      name: this.user.name || this.user.username,
      photo: this.user.photo
    }
  },
  methods: {
    getParams(params) {
      this.queryData = params;
    },
  },
};
</script>

<style lang="scss" scoped>
  .page__demoboard {
    background-color: #f0f2f5;
    font-size: 14px;
    height: 100%;
    position: relative;
    overflow-y: auto;
    .page__content {
      width: 1200px;
      margin: 0 auto;
      padding: 20px 0;
      min-height: 100%;
      .alert {
        background: rgb(246, 247, 221);
        padding: 10px 15px;
        font-size: 14px;
        color: #555555;
      }
      .wrp {
        margin-top: 15px;
      }
      .tools {
        .items {
          background: #ffffff;
          height: 165px;
          width: 288px;
          border-radius: 6px;
          &:not(:first-child) {
            margin-left: 16px;
          }
        }
      }
      .card {
        border-radius: 6px;
        background: #ffffff;
        .card_title {
          padding: 15px 20px;
          font-size: 14px;
          color: rgba(0,0,0,.678431);
        }
        .card_body {
          height: 320px;
        }
        &.statement {
          width: 591px;
        }
        &.entry {
          width: 591px;
        }
      }
    }
  }
</style>

<style lang="scss" scoped>
  .clearBoth {
    &:after {
      content: '';
      display: table;
      clear: both;
    }
    .left {
      float: left;
    }
    .right {
      float: right;
    }
  }
</style>
