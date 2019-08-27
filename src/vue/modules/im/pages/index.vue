<!--
 * @Author: Qinyonglian
 * @Date: 2019-08-13 13:58:42
 * @LastEditors: Qinyonglian
 * @LastEditTime: 2019-08-26 10:25:03
 -->
<style rel="stylesheet/scss" lang="scss" scoped>
@import "./../styles/common.scss";
@import "./../styles/index.scss";
</style>
<template>
  <div class="im-content">
    <!--捷信-->
    <div
      v-if="imShow"
      @click="clickGitZo"
      class="im-text"
    >
      <i class="jeicon jeicon-message" />
      <span>捷信</span>
      <span
        v-if="unreadmsg > 0"
        class="msg-num"
      >( {{ unreadmsg }} )</span>
    </div>
    <!-- 点击捷信之后的弹窗 -->
    <div
      v-show="!imShow"
      :class="[!fullStyle ? 'full-max' : '']"
      class="im-dialog"
    >
      <div class="left-view">
        <left-view />
      </div>
      <div class="right-view">
        <i
          @click="chatShowPage(false)"
          class="jeicon jeicon-error"
        />
        <chat-edit v-show="chatShow" />
        <info-board v-show="infoShow" />
        <!--暂无数据-->
        <div
          v-if="defaultShow"
          class="list-no-outer"
        >
          <div class="list-no-data">
            <i class="jeicon jeicon-Page" />
            <p>暂无数据</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import LeftView from './leftView/index';
import ChatEdit from './rightView/chat-edit';
import InfoBoard from './rightView/info-board';
import Dialog from '../controller/Dialog';
import { EventBus } from '../common/eventBus';
import { EVENT_TYPE, CHAT_TYPE } from '../common/params';

import User from '../controller/User';

// eslint-disable-next-line no-new
new User(window._im_option_.userId);
// 全局函数
window._je_im_onmessage_ = function (message) {
  EventBus.$emit(EVENT_TYPE.ON_MESSAGE, message);
};

export default {
  name: 'Index',
  components: {
    LeftView, ChatEdit, InfoBoard,
  },
  props: {},
  data() {
    return {
      imShow: true,
      defaultShow: false, // 没有列表则显示暂无数据
      chatShow: false, // 如果有聊天数据的时候则显示聊天编辑
      infoShow: false, // 点击组织树树要显示的内容
      fullStyle: true, // 全屏与非全屏样式,
      dialog: new Dialog(),
      unreadmsg: null,
    };
  },
  computed: {
    options() {
      return window._im_option_ || {};
    },
    userId() {
      return this.options.userId || '';
    },
  },
  mounted() {
    this.getUnreadMsgs();
    // 处理展示右侧页面数据；右侧的数据有三种情况，1是聊天的界面，2是组织树的页面，3暂无数据显示
    // 打开的是聊天的页面
    EventBus.$on(EVENT_TYPE.OPEN_CHAT, (target) => {
      // 这里需要判断是群组还是个人聊天
      if (target.type === CHAT_TYPE.SINGLE || target.type === CHAT_TYPE.GROUP) {
        this.defaultShow = false;
        this.infoShow = false;
        this.chatShow = true;
      }
    });
    // 无数据显示默认提示
    EventBus.$on(EVENT_TYPE.LISTENLIST, () => {
      // 这里需要判断是群组还是个人聊天
      this.defaultShow = true;
      this.infoShow = false;
      this.chatShow = false;
    });
    // 打开的是组织树的页面
    EventBus.$on(EVENT_TYPE.NOW_OBJ, (target) => {
      if (target) {
        this.defaultShow = false;
        this.infoShow = true;
        this.chatShow = false;
      }
    });
    // 监听 右侧信息面板的关闭按钮事件
    EventBus.$on(EVENT_TYPE.HANDLEBACK, () => {
      this.defaultShow = false;
      this.infoShow = false;
      this.chatShow = true;
    });

    // 全屏与非全屏
    EventBus.$on(EVENT_TYPE.FULL_SCREEN, (target) => {
      setTimeout(() => {
        this.fullStyle = target;
      });
    });

    // 新消息数量
    EventBus.$on(EVENT_TYPE.ON_MESSAGE, (message) => {
      if (message.type === CHAT_TYPE.SINGLE || message.type === CHAT_TYPE.GROUP) {
        this.unreadmsg = this.dialog.getMessageUnRead();
      }
    });
  },
  beforeDestroy() {
    EventBus.$off(EVENT_TYPE.FULL_SCREEN);
    EventBus.$off(EVENT_TYPE.HANDLEBACK);
    EventBus.$off(EVENT_TYPE.NOW_OBJ);
    EventBus.$off(EVENT_TYPE.LISTENLIST);
    EventBus.$off(EVENT_TYPE.OPEN_CHAT);
  },

  methods: {
    // 点击关闭
    clickGitZo() {
      this.imShow = false;
      // 这边就用到了eventBus;将this.imShow传过去；为了保证是在点击的时候掉的接口
      EventBus.$emit(EVENT_TYPE.WINDOW_STATUS, this.imShow);
    },
    // 展示聊天窗体  更新角标
    chatShowPage(showType) {
      !showType && (this.imShow = true);
      const dialogId = window.sessionStorage.getItem('chat-dialog-id');
      this.dialog.getReadNums(this.userId, dialogId, '2');
      this.getUnreadMsgs();
    },
    // 获取未读消息 角标
    async getUnreadMsgs() {
      // 这边的时候掉目前打开的是那个窗口，
      this.unreadmsg = await this.dialog.getUnReadNum(this.userId);
    },
  },
};
</script>
