<!-- 首页冒泡 -->
<style rel="stylesheet/scss" lang="scss" >
.pro-crm-home-bubble {
  background: #ffffff;
  padding: 20px;
  .bubble-title {
    padding: 5px 0 10px 2px;
    color: #2f6bcf;
    font-size: 14px;
  }
  .bubble-text {
    position: relative;
    padding-right: 68px;

    .el-input input {
      height: 54px;
      line-height: 54px;
      font-size: 14px;
      padding: 0 15px;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    .el-button {
      position: absolute;
      right: 0;
      top: 0;
      padding: 20px;
      font-size: 14px;
      background: #2f6bcf;
      border: 0;
      color: #fff;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
  .bubble-tabs {
    margin-top: 10px;

    .tabs {
      height: 35px;
      line-height: 35px;
      font-size: 14px;
      .tab {
        color: grey;
        cursor: pointer;
        padding: 0 5px;
        position: relative;
      }
      .tab.active {
        color: #2f6bcf;
        background: #fff;
      }
      .tab.active::after {
        position: absolute;
        content: "";
        bottom: -10px;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: #2f6bcf;
      }
      .more {
        float: right;
        color: #2f6bcf;
        cursor: pointer;
      }
    }
  }
}
</style>
<template>
  <div class="pro-crm-home-bubble"
       v-loading="loadingRightBot">
    <div class="bubble-title">冒个泡吧亲</div>
    <!-- 发送冒泡 -->
    <div class="bubble-text">
      <el-input v-model="message"
                type="text"
                maxlength="60"
                placeholder="说你想说的(60字以内)..."
                show-word-limit
                clearable></el-input>
      <el-button plain
                 @click="sendMsg()">冒泡</el-button>
    </div>

    <div class="bubble-tabs">
      <!-- 冒泡标签 -->
      <div class="tabs">
        <span class="tab"
              :class="{active:activeTab == 'new'}"
              @click="setActiveTab('new')">最新冒泡</span>
        <span class="tab"
              :class="{active:activeTab == 'hot'}"
              @click="setActiveTab('hot')">最热冒泡</span>
        <span class="more"
              @click="moreMsg()">更多</span>
      </div>
      <!-- 冒泡数据 -->
      <bubble-list :style="{height:minHeight+'px'}"
                   auto-scroll
                   :page-size="20"
                   :type="activeTab"
                   ref="list"
                   @showInfo="showInfo"></bubble-list>
      <!-- 冒泡详情 -->
      <bubble-info ref="info"
                   :item="activeInfo"
                   :index="activeInfoIndex"></bubble-info>
      <!-- 冒泡更多 -->
      <bubble-more ref="more"
                   @showInfo="showInfo"></bubble-more>
    </div>
  </div>
</template>
<script>
import BubbleList from './bubble_list.vue';
import BubbleInfo from './bubble_info.vue';
import BubbleMore from './bubble_more.vue';


export default {
  name: 'bubble',
  components: {
    BubbleList,
    BubbleInfo,
    BubbleMore
  },
  data () {
    return {
      activeInfo: {},
      activeInfoIndex: 0,
      message: '',
      activeTab: '',
      minHeight: 612,
    }
  },
  mounted () {
    this.activeTab = 'new';
  },
  methods: {
    changeHeight: function (height) {
      var me = this;
      me.$refs.list.$el.style.height = (height > me.minHeight ? height : me.minHeight) + 'px';
    },
    sendMsg: function () {
      if (JE.isEmpty(this.message.trim())) {
        JE.msg("不可以发送空内容~");
        return;
      }
      if(this.message.length > 60){
        JE.msg("输入内容超过60字");
      }
      var obj = JE.ajax({
        url: '/je/portal/homePortal/sendBubbleMsg',
        params: { MPXX_XXNR: this.message }
      });
      if (obj.success) {
        JE.msg('冒泡成功~');
        this.message = '';
        var data = this.$refs.list.data;
        data.unshift(obj.obj);
        data.splice(data.length - 1, 1);
      }
    },
    setActiveTab: function (tab) {
      this.activeTab = tab;
    },
    moreMsg: function () {
      this.$refs.more.show();
    },
    refresh: function () {
      this.$refs.list.loadPage(1, this.activeTab);
      this.$refs.more && this.$refs.more.getList().loadPage();
    },
    showInfo: function (info, index) {
      this.$refs.info.show();
      this.activeInfo = info;
      this.activeInfoIndex = index;
    }
  }
}
</script>


